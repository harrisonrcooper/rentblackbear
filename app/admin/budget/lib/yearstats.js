// Year-in-review stats. Pure compute over (history + monthly_actuals)
// for the current calendar year. Returns the four headline numbers
// the Dashboard YTD strip wants to render.

export function computeYearStats(state, today = new Date()) {
  const year = today.getFullYear();
  const yearStartIso = `${year}-01-01`;
  const yearEndIso = `${year}-12-31`;
  const monthCursorIso = `${year}-${String(today.getMonth() + 1).padStart(2, "0")}`;

  // === Saved this year (Σ saved_this_month from history, bucketed by month) ===
  // history snapshots are once-per-day; the user might have several
  // entries for the same month — take the latest one per month so we
  // sum end-of-month totals instead of accumulating dailies.
  const history = (state.history || []).filter((h) => h.day >= yearStartIso && h.day <= yearEndIso);
  const lastByMonth = new Map();
  for (const h of history) {
    const m = h.day.slice(0, 7);
    const prev = lastByMonth.get(m);
    if (!prev || prev.day < h.day) lastByMonth.set(m, h);
  }
  const savedYTD = Array.from(lastByMonth.values())
    .reduce((s, h) => s + (h.saved_this_month_cents || 0), 0);

  // Best savings month (label + amount).
  let bestMonth = null;
  for (const h of lastByMonth.values()) {
    if (bestMonth == null || h.saved_this_month_cents > bestMonth.saved_this_month_cents) {
      bestMonth = h;
    }
  }
  const bestMonthLabel = bestMonth
    ? new Date(`${bestMonth.day.slice(0, 7)}-15T12:00:00`).toLocaleString("en-US", { month: "long" })
    : null;

  // === Net worth Δ YTD: latest in year minus earliest in year ===
  const sortedHist = [...history].sort((a, b) => (a.day < b.day ? -1 : 1));
  const firstHist = sortedHist[0];
  const lastHist = sortedHist[sortedHist.length - 1];
  const netWorthDelta = firstHist && lastHist
    ? (lastHist.net_worth_cents || 0) - (firstHist.net_worth_cents || 0)
    : 0;

  // === Total spent this year (Σ monthly_actuals where month in current year) ===
  const totalSpent = (state.monthly_actuals || [])
    .filter((a) => (a.month || "").startsWith(`${year}-`))
    .reduce((s, a) => s + Math.max(0, a.amount_cents || 0), 0);

  // === This-month progress: current month's saved divided by best month ===
  const currentMonthSaved = lastByMonth.get(monthCursorIso)?.saved_this_month_cents || 0;

  return {
    year,
    savedYTD,
    netWorthDelta,
    totalSpent,
    bestMonthLabel,
    bestMonthAmount: bestMonth?.saved_this_month_cents || 0,
    currentMonthSaved,
    monthsTracked: lastByMonth.size,
  };
}
