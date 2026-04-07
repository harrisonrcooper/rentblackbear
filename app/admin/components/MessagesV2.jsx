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
  outer: { position: "fixed", top: 96, bottom: 0, left: 220, right: 0, display: "flex", flexDirection: "column", background: "#f4f3f0", zIndex: 5 },

  wrap: { display: "flex", gap: 0, flex: 1, overflow: "hidden", background: "#fff", minHeight: 0 },
  threadList: { width: 300, borderRight: "1px solid rgba(0,0,0,.06)", display: "flex", flexDirection: "column", background: "#fafaf8" },
  threadSearch: { padding: "12px 14px", borderBottom: "1px solid rgba(0,0,0,.06)" },
  threadScroll: { flex: 1, overflowY: "auto" },
  threadItem: (active, unread) => ({ padding: "14px 16px", cursor: "pointer", borderBottom: "1px solid rgba(0,0,0,.03)", background: active ? "#fff" : "transparent", borderLeft: active ? "3px solid" : "3px solid transparent", transition: "all .1s", position: "relative" }),
  chatArea: { flex: 1, display: "flex", flexDirection: "column", background: "#fff", minWidth: 0, overflow: "hidden" },
  chatHeader: { padding: "10px 16px", borderBottom: "1px solid rgba(0,0,0,.06)", flexShrink: 0, background: "#fff", zIndex: 2 },
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
export default function MessagesV2({ settings, properties, charges, maintenance: maintRequests, leases, maint, setMaint, save, uid }) {
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
  // Conversation management
  const [starredThreads, setStarredThreads] = useState(new Set());
  const [archivedThreads, setArchivedThreads] = useState(new Set());
  const [snoozedThreads, setSnoozedThreads] = useState({}); // key -> resume timestamp
  const [assignedThreads, setAssignedThreads] = useState({}); // key -> team member name
  const [showSnoozeMenu, setShowSnoozeMenu] = useState(false);
  const [showAssignMenu, setShowAssignMenu] = useState(false);
  // Tags/Labels
  const [threadTags, setThreadTags] = useState({});
  const [showTagDropdown, setShowTagDropdown] = useState(false);
  // Saved replies (editable)
  const [savedReplies, setSavedReplies] = useState(settings?.savedReplies || DEFAULT_SAVED_REPLIES);
  const [editingReplies, setEditingReplies] = useState(false);
  const [editReplyDraft, setEditReplyDraft] = useState("");
  // Away mode
  const [awayMode, setAwayMode] = useState(false);
  const [awayMessage, setAwayMessage] = useState(settings?.awayMessage || "Thanks for your message. We'll respond within 24 hours.");
  const [showAwayEdit, setShowAwayEdit] = useState(false);
  // Notifications
  const [notifEnabled, setNotifEnabled] = useState(typeof Notification !== "undefined" && Notification.permission === "granted");
  // Emoji picker
  const [showEmoji, setShowEmoji] = useState(false);
  // Message editing
  const [editingMsg, setEditingMsg] = useState(null); // msg id
  const [editMsgText, setEditMsgText] = useState("");
  const [hoveredMsg, setHoveredMsg] = useState(null);
  const [showSchedule, setShowSchedule] = useState(false);
  const [scheduleTime, setScheduleTime] = useState("");
  const [scheduledMsgs, setScheduledMsgs] = useState([]);
  const [showSlashMenu, setShowSlashMenu] = useState(false);
  const [maintForm, setMaintForm] = useState(null); // { title, scope, priority } — inline form for /maintenance
  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  const fileInputRef = useRef(null);
  const awayModeRef = useRef(awayMode);
  const awayMessageRef = useRef(awayMessage);
  const _acc = settings?.adminAccent || "#4a7c59";

  // Keep refs in sync for use in realtime callback
  useEffect(() => { awayModeRef.current = awayMode; }, [awayMode]);
  useEffect(() => { awayMessageRef.current = awayMessage; }, [awayMessage]);

  // Load scheduled messages from Supabase
  const loadScheduled = async () => {
    try {
      const { data } = await supabase.from("scheduled_messages").select("*").eq("sent", false).order("scheduled_at", { ascending: true });
      if (data) setScheduledMsgs(data.map(d => ({ id: d.id, text: d.body, threadKey: d.thread_key, scheduledAt: d.scheduled_at, tenantName: d.tenant_name })));
    } catch (e) {}
  };

  // Load messages + setup realtime
  useEffect(() => {
    loadMessages();
    loadScheduled();
    // Realtime subscription
    const channel = supabase.channel("messages-realtime").on("postgres_changes", { event: "*", schema: "public", table: "messages" }, (payload) => {
      if (payload.eventType === "INSERT") {
        setMessages(prev => [payload.new, ...prev]);
        // Browser notification for inbound
        if (payload.new.direction === "inbound") {
          if (typeof Notification !== "undefined" && Notification.permission === "granted") {
            new Notification("New message from " + (payload.new.tenant_name || "Tenant"), { body: (payload.new.body || "").slice(0, 100) });
          }
          // Away mode auto-reply
          if (awayModeRef.current && payload.new.tenant_name) {
            supabase.from("messages").insert({
              tenant_name: payload.new.tenant_name,
              sender_email: payload.new.sender_email || "",
              direction: "outbound",
              body: awayMessageRef.current,
              property_name: payload.new.property_name || "",
              room_name: payload.new.room_name || "",
              read: true,
              created_at: new Date().toISOString(),
              status: "sent",
            }).select().single().then(({ data }) => {
              if (data) setMessages(prev => [data, ...prev]);
            });
          }
        }
      }
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
  // Filter out archived and snoozed by default (unless viewing those filters)
  if (threadFilter !== "archived") threadList = threadList.filter(t => !archivedThreads.has(t.key));
  if (threadFilter !== "all" && threadFilter !== "archived") {
    const now = Date.now();
    threadList = threadList.filter(t => { const snoozeUntil = snoozedThreads[t.key]; return !snoozeUntil || snoozeUntil < now; });
  }
  if (threadFilter === "unread") threadList = threadList.filter(t => t.messages.some(m => m.direction === "inbound" && !m.read));
  if (threadFilter === "starred") threadList = threadList.filter(t => starredThreads.has(t.key));
  if (threadFilter === "pinned") threadList = threadList.filter(t => pinnedThreads.has(t.key));
  if (threadFilter === "archived") threadList = threadList.filter(t => archivedThreads.has(t.key));
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
    };
    // Only add optional columns if they have values (columns may not exist yet)
    if (attachFile) newMsg.attachment = { name: attachFile.name, type: attachFile.type, data: attachFile.data };

    const { data, error: insertErr } = await supabase.from("messages").insert(newMsg).select().single();
    if (insertErr) { console.error("Message send error:", insertErr); setSending(false); return; }

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
  // Slash commands — two types: instant (no args) and input (type details after)
  const SLASH_COMMANDS = [
    { cmd: "/maintenance", label: "Create maintenance request", desc: "Type issue after command", type: "input", placeholder: "e.g. /maintenance Leaky faucet in bathroom" },
    { cmd: "/remind", label: "Send payment reminder", desc: "Sends rent reminder to tenant", type: "instant" },
    { cmd: "/lease", label: "Send lease for signing", desc: "Sends lease signing link to tenant", type: "instant" },
    { cmd: "/inspect", label: "Schedule inspection", desc: "Type date/details after command", type: "input", placeholder: "e.g. /inspect Move-out inspection April 15 2pm" },
    { cmd: "/note", label: "Add internal note", desc: "Switches to note mode", type: "instant" },
    { cmd: "/canned", label: "Quick replies", desc: "Opens saved reply templates", type: "instant" },
    { cmd: "/assign", label: "Assign conversation", desc: "Assign to a team member", type: "instant" },
    { cmd: "/star", label: "Star conversation", desc: "Toggle star on this thread", type: "instant" },
    { cmd: "/pin", label: "Pin conversation", desc: "Pin to top of list", type: "instant" },
    { cmd: "/archive", label: "Archive conversation", desc: "Move to archived", type: "instant" },
  ];

  // When clicking a command from the menu
  const insertSlashCommand = (cmd) => {
    setShowSlashMenu(false);
    const cmdDef = SLASH_COMMANDS.find(c => c.cmd === cmd);
    if (cmdDef?.type === "input") {
      // Insert into input — user types details after
      setReplyText(cmd + " ");
      inputRef.current?.focus();
      return;
    }
    // Instant commands
    setReplyText("");
    if (cmd === "/note") { setNoteMode(true); inputRef.current?.focus(); }
    else if (cmd === "/canned") setShowCanned(true);
    else if (cmd === "/assign") setShowAssignMenu(true);
    else if (cmd === "/star") setStarredThreads(prev => { const n = new Set(prev); if (n.has(selectedThread)) n.delete(selectedThread); else n.add(selectedThread); return n; });
    else if (cmd === "/pin") setPinnedThreads(prev => { const n = new Set(prev); if (n.has(selectedThread)) n.delete(selectedThread); else n.add(selectedThread); return n; });
    else if (cmd === "/archive") { if (window.confirm("Archive this conversation?")) { setArchivedThreads(prev => { const n = new Set(prev); n.add(selectedThread); return n; }); setSelectedThread(null); } }
    else if (cmd === "/remind") executeSlashCommand("/remind");
    else if (cmd === "/lease") executeSlashCommand("/lease");
  };

  // Execute slash commands with details
  const executeSlashCommand = async (override) => {
    const text = (override || replyText.trim());
    if (!text.startsWith("/") || !activeThread) return false;
    const tenant = activeThread.tenantName || "Tenant";

    if (text.startsWith("/maintenance")) {
      const details = text.replace("/maintenance", "").trim();
      // Open inline maintenance form with prefilled title
      setMaintForm({ title: details, scope: "room", priority: "medium", propName: activeThread?.propertyName || "", roomName: activeThread?.roomName || "" });
      setReplyText("");
      return true;
    }

    if (text.startsWith("/inspect")) {
      const details = text.replace("/inspect", "").trim();
      if (!details) { setReplyText("/inspect "); inputRef.current?.focus(); return false; }
      await sendSystemMessage("Inspection scheduled: " + details);
      // Send to tenant
      if (activeThread.tenantEmail) { try { await fetch("/api/send-email", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ to: activeThread.tenantEmail, subject: "Inspection Scheduled", html: "<p>An inspection has been scheduled:</p><p><strong>" + details + "</strong></p><p>Please ensure the unit is accessible. " + (settings?.companyName || "") + "</p>" }) }); } catch (e) {} }
      // Also send as outbound message so tenant sees it in portal
      await supabase.from("messages").insert({ tenant_name: activeThread.tenantName, sender_email: settings?.pmEmail || "", sender_name: settings?.pmName || "PM", direction: "outbound", subject: "Inspection Scheduled", body: details, property_name: activeThread.propertyName, room_name: activeThread.roomName, read: true });
      setReplyText("");
      return true;
    }

    if (text.startsWith("/remind")) {
      await sendSystemMessage("Payment reminder sent to " + tenant);
      if (activeThread.tenantEmail) { try { await fetch("/api/send-email", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ to: activeThread.tenantEmail, subject: "Payment Reminder \u2014 " + (settings?.companyName || ""), html: "<p>Hi " + tenant.split(" ")[0] + ",</p><p>This is a friendly reminder about your upcoming rent payment. Please log in to your tenant portal to view your balance and pay.</p><p>" + (settings?.companyName || "") + "<br/>" + (settings?.phone || "") + "</p>" }) }); } catch (e) {} }
      // Also send as portal message
      await supabase.from("messages").insert({ tenant_name: activeThread.tenantName, sender_email: settings?.pmEmail || "", sender_name: settings?.pmName || "PM", direction: "outbound", body: "This is a friendly reminder about your upcoming rent payment. Please log in to your portal to view your balance and pay.", property_name: activeThread.propertyName, room_name: activeThread.roomName, read: true });
      setReplyText("");
      return true;
    }

    if (text.startsWith("/lease")) {
      await sendSystemMessage("Lease signing reminder sent to " + tenant);
      if (activeThread.tenantEmail) { try { await fetch("/api/send-email", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ to: activeThread.tenantEmail, subject: "Your Lease is Ready to Sign", html: "<p>Hi " + tenant.split(" ")[0] + ",</p><p>Your lease is ready for signature. Please log in to your tenant portal to review and sign.</p><p>" + (settings?.companyName || "") + "</p>" }) }); } catch (e) {} }
      await supabase.from("messages").insert({ tenant_name: activeThread.tenantName, sender_email: settings?.pmEmail || "", sender_name: settings?.pmName || "PM", direction: "outbound", body: "Your lease is ready for signature. Please log in to your portal to review and sign.", property_name: activeThread.propertyName, room_name: activeThread.roomName, read: true });
      setReplyText("");
      return true;
    }

    return false;
  };

  const sendSystemMessage = async (text) => {
    if (!activeThread) return;
    await supabase.from("messages").insert({
      tenant_name: activeThread.tenantName, sender_email: settings?.pmEmail || settings?.email || "",
      sender_name: "System", direction: "note", subject: "[System]", body: text,
      property_name: activeThread.propertyName, room_name: activeThread.roomName, read: true,
    });
    loadMessages();
  };

  // Schedule message
  const scheduleMessage = async () => {
    if (!replyText.trim() || !scheduleTime || !activeThread) return;
    const scheduledAt = new Date(scheduleTime).toISOString();
    const { data } = await supabase.from("scheduled_messages").insert({
      tenant_name: activeThread.tenantName, thread_key: selectedThread,
      body: replyText, scheduled_at: scheduledAt,
    }).select().single();
    if (data) setScheduledMsgs(prev => [...prev, { id: data.id, text: replyText, threadKey: selectedThread, scheduledAt, tenantName: activeThread.tenantName }]);
    setReplyText("");
    setShowSchedule(false);
    setScheduleTime("");
  };

  // Check and send scheduled messages
  useEffect(() => {
    const interval = setInterval(async () => {
      const now = new Date().toISOString();
      const due = scheduledMsgs.filter(m => m.scheduledAt <= now);
      if (due.length === 0) return;
      for (const m of due) {
        await supabase.from("messages").insert({
          tenant_name: m.tenantName, sender_email: settings?.pmEmail || settings?.email || "",
          sender_name: settings?.pmName || "Property Manager", direction: "outbound",
          subject: "", body: m.text, read: true,
        });
        if (m.id) await supabase.from("scheduled_messages").update({ sent: true }).eq("id", m.id);
      }
      setScheduledMsgs(prev => prev.filter(m => m.scheduledAt > now));
      loadMessages();
    }, 15000); // check every 15 seconds
    return () => clearInterval(interval);
  }, [scheduledMsgs]);

  // Update scheduled message in Supabase when edited
  const updateScheduled = async (idx, updates) => {
    const msg = scheduledMsgs[idx];
    if (!msg) return;
    const next = [...scheduledMsgs];
    next[idx] = { ...next[idx], ...updates };
    setScheduledMsgs(next);
    if (msg.id) {
      const patch = {};
      if (updates.text !== undefined) patch.body = updates.text;
      if (updates.scheduledAt !== undefined) patch.scheduled_at = updates.scheduledAt;
      await supabase.from("scheduled_messages").update(patch).eq("id", msg.id);
    }
  };

  // Delete scheduled message from Supabase
  const deleteScheduled = async (idx) => {
    const msg = scheduledMsgs[idx];
    setScheduledMsgs(prev => prev.filter((_, i) => i !== idx));
    if (msg?.id) await supabase.from("scheduled_messages").delete().eq("id", msg.id);
  };

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

  // Edit message — saves edited version for PM view, keeps original for tenant
  const saveEditMsg = async (msgId) => {
    if (!editMsgText.trim()) return;
    const msg = messages.find(m => m.id === msgId);
    const originalBody = msg?.original_body || msg?.body || "";
    const editedBody = editMsgText.trim();
    // Store original_body on first edit, update body with edited version
    // Tenant portal reads original_body (falls back to body if not set)
    await supabase.from("messages").update({ body: editedBody, original_body: originalBody, edited: true }).eq("id", msgId);
    setMessages(prev => prev.map(m => m.id === msgId ? { ...m, body: editedBody, original_body: originalBody, edited: true } : m));
    setEditingMsg(null);
    setEditMsgText("");
  };

  // Delete message
  const deleteMsg = async (msgId) => {
    await supabase.from("messages").update({ body: "This message was deleted", deleted: true }).eq("id", msgId);
    setMessages(prev => prev.map(m => m.id === msgId ? { ...m, body: "This message was deleted", deleted: true } : m));
  };

  // Request notification permission
  const requestNotifPermission = async () => {
    if (typeof Notification === "undefined") return;
    const perm = await Notification.requestPermission();
    setNotifEnabled(perm === "granted");
  };

  // Export conversation as PDF
  const exportConversation = () => {
    if (!activeThread) return;
    const msgs = [...activeThread.messages].sort((a, b) => a.created_at.localeCompare(b.created_at));
    const html = `<html><head><title>Conversation - ${activeThread.tenantName}</title><style>body{font-family:system-ui,-apple-system,sans-serif;max-width:700px;margin:40px auto;padding:0 20px;color:#1a1714}h1{font-size:18px;border-bottom:2px solid #eee;padding-bottom:12px}.meta{font-size:11px;color:#999;margin-bottom:20px}.msg{margin-bottom:16px;padding:12px 16px;border-radius:12px}.msg.out{background:#f0f7f2;margin-left:60px}.msg.in{background:#f5f4f2;margin-right:60px}.msg.note{background:#fef9ed;border:1px dashed #d4a853;margin-left:60px}.msg-meta{font-size:10px;color:#999;margin-bottom:4px}.msg-body{font-size:13px;line-height:1.6;white-space:pre-wrap}@media print{body{margin:20px}}</style></head><body><h1>Conversation with ${activeThread.tenantName}</h1><div class="meta">${activeThread.propertyName}${activeThread.roomName ? " / " + activeThread.roomName : ""} &mdash; ${msgs.length} messages &mdash; Exported ${new Date().toLocaleDateString()}</div>${msgs.map(m => `<div class="msg ${m.direction === "outbound" ? "out" : m.direction === "note" ? "note" : "in"}"><div class="msg-meta">${m.direction === "outbound" ? "You" : m.direction === "note" ? "Internal Note" : activeThread.tenantName} &mdash; ${new Date(m.created_at).toLocaleString()}</div><div class="msg-body">${(m.body || "").replace(/</g,"&lt;").replace(/>/g,"&gt;")}</div></div>`).join("")}</body></html>`;
    const w = window.open("", "_blank");
    w.document.write(html);
    w.document.close();
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

      <div style={S.outer}>


      {loading ? (
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: "#6b5e52" }}>Loading messages...</div>
      ) : (
        <div style={S.wrap}>
          {/* ── Thread List ── */}
          <div style={S.threadList}>
            <div style={S.threadSearch}>
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search messages..." style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid rgba(0,0,0,.1)", fontSize: 12, fontFamily: "inherit", outline: "none" }} />
              <div style={{ display: "flex", gap: 4, marginTop: 8 }}>
                {[["all", "All"], ["unread", "Unread"], ["starred", "Starred"], ["pinned", "Pinned"], ["archived", "Archived"]].map(([id, label]) => (
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
                        <div style={{ width: 32, height: 32, minWidth: 32, minHeight: 32, borderRadius: "50%", background: isActive ? _acc : "#e8e5e0", color: isActive ? "#fff" : "#6b5e52", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800, flexShrink: 0 }}>
                          {(thread.tenantName || "?")[0].toUpperCase()}
                        </div>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: unread ? 800 : 600, color: "#1a1714" }}>{thread.tenantName}</div>
                          <div style={{ fontSize: 9, color: "#999" }}>{thread.propertyName}{thread.roomName ? " \u00b7 " + thread.roomName : ""}</div>
                          {(threadTags[thread.key] || []).length > 0 && (
                            <div style={{ display: "flex", gap: 3, marginTop: 2, flexWrap: "wrap" }}>
                              {threadTags[thread.key].map(tag => (
                                <span key={tag} style={{ fontSize: 8, fontWeight: 700, padding: "1px 5px", borderRadius: 4, background: TAG_COLORS[tag] + "18", color: TAG_COLORS[tag], textTransform: "uppercase", letterSpacing: .3 }}>{tag}</span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 3 }}>
                        <div style={{ fontSize: 9, color: "#999" }}>{fmtTime(thread.lastAt)}</div>
                        {unread > 0 && <div style={{ width: 18, height: 18, borderRadius: 9, background: _acc, color: "#fff", fontSize: 9, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center" }}>{unread}</div>}
                      </div>
                    </div>
                    <div style={{ fontSize: 11, color: unread ? "#1a1714" : "#999", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", paddingLeft: 38, marginTop: 2 }}>
                      {starredThreads.has(thread.key) && <svg width="8" height="8" viewBox="0 0 24 24" fill="#d4a853" stroke="#d4a853" strokeWidth="1.5" style={{ marginRight: 2, verticalAlign: "middle" }}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>}
                      {pinnedThreads.has(thread.key) && <svg width="8" height="8" viewBox="0 0 24 24" fill="#d4a853" stroke="#d4a853" strokeWidth="2" style={{ marginRight: 2, verticalAlign: "middle" }}><path d="M12 17v5"/><path d="M5 17h14"/><path d="M7.5 17l1-7h7l1 7"/><path d="M9.5 10V3h5v7"/></svg>}
                      {assignedThreads[thread.key] && <span style={{ fontSize: 8, color: "#4a7c59", fontWeight: 700, marginRight: 2 }}>{assignedThreads[thread.key]}</span>}
                      {scheduledMsgs.some(m => m.threadKey === thread.key) && <span style={{ fontSize: 8, color: "#3b82f6", fontWeight: 700, marginRight: 2 }}>
                        <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="3" style={{ verticalAlign: "middle" }}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                      </span>}
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
                    <div style={{ width: 36, height: 36, minWidth: 36, minHeight: 36, borderRadius: "50%", background: _acc, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 800, position: "relative", flexShrink: 0 }}>
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
                  <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                    {/* Tag button */}
                    <div style={{ position: "relative" }}>
                      <button onClick={() => setShowTagDropdown(!showTagDropdown)} title="Tags" style={{ width: 32, height: 32, borderRadius: 8, border: "1px solid rgba(0,0,0,.1)", background: (threadTags[selectedThread] || []).length > 0 ? "rgba(74,124,89,.08)" : "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={(threadTags[selectedThread] || []).length > 0 ? _acc : "#999"} strokeWidth="2"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>
                      </button>
                      {showTagDropdown && (
                        <div style={{ position: "absolute", top: 36, right: 0, background: "#fff", borderRadius: 10, boxShadow: "0 4px 20px rgba(0,0,0,.15)", padding: "8px 4px", zIndex: 20, width: 160 }} onClick={e => e.stopPropagation()}>
                          <div style={{ fontSize: 9, fontWeight: 700, color: "#999", textTransform: "uppercase", letterSpacing: .5, padding: "4px 10px" }}>Labels</div>
                          {TAG_OPTIONS.map(tag => {
                            const active = (threadTags[selectedThread] || []).includes(tag);
                            return (
                              <div key={tag} onClick={() => { setThreadTags(prev => { const curr = prev[selectedThread] || []; return { ...prev, [selectedThread]: active ? curr.filter(t => t !== tag) : [...curr, tag] }; }); }} style={{ padding: "6px 10px", cursor: "pointer", display: "flex", alignItems: "center", gap: 8, borderRadius: 6, fontSize: 12 }} onMouseEnter={e => e.currentTarget.style.background = "rgba(0,0,0,.04)"} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                                <div style={{ width: 10, height: 10, borderRadius: 3, background: TAG_COLORS[tag], opacity: active ? 1 : .3 }} />
                                <span style={{ flex: 1, textTransform: "capitalize", color: active ? "#1a1714" : "#999", fontWeight: active ? 600 : 400 }}>{tag}</span>
                                {active && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={_acc} strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                    {/* Export PDF */}
                    <button onClick={exportConversation} title="Export conversation" style={{ width: 32, height: 32, borderRadius: 8, border: "1px solid rgba(0,0,0,.1)", background: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                    </button>
                    {/* Away toggle */}
                    <div style={{ position: "relative" }}>
                      <button onClick={() => setShowAwayEdit(!showAwayEdit)} title={awayMode ? "Away mode ON" : "Away mode"} style={{ width: 32, height: 32, borderRadius: 8, border: awayMode ? "2px solid " + _acc : "1px solid rgba(0,0,0,.1)", background: awayMode ? _acc + "12" : "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={awayMode ? _acc : "#999"} strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                      </button>
                      {showAwayEdit && (
                        <div style={{ position: "absolute", top: 36, right: 0, background: "#fff", borderRadius: 10, boxShadow: "0 4px 20px rgba(0,0,0,.15)", padding: 14, zIndex: 20, width: 260 }} onClick={e => e.stopPropagation()}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                            <span style={{ fontSize: 11, fontWeight: 700, color: "#1a1714" }}>Away Mode</span>
                            <button onClick={() => setAwayMode(!awayMode)} style={{ padding: "3px 10px", borderRadius: 6, border: "1px solid " + (awayMode ? "#c45c4a" : _acc), background: awayMode ? "rgba(196,92,74,.08)" : _acc + "12", color: awayMode ? "#c45c4a" : _acc, fontSize: 10, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>{awayMode ? "Turn Off" : "Turn On"}</button>
                          </div>
                          <textarea value={awayMessage} onChange={e => setAwayMessage(e.target.value)} rows={3} style={{ width: "100%", padding: "8px 10px", borderRadius: 6, border: "1px solid rgba(0,0,0,.1)", fontSize: 11, fontFamily: "inherit", resize: "none", outline: "none", boxSizing: "border-box" }} />
                          <div style={{ fontSize: 9, color: "#999", marginTop: 4 }}>Auto-replies to new inbound messages when enabled.</div>
                        </div>
                      )}
                    </div>
                    {/* Notifications */}
                    {!notifEnabled && (
                      <button onClick={requestNotifPermission} title="Enable notifications" style={{ width: 32, height: 32, borderRadius: 8, border: "1px solid rgba(0,0,0,.1)", background: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
                      </button>
                    )}
                    {notifEnabled && (
                      <div title="Notifications enabled" style={{ width: 32, height: 32, borderRadius: 8, border: "1px solid rgba(0,0,0,.1)", background: _acc + "12", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={_acc} strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
                      </div>
                    )}
                    {/* Pin */}
                    <button onClick={() => setPinnedThreads(prev => { const next = new Set(prev); if (next.has(selectedThread)) next.delete(selectedThread); else next.add(selectedThread); return next; })} title={pinnedThreads.has(selectedThread) ? "Unpin" : "Pin conversation"} style={{ width: 32, height: 32, borderRadius: 8, border: "1px solid rgba(0,0,0,.1)", background: pinnedThreads.has(selectedThread) ? "rgba(212,168,83,.1)" : "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill={pinnedThreads.has(selectedThread) ? "#d4a853" : "none"} stroke={pinnedThreads.has(selectedThread) ? "#d4a853" : "#999"} strokeWidth="2"><path d="M12 17v5"/><path d="M5 17h14"/><path d="M7.5 17l1-7h7l1 7"/><path d="M9.5 10V3h5v7"/></svg>
                    </button>
                    {/* Star */}
                    <button onClick={() => setStarredThreads(prev => { const next = new Set(prev); if (next.has(selectedThread)) next.delete(selectedThread); else next.add(selectedThread); return next; })} title={starredThreads.has(selectedThread) ? "Unstar" : "Star"} style={{ width: 32, height: 32, borderRadius: 8, border: "1px solid rgba(0,0,0,.1)", background: starredThreads.has(selectedThread) ? "rgba(212,168,83,.1)" : "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill={starredThreads.has(selectedThread) ? "#d4a853" : "none"} stroke={starredThreads.has(selectedThread) ? "#d4a853" : "#999"} strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                    </button>
                    {/* Snooze */}
                    <div style={{ position: "relative" }}>
                      <button onClick={() => setShowSnoozeMenu(!showSnoozeMenu)} title="Snooze" style={{ width: 32, height: 32, borderRadius: 8, border: "1px solid rgba(0,0,0,.1)", background: snoozedThreads[selectedThread] ? "rgba(59,130,246,.1)" : "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={snoozedThreads[selectedThread] ? "#3b82f6" : "#999"} strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                      </button>
                      {showSnoozeMenu && (
                        <div style={{ position: "absolute", top: 36, right: 0, background: "#fff", border: "1px solid rgba(0,0,0,.1)", borderRadius: 8, boxShadow: "0 4px 16px rgba(0,0,0,.12)", zIndex: 20, minWidth: 160, overflow: "hidden" }}>
                          {[["1 hour", 1], ["4 hours", 4], ["Tomorrow", 24], ["3 days", 72], ["1 week", 168]].map(([label, hours]) => (
                            <button key={label} onClick={() => { setSnoozedThreads(prev => ({ ...prev, [selectedThread]: Date.now() + hours * 3600000 })); setShowSnoozeMenu(false); setSelectedThread(null); }} style={{ display: "block", width: "100%", padding: "9px 14px", background: "none", border: "none", textAlign: "left", fontSize: 12, cursor: "pointer", fontFamily: "inherit", color: "#1a1714" }} onMouseEnter={e => e.currentTarget.style.background = "rgba(0,0,0,.04)"} onMouseLeave={e => e.currentTarget.style.background = "none"}>{label}</button>
                          ))}
                          {snoozedThreads[selectedThread] && <button onClick={() => { setSnoozedThreads(prev => { const next = { ...prev }; delete next[selectedThread]; return next; }); setShowSnoozeMenu(false); }} style={{ display: "block", width: "100%", padding: "9px 14px", background: "none", border: "none", borderTop: "1px solid rgba(0,0,0,.06)", textAlign: "left", fontSize: 12, cursor: "pointer", fontFamily: "inherit", color: "#3b82f6", fontWeight: 700 }}>Unsnooze</button>}
                        </div>
                      )}
                    </div>
                    {/* Assign */}
                    <div style={{ position: "relative" }}>
                      <button onClick={() => setShowAssignMenu(!showAssignMenu)} title="Assign" style={{ width: 32, height: 32, borderRadius: 8, border: "1px solid rgba(0,0,0,.1)", background: assignedThreads[selectedThread] ? "rgba(74,124,89,.1)" : "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={assignedThreads[selectedThread] ? "#4a7c59" : "#999"} strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                      </button>
                      {showAssignMenu && (
                        <div style={{ position: "absolute", top: 36, right: 0, background: "#fff", border: "1px solid rgba(0,0,0,.1)", borderRadius: 8, boxShadow: "0 4px 16px rgba(0,0,0,.12)", zIndex: 20, minWidth: 180, overflow: "hidden" }}>
                          <div style={{ padding: "8px 14px", fontSize: 9, fontWeight: 700, color: "#999", textTransform: "uppercase", letterSpacing: .5 }}>Assign to</div>
                          {(settings?.teamMembers || [settings?.pmName || "Me"]).map(name => (
                            <button key={name} onClick={() => { setAssignedThreads(prev => ({ ...prev, [selectedThread]: name })); setShowAssignMenu(false); }} style={{ display: "block", width: "100%", padding: "9px 14px", background: assignedThreads[selectedThread] === name ? "rgba(74,124,89,.06)" : "none", border: "none", textAlign: "left", fontSize: 12, cursor: "pointer", fontFamily: "inherit", color: "#1a1714", fontWeight: assignedThreads[selectedThread] === name ? 700 : 400 }} onMouseEnter={e => e.currentTarget.style.background = "rgba(0,0,0,.04)"} onMouseLeave={e => e.currentTarget.style.background = assignedThreads[selectedThread] === name ? "rgba(74,124,89,.06)" : "none"}>{name}{assignedThreads[selectedThread] === name ? " (assigned)" : ""}</button>
                          ))}
                          {assignedThreads[selectedThread] && <button onClick={() => { setAssignedThreads(prev => { const next = { ...prev }; delete next[selectedThread]; return next; }); setShowAssignMenu(false); }} style={{ display: "block", width: "100%", padding: "9px 14px", background: "none", border: "none", borderTop: "1px solid rgba(0,0,0,.06)", textAlign: "left", fontSize: 12, cursor: "pointer", fontFamily: "inherit", color: "#c45c4a", fontWeight: 700 }}>Unassign</button>}
                        </div>
                      )}
                    </div>
                    {/* Archive */}
                    <button onClick={() => { if (archivedThreads.has(selectedThread)) { setArchivedThreads(prev => { const next = new Set(prev); next.delete(selectedThread); return next; }); } else if (window.confirm("Archive this conversation with " + activeThread.tenantName + "? You can find it in the Archived filter.")) { setArchivedThreads(prev => { const next = new Set(prev); next.add(selectedThread); return next; }); setSelectedThread(null); } }} title={archivedThreads.has(selectedThread) ? "Unarchive" : "Archive"} style={{ width: 32, height: 32, borderRadius: 8, border: "1px solid rgba(0,0,0,.1)", background: archivedThreads.has(selectedThread) ? "rgba(0,0,0,.06)" : "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2"><polyline points="21 8 21 21 3 21 3 8"/><rect x="1" y="3" width="22" height="5"/><line x1="10" y1="12" x2="14" y2="12"/></svg>
                    </button>
                    {/* Info */}
                    <button onClick={() => setShowTenantInfo(!showTenantInfo)} title="Tenant info" style={{ width: 32, height: 32, borderRadius: 8, border: "1px solid rgba(0,0,0,.1)", background: showTenantInfo ? "rgba(0,0,0,.04)" : "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                    </button>
                  </div>
                </div>

                {/* Messages */}
                <div style={S.chatScroll} onClick={() => { setShowReactions(null); setShowCanned(false); setShowTagDropdown(false); setShowAwayEdit(false); setShowEmoji(false); }}>
                  {activeMessages.map((msg, i) => {
                    const isOut = msg.direction === "outbound";
                    const isNote = msg.direction === "note";
                    const prevMsg = activeMessages[i - 1];
                    const showDateGroup = !prevMsg || fmtDateGroup(prevMsg.created_at) !== fmtDateGroup(msg.created_at);
                    const reactions = msg.reactions || {};
                    const hasReactions = Object.keys(reactions).length > 0;
                    const isRenewal = msg.subject?.startsWith("Lease Renewal:");
                    const isHovered = hoveredMsg === msg.id;
                    const isEditing = editingMsg === msg.id;
                    const isDeleted = msg.deleted;

                    return (
                      <div key={msg.id}>
                        {showDateGroup && <div style={S.dateGroup}>{fmtDateGroup(msg.created_at)}</div>}
                        <div className="msg-bubble" style={{ display: "flex", justifyContent: isOut || isNote ? "flex-end" : "flex-start", marginBottom: hasReactions ? 20 : 8, position: "relative" }}
                          onMouseEnter={() => setHoveredMsg(msg.id)} onMouseLeave={() => setHoveredMsg(null)}>
                          {/* Edit/Delete actions for outbound */}
                          {(isOut || isNote) && isHovered && !isEditing && !isDeleted && (
                            <div style={{ display: "flex", gap: 2, alignItems: "center", marginRight: 4, alignSelf: "center" }}>
                              <button onClick={e => { e.stopPropagation(); setEditingMsg(msg.id); setEditMsgText(msg.body || ""); }} title="Edit" style={{ width: 24, height: 24, borderRadius: 6, border: "1px solid rgba(0,0,0,.08)", background: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                              </button>
                              <button onClick={e => { e.stopPropagation(); deleteMsg(msg.id); }} title="Delete" style={{ width: 24, height: 24, borderRadius: 6, border: "1px solid rgba(0,0,0,.08)", background: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#c45c4a" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                              </button>
                            </div>
                          )}
                          <div
                            onDoubleClick={e => { e.stopPropagation(); setShowReactions(showReactions === msg.id ? null : msg.id); }}
                            style={{
                              ...S.bubble(isOut || isNote, isNote ? "#f5f0e8" : _acc),
                              ...(isNote ? { background: "#fef9ed", border: "1px dashed rgba(212,168,83,.4)", color: "#6b5e52" } : {}),
                              ...(isDeleted ? { opacity: .5, fontStyle: "italic" } : {}),
                            }}>
                            {isNote && <div style={{ fontSize: 9, fontWeight: 700, color: "#9a7422", marginBottom: 3 }}>INTERNAL NOTE</div>}
                            {isRenewal && !isOut && <div style={{ fontSize: 9, fontWeight: 700, color: isOut ? "rgba(255,255,255,.7)" : "#9a7422", marginBottom: 3 }}>LEASE RENEWAL REQUEST</div>}
                            {msg.subject && !isRenewal && !isNote && <div style={{ fontSize: 10, fontWeight: 700, opacity: .6, marginBottom: 3 }}>{msg.subject}</div>}
                            {msg.attachment && msg.attachment.type?.startsWith("image/") && <img src={msg.attachment.data} style={{ maxWidth: "100%", borderRadius: 8, marginBottom: 4, maxHeight: 200, objectFit: "cover" }} alt="" />}
                            {msg.attachment && !msg.attachment.type?.startsWith("image/") && <div style={{ padding: "6px 10px", background: "rgba(0,0,0,.08)", borderRadius: 6, fontSize: 11, marginBottom: 4, display: "flex", alignItems: "center", gap: 4 }}><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>{msg.attachment.name}</div>}
                            {isEditing ? (
                              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                                <textarea value={editMsgText} onChange={e => setEditMsgText(e.target.value)} onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); saveEditMsg(msg.id); } if (e.key === "Escape") { setEditingMsg(null); setEditMsgText(""); } }} rows={2} style={{ width: "100%", padding: "6px 8px", borderRadius: 6, border: "1px solid rgba(255,255,255,.3)", fontSize: 12, fontFamily: "inherit", resize: "none", outline: "none", background: "rgba(255,255,255,.15)", color: "inherit", boxSizing: "border-box" }} autoFocus />
                                <div style={{ display: "flex", gap: 4, justifyContent: "flex-end" }}>
                                  <button onClick={() => { setEditingMsg(null); setEditMsgText(""); }} style={{ padding: "2px 8px", borderRadius: 4, border: "1px solid rgba(255,255,255,.3)", background: "transparent", color: "inherit", fontSize: 10, cursor: "pointer", fontFamily: "inherit" }}>Cancel</button>
                                  <button onClick={() => saveEditMsg(msg.id)} style={{ padding: "2px 8px", borderRadius: 4, border: "none", background: "rgba(255,255,255,.25)", color: "inherit", fontSize: 10, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Save</button>
                                </div>
                              </div>
                            ) : (
                              <div style={{ fontSize: 13, lineHeight: 1.6, whiteSpace: "pre-wrap" }}>{msg.body}{msg.edited && <span style={{ fontSize: 9, opacity: .6, marginLeft: 4 }}>(edited)</span>}</div>
                            )}
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

                {/* Slash command menu */}
                {showSlashMenu && (
                  <div style={{ padding: "8px 16px", borderTop: "1px solid rgba(0,0,0,.06)", background: "#fafaf8" }}>
                    <div style={{ fontSize: 9, fontWeight: 700, color: "#999", textTransform: "uppercase", letterSpacing: .5, marginBottom: 4 }}>Commands</div>
                    {SLASH_COMMANDS.filter(c => c.cmd.startsWith(replyText.trim()) || replyText.trim() === "/").map(c => (
                      <div key={c.cmd} onClick={() => insertSlashCommand(c.cmd)} style={{ padding: "8px 10px", borderRadius: 6, cursor: "pointer", display: "flex", alignItems: "center", gap: 10, transition: "background .1s" }} onMouseEnter={e => e.currentTarget.style.background = "rgba(0,0,0,.04)"} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                        <code style={{ fontSize: 12, fontWeight: 700, color: _acc, background: "rgba(0,0,0,.04)", padding: "2px 6px", borderRadius: 4 }}>{c.cmd}</code>
                        <div><div style={{ fontSize: 12, fontWeight: 600 }}>{c.label}</div><div style={{ fontSize: 10, color: "#999" }}>{c.desc}</div></div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Schedule mode — inline date picker above input */}
                {showSchedule && (
                  <div style={{ padding: "8px 16px", borderTop: "1px solid rgba(59,130,246,.15)", background: "rgba(59,130,246,.03)", display: "flex", gap: 8, alignItems: "center" }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                    <span style={{ fontSize: 11, fontWeight: 600, color: "#3b82f6" }}>Schedule for:</span>
                    <input type="datetime-local" value={scheduleTime} onChange={e => setScheduleTime(e.target.value)} min={new Date().toISOString().slice(0, 16)} style={{ flex: 1, padding: "6px 10px", borderRadius: 6, border: "1px solid rgba(59,130,246,.2)", fontSize: 11, fontFamily: "inherit", background: "#fff" }} />
                    <button onClick={() => { setShowSchedule(false); setScheduleTime(""); }} style={{ background: "none", border: "none", cursor: "pointer", color: "#999" }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    </button>
                  </div>
                )}

                {/* Inline maintenance request form */}
                {maintForm && (
                  <div style={{ padding: "12px 16px", borderTop: "1px solid rgba(0,0,0,.06)", background: "#fafaf8" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: "#1a1714" }}>New Maintenance Request</div>
                      <button onClick={() => setMaintForm(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#999", fontSize: 14 }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                      </button>
                    </div>
                    <input value={maintForm.title} onChange={e => setMaintForm(p => ({ ...p, title: e.target.value }))} placeholder="What is the issue?" style={{ width: "100%", padding: "8px 10px", borderRadius: 6, border: "1px solid rgba(0,0,0,.1)", fontSize: 12, fontFamily: "inherit", marginBottom: 8, boxSizing: "border-box" }} />
                    <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 9, fontWeight: 700, color: "#6b5e52", marginBottom: 3 }}>SCOPE</div>
                        <div style={{ display: "flex", gap: 4 }}>
                          {[["room", "Room Only"], ["unit", "Whole Unit"], ["common", "Common Area"]].map(([v, l]) => (
                            <button key={v} onClick={() => setMaintForm(p => ({ ...p, scope: v }))} style={{ flex: 1, padding: "5px 0", borderRadius: 5, fontSize: 10, fontWeight: maintForm.scope === v ? 700 : 500, border: "1px solid " + (maintForm.scope === v ? _acc : "rgba(0,0,0,.08)"), background: maintForm.scope === v ? _acc + "12" : "#fff", color: maintForm.scope === v ? _acc : "#999", cursor: "pointer", fontFamily: "inherit" }}>{l}</button>
                          ))}
                        </div>
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 9, fontWeight: 700, color: "#6b5e52", marginBottom: 3 }}>PRIORITY</div>
                        <div style={{ display: "flex", gap: 4 }}>
                          {[["low", "Low", "#4a7c59"], ["medium", "Med", "#d4a853"], ["high", "High", "#c45c4a"]].map(([v, l, c]) => (
                            <button key={v} onClick={() => setMaintForm(p => ({ ...p, priority: v }))} style={{ flex: 1, padding: "5px 0", borderRadius: 5, fontSize: 10, fontWeight: maintForm.priority === v ? 700 : 500, border: "1px solid " + (maintForm.priority === v ? c : "rgba(0,0,0,.08)"), background: maintForm.priority === v ? c + "15" : "#fff", color: maintForm.priority === v ? c : "#999", cursor: "pointer", fontFamily: "inherit" }}>{l}</button>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: 6, marginBottom: 8, fontSize: 10, color: "#6b5e52" }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 9, fontWeight: 700, marginBottom: 3 }}>PROPERTY</div>
                        <div style={{ padding: "4px 8px", background: "#fff", borderRadius: 4, border: "1px solid rgba(0,0,0,.06)" }}>{maintForm.propName || "Not specified"}</div>
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 9, fontWeight: 700, marginBottom: 3 }}>ROOM</div>
                        <div style={{ padding: "4px 8px", background: "#fff", borderRadius: 4, border: "1px solid rgba(0,0,0,.06)" }}>{maintForm.scope === "common" ? "N/A (common area)" : maintForm.roomName || "Not specified"}</div>
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: 6, marginBottom: 4, fontSize: 10, color: "#6b5e52" }}>
                      <div style={{ padding: "4px 8px", background: "#fff", borderRadius: 4, border: "1px solid rgba(0,0,0,.06)", flex: 1 }}>Tenant: {activeThread?.tenantName || "Unknown"}</div>
                    </div>
                    <button disabled={!maintForm.title.trim()} onClick={async () => {
                      let pmId = null;
                      try { const { data: pmRows } = await supabase.from("pm_accounts").select("id").limit(1).single(); pmId = pmRows?.id || null; } catch (e) {}
                      const { error } = await supabase.from("maintenance_requests").insert({
                        pm_id: pmId, title: maintForm.title, description: "Scope: " + maintForm.scope + " | Created via PM messages",
                        priority: maintForm.priority, submitted_by: settings?.pmName || "PM", status: "open",
                      });
                      if (error) { console.error("Maintenance error:", error); await sendSystemMessage("Failed: " + error.message); }
                      else {
                        if (setMaint && uid) {
                          const newReq = { id: uid(), roomId: "", propId: "", tenant: activeThread?.tenantName || "", propName: maintForm.propName, roomName: maintForm.scope === "common" ? "Common Area" : maintForm.roomName, title: maintForm.title, desc: "Scope: " + maintForm.scope, status: "open", priority: maintForm.priority, created: new Date().toISOString().split("T")[0], photos: 0 };
                          setMaint(prev => { const updated = [newReq, ...prev]; if (save) save("hq-maint", updated); return updated; });
                        }
                        await sendSystemMessage("Maintenance request created: " + maintForm.title + " (" + maintForm.scope + ", " + maintForm.priority + " priority) at " + maintForm.propName);
                        if (activeThread?.tenantEmail) { try { await fetch("/api/send-email", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ to: activeThread.tenantEmail, subject: "Maintenance Request: " + maintForm.title, html: "<p>A maintenance request has been created:</p><p><strong>" + maintForm.title + "</strong></p><p>Priority: " + maintForm.priority + " | Scope: " + maintForm.scope + "</p><p>" + (settings?.companyName || "") + "</p>" }) }); } catch (e) {} }
                      }
                      setMaintForm(null);
                    }} style={{ width: "100%", padding: "8px", borderRadius: 6, border: "none", background: maintForm.title.trim() ? _acc : "rgba(0,0,0,.08)", color: maintForm.title.trim() ? "#fff" : "#bbb", fontWeight: 700, fontSize: 12, cursor: maintForm.title.trim() ? "pointer" : "default", fontFamily: "inherit" }}>
                      Create Maintenance Request
                    </button>
                  </div>
                )}

                {/* Scheduled messages — always visible above input */}
                {scheduledMsgs.filter(m => m.threadKey === selectedThread).length > 0 && (
                  <div style={{ padding: "8px 16px", background: "rgba(59,130,246,.04)", borderTop: "2px solid rgba(59,130,246,.2)", flexShrink: 0 }}>
                    <div style={{ fontSize: 9, fontWeight: 700, color: "#3b82f6", textTransform: "uppercase", letterSpacing: .5, marginBottom: 6 }}>
                      Scheduled ({scheduledMsgs.filter(m => m.threadKey === selectedThread).length})
                    </div>
                    {scheduledMsgs.filter(m => m.threadKey === selectedThread).map((sm, si) => {
                      const idx = scheduledMsgs.indexOf(sm);
                      return (
                        <div key={si} style={{ display: "flex", gap: 6, alignItems: "flex-start", marginBottom: 6, padding: "6px 8px", background: "#fff", borderRadius: 6, border: "1px solid rgba(59,130,246,.15)" }}>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" style={{ flexShrink: 0, marginTop: 2 }}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <textarea value={sm.text} onChange={e => updateScheduled(idx, { text: e.target.value })} style={{ width: "100%", border: "none", background: "transparent", fontSize: 11, fontFamily: "inherit", resize: "none", outline: "none", padding: 0, lineHeight: 1.4 }} rows={1} />
                            <div style={{ fontSize: 9, color: "#3b82f6", marginTop: 2 }}>
                              <input type="datetime-local" value={sm.scheduledAt ? new Date(sm.scheduledAt).toISOString().slice(0, 16) : ""} onChange={e => updateScheduled(idx, { scheduledAt: new Date(e.target.value).toISOString() })} style={{ border: "none", background: "transparent", fontSize: 9, color: "#3b82f6", fontFamily: "inherit", outline: "none", padding: 0 }} />
                            </div>
                          </div>
                          <div style={{ display: "flex", gap: 2, flexShrink: 0 }}>
                            <button onClick={() => { const msg = scheduledMsgs[idx]; setReplyText(msg.text); deleteScheduled(idx); }} title="Send now" style={{ width: 20, height: 20, borderRadius: 4, border: "none", background: "rgba(74,124,89,.1)", color: "#4a7c59", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10 }}>
                              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                            </button>
                            <button onClick={() => deleteScheduled(idx)} title="Delete" style={{ width: 20, height: 20, borderRadius: 4, border: "none", background: "rgba(196,92,74,.08)", color: "#c45c4a", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10 }}>
                              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Canned responses (editable) */}
                {showCanned && (
                  <div style={{ padding: "8px 16px", borderTop: "1px solid rgba(0,0,0,.06)", maxHeight: 200, overflowY: "auto" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                      <div style={{ fontSize: 9, fontWeight: 700, color: "#999", textTransform: "uppercase", letterSpacing: .5 }}>Quick Replies</div>
                      <button onClick={() => setEditingReplies(!editingReplies)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 10, color: _acc, fontWeight: 600, fontFamily: "inherit" }}>{editingReplies ? "Done" : "Edit"}</button>
                    </div>
                    {editingReplies ? (
                      <div>
                        {savedReplies.map((cr, i) => (
                          <div key={i} draggable
                            onDragStart={e => { e.dataTransfer.setData("replyIdx", String(i)); e.currentTarget.style.opacity = "0.4"; }}
                            onDragEnd={e => { e.currentTarget.style.opacity = "1"; }}
                            onDragOver={e => { e.preventDefault(); e.currentTarget.style.borderTop = "2px solid " + _acc; }}
                            onDragLeave={e => { e.currentTarget.style.borderTop = "none"; }}
                            onDrop={e => { e.preventDefault(); e.currentTarget.style.borderTop = "none"; const from = Number(e.dataTransfer.getData("replyIdx")); if (from === i) return; const next = [...savedReplies]; const [moved] = next.splice(from, 1); next.splice(i, 0, moved); setSavedReplies(next); }}
                            style={{ display: "flex", gap: 4, marginBottom: 4, alignItems: "center", cursor: "grab" }}>
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#bbb" strokeWidth="2" style={{ flexShrink: 0 }}><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
                            <input value={cr} onChange={e => { const next = [...savedReplies]; next[i] = e.target.value; setSavedReplies(next); }} onClick={e => e.stopPropagation()} style={{ flex: 1, padding: "6px 8px", borderRadius: 6, border: "1px solid rgba(0,0,0,.1)", fontSize: 11, fontFamily: "inherit", outline: "none" }} />
                            <button onClick={() => setSavedReplies(prev => prev.filter((_, j) => j !== i))} style={{ width: 24, height: 24, borderRadius: 6, border: "1px solid rgba(0,0,0,.08)", background: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#c45c4a" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                            </button>
                          </div>
                        ))}
                        <div style={{ display: "flex", gap: 4, marginTop: 6 }}>
                          <input value={editReplyDraft} onChange={e => setEditReplyDraft(e.target.value)} placeholder="Add new reply..." onKeyDown={e => { if (e.key === "Enter" && editReplyDraft.trim()) { setSavedReplies(prev => [...prev, editReplyDraft.trim()]); setEditReplyDraft(""); } }} style={{ flex: 1, padding: "6px 8px", borderRadius: 6, border: "1px solid rgba(0,0,0,.1)", fontSize: 11, fontFamily: "inherit", outline: "none" }} />
                          <button onClick={() => { if (editReplyDraft.trim()) { setSavedReplies(prev => [...prev, editReplyDraft.trim()]); setEditReplyDraft(""); } }} style={{ padding: "4px 10px", borderRadius: 6, border: "1px solid " + _acc, background: _acc + "12", color: _acc, fontSize: 10, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Add</button>
                        </div>
                      </div>
                    ) : (
                      savedReplies.map((cr, i) => (
                        <div key={i} onClick={() => { setReplyText(cr); setShowCanned(false); inputRef.current?.focus(); }} style={{ padding: "8px 10px", borderRadius: 6, cursor: "pointer", fontSize: 12, color: "#5c4a3a", marginBottom: 2, transition: "background .1s" }} onMouseEnter={e => e.currentTarget.style.background = "rgba(0,0,0,.04)"} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                          {cr}
                        </div>
                      ))
                    )}
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
                  {/* Emoji picker */}
                  <div style={{ position: "relative" }}>
                    <button onClick={() => setShowEmoji(!showEmoji)} title="Insert emoji" style={{ width: 36, height: 36, borderRadius: 8, border: "1px solid rgba(0,0,0,.1)", background: showEmoji ? "rgba(0,0,0,.04)" : "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>
                    </button>
                    {showEmoji && (() => {
                      const EMOJI_CATS = [
                        { name: "Smileys", emojis: "\ud83d\ude00\ud83d\ude03\ud83d\ude04\ud83d\ude01\ud83d\ude06\ud83d\ude05\ud83e\udd23\ud83d\ude02\ud83d\ude42\ud83d\ude43\ud83d\ude09\ud83d\ude0a\ud83d\ude07\ud83e\udd70\ud83d\ude0d\ud83e\udd29\ud83d\ude18\ud83d\ude17\ud83d\ude1a\ud83d\ude19\ud83d\ude0b\ud83d\ude1b\ud83d\ude1c\ud83d\ude1d\ud83e\udd11\ud83e\udd17\ud83e\udd2d\ud83e\udd2b\ud83e\udd14\ud83e\udd28\ud83d\ude10\ud83d\ude11\ud83d\ude36\ud83d\ude0f\ud83d\ude12\ud83d\ude44\ud83d\ude2c\ud83e\udd25\ud83d\ude0c\ud83d\ude14\ud83d\ude2a\ud83e\udd24\ud83d\ude34\ud83d\ude37\ud83e\udd12\ud83e\udd15\ud83e\udd22\ud83e\udd2e\ud83e\udd27\ud83e\udd75\ud83e\udd76\ud83d\ude35\ud83e\udd2f\ud83e\udd20\ud83e\udd73\ud83d\ude0e\ud83e\uddd0\ud83d\ude15\ud83d\ude1f\ud83d\ude41\ud83d\ude2e\ud83d\ude2f\ud83d\ude32\ud83d\ude33\ud83e\udd7a\ud83d\ude26\ud83d\ude27\ud83d\ude28\ud83d\ude30\ud83d\ude25\ud83d\ude22\ud83d\ude2d\ud83d\ude31\ud83d\ude16\ud83d\ude23\ud83d\ude1e\ud83d\ude13\ud83d\ude29\ud83d\ude24\ud83d\ude21\ud83d\ude20\ud83e\udd2c\ud83d\ude08\ud83d\udc7f\ud83d\udc80\u2620\ufe0f\ud83d\udca9\ud83e\udd21\ud83d\udc7b\ud83d\udc7d\ud83d\udc7e\ud83e\udd16".match(/./gu) },
                        { name: "People", emojis: "\ud83d\udc4d\ud83d\udc4e\u270a\ud83d\udc4a\ud83e\udd1b\ud83e\udd1c\ud83d\udc4f\ud83d\ude4c\ud83d\udc50\ud83e\udd32\ud83e\udd1d\ud83d\ude4f\u270d\ufe0f\ud83d\udc85\ud83e\udd33\ud83d\udcaa\ud83e\uddb5\ud83e\uddb6\ud83d\udc42\ud83d\udc43\ud83e\udde0\ud83d\udc41\ufe0f\ud83d\udc40\ud83d\udc45\ud83d\udc44\ud83d\udc76\ud83e\uddd2\ud83d\udc66\ud83d\udc67\ud83e\uddd1\ud83d\udc71\ud83d\udc68\ud83e\uddd4\ud83d\udc69\ud83e\uddd3\ud83d\udc74\ud83d\udc75\ud83d\ude4d\ud83d\ude4e\ud83d\ude45\ud83d\ude46\ud83d\udc81\ud83d\ude4b\ud83e\uddcf\ud83d\ude47\ud83e\udd26\ud83e\udd37\ud83d\udc6e\ud83d\udd75\ufe0f\ud83d\udc82\ud83e\udd77\ud83d\udc77\ud83e\udec5\ud83e\uddb8\ud83e\uddb9".match(/./gu) },
                        { name: "Nature", emojis: "\ud83d\udc36\ud83d\udc31\ud83d\udc2d\ud83d\udc39\ud83d\udc30\ud83e\udd8a\ud83d\udc3b\ud83d\udc3c\ud83e\udda5\ud83e\udda6\ud83e\udda8\ud83d\udc28\ud83d\udc2f\ud83e\udd81\ud83d\udc2e\ud83d\udc37\ud83d\udc38\ud83d\udc35\ud83d\udc12\ud83d\udc14\ud83d\udc27\ud83d\udc26\ud83e\udd85\ud83e\udd86\ud83e\udda2\ud83e\udd89\ud83e\udda4\ud83e\udda9\ud83d\udc22\ud83d\udc0d\ud83d\udc09\ud83e\udd95\ud83e\udd96\ud83d\udc33\ud83d\udc2c\ud83e\uddad\ud83d\udc1f\ud83d\udc20\ud83e\udd88\ud83d\udc19\ud83d\udc1a\ud83e\udd80\ud83e\udd90\ud83e\udeb2\ud83c\udf38\ud83c\udf39\ud83c\udf3b\ud83c\udf3c\ud83c\udf37\ud83c\udf3a\ud83c\udf32\ud83c\udf33\ud83c\udf34\ud83c\udf35\ud83c\udf3e\u2600\ufe0f\ud83c\udf24\ufe0f\u26c5\ud83c\udf25\ufe0f\ud83c\udf26\ufe0f\ud83c\udf27\ufe0f\u26c8\ufe0f\ud83c\udf28\ufe0f\ud83c\udf29\ufe0f\ud83c\udf2a\ufe0f\ud83c\udf08\u2744\ufe0f".match(/./gu) },
                        { name: "Food", emojis: "\ud83c\udf4f\ud83c\udf4e\ud83c\udf50\ud83c\udf4a\ud83c\udf4b\ud83c\udf4c\ud83c\udf49\ud83c\udf47\ud83c\udf53\ud83e\uded0\ud83c\udf48\ud83c\udf51\ud83e\udd5d\ud83e\udd65\ud83e\udd51\ud83c\udf45\ud83e\udd52\ud83e\udd6c\ud83e\udd66\ud83e\uddc4\ud83e\uddc5\ud83c\udf3d\ud83c\udf36\ufe0f\ud83e\uded1\ud83e\udd54\ud83e\udd55\ud83c\udf5e\ud83e\udd50\ud83e\udd56\ud83e\udded\ud83e\udd68\ud83e\udd6f\ud83e\uddc0\ud83c\udf56\ud83c\udf57\ud83e\udd69\ud83c\udf54\ud83c\udf5f\ud83c\udf55\ud83c\udf2e\ud83c\udf2f\ud83e\udd59\ud83e\uddc6\ud83c\udf73\ud83c\udf72\ud83e\udd63\ud83e\udd57\ud83c\udf7f\ud83e\uddc8\ud83c\udf66\ud83c\udf70\ud83c\udf82\ud83c\udf6e\ud83c\udf6d\ud83c\udf6c\ud83c\udf6b\u2615\ud83c\udf75\ud83e\uddc3\ud83e\udd64\ud83c\udf7a\ud83c\udf77\ud83e\udd42\ud83c\udf78\ud83c\udf79".match(/./gu) },
                        { name: "Travel", emojis: "\ud83c\udfe0\ud83c\udfe2\ud83c\udfe5\ud83c\udfe8\ud83c\udfea\ud83c\udfeb\ud83c\udfed\ud83c\udfef\ud83c\udff0\ud83d\udd4c\ud83d\udd4d\ud83d\uddfb\ud83c\udf0b\ud83d\uddfb\ud83c\udfd6\ufe0f\ud83c\udfd5\ufe0f\ud83c\udfd4\ufe0f\ud83d\ude97\ud83d\ude95\ud83d\ude99\ud83d\ude8c\ud83d\ude8e\ud83c\udfce\ufe0f\ud83d\ude93\ud83d\ude91\ud83d\ude92\ud83d\ude90\ud83d\udeb2\ud83d\udef5\ud83d\ude81\u2708\ufe0f\ud83d\udef3\ufe0f\ud83d\ude80\ud83d\udef8\ud83c\udf1e\ud83c\udf1d\ud83c\udf1b\ud83c\udf1c\ud83c\udf19\u2b50\ud83c\udf1f\ud83c\udf20\u2604\ufe0f\ud83c\udf0d\ud83c\udf0e\ud83c\udf0f\ud83c\udf0c\ud83c\udf89\ud83c\udf8a\ud83c\udf88\ud83c\udf87\ud83c\udf86\ud83c\udfc6\ud83e\udd47\ud83e\udd48\ud83e\udd49".match(/./gu) },
                        { name: "Symbols", emojis: "\u2764\ufe0f\ud83e\udde1\ud83d\udc9b\ud83d\udc9a\ud83d\udc99\ud83d\udc9c\ud83d\udda4\ud83e\udd0d\ud83e\udd0e\ud83d\udc94\u2763\ufe0f\ud83d\udc95\ud83d\udc9e\ud83d\udc93\ud83d\udc97\ud83d\udc96\ud83d\udc98\ud83d\udc9d\u2705\u274c\u2757\u2753\u2755\u203c\ufe0f\u2049\ufe0f\ud83d\udcaf\ud83d\udd05\ud83d\udd06\u26a0\ufe0f\ud83d\udea8\ud83d\uded1\u267b\ufe0f\ud83c\ude51\ud83c\ude50\u2795\u2796\u2716\ufe0f\u27b0\u27bf\u3030\ufe0f\u00a9\ufe0f\u00ae\ufe0f\u2122\ufe0f\ud83d\udd1d\ud83d\udd1a\ud83d\udd19\ud83d\udd1b\ud83d\udd1c\u23ea\u23e9\u23eb\u23ec\u25b6\ufe0f\u23f8\ufe0f\u23f9\ufe0f\u23fa\ufe0f\u23ef\ufe0f\ud83c\udf10\u267e\ufe0f\u269b\ufe0f\ud83c\udff3\ufe0f\ud83c\udff4\ud83c\udfc1\ud83d\udea9".match(/./gu) },
                      ];
                      const [emojiCat, setEmojiCatLocal] = [showEmoji === true ? 0 : showEmoji, (v) => setShowEmoji(v === false ? false : v)];
                      const cat = EMOJI_CATS[typeof emojiCat === "number" ? emojiCat : 0] || EMOJI_CATS[0];
                      return (
                        <div style={{ position: "absolute", bottom: 44, right: 0, background: "#fff", borderRadius: 12, boxShadow: "0 4px 24px rgba(0,0,0,.18)", padding: 0, zIndex: 20, width: 300, overflow: "hidden" }} onClick={e => e.stopPropagation()}>
                          {/* Category tabs */}
                          <div style={{ display: "flex", borderBottom: "1px solid rgba(0,0,0,.06)" }}>
                            {EMOJI_CATS.map((c, ci) => (
                              <button key={ci} onClick={() => setShowEmoji(ci)} style={{ flex: 1, padding: "8px 0", border: "none", borderBottom: (typeof emojiCat === "number" ? emojiCat : 0) === ci ? "2px solid " + _acc : "2px solid transparent", background: "transparent", fontSize: 10, fontWeight: (typeof emojiCat === "number" ? emojiCat : 0) === ci ? 700 : 500, color: (typeof emojiCat === "number" ? emojiCat : 0) === ci ? _acc : "#999", cursor: "pointer", fontFamily: "inherit" }}>{c.name}</button>
                            ))}
                          </div>
                          {/* Emoji grid */}
                          <div style={{ padding: 8, maxHeight: 200, overflowY: "auto" }}>
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(8, 1fr)", gap: 2 }}>
                              {cat.emojis.map((em, i) => (
                                <button key={i} onClick={() => { setReplyText(prev => prev + em); setShowEmoji(false); inputRef.current?.focus(); }} style={{ width: 32, height: 32, border: "none", background: "transparent", cursor: "pointer", fontSize: 18, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center" }} onMouseEnter={e => e.currentTarget.style.background = "rgba(0,0,0,.06)"} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                                  {em}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                  <div style={{ flex: 1, position: "relative" }}>
                    {noteMode && <div style={{ position: "absolute", top: -20, left: 0, fontSize: 9, fontWeight: 700, color: "#9a7422" }}>INTERNAL NOTE (tenant will not see this)</div>}
                    <textarea
                      ref={inputRef}
                      value={replyText}
                      onChange={e => { const v = e.target.value; setReplyText(v); setShowSlashMenu(v === "/" || (v.startsWith("/") && !v.includes(" ") && v.length < 15)); e.target.style.height = "auto"; e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px"; }}
                      onKeyDown={async e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); if (showSlashMenu) { const filtered = SLASH_COMMANDS.filter(c => c.cmd.startsWith(replyText.trim())); if (filtered.length === 1) insertSlashCommand(filtered[0].cmd); } else if (replyText.trim().startsWith("/")) { await executeSlashCommand(); } else { sendReply(); } } }}
                      placeholder={noteMode ? "Write an internal note..." : "Type a message... (/ for commands)"}
                      rows={1}
                      style={{ width: "100%", padding: "10px 14px", borderRadius: 12, border: noteMode ? "2px solid rgba(212,168,83,.4)" : "1.5px solid rgba(0,0,0,.1)", fontSize: 14, fontFamily: "inherit", resize: "none", outline: "none", background: noteMode ? "rgba(212,168,83,.04)" : "#fff", minHeight: 44, maxHeight: 120, lineHeight: 1.5 }}
                    />
                  </div>
                  {/* Send / Schedule button group */}
                  <div style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
                    {showSchedule ? (
                      <button onClick={scheduleMessage} disabled={!replyText.trim() || !scheduleTime} style={{ height: 40, padding: "0 16px", borderRadius: "20px 0 0 20px", border: "none", background: (replyText.trim() && scheduleTime) ? "#3b82f6" : "rgba(0,0,0,.08)", color: (replyText.trim() && scheduleTime) ? "#fff" : "#bbb", cursor: (replyText.trim() && scheduleTime) ? "pointer" : "default", display: "flex", alignItems: "center", gap: 6, fontWeight: 700, fontSize: 12, fontFamily: "inherit" }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                        Schedule
                      </button>
                    ) : (
                      <button onClick={sendReply} disabled={sending || !replyText.trim()} style={{ width: 40, height: 40, borderRadius: "20px 0 0 20px", border: "none", background: replyText.trim() ? _acc : "rgba(0,0,0,.08)", color: replyText.trim() ? "#fff" : "#bbb", cursor: replyText.trim() ? "pointer" : "default", display: "flex", alignItems: "center", justifyContent: "center", transition: "all .15s" }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                      </button>
                    )}
                    <button onClick={() => { setShowSchedule(!showSchedule); if (showSchedule) setScheduleTime(""); }} style={{ width: 20, height: 40, borderRadius: "0 20px 20px 0", border: "none", borderLeft: "1px solid rgba(255,255,255,.2)", background: showSchedule ? "#3b82f6" : (replyText.trim() ? _acc : "rgba(0,0,0,.08)"), color: showSchedule ? "#fff" : (replyText.trim() ? "#fff" : "#bbb"), cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <svg width="8" height="8" viewBox="0 0 12 8" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 1l5 5 5-5"/></svg>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* ── Tenant Info Sidebar ── */}
          {showTenantInfo && activeThread && (
            <div style={{ width: 240, borderLeft: "1px solid rgba(0,0,0,.06)", overflowY: "auto", padding: "20px 16px", background: "#fafaf8" }}>
              <div style={{ textAlign: "center", marginBottom: 16 }}>
                <div style={{ width: 56, height: 56, minWidth: 56, minHeight: 56, borderRadius: "50%", background: _acc, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, fontWeight: 800, margin: "0 auto 8px" }}>
                  {(activeThread.tenantName || "?")[0].toUpperCase()}
                </div>
                <div style={{ fontSize: 15, fontWeight: 700 }}>{activeThread.tenantName}</div>
                <div style={{ fontSize: 11, color: "#6b5e52", marginTop: 2 }}>{activeThread.tenantEmail}</div>
              </div>
              <div style={{ borderTop: "1px solid rgba(0,0,0,.06)", paddingTop: 12 }}>
                {[
                  ["Property", activeThread.propertyName],
                  ["Inbound", activeThread.messages.filter(m => m.direction === "inbound").length],
                  ["Outbound", activeThread.messages.filter(m => m.direction === "outbound").length],
                  ["Room", activeThread.roomName],
                  ["Messages", activeThread.messages.length],
                  ["First Message", activeThread.messages.length > 0 ? new Date(activeThread.messages[activeThread.messages.length - 1].created_at).toLocaleDateString() : "\u2014"],
                  ["Last Active", (() => { const last = activeThread.messages.filter(m => m.direction === "inbound").sort((a, b) => b.created_at.localeCompare(a.created_at))[0]; return last ? fmtTime(last.created_at) : "\u2014"; })()],
                  ["Avg Response", (() => { const sorted = [...activeThread.messages].sort((a, b) => a.created_at.localeCompare(b.created_at)); let totalMs = 0, count = 0; for (let j = 1; j < sorted.length; j++) { if (sorted[j].direction === "outbound" && sorted[j - 1].direction === "inbound") { totalMs += new Date(sorted[j].created_at) - new Date(sorted[j - 1].created_at); count++; } } if (!count) return "\u2014"; const avgMin = Math.round(totalMs / count / 60000); return avgMin < 60 ? avgMin + "m" : Math.round(avgMin / 60) + "h " + (avgMin % 60) + "m"; })()],
                ].filter(([, v]) => v).map(([k, v]) => (
                  <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid rgba(0,0,0,.03)", fontSize: 11 }}>
                    <span style={{ color: "#6b5e52" }}>{k}</span>
                    <span style={{ fontWeight: 600, textAlign: "right", maxWidth: "55%" }}>{v}</span>
                  </div>
                ))}
              </div>
              {/* Tags in sidebar */}
              {(threadTags[selectedThread] || []).length > 0 && (
                <div style={{ marginTop: 12, borderTop: "1px solid rgba(0,0,0,.06)", paddingTop: 10 }}>
                  <div style={{ fontSize: 9, fontWeight: 700, color: "#999", textTransform: "uppercase", letterSpacing: .5, marginBottom: 6 }}>Labels</div>
                  <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                    {threadTags[selectedThread].map(tag => (
                      <span key={tag} style={{ fontSize: 10, fontWeight: 600, padding: "2px 8px", borderRadius: 4, background: TAG_COLORS[tag] + "18", color: TAG_COLORS[tag], textTransform: "capitalize" }}>{tag}</span>
                    ))}
                  </div>
                </div>
              )}
              <div style={{ marginTop: 16 }}>
                <div style={{ fontSize: 9, fontWeight: 700, color: "#999", textTransform: "uppercase", letterSpacing: .5, marginBottom: 6 }}>Quick Actions</div>
                <button className="btn btn-out btn-sm" style={{ width: "100%", marginBottom: 4, fontSize: 10, display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }} onClick={() => { if (typeof window !== "undefined") window.dispatchEvent(new CustomEvent("navigate-tab", { detail: "tenants" })); }}>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  View Profile
                </button>
                <button className="btn btn-out btn-sm" style={{ width: "100%", marginBottom: 4, fontSize: 10, display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }} onClick={() => { setPinnedThreads(prev => { const next = new Set(prev); if (next.has(selectedThread)) next.delete(selectedThread); else next.add(selectedThread); return next; }); }}>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill={pinnedThreads.has(selectedThread) ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2"><path d="M12 17v5"/><path d="M5 17h14"/><path d="M7.5 17l1-7h7l1 7"/><path d="M9.5 10V3h5v7"/></svg>
                  {pinnedThreads.has(selectedThread) ? "Unpin Conversation" : "Pin Conversation"}
                </button>
                <button className="btn btn-out btn-sm" style={{ width: "100%", fontSize: 10, display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }} onClick={exportConversation}>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                  Export Chat
                </button>
              </div>
            </div>
          )}
        </div>
      )}
      </div>{/* end outer */}
    </>
  );
}
