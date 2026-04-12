import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

export async function POST(request) {
  // ── Portal session check ────────────────────────────────────────
  // The tenant portal is authenticated via supabase.auth on the client.
  // It forwards its access token in the Authorization header; we verify
  // the JWT and confirm the resulting user owns a portal_users row that
  // maps to the tenantId in the request. A caller can never cancel
  // autopay for a tenant they don't own.
  const SUPA_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const SUPA_ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!SUPA_URL || !SUPA_ANON) {
    console.error("[cancel-autopay] Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY");
    return NextResponse.json({ error: "Supabase not configured" }, { status: 500 });
  }

  const authHeader = request.headers.get("authorization") || "";
  const token = authHeader.replace(/^Bearer\s+/i, "");
  if (!token) {
    return NextResponse.json({ error: "Unauthorized — no session token" }, { status: 401 });
  }

  const supabase = createClient(SUPA_URL, SUPA_ANON);
  const { data: { user }, error: authErr } = await supabase.auth.getUser(token);
  if (authErr || !user) {
    return NextResponse.json({ error: "Unauthorized — invalid session" }, { status: 401 });
  }

  let body;
  try {
    body = await request.json();
  } catch (e) {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { tenantId } = body || {};
  if (!tenantId) return NextResponse.json({ error: "Missing tenantId" }, { status: 400 });

  // ── Ownership verification ──────────────────────────────────────
  // Verify the authed portal user actually owns the tenant being modified.
  // portal_users.auth_user_id links a Supabase auth user to a tenant_id.
  try {
    const puRes = await fetch(
      `${SUPA_URL}/rest/v1/portal_users?auth_user_id=eq.${encodeURIComponent(user.id)}&select=tenant_id`,
      { headers: { apikey: SUPA_ANON, Authorization: `Bearer ${SUPA_ANON}` } }
    );
    const puRows = puRes.ok ? await puRes.json() : [];
    const tenantIds = Array.isArray(puRows) ? puRows.map(r => r.tenant_id).filter(Boolean) : [];
    if (tenantIds.length === 0) {
      return NextResponse.json({ error: "Forbidden — no tenant mapping" }, { status: 403 });
    }
    if (!tenantIds.includes(tenantId)) {
      return NextResponse.json({ error: "Forbidden — you do not own this tenant account" }, { status: 403 });
    }
  } catch (e) {
    console.error("[cancel-autopay] ownership check failed:", e);
    return NextResponse.json({ error: "Ownership check failed" }, { status: 500 });
  }

  // ── Mutation ────────────────────────────────────────────────────────
  try {
    const patchRes = await fetch(
      `${SUPA_URL}/rest/v1/portal_users?tenant_id=eq.${encodeURIComponent(tenantId)}`,
      {
        method: "PATCH",
        headers: {
          apikey: SUPA_ANON,
          Authorization: `Bearer ${SUPA_ANON}`,
          "Content-Type": "application/json",
          Prefer: "return=representation",
        },
        body: JSON.stringify({
          autopay_enabled: false,
          stripe_customer_id: null,
          stripe_payment_method_id: null,
        }),
      }
    );
    if (!patchRes.ok) {
      const text = await patchRes.text().catch(() => "");
      console.error("[cancel-autopay] PATCH failed", patchRes.status, text);
      return NextResponse.json({ error: "Update failed", status: patchRes.status }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("[cancel-autopay] Cancel autopay error:", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
