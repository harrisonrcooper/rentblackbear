"use client";

// Inspections section.

import { useState } from "react";

import { COLORS, FONT, inputStyle, btn, Icon, ICON, Card, txt, AddBtn, StatStrip, fmtBuildDate, AutoTextarea, SelectPill, INSPECTION_STATUSES } from "../ui";

const INSP_STATUS_META = {
  not_scheduled: ["not scheduled", COLORS.textFaint],
  scheduled: ["scheduled", COLORS.amber],
  passed: ["passed", COLORS.green],
  failed: ["failed", COLORS.red],
};

function InspectionCard({ insp, onChange, onDelete }) {
  const [open, setOpen] = useState(false);
  const [sLabel, sColor] = INSP_STATUS_META[insp.status] || INSP_STATUS_META.not_scheduled;
  return (
    <div style={{ border: `1px solid ${insp.status === "failed" ? COLORS.red : COLORS.border}`, borderRadius: 12, marginBottom: 10, overflow: "hidden" }}>
      <button onClick={() => setOpen((o) => !o)} style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "11px 12px", background: "transparent", border: "none", cursor: "pointer", fontFamily: FONT, textAlign: "left" }}>
        <Icon d={open ? ICON.chevD : ICON.chevR} size={13} color={COLORS.textFaint} />
        <span style={{ flex: 1, minWidth: 0 }}>
          <span style={{ display: "block", fontSize: 13.5, fontWeight: 700, color: COLORS.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{insp.name || "Inspection"}</span>
          {insp.date && <span style={{ display: "block", fontSize: 11.5, fontWeight: 600, color: COLORS.textMuted }}>{fmtBuildDate(insp.date)}</span>}
        </span>
        <span style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.04em", color: sColor, flexShrink: 0 }}>{sLabel}</span>
      </button>
      {open && (
        <div style={{ padding: "2px 14px 14px", display: "grid", gap: 10 }}>
          <input value={insp.name} onChange={(e) => onChange({ name: e.target.value })} placeholder="Inspection" style={{ ...txt(), fontWeight: 700 }} />
          <div style={{ display: "flex", gap: 8 }}>
            <input type="date" value={insp.date || ""} onChange={(e) => onChange({ date: e.target.value || null })} aria-label="Date" style={{ ...inputStyle(), flex: 1 }} />
            <SelectPill value={insp.status} options={INSPECTION_STATUSES} onChange={(status) => onChange({ status })} ariaLabel="Status" minWidth={128} />
          </div>
          <input value={insp.inspector} onChange={(e) => onChange({ inspector: e.target.value })} placeholder="Inspector / department" style={txt()} />
          <AutoTextarea value={insp.notes} onChange={(v) => onChange({ notes: v })} minRows={3} placeholder="Corrections, re-inspection notes…" />
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button onClick={onDelete} style={{ ...btn("ghost") }}><Icon d={ICON.x} size={13} /> Delete</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function InspectionsSection({ state, addRow, updRow, delRow }) {
  const insps = state.inspections || [];
  const passed = insps.filter((i) => i.status === "passed").length;
  const failed = insps.filter((i) => i.status === "failed").length;
  return (
    <Card title="Inspections" sub={`${passed}/${insps.length} passed`}>
      <div style={{ fontSize: 12, color: COLORS.textMuted, padding: "4px 2px 12px", lineHeight: 1.5 }}>
        Municipal sign-offs, in build order. You can&apos;t legally proceed past a failed one —
        log the corrections and re-inspection here.
      </div>
      <StatStrip items={[
        ["Passed", String(passed), COLORS.green],
        ["Failed", String(failed), failed ? COLORS.red : COLORS.text],
        ["Remaining", String(insps.length - passed), COLORS.text],
      ]} />
      {insps.map((insp) => (
        <InspectionCard key={insp.id} insp={insp}
          onChange={(p) => updRow("inspections", insp.id, p)}
          onDelete={() => delRow("inspections", insp.id)} />
      ))}
      <AddBtn label="Add inspection" onClick={() => addRow("inspections", { name: "New inspection", date: null, status: "not_scheduled", inspector: "", notes: "" })} />
    </Card>
  );
}
