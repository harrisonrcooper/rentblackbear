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
