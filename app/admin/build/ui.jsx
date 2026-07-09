"use client";

// Shared primitives for the build planner.
//
// Extracted from BuildClient so each section can live in its own file and be
// worked on independently. Nothing here knows about BuildState — these are
// pure presentation, driven entirely by props.
//
// House rules encoded here rather than re-litigated per section:
//   · every button carries a visible outline and a fill lighter than its
//     background; no bare text-on-background controls
//   · no left-border accent bars
//   · colour is rationed — a chip's tone means something
//   · dates render mm/dd/yyyy, never ISO

import { useState } from "react";

import { COLORS, FONT, STYLES, inputStyle, btnStyle as btn } from "../budget/lib/tokens";
import { Icon, ICON } from "../budget/lib/icons";
import { fmtUsd, fmtCompact } from "../budget/lib/money";

const ACCENT = COLORS.accent;
const ACCENT_SOFT = COLORS.accentSoft;

/** Loaded by app/layout.jsx via next/font. Titles only. */
export const SERIF = "var(--font-source-serif), 'Source Serif 4', Georgia, serif";

export { COLORS, FONT, STYLES, inputStyle, btn, Icon, ICON, fmtUsd, fmtCompact, ACCENT, ACCENT_SOFT };

export function Card({ title, sub, children }) {
  return (
    <section style={{ ...STYLES.card, padding: 0, overflow: "hidden", marginBottom: 14 }}>
      <div style={{
        display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 10,
        padding: "14px 16px 12px", borderBottom: `1px solid ${COLORS.surfaceTint}`,
      }}>
        <span style={{ fontSize: 14, fontWeight: 800, letterSpacing: "-0.01em", color: COLORS.text }}>{title}</span>
        {sub != null && <span style={{ fontSize: 12, fontWeight: 700, color: COLORS.textFaint }}>{sub}</span>}
      </div>
      <div style={{ padding: "6px 12px 12px" }}>{children}</div>
    </section>
  );
}

export function Field({ label, children }) {
  return (
    <label style={{ display: "block", marginBottom: 12 }}>
      <span style={{ display: "block", fontSize: 10.5, fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", color: COLORS.textFaint, marginBottom: 5 }}>
        {label}
      </span>
      {children}
    </label>
  );
}

export function txt() {
  return { ...inputStyle(), width: "100%", boxSizing: "border-box", fontWeight: 600 };
}

export function MoneyInput({ value, onChange, placeholder }) {
  const toStr = (c) => (c ? (c / 100).toString() : "");
  const [draft, setDraft] = useState(() => toStr(value));
  return (
    <input
      type="text"
      inputMode="decimal"
      value={draft}
      onChange={(e) => setDraft(e.target.value)}
      onBlur={() => {
        const n = parseFloat(draft);
        const cents = isNaN(n) ? 0 : Math.round(n * 100);
        onChange(cents);
        setDraft(toStr(cents));
      }}
      placeholder={placeholder || "$0"}
      style={{ ...inputStyle(), width: "100%", boxSizing: "border-box", textAlign: "right", fontWeight: 700, fontVariantNumeric: "tabular-nums" }}
    />
  );
}

export function DelBtn({ onClick }) {
  return (
    <button
      onClick={onClick}
      aria-label="Delete"
      style={{
        width: 26, height: 26, borderRadius: 7, flexShrink: 0, cursor: "pointer",
        border: `1px solid ${COLORS.border}`, background: COLORS.surface, color: COLORS.textFaint,
        display: "grid", placeItems: "center",
      }}
      onMouseEnter={(e) => { e.currentTarget.style.background = COLORS.redBg; e.currentTarget.style.color = COLORS.red; e.currentTarget.style.borderColor = COLORS.red; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = COLORS.surface; e.currentTarget.style.color = COLORS.textFaint; e.currentTarget.style.borderColor = COLORS.border; }}
    >
      <Icon d={ICON.x} size={13} />
    </button>
  );
}

export function Check({ done, onClick }) {
  return (
    <button
      onClick={onClick}
      aria-pressed={done}
      aria-label={done ? "Done" : "Not done"}
      style={{
        width: 24, height: 24, borderRadius: 7, flexShrink: 0, cursor: "pointer",
        border: `1px solid ${done ? COLORS.green : COLORS.border}`,
        background: done ? COLORS.green : "transparent",
        display: "grid", placeItems: "center",
      }}
    >
      {done && <Icon d="M20 6L9 17l-5-5" size={13} color="#fff" />}
    </button>
  );
}

export function AddBtn({ label, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "inline-flex", alignItems: "center", gap: 6, marginTop: 6,
        padding: "9px 12px", borderRadius: 10, cursor: "pointer", fontFamily: FONT,
        fontSize: 12.5, fontWeight: 700, color: ACCENT,
        background: ACCENT_SOFT, border: "none",
      }}
    >
      <Icon d={["M12 5v14", "M5 12h14"]} size={13} />
      {label}
    </button>
  );
}

export function ProgressRing({ pct, size = 116, stroke = 9, caption }) {
  const r = (size - stroke) / 2;
  const circumference = 2 * Math.PI * r;
  const filled = circumference * (Math.min(100, Math.max(0, pct)) / 100);

  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={COLORS.surfaceTint} strokeWidth={stroke} />
        <circle
          cx={size / 2} cy={size / 2} r={r} fill="none" stroke={ACCENT} strokeWidth={stroke}
          strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={circumference - filled}
        />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", textAlign: "center" }}>
        <div>
          <div style={{ fontSize: 25, fontWeight: 700, letterSpacing: "-0.02em", lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>{pct}%</div>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: COLORS.textFaint, marginTop: 3 }}>{caption}</div>
        </div>
      </div>
    </div>
  );
}

export function StatTile({ label, value, sub, accent, pct, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        textAlign: "left", background: COLORS.surface, border: `1px solid ${COLORS.border}`,
        borderRadius: 12, padding: 14, cursor: "pointer", fontFamily: FONT,
        display: "flex", flexDirection: "column", gap: 2, minWidth: 0,
      }}
    >
      <span style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: COLORS.textFaint }}>{label}</span>
      <span style={{ fontSize: 21, fontWeight: 700, letterSpacing: "-0.02em", color: accent || COLORS.text, fontVariantNumeric: "tabular-nums", marginTop: 4 }}>{value}</span>
      <span style={{ fontSize: 11.5, color: COLORS.textFaint, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{sub}</span>
      {typeof pct === "number" && (
        <span style={{ display: "block", height: 3, borderRadius: 2, background: COLORS.surfaceTint, marginTop: 10, overflow: "hidden" }}>
          <span style={{ display: "block", height: "100%", width: `${Math.min(100, Math.max(0, pct))}%`, background: accent || ACCENT, borderRadius: 2 }} />
        </span>
      )}
    </button>
  );
}

export function SectionHead({ title, note }) {
  return (
    <div style={{ display: "flex", alignItems: "baseline", gap: 10, margin: "30px 0 11px" }}>
      <h3 style={{ fontSize: 14, fontWeight: 700, letterSpacing: "-0.01em", margin: 0 }}>{title}</h3>
      {note && <span style={{ fontSize: 12, color: COLORS.textFaint }}>{note}</span>}
    </div>
  );
}

export function Chip({ tone = "neutral", children }) {
  const map = {
    neutral: [COLORS.textMuted, COLORS.borderStrong, COLORS.surface],
    accent:  [COLORS.accent, COLORS.accent, COLORS.accentSoft],
    green:   [COLORS.green, COLORS.green, COLORS.greenBg],
    amber:   [COLORS.amber, COLORS.amber, COLORS.amberBg],
    red:     [COLORS.red, COLORS.red, COLORS.redBg],
  };
  const [fg, bd, bg] = map[tone] || map.neutral;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5, border: `1px solid ${bd}`,
      borderRadius: 999, padding: "2px 8px", fontSize: 11, fontWeight: 600,
      color: fg, background: bg, whiteSpace: "nowrap",
    }}>
      {children}
    </span>
  );
}

export function StatStrip({ items }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: 8, paddingBottom: 12 }}>
      {items.map(([l, v, c]) => (
        <div key={l} style={{ background: COLORS.surfaceTint, borderRadius: 10, padding: "9px 11px" }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 0.4, color: COLORS.textFaint, textTransform: "uppercase" }}>{l}</div>
          <div style={{ marginTop: 3, fontSize: 15, fontWeight: 800, color: c, fontVariantNumeric: "tabular-nums" }}>{v}</div>
        </div>
      ))}
    </div>
  );
}

export function fmtBuildDate(iso) {
  if (!iso) return "";
  const d = new Date(iso + "T00:00:00");
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function daysFromToday(iso) {
  const d = new Date(iso + "T00:00:00");
  const t = new Date(); t.setHours(0, 0, 0, 0);
  return Math.round((d.getTime() - t.getTime()) / 86400000);
}
