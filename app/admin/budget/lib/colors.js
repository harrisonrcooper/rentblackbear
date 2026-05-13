// Color blending + group palette. The intensity ramp powers the
// Garden habit-card heatmap so weeks with consistent completion glow
// brighter than one-off days.

import { COLORS } from "./tokens";
import { ICON } from "./icons";

export function hexToRgb(hex) {
  if (!hex || hex.startsWith("rgb")) return null;
  const m = hex.replace("#", "").match(/^([a-f0-9]{2})([a-f0-9]{2})([a-f0-9]{2})$/i);
  if (!m) return null;
  return [parseInt(m[1], 16), parseInt(m[2], 16), parseInt(m[3], 16)];
}

export function mixColors(bgHex, fgHex, t) {
  const bg = hexToRgb(bgHex);
  const fg = hexToRgb(fgHex);
  if (!bg || !fg) return fgHex;
  const r = Math.round(bg[0] + (fg[0] - bg[0]) * t);
  const g = Math.round(bg[1] + (fg[1] - bg[1]) * t);
  const b = Math.round(bg[2] + (fg[2] - bg[2]) * t);
  return `rgb(${r}, ${g}, ${b})`;
}

export function intensityColor(base, intensity) {
  // intensity 1..4 → 28%, 50%, 75%, 100% saturation
  const map = { 1: 0.28, 2: 0.5, 3: 0.75, 4: 1.0 };
  const alpha = map[intensity] ?? 0.28;
  return mixColors(COLORS.surfaceTint, base, alpha);
}

// Personal-expense group palette + icons. Each group gets a soft
// background tint and a full-saturation accent for the leading bar.
export const GROUP_META = {
  giving:     { label: "Giving",     accent: "#8c5ad9", bg: "rgba(140,90,217,0.08)",  icon: ICON.heart },
  housing:    { label: "Housing",    accent: "#3b6fd1", bg: "rgba(59,111,209,0.08)",  icon: ICON.home },
  transport:  { label: "Transport",  accent: "#c98a2b", bg: "rgba(201,138,43,0.08)",  icon: ICON.car },
  food:       { label: "Food",       accent: "#e85d4a", bg: "rgba(232,93,74,0.08)",   icon: ICON.utensils },
  personal:   { label: "Personal",   accent: "#d6448f", bg: "rgba(214,68,143,0.08)",  icon: ICON.heart },
  kids:       { label: "Kids",       accent: "#0bafb0", bg: "rgba(11,175,176,0.08)",  icon: ICON.family },
  debt:       { label: "Debt",       accent: "#d64545", bg: "rgba(214,69,69,0.08)",   icon: ICON.database },
  yearly:     { label: "Yearly",     accent: "#5f6675", bg: "rgba(95,102,117,0.08)",  icon: ICON.calendar },
  retirement: { label: "Retirement", accent: "#138a60", bg: "rgba(19,138,96,0.08)",   icon: ICON.award },
  other:      { label: "Other",      accent: "#5f6675", bg: "rgba(95,102,117,0.08)",  icon: ICON.target },
};
