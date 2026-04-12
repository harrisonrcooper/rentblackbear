// app/api/send-email/route.js
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const INBOUND_DOMAIN = "uirkeakaro.resend.app";

export async function POST(request) {
  // Clerk admin gate — this was an open email relay before
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }
  } catch (e) {
    console.error("[send-email] Clerk auth() failed:", e?.message || e);
    return NextResponse.json({ ok: false, error: "Auth check failed" }, { status: 500 });
  }

  try {
    const {
      to,
      subject,
      html,
      fromName,
      replyTo,
      // ref tracking fields — passed when sending reference check emails
      appId,
      refKey,
    } = await request.json();

    if (!RESEND_API_KEY) {
      return NextResponse.json({ error: "RESEND_API_KEY not set" }, { status: 500 });
    }

    // Build reply-to: if appId + refKey provided, encode them so inbound webhook can route
    // Format: ref+{appId}+{refKey}@uirkeakaro.resend.app
    let replyToAddress = replyTo || "info@rentblackbear.com";
    if (appId && refKey) {
      const encoded = `ref+${appId}+${refKey}@${INBOUND_DOMAIN}`;
      // Use array format so reference still sees a clean name
      replyToAddress = fromName
        ? `${fromName} <${encoded}>`
        : encoded;
    }

    const senderEmail = process.env.SENDER_EMAIL || "hello@rentblackbear.com";
    const senderName = process.env.SENDER_NAME || "Property Manager";

    const body = {
      from: fromName
        ? `${fromName} <${senderEmail}>`
        : `${senderName} <${senderEmail}>`,
      to: Array.isArray(to) ? to : [to],
      subject,
      html,
      reply_to: replyToAddress,
    };

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    if (!res.ok) {
      console.error("Resend error:", data);
      return NextResponse.json({ ok: false, error: data }, { status: res.status });
    }

    return NextResponse.json({ ok: true, id: data.id });
  } catch (e) {
    console.error("send-email error:", e);
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
  }
}
