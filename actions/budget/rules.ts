"use server";

// Categorization rule CRUD server actions. Kept separate from
// plaid.ts so the Plaid file stays scoped to bank-feed mechanics —
// rules are useful even without a bank connection (e.g. for manually
// entered expenses through QuickAddSheet down the line).

import { auth } from "@clerk/nextjs/server";

import {
  loadBudgetState,
  saveBudgetState as persist,
} from "./_writer";
import type {
  BudgetCategorizationRule,
  BudgetState,
} from "./_writer";

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

function todayIso(): string {
  return new Date().toISOString();
}

function errorMessage(e: unknown): string {
  if (e instanceof Error) return e.message;
  return String(e);
}

export type RuleInput = {
  match_field: BudgetCategorizationRule["match_field"];
  match_op: BudgetCategorizationRule["match_op"];
  match_value: string;
  target_category_label: string;
  enabled?: boolean;
  auto_import?: boolean;
  notes?: string;
};

export async function addCategorizationRule(
  input: RuleInput,
): Promise<{ ok: true; rule_id: string } | { ok: false; message: string }> {
  try {
    const g = await gate();
    const state = await loadBudgetState(g.workspaceKey);
    const id = genId();
    const rule: BudgetCategorizationRule = {
      id,
      match_field: input.match_field,
      match_op: input.match_op,
      match_value: input.match_value.trim(),
      target_category_label: input.target_category_label,
      enabled: input.enabled ?? true,
      auto_import: input.auto_import ?? false,
      hit_count: 0,
      last_hit_at: null,
      created_at: todayIso(),
      notes: input.notes,
    };
    const updated: BudgetState = {
      ...state,
      categorization_rules: [...(state.categorization_rules || []), rule],
    };
    await persist(g.workspaceKey, updated, g.userId);
    return { ok: true, rule_id: id };
  } catch (e) {
    return { ok: false, message: errorMessage(e) };
  }
}

export async function updateCategorizationRule(
  ruleId: string,
  patch: Partial<RuleInput>,
): Promise<{ ok: true } | { ok: false; message: string }> {
  try {
    const g = await gate();
    const state = await loadBudgetState(g.workspaceKey);
    const rules = state.categorization_rules || [];
    if (!rules.find((r) => r.id === ruleId)) {
      return { ok: false, message: "Rule not found." };
    }
    const updated: BudgetState = {
      ...state,
      categorization_rules: rules.map((r) =>
        r.id === ruleId
          ? {
              ...r,
              ...patch,
              match_value: patch.match_value != null ? patch.match_value.trim() : r.match_value,
            }
          : r,
      ),
    };
    await persist(g.workspaceKey, updated, g.userId);
    return { ok: true };
  } catch (e) {
    return { ok: false, message: errorMessage(e) };
  }
}

export async function deleteCategorizationRule(
  ruleId: string,
): Promise<{ ok: true } | { ok: false; message: string }> {
  try {
    const g = await gate();
    const state = await loadBudgetState(g.workspaceKey);
    const updated: BudgetState = {
      ...state,
      categorization_rules: (state.categorization_rules || []).filter((r) => r.id !== ruleId),
    };
    await persist(g.workspaceKey, updated, g.userId);
    return { ok: true };
  } catch (e) {
    return { ok: false, message: errorMessage(e) };
  }
}

export async function reorderCategorizationRules(
  orderedIds: string[],
): Promise<{ ok: true } | { ok: false; message: string }> {
  try {
    const g = await gate();
    const state = await loadBudgetState(g.workspaceKey);
    const rules = state.categorization_rules || [];
    const byId = new Map(rules.map((r) => [r.id, r]));
    const next: BudgetCategorizationRule[] = [];
    for (const id of orderedIds) {
      const r = byId.get(id);
      if (r) {
        next.push(r);
        byId.delete(id);
      }
    }
    // Append any rules that weren't in the ordered list (defensive
    // against a stale client send).
    for (const remaining of byId.values()) next.push(remaining);
    const updated: BudgetState = { ...state, categorization_rules: next };
    await persist(g.workspaceKey, updated, g.userId);
    return { ok: true };
  } catch (e) {
    return { ok: false, message: errorMessage(e) };
  }
}
