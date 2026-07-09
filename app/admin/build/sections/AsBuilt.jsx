"use client";

// As-built reference & warranties.
//
// The load-bearing job here is the warranty warning: a workmanship warranty that
// lapses unnoticed is money left on the table. So anything expired or expiring
// within SOON_DAYS is surfaced in a banner at the top, and the list is ordered
// most-urgent-first. Everything else is low-friction capture of the details
// you'll wish you'd written down — paint codes, filter sizes, shut-off spots —
// with the common ones offered as one-tap suggestions so nothing has to be
// remembered from a blank page.

import { useEffect, useMemo, useRef, useState } from "react";

import {
  COLORS, FONT, ACCENT, inputStyle, btn, Icon, ICON, txt,
  DelBtn, AddBtn, Chip, SectionHead, fmtBuildDate, daysFromToday,
  DateField, EmptyState} from "../ui";
import { EXTERNAL_ICON } from "./_common";

// A warranty is "expiring soon" inside this window. Not a magic number in-line.
const SOON_DAYS = 60;

const ALERT_ICON = "M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z M12 9v4 M12 17h.01";
const SHIELD_ICON = "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z";

// Common as-built details, every word spelled out. Offered as one-tap adds so
// the user never has to recall the canonical list of things worth recording.
const COMMON_DETAILS = [
  "Interior wall paint",
  "Trim and door paint",
  "Ceiling paint",
  "Exterior paint",
  "Cabinet paint or stain",
  "Furnace filter size",
  "Main water shut-off location",
  "Main gas shut-off location",
  "Electrical panel location",
  "Water heater model",
  "Network and WiFi details",
];

// One place decides what a warranty's expiry MEANS — its tone, its wording, and
// its sort key — so the top banner, the list order, and each row's chip can
// never drift out of sync. Tone follows the house rule: red = needs action,
// amber = waiting, green = settled, neutral = inert.
function warrantyStatus(wr) {
  if (!wr.expires) return { key: "none", tone: "neutral", label: "No expiration date", days: Infinity };
  const d = daysFromToday(wr.expires);
  if (d < 0) return { key: "expired", tone: "red", label: `Expired ${fmtBuildDate(wr.expires)}`, days: d };
  if (d === 0) return { key: "today", tone: "red", label: "Expires today", days: d };
  if (d <= SOON_DAYS) return { key: "soon", tone: "amber", label: `${d} ${d === 1 ? "day" : "days"} left`, days: d };
  return { key: "ok", tone: "green", label: `Good until ${fmtBuildDate(wr.expires)}`, days: d };
}

function Lbl({ children }) {
  return (
    <span style={{ display: "block", fontSize: 10.5, fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", color: COLORS.textFaint, marginBottom: 5 }}>
      {children}
    </span>
  );
}

// One-tap "add this detail" pill. Bordered with a fill lighter than the card so
// it reads as a button, never a static label.
function SuggestBtn({ label, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "inline-flex", alignItems: "center", gap: 5, padding: "6px 10px", borderRadius: 999,
        border: `1px solid ${COLORS.borderStrong}`, background: COLORS.surface, color: COLORS.textMuted,
        fontSize: 12, fontWeight: 600, fontFamily: FONT, cursor: "pointer",
      }}
    >
      <Icon d={ICON.plus} size={12} color={COLORS.textFaint} />
      {label}
    </button>
  );
}

function WarrantyCard({ wr, st, open, onToggle, onChange, onDelete }) {
  return (
    <div style={{ border: `1px solid ${COLORS.border}`, borderRadius: 12, marginBottom: 10, overflow: "hidden", background: COLORS.surface }}>
      <button
        onClick={onToggle}
        style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "11px 12px", background: "transparent", border: "none", cursor: "pointer", fontFamily: FONT, textAlign: "left" }}
      >
        <Icon d={open ? ICON.chevD : ICON.chevR} size={13} color={COLORS.textFaint} />
        <span style={{ flex: 1, minWidth: 0, fontSize: 13.5, fontWeight: 700, color: COLORS.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {wr.item || "Untitled warranty"}
        </span>
        <Chip tone={st.tone}>{st.label}</Chip>
      </button>

      {open && (
        <div style={{ padding: "2px 14px 14px", display: "grid", gap: 12 }}>
          <div>
            <Lbl>What is covered</Lbl>
            <input
              value={wr.item || ""}
              onChange={(e) => onChange({ item: e.target.value })}
              placeholder="e.g. Roof, HVAC system, builder workmanship"
              style={{ ...txt(), fontWeight: 700 }}
            />
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            <div style={{ flex: "1 1 150px", minWidth: 0 }}>
              <Lbl>Provider</Lbl>
              <input
                value={wr.provider || ""}
                onChange={(e) => onChange({ provider: e.target.value })}
                placeholder="Company or trade"
                style={txt()}
              />
            </div>
            <div style={{ flex: "1 1 150px", minWidth: 0 }}>
              <Lbl>Expiration date</Lbl>
              <DateField value={wr.expires} onChange={(v) => onChange({ expires: v })} ariaLabel="Expiration date" />
            </div>
          </div>

          <div>
            <Lbl>Warranty document link</Lbl>
            <div style={{ display: "flex", gap: 8 }}>
              <input
                value={wr.url || ""}
                onChange={(e) => onChange({ url: e.target.value })}
                placeholder="https://…"
                style={{ ...txt(), flex: 1, minWidth: 0 }}
              />
              {wr.url && (
                <a
                  href={wr.url} target="_blank" rel="noopener noreferrer" aria-label="Open document"
                  style={{ display: "inline-flex", alignItems: "center", gap: 5, flexShrink: 0, fontSize: 12, fontWeight: 700, color: "#fff", background: ACCENT, padding: "8px 12px", borderRadius: 9, textDecoration: "none", fontFamily: FONT }}
                >
                  Open <Icon d={EXTERNAL_ICON} size={12} color="#fff" />
                </a>
              )}
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button onClick={onDelete} style={{ ...btn("ghost") }}><Icon d={ICON.x} size={13} /> Delete warranty</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AsBuiltSection({ state, addRow, updRow, delRow }) {
  const ab = state.as_built || [];
  const wrs = state.warranties || [];
  const [openId, setOpenId] = useState(null);

  // Rank every warranty by urgency once — most-urgent first (expired ones float
  // to the top), no-expiry ones sink to the bottom. Status travels with the row
  // so the banner and the card read the same verdict.
  const ranked = useMemo(
    () => wrs.map((w) => ({ ...w, _s: warrantyStatus(w) })).sort((a, b) => a._s.days - b._s.days),
    [wrs],
  );
  const urgent = ranked.filter((w) => w._s.key === "expired" || w._s.key === "today" || w._s.key === "soon");
  const anyExpired = urgent.some((w) => w._s.days <= 0);
  const bannerTone = anyExpired ? COLORS.red : COLORS.amber;
  const bannerBg = anyExpired ? COLORS.redBg : COLORS.amberBg;

  const usedLabels = new Set(ab.map((d) => (d.label || "").trim().toLowerCase()));
  const suggestions = COMMON_DETAILS.filter((s) => !usedLabels.has(s.toLowerCase()));

  // Add a warranty and open it straight away so he names it in place, never
  // hunting for a collapsed "Untitled" row. addRow appends; open the last one
  // once React has committed the new state.
  const wantNewest = useRef(false);
  useEffect(() => {
    if (!wantNewest.current) return;
    wantNewest.current = false;
    const last = wrs[wrs.length - 1];
    if (last) setOpenId(last.id);
  }, [wrs]);

  const addDetail = (label) => addRow("as_built", { label, value: "" });
  const addWarranty = () => { wantNewest.current = true; addRow("warranties", { item: "", provider: "", expires: null, url: "" }); };

  const note = [
    `${ab.length} ${ab.length === 1 ? "detail" : "details"}`,
    `${wrs.length} ${wrs.length === 1 ? "warranty" : "warranties"}`,
    urgent.length ? `${urgent.length} need${urgent.length === 1 ? "s" : ""} attention` : null,
  ].filter(Boolean).join(" · ");

  return (
    <>
      <SectionHead title="As-built & warranties" note={note} />

      {urgent.length > 0 && (
        <div style={{ display: "flex", gap: 11, padding: "13px 15px", borderRadius: 14, marginBottom: 14, border: `1px solid ${bannerTone}`, background: bannerBg }}>
          <Icon d={ALERT_ICON} size={20} color={bannerTone} style={{ flexShrink: 0, marginTop: 1 }} />
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ fontSize: 13.5, fontWeight: 800, color: COLORS.text }}>
              {anyExpired
                ? (urgent.length === 1 ? "A warranty has expired" : "Warranties need your attention")
                : (urgent.length === 1 ? "A warranty is expiring soon" : "Warranties are expiring soon")}
            </div>
            <div style={{ display: "grid", gap: 6, marginTop: 8 }}>
              {urgent.slice(0, 4).map((w) => (
                <div key={w.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
                  <span style={{ minWidth: 0, fontSize: 12.5, fontWeight: 600, color: COLORS.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {w.item || "Untitled warranty"}
                  </span>
                  <Chip tone={w._s.tone}>{w._s.label}</Chip>
                </div>
              ))}
              {urgent.length > 4 && (
                <span style={{ fontSize: 12, color: COLORS.textMuted }}>+{urgent.length - 4} more</span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── As-built details ─────────────────────────────────────────────── */}
      <section style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 20, boxShadow: COLORS.shadow, overflow: "hidden", marginBottom: 14 }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 10, padding: "14px 16px 12px", borderBottom: `1px solid ${COLORS.surfaceTint}` }}>
          <span style={{ fontSize: 14, fontWeight: 800, letterSpacing: "-0.01em", color: COLORS.text }}>As-built details</span>
          {ab.length > 0 && <span style={{ fontSize: 12, fontWeight: 700, color: COLORS.textFaint }}>{ab.length} recorded</span>}
        </div>
        <div style={{ padding: "6px 12px 14px" }}>
          {ab.length === 0 ? (
            <EmptyState
              icon={ICON.fileText}
              title="Write down the details you'll wish you'd kept"
              action={<AddBtn label="Add the first detail" onClick={() => addDetail("")} />}
            >
              Paint colours, furnace filter sizes, the wall the water shuts off behind — the sort of thing you're sure you'll remember, right up until the day you need it. Jot it down now and future-you is covered.
            
              {/* One tap adds a named detail. Asking a man staring at a blank screen to
                  invent the phrase "furnace filter size" is exactly the thinking this
                  planner exists to remove. */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, justifyContent: "center", marginTop: 16 }}>
                {COMMON_DETAILS.slice(0, 8).map((label) => (
                  <SuggestBtn key={label} label={label} onClick={() => addDetail(label)} />
                ))}
              </div>
            </EmptyState>
          ) : (
            <>
              {ab.map((d) => (
                <div key={d.id} style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center", padding: "6px 4px", borderBottom: `1px solid ${COLORS.surfaceTint}` }}>
                  <input
                    value={d.label || ""}
                    onChange={(e) => updRow("as_built", d.id, { label: e.target.value })}
                    placeholder="What is it"
                    style={{ ...txt(), flex: "1 1 130px", minWidth: 0, fontWeight: 600 }}
                  />
                  <input
                    value={d.value || ""}
                    onChange={(e) => updRow("as_built", d.id, { value: e.target.value })}
                    placeholder="e.g. Sherwin-Williams 7008 Alabaster"
                    style={{ ...txt(), flex: "2 1 170px", minWidth: 0 }}
                  />
                  <DelBtn onClick={() => delRow("as_built", d.id)} />
                </div>
              ))}

              {suggestions.length > 0 && (
                <div style={{ marginTop: 12 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase", color: COLORS.textFaint }}>Common details to add</span>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 7 }}>
                    {suggestions.slice(0, 8).map((s) => <SuggestBtn key={s} label={s} onClick={() => addDetail(s)} />)}
                  </div>
                </div>
              )}

              <div style={{ marginTop: 12 }}>
                <AddBtn label="Add your own detail" onClick={() => addDetail("")} />
              </div>
            </>
          )}
        </div>
      </section>

      {/* ── Warranties ───────────────────────────────────────────────────── */}
      <section style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 20, boxShadow: COLORS.shadow, overflow: "hidden", marginBottom: 14 }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 10, padding: "14px 16px 12px", borderBottom: `1px solid ${COLORS.surfaceTint}` }}>
          <span style={{ fontSize: 14, fontWeight: 800, letterSpacing: "-0.01em", color: COLORS.text }}>Warranties</span>
          {wrs.length > 0 && <span style={{ fontSize: 12, fontWeight: 700, color: COLORS.textFaint }}>{wrs.length} tracked</span>}
        </div>
        <div style={{ padding: "6px 12px 14px" }}>
          {wrs.length === 0 ? (
            <EmptyState
              icon={SHIELD_ICON}
              title="Never let a warranty lapse without knowing"
              action={<AddBtn label="Add the first warranty" onClick={addWarranty} />}
            >
              Add each warranty with the day it runs out and this page will warn you before the window closes — the builder's workmanship coverage most of all, since that's the one worth real money if something goes wrong.
            </EmptyState>
          ) : (
            <>
              {ranked.map((w) => (
                <WarrantyCard
                  key={w.id}
                  wr={w}
                  st={w._s}
                  open={openId === w.id}
                  onToggle={() => setOpenId((id) => (id === w.id ? null : w.id))}
                  onChange={(p) => updRow("warranties", w.id, p)}
                  onDelete={() => { delRow("warranties", w.id); setOpenId(null); }}
                />
              ))}
              <AddBtn label="Add warranty" onClick={addWarranty} />
            </>
          )}
        </div>
      </section>
    </>
  );
}
