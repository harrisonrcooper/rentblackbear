// app/api/send-sms/route.js
// Sends SMS via Twilio REST API (no SDK required)
// Auth: Clerk session OR CRON_SECRET bearer token

import { auth } from "@clerk/nextjs/server";

async function sendSmsViaTwilio(to, body) {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_FROM_NUMBER;

  if (!accountSid || !authToken || !from) {
    return { ok: false, error: "Twilio not configured", status: 500 };
  }

  const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;
  const res = await fetch(twilioUrl, {
    method: "POST",
    headers: {
      Authorization:
        "Basic " +
        Buffer.from(`${accountSid}:${authToken}`).toString("base64"),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({ To: to, From: from, Body: body }).toString(),
  });

  const data = await res.json();
  if (!res.ok)
    return {
      ok: false,
      error: data.message || "SMS failed",
      status: res.status,
    };
  return { ok: true, sid: data.sid };
}

// NOTE: sendSmsViaTwilio was previously re-exported from this file
// so other routes could import it. Next.js 14 only allows the
// route-convention exports (GET/POST/etc) on route files. Callers
// should move the helper into a plain module under lib/ (e.g.
// lib/sms.js) and import from there.

export async function POST(request) {
  // Accept either Clerk auth or CRON_SECRET bearer token
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;
  let authorized = false;

  if (cronSecret && authHeader === `Bearer ${cronSecret}`) {
    authorized = true;
  } else {
    try {
      const { userId } = await auth();
      if (userId) authorized = true;
    } catch {
      // Clerk auth failed
    }
  }

  if (!authorized) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { to, body } = await request.json();
  if (!to || !body) {
    return Response.json({ error: "Missing to or body" }, { status: 400 });
  }

  const result = await sendSmsViaTwilio(to, body);
  if (!result.ok) {
    return Response.json(
      { error: result.error },
      { status: result.status || 500 }
    );
  }
  return Response.json({ ok: true, sid: result.sid });
}
