"use client";
import { useState, useMemo } from "react";

export default function PortalOps({
  settings, props, allTenants, uid, TODAY,
  portalOpsTab, setPortalOpsTab,
  utilBillForm, setUtilBillForm, utilityBills, setUtilityBills,
  docReqForm, setDocReqForm, docRequests, setDocRequests,
  amenityForm, setAmenityForm, amenities, setAmenities, amenityBookings,
  surveyForm, setSurveyForm, surveys, setSurveys, surveyResults,
  pkgForm, setPkgForm, packages, setPackages,
  setCharges, createCharge, setNotifs,
}) {
  const _ac = settings?.adminAccent || "#4a7c59";
  const _acRgb = settings?.adminAccentRgb || "74,124,89";
  const fmtS = n => "$" + Number(n || 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const todayStr = TODAY ? TODAY.toISOString().split("T")[0] : new Date().toISOString().split("T")[0];

  /* ── Local state ─────────────────────────────────────────── */
  const [errs, setErrs] = useState({});
  const [shaking, setShaking] = useState(false);
  const [success, setSuccess] = useState(null); /* string message */
  const [confirmDelete, setConfirmDelete] = useState(null); /* { id, type, label } */
  const [editBillId, setEditBillId] = useState(null);

  const shake = () => { setShaking(true); setTimeout(() => setShaking(false), 500); };
  const flash = (msg) => { setSuccess(msg); setTimeout(() => setSuccess(null), 3000); };
  const clearErrs = () => setErrs({});

  /* [P2-1] Auto-mark overdue document requests */
  const enrichedDocReqs = useMemo(() => docRequests.map(dr => {
    if (dr.status === "pending" && dr.deadline && dr.deadline < todayStr) return { ...dr, _displayStatus: "overdue" };
    return { ...dr, _displayStatus: dr.status };
  }), [docRequests, todayStr]);

  /* ── Send email helper ─────────────────────────────────── */
  const sendEmail = async (to, subject, html) => {
    if (!to) return false;
    try {
      const res = await fetch("/api/send-email", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to, subject, fromName: (settings?.pmName || "Property Manager") + " | " + (settings?.companyName || ""), replyTo: settings?.pmEmail || settings?.email || "", html }),
      });
      return res.ok;
    } catch { return false; }
  };

  /* ── Styles ────────────────────────────────────────────── */
  const labelS = { fontSize: 10, fontWeight: 600, color: "#6b5e52", display: "block", marginBottom: 4 };
  const inputS = { width: "100%", padding: "8px 10px", borderRadius: 6, border: "1px solid rgba(0,0,0,.1)", fontSize: 12, fontFamily: "inherit", boxSizing: "border-box" };
  const selectS = { ...inputS, background: "#fff" };
  const errInputS = (key) => errs[key] ? { ...inputS, borderColor: "#c45c4a" } : inputS;
  const errSelectS = (key) => errs[key] ? { ...selectS, borderColor: "#c45c4a" } : selectS;
  const rowHover = { cursor: "default", transition: "background .1s" };

  const subTabs = [
    { id: "utilities", label: "Utility Bills", icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg> },
    { id: "doc-requests", label: "Documents", icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6" /><path d="M12 18v-6" /><path d="M9 15h6" /></svg> },
    { id: "amenities", label: "Amenities", icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></svg> },
    { id: "surveys", label: "Surveys", icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" /><rect x="8" y="2" width="8" height="4" rx="1" /><path d="M9 14l2 2 4-4" /></svg> },
    { id: "packages", label: "Packages", icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /><path d="M3.27 6.96L12 12.01l8.73-5.05" /><path d="M12 22.08V12" /></svg> },
  ];

  return (
    <div style={{ padding: "0 0 40px" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>Portal Operations</h2>
          <div style={{ fontSize: 11, color: "#6b5e52", marginTop: 2 }}>Manage utilities, documents, amenities, surveys, and packages</div>
        </div>
      </div>

      {/* [P1-2] Success toast */}
      {success && <div style={{ position: "fixed", top: 20, right: 20, zIndex: 999, padding: "10px 20px", borderRadius: 8, background: _ac, color: "#fff", fontSize: 12, fontWeight: 600, boxShadow: "0 4px 16px rgba(0,0,0,.15)", animation: "fadeIn .2s" }}>{success}</div>}

      {/* Sub-tabs */}
      <div style={{ display: "flex", gap: 0, marginBottom: 20, borderBottom: "1px solid rgba(0,0,0,.08)", overflowX: "auto" }}>
        {subTabs.map(st => {
          const active = portalOpsTab === st.id;
          return (
            <button key={st.id} onClick={() => { setPortalOpsTab(st.id); clearErrs(); }}
              style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 18px", border: "none", borderBottom: active ? `2px solid ${_ac}` : "2px solid transparent", background: "transparent", color: active ? "#1a1714" : "#7a7067", fontWeight: active ? 700 : 400, fontSize: 12, cursor: "pointer", fontFamily: "inherit", transition: "all .15s", whiteSpace: "nowrap" }}>
              {st.icon}{st.label}
            </button>);
        })}
      </div>

      {/* ═══ UTILITY BILLS ═══ */}
      {portalOpsTab === "utilities" && (<>
        <div className="card" style={{ marginBottom: 20, animation: shaking ? "shake .4s ease, redFlash .5s ease" : undefined }}><div className="card-bd" style={{ padding: "20px 24px" }}>
          <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 14 }}>Enter Monthly Utility Bill</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 10, marginBottom: 12 }}>
            <div style={{ gridColumn: "1/5" }}>
              <label style={labelS}>Property *</label>
              <select value={utilBillForm.propId} onChange={e => { setUtilBillForm(f => ({ ...f, propId: e.target.value })); setErrs(p => ({ ...p, utilProp: null })); }} style={errSelectS("utilProp")}>
                <option value="">Select property...</option>
                {props.map(p => <option key={p.id} value={p.id}>{p.addr || p.name}</option>)}
              </select>
              {errs.utilProp && <div className="err-msg">{errs.utilProp}</div>}
            </div>
            <div>
              <label style={labelS}>Month *</label>
              <input type="month" value={utilBillForm.month} onChange={e => { setUtilBillForm(f => ({ ...f, month: e.target.value })); setErrs(p => ({ ...p, utilMonth: null })); }} style={errInputS("utilMonth")} />
              {errs.utilMonth && <div className="err-msg">{errs.utilMonth}</div>}
            </div>
            <div><label style={labelS}>Electric ($)</label><input type="number" min="0" value={utilBillForm.electric} onChange={e => setUtilBillForm(f => ({ ...f, electric: e.target.value }))} placeholder="0.00" style={inputS} /></div>
            <div><label style={labelS}>Gas ($)</label><input type="number" min="0" value={utilBillForm.gas} onChange={e => setUtilBillForm(f => ({ ...f, gas: e.target.value }))} placeholder="0.00" style={inputS} /></div>
            <div><label style={labelS}>Water ($)</label><input type="number" min="0" value={utilBillForm.water} onChange={e => setUtilBillForm(f => ({ ...f, water: e.target.value }))} placeholder="0.00" style={inputS} /></div>
            <div><label style={labelS}>Internet ($)</label><input type="number" min="0" value={utilBillForm.internet} onChange={e => setUtilBillForm(f => ({ ...f, internet: e.target.value }))} placeholder="0.00" style={inputS} /></div>
            <div><label style={labelS}>Coverage ($)</label><input type="number" min="0" value={utilBillForm.coverage} onChange={e => setUtilBillForm(f => ({ ...f, coverage: e.target.value }))} placeholder="0.00" style={inputS} /></div>
            <div><label style={labelS}>Residents</label><input type="number" min="0" value={utilBillForm.residentCount} onChange={e => setUtilBillForm(f => ({ ...f, residentCount: e.target.value }))} placeholder="0" style={inputS} /></div>
          </div>
          {/* [P0-5] Overage preview */}
          {utilBillForm.propId && utilBillForm.coverage && utilBillForm.residentCount && (() => {
            const total = parseFloat(utilBillForm.electric || 0) + parseFloat(utilBillForm.gas || 0) + parseFloat(utilBillForm.water || 0) + parseFloat(utilBillForm.internet || 0);
            const coverage = parseFloat(utilBillForm.coverage || 0);
            const residents = parseInt(utilBillForm.residentCount || 0);
            const overage = Math.max(0, total - coverage);
            const perPerson = residents > 0 ? overage / residents : 0;
            if (overage <= 0) return <div style={{ fontSize: 11, color: _ac, fontWeight: 600, marginBottom: 10 }}>Total {fmtS(total)} is within coverage ({fmtS(coverage)}). No overage.</div>;
            return <div style={{ fontSize: 11, color: "#c45c4a", fontWeight: 600, marginBottom: 10, padding: "8px 12px", background: "rgba(196,92,74,.05)", borderRadius: 6, border: "1px solid rgba(196,92,74,.15)" }}>Overage: {fmtS(overage)} total &middot; {fmtS(perPerson)} per resident ({residents} residents)</div>;
          })()}
          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn btn-green btn-sm" onClick={() => {
              const e = {};
              if (!utilBillForm.propId) e.utilProp = "Select a property";
              if (!utilBillForm.month) e.utilMonth = "Select the billing month";
              /* [P2-2] Validate non-negative */
              if (parseFloat(utilBillForm.electric || 0) < 0 || parseFloat(utilBillForm.gas || 0) < 0 || parseFloat(utilBillForm.water || 0) < 0 || parseFloat(utilBillForm.internet || 0) < 0) e.utilMonth = "Amounts cannot be negative";
              if (Object.keys(e).length) { setErrs(e); shake(); return; }
              const p = props.find(x => x.id === utilBillForm.propId);
              const total = parseFloat(utilBillForm.electric || 0) + parseFloat(utilBillForm.gas || 0) + parseFloat(utilBillForm.water || 0) + parseFloat(utilBillForm.internet || 0);
              const coverage = parseFloat(utilBillForm.coverage || 0);
              const residents = parseInt(utilBillForm.residentCount || 0);
              setUtilityBills(prev => [{ id: uid(), propId: utilBillForm.propId, propName: p?.addr || p?.name || "", month: utilBillForm.month, electric: parseFloat(utilBillForm.electric || 0), gas: parseFloat(utilBillForm.gas || 0), water: parseFloat(utilBillForm.water || 0), internet: parseFloat(utilBillForm.internet || 0), total, coverage, residentCount: residents, created: new Date().toISOString() }, ...prev]);
              /* [P0-5] Auto-create overage charges */
              const overage = Math.max(0, total - coverage);
              if (overage > 0 && residents > 0 && createCharge && p) {
                const perPerson = Math.round((overage / residents) * 100) / 100;
                const allRooms = (p.units || []).flatMap(u => (u.rooms || []).filter(r => r.tenant && r.st === "occupied"));
                allRooms.forEach(r => {
                  createCharge({ roomId: r.id, tenantName: r.tenant.name, propName: p.addr || p.name, roomName: r.name, category: "Utility Overage", desc: `${utilBillForm.month} Utility Overage`, amount: perPerson, dueDate: utilBillForm.month + "-15", sent: false, sentDate: todayStr });
                });
                if (setNotifs) setNotifs(prev => [{ id: uid(), type: "billing", msg: `Utility overage charges created: ${fmtS(perPerson)}/person x ${allRooms.length} tenants at ${p.addr || p.name}`, date: todayStr, read: false, urgent: false }, ...(prev || [])]);
              }
              setUtilBillForm({ propId: "", month: "", electric: "", gas: "", water: "", internet: "", coverage: "", residentCount: "" });
              clearErrs();
              flash("Utility bill saved" + (overage > 0 && residents > 0 ? " and overage charges created" : ""));
            }}>Save Bill</button>
            {/* [P4-4] Copy from last month */}
            {utilityBills.length > 0 && <button className="btn btn-out btn-sm" onClick={() => {
              const last = utilityBills[0];
              setUtilBillForm({ propId: last.propId, month: "", electric: String(last.electric || ""), gas: String(last.gas || ""), water: String(last.water || ""), internet: String(last.internet || ""), coverage: String(last.coverage || ""), residentCount: String(last.residentCount || "") });
            }}>Copy Last Bill</button>}
          </div>
        </div></div>

        {/* History */}
        <div className="card"><div className="card-bd" style={{ padding: 0 }}>
          <div style={{ padding: "14px 20px", borderBottom: "1px solid rgba(0,0,0,.06)", fontSize: 13, fontWeight: 700 }}>Bill History</div>
          {utilityBills.length === 0 && <div style={{ padding: "30px 20px", textAlign: "center", color: "#7a7067", fontSize: 12 }}>No utility bills recorded yet.</div>}
          {utilityBills.length > 0 && <div style={{ fontSize: 11, overflowX: "auto" }}>
            <div style={{ display: "grid", gridTemplateColumns: "160px 80px 70px 70px 70px 70px 80px 70px 50px 60px", padding: "8px 14px", borderBottom: "1px solid rgba(0,0,0,.06)", background: "rgba(0,0,0,.02)", minWidth: 780 }}>
              {["Property", "Month", "Electric", "Gas", "Water", "Internet", "Total", "Coverage", "Res.", ""].map(h => <div key={h} style={{ fontSize: 9, fontWeight: 700, color: "#6b5e52", textTransform: "uppercase", letterSpacing: .5 }}>{h}</div>)}
            </div>
            {utilityBills.map(b => (
              <div key={b.id} style={{ display: "grid", gridTemplateColumns: "160px 80px 70px 70px 70px 70px 80px 70px 50px 60px", padding: "8px 14px", borderBottom: "1px solid rgba(0,0,0,.04)", alignItems: "center", minWidth: 780, ...rowHover }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(0,0,0,.02)"}
                onMouseLeave={e => e.currentTarget.style.background = ""}>
                <div style={{ fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{b.propName}</div>
                <div>{b.month}</div>
                <div>{fmtS(b.electric)}</div>
                <div>{fmtS(b.gas)}</div>
                <div>{fmtS(b.water)}</div>
                <div>{fmtS(b.internet)}</div>
                <div style={{ fontWeight: 700 }}>{fmtS(b.total)}</div>
                <div>{fmtS(b.coverage)}</div>
                <div>{b.residentCount || "--"}</div>
                {/* [P0-6] Delete bill */}
                <div><button onClick={() => setConfirmDelete({ id: b.id, type: "bill", label: `${b.propName} ${b.month}` })} style={{ background: "none", border: "none", cursor: "pointer", color: "#c45c4a", fontSize: 9, fontFamily: "inherit", fontWeight: 600 }}>Delete</button></div>
              </div>
            ))}
          </div>}
        </div></div>
      </>)}

      {/* ═══ DOCUMENT REQUESTS ═══ */}
      {portalOpsTab === "doc-requests" && (<>
        <div className="card" style={{ marginBottom: 20, animation: shaking ? "shake .4s ease, redFlash .5s ease" : undefined }}><div className="card-bd" style={{ padding: "20px 24px" }}>
          <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 14 }}>Send Document Request</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 12 }}>
            <div>
              <label style={labelS}>Tenant *</label>
              <select value={docReqForm.tenantId} onChange={e => { setDocReqForm(f => ({ ...f, tenantId: e.target.value })); setErrs(p => ({ ...p, drTenant: null })); }} style={errSelectS("drTenant")}>
                <option value="">Select tenant...</option>
                {allTenants.map(t => <option key={t.id} value={t.id}>{t.tenant?.name || "Unknown"} &mdash; {t.propName}, {t.name}</option>)}
              </select>
              {errs.drTenant && <div className="err-msg">{errs.drTenant}</div>}
            </div>
            <div>
              <label style={labelS}>Document Type *</label>
              <select value={docReqForm.docType} onChange={e => { setDocReqForm(f => ({ ...f, docType: e.target.value })); setErrs(p => ({ ...p, drType: null })); }} style={errSelectS("drType")}>
                <option value="">Select type...</option>
                <option value="proof-of-income">Proof of Income</option>
                <option value="renters-insurance">Renters Insurance</option>
                <option value="photo-id">Photo ID</option>
                <option value="pet-documentation">Pet Documentation</option>
                <option value="vehicle-registration">Vehicle Registration</option>
                <option value="employer-letter">Employer Verification Letter</option>
                <option value="other">Other</option>
              </select>
              {errs.drType && <div className="err-msg">{errs.drType}</div>}
            </div>
            <div><label style={labelS}>Deadline</label><input type="date" value={docReqForm.deadline} onChange={e => setDocReqForm(f => ({ ...f, deadline: e.target.value }))} style={inputS} /></div>
            <div style={{ gridColumn: "1/4" }}><label style={labelS}>Notes (optional)</label><input value={docReqForm.notes} onChange={e => setDocReqForm(f => ({ ...f, notes: e.target.value }))} placeholder="Additional instructions..." style={inputS} /></div>
          </div>
          <button className="btn btn-green btn-sm" onClick={async () => {
            const e = {};
            if (!docReqForm.tenantId) e.drTenant = "Select a tenant";
            if (!docReqForm.docType) e.drType = "Select a document type";
            if (Object.keys(e).length) { setErrs(e); shake(); return; }
            const t = allTenants.find(x => x.id === docReqForm.tenantId);
            const docLabel = docReqForm.docType.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());
            setDocRequests(prev => [{ id: uid(), tenantId: docReqForm.tenantId, tenantName: t?.tenant?.name || "Unknown", tenantEmail: t?.tenant?.email || "", propName: t?.propName || "", roomName: t?.name || "", docType: docReqForm.docType, deadline: docReqForm.deadline, notes: docReqForm.notes, status: "pending", created: todayStr }, ...prev]);
            /* [P0-2] Actually send email */
            if (t?.tenant?.email) {
              await sendEmail(t.tenant.email, `Document Request: ${docLabel}`, `<p>Hi ${t.tenant.name},</p><p>We need you to submit: <strong>${docLabel}</strong></p>${docReqForm.deadline ? `<p>Please submit by: <strong>${docReqForm.deadline}</strong></p>` : ""}${docReqForm.notes ? `<p>Notes: ${docReqForm.notes}</p>` : ""}<p>You can upload this through your tenant portal or reply to this email.</p>`);
            }
            if (setNotifs) setNotifs(prev => [{ id: uid(), type: "document", msg: `Document request sent to ${t?.tenant?.name}: ${docLabel}`, date: todayStr, read: false, urgent: false }, ...(prev || [])]);
            setDocReqForm({ tenantId: "", docType: "", deadline: "", notes: "" });
            clearErrs();
            flash("Document request sent" + (t?.tenant?.email ? " via email" : " (no email on file)"));
          }}>Send Request</button>
        </div></div>

        <div className="card"><div className="card-bd" style={{ padding: 0 }}>
          <div style={{ padding: "14px 20px", borderBottom: "1px solid rgba(0,0,0,.06)", fontSize: 13, fontWeight: 700 }}>Active Requests</div>
          {docRequests.length === 0 && <div style={{ padding: "30px 20px", textAlign: "center", color: "#7a7067", fontSize: 12 }}>No document requests sent yet.</div>}
          {enrichedDocReqs.length > 0 && <div style={{ fontSize: 11 }}>
            {enrichedDocReqs.map(dr => (
              <div key={dr.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 20px", borderBottom: "1px solid rgba(0,0,0,.04)", ...rowHover }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(0,0,0,.02)"}
                onMouseLeave={e => e.currentTarget.style.background = ""}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={dr._displayStatus === "fulfilled" ? _ac : "#6b5e52"} strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6" /></svg>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 12 }}>{dr.tenantName} &mdash; {dr.docType.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase())}</div>
                    <div style={{ fontSize: 10, color: "#6b5e52" }}>{dr.propName}, {dr.roomName} &mdash; Due: {dr.deadline || "No deadline"}</div>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 100, textTransform: "uppercase", letterSpacing: .5, background: dr._displayStatus === "fulfilled" ? `rgba(${_acRgb},.1)` : dr._displayStatus === "overdue" ? "rgba(196,92,74,.1)" : "rgba(212,168,83,.1)", color: dr._displayStatus === "fulfilled" ? _ac : dr._displayStatus === "overdue" ? "#c45c4a" : "#9a7422" }}>{dr._displayStatus}</span>
                  {dr.status === "pending" && <button className="btn btn-out btn-sm" style={{ fontSize: 9 }} onClick={() => { setDocRequests(prev => prev.map(x => x.id === dr.id ? { ...x, status: "fulfilled", fulfilledAt: new Date().toISOString() } : x)); flash("Marked as fulfilled"); }}>Mark Fulfilled</button>}
                </div>
              </div>
            ))}
          </div>}
        </div></div>
      </>)}

      {/* ═══ AMENITIES ═══ */}
      {portalOpsTab === "amenities" && (<>
        <div className="card" style={{ marginBottom: 20, animation: shaking ? "shake .4s ease, redFlash .5s ease" : undefined }}><div className="card-bd" style={{ padding: "20px 24px" }}>
          <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 14 }}>Add Shared Amenity</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
            <div>
              <label style={labelS}>Property *</label>
              <select value={amenityForm.propId} onChange={e => { setAmenityForm(f => ({ ...f, propId: e.target.value })); setErrs(p => ({ ...p, amProp: null })); }} style={errSelectS("amProp")}>
                <option value="">Select property...</option>
                {props.map(p => <option key={p.id} value={p.id}>{p.addr || p.name}</option>)}
              </select>
              {errs.amProp && <div className="err-msg">{errs.amProp}</div>}
            </div>
            <div>
              <label style={labelS}>Amenity Name *</label>
              <input value={amenityForm.name} onChange={e => { setAmenityForm(f => ({ ...f, name: e.target.value })); setErrs(p => ({ ...p, amName: null })); }} placeholder="e.g. Laundry Room, BBQ Grill" style={errInputS("amName")} />
              {errs.amName && <div className="err-msg">{errs.amName}</div>}
            </div>
            <div><label style={labelS}>Time Slots</label><input value={amenityForm.timeSlots} onChange={e => setAmenityForm(f => ({ ...f, timeSlots: e.target.value }))} placeholder="e.g. 8am-10am, 10am-12pm" style={inputS} /></div>
            <div><label style={labelS}>Description</label><input value={amenityForm.description} onChange={e => setAmenityForm(f => ({ ...f, description: e.target.value }))} placeholder="Rules or notes..." style={inputS} /></div>
          </div>
          <button className="btn btn-green btn-sm" onClick={() => {
            const e = {};
            if (!amenityForm.propId) e.amProp = "Select a property";
            if (!amenityForm.name?.trim()) e.amName = "Enter the amenity name";
            if (Object.keys(e).length) { setErrs(e); shake(); return; }
            const p = props.find(x => x.id === amenityForm.propId);
            setAmenities(prev => [...prev, { id: uid(), propId: amenityForm.propId, propName: p?.addr || p?.name || "", name: amenityForm.name, timeSlots: amenityForm.timeSlots.split(",").map(s => s.trim()).filter(Boolean), description: amenityForm.description, active: true, created: todayStr }]);
            setAmenityForm({ propId: "", name: "", timeSlots: "", description: "" });
            clearErrs();
            flash("Amenity added");
          }}>Add Amenity</button>
        </div></div>

        {amenities.length === 0 && <div style={{ textAlign: "center", padding: "40px 20px", color: "#7a7067", fontSize: 12 }}>No amenities configured. Add shared amenities above.</div>}
        {amenities.length > 0 && <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(320px,1fr))", gap: 14 }}>
          {amenities.map(am => {
            const bks = amenityBookings.filter(b => b.amenityId === am.id);
            return (
              <div key={am.id} className="card"><div className="card-bd" style={{ padding: "16px 20px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700 }}>{am.name}</div>
                    <div style={{ fontSize: 10, color: "#6b5e52" }}>{am.propName}{!am.active ? " (Inactive)" : ""}</div>
                  </div>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button className="btn btn-out btn-sm" style={{ fontSize: 9 }} onClick={() => { setAmenities(prev => prev.map(x => x.id === am.id ? { ...x, active: !x.active } : x)); flash(am.active ? "Deactivated" : "Activated"); }}>{am.active ? "Deactivate" : "Activate"}</button>
                    {/* [P1-3] Delete with confirmation */}
                    <button className="btn btn-out btn-sm" style={{ fontSize: 9, color: "#c45c4a" }} onClick={() => setConfirmDelete({ id: am.id, type: "amenity", label: am.name })}>Delete</button>
                  </div>
                </div>
                {am.description && <div style={{ fontSize: 11, color: "#5c4a3a", marginBottom: 8 }}>{am.description}</div>}
                {(am.timeSlots || []).length > 0 && <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 10 }}>
                  {am.timeSlots.map((s, i) => <span key={i} style={{ fontSize: 9, fontWeight: 600, padding: "2px 8px", borderRadius: 100, background: "rgba(0,0,0,.04)", color: "#5c4a3a" }}>{s}</span>)}
                </div>}
                <div style={{ fontSize: 10, fontWeight: 700, color: "#6b5e52", marginBottom: 4 }}>{bks.length} booking{bks.length !== 1 ? "s" : ""}</div>
                {bks.slice(0, 3).map(b => (
                  <div key={b.id} style={{ display: "flex", justifyContent: "space-between", fontSize: 10, padding: "4px 0", borderBottom: "1px solid rgba(0,0,0,.03)" }}>
                    <span>{b.tenantName} &mdash; {b.slot}</span>
                    <span style={{ color: "#6b5e52" }}>{b.date}</span>
                  </div>
                ))}
              </div></div>);
          })}
        </div>}
      </>)}

      {/* ═══ SURVEYS ═══ */}
      {portalOpsTab === "surveys" && (<>
        <div className="card" style={{ marginBottom: 20, animation: shaking ? "shake .4s ease, redFlash .5s ease" : undefined }}><div className="card-bd" style={{ padding: "20px 24px" }}>
          <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 14 }}>Send Survey</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
            <div>
              <label style={labelS}>Tenant *</label>
              <select value={surveyForm.tenantId} onChange={e => { setSurveyForm(f => ({ ...f, tenantId: e.target.value })); setErrs(p => ({ ...p, svTenant: null })); }} style={errSelectS("svTenant")}>
                <option value="">Select tenant...</option>
                {allTenants.map(t => <option key={t.id} value={t.id}>{t.tenant?.name || "Unknown"} &mdash; {t.propName}, {t.name}</option>)}
              </select>
              {errs.svTenant && <div className="err-msg">{errs.svTenant}</div>}
            </div>
            <div><label style={labelS}>Survey Type</label>
              <select value={surveyForm.type} onChange={e => setSurveyForm(f => ({ ...f, type: e.target.value }))} style={selectS}>
                <option value="move-in-30">Move-In 30-Day</option>
                <option value="pre-renewal">Pre-Renewal</option>
                <option value="general">General Satisfaction</option>
                <option value="move-out">Move-Out</option>
              </select>
            </div>
            <div style={{ gridColumn: "1/3" }}><label style={labelS}>Notes (optional)</label><input value={surveyForm.notes} onChange={e => setSurveyForm(f => ({ ...f, notes: e.target.value }))} placeholder="Additional context..." style={inputS} /></div>
          </div>
          <button className="btn btn-green btn-sm" onClick={async () => {
            if (!surveyForm.tenantId) { setErrs({ svTenant: "Select a tenant to send the survey to" }); shake(); return; }
            const t = allTenants.find(x => x.id === surveyForm.tenantId);
            const typeLabel = surveyForm.type.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());
            setSurveys(prev => [{ id: uid(), tenantId: surveyForm.tenantId, tenantName: t?.tenant?.name || "Unknown", tenantEmail: t?.tenant?.email || "", propName: t?.propName || "", type: surveyForm.type, notes: surveyForm.notes, status: "sent", created: todayStr }, ...prev]);
            /* [P0-3] Actually send email */
            if (t?.tenant?.email) {
              await sendEmail(t.tenant.email, `${typeLabel} Survey`, `<p>Hi ${t.tenant.name},</p><p>We would love your feedback. Please take a moment to complete this <strong>${typeLabel}</strong> survey.</p>${surveyForm.notes ? `<p>Note: ${surveyForm.notes}</p>` : ""}<p>You can respond through your tenant portal or reply directly to this email.</p>`);
            }
            setSurveyForm({ tenantId: "", type: "move-in-30", notes: "" });
            clearErrs();
            flash("Survey sent" + (t?.tenant?.email ? " via email" : " (no email on file)"));
          }}>Send Survey</button>
        </div></div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <div className="card"><div className="card-bd" style={{ padding: 0 }}>
            <div style={{ padding: "14px 20px", borderBottom: "1px solid rgba(0,0,0,.06)", fontSize: 13, fontWeight: 700 }}>Sent ({surveys.length})</div>
            {surveys.length === 0 && <div style={{ padding: "30px 20px", textAlign: "center", color: "#7a7067", fontSize: 12 }}>No surveys sent yet.</div>}
            {surveys.map(sv => (
              <div key={sv.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 20px", borderBottom: "1px solid rgba(0,0,0,.04)", ...rowHover }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(0,0,0,.02)"}
                onMouseLeave={e => e.currentTarget.style.background = ""}>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600 }}>{sv.tenantName}</div>
                  <div style={{ fontSize: 10, color: "#6b5e52" }}>{sv.type.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase())} &mdash; {sv.created}</div>
                </div>
                <span style={{ fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 100, textTransform: "uppercase", letterSpacing: .5, background: sv.status === "completed" ? `rgba(${_acRgb},.1)` : "rgba(212,168,83,.1)", color: sv.status === "completed" ? _ac : "#9a7422" }}>{sv.status}</span>
              </div>
            ))}
          </div></div>
          <div className="card"><div className="card-bd" style={{ padding: 0 }}>
            <div style={{ padding: "14px 20px", borderBottom: "1px solid rgba(0,0,0,.06)", fontSize: 13, fontWeight: 700 }}>Results ({surveyResults.length})</div>
            {surveyResults.length === 0 && <div style={{ padding: "30px 20px", textAlign: "center", color: "#7a7067", fontSize: 12 }}>No results yet.</div>}
            {surveyResults.map(sr => (
              <div key={sr.id} style={{ padding: "12px 20px", borderBottom: "1px solid rgba(0,0,0,.04)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <div style={{ fontSize: 12, fontWeight: 600 }}>{sr.tenantName} &mdash; {(sr.type || "").replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase())}</div>
                  <div style={{ fontSize: 10, color: "#6b5e52" }}>{sr.completed || sr.created}</div>
                </div>
                {sr.rating != null && <div style={{ display: "flex", gap: 2, marginBottom: 4 }}>
                  {[1, 2, 3, 4, 5].map(star => (
                    <svg key={star} width="14" height="14" viewBox="0 0 24 24" fill={star <= sr.rating ? _ac : "none"} stroke={_ac} strokeWidth="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
                  ))}
                  <span style={{ fontSize: 11, fontWeight: 700, color: "#5c4a3a", marginLeft: 4 }}>{sr.rating}/5</span>
                </div>}
                {sr.feedback && <div style={{ fontSize: 11, color: "#5c4a3a", fontStyle: "italic" }}>&quot;{sr.feedback}&quot;</div>}
              </div>
            ))}
          </div></div>
        </div>
      </>)}

      {/* ═══ PACKAGES ═══ */}
      {portalOpsTab === "packages" && (<>
        <div className="card" style={{ marginBottom: 20, animation: shaking ? "shake .4s ease, redFlash .5s ease" : undefined }}><div className="card-bd" style={{ padding: "20px 24px" }}>
          <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 14 }}>Log Incoming Package</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 12 }}>
            <div>
              <label style={labelS}>Tenant *</label>
              <select value={pkgForm.tenantId} onChange={e => { setPkgForm(f => ({ ...f, tenantId: e.target.value })); setErrs(p => ({ ...p, pkTenant: null })); }} style={errSelectS("pkTenant")}>
                <option value="">Select tenant...</option>
                {allTenants.map(t => <option key={t.id} value={t.id}>{t.tenant?.name || "Unknown"} &mdash; {t.propName}, {t.name}</option>)}
              </select>
              {errs.pkTenant && <div className="err-msg">{errs.pkTenant}</div>}
            </div>
            <div>
              <label style={labelS}>Carrier *</label>
              <select value={pkgForm.carrier} onChange={e => { setPkgForm(f => ({ ...f, carrier: e.target.value })); setErrs(p => ({ ...p, pkCarrier: null })); }} style={errSelectS("pkCarrier")}>
                <option value="">Select carrier...</option>
                {["USPS", "UPS", "FedEx", "Amazon", "DHL", "Other"].map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              {errs.pkCarrier && <div className="err-msg">{errs.pkCarrier}</div>}
            </div>
            <div><label style={labelS}>Tracking</label><input value={pkgForm.tracking} onChange={e => setPkgForm(f => ({ ...f, tracking: e.target.value }))} placeholder="Optional" style={inputS} /></div>
            <div><label style={labelS}>Description</label><input value={pkgForm.description} onChange={e => setPkgForm(f => ({ ...f, description: e.target.value }))} placeholder="e.g. Small box" style={inputS} /></div>
            <div><label style={labelS}>Location</label><input value={pkgForm.locker} onChange={e => setPkgForm(f => ({ ...f, locker: e.target.value }))} placeholder="e.g. Locker 5" style={inputS} /></div>
          </div>
          <button className="btn btn-green btn-sm" onClick={async () => {
            const e = {};
            if (!pkgForm.tenantId) e.pkTenant = "Select a tenant";
            if (!pkgForm.carrier) e.pkCarrier = "Select a carrier";
            if (Object.keys(e).length) { setErrs(e); shake(); return; }
            const t = allTenants.find(x => x.id === pkgForm.tenantId);
            setPackages(prev => [{ id: uid(), tenantId: pkgForm.tenantId, tenantName: t?.tenant?.name || "Unknown", tenantEmail: t?.tenant?.email || "", propName: t?.propName || "", roomName: t?.name || "", carrier: pkgForm.carrier, tracking: pkgForm.tracking, description: pkgForm.description, locker: pkgForm.locker, status: "waiting", loggedAt: new Date().toISOString(), pickedUpAt: null }, ...prev]);
            /* [P0-4] Notify tenant */
            if (t?.tenant?.email) {
              await sendEmail(t.tenant.email, "Package Arrived", `<p>Hi ${t.tenant.name},</p><p>You have a package waiting for pickup.</p><p><strong>Carrier:</strong> ${pkgForm.carrier}</p>${pkgForm.tracking ? `<p><strong>Tracking:</strong> ${pkgForm.tracking}</p>` : ""}${pkgForm.locker ? `<p><strong>Location:</strong> ${pkgForm.locker}</p>` : ""}<p>Please pick up at your earliest convenience.</p>`);
            }
            if (setNotifs) setNotifs(prev => [{ id: uid(), type: "package", msg: `Package logged for ${t?.tenant?.name}: ${pkgForm.carrier}`, date: todayStr, read: false, urgent: false }, ...(prev || [])]);
            setPkgForm({ tenantId: "", carrier: "", tracking: "", description: "", locker: "" });
            clearErrs();
            flash("Package logged" + (t?.tenant?.email ? " and tenant notified" : ""));
          }}>Log Package</button>
        </div></div>

        <div className="card"><div className="card-bd" style={{ padding: 0 }}>
          <div style={{ padding: "14px 20px", borderBottom: "1px solid rgba(0,0,0,.06)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontSize: 13, fontWeight: 700 }}>Package Log ({packages.length})</div>
            <div style={{ fontSize: 10, color: "#6b5e52" }}>{packages.filter(p => p.status === "waiting").length} awaiting pickup</div>
          </div>
          {packages.length === 0 && <div style={{ padding: "30px 20px", textAlign: "center", color: "#7a7067", fontSize: 12 }}>No packages logged yet.</div>}
          {packages.length > 0 && <div style={{ fontSize: 11, overflowX: "auto" }}>
            <div style={{ display: "grid", gridTemplateColumns: "140px 70px 110px 120px 80px 90px 90px", padding: "8px 14px", borderBottom: "1px solid rgba(0,0,0,.06)", background: "rgba(0,0,0,.02)", minWidth: 700 }}>
              {["Tenant", "Carrier", "Tracking", "Description", "Location", "Logged", "Status"].map(h => <div key={h} style={{ fontSize: 9, fontWeight: 700, color: "#6b5e52", textTransform: "uppercase", letterSpacing: .5 }}>{h}</div>)}
            </div>
            {packages.map(pk => (
              <div key={pk.id} style={{ display: "grid", gridTemplateColumns: "140px 70px 110px 120px 80px 90px 90px", padding: "8px 14px", borderBottom: "1px solid rgba(0,0,0,.04)", alignItems: "center", minWidth: 700, ...rowHover }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(0,0,0,.02)"}
                onMouseLeave={e => e.currentTarget.style.background = ""}>
                <div style={{ fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{pk.tenantName}</div>
                <div>{pk.carrier}</div>
                <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontSize: 10 }}>{pk.tracking || "--"}</div>
                <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{pk.description || "--"}</div>
                <div>{pk.locker || "--"}</div>
                <div style={{ fontSize: 10 }}>{pk.loggedAt ? new Date(pk.loggedAt).toLocaleDateString() : ""}</div>
                {/* [P2-4] Show pickup timestamp */}
                <div>{pk.status === "waiting"
                  ? <button className="btn btn-out btn-sm" style={{ fontSize: 9, padding: "2px 8px" }} onClick={() => { setPackages(prev => prev.map(x => x.id === pk.id ? { ...x, status: "picked-up", pickedUpAt: new Date().toISOString() } : x)); flash("Marked as picked up"); }}>Pick Up</button>
                  : <div><span style={{ fontSize: 10, fontWeight: 600, color: _ac }}>Picked up</span>{pk.pickedUpAt && <div style={{ fontSize: 8, color: "#9ca3af" }}>{new Date(pk.pickedUpAt).toLocaleDateString()}</div>}</div>}
                </div>
              </div>
            ))}
          </div>}
        </div></div>
      </>)}

      {/* ═══ CONFIRM DELETE MODAL ═══ */}
      {confirmDelete && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.4)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center" }} onClick={() => setConfirmDelete(null)}>
          <div onClick={e => e.stopPropagation()} style={{ background: "#fff", borderRadius: 10, padding: 24, maxWidth: 380, width: "100%", boxShadow: "0 16px 48px rgba(0,0,0,.2)" }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#c45c4a", marginBottom: 8 }}>Delete {confirmDelete.type === "bill" ? "Utility Bill" : "Amenity"}?</div>
            <div style={{ fontSize: 12, color: "#5c4a3a", marginBottom: 16 }}>Are you sure you want to delete <strong>{confirmDelete.label}</strong>? This cannot be undone.</div>
            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
              <button className="btn btn-out btn-sm" onClick={() => setConfirmDelete(null)}>Cancel</button>
              <button className="btn btn-red btn-sm" onClick={() => {
                if (confirmDelete.type === "bill") setUtilityBills(prev => prev.filter(x => x.id !== confirmDelete.id));
                if (confirmDelete.type === "amenity") setAmenities(prev => prev.filter(x => x.id !== confirmDelete.id));
                setConfirmDelete(null);
                flash("Deleted");
              }}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
