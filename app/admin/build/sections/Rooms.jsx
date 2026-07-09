"use client";

// Rooms & Spaces — one card per room, one drawer to edit it.
//
// A room's requirements live as a CHECKLIST, not a paragraph: that is what
// gives each room a done/total and lets the card show what's still open at a
// glance. The checklist is derived from the room's original free-text on first
// read and materialized the moment a box is ticked (see lib/build/rooms.ts) —
// so the card, the drawer, and the progress chip all read from one source and
// can never drift out of sync.

import { useState, useMemo, useCallback, useEffect, useRef } from "react";

import { COLORS, FONT, SERIF, btn, Icon, ICON, ACCENT, txt, DelBtn, AddBtn, SectionHead, Chip, AutoTextarea } from "../ui";
import DetailDrawer from "../DetailDrawer";
import { tasksFor } from "@/lib/build/tasks";
import { addMustHave, checklistFor, editMustHave, removeMustHave, roomProgress, toggleMustHave } from "@/lib/build/rooms";

function RoomField({ label, value, onChange, placeholder }) {
  return (
    <div>
      <span style={{ display: "block", fontSize: 10.5, fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", color: COLORS.textFaint, marginBottom: 5 }}>
        {label}
      </span>
      <AutoTextarea
        value={value}
        onChange={onChange}
        minRows={4}
        placeholder={placeholder}
      />
    </div>
  );
}

function RoomCard({ room, taskCount, onOpen }) {
  const p = roomProgress(room);
  const open = checklistFor(room).filter((i) => !i.done);
  // Green = settled, accent = actively in progress, neutral = nothing started.
  const tone = p.total === 0 ? "neutral" : p.done === p.total ? "green" : p.done > 0 ? "accent" : "neutral";

  return (
    <button
      data-item-id={room.id}
      onClick={onOpen}
      style={{
        textAlign: "left", background: COLORS.surface, border: `1px solid ${COLORS.border}`,
        borderRadius: 12, padding: 15, cursor: "pointer", fontFamily: FONT,
        display: "flex", flexDirection: "column", minWidth: 0,
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 14.5, fontWeight: 600, letterSpacing: "-0.01em", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {room.name || "Untitled room"}
          </div>
          <div style={{ fontSize: 11.5, color: COLORS.textFaint, marginTop: 1 }}>
            {[room.level, room.size].filter(Boolean).join(" · ") || "No level or size yet"}
          </div>
        </div>
        {p.total > 0 && <Chip tone={tone}>{p.done} / {p.total}</Chip>}
      </div>

      {/* Preview reads from the live checklist, never the frozen seed text, so it
          can never contradict the drawer. */}
      <p style={{ fontSize: 12.5, color: open.length ? COLORS.textMuted : COLORS.green, margin: "9px 0 0", lineHeight: 1.5,
        display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
        {p.total === 0
          ? "No must-haves yet — open to add what this room needs."
          : open.length === 0
            ? "Every must-have checked."
            : `${open.slice(0, 2).map((i) => i.text).join(" · ")}${open.length > 2 ? ` · +${open.length - 2} more` : ""}`}
      </p>

      <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 12 }}>
        {taskCount > 0
          ? <Chip>{taskCount} {taskCount === 1 ? "task" : "tasks"}</Chip>
          : <span style={{ fontSize: 11.5, color: COLORS.textFaint }}>No tasks yet</span>}
      </div>
    </button>
  );
}

export default function RoomsSection({ state, addRow, updRow, delRow, tasks, onAddTask, onToggleTask }) {
  const [openId, setOpenId] = useState(null);
  const [tab, setTab] = useState("overview");
  const [newTask, setNewTask] = useState("");
  const [newItem, setNewItem] = useState("");

  const room = state.rooms.find((r) => r.id === openId) || null;
  const roomTasks = useMemo(
    () => (room ? tasksFor(tasks, "room", room.id) : []),
    [tasks, room],
  );
  const countFor = useCallback((id) => tasksFor(tasks, "room", id).length, [tasks]);

  // Add a room and land the user straight inside it to name it — no hunting for
  // a "New room" card in a grid. addRow appends, so the newest visible row is
  // last; open it once React has committed the new state.
  const wantNewest = useRef(false);
  useEffect(() => {
    if (!wantNewest.current) return;
    wantNewest.current = false;
    const last = state.rooms[state.rooms.length - 1];
    if (last) { setOpenId(last.id); setTab("overview"); }
  }, [state.rooms]);

  function addRoom() {
    wantNewest.current = true;
    addRow("rooms", { name: "", level: "Main", size: "", must_haves: "", lighting: "", details: "" });
  }

  const patch = (p) => updRow("rooms", room.id, p);
  const setChecklist = (items) => patch({ must_have_items: items });

  const checklist = room ? checklistFor(room) : [];
  const p = room ? roomProgress(room) : { done: 0, total: 0, bps: 0 };

  function close() { setOpenId(null); setTab("overview"); setNewTask(""); setNewItem(""); }

  // ── Empty state — the first (and often only) screen he'll see here ─────────
  if (state.rooms.length === 0) {
    return (
      <>
        <SectionHead title="Rooms & Spaces" note="Every room in the house — what the architect designs from" />
        <div style={{ border: `1px solid ${COLORS.border}`, borderRadius: 16, background: COLORS.surface, padding: "40px 20px 44px", textAlign: "center", maxWidth: 480, margin: "8px auto 0" }}>
          <div style={{ width: 48, height: 48, margin: "0 auto 16px", borderRadius: 14, background: COLORS.accentSoft, display: "grid", placeItems: "center" }}>
            <Icon d={ICON.home} size={24} color={ACCENT} />
          </div>
          <h3 style={{ fontFamily: SERIF, fontSize: 21, fontWeight: 600, margin: "0 0 7px" }}>List your rooms</h3>
          <p style={{ fontSize: 13.5, color: COLORS.textMuted, lineHeight: 1.55, margin: "0 auto 20px", maxWidth: 380 }}>
            Add each room — kitchen, primary suite, garage — then jot down its must-haves.
            Each one turns into a checklist you can tick off as the build comes together.
          </p>
          <AddBtn label="Add your first room" onClick={addRoom} />
        </div>
      </>
    );
  }

  return (
    <>
      <SectionHead title="Rooms & Spaces" note={`${state.rooms.length} ${state.rooms.length === 1 ? "room" : "rooms"} · what the architect designs from`} />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(228px, 1fr))", gap: 12 }}>
        {state.rooms.map((r) => (
          <RoomCard key={r.id} room={r} taskCount={countFor(r.id)} onOpen={() => setOpenId(r.id)} />
        ))}
      </div>

      <div style={{ marginTop: 14 }}>
        <AddBtn label="Add room" onClick={addRoom} />
      </div>

      <DetailDrawer
        open={Boolean(room)}
        onClose={close}
        kind={room ? `Room${room.level ? ` · ${room.level}` : ""}` : ""}
        title={room?.name || "Untitled room"}
        activeTab={tab}
        onTab={setTab}
        tabs={[
          { id: "overview", label: "Overview" },
          { id: "tasks", label: "Tasks", count: roomTasks.length },
          { id: "notes", label: "Notes" },
        ]}
      >
        {room && tab === "overview" && (
          <>
            <div style={{ display: "flex", gap: 8, marginBottom: 18 }}>
              <input autoFocus={!room.name} value={room.name} onChange={(e) => patch({ name: e.target.value })} placeholder="Room name" style={{ ...txt(), flex: 2, fontWeight: 600 }} />
              <input value={room.level} onChange={(e) => patch({ level: e.target.value })} placeholder="Level" style={{ ...txt(), flex: 1, minWidth: 0 }} />
              <input value={room.size} onChange={(e) => patch({ size: e.target.value })} placeholder="Size" style={{ ...txt(), flex: 1, minWidth: 0 }} />
            </div>

            <SectionHead title="Must-haves" note={p.total ? `${p.done} of ${p.total} checked` : "None yet"} />
            {p.total > 0 && (
              <div style={{ height: 3, borderRadius: 2, background: COLORS.surfaceTint, marginBottom: 10, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${p.bps / 100}%`, background: ACCENT, borderRadius: 2 }} />
              </div>
            )}

            {checklist.map((item) => (
              <div key={item.id} style={{ display: "flex", alignItems: "flex-start", gap: 9, padding: "7px 0", borderBottom: `1px solid ${COLORS.border}` }}>
                <button
                  onClick={() => setChecklist(toggleMustHave(room, item.id))}
                  aria-label={item.done ? `Uncheck ${item.text}` : `Check ${item.text}`}
                  style={{
                    width: 17, height: 17, marginTop: 1, flexShrink: 0, cursor: "pointer",
                    borderRadius: 5, border: `1.5px solid ${item.done ? ACCENT : COLORS.borderStrong}`,
                    background: item.done ? ACCENT : COLORS.surface,
                    display: "grid", placeItems: "center",
                  }}
                >
                  {item.done && (
                    <svg viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="#fff" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  )}
                </button>
                <input
                  value={item.text}
                  onChange={(e) => setChecklist(editMustHave(room, item.id, e.target.value))}
                  style={{
                    flex: 1, border: "none", outline: "none", background: "transparent", fontFamily: FONT,
                    fontSize: 13, padding: 0, color: item.done ? COLORS.textFaint : COLORS.text,
                    textDecoration: item.done ? "line-through" : "none",
                  }}
                />
                <DelBtn onClick={() => setChecklist(removeMustHave(room, item.id))} />
              </div>
            ))}

            <form
              onSubmit={(e) => { e.preventDefault(); if (!newItem.trim()) return; setChecklist(addMustHave(room, newItem)); setNewItem(""); }}
              style={{ marginTop: 10 }}
            >
              <input
                value={newItem}
                onChange={(e) => setNewItem(e.target.value)}
                placeholder="Add a must-have, then press enter…"
                style={{ ...txt(), fontSize: 13 }}
              />
            </form>

            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 22 }}>
              <button onClick={() => { delRow("rooms", room.id); close(); }} style={{ ...btn("ghost") }}>
                <Icon d={ICON.x} size={13} /> Delete room
              </button>
            </div>
          </>
        )}

        {room && tab === "tasks" && (
          <>
            <form
              onSubmit={(e) => { e.preventDefault(); if (!newTask.trim()) return; onAddTask(room.id, newTask); setNewTask(""); }}
              style={{ marginBottom: 14 }}
            >
              <input
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                placeholder="Add a task for this room, then press enter…"
                style={{ ...txt(), fontSize: 13 }}
              />
            </form>

            {roomTasks.length === 0 && (
              <p style={{ fontSize: 13, color: COLORS.textFaint, padding: "8px 0" }}>
                Nothing to do here yet.
              </p>
            )}

            {roomTasks.map((t) => (
              <div key={t.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 0", borderBottom: `1px solid ${COLORS.border}` }}>
                <button
                  onClick={() => onToggleTask(t)}
                  aria-label={t.status === "done" ? `Reopen ${t.title}` : `Complete ${t.title}`}
                  style={{
                    width: 17, height: 17, flexShrink: 0, cursor: "pointer", borderRadius: 5,
                    border: `1.5px solid ${t.status === "done" ? ACCENT : COLORS.borderStrong}`,
                    background: t.status === "done" ? ACCENT : COLORS.surface,
                    display: "grid", placeItems: "center",
                  }}
                >
                  {t.status === "done" && (
                    <svg viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="#fff" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  )}
                </button>
                <span style={{
                  flex: 1, fontSize: 13.5, color: t.status === "done" ? COLORS.textFaint : COLORS.text,
                  textDecoration: t.status === "done" ? "line-through" : "none",
                }}>
                  {t.title}
                </span>
                {t.status === "blocked" && <Chip tone="amber">Blocked</Chip>}
              </div>
            ))}
          </>
        )}

        {room && tab === "notes" && (
          <div style={{ display: "grid", gap: 14 }}>
            <RoomField label="Lighting and electrical" value={room.lighting} onChange={(v) => patch({ lighting: v })} placeholder="Fixtures, switches, outlets, smart-home…" />
            <RoomField label="Other notes" value={room.details} onChange={(v) => patch({ details: v })} placeholder="Anything else for this room…" />
          </div>
        )}
      </DetailDrawer>
    </>
  );
}
