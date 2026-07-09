"use client";

// Rooms section.

import { useState, useMemo, useCallback } from "react";

import { COLORS, FONT, btn, Icon, ICON, ACCENT, txt, DelBtn, Check, AddBtn, SectionHead, Chip, AutoTextarea } from "../ui";
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
            {room.name || "Room"}
          </div>
          <div style={{ fontSize: 11.5, color: COLORS.textFaint, marginTop: 1 }}>
            {[room.level, room.size].filter(Boolean).join(" · ") || "—"}
          </div>
        </div>
        {p.total > 0 && <Chip tone={tone}>{p.done} / {p.total}</Chip>}
      </div>

      {room.must_haves && (
        <p style={{
          fontSize: 12.5, color: COLORS.textMuted, margin: "9px 0 0", lineHeight: 1.5,
          display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
        }}>
          {room.must_haves}
        </p>
      )}

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

  const patch = (p) => updRow("rooms", room.id, p);
  const setChecklist = (items) => patch({ must_have_items: items });

  const checklist = room ? checklistFor(room) : [];
  const p = room ? roomProgress(room) : { done: 0, total: 0, bps: 0 };

  function close() { setOpenId(null); setTab("overview"); setNewTask(""); setNewItem(""); }

  return (
    <>
      <SectionHead title="Rooms & Spaces" note={`${state.rooms.length} rooms · what the architect designs from`} />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(228px, 1fr))", gap: 12 }}>
        {state.rooms.map((r) => (
          <RoomCard key={r.id} room={r} taskCount={countFor(r.id)} onOpen={() => setOpenId(r.id)} />
        ))}
      </div>

      <div style={{ marginTop: 14 }}>
        <AddBtn
          label="Add room"
          onClick={() => addRow("rooms", { name: "New room", level: "Main", size: "", must_haves: "", lighting: "", details: "" })}
        />
      </div>

      <DetailDrawer
        open={Boolean(room)}
        onClose={close}
        kind={room ? `Room${room.level ? ` · ${room.level}` : ""}` : ""}
        title={room?.name || ""}
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
              <input value={room.name} onChange={(e) => patch({ name: e.target.value })} placeholder="Room name" style={{ ...txt(), flex: 2, fontWeight: 600 }} />
              <input value={room.level} onChange={(e) => patch({ level: e.target.value })} placeholder="Level" style={{ ...txt(), flex: 1, minWidth: 0 }} />
              <input value={room.size} onChange={(e) => patch({ size: e.target.value })} placeholder="Size" style={{ ...txt(), flex: 1, minWidth: 0 }} />
            </div>

            <SectionHead title="Must-haves" note={p.total ? `${p.done} of ${p.total}` : "None yet"} />
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
                placeholder="Add a must-have…"
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
                placeholder="Add a task for this room…"
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
            <RoomField label="Lighting & electrical" value={room.lighting} onChange={(v) => patch({ lighting: v })} placeholder="Fixtures, switches, outlets, smart-home…" />
            <RoomField label="Other notes" value={room.details} onChange={(v) => patch({ details: v })} placeholder="Anything else for this room…" />
            <RoomField label="Original must-haves text" value={room.must_haves} onChange={(v) => patch({ must_haves: v })} placeholder="What this room needs…" />
            <p style={{ fontSize: 11.5, color: COLORS.textFaint, lineHeight: 1.5, margin: 0 }}>
              The checklist on the Overview tab was derived from this text and is now tracked separately.
              Editing here won&apos;t change the checklist.
            </p>
          </div>
        )}
      </DetailDrawer>
    </>
  );
}
