"use client";

// PunchList section.

import { COLORS, ACCENT, Card, txt, DelBtn, Check, AddBtn } from "../ui";

export default function PunchListSection({ state, addRow, updRow, delRow }) {
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
