"use client";

// Finish selections owed to the builder.
//
// The one job of this screen: make the overdue decisions impossible to miss.
// The builder can't order a floor you haven't picked, so a decision that has
// slipped past its date is the thing that stops the house. Those float to the
// top and turn red; everything settled sinks to the bottom and goes quiet.

import { useState } from "react";

import {
  COLORS, FONT, inputStyle, btn, Icon, ICON, fmtUsd, fmtCompact, fmtBuildDate,
  daysFromToday, Card, txt, MoneyInput, AddBtn, AutoTextarea, SelectPill, Chip,
  StatStrip, SELECTION_STATUSES,
} from "../ui";

const NEW_SELECTION = {
  label: "New selection", choice: "", status: "open", vendor: "",
  allowance_cents: 0, actual_cents: 0, lead_time: "", deadline: null,
};

// How many days out we still call a decision "due soon" rather than just
// "later". Three weeks is roughly one shopping weekend plus a lead-time buffer.
const DUE_SOON_DAYS = 21;

/**
 * The single chip a selection wears. It carries both status and urgency so the
 * user reads one signal, not two. Only OPEN selections can be overdue — once a
 * choice is decided or ordered, the clock is irrelevant.
 *
 * Also returns a sort weight (lower = more urgent = higher in the list) so the
 * list order and the chip colour never disagree.
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

function LabeledMoney({ label, value, onChange }) {
  return (
    <div style={{ flex: 1, minWidth: 0 }}>
      <span style={{ display: "block", fontSize: 10, fontWeight: 700, color: COLORS.textFaint, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>{label}</span>
      <MoneyInput value={value || 0} onChange={onChange} />
    </div>
  );
}

function SelectionCard({ sel, onChange, onDelete }) {
  const [open, setOpen] = useState(false);
  const u = urgencyOf(sel);
  const overdue = u.tone === "red";

  // Budget variance — computed so the user never subtracts. Only shown once an
  // actual price is in; before that there is nothing to compare against.
  const spent = sel.actual_cents || 0;
  const allow = sel.allowance_cents || 0;
  const diff = allow - spent;
  const variance = spent > 0
    ? (diff > 0
      ? { tone: COLORS.green, text: `Under allowance by ${fmtUsd(diff)}` }
      : diff < 0
        ? { tone: COLORS.red, text: `Over allowance by ${fmtUsd(-diff)}` }
        : { tone: COLORS.textMuted, text: "Right on allowance" })
    : null;

  return (
    <div style={{ border: `1px solid ${overdue ? COLORS.red : COLORS.border}`, borderRadius: 12, marginBottom: 10, overflow: "hidden", background: COLORS.surface }}>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "11px 12px", background: "transparent", border: "none", cursor: "pointer", fontFamily: FONT, textAlign: "left" }}
      >
        <Icon d={open ? ICON.chevD : ICON.chevR} size={13} color={COLORS.textFaint} />
        <span style={{ flex: 1, minWidth: 0 }}>
          <span style={{ display: "block", fontSize: 13.5, fontWeight: 700, color: COLORS.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{sel.label || "Selection"}</span>
          <span style={{ display: "block", fontSize: 11.5, color: sel.choice ? COLORS.textMuted : COLORS.textFaint, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {sel.choice || "No pick yet — tap to decide"}
          </span>
        </span>
        {sel.notes && <Icon d={ICON.fileText} size={13} color={COLORS.textFaint} />}
        <Chip tone={u.tone}>{u.label}</Chip>
      </button>

      {open && (
        <div style={{ padding: "2px 14px 14px", display: "grid", gap: 10 }}>
          <input value={sel.label} onChange={(e) => onChange({ label: e.target.value })} placeholder="What is being chosen (flooring, tile, fixtures…)" style={{ ...txt(), fontWeight: 700 }} />
          <input value={sel.choice} onChange={(e) => onChange({ choice: e.target.value })} placeholder="Your pick — make, model, colour" style={txt()} />
          <input value={sel.vendor} onChange={(e) => onChange({ vendor: e.target.value })} placeholder="Where it comes from (vendor)" style={txt()} />

          <div style={{ display: "flex", gap: 8 }}>
            <LabeledMoney label="Allowance" value={sel.allowance_cents} onChange={(v) => onChange({ allowance_cents: v })} />
            <LabeledMoney label="Actual price" value={sel.actual_cents} onChange={(v) => onChange({ actual_cents: v })} />
          </div>
          {variance && (
            <div style={{ fontSize: 12, fontWeight: 700, color: variance.tone, fontVariantNumeric: "tabular-nums" }}>{variance.text}</div>
          )}

          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <input value={sel.lead_time} onChange={(e) => onChange({ lead_time: e.target.value })} placeholder="Lead time (for example, 8 weeks)" style={{ ...txt(), flex: 1, minWidth: 140 }} />
            <div>
              <input type="date" value={sel.deadline || ""} onChange={(e) => onChange({ deadline: e.target.value || null })} aria-label="Decide by this date" style={{ ...inputStyle(), width: 150 }} />
              {sel.deadline && sel.status === "open" && u.days != null && (
                <div style={{ fontSize: 10.5, fontWeight: 700, color: u.tone === "red" ? COLORS.red : u.tone === "amber" ? COLORS.amber : COLORS.textFaint, marginTop: 4, textAlign: "right" }}>
                  {u.label}
                </div>
              )}
            </div>
          </div>

          <div>
            <span style={{ display: "block", fontSize: 10, fontWeight: 700, color: COLORS.textFaint, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>Spec notes</span>
            <AutoTextarea
              value={sel.notes}
              onChange={(v) => onChange({ notes: v })}
              minRows={4}
              placeholder="The requirements behind this choice — what the plans call for."
            />
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
            <SelectPill value={sel.status} options={SELECTION_STATUSES} onChange={(status) => onChange({ status })} ariaLabel="Decision status" minWidth={110} />
            <button onClick={onDelete} style={btn("ghost")}><Icon d={ICON.x} size={13} /> Delete</button>
          </div>
        </div>
      )}
    </div>
  );
}

function EmptyState({ onAdd }) {
  return (
    <Card title="Finish selections" sub="Nothing yet">
      <div style={{ textAlign: "center", padding: "34px 20px 30px", display: "grid", gap: 12, justifyItems: "center" }}>
        <div style={{ width: 46, height: 46, borderRadius: 12, background: COLORS.surfaceTint, display: "grid", placeItems: "center" }}>
          <Icon d={ICON.edit} size={22} color={COLORS.textFaint} />
        </div>
        <div style={{ fontSize: 15, fontWeight: 800, color: COLORS.text }}>No finish selections yet</div>
        <p style={{ fontSize: 13, lineHeight: 1.5, color: COLORS.textMuted, maxWidth: 340, margin: 0 }}>
          These are the finishes the builder needs you to pick — flooring, tile, fixtures, paint. Add them here with a decide-by date so nothing gets chosen for you.
        </p>
        <AddBtn label="Add your first selection" onClick={onAdd} />
      </div>
    </Card>
  );
}

export default function SelectionsSection({ state, addRow, updRow, delRow }) {
  const sels = state.selections;
  const add = () => addRow("selections", { ...NEW_SELECTION });

  if (sels.length === 0) return <EmptyState onAdd={add} />;

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

      {rows.map(({ sel }) => (
        <SelectionCard
          key={sel.id}
          sel={sel}
          onChange={(patch) => updRow("selections", sel.id, patch)}
          onDelete={() => delRow("selections", sel.id)}
        />
      ))}

      <AddBtn label="Add selection" onClick={add} />
    </Card>
  );
}
