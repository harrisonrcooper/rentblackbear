"use server";

// Plaid integration — server actions only.
//
// All operations are auth-gated through Clerk + the budget allow-list.
// Access tokens are stored inside `BudgetState.plaid_items[].access_token`
// and never returned to the client (see `stripPlaidSecrets`). All
// transaction sync goes through Plaid's /transactions/sync cursor API
// so we can resume from the last position on every poll / webhook.
//
//   createPlaidLinkToken      — generate a one-shot Link token for the UI
//   exchangePlaidPublicToken  — finish Link, persist Item + accounts
//   syncPlaidTransactions     — pull new + modified + removed transactions
//   refreshPlaidBalances      — refresh /accounts/balance/get for one Item
//   disconnectPlaidItem       — /item/remove + drop from state
//   importPlaidTransaction    — accept inbox entry → monthly_actuals
//   dismissPlaidTransaction   — drop inbox entry, never auto-imported again
//   undoPlaidTransaction      — undo a previously imported actual

import { auth } from "@clerk/nextjs/server";
import { CountryCode, Products } from "plaid";
import type { Transaction } from "plaid";

import {
  loadBudgetState,
  saveBudgetState as persist,
} from "./_writer";
import type {
  BudgetPlaidAccount,
  BudgetPlaidItem,
  BudgetPlaidTransaction,
  BudgetState,
} from "./_writer";
// stripPlaidSecrets is consumed by state.ts (also "use server"). Server
// actions can only export async functions, so the helper lives in the
// non-server writer module rather than re-exported here.
import {
  getPlaidClient,
  plaidAmountToCents,
  plaidConfigured,
  plaidRedirectUri,
  plaidWebhookUrl,
} from "@/lib/plaid-server";
import { predictCategory } from "@/app/admin/budget/lib/predict";

// ── auth helpers (mirrors state.ts) ──────────────────────────────────

function allowedOwnerIds(): string[] {
  const multi = process.env.BUDGET_OWNER_USER_IDS;
  const single = process.env.BUDGET_OWNER_USER_ID;
  return (multi || single || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function workspaceKey(userId: string): string {
  const list = allowedOwnerIds();
  if (list.length > 1) return list[0];
  return userId;
}

class GateError extends Error {}

async function gate(): Promise<{ userId: string; workspaceKey: string }> {
  const { userId } = await auth();
  if (!userId) throw new GateError("Not authenticated.");
  const list = allowedOwnerIds();
  if (list.length > 0 && !list.includes(userId)) {
    throw new GateError("Not authorized.");
  }
  if (!plaidConfigured()) {
    throw new GateError("Plaid not configured. Set PLAID_CLIENT_ID and PLAID_SECRET in .env.local.");
  }
  return { userId, workspaceKey: workspaceKey(userId) };
}

function genId(): string {
  return `${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 9)}`;
}

function todayIso(): string {
  return new Date().toISOString();
}

// ── createPlaidLinkToken ─────────────────────────────────────────────

export async function createPlaidLinkToken(): Promise<
  | { ok: true; link_token: string; expiration: string }
  | { ok: false; message: string }
> {
  try {
    const g = await gate();
    const client = getPlaidClient();
    const res = await client.linkTokenCreate({
      user: { client_user_id: g.userId },
      client_name: "rentblackbear",
      products: [Products.Transactions],
      country_codes: [CountryCode.Us],
      language: "en",
      webhook: plaidWebhookUrl(),
      redirect_uri: plaidRedirectUri(),
    });
    return {
      ok: true,
      link_token: res.data.link_token,
      expiration: res.data.expiration,
    };
  } catch (e: unknown) {
    return { ok: false, message: errorMessage(e) };
  }
}

// ── exchangePlaidPublicToken ─────────────────────────────────────────

export async function exchangePlaidPublicToken(
  publicToken: string,
  metadata: {
    institution_id?: string | null;
    institution_name?: string;
    accounts?: Array<{ id: string; name: string; mask?: string | null; type?: string; subtype?: string | null }>;
  },
): Promise<{ ok: true; item_id: string } | { ok: false; message: string }> {
  try {
    const g = await gate();
    const client = getPlaidClient();
    const exch = await client.itemPublicTokenExchange({ public_token: publicToken });
    const accessToken = exch.data.access_token;
    const plaidItemId = exch.data.item_id;

    // Fetch authoritative account list + balances so we can show the
    // user real names + masks immediately.
    let accounts: BudgetPlaidAccount[] = [];
    try {
      const balRes = await client.accountsBalanceGet({ access_token: accessToken });
      accounts = balRes.data.accounts.map((a) => ({
        plaid_account_id: a.account_id,
        mask: a.mask ?? null,
        name: a.name,
        official_name: a.official_name ?? null,
        type: String(a.type),
        subtype: a.subtype ? String(a.subtype) : null,
        current_balance_cents: a.balances.current != null ? Math.round(a.balances.current * 100) : null,
        available_balance_cents: a.balances.available != null ? Math.round(a.balances.available * 100) : null,
      }));
    } catch {
      // Fall back to Link metadata if balances aren't available yet.
      accounts = (metadata.accounts || []).map((a) => ({
        plaid_account_id: a.id,
        mask: a.mask ?? null,
        name: a.name,
        official_name: null,
        type: String(a.type || ""),
        subtype: a.subtype ?? null,
        current_balance_cents: null,
        available_balance_cents: null,
      }));
    }

    const state = await loadBudgetState(g.workspaceKey);
    const items = state.plaid_items || [];

    const item: BudgetPlaidItem = {
      id: genId(),
      plaid_item_id: plaidItemId,
      access_token: accessToken,
      institution_id: metadata.institution_id ?? null,
      institution_name: metadata.institution_name || "Bank",
      accounts,
      cursor: null,
      last_synced_at: null,
      connected_at: todayIso(),
    };

    const updated: BudgetState = {
      ...state,
      plaid_items: [...items, item],
    };
    await persist(g.workspaceKey, updated, g.userId);

    // First sync immediately so the user sees transactions land within
    // a couple seconds of finishing Link.
    void syncPlaidTransactions(item.id).catch(() => undefined);

    return { ok: true, item_id: item.id };
  } catch (e: unknown) {
    return { ok: false, message: errorMessage(e) };
  }
}

// ── syncPlaidTransactions ────────────────────────────────────────────

export async function syncPlaidTransactions(
  localItemId?: string,
): Promise<
  | { ok: true; added: number; modified: number; removed: number }
  | { ok: false; message: string }
> {
  try {
    const g = await gate();
    const client = getPlaidClient();
    const state = await loadBudgetState(g.workspaceKey);
    const items = state.plaid_items || [];
    const targets = localItemId ? items.filter((i) => i.id === localItemId) : items;
    if (targets.length === 0) return { ok: true, added: 0, modified: 0, removed: 0 };

    const knownCategories = (state.categories || []).map((c) => c.label);
    const txnsByPlaidId = new Map<string, BudgetPlaidTransaction>(
      (state.plaid_transactions || []).map((t) => [t.plaid_txn_id, t]),
    );

    let totalAdded = 0;
    let totalModified = 0;
    let totalRemoved = 0;

    const updatedItems = await Promise.all(items.map(async (item) => {
      if (!targets.find((t) => t.id === item.id)) return item;

      let cursor = item.cursor || undefined;
      let hasMore = true;
      const added: Transaction[] = [];
      const modified: Transaction[] = [];
      const removedIds: string[] = [];

      while (hasMore) {
        const res = await client.transactionsSync({
          access_token: item.access_token,
          cursor,
          count: 500,
        });
        added.push(...res.data.added);
        modified.push(...res.data.modified);
        removedIds.push(...res.data.removed.map((r) => r.transaction_id).filter(Boolean) as string[]);
        cursor = res.data.next_cursor;
        hasMore = res.data.has_more;
      }

      const accountNameById = new Map(item.accounts.map((a) => [a.plaid_account_id, a.name]));

      const upsert = (txn: Transaction) => {
        const existing = txnsByPlaidId.get(txn.transaction_id);
        const predicted = predictCategory(
          txn.merchant_name || txn.name || "",
          knownCategories,
        );
        const row: BudgetPlaidTransaction = {
          id: existing?.id || genId(),
          plaid_txn_id: txn.transaction_id,
          plaid_item_id: item.id,
          plaid_account_id: txn.account_id,
          account_name: accountNameById.get(txn.account_id),
          date: txn.date,
          authorized_date: txn.authorized_date || null,
          amount_cents: plaidAmountToCents(txn.amount),
          merchant_name: txn.merchant_name || null,
          name: txn.name,
          pending: Boolean(txn.pending),
          plaid_category_primary: txn.personal_finance_category?.primary || null,
          plaid_category_detailed: txn.personal_finance_category?.detailed || null,
          predicted_category_label: existing?.predicted_category_label ?? predicted ?? null,
          imported_at: existing?.imported_at ?? null,
          imported_actual_id: existing?.imported_actual_id ?? null,
          dismissed_at: existing?.dismissed_at ?? null,
        };
        txnsByPlaidId.set(txn.transaction_id, row);
      };

      added.forEach(upsert);
      modified.forEach(upsert);
      for (const removedId of removedIds) txnsByPlaidId.delete(removedId);

      totalAdded += added.length;
      totalModified += modified.length;
      totalRemoved += removedIds.length;

      return { ...item, cursor: cursor || null, last_synced_at: todayIso() };
    }));

    const merged: BudgetState = {
      ...state,
      plaid_items: updatedItems,
      plaid_transactions: Array.from(txnsByPlaidId.values()).sort(
        (a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0),
      ),
    };
    await persist(g.workspaceKey, merged, g.userId);

    return { ok: true, added: totalAdded, modified: totalModified, removed: totalRemoved };
  } catch (e: unknown) {
    return { ok: false, message: errorMessage(e) };
  }
}

// ── refreshPlaidBalances ─────────────────────────────────────────────

export async function refreshPlaidBalances(
  localItemId: string,
): Promise<{ ok: true } | { ok: false; message: string }> {
  try {
    const g = await gate();
    const client = getPlaidClient();
    const state = await loadBudgetState(g.workspaceKey);
    const item = (state.plaid_items || []).find((i) => i.id === localItemId);
    if (!item) return { ok: false, message: "Item not found." };

    const res = await client.accountsBalanceGet({ access_token: item.access_token });
    const accounts: BudgetPlaidAccount[] = res.data.accounts.map((a) => ({
      plaid_account_id: a.account_id,
      mask: a.mask ?? null,
      name: a.name,
      official_name: a.official_name ?? null,
      type: String(a.type),
      subtype: a.subtype ? String(a.subtype) : null,
      current_balance_cents: a.balances.current != null ? Math.round(a.balances.current * 100) : null,
      available_balance_cents: a.balances.available != null ? Math.round(a.balances.available * 100) : null,
    }));

    const updated: BudgetState = {
      ...state,
      plaid_items: (state.plaid_items || []).map((i) =>
        i.id === localItemId ? { ...i, accounts } : i,
      ),
    };
    await persist(g.workspaceKey, updated, g.userId);
    return { ok: true };
  } catch (e: unknown) {
    return { ok: false, message: errorMessage(e) };
  }
}

// ── disconnectPlaidItem ──────────────────────────────────────────────

export async function disconnectPlaidItem(
  localItemId: string,
): Promise<{ ok: true } | { ok: false; message: string }> {
  try {
    const g = await gate();
    const state = await loadBudgetState(g.workspaceKey);
    const item = (state.plaid_items || []).find((i) => i.id === localItemId);
    if (!item) return { ok: false, message: "Item not found." };

    try {
      const client = getPlaidClient();
      await client.itemRemove({ access_token: item.access_token });
    } catch {
      // Plaid-side failure shouldn't block local removal — the user
      // can revoke from Plaid's portal if needed.
    }

    const updated: BudgetState = {
      ...state,
      plaid_items: (state.plaid_items || []).filter((i) => i.id !== localItemId),
      // Keep historical transactions but mark them orphaned by clearing
      // plaid_item_id so future syncs don't try to reconcile them.
      plaid_transactions: (state.plaid_transactions || []).map((t) =>
        t.plaid_item_id === localItemId ? { ...t, plaid_item_id: "" } : t,
      ),
    };
    await persist(g.workspaceKey, updated, g.userId);
    return { ok: true };
  } catch (e: unknown) {
    return { ok: false, message: errorMessage(e) };
  }
}

// ── importPlaidTransaction → monthly_actuals ─────────────────────────

export async function importPlaidTransaction(
  plaidTxnId: string,
  categoryLabel: string,
  note?: string,
): Promise<{ ok: true; actual_id: string } | { ok: false; message: string }> {
  try {
    const g = await gate();
    const state = await loadBudgetState(g.workspaceKey);
    const txn = (state.plaid_transactions || []).find((t) => t.plaid_txn_id === plaidTxnId);
    if (!txn) return { ok: false, message: "Transaction not found." };
    if (txn.imported_at) return { ok: false, message: "Already imported." };

    // Only outflows become expenses. Plaid uses positive = money out;
    // a negative amount is a credit / refund and gets imported as a
    // negative cent value (reduces the envelope's monthly spend).
    const actualId = genId();
    const monthStart = `${txn.date.slice(0, 7)}-01`;
    const newActual = {
      id: actualId,
      category_label: categoryLabel,
      month: monthStart,
      paid_on: txn.date,
      amount_cents: txn.amount_cents,
      note: note || txn.merchant_name || txn.name,
    };

    const updated: BudgetState = {
      ...state,
      monthly_actuals: [...(state.monthly_actuals || []), newActual],
      plaid_transactions: (state.plaid_transactions || []).map((t) =>
        t.plaid_txn_id === plaidTxnId
          ? { ...t, imported_at: todayIso(), imported_actual_id: actualId, predicted_category_label: categoryLabel }
          : t,
      ),
    };
    await persist(g.workspaceKey, updated, g.userId);
    return { ok: true, actual_id: actualId };
  } catch (e: unknown) {
    return { ok: false, message: errorMessage(e) };
  }
}

// ── dismissPlaidTransaction ──────────────────────────────────────────

export async function dismissPlaidTransaction(
  plaidTxnId: string,
): Promise<{ ok: true } | { ok: false; message: string }> {
  try {
    const g = await gate();
    const state = await loadBudgetState(g.workspaceKey);
    const updated: BudgetState = {
      ...state,
      plaid_transactions: (state.plaid_transactions || []).map((t) =>
        t.plaid_txn_id === plaidTxnId ? { ...t, dismissed_at: todayIso() } : t,
      ),
    };
    await persist(g.workspaceKey, updated, g.userId);
    return { ok: true };
  } catch (e: unknown) {
    return { ok: false, message: errorMessage(e) };
  }
}

// ── undoPlaidTransaction (remove imported actual) ────────────────────

export async function undoPlaidTransaction(
  plaidTxnId: string,
): Promise<{ ok: true } | { ok: false; message: string }> {
  try {
    const g = await gate();
    const state = await loadBudgetState(g.workspaceKey);
    const txn = (state.plaid_transactions || []).find((t) => t.plaid_txn_id === plaidTxnId);
    if (!txn || !txn.imported_actual_id) return { ok: false, message: "Not imported." };

    const updated: BudgetState = {
      ...state,
      monthly_actuals: (state.monthly_actuals || []).filter((a) => a.id !== txn.imported_actual_id),
      plaid_transactions: (state.plaid_transactions || []).map((t) =>
        t.plaid_txn_id === plaidTxnId
          ? { ...t, imported_at: null, imported_actual_id: null }
          : t,
      ),
    };
    await persist(g.workspaceKey, updated, g.userId);
    return { ok: true };
  } catch (e: unknown) {
    return { ok: false, message: errorMessage(e) };
  }
}

function errorMessage(e: unknown): string {
  if (e instanceof Error) return e.message;
  const maybeApi = e as { response?: { data?: { error_message?: string; error_code?: string } } };
  if (maybeApi?.response?.data?.error_message) {
    return `${maybeApi.response.data.error_message}${maybeApi.response.data.error_code ? ` (${maybeApi.response.data.error_code})` : ""}`;
  }
  return String(e);
}
