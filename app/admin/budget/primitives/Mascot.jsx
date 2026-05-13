"use client";

// Bear mascot. Renders an SVG bear face with three mood states based
// on the supplied mood prop. The bear is intentionally simple — round
// head, two ears, expressive eyes + mouth that swap per mood.

import { COLORS, FONT } from "../lib/tokens";

const FUR = "#8b6a4a";        // warm bear brown
const FUR_DARK = "#6b5036";
const SNOUT = "#f3e3c8";      // light tan muzzle
const NOSE = "#3a2616";

// Eye / mouth path data per mood.
// happy   — curved-up eyes ⌒⌒, smile arc
// neutral — round dots, flat line
// concerned — gentle sad arcs, slight frown
const FACES = {
  happy: {
    leftEye:  "M 36 56 q 4 -6 8 0",
    rightEye: "M 60 56 q 4 -6 8 0",
    mouth:    "M 44 72 q 8 8 16 0",
    cheek:    true,
  },
  neutral: {
    leftEye:  "M 40 58 a 1.5 1.5 0 1 0 0.01 0",
    rightEye: "M 64 58 a 1.5 1.5 0 1 0 0.01 0",
    mouth:    "M 46 73 h 12",
    cheek:    false,
  },
  concerned: {
    leftEye:  "M 36 58 q 4 6 8 0",
    rightEye: "M 60 58 q 4 6 8 0",
    mouth:    "M 44 75 q 8 -6 16 0",
    cheek:    false,
  },
};

export function Mascot({ mood = "neutral", size = 80, label }) {
  const f = FACES[mood] || FACES.neutral;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 104 104"
        role="img"
        aria-label={label || `Bear mascot — ${mood}`}
        style={{ display: "block" }}
      >
        {/* outer ears */}
        <circle cx="24" cy="22" r="11" fill={FUR} stroke={FUR_DARK} strokeWidth="1.5" />
        <circle cx="80" cy="22" r="11" fill={FUR} stroke={FUR_DARK} strokeWidth="1.5" />
        {/* inner ears */}
        <circle cx="24" cy="22" r="5" fill={SNOUT} opacity="0.9" />
        <circle cx="80" cy="22" r="5" fill={SNOUT} opacity="0.9" />
        {/* head */}
        <circle cx="52" cy="56" r="32" fill={FUR} stroke={FUR_DARK} strokeWidth="2" />
        {/* muzzle */}
        <ellipse cx="52" cy="70" rx="18" ry="13" fill={SNOUT} />
        {/* nose */}
        <ellipse cx="52" cy="64" rx="4" ry="3" fill={NOSE} />
        {/* cheeks (only when happy) */}
        {f.cheek && (
          <>
            <circle cx="30" cy="68" r="3.5" fill="#d6764e" opacity="0.55" />
            <circle cx="74" cy="68" r="3.5" fill="#d6764e" opacity="0.55" />
          </>
        )}
        {/* eyes */}
        <path d={f.leftEye}  stroke={NOSE} strokeWidth="2.2" fill="none" strokeLinecap="round" />
        <path d={f.rightEye} stroke={NOSE} strokeWidth="2.2" fill="none" strokeLinecap="round" />
        {/* mouth */}
        <path d={f.mouth} stroke={NOSE} strokeWidth="2" fill="none" strokeLinecap="round" />
      </svg>
      {label && (
        <div style={{
          fontSize: 10, fontWeight: 700, color: COLORS.textFaint,
          textTransform: "uppercase", letterSpacing: "0.08em", fontFamily: FONT,
        }}>{label}</div>
      )}
    </div>
  );
}

// Resolve mood from a cash-flow number in cents.
export function moodForCashflow(cents) {
  if (cents == null) return "neutral";
  if (cents >= 200_000) return "happy";     // saving >$2k/mo
  if (cents <= -50_000) return "concerned"; // bleeding more than $500/mo
  return "neutral";
}

// Rotating little nudges per mood. Caller can keep cycling them.
export const MASCOT_MESSAGES = {
  happy: [
    "Stack's growing. Keep going.",
    "This is what compounding looks like.",
    "Future you says thanks.",
    "Solid month. Don't stop.",
  ],
  neutral: [
    "Steady wins. Tiny tweaks compound.",
    "Pick one envelope and trim 5%.",
    "Log today's spending. It's a habit.",
    "Forecast → real progress in 12 months.",
  ],
  concerned: [
    "Tight month — let's tighten one envelope.",
    "Where did the cash go? Check Envelopes.",
    "Down is temporary. Plan beats stress.",
    "Pause subscriptions you forgot you had.",
  ],
};

const DAY_MS = 86400000;

// State-aware messages — facts pulled from the live blob. Returned in
// rough priority order (most surprising first). Merged into the pool
// by the caller so a click cycles between "did you know X" and the
// generic mood nudges. Skipped silently when the relevant data is
// missing — never returns a "no data" placeholder.
export function contextMascotMessages(state, today = new Date()) {
  if (!state) return [];
  const msgs = [];
  const monthSlug = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`;

  // Heaviest envelope this month.
  const byCat = new Map();
  for (const a of state.monthly_actuals || []) {
    if (!a.month || !a.month.startsWith(monthSlug)) continue;
    if (!(a.amount_cents > 0)) continue;
    const key = (a.category_label || "").trim();
    if (!key) continue;
    byCat.set(key, (byCat.get(key) || 0) + a.amount_cents);
  }
  let top = null;
  for (const [label, total] of byCat) {
    if (!top || total > top.total) top = { label, total };
  }
  if (top) {
    msgs.push(`Heaviest this month so far: ${top.label}.`);
  }

  // Upcoming bills in next 7 days.
  const upcomingCount = (state.bills || []).filter((b) => {
    if (b.archived_at) return false;
    if (b.cadence !== "monthly") return false;
    const day = Math.min(31, Math.max(1, b.due_day || 1));
    const dueThis = new Date(today.getFullYear(), today.getMonth(), day);
    const diffDays = Math.round((dueThis - today) / DAY_MS);
    return diffDays >= 0 && diffDays <= 7;
  }).length;
  if (upcomingCount >= 2) {
    msgs.push(`${upcomingCount} bills due in the next 7 days.`);
  }

  // Mom-loan: payments remaining if a loan is active.
  for (const loan of state.mom_loans || []) {
    const paid = (loan.payments || []).reduce((s, p) => s + (p.amount_cents || 0), 0);
    const remaining = (loan.starting_balance_cents || 0) - paid;
    if (remaining > 0 && loan.monthly_payment_cents > 0) {
      const monthsLeft = Math.ceil(remaining / loan.monthly_payment_cents);
      if (monthsLeft <= 12) {
        msgs.push(`${loan.label || "Family loan"}: ${monthsLeft} payment${monthsLeft === 1 ? "" : "s"} to go.`);
      }
      break;
    }
  }

  // Habit-streak flex.
  const habits = state.habits || [];
  let bestStreak = 0;
  for (const h of habits) {
    const days = new Set(h.completions || []);
    let streak = 0;
    let cursor = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    while (days.has(`${cursor.getFullYear()}-${String(cursor.getMonth() + 1).padStart(2, "0")}-${String(cursor.getDate()).padStart(2, "0")}`)) {
      streak++;
      cursor = new Date(cursor.getTime() - DAY_MS);
    }
    if (streak > bestStreak) bestStreak = streak;
  }
  if (bestStreak >= 5) {
    msgs.push(`${bestStreak}-day habit streak — don't break the chain.`);
  }

  // Active goals — closest to completion.
  let nearest = null;
  for (const g of state.goals || []) {
    if (g.archived || g.completed_at) continue;
    if (!g.target_cents || g.target_cents <= 0) continue;
    // Approximate "value" — net_worth for net_worth goals, else 0.
    const latest = (state.history || []).slice(-1)[0];
    let value = 0;
    if (g.kind === "net_worth" && latest) value = latest.net_worth_cents || 0;
    else if (g.kind === "custom") value = g.current_value_cents || 0;
    const pct = (value / g.target_cents) * 100;
    if (pct >= 50 && pct < 100 && (!nearest || pct > nearest.pct)) {
      nearest = { label: g.label, pct: Math.round(pct) };
    }
  }
  if (nearest) {
    msgs.push(`"${nearest.label}" is ${nearest.pct}% done — push for the finish.`);
  }

  return msgs;
}
