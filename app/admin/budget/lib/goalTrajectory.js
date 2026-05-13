// Trajectory builder for goal sparklines. Takes the goal + state.
// history and returns a per-month series of {month, value} pairs the
// SVG renderer can scale. Falls back to an empty array when the goal
// kind isn't trackable from history alone.

function monthKey(day) {
  return day?.slice(0, 7) || null;
}

// Latest snapshot per month — `history` is daily but we want one
// data point per month so the sparkline isn't noisy.
function lastByMonth(history) {
  const map = new Map();
  for (const h of history || []) {
    const m = monthKey(h.day);
    if (!m) continue;
    const prev = map.get(m);
    if (!prev || prev.day < h.day) map.set(m, h);
  }
  return map;
}

function monthLabel(monthIso) {
  return new Date(`${monthIso}-15T12:00:00`).toLocaleString("en-US", { month: "short" });
}

// Returns [{ month: "2026-05", label: "May", value: 12345 }, ...]
// in chronological order. Empty for kinds we can't reconstruct from
// the persisted history shape (debt_payoff, property_count, custom).
export function buildGoalTrajectory(goal, state, monthsBack = 12) {
  if (!goal) return [];
  const history = state.history || [];
  if (history.length === 0) return [];
  const byMonth = lastByMonth(history);
  if (byMonth.size === 0) return [];

  // Pick which snapshot field to read based on goal kind.
  const fieldFor = (kind) => {
    if (kind === "net_worth")     return "net_worth_cents";
    if (kind === "savings")       return "saved_this_month_cents";
    if (kind === "rental_income") return "rental_noi_cents";
    return null;
  };
  const field = fieldFor(goal.kind);
  if (!field) return [];

  // Walk the last N months, gather the value if a snapshot exists.
  const today = new Date();
  const series = [];
  for (let i = monthsBack - 1; i >= 0; i--) {
    const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const snap = byMonth.get(key);
    if (!snap) continue;
    series.push({ month: key, label: monthLabel(key), value: snap[field] ?? 0 });
  }

  // For `savings` goals (where target is total accumulated savings),
  // we want a CUMULATIVE line, not the month-by-month delta.
  if (goal.kind === "savings") {
    let acc = 0;
    return series.map((p) => {
      acc += p.value;
      return { ...p, value: acc };
    });
  }

  return series;
}
