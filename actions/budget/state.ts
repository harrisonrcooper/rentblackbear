"use server";

// Server actions for the /admin/budget page lifecycle:
//   * fetchBudgetState — initial page load + after-import refresh
//   * saveBudgetState  — atomic full-state save (UI sends the whole
//                         object back; v1 sticks with a coarse-grained
//                         write since the blob is small)
//
// All access is gated on Clerk auth + (when set) BUDGET_OWNER_USER_IDS
// (or legacy BUDGET_OWNER_USER_ID). Multiple owners means Harrison +
// Carolina can share a workspace from separate Clerk sessions.

import { auth } from "@clerk/nextjs/server";

import {
  emptyBudgetState,
  loadBudgetState,
  saveBudgetState as persist,
  stripPlaidSecrets,
} from "./_writer";
import type { BudgetState } from "./_writer";

function denied(message: string): { ok: false; message: string; state: BudgetState } {
  return { ok: false, message, state: emptyBudgetState() };
}

// Resolve the allow-list. Returns [] for "anyone authenticated."
function allowedOwnerIds(): string[] {
  const multi = process.env.BUDGET_OWNER_USER_IDS;
  const single = process.env.BUDGET_OWNER_USER_ID;
  return (multi || single || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

// Shared workspace key for the household. If multiple owners are
// configured, they all read/write the same blob via the first
// allow-listed user id. Falls back to the caller's own user id when
// no list is set (single-tenant default).
function workspaceKey(userId: string): string {
  const list = allowedOwnerIds();
  if (list.length > 1) return list[0];
  return userId;
}

export async function fetchBudgetState(): Promise<
  | { ok: true; state: BudgetState }
  | { ok: false; message: string; state: BudgetState }
> {
  const { userId } = await auth();
  if (!userId) return denied("Not authenticated.");
  const list = allowedOwnerIds();
  if (list.length > 0 && !list.includes(userId)) {
    return denied("Not authorized.");
  }
  try {
    const state = await loadBudgetState(workspaceKey(userId));
    // Strip Plaid access_tokens before the state crosses the server →
    // client boundary. The full state (with tokens) only exists inside
    // server actions in @/actions/budget/plaid.
    return { ok: true, state: stripPlaidSecrets(state) };
  } catch (e: unknown) {
    return denied(e instanceof Error ? e.message : String(e));
  }
}

export type ImportedActualRow = {
  date: string; // YYYY-MM-DD
  amount_cents: number;
  category_label: string;
  note?: string;
};

// Batch-insert historical transactions into monthly_actuals. Used by
// the CSV import flow on the Reports tab — drops in a full year of
// data in a single write so the user doesn't pay per-row latency.
// Rows without a category_label are skipped with a warning.
export async function importHistoricalActuals(
  inputRows: ImportedActualRow[],
): Promise<
  | { ok: true; inserted: number; skipped: number }
  | { ok: false; message: string }
> {
  const { userId } = await auth();
  if (!userId) return { ok: false, message: "Not authenticated." };
  const list = allowedOwnerIds();
  if (list.length > 0 && !list.includes(userId)) {
    return { ok: false, message: "Not authorized." };
  }
  try {
    const wsKey = workspaceKey(userId);
    const current = await loadBudgetState(wsKey);
    const knownLabels = new Set(
      (current.categories || []).map((c) => c.label.toLowerCase()),
    );
    const accepted: BudgetState["monthly_actuals"] = [];
    let skipped = 0;
    const genId = () => `${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 9)}`;
    for (const r of inputRows) {
      if (!r.category_label || !knownLabels.has(r.category_label.toLowerCase())) {
        skipped++;
        continue;
      }
      const month = `${r.date.slice(0, 7)}-01`;
      accepted.push({
        id: genId(),
        category_label: r.category_label,
        month,
        paid_on: r.date,
        amount_cents: r.amount_cents,
        note: r.note,
      });
    }
    const next: BudgetState = {
      ...current,
      monthly_actuals: [...(current.monthly_actuals || []), ...accepted],
    };
    await persist(wsKey, next, userId);
    return { ok: true, inserted: accepted.length, skipped };
  } catch (e) {
    return { ok: false, message: e instanceof Error ? e.message : String(e) };
  }
}

export async function saveBudgetStateAction(
  state: BudgetState,
): Promise<{ ok: boolean; message?: string }> {
  const { userId } = await auth();
  if (!userId) return { ok: false, message: "Not authenticated." };
  const list = allowedOwnerIds();
  if (list.length > 0 && !list.includes(userId)) {
    return { ok: false, message: "Not authorized." };
  }
  try {
    // The client never sees access_tokens, so its plaid_items[] is
    // blanked. Re-hydrate the server-only secrets from the current
    // server copy before writing so we don't blow away the bank
    // connections every time the user edits anything else.
    const wsKey = workspaceKey(userId);
    const current = await loadBudgetState(wsKey);
    const serverItems = current.plaid_items || [];
    const incomingItems = state.plaid_items || [];
    const merged = incomingItems.map((i) => {
      const match = serverItems.find((s) => s.id === i.id);
      return match ? { ...i, access_token: match.access_token } : i;
    });
    const toSave: BudgetState = { ...state, plaid_items: merged };
    await persist(wsKey, toSave, userId);
    return { ok: true };
  } catch (e: unknown) {
    return { ok: false, message: e instanceof Error ? e.message : String(e) };
  }
}
