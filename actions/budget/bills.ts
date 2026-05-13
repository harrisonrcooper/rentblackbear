"use server";

// Recurring-bill auto-post engine. Called from the /admin/budget page
// server component on every load so bills with `auto_post: true` land
// in monthly_actuals automatically on or after their due date — no
// background cron required for v1.
//
// Idempotency: each post bumps `last_auto_posted_period` on the bill,
// keyed by month / year / quarter / day depending on cadence. Re-runs
// are safe — the second call finds nothing to do.

import { auth } from "@clerk/nextjs/server";

import { loadBudgetState, saveBudgetState as persist } from "./_writer";
import type { BudgetState } from "./_writer";
import { billsToAutoPost } from "@/app/admin/budget/lib/bills";

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
  return { userId, workspaceKey: workspaceKey(userId) };
}

function genId(): string {
  return `${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 9)}`;
}

function errorMessage(e: unknown): string {
  if (e instanceof Error) return e.message;
  return String(e);
}

export async function runScheduledBillPosts(): Promise<
  | { ok: true; posted: number; posted_bill_ids: string[] }
  | { ok: false; message: string }
> {
  try {
    const g = await gate();
    const state = await loadBudgetState(g.workspaceKey);
    const bills = state.bills || [];
    const candidates = billsToAutoPost(bills);
    if (candidates.length === 0) return { ok: true, posted: 0, posted_bill_ids: [] };

    const newActuals: BudgetState["monthly_actuals"] = [];
    const billsById = new Map(bills.map((b) => [b.id, b]));
    const postedIds: string[] = [];

    for (const c of candidates) {
      const actualId = genId();
      newActuals.push({
        id: actualId,
        category_label: c.bill.category_label || c.bill.label,
        month: `${c.due_iso.slice(0, 7)}-01`,
        paid_on: c.due_iso,
        amount_cents: c.bill.amount_cents,
        note: `[auto] ${c.bill.label}${c.bill.vendor ? ` · ${c.bill.vendor}` : ""}`,
      });
      const existing = billsById.get(c.bill.id);
      if (existing) {
        billsById.set(c.bill.id, {
          ...existing,
          last_auto_posted_period: c.period,
          last_paid_at: c.due_iso,
        });
      }
      postedIds.push(c.bill.id);
    }

    const updated: BudgetState = {
      ...state,
      monthly_actuals: [...(state.monthly_actuals || []), ...newActuals],
      bills: bills.map((b) => billsById.get(b.id) || b),
    };
    await persist(g.workspaceKey, updated, g.userId);
    return { ok: true, posted: candidates.length, posted_bill_ids: postedIds };
  } catch (e) {
    return { ok: false, message: errorMessage(e) };
  }
}
