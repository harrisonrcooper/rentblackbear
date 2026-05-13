// Habit defaults + pure date/grid helpers shared by all three card
// styles (Heatmap / Garden / Stride). No React in here.

import { ICON } from "./icons";

export const DEFAULT_HABITS = [
  { id: "log_spending",    label: "Logged today's spending",     cadence: "daily",   icon: ICON.clock,    color: "#3b6fd1", owner: "shared",   group: "Money"    },
  { id: "check_envelopes", label: "Checked envelope balances",   cadence: "daily",   icon: ICON.envelope, color: "#4a7c59", owner: "shared",   group: "Money"    },
  { id: "review_props",    label: "Reviewed properties",         cadence: "weekly",  icon: ICON.home,     color: "#c88318", owner: "harrison", group: "Money"    },
  { id: "money_date",      label: "Money date with Carolina",    cadence: "weekly",  icon: ICON.heart,    color: "#d6448f", owner: "shared",   group: "Marriage" },
  { id: "close_month",     label: "Closed out the month",        cadence: "monthly", icon: ICON.calendar, color: "#8c5ad9", owner: "shared",   group: "Money"    },
  { id: "walk_carolina",   label: "Walk + talk with Carolina",   cadence: "daily",   icon: ICON.walk,     color: "#0bafb0", owner: "carolina", group: "Marriage" },
];

export const HABIT_OWNERS = [
  { id: "all",      label: "Both of us", accent: "#5f6675", initial: "Us" },
  { id: "harrison", label: "Harrison",   accent: "#3b6fd1", initial: "H"  },
  { id: "carolina", label: "Carolina",   accent: "#d6448f", initial: "C"  },
  { id: "shared",   label: "Shared",     accent: "#4a7c59", initial: "Sh" },
];

export const HABIT_STYLES = [
  { id: "heatmap", label: "Heatmap" },
  { id: "garden",  label: "Garden"  },
  { id: "stride",  label: "Stride"  },
];

// Current consecutive-day streak ending at today (or yesterday if
// today not yet checked).
export function computeHabitStreak(habit) {
  const completions = new Set(habit.completions || []);
  if (completions.size === 0) return 0;
  const today = new Date();
  let streak = 0;
  for (let i = 0; i < 365; i++) {
    const d = new Date(today.getFullYear(), today.getMonth(), today.getDate() - i);
    const iso = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    if (completions.has(iso)) {
      streak++;
    } else if (i === 0) {
      // Today not yet checked — keep walking backwards in case yesterday is checked.
      continue;
    } else {
      break;
    }
  }
  return streak;
}

// Last-N-days flat array for the Heatmap-style card strip.
export function buildHeatmap(completions, days) {
  const set = new Set(completions || []);
  const out = [];
  const today = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today.getFullYear(), today.getMonth(), today.getDate() - i);
    const iso = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    out.push({ iso, done: set.has(iso) });
  }
  return out;
}

// 7-rows × `weeks`-cols grid with rolling-window intensity, powering
// the Garden card. Higher consistency over the last 7 days → cell
// glows brighter on the day that completes that window.
export function buildGardenGrid(completions, weeks) {
  const set = new Set(completions || []);
  const today = new Date();
  const totalDays = weeks * 7;
  const days = [];
  for (let i = totalDays - 1; i >= 0; i--) {
    const d = new Date(today.getFullYear(), today.getMonth(), today.getDate() - i);
    const iso = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    days.push({ iso, done: set.has(iso) });
  }
  const window = [];
  const enriched = days.map((d) => {
    window.push(d.done ? 1 : 0);
    if (window.length > 7) window.shift();
    const count = window.reduce((a, b) => a + b, 0);
    const intensity = !d.done ? 0 : count >= 7 ? 4 : count >= 5 ? 3 : count >= 3 ? 2 : 1;
    return { ...d, intensity };
  });
  const rows = [];
  for (let r = 0; r < 7; r++) {
    const row = [];
    for (let c = 0; c < weeks; c++) {
      row.push(enriched[c * 7 + r] || { iso: "", done: false, intensity: 0 });
    }
    rows.push(row);
  }
  return rows;
}

export function last7Days(completions) {
  const set = new Set(completions || []);
  const out = [];
  const today = new Date();
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today.getFullYear(), today.getMonth(), today.getDate() - i);
    const iso = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    out.push({ iso, done: set.has(iso) });
  }
  return out;
}

export function longestStreak(completions) {
  if (!completions || completions.length === 0) return 0;
  const sorted = [...new Set(completions)].sort();
  let best = 1;
  let cur = 1;
  for (let i = 1; i < sorted.length; i++) {
    const prev = new Date(sorted[i - 1]);
    const curr = new Date(sorted[i]);
    const diff = Math.round((curr - prev) / 86400000);
    if (diff === 1) {
      cur++;
      if (cur > best) best = cur;
    } else {
      cur = 1;
    }
  }
  return best;
}
