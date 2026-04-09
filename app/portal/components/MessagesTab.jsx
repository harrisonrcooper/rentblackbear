"use client";
import { useState, useRef } from "react";
import { esc, supabase } from "./PortalShared";

export default function MessagesTab({
  tenant, C, t, pm, pmSettings, user,
  tenantMessages, setTenantMessages,
  msgInput, setMsgInput,
  portalHoveredMsg, setPortalHoveredMsg,
  portalShowReactions, setPortalShowReactions,
  portalMsgCountRef,
}) {
  const PORTAL_REACTIONS = [
    { emoji: "\u2764\uFE0F", label: "heart" }, { emoji: "\uD83D\uDC4D", label: "thumbsup" }, { emoji: "\uD83D\uDC4E", label: "thumbsdown" },
    { emoji: "\uD83D\uDE02", label: "laugh" }, { emoji: "\u203C\uFE0F", label: "exclaim" }, { emoji: "\u2753", label: "question" },
  ];
  const QUICK_REPLIES = ["Got it", "Thanks!", "On my way", "Sounds good"];
  const [attachPreview, setAttachPreview] = useState(null);
  const fileInputRef = useRef(null);
  const visibleMsgs = tenantMessages.filter(msg => msg.direction !== "note");
  const fmtMsgTime = (iso) => { if (!iso) return ""; const d = new Date(iso); return d.toLocaleDateString("en-US", { month: "numeric", day: "numeric", year: "numeric" }) + " " + d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }); };
  const fmtMsgDateGroup = (iso) => { if (!iso) return ""; const d = new Date(iso); const now = new Date(); const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()); const msgDay = new Date(d.getFullYear(), d.getMonth(), d.getDate()); const diff = Math.floor((today - msgDay) / 86400000); if (diff === 0) return "Today"; if (diff === 1) return "Yesterday"; if (diff < 7) return d.toLocaleDateString("en-US", { weekday: "long" }); return d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }); };
  const togglePortalReaction = async (msgId, label) => {
    const msg = tenantMessages.find(m => m.id === msgId); if (!msg) return;
    const reactions = { ...(msg.reactions || {}) };
    const reacted = (reactions[label] || []).includes("tenant");
    if (reacted) { reactions[label] = (reactions[label] || []).filter(r => r !== "tenant"); if (reactions[label].length === 0) delete reactions[label]; }
    else { reactions[label] = [...(reactions[label] || []), "tenant"]; }
    await supabase.from("messages").update({ reactions }).eq("id", msgId);
    setTenantMessages(prev => prev.map(m => m.id === msgId ? { ...m, reactions } : m));
  };

  // Mark outbound messages as read when viewed
  const markRead = async () => {
    const unread = visibleMsgs.filter(m => m.direction === "outbound" && !m.read_at);
    if (unread.length === 0) return;
    const ids = unread.map(m => m.id);
    const now = new Date().toISOString();
    await supabase.from("messages").update({ read_at: now }).in("id", ids);
    setTenantMessages(prev => prev.map(m => ids.includes(m.id) ? { ...m, read_at: now } : m));
  };
  // Mark as read on mount / new messages
  useState(() => { setTimeout(markRead, 500); });

  const sendMessage = async (body) => {
    const text = (body || msgInput).trim();
    if (!text && !attachPreview) return;
    if (!body) setMsgInput("");
    const tenantName = tenant?.name || "Tenant";
    const msgData = { tenant_id: tenant?.id, tenant_name: tenantName, sender_email: user?.email || "", sender_name: tenantName, direction: "inbound", subject: "", body: text, property_name: tenant?.property?.name || "", room_name: tenant?.room?.name || "", read: false };
    if (attachPreview) {
      msgData.attachments = [{ type: attachPreview.type, name: attachPreview.name, data: attachPreview.data }];
      setAttachPreview(null);
    }
    await supabase.from("messages").insert(msgData);
    try { await fetch("/api/send-email", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ to: pmSettings?.pmEmail || pmSettings?.email || "", subject: "Portal Message from " + tenantName, html: "<p>" + esc(text).replace(/\n/g, "<br/>") + "</p>" + (msgData.attachments ? "<p><em>1 attachment</em></p>" : ""), replyTo: user?.email || "" }) }); } catch (ex) {}
    const { data: msgs } = await supabase.from("messages").select("*").eq("tenant_name", tenantName).order("created_at", { ascending: true });
    setTenantMessages(msgs || []);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) return; // 5MB max
    const reader = new FileReader();
    reader.onload = () => {
      setAttachPreview({ name: file.name, type: file.type.startsWith("image/") ? "image" : "file", data: reader.result });
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  return (
    <div style={{ animation: "fadeIn .2s" }}>
      <style>{`
        @keyframes portalMsgIn{from{opacity:0;transform:translateY(8px) scale(.97)}to{opacity:1;transform:translateY(0) scale(1)}}
        @keyframes portalReactPop{0%{transform:scale(0)}50%{transform:scale(1.3)}100%{transform:scale(1)}}
        @keyframes portalTapbackIn{from{opacity:0;transform:translateX(-50%) scale(.4) translateY(-4px)}to{opacity:1;transform:translateX(-50%) scale(1) translateY(0)}}
        .portal-msg{animation:portalMsgIn .25s cubic-bezier(.23,1,.32,1)}
        .portal-react-badge{animation:portalReactPop .35s cubic-bezier(.34,1.56,.64,1)}
        .portal-tapback{animation:portalTapbackIn .2s cubic-bezier(.23,1,.32,1)}
        .portal-react-btn:hover{transform:scale(1.4)!important;background:rgba(0,0,0,.06)!important}
        .portal-react-btn:active{transform:scale(1.1)!important}
        .portal-action-btn:hover{transform:scale(1.25);background:rgba(0,0,0,.12)!important}
        .portal-msg-scroll::-webkit-scrollbar{width:5px}
        .portal-msg-scroll::-webkit-scrollbar-track{background:transparent}
        .portal-msg-scroll::-webkit-scrollbar-thumb{background:rgba(0,0,0,.1);border-radius:3px}
        .portal-tail-out::after{content:'';position:absolute;bottom:0;right:-6px;width:12px;height:12px;background:#007AFF;clip-path:polygon(0 0, 0% 100%, 100% 100%);border-bottom-right-radius:4px}
        .portal-tail-in::after{content:'';position:absolute;bottom:0;left:-6px;width:12px;height:12px;background:rgba(255,255,255,.85);clip-path:polygon(100% 0, 0% 100%, 100% 100%);border-bottom-left-radius:4px}
      `}</style>
      <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 16 }}>Messages</h2>

      <div style={{ borderRadius: 16, overflow: "hidden", background: "linear-gradient(180deg, #f8f8fa 0%, #eeeef2 100%)", boxShadow: "0 2px 12px rgba(0,0,0,.06)", display: "flex", flexDirection: "column" }}>
        <div className="portal-msg-scroll" onClick={() => setPortalShowReactions(null)} ref={el => { if (el && tenantMessages.length !== portalMsgCountRef.current) { portalMsgCountRef.current = tenantMessages.length; setTimeout(() => el.scrollTop = el.scrollHeight, 50); } }} style={{ flex: 1, overflowY: "auto", padding: "16px 16px 8px", maxHeight: 450, minHeight: 300 }}>
          {visibleMsgs.length === 0 && (
            <div style={{ textAlign: "center", padding: 40, color: "#8e8e93" }}>
              <div style={{ width: 48, height: 48, borderRadius: 24, background: "rgba(0,122,255,.08)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#007AFF" strokeWidth="1.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
              </div>
              <div style={{ fontSize: 14, fontWeight: 600, color: "#1a1714" }}>No messages yet</div>
              <div style={{ fontSize: 12, marginTop: 4 }}>Send a message to your property manager below.</div>
            </div>
          )}
          {visibleMsgs.map((msg, i) => {
            const isMe = msg.direction === "inbound";
            const prev = visibleMsgs[i - 1];
            const next = visibleMsgs[i + 1];
            const showDateGroup = !prev || fmtMsgDateGroup(prev.created_at) !== fmtMsgDateGroup(msg.created_at);
            const timeDiff = prev ? (new Date(msg.created_at) - new Date(prev.created_at)) / 60000 : 999;
            const showTimeGap = timeDiff > 5 || showDateGroup;
            const groupedPrev = prev && prev.direction === msg.direction && !showTimeGap;
            const groupedNext = next && next.direction === msg.direction && fmtMsgDateGroup(next?.created_at) === fmtMsgDateGroup(msg.created_at) && (next ? (new Date(next.created_at) - new Date(msg.created_at)) / 60000 <= 5 : false);
            const isLast = !groupedNext;
            const reactions = msg.reactions || {};
            const hasReactions = Object.keys(reactions).length > 0;
            const attachments = msg.attachments || [];
            return (
              <div key={msg.id}>
                {showDateGroup && <div style={{ textAlign: "center", margin: "20px 0 12px", fontSize: 11, fontWeight: 600, color: "#3a3a3c" }}>{fmtMsgDateGroup(msg.created_at)}</div>}
                {!showDateGroup && showTimeGap && <div style={{ textAlign: "center", margin: "12px 0 8px", fontSize: 10, color: "#3a3a3c", fontWeight: 500 }}>{fmtMsgTime(msg.created_at)}</div>}
                <div className="portal-msg" style={{ display: "flex", justifyContent: isMe ? "flex-end" : "flex-start", marginTop: hasReactions ? 14 : 0, marginBottom: portalShowReactions === msg.id ? 52 : (groupedNext ? 2 : 8), position: "relative" }}
                  onMouseEnter={() => setPortalHoveredMsg(msg.id)} onMouseLeave={() => setPortalHoveredMsg(null)}>
                  {isMe && portalHoveredMsg === msg.id && (
                    <button className="portal-action-btn" onClick={e => { e.stopPropagation(); setPortalShowReactions(portalShowReactions === msg.id ? null : msg.id); }} title="React" style={{ width: 26, height: 26, borderRadius: 13, border: "none", background: "rgba(0,0,0,.08)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginRight: 4, alignSelf: "center", transition: "transform .15s ease, background .15s ease" }}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#6b6b6e" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>
                    </button>
                  )}
                  {!isMe && (
                    <div style={{ width: 26, minWidth: 26, marginRight: 6, alignSelf: "flex-end" }}>
                      {isLast ? (
                        <div style={{ width: 26, height: 26, borderRadius: 13, background: "linear-gradient(135deg, #007AFF 0%, #5856D6 100%)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700 }}>
                          {(pm.company_name || "PM")[0].toUpperCase()}
                        </div>
                      ) : <div style={{ width: 26 }} />}
                    </div>
                  )}
                  <div
                    className={isLast ? (isMe ? "portal-tail-out" : "portal-tail-in") : ""}
                    style={{
                      maxWidth: "72%", padding: "9px 14px", borderRadius: 18, position: "relative", wordBreak: "break-word", overflowWrap: "anywhere",
                      background: isMe ? "#007AFF" : "rgba(255,255,255,.85)",
                      color: isMe ? "#fff" : "#1a1714",
                      borderBottomRightRadius: isMe ? 4 : 18, borderBottomLeftRadius: isMe ? 18 : 4,
                      boxShadow: isMe ? "0 1px 3px rgba(0,122,255,.2)" : "0 1px 3px rgba(0,0,0,.06)",
                      backdropFilter: isMe ? "none" : "blur(12px)",
                      ...(groupedPrev && isMe ? { borderTopRightRadius: 6 } : {}),
                      ...(groupedPrev && !isMe ? { borderTopLeftRadius: 6 } : {}),
                      ...(groupedNext && isMe ? { borderBottomRightRadius: 6 } : {}),
                      ...(groupedNext && !isMe ? { borderBottomLeftRadius: 6 } : {}),
                    }}>
                    {msg.subject && <div style={{ fontSize: 10, fontWeight: 700, opacity: .6, marginBottom: 3 }}>{msg.subject}</div>}
                    {/* Attachments */}
                    {attachments.length > 0 && (
                      <div style={{ marginBottom: msg.body ? 6 : 0 }}>
                        {attachments.map((att, ai) => att.type === "image" ? (
                          <img key={ai} src={att.data} alt={att.name || "attachment"} style={{ maxWidth: "100%", borderRadius: 10, marginBottom: 4, cursor: "pointer" }} onClick={() => window.open(att.data, "_blank")} />
                        ) : (
                          <div key={ai} style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 10px", background: isMe ? "rgba(255,255,255,.15)" : "rgba(0,0,0,.04)", borderRadius: 8, marginBottom: 4, fontSize: 11 }}>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/></svg>
                            {att.name || "Attachment"}
                          </div>
                        ))}
                      </div>
                    )}
                    {msg.body && <div style={{ fontSize: 13, lineHeight: 1.55, whiteSpace: "pre-wrap" }}>{msg.original_body || msg.body}</div>}
                    {isLast && (
                      <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 3 }}>
                        <span style={{ fontSize: 9, color: isMe ? "rgba(255,255,255,.7)" : "#3a3a3c", fontWeight: 500 }}>{fmtMsgTime(msg.created_at)}</span>
                        {/* Read receipt for outbound PM messages */}
                        {!isMe && msg.read_at && (
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={isMe ? "rgba(255,255,255,.7)" : "#007AFF"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                        )}
                        {/* Delivered indicator for tenant messages */}
                        {isMe && (
                          <span style={{ fontSize: 9, color: "rgba(255,255,255,.5)", fontWeight: 500 }}>
                            {msg.read ? "Read" : "Delivered"}
                          </span>
                        )}
                      </div>
                    )}
                    {portalShowReactions === msg.id && (
                      <div className="portal-tapback" style={{ display: "flex", gap: 4, position: "absolute", bottom: -48, left: "50%", transform: "translateX(-50%)", background: "rgba(255,255,255,.95)", backdropFilter: "blur(20px) saturate(180%)", borderRadius: 24, boxShadow: "0 4px 20px rgba(0,0,0,.12), 0 0 0 .5px rgba(0,0,0,.08)", padding: "6px 10px", zIndex: 10 }} onClick={e => e.stopPropagation()}>
                        {PORTAL_REACTIONS.map(r => {
                          const active = (reactions[r.label] || []).includes("tenant");
                          return (
                            <button key={r.label} className="portal-react-btn" onClick={() => { togglePortalReaction(msg.id, r.label); setPortalShowReactions(null); }} style={{ width: 36, height: 36, borderRadius: 18, border: "none", background: active ? "rgba(0,122,255,.12)" : "transparent", cursor: "pointer", fontSize: 20, display: "flex", alignItems: "center", justifyContent: "center", transition: "transform .15s cubic-bezier(.34,1.56,.64,1), background .15s ease" }}>{r.emoji}</button>
                          );
                        })}
                      </div>
                    )}
                    {hasReactions && (
                      <div className="portal-react-badge" style={{ position: "absolute", top: -8, [isMe ? "left" : "right"]: -4, background: "#fff", borderRadius: 12, padding: "2px 5px", fontSize: 14, lineHeight: 1, boxShadow: "0 2px 8px rgba(0,0,0,.12), 0 0 0 .5px rgba(0,0,0,.06)", display: "flex", alignItems: "center", gap: 2, zIndex: 3 }}>
                        {Object.entries(reactions).map(([key, users]) => {
                          const r = PORTAL_REACTIONS.find(x => x.label === key);
                          return r ? <span key={key} style={{ cursor: "pointer" }} onClick={() => togglePortalReaction(msg.id, key)}>{r.emoji}</span> : null;
                        })}
                        {Object.values(reactions).reduce((s, u) => s + u.length, 0) > 1 && <span style={{ fontSize: 10, color: "#8e8e93", marginLeft: 1 }}>{Object.values(reactions).reduce((s, u) => s + u.length, 0)}</span>}
                      </div>
                    )}
                  </div>
                  {!isMe && portalHoveredMsg === msg.id && (
                    <button className="portal-action-btn" onClick={e => { e.stopPropagation(); setPortalShowReactions(portalShowReactions === msg.id ? null : msg.id); }} title="React" style={{ width: 26, height: 26, borderRadius: 13, border: "none", background: "rgba(0,0,0,.08)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginLeft: 4, alignSelf: "center", transition: "transform .15s ease, background .15s ease" }}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#6b6b6e" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick replies */}
        {visibleMsgs.length > 0 && visibleMsgs[visibleMsgs.length - 1]?.direction === "outbound" && (
          <div style={{ padding: "6px 14px 2px", display: "flex", gap: 6, overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
            {QUICK_REPLIES.map(qr => (
              <button key={qr} onClick={() => sendMessage(qr)} style={{ padding: "5px 12px", borderRadius: 14, border: "1px solid rgba(0,122,255,.2)", background: "rgba(0,122,255,.06)", color: "#007AFF", fontSize: 11, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap", fontFamily: "inherit", flexShrink: 0 }}>{qr}</button>
            ))}
          </div>
        )}

        {/* Attachment preview */}
        {attachPreview && (
          <div style={{ padding: "8px 14px 0", display: "flex", alignItems: "center", gap: 8 }}>
            {attachPreview.type === "image" ? (
              <img src={attachPreview.data} alt="" style={{ width: 48, height: 48, objectFit: "cover", borderRadius: 8, border: "1px solid rgba(0,0,0,.1)" }} />
            ) : (
              <div style={{ display: "flex", alignItems: "center", gap: 4, padding: "6px 10px", background: "rgba(0,0,0,.04)", borderRadius: 8, fontSize: 11, color: "#1a1714" }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/></svg>
                {attachPreview.name}
              </div>
            )}
            <button onClick={() => setAttachPreview(null)} style={{ width: 20, height: 20, borderRadius: 10, border: "none", background: "rgba(0,0,0,.1)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: 0 }}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="3" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>
          </div>
        )}

        {/* Input bar */}
        <div style={{ padding: "10px 14px", borderTop: "1px solid rgba(0,0,0,.06)", display: "flex", gap: 8, alignItems: "flex-end", background: "rgba(255,255,255,.72)", backdropFilter: "blur(20px) saturate(180%)" }}>
          <input type="file" ref={fileInputRef} style={{ display: "none" }} accept="image/*,.pdf,.doc,.docx" onChange={handleFileSelect} />
          <button onClick={() => fileInputRef.current?.click()} style={{ width: 36, height: 36, borderRadius: 18, border: "none", background: "rgba(0,0,0,.04)", color: "#8e8e93", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }} title="Attach file">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
          </button>
          <input
            value={msgInput}
            onChange={e => setMsgInput(e.target.value)}
            onKeyDown={async e => { if (e.key === "Enter" && !e.shiftKey && (msgInput.trim() || attachPreview)) { e.preventDefault(); await sendMessage(); } }}
            placeholder="Type a message..."
            style={{ flex: 1, padding: "10px 14px", borderRadius: 20, border: "1px solid rgba(0,0,0,.08)", fontSize: 13, fontFamily: "inherit", outline: "none", background: "rgba(0,0,0,.04)" }}
          />
          <button onClick={() => sendMessage()} style={{ width: 36, height: 36, borderRadius: 18, border: "none", background: (msgInput.trim() || attachPreview) ? "#007AFF" : "rgba(0,0,0,.08)", color: (msgInput.trim() || attachPreview) ? "#fff" : "#bbb", cursor: (msgInput.trim() || attachPreview) ? "pointer" : "default", display: "flex", alignItems: "center", justifyContent: "center", transition: "all .2s ease", flexShrink: 0 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
          </button>
        </div>
      </div>

      <div style={{ marginTop: 12, padding: "10px 14px", background: "rgba(0,0,0,.03)", borderRadius: 10, fontSize: 11, color: "#8e8e93", display: "flex", alignItems: "center", gap: 8 }}>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
        {pm.company_name}{pm.phone ? " \u00b7 " + pm.phone : ""}{pmSettings?.email ? " \u00b7 " + pmSettings.email : ""}
      </div>
    </div>
  );
}
