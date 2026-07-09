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

/**
 * Money, shown the way money is written and edited the way numbers are typed.
 *
 * Two bugs lived here. It rendered `(cents/100).toString()`, so a hundred
 * thousand dollars read `100000` — no comma, no dollar sign, indistinguishable
 * from a phone extension. And `draft` was seeded once with useState, so when
 * the value changed from anywhere else (accepting a quote rewrites a cost
 * line) the field kept showing the old number for as long as the page stayed
 * open.
 *
 * So: formatted when idle, raw digits when you're typing in it, and the draft
 * follows the value whenever you are not the one holding the pen.
 */
export function MoneyInput({ value, onChange, placeholder }) {
  const cents = typeof value === "number" && Number.isFinite(value) ? value : 0;
  const raw = (c) => (c ? String(c / 100) : "");
  const pretty = (c) => (c ? fmtUsd(c) : "");

  const [focused, setFocused] = useState(false);
  const [draft, setDraft] = useState(() => raw(cents));

  // Follow the value while the user is elsewhere; never yank the text they are
  // mid-way through typing.
  useEffect(() => {
    if (!focused) setDraft(raw(cents));
  }, [cents, focused]);

  function commit() {
    const n = parseFloat(draft.replace(/[^0-9.-]/g, ""));
    const next = Number.isNaN(n) ? 0 : Math.round(n * 100);
    setFocused(false);
    if (next !== cents) onChange(next);
    setDraft(raw(next));
  }

  return (
    <input
      type="text"
      inputMode="decimal"
      value={focused ? draft : pretty(cents)}
      onChange={(e) => setDraft(e.target.value)}
      onFocus={(e) => { setFocused(true); setDraft(raw(cents)); requestAnimationFrame(() => e.target.select()); }}
      onBlur={commit}
      onKeyDown={(e) => { if (e.key === "Enter") e.currentTarget.blur(); }}
      placeholder={placeholder || "—"}
      style={{
        ...inputStyle(), width: "100%", boxSizing: "border-box", textAlign: "right",
        fontWeight: cents ? 700 : 500,
        color: cents ? COLORS.text : COLORS.textFaint,
        fontVariantNumeric: "tabular-nums",
      }}
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
        background: ACCENT_SOFT, border: `1px solid ${COLORS.accent}`,
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
 * A date field that reads mm/dd/yyyy and picks with the platform's own picker.
 *
 * A bare `<input type="date">` renders its value in the operating system's
 * locale, so the same build shows 09/07/2026 to one person and 07/09/2026 to
 * another — and the house rule is mm/dd/yyyy, always. Hand-rolling a calendar
 * would throw away the one thing the native control is genuinely better at:
 * the iOS wheel, which is the picker this planner is actually used with.
 *
 * So: our button paints the value through fmtBuildDate, and a transparent
 * native input sits on top of it purely to summon the picker. `showPicker()`
 * where it exists (Chrome, Edge), a plain click everywhere else (Safari, iOS).
 */
export function DateField({ value, onChange, placeholder = "Pick a date", ariaLabel, width, clearable = true }) {
  const ref = useRef(null);

  function summon() {
    const el = ref.current;
    if (!el) return;
    // showPicker throws if it wasn't called from a user gesture; we always are,
    // but a browser that disagrees should still fall through to a focus.
    try {
      if (typeof el.showPicker === "function") { el.showPicker(); return; }
    } catch { /* fall through */ }
    el.focus();
  }

  return (
    <div style={{ position: "relative", width: width || "100%", minWidth: 132 }}>
      <div
        aria-hidden="true"
        style={{
          display: "flex", alignItems: "center", gap: 7, height: 32,
          padding: "0 8px 0 10px", borderRadius: 8,
          border: `1px solid ${COLORS.border}`, background: COLORS.surface,
          fontFamily: FONT, fontSize: 13, fontWeight: 600,
          color: value ? COLORS.text : COLORS.textFaint,
          fontVariantNumeric: "tabular-nums",
        }}
      >
        <Icon d={ICON.calendar} size={13} color={COLORS.textFaint} />
        <span style={{ flex: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {value ? fmtBuildDate(value) : placeholder}
        </span>
      </div>

      <input
        ref={ref}
        type="date"
        value={value || ""}
        aria-label={ariaLabel || placeholder}
        onChange={(e) => onChange(e.target.value || null)}
        onClick={summon}
        style={{
          position: "absolute", inset: 0, width: "100%", height: "100%",
          opacity: 0, cursor: "pointer", border: "none", background: "transparent",
        }}
      />

      {clearable && value && (
        <button
          type="button"
          onClick={() => onChange(null)}
          aria-label="Clear the date"
          style={{
            position: "absolute", right: 4, top: 4, zIndex: 2, width: 24, height: 24,
            borderRadius: 6, border: "none", background: "transparent",
            cursor: "pointer", display: "grid", placeItems: "center", lineHeight: 0,
          }}
        >
          <Icon d="M18 6L6 18M6 6l12 12" size={12} color={COLORS.textFaint} />
        </button>
      )}
    </div>
  );
}

/**
 * Today, as a yyyy-mm-dd calendar date on the USER'S clock.
 *
 * `new Date().toISOString().slice(0, 10)` is the obvious version and it is
 * wrong: it yields the UTC date, so anything stamped after ~5pm Pacific is
 * dated tomorrow. A photo taken at dusk, a payment entered after dinner, a
 * change order logged in the evening — all a day ahead of the day they
 * happened. Four sections had each hand-rolled their own fix and two had the
 * bug; it belongs in exactly one place.
 */
export function todayIso() {
  const d = new Date();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${mm}-${dd}`;
}

/**
 * The screen a section shows before it holds anything.
 *
 * Most of this planner is empty on day one, so for several sections this IS
 * the screen — not a fallback. It gets a title that says what the section is
 * for, a sentence that says why it matters, and exactly ONE primary action.
 * A second action, if it exists, is quiet.
 */
export function EmptyState({ icon, title, children, action, secondary }) {
  return (
    <div style={{
      border: `1px solid ${COLORS.border}`, borderRadius: 14, background: COLORS.surface,
      padding: "38px 28px", textAlign: "center", fontFamily: FONT,
    }}>
      {icon && (
        <div style={{
          width: 42, height: 42, margin: "0 auto 14px", borderRadius: 11,
          background: COLORS.accentSoft, display: "grid", placeItems: "center",
        }}>
          <Icon d={icon} size={20} color={COLORS.accent} />
        </div>
      )}
      <div style={{ fontFamily: SERIF, fontSize: 19, fontWeight: 600, letterSpacing: "-0.01em" }}>{title}</div>
      {/* A div, not a p: a section may want to preview what its primary action
          will create, and a list inside a paragraph is invalid markup that
          React silently reparents. Documents lost its ten-document preview to
          exactly that. */}
      <div style={{
        fontSize: 13.5, color: COLORS.textMuted, lineHeight: 1.6,
        margin: "8px auto 0", maxWidth: "46ch",
      }}>
        {children}
      </div>
      {(action || secondary) && (
        <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap", marginTop: 20 }}>
          {action}
          {secondary}
        </div>
      )}
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
