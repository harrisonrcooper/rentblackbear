"use client";

// Palette section.

import { COLORS, inputStyle, Card, DelBtn, AddBtn } from "../ui";

export default function PaletteSection({ state, addRow, updRow, delRow }) {
  const palette = state.palette || [];
  return (
    <Card title="Materials & colors" sub={`${palette.length} swatches`}>
      <div style={{ fontSize: 12, color: COLORS.textMuted, padding: "4px 2px 12px", lineHeight: 1.5 }}>
        Your finish palette — tap a swatch to set its color. Hand this to the architect and builder
        so everyone&apos;s working from the same materials.
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 10 }}>
        {palette.map((s) => (
          <div key={s.id} style={{ border: `1px solid ${COLORS.border}`, borderRadius: 12, overflow: "hidden", background: COLORS.surface }}>
            <input
              type="color"
              value={/^#[0-9a-f]{6}$/i.test(s.color || "") ? s.color : "#cccccc"}
              onChange={(e) => updRow("palette", s.id, { color: e.target.value })}
              aria-label="Swatch color"
              style={{ width: "100%", height: 84, border: "none", padding: 0, cursor: "pointer", display: "block" }}
            />
            <div style={{ padding: "8px 10px 10px" }}>
              <input
                value={s.name} onChange={(e) => updRow("palette", s.id, { name: e.target.value })}
                placeholder="Name"
                style={{ ...inputStyle(), width: "100%", boxSizing: "border-box", fontWeight: 800, padding: "6px 8px" }}
              />
              <input
                value={s.material} onChange={(e) => updRow("palette", s.id, { material: e.target.value })}
                placeholder="Material"
                style={{ ...inputStyle(), width: "100%", boxSizing: "border-box", marginTop: 6, padding: "6px 8px", fontWeight: 600 }}
              />
              <input
                value={s.note} onChange={(e) => updRow("palette", s.id, { note: e.target.value })}
                placeholder="Where it's used"
                style={{ ...inputStyle(), width: "100%", boxSizing: "border-box", marginTop: 6, padding: "6px 8px", fontSize: 12 }}
              />
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: COLORS.textFaint, fontFamily: "monospace" }}>{s.color}</span>
                <DelBtn onClick={() => delRow("palette", s.id)} />
              </div>
            </div>
          </div>
        ))}
      </div>
      <AddBtn label="Add a swatch" onClick={() => addRow("palette", { name: "New swatch", color: "#cccccc", material: "", note: "" })} />
    </Card>
  );
}
