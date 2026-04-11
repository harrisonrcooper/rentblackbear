// app/api/portal-invite-token/route.js
// Generates a standalone portal invite token with no tenant attached.
// Used for the "Generate" button on the Applications page.

import { auth } from "@clerk/nextjs/server";

const SUPA_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPA_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

async function supaQuery(table, query) {
  const r = await fetch(`${SUPA_URL}/rest/v1/${table}?${query}`, {
    headers: { apikey: SUPA_KEY, Authorization: `Bearer ${SUPA_KEY}` },
  });
  if (!r.ok) throw new Error(`supaQuery ${table} failed: ${r.status}`);
  return r.json();
}

async function supaInsert(table, data) {
  const r = await fetch(`${SUPA_URL}/rest/v1/${table}`, {
    method: "POST",
    headers: {
      apikey: SUPA_KEY,
      Authorization: `Bearer ${SUPA_KEY}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
    },
    body: JSON.stringify(data),
  });
  if (!r.ok) {
    const err = await r.text();
    throw new Error(`supaInsert ${table} failed: ${r.status} — ${err}`);
  }
  return r.json();
}

export async function POST(request) {
  // Clerk admin gate
  try {
    const { userId } = await auth();
    if (!userId) {
      return Response.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }
  } catch (e) {
    console.error("[portal-invite-token] Clerk auth() failed:", e?.message || e);
    return Response.json({ ok: false, error: "Auth check failed" }, { status: 500 });
  }

  try {
    const pms = await supaQuery("pm_accounts", "select=id&limit=1");
    const pmId = pms?.[0]?.id;
    if (!pmId) return Response.json({ ok: false, error: "PM account not found" }, { status: 400 });

    const rows = await supaInsert("invites", {
      pm_id: pmId,
      email: `general-${Date.now()}@placeholder.invalid`,
    });

    const invite = rows?.[0];
    if (!invite?.token) return Response.json({ ok: false, error: "No token returned" }, { status: 500 });

    return Response.json({ ok: true, token: invite.token });
  } catch (err) {
    console.error("[portal-invite-token]", err.message);
    return Response.json({ ok: false, error: err.message }, { status: 500 });
  }
}
