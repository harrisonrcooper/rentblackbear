// Design tokens for /admin/budget. Imported by every primitive and
// section view. Centralized here so a single edit re-themes the whole
// surface (the eventual dark-mode + custom-theme work hangs off this).

export const COLORS = {
  bg: "#f4f5f7",
  surface: "#ffffff",
  surfaceAlt: "#f9fafb",
  surfaceTint: "#f3f4f6",
  border: "#eaecef",
  borderStrong: "#d6d9de",
  text: "#0d1424",
  textMuted: "#5f6675",
  textFaint: "#969ba8",
  accent: "#4a7c59",
  accentSoft: "rgba(74, 124, 89, 0.10)",
  green: "#138a60",
  greenBg: "rgba(19,138,96,0.10)",
  red: "#d64545",
  redBg: "rgba(214,69,69,0.10)",
  amber: "#c88318",
  amberBg: "rgba(200,131,24,0.10)",
  blue: "#3b6fd1",
  blueBg: "rgba(59,111,209,0.10)",
  purple: "#8c5ad9",
  purpleBg: "rgba(140,90,217,0.10)",
};

export const FONT = "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, system-ui, Segoe UI, sans-serif";

export const STYLES = {
  page: { minHeight: "100vh", background: COLORS.bg, color: COLORS.text, fontFamily: FONT, paddingBottom: 80 },
  inner: { maxWidth: 1280, margin: "0 auto", padding: "24px 20px 0" },
  card: {
    background: COLORS.surface,
    border: `1px solid ${COLORS.border}`,
    borderRadius: 18,
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

export function inputStyle() {
  return {
    padding: "6px 10px",
    border: `1px solid ${COLORS.borderStrong}`,
    borderRadius: 8,
    fontSize: 13,
    fontFamily: FONT,
    color: COLORS.text,
    outline: "none",
    background: COLORS.surface,
  };
}

export function textBtnStyle() {
  return {
    background: "transparent",
    border: "none",
    padding: "4px 6px",
    margin: "0 -6px",
    fontSize: 13,
    color: COLORS.text,
    cursor: "text",
    textAlign: "left",
    fontFamily: FONT,
    borderRadius: 6,
    transition: "background 0.12s ease",
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

export function pillSelectStyle() {
  return {
    background: COLORS.surfaceTint,
    border: `1px solid ${COLORS.border}`,
    borderRadius: 100,
    padding: "2px 8px",
    fontSize: 10, fontWeight: 700,
    textTransform: "uppercase", letterSpacing: "0.08em",
    color: COLORS.textMuted, cursor: "pointer", fontFamily: FONT,
  };
}
