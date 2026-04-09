"use client";
import { hexRgba, fmt, fmtD, daysLeft, esc, sCard, sLabel, sRow } from "./PortalShared";
import SignatureCanvas from "./SignatureCanvas";

export default function LeaseTab({
  tenant, C, t, pm, pmSettings, user,
  dl, charges, leaseId, leaseData, showFullLease, setShowFullLease,
  renewalFlow, setRenewalFlow, submitRenewalCounter, acceptRenewalOffer,
  setRenewalModal,
  noticeForm, setNoticeForm, submitNotice, getTerminationDetails,
  inspection, setInspection, INSPECTION_ROOMS, startInspection, submitInspection,
  documents, setDocuments, docRequests, setDocRequests, docUpload, setDocUpload, uploadDocument, deleteDocument,
  insurance, insuranceForm, setInsuranceForm, submitInsurance,
  guests, guestForm, setGuestForm, registerGuest, cancelGuest,
  supabase,
}) {
  return (
    <div style={{ animation: "fadeIn .2s" }}>
      <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 16 }}>{t.lease.title}</h2>

      {/* Summary Card */}
      <div style={sCard}>
        <span style={sLabel}>{t.lease.summary}</span>
        {[[t.home.property, tenant?.property?.name], [t.home.room, tenant?.room?.name], [t.home.monthlyRent, fmt(tenant?.rent)], [t.lease.securityDeposit, fmt(tenant?.security_deposit)], [t.home.moveIn, fmtD(tenant?.move_in)], [t.home.leaseEnd, fmtD(tenant?.lease_end)], [t.lease.signed, tenant?.lease_signed_at ? new Date(tenant.lease_signed_at).toLocaleDateString() : null]].filter(([, v]) => v).map(([label, val]) => (
          <div key={label} style={sRow}><span style={{ color: C.muted }}>{label}</span><span style={{ fontWeight: 700 }}>{val}</span></div>
        ))}
        {leaseData?.landlordSignedAt && <div style={{ ...sRow, borderBottom: "none" }}><span style={{ color: C.muted }}>{t.lease.pmSigned}</span><span style={{ fontWeight: 600, color: C.green }}>{new Date(leaseData.landlordSignedAt).toLocaleDateString()}</span></div>}
        {leaseData?.tenantSignedAt && <div style={{ ...sRow, borderBottom: "none" }}><span style={{ color: C.muted }}>{t.lease.tenantSigned}</span><span style={{ fontWeight: 600, color: C.green }}>{new Date(leaseData.tenantSignedAt).toLocaleDateString()}</span></div>}
        {/* Key clauses in plain English */}
        {leaseData?.sections?.length > 0 && (() => {
          const clauses = [];
          const findSection = (keyword) => leaseData.sections.find(s => (s.title || "").toLowerCase().includes(keyword));
          const petSec = findSection("pet");
          const guestSec = findSection("guest");
          const quietSec = findSection("quiet");
          const smokingSec = findSection("smoking");
          const parkingSec = findSection("parking");
          if (petSec) clauses.push({ label: "Pets", value: (petSec.content || "").toLowerCase().includes("no pet") ? "Not allowed" : "See lease terms" });
          if (guestSec) clauses.push({ label: "Guests", value: "Max 3 consecutive nights without approval" });
          if (quietSec) clauses.push({ label: "Quiet Hours", value: "10pm\u20137am weekdays, 11pm\u201310am weekends" });
          if (smokingSec) clauses.push({ label: "Smoking", value: "Not allowed on premises" });
          if (parkingSec) clauses.push({ label: "Parking", value: leaseData.PARKING_SPACE || "See lease terms" });
          if (clauses.length === 0) return null;
          return (
            <div style={{ marginTop: 10, paddingTop: 10, borderTop: "1px solid rgba(0,0,0,.06)" }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: .5, marginBottom: 6 }}>Key Terms</div>
              {clauses.map(c => (
                <div key={c.label} style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", fontSize: 11 }}>
                  <span style={{ color: C.muted }}>{c.label}</span>
                  <span style={{ fontWeight: 600, color: C.text }}>{c.value}</span>
                </div>
              ))}
            </div>
          );
        })()}
        <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
          {leaseData?.sections?.length > 0 && (
            <button onClick={() => setShowFullLease(!showFullLease)} style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "12px", borderRadius: 10, border: "1.5px solid rgba(0,0,0,.1)", background: "#fff", fontWeight: 700, fontSize: 13, cursor: "pointer", color: C.text }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              {showFullLease ? t.lease.hideFull : t.lease.viewFull}
            </button>
          )}
          {leaseId && (
            <a href={"/api/generate-lease-pdf?id=" + leaseId} target="_blank" rel="noreferrer" style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "12px", borderRadius: 10, border: "none", background: C.bg, color: C.accent, fontWeight: 800, fontSize: 13, cursor: "pointer", textDecoration: "none" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              {t.lease.downloadPdf}
            </a>
          )}
        </div>
      </div>

      {/* Full Lease Preview */}
      {showFullLease && leaseData?.sections && (
        <div style={{ ...sCard, marginTop: 12, padding: 0 }}>
          <div style={{ background: C.bg, borderRadius: "14px 14px 0 0", padding: "20px 24px", textAlign: "center" }}>
            <div style={{ fontFamily: "Georgia,serif", fontSize: 18, color: C.accent, fontWeight: 700 }}>{pm.company_name}</div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,.4)", marginTop: 4, textTransform: "uppercase", letterSpacing: 1 }}>{t.lease.leaseAgreement}</div>
          </div>
          <div style={{ display: "flex", gap: 12, padding: "16px 20px", borderBottom: "1px solid rgba(0,0,0,.06)" }}>
            <div style={{ flex: 1, padding: 10, background: "#faf9f7", borderRadius: 6, border: "1px solid rgba(0,0,0,.05)" }}>
              <div style={{ fontSize: 9, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: .5, marginBottom: 3 }}>{t.lease.propertyManager}</div>
              <div style={{ fontSize: 12, fontWeight: 700 }}>{leaseData.landlordName || pm.company_name}</div>
            </div>
            <div style={{ flex: 1, padding: 10, background: "#faf9f7", borderRadius: 6, border: "1px solid rgba(0,0,0,.05)" }}>
              <div style={{ fontSize: 9, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: .5, marginBottom: 3 }}>{t.lease.tenant}</div>
              <div style={{ fontSize: 12, fontWeight: 700 }}>{leaseData.tenantName || tenant?.name}</div>
            </div>
          </div>
          <div style={{ padding: "16px 20px" }}>
            <style>{`.lease-content ul,.lease-content ol{padding-left:24px;margin:6px 0} .lease-content li{margin:3px 0;line-height:1.7} .lease-content p{margin:4px 0}`}</style>
            {(leaseData.sections || []).filter(s => s.active !== false).map((sec, i) => (
              <div key={sec.id || i} style={{ marginBottom: 20 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8, paddingBottom: 6, borderBottom: "1px solid rgba(0,0,0,.06)" }}>
                  <div style={{ width: 22, height: 22, borderRadius: "50%", background: C.bg, color: C.accent, fontSize: 10, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{i + 1}</div>
                  <div style={{ fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: .3 }}>{sec.title}</div>
                </div>
                <div className="lease-content" style={{ fontSize: 12, lineHeight: 1.8, color: C.muted, paddingLeft: 32 }} dangerouslySetInnerHTML={{ __html: sec.content || "" }} />
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: 16, padding: "16px 20px", borderTop: "2px solid rgba(0,0,0,.08)" }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 9, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: .5, marginBottom: 6 }}>{t.lease.propertyManager}</div>
              {leaseData.landlordSig ? (
                <div><img src={leaseData.landlordSig} alt="PM signature" style={{ height: 40, maxWidth: 160, objectFit: "contain", display: "block", marginBottom: 4 }} /><div style={{ fontSize: 11, fontWeight: 600 }}>{leaseData.landlordName}</div>{leaseData.landlordSignedAt && <div style={{ fontSize: 10, color: C.muted }}>{t.lease.signed} {new Date(leaseData.landlordSignedAt).toLocaleDateString()}</div>}</div>
              ) : <div style={{ borderBottom: "1px solid rgba(0,0,0,.2)", height: 40, marginBottom: 4 }} />}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 9, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: .5, marginBottom: 6 }}>{t.lease.tenant}</div>
              {leaseData.tenantSig ? (
                <div><img src={leaseData.tenantSig} alt="Tenant signature" style={{ height: 40, maxWidth: 160, objectFit: "contain", display: "block", marginBottom: 4 }} /><div style={{ fontSize: 11, fontWeight: 600 }}>{leaseData.tenantName || tenant?.name}</div>{leaseData.tenantSignedAt && <div style={{ fontSize: 10, color: C.muted }}>{t.lease.signed} {new Date(leaseData.tenantSignedAt).toLocaleDateString()}</div>}</div>
              ) : <div style={{ borderBottom: "1px solid rgba(0,0,0,.2)", height: 40, marginBottom: 4 }} />}
            </div>
          </div>
        </div>
      )}

      {/* Addendum History */}
      {leaseData?.addendums?.length > 0 && (
        <div style={{ ...sCard, marginTop: 12 }}>
          <span style={sLabel}>Addendums</span>
          {leaseData.addendums.map((add, i) => (
            <div key={add.id || i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid rgba(0,0,0,.04)" }}>
              <div>
                <div style={{ fontSize: 12, fontWeight: 600 }}>{add.title || add.type || "Addendum"}</div>
                <div style={{ fontSize: 10, color: C.muted }}>{add.signed_at ? "Signed " + new Date(add.signed_at).toLocaleDateString() : add.created_at ? new Date(add.created_at).toLocaleDateString() : ""}</div>
              </div>
              <span style={{ fontSize: 10, padding: "3px 8px", borderRadius: 100, fontWeight: 700, background: add.signed_at ? hexRgba(C.green, .1) : hexRgba(C.accent, .1), color: add.signed_at ? C.green : C.accent }}>
                {add.signed_at ? "Signed" : "Pending"}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Lease expiration warning + renewal */}
      {dl !== null && dl <= 90 && dl > 0 && !renewalFlow.status && (
        <div style={{ background: dl <= 30 ? hexRgba(C.red, .06) : hexRgba(C.accent, .06), border: `1px solid ${dl <= 30 ? hexRgba(C.red, .2) : hexRgba(C.accent, .2)}`, borderRadius: 12, padding: 16, marginTop: 12 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: dl <= 30 ? C.red : C.accent, marginBottom: 4 }}>{t.lease.expiresIn} {dl} {t.home.days}</div>
          <div style={{ fontSize: 12, color: C.muted, marginBottom: 12 }}>{t.common.contact} {pm.company_name}{pm.phone ? " " + t.common.at + " " + pm.phone : ""} {t.lease.contactRenewal}</div>
          <button onClick={() => setRenewalModal({ open: true, choice: null, submitting: false, submitted: false })} style={{ width: "100%", padding: "11px", borderRadius: 8, border: "none", background: C.bg, color: C.accent, fontWeight: 800, fontSize: 13, cursor: "pointer" }}>
            {t.lease.viewRenewalOptions}
          </button>
        </div>
      )}

      {/* Enhanced Renewal Flow */}
      {renewalFlow.status && (
        <div style={{ ...sCard, marginTop: 12, borderColor: renewalFlow.status === "accepted" ? hexRgba(C.green, .25) : hexRgba(C.accent, .2) }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <span style={sLabel}>{t.lease?.renewalStatus || "Renewal Status"}</span>
            <span style={{ fontSize: 10, padding: "3px 10px", borderRadius: 100, fontWeight: 700,
              background: renewalFlow.status === "accepted" ? hexRgba(C.green, .12) : renewalFlow.status === "pm_offered" || renewalFlow.status === "pm_countered" ? hexRgba(C.accent, .12) : "rgba(0,0,0,.06)",
              color: renewalFlow.status === "accepted" ? C.green : renewalFlow.status === "pm_offered" || renewalFlow.status === "pm_countered" ? C.accent : C.muted
            }}>
              {renewalFlow.status === "pending" && (t.lease?.renewalPending || "Pending Review")}
              {renewalFlow.status === "pm_offered" && (t.lease?.renewalCountered || "PM Offer")}
              {renewalFlow.status === "pm_countered" && (t.lease?.renewalCountered || "Counter-Offer")}
              {renewalFlow.status === "tenant_countered" && (t.lease?.yourCounter || "Your Counter-Offer")}
              {renewalFlow.status === "accepted" && (t.lease?.renewalAccepted || "Accepted")}
            </span>
          </div>

          {renewalFlow.status === "pending" && (
            <div style={{ fontSize: 12, color: C.muted, lineHeight: 1.6 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: "inline", verticalAlign: "middle", marginRight: 6 }}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              {t.lease?.renewalPendingDesc || "Your renewal request is being reviewed. We'll notify you when a decision is made."}
            </div>
          )}

          {(renewalFlow.status === "pm_offered" || renewalFlow.status === "pm_countered") && renewalFlow.pmOffer && (
            <div>
              <div style={{ fontSize: 12, color: C.muted, marginBottom: 12, lineHeight: 1.6 }}>{t.lease?.pmOfferedTerms || "Your property manager has offered the following renewal terms:"}</div>
              <div style={{ background: hexRgba(C.accent, .06), border: "1px solid " + hexRgba(C.accent, .15), borderRadius: 10, padding: 14, marginBottom: 14 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                  <div>
                    <div style={{ fontSize: 10, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: .5 }}>Rent</div>
                    <div style={{ fontSize: 18, fontWeight: 800, color: C.text }}>{fmt(renewalFlow.pmOffer.rent)}<span style={{ fontSize: 11, fontWeight: 600, color: C.muted }}>/mo</span></div>
                    {renewalFlow.pmOffer.rent !== tenant?.rent && (
                      <div style={{ fontSize: 10, color: renewalFlow.pmOffer.rent > tenant?.rent ? C.red : C.green, fontWeight: 600, marginTop: 2 }}>
                        {renewalFlow.pmOffer.rent > tenant?.rent ? "+" : ""}{fmt(renewalFlow.pmOffer.rent - tenant?.rent)} vs current
                      </div>
                    )}
                  </div>
                  <div>
                    <div style={{ fontSize: 10, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: .5 }}>Term</div>
                    <div style={{ fontSize: 18, fontWeight: 800, color: C.text }}>{renewalFlow.pmOffer.term}<span style={{ fontSize: 11, fontWeight: 600, color: C.muted }}> months</span></div>
                    {renewalFlow.pmOffer.leaseEnd && <div style={{ fontSize: 10, color: C.muted, marginTop: 2 }}>Through {fmtD(renewalFlow.pmOffer.leaseEnd)}</div>}
                  </div>
                </div>
                {renewalFlow.pmOffer.note && <div style={{ fontSize: 11, color: C.muted, marginTop: 10, paddingTop: 8, borderTop: "1px solid rgba(0,0,0,.06)", fontStyle: "italic" }}>"{renewalFlow.pmOffer.note}"</div>}
              </div>

              {!renewalFlow.showCounter && (
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={() => setRenewalFlow(p => ({ ...p, showCounter: true, counterForm: { rent: String(renewalFlow.pmOffer.rent || tenant?.rent || ""), term: String(renewalFlow.pmOffer.term || 12), note: "" } }))} style={{ flex: 1, padding: "11px", borderRadius: 8, border: "1.5px solid rgba(0,0,0,.1)", background: "#fff", cursor: "pointer", fontWeight: 600, fontSize: 12, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                    {t.lease?.counterOffer || "Counter-Offer"}
                  </button>
                  <button onClick={acceptRenewalOffer} disabled={renewalFlow.signing} style={{ flex: 2, padding: "11px", borderRadius: 8, border: "none", background: C.green, color: "#fff", cursor: "pointer", fontWeight: 800, fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                    {renewalFlow.signing ? "Processing..." : t.lease?.acceptOffer || "Accept Offer"}
                  </button>
                </div>
              )}

              {renewalFlow.showCounter && (
                <div style={{ background: "#faf9f7", borderRadius: 10, padding: 14, border: "1px solid rgba(0,0,0,.06)" }}>
                  <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 10 }}>{t.lease?.counterOffer || "Counter-Offer"}</div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 8 }}>
                    <div>
                      <label style={{ fontSize: 10, fontWeight: 700, color: C.muted, display: "block", marginBottom: 4 }}>{t.lease?.counterRent || "Proposed Rent"}</label>
                      <input type="number" value={renewalFlow.counterForm.rent} onChange={e => setRenewalFlow(p => ({ ...p, counterForm: { ...p.counterForm, rent: e.target.value } }))} style={{ width: "100%", padding: "8px", borderRadius: 6, border: "1.5px solid rgba(0,0,0,.1)", fontSize: 13 }} />
                    </div>
                    <div>
                      <label style={{ fontSize: 10, fontWeight: 700, color: C.muted, display: "block", marginBottom: 4 }}>{t.lease?.counterTerm || "Term (months)"}</label>
                      <select value={renewalFlow.counterForm.term} onChange={e => setRenewalFlow(p => ({ ...p, counterForm: { ...p.counterForm, term: e.target.value } }))} style={{ width: "100%", padding: "8px", borderRadius: 6, border: "1.5px solid rgba(0,0,0,.1)", fontSize: 12 }}>
                        {[3, 6, 9, 12, 18, 24].map(m => <option key={m} value={m}>{m} months</option>)}
                      </select>
                    </div>
                  </div>
                  <div style={{ marginBottom: 10 }}>
                    <label style={{ fontSize: 10, fontWeight: 700, color: C.muted, display: "block", marginBottom: 4 }}>{t.lease?.counterNote || "Note (optional)"}</label>
                    <textarea value={renewalFlow.counterForm.note} onChange={e => setRenewalFlow(p => ({ ...p, counterForm: { ...p.counterForm, note: e.target.value } }))} placeholder="e.g. I'd prefer a longer term at a lower rate..." rows={2} style={{ width: "100%", padding: "8px", borderRadius: 6, border: "1.5px solid rgba(0,0,0,.1)", fontSize: 12, resize: "vertical" }} />
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button onClick={() => setRenewalFlow(p => ({ ...p, showCounter: false }))} style={{ flex: 1, padding: "10px", borderRadius: 8, border: "1.5px solid rgba(0,0,0,.1)", background: "#fff", cursor: "pointer", fontWeight: 600, fontSize: 12 }}>{t.common.cancel}</button>
                    <button onClick={submitRenewalCounter} style={{ flex: 2, padding: "10px", borderRadius: 8, border: "none", background: C.bg, color: C.accent, cursor: "pointer", fontWeight: 800, fontSize: 12 }}>{t.lease?.submitCounter || "Submit Counter-Offer"}</button>
                  </div>
                </div>
              )}
            </div>
          )}

          {renewalFlow.status === "tenant_countered" && (
            <div>
              <div style={{ fontSize: 12, color: C.muted, lineHeight: 1.6, marginBottom: 10 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: "inline", verticalAlign: "middle", marginRight: 6 }}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                {t.lease?.awaitingPmResponse || "Awaiting PM response to your counter-offer."}
              </div>
              {renewalFlow.tenant_counter && (
                <div style={{ background: "rgba(0,0,0,.02)", borderRadius: 8, padding: 12, fontSize: 11 }}>
                  <div style={{ fontWeight: 700, marginBottom: 4 }}>{t.lease?.yourCounter || "Your Counter-Offer"}:</div>
                  <div>{fmt(renewalFlow.tenant_counter.rent)}/mo for {renewalFlow.tenant_counter.term} months</div>
                  {renewalFlow.tenant_counter.note && <div style={{ color: C.muted, fontStyle: "italic", marginTop: 4 }}>"{renewalFlow.tenant_counter.note}"</div>}
                </div>
              )}
            </div>
          )}

          {renewalFlow.status === "accepted" && (
            <div style={{ textAlign: "center" }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={C.green} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: 8 }}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
              <div style={{ fontSize: 15, fontWeight: 800, color: C.green, marginBottom: 4 }}>{t.lease?.renewalConfirmed || "Your lease renewal has been confirmed."}</div>
              {renewalFlow.pmOffer?.leaseEnd && <div style={{ fontSize: 12, color: C.muted }}>{t.lease?.newLeaseEnd || "New Lease End"}: <strong>{fmtD(renewalFlow.pmOffer.leaseEnd)}</strong> at <strong>{fmt(renewalFlow.pmOffer.rent || tenant?.rent)}</strong>/mo</div>}
            </div>
          )}
        </div>
      )}

      {/* House Rules */}
      {(pmSettings?.houseRules || tenant?.property?.house_rules || []).length > 0 && (
        <div style={{ ...sCard, marginTop: 12 }}>
          <span style={sLabel}>{t.account.houseRules}</span>
          {(pmSettings?.houseRules || tenant?.property?.house_rules || []).map((rule, i) => (
            <div key={i} style={{ display: "flex", gap: 10, padding: "7px 0", borderBottom: "1px solid rgba(0,0,0,.04)", fontSize: 12, color: C.muted }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.green} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 1 }}><polyline points="20 6 9 17 4 12"/></svg>
              {rule}
            </div>
          ))}
        </div>
      )}

      {/* Notice to Vacate */}
      <div style={{ ...sCard, marginTop: 12 }}>
        <span style={sLabel}>{t.lease.noticeToVacate}</span>
        {noticeForm.submitted ? (
          <div style={{ background: hexRgba(C.green, .08), border: `1px solid ${hexRgba(C.green, .2)}`, borderRadius: 8, padding: "12px 14px", fontSize: 12, color: C.green, fontWeight: 600 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: "inline", verticalAlign: "middle", marginRight: 6 }}><path d="M20 6L9 17l-5-5"/></svg>
            {t.lease.noticeSubmitted} {pm.company_name} {t.lease.moveOutDetails}
          </div>
        ) : !noticeForm.showForm ? (
          <div>
            <div style={{ fontSize: 12, color: C.muted, marginBottom: 10, lineHeight: 1.6 }}>{t.lease.noticeDesc}</div>
            <button onClick={() => setNoticeForm(p => ({ ...p, showForm: true, step: 1 }))} style={{ width: "100%", padding: "11px", borderRadius: 10, border: `1.5px solid ${hexRgba(C.red, .2)}`, background: hexRgba(C.red, .04), color: C.red, fontWeight: 700, fontSize: 13, cursor: "pointer" }}>{t.lease.submitNotice}</button>
          </div>
        ) : (
          <div>
            <div style={{ display: "flex", gap: 4, marginBottom: 16 }}>
              {[1, 2, 3].map(s => <div key={s} style={{ flex: 1, height: 3, borderRadius: 2, background: noticeForm.step >= s ? C.red : "rgba(0,0,0,.08)", transition: "background .2s" }} />)}
            </div>
            {noticeForm.step === 1 && (
              <div>
                <div style={{ marginBottom: 12 }}>
                  <label style={{ fontSize: 11, fontWeight: 700, color: C.muted, display: "block", marginBottom: 5 }}>{t.lease.moveOutDate}</label>
                  <input type="date" value={noticeForm.moveOutDate} onChange={e => setNoticeForm(p => ({ ...p, moveOutDate: e.target.value }))} min={new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0]} style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1.5px solid rgba(0,0,0,.1)", fontSize: 13 }} />
                  <div style={{ fontSize: 10, color: C.muted, marginTop: 4 }}>{t.lease.moveOutMin}</div>
                </div>
                <div style={{ marginBottom: 12 }}>
                  <label style={{ fontSize: 11, fontWeight: 700, color: C.muted, display: "block", marginBottom: 5 }}>{t.lease.reason}</label>
                  <textarea value={noticeForm.reason} onChange={e => setNoticeForm(p => ({ ...p, reason: e.target.value }))} placeholder="e.g. Relocating for work, end of internship..." rows={2} style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1.5px solid rgba(0,0,0,.1)", fontSize: 13, resize: "vertical" }} />
                </div>
                {noticeForm.moveOutDate && (() => {
                  const td = getTerminationDetails(noticeForm.moveOutDate);
                  if (!td?.isEarly) return null;
                  return (
                    <div style={{ background: hexRgba(C.red, .04), border: `1px solid ${hexRgba(C.red, .15)}`, borderRadius: 8, padding: 12, marginBottom: 12 }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: C.red, marginBottom: 6 }}>Early Lease Termination</div>
                      <div style={{ fontSize: 11, color: C.muted, lineHeight: 1.6 }}>Your lease runs until <strong>{fmtD(td.leaseEnd)}</strong>. Moving out early means:</div>
                      <div style={{ marginTop: 8, fontSize: 11 }}>
                        {[["Months remaining", td.remainingMonths], ["Rent obligation", fmt(td.remainingRent)], ["Current unpaid balance", fmt(td.unpaidCharges)]].map(([k, v]) => (
                          <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", borderBottom: "1px solid rgba(0,0,0,.04)" }}><span style={{ color: C.muted }}>{k}</span><span style={{ fontWeight: 700, color: C.red }}>{v}</span></div>
                        ))}
                      </div>
                      <div style={{ fontSize: 10, color: C.red, fontWeight: 600, marginTop: 8 }}>Security deposit may be forfeited per lease terms.</div>
                    </div>
                  );
                })()}
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={() => setNoticeForm(p => ({ ...p, showForm: false, step: 1 }))} style={{ flex: 1, padding: "11px", borderRadius: 10, border: "1.5px solid rgba(0,0,0,.1)", background: "#fff", cursor: "pointer", fontWeight: 600, fontSize: 13 }}>{t.common.cancel}</button>
                  <button onClick={() => { if (noticeForm.moveOutDate) setNoticeForm(p => ({ ...p, step: 2 })); }} disabled={!noticeForm.moveOutDate} style={{ flex: 2, padding: "11px", borderRadius: 10, border: "none", background: noticeForm.moveOutDate ? C.bg : "rgba(0,0,0,.08)", color: noticeForm.moveOutDate ? C.accent : "#bbb", cursor: noticeForm.moveOutDate ? "pointer" : "default", fontWeight: 800, fontSize: 13 }}>Continue</button>
                </div>
              </div>
            )}
            {noticeForm.step === 2 && (
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 8 }}>Sign Your Notice</div>
                <div style={{ fontSize: 11, color: C.muted, lineHeight: 1.6, marginBottom: 12 }}>Draw your signature below to confirm this notice. This is a legally binding document.</div>
                <SignatureCanvas onSave={(sig) => setNoticeForm(p => ({ ...p, signature: sig, step: 3 }))} onCancel={() => setNoticeForm(p => ({ ...p, step: 1 }))} C={C} />
              </div>
            )}
            {noticeForm.step === 3 && (
              <div>
                <div style={{ background: hexRgba(C.red, .04), border: `2px solid ${hexRgba(C.red, .2)}`, borderRadius: 10, padding: 16, marginBottom: 14 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={C.red} strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                    <span style={{ fontSize: 14, fontWeight: 800, color: C.red }}>Legal Notice</span>
                  </div>
                  <div style={{ fontSize: 11, color: C.muted, lineHeight: 1.7 }}>
                    By submitting this notice, you are providing <strong>30 days written notice</strong> of your intent to vacate <strong>{tenant?.property?.name} {"\u2014"} {tenant?.room?.name}</strong> on <strong>{fmtD(noticeForm.moveOutDate)}</strong>.
                    {(() => { const td = getTerminationDetails(noticeForm.moveOutDate); return td?.isEarly ? " This is an early termination. You may be responsible for " + fmt(td.remainingRent) + " in remaining rent and your security deposit of " + fmt(tenant?.security_deposit) + " may be forfeited." : ""; })()}
                    {" "}This action cannot be undone.
                  </div>
                </div>
                <div style={{ fontSize: 11, color: C.muted, marginBottom: 6 }}>Your signature:</div>
                {noticeForm.signature && <img src={noticeForm.signature} alt="Signature" style={{ height: 50, maxWidth: 200, objectFit: "contain", display: "block", marginBottom: 12, border: "1px solid rgba(0,0,0,.08)", borderRadius: 6, padding: 4 }} />}
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={() => setNoticeForm(p => ({ ...p, step: 2, signature: null }))} style={{ flex: 1, padding: "11px", borderRadius: 10, border: "1.5px solid rgba(0,0,0,.1)", background: "#fff", cursor: "pointer", fontWeight: 600, fontSize: 13 }}>{t.lease.goBack}</button>
                  <button onClick={submitNotice} disabled={noticeForm.submitting} style={{ flex: 2, padding: "11px", borderRadius: 10, border: "none", background: C.red, color: "#fff", cursor: "pointer", fontWeight: 800, fontSize: 13 }}>
                    {noticeForm.submitting ? "Submitting..." : "I Understand \u2014 Submit Notice"}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Proof of Residency */}
      <div style={{ ...sCard, marginTop: 12 }}>
        <span style={sLabel}>{t.lease.proofOfResidency}</span>
        <div style={{ fontSize: 12, color: C.muted, marginBottom: 10, lineHeight: 1.6 }}>{t.lease.proofDesc}</div>
        <button onClick={() => {
          const today = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
          const w = window.open("","_blank");
          w.document.write(`<!DOCTYPE html><html><head><title>Proof of Residency \u2014 ${esc(tenant?.name)}</title><style>body{font-family:Georgia,serif;max-width:620px;margin:50px auto;padding:0 32px;color:#1a1714;line-height:1.8} .header{text-align:center;border-bottom:2px solid #1a1714;padding-bottom:16px;margin-bottom:32px} .header h1{font-size:18px;font-weight:700;margin:0 0 4px} .title{font-size:15px;font-weight:800;letter-spacing:2px;text-transform:uppercase;text-align:center;margin-bottom:24px} .date{font-size:13px;color:#666;margin-bottom:24px} .body{font-size:14px;margin-bottom:32px;text-align:justify} .closing{font-size:14px;margin-top:40px} .closing .name{font-weight:700;margin-top:24px} .footer{margin-top:48px;padding-top:16px;border-top:1px solid #ddd;font-size:11px;color:#999;text-align:center} @media print{body{margin:20px}}</style></head><body><div class="header"><h1>${esc(pm?.company_name)}</h1></div><div class="title">Proof of Residency</div><div class="date">${today}</div><div class="body"><p>To Whom It May Concern,</p><p>This letter confirms that <strong>${esc(tenant?.name)}</strong> currently resides at <strong>${esc(tenant?.property)}, ${esc(tenant?.room)}</strong>. They have been a resident since <strong>${esc(fmtD(tenant?.move_in))}</strong>. Their monthly rent is <strong>${esc(fmt(tenant?.rent))}</strong>.</p><p>If you require any additional information, please contact ${esc(pm?.company_name)} at ${esc(pm?.phone)}${pmSettings?.email ? " or " + esc(pmSettings.email) : ""}.</p></div><div class="closing"><p>Sincerely,</p><p class="name">${esc(pm?.company_name)}</p></div><div class="footer">${esc(pm?.company_name)}${pm?.phone ? " &middot; " + esc(pm.phone) : ""}${pmSettings?.email ? " &middot; " + esc(pmSettings.email) : ""}</div></body></html>`);
          w.document.close();w.print();
        }} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "11px", borderRadius: 10, border: `1.5px solid ${hexRgba(C.accent, .2)}`, background: hexRgba(C.accent, .04), color: C.accent, fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
          {t.lease.generateLetter}
        </button>
      </div>

      {/* Inspection - keeping this section short by noting it's included but identical to original */}
      <div style={{ ...sCard, marginTop: 12 }}>
        <span style={sLabel}>{t.inspection?.title || "Move-In / Move-Out Inspection"}</span>
        {inspection.existing && !inspection.type && (
          <div style={{ background: hexRgba(C.green, .06), border: "1px solid " + hexRgba(C.green, .2), borderRadius: 8, padding: "10px 14px", fontSize: 12, color: C.green, fontWeight: 600, marginBottom: 10 }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: "inline", verticalAlign: "middle", marginRight: 4 }}><polyline points="20 6 9 17 4 12"/></svg>
            {inspection.existing.type === "move_in" ? (t.inspection?.moveInInspection || "Move-In Inspection") : (t.inspection?.moveOutInspection || "Move-Out Inspection")} {"\u2014"} {t.inspection?.completed || "Completed"} {fmtD(inspection.existing.submitted_at?.split("T")[0])}
          </div>
        )}
        {!inspection.type && !inspection.submitted && (
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => startInspection("move_in")} style={{ flex: 1, padding: "11px", borderRadius: 8, border: "1.5px solid rgba(0,0,0,.1)", background: "#fff", cursor: "pointer", fontWeight: 600, fontSize: 12, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
              {t.inspection?.moveInInspection || "Move-In Inspection"}
            </button>
            <button onClick={() => startInspection("move_out")} style={{ flex: 1, padding: "11px", borderRadius: 8, border: "1.5px solid " + hexRgba(C.red, .2), background: hexRgba(C.red, .04), cursor: "pointer", fontWeight: 600, fontSize: 12, color: C.red, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
              {t.inspection?.moveOutInspection || "Move-Out Inspection"}
            </button>
          </div>
        )}
        {inspection.type && !inspection.submitted && (
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 8 }}>{inspection.type === "move_in" ? (t.inspection?.moveInInspection || "Move-In") : (t.inspection?.moveOutInspection || "Move-Out")} {"\u2014"} {t.inspection?.roomByRoom || "Room-by-Room"}</div>
            <div style={{ display: "flex", gap: 3, marginBottom: 14 }}>
              {inspection.rooms.map((_, i) => <div key={i} style={{ flex: 1, height: 3, borderRadius: 2, background: i <= inspection.step ? C.accent : "rgba(0,0,0,.08)", transition: "background .2s" }} />)}
            </div>
            {inspection.step < inspection.rooms.length ? (() => {
              const room = inspection.rooms[inspection.step];
              return (
                <div>
                  <div style={{ fontSize: 14, fontWeight: 800, marginBottom: 10, color: C.text }}>{room.name}</div>
                  <div style={{ marginBottom: 10 }}>
                    <label style={{ fontSize: 10, fontWeight: 700, color: C.muted, display: "block", marginBottom: 5 }}>{t.inspection?.condition || "Condition"}</label>
                    <div style={{ display: "flex", gap: 6 }}>
                      {[["excellent", C.green], ["good", "#3b82f6"], ["fair", C.accent], ["poor", C.red], ["damaged", "#7c3aed"]].map(([val, color]) => (
                        <button key={val} onClick={() => setInspection(p => { const rooms = [...p.rooms]; rooms[p.step] = { ...rooms[p.step], condition: val }; return { ...p, rooms }; })} style={{ flex: 1, padding: "8px 2px", borderRadius: 8, border: "1.5px solid " + (room.condition === val ? color : "rgba(0,0,0,.1)"), background: room.condition === val ? color + "12" : "#fff", cursor: "pointer", fontSize: 9, fontWeight: room.condition === val ? 700 : 500, color: room.condition === val ? color : "#999" }}>
                          {t.inspection?.[val] || val}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div style={{ marginBottom: 10 }}>
                    <label style={{ fontSize: 10, fontWeight: 700, color: C.muted, display: "block", marginBottom: 5 }}>{t.inspection?.notes || "Notes"}</label>
                    <textarea value={room.notes} onChange={e => setInspection(p => { const rooms = [...p.rooms]; rooms[p.step] = { ...rooms[p.step], notes: e.target.value }; return { ...p, rooms }; })} placeholder="Any damage, issues, or notes..." rows={2} style={{ width: "100%", padding: "8px 10px", borderRadius: 6, border: "1.5px solid rgba(0,0,0,.1)", fontSize: 11, resize: "vertical" }} />
                  </div>
                  <div style={{ marginBottom: 12 }}>
                    <label style={{ fontSize: 10, fontWeight: 700, color: C.muted, display: "block", marginBottom: 5 }}>{t.inspection?.photos || "Photos"}</label>
                    {room.photos.length < 3 && (
                      <label style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: 6, border: "1.5px solid rgba(0,0,0,.1)", cursor: "pointer", fontSize: 10, fontWeight: 600, color: C.muted }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
                        {t.inspection?.addPhoto || "Add Photo"}
                        <input type="file" accept="image/*" style={{ display: "none" }} onChange={e => { const file = e.target.files?.[0]; if (!file) return; const reader = new FileReader(); reader.onload = (ev) => setInspection(p => { const rooms = [...p.rooms]; if (rooms[p.step].photos.length < 3) rooms[p.step] = { ...rooms[p.step], photos: [...rooms[p.step].photos, ev.target.result] }; return { ...p, rooms }; }); reader.readAsDataURL(file); e.target.value = ""; }} />
                      </label>
                    )}
                    {room.photos.length > 0 && <div style={{ display: "flex", gap: 6, marginTop: 6 }}>{room.photos.map((src, i) => <img key={i} src={src} alt="" style={{ width: 48, height: 48, objectFit: "cover", borderRadius: 6, border: "1px solid rgba(0,0,0,.08)" }} />)}</div>}
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    {inspection.step > 0 && <button onClick={() => setInspection(p => ({ ...p, step: p.step - 1 }))} style={{ flex: 1, padding: "10px", borderRadius: 8, border: "1.5px solid rgba(0,0,0,.1)", background: "#fff", cursor: "pointer", fontWeight: 600, fontSize: 12 }}>{t.inspection?.prevRoom || "Previous"}</button>}
                    <button onClick={() => setInspection(p => ({ ...p, step: p.step + 1 }))} style={{ flex: 2, padding: "10px", borderRadius: 8, border: "none", background: C.bg, color: C.accent, cursor: "pointer", fontWeight: 800, fontSize: 12 }}>
                      {inspection.step < inspection.rooms.length - 1 ? (t.inspection?.nextRoom || "Next Room") : (t.inspection?.reviewAndSign || "Review & Sign")}
                    </button>
                  </div>
                </div>
              );
            })() : (
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 10 }}>{t.inspection?.reviewAndSign || "Review & Sign"}</div>
                {inspection.rooms.map((room, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0", borderBottom: "1px solid rgba(0,0,0,.04)", fontSize: 12 }}>
                    <span style={{ fontWeight: 600 }}>{room.name}</span>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 100, fontWeight: 600, background: { excellent: hexRgba(C.green, .12), good: "#3b82f618", fair: hexRgba(C.accent, .12), poor: hexRgba(C.red, .12), damaged: "#7c3aed18" }[room.condition], color: { excellent: C.green, good: "#3b82f6", fair: C.accent, poor: C.red, damaged: "#7c3aed" }[room.condition] }}>{room.condition}</span>
                      {room.photos.length > 0 && <span style={{ fontSize: 9, color: C.muted }}>{room.photos.length} photo(s)</span>}
                      <button onClick={() => setInspection(p => ({ ...p, step: i }))} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 10, color: C.accent, fontWeight: 600 }}>Edit</button>
                    </div>
                  </div>
                ))}
                <div style={{ marginTop: 12 }}>
                  <SignatureCanvas onSave={(sig) => { setInspection(p => ({ ...p, signature: sig })); }} onCancel={() => setInspection(p => ({ ...p, type: null }))} C={C} />
                </div>
                {inspection.signature && <button onClick={submitInspection} disabled={inspection.loading} style={{ width: "100%", marginTop: 10, padding: "12px", borderRadius: 10, border: "none", background: C.bg, color: C.accent, fontWeight: 800, fontSize: 13, cursor: "pointer" }}>{inspection.loading ? "Submitting..." : t.inspection?.signInspection || "Sign Inspection"}</button>}
              </div>
            )}
          </div>
        )}
        {inspection.submitted && (
          <div style={{ textAlign: "center", padding: 16 }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={C.green} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: 8 }}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            <div style={{ fontSize: 14, fontWeight: 800, color: C.green, marginBottom: 4 }}>{t.inspection?.inspectionComplete || "Inspection Complete"}</div>
            <div style={{ fontSize: 12, color: C.muted }}>{t.inspection?.inspectionCompleteDesc || "Your inspection has been submitted."}</div>
          </div>
        )}
      </div>

      {/* Document Vault */}
      <div style={{ ...sCard, marginTop: 12 }}>
        <span style={sLabel}>{t.documents?.vault || "Document Vault"}</span>
        {docRequests.filter(r => r.status === "pending").length > 0 && (
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: C.red, textTransform: "uppercase", letterSpacing: .5, marginBottom: 6 }}>{t.documents?.requestedDocs || "Requested Documents"}</div>
            {docRequests.filter(r => r.status === "pending").map(req => {
              const isOverdue = req.deadline && new Date(req.deadline + "T00:00:00") < new Date();
              return (
                <div key={req.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 10px", borderRadius: 8, background: isOverdue ? hexRgba(C.red, .04) : hexRgba(C.accent, .04), border: "1px solid " + (isOverdue ? hexRgba(C.red, .15) : hexRgba(C.accent, .15)), marginBottom: 6 }}>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: C.text }}>{req.title || t.documents?.[req.type] || req.type}</div>
                    {req.deadline && <div style={{ fontSize: 10, color: isOverdue ? C.red : C.muted, fontWeight: isOverdue ? 700 : 400 }}>{t.documents?.deadline || "Due by"}: {fmtD(req.deadline)} {isOverdue ? "- " + (t.documents?.overdue || "OVERDUE") : ""}</div>}
                  </div>
                  <button onClick={() => setDocUpload({ open: true, type: req.type, file: null, uploading: false })} style={{ padding: "6px 12px", borderRadius: 6, border: "none", background: C.bg, color: C.accent, fontSize: 10, fontWeight: 700, cursor: "pointer" }}>{t.documents?.upload || "Upload"}</button>
                </div>
              );
            })}
          </div>
        )}
        {documents.length > 0 && documents.map(doc => (
          <div key={doc.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid rgba(0,0,0,.04)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
              <div>
                <div style={{ fontSize: 12, fontWeight: 600 }}>{doc.filename}</div>
                <div style={{ fontSize: 10, color: C.muted }}>{t.documents?.[doc.type] || doc.type} {"\u2014"} {fmtD(doc.uploaded_at?.split?.("T")?.[0] || doc.created_at?.split?.("T")?.[0])}</div>
              </div>
            </div>
            <button onClick={() => deleteDocument(doc.id)} style={{ background: "none", border: "none", cursor: "pointer", color: C.red, padding: 4, display: "flex" }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
            </button>
          </div>
        ))}
        {documents.length === 0 && !docUpload.open && <div style={{ fontSize: 12, color: "#999", marginBottom: 10 }}>{t.documents?.noDocuments || "No documents uploaded yet."}</div>}
        {!docUpload.open ? (
          <button onClick={() => setDocUpload({ open: true, type: "other", file: null, uploading: false })} style={{ width: "100%", padding: "10px", borderRadius: 8, border: "1.5px solid rgba(0,0,0,.1)", background: "#fff", cursor: "pointer", fontWeight: 600, fontSize: 12, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginTop: 8 }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
            {t.documents?.upload || "Upload Document"}
          </button>
        ) : (
          <div style={{ marginTop: 8, padding: 14, background: "#faf9f7", borderRadius: 10, border: "1px solid rgba(0,0,0,.06)" }}>
            <div style={{ marginBottom: 8 }}>
              <label style={{ fontSize: 10, fontWeight: 700, color: C.muted, display: "block", marginBottom: 4 }}>{t.documents?.fileType || "Document Type"}</label>
              <select value={docUpload.type} onChange={e => setDocUpload(p => ({ ...p, type: e.target.value }))} style={{ width: "100%", padding: "8px", borderRadius: 6, border: "1.5px solid rgba(0,0,0,.1)", fontSize: 12 }}>
                {["insurance", "petRecords", "vehicleReg", "idDocument", "employmentProof", "other"].map(type => <option key={type} value={type}>{t.documents?.[type] || type}</option>)}
              </select>
            </div>
            <div style={{ marginBottom: 10 }}>
              <label style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 8, border: "1.5px solid rgba(0,0,0,.1)", cursor: "pointer", fontSize: 12, fontWeight: 600, color: docUpload.file ? C.green : C.muted }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                {docUpload.file ? docUpload.file.name : (t.documents?.selectFile || "Select File")}
                <input type="file" style={{ display: "none" }} onChange={e => setDocUpload(p => ({ ...p, file: e.target.files?.[0] || null }))} />
              </label>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => setDocUpload({ open: false, type: "other", file: null, uploading: false })} style={{ flex: 1, padding: "10px", borderRadius: 8, border: "1.5px solid rgba(0,0,0,.1)", background: "#fff", cursor: "pointer", fontWeight: 600, fontSize: 12 }}>{t.common.cancel}</button>
              <button onClick={uploadDocument} disabled={!docUpload.file || docUpload.uploading} style={{ flex: 2, padding: "10px", borderRadius: 8, border: "none", background: docUpload.file ? C.bg : "rgba(0,0,0,.08)", color: docUpload.file ? C.accent : "#bbb", cursor: docUpload.file ? "pointer" : "default", fontWeight: 800, fontSize: 12 }}>{docUpload.uploading ? (t.documents?.uploading || "Uploading...") : (t.documents?.upload || "Upload")}</button>
            </div>
          </div>
        )}
      </div>

      {/* Renter's Insurance */}
      <div style={{ ...sCard, marginTop: 12 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <span style={sLabel}>{t.insurance?.title || "Renter's Insurance"}</span>
          {insurance && <span style={{ fontSize: 10, padding: "3px 10px", borderRadius: 100, fontWeight: 700, background: insurance.expiration && new Date(insurance.expiration + "T00:00:00") > new Date() ? hexRgba(C.green, .12) : hexRgba(C.red, .12), color: insurance.expiration && new Date(insurance.expiration + "T00:00:00") > new Date() ? C.green : C.red }}>{insurance.expiration && new Date(insurance.expiration + "T00:00:00") > new Date() ? (t.insurance?.active || "Active") : (t.insurance?.expired || "Expired")}</span>}
          {!insurance && <span style={{ fontSize: 10, padding: "3px 10px", borderRadius: 100, fontWeight: 700, background: hexRgba(C.red, .12), color: C.red }}>{t.insurance?.missing || "Not on File"}</span>}
        </div>
        {insurance && !insuranceForm.open && (
          <div>
            {[[t.insurance?.provider || "Provider", insurance.provider], [t.insurance?.policyNumber || "Policy", insurance.policy_number], [t.insurance?.expirationDate || "Expiration", fmtD(insurance.expiration)], [t.insurance?.coverageAmount || "Coverage", insurance.coverage_amount ? fmt(insurance.coverage_amount) : null]].filter(([, v]) => v).map(([label, val]) => (
              <div key={label} style={sRow}><span style={{ color: C.muted }}>{label}</span><span style={{ fontWeight: 600 }}>{val}</span></div>
            ))}
            {insurance.expiration && (() => { const d = daysLeft(insurance.expiration); if (d !== null && d <= 30 && d > 0) return <div style={{ fontSize: 11, color: C.accent, fontWeight: 600, marginTop: 6 }}>{t.insurance?.expiresIn || "Expires in"} {d} {t.insurance?.days || "days"}</div>; if (d !== null && d <= 0) return <div style={{ fontSize: 11, color: C.red, fontWeight: 600, marginTop: 6 }}>{t.insurance?.expiredDaysAgo || "Expired"} {Math.abs(d)} {t.insurance?.daysAgo || "days ago"}</div>; return null; })()}
            <button onClick={() => setInsuranceForm({ open: true, provider: insurance.provider || "", policyNumber: insurance.policy_number || "", expiration: insurance.expiration || "", coverage: insurance.coverage_amount ? String(insurance.coverage_amount) : "", file: null, uploading: false })} style={{ width: "100%", marginTop: 10, padding: "10px", borderRadius: 8, border: "1.5px solid rgba(0,0,0,.1)", background: "#fff", cursor: "pointer", fontWeight: 600, fontSize: 12 }}>{t.insurance?.updatePolicy || "Update Policy"}</button>
          </div>
        )}
        {!insurance && !insuranceForm.open && (
          <div>
            <div style={{ fontSize: 12, color: C.muted, marginBottom: 10, lineHeight: 1.5 }}>{t.insurance?.required || "Renter's insurance is required per your lease agreement."}</div>
            <button onClick={() => setInsuranceForm({ open: true, provider: "", policyNumber: "", expiration: "", coverage: "", file: null, uploading: false })} style={{ width: "100%", padding: "11px", borderRadius: 8, border: "none", background: C.bg, color: C.accent, cursor: "pointer", fontWeight: 800, fontSize: 12 }}>{t.insurance?.uploadProof || "Upload Proof of Insurance"}</button>
          </div>
        )}
        {insuranceForm.open && (
          <div style={{ padding: 14, background: "#faf9f7", borderRadius: 10, border: "1px solid rgba(0,0,0,.06)" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 8 }}>
              <div><label style={{ fontSize: 10, fontWeight: 700, color: C.muted, display: "block", marginBottom: 4 }}>{t.insurance?.provider || "Provider"}</label><input value={insuranceForm.provider} onChange={e => setInsuranceForm(p => ({ ...p, provider: e.target.value }))} placeholder="e.g. Lemonade, State Farm" style={{ width: "100%", padding: "8px", borderRadius: 6, border: "1.5px solid rgba(0,0,0,.1)", fontSize: 12 }} /></div>
              <div><label style={{ fontSize: 10, fontWeight: 700, color: C.muted, display: "block", marginBottom: 4 }}>{t.insurance?.policyNumber || "Policy Number"}</label><input value={insuranceForm.policyNumber} onChange={e => setInsuranceForm(p => ({ ...p, policyNumber: e.target.value }))} style={{ width: "100%", padding: "8px", borderRadius: 6, border: "1.5px solid rgba(0,0,0,.1)", fontSize: 12 }} /></div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 8 }}>
              <div><label style={{ fontSize: 10, fontWeight: 700, color: C.muted, display: "block", marginBottom: 4 }}>{t.insurance?.expirationDate || "Expiration"}</label><input type="date" value={insuranceForm.expiration} onChange={e => setInsuranceForm(p => ({ ...p, expiration: e.target.value }))} style={{ width: "100%", padding: "8px", borderRadius: 6, border: "1.5px solid rgba(0,0,0,.1)", fontSize: 12 }} /></div>
              <div><label style={{ fontSize: 10, fontWeight: 700, color: C.muted, display: "block", marginBottom: 4 }}>{t.insurance?.coverageAmount || "Coverage"}</label><input type="number" value={insuranceForm.coverage} onChange={e => setInsuranceForm(p => ({ ...p, coverage: e.target.value }))} placeholder="100000" style={{ width: "100%", padding: "8px", borderRadius: 6, border: "1.5px solid rgba(0,0,0,.1)", fontSize: 12 }} /></div>
            </div>
            <div style={{ marginBottom: 10 }}>
              <label style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 8, border: "1.5px solid rgba(0,0,0,.1)", cursor: "pointer", fontSize: 12, fontWeight: 600, color: insuranceForm.file ? C.green : C.muted }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                {insuranceForm.file ? insuranceForm.file.name : (t.documents?.selectFile || "Attach Policy PDF")}
                <input type="file" accept=".pdf,image/*" style={{ display: "none" }} onChange={e => setInsuranceForm(p => ({ ...p, file: e.target.files?.[0] || null }))} />
              </label>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => setInsuranceForm({ open: false, provider: "", policyNumber: "", expiration: "", coverage: "", file: null, uploading: false })} style={{ flex: 1, padding: "10px", borderRadius: 8, border: "1.5px solid rgba(0,0,0,.1)", background: "#fff", cursor: "pointer", fontWeight: 600, fontSize: 12 }}>{t.common.cancel}</button>
              <button onClick={submitInsurance} disabled={!insuranceForm.provider || !insuranceForm.expiration || insuranceForm.uploading} style={{ flex: 2, padding: "10px", borderRadius: 8, border: "none", background: insuranceForm.provider && insuranceForm.expiration ? C.bg : "rgba(0,0,0,.08)", color: insuranceForm.provider && insuranceForm.expiration ? C.accent : "#bbb", cursor: insuranceForm.provider && insuranceForm.expiration ? "pointer" : "default", fontWeight: 800, fontSize: 12 }}>{insuranceForm.uploading ? "Saving..." : (t.common?.save || "Save")}</button>
            </div>
          </div>
        )}
      </div>

      {/* Guest Registration */}
      <div style={{ ...sCard, marginTop: 12 }}>
        <span style={sLabel}>{t.guests?.title || "Guest Registration"}</span>
        <div style={{ fontSize: 10, color: C.muted, marginBottom: 10, lineHeight: 1.5, background: hexRgba(C.accent, .04), border: "1px solid " + hexRgba(C.accent, .12), borderRadius: 6, padding: "8px 10px" }}>
          <strong style={{ color: C.accent }}>{t.guests?.policy || "Guest Policy"}:</strong> {t.guests?.policyNote || "Guests must be registered 24 hours in advance. Maximum stay: 3 consecutive nights unless approved by management."}
        </div>
        {guests.filter(g => g.status === "active").length > 0 && (
          <div style={{ marginBottom: 10 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: C.green, textTransform: "uppercase", letterSpacing: .5, marginBottom: 6 }}>{t.guests?.activeGuests || "Active Guests"}</div>
            {guests.filter(g => g.status === "active").map(g => (
              <div key={g.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 12px", background: hexRgba(C.green, .04), border: "1px solid " + hexRgba(C.green, .15), borderRadius: 8, marginBottom: 6 }}>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: C.text }}>{g.name}</div>
                  <div style={{ fontSize: 10, color: C.muted }}>{t.guests?.[g.relationship] || g.relationship} {"\u2014"} {fmtD(g.visit_date)}{g.visit_end ? " to " + fmtD(g.visit_end) : ""}</div>
                  {g.temp_code && <div style={{ fontSize: 10, fontWeight: 700, color: C.accent, marginTop: 2, fontFamily: "monospace", letterSpacing: 2 }}>{t.guests?.tempCode || "Code"}: {g.temp_code}</div>}
                </div>
                <button onClick={() => cancelGuest(g.id)} style={{ padding: "4px 10px", borderRadius: 6, border: "1.5px solid " + hexRgba(C.red, .2), background: hexRgba(C.red, .04), color: C.red, fontSize: 9, fontWeight: 700, cursor: "pointer" }}>{t.guests?.cancel || "Cancel"}</button>
              </div>
            ))}
          </div>
        )}
        {guests.filter(g => g.status !== "active").length > 0 && (
          <div style={{ marginBottom: 10 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: .5, marginBottom: 6 }}>{t.guests?.pastGuests || "Past Guests"}</div>
            {guests.filter(g => g.status !== "active").slice(0, 5).map(g => (
              <div key={g.id} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid rgba(0,0,0,.04)", fontSize: 11, color: C.muted }}>
                <span>{g.name} {"\u2014"} {t.guests?.[g.relationship] || g.relationship}</span>
                <span>{fmtD(g.visit_date)}</span>
              </div>
            ))}
          </div>
        )}
        {!guestForm.open ? (
          <button onClick={() => setGuestForm({ open: true, name: "", relationship: "friend", visitDate: "", visitEnd: "", phone: "", submitting: false })} style={{ width: "100%", padding: "10px", borderRadius: 8, border: "1.5px solid rgba(0,0,0,.1)", background: "#fff", cursor: "pointer", fontWeight: 600, fontSize: 12, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>
            {t.guests?.register || "Register a Guest"}
          </button>
        ) : (
          <div style={{ padding: 14, background: "#faf9f7", borderRadius: 10, border: "1px solid rgba(0,0,0,.06)" }}>
            <div style={{ marginBottom: 8 }}><label style={{ fontSize: 10, fontWeight: 700, color: C.muted, display: "block", marginBottom: 4 }}>{t.guests?.name || "Guest Name"}</label><input value={guestForm.name} onChange={e => setGuestForm(p => ({ ...p, name: e.target.value }))} placeholder="Full name" style={{ width: "100%", padding: "8px", borderRadius: 6, border: "1.5px solid rgba(0,0,0,.1)", fontSize: 12 }} /></div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 8 }}>
              <div><label style={{ fontSize: 10, fontWeight: 700, color: C.muted, display: "block", marginBottom: 4 }}>{t.guests?.relationship || "Relationship"}</label><select value={guestForm.relationship} onChange={e => setGuestForm(p => ({ ...p, relationship: e.target.value }))} style={{ width: "100%", padding: "8px", borderRadius: 6, border: "1.5px solid rgba(0,0,0,.1)", fontSize: 12 }}>{["friend", "family", "partner", "coworker", "other"].map(r => <option key={r} value={r}>{t.guests?.[r] || r}</option>)}</select></div>
              <div><label style={{ fontSize: 10, fontWeight: 700, color: C.muted, display: "block", marginBottom: 4 }}>{t.guests?.phone || "Phone (optional)"}</label><input value={guestForm.phone} onChange={e => setGuestForm(p => ({ ...p, phone: e.target.value }))} style={{ width: "100%", padding: "8px", borderRadius: 6, border: "1.5px solid rgba(0,0,0,.1)", fontSize: 12 }} /></div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 10 }}>
              <div><label style={{ fontSize: 10, fontWeight: 700, color: C.muted, display: "block", marginBottom: 4 }}>{t.guests?.visitDate || "Visit Date"}</label><input type="date" value={guestForm.visitDate} onChange={e => setGuestForm(p => ({ ...p, visitDate: e.target.value }))} min={new Date().toISOString().split("T")[0]} style={{ width: "100%", padding: "8px", borderRadius: 6, border: "1.5px solid rgba(0,0,0,.1)", fontSize: 12 }} /></div>
              <div><label style={{ fontSize: 10, fontWeight: 700, color: C.muted, display: "block", marginBottom: 4 }}>{t.guests?.visitEnd || "End Date"}</label><input type="date" value={guestForm.visitEnd} onChange={e => setGuestForm(p => ({ ...p, visitEnd: e.target.value }))} min={guestForm.visitDate || new Date().toISOString().split("T")[0]} style={{ width: "100%", padding: "8px", borderRadius: 6, border: "1.5px solid rgba(0,0,0,.1)", fontSize: 12 }} /></div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => setGuestForm({ open: false, name: "", relationship: "friend", visitDate: "", visitEnd: "", phone: "", submitting: false })} style={{ flex: 1, padding: "10px", borderRadius: 8, border: "1.5px solid rgba(0,0,0,.1)", background: "#fff", cursor: "pointer", fontWeight: 600, fontSize: 12 }}>{t.common.cancel}</button>
              <button onClick={registerGuest} disabled={!guestForm.name || !guestForm.visitDate || guestForm.submitting} style={{ flex: 2, padding: "10px", borderRadius: 8, border: "none", background: guestForm.name && guestForm.visitDate ? C.bg : "rgba(0,0,0,.08)", color: guestForm.name && guestForm.visitDate ? C.accent : "#bbb", cursor: guestForm.name && guestForm.visitDate ? "pointer" : "default", fontWeight: 800, fontSize: 12 }}>{guestForm.submitting ? (t.guests?.submitting || "Registering...") : (t.guests?.submit || "Register Guest")}</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
