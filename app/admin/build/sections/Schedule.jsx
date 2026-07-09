"use client";

// Schedule / Gantt — the build timeline.
//
// The 17 standard construction phases are seeded; tasks hang off them. The
// Gantt draws a bar per task on a day/week ruler, fills each bar by percent,
// draws milestones as diamonds, flags finish-to-start violations in red, and
// emphasises the critical path. Drag a bar sideways to reschedule it: the pure
// reschedule() cascades every dependent that would otherwise start too early.
//
// A Gantt is unusable on a phone, so mobile defaults to a plain grouped list —
// same data, same edits, no horizontal scrubbing.
//
// All arithmetic lives in lib/build/schedule.ts; this file only positions it.

import { useMemo, useRef, useState } from "react";

import {
  COLORS, FONT, SERIF, ACCENT, ACCENT_SOFT, Icon, inputStyle,
  Field, txt, DelBtn, Check, AddBtn, SectionHead, Chip, StatStrip, fmtBuildDate, SelectPill
, DateField} from "../ui";
import DetailDrawer from "../DetailDrawer";
import { useIsMobile } from "../../budget/lib/responsive";
import {
  addDays, daysBetween, durationDays,
  reschedule, criticalPath, violations, projectBounds, percentComplete, topoSort,
} from "@/lib/build/schedule";

const ICON_LIST = ["M8 6h13", "M8 12h13", "M8 18h13", "M3 6h.01", "M3 12h.01", "M3 18h.01"];
const ICON_GANTT = ["M8 6h10", "M6 12h8", "M10 18h8", "M3 4v16"];
const ICON_LINK = ["M9 17H7A5 5 0 0 1 7 7h2", "M15 7h2a5 5 0 1 1 0 10h-2", "M8 12h8"];
const ICON_FLAG = "M4 22V4a2 2 0 0 1 2-2h12l-3 4 3 4H6 M4 22h6";
const ICON_ALERT = ["M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z", "M12 9v4", "M12 17h.01"];
const ICON_CAL = ["M8 2v4", "M16 2v4", "M3 10h18", "M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z"];

// Full month names — spelled out, never "Jul". Indexed by getUTCMonth().
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const DAY_W = { day: 26, week: 8 };   // px per calendar day at each zoom
const ROW_H = 36;
const PHASE_H = 30;
const RULER_H = 40;
const BAR_H = 18;
// "Today" is the viewer's LOCAL calendar day, not the UTC instant. Reading it
// off toISOString() would roll to tomorrow for anyone in a timezone west of UTC
// during the evening, drifting the today-marker and new-task default start by a
// day. Stored dates are still bare calendar days, so this string compares
// cleanly against them via daysBetween.
const _now = new Date();
const TODAY = `${_now.getFullYear()}-${String(_now.getMonth() + 1).padStart(2, "0")}-${String(_now.getDate()).padStart(2, "0")}`;

const UNASSIGNED = "__unassigned__";

// One flat render list keeps the fixed name column and the scrolling timeline
// in lockstep: both walk the same rows at the same y-offsets.
function buildRows(tasks, phases) {
  const byPhase = new Map();
  const orphan = [];
  for (const t of tasks) {
    const key = t.phase_id && phases.some((p) => p.id === t.phase_id) ? t.phase_id : UNASSIGNED;
    if (key === UNASSIGNED) orphan.push(t);
    else {
      if (!byPhase.has(key)) byPhase.set(key, []);
      byPhase.get(key).push(t);
    }
  }
  const rows = [];
  for (const p of phases) {
    const group = byPhase.get(p.id);
    if (!group || group.length === 0) continue;
    rows.push({ kind: "phase", id: p.id, label: p.name });
    for (const t of group) rows.push({ kind: "task", task: t });
  }
  if (orphan.length) {
    rows.push({ kind: "phase", id: UNASSIGNED, label: "Unassigned" });
    for (const t of orphan) rows.push({ kind: "task", task: t });
  }
  // Attach each row's vertical offset once, so both columns agree.
  let y = 0;
  for (const r of rows) {
    r.y = y;
    y += r.kind === "phase" ? PHASE_H : ROW_H;
  }
  return { rows, height: y };
}

export default function ScheduleSection({ state, addRow, updRow, delRow }) {
  const isMobile = useIsMobile();
  const tasks = state.schedule_tasks || [];
  const phases = state.phases || [];
  const milestones = state.milestones || [];

  const [view, setView] = useState("gantt");   // "gantt" | "list"
  const [scale, setScale] = useState("week");   // "day" | "week"
  const [editId, setEditId] = useState(null);
  const [drag, setDrag] = useState(null);       // { id, startX, days }
  const scrollRef = useRef(null);

  const effectiveView = isMobile ? "list" : view;

  const byId = useMemo(() => {
    const m = new Map();
    for (const t of tasks) m.set(t.id, t);
    return m;
  }, [tasks]);

  // While dragging, show the cascade preview live so the user sees dependents
  // move before releasing. Committed to state only on pointer up.
  const positioned = useMemo(() => {
    if (!drag || drag.days === 0) return tasks;
    const src = byId.get(drag.id);
    if (!src?.start) return tasks;
    return reschedule(tasks, drag.id, addDays(src.start, drag.days));
  }, [tasks, drag, byId]);

  const critical = useMemo(() => new Set(criticalPath(tasks)), [tasks]);
  const violSet = useMemo(() => new Set(violations(tasks).map((t) => t.id)), [tasks]);
  const cycle = useMemo(() => topoSort(tasks).cycle, [tasks]);
  const pct = Math.round(percentComplete(tasks) / 100);

  const bounds = useMemo(() => projectBounds(positioned), [positioned]);
  const origin = bounds.start ? addDays(bounds.start, -2) : TODAY;
  const lastDay = bounds.end ? addDays(bounds.end, 3) : addDays(origin, 35);
  const totalDays = Math.max(1, daysBetween(origin, lastDay) + 1);
  const dw = DAY_W[scale];
  const timelineW = totalDays * dw;

  const posById = useMemo(() => {
    const m = new Map();
    for (const t of positioned) m.set(t.id, t);
    return m;
  }, [positioned]);

  const { rows, height } = useMemo(() => buildRows(positioned, phases), [positioned, phases]);

  const xFor = (iso) => daysBetween(origin, iso) * dw;

  function commitDrag(d) {
    if (d && d.days !== 0) {
      const src = byId.get(d.id);
      if (src?.start) {
        const next = reschedule(tasks, d.id, addDays(src.start, d.days));
        for (const nt of next) {
          const old = byId.get(nt.id);
          if (old && (old.start !== nt.start || old.end !== nt.end)) {
            updRow("schedule_tasks", nt.id, { start: nt.start, end: nt.end });
          }
        }
      }
    }
    setDrag(null);
  }

  // A milestone is modeled in exactly one place: the `milestones` array, which
  // the Milestones section owns and the dashboard counts. The Gantt draws them
  // and can create them, but keeps no second copy — schedule_tasks.is_milestone
  // was a parallel model with its own completion rule, and two answers to
  // "which milestones are done" is worse than none.
  const addTask = (milestone) => {
    if (milestone) {
      addRow("milestones", { label: "New milestone", target: TODAY, done: false });
      return;
    }
    addRow("schedule_tasks", {
      phase_id: phases[0]?.id ?? null,
      name: "New task",
      start: TODAY, end: addDays(TODAY, 4), percent: 0, depends_on: [], is_milestone: false,
    });
  };

  const editing = editId ? byId.get(editId) : null;

  return (
    <div style={{ userSelect: drag ? "none" : "auto" }}>
      <SectionHead title="Schedule" note="Lay out the build. Drag a bar to move it and anything waiting on it slides along too." />

      {tasks.length === 0 ? (
        <EmptyState phases={phases} onAdd={() => addTask(false)} onAddMilestone={() => addTask(true)} />
      ) : (
        <>
          <StatStrip
            items={[
              ["Starts", bounds.start ? fmtBuildDate(bounds.start) : "—", COLORS.text],
              ["Finishes", bounds.end ? fmtBuildDate(bounds.end) : "—", COLORS.text],
              ["Length", bounds.start && bounds.end ? `${daysBetween(bounds.start, bounds.end) + 1} days` : "—", COLORS.text],
              ["Complete", `${pct}%`, pct >= 100 ? COLORS.green : COLORS.text],
              ["Too early", String(violSet.size), violSet.size ? COLORS.red : COLORS.green],
            ]}
          />

          {cycle.length > 0 && (
            <div style={{ display: "flex", alignItems: "center", gap: 8, margin: "2px 0 12px", padding: "9px 12px", borderRadius: 10, background: COLORS.redBg, border: `1px solid ${COLORS.red}` }}>
              <Icon d={ICON_ALERT} size={15} color={COLORS.red} />
              <span style={{ fontSize: 12.5, fontWeight: 700, color: COLORS.red }}>
                These tasks wait on each other in a loop: {cycle.map((id) => byId.get(id)?.name).filter(Boolean).join(", then ")}. Remove one link so they can be scheduled.
              </span>
            </div>
          )}

          <Toolbar
            view={effectiveView} onView={setView} viewLocked={isMobile}
            scale={scale} onScale={setScale}
            onAdd={() => addTask(false)} onAddMilestone={() => addTask(true)}
          />

          {effectiveView === "gantt" ? (
            <>
              <Gantt
                rows={rows} height={height} timelineW={timelineW} totalDays={totalDays} dw={dw} scale={scale}
                origin={origin} xFor={xFor} posById={posById} critical={critical} violSet={violSet}
                milestones={milestones} updRow={updRow}
                scrollRef={scrollRef} drag={drag} setDrag={setDrag} commitDrag={commitDrag}
                onOpen={setEditId}
              />
              <GanttLegend />
            </>
          ) : (
            <ListView
              rows={rows} phases={phases} critical={critical} violSet={violSet}
              updRow={updRow} onOpen={setEditId}
            />
          )}
        </>
      )}

      <TaskDrawer
        task={editing} tasks={tasks} phases={phases} byId={byId}
        onClose={() => setEditId(null)}
        updRow={updRow} delRow={delRow}
      />
    </div>
  );
}

function EmptyState({ phases, onAdd, onAddMilestone }) {
  return (
    <div style={{ border: `1px solid ${COLORS.border}`, borderRadius: 16, background: COLORS.surface, padding: "40px 20px 44px", textAlign: "center", maxWidth: 500, margin: "8px auto 0" }}>
      <div style={{ width: 48, height: 48, margin: "0 auto 16px", borderRadius: 14, background: ACCENT_SOFT, display: "grid", placeItems: "center" }}>
        <Icon d={ICON_CAL} size={24} color={ACCENT} />
      </div>
      <h3 style={{ fontFamily: SERIF, fontSize: 21, fontWeight: 600, margin: "0 0 7px" }}>Lay out your timeline</h3>
      <p style={{ fontSize: 13.5, color: COLORS.textMuted, lineHeight: 1.55, margin: "0 auto 8px", maxWidth: 400 }}>
        Your {phases.length} construction phases are ready — foundation through move-in. Add a task, give it a start
        and end date, and it lands on the timeline.
      </p>
      <p style={{ fontSize: 13.5, color: COLORS.textMuted, lineHeight: 1.55, margin: "0 auto 22px", maxWidth: 400 }}>
        Say what has to finish first and the timeline draws the whole build, flags anything scheduled too early,
        and shows which tasks set your finish date.
      </p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center" }}>
        <button onClick={onAdd} style={primaryBtn()}>
          <Icon d={["M12 5v14", "M5 12h14"]} size={15} />
          Add your first task
        </button>
        <button onClick={onAddMilestone} style={outlineBtn()}>
          <Icon d={ICON_FLAG} size={15} />
          Add a milestone
        </button>
      </div>
    </div>
  );
}

// A key for the timeline: the four marks a first-time reader can't guess, each
// tone carrying the same meaning it does on the bars themselves.
function GanttLegend() {
  const items = [
    { swatch: <span style={{ width: 14, height: 2, background: ACCENT, opacity: 0.5, borderRadius: 2, display: "inline-block" }} />, label: "Today" },
    { swatch: (
      <span style={{ width: 14, height: 14, display: "inline-grid", placeItems: "center" }}>
        <span style={{ width: 10, height: 10, background: ACCENT, transform: "rotate(45deg)", borderRadius: 2 }} />
      </span>
    ), label: "Milestone" },
    { swatch: <span style={{ width: 16, height: 10, border: `2px solid ${ACCENT}`, borderRadius: 3, boxSizing: "border-box", display: "inline-block" }} />, label: "Sets your finish date" },
    { swatch: <span style={{ width: 16, height: 10, background: COLORS.green, borderRadius: 3, display: "inline-block" }} />, label: "Done" },
    { swatch: <span style={{ width: 16, height: 10, border: `2px solid ${COLORS.red}`, borderRadius: 3, boxSizing: "border-box", display: "inline-block" }} />, label: "Starts too early" },
  ];
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "6px 16px", alignItems: "center", margin: "10px 2px 0", fontSize: 11, fontWeight: 600, color: COLORS.textFaint }}>
      {items.map((it) => (
        <span key={it.label} style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
          {it.swatch}{it.label}
        </span>
      ))}
    </div>
  );
}

function Toolbar({ view, onView, viewLocked, scale, onScale, onAdd, onAddMilestone }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 10, margin: "2px 0 12px" }}>
      {!viewLocked && (
        <Segmented
          value={view} onChange={onView}
          options={[
            { id: "gantt", label: "Gantt", icon: ICON_GANTT },
            { id: "list", label: "List", icon: ICON_LIST },
          ]}
        />
      )}
      {view === "gantt" && !viewLocked && (
        <Segmented
          value={scale} onChange={onScale}
          options={[{ id: "day", label: "Days" }, { id: "week", label: "Weeks" }]}
        />
      )}
      <div style={{ flex: 1 }} />
      <button onClick={onAddMilestone} style={outlineBtn()}>
        <Icon d={ICON_FLAG} size={14} />
        Milestone
      </button>
      <button onClick={onAdd} style={primaryBtn()}>
        <Icon d={["M12 5v14", "M5 12h14"]} size={14} />
        Task
      </button>
    </div>
  );
}

// Each segment carries its own outline; the active one fills with accentSoft.
function Segmented({ value, onChange, options }) {
  return (
    <div style={{ display: "inline-flex", flexWrap: "wrap", gap: 4 }}>
      {options.map((o) => {
        const on = o.id === value;
        return (
          <button
            key={o.id}
            onClick={() => onChange(o.id)}
            aria-pressed={on}
            style={{
              display: "inline-flex", alignItems: "center", gap: 6, cursor: "pointer", fontFamily: FONT,
              padding: "6px 11px", borderRadius: 8, fontSize: 12, fontWeight: 700, whiteSpace: "nowrap",
              border: `1px solid ${on ? ACCENT : COLORS.border}`,
              background: on ? ACCENT_SOFT : COLORS.surface,
              color: on ? ACCENT : COLORS.textFaint,
            }}
          >
            {o.icon && <Icon d={o.icon} size={13} />}
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

function Gantt({ rows, height, timelineW, totalDays, dw, scale, origin, xFor, posById, critical, violSet, scrollRef, drag, setDrag, commitDrag, onOpen, milestones = [], updRow }) {
  const nameW = 176;

  return (
    <div style={{ display: "flex", border: `1px solid ${COLORS.border}`, borderRadius: 14, overflow: "hidden", background: COLORS.surface }}>
      {/* Fixed name column — always visible while the timeline scrolls. */}
      <div style={{ width: nameW, flexShrink: 0, borderRight: `1px solid ${COLORS.border}` }}>
        <div style={{ height: RULER_H, borderBottom: `1px solid ${COLORS.border}`, display: "flex", alignItems: "flex-end", padding: "0 12px 8px", fontSize: 10.5, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: COLORS.textFaint }}>
          Task
        </div>
        <div style={{ position: "relative", height }}>
          {rows.map((r) => r.kind === "phase" ? (
            <div key={`n-${r.id}`} style={{ position: "absolute", top: r.y, left: 0, right: 0, height: PHASE_H, display: "flex", alignItems: "center", padding: "0 12px", background: COLORS.surfaceTint, fontSize: 11.5, fontWeight: 800, color: COLORS.textMuted, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {r.label}
            </div>
          ) : (
            <button
              key={`n-${r.task.id}`}
              onClick={() => onOpen(r.task.id)}
              title={r.task.name}
              style={{
                position: "absolute", top: r.y, left: 0, right: 0, height: ROW_H, textAlign: "left",
                display: "flex", alignItems: "center", gap: 6, padding: "0 12px", cursor: "pointer",
                background: "transparent", border: "none", borderBottom: `1px solid ${COLORS.border}`,
                fontFamily: FONT, fontSize: 12.5, fontWeight: 600, color: COLORS.text, overflow: "hidden",
              }}
            >
              {r.task.is_milestone && <Icon d={ICON_FLAG} size={12} color={COLORS.textFaint} />}
              <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.task.name || "Untitled"}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Scrolling timeline. */}
      <div ref={scrollRef} style={{ flex: 1, overflowX: "auto" }}>
        <div style={{ position: "relative", width: timelineW, height: RULER_H + height }}>
          <Ruler totalDays={totalDays} dw={dw} scale={scale} origin={origin} height={RULER_H + height} />

          {/* Today marker. */}
          {daysBetween(origin, TODAY) >= 0 && daysBetween(origin, TODAY) < totalDays && (
            <div style={{ position: "absolute", top: 0, bottom: 0, left: xFor(TODAY), width: 2, background: ACCENT, opacity: 0.5 }} />
          )}

          {/* Milestones, drawn from the one array that owns them. Click a
              diamond to mark it reached. An undated milestone has nowhere to
              sit on a calendar and lives only in the Milestones section. */}
          {milestones.filter((m) => m.target).map((m) => {
            const x = xFor(m.target);
            if (x < 0 || x > timelineW) return null;
            return (
              <button
                key={m.id}
                onClick={() => updRow?.("milestones", m.id, { done: !m.done })}
                title={`${m.label} · ${fmtBuildDate(m.target)}${m.done ? " · reached" : ""}`}
                aria-label={`${m.label}, ${m.done ? "reached" : "not reached"}`}
                style={{
                  position: "absolute", top: RULER_H - 13, left: x - 6,
                  width: 12, height: 12, padding: 0, cursor: "pointer",
                  transform: "rotate(45deg)", borderRadius: 2,
                  border: `1.5px solid ${m.done ? COLORS.green : ACCENT}`,
                  background: m.done ? COLORS.green : COLORS.surface,
                }}
              />
            );
          })}

          {/* Phase bands. */}
          {rows.filter((r) => r.kind === "phase").map((r) => (
            <div key={`b-${r.id}`} style={{ position: "absolute", top: RULER_H + r.y, left: 0, width: timelineW, height: PHASE_H, background: COLORS.surfaceTint, borderBottom: `1px solid ${COLORS.border}` }} />
          ))}

          {/* Bars. */}
          {rows.filter((r) => r.kind === "task").map((r) => {
            const t = posById.get(r.task.id) || r.task;
            return (
              <Bar
                key={`bar-${t.id}`}
                task={t} y={RULER_H + r.y} dw={dw} xFor={xFor}
                isCritical={critical.has(t.id)} isViolation={violSet.has(t.id)}
                dragging={drag?.id === t.id}
                onOpen={() => onOpen(t.id)}
                onDragStart={(startX) => t.start && setDrag({ id: t.id, startX, days: 0 })}
                onDragMove={(clientX) => setDrag((d) => (d && d.id === t.id ? { ...d, days: Math.round((clientX - d.startX) / dw) } : d))}
                onDragEnd={commitDrag}
                drag={drag}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

function Bar({ task, y, dw, xFor, isCritical, isViolation, dragging, onOpen, onDragStart, onDragMove, onDragEnd, drag }) {
  // commitDrag() clears `drag` on release, so by the time the browser fires the
  // trailing `click` the guard can no longer tell a real drag from a plain tap.
  // Latch whether this release actually moved the bar and consult that instead.
  const movedRef = useRef(false);
  if (!task.start) {
    return (
      <div style={{ position: "absolute", top: y + (ROW_H - BAR_H) / 2, left: 6, height: BAR_H, display: "flex", alignItems: "center" }}>
        <Chip tone="neutral">No dates</Chip>
      </div>
    );
  }
  const left = xFor(task.start);
  const dur = durationDays(task);
  const pct = Math.min(100, Math.max(0, task.percent || 0));

  const border = isViolation ? COLORS.red : isCritical ? ACCENT : COLORS.borderStrong;
  const fill = isViolation ? COLORS.red : pct >= 100 ? COLORS.green : ACCENT;

  const common = {
    position: "absolute", top: y + (ROW_H - BAR_H) / 2, cursor: "grab",
  };

  const pointerHandlers = {
    onPointerDown: (e) => { e.currentTarget.setPointerCapture(e.pointerId); onDragStart(e.clientX); },
    onPointerMove: (e) => { if (dragging) onDragMove(e.clientX); },
    onPointerUp: (e) => {
      try { e.currentTarget.releasePointerCapture(e.pointerId); } catch { /* not captured */ }
      movedRef.current = !!(drag && drag.id === task.id && drag.days !== 0);
      onDragEnd(drag);
    },
    onClick: (e) => {
      e.stopPropagation();
      // A release that moved the bar already committed a reschedule; swallow the
      // synthetic click so it does not also open the edit drawer.
      if (movedRef.current) { movedRef.current = false; return; }
      onOpen();
    },
  };

  if (task.is_milestone) {
    const s = BAR_H;
    return (
      <div
        {...pointerHandlers}
        title={`${task.name} · ${fmtBuildDate(task.start)}`}
        style={{
          ...common, left: left - s / 2, width: s, height: s,
          transform: "rotate(45deg)", borderRadius: 3,
          background: isViolation ? COLORS.red : ACCENT, border: `1.5px solid ${isViolation ? COLORS.red : ACCENT}`,
        }}
      />
    );
  }

  return (
    <div
      {...pointerHandlers}
      title={`${task.name} · ${fmtBuildDate(task.start)}–${fmtBuildDate(task.end)} · ${pct}%`}
      style={{
        ...common, left, width: Math.max(dw, dur * dw), height: BAR_H,
        borderRadius: 6, overflow: "hidden", background: COLORS.surfaceTint,
        border: `${isCritical || isViolation ? 2 : 1}px solid ${border}`,
        boxShadow: dragging ? "0 4px 12px rgba(0,0,0,0.18)" : "none",
      }}
    >
      <div style={{ height: "100%", width: `${pct}%`, background: fill, opacity: isViolation ? 0.85 : 1 }} />
    </div>
  );
}

function Ruler({ totalDays, dw, scale, origin, height }) {
  const grid = [];
  const monthMarks = [];
  const labels = [];
  let prevMonth = -1;

  for (let i = 0; i < totalDays; i++) {
    const iso = addDays(origin, i);
    const d = new Date(`${iso}T00:00:00Z`);
    const dow = d.getUTCDay();
    const month = d.getUTCMonth();
    const isMonthStart = d.getUTCDate() === 1;

    if (month !== prevMonth) {
      monthMarks.push({ x: i * dw, label: `${MONTHS[month]} ${d.getUTCFullYear()}` });
      prevMonth = month;
    }
    // Gridline weekly (Mondays) and at month starts, to keep the DOM light.
    if (dow === 1 || isMonthStart) grid.push({ x: i * dw, strong: isMonthStart });

    if (scale === "day" && dw >= 20) {
      labels.push({ x: i * dw, w: dw, text: String(d.getUTCDate()), muted: dow === 0 || dow === 6 });
    } else if (scale === "week" && dow === 1) {
      labels.push({ x: i * dw, w: dw * 7, text: `${String(d.getUTCMonth() + 1).padStart(2, "0")}/${String(d.getUTCDate()).padStart(2, "0")}`, muted: false });
    }
  }

  return (
    <>
      {grid.map((g, i) => (
        <div key={`g${i}`} style={{ position: "absolute", top: 0, bottom: 0, left: g.x, width: 1, height, background: g.strong ? COLORS.border : COLORS.surfaceTint }} />
      ))}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: RULER_H, borderBottom: `1px solid ${COLORS.border}` }}>
        {monthMarks.map((m, i) => (
          <div key={`m${i}`} style={{ position: "absolute", top: 5, left: m.x + 4, fontSize: 10.5, fontWeight: 800, letterSpacing: "0.04em", color: COLORS.textMuted, whiteSpace: "nowrap" }}>
            {m.label}
          </div>
        ))}
        {labels.map((l, i) => (
          <div key={`l${i}`} style={{ position: "absolute", top: 22, left: l.x, width: l.w, textAlign: scale === "day" ? "center" : "left", paddingLeft: scale === "week" ? 3 : 0, fontSize: 9.5, fontWeight: 600, fontVariantNumeric: "tabular-nums", color: l.muted ? COLORS.textFaint : COLORS.textMuted }}>
            {l.text}
          </div>
        ))}
      </div>
    </>
  );
}

function ListView({ rows, phases, critical, violSet, updRow, onOpen }) {
  return (
    <div style={{ border: `1px solid ${COLORS.border}`, borderRadius: 14, overflow: "hidden", background: COLORS.surface }}>
      {rows.map((r) => r.kind === "phase" ? (
        <div key={`p-${r.id}`} style={{ padding: "8px 14px", background: COLORS.surfaceTint, fontSize: 11.5, fontWeight: 800, color: COLORS.textMuted, letterSpacing: "0.02em" }}>
          {r.label}
        </div>
      ) : (
        <ListRow
          key={`r-${r.task.id}`} task={r.task}
          isCritical={critical.has(r.task.id)} isViolation={violSet.has(r.task.id)}
          onOpen={() => onOpen(r.task.id)}
          onPatch={(patch) => updRow("schedule_tasks", r.task.id, patch)}
        />
      ))}
    </div>
  );
}

function ListRow({ task, isCritical, isViolation, onOpen, onPatch }) {
  const dur = durationDays(task);
  const pct = Math.min(100, Math.max(0, task.percent || 0));
  return (
    <div style={{ padding: "10px 14px", borderBottom: `1px solid ${COLORS.border}`, display: "flex", flexDirection: "column", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        {task.is_milestone && <Icon d={ICON_FLAG} size={13} color={COLORS.textFaint} />}
        <input
          value={task.name}
          onChange={(e) => onPatch({ name: e.target.value })}
          placeholder="Task name"
          style={{ ...txt(), fontWeight: 700 }}
        />
        <button onClick={onOpen} aria-label="Edit dependencies and details" style={iconBtn()}>
          <Icon d={ICON_LINK} size={14} />
        </button>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8 }}>
        <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, fontWeight: 700, color: COLORS.textFaint }}>
          Start
          <DateField value={task.start} onChange={(v) => onPatch({ start: v })} width={148} />
        </label>
        <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, fontWeight: 700, color: COLORS.textFaint }}>
          End
          <DateField value={task.end} onChange={(v) => onPatch({ end: v })} width={148} />
        </label>
        <Chip tone="neutral">{dur} day{dur === 1 ? "" : "s"}</Chip>
        <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, fontWeight: 700, color: COLORS.textFaint }}>
          Percent done
          <input
            type="number" min={0} max={100} value={task.percent || 0}
            onChange={(e) => onPatch({ percent: clampPct(e.target.value) })}
            style={{ ...inputStyle(), width: 64, textAlign: "right", fontVariantNumeric: "tabular-nums" }}
          />
        </label>
        {isViolation && <Chip tone="red">Starts too early</Chip>}
        {isCritical && !isViolation && <Chip tone="accent">Sets finish date</Chip>}
        {(task.depends_on?.length || 0) > 0 && (
          <Chip tone="neutral">
            <Icon d={ICON_LINK} size={11} />
            {task.depends_on.length}
          </Chip>
        )}
      </div>
    </div>
  );
}

function TaskDrawer({ task, tasks, phases, byId, onClose, updRow, delRow }) {
  const patch = (p) => task && updRow("schedule_tasks", task.id, p);

  // A dependency may only be added if it doesn't create a cycle — that keeps
  // the graph schedulable and the cascade terminating. Removals always apply.
  const toggleDep = (depId) => {
    if (!task) return;
    const have = task.depends_on || [];
    if (have.includes(depId)) {
      patch({ depends_on: have.filter((x) => x !== depId) });
      return;
    }
    const next = [...have, depId];
    const trial = tasks.map((t) => (t.id === task.id ? { ...t, depends_on: next } : t));
    if (topoSort(trial).cycle.length > 0) return; // would loop — refuse
    patch({ depends_on: next });
  };

  const dependable = task ? tasks.filter((t) => t.id !== task.id) : [];
  const cycleBlocked = (depId) => {
    if (!task || (task.depends_on || []).includes(depId)) return false;
    const next = [...(task.depends_on || []), depId];
    const trial = tasks.map((t) => (t.id === task.id ? { ...t, depends_on: next } : t));
    return topoSort(trial).cycle.length > 0;
  };

  return (
    <DetailDrawer
      open={!!task}
      onClose={onClose}
      kind={task?.is_milestone ? "Milestone" : "Scheduled task"}
      title={task?.name || "Task"}
      tabs={[]}
      footer={
        task ? (
          <button
            onClick={() => { delRow("schedule_tasks", task.id); onClose(); }}
            style={{ ...outlineBtn(), color: COLORS.red, background: COLORS.redBg, borderColor: COLORS.red }}
          >
            <Icon d={["M3 6h18", "M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6", "M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"]} size={14} />
            Delete this task
          </button>
        ) : null
      }
    >
      {task && (
        <div>
          <Field label="Name">
            <input value={task.name} onChange={(e) => patch({ name: e.target.value })} placeholder="Task name" style={txt()} />
          </Field>

          <Field label="Phase">
            <SelectPill value={task.phase_id ?? ""} options={[{ value: "", label: "Unassigned", tone: "neutral" }, ...phases.map((p) => ({ value: p.id, label: p.name, tone: "neutral" }))]} onChange={(v) => patch({ phase_id: v || null })} ariaLabel="Phase" minWidth={200} />
          </Field>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <Field label="Start">
              <DateField value={task.start} onChange={(v) => patch({ start: v })} />
            </Field>
            <Field label="End">
              <DateField value={task.end} onChange={(v) => patch({ end: v })} />
            </Field>
          </div>
          {task.start && task.end && (
            <div style={{ margin: "-6px 0 12px", fontSize: 12, color: COLORS.textFaint }}>
              {fmtBuildDate(task.start)} – {fmtBuildDate(task.end)} · {durationDays(task)} day{durationDays(task) === 1 ? "" : "s"}
            </div>
          )}

          <Field label="Percent complete">
            <input
              type="number" min={0} max={100} value={task.percent || 0}
              onChange={(e) => patch({ percent: clampPct(e.target.value) })}
              style={{ ...txt(), textAlign: "right", fontVariantNumeric: "tabular-nums" }}
            />
          </Field>

          <label style={{ display: "flex", alignItems: "center", gap: 10, margin: "4px 0 16px", cursor: "pointer" }}>
            <Check done={!!task.is_milestone} onClick={() => patch({ is_milestone: !task.is_milestone })} />
            <span style={{ fontSize: 13, fontWeight: 600, color: COLORS.text }}>This is a milestone — a single key date, not a range of days</span>
          </label>

          <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", color: COLORS.textFaint, marginBottom: 8 }}>
            What has to finish first
          </div>
          {dependable.length === 0 ? (
            <p style={{ fontSize: 12.5, color: COLORS.textFaint, margin: "0 0 8px" }}>Add more tasks, then check the ones that must finish before this can start.</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {dependable.map((d) => {
                const on = (task.depends_on || []).includes(d.id);
                const blocked = cycleBlocked(d.id);
                return (
                  <button
                    key={d.id}
                    onClick={() => !blocked && toggleDep(d.id)}
                    disabled={blocked}
                    title={blocked ? "Can't link — this would make the two tasks wait on each other in a loop" : undefined}
                    style={{
                      display: "flex", alignItems: "center", gap: 9, textAlign: "left", width: "100%",
                      padding: "8px 10px", borderRadius: 9, cursor: blocked ? "not-allowed" : "pointer",
                      fontFamily: FONT, fontSize: 12.5, fontWeight: 600,
                      color: blocked ? COLORS.textFaint : COLORS.text,
                      background: on ? ACCENT_SOFT : COLORS.surface,
                      border: `1px solid ${on ? ACCENT : COLORS.border}`,
                      opacity: blocked ? 0.55 : 1,
                    }}
                  >
                    <span style={{ width: 16, height: 16, borderRadius: 5, flexShrink: 0, display: "grid", placeItems: "center", border: `1px solid ${on ? ACCENT : COLORS.borderStrong}`, background: on ? ACCENT : "transparent" }}>
                      {on && <Icon d="M20 6L9 17l-5-5" size={10} color="#fff" />}
                    </span>
                    <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{d.name || "Untitled"}</span>
                    {blocked && <span style={{ marginLeft: "auto", fontSize: 11, color: COLORS.textFaint }}>loops</span>}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </DetailDrawer>
  );
}

function clampPct(v) {
  const n = Math.round(Number(v) || 0);
  return Math.min(100, Math.max(0, n));
}

function primaryBtn() {
  return {
    display: "inline-flex", alignItems: "center", gap: 7, cursor: "pointer", fontFamily: FONT,
    padding: "9px 14px", borderRadius: 10, fontSize: 12.5, fontWeight: 700,
    color: ACCENT, background: ACCENT_SOFT, border: `1px solid ${ACCENT}`,
  };
}
function outlineBtn() {
  return {
    display: "inline-flex", alignItems: "center", gap: 6, cursor: "pointer", fontFamily: FONT,
    padding: "9px 13px", borderRadius: 10, fontSize: 12.5, fontWeight: 700,
    color: COLORS.text, background: COLORS.surface, border: `1px solid ${COLORS.border}`,
  };
}
function iconBtn() {
  return {
    width: 32, height: 32, flexShrink: 0, borderRadius: 8, cursor: "pointer",
    display: "grid", placeItems: "center",
    color: COLORS.textMuted, background: COLORS.surface, border: `1px solid ${COLORS.border}`,
  };
}
