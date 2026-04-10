"use client";
import { useMemo, useCallback, useRef, useEffect, useState } from "react";

const allRooms = (p) => (p.units || []).flatMap(u => (u.rooms || []).map(r => ({ ...r, unitName: u.name, propName: p.addr || p.name, propId: p.id })));

export default function TenantTimeline({
  props, settings, setSettings, save, TODAY,
  ttView, setTtView, ttPref, setTtPref,
  ttPropFilter, setTtPropFilter,
  ttSort, setTtSort,
  ttMonthOffset, setTtMonthOffset,
  ttGanttGrouped, setTtGanttGrouped,
  setTenantProfileTab, setModal,
  getPropDisplayName, fmtD, goTab,
}) {
  const _ac = settings?.adminAccent || "#4a7c59";
  const _acRgb = settings?.adminAccentRgb || "74,124,89";
  const TODAY_STR = TODAY.toISOString().split("T")[0];

  /* ── Data ──────────────────────────────────────────────────── */
  const allRoomsFull = useMemo(() => props.flatMap(p => allRooms(p).filter(r => !r.ownerOccupied).map(r => ({
    ...r, propName: getPropDisplayName(p), propId: p.id,
  }))), [props, getPropDisplayName]);

  const filtered = useMemo(() => ttPropFilter === "all" ? allRoomsFull : allRoomsFull.filter(r => r.propId === ttPropFilter), [allRoomsFull, ttPropFilter]);

  const daysUntil = useCallback((ds) => { if (!ds) return null; return Math.ceil((new Date(ds + "T00:00:00") - TODAY) / 86400000); }, [TODAY]);

  const sortRooms = useCallback((rooms) => {
    const cp = [...rooms];
    const noLe = r => !r.le;
    const leMs = r => r.le ? new Date(r.le + "T00:00:00").getTime() : Infinity;
    if (ttSort === "lease-end-asc") return cp.sort((a, b) => noLe(a) && noLe(b) ? 0 : noLe(a) ? -1 : noLe(b) ? 1 : leMs(a) - leMs(b));
    if (ttSort === "lease-end-desc") return cp.sort((a, b) => noLe(a) && noLe(b) ? 0 : noLe(a) ? 1 : noLe(b) ? -1 : leMs(b) - leMs(a));
    if (ttSort === "avail-asc") return cp.sort((a, b) => leMs(a) - leMs(b));
    if (ttSort === "avail-desc") return cp.sort((a, b) => leMs(b) - leMs(a));
    return cp;
  }, [ttSort]);

  const sortedFiltered = useMemo(() => sortRooms(filtered), [filtered, sortRooms]);

  /* ── Turnover period: days between lease end and availability ─ */
  const turnoverDays = Number(settings?.turnoverDays ?? 1);
  const addDays = (dateStr, days) => {
    const d = new Date(dateStr + "T00:00:00");
    d.setDate(d.getDate() + days);
    return d.toISOString().split("T")[0];
  };
  const setTurnoverDays = (n) => {
    const u = { ...settings, turnoverDays: Math.max(0, Math.min(30, Number(n) || 0)) };
    setSettings && setSettings(u);
    save && save("hq-settings", u);
  };

  /* ── Gantt window — 12 months, scrollable ─────────────────── */
  const GANTT_MONTHS = 12;
  const MONTH_W = 120; // px per month
  const GANTT_W = GANTT_MONTHS * MONTH_W;
  const baseDate = new Date(TODAY.getFullYear(), TODAY.getMonth() + ttMonthOffset, 1);
  const windowStart = new Date(baseDate); windowStart.setMonth(windowStart.getMonth() - 2);
  const windowEnd = new Date(baseDate); windowEnd.setMonth(windowEnd.getMonth() + GANTT_MONTHS - 2);
  const totalDays = Math.ceil((windowEnd - windowStart) / 86400000);
  const dateToX = (ds) => { if (!ds) return 0; const d = Math.ceil((new Date(ds + "T00:00:00") - windowStart) / 86400000); return Math.max(0, Math.min(GANTT_W, (d / totalDays) * GANTT_W)); };
  const months = useMemo(() => { const m = []; for (let i = 0; i < GANTT_MONTHS; i++) { const d = new Date(windowStart); d.setMonth(d.getMonth() + i); m.push({ label: d.toLocaleString("default", { month: "short", year: "2-digit" }), x: (i / GANTT_MONTHS) * GANTT_W }); } return m; }, [ttMonthOffset]); // eslint-disable-line

  const views = [{ id: "gantt", label: "Gantt" }, { id: "countdown", label: "Countdown" }, { id: "calendar", label: "Calendar" }, { id: "kanban", label: "Kanban" }];

  const openTenant = (r) => { if (r.tenant) { setTenantProfileTab("summary"); setModal({ type: "tenant", data: r }); } else goTab("applications"); };

  /* [P2-5] Persist daily driver to settings */
  const setDailyDriver = (v) => { setTtPref(v); if (setSettings && save) { const u = { ...settings, timelinePref: v }; setSettings(u); save("hq-settings", u); } };

  /* ── Styles ────────────────────────────────────────────────── */
  const pillS = (on) => ({ padding: "4px 10px", fontSize: 10, fontWeight: 600, borderRadius: 20, border: on ? `1px solid ${_ac}` : "1px solid rgba(0,0,0,.12)", cursor: "pointer", fontFamily: "inherit", transition: "all .12s", background: on ? _ac : "transparent", color: on ? "#fff" : "#5c4a3a" });
  const toggleS = (on) => ({ padding: "6px 14px", fontSize: 11, fontWeight: 600, border: "none", borderRight: "1px solid rgba(0,0,0,.08)", cursor: "pointer", fontFamily: "inherit", transition: "all .15s", background: on ? _ac : "transparent", color: on ? "#fff" : "#5c4a3a" });
  const subTogS = (on) => ({ padding: "4px 12px", fontSize: 10, fontWeight: 600, border: "none", borderRight: "1px solid rgba(0,0,0,.08)", cursor: "pointer", fontFamily: "inherit", transition: "all .15s", background: on ? _ac : "transparent", color: on ? "#fff" : "#5c4a3a" });
  const isFutureRoom = useCallback((r) => r.tenant?.moveIn && r.tenant.moveIn > TODAY_STR, [TODAY_STR]);

  /* ── Category colors (uniform muted palette, customizable via settings) ── */
  /* pattern: solid | diagonal | thickDiagonal | dots | horizontal | vertical */
  const DEFAULT_CAT_COLORS = {
    incoming: { bg: "#D0E8DC", text: "#1A5438", pattern: "solid",         patternColor: "#1A5438" },
    active:   { bg: "#CDDCEE", text: "#1B3F6B", pattern: "solid",         patternColor: "#1B3F6B" },
    exp90:    { bg: "#E8DCC0", text: "#5C4316", pattern: "solid",         patternColor: "#5C4316" },
    exp30:    { bg: "#E8C8C0", text: "#6B2418", pattern: "solid",         patternColor: "#6B2418" },
    expired:  { bg: "#DCCACA", text: "#5C1A1A", pattern: "solid",         patternColor: "#5C1A1A" },
    m2m:      { bg: "#D4CCE4", text: "#3A2868", pattern: "solid",         patternColor: "#3A2868" },
    turnover: { bg: "#FF9933", text: "#1a1714", pattern: "thickDiagonal", patternColor: "#1a1714" },
    available:{ bg: `rgba(${_acRgb},.15)`, text: _ac, pattern: "solid", patternColor: _ac },
  };
  /* Convert a cat color config into a CSS background value */
  const bgFromCat = (c) => {
    if (!c || !c.pattern || c.pattern === "solid") return c?.bg || "#ccc";
    const bg = c.bg;
    const pc = c.patternColor || "#000";
    switch (c.pattern) {
      case "diagonal":      return `repeating-linear-gradient(45deg, ${bg} 0 4px, ${pc} 4px 5px)`;
      case "thickDiagonal": return `repeating-linear-gradient(45deg, ${bg} 0 6px, ${pc} 6px 10px)`;
      case "dots":          return `radial-gradient(${pc} 1.5px, ${bg} 1.5px) 0 0 / 6px 6px`;
      case "horizontal":    return `repeating-linear-gradient(0deg, ${bg} 0 4px, ${pc} 4px 5px)`;
      case "vertical":      return `repeating-linear-gradient(90deg, ${bg} 0 4px, ${pc} 4px 5px)`;
      default:              return bg;
    }
  };
  // Derive a darker text color from a hex bg (for contrast)
  const darkerText = (hex) => {
    if (!hex || !hex.startsWith("#")) return "#1a1714";
    const h = hex.replace("#",""); const r = parseInt(h.substr(0,2),16); const g = parseInt(h.substr(2,2),16); const b = parseInt(h.substr(4,2),16);
    return `rgb(${Math.max(0,r-120)},${Math.max(0,g-120)},${Math.max(0,b-120)})`;
  };
  const customColors = settings?.timelineColors || {};
  const SIMPLE_LEASE_CATS = ["active","exp90","exp30","expired","m2m"];
  const normalizeCustom = (c) => {
    if (!c) return null;
    if (typeof c === "string") return { bg: c, text: darkerText(c) }; // legacy
    return c;
  };
  const CAT_COLORS = Object.keys(DEFAULT_CAT_COLORS).reduce((acc, cat) => {
    const def = DEFAULT_CAT_COLORS[cat];
    const cust = normalizeCustom(customColors[cat]);
    acc[cat] = cust ? { ...def, ...cust } : def;
    // If simple mode, unify all lease states to the "active" color
    if (settings?.timelineSimple && SIMPLE_LEASE_CATS.includes(cat)) {
      const activeCust = normalizeCustom(customColors.active);
      acc[cat] = activeCust ? { ...DEFAULT_CAT_COLORS.active, ...activeCust } : DEFAULT_CAT_COLORS.active;
    }
    return acc;
  }, {});
  const setCatColor = (cat, patch) => {
    const existing = normalizeCustom((settings?.timelineColors || {})[cat]) || {};
    const merged = typeof patch === "string" ? { ...existing, bg: patch } : { ...existing, ...patch };
    const u = { ...settings, timelineColors: { ...(settings?.timelineColors || {}), [cat]: merged } };
    setSettings && setSettings(u);
    save && save("hq-settings", u);
  };
  const resetCatColors = () => {
    const u = { ...settings, timelineColors: {} };
    setSettings && setSettings(u);
    save && save("hq-settings", u);
  };
  const toggleSimple = () => {
    const u = { ...settings, timelineSimple: !settings?.timelineSimple };
    setSettings && setSettings(u);
    save && save("hq-settings", u);
  };
  const MUTED = { bg: "#E8E6E3", text: "#A8A29E" }; // dimmed color for toggled-off categories

  const barColor = (r) => {
    const cat = catOf(r);
    if (dimmedCats.includes(cat)) return MUTED;
    return CAT_COLORS[cat] || CAT_COLORS.active;
  };

  /* ── Legend filter: toggle which categories show ─────────── */
  const ALL_CATS = ["incoming","active","exp90","exp30","expired","m2m","available"];
  const [dimmedCats, setDimmedCats] = useState([]);
  const [collapseDimmed, setCollapseDimmed] = useState(false);
  const [editingCat, setEditingCat] = useState(null); // legend color editor popover target
  const toggleDim = (cat) => setDimmedCats(h => h.includes(cat) ? h.filter(c => c !== cat) : [...h, cat]);
  const catOf = (r) => {
    const isOcc = r.st === "occupied" && r.tenant;
    if (!isOcc) return "available";
    if (isFutureRoom(r)) return "incoming";
    if (!r.le) return "m2m";
    const dl = daysUntil(r.le);
    if (dl !== null && dl <= 0) return "expired";
    if (dl !== null && dl <= 30) return "exp30";
    if (dl !== null && dl <= 90) return "exp90";
    return "active";
  };

  /* ── Gantt scroll: auto-scroll to "today" on mount + track scrollLeft ── */
  const ganttScrollRef = useRef(null);
  const [scrollLeft, setScrollLeft] = useState(0);
  useEffect(() => {
    const el = ganttScrollRef.current;
    if (!el || ttView !== "gantt") return;
    const todayPx = dateToX(TODAY_STR);
    el.scrollLeft = Math.max(0, todayPx - 100);
    const onScroll = () => setScrollLeft(el.scrollLeft);
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [ttView, ttMonthOffset]); // eslint-disable-line
  const LABEL_W = 140;

  /* ── Empty state guard ─────────────────────────────────────── */
  if (!props.length) return (
    <div style={{ padding: "60px 0", textAlign: "center" }}>
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="1.5" style={{ marginBottom: 12 }}><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
      <div style={{ fontSize: 14, fontWeight: 700, color: "#6b5e52", marginBottom: 4 }}>No properties yet</div>
      <div style={{ fontSize: 12, color: "#9ca3af" }}>Add properties to see your tenant timeline.</div>
    </div>
  );

  return (
    <div style={{ padding: "0 0 40px" }}>
      {/* ═══ Header ═══ */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 8, position: "sticky", top: 0, zIndex: 10, background: "#f4f3f0", paddingTop: 4, paddingBottom: 8 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>Tenant Timeline</h2>
          <div style={{ fontSize: 11, color: "#6b5e52", marginTop: 2 }}>Lease end dates and availability across all properties</div>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
          {/* Property filter pills */}
          <div style={{ display: "flex", gap: 4, flexWrap: "wrap", alignItems: "center" }}>
            <button onClick={() => setTtPropFilter("all")} style={pillS(ttPropFilter === "all")}>All</button>
            {props.filter(p => !(p.units || []).every(u => u.ownerOccupied)).map(p => (
              <button key={p.id} onClick={() => setTtPropFilter(ttPropFilter === p.id ? "all" : p.id)} style={pillS(ttPropFilter === p.id)}>{getPropDisplayName(p)}</button>
            ))}
          </div>
          <select value={ttSort} onChange={e => setTtSort(e.target.value)} style={{ fontSize: 11, padding: "4px 8px", borderRadius: 6, border: "1px solid rgba(0,0,0,.12)", fontFamily: "inherit" }}>
            <option value="lease-end-asc">Lease end soonest</option>
            <option value="lease-end-desc">Lease end latest</option>
            <option value="avail-asc">Available soonest</option>
            <option value="avail-desc">Available latest</option>
          </select>
          {/* View toggle */}
          <div style={{ display: "flex", border: "1px solid rgba(0,0,0,.12)", borderRadius: 8, overflow: "hidden", background: "rgba(0,0,0,.02)" }}>
            {views.map(v => (
              <button key={v.id} onClick={() => setTtView(v.id)} style={toggleS(ttView === v.id)}>
                {v.label}{v.id === ttPref && <span style={{ marginLeft: 4, fontSize: 9, opacity: .6 }}>{"\u2713"}</span>}
              </button>
            ))}
          </div>
          {ttPref !== ttView && <button onClick={() => setDailyDriver(ttView)}
            style={{ fontSize: 10, padding: "6px 12px", borderRadius: 7, border: "1px solid rgba(0,0,0,.12)", background: "#fff", cursor: "pointer", fontFamily: "inherit", color: "#5c4a3a", fontWeight: 600, transition: "all .15s" }}>
            Set as default
          </button>}
          {ttPref === ttView && <span style={{ fontSize: 10, color: "#5c4a3a", fontWeight: 600, padding: "6px 4px", opacity: .6 }}>Default</span>}
        </div>
      </div>

      {/* ═══ GANTT ═══ */}
      {ttView === "gantt" && <div style={{ background: "#fff", borderRadius: 12, border: "1px solid rgba(0,0,0,.07)", display: "flex", flexDirection: "column", maxHeight: "calc(100vh - 260px)", overflow: "hidden" }}>
        {/* Nav bar */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 16px", borderBottom: "1px solid rgba(0,0,0,.06)", background: "rgba(0,0,0,.015)", flexWrap: "wrap", gap: 6 }}>
          <button className="btn btn-out btn-sm" onClick={() => setTtMonthOffset(o => o - 1)}>Earlier</button>
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            <button className="btn btn-out btn-sm" style={{ fontSize: 9 }} onClick={() => setTtMonthOffset(0)}>Today</button>
            <span style={{ fontSize: 12, fontWeight: 600, color: "#5c4a3a" }}>{baseDate.toLocaleString("default", { month: "long", year: "numeric" })}</span>
            <div style={{ display: "flex", border: "1px solid rgba(0,0,0,.12)", borderRadius: 7, overflow: "hidden" }}>
              <button onClick={() => setTtGanttGrouped(true)} style={subTogS(ttGanttGrouped)}>By property</button>
              <button onClick={() => setTtGanttGrouped(false)} style={{ ...subTogS(!ttGanttGrouped), borderRight: "none" }}>By date</button>
            </div>
            <label style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 10, color: "#6b5e52", fontWeight: 600 }}>
              Turnover
              <input type="number" min="0" max="30" value={turnoverDays} onChange={e => setTurnoverDays(e.target.value)}
                style={{ width: 42, padding: "3px 6px", fontSize: 11, border: "1px solid rgba(0,0,0,.12)", borderRadius: 5, fontFamily: "inherit" }} />
              <span style={{ fontSize: 10, color: "#9a8f82" }}>days</span>
            </label>
          </div>
          <button className="btn btn-out btn-sm" onClick={() => setTtMonthOffset(o => o + 1)}>Later</button>
        </div>
        {/* Scrollable chart area (month axis + rows) */}
        <div ref={ganttScrollRef} style={{ flex: 1, overflowX: "scroll", overflowY: "auto", minHeight: 0, WebkitOverflowScrolling: "touch", touchAction: "pan-x pan-y" }}>
        {/* Month axis */}
        <div style={{ display: "flex", borderBottom: "1px solid rgba(0,0,0,.06)", position: "sticky", top: 0, zIndex: 2, background: "#fff" }}>
          <div style={{ width: 140, flexShrink: 0, padding: "4px 12px", fontSize: 9, color: "#999", textTransform: "uppercase", letterSpacing: .5, position: "sticky", left: 0, background: "#fff", zIndex: 3 }}>{ttGanttGrouped ? "Room" : "Room / Property"}</div>
          <div style={{ width: GANTT_W, flexShrink: 0, position: "relative", height: 22, background: "#fff" }}>
            {months.map((m, i) => <div key={i} style={{ position: "absolute", left: m.x, fontSize: 9, color: "#999", whiteSpace: "nowrap", top: 5, borderLeft: "1px solid rgba(0,0,0,.06)", paddingLeft: 4, background: "#fff" }}>{m.label}</div>)}
          </div>
        </div>
        {(() => {
          const todayX = dateToX(TODAY_STR);
          /* helper: compute sticky text left offset within a bar */
          const stickyTextLeft = (barLeft) => {
            const visibleLeft = scrollLeft; // how far scrolled
            return Math.max(4, visibleLeft - barLeft + 4);
          };
          const renderRow = (r, showProp = false) => {
            const cat = catOf(r);
            if (collapseDimmed && dimmedCats.includes(cat)) return null;
            const isOcc = r.st === "occupied" && r.tenant;
            const isFuture = isOcc && isFutureRoom(r);
            const isVac = !isOcc;
            const isM2M = isOcc && !r.le && !isFuture;
            const leX = r.le ? dateToX(r.le) : null;
            const moveInX = r.tenant?.moveIn ? dateToX(r.tenant.moveIn) : null;
            const dl = r.le ? daysUntil(r.le) : null;
            const bc = isOcc ? barColor(r) : null;
            return (
              <div key={r.id} style={{ display: "flex", alignItems: "center", borderBottom: "1px solid rgba(0,0,0,.04)", minHeight: 36, cursor: "pointer", transition: "background .1s", minWidth: LABEL_W + GANTT_W }}
                onClick={() => openTenant(r)}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(0,0,0,.025)"}
                onMouseLeave={e => e.currentTarget.style.background = ""}>
                <div style={{ width: LABEL_W, flexShrink: 0, padding: "4px 12px", position: "sticky", left: 0, background: "#fff", zIndex: 1, borderRight: "1px solid rgba(0,0,0,.04)" }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: "#1a1714", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{r.name}</div>
                  {showProp && <div style={{ fontSize: 9, color: _ac, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{r.propName}</div>}
                  {isFuture && <div style={{ fontSize: 9, color: "#065F46", fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>Incoming: {r.tenant.name}</div>}
                  {isOcc && !isFuture && <div style={{ fontSize: 9, color: "#6b5e52", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{r.tenant.name}</div>}
                  {isVac && <div style={{ fontSize: 9, color: _ac, fontWeight: 600 }}>Vacant</div>}
                </div>
                <div style={{ width: GANTT_W, flexShrink: 0, position: "relative", height: 36, display: "flex", alignItems: "center" }}>
                  {months.map((m, i) => <div key={i} style={{ position: "absolute", left: m.x, top: 0, bottom: 0, width: 1, background: "rgba(0,0,0,.04)", zIndex: 0 }} />)}
                  <div style={{ position: "absolute", left: todayX, top: 0, bottom: 0, width: 1.5, background: "#c45c4a", zIndex: 3, opacity: .7 }} />
                  {/* Vacant */}
                  {isVac && <div style={{ position: "absolute", left: 0, width: GANTT_W, height: 16, borderRadius: 3, background: dimmedCats.includes("available") ? MUTED.bg : `rgba(${_acRgb},.15)`, border: `1px solid ${dimmedCats.includes("available") ? "rgba(0,0,0,.06)" : `rgba(${_acRgb},.3)`}`, display: "flex", alignItems: "center", overflow: "hidden" }}>
                    <span style={{ fontSize: 9, color: dimmedCats.includes("available") ? MUTED.text : _ac, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", display: "block", paddingLeft: stickyTextLeft(0) }}>Available now</span>
                  </div>}
                  {/* Future/incoming dashed */}
                  {isFuture && moveInX !== null && (() => { const dim = dimmedCats.includes("incoming"); return <div style={{ position: "absolute", left: todayX, width: Math.max(4, moveInX - todayX), height: 16, top: 10, borderRadius: 3, background: dim ? "rgba(0,0,0,.03)" : "repeating-linear-gradient(45deg, rgba(208,232,220,.4), rgba(208,232,220,.4) 4px, transparent 4px, transparent 8px)", border: `1px dashed ${dim ? "rgba(0,0,0,.08)" : "#1A5438"}`, display: "flex", alignItems: "center", overflow: "hidden" }}>
                    <span style={{ fontSize: 9, color: dim ? MUTED.text : "#1A5438", fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", display: "block", paddingLeft: stickyTextLeft(todayX) }}>Incoming {fmtD(r.tenant.moveIn)}</span>
                  </div>; })()}
                  {/* Future/incoming solid */}
                  {isFuture && moveInX !== null && leX !== null && <div style={{ position: "absolute", left: moveInX, width: Math.max(4, leX - moveInX), height: 20, top: 8, borderRadius: 3, background: dimmedCats.includes("incoming") ? MUTED.bg : bgFromCat(bc), display: "flex", alignItems: "center", overflow: "hidden", transition: "filter .15s" }}
                    onMouseEnter={e => e.currentTarget.style.filter = "brightness(.93)"}
                    onMouseLeave={e => e.currentTarget.style.filter = ""}>
                    <span style={{ fontSize: 9, color: bc.text, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", display: "block", paddingLeft: stickyTextLeft(moveInX) }}>{r.tenant.name} &middot; ends {fmtD(r.le)}</span>
                  </div>}
                  {/* M2M — solid to end of month, dashed remainder */}
                  {isM2M && (() => {
                    const startX = moveInX || 0;
                    const endOfMonth = new Date(TODAY.getFullYear(), TODAY.getMonth() + 1, 0);
                    const eomStr = endOfMonth.toISOString().split("T")[0];
                    const eomX = dateToX(eomStr);
                    const solidW = Math.max(4, eomX - startX);
                    const dashedW = Math.max(0, GANTT_W - eomX);
                    const dim = dimmedCats.includes("m2m");
                    return (<>
                      <div style={{ position: "absolute", left: startX, width: solidW, height: 20, borderRadius: "3px 0 0 3px", background: dim ? MUTED.bg : bgFromCat(bc), top: 8, display: "flex", alignItems: "center", overflow: "hidden" }}>
                        <span style={{ fontSize: 9, color: dim ? MUTED.text : bc.text, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", display: "block", paddingLeft: stickyTextLeft(startX) }}>{r.tenant.name} &middot; thru {endOfMonth.toLocaleDateString("en-US",{month:"short",day:"numeric"})}</span>
                      </div>
                      {dashedW > 0 && <div style={{ position: "absolute", left: eomX, width: dashedW, height: 16, top: 10, borderRadius: "0 3px 3px 0", background: dim ? "rgba(0,0,0,.03)" : "repeating-linear-gradient(45deg, rgba(212,204,228,.3), rgba(212,204,228,.3) 4px, transparent 4px, transparent 8px)", border: `1px dashed ${dim ? "rgba(0,0,0,.08)" : "rgba(58,40,104,.25)"}`, display: "flex", alignItems: "center", overflow: "hidden" }}>
                        <span style={{ fontSize: 9, color: dim ? MUTED.text : bc.text, fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", display: "block", opacity: .7, paddingLeft: stickyTextLeft(eomX) }}>Month-to-month</span>
                      </div>}
                    </>);
                  })()}
                  {/* Fixed-term bar */}
                  {isOcc && !isM2M && !isFuture && moveInX !== null && leX !== null && (() => {
                    const barL = Math.min(moveInX, leX);
                    const barW = Math.max(4, Math.abs(leX - barL));
                    return <div style={{ position: "absolute", left: barL, width: barW, height: 20, borderRadius: 3, background: dimmedCats.includes(catOf(r)) ? MUTED.bg : bgFromCat(bc), top: 8, display: "flex", alignItems: "center", overflow: "hidden", transition: "filter .15s" }}
                      onMouseEnter={e => e.currentTarget.style.filter = "brightness(.93)"}
                      onMouseLeave={e => e.currentTarget.style.filter = ""}>
                      <span style={{ fontSize: 9, color: bc.text, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", display: "block", paddingLeft: stickyTextLeft(barL) }}>{r.tenant.name}{dl !== null && dl <= 0 ? " \u00B7 EXPIRED" : " \u00B7 ends " + fmtD(r.le)}</span>
                    </div>;
                  })()}
                  {/* Turnover period (between lease end and availability) */}
                  {isOcc && !isM2M && !isFuture && leX !== null && turnoverDays > 0 && (() => {
                    const availStr = addDays(r.le, turnoverDays);
                    const availX = dateToX(availStr);
                    const turnoverW = Math.max(2, availX - leX);
                    const tc = CAT_COLORS.turnover || DEFAULT_CAT_COLORS.turnover;
                    const dim = dimmedCats.includes("turnover");
                    return <div style={{ position: "absolute", left: leX, width: turnoverW, height: 20, top: 8, background: dim ? MUTED.bg : bgFromCat(tc), border: `1px solid ${dim ? "rgba(0,0,0,.08)" : tc.text + "50"}`, borderRadius: 3, display: "flex", alignItems: "center", overflow: "hidden" }}>
                      <span style={{ fontSize: 9, color: dim ? MUTED.text : tc.text, fontWeight: 700, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", display: "block", paddingLeft: stickyTextLeft(leX) }}>Turnover {turnoverDays}d</span>
                    </div>;
                  })()}
                  {/* Availability zone after lease + turnover period */}
                  {isOcc && !isM2M && !isFuture && leX !== null && (() => {
                    const availStr = addDays(r.le, turnoverDays);
                    const availX = dateToX(availStr);
                    return <div style={{ position: "absolute", left: availX, width: Math.max(4, GANTT_W - availX), height: 16, top: 10, background: dimmedCats.includes("available") ? "rgba(0,0,0,.03)" : `rgba(${_acRgb},.1)`, border: `1px dashed ${dimmedCats.includes("available") ? "rgba(0,0,0,.08)" : `rgba(${_acRgb},.3)`}`, borderRadius: "0 3px 3px 0", display: "flex", alignItems: "center", overflow: "hidden" }}>
                      <span style={{ fontSize: 9, color: dimmedCats.includes("available") ? MUTED.text : _ac, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", display: "block", paddingLeft: stickyTextLeft(availX) }}>Avail. {fmtD(availStr)}</span>
                    </div>;
                  })()}
                </div>
              </div>);
          };
          if (ttGanttGrouped) {
            return props.filter(p => ttPropFilter === "all" || p.id === ttPropFilter).map(p => {
              const pRooms = sortRooms(allRooms(p).filter(r => !r.ownerOccupied).map(r => ({ ...r, propName: getPropDisplayName(p), propId: p.id })));
              if (!pRooms.length) return null;
              return (<div key={p.id}>
                <div style={{ display: "flex", minWidth: LABEL_W + GANTT_W, borderBottom: "1px solid rgba(0,0,0,.04)", background: `rgba(${_acRgb},.04)` }}>
                  <div style={{ position: "sticky", left: 0, flexShrink: 0, padding: "5px 12px", fontSize: 10, fontWeight: 700, color: _ac, textTransform: "uppercase", letterSpacing: .3, whiteSpace: "nowrap", background: `rgba(${_acRgb},.04)`, zIndex: 2 }}>
                    {getPropDisplayName(p)}
                  </div>
                </div>
                {pRooms.map(r => renderRow(r, false))}
              </div>);
            });
          }
          return sortedFiltered.map(r => renderRow(r, true));
        })()}
        {sortedFiltered.length === 0 && <div style={{ textAlign: "center", padding: 40, color: "#6b5e52", fontSize: 12 }}>No rooms match this filter.</div>}
        </div>{/* close scroll container */}
        {/* Legend — clickable to toggle + customize colors */}
        <div style={{ padding: "8px 16px", display: "flex", gap: 8, borderTop: "1px solid rgba(0,0,0,.06)", background: "rgba(0,0,0,.01)", flexWrap: "wrap", flexShrink: 0, alignItems: "center" }}>
          <button onClick={toggleSimple}
            style={{ fontSize: 9, color: settings?.timelineSimple ? "#fff" : "#5c4a3a", background: settings?.timelineSimple ? _ac : "#fff", border: `1px solid ${settings?.timelineSimple ? _ac : "rgba(0,0,0,.12)"}`, borderRadius: 4, padding: "3px 10px", cursor: "pointer", fontFamily: "inherit", fontWeight: 600, transition: "all .15s" }}>
            {settings?.timelineSimple ? "Simple \u2713" : "Simple"}
          </button>
          {[
            ["incoming","Incoming"],
            ...(settings?.timelineSimple ? [["active","Leased"]] : [["active","Active"],["exp90","Expiring 90d"],["exp30","Expiring 30d"],["expired","Expired"],["m2m","Month-to-month"]]),
            ...(turnoverDays > 0 ? [["turnover","Turnover"]] : []),
            ["available","Available"],
          ].map(([cat,label]) => {
            const c = CAT_COLORS[cat] || CAT_COLORS.active;
            const dim = dimmedCats.includes(cat);
            return <span key={cat} style={{ display: "inline-flex", alignItems: "center", gap: 0, position: "relative" }}>
              <button onClick={() => toggleDim(cat)}
                style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 10, color: dim ? MUTED.text : c.text, fontWeight: 600, padding: "3px 8px 3px 4px", borderRadius: "4px 0 0 4px", border: "none", cursor: "pointer", fontFamily: "inherit", background: dim ? MUTED.bg : bgFromCat(c), transition: "all .15s" }}>
                <span onClick={e => { e.stopPropagation(); setEditingCat(editingCat === cat ? null : cat); }}
                  style={{ display: "inline-block", width: 12, height: 12, borderRadius: 3, background: dim ? "#ccc" : bgFromCat(c), border: `1px solid ${dim ? "#ccc" : c.text}60`, cursor: "pointer" }}
                  title="Click to edit color / pattern" />
                {label}
              </button>
              {editingCat === cat && <div onClick={e => e.stopPropagation()} style={{ position: "absolute", bottom: "100%", left: 0, marginBottom: 6, background: "#fff", border: "1px solid rgba(0,0,0,.12)", borderRadius: 8, padding: 12, boxShadow: "0 4px 16px rgba(0,0,0,.12)", zIndex: 100, minWidth: 220 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#1a1714" }}>{label}</div>
                  <button onClick={() => setEditingCat(null)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 14, color: "#6b5e52", padding: 0, lineHeight: 1 }}>{"\u00D7"}</button>
                </div>
                {/* Preview */}
                <div style={{ height: 24, borderRadius: 4, background: bgFromCat(c), border: `1px solid ${c.text}40`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 10 }}>
                  <span style={{ fontSize: 9, color: c.text, fontWeight: 700 }}>Preview</span>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 6, alignItems: "center", fontSize: 10, color: "#5c4a3a" }}>
                  <label>Fill color</label>
                  <input type="color" defaultValue={c.bg.startsWith("#") ? c.bg : DEFAULT_CAT_COLORS[cat].bg} onChange={e => setCatColor(cat, { bg: e.target.value })} style={{ width: 40, height: 22, border: "1px solid rgba(0,0,0,.1)", borderRadius: 4, cursor: "pointer", background: "none" }} />
                  <label>Text color</label>
                  <input type="color" defaultValue={c.text} onChange={e => setCatColor(cat, { text: e.target.value })} style={{ width: 40, height: 22, border: "1px solid rgba(0,0,0,.1)", borderRadius: 4, cursor: "pointer", background: "none" }} />
                  <label>Pattern</label>
                  <select value={c.pattern || "solid"} onChange={e => setCatColor(cat, { pattern: e.target.value })} style={{ fontSize: 10, padding: "3px 4px", borderRadius: 4, border: "1px solid rgba(0,0,0,.12)", fontFamily: "inherit" }}>
                    <option value="solid">Solid</option>
                    <option value="diagonal">Diagonal stripes</option>
                    <option value="thickDiagonal">Thick diagonal</option>
                    <option value="dots">Dots</option>
                    <option value="horizontal">Horizontal lines</option>
                    <option value="vertical">Vertical lines</option>
                  </select>
                  {(c.pattern && c.pattern !== "solid") && <>
                    <label>Pattern color</label>
                    <input type="color" defaultValue={c.patternColor || c.text} onChange={e => setCatColor(cat, { patternColor: e.target.value })} style={{ width: 40, height: 22, border: "1px solid rgba(0,0,0,.1)", borderRadius: 4, cursor: "pointer", background: "none" }} />
                  </>}
                </div>
                <button onClick={() => { const n = { ...(settings?.timelineColors || {}) }; delete n[cat]; const u = { ...settings, timelineColors: n }; setSettings && setSettings(u); save && save("hq-settings", u); }}
                  style={{ marginTop: 10, width: "100%", padding: "5px", fontSize: 10, border: "1px solid rgba(0,0,0,.12)", borderRadius: 4, background: "#fff", color: "#5c4a3a", cursor: "pointer", fontFamily: "inherit" }}>
                  Reset this category
                </button>
              </div>}
            </span>;
          })}
          <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 10, color: "#6b5e52", marginLeft: 4 }}>
            <div style={{ width: 1.5, height: 10, background: "#c45c4a" }} />Today
          </div>
          {dimmedCats.length > 0 && <>
            <button onClick={() => setCollapseDimmed(c => !c)}
              style={{ fontSize: 9, color: collapseDimmed ? "#fff" : "#5c4a3a", background: collapseDimmed ? "#5c4a3a" : "none", border: "1px solid rgba(0,0,0,.12)", borderRadius: 4, padding: "2px 8px", cursor: "pointer", fontFamily: "inherit", marginLeft: 4, transition: "all .15s" }}>
              {collapseDimmed ? "Show dimmed" : "Hide dimmed"}
            </button>
            <button onClick={() => { setDimmedCats([]); setCollapseDimmed(false); }}
              style={{ fontSize: 9, color: "#5c4a3a", background: "none", border: "1px solid rgba(0,0,0,.12)", borderRadius: 4, padding: "2px 8px", cursor: "pointer", fontFamily: "inherit" }}>
              Reset dim
            </button>
          </>}
          {Object.keys(settings?.timelineColors || {}).length > 0 && <button onClick={resetCatColors}
            style={{ fontSize: 9, color: "#5c4a3a", background: "none", border: "1px solid rgba(0,0,0,.12)", borderRadius: 4, padding: "2px 8px", cursor: "pointer", fontFamily: "inherit", marginLeft: 4 }}>
            Reset colors
          </button>}
        </div>
      </div>}

      {/* ═══ COUNTDOWN ═══ */}
      {ttView === "countdown" && <div style={{ maxHeight: "calc(100vh - 220px)", overflowY: "auto" }}>
        {sortedFiltered.length === 0 && <div style={{ textAlign: "center", padding: 40, color: "#6b5e52", fontSize: 12, background: "#fff", borderRadius: 12, border: "1px solid rgba(0,0,0,.07)" }}>No rooms match this filter.</div>}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(180px,1fr))", gap: 10 }}>
          {sortedFiltered.map(r => {
            const isVac = r.st === "vacant" || !r.tenant;
            const isFut = !isVac && isFutureRoom(r);
            const isM2M = !isVac && !isFut && !r.le;
            const dl = r.le ? daysUntil(r.le) : null;
            const isExpired = dl !== null && dl <= 0 && !isFut;
            const daysToMoveIn = isFut ? Math.ceil((new Date(r.tenant.moveIn + "T00:00:00") - TODAY) / 86400000) : null;
            const badgeColor = isVac ? _ac : isFut ? "#065F46" : isM2M ? "#4C2882" : isExpired ? "#791F1F" : dl <= 30 ? "#A32D2D" : dl <= 90 ? "#633806" : "#0C447C";
            const badgeBg = isVac ? `rgba(${_acRgb},.1)` : isFut ? "#D1FAE5" : isM2M ? "#EDE5F8" : isExpired ? "#FCEBEB" : dl <= 30 ? "#FCEBEB" : dl <= 90 ? "#FAEEDA" : "#E6F1FB";
            const tenure = !isFut && r.tenant?.moveIn ? Math.max(0, Math.ceil((TODAY - new Date(r.tenant.moveIn + "T00:00:00")) / (86400000 * 30))) : null;
            return (
              <div key={r.id} style={{ background: "#fff", borderRadius: 10, border: isFut ? "1px solid rgba(6,95,70,.2)" : "1px solid rgba(0,0,0,.07)", padding: "12px 14px", cursor: "pointer", transition: "all .15s" }}
                onClick={() => openTenant(r)}
                onMouseEnter={e => e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,.08)"}
                onMouseLeave={e => e.currentTarget.style.boxShadow = "none"}>
                <div style={{ fontSize: 10, color: "#6b5e52", marginBottom: 2 }}>{r.propName}</div>
                <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 2, color: "#1a1714" }}>{r.name}</div>
                {r.tenant && <div style={{ fontSize: 11, color: "#5c4a3a", marginBottom: 4 }}>{r.tenant.name}{!isFut && r.tenant.occupationType ? " \u00B7 " + r.tenant.occupationType : ""}</div>}
                {!isFut && r.tenant && tenure !== null && <div style={{ fontSize: 9, color: "#5c4a3a", marginBottom: 6 }}>Moved in {fmtD(r.tenant.moveIn)} ({tenure} mo)</div>}
                {isFut && <div style={{ fontSize: 9, color: "#065F46", fontWeight: 600, marginBottom: 6 }}>Moves in {fmtD(r.tenant.moveIn)}</div>}
                {!r.tenant && <div style={{ fontSize: 11, color: _ac, fontWeight: 600, marginBottom: 8 }}>Vacant</div>}
                <div style={{ fontSize: 28, fontWeight: 700, color: badgeColor, lineHeight: 1 }}>{isVac ? "0" : isFut ? daysToMoveIn : isM2M ? "\u221E" : isExpired ? Math.abs(dl) : dl != null ? dl : "\u2014"}</div>
                <div style={{ fontSize: 10, color: "#6b5e52", marginBottom: 8 }}>{isFut ? "days until move-in" : isM2M ? "month-to-month" : isExpired ? "days past lease end" : "days until lease ends"}</div>
                {r.le && !isFut && <div style={{ fontSize: 10, color: "#6b5e52", marginBottom: 4 }}>{isExpired ? "Expired" : "Ends"} {fmtD(r.le)}</div>}
                <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 4, background: badgeBg, color: badgeColor, fontWeight: 600 }}>
                  {isVac ? "Available now" : isFut ? "Incoming" : isM2M ? "Month-to-month" : isExpired ? "Expired / Holdover" : dl <= 30 ? "Expiring soon" : dl <= 90 ? "Coming up" : "Active"}
                </span>
              </div>);
          })}
        </div>
      </div>}

      {/* ═══ CALENDAR ═══ */}
      {ttView === "calendar" && (() => {
        const calBase = new Date(TODAY.getFullYear(), TODAY.getMonth() + ttMonthOffset, 1);
        const calYear = calBase.getFullYear(), calMonth = calBase.getMonth();
        const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
        const firstDow = new Date(calYear, calMonth, 1).getDay();
        const chips = {};
        filtered.forEach(r => {
          if (r.le) { const key = r.le; if (!chips[key]) chips[key] = []; chips[key].push({ type: "out", label: (r.tenant?.name || r.name) + " ends", room: r }); }
          if (r.tenant?.moveIn) { const key = r.tenant.moveIn; if (!chips[key]) chips[key] = []; chips[key].push({ type: "in", label: (r.tenant?.name || r.name) + " move-in", room: r }); }
        });
        const cells = [];
        for (let i = 0; i < firstDow; i++) cells.push(null);
        for (let d = 1; d <= daysInMonth; d++) cells.push(d);
        return (<div style={{ background: "#fff", borderRadius: 12, border: "1px solid rgba(0,0,0,.07)", overflow: "hidden", maxHeight: "calc(100vh - 220px)", display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 16px", borderBottom: "1px solid rgba(0,0,0,.06)", background: "rgba(0,0,0,.015)", flexShrink: 0 }}>
            <button className="btn btn-out btn-sm" onClick={() => setTtMonthOffset(o => o - 1)}>Prev</button>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <button className="btn btn-out btn-sm" style={{ fontSize: 9 }} onClick={() => setTtMonthOffset(0)}>Today</button>
              <span style={{ fontSize: 13, fontWeight: 700 }}>{calBase.toLocaleString("default", { month: "long", year: "numeric" })}</span>
            </div>
            <button className="btn btn-out btn-sm" onClick={() => setTtMonthOffset(o => o + 1)}>Next</button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", borderBottom: "1px solid rgba(0,0,0,.06)", flexShrink: 0 }}>
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(d => <div key={d} style={{ padding: "5px", textAlign: "center", fontSize: 10, fontWeight: 600, color: "#6b5e52", background: "rgba(0,0,0,.02)" }}>{d}</div>)}
          </div>
          <div style={{ flex: 1, overflowY: "auto", minHeight: 0 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)" }}>
            {cells.map((d, i) => {
              if (!d) return <div key={"e" + i} style={{ minHeight: 64, borderRight: "1px solid rgba(0,0,0,.04)", borderBottom: "1px solid rgba(0,0,0,.04)" }} />;
              const ds = `${calYear}-${String(calMonth + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
              const isToday = ds === TODAY_STR;
              const dayChips = chips[ds] || [];
              return (<div key={d} style={{ minHeight: 64, padding: "4px", borderRight: "1px solid rgba(0,0,0,.04)", borderBottom: "1px solid rgba(0,0,0,.04)", background: isToday ? `rgba(${_acRgb},.06)` : "transparent" }}>
                <div style={{ fontSize: 11, fontWeight: isToday ? 700 : 400, color: isToday ? _ac : "#5c4a3a", marginBottom: 3 }}>{d}</div>
                {dayChips.map((c, ci) => <div key={ci} onClick={(e) => { e.stopPropagation(); openTenant(c.room); }} style={{ fontSize: 9, padding: "2px 4px", borderRadius: 3, marginBottom: 2, background: c.type === "out" ? "#FCEBEB" : "#E6F1FB", color: c.type === "out" ? "#A32D2D" : "#0C447C", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", cursor: "pointer" }}>{c.label}</div>)}
              </div>);
            })}
          </div>
          </div>
          <div style={{ padding: "8px 16px", display: "flex", gap: 12, borderTop: "1px solid rgba(0,0,0,.06)", flexShrink: 0 }}>
            {[["#FCEBEB", "#A32D2D", "Lease end"], ["#E6F1FB", "#0C447C", "Move-in"]].map(([bg, c, l]) => (
              <div key={l} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 10, color: "#6b5e52" }}>
                <div style={{ width: 10, height: 10, borderRadius: 2, background: bg, border: `1px solid ${c}44` }} />{l}
              </div>
            ))}
          </div>
        </div>);
      })()}

      {/* ═══ KANBAN ═══ */}
      {ttView === "kanban" && <div style={{ maxHeight: "calc(100vh - 220px)", overflowY: "auto", overflowX: "auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(6,1fr)", gap: 10, minWidth: 900 }}>
          {[
            { id: "incoming", label: "Incoming", color: "#065F46", bg: "#D1FAE5", border: "rgba(6,95,70,.2)", filter: r => r.st === "occupied" && r.tenant && isFutureRoom(r) },
            { id: "active", label: "Active", color: "#0C447C", bg: "#E6F1FB", border: "rgba(12,68,124,.15)", filter: r => r.st === "occupied" && r.tenant && !isFutureRoom(r) && ((r.le && daysUntil(r.le) > 90) || !r.le) },
            { id: "exp90", label: "Expiring 90d", color: "#633806", bg: "#FAEEDA", border: "rgba(212,168,83,.25)", filter: r => r.st === "occupied" && r.tenant && !isFutureRoom(r) && r.le && daysUntil(r.le) <= 90 && daysUntil(r.le) > 30 },
            { id: "exp30", label: "Expiring 30d", color: "#791F1F", bg: "#FCEBEB", border: "rgba(196,92,74,.2)", filter: r => r.st === "occupied" && r.tenant && !isFutureRoom(r) && r.le && daysUntil(r.le) <= 30 && daysUntil(r.le) > 0 },
            { id: "expired", label: "Expired / Holdover", color: "#4C2882", bg: "#EDE5F8", border: "rgba(76,40,130,.15)", filter: r => r.st === "occupied" && r.tenant && !isFutureRoom(r) && r.le && daysUntil(r.le) <= 0 },
            { id: "avail", label: "Available", color: "#27500A", bg: `rgba(${_acRgb},.06)`, border: `rgba(${_acRgb},.2)`, filter: r => r.st === "vacant" || !r.tenant },
          ].map(col => {
            const colRooms = sortedFiltered.filter(col.filter);
            return (
              <div key={col.id} style={{ background: col.bg, borderRadius: 10, padding: 10, border: `1px solid ${col.border}`, minHeight: 100, maxHeight: 500, overflowY: colRooms.length > 8 ? "auto" : "visible" }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: col.color, textTransform: "uppercase", letterSpacing: .4, marginBottom: 8, display: "flex", justifyContent: "space-between", position: "sticky", top: 0, background: col.bg, padding: "2px 0", zIndex: 1 }}>
                  <span>{col.label}</span>
                  <span style={{ background: "rgba(255,255,255,.8)", borderRadius: 10, padding: "0 6px", fontWeight: 700, color: "#3d3529" }}>{colRooms.length}</span>
                </div>
                {colRooms.length === 0 && <div style={{ fontSize: 10, color: "#aaa", padding: "4px 0" }}>None</div>}
                {colRooms.map(r => {
                  const dl = r.le ? daysUntil(r.le) : null;
                  const isFut = isFutureRoom(r);
                  const isM2M = r.tenant && !r.le && !isFut;
                  const daysToMoveIn = isFut ? Math.ceil((new Date(r.tenant.moveIn + "T00:00:00") - TODAY) / 86400000) : null;
                  return (
                    <div key={r.id} style={{ background: "#fff", borderRadius: 7, border: "0.5px solid rgba(0,0,0,.07)", padding: "8px 10px", marginBottom: 6, cursor: "pointer", transition: "all .15s" }}
                      onClick={() => openTenant(r)}
                      onMouseEnter={e => e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,.08)"}
                      onMouseLeave={e => e.currentTarget.style.boxShadow = "none"}>
                      <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 2, color: "#1a1714" }}>{r.name}</div>
                      <div style={{ fontSize: 10, color: "#6b5e52", marginBottom: 5 }}>{r.propName}</div>
                      {r.tenant && <div style={{ fontSize: 10, color: "#5c4a3a", marginBottom: 4 }}>{r.tenant.name}</div>}
                      {isFut && <div style={{ fontSize: 10, fontWeight: 600, color: "#065F46" }}>
                        Moves in {fmtD(r.tenant.moveIn)} &middot; {daysToMoveIn}d
                      </div>}
                      {isM2M && <div style={{ fontSize: 10, fontWeight: 600, color: "#4C2882" }}>Month-to-month</div>}
                      {r.le && !isFut && <div style={{ fontSize: 10, fontWeight: 600, color: col.color }}>
                        {dl !== null && dl <= 0 ? `Expired ${Math.abs(dl)}d ago` : `Ends ${fmtD(r.le)}`}{dl !== null && dl > 0 ? ` \u00B7 ${dl}d` : ""}
                      </div>}
                      {!r.le && !r.tenant && <div style={{ fontSize: 10, color: _ac, fontWeight: 600 }}>Ready now</div>}
                    </div>);
                })}
              </div>);
          })}
        </div>
      </div>}
    </div>
  );
}
