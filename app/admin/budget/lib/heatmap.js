// Spending heatmap math. Takes monthly_actuals (the canonical log of
// every dollar that moved), buckets by paid_on day, and computes
// percentile-based intensity buckets so a single $300 grocery run on
// a sleepy week doesn't dwarf eight $20 days in a busy one.
//
// All values in cents. Returns a 52w x 7d grid the renderer can lay
// out as a calendar of cells, plus the percentile cutoffs used to
// pick each cell's intensity (so the legend stays honest).

const DAY_MS = 86400000;

function isoDay(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function startOfWeekSunday(d) {
  // Match the cal-heatmap convention: weeks start on Sunday so the
  // grid lines up with most US-locale wall calendars.
  const x = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const dow = x.getDay(); // 0 = Sunday
  x.setDate(x.getDate() - dow);
  return x;
}

// `weeks` = number of past weeks to render. Defaults to 53 so the
// grid always shows at least a full year plus the current partial week.
export function buildSpendingHeatmap(state, weeks = 53, today = new Date()) {
  const byDay = new Map();
  for (const a of state.monthly_actuals || []) {
    const day = a.paid_on || (a.month ? a.month.slice(0, 10) : null);
    if (!day) continue;
    // Outflows only — refunds/credits shouldn't darken a cell.
    const cents = a.amount_cents || 0;
    if (cents <= 0) continue;
    byDay.set(day, (byDay.get(day) || 0) + cents);
  }

  const todayAnchor = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const lastSunday = startOfWeekSunday(todayAnchor);
  // gridStart is `weeks` Sundays before the current one — so the
  // last column = the week containing `today`.
  const gridStart = new Date(lastSunday.getTime() - (weeks - 1) * 7 * DAY_MS);

  const cells = [];
  for (let w = 0; w < weeks; w++) {
    const weekStart = new Date(gridStart.getTime() + w * 7 * DAY_MS);
    for (let d = 0; d < 7; d++) {
      const date = new Date(weekStart.getTime() + d * DAY_MS);
      const iso = isoDay(date);
      cells.push({
        date,
        iso,
        weekIndex: w,
        dow: d, // 0 = Sun, 6 = Sat
        inFuture: date > todayAnchor,
        cents: byDay.get(iso) || 0,
      });
    }
  }

  // Percentile cutoffs computed over days with any spend at all.
  // Days with $0 are bucket 0 by definition — including them in the
  // distribution would compress every non-zero day toward 100%.
  const positives = cells
    .filter((c) => c.cents > 0)
    .map((c) => c.cents)
    .sort((a, b) => a - b);

  const cutoffAt = (p) => {
    if (positives.length === 0) return 0;
    const idx = Math.min(positives.length - 1, Math.floor(positives.length * p));
    return positives[idx];
  };

  const cutoffs = {
    p25: cutoffAt(0.25),
    p50: cutoffAt(0.5),
    p75: cutoffAt(0.75),
    p95: cutoffAt(0.95),
  };

  const bucketFor = (cents) => {
    if (cents <= 0) return 0;
    if (cents <= cutoffs.p25) return 1;
    if (cents <= cutoffs.p50) return 2;
    if (cents <= cutoffs.p75) return 3;
    if (cents <= cutoffs.p95) return 4;
    return 5;
  };

  for (const cell of cells) {
    cell.bucket = cell.inFuture ? -1 : bucketFor(cell.cents);
  }

  // Month label positions: which week-column starts each calendar
  // month. The renderer can position month names along the top axis.
  const monthLabels = [];
  let lastMonth = -1;
  for (let w = 0; w < weeks; w++) {
    const weekStart = new Date(gridStart.getTime() + w * 7 * DAY_MS);
    const m = weekStart.getMonth();
    if (m !== lastMonth) {
      monthLabels.push({ weekIndex: w, label: weekStart.toLocaleString("en-US", { month: "short" }) });
      lastMonth = m;
    }
  }

  const totalCents = cells.reduce((s, c) => s + c.cents, 0);
  const activeDays = cells.filter((c) => c.cents > 0).length;
  const heaviest = cells.reduce((best, c) => (c.cents > (best?.cents || 0) ? c : best), null);

  return {
    cells,
    cutoffs,
    monthLabels,
    weeks,
    totalCents,
    activeDays,
    heaviest,
  };
}
