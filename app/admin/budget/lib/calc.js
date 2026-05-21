// Pure math helpers — no React, no I/O. Everything in cents (integer).

import { biweeklyToMonthly, yearlyToMonthly, incomeMonthly, categoryMonthly } from "./money";

export const propertyMonthlyGross = (p) =>
  (p.rooms || []).filter((r) => r.occupied).reduce((s, r) => s + r.rent_cents, 0);

// Rental share of a property: 1 for a pure rental, 0.5 for a 50/50
// owner-occupied house hack. `personal_use_bps` is clamped to [0,10000].
export function propertyRentalShare(p) {
  const bps = Math.min(10000, Math.max(0, p.personal_use_bps || 0));
  return 1 - bps / 10000;
}

// Operating expenses only — the editable expense rows (fixed costs +
// vacancy / CapEx reserves computed live from gross rent). Percentage
// rows defer to their own pct_bps or the workspace-level defaults.
// Does NOT include the per-property HELOC (that's debt service held
// outside the rows — see propertyHelocPayment).
//
// House hack: when a property is partly owner-occupied, only the
// rental share of FIXED building costs (mortgage, taxes, utilities…)
// is a rental expense. Vacancy/CapEx rows are NOT split — they're a
// percentage of rental gross, which is already 100% rental income.
export function propertyOperatingExpenses(p, settings) {
  const grossRent = propertyMonthlyGross(p);
  const rentalShare = propertyRentalShare(p);
  let total = 0;
  for (const e of p.expenses || []) {
    if (e.kind === "vacancy_pct") {
      const bps = e.pct_bps ?? settings.default_vacancy_bps;
      total += Math.round((grossRent * bps) / 10000);
    } else if (e.kind === "capex_pct") {
      const bps = e.pct_bps ?? settings.default_capex_bps;
      total += Math.round((grossRent * bps) / 10000);
    } else {
      total += Math.round(e.monthly_cents * rentalShare);
    }
  }
  return total;
}

// Per-property HELOC monthly payment. A manual `heloc_payment_cents`
// override wins; otherwise the payment is interest-only — balance ×
// annual rate ÷ 12 — which is how a HELOC behaves in its draw period.
// Auto mode recomputes live as balance/rate change (never frozen).
export function propertyHelocPayment(p) {
  const override = p.heloc_payment_cents;
  if (override != null && override > 0) return override;
  const balance = p.heloc_balance_cents || 0;
  const rateBps = p.heloc_rate_bps ?? 0;
  if (balance <= 0 || rateBps <= 0) return 0;
  return Math.round((balance * (rateBps / 10000)) / 12);
}

// Total monthly cash out for a property: operating expenses + HELOC
// debt service. (Mortgage P&I is already modeled as an expense row,
// so it is captured inside propertyOperatingExpenses.)
export function propertyMonthlyExpenses(p, settings) {
  return propertyOperatingExpenses(p, settings) + propertyHelocPayment(p);
}

export const propertyMonthlyNet = (p, settings) =>
  propertyMonthlyGross(p) - propertyMonthlyExpenses(p, settings);

export function computeNetWorthCents(state) {
  const propEquity = state.properties.reduce(
    (s, p) => s + (p.market_value_cents - p.mortgage_balance_cents),
    0,
  );
  const cash = state.assets.reduce((s, a) => s + a.balance_cents, 0);
  const debt = state.debts.reduce((s, d) => s + d.balance_cents, 0);
  return propEquity + cash - debt;
}

// Hero math — returns all three "saved this month" flavors plus the
// constituent totals (used by the In/Out summary pills and the
// envelope view's headline).
export function computeHero(state) {
  const incomeMonthlyTotal = state.income_sources.reduce((s, i) => s + incomeMonthly(i), 0);
  const personalMonthlyTotal = state.categories.reduce((s, c) => s + categoryMonthly(c), 0);
  const businessMonthlyTotal = state.business_expenses.reduce(
    (s, b) => s + (
      b.frequency === "yearly"    ? Math.round(b.monthly_cents / 12) :
      b.frequency === "quarterly" ? Math.round(b.monthly_cents / 3)  :
      b.monthly_cents
    ),
    0,
  );

  const operatingProps = state.properties.filter((p) => p.status === "operating");
  const rentalGross = operatingProps.reduce((s, p) => s + propertyMonthlyGross(p), 0);
  const rentalExpensesWithReserves = operatingProps.reduce(
    (s, p) => s + propertyMonthlyExpenses(p, state.settings),
    0,
  );
  const rentalExpensesNoReserves = operatingProps.reduce(
    (s, p) =>
      s
      + (p.expenses || []).filter((e) => e.kind === "fixed").reduce((ss, e) => ss + e.monthly_cents, 0)
      + propertyHelocPayment(p), // HELOC is debt service, not a reserve — counts in both views
    0,
  );

  const conservative = incomeMonthlyTotal + rentalGross - personalMonthlyTotal - rentalExpensesWithReserves - businessMonthlyTotal;
  const optimistic = incomeMonthlyTotal + rentalGross - personalMonthlyTotal - rentalExpensesNoReserves - businessMonthlyTotal;
  const rentalsOnly = rentalGross - rentalExpensesWithReserves;

  return {
    conservative,
    optimistic,
    rentals_only: rentalsOnly,
    incomeMonthlyTotal,
    personalMonthlyTotal,
    rentalGross,
    rentalExpensesWithReserves,
    rentalExpensesNoReserves,
    businessMonthlyTotal,
  };
}

// Random ID helper for client-side new-record IDs. Server reads these
// as opaque strings; when we migrate off JSONB we'll switch to uuids
// generated server-side.
export function genId() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

export function todayISODate() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
