"use client";
import { useState } from "react";

export default function Announcements({ settings, setSettings, save, properties, uid }) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", body: "", propertyId: "", expiresAt: "" });
  const _acc = settings?.adminAccent || "#4a7c59";

  const announcements = settings?.announcements || [];
  const activeCount = announcements.filter(a => !a.expiresAt || a.expiresAt > new Date().toISOString()).length;

  const post = () => {
    if (!form.title.trim() || !form.body.trim()) return;
    const newAnn = {
      id: uid(), title: form.title, body: form.body,
      propertyId: form.propertyId || null,
      createdAt: new Date().toISOString(),
      expiresAt: form.expiresAt ? new Date(form.expiresAt + "T23:59:59").toISOString() : null,
    };
    const updated = { ...settings, announcements: [newAnn, ...announcements] };
    setSettings(updated);
    save("hq-settings", updated);
    setForm({ title: "", body: "", propertyId: "", expiresAt: "" });
    setShowForm(false);
  };

  const remove = (id) => {
    const updated = { ...settings, announcements: announcements.filter(a => a.id !== id) };
    setSettings(updated);
    save("hq-settings", updated);
  };

  const fmtDate = (iso) => {
    if (!iso) return "";
    return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  const isExpired = (a) => a.expiresAt && new Date(a.expiresAt) < new Date();
  const propName = (id) => { if (!id) return "All Properties"; const p = (properties || []).find(x => x.id === id); return p?.name || p?.addr || id; };

  return (
    <>
      <div className="sec-hd" style={{ marginBottom: 16 }}>
        <div>
          <h2>Announcements</h2>
          <p>{activeCount} active announcement{activeCount !== 1 ? "s" : ""} showing in tenant portal</p>
        </div>
        <button className="btn btn-gold" onClick={() => setShowForm(!showForm)}>
          {showForm ? "Cancel" : "+ New Announcement"}
        </button>
      </div>

      {/* Composer */}
      {showForm && (
        <div className="card" style={{ marginBottom: 16 }}>
          <div className="card-bd">
            <div className="fld">
              <label>Title</label>
              <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. Water shut-off notice" style={{ width: "100%" }} />
            </div>
            <div className="fld">
              <label>Message</label>
              <textarea value={form.body} onChange={e => setForm(f => ({ ...f, body: e.target.value }))} placeholder="Write your announcement..." rows={3} style={{ width: "100%", padding: "8px 10px", borderRadius: 6, border: "1px solid rgba(0,0,0,.1)", fontSize: 12, fontFamily: "inherit", resize: "vertical" }} />
            </div>
            <div className="fr">
              <div className="fld">
                <label>Property <span style={{ fontWeight: 400, color: "#6b5e52" }}>(optional, blank = all)</span></label>
                <select value={form.propertyId} onChange={e => setForm(f => ({ ...f, propertyId: e.target.value }))} style={{ width: "100%" }}>
                  <option value="">All Properties</option>
                  {(properties || []).map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
              <div className="fld">
                <label>Expires <span style={{ fontWeight: 400, color: "#6b5e52" }}>(optional, blank = never)</span></label>
                <input type="date" value={form.expiresAt} onChange={e => setForm(f => ({ ...f, expiresAt: e.target.value }))} style={{ width: "100%" }} />
              </div>
            </div>
            <button className="btn btn-gold" disabled={!form.title.trim() || !form.body.trim()} onClick={post} style={{ width: "100%", marginTop: 8 }}>
              Post Announcement
            </button>
          </div>
        </div>
      )}

      {/* List */}
      {announcements.length === 0 ? (
        <div className="card"><div className="card-bd" style={{ textAlign: "center", padding: 48 }}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#c4a882" strokeWidth="1.25" style={{ marginBottom: 12 }}><path d="M3 11l18-5v12L3 13v-2z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/></svg>
          <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 6 }}>No announcements yet</div>
          <div style={{ fontSize: 12, color: "#6b5e52" }}>Post an announcement to notify all tenants through their portal.</div>
        </div></div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {announcements.map(a => {
            const expired = isExpired(a);
            return (
              <div key={a.id} className="card" style={{ opacity: expired ? 0.5 : 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "14px 16px" }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                      <div style={{ fontSize: 14, fontWeight: 700 }}>{a.title}</div>
                      {expired && <span style={{ fontSize: 9, fontWeight: 700, padding: "2px 8px", borderRadius: 99, background: "rgba(0,0,0,.06)", color: "#999" }}>EXPIRED</span>}
                      {!expired && <span style={{ fontSize: 9, fontWeight: 700, padding: "2px 8px", borderRadius: 99, background: "rgba(74,124,89,.1)", color: "#4a7c59" }}>ACTIVE</span>}
                    </div>
                    <div style={{ fontSize: 12, color: "#5c4a3a", lineHeight: 1.6, whiteSpace: "pre-wrap", marginBottom: 6 }}>{a.body}</div>
                    <div style={{ fontSize: 10, color: "#999", display: "flex", gap: 12 }}>
                      <span>Posted {fmtDate(a.createdAt)}</span>
                      <span>{propName(a.propertyId)}</span>
                      {a.expiresAt && <span>Expires {fmtDate(a.expiresAt)}</span>}
                    </div>
                  </div>
                  <button onClick={() => remove(a.id)} style={{ background: "none", border: "none", color: "#c45c4a", cursor: "pointer", fontSize: 16, padding: "0 4px", flexShrink: 0 }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
