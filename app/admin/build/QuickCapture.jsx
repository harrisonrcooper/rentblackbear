"use client";

// Fast capture. Dump an idea, a link, or a task in one second; organize later.
//
// The box guesses what you gave it and shows the guess, with a one-click way
// to override. Guessing beats asking — the whole point is that capture costs
// nothing.

import { useMemo, useState } from "react";

import { COLORS, FONT } from "../budget/lib/tokens";
import { classify } from "@/lib/build/capture";

const ACCENT = COLORS.accent;

export default function QuickCapture({ onCaptureTask, onCaptureReference }) {
  const [text, setText] = useState("");
  const [override, setOverride] = useState(null); // "task" | "reference" | null
  const [busy, setBusy] = useState(false);
  const [flash, setFlash] = useState("");

  const guess = useMemo(() => classify(text), [text]);
  const kind = override || guess?.kind || "task";

  async function submit(e) {
    e?.preventDefault();
    if (!guess || busy) return;

    setBusy(true);
    try {
      if (kind === "reference" && guess.url) {
        await onCaptureReference({ url: guess.url, title: guess.title, note: guess.note });
        setFlash("Saved to References");
      } else {
        // Overriding a link to a task keeps the URL in the notes.
        const title = guess.kind === "reference" ? guess.note || guess.title : guess.title;
        const notes = guess.kind === "reference" ? guess.url : "";
        await onCaptureTask({ title, notes });
        setFlash("Added to Tasks");
      }
      setText("");
      setOverride(null);
      setTimeout(() => setFlash(""), 2200);
    } finally {
      setBusy(false);
    }
  }

  const chip = (value, label) => {
    const on = kind === value;
    return (
      <button
        type="button"
        onClick={() => setOverride(value)}
        style={{
          border: `1px solid ${on ? ACCENT : COLORS.border}`,
          background: on ? COLORS.accentSoft : COLORS.surface,
          color: on ? ACCENT : COLORS.textMuted,
          borderRadius: 999, padding: "3px 11px", fontSize: 11.5, fontWeight: 700,
          cursor: "pointer", fontFamily: FONT,
        }}
      >
        {label}
      </button>
    );
  };

  return (
    <form onSubmit={submit} style={{ marginBottom: 20 }}>
      <div style={{
        display: "flex", alignItems: "center", gap: 10,
        border: `1px solid ${COLORS.border}`, borderRadius: 12,
        background: COLORS.surface, padding: "4px 4px 4px 14px",
      }}>
        <input
          value={text}
          onChange={(e) => { setText(e.target.value); setOverride(null); }}
          placeholder="Dump an idea, paste a link…"
          aria-label="Quick capture"
          style={{
            flex: 1, border: "none", outline: "none", background: "transparent",
            fontSize: 14.5, fontFamily: FONT, color: COLORS.text, padding: "10px 0",
          }}
        />
        <button
          type="submit"
          disabled={!guess || busy}
          style={{
            border: "none", borderRadius: 9, padding: "9px 16px", cursor: guess && !busy ? "pointer" : "not-allowed",
            background: guess && !busy ? ACCENT : COLORS.surfaceTint,
            color: guess && !busy ? "#fff" : COLORS.textFaint,
            fontFamily: FONT, fontSize: 13, fontWeight: 700,
          }}
        >
          {busy ? "Saving…" : "Add"}
        </button>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 8, minHeight: 26, marginTop: 8 }}>
        {guess && (
          <>
            <span style={{ fontSize: 11.5, color: COLORS.textFaint, fontWeight: 600 }}>Save as</span>
            {chip("task", "Task")}
            {chip("reference", "Link")}
            {kind === "reference" && guess.note && (
              <span style={{ fontSize: 11.5, color: COLORS.textFaint }}>note: “{guess.note}”</span>
            )}
          </>
        )}
        {!guess && flash && (
          <span style={{ fontSize: 12, color: ACCENT, fontWeight: 700 }}>{flash}</span>
        )}
      </div>
    </form>
  );
}
