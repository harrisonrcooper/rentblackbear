// Envelope budgeting math (Dave Ramsey / EveryDollar style).
//
// Model:
//   * Each category has a per-month "budget" (its default_monthly_cents).
//   * At the start of every month, that budget is "deposited" into the
//     envelope, on top of whatever rolled over from prior months.
//   * Every logged expense (a monthly_actuals row) withdraws from the
//     envelope.
//   * "Available now" for a given category in a given month =
//        Σ(budget × number_of_months_from_start_through_this_month)
//      − Σ(spent_in_those_months)
//
// All values in cents. All months in ISO YYYY-MM-01.

import { categoryMonthly } from "./money";

// First-of-month for any ISO-date input. Tolerates YYYY-MM-DD and
// YYYY-MM. Returns YYYY-MM-01.
function firstOfMonth(iso) {
  if (!iso) return null;
  const m = String(iso).match(/^(\d{4})-(\d{2})/);
  if (!m) return null;
  return `${m[1]}-${m[2]}-01`;
}

// Number of whole months from `from` to `to` (inclusive on both ends).
// e.g. monthsBetween("2026-01-01", "2026-03-01") === 3.
export function monthsBetween(fromIso, toIso) {
  const a = new Date(fromIso);
  const b = new Date(toIso);
  if (isNaN(a) || isNaN(b)) return 0;
  return (b.getFullYear() - a.getFullYear()) * 12 + (b.getMonth() - a.getMonth()) + 1;
}

// Earliest month we should start "depositing" envelope budgets from.
// Falls back to today's month if there's nothing else to anchor on.
export function envelopeStartMonth(state) {
  const candidates = [];
  if (state.imported_at) candidates.push(firstOfMonth(state.imported_at));
  for (const a of state.monthly_actuals || []) {
    if (a.month) candidates.push(a.month);
  }
  if (state.last_modified_at) candidates.push(firstOfMonth(state.last_modified_at));
  if (candidates.length === 0) {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-01`;
  }
  return candidates.sort()[0];
}

// All entries for a given (category, month), sorted oldest-first.
export function entriesForMonth(state, categoryLabel, monthIso) {
  const lc = categoryLabel.trim().toLowerCase();
  return (state.monthly_actuals || [])
    .filter((a) => a.category_label.trim().toLowerCase() === lc && a.month === monthIso)
    .sort((x, y) => {
      const xa = x.paid_on || x.month;
      const ya = y.paid_on || y.month;
      return xa < ya ? -1 : xa > ya ? 1 : 0;
    });
}

// Sum of all spending for (category) across all months < the cutoff.
function spentBeforeMonth(state, categoryLabel, cutoffMonthIso) {
  const lc = categoryLabel.trim().toLowerCase();
  return (state.monthly_actuals || [])
    .filter((a) => a.category_label.trim().toLowerCase() === lc && a.month < cutoffMonthIso)
    .reduce((s, a) => s + a.amount_cents, 0);
}

// Sum of all spending for (category) in a specific month.
function spentInMonth(state, categoryLabel, monthIso) {
  const lc = categoryLabel.trim().toLowerCase();
  return (state.monthly_actuals || [])
    .filter((a) => a.category_label.trim().toLowerCase() === lc && a.month === monthIso)
    .reduce((s, a) => s + a.amount_cents, 0);
}

// The full envelope snapshot for one category in one month.
//
// Fields:
//   budget            — this month's allocation
//   carryover         — net rollover from all prior months (can be negative)
//   thisMonthSpent    — already spent in this month
//   available         — what's left to spend right now
//   priorMonths       — count of months counted in carryover
//   priorBudget       — Σ budget over prior months
//   priorSpent        — Σ spent in prior months
//   entries           — chronological list of this-month entries
export function envelopeBalance(state, category, monthIso, startMonth) {
  const budget = categoryMonthly(category);
  const prior = Math.max(0, monthsBetween(startMonth, monthIso) - 1);
  const priorBudget = prior * budget;
  const priorSpent = spentBeforeMonth(state, category.label, monthIso);
  const carryover = priorBudget - priorSpent;
  const thisMonthSpent = spentInMonth(state, category.label, monthIso);
  const available = carryover + budget - thisMonthSpent;
  const entries = entriesForMonth(state, category.label, monthIso);
  return {
    budget,
    carryover,
    thisMonthSpent,
    available,
    priorMonths: prior,
    priorBudget,
    priorSpent,
    entries,
  };
}

// Bulk-paste parser. Accepts free-form lines and tries to extract an
// amount + a description per line. Examples:
//   "Costco run 45"          → { amount: 4500, note: "Costco run" }
//   "$12.99 spotify"         → { amount: 1299, note: "spotify" }
//   "Restaurants: 38.50"     → { amount: 3850, note: "Restaurants" }
//   "13 walmart"             → { amount: 1300, note: "walmart" }
// Returns array of { amount_cents, note } — caller picks the category.
export function parseBulkPaste(text) {
  const out = [];
  for (const raw of String(text || "").split(/\r?\n/)) {
    const line = raw.trim();
    if (!line) continue;
    // Find the first money-shaped token (with or without leading $).
    const m = line.match(/\$?\s*(\d{1,6}(?:[.,]\d{1,2})?)/);
    if (!m) continue;
    const numStr = m[1].replace(",", ".");
    const num = parseFloat(numStr);
    if (isNaN(num) || num <= 0) continue;
    const amount_cents = Math.round(num * 100);
    // The note is everything else on the line, cleaned up.
    const note = line.replace(m[0], "").replace(/[:\-—–]/g, " ").replace(/\s+/g, " ").trim();
    out.push({ amount_cents, note: note || undefined });
  }
  return out;
}
