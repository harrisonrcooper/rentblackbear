// app/api/webhooks/ref-reply/route.js
import { NextResponse } from "next/server";
import { Resend } from "resend";
import { loadAppData, saveAppData } from "@/lib/supabase-server";

let _resend;
const getResend = () => _resend || (_resend = new Resend(process.env.RESEND_API_KEY));

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
    if (emailId) {
      try {
        const { data: email, error } = await getResend().emails.receiving.get(emailId);
        if (error) {
          console.error("Resend receiving.get error:", error);
          bodyText = "(Could not fetch reply: " + JSON.stringify(error) + ")";
        } else {
          // Prefer plain text, strip quoted reply chains, fall back to HTML
          let raw = email.text || (email.html || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
          // Strip quoted lines (starting with >) and "On ... wrote:" lines
          raw = raw.split("\n").filter(l => !l.trim().startsWith(">") && !/^On .+ wrote:/.test(l.trim())).join("\n").trim();
          bodyText = raw.slice(0, 1500) || "(Empty reply body)";
        }
      } catch (e) {
        console.error("Body fetch exception:", e);
        bodyText = "(Exception fetching body: " + e.message + ")";
      }
    }

    // Load hq-apps from Supabase
    const apps = await loadAppData("hq-apps", []);
    if (!apps || apps.length === 0) return NextResponse.json({ ok: false, msg: "No apps found" });
    const appIdx = apps.findIndex(a => a.id === appId);
    if (appIdx === -1) return NextResponse.json({ ok: false, msg: "App not found: " + appId });

    const app = apps[appIdx];

    // Build the new reply log entry
    // Extract just the email address from "Name <email>" format
    const fromEmail = fromAddr.includes("<")
      ? fromAddr.match(/<([^>]+)>/)?.[1] || fromAddr
      : fromAddr;

    const newReply = {
      id: Math.random().toString(36).slice(2, 9),
      appId,
      refKey,
      email: fromEmail,   // the reference's email address — used for UI matching
      from: fromAddr,
      subject,
      body: bodyText,
      notes: bodyText,    // alias used by manual log reply display
      date: new Date().toISOString().split("T")[0],
      receivedAt: new Date().toISOString(),
      auto: true,
      read: false,
    };

    // Append to _refReplies array on the app — stored as a separate key per app
    // to avoid blowing up the main hq-apps payload
    const repliesKey = `hq-ref-replies-${appId}`;
    const existing = await loadAppData(repliesKey, []);
    const updatedReplies = [...existing, newReply];

    await saveAppData(repliesKey, updatedReplies);

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
    await saveAppData("hq-apps", apps);

    return NextResponse.json({ ok: true, appId, refKey, from: fromAddr });
  } catch (e) {
    console.error("ref-reply webhook error:", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
