import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

// Creates a Stripe SetupIntent to save a payment method for future autopay charges.
// The client uses this to collect and save a payment method without charging immediately.
export async function POST(request) {
  // ── Portal session check ────────────────────────────────────────
  // The tenant portal is authenticated via supabase.auth on the client.
  // It forwards its access token in the Authorization header; we verify
  // the JWT and confirm the resulting user owns the tenant_id being
  // enrolled in autopay. A tenant cannot save a payment method to
  // another tenant's record.
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

  const { tenantId, tenantName, tenantEmail } = await request.json();
  if (!tenantId) return NextResponse.json({ error: "Missing tenantId" }, { status: 400 });

  // Confirm the authed portal user owns the tenantId passed in
  try {
    const puRes = await fetch(
      `${SUPA_URL}/rest/v1/portal_users?auth_user_id=eq.${encodeURIComponent(user.id)}&tenant_id=eq.${encodeURIComponent(tenantId)}&select=id`,
      { headers: { apikey: SUPA_ANON, Authorization: `Bearer ${SUPA_ANON}` } }
    );
    const rows = puRes.ok ? await puRes.json() : [];
    if (!Array.isArray(rows) || rows.length === 0) {
      return NextResponse.json({ error: "Forbidden — tenant does not belong to caller" }, { status: 403 });
    }
  } catch (e) {
    console.error("[create-setup-intent] ownership check failed:", e);
    return NextResponse.json({ error: "Ownership check failed" }, { status: 500 });
  }

  const STRIPE_SECRET = process.env.STRIPE_SECRET_KEY;
  if (!STRIPE_SECRET) return NextResponse.json({ error: "Stripe not configured" }, { status: 500 });

  try {
    const stripe = require("stripe")(STRIPE_SECRET);

    // Find or create a Stripe customer for this tenant
    let customerId;
    if (tenantEmail) {
      const existing = await stripe.customers.list({ email: tenantEmail, limit: 1 });
      if (existing.data.length > 0) {
        customerId = existing.data[0].id;
      }
    }
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: tenantEmail || undefined,
        name: tenantName || undefined,
        metadata: { tenantId: tenantId || "" },
      });
      customerId = customer.id;
    }

    const setupIntent = await stripe.setupIntents.create({
      customer: customerId,
      payment_method_types: ["card", "us_bank_account"],
      metadata: { tenantId: tenantId || "", tenantName: tenantName || "" },
    });

    return NextResponse.json({
      clientSecret: setupIntent.client_secret,
      customerId,
    });
  } catch (e) {
    console.error("Stripe setup intent error:", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
