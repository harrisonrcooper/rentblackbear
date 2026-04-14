// app/api/webhooks/twilio/route.ts
//
// Twilio webhook endpoint. Twilio signs outbound webhook requests
// with an X-Twilio-Signature header computed from the full URL +
// POST params + the account auth token. Docs:
//   https://www.twilio.com/docs/usage/webhooks/webhooks-security
//
// Use cases:
//   Incoming SMS      - tenant texts back, we route the message
//                       into ticket_messages for the matching
//                       open ticket or an admin inbox.
//   Delivery status   - Twilio's StatusCallback fires for sent /
//                       delivered / failed / undelivered; we
//                       mirror into delivery_attempts.
//   Voice (future)    - call recording transcripts routed into
//                       the ticket they were spawned from.
//
// Expected env vars (wired once Twilio provisioning lands):
//   TWILIO_ACCOUNT_SID
//   TWILIO_AUTH_TOKEN
//   TWILIO_FROM_NUMBER

import { NextRequest, NextResponse } from "next/server";

async function verifyTwilioSignature(
  _req: NextRequest,
  _rawBody: string
): Promise<boolean> {
  // TODO: compute HMAC-SHA1 of url + sorted(params) using
  // TWILIO_AUTH_TOKEN, base64-encode, constant-time compare with
  // X-Twilio-Signature. Twilio also offers signature verification
  // via the `twilio` npm package (request.validateRequest).
  return false;
}

function parseFormBody(raw: string): Record<string, string> {
  const out: Record<string, string> = {};
  const params = new URLSearchParams(raw);
  for (const [k, v] of params) out[k] = v;
  return out;
}

export async function POST(req: NextRequest) {
  if (!process.env.TWILIO_AUTH_TOKEN) {
    return NextResponse.json(
      { error: "twilio_not_configured", message: "TWILIO_AUTH_TOKEN not set" },
      { status: 501 }
    );
  }

  const raw = await req.text();
  const verified = await verifyTwilioSignature(req, raw);
  if (!verified) {
    return NextResponse.json({ error: "invalid_signature" }, { status: 401 });
  }

  const body = parseFormBody(raw);

  // Twilio dispatches several webhook shapes at the same URL; we
  // branch on which fields are present.
  if (body.MessageStatus) {
    // Status callback from an SMS we previously sent.
    // TODO: update delivery_attempts using body.MessageSid.
    return new NextResponse(null, { status: 204 });
  }

  if (body.Body && body.From) {
    // Inbound SMS from a tenant.
    // TODO: route body.Body into the matching ticket or admin inbox.
    // Respond with TwiML so Twilio knows how to reply.
    const twiml = `<?xml version="1.0" encoding="UTF-8"?><Response></Response>`;
    return new NextResponse(twiml, {
      status: 200,
      headers: { "content-type": "text/xml" },
    });
  }

  return NextResponse.json({ received: true });
}

export async function GET() {
  return NextResponse.json({ ok: true, service: "twilio-webhook" });
}

export const runtime = "nodejs";
