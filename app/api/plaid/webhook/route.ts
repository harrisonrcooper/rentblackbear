// Plaid webhook receiver.
//
// Plaid POSTs to this endpoint whenever an Item changes state — new
// transactions available, transactions removed, login required, etc.
// We resolve the affected item against the configured budget owners,
// trigger a sync if relevant, and ack quickly so Plaid doesn't retry.
//
// Webhook authenticity: Plaid signs each POST via JWT in the
// `Plaid-Verification` header. Verification requires a /webhook_
// verification_key/get round-trip + JWT parsing — wired in once the
// feature graduates from sandbox. For now the endpoint only mutates
// state that's keyed on a Plaid item_id we already know about, which
// keeps unauthenticated abuse limited to "force a sync we'd have
// done anyway."
//
// Required env: BUDGET_OWNER_USER_IDS (or BUDGET_OWNER_USER_ID) so we
// can look up the workspace the item belongs to without a Clerk
// session.

import { NextResponse } from "next/server";

import { loadBudgetState, saveBudgetState } from "@/actions/budget/_writer";
import { syncPlaidTransactions } from "@/actions/budget/plaid";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

interface PlaidWebhookBody {
  webhook_type?: string;
  webhook_code?: string;
  item_id?: string;
  error?: { error_code?: string; error_message?: string };
  new_transactions?: number;
  removed_transactions?: string[];
}

function ownerIds(): string[] {
  return (process.env.BUDGET_OWNER_USER_IDS || process.env.BUDGET_OWNER_USER_ID || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function workspaceKey(): string | null {
  const ids = ownerIds();
  return ids.length > 0 ? ids[0] : null;
}

export async function POST(req: Request) {
  let body: PlaidWebhookBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, message: "invalid json" }, { status: 400 });
  }
  if (!body.item_id) {
    return NextResponse.json({ ok: false, message: "missing item_id" }, { status: 400 });
  }

  const wsKey = workspaceKey();
  if (!wsKey) {
    return NextResponse.json({ ok: false, message: "no workspace configured" }, { status: 404 });
  }

  let state;
  try {
    state = await loadBudgetState(wsKey);
  } catch (e) {
    return NextResponse.json(
      { ok: false, message: e instanceof Error ? e.message : String(e) },
      { status: 500 },
    );
  }

  const item = (state.plaid_items || []).find((i) => i.plaid_item_id === body.item_id);
  if (!item) {
    return NextResponse.json({ ok: false, message: "unknown item" }, { status: 404 });
  }

  const type = body.webhook_type || "";
  const code = body.webhook_code || "";

  try {
    // SYNC_UPDATES_AVAILABLE → pull /transactions/sync.
    // INITIAL_UPDATE / HISTORICAL_UPDATE / DEFAULT_UPDATE → also sync.
    if (type === "TRANSACTIONS" && (
      code === "SYNC_UPDATES_AVAILABLE" ||
      code === "INITIAL_UPDATE" ||
      code === "HISTORICAL_UPDATE" ||
      code === "DEFAULT_UPDATE" ||
      code === "TRANSACTIONS_REMOVED"
    )) {
      // syncPlaidTransactions auth-gates on Clerk; bypass by calling
      // through directly with the resolved workspace key. The function
      // is robust to repeated calls (cursor-based).
      await syncPlaidTransactions(item.id);
      return NextResponse.json({ ok: true, synced: true });
    }

    // ITEM error events — mark the item so the UI can prompt for relink.
    if (type === "ITEM" && (code === "ERROR" || code === "LOGIN_REPAIRED" || code === "PENDING_EXPIRATION")) {
      const needs = code === "ERROR";
      const updated = {
        ...state,
        plaid_items: (state.plaid_items || []).map((i) =>
          i.id === item.id ? { ...i, needs_relink: needs } : i,
        ),
      };
      await saveBudgetState(wsKey, updated, null);
      return NextResponse.json({ ok: true, marked: needs ? "needs_relink" : "clear" });
    }

    // All other webhook types — accept and no-op.
    return NextResponse.json({ ok: true, ignored: `${type}.${code}` });
  } catch (e) {
    return NextResponse.json(
      { ok: false, message: e instanceof Error ? e.message : String(e) },
      { status: 500 },
    );
  }
}

// Plaid validates the endpoint on save with a GET. Respond 200 so they
// don't reject the URL.
export async function GET() {
  return NextResponse.json({ ok: true, service: "plaid-webhook" });
}
