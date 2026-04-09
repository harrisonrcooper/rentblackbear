"use client";
import { hexRgba, fmt, fmtD, daysLeft, sCard, sLabel, sRow } from "./PortalShared";

export default function HomeTab({
  tenant, C, t, pm, pmSettings, charges, maintenance, totalDue, dl,
  announcements, utilities, utilityConfig, getUtilityShare,
  insurance, scheduledPayments, packages, surveys, activeSurvey, setActiveSurvey,
  surveyForm, setSurveyForm, submitSurvey, markPackagePickedUp,
  showDoorCode, setShowDoorCode, doorCodeChange, setDoorCodeChange,
  setActiveTab, setRenewalModal, startPayment, user,
  supabase, esc,
  amenities, amenityBookings, bookingForm, setBookingForm, bookAmenity, cancelBooking,
  docRequests, autopay,
}) {
  const pendingDocReqs = (docRequests || []).filter(r => r.status === "pending");
  const pendingSurveys = (surveys || []).filter(s => s.status === "pending");
  const pendingPkgs = (packages || []).filter(p => p.status === "pending");
  const insExpired = insurance && insurance.expiration && new Date(insurance.expiration + "T00:00:00") < new Date();
  const insExpiring = insurance && insurance.expiration && daysLeft(insurance.expiration) <= 30 && daysLeft(insurance.expiration) > 0;
  const insMissing = !insurance;
  const openMaint = maintenance.filter(m => m.status !== "resolved");
  const actionItems = [];
  if (insExpired) actionItems.push({ label: t.insurance?.expired || "Insurance expired", color: C.red, tab: "documents" });
  else if (insExpiring) actionItems.push({ label: (t.insurance?.expiresIn || "Insurance expires in") + " " + daysLeft(insurance.expiration) + " " + (t.insurance?.days || "days"), color: C.accent, tab: "documents" });
  else if (insMissing) actionItems.push({ label: t.insurance?.missing || "Insurance not on file", color: C.red, tab: "documents" });
  pendingDocReqs.forEach(r => actionItems.push({ label: (r.title || r.type || "Document").replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase()) + (r.deadline ? " due " + fmtD(r.deadline) : ""), color: C.accent, tab: "documents" }));
  pendingSurveys.forEach(() => actionItems.push({ label: t.surveys?.moveInSurvey || "Survey pending", color: C.accent, tab: null }));
  pendingPkgs.forEach(p => actionItems.push({ label: (p.carrier || "Package") + " at " + (p.locker || "front desk"), color: C.accent, tab: null }));

  return (
    <div style={{ animation: "fadeIn .2s" }}>
      {/* ── Balance Due Card ── */}
      {(() => {
        const hasPastDue = charges.some(c => !c.waived && !c.voided && c.amount_paid < c.amount && c.due_date && new Date(c.due_date + "T00:00:00") < new Date());
        return (
          <div style={{ textAlign: "center", marginBottom: 14 }}>
            <div style={{ background: totalDue > 0 ? (hasPastDue ? hexRgba(C.red, .04) : "#fff") : C.bg, borderRadius: 16, padding: "28px 24px", border: totalDue > 0 ? (hasPastDue ? "2px solid " + hexRgba(C.red, .25) : "1px solid rgba(0,0,0,.06)") : "none" }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: hasPastDue ? C.red : C.muted, textTransform: "uppercase", letterSpacing: .8, marginBottom: 10 }}>{hasPastDue ? t.home.pastDueHeader : t.home.balanceDue}</div>
              <div style={{ fontSize: 44, fontWeight: 800, color: totalDue > 0 ? (hasPastDue ? C.red : C.text) : C.green, letterSpacing: -1 }}>{fmt(totalDue)}</div>
              {totalDue === 0 && <div style={{ fontSize: 12, color: "rgba(255,255,255,.4)", marginTop: 6 }}>{t.home.allPaidUp}</div>}
              {totalDue > 0 && hasPastDue && <div style={{ fontSize: 11, color: C.red, fontWeight: 600, marginTop: 6 }}>{t.home.payImmediately}</div>}
              {totalDue > 0 && (
                <button onClick={() => { setActiveTab("payments"); const unpaid = charges.find(c => !c.waived && !c.voided && c.amount_paid < c.amount); if (unpaid) setTimeout(() => startPayment(unpaid), 300); }} style={{ marginTop: 14, padding: "10px 32px", borderRadius: 8, border: "none", background: hasPastDue ? C.red : C.bg, color: hasPastDue ? "#fff" : C.accent, fontWeight: 800, fontSize: 13, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 8 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                  {t.home.payNow}
                </button>
              )}
              {/* Autopay indicator */}
              {autopay?.enrolled && totalDue === 0 && (
                <div style={{ fontSize: 10, color: "rgba(255,255,255,.35)", marginTop: 8, display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  Autopay active
                </div>
              )}
              {autopay?.enrolled && totalDue > 0 && (
                <div style={{ fontSize: 10, color: C.green, marginTop: 8, fontWeight: 600 }}>
                  Autopay ON {"\u2014"} {fmt(totalDue)} scheduled
                </div>
              )}
            </div>
          </div>
        );
      })()}

      {/* ── Action Items Bar ── */}
      {actionItems.length > 0 && (
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 14 }}>
          {actionItems.map((item, i) => (
            <button key={i} onClick={() => { if (item.tab) setActiveTab(item.tab); }} style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "5px 10px", borderRadius: 8, border: "1.5px solid " + hexRgba(item.color, .2), background: hexRgba(item.color, .05), color: item.color, fontSize: 10, fontWeight: 700, cursor: item.tab ? "pointer" : "default", fontFamily: "inherit" }}>
              <svg width="8" height="8" viewBox="0 0 24 24" fill={item.color} stroke="none"><circle cx="12" cy="12" r="12"/></svg>
              {item.label}
            </button>
          ))}
        </div>
      )}

      {/* ── Rent & Lease Cards ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
        <div style={sCard}><span style={sLabel}>{t.home.monthlyRent}</span><div style={{ fontSize: 22, fontWeight: 800 }}>{fmt(tenant?.rent)}</div><div style={{ fontSize: 11, color: "#999", marginTop: 2 }}>{t.home.due1st}{pmSettings?.lateFeeGraceDays ? ` ${"\u2014"} ${t.home.lateAfterDay} ${pmSettings.lateFeeGraceDays}` : ""}</div>{(() => { const now = new Date(); const y = now.getFullYear(); const mo = now.getMonth(); const firstNextMonth = new Date(y, mo + 1, 1); const firstThisMonth = new Date(y, mo, 1); const nextDue = now.getDate() > 1 ? firstNextMonth : firstThisMonth; const diffDays = Math.ceil((nextDue - now) / (1e3 * 60 * 60 * 24)); const nearestUnpaid = charges.find(c => !c.waived && !c.voided && c.amount_paid < c.amount && (c.type === "rent" || (c.label || "").toLowerCase().includes("rent"))); const isPastDue = nearestUnpaid && nearestUnpaid.due_date && new Date(nearestUnpaid.due_date + "T00:00:00") < now; if (isPastDue) { const overdueDays = Math.floor((now - new Date(nearestUnpaid.due_date + "T00:00:00")) / (1e3 * 60 * 60 * 24)); return <div style={{ fontSize: 11, color: C.red, fontWeight: 700, marginTop: 4 }}>{t.home.pastDue + " \u2014 " + overdueDays + " " + t.home.daysOverdue}</div>; } if (diffDays === 0) return <div style={{ fontSize: 11, color: C.red, fontWeight: 700, marginTop: 4 }}>{t.home.dueToday}</div>; if (diffDays <= 3) return <div style={{ fontSize: 11, color: C.accent, fontWeight: 700, marginTop: 4 }}>{t.home.dueIn + " " + diffDays + " " + t.home.days}</div>; if (diffDays <= 7) return <div style={{ fontSize: 11, color: C.muted, fontWeight: 600, marginTop: 4 }}>{t.home.dueIn + " " + diffDays + " " + t.home.days}</div>; return null; })()}</div>
        <div onClick={() => { if (dl !== null && dl <= 90 && dl > 0) setRenewalModal({ open: true, choice: null, submitting: false, submitted: false }); else setActiveTab("documents"); }} style={{ ...sCard, cursor: "pointer", transition: "border-color .15s", borderColor: dl && dl <= 60 ? hexRgba(C.red, .2) : "rgba(0,0,0,.06)" }}><span style={sLabel}>{t.home.leaseEnd}</span><div style={{ fontSize: 22, fontWeight: 800, color: dl && dl <= 60 ? C.red : C.text }}>{fmtD(tenant?.lease_end)}</div>{dl !== null && <div style={{ fontSize: 11, color: dl <= 30 ? C.red : dl <= 60 ? C.accent : "#999", marginTop: 2 }}>{dl > 0 ? dl + " " + t.home.daysRemaining : t.home.expired}</div>}{dl !== null && dl <= 90 && dl > 0 && <div style={{ fontSize: 10, fontWeight: 700, color: C.accent, marginTop: 6, display: "flex", alignItems: "center", gap: 4, justifyContent: "flex-start" }}><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg>{t.home.renewalOptions}</div>}</div>
      </div>

      {/* ── Announcements ── */}
      {announcements.length > 0 && (
        <div style={{ marginBottom: 12 }}>
          <span style={sLabel}>{t.home.announcements}</span>
          {announcements.map(a => (
            <div key={a.id} style={{ background: "#fff", borderRadius: 14, padding: "16px 18px", border: "1px solid rgba(0,0,0,.06)", borderLeft: `4px solid ${C.accent}`, marginBottom: 8 }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.accent} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 2 }}><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 4 }}>{a.title}</div>
                  <div style={{ fontSize: 12, color: C.muted, lineHeight: 1.5, whiteSpace: "pre-wrap" }}>{a.body}</div>
                  <div style={{ fontSize: 10, color: "#999", marginTop: 8 }}>{t.home.posted} {new Date(a.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Room Info ── */}
      <div style={sCard}>
        <span style={sLabel}>{t.home.yourRoom}</span>
        {[[t.home.property, tenant?.property?.name], [t.home.room, tenant?.room?.name], [t.home.moveIn, fmtD(tenant?.move_in)]].filter(([, v]) => v).map(([label, val]) => (
          <div key={label} style={sRow}><span style={{ color: C.muted }}>{label}</span><span style={{ fontWeight: 600 }}>{val}</span></div>
        ))}
        {(tenant?.door_code || tenant?.room?.door_code) && (
          <div>
            <div style={sRow}>
              <span style={{ color: C.muted }}>{t.home.doorCode}</span>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <button onClick={() => setShowDoorCode(!showDoorCode)} style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "monospace", fontWeight: 800, letterSpacing: showDoorCode ? 4 : 2, fontSize: 13, color: C.text, display: "flex", alignItems: "center", gap: 6, padding: 0 }}>
                  {showDoorCode ? (tenant?.door_code || tenant?.room?.door_code) : "\u2022\u2022\u2022\u2022"}
                  {showDoorCode
                    ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.muted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                    : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.muted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  }
                </button>
                {pmSettings?.allowDoorCodeChange !== false && !doorCodeChange.open && (
                  <button onClick={() => setDoorCodeChange({ open: true, newCode: "", submitting: false, done: false, error: "" })} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 10, color: C.accent, fontWeight: 700, padding: 0 }}>{t.home.change}</button>
                )}
              </div>
            </div>
            {doorCodeChange.open && (
              <div style={{ padding: "10px 0" }}>
                {doorCodeChange.done ? (
                  <div style={{ background: hexRgba(C.green, .08), border: "1px solid " + hexRgba(C.green, .2), borderRadius: 8, padding: "10px 12px", fontSize: 11, color: C.green, fontWeight: 600 }}>
                    {pmSettings?.lockType === "smart_api" ? "Door code updated successfully." : pmSettings?.lockType === "smart_manual" ? "Request sent. Your PM will update the lock remotely." : "Maintenance request submitted. Your PM will update the lock."}
                  </div>
                ) : (
                  <div>
                    <div style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 6 }}>
                      <input value={doorCodeChange.newCode} onChange={e => { const v = e.target.value.replace(/\D/g, "").slice(0, 4); setDoorCodeChange(p => ({ ...p, newCode: v, error: "" })); }} placeholder="New 4-digit code" maxLength={4} style={{ flex: 1, padding: "8px 10px", borderRadius: 6, border: "1.5px solid " + (doorCodeChange.error ? C.red : "rgba(0,0,0,.1)"), fontSize: 14, fontFamily: "monospace", letterSpacing: 6, textAlign: "center" }} />
                    </div>
                    {doorCodeChange.error && <div style={{ fontSize: 10, color: C.red, marginBottom: 6 }}>{doorCodeChange.error}</div>}
                    <div style={{ display: "flex", gap: 6 }}>
                      <button onClick={() => setDoorCodeChange({ open: false, newCode: "", submitting: false, done: false, error: "" })} style={{ flex: 1, padding: "8px", borderRadius: 6, border: "1.5px solid rgba(0,0,0,.1)", background: "#fff", cursor: "pointer", fontSize: 11, fontWeight: 600 }}>{t.common.cancel}</button>
                      <button disabled={doorCodeChange.submitting} onClick={async () => {
                        const code = doorCodeChange.newCode;
                        if (code.length !== 4) { setDoorCodeChange(p => ({ ...p, error: "Must be exactly 4 digits" })); return; }
                        if (code === (tenant?.door_code || tenant?.room?.door_code)) { setDoorCodeChange(p => ({ ...p, error: "Same as current code" })); return; }
                        setDoorCodeChange(p => ({ ...p, submitting: true }));
                        const lockType = pmSettings?.lockType || "dumb";
                        if (lockType === "smart_api") {
                          await supabase.from("tenants").update({ door_code: code }).eq("id", tenant?.id);
                          setDoorCodeChange({ open: true, newCode: "", submitting: false, done: true, error: "" });
                        } else if (lockType === "smart_manual") {
                          await supabase.from("tenants").update({ door_code: code }).eq("id", tenant?.id);
                          await supabase.from("messages").insert({ tenant_name: tenant?.name, sender_email: user?.email || "", sender_name: tenant?.name, direction: "inbound", subject: "Door Code Change Request", body: "Please update my door code to: " + code + "\nProperty: " + (tenant?.property?.name || "") + "\nRoom: " + (tenant?.room?.name || ""), property_name: tenant?.property?.name || "", room_name: tenant?.room?.name || "", read: false });
                          try { await fetch("/api/send-email", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ to: pmSettings?.pmEmail || pmSettings?.email || "", subject: "Door Code Change: " + (tenant?.name || "") + " \u2192 " + code, html: "<p><strong>" + esc(tenant?.name) + "</strong> has requested a door code change.</p><p>New code: <strong>" + code + "</strong></p><p>" + esc(tenant?.property?.name) + " &mdash; " + esc(tenant?.room?.name) + "</p><p>Please update the smart lock remotely.</p>" }) }); } catch (e) {}
                          setDoorCodeChange({ open: true, newCode: "", submitting: false, done: true, error: "" });
                        } else {
                          await supabase.from("maintenance_requests").insert({ pm_id: tenant?.pm_id, tenant_id: tenant?.id, property_id: tenant?.property_id, room_id: tenant?.room_id, title: "Door Code Change Request", description: "Tenant requests new door code: " + code, priority: "medium", submitted_by: tenant?.name });
                          try { await fetch("/api/send-email", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ to: pmSettings?.pmEmail || pmSettings?.email || "", subject: "Door Code Change Request: " + (tenant?.name || ""), html: "<p><strong>" + esc(tenant?.name) + "</strong> has requested a door code change to <strong>" + code + "</strong>.</p><p>" + esc(tenant?.property?.name) + " &mdash; " + esc(tenant?.room?.name) + "</p><p>A maintenance request has been created.</p>" }) }); } catch (e) {}
                          setDoorCodeChange({ open: true, newCode: "", submitting: false, done: true, error: "" });
                        }
                      }} style={{ flex: 1, padding: "8px", borderRadius: 6, border: "none", background: doorCodeChange.newCode.length === 4 ? C.bg : "rgba(0,0,0,.08)", color: doorCodeChange.newCode.length === 4 ? C.accent : "#bbb", cursor: doorCodeChange.newCode.length === 4 ? "pointer" : "default", fontSize: 11, fontWeight: 800 }}>
                        {doorCodeChange.submitting ? t.home.updating : t.home.updateCode}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Open Maintenance Status ── */}
      {openMaint.length > 0 && (
        <div style={{ ...sCard, borderColor: hexRgba(C.accent, .15), borderLeft: "4px solid " + C.accent }}>
          <span style={sLabel}>{t.home.openMaintenance}</span>
          {openMaint.map(req => (
            <div key={req.id} onClick={() => setActiveTab("maintenance")} style={{ cursor: "pointer", padding: "8px 0", borderBottom: "1px solid rgba(0,0,0,.04)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ fontSize: 12, fontWeight: 600 }}>{req.title}</div>
                <span style={{ fontSize: 10, padding: "3px 8px", borderRadius: 100, fontWeight: 700, background: req.status === "in-progress" ? hexRgba(C.accent, .12) : hexRgba(C.red, .08), color: req.status === "in-progress" ? C.accent : C.red }}>{req.status === "in-progress" ? t.home.inProgress : t.home.open}</span>
              </div>
              {(req.technician || req.eta) && (
                <div style={{ display: "flex", gap: 12, marginTop: 4, fontSize: 10, color: C.muted }}>
                  {req.technician && <span>Tech: {req.technician}</span>}
                  {req.eta && <span>ETA: {fmtD(req.eta)}{(() => { const d = daysLeft(req.eta); return d !== null && d >= 0 ? " (" + d + "d)" : ""; })()}</span>}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ── Utility Dashboard ── */}
      {utilities.length > 0 && (
        <div style={sCard}>
          <span style={sLabel}>{t.utilities?.title || "Utilities"}</span>
          <div style={{ fontSize: 10, color: C.muted, marginBottom: 12, lineHeight: 1.5 }}>
            {(t.utilities?.coverageNote || "First ${{amount}} covered by property manager. Overage split equally among residents.").replace("{{amount}}", utilityConfig.coverageAmount || 100)}
          </div>
          {(() => {
            const current = utilities[0];
            if (!current) return null;
            const share = getUtilityShare(current);
            const types = Object.entries(current.breakdown || {}).filter(([, v]) => v > 0);
            return (
              <div style={{ background: hexRgba(C.accent, .04), border: "1px solid " + hexRgba(C.accent, .15), borderRadius: 10, padding: 14, marginBottom: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: C.text }}>{t.utilities?.currentMonth || "Current Month"}</span>
                  <span style={{ fontSize: 10, color: C.muted }}>{current.billing_month}</span>
                </div>
                {types.map(([type, amount]) => (
                  <div key={type} style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", fontSize: 11, borderBottom: "1px solid rgba(0,0,0,.04)" }}>
                    <span style={{ color: C.muted, textTransform: "capitalize" }}>{t.utilities?.[type] || type}</span>
                    <span style={{ fontWeight: 600 }}>{fmt(amount)}</span>
                  </div>
                ))}
                <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", fontSize: 11, borderBottom: "1px solid rgba(0,0,0,.04)" }}>
                  <span style={{ color: C.muted }}>{t.utilities?.totalBill || "Total Bill"}</span>
                  <span style={{ fontWeight: 700 }}>{fmt(share.total)}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", fontSize: 11, borderBottom: "1px solid rgba(0,0,0,.04)" }}>
                  <span style={{ color: C.green }}>{t.utilities?.covered || "Covered"}</span>
                  <span style={{ fontWeight: 600, color: C.green }}>-{fmt(share.coverage)}</span>
                </div>
                {share.overage > 0 && (
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", fontSize: 11, borderBottom: "1px solid rgba(0,0,0,.04)" }}>
                    <span style={{ color: C.muted }}>{t.utilities?.overage || "Overage"} ({t.utilities?.splitBetween || "split between"} {share.residents} {t.utilities?.residents || "residents"})</span>
                    <span style={{ fontWeight: 600 }}>{fmt(share.overage)} / {share.residents}</span>
                  </div>
                )}
                <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0 0", fontSize: 14, fontWeight: 800 }}>
                  <span>{t.utilities?.youOwe || "You Owe"}</span>
                  <span style={{ color: share.share > 0 ? C.red : C.green }}>{fmt(share.share)}</span>
                </div>
              </div>
            );
          })()}
          {utilities.length > 1 && (
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: C.muted, marginBottom: 8 }}>{t.utilities?.trend || "12-Month Trend"}</div>
              <div style={{ display: "flex", alignItems: "flex-end", gap: 3, height: 60 }}>
                {(() => {
                  const recent = utilities.slice(0, 12).reverse();
                  const maxShare = Math.max(...recent.map(u => getUtilityShare(u).share), 1);
                  return recent.map((u, i) => {
                    const share = getUtilityShare(u).share;
                    const h = (share / maxShare) * 50 + 4;
                    const isLast = i === recent.length - 1;
                    return (
                      <div key={u.id || i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                        <div style={{ width: "100%", height: h, background: isLast ? C.accent : hexRgba(C.accent, .3), borderRadius: "3px 3px 0 0", position: "relative" }} title={u.billing_month + ": " + fmt(share)}>
                          {isLast && <div style={{ position: "absolute", top: -14, left: "50%", transform: "translateX(-50%)", fontSize: 8, fontWeight: 700, color: C.text, whiteSpace: "nowrap" }}>{fmt(share)}</div>}
                        </div>
                        <div style={{ fontSize: 7, color: "#999", whiteSpace: "nowrap" }}>{(u.billing_month || "").slice(5)}</div>
                      </div>
                    );
                  });
                })()}
              </div>
              <div style={{ fontSize: 9, color: C.muted, textAlign: "right", marginTop: 4 }}>{t.utilities?.avg || "Avg"}: {fmt(utilities.slice(0, 12).reduce((s, u) => s + getUtilityShare(u).share, 0) / Math.min(utilities.length, 12))}/mo</div>
            </div>
          )}
        </div>
      )}

      {/* ── Amenity Booking (moved from Community tab) ── */}
      {(amenities || []).length > 0 && (
        <div style={sCard}>
          <span style={sLabel}>{t.community?.amenities || "Book Amenity"}</span>
          {/* Active bookings */}
          {(amenityBookings || []).filter(b => b.status === "active").length > 0 && (
            <div style={{ marginBottom: 10 }}>
              {(amenityBookings || []).filter(b => b.status === "active").map(b => {
                const am = amenities.find(a => a.id === b.amenity_id);
                return (
                  <div key={b.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 12px", background: hexRgba(C.green, .04), border: "1px solid " + hexRgba(C.green, .15), borderRadius: 8, marginBottom: 6 }}>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 600 }}>{t.community?.[am?.name] || am?.name || "Amenity"}</div>
                      <div style={{ fontSize: 10, color: C.muted }}>{fmtD(b.date)} {"\u2014"} {b.time_slot}</div>
                    </div>
                    <button onClick={() => cancelBooking(b.id)} style={{ padding: "4px 10px", borderRadius: 6, border: "1.5px solid " + hexRgba(C.red, .2), background: hexRgba(C.red, .04), color: C.red, fontSize: 9, fontWeight: 700, cursor: "pointer" }}>{t.community?.cancelBooking || "Cancel"}</button>
                  </div>
                );
              })}
            </div>
          )}
          {/* Amenity grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(100px,1fr))", gap: 8 }}>
            {amenities.map(am => (
              <button key={am.id} onClick={() => setBookingForm({ open: true, amenityId: am.id, date: "", timeSlot: "", submitting: false })} style={{ padding: "12px 8px", borderRadius: 10, border: "1.5px solid rgba(0,0,0,.08)", background: "#fff", cursor: "pointer", textAlign: "center" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={C.accent} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: 4 }}>
                  {am.name === "kitchen" && <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2M7 2v20M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3zm0 0v7"/>}
                  {am.name === "laundry" && <><rect x="2" y="2" width="20" height="20" rx="3"/><circle cx="12" cy="13" r="5"/><circle cx="12" cy="13" r="2"/></>}
                  {am.name === "parking" && <><rect x="1" y="5" width="22" height="14" rx="3"/><path d="M12 5V3M7 5V3M17 5V3"/></>}
                  {am.name === "commonRoom" && <><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M9 22V12h6v10"/></>}
                  {!["kitchen","laundry","parking","commonRoom"].includes(am.name) && <><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></>}
                </svg>
                <div style={{ fontSize: 10, fontWeight: 700, color: C.text }}>{t.community?.[am.name] || am.name}</div>
              </button>
            ))}
          </div>
          {/* Booking form */}
          {bookingForm.open && (() => {
            const am = amenities.find(a => a.id === bookingForm.amenityId);
            return (
              <div style={{ marginTop: 12, padding: 14, background: "#faf9f7", borderRadius: 10, border: "1px solid rgba(0,0,0,.06)" }}>
                <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 10 }}>{t.community?.bookAmenity || "Book"}: {t.community?.[am?.name] || am?.name}</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 10 }}>
                  <div>
                    <label style={{ fontSize: 10, fontWeight: 700, color: C.muted, display: "block", marginBottom: 4 }}>{t.community?.selectDate || "Date"}</label>
                    <input type="date" value={bookingForm.date} onChange={e => setBookingForm(p => ({ ...p, date: e.target.value }))} min={new Date().toISOString().split("T")[0]} style={{ width: "100%", padding: "8px", borderRadius: 6, border: "1.5px solid rgba(0,0,0,.1)", fontSize: 12 }} />
                  </div>
                  <div>
                    <label style={{ fontSize: 10, fontWeight: 700, color: C.muted, display: "block", marginBottom: 4 }}>{t.community?.selectTime || "Time Slot"}</label>
                    <select value={bookingForm.timeSlot} onChange={e => setBookingForm(p => ({ ...p, timeSlot: e.target.value }))} style={{ width: "100%", padding: "8px", borderRadius: 6, border: "1.5px solid rgba(0,0,0,.1)", fontSize: 12 }}>
                      <option value="">Select...</option>
                      {(am?.slots || []).map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={() => setBookingForm({ open: false, amenityId: null, date: "", timeSlot: "", submitting: false })} style={{ flex: 1, padding: "10px", borderRadius: 8, border: "1.5px solid rgba(0,0,0,.1)", background: "#fff", cursor: "pointer", fontWeight: 600, fontSize: 12 }}>{t.common.cancel}</button>
                  <button onClick={bookAmenity} disabled={!bookingForm.date || !bookingForm.timeSlot || bookingForm.submitting} style={{ flex: 2, padding: "10px", borderRadius: 8, border: "none", background: bookingForm.date && bookingForm.timeSlot ? C.bg : "rgba(0,0,0,.08)", color: bookingForm.date && bookingForm.timeSlot ? C.accent : "#bbb", cursor: bookingForm.date && bookingForm.timeSlot ? "pointer" : "default", fontWeight: 800, fontSize: 12 }}>{bookingForm.submitting ? "Booking..." : (t.community?.confirm || "Confirm Booking")}</button>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* ── Scheduled Payments ── */}
      {scheduledPayments.length > 0 && (
        <div style={sCard}>
          <span style={sLabel}>{t.scheduledPayments?.upcoming || "Upcoming Payments"}</span>
          {scheduledPayments.slice(0, 3).map(sp => {
            const ch = charges.find(c => c.id === sp.charge_id);
            return (
              <div key={sp.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0", borderBottom: "1px solid rgba(0,0,0,.04)", fontSize: 12 }}>
                <div>
                  <span style={{ fontWeight: 600 }}>{ch?.description || "Payment"}</span>
                  {sp.is_installment && <span style={{ fontSize: 10, color: C.muted }}> ({sp.installment_number}/{sp.installment_total})</span>}
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontWeight: 700 }}>{fmt(sp.amount)}</div>
                  <div style={{ fontSize: 10, color: C.muted }}>{fmtD(sp.scheduled_date)}</div>
                </div>
              </div>
            );
          })}
          {scheduledPayments.length > 3 && <button onClick={() => setActiveTab("payments")} style={{ width: "100%", marginTop: 8, padding: "8px", borderRadius: 6, border: "1.5px solid rgba(0,0,0,.08)", background: "transparent", cursor: "pointer", fontSize: 10, fontWeight: 600, color: C.accent }}>View all {scheduledPayments.length} scheduled</button>}
        </div>
      )}

      {/* ── Packages Awaiting Pickup ── */}
      {pendingPkgs.length > 0 && (
        <div style={{ ...sCard, borderColor: hexRgba(C.accent, .2), background: hexRgba(C.accent, .03) }}>
          <span style={sLabel}>{t.packages?.title || "Packages"}</span>
          {pendingPkgs.map(pkg => (
            <div key={pkg.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid rgba(0,0,0,.04)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.accent} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600 }}>{pkg.description || pkg.carrier}</div>
                  <div style={{ fontSize: 10, color: C.muted }}>{pkg.carrier} {"\u2014"} {pkg.locker || "Front Desk"}</div>
                </div>
              </div>
              <button onClick={() => markPackagePickedUp(pkg.id)} style={{ padding: "5px 10px", borderRadius: 6, border: "none", background: C.bg, color: C.accent, fontSize: 9, fontWeight: 700, cursor: "pointer" }}>{t.packages?.markPickedUp || "Picked Up"}</button>
            </div>
          ))}
        </div>
      )}

      {/* ── Pending Surveys ── */}
      {pendingSurveys.map(survey => (
        <div key={survey.id} style={{ ...sCard, borderColor: hexRgba(C.accent, .2), background: hexRgba(C.accent, .03) }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.accent} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/></svg>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: C.text }}>{t.surveys?.howAreThings || "How are things going?"}</div>
              <div style={{ fontSize: 10, color: C.muted }}>{survey.type === "move_in" ? (t.surveys?.moveInDesc || "You've been here a month!") : (t.surveys?.renewalDesc || "Help us improve your experience.")}</div>
            </div>
          </div>
          {activeSurvey !== survey.id ? (
            <button onClick={() => setActiveSurvey(survey.id)} style={{ width: "100%", padding: "10px", borderRadius: 8, border: "none", background: C.bg, color: C.accent, cursor: "pointer", fontWeight: 800, fontSize: 12 }}>{survey.title || (t.surveys?.moveInSurvey || "Take Survey")}</button>
          ) : (
            <div style={{ padding: 14, background: "#faf9f7", borderRadius: 10, border: "1px solid rgba(0,0,0,.06)" }}>
              <div style={{ marginBottom: 12 }}>
                <label style={{ fontSize: 10, fontWeight: 700, color: C.muted, display: "block", marginBottom: 6 }}>{t.surveys?.overall || "Overall Satisfaction"}</label>
                <div style={{ display: "flex", gap: 4 }}>
                  {[1, 2, 3, 4, 5].map(star => (
                    <button key={star} onClick={() => setSurveyForm(p => ({ ...p, rating: star }))} style={{ background: "none", border: "none", cursor: "pointer", padding: 2 }}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill={surveyForm.rating >= star ? C.accent : "none"} stroke={surveyForm.rating >= star ? C.accent : "#ccc"} strokeWidth="1.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                    </button>
                  ))}
                  {surveyForm.rating > 0 && <span style={{ fontSize: 11, color: C.accent, fontWeight: 700, marginLeft: 4, alignSelf: "center" }}>{surveyForm.rating}/5</span>}
                </div>
              </div>
              <div style={{ marginBottom: 12 }}>
                <label style={{ fontSize: 10, fontWeight: 700, color: C.muted, display: "block", marginBottom: 6 }}>{t.surveys?.wouldRecommend || "Would you recommend?"}</label>
                <div style={{ display: "flex", gap: 6 }}>
                  {[["yes", C.green], ["maybe", C.accent], ["no", C.red]].map(([val, color]) => (
                    <button key={val} onClick={() => setSurveyForm(p => ({ ...p, recommend: val }))} style={{ flex: 1, padding: "8px", borderRadius: 8, border: "1.5px solid " + (surveyForm.recommend === val ? color : "rgba(0,0,0,.1)"), background: surveyForm.recommend === val ? color + "12" : "#fff", cursor: "pointer", fontSize: 11, fontWeight: surveyForm.recommend === val ? 700 : 500, color: surveyForm.recommend === val ? color : "#999" }}>{t.surveys?.[val] || val}</button>
                  ))}
                </div>
              </div>
              <div style={{ marginBottom: 8 }}>
                <label style={{ fontSize: 10, fontWeight: 700, color: C.muted, display: "block", marginBottom: 4 }}>{t.surveys?.whatDoYouLove || "What do you love?"}</label>
                <textarea value={surveyForm.love} onChange={e => setSurveyForm(p => ({ ...p, love: e.target.value }))} rows={2} style={{ width: "100%", padding: "8px 10px", borderRadius: 6, border: "1.5px solid rgba(0,0,0,.1)", fontSize: 11, resize: "vertical" }} />
              </div>
              <div style={{ marginBottom: 10 }}>
                <label style={{ fontSize: 10, fontWeight: 700, color: C.muted, display: "block", marginBottom: 4 }}>{t.surveys?.whatCouldImprove || "What could we improve?"}</label>
                <textarea value={surveyForm.improve} onChange={e => setSurveyForm(p => ({ ...p, improve: e.target.value }))} rows={2} style={{ width: "100%", padding: "8px 10px", borderRadius: 6, border: "1.5px solid rgba(0,0,0,.1)", fontSize: 11, resize: "vertical" }} />
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => setActiveSurvey(null)} style={{ flex: 1, padding: "10px", borderRadius: 8, border: "1.5px solid rgba(0,0,0,.1)", background: "#fff", cursor: "pointer", fontWeight: 600, fontSize: 12 }}>{t.common.cancel}</button>
                <button onClick={() => submitSurvey(survey.id)} disabled={!surveyForm.rating || surveyForm.submitting} style={{ flex: 2, padding: "10px", borderRadius: 8, border: "none", background: surveyForm.rating ? C.bg : "rgba(0,0,0,.08)", color: surveyForm.rating ? C.accent : "#bbb", cursor: surveyForm.rating ? "pointer" : "default", fontWeight: 800, fontSize: 12 }}>{surveyForm.submitting ? (t.surveys?.submitting || "Submitting...") : (t.surveys?.submit || "Submit")}</button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
