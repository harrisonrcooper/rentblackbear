// app/api/export-data/route.js
// GDPR data export — downloads ALL PM data as a JSON file

import { auth } from "@clerk/nextjs/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SUPA_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPA_KEY = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

async function supaGet(path) {
  const r = await fetch(SUPA_URL + "/rest/v1/" + path, {
    headers: { apikey: SUPA_KEY, Authorization: "Bearer " + SUPA_KEY },
  });
  if (!r.ok) {
    const text = await r.text().catch(() => "");
    throw new Error(`Supabase ${r.status}: ${text || r.statusText}`);
  }
  return r.json();
}

// All hq-* keys we store in app_data
const HQ_KEYS = [
  "hq-properties",
  "hq-charges",
  "hq-expenses",
  "hq-tenants",
  "hq-settings",
  "hq-vendors",
  "hq-apps",
  "hq-archive",
  "hq-notifs",
  "hq-dismissed-followups",
  "hq-maintenance",
  "hq-templates",
];

export async function GET() {
  // Clerk admin gate
  try {
    const { userId, orgId } = await auth();
    if (!userId) {
      return Response.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }

    const workspaceId = orgId || userId;
    const bundle = { exportedAt: new Date().toISOString(), workspaceId };

    // Load all hq-* keys from app_data
    for (const key of HQ_KEYS) {
      try {
        const rows = await supaGet(
          `app_data?select=value&key=eq.${encodeURIComponent(key)}&workspace_id=eq.${encodeURIComponent(workspaceId)}&limit=1`
        );
        const friendlyKey = key.replace("hq-", "");
        bundle[friendlyKey] = rows?.[0]?.value ?? null;
      } catch {
        // If a key doesn't exist, skip it
        bundle[key.replace("hq-", "")] = null;
      }
    }

    // Load lease_instances for this workspace
    try {
      const leases = await supaGet(
        `lease_instances?workspace_id=eq.${encodeURIComponent(workspaceId)}&order=created_at.desc`
      );
      bundle.leases = Array.isArray(leases) ? leases : [];
    } catch {
      bundle.leases = [];
    }

    const today = new Date().toISOString().split("T")[0];
    const json = JSON.stringify(bundle, null, 2);

    return new Response(json, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename=propos-export-${today}.json`,
      },
    });
  } catch (e) {
    console.error("[export-data] Error:", e?.message || e);
    return Response.json({ ok: false, error: "Export failed" }, { status: 500 });
  }
}
