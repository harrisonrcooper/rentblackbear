"use client";

// Milestones section.

import { COLORS, inputStyle, ACCENT, Card, txt, DelBtn, Check, AddBtn, fmtBuildDate, daysFromToday } from "../ui";

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

export default function MilestonesSection({ state, addRow, updRow, delRow }) {
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
