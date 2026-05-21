// Design tokens for /admin/budget. Imported by every primitive and
// section view. Centralized here so a single edit re-themes the whole
// surface.
//
// Each value resolves to a CSS custom property defined on the page
// root in BudgetClient. Light + dark palettes live there as
// `:root { ... }` and `[data-theme="dark"] { ... }` blocks. Flipping
// the data-theme attribute on <html> instantly re-paints everything —
// no React state lookups, no style prop rewrites, no remount.
//
// Concrete palette values are in THEME_PALETTES below — exported so
// the page can render the matching <style> block from a single source
// of truth.

export const COLORS = {
  bg:          "var(--bb-bg)",
  surface:     "var(--bb-surface)",
  surfaceAlt:  "var(--bb-surface-alt)",
  surfaceTint: "var(--bb-surface-tint)",
  border:      "var(--bb-border)",
  borderStrong:"var(--bb-border-strong)",
  text:        "var(--bb-text)",
  textMuted:   "var(--bb-text-muted)",
  textFaint:   "var(--bb-text-faint)",
  accent:      "var(--bb-accent)",
  accentSoft:  "var(--bb-accent-soft)",
  green:       "var(--bb-green)",
  greenBg:     "var(--bb-green-bg)",
  red:         "var(--bb-red)",
  redBg:       "var(--bb-red-bg)",
  amber:       "var(--bb-amber)",
  amberBg:     "var(--bb-amber-bg)",
  blue:        "var(--bb-blue)",
  blueBg:      "var(--bb-blue-bg)",
  purple:      "var(--bb-purple)",
  purpleBg:    "var(--bb-purple-bg)",
};

// Actual hex values per theme. Used to emit the CSS-vars stylesheet
// from BudgetClient. Keep the keys in sync with COLORS above.
export const THEME_PALETTES = {
  light: {
    "bb-bg":             "#f4f5f7",
    "bb-surface":        "#ffffff",
    "bb-surface-alt":    "#f9fafb",
    "bb-surface-tint":   "#f3f4f6",
    "bb-border":         "#eaecef",
    "bb-border-strong":  "#d6d9de",
    "bb-text":           "#0d1424",
    "bb-text-muted":     "#5f6675",
    "bb-text-faint":     "#969ba8",
    "bb-accent":         "#4a7c59",
    "bb-accent-soft":    "rgba(74,124,89,0.10)",
    "bb-green":          "#138a60",
    "bb-green-bg":       "rgba(19,138,96,0.10)",
    "bb-red":            "#d64545",
    "bb-red-bg":         "rgba(214,69,69,0.10)",
    "bb-amber":          "#c88318",
    "bb-amber-bg":       "rgba(200,131,24,0.10)",
    "bb-blue":           "#3b6fd1",
    "bb-blue-bg":        "rgba(59,111,209,0.10)",
    "bb-purple":         "#8c5ad9",
    "bb-purple-bg":      "rgba(140,90,217,0.10)",
  },
  dark: {
    "bb-bg":             "#0a0d14",
    "bb-surface":        "#131822",
    "bb-surface-alt":    "#181d29",
    "bb-surface-tint":   "#1f2532",
    "bb-border":         "#252b39",
    "bb-border-strong":  "#353c4d",
    "bb-text":           "#e7ebf3",
    "bb-text-muted":     "#a5acba",
    "bb-text-faint":     "#6a7282",
    "bb-accent":         "#7ec18d",
    "bb-accent-soft":    "rgba(126,193,141,0.18)",
    "bb-green":          "#36d49a",
    "bb-green-bg":       "rgba(54,212,154,0.18)",
    "bb-red":            "#ef6b6b",
    "bb-red-bg":         "rgba(239,107,107,0.18)",
    "bb-amber":          "#e8a85a",
    "bb-amber-bg":       "rgba(232,168,90,0.18)",
    "bb-blue":           "#7ba4f0",
    "bb-blue-bg":        "rgba(123,164,240,0.18)",
    "bb-purple":         "#b893f0",
    "bb-purple-bg":      "rgba(184,147,240,0.18)",
  },
};

// Render the entire <style> body for theming. Caller injects this
// into a <style> tag — once per page is enough.
//
// Scoped to `[data-bb-theme]` (not <html> data-theme) so it doesn't
// collide with the rentblackbear shell's own theme system, which
// drives <html data-theme="..."> from localStorage "blackbear-theme".
// Budget pages wrap their content with a div carrying the resolved
// theme attribute — "system" gets resolved to "light" or "dark" in
// JS via window.matchMedia so we don't need media-query CSS fallbacks.
export function themeStylesheet() {
  const declarations = (vars) =>
    Object.entries(vars)
      .map(([k, v]) => `  --${k}: ${v};`)
      .join("\n");
  return [
    `[data-bb-theme="light"] {`,
    declarations(THEME_PALETTES.light),
    "  color-scheme: light;",
    "}",
    `[data-bb-theme="dark"] {`,
    declarations(THEME_PALETTES.dark),
    "  color-scheme: dark;",
    "}",
    // Universal focus ring for fields. Accent-tinted border + soft ring.
    // Scoped to [data-bb-theme] so it can't leak into the admin shell.
    "[data-bb-theme] input:focus,",
    "[data-bb-theme] select:focus,",
    "[data-bb-theme] textarea:focus {",
    "  border-color: var(--bb-accent) !important;",
    "  box-shadow: 0 0 0 3px var(--bb-accent-soft);",
    "}",
    // Safety net: strip native select chrome anywhere it slipped through.
    "[data-bb-theme] select {",
    "  -webkit-appearance: none;",
    "  -moz-appearance: none;",
    "  appearance: none;",
    "}",
    // Number-input spinners look like 1995. Hide them globally on this
    // surface — InlineNumber has its own +/- step controls.
    "[data-bb-theme] input[type=number]::-webkit-outer-spin-button,",
    "[data-bb-theme] input[type=number]::-webkit-inner-spin-button {",
    "  -webkit-appearance: none;",
    "  margin: 0;",
    "}",
    "[data-bb-theme] input[type=number] {",
    "  -moz-appearance: textfield;",
    "}",
  ].join("\n");
}

export const FONT = "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, system-ui, Segoe UI, sans-serif";

// ── Spacing + radii tokens (use these instead of magic numbers) ──────
export const SPACE = { 1: 4, 2: 8, 3: 12, 4: 16, 5: 20, 6: 24, 7: 32, 8: 40 };
export const RADII = { sm: 8, md: 12, lg: 14, xl: 18, pill: 999 };

// ── Type scale ───────────────────────────────────────────────────────
// One source of truth for every text role on the budget page. Use the
// role, not the size — sizes can change here without re-touching every
// component.
//
//   eyebrow  →  ALL-CAPS micro-label above a section / metric
//   label    →  field label or row label (left of an input)
//   caption  →  faint helper text under a label
//   body     →  regular paragraph / inline number value
//   bodyBold →  emphasized inline value
//   value    →  primary metric value (BlockCard sub, row right)
//   valueLg  →  drill-sheet right-aligned hero value (e.g. $22)
//   titleSm  →  BlockCard / section title
//   titleMd  →  drill-sheet card title
//   titleLg  →  drill-sheet primary title
//   hero     →  the +$3,696 page hero on /budget dashboard
export const TYPE = {
  eyebrow:  { fontSize: 10, fontWeight: 700, letterSpacing: "0.1em",  textTransform: "uppercase", color: COLORS.textFaint, fontFamily: FONT, lineHeight: 1.2 },
  label:    { fontSize: 12, fontWeight: 600, color: COLORS.textMuted, fontFamily: FONT, lineHeight: 1.35 },
  caption:  { fontSize: 11, fontWeight: 500, color: COLORS.textFaint, fontFamily: FONT, lineHeight: 1.4 },
  body:     { fontSize: 13, fontWeight: 500, color: COLORS.text, fontFamily: FONT, lineHeight: 1.5 },
  bodyBold: { fontSize: 13, fontWeight: 700, color: COLORS.text, fontFamily: FONT, lineHeight: 1.5 },
  value:    { fontSize: 14, fontWeight: 700, color: COLORS.text, fontVariantNumeric: "tabular-nums", fontFamily: FONT, lineHeight: 1.3 },
  valueLg:  { fontSize: 22, fontWeight: 800, color: COLORS.text, letterSpacing: "-0.02em", fontVariantNumeric: "tabular-nums", fontFamily: FONT, lineHeight: 1.1 },
  titleSm:  { fontSize: 13, fontWeight: 700, color: COLORS.text, letterSpacing: "-0.005em", fontFamily: FONT, lineHeight: 1.3 },
  titleMd:  { fontSize: 16, fontWeight: 700, color: COLORS.text, letterSpacing: "-0.01em",  fontFamily: FONT, lineHeight: 1.25 },
  titleLg:  { fontSize: 22, fontWeight: 800, color: COLORS.text, letterSpacing: "-0.02em",  fontFamily: FONT, lineHeight: 1.15 },
  hero:     { fontSize: 56, fontWeight: 800, color: COLORS.text, letterSpacing: "-0.03em",  fontVariantNumeric: "tabular-nums", fontFamily: FONT, lineHeight: 1 },
};

// Inline SVG caret used by every custom select. Stroke matches
// COLORS.textFaint so it reads as a chevron, not a button.
const SELECT_CARET = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%236a7282' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M6 9l6 6 6-6'/></svg>")`;

export const STYLES = {
  page: { minHeight: "100vh", background: COLORS.bg, color: COLORS.text, fontFamily: FONT, paddingBottom: 80 },
  inner: { maxWidth: 1280, margin: "0 auto", padding: "24px 20px 0" },
  card: {
    background: COLORS.surface,
    border: `1px solid ${COLORS.border}`,
    borderRadius: RADII.xl,
    boxShadow: "0 1px 2px rgba(15,23,41,0.04)",
  },
};

// Shared inline-style helpers used by primitives + section views. Kept
// here instead of in each component file so the tokens stay singular —
// changing one button shape ripples everywhere automatically.
export function btnStyle(variant = "primary") {
  if (variant === "primary") {
    return {
      background: COLORS.text, color: "#fff",
      border: "none", borderRadius: 100,
      padding: "10px 18px", fontSize: 13, fontWeight: 700,
      cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 8,
      fontFamily: FONT,
    };
  }
  return {
    background: COLORS.surface, color: COLORS.text,
    border: `1px solid ${COLORS.border}`, borderRadius: 100,
    padding: "8px 14px", fontSize: 13, fontWeight: 600,
    cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6,
    fontFamily: FONT,
  };
}

// 32px tall, 8px radius — every editable field on the page should
// match this footprint so things line up vertically without ad-hoc
// padding tweaks per row.
export function inputStyle() {
  return {
    height: 32,
    padding: "0 10px",
    border: `1px solid ${COLORS.border}`,
    borderRadius: RADII.sm,
    fontSize: 13,
    fontFamily: FONT,
    color: COLORS.text,
    outline: "none",
    background: COLORS.surface,
    boxSizing: "border-box",
    transition: "border-color 0.12s ease, box-shadow 0.12s ease",
  };
}

// Click-to-edit trigger that visually MATCHES inputStyle's bounding
// box (same height) so toggling between view and edit doesn't reflow.
export function textBtnStyle() {
  return {
    background: "transparent",
    border: "1px solid transparent",
    height: 32,
    padding: "0 10px",
    fontSize: 13,
    color: COLORS.text,
    cursor: "text",
    textAlign: "left",
    fontFamily: FONT,
    borderRadius: RADII.sm,
    transition: "background 0.12s ease, border-color 0.12s ease",
    display: "inline-flex",
    alignItems: "center",
    boxSizing: "border-box",
  };
}

export function stepBtnStyle() {
  return {
    width: 22, height: 22, borderRadius: 6, border: "none", cursor: "pointer",
    background: "transparent", color: COLORS.textMuted,
    display: "grid", placeItems: "center",
    opacity: 0, transition: "all 0.12s ease",
    fontFamily: FONT,
  };
}

// Tiny inline select — used for row-level "kind" choices (asset kind,
// debt kind, etc.). Pure custom chrome; no OS dropdown arrow.
export function pillSelectStyle() {
  return {
    appearance: "none",
    WebkitAppearance: "none",
    MozAppearance: "none",
    height: 24,
    padding: "0 22px 0 10px",
    border: `1px solid ${COLORS.border}`,
    borderRadius: RADII.pill,
    fontSize: 10, fontWeight: 700,
    textTransform: "uppercase", letterSpacing: "0.08em",
    color: COLORS.textMuted, cursor: "pointer", fontFamily: FONT,
    background: `${COLORS.surfaceTint} ${SELECT_CARET} no-repeat right 6px center / 10px 10px`,
    boxSizing: "border-box",
    lineHeight: 1,
    transition: "border-color 0.12s ease, box-shadow 0.12s ease",
  };
}

// Standard-size select — matches inputStyle dimensions so a select can
// sit on the same row as an InlineText/InlineNumber without misaligning.
export function selectStyle() {
  return {
    appearance: "none",
    WebkitAppearance: "none",
    MozAppearance: "none",
    height: 32,
    padding: "0 30px 0 10px",
    border: `1px solid ${COLORS.border}`,
    borderRadius: RADII.sm,
    fontSize: 13,
    fontFamily: FONT,
    color: COLORS.text,
    outline: "none",
    background: `${COLORS.surface} ${SELECT_CARET} no-repeat right 8px center / 12px 12px`,
    cursor: "pointer",
    boxSizing: "border-box",
    transition: "border-color 0.12s ease, box-shadow 0.12s ease",
  };
}
