import { NextResponse } from "next/server";

export async function POST(request) {
  const { chargeId, amount, tenantName, tenantEmail } = await request.json();
  if (!amount || amount <= 0) return NextResponse.json({ error: "Invalid amount" }, { status: 400 });

  const STRIPE_SECRET = process.env.STRIPE_SECRET_KEY;
  if (!STRIPE_SECRET) return NextResponse.json({ error: "Stripe not configured" }, { status: 500 });

  try {
    const stripe = require("stripe")(STRIPE_SECRET);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // cents
      currency: "usd",
      automatic_payment_methods: { enabled: true },
      metadata: { chargeId: chargeId || "", tenantName: tenantName || "", tenantEmail: tenantEmail || "" },
    });

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (e) {
    console.error("Stripe payment intent error:", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
