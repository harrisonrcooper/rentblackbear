"use client";

// References section.

import { useState } from "react";

import { COLORS, FONT, btn, Icon, ACCENT, Card, txt, DelBtn, AddBtn } from "../ui";

export default function ReferencesSection({ state, addRow, updRow, delRow }) {
  const [filter, setFilter] = useState("all");
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState({ url: "", title: "", tag: "", note: "" });

  const refs = state.references || [];
  const tags = [...new Set(refs.map((r) => r.tag).filter(Boolean))];
  const groups = filter === "all"
    ? [
        ...tags.map((t) => [t, refs.filter((r) => r.tag === t)]),
        ...(refs.some((r) => !r.tag) ? [["Untagged", refs.filter((r) => !r.tag)]] : []),
      ]
    : [[filter, refs.filter((r) => r.tag === filter)]];

  const domain = (u) => { try { return new URL(u).hostname.replace("www.", ""); } catch { return u; } };

  const submitNew = () => {
    if (!draft.url.trim()) return;
    addRow("references", {
      url: draft.url.trim(),
      title: draft.title.trim() || draft.url.trim(),
      tag: draft.tag.trim() || "Other",
      note: draft.note.trim(),
    });
    setDraft({ url: "", title: "", tag: "", note: "" });
    setAdding(false);
  };

  const refRow = (r) => (
    <div key={r.id} style={{ border: `1px solid ${COLORS.border}`, borderRadius: 12, padding: "10px 12px", marginBottom: 8 }}>
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <input
          value={r.title}
          onChange={(e) => updRow("references", r.id, { title: e.target.value })}
          placeholder="Title"
          style={{ ...txt(), flex: 1, fontWeight: 700 }}
        />
        <a
          href={r.url} target="_blank" rel="noreferrer" aria-label="Open link"
          style={{ width: 30, height: 30, borderRadius: 8, border: `1px solid ${COLORS.border}`, display: "grid", placeItems: "center", color: ACCENT, flexShrink: 0 }}
        >
          <Icon d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6 M15 3h6v6 M10 14L21 3" size={13} />
        </a>
        <DelBtn onClick={() => delRow("references", r.id)} />
      </div>
      <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
        <input
          value={r.tag}
          onChange={(e) => updRow("references", r.id, { tag: e.target.value })}
          placeholder="Tag"
          list="ref-tags"
          style={{ ...txt(), flex: "0 0 130px" }}
        />
        <input
          value={r.note}
          onChange={(e) => updRow("references", r.id, { note: e.target.value })}
          placeholder="Note"
          style={{ ...txt(), flex: 1 }}
        />
      </div>
      <div style={{ marginTop: 6, fontSize: 11, color: COLORS.textFaint, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
        {domain(r.url)}
      </div>
    </div>
  );

  return (
    <Card title="Reference library" sub={`${refs.length} links`}>
      <datalist id="ref-tags">{tags.map((t) => <option key={t} value={t} />)}</datalist>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", padding: "8px 2px 12px" }}>
        {["all", ...tags].map((t) => {
          const on = filter === t;
          return (
            <button
              key={t}
              onClick={() => setFilter(t)}
              style={{
                padding: "6px 11px", borderRadius: 100, cursor: "pointer", fontFamily: FONT,
                fontSize: 12, fontWeight: 700, whiteSpace: "nowrap",
                border: `1px solid ${on ? ACCENT : COLORS.border}`,
                background: on ? ACCENT : COLORS.surface,
                color: on ? "#fff" : COLORS.textMuted,
              }}
            >
              {t === "all" ? "All" : t}
            </button>
          );
        })}
      </div>
      {groups.map(([tag, list]) => (list.length === 0 ? null : (
        <div key={tag}>
          {filter === "all" && (
            <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 0.4, color: ACCENT, textTransform: "uppercase", padding: "8px 2px 6px" }}>
              {tag} · {list.length}
            </div>
          )}
          {list.map(refRow)}
        </div>
      )))}
      {adding ? (
        <div style={{ border: `1px solid ${COLORS.border}`, borderRadius: 12, padding: 12, marginTop: 6, display: "grid", gap: 8 }}>
          <input value={draft.url} onChange={(e) => setDraft({ ...draft, url: e.target.value })} placeholder="URL" style={txt()} />
          <input value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} placeholder="Title" style={txt()} />
          <div style={{ display: "flex", gap: 8 }}>
            <input value={draft.tag} onChange={(e) => setDraft({ ...draft, tag: e.target.value })} placeholder="Tag" list="ref-tags" style={{ ...txt(), flex: "0 0 130px" }} />
            <input value={draft.note} onChange={(e) => setDraft({ ...draft, note: e.target.value })} placeholder="Note" style={{ ...txt(), flex: 1 }} />
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            <button onClick={submitNew} style={{ ...btn("primary") }}>Add link</button>
            <button onClick={() => { setAdding(false); setDraft({ url: "", title: "", tag: "", note: "" }); }} style={{ ...btn("ghost") }}>Cancel</button>
          </div>
        </div>
      ) : (
        <AddBtn label="Add a reference" onClick={() => setAdding(true)} />
      )}
    </Card>
  );
}
