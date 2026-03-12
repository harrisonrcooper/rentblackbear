// app/api/apply/route.js
// Handles new applications: saves to Supabase + sends emails via Resend
// Set these in Vercel → Settings → Environment Variables:
//   RESEND_API_KEY - from resend.com
//   NOTIFICATION_EMAIL - your email (e.g. harrison@oakandmain.com)

const SUPA_URL = "https://vxysaclhucdjxzcknoar.supabase.co";
const SUPA_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ4eXNhY2xodWNkanh6Y2tub2FyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMyNzA5NTEsImV4cCI6MjA4ODg0Njk1MX0.AiAkd5eZZm8ztaUsfGUj-XF7zL_mwCTy7bAGF-mqmoM";

function uid() {
  return Math.random().toString(36).slice(2, 9);
}

export async function POST(request) {
  try {
    const form = await request.json();
    const { name, email, phone, property, moveIn, source, reason } = form;

    if (!name || !email || !phone) {
      return Response.json({ ok: false, error: "Name, email, and phone are required." }, { status: 400 });
    }

    // 1. Save to Supabase — add to applications list
    const appEntry = {
      id: uid(),
      name,
      email,
      phone,
      property: property || "No preference",
      room: "",
      moveIn: moveIn || "Flexible",
      income: "N/A",
      source: source || "Not provided",
      reason: reason || "",
      status: "pre-screened",
      submitted: new Date().toISOString().split("T")[0],
      bgCheck: "not-started",
      creditScore: "—",
      refs: "not-started",
    };

    // Fetch current applications
    const getRes = await fetch(`${SUPA_URL}/rest/v1/app_data?key=eq.hq-apps&select=value`, {
      headers: { apikey: SUPA_KEY, Authorization: `Bearer ${SUPA_KEY}` },
    });
    const getData = await getRes.json();
    const currentApps = getData?.[0]?.value || [];
    currentApps.unshift(appEntry);

    // Save updated applications
    await fetch(`${SUPA_URL}/rest/v1/app_data`, {
      method: "POST",
      headers: {
        apikey: SUPA_KEY,
        Authorization: `Bearer ${SUPA_KEY}`,
        "Content-Type": "application/json",
        Prefer: "resolution=merge-duplicates",
      },
      body: JSON.stringify({ key: "hq-apps", value: currentApps }),
    });

    // Also add a notification
    const getNotifs = await fetch(`${SUPA_URL}/rest/v1/app_data?key=eq.hq-notifs&select=value`, {
      headers: { apikey: SUPA_KEY, Authorization: `Bearer ${SUPA_KEY}` },
    });
    const notifData = await getNotifs.json();
    const currentNotifs = notifData?.[0]?.value || [];
    currentNotifs.unshift({
      id: uid(),
      type: "app",
      msg: `New application from ${name} for ${property || "no specific property"}`,
      date: new Date().toISOString().split("T")[0],
      read: false,
      urgent: false,
    });

    await fetch(`${SUPA_URL}/rest/v1/app_data`, {
      method: "POST",
      headers: {
        apikey: SUPA_KEY,
        Authorization: `Bearer ${SUPA_KEY}`,
        "Content-Type": "application/json",
        Prefer: "resolution=merge-duplicates",
      },
      body: JSON.stringify({ key: "hq-notifs", value: currentNotifs }),
    });

    // 2. Send email notification to Harrison
    const resendKey = process.env.RESEND_API_KEY;
    const notifyEmail = process.env.NOTIFICATION_EMAIL || "info@rentblackbear.com";

    if (resendKey) {
      // Email to Harrison
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "Black Bear Rentals <notifications@rentblackbear.com>",
          to: notifyEmail,
          subject: `🐻 NEW APPLICATION: ${name} — ${phone} — ${property || "No preference"}`,
          html: `
            <h2>New Application Received</h2>
            <table style="border-collapse:collapse;font-family:sans-serif;font-size:14px;">
              <tr><td style="padding:6px 12px;color:#666;">Name</td><td style="padding:6px 12px;font-weight:bold;">${name}</td></tr>
              <tr><td style="padding:6px 12px;color:#666;">Email</td><td style="padding:6px 12px;">${email}</td></tr>
              <tr><td style="padding:6px 12px;color:#666;">Phone</td><td style="padding:6px 12px;">${phone}</td></tr>
              <tr><td style="padding:6px 12px;color:#666;">Property</td><td style="padding:6px 12px;">${property || "No preference"}</td></tr>
              <tr><td style="padding:6px 12px;color:#666;">Move-in</td><td style="padding:6px 12px;">${moveIn || "Flexible"}</td></tr>
              <tr><td style="padding:6px 12px;color:#666;">Source</td><td style="padding:6px 12px;">${source || "Not provided"}</td></tr>
              ${reason ? `<tr><td style="padding:6px 12px;color:#666;">Reason for moving</td><td style="padding:6px 12px;">${reason}</td></tr>` : ""}
            </table>
            <p style="margin-top:20px;"><a href="https://rentblackbear.vercel.app/admin" style="background:#d4a853;color:#1a1714;padding:10px 24px;border-radius:6px;text-decoration:none;font-weight:bold;">View in Admin Hub →</a></p>
          `,
        }),
      });

      // 3. Auto-reply to applicant
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "Black Bear Rentals <hello@rentblackbear.com>",
          to: email,
          subject: "We got your application! 🐻",
          html: `
            <div style="font-family:sans-serif;max-width:560px;margin:0 auto;">
              <div style="background:#1a1714;padding:24px;text-align:center;">
                <h1 style="color:#d4a853;font-size:20px;margin:0;">🐻 Black Bear Rentals</h1>
              </div>
              <div style="padding:32px 24px;">
                <h2 style="font-size:22px;margin-bottom:12px;">Hey ${name.split(" ")[0]}, we got your application!</h2>
                <p style="color:#555;line-height:1.7;">Thanks for your interest in Black Bear Rentals. We've received your pre-screen application${property ? ` for <strong>${property}</strong>` : ""} and will review it shortly.</p>
                <p style="color:#555;line-height:1.7;"><strong>What happens next:</strong></p>
                <ul style="color:#555;line-height:2;">
                  <li>We'll review your info within 24 hours</li>
                  <li>If everything looks good, we'll schedule a tour</li>
                  <li>Background + credit check (you pay ~$50)</li>
                  <li>Sign lease and move in!</li>
                </ul>
                <p style="color:#555;line-height:1.7;">Questions in the meantime? Reply to this email or call us at <strong>(256) 555-0192</strong>.</p>
                <p style="color:#999;font-size:13px;margin-top:24px;">— Harrison Cooper<br/>Black Bear Rentals · Oak & Main Development LLC</p>
              </div>
            </div>
          `,
        }),
      });
    }

    return Response.json({ ok: true });
  } catch (error) {
    console.error("Apply API error:", error);
    return Response.json({ ok: false, error: "Server error. Please try again." }, { status: 500 });
  }
}
