// Color blending + group palette. The intensity ramp powers the
// Garden habit-card heatmap so weeks with consistent completion glow
// brighter than one-off days.

import { COLORS } from "./tokens";
import { ICON } from "./iconPaths";

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
// `emoji` is the mobile "This Month" glyph — the budget redesign uses
// emojis on purpose (Harrison's call for this surface); `icon` stays the
// Lucide path data used everywhere else.
export const GROUP_META = {
  giving:     { label: "Giving",     accent: "#8c5ad9", bg: "rgba(140,90,217,0.08)",  icon: ICON.heart,      emoji: "💜" },
  housing:    { label: "Housing",    accent: "#3b6fd1", bg: "rgba(59,111,209,0.08)",  icon: ICON.home,       emoji: "🏠" },
  transport:  { label: "Transport",  accent: "#c98a2b", bg: "rgba(201,138,43,0.08)",  icon: ICON.car,        emoji: "🚗" },
  food:       { label: "Food",       accent: "#e85d4a", bg: "rgba(232,93,74,0.08)",   icon: ICON.utensils,   emoji: "🍽️" },
  personal:   { label: "Personal",   accent: "#d6448f", bg: "rgba(214,68,143,0.08)",  icon: ICON.user,       emoji: "🛍️" },
  kids:       { label: "Kids",       accent: "#0bafb0", bg: "rgba(11,175,176,0.08)",  icon: ICON.family,     emoji: "🧒" },
  debt:       { label: "Debt",       accent: "#d64545", bg: "rgba(214,69,69,0.08)",   icon: ICON.creditCard, emoji: "💳" },
  yearly:     { label: "Yearly",     accent: "#5f6675", bg: "rgba(95,102,117,0.08)",  icon: ICON.calendar,   emoji: "📅" },
  retirement: { label: "Retirement", accent: "#138a60", bg: "rgba(19,138,96,0.08)",   icon: ICON.landmark,   emoji: "🏦" },
  other:      { label: "Other",      accent: "#5f6675", bg: "rgba(95,102,117,0.08)",  icon: ICON.target,     emoji: "📦" },
};

// Per-envelope emoji: matches a label against keywords so each row gets a
// fitting glyph (⚽ "Ollie Soccer", 🛒 "Walmart"), like the mockup — instead
// of repeating the group icon. Falls back to the group emoji when nothing
// matches. First match wins, so order most-specific patterns first.
const LABEL_EMOJI = [
  [/soccer|f[uú]tbol/i, "⚽"],
  [/jiu|jitsu|\bbjj\b|karate|martial|judo|wrestl|taekwon/i, "🥋"],
  [/basketball/i, "🏀"],
  [/baseball|tee.?ball/i, "⚾"],
  [/football/i, "🏈"],
  [/dance|ballet/i, "🩰"],
  [/swim/i, "🏊"],
  [/piano|guitar|violin|music lesson/i, "🎹"],
  [/\bbear\b|teddy|\btoy/i, "🧸"],
  [/walmart|target|costco|\bstore\b/i, "🛒"],
  [/amazon|prime\b/i, "📦"],
  [/youtube|netflix|hulu|disney|spotify|stream|subscription/i, "📺"],
  [/\bgas\b|fuel/i, "⛽"],
  [/truck/i, "🚚"],
  [/\bcar\b|auto|vehicle/i, "🚗"],
  [/insurance/i, "🛡️"],
  [/\btags?\b|registration|\bdmv\b|license/i, "🏷️"],
  [/restaurant|dining|eat.?out|takeout/i, "🍴"],
  [/grocer|\bfood\b/i, "🍽️"],
  [/coffee|starbucks/i, "☕"],
  [/medicine|medical|\bdrug|pharmacy|\bdrs?\b|doctor|dental|dentist|health/i, "💊"],
  [/toiletr|cleaning|laundry|\bsoap\b/i, "🧼"],
  [/pamper|\bspa\b|\bhair\b|\bnail|salon|beauty/i, "💆"],
  [/tithe|giving|church|offering|charity|dona/i, "🙏"],
  [/maintenance|repair|\boil\b|\bfix\b/i, "🔧"],
  [/house|\bhome\b|\brent\b|mortgage/i, "🏠"],
  [/\bloan\b|\bdebt\b|payoff|assistance/i, "🏦"],
  [/phone|cell\b|mobile/i, "📱"],
  [/internet|wi-?fi|cable\b/i, "🌐"],
  [/electric|\bpower\b|\bwater\b|utility|utilities/i, "💡"],
  [/\bgift/i, "🎁"],
  [/travel|vacation|\btrip\b|flight|airfare/i, "✈️"],
  [/\bpet\b|\bdog\b|\bcat\b|\bvet\b/i, "🐾"],
  [/clothe|clothing|apparel|shoes/i, "👕"],
  [/\bgym\b|fitness|workout/i, "🏋️"],
  [/personal item|\bmisc\b/i, "🧾"],
];

export function categoryEmoji(label, groupKey) {
  const text = String(label || "");
  for (const [re, emoji] of LABEL_EMOJI) {
    if (re.test(text)) return emoji;
  }
  return (GROUP_META[groupKey] || GROUP_META.other).emoji;
}
