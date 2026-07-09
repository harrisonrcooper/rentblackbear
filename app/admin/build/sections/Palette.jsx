"use client";

// Colors & Finishes — the finish palette (white oak, quartzite, gunmetal).
//
// This is a reference sheet he hands to the architect, builder and painter so
// everyone works from the same materials. It is deliberately edit-in-place:
// there are only a colour, a name and two short notes per swatch, so a drawer
// would be more navigation than the thing is worth. Tap the colour band to set
// the colour; type straight into the fields. State is mutated only through
// addRow / updRow / delRow — the array is never rewritten here.

import { useEffect, useRef } from "react";

import { COLORS, SERIF, ACCENT, Icon, txt, DelBtn, AddBtn, SectionHead, AutoTextarea } from "../ui";

// A colour band that reads as a real swatch, not a form control. The native
// picker is the single most-understood way to choose a colour on a phone, so
// it stays — but only a valid #rrggbb feeds it, or it silently resets to grey.
const DROPLET = "M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z";

function safeColor(c) {
  return /^#[0-9a-f]{6}$/i.test(c || "") ? c : "#cccccc";
}

function SwatchCard({ swatch, updRow, delRow, nameRef }) {
  const set = (patch) => updRow("palette", swatch.id, patch);
  const isSet = safeColor(swatch.color) !== "#cccccc";

  return (
    <div style={{ border: `1px solid ${COLORS.border}`, borderRadius: 14, overflow: "hidden", background: COLORS.surface, display: "flex", flexDirection: "column" }}>
      {/* Colour band — tap anywhere on it to open the picker. */}
      <label style={{ position: "relative", display: "block", cursor: "pointer" }}>
        <input
          type="color"
          value={safeColor(swatch.color)}
          onChange={(e) => set({ color: e.target.value })}
          aria-label={`Colour for ${swatch.name || "this swatch"}`}
          style={{ width: "100%", height: 88, border: "none", padding: 0, cursor: "pointer", display: "block" }}
        />
        {!isSet && (
          <span style={{
            position: "absolute", inset: 0, display: "grid", placeItems: "center",
            pointerEvents: "none", fontSize: 12, fontWeight: 700, color: COLORS.textMuted,
          }}>
            Tap to pick a colour
          </span>
        )}
      </label>

      <div style={{ padding: "10px 11px 11px", display: "flex", flexDirection: "column", gap: 7 }}>
        <input
          ref={nameRef}
          value={swatch.name || ""}
          onChange={(e) => set({ name: e.target.value })}
          placeholder="Name it (White oak)"
          style={{ ...txt(), fontWeight: 800, padding: "6px 9px" }}
        />
        <input
          value={swatch.material || ""}
          onChange={(e) => set({ material: e.target.value })}
          placeholder="Finish or material"
          style={{ ...txt(), padding: "6px 9px", fontSize: 12.5 }}
        />
        <AutoTextarea
          value={swatch.note || ""}
          onChange={(v) => set({ note: v })}
          minRows={1}
          placeholder="Where it's used"
          style={{ minHeight: 34, padding: "6px 9px", fontSize: 12, lineHeight: "18px" }}
        />
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 1 }}>
          <DelBtn onClick={() => delRow("palette", swatch.id)} />
        </div>
      </div>
    </div>
  );
}

export default function PaletteSection({ state, addRow, updRow, delRow }) {
  const palette = state.palette || [];

  // After adding a swatch, drop the cursor straight into its name field so the
  // next thing he does is name it — no hunting for the new card in the grid.
  const nameRefs = useRef({});
  const focusNewest = useRef(false);
  useEffect(() => {
    if (!focusNewest.current) return;
    focusNewest.current = false;
    const last = palette[palette.length - 1];
    const el = last && nameRefs.current[last.id];
    if (el) el.focus();
  }, [palette]);

  function addSwatch() {
    focusNewest.current = true;
    addRow("palette", { name: "", color: "#cccccc", material: "", note: "" });
  }

  // ── Empty state — the first (and, for most people, only) screen here ───────
  if (palette.length === 0) {
    return (
      <>
        <SectionHead title="Colors & Finishes" note="Your finish palette — one sheet everyone builds from" />
        <div style={{ border: `1px solid ${COLORS.border}`, borderRadius: 16, background: COLORS.surface, padding: "40px 20px 44px", textAlign: "center", maxWidth: 480, margin: "8px auto 0" }}>
          <div style={{ width: 48, height: 48, margin: "0 auto 16px", borderRadius: 14, background: COLORS.accentSoft, display: "grid", placeItems: "center" }}>
            <Icon d={DROPLET} size={24} color={ACCENT} />
          </div>
          <h3 style={{ fontFamily: SERIF, fontSize: 21, fontWeight: 600, margin: "0 0 7px" }}>Build your palette</h3>
          <p style={{ fontSize: 13.5, color: COLORS.textMuted, lineHeight: 1.55, margin: "0 auto 20px", maxWidth: 380 }}>
            Add a swatch for each colour and finish — white oak, quartzite, gunmetal. Pick its
            colour, give it a name, and note where it goes. Hand the whole set to your architect,
            builder and painter so nobody guesses.
          </p>
          <AddBtn label="Add your first swatch" onClick={addSwatch} />
        </div>
      </>
    );
  }

  return (
    <>
      <SectionHead
        title="Colors & Finishes"
        note={`${palette.length} ${palette.length === 1 ? "swatch" : "swatches"} · one sheet everyone builds from`}
      />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 11 }}>
        {palette.map((s) => (
          <SwatchCard
            key={s.id}
            swatch={s}
            updRow={updRow}
            delRow={delRow}
            nameRef={(el) => { nameRefs.current[s.id] = el; }}
          />
        ))}
      </div>

      <div style={{ marginTop: 14 }}>
        <AddBtn label="Add swatch" onClick={addSwatch} />
      </div>
    </>
  );
}
