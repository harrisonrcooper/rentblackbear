"use client";
import { useState, useRef } from "react";

export default function PortalPreview({
  allTenants, props, allRooms, obStatuses,
  portalTenant, setPortalTenant, portalTab, setPortalTab,
  portalInviteState, setPortalInviteState,
  charges, chargeStatus, maint, setMaint,
  maintForm, setMaintForm, apps, setApps,
  settings, fmtD, fmtS, roomSubLine, shakeModal, uid, save, TODAY,
}) {
  const SUPA_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const SUPA_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Derive portal status from obStatuses (already polled every 30s)
  const getPortalStatus = (t) => {
    const email = (t.tenant?.email || "").toLowerCase();
    const ob = obStatuses[email] || null;
    return ob ? "linked" : "unknown";
  };
  // Tenants with invite info
  const withPortal = allTenants.filter(t => t.tenant?.email);
  const linked = withPortal.filter(t => obStatuses[(t.tenant?.email || "").toLowerCase()]);
  const unlinked = withPortal.filter(t => !obStatuses[(t.tenant?.email || "").toLowerCase()]);

  // Send invite helper
  const sendInvite = async (t) => {
    setPortalInviteState("sending");
    try {
      const res = await fetch("/api/portal-invite", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tenantName: t.tenant.name, tenantEmail: t.tenant.email, propertyName: t.propName, roomName: t.name, rent: t.rent, moveIn: t.tenant.moveIn })
      });
      const d = await res.json();
      if (d.ok) { setPortalInviteState("sent"); setTimeout(() => setPortalInviteState("idle"), 3000); }
      else setPortalInviteState("idle");
    } catch (e) { setPortalInviteState("idle"); }
  };

  // If drilling into a specific tenant's portal preview
  if (portalTenant) {
    const tRoom = portalTenant;
    const tProp = props.find(p => allRooms(p).some(r => r.id === tRoom.id));
    const tUnit = tProp ? (tProp.units || []).find(u => (u.rooms || []).some(r => r.id === tRoom.id)) : null;
    const tCharges = tRoom ? charges.filter(c => c.roomId === tRoom.id) : [];
    const tMaint = tRoom ? maint.filter(m => m.roomId === tRoom.id) : [];
    const submitMaint = () => {
      if (!maintForm.title.trim()) { shakeModal(); return; }
      setMaint(p => [...p, { id: uid(), roomId: tRoom.id, propId: tProp && tProp.id, tenant: tRoom.tenant.name, title: maintForm.title, desc: maintForm.desc, status: "open", priority: maintForm.priority, created: TODAY.toISOString().split("T")[0], photos: 0 }]);
      setMaintForm({ title: "", desc: "", priority: "medium", submitted: true, titleErr: false });
    };
    const tUtils = tUnit?.utils || tProp?.utils || "allIncluded";
    const tClean = tUnit?.clean || tProp?.clean || "Biweekly";
    const utilDesc = tUtils === "allIncluded" ? "All utilities included (electric, water, gas, WiFi)" : "Tenant pays utilities — split equally among roommates. WiFi always included.";
    const cleanDesc = tClean === "Weekly" ? "Common areas cleaned weekly" : "Common areas cleaned biweekly";
    const houseRules = [
      { rule: "No smoking or vaping anywhere on the property, including outdoors" },
      { rule: "No pets allowed" },
      { rule: "No shoes inside — please remove at the door" },
      { rule: "Quiet hours: 10pm to 7am weekdays, 11pm to 10am weekends" },
      { rule: "Clean up after yourself in shared common areas" },
      { rule: "Do not duplicate keys or grant property access to unauthorized guests" },
      { rule: "Parking in designated spots only" },
      { rule: "No open flames, candles, or grills inside" },
    ];
    const ob = obStatuses[(tRoom.tenant?.email || "").toLowerCase()] || {};

    const portalIdFrontRef = useRef(null);
    const portalIdBackRef = useRef(null);
    const portalPayRef = useRef(null);

    const portalUpload = async (file, type, label) => {
      const tApp = apps.find(ap => ap.email === tRoom.tenant.email && (ap.status === "applied" || ap.status === "reviewing" || ap.status === "approved" || ap.status === "onboarding" || ap.status === "current"));
      if (!tApp) return;
      const date = new Date().toISOString().split("T")[0];
      const nameParts = (tApp.name || "").split(" ");
      const nameStr = (nameParts[0] || "").replace(/[^a-zA-Z]/g, "") + (nameParts[1] || "").replace(/[^a-zA-Z]/g, "");
      const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
      const fileName = date + "_" + nameStr + "_" + type + "_APP-" + tApp.id + "." + ext;
      const path = "applicants/" + tApp.id + "/" + fileName;
      const r = await fetch(SUPA_URL + "/storage/v1/object/applicant-docs/" + path, { method: "POST", headers: { "apikey": SUPA_KEY, "Authorization": "Bearer " + SUPA_KEY, "Content-Type": file.type, "x-upsert": "true" }, body: file });
      if (!r.ok) return;
      const url = SUPA_URL + "/storage/v1/object/public/applicant-docs/" + path;
      const newDoc = { id: uid(), type, label, url, name: fileName, uploadedAt: date };
      const updatedApp = { ...tApp, appDocs: [...(tApp.appDocs || []).filter(x => x.type !== type || type === "PayStub"), newDoc] };
      const updatedApps = apps.map(x => x.id === tApp.id ? updatedApp : x);
      setApps(updatedApps); save("hq-apps", updatedApps);
    };

    return (<>
      {/* Preview header */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
        <button className="btn btn-out btn-sm" onClick={() => { setPortalTenant(null); setPortalTab("home"); }}>← Portal Management</button>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 15, fontWeight: 800 }}>{tRoom.tenant.name}</div>
          <div style={{ fontSize: 11, color: "#6b5e52" }}>{tRoom.propName} · {tRoom.name} · Portal Preview</div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <div style={{ fontSize: 10, color: "#6b5e52", background: "rgba(0,0,0,.03)", border: "1px solid rgba(0,0,0,.07)", borderRadius: 6, padding: "4px 10px" }}>
            Admin preview — read only
          </div>
        </div>
      </div>

      {/* Onboarding status pills */}
      <div className="card" style={{ marginBottom: 14 }}><div className="card-bd">
        <div style={{ fontSize: 10, fontWeight: 700, color: "#6b5e52", textTransform: "uppercase", letterSpacing: .8, marginBottom: 10 }}>Onboarding Status (live from portal)</div>
        <div style={{ display: "flex", gap: 8 }}>
          {[["Lease Signed", ob.leaseSigned], ["Security Deposit", ob.sdPaid], ["First Month Rent", ob.firstMonthPaid], ["Move In", ob.leaseSigned && ob.sdPaid && ob.firstMonthPaid]].map(([label, done]) => (
            <div key={label} style={{ flex: 1, textAlign: "center", padding: "8px 6px", borderRadius: 8, background: done ? "rgba(74,124,89,.08)" : "rgba(0,0,0,.04)", border: done ? "1px solid rgba(74,124,89,.2)" : "1px solid transparent" }}>
              <div style={{ fontSize: 16, marginBottom: 4 }}>{done ? "✓" : ""}</div>
              <div style={{ fontSize: 10, fontWeight: 700, color: done ? "#4a7c59" : "#aaa" }}>{label}</div>
            </div>
          ))}
        </div>
      </div></div>

      {/* Portal preview */}
      <div style={{ background: "#f9f8f5", borderRadius: 14, border: "1px solid rgba(0,0,0,.06)", overflow: "hidden" }}>
        <div style={{ background: "#1a1714", padding: "18px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 800, color: "#f5f0e8" }}>Black Bear Rentals</div>
            <div style={{ fontSize: 10, color: "#c4a882", marginTop: 2 }}>Welcome back, {tRoom.tenant.name.split(" ")[0]}!</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#d4a853" }}>{tRoom.propName}</div>
            <div style={{ fontSize: 9, color: "#c4a882" }}>{tRoom.name}</div>
          </div>
        </div>
        <div style={{ display: "flex", background: "#fff", borderBottom: "1px solid rgba(0,0,0,.06)" }}>
          {[["home", "Home"], ["payments", "Payments"], ["maintenance", "Maintenance"], ["docs", "Documents"], ["rules", "Rules"]].map(([id, label]) => (
            <button key={id} onClick={() => setPortalTab(id)} style={{ flex: 1, padding: "11px 4px", border: "none", background: portalTab === id ? "#faf9f7" : "#fff", borderBottom: portalTab === id ? "2px solid #d4a853" : "2px solid transparent", cursor: "pointer", fontSize: 10, fontWeight: portalTab === id ? 800 : 500, color: portalTab === id ? "#1a1714" : "#999", fontFamily: "inherit", transition: "all .15s" }}>
              {label}
            </button>
          ))}
        </div>

        {portalTab === "home" && <div style={{ padding: 18 }}>
          <div className="tp-card">
            <h3>Your Lease</h3>
            {[
              ["Room", `${tUnit && tUnit.label ? "Unit " + tUnit.label + " — " : ""}${tRoom.name} · ${tRoom.pb ? "Private bathroom" : "Shared bathroom"}`],
              ["Property", `${tRoom.propName}${tUnit && tUnit.label ? " · Unit " + tUnit.label : ""}`],
              ["Monthly Rent", `$${tRoom.rent.toLocaleString()}/mo`],
              ["Move-In Date", fmtD(tRoom.tenant.moveIn)],
              ["Lease Ends", tRoom.le ? fmtD(tRoom.le) : "Month-to-Month"],
              ["Utilities", utilDesc],
              ["Cleaning", cleanDesc],
              ["WiFi", "Google Fiber — always included"],
            ].map(([l, v]) => <div key={l} className="tp-row"><span className="tp-label">{l}</span><span style={{ fontWeight: 600, fontSize: 12, textAlign: "right", maxWidth: "60%" }}>{v}</span></div>)}
          </div>
          {tRoom.tenant.doorCode && <div className="tp-card" style={{ marginTop: 10, border: "2px solid rgba(74,124,89,.3)", background: "rgba(74,124,89,.04)" }}>
            <h3 style={{ color: "#4a7c59" }}>Door Access</h3>
            <div style={{ textAlign: "center", padding: "14px 0" }}>
              <div style={{ fontSize: 11, color: "#6b5e52", marginBottom: 6 }}>Your 4-digit door code</div>
              <div style={{ fontSize: 40, fontWeight: 900, letterSpacing: 12, color: "#4a7c59", fontFamily: "monospace" }}>{tRoom.tenant.doorCode}</div>
              <div style={{ fontSize: 10, color: "#4a7c59", marginTop: 6 }}>Works on all exterior doors and your bedroom lock</div>
            </div>
          </div>}
        </div>}

        {portalTab === "payments" && <div style={{ padding: 18 }}>
          {tCharges.length === 0 && <div style={{ textAlign: "center", padding: 28, color: "#6b5e52", fontSize: 13 }}>No charges on file yet.</div>}
          {tCharges.map(c => { const st = chargeStatus(c); const stColors = { paid: "#4a7c59", unpaid: "#3b82f6", pastdue: "#c45c4a", partial: "#d4a853", waived: "#999" }; return (
            <div key={c.id} className="tp-card" style={{ marginBottom: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div><div style={{ fontSize: 13, fontWeight: 700 }}>{c.desc || c.category}</div><div style={{ fontSize: 11, color: "#6b5e52" }}>Due {fmtD(c.dueDate)}</div></div>
                <div style={{ textAlign: "right" }}><div style={{ fontSize: 16, fontWeight: 800 }}>{fmtS(c.amount)}</div><span style={{ fontSize: 10, fontWeight: 700, color: stColors[st] || "#999" }}>{st}</span></div>
              </div>
              {c.amountPaid > 0 && c.amountPaid < c.amount && <div style={{ fontSize: 11, color: "#6b5e52", marginTop: 4 }}>{fmtS(c.amountPaid)} paid — {fmtS(c.amount - c.amountPaid)} remaining</div>}
            </div>
          ); })}
          <div className="tp-card" style={{ marginTop: 10, background: "rgba(74,124,89,.03)", borderColor: "rgba(74,124,89,.12)" }}>
            <h3 style={{ color: "#4a7c59" }}>How to Pay</h3>
            <div className="tp-row"><span className="tp-label">Zelle</span><span style={{ fontWeight: 600, fontSize: 12 }}>{settings.phone || "(850) 696-8101"}</span></div>
            <div className="tp-row"><span className="tp-label">Venmo</span><span style={{ fontWeight: 600, fontSize: 12 }}>@BlackBearRentals</span></div>
            <div className="tp-row"><span className="tp-label">Check</span><span style={{ fontWeight: 600, fontSize: 12 }}>{settings.legalName || "Oak & Main Development LLC"}</span></div>
            <div style={{ marginTop: 10, fontSize: 10, color: "#6b5e52" }}>Online payments via ACH/card coming soon in the portal.</div>
          </div>
        </div>}

        {portalTab === "maintenance" && <div style={{ padding: 18 }}>
          <div className="tp-card" style={{ marginBottom: 14 }}>
            <h3 style={{ marginBottom: 10 }}>Submit a Request</h3>
            <div className="fld" style={{ marginBottom: 8 }}><label>What is the issue?</label><input value={maintForm.title || ""} onChange={e => setMaintForm(p => ({ ...p, title: e.target.value, titleErr: false }))} placeholder="e.g. Leaky faucet in bathroom" style={{ width: "100%" }} /></div>
            <div className="fld" style={{ marginBottom: 8 }}><label>Details (optional)</label><textarea value={maintForm.desc || ""} onChange={e => setMaintForm(p => ({ ...p, desc: e.target.value }))} placeholder="Describe the issue..." rows={2} style={{ width: "100%", padding: "8px 10px", borderRadius: 6, border: "1px solid rgba(0,0,0,.06)", fontSize: 11, fontFamily: "inherit", resize: "vertical" }} /></div>
            <div style={{ display: "flex", gap: 6, marginBottom: 10 }}>
              {["low", "medium", "high"].map(p => <button key={p} onClick={() => setMaintForm(f => ({ ...f, priority: p }))} style={{ flex: 1, padding: "6px", borderRadius: 6, border: `1px solid ${maintForm.priority === p ? "#d4a853" : "rgba(0,0,0,.08)"}`, background: maintForm.priority === p ? "rgba(212,168,83,.08)" : "#fff", cursor: "pointer", fontSize: 10, fontWeight: maintForm.priority === p ? 700 : 400, fontFamily: "inherit" }}>{p}</button>)}
            </div>
            {maintForm.submitted ? <div style={{ textAlign: "center", padding: 12, color: "#4a7c59", fontWeight: 700, fontSize: 13 }}>Request submitted!</div> : <button className="btn btn-green" style={{ width: "100%" }} onClick={submitMaint}>Submit Request</button>}
          </div>
          {tMaint.length > 0 && <><div style={{ fontSize: 11, fontWeight: 700, color: "#6b5e52", marginBottom: 8 }}>YOUR REQUESTS</div>
            {tMaint.map(r => <div key={r.id} className="tp-card" style={{ marginBottom: 8 }}><div style={{ display: "flex", justifyContent: "space-between" }}><div><div style={{ fontSize: 12, fontWeight: 600 }}>{r.title}</div><div style={{ fontSize: 10, color: "#6b5e52" }}>{r.created}</div></div><span className={`badge ${r.status === "resolved" ? "b-green" : r.status === "in-progress" ? "b-gold" : "b-red"}`}>{r.status}</span></div></div>)}
          </>}
        </div>}

        {portalTab === "docs" && <div style={{ padding: 18 }}>
          {(() => {
            // Resolve the application record for this tenant to find appDocs
            const tApp = apps.find(ap => ap.email === tRoom.tenant.email && (ap.status === "applied" || ap.status === "reviewing" || ap.status === "approved" || ap.status === "onboarding" || ap.status === "current"));
            const tDocs = (tApp?.appDocs) || [];
            const tFlag = tApp?.docsFlag || {};
            const pendingId = tFlag.idUploadLater && !tDocs.some(x => x.type === "PhotoID-Front" && x.url);
            const pendingIncome = tFlag.incomeUploadLater && !tDocs.some(x => x.type === "PayStub" && x.url);
            return (<div className="tp-card"><h3>Your Documents</h3>
              {tDocs.filter(x => x.url).length === 0 && !pendingId && !pendingIncome && <div style={{ color: "#6b5e52", fontSize: 12, padding: "8px 0" }}>No documents uploaded yet.</div>}
              {tDocs.filter(x => x.url && !x.tenantHidden).map((doc, i) => {
                const isPdf = doc?.name?.toLowerCase().endsWith(".pdf");
                const removeDoc = () => {
                  const updatedApp = { ...tApp, appDocs: (tApp.appDocs || []).map(x => x.id === doc.id ? { ...x, tenantHidden: true } : x) };
                  const updatedApps = apps.map(x => x.id === tApp.id ? updatedApp : x);
                  setApps(updatedApps); save("hq-apps", updatedApps);
                };
                return (<div key={doc.id || i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid rgba(0,0,0,.04)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    {!isPdf && <img src={doc.url} alt={doc.label} style={{ width: 40, height: 30, objectFit: "cover", borderRadius: 4, border: "1px solid rgba(0,0,0,.1)" }} />}
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 600, color: "#1a1714" }}>{doc.label}</div>
                      <a href={doc.url} target="_blank" rel="noreferrer" style={{ fontSize: 10, color: "var(--ac)", fontWeight: 700 }}>View</a>
                    </div>
                  </div>
                  <button onClick={removeDoc} style={{ background: "none", border: "none", color: "#c45c4a", fontSize: 10, cursor: "pointer", fontFamily: "inherit", fontWeight: 600, padding: "4px 8px", borderRadius: 5, border: "1px solid rgba(196,92,74,.2)" }}>Remove</button>
                </div>);
              })}
              {(pendingId || pendingIncome) && <>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#c45c4a", marginTop: 10, marginBottom: 8 }}>Documents still needed:</div>
                {pendingId && <>
                  <div style={{ fontSize: 11, color: "#5c4a3a", marginBottom: 6 }}>Photo ID (front + back)</div>
                  <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
                    <button className="btn btn-sm btn-out" style={{ flex: 1 }} onClick={() => portalIdFrontRef.current?.click()}>Upload Front</button>
                    <button className="btn btn-sm btn-out" style={{ flex: 1 }} onClick={() => portalIdBackRef.current?.click()}>Upload Back</button>
                  </div>
                  <input ref={portalIdFrontRef} type="file" accept="image/*,.pdf" style={{ display: "none" }} onChange={e => { if (e.target.files[0]) portalUpload(e.target.files[0], "PhotoID-Front", "Front of ID"); }} />
                  <input ref={portalIdBackRef} type="file" accept="image/*,.pdf" style={{ display: "none" }} onChange={e => { if (e.target.files[0]) portalUpload(e.target.files[0], "PhotoID-Back", "Back of ID"); }} />
                </>}
                {pendingIncome && <>
                  <div style={{ fontSize: 11, color: "#5c4a3a", marginBottom: 6 }}>Proof of Income</div>
                  <button className="btn btn-sm btn-out" style={{ width: "100%" }} onClick={() => portalPayRef.current?.click()}>Upload Pay Stub / Income Doc</button>
                  <input ref={portalPayRef} type="file" accept="image/*,.pdf" style={{ display: "none" }} onChange={e => { if (e.target.files[0]) portalUpload(e.target.files[0], "PayStub", "Pay Stub"); }} />
                </>}
              </>}
            </div>);
          })()}
        </div>}

        {portalTab === "rules" && <div style={{ padding: 18 }}>
          <div className="tp-card"><h3>House Rules</h3>
            {houseRules.map((r, i) => <div key={i} className="tp-row"><span style={{ fontSize: 12 }}>{r.rule}</span></div>)}
          </div>
          <div className="tp-card" style={{ marginTop: 10 }}><h3>Your Amenities</h3>
            {[["Utilities", utilDesc], ["Cleaning", cleanDesc], ["WiFi", "Google Fiber — always included"], ["Parking", "One spot per tenant — first come first served"]].map(([l, v]) => <div key={l} className="tp-row"><span className="tp-label">{l}</span><span style={{ fontSize: 12, fontWeight: 600, textAlign: "right", maxWidth: "60%" }}>{v}</span></div>)}
          </div>
          <div className="tp-card" style={{ marginTop: 10 }}><h3>Contact & Emergency</h3>
            <div className="tp-row"><span className="tp-label">Phone</span><strong>{settings.phone || "(850) 696-8101"}</strong></div>
            <div className="tp-row"><span className="tp-label">Email</span><strong>{settings.pmEmail || settings.email}</strong></div>
            <div className="tp-row"><span className="tp-label">Emergency</span><strong>911 — then notify us immediately</strong></div>
          </div>
        </div>}
      </div>
    </>);
  }

  // ── PORTAL MANAGEMENT (default view) ─────────────────────────
  return (<>
    <div className="sec-hd"><div><h2>Portal Management</h2><p>{linked.length} connected · {unlinked.length} not yet linked</p></div></div>

    {/* Summary KPIs */}
    <div className="kgrid" style={{ gridTemplateColumns: "repeat(3,1fr)", marginBottom: 16 }}>
      <div className="kpi"><div className="kl">Portal Access</div><div className="kv" style={{ color: "#4a7c59" }}>{linked.length}</div><div className="ks">tenants linked</div></div>
      <div className="kpi"><div className="kl">Not Invited</div><div className="kv" style={{ color: unlinked.length ? "#d4a853" : "#4a7c59" }}>{unlinked.length}</div><div className="ks">tenants without access</div></div>
      <div className="kpi"><div className="kl">Total Tenants</div><div className="kv">{allTenants.length}</div><div className="ks">active</div></div>
    </div>

    {/* Not yet invited — action needed */}
    {unlinked.length > 0 && <div className="card" style={{ marginBottom: 14, border: "1px solid rgba(212,168,83,.2)", background: "rgba(212,168,83,.02)" }}><div className="card-bd">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <div><div style={{ fontSize: 13, fontWeight: 800, color: "#9a7422" }}>Not Yet Invited ({unlinked.length})</div><div style={{ fontSize: 11, color: "#6b5e52", marginTop: 2 }}>These tenants don{"'"}t have portal access yet.</div></div>
      </div>
      {unlinked.map(t => (
        <div key={t.id} className="row">
          <div className="row-dot" style={{ background: "#d4a853" }} />
          <div className="row-i">
            <div className="row-t">{t.tenant.name}</div>
            <div className="row-s">{roomSubLine(t.propName, t.name)} · {t.tenant.email || "No email on file"}</div>
          </div>
          <button className="btn btn-out btn-sm" onClick={() => setPortalTenant(t)}>Preview</button>
          {t.tenant.email && <button className="btn btn-gold btn-sm" onClick={() => sendInvite(t)} disabled={portalInviteState === "sending"}>
            {portalInviteState === "sending" ? "Sending..." : portalInviteState === "sent" ? "Sent!" : "Send Invite"}
          </button>}
        </div>
      ))}
    </div></div>}

    {/* Linked tenants */}
    {linked.length > 0 && <div className="card" style={{ marginBottom: 14 }}><div className="card-bd">
      <div style={{ fontSize: 13, fontWeight: 800, marginBottom: 12 }}>Portal Active ({linked.length})</div>
      {linked.map(t => {
        const ob = obStatuses[(t.tenant?.email || "").toLowerCase()] || {};
        const steps = [ob.leaseSigned, ob.sdPaid, ob.firstMonthPaid];
        const doneCount = steps.filter(Boolean).length;
        return (
          <div key={t.id} className="row" style={{ cursor: "pointer" }} onClick={() => { setPortalTenant(t); setPortalTab("home"); }}>
            <div className="row-dot" style={{ background: "#4a7c59" }} />
            <div className="row-i">
              <div className="row-t">{t.tenant.name}</div>
              <div className="row-s">{roomSubLine(t.propName, t.name)} · {t.tenant.email}</div>
            </div>
            <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
              {[["Lease", ob.leaseSigned], ["SD", ob.sdPaid], ["Rent", ob.firstMonthPaid]].map(([label, done]) => (
                <span key={label} style={{ fontSize: 9, fontWeight: 700, padding: "2px 6px", borderRadius: 4, background: done ? "rgba(74,124,89,.12)" : "rgba(0,0,0,.06)", color: done ? "#4a7c59" : "#aaa" }}>{done ? "✓ " : ""}{label}</span>
              ))}
            </div>
            <span style={{ fontSize: 10, color: "#4a7c59", fontWeight: 600, marginLeft: 4 }}>Preview →</span>
          </div>);
      })}
    </div></div>}

    {allTenants.length === 0 && <div style={{ textAlign: "center", padding: 48, color: "#6b5e52" }}>
      <div style={{ fontSize: 40, marginBottom: 8 }}><svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg></div>
      <div style={{ fontWeight: 700, marginBottom: 4 }}>No active tenants</div>
      <div style={{ fontSize: 12 }}>Add tenants from the Tenants tab to get started.</div>
    </div>}
  </>);
}
