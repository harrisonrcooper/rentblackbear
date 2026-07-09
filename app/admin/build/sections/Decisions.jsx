"use client";

// The decisions LOG — choices already made, kept as a timeline so that in
// eighteen months anyone can still answer "why did we do it that way?".
//
// A sibling section (id "decisions", "Open Questions") tracks the questions
// still open. This one is the opposite end: the answers, dated, with the
// reasoning that will otherwise evaporate. That is why a row missing its `why`
// is flagged in amber — a log without reasons is just a list.

import { useEffect, useMemo, useRef, useState } from "react";

import {
  COLORS, FONT, SERIF, Icon, ICON, txt, Chip, StatStrip, AddBtn, DelBtn,
} from "../ui";
import DetailDrawer from "../DetailDrawer";
import {
  groupByMonth, incompleteCount, isComplete, searchDecisions,
} from "@/lib/build/decisions";

const ARRAY_KEY = "decisions_log";

// A fresh row: everything blank, undated. The drawer opens on it immediately so
// the log entry is filled in while the decision is still fresh in memory.
function blankDecision() {
  return { title: "", decided_on: null, decision: "", why: "", alternatives: "", url: "" };
}

function hasReason(d) {
  return typeof d.why === "string" && d.why.trim() !== "";
}

// Render a stored ISO day as mm/dd/yyyy. Purely lexical — no Date parsing — so
// the day is never shifted across a boundary by the viewer's timezone (the
// shared fmtBuildDate emits short-month "Jul 4, 2026", which the house style
// forbids). Non-ISO input falls through unchanged rather than crashing.
function fmtDecisionDate(iso) {
  if (typeof iso !== "string") return "";
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso);
  return m ? `${m[2]}/${m[3]}/${m[1]}` : iso;
}

export default function DecisionsSection({ state, addRow, updRow, delRow }) {
  const rows = state[ARRAY_KEY] || [];

  const [query, setQuery] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [expanded, setExpanded] = useState(() => new Set());

  // addRow generates the id internally, so it can't hand one back. Flag intent,
  // then open the drawer on the row that lands last once state re-renders.
  const openNewOnRender = useRef(false);
  useEffect(() => {
    if (openNewOnRender.current && rows.length) {
      openNewOnRender.current = false;
      setEditingId(rows[rows.length - 1].id);
    }
  }, [rows.length]);

  function addDecision() {
    openNewOnRender.current = true;
    addRow(ARRAY_KEY, blankDecision());
  }

  function toggleExpand(id) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }

  const filtered = useMemo(() => searchDecisions(rows, query), [rows, query]);
  const groups = useMemo(() => groupByMonth(filtered), [filtered]);
  const missingReasons = useMemo(
    () => rows.filter((d) => !hasReason(d)).length,
    [rows],
  );
  const incomplete = useMemo(() => incompleteCount(rows), [rows]);

  const editing = editingId ? rows.find((d) => d.id === editingId) : null;
  // A row deleted from under an open drawer must not strand it open.
  useEffect(() => {
    if (editingId && !rows.some((d) => d.id === editingId)) setEditingId(null);
  }, [editingId, rows]);

  if (rows.length === 0) {
    return (
      <>
        <EmptyState onAdd={addDecision} />
        {editing && (
          <DecisionDrawer
            decision={editing}
            onClose={() => setEditingId(null)}
            onChange={(patch) => updRow(ARRAY_KEY, editing.id, patch)}
          />
        )}
      </>
    );
  }

  return (
    <>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap", margin: "6px 0 14px" }}>
        <div>
          <h2 style={{ fontFamily: SERIF, fontSize: 22, fontWeight: 600, letterSpacing: "-0.015em", margin: 0 }}>
            Decisions log
          </h2>
          <p style={{ margin: "3px 0 0", fontSize: 12.5, color: COLORS.textMuted, maxWidth: 460 }}>
            Choices already made, and — the point of the log — why.
          </p>
        </div>
        <AddBtn label="Log a decision" onClick={addDecision} />
      </div>

      <StatStrip
        items={[
          ["Logged", String(rows.length)],
          ["Missing a reason", String(missingReasons), missingReasons > 0 ? COLORS.amber : COLORS.green],
          ["Incomplete", String(incomplete), incomplete > 0 ? COLORS.amber : COLORS.green],
        ]}
      />

      <div style={{ position: "relative", marginBottom: 4 }}>
        <span style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", color: COLORS.textFaint, lineHeight: 0 }}>
          <Icon d="M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16z M21 21l-4.35-4.35" size={15} />
        </span>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search decisions, reasons, alternatives"
          style={{ ...txt(), paddingLeft: 34 }}
        />
      </div>

      {filtered.length === 0 ? (
        <div style={{ padding: "34px 16px", textAlign: "center", color: COLORS.textMuted, fontSize: 13 }}>
          No decisions match &ldquo;{query.trim()}&rdquo;.
        </div>
      ) : (
        <div style={{ marginTop: 16 }}>
          {groups.map((group) => (
            <div key={group.label} style={{ marginBottom: 22 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 10 }}>
                <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: COLORS.textFaint }}>
                  {group.label}
                </span>
                <span style={{ flex: 1, height: 1, background: COLORS.border }} />
                <span style={{ fontSize: 11, fontWeight: 600, color: COLORS.textFaint }}>
                  {group.items.length}
                </span>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {group.items.map((d) => (
                  <DecisionCard
                    key={d.id}
                    decision={d}
                    open={expanded.has(d.id)}
                    onToggle={() => toggleExpand(d.id)}
                    onEdit={() => setEditingId(d.id)}
                    onDelete={() => delRow(ARRAY_KEY, d.id)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {editing && (
        <DecisionDrawer
          decision={editing}
          onClose={() => setEditingId(null)}
          onChange={(patch) => updRow(ARRAY_KEY, editing.id, patch)}
        />
      )}
    </>
  );
}

function DecisionCard({ decision, open, onToggle, onEdit, onDelete }) {
  const complete = isComplete(decision);
  const reasoned = hasReason(decision);
  const title = decision.title?.trim() || "Untitled decision";
  const choice = decision.decision?.trim();

  return (
    <div
      data-item-id={decision.id}
      style={{
        background: COLORS.surface, border: `1px solid ${COLORS.border}`,
        borderRadius: 12, padding: "13px 14px",
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <span style={{ fontSize: 14, fontWeight: 700, letterSpacing: "-0.01em", color: COLORS.text }}>
              {title}
            </span>
            {decision.decided_on ? (
              <Chip tone="neutral">
                <Icon d={ICON.calendar} size={12} />
                {fmtDecisionDate(decision.decided_on)}
              </Chip>
            ) : (
              <Chip tone="neutral">No date</Chip>
            )}
            {!reasoned && <Chip tone="amber">No reason recorded</Chip>}
          </div>

          {choice ? (
            <p style={{ margin: "7px 0 0", fontSize: 13, color: COLORS.text, lineHeight: 1.5 }}>
              {choice}
            </p>
          ) : (
            <p style={{ margin: "7px 0 0", fontSize: 13, color: COLORS.textFaint, fontStyle: "italic" }}>
              No choice recorded yet.
            </p>
          )}
        </div>

        <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
          <IconBtn label="Edit" onClick={onEdit} d={ICON.edit} />
          <DelBtn onClick={onDelete} />
        </div>
      </div>

      <button
        onClick={onToggle}
        aria-expanded={open}
        style={{
          display: "inline-flex", alignItems: "center", gap: 6, marginTop: 10,
          padding: "6px 10px", borderRadius: 8, cursor: "pointer", fontFamily: FONT,
          fontSize: 12, fontWeight: 600, color: COLORS.textMuted,
          background: COLORS.surfaceTint, border: `1px solid ${COLORS.border}`,
        }}
      >
        <Icon
          d={ICON.chevR}
          size={13}
          style={{ transform: open ? "rotate(90deg)" : "none", transition: "transform 0.14s ease" }}
        />
        Why we chose this &amp; what we rejected
      </button>

      {open && (
        <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 12 }}>
          <Detail label="Why we chose this">
            {reasoned ? (
              <span>{decision.why.trim()}</span>
            ) : (
              <span style={{ color: COLORS.amber }}>
                No reason recorded. In eighteen months, this choice will be a mystery — add the why.
              </span>
            )}
          </Detail>
          <Detail label="What we rejected">
            {decision.alternatives?.trim() ? (
              <span>{decision.alternatives.trim()}</span>
            ) : (
              <span style={{ color: COLORS.textFaint, fontStyle: "italic" }}>Nothing recorded.</span>
            )}
          </Detail>
          {decision.url?.trim() && (
            <a
              href={decision.url.trim()}
              target="_blank"
              rel="noreferrer"
              style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12.5, fontWeight: 600, color: COLORS.accent, textDecoration: "none", width: "fit-content" }}
            >
              <Icon d={ICON.link2} size={13} />
              Reference link
            </a>
          )}
          {!complete && (
            <span style={{ fontSize: 11.5, color: COLORS.textFaint }}>
              An incomplete entry records the choice but not the reasoning behind it.
            </span>
          )}
        </div>
      )}
    </div>
  );
}

function Detail({ label, children }) {
  return (
    <div>
      <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", color: COLORS.textFaint, marginBottom: 4 }}>
        {label}
      </div>
      <div style={{ fontSize: 13, color: COLORS.text, lineHeight: 1.55, whiteSpace: "pre-wrap" }}>
        {children}
      </div>
    </div>
  );
}

function IconBtn({ label, onClick, d }) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      style={{
        width: 26, height: 26, borderRadius: 7, flexShrink: 0, cursor: "pointer",
        border: `1px solid ${COLORS.border}`, background: COLORS.surface, color: COLORS.textMuted,
        display: "grid", placeItems: "center",
      }}
      onMouseEnter={(e) => { e.currentTarget.style.background = COLORS.surfaceTint; e.currentTarget.style.color = COLORS.text; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = COLORS.surface; e.currentTarget.style.color = COLORS.textMuted; }}
    >
      <Icon d={d} size={13} />
    </button>
  );
}

function DecisionDrawer({ decision, onClose, onChange }) {
  const complete = isComplete(decision);
  return (
    <DetailDrawer
      open
      onClose={onClose}
      kind="Decision"
      title={decision.title?.trim() || "New decision"}
      tabs={[]}
      footer={
        <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: complete ? COLORS.green : COLORS.amber }}>
          <Icon d={complete ? ICON.check : "M12 9v4 M12 17h.01 M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"} size={15} />
          {complete ? "Choice and reason both recorded." : "Add the reason to complete this entry."}
        </div>
      }
    >
      <DrawerField label="What was decided">
        <input
          value={decision.title || ""}
          onChange={(e) => onChange({ title: e.target.value })}
          placeholder="e.g. Roof material"
          style={txt()}
        />
      </DrawerField>

      <DrawerField label="Date decided">
        <input
          type="date"
          value={decision.decided_on || ""}
          onChange={(e) => onChange({ decided_on: e.target.value || null })}
          style={txt()}
        />
      </DrawerField>

      <DrawerField label="The choice">
        <textarea
          value={decision.decision || ""}
          onChange={(e) => onChange({ decision: e.target.value })}
          placeholder="What we went with"
          rows={2}
          style={{ ...txt(), resize: "vertical", minHeight: 56 }}
        />
      </DrawerField>

      <DrawerField label="Why we chose this">
        <textarea
          value={decision.why || ""}
          onChange={(e) => onChange({ why: e.target.value })}
          placeholder="The reason — the one thing you'll want back later"
          rows={3}
          style={{ ...txt(), resize: "vertical", minHeight: 76 }}
        />
      </DrawerField>

      <DrawerField label="What we rejected, and why">
        <textarea
          value={decision.alternatives || ""}
          onChange={(e) => onChange({ alternatives: e.target.value })}
          placeholder="The options considered and passed over"
          rows={3}
          style={{ ...txt(), resize: "vertical", minHeight: 76 }}
        />
      </DrawerField>

      <DrawerField label="Reference link">
        <input
          value={decision.url || ""}
          onChange={(e) => onChange({ url: e.target.value })}
          placeholder="https://"
          inputMode="url"
          style={txt()}
        />
      </DrawerField>
    </DetailDrawer>
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

function EmptyState({ onAdd }) {
  return (
    <div
      style={{
        textAlign: "center", padding: "56px 22px", maxWidth: 480, margin: "24px auto 0",
        background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 16,
      }}
    >
      <div style={{ width: 46, height: 46, borderRadius: 12, margin: "0 auto", display: "grid", placeItems: "center", background: COLORS.surfaceTint, color: COLORS.accent }}>
        <Icon d="M9 11l3 3 8-8 M20 12v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h9" size={22} />
      </div>
      <h2 style={{ fontFamily: SERIF, fontSize: 21, fontWeight: 600, letterSpacing: "-0.015em", margin: "16px 0 0" }}>
        The record of choices made
      </h2>
      <p style={{ margin: "9px auto 0", fontSize: 13.5, color: COLORS.textMuted, lineHeight: 1.6, maxWidth: 400 }}>
        Open questions live in the questions log. This is the other end: the
        answers, dated, with the reasoning behind them. A decision without its
        why is worth little in eighteen months, when nobody remembers what the
        other options even were.
      </p>
      <div style={{ marginTop: 18, display: "flex", justifyContent: "center" }}>
        <AddBtn label="Log your first decision" onClick={onAdd} />
      </div>
    </div>
  );
}
