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
import { predictCategory } from "@/app/admin/budget/lib/predict";

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

export type CreateBillInput = {
  label: string;
  vendor?: string;
  amount_cents: number;
  cadence: "weekly" | "biweekly" | "monthly" | "quarterly" | "yearly";
  due_day?: number;
  due_month?: number;
  category_label?: string;
  account?: string;
  autopay?: boolean;
  auto_post?: boolean;
  last_paid_at?: string | null;
  notes?: string;
};

// Create a bill from arbitrary input — used by the recurring detector
// UI to turn a Plaid pattern into a real bill row, and available for
// any other surface that wants to add a bill server-side.
export async function createBill(
  input: CreateBillInput,
): Promise<{ ok: true; bill_id: string } | { ok: false; message: string }> {
  try {
    const g = await gate();
    const state = await loadBudgetState(g.workspaceKey);
    const id = genId();
    const bill = {
      id,
      label: input.label,
      vendor: input.vendor,
      amount_cents: input.amount_cents,
      cadence: input.cadence,
      due_day: input.due_day,
      due_month: input.due_month,
      category_label: input.category_label,
      account: input.account,
      autopay: input.autopay ?? false,
      auto_post: input.auto_post ?? false,
      last_paid_at: input.last_paid_at ?? null,
      notes: input.notes,
      created_at: new Date().toISOString(),
    };
    const updated: BudgetState = {
      ...state,
      bills: [...(state.bills || []), bill],
    };
    await persist(g.workspaceKey, updated, g.userId);
    return { ok: true, bill_id: id };
  } catch (e) {
    return { ok: false, message: errorMessage(e) };
  }
}

export async function runScheduledBillPosts(): Promise<
  | { ok: true; posted: number; posted_bill_ids: string[]; skipped?: number }
  | { ok: false; message: string }
> {
  try {
    const g = await gate();
    const state = await loadBudgetState(g.workspaceKey);
    const bills = state.bills || [];
    const candidates = billsToAutoPost(bills);
    if (candidates.length === 0) return { ok: true, posted: 0, posted_bill_ids: [], skipped: 0 };

    // Build a case-insensitive lookup for known envelope labels so
    // bill.category_label can be validated before posting.
    const envelopeLabels = (state.categories || []).map((c) => c.label);
    const lowerToCanonical = new Map(
      envelopeLabels.map((l) => [l.toLowerCase(), l]),
    );

    const newActuals: BudgetState["monthly_actuals"] = [];
    const billsById = new Map(bills.map((b) => [b.id, b]));
    const postedIds: string[] = [];
    let skipped = 0;

    for (const c of candidates) {
      // Resolve category in priority order. An auto-post that orphans
      // the actual (category doesn't match any envelope) confuses
      // envelope balances later, so we'd rather skip + flag than
      // silently mis-categorize.
      let resolvedCategory: string | null = null;
      const billCat = c.bill.category_label?.trim();
      if (billCat && lowerToCanonical.has(billCat.toLowerCase())) {
        resolvedCategory = lowerToCanonical.get(billCat.toLowerCase()) || null;
      }
      if (!resolvedCategory) {
        const guess = predictCategory(
          `${c.bill.label} ${c.bill.vendor || ""}`.trim(),
          envelopeLabels,
        );
        if (guess) resolvedCategory = guess;
      }

      const existing = billsById.get(c.bill.id);

      if (!resolvedCategory) {
        // Don't post; record why and move on.
        if (existing) {
          billsById.set(c.bill.id, {
            ...existing,
            last_auto_skip_reason: `No envelope matches "${billCat || c.bill.label}". Set a category and try again.`,
          });
        }
        skipped++;
        continue;
      }

      const actualId = genId();
      newActuals.push({
        id: actualId,
        category_label: resolvedCategory,
        month: `${c.due_iso.slice(0, 7)}-01`,
        paid_on: c.due_iso,
        amount_cents: c.bill.amount_cents,
        note: `[auto] ${c.bill.label}${c.bill.vendor ? ` · ${c.bill.vendor}` : ""}`,
      });
      if (existing) {
        billsById.set(c.bill.id, {
          ...existing,
          last_auto_posted_period: c.period,
          last_paid_at: c.due_iso,
          last_auto_skip_reason: null,
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
    return { ok: true, posted: postedIds.length, posted_bill_ids: postedIds, skipped };
  } catch (e) {
    return { ok: false, message: errorMessage(e) };
  }
}
