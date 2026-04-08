"use client";
import { useState } from "react";

// ── Helpers ────────────────────────────────────────────────────────
const hexToRgba = (hex, opacity) => {
  const h = hex.replace("#", "");
  const r = parseInt(h.substr(0, 2), 16) || 0;
  const g = parseInt(h.substr(2, 2), 16) || 0;
  const b = parseInt(h.substr(4, 2), 16) || 0;
  return `rgba(${r},${g},${b},${opacity})`;
};

// ── SVG Icons (no emojis per CLAUDE_CODE_CONTEXT rule #6) ─────────
const IconGrip = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="9" cy="5" r="1"/><circle cx="15" cy="5" r="1"/><circle cx="9" cy="12" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="9" cy="19" r="1"/><circle cx="15" cy="19" r="1"/></svg>;
const IconChevDown = () => <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 12 15 18 9"/></svg>;
const IconChevRight = () => <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>;
const IconEdit = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>;
const IconUser = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
const IconFile = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>;
const IconCard = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>;
const IconClock = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;
const IconCheck = () => <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>;
const IconX = () => <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
const IconHome = () => <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>;
const IconKey = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/></svg>;

const allRooms = (prop) => {
  if (!prop) return [];
  if (prop.units && prop.units.length > 0) return prop.units.flatMap(u => u.rooms || []);
  return prop.rooms || [];
};

// ── Component ──────────────────────────────────────────────────────
export default function PropertiesList({
  settings, properties, setProperties, payments, leaseableItems,
  expanded, setExpanded, editProp, setEditProp, setIsNewProp,
  setTab, setModal, setBulkSel, fmtS, fmtD, PROP_TYPES, getPropDisplayName, TODAY, MO,
}) {
  const [dragPropIdx, setDragPropIdx] = useState(null);
  const [dragOverPropIdx, setDragOverPropIdx] = useState(null);

  const _acc = settings?.adminAccent || "#4a7c59";
  const _grn = settings?.themeGreen || "#4a7c59";
  const _red = settings?.themeRed || "#c45c4a";
  const _gold = settings?.themeGold || "#d4a853";
  const props = properties || [];

  return (<>
    <div className="sec-hd"><div><h2>Manage Properties</h2><p>Click any property for details, or edit to manage rooms</p></div>
      <button className="btn btn-gold" onClick={() => { setIsNewProp(true); setEditProp({}); }}>+ Add Property</button></div>

    {props.map((p, idx) => {
      const items = leaseableItems(p);
      const allWhole = (p.units || []).every(u => (u.rentalMode || "byRoom") === "wholeHouse");
      const anyWhole = (p.units || []).some(u => (u.rentalMode || "byRoom") === "wholeHouse");
      const wholeUnitRent = (p.units || []).reduce((s, u) => (u.rentalMode || "byRoom") === "wholeHouse" ? s + (u.rent || 0) : s, 0);
      const byRoomRooms = allRooms(p).filter(r => { const u = (p.units || []).find(u2 => (u2.rooms || []).some(x => x.id === r.id)); return (u?.rentalMode || "byRoom") === "byRoom"; });
      const pr = byRoomRooms.map(r => r.rent);
      const vac = items.filter(i => i.st === "vacant").length;
      const occItems = items.filter(i => i.st === "occupied");
      const occRooms = byRoomRooms.filter(r => r.st === "occupied");
      const isExp = expanded["prop-" + p.id];
      const totalRent = items.reduce((s, i) => s + i.rent, 0);
      const projRent = occItems.reduce((s, i) => s + i.rent, 0);
      const unpaidRooms = occRooms.filter(r => r.tenant && !(payments[r.id] && payments[r.id][MO]));
      const expiringRooms = occRooms.filter(r => { if (!r.le || !r.tenant) return false; const d = Math.ceil((new Date(r.le + "T00:00:00") - TODAY) / (1e3 * 60 * 60 * 24)); return d <= 90; });

      return (
        <div key={p.id} className="card"
          draggable
          onDragStart={() => setDragPropIdx(idx)}
          onDragEnter={() => setDragOverPropIdx(idx)}
          onDragOver={e => e.preventDefault()}
          onDragEnd={() => {
            if (dragPropIdx !== null && dragOverPropIdx !== null && dragPropIdx !== dragOverPropIdx) {
              const reordered = [...props];
              const [moved] = reordered.splice(dragPropIdx, 1);
              reordered.splice(dragOverPropIdx, 0, moved);
              setProperties(reordered);
            }
            setDragPropIdx(null); setDragOverPropIdx(null);
          }}
          style={{ marginBottom: 10, opacity: dragPropIdx === idx ? .5 : 1,
            border: dragOverPropIdx === idx && dragPropIdx !== idx ? "2px solid " + _acc : "2px solid transparent",
            borderRadius: 12, transition: "opacity .15s,border-color .1s", cursor: "grab" }}>

          {/* Card header */}
          <div className="card-hd" onClick={() => setExpanded(x => ({ ...x, ["prop-" + p.id]: !x["prop-" + p.id] }))}>
            <div>
              <h3 style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <span style={{ color: "#8a7d74", cursor: "grab", flexShrink: 0 }}><IconGrip /></span>
                <span style={{ color: "#8a7d74", flexShrink: 0 }}>{isExp ? <IconChevDown /> : <IconChevRight />}</span>
                {p.addr || p.name}
              </h3>
              <div style={{ fontSize: 10, color: "#6b5e52", marginTop: 2 }}>
                {p.addr} &middot; {(PROP_TYPES[p.type] || PROP_TYPES.SFH).label} &middot; {allWhole ? "Whole Unit" : anyWhole ? "Mixed" : allRooms(p).length + "br"} &middot; {(p.units || []).length > 1 ? (p.units || []).length + " units" : "1 unit"} &middot; {(p.units || [])[0]?.utils === "allIncluded" ? "All Utils" : "Tenant Pays"}
              </div>
            </div>
            <div style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap", justifyContent: "flex-end" }}>
              {allWhole && wholeUnitRent > 0 && <span style={{ fontWeight: 800, color: _gold, marginRight: 4 }}>{fmtS(wholeUnitRent)}/mo <span style={{ fontSize: 9, fontWeight: 400, color: "#6b5e52" }}>whole unit</span></span>}
              {!allWhole && pr.length > 0 && <span style={{ fontWeight: 800, marginRight: 4 }}>{fmtS(Math.min(...pr))}&ndash;{fmtS(Math.max(...pr))} <span style={{ fontSize: 9, fontWeight: 400, color: "#6b5e52" }}>per room</span></span>}
              {vac > 0 && <span className="badge b-red">{vac} Vacant</span>}
              {vac === 0 && items.length > 0 && <span className="badge b-green">{allWhole ? "Whole Unit" : "Full"}</span>}
              {unpaidRooms.length > 0 && <span className="badge b-red" title={unpaidRooms.map(r => r.tenant?.name || "Unknown").join(", ") + " unpaid"}>
                <IconCard /> {unpaidRooms.length} Unpaid
              </span>}
              {expiringRooms.length > 0 && <span className="badge b-gold" title={expiringRooms.map(r => (r.tenant?.name || "Unknown") + " (" + Math.ceil((new Date(r.le + "T00:00:00") - TODAY) / (1e3 * 60 * 60 * 24)) + "d)").join(", ")}>
                <IconClock /> {expiringRooms.length} Expiring
              </span>}
              <button className="btn btn-out btn-sm" onClick={e => { e.stopPropagation(); setIsNewProp(false); setEditProp(p); }} style={{ display: "flex", alignItems: "center", gap: 3 }}>
                <IconEdit /> Edit
              </button>
            </div>
          </div>

          {/* Expanded body */}
          {isExp && <div className="card-bd" style={{ animation: "fadeIn .15s" }}>
            {/* Property summary KPIs — responsive */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))", gap: 8, marginBottom: 14 }}>
              {!allWhole && <div style={{ background: "#faf9f7", borderRadius: 8, padding: 10, textAlign: "center" }}><div style={{ fontSize: 9, color: "#6b5e52", fontWeight: 700, textTransform: "uppercase", letterSpacing: .5 }}>Rooms</div><div style={{ fontSize: 18, fontWeight: 800 }}>{allRooms(p).length}</div></div>}
              {!allWhole && <div style={{ background: "#faf9f7", borderRadius: 8, padding: 10, textAlign: "center" }}><div style={{ fontSize: 9, color: "#6b5e52", fontWeight: 700, textTransform: "uppercase", letterSpacing: .5 }}>Occupied</div><div style={{ fontSize: 18, fontWeight: 800, color: _grn }}>{occRooms.length}</div></div>}
              {allWhole && <div style={{ background: "#faf9f7", borderRadius: 8, padding: 10, textAlign: "center", gridColumn: "span 2" }}><div style={{ fontSize: 9, color: "#6b5e52", fontWeight: 700, textTransform: "uppercase", letterSpacing: .5 }}>Monthly Rent</div><div style={{ fontSize: 18, fontWeight: 800 }}>{fmtS(wholeUnitRent)}<small style={{ fontSize: 9, color: "#6b5e52" }}>/mo</small></div></div>}
              <div style={{ background: "#faf9f7", borderRadius: 8, padding: 10, textAlign: "center" }}><div style={{ fontSize: 9, color: "#6b5e52", fontWeight: 700, textTransform: "uppercase", letterSpacing: .5 }}>Projected</div><div style={{ fontSize: 18, fontWeight: 800 }}>{fmtS(projRent)}<small style={{ fontSize: 9, color: "#6b5e52" }}>/mo</small></div></div>
              <div style={{ background: "#faf9f7", borderRadius: 8, padding: 10, textAlign: "center" }}><div style={{ fontSize: 9, color: "#6b5e52", fontWeight: 700, textTransform: "uppercase", letterSpacing: .5 }}>At Full</div><div style={{ fontSize: 18, fontWeight: 800 }}>{fmtS(totalRent)}<small style={{ fontSize: 9, color: "#6b5e52" }}>/mo</small></div></div>
            </div>

            {/* Whole unit info */}
            {allWhole && <div style={{ padding: "12px 14px", background: "#faf9f7", borderRadius: 8, marginBottom: 10 }}>
              {(p.units || []).map(u => <div key={u.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700 }}>{(p.units || []).length > 1 ? u.name : "Whole Unit"} &middot; {u.utils === "allIncluded" ? "All Utilities" : u.utils === "first100" ? "First $100 Utilities" : "Tenant Pays"} &middot; {u.clean || "Biweekly"} Clean</div>
                  <div style={{ fontSize: 10, color: "#6b5e52", marginTop: 2 }}>Single lease &middot; {u.baths || 1} bath{u.baths !== 1 ? "s" : ""}</div>
                </div>
                <button className="btn btn-out btn-sm" style={{ fontSize: 9, color: _grn, borderColor: hexToRgba(_grn, .2) }} onClick={() => { setTab("applications"); setBulkSel([]); }}>+ Find Tenant</button>
              </div>)}
            </div>}

            {/* Unit list */}
            <div style={{ fontSize: 10, fontWeight: 700, color: "#6b5e52", textTransform: "uppercase", letterSpacing: .8, marginBottom: 6 }}>{anyWhole && !allWhole ? "Units & Rooms" : "Rooms by Unit"}</div>
            {(p.units || []).map(u => {
              const uIsWhole = (u.rentalMode || "byRoom") === "wholeHouse";
              const uRooms = u.rooms || [];
              const uOcc = uRooms.some(r => r.st === "occupied");
              const uLatestLe = uRooms.filter(r => r.le).sort((a, b) => new Date(b.le) - new Date(a.le))[0]?.le;
              return (<div key={u.id} style={{ marginBottom: 10 }}>
                {(p.units || []).length > 1 && <div style={{ fontSize: 10, fontWeight: 800, color: _acc, textTransform: "uppercase", letterSpacing: .5, marginBottom: 4, padding: "3px 8px", background: hexToRgba(_acc, .06), borderRadius: 4, display: "inline-flex", alignItems: "center", gap: 6 }}>
                  {u.name}
                  <span style={{ fontSize: 8, fontWeight: 500, color: "#6b5e52", textTransform: "none", letterSpacing: 0 }}>{uIsWhole ? "Whole Unit" : "By Room"}</span>
                </div>}

                {uIsWhole ? (
                  <div className="row" style={{ padding: "10px 12px", marginBottom: 3, cursor: "default" }}>
                    <div className="row-dot" style={{ background: uOcc ? _grn : _red, flexShrink: 0 }} />
                    <div className="row-i">
                      <div style={{ fontSize: 12, fontWeight: 600 }}>{u.name} &mdash; Whole Unit</div>
                      {uOcc
                        ? <div style={{ fontSize: 10, color: "#6b5e52", marginTop: 1 }}>Occupied &middot; ends {fmtD(uLatestLe)}</div>
                        : <div style={{ fontSize: 10, color: _red, fontWeight: 600, marginTop: 1 }}>Vacant &mdash; {fmtS(u.rent)}/mo</div>}
                    </div>
                    <div style={{ textAlign: "right", minWidth: 60, marginRight: 8 }}>
                      <div style={{ fontSize: 14, fontWeight: 800 }}>{fmtS(u.rent)}</div>
                    </div>
                    <button className="btn btn-out btn-sm" style={{ fontSize: 9, color: _grn, borderColor: hexToRgba(_grn, .2), display: "flex", alignItems: "center", gap: 3 }} onClick={() => {
                      if (uOcc) { const rep = (u.rooms || []).find(r => r.tenant); if (rep) setModal({ type: "tenant", data: { ...rep, propName: p.addr || p.name, propUtils: u.utils || p.utils, propClean: u.clean || p.clean, unitName: u.name, unitLabel: u.label } }); }
                      else if (!u.ownerOccupied) { setTab("applications"); setBulkSel([]); }
                    }}>
                      {uOcc ? <><IconUser /> View Tenant</> : u.ownerOccupied ? <><IconKey /> Owner</> : "+ Find Tenant"}
                    </button>
                  </div>
                ) : (
                  <>
                    {uRooms.length === 0 && <div style={{ fontSize: 11, color: "#7a7067", padding: "6px 0" }}>No rooms &mdash; edit property to add</div>}
                    {uRooms.map(r => {
                      const occ = r.st === "occupied" && r.tenant;
                      const pd = (payments[r.id] && payments[r.id][MO]) || 0;
                      const dl = r.le ? Math.ceil((new Date(r.le + "T00:00:00") - TODAY) / (1e3 * 60 * 60 * 24)) : null;
                      const tenantData = { ...r, propName: p.addr || p.name, propUtils: u.utils || p.utils, propClean: u.clean || p.clean, unitName: u.name, unitLabel: u.label };
                      return (<div key={r.id} className="row" style={{ padding: "10px 12px", marginBottom: 3, cursor: "default", background: occ && dl && dl <= 30 ? hexToRgba(_red, .02) : occ && dl && dl <= 90 ? hexToRgba(_gold, .02) : "#fff" }}>
                        <div className="row-dot" style={{ background: occ ? _grn : _red, flexShrink: 0 }} />
                        <div className="row-i">
                          <div style={{ fontSize: 12, fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}>
                            {r.name}
                            <span className={"badge " + (r.pb ? "b-green" : "b-gray")} style={{ fontSize: 7 }}>{r.pb ? "Private" : "Shared"}</span>
                            {r.sqft && <span style={{ fontSize: 9, color: "#6b5e52" }}>{r.sqft.toLocaleString()} sqft</span>}
                          </div>
                          {occ
                            ? <div style={{ fontSize: 10, color: "#6b5e52", marginTop: 1 }}>{r.tenant.name} &middot; ends {fmtD(r.le)}{dl && dl <= 90 ? <span style={{ color: dl <= 30 ? _red : _gold, fontWeight: 700, marginLeft: 4, display: "inline-flex", alignItems: "center", gap: 2 }}><IconClock /> {dl}d</span> : null}</div>
                            : r.ownerOccupied ? <div style={{ fontSize: 10, color: _acc, fontWeight: 600, marginTop: 1 }}>Owner Occupied</div>
                            : <div style={{ fontSize: 10, color: _red, fontWeight: 600, marginTop: 1 }}>Vacant &mdash; {fmtS(r.rent)}/mo lost</div>}
                        </div>
                        <div style={{ textAlign: "right", minWidth: 60, marginRight: 8 }}>
                          <div style={{ fontSize: 14, fontWeight: 800 }}>{fmtS(r.rent)}</div>
                          {occ && <div style={{ fontSize: 9, color: pd ? _grn : _red, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 2 }}>
                            {pd ? <><IconCheck /> Paid</> : <><IconX /> Unpaid</>}
                          </div>}
                        </div>
                        {occ
                          ? <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
                            <button className="btn btn-out btn-sm" style={{ fontSize: 9, display: "flex", alignItems: "center", gap: 3 }} onClick={() => setModal({ type: "tenant", data: tenantData })}><IconUser /> Profile</button>
                            <button className="btn btn-gold btn-sm" style={{ fontSize: 9, display: "flex", alignItems: "center", gap: 3 }} onClick={() => setModal({ type: "tenant", data: tenantData, startSection: "lease" })}><IconFile /> Lease</button>
                          </div>
                          : r.ownerOccupied ? <span style={{ fontSize: 9, color: _acc, fontWeight: 600, padding: "4px 8px", background: hexToRgba(_acc, .06), borderRadius: 4 }}>Owner</span>
                          : <button className="btn btn-out btn-sm" style={{ fontSize: 9, color: _grn, borderColor: hexToRgba(_grn, .2) }} onClick={() => { setTab("applications"); setBulkSel([]); }}>+ Find Tenant</button>}
                      </div>);
                    })}
                  </>
                )}
              </div>);
            })}
          </div>}
        </div>
      );
    })}

    {/* Empty state */}
    {props.length === 0 && <div style={{ textAlign: "center", padding: 40, color: "#6b5e52" }}>
      <div style={{ marginBottom: 12, color: "#8a7d74" }}><IconHome /></div>
      <h3 style={{ fontSize: 15 }}>No Properties</h3>
      <p style={{ fontSize: 12, marginTop: 4 }}>Add your first property above.</p>
    </div>}
  </>);
}
