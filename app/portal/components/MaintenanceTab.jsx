"use client";
import { hexRgba, fmtD, daysLeft, sCard, sRow } from "./PortalShared";

export default function MaintenanceTab({
  tenant, C, t,
  maintenance, maintForm, setMaintForm,
  maintSubmitting, maintSuccess, submitMaint,
  maintFeedback, setMaintFeedback, submitMaintFeedback,
}) {
  return (
    <div style={{ animation: "fadeIn .2s" }}>
      <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 16 }}>{t.maintenance.title}</h2>
      <div style={sCard}>
        <div style={{ fontSize: 13, fontWeight: 800, marginBottom: 14 }}>{t.maintenance.submitRequest}</div>
        {maintSuccess && <div style={{ background: hexRgba(C.green, .08), border: `1px solid ${hexRgba(C.green, .2)}`, borderRadius: 8, padding: "10px 14px", fontSize: 12, color: C.green, marginBottom: 14 }}>{t.maintenance.success}</div>}
        <div style={{ marginBottom: 12 }}><label style={{ fontSize: 11, fontWeight: 700, color: C.muted, display: "block", marginBottom: 5 }}>{t.maintenance.whatIsIssue}</label><input value={maintForm.title} onChange={e => setMaintForm(p => ({ ...p, title: e.target.value }))} placeholder="e.g. Leaky faucet in bathroom" style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1.5px solid rgba(0,0,0,.1)", fontSize: 13 }} /></div>
        <div style={{ marginBottom: 12 }}><label style={{ fontSize: 11, fontWeight: 700, color: C.muted, display: "block", marginBottom: 5 }}>{t.maintenance.details}</label><textarea value={maintForm.desc} onChange={e => setMaintForm(p => ({ ...p, desc: e.target.value }))} placeholder="Describe the issue..." rows={3} style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1.5px solid rgba(0,0,0,.1)", fontSize: 13, resize: "vertical" }} /></div>
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 11, fontWeight: 700, color: C.muted, display: "block", marginBottom: 5 }}>{t.maintenance.priority}</label>
          <div style={{ display: "flex", gap: 8 }}>
            {[["low", t.maintenance.low, C.green], ["medium", t.maintenance.medium, C.accent], ["high", t.maintenance.high, C.red]].map(([v, l, col]) => (
              <button key={v} onClick={() => setMaintForm(p => ({ ...p, priority: v }))} style={{ flex: 1, padding: "8px", borderRadius: 8, border: `1.5px solid ${maintForm.priority === v ? col : "rgba(0,0,0,.1)"}`, background: maintForm.priority === v ? col + "15" : "#fff", cursor: "pointer", fontSize: 11, fontWeight: maintForm.priority === v ? 700 : 500, color: maintForm.priority === v ? col : "#999" }}>{l}</button>
            ))}
          </div>
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 11, fontWeight: 700, color: C.muted, display: "block", marginBottom: 5 }}>{t.maintenance.photos}</label>
          {maintForm.photos.length < 3 && (
            <label style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 8, border: "1.5px solid rgba(0,0,0,.1)", background: "#fff", cursor: "pointer", fontSize: 12, fontWeight: 600, color: C.muted }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
              {t.maintenance.addPhoto}
              <input type="file" accept="image/*" multiple style={{ display: "none" }} onChange={e => {
                const files = Array.from(e.target.files || []);
                const remaining = 3 - maintForm.photos.length;
                files.slice(0, remaining).forEach(file => {
                  const reader = new FileReader();
                  reader.onload = (ev) => setMaintForm(p => ({ ...p, photos: p.photos.length < 3 ? [...p.photos, ev.target.result] : p.photos }));
                  reader.readAsDataURL(file);
                });
                e.target.value = "";
              }} />
            </label>
          )}
          {maintForm.photos.length > 0 && (
            <div style={{ display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
              {maintForm.photos.map((src, i) => (
                <div key={i} style={{ position: "relative", width: 72, height: 72 }}>
                  <img src={src} alt="" style={{ width: 72, height: 72, objectFit: "cover", borderRadius: 8, border: "1.5px solid rgba(0,0,0,.1)" }} />
                  <button onClick={() => setMaintForm(p => ({ ...p, photos: p.photos.filter((_, j) => j !== i) }))} style={{ position: "absolute", top: -6, right: -6, width: 20, height: 20, borderRadius: 10, border: "none", background: C.red, color: "#fff", cursor: "pointer", fontSize: 12, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", padding: 0, lineHeight: 1 }}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        <button onClick={submitMaint} disabled={maintSubmitting || !maintForm.title.trim()} style={{ width: "100%", padding: "12px", borderRadius: 10, border: "none", background: maintForm.title.trim() ? C.bg : "rgba(0,0,0,.08)", color: maintForm.title.trim() ? C.accent : "#bbb", fontWeight: 800, fontSize: 14, cursor: maintForm.title.trim() ? "pointer" : "default" }}>{maintSubmitting ? t.maintenance.submitting : t.maintenance.submit}</button>
      </div>
      {maintenance.length > 0 && <>
        <div style={{ fontSize: 10, fontWeight: 700, color: "#999", textTransform: "uppercase", letterSpacing: .8, marginBottom: 10 }}>{t.maintenance.history}</div>
        {maintenance.map(req => {
          const stColor = { open: C.red, "in-progress": C.accent, resolved: C.green }[req.status];
          const stLabel2 = { open: t.home.open, "in-progress": t.home.inProgress, resolved: t.maintenance.resolved }[req.status];
          const fb = maintFeedback[req.id] || {};
          return (
            <div key={req.id} style={sCard}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div><div style={{ fontSize: 13, fontWeight: 600 }}>{req.title}</div><div style={{ fontSize: 11, color: "#999", marginTop: 2 }}>{new Date(req.created_at).toLocaleDateString()}</div>{req.description && <div style={{ fontSize: 11, color: C.muted, marginTop: 4, lineHeight: 1.5 }}>{req.description}</div>}</div>
                <span style={{ fontSize: 10, padding: "3px 10px", borderRadius: 100, fontWeight: 700, background: stColor + "18", color: stColor, flexShrink: 0, marginLeft: 8 }}>{stLabel2}</span>
              </div>
              {req.photos && Array.isArray(req.photos) && req.photos.length > 0 && (
                <div style={{ display: "flex", gap: 6, marginTop: 8, flexWrap: "wrap" }}>
                  {req.photos.map((src, i) => (
                    <img key={i} src={src} alt="" style={{ width: 56, height: 56, objectFit: "cover", borderRadius: 6, border: "1.5px solid rgba(0,0,0,.08)", cursor: "pointer" }} onClick={() => window.open(src, "_blank")} />
                  ))}
                </div>
              )}

              {(req.technician || req.eta) && (
                <div style={{ marginTop: 10, padding: "10px 12px", background: "rgba(0,0,0,.02)", borderRadius: 8, border: "1px solid rgba(0,0,0,.04)" }}>
                  {req.technician && (
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6, fontSize: 11 }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={C.muted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                      <span style={{ color: C.muted }}>{t.maintenanceLife?.technician || "Technician"}:</span>
                      <span style={{ fontWeight: 600, color: C.text }}>{req.technician}</span>
                    </div>
                  )}
                  {req.eta && (
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6, fontSize: 11 }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={C.muted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                      <span style={{ color: C.muted }}>{t.maintenanceLife?.eta || "ETA"}:</span>
                      <span style={{ fontWeight: 600, color: C.text }}>{fmtD(req.eta)}</span>
                      {(() => { const d = daysLeft(req.eta); return d !== null ? <span style={{ fontSize: 10, color: d <= 0 ? C.green : d <= 2 ? C.red : C.accent }}>({d <= 0 ? "Today/overdue" : d + "d"})</span> : null; })()}
                    </div>
                  )}
                  <div style={{ display: "flex", alignItems: "center", gap: 0, marginTop: 8 }}>
                    {[
                      { key: "submitted", label: t.maintenanceLife?.submitted || "Submitted", done: true },
                      { key: "assigned", label: t.maintenanceLife?.assigned || "Assigned", done: !!req.technician },
                      { key: "in-progress", label: t.maintenanceLife?.inProgress || "In Progress", done: req.status === "in-progress" || req.status === "resolved" },
                      { key: "completed", label: t.maintenanceLife?.completed || "Completed", done: req.status === "resolved" },
                    ].map((step, i, arr) => (
                      <div key={step.key} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", position: "relative" }}>
                        <div style={{ width: 16, height: 16, borderRadius: 8, background: step.done ? C.green : "rgba(0,0,0,.1)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1 }}>
                          {step.done && <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>}
                        </div>
                        <div style={{ fontSize: 8, color: step.done ? C.green : "#999", fontWeight: 600, marginTop: 3, textAlign: "center" }}>{step.label}</div>
                        {i < arr.length - 1 && <div style={{ position: "absolute", top: 7, left: "50%", width: "100%", height: 2, background: arr[i + 1].done ? C.green : "rgba(0,0,0,.08)", zIndex: 0 }} />}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {req.completion_photos && Array.isArray(req.completion_photos) && req.completion_photos.length > 0 && (
                <div style={{ marginTop: 10 }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: .5, marginBottom: 6 }}>{t.maintenanceLife?.completionPhotos || "Completion Photos"}</div>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {req.completion_photos.map((src, i) => (
                      <img key={i} src={src} alt="" style={{ width: 72, height: 72, objectFit: "cover", borderRadius: 8, border: "1.5px solid " + hexRgba(C.green, .2), cursor: "pointer" }} onClick={() => window.open(src, "_blank")} />
                    ))}
                  </div>
                </div>
              )}

              {req.status === "resolved" && !req.tenant_rating && !fb.submitted && (
                <div style={{ marginTop: 12, padding: 14, background: hexRgba(C.accent, .04), border: "1px solid " + hexRgba(C.accent, .15), borderRadius: 10 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 4 }}>{t.maintenanceLife?.feedback || "How was the repair?"}</div>
                  <div style={{ fontSize: 10, color: C.muted, marginBottom: 10 }}>{t.maintenanceLife?.feedbackDesc || "Rate the quality of this maintenance work."}</div>
                  <div style={{ display: "flex", gap: 6, marginBottom: 10 }}>
                    {[
                      ["excellent", t.maintenanceLife?.excellent || "Excellent", C.green],
                      ["good", t.maintenanceLife?.good || "Good", "#3b82f6"],
                      ["fair", t.maintenanceLife?.fair || "Fair", C.accent],
                      ["poor", t.maintenanceLife?.poor || "Poor", C.red],
                    ].map(([val, label, color]) => (
                      <button key={val} onClick={() => setMaintFeedback(p => ({ ...p, [req.id]: { ...p[req.id], rating: val } }))} style={{ flex: 1, padding: "8px 4px", borderRadius: 8, border: "1.5px solid " + (fb.rating === val ? color : "rgba(0,0,0,.1)"), background: fb.rating === val ? color + "15" : "#fff", cursor: "pointer", fontSize: 10, fontWeight: fb.rating === val ? 700 : 500, color: fb.rating === val ? color : "#999" }}>{label}</button>
                    ))}
                  </div>
                  <textarea value={fb.comments || ""} onChange={e => setMaintFeedback(p => ({ ...p, [req.id]: { ...p[req.id], comments: e.target.value } }))} placeholder={t.maintenanceLife?.comments || "Comments (optional)"} rows={2} style={{ width: "100%", padding: "8px 10px", borderRadius: 6, border: "1.5px solid rgba(0,0,0,.1)", fontSize: 11, resize: "vertical", marginBottom: 8 }} />
                  <button onClick={() => fb.rating && submitMaintFeedback(req.id, fb.rating, fb.comments || "")} disabled={!fb.rating} style={{ width: "100%", padding: "10px", borderRadius: 8, border: "none", background: fb.rating ? C.bg : "rgba(0,0,0,.08)", color: fb.rating ? C.accent : "#bbb", cursor: fb.rating ? "pointer" : "default", fontWeight: 800, fontSize: 12 }}>{t.maintenanceLife?.submitFeedback || "Submit Feedback"}</button>
                </div>
              )}
              {(req.tenant_rating || fb.submitted) && (
                <div style={{ marginTop: 8, fontSize: 11, color: C.green, fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  {t.maintenanceLife?.feedbackSubmitted || "Thank you for your feedback!"}
                </div>
              )}
            </div>
          );
        })}
      </>}
    </div>
  );
}
