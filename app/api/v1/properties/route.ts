// app/api/v1/properties/route.ts
// List + create properties within the caller's workspace.

import { NextRequest, NextResponse } from "next/server";
import { requireWorkspace, notImplemented, readJson } from "../_shared";

export async function GET(req: NextRequest) {
  const ws = requireWorkspace(req);
  if (ws instanceof NextResponse) return ws;
  return notImplemented("properties", "list");
}

export async function POST(req: NextRequest) {
  const ws = requireWorkspace(req);
  if (ws instanceof NextResponse) return ws;
  const body = await readJson(req);
  if (body instanceof NextResponse) return body;
  return notImplemented("properties", "create");
}

export const runtime = "nodejs";
