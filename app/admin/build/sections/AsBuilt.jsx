"use client";

// AsBuilt section.

import { useState } from "react";

import { COLORS, FONT, inputStyle, btn, Icon, ICON, ACCENT, Card, txt, DelBtn, AddBtn, fmtBuildDate, daysFromToday } from "../ui";
import { EXTERNAL_ICON } from "./_common";

function WarrantyCard({ wr, onChange, onDelete }) {
  const [open, setOpen] = useState(false);
  let chip = "no expiry";
  let chipColor = COLORS.textFaint;
  if (wr.expires) {
    const d = daysFromToday(wr.expires);
    if (d < 0) { chip = "expired"; chipColor = COLORS.red; }
    else if (d < 60) { chip = `${d}d left`; chipColor = COLORS.amber; }
    else { chip = fmtBuildDate(wr.expires); chipColor = COLORS.green; }
  }
  return (
    <div style={{ border: `1px solid ${COLORS.border}`, borderRadius: 12, marginBottom: 10, overflow: "hidden" }}>
      <button onClick={() => setOpen((o) => !o)} style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "11px 12px", background: "transparent", border: "none", cursor: "pointer", fontFamily: FONT, textAlign: "left" }}>
        <Icon d={open ? ICON.chevD : ICON.chevR} size={13} color={COLORS.textFaint} />
        <span style={{ flex: 1, minWidth: 0, fontSize: 13.5, fontWeight: 700, color: COLORS.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{wr.item || "Warranty"}</span>
        <span style={{ fontSize: 10.5, fontWeight: 800, color: chipColor, flexShrink: 0 }}>{chip}</span>
      </button>
      {open && (
        <div style={{ padding: "2px 14px 14px", display: "grid", gap: 10 }}>
          <input value={wr.item} onChange={(e) => onChange({ item: e.target.value })} placeholder="What's covered" style={{ ...txt(), fontWeight: 700 }} />
          <div style={{ display: "flex", gap: 8 }}>
            <input value={wr.provider} onChange={(e) => onChange({ provider: e.target.value })} placeholder="Provider" style={{ ...txt(), flex: 1 }} />
            <input type="date" value={wr.expires || ""} onChange={(e) => onChange({ expires: e.target.value || null })} aria-label="Expires" style={{ ...inputStyle(), width: 150 }} />
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <input value={wr.url} onChange={(e) => onChange({ url: e.target.value })} placeholder="Link to the warranty document" style={{ ...txt(), flex: 1 }} />
            {wr.url && (
              <a href={wr.url} target="_blank" rel="noopener noreferrer"
                style={{ display: "inline-flex", alignItems: "center", gap: 5, flexShrink: 0, fontSize: 12, fontWeight: 700, color: "#fff", background: ACCENT, padding: "8px 12px", borderRadius: 9, textDecoration: "none", fontFamily: FONT }}>
                Open <Icon d={EXTERNAL_ICON} size={12} color="#fff" />
              </a>
            )}
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button onClick={onDelete} style={{ ...btn("ghost") }}><Icon d={ICON.x} size={13} /> Delete</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AsBuiltSection({ state, addRow, updRow, delRow }) {
  const ab = state.as_built || [];
  const wrs = state.warranties || [];
  return (
    <>
      <Card title="As-built reference" sub={`${ab.length} details`}>
        <div style={{ fontSize: 12, color: COLORS.textMuted, padding: "4px 2px 12px", lineHeight: 1.5 }}>
          The details you&apos;ll want years from now — paint codes, filter sizes, shut-off
          locations. Fill them in as you go.
        </div>
        {ab.map((d) => (
          <div key={d.id} style={{ display: "flex", gap: 8, alignItems: "center", padding: "6px 4px", borderBottom: `1px solid ${COLORS.surfaceTint}` }}>
            <input value={d.label} onChange={(e) => updRow("as_built", d.id, { label: e.target.value })} placeholder="Detail" style={{ ...txt(), flex: 1, minWidth: 0, fontWeight: 600 }} />
            <input value={d.value} onChange={(e) => updRow("as_built", d.id, { value: e.target.value })} placeholder="e.g. SW 7008 Alabaster" style={{ ...txt(), flex: 1.3, minWidth: 0 }} />
            <DelBtn onClick={() => delRow("as_built", d.id)} />
          </div>
        ))}
        <AddBtn label="Add detail" onClick={() => addRow("as_built", { label: "New detail", value: "" })} />
      </Card>
      <Card title="Warranties" sub={`${wrs.length} tracked`}>
        <div style={{ fontSize: 12, color: COLORS.textMuted, padding: "4px 2px 12px", lineHeight: 1.5 }}>
          Every warranty on the home, with its expiration. Watch the builder&apos;s workmanship
          warranty especially — know the deadline before it lapses.
        </div>
        {wrs.map((wr) => (
          <WarrantyCard key={wr.id} wr={wr}
            onChange={(p) => updRow("warranties", wr.id, p)}
            onDelete={() => delRow("warranties", wr.id)} />
        ))}
        <AddBtn label="Add warranty" onClick={() => addRow("warranties", { item: "New warranty", provider: "", expires: null, url: "" })} />
      </Card>
    </>
  );
}
