"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// ── Helpers ────────────────────────────────────────────────────────
const fmtTime = (iso) => {
  if (!iso) return "";
  const d = new Date(iso);
  const now = new Date();
  const diffMs = now - d;
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return "Just now";
  if (diffMin < 60) return diffMin + "m ago";
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  if (diffHr < 48) return "Yesterday " + d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" }) + " " + d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
};

const fmtDateGroup = (iso) => {
  if (!iso) return "";
  const d = new Date(iso);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const msgDay = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const diffDays = Math.floor((today - msgDay) / 86400000);
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return d.toLocaleDateString("en-US", { weekday: "long" });
  return d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
};

const REACTIONS = [
  { emoji: "\ud83d\udc4d", label: "thumbsup" },
  { emoji: "\u2764\ufe0f", label: "heart" },
  { emoji: "\ud83d\ude02", label: "laugh" },
  { emoji: "\ud83d\ude2e", label: "surprised" },
  { emoji: "\ud83d\udc4e", label: "thumbsdown" },
];

const DEFAULT_SAVED_REPLIES = [
  "We'll look into this right away.",
  "Thanks for letting us know. A team member will follow up shortly.",
  "Maintenance has been scheduled. We'll update you with a date and time.",
  "Your request has been received and is being reviewed.",
  "Please call us at the office if this is urgent.",
  "That's been taken care of. Let us know if there's anything else.",
];

const TAG_OPTIONS = ["maintenance", "billing", "lease", "general", "urgent"];
const TAG_COLORS = { maintenance: "#3b82f6", billing: "#d4a853", lease: "#4a7c59", general: "#999", urgent: "#c45c4a" };

const COMMON_EMOJIS = [
  "\ud83d\ude00","\ud83d\ude02","\ud83d\ude0a","\ud83d\ude0d","\ud83e\udd14","\ud83d\udc4d","\ud83d\udc4e","\ud83d\udc4b","\ud83d\ude4f","\u2764\ufe0f",
  "\ud83d\udd25","\ud83c\udf89","\u2705","\u274c","\ud83d\udcaa","\ud83c\udfaf","\ud83d\udce7","\ud83d\udd11","\ud83c\udfe0","\ud83d\udee0\ufe0f",
  "\ud83d\udcb0","\ud83d\udcc5","\ud83d\udce2","\ud83d\udca1","\u23f0","\ud83d\ude80","\ud83c\udf1f","\ud83d\udccc","\ud83d\udcde","\u270f\ufe0f",
];

// ── Styles ─────────────────────────────────────────────────────────
const S = {
  wrap: { display: "flex", gap: 0, border: "1px solid rgba(0,0,0,.07)", borderRadius: 14, overflow: "hidden", height: "calc(100vh - 200px)", minHeight: 500, maxHeight: "calc(100vh - 200px)", background: "#fff" },
  threadList: { width: 300, borderRight: "1px solid rgba(0,0,0,.06)", display: "flex", flexDirection: "column", background: "#fafaf8" },
  threadSearch: { padding: "12px 14px", borderBottom: "1px solid rgba(0,0,0,.06)" },
  threadScroll: { flex: 1, overflowY: "auto" },
  threadItem: (active, unread) => ({ padding: "14px 16px", cursor: "pointer", borderBottom: "1px solid rgba(0,0,0,.03)", background: active ? "#fff" : "transparent", borderLeft: active ? "3px solid" : "3px solid transparent", transition: "all .1s", position: "relative" }),
  chatArea: { flex: 1, display: "flex", flexDirection: "column", background: "#fff", minWidth: 0, overflow: "hidden" },
  chatHeader: { padding: "14px 20px", borderBottom: "1px solid rgba(0,0,0,.06)", display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0, background: "#fff", zIndex: 2 },
  chatScroll: { flex: 1, minHeight: 0, overflowY: "auto", padding: "16px 20px" },
  chatInput: { padding: "12px 16px", borderTop: "1px solid rgba(0,0,0,.06)", display: "flex", gap: 8, alignItems: "flex-end", flexShrink: 0 },
  bubble: (isOut, _acc) => ({ maxWidth: "72%", padding: "10px 14px", borderRadius: 18, background: isOut ? _acc : "#f0efec", color: isOut ? "#fff" : "#1a1714", borderBottomRightRadius: isOut ? 6 : 18, borderBottomLeftRadius: isOut ? 18 : 6, position: "relative", wordBreak: "break-word", overflowWrap: "anywhere" }),
  dateGroup: { textAlign: "center", margin: "16px 0 8px", fontSize: 10, fontWeight: 700, color: "#999", letterSpacing: .5, textTransform: "uppercase" },
  reactionBar: { display: "flex", gap: 2, position: "absolute", top: -8, right: 0, background: "#fff", borderRadius: 20, boxShadow: "0 2px 12px rgba(0,0,0,.15)", padding: "3px 4px", zIndex: 10 },
  reactionBtn: { width: 28, height: 28, borderRadius: 14, border: "none", background: "transparent", cursor: "pointer", fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center", transition: "transform .1s" },
  reactionPill: { display: "inline-flex", alignItems: "center", gap: 2, padding: "2px 6px", borderRadius: 10, background: "rgba(0,0,0,.06)", fontSize: 11, marginTop: 4, marginRight: 3, cursor: "pointer" },
  typingDots: { display: "flex", gap: 4, padding: "10px 14px", borderRadius: 18, background: "#f0efec", borderBottomLeftRadius: 6, width: "fit-content" },
  dot: (delay) => ({ width: 7, height: 7, borderRadius: "50%", background: "#999", animation: `msgDotBounce 1.2s ease-in-out ${delay}s infinite` }),
};

// ── Component ──────────────────────────────────────────────────────
export default function MessagesV2({ settings, properties }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedThread, setSelectedThread] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [sending, setSending] = useState(false);
  const [search, setSearch] = useState("");
  const [showReactions, setShowReactions] = useState(null); // msg id
  const [showCanned, setShowCanned] = useState(false);
  const [noteMode, setNoteMode] = useState(false); // internal note toggle
  const [propFilter, setPropFilter] = useState("all");
  const [pinnedThreads, setPinnedThreads] = useState(new Set());
  const [showTenantInfo, setShowTenantInfo] = useState(false);
  const [attachFile, setAttachFile] = useState(null); // { name, data, type }
  const [threadFilter, setThreadFilter] = useState("all"); // all, unread, pinned
  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  const fileInputRef = useRef(null);
  const _acc = settings?.adminAccent || "#4a7c59";

  // Load messages + setup realtime
  useEffect(() => {
    loadMessages();
    // Realtime subscription
    const channel = supabase.channel("messages-realtime").on("postgres_changes", { event: "*", schema: "public", table: "messages" }, (payload) => {
      if (payload.eventType === "INSERT") setMessages(prev => [payload.new, ...prev]);
      else if (payload.eventType === "UPDATE") setMessages(prev => prev.map(m => m.id === payload.new.id ? payload.new : m));
    }).subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  const loadMessages = async () => {
    setLoading(true);
    const { data } = await supabase.from("messages").select("*").order("created_at", { ascending: false });
    setMessages(data || []);
    setLoading(false);
  };

  // Group into threads by tenant name (since tenant_id can be null)
  const threads = messages.reduce((acc, msg) => {
    const key = msg.tenant_name || msg.sender_email || "unknown";
    if (!acc[key]) acc[key] = { key, tenantName: msg.tenant_name || "Unknown", tenantEmail: msg.sender_email || "", messages: [], propertyName: msg.property_name || "", roomName: msg.room_name || "", lastAt: msg.created_at, pinned: false };
    acc[key].messages.push(msg);
    if (msg.created_at > acc[key].lastAt) acc[key].lastAt = msg.created_at;
    return acc;
  }, {});

  let threadList = Object.values(threads).sort((a, b) => {
    const aPinned = pinnedThreads.has(a.key);
    const bPinned = pinnedThreads.has(b.key);
    if (aPinned && !bPinned) return -1;
    if (!aPinned && bPinned) return 1;
    return b.lastAt.localeCompare(a.lastAt);
  });

  // Filters
  if (propFilter !== "all") threadList = threadList.filter(t => t.propertyName === propFilter);
  if (threadFilter === "unread") threadList = threadList.filter(t => t.messages.some(m => m.direction === "inbound" && !m.read));
  if (threadFilter === "pinned") threadList = threadList.filter(t => pinnedThreads.has(t.key));
  if (search) { const q = search.toLowerCase(); threadList = threadList.filter(t => t.tenantName.toLowerCase().includes(q) || t.messages.some(m => (m.body || "").toLowerCase().includes(q) || (m.subject || "").toLowerCase().includes(q))); }

  const activeThread = selectedThread ? threads[selectedThread] : null;
  const activeMessages = activeThread ? [...activeThread.messages].sort((a, b) => a.created_at.localeCompare(b.created_at)) : [];
  const unreadTotal = threadList.reduce((s, t) => s + t.messages.filter(m => m.direction === "inbound" && !m.read).length, 0);

  // Mark read
  const markRead = async (threadKey) => {
    const thread = threads[threadKey];
    if (!thread) return;
    const unread = thread.messages.filter(m => m.direction === "inbound" && !m.read);
    if (unread.length === 0) return;
    const ids = unread.map(m => m.id);
    await supabase.from("messages").update({ read: true }).in("id", ids);
    setMessages(prev => prev.map(m => ids.includes(m.id) ? { ...m, read: true } : m));
  };

  // Send reply
  const sendReply = async () => {
    if (!replyText.trim() || !activeThread) return;
    setSending(true);
    const now = new Date().toISOString();
    const isNote = noteMode;

    const newMsg = {
      tenant_name: activeThread.tenantName,
      sender_email: settings?.pmEmail || settings?.email || "",
      sender_name: settings?.pmName || settings?.companyName || "Property Manager",
      direction: isNote ? "note" : "outbound",
      subject: isNote ? "[Internal Note]" : "",
      body: replyText,
      property_name: activeThread.propertyName,
      room_name: activeThread.roomName,
      read: true,
      created_at: now,
      status: "sent",
      attachment: attachFile ? { name: attachFile.name, type: attachFile.type, data: attachFile.data } : null,
    };

    const { data } = await supabase.from("messages").insert(newMsg).select().single();

    // Email tenant (only for real replies, not notes)
    if (!isNote && activeThread.tenantEmail) {
      try {
        await fetch("/api/send-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            to: activeThread.tenantEmail,
            subject: "Message from " + (settings?.companyName || "Your Property Manager"),
            fromName: (settings?.pmName || "Property Manager") + " | " + (settings?.companyName || ""),
            replyTo: settings?.pmEmail || settings?.email || "",
            html: "<p>" + replyText.replace(/\n/g, "<br/>") + "</p><p style='font-size:11px;color:#999;margin-top:16px;'>Sent by " + (settings?.companyName || "") + "</p>",
          }),
        });
      } catch (e) {}
    }

    if (data) setMessages(prev => [data, ...prev]);
    setReplyText("");
    setSending(false);
    setNoteMode(false);
    setShowCanned(false);
    setAttachFile(null);
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
  };

  // React to message
  const toggleReaction = async (msgId, reaction) => {
    const msg = messages.find(m => m.id === msgId);
    if (!msg) return;
    const reactions = msg.reactions || {};
    const pmReacted = reactions[reaction]?.includes("pm");
    if (pmReacted) {
      reactions[reaction] = (reactions[reaction] || []).filter(r => r !== "pm");
      if (reactions[reaction].length === 0) delete reactions[reaction];
    } else {
      reactions[reaction] = [...(reactions[reaction] || []), "pm"];
    }
    await supabase.from("messages").update({ reactions }).eq("id", msgId);
    setMessages(prev => prev.map(m => m.id === msgId ? { ...m, reactions } : m));
    setShowReactions(null);
  };

  // Auto-scroll
  useEffect(() => {
    if (activeThread) setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 200);
  }, [selectedThread, messages.length]);

  // Properties list for filter
  const allProps = [...new Set(Object.values(threads).map(t => t.propertyName).filter(Boolean))];

  return (
    <>
      <style>{`
        @keyframes msgDotBounce{0%,60%,100%{transform:translateY(0)}30%{transform:translateY(-6px)}}
        @keyframes msgFadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        .msg-bubble{animation:msgFadeIn .2s ease}
        .msg-reaction-btn:hover{transform:scale(1.3)}
        .msg-thread:hover{background:rgba(0,0,0,.03)}
      `}</style>

      <div className="sec-hd" style={{ marginBottom: 16 }}>
        <div>
          <h2>Messages</h2>
          <p>{unreadTotal > 0 ? unreadTotal + " unread" : "All caught up"}</p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn btn-out btn-sm" onClick={() => { const unreadIds = messages.filter(m => m.direction === "inbound" && !m.read).map(m => m.id); if (unreadIds.length) { supabase.from("messages").update({ read: true }).in("id", unreadIds); setMessages(prev => prev.map(m => unreadIds.includes(m.id) ? { ...m, read: true } : m)); } }}>
            Mark All Read
          </button>
          <button className="btn btn-out btn-sm" onClick={loadMessages} style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
            Refresh
          </button>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: 48, color: "#6b5e52" }}>Loading messages...</div>
      ) : (
        <div style={S.wrap}>
          {/* ── Thread List ── */}
          <div style={S.threadList}>
            <div style={S.threadSearch}>
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search messages..." style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid rgba(0,0,0,.1)", fontSize: 12, fontFamily: "inherit", outline: "none" }} />
              <div style={{ display: "flex", gap: 4, marginTop: 8 }}>
                {[["all", "All"], ["unread", "Unread"], ["pinned", "Pinned"]].map(([id, label]) => (
                  <button key={id} onClick={() => setThreadFilter(id)} style={{ flex: 1, padding: "5px 0", borderRadius: 6, border: "1px solid " + (threadFilter === id ? _acc : "rgba(0,0,0,.08)"), background: threadFilter === id ? _acc + "12" : "#fff", color: threadFilter === id ? _acc : "#999", fontSize: 10, fontWeight: threadFilter === id ? 700 : 500, cursor: "pointer", fontFamily: "inherit" }}>{label}</button>
                ))}
              </div>
              {allProps.length > 1 && (
                <select value={propFilter} onChange={e => setPropFilter(e.target.value)} style={{ width: "100%", padding: "6px 10px", borderRadius: 6, border: "1px solid rgba(0,0,0,.08)", fontSize: 10, fontFamily: "inherit", marginTop: 6, color: "#6b5e52" }}>
                  <option value="all">All Properties</option>
                  {allProps.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              )}
            </div>
            <div style={S.threadScroll}>
              {threadList.length === 0 && <div style={{ padding: 20, textAlign: "center", fontSize: 12, color: "#999" }}>No conversations</div>}
              {threadList.map(thread => {
                const isActive = selectedThread === thread.key;
                const unread = thread.messages.filter(m => m.direction === "inbound" && !m.read).length;
                const lastMsg = thread.messages[0];
                const isRenewal = lastMsg?.subject?.startsWith("Lease Renewal:");
                return (
                  <div key={thread.key} className="msg-thread" onClick={() => { setSelectedThread(thread.key); markRead(thread.key); }}
                    style={{ ...S.threadItem(isActive, unread > 0), borderLeftColor: isActive ? _acc : "transparent" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 3 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        {/* Avatar circle */}
                        <div style={{ width: 32, height: 32, borderRadius: "50%", background: isActive ? _acc : "#e8e5e0", color: isActive ? "#fff" : "#6b5e52", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800, flexShrink: 0 }}>
                          {(thread.tenantName || "?")[0].toUpperCase()}
                        </div>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: unread ? 800 : 600, color: "#1a1714" }}>{thread.tenantName}</div>
                          <div style={{ fontSize: 9, color: "#999" }}>{thread.propertyName}{thread.roomName ? " \u00b7 " + thread.roomName : ""}</div>
                        </div>
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 3 }}>
                        <div style={{ fontSize: 9, color: "#999" }}>{fmtTime(thread.lastAt)}</div>
                        {unread > 0 && <div style={{ width: 18, height: 18, borderRadius: 9, background: _acc, color: "#fff", fontSize: 9, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center" }}>{unread}</div>}
                      </div>
                    </div>
                    <div style={{ fontSize: 11, color: unread ? "#1a1714" : "#999", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", paddingLeft: 38, marginTop: 2 }}>
                      {pinnedThreads.has(thread.key) && <svg width="8" height="8" viewBox="0 0 24 24" fill="#d4a853" stroke="#d4a853" strokeWidth="2" style={{ marginRight: 3, verticalAlign: "middle" }}><path d="M12 17v5"/><path d="M5 17h14"/><path d="M7.5 17l1-7h7l1 7"/><path d="M9.5 10V3h5v7"/></svg>}
                      {isRenewal && <span style={{ fontSize: 9, fontWeight: 700, color: "#9a7422", marginRight: 4 }}>RENEWAL</span>}
                      {lastMsg?.direction === "outbound" ? "You: " : lastMsg?.direction === "note" ? "Note: " : ""}{lastMsg?.body?.slice(0, 50) || lastMsg?.subject || ""}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── Chat Area ── */}
          <div style={S.chatArea}>
            {!activeThread ? (
              <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "#999" }}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#ddd" strokeWidth="1.25" style={{ marginBottom: 12 }}><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 7l-10 7L2 7"/></svg>
                <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>Select a conversation</div>
                <div style={{ fontSize: 12 }}>Choose from the list on the left</div>
              </div>
            ) : (
              <>
                {/* Header */}
                <div style={S.chatHeader}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 36, height: 36, borderRadius: "50%", background: _acc, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 800, position: "relative" }}>
                      {(activeThread.tenantName || "?")[0].toUpperCase()}
                      {/* Online indicator — based on last message time */}
                      {(() => { const lastInbound = activeThread.messages.filter(m => m.direction === "inbound").sort((a, b) => b.created_at.localeCompare(a.created_at))[0]; const minAgo = lastInbound ? (Date.now() - new Date(lastInbound.created_at).getTime()) / 60000 : 999; return minAgo < 5 ? <div style={{ position: "absolute", bottom: 0, right: 0, width: 10, height: 10, borderRadius: 5, background: "#4a7c59", border: "2px solid #fff" }} /> : minAgo < 60 ? <div style={{ position: "absolute", bottom: 0, right: 0, width: 10, height: 10, borderRadius: 5, background: "#d4a853", border: "2px solid #fff" }} /> : null; })()}
                    </div>
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 700 }}>{activeThread.tenantName}</div>
                      <div style={{ fontSize: 11, color: "#6b5e52" }}>
                        {activeThread.propertyName}{activeThread.roomName ? " \u00b7 " + activeThread.roomName : ""}
                        {(() => { const lastInbound = activeThread.messages.filter(m => m.direction === "inbound").sort((a, b) => b.created_at.localeCompare(a.created_at))[0]; const minAgo = lastInbound ? Math.floor((Date.now() - new Date(lastInbound.created_at).getTime()) / 60000) : null; return minAgo !== null ? <span style={{ marginLeft: 6, fontSize: 9, color: minAgo < 5 ? "#4a7c59" : "#999" }}>{minAgo < 5 ? "Active now" : "Last active " + fmtTime(lastInbound.created_at)}</span> : null; })()}
                      </div>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button onClick={() => setPinnedThreads(prev => { const next = new Set(prev); if (next.has(selectedThread)) next.delete(selectedThread); else next.add(selectedThread); return next; })} title={pinnedThreads.has(selectedThread) ? "Unpin" : "Pin conversation"} style={{ width: 32, height: 32, borderRadius: 8, border: "1px solid rgba(0,0,0,.1)", background: pinnedThreads.has(selectedThread) ? "rgba(212,168,83,.1)" : "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill={pinnedThreads.has(selectedThread) ? "#d4a853" : "none"} stroke={pinnedThreads.has(selectedThread) ? "#d4a853" : "#999"} strokeWidth="2"><path d="M12 17v5"/><path d="M5 17h14"/><path d="M7.5 17l1-7h7l1 7"/><path d="M9.5 10V3h5v7"/></svg>
                    </button>
                    <button onClick={() => setShowTenantInfo(!showTenantInfo)} title="Tenant info" style={{ width: 32, height: 32, borderRadius: 8, border: "1px solid rgba(0,0,0,.1)", background: showTenantInfo ? "rgba(0,0,0,.04)" : "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                    </button>
                  </div>
                </div>

                {/* Messages */}
                <div style={S.chatScroll} onClick={() => { setShowReactions(null); setShowCanned(false); }}>
                  {activeMessages.map((msg, i) => {
                    const isOut = msg.direction === "outbound";
                    const isNote = msg.direction === "note";
                    const prevMsg = activeMessages[i - 1];
                    const showDateGroup = !prevMsg || fmtDateGroup(prevMsg.created_at) !== fmtDateGroup(msg.created_at);
                    const reactions = msg.reactions || {};
                    const hasReactions = Object.keys(reactions).length > 0;
                    const isRenewal = msg.subject?.startsWith("Lease Renewal:");

                    return (
                      <div key={msg.id}>
                        {showDateGroup && <div style={S.dateGroup}>{fmtDateGroup(msg.created_at)}</div>}
                        <div className="msg-bubble" style={{ display: "flex", justifyContent: isOut || isNote ? "flex-end" : "flex-start", marginBottom: hasReactions ? 20 : 8, position: "relative" }}>
                          <div
                            onDoubleClick={e => { e.stopPropagation(); setShowReactions(showReactions === msg.id ? null : msg.id); }}
                            style={{
                              ...S.bubble(isOut || isNote, isNote ? "#f5f0e8" : _acc),
                              ...(isNote ? { background: "#fef9ed", border: "1px dashed rgba(212,168,83,.4)", color: "#6b5e52" } : {}),
                            }}>
                            {isNote && <div style={{ fontSize: 9, fontWeight: 700, color: "#9a7422", marginBottom: 3 }}>INTERNAL NOTE</div>}
                            {isRenewal && !isOut && <div style={{ fontSize: 9, fontWeight: 700, color: isOut ? "rgba(255,255,255,.7)" : "#9a7422", marginBottom: 3 }}>LEASE RENEWAL REQUEST</div>}
                            {msg.subject && !isRenewal && !isNote && <div style={{ fontSize: 10, fontWeight: 700, opacity: .6, marginBottom: 3 }}>{msg.subject}</div>}
                            {msg.attachment && msg.attachment.type?.startsWith("image/") && <img src={msg.attachment.data} style={{ maxWidth: "100%", borderRadius: 8, marginBottom: 4, maxHeight: 200, objectFit: "cover" }} alt="" />}
                            {msg.attachment && !msg.attachment.type?.startsWith("image/") && <div style={{ padding: "6px 10px", background: "rgba(0,0,0,.08)", borderRadius: 6, fontSize: 11, marginBottom: 4, display: "flex", alignItems: "center", gap: 4 }}><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>{msg.attachment.name}</div>}
                            <div style={{ fontSize: 13, lineHeight: 1.6, whiteSpace: "pre-wrap" }}>{msg.body}</div>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 4 }}>
                              <div style={{ fontSize: 9, opacity: .5 }}>{fmtTime(msg.created_at)}</div>
                              {isOut && <div style={{ fontSize: 9, opacity: .5, marginLeft: 8, display: "flex", alignItems: "center", gap: 2 }}>
                                {msg.status === "read" || msg.read ? <><svg width="12" height="9" viewBox="0 0 18 10" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="1 5 5 9 12 1"/><polyline points="6 5 10 9 17 1"/></svg><span style={{ fontSize: 8 }}>Read</span></> : msg.status === "delivered" ? <><svg width="12" height="9" viewBox="0 0 18 10" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="1 5 5 9 12 1"/><polyline points="6 5 10 9 17 1"/></svg></> : <svg width="10" height="9" viewBox="0 0 14 10" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="1 5 5 9 12 1"/></svg>}
                              </div>}
                            </div>
                            {/* Reaction picker */}
                            {showReactions === msg.id && (
                              <div style={S.reactionBar} onClick={e => e.stopPropagation()}>
                                {REACTIONS.map(r => (
                                  <button key={r.label} className="msg-reaction-btn" onClick={() => toggleReaction(msg.id, r.label)} style={S.reactionBtn}>{r.emoji}</button>
                                ))}
                              </div>
                            )}
                          </div>
                          {/* Reaction pills */}
                          {hasReactions && (
                            <div style={{ position: "absolute", bottom: -14, [isOut ? "right" : "left"]: 12, display: "flex", gap: 2 }}>
                              {Object.entries(reactions).map(([key, users]) => {
                                const r = REACTIONS.find(x => x.label === key);
                                return r ? <span key={key} style={S.reactionPill} onClick={() => toggleReaction(msg.id, key)}>{r.emoji} {users.length}</span> : null;
                              })}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                  {/* Typing indicator — shows if tenant sent a message in last 30 seconds */}
                  {(() => { const lastInbound = activeMessages.filter(m => m.direction === "inbound").slice(-1)[0]; const secAgo = lastInbound ? (Date.now() - new Date(lastInbound.created_at).getTime()) / 1000 : 999; return secAgo < 30 ? (
                    <div style={{ display: "flex", justifyContent: "flex-start", marginBottom: 8 }}>
                      <div style={S.typingDots}>
                        <div style={S.dot(0)} /><div style={S.dot(0.15)} /><div style={S.dot(0.3)} />
                      </div>
                    </div>
                  ) : null; })()}
                  <div ref={bottomRef} />
                </div>

                {/* Canned responses */}
                {showCanned && (
                  <div style={{ padding: "8px 16px", borderTop: "1px solid rgba(0,0,0,.06)", maxHeight: 150, overflowY: "auto" }}>
                    <div style={{ fontSize: 9, fontWeight: 700, color: "#999", textTransform: "uppercase", letterSpacing: .5, marginBottom: 6 }}>Quick Replies</div>
                    {CANNED_RESPONSES.map((cr, i) => (
                      <div key={i} onClick={() => { setReplyText(cr); setShowCanned(false); inputRef.current?.focus(); }} style={{ padding: "8px 10px", borderRadius: 6, cursor: "pointer", fontSize: 12, color: "#5c4a3a", marginBottom: 2, transition: "background .1s" }} onMouseEnter={e => e.currentTarget.style.background = "rgba(0,0,0,.04)"} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                        {cr}
                      </div>
                    ))}
                  </div>
                )}

                {/* Attachment preview */}
                {attachFile && (
                  <div style={{ padding: "8px 16px", borderTop: "1px solid rgba(0,0,0,.06)", display: "flex", alignItems: "center", gap: 8 }}>
                    {attachFile.type?.startsWith("image/") ? <img src={attachFile.data} style={{ height: 40, borderRadius: 6, objectFit: "cover" }} alt="" /> : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>}
                    <span style={{ fontSize: 11, color: "#6b5e52", flex: 1 }}>{attachFile.name}</span>
                    <button onClick={() => setAttachFile(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#c45c4a", fontSize: 14 }}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
                  </div>
                )}

                {/* Input */}
                <div style={S.chatInput}>
                  {/* File attach */}
                  <input ref={fileInputRef} type="file" accept="image/*,.pdf,.doc,.docx" style={{ display: "none" }} onChange={e => { const file = e.target.files?.[0]; if (!file) return; const reader = new FileReader(); reader.onload = ev => setAttachFile({ name: file.name, type: file.type, data: ev.target.result }); reader.readAsDataURL(file); e.target.value = ""; }} />
                  <button onClick={() => fileInputRef.current?.click()} title="Attach file" style={{ width: 36, height: 36, borderRadius: 8, border: "1px solid rgba(0,0,0,.1)", background: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
                  </button>
                  {/* Note toggle */}
                  <button onClick={() => setNoteMode(!noteMode)} title={noteMode ? "Switch to reply" : "Switch to internal note"} style={{ width: 36, height: 36, borderRadius: 8, border: noteMode ? "2px solid #d4a853" : "1px solid rgba(0,0,0,.1)", background: noteMode ? "rgba(212,168,83,.08)" : "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={noteMode ? "#9a7422" : "#999"} strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
                  </button>
                  {/* Canned toggle */}
                  <button onClick={() => setShowCanned(!showCanned)} title="Quick replies" style={{ width: 36, height: 36, borderRadius: 8, border: "1px solid rgba(0,0,0,.1)", background: showCanned ? "rgba(0,0,0,.04)" : "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                  </button>
                  <div style={{ flex: 1, position: "relative" }}>
                    {noteMode && <div style={{ position: "absolute", top: -20, left: 0, fontSize: 9, fontWeight: 700, color: "#9a7422" }}>INTERNAL NOTE (tenant will not see this)</div>}
                    <textarea
                      ref={inputRef}
                      value={replyText}
                      onChange={e => setReplyText(e.target.value)}
                      onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendReply(); } }}
                      placeholder={noteMode ? "Write an internal note..." : "Type a message..."}
                      rows={1}
                      style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: noteMode ? "2px solid rgba(212,168,83,.4)" : "1.5px solid rgba(0,0,0,.1)", fontSize: 13, fontFamily: "inherit", resize: "none", outline: "none", background: noteMode ? "rgba(212,168,83,.04)" : "#fff" }}
                    />
                  </div>
                  <button onClick={sendReply} disabled={sending || !replyText.trim()} style={{ width: 40, height: 40, borderRadius: 20, border: "none", background: replyText.trim() ? _acc : "rgba(0,0,0,.08)", color: replyText.trim() ? "#fff" : "#bbb", cursor: replyText.trim() ? "pointer" : "default", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all .15s" }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                  </button>
                </div>
              </>
            )}
          </div>

          {/* ── Tenant Info Sidebar ── */}
          {showTenantInfo && activeThread && (
            <div style={{ width: 240, borderLeft: "1px solid rgba(0,0,0,.06)", overflowY: "auto", padding: "20px 16px", background: "#fafaf8" }}>
              <div style={{ textAlign: "center", marginBottom: 16 }}>
                <div style={{ width: 56, height: 56, borderRadius: "50%", background: _acc, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, fontWeight: 800, margin: "0 auto 8px" }}>
                  {(activeThread.tenantName || "?")[0].toUpperCase()}
                </div>
                <div style={{ fontSize: 15, fontWeight: 700 }}>{activeThread.tenantName}</div>
                <div style={{ fontSize: 11, color: "#6b5e52", marginTop: 2 }}>{activeThread.tenantEmail}</div>
              </div>
              <div style={{ borderTop: "1px solid rgba(0,0,0,.06)", paddingTop: 12 }}>
                {[
                  ["Property", activeThread.propertyName],
                  ["Room", activeThread.roomName],
                  ["Messages", activeThread.messages.length],
                  ["First Message", activeThread.messages.length > 0 ? new Date(activeThread.messages[activeThread.messages.length - 1].created_at).toLocaleDateString() : "\u2014"],
                  ["Last Active", (() => { const last = activeThread.messages.filter(m => m.direction === "inbound").sort((a, b) => b.created_at.localeCompare(a.created_at))[0]; return last ? fmtTime(last.created_at) : "\u2014"; })()],
                ].filter(([, v]) => v).map(([k, v]) => (
                  <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid rgba(0,0,0,.03)", fontSize: 11 }}>
                    <span style={{ color: "#6b5e52" }}>{k}</span>
                    <span style={{ fontWeight: 600, textAlign: "right", maxWidth: "55%" }}>{v}</span>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 16 }}>
                <div style={{ fontSize: 9, fontWeight: 700, color: "#999", textTransform: "uppercase", letterSpacing: .5, marginBottom: 6 }}>Quick Actions</div>
                <button className="btn btn-out btn-sm" style={{ width: "100%", marginBottom: 4, fontSize: 10 }} onClick={() => { /* navigate to tenant */ }}>View Tenant Profile</button>
                <button className="btn btn-out btn-sm" style={{ width: "100%", fontSize: 10 }} onClick={() => { setPinnedThreads(prev => { const next = new Set(prev); if (next.has(selectedThread)) next.delete(selectedThread); else next.add(selectedThread); return next; }); }}>{pinnedThreads.has(selectedThread) ? "Unpin Conversation" : "Pin Conversation"}</button>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
