// app/api/v1/properties/[id]/route.ts
// Read / update / archive a single propertie record.

import { NextRequest, NextResponse } from "next/server";
import { requireWorkspace, notImplemented, readJson } from "../../_shared";

type Params = { params: { id: string } };

export async function GET(req: NextRequest, _ctx: Params) {
  const ws = requireWorkspace(req);
  if (ws instanceof NextResponse) return ws;
  return notImplemented("properties", "read");
}

export async function PATCH(req: NextRequest, _ctx: Params) {
  const ws = requireWorkspace(req);
  if (ws instanceof NextResponse) return ws;
  const body = await readJson(req);
  if (body instanceof NextResponse) return body;
  return notImplemented("properties", "update");
}

export async function DELETE(req: NextRequest, _ctx: Params) {
  const ws = requireWorkspace(req);
  if (ws instanceof NextResponse) return ws;
  return notImplemented("properties", "archive");
}

export const runtime = "nodejs";
