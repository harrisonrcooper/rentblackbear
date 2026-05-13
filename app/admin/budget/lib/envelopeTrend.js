// Per-envelope 6-month trend. Returns an array of {month, label, spent}
// for the past 6 months (oldest first) so the renderer can draw a tiny
// bar strip showing whether this month's spend is normal.

function isoMonthKey(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

export function buildEnvelopeTrend(state, categoryLabel, monthsBack = 6, today = new Date()) {
  if (!categoryLabel) return [];
  const lc = categoryLabel.trim().toLowerCase();
  const byMonth = new Map();
  for (const a of state.monthly_actuals || []) {
    if (!a.month) continue;
    if ((a.category_label || "").trim().toLowerCase() !== lc) continue;
    const key = a.month.slice(0, 7);
    byMonth.set(key, (byMonth.get(key) || 0) + Math.max(0, a.amount_cents || 0));
  }

  const out = [];
  for (let i = monthsBack - 1; i >= 0; i--) {
    const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
    const key = isoMonthKey(d);
    out.push({
      month: key,
      label: d.toLocaleString("en-US", { month: "short" }).charAt(0),
      spent: byMonth.get(key) || 0,
    });
  }
  return out;
}
