"use client";

// Selections section.

import { useState } from "react";

import { COLORS, FONT, inputStyle, btn, Icon, ICON, fmtCompact, Card, txt, MoneyInput, AddBtn, AutoTextarea, SelectPill, SELECTION_STATUSES } from "../ui";

const SEL_STATUS = { open: COLORS.textFaint, decided: COLORS.amber, ordered: COLORS.green };

function SelectionCard({ sel, onChange, onDelete }) {
  const [open, setOpen] = useState(false);
  const dueSoon = sel.deadline && sel.status === "open"
    && (new Date(sel.deadline).getTime() - Date.now()) < 21 * 864e5;
  return (
    <div style={{ border: `1px solid ${dueSoon ? COLORS.red : COLORS.border}`, borderRadius: 12, marginBottom: 10, overflow: "hidden" }}>
      <button
        onClick={() => setOpen((o) => !o)}
        style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "11px 12px", background: "transparent", border: "none", cursor: "pointer", fontFamily: FONT, textAlign: "left" }}
      >
        <Icon d={open ? ICON.chevD : ICON.chevR} size={13} color={COLORS.textFaint} />
        <span style={{ flex: 1, minWidth: 0 }}>
          <span style={{ display: "block", fontSize: 13.5, fontWeight: 700, color: COLORS.text }}>{sel.label || "Selection"}</span>
          {sel.choice && <span style={{ display: "block", fontSize: 11.5, color: COLORS.textMuted, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{sel.choice}</span>}
        </span>
        {sel.notes && (
          <Icon d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6 M16 13H8 M16 17H8" size={12} color={COLORS.textFaint} />
        )}
        <span style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.05em", color: SEL_STATUS[sel.status], flexShrink: 0 }}>
          {sel.status}
        </span>
      </button>
      {open && (
        <div style={{ padding: "2px 14px 14px", display: "grid", gap: 10 }}>
          <input value={sel.label} onChange={(e) => onChange({ label: e.target.value })} placeholder="Selection" style={{ ...txt(), fontWeight: 700 }} />
          <input value={sel.choice} onChange={(e) => onChange({ choice: e.target.value })} placeholder="Your pick…" style={txt()} />
          <input value={sel.vendor} onChange={(e) => onChange({ vendor: e.target.value })} placeholder="Vendor" style={txt()} />
          <div style={{ display: "flex", gap: 8 }}>
            <div style={{ flex: 1 }}>
              <span style={{ display: "block", fontSize: 10, fontWeight: 700, color: COLORS.textFaint, textTransform: "uppercase", marginBottom: 4 }}>Allowance</span>
              <MoneyInput value={sel.allowance_cents || 0} onChange={(v) => onChange({ allowance_cents: v })} />
            </div>
            <div style={{ flex: 1 }}>
              <span style={{ display: "block", fontSize: 10, fontWeight: 700, color: COLORS.textFaint, textTransform: "uppercase", marginBottom: 4 }}>Actual</span>
              <MoneyInput value={sel.actual_cents || 0} onChange={(v) => onChange({ actual_cents: v })} />
            </div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <input value={sel.lead_time} onChange={(e) => onChange({ lead_time: e.target.value })} placeholder="Lead time (e.g. 8 weeks)" style={{ ...txt(), flex: 1 }} />
            <input type="date" value={sel.deadline || ""} onChange={(e) => onChange({ deadline: e.target.value || null })} aria-label="Decide-by date" style={{ ...inputStyle(), width: 150 }} />
          </div>
          <div>
            <span style={{ display: "block", fontSize: 10, fontWeight: 700, color: COLORS.textFaint, textTransform: "uppercase", marginBottom: 4 }}>Spec notes</span>
            <AutoTextarea
              value={sel.notes}
              onChange={(v) => onChange({ notes: v })}
              minRows={4}
              placeholder="The requirements behind this choice…"
            />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <SelectPill value={sel.status} options={SELECTION_STATUSES} onChange={(status) => onChange({ status })} ariaLabel="Status" minWidth={100} />
            <button onClick={onDelete} style={{ ...btn("ghost") }}><Icon d={ICON.x} size={13} /> Delete</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function SelectionsSection({ state, addRow, updRow, delRow }) {
  const sels = state.selections;
  const allowance = sels.reduce((s, x) => s + (x.allowance_cents || 0), 0);
  const actual = sels.reduce((s, x) => s + (x.actual_cents || 0), 0);
  const openCount = sels.filter((x) => x.status === "open").length;
  return (
    <Card title="Finish selections" sub={`${openCount} still open`}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: 8, padding: "6px 2px 12px" }}>
        {[
          ["Allowances", fmtCompact(allowance), COLORS.text],
          ["Actual / chosen", fmtCompact(actual), COLORS.text],
          [allowance - actual >= 0 ? "Under allowance" : "Over allowance", fmtCompact(Math.abs(allowance - actual)), allowance - actual >= 0 ? COLORS.green : COLORS.red],
        ].map(([l, v, c]) => (
          <div key={l} style={{ background: COLORS.surfaceTint, borderRadius: 10, padding: "9px 11px" }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 0.4, color: COLORS.textFaint, textTransform: "uppercase" }}>{l}</div>
            <div style={{ marginTop: 3, fontSize: 15, fontWeight: 800, color: c, fontVariantNumeric: "tabular-nums" }}>{v}</div>
          </div>
        ))}
      </div>
      {sels.map((sel) => (
        <SelectionCard
          key={sel.id}
          sel={sel}
          onChange={(patch) => updRow("selections", sel.id, patch)}
          onDelete={() => delRow("selections", sel.id)}
        />
      ))}
      <AddBtn label="Add selection" onClick={() => addRow("selections", { label: "New selection", choice: "", status: "open", vendor: "", allowance_cents: 0, actual_cents: 0, lead_time: "", deadline: null })} />
    </Card>
  );
}
