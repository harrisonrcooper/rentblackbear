// Recurring-bill math + calendar grid + audit helpers. Pure
// functions — no React.
//
// A bill is a *recurring* obligation: subscriptions, mortgage, rent,
// car insurance, etc. Logged spending (monthly_actuals) is the
// historical record of dollars actually moving. Marking a bill paid
// optionally creates a matching actuals row.

import { biweeklyToMonthly } from "./money";

const DAY_MS = 86400000;

function clampDay(year, month1to12, day) {
  // month is 1-indexed here; clamp the requested day to the month's
  // last day so a "due_day=31" bill in February resolves to Feb 28/29.
  const lastDay = new Date(year, month1to12, 0).getDate();
  return Math.min(Math.max(1, day), lastDay);
}

// Next due date for a bill given a "from" reference date (defaults today).
// Returns an ISO YYYY-MM-DD string or null when the bill has no due
// information (e.g. legacy data without a `due_day`).
export function nextDueDate(bill, fromDate = new Date()) {
  if (!bill || !bill.cadence) return null;
  const today = new Date(fromDate.getFullYear(), fromDate.getMonth(), fromDate.getDate());
  const dueDay = Math.max(1, Math.min(31, bill.due_day || 1));

  function asISO(d) {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  }

  switch (bill.cadence) {
    case "monthly": {
      // Try this month first; if the day has passed, move to next month.
      const tm = today.getMonth() + 1;
      const ty = today.getFullYear();
      const thisD = clampDay(ty, tm, dueDay);
      const thisMonthDate = new Date(ty, tm - 1, thisD);
      if (thisMonthDate >= today) return asISO(thisMonthDate);
      const nm = tm === 12 ? 1 : tm + 1;
      const ny = tm === 12 ? ty + 1 : ty;
      return asISO(new Date(ny, nm - 1, clampDay(ny, nm, dueDay)));
    }
    case "quarterly": {
      // Same anchor day every 3 months from origin.
      // Origin = (last_paid_at month) or due_month or current month.
      const anchorMonth = bill.due_month || (bill.last_paid_at ? new Date(bill.last_paid_at).getMonth() + 1 : today.getMonth() + 1);
      // Find the next quarter month >= today.getMonth() + 1.
      for (let i = 0; i < 5; i++) {
        const candidateMonth = ((anchorMonth - 1 + i * 3) % 12) + 1;
        const candidateYear = today.getFullYear() + Math.floor((anchorMonth - 1 + i * 3) / 12);
        const dt = new Date(candidateYear, candidateMonth - 1, clampDay(candidateYear, candidateMonth, dueDay));
        if (dt >= today) return asISO(dt);
      }
      return null;
    }
    case "yearly": {
      const m = bill.due_month || 1;
      const ty = today.getFullYear();
      const dt = new Date(ty, m - 1, clampDay(ty, m, dueDay));
      if (dt >= today) return asISO(dt);
      return asISO(new Date(ty + 1, m - 1, clampDay(ty + 1, m, dueDay)));
    }
    case "biweekly":
    case "weekly": {
      // Anchor to last_paid_at if set, else today.
      const stride = bill.cadence === "weekly" ? 7 : 14;
      const anchor = bill.last_paid_at ? new Date(bill.last_paid_at) : today;
      let next = new Date(anchor.getFullYear(), anchor.getMonth(), anchor.getDate() + stride);
      while (next < today) next = new Date(next.getFullYear(), next.getMonth(), next.getDate() + stride);
      return asISO(next);
    }
    default:
      return null;
  }
}

// Bills coming due in the next N days (inclusive of today).
export function upcomingBills(bills, days = 7, fromDate = new Date()) {
  const out = [];
  const today = new Date(fromDate.getFullYear(), fromDate.getMonth(), fromDate.getDate());
  const cutoff = new Date(today.getTime() + days * DAY_MS);
  for (const b of bills || []) {
    if (b.archived_at) continue;
    const iso = nextDueDate(b, today);
    if (!iso) continue;
    const dt = new Date(iso);
    if (dt >= today && dt <= cutoff) {
      out.push({ ...b, next_due: iso, days_away: Math.round((dt - today) / DAY_MS) });
    }
  }
  return out.sort((a, b) => (a.next_due < b.next_due ? -1 : 1));
}

// All bills hitting in a given month (for the calendar grid). Yearly
// bills appear once (in their due month); quarterly bills appear if
// any of their occurrences land in the month.
export function billsHittingMonth(bills, year, month1to12) {
  const out = [];
  const monthStart = new Date(year, month1to12 - 1, 1);
  const monthEnd = new Date(year, month1to12, 0);
  for (const b of bills || []) {
    if (b.archived_at) continue;
    // Walk forward from monthStart, but capped at one occurrence per
    // month for monthly bills (which we know land once a month).
    let cursor = nextDueDate(b, monthStart);
    while (cursor) {
      const dt = new Date(cursor);
      if (dt > monthEnd) break;
      if (dt >= monthStart) out.push({ ...b, next_due: cursor });
      // Advance one period to look for additional occurrences.
      const advance = new Date(dt.getTime() + DAY_MS);
      cursor = nextDueDate(b, advance);
      // Prevent infinite loops on degenerate data.
      if (!cursor || new Date(cursor) <= dt) break;
    }
  }
  return out;
}

// Total monthly equivalent of all active bills. Yearly = /12,
// quarterly = /3, weekly = *52/12, biweekly = *26/12, monthly = as-is.
export function monthlyBillTotal(bills) {
  return (bills || []).filter((b) => !b.archived_at).reduce((s, b) => {
    if (b.cadence === "yearly")    return s + Math.round(b.amount_cents / 12);
    if (b.cadence === "quarterly") return s + Math.round(b.amount_cents / 3);
    if (b.cadence === "biweekly")  return s + biweeklyToMonthly(b.amount_cents);
    if (b.cadence === "weekly")    return s + Math.round((b.amount_cents * 52) / 12);
    return s + b.amount_cents;
  }, 0);
}

// Subscription-audit candidates: monthly bills the user hasn't
// tagged as "used" in the lookbackDays window. Returns enriched rows
// with `days_since_used` for the UI.
export function subscriptionAudit(bills, lookbackDays = 90, fromDate = new Date()) {
  const today = new Date(fromDate.getFullYear(), fromDate.getMonth(), fromDate.getDate());
  return (bills || [])
    .filter((b) => !b.archived_at && (b.cadence === "monthly" || b.cadence === "yearly"))
    .map((b) => {
      const last = b.last_used_at ? new Date(b.last_used_at) : null;
      const days = last ? Math.round((today - last) / DAY_MS) : null;
      return { ...b, days_since_used: days };
    })
    .filter((b) => b.days_since_used == null || b.days_since_used > lookbackDays)
    .sort((a, b) => (b.amount_cents || 0) - (a.amount_cents || 0));
}

// Calendar grid (6 weeks × 7 days) for a given month. Each cell
// carries the date and any bills due that day.
export function billCalendarGrid(bills, year, month1to12) {
  const first = new Date(year, month1to12 - 1, 1);
  const startWeekday = first.getDay(); // 0 = Sun
  const lastDay = new Date(year, month1to12, 0).getDate();
  const byDay = new Map();
  for (const b of billsHittingMonth(bills, year, month1to12)) {
    const d = parseInt(b.next_due.slice(8, 10), 10);
    if (!byDay.has(d)) byDay.set(d, []);
    byDay.get(d).push(b);
  }
  const cells = [];
  for (let i = 0; i < 42; i++) {
    const dayOffset = i - startWeekday;
    const date = new Date(year, month1to12 - 1, dayOffset + 1);
    const inMonth = dayOffset >= 0 && dayOffset < lastDay;
    cells.push({
      date,
      day: date.getDate(),
      inMonth,
      isToday: isSameDay(date, new Date()),
      bills: inMonth ? (byDay.get(date.getDate()) || []) : [],
    });
  }
  return cells;
}

function isSameDay(a, b) {
  return a.getFullYear() === b.getFullYear()
    && a.getMonth() === b.getMonth()
    && a.getDate() === b.getDate();
}
