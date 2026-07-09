"use client";

// OpenQuestions section.

import { useState } from "react";

import { COLORS, FONT, inputStyle, btn, Icon, ICON, Card, txt, AddBtn, AutoTextarea, SelectPill, QUESTION_STATUSES } from "../ui";

function RfiCard({ rfi, onChange, onDelete }) {
  const [open, setOpen] = useState(false);
  const answered = rfi.status === "answered";
  return (
    <div style={{ border: `1px solid ${COLORS.border}`, borderRadius: 12, marginBottom: 10, overflow: "hidden" }}>
      <button onClick={() => setOpen((o) => !o)} style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "11px 12px", background: "transparent", border: "none", cursor: "pointer", fontFamily: FONT, textAlign: "left" }}>
        <Icon d={open ? ICON.chevD : ICON.chevR} size={13} color={COLORS.textFaint} />
        <span style={{ flex: 1, minWidth: 0 }}>
          <span style={{ display: "block", fontSize: 13.5, fontWeight: 700, color: COLORS.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{rfi.question || "Open question"}</span>
          {rfi.asked_of && <span style={{ display: "block", fontSize: 11.5, fontWeight: 600, color: COLORS.textMuted }}>For: {rfi.asked_of}</span>}
        </span>
        <span style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.04em", color: answered ? COLORS.green : COLORS.amber, flexShrink: 0 }}>{rfi.status}</span>
      </button>
      {open && (
        <div style={{ padding: "2px 14px 14px", display: "grid", gap: 10 }}>
          <AutoTextarea value={rfi.question} onChange={(v) => onChange({ question: v })} minRows={3} placeholder="The question…" style={{ fontWeight: 600 }} />
          <div style={{ display: "flex", gap: 8 }}>
            <input value={rfi.asked_of} onChange={(e) => onChange({ asked_of: e.target.value })} placeholder="Asked of — architect, builder…" style={{ ...txt(), flex: 1 }} />
            <input type="date" value={rfi.date || ""} onChange={(e) => onChange({ date: e.target.value || null })} aria-label="Date asked" style={{ ...inputStyle(), width: 150 }} />
          </div>
          <AutoTextarea value={rfi.answer} onChange={(v) => onChange({ answer: v })} minRows={3} placeholder="The answer, once you have it…" />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <SelectPill value={rfi.status} options={QUESTION_STATUSES} onChange={(status) => onChange({ status })} ariaLabel="Status" minWidth={108} />
            <button onClick={onDelete} style={{ ...btn("ghost") }}><Icon d={ICON.x} size={13} /> Delete</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function DecisionsSection({ state, addRow, updRow, delRow }) {
  const rfis = state.rfis || [];
  const openCount = rfis.filter((r) => r.status === "open").length;
  return (
    <Card title="Decisions & questions" sub={`${openCount} open`}>
      <div style={{ fontSize: 12, color: COLORS.textMuted, padding: "4px 2px 12px", lineHeight: 1.5 }}>
        Every open question for your architect or builder — and the answer once you get it.
        Nothing falls through the cracks.
      </div>
      {rfis.map((rfi) => (
        <RfiCard key={rfi.id} rfi={rfi}
          onChange={(p) => updRow("rfis", rfi.id, p)}
          onDelete={() => delRow("rfis", rfi.id)} />
      ))}
      {!rfis.length && (
        <div style={{ textAlign: "center", padding: "6px 0 10px", fontSize: 12, color: COLORS.textFaint }}>
          No open questions logged yet.
        </div>
      )}
      <AddBtn label="Add a question" onClick={() => addRow("rfis", { question: "", asked_of: "", answer: "", status: "open", date: new Date().toISOString().slice(0, 10) })} />
    </Card>
  );
}
