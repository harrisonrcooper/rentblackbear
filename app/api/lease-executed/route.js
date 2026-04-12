// app/api/lease-executed/route.js
// Fires when a tenant signs their lease. Handles:
// 1. Confirmation emails (tenant + PM)
// 2. Move-in chain: SD charge, prorated rent, door code, portal invite, welcome email

import { getSettings, emailWrap, fromAddress, fmtMoney } from "@/lib/getSettings";
import { loadAppData, saveAppData, supaGet } from "@/lib/supabase-server";

const SUPA_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPA_KEY = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export async function POST(request) {
  try {
    // ── Origin check ────────────────────────────────────────────────
    // Rejects requests from outside the operator's deploy domains.
    // TODO(saas-multitenant): drive this allowlist from settings.siteUrl
    // once per-tenant deploys land. The hardcoded rentblackbear.com entry
    // is the current operator deploy URL, not product branding.
    const ALLOWED_ORIGINS = [
      process.env.NEXT_PUBLIC_SITE_URL,
      "https://rentblackbear.com",
      "https://rentblackbear.vercel.app",
      "http://localhost:3000",
    ].filter(Boolean);
    const origin = request.headers.get("origin") || request.headers.get("referer") || "";
    const isAllowed = ALLOWED_ORIGINS.some(ok => origin.startsWith(ok));
    if (!isAllowed) {
      return new Response(JSON.stringify({ error: "Forbidden" }), {
        status: 403,
        headers: { "Content-Type": "application/json" },
      });
    }

    const body = await request.json();
    const { type } = body;
    const resendKey = process.env.RESEND_API_KEY;
    if (!resendKey) return Response.json({ ok:true, note:"No Resend key" });
    const s = await getSettings();

    const buildChargeRows = (chargeRows) => {
      if (!chargeRows) return "";
      return chargeRows.split(", ").filter(Boolean).map(row => {
        const parts = row.split(": $");
        const desc = parts[0]||row;
        const [amount, due] = (parts[1]||"").split(" — due ");
        return `<tr>
          <td style="padding:7px 0;border-bottom:1px solid rgba(0,0,0,.05);font-size:13px;">
            <div style="font-weight:600;color:#1a1714;">${desc}</div>
            ${due?`<div style="font-size:11px;color:#4a7c59;margin-top:2px;">Due ${due}</div>`:""}
          </td>
          <td style="padding:7px 0;border-bottom:1px solid rgba(0,0,0,.05);font-weight:700;text-align:right;font-size:13px;">$${amount||"—"}</td>
        </tr>`;
      }).join("");
    };

    // ── TENANT confirmation ───────────────────────────────────────
    if (type === "tenant_signed_confirmation") {
      const { tenantName, tenantEmail, property, room, rent, moveIn, leaseEnd, doorCode, executedAt, chargeRows, totalDue } = body;
      if (!tenantEmail) return Response.json({ ok:false, error:"No tenant email" }, { status:400 });
      const firstName = (tenantName||"").split(" ")[0]||"there";
      const portalUrl = `${s.siteUrl}/portal?email=${encodeURIComponent(tenantEmail)}&name=${encodeURIComponent(tenantName||"")}`;
      const rows = buildChargeRows(chargeRows);

      await fetch("https://api.resend.com/emails", {
        method:"POST", headers:{Authorization:`Bearer ${resendKey}`,"Content-Type":"application/json"},
        body: JSON.stringify({
          from: fromAddress(s), to: tenantEmail,
          subject: `Your lease is signed — welcome to ${property}!`,
          html: emailWrap(`
            <div style="text-align:center;margin-bottom:28px;">
              <h2 style="font-size:24px;margin:0 0 8px;color:#1a1714;">You're all signed up, ${firstName}!</h2>
              <p style="font-size:14px;color:#5c4a3a;margin:0;">Your lease is fully executed. Here's a summary for your records.</p>
            </div>
            <div style="background:#f0faf4;border:1px solid #c3e6cb;border-radius:10px;padding:20px;margin-bottom:20px;">
              <div style="font-size:11px;font-weight:700;color:#2d6a3f;text-transform:uppercase;letter-spacing:1px;margin-bottom:14px;">Lease Summary</div>
              <table style="width:100%;border-collapse:collapse;font-size:13px;">
                <tr><td style="padding:6px 0;color:#5c4a3a;border-bottom:1px solid rgba(0,0,0,.06);">Property</td><td style="padding:6px 0;font-weight:700;text-align:right;border-bottom:1px solid rgba(0,0,0,.06);">${property}</td></tr>
                <tr><td style="padding:6px 0;color:#5c4a3a;border-bottom:1px solid rgba(0,0,0,.06);">Room</td><td style="padding:6px 0;font-weight:700;text-align:right;border-bottom:1px solid rgba(0,0,0,.06);">${room}</td></tr>
                <tr><td style="padding:6px 0;color:#5c4a3a;border-bottom:1px solid rgba(0,0,0,.06);">Monthly Rent</td><td style="padding:6px 0;font-weight:700;text-align:right;color:#2d6a3f;border-bottom:1px solid rgba(0,0,0,.06);">${fmtMoney(rent)}/mo</td></tr>
                <tr><td style="padding:6px 0;color:#5c4a3a;border-bottom:1px solid rgba(0,0,0,.06);">Move-in</td><td style="padding:6px 0;font-weight:700;text-align:right;border-bottom:1px solid rgba(0,0,0,.06);">${moveIn||"—"}</td></tr>
                ${leaseEnd?`<tr><td style="padding:6px 0;color:#5c4a3a;border-bottom:1px solid rgba(0,0,0,.06);">Lease End</td><td style="padding:6px 0;font-weight:700;text-align:right;border-bottom:1px solid rgba(0,0,0,.06);">${leaseEnd}</td></tr>`:""}
                ${doorCode?`<tr><td style="padding:6px 0;color:#5c4a3a;border-bottom:1px solid rgba(0,0,0,.06);">Door Code</td><td style="padding:6px 0;font-weight:700;text-align:right;font-family:monospace;letter-spacing:4px;border-bottom:1px solid rgba(0,0,0,.06);">${doorCode}</td></tr>`:""}
                <tr><td style="padding:6px 0;color:#5c4a3a;">Signed</td><td style="padding:6px 0;font-weight:700;text-align:right;">${executedAt||"Today"}</td></tr>
              </table>
            </div>
            ${rows?`<div style="margin-bottom:20px;">
              <div style="font-size:10px;font-weight:800;color:#2d6a3f;text-transform:uppercase;letter-spacing:1px;padding:6px 12px;background:rgba(74,124,89,.08);border-radius:6px 6px 0 0;">Move-In Charges</div>
              <div style="border:1px solid rgba(74,124,89,.15);border-top:none;border-radius:0 0 8px 8px;padding:0 12px;">
                <table style="width:100%;border-collapse:collapse;">${rows}
                  <tr><td style="padding:10px 0 8px;font-size:14px;font-weight:800;border-top:2px solid rgba(74,124,89,.2);">Total Due</td><td style="padding:10px 0 8px;font-size:14px;font-weight:800;text-align:right;color:#2d6a3f;border-top:2px solid rgba(74,124,89,.2);">${fmtMoney(totalDue)}</td></tr>
                </table>
              </div>
            </div>`:""}
            <div style="background:#fff8e6;border:1px solid rgba(212,168,83,.3);border-radius:10px;padding:18px;margin-bottom:20px;">
              <div style="font-size:12px;font-weight:800;color:#9a7422;text-transform:uppercase;letter-spacing:1px;margin-bottom:10px;">Action Required -- Submit Your Security Deposit</div>
              <p style="font-size:13px;color:#5c4a3a;line-height:1.7;margin:0 0 12px;">Your room at <strong>${property}</strong> is not fully secured until your security deposit is received.</p>
              <div style="text-align:center;"><a href="${portalUrl}" style="display:inline-block;background:#d4a853;color:#1a1714;padding:12px 28px;border-radius:8px;font-weight:700;font-size:13px;text-decoration:none;">Log In to Tenant Portal</a></div>
            </div>
            <div style="background:#f5f0e8;border-radius:10px;padding:16px;margin-bottom:20px;">
              <div style="font-size:12px;font-weight:700;color:#9a7422;margin-bottom:8px;">What Happens Next</div>
              <div style="font-size:13px;color:#5c4a3a;line-height:1.8;">
                1. Submit your security deposit via the tenant portal<br/>
                2. Your door code activates at 12:00am on move-in day once full payment is received<br/>
                3. Move in and enjoy your new home!
              </div>
            </div>
            <p style="font-size:13px;color:#5c4a3a;">Questions? Reply to this email or call <strong>${s.phone}</strong>.</p>
          `, s),
        }),
      });
      return Response.json({ ok:true });
    }

    // ── PM notification ───────────────────────────────────────────
    if (s.notifLeaseSigned===false) return Response.json({ ok:true, note:"PM notification disabled" });
    const { tenantName, tenantEmail, landlordEmail, property, room, rent, moveIn, executedAt, doorCode, chargesGenerated, chargeRows, totalDue } = body;
    const pmTo = landlordEmail || s.email;
    const rows = buildChargeRows(chargeRows);

    await fetch("https://api.resend.com/emails", {
      method:"POST", headers:{Authorization:`Bearer ${resendKey}`,"Content-Type":"application/json"},
      body: JSON.stringify({
        from: fromAddress(s), to: pmTo,
        subject: `Lease Signed — ${tenantName} · ${room} at ${property}`,
        html: emailWrap(`
          <h2 style="font-size:20px;margin:0 0 6px;">Lease Signed by ${tenantName}</h2>
          <p style="font-size:13px;color:#5c4a3a;margin:0 0 24px;">The tenant has signed their lease.${chargesGenerated?` ${chargesGenerated} charge(s) generated in their ledger.`:""}</p>
          <div style="background:#f0faf4;border:1px solid #c3e6cb;border-radius:10px;padding:20px;margin-bottom:20px;">
            <table style="width:100%;border-collapse:collapse;font-size:13px;">
              <tr><td style="padding:5px 0;color:#5c4a3a;border-bottom:1px solid rgba(0,0,0,.05);">Tenant</td><td style="padding:5px 0;font-weight:700;text-align:right;border-bottom:1px solid rgba(0,0,0,.05);">${tenantName}</td></tr>
              <tr><td style="padding:5px 0;color:#5c4a3a;border-bottom:1px solid rgba(0,0,0,.05);">Email</td><td style="padding:5px 0;text-align:right;border-bottom:1px solid rgba(0,0,0,.05);">${tenantEmail}</td></tr>
              <tr><td style="padding:5px 0;color:#5c4a3a;border-bottom:1px solid rgba(0,0,0,.05);">Property</td><td style="padding:5px 0;font-weight:700;text-align:right;border-bottom:1px solid rgba(0,0,0,.05);">${property}</td></tr>
              <tr><td style="padding:5px 0;color:#5c4a3a;border-bottom:1px solid rgba(0,0,0,.05);">Room</td><td style="padding:5px 0;font-weight:700;text-align:right;border-bottom:1px solid rgba(0,0,0,.05);">${room}</td></tr>
              <tr><td style="padding:5px 0;color:#5c4a3a;border-bottom:1px solid rgba(0,0,0,.05);">Monthly Rent</td><td style="padding:5px 0;font-weight:700;text-align:right;color:#2d6a3f;border-bottom:1px solid rgba(0,0,0,.05);">${fmtMoney(rent)}/mo</td></tr>
              <tr><td style="padding:5px 0;color:#5c4a3a;border-bottom:1px solid rgba(0,0,0,.05);">Move-in</td><td style="padding:5px 0;font-weight:700;text-align:right;border-bottom:1px solid rgba(0,0,0,.05);">${moveIn||"—"}</td></tr>
              ${doorCode?`<tr><td style="padding:5px 0;color:#5c4a3a;border-bottom:1px solid rgba(0,0,0,.05);">Door Code</td><td style="padding:5px 0;font-weight:700;text-align:right;font-family:monospace;letter-spacing:4px;border-bottom:1px solid rgba(0,0,0,.05);">${doorCode}</td></tr>`:""}
              <tr><td style="padding:5px 0;color:#5c4a3a;">Signed</td><td style="padding:5px 0;font-weight:700;text-align:right;">${executedAt||"Today"}</td></tr>
            </table>
          </div>
          ${rows?`<div style="margin-bottom:20px;">
            <div style="font-size:11px;font-weight:700;color:#2d6a3f;text-transform:uppercase;letter-spacing:1px;margin-bottom:8px;">Charges Generated</div>
            <table style="width:100%;border-collapse:collapse;">${rows}
              <tr><td style="padding:10px 0 0;font-size:14px;font-weight:800;border-top:2px solid rgba(74,124,89,.2);">Total</td><td style="padding:10px 0 0;font-size:14px;font-weight:800;text-align:right;color:#2d6a3f;border-top:2px solid rgba(74,124,89,.2);">${fmtMoney(totalDue)}</td></tr>
            </table>
          </div>`:""}
          <p style="font-size:12px;color:#999;">Tenant emailed a signed confirmation with SD reminder and portal link.</p>
        `, s),
      }),
    });

    // ── MOVE-IN CHAIN ─────────────────────────────────────────────
    // After PM notification, fire the automated move-in chain.
    // Uses leaseId from body to look up full lease data from Supabase.
    const leaseId = body.leaseId;
    if (leaseId) {
      const chainResult = await runMoveInChain(leaseId, s, resendKey);
      return Response.json({ ok: true, moveInChain: chainResult });
    }

    return Response.json({ ok:true });
  } catch (err) {
    console.error("lease-executed error:", err);
    return Response.json({ ok:false, error:String(err) }, { status:500 });
  }
}


// ── MOVE-IN CHAIN ───────────────────────────────────────────────────
// Fires all 5 onboarding steps: SD charge, prorated rent, door code,
// portal invite, and welcome email. Each step is try/caught independently.

async function runMoveInChain(leaseId, s, resendKey) {
  const results = { sdCharge: false, proratedRent: false, doorCode: false, portalInvite: false, welcomeEmail: false };
  const errors = [];

  // ── Load lease instance from Supabase ───────────────────────────
  let lease;
  try {
    const rows = await supaGet("lease_instances", `id=eq.${leaseId}&select=*`);
    if (!rows?.[0]) { return { skipped: true, reason: "Lease not found" }; }
    const row = rows[0];
    lease = { ...row, ...(row.variable_data || {}) };
  } catch (e) {
    console.error("[move-in-chain] Failed to load lease:", e);
    return { skipped: true, reason: "Lease load error: " + e.message };
  }

  // ── Idempotency guard ──────────────────────────────────────────
  if (lease.move_in_chain_fired || lease.moveInChainFired) {
    return { skipped: true, reason: "Move-in chain already fired" };
  }

  const tenantName = lease.tenantName || lease.tenant_name || "";
  const tenantEmail = lease.tenantEmail || lease.tenant_email || "";
  const property = lease.propertyAddress || lease.property_address || lease.property || "";
  const roomName = lease.room || lease.roomName || lease.room_name || "";
  const roomId = lease.roomId || lease.room_id || null;
  const monthlyRent = parseFloat(lease.rent || lease.monthly_rent || lease.monthlyRent || 0);
  const securityDeposit = parseFloat(lease.sd || lease.security_deposit || lease.securityDeposit || 0) || monthlyRent;
  const moveInDate = lease.moveIn || lease.move_in_date || lease.moveInDate || lease.leaseStart || lease.lease_start || "";
  const leaseEnd = lease.leaseEnd || lease.lease_end || "";
  const firstName = (tenantName || "").split(" ")[0] || "there";
  const todayStr = new Date().toISOString().split("T")[0];

  // ── Step 1: Security Deposit charge ────────────────────────────
  try {
    const charges = await loadAppData("hq-charges", []);
    const updatedCharges = [...(charges || [])];

    updatedCharges.push({
      id: crypto.randomUUID(),
      roomId: roomId,
      tenantName: tenantName,
      propName: property,
      roomName: roomName,
      category: "Security Deposit",
      desc: "Security deposit -- due on/before move-in",
      amount: securityDeposit,
      amountPaid: 0,
      dueDate: moveInDate || todayStr,
      createdDate: todayStr,
      payments: [],
      waived: false,
      noLateFee: true,
    });

    // ── Step 2: Prorated rent charge (if mid-month move-in) ──────
    if (moveInDate) {
      const moveIn = new Date(moveInDate + "T00:00:00");
      const dayOfMonth = moveIn.getDate();
      if (dayOfMonth > 1) {
        const daysInMonth = 30;
        const daysRemaining = daysInMonth - dayOfMonth + 1;
        const dailyRate = monthlyRent / 30;
        const proratedAmt = Math.ceil(dailyRate * daysRemaining * 100) / 100;

        updatedCharges.push({
          id: crypto.randomUUID(),
          roomId: roomId,
          tenantName: tenantName,
          propName: property,
          roomName: roomName,
          category: "Rent",
          desc: "Prorated first month rent",
          amount: proratedAmt,
          amountPaid: 0,
          dueDate: moveInDate,
          createdDate: todayStr,
          payments: [],
          waived: false,
          noLateFee: true,
        });
        results.proratedRent = true;
      } else {
        results.proratedRent = "skipped-1st";
      }
    } else {
      results.proratedRent = "skipped-no-date";
    }

    await saveAppData("hq-charges", updatedCharges);
    results.sdCharge = true;
  } catch (e) {
    console.error("[move-in-chain] Charge creation error:", e);
    errors.push("charges: " + e.message);
  }

  // ── Step 3: Generate door code ─────────────────────────────────
  let doorCode = "";
  try {
    doorCode = String(Math.floor(1000 + Math.random() * 9000));

    // Store door code on the lease instance
    await fetch(`${SUPA_URL}/rest/v1/lease_instances?id=eq.${leaseId}`, {
      method: "PATCH",
      headers: {
        apikey: SUPA_KEY,
        Authorization: `Bearer ${SUPA_KEY}`,
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
      body: JSON.stringify({
        variable_data: { ...(lease.variable_data || {}), doorCode },
        updated_at: new Date().toISOString(),
      }),
    });

    // Also store door code on the room in hq-props (matches cron onboarding pattern)
    if (roomId) {
      try {
        const props = await loadAppData("hq-props", []);
        if (Array.isArray(props)) {
          let propsChanged = false;
          for (const prop of props) {
            for (const unit of prop.units || []) {
              for (const room of unit.rooms || []) {
                if (room.id === roomId && room.tenant) {
                  room.tenant.doorCode = doorCode;
                  propsChanged = true;
                }
              }
            }
          }
          if (propsChanged) await saveAppData("hq-props", props);
        }
      } catch (propErr) {
        console.error("[move-in-chain] Door code prop update error:", propErr);
      }
    }

    results.doorCode = doorCode;
  } catch (e) {
    console.error("[move-in-chain] Door code error:", e);
    errors.push("doorCode: " + e.message);
  }

  // ── Step 4: Portal invite ──────────────────────────────────────
  if (tenantEmail) {
    try {
      // Check if tenant already has a portal account
      const puCheck = await fetch(
        `${SUPA_URL}/rest/v1/portal_users?email=eq.${encodeURIComponent(tenantEmail)}&select=id`,
        { headers: { apikey: SUPA_KEY, Authorization: `Bearer ${SUPA_KEY}` } }
      );
      const puData = await puCheck.json();

      if (!Array.isArray(puData) || puData.length === 0) {
        // Get PM account id
        let pmAccountId = null;
        try {
          const pms = await supaGet("pm_accounts", `email=eq.${encodeURIComponent(s.email)}&select=id`);
          pmAccountId = pms?.[0]?.id || null;
        } catch (_) { /* proceed without PM id */ }

        // Check/create tenant record
        let tenantRecordId = null;
        if (pmAccountId) {
          try {
            const existing = await supaGet("tenants", `email=eq.${encodeURIComponent(tenantEmail)}&pm_id=eq.${pmAccountId}&select=id`);
            if (existing?.[0]) {
              tenantRecordId = existing[0].id;
            } else {
              const createRes = await fetch(`${SUPA_URL}/rest/v1/tenants`, {
                method: "POST",
                headers: {
                  apikey: SUPA_KEY, Authorization: `Bearer ${SUPA_KEY}`,
                  "Content-Type": "application/json", Prefer: "return=representation",
                },
                body: JSON.stringify({ pm_id: pmAccountId, name: tenantName, email: tenantEmail, room_id: roomId, status: "active" }),
              });
              const created = await createRes.json();
              tenantRecordId = created?.[0]?.id || null;
            }
          } catch (_) { /* proceed without tenant record */ }
        }

        // Invalidate existing unused invites
        await fetch(`${SUPA_URL}/rest/v1/invites?email=eq.${encodeURIComponent(tenantEmail)}&accepted_at=is.null`, {
          method: "DELETE",
          headers: { apikey: SUPA_KEY, Authorization: `Bearer ${SUPA_KEY}` },
        });

        // Create invite record
        const inviteRes = await fetch(`${SUPA_URL}/rest/v1/invites`, {
          method: "POST",
          headers: {
            apikey: SUPA_KEY, Authorization: `Bearer ${SUPA_KEY}`,
            "Content-Type": "application/json", Prefer: "return=representation",
          },
          body: JSON.stringify({ pm_id: pmAccountId, tenant_id: tenantRecordId, email: tenantEmail }),
        });
        const inviteRows = await inviteRes.json();
        const invite = inviteRows?.[0];

        if (invite?.token) {
          const portalUrl = `${s.siteUrl}/portal?token=${invite.token}`;

          await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json" },
            body: JSON.stringify({
              from: fromAddress(s), to: tenantEmail,
              subject: `Your tenant portal is ready -- ${s.companyName}`,
              html: emailWrap(`
                <div style="text-align:center;margin-bottom:28px;">
                  <h2 style="font-size:24px;margin:0 0 8px;color:#1a1714;">Welcome to your portal, ${firstName}!</h2>
                  <p style="font-size:14px;color:#5c4a3a;margin:0;">View your lease, track payments, and submit maintenance requests.</p>
                </div>
                <div style="background:#f0faf4;border:1px solid #c3e6cb;border-radius:10px;padding:20px;margin-bottom:20px;">
                  <div style="font-size:11px;font-weight:700;color:#2d6a3f;text-transform:uppercase;letter-spacing:1px;margin-bottom:14px;">Your Details</div>
                  <table style="width:100%;border-collapse:collapse;font-size:13px;">
                    ${property ? `<tr><td style="padding:6px 0;color:#5c4a3a;border-bottom:1px solid rgba(0,0,0,.06);">Property</td><td style="padding:6px 0;font-weight:700;text-align:right;border-bottom:1px solid rgba(0,0,0,.06);">${property}</td></tr>` : ""}
                    ${roomName ? `<tr><td style="padding:6px 0;color:#5c4a3a;border-bottom:1px solid rgba(0,0,0,.06);">Room</td><td style="padding:6px 0;font-weight:700;text-align:right;border-bottom:1px solid rgba(0,0,0,.06);">${roomName}</td></tr>` : ""}
                    ${monthlyRent ? `<tr><td style="padding:6px 0;color:#5c4a3a;border-bottom:1px solid rgba(0,0,0,.06);">Monthly Rent</td><td style="padding:6px 0;font-weight:700;text-align:right;color:#2d6a3f;border-bottom:1px solid rgba(0,0,0,.06);">$${Number(monthlyRent).toLocaleString()}/mo</td></tr>` : ""}
                    ${moveInDate ? `<tr><td style="padding:6px 0;color:#5c4a3a;">Move-in</td><td style="padding:6px 0;font-weight:700;text-align:right;">${moveInDate}</td></tr>` : ""}
                  </table>
                </div>
                <div style="text-align:center;margin:28px 0;">
                  <a href="${portalUrl}" style="display:inline-block;background:#d4a853;color:#1a1714;padding:16px 40px;border-radius:10px;font-weight:800;font-size:16px;text-decoration:none;">Access Your Portal</a>
                  <div style="font-size:11px;color:#999;margin-top:10px;">This link expires in 48 hours</div>
                </div>
                <div style="background:#f5f0e8;border-radius:10px;padding:18px;margin-bottom:20px;">
                  <div style="font-size:11px;font-weight:700;color:#9a7422;text-transform:uppercase;letter-spacing:1px;margin-bottom:10px;">Sign in with</div>
                  <div style="font-size:13px;color:#5c4a3a;line-height:1.8;">
                    Your Google account (recommended) or create an account with your email and password.
                    Use the same email address this invitation was sent to.
                  </div>
                </div>
                <p style="font-size:13px;color:#5c4a3a;">Questions? Reply to this email or call <strong>${s.phone}</strong>.</p>
              `, s),
            }),
          });
          results.portalInvite = true;
        } else {
          results.portalInvite = "invite-create-failed";
          errors.push("portalInvite: invite record creation failed");
        }
      } else {
        results.portalInvite = "already-exists";
      }
    } catch (e) {
      console.error("[move-in-chain] Portal invite error:", e);
      errors.push("portalInvite: " + e.message);
    }
  } else {
    results.portalInvite = "no-email";
  }

  // ── Step 5: Welcome email ──────────────────────────────────────
  if (tenantEmail) {
    try {
      const moveInFmt = moveInDate
        ? new Date(moveInDate + "T00:00:00").toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
        : "your move-in date";
      const doorLine = doorCode ? `<p><strong>Door Code:</strong> <span style="font-family:monospace;letter-spacing:4px;font-size:18px;">${doorCode}</span></p>` : "";
      const portalLink = `${s.siteUrl}/portal`;

      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from: fromAddress(s), to: tenantEmail,
          subject: `Welcome to ${property} -- Move-In Details`,
          html: emailWrap(`
            <p>Hi ${firstName},</p>
            <p>Your move-in at <strong>${property} -- ${roomName}</strong> is on <strong>${moveInFmt}</strong>. Here is everything you need to know:</p>
            ${doorLine}
            <div style="background:#f0faf4;border:1px solid #c3e6cb;border-radius:10px;padding:20px;margin:20px 0;">
              <div style="font-size:11px;font-weight:700;color:#2d6a3f;text-transform:uppercase;letter-spacing:1px;margin-bottom:14px;">Move-In Checklist</div>
              <div style="font-size:13px;color:#5c4a3a;line-height:2;">
                1. Move-in is anytime after 3:00 PM on your move-in date<br/>
                2. Please bring a valid government ID<br/>
                3. Your security deposit must be paid on or before move-in<br/>
                4. Access your tenant portal for payments and documents: <a href="${portalLink}" style="color:#4a7c59;font-weight:700;">Access Portal</a>
              </div>
            </div>
            ${(s.houseRules && s.houseRules.length) ? `
            <div style="background:#f5f0e8;border-radius:10px;padding:18px;margin-bottom:20px;">
              <div style="font-size:11px;font-weight:700;color:#9a7422;text-transform:uppercase;letter-spacing:1px;margin-bottom:10px;">House Rules Highlights</div>
              <ul style="font-size:13px;color:#5c4a3a;line-height:1.8;margin:0;padding-left:18px;">
                ${s.houseRules.slice(0, 5).map(r => `<li>${typeof r === "string" ? r : r.text || r.rule || ""}</li>`).join("")}
              </ul>
            </div>` : ""}
            <p style="font-size:13px;color:#5c4a3a;">If you have any questions, reply to this email or text us at ${s.phone}.</p>
            <p>${s.companyName}<br/>${s.phone || ""}</p>
          `, s),
        }),
      });
      results.welcomeEmail = true;
    } catch (e) {
      console.error("[move-in-chain] Welcome email error:", e);
      errors.push("welcomeEmail: " + e.message);
    }
  } else {
    results.welcomeEmail = "no-email";
  }

  // ── Admin notification ─────────────────────────────────────────
  try {
    const notifs = await loadAppData("hq-notifs", []);
    const updatedNotifs = [...(notifs || [])];
    const stepsOk = [results.sdCharge && "SD charge", results.proratedRent === true && "prorated rent", results.doorCode && "door code", results.portalInvite === true && "portal invite", results.welcomeEmail && "welcome email"].filter(Boolean).join(", ");
    updatedNotifs.unshift({
      id: crypto.randomUUID(),
      type: "move-in-chain",
      title: "Move-in chain fired",
      msg: `${tenantName} -- ${stepsOk || "no steps succeeded"}`,
      date: new Date().toISOString(),
      read: false,
      urgent: false,
    });
    await saveAppData("hq-notifs", updatedNotifs);
  } catch (e) {
    console.error("[move-in-chain] Notification error:", e);
    errors.push("notification: " + e.message);
  }

  // ── Mark chain as fired (idempotency) ──────────────────────────
  try {
    await fetch(`${SUPA_URL}/rest/v1/lease_instances?id=eq.${leaseId}`, {
      method: "PATCH",
      headers: {
        apikey: SUPA_KEY,
        Authorization: `Bearer ${SUPA_KEY}`,
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
      body: JSON.stringify({
        move_in_chain_fired: true,
        updated_at: new Date().toISOString(),
      }),
    });
  } catch (e) {
    console.error("[move-in-chain] Idempotency flag error:", e);
    errors.push("idempotencyFlag: " + e.message);
  }

  console.log("[move-in-chain] Complete:", tenantName, results, errors.length ? errors : "no errors");
  return { results, errors: errors.length ? errors : undefined };
}
