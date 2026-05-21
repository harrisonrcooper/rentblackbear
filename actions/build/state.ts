"use server";

// Server actions for the /admin/build home-build planner. Auth is
// re-derived on every call (same gate as the budget app); the planner
// is keyed on the household workspace, so it's one build per household.

import { auth } from "@clerk/nextjs/server";

import { resolveHousehold, isAuthorizedForBudget } from "../budget/_households";
import { emptyBuildState, loadBuildState, saveBuildState } from "./_store";
import type { BuildState } from "./_store";

export async function fetchBuildState(): Promise<
  | { ok: true; state: BuildState }
  | { ok: false; message: string; state: BuildState }
> {
  const { userId } = await auth();
  if (!userId) return { ok: false, message: "Not authenticated.", state: emptyBuildState() };
  if (!isAuthorizedForBudget(userId)) {
    return { ok: false, message: "Not authorized.", state: emptyBuildState() };
  }
  try {
    const { workspaceKey } = resolveHousehold(userId);
    const state = await loadBuildState(workspaceKey);
    return { ok: true, state };
  } catch (e: unknown) {
    return { ok: false, message: e instanceof Error ? e.message : String(e), state: emptyBuildState() };
  }
}

export async function saveBuildStateAction(
  state: BuildState,
): Promise<{ ok: boolean; message?: string }> {
  const { userId } = await auth();
  if (!userId) return { ok: false, message: "Not authenticated." };
  if (!isAuthorizedForBudget(userId)) return { ok: false, message: "Not authorized." };
  try {
    const { workspaceKey } = resolveHousehold(userId);
    await saveBuildState(workspaceKey, state);
    return { ok: true };
  } catch (e: unknown) {
    return { ok: false, message: e instanceof Error ? e.message : String(e) };
  }
}
