"use client";
import { hexRgba, fmtD } from "./PortalShared";

export default function NotificationCenter({ notifOpen, setNotifOpen, notifRef, notifItems, newNotifCount, markNotifsRead, C, t }) {
  return (
    <div ref={notifRef} style={{ position: "relative" }}>
      <button onClick={() => { setNotifOpen(!notifOpen); if (!notifOpen) markNotifsRead(); }} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,.5)", padding: 4, display: "flex", position: "relative" }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
        {newNotifCount > 0 && <span style={{ position: "absolute", top: 0, right: 0, minWidth: 14, height: 14, borderRadius: 7, background: C.red, color: "#fff", fontSize: 8, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 3px", border: "2px solid " + C.bg }}>{newNotifCount > 9 ? "9+" : newNotifCount}</span>}
      </button>
      {notifOpen && (
        <div style={{ position: "absolute", right: 0, top: "100%", marginTop: 8, width: 320, maxHeight: 400, overflowY: "auto", background: "#fff", borderRadius: 12, boxShadow: "0 8px 32px rgba(0,0,0,.18)", border: "1px solid rgba(0,0,0,.08)", zIndex: 300 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", borderBottom: "1px solid rgba(0,0,0,.06)" }}>
            <span style={{ fontSize: 13, fontWeight: 800, color: C.text }}>{t.notifications?.title || "Notifications"}</span>
            {newNotifCount > 0 && <span style={{ fontSize: 10, color: C.accent, fontWeight: 600 }}>{newNotifCount} {t.notifications?.sinceLastVisit || "new"}</span>}
          </div>
          {notifItems.length === 0 && <div style={{ padding: 24, textAlign: "center", fontSize: 12, color: "#999" }}>{t.notifications?.noNew || "You're all caught up"}</div>}
          {notifItems.slice(0, 20).map(n => {
            const iconMap = {
              charge: "M12 1v22 M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6",
              payment: "M20 6L9 17l-5-5",
              maintenance: "M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z",
              announcement: "M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM12 16v-4M12 8h.01",
              message: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z",
            };
            const colorMap = { charge: C.accent, payment: C.green, maintenance: "#3b82f6", announcement: C.accent, message: C.muted };
            return (
              <div key={n.id} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "10px 16px", borderBottom: "1px solid rgba(0,0,0,.03)", background: n.isNew ? hexRgba(C.accent, .04) : "transparent" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={colorMap[n.type] || C.muted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 2 }}><path d={iconMap[n.type] || iconMap.announcement}/></svg>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: n.isNew ? 700 : 500, color: C.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{n.title}</div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 2 }}>
                    <span style={{ fontSize: 10, color: "#999" }}>{fmtD(n.date?.split?.("T")?.[0] || n.date)}</span>
                    {n.amount && <span style={{ fontSize: 10, fontWeight: 700, color: n.type === "payment" ? C.green : C.text }}>{n.amount}</span>}
                  </div>
                </div>
                {n.isNew && <div style={{ width: 6, height: 6, borderRadius: 3, background: C.accent, flexShrink: 0, marginTop: 6 }}/>}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
