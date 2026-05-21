"use client";

// Standalone home-build planner. Its own nav and sections; saves to
// its own app_data row via saveBuildStateAction. Reuses the budget
// app's design tokens, icons and money helpers so it feels native.

import { useCallback, useEffect, useMemo, useRef, useState, useTransition } from "react";

import { COLORS, FONT, STYLES, inputStyle, btnStyle as btn, themeStylesheet } from "../budget/lib/tokens";
import { Icon, ICON } from "../budget/lib/icons";
import { fmtUsd, fmtCompact } from "../budget/lib/money";
import { genId } from "../budget/lib/calc";
import { useIsMobile } from "../budget/lib/responsive";
import { saveBuildStateAction } from "@/actions/build/state";

const ACCENT = "#0bafb0";
const ACCENT_SOFT = "rgba(11,175,176,0.12)";
const DOC_ICON = "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6 M16 13H8 M16 17H8";
const EXTERNAL_ICON = "M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6 M15 3h6v6 M10 14L21 3";
const CAMERA_ICON = "M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3z M12 17a4 4 0 1 0 0-8 4 4 0 0 0 0 8z";
const CHANGE_ORDER_ICON = "M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z M14 2v6h6 M12 18v-6 M9 15h6";
const PAYMENT_ICON = "M4 5h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z M2 10h20";
const INSPECTION_ICON = "M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2 M9 2h6a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1z M9 14l2 2 4-4";
const PUNCH_ICON = "M9 11l3 3L22 4 M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11";
const RFI_ICON = "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z";
const ASBUILT_ICON = "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z M9 12l2 2 4-4";
const ENERGY_ICON = "M13 2L3 14h7l-1 8 10-12h-7z";
const PHOTO_PHASES = ["", "Site & foundation", "Framing", "Dry-in", "Rough-ins", "Insulation & drywall", "Interior finishes", "Exterior & landscape", "Final"];
const PAY_METHODS = ["Check", "ACH", "Wire", "Card", "Cash", "Loan draw"];

const SECTIONS = [
  { id: "overview",   label: "Overview",       icon: ICON.home },
  { id: "inspiration", label: "Inspiration",   icon: "M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2z M8.5 10a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z M21 15l-5-5L5 21" },
  { id: "references", label: "References",     icon: "M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" },
  { id: "palette",    label: "Materials",      icon: "M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z" },
  { id: "wants",      label: "Wants & Needs",  icon: ICON.flag },
  { id: "rooms",      label: "Rooms & Spaces", icon: ICON.building },
  { id: "costs",      label: "Costs",          icon: ICON.envelope },
  { id: "changeorders", label: "Change Orders", icon: CHANGE_ORDER_ICON },
  { id: "payments",   label: "Payments",       icon: PAYMENT_ICON },
  { id: "milestones", label: "Milestones",     icon: ICON.calendar },
  { id: "inspections", label: "Inspections",   icon: INSPECTION_ICON },
  { id: "selections", label: "Selections",     icon: ICON.edit },
  { id: "decisions",  label: "Decisions",      icon: RFI_ICON },
  { id: "team",       label: "Team & Vendors", icon: ICON.family },
  { id: "documents",  label: "Documents",      icon: "M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" },
  { id: "photos",     label: "Progress Photos", icon: CAMERA_ICON },
  { id: "punchlist",  label: "Punch List",     icon: PUNCH_ICON },
  { id: "asbuilt",    label: "As-Built & Warranty", icon: ASBUILT_ICON },
  { id: "energy",     label: "Energy",         icon: ENERGY_ICON },
  { id: "brief",      label: "Architect Brief", icon: DOC_ICON },
];

const DOC_CATEGORY_ORDER = [
  "Plans & drawings", "Permits & approvals", "Survey & site",
  "Contracts & bids", "Financing", "Insurance & warranty", "Other",
];

const COST_GROUP_ORDER = [
  "Land & site", "Structure", "Exterior", "Mechanical", "Interior",
  "Finishes", "Soft costs", "Landscaping & extras", "Reserve", "Add-ons",
];

// ── Shared bits ──────────────────────────────────────────────────────

function Card({ title, sub, children }) {
  return (
    <section style={{ ...STYLES.card, padding: 0, overflow: "hidden", marginBottom: 14 }}>
      <div style={{
        display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 10,
        padding: "14px 16px 12px", borderBottom: `1px solid ${COLORS.surfaceTint}`,
      }}>
        <span style={{ fontSize: 14, fontWeight: 800, letterSpacing: "-0.01em", color: COLORS.text }}>{title}</span>
        {sub != null && <span style={{ fontSize: 12, fontWeight: 700, color: COLORS.textFaint }}>{sub}</span>}
      </div>
      <div style={{ padding: "6px 12px 12px" }}>{children}</div>
    </section>
  );
}

function Field({ label, children }) {
  return (
    <label style={{ display: "block", marginBottom: 12 }}>
      <span style={{ display: "block", fontSize: 10.5, fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", color: COLORS.textFaint, marginBottom: 5 }}>
        {label}
      </span>
      {children}
    </label>
  );
}

function txt() {
  return { ...inputStyle(), width: "100%", boxSizing: "border-box", fontWeight: 600 };
}

function MoneyInput({ value, onChange, placeholder }) {
  const toStr = (c) => (c ? (c / 100).toString() : "");
  const [draft, setDraft] = useState(() => toStr(value));
  return (
    <input
      type="text"
      inputMode="decimal"
      value={draft}
      onChange={(e) => setDraft(e.target.value)}
      onBlur={() => {
        const n = parseFloat(draft);
        const cents = isNaN(n) ? 0 : Math.round(n * 100);
        onChange(cents);
        setDraft(toStr(cents));
      }}
      placeholder={placeholder || "$0"}
      style={{ ...inputStyle(), width: "100%", boxSizing: "border-box", textAlign: "right", fontWeight: 700, fontVariantNumeric: "tabular-nums" }}
    />
  );
}

function DelBtn({ onClick }) {
  return (
    <button
      onClick={onClick}
      aria-label="Delete"
      style={{
        width: 26, height: 26, borderRadius: 7, flexShrink: 0, cursor: "pointer",
        border: `1px solid ${COLORS.border}`, background: COLORS.surface, color: COLORS.textFaint,
        display: "grid", placeItems: "center",
      }}
      onMouseEnter={(e) => { e.currentTarget.style.background = COLORS.redBg; e.currentTarget.style.color = COLORS.red; e.currentTarget.style.borderColor = COLORS.red; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = COLORS.surface; e.currentTarget.style.color = COLORS.textFaint; e.currentTarget.style.borderColor = COLORS.border; }}
    >
      <Icon d={ICON.x} size={13} />
    </button>
  );
}

function Check({ done, onClick }) {
  return (
    <button
      onClick={onClick}
      aria-pressed={done}
      aria-label={done ? "Done" : "Not done"}
      style={{
        width: 24, height: 24, borderRadius: 7, flexShrink: 0, cursor: "pointer",
        border: `1px solid ${done ? COLORS.green : COLORS.border}`,
        background: done ? COLORS.green : "transparent",
        display: "grid", placeItems: "center",
      }}
    >
      {done && <Icon d="M20 6L9 17l-5-5" size={13} color="#fff" />}
    </button>
  );
}

function AddBtn({ label, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "inline-flex", alignItems: "center", gap: 6, marginTop: 6,
        padding: "9px 12px", borderRadius: 10, cursor: "pointer", fontFamily: FONT,
        fontSize: 12.5, fontWeight: 700, color: ACCENT,
        background: ACCENT_SOFT, border: "none",
      }}
    >
      <Icon d={["M12 5v14", "M5 12h14"]} size={13} />
      {label}
    </button>
  );
}

// ── Section views ────────────────────────────────────────────────────

function StatTile({ label, value, sub, accent, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        textAlign: "left", background: "#fff", border: `1px solid ${COLORS.border}`,
        borderRadius: 14, padding: 14, cursor: "pointer", fontFamily: FONT,
        display: "flex", flexDirection: "column", gap: 3, minWidth: 0,
      }}
    >
      <span style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: 0.5, textTransform: "uppercase", color: COLORS.textFaint }}>{label}</span>
      <span style={{ fontSize: 21, fontWeight: 800, color: accent || COLORS.text, fontVariantNumeric: "tabular-nums" }}>{value}</span>
      <span style={{ fontSize: 11.5, fontWeight: 600, color: COLORS.textMuted, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{sub}</span>
    </button>
  );
}

function Dashboard({ state, onJump }) {
  const costs = state.costs || [];
  const totalEst = costs.reduce((s, c) => s + c.estimate_cents, 0);
  const budget = state.budget_cents || 0;
  const cos = state.change_orders || [];
  const coNet = cos.filter((o) => o.status === "approved")
    .reduce((s, o) => s + (o.kind === "credit" ? -1 : 1) * (o.amount_cents || 0), 0);
  const coPending = cos.filter((o) => o.status === "pending");
  const revised = totalEst + coNet;
  const overBudget = budget > 0 && revised > budget;
  const pays = state.payments || [];
  const totalPaid = pays.reduce((s, p) => s + (p.amount_cents || 0), 0);
  const waiverDue = pays.filter((p) => p.lien_waiver === "pending");

  const ms = state.milestones || [];
  const msDone = ms.filter((m) => m.done).length;
  const msPct = ms.length ? Math.round((msDone / ms.length) * 100) : 0;
  const nextMs = ms.filter((m) => m.target && !m.done).slice()
    .sort((a, b) => (a.target < b.target ? -1 : 1))[0];
  const overdueMs = ms.filter((m) => m.target && !m.done && daysFromToday(m.target) < 0);

  const sels = state.selections || [];
  const openSel = sels.filter((s) => s.status === "open");
  const dueSel = openSel.filter((s) => s.deadline && daysFromToday(s.deadline) < 21);

  const loan = state.loan || { amount_cents: 0, rate_bps: 0 };
  const drawn = (state.draws || []).reduce((s, d) => s + (d.amount_cents || 0), 0);
  const overDrawn = loan.amount_cents > 0 && drawn > loan.amount_cents;

  const wishes = state.wishlist || [];
  const wishDone = wishes.filter((w) => w.done).length;
  const docs = state.documents || [];
  const docLinked = docs.filter((d) => d.url).length;
  const photos = state.photos || [];
  const rooms = state.rooms || [];
  const insps = state.inspections || [];
  const inspPassed = insps.filter((i) => i.status === "passed").length;
  const inspFailed = insps.filter((i) => i.status === "failed");
  const openRfis = (state.rfis || []).filter((r) => r.status === "open");
  const punchOpen = (state.punch_list || []).filter((i) => !i.done);

  const alerts = [];
  if (overBudget) alerts.push({ tone: COLORS.red, text: `Revised cost is ${fmtCompact(revised - budget)} over your target budget`, to: "costs" });
  if (overdueMs.length) alerts.push({ tone: COLORS.red, text: `${overdueMs.length} milestone${overdueMs.length > 1 ? "s" : ""} past due`, to: "milestones" });
  if (inspFailed.length) alerts.push({ tone: COLORS.red, text: `${inspFailed.length} inspection${inspFailed.length > 1 ? "s" : ""} failed — needs correction & re-inspection`, to: "inspections" });
  if (overDrawn) alerts.push({ tone: COLORS.red, text: `Construction loan is over-drawn by ${fmtCompact(drawn - loan.amount_cents)}`, to: "costs" });
  if (waiverDue.length) alerts.push({ tone: COLORS.red, text: `${waiverDue.length} payment${waiverDue.length > 1 ? "s" : ""} missing a signed lien waiver`, to: "payments" });
  if (coPending.length) alerts.push({ tone: COLORS.amber, text: `${coPending.length} change order${coPending.length > 1 ? "s" : ""} awaiting your approval`, to: "changeorders" });
  if (dueSel.length) alerts.push({ tone: COLORS.amber, text: `${dueSel.length} selection${dueSel.length > 1 ? "s" : ""} need a decision soon`, to: "selections" });
  if (openRfis.length) alerts.push({ tone: COLORS.amber, text: `${openRfis.length} open question${openRfis.length > 1 ? "s" : ""} for your architect or builder`, to: "decisions" });
  if (punchOpen.length) alerts.push({ tone: COLORS.amber, text: `${punchOpen.length} punch-list item${punchOpen.length > 1 ? "s" : ""} still open`, to: "punchlist" });

  const vitals = [
    ["Budget", budget ? fmtCompact(budget) : "—"],
    ["Sq ft", state.sqft ? state.sqft.toLocaleString() : "—"],
    ["Stories", state.stories || "—"],
  ];

  const tiles = [
    ["Revised cost", fmtCompact(revised), budget ? `of ${fmtCompact(budget)} target` : coNet ? "incl. change orders" : "estimated · no target", overBudget ? COLORS.red : COLORS.text, "costs"],
    ["Paid to date", fmtCompact(totalPaid), revised ? `${fmtCompact(Math.max(0, revised - totalPaid))} left to pay` : `${pays.length} payments`, COLORS.text, "payments"],
    ["Timeline", `${msPct}%`, nextMs ? `Next: ${nextMs.label}` : `${msDone}/${ms.length} milestones done`, ACCENT, "milestones"],
    ["Inspections", `${inspPassed}/${insps.length}`, inspFailed.length ? `${inspFailed.length} failed` : "passed", inspFailed.length ? COLORS.red : COLORS.text, "inspections"],
    ["Selections", `${openSel.length} open`, `${sels.length - openSel.length}/${sels.length} decided`, openSel.length ? COLORS.amber : COLORS.green, "selections"],
    ["Loan drawn", fmtCompact(drawn), loan.amount_cents ? `of ${fmtCompact(loan.amount_cents)} facility` : "no loan set", overDrawn ? COLORS.red : COLORS.text, "costs"],
    ["Wishlist", `${wishDone}/${wishes.length}`, "wants checked off", COLORS.text, "wants"],
    ["Rooms", `${rooms.length}`, "spaces planned", COLORS.text, "rooms"],
    ["Photos", `${photos.length}`, "progress photos logged", COLORS.text, "photos"],
    ["Documents", `${docLinked}/${docs.length}`, "linked & on file", COLORS.text, "documents"],
  ];

  return (
    <>
      <div style={{ background: `linear-gradient(135deg, ${ACCENT}, #07908f)`, borderRadius: 16, padding: 18, color: "#fff", marginBottom: 14 }}>
        <div style={{ fontSize: 11, fontWeight: 800, opacity: 0.85, textTransform: "uppercase", letterSpacing: 0.6 }}>Home build · command center</div>
        <div style={{ fontSize: 22, fontWeight: 800, marginTop: 3 }}>{state.project_name || "Our Dream Home"}</div>
        {state.style && <div style={{ fontSize: 12.5, opacity: 0.9, marginTop: 4, lineHeight: 1.4 }}>{state.style}</div>}
        <div style={{ display: "flex", gap: 22, marginTop: 14 }}>
          {vitals.map(([l, v]) => (
            <div key={l}>
              <div style={{ fontSize: 10.5, fontWeight: 700, opacity: 0.8, textTransform: "uppercase", letterSpacing: 0.4 }}>{l}</div>
              <div style={{ fontSize: 17, fontWeight: 800, marginTop: 1 }}>{v}</div>
            </div>
          ))}
        </div>
      </div>

      <Card title="Needs attention">
        {alerts.length ? (
          <div style={{ display: "grid", gap: 8, paddingTop: 4 }}>
            {alerts.map((a, i) => (
              <button
                key={i}
                onClick={() => onJump(a.to)}
                style={{
                  display: "flex", alignItems: "center", gap: 10, textAlign: "left",
                  background: COLORS.surfaceTint, border: "none", borderRadius: 10,
                  padding: "10px 12px", cursor: "pointer", fontFamily: FONT, width: "100%",
                }}
              >
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: a.tone, flexShrink: 0 }} />
                <span style={{ flex: 1, fontSize: 13, fontWeight: 600, color: COLORS.text }}>{a.text}</span>
                <Icon d={ICON.chevR} size={13} color={COLORS.textFaint} />
              </button>
            ))}
          </div>
        ) : (
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 4px 4px" }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: COLORS.green, flexShrink: 0 }} />
            <span style={{ fontSize: 13, fontWeight: 600, color: COLORS.textMuted }}>Everything&apos;s on track — no overdue dates, no budget overruns.</span>
          </div>
        )}
      </Card>

      <Card title="At a glance">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 10, paddingTop: 6 }}>
          {tiles.map(([label, value, sub, accent, to]) => (
            <StatTile key={label} label={label} value={value} sub={sub} accent={accent} onClick={() => onJump(to)} />
          ))}
        </div>
      </Card>
    </>
  );
}

function OverviewSection({ state, setField, onJump }) {
  return (
    <>
    <Dashboard state={state} onJump={onJump} />
    <Card title="Project basics">
      <div style={{ paddingTop: 6 }}>
        <Field label="Project name">
          <input type="text" value={state.project_name} onChange={(e) => setField("project_name", e.target.value)} style={txt()} placeholder="Our New Home" />
        </Field>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 12 }}>
          <Field label="Target budget">
            <MoneyInput value={state.budget_cents} onChange={(v) => setField("budget_cents", v)} />
          </Field>
          <Field label="Square footage">
            <input type="number" value={state.sqft || ""} onChange={(e) => setField("sqft", Math.max(0, Math.round(Number(e.target.value) || 0)))} style={{ ...txt(), textAlign: "right" }} placeholder="0" />
          </Field>
          <Field label="Stories">
            <input type="number" value={state.stories || ""} onChange={(e) => setField("stories", Math.max(1, Math.round(Number(e.target.value) || 1)))} style={{ ...txt(), textAlign: "right" }} placeholder="1" />
          </Field>
        </div>
        <Field label="Style / vibe">
          <input type="text" value={state.style} onChange={(e) => setField("style", e.target.value)} style={txt()} placeholder="e.g. modern farmhouse, single-story, board & batten" />
        </Field>
        <Field label="Lot / location">
          <input type="text" value={state.lot} onChange={(e) => setField("lot", e.target.value)} style={txt()} placeholder="Acreage, views, orientation, setbacks…" />
        </Field>
        <Field label="Vision & must-knows for the architect">
          <textarea
            value={state.notes}
            onChange={(e) => setField("notes", e.target.value)}
            rows={5}
            style={{ ...txt(), resize: "vertical", lineHeight: 1.5 }}
            placeholder="The big picture — how you want the home to feel and live, deal-breakers, inspiration…"
          />
        </Field>
      </div>
    </Card>
    </>
  );
}

function WantsSection({ state, addRow, updRow, delRow }) {
  const tiers = [["need", "Needs"], ["want", "Wants"], ["dream", "Dreams"]];
  return (
    <Card title="Wants & needs" sub={`${state.wishlist.length} items`}>
      {tiers.map(([pri, label]) => {
        const items = state.wishlist.filter((w) => w.priority === pri);
        return (
          <div key={pri}>
            <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 0.4, color: ACCENT, textTransform: "uppercase", padding: "10px 4px 2px" }}>
              {label} · {items.length}
            </div>
            {items.length === 0 && (
              <div style={{ fontSize: 12.5, color: COLORS.textFaint, fontStyle: "italic", padding: "4px 4px 6px" }}>Nothing here yet.</div>
            )}
            {items.map((w) => (
              <div key={w.id} style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 4px", borderBottom: `1px solid ${COLORS.surfaceTint}` }}>
                <Check done={w.done} onClick={() => updRow("wishlist", w.id, { done: !w.done })} />
                <input
                  type="text" value={w.label}
                  onChange={(e) => updRow("wishlist", w.id, { label: e.target.value })}
                  style={{ ...txt(), flex: 1, minWidth: 0, textDecoration: w.done ? "line-through" : "none", opacity: w.done ? 0.55 : 1 }}
                />
                <select value={w.priority} onChange={(e) => updRow("wishlist", w.id, { priority: e.target.value })} aria-label="Priority" style={{ ...inputStyle(), fontWeight: 600, cursor: "pointer" }}>
                  <option value="need">need</option>
                  <option value="want">want</option>
                  <option value="dream">dream</option>
                </select>
                <DelBtn onClick={() => delRow("wishlist", w.id)} />
              </div>
            ))}
          </div>
        );
      })}
      <AddBtn label="Add a want or need" onClick={() => addRow("wishlist", { label: "New item", priority: "want", done: false })} />
    </Card>
  );
}

function RoomField({ label, value, onChange, placeholder }) {
  return (
    <div>
      <span style={{ display: "block", fontSize: 10.5, fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", color: COLORS.textFaint, marginBottom: 5 }}>
        {label}
      </span>
      <textarea
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        rows={2}
        placeholder={placeholder}
        style={{ ...txt(), resize: "vertical", lineHeight: 1.5 }}
      />
    </div>
  );
}

function RoomCard({ room, onChange, onDelete }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ border: `1px solid ${COLORS.border}`, borderRadius: 12, marginBottom: 10, overflow: "hidden" }}>
      <button
        onClick={() => setOpen((o) => !o)}
        style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "12px", background: "transparent", border: "none", cursor: "pointer", fontFamily: FONT, textAlign: "left" }}
      >
        <Icon d={open ? ICON.chevD : ICON.chevR} size={13} color={COLORS.textFaint} />
        <span style={{ flex: 1, minWidth: 0, fontSize: 14, fontWeight: 700, color: COLORS.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {room.name || "Room"}
        </span>
        <span style={{ fontSize: 11.5, fontWeight: 600, color: COLORS.textFaint, flexShrink: 0 }}>
          {[room.level, room.size].filter(Boolean).join(" · ")}
        </span>
      </button>
      {open && (
        <div style={{ padding: "2px 14px 14px", display: "grid", gap: 12 }}>
          <div style={{ display: "flex", gap: 8 }}>
            <input value={room.name} onChange={(e) => onChange({ name: e.target.value })} placeholder="Room name" style={{ ...txt(), flex: 2, fontWeight: 700 }} />
            <input value={room.level} onChange={(e) => onChange({ level: e.target.value })} placeholder="Level" style={{ ...txt(), flex: 1, minWidth: 0 }} />
            <input value={room.size} onChange={(e) => onChange({ size: e.target.value })} placeholder="Size" style={{ ...txt(), flex: 1, minWidth: 0 }} />
          </div>
          <RoomField label="Must-haves" value={room.must_haves} onChange={(v) => onChange({ must_haves: v })} placeholder="What this room needs…" />
          <RoomField label="Lighting & electrical" value={room.lighting} onChange={(v) => onChange({ lighting: v })} placeholder="Fixtures, switches, outlets, smart-home…" />
          <RoomField label="Other notes" value={room.details} onChange={(v) => onChange({ details: v })} placeholder="Anything else for this room…" />
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button onClick={onDelete} style={{ ...btn("ghost") }}>
              <Icon d={ICON.x} size={13} /> Delete room
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function RoomsSection({ state, addRow, updRow, delRow }) {
  return (
    <Card title="Rooms & spaces" sub={`${state.rooms.length} rooms`}>
      <div style={{ fontSize: 12, color: COLORS.textMuted, padding: "4px 2px 12px", lineHeight: 1.5 }}>
        Your room program — what the architect designs from. Tap a room to open its full details.
      </div>
      {state.rooms.map((r) => (
        <RoomCard
          key={r.id}
          room={r}
          onChange={(patch) => updRow("rooms", r.id, patch)}
          onDelete={() => delRow("rooms", r.id)}
        />
      ))}
      <AddBtn label="Add room" onClick={() => addRow("rooms", { name: "New room", level: "Main", size: "", must_haves: "", lighting: "", details: "" })} />
    </Card>
  );
}

function CostsSection({ state, setField, addRow, updRow, delRow }) {
  const costs = state.costs;
  const totalEst = costs.reduce((s, c) => s + c.estimate_cents, 0);
  const sqft = parseFloat(String(state.sqft || "").replace(/[^0-9.]/g, "")) || 0;
  const groups = [...new Set(costs.map((c) => c.group))]
    .sort((a, b) => COST_GROUP_ORDER.indexOf(a) - COST_GROUP_ORDER.indexOf(b));
  const loan = state.loan || { amount_cents: 0, rate_bps: 0 };
  const draws = state.draws || [];
  const drawn = draws.reduce((s, d) => s + (d.amount_cents || 0), 0);
  const setLoan = (patch) => setField("loan", { ...loan, ...patch });

  const cos = state.change_orders || [];
  const coSigned = (o) => (o.kind === "credit" ? -1 : 1) * (o.amount_cents || 0);
  const coNet = cos.filter((o) => o.status === "approved").reduce((s, o) => s + coSigned(o), 0);
  const revised = totalEst + coNet;
  const totalPaid = (state.payments || []).reduce((s, p) => s + (p.amount_cents || 0), 0);
  const leftToPay = revised - totalPaid;
  const perSqft = sqft > 0 ? Math.round(revised / sqft) : 0;
  const signed = (n) => (n > 0 ? "+" : n < 0 ? "−" : "") + fmtCompact(Math.abs(n));
  const basisLines = costs.filter((c) => c.estimate_cents > 0 || c.actual_cents > 0);
  const basis = basisLines
    .filter((c) => c.in_basis !== false)
    .reduce((s, c) => s + (c.actual_cents || c.estimate_cents || 0), 0);

  return (
    <>
      <Card title="Cost to complete">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(124px, 1fr))", gap: 8, paddingTop: 6 }}>
          {[
            ["Estimated", fmtCompact(totalEst), COLORS.text],
            ["Change orders", coNet ? signed(coNet) : "—", coNet > 0 ? COLORS.amber : coNet < 0 ? COLORS.green : COLORS.textFaint],
            ["Revised cost", fmtCompact(revised), COLORS.text],
            ["Paid to date", fmtCompact(totalPaid), COLORS.text],
            ["Left to pay", fmtCompact(leftToPay), leftToPay < 0 ? COLORS.green : ACCENT],
            [
              state.budget_cents ? (state.budget_cents - revised >= 0 ? "Under budget" : "Over budget") : "No target",
              state.budget_cents ? fmtCompact(Math.abs(state.budget_cents - revised)) : "—",
              !state.budget_cents ? COLORS.textFaint : state.budget_cents - revised >= 0 ? COLORS.green : COLORS.red,
            ],
            ["Cost / sq ft", perSqft ? fmtCompact(perSqft) : "—", COLORS.text],
          ].map(([l, v, c]) => (
            <div key={l} style={{ background: COLORS.surfaceTint, borderRadius: 10, padding: "10px 12px" }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 0.4, color: COLORS.textFaint, textTransform: "uppercase" }}>{l}</div>
              <div style={{ marginTop: 3, fontSize: 16, fontWeight: 800, color: c, fontVariantNumeric: "tabular-nums" }}>{v}</div>
            </div>
          ))}
        </div>
      </Card>
      <Card title="Costs" sub={`${fmtCompact(totalEst)} est`}>
        <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) 92px 92px 26px", gap: 8, padding: "4px 4px 6px", fontSize: 10, fontWeight: 700, letterSpacing: 0.4, color: COLORS.textFaint, textTransform: "uppercase" }}>
          <div>Line item</div><div style={{ textAlign: "right" }}>Estimate</div><div style={{ textAlign: "right" }}>Actual</div><div />
        </div>
        {groups.map((g) => {
          const lines = state.costs.filter((c) => c.group === g);
          const gt = lines.reduce((s, c) => s + c.estimate_cents, 0);
          return (
            <div key={g}>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 4px 3px" }}>
                <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: 0.4, color: ACCENT, textTransform: "uppercase" }}>{g}</span>
                <span style={{ fontSize: 11, fontWeight: 700, color: COLORS.textFaint, fontVariantNumeric: "tabular-nums" }}>{fmtCompact(gt)}</span>
              </div>
              {lines.map((c) => (
                <div key={c.id} style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) 92px 92px 26px", gap: 8, alignItems: "center", padding: "6px 4px", borderBottom: `1px solid ${COLORS.surfaceTint}` }}>
                  <input type="text" value={c.label} onChange={(e) => updRow("costs", c.id, { label: e.target.value })} style={{ ...txt(), fontWeight: 600 }} />
                  <MoneyInput value={c.estimate_cents} onChange={(v) => updRow("costs", c.id, { estimate_cents: v })} />
                  <MoneyInput value={c.actual_cents} onChange={(v) => updRow("costs", c.id, { actual_cents: v })} />
                  <DelBtn onClick={() => delRow("costs", c.id)} />
                </div>
              ))}
            </div>
          );
        })}
        <AddBtn label="Add cost line" onClick={() => addRow("costs", { label: "New cost", group: "Add-ons", estimate_cents: 0, actual_cents: 0, in_basis: true })} />
      </Card>

      <Card title="Tax cost basis" sub={fmtCompact(basis)}>
        <div style={{ fontSize: 12, color: COLORS.textMuted, padding: "4px 2px 12px", lineHeight: 1.5 }}>
          Land plus everything you spend building this home becomes its cost basis — it lowers
          the capital-gains tax when you eventually sell, so keep every receipt. Uncheck anything
          you&apos;re deducting instead of capitalizing (e.g. construction-loan interest).
        </div>
        {basisLines.length === 0 ? (
          <div style={{ fontSize: 12, color: COLORS.textFaint, padding: "0 2px 6px" }}>
            Add estimates or actuals in Costs above and they&apos;ll appear here to include or exclude.
          </div>
        ) : (
          <>
            {basisLines.map((c) => {
              const amt = c.actual_cents || c.estimate_cents || 0;
              const inB = c.in_basis !== false;
              return (
                <div key={c.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "7px 4px", borderBottom: `1px solid ${COLORS.surfaceTint}` }}>
                  <Check done={inB} onClick={() => updRow("costs", c.id, { in_basis: !inB })} />
                  <span style={{ flex: 1, minWidth: 0, fontSize: 13, fontWeight: 600, color: inB ? COLORS.text : COLORS.textFaint, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.label}</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: inB ? COLORS.text : COLORS.textFaint, fontVariantNumeric: "tabular-nums" }}>{fmtCompact(amt)}</span>
                </div>
              );
            })}
            <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 4px 2px" }}>
              <span style={{ fontSize: 12, fontWeight: 800, textTransform: "uppercase", letterSpacing: 0.4, color: ACCENT }}>Total cost basis</span>
              <span style={{ fontSize: 15, fontWeight: 800, color: COLORS.text, fontVariantNumeric: "tabular-nums" }}>{fmtCompact(basis)}</span>
            </div>
          </>
        )}
      </Card>

      <Card title="Construction loan" sub={loan.amount_cents ? `${fmtCompact(drawn)} drawn` : "Track your draw schedule"}>
        <div style={{ display: "flex", gap: 8, padding: "6px 2px 12px" }}>
          <div style={{ flex: 2 }}>
            <span style={{ display: "block", fontSize: 10, fontWeight: 700, color: COLORS.textFaint, textTransform: "uppercase", marginBottom: 4 }}>Loan amount</span>
            <MoneyInput value={loan.amount_cents} onChange={(v) => setLoan({ amount_cents: v })} />
          </div>
          <div style={{ flex: 1 }}>
            <span style={{ display: "block", fontSize: 10, fontWeight: 700, color: COLORS.textFaint, textTransform: "uppercase", marginBottom: 4 }}>Rate %</span>
            <input
              type="number" step="0.01" inputMode="decimal"
              value={loan.rate_bps ? loan.rate_bps / 100 : ""}
              onChange={(e) => setLoan({ rate_bps: Math.round((parseFloat(e.target.value) || 0) * 100) })}
              placeholder="0.00"
              style={{ ...txt(), textAlign: "right" }}
            />
          </div>
        </div>
        {loan.amount_cents > 0 && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(110px, 1fr))", gap: 8, paddingBottom: 12 }}>
            {[
              ["Drawn", fmtCompact(drawn), COLORS.text],
              ["Available", fmtCompact(Math.max(0, loan.amount_cents - drawn)), COLORS.green],
              ["% used", `${Math.round((drawn / loan.amount_cents) * 100)}%`, drawn > loan.amount_cents ? COLORS.red : COLORS.text],
            ].map(([l, v, c]) => (
              <div key={l} style={{ background: COLORS.surfaceTint, borderRadius: 10, padding: "9px 11px" }}>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 0.4, color: COLORS.textFaint, textTransform: "uppercase" }}>{l}</div>
                <div style={{ marginTop: 3, fontSize: 15, fontWeight: 800, color: c, fontVariantNumeric: "tabular-nums" }}>{v}</div>
              </div>
            ))}
          </div>
        )}
        <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) 120px 92px 26px", gap: 8, padding: "2px 4px 6px", fontSize: 10, fontWeight: 700, letterSpacing: 0.4, color: COLORS.textFaint, textTransform: "uppercase" }}>
          <div>Draw</div><div>Date</div><div style={{ textAlign: "right" }}>Amount</div><div />
        </div>
        {draws.map((d) => (
          <div key={d.id} style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) 120px 92px 26px", gap: 8, alignItems: "center", padding: "6px 4px", borderBottom: `1px solid ${COLORS.surfaceTint}` }}>
            <input type="text" value={d.label} onChange={(e) => updRow("draws", d.id, { label: e.target.value })} style={{ ...txt(), fontWeight: 600 }} placeholder="Foundation draw…" />
            <input type="date" value={d.date || ""} onChange={(e) => updRow("draws", d.id, { date: e.target.value || null })} aria-label="Draw date" style={inputStyle()} />
            <MoneyInput value={d.amount_cents} onChange={(v) => updRow("draws", d.id, { amount_cents: v })} />
            <DelBtn onClick={() => delRow("draws", d.id)} />
          </div>
        ))}
        <AddBtn label="Add draw" onClick={() => addRow("draws", { label: "New draw", date: null, amount_cents: 0 })} />
      </Card>
    </>
  );
}

const CO_STATUS_COLOR = { pending: COLORS.amber, approved: COLORS.green, rejected: COLORS.textFaint };

function StatStrip({ items }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: 8, paddingBottom: 12 }}>
      {items.map(([l, v, c]) => (
        <div key={l} style={{ background: COLORS.surfaceTint, borderRadius: 10, padding: "9px 11px" }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 0.4, color: COLORS.textFaint, textTransform: "uppercase" }}>{l}</div>
          <div style={{ marginTop: 3, fontSize: 15, fontWeight: 800, color: c, fontVariantNumeric: "tabular-nums" }}>{v}</div>
        </div>
      ))}
    </div>
  );
}

function ChangeOrderCard({ co, onChange, onDelete }) {
  const [open, setOpen] = useState(false);
  const credit = co.kind === "credit";
  return (
    <div style={{ border: `1px solid ${COLORS.border}`, borderRadius: 12, marginBottom: 10, overflow: "hidden" }}>
      <button onClick={() => setOpen((o) => !o)} style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "11px 12px", background: "transparent", border: "none", cursor: "pointer", fontFamily: FONT, textAlign: "left" }}>
        <Icon d={open ? ICON.chevD : ICON.chevR} size={13} color={COLORS.textFaint} />
        <span style={{ flex: 1, minWidth: 0 }}>
          <span style={{ display: "block", fontSize: 13.5, fontWeight: 700, color: COLORS.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{co.description || "Change order"}</span>
          <span style={{ display: "block", fontSize: 11.5, fontWeight: 700, color: credit ? COLORS.green : COLORS.textMuted }}>
            {credit ? "−" : "+"}{fmtCompact(co.amount_cents || 0)}{co.date ? ` · ${fmtBuildDate(co.date)}` : ""}
          </span>
        </span>
        <span style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.05em", color: CO_STATUS_COLOR[co.status], flexShrink: 0 }}>{co.status}</span>
      </button>
      {open && (
        <div style={{ padding: "2px 14px 14px", display: "grid", gap: 10 }}>
          <input value={co.description} onChange={(e) => onChange({ description: e.target.value })} placeholder="What changed" style={{ ...txt(), fontWeight: 700 }} />
          <input value={co.reason} onChange={(e) => onChange({ reason: e.target.value })} placeholder="Why — reason for the change" style={txt()} />
          <div style={{ display: "flex", gap: 8 }}>
            <select value={co.kind} onChange={(e) => onChange({ kind: e.target.value })} aria-label="Kind" style={{ ...inputStyle(), flex: 1, cursor: "pointer" }}>
              <option value="add">Adds cost</option>
              <option value="credit">Credit back</option>
            </select>
            <div style={{ flex: 1 }}><MoneyInput value={co.amount_cents} onChange={(v) => onChange({ amount_cents: v })} /></div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <input type="date" value={co.date || ""} onChange={(e) => onChange({ date: e.target.value || null })} aria-label="Date" style={{ ...inputStyle(), flex: 1 }} />
            <select value={co.status} onChange={(e) => onChange({ status: e.target.value })} aria-label="Status" style={{ ...inputStyle(), flex: 1, fontWeight: 700, cursor: "pointer" }}>
              <option value="pending">pending</option>
              <option value="approved">approved</option>
              <option value="rejected">rejected</option>
            </select>
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button onClick={onDelete} style={{ ...btn("ghost") }}><Icon d={ICON.x} size={13} /> Delete</button>
          </div>
        </div>
      )}
    </div>
  );
}

function ChangeOrdersSection({ state, addRow, updRow, delRow }) {
  const cos = state.change_orders || [];
  const sgn = (o) => (o.kind === "credit" ? -1 : 1) * (o.amount_cents || 0);
  const approvedNet = cos.filter((o) => o.status === "approved").reduce((s, o) => s + sgn(o), 0);
  const pending = cos.filter((o) => o.status === "pending");
  const pendingNet = pending.reduce((s, o) => s + sgn(o), 0);
  const fmtSgn = (n) => (n > 0 ? "+" : n < 0 ? "−" : "") + fmtCompact(Math.abs(n));
  return (
    <Card title="Change orders" sub={`${cos.length} logged`}>
      <div style={{ fontSize: 12, color: COLORS.textMuted, padding: "4px 2px 12px", lineHeight: 1.5 }}>
        Every change to the contract — the single biggest reason builds blow their budget. Log
        each one and approve it deliberately. Approved orders roll into your revised cost.
      </div>
      <StatStrip items={[
        ["Approved", fmtSgn(approvedNet), approvedNet > 0 ? COLORS.amber : approvedNet < 0 ? COLORS.green : COLORS.text],
        ["Pending", `${pending.length} · ${fmtSgn(pendingNet)}`, COLORS.textMuted],
        ["Logged", String(cos.length), COLORS.text],
      ]} />
      {cos.map((co) => (
        <ChangeOrderCard key={co.id} co={co}
          onChange={(p) => updRow("change_orders", co.id, p)}
          onDelete={() => delRow("change_orders", co.id)} />
      ))}
      <AddBtn label="Add change order" onClick={() => addRow("change_orders", { date: new Date().toISOString().slice(0, 10), description: "New change order", reason: "", amount_cents: 0, kind: "add", status: "pending" })} />
    </Card>
  );
}

const WAIVER_META = {
  not_needed: ["n/a", COLORS.textFaint],
  pending: ["waiver due", COLORS.amber],
  received: ["waiver in", COLORS.green],
};

function PaymentCard({ pay, onChange, onDelete }) {
  const [open, setOpen] = useState(false);
  const [wLabel, wColor] = WAIVER_META[pay.lien_waiver] || WAIVER_META.not_needed;
  return (
    <div style={{ border: `1px solid ${COLORS.border}`, borderRadius: 12, marginBottom: 10, overflow: "hidden" }}>
      <button onClick={() => setOpen((o) => !o)} style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "11px 12px", background: "transparent", border: "none", cursor: "pointer", fontFamily: FONT, textAlign: "left" }}>
        <Icon d={open ? ICON.chevD : ICON.chevR} size={13} color={COLORS.textFaint} />
        <span style={{ flex: 1, minWidth: 0 }}>
          <span style={{ display: "block", fontSize: 13.5, fontWeight: 700, color: COLORS.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{pay.vendor || "Payment"}</span>
          <span style={{ display: "block", fontSize: 11.5, fontWeight: 600, color: COLORS.textMuted }}>
            {fmtCompact(pay.amount_cents || 0)}{pay.date ? ` · ${fmtBuildDate(pay.date)}` : ""}
          </span>
        </span>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 5, flexShrink: 0 }}>
          <span style={{ width: 7, height: 7, borderRadius: "50%", background: wColor }} />
          <span style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.04em", color: wColor }}>{wLabel}</span>
        </span>
      </button>
      {open && (
        <div style={{ padding: "2px 14px 14px", display: "grid", gap: 10 }}>
          <input value={pay.vendor} onChange={(e) => onChange({ vendor: e.target.value })} placeholder="Vendor — who you paid" style={{ ...txt(), fontWeight: 700 }} />
          <input value={pay.description} onChange={(e) => onChange({ description: e.target.value })} placeholder="What it was for" style={txt()} />
          <div style={{ display: "flex", gap: 8 }}>
            <div style={{ flex: 1 }}><MoneyInput value={pay.amount_cents} onChange={(v) => onChange({ amount_cents: v })} /></div>
            <input type="date" value={pay.date || ""} onChange={(e) => onChange({ date: e.target.value || null })} aria-label="Date" style={{ ...inputStyle(), flex: 1 }} />
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <select value={pay.method} onChange={(e) => onChange({ method: e.target.value })} aria-label="Method" style={{ ...inputStyle(), flex: 1, cursor: "pointer" }}>
              {PAY_METHODS.map((m) => <option key={m} value={m}>{m}</option>)}
            </select>
            <select value={pay.lien_waiver} onChange={(e) => onChange({ lien_waiver: e.target.value })} aria-label="Lien waiver" style={{ ...inputStyle(), flex: 1.5, fontWeight: 700, cursor: "pointer" }}>
              <option value="not_needed">Lien waiver — n/a</option>
              <option value="pending">Lien waiver — pending</option>
              <option value="received">Lien waiver — received</option>
            </select>
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button onClick={onDelete} style={{ ...btn("ghost") }}><Icon d={ICON.x} size={13} /> Delete</button>
          </div>
        </div>
      )}
    </div>
  );
}

function PaymentsSection({ state, addRow, updRow, delRow }) {
  const pays = state.payments || [];
  const total = pays.reduce((s, p) => s + (p.amount_cents || 0), 0);
  const waiverDue = pays.filter((p) => p.lien_waiver === "pending");
  const sorted = pays.slice().sort((a, b) => {
    if (!a.date) return 1;
    if (!b.date) return -1;
    return a.date < b.date ? 1 : -1;
  });
  return (
    <Card title="Payments" sub={`${fmtCompact(total)} paid`}>
      <div style={{ fontSize: 12, color: COLORS.textMuted, padding: "4px 2px 12px", lineHeight: 1.5 }}>
        Every dollar out the door. Collect a signed lien waiver with each payment — without one,
        a paid sub or supplier can still put a lien on your finished home.
      </div>
      <StatStrip items={[
        ["Total paid", fmtCompact(total), COLORS.text],
        ["Payments", String(pays.length), COLORS.text],
        ["Waivers due", String(waiverDue.length), waiverDue.length ? COLORS.red : COLORS.green],
      ]} />
      {waiverDue.length > 0 && (
        <div style={{ display: "flex", alignItems: "center", gap: 8, background: "rgba(220,38,38,0.08)", borderRadius: 10, padding: "9px 11px", marginBottom: 12 }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: COLORS.red, flexShrink: 0 }} />
          <span style={{ fontSize: 12, fontWeight: 600, color: COLORS.text }}>
            {waiverDue.length} payment{waiverDue.length > 1 ? "s" : ""} still waiting on a signed lien waiver — chase these down.
          </span>
        </div>
      )}
      {sorted.map((pay) => (
        <PaymentCard key={pay.id} pay={pay}
          onChange={(p) => updRow("payments", pay.id, p)}
          onDelete={() => delRow("payments", pay.id)} />
      ))}
      <AddBtn label="Add payment" onClick={() => addRow("payments", { date: new Date().toISOString().slice(0, 10), vendor: "New payment", description: "", amount_cents: 0, method: "Check", lien_waiver: "pending" })} />
    </Card>
  );
}

function fmtBuildDate(iso) {
  if (!iso) return "";
  const d = new Date(iso + "T00:00:00");
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}
function daysFromToday(iso) {
  const d = new Date(iso + "T00:00:00");
  const t = new Date(); t.setHours(0, 0, 0, 0);
  return Math.round((d.getTime() - t.getTime()) / 86400000);
}

function MilestoneTimeline({ milestones }) {
  if (!milestones.length) return null;
  const dated = milestones.filter((m) => m.target).slice().sort((a, b) => (a.target < b.target ? -1 : 1));
  const undated = milestones.filter((m) => !m.target);
  const rows = [...dated, ...undated];
  const doneCount = milestones.filter((m) => m.done).length;
  const pct = Math.round((doneCount / milestones.length) * 100);
  const nextUp = dated.find((m) => !m.done);
  return (
    <Card title="Timeline" sub={nextUp ? `Next: ${nextUp.label}` : `${doneCount}/${milestones.length} complete`}>
      <div style={{ padding: "4px 2px 16px" }}>
        <div style={{ height: 7, borderRadius: 99, background: COLORS.surfaceTint, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${pct}%`, background: ACCENT, borderRadius: 99, transition: "width .3s ease" }} />
        </div>
        <div style={{ marginTop: 5, fontSize: 11, fontWeight: 700, color: COLORS.textFaint }}>{pct}% complete</div>
      </div>
      {rows.map((m, i) => {
        const last = i === rows.length - 1;
        const overdue = m.target && !m.done && daysFromToday(m.target) < 0;
        const color = m.done ? COLORS.green : overdue ? COLORS.red : ACCENT;
        let chip = "no date";
        if (m.done) chip = "done";
        else if (m.target) {
          const d = daysFromToday(m.target);
          chip = d < 0 ? `${-d}d overdue` : d === 0 ? "today" : `in ${d}d`;
        }
        return (
          <div key={m.id} style={{ display: "flex", gap: 12 }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 16 }}>
              <div style={{ width: 14, height: 14, borderRadius: "50%", flexShrink: 0, marginTop: 2, background: m.done ? color : "#fff", border: `2.5px solid ${color}` }} />
              {!last && <div style={{ flex: 1, width: 2, background: COLORS.border, margin: "3px 0" }} />}
            </div>
            <div style={{ flex: 1, minWidth: 0, paddingBottom: last ? 2 : 16 }}>
              <div style={{ fontSize: 13.5, fontWeight: 700, color: m.done ? COLORS.textMuted : COLORS.text, textDecoration: m.done ? "line-through" : "none" }}>{m.label || "Milestone"}</div>
              <div style={{ marginTop: 2, fontSize: 11.5, fontWeight: 600, color: COLORS.textFaint }}>
                {m.target ? fmtBuildDate(m.target) : "No date set"}
                <span style={{ marginLeft: 8, color, fontWeight: 800 }}>{chip}</span>
              </div>
            </div>
          </div>
        );
      })}
    </Card>
  );
}

function MilestonesSection({ state, addRow, updRow, delRow }) {
  const done = state.milestones.filter((m) => m.done).length;
  return (
    <>
    <MilestoneTimeline milestones={state.milestones} />
    <Card title="Milestones" sub={`${done}/${state.milestones.length} done`}>
      {state.milestones.map((m) => (
        <div key={m.id} style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 4px", borderBottom: `1px solid ${COLORS.surfaceTint}` }}>
          <Check done={m.done} onClick={() => updRow("milestones", m.id, { done: !m.done })} />
          <input
            type="text" value={m.label}
            onChange={(e) => updRow("milestones", m.id, { label: e.target.value })}
            style={{ ...txt(), flex: 1, minWidth: 0, textDecoration: m.done ? "line-through" : "none", opacity: m.done ? 0.55 : 1 }}
          />
          <input type="date" value={m.target || ""} onChange={(e) => updRow("milestones", m.id, { target: e.target.value || null })} style={{ ...inputStyle(), width: 142 }} aria-label="Target date" />
          <DelBtn onClick={() => delRow("milestones", m.id)} />
        </div>
      ))}
      <AddBtn label="Add milestone" onClick={() => addRow("milestones", { label: "New milestone", target: null, done: false })} />
    </Card>
    </>
  );
}

const SEL_STATUS = { open: COLORS.textFaint, decided: COLORS.amber, ordered: COLORS.green };

function SelectionCard({ sel, onChange, onDelete }) {
  const [open, setOpen] = useState(false);
  const dueSoon = sel.deadline && sel.status === "open"
    && (new Date(sel.deadline).getTime() - Date.now()) < 21 * 864e5;
  return (
    <div style={{ border: `1px solid ${dueSoon ? COLORS.red : COLORS.border}`, borderRadius: 12, marginBottom: 10, overflow: "hidden" }}>
      <button
        onClick={() => setOpen((o) => !o)}
        style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "11px 12px", background: "transparent", border: "none", cursor: "pointer", fontFamily: FONT, textAlign: "left" }}
      >
        <Icon d={open ? ICON.chevD : ICON.chevR} size={13} color={COLORS.textFaint} />
        <span style={{ flex: 1, minWidth: 0 }}>
          <span style={{ display: "block", fontSize: 13.5, fontWeight: 700, color: COLORS.text }}>{sel.label || "Selection"}</span>
          {sel.choice && <span style={{ display: "block", fontSize: 11.5, color: COLORS.textMuted, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{sel.choice}</span>}
        </span>
        <span style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.05em", color: SEL_STATUS[sel.status], flexShrink: 0 }}>
          {sel.status}
        </span>
      </button>
      {open && (
        <div style={{ padding: "2px 14px 14px", display: "grid", gap: 10 }}>
          <input value={sel.label} onChange={(e) => onChange({ label: e.target.value })} placeholder="Selection" style={{ ...txt(), fontWeight: 700 }} />
          <input value={sel.choice} onChange={(e) => onChange({ choice: e.target.value })} placeholder="Your pick…" style={txt()} />
          <input value={sel.vendor} onChange={(e) => onChange({ vendor: e.target.value })} placeholder="Vendor" style={txt()} />
          <div style={{ display: "flex", gap: 8 }}>
            <div style={{ flex: 1 }}>
              <span style={{ display: "block", fontSize: 10, fontWeight: 700, color: COLORS.textFaint, textTransform: "uppercase", marginBottom: 4 }}>Allowance</span>
              <MoneyInput value={sel.allowance_cents || 0} onChange={(v) => onChange({ allowance_cents: v })} />
            </div>
            <div style={{ flex: 1 }}>
              <span style={{ display: "block", fontSize: 10, fontWeight: 700, color: COLORS.textFaint, textTransform: "uppercase", marginBottom: 4 }}>Actual</span>
              <MoneyInput value={sel.actual_cents || 0} onChange={(v) => onChange({ actual_cents: v })} />
            </div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <input value={sel.lead_time} onChange={(e) => onChange({ lead_time: e.target.value })} placeholder="Lead time (e.g. 8 weeks)" style={{ ...txt(), flex: 1 }} />
            <input type="date" value={sel.deadline || ""} onChange={(e) => onChange({ deadline: e.target.value || null })} aria-label="Decide-by date" style={{ ...inputStyle(), width: 150 }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <select value={sel.status} onChange={(e) => onChange({ status: e.target.value })} aria-label="Status" style={{ ...inputStyle(), fontWeight: 700, cursor: "pointer" }}>
              <option value="open">open</option>
              <option value="decided">decided</option>
              <option value="ordered">ordered</option>
            </select>
            <button onClick={onDelete} style={{ ...btn("ghost") }}><Icon d={ICON.x} size={13} /> Delete</button>
          </div>
        </div>
      )}
    </div>
  );
}

function SelectionsSection({ state, addRow, updRow, delRow }) {
  const sels = state.selections;
  const allowance = sels.reduce((s, x) => s + (x.allowance_cents || 0), 0);
  const actual = sels.reduce((s, x) => s + (x.actual_cents || 0), 0);
  const openCount = sels.filter((x) => x.status === "open").length;
  return (
    <Card title="Finish selections" sub={`${openCount} still open`}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: 8, padding: "6px 2px 12px" }}>
        {[
          ["Allowances", fmtCompact(allowance), COLORS.text],
          ["Actual / chosen", fmtCompact(actual), COLORS.text],
          [allowance - actual >= 0 ? "Under allowance" : "Over allowance", fmtCompact(Math.abs(allowance - actual)), allowance - actual >= 0 ? COLORS.green : COLORS.red],
        ].map(([l, v, c]) => (
          <div key={l} style={{ background: COLORS.surfaceTint, borderRadius: 10, padding: "9px 11px" }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 0.4, color: COLORS.textFaint, textTransform: "uppercase" }}>{l}</div>
            <div style={{ marginTop: 3, fontSize: 15, fontWeight: 800, color: c, fontVariantNumeric: "tabular-nums" }}>{v}</div>
          </div>
        ))}
      </div>
      {sels.map((sel) => (
        <SelectionCard
          key={sel.id}
          sel={sel}
          onChange={(patch) => updRow("selections", sel.id, patch)}
          onDelete={() => delRow("selections", sel.id)}
        />
      ))}
      <AddBtn label="Add selection" onClick={() => addRow("selections", { label: "New selection", choice: "", status: "open", vendor: "", allowance_cents: 0, actual_cents: 0, lead_time: "", deadline: null })} />
    </Card>
  );
}

function TeamSection({ state, addRow, updRow, delRow }) {
  return (
    <Card title="Team & vendors" sub={`${state.team.length} people`}>
      {state.team.map((t) => (
        <div key={t.id} style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr) minmax(0,1fr) 26px", gap: 8, alignItems: "center", padding: "6px 4px", borderBottom: `1px solid ${COLORS.surfaceTint}` }}>
          <input type="text" value={t.role} onChange={(e) => updRow("team", t.id, { role: e.target.value })} style={{ ...txt(), fontWeight: 600 }} />
          <input type="text" value={t.name} onChange={(e) => updRow("team", t.id, { name: e.target.value })} style={txt()} placeholder="name" />
          <input type="text" value={t.contact} onChange={(e) => updRow("team", t.id, { contact: e.target.value })} style={txt()} placeholder="phone / email" />
          <DelBtn onClick={() => delRow("team", t.id)} />
        </div>
      ))}
      <AddBtn label="Add team member" onClick={() => addRow("team", { role: "New role", name: "", contact: "" })} />
    </Card>
  );
}

function DocumentRow({ doc, onChange, onDelete }) {
  return (
    <div style={{ border: `1px solid ${COLORS.border}`, borderRadius: 12, padding: 12, marginBottom: 10, display: "grid", gap: 8 }}>
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <input value={doc.name} onChange={(e) => onChange({ name: e.target.value })} placeholder="Document name" style={{ ...txt(), flex: 1, fontWeight: 700 }} />
        <select value={doc.category} onChange={(e) => onChange({ category: e.target.value })} aria-label="Category" style={{ ...inputStyle(), width: 150, cursor: "pointer" }}>
          {DOC_CATEGORY_ORDER.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <DelBtn onClick={onDelete} />
      </div>
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <input value={doc.url} onChange={(e) => onChange({ url: e.target.value })} placeholder="Paste a link — Drive, Dropbox, builder portal, county site…" style={{ ...txt(), flex: 1 }} />
        {doc.url ? (
          <a href={doc.url} target="_blank" rel="noopener noreferrer"
            style={{ display: "inline-flex", alignItems: "center", gap: 5, flexShrink: 0, fontSize: 12, fontWeight: 700, color: "#fff", background: ACCENT, padding: "8px 12px", borderRadius: 9, textDecoration: "none", fontFamily: FONT }}>
            Open <Icon d={EXTERNAL_ICON} size={12} color="#fff" />
          </a>
        ) : (
          <span style={{ fontSize: 11, color: COLORS.textFaint, flexShrink: 0, fontWeight: 600 }}>No link yet</span>
        )}
      </div>
    </div>
  );
}

function DocumentsSection({ state, addRow, updRow, delRow }) {
  const docs = state.documents || [];
  const withLink = docs.filter((d) => d.url).length;
  const cats = [...new Set(docs.map((d) => d.category))]
    .sort((a, b) => DOC_CATEGORY_ORDER.indexOf(a) - DOC_CATEGORY_ORDER.indexOf(b));
  return (
    <Card title="Document vault" sub={`${withLink}/${docs.length} linked`}>
      <div style={{ fontSize: 12, color: COLORS.textMuted, padding: "4px 2px 12px", lineHeight: 1.5 }}>
        One home for every plan, permit, contract and warranty. Keep the file wherever it
        lives — Drive, Dropbox, your builder's portal — and paste the link here so it&apos;s never lost.
      </div>
      {cats.map((cat) => {
        const rows = docs.filter((d) => d.category === cat);
        const linked = rows.filter((d) => d.url).length;
        return (
          <div key={cat}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", padding: "10px 4px 6px" }}>
              <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: 0.4, color: ACCENT, textTransform: "uppercase" }}>{cat}</span>
              <span style={{ fontSize: 11, fontWeight: 700, color: COLORS.textFaint }}>{linked}/{rows.length}</span>
            </div>
            {rows.map((d) => (
              <DocumentRow key={d.id} doc={d}
                onChange={(patch) => updRow("documents", d.id, patch)}
                onDelete={() => delRow("documents", d.id)} />
            ))}
          </div>
        );
      })}
      <AddBtn label="Add document" onClick={() => addRow("documents", { name: "New document", category: "Other", url: "" })} />
    </Card>
  );
}

function PhotosSection({ state, addRow, updRow, delRow }) {
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
                <select value={p.phase} onChange={(e) => updRow("photos", p.id, { phase: e.target.value })} aria-label="Phase" style={{ ...inputStyle(), flex: 1, minWidth: 0, cursor: "pointer" }}>
                  {PHOTO_PHASES.map((ph) => <option key={ph} value={ph}>{ph || "Phase…"}</option>)}
                </select>
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

const INSP_STATUS_META = {
  not_scheduled: ["not scheduled", COLORS.textFaint],
  scheduled: ["scheduled", COLORS.amber],
  passed: ["passed", COLORS.green],
  failed: ["failed", COLORS.red],
};

function InspectionCard({ insp, onChange, onDelete }) {
  const [open, setOpen] = useState(false);
  const [sLabel, sColor] = INSP_STATUS_META[insp.status] || INSP_STATUS_META.not_scheduled;
  return (
    <div style={{ border: `1px solid ${insp.status === "failed" ? COLORS.red : COLORS.border}`, borderRadius: 12, marginBottom: 10, overflow: "hidden" }}>
      <button onClick={() => setOpen((o) => !o)} style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "11px 12px", background: "transparent", border: "none", cursor: "pointer", fontFamily: FONT, textAlign: "left" }}>
        <Icon d={open ? ICON.chevD : ICON.chevR} size={13} color={COLORS.textFaint} />
        <span style={{ flex: 1, minWidth: 0 }}>
          <span style={{ display: "block", fontSize: 13.5, fontWeight: 700, color: COLORS.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{insp.name || "Inspection"}</span>
          {insp.date && <span style={{ display: "block", fontSize: 11.5, fontWeight: 600, color: COLORS.textMuted }}>{fmtBuildDate(insp.date)}</span>}
        </span>
        <span style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.04em", color: sColor, flexShrink: 0 }}>{sLabel}</span>
      </button>
      {open && (
        <div style={{ padding: "2px 14px 14px", display: "grid", gap: 10 }}>
          <input value={insp.name} onChange={(e) => onChange({ name: e.target.value })} placeholder="Inspection" style={{ ...txt(), fontWeight: 700 }} />
          <div style={{ display: "flex", gap: 8 }}>
            <input type="date" value={insp.date || ""} onChange={(e) => onChange({ date: e.target.value || null })} aria-label="Date" style={{ ...inputStyle(), flex: 1 }} />
            <select value={insp.status} onChange={(e) => onChange({ status: e.target.value })} aria-label="Status" style={{ ...inputStyle(), flex: 1, fontWeight: 700, cursor: "pointer" }}>
              <option value="not_scheduled">not scheduled</option>
              <option value="scheduled">scheduled</option>
              <option value="passed">passed</option>
              <option value="failed">failed</option>
            </select>
          </div>
          <input value={insp.inspector} onChange={(e) => onChange({ inspector: e.target.value })} placeholder="Inspector / department" style={txt()} />
          <textarea value={insp.notes} onChange={(e) => onChange({ notes: e.target.value })} rows={2} placeholder="Corrections, re-inspection notes…" style={{ ...txt(), resize: "vertical", lineHeight: 1.5 }} />
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button onClick={onDelete} style={{ ...btn("ghost") }}><Icon d={ICON.x} size={13} /> Delete</button>
          </div>
        </div>
      )}
    </div>
  );
}

function InspectionsSection({ state, addRow, updRow, delRow }) {
  const insps = state.inspections || [];
  const passed = insps.filter((i) => i.status === "passed").length;
  const failed = insps.filter((i) => i.status === "failed").length;
  return (
    <Card title="Inspections" sub={`${passed}/${insps.length} passed`}>
      <div style={{ fontSize: 12, color: COLORS.textMuted, padding: "4px 2px 12px", lineHeight: 1.5 }}>
        Municipal sign-offs, in build order. You can&apos;t legally proceed past a failed one —
        log the corrections and re-inspection here.
      </div>
      <StatStrip items={[
        ["Passed", String(passed), COLORS.green],
        ["Failed", String(failed), failed ? COLORS.red : COLORS.text],
        ["Remaining", String(insps.length - passed), COLORS.text],
      ]} />
      {insps.map((insp) => (
        <InspectionCard key={insp.id} insp={insp}
          onChange={(p) => updRow("inspections", insp.id, p)}
          onDelete={() => delRow("inspections", insp.id)} />
      ))}
      <AddBtn label="Add inspection" onClick={() => addRow("inspections", { name: "New inspection", date: null, status: "not_scheduled", inspector: "", notes: "" })} />
    </Card>
  );
}

function PunchListSection({ state, addRow, updRow, delRow }) {
  const items = state.punch_list || [];
  const openCount = items.filter((i) => !i.done).length;
  const rooms = [...new Set(items.map((i) => i.room || "General"))];
  return (
    <Card title="Punch list" sub={`${openCount} open · ${items.length} total`}>
      <div style={{ fontSize: 12, color: COLORS.textMuted, padding: "4px 2px 12px", lineHeight: 1.5 }}>
        Your final-walkthrough defect list. Capture every flaw, room by room — and hold final
        payment until it&apos;s all checked off.
      </div>
      {rooms.map((room) => {
        const rowItems = items.filter((i) => (i.room || "General") === room);
        const rOpen = rowItems.filter((i) => !i.done).length;
        return (
          <div key={room}>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 4px 6px" }}>
              <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: 0.4, color: ACCENT, textTransform: "uppercase" }}>{room}</span>
              <span style={{ fontSize: 11, fontWeight: 700, color: COLORS.textFaint }}>{rOpen} open</span>
            </div>
            {rowItems.map((it) => (
              <div key={it.id} style={{ border: `1px solid ${COLORS.border}`, borderRadius: 12, padding: 10, marginBottom: 8, display: "grid", gap: 8 }}>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <Check done={it.done} onClick={() => updRow("punch_list", it.id, { done: !it.done })} />
                  <input value={it.description} onChange={(e) => updRow("punch_list", it.id, { description: e.target.value })} placeholder="What needs fixing…" style={{ ...txt(), flex: 1, minWidth: 0, textDecoration: it.done ? "line-through" : "none", opacity: it.done ? 0.55 : 1 }} />
                  <DelBtn onClick={() => delRow("punch_list", it.id)} />
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <input value={it.room} onChange={(e) => updRow("punch_list", it.id, { room: e.target.value })} placeholder="Room / area" style={{ ...txt(), flex: 1, minWidth: 0 }} />
                  <input value={it.trade} onChange={(e) => updRow("punch_list", it.id, { trade: e.target.value })} placeholder="Who fixes it" style={{ ...txt(), flex: 1, minWidth: 0 }} />
                </div>
              </div>
            ))}
          </div>
        );
      })}
      {!items.length && (
        <div style={{ textAlign: "center", padding: "6px 0 10px", fontSize: 12, color: COLORS.textFaint }}>
          Empty — the punch list fills up at your walkthrough.
        </div>
      )}
      <AddBtn label="Add punch item" onClick={() => addRow("punch_list", { room: "General", description: "", trade: "", done: false })} />
    </Card>
  );
}

function RfiCard({ rfi, onChange, onDelete }) {
  const [open, setOpen] = useState(false);
  const answered = rfi.status === "answered";
  return (
    <div style={{ border: `1px solid ${COLORS.border}`, borderRadius: 12, marginBottom: 10, overflow: "hidden" }}>
      <button onClick={() => setOpen((o) => !o)} style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "11px 12px", background: "transparent", border: "none", cursor: "pointer", fontFamily: FONT, textAlign: "left" }}>
        <Icon d={open ? ICON.chevD : ICON.chevR} size={13} color={COLORS.textFaint} />
        <span style={{ flex: 1, minWidth: 0 }}>
          <span style={{ display: "block", fontSize: 13.5, fontWeight: 700, color: COLORS.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{rfi.question || "Open question"}</span>
          {rfi.asked_of && <span style={{ display: "block", fontSize: 11.5, fontWeight: 600, color: COLORS.textMuted }}>For: {rfi.asked_of}</span>}
        </span>
        <span style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.04em", color: answered ? COLORS.green : COLORS.amber, flexShrink: 0 }}>{rfi.status}</span>
      </button>
      {open && (
        <div style={{ padding: "2px 14px 14px", display: "grid", gap: 10 }}>
          <textarea value={rfi.question} onChange={(e) => onChange({ question: e.target.value })} rows={2} placeholder="The question…" style={{ ...txt(), resize: "vertical", lineHeight: 1.5, fontWeight: 600 }} />
          <div style={{ display: "flex", gap: 8 }}>
            <input value={rfi.asked_of} onChange={(e) => onChange({ asked_of: e.target.value })} placeholder="Asked of — architect, builder…" style={{ ...txt(), flex: 1 }} />
            <input type="date" value={rfi.date || ""} onChange={(e) => onChange({ date: e.target.value || null })} aria-label="Date asked" style={{ ...inputStyle(), width: 150 }} />
          </div>
          <textarea value={rfi.answer} onChange={(e) => onChange({ answer: e.target.value })} rows={2} placeholder="The answer, once you have it…" style={{ ...txt(), resize: "vertical", lineHeight: 1.5 }} />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <select value={rfi.status} onChange={(e) => onChange({ status: e.target.value })} aria-label="Status" style={{ ...inputStyle(), fontWeight: 700, cursor: "pointer" }}>
              <option value="open">open</option>
              <option value="answered">answered</option>
            </select>
            <button onClick={onDelete} style={{ ...btn("ghost") }}><Icon d={ICON.x} size={13} /> Delete</button>
          </div>
        </div>
      )}
    </div>
  );
}

function DecisionsSection({ state, addRow, updRow, delRow }) {
  const rfis = state.rfis || [];
  const openCount = rfis.filter((r) => r.status === "open").length;
  return (
    <Card title="Decisions & questions" sub={`${openCount} open`}>
      <div style={{ fontSize: 12, color: COLORS.textMuted, padding: "4px 2px 12px", lineHeight: 1.5 }}>
        Every open question for your architect or builder — and the answer once you get it.
        Nothing falls through the cracks.
      </div>
      {rfis.map((rfi) => (
        <RfiCard key={rfi.id} rfi={rfi}
          onChange={(p) => updRow("rfis", rfi.id, p)}
          onDelete={() => delRow("rfis", rfi.id)} />
      ))}
      {!rfis.length && (
        <div style={{ textAlign: "center", padding: "6px 0 10px", fontSize: 12, color: COLORS.textFaint }}>
          No open questions logged yet.
        </div>
      )}
      <AddBtn label="Add a question" onClick={() => addRow("rfis", { question: "", asked_of: "", answer: "", status: "open", date: new Date().toISOString().slice(0, 10) })} />
    </Card>
  );
}

function WarrantyCard({ wr, onChange, onDelete }) {
  const [open, setOpen] = useState(false);
  let chip = "no expiry";
  let chipColor = COLORS.textFaint;
  if (wr.expires) {
    const d = daysFromToday(wr.expires);
    if (d < 0) { chip = "expired"; chipColor = COLORS.red; }
    else if (d < 60) { chip = `${d}d left`; chipColor = COLORS.amber; }
    else { chip = fmtBuildDate(wr.expires); chipColor = COLORS.green; }
  }
  return (
    <div style={{ border: `1px solid ${COLORS.border}`, borderRadius: 12, marginBottom: 10, overflow: "hidden" }}>
      <button onClick={() => setOpen((o) => !o)} style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "11px 12px", background: "transparent", border: "none", cursor: "pointer", fontFamily: FONT, textAlign: "left" }}>
        <Icon d={open ? ICON.chevD : ICON.chevR} size={13} color={COLORS.textFaint} />
        <span style={{ flex: 1, minWidth: 0, fontSize: 13.5, fontWeight: 700, color: COLORS.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{wr.item || "Warranty"}</span>
        <span style={{ fontSize: 10.5, fontWeight: 800, color: chipColor, flexShrink: 0 }}>{chip}</span>
      </button>
      {open && (
        <div style={{ padding: "2px 14px 14px", display: "grid", gap: 10 }}>
          <input value={wr.item} onChange={(e) => onChange({ item: e.target.value })} placeholder="What's covered" style={{ ...txt(), fontWeight: 700 }} />
          <div style={{ display: "flex", gap: 8 }}>
            <input value={wr.provider} onChange={(e) => onChange({ provider: e.target.value })} placeholder="Provider" style={{ ...txt(), flex: 1 }} />
            <input type="date" value={wr.expires || ""} onChange={(e) => onChange({ expires: e.target.value || null })} aria-label="Expires" style={{ ...inputStyle(), width: 150 }} />
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <input value={wr.url} onChange={(e) => onChange({ url: e.target.value })} placeholder="Link to the warranty document" style={{ ...txt(), flex: 1 }} />
            {wr.url && (
              <a href={wr.url} target="_blank" rel="noopener noreferrer"
                style={{ display: "inline-flex", alignItems: "center", gap: 5, flexShrink: 0, fontSize: 12, fontWeight: 700, color: "#fff", background: ACCENT, padding: "8px 12px", borderRadius: 9, textDecoration: "none", fontFamily: FONT }}>
                Open <Icon d={EXTERNAL_ICON} size={12} color="#fff" />
              </a>
            )}
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button onClick={onDelete} style={{ ...btn("ghost") }}><Icon d={ICON.x} size={13} /> Delete</button>
          </div>
        </div>
      )}
    </div>
  );
}

function AsBuiltSection({ state, addRow, updRow, delRow }) {
  const ab = state.as_built || [];
  const wrs = state.warranties || [];
  return (
    <>
      <Card title="As-built reference" sub={`${ab.length} details`}>
        <div style={{ fontSize: 12, color: COLORS.textMuted, padding: "4px 2px 12px", lineHeight: 1.5 }}>
          The details you&apos;ll want years from now — paint codes, filter sizes, shut-off
          locations. Fill them in as you go.
        </div>
        {ab.map((d) => (
          <div key={d.id} style={{ display: "flex", gap: 8, alignItems: "center", padding: "6px 4px", borderBottom: `1px solid ${COLORS.surfaceTint}` }}>
            <input value={d.label} onChange={(e) => updRow("as_built", d.id, { label: e.target.value })} placeholder="Detail" style={{ ...txt(), flex: 1, minWidth: 0, fontWeight: 600 }} />
            <input value={d.value} onChange={(e) => updRow("as_built", d.id, { value: e.target.value })} placeholder="e.g. SW 7008 Alabaster" style={{ ...txt(), flex: 1.3, minWidth: 0 }} />
            <DelBtn onClick={() => delRow("as_built", d.id)} />
          </div>
        ))}
        <AddBtn label="Add detail" onClick={() => addRow("as_built", { label: "New detail", value: "" })} />
      </Card>
      <Card title="Warranties" sub={`${wrs.length} tracked`}>
        <div style={{ fontSize: 12, color: COLORS.textMuted, padding: "4px 2px 12px", lineHeight: 1.5 }}>
          Every warranty on the home, with its expiration. Watch the builder&apos;s workmanship
          warranty especially — know the deadline before it lapses.
        </div>
        {wrs.map((wr) => (
          <WarrantyCard key={wr.id} wr={wr}
            onChange={(p) => updRow("warranties", wr.id, p)}
            onDelete={() => delRow("warranties", wr.id)} />
        ))}
        <AddBtn label="Add warranty" onClick={() => addRow("warranties", { item: "New warranty", provider: "", expires: null, url: "" })} />
      </Card>
    </>
  );
}

function EnergySection({ state, addRow, updRow, delRow }) {
  const metrics = state.energy || [];
  const cap = { display: "block", fontSize: 10, fontWeight: 700, color: COLORS.textFaint, textTransform: "uppercase", marginBottom: 4 };
  return (
    <Card title="Energy & commissioning" sub={`${metrics.length} metrics`}>
      <div style={{ fontSize: 12, color: COLORS.textMuted, padding: "4px 2px 12px", lineHeight: 1.5 }}>
        Your performance scorecard — HERS, blower-door, AeroBarrier, ERV commissioning. Record
        the target and the verified result side by side.
      </div>
      {metrics.map((m) => (
        <div key={m.id} style={{ border: `1px solid ${COLORS.border}`, borderRadius: 12, padding: 10, marginBottom: 8, display: "grid", gap: 8 }}>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <input value={m.label} onChange={(e) => updRow("energy", m.id, { label: e.target.value })} placeholder="Metric" style={{ ...txt(), flex: 1, minWidth: 0, fontWeight: 700 }} />
            <DelBtn onClick={() => delRow("energy", m.id)} />
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <div style={{ flex: 1 }}>
              <span style={cap}>Target</span>
              <input value={m.target} onChange={(e) => updRow("energy", m.id, { target: e.target.value })} placeholder="goal" style={txt()} />
            </div>
            <div style={{ flex: 1 }}>
              <span style={cap}>Verified result</span>
              <input value={m.value} onChange={(e) => updRow("energy", m.id, { value: e.target.value })} placeholder="measured" style={txt()} />
            </div>
          </div>
        </div>
      ))}
      <AddBtn label="Add metric" onClick={() => addRow("energy", { label: "New metric", value: "", target: "" })} />
    </Card>
  );
}

function BriefSection({ state }) {
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

// ── Inspiration boards ───────────────────────────────────────────────

const PIN_RE = /^https?:\/\/([a-z0-9-]+\.)?pinterest\.[a-z.]+\//i;

async function uploadImage(file) {
  const fd = new FormData();
  fd.append("file", file);
  const res = await fetch("/admin/build/upload", { method: "POST", body: fd });
  if (!res.ok) {
    let msg = "Upload failed.";
    try { msg = (await res.json()).error || msg; } catch { /* ignore */ }
    throw new Error(msg);
  }
  return (await res.json()).url;
}

// Embeds a live public Pinterest board via Pinterest's own widget.
// React owns only the empty wrapper; the widget DOM is set manually so
// Pinterest can transform it without fighting React's reconciler.
function PinterestEmbed({ url }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || !PIN_RE.test(url || "")) return;
    el.innerHTML =
      `<a data-pin-do="embedBoard" data-pin-board-width="540" ` +
      `data-pin-scale-height="320" data-pin-scale-width="110" ` +
      `href="${(url || "").replace(/"/g, "")}"> </a>`;
    const build = () => { try { if (window.PinUtils) window.PinUtils.build(el); } catch { /* ignore */ } };
    if (window.PinUtils) { build(); return; }
    let s = document.getElementById("pinit-js");
    if (!s) {
      s = document.createElement("script");
      s.id = "pinit-js";
      s.src = "https://assets.pinterest.com/js/pinit.js";
      s.async = true;
      s.onload = build;
      document.body.appendChild(s);
    } else {
      s.addEventListener("load", build);
      build();
    }
  }, [url]);
  if (!PIN_RE.test(url || "")) return null;
  return <div ref={ref} style={{ overflowX: "auto", margin: "12px 0 4px", WebkitOverflowScrolling: "touch" }} />;
}

function Board({ board, onChange, onDelete }) {
  const [adding, setAdding] = useState(false);
  const [urlDraft, setUrlDraft] = useState("");
  const [uploading, setUploading] = useState(0);
  const [dragOver, setDragOver] = useState(false);
  const [err, setErr] = useState("");
  const fileRef = useRef(null);
  const pinValid = PIN_RE.test(board.pinterest_url || "");

  const handleFiles = async (files) => {
    const list = [...files].filter((f) => f.type.startsWith("image/"));
    if (list.length === 0) return;
    setErr("");
    setUploading((n) => n + list.length);
    const added = [];
    for (const f of list) {
      try {
        const url = await uploadImage(f);
        added.push({ id: genId(), kind: "image", url, note: "" });
      } catch (e) {
        setErr(e instanceof Error ? e.message : "Upload failed.");
      } finally {
        setUploading((n) => n - 1);
      }
    }
    if (added.length) onChange({ items: [...board.items, ...added] });
  };

  const addUrl = () => {
    const u = urlDraft.trim();
    if (!u) return;
    const isImg = /\.(jpe?g|png|webp|gif|avif)(\?|#|$)/i.test(u);
    onChange({ items: [...board.items, { id: genId(), kind: isImg ? "image" : "link", url: u, note: "" }] });
    setUrlDraft("");
    setAdding(false);
  };
  const delItem = (id) => onChange({ items: board.items.filter((x) => x.id !== id) });

  return (
    <section
      style={{ ...STYLES.card, padding: 0, overflow: "hidden", marginBottom: 14, outline: dragOver ? `2px dashed ${COLORS.accent}` : "none" }}
      onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files); }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 14px 10px", borderBottom: `1px solid ${COLORS.surfaceTint}` }}>
        <input
          type="text"
          value={board.name}
          onChange={(e) => onChange({ name: e.target.value })}
          placeholder="Board name"
          style={{ ...inputStyle(), flex: 1, fontWeight: 800, fontSize: 14 }}
        />
        <DelBtn onClick={onDelete} />
      </div>
      <div style={{ padding: "10px 14px 14px" }}>
        <input
          type="text"
          value={board.pinterest_url}
          onChange={(e) => onChange({ pinterest_url: e.target.value })}
          placeholder="Paste a public Pinterest board link to mirror it…"
          style={{ ...inputStyle(), width: "100%", boxSizing: "border-box", fontWeight: 600 }}
        />
        {board.pinterest_url && !pinValid && (
          <div style={{ marginTop: 5, fontSize: 11.5, color: COLORS.textFaint }}>
            That doesn&apos;t look like a Pinterest board URL (pinterest.com/you/board/).
          </div>
        )}
        {pinValid && <PinterestEmbed url={board.pinterest_url} />}

        {board.items.length > 0 && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))", gap: 8, marginTop: 12 }}>
            {board.items.map((it) => (
              <div key={it.id} style={{ position: "relative", borderRadius: 10, overflow: "hidden", border: `1px solid ${COLORS.border}`, aspectRatio: "1 / 1", background: COLORS.surfaceTint }}>
                {it.kind === "image" ? (
                  <img src={it.url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                ) : (
                  <a
                    href={it.url} target="_blank" rel="noreferrer"
                    style={{ display: "flex", flexDirection: "column", gap: 5, alignItems: "center", justifyContent: "center", height: "100%", padding: 8, textDecoration: "none", color: COLORS.textMuted }}
                  >
                    <Icon d="M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1 M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1" size={18} />
                    <span style={{ fontSize: 10.5, fontWeight: 600, textAlign: "center", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "100%" }}>
                      {(() => { try { return new URL(it.url).hostname.replace("www.", ""); } catch { return "link"; } })()}
                    </span>
                  </a>
                )}
                <button
                  onClick={() => delItem(it.id)}
                  aria-label="Remove"
                  style={{ position: "absolute", top: 4, right: 4, width: 22, height: 22, borderRadius: 6, border: "none", cursor: "pointer", background: "rgba(15,23,41,0.62)", color: "#fff", display: "grid", placeItems: "center" }}
                >
                  <Icon d={ICON.x} size={11} />
                </button>
              </div>
            ))}
          </div>
        )}

        {uploading > 0 && (
          <div style={{ marginTop: 10, fontSize: 12, fontWeight: 700, color: COLORS.accent }}>Uploading {uploading}…</div>
        )}
        {err && <div style={{ marginTop: 8, fontSize: 12, fontWeight: 600, color: COLORS.red }}>{err}</div>}

        {adding ? (
          <div style={{ marginTop: 10, display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
            <button onClick={() => fileRef.current && fileRef.current.click()} style={{ ...btn("ghost") }}>
              <Icon d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4 M17 8l-5-5-5 5 M12 3v12" size={14} />
              Upload images
            </button>
            <input
              type="text"
              value={urlDraft}
              onChange={(e) => setUrlDraft(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") addUrl(); }}
              placeholder="…or paste an image / link URL"
              style={{ ...inputStyle(), flex: 1, minWidth: 150, fontWeight: 600 }}
            />
            <button onClick={addUrl} style={{ ...btn("primary") }}>Add</button>
            <button onClick={() => { setAdding(false); setUrlDraft(""); }} style={{ ...btn("ghost") }}>Cancel</button>
          </div>
        ) : (
          <button onClick={() => setAdding(true)} style={{ ...btn("ghost"), marginTop: 10 }}>
            <Icon d={["M12 5v14", "M5 12h14"]} size={13} />
            Add images or links
          </button>
        )}
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          multiple
          style={{ display: "none" }}
          onChange={(e) => { handleFiles(e.target.files); e.target.value = ""; }}
        />
      </div>
    </section>
  );
}

function InspirationSection({ state, addRow, updRow, delRow }) {
  return (
    <div>
      <div style={{ fontSize: 12.5, color: COLORS.textMuted, padding: "2px 2px 12px", lineHeight: 1.5 }}>
        Paste a public Pinterest board link to mirror it live, drag in your own screenshots and
        photos, or paste image / link URLs. Organize by room or theme.
      </div>
      {state.boards.map((b) => (
        <Board
          key={b.id}
          board={b}
          onChange={(patch) => updRow("boards", b.id, patch)}
          onDelete={() => delRow("boards", b.id)}
        />
      ))}
      <AddBtn label="Add a board" onClick={() => addRow("boards", { name: "New board", pinterest_url: "", items: [] })} />
    </div>
  );
}

// ── Reference library ────────────────────────────────────────────────

function ReferencesSection({ state, addRow, updRow, delRow }) {
  const [filter, setFilter] = useState("all");
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState({ url: "", title: "", tag: "", note: "" });

  const refs = state.references || [];
  const tags = [...new Set(refs.map((r) => r.tag).filter(Boolean))];
  const groups = filter === "all"
    ? [
        ...tags.map((t) => [t, refs.filter((r) => r.tag === t)]),
        ...(refs.some((r) => !r.tag) ? [["Untagged", refs.filter((r) => !r.tag)]] : []),
      ]
    : [[filter, refs.filter((r) => r.tag === filter)]];

  const domain = (u) => { try { return new URL(u).hostname.replace("www.", ""); } catch { return u; } };

  const submitNew = () => {
    if (!draft.url.trim()) return;
    addRow("references", {
      url: draft.url.trim(),
      title: draft.title.trim() || draft.url.trim(),
      tag: draft.tag.trim() || "Other",
      note: draft.note.trim(),
    });
    setDraft({ url: "", title: "", tag: "", note: "" });
    setAdding(false);
  };

  const refRow = (r) => (
    <div key={r.id} style={{ border: `1px solid ${COLORS.border}`, borderRadius: 12, padding: "10px 12px", marginBottom: 8 }}>
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <input
          value={r.title}
          onChange={(e) => updRow("references", r.id, { title: e.target.value })}
          placeholder="Title"
          style={{ ...txt(), flex: 1, fontWeight: 700 }}
        />
        <a
          href={r.url} target="_blank" rel="noreferrer" aria-label="Open link"
          style={{ width: 30, height: 30, borderRadius: 8, border: `1px solid ${COLORS.border}`, display: "grid", placeItems: "center", color: ACCENT, flexShrink: 0 }}
        >
          <Icon d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6 M15 3h6v6 M10 14L21 3" size={13} />
        </a>
        <DelBtn onClick={() => delRow("references", r.id)} />
      </div>
      <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
        <input
          value={r.tag}
          onChange={(e) => updRow("references", r.id, { tag: e.target.value })}
          placeholder="Tag"
          list="ref-tags"
          style={{ ...txt(), flex: "0 0 130px" }}
        />
        <input
          value={r.note}
          onChange={(e) => updRow("references", r.id, { note: e.target.value })}
          placeholder="Note"
          style={{ ...txt(), flex: 1 }}
        />
      </div>
      <div style={{ marginTop: 6, fontSize: 11, color: COLORS.textFaint, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
        {domain(r.url)}
      </div>
    </div>
  );

  return (
    <Card title="Reference library" sub={`${refs.length} links`}>
      <datalist id="ref-tags">{tags.map((t) => <option key={t} value={t} />)}</datalist>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", padding: "8px 2px 12px" }}>
        {["all", ...tags].map((t) => {
          const on = filter === t;
          return (
            <button
              key={t}
              onClick={() => setFilter(t)}
              style={{
                padding: "6px 11px", borderRadius: 100, cursor: "pointer", fontFamily: FONT,
                fontSize: 12, fontWeight: 700, whiteSpace: "nowrap",
                border: `1px solid ${on ? ACCENT : COLORS.border}`,
                background: on ? ACCENT : COLORS.surface,
                color: on ? "#fff" : COLORS.textMuted,
              }}
            >
              {t === "all" ? "All" : t}
            </button>
          );
        })}
      </div>
      {groups.map(([tag, list]) => (list.length === 0 ? null : (
        <div key={tag}>
          {filter === "all" && (
            <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 0.4, color: ACCENT, textTransform: "uppercase", padding: "8px 2px 6px" }}>
              {tag} · {list.length}
            </div>
          )}
          {list.map(refRow)}
        </div>
      )))}
      {adding ? (
        <div style={{ border: `1px solid ${COLORS.border}`, borderRadius: 12, padding: 12, marginTop: 6, display: "grid", gap: 8 }}>
          <input value={draft.url} onChange={(e) => setDraft({ ...draft, url: e.target.value })} placeholder="URL" style={txt()} />
          <input value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} placeholder="Title" style={txt()} />
          <div style={{ display: "flex", gap: 8 }}>
            <input value={draft.tag} onChange={(e) => setDraft({ ...draft, tag: e.target.value })} placeholder="Tag" list="ref-tags" style={{ ...txt(), flex: "0 0 130px" }} />
            <input value={draft.note} onChange={(e) => setDraft({ ...draft, note: e.target.value })} placeholder="Note" style={{ ...txt(), flex: 1 }} />
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            <button onClick={submitNew} style={{ ...btn("primary") }}>Add link</button>
            <button onClick={() => { setAdding(false); setDraft({ url: "", title: "", tag: "", note: "" }); }} style={{ ...btn("ghost") }}>Cancel</button>
          </div>
        </div>
      ) : (
        <AddBtn label="Add a reference" onClick={() => setAdding(true)} />
      )}
    </Card>
  );
}

// ── Materials & colors ───────────────────────────────────────────────

function PaletteSection({ state, addRow, updRow, delRow }) {
  const palette = state.palette || [];
  return (
    <Card title="Materials & colors" sub={`${palette.length} swatches`}>
      <div style={{ fontSize: 12, color: COLORS.textMuted, padding: "4px 2px 12px", lineHeight: 1.5 }}>
        Your finish palette — tap a swatch to set its color. Hand this to the architect and builder
        so everyone&apos;s working from the same materials.
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 10 }}>
        {palette.map((s) => (
          <div key={s.id} style={{ border: `1px solid ${COLORS.border}`, borderRadius: 12, overflow: "hidden", background: COLORS.surface }}>
            <input
              type="color"
              value={/^#[0-9a-f]{6}$/i.test(s.color || "") ? s.color : "#cccccc"}
              onChange={(e) => updRow("palette", s.id, { color: e.target.value })}
              aria-label="Swatch color"
              style={{ width: "100%", height: 84, border: "none", padding: 0, cursor: "pointer", display: "block" }}
            />
            <div style={{ padding: "8px 10px 10px" }}>
              <input
                value={s.name} onChange={(e) => updRow("palette", s.id, { name: e.target.value })}
                placeholder="Name"
                style={{ ...inputStyle(), width: "100%", boxSizing: "border-box", fontWeight: 800, padding: "6px 8px" }}
              />
              <input
                value={s.material} onChange={(e) => updRow("palette", s.id, { material: e.target.value })}
                placeholder="Material"
                style={{ ...inputStyle(), width: "100%", boxSizing: "border-box", marginTop: 6, padding: "6px 8px", fontWeight: 600 }}
              />
              <input
                value={s.note} onChange={(e) => updRow("palette", s.id, { note: e.target.value })}
                placeholder="Where it's used"
                style={{ ...inputStyle(), width: "100%", boxSizing: "border-box", marginTop: 6, padding: "6px 8px", fontSize: 12 }}
              />
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: COLORS.textFaint, fontFamily: "monospace" }}>{s.color}</span>
                <DelBtn onClick={() => delRow("palette", s.id)} />
              </div>
            </div>
          </div>
        ))}
      </div>
      <AddBtn label="Add a swatch" onClick={() => addRow("palette", { name: "New swatch", color: "#cccccc", material: "", note: "" })} />
    </Card>
  );
}

// ── Shell ────────────────────────────────────────────────────────────

export default function BuildClient({ initialState }) {
  const [state, setState] = useState(initialState);
  const [section, setSection] = useState("overview");
  const [, startTransition] = useTransition();
  const [saved, setSaved] = useState(true);
  const isMobile = useIsMobile();
  const saveTimer = useRef(null);

  const persist = useCallback((next) => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    setSaved(false);
    saveTimer.current = setTimeout(() => {
      startTransition(async () => {
        const res = await saveBuildStateAction(next);
        setSaved(!!res.ok);
      });
    }, 500);
  }, []);

  const update = useCallback((updater) => {
    setState((prev) => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      persist(next);
      return next;
    });
  }, [persist]);

  const setField = useCallback((k, v) => update((s) => ({ ...s, [k]: v })), [update]);
  const addRow = useCallback((k, item) => update((s) => ({ ...s, [k]: [...s[k], { id: genId(), ...item }] })), [update]);
  const updRow = useCallback((k, id, patch) => update((s) => ({ ...s, [k]: s[k].map((x) => (x.id === id ? { ...x, ...patch } : x)) })), [update]);
  const delRow = useCallback((k, id) => update((s) => ({ ...s, [k]: s[k].filter((x) => x.id !== id) })), [update]);

  const helpers = { state, setField, addRow, updRow, delRow };
  const view = useMemo(() => {
    switch (section) {
      case "inspiration": return <InspirationSection {...helpers} />;
      case "references": return <ReferencesSection {...helpers} />;
      case "palette": return <PaletteSection {...helpers} />;
      case "wants": return <WantsSection {...helpers} />;
      case "rooms": return <RoomsSection {...helpers} />;
      case "costs": return <CostsSection {...helpers} />;
      case "changeorders": return <ChangeOrdersSection {...helpers} />;
      case "payments": return <PaymentsSection {...helpers} />;
      case "milestones": return <MilestonesSection {...helpers} />;
      case "inspections": return <InspectionsSection {...helpers} />;
      case "selections": return <SelectionsSection {...helpers} />;
      case "decisions": return <DecisionsSection {...helpers} />;
      case "team": return <TeamSection {...helpers} />;
      case "documents": return <DocumentsSection {...helpers} />;
      case "photos": return <PhotosSection {...helpers} />;
      case "punchlist": return <PunchListSection {...helpers} />;
      case "asbuilt": return <AsBuiltSection {...helpers} />;
      case "energy": return <EnergySection {...helpers} />;
      case "brief": return <BriefSection state={state} />;
      default: return <OverviewSection state={state} setField={setField} onJump={setSection} />;
    }
  }, [section, state]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div data-bb-theme="light" style={{ display: "flex", minHeight: "100vh", background: COLORS.bg, fontFamily: FONT }}>
      <style dangerouslySetInnerHTML={{ __html: themeStylesheet() }} />
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          .build-chrome { display: none !important; }
          .build-main { padding: 0 !important; }
        }
        @media (max-width: 540px) {
          input[type=number], input[type=text], input[type=date], textarea, select { font-size: 16px !important; }
        }
      ` }} />

      {!isMobile && (
        <aside className="build-chrome" style={{
          width: 232, flexShrink: 0, position: "sticky", top: 0, alignSelf: "flex-start",
          height: "100vh", overflowY: "auto", background: COLORS.surface,
          borderRight: `1px solid ${COLORS.border}`, display: "flex", flexDirection: "column",
        }}>
          <div style={{ padding: "20px 20px 14px", borderBottom: `1px solid ${COLORS.surfaceTint}` }}>
            <a href="/admin/budget" style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, fontWeight: 600, color: COLORS.textFaint, textDecoration: "none", textTransform: "uppercase", letterSpacing: "0.1em" }}>
              <Icon d={ICON.chevL} size={12} /> Admin
            </a>
            <div style={{ marginTop: 6, fontSize: 22, fontWeight: 800, letterSpacing: "-0.025em" }}>Build</div>
            <div style={{ marginTop: 2, fontSize: 11, color: COLORS.textFaint, fontWeight: 600 }}>
              {saved ? "All changes saved" : "Saving…"}
            </div>
          </div>
          <nav style={{ padding: 12, display: "flex", flexDirection: "column", gap: 2 }}>
            {SECTIONS.map((s) => {
              const on = section === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => setSection(s.id)}
                  style={{
                    display: "flex", alignItems: "center", gap: 10, padding: "10px 12px",
                    borderRadius: 10, border: "none", cursor: "pointer", textAlign: "left",
                    fontFamily: FONT, fontSize: 13.5, fontWeight: on ? 700 : 600,
                    background: on ? ACCENT_SOFT : "transparent",
                    color: on ? ACCENT : COLORS.textMuted,
                  }}
                >
                  <Icon d={s.icon} size={15} />
                  {s.label}
                </button>
              );
            })}
          </nav>
        </aside>
      )}

      <main className="build-main" style={{ flex: 1, minWidth: 0, padding: isMobile ? "0 0 24px" : "24px 28px" }}>
        {isMobile && (
          <div className="build-chrome" style={{ position: "sticky", top: 0, zIndex: 10, background: COLORS.surface, borderBottom: `1px solid ${COLORS.border}` }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 14px 8px" }}>
              <a href="/admin/budget" style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, fontWeight: 700, color: COLORS.textMuted, textDecoration: "none" }}>
                <Icon d={ICON.chevL} size={13} /> Admin
              </a>
              <span style={{ fontSize: 16, fontWeight: 800 }}>Build</span>
              <span style={{ fontSize: 10, fontWeight: 700, color: COLORS.textFaint }}>{saved ? "Saved" : "Saving…"}</span>
            </div>
            <div style={{ display: "flex", gap: 6, overflowX: "auto", padding: "0 12px 10px", WebkitOverflowScrolling: "touch" }}>
              {SECTIONS.map((s) => {
                const on = section === s.id;
                return (
                  <button
                    key={s.id}
                    onClick={() => setSection(s.id)}
                    style={{
                      flexShrink: 0, padding: "8px 12px", borderRadius: 100, border: "none", cursor: "pointer",
                      fontFamily: FONT, fontSize: 12.5, fontWeight: 700, whiteSpace: "nowrap",
                      background: on ? ACCENT : COLORS.surfaceTint,
                      color: on ? "#fff" : COLORS.textMuted,
                    }}
                  >
                    {s.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}
        <div style={{ maxWidth: 760, margin: "0 auto", padding: isMobile ? "14px 12px 0" : 0 }}>
          {view}
        </div>
      </main>
    </div>
  );
}
