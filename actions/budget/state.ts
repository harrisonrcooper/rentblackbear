"use server";

// Server actions for the /admin/budget page lifecycle.
//
// Multi-household: each user belongs to at most one household group
// (see _households.ts). All members of a group share one workspace
// blob in app_data. Users not in any group get their own private
// workspace keyed on their admin principal id.
//
// Multi-budget: within a single workspace a user can own more than one
// budget (their own + e.g. a household they're helping). The registry
// (_registry.ts) indexes them; `active_id` records which one is open.
// Every read/write here routes through the registry so all budget
// actions agree on which budget is live.

import { auth } from "@/lib/auth";

import {
  emptyBudgetState,
  loadBudgetState,
  saveBudgetState as persist,
} from "./_writer";
import type { BudgetState } from "./_writer";
import { isAuthorizedForBudget } from "./_households";
import {
  resolveActiveBudget,
  loadRegistry,
  saveRegistry,
  ownerKeyFor,
  budgetWorkspaceKey,
  slugify,
  emptyRegistry,
  MAX_BUDGETS,
} from "./_registry";
import type { BudgetRegistry, BudgetRef } from "./_registry";
import { buildSeedState } from "./_seed-templates";

// Accent palette for newly created budgets — cycles so each new budget
// gets a visually distinct avatar chip.
const NEW_BUDGET_COLORS = ["#16a34a", "#d6448f", "#c88318", "#0bafb0", "#8c5ad9", "#3b6fd1"];

type FetchOk = {
  ok: true;
  state: BudgetState;
  registry: BudgetRegistry;
  activeBudgetId: string | null;
};
type FetchErr = {
  ok: false;
  message: string;
  state: BudgetState;
  registry: BudgetRegistry;
  activeBudgetId: null;
};
type FetchResult = FetchOk | FetchErr;

function denied(message: string): FetchErr {
  return {
    ok: false,
    message,
    state: emptyBudgetState(),
    registry: emptyRegistry(),
    activeBudgetId: null,
  };
}

// Initial page load — resolves the active budget and returns it along
// with the registry so the client can render the budget switcher.
export async function fetchBudgetState(): Promise<FetchResult> {
  const { userId } = await auth();
  if (!userId) return denied("Not authenticated.");
  if (!isAuthorizedForBudget(userId)) return denied("Not authorized.");
  try {
    const active = await resolveActiveBudget(userId);
    const state = await loadBudgetState(active.workspaceKey);
    return {
      ok: true,
      state,
      registry: active.registry,
      activeBudgetId: active.activeBudgetId,
    };
  } catch (e: unknown) {
    return denied(e instanceof Error ? e.message : String(e));
  }
}

// Persist an edit. `budgetId` names which budget the state belongs to
// (null → primary). It is captured client-side at edit time so a save
// debounced across a budget switch still lands in the correct budget.
// The id is validated against the caller's own registry — never
// trusted as a raw workspace key.
export async function saveBudgetStateAction(
  state: BudgetState,
  budgetId: string | null = null,
): Promise<{ ok: boolean; message?: string }> {
  const { userId } = await auth();
  if (!userId) return { ok: false, message: "Not authenticated." };
  if (!isAuthorizedForBudget(userId)) return { ok: false, message: "Not authorized." };
  try {
    const ownerKey = ownerKeyFor(userId);
    if (budgetId) {
      const registry = await loadRegistry(ownerKey);
      if (!registry.budgets.some((b) => b.id === budgetId)) {
        return { ok: false, message: "Unknown budget." };
      }
    }
    await persist(budgetWorkspaceKey(ownerKey, budgetId), state, userId);
    return { ok: true };
  } catch (e: unknown) {
    return { ok: false, message: e instanceof Error ? e.message : String(e) };
  }
}

// Switch the active budget. Records the choice in the registry (so all
// other budget actions follow) and returns the target budget's state.
export async function switchBudgetAction(budgetId: string | null): Promise<FetchResult> {
  const { userId } = await auth();
  if (!userId) return denied("Not authenticated.");
  if (!isAuthorizedForBudget(userId)) return denied("Not authorized.");
  try {
    const ownerKey = ownerKeyFor(userId);
    const registry = await loadRegistry(ownerKey);
    if (budgetId && !registry.budgets.some((b) => b.id === budgetId)) {
      return denied("That budget no longer exists.");
    }
    const next: BudgetRegistry = { ...registry, active_id: budgetId };
    await saveRegistry(ownerKey, next);
    const state = await loadBudgetState(budgetWorkspaceKey(ownerKey, budgetId));
    return { ok: true, state, registry: next, activeBudgetId: budgetId };
  } catch (e: unknown) {
    return denied(e instanceof Error ? e.message : String(e));
  }
}

// Create a brand-new budget and switch into it. The new budget is the
// basic household template with every amount at $0 — a true blank
// slate the user can immediately start filling in. People/owner tags
// start empty so the new budget carries none of another household's
// names.
export async function createBudgetAction(label: string): Promise<FetchResult> {
  const { userId } = await auth();
  if (!userId) return denied("Not authenticated.");
  if (!isAuthorizedForBudget(userId)) return denied("Not authorized.");

  const clean = (label || "").trim().slice(0, 60);
  if (!clean) return denied("Name the budget first.");

  try {
    const ownerKey = ownerKeyFor(userId);
    const registry = await loadRegistry(ownerKey);
    if (registry.budgets.length >= MAX_BUDGETS) {
      return denied(`Budget limit reached (${MAX_BUDGETS}). Remove one first.`);
    }

    const id = slugify(clean, registry.budgets.map((b) => b.id));
    const color = NEW_BUDGET_COLORS[registry.budgets.length % NEW_BUDGET_COLORS.length];
    const ref: BudgetRef = {
      id,
      label: clean,
      color,
      created_at: new Date().toISOString(),
    };

    const seeded: BudgetState = {
      ...buildSeedState("basic"),
      profiles: [],
      active_profile_id: null,
    };
    await persist(budgetWorkspaceKey(ownerKey, id), seeded, userId);

    const next: BudgetRegistry = {
      ...registry,
      budgets: [...registry.budgets, ref],
      active_id: id,
    };
    await saveRegistry(ownerKey, next);

    return { ok: true, state: seeded, registry: next, activeBudgetId: id };
  } catch (e: unknown) {
    return denied(e instanceof Error ? e.message : String(e));
  }
}
