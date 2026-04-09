"use client";
import { useState, useRef } from "react";

/* ── Icons ── */
const IPlus = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg>;
const ITrash = () => <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6"/></svg>;
const ICheck = () => <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>;
const IArrow = () => <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>;
const IClock = () => <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;
const IHome = () => <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/></svg>;
const IWrench = () => <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/></svg>;
const IStar = () => <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>;
const ITarget = () => <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>;

const TODAY_STR = new Date().toISOString().split("T")[0];

function daysAgo(dateStr) {
  if (!dateStr) return 999;
  return Math.floor((new Date() - new Date(dateStr + "T00:00:00")) / (1e3 * 60 * 60 * 24));
}

export default function IdeasTab({
  ideas, setIdeas, props, settings, uid, goTab,
  setRocks, setMaint, setImprovements, showConfirm,
}) {
  const _ac = settings?.adminAccent || "#4a7c59";
  const _acR = settings?.adminAccentRgb || "74,124,89";
  const inputRef = useRef(null);
  const [quickText, setQuickText] = useState("");
  const [expandedId, setExpandedId] = useState(null);
  const [propFilter, setPropFilter] = useState("all");
  const [dragId, setDragId] = useState(null);
  const [dragOverCol, setDragOverCol] = useState(null);

  const properties = props || [];

  // ── Data helpers ──
  const upd = (id, fields) => setIdeas(prev => prev.map(i => i.id === id ? { ...i, ...fields } : i));
  const del = (id) => showConfirm({
    title: "Delete idea?", body: "This can't be undone.", danger: true,
    onConfirm: () => setIdeas(prev => prev.filter(i => i.id !== id)),
  });

  // ── Quick capture ──
  const capture = () => {
    const t = quickText.trim();
    if (!t) return;
    setIdeas(prev => [{
      id: uid(), title: t, notes: "", property: "", cost: null,
      targetDate: "", column: "inbox", convertedTo: null,
      createdAt: TODAY_STR, doneAt: null,
    }, ...prev]);
    setQuickText("");
    inputRef.current?.focus();
  };

  // ── Convert bridges ──
  const convertTo = (idea, type) => {
    const propName = properties.find(p => p.id === idea.property)?.addr || "";
    if (type === "rock") {
      setRocks(prev => [{ id: uid(), title: idea.title, owner: "", status: "not-started", due: idea.targetDate || "", notes: idea.notes || "" }, ...(prev || [])]);
      upd(idea.id, { convertedTo: { type: "rock", date: TODAY_STR }, column: "done", doneAt: TODAY_STR });
      goTab("scorecard");
    } else if (type === "maint") {
      setMaint(prev => [{ id: uid(), title: idea.title, desc: idea.notes || "", status: "open", priority: "medium", created: TODAY_STR, propName, tenant: "", photos: 0 }, ...(prev || [])]);
      upd(idea.id, { convertedTo: { type: "maint", date: TODAY_STR }, column: "done", doneAt: TODAY_STR });
      goTab("maintenance");
    } else if (type === "improvement") {
      setImprovements(prev => [{ id: uid(), description: idea.title, amount: idea.cost || 0, date: TODAY_STR, propId: idea.property || "", category: "", notes: idea.notes || "" }, ...(prev || [])]);
      upd(idea.id, { convertedTo: { type: "improvement", date: TODAY_STR }, column: "done", doneAt: TODAY_STR });
    }
  };

  // ── Drag ──
  const handleDrop = (targetCol) => {
    if (!dragId) return;
    upd(dragId, { column: targetCol, ...(targetCol === "done" ? { doneAt: TODAY_STR } : {}) });
    setDragId(null); setDragOverCol(null);
  };

  // ── Filtered lists ──
  const pf = propFilter;
  const matchProp = i => pf === "all" || i.property === pf;
  // Migrate old ideas: if no "column" field, put in inbox
  const all = ideas.map(i => i.column ? i : { ...i, column: "inbox", createdAt: i.createdAt || TODAY_STR });
  const inbox = all.filter(i => i.column === "inbox" && matchProp(i));
  const next = all.filter(i => i.column === "next" && matchProp(i));
  const progress = all.filter(i => i.column === "progress" && matchProp(i));
  const done = all.filter(i => i.column === "done" && matchProp(i) && daysAgo(i.doneAt) < 30 && !i.convertedTo);
  const converted = all.filter(i => i.convertedTo && matchProp(i));
  const staleCount = inbox.filter(i => daysAgo(i.createdAt) >= 7).length;

  // ── Styles ──
  const btn = { padding: "4px 10px", borderRadius: 5, border: "1px solid rgba(0,0,0,.1)", fontSize: 10, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", background: "#fff", color: "#1a1714", display: "inline-flex", alignItems: "center", gap: 3, minHeight: 28, transition: "all .1s" };

  // ── Card ──
  const Card = ({ idea }) => {
    const age = daysAgo(idea.createdAt);
    const stale = idea.column === "inbox" && age >= 7;
    const rotten = idea.column === "inbox" && age >= 14;
    const open = expandedId === idea.id;
    const propObj = properties.find(p => p.id === idea.property);
    const conv = idea.convertedTo;

    return (
      <div draggable onDragStart={() => setDragId(idea.id)} onDragEnd={() => { setDragId(null); setDragOverCol(null); }}
        style={{ background: "#fff", borderRadius: 8, padding: "10px 12px", marginBottom: 5, border: rotten ? "1px solid rgba(196,92,74,.3)" : stale ? "1px solid rgba(212,168,83,.3)" : "1px solid rgba(0,0,0,.06)", cursor: "grab", transition: "box-shadow .15s", opacity: conv ? 0.55 : 1 }}
        onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,.08)"; }}
        onMouseLeave={e => { e.currentTarget.style.boxShadow = "none"; }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 6 }}>
          <div style={{ flex: 1, fontSize: 13, fontWeight: 600, color: "#1a1714", lineHeight: 1.4, cursor: "pointer" }} onClick={() => setExpandedId(open ? null : idea.id)}>
            {idea.title}
          </div>
          {stale && !rotten && <span style={{ fontSize: 8, fontWeight: 700, color: "#b8860b", background: "rgba(184,134,11,.1)", padding: "2px 6px", borderRadius: 100, whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: 2 }}><IClock /> {age}d</span>}
          {rotten && <span style={{ fontSize: 8, fontWeight: 700, color: "#c45c4a", background: "rgba(196,92,74,.1)", padding: "2px 6px", borderRadius: 100, whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: 2 }}><IClock /> {age}d</span>}
        </div>
        {propObj && <div style={{ fontSize: 9, color: "#7a7067", marginTop: 3, display: "flex", alignItems: "center", gap: 3 }}><IHome /> {propObj.addr || propObj.name}</div>}
        {(idea.cost || idea.targetDate) && <div style={{ display: "flex", gap: 8, marginTop: 4, fontSize: 10, color: "#7a7067" }}>{idea.cost ? `$${Number(idea.cost).toLocaleString()}` : ""}{idea.targetDate ? ` Target: ${idea.targetDate}` : ""}</div>}
        {conv && <div style={{ marginTop: 5, fontSize: 9, fontWeight: 700, color: "#2d6a3f", background: "rgba(45,106,63,.08)", padding: "3px 8px", borderRadius: 100, display: "inline-flex", alignItems: "center", gap: 3 }}><ICheck /> → {conv.type === "rock" ? "Rock" : conv.type === "maint" ? "Maintenance" : "Improvement"}</div>}

        {/* Expanded */}
        {open && !conv && (
          <div style={{ marginTop: 8, borderTop: "1px solid rgba(0,0,0,.06)", paddingTop: 8 }}>
            <input value={idea.title} onChange={e => upd(idea.id, { title: e.target.value })} style={{ width: "100%", padding: "5px 8px", borderRadius: 5, border: "1px solid rgba(0,0,0,.1)", fontSize: 12, fontFamily: "inherit", fontWeight: 600, marginBottom: 6 }} />
            <textarea value={idea.notes || ""} onChange={e => upd(idea.id, { notes: e.target.value })} rows={2} placeholder="Notes..." style={{ width: "100%", padding: "5px 8px", borderRadius: 5, border: "1px solid rgba(0,0,0,.1)", fontSize: 11, fontFamily: "inherit", resize: "vertical", marginBottom: 6 }} />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6, marginBottom: 8 }}>
              <div>
                <div style={{ fontSize: 9, fontWeight: 700, color: "#5c4a3a", marginBottom: 2 }}>Property</div>
                <select value={idea.property || ""} onChange={e => upd(idea.id, { property: e.target.value })} style={{ width: "100%", padding: "4px 6px", borderRadius: 4, border: "1px solid rgba(0,0,0,.1)", fontSize: 10, fontFamily: "inherit" }}>
                  <option value="">None</option>
                  {properties.map(p => <option key={p.id} value={p.id}>{p.addr || p.name}</option>)}
                </select>
              </div>
              <div>
                <div style={{ fontSize: 9, fontWeight: 700, color: "#5c4a3a", marginBottom: 2 }}>Est. Cost</div>
                <input type="number" value={idea.cost || ""} onChange={e => upd(idea.id, { cost: e.target.value })} placeholder="$" style={{ width: "100%", padding: "4px 6px", borderRadius: 4, border: "1px solid rgba(0,0,0,.1)", fontSize: 10, fontFamily: "inherit" }} />
              </div>
              <div>
                <div style={{ fontSize: 9, fontWeight: 700, color: "#5c4a3a", marginBottom: 2 }}>Target Date</div>
                <input type="date" value={idea.targetDate || ""} onChange={e => upd(idea.id, { targetDate: e.target.value })} style={{ width: "100%", padding: "4px 6px", borderRadius: 4, border: "1px solid rgba(0,0,0,.1)", fontSize: 10, fontFamily: "inherit" }} />
              </div>
            </div>
            <div style={{ fontSize: 9, fontWeight: 700, color: "#5c4a3a", marginBottom: 4 }}>Convert to:</div>
            <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 8 }}>
              <button onClick={() => convertTo(idea, "rock")} style={btn}><ITarget /> Rock</button>
              <button onClick={() => convertTo(idea, "maint")} style={btn}><IWrench /> Maintenance</button>
              <button onClick={() => convertTo(idea, "improvement")} style={btn}><IStar /> Improvement</button>
            </div>
            <div style={{ display: "flex", gap: 4, justifyContent: "space-between" }}>
              <div style={{ display: "flex", gap: 4 }}>
                {idea.column !== "next" && <button onClick={() => upd(idea.id, { column: "next" })} style={btn}><IArrow /> Next Up</button>}
                {idea.column !== "progress" && <button onClick={() => upd(idea.id, { column: "progress" })} style={btn}><IArrow /> In Progress</button>}
                {idea.column !== "done" && <button onClick={() => upd(idea.id, { column: "done", doneAt: TODAY_STR })} style={btn}><ICheck /> Done</button>}
              </div>
              <button onClick={() => del(idea.id)} style={{ ...btn, color: "#c45c4a", borderColor: "rgba(196,92,74,.2)" }}><ITrash /></button>
            </div>
          </div>
        )}
      </div>
    );
  };

  // ── Column ──
  const Col = ({ title, items, colKey, dot, empty }) => (
    <div onDragOver={e => { e.preventDefault(); setDragOverCol(colKey); }} onDragLeave={() => setDragOverCol(null)} onDrop={() => handleDrop(colKey)}
      style={{ flex: 1, minWidth: 220, background: dragOverCol === colKey ? `rgba(${_acR},.06)` : "rgba(0,0,0,.02)", borderRadius: 10, padding: "10px 10px 14px", border: dragOverCol === colKey ? `2px dashed ${_ac}` : "2px solid transparent", transition: "all .15s" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8, padding: "0 4px" }}>
        <div style={{ width: 8, height: 8, borderRadius: "50%", background: dot, flexShrink: 0 }} />
        <span style={{ fontSize: 12, fontWeight: 700, color: "#1a1714" }}>{title}</span>
        <span style={{ fontSize: 10, color: "#9ca3af", fontWeight: 600 }}>{items.length}</span>
      </div>
      {items.map(i => <Card key={i.id} idea={i} />)}
      {items.length === 0 && <div style={{ fontSize: 11, color: "#9ca3af", textAlign: "center", padding: "20px 0" }}>{empty}</div>}
    </div>
  );

  return (<>
    {/* Quick Capture */}
    <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
      <input ref={inputRef} value={quickText} onChange={e => setQuickText(e.target.value)} onKeyDown={e => { if (e.key === "Enter") capture(); }}
        placeholder="Capture an idea... (press Enter)" style={{ flex: 1, padding: "10px 14px", borderRadius: 8, border: "1px solid rgba(0,0,0,.12)", fontSize: 14, fontFamily: "inherit", color: "#1a1714" }} />
      <button onClick={capture} disabled={!quickText.trim()} style={{ padding: "10px 16px", borderRadius: 8, border: "none", background: _ac, color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", opacity: quickText.trim() ? 1 : 0.4, display: "flex", alignItems: "center", gap: 4, minHeight: 40 }}>
        <IPlus /> Add
      </button>
    </div>

    {/* Stale nudge */}
    {staleCount > 0 && (
      <div style={{ background: "rgba(212,168,83,.08)", border: "1px solid rgba(212,168,83,.2)", borderRadius: 8, padding: "8px 14px", marginBottom: 14, fontSize: 12, color: "#5c4a3a", display: "flex", alignItems: "center", gap: 6 }}>
        <IClock /> <strong>{staleCount}</strong> idea{staleCount !== 1 ? "s" : ""} {staleCount === 1 ? "has" : "have"} been in your inbox over a week. Triage them — act, convert, or delete.
      </div>
    )}

    {/* Property filter */}
    {properties.length > 0 && (
      <div style={{ display: "flex", gap: 5, marginBottom: 14, alignItems: "center", flexWrap: "wrap" }}>
        <span style={{ fontSize: 10, fontWeight: 700, color: "#5c4a3a" }}>Filter:</span>
        {[{ id: "all", label: "All" }, { id: "", label: "General" }, ...properties.map(p => ({ id: p.id, label: (p.addr || p.name || "").split(",")[0] }))].map(opt => (
          <button key={opt.id} onClick={() => setPropFilter(opt.id)} style={{ ...btn, fontSize: 10, padding: "3px 10px", minHeight: 24, background: propFilter === opt.id ? _ac : "#fff", color: propFilter === opt.id ? "#fff" : "#1a1714", border: propFilter === opt.id ? "none" : "1px solid rgba(0,0,0,.1)" }}>{opt.label}</button>
        ))}
      </div>
    )}

    {/* Inbox */}
    {inbox.length > 0 && (
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#1a1714", marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
          Inbox <span style={{ fontSize: 10, color: "#9ca3af", fontWeight: 600 }}>{inbox.length}</span>
          <span style={{ fontSize: 10, color: "#7a7067", fontWeight: 400, marginLeft: 4 }}>Triage: move to board, convert, or delete</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 6 }}>
          {inbox.map(i => <Card key={i.id} idea={i} />)}
        </div>
      </div>
    )}

    {/* Board */}
    <div style={{ fontSize: 13, fontWeight: 700, color: "#1a1714", marginBottom: 8 }}>Board</div>
    <div style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 8 }}>
      <Col title="Next Up" items={next} colKey="next" dot={_ac} empty="Drag ideas here" />
      <Col title="In Progress" items={progress} colKey="progress" dot="#d4a853" empty="Nothing in progress" />
      <Col title="Done" items={done} colKey="done" dot="#2d6a3f" empty="Complete ideas appear here" />
    </div>

    {/* Converted */}
    {converted.length > 0 && (
      <div style={{ marginTop: 16 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "#7a7067", marginBottom: 6 }}>Converted ({converted.length})</div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {converted.slice(0, 10).map(i => (
            <div key={i.id} style={{ fontSize: 10, color: "#7a7067", background: "rgba(0,0,0,.03)", borderRadius: 6, padding: "4px 10px", display: "flex", alignItems: "center", gap: 4 }}>
              <ICheck /> {i.title} <span style={{ color: "#2d6a3f" }}>→ {i.convertedTo?.type}</span>
            </div>
          ))}
        </div>
      </div>
    )}

    {/* Counts */}
    <div style={{ marginTop: 16, fontSize: 10, color: "#9ca3af", display: "flex", gap: 16 }}>
      <span>{all.length} total</span>
      <span>{inbox.length} inbox</span>
      <span>{next.length} next</span>
      <span>{progress.length} active</span>
      <span>{done.length + converted.length} done</span>
    </div>
  </>);
}
