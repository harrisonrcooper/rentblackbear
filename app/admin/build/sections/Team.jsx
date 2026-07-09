"use client";

// Team section.

import { useState } from "react";

import { COLORS, FONT, Card, txt, DelBtn, AddBtn, AutoTextarea } from "../ui";

function VendorNotes({ value, onChange }) {
  const [open, setOpen] = useState(Boolean(value));
  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        style={{ marginTop: 4, background: "none", border: "none", cursor: "pointer", fontFamily: FONT, fontSize: 11.5, color: COLORS.textFaint, padding: 0 }}
      >
        + Add a note
      </button>
    );
  }
  return (
    <AutoTextarea
      value={value}
      onChange={onChange}
      minRows={3}
      placeholder="Advice, quotes, anything said about this vendor…"
      style={{ marginTop: 6, fontSize: 12.5 }}
    />
  );
}

export default function TeamSection({ state, addRow, updRow, delRow }) {
  return (
    <Card title="Team & vendors" sub={`${state.team.length} people`}>
      {state.team.map((t) => (
        <div key={t.id} data-item-id={t.id} style={{ padding: "8px 4px", borderBottom: `1px solid ${COLORS.surfaceTint}` }}>
          <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr) minmax(0,1fr) 26px", gap: 8, alignItems: "center" }}>
            <input type="text" value={t.role} onChange={(e) => updRow("team", t.id, { role: e.target.value })} style={{ ...txt(), fontWeight: 600 }} />
            <input type="text" value={t.name} onChange={(e) => updRow("team", t.id, { name: e.target.value })} style={txt()} placeholder="name" />
            <input type="text" value={t.contact} onChange={(e) => updRow("team", t.id, { contact: e.target.value })} style={txt()} placeholder="phone / email" />
            <DelBtn onClick={() => delRow("team", t.id)} />
          </div>
          <VendorNotes value={t.notes || ""} onChange={(v) => updRow("team", t.id, { notes: v })} />
        </div>
      ))}
      <AddBtn label="Add team member" onClick={() => addRow("team", { role: "New role", name: "", contact: "", notes: "" })} />
    </Card>
  );
}
