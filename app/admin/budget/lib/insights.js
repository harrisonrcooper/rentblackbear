// Monthly insights. Pure compute over (categories, monthly_actuals,
// history). Returns an ordered list of 3-5 punchy observations the
// Dashboard surfaces in a small panel. Each insight is a plain object
// the renderer can style and link from.
//
// Each insight shape:
//   {
//     id: stable string,
//     kind: "good" | "warn" | "info",
//     icon: ICON path key (lib/icons.jsx),
//     headline: short bold line,
//     body: longer supporting sentence,
//     value: optional fmt-ready cents,
//   }

const DAY_MS = 86400000;

function monthIso(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-01`;
}

function priorMonthIso(d) {
  const prev = new Date(d.getFullYear(), d.getMonth() - 1, 1);
  return monthIso(prev);
}

function bucketActualsByMonth(actuals) {
  const out = new Map();
  for (const a of actuals || []) {
    if (!a.month) continue;
    const m = a.month.slice(0, 7);
    out.set(m, (out.get(m) || 0) + (a.amount_cents || 0));
  }
  return out;
}

function bucketActualsByCategoryThisMonth(actuals, monthIsoStr) {
  const lc = (s) => (s || "").trim().toLowerCase();
  const totals = new Map();
  for (const a of actuals || []) {
    if (!a.month || !a.month.startsWith(monthIsoStr.slice(0, 7))) continue;
    if (!(a.amount_cents > 0)) continue;
    const key = lc(a.category_label);
    if (!totals.has(key)) totals.set(key, { label: a.category_label, total: 0 });
    totals.get(key).total += a.amount_cents;
  }
  return Array.from(totals.values()).sort((a, b) => b.total - a.total);
}

export function computeInsights(state, today = new Date()) {
  const insights = [];
  const monthCursor = monthIso(today);
  const monthSlug = monthCursor.slice(0, 7); // "YYYY-MM"
  const prevSlug = priorMonthIso(today).slice(0, 7);
  const actuals = state.monthly_actuals || [];

  const totalByMonth = bucketActualsByMonth(actuals);
  const thisMonthSpend = totalByMonth.get(monthSlug) || 0;
  const lastMonthSpend = totalByMonth.get(prevSlug) || 0;

  // === Insight 1: top categories this month ===
  const byCategory = bucketActualsByCategoryThisMonth(actuals, monthCursor);
  if (byCategory.length >= 1) {
    const top = byCategory[0];
    const others = byCategory.slice(1, 3).map((c) => c.label).join(" + ");
    insights.push({
      id: "top-category",
      kind: "info",
      icon: "envelope",
      headline: `Heaviest this month: ${top.label}`,
      body: byCategory.length === 1
        ? "First logged spend of the month."
        : `Followed by ${others}.`,
      value: top.total,
    });
  }

  // === Insight 2: biggest month-over-month Δ ===
  if (byCategory.length > 0 && lastMonthSpend > 0) {
    const prevByCategory = new Map();
    for (const a of actuals) {
      if (!a.month || !a.month.startsWith(prevSlug)) continue;
      if (!(a.amount_cents > 0)) continue;
      const key = (a.category_label || "").trim().toLowerCase();
      prevByCategory.set(key, (prevByCategory.get(key) || 0) + a.amount_cents);
    }
    let biggest = null;
    for (const cur of byCategory) {
      const prev = prevByCategory.get(cur.label.trim().toLowerCase()) || 0;
      const delta = cur.total - prev;
      if (!biggest || Math.abs(delta) > Math.abs(biggest.delta)) {
        biggest = { label: cur.label, delta, prev, cur: cur.total };
      }
    }
    if (biggest && Math.abs(biggest.delta) >= 5_000) { // ignore < $50 noise
      const upDown = biggest.delta > 0 ? "up" : "down";
      const pct = biggest.prev > 0 ? Math.round((biggest.delta / biggest.prev) * 100) : null;
      insights.push({
        id: "mom-delta",
        kind: biggest.delta > 0 ? "warn" : "good",
        icon: biggest.delta > 0 ? "arrowUp" : "arrowDn",
        headline: `${biggest.label} ${upDown} vs last month`,
        body: pct != null
          ? `${pct >= 0 ? "+" : ""}${pct}% — last month was ${formatCents(biggest.prev)}.`
          : `Up from nothing — first time logging this category since last month.`,
        value: Math.abs(biggest.delta),
      });
    }
  }

  // === Insight 3: savings rate this month vs YTD average ===
  const year = today.getFullYear();
  const history = (state.history || []).filter((h) => h.day && h.day.startsWith(`${year}-`));
  const latestByMonthSnap = new Map();
  for (const h of history) {
    const m = h.day.slice(0, 7);
    const prev = latestByMonthSnap.get(m);
    if (!prev || prev.day < h.day) latestByMonthSnap.set(m, h);
  }
  const ytdMonths = Array.from(latestByMonthSnap.values());
  if (ytdMonths.length >= 2) {
    const thisMonthHist = latestByMonthSnap.get(monthSlug);
    if (thisMonthHist) {
      const ytdAvg = Math.round(
        ytdMonths.reduce((s, h) => s + (h.saved_this_month_cents || 0), 0) / ytdMonths.length,
      );
      const delta = thisMonthHist.saved_this_month_cents - ytdAvg;
      if (Math.abs(delta) >= 5_000) {
        insights.push({
          id: "savings-vs-ytd",
          kind: delta > 0 ? "good" : "warn",
          icon: "trending",
          headline: delta > 0
            ? "Saving more than your year-to-date pace"
            : "Saving less than your year-to-date pace",
          body: `${delta > 0 ? "+" : "−"}${formatCents(Math.abs(delta))} vs YTD average of ${formatCents(ytdAvg)}.`,
          value: Math.abs(delta),
        });
      }
    }
  }

  // === Insight 4: mom-loan progress (single-tenant lifeline) ===
  const momLoans = state.mom_loans || [];
  for (const loan of momLoans) {
    const paid = (loan.payments || []).reduce((s, p) => s + (p.amount_cents || 0), 0);
    const remaining = loan.starting_balance_cents - paid;
    if (remaining > 0 && loan.monthly_payment_cents > 0) {
      const monthsLeft = Math.ceil(remaining / loan.monthly_payment_cents);
      if (monthsLeft <= 6) {
        insights.push({
          id: `mom-loan-${loan.label || "loan"}`,
          kind: "good",
          icon: "heart",
          headline: `${loan.label || "Family loan"}: ${monthsLeft} payment${monthsLeft === 1 ? "" : "s"} to go`,
          body: `${formatCents(remaining)} remaining of ${formatCents(loan.starting_balance_cents)}.`,
          value: remaining,
        });
        break;
      }
    }
  }

  // === Insight 5: net worth delta this week ===
  if (history.length >= 7) {
    const sorted = [...history].sort((a, b) => (a.day < b.day ? -1 : 1));
    const today0 = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const weekAgoCutoff = new Date(today0.getTime() - 7 * DAY_MS);
    const weekAgoIso = `${weekAgoCutoff.getFullYear()}-${String(weekAgoCutoff.getMonth() + 1).padStart(2, "0")}-${String(weekAgoCutoff.getDate()).padStart(2, "0")}`;
    const baseline = sorted.find((h) => h.day >= weekAgoIso);
    const latest = sorted[sorted.length - 1];
    if (baseline && latest && baseline.day !== latest.day) {
      const nwDelta = latest.net_worth_cents - baseline.net_worth_cents;
      if (Math.abs(nwDelta) >= 100_000) { // $1000+
        insights.push({
          id: "nw-7d",
          kind: nwDelta > 0 ? "good" : "warn",
          icon: "trophy",
          headline: nwDelta > 0
            ? "Net worth up this week"
            : "Net worth down this week",
          body: `${nwDelta > 0 ? "+" : "−"}${formatCents(Math.abs(nwDelta))} in the last 7 days.`,
          value: Math.abs(nwDelta),
        });
      }
    }
  }

  // Cap at 4 insights — more noise than signal beyond that. Order:
  // good news first, then warnings, then info. Stable within each
  // bucket so the user sees consistent ordering across renders.
  const rankKind = (k) => (k === "good" ? 0 : k === "warn" ? 1 : 2);
  insights.sort((a, b) => rankKind(a.kind) - rankKind(b.kind));
  return insights.slice(0, 4);
}

function formatCents(c) {
  const n = (c || 0) / 100;
  const abs = Math.abs(n);
  if (abs >= 1000) return `$${Math.round(n).toLocaleString("en-US")}`;
  return `$${n.toFixed(2)}`;
}
