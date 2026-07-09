"use client";

// The decisions LOG — choices already made, kept as a timeline so that in
// eighteen months anyone can still answer "why did we do it that way?".
//
// The point of the log is the WHY, so the why is shown on the face of every
// card, not hidden behind a toggle. A card is a single tap into the one drawer
// that edits everything (same idiom as Rooms). An entry with no reason is
// flagged amber, because a log without reasons is just a list.

import { useEffect, useMemo, useRef, useState } from "react";

import {
  COLORS, FONT, SERIF, btn, Icon, ICON, txt, Chip, StatStrip, AddBtn,
  AutoTextarea, fmtBuildDate, todayIso
, DateField} from "../ui";
import DetailDrawer from "../DetailDrawer";
import {
  groupByMonth, isComplete, searchDecisions,
} from "@/lib/build/decisions";

const ARRAY_KEY = "decisions_log";

// The log gets a search box only once it's long enough to hunt through. Below
// this, every entry is already on screen — a search box would be pure clutter.
const SEARCH_THRESHOLD = 6;

// Today, in the user's own local day, as ISO YYYY-MM-DD. A decision logged now
// was almost certainly decided today, so we pre-fill it and he never has to
// think about the date — he only changes it for an older decision.

// A fresh row: dated today, everything else blank. The drawer opens on it
// immediately so the reasoning is captured while the decision is still fresh.
function blankDecision() {
  return { title: "", decided_on: todayIso(), decision: "", why: "", alternatives: "", url: "" };
}

function hasReason(d) {
  return typeof d.why === "string" && d.why.trim() !== "";
}

export default function DecisionsSection({ state, addRow, updRow, delRow }) {
  const rows = state[ARRAY_KEY] || [];

  const [query, setQuery] = useState("");
  const [editingId, setEditingId] = useState(null);

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

  const showSearch = rows.length >= SEARCH_THRESHOLD;
  const filtered = useMemo(
    () => (showSearch ? searchDecisions(rows, query) : rows),
    [rows, query, showSearch],
  );
  const groups = useMemo(() => groupByMonth(filtered), [filtered]);
  const missingReasons = useMemo(
    () => rows.filter((d) => !hasReason(d)).length,
    [rows],
  );

  const editing = editingId ? rows.find((d) => d.id === editingId) : null;
  // A row deleted from under an open drawer must not strand it open.
  useEffect(() => {
    if (editingId && !rows.some((d) => d.id === editingId)) setEditingId(null);
  }, [editingId, rows]);

  const drawer = editing && (
    <DecisionDrawer
      decision={editing}
      onClose={() => setEditingId(null)}
      onChange={(patch) => updRow(ARRAY_KEY, editing.id, patch)}
      onDelete={() => { delRow(ARRAY_KEY, editing.id); setEditingId(null); }}
    />
  );

  if (rows.length === 0) {
    return (
      <>
        <EmptyState onAdd={addDecision} />
        {drawer}
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
          ["Needs a reason", String(missingReasons), missingReasons > 0 ? COLORS.amber : COLORS.green],
        ]}
      />

      {showSearch && (
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
      )}

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
                    onOpen={() => setEditingId(d.id)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {drawer}
    </>
  );
}

// The whole card is one tap into the drawer. It shows what he actually reads
// the log for: the choice, and the reason underneath it — or, if the reason is
// still missing, an amber prompt to add it right where his eye already is.
function DecisionCard({ decision, onOpen }) {
  const reasoned = hasReason(decision);
  const title = decision.title?.trim() || "Untitled decision";
  const choice = decision.decision?.trim();
  const why = decision.why?.trim();

  return (
    <button
      data-item-id={decision.id}
      onClick={onOpen}
      style={{
        textAlign: "left", background: COLORS.surface, border: `1px solid ${COLORS.border}`,
        borderRadius: 12, padding: "13px 14px", cursor: "pointer", fontFamily: FONT,
        display: "flex", flexDirection: "column", width: "100%", minWidth: 0,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
        <span style={{ flex: 1, minWidth: 0, fontSize: 14, fontWeight: 700, letterSpacing: "-0.01em", color: COLORS.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {title}
        </span>
        {decision.decided_on && (
          <Chip tone="neutral">
            <Icon d={ICON.calendar} size={12} />
            {fmtBuildDate(decision.decided_on)}
          </Chip>
        )}
        {!reasoned && <Chip tone="amber">Needs a reason</Chip>}
      </div>

      {choice ? (
        <p style={{ margin: "8px 0 0", fontSize: 13, color: COLORS.text, lineHeight: 1.5,
          display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
          {choice}
        </p>
      ) : (
        <p style={{ margin: "8px 0 0", fontSize: 13, color: COLORS.textFaint, fontStyle: "italic" }}>
          No choice recorded yet.
        </p>
      )}

      {reasoned ? (
        <div style={{ display: "flex", gap: 7, marginTop: 8, alignItems: "baseline" }}>
          <span style={{ flexShrink: 0, fontSize: 9.5, fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", color: COLORS.textFaint }}>
            Why
          </span>
          <span style={{ flex: 1, minWidth: 0, fontSize: 12.5, color: COLORS.textMuted, lineHeight: 1.5,
            display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
            {why}
          </span>
        </div>
      ) : (
        <span style={{ marginTop: 8, fontSize: 12.5, color: COLORS.amber, lineHeight: 1.5 }}>
          No reason recorded — tap to add the why while you still remember it.
        </span>
      )}
    </button>
  );
}

function DecisionDrawer({ decision, onClose, onChange, onDelete }) {
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
        <DateField value={decision.decided_on} onChange={(v) => onChange({ decided_on: v })} />
      </DrawerField>

      <DrawerField label="The choice">
        <AutoTextarea
          value={decision.decision || ""}
          onChange={(v) => onChange({ decision: v })}
          placeholder="What we went with"
          minRows={2}
        />
      </DrawerField>

      <DrawerField label="Why we chose this">
        <AutoTextarea
          value={decision.why || ""}
          onChange={(v) => onChange({ why: v })}
          placeholder="The reason — the one thing you'll want back later"
          minRows={3}
        />
      </DrawerField>

      <DrawerField label="What we rejected, and why">
        <AutoTextarea
          value={decision.alternatives || ""}
          onChange={(v) => onChange({ alternatives: v })}
          placeholder="The options considered and passed over"
          minRows={3}
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

      {decision.url?.trim() && (
        <a
          href={decision.url.trim()}
          target="_blank"
          rel="noreferrer"
          style={{ display: "inline-flex", alignItems: "center", gap: 6, marginTop: -6, fontSize: 12.5, fontWeight: 600, color: COLORS.accent, textDecoration: "none" }}
        >
          <Icon d={ICON.link2} size={13} />
          Open reference link
        </a>
      )}

      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 26 }}>
        <button onClick={onDelete} style={{ ...btn("ghost") }}>
          <Icon d={ICON.x} size={13} /> Delete decision
        </button>
      </div>
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
        Every real choice — the roof, the range, the front door — logged with the
        one thing that fades fastest: why you chose it. In eighteen months, this is
        where you look to remember what the other options even were.
      </p>
      <div style={{ marginTop: 18, display: "flex", justifyContent: "center" }}>
        <AddBtn label="Log your first decision" onClick={onAdd} />
      </div>
    </div>
  );
}
