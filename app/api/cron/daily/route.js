// app/api/cron/daily/route.js
// Runs every day at 8am via Vercel cron (vercel.json)
// Handles: rent charge generation, late fee creation, lease expiry alerts,
//          daily payment reminders, month-to-month auto-escalation

import { getSettings, emailWrap, fromAddress } from "@/lib/getSettings";
import { loadAppData, saveAppData, supa } from "@/lib/supabase-server";
import { info, error as logError } from "@/lib/logger";

const SUPA_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPA_KEY = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const RESEND_KEY = process.env.RESEND_API_KEY;

async function sendSms(to, body) {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_FROM_NUMBER;
  if (!accountSid || !authToken || !from || !to) return false;
  try {
    const res = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
      {
        method: "POST",
        headers: {
          Authorization: "Basic " + Buffer.from(`${accountSid}:${authToken}`).toString("base64"),
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({ To: to, From: from, Body: body }).toString(),
      }
    );
    return res.ok;
  } catch { return false; }
}

const supaGet = (key) => loadAppData(key, null);
const supaSet = saveAppData;

function uid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function allRooms(prop) {
  return (prop.units || []).flatMap(u => (u.rooms || []).map(r => ({
    ...r, unitId: u.id, unitName: u.name, unitLabel: u.label,
    propName: prop.name, propId: prop.id, propAddr: prop.addr || "",
  })));
}

function fmtDate(d) { return d.toISOString().split("T")[0]; }
function fmtS(n) { return "$" + Number(n || 0).toLocaleString(); }
function fmtD(s) { if (!s) return "—"; try { return new Date(s + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }); } catch { return s; } }

async function sendEmail(to, subject, html, s) {
  if (!RESEND_KEY || !to) return false;
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${RESEND_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from: fromAddress(s), to, subject, html }),
    });
    return res.ok;
  } catch { return false; }
}

export async function GET(req) {
  const auth = req.headers.get("authorization");
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  const cronStart = Date.now();
  const TODAY = new Date();
  TODAY.setHours(0, 0, 0, 0);
  const todayStr = fmtDate(TODAY);
  const log = [];

  info("cron/daily", "Cron started", { date: todayStr });

  try {
    const [props, charges, notifs, settings] = await Promise.all([
      supaGet("hq-props"),
      supaGet("hq-charges"),
      supaGet("hq-notifs"),
      supaGet("hq-settings"),
    ]);

    if (!props) return new Response("No props data", { status: 200 });

    const s = settings || {};
    const portalLink = `${s.siteUrl || "https://rentblackbear.com"}/portal`;
    const m2mIncrease = s.m2mIncrease || 50;
    const autoReminders = s.autoReminders !== false;

    let updatedCharges = [...(charges || [])];
    let updatedProps = [...(props || [])];
    let updatedNotifs = [...(notifs || [])];
    let chargesChanged = false;
    let propsChanged = false;
    let notifsChanged = false;

    // ── 1. RENT CHARGE GENERATION ─────────────────────────────────────
    const dayOfMonth = TODAY.getDate();
    const monthsToCheck = [];
    for (let i = 2; i >= 0; i--) monthsToCheck.push(new Date(TODAY.getFullYear(), TODAY.getMonth() - i, 1));
    if (dayOfMonth >= 20) monthsToCheck.push(new Date(TODAY.getFullYear(), TODAY.getMonth() + 1, 1));

    for (const targetDate of monthsToCheck) {
      const mk = fmtDate(targetDate).slice(0, 7);
      const moLabel = targetDate.toLocaleString("default", { month: "long", year: "numeric" });
      /* [P0-6] Check idempotency by roomId+month for ANY recurring category, not just "Rent" */
      const existingRoomCats = new Set(updatedCharges.filter(c => c.dueDate?.startsWith(mk) && !c.voided && !c.deleted).map(c => c.roomId + "|" + c.category));
      const existingRoomIds = { has: (roomId, cat) => existingRoomCats.has(roomId + "|" + (cat || "Rent")) };

      for (const prop of updatedProps) {
        for (const room of allRooms(prop)) {
          if (room.st !== "occupied" || !room.tenant) continue;
          if (existingRoomIds.has(room.id, room.recurringCategory || "Rent")) continue;
          const moveIn = room.tenant.moveIn ? new Date(room.tenant.moveIn + "T00:00:00") : null;
          const monthEnd = new Date(targetDate.getFullYear(), targetDate.getMonth() + 1, 0);
          if (moveIn && moveIn > monthEnd) continue;

          updatedCharges.push({
            id: uid(), roomId: room.id, unitId: room.unitId,
            tenantName: room.tenant.name, propName: room.propName, roomName: room.name,
            category: room.recurringCategory || "Rent",
            desc: room.recurringDesc || `${moLabel} ${room.recurringCategory || "Rent"}`,
            amount: room.rent,
            amountPaid: 0,
            dueDate: `${mk}-${String(room.recurringDueDay || prop.defaultDueDay || 1).padStart(2, "0")}`,
            createdDate: todayStr,
            payments: [], waived: false, noLateFee: false,
          });
          chargesChanged = true;
          log.push(`✅ Rent charge: ${room.tenant.name} — ${moLabel} ${fmtS(room.rent)}`);
        }
      }
    }

    // ── 2. LATE FEES ──────────────────────────────────────────────────
    // getLateConfig: reads per-room lateConfig, falls back to property-level, then settings-level defaults.
    // Cascade: room.lateConfig → prop.lateFeeX → settings.lateFeeX → hardcoded default
    function getLateConfig(room, prop, s) {
      const lc = room.lateConfig || {};
      return {
        enabled:         lc.enabled !== false,
        graceDays:       lc.graceDays       ?? prop?.lateFeeGraceDays ?? (s.lateFeeGraceDays   ?? 3),
        initialEnabled:  lc.initialEnabled  !== false,
        initialFee:      lc.initialFee      ?? prop?.lateFeeInitial  ?? (s.lateFeeInitial     ?? 50),
        initialFeeType:  lc.initialFeeType  ?? "flat",    // "flat"|"pctRent"|"pctUnpaid"
        initialApplyDays:lc.initialApplyDays?? 3,         // days after due date
        dailyEnabled:    lc.dailyEnabled    !== false,
        dailyFee:        lc.dailyFee        ?? prop?.lateFeeDaily    ?? (s.lateFeeDaily       ?? 5),
        dailyStartDays:  lc.dailyStartDays  ?? 6,         // days after due date
        limitEnabled:    !!lc.limitEnabled,
        limitStopAfterDays: lc.limitStopAfterDays ?? null,
        limitMaxAmt:     lc.limitMaxAmt       ?? null,
        limitMaxType:    lc.limitMaxType       ?? "flat",
      };
    }

    // Build roomId → room and roomId → prop lookups for config resolution
    const roomLookup = {};
    const roomPropLookup = {};
    for (const prop of updatedProps) {
      for (const room of allRooms(prop)) { roomLookup[room.id] = room; roomPropLookup[room.id] = prop; }
    }

    for (const charge of updatedCharges) {
      if (charge.category !== "Rent" || charge.waived || charge.noLateFee || charge.amountPaid >= charge.amount) continue;
      const room = roomLookup[charge.roomId];
      const lc = getLateConfig(room || {}, roomPropLookup[charge.roomId] || {}, s);
      if (!lc.enabled) continue;

      const daysOverdue = Math.ceil((TODAY - new Date(charge.dueDate + "T00:00:00")) / 86400000);
      if (daysOverdue <= lc.graceDays) continue;

      const existing = updatedCharges.find(c => c.category === "Late Fee" && c.linkedChargeId === charge.id);

      // Calculate initial fee
      let initialAmt = 0;
      if (lc.initialEnabled && daysOverdue >= lc.initialApplyDays) {
        if (lc.initialFeeType === "pctRent")    initialAmt = Math.round((charge.amount * lc.initialFee) / 100 * 100) / 100;
        else if (lc.initialFeeType === "pctUnpaid") initialAmt = Math.round(((charge.amount - charge.amountPaid) * lc.initialFee) / 100 * 100) / 100;
        else initialAmt = lc.initialFee; // flat
      }

      // Calculate daily accrual
      let dailyAmt = 0;
      if (lc.dailyEnabled && daysOverdue >= lc.dailyStartDays) {
        let dailyDays = daysOverdue - lc.dailyStartDays + 1;
        // Stop daily fees after X days if limit set
        if (lc.limitEnabled && lc.limitStopAfterDays) dailyDays = Math.min(dailyDays, lc.limitStopAfterDays);
        dailyAmt = lc.dailyFee * Math.max(0, dailyDays);
      }

      let amt = initialAmt + dailyAmt;

      // Apply total cap — flat $ or % of rent
      if (lc.limitEnabled && lc.limitMaxAmt) {
        const cap = lc.limitMaxType === "pctRent"
          ? Math.round((charge.amount * lc.limitMaxAmt) / 100 * 100) / 100
          : lc.limitMaxAmt;
        if (amt > cap) amt = cap;
      }

      amt = Math.round(amt * 100) / 100;
      if (amt <= 0) continue;

      const feeTypeLabel = lc.initialFeeType === "pctRent" ? `${lc.initialFee}% of rent` : lc.initialFeeType === "pctUnpaid" ? `${lc.initialFee}% of unpaid` : `$${lc.initialFee} flat`;
      const desc = `Late Fee — ${feeTypeLabel}${lc.dailyEnabled ? ` + $${lc.dailyFee}/day` : ""}`;

      if (existing) {
        if (existing.amount !== amt && existing.amountPaid === 0) {
          existing.amount = amt;
          existing.desc = desc;
          chargesChanged = true;
        }
      } else {
        updatedCharges.push({
          id: uid(), roomId: charge.roomId, tenantName: charge.tenantName,
          propName: charge.propName, roomName: charge.roomName,
          category: "Late Fee", desc, amount: amt, amountPaid: 0,
          dueDate: todayStr, createdDate: todayStr,
          payments: [], waived: false, noLateFee: true, linkedChargeId: charge.id,
        });
        chargesChanged = true;
        log.push(`⚠️ Late fee: ${charge.tenantName} — ${fmtS(amt)} (${desc})`);
      }
    }

    // ── 3. AUTO CLEAR reminderActive WHEN PAID ────────────────────────
    for (const charge of updatedCharges) {
      if (charge.reminderActive && charge.amountPaid >= charge.amount) {
        charge.reminderActive = false;
        chargesChanged = true;
      }
    }

    // ── 4. DAILY REMINDERS ────────────────────────────────────────────
    if (autoReminders) {
      const reminderTemplate = s.reminderTemplate || "Hi {firstName}, your {category} of {amount} was due on {dueDate}. Please pay at: {portalLink}\n\nThank you!";
      const activeReminders = updatedCharges.filter(c => c.reminderActive && c.amountPaid < c.amount);
      for (const c of activeReminders) {
        // Find tenant email
        let tenantEmail = null;
        for (const prop of updatedProps) {
          for (const room of allRooms(prop)) {
            if (room.id === c.roomId && room.tenant?.email) { tenantEmail = room.tenant.email; break; }
          }
          if (tenantEmail) break;
        }
        if (!tenantEmail) continue;
        const firstName = c.tenantName?.split(" ")[0] || "there";
        const msg = reminderTemplate
          .replace(/{firstName}/g, firstName).replace(/{fullName}/g, c.tenantName)
          .replace(/{amount}/g, fmtS(c.amount - c.amountPaid)).replace(/{dueDate}/g, fmtD(c.dueDate))
          .replace(/{category}/g, c.category).replace(/{portalLink}/g, portalLink);
        const sent = await sendEmail(tenantEmail, `Payment Reminder — ${c.category} ${fmtS(c.amount - c.amountPaid)} Due`, `<p>${msg.replace(/\n/g, "<br/>")}</p>`, s);
        if (sent) log.push(`📧 Reminder sent: ${c.tenantName} — ${c.category} ${fmtS(c.amount - c.amountPaid)}`);
      }
    }

    // ── 5. LEASE EXPIRY ALERTS ────────────────────────────────────────
    const ALERT_DAYS = [90, 30, 7];
    for (const prop of updatedProps) {
      for (const room of allRooms(prop)) {
        if (room.st !== "occupied" || !room.tenant || !room.le) continue;
        const leaseEnd = new Date(room.le + "T00:00:00");
        const daysLeft = Math.ceil((leaseEnd - TODAY) / 86400000);
        for (const threshold of ALERT_DAYS) {
          if (daysLeft !== threshold) continue;
          if (updatedNotifs.some(n => n.type === "lease" && n.roomId === room.id && n.daysThreshold === threshold)) continue;
          updatedNotifs.unshift({ id: uid(), type: "lease", roomId: room.id, daysThreshold: threshold, msg: `${room.tenant.name}'s lease expires in ${daysLeft} days (${room.le}) — ${room.propName} ${room.name}`, date: todayStr, read: false, urgent: daysLeft <= 30 });
          notifsChanged = true;
          log.push(`📋 Lease alert: ${room.tenant.name} — ${daysLeft}d left`);
        }
      }
    }

    // ── 5b. LEASE RENEWAL PROMPT (60-90 days before expiry) ─────────
    // For executed leases expiring in 60-90 days where no renewal has been offered,
    // create a one-time admin notification and mark renewal_offered on the lease.
    try {
      const renewalRes = await fetch(
        `${SUPA_URL}/rest/v1/lease_instances?status=eq.executed&renewal_offered=not.is.true&select=*`,
        { headers: { apikey: SUPA_KEY, Authorization: `Bearer ${SUPA_KEY}` } }
      );
      const renewalLeases = await renewalRes.json();
      if (Array.isArray(renewalLeases)) {
        for (const lease of renewalLeases) {
          const leaseEnd = lease.variable_data?.leaseEnd;
          if (!leaseEnd) continue;
          const endDate = new Date(leaseEnd + "T00:00:00");
          const daysLeft = Math.ceil((endDate - TODAY) / 86400000);
          if (daysLeft < 60 || daysLeft > 90) continue;
          const tenantName = lease.variable_data?.tenantName || "Tenant";
          const property = lease.variable_data?.property || "";
          const room = lease.variable_data?.room || "";
          // Create admin notification
          updatedNotifs.unshift({
            id: uid(), type: "lease-renewal", roomId: lease.room_id || "",
            msg: `Lease renewal due — ${tenantName} expires ${fmtD(leaseEnd)}${property ? " at " + property : ""}${room ? " " + room : ""}. Offer renewal or serve notice?`,
            date: todayStr, read: false, urgent: daysLeft <= 70,
          });
          notifsChanged = true;
          // Mark renewal_offered on the lease instance so it fires only once
          await fetch(`${SUPA_URL}/rest/v1/lease_instances?id=eq.${lease.id}`, {
            method: "PATCH",
            headers: { apikey: SUPA_KEY, Authorization: `Bearer ${SUPA_KEY}`, "Content-Type": "application/json", Prefer: "return=representation" },
            body: JSON.stringify({ renewal_offered: true }),
          });
          log.push(`Renewal prompt: ${tenantName} — ${daysLeft}d left, renewal offered`);
        }
      }
    } catch (renewalErr) {
      log.push(`Renewal prompt error: ${renewalErr.message}`);
    }

    // ── 6. MONTH-TO-MONTH AUTO ESCALATION ────────────────────────────
    // When a lease end date has passed and room is still occupied (not already m2m)
    for (let pi = 0; pi < updatedProps.length; pi++) {
      const prop = updatedProps[pi];
      let propChanged = false;
      const updatedUnits = (prop.units || []).map(unit => {
        const updatedRooms = (unit.rooms || []).map(room => {
          if (room.st !== "occupied" || !room.tenant || room.m2m) return room;
          if (!room.le) return room; // already no end date
          const leaseEnd = new Date(room.le + "T00:00:00");
          if (TODAY <= leaseEnd) return room; // not expired yet

          // Lease has expired — convert to M2M
          const newRent = (room.rent || 0) + m2mIncrease;
          propChanged = true;
          propsChanged = true;
          log.push(`🔄 M2M: ${room.tenant.name} @ ${prop.name} ${room.name} — rent ${fmtS(room.rent)} → ${fmtS(newRent)}`);

          // Send tenant notification
          if (room.tenant.email) {
            const firstName = room.tenant.name?.split(" ")[0] || "there";
            sendEmail(room.tenant.email,
              `Your lease has converted to month-to-month — ${prop.name}`,
              emailWrap(`<p>Hi ${firstName},</p>
              <p>Your lease at <strong>${prop.name} — ${room.name}</strong> has ended and has automatically converted to <strong>month-to-month</strong>.</p>
              <p>Your new monthly rent is <strong>${fmtS(newRent)}</strong> (includes a $${m2mIncrease}/mo month-to-month premium).</p>
              <p>You have two options:</p>
              <ul>
                <li><strong>Sign a new 12-month lease</strong> at your original rate of ${fmtS(room.rent)}/mo — contact us to get started</li>
                <li><strong>Continue month-to-month</strong> at ${fmtS(newRent)}/mo — either party may terminate with 30 days written notice</li>
              </ul>
              <p>Please log in to your tenant portal to review your options: <a href="${portalLink}">Access Portal</a></p>
              <p>${s.companyName || ""}<br/>${s.phone || ""}</p>`),
              s
            );
          }

          // Admin notification
          updatedNotifs.unshift({ id: uid(), type: "lease", roomId: room.id, msg: `${room.tenant.name} converted to M2M — rent increased to ${fmtS(newRent)}/mo (${prop.name} ${room.name})`, date: todayStr, read: false, urgent: true });
          notifsChanged = true;

          return { ...room, m2m: true, le: null, rent: newRent };
        });
        return { ...unit, rooms: updatedRooms };
      });
      if (propChanged) updatedProps[pi] = { ...prop, units: updatedUnits };
    }

    // ── 7. AUTOPAY — charge saved payment methods on the 1st ─────────
    if (dayOfMonth === 1 && process.env.STRIPE_SECRET_KEY) {
      try {
        const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
        // Fetch all portal_users with autopay enabled
        const puRes = await fetch(`${SUPA_URL}/rest/v1/portal_users?autopay_enabled=eq.true&select=*,tenant:tenants(id,name,email,room_id)`, {
          headers: { apikey: SUPA_KEY, Authorization: `Bearer ${SUPA_KEY}` },
        });
        const autopayUsers = await puRes.json();
        if (Array.isArray(autopayUsers)) {
          const mk = todayStr.slice(0, 7); // current month key e.g. "2026-04"
          for (const pu of autopayUsers) {
            if (!pu.stripe_customer_id || !pu.stripe_payment_method_id) continue;
            const tenantName = pu.tenant?.name || "Tenant";
            // Find this month's unpaid rent charge
            const rentCharge = updatedCharges.find(c =>
              c.roomId && pu.tenant?.room_id &&
              c.category === "Rent" && c.dueDate?.startsWith(mk) &&
              c.amountPaid < c.amount &&
              // [P2-4] Match by room ID only — tenant name matching is fragile across properties
              c.roomId === pu.tenant.room_id
            );
            if (!rentCharge) { log.push(`Autopay skip: ${tenantName} — no unpaid rent for ${mk}`); continue; }
            const amountDue = rentCharge.amount - rentCharge.amountPaid;
            if (amountDue <= 0) continue;
            try {
              const paymentIntent = await stripe.paymentIntents.create({
                amount: Math.round(amountDue * 100),
                currency: "usd",
                customer: pu.stripe_customer_id,
                payment_method: pu.stripe_payment_method_id,
                off_session: true,
                confirm: true,
                metadata: { chargeId: rentCharge.id, tenantName, autopay: "true" },
              });
              if (paymentIntent.status === "succeeded") {
                rentCharge.amountPaid = rentCharge.amount;
                rentCharge.payments = [...(rentCharge.payments || []), {
                  amount: amountDue, date: todayStr, method: "Autopay",
                  deposit_status: "transit", stripe_payment_id: paymentIntent.id,
                }];
                chargesChanged = true;
                log.push(`Autopay charged: ${tenantName} — ${fmtS(amountDue)} (${paymentIntent.id})`);
                // Send confirmation email
                if (pu.tenant?.email) {
                  sendEmail(pu.tenant.email,
                    `Autopay Processed — ${fmtS(amountDue)} Rent Payment`,
                    emailWrap(`<p>Hi ${tenantName.split(" ")[0]},</p>
                    <p>Your automatic rent payment of <strong>${fmtS(amountDue)}</strong> has been processed successfully.</p>
                    <p><strong>Confirmation:</strong> ${paymentIntent.id}</p>
                    <p>Log in to your tenant portal to view your payment history: <a href="${portalLink}">Access Portal</a></p>
                    <p>${s.companyName || ""}<br/>${s.phone || ""}</p>`),
                    s
                  );
                }
              } else {
                log.push(`Autopay pending: ${tenantName} — status ${paymentIntent.status}`);
              }
            } catch (stripeErr) {
              log.push(`Autopay failed: ${tenantName} — ${stripeErr.message}`);
              // Notify PM of failed autopay
              updatedNotifs.unshift({ id: uid(), type: "payment", msg: `Autopay failed for ${tenantName}: ${stripeErr.message}`, date: todayStr, read: false, urgent: true });
              notifsChanged = true;
              // Send failure email to tenant
              if (pu.tenant?.email) {
                sendEmail(pu.tenant.email,
                  `Autopay Failed — Action Required`,
                  emailWrap(`<p>Hi ${tenantName.split(" ")[0]},</p>
                  <p>Your automatic rent payment of <strong>${fmtS(amountDue)}</strong> could not be processed.</p>
                  <p>Please log in to your tenant portal to pay manually and update your payment method: <a href="${portalLink}">Access Portal</a></p>
                  <p>${s.companyName || ""}<br/>${s.phone || ""}</p>`),
                  s
                );
              }
            }
          }
        }
      } catch (autopayErr) {
        log.push(`Autopay system error: ${autopayErr.message}`);
      }
    }

    // ── 8. FUTURE TENANT AUTO-TRANSITION ────────────────────────────
    // When move-in date arrives, notify PM for review
    for (let pi = 0; pi < updatedProps.length; pi++) {
      const prop = updatedProps[pi];
      for (const room of allRooms(prop)) {
        if (room.st !== "occupied" || !room.tenant || !room.tenant.moveIn) continue;
        const moveIn = new Date(room.tenant.moveIn + "T00:00:00");
        if (moveIn > TODAY) continue; // still future
        if (room.tenant.transitioned) continue; // already handled
        // Mark as transitioned and notify PM
        const pIdx = updatedProps.findIndex(p => p.id === prop.id);
        if (pIdx >= 0) {
          const updated = JSON.parse(JSON.stringify(updatedProps[pIdx]));
          for (const u of updated.units || []) {
            for (const r of u.rooms || []) {
              if (r.id === room.id && r.tenant) { r.tenant.transitioned = true; }
            }
          }
          updatedProps[pIdx] = updated;
          propsChanged = true;
        }
        updatedNotifs.unshift({
          id: uid(), type: "move-in", roomId: room.id,
          msg: `${room.tenant.name} move-in date has arrived (${fmtD(room.tenant.moveIn)}) — ${prop.name} ${room.name}. Review and confirm active status.`,
          date: todayStr, read: false, urgent: true,
        });
        notifsChanged = true;
        log.push(`Move-in arrived: ${room.tenant.name} @ ${prop.name} ${room.name}`);
      }
    }

    // ── 9. ONBOARDING CHAIN — 7 days before move-in ──────────────────
    // Trigger: door code reminder, portal invite (if not already connected), welcome email
    for (const prop of updatedProps) {
      for (const room of allRooms(prop)) {
        if (room.st !== "occupied" || !room.tenant || !room.tenant.moveIn) continue;
        const moveIn = new Date(room.tenant.moveIn + "T00:00:00");
        const daysUntilMoveIn = Math.ceil((moveIn - TODAY) / 86400000);
        if (daysUntilMoveIn !== 7) continue;
        if (room.tenant.onboardingTriggered) continue; // already triggered

        const firstName = room.tenant.name?.split(" ")[0] || "there";
        const tenantEmail = room.tenant.email;

        // Mark as triggered
        const pIdx = updatedProps.findIndex(p => p.id === prop.id);
        if (pIdx >= 0) {
          const updated = JSON.parse(JSON.stringify(updatedProps[pIdx]));
          for (const u of updated.units || []) {
            for (const r of u.rooms || []) {
              if (r.id === room.id && r.tenant) { r.tenant.onboardingTriggered = true; }
            }
          }
          updatedProps[pIdx] = updated;
          propsChanged = true;
        }

        // Notify PM about door code
        updatedNotifs.unshift({
          id: uid(), type: "onboarding", roomId: room.id,
          msg: `Onboarding: ${room.tenant.name} moves in 7 days (${fmtD(room.tenant.moveIn)}) — ${prop.name} ${room.name}. Set door code${room.tenant.doorCode ? " (current: " + room.tenant.doorCode + ")" : ""}, send portal invite, welcome email.`,
          date: todayStr, read: false, urgent: false,
        });
        notifsChanged = true;

        // Send welcome email to tenant
        if (tenantEmail) {
          const doorLine = room.tenant.doorCode ? `<p><strong>Door Code:</strong> ${room.tenant.doorCode}</p>` : "";
          await sendEmail(tenantEmail,
            `Welcome to ${prop.name} — Move-In ${fmtD(room.tenant.moveIn)}`,
            emailWrap(`<p>Hi ${firstName},</p>
            <p>Your move-in date at <strong>${prop.name} — ${room.name}</strong> is coming up on <strong>${fmtD(room.tenant.moveIn)}</strong> (7 days from now).</p>
            ${doorLine}
            <p>Here is what to expect:</p>
            <ul>
              <li>Move-in is anytime after 3:00 PM on your move-in date</li>
              <li>Please bring a valid government ID</li>
              <li>Access your tenant portal for payments and documents: <a href="${portalLink}">Access Portal</a></li>
            </ul>
            <p>If you have any questions, reply to this email or text us at ${s.phone || "(850) 696-8101"}.</p>
            <p>${s.companyName || ""}<br/>${s.phone || ""}</p>`),
            s
          );
          log.push(`Welcome email sent: ${room.tenant.name} — moves in ${fmtD(room.tenant.moveIn)}`);

          // Send portal invite if they don't have a portal account yet
          try {
            const puCheck = await fetch(`${SUPA_URL}/rest/v1/portal_users?email=eq.${encodeURIComponent(tenantEmail)}&select=id`, {
              headers: { apikey: SUPA_KEY, Authorization: `Bearer ${SUPA_KEY}` },
            });
            const puData = await puCheck.json();
            if (!Array.isArray(puData) || puData.length === 0) {
              // No portal account — send invite email
              await sendEmail(tenantEmail,
                `Set Up Your Tenant Portal — ${s.companyName || ""}`,
                emailWrap(`<p>Hi ${firstName},</p>
                <p>Your tenant portal is ready. Use it to pay rent, view your lease, and submit maintenance requests.</p>
                <p><a href="${portalLink}" style="display:inline-block;padding:12px 24px;background:#4a7c59;color:#fff;border-radius:8px;text-decoration:none;font-weight:700">Set Up Portal</a></p>
                <p>${s.companyName || ""}<br/>${s.phone || ""}</p>`),
                s
              );
              log.push(`Portal invite sent: ${room.tenant.name}`);
            } else {
              log.push(`Portal invite skipped (already has account): ${room.tenant.name}`);
            }
          } catch (portalErr) {
            log.push(`Portal invite check error: ${portalErr.message}`);
          }
        }
      }
    }

    // ── 10. SCHEDULED MESSAGES — send any that are past due ──────────
    try {
      const smRes = await fetch(`${SUPA_URL}/rest/v1/scheduled_messages?sent=eq.false&scheduled_at=lte.${new Date().toISOString()}&select=*`, {
        headers: { apikey: SUPA_KEY, Authorization: `Bearer ${SUPA_KEY}` },
      });
      const scheduledMsgs = await smRes.json();
      if (Array.isArray(scheduledMsgs) && scheduledMsgs.length > 0) {
        for (const sm of scheduledMsgs) {
          // Send the message
          await fetch(`${SUPA_URL}/rest/v1/messages`, {
            method: "POST",
            headers: { apikey: SUPA_KEY, Authorization: `Bearer ${SUPA_KEY}`, "Content-Type": "application/json", Prefer: "return=representation" },
            body: JSON.stringify({
              tenant_name: sm.tenant_name, sender_email: s.pmEmail || s.email || "",
              sender_name: s.pmName || "Property Manager", direction: "outbound",
              body: sm.body, read: true,
            }),
          });
          // Mark as sent
          await fetch(`${SUPA_URL}/rest/v1/scheduled_messages?id=eq.${sm.id}`, {
            method: "PATCH",
            headers: { apikey: SUPA_KEY, Authorization: `Bearer ${SUPA_KEY}`, "Content-Type": "application/json", Prefer: "return=representation" },
            body: JSON.stringify({ sent: true }),
          });
          log.push(`Scheduled message sent to ${sm.tenant_name}: ${(sm.body || "").slice(0, 40)}`);
        }
      }
    } catch (schedErr) {
      log.push(`Scheduled messages error: ${schedErr.message}`);
    }

    // ── 11. LATE PAYMENT WARNING EMAIL ─────────────────────────────────
    // Weekly overdue-payment warning emails to tenants (dedup via lastWarningDate)
    for (const charge of updatedCharges) {
      if (charge.waived || charge.voided || charge.deleted) continue;
      if (charge.amountPaid >= charge.amount) continue;

      const dueDate = new Date(charge.dueDate + "T00:00:00");
      const daysOverdue = Math.ceil((TODAY - dueDate) / 86400000);
      const room = roomLookup[charge.roomId];
      const prop = roomPropLookup[charge.roomId];
      const lc = getLateConfig(room || {}, prop || {}, s);
      if (daysOverdue <= lc.graceDays) continue;

      // Only send if lastWarningDate is missing or > 7 days ago
      if (charge.lastWarningDate) {
        const lastSent = new Date(charge.lastWarningDate + "T00:00:00");
        const daysSinceLast = Math.ceil((TODAY - lastSent) / 86400000);
        if (daysSinceLast < 7) continue;
      }

      // Find tenant email
      let tenantEmail = null;
      if (room && room.tenant?.email) {
        tenantEmail = room.tenant.email;
      }
      if (!tenantEmail) continue;

      const firstName = charge.tenantName?.split(" ")[0] || "there";
      const amountOwed = charge.amount - charge.amountPaid;
      const lateFeeCharge = updatedCharges.find(c => c.category === "Late Fee" && c.linkedChargeId === charge.id && !c.voided && !c.deleted);
      const lateFeeInfo = lateFeeCharge ? `A late fee of ${fmtS(lateFeeCharge.amount)} has also been applied.` : "Late fees may apply if payment is not received promptly.";

      const sent = await sendEmail(
        tenantEmail,
        `Payment overdue — ${charge.category}`,
        emailWrap(`<p>Hi ${firstName},</p>
        <p>Your <strong>${charge.category}</strong> payment of <strong>${fmtS(amountOwed)}</strong> was due on <strong>${fmtD(charge.dueDate)}</strong> and is now <strong>${daysOverdue} days overdue</strong>.</p>
        <p>${lateFeeInfo}</p>
        <p>Please log in to your tenant portal to make a payment as soon as possible:</p>
        <p><a href="${portalLink}" style="display:inline-block;padding:12px 24px;background:#4a7c59;color:#fff;border-radius:8px;text-decoration:none;font-weight:700">Pay Now</a></p>
        <p>If you have already paid, please disregard this notice.</p>
        <p>${s.companyName || ""}<br/>${s.phone || ""}</p>`),
        s
      );
      if (sent) {
        charge.lastWarningDate = todayStr;
        chargesChanged = true;
        log.push(`Late warning sent: ${charge.tenantName} — ${charge.category} ${fmtS(amountOwed)} (${daysOverdue}d overdue)`);
      }

      // Send SMS if tenant has phone number and Twilio is configured
      const tenantPhone = room?.tenant?.phone;
      if (tenantPhone && process.env.TWILIO_ACCOUNT_SID) {
        try {
          const smsBody = `Reminder: ${charge.category} payment of ${fmtS(amountOwed)} is ${daysOverdue}d overdue. Pay at ${portalLink}`;
          const smsSent = await sendSms(tenantPhone, smsBody);
          if (smsSent) log.push(`Late warning SMS sent: ${charge.tenantName} — ${charge.category}`);
        } catch (smsErr) {
          console.warn("[cron] SMS send failed:", smsErr?.message);
        }
      }
    }

    // ── 12. LEASE SIGNING REMINDER ───────────────────────────────────────
    // Remind tenants who haven't signed a lease after 48 hours (one-time)
    try {
      const lsRes = await fetch(`${SUPA_URL}/rest/v1/lease_instances?status=eq.pending_tenant&signing_reminder_sent=not.is.true&select=*`, {
        headers: { apikey: SUPA_KEY, Authorization: `Bearer ${SUPA_KEY}` },
      });
      const pendingLeases = await lsRes.json();
      if (Array.isArray(pendingLeases)) {
        const FORTY_EIGHT_HOURS = 48 * 60 * 60 * 1000;
        for (const lease of pendingLeases) {
          const sentOrCreated = lease.sent_at || lease.created_at;
          if (!sentOrCreated) continue;
          const sentTime = new Date(sentOrCreated);
          if (TODAY.getTime() - sentTime.getTime() < FORTY_EIGHT_HOURS) continue;

          const tenantEmail = lease.tenant_email;
          if (!tenantEmail) continue;

          const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://rentblackbear.com";
          const signingLink = `${siteUrl}/lease?token=${lease.signing_token}`;
          const firstName = (lease.tenant_name || "").split(" ")[0] || "there";

          const sent = await sendEmail(
            tenantEmail,
            "Reminder: You have a lease waiting for your signature",
            emailWrap(`<p>Hi ${firstName},</p>
            <p>You have a lease agreement waiting for your signature. Please review and sign it at your earliest convenience.</p>
            <p><a href="${signingLink}" style="display:inline-block;padding:12px 24px;background:#4a7c59;color:#fff;border-radius:8px;text-decoration:none;font-weight:700">Review &amp; Sign Lease</a></p>
            <p>If you have questions about the lease, please reply to this email or contact us at ${s.phone || ""}.</p>
            <p>${s.companyName || ""}<br/>${s.phone || ""}</p>`),
            s
          );

          if (sent) {
            // Mark as reminded so we don't send again
            await fetch(`${SUPA_URL}/rest/v1/lease_instances?id=eq.${lease.id}`, {
              method: "PATCH",
              headers: { apikey: SUPA_KEY, Authorization: `Bearer ${SUPA_KEY}`, "Content-Type": "application/json", Prefer: "return=representation" },
              body: JSON.stringify({ signing_reminder_sent: true }),
            });
            log.push(`Lease signing reminder sent: ${lease.tenant_name || lease.id}`);
          }
        }
      }
    } catch (leaseReminderErr) {
      log.push(`Lease signing reminder error: ${leaseReminderErr.message}`);
    }

    // ── 13. AUTOPAY RETRY (day 5 & 10) ──────────────────────────────────
    // Retry failed autopay charges on the 5th and 10th of each month (max 2 retries)
    if ((dayOfMonth === 5 || dayOfMonth === 10) && process.env.STRIPE_SECRET_KEY) {
      try {
        const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
        const puRes = await fetch(`${SUPA_URL}/rest/v1/portal_users?autopay_enabled=eq.true&select=*,tenant:tenants(id,name,email,room_id)`, {
          headers: { apikey: SUPA_KEY, Authorization: `Bearer ${SUPA_KEY}` },
        });
        const autopayUsers = await puRes.json();
        if (Array.isArray(autopayUsers)) {
          const mk = todayStr.slice(0, 7);
          for (const pu of autopayUsers) {
            if (!pu.stripe_customer_id || !pu.stripe_payment_method_id) continue;
            const tenantName = pu.tenant?.name || "Tenant";
            // Find this month's unpaid rent charge with no payment and retries < 2
            const rentCharge = updatedCharges.find(c =>
              c.roomId && pu.tenant?.room_id &&
              c.category === "Rent" && c.dueDate?.startsWith(mk) &&
              c.amountPaid === 0 &&
              c.roomId === pu.tenant.room_id &&
              (c.autopayRetryCount || 0) < 2
            );
            if (!rentCharge) continue;
            const amountDue = rentCharge.amount - rentCharge.amountPaid;
            if (amountDue <= 0) continue;

            try {
              const paymentIntent = await stripe.paymentIntents.create({
                amount: Math.round(amountDue * 100),
                currency: "usd",
                customer: pu.stripe_customer_id,
                payment_method: pu.stripe_payment_method_id,
                off_session: true,
                confirm: true,
                metadata: { chargeId: rentCharge.id, tenantName, autopayRetry: "true" },
              });
              if (paymentIntent.status === "succeeded") {
                rentCharge.amountPaid = rentCharge.amount;
                rentCharge.payments = [...(rentCharge.payments || []), {
                  amount: amountDue, date: todayStr, method: "Autopay Retry",
                  deposit_status: "transit", stripe_payment_id: paymentIntent.id,
                }];
                rentCharge.autopayRetryCount = (rentCharge.autopayRetryCount || 0) + 1;
                chargesChanged = true;
                log.push(`Autopay retry succeeded: ${tenantName} — ${fmtS(amountDue)} (${paymentIntent.id})`);
                if (pu.tenant?.email) {
                  sendEmail(pu.tenant.email,
                    `Autopay Processed — ${fmtS(amountDue)} Rent Payment`,
                    emailWrap(`<p>Hi ${tenantName.split(" ")[0]},</p>
                    <p>Your automatic rent payment of <strong>${fmtS(amountDue)}</strong> has been processed successfully on retry.</p>
                    <p><strong>Confirmation:</strong> ${paymentIntent.id}</p>
                    <p>Log in to your tenant portal to view your payment history: <a href="${portalLink}">Access Portal</a></p>
                    <p>${s.companyName || ""}<br/>${s.phone || ""}</p>`),
                    s
                  );
                }
              } else {
                rentCharge.autopayRetryCount = (rentCharge.autopayRetryCount || 0) + 1;
                chargesChanged = true;
                log.push(`Autopay retry pending: ${tenantName} — status ${paymentIntent.status}`);
              }
            } catch (stripeErr) {
              rentCharge.autopayRetryCount = (rentCharge.autopayRetryCount || 0) + 1;
              chargesChanged = true;
              log.push(`Autopay retry failed: ${tenantName} — ${stripeErr.message}`);
              updatedNotifs.unshift({ id: uid(), type: "payment", msg: `Autopay retry #${rentCharge.autopayRetryCount} failed for ${tenantName}: ${stripeErr.message}`, date: todayStr, read: false, urgent: true });
              notifsChanged = true;
              // Send escalation email to tenant
              if (pu.tenant?.email) {
                sendEmail(pu.tenant.email,
                  `Autopay Failed — Please Update Your Payment Method`,
                  emailWrap(`<p>Hi ${tenantName.split(" ")[0]},</p>
                  <p>Your automatic rent payment of <strong>${fmtS(amountDue)}</strong> has failed again (attempt ${rentCharge.autopayRetryCount} of 2).</p>
                  <p>Please log in to your tenant portal to <strong>update your payment method</strong> or <strong>pay manually</strong> to avoid additional late fees:</p>
                  <p><a href="${portalLink}" style="display:inline-block;padding:12px 24px;background:#4a7c59;color:#fff;border-radius:8px;text-decoration:none;font-weight:700">Access Portal</a></p>
                  <p>${s.companyName || ""}<br/>${s.phone || ""}</p>`),
                  s
                );
              }
            }
          }
        }
      } catch (retryErr) {
        log.push(`Autopay retry system error: ${retryErr.message}`);
      }
    }

    // ── 8. SECURITY DEPOSIT 60-DAY DEADLINE MONITORING ─────────────────
    // Alabama law requires SD return within 60 days of move-out.
    // Warn at 45 days (15 left), 55 days (5 left), 60 days (overdue).
    for (const prop of updatedProps) {
      for (const room of allRooms(prop)) {
        if (!room.tenant?.moveOutDate || room.tenant?.sdReconciled) continue;
        const moveOut = new Date(room.tenant.moveOutDate + "T00:00:00");
        const daysSince = Math.ceil((TODAY - moveOut) / 86400000);
        if (daysSince < 0) continue; // move-out hasn't happened yet
        const warnings = room.tenant.sdWarnings || [];
        const tenantName = room.tenant.name || "Tenant";
        const roomLabel = `${room.propName || prop.name} ${room.name || ""}`.trim();
        const sdDueDate = new Date(moveOut); sdDueDate.setDate(sdDueDate.getDate() + 60);
        const sdDueStr = fmtDate(sdDueDate);

        const checkAlert = (threshold, level, msg) => {
          if (daysSince < threshold) return;
          const key = `sd-${threshold}`;
          if (warnings.includes(key)) return;
          // Update warnings on tenant to avoid duplicates
          warnings.push(key);
          // Find and update room in props
          for (let pi2 = 0; pi2 < updatedProps.length; pi2++) {
            const p2 = updatedProps[pi2];
            let changed = false;
            const newUnits = (p2.units || []).map(u => ({
              ...u, rooms: (u.rooms || []).map(rm => {
                if (rm.id === room.id) { changed = true; return { ...rm, tenant: { ...rm.tenant, sdWarnings: warnings } }; }
                return rm;
              })
            }));
            if (changed) { updatedProps[pi2] = { ...p2, units: newUnits }; propsChanged = true; }
          }
          updatedNotifs.unshift({
            id: uid(), type: "sd-deadline", roomId: room.id,
            msg, date: todayStr, read: false,
            urgent: level === "urgent" || level === "critical",
          });
          notifsChanged = true;
          // Email PM
          if (s.pmEmail || s.email) {
            sendEmail(s.pmEmail || s.email, `${level === "critical" ? "CRITICAL" : level === "urgent" ? "URGENT" : "Reminder"}: SD Return — ${tenantName}`, emailWrap(`<p><strong>${msg}</strong></p><p>Tenant: ${tenantName}<br/>Property: ${roomLabel}<br/>Move-out date: ${fmtD(room.tenant.moveOutDate)}<br/>SD return due: ${fmtD(sdDueStr)}</p><p>Alabama law requires security deposits to be returned within 60 days with an itemized statement of deductions.</p>`), s);
          }
          log.push(`SD ${level}: ${tenantName} — ${daysSince}d since move-out`);
        };

        checkAlert(45, "warning", `SD return due in ${Math.max(0, 60 - daysSince)} days for ${tenantName} — ${roomLabel} (due ${fmtD(sdDueStr)})`);
        checkAlert(55, "urgent", `URGENT: SD return due in ${Math.max(0, 60 - daysSince)} days for ${tenantName} — Alabama 60-day deadline — ${roomLabel}`);
        checkAlert(60, "critical", `CRITICAL: SD RETURN OVERDUE for ${tenantName} — ${roomLabel}. Alabama 60-day deadline passed. Legal liability.`);
      }
    }

    // ── Save ──────────────────────────────────────────────────────────
    const saves = [];
    if (chargesChanged) saves.push(supaSet("hq-charges", updatedCharges));
    if (propsChanged) saves.push(supaSet("hq-props", updatedProps));
    if (notifsChanged) saves.push(supaSet("hq-notifs", updatedNotifs));
    await Promise.all(saves);

    const cronEnd = Date.now();
    const durationMs = cronEnd - cronStart;
    const summary = {
      ran: todayStr,
      durationMs,
      sections: {
        chargesChanged,
        propsChanged,
        notifsChanged,
        logEntries: log.length,
      },
      log,
    };

    info("cron/daily", "Cron completed", {
      date: todayStr,
      durationMs,
      chargesChanged,
      propsChanged,
      notifsChanged,
      logEntries: log.length,
    });

    return Response.json(summary);

  } catch (err) {
    const durationMs = Date.now() - cronStart;
    logError("cron/daily", "Cron failed", { error: err.message, durationMs });
    return new Response(`Cron error: ${err.message}`, { status: 500 });
  }
}
