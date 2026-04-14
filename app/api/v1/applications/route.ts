// app/api/v1/applications/route.ts
// List + create applications within the caller's workspace.

import { NextRequest, NextResponse } from "next/server";
import { requireWorkspace, notImplemented, readJson } from "../_shared";

export async function GET(req: NextRequest) {
  const ws = requireWorkspace(req);
  if (ws instanceof NextResponse) return ws;
  return notImplemented("applications", "list");
}

export async function POST(req: NextRequest) {
  const ws = requireWorkspace(req);
  if (ws instanceof NextResponse) return ws;
  const body = await readJson(req);
  if (body instanceof NextResponse) return body;
  return notImplemented("applications", "create");
}

export const runtime = "nodejs";
