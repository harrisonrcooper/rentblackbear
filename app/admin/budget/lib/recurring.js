// Recurring-transaction detector.
//
// Walks Plaid transactions, groups by merchant, looks for at least 3
// occurrences whose date spacing matches a known cadence (weekly,
// biweekly, monthly, quarterly, yearly), and whose amounts are stable
// (median absolute deviation ≤ 10% of median). Emits one suggestion
// per cluster, suitable for one-click "add as bill."
//
// Why ≥3 instead of ≥2? Two same-merchant charges 30 days apart could
// be a coincidence — paid for the same thing twice. Three is the
// smallest count that meaningfully rules out two-off-purchase noise.

const DAY = 86400000;

const CADENCES = [
  { id: "weekly",    days: 7,   tolerance: 2 },
  { id: "biweekly",  days: 14,  tolerance: 3 },
  { id: "monthly",   days: 30,  tolerance: 4 },
  { id: "quarterly", days: 91,  tolerance: 8 },
  { id: "yearly",    days: 365, tolerance: 20 },
];

function median(nums) {
  if (nums.length === 0) return 0;
  const s = [...nums].sort((a, b) => a - b);
  const mid = Math.floor(s.length / 2);
  return s.length % 2 ? s[mid] : Math.round((s[mid - 1] + s[mid]) / 2);
}

function classifyCadence(intervalDays) {
  for (const c of CADENCES) {
    if (Math.abs(intervalDays - c.days) <= c.tolerance) return c.id;
  }
  return null;
}

// Returns an array of suggestions:
//   {
//     merchant_name, cadence ("monthly"|...), occurrences (count),
//     median_amount_cents, last_paid_on (ISO), txn_ids (Plaid IDs),
//     existing_bill_id (if a non-archived bill already references this
//                       merchant — caller can skip those).
//   }
export function detectRecurring(state) {
  const txns = (state.plaid_transactions || []).filter((t) => {
    // Outflows only; ignore dismissed.
    return t && t.amount_cents > 0 && !t.dismissed_at && !t.pending;
  });
  if (txns.length === 0) return [];

  // Bucket by normalized merchant name. Fall back to a normalized
  // first-three-words of `name` when merchant_name is missing.
  const groups = new Map();
  for (const t of txns) {
    const raw = (t.merchant_name || t.name || "").trim();
    if (!raw) continue;
    const key = raw.toLowerCase().split(/\s+/).slice(0, 3).join(" ");
    if (!groups.has(key)) groups.set(key, { display: raw, txns: [] });
    groups.get(key).txns.push(t);
  }

  const billsByMerchant = new Map(
    (state.bills || [])
      .filter((b) => !b.archived_at)
      .map((b) => [(b.vendor || b.label || "").trim().toLowerCase(), b]),
  );

  const suggestions = [];
  for (const [key, group] of groups) {
    const sorted = group.txns
      .slice()
      .sort((a, b) => (a.date < b.date ? -1 : 1));
    if (sorted.length < 3) continue;

    // Compute intervals between consecutive transactions in days.
    const intervals = [];
    for (let i = 1; i < sorted.length; i++) {
      const d1 = new Date(sorted[i - 1].date);
      const d2 = new Date(sorted[i].date);
      intervals.push(Math.round((d2 - d1) / DAY));
    }
    const medInterval = median(intervals);
    const cadence = classifyCadence(medInterval);
    if (!cadence) continue;

    // Stable amounts? Median absolute deviation ≤ 10% of median.
    const amounts = sorted.map((t) => t.amount_cents);
    const medAmount = median(amounts);
    if (medAmount <= 0) continue;
    const mad = median(amounts.map((a) => Math.abs(a - medAmount)));
    if (mad > medAmount * 0.1) continue;

    const lastTxn = sorted[sorted.length - 1];
    suggestions.push({
      merchant_name: group.display,
      key,
      cadence,
      occurrences: sorted.length,
      median_amount_cents: medAmount,
      last_paid_on: lastTxn.date,
      txn_ids: sorted.map((t) => t.plaid_txn_id),
      due_day: parseInt(lastTxn.date.slice(8, 10), 10) || 1,
      existing_bill_id: billsByMerchant.get(group.display.toLowerCase())?.id || null,
      category_label: lastTxn.predicted_category_label || null,
    });
  }

  // Sort by impact: largest median amount first.
  return suggestions.sort((a, b) => b.median_amount_cents - a.median_amount_cents);
}
