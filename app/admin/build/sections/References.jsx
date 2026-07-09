"use client";

// References — the research vault (brief §, ~36 links across house plans,
// products, videos, systems). With this many links the ONE job is: find the
// one you're thinking of, and open it, without hunting. So the screen leads
// with a search box that filters as you type, tag chips that jump straight to
// a bucket, and rows where the whole row IS the link — one tap opens it in a
// new tab. Editing (rename, re-file, note) is the quieter, secondary action:
// a pencil that slides open the same DetailDrawer every other section uses.
//
// State is mutated only through addRow / updRow / delRow — never by rewriting
// the array here, so a delete stays undoable.

import { useEffect, useMemo, useRef, useState } from "react";

import {
  COLORS, FONT, SERIF, ACCENT, btn, Icon, txt, DelBtn, AddBtn,
  Chip, SectionHead, AutoTextarea,
} from "../ui";
import DetailDrawer from "../DetailDrawer";

const EXTERNAL_ICON = "M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6 M15 3h6v6 M10 14L21 3";
const SEARCH_ICON = "M21 21l-4.35-4.35 M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14z";
const BOOKMARK_ICON = "M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z";
const PENCIL_ICON = "M12 20h9 M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z";

const UNTAGGED = "Untagged";

// The bucket a link sits in. An empty tag gets its own visible bucket rather
// than vanishing. "Inbox" is where a just-captured link lands, unsorted.
const tagOf = (r) => (r.tag || "").trim() || UNTAGGED;

// Inbox means "not filed yet" — amber, the section's one nudge to tidy. Every
// other bucket is inert, so it stays neutral. Colour that means something.
const toneFor = (tag) => (tag === "Inbox" ? "amber" : "neutral");

function domainOf(u) {
  const s = (u || "").trim();
  if (!s) return "";
  try { return new URL(s).hostname.replace(/^www\./, ""); }
  catch {
    try { return new URL(`https://${s}`).hostname.replace(/^www\./, ""); }
    catch { return s; }
  }
}

// Inbox floats to the top (needs filing), Untagged sinks to the bottom, the
// rest are alphabetical — a stable order so a chip never jumps under his thumb.
function orderTags(tags) {
  const rest = tags.filter((t) => t !== "Inbox" && t !== UNTAGGED).sort((a, b) => a.localeCompare(b));
  return [
    ...(tags.includes("Inbox") ? ["Inbox"] : []),
    ...rest,
    ...(tags.includes(UNTAGGED) ? [UNTAGGED] : []),
  ];
}

// A small square edit trigger — mirrors DelBtn's footprint so a row's two
// affordances line up. Deliberately quieter than the row itself: opening the
// link is the primary action, editing is not.
function EditBtn({ onClick, label }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      style={{
        width: 30, height: 30, borderRadius: 8, flexShrink: 0, cursor: "pointer",
        border: `1px solid ${COLORS.border}`, background: COLORS.surface, color: COLORS.textFaint,
        display: "grid", placeItems: "center",
      }}
      onMouseEnter={(e) => { e.currentTarget.style.color = ACCENT; e.currentTarget.style.borderColor = ACCENT; }}
      onMouseLeave={(e) => { e.currentTarget.style.color = COLORS.textFaint; e.currentTarget.style.borderColor = COLORS.border; }}
    >
      <Icon d={PENCIL_ICON} size={13} />
    </button>
  );
}

// One link. The whole left block is the tap target that opens the URL in a new
// tab; the pencil opens the editor. A link with no URL yet can't be opened, so
// its block opens the editor instead — no dead links.
function RefRow({ r, showTag, onEdit }) {
  const dom = domainOf(r.url);
  const title = (r.title || "").trim() || dom || "Untitled link";
  const note = (r.note || "").trim();
  const tag = tagOf(r);
  const hasUrl = Boolean((r.url || "").trim());

  const inner = (
    <>
      <span style={{
        width: 34, height: 34, borderRadius: 9, flexShrink: 0, background: COLORS.accentSoft,
        display: "grid", placeItems: "center",
      }}>
        <Icon d={EXTERNAL_ICON} size={15} color={ACCENT} />
      </span>
      <span style={{ minWidth: 0, display: "block" }}>
        <span style={{ display: "flex", alignItems: "center", gap: 7 }}>
          <span style={{ fontSize: 13.5, fontWeight: 700, color: COLORS.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {title}
          </span>
          {showTag && <Chip tone={toneFor(tag)}>{tag}</Chip>}
        </span>
        <span style={{ display: "block", fontSize: 11.5, color: COLORS.textFaint, marginTop: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {[dom || (hasUrl ? "" : "No link yet — tap to add one"), note].filter(Boolean).join("  ·  ")}
        </span>
      </span>
    </>
  );

  const blockStyle = {
    flex: 1, minWidth: 0, display: "flex", alignItems: "center", gap: 11,
    textDecoration: "none", textAlign: "left", background: "transparent", border: "none",
    padding: 0, cursor: "pointer", fontFamily: FONT, color: COLORS.text,
  };

  return (
    <div
      data-item-id={r.id}
      style={{
        display: "flex", alignItems: "center", gap: 8,
        border: `1px solid ${COLORS.border}`, borderRadius: 12,
        padding: "9px 10px 9px 11px", marginBottom: 8, background: COLORS.surface,
      }}
    >
      {hasUrl ? (
        <a href={r.url} target="_blank" rel="noreferrer" style={blockStyle} aria-label={`Open ${title}`}>
          {inner}
        </a>
      ) : (
        <button type="button" onClick={onEdit} style={blockStyle}>{inner}</button>
      )}
      <EditBtn onClick={onEdit} label={`Edit ${title}`} />
    </div>
  );
}

// The editor, hosted in the shared DetailDrawer. Tag is picked from the buckets
// that already exist (one tap to re-file) or a new one typed in — never a
// native dropdown control.
function RefEditor({ r, allTags, patch, onDelete }) {
  const [newTag, setNewTag] = useState("");
  const dom = domainOf(r.url);
  const current = tagOf(r);
  const options = orderTags([...new Set([...allTags, "Inbox"])]);

  return (
    <div style={{ display: "grid", gap: 16 }}>
      <div>
        <span style={{ display: "block", fontSize: 10.5, fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", color: COLORS.textFaint, marginBottom: 5 }}>Title</span>
        <input value={r.title || ""} onChange={(e) => patch({ title: e.target.value })} placeholder={dom || "What is this link?"} style={{ ...txt(), fontWeight: 700 }} />
      </div>

      <div>
        <span style={{ display: "block", fontSize: 10.5, fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", color: COLORS.textFaint, marginBottom: 5 }}>Link</span>
        <div style={{ display: "flex", gap: 8 }}>
          <input value={r.url || ""} onChange={(e) => patch({ url: e.target.value })} placeholder="https://…" style={{ ...txt(), flex: 1, minWidth: 0 }} />
          {(r.url || "").trim() && (
            <a href={r.url} target="_blank" rel="noreferrer" aria-label="Open link" style={{ ...btn("ghost"), textDecoration: "none", flexShrink: 0 }}>
              <Icon d={EXTERNAL_ICON} size={15} /> Open
            </a>
          )}
        </div>
      </div>

      <div>
        <span style={{ display: "block", fontSize: 10.5, fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", color: COLORS.textFaint, marginBottom: 7 }}>Bucket</span>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 8 }}>
          {options.map((t) => {
            const on = t === current;
            return (
              <button
                key={t}
                type="button"
                onClick={() => patch({ tag: t })}
                aria-pressed={on}
                style={{
                  border: `1px solid ${on ? ACCENT : COLORS.border}`,
                  background: on ? COLORS.accentSoft : COLORS.surface,
                  color: on ? ACCENT : COLORS.textMuted, borderRadius: 999,
                  padding: "5px 11px", fontSize: 11.5, fontWeight: on ? 700 : 600,
                  cursor: "pointer", fontFamily: FONT,
                }}
              >
                {t}
              </button>
            );
          })}
        </div>
        <form
          onSubmit={(e) => { e.preventDefault(); const v = newTag.trim(); if (!v) return; patch({ tag: v }); setNewTag(""); }}
        >
          <input value={newTag} onChange={(e) => setNewTag(e.target.value)} placeholder="New bucket, then press enter…" style={{ ...txt(), fontSize: 12.5 }} />
        </form>
      </div>

      <div>
        <span style={{ display: "block", fontSize: 10.5, fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", color: COLORS.textFaint, marginBottom: 5 }}>Note</span>
        <AutoTextarea value={r.note || ""} onChange={(v) => patch({ note: v })} minRows={3} placeholder="Why you saved it, what to compare, what to ask…" />
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 2 }}>
        <button onClick={onDelete} style={{ ...btn("ghost") }}><Icon d="M18 6L6 18 M6 6l12 12" size={13} /> Delete link</button>
      </div>
    </div>
  );
}

export default function ReferencesSection({ state, addRow, updRow, delRow }) {
  const refs = state.references || [];

  const [q, setQ] = useState("");
  const [filter, setFilter] = useState("all");
  const [openId, setOpenId] = useState(null);

  // Add a link and land straight in the editor to paste its URL — no hunting
  // for a blank row afterwards. addRow appends, so the newest row is last.
  const wantNewest = useRef(false);
  useEffect(() => {
    if (!wantNewest.current) return;
    wantNewest.current = false;
    const last = refs[refs.length - 1];
    if (last) setOpenId(last.id);
  }, [refs]);

  function addRef() {
    wantNewest.current = true;
    addRow("references", { url: "", title: "", tag: "Inbox", note: "" });
  }

  const tags = useMemo(() => orderTags([...new Set(refs.map(tagOf))]), [refs]);
  const countFor = (t) => refs.filter((r) => tagOf(r) === t).length;

  const query = q.trim().toLowerCase();
  const matches = (r) => {
    if (filter !== "all" && tagOf(r) !== filter) return false;
    if (!query) return true;
    const hay = [r.title, r.url, domainOf(r.url), r.tag, r.note].join(" ").toLowerCase();
    return hay.includes(query);
  };
  const filtered = refs.filter(matches);

  // Grouped by bucket only in the resting view. The moment he searches or picks
  // a bucket, it flattens to a single ranked list with the bucket shown per row.
  const grouped = filter === "all" && !query;

  const open = refs.find((r) => r.id === openId) || null;
  const patch = (p) => open && updRow("references", open.id, p);

  // ── Empty state — the first screen he'll see here, so it's the main one ──
  if (refs.length === 0) {
    return (
      <>
        <SectionHead title="References" note="Your research vault — every link in one place" />
        <div style={{ border: `1px solid ${COLORS.border}`, borderRadius: 16, background: COLORS.surface, padding: "40px 20px 44px", textAlign: "center", maxWidth: 480, margin: "8px auto 0" }}>
          <div style={{ width: 48, height: 48, margin: "0 auto 16px", borderRadius: 14, background: COLORS.accentSoft, display: "grid", placeItems: "center" }}>
            <Icon d={BOOKMARK_ICON} size={24} color={ACCENT} />
          </div>
          <h3 style={{ fontFamily: SERIF, fontSize: 21, fontWeight: 600, margin: "0 0 7px" }}>Save every link in one place</h3>
          <p style={{ fontSize: 13.5, color: COLORS.textMuted, lineHeight: 1.55, margin: "0 auto 20px", maxWidth: 380 }}>
            House plans, products, how-to videos, the systems you&apos;re weighing — drop each link
            here and file it in a bucket. Later, one search box finds any of them in a second.
          </p>
          <AddBtn label="Add your first link" onClick={addRef} />
        </div>
      </>
    );
  }

  return (
    <>
      <SectionHead title="References" note={`${refs.length} ${refs.length === 1 ? "link" : "links"} · your research vault`} />

      {/* Search — the fast path to any one link */}
      <span style={{ position: "relative", display: "block", marginBottom: 10 }}>
        <span style={{ position: "absolute", left: 11, top: 0, bottom: 0, display: "flex", alignItems: "center", pointerEvents: "none" }}>
          <Icon d={SEARCH_ICON} size={15} color={COLORS.textFaint} />
        </span>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search links by title, site, bucket or note…"
          aria-label="Search links"
          style={{ ...txt(), height: 40, paddingLeft: 34, paddingRight: q ? 36 : 12, fontWeight: 600 }}
        />
        {q && (
          <button
            type="button"
            onClick={() => setQ("")}
            aria-label="Clear search"
            style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", width: 26, height: 26, borderRadius: 7, border: `1px solid ${COLORS.border}`, background: COLORS.surface, color: COLORS.textFaint, cursor: "pointer", display: "grid", placeItems: "center" }}
          >
            <Icon d="M18 6L6 18 M6 6l12 12" size={12} />
          </button>
        )}
      </span>

      {/* Bucket chips — jump straight to one, with its count */}
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 14 }}>
        {["all", ...tags].map((t) => {
          const on = filter === t;
          const n = t === "all" ? refs.length : countFor(t);
          return (
            <button
              key={t}
              type="button"
              onClick={() => setFilter(t)}
              aria-pressed={on}
              style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                padding: "6px 11px", borderRadius: 100, cursor: "pointer", fontFamily: FONT,
                fontSize: 12, fontWeight: 700, whiteSpace: "nowrap",
                border: `1px solid ${on ? ACCENT : COLORS.border}`,
                background: on ? ACCENT : COLORS.surface,
                color: on ? "#fff" : COLORS.textMuted,
              }}
            >
              {t === "all" ? "All" : t}
              <span style={{ fontSize: 11, fontWeight: 700, opacity: on ? 0.85 : 0.6, fontVariantNumeric: "tabular-nums" }}>{n}</span>
            </button>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <div style={{ border: `1px solid ${COLORS.border}`, borderRadius: 12, padding: "26px 16px", textAlign: "center", color: COLORS.textMuted, fontSize: 13.5, background: COLORS.surface }}>
          {query ? <>No links match &ldquo;{q.trim()}&rdquo;.</> : "No links in this bucket yet."}
        </div>
      ) : grouped ? (
        tags.map((tag) => {
          const list = refs.filter((r) => tagOf(r) === tag);
          if (list.length === 0) return null;
          return (
            <div key={tag} style={{ marginBottom: 6 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 2px 8px" }}>
                <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.04em", color: tag === "Inbox" ? COLORS.amber : ACCENT, textTransform: "uppercase" }}>{tag}</span>
                <span style={{ fontSize: 11, fontWeight: 700, color: COLORS.textFaint, fontVariantNumeric: "tabular-nums" }}>{list.length}</span>
              </div>
              {list.map((r) => <RefRow key={r.id} r={r} showTag={false} onEdit={() => setOpenId(r.id)} />)}
            </div>
          );
        })
      ) : (
        filtered.map((r) => <RefRow key={r.id} r={r} showTag onEdit={() => setOpenId(r.id)} />)
      )}

      <div style={{ marginTop: 6 }}>
        <AddBtn label="Add link" onClick={addRef} />
      </div>

      <DetailDrawer
        open={Boolean(open)}
        onClose={() => setOpenId(null)}
        kind={open ? `Reference · ${tagOf(open)}` : ""}
        title={open ? ((open.title || "").trim() || domainOf(open.url) || "Untitled link") : ""}
      >
        {open && (
          <RefEditor
            key={open.id}
            r={open}
            allTags={[...new Set(refs.map(tagOf))].filter((t) => t !== UNTAGGED)}
            patch={patch}
            onDelete={() => { delRow("references", open.id); setOpenId(null); }}
          />
        )}
      </DetailDrawer>
    </>
  );
}
