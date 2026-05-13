// 12-month cash flow forecast. Combines current run-rate
// income/expenses with the daily auto-snapshot history to produce a
// "looking-back / looking-forward" time series.
//
// All values in cents.

import { incomeMonthly, categoryMonthly } from "./money";
import { propertyMonthlyGross, propertyMonthlyExpenses, computeNetWorthCents } from "./calc";

// Convert a Date to "YYYY-MM" — used as the time bucket key.
function monthKey(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

// Display label for a month — "Jan 26", "Feb 26", etc.
function monthLabel(d) {
  return d.toLocaleDateString("en-US", { month: "short", year: "2-digit" });
}

export function computeForecast(state, opts = {}) {
  const horizonMonths = opts.horizonMonths ?? 12;
  const historyMonths = opts.historyMonths ?? 6;

  // Base monthly figures from current state.
  const incomeMonthlyTotal = (state.income_sources || []).reduce((s, i) => s + incomeMonthly(i), 0);
  const operatingProps = (state.properties || []).filter((p) => p.status === "operating");
  const rentalGross = operatingProps.reduce((s, p) => s + propertyMonthlyGross(p), 0);
  const personalExp = (state.categories || []).reduce((s, c) => s + categoryMonthly(c), 0);
  const businessExp = (state.business_expenses || []).reduce((s, b) => {
    if (b.frequency === "yearly")    return s + Math.round(b.monthly_cents / 12);
    if (b.frequency === "quarterly") return s + Math.round(b.monthly_cents / 3);
    return s + b.monthly_cents;
  }, 0);
  const rentalExp = operatingProps.reduce((s, p) => s + propertyMonthlyExpenses(p, state.settings), 0);

  const baseIncome = incomeMonthlyTotal + rentalGross;
  const baseExpenses = personalExp + businessExp + rentalExp;
  const baseNet = baseIncome - baseExpenses;

  // Index history by month — keep the most recent snapshot per month
  // so we collapse daily snapshots into one "end of month" point.
  const histByMonth = new Map();
  for (const h of (state.history || [])) {
    if (!h.day) continue;
    const key = h.day.slice(0, 7);
    const prev = histByMonth.get(key);
    if (!prev || prev.day < h.day) histByMonth.set(key, h);
  }

  // Sum of actual logged expenses per month (envelopes data) — gives
  // us a real "expenses_actual" line for months where the user
  // actually logged spending.
  const actualByMonth = new Map();
  for (const a of (state.monthly_actuals || [])) {
    if (!a.month) continue;
    const key = a.month.slice(0, 7);
    actualByMonth.set(key, (actualByMonth.get(key) || 0) + (a.amount_cents || 0));
  }

  // Build the series.
  const today = new Date();
  const series = [];
  for (let i = -historyMonths; i < horizonMonths; i++) {
    const d = new Date(today.getFullYear(), today.getMonth() + i, 1);
    const key = monthKey(d);
    const isFuture = i > 0;
    const isCurrent = i === 0;
    const snap = histByMonth.get(key);
    const actualSpent = actualByMonth.get(key);

    let income, expenses, net;
    if (isFuture) {
      income = baseIncome;
      expenses = baseExpenses;
      net = baseNet;
    } else if (snap) {
      // historical snapshot — we have a real conservative-net number.
      net = snap.hero_conservative_cents;
      income = baseIncome;          // run-rate approximation
      expenses = baseIncome - net;   // back-derived
    } else {
      income = baseIncome;
      expenses = baseExpenses;
      net = baseNet;
    }

    // Prefer real logged actuals over derived ones when available.
    if (actualSpent != null && !isFuture) {
      expenses = actualSpent;
      net = income - actualSpent;
    }

    series.push({
      month: key,
      label: monthLabel(d),
      income_cents: Math.round(income),
      expenses_cents: Math.round(expenses),
      net_cents: Math.round(net),
      is_future: isFuture,
      is_current: isCurrent,
    });
  }

  // Cumulative savings line over the future horizon — starts at 0 in
  // the current month and accumulates baseNet per month thereafter.
  let cum = 0;
  for (const row of series) {
    if (row.is_future || row.is_current) {
      cum += row.net_cents;
      row.cumulative_net_cents = cum;
    } else {
      row.cumulative_net_cents = null;
    }
  }

  const startingNetWorth = computeNetWorthCents(state);
  return {
    series,
    monthlyAvgNet: baseNet,
    annualRunRate: baseNet * 12,
    netWorthNow: startingNetWorth,
    netWorthIn12Months: startingNetWorth + cum,
    baseIncome,
    baseExpenses,
  };
}
