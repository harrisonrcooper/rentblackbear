"use client";

// Inspiration section.

import { useState, useEffect, useRef } from "react";

import { COLORS, STYLES, inputStyle, btn, Icon, ICON, DelBtn, AddBtn } from "../ui";
import { genId } from "../../budget/lib/calc";

const PIN_RE = /^https?:\/\/([a-z0-9-]+\.)?pinterest\.[a-z.]+\//i;

function PinterestEmbed({ url }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || !PIN_RE.test(url || "")) return;
    el.innerHTML =
      `<a data-pin-do="embedBoard" data-pin-board-width="540" ` +
      `data-pin-scale-height="320" data-pin-scale-width="110" ` +
      `href="${(url || "").replace(/"/g, "")}"> </a>`;
    const build = () => { try { if (window.PinUtils) window.PinUtils.build(el); } catch { /* ignore */ } };
    if (window.PinUtils) { build(); return; }
    let s = document.getElementById("pinit-js");
    if (!s) {
      s = document.createElement("script");
      s.id = "pinit-js";
      s.src = "https://assets.pinterest.com/js/pinit.js";
      s.async = true;
      s.onload = build;
      document.body.appendChild(s);
    } else {
      s.addEventListener("load", build);
      build();
    }
  }, [url]);
  if (!PIN_RE.test(url || "")) return null;
  return <div ref={ref} style={{ overflowX: "auto", margin: "12px 0 4px", WebkitOverflowScrolling: "touch" }} />;
}

function Board({ board, onChange, onDelete }) {
  const [adding, setAdding] = useState(false);
  const [urlDraft, setUrlDraft] = useState("");
  const [uploading, setUploading] = useState(0);
  const [dragOver, setDragOver] = useState(false);
  const [err, setErr] = useState("");
  const fileRef = useRef(null);
  const pinValid = PIN_RE.test(board.pinterest_url || "");

  const handleFiles = async (files) => {
    const list = [...files].filter((f) => f.type.startsWith("image/"));
    if (list.length === 0) return;
    setErr("");
    setUploading((n) => n + list.length);
    const added = [];
    for (const f of list) {
      try {
        const url = await uploadImage(f);
        added.push({ id: genId(), kind: "image", url, note: "" });
      } catch (e) {
        setErr(e instanceof Error ? e.message : "Upload failed.");
      } finally {
        setUploading((n) => n - 1);
      }
    }
    if (added.length) onChange({ items: [...board.items, ...added] });
  };

  const addUrl = () => {
    const u = urlDraft.trim();
    if (!u) return;
    const isImg = /\.(jpe?g|png|webp|gif|avif)(\?|#|$)/i.test(u);
    onChange({ items: [...board.items, { id: genId(), kind: isImg ? "image" : "link", url: u, note: "" }] });
    setUrlDraft("");
    setAdding(false);
  };
  const delItem = (id) => onChange({ items: board.items.filter((x) => x.id !== id) });

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
          style={{ ...inputStyle(), flex: 1, fontWeight: 800, fontSize: 14 }}
        />
        <DelBtn onClick={onDelete} />
      </div>
      <div style={{ padding: "10px 14px 14px" }}>
        <input
          type="text"
          value={board.pinterest_url}
          onChange={(e) => onChange({ pinterest_url: e.target.value })}
          placeholder="Paste a public Pinterest board link to mirror it…"
          style={{ ...inputStyle(), width: "100%", boxSizing: "border-box", fontWeight: 600 }}
        />
        {board.pinterest_url && !pinValid && (
          <div style={{ marginTop: 5, fontSize: 11.5, color: COLORS.textFaint }}>
            That doesn&apos;t look like a Pinterest board URL (pinterest.com/you/board/).
          </div>
        )}
        {pinValid && <PinterestEmbed url={board.pinterest_url} />}

        {board.items.length > 0 && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))", gap: 8, marginTop: 12 }}>
            {board.items.map((it) => (
              <div key={it.id} style={{ position: "relative", borderRadius: 10, overflow: "hidden", border: `1px solid ${COLORS.border}`, aspectRatio: "1 / 1", background: COLORS.surfaceTint }}>
                {it.kind === "image" ? (
                  <img src={it.url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                ) : (
                  <a
                    href={it.url} target="_blank" rel="noreferrer"
                    style={{ display: "flex", flexDirection: "column", gap: 5, alignItems: "center", justifyContent: "center", height: "100%", padding: 8, textDecoration: "none", color: COLORS.textMuted }}
                  >
                    <Icon d="M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1 M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1" size={18} />
                    <span style={{ fontSize: 10.5, fontWeight: 600, textAlign: "center", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "100%" }}>
                      {(() => { try { return new URL(it.url).hostname.replace("www.", ""); } catch { return "link"; } })()}
                    </span>
                  </a>
                )}
                <button
                  onClick={() => delItem(it.id)}
                  aria-label="Remove"
                  style={{ position: "absolute", top: 4, right: 4, width: 22, height: 22, borderRadius: 6, border: "none", cursor: "pointer", background: "rgba(15,23,41,0.62)", color: "#fff", display: "grid", placeItems: "center" }}
                >
                  <Icon d={ICON.x} size={11} />
                </button>
              </div>
            ))}
          </div>
        )}

        {uploading > 0 && (
          <div style={{ marginTop: 10, fontSize: 12, fontWeight: 700, color: COLORS.accent }}>Uploading {uploading}…</div>
        )}
        {err && <div style={{ marginTop: 8, fontSize: 12, fontWeight: 600, color: COLORS.red }}>{err}</div>}

        {adding ? (
          <div style={{ marginTop: 10, display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
            <button onClick={() => fileRef.current && fileRef.current.click()} style={{ ...btn("ghost") }}>
              <Icon d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4 M17 8l-5-5-5 5 M12 3v12" size={14} />
              Upload images
            </button>
            <input
              type="text"
              value={urlDraft}
              onChange={(e) => setUrlDraft(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") addUrl(); }}
              placeholder="…or paste an image / link URL"
              style={{ ...inputStyle(), flex: 1, minWidth: 150, fontWeight: 600 }}
            />
            <button onClick={addUrl} style={{ ...btn("primary") }}>Add</button>
            <button onClick={() => { setAdding(false); setUrlDraft(""); }} style={{ ...btn("ghost") }}>Cancel</button>
          </div>
        ) : (
          <button onClick={() => setAdding(true)} style={{ ...btn("ghost"), marginTop: 10 }}>
            <Icon d={["M12 5v14", "M5 12h14"]} size={13} />
            Add images or links
          </button>
        )}
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          multiple
          style={{ display: "none" }}
          onChange={(e) => { handleFiles(e.target.files); e.target.value = ""; }}
        />
      </div>
    </section>
  );
}

export default function InspirationSection({ state, addRow, updRow, delRow }) {
  return (
    <div>
      <div style={{ fontSize: 12.5, color: COLORS.textMuted, padding: "2px 2px 12px", lineHeight: 1.5 }}>
        Paste a public Pinterest board link to mirror it live, drag in your own screenshots and
        photos, or paste image / link URLs. Organize by room or theme.
      </div>
      {state.boards.map((b) => (
        <Board
          key={b.id}
          board={b}
          onChange={(patch) => updRow("boards", b.id, patch)}
          onDelete={() => delRow("boards", b.id)}
        />
      ))}
      <AddBtn label="Add a board" onClick={() => addRow("boards", { name: "New board", pinterest_url: "", items: [] })} />
    </div>
  );
}
