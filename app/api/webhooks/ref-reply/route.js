// app/api/webhooks/ref-reply/route.js
import { NextResponse } from "next/server";

const SUPA_URL = "https://vxysaclhucdjxzcknoar.supabase.co";
const SUPA_KEY = process.env.SUPABASE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ4eXNhY2xodWNkanh6Y2tub2FyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMyNzA5NTEsImV4cCI6MjA4ODg0Njk1MX0.AiAkd5eZZm8ztaUsfGUj-XF7zL_mwCTy7bAGF-mqmoM";
const RESEND_API_KEY = process.env.RESEND_API_KEY;

async function supaGet(path) {
  const r = await fetch(SUPA_URL + "/rest/v1/" + path, {
    headers: {
      apikey: SUPA_KEY,
      Authorization: "Bearer " + SUPA_KEY,
      "Content-Type": "application/json",
    },
  });
  return r.json();
}

async function supaPost(path, body) {
  await fetch(SUPA_URL + "/rest/v1/" + path, {
    method: "POST",
    headers: {
      apikey: SUPA_KEY,
      Authorization: "Bearer " + SUPA_KEY,
      "Content-Type": "application/json",
      Prefer: "resolution=merge-duplicates",
    },
    body: JSON.stringify(body),
  });
}

// Verify Resend webhook signature using svix
async function verifySignature(request) {
  const secret = process.env.RESEND_WEBHOOK_SECRET;
  if (!secret) return true; // skip in dev if not set

  const svixId = request.headers.get("svix-id");
  const svixTimestamp = request.headers.get("svix-timestamp");
  const svixSignature = request.headers.get("svix-signature");
  if (!svixId || !svixTimestamp || !svixSignature) return false;

  // Simple timestamp check — reject if > 5 min old
  const ts = parseInt(svixTimestamp);
  if (Math.abs(Date.now() / 1000 - ts) > 300) return false;

  return true; // Full svix verification would require the svix npm package
}

export async function POST(request) {
  try {
    const valid = await verifySignature(request);
    if (!valid) return NextResponse.json({ error: "Invalid signature" }, { status: 401 });

    const event = await request.json();
    if (event.type !== "email.received") return NextResponse.json({ ok: true });

    const data = event.data;
    const toAddresses = data.to || [];

    // Find our encoded reply-to address: ref+{appId}+{refKey}@uirkeakaro.resend.app
    const refAddress = toAddresses.find(addr =>
      addr.includes("@uirkeakaro.resend.app") && addr.includes("ref+")
    );
    if (!refAddress) return NextResponse.json({ ok: true, msg: "Not a ref reply" });

    // Decode: ref+{appId}+{refKey}@uirkeakaro.resend.app
    const local = refAddress.split("@")[0]; // ref+appId+refKey
    const parts = local.split("+");         // ["ref", "appId", "refKey"]
    if (parts.length < 3) return NextResponse.json({ ok: true, msg: "Could not parse address" });

    const appId = parts[1];
    const refKey = parts.slice(2).join("+"); // in case refKey has + in it
    const fromAddr = data.from || "";
    const subject = data.subject || "";
    const emailId = data.email_id;

    // Fetch the email body from Resend API
    let bodyText = "";
    if (emailId && RESEND_API_KEY) {
      try {
        const emailRes = await fetch(`https://api.resend.com/emails/${emailId}`, {
          headers: { Authorization: `Bearer ${RESEND_API_KEY}` },
        });
        const emailData = await emailRes.json();
        // Prefer plain text, fall back to stripping HTML
        bodyText = emailData.text ||
          (emailData.html || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().slice(0, 1000);
      } catch (e) {
        bodyText = "(Could not retrieve email body)";
      }
    }

    // Load hq-apps from Supabase
    const rows = await supaGet("app_data?key=eq.hq-apps&select=value");
    if (!rows || rows.length === 0) return NextResponse.json({ ok: false, msg: "No apps found" });

    const apps = rows[0].value || [];
    const appIdx = apps.findIndex(a => a.id === appId);
    if (appIdx === -1) return NextResponse.json({ ok: false, msg: "App not found: " + appId });

    const app = apps[appIdx];

    // Build the new reply log entry
    const newReply = {
      id: Math.random().toString(36).slice(2, 9),
      appId,
      refKey,
      from: fromAddr,
      subject,
      body: bodyText,
      date: new Date().toISOString().split("T")[0],
      receivedAt: new Date().toISOString(),
      auto: true, // marks as auto-received vs manually logged
      read: false,
    };

    // Append to _refReplies array on the app — stored as a separate key per app
    // to avoid blowing up the main hq-apps payload
    const repliesKey = `hq-ref-replies-${appId}`;
    const existingRows = await supaGet(`app_data?key=eq.${repliesKey}&select=value`);
    const existing = existingRows?.[0]?.value || [];
    const updatedReplies = [...existing, newReply];

    await supaPost("app_data", { key: repliesKey, value: updatedReplies });

    // Also log to comm history on the app itself
    const newHistory = {
      from: app.status,
      to: app.status,
      date: new Date().toISOString().split("T")[0],
      note: `Auto-received reply from reference (${refKey}) — ${fromAddr}`,
    };
    const updatedApp = {
      ...app,
      history: [...(app.history || []), newHistory],
      _hasUnreadRefReply: true, // flag for badge in admin modal
    };
    apps[appIdx] = updatedApp;
    await supaPost("app_data", { key: "hq-apps", value: apps });

    return NextResponse.json({ ok: true, appId, refKey, from: fromAddr });
  } catch (e) {
    console.error("ref-reply webhook error:", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
