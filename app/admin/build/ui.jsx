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

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

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

/**
 * A textarea's style, which is NOT an input's style.
 *
 * `inputStyle()` hardcodes `height: 32` so single-line fields align across a
 * row. Spread that into a textarea and it clips to two lines no matter what
 * `rows` you pass — which is exactly what happened to the vision field. Height
 * must be free for a multi-line control; only a floor is set.
 */
export function textareaStyle({ minRows = 3 } = {}) {
  const base = txt();
  delete base.height;
  return {
    ...base,
    minHeight: minRows * 21 + 18, // lineHeight 21px + vertical padding
    padding: "9px 11px",
    lineHeight: "21px",
    fontWeight: 400,
    resize: "vertical",
    overflow: "hidden",
    display: "block",
  };
}

/**
 * A dropdown that looks like one.
 *
 * The page strips native select chrome (`appearance: none` in tokens.js), so a
 * bare <select> renders as a flat pill with no arrow and no hover — it reads as
 * a static label, and nobody discovers they can change it. This gives back the
 * affordance without giving back the native widget: a chevron, a hover state,
 * a popover, and full keyboard control.
 *
 * `options` is [{ value, label, tone }] where tone maps to a Chip tone.
 */
export function SelectPill({ value, options, onChange, ariaLabel, minWidth = 92 }) {
  const [open, setOpen] = useState(false);
  const [cursor, setCursor] = useState(0);
  const wrapRef = useRef(null);

  const current = options.find((o) => o.value === value) || options[0];

  useEffect(() => {
    if (!open) return undefined;
    setCursor(Math.max(0, options.findIndex((o) => o.value === value)));

    function onDocDown(e) {
      if (!wrapRef.current?.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", onDocDown);
    return () => document.removeEventListener("mousedown", onDocDown);
  }, [open, options, value]);

  function pick(option) {
    onChange(option.value);
    setOpen(false);
  }

  function onKeyDown(e) {
    if (!open) {
      if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") { e.preventDefault(); setOpen(true); }
      return;
    }
    if (e.key === "Escape") { e.preventDefault(); setOpen(false); return; }
    if (e.key === "ArrowDown") { e.preventDefault(); setCursor((c) => Math.min(c + 1, options.length - 1)); return; }
    if (e.key === "ArrowUp") { e.preventDefault(); setCursor((c) => Math.max(c - 1, 0)); return; }
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); pick(options[cursor]); }
  }

  const toneColor = (tone) => ({
    accent: COLORS.accent, green: COLORS.green, amber: COLORS.amber,
    red: COLORS.red, violet: COLORS.purple,
  }[tone] || COLORS.textMuted);

  return (
    <div ref={wrapRef} style={{ position: "relative", flexShrink: 0 }}>
      <button
        type="button"
        aria-label={ariaLabel}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        onKeyDown={onKeyDown}
        style={{
          display: "flex", alignItems: "center", justifyContent: "space-between", gap: 6,
          minWidth, height: 32, padding: "0 8px 0 11px", cursor: "pointer",
          border: `1px solid ${COLORS.borderStrong}`, borderRadius: 8,
          background: COLORS.surface, fontFamily: FONT, fontSize: 12.5, fontWeight: 600,
          color: toneColor(current?.tone),
        }}
      >
        {current?.label}
        <Icon d="M6 9l6 6 6-6" size={13} color={COLORS.textFaint} />
      </button>

      {open && (
        <div
          role="listbox"
          style={{
            position: "absolute", top: "calc(100% + 4px)", right: 0, zIndex: 60,
            minWidth: minWidth + 28, background: COLORS.surface,
            border: `1px solid ${COLORS.border}`, borderRadius: 10,
            boxShadow: COLORS.shadowLg, padding: 4,
          }}
        >
          {options.map((o, i) => {
            const on = o.value === value;
            return (
              <button
                key={o.value}
                type="button"
                role="option"
                aria-selected={on}
                onMouseEnter={() => setCursor(i)}
                onClick={() => pick(o)}
                style={{
                  display: "flex", alignItems: "center", gap: 8, width: "100%",
                  padding: "7px 9px", border: "none", borderRadius: 7, cursor: "pointer",
                  background: i === cursor ? COLORS.surfaceTint : "transparent",
                  fontFamily: FONT, fontSize: 13, fontWeight: on ? 700 : 500,
                  color: toneColor(o.tone), textAlign: "left",
                }}
              >
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: toneColor(o.tone), flexShrink: 0 }} />
                <span style={{ flex: 1 }}>{o.label}</span>
                {on && <Icon d="M20 6L9 17l-5-5" size={12} color={toneColor(o.tone)} />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// Option sets, shared so a label never drifts between two screens and so
// nothing is ever abbreviated. "Not applicable", never "n/a".

/** The three tiers a want can sit in. */
export const WISH_TIERS = [
  { value: "need", label: "Need", tone: "accent" },
  { value: "want", label: "Want", tone: "neutral" },
  { value: "dream", label: "Dream", tone: "violet" },
];

export const SELECTION_STATUSES = [
  { value: "open", label: "Open", tone: "neutral" },
  { value: "decided", label: "Decided", tone: "amber" },
  { value: "ordered", label: "Ordered", tone: "green" },
];

export const CHANGE_ORDER_KINDS = [
  { value: "add", label: "Adds cost", tone: "red" },
  { value: "credit", label: "Credit back", tone: "green" },
];

export const CHANGE_ORDER_STATUSES = [
  { value: "pending", label: "Pending", tone: "amber" },
  { value: "approved", label: "Approved", tone: "green" },
  { value: "rejected", label: "Rejected", tone: "neutral" },
];

export const LIEN_WAIVERS = [
  { value: "not_needed", label: "Not applicable", tone: "neutral" },
  { value: "pending", label: "Pending", tone: "amber" },
  { value: "received", label: "Received", tone: "green" },
];

export const INSPECTION_STATUSES = [
  { value: "not_scheduled", label: "Not scheduled", tone: "neutral" },
  { value: "scheduled", label: "Scheduled", tone: "amber" },
  { value: "passed", label: "Passed", tone: "green" },
  { value: "failed", label: "Failed", tone: "red" },
];

export const QUESTION_STATUSES = [
  { value: "open", label: "Open", tone: "amber" },
  { value: "answered", label: "Answered", tone: "green" },
];

/** Turn a plain string list into SelectPill options. */
export const optionsFrom = (values, { placeholder = "" } = {}) =>
  values.map((v) => ({ value: v, label: v || placeholder, tone: "neutral" }));

/**
 * A textarea that grows to fit its content and never hides a word.
 *
 * Property notes and vision statements are paragraphs, and a scrollbar inside
 * a 32px box is a way of saying "we didn't think you'd write anything". There
 * is deliberately no maxHeight: the page scrolls, the field doesn't.
 */
export function AutoTextarea({ value, onChange, minRows = 3, style, ...rest }) {
  const ref = useRef(null);

  const fit = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";                       // shrink first, or it only ever grows
    el.style.height = `${el.scrollHeight}px`;
  }, []);

  // Layout effect, not effect: size it before paint so there is no visible jump.
  useLayoutEffect(fit, [fit, value]);

  // A drawer or tab that mounts hidden reports scrollHeight 0. Re-fit once the
  // element actually has a box.
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof ResizeObserver === "undefined") return undefined;
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, [fit]);

  return (
    <textarea
      ref={ref}
      value={value || ""}
      onChange={(e) => { onChange(e.target.value); fit(); }}
      style={{ ...textareaStyle({ minRows }), ...style }}
      {...rest}
    />
  );
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

/**
 * Render an ISO date as mm/dd/yyyy. Never "Jul 9, 2026", never the ISO string.
 *
 * Parsed as UTC, not local: `new Date("2026-07-09")` is midnight UTC, which in
 * any timezone west of Greenwich is the evening of the 8th — so a naive
 * `getDate()` renders the wrong day for half the planet. Reading the UTC parts
 * back out sidesteps it entirely.
 */
export function fmtBuildDate(iso) {
  if (!iso) return "";
  const d = new Date(`${iso}T00:00:00Z`);
  if (Number.isNaN(d.getTime())) return iso;
  const mm = String(d.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(d.getUTCDate()).padStart(2, "0");
  return `${mm}/${dd}/${d.getUTCFullYear()}`;
}

export function daysFromToday(iso) {
  const d = new Date(iso + "T00:00:00");
  const t = new Date(); t.setHours(0, 0, 0, 0);
  return Math.round((d.getTime() - t.getTime()) / 86400000);
}
