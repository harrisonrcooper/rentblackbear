"use client";

// Energy section.

import { COLORS, Card, txt, DelBtn, AddBtn } from "../ui";

export default function EnergySection({ state, addRow, updRow, delRow }) {
  const metrics = state.energy || [];
  const cap = { display: "block", fontSize: 10, fontWeight: 700, color: COLORS.textFaint, textTransform: "uppercase", marginBottom: 4 };
  return (
    <Card title="Energy & commissioning" sub={`${metrics.length} metrics`}>
      <div style={{ fontSize: 12, color: COLORS.textMuted, padding: "4px 2px 12px", lineHeight: 1.5 }}>
        Your performance scorecard — HERS, blower-door, AeroBarrier, ERV commissioning. Record
        the target and the verified result side by side.
      </div>
      {metrics.map((m) => (
        <div key={m.id} style={{ border: `1px solid ${COLORS.border}`, borderRadius: 12, padding: 10, marginBottom: 8, display: "grid", gap: 8 }}>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <input value={m.label} onChange={(e) => updRow("energy", m.id, { label: e.target.value })} placeholder="Metric" style={{ ...txt(), flex: 1, minWidth: 0, fontWeight: 700 }} />
            <DelBtn onClick={() => delRow("energy", m.id)} />
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <div style={{ flex: 1 }}>
              <span style={cap}>Target</span>
              <input value={m.target} onChange={(e) => updRow("energy", m.id, { target: e.target.value })} placeholder="goal" style={txt()} />
            </div>
            <div style={{ flex: 1 }}>
              <span style={cap}>Verified result</span>
              <input value={m.value} onChange={(e) => updRow("energy", m.id, { value: e.target.value })} placeholder="measured" style={txt()} />
            </div>
          </div>
        </div>
      ))}
      <AddBtn label="Add metric" onClick={() => addRow("energy", { label: "New metric", value: "", target: "" })} />
    </Card>
  );
}
