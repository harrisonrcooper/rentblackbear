// app/api/webhooks/clerk/route.ts
//
// Clerk webhook endpoint. Clerk delivers via Svix; every request
// carries svix-id / svix-timestamp / svix-signature headers, and
// the payload is HMAC-signed with CLERK_WEBHOOK_SECRET.
//
// This handler is a scaffold:
//   1. Reads svix headers.
//   2. Verifies via the svix SDK (stubbed until svix is installed).
//   3. Dispatches on event.type — currently wired for user.created
//      and organization.created, which is what the provisioning
//      doc says we need first.
//
// Expected env vars (wired once Clerk webhook provisioning lands):
//   CLERK_WEBHOOK_SECRET - copy from the Clerk dashboard webhook
//                          config once the endpoint is registered.
//
// Typical event types we care about:
//   user.created / user.deleted          - keep a local mirror or
//                                          react to signup.
//   organization.created / .updated /
//     .deleted / .membership.*           - drive workspace creation
//                                          and membership joins.
//   session.created                      - optional: audit log row.

import { NextRequest, NextResponse } from "next/server";

type ClerkEvent = {
  type: string;
  data: Record<string, unknown>;
  object: "event";
};

async function verifySvix(
  _headers: Headers,
  _body: string
): Promise<ClerkEvent | null> {
  // TODO: import { Webhook } from 'svix'; new Webhook(secret).verify(body, headers).
  // Today svix is not in package.json — returning null forces a 501
  // until the dependency + CLERK_WEBHOOK_SECRET land.
  return null;
}

export async function POST(req: NextRequest) {
  const secret = process.env.CLERK_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json(
      { error: "clerk_webhook_not_configured", message: "CLERK_WEBHOOK_SECRET not set" },
      { status: 501 }
    );
  }

  const svixId = req.headers.get("svix-id");
  const svixTs = req.headers.get("svix-timestamp");
  const svixSig = req.headers.get("svix-signature");
  if (!svixId || !svixTs || !svixSig) {
    return NextResponse.json({ error: "missing_svix_headers" }, { status: 400 });
  }

  const raw = await req.text();
  const event = await verifySvix(req.headers, raw);
  if (!event) {
    return NextResponse.json({ error: "invalid_signature" }, { status: 401 });
  }

  switch (event.type) {
    case "user.created":
      // TODO: insert into workspace_members once the owning workspace
      // is known (usually from invitation metadata).
      break;
    case "user.deleted":
      // TODO: soft-remove matching workspace_members rows.
      break;
    case "organization.created":
      // TODO: insert a new workspaces row keyed on organization.id.
      break;
    case "organization.updated":
      // TODO: patch workspaces.name + workspaces.brand.
      break;
    case "organization.deleted":
      // TODO: soft-archive the workspace (do not hard-delete).
      break;
    case "organizationMembership.created":
    case "organizationMembership.updated":
    case "organizationMembership.deleted":
      // TODO: mirror into workspace_members with role mapping.
      break;
    default:
      break;
  }

  return NextResponse.json({ received: true, type: event.type });
}

export async function GET() {
  return NextResponse.json({ ok: true, service: "clerk-webhook" });
}

export const runtime = "nodejs";
