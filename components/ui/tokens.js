// Flagship design tokens — JS constants.
//
// Prefer `var(--flg-*)` references in style attributes so themes cascade
// naturally. Use this module only when you genuinely need a JS value
// (e.g. passing a color to a third-party library like Recharts). The
// values below always reflect the Flagship defaults and do NOT update
// when [data-theme] swaps; consumers that need live theme awareness
// should read getComputedStyle(document.documentElement).

export const colors = {
  navy: "#2F3E83",
  navyDark: "#1e2a5e",
  navyDarker: "#14204a",
  blue: "#1251AD",
  blueBright: "#1665D8",
  bluePale: "#eef3ff",
  pink: "#FF4998",
  pinkHover: "#e63882",
  pinkBg: "rgba(255,73,152,0.12)",
  text: "#1a1f36",
  textMuted: "#5a6478",
  textFaint: "#8a93a5",
  surface: "#ffffff",
  surfaceAlt: "#f7f9fc",
  surfaceSubtle: "#fafbfd",
  border: "#e3e8ef",
  borderStrong: "#c9d1dd",
  gold: "#f5a623",
  goldBg: "rgba(245,166,35,0.12)",
  green: "#1ea97c",
  greenDark: "#138a60",
  greenBg: "rgba(30,169,124,0.12)",
  red: "#d64545",
  redBg: "rgba(214,69,69,0.12)",
  orange: "#ea8c3a",
  orangeBg: "rgba(234,140,58,0.12)",
};

export const radii = {
  sm: 6,
  md: 10,
  lg: 14,
  xl: 20,
  pill: 100,
};

export const shadows = {
  sm: "0 1px 2px rgba(26,31,54,0.04)",
  md: "0 4px 16px rgba(26,31,54,0.06)",
  lg: "0 12px 40px rgba(26,31,54,0.1)",
};

export const fonts = {
  sans: "'Inter', -apple-system, BlinkMacSystemFont, system-ui, sans-serif",
  mono: "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace",
};
