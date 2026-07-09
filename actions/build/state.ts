"use server";

// Server actions for the /admin/build home-build planner. Auth is
// re-derived on every call (same gate as the budget app); the planner
// is keyed on the household workspace, so it's one build per household.
//
// Writes are compare-and-swap: the client sends the version it last read,
// and a save that would overwrite a newer blob is refused. The client then
// three-way merges (lib/build/merge.ts) and retries, so two people editing
// at once keep both sets of edits instead of one silently winning.

import { auth } from "@/lib/auth";

import { resolveHousehold, isAuthorizedForBudget } from "../budget/_households";
import { emptyBuildState, loadBuildState, saveBuildState } from "./_store";
import type { BuildState } from "./_store";

// Not exported: a "use server" module may only export async functions.
// Flat shapes, not discriminated unions — this repo compiles with
// `strict: false`, which disables narrowing on literal-boolean discriminants.
interface FetchResult {
  ok: boolean;
  message?: string;
  state: BuildState;
  version: number;
}

interface SaveResult {
  ok: boolean;
  version?: number;
  /** True when someone else saved first; `state` is what the server holds. */
  conflict?: boolean;
  state?: BuildState;
  message?: string;
}

interface Workspace {
  key?: string;
  message?: string;
}

async function workspace(): Promise<Workspace> {
  const { userId } = await auth();
  if (!userId) return { message: "Not authenticated." };
  if (!isAuthorizedForBudget(userId)) return { message: "Not authorized." };
  return { key: resolveHousehold(userId).workspaceKey };
}

export async function fetchBuildState(): Promise<FetchResult> {
  const ws = await workspace();
  if (!ws.key) return { ok: false, message: ws.message, state: emptyBuildState(), version: 0 };
  try {
    const { value, version } = await loadBuildState(ws.key);
    return { ok: true, state: value, version };
  } catch (e: unknown) {
    return {
      ok: false,
      message: e instanceof Error ? e.message : String(e),
      state: emptyBuildState(),
      version: 0,
    };
  }
}

export async function saveBuildStateAction(
  state: BuildState,
  expectedVersion: number,
): Promise<SaveResult> {
  const ws = await workspace();
  if (!ws.key) return { ok: false, message: ws.message };
  try {
    const res = await saveBuildState(ws.key, state, expectedVersion);
    if (res.ok) return { ok: true, version: res.version };
    if (res.conflict && res.latest) {
      // Someone else saved first. Hand back what the server actually holds
      // so the client can merge its in-flight edits into it and retry.
      return { ok: false, conflict: true, state: res.latest.value, version: res.latest.version };
    }
    return { ok: false, message: res.message };
  } catch (e: unknown) {
    return { ok: false, message: e instanceof Error ? e.message : String(e) };
  }
}
