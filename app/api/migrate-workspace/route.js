// app/api/migrate-workspace/route.js
// Migration helper: copies bare-key app_data rows to workspace-prefixed rows.
// POST { workspaceId } — Clerk-gated.
//
// This lets an existing single-tenant PM migrate their data into their
// new workspace namespace without losing the originals.

import { auth } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

export async function POST(req) {
  // Clerk admin gate
  try {
    const { userId } = await auth();
    if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 });
  } catch (e) {
    console.error("[migrate-workspace] Clerk auth() failed:", e?.message || e);
    return Response.json({ error: "Auth failed" }, { status: 401 });
  }

  const { workspaceId } = await req.json();
  if (!workspaceId) {
    return Response.json({ error: "workspaceId required" }, { status: 400 });
  }

  // Load all bare-key hq-* rows (no colon in key = not yet namespaced)
  const supabase = getSupabase();
  const { data: rows, error } = await supabase
    .from("app_data")
    .select("key, value")
    .like("key", "hq-%")
    .not("key", "like", "%:%"); // exclude already-namespaced rows

  if (error) {
    console.error("[migrate-workspace] Load error:", error);
    return Response.json({ error: "Failed to load app_data" }, { status: 500 });
  }

  if (!rows || rows.length === 0) {
    return Response.json({ migrated: 0, message: "No bare-key rows found" });
  }

  // Copy each row to {workspaceId}:{key}
  let migrated = 0;
  const errors = [];
  for (const row of rows) {
    const newKey = `${workspaceId}:${row.key}`;
    const { error: upsertErr } = await supabase
      .from("app_data")
      .upsert({ key: newKey, value: row.value }, { onConflict: "key" });

    if (upsertErr) {
      errors.push({ key: row.key, error: upsertErr.message });
    } else {
      migrated++;
    }
  }

  return Response.json({
    migrated,
    total: rows.length,
    errors: errors.length > 0 ? errors : undefined,
    message: `Migrated ${migrated}/${rows.length} keys to workspace ${workspaceId}`,
  });
}
