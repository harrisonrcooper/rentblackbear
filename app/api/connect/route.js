// app/api/connect/route.js
//
// Stripe Connect onboarding and dashboard API (Clerk-gated).
//
// GET  — return current Connect account status
// POST { action: "onboard" } — create Express account + onboarding link
// POST { action: "dashboard" } — create login link to Stripe Express dashboard
//
// The PM's stripeConnectAccountId is persisted in hq-settings.

import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { loadAppData, saveAppData } from "@/lib/supabase-server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY not configured");
  return require("stripe")(key);
}

// ---------- GET: Connect account status ----------
export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const settings = (await loadAppData("hq-settings", {})) || {};
    const accountId = settings.stripeConnectAccountId;

    if (!accountId) {
      return NextResponse.json({ connected: false });
    }

    const stripe = getStripe();
    const account = await stripe.accounts.retrieve(accountId);

    return NextResponse.json({
      connected: true,
      accountId,
      chargesEnabled: account.charges_enabled,
      payoutsEnabled: account.payouts_enabled,
      detailsSubmitted: account.details_submitted,
    });
  } catch (e) {
    console.error("[connect] GET error:", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

// ---------- POST: onboard or dashboard ----------
export async function POST(request) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { action } = await request.json();
  const stripe = getStripe();
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  try {
    const settings = (await loadAppData("hq-settings", {})) || {};

    if (action === "onboard") {
      let accountId = settings.stripeConnectAccountId;

      // Create a new Express account if one doesn't exist yet
      if (!accountId) {
        const account = await stripe.accounts.create({
          type: "express",
          country: "US",
          email: settings.email || settings.pmEmail || undefined,
          capabilities: {
            card_payments: { requested: true },
            transfers: { requested: true },
          },
          business_type: "individual",
        });
        accountId = account.id;

        // Persist the account ID in settings
        await saveAppData("hq-settings", {
          ...settings,
          stripeConnectAccountId: accountId,
        });
      }

      // Create an onboarding link
      const accountLink = await stripe.accountLinks.create({
        account: accountId,
        refresh_url: `${appUrl}/admin?tab=pm-settings`,
        return_url: `${appUrl}/admin?tab=pm-settings&connect=complete`,
        type: "account_onboarding",
      });

      return NextResponse.json({ url: accountLink.url });
    }

    if (action === "dashboard") {
      const accountId = settings.stripeConnectAccountId;
      if (!accountId) {
        return NextResponse.json({ error: "No Connect account found" }, { status: 400 });
      }

      const loginLink = await stripe.accounts.createLoginLink(accountId);
      return NextResponse.json({ url: loginLink.url });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (e) {
    console.error("[connect] POST error:", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
