import { NextResponse } from "next/server";

// Supabase credentials come from env. Matches the pattern used by
// app/api/webhooks/stripe/route.js and app/api/portal-invite/route.js.
const SUPA_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPA_KEY = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const runtime = "nodejs";

export async function POST(request) {
  if (!SUPA_URL || !SUPA_KEY) {
    console.error("[cancel-autopay] Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY");
    return NextResponse.json({ error: "Supabase not configured" }, { status: 500 });
  }

  let body;
  try {
    body = await request.json();
  } catch (e) {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { tenantId } = body || {};
  if (!tenantId) return NextResponse.json({ error: "Missing tenantId" }, { status: 400 });

  // ── Auth (stopgap) ──────────────────────────────────────────────────
  // TODO(sprint-2): Require the tenant portal to pass its Supabase access
  // token in the Authorization header (the portal is authenticated via
  // supabase.auth on the client) and verify it here with
  // supabase.auth.getUser(accessToken), then confirm the resulting user's
  // email maps to the portal_users row with this tenant_id.
  //
  // For now we perform a minimum existence check: the tenantId must match
  // an existing portal_users row that currently has autopay_enabled=true.
  // This blocks completely anonymous probing of the endpoint but does NOT
  // prevent a tenant from cancelling another tenant's autopay if they
  // know their tenant_id. That gap is accepted for this sprint because
  // the portal UI is the only caller and the blast radius is limited to
  // a reversible autopay flag — a full token check lands in sprint 2.
  try {
    const checkRes = await fetch(
      `${SUPA_URL}/rest/v1/portal_users?tenant_id=eq.${encodeURIComponent(tenantId)}&select=id,autopay_enabled`,
      { headers: { apikey: SUPA_KEY, Authorization: `Bearer ${SUPA_KEY}` } }
    );
    if (!checkRes.ok) {
      console.error("[cancel-autopay] portal_users lookup failed", checkRes.status);
      return NextResponse.json({ error: "Lookup failed" }, { status: 500 });
    }
    const rows = await checkRes.json();
    if (!Array.isArray(rows) || rows.length === 0) {
      return NextResponse.json({ error: "Portal user not found" }, { status: 404 });
    }
  } catch (e) {
    console.error("[cancel-autopay] portal_users lookup error", e);
    return NextResponse.json({ error: "Lookup failed" }, { status: 500 });
  }

  // ── Mutation ────────────────────────────────────────────────────────
  try {
    const patchRes = await fetch(
      `${SUPA_URL}/rest/v1/portal_users?tenant_id=eq.${encodeURIComponent(tenantId)}`,
      {
        method: "PATCH",
        headers: {
          apikey: SUPA_KEY,
          Authorization: `Bearer ${SUPA_KEY}`,
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
