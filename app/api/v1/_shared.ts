// Shared helpers for the /api/v1 resource scaffolds.
//
// Every v1 route expects proxy.ts to have stamped x-workspace-id
// onto the request and Clerk's middleware.ts to have gated auth.
// Until the Supabase instance exists, the handlers all short-
// circuit to 501 via notImplemented() rather than half-answering.

import { NextRequest, NextResponse } from "next/server";

export const WORKSPACE_HEADER = "x-workspace-id";

export function requireWorkspace(req: NextRequest): string | NextResponse {
  const id = req.headers.get(WORKSPACE_HEADER);
  if (!id) {
    return NextResponse.json(
      { error: "workspace_unresolved", message: `${WORKSPACE_HEADER} header missing` },
      { status: 401 }
    );
  }
  return id;
}

export function notImplemented(resource: string, action: string) {
  return NextResponse.json(
    {
      error: "not_implemented",
      resource,
      action,
      message: "Supabase-backed implementation pending provisioning.",
    },
    { status: 501 }
  );
}

export async function readJson<T = unknown>(req: NextRequest): Promise<T | NextResponse> {
  try {
    return (await req.json()) as T;
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }
}
