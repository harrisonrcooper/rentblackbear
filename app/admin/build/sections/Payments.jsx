"use client";

// Payments section.

import { useState } from "react";

import { COLORS, FONT, inputStyle, btn, Icon, ICON, fmtCompact, Card, txt, MoneyInput, Check, AddBtn, StatStrip, fmtBuildDate, SelectPill, optionsFrom, LIEN_WAIVERS } from "../ui";

const PAY_METHODS = ["Check", "ACH", "Wire", "Card", "Cash", "Loan draw"];

const WAIVER_META = {
  not_needed: ["n/a", COLORS.textFaint],
  pending: ["waiver due", COLORS.amber],
  received: ["waiver in", COLORS.green],
};

function PaymentCard({ pay, onChange, onDelete }) {
  const [open, setOpen] = useState(false);
  const [wLabel, wColor] = WAIVER_META[pay.lien_waiver] || WAIVER_META.not_needed;
  return (
    <div style={{ border: `1px solid ${COLORS.border}`, borderRadius: 12, marginBottom: 10, overflow: "hidden" }}>
      <button onClick={() => setOpen((o) => !o)} style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "11px 12px", background: "transparent", border: "none", cursor: "pointer", fontFamily: FONT, textAlign: "left" }}>
        <Icon d={open ? ICON.chevD : ICON.chevR} size={13} color={COLORS.textFaint} />
        <span style={{ flex: 1, minWidth: 0 }}>
          <span style={{ display: "block", fontSize: 13.5, fontWeight: 700, color: COLORS.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{pay.vendor || "Payment"}</span>
          <span style={{ display: "block", fontSize: 11.5, fontWeight: 600, color: COLORS.textMuted }}>
            {fmtCompact(pay.amount_cents || 0)}{pay.date ? ` · ${fmtBuildDate(pay.date)}` : ""}
          </span>
        </span>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 5, flexShrink: 0 }}>
          <span style={{ width: 7, height: 7, borderRadius: "50%", background: wColor }} />
          <span style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.04em", color: wColor }}>{wLabel}</span>
        </span>
      </button>
      {open && (
        <div style={{ padding: "2px 14px 14px", display: "grid", gap: 10 }}>
          <input value={pay.vendor} onChange={(e) => onChange({ vendor: e.target.value })} placeholder="Vendor — who you paid" style={{ ...txt(), fontWeight: 700 }} />
          <input value={pay.description} onChange={(e) => onChange({ description: e.target.value })} placeholder="What it was for" style={txt()} />
          <div style={{ display: "flex", gap: 8 }}>
            <div style={{ flex: 1 }}><MoneyInput value={pay.amount_cents} onChange={(v) => onChange({ amount_cents: v })} /></div>
            <input type="date" value={pay.date || ""} onChange={(e) => onChange({ date: e.target.value || null })} aria-label="Date" style={{ ...inputStyle(), flex: 1 }} />
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <SelectPill value={pay.method} options={optionsFrom(PAY_METHODS)} onChange={(method) => onChange({ method })} ariaLabel="Method" minWidth={106} />
            <SelectPill value={pay.lien_waiver} options={LIEN_WAIVERS} onChange={(lien_waiver) => onChange({ lien_waiver })} ariaLabel="Lien waiver" minWidth={128} />
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button onClick={onDelete} style={{ ...btn("ghost") }}><Icon d={ICON.x} size={13} /> Delete</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function PaymentsSection({ state, addRow, updRow, delRow }) {
  const pays = state.payments || [];
  const total = pays.reduce((s, p) => s + (p.amount_cents || 0), 0);
  const waiverDue = pays.filter((p) => p.lien_waiver === "pending");
  const sorted = pays.slice().sort((a, b) => {
    if (!a.date) return 1;
    if (!b.date) return -1;
    return a.date < b.date ? 1 : -1;
  });
  return (
    <Card title="Payments" sub={`${fmtCompact(total)} paid`}>
      <div style={{ fontSize: 12, color: COLORS.textMuted, padding: "4px 2px 12px", lineHeight: 1.5 }}>
        Every dollar out the door. Collect a signed lien waiver with each payment — without one,
        a paid sub or supplier can still put a lien on your finished home.
      </div>
      <StatStrip items={[
        ["Total paid", fmtCompact(total), COLORS.text],
        ["Payments", String(pays.length), COLORS.text],
        ["Waivers due", String(waiverDue.length), waiverDue.length ? COLORS.red : COLORS.green],
      ]} />
      {waiverDue.length > 0 && (
        <div style={{ display: "flex", alignItems: "center", gap: 8, background: "rgba(220,38,38,0.08)", borderRadius: 10, padding: "9px 11px", marginBottom: 12 }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: COLORS.red, flexShrink: 0 }} />
          <span style={{ fontSize: 12, fontWeight: 600, color: COLORS.text }}>
            {waiverDue.length} payment{waiverDue.length > 1 ? "s" : ""} still waiting on a signed lien waiver — chase these down.
          </span>
        </div>
      )}
      {sorted.map((pay) => (
        <PaymentCard key={pay.id} pay={pay}
          onChange={(p) => updRow("payments", pay.id, p)}
          onDelete={() => delRow("payments", pay.id)} />
      ))}
      <AddBtn label="Add payment" onClick={() => addRow("payments", { date: new Date().toISOString().slice(0, 10), vendor: "New payment", description: "", amount_cents: 0, method: "Check", lien_waiver: "pending" })} />
    </Card>
  );
}
