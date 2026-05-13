// Net worth math: allocation, projection, FIRE. All inputs in cents,
// all returns in basis points. Pure functions — no React, no I/O.

import { incomeMonthly, categoryMonthly } from "./money";

// Asset allocation across the major classes, plus a "Debts" slice
// rendered separately so the viewer sees the gross-vs-net picture.
// Each result row carries a color the donut can render directly.
export function computeAllocation(state) {
  const buckets = {
    real_estate: { label: "Real Estate", color: "#4a7c59", value_cents: 0 },
    cash:        { label: "Cash",        color: "#138a60", value_cents: 0 },
    retirement:  { label: "Retirement",  color: "#8c5ad9", value_cents: 0 },
    investment:  { label: "Investments", color: "#3b6fd1", value_cents: 0 },
    vehicle:     { label: "Vehicles",    color: "#c88318", value_cents: 0 },
    other:       { label: "Other",       color: "#5f6675", value_cents: 0 },
  };

  // Real estate equity (only meaningful for properties we still hold).
  for (const p of state.properties || []) {
    if (p.status === "sold") continue;
    const equity = (p.market_value_cents || 0) - (p.mortgage_balance_cents || 0);
    if (equity > 0) buckets.real_estate.value_cents += equity;
  }

  // Accounts by kind.
  for (const a of state.assets || []) {
    const v = a.balance_cents || 0;
    if (v <= 0) continue;
    const k = a.kind || "cash";
    if (buckets[k]) buckets[k].value_cents += v;
    else buckets.other.value_cents += v;
  }

  // Total non-debt value.
  const grossAssets = Object.values(buckets).reduce((s, b) => s + b.value_cents, 0);
  const debt = (state.debts || []).reduce((s, d) => s + (d.balance_cents || 0), 0);
  const net = grossAssets - debt;

  const rows = Object.values(buckets)
    .filter((b) => b.value_cents > 0)
    .map((b) => ({
      ...b,
      pct: grossAssets > 0 ? (b.value_cents / grossAssets) * 100 : 0,
    }));

  return { rows, grossAssets, debt, net };
}

// Year-by-year projection. Inputs in cents. Returns:
//   series: [{ year, balance_cents }]  -- starting with year 0 = today
//   finalBalance, finalYear
//
// Math: start with `startingBalance`. Each year, multiply by (1 + r)
// then add `annualContribution`. Compounding is annual (good enough
// for a "what could this become" tool — exact monthly compounding is
// noise at this resolution).
export function computeRetirementProjection({
  startingBalanceCents,
  annualContributionCents,
  annualReturnBps,
  horizonYears,
  startYear,
}) {
  const r = (annualReturnBps || 0) / 10000;
  const years = Math.max(0, Math.min(80, horizonYears || 0));
  const base = new Date().getFullYear();
  const series = [];
  let balance = startingBalanceCents || 0;
  series.push({ year: startYear ?? base, balance_cents: Math.round(balance) });
  for (let i = 1; i <= years; i++) {
    balance = balance * (1 + r) + (annualContributionCents || 0);
    series.push({ year: (startYear ?? base) + i, balance_cents: Math.round(balance) });
  }
  return {
    series,
    finalBalance: Math.round(balance),
    finalYear: (startYear ?? base) + years,
  };
}

// 4% rule (or custom safe-withdrawal-rate) calculator. Pulls expenses
// from the current personal categories + business expenses. Returns:
//   annualExpensesCents
//   fireNumberCents       = annualExpenses × multiple  (e.g. 25)
//   liquidNetWorthCents   = cash + retirement + investments  (no RE equity, no vehicles)
//   progressPct           = liquid / fire * 100
//   yearsToFire           = iterative forecast given current savings rate (or null if not progressing)
export function computeFireMetrics(state, opts = {}) {
  const multiple = opts.multiple ?? 25;
  const annualReturnBps = opts.annualReturnBps ?? 700;
  const r = annualReturnBps / 10000;

  const personalMonthly = (state.categories || []).reduce((s, c) => s + categoryMonthly(c), 0);
  const businessMonthly = (state.business_expenses || []).reduce(
    (s, b) => s + (
      b.frequency === "yearly"    ? Math.round(b.monthly_cents / 12) :
      b.frequency === "quarterly" ? Math.round(b.monthly_cents / 3)  :
      b.monthly_cents
    ),
    0,
  );
  const annualExpenses = (personalMonthly + businessMonthly) * 12;
  const fireNumber = annualExpenses * multiple;

  const liquid = (state.assets || []).reduce((s, a) => {
    const k = a.kind || "cash";
    if (k === "cash" || k === "retirement" || k === "investment") return s + (a.balance_cents || 0);
    return s;
  }, 0);

  const incomeMonthlyTotal = (state.income_sources || []).reduce((s, i) => s + incomeMonthly(i), 0);
  const monthlySurplus = incomeMonthlyTotal - personalMonthly - businessMonthly;
  const annualContribution = Math.max(0, monthlySurplus * 12);

  // Iterate year-by-year until we hit FIRE or 60 years (give up gracefully).
  let yearsToFire = null;
  if (annualExpenses > 0) {
    let bal = liquid;
    for (let y = 0; y <= 60; y++) {
      if (bal >= fireNumber) { yearsToFire = y; break; }
      bal = bal * (1 + r) + annualContribution;
    }
  }

  return {
    annualExpensesCents: annualExpenses,
    fireNumberCents: fireNumber,
    liquidNetWorthCents: liquid,
    progressPct: fireNumber > 0 ? Math.min(100, (liquid / fireNumber) * 100) : 0,
    monthlySurplusCents: monthlySurplus,
    annualContributionCents: annualContribution,
    yearsToFire,
  };
}

// Helper to seed default retirement-projection inputs from existing
// state: last-year-tracked contributions, current retirement balance,
// 7% return, 30-year horizon.
export function defaultProjectionInputs(state) {
  const retirementAssets = (state.assets || [])
    .filter((a) => (a.kind || "cash") === "retirement")
    .reduce((s, a) => s + (a.balance_cents || 0), 0);
  // Annual contribution = the most recent retirement_contribution row.
  const contribs = (state.retirement_contributions || []).slice().sort((a, b) => a.year - b.year);
  const lastContribution = contribs.length > 0 ? contribs[contribs.length - 1].amount_cents : 0;
  return {
    startingBalanceCents: retirementAssets,
    annualContributionCents: lastContribution,
    annualReturnBps: state.settings?.retirement_return_bps ?? 700,
    horizonYears: state.settings?.retirement_horizon_years ?? 30,
  };
}
