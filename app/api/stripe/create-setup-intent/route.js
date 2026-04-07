import { NextResponse } from "next/server";

// Creates a Stripe SetupIntent to save a payment method for future autopay charges.
// The client uses this to collect and save a payment method without charging immediately.
export async function POST(request) {
  const { tenantId, tenantName, tenantEmail } = await request.json();

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
