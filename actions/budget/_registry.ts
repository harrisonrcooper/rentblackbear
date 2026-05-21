// Budget registry — lets one logged-in user own MORE THAN ONE budget
// and switch between them from the sidebar "VIEWING AS" picker.
//
// Storage (all in the existing `app_data` key-value table):
//   budget:<ownerKey>            → the primary budget blob (unchanged)
//   budget:<ownerKey>::<slug>    → a secondary budget blob
//   budget-registry:<ownerKey>   → this registry: the index of budgets
//
// SECURITY: `ownerKey` is ALWAYS the auth-resolved household workspace
// key — it is never taken from the client. A secondary budget id is a
// slug the client may name, but it is only ever used *namespaced under*
// the caller's own ownerKey (`<ownerKey>::<slug>`), so a client can
// never craft an id that reaches another tenant's data.

import { resolveHousehold } from "./_households";
import { loadAppData, saveAppData } from "./_writer";

export interface BudgetRef {
  id: string;          // url-safe slug, unique within the owner
  label: string;       // display name
  color: string;       // accent for the avatar chip (hex)
  created_at: string;  // ISO
}

export interface BudgetRegistry {
  primary_label: string;     // display name for the primary budget
  budgets: BudgetRef[];      // secondary budgets, in creation order
  active_id: string | null;  // null → the primary budget is active
}

// Defensive cap so a runaway client can't create unbounded app_data rows.
export const MAX_BUDGETS = 20;

const DEFAULT_PRIMARY_LABEL = "Main budget";

export function emptyRegistry(): BudgetRegistry {
  return { primary_label: DEFAULT_PRIMARY_LABEL, budgets: [], active_id: null };
}

// The auth-resolved workspace key for the calling user. Single source
// of truth for which tenant's data the caller may touch.
export function ownerKeyFor(userId: string): string {
  return resolveHousehold(userId).workspaceKey;
}

function registryKey(ownerKey: string): string {
  return `budget-registry:${ownerKey}`;
}

export async function loadRegistry(ownerKey: string): Promise<BudgetRegistry> {
  const reg = await loadAppData<BudgetRegistry>(registryKey(ownerKey), emptyRegistry());
  // Forward-compat: backfill any missing field rather than crash a page.
  return {
    primary_label: reg.primary_label || DEFAULT_PRIMARY_LABEL,
    budgets: Array.isArray(reg.budgets) ? reg.budgets : [],
    active_id: reg.active_id ?? null,
  };
}

export async function saveRegistry(ownerKey: string, registry: BudgetRegistry): Promise<void> {
  await saveAppData(registryKey(ownerKey), registry);
}

// The workspace id passed to loadBudgetState / saveBudgetState for a
// given budget. `budgetId` null → the primary budget. Otherwise the id
// is namespaced under the owner so it can only ever address this
// owner's own budgets.
export function budgetWorkspaceKey(ownerKey: string, budgetId: string | null): string {
  if (!budgetId) return ownerKey;
  return `${ownerKey}::${budgetId}`;
}

// Turn a free-text label into a stable, url-safe, collision-free slug.
export function slugify(label: string, taken: string[] = []): string {
  const base =
    label
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 40) || "budget";
  const set = new Set(taken);
  if (!set.has(base)) return base;
  let n = 2;
  while (set.has(`${base}-${n}`)) n += 1;
  return `${base}-${n}`;
}

export interface ActiveBudget {
  ownerKey: string;
  registry: BudgetRegistry;
  activeBudgetId: string | null;
  workspaceKey: string; // pass to loadBudgetState / saveBudgetState
}

// Resolve which budget is currently active for the user. If the stored
// `active_id` points at a budget that no longer exists, fall back to
// the primary so the page never loads a phantom workspace.
export async function resolveActiveBudget(userId: string): Promise<ActiveBudget> {
  const ownerKey = ownerKeyFor(userId);
  const registry = await loadRegistry(ownerKey);
  let activeBudgetId = registry.active_id;
  if (activeBudgetId && !registry.budgets.some((b) => b.id === activeBudgetId)) {
    activeBudgetId = null;
  }
  return {
    ownerKey,
    registry,
    activeBudgetId,
    workspaceKey: budgetWorkspaceKey(ownerKey, activeBudgetId),
  };
}
