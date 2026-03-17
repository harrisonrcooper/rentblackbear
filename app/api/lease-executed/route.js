// app/api/lease-executed/route.js
// Fires when tenant signs lease. Sends:
// 1. PM notification — lease signed, charges generated
// 2. Tenant confirmation — signed copy, SD reminder, portal link

export async function POST(request) {
  try {
    const body = await request.json();
    const { type } = body;

    const resendKey = process.env.RESEND_API_KEY;
    if (!resendKey) return Response.json({ ok: true, note: "No Resend key — email skipped" });

    // Read PM settings for notification prefs + phone
    const SUPA_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://vxysaclhucdjxzcknoar.supabase.co";
    const SUPA_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ4eXNhY2xodWNkanh6Y2tub2FyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMyNzA5NTEsImV4cCI6MjA4ODg0Njk1MX0.AiAkd5eZZm8ztaUsfGUj-XF7zL_mwCTy7bAGF-mqmoM";
    let pmSettings = {};
    try {
      const sr = await fetch(SUPA_URL + "/rest/v1/app_data?key=eq.hq-settings&select=value", {
        headers: { apikey: SUPA_KEY, Authorization: "Bearer " + SUPA_KEY }
      });
      const sd = await sr.json();
      pmSettings = sd?.[0]?.value || {};
    } catch {}
    const contactPhone = pmSettings.phone || "";
    const pmEmail = pmSettings.email || "info@rentblackbear.com";
    const notifLeaseSigned = pmSettings.notifLeaseSigned !== false;

    const fmtMoney = (n) => (n != null && !isNaN(Number(n))) ? `$${Number(n).toLocaleString()}` : "—";

    const header = `
      <div style="background:#1a1714;padding:28px 32px;border-radius:12px 12px 0 0;">
        <div style="font-family:Georgia,serif;font-size:22px;color:#d4a853;font-weight:700;">🐻 Black Bear Rentals</div>
        <div style="font-size:12px;color:#c4a882;margin-top:4px;">Huntsville, Alabama</div>
      </div>`;

    const footer = `
      <hr style="margin:28px 0;border:none;border-top:1px solid #e8e5e0;"/>
      <p style="font-size:11px;color:#999;margin:0;">
        — Black Bear Rentals · Oak &amp; Main Development LLC<br/>
        Huntsville, Alabama · <a href="https://rentblackbear.com" style="color:#d4a853;">rentblackbear.com</a>
      </p>`;

    const wrap = (content) => `
      <div style="font-family:'Helvetica Neue',Arial,sans-serif;max-width:580px;margin:0 auto;color:#1a1714;">
        ${header}
        <div style="background:#fff;padding:32px;border:1px solid #e8e5e0;border-top:none;border-radius:0 0 12px 12px;">
          ${content}
          ${footer}
        </div>
      </div>`;

    const buildChargeRows = (chargeRows) => {
      if (!chargeRows) return "";
      const rows = chargeRows.split(", ").filter(Boolean).map(row => {
        const parts = row.split(": $");
        const desc = parts[0] || row;
        const rest = parts[1] || "";
        const [amount, due] = rest.split(" — due ");
        return `
          <tr>
            <td style="padding:7px 0;border-bottom:1px solid rgba(0,0,0,.05);font-size:13px;">
              <div style="font-weight:600;color:#1a1714;">${desc}</div>
              ${due ? `<div style="font-size:11px;color:#4a7c59;margin-top:2px;">Due ${due}</div>` : ""}
            </td>
            <td style="padding:7px 0;border-bottom:1px solid rgba(0,0,0,.05);font-weight:700;text-align:right;font-size:13px;">$${amount || "—"}</td>
          </tr>`;
      }).join("");
      return rows;
    };

    // ── TENANT: lease signed confirmation ─────────────────────────
    if (type === "tenant_signed_confirmation") {
      const { tenantName, tenantEmail, property, room, rent, moveIn, leaseEnd,
              doorCode, executedAt, chargeRows, totalDue } = body;
      if (!tenantEmail) return Response.json({ ok: false, error: "No tenant email" }, { status: 400 });
      const firstName = (tenantName || "").split(" ")[0] || "there";
      const portalUrl = `https://rentblackbear.com/portal?email=${encodeURIComponent(tenantEmail)}&name=${encodeURIComponent(tenantName || "")}`;

      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from: "Black Bear Rentals <hello@rentblackbear.com>",
          to: tenantEmail,
          subject: `Your lease is signed — welcome to ${property}! 🐻`,
          html: wrap(`
            <div style="text-align:center;margin-bottom:28px;">
              <div style="font-size:48px;margin-bottom:12px;">✅</div>
              <h2 style="font-size:24px;margin:0 0 8px;color:#1a1714;">You're all signed up, ${firstName}!</h2>
              <p style="font-size:14px;color:#5c4a3a;margin:0;">Your lease is fully executed. Here's a summary for your records.</p>
            </div>

            <div style="background:#f0faf4;border:1px solid #c3e6cb;border-radius:10px;padding:20px;margin-bottom:20px;">
              <div style="font-size:11px;font-weight:700;color:#2d6a3f;text-transform:uppercase;letter-spacing:1px;margin-bottom:14px;">Lease Summary</div>
              <table style="width:100%;border-collapse:collapse;font-size:13px;">
                <tr><td style="padding:6px 0;color:#5c4a3a;border-bottom:1px solid rgba(0,0,0,.06);">Property</td><td style="padding:6px 0;font-weight:700;text-align:right;border-bottom:1px solid rgba(0,0,0,.06);">${property}</td></tr>
                <tr><td style="padding:6px 0;color:#5c4a3a;border-bottom:1px solid rgba(0,0,0,.06);">Room</td><td style="padding:6px 0;font-weight:700;text-align:right;border-bottom:1px solid rgba(0,0,0,.06);">${room}</td></tr>
                <tr><td style="padding:6px 0;color:#5c4a3a;border-bottom:1px solid rgba(0,0,0,.06);">Monthly Rent</td><td style="padding:6px 0;font-weight:700;text-align:right;color:#2d6a3f;border-bottom:1px solid rgba(0,0,0,.06);">${fmtMoney(rent)}/mo</td></tr>
                <tr><td style="padding:6px 0;color:#5c4a3a;border-bottom:1px solid rgba(0,0,0,.06);">Move-in Date</td><td style="padding:6px 0;font-weight:700;text-align:right;border-bottom:1px solid rgba(0,0,0,.06);">${moveIn || "—"}</td></tr>
                ${leaseEnd ? `<tr><td style="padding:6px 0;color:#5c4a3a;border-bottom:1px solid rgba(0,0,0,.06);">Lease End</td><td style="padding:6px 0;font-weight:700;text-align:right;border-bottom:1px solid rgba(0,0,0,.06);">${leaseEnd}</td></tr>` : ""}
                ${doorCode ? `<tr><td style="padding:6px 0;color:#5c4a3a;border-bottom:1px solid rgba(0,0,0,.06);">Door Code</td><td style="padding:6px 0;font-weight:700;text-align:right;font-family:monospace;letter-spacing:4px;border-bottom:1px solid rgba(0,0,0,.06);">${doorCode}</td></tr>` : ""}
                <tr><td style="padding:6px 0;color:#5c4a3a;">Signed</td><td style="padding:6px 0;font-weight:700;text-align:right;">${executedAt || "Today"}</td></tr>
              </table>
            </div>

            ${chargeRows ? `
            <div style="margin-bottom:20px;">
              <div style="font-size:10px;font-weight:800;color:#2d6a3f;text-transform:uppercase;letter-spacing:1px;padding:6px 12px;background:rgba(74,124,89,.08);border-radius:6px 6px 0 0;">Move-In Charges</div>
              <div style="border:1px solid rgba(74,124,89,.15);border-top:none;border-radius:0 0 8px 8px;padding:0 12px;">
                <table style="width:100%;border-collapse:collapse;">
                  ${buildChargeRows(chargeRows)}
                  <tr>
                    <td style="padding:10px 0 8px;font-size:14px;font-weight:800;border-top:2px solid rgba(74,124,89,.2);">Total Due</td>
                    <td style="padding:10px 0 8px;font-size:14px;font-weight:800;text-align:right;color:#2d6a3f;border-top:2px solid rgba(74,124,89,.2);">${fmtMoney(totalDue)}</td>
                  </tr>
                </table>
              </div>
            </div>` : ""}

            <div style="background:#fff8e6;border:1px solid rgba(212,168,83,.3);border-radius:10px;padding:18px;margin-bottom:20px;">
              <div style="font-size:12px;font-weight:800;color:#9a7422;text-transform:uppercase;letter-spacing:1px;margin-bottom:10px;">⚡ Action Required — Submit Your Security Deposit</div>
              <p style="font-size:13px;color:#5c4a3a;line-height:1.7;margin:0 0 12px;">
                Your room at <strong>${property}</strong> is not fully secured until your security deposit is received. Please log in to your tenant portal to submit payment.
              </p>
              <div style="text-align:center;">
                <a href="${portalUrl}" style="display:inline-block;background:#d4a853;color:#1a1714;padding:12px 28px;border-radius:8px;font-weight:700;font-size:13px;text-decoration:none;">Log In to Tenant Portal →</a>
              </div>
            </div>

            <div style="background:#f5f0e8;border-radius:10px;padding:16px;margin-bottom:20px;">
              <div style="font-size:12px;font-weight:700;color:#9a7422;margin-bottom:8px;">What Happens Next</div>
              <div style="font-size:13px;color:#5c4a3a;line-height:1.8;">
                1. Submit your security deposit via the tenant portal<br/>
                2. Your door code activates at 12:00am on your move-in day once full payment is received<br/>
                3. Move in and enjoy your new home! 🏠
              </div>
            </div>

            <p style="font-size:13px;color:#5c4a3a;line-height:1.7;">
              Questions? Reply to this email or call <strong></strong>.
            </p>
          `),
        }),
      });
      return Response.json({ ok: true });
    }

    // ── PM: lease signed notification (gated by notif prefs) ─────
    if (!notifLeaseSigned) return Response.json({ ok: true, note: "PM notification disabled" });
    const { tenantName, tenantEmail, landlordEmail, property, room, rent, moveIn,
            leaseStart, leaseEnd, sd, proratedRent, executedAt,
            doorCode, chargesGenerated, chargeRows, totalDue } = body;

    // pmEmail already resolved from settings above, use landlordEmail if provided
    const resolvedPmEmail = landlordEmail || pmEmail;

    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: "Black Bear Rentals <hello@rentblackbear.com>",
        to: pmEmail,
        subject: `✍️ Lease Signed — ${tenantName} · ${room} at ${property}`,
        html: wrap(`
          <h2 style="font-size:20px;margin:0 0 6px;">Lease Signed by ${tenantName}</h2>
          <p style="font-size:13px;color:#5c4a3a;margin:0 0 24px;">The tenant has signed their lease. ${chargesGenerated ? `${chargesGenerated} charge(s) have been generated in their ledger.` : ""}</p>

          <div style="background:#f0faf4;border:1px solid #c3e6cb;border-radius:10px;padding:20px;margin-bottom:20px;">
            <div style="font-size:11px;font-weight:700;color:#2d6a3f;text-transform:uppercase;letter-spacing:1px;margin-bottom:14px;">Lease Details</div>
            <table style="width:100%;border-collapse:collapse;font-size:13px;">
              <tr><td style="padding:5px 0;color:#5c4a3a;border-bottom:1px solid rgba(0,0,0,.05);">Tenant</td><td style="padding:5px 0;font-weight:700;text-align:right;border-bottom:1px solid rgba(0,0,0,.05);">${tenantName}</td></tr>
              <tr><td style="padding:5px 0;color:#5c4a3a;border-bottom:1px solid rgba(0,0,0,.05);">Email</td><td style="padding:5px 0;text-align:right;border-bottom:1px solid rgba(0,0,0,.05);">${tenantEmail}</td></tr>
              <tr><td style="padding:5px 0;color:#5c4a3a;border-bottom:1px solid rgba(0,0,0,.05);">Property</td><td style="padding:5px 0;font-weight:700;text-align:right;border-bottom:1px solid rgba(0,0,0,.05);">${property}</td></tr>
              <tr><td style="padding:5px 0;color:#5c4a3a;border-bottom:1px solid rgba(0,0,0,.05);">Room</td><td style="padding:5px 0;font-weight:700;text-align:right;border-bottom:1px solid rgba(0,0,0,.05);">${room}</td></tr>
              <tr><td style="padding:5px 0;color:#5c4a3a;border-bottom:1px solid rgba(0,0,0,.05);">Monthly Rent</td><td style="padding:5px 0;font-weight:700;text-align:right;color:#2d6a3f;border-bottom:1px solid rgba(0,0,0,.05);">${fmtMoney(rent)}/mo</td></tr>
              <tr><td style="padding:5px 0;color:#5c4a3a;border-bottom:1px solid rgba(0,0,0,.05);">Move-in</td><td style="padding:5px 0;font-weight:700;text-align:right;border-bottom:1px solid rgba(0,0,0,.05);">${moveIn || "—"}</td></tr>
              ${doorCode ? `<tr><td style="padding:5px 0;color:#5c4a3a;border-bottom:1px solid rgba(0,0,0,.05);">Door Code</td><td style="padding:5px 0;font-weight:700;text-align:right;font-family:monospace;letter-spacing:4px;border-bottom:1px solid rgba(0,0,0,.05);">${doorCode}</td></tr>` : ""}
              <tr><td style="padding:5px 0;color:#5c4a3a;">Signed</td><td style="padding:5px 0;font-weight:700;text-align:right;">${executedAt || "Today"}</td></tr>
            </table>
          </div>

          ${chargeRows ? `
          <div style="margin-bottom:20px;">
            <div style="font-size:11px;font-weight:700;color:#2d6a3f;text-transform:uppercase;letter-spacing:1px;margin-bottom:8px;">Charges Generated</div>
            <table style="width:100%;border-collapse:collapse;">
              ${chargeRows.split(", ").filter(Boolean).map(row => {
                const [desc, rest=""] = row.split(": $");
                const [amount, due=""] = rest.split(" — due ");
                return `<tr>
                  <td style="padding:6px 0;font-size:13px;border-bottom:1px solid rgba(0,0,0,.05);">
                    <div style="font-weight:600;">${desc}</div>
                    ${due ? `<div style="font-size:11px;color:#4a7c59;">Due ${due}</div>` : ""}
                  </td>
                  <td style="padding:6px 0;font-weight:700;text-align:right;font-size:13px;border-bottom:1px solid rgba(0,0,0,.05);">$${amount || "—"}</td>
                </tr>`;
              }).join("")}
              <tr>
                <td style="padding:10px 0 0;font-size:14px;font-weight:800;border-top:2px solid rgba(74,124,89,.2);">Total Due</td>
                <td style="padding:10px 0 0;font-size:14px;font-weight:800;text-align:right;color:#2d6a3f;border-top:2px solid rgba(74,124,89,.2);">${fmtMoney(totalDue)}</td>
              </tr>
            </table>
          </div>` : ""}

          <p style="font-size:12px;color:#999;">The tenant has been sent a confirmation email with their signed copy, charge summary, and a link to the tenant portal to submit their security deposit.</p>
        `),
      }),
    });

    return Response.json({ ok: true });
  } catch (error) {
    console.error("lease-executed error:", error);
    return Response.json({ ok: false, error: String(error) }, { status: 500 });
  }
}
