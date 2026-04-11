// app/api/webhooks/stripe/route.js
//
// Stripe webhook handler for the tenant portal "Pay Online" flow.
//
// Handles:
//   - payment_intent.succeeded     → marks the matching hq-charges row as paid
//                                    and pushes a payment record (same shape as
//                                    the autopay cron path in app/api/cron/daily/route.js)
//   - payment_intent.payment_failed → pushes an urgent admin notification into
//                                     hq-notifs so the PM can follow up
//   - All other event types are acknowledged with 200 and ignored.
//
// Required env vars (set in .env.local for local dev, and in Vercel dashboard
// for preview + production):
//   STRIPE_SECRET_KEY            - existing
//   STRIPE_WEBHOOK_SECRET        - NEW, grab from Stripe dashboard or `stripe listen`
//   NEXT_PUBLIC_SUPABASE_URL     - existing
//   NEXT_PUBLIC_SUPABASE_ANON_KEY - existing (or SUPABASE_ANON_KEY)
//
// Local development:
//   1. Install Stripe CLI: https://docs.stripe.com/stripe-cli
//   2. Run:  stripe login
//   3. Forward events to the local dev server:
//        stripe listen --forward-to localhost:3000/api/webhooks/stripe
//      The CLI prints a `whsec_...` secret — copy it into .env.local as
//      STRIPE_WEBHOOK_SECRET and restart `next dev`.
//   4. Trigger a test event in a second terminal:
//        stripe trigger payment_intent.succeeded
//
// Production registration:
//   Stripe Dashboard → Developers → Webhooks → Add endpoint
//     URL:    https://<your-domain>/api/webhooks/stripe
//     Events: payment_intent.succeeded, payment_intent.payment_failed
//   After creation, reveal the "Signing secret" (starts with whsec_) and add
//   it to Vercel env vars as STRIPE_WEBHOOK_SECRET for Production and Preview,
//   then redeploy.
//
// Notes:
//   - Runtime is pinned to nodejs (NOT edge) because we need the Stripe SDK
//     and full Node crypto for signature verification.
//   - Raw body is read via `await req.text()` — the App Router does not
//     auto-parse JSON in route.js handlers, so this gives us the exact bytes
//     Stripe signed.
//   - The handler is idempotent on payment_intent.succeeded: if amountPaid is
//     already >= amount OR a payment record with the same stripe_payment_id
//     already exists, we skip the ledger mutation (Stripe may retry the same
//     event on 5xx responses).

import { NextResponse } from "next/server";
import { loadAppData, saveAppData } from "@/lib/supabase-server";

export const runtime = "nodejs";
// Never cache: every request must be freshly verified and processed.
export const dynamic = "force-dynamic";

function uid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export async function POST(req) {
  const STRIPE_SECRET = process.env.STRIPE_SECRET_KEY;
  const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;

  if (!STRIPE_SECRET || !WEBHOOK_SECRET) {
    console.error("[stripe-webhook] missing STRIPE_SECRET_KEY or STRIPE_WEBHOOK_SECRET");
    return NextResponse.json({ error: "Stripe webhook not configured" }, { status: 500 });
  }

  const stripe = require("stripe")(STRIPE_SECRET);

  // Raw body is required — DO NOT use req.json() here, it will break
  // signature verification.
  const rawBody = await req.text();
  const sig = req.headers.get("stripe-signature");

  let event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, WEBHOOK_SECRET);
  } catch (err) {
    console.error("[stripe-webhook] signature verification failed:", err?.message);
    return NextResponse.json({ error: `Webhook signature error: ${err?.message}` }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "payment_intent.succeeded": {
        await handlePaymentIntentSucceeded(event.data.object);
        return NextResponse.json({ received: true, type: event.type });
      }

      case "payment_intent.payment_failed": {
        await handlePaymentIntentFailed(event.data.object);
        return NextResponse.json({ received: true, type: event.type });
      }

      default:
        return NextResponse.json({ received: true, ignored: event.type });
    }
  } catch (err) {
    console.error(`[stripe-webhook] handler error for ${event.type}:`, err);
    // Return 500 so Stripe retries with exponential backoff.
    return NextResponse.json({ error: "Handler failure" }, { status: 500 });
  }
}

async function handlePaymentIntentSucceeded(pi) {
  const md = pi?.metadata || {};
  const chargeId = md.chargeId;
  if (!chargeId) {
    console.warn("[stripe-webhook] payment_intent.succeeded missing metadata.chargeId — skipping ledger update", pi?.id);
    return;
  }

  const charges = (await loadAppData("hq-charges", [])) || [];
  if (!Array.isArray(charges)) {
    console.error("[stripe-webhook] hq-charges is not an array");
    return;
  }

  const idx = charges.findIndex((c) => c && c.id === chargeId);
  if (idx < 0) {
    console.warn(`[stripe-webhook] no hq-charges row for chargeId=${chargeId} pi=${pi.id}`);
    return;
  }

  const charge = charges[idx];
  const existingPayments = Array.isArray(charge.payments) ? charge.payments : [];

  // Idempotency: if we already recorded this payment intent, do nothing.
  const alreadyRecorded = existingPayments.some(
    (p) => p && p.stripe_payment_id && p.stripe_payment_id === pi.id
  );
  if (alreadyRecorded) {
    return;
  }

  const amountDollars = (pi.amount_received ?? pi.amount ?? 0) / 100;
  const todayStr = new Date().toISOString().split("T")[0];

  // Derive method label from the payment method type, matching the cron path
  // which uses "Autopay" for off_session charges. For manual portal payments
  // we surface the underlying rail.
  const pmType =
    pi?.charges?.data?.[0]?.payment_method_details?.type ||
    pi?.payment_method_types?.[0] ||
    "card";
  const method =
    pmType === "us_bank_account" || pmType === "ach_debit"
      ? "ACH Bank Transfer"
      : "Card";

  // Matches the autopay path shape exactly (snake_case keys, deposit_status).
  const paymentRecord = {
    amount: amountDollars,
    date: todayStr,
    method,
    deposit_status: "transit",
    stripe_payment_id: pi.id,
  };

  const updatedCharge = {
    ...charge,
    amountPaid: Math.max(Number(charge.amountPaid || 0), Number(charge.amount || amountDollars)),
    payments: [...existingPayments, paymentRecord],
  };

  const updatedCharges = [...charges];
  updatedCharges[idx] = updatedCharge;
  await saveAppData("hq-charges", updatedCharges);
}

async function handlePaymentIntentFailed(pi) {
  const md = pi?.metadata || {};
  const tenantName = md.tenantName || "Tenant";
  const propName = md.propName || "";
  const roomId = md.roomId || "";
  const amountDollars = (pi.amount ?? 0) / 100;
  const failureMsg =
    pi?.last_payment_error?.message ||
    pi?.last_payment_error?.code ||
    "Unknown failure";

  const notifs = (await loadAppData("hq-notifs", [])) || [];
  if (!Array.isArray(notifs)) {
    console.error("[stripe-webhook] hq-notifs is not an array");
    return;
  }

  const todayStr = new Date().toISOString().split("T")[0];
  const location = propName ? ` (${propName})` : "";
  const amountLabel = amountDollars ? ` $${amountDollars.toLocaleString()}` : "";

  const notif = {
    id: uid(),
    type: "payment",
    roomId: roomId || undefined,
    msg: `Online payment failed for ${tenantName}${amountLabel}${location}: ${failureMsg}`,
    date: todayStr,
    read: false,
    urgent: true,
  };

  const updatedNotifs = [notif, ...notifs];
  await saveAppData("hq-notifs", updatedNotifs);
}
