// app/api/send-email/route.js
// Generic email sender using Resend.
// Used by Email Apply Link and Email Portal Invite modals.

import { getSettings, fromAddress } from "@/lib/getSettings";

export async function POST(request) {
  try {
    const { to, subject, html } = await request.json();

    if (!to || !subject || !html) {
      return Response.json({ ok: false, error: "Missing to, subject, or html" }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(to)) {
      return Response.json({ ok: false, error: "Invalid email address" }, { status: 400 });
    }

    const resendKey = process.env.RESEND_API_KEY;
    if (!resendKey) {
      return Response.json({ ok: false, error: "RESEND_API_KEY not configured" }, { status: 500 });
    }

    const s = await getSettings();

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: fromAddress(s),
        to,
        subject,
        html,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("[send-email] Resend error:", err);
      return Response.json({ ok: false, error: "Failed to send email" }, { status: 500 });
    }

    return Response.json({ ok: true });
  } catch (err) {
    console.error("[send-email] Error:", err);
    return Response.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
