// Runs every minute via Vercel cron (vercel.json)
// Sends any scheduled messages that are past due

const SUPA_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPA_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const RESEND_KEY = process.env.RESEND_API_KEY;

export async function GET(req) {
  // Allow cron secret OR no auth for testing
  const auth = req.headers.get("authorization");
  if (process.env.CRON_SECRET && auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  const now = new Date().toISOString();
  const log = [];

  try {
    // Fetch all unsent scheduled messages that are past due
    const res = await fetch(`${SUPA_URL}/rest/v1/scheduled_messages?sent=eq.false&scheduled_at=lte.${now}&select=*`, {
      headers: { apikey: SUPA_KEY, Authorization: `Bearer ${SUPA_KEY}` },
    });
    const messages = await res.json();

    if (!Array.isArray(messages) || messages.length === 0) {
      return Response.json({ sent: 0, log: ["No scheduled messages due"] });
    }

    // Load settings for PM info
    const settingsRes = await fetch(`${SUPA_URL}/rest/v1/app_data?key=eq.hq-settings&select=value`, {
      headers: { apikey: SUPA_KEY, Authorization: `Bearer ${SUPA_KEY}` },
    });
    const settingsData = await settingsRes.json();
    const s = settingsData?.[0]?.value || {};

    for (const sm of messages) {
      // Insert as a real message
      await fetch(`${SUPA_URL}/rest/v1/messages`, {
        method: "POST",
        headers: { apikey: SUPA_KEY, Authorization: `Bearer ${SUPA_KEY}`, "Content-Type": "application/json", Prefer: "return=representation" },
        body: JSON.stringify({
          tenant_name: sm.tenant_name,
          sender_email: s.pmEmail || s.email || "",
          sender_name: s.pmName || "Property Manager",
          direction: "outbound",
          body: sm.body,
          property_name: sm.property_name || "",
          room_name: sm.room_name || "",
          read: true,
        }),
      });

      // Mark as sent
      await fetch(`${SUPA_URL}/rest/v1/scheduled_messages?id=eq.${sm.id}`, {
        method: "PATCH",
        headers: { apikey: SUPA_KEY, Authorization: `Bearer ${SUPA_KEY}`, "Content-Type": "application/json", Prefer: "return=representation" },
        body: JSON.stringify({ sent: true }),
      });

      // Email tenant if we can find their email
      if (RESEND_KEY && sm.tenant_name) {
        // Try to find tenant email from messages
        const emailRes = await fetch(`${SUPA_URL}/rest/v1/messages?tenant_name=eq.${encodeURIComponent(sm.tenant_name)}&direction=eq.inbound&select=sender_email&limit=1`, {
          headers: { apikey: SUPA_KEY, Authorization: `Bearer ${SUPA_KEY}` },
        });
        const emailData = await emailRes.json();
        const tenantEmail = emailData?.[0]?.sender_email;
        if (tenantEmail) {
          try {
            await fetch("https://api.resend.com/emails", {
              method: "POST",
              headers: { Authorization: `Bearer ${RESEND_KEY}`, "Content-Type": "application/json" },
              body: JSON.stringify({
                from: `${s.pmName || "Property Manager"} <${s.email || process.env.SENDER_EMAIL || "noreply@rentblackbear.com"}>`,
                to: tenantEmail,
                subject: "Message from " + (s.companyName || "Your Property Manager"),
                html: `<p>${sm.body.replace(/\n/g, "<br/>")}</p><p style="font-size:11px;color:#999;">${s.companyName || ""}</p>`,
              }),
            });
          } catch (e) {}
        }
      }

      log.push(`Sent to ${sm.tenant_name}: ${(sm.body || "").slice(0, 50)}`);
    }

    return Response.json({ sent: messages.length, log });
  } catch (err) {
    console.error("Send scheduled error:", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
