"use client";

// Finish selections owed to the builder.
//
// The one job of this screen: make the overdue decisions impossible to miss.
// The builder can't order a floor you haven't picked, so a decision that has
// slipped past its date is the thing that stops the house. Those float to the
// top and turn red; everything settled sinks to the bottom and goes quiet.
//
// A collapsed row is a single tap into the one shared drawer that edits every
// field — the same idiom Rooms, Decisions and Quotes use. The urgency never
// hides behind that tap: an overdue or due-soon selection shouts from the face
// of the row in red, because that warning is the whole reason the screen exists.

import { useEffect, useRef, useState } from "react";

import {
  COLORS, FONT, btn, Icon, ICON, fmtUsd, fmtCompact, fmtBuildDate,
  daysFromToday, Card, txt, MoneyInput, AddBtn, AutoTextarea, SelectPill, Chip,
  StatStrip, EmptyState, SELECTION_STATUSES,
  DateField} from "../ui";
import DetailDrawer from "../DetailDrawer";

const ARRAY_KEY = "selections";

const NEW_SELECTION = {
  label: "New selection", choice: "", status: "open", vendor: "",
  allowance_cents: 0, actual_cents: 0, lead_time: "", deadline: null, notes: "",
};

// How many days out we still call a decision "due soon" rather than just
// "later". Three weeks is roughly one shopping weekend plus a lead-time buffer.
const DUE_SOON_DAYS = 21;

/**
 * The urgency a selection carries: a tone, a human label, a sort weight (lower =
 * more urgent = higher in the list, so list order and colour never disagree),
 * and the raw day count. Only OPEN selections can be overdue — once a choice is
 * decided or ordered, the clock is irrelevant.
 *
 * Note: `tone` here is the URGENCY tone, not the status tone. "Decided" returns
 * amber only so the list can weight it; the collapsed row reads urgency off
 * `days`, never off this tone, so a settled decision never shouts.
 */
function urgencyOf(sel) {
  if (sel.status === "ordered") return { tone: "green", label: "Ordered", weight: 500, days: null };
  if (sel.status === "decided") return { tone: "amber", label: "Decided", weight: 400, days: null };

  // status === "open"
  if (!sel.deadline) return { tone: "neutral", label: "No date set", weight: 300, days: null };

  const days = daysFromToday(sel.deadline);
  if (days < 0) {
    const n = -days;
    return { tone: "red", label: `Overdue ${n} ${n === 1 ? "day" : "days"}`, weight: -1000 + days, days };
  }
  if (days === 0) return { tone: "red", label: "Due today", weight: 0, days };
  if (days <= DUE_SOON_DAYS) return { tone: "amber", label: `Due in ${days} ${days === 1 ? "day" : "days"}`, weight: 100 + days, days };
  return { tone: "neutral", label: `Due ${fmtBuildDate(sel.deadline)}`, weight: 200 + days, days };
}

/** The plain status chip — Open, Decided, Ordered — independent of urgency. */
function statusOf(sel) {
  return SELECTION_STATUSES.find((s) => s.value === sel.status) || SELECTION_STATUSES[0];
}

/**
 * Budget variance, computed so the user never subtracts. Null until an actual
 * price is in — before that there is nothing to compare against.
 */
function varianceOf(sel) {
  const spent = sel.actual_cents || 0;
  if (spent <= 0) return null;
  const diff = (sel.allowance_cents || 0) - spent;
  if (diff > 0) return { tone: COLORS.green, text: `Under allowance by ${fmtUsd(diff)}` };
  if (diff < 0) return { tone: COLORS.red, text: `Over allowance by ${fmtUsd(-diff)}` };
  return { tone: COLORS.textMuted, text: "Right on allowance" };
}

// The whole collapsed row is one tap into the drawer. It shows what the builder
// is waiting on — the label and the chosen option — with the status chip on the
// right. When an OPEN selection is overdue or due soon, that urgency gets its
// own loud line right where the eye already is: red for overdue, amber for due
// soon. That warning is the reason this screen exists; it never waits for a tap.
function SelectionCard({ sel, u, onOpen }) {
  const overdue = u.tone === "red";
  const st = statusOf(sel);
  const warn = sel.status === "open" && u.days != null && (u.tone === "red" || u.tone === "amber");

  return (
    <button
      data-item-id={sel.id}
      onClick={onOpen}
      style={{
        textAlign: "left", width: "100%", minWidth: 0, cursor: "pointer", fontFamily: FONT,
        display: "flex", flexDirection: "column", gap: 6, marginBottom: 10,
        background: COLORS.surface, borderRadius: 12, padding: "12px 13px",
        border: `1px solid ${overdue ? COLORS.red : COLORS.border}`,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ flex: 1, minWidth: 0, fontSize: 14, fontWeight: 700, letterSpacing: "-0.01em", color: COLORS.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {sel.label?.trim() || "Selection"}
        </span>
        {sel.notes?.trim() && <Icon d={ICON.fileText} size={13} color={COLORS.textFaint} />}
        <Chip tone={st.tone}>{st.label}</Chip>
      </div>

      <span style={{ fontSize: 12.5, color: sel.choice?.trim() ? COLORS.textMuted : COLORS.textFaint, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
        {sel.choice?.trim() || "No pick yet — tap to decide"}
      </span>

      {warn && (
        <div style={{
          display: "flex", alignItems: "center", gap: 7, marginTop: 2,
          padding: "6px 9px", borderRadius: 8,
          background: overdue ? COLORS.redBg : COLORS.amberBg,
          border: `1px solid ${overdue ? COLORS.red : COLORS.amber}`,
        }}>
          <Icon d={ICON.clock} size={14} color={overdue ? COLORS.red : COLORS.amber} />
          <span style={{ fontSize: 12, fontWeight: 700, color: overdue ? COLORS.red : COLORS.amber }}>
            {overdue ? `${u.label} — the builder is waiting on you` : u.label}
          </span>
        </div>
      )}
    </button>
  );
}

function DrawerField({ label, children }) {
  return (
    <label style={{ display: "block", marginBottom: 16 }}>
      <span style={{ display: "block", fontSize: 10.5, fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", color: COLORS.textFaint, marginBottom: 6 }}>
        {label}
      </span>
      {children}
    </label>
  );
}

// Every field for one selection, in the shared slide-in drawer. Single pane —
// no tabs — because a selection is a short record, not a file with sections.
function SelectionDrawer({ sel, onClose, onChange, onDelete }) {
  const u = urgencyOf(sel);
  const variance = varianceOf(sel);
  const showDeadlineNote = sel.status === "open" && sel.deadline && u.days != null;

  return (
    <DetailDrawer
      open
      onClose={onClose}
      kind="Selection"
      title={sel.label?.trim() || "New selection"}
      tabs={[]}
      footer={
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
          <SelectPill value={sel.status} options={SELECTION_STATUSES} onChange={(status) => onChange({ status })} ariaLabel="Decision status" minWidth={116} />
          <button onClick={onDelete} style={btn("ghost")}>
            <Icon d={ICON.x} size={13} /> Delete selection
          </button>
        </div>
      }
    >
      <DrawerField label="What is being chosen">
        <input
          value={sel.label || ""}
          onChange={(e) => onChange({ label: e.target.value })}
          placeholder="Flooring, tile, fixtures, paint…"
          style={{ ...txt(), fontWeight: 700 }}
        />
      </DrawerField>

      <DrawerField label="Your pick">
        <input
          value={sel.choice || ""}
          onChange={(e) => onChange({ choice: e.target.value })}
          placeholder="Make, model, colour"
          style={txt()}
        />
      </DrawerField>

      <DrawerField label="Vendor">
        <input
          value={sel.vendor || ""}
          onChange={(e) => onChange({ vendor: e.target.value })}
          placeholder="Where it comes from"
          style={txt()}
        />
      </DrawerField>

      <div style={{ display: "flex", gap: 10 }}>
        <DrawerField label="Allowance">
          <MoneyInput value={sel.allowance_cents || 0} onChange={(v) => onChange({ allowance_cents: v })} />
        </DrawerField>
        <DrawerField label="Actual price">
          <MoneyInput value={sel.actual_cents || 0} onChange={(v) => onChange({ actual_cents: v })} />
        </DrawerField>
      </div>
      {variance && (
        <div style={{ marginTop: -6, marginBottom: 16, fontSize: 12.5, fontWeight: 700, color: variance.tone, fontVariantNumeric: "tabular-nums" }}>
          {variance.text}
        </div>
      )}

      <DrawerField label="Lead time">
        <input
          value={sel.lead_time || ""}
          onChange={(e) => onChange({ lead_time: e.target.value })}
          placeholder="For example, 8 weeks"
          style={txt()}
        />
      </DrawerField>

      <DrawerField label="Decide by this date">
        <DateField value={sel.deadline} onChange={(v) => onChange({ deadline: v })} ariaLabel="Decide by this date" />
        {showDeadlineNote && (
          <div style={{ marginTop: 6, fontSize: 12, fontWeight: 700, color: u.tone === "red" ? COLORS.red : u.tone === "amber" ? COLORS.amber : COLORS.textFaint }}>
            {u.label}
          </div>
        )}
      </DrawerField>

      <DrawerField label="Spec notes">
        <AutoTextarea
          value={sel.notes || ""}
          onChange={(v) => onChange({ notes: v })}
          minRows={4}
          placeholder="The requirements behind this choice — what the plans call for."
        />
      </DrawerField>
    </DetailDrawer>
  );
}

export default function SelectionsSection({ state, addRow, updRow, delRow }) {
  const sels = state[ARRAY_KEY] || [];
  const [editingId, setEditingId] = useState(null);

  // addRow generates the id internally, so it can't hand one back. Flag intent,
  // then open the drawer on the row that lands last once state re-renders — the
  // fresh selection, so its details get captured while the thought is fresh.
  const openNewOnRender = useRef(false);
  useEffect(() => {
    if (openNewOnRender.current && sels.length) {
      openNewOnRender.current = false;
      setEditingId(sels[sels.length - 1].id);
    }
  }, [sels.length]);

  function add() {
    openNewOnRender.current = true;
    addRow(ARRAY_KEY, { ...NEW_SELECTION });
  }

  const editing = editingId ? sels.find((s) => s.id === editingId) : null;
  // A row deleted from under an open drawer must not strand it open.
  useEffect(() => {
    if (editingId && !sels.some((s) => s.id === editingId)) setEditingId(null);
  }, [editingId, sels]);

  const drawer = editing && (
    <SelectionDrawer
      sel={editing}
      onClose={() => setEditingId(null)}
      onChange={(patch) => updRow(ARRAY_KEY, editing.id, patch)}
      onDelete={() => { delRow(ARRAY_KEY, editing.id); setEditingId(null); }}
    />
  );

  if (sels.length === 0) {
    return (
      <>
        <EmptyState
          icon={ICON.edit}
          title="Pick the finishes before the builder needs them"
          action={<AddBtn label="Add your first selection" onClick={add} />}
        >
          These are the finishes the builder is waiting on — flooring, tile, fixtures, paint.
          Give each one a decide-by date and the overdue ones rise to the top and turn red, so
          nothing ever gets chosen for you.
        </EmptyState>
        {drawer}
      </>
    );
  }

  const allowance = sels.reduce((s, x) => s + (x.allowance_cents || 0), 0);
  const actual = sels.reduce((s, x) => s + (x.actual_cents || 0), 0);
  const balance = allowance - actual;

  const rows = sels
    .map((sel) => ({ sel, u: urgencyOf(sel) }))
    .sort((a, b) => a.u.weight - b.u.weight);

  const openCount = sels.filter((x) => x.status === "open").length;
  const overdueCount = rows.filter((r) => r.u.tone === "red").length;
  const dueSoonCount = rows.filter((r) => r.u.label.startsWith("Due in")).length;

  // One priority banner, never two — red shouts over amber.
  const banner = overdueCount > 0
    ? { tone: COLORS.red, bg: COLORS.redBg, text: `${overdueCount} ${overdueCount === 1 ? "decision is" : "decisions are"} overdue — the builder is waiting on you.` }
    : dueSoonCount > 0
      ? { tone: COLORS.amber, bg: COLORS.amberBg, text: `${dueSoonCount} ${dueSoonCount === 1 ? "decision is" : "decisions are"} due soon.` }
      : null;

  return (
    <>
      <Card title="Finish selections" sub={`${openCount} still open`}>
        {banner && (
          <div style={{ display: "flex", alignItems: "center", gap: 9, padding: "10px 12px", marginBottom: 12, borderRadius: 10, background: banner.bg, border: `1px solid ${banner.tone}` }}>
            <Icon d={ICON.clock} size={16} color={banner.tone} />
            <span style={{ fontSize: 12.5, fontWeight: 700, color: banner.tone }}>{banner.text}</span>
          </div>
        )}

        <StatStrip items={[
          ["Allowances", fmtCompact(allowance), COLORS.text],
          ["Actual so far", fmtCompact(actual), COLORS.text],
          [balance >= 0 ? "Under allowance" : "Over allowance", fmtCompact(Math.abs(balance)), balance >= 0 ? COLORS.green : COLORS.red],
        ]} />

        {rows.map(({ sel, u }) => (
          <SelectionCard key={sel.id} sel={sel} u={u} onOpen={() => setEditingId(sel.id)} />
        ))}

        <AddBtn label="Add selection" onClick={add} />
      </Card>

      {drawer}
    </>
  );
}
