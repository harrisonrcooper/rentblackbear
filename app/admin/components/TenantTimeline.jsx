"use client";
import { useMemo, useCallback } from "react";

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

  /* ── Gantt window ─────────────────────────────────────────── */
  const baseDate = new Date(TODAY.getFullYear(), TODAY.getMonth() + ttMonthOffset, 1);
  const windowStart = new Date(baseDate); windowStart.setMonth(windowStart.getMonth() - 1);
  const windowEnd = new Date(baseDate); windowEnd.setMonth(windowEnd.getMonth() + 5);
  const totalDays = Math.ceil((windowEnd - windowStart) / 86400000);
  const dateToX = (ds) => { if (!ds) return 0; const d = Math.ceil((new Date(ds + "T00:00:00") - windowStart) / 86400000); return Math.max(0, Math.min(100, (d / totalDays) * 100)); };
  const months = useMemo(() => { const m = []; for (let i = 0; i < 7; i++) { const d = new Date(windowStart); d.setMonth(d.getMonth() + i); m.push({ label: d.toLocaleString("default", { month: "short", year: "2-digit" }), x: dateToX(d.toISOString().split("T")[0]) }); } return m; }, [ttMonthOffset]); // eslint-disable-line

  const views = [{ id: "gantt", label: "Gantt" }, { id: "countdown", label: "Countdown" }, { id: "calendar", label: "Calendar" }, { id: "kanban", label: "Kanban" }];

  const openTenant = (r) => { if (r.tenant) { setTenantProfileTab("summary"); setModal({ type: "tenant", data: r }); } else goTab("applications"); };

  /* [P2-5] Persist daily driver to settings */
  const setDailyDriver = (v) => { setTtPref(v); if (setSettings && save) { const u = { ...settings, timelinePref: v }; setSettings(u); save("hq-settings", u); } };

  /* ── Styles ────────────────────────────────────────────────── */
  const pillS = (on) => ({ padding: "4px 10px", fontSize: 10, fontWeight: 600, borderRadius: 20, border: on ? `1px solid ${_ac}` : "1px solid rgba(0,0,0,.12)", cursor: "pointer", fontFamily: "inherit", transition: "all .12s", background: on ? _ac : "transparent", color: on ? "#fff" : "#5c4a3a" });
  const toggleS = (on) => ({ padding: "6px 14px", fontSize: 11, fontWeight: 600, border: "none", borderRight: "1px solid rgba(0,0,0,.08)", cursor: "pointer", fontFamily: "inherit", transition: "all .15s", background: on ? _ac : "transparent", color: on ? "#fff" : "#5c4a3a" });
  const subTogS = (on) => ({ padding: "4px 12px", fontSize: 10, fontWeight: 600, border: "none", borderRight: "1px solid rgba(0,0,0,.08)", cursor: "pointer", fontFamily: "inherit", transition: "all .15s", background: on ? _ac : "transparent", color: on ? "#fff" : "#5c4a3a" });
  const barColor = (r) => {
    if (!r.le && r.tenant) return { bg: "#C8B8E8", text: "#4C2882" }; // M2M
    const dl = r.le ? daysUntil(r.le) : null;
    if (dl !== null && dl <= 0) return { bg: "#FCA5A5", text: "#791F1F" }; // expired
    if (dl !== null && dl <= 30) return { bg: "#FCA5A5", text: "#791F1F" }; // exp30
    if (dl !== null && dl <= 90) return { bg: "#FDE68A", text: "#633806" }; // exp90
    return { bg: "#B5D4F4", text: "#0C447C" }; // active
  };

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
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 8 }}>
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
                {v.label}{v.id === ttPref && <span style={{ marginLeft: 4, fontSize: 9 }}>*</span>}
              </button>
            ))}
          </div>
          {ttPref !== ttView && <button onClick={() => setDailyDriver(ttView)}
            style={{ fontSize: 10, padding: "6px 12px", borderRadius: 7, border: `1px solid rgba(${_acRgb},.3)`, background: `rgba(${_acRgb},.08)`, cursor: "pointer", fontFamily: "inherit", color: _ac, fontWeight: 600, transition: "all .15s" }}>
            Set as default
          </button>}
          {ttPref === ttView && <span style={{ fontSize: 10, color: _ac, fontWeight: 600, padding: "6px 4px" }}>Default view</span>}
        </div>
      </div>

      {/* ═══ GANTT ═══ */}
      {ttView === "gantt" && <div style={{ background: "#fff", borderRadius: 12, border: "1px solid rgba(0,0,0,.07)", overflow: "hidden" }}>
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
          </div>
          <button className="btn btn-out btn-sm" onClick={() => setTtMonthOffset(o => o + 1)}>Later</button>
        </div>
        {/* Month axis */}
        <div style={{ display: "flex", borderBottom: "1px solid rgba(0,0,0,.06)" }}>
          <div style={{ width: 140, flexShrink: 0, padding: "4px 12px", fontSize: 9, color: "#999", textTransform: "uppercase", letterSpacing: .5 }}>{ttGanttGrouped ? "Room" : "Room / Property"}</div>
          <div style={{ flex: 1, position: "relative", height: 22 }}>
            {months.map((m, i) => <div key={i} style={{ position: "absolute", left: m.x + "%", fontSize: 9, color: "#999", transform: "translateX(-50%)", whiteSpace: "nowrap", top: 5 }}>{m.label}</div>)}
          </div>
        </div>
        {/* Rows */}
        {(() => {
          const todayX = dateToX(TODAY_STR);
          const renderRow = (r, showProp = false) => {
            const isOcc = r.st === "occupied" && r.tenant;
            const isVac = !isOcc;
            const isM2M = isOcc && !r.le;
            const leX = r.le ? dateToX(r.le) : null;
            const moveInX = r.tenant?.moveIn ? dateToX(r.tenant.moveIn) : null;
            const dl = r.le ? daysUntil(r.le) : null;
            const bc = isOcc ? barColor(r) : null;
            return (
              <div key={r.id} style={{ display: "flex", alignItems: "center", borderBottom: "1px solid rgba(0,0,0,.04)", minHeight: 36, cursor: "pointer", transition: "background .1s" }}
                onClick={() => openTenant(r)}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(0,0,0,.025)"}
                onMouseLeave={e => e.currentTarget.style.background = ""}>
                <div style={{ width: 140, flexShrink: 0, padding: "4px 12px" }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: "#1a1714", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{r.name}</div>
                  {showProp && <div style={{ fontSize: 9, color: _ac, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{r.propName}</div>}
                  {isOcc && <div style={{ fontSize: 9, color: "#6b5e52", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{r.tenant.name}{r.tenant.moveIn ? " · since " + fmtD(r.tenant.moveIn) : ""}</div>}
                  {isVac && <div style={{ fontSize: 9, color: _ac, fontWeight: 600 }}>Vacant</div>}
                </div>
                <div style={{ flex: 1, position: "relative", height: 36, display: "flex", alignItems: "center" }}>
                  {/* Today marker */}
                  <div style={{ position: "absolute", left: todayX + "%", top: 0, bottom: 0, width: 1.5, background: "#c45c4a", zIndex: 3, opacity: .7 }} />
                  {/* Vacant bar */}
                  {isVac && <div style={{ position: "absolute", left: "0%", right: "0%", height: 16, borderRadius: 3, background: `rgba(${_acRgb},.15)`, border: `1px solid rgba(${_acRgb},.3)`, display: "flex", alignItems: "center", paddingLeft: 6 }}>
                    <span style={{ fontSize: 9, color: _ac, fontWeight: 600 }}>Available now</span>
                  </div>}
                  {/* M2M bar */}
                  {isM2M && moveInX !== null && <div style={{ position: "absolute", left: moveInX + "%", right: "0%", height: 20, borderRadius: 3, background: bc.bg, top: 8, display: "flex", alignItems: "center", paddingLeft: 4, overflow: "hidden", transition: "filter .15s" }}
                    onMouseEnter={e => e.currentTarget.style.filter = "brightness(.95)"}
                    onMouseLeave={e => e.currentTarget.style.filter = ""}>
                    <span style={{ fontSize: 9, color: bc.text, fontWeight: 600, whiteSpace: "nowrap" }}>{r.tenant.name} · M2M</span>
                  </div>}
                  {/* Fixed-term bar */}
                  {isOcc && !isM2M && moveInX !== null && leX !== null && <div style={{ position: "absolute", left: Math.min(moveInX, leX) + "%", width: Math.max(1, Math.abs(leX - Math.min(moveInX, leX))) + "%", height: 20, borderRadius: 3, background: bc.bg, top: 8, display: "flex", alignItems: "center", paddingLeft: 4, overflow: "hidden", transition: "filter .15s" }}
                    onMouseEnter={e => e.currentTarget.style.filter = "brightness(.93)"}
                    onMouseLeave={e => e.currentTarget.style.filter = ""}>
                    <span style={{ fontSize: 9, color: bc.text, fontWeight: 600, whiteSpace: "nowrap" }}>{r.tenant.name}{dl !== null && dl <= 0 ? " · EXPIRED" : " · ends " + fmtD(r.le)}</span>
                  </div>}
                  {/* Availability zone after lease */}
                  {isOcc && !isM2M && leX !== null && <div style={{ position: "absolute", left: leX + "%", right: "0%", height: 16, top: 10, background: `rgba(${_acRgb},.1)`, border: `1px dashed rgba(${_acRgb},.3)`, borderRadius: "0 3px 3px 0", display: "flex", alignItems: "center", paddingLeft: 4, overflow: "hidden" }}>
                    <span style={{ fontSize: 9, color: _ac, whiteSpace: "nowrap" }}>Avail. {fmtD(r.le)}</span>
                  </div>}
                </div>
              </div>);
          };
          if (ttGanttGrouped) {
            return props.filter(p => ttPropFilter === "all" || p.id === ttPropFilter).map(p => {
              const pRooms = sortRooms(allRooms(p).filter(r => !r.ownerOccupied).map(r => ({ ...r, propName: getPropDisplayName(p), propId: p.id })));
              if (!pRooms.length) return null;
              return (<div key={p.id}>
                <div style={{ padding: "5px 12px", fontSize: 10, fontWeight: 700, color: _ac, background: `rgba(${_acRgb},.04)`, borderBottom: "1px solid rgba(0,0,0,.04)", textTransform: "uppercase", letterSpacing: .3 }}>{getPropDisplayName(p)}</div>
                {pRooms.map(r => renderRow(r, false))}
              </div>);
            });
          }
          return sortedFiltered.map(r => renderRow(r, true));
        })()}
        {/* Legend */}
        <div style={{ padding: "8px 16px", display: "flex", gap: 12, borderTop: "1px solid rgba(0,0,0,.06)", background: "rgba(0,0,0,.01)", flexWrap: "wrap" }}>
          {[["#B5D4F4", "Active"], ["#FDE68A", "Expiring 90d"], ["#FCA5A5", "Expiring 30d / Expired"], ["#C8B8E8", "Month-to-month"], [`rgba(${_acRgb},.15)`, "Available"]].map(([c, l]) => (
            <div key={l} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 10, color: "#6b5e52" }}>
              <div style={{ width: 10, height: 10, borderRadius: 2, background: c }} />{l}
            </div>
          ))}
          <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 10, color: "#6b5e52" }}>
            <div style={{ width: 1.5, height: 10, background: "#c45c4a" }} />Today
          </div>
        </div>
        {sortedFiltered.length === 0 && <div style={{ textAlign: "center", padding: 40, color: "#6b5e52", fontSize: 12 }}>No rooms match this filter.</div>}
      </div>}

      {/* ═══ COUNTDOWN ═══ */}
      {ttView === "countdown" && <div>
        {sortedFiltered.length === 0 && <div style={{ textAlign: "center", padding: 40, color: "#6b5e52", fontSize: 12, background: "#fff", borderRadius: 12, border: "1px solid rgba(0,0,0,.07)" }}>No rooms match this filter.</div>}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(180px,1fr))", gap: 10 }}>
          {sortedFiltered.map(r => {
            const isVac = r.st === "vacant" || !r.tenant;
            const isM2M = !isVac && !r.le;
            const dl = r.le ? daysUntil(r.le) : null;
            const isExpired = dl !== null && dl <= 0;
            const badgeColor = isVac ? _ac : isM2M ? "#4C2882" : isExpired ? "#791F1F" : dl <= 30 ? "#A32D2D" : dl <= 90 ? "#633806" : "#0C447C";
            const badgeBg = isVac ? `rgba(${_acRgb},.1)` : isM2M ? "#EDE5F8" : isExpired ? "#FCEBEB" : dl <= 30 ? "#FCEBEB" : dl <= 90 ? "#FAEEDA" : "#E6F1FB";
            const tenure = r.tenant?.moveIn ? Math.max(0, Math.ceil((TODAY - new Date(r.tenant.moveIn + "T00:00:00")) / (86400000 * 30))) : null;
            return (
              <div key={r.id} style={{ background: "#fff", borderRadius: 10, border: "1px solid rgba(0,0,0,.07)", padding: "12px 14px", cursor: "pointer", transition: "all .15s" }}
                onClick={() => openTenant(r)}
                onMouseEnter={e => e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,.08)"}
                onMouseLeave={e => e.currentTarget.style.boxShadow = "none"}>
                <div style={{ fontSize: 10, color: "#6b5e52", marginBottom: 2 }}>{r.propName}</div>
                <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 2, color: "#1a1714" }}>{r.name}</div>
                {r.tenant && <div style={{ fontSize: 11, color: "#5c4a3a", marginBottom: 4 }}>{r.tenant.name}{r.tenant.occupationType ? " · " + r.tenant.occupationType : ""}</div>}
                {r.tenant && tenure !== null && <div style={{ fontSize: 9, color: "#9ca3af", marginBottom: 6 }}>Moved in {fmtD(r.tenant.moveIn)} ({tenure} mo)</div>}
                {!r.tenant && <div style={{ fontSize: 11, color: _ac, fontWeight: 600, marginBottom: 8 }}>Vacant</div>}
                <div style={{ fontSize: 28, fontWeight: 700, color: badgeColor, lineHeight: 1 }}>{isVac ? "0" : isM2M ? "\u221E" : isExpired ? Math.abs(dl) : dl != null ? dl : "\u2014"}</div>
                <div style={{ fontSize: 10, color: "#6b5e52", marginBottom: 8 }}>{isM2M ? "month-to-month" : isExpired ? "days past lease end" : "days until lease ends"}</div>
                {r.le && <div style={{ fontSize: 10, color: "#6b5e52", marginBottom: 4 }}>{isExpired ? "Expired" : "Ends"} {fmtD(r.le)}</div>}
                <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 4, background: badgeBg, color: badgeColor, fontWeight: 600 }}>
                  {isVac ? "Available now" : isM2M ? "Month-to-month" : isExpired ? "Expired / Holdover" : dl <= 30 ? "Expiring soon" : dl <= 90 ? "Coming up" : "Active"}
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
        return (<div style={{ background: "#fff", borderRadius: 12, border: "1px solid rgba(0,0,0,.07)", overflow: "hidden" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 16px", borderBottom: "1px solid rgba(0,0,0,.06)", background: "rgba(0,0,0,.015)" }}>
            <button className="btn btn-out btn-sm" onClick={() => setTtMonthOffset(o => o - 1)}>Prev</button>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <button className="btn btn-out btn-sm" style={{ fontSize: 9 }} onClick={() => setTtMonthOffset(0)}>Today</button>
              <span style={{ fontSize: 13, fontWeight: 700 }}>{calBase.toLocaleString("default", { month: "long", year: "numeric" })}</span>
            </div>
            <button className="btn btn-out btn-sm" onClick={() => setTtMonthOffset(o => o + 1)}>Next</button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", borderBottom: "1px solid rgba(0,0,0,.06)" }}>
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(d => <div key={d} style={{ padding: "5px", textAlign: "center", fontSize: 10, fontWeight: 600, color: "#6b5e52", background: "rgba(0,0,0,.02)" }}>{d}</div>)}
          </div>
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
          <div style={{ padding: "8px 16px", display: "flex", gap: 12, borderTop: "1px solid rgba(0,0,0,.06)" }}>
            {[["#FCEBEB", "#A32D2D", "Lease end"], ["#E6F1FB", "#0C447C", "Move-in"]].map(([bg, c, l]) => (
              <div key={l} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 10, color: "#6b5e52" }}>
                <div style={{ width: 10, height: 10, borderRadius: 2, background: bg, border: `1px solid ${c}44` }} />{l}
              </div>
            ))}
          </div>
        </div>);
      })()}

      {/* ═══ KANBAN ═══ */}
      {ttView === "kanban" && <div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 10 }}>
          {[
            { id: "active", label: "Active", color: "#0C447C", bg: "#E6F1FB", border: "rgba(12,68,124,.15)", filter: r => r.st === "occupied" && r.tenant && ((r.le && daysUntil(r.le) > 90) || !r.le) },
            { id: "exp90", label: "Expiring 90d", color: "#633806", bg: "#FAEEDA", border: "rgba(212,168,83,.25)", filter: r => r.st === "occupied" && r.tenant && r.le && daysUntil(r.le) <= 90 && daysUntil(r.le) > 30 },
            { id: "exp30", label: "Expiring 30d", color: "#791F1F", bg: "#FCEBEB", border: "rgba(196,92,74,.2)", filter: r => r.st === "occupied" && r.tenant && r.le && daysUntil(r.le) <= 30 && daysUntil(r.le) > 0 },
            { id: "expired", label: "Expired / Holdover", color: "#4C2882", bg: "#EDE5F8", border: "rgba(76,40,130,.15)", filter: r => r.st === "occupied" && r.tenant && r.le && daysUntil(r.le) <= 0 },
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
                  const isM2M = r.tenant && !r.le;
                  return (
                    <div key={r.id} style={{ background: "#fff", borderRadius: 7, border: "0.5px solid rgba(0,0,0,.07)", padding: "8px 10px", marginBottom: 6, cursor: "pointer", transition: "all .15s" }}
                      onClick={() => openTenant(r)}
                      onMouseEnter={e => e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,.08)"}
                      onMouseLeave={e => e.currentTarget.style.boxShadow = "none"}>
                      <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 2, color: "#1a1714" }}>{r.name}</div>
                      <div style={{ fontSize: 10, color: "#6b5e52", marginBottom: 5 }}>{r.propName}</div>
                      {r.tenant && <div style={{ fontSize: 10, color: "#5c4a3a", marginBottom: 4 }}>{r.tenant.name}</div>}
                      {isM2M && <div style={{ fontSize: 10, fontWeight: 600, color: "#4C2882" }}>Month-to-month</div>}
                      {r.le && <div style={{ fontSize: 10, fontWeight: 600, color: col.color }}>
                        {dl !== null && dl <= 0 ? `Expired ${Math.abs(dl)}d ago` : `Ends ${fmtD(r.le)}`}{dl !== null && dl > 0 ? ` · ${dl}d` : ""}
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
