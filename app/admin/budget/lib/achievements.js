// Achievement system with five tiers (Bronze → Legendary), per-
// achievement progress measurement, and live streak math.
//
// Each definition carries:
//   id        unique slug
//   label     short display name
//   tier      bronze | silver | gold | platinum | legendary
//   reach(s)  returns true when the achievement is earned
//   progress(s) returns { value, target, format } for the locked-state
//               progress bar. `format` is "money" or "count" — controls
//               whether the UI renders cents-as-dollars or a raw integer.

import { computeNetWorthCents } from "./calc";

export const TIERS = [
  { id: "bronze",    label: "Bronze",    color: "#c88318" },
  { id: "silver",    label: "Silver",    color: "#9aa0aa" },
  { id: "gold",      label: "Gold",      color: "#d6a72b" },
  { id: "platinum",  label: "Platinum",  color: "#3b6fd1" },
  { id: "legendary", label: "Legendary", color: "#8c5ad9" },
];

export const TIER_COLOR = Object.fromEntries(TIERS.map((t) => [t.id, t.color]));

// --- Helper accessors -----------------------------------------------

const momPaid = (s) => (s.mom_loans?.[0]?.payments || []).reduce((sum, p) => sum + (p.amount_cents || 0), 0);
const momStart = (s) => s.mom_loans?.[0]?.starting_balance_cents || 0;
const habitCompletions = (s) => (s.habits || []).reduce((sum, h) => sum + (h.completions?.length || 0), 0);
const goalsCompleted = (s) => 0; // placeholder until goal-completion math lands in a later session
const operatingProps = (s) => (s.properties || []).filter((p) => p.status === "operating").length;

// History helpers — used by the day-streak achievements.
function trackingStreak(state) {
  const hist = (state.history || []).slice().sort((a, b) => (a.day < b.day ? -1 : 1));
  if (hist.length === 0) return 0;
  let streak = 1;
  for (let i = hist.length - 1; i > 0; i--) {
    const a = new Date(hist[i - 1].day);
    const b = new Date(hist[i].day);
    const d = Math.round((b - a) / 86400000);
    if (d === 1) streak++; else break;
  }
  return streak;
}
function positiveCfStreak(state) {
  const hist = (state.history || []);
  let cur = 0;
  for (let i = hist.length - 1; i >= 0; i--) {
    if (hist[i].hero_conservative_cents > 0) cur++; else break;
  }
  return cur;
}

// --- Achievement definitions ----------------------------------------

export const ACHIEVEMENT_DEFS = [
  // BRONZE — first-week wins
  { id: "first_setup",      label: "Set up your budget",       tier: "bronze",
    reach: (s) => (s.categories?.length || 0) > 0,
    progress: (s) => ({ value: s.categories?.length || 0, target: 1, format: "count" }),
  },
  { id: "first_property",   label: "Add a property",           tier: "bronze",
    reach: (s) => (s.properties?.length || 0) > 0,
    progress: (s) => ({ value: s.properties?.length || 0, target: 1, format: "count" }),
  },
  { id: "first_income",     label: "Log income",               tier: "bronze",
    reach: (s) => (s.income_sources?.length || 0) > 0,
    progress: (s) => ({ value: s.income_sources?.length || 0, target: 1, format: "count" }),
  },
  { id: "first_habit",      label: "Check your first habit",   tier: "bronze",
    reach: (s) => habitCompletions(s) >= 1,
    progress: (s) => ({ value: habitCompletions(s), target: 1, format: "count" }),
  },
  { id: "first_envelope",   label: "Log an expense",           tier: "bronze",
    reach: (s) => (s.monthly_actuals?.length || 0) >= 1,
    progress: (s) => ({ value: s.monthly_actuals?.length || 0, target: 1, format: "count" }),
  },
  { id: "first_mom_pay",    label: "Pay Mom for the first time", tier: "bronze",
    reach: (s) => (s.mom_loans?.[0]?.payments?.length || 0) >= 1,
    progress: (s) => ({ value: s.mom_loans?.[0]?.payments?.length || 0, target: 1, format: "count" }),
  },
  { id: "week_tracked",     label: "7-day tracking streak",    tier: "bronze",
    reach: (s) => trackingStreak(s) >= 7,
    progress: (s) => ({ value: trackingStreak(s), target: 7, format: "count" }),
  },

  // SILVER — first-month rhythm
  { id: "five_properties",  label: "5 properties",             tier: "silver",
    reach: (s) => (s.properties?.length || 0) >= 5,
    progress: (s) => ({ value: s.properties?.length || 0, target: 5, format: "count" }),
  },
  { id: "month_tracked",    label: "30-day tracking streak",   tier: "silver",
    reach: (s) => trackingStreak(s) >= 30,
    progress: (s) => ({ value: trackingStreak(s), target: 30, format: "count" }),
  },
  { id: "thirty_envelopes", label: "30 expenses logged",       tier: "silver",
    reach: (s) => (s.monthly_actuals?.length || 0) >= 30,
    progress: (s) => ({ value: s.monthly_actuals?.length || 0, target: 30, format: "count" }),
  },
  { id: "habit_week",       label: "Check a habit 7 days in a row", tier: "silver",
    reach: (s) => (s.habits || []).some((h) => longestRun(h.completions) >= 7),
    progress: (s) => ({
      value: (s.habits || []).reduce((m, h) => Math.max(m, longestRun(h.completions)), 0),
      target: 7, format: "count",
    }),
  },
  { id: "positive_month",   label: "Positive cash flow month", tier: "silver",
    reach: (s) => positiveCfStreak(s) >= 1,
    progress: (s) => ({ value: positiveCfStreak(s), target: 1, format: "count" }),
  },
  { id: "two_owners",       label: "Track income for both partners", tier: "silver",
    reach: (s) => {
      const owners = new Set((s.income_sources || []).map((i) => i.owner || "joint"));
      return owners.size >= 2 || owners.has("joint");
    },
    progress: (s) => {
      const owners = new Set((s.income_sources || []).map((i) => i.owner || "joint"));
      return { value: owners.has("joint") ? 2 : owners.size, target: 2, format: "count" };
    },
  },

  // GOLD — sustained discipline
  { id: "ten_properties",   label: "10 properties",            tier: "gold",
    reach: (s) => (s.properties?.length || 0) >= 10,
    progress: (s) => ({ value: s.properties?.length || 0, target: 10, format: "count" }),
  },
  { id: "ninety_tracked",   label: "90-day tracking streak",   tier: "gold",
    reach: (s) => trackingStreak(s) >= 90,
    progress: (s) => ({ value: trackingStreak(s), target: 90, format: "count" }),
  },
  { id: "ninety_positive",  label: "3 positive months in a row", tier: "gold",
    reach: (s) => positiveCfStreak(s) >= 3,
    progress: (s) => ({ value: positiveCfStreak(s), target: 3, format: "count" }),
  },
  { id: "mom_paid_off",     label: "Pay Mom in full",          tier: "gold",
    reach: (s) => momStart(s) > 0 && momPaid(s) >= momStart(s),
    progress: (s) => ({ value: momPaid(s), target: Math.max(momStart(s), 1), format: "money" }),
  },
  { id: "nw_500k",          label: "$500k net worth",          tier: "gold",
    reach: (s) => computeNetWorthCents(s) >= 50_000_000,
    progress: (s) => ({ value: Math.max(0, computeNetWorthCents(s)), target: 50_000_000, format: "money" }),
  },
  { id: "saved_10k",        label: "$10k of cumulative savings", tier: "gold",
    reach: (s) => {
      const sum = (s.history || []).reduce((acc, h) => acc + Math.max(0, h.saved_this_month_cents || 0), 0);
      return sum >= 1_000_000;
    },
    progress: (s) => {
      const sum = (s.history || []).reduce((acc, h) => acc + Math.max(0, h.saved_this_month_cents || 0), 0);
      return { value: sum, target: 1_000_000, format: "money" };
    },
  },

  // PLATINUM — real milestones
  { id: "year_tracked",     label: "1-year tracking streak",   tier: "platinum",
    reach: (s) => trackingStreak(s) >= 365,
    progress: (s) => ({ value: trackingStreak(s), target: 365, format: "count" }),
  },
  { id: "year_positive",    label: "12 positive months in a row", tier: "platinum",
    reach: (s) => positiveCfStreak(s) >= 12,
    progress: (s) => ({ value: positiveCfStreak(s), target: 12, format: "count" }),
  },
  { id: "twenty_properties", label: "20 properties",           tier: "platinum",
    reach: (s) => (s.properties?.length || 0) >= 20,
    progress: (s) => ({ value: s.properties?.length || 0, target: 20, format: "count" }),
  },
  { id: "nw_1m",            label: "$1M net worth",            tier: "platinum",
    reach: (s) => computeNetWorthCents(s) >= 100_000_000,
    progress: (s) => ({ value: Math.max(0, computeNetWorthCents(s)), target: 100_000_000, format: "money" }),
  },
  { id: "all_habits_30",    label: "Every habit checked 30 days running", tier: "platinum",
    reach: (s) => (s.habits || []).length >= 3
      && (s.habits || []).every((h) => longestRun(h.completions) >= 30),
    progress: (s) => {
      const habits = s.habits || [];
      if (habits.length < 3) return { value: 0, target: 30, format: "count" };
      const worst = habits.reduce((m, h) => Math.min(m, longestRun(h.completions)), Infinity);
      return { value: Math.min(30, worst === Infinity ? 0 : worst), target: 30, format: "count" };
    },
  },

  // LEGENDARY — life events
  { id: "nw_2m",            label: "$2M net worth",            tier: "legendary",
    reach: (s) => computeNetWorthCents(s) >= 200_000_000,
    progress: (s) => ({ value: Math.max(0, computeNetWorthCents(s)), target: 200_000_000, format: "money" }),
  },
  { id: "nw_5m",            label: "$5M net worth",            tier: "legendary",
    reach: (s) => computeNetWorthCents(s) >= 500_000_000,
    progress: (s) => ({ value: Math.max(0, computeNetWorthCents(s)), target: 500_000_000, format: "money" }),
  },
  { id: "fifty_properties", label: "50 properties",            tier: "legendary",
    reach: (s) => (s.properties?.length || 0) >= 50,
    progress: (s) => ({ value: s.properties?.length || 0, target: 50, format: "count" }),
  },
  { id: "five_years",       label: "5-year tracking streak",   tier: "legendary",
    reach: (s) => trackingStreak(s) >= 365 * 5,
    progress: (s) => ({ value: trackingStreak(s), target: 365 * 5, format: "count" }),
  },
];

// Longest consecutive-day run inside a habit's completions array.
function longestRun(completions) {
  if (!completions || completions.length === 0) return 0;
  const sorted = [...new Set(completions)].sort();
  let best = 1;
  let cur = 1;
  for (let i = 1; i < sorted.length; i++) {
    const a = new Date(sorted[i - 1]);
    const b = new Date(sorted[i]);
    const d = Math.round((b - a) / 86400000);
    if (d === 1) { cur++; if (cur > best) best = cur; } else cur = 1;
  }
  return best;
}

// Enrich every definition with its computed status against the given
// state. The UI consumes the result without re-running reach/progress.
export function computeAchievements(state) {
  return ACHIEVEMENT_DEFS.map((a) => {
    const unlocked = a.reach(state);
    const prog = a.progress ? a.progress(state) : null;
    return {
      ...a,
      color: TIER_COLOR[a.tier],
      unlocked,
      progress: prog ? {
        ...prog,
        pct: prog.target > 0 ? Math.min(100, (prog.value / prog.target) * 100) : 0,
      } : null,
    };
  });
}

export function computeStreaks(state) {
  return { trackedStreak: trackingStreak(state), cfStreak: positiveCfStreak(state) };
}

// --- Confetti ---------------------------------------------------------

export function fireConfetti(opts = {}) {
  if (typeof document === "undefined") return;
  if (typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const colors = ["#4a7c59", "#c88318", "#3b6fd1", "#d6448f", "#8c5ad9", "#138a60"];
  const count = opts.count || 90;
  const originX = opts.originX ?? 0.5;
  const originY = opts.originY ?? 0.5;
  const root = document.body;
  for (let i = 0; i < count; i++) {
    const el = document.createElement("div");
    el.style.cssText = `position:fixed;top:${originY * 100}%;left:${originX * 100}%;pointer-events:none;width:10px;height:10px;background:${colors[i % colors.length]};border-radius:2px;z-index:9999;transform:translate(-50%,-50%);`;
    const angle = (-Math.PI / 2) + (Math.random() - 0.5) * (Math.PI * 0.9);
    const speed = 220 + Math.random() * 220;
    const dx = Math.cos(angle) * speed;
    const dy = Math.sin(angle) * speed;
    el.animate([
      { transform: `translate(-50%, -50%) rotate(0deg)`, opacity: 1 },
      { transform: `translate(calc(-50% + ${dx}px), calc(-50% + ${dy + 600}px)) rotate(${(Math.random() - 0.5) * 1080}deg)`, opacity: 0 },
    ], { duration: 1300 + Math.random() * 500, easing: "cubic-bezier(0.2, 0.6, 0.4, 1)", fill: "forwards" });
    setTimeout(() => el.remove(), 1900);
    root.appendChild(el);
  }
}
