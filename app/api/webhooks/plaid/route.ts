// app/api/webhooks/plaid/route.ts
//
// Plaid webhook endpoint. Plaid signs outbound webhooks with a
// JWT in the Plaid-Verification header; the JWT's key id maps to
// a key fetched from /webhook_verification_key/get. Full flow:
//   https://plaid.com/docs/api/webhooks/webhook-verification/
//
// This handler is a scaffold:
//   1. Reads Plaid-Verification.
//   2. Verifies the signature (currently stubbed — returns 501
//      until PLAID_SECRET + PLAID_CLIENT_ID are provisioned).
//   3. Dispatches on the webhook_type/webhook_code pair.
//
// Expected env vars (wired once Plaid provisioning lands):
//   PLAID_CLIENT_ID
//   PLAID_SECRET
//   PLAID_ENV            - sandbox | development | production
//
// Tenant portal uses Plaid Link for ACH connections on autopay;
// the key webhook types to handle are TRANSACTIONS, AUTH, ITEM
// (ITEM:PENDING_EXPIRATION → surface a "reconnect bank" prompt).

import { NextRequest, NextResponse } from "next/server";

async function verifyPlaidSignature(_req: NextRequest): Promise<boolean> {
  // TODO: fetch verification key via /webhook_verification_key/get
  // and verify the ES256 JWT in Plaid-Verification. Refuse any
  // request whose body SHA-256 doesn't match the JWT's request_body_sha256
  // claim.
  return false;
}

export async function POST(req: NextRequest) {
  if (!process.env.PLAID_SECRET) {
    return NextResponse.json(
      { error: "plaid_not_configured", message: "PLAID_SECRET not set" },
      { status: 501 }
    );
  }

  const verified = await verifyPlaidSignature(req);
  if (!verified) {
    return NextResponse.json({ error: "invalid_signature" }, { status: 401 });
  }

  let body: { webhook_type?: string; webhook_code?: string; item_id?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const { webhook_type, webhook_code } = body;

  switch (`${webhook_type}:${webhook_code}`) {
    case "TRANSACTIONS:DEFAULT_UPDATE":
    case "TRANSACTIONS:HISTORICAL_UPDATE":
      // TODO: pull new transactions via /transactions/sync and
      // reconcile against the ledger.
      break;
    case "ITEM:PENDING_EXPIRATION":
    case "ITEM:ERROR":
      // TODO: notify the tenant to reconnect their bank.
      break;
    case "AUTH:AUTOMATICALLY_VERIFIED":
    case "AUTH:VERIFICATION_EXPIRED":
      // TODO: mark the autopay source as verified or expired.
      break;
    default:
      break;
  }

  return NextResponse.json({ received: true });
}

export async function GET() {
  return NextResponse.json({ ok: true, service: "plaid-webhook" });
}

export const runtime = "nodejs";
