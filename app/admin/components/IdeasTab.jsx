"use client";
import { useState, useRef, useEffect, useCallback } from "react";

/* ── Icons (flat SVG, no emoji) ── */
const IPlus = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg>;
const ITrash = () => <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6"/></svg>;
const ICheck = () => <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>;
const IArrow = () => <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>;
const IClock = () => <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;
const IHome = () => <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/></svg>;
const IWrench = () => <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/></svg>;
const IStar = () => <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>;
const ITarget = () => <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>;
const IAlert = () => <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>;
const IDollar = () => <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>;
const ISearch = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>;
const IInbox = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11L2 12v6a2 2 0 002 2h16a2 2 0 002-2v-6l-3.45-6.89A2 2 0 0016.76 4H7.24a2 2 0 00-1.79 1.11z"/></svg>;

const TODAY_STR = new Date().toISOString().split("T")[0];
function daysAgo(d) { if (!d) return 999; return Math.floor((new Date() - new Date(d + "T00:00:00")) / 864e5); }

export default function IdeasTab({
  ideas, setIdeas, props, settings, uid, goTab,
  setRocks, setMaint, setImprovements, setIssues, setExpenses,
  showConfirm,
}) {
  const _ac = settings?.adminAccent || "#4a7c59";
  const _acR = settings?.adminAccentRgb || "74,124,89";
  const _gold = settings?.themeGold || "#d4a853";
  const _green = settings?.themeGreen || "#2d6a3f";
  const _red = settings?.themeRed || "#c45c4a";
  const inputRef = useRef(null);
  const [quickText, setQuickText] = useState("");
  const [expandedId, setExpandedId] = useState(null);
  const [propFilter, setPropFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState(null);
  const [showAllConverted, setShowAllConverted] = useState(false);

  // Touch drag state (mobile support)
  const [touchDragId, setTouchDragId] = useState(null);
  const touchTimeout = useRef(null);

  const properties = props || [];

  // ── Migrate old ideas on first render ──
  useEffect(() => {
    const needsMigration = ideas.some(i => !i.column);
    if (needsMigration) {
      setIdeas(prev => prev.map(i => i.column ? i : {
        ...i, column: i.status === "Done" ? "done" : i.status === "Building" ? "progress" : i.status === "Planned" ? "next" : "inbox",
        createdAt: i.createdAt || TODAY_STR, doneAt: i.status === "Done" ? TODAY_STR : null,
        convertedTo: null, cost: null, targetDate: "", property: "",
      }));
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Helpers ──
  const upd = (id, fields) => setIdeas(prev => prev.map(i => i.id === id ? { ...i, ...fields } : i));
  const del = (id) => showConfirm({
    title: "Delete this idea?", body: "This will permanently remove it. This cannot be undone.",
    danger: true, onConfirm: () => setIdeas(prev => prev.filter(i => i.id !== id)),
  });
  const flash = (msg) => { setToast(msg); setTimeout(() => setToast(null), 2500); };

  // ── Quick capture ──
  const capture = () => {
    const t = quickText.trim();
    if (!t) return;
    setIdeas(prev => [{ id: uid(), title: t, notes: "", property: "", cost: null, targetDate: "", column: "inbox", convertedTo: null, createdAt: TODAY_STR, doneAt: null }, ...prev]);
    setQuickText("");
    inputRef.current?.focus();
    flash("Idea captured");
  };

  // ── Convert bridges ──
  const CONVERT_INFO = {
    rock: { label: "Quarterly Rock", desc: "Creates a goal in your Scorecard tab under Rocks. Use this for big-picture items you want to track over the quarter.", tab: "scorecard" },
    maint: { label: "Maintenance Request", desc: "Creates a work order in the Maintenance tab. Use this for repairs, fixes, or anything a vendor needs to handle.", tab: "maintenance" },
    issue: { label: "Issue to Discuss", desc: "Creates an entry in the Issues tab. Use this for problems that need a decision — not a repair, but something to talk through.", tab: null },
    expense: { label: "Expense", desc: "Logs a line item in your Accounting ledger. Use this if you already spent money or plan to. Cost will be pre-filled if you set one.", tab: "accounting" },
    improvement: { label: "Capital Improvement", desc: "Logs a property upgrade in your Portfolio records for tax/depreciation tracking (new roof, remodel, appliances, etc). This is NOT a regular expense.", tab: "properties" },
  };
  const convertTo = (idea, type) => {
    const info = CONVERT_INFO[type];
    showConfirm({
      title: `Create ${info.label}?`,
      body: `"${idea.title}" → ${info.desc}`,
      onConfirm: () => {
        const propObj = properties.find(p => p.id === idea.property);
        const propName = propObj?.addr || propObj?.name || "";
        if (type === "rock") {
          setRocks(prev => [{ id: uid(), title: idea.title, owner: "", status: "not-started", due: idea.targetDate || "", notes: idea.notes || "" }, ...(prev || [])]);
        } else if (type === "maint") {
          setMaint(prev => [{ id: uid(), title: idea.title, desc: idea.notes || "", status: "open", priority: "medium", created: TODAY_STR, propName, tenant: "", photos: 0 }, ...(prev || [])]);
        } else if (type === "issue") {
          setIssues(prev => [{ id: uid(), title: idea.title, priority: "medium", created: TODAY_STR, notes: idea.notes || "" }, ...(prev || [])]);
        } else if (type === "expense") {
          setExpenses(prev => [{ id: uid(), date: TODAY_STR, vendor: "", category: "", description: idea.title, amount: Number(idea.cost) || 0, propId: idea.property || "", notes: idea.notes || "" }, ...(prev || [])]);
        } else if (type === "improvement") {
          setImprovements(prev => [{ id: uid(), description: idea.title, amount: Number(idea.cost) || 0, date: TODAY_STR, propId: idea.property || "", category: "", notes: idea.notes || "" }, ...(prev || [])]);
        }
        upd(idea.id, { convertedTo: { type, label: info.label, date: TODAY_STR }, column: "done", doneAt: TODAY_STR });
        flash(`Created as ${info.label}`);
      },
    });
  };

  // ── Column move ──
  const moveTo = (id, col) => {
    upd(id, { column: col, ...(col === "done" ? { doneAt: TODAY_STR } : {}) });
    flash(col === "done" ? "Marked done" : `Moved to ${col === "next" ? "Next Up" : col === "progress" ? "In Progress" : col === "inbox" ? "Inbox" : col}`);
  };

  // ── Desktop drag ──
  const [dragId, setDragId] = useState(null);
  const [dragOverCol, setDragOverCol] = useState(null);
  const handleDrop = (col) => { if (dragId) { moveTo(dragId, col); setDragId(null); setDragOverCol(null); } };

  // ── Filtered + searched ──
  const matchProp = i => propFilter === "all" || (i.property || "") === propFilter;
  const matchSearch = i => !search || [i.title, i.notes].some(f => (f || "").toLowerCase().includes(search.toLowerCase()));
  const filtered = ideas.filter(i => matchProp(i) && matchSearch(i));
  const inbox = filtered.filter(i => i.column === "inbox");
  const next = filtered.filter(i => i.column === "next");
  const progress = filtered.filter(i => i.column === "progress");
  const done = filtered.filter(i => i.column === "done" && !i.convertedTo && daysAgo(i.doneAt) < 30);
  const converted = filtered.filter(i => i.convertedTo);
  const staleCount = inbox.filter(i => daysAgo(i.createdAt) >= 7).length;
  const totalActive = inbox.length + next.length + progress.length;

  // ── Styles ──
  const btn = { padding: "6px 12px", borderRadius: 6, border: "1px solid rgba(0,0,0,.1)", fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", background: "#fff", color: "#1a1714", display: "inline-flex", alignItems: "center", gap: 4, minHeight: 36, transition: "all .1s" };
  const btnSm = { ...btn, padding: "4px 10px", fontSize: 10, minHeight: 32 };
  const filterBtn = (active) => ({ ...btn, fontSize: 11, padding: "5px 14px", minHeight: 36, background: active ? _ac : "#fff", color: active ? "#fff" : "#1a1714", border: active ? "none" : "1px solid rgba(0,0,0,.1)" });

  // ── Card ──
  const Card = ({ idea }) => {
    const age = daysAgo(idea.createdAt);
    const stale = idea.column === "inbox" && age >= 7;
    const rotten = idea.column === "inbox" && age >= 14;
    const open = expandedId === idea.id;
    const propObj = properties.find(p => p.id === idea.property);
    const conv = idea.convertedTo;

    return (
      <div
        draggable={!conv}
        onDragStart={() => !conv && setDragId(idea.id)}
        onDragEnd={() => { setDragId(null); setDragOverCol(null); }}
        // Touch support: long press to start "drag", then tap a column button
        onTouchStart={() => { if (!conv) touchTimeout.current = setTimeout(() => setTouchDragId(idea.id), 400); }}
        onTouchEnd={() => { clearTimeout(touchTimeout.current); }}
        style={{
          background: "#fff", borderRadius: 10, padding: "12px 14px", marginBottom: 6,
          border: rotten ? `1px solid rgba(${_red.replace("#","").match(/../g).map(h=>parseInt(h,16)).join(",")},.3)` : stale ? `1px solid rgba(${_gold.replace("#","").match(/../g).map(h=>parseInt(h,16)).join(",")},.3)` : "1px solid rgba(0,0,0,.06)",
          cursor: conv ? "default" : "grab", transition: "box-shadow .15s", opacity: conv ? 0.5 : 1,
          boxShadow: touchDragId === idea.id ? `0 0 0 2px ${_ac}` : "none",
        }}
        onMouseEnter={e => { if (!conv) e.currentTarget.style.boxShadow = "0 2px 10px rgba(0,0,0,.08)"; }}
        onMouseLeave={e => { if (touchDragId !== idea.id) e.currentTarget.style.boxShadow = "none"; }}
      >
        {/* Title row */}
        <div style={{ display: "flex", alignItems: "flex-start", gap: 6 }} onClick={() => setExpandedId(open ? null : idea.id)}>
          <div style={{ flex: 1, fontSize: 13, fontWeight: 600, color: "#1a1714", lineHeight: 1.4, cursor: "pointer", overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box", WebkitLineClamp: open ? 99 : 2, WebkitBoxOrient: "vertical" }}>
            {idea.title}
          </div>
          {stale && !rotten && <span style={{ fontSize: 8, fontWeight: 700, color: _gold, background: `rgba(${_gold.replace("#","").match(/../g).map(h=>parseInt(h,16)).join(",")},.1)`, padding: "2px 6px", borderRadius: 100, whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: 2, flexShrink: 0 }}><IClock /> {age}d</span>}
          {rotten && <span style={{ fontSize: 8, fontWeight: 700, color: _red, background: `rgba(${_red.replace("#","").match(/../g).map(h=>parseInt(h,16)).join(",")},.1)`, padding: "2px 6px", borderRadius: 100, whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: 2, flexShrink: 0 }}><IClock /> {age}d</span>}
        </div>

        {/* Meta: property, cost, target */}
        {propObj && <div style={{ fontSize: 9, color: "#7a7067", marginTop: 4, display: "flex", alignItems: "center", gap: 3 }}><IHome /> {propObj.addr || propObj.name}</div>}
        {(idea.cost || idea.targetDate) && <div style={{ display: "flex", gap: 8, marginTop: 3, fontSize: 10, color: "#7a7067" }}>{idea.cost ? `$${Number(idea.cost).toLocaleString()}` : ""}{idea.targetDate ? ` By ${idea.targetDate}` : ""}</div>}
        {idea.notes && !open && <div style={{ fontSize: 10, color: "#9ca3af", marginTop: 3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{idea.notes}</div>}

        {/* Converted badge */}
        {conv && <div style={{ marginTop: 6, fontSize: 9, fontWeight: 700, color: _green, background: `rgba(${_green.replace("#","").match(/../g).map(h=>parseInt(h,16)).join(",")},.08)`, padding: "3px 8px", borderRadius: 100, display: "inline-flex", alignItems: "center", gap: 3 }}><ICheck /> {conv.label || (conv.type === "rock" ? "Quarterly Goal" : conv.type === "maint" ? "Maintenance Request" : conv.type === "issue" ? "Issue" : conv.type === "expense" ? "Expense" : "Capital Improvement")}</div>}

        {/* Touch drag: show column buttons */}
        {touchDragId === idea.id && !conv && (
          <div style={{ marginTop: 8, padding: 8, background: `rgba(${_acR},.06)`, borderRadius: 8, display: "flex", gap: 4, flexWrap: "wrap" }}>
            <span style={{ fontSize: 10, fontWeight: 700, color: "#5c4a3a", width: "100%", marginBottom: 2 }}>Move to:</span>
            {idea.column !== "inbox" && <button onClick={() => { moveTo(idea.id, "inbox"); setTouchDragId(null); }} style={btnSm}><IInbox /> Inbox</button>}
            {idea.column !== "next" && <button onClick={() => { moveTo(idea.id, "next"); setTouchDragId(null); }} style={btnSm}><IArrow /> Next Up</button>}
            {idea.column !== "progress" && <button onClick={() => { moveTo(idea.id, "progress"); setTouchDragId(null); }} style={btnSm}><IArrow /> In Progress</button>}
            {idea.column !== "done" && <button onClick={() => { moveTo(idea.id, "done"); setTouchDragId(null); }} style={btnSm}><ICheck /> Done</button>}
            <button onClick={() => setTouchDragId(null)} style={{ ...btnSm, color: "#9ca3af" }}>Cancel</button>
          </div>
        )}

        {/* Expanded edit */}
        {open && !conv && (
          <div style={{ marginTop: 10, borderTop: "1px solid rgba(0,0,0,.06)", paddingTop: 10 }}>
            <input value={idea.title} onChange={e => upd(idea.id, { title: e.target.value })} style={{ width: "100%", padding: "7px 10px", borderRadius: 6, border: "1px solid rgba(0,0,0,.1)", fontSize: 13, fontFamily: "inherit", fontWeight: 600, marginBottom: 8 }} />
            <textarea value={idea.notes || ""} onChange={e => upd(idea.id, { notes: e.target.value })} rows={2} placeholder="Add notes..." style={{ width: "100%", padding: "7px 10px", borderRadius: 6, border: "1px solid rgba(0,0,0,.1)", fontSize: 12, fontFamily: "inherit", resize: "vertical", marginBottom: 8 }} />

            {/* Property / Cost / Date — responsive grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: 8, marginBottom: 10 }}>
              <div>
                <div style={{ fontSize: 10, fontWeight: 700, color: "#5c4a3a", marginBottom: 3 }}>Property</div>
                <select value={idea.property || ""} onChange={e => upd(idea.id, { property: e.target.value })} style={{ width: "100%", padding: "6px 8px", borderRadius: 5, border: "1px solid rgba(0,0,0,.1)", fontSize: 11, fontFamily: "inherit", minHeight: 34 }}>
                  <option value="">None</option>
                  {properties.map(p => <option key={p.id} value={p.id}>{p.addr || p.name}</option>)}
                </select>
              </div>
              <div>
                <div style={{ fontSize: 10, fontWeight: 700, color: "#5c4a3a", marginBottom: 3 }}>Est. Cost</div>
                <input type="number" value={idea.cost ?? ""} onChange={e => upd(idea.id, { cost: e.target.value ? Number(e.target.value) : null })} placeholder="$" style={{ width: "100%", padding: "6px 8px", borderRadius: 5, border: "1px solid rgba(0,0,0,.1)", fontSize: 11, fontFamily: "inherit", minHeight: 34 }} />
              </div>
              <div>
                <div style={{ fontSize: 10, fontWeight: 700, color: "#5c4a3a", marginBottom: 3 }}>Target Date</div>
                <input type="date" value={idea.targetDate || ""} onChange={e => upd(idea.id, { targetDate: e.target.value })} style={{ width: "100%", padding: "6px 8px", borderRadius: 5, border: "1px solid rgba(0,0,0,.1)", fontSize: 11, fontFamily: "inherit", minHeight: 34 }} />
              </div>
            </div>

            {/* Convert bridges */}
            <div style={{ fontSize: 10, fontWeight: 700, color: "#5c4a3a", marginBottom: 4 }}>Act on this idea:</div>
            <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 10 }}>
              <button onClick={() => convertTo(idea, "rock")} style={btnSm}><ITarget /> Quarterly Goal</button>
              <button onClick={() => convertTo(idea, "maint")} style={btnSm}><IWrench /> Maintenance Request</button>
              <button onClick={() => convertTo(idea, "issue")} style={btnSm}><IAlert /> Issue to Discuss</button>
              <button onClick={() => convertTo(idea, "expense")} style={btnSm}><IDollar /> Log Expense</button>
              <button onClick={() => convertTo(idea, "improvement")} style={btnSm}><IStar /> Capital Improvement</button>
            </div>

            {/* Move + delete */}
            <div style={{ display: "flex", gap: 4, justifyContent: "space-between", flexWrap: "wrap" }}>
              <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                {idea.column !== "inbox" && <button onClick={() => moveTo(idea.id, "inbox")} style={btnSm}><IInbox /> Inbox</button>}
                {idea.column !== "next" && <button onClick={() => moveTo(idea.id, "next")} style={btnSm}><IArrow /> Next Up</button>}
                {idea.column !== "progress" && <button onClick={() => moveTo(idea.id, "progress")} style={btnSm}><IArrow /> In Progress</button>}
                {idea.column !== "done" && <button onClick={() => moveTo(idea.id, "done")} style={btnSm}><ICheck /> Done</button>}
              </div>
              <button onClick={() => del(idea.id)} style={{ ...btnSm, color: _red, borderColor: `rgba(${_red.replace("#","").match(/../g).map(h=>parseInt(h,16)).join(",")},.2)` }}><ITrash /></button>
            </div>
          </div>
        )}
      </div>
    );
  };

  // ── Column ──
  const Col = ({ title, items, colKey, dot, empty }) => (
    <div
      onDragOver={e => { e.preventDefault(); setDragOverCol(colKey); }}
      onDragLeave={() => setDragOverCol(null)}
      onDrop={() => handleDrop(colKey)}
      style={{ flex: 1, minWidth: 220, background: dragOverCol === colKey ? `rgba(${_acR},.06)` : "rgba(0,0,0,.02)", borderRadius: 10, padding: "10px 10px 14px", border: dragOverCol === colKey ? `2px dashed ${_ac}` : "2px solid transparent", transition: "all .15s" }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8, padding: "0 4px" }}>
        <div style={{ width: 8, height: 8, borderRadius: "50%", background: dot, flexShrink: 0 }} />
        <span style={{ fontSize: 12, fontWeight: 700, color: "#1a1714" }}>{title}</span>
        <span style={{ fontSize: 10, color: "#9ca3af", fontWeight: 600 }}>{items.length}</span>
      </div>
      {items.map(i => <Card key={i.id} idea={i} />)}
      {items.length === 0 && <div style={{ fontSize: 11, color: "#9ca3af", textAlign: "center", padding: "20px 0" }}>{empty}</div>}
    </div>
  );

  /* ══════════════════════════════════════ */
  return (<>
    {/* Toast */}
    {toast && (
      <div style={{ position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)", background: "#1a1714", color: "#fff", padding: "10px 20px", borderRadius: 8, fontSize: 13, fontWeight: 600, zIndex: 999, boxShadow: "0 4px 20px rgba(0,0,0,.2)", display: "flex", alignItems: "center", gap: 6 }}>
        <ICheck /> {toast}
      </div>
    )}

    {/* Quick Capture */}
    <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
      <input ref={inputRef} value={quickText} onChange={e => setQuickText(e.target.value)} onKeyDown={e => { if (e.key === "Enter") capture(); }}
        placeholder="Capture an idea... (press Enter)" style={{ flex: 1, padding: "10px 14px", borderRadius: 8, border: "1px solid rgba(0,0,0,.12)", fontSize: 14, fontFamily: "inherit", color: "#1a1714", minHeight: 44 }} />
      <button onClick={capture} disabled={!quickText.trim()} style={{ padding: "10px 18px", borderRadius: 8, border: "none", background: _ac, color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", opacity: quickText.trim() ? 1 : 0.4, display: "flex", alignItems: "center", gap: 5, minHeight: 44 }}>
        <IPlus /> Add
      </button>
    </div>

    {/* Search */}
    <div style={{ position: "relative", marginBottom: 12 }}>
      <div style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }}><ISearch /></div>
      <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search ideas..." style={{ width: "100%", padding: "8px 12px 8px 34px", borderRadius: 8, border: "1px solid rgba(0,0,0,.08)", fontSize: 12, fontFamily: "inherit", color: "#1a1714", minHeight: 40 }} />
      {search && <button onClick={() => setSearch("")} style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#9ca3af", fontSize: 14 }}>x</button>}
    </div>

    {/* Stale nudge */}
    {staleCount > 0 && (
      <div style={{ background: `rgba(${_gold.replace("#","").match(/../g).map(h=>parseInt(h,16)).join(",")},.08)`, border: `1px solid rgba(${_gold.replace("#","").match(/../g).map(h=>parseInt(h,16)).join(",")},.2)`, borderRadius: 8, padding: "10px 14px", marginBottom: 14, fontSize: 12, color: "#5c4a3a", display: "flex", alignItems: "center", gap: 6 }}>
        <IClock /> <strong>{staleCount}</strong> idea{staleCount !== 1 ? "s" : ""} {staleCount === 1 ? "has" : "have"} been in your inbox over a week. Triage them — act, convert, or delete.
      </div>
    )}

    {/* Property filter */}
    {properties.length > 0 && (
      <div style={{ display: "flex", gap: 5, marginBottom: 14, alignItems: "center", flexWrap: "wrap" }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: "#5c4a3a" }}>Filter:</span>
        <button onClick={() => setPropFilter("all")} style={filterBtn(propFilter === "all")}>All</button>
        <button onClick={() => setPropFilter("")} style={filterBtn(propFilter === "")}>General</button>
        {properties.map(p => (
          <button key={p.id} onClick={() => setPropFilter(p.id)} style={filterBtn(propFilter === p.id)}>
            {(p.addr || p.name || "").split(",")[0]}
          </button>
        ))}
      </div>
    )}

    {/* Empty state */}
    {totalActive === 0 && done.length === 0 && converted.length === 0 && !search && (
      <div style={{ textAlign: "center", padding: "40px 20px", color: "#7a7067" }}>
        <div style={{ marginBottom: 8 }}><IInbox /></div>
        <div style={{ fontSize: 16, fontWeight: 700, color: "#1a1714", marginBottom: 6 }}>No ideas yet</div>
        <div style={{ fontSize: 13, lineHeight: 1.6 }}>Type above to capture your first idea. It'll land in your inbox for triage.</div>
        <div style={{ fontSize: 12, color: "#9ca3af", marginTop: 8 }}>Later, you can turn ideas into quarterly goals, maintenance requests, issues to discuss, expenses, or capital improvements.</div>
      </div>
    )}

    {/* Inbox */}
    {inbox.length > 0 && (
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: "#1a1714", marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
          <IInbox /> Inbox <span style={{ fontSize: 11, color: "#9ca3af", fontWeight: 600 }}>{inbox.length}</span>
          <span style={{ fontSize: 11, color: "#7a7067", fontWeight: 400, marginLeft: 4 }}>Triage: move to board, convert, or delete</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 6 }}>
          {inbox.map(i => <Card key={i.id} idea={i} />)}
        </div>
      </div>
    )}

    {/* Board */}
    {(totalActive > 0 || done.length > 0) && <>
      <div style={{ fontSize: 14, fontWeight: 700, color: "#1a1714", marginBottom: 8 }}>Board</div>
      <div style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 8 }}>
        <Col title="Next Up" items={next} colKey="next" dot={_ac} empty="Drag ideas here" />
        <Col title="In Progress" items={progress} colKey="progress" dot={_gold} empty="Nothing in progress" />
        <Col title="Done" items={done} colKey="done" dot={_green} empty="Complete ideas appear here" />
      </div>
    </>}

    {/* Converted */}
    {converted.length > 0 && (
      <div style={{ marginTop: 16 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: "#7a7067", marginBottom: 6, display: "flex", alignItems: "center", gap: 6 }}>
          Converted <span style={{ fontSize: 10, color: "#9ca3af" }}>{converted.length}</span>
          {converted.length > 10 && <button onClick={() => setShowAllConverted(!showAllConverted)} style={{ ...btnSm, fontSize: 9, padding: "2px 8px", minHeight: 22 }}>{showAllConverted ? "Show less" : "Show all"}</button>}
        </div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {(showAllConverted ? converted : converted.slice(0, 10)).map(i => (
            <div key={i.id} style={{ fontSize: 10, color: "#7a7067", background: "rgba(0,0,0,.03)", borderRadius: 6, padding: "5px 10px", display: "flex", alignItems: "center", gap: 4 }}>
              <ICheck /> {i.title} <span style={{ color: _green }}>→ {i.convertedTo?.label || (i.convertedTo?.type === "rock" ? "Quarterly Goal" : i.convertedTo?.type === "maint" ? "Maintenance" : i.convertedTo?.type === "issue" ? "Issue" : i.convertedTo?.type === "expense" ? "Expense" : "Capital Improvement")}</span>
            </div>
          ))}
        </div>
      </div>
    )}

    {/* Footer counts */}
    <div style={{ marginTop: 16, fontSize: 10, color: "#9ca3af", display: "flex", gap: 16 }}>
      <span>{ideas.length} total</span>
      <span>{inbox.length} inbox</span>
      <span>{next.length + progress.length} active</span>
      <span>{done.length + converted.length} done</span>
    </div>
  </>);
}
