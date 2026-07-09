"use client";

// Milestones section.
//
// One screen, one job: 22 construction phases in build order — foundation
// before framing before roof — that he checks off over two years and hangs
// target dates on. The phases arrive pre-filled and in the right sequence, so
// this is never a blank canvas: he taps a circle to mark a phase done and taps
// its date to schedule it. Nothing to set up, nothing to arrange.

import { COLORS, FONT, ACCENT, Card, DelBtn, AddBtn, Chip, Icon, ICON, inputStyle, daysFromToday , DateField} from "../ui";

// "In 1 day", not "In 1 days". Spell the unit out — never "1d".
const dayLabel = (n) => `${n} ${n === 1 ? "day" : "days"}`;

// The single source of truth for one row's state. Everything visible on the
// row — dot colour, chip tone, chip text — comes from here, so a milestone
// can never look done in one place and pending in another.
function statusOf(m) {
  if (m.done) return { tone: "green", dot: COLORS.green, chip: "Done" };
  if (!m.target) return { tone: "neutral", dot: COLORS.borderStrong, chip: null };
  const d = daysFromToday(m.target);
  if (d < 0) return { tone: "red", dot: COLORS.red, chip: `${dayLabel(-d)} overdue` };
  if (d === 0) return { tone: "amber", dot: COLORS.amber, chip: "Due today" };
  return { tone: "neutral", dot: COLORS.borderStrong, chip: `In ${dayLabel(d)}` };
}

// The circle IS the checkbox. It doubles as the timeline node, so marking a
// phase done and reading where it sits in the sequence are the same glance —
// no separate checkbox to hunt for.
function MilestoneDot({ done, color, onToggle, label }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={done}
      aria-label={done ? `Mark "${label}" not done` : `Mark "${label}" done`}
      style={{
        width: 22, height: 22, borderRadius: "50%", flexShrink: 0, marginTop: 1, padding: 0,
        cursor: "pointer", display: "grid", placeItems: "center",
        background: done ? color : COLORS.surface, border: `2px solid ${color}`,
      }}
    >
      {done && <Icon d={ICON.check} size={12} color="#fff" />}
    </button>
  );
}

function MilestoneRow({ m, isNext, isLast, onToggle, onPatch, onDelete }) {
  const s = statusOf(m);
  const color = isNext && !m.done ? ACCENT : s.dot;
  return (
    <div style={{ display: "flex", gap: 12 }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 22 }}>
        <MilestoneDot done={m.done} color={color} onToggle={onToggle} label={m.label || "Milestone"} />
        {!isLast && <div style={{ flex: 1, width: 2, background: COLORS.border, margin: "4px 0" }} />}
      </div>

      <div style={{ flex: 1, minWidth: 0, paddingBottom: isLast ? 2 : 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <input
            type="text"
            value={m.label}
            onChange={(e) => onPatch({ label: e.target.value })}
            placeholder="Milestone name"
            aria-label="Milestone name"
            style={{
              flex: 1, minWidth: 0, border: "none", outline: "none", background: "transparent",
              fontFamily: FONT, fontSize: 14, fontWeight: 700, padding: 0,
              color: m.done ? COLORS.textFaint : COLORS.text,
              textDecoration: m.done ? "line-through" : "none",
            }}
          />
          {isNext && !m.done && <Chip tone="accent">Next up</Chip>}
          <DelBtn onClick={onDelete} />
        </div>

        <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 8, marginTop: 6 }}>
          <DateField value={m.target} onChange={(v) => onPatch({ target: v })} ariaLabel={`Target date for ${m.label || "milestone"}`} width={150} />
          {s.chip && <Chip tone={s.tone}>{s.chip}</Chip>}
        </div>
      </div>
    </div>
  );
}

export default function MilestonesSection({ state, addRow, updRow, delRow }) {
  const milestones = state.milestones;
  const ordered = [...milestones].sort((a, b) => {
    if (!a.target && !b.target) return 0;
    if (!a.target) return 1;
    if (!b.target) return -1;
    return a.target < b.target ? -1 : a.target > b.target ? 1 : 0;
  });
  const total = milestones.length;
  const doneCount = milestones.filter((m) => m.done).length;
  const pct = total ? Math.round((doneCount / total) * 100) : 0;
  const overdue = milestones.filter((m) => m.target && !m.done && daysFromToday(m.target) < 0).length;
  const next = milestones.find((m) => !m.done) || null;

  const add = () => addRow("milestones", { label: "New milestone", target: null, done: false });

  if (total === 0) {
    return (
      <Card title="Milestones" sub="Nothing scheduled yet">
        <div style={{ textAlign: "center", padding: "26px 16px 30px" }}>
          <div style={{ width: 46, height: 46, borderRadius: "50%", margin: "0 auto 14px", display: "grid", placeItems: "center", background: COLORS.surfaceTint }}>
            <Icon d={ICON.flag} size={22} color={COLORS.textFaint} />
          </div>
          <div style={{ fontSize: 15, fontWeight: 700, color: COLORS.text }}>Track the big moments</div>
          <p style={{ fontSize: 13, color: COLORS.textMuted, lineHeight: 1.5, maxWidth: 300, margin: "6px auto 18px" }}>
            Groundbreaking, roof dried-in, move in — the phases that mark real progress. Add one and hang a target date on it.
          </p>
          <AddBtn label="Add your first milestone" onClick={add} />
        </div>
      </Card>
    );
  }

  return (
    <Card title="Milestones" sub={`${doneCount} of ${total} done`}>
      <div style={{ padding: "4px 2px 14px" }}>
        <div style={{ height: 8, borderRadius: 99, background: COLORS.surfaceTint, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${pct}%`, background: ACCENT, borderRadius: 99, transition: "width .3s ease" }} />
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, marginTop: 8, flexWrap: "wrap" }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: COLORS.textMuted }}>
            {next
              ? <>Next: <span style={{ color: COLORS.text }}>{next.label || "Milestone"}</span></>
              : "Every milestone complete"}
          </span>
          {overdue > 0 && <Chip tone="red">{overdue} overdue</Chip>}
        </div>
      </div>

      <div style={{ borderTop: `1px solid ${COLORS.surfaceTint}`, paddingTop: 14 }}>
        {/* Chronological, because a schedule read in entry order is not a
            schedule. Dated milestones ascend by target; undated sink to the
            bottom, where the next thing to do is to give them a date. */}
        {ordered.map((m, i) => (
          <MilestoneRow
            key={m.id}
            m={m}
            isNext={next?.id === m.id}
            isLast={i === milestones.length - 1}
            onToggle={() => updRow("milestones", m.id, { done: !m.done })}
            onPatch={(patch) => updRow("milestones", m.id, patch)}
            onDelete={() => delRow("milestones", m.id)}
          />
        ))}
      </div>

      <AddBtn label="Add milestone" onClick={add} />
    </Card>
  );
}
