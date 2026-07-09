"use client";

// Punch List — room-by-room defects to fix before final payment.
//
// Photo-first and mobile-first: the natural flow is standing in a half-finished
// room, snapping the flaw, thumbing one line about it. So every item leads with
// a camera tile (`capture="environment"` opens the rear camera on a phone), and
// the room is PICKED from the rooms he already listed — never retyped — so two
// items in the same room can't drift apart on a stray capital letter.
//
// The one number that matters is "how many flaws are left", because that is the
// number that decides whether he releases the contractor's final payment. It is
// computed from the checkmarks, shown once at the top, and never asked of him.

import { useEffect, useRef, useState } from "react";

import {
  COLORS, FONT, SERIF, STYLES, ACCENT, Icon,
  Card, txt, DelBtn, Check, AddBtn, SelectPill, optionsFrom,
  AutoTextarea, ProgressRing, SectionHead,
} from "../ui";
import { CAMERA_ICON } from "./_common";

// Send one image to the build upload route and hand back its public URL.
// Defined locally rather than imported: the route is the only server contract
// this section needs, and a one-call helper isn't worth a shared primitive.
async function uploadImage(file) {
  const body = new FormData();
  body.append("file", file);
  const res = await fetch("/admin/build/upload", { method: "POST", body });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Upload failed.");
  return data.url;
}

export default function PunchListSection({ state, addRow, updRow, delRow }) {
  const items = state.punch_list || [];
  const rooms = state.rooms || [];

  const [uploadingId, setUploadingId] = useState(null);
  const [err, setErr] = useState("");

  // One hidden file input, re-pointed at whichever item's tile was tapped.
  const fileRef = useRef(null);
  const targetId = useRef(null);

  // After "Add punch item", scroll the fresh (blank) card into view and put the
  // cursor in its description — no hunting for a new empty row at the bottom of
  // a long list. addRow appends, so the newest visible item is always last.
  const wantNewest = useRef(false);
  useEffect(() => {
    if (!wantNewest.current) return;
    wantNewest.current = false;
    const last = items[items.length - 1];
    if (!last) return;
    const el = document.querySelector(`[data-punch-id="${last.id}"]`);
    if (!el) return;
    el.scrollIntoView({ block: "center", behavior: "smooth" });
    el.querySelector("textarea")?.focus();
  }, [items.length]); // eslint-disable-line react-hooks/exhaustive-deps

  function addItem() {
    wantNewest.current = true;
    addRow("punch_list", { room: "General", description: "", trade: "", done: false, photo: "" });
  }

  function pickPhoto(id) {
    targetId.current = id;
    setErr("");
    fileRef.current?.click();
  }

  async function onFile(e) {
    const file = e.target.files && e.target.files[0];
    e.target.value = "";
    const id = targetId.current;
    if (!file || !id) return;
    setErr("");
    setUploadingId(id);
    try {
      const url = await uploadImage(file);
      updRow("punch_list", id, { photo: url });
    } catch (ex) {
      setErr(ex instanceof Error ? ex.message : "Upload failed.");
    } finally {
      setUploadingId(null);
    }
  }

  const total = items.length;
  const fixed = items.filter((i) => i.done).length;
  const left = total - fixed;
  const pct = total ? Math.round((fixed / total) * 100) : 0;

  // Room options come from the rooms he already listed, plus "General" and any
  // room already stamped on an existing item — so the current value is always
  // in the list and nothing he typed in a past version disappears.
  const roomNames = [...new Set([
    "General",
    ...rooms.map((r) => r.name).filter(Boolean),
    ...items.map((i) => i.room).filter(Boolean),
  ])];
  const roomOptions = optionsFrom(roomNames);

  // ── Empty state — the first (and, until closeout, the only) screen here ────
  if (total === 0) {
    return (
      <>
        <SectionHead title="Punch list" note="Room-by-room flaws to fix before final payment" />
        <div style={{ ...STYLES.card, padding: "40px 20px 44px", textAlign: "center", maxWidth: 480, margin: "8px auto 0" }}>
          <div style={{ width: 48, height: 48, margin: "0 auto 16px", borderRadius: 14, background: COLORS.accentSoft, display: "grid", placeItems: "center" }}>
            <Icon d={CAMERA_ICON} size={24} color={ACCENT} />
          </div>
          <h3 style={{ fontFamily: SERIF, fontSize: 21, fontWeight: 600, margin: "0 0 7px" }}>Snap the flaws before you sign off</h3>
          <p style={{ fontSize: 13.5, color: COLORS.textMuted, lineHeight: 1.55, margin: "0 auto 20px", maxWidth: 390 }}>
            Walk the house room by room near closeout. Photograph every scratch, gap, and
            unfinished detail, note who fixes it, and hold final payment until the list is empty.
          </p>
          <AddBtn label="Add your first punch item" onClick={addItem} />
        </div>
        <input ref={fileRef} type="file" accept="image/*" capture="environment" onChange={onFile} style={{ display: "none" }} />
      </>
    );
  }

  return (
    <>
      <SectionHead title="Punch list" note="Room-by-room flaws to fix before final payment" />

      {/* Summary — the release-the-payment number, computed from the checks. */}
      <div style={{ ...STYLES.card, padding: 16, display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
        <ProgressRing pct={pct} caption="Fixed" size={92} stroke={8} />
        <div style={{ minWidth: 0 }}>
          <div style={{ fontFamily: SERIF, fontSize: 19, fontWeight: 600, letterSpacing: "-0.01em" }}>
            {left === 0 ? "Every flaw is fixed" : `${left} left to fix`}
          </div>
          <div style={{ fontSize: 12.5, color: left === 0 ? COLORS.green : COLORS.textMuted, marginTop: 5, lineHeight: 1.5 }}>
            {left === 0
              ? "You're cleared to release the final payment."
              : "Hold the final payment until this list is empty."}
          </div>
        </div>
      </div>

      {err && (
        <div style={{ margin: "0 0 12px", fontSize: 12.5, color: COLORS.red, fontWeight: 600 }}>{err}</div>
      )}

      {roomNames.map((room) => {
        const list = items.filter((i) => (i.room || "General") === room);
        if (!list.length) return null;
        const gLeft = list.filter((i) => !i.done).length;
        return (
          <div key={room} style={{ marginBottom: 18 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", padding: "0 2px 8px" }}>
              <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.06em", color: ACCENT, textTransform: "uppercase" }}>{room}</span>
              <span style={{ fontSize: 11, fontWeight: 700, color: gLeft ? COLORS.amber : COLORS.green }}>
                {gLeft ? `${gLeft} left` : "All fixed"}
              </span>
            </div>

            <div style={{ display: "grid", gap: 10 }}>
              {list.map((it) => {
                const uploading = uploadingId === it.id;
                return (
                  <div
                    key={it.id}
                    data-punch-id={it.id}
                    style={{ border: `1px solid ${COLORS.border}`, borderRadius: 14, overflow: "hidden", background: COLORS.surface, opacity: it.done ? 0.62 : 1 }}
                  >
                    {it.photo && (
                      <button
                        type="button"
                        onClick={() => pickPhoto(it.id)}
                        aria-label="Replace photo"
                        style={{ display: "block", width: "100%", padding: 0, border: "none", cursor: "pointer", background: COLORS.surfaceTint, position: "relative" }}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={it.photo} alt="" style={{ width: "100%", maxHeight: 240, objectFit: "cover", display: "block" }} />
                        <span style={{ position: "absolute", top: 8, right: 8, padding: "3px 8px", borderRadius: 999, fontSize: 10.5, fontWeight: 700, color: "#fff", background: "rgba(28,27,26,0.62)" }}>
                          {uploading ? "Uploading…" : "Replace"}
                        </span>
                      </button>
                    )}

                    <div style={{ padding: 11, display: "grid", gap: 9 }}>
                      {!it.photo && (
                        <button
                          type="button"
                          onClick={() => pickPhoto(it.id)}
                          disabled={uploading}
                          style={{
                            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                            width: "100%", height: 68, borderRadius: 10, cursor: uploading ? "default" : "pointer",
                            border: `1.5px dashed ${ACCENT}`, background: COLORS.accentSoft,
                            color: ACCENT, fontFamily: FONT, fontSize: 12.5, fontWeight: 700,
                          }}
                        >
                          <Icon d={CAMERA_ICON} size={18} color={ACCENT} />
                          {uploading ? "Uploading…" : "Add photo of the flaw"}
                        </button>
                      )}

                      <div style={{ display: "flex", gap: 9, alignItems: "flex-start" }}>
                        <div style={{ paddingTop: 2 }}>
                          <Check done={it.done} onClick={() => updRow("punch_list", it.id, { done: !it.done })} />
                        </div>
                        <AutoTextarea
                          value={it.description}
                          onChange={(v) => updRow("punch_list", it.id, { description: v })}
                          minRows={1}
                          placeholder="What needs fixing…"
                          style={{ flex: 1, minWidth: 0, textDecoration: it.done ? "line-through" : "none" }}
                        />
                        <DelBtn onClick={() => delRow("punch_list", it.id)} />
                      </div>

                      <div style={{ display: "flex", gap: 9, flexWrap: "wrap" }}>
                        <SelectPill
                          value={it.room || "General"}
                          options={roomOptions}
                          onChange={(r) => updRow("punch_list", it.id, { room: r })}
                          ariaLabel="Room"
                          minWidth={120}
                        />
                        <input
                          value={it.trade || ""}
                          onChange={(e) => updRow("punch_list", it.id, { trade: e.target.value })}
                          placeholder="Who fixes this…"
                          style={{ ...txt(), flex: 1, minWidth: 120 }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      <AddBtn label="Add punch item" onClick={addItem} />

      <input ref={fileRef} type="file" accept="image/*" capture="environment" onChange={onFile} style={{ display: "none" }} />
    </>
  );
}
