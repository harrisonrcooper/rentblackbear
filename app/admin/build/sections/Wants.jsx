"use client";

// Wants section — the wish list that becomes the architect brief.
//
// Three tiers: Need (non-negotiable), Want, Dream. Checking a row off is the
// core act, so the checkbox is the leftmost, largest thing on every row. Moving
// a row between tiers is a single tap on a segmented control — no popover, no
// second click — because that is the second-most-common thing done here.

import { useRef, useState } from "react";

import { COLORS, FONT, ACCENT, Card, txt, DelBtn, Check, Icon, ICON } from "../ui";

// Tier order is deliberate: what the house cannot do without comes first.
// Each tier's tone MEANS something — accent = essential/active, neutral =
// nice-to-have, violet = someday. Nothing is abbreviated.
const TIERS = [
  { value: "need", label: "Need", note: "non-negotiable" },
  { value: "want", label: "Want", note: "would love" },
  { value: "dream", label: "Dream", note: "if the budget allows" },
];

// tone maps to [foreground, border, fill]. Fill is always lighter than surface so
// an active segment reads as filled without shouting.
const TONE = {
  need: [COLORS.accent, COLORS.accent, COLORS.accentSoft],
  want: [COLORS.textMuted, COLORS.borderStrong, COLORS.surfaceTint],
  dream: [COLORS.purple, COLORS.purple, COLORS.purpleBg],
};

/** One-tap tier mover. All three destinations are always visible, so changing
 *  tier is a single click — never open-then-choose. */
function TierMover({ value, onPick, labelFor }) {
  return (
    <div
      role="group"
      aria-label={labelFor}
      style={{
        display: "inline-flex", gap: 1, flexShrink: 0, borderRadius: 9, overflow: "hidden",
        border: `1px solid ${COLORS.border}`, background: COLORS.border,
      }}
    >
      {TIERS.map((t) => {
        const on = t.value === value;
        const [fg, bd, bg] = TONE[t.value];
        return (
          <button
            key={t.value}
            type="button"
            aria-pressed={on}
            onClick={() => onPick(t.value)}
            style={{
              padding: "6px 10px", cursor: "pointer", fontFamily: FONT,
              fontSize: 11.5, fontWeight: on ? 700 : 600,
              color: on ? fg : COLORS.textFaint,
              background: on ? bg : COLORS.surface,
              border: "none",
              boxShadow: on ? `inset 0 0 0 1px ${bd}` : "none",
            }}
          >
            {t.label}
          </button>
        );
      })}
    </div>
  );
}

/** Type the real thing, press Enter, keep typing. No "New item" placeholder row
 *  that then has to be found and renamed. */
function QuickAdd({ onAdd, autoFocus }) {
  const [draft, setDraft] = useState("");
  const ref = useRef(null);
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const label = draft.trim();
        if (!label) return;
        onAdd(label);
        setDraft("");
        ref.current?.focus();
      }}
      style={{ position: "relative", marginBottom: 6 }}
    >
      <span style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
        <Icon d={ICON.plus} size={15} color={ACCENT} />
      </span>
      <input
        ref={ref}
        value={draft}
        autoFocus={autoFocus}
        onChange={(e) => setDraft(e.target.value)}
        placeholder="Add something your home needs…"
        aria-label="Add to your wish list"
        style={{ ...txt(), paddingLeft: 32 }}
      />
    </form>
  );
}

function WishRow({ w, updRow, delRow }) {
  return (
    <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 8, padding: "8px 4px", borderBottom: `1px solid ${COLORS.surfaceTint}` }}>
      <Check done={w.done} onClick={() => updRow("wishlist", w.id, { done: !w.done })} />
      <input
        type="text"
        value={w.label}
        onChange={(e) => updRow("wishlist", w.id, { label: e.target.value })}
        aria-label="What this is"
        style={{ ...txt(), flex: "1 1 130px", minWidth: 0, textDecoration: w.done ? "line-through" : "none", opacity: w.done ? 0.55 : 1 }}
      />
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginLeft: "auto", flexShrink: 0 }}>
        <TierMover
          value={w.priority}
          labelFor={`Tier for ${w.label}`}
          onPick={(priority) => updRow("wishlist", w.id, { priority })}
        />
        <DelBtn onClick={() => delRow("wishlist", w.id)} />
      </div>
    </div>
  );
}

export default function WantsSection({ state, addRow, updRow, delRow }) {
  const wishlist = state.wishlist || [];
  const total = wishlist.length;
  const done = wishlist.filter((w) => w.done).length;

  const addTo = (priority) => (label) => addRow("wishlist", { label, priority, done: false });

  // Empty is the first — and, until he starts, the only — thing he sees here.
  // Say what the list is for, then hand him one place to begin typing.
  if (total === 0) {
    return (
      <Card title="Wish list">
        <div style={{ textAlign: "center", padding: "18px 8px 8px", maxWidth: 460, margin: "0 auto" }}>
          <div style={{ width: 46, height: 46, borderRadius: 13, margin: "0 auto 12px", display: "grid", placeItems: "center", background: COLORS.accentSoft }}>
            <Icon d={ICON.flag} size={22} color={ACCENT} />
          </div>
          <div style={{ fontSize: 15.5, fontWeight: 800, letterSpacing: "-0.01em", color: COLORS.text }}>
            Start your wish list
          </div>
          <p style={{ fontSize: 13, color: COLORS.textMuted, lineHeight: 1.55, margin: "6px 0 16px" }}>
            Everything you jot here becomes your architect brief — what the home
            must have, what you would love, and what you would dream of if the
            budget allows. Type one thing and press Enter.
          </p>
          <div style={{ textAlign: "left" }}>
            <QuickAdd onAdd={addTo("need")} autoFocus />
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card title="Wish list" sub={`${done} of ${total} checked off`}>
      <QuickAdd onAdd={addTo("want")} />

      {TIERS.map((t) => {
        const items = wishlist.filter((w) => w.priority === t.value);
        if (items.length === 0) return null; // empty tiers stay out of the way until used
        const [fg] = TONE[t.value];
        const tierDone = items.filter((w) => w.done).length;
        return (
          <div key={t.value} style={{ marginTop: 14 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 7, padding: "0 4px 4px" }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: fg, flexShrink: 0 }} />
              <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.06em", textTransform: "uppercase", color: fg }}>
                {t.label}s
              </span>
              <span style={{ fontSize: 11, color: COLORS.textFaint }}>· {t.note}</span>
              <span style={{ marginLeft: "auto", fontSize: 11.5, fontWeight: 700, color: COLORS.textFaint, fontVariantNumeric: "tabular-nums" }}>
                {tierDone} / {items.length}
              </span>
            </div>
            {items.map((w) => (
              <WishRow key={w.id} w={w} updRow={updRow} delRow={delRow} />
            ))}
          </div>
        );
      })}
    </Card>
  );
}
