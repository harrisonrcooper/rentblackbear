"use client";

// Progress photos — a running visual diary of the build, newest first.
//
// Mobile capture is the whole point: the single "Add progress photos" action
// opens the phone's camera-or-library sheet directly, so a photo taken standing
// in a half-framed room is two taps from saved. Each photo is auto-stamped with
// today's date (shown mm/dd/yyyy, never asked for) and can be filed to a build
// phase after the fact. Nothing here makes him type a date or count anything.

import { useRef, useState } from "react";

import { COLORS, FONT, SERIF, Icon, ICON, ACCENT, ACCENT_SOFT, txt, DelBtn, SelectPill, optionsFrom, fmtBuildDate , DateField} from "../ui";
import { CAMERA_ICON } from "./_common";

// The build pipeline, in the order it actually happens on site. Empty first so a
// photo can stay unfiled until he knows where it belongs.
const PHOTO_PHASES = ["", "Site & foundation", "Framing", "Dry-in", "Rough-ins", "Insulation & drywall", "Interior finishes", "Exterior & landscape", "Final"];

// Today, as the YYYY-MM-DD calendar date the row stores — built from the phone's
// LOCAL clock, not UTC. toISOString() would roll to tomorrow for an evening photo
// west of UTC (6pm PDT is already the next day in UTC); the native date picker and
// fmtBuildDate everywhere else treat dates as tz-naive calendar strings, so we
// match them. Rendered back out as mm/dd/yyyy by fmtBuildDate; the raw form never
// reaches the screen.
const todayIso = () => {
  const d = new Date();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${mm}-${dd}`;
};

/**
 * Send one image to the build storage route and hand back its public URL.
 *
 * A route handler (app/admin/build/upload/route.js), not a server action, so a
 * multi-megabyte phone photo isn't capped by the action body limit. The row it
 * feeds is still written through addRow — this only turns a File into the `url`
 * that row needs.
 */
async function uploadImage(file) {
  const form = new FormData();
  form.append("file", file);
  const res = await fetch("/admin/build/upload", { method: "POST", body: form });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Upload failed.");
  return data.url;
}


/**
 * The one action on this screen. No `capture` attribute on purpose: on iOS
 * Safari a plain image input offers Take Photo *and* Photo Library in one
 * sheet, so a single button covers both without a second primary action.
 */
function CaptureButton({ busy, onFiles, hero }) {
  const ref = useRef(null);
  return (
    <>
      <input
        ref={ref}
        type="file"
        accept="image/*"
        multiple
        onChange={(e) => { const files = [...(e.target.files || [])]; e.target.value = ""; onFiles(files); }}
        style={{ display: "none" }}
      />
      <button
        onClick={() => ref.current && ref.current.click()}
        disabled={busy}
        style={{
          width: "100%", maxWidth: hero ? 320 : undefined, padding: hero ? "13px 18px" : 15,
          borderRadius: 12, border: `1.5px dashed ${ACCENT}`, background: ACCENT_SOFT,
          color: ACCENT, fontWeight: 800, fontSize: 13, fontFamily: FONT,
          cursor: busy ? "default" : "pointer", opacity: busy ? 0.7 : 1,
          display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8,
        }}
      >
        <Icon d={CAMERA_ICON} size={18} color={ACCENT} />
        {busy ? "Adding photos…" : "Add progress photos"}
      </button>
    </>
  );
}

function PhotoCard({ photo, updRow, delRow }) {
  return (
    <div style={{ border: `1px solid ${COLORS.border}`, borderRadius: 14, overflow: "hidden", background: COLORS.surface, display: "flex", flexDirection: "column" }}>
      {/* Tap the photo to see it full-size — the closest thing to a lightbox
          without one, and it means the thumbnail can crop safely. */}
      <a href={photo.url} target="_blank" rel="noreferrer" style={{ display: "block", cursor: "zoom-in" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={photo.url}
          alt={photo.caption || "Build progress"}
          style={{ width: "100%", maxHeight: 320, objectFit: "cover", display: "block", background: COLORS.surfaceTint }}
        />
      </a>
      <div style={{ padding: 12, display: "grid", gap: 9 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <DateField value={photo.date} onChange={(date) => updRow("photos", photo.id, { date })} ariaLabel="Photo date" width={150} />
          <SelectPill
            value={photo.phase}
            options={optionsFrom(PHOTO_PHASES, { placeholder: "Add a phase" })}
            onChange={(phase) => updRow("photos", photo.id, { phase })}
            ariaLabel="Build phase"
            minWidth={130}
          />
          <span style={{ marginLeft: "auto" }}>
            <DelBtn onClick={() => delRow("photos", photo.id)} />
          </span>
        </div>
        <input
          value={photo.caption || ""}
          onChange={(e) => updRow("photos", photo.id, { caption: e.target.value })}
          placeholder="Add a caption — what's happening here…"
          style={{ ...txt(), fontSize: 13 }}
        />
      </div>
    </div>
  );
}

export default function PhotosSection({ state, addRow, updRow, delRow }) {
  const photos = state.photos || [];
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const onFiles = async (files) => {
    if (!files.length) return;
    setErr("");
    setBusy(true);
    const stamp = todayIso();
    let failed = 0;
    for (const f of files) {
      try {
        const url = await uploadImage(f);
        addRow("photos", { url, caption: "", date: stamp, phase: "" });
      } catch (ex) {
        failed += 1;
        setErr(ex instanceof Error ? ex.message : "Upload failed.");
      }
    }
    if (!failed) setErr("");
    setBusy(false);
  };

  // Newest first: later date wins, and within one date the most-recently-added
  // photo (later in the array) leads. Undated photos sink to the bottom.
  const sorted = photos
    .map((photo, i) => ({ photo, i }))
    .sort((a, b) => {
      const da = a.photo.date || "";
      const db = b.photo.date || "";
      if (da !== db) return da < db ? 1 : -1;
      return b.i - a.i;
    })
    .map((x) => x.photo);

  const head = (
    <div style={{ display: "flex", alignItems: "baseline", gap: 10, margin: "30px 0 11px" }}>
      <h3 style={{ fontSize: 14, fontWeight: 700, letterSpacing: "-0.01em", margin: 0 }}>Progress photos</h3>
      <span style={{ fontSize: 12, color: COLORS.textFaint }}>
        {photos.length === 0
          ? "A running visual diary of the build"
          : `${photos.length} ${photos.length === 1 ? "photo" : "photos"} · newest first`}
      </span>
    </div>
  );

  // ── Empty state — with zero photos this IS the screen, not a fallback ──────
  if (photos.length === 0) {
    return (
      <>
        {head}
        <div style={{ border: `1px solid ${COLORS.border}`, borderRadius: 16, background: COLORS.surface, padding: "40px 20px 44px", textAlign: "center", maxWidth: 480, margin: "8px auto 0" }}>
          <div style={{ width: 48, height: 48, margin: "0 auto 16px", borderRadius: 14, background: ACCENT_SOFT, display: "grid", placeItems: "center" }}>
            <Icon d={CAMERA_ICON} size={24} color={ACCENT} />
          </div>
          <h3 style={{ fontFamily: SERIF, fontSize: 21, fontWeight: 600, margin: "0 0 7px" }}>Photograph the build</h3>
          <p style={{ fontSize: 13.5, color: COLORS.textMuted, lineHeight: 1.55, margin: "0 auto 20px", maxWidth: 380 }}>
            Snap a photo each site visit — the foundation pour, the day the framing goes up, the first coat of paint. They stack up newest-first into a diary you can scroll back through anytime.
          </p>
          <CaptureButton busy={busy} onFiles={onFiles} hero />
          {err && <div style={{ marginTop: 12, fontSize: 12, color: COLORS.red, fontWeight: 600 }}>{err}</div>}
        </div>
      </>
    );
  }

  return (
    <>
      {head}
      <CaptureButton busy={busy} onFiles={onFiles} />
      {err && <div style={{ marginTop: 8, fontSize: 12, color: COLORS.red, fontWeight: 600 }}>{err}</div>}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 12, marginTop: 14 }}>
        {sorted.map((photo) => (
          <PhotoCard key={photo.id} photo={photo} updRow={updRow} delRow={delRow} />
        ))}
      </div>
    </>
  );
}
