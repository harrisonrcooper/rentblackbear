"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { supa } from "@/lib/supabase-client";

/* ── tiny ID ── */
const uid = () => Math.random().toString(36).slice(2, 11);

/* ── Supabase helpers ── */
async function supaInsert(table, row) {
  const r = await supa(table, { method: "POST", body: JSON.stringify(row) });
  const d = await r.json();
  return Array.isArray(d) ? d[0] : d;
}
async function supaUpdate(table, id, patch) {
  await supa(`${table}?id=eq.${id}`, { method: "PATCH", body: JSON.stringify(patch) });
}
async function supaDelete(table, id) {
  await supa(`${table}?id=eq.${id}`, { method: "DELETE" });
}
async function supaSelect(table, query = "") {
  const r = await supa(`${table}?${query}`);
  const d = await r.json();
  return Array.isArray(d) ? d : [];
}

/* ── PM ID cache ── */
let _pmId = null;
async function getPmId() {
  if (_pmId) return _pmId;
  try {
    const d = await supaSelect("pm_accounts", "select=id&limit=1");
    _pmId = d?.[0]?.id || null;
  } catch { _pmId = null; }
  return _pmId;
}

export default function PortalOpsTab({ settings, properties, allTenants, onDirtyChange }) {
  const props = properties || [];
  const _ac = settings?.adminAccent || "#4a7c59";
  const _red = "#c45c4a";
  const _gold = "#d4a853";
  const _muted = "#6b5e52";
  const _text = "#3d3529";
  const _bg = "#f5f0e8";

  /* ── Sub-tab state ── */
  const [portalOpsTab, setPortalOpsTab] = useState("utilities");

  /* ── Data from Supabase tables ── */
  const [utilityBills, setUtilityBills] = useState([]);
  const [docRequests, setDocRequests] = useState([]);
  const [amenities, setAmenities] = useState([]);
  const [amenityBookings, setAmenityBookings] = useState([]);
  const [surveys, setSurveys] = useState([]);
  const [surveyResults, setSurveyResults] = useState([]);
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ── Form states ── */
  const [utilBillForm, setUtilBillForm] = useState({ propId: "", month: "", electric: "", gas: "", water: "", internet: "", coverage: "", residentCount: "" });
  const [docReqForm, setDocReqForm] = useState({ tenantId: "", docType: "", deadline: "", notes: "" });
  const [amenityForm, setAmenityForm] = useState({ propId: "", name: "", timeSlots: "", description: "" });
  const [surveyForm, setSurveyForm] = useState({ tenantId: "", type: "move-in-30", notes: "" });
  const [pkgForm, setPkgForm] = useState({ tenantId: "", carrier: "", tracking: "", description: "", locker: "" });

  /* ── Validation errors ── */
  const [errors, setErrors] = useState({});
  const [shakeField, setShakeField] = useState(null);

  /* ── Success toast ── */
  const [toast, setToast] = useState(null);
  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  /* ── Delete confirmation modal ── */
  const [deleteModal, setDeleteModal] = useState(null); // { type, id, label }

  /* ── Dirty tracking ── */
  const isDirty = useRef(false);
  const markDirty = () => {
    if (!isDirty.current) { isDirty.current = true; onDirtyChange?.(true); }
  };
  const clearDirty = () => {
    if (isDirty.current) { isDirty.current = false; onDirtyChange?.(false); }
  };

  /* ── Wiggle helper ── */
  const wiggle = (field) => {
    setShakeField(field);
    setTimeout(() => setShakeField(null), 600);
  };

  /* ── Load all data from Supabase tables on mount ── */
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const pmId = await getPmId();
        const pmFilter = pmId ? `pm_id=eq.${pmId}&` : "";
        const [ub, dr, am, ab, sv, sr, pk] = await Promise.all([
          supaSelect("utility_bills", `${pmFilter}order=billing_month.desc`),
          supaSelect("document_requests", `${pmFilter}order=created_at.desc`),
          supaSelect("amenities", `${pmFilter}order=created_at.desc`),
          supaSelect("amenity_bookings", `${pmFilter}order=date.desc&limit=50`),
          supaSelect("tenant_surveys", `${pmFilter}order=created_at.desc`),
          supaSelect("tenant_surveys", `${pmFilter}status=eq.completed&order=completed_at.desc`),
          supaSelect("packages", `${pmFilter}order=received_at.desc`),
        ]);
        setUtilityBills(ub); setDocRequests(dr); setAmenities(am);
        setAmenityBookings(ab); setSurveys(sv); setSurveyResults(sr); setPackages(pk);
      } catch (e) { console.error("Portal ops load error:", e); }
      setLoading(false);
    })();
  }, []);

  /* ── Format helpers ── */
  const fmtS = n => "$" + Number(n || 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  /* ── Shared styles ── */
  const sInput = { width: "100%", padding: "8px 10px", borderRadius: 6, border: "1px solid rgba(0,0,0,.1)", fontSize: 16, fontFamily: "inherit", minHeight: 44 };
  const sLabel2 = { fontSize: 10, fontWeight: 600, color: _muted, display: "block", marginBottom: 4 };
  const sErr = { fontSize: 10, color: _red, fontWeight: 600, marginTop: 2 };
  const sBadge = (color) => ({ fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 100, textTransform: "uppercase", letterSpacing: .5, background: color + "18", color });
  const sHover = { transition: "all .15s", cursor: "pointer" };

  /* ══════════════════════════════════════════════════════════════════
     SAVE HANDLERS — write to proper Supabase tables
  ══════════════════════════════════════════════════════════════════ */

  const saveUtilityBill = async () => {
    const errs = {};
    if (!utilBillForm.propId) errs.ub_prop = "Select a property";
    if (!utilBillForm.month) errs.ub_month = "Select the billing month";
    if (Object.keys(errs).length) { setErrors(errs); wiggle(Object.keys(errs)[0]); return; }
    setErrors({});
    const p = props.find(x => x.id === utilBillForm.propId);
    const pmId = await getPmId();
    const total = parseFloat(utilBillForm.electric || 0) + parseFloat(utilBillForm.gas || 0) + parseFloat(utilBillForm.water || 0) + parseFloat(utilBillForm.internet || 0);
    const row = {
      pm_id: pmId,
      property_id: utilBillForm.propId,
      property_name: p?.addr || p?.name || "",
      billing_month: utilBillForm.month,
      electric: parseFloat(utilBillForm.electric || 0),
      gas: parseFloat(utilBillForm.gas || 0),
      water: parseFloat(utilBillForm.water || 0),
      internet: parseFloat(utilBillForm.internet || 0),
      total,
      breakdown: { electric: parseFloat(utilBillForm.electric || 0), gas: parseFloat(utilBillForm.gas || 0), water: parseFloat(utilBillForm.water || 0), internet: parseFloat(utilBillForm.internet || 0) },
      coverage_amount: parseFloat(utilBillForm.coverage || 0),
      resident_count: parseInt(utilBillForm.residentCount || 0),
    };
    try {
      const inserted = await supaInsert("utility_bills", row);
      setUtilityBills(prev => [inserted || { ...row, id: uid() }, ...prev]);
      setUtilBillForm({ propId: "", month: "", electric: "", gas: "", water: "", internet: "", coverage: "", residentCount: "" });
      showToast("Utility bill saved");
    } catch (e) { setErrors({ ub_save: "Failed to save. Check your connection." }); }
  };

  const saveDocRequest = async () => {
    const errs = {};
    if (!docReqForm.tenantId) errs.dr_tenant = "Select a tenant";
    if (!docReqForm.docType) errs.dr_type = "Select a document type";
    if (Object.keys(errs).length) { setErrors(errs); wiggle(Object.keys(errs)[0]); return; }
    setErrors({});
    const t = allTenants.find(x => x.id === docReqForm.tenantId);
    const pmId = await getPmId();
    const row = {
      pm_id: pmId,
      tenant_id: t?.tenant?.supaId || null,
      tenant_name: t?.tenant?.name || "Unknown",
      tenant_email: t?.tenant?.email || "",
      property_name: t?.propName || "",
      room_name: t?.name || "",
      type: docReqForm.docType,
      title: docReqForm.docType.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase()),
      deadline: docReqForm.deadline || null,
      notes: docReqForm.notes || null,
      status: "pending",
    };
    try {
      const inserted = await supaInsert("document_requests", row);
      setDocRequests(prev => [inserted || { ...row, id: uid() }, ...prev]);
      setDocReqForm({ tenantId: "", docType: "", deadline: "", notes: "" });
      showToast("Document request sent");
      // Send email notification to tenant
      if (t?.tenant?.email) {
        try { await fetch("/api/send-email", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ to: t.tenant.email, subject: `Document Requested: ${row.title}`, html: `<p>Your property manager has requested: <strong>${row.title}</strong></p>${row.deadline ? `<p>Please submit by <strong>${row.deadline}</strong>.</p>` : ""}${row.notes ? `<p>Note: ${row.notes}</p>` : ""}<p>Log in to your tenant portal to upload the document.</p>` }) }); } catch (e) {}
      }
    } catch (e) { setErrors({ dr_save: "Failed to save. Check your connection." }); }
  };

  const saveAmenity = async () => {
    const errs = {};
    if (!amenityForm.propId) errs.am_prop = "Select a property";
    if (!amenityForm.name.trim()) errs.am_name = "Enter an amenity name";
    if (Object.keys(errs).length) { setErrors(errs); wiggle(Object.keys(errs)[0]); return; }
    setErrors({});
    const p = props.find(x => x.id === amenityForm.propId);
    const pmId = await getPmId();
    const row = {
      pm_id: pmId,
      property_id: amenityForm.propId,
      property_name: p?.addr || p?.name || "",
      name: amenityForm.name.trim(),
      slots: amenityForm.timeSlots.split(",").map(s => s.trim()).filter(Boolean),
      description: amenityForm.description || null,
      active: true,
    };
    try {
      const inserted = await supaInsert("amenities", row);
      setAmenities(prev => [...prev, inserted || { ...row, id: uid() }]);
      setAmenityForm({ propId: "", name: "", timeSlots: "", description: "" });
      showToast("Amenity added");
    } catch (e) { setErrors({ am_save: "Failed to save. Check your connection." }); }
  };

  const saveSurvey = async () => {
    const errs = {};
    if (!surveyForm.tenantId) errs.sv_tenant = "Select a tenant";
    if (Object.keys(errs).length) { setErrors(errs); wiggle(Object.keys(errs)[0]); return; }
    setErrors({});
    const t = allTenants.find(x => x.id === surveyForm.tenantId);
    const pmId = await getPmId();
    const row = {
      pm_id: pmId,
      tenant_id: t?.tenant?.supaId || null,
      tenant_name: t?.tenant?.name || "Unknown",
      tenant_email: t?.tenant?.email || "",
      property_name: t?.propName || "",
      type: surveyForm.type,
      title: surveyForm.type.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase()),
      notes: surveyForm.notes || null,
      status: "pending",
    };
    try {
      const inserted = await supaInsert("tenant_surveys", row);
      setSurveys(prev => [inserted || { ...row, id: uid() }, ...prev]);
      setSurveyForm({ tenantId: "", type: "move-in-30", notes: "" });
      showToast("Survey sent to tenant");
      // Email notification
      if (t?.tenant?.email) {
        try { await fetch("/api/send-email", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ to: t.tenant.email, subject: "We'd love your feedback", html: `<p>Hi ${(t?.tenant?.name || "").split(" ")[0]},</p><p>Your property manager has sent you a quick survey. Log in to your tenant portal to complete it.</p>` }) }); } catch (e) {}
      }
    } catch (e) { setErrors({ sv_save: "Failed to save. Check your connection." }); }
  };

  const savePackage = async () => {
    const errs = {};
    if (!pkgForm.tenantId) errs.pk_tenant = "Select a tenant";
    if (!pkgForm.carrier) errs.pk_carrier = "Select a carrier";
    if (Object.keys(errs).length) { setErrors(errs); wiggle(Object.keys(errs)[0]); return; }
    setErrors({});
    const t = allTenants.find(x => x.id === pkgForm.tenantId);
    const pmId = await getPmId();
    const row = {
      pm_id: pmId,
      tenant_id: t?.tenant?.supaId || null,
      tenant_name: t?.tenant?.name || "Unknown",
      tenant_email: t?.tenant?.email || "",
      property_name: t?.propName || "",
      room_name: t?.name || "",
      carrier: pkgForm.carrier,
      tracking: pkgForm.tracking || null,
      description: pkgForm.description || null,
      locker: pkgForm.locker || null,
      status: "pending",
      received_at: new Date().toISOString(),
    };
    try {
      const inserted = await supaInsert("packages", row);
      setPackages(prev => [inserted || { ...row, id: uid() }, ...prev]);
      setPkgForm({ tenantId: "", carrier: "", tracking: "", description: "", locker: "" });
      showToast("Package logged");
      // Email notification
      if (t?.tenant?.email) {
        try { await fetch("/api/send-email", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ to: t.tenant.email, subject: `Package received for you (${pkgForm.carrier})`, html: `<p>A package from <strong>${pkgForm.carrier}</strong> has arrived for you.</p>${pkgForm.locker ? `<p>Location: <strong>${pkgForm.locker}</strong></p>` : "<p>Check with your property manager for pickup.</p>"}${pkgForm.description ? `<p>Description: ${pkgForm.description}</p>` : ""}` }) }); } catch (e) {}
      }
    } catch (e) { setErrors({ pk_save: "Failed to save. Check your connection." }); }
  };

  /* ── Delete handler ── */
  const confirmDelete = async () => {
    if (!deleteModal) return;
    const { type, id } = deleteModal;
    try {
      await supaDelete(type, id);
      if (type === "amenities") setAmenities(prev => prev.filter(x => x.id !== id));
      if (type === "utility_bills") setUtilityBills(prev => prev.filter(x => x.id !== id));
      showToast("Deleted");
    } catch (e) { console.error(e); }
    setDeleteModal(null);
  };

  /* ── Fulfill doc request ── */
  const fulfillDocRequest = async (id) => {
    await supaUpdate("document_requests", id, { status: "fulfilled", fulfilled_at: new Date().toISOString() });
    setDocRequests(prev => prev.map(x => x.id === id ? { ...x, status: "fulfilled", fulfilled_at: new Date().toISOString() } : x));
    showToast("Marked as fulfilled");
  };

  /* ── Mark package picked up ── */
  const markPickedUp = async (id) => {
    await supaUpdate("packages", id, { status: "picked_up", picked_up_at: new Date().toISOString() });
    setPackages(prev => prev.map(x => x.id === id ? { ...x, status: "picked_up", picked_up_at: new Date().toISOString() } : x));
    showToast("Marked as picked up");
  };

  /* ── Toggle amenity active ── */
  const toggleAmenity = async (id, active) => {
    await supaUpdate("amenities", id, { active: !active });
    setAmenities(prev => prev.map(x => x.id === id ? { ...x, active: !active } : x));
    showToast(active ? "Deactivated" : "Activated");
  };

  /* ══════════════════════════════════════════════════════════════════
     SUB-TABS CONFIG
  ══════════════════════════════════════════════════════════════════ */
  const subTabs = [
    { id: "utilities", label: "Utility Bills", icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg> },
    { id: "doc-requests", label: "Document Requests", icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6" /><path d="M12 18v-6" /><path d="M9 15h6" /></svg> },
    { id: "amenities", label: "Amenities", icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></svg> },
    { id: "surveys", label: "Surveys", icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" /><rect x="8" y="2" width="8" height="4" rx="1" /><path d="M9 14l2 2 4-4" /></svg> },
    { id: "packages", label: "Packages", icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /><path d="M3.27 6.96L12 12.01l8.73-5.05" /><path d="M12 22.08V12" /></svg> },
  ];

  /* ══════════════════════════════════════════════════════════════════
     RENDER
  ══════════════════════════════════════════════════════════════════ */

  if (loading) return (
    <div style={{ padding: "60px 0", textAlign: "center" }}>
      <div style={{ width: 32, height: 32, border: `3px solid ${_ac}22`, borderTopColor: _ac, borderRadius: "50%", animation: "spin 1s linear infinite", margin: "0 auto 12px" }} />
      <div style={{ fontSize: 12, color: _muted }}>Loading portal operations...</div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  return (
    <div style={{ padding: "0 0 40px" }}>
      <style>{`@keyframes shake{0%,100%{transform:translateX(0)}10%,30%,50%,70%,90%{transform:translateX(-4px)}20%,40%,60%,80%{transform:translateX(4px)}}`}</style>

      {/* Toast */}
      {toast && (
        <div style={{ position: "fixed", top: 20, right: 20, zIndex: 9999, background: _ac, color: "#fff", padding: "10px 20px", borderRadius: 8, fontSize: 12, fontWeight: 700, boxShadow: "0 4px 16px rgba(0,0,0,.2)", animation: "fadeIn .2s", maxWidth: "calc(100vw - 40px)" }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" style={{ marginRight: 6, verticalAlign: "middle" }}><polyline points="20 6 9 17 4 12" /></svg>
          {toast}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModal && (
        <div className="mbg" style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.5)", zIndex: 9998, display: "flex", alignItems: "center", justifyContent: "center" }} onClick={() => setDeleteModal(null)}>
          <div className="mbox" onClick={e => e.stopPropagation()} style={{ background: "#fff", borderRadius: 12, padding: 24, maxWidth: 400, width: "90%", boxShadow: "0 12px 40px rgba(0,0,0,.2)" }}>
            <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 8, color: _text }}>Delete {deleteModal.label}?</div>
            <div style={{ fontSize: 12, color: _muted, lineHeight: 1.6, marginBottom: 16 }}>This will permanently remove this item. This action cannot be undone.</div>
            <div style={{ display: "flex", gap: 8 }}>
              <button className="btn btn-out" style={{ flex: 1 }} onClick={() => setDeleteModal(null)}>Cancel</button>
              <button className="btn" style={{ flex: 1, background: _red, color: "#fff", border: "none" }} onClick={confirmDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>Portal Operations</h2>
          <div style={{ fontSize: 11, color: _muted, marginTop: 2 }}>Manage utilities, documents, amenities, surveys, and packages for tenant portal</div>
        </div>
      </div>

      {/* Sub-tab bar */}
      <div style={{ display: "flex", gap: 0, marginBottom: 20, borderBottom: "1px solid rgba(0,0,0,.08)", overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
        {subTabs.map(st => {
          const active = portalOpsTab === st.id;
          return (
            <button key={st.id} onClick={() => setPortalOpsTab(st.id)}
              style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 18px", border: "none", borderBottom: active ? `2px solid ${_ac}` : "2px solid transparent", background: "transparent", color: active ? _text : _muted, fontWeight: active ? 700 : 400, fontSize: 12, cursor: "pointer", fontFamily: "inherit", transition: "all .15s", whiteSpace: "nowrap", minWidth: 44, minHeight: 44 }}>
              {st.icon}{st.label}
            </button>
          );
        })}
      </div>

      {/* ═══ UTILITY BILLS ═══ */}
      {portalOpsTab === "utilities" && (<>
        <div className="card" style={{ marginBottom: 20 }}><div className="card-bd" style={{ padding: "20px 24px" }}>
          <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 14 }}>Enter Monthly Utility Bill</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))", gap: 10, marginBottom: 12 }}>
            <div style={{ gridColumn: "1/3" }}>
              <label style={sLabel2}>Property</label>
              <select value={utilBillForm.propId} onChange={e => setUtilBillForm(f => ({ ...f, propId: e.target.value }))} style={{ ...sInput, animation: shakeField === "ub_prop" ? "shake .5s" : "none" }}>
                <option value="">Select property...</option>
                {props.filter(p => !(p.units || []).some(u => u.ownerOccupied && (u.rooms || []).length <= 1)).map(p => <option key={p.id} value={p.id}>{p.addr || p.name}</option>)}
              </select>
              {errors.ub_prop && <div style={sErr}>{errors.ub_prop}</div>}
            </div>
            <div>
              <label style={sLabel2}>Month</label>
              <input type="month" value={utilBillForm.month} onChange={e => setUtilBillForm(f => ({ ...f, month: e.target.value }))} style={{ ...sInput, animation: shakeField === "ub_month" ? "shake .5s" : "none" }} />
              {errors.ub_month && <div style={sErr}>{errors.ub_month}</div>}
            </div>
            <div>
              <label style={sLabel2}>Electric ($)</label>
              <input type="number" value={utilBillForm.electric} onChange={e => setUtilBillForm(f => ({ ...f, electric: e.target.value }))} placeholder="0.00" style={sInput} />
            </div>
            <div>
              <label style={sLabel2}>Gas ($)</label>
              <input type="number" value={utilBillForm.gas} onChange={e => setUtilBillForm(f => ({ ...f, gas: e.target.value }))} placeholder="0.00" style={sInput} />
            </div>
            <div>
              <label style={sLabel2}>Water ($)</label>
              <input type="number" value={utilBillForm.water} onChange={e => setUtilBillForm(f => ({ ...f, water: e.target.value }))} placeholder="0.00" style={sInput} />
            </div>
            <div>
              <label style={sLabel2}>Internet ($)</label>
              <input type="number" value={utilBillForm.internet} onChange={e => setUtilBillForm(f => ({ ...f, internet: e.target.value }))} placeholder="0.00" style={sInput} />
            </div>
            <div>
              <label style={sLabel2}>Coverage Amount ($)</label>
              <input type="number" value={utilBillForm.coverage} onChange={e => setUtilBillForm(f => ({ ...f, coverage: e.target.value }))} placeholder="100" style={sInput} />
            </div>
            <div>
              <label style={sLabel2}>Resident Count</label>
              <input type="number" value={utilBillForm.residentCount} onChange={e => setUtilBillForm(f => ({ ...f, residentCount: e.target.value }))} placeholder="0" style={sInput} />
            </div>
          </div>
          {errors.ub_save && <div style={{ ...sErr, marginBottom: 8 }}>{errors.ub_save}</div>}
          <button className="btn" style={{ background: _ac, color: "#fff", border: "none" }} onClick={saveUtilityBill}>Save Bill</button>
        </div></div>

        {/* History */}
        <div className="card"><div className="card-bd" style={{ padding: 0 }}>
          <div style={{ padding: "14px 20px", borderBottom: "1px solid rgba(0,0,0,.06)", fontSize: 13, fontWeight: 700 }}>Bill History ({utilityBills.length})</div>
          {utilityBills.length === 0 && <div style={{ padding: "30px 20px", textAlign: "center", color: _muted, fontSize: 12 }}>No utility bills recorded yet. Bills you enter will appear on the tenant portal automatically.</div>}
          {utilityBills.length > 0 && <div style={{ fontSize: 11, overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
            <div style={{ display: "grid", gridTemplateColumns: "160px 80px 70px 70px 70px 70px 80px", minWidth: 600, padding: "8px 14px", borderBottom: "1px solid rgba(0,0,0,.06)", background: "rgba(0,0,0,.02)" }}>
              {["Property", "Month", "Electric", "Gas", "Water", "Internet", "Total"].map(h => <div key={h} style={{ fontSize: 9, fontWeight: 700, color: _muted, textTransform: "uppercase", letterSpacing: .5 }}>{h}</div>)}
            </div>
            {utilityBills.map(b => (
              <div key={b.id} style={{ display: "grid", gridTemplateColumns: "160px 80px 70px 70px 70px 70px 80px", minWidth: 600, padding: "8px 14px", borderBottom: "1px solid rgba(0,0,0,.04)", alignItems: "center" }}>
                <div style={{ fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{b.property_name || b.propName || ""}</div>
                <div>{b.billing_month || b.month}</div>
                <div>{fmtS(b.electric || b.breakdown?.electric)}</div>
                <div>{fmtS(b.gas || b.breakdown?.gas)}</div>
                <div>{fmtS(b.water || b.breakdown?.water)}</div>
                <div>{fmtS(b.internet || b.breakdown?.internet)}</div>
                <div style={{ fontWeight: 700 }}>{fmtS(b.total)}</div>
              </div>
            ))}
          </div>}
        </div></div>
      </>)}

      {/* ═══ DOCUMENT REQUESTS ═══ */}
      {portalOpsTab === "doc-requests" && (<>
        <div className="card" style={{ marginBottom: 20 }}><div className="card-bd" style={{ padding: "20px 24px" }}>
          <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 14 }}>Send Document Request</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 10, marginBottom: 12 }}>
            <div>
              <label style={sLabel2}>Tenant</label>
              <select value={docReqForm.tenantId} onChange={e => setDocReqForm(f => ({ ...f, tenantId: e.target.value }))} style={{ ...sInput, animation: shakeField === "dr_tenant" ? "shake .5s" : "none" }}>
                <option value="">Select tenant...</option>
                {allTenants.map(t => <option key={t.id} value={t.id}>{t.tenant?.name || "Unknown"} &mdash; {t.propName}, {t.name}</option>)}
              </select>
              {errors.dr_tenant && <div style={sErr}>{errors.dr_tenant}</div>}
            </div>
            <div>
              <label style={sLabel2}>Document Type</label>
              <select value={docReqForm.docType} onChange={e => setDocReqForm(f => ({ ...f, docType: e.target.value }))} style={{ ...sInput, animation: shakeField === "dr_type" ? "shake .5s" : "none" }}>
                <option value="">Select type...</option>
                <option value="proof-of-income">Proof of Income</option>
                <option value="renters-insurance">Renters Insurance</option>
                <option value="photo-id">Photo ID</option>
                <option value="pet-documentation">Pet Documentation</option>
                <option value="vehicle-registration">Vehicle Registration</option>
                <option value="employer-letter">Employer Verification Letter</option>
                <option value="other">Other</option>
              </select>
              {errors.dr_type && <div style={sErr}>{errors.dr_type}</div>}
            </div>
            <div>
              <label style={sLabel2}>Deadline</label>
              <input type="date" value={docReqForm.deadline} onChange={e => setDocReqForm(f => ({ ...f, deadline: e.target.value }))} style={sInput} />
            </div>
            <div style={{ gridColumn: "1/-1" }}>
              <label style={sLabel2}>Notes (optional)</label>
              <input value={docReqForm.notes} onChange={e => setDocReqForm(f => ({ ...f, notes: e.target.value }))} placeholder="Additional instructions..." style={sInput} />
            </div>
          </div>
          {errors.dr_save && <div style={{ ...sErr, marginBottom: 8 }}>{errors.dr_save}</div>}
          <button className="btn" style={{ background: _ac, color: "#fff", border: "none" }} onClick={saveDocRequest}>Send Request</button>
        </div></div>

        <div className="card"><div className="card-bd" style={{ padding: 0 }}>
          <div style={{ padding: "14px 20px", borderBottom: "1px solid rgba(0,0,0,.06)", fontSize: 13, fontWeight: 700 }}>Active Requests ({docRequests.length})</div>
          {docRequests.length === 0 && <div style={{ padding: "30px 20px", textAlign: "center", color: _muted, fontSize: 12 }}>No document requests sent yet. Requests will appear on the tenant portal.</div>}
          {docRequests.map(dr => (
            <div key={dr.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 20px", borderBottom: "1px solid rgba(0,0,0,.04)", flexWrap: "wrap", gap: 8 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0, flex: 1 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={dr.status === "fulfilled" ? _ac : _muted} strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6" /></svg>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: 12, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{dr.tenant_name || dr.tenantName} &mdash; {(dr.type || dr.docType || "").replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase())}</div>
                  <div style={{ fontSize: 10, color: _muted }}>{dr.property_name || dr.propName}, {dr.room_name || dr.roomName} &mdash; Due: {dr.deadline || "No deadline"}</div>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                <span style={sBadge(dr.status === "fulfilled" ? _ac : dr.status === "overdue" ? _red : _gold)}>{dr.status}</span>
                {dr.status === "pending" && <button className="btn btn-out btn-sm" style={{ fontSize: 9 }} onClick={() => fulfillDocRequest(dr.id)}>Mark Fulfilled</button>}
              </div>
            </div>
          ))}
        </div></div>
      </>)}

      {/* ═══ AMENITIES ═══ */}
      {portalOpsTab === "amenities" && (<>
        <div className="card" style={{ marginBottom: 20 }}><div className="card-bd" style={{ padding: "20px 24px" }}>
          <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 14 }}>Add Shared Amenity</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 10, marginBottom: 12 }}>
            <div>
              <label style={sLabel2}>Property</label>
              <select value={amenityForm.propId} onChange={e => setAmenityForm(f => ({ ...f, propId: e.target.value }))} style={{ ...sInput, animation: shakeField === "am_prop" ? "shake .5s" : "none" }}>
                <option value="">Select property...</option>
                {props.map(p => <option key={p.id} value={p.id}>{p.addr || p.name}</option>)}
              </select>
              {errors.am_prop && <div style={sErr}>{errors.am_prop}</div>}
            </div>
            <div>
              <label style={sLabel2}>Amenity Name</label>
              <input value={amenityForm.name} onChange={e => setAmenityForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Laundry Room, Study Room" style={{ ...sInput, animation: shakeField === "am_name" ? "shake .5s" : "none" }} />
              {errors.am_name && <div style={sErr}>{errors.am_name}</div>}
            </div>
            <div>
              <label style={sLabel2}>Time Slots</label>
              <input value={amenityForm.timeSlots} onChange={e => setAmenityForm(f => ({ ...f, timeSlots: e.target.value }))} placeholder="e.g. 8am-10am, 10am-12pm, 12pm-2pm" style={sInput} />
            </div>
            <div>
              <label style={sLabel2}>Description (optional)</label>
              <input value={amenityForm.description} onChange={e => setAmenityForm(f => ({ ...f, description: e.target.value }))} placeholder="Rules or notes..." style={sInput} />
            </div>
          </div>
          {errors.am_save && <div style={{ ...sErr, marginBottom: 8 }}>{errors.am_save}</div>}
          <button className="btn" style={{ background: _ac, color: "#fff", border: "none" }} onClick={saveAmenity}>Add Amenity</button>
        </div></div>

        {amenities.length === 0 && <div style={{ textAlign: "center", padding: "40px 20px", color: _muted, fontSize: 12 }}>No amenities configured. Add shared amenities for your properties above. They will appear on the tenant portal.</div>}
        {amenities.length > 0 && <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: 14 }}>
          {amenities.map(am => {
            const bks = amenityBookings.filter(b => b.amenity_id === am.id);
            return (
              <div key={am.id} className="card"><div className="card-bd" style={{ padding: "16px 20px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: _text }}>{am.name}</div>
                    <div style={{ fontSize: 10, color: _muted }}>{am.property_name || am.propName}</div>
                  </div>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button className="btn btn-out btn-sm" style={{ fontSize: 9 }} onClick={() => toggleAmenity(am.id, am.active)}>{am.active !== false ? "Deactivate" : "Activate"}</button>
                    <button className="btn btn-out btn-sm" style={{ fontSize: 9, color: _red, borderColor: _red + "33" }} onClick={() => setDeleteModal({ type: "amenities", id: am.id, label: am.name })}>Delete</button>
                  </div>
                </div>
                {am.description && <div style={{ fontSize: 11, color: _muted, marginBottom: 8 }}>{am.description}</div>}
                {(am.slots || am.timeSlots || []).length > 0 && <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 10 }}>
                  {(am.slots || am.timeSlots || []).map((s, i) => <span key={i} style={{ fontSize: 9, fontWeight: 600, padding: "2px 8px", borderRadius: 100, background: "rgba(0,0,0,.04)", color: _muted }}>{s}</span>)}
                </div>}
                <div style={{ fontSize: 10, fontWeight: 700, color: _muted, marginBottom: 4 }}>{bks.length} booking{bks.length !== 1 ? "s" : ""}</div>
                {bks.slice(0, 3).map(b => (
                  <div key={b.id} style={{ display: "flex", justifyContent: "space-between", fontSize: 10, padding: "4px 0", borderBottom: "1px solid rgba(0,0,0,.03)" }}>
                    <span>{b.tenant_name || b.tenantName} &mdash; {b.time_slot || b.slot}</span>
                    <span style={{ color: _muted }}>{b.date}</span>
                  </div>
                ))}
                {bks.length > 3 && <div style={{ fontSize: 9, color: _ac, marginTop: 4 }}>+{bks.length - 3} more</div>}
              </div></div>
            );
          })}
        </div>}
      </>)}

      {/* ═══ SURVEYS ═══ */}
      {portalOpsTab === "surveys" && (<>
        <div className="card" style={{ marginBottom: 20 }}><div className="card-bd" style={{ padding: "20px 24px" }}>
          <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 14 }}>Trigger Survey</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 10, marginBottom: 12 }}>
            <div>
              <label style={sLabel2}>Tenant</label>
              <select value={surveyForm.tenantId} onChange={e => setSurveyForm(f => ({ ...f, tenantId: e.target.value }))} style={{ ...sInput, animation: shakeField === "sv_tenant" ? "shake .5s" : "none" }}>
                <option value="">Select tenant...</option>
                {allTenants.map(t => <option key={t.id} value={t.id}>{t.tenant?.name || "Unknown"} &mdash; {t.propName}, {t.name}</option>)}
              </select>
              {errors.sv_tenant && <div style={sErr}>{errors.sv_tenant}</div>}
            </div>
            <div>
              <label style={sLabel2}>Survey Type</label>
              <select value={surveyForm.type} onChange={e => setSurveyForm(f => ({ ...f, type: e.target.value }))} style={sInput}>
                <option value="move-in-30">Move-In 30-Day</option>
                <option value="pre-renewal">Pre-Renewal</option>
                <option value="general">General Satisfaction</option>
                <option value="move-out">Move-Out</option>
              </select>
            </div>
            <div style={{ gridColumn: "1/3" }}>
              <label style={sLabel2}>Notes (optional)</label>
              <input value={surveyForm.notes} onChange={e => setSurveyForm(f => ({ ...f, notes: e.target.value }))} placeholder="Additional context or custom questions..." style={sInput} />
            </div>
          </div>
          {errors.sv_save && <div style={{ ...sErr, marginBottom: 8 }}>{errors.sv_save}</div>}
          <button className="btn" style={{ background: _ac, color: "#fff", border: "none" }} onClick={saveSurvey}>Send Survey</button>
        </div></div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 14 }}>
          <div className="card"><div className="card-bd" style={{ padding: 0 }}>
            <div style={{ padding: "14px 20px", borderBottom: "1px solid rgba(0,0,0,.06)", fontSize: 13, fontWeight: 700 }}>Sent Surveys ({surveys.filter(s => s.status === "pending").length})</div>
            {surveys.filter(s => s.status === "pending").length === 0 && <div style={{ padding: "30px 20px", textAlign: "center", color: _muted, fontSize: 12 }}>No pending surveys.</div>}
            {surveys.filter(s => s.status === "pending").map(sv => (
              <div key={sv.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 20px", borderBottom: "1px solid rgba(0,0,0,.04)" }}>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600 }}>{sv.tenant_name || sv.tenantName}</div>
                  <div style={{ fontSize: 10, color: _muted }}>{(sv.type || "").replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase())} &mdash; {sv.created_at ? new Date(sv.created_at).toLocaleDateString() : sv.created}</div>
                </div>
                <span style={sBadge(_gold)}>pending</span>
              </div>
            ))}
          </div></div>

          <div className="card"><div className="card-bd" style={{ padding: 0 }}>
            <div style={{ padding: "14px 20px", borderBottom: "1px solid rgba(0,0,0,.06)", fontSize: 13, fontWeight: 700 }}>Completed ({surveyResults.length})</div>
            {surveyResults.length === 0 && <div style={{ padding: "30px 20px", textAlign: "center", color: _muted, fontSize: 12 }}>No results yet. Results appear when tenants complete surveys.</div>}
            {surveyResults.map(sr => (
              <div key={sr.id} style={{ padding: "12px 20px", borderBottom: "1px solid rgba(0,0,0,.04)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <div style={{ fontSize: 12, fontWeight: 600 }}>{sr.tenant_name || sr.tenantName} &mdash; {(sr.type || "").replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase())}</div>
                  <div style={{ fontSize: 10, color: _muted }}>{sr.completed_at ? new Date(sr.completed_at).toLocaleDateString() : ""}</div>
                </div>
                {sr.rating != null && <div style={{ display: "flex", gap: 2, marginBottom: 4 }}>
                  {[1, 2, 3, 4, 5].map(star => (
                    <svg key={star} width="14" height="14" viewBox="0 0 24 24" fill={star <= sr.rating ? _gold : "none"} stroke={_gold} strokeWidth="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
                  ))}
                  <span style={{ fontSize: 11, fontWeight: 700, color: _text, marginLeft: 4 }}>{sr.rating}/5</span>
                </div>}
                {sr.love && <div style={{ fontSize: 11, color: _ac, marginBottom: 2 }}>Loves: {sr.love}</div>}
                {sr.improve && <div style={{ fontSize: 11, color: _muted, fontStyle: "italic" }}>Improve: {sr.improve}</div>}
              </div>
            ))}
          </div></div>
        </div>
      </>)}

      {/* ═══ PACKAGES ═══ */}
      {portalOpsTab === "packages" && (<>
        <div className="card" style={{ marginBottom: 20 }}><div className="card-bd" style={{ padding: "20px 24px" }}>
          <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 14 }}>Log Incoming Package</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 10, marginBottom: 12 }}>
            <div>
              <label style={sLabel2}>Tenant</label>
              <select value={pkgForm.tenantId} onChange={e => setPkgForm(f => ({ ...f, tenantId: e.target.value }))} style={{ ...sInput, animation: shakeField === "pk_tenant" ? "shake .5s" : "none" }}>
                <option value="">Select tenant...</option>
                {allTenants.map(t => <option key={t.id} value={t.id}>{t.tenant?.name || "Unknown"} &mdash; {t.propName}, {t.name}</option>)}
              </select>
              {errors.pk_tenant && <div style={sErr}>{errors.pk_tenant}</div>}
            </div>
            <div>
              <label style={sLabel2}>Carrier</label>
              <select value={pkgForm.carrier} onChange={e => setPkgForm(f => ({ ...f, carrier: e.target.value }))} style={{ ...sInput, animation: shakeField === "pk_carrier" ? "shake .5s" : "none" }}>
                <option value="">Select carrier...</option>
                <option value="USPS">USPS</option>
                <option value="UPS">UPS</option>
                <option value="FedEx">FedEx</option>
                <option value="Amazon">Amazon</option>
                <option value="DHL">DHL</option>
                <option value="Other">Other</option>
              </select>
              {errors.pk_carrier && <div style={sErr}>{errors.pk_carrier}</div>}
            </div>
            <div>
              <label style={sLabel2}>Tracking Number</label>
              <input value={pkgForm.tracking} onChange={e => setPkgForm(f => ({ ...f, tracking: e.target.value }))} placeholder="Optional" style={sInput} />
            </div>
            <div>
              <label style={sLabel2}>Description</label>
              <input value={pkgForm.description} onChange={e => setPkgForm(f => ({ ...f, description: e.target.value }))} placeholder="e.g. Small box, large envelope" style={sInput} />
            </div>
            <div>
              <label style={sLabel2}>Locker / Location</label>
              <input value={pkgForm.locker} onChange={e => setPkgForm(f => ({ ...f, locker: e.target.value }))} placeholder="e.g. Locker 5, Front desk" style={sInput} />
            </div>
          </div>
          {errors.pk_save && <div style={{ ...sErr, marginBottom: 8 }}>{errors.pk_save}</div>}
          <button className="btn" style={{ background: _ac, color: "#fff", border: "none" }} onClick={savePackage}>Log Package</button>
        </div></div>

        <div className="card"><div className="card-bd" style={{ padding: 0 }}>
          <div style={{ padding: "14px 20px", borderBottom: "1px solid rgba(0,0,0,.06)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontSize: 13, fontWeight: 700 }}>Package Log ({packages.length})</div>
            <div style={{ fontSize: 10, color: _muted }}>{packages.filter(p => p.status === "pending").length} awaiting pickup</div>
          </div>
          {packages.length === 0 && <div style={{ padding: "30px 20px", textAlign: "center", color: _muted, fontSize: 12 }}>No packages logged yet. Packages will appear on the tenant portal.</div>}
          {packages.length > 0 && <div style={{ fontSize: 11, overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
            <div style={{ display: "grid", gridTemplateColumns: "140px 70px 100px 140px 90px 90px 80px", minWidth: 710, padding: "8px 14px", borderBottom: "1px solid rgba(0,0,0,.06)", background: "rgba(0,0,0,.02)" }}>
              {["Tenant", "Carrier", "Tracking", "Description", "Location", "Logged", "Status"].map(h => <div key={h} style={{ fontSize: 9, fontWeight: 700, color: _muted, textTransform: "uppercase", letterSpacing: .5 }}>{h}</div>)}
            </div>
            {packages.map(pk => (
              <div key={pk.id} style={{ display: "grid", gridTemplateColumns: "140px 70px 100px 140px 90px 90px 80px", minWidth: 710, padding: "8px 14px", borderBottom: "1px solid rgba(0,0,0,.04)", alignItems: "center" }}>
                <div style={{ fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{pk.tenant_name || pk.tenantName}</div>
                <div>{pk.carrier}</div>
                <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontSize: 10 }}>{pk.tracking || "--"}</div>
                <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{pk.description || "--"}</div>
                <div>{pk.locker || "--"}</div>
                <div style={{ fontSize: 10 }}>{pk.received_at ? new Date(pk.received_at).toLocaleDateString() : pk.loggedAt ? new Date(pk.loggedAt).toLocaleDateString() : ""}</div>
                <div>{pk.status === "pending" || pk.status === "waiting"
                  ? <button className="btn btn-out btn-sm" style={{ fontSize: 9, padding: "2px 8px" }} onClick={() => markPickedUp(pk.id)}>Pick Up</button>
                  : <span style={{ fontSize: 10, fontWeight: 600, color: _ac }}>Picked up</span>}
                </div>
              </div>
            ))}
          </div>}
        </div></div>
      </>)}
    </div>
  );
}
