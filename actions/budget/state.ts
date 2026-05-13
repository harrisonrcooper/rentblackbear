"use server";

// Server actions for the /admin/budget page lifecycle:
//   * fetchBudgetState — initial page load
//   * saveBudgetStateAction — atomic full-state save (UI sends the whole
//     object back; v1 sticks with a coarse-grained write since the blob
//     is small)
//
// All access is gated on Clerk auth + (when set) BUDGET_OWNER_USER_IDS
// (or legacy BUDGET_OWNER_USER_ID). Multiple owners means Harrison +
// Carolina can share a workspace from separate Clerk sessions.

import { auth } from "@clerk/nextjs/server";

import {
  emptyBudgetState,
  loadBudgetState,
  saveBudgetState as persist,
} from "./_writer";
import type { BudgetState } from "./_writer";

function denied(message: string): { ok: false; message: string; state: BudgetState } {
  return { ok: false, message, state: emptyBudgetState() };
}

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
    return { ok: true, state };
  } catch (e: unknown) {
    return denied(e instanceof Error ? e.message : String(e));
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
    await persist(workspaceKey(userId), state, userId);
    return { ok: true };
  } catch (e: unknown) {
    return { ok: false, message: e instanceof Error ? e.message : String(e) };
  }
}
