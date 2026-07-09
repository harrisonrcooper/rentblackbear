"use client";

// One-click backup, and a restore that makes you look before you leap.
//
// Restore replaces every room, vendor and reference the household has, so it
// runs a server-side dry run first and shows exactly what would come back.
// Only then does the confirm button arm. No native confirm() — the dialog is
// the app's own, so it can show the summary and the warnings.

import { useRef, useState } from "react";

import { COLORS, FONT } from "../budget/lib/tokens";

const ACCENT = COLORS.accent;
const DANGER = COLORS.red;

function Btn({ onClick, tone = "ghost", disabled, children }) {
  const bg = tone === "danger" ? DANGER : tone === "solid" ? ACCENT : COLORS.surface;
  const fg = tone === "ghost" ? COLORS.textMuted : "#fff";
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        border: `1px solid ${tone === "ghost" ? COLORS.border : bg}`,
        background: disabled ? COLORS.surfaceTint : bg,
        color: disabled ? COLORS.textFaint : fg,
        borderRadius: 9, padding: "8px 14px", fontSize: 12.5, fontWeight: 700,
        cursor: disabled ? "not-allowed" : "pointer", fontFamily: FONT,
      }}
    >
      {children}
    </button>
  );
}

export default function BackupPanel() {
  const fileRef = useRef(null);
  const [preview, setPreview] = useState(null); // { bundle, willRestore, warnings, differentWorkspace }
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
    <div style={{ padding: "14px 16px", borderTop: `1px solid ${COLORS.surfaceTint}`, fontFamily: FONT }}>
      <div style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", color: COLORS.textFaint, marginBottom: 10 }}>
        Your data
      </div>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <Btn onClick={download} tone="solid">Back up everything</Btn>
        <Btn onClick={() => fileRef.current?.click()} disabled={busy}>Restore…</Btn>
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="application/json,.json"
        onChange={onPick}
        style={{ display: "none" }}
      />

      {error && (
        <div style={{ marginTop: 10, fontSize: 12, color: DANGER, fontWeight: 600, lineHeight: 1.45 }}>{error}</div>
      )}
      {done && (
        <div style={{ marginTop: 10, fontSize: 12, color: ACCENT, fontWeight: 700 }}>{done}</div>
      )}

      {preview && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Confirm restore"
          style={{
            position: "fixed", inset: 0, zIndex: 501, background: "rgba(15,20,30,0.48)",
            backdropFilter: "blur(3px)", display: "grid", placeItems: "center", padding: 16,
          }}
        >
          <div style={{ width: "100%", maxWidth: 440, background: "#fff", borderRadius: 20, padding: 24, boxShadow: "0 24px 70px rgba(15,20,30,0.34)" }}>
            <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800, letterSpacing: "-0.01em" }}>
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
              <Btn onClick={() => setPreview(null)} disabled={busy}>Cancel</Btn>
              <Btn onClick={confirmRestore} tone="danger" disabled={busy}>
                {busy ? "Restoring…" : "Replace my data"}
              </Btn>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
