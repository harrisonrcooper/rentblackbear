"use client";

// Cmd+K. Two clicks to anything, without the clicks.
//
// The index comes from the entity registry, so every module is searchable the
// moment it is registered — there is no per-module wiring here.

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { COLORS, FONT } from "../budget/lib/tokens";
import { buildSearchIndex, search } from "@/lib/build/search";

const ACCENT = COLORS.accent;
const MAX_RESULTS = 12;

export default function CommandPalette({ open, onClose, onOpen, state, tasks, onJump }) {
  const [query, setQuery] = useState("");
  const [cursor, setCursor] = useState(0);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  const index = useMemo(() => buildSearchIndex(state, { task: tasks }), [state, tasks]);
  const results = useMemo(() => search(index, query, MAX_RESULTS), [index, query]);

  // Global hotkey. Bound once, regardless of whether the palette is open.
  useEffect(() => {
    function onKey(e) {
      const mod = e.metaKey || e.ctrlKey;
      if (mod && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (open) onClose();
        else onOpen();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onOpen, onClose]);

  useEffect(() => {
    if (!open) return;
    setQuery("");
    setCursor(0);
    // Focus after paint so the input exists.
    const t = setTimeout(() => inputRef.current?.focus(), 0);
    return () => clearTimeout(t);
  }, [open]);

  useEffect(() => { setCursor(0); }, [query]);

  const choose = useCallback((doc) => {
    if (!doc) return;
    onJump(doc.section, doc.id);
    onClose();
  }, [onJump, onClose]);

  function onKeyDown(e) {
    if (e.key === "Escape") { e.preventDefault(); onClose(); return; }
    if (e.key === "ArrowDown") { e.preventDefault(); setCursor((c) => Math.min(c + 1, results.length - 1)); return; }
    if (e.key === "ArrowUp") { e.preventDefault(); setCursor((c) => Math.max(c - 1, 0)); return; }
    if (e.key === "Enter") { e.preventDefault(); choose(results[cursor]); }
  }

  // Keep the highlighted row in view when arrowing past the fold.
  useEffect(() => {
    const el = listRef.current?.querySelector(`[data-idx="${cursor}"]`);
    el?.scrollIntoView({ block: "nearest" });
  }, [cursor]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Search everything"
      onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}
      style={{
        position: "fixed", inset: 0, zIndex: 500, fontFamily: FONT,
        background: "rgba(15,20,30,0.44)", backdropFilter: "blur(3px)",
        display: "flex", alignItems: "flex-start", justifyContent: "center",
        padding: "12vh 16px 16px",
      }}
    >
      <div style={{
        width: "100%", maxWidth: 620, background: "#fff", borderRadius: 16,
        boxShadow: "0 24px 70px rgba(15,20,30,0.34)", overflow: "hidden",
        display: "flex", flexDirection: "column", maxHeight: "70vh",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 16px", borderBottom: `1px solid ${COLORS.border}` }}>
          <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke={COLORS.textFaint} strokeWidth="2" strokeLinecap="round">
            <circle cx="11" cy="11" r="7" /><line x1="20" y1="20" x2="16.65" y2="16.65" />
          </svg>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Search rooms, vendors, tasks, links…"
            aria-label="Search"
            style={{
              flex: 1, border: "none", outline: "none", fontSize: 16,
              fontFamily: FONT, color: COLORS.text, background: "transparent",
            }}
          />
          <kbd style={{
            fontSize: 10.5, fontWeight: 700, color: COLORS.textFaint, border: `1px solid ${COLORS.border}`,
            borderRadius: 5, padding: "2px 6px", fontFamily: FONT,
          }}>ESC</kbd>
        </div>

        <div ref={listRef} style={{ overflowY: "auto", padding: query ? "6px" : 0 }}>
          {!query && (
            <div style={{ padding: "26px 18px", color: COLORS.textFaint, fontSize: 13.5, textAlign: "center" }}>
              Start typing to search every room, vendor, reference, selection and task.
            </div>
          )}

          {query && results.length === 0 && (
            <div style={{ padding: "26px 18px", color: COLORS.textFaint, fontSize: 13.5, textAlign: "center" }}>
              Nothing matches “{query}”.
            </div>
          )}

          {results.map((doc, i) => {
            const on = i === cursor;
            return (
              <button
                key={`${doc.type}:${doc.id}`}
                data-idx={i}
                onMouseEnter={() => setCursor(i)}
                onClick={() => choose(doc)}
                style={{
                  width: "100%", display: "flex", alignItems: "center", gap: 12,
                  padding: "10px 12px", border: "none", borderRadius: 10, cursor: "pointer",
                  background: on ? COLORS.accentSoft : "transparent",
                  textAlign: "left", fontFamily: FONT,
                }}
              >
                <span style={{
                  fontSize: 10, fontWeight: 800, letterSpacing: "0.06em", textTransform: "uppercase",
                  color: on ? ACCENT : COLORS.textFaint, minWidth: 84,
                }}>
                  {doc.kindLabel}
                </span>
                <span style={{ flex: 1, minWidth: 0 }}>
                  <span style={{ display: "block", fontSize: 14, fontWeight: 600, color: COLORS.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {doc.title}
                  </span>
                  {doc.subtitle && (
                    <span style={{ display: "block", fontSize: 12, color: COLORS.textFaint, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {doc.subtitle}
                    </span>
                  )}
                </span>
                {on && <span style={{ fontSize: 11, fontWeight: 700, color: ACCENT }}>↵</span>}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
