// app/api/subscription/route.js
//
// Subscription management API (Clerk-gated).
//
// GET  — return current subscription status (tier, active, period end, usage)
// POST { action: "create", tier: "starter"|"growth"|"scale" }
//        — create Stripe Checkout session for a new subscription
// POST { action: "portal" }
//        — create Stripe Customer Portal session for managing subscription
//
// Required env vars:
//   STRIPE_SECRET_KEY       — Stripe secret key
//   STRIPE_PRICE_STARTER    — Price ID for Starter tier ($97/mo, 10 rooms, 1 property)
//   STRIPE_PRICE_GROWTH     — Price ID for Growth tier ($197/mo, 30 rooms, unlimited properties)
//   STRIPE_PRICE_SCALE      — Price ID for Scale tier ($397/mo, unlimited)
//   NEXT_PUBLIC_APP_URL     — Base URL for success/cancel redirects (e.g. https://app.example.com)
//
// Harrison: create Products + Prices in Stripe Dashboard, then set the
// STRIPE_PRICE_STARTER, STRIPE_PRICE_GROWTH, STRIPE_PRICE_SCALE env vars.

import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { loadAppData } from "@/lib/supabase-server";
import { checkTierLimit } from "@/lib/tierCheck";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const PRICE_MAP = {
  starter: () => process.env.STRIPE_PRICE_STARTER,
  growth: () => process.env.STRIPE_PRICE_GROWTH,
  scale: () => process.env.STRIPE_PRICE_SCALE,
};

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY not configured");
  return require("stripe")(key);
}

// ---------- GET: current subscription status ----------
export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const sub = (await loadAppData("hq-subscription", null)) || null;

  // Count current rooms and properties for usage info
  const props = (await loadAppData("hq-props", [])) || [];
  let totalRooms = 0;
  const totalProperties = Array.isArray(props) ? props.length : 0;
  if (Array.isArray(props)) {
    for (const prop of props) {
      for (const unit of prop.units || []) {
        totalRooms += (unit.rooms || []).length;
      }
    }
  }

  const tier = sub?.tier || null;
  const usage = tier
    ? checkTierLimit(tier, totalRooms, totalProperties)
    : { roomsUsed: totalRooms, propertiesUsed: totalProperties, tier: null };

  return NextResponse.json({
    subscription: sub
      ? {
          tier: sub.tier,
          status: sub.status,
          currentPeriodEnd: sub.currentPeriodEnd,
          cancelAtPeriodEnd: sub.cancelAtPeriodEnd || false,
        }
      : null,
    usage,
  });
}

// ---------- POST: create checkout or portal session ----------
export async function POST(req) {
  let userId;
  try {
    const result = await auth();
    userId = result.userId;
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const { action } = body;

  if (action === "create") {
    return handleCreateCheckout(body, userId);
  }
  if (action === "portal") {
    return handlePortal();
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}

async function handleCreateCheckout(body, userId) {
  const { tier } = body;
  const priceFn = PRICE_MAP[tier];
  if (!priceFn) {
    return NextResponse.json(
      { error: "Invalid tier. Use starter, growth, or scale." },
      { status: 400 }
    );
  }
  const priceId = priceFn();
  if (!priceId) {
    return NextResponse.json(
      { error: `Price ID not configured for tier: ${tier}` },
      { status: 500 }
    );
  }

  const stripe = getStripe();
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  // Look up existing customer ID from subscription data
  const sub = (await loadAppData("hq-subscription", null)) || null;
  const sessionParams = {
    mode: "subscription",
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${appUrl}/admin?tab=settings&subscription=success`,
    cancel_url: `${appUrl}/admin?tab=settings&subscription=cancelled`,
    metadata: { clerkUserId: userId, tier },
  };

  // Attach existing Stripe customer if we have one
  if (sub?.stripeCustomerId) {
    sessionParams.customer = sub.stripeCustomerId;
  } else {
    sessionParams.customer_creation = "always";
  }

  const session = await stripe.checkout.sessions.create(sessionParams);

  return NextResponse.json({ url: session.url });
}

async function handlePortal() {
  const sub = (await loadAppData("hq-subscription", null)) || null;
  if (!sub?.stripeCustomerId) {
    return NextResponse.json(
      { error: "No active subscription found" },
      { status: 404 }
    );
  }

  const stripe = getStripe();
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  const session = await stripe.billingPortal.sessions.create({
    customer: sub.stripeCustomerId,
    return_url: `${appUrl}/admin?tab=settings`,
  });

  return NextResponse.json({ url: session.url });
}
