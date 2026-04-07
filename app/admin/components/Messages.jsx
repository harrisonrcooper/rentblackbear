"use client";
import { useState, useEffect, useRef } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function Messages({ settings, properties }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedThread, setSelectedThread] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef(null);
  const _acc = settings?.adminAccent || "#4a7c59";

  // Load messages
  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("messages")
      .select("*")
      .order("created_at", { ascending: false });
    setMessages(data || []);
    setLoading(false);
  };

  // Group messages into threads by tenant_id
  const threads = messages.reduce((acc, msg) => {
    const key = msg.tenant_id || msg.sender_email || "unknown";
    if (!acc[key]) acc[key] = { tenantId: msg.tenant_id, tenantName: msg.tenant_name || "Unknown", tenantEmail: msg.sender_email || "", messages: [], propertyName: msg.property_name || "", roomName: msg.room_name || "", lastAt: msg.created_at };
    acc[key].messages.push(msg);
    if (msg.created_at > acc[key].lastAt) acc[key].lastAt = msg.created_at;
    return acc;
  }, {});

  const threadList = Object.values(threads).sort((a, b) => b.lastAt.localeCompare(a.lastAt));
  const activeThread = selectedThread ? threads[selectedThread] : null;
  const activeMessages = activeThread ? [...activeThread.messages].sort((a, b) => a.created_at.localeCompare(b.created_at)) : [];
  const unreadCount = threadList.reduce((s, t) => s + t.messages.filter(m => m.direction === "inbound" && !m.read).length, 0);

  // Mark thread as read
  const markRead = async (tenantId) => {
    const unread = messages.filter(m => m.tenant_id === tenantId && m.direction === "inbound" && !m.read);
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

    // Save to messages table
    const { data: newMsg } = await supabase.from("messages").insert({
      tenant_id: activeThread.tenantId,
      tenant_name: activeThread.tenantName,
      sender_email: settings?.pmEmail || settings?.email || "",
      sender_name: settings?.pmName || settings?.companyName || "Property Manager",
      direction: "outbound",
      subject: "Re: " + (activeMessages[0]?.subject || "Message"),
      body: replyText,
      property_name: activeThread.propertyName,
      room_name: activeThread.roomName,
      read: true,
      created_at: now,
    }).select().single();

    // Send email to tenant
    try {
      await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: activeThread.tenantEmail,
          subject: "Message from " + (settings?.companyName || "Your Property Manager"),
          fromName: (settings?.pmName || "Property Manager") + " | " + (settings?.companyName || ""),
          replyTo: settings?.pmEmail || settings?.email || "",
          html: "<p>" + replyText.replace(/\n/g, "<br/>") + "</p><p style='font-size:11px;color:#999;margin-top:16px;'>Sent by " + (settings?.companyName || "Your Property Manager") + "</p>",
        }),
      });
    } catch (e) { /* email send is best-effort */ }

    if (newMsg) setMessages(prev => [newMsg, ...prev]);
    setReplyText("");
    setSending(false);
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
  };

  const fmtTime = (iso) => {
    if (!iso) return "";
    const d = new Date(iso);
    const now = new Date();
    const diffMs = now - d;
    const diffMin = Math.floor(diffMs / 60000);
    if (diffMin < 1) return "Just now";
    if (diffMin < 60) return diffMin + "m ago";
    const diffHr = Math.floor(diffMin / 60);
    if (diffHr < 24) return diffHr + "h ago";
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  return (
    <>
      <div className="sec-hd" style={{ marginBottom: 16 }}>
        <div>
          <h2>Messages</h2>
          <p>Tenant messages from the portal{unreadCount > 0 ? " \u00b7 " + unreadCount + " unread" : ""}</p>
        </div>
        <button className="btn btn-out btn-sm" onClick={loadMessages} style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
          Refresh
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: 48, color: "#6b5e52" }}>Loading messages...</div>
      ) : threadList.length === 0 ? (
        <div className="card"><div className="card-bd" style={{ textAlign: "center", padding: 48 }}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#c4a882" strokeWidth="1.25" style={{ marginBottom: 12 }}><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 7l-10 7L2 7"/></svg>
          <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 6 }}>No messages yet</div>
          <div style={{ fontSize: 12, color: "#6b5e52" }}>When tenants send messages through the portal, they will appear here.</div>
        </div></div>
      ) : (
        <div style={{ display: "flex", gap: 0, border: "1px solid rgba(0,0,0,.07)", borderRadius: 12, overflow: "hidden", minHeight: 500, background: "#fff" }}>
          {/* Thread list */}
          <div style={{ width: 280, borderRight: "1px solid rgba(0,0,0,.06)", overflowY: "auto", flexShrink: 0 }}>
            {threadList.map((thread) => {
              const isActive = selectedThread === thread.tenantId;
              const hasUnread = thread.messages.some(m => m.direction === "inbound" && !m.read);
              const lastMsg = thread.messages[0];
              return (
                <div key={thread.tenantId} onClick={() => { setSelectedThread(thread.tenantId); markRead(thread.tenantId); }}
                  style={{ padding: "14px 16px", cursor: "pointer", borderBottom: "1px solid rgba(0,0,0,.04)", background: isActive ? "rgba(0,0,0,.03)" : "transparent", transition: "background .1s" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 3 }}>
                    <div style={{ fontSize: 13, fontWeight: hasUnread ? 800 : 600, color: "#1a1714" }}>{thread.tenantName}</div>
                    <div style={{ fontSize: 9, color: "#999" }}>{fmtTime(thread.lastAt)}</div>
                  </div>
                  <div style={{ fontSize: 10, color: "#6b5e52", marginBottom: 2 }}>{thread.propertyName}{thread.roomName ? " \u00b7 " + thread.roomName : ""}</div>
                  <div style={{ fontSize: 11, color: hasUnread ? "#1a1714" : "#999", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {lastMsg?.direction === "outbound" ? "You: " : ""}{lastMsg?.body?.slice(0, 60) || lastMsg?.subject || ""}
                  </div>
                  {hasUnread && <div style={{ width: 8, height: 8, borderRadius: 4, background: _acc, position: "absolute", right: 12, top: 18 }}/>}
                </div>
              );
            })}
          </div>

          {/* Message detail */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
            {!activeThread ? (
              <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: "#999", fontSize: 13 }}>
                Select a conversation
              </div>
            ) : (
              <>
                {/* Header */}
                <div style={{ padding: "14px 20px", borderBottom: "1px solid rgba(0,0,0,.06)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 700 }}>{activeThread.tenantName}</div>
                    <div style={{ fontSize: 11, color: "#6b5e52" }}>{activeThread.tenantEmail}{activeThread.propertyName ? " \u00b7 " + activeThread.propertyName : ""}</div>
                  </div>
                </div>

                {/* Messages */}
                <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px" }}>
                  {activeMessages.map((msg) => {
                    const isOutbound = msg.direction === "outbound";
                    return (
                      <div key={msg.id} style={{ display: "flex", justifyContent: isOutbound ? "flex-end" : "flex-start", marginBottom: 12 }}>
                        <div style={{ maxWidth: "75%", padding: "10px 14px", borderRadius: 12, background: isOutbound ? _acc : "#f4f3f0", color: isOutbound ? "#fff" : "#1a1714", borderBottomRightRadius: isOutbound ? 4 : 12, borderBottomLeftRadius: isOutbound ? 12 : 4 }}>
                          {msg.subject && <div style={{ fontSize: 10, fontWeight: 700, opacity: .7, marginBottom: 4 }}>{msg.subject}</div>}
                          <div style={{ fontSize: 13, lineHeight: 1.6, whiteSpace: "pre-wrap" }}>{msg.body}</div>
                          <div style={{ fontSize: 9, opacity: .6, marginTop: 4, textAlign: "right" }}>{fmtTime(msg.created_at)}</div>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={bottomRef} />
                </div>

                {/* Reply input */}
                <div style={{ padding: "12px 20px", borderTop: "1px solid rgba(0,0,0,.06)", display: "flex", gap: 8 }}>
                  <textarea
                    value={replyText}
                    onChange={e => setReplyText(e.target.value)}
                    onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendReply(); } }}
                    placeholder="Type a reply..."
                    rows={1}
                    style={{ flex: 1, padding: "10px 12px", borderRadius: 8, border: "1.5px solid rgba(0,0,0,.1)", fontSize: 13, fontFamily: "inherit", resize: "none", outline: "none" }}
                  />
                  <button onClick={sendReply} disabled={sending || !replyText.trim()} style={{ padding: "10px 16px", borderRadius: 8, border: "none", background: replyText.trim() ? _acc : "rgba(0,0,0,.08)", color: replyText.trim() ? "#fff" : "#bbb", fontWeight: 700, fontSize: 13, cursor: replyText.trim() ? "pointer" : "default", display: "flex", alignItems: "center", gap: 6 }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                    {sending ? "..." : "Send"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
