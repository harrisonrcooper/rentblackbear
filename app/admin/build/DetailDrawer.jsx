"use client";

// The one detail surface. Click any item — a room today, a vendor or selection
// tomorrow — and this slides in with the same tabs in the same places.
//
// It is deliberately generic: it knows about a title, a kind, and a set of
// tabs. What goes inside each tab is the caller's business. That is what makes
// "consistent building blocks" real rather than aspirational.
//
// Full-screen on mobile, panel on desktop.

import { useEffect } from "react";

import { COLORS, FONT } from "../budget/lib/tokens";
import { useIsMobile } from "../budget/lib/responsive";

const SERIF = "var(--font-source-serif), 'Source Serif 4', Georgia, serif";

export default function DetailDrawer({ open, onClose, kind, title, tabs, activeTab, onTab, children, footer }) {
  const isMobile = useIsMobile();

  // Escape closes; body scroll locks while it's up.
  useEffect(() => {
    if (!open) return undefined;
    function onKey(e) { if (e.key === "Escape") onClose(); }
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}
      style={{
        position: "fixed", inset: 0, zIndex: 480, fontFamily: FONT,
        background: "rgba(28,27,26,0.30)",
        display: "flex", justifyContent: "flex-end",
      }}
    >
      <aside
        onMouseDown={(e) => e.stopPropagation()}
        style={{
          background: COLORS.surface,
          width: isMobile ? "100%" : 470,
          height: "100%",
          borderLeft: isMobile ? "none" : `1px solid ${COLORS.border}`,
          boxShadow: COLORS.shadowLg,
          display: "flex", flexDirection: "column",
        }}
      >
        <div style={{ position: "relative", padding: "18px 20px 0" }}>
          <button
            onClick={onClose}
            aria-label="Close"
            style={{
              position: "absolute", top: 14, right: 14, border: "none", background: "transparent",
              cursor: "pointer", color: COLORS.textFaint, padding: 4, lineHeight: 0,
            }}
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>

          {kind && (
            <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: "0.09em", textTransform: "uppercase", color: COLORS.textFaint }}>
              {kind}
            </div>
          )}
          <h3 style={{ fontFamily: SERIF, fontSize: 23, fontWeight: 600, letterSpacing: "-0.015em", margin: "4px 40px 0 0" }}>
            {title}
          </h3>
        </div>

        {tabs?.length > 1 && (
          <div style={{ display: "flex", gap: 2, padding: "16px 20px 0", borderBottom: `1px solid ${COLORS.border}` }}>
            {tabs.map((t) => {
              const on = t.id === activeTab;
              return (
                <button
                  key={t.id}
                  onClick={() => onTab(t.id)}
                  style={{
                    padding: "8px 10px", fontSize: 12.5, fontWeight: 600, cursor: "pointer",
                    background: "transparent", border: "none",
                    color: on ? COLORS.accent : COLORS.textFaint,
                    borderBottom: `2px solid ${on ? COLORS.accent : "transparent"}`,
                    marginBottom: -1, fontFamily: FONT,
                  }}
                >
                  {t.label}
                  {typeof t.count === "number" && t.count > 0 && (
                    <span style={{ marginLeft: 5, fontSize: 11, color: on ? COLORS.accent : COLORS.textFaint }}>{t.count}</span>
                  )}
                </button>
              );
            })}
          </div>
        )}

        <div style={{ flex: 1, overflowY: "auto", padding: "18px 20px" }}>{children}</div>

        {footer && (
          <div style={{ borderTop: `1px solid ${COLORS.border}`, padding: "12px 20px" }}>{footer}</div>
        )}
      </aside>
    </div>
  );
}
