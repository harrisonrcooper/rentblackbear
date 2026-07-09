"use client";

// Brief section.

import { COLORS, STYLES, btn, Icon, fmtUsd, ACCENT } from "../ui";

export default function BriefSection({ state }) {
  const needs = state.wishlist.filter((w) => w.priority === "need");
  const wants = state.wishlist.filter((w) => w.priority === "want");
  const dreams = state.wishlist.filter((w) => w.priority === "dream");
  const eyebrow = { fontSize: 11, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", color: ACCENT, margin: "20px 0 8px" };
  const li = { fontSize: 13.5, color: COLORS.text, padding: "3px 0", lineHeight: 1.5 };

  return (
    <div>
      <div className="build-chrome" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, marginBottom: 14, flexWrap: "wrap" }}>
        <div style={{ fontSize: 12.5, color: COLORS.textMuted }}>
          A clean summary of everything below — print or save as PDF to hand to your architect.
        </div>
        <button onClick={() => window.print()} style={{ ...btn("primary") }}>
          <Icon d="M6 9V2h12v7 M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2 M6 14h12v8H6z" size={14} />
          Print / Save as PDF
        </button>
      </div>

      <div className="build-print" style={{ ...STYLES.card, padding: "28px 30px", maxWidth: 720, margin: "0 auto" }}>
        <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase", color: ACCENT }}>Architect Brief</div>
        <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: "-0.02em", marginTop: 4, color: COLORS.text }}>{state.project_name || "Our New Home"}</div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px 24px", marginTop: 14, fontSize: 13 }}>
          {[
            ["Target budget", state.budget_cents ? fmtUsd(state.budget_cents) : "—"],
            ["Square footage", state.sqft ? `${state.sqft.toLocaleString()} sq ft` : "—"],
            ["Stories", String(state.stories || 1)],
          ].map(([l, v]) => (
            <span key={l}><strong style={{ color: COLORS.textMuted, fontWeight: 700 }}>{l}:</strong> <span style={{ color: COLORS.text, fontWeight: 700 }}>{v}</span></span>
          ))}
        </div>
        {(state.style || state.lot) && (
          <div style={{ marginTop: 8, fontSize: 13, color: COLORS.text, lineHeight: 1.6 }}>
            {state.style && <div><strong style={{ color: COLORS.textMuted, fontWeight: 700 }}>Style:</strong> {state.style}</div>}
            {state.lot && <div><strong style={{ color: COLORS.textMuted, fontWeight: 700 }}>Lot:</strong> {state.lot}</div>}
          </div>
        )}

        {state.notes && (
          <>
            <div style={eyebrow}>Vision</div>
            <div style={{ fontSize: 13.5, color: COLORS.text, lineHeight: 1.6, whiteSpace: "pre-wrap" }}>{state.notes}</div>
          </>
        )}

        {needs.length > 0 && (<>
          <div style={eyebrow}>Needs — non-negotiable</div>
          {needs.map((w) => <div key={w.id} style={li}>• {w.label}</div>)}
        </>)}
        {wants.length > 0 && (<>
          <div style={eyebrow}>Wants</div>
          {wants.map((w) => <div key={w.id} style={li}>• {w.label}</div>)}
        </>)}
        {dreams.length > 0 && (<>
          <div style={eyebrow}>Dreams — if budget allows</div>
          {dreams.map((w) => <div key={w.id} style={li}>• {w.label}</div>)}
        </>)}

        {state.rooms.length > 0 && (<>
          <div style={eyebrow}>Room program</div>
          {state.rooms.map((r) => (
            <div key={r.id} style={{ padding: "5px 0", borderBottom: `1px solid ${COLORS.surfaceTint}` }}>
              <div style={{ fontSize: 13.5, fontWeight: 700, color: COLORS.text }}>
                {r.name}
                {(r.level || r.size) && (
                  <span style={{ fontWeight: 600, color: COLORS.textMuted }}>
                    {"  —  "}{[r.level, r.size].filter(Boolean).join(" · ")}
                  </span>
                )}
              </div>
              {r.must_haves && <div style={{ fontSize: 12.5, color: COLORS.textMuted, marginTop: 1 }}>{r.must_haves}</div>}
            </div>
          ))}
        </>)}

        <div style={{ marginTop: 22, paddingTop: 12, borderTop: `1px solid ${COLORS.border}`, fontSize: 11, color: COLORS.textFaint }}>
          Prepared in the RentCaddie build planner.
        </div>
      </div>
    </div>
  );
}
