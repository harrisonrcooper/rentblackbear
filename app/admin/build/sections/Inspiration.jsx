"use client";

// Inspiration — one card per Pinterest board, plus your own photos.
//
// The whole point: he pastes a link and SEES the thing. A Pinterest board link
// mirrors the live board; a single pin renders as that pin's live embed; an
// image URL or a dropped photo shows as a tile. There is exactly one place to
// paste on each board and the card figures out what he gave it — he never has
// to know the difference between "a board" and "a pin" and "a picture".

import { useState, useEffect, useRef } from "react";

import { COLORS, STYLES, SERIF, inputStyle, btn, Icon, ICON, SectionHead, AddBtn } from "../ui";
import { genId } from "../../budget/lib/calc";

// Inline stroke icons (house rule: no emoji, no external SVG files).
const GALLERY_ICON = "M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2z M8.5 10a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z M21 15l-5-5L5 21";
const UPLOAD_ICON = "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4 M17 8l-5-5-5 5 M12 3v12";
const LINK_ICON = "M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1 M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1";
const PIN_ICON = "M12 21s-6-5.686-6-10a6 6 0 1 1 12 0c0 4.314-6 10-6 10z M12 11a2 2 0 1 0 0-4 2 2 0 0 0 0 4z";

const PIN_SCRIPT_ID = "pinit-js";
const PIN_SCRIPT_SRC = "https://assets.pinterest.com/js/pinit.js";

// ── URL classification ─────────────────────────────────────────────────────
// A tired person on a phone pastes whatever the Pinterest share sheet gives
// them: a full board link, a full pin link, a pin.it short link, or a plain
// image address. Each has to land in the right place with zero thought.

const isImagePath = (p) => /\.(jpe?g|png|webp|gif|avif)(\?|#|$)/i.test(p);
const isPinterestHost = (h) => /(^|\.)pinterest\.[a-z.]+$/i.test(h);

function parseUrl(raw) {
  const t = (raw || "").trim();
  if (!t) return null;
  try { return new URL(t); } catch { /* fall through — maybe he left off https */ }
  try { return new URL(`https://${t}`); } catch { return null; }
}
const segsOf = (u) => u.pathname.split("/").filter(Boolean);

function isPinUrl(raw) {
  const u = parseUrl(raw);
  if (!u || !isPinterestHost(u.hostname)) return false;
  const s = segsOf(u);
  return s[0] === "pin" && Boolean(s[1]);
}
function isBoardUrl(raw) {
  const u = parseUrl(raw);
  if (!u || !isPinterestHost(u.hostname)) return false;
  const s = segsOf(u);
  return s[0] !== "pin" && s.length >= 2;
}
function hostLabel(raw) {
  const u = parseUrl(raw);
  return u ? u.hostname.replace(/^www\./, "") : "link";
}

/** Returns { type, url }. type ∈ empty | invalid | board | pin | image | link. */
function classifyPaste(raw) {
  const t = (raw || "").trim();
  if (!t) return { type: "empty" };
  const u = parseUrl(t);
  // A real address has a dotted host. "kitchen ideas" is not a link.
  if (!u || !u.hostname.includes(".")) return { type: "invalid" };
  const url = u.href;
  if (isPinterestHost(u.hostname)) {
    const s = segsOf(u);
    if (s[0] === "pin" && s[1]) return { type: "pin", url };   // stored as a link, rendered as a live pin
    if (s.length >= 2) return { type: "board", url };           // mirrors the whole board
    return { type: "link", url };                               // a Pinterest profile is just a link
  }
  if (isImagePath(u.pathname)) return { type: "image", url };
  return { type: "link", url };                                 // includes pin.it short links
}

// ── Image upload ───────────────────────────────────────────────────────────
// Sends the file to the build upload route (Supabase Storage) and returns its
// public URL. Kept here because the route is the only way to persist a binary —
// state props carry data, not files.
async function uploadImage(file) {
  const body = new FormData();
  body.append("file", file);
  const res = await fetch("/admin/build/upload", { method: "POST", body });
  let data = {};
  try { data = await res.json(); } catch { /* non-JSON error body */ }
  if (!res.ok) throw new Error(data?.error || `Upload failed (${res.status}).`);
  return data.url;
}

// ── Pinterest live embed (board or single pin) ─────────────────────────────
function PinterestEmbed({ url, type }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const doAttr = type === "pin" ? "embedPin" : "embedBoard";
    const boardAttrs = type === "board"
      ? `data-pin-board-width="540" data-pin-scale-height="320" data-pin-scale-width="110" `
      : "";
    el.innerHTML =
      `<a data-pin-do="${doAttr}" ${boardAttrs}href="${(url || "").replace(/"/g, "")}"> </a>`;
    const build = () => { try { if (window.PinUtils) window.PinUtils.build(el); } catch { /* widget not ready */ } };
    if (window.PinUtils) { build(); return; }
    let s = document.getElementById(PIN_SCRIPT_ID);
    if (!s) {
      s = document.createElement("script");
      s.id = PIN_SCRIPT_ID;
      s.src = PIN_SCRIPT_SRC;
      s.async = true;
      s.onload = build;
      document.body.appendChild(s);
    } else {
      s.addEventListener("load", build);
      build();
    }
  }, [url, type]);
  return <div ref={ref} style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }} />;
}

// A close control that sits on top of imagery, where an outlined light button
// would vanish — so it carries its own hairline instead.
function OverlayClose({ onClick, label }) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      style={{
        position: "absolute", top: 6, right: 6, width: 24, height: 24, borderRadius: 7,
        border: "1px solid rgba(255,255,255,0.35)", cursor: "pointer",
        background: "rgba(15,23,41,0.62)", color: "#fff", display: "grid", placeItems: "center",
      }}
    >
      <Icon d={ICON.x} size={12} />
    </button>
  );
}

// ── The single paste-and-add control ───────────────────────────────────────
// Always visible, never behind a toggle. One box routes everything; a photo
// button covers his own pictures. Invalid text wiggles and says why.
function Adder({ onSetBoard, onAddItem, onFiles, uploading, hint }) {
  const [draft, setDraft] = useState("");
  const [err, setErr] = useState("");
  const inputRef = useRef(null);
  const fileRef = useRef(null);

  const shake = () => {
    const el = inputRef.current;
    if (el && el.animate) {
      el.animate(
        [
          { transform: "translateX(0)" }, { transform: "translateX(-5px)" },
          { transform: "translateX(5px)" }, { transform: "translateX(-3px)" },
          { transform: "translateX(0)" },
        ],
        { duration: 260, easing: "ease-in-out" },
      );
    }
  };

  const submit = () => {
    const c = classifyPaste(draft);
    if (c.type === "empty") return;
    if (c.type === "invalid") {
      setErr("That doesn't look like a link. Paste a web address that starts with http.");
      shake();
      return;
    }
    setErr("");
    if (c.type === "board") onSetBoard(c.url);
    else if (c.type === "image") onAddItem({ id: genId(), kind: "image", url: c.url, note: "" });
    else onAddItem({ id: genId(), kind: "link", url: c.url, note: "" }); // pin + pin.it + link all store as link
    setDraft("");
  };

  return (
    <div>
      {hint && (
        <div style={{ fontSize: 12.5, color: COLORS.textMuted, lineHeight: 1.5, marginBottom: 9 }}>
          {hint}
        </div>
      )}
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
        <input
          ref={inputRef}
          type="text"
          inputMode="url"
          value={draft}
          onChange={(e) => { setDraft(e.target.value); if (err) setErr(""); }}
          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); submit(); } }}
          placeholder="Paste a Pinterest link, pin, or image URL"
          aria-label="Paste a Pinterest link, pin, or image URL"
          aria-invalid={Boolean(err)}
          style={{ ...inputStyle(), flex: 1, minWidth: 160, fontWeight: 600, borderColor: err ? COLORS.red : COLORS.border }}
        />
        <button onClick={submit} style={{ ...btn("primary") }}>Add</button>
        <button onClick={() => fileRef.current && fileRef.current.click()} style={{ ...btn("ghost") }}>
          <Icon d={UPLOAD_ICON} size={14} />
          Add photo
        </button>
      </div>
      {err && (
        <div style={{ marginTop: 6, fontSize: 12, fontWeight: 600, color: COLORS.red }}>{err}</div>
      )}
      {uploading > 0 && (
        <div style={{ marginTop: 8, fontSize: 12, fontWeight: 700, color: COLORS.accent }}>
          Adding {uploading} {uploading === 1 ? "photo" : "photos"}…
        </div>
      )}
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        multiple
        style={{ display: "none" }}
        onChange={(e) => { onFiles(e.target.files); e.target.value = ""; }}
      />
    </div>
  );
}

// ── A single tile in a board's gallery ─────────────────────────────────────
function BoardItem({ item, onDelete }) {
  // A pinned pin renders live — not a bare blue link.
  if (item.kind === "link" && isPinUrl(item.url)) {
    return (
      <div style={{ position: "relative", flex: "0 0 auto" }}>
        <PinterestEmbed url={item.url} type="pin" />
        <OverlayClose onClick={onDelete} label="Remove pin" />
      </div>
    );
  }

  if (item.kind === "image") {
    return (
      <div style={{ position: "relative", width: 140, height: 140, borderRadius: 10, overflow: "hidden", border: `1px solid ${COLORS.border}`, background: COLORS.surfaceTint }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={item.url} alt={item.note || "Inspiration image"} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
        <OverlayClose onClick={onDelete} label="Remove image" />
      </div>
    );
  }

  // Any other link — including a pin.it short link, which can't be embedded
  // client-side. Show a tappable card that carries where it goes.
  const pinnish = /(^|\.)pin\.it$/i.test(hostLabel(item.url)) || isPinterestHost(parseUrl(item.url)?.hostname || "");
  return (
    <div style={{ position: "relative", width: 140, height: 140 }}>
      <a
        href={item.url}
        target="_blank"
        rel="noreferrer"
        style={{
          display: "flex", flexDirection: "column", gap: 7, alignItems: "center", justifyContent: "center",
          width: "100%", height: "100%", padding: 10, borderRadius: 10, textDecoration: "none",
          border: `1px solid ${COLORS.border}`, background: COLORS.surface, color: COLORS.textMuted,
        }}
      >
        <Icon d={pinnish ? PIN_ICON : LINK_ICON} size={20} color={pinnish ? COLORS.accent : COLORS.textMuted} />
        <span style={{ fontSize: 11, fontWeight: 700, textAlign: "center", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "100%" }}>
          {pinnish ? "Pinterest pin" : hostLabel(item.url)}
        </span>
      </a>
      <OverlayClose onClick={onDelete} label="Remove link" />
    </div>
  );
}

// ── One board card ─────────────────────────────────────────────────────────
function Board({ board, onChange, onDelete }) {
  const [uploading, setUploading] = useState(0);
  const [dragOver, setDragOver] = useState(false);
  const [uploadErr, setUploadErr] = useState("");

  const items = board.items || [];
  const hasMirror = Boolean(board.pinterest_url) && isBoardUrl(board.pinterest_url);
  const isEmpty = !hasMirror && items.length === 0;

  const handleFiles = async (files) => {
    const list = [...(files || [])].filter((f) => f.type.startsWith("image/"));
    if (list.length === 0) return;
    setUploadErr("");
    setUploading((n) => n + list.length);
    const added = [];
    for (const f of list) {
      try {
        const url = await uploadImage(f);
        added.push({ id: genId(), kind: "image", url, note: "" });
      } catch (e) {
        setUploadErr(e instanceof Error ? e.message : "Upload failed.");
      } finally {
        setUploading((n) => n - 1);
      }
    }
    if (added.length) onChange({ items: [...items, ...added] });
  };

  const addItem = (item) => onChange({ items: [...items, item] });
  // Soft delete: flag archived; visibleState hides it, the blob keeps it.
  const delItem = (id) => onChange({ items: items.map((x) => (x.id === id ? { ...x, archived: true } : x)) });

  return (
    <section
      style={{ ...STYLES.card, padding: 0, overflow: "hidden", marginBottom: 14, outline: dragOver ? `2px dashed ${COLORS.accent}` : "none" }}
      onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files); }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 14px 10px", borderBottom: `1px solid ${COLORS.surfaceTint}` }}>
        <input
          type="text"
          value={board.name}
          onChange={(e) => onChange({ name: e.target.value })}
          placeholder="Board name"
          aria-label="Board name"
          style={{ ...inputStyle(), flex: 1, fontWeight: 800, fontSize: 14, border: "none", background: "transparent", paddingLeft: 0 }}
        />
        <button
          onClick={onDelete}
          aria-label="Delete board"
          style={{
            width: 26, height: 26, borderRadius: 7, flexShrink: 0, cursor: "pointer",
            border: `1px solid ${COLORS.border}`, background: COLORS.surface, color: COLORS.textFaint,
            display: "grid", placeItems: "center",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = COLORS.redBg; e.currentTarget.style.color = COLORS.red; e.currentTarget.style.borderColor = COLORS.red; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = COLORS.surface; e.currentTarget.style.color = COLORS.textFaint; e.currentTarget.style.borderColor = COLORS.border; }}
        >
          <Icon d={ICON.x} size={13} />
        </button>
      </div>

      <div style={{ padding: "12px 14px 14px" }}>
        {hasMirror && (
          <div style={{ position: "relative", marginBottom: 12 }}>
            <PinterestEmbed url={board.pinterest_url} type="board" />
            <OverlayClose onClick={() => onChange({ pinterest_url: "" })} label="Remove board preview" />
          </div>
        )}

        {items.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 12 }}>
            {items.map((it) => (
              <BoardItem key={it.id} item={it} onDelete={() => delItem(it.id)} />
            ))}
          </div>
        )}

        {uploadErr && (
          <div style={{ marginBottom: 10, fontSize: 12, fontWeight: 600, color: COLORS.red }}>{uploadErr}</div>
        )}

        <Adder
          onSetBoard={(url) => onChange({ pinterest_url: url })}
          onAddItem={addItem}
          onFiles={handleFiles}
          uploading={uploading}
          hint={isEmpty ? "Paste your Pinterest board or a single pin and it shows up right here — live. Or drop in your own photos." : null}
        />
      </div>
    </section>
  );
}

export default function InspirationSection({ state, addRow, updRow, delRow }) {
  const boards = state.boards || [];

  if (boards.length === 0) {
    return (
      <>
        <SectionHead title="Inspiration" note="Pinterest boards and your own photos, room by room" />
        <div style={{ border: `1px solid ${COLORS.border}`, borderRadius: 16, background: COLORS.surface, padding: "40px 20px 44px", textAlign: "center", maxWidth: 480, margin: "8px auto 0" }}>
          <div style={{ width: 48, height: 48, margin: "0 auto 16px", borderRadius: 14, background: COLORS.accentSoft, display: "grid", placeItems: "center" }}>
            <Icon d={GALLERY_ICON} size={24} color={COLORS.accent} />
          </div>
          <h3 style={{ fontFamily: SERIF, fontSize: 21, fontWeight: 600, margin: "0 0 7px" }}>Start a board</h3>
          <p style={{ fontSize: 13.5, color: COLORS.textMuted, lineHeight: 1.55, margin: "0 auto 20px", maxWidth: 380 }}>
            Give it a name — Kitchen, Master suite, Exterior — then paste a Pinterest link
            or drop in photos. Everything you paste shows up live.
          </p>
          <AddBtn label="Add your first board" onClick={() => addRow("boards", { name: "New board", pinterest_url: "", items: [] })} />
        </div>
      </>
    );
  }

  return (
    <>
      <SectionHead title="Inspiration" note={`${boards.length} ${boards.length === 1 ? "board" : "boards"} · paste a link and see it live`} />
      {boards.map((b) => (
        <Board
          key={b.id}
          board={b}
          onChange={(patch) => updRow("boards", b.id, patch)}
          onDelete={() => delRow("boards", b.id)}
        />
      ))}
      <AddBtn label="Add a board" onClick={() => addRow("boards", { name: "New board", pinterest_url: "", items: [] })} />
    </>
  );
}
