// app/api/webhooks/stripe/route.js
//
// TODO(multi-tenant): Resolve workspace_id from Stripe metadata (e.g.
// payment_intent.metadata.workspace_id) and prefix app_data keys accordingly.
// See lib/workspace.js for the key-prefix convention.
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
//     Events: payment_intent.succeeded, payment_intent.payment_failed,
//             customer.subscription.created, customer.subscription.updated,
//             customer.subscription.deleted, invoice.paid, invoice.payment_failed
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
import { getSettings, emailWrap, fromAddress, fmtMoney } from "@/lib/getSettings";

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

      // ---- Subscription lifecycle events ----
      case "customer.subscription.created": {
        await handleSubscriptionCreated(event.data.object);
        return NextResponse.json({ received: true, type: event.type });
      }

      case "customer.subscription.updated": {
        await handleSubscriptionUpdated(event.data.object);
        return NextResponse.json({ received: true, type: event.type });
      }

      case "customer.subscription.deleted": {
        await handleSubscriptionDeleted(event.data.object);
        return NextResponse.json({ received: true, type: event.type });
      }

      case "invoice.paid": {
        await handleInvoicePaid(event.data.object);
        return NextResponse.json({ received: true, type: event.type });
      }

      case "invoice.payment_failed": {
        await handleInvoicePaymentFailed(event.data.object);
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

  // --- Send receipt email (best-effort, never blocks webhook) ---
  try {
    await sendPaymentReceiptEmail(updatedCharge, paymentRecord, md);
  } catch (err) {
    console.error("[stripe-webhook] receipt email failed (non-fatal):", err?.message || err);
  }
}

async function sendPaymentReceiptEmail(charge, payment, metadata) {
  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  if (!RESEND_API_KEY) {
    console.warn("[stripe-webhook] RESEND_API_KEY not set — skipping receipt email");
    return;
  }

  // Resolve tenant email from hq-props → room.tenant.email
  const roomId = metadata.roomId || charge.roomId;
  let tenantEmail = null;
  if (roomId) {
    const props = (await loadAppData("hq-props", [])) || [];
    for (const prop of props) {
      for (const unit of prop.units || []) {
        for (const room of unit.rooms || []) {
          if (room.id === roomId && room.tenant?.email) {
            tenantEmail = room.tenant.email;
            break;
          }
        }
        if (tenantEmail) break;
      }
      if (tenantEmail) break;
    }
  }

  if (!tenantEmail) {
    console.warn(`[stripe-webhook] no tenant email found for roomId=${roomId} — skipping receipt`);
    return;
  }

  const settings = await getSettings();
  const amount = fmtMoney(payment.amount);
  const remaining = Math.max(0, Number(charge.amount || 0) - Number(charge.amountPaid || 0));
  const category = charge.category || "Rent";
  const propName = metadata.propName || charge.propName || "";
  const roomName = charge.roomName || "";
  const location = [propName, roomName].filter(Boolean).join(" — ");

  const subject = `Payment received — ${category} ${amount}`;

  const content = `
    <h2 style="margin:0 0 20px 0;font-size:20px;color:#1a1714;">Payment Receipt</h2>
    <p style="margin:0 0 24px 0;color:#444;">Thank you for your payment. Here are the details:</p>
    <table style="width:100%;border-collapse:collapse;font-size:15px;color:#1a1714;">
      <tr>
        <td style="padding:10px 0;border-bottom:1px solid #e8e5e0;color:#777;">Amount Paid</td>
        <td style="padding:10px 0;border-bottom:1px solid #e8e5e0;font-weight:600;text-align:right;">${amount}</td>
      </tr>
      <tr>
        <td style="padding:10px 0;border-bottom:1px solid #e8e5e0;color:#777;">Date</td>
        <td style="padding:10px 0;border-bottom:1px solid #e8e5e0;text-align:right;">${payment.date}</td>
      </tr>
      <tr>
        <td style="padding:10px 0;border-bottom:1px solid #e8e5e0;color:#777;">Payment Method</td>
        <td style="padding:10px 0;border-bottom:1px solid #e8e5e0;text-align:right;">${payment.method}</td>
      </tr>
      <tr>
        <td style="padding:10px 0;border-bottom:1px solid #e8e5e0;color:#777;">Category</td>
        <td style="padding:10px 0;border-bottom:1px solid #e8e5e0;text-align:right;">${category}</td>
      </tr>
      ${location ? `<tr>
        <td style="padding:10px 0;border-bottom:1px solid #e8e5e0;color:#777;">Property</td>
        <td style="padding:10px 0;border-bottom:1px solid #e8e5e0;text-align:right;">${location}</td>
      </tr>` : ""}
      <tr>
        <td style="padding:10px 0;border-bottom:1px solid #e8e5e0;color:#777;">Remaining Balance</td>
        <td style="padding:10px 0;border-bottom:1px solid #e8e5e0;font-weight:600;text-align:right;">${fmtMoney(remaining)}</td>
      </tr>
    </table>
    <p style="margin:28px 0 0 0;color:#444;">If you have any questions about this payment, please reach out to your property manager.</p>
  `;

  const html = emailWrap(content, settings);

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: fromAddress(settings),
      to: [tenantEmail],
      subject,
      html,
    }),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    console.error("[stripe-webhook] Resend API error:", data);
  } else {
    console.log(`[stripe-webhook] receipt email sent to ${tenantEmail}`);
  }
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

// ---------------------------------------------------------------------------
// Subscription lifecycle handlers
// ---------------------------------------------------------------------------

// Map Stripe price IDs (from env) back to tier names.
function tierFromPriceId(priceId) {
  if (priceId === process.env.STRIPE_PRICE_STARTER) return "starter";
  if (priceId === process.env.STRIPE_PRICE_GROWTH) return "growth";
  if (priceId === process.env.STRIPE_PRICE_SCALE) return "scale";
  return "starter"; // fallback
}

async function handleSubscriptionCreated(sub) {
  const priceId = sub.items?.data?.[0]?.price?.id;
  const tier = tierFromPriceId(priceId);

  const subscriptionData = {
    stripeCustomerId: sub.customer,
    subscriptionId: sub.id,
    tier,
    status: sub.status, // "active", "trialing", etc.
    currentPeriodEnd: new Date(sub.current_period_end * 1000).toISOString(),
    cancelAtPeriodEnd: sub.cancel_at_period_end || false,
  };

  await saveAppData("hq-subscription", subscriptionData);
  console.log(`[stripe-webhook] subscription created: ${sub.id} tier=${tier}`);
}

async function handleSubscriptionUpdated(sub) {
  const existing = (await loadAppData("hq-subscription", null)) || {};
  const priceId = sub.items?.data?.[0]?.price?.id;
  const tier = tierFromPriceId(priceId);

  const subscriptionData = {
    ...existing,
    stripeCustomerId: sub.customer,
    subscriptionId: sub.id,
    tier,
    status: sub.status,
    currentPeriodEnd: new Date(sub.current_period_end * 1000).toISOString(),
    cancelAtPeriodEnd: sub.cancel_at_period_end || false,
  };

  await saveAppData("hq-subscription", subscriptionData);
  console.log(`[stripe-webhook] subscription updated: ${sub.id} status=${sub.status} tier=${tier}`);
}

async function handleSubscriptionDeleted(sub) {
  const existing = (await loadAppData("hq-subscription", null)) || {};

  // Mark as cancelled with a 3-day grace period
  const gracePeriodEnd = new Date();
  gracePeriodEnd.setDate(gracePeriodEnd.getDate() + 3);

  const subscriptionData = {
    ...existing,
    stripeCustomerId: sub.customer,
    subscriptionId: sub.id,
    status: "cancelled",
    cancelledAt: new Date().toISOString(),
    gracePeriodEnd: gracePeriodEnd.toISOString(),
    cancelAtPeriodEnd: false,
  };

  await saveAppData("hq-subscription", subscriptionData);
  console.log(`[stripe-webhook] subscription deleted: ${sub.id} — grace period until ${gracePeriodEnd.toISOString()}`);
}

async function handleInvoicePaid(invoice) {
  // Only process subscription invoices
  if (!invoice.subscription) return;

  const existing = (await loadAppData("hq-subscription", null)) || {};
  if (existing.subscriptionId !== invoice.subscription) return;

  // Extend active period based on the invoice's period end
  const periodEnd = invoice.lines?.data?.[0]?.period?.end;
  if (periodEnd) {
    const subscriptionData = {
      ...existing,
      status: "active",
      currentPeriodEnd: new Date(periodEnd * 1000).toISOString(),
    };
    await saveAppData("hq-subscription", subscriptionData);
    console.log(`[stripe-webhook] invoice.paid — extended period for sub=${invoice.subscription}`);
  }
}

async function handleInvoicePaymentFailed(invoice) {
  if (!invoice.subscription) return;

  const existing = (await loadAppData("hq-subscription", null)) || {};
  if (existing.subscriptionId !== invoice.subscription) {
    // Still create a notification even if subscription doesn't match
  }

  // Update subscription status to past_due
  if (existing.subscriptionId === invoice.subscription) {
    const subscriptionData = {
      ...existing,
      status: "past_due",
    };
    await saveAppData("hq-subscription", subscriptionData);
  }

  // Create urgent admin notification for dunning
  const notifs = (await loadAppData("hq-notifs", [])) || [];
  const amountDue = (invoice.amount_due ?? 0) / 100;
  const todayStr = new Date().toISOString().split("T")[0];

  const notif = {
    id: uid(),
    type: "billing",
    msg: `Subscription payment failed — $${amountDue.toFixed(2)} due. Please update your payment method to avoid service interruption.`,
    date: todayStr,
    read: false,
    urgent: true,
  };

  await saveAppData("hq-notifs", [notif, ...(Array.isArray(notifs) ? notifs : [])]);
  console.log(`[stripe-webhook] invoice.payment_failed — dunning notification created for sub=${invoice.subscription}`);
}
