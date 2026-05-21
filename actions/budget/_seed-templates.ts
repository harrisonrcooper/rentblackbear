// Starter-budget templates.
//
// Pure module (NOT "use server") so both the `seedBudget` server action
// and `createBudgetAction` can build a fresh budget shape. A "use
// server" file may only export async functions, so the synchronous
// `buildSeedState` builder cannot live in seed.ts itself.
//
// Every amount is $0 — the template is a starting *shape* (envelopes,
// income lines, account stubs), never prefilled numbers.

import { emptyBudgetState } from "./_writer";
import type { BudgetState } from "./_writer";
import type { ImportCategory, ImportDebt, ImportProperty } from "./_types";

const FULL_CATEGORIES: ImportCategory[] = [
  // Giving
  { label: "Tithe", group_key: "giving", default_monthly_cents: 0, default_biweekly_cents: 0, default_yearly_cents: 0, sort_order: 0 },
  { label: "Other giving", group_key: "giving", default_monthly_cents: 0, default_biweekly_cents: 0, default_yearly_cents: 0, sort_order: 1 },
  // Housing
  { label: "Mortgage / Rent", group_key: "housing", default_monthly_cents: 0, default_biweekly_cents: 0, default_yearly_cents: 0, sort_order: 0 },
  { label: "Utilities", group_key: "housing", default_monthly_cents: 0, default_biweekly_cents: 0, default_yearly_cents: 0, sort_order: 1 },
  { label: "Internet", group_key: "housing", default_monthly_cents: 0, default_biweekly_cents: 0, default_yearly_cents: 0, sort_order: 2 },
  { label: "Cell phone", group_key: "housing", default_monthly_cents: 0, default_biweekly_cents: 0, default_yearly_cents: 0, sort_order: 3 },
  { label: "Cleaning supplies", group_key: "housing", default_monthly_cents: 0, default_biweekly_cents: 0, default_yearly_cents: 0, sort_order: 4 },
  { label: "House maintenance", group_key: "housing", default_monthly_cents: 0, default_biweekly_cents: 0, default_yearly_cents: 0, sort_order: 5 },
  // Transport
  { label: "Gas", group_key: "transport", default_monthly_cents: 0, default_biweekly_cents: 0, default_yearly_cents: 0, sort_order: 0 },
  { label: "Oil / maintenance", group_key: "transport", default_monthly_cents: 0, default_biweekly_cents: 0, default_yearly_cents: 0, sort_order: 1 },
  { label: "Car payment", group_key: "transport", default_monthly_cents: 0, default_biweekly_cents: 0, default_yearly_cents: 0, sort_order: 2 },
  // Food
  { label: "Groceries", group_key: "food", default_monthly_cents: 0, default_biweekly_cents: 0, default_yearly_cents: 0, sort_order: 0 },
  { label: "Restaurants", group_key: "food", default_monthly_cents: 0, default_biweekly_cents: 0, default_yearly_cents: 0, sort_order: 1 },
  // Personal
  { label: "Gym / fitness", group_key: "personal", default_monthly_cents: 0, default_biweekly_cents: 0, default_yearly_cents: 0, sort_order: 0 },
  { label: "Streaming / subscriptions", group_key: "personal", default_monthly_cents: 0, default_biweekly_cents: 0, default_yearly_cents: 0, sort_order: 1 },
  { label: "Personal care", group_key: "personal", default_monthly_cents: 0, default_biweekly_cents: 0, default_yearly_cents: 0, sort_order: 2 },
  { label: "Medicine / doctors", group_key: "personal", default_monthly_cents: 0, default_biweekly_cents: 0, default_yearly_cents: 0, sort_order: 3 },
  { label: "Miscellaneous", group_key: "personal", default_monthly_cents: 0, default_biweekly_cents: 0, default_yearly_cents: 0, sort_order: 4 },
  // Kids
  { label: "Activities", group_key: "kids", default_monthly_cents: 0, default_biweekly_cents: 0, default_yearly_cents: 0, sort_order: 0 },
  { label: "Childcare / school", group_key: "kids", default_monthly_cents: 0, default_biweekly_cents: 0, default_yearly_cents: 0, sort_order: 1 },
  // Debt
  { label: "Student loans", group_key: "debt", default_monthly_cents: 0, default_biweekly_cents: 0, default_yearly_cents: 0, sort_order: 0 },
  // Yearly
  { label: "Car insurance", group_key: "yearly", default_monthly_cents: 0, default_biweekly_cents: 0, default_yearly_cents: 0, sort_order: 0 },
  { label: "Vehicle tags / registration", group_key: "yearly", default_monthly_cents: 0, default_biweekly_cents: 0, default_yearly_cents: 0, sort_order: 1 },
  { label: "Property taxes", group_key: "yearly", default_monthly_cents: 0, default_biweekly_cents: 0, default_yearly_cents: 0, sort_order: 2 },
  // Retirement
  { label: "Retirement contributions", group_key: "retirement", default_monthly_cents: 0, default_biweekly_cents: 0, default_yearly_cents: 0, sort_order: 0 },
];

// Basic-mode envelopes — the categories an average household actually
// uses week to week. No rental concepts, no business-finance lines,
// no retirement bucket (kept invisible until they care).
const BASIC_CATEGORIES: ImportCategory[] = [
  { label: "Rent / Mortgage", group_key: "housing", default_monthly_cents: 0, default_biweekly_cents: 0, default_yearly_cents: 0, sort_order: 0 },
  { label: "Utilities", group_key: "housing", default_monthly_cents: 0, default_biweekly_cents: 0, default_yearly_cents: 0, sort_order: 1 },
  { label: "Internet & phone", group_key: "housing", default_monthly_cents: 0, default_biweekly_cents: 0, default_yearly_cents: 0, sort_order: 2 },
  { label: "Gas", group_key: "transport", default_monthly_cents: 0, default_biweekly_cents: 0, default_yearly_cents: 0, sort_order: 0 },
  { label: "Car payment & insurance", group_key: "transport", default_monthly_cents: 0, default_biweekly_cents: 0, default_yearly_cents: 0, sort_order: 1 },
  { label: "Groceries", group_key: "food", default_monthly_cents: 0, default_biweekly_cents: 0, default_yearly_cents: 0, sort_order: 0 },
  { label: "Eating out", group_key: "food", default_monthly_cents: 0, default_biweekly_cents: 0, default_yearly_cents: 0, sort_order: 1 },
  { label: "Subscriptions", group_key: "personal", default_monthly_cents: 0, default_biweekly_cents: 0, default_yearly_cents: 0, sort_order: 0 },
  { label: "Personal & medical", group_key: "personal", default_monthly_cents: 0, default_biweekly_cents: 0, default_yearly_cents: 0, sort_order: 1 },
  { label: "Fun money", group_key: "personal", default_monthly_cents: 0, default_biweekly_cents: 0, default_yearly_cents: 0, sort_order: 2 },
];

const TEMPLATE_PROPERTY: ImportProperty = {
  label: "First property",
  address: null,
  status: "operating",
  market_value_cents: 0,
  mortgage_balance_cents: 0,
  mortgage_payment_cents: 0,
  mortgage_rate_bps: null,
  mortgage_term_years: null,
  mortgage_origin_date: null,
  vacancy_bps_override: null,
  capex_bps_override: null,
  sort_order: 0,
  notes: null,
  expenses: [
    { label: "Mortgage", kind: "fixed", monthly_cents: 0, pct_bps: null, sort_order: 0 },
    { label: "Utilities", kind: "fixed", monthly_cents: 0, pct_bps: null, sort_order: 1 },
    { label: "Insurance", kind: "fixed", monthly_cents: 0, pct_bps: null, sort_order: 2 },
    { label: "Property tax", kind: "fixed", monthly_cents: 0, pct_bps: null, sort_order: 3 },
    { label: "Maintenance", kind: "fixed", monthly_cents: 0, pct_bps: null, sort_order: 4 },
    { label: "Vacancy reserve", kind: "vacancy_pct", monthly_cents: 0, pct_bps: 1000, sort_order: 5 },
    { label: "CapEx reserve", kind: "capex_pct", monthly_cents: 0, pct_bps: 500, sort_order: 6 },
  ],
  rooms: [
    { label: "Bedroom 1", rent_cents: 0, occupied: false, sort_order: 0 },
    { label: "Bedroom 2", rent_cents: 0, occupied: false, sort_order: 1 },
    { label: "Bedroom 3", rent_cents: 0, occupied: false, sort_order: 2 },
  ],
};

const TEMPLATE_DEBTS: ImportDebt[] = [
  { label: "Mortgage (primary home)", kind: "other", balance_cents: 0, original_amount_cents: null, monthly_payment_cents: 0, interest_rate_bps: null, sort_order: 0 },
];

// Build a fresh, never-imported budget from one of the two flavors:
//   - "basic" → newcomer household: paycheck envelopes, two cash
//     accounts, no rentals / business / retirement projection.
//   - "full"  → power-user property-manager template.
export function buildSeedState(experience: "basic" | "full"): BudgetState {
  const base = emptyBudgetState();

  if (experience === "basic") {
    return {
      ...base,
      settings: { ...base.settings, experience: "basic" as const, hero_mode: "conservative" as const },
      categories: BASIC_CATEGORIES,
      income_sources: [
        { label: "Paycheck (you)", owner: "harrison" as const, source_type: "salary" as const, frequency: "biweekly" as const, net_amount_cents: 0 },
        { label: "Paycheck (partner)", owner: "wife" as const, source_type: "salary" as const, frequency: "biweekly" as const, net_amount_cents: 0 },
      ],
      assets: [
        { label: "Checking", kind: "cash" as const, balance_cents: 0, sort_order: 0 },
        { label: "Savings", kind: "cash" as const, balance_cents: 0, sort_order: 1 },
      ],
      imported_at: new Date().toISOString(),
    };
  }

  // FULL — original property-manager template.
  return {
    ...base,
    settings: { ...base.settings, experience: "full" as const },
    categories: FULL_CATEGORIES,
    income_sources: [
      { label: "Primary income (you)", owner: "harrison" as const, source_type: "salary" as const, frequency: "biweekly" as const, net_amount_cents: 0 },
      { label: "Secondary income (partner)", owner: "wife" as const, source_type: "salary" as const, frequency: "biweekly" as const, net_amount_cents: 0 },
    ],
    properties: [TEMPLATE_PROPERTY],
    assets: [
      { label: "Checking", kind: "cash" as const, balance_cents: 0, sort_order: 0 },
      { label: "Savings", kind: "cash" as const, balance_cents: 0, sort_order: 1 },
      { label: "Retirement", kind: "retirement" as const, balance_cents: 0, sort_order: 2 },
    ],
    debts: TEMPLATE_DEBTS,
    imported_at: new Date().toISOString(),
  };
}
