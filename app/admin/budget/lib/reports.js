// Reports math — pulls monthly snapshots from `state.history`,
// per-category aggregates from `state.monthly_actuals`, and produces
// the time-series each report chart needs. All values in cents.

import { incomeMonthly, categoryMonthly } from "./money";
import { propertyMonthlyGross, propertyMonthlyExpenses } from "./calc";

const DAY_MS = 86400000;

function monthKey(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}
function monthLabel(d) {
  return d.toLocaleDateString("en-US", { month: "short", year: "2-digit" });
}

function rangeStartDate(range, now = new Date()) {
  // `range` of null / "all" returns null so the caller can short-circuit.
  if (!range || range === "all") return null;
  const map = { "1m": 1, "3m": 3, "6m": 6, "1y": 12, "2y": 24, "5y": 60 };
  const months = map[range] ?? 12;
  return new Date(now.getFullYear(), now.getMonth() - months + 1, 1);
}

// Current run-rate income / expenses derived from state. Used as the
// fallback when there isn't a history snapshot for a given month —
// gives us a sane line instead of a hole.
function runRateBase(state) {
  const incomeMonthlyTotal = (state.income_sources || []).reduce((s, i) => s + incomeMonthly(i), 0);
  const operating = (state.properties || []).filter((p) => p.status === "operating");
  const rentalGross = operating.reduce((s, p) => s + propertyMonthlyGross(p), 0);
  const personalExp = (state.categories || []).reduce((s, c) => s + categoryMonthly(c), 0);
  const businessExp = (state.business_expenses || []).reduce((s, b) => {
    if (b.frequency === "yearly") return s + Math.round(b.monthly_cents / 12);
    if (b.frequency === "quarterly") return s + Math.round(b.monthly_cents / 3);
    return s + b.monthly_cents;
  }, 0);
  const rentalExp = operating.reduce((s, p) => s + propertyMonthlyExpenses(p, state.settings), 0);
  return {
    income: incomeMonthlyTotal + rentalGross,
    expenses: personalExp + businessExp + rentalExp,
  };
}

// One row per month covering `range`. Each row:
//   month, label, income, expenses, net, savings_rate_bps, net_worth
//
// Strategy: bucket history by month (most-recent snapshot per bucket
// wins), then walk the month range and fill in:
//   – `net_worth` from the latest snapshot in that month, else carry forward
//   – `net` from snapshot.hero_conservative_cents (the run-rate value
//     we already write nightly), else fall back to run-rate base
//   – `expenses` overridden by `monthly_actuals` totals if any are logged
export function computeMonthlySnapshots(state, range = "1y") {
  const base = runRateBase(state);

  // Bucket the daily history by month → keep the latest snapshot.
  const histByMonth = new Map();
  for (const h of (state.history || [])) {
    if (!h.day) continue;
    const k = h.day.slice(0, 7);
    const prev = histByMonth.get(k);
    if (!prev || prev.day < h.day) histByMonth.set(k, h);
  }

  // Bucket logged spending by (month, total).
  const actualsByMonth = new Map();
  for (const a of (state.monthly_actuals || [])) {
    if (!a.month) continue;
    const k = a.month.slice(0, 7);
    actualsByMonth.set(k, (actualsByMonth.get(k) || 0) + (a.amount_cents || 0));
  }

  // Span: from the earliest month in history (or range-start) to today.
  const today = new Date();
  const todayKey = monthKey(today);
  const earliest = (() => {
    const candidates = [];
    if (state.imported_at) candidates.push(state.imported_at.slice(0, 7));
    for (const k of histByMonth.keys()) candidates.push(k);
    for (const k of actualsByMonth.keys()) candidates.push(k);
    if (candidates.length === 0) return todayKey;
    return candidates.sort()[0];
  })();
  const rangeStart = rangeStartDate(range);
  const startKey = rangeStart ? monthKey(rangeStart) : earliest;
  const effectiveStart = startKey > earliest ? startKey : earliest;

  // Walk month-by-month.
  const rows = [];
  let cursor = new Date(parseInt(effectiveStart.slice(0, 4), 10), parseInt(effectiveStart.slice(5, 7), 10) - 1, 1);
  const end = new Date(today.getFullYear(), today.getMonth(), 1);
  let carriedNetWorth = null;

  while (cursor <= end) {
    const k = monthKey(cursor);
    const snap = histByMonth.get(k);
    const actuals = actualsByMonth.get(k);

    let income = base.income;
    let expenses = base.expenses;
    let net;

    if (actuals != null) {
      expenses = actuals;
      net = income - expenses;
    } else if (snap) {
      net = snap.hero_conservative_cents;
      expenses = income - net;
    } else {
      net = base.income - base.expenses;
    }

    const netWorth = snap?.net_worth_cents ?? carriedNetWorth ?? 0;
    if (snap?.net_worth_cents != null) carriedNetWorth = snap.net_worth_cents;

    const savingsRateBps = income > 0 ? Math.round((net / income) * 10000) : 0;

    rows.push({
      month: k,
      label: monthLabel(cursor),
      income_cents: Math.round(income),
      expenses_cents: Math.round(expenses),
      net_cents: Math.round(net),
      net_worth_cents: Math.round(netWorth),
      savings_rate_bps: savingsRateBps,
    });

    cursor = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1);
  }

  return rows;
}

// Per-category monthly spend within the range. Returns:
//   { month, label, amount_cents }[]
// Months with no spend show up as zero rather than disappearing, so
// the line chart reads honestly.
export function computeCategoryTrend(state, categoryLabel, range = "1y") {
  if (!categoryLabel) return [];
  const lc = categoryLabel.trim().toLowerCase();
  const byMonth = new Map();
  for (const a of (state.monthly_actuals || [])) {
    if (!a.month) continue;
    if ((a.category_label || "").trim().toLowerCase() !== lc) continue;
    const k = a.month.slice(0, 7);
    byMonth.set(k, (byMonth.get(k) || 0) + (a.amount_cents || 0));
  }

  const today = new Date();
  const start = rangeStartDate(range) || new Date(today.getFullYear() - 1, today.getMonth(), 1);
  const rows = [];
  let cursor = new Date(start.getFullYear(), start.getMonth(), 1);
  const end = new Date(today.getFullYear(), today.getMonth(), 1);
  while (cursor <= end) {
    const k = monthKey(cursor);
    rows.push({
      month: k,
      label: monthLabel(cursor),
      amount_cents: byMonth.get(k) || 0,
    });
    cursor = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1);
  }
  return rows;
}

// Cumulative savings line. Each row gets a `cumulative_net_cents`
// snapshot of "money saved so far" since the start of the range.
export function withCumulativeNet(rows) {
  let acc = 0;
  return rows.map((r) => {
    acc += r.net_cents;
    return { ...r, cumulative_net_cents: acc };
  });
}

export const REPORT_RANGES = [
  { id: "3m",  label: "3 mo"  },
  { id: "6m",  label: "6 mo"  },
  { id: "1y",  label: "1 yr"  },
  { id: "2y",  label: "2 yr"  },
  { id: "all", label: "All"   },
];
