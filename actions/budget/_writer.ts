// Budget persistence layer.
//
// For v1 the budget lives as a single JSONB blob under
// `app_data.key = 'budget:<workspaceId>'`. This matches the existing
// rentblackbear admin (which stores tenants, leases, etc. in app_data
// today) and lets the /admin/budget page ship without first applying
// migrations 001-012 to the Supabase project.
//
// When the SaaS-scale refactor lands, this module becomes the single
// place to swap in the relational writer (`budget_*` tables defined in
// migrations/012_budget.sql) — the API surface stays identical.

import type { ImportPayload, ImportResult, ImportCounts } from "./_types";

export interface BudgetSettingsState {
  hero_mode: "conservative" | "optimistic" | "rentals_only";
  default_vacancy_bps: number;
  default_capex_bps: number;
  habit_style?: "heatmap" | "garden" | "stride";
  habit_profile?: "all" | "harrison" | "carolina" | "shared";
  retirement_horizon_years?: number;
  retirement_return_bps?: number; // 700 = 7%
  fire_multiple?: number; // default 25 (4% rule)
  marginal_tax_bps?: number; // marginal income tax rate for after-tax calcs
  refi_target_rate_bps?: number; // target rate for the refinance scenario
  refi_cost_cents?: number; // closing costs for the refinance scenario
  theme?: "system" | "light" | "dark";
  onboarding_dismissed?: boolean;
}

// One-per-day snapshot of the key dashboard totals so sparklines + the
// net-worth-over-time chart have real history to render. Capped at 365
// entries by the writer (rolling window).
export interface BudgetHistorySnapshot {
  day: string; // YYYY-MM-DD
  personal_monthly_cents: number;
  rental_noi_cents: number;
  net_worth_cents: number;
  hero_conservative_cents: number;
  saved_this_month_cents: number;
}

export interface BudgetHabit {
  id: string;
  label: string;
  cadence: "daily" | "weekly" | "monthly";
  icon?: string;
  color?: string;
  owner?: "harrison" | "carolina" | "shared";
  group?: string; // free-form group name (e.g. "Money", "Marriage", "Health")
  linked_goal_id?: string | null; // optional pairing to a BudgetGoal
  completions: string[]; // ISO YYYY-MM-DD dates the habit was checked off
  archived?: boolean;
  created_at?: string;
}

export interface BudgetGoalMilestone {
  id: string;
  label: string;
  target_cents?: number;
  target_count?: number;
  hit_at?: string | null;
}

export interface BudgetGoal {
  id: string;
  label: string;
  kind: "savings" | "debt_payoff" | "net_worth" | "property_count" | "rental_income" | "custom";
  target_cents: number;
  target_count?: number;
  due_by?: string | null;
  notes?: string;
  archived?: boolean;
  created_at?: string;
  completed_at?: string | null;
  current_value_cents?: number; // for "custom" goals — user-tracked
  milestones?: BudgetGoalMilestone[];
}

export interface BudgetProfile {
  id: string;            // stable slug ("harrison", "carolina", or any custom)
  label: string;         // display name
  color: string;         // accent color used in chips/labels/owner pills
  clerk_user_id?: string; // optional Clerk subject — when set, this profile auto-activates for that login
  pay_day?: number;      // day-of-month their paycheck hits (1-31)
  pay_frequency?: "weekly" | "biweekly" | "semimonthly" | "monthly";
  notes?: string;
  archived?: boolean;
  created_at?: string;
}

export interface BudgetBill {
  id: string;
  label: string;
  vendor?: string;
  amount_cents: number;
  cadence: "weekly" | "biweekly" | "monthly" | "quarterly" | "yearly";
  due_day?: number; // 1-31 for monthly; 1-12 for yearly (month of year)
  due_month?: number; // 1-12 — used for yearly bills to anchor the month
  category_label?: string; // optional link into monthly_actuals when paid
  account?: string; // e.g. "Joint Checking", "Truck Card" — free text
  autopay?: boolean;
  archived_at?: string | null;
  last_paid_at?: string | null; // ISO date
  last_used_at?: string | null; // user-tagged "I still use this" timestamp
  // Auto-post: when true, the bill writes itself into monthly_actuals on
  // the first /admin/budget load on or after its due date each period.
  // `last_auto_posted_period` is the YYYY-MM (monthly) or YYYY (yearly)
  // bucket already posted — used to keep the post idempotent.
  auto_post?: boolean;
  last_auto_posted_period?: string | null;
  // Populated by runScheduledBillPosts when a bill would have auto-
  // posted but the category couldn't be resolved against a known
  // envelope. Cleared when the user sets a category_label that does
  // match. Surfaces in the UI as a small red "needs envelope" pill.
  last_auto_skip_reason?: string | null;
  notes?: string;
  created_at?: string;
}

export interface BudgetState extends ImportPayload {
  settings: BudgetSettingsState;
  imported_at: string | null;
  last_modified_at: string | null;
  last_modified_by: string | null;
  schema_version: number;
  history?: BudgetHistorySnapshot[];
  habits?: BudgetHabit[];
  goals?: BudgetGoal[];
  bills?: BudgetBill[];
  profiles?: BudgetProfile[];
  active_profile_id?: string | null;
}

const DEFAULT_SETTINGS: BudgetSettingsState = {
  hero_mode: "conservative",
  default_vacancy_bps: 1000, // 10%
  default_capex_bps: 500, //  5%
};

export const BUDGET_SCHEMA_VERSION = 1;

export function emptyBudgetState(): BudgetState {
  return {
    settings: { ...DEFAULT_SETTINGS },
    categories: [],
    income_sources: [],
    properties: [],
    business_expenses: [],
    yearly_expenses: [],
    assets: [],
    debts: [],
    heloc_model: null,
    mom_loans: [],
    retirement_contributions: [],
    monthly_actuals: [],
    history: [],
    habits: [],
    goals: [],
    bills: [],
    profiles: [
      { id: "harrison", label: "Harrison", color: "#3b6fd1", pay_frequency: "biweekly", created_at: new Date().toISOString() },
      { id: "carolina", label: "Carolina", color: "#d6448f", pay_frequency: "biweekly", created_at: new Date().toISOString() },
    ],
    active_profile_id: "harrison",
    imported_at: null,
    last_modified_at: null,
    last_modified_by: null,
    schema_version: BUDGET_SCHEMA_VERSION,
  };
}

export function budgetKey(workspaceId: string): string {
  return `budget:${workspaceId}`;
}


const SUPA_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPA_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "";

function headers(prefer = "return=representation"): Record<string, string> {
  return {
    apikey: SUPA_KEY,
    Authorization: `Bearer ${SUPA_KEY}`,
    "Content-Type": "application/json",
    Prefer: prefer,
  };
}

async function loadAppData<T>(key: string, fallback: T): Promise<T> {
  if (!SUPA_URL || !SUPA_KEY) return fallback;
  try {
    const res = await fetch(
      `${SUPA_URL}/rest/v1/app_data?key=eq.${encodeURIComponent(key)}&select=value`,
      { headers: headers(), cache: "no-store" },
    );
    if (!res.ok) return fallback;
    const rows = (await res.json()) as Array<{ value: T }>;
    if (rows.length === 0 || rows[0].value == null) return fallback;
    return rows[0].value;
  } catch {
    return fallback;
  }
}

async function saveAppData(key: string, value: unknown): Promise<void> {
  if (!SUPA_URL || !SUPA_KEY) {
    throw new Error("Supabase env vars not configured.");
  }
  const res = await fetch(`${SUPA_URL}/rest/v1/app_data?on_conflict=key`, {
    method: "POST",
    headers: headers("resolution=merge-duplicates,return=minimal"),
    body: JSON.stringify({ key, value }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`saveAppData(${key}) failed (${res.status}): ${text}`);
  }
}

export async function loadBudgetState(workspaceId: string): Promise<BudgetState> {
  const fallback = emptyBudgetState();
  const loaded = await loadAppData(budgetKey(workspaceId), fallback);
  // Forward-compat: if the on-disk record is missing settings (older
  // partial save), backfill the defaults rather than crashing the page.
  return {
    ...fallback,
    ...loaded,
    settings: { ...DEFAULT_SETTINGS, ...(loaded.settings || {}) },
    schema_version: loaded.schema_version || BUDGET_SCHEMA_VERSION,
  };
}

function todayISODate(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function computeDailySnapshot(state: BudgetState): BudgetHistorySnapshot {
  const personal = state.categories.reduce((s, c) => {
    if (c.default_monthly_cents) return s + c.default_monthly_cents;
    if (c.default_biweekly_cents) return s + Math.round((c.default_biweekly_cents * 26) / 12);
    if (c.default_yearly_cents) return s + Math.round(c.default_yearly_cents / 12);
    return s;
  }, 0);
  const operating = state.properties.filter((p) => p.status === "operating");
  const rentalGross = operating.reduce(
    (s, p) => s + (p.rooms || []).filter((r) => r.occupied).reduce((ss, r) => ss + r.rent_cents, 0),
    0,
  );
  const rentalExp = operating.reduce((s, p) => {
    const gross = (p.rooms || []).filter((r) => r.occupied).reduce((ss, r) => ss + r.rent_cents, 0);
    return s + (p.expenses || []).reduce((ss, e) => {
      if (e.kind === "vacancy_pct") return ss + Math.round((gross * (e.pct_bps ?? state.settings.default_vacancy_bps)) / 10000);
      if (e.kind === "capex_pct") return ss + Math.round((gross * (e.pct_bps ?? state.settings.default_capex_bps)) / 10000);
      return ss + e.monthly_cents;
    }, 0);
  }, 0);
  const rentalNoi = rentalGross - rentalExp;
  const incomeMonthly = state.income_sources.reduce((s, i) => {
    switch (i.frequency) {
      case "weekly": return s + Math.round((i.net_amount_cents * 52) / 12);
      case "biweekly": return s + Math.round((i.net_amount_cents * 26) / 12);
      case "semimonthly": return s + i.net_amount_cents * 2;
      case "monthly": return s + i.net_amount_cents;
      case "yearly": return s + Math.round(i.net_amount_cents / 12);
      default: return s + i.net_amount_cents;
    }
  }, 0);
  const businessExp = state.business_expenses.reduce(
    (s, b) => s + (b.frequency === "yearly" ? Math.round(b.monthly_cents / 12) : b.frequency === "quarterly" ? Math.round(b.monthly_cents / 3) : b.monthly_cents),
    0,
  );
  const heroConservative = incomeMonthly + rentalGross - personal - rentalExp - businessExp;
  const propEquity = state.properties.reduce(
    (s, p) => s + (p.market_value_cents - p.mortgage_balance_cents),
    0,
  );
  const cash = state.assets.reduce((s, a) => s + a.balance_cents, 0);
  const debt = state.debts.reduce((s, d) => s + d.balance_cents, 0);
  return {
    day: todayISODate(),
    personal_monthly_cents: personal,
    rental_noi_cents: rentalNoi,
    net_worth_cents: propEquity + cash - debt,
    hero_conservative_cents: heroConservative,
    saved_this_month_cents: heroConservative,
  };
}

const MAX_HISTORY_ENTRIES = 365;

export async function saveBudgetState(
  workspaceId: string,
  state: BudgetState,
  userId: string | null,
): Promise<void> {
  // Append today's snapshot (or replace today's existing one) so the
  // history stays at one row per day.
  const snapshot = computeDailySnapshot(state);
  const prior = (state.history || []).filter((h) => h.day !== snapshot.day);
  const merged = [...prior, snapshot]
    .sort((a, b) => (a.day < b.day ? -1 : 1))
    .slice(-MAX_HISTORY_ENTRIES);

  const toSave: BudgetState = {
    ...state,
    last_modified_at: new Date().toISOString(),
    last_modified_by: userId,
    schema_version: BUDGET_SCHEMA_VERSION,
    history: merged,
  };
  await saveAppData(budgetKey(workspaceId), toSave);
}

function zeroCounts(): ImportCounts {
  return {
    categories: 0,
    income_sources: 0,
    properties: 0,
    property_expenses: 0,
    property_rooms: 0,
    business_expenses: 0,
    yearly_expenses: 0,
    assets: 0,
    debts: 0,
    heloc_model: 0,
    mom_loans: 0,
    mom_loan_payments: 0,
    retirement_contributions: 0,
    monthly_actuals: 0,
  };
}

export async function writePayload(
  workspaceId: string,
  userId: string | null,
  payload: ImportPayload,
): Promise<ImportResult> {
  const counts = zeroCounts();
  const warnings: string[] = [];
  const errors: string[] = [];

  if (!SUPA_URL || !SUPA_KEY) {
    errors.push("Supabase env vars not configured.");
    return { ok: false, counts, warnings, errors };
  }

  try {
    // Preserve user-editable settings across re-imports.
    const prior = await loadBudgetState(workspaceId);

    const state: BudgetState = {
      ...emptyBudgetState(),
      settings: prior.settings, // keep current hero mode, vacancy/CapEx defaults
      ...payload,
      imported_at: new Date().toISOString(),
      last_modified_at: new Date().toISOString(),
      last_modified_by: userId,
      schema_version: BUDGET_SCHEMA_VERSION,
    };

    // Resolve monthly_actuals → ensure each references a known category
    // label; drop unmatched ones with a warning.
    const knownLabels = new Set(
      state.categories.map((c) => c.label.trim().toLowerCase()),
    );
    state.monthly_actuals = state.monthly_actuals.filter((a) => {
      const matched = knownLabels.has(a.category_label.trim().toLowerCase());
      if (!matched) {
        warnings.push(`Skipped actual for unknown category "${a.category_label}".`);
      }
      return matched;
    });

    await saveBudgetState(workspaceId, state, userId);

    counts.categories = state.categories.length;
    counts.income_sources = state.income_sources.length;
    counts.properties = state.properties.length;
    counts.property_expenses = state.properties.reduce((s, p) => s + p.expenses.length, 0);
    counts.property_rooms = state.properties.reduce((s, p) => s + p.rooms.length, 0);
    counts.business_expenses = state.business_expenses.length;
    counts.yearly_expenses = state.yearly_expenses.length;
    counts.assets = state.assets.length;
    counts.debts = state.debts.length;
    counts.heloc_model = state.heloc_model ? 1 : 0;
    counts.mom_loans = state.mom_loans.length;
    counts.mom_loan_payments = state.mom_loans.reduce((s, m) => s + m.payments.length, 0);
    counts.retirement_contributions = state.retirement_contributions.length;
    counts.monthly_actuals = state.monthly_actuals.length;

    return { ok: true, counts, warnings, errors };
  } catch (e: unknown) {
    errors.push(e instanceof Error ? e.message : String(e));
    return { ok: false, counts, warnings, errors };
  }
}
