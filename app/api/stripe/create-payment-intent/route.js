import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

export async function POST(request) {
  // ── Portal session check ────────────────────────────────────────
  // The tenant portal is authenticated via supabase.auth on the client.
  // It forwards its access token in the Authorization header; we verify
  // the JWT and confirm the resulting user owns a portal_users row that
  // maps to a tenant_id. The caller is never allowed to charge a tenant
  // they don't own.
  const SUPA_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const SUPA_ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!SUPA_URL || !SUPA_ANON) {
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

  const { chargeId, amount, tenantName, tenantEmail, roomId, propName } = await request.json();
  if (!amount || amount <= 0) return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
  if (!chargeId) return NextResponse.json({ error: "Missing chargeId" }, { status: 400 });

  // Verify the authed portal user actually owns the charge being paid.
  // portal_users.auth_user_id links a Supabase auth user to a tenant_id.
  // We look up the charge's tenant_id and compare.
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
    const chRes = await fetch(
      `${SUPA_URL}/rest/v1/charges?id=eq.${encodeURIComponent(chargeId)}&select=tenant_id`,
      { headers: { apikey: SUPA_ANON, Authorization: `Bearer ${SUPA_ANON}` } }
    );
    const chRows = chRes.ok ? await chRes.json() : [];
    const chargeTenantId = chRows?.[0]?.tenant_id;
    if (!chargeTenantId || !tenantIds.includes(chargeTenantId)) {
      return NextResponse.json({ error: "Forbidden — charge does not belong to caller" }, { status: 403 });
    }
  } catch (e) {
    console.error("[create-payment-intent] ownership check failed:", e);
    return NextResponse.json({ error: "Ownership check failed" }, { status: 500 });
  }

  const STRIPE_SECRET = process.env.STRIPE_SECRET_KEY;
  if (!STRIPE_SECRET) return NextResponse.json({ error: "Stripe not configured" }, { status: 500 });

  try {
    const stripe = require("stripe")(STRIPE_SECRET);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // cents
      currency: "usd",
      automatic_payment_methods: { enabled: true },
      // NOTE: metadata values are required by app/api/webhooks/stripe/route.js
      // to reconcile the charge back to hq-charges on payment_intent.succeeded
      // and to surface an actionable admin notification on payment_intent.payment_failed.
      metadata: {
        chargeId: chargeId || "",
        tenantName: tenantName || "",
        tenantEmail: tenantEmail || "",
        roomId: roomId || "",
        propName: propName || "",
      },
    });

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (e) {
    console.error("Stripe payment intent error:", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
