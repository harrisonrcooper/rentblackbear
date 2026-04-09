"use client";
import { hexRgba, fmt, fmtD, sCard, sLabel, sRow, supabase, IcLogout } from "./PortalShared";

export default function AccountTab({
  tenant, C, t, pm, pmSettings, user, charges, lang,
  setPmSettings, signOut, exportPaymentPdf,
  referralLink, referralCopied, copyReferral,
  notifPrefs, setNotifPrefs,
  darkMode, setDarkMode,
  packages, markPackagePickedUp,
  fullAuditLog, auditExpanded, setAuditExpanded,
}) {
  const NOTIF_ITEMS = [
    { key: "payment_reminders", label: t.account.paymentReminders, desc: "Get reminded when rent is due" },
    { key: "payment_confirmations", label: t.account.paymentConfirmations, desc: "Confirmation when a payment is received" },
    { key: "maintenance_updates", label: t.account.maintenanceUpdates, desc: "Status changes on your requests" },
    { key: "lease_reminders", label: t.account.leaseReminders, desc: "Renewal and expiration notices" },
    { key: "announcements", label: t.account.announcementsNotif, desc: "Property-wide announcements from your PM" },
  ];
  const allOn = NOTIF_ITEMS.every(item => notifPrefs[item.key]?.email && notifPrefs[item.key]?.text);
  const allOff = NOTIF_ITEMS.every(item => !notifPrefs[item.key]?.email && !notifPrefs[item.key]?.text);
  const bulkSet = (on) => {
    const updated = { ...notifPrefs };
    NOTIF_ITEMS.forEach(item => { updated[item.key] = { email: on, text: on }; });
    setNotifPrefs(updated);
    supabase.from("portal_users").update({ notif_prefs: updated }).eq("tenant_id", tenant?.id);
  };
  const toggle = (key, channel) => {
    const cur = notifPrefs[key] || { email: false, text: false };
    const updated = { ...notifPrefs, [key]: { ...cur, [channel]: !cur[channel] } };
    setNotifPrefs(updated);
    supabase.from("portal_users").update({ notif_prefs: updated }).eq("tenant_id", tenant?.id);
  };
  const Toggle = ({ on, onClick }) => (
    <button onClick={onClick} style={{ flexShrink: 0, width: 40, height: 22, borderRadius: 11, border: "none", cursor: "pointer", background: on ? C.green : "rgba(0,0,0,.1)", transition: "background .2s", position: "relative" }}>
      <div style={{ position: "absolute", top: 2, left: on ? 20 : 2, width: 18, height: 18, borderRadius: "50%", background: "#fff", transition: "left .2s", boxShadow: "0 1px 3px rgba(0,0,0,.2)" }}/>
    </button>
  );

  return (
    <div style={{ animation: "fadeIn .2s" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <h2 style={{ fontSize: 18, fontWeight: 800 }}>{t.account.title}</h2>
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.muted} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
          <select value={lang} onChange={e => { const newLang = e.target.value; setPmSettings(p => ({ ...p, language: newLang })); }} style={{ border: "1px solid rgba(0,0,0,.1)", borderRadius: 6, padding: "4px 8px", fontSize: 11, fontFamily: "inherit", background: "#fff", cursor: "pointer", color: C.text }}>
            <option value="en">English</option>
            <option value="es">Espa{"\u00f1"}ol</option>
          </select>
        </div>
      </div>

      <div style={sCard}>
        <span style={sLabel}>{t.account.profile}</span>
        <div style={sRow}><span style={{ color: C.muted }}>{t.account.name}</span><span style={{ fontWeight: 600 }}>{tenant?.name}</span></div>
        <div style={sRow}><span style={{ color: C.muted }}>{t.account.email}</span><span style={{ fontWeight: 600 }}>{user?.email}</span></div>
        <div style={{ ...sRow, borderBottom: "none" }}>
          <span style={{ color: C.muted }}>{t.account.phone}</span>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <input
              defaultValue={tenant?.phone || ""}
              placeholder={t.account.addPhone}
              onBlur={e => { const v = e.target.value.trim(); if (v !== (tenant?.phone || "")) supabase.from("tenants").update({ phone: v }).eq("id", tenant?.id); }}
              style={{ border: "none", background: "transparent", textAlign: "right", fontWeight: 600, fontSize: 13, fontFamily: "inherit", outline: "none", padding: "2px 0", width: 160 }}
            />
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#bbb" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          </div>
        </div>
      </div>

      <div style={sCard}>
        <span style={sLabel}>{t.account.paymentHistory}</span>
        <div style={{ fontSize: 12, color: C.muted, marginBottom: 12, lineHeight: 1.5 }}>{t.account.exportDesc}</div>
        <button onClick={() => {
          const rows = [["Date", "Category", "Description", "Amount", "Status", "Method"]];
          charges.forEach(c => {
            const st = c.amount_paid >= c.amount ? "Paid" : c.amount_paid > 0 ? "Partial" : "Unpaid";
            (c.payments || []).forEach(p => rows.push([p.date, c.category, c.description || "", p.amount, st, p.method || ""]));
            if (!(c.payments || []).length) rows.push([c.due_date, c.category, c.description || "", c.amount, st, ""]);
          });
          const csv = rows.map(r => r.map(v => '"' + String(v).replace(/"/g, '""') + '"').join(",")).join("\n");
          const blob = new Blob([csv], { type: "text/csv" });
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a"); a.href = url; a.download = "payment-history-" + (tenant?.name || "tenant").replace(/\s+/g, "-").toLowerCase() + ".csv"; a.click();
          URL.revokeObjectURL(url);
        }} style={{ width: "100%", padding: "11px", borderRadius: 10, border: "1.5px solid rgba(0,0,0,.1)", background: "#fff", cursor: "pointer", fontWeight: 700, fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          {t.account.exportCsv}
        </button>
        <div style={{ fontSize: 12, color: C.muted, marginTop: 10, marginBottom: 8, lineHeight: 1.5 }}>{t.account?.exportPdfDesc || "Download a branded PDF statement \u2014 useful for tax prep, rental verification, or visa applications."}</div>
        <button onClick={exportPaymentPdf} style={{ width: "100%", padding: "11px", borderRadius: 10, border: "1.5px solid " + hexRgba(C.accent, .2), background: hexRgba(C.accent, .04), cursor: "pointer", fontWeight: 700, fontSize: 13, color: C.accent, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
          {t.account?.exportPdf || "Export Payment Statement (PDF)"}
        </button>
      </div>

      {(pmSettings?.referralCredit || 0) > 0 && (
        <div style={sCard}>
          <span style={sLabel}>{t.account.referFriend}</span>
          <div style={{ fontSize: 12, color: C.muted, lineHeight: 1.6, marginBottom: 12 }}>
            {t.account.referDesc} When they sign a lease, you{"\u2019"}ll earn a <strong style={{ color: C.green }}>${pmSettings.referralCredit} credit</strong> on your next month{"\u2019"}s rent.
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <div style={{ flex: 1, padding: "10px 12px", borderRadius: 8, border: "1.5px solid rgba(0,0,0,.1)", fontSize: 11, fontFamily: "monospace", color: C.muted, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{referralLink}</div>
            <button onClick={copyReferral} style={{ padding: "10px 16px", borderRadius: 8, border: "none", background: C.bg, color: C.accent, fontWeight: 700, fontSize: 12, cursor: "pointer", whiteSpace: "nowrap" }}>{referralCopied ? t.account.copied : t.account.copyLink}</button>
          </div>
        </div>
      )}

      <div style={sCard}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <span style={sLabel}>{t.account.notifications}</span>
          <div style={{ display: "flex", gap: 6 }}>
            <button onClick={() => bulkSet(true)} disabled={allOn} style={{ padding: "4px 10px", borderRadius: 6, border: "1.5px solid " + (allOn ? hexRgba(C.green, .3) : "rgba(0,0,0,.1)"), background: allOn ? hexRgba(C.green, .06) : "#fff", color: allOn ? C.green : C.muted, fontSize: 10, fontWeight: 700, cursor: allOn ? "default" : "pointer" }}>All On</button>
            <button onClick={() => bulkSet(false)} disabled={allOff} style={{ padding: "4px 10px", borderRadius: 6, border: "1.5px solid " + (allOff ? hexRgba(C.red, .3) : "rgba(0,0,0,.1)"), background: allOff ? hexRgba(C.red, .06) : "#fff", color: allOff ? C.red : C.muted, fontSize: 10, fontWeight: 700, cursor: allOff ? "default" : "pointer" }}>All Off</button>
          </div>
        </div>
        <div style={{ fontSize: 11, color: C.muted, marginBottom: 14, lineHeight: 1.5 }}>{t.account.notifDesc}</div>
        {NOTIF_ITEMS.map((item, i, arr) => {
          const pref = notifPrefs[item.key] || { email: false, text: false };
          return (
            <div key={item.key} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 0", borderBottom: i < arr.length - 1 ? "1px solid rgba(0,0,0,.04)" : "none" }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{item.label}</div>
                <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>{item.desc}</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 8, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: .5, marginBottom: 3 }}>Email</div>
                  <Toggle on={pref.email} onClick={() => toggle(item.key, "email")} />
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 8, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: .5, marginBottom: 3 }}>Text</div>
                  <Toggle on={pref.text} onClick={() => toggle(item.key, "text")} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ ...sCard, background: hexRgba(C.accent, .04), border: `1px solid ${hexRgba(C.accent, .15)}` }}>
        <span style={sLabel}>{t.account.propertyManager}</span>
        <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 4 }}>{pm.company_name}</div>
        {pm.phone && <div style={{ fontSize: 12, color: C.muted, display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.16 12a19.79 19.79 0 0 1-3-8.57A2 2 0 0 1 3.13 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 9.91"/></svg>{pm.phone}</div>}
        {pmSettings?.email && <div style={{ fontSize: 12, color: C.muted, display: "flex", alignItems: "center", gap: 6 }}><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 7l-10 7L2 7"/></svg>{pmSettings.email}</div>}
      </div>

      <div style={sCard}>
        <span style={sLabel}>{t.darkMode?.label || "Dark Mode"}</span>
        <div style={{ display: "flex", gap: 6 }}>
          {[["light", t.darkMode?.light || "Light"], ["dark", t.darkMode?.dark || "Dark"], ["system", t.darkMode?.system || "System"]].map(([val, label]) => (
            <button key={val} onClick={() => setDarkMode(val)} style={{ flex: 1, padding: "8px", borderRadius: 8, border: "1.5px solid " + (darkMode === val ? C.accent : "rgba(0,0,0,.1)"), background: darkMode === val ? hexRgba(C.accent, .08) : "#fff", cursor: "pointer", fontSize: 11, fontWeight: darkMode === val ? 700 : 500, color: darkMode === val ? C.accent : C.muted, display: "flex", alignItems: "center", justifyContent: "center", gap: 5 }} aria-label={"Set theme to " + val}>
              {val === "light" && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>}
              {val === "dark" && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>}
              {val === "system" && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>}
              {label}
            </button>
          ))}
        </div>
      </div>

      <div style={sCard}>
        <span style={sLabel}>Recent Activity</span>
        {fullAuditLog.length === 0 && <div style={{ fontSize: 12, color: "#999" }}>{t.auditLog?.noActivity || "No activity recorded yet."}</div>}
        {(auditExpanded ? fullAuditLog : fullAuditLog.slice(0, 5)).map(entry => {
          const iconMap = { charge: "M12 1v22 M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6", payment: "M20 6L9 17l-5-5", maintenance: "M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z", lease: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6", document: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6", guest: "M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z", insurance: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" };
          const colorMap = { charge: C.accent, payment: C.green, maintenance: "#3b82f6", lease: C.accent, document: C.muted, guest: C.muted, insurance: C.green };
          return (
            <div key={entry.id} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "8px 0", borderBottom: "1px solid rgba(0,0,0,.03)" }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={colorMap[entry.type] || C.muted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 2 }}><path d={iconMap[entry.type] || iconMap.document}/></svg>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 11, color: C.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{entry.description}</div>
                <div style={{ fontSize: 10, color: "#999" }}>{fmtD(entry.date?.split?.("T")?.[0] || entry.date)}</div>
              </div>
            </div>
          );
        })}
        {fullAuditLog.length > 5 && !auditExpanded && <button onClick={() => setAuditExpanded(true)} style={{ width: "100%", marginTop: 8, padding: "8px", borderRadius: 6, border: "1.5px solid rgba(0,0,0,.08)", background: "transparent", cursor: "pointer", fontSize: 10, fontWeight: 600, color: C.accent }}>View All ({fullAuditLog.length})</button>}
      </div>

      <button onClick={() => { if (window.confirm("Are you sure you want to sign out?")) signOut(); }} style={{ width: "100%", padding: "13px", borderRadius: 12, border: `1.5px solid ${hexRgba(C.red, .2)}`, background: hexRgba(C.red, .04), color: C.red, fontWeight: 700, fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 24 }}>
        <IcLogout s={16} /> {t.account.signOut}
      </button>
      <div style={{ textAlign: "center", fontSize: 11, color: "#bbb" }}>{t.common.poweredBy}</div>
    </div>
  );
}
