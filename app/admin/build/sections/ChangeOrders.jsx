"use client";

// ChangeOrders section.

import { useState } from "react";

import { COLORS, FONT, inputStyle, btn, Icon, ICON, fmtCompact, Card, txt, MoneyInput, AddBtn, StatStrip, fmtBuildDate, SelectPill, CHANGE_ORDER_KINDS, CHANGE_ORDER_STATUSES } from "../ui";

const CO_STATUS_COLOR = { pending: COLORS.amber, approved: COLORS.green, rejected: COLORS.textFaint };

function ChangeOrderCard({ co, onChange, onDelete }) {
  const [open, setOpen] = useState(false);
  const credit = co.kind === "credit";
  return (
    <div style={{ border: `1px solid ${COLORS.border}`, borderRadius: 12, marginBottom: 10, overflow: "hidden" }}>
      <button onClick={() => setOpen((o) => !o)} style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "11px 12px", background: "transparent", border: "none", cursor: "pointer", fontFamily: FONT, textAlign: "left" }}>
        <Icon d={open ? ICON.chevD : ICON.chevR} size={13} color={COLORS.textFaint} />
        <span style={{ flex: 1, minWidth: 0 }}>
          <span style={{ display: "block", fontSize: 13.5, fontWeight: 700, color: COLORS.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{co.description || "Change order"}</span>
          <span style={{ display: "block", fontSize: 11.5, fontWeight: 700, color: credit ? COLORS.green : COLORS.textMuted }}>
            {credit ? "−" : "+"}{fmtCompact(co.amount_cents || 0)}{co.date ? ` · ${fmtBuildDate(co.date)}` : ""}
          </span>
        </span>
        <span style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.05em", color: CO_STATUS_COLOR[co.status], flexShrink: 0 }}>{co.status}</span>
      </button>
      {open && (
        <div style={{ padding: "2px 14px 14px", display: "grid", gap: 10 }}>
          <input value={co.description} onChange={(e) => onChange({ description: e.target.value })} placeholder="What changed" style={{ ...txt(), fontWeight: 700 }} />
          <input value={co.reason} onChange={(e) => onChange({ reason: e.target.value })} placeholder="Why — reason for the change" style={txt()} />
          <div style={{ display: "flex", gap: 8 }}>
            <SelectPill value={co.kind} options={CHANGE_ORDER_KINDS} onChange={(kind) => onChange({ kind })} ariaLabel="Kind" minWidth={116} />
            <div style={{ flex: 1 }}><MoneyInput value={co.amount_cents} onChange={(v) => onChange({ amount_cents: v })} /></div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <input type="date" value={co.date || ""} onChange={(e) => onChange({ date: e.target.value || null })} aria-label="Date" style={{ ...inputStyle(), flex: 1 }} />
            <SelectPill value={co.status} options={CHANGE_ORDER_STATUSES} onChange={(status) => onChange({ status })} ariaLabel="Status" minWidth={104} />
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button onClick={onDelete} style={{ ...btn("ghost") }}><Icon d={ICON.x} size={13} /> Delete</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ChangeOrdersSection({ state, addRow, updRow, delRow }) {
  const cos = state.change_orders || [];
  const sgn = (o) => (o.kind === "credit" ? -1 : 1) * (o.amount_cents || 0);
  const approvedNet = cos.filter((o) => o.status === "approved").reduce((s, o) => s + sgn(o), 0);
  const pending = cos.filter((o) => o.status === "pending");
  const pendingNet = pending.reduce((s, o) => s + sgn(o), 0);
  const fmtSgn = (n) => (n > 0 ? "+" : n < 0 ? "−" : "") + fmtCompact(Math.abs(n));
  return (
    <Card title="Change orders" sub={`${cos.length} logged`}>
      <div style={{ fontSize: 12, color: COLORS.textMuted, padding: "4px 2px 12px", lineHeight: 1.5 }}>
        Every change to the contract — the single biggest reason builds blow their budget. Log
        each one and approve it deliberately. Approved orders roll into your revised cost.
      </div>
      <StatStrip items={[
        ["Approved", fmtSgn(approvedNet), approvedNet > 0 ? COLORS.amber : approvedNet < 0 ? COLORS.green : COLORS.text],
        ["Pending", `${pending.length} · ${fmtSgn(pendingNet)}`, COLORS.textMuted],
        ["Logged", String(cos.length), COLORS.text],
      ]} />
      {cos.map((co) => (
        <ChangeOrderCard key={co.id} co={co}
          onChange={(p) => updRow("change_orders", co.id, p)}
          onDelete={() => delRow("change_orders", co.id)} />
      ))}
      <AddBtn label="Add change order" onClick={() => addRow("change_orders", { date: new Date().toISOString().slice(0, 10), description: "New change order", reason: "", amount_cents: 0, kind: "add", status: "pending" })} />
    </Card>
  );
}
