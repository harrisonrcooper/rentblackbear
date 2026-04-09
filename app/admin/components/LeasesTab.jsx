"use client";
import { supa } from "@/lib/supabase-client";
import LeaseModal from "./LeaseModal";
import TemplateEditor from "./TemplateEditor";
import LeaseTemplateList from "./LeaseTemplateList";

/* ── tiny helpers (mirrored from page.jsx module scope) ── */
const uid = () => Math.random().toString(36).slice(2, 9);
const fmtS = n => "$" + Number(n).toLocaleString();
const fmtD = d => { if (!d) return "—"; const dt = new Date(d + "T00:00:00"); return `${dt.getMonth() + 1}/${dt.getDate()}/${dt.getFullYear()}`; };
const fmtDLong = d => { if (!d) return "—"; const dt = new Date(d + "T00:00:00"); return dt.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }); };
const TODAY = new Date();
const allRooms = (prop) => { if (!prop) return []; if (prop.units && prop.units.length > 0) return prop.units.flatMap(u => u.rooms || []); return prop.rooms || []; };

export default function LeasesTab({
  /* ── state ── */
  leaseTemplate, setLeaseTemplate,
  leaseTemplates, setLeaseTemplates,
  leaseSubTab, setLeaseSubTab,
  templateEditorDirty, setTemplateEditorDirty,
  pendingNavTab, setPendingNavTab,
  leaseForm, setLeaseForm,
  _pendingLeaseAppId, _setPendingLeaseAppId,
  settings, setSettings,
  leases, setLeases,
  props,      // properties array
  setProps,
  apps,
  modal, setModal,
  setCharges, setNotifs,
  /* ── callbacks ── */
  showConfirm, showAlert, goTab,
  deleteLeaseInDB, save,
  /* ── constants ── */
  DEF_LEASE_SECTIONS, DEF_SETTINGS,
}) {
  const _acc = settings.adminAccent || "#4a7c59";

  const template = leaseTemplate || {
    name: (settings.companyName || "") + " Lease Agreement",
    landlordName: settings.pmName || "Property Manager",
    company: settings.companyName || "",
    landlordEmail: settings.pmEmail || settings.email || "",
    sections: DEF_LEASE_SECTIONS,
  };

  const statusColors = {
    draft: { bg: "rgba(0,0,0,.06)", tx: "#666", label: "Draft" },
    pending_landlord: { bg: "rgba(212,168,83,.1)", tx: "#9a7422", label: "Awaiting Your Signature" },
    pending_tenant: { bg: "rgba(59,130,246,.1)", tx: "#1d4ed8", label: "Sent to Tenant" },
    executed: { bg: "rgba(74,124,89,.1)", tx: "#2d6a3f", label: "Executed" },
  };

  // Auto-open lease form if arriving from Approve & Configure Lease
  if (_pendingLeaseAppId && !leaseForm) {
    const pendingApp = apps.find(ap => ap.id === _pendingLeaseAppId);
    _setPendingLeaseAppId(null);
    if (pendingApp) setTimeout(() => openCreateLease(pendingApp), 0);
  }

  const openCreateLease = (app) => {
    // Auto-fill from application if provided
    // Prefer termRoomId (ID-based) over room name match for reliability
    const prop = app ? props.find(p => p.id === app.termPropId || p.name === app.property) : null;
    const room = prop ? (app?.termRoomId ? allRooms(prop).find(r => r.id === app.termRoomId) : allRooms(prop).find(r => r.name === app.room)) : null;
    // Find the unit this room belongs to for utils/clean
    const unit = prop ? (prop.units || []).find(u => (u.rooms || []).some(r => r.id === room?.id)) : null;
    const rent = app?.termRent || room?.rent || 0;
    const mi = app?.termMoveIn || app?.moveIn || "";
    const miD = mi ? new Date(mi + "T00:00:00") : null;
    const day = miD ? miD.getDate() : 1;
    const daysLeft = miD ? new Date(miD.getFullYear(), miD.getMonth() + 1, 0).getDate() - day + 1 : 0;
    const proratedRent = day === 1 ? 0 : Math.ceil((rent / 30) * daysLeft);
    const leaseEndD = mi ? new Date(mi + "T00:00:00") : new Date();
    leaseEndD.setFullYear(leaseEndD.getFullYear() + 1);
    const utilitiesMode = unit?.utils || prop?.utils || "allIncluded";
    const utilTmpl = (settings.utilTemplates || DEF_SETTINGS.utilTemplates).find(t => t.key === utilitiesMode);
    const utilitiesClause = utilTmpl?.clause || "See lease for utility terms.";
    const isTbd = app?.moveOutTbd === true;
    const tbdSentence = mi
      ? `<p><strong>Note:</strong> The lease end date is to be determined and will be confirmed in writing no later than the move-in date of ${fmtDLong(mi)}.</p>`
      : `<p><strong>Note:</strong> The lease end date is to be determined and will be confirmed in writing prior to move-in.</p>`;
    const sections = (template.sections || DEF_LEASE_SECTIONS).map(sec =>
      sec.id === "s1" && isTbd
        ? { ...sec, content: (sec.content || "") + tbdSentence }
        : sec
    );
    setLeaseForm({
      id: null,
      applicationId: app?.id || null,
      status: "draft",
      tenantName: app?.name || "", tenantEmail: app?.email || "", tenantPhone: app?.phone || "",
      property: app?.property || "", room: app?.room || "",
      propertyId: prop?.id || "",
      roomId: room?.id || app?.termRoomId || "",
      unitId: unit?.id || app?.termUnitId || "",
      unitName: unit?.name || app?.termUnitName || "",
      propertyAddress: prop?.addr || "",
      rent, sd: app?.termSD || rent, proratedRent,
      prorationMethod: "std",
      requireLastMonth: false,
      lastMonthInstallments: 3,
      lastMonthFrequency: "monthly",
      _lockedFromApp: !!app,
      parkingChoice: room?.parking ? (room.parking === "none" ? "no" : "yes") : null,
      parking: room?.parking && room.parking !== "none" ? room.parking : "",
      moveIn: mi, leaseStart: mi,
      leaseEnd: isTbd ? "" : leaseEndD.toISOString().split("T")[0],
      leaseEndTbd: isTbd,
      leaseType: "fixed",
      utilitiesMode: "",
      utilitiesClause: "",
      doorCode: app?.applicationData?.doorCode || app?.passcode || "",
      landlordName: template.landlordName || "Carolina Cooper",
      company: template.company || "Black Bear Properties",
      landlordEmail: template.landlordEmail || "info@rentblackbear.com",
      agreementDate: TODAY.toISOString().split("T")[0],
      sections,
      addenda: [],
      notes: isTbd ? "Lease end date TBD — to be confirmed before move-in" : "",
    });
  };

  const deleteLease = id => { setLeases(p => { const updated = p.filter(l => l.id !== id); deleteLeaseInDB(id); return updated; }); };

  return (<>
    <div className="sec-hd" style={{ marginBottom: 16 }}>
      <div>
        <h2>Templates</h2>
        <p>Reusable lease agreements, checklists, notices, and house rules</p>
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <button className="btn btn-gold" onClick={() => openCreateLease(null)}>+ New Lease</button>
      </div>
    </div>

    {/* Sub-tabs */}
    <div style={{ display: "flex", gap: 0, marginBottom: 20, borderBottom: "2px solid rgba(0,0,0,.08)", overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
      {[["leases", "Lease Agreements"], ["checklists", "Checklists"], ["notices", "Notices"], ["houserules", "House Rules"], ["editor", "Edit Templates"]].map(([id, label]) => (
        <button key={id} onClick={() => { if (templateEditorDirty && leaseSubTab === "editor" && id !== "editor") { setPendingNavTab("__subtab__" + id); return; } if (id === "editor") setLeaseTemplate(null); setLeaseSubTab(id); }}
          style={{ padding: "12px 24px", border: "none", borderBottom: leaseSubTab === id ? "2px solid " + _acc : "2px solid transparent", marginBottom: -2, background: "transparent", color: leaseSubTab === id ? _acc : "#9a8878", fontWeight: leaseSubTab === id ? 700 : 500, fontSize: 13, cursor: "pointer", fontFamily: "inherit", transition: "all .15s", letterSpacing: .1, whiteSpace: "nowrap", flexShrink: 0 }}>
          {label}
        </button>
      ))}
    </div>

    {/* Lease Agreement Templates */}
    {leaseSubTab === "leases" && <LeaseTemplateList
      templates={leaseTemplates}
      setTemplates={setLeaseTemplates}
      selectedTemplate={leaseTemplate}
      setSelectedTemplate={setLeaseTemplate}
      onEdit={(tmpl) => { setLeaseTemplate(tmpl); setLeaseSubTab("editor"); }}
      onCreateLease={(tmpl) => { setLeaseTemplate(tmpl); openCreateLease(null); }}
      settings={settings}
    />}

    {/* Checklists (Move-In Inspection, Move-Out Checklist) */}
    {leaseSubTab === "checklists" && <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div>
          <div style={{ fontSize: 15, fontWeight: 800 }}>Checklists & Inspection Forms</div>
          <div style={{ fontSize: 11, color: "#6b5e52", marginTop: 2 }}>Move-in inspections, move-out checklists, and condition reports</div>
        </div>
        <button className="btn btn-gold btn-sm" onClick={() => {
          const newChecklist = { id: uid(), name: "New Checklist", type: "checklist", items: [{ id: uid(), label: "Item 1", category: "General", requirePhoto: false }], createdAt: new Date().toISOString() };
          setSettings(s => { const u = { ...s, checklists: [...(s.checklists || []), newChecklist] }; save("hq-settings", u); return u; });
        }}>+ New Checklist</button>
      </div>
      {(settings.checklists || []).length === 0 ? (
        <div className="card"><div className="card-bd" style={{ textAlign: "center", padding: 40 }}>
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#c4a882" strokeWidth="1.25" style={{ marginBottom: 10 }}><path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" /></svg>
          <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 4 }}>No checklists yet</div>
          <div style={{ fontSize: 11, color: "#6b5e52", marginBottom: 14 }}>Create a move-in inspection or move-out checklist template.</div>
          <button className="btn btn-gold" onClick={() => {
            const templates = [
              {
                id: uid(), name: "Move-In Inspection", type: "checklist", items: [
                  { id: uid(), label: "Front door and locks", category: "Exterior", requirePhoto: true, condition: "" },
                  { id: uid(), label: "Windows and screens", category: "Exterior", requirePhoto: false, condition: "" },
                  { id: uid(), label: "Walls and paint", category: "Interior", requirePhoto: true, condition: "" },
                  { id: uid(), label: "Flooring", category: "Interior", requirePhoto: true, condition: "" },
                  { id: uid(), label: "Light fixtures and switches", category: "Interior", requirePhoto: false, condition: "" },
                  { id: uid(), label: "Outlets and electrical", category: "Interior", requirePhoto: false, condition: "" },
                  { id: uid(), label: "Kitchen appliances", category: "Kitchen", requirePhoto: true, condition: "" },
                  { id: uid(), label: "Countertops and cabinets", category: "Kitchen", requirePhoto: false, condition: "" },
                  { id: uid(), label: "Sink and faucet", category: "Kitchen", requirePhoto: false, condition: "" },
                  { id: uid(), label: "Toilet", category: "Bathroom", requirePhoto: false, condition: "" },
                  { id: uid(), label: "Shower / tub", category: "Bathroom", requirePhoto: true, condition: "" },
                  { id: uid(), label: "Bathroom mirror and vanity", category: "Bathroom", requirePhoto: false, condition: "" },
                  { id: uid(), label: "Closet doors and shelving", category: "Bedroom", requirePhoto: false, condition: "" },
                  { id: uid(), label: "Smoke detectors", category: "Safety", requirePhoto: false, condition: "" },
                  { id: uid(), label: "CO detector", category: "Safety", requirePhoto: false, condition: "" },
                  { id: uid(), label: "Fire extinguisher", category: "Safety", requirePhoto: false, condition: "" },
                ], createdAt: new Date().toISOString()
              },
              {
                id: uid(), name: "Move-Out Checklist", type: "checklist", items: [
                  { id: uid(), label: "Remove all personal belongings", category: "General", requirePhoto: false, condition: "" },
                  { id: uid(), label: "Clean all rooms thoroughly", category: "Cleaning", requirePhoto: false, condition: "" },
                  { id: uid(), label: "Clean kitchen (appliances, counters, cabinets)", category: "Cleaning", requirePhoto: false, condition: "" },
                  { id: uid(), label: "Clean bathroom (toilet, shower, vanity)", category: "Cleaning", requirePhoto: false, condition: "" },
                  { id: uid(), label: "Vacuum / mop all floors", category: "Cleaning", requirePhoto: false, condition: "" },
                  { id: uid(), label: "Wipe down all surfaces", category: "Cleaning", requirePhoto: false, condition: "" },
                  { id: uid(), label: "Remove all trash", category: "Cleaning", requirePhoto: false, condition: "" },
                  { id: uid(), label: "Patch nail holes", category: "Repairs", requirePhoto: false, condition: "" },
                  { id: uid(), label: "Return all keys and remotes", category: "Keys", requirePhoto: false, condition: "" },
                  { id: uid(), label: "Forward mail to new address", category: "General", requirePhoto: false, condition: "" },
                ], createdAt: new Date().toISOString()
              },
            ];
            setSettings(s => { const u = { ...s, checklists: templates }; save("hq-settings", u); return u; });
          }}>Load Default Templates</button>
        </div></div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {(settings.checklists || []).map((cl, ci) => {
            const categories = [...new Set(cl.items.map(i => i.category))];
            return (
              <div key={cl.id} className="card">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 16px", borderBottom: "1px solid rgba(0,0,0,.04)" }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700 }}>{cl.name}</div>
                    <div style={{ fontSize: 11, color: "#6b5e52" }}>{cl.items.length} items across {categories.length} categories</div>
                  </div>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button className="btn btn-out btn-sm" onClick={() => {
                      const dup = { ...cl, id: uid(), name: cl.name + " (Copy)", items: cl.items.map(i => ({ ...i, id: uid() })) };
                      setSettings(s => { const u = { ...s, checklists: [...(s.checklists || []), dup] }; save("hq-settings", u); return u; });
                    }}>Duplicate</button>
                    <button className="btn btn-out btn-sm" style={{ color: "#c45c4a", borderColor: "rgba(196,92,74,.2)" }} onClick={() => showConfirm({ title: "Delete Checklist?", body: 'Delete "' + cl.name + '"? This cannot be undone.', confirmLabel: "Delete", danger: true, onConfirm: () => setSettings(s => { const u = { ...s, checklists: (s.checklists || []).filter((_, i) => i !== ci) }; save("hq-settings", u); return u; }) })}>Delete</button>
                  </div>
                </div>
                <div style={{ padding: "12px 16px" }}>
                  {categories.map(cat => (
                    <div key={cat} style={{ marginBottom: 8 }}>
                      <div style={{ fontSize: 10, fontWeight: 700, color: "#7a7067", textTransform: "uppercase", letterSpacing: .5, marginBottom: 4 }}>{cat}</div>
                      {cl.items.filter(i => i.category === cat).map((item, ii) => (
                        <div key={item.id} style={{ display: "flex", alignItems: "center", gap: 8, padding: "5px 0", borderBottom: "1px solid rgba(0,0,0,.03)", fontSize: 12 }}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#bbb" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2" /></svg>
                          <span style={{ flex: 1 }}>{item.label}</span>
                          {item.requirePhoto && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="1.5" title="Photo required"><rect x="2" y="6" width="20" height="14" rx="2" /><circle cx="12" cy="13" r="4" /><path d="M2 10l4-2 4 2" /></svg>}
                        </div>
                      ))}
                    </div>
                  ))}
                  <button className="btn btn-out btn-sm" style={{ width: "100%", marginTop: 8 }} onClick={() => {
                    const updated = (settings.checklists || []).map((c, i) => i === ci ? { ...c, items: [...c.items, { id: uid(), label: "New item", category: c.items[c.items.length - 1]?.category || "General", requirePhoto: false, condition: "" }] } : c);
                    setSettings(s => { const u = { ...s, checklists: updated }; save("hq-settings", u); return u; });
                  }}>+ Add Item</button>
                </div>
              </div>);
          })}
        </div>
      )}
    </div>}

    {/* Notices */}
    {leaseSubTab === "notices" && <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div>
          <div style={{ fontSize: 15, fontWeight: 800 }}>Notice Templates</div>
          <div style={{ fontSize: 11, color: "#6b5e52", marginTop: 2 }}>Standardized letters and communications with variable tokens</div>
        </div>
        <button className="btn btn-gold btn-sm" onClick={() => {
          const newNotice = { id: uid(), name: "New Notice", subject: "", body: "", tokens: ["{tenantName}", "{propertyAddress}", "{date}"], createdAt: new Date().toISOString() };
          setSettings(s => { const u = { ...s, noticeTemplates: [...(s.noticeTemplates || []), newNotice] }; save("hq-settings", u); return u; });
        }}>+ New Notice</button>
      </div>
      {(settings.noticeTemplates || []).length === 0 ? (
        <div className="card"><div className="card-bd" style={{ textAlign: "center", padding: 40 }}>
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#c4a882" strokeWidth="1.25" style={{ marginBottom: 10 }}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6" /><path d="M12 18v-6" /><path d="M9 15h6" /></svg>
          <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 4 }}>No notice templates yet</div>
          <div style={{ fontSize: 11, color: "#6b5e52", marginBottom: 14 }}>Create reusable templates for late payment notices, lease violations, and more.</div>
          <button className="btn btn-gold" onClick={() => {
            const defaults = [
              { id: uid(), name: "Late Payment Notice", subject: "Past Due Rent Notice \u2014 {propertyAddress}", body: "Dear {tenantName},\n\nThis letter serves as formal notice that your rent payment of {amount} for the period of {period} is past due. As of {date}, we have not received your payment.\n\nPer your lease agreement, a late fee of {lateFee} has been assessed. Please remit the total amount of {totalDue} immediately.\n\nIf payment has already been sent, please disregard this notice.\n\nSincerely,\n{pmName}\n{companyName}", tokens: ["{tenantName}", "{propertyAddress}", "{amount}", "{period}", "{date}", "{lateFee}", "{totalDue}", "{pmName}", "{companyName}"], createdAt: new Date().toISOString() },
              { id: uid(), name: "Lease Violation Notice", subject: "Lease Violation Notice \u2014 {propertyAddress}", body: "Dear {tenantName},\n\nThis letter serves as formal notice of a lease violation at {propertyAddress}, {roomName}.\n\nViolation: {violationDescription}\nDate observed: {date}\n\nPer Section {sectionNumber} of your lease agreement, this behavior is prohibited. Please correct this issue immediately.\n\nFailure to comply may result in further action as outlined in your lease.\n\nSincerely,\n{pmName}\n{companyName}", tokens: ["{tenantName}", "{propertyAddress}", "{roomName}", "{violationDescription}", "{date}", "{sectionNumber}", "{pmName}", "{companyName}"], createdAt: new Date().toISOString() },
              { id: uid(), name: "30-Day Notice to Vacate (from PM)", subject: "Notice to Vacate \u2014 {propertyAddress}", body: "Dear {tenantName},\n\nThis letter serves as your 30-day notice to vacate the premises at {propertyAddress}, {roomName}.\n\nYour tenancy will terminate on {moveOutDate}. Please ensure all personal belongings are removed and the unit is returned in the condition outlined in your move-out checklist.\n\nYour security deposit of {sdAmount} will be returned within {sdReturnDays} days of move-out, minus any deductions for damages or unpaid charges.\n\nPlease contact us to schedule a move-out inspection.\n\nSincerely,\n{pmName}\n{companyName}", tokens: ["{tenantName}", "{propertyAddress}", "{roomName}", "{moveOutDate}", "{sdAmount}", "{sdReturnDays}", "{pmName}", "{companyName}"], createdAt: new Date().toISOString() },
            ];
            setSettings(s => { const u = { ...s, noticeTemplates: defaults }; save("hq-settings", u); return u; });
          }}>Load Default Notices</button>
        </div></div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {(settings.noticeTemplates || []).map((notice, ni) => (
            <div key={notice.id} className="card">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 16px", borderBottom: "1px solid rgba(0,0,0,.04)" }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700 }}>{notice.name}</div>
                  <div style={{ fontSize: 11, color: "#6b5e52", marginTop: 2 }}>{notice.tokens.length} tokens</div>
                </div>
                <div style={{ display: "flex", gap: 6 }}>
                  <button className="btn btn-out btn-sm" onClick={() => {
                    const dup = { ...notice, id: uid(), name: notice.name + " (Copy)" };
                    setSettings(s => { const u = { ...s, noticeTemplates: [...(s.noticeTemplates || []), dup] }; save("hq-settings", u); return u; });
                  }}>Duplicate</button>
                  <button className="btn btn-out btn-sm" style={{ color: "#c45c4a", borderColor: "rgba(196,92,74,.2)" }} onClick={() => showConfirm({ title: "Delete Notice?", body: 'Delete "' + notice.name + '"? This cannot be undone.', confirmLabel: "Delete", danger: true, onConfirm: () => setSettings(s => { const u = { ...s, noticeTemplates: (s.noticeTemplates || []).filter((_, i) => i !== ni) }; save("hq-settings", u); return u; }) })}>Delete</button>
                </div>
              </div>
              <div style={{ padding: "12px 16px" }}>
                <div className="fld" style={{ marginBottom: 8 }}>
                  <label>Subject Line</label>
                  <input value={notice.subject} onChange={e => { const updated = (settings.noticeTemplates || []).map((n, i) => i === ni ? { ...n, subject: e.target.value } : n); setSettings(s => ({ ...s, noticeTemplates: updated })); }} style={{ width: "100%" }} />
                </div>
                <div className="fld" style={{ marginBottom: 8 }}>
                  <label>Body</label>
                  <textarea value={notice.body} onChange={e => { const updated = (settings.noticeTemplates || []).map((n, i) => i === ni ? { ...n, body: e.target.value } : n); setSettings(s => ({ ...s, noticeTemplates: updated })); }} rows={6} style={{ width: "100%", padding: "8px 10px", borderRadius: 6, border: "1px solid rgba(0,0,0,.08)", fontSize: 16, fontFamily: "inherit", resize: "vertical", lineHeight: 1.6 }} />
                </div>
                <div style={{ padding: "8px 10px", background: "rgba(0,0,0,.03)", borderRadius: 6, border: "1px solid rgba(0,0,0,.05)", marginBottom: 8 }}>
                  <div style={{ fontSize: 9, fontWeight: 700, color: "#7a7067", textTransform: "uppercase", letterSpacing: .5, marginBottom: 4 }}>Available Tokens</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>{notice.tokens.map(t => <code key={t} style={{ fontSize: 10, padding: "2px 6px", borderRadius: 4, background: "rgba(74,124,89,.08)", color: "#2d6a3f", fontFamily: "monospace" }}>{t}</code>)}</div>
                </div>
                <button className="btn btn-gold btn-sm" onClick={() => save("hq-settings", settings)}>Save</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>}

    {/* House Rules */}
    {leaseSubTab === "houserules" && <div>
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 15, fontWeight: 800 }}>House Rules</div>
        <div style={{ fontSize: 11, color: "#6b5e52", marginTop: 2 }}>Default rules for all properties. These appear in the tenant portal and can be referenced in leases.</div>
      </div>
      <div className="card"><div className="card-bd">
        <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
          {(settings.houseRules || DEF_SETTINGS.houseRules || []).map((rule, i) => {
            const rules = settings.houseRules || DEF_SETTINGS.houseRules || [];
            return (
              <div key={i} draggable
                onDragStart={e => { e.dataTransfer.setData("ruleIdx", String(i)); }}
                onDragOver={e => e.preventDefault()}
                onDrop={e => {
                  e.preventDefault();
                  const from = Number(e.dataTransfer.getData("ruleIdx"));
                  if (from === i) return;
                  const next = [...rules];
                  const [moved] = next.splice(from, 1);
                  next.splice(i, 0, moved);
                  setSettings(s => ({ ...s, houseRules: next }));
                }}
                style={{ display: "flex", gap: 6, alignItems: "center", background: "#faf9f7", borderRadius: 6, padding: "6px 8px", border: "1px solid rgba(0,0,0,.06)", cursor: "grab" }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#8a7d74" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
                <input value={rule} style={{ flex: 1, border: "none", background: "transparent", fontFamily: "inherit", fontSize: 16, outline: "none", padding: 0 }}
                  onChange={e => { const next = [...rules]; next[i] = e.target.value; setSettings(s => ({ ...s, houseRules: next })); }} />
                <button style={{ background: "none", border: "none", color: "#c45c4a", cursor: "pointer", fontSize: 13, padding: 0, lineHeight: 1, flexShrink: 0, minWidth: 44, minHeight: 44, display: "flex", alignItems: "center", justifyContent: "center" }} onClick={() => { const next = rules.filter((_, j) => j !== i); setSettings(s => ({ ...s, houseRules: next })); }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                </button>
              </div>);
          })}
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
          <button className="btn btn-out" style={{ flex: 1 }} onClick={() => {
            const rules = [...(settings.houseRules || DEF_SETTINGS.houseRules || []), "New rule"];
            setSettings(s => ({ ...s, houseRules: rules }));
          }}>+ Add Rule</button>
          <button className="btn btn-gold" style={{ flex: 1 }} onClick={() => save("hq-settings", settings)}>Save House Rules</button>
        </div>
      </div></div>
      <div style={{ marginTop: 12, padding: "10px 14px", background: "rgba(0,0,0,.03)", borderRadius: 8, fontSize: 11, color: "#6b5e52" }}>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ display: "inline", verticalAlign: "middle", marginRight: 4 }}><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></svg>
        These rules auto-populate in the tenant portal and can be overridden per-property in the Properties tab.
      </div>
    </div>}

    {/* Template Editor — pick template first, then edit */}
    {leaseSubTab === "editor" && (!leaseTemplate ? (
      <div>
        <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 4 }}>Select a Template to Edit</div>
        <div style={{ fontSize: 11, color: "#6b5e52", marginBottom: 16 }}>Choose which lease template you want to modify.</div>
        {leaseTemplates.length === 0 ? (
          <div className="card"><div className="card-bd" style={{ textAlign: "center", padding: 40, color: "#6b5e52" }}>
            <div style={{ fontSize: 13, marginBottom: 8 }}>No templates yet. Create one from the Lease Agreements tab.</div>
          </div></div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {leaseTemplates.map(tmpl => (
              <div key={tmpl.id} onClick={() => setLeaseTemplate(tmpl)} className="card" style={{ cursor: "pointer", transition: "border-color .15s" }} onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(0,0,0,.15)"} onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(0,0,0,.06)"}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 16px" }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700 }}>{tmpl.name}</div>
                    <div style={{ fontSize: 11, color: "#6b5e52", marginTop: 2 }}>{(tmpl.sections || []).filter(s => s.active !== false).length} active sections</div>
                  </div>
                  <div style={{ minWidth: 44, minHeight: 44, display: "flex", alignItems: "center", justifyContent: "center" }}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2"><path d="M9 18l6-6-6-6" /></svg></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    ) : (
      <div>
        <button onClick={() => setLeaseTemplate(null)} className="btn btn-out btn-sm" style={{ marginBottom: 14, display: "flex", alignItems: "center", gap: 6 }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6" /></svg>
          All Templates
        </button>
        <TemplateEditor
          template={leaseTemplate}
          setTemplate={setLeaseTemplate}
          settings={settings}
          showAlert={showAlert}
          DEF_LEASE_SECTIONS={DEF_LEASE_SECTIONS}
          onDirtyChange={setTemplateEditorDirty}
        />
      </div>
    ))}

    <LeaseModal
      leaseForm={leaseForm} setLeaseForm={setLeaseForm}
      leases={leases} setLeases={setLeases}
      properties={props} setProperties={setProps}
      settings={settings} setSettings={setSettings}
      setCharges={setCharges}
      setNotifs={setNotifs}
      modal={modal} setModal={setModal}
      showAlert={showAlert}
      setLeaseSubTab={setLeaseSubTab}
    />

    {/* ── Template editor unsaved changes modal ── */}
    {pendingNavTab && <div className="mbg" onClick={() => setPendingNavTab(null)}>
      <div className="mbox" onClick={e => e.stopPropagation()} style={{ maxWidth: 420, textAlign: "center" }}>
        <div style={{ width: 48, height: 48, borderRadius: "50%", background: "rgba(196,92,74,.1)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
          <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="#c45c4a" strokeWidth="2" strokeLinecap="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
        </div>
        <h2 style={{ fontSize: 15, marginBottom: 8 }}>Unsaved Changes</h2>
        <p style={{ fontSize: 12, color: "#5c4a3a", lineHeight: 1.6, marginBottom: 20 }}>
          You have unsaved changes in the Template Editor. If you leave now your changes will be lost.
        </p>
        <div className="mft">
          <button className="btn btn-out" onClick={() => setPendingNavTab(null)}>Cancel — Stay Here</button>
          <button className="btn btn-out" style={{ color: "#c45c4a", borderColor: "rgba(196,92,74,.3)" }} onClick={() => { setTemplateEditorDirty(false); if (pendingNavTab?.startsWith("__subtab__")) { setLeaseSubTab(pendingNavTab.replace("__subtab__", "")); } else { goTab(pendingNavTab, true); } setPendingNavTab(null); }}>Leave Without Saving</button>
          <button className="btn btn-gold" onClick={async () => {
            // Save template then navigate
            if (leaseTemplate?.id) {
              try {
                await supa("lease_templates?id=eq." + leaseTemplate.id, { method: "PATCH", prefer: "resolution=merge-duplicates", body: JSON.stringify({ name: leaseTemplate.name, sections: leaseTemplate.sections, updated_at: new Date().toISOString() }) });
              } catch (e) { }
            }
            setTemplateEditorDirty(false);
            if (pendingNavTab?.startsWith("__subtab__")) { setLeaseSubTab(pendingNavTab.replace("__subtab__", "")); } else { goTab(pendingNavTab, true); }
            setPendingNavTab(null);
          }}>Save & Leave</button>
        </div>
      </div>
    </div>}

    {/* View executed lease */}
    {modal?.type === "viewLease" && <div className="mbg" onClick={() => setModal(null)}><div className="mbox" onClick={e => e.stopPropagation()} style={{ maxWidth: 560 }}>
      <h2>Executed Lease</h2>
      <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
        <div style={{ flex: 1, padding: "10px 12px", background: "rgba(74,124,89,.06)", borderRadius: 8, fontSize: 11 }}>
          <div style={{ color: "#6b5e52", marginBottom: 2 }}>Tenant</div><strong>{modal.lease.tenantName}</strong>
        </div>
        <div style={{ flex: 1, padding: "10px 12px", background: "rgba(74,124,89,.06)", borderRadius: 8, fontSize: 11 }}>
          <div style={{ color: "#6b5e52", marginBottom: 2 }}>Property</div><strong>{modal.lease.property} · {modal.lease.room}</strong>
        </div>
      </div>
      <div className="tp-card"><h3>📋 Lease Summary</h3>
        <div className="tp-row"><span className="tp-label">Rent</span><strong>{fmtS(modal.lease.rent || 0)}/mo</strong></div>
        <div className="tp-row"><span className="tp-label">Security Deposit</span><strong>{fmtS(modal.lease.sd || 0)}</strong></div>
        <div className="tp-row"><span className="tp-label">Move-in</span><strong>{fmtD(modal.lease.moveIn)}</strong></div>
        <div className="tp-row"><span className="tp-label">Lease End</span><strong>{fmtD(modal.lease.leaseEnd)}</strong></div>
        <div className="tp-row"><span className="tp-label">Door Code</span><strong>{modal.lease.doorCode || "—"}</strong></div>
        <div className="tp-row"><span className="tp-label">Parking</span><strong>{modal.lease.parking || "—"}</strong></div>
      </div>
      <div className="tp-card" style={{ marginTop: 10 }}><h3>✍ Signatures</h3>
        <div className="tp-row"><span className="tp-label">PM Signed</span><strong style={{ color: "#4a7c59" }}>✓ {modal.lease.landlordSignedAt ? new Date(modal.lease.landlordSignedAt).toLocaleDateString() : "—"}</strong></div>
        <div className="tp-row"><span className="tp-label">Tenant Signed</span><strong style={{ color: "#4a7c59" }}>✓ {modal.lease.tenantSignedAt ? new Date(modal.lease.tenantSignedAt).toLocaleDateString() : "—"}</strong></div>
        <div className="tp-row"><span className="tp-label">Executed</span><strong style={{ color: "#4a7c59" }}>{modal.lease.executedAt ? new Date(modal.lease.executedAt).toLocaleDateString() : "—"}</strong></div>
      </div>
      {modal.lease.tenantSignature && <div style={{ marginTop: 10 }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: "#6b5e52", marginBottom: 4 }}>TENANT SIGNATURE</div>
        <img src={modal.lease.tenantSignature} alt="Tenant sig" style={{ maxHeight: 60, border: "1px solid rgba(0,0,0,.06)", borderRadius: 6, padding: 4, background: "#fff" }} />
      </div>}
      {modal.lease.landlordSignature && <div style={{ marginTop: 10 }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: "#6b5e52", marginBottom: 4 }}>PM SIGNATURE</div>
        <img src={modal.lease.landlordSignature} alt="PM sig" style={{ maxHeight: 60, border: "1px solid rgba(0,0,0,.06)", borderRadius: 6, padding: 4, background: "#fff" }} />
      </div>}
      <div className="mft"><button className="btn btn-out" onClick={() => setModal(null)}>Close</button></div>
    </div></div>}

  </>);
}
