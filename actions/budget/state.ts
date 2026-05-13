"use server";

// Server actions for the /admin/budget page lifecycle.
//
// Multi-household: each user belongs to at most one household group
// (see _households.ts). All members of a group share one workspace
// blob in app_data. Users not in any group get their own private
// workspace keyed on their Clerk user id.

import { auth } from "@clerk/nextjs/server";

import {
  emptyBudgetState,
  loadBudgetState,
  saveBudgetState as persist,
} from "./_writer";
import type { BudgetState } from "./_writer";
import { resolveHousehold, isAuthorizedForBudget } from "./_households";

function denied(message: string): { ok: false; message: string; state: BudgetState } {
  return { ok: false, message, state: emptyBudgetState() };
}

export async function fetchBudgetState(): Promise<
  | { ok: true; state: BudgetState }
  | { ok: false; message: string; state: BudgetState }
> {
  const { userId } = await auth();
  if (!userId) return denied("Not authenticated.");
  if (!isAuthorizedForBudget(userId)) return denied("Not authorized.");
  try {
    const { workspaceKey } = resolveHousehold(userId);
    const state = await loadBudgetState(workspaceKey);
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
  if (!isAuthorizedForBudget(userId)) return { ok: false, message: "Not authorized." };
  try {
    const { workspaceKey } = resolveHousehold(userId);
    await persist(workspaceKey, state, userId);
    return { ok: true };
  } catch (e: unknown) {
    return { ok: false, message: e instanceof Error ? e.message : String(e) };
  }
}
