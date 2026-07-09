"use client";

// Photos section.

import { useState, useRef } from "react";

import { COLORS, FONT, inputStyle, Icon, ACCENT, ACCENT_SOFT, Card, txt, DelBtn, SelectPill, optionsFrom } from "../ui";
import { CAMERA_ICON } from "./_common";

const PHOTO_PHASES = ["", "Site & foundation", "Framing", "Dry-in", "Rough-ins", "Insulation & drywall", "Interior finishes", "Exterior & landscape", "Final"];

export default function PhotosSection({ state, addRow, updRow, delRow }) {
  const photos = state.photos || [];
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const fileRef = useRef(null);

  const onFiles = async (e) => {
    const files = [...(e.target.files || [])];
    e.target.value = "";
    if (!files.length) return;
    setErr("");
    setBusy(true);
    const today = new Date().toISOString().slice(0, 10);
    for (const f of files) {
      try {
        const url = await uploadImage(f);
        addRow("photos", { url, caption: "", date: today, phase: "" });
      } catch (ex) {
        setErr(ex instanceof Error ? ex.message : "Upload failed.");
      }
    }
    setBusy(false);
  };

  const sorted = photos.slice().sort((a, b) => {
    if (!a.date) return 1;
    if (!b.date) return -1;
    return a.date < b.date ? 1 : -1;
  });

  return (
    <Card title="Progress photos" sub={`${photos.length} photo${photos.length === 1 ? "" : "s"}`}>
      <div style={{ fontSize: 12, color: COLORS.textMuted, padding: "4px 2px 12px", lineHeight: 1.5 }}>
        A running visual diary of the build — snap a photo each site visit. Newest shows first.
      </div>
      <input ref={fileRef} type="file" accept="image/*" multiple onChange={onFiles} style={{ display: "none" }} />
      <button
        onClick={() => fileRef.current && fileRef.current.click()}
        disabled={busy}
        style={{
          width: "100%", padding: 16, borderRadius: 12, border: `1.5px dashed ${ACCENT}`,
          background: ACCENT_SOFT, color: ACCENT, fontWeight: 800, fontSize: 13, fontFamily: FONT,
          cursor: busy ? "default" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
        }}
      >
        <Icon d={CAMERA_ICON} size={18} color={ACCENT} />
        {busy ? "Uploading…" : "Add progress photos"}
      </button>
      {err && <div style={{ marginTop: 8, fontSize: 12, color: COLORS.red, fontWeight: 600 }}>{err}</div>}
      <div style={{ display: "grid", gap: 14, marginTop: 14 }}>
        {sorted.map((p) => (
          <div key={p.id} style={{ border: `1px solid ${COLORS.border}`, borderRadius: 14, overflow: "hidden" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={p.url} alt={p.caption || "Build progress"} style={{ width: "100%", maxHeight: 320, objectFit: "cover", display: "block", background: COLORS.surfaceTint }} />
            <div style={{ padding: 12, display: "grid", gap: 8 }}>
              <div style={{ display: "flex", gap: 8 }}>
                <input type="date" value={p.date || ""} onChange={(e) => updRow("photos", p.id, { date: e.target.value || null })} aria-label="Photo date" style={{ ...inputStyle(), flex: 1, minWidth: 0 }} />
                <SelectPill value={p.phase} options={optionsFrom(PHOTO_PHASES, { placeholder: "Phase…" })} onChange={(phase) => updRow("photos", p.id, { phase })} ariaLabel="Phase" minWidth={150} />
                <DelBtn onClick={() => delRow("photos", p.id)} />
              </div>
              <input value={p.caption} onChange={(e) => updRow("photos", p.id, { caption: e.target.value })} placeholder="Caption — what's happening here…" style={txt()} />
            </div>
          </div>
        ))}
        {!photos.length && (
          <div style={{ textAlign: "center", padding: "10px 0 4px", fontSize: 12, color: COLORS.textFaint }}>
            No photos yet — the diary starts with your first site visit.
          </div>
        )}
      </div>
    </Card>
  );
}
