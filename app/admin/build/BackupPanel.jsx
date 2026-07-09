"use client";

// Your data — a quiet door, not a shouting button.
//
// This used to be the only filled accent button in the whole navigation: the
// loudest thing on the page, for a chore you do twice a year. Worse, "Restore…"
// sat permanently one tap from replacing every room, vendor and reference in the
// house. Navigation answers "where do I go", and neither of those is a place.
//
// So the nav gets one muted row. Behind it, a drawer that says the true thing
// first — everything you type is already saved — and then offers the export,
// with restore kept quiet beneath it.
//
// Restore still dry-runs on the server before it writes, and still archives the
// current data first. See app/api/build/restore/route.js.

import { useRef, useState } from "react";

import { COLORS, FONT, SERIF, Icon, btn } from "./ui";
import DetailDrawer from "./DetailDrawer";

const DANGER = COLORS.red;
const SHIELD = "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z";

export default function BackupPanel() {
  const fileRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState("");

  function download() {
    // Same-origin GET; the route sets Content-Disposition.
    window.location.href = "/api/build/backup";
  }

  async function onPick(e) {
    setError("");
    setDone("");
    const file = e.target.files?.[0];
    if (!file) return;

    let bundle;
    try {
      bundle = JSON.parse(await file.text());
    } catch {
      setError("That file isn't valid JSON.");
      return;
    }

    setBusy(true);
    try {
      // Dry run: the server validates and tells us what it WOULD restore.
      const res = await fetch("/api/build/restore", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bundle }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError([data.error, ...(data.errors || [])].filter(Boolean).join(" "));
        return;
      }
      setPreview({ bundle, ...data });
    } catch (err) {
      setError(err?.message || "Could not read that backup.");
    } finally {
      setBusy(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  async function confirmRestore() {
    if (!preview) return;
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/build/restore", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bundle: preview.bundle, confirm: true }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Restore failed.");
        return;
      }
      setPreview(null);
      setDone("Restored. Reloading…");
      setTimeout(() => window.location.reload(), 900);
    } catch (err) {
      setError(err?.message || "Restore failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        style={{
          display: "flex", alignItems: "center", gap: 8, width: "100%",
          padding: "9px 10px", borderRadius: 8, cursor: "pointer", fontFamily: FONT,
          border: `1px solid ${COLORS.border}`, background: "transparent",
          color: COLORS.textFaint, fontSize: 12.5, fontWeight: 600,
        }}
      >
        <Icon d={SHIELD} size={13} />
        <span style={{ flex: 1, textAlign: "left" }}>Your data</span>
        <Icon d="M9 18l6-6-6-6" size={12} />
      </button>

      <input ref={fileRef} type="file" accept="application/json,.json" onChange={onPick} style={{ display: "none" }} />

      <DetailDrawer
        open={open}
        onClose={() => { setOpen(false); setError(""); setDone(""); }}
        kind="Your data"
        title="Everything is already saved"
      >
        <p style={{ fontSize: 13.5, color: COLORS.textMuted, lineHeight: 1.6, margin: 0 }}>
          Every word you type here saves the moment you stop typing, and it lives on a
          server that is backed up whether you think about it or not. You do not need to
          do anything.
        </p>
        <p style={{ fontSize: 13.5, color: COLORS.textMuted, lineHeight: 1.6, margin: "12px 0 0" }}>
          A copy on your own machine is still worth having — before a big change, or once a
          season. It is a single file holding every room, vendor, selection and task.
        </p>

        <button onClick={download} style={{ ...btn("primary"), marginTop: 20 }}>
          <Icon d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4 M7 10l5 5 5-5 M12 15V3" size={14} color="#fff" />
          Back up everything
        </button>

        <div style={{ marginTop: 28, paddingTop: 18, borderTop: `1px solid ${COLORS.border}` }}>
          <div style={{ fontSize: 12.5, fontWeight: 700, color: COLORS.text }}>Restore from a backup</div>
          <p style={{ fontSize: 12.5, color: COLORS.textFaint, lineHeight: 1.55, margin: "5px 0 12px" }}>
            Replaces everything you have now with the contents of a backup file. Your current
            data is archived first, so this can be undone. You will see exactly what it holds
            before anything is written.
          </p>
          <button onClick={() => fileRef.current?.click()} disabled={busy} style={btn("ghost")}>
            Choose a backup file…
          </button>
        </div>

        {error && <div style={{ marginTop: 14, fontSize: 12.5, color: DANGER, fontWeight: 600, lineHeight: 1.5 }}>{error}</div>}
        {done && <div style={{ marginTop: 14, fontSize: 12.5, color: COLORS.green, fontWeight: 700 }}>{done}</div>}
      </DetailDrawer>

      {preview && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Confirm restore"
          style={{
            position: "fixed", inset: 0, zIndex: 501, background: "rgba(28,27,26,0.48)",
            backdropFilter: "blur(3px)", display: "grid", placeItems: "center", padding: 16,
          }}
        >
          <div style={{ width: "100%", maxWidth: 440, background: COLORS.surface, borderRadius: 20, padding: 24, boxShadow: COLORS.shadowLg, fontFamily: FONT }}>
            <h3 style={{ fontFamily: SERIF, margin: 0, fontSize: 20, fontWeight: 600, letterSpacing: "-0.01em" }}>
              Replace everything with this backup?
            </h3>

            <p style={{ margin: "10px 0 0", fontSize: 13.5, color: COLORS.textMuted, lineHeight: 1.55 }}>
              This overwrites your current rooms, vendors, references and tasks with{" "}
              <strong style={{ color: COLORS.text }}>{preview.willRestore}</strong>.
            </p>
            <p style={{ margin: "10px 0 0", fontSize: 12.5, color: COLORS.textFaint, lineHeight: 1.55 }}>
              Your current data is archived first, so this is undoable.
            </p>

            {preview.differentWorkspace && (
              <p style={{ margin: "12px 0 0", fontSize: 12.5, color: DANGER, fontWeight: 600, lineHeight: 1.5 }}>
                Heads up: this backup came from a different workspace ({preview.fromWorkspace}).
              </p>
            )}

            {preview.warnings?.length > 0 && (
              <ul style={{ margin: "12px 0 0", paddingLeft: 18, fontSize: 12.5, color: COLORS.textMuted }}>
                {preview.warnings.map((w) => <li key={w}>{w}</li>)}
              </ul>
            )}

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 20 }}>
              <button onClick={() => setPreview(null)} disabled={busy} style={btn("ghost")}>Cancel</button>
              <button
                onClick={confirmRestore}
                disabled={busy}
                style={{ ...btn("primary"), background: DANGER, borderColor: DANGER }}
              >
                {busy ? "Restoring…" : "Replace my data"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
