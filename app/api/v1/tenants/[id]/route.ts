// app/api/v1/tenants/[id]/route.ts
// Read / update / archive a single tenant.

import { NextRequest, NextResponse } from "next/server";
import { requireWorkspace, notImplemented, readJson } from "../../_shared";

type Params = { params: { id: string } };

export async function GET(req: NextRequest, _ctx: Params) {
  const ws = requireWorkspace(req);
  if (ws instanceof NextResponse) return ws;
  return notImplemented("tenants", "read");
}

export async function PATCH(req: NextRequest, _ctx: Params) {
  const ws = requireWorkspace(req);
  if (ws instanceof NextResponse) return ws;
  const body = await readJson(req);
  if (body instanceof NextResponse) return body;
  return notImplemented("tenants", "update");
}

export async function DELETE(req: NextRequest, _ctx: Params) {
  const ws = requireWorkspace(req);
  if (ws instanceof NextResponse) return ws;
  return notImplemented("tenants", "archive");
}

export const runtime = "nodejs";
