"use client";

// Architect Brief — the one page he hands to a third party.
//
// This section OWNS nothing. It is a mirror: every line is assembled from what
// he already typed into Vision, Wants, and Rooms, so it can never say something
// he didn't enter. That is also why it needs no form controls — the only verb
// here is "print". Because an architect reads it, it is composed like a
// document (serif title, sections, no dangling blanks), never a form dump.

import { COLORS, STYLES, SERIF, btn, Icon, ICON, fmtUsd, fmtBuildDate, ACCENT, todayIso
} from "../ui";
import { checklistFor } from "@/lib/build/rooms";

// A fact only earns a line if he actually entered it. An architect brief full
// of "—" reads as unfinished, so blanks are omitted, not shown.
function present(v) {
  return v !== null && v !== undefined && v !== "" && v !== 0;
}

// Local calendar date as YYYY-MM-DD. Built from local components (not
// toISOString, which is UTC) so a brief prepared at 9pm Pacific doesn't
// print tomorrow's date. Matches the todayIso pattern in Photos/OpenQuestions.

export default function BriefSection({ state }) {
  const wishlist = state.wishlist || [];
  const rooms = state.rooms || [];
  const needs = wishlist.filter((w) => w.priority === "need");
  const wants = wishlist.filter((w) => w.priority === "want");
  const dreams = wishlist.filter((w) => w.priority === "dream");

  const hasBudget = present(state.budget_cents);
  const hasSqft = present(state.sqft);
  // Budget ÷ square footage is the number an architect sizes a design against —
  // compute it so he never reaches for a calculator, and only when both inputs
  // it's built from are on the page (so it's always traceable).
  const perSqftCents = hasBudget && hasSqft ? Math.round(state.budget_cents / state.sqft) : null;

  // Is there anything to hand over at all? The brief is derived, so "empty" means
  // he hasn't filled in the tabs it draws from yet.
  const isEmpty =
    !present(state.project_name) && !hasBudget && !hasSqft &&
    !present(state.style) && !present(state.lot) && !present(state.notes) &&
    wishlist.length === 0 && rooms.length === 0;

  // What's still blank, in plain words — shown on screen only (never printed) so
  // he knows the brief isn't finished before he sends it. Computed, not hunted.
  const blanks = [
    !present(state.notes) && "your vision",
    !hasBudget && "a target budget",
    !hasSqft && "square footage",
    wishlist.length === 0 && "a wish list",
    rooms.length === 0 && "your rooms",
  ].filter(Boolean);

  const eyebrow = { fontFamily: SERIF, fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: ACCENT, margin: "22px 0 8px" };
  const li = { fontSize: 13.5, color: COLORS.text, padding: "3px 0", lineHeight: 1.5 };
  const factLabel = { color: COLORS.textMuted, fontWeight: 700 };

  // ── Empty — the first, and until he starts the only, thing he sees here ──────
  // No form controls exist on this page and it can't navigate, so the honest
  // "one way to start" is words that point at the tabs that feed it.
  if (isEmpty) {
    return (
      <div style={{ ...STYLES.card, padding: "44px 26px 48px", maxWidth: 520, margin: "8px auto 0", textAlign: "center" }}>
        <div style={{ width: 50, height: 50, margin: "0 auto 16px", borderRadius: 15, background: COLORS.accentSoft, display: "grid", placeItems: "center" }}>
          <Icon d={ICON.fileText} size={25} color={ACCENT} />
        </div>
        <h2 style={{ fontFamily: SERIF, fontSize: 23, fontWeight: 600, letterSpacing: "-0.01em", margin: "0 0 9px" }}>
          Your brief writes itself
        </h2>
        <p style={{ fontSize: 13.5, color: COLORS.textMuted, lineHeight: 1.6, margin: "0 auto", maxWidth: 400 }}>
          As you fill in your vision, budget, wish list, and rooms in the tabs on
          the left, everything gathers here into one clean page. When it's ready,
          you'll be able to print it or save it as a PDF to hand to your architect.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="build-chrome" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, marginBottom: 14, flexWrap: "wrap" }}>
        <div style={{ maxWidth: 420 }}>
          <div style={{ fontSize: 12.5, color: COLORS.textMuted, lineHeight: 1.5 }}>
            Everything you've entered, gathered into one page for your architect. Print it or save it as a PDF.
          </div>
          {blanks.length > 0 && (
            <div style={{ display: "flex", alignItems: "flex-start", gap: 7, marginTop: 9, fontSize: 12, color: COLORS.amber, lineHeight: 1.5 }}>
              <span style={{ marginTop: 2, flexShrink: 0 }}><Icon d={ICON.flag} size={13} color={COLORS.amber} /></span>
              <span>Still blank: {blanks.join(", ")}. Add {blanks.length === 1 ? "it" : "them"} from the tabs so your architect has the full picture.</span>
            </div>
          )}
        </div>
        <button onClick={() => window.print()} style={{ ...btn("primary") }}>
          <Icon d={ICON.download} size={14} color="#fff" />
          Print / Save as PDF
        </button>
      </div>

      <div className="build-print" style={{ ...STYLES.card, padding: "34px 38px 30px", maxWidth: 720, margin: "0 auto" }}>
        <div style={{ fontFamily: SERIF, fontSize: 12, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: ACCENT }}>Architect Brief</div>
        <div style={{ fontFamily: SERIF, fontSize: 30, fontWeight: 600, letterSpacing: "-0.02em", marginTop: 4, color: COLORS.text, lineHeight: 1.15 }}>
          {state.project_name || "Our New Home"}
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px 24px", marginTop: 16, fontSize: 13 }}>
          {[
            hasBudget && ["Target budget", fmtUsd(state.budget_cents)],
            hasSqft && ["Square footage", `${state.sqft.toLocaleString()} sq ft`],
            present(state.stories) && ["Stories", String(state.stories)],
            perSqftCents && ["Budget per square foot", fmtUsd(perSqftCents)],
          ].filter(Boolean).map(([l, v]) => (
            <span key={l}><span style={factLabel}>{l}:</span> <span style={{ color: COLORS.text, fontWeight: 700 }}>{v}</span></span>
          ))}
        </div>

        {(present(state.style) || present(state.lot)) && (
          <div style={{ marginTop: 10, fontSize: 13, color: COLORS.text, lineHeight: 1.7 }}>
            {present(state.style) && <div><span style={factLabel}>Style:</span> {state.style}</div>}
            {present(state.lot) && <div><span style={factLabel}>Lot and location:</span> {state.lot}</div>}
          </div>
        )}

        {present(state.notes) && (
          <>
            <div style={eyebrow}>Vision</div>
            <div style={{ fontSize: 13.5, color: COLORS.text, lineHeight: 1.65, whiteSpace: "pre-wrap" }}>{state.notes}</div>
          </>
        )}

        {needs.length > 0 && (<>
          <div style={eyebrow}>Needs — non-negotiable</div>
          {needs.map((w) => <div key={w.id} style={li}>• {w.label}</div>)}
        </>)}
        {wants.length > 0 && (<>
          <div style={eyebrow}>Wants — would love</div>
          {wants.map((w) => <div key={w.id} style={li}>• {w.label}</div>)}
        </>)}
        {dreams.length > 0 && (<>
          <div style={eyebrow}>Dreams — if the budget allows</div>
          {dreams.map((w) => <div key={w.id} style={li}>• {w.label}</div>)}
        </>)}

        {rooms.length > 0 && (<>
          <div style={eyebrow}>Room program</div>
          {rooms.map((r) => (
            <div key={r.id} style={{ padding: "6px 0", borderBottom: `1px solid ${COLORS.surfaceTint}` }}>
              <div style={{ fontSize: 13.5, fontWeight: 700, color: COLORS.text }}>
                {r.name || "Untitled room"}
                {(r.level || r.size) && (
                  <span style={{ fontWeight: 600, color: COLORS.textMuted }}>
                    {"  —  "}{[r.level, r.size].filter(Boolean).join(" · ")}
                  </span>
                )}
              </div>
              {(() => {
                // The room's requirements come from its live checklist, not the
                // frozen `must_haves` seed text. Rooms stopped editing that field
                // when the checklist became the thing the user manages; printing
                // it here would hand the architect requirements the user has
                // since changed.
                const items = checklistFor(r);
                if (items.length === 0) return null;
                return (
                  <div style={{ fontSize: 12.5, color: COLORS.textMuted, marginTop: 2, lineHeight: 1.5 }}>
                    {items.map((i) => i.text).join(" · ")}
                  </div>
                );
              })()}
            </div>
          ))}
        </>)}

        <div style={{ marginTop: 26, paddingTop: 13, borderTop: `1px solid ${COLORS.border}`, fontSize: 11, color: COLORS.textFaint }}>
          Prepared {fmtBuildDate(todayIso())} in the RentCaddie build planner.
        </div>
      </div>
    </div>
  );
}
