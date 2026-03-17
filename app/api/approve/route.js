// app/api/approve/route.js
export async function POST(request) {
  try {
    const body = await request.json();
    const { type } = body;

    const resendKey = process.env.RESEND_API_KEY;
    if (!resendKey) return Response.json({ ok: true, note: "No Resend key — email skipped" });

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

    // Build charge breakdown HTML from chargeList
    const buildChargeBreakdown = (chargeList, structure, proratedAmt, secondMonthLabel, isFirstDay, rent) => {
      if (!chargeList || !chargeList.length) return "";

      const total = chargeList.reduce((s, c) => s + (Number(c.amount) || 0), 0);

      const rows = chargeList.map(c => `
        <tr>
          <td style="padding:8px 0;border-bottom:1px solid rgba(0,0,0,.05);font-size:13px;color:#3d3529;">
            <div style="font-weight:600;">${c.desc || c.label || ""}</div>
            <div style="font-size:11px;color:#4a7c59;margin-top:2px;">Due ${c.due || c.dueDate || "—"}</div>
          </td>
          <td style="padding:8px 0;border-bottom:1px solid rgba(0,0,0,.05);font-weight:700;text-align:right;font-size:13px;">${fmtMoney(c.amount)}</td>
        </tr>`).join("");

      let html = `
        <div style="margin-bottom:16px;">
          <div style="font-size:10px;font-weight:800;color:#2d6a3f;text-transform:uppercase;letter-spacing:1px;padding:6px 12px;background:rgba(74,124,89,.08);border-radius:6px 6px 0 0;">Due Before Move-In</div>
          <div style="border:1px solid rgba(74,124,89,.15);border-top:none;border-radius:0 0 8px 8px;padding:0 12px;">
            <table style="width:100%;border-collapse:collapse;">
              ${rows}
              <tr>
                <td style="padding:10px 0 8px;font-size:14px;font-weight:800;border-top:2px solid rgba(74,124,89,.2);">Total Due Before Move-In</td>
                <td style="padding:10px 0 8px;font-size:14px;font-weight:800;text-align:right;color:#2d6a3f;border-top:2px solid rgba(74,124,89,.2);">${fmtMoney(total)}</td>
              </tr>
            </table>
          </div>
        </div>`;

      // Following month row if applicable
      if (!isFirstDay && secondMonthLabel && (structure === "prorated" || structure === "full") && rent > 0) {
        const followAmt = structure === "prorated" ? Number(rent) : Number(proratedAmt);
        const followLabel = structure === "prorated" ? "Full rent begins" : "2nd month partial rent";
        html += `
          <div style="padding:12px;background:rgba(212,168,83,.06);border:1px solid rgba(212,168,83,.2);border-radius:8px;">
            <div style="font-size:10px;font-weight:800;color:#9a7422;text-transform:uppercase;letter-spacing:1px;margin-bottom:8px;">Following Month — ${secondMonthLabel}</div>
            <table style="width:100%;border-collapse:collapse;">
              <tr>
                <td style="font-size:13px;color:#5c4a3a;">${followLabel}</td>
                <td style="font-size:13px;font-weight:700;text-align:right;">${fmtMoney(followAmt)}</td>
              </tr>
              <tr>
                <td colspan="2" style="font-size:11px;color:#999;padding-top:4px;">Then full ${fmtMoney(rent)}/mo every month after.</td>
              </tr>
            </table>
          </div>`;
      }
      return html;
    };

    // ── TENANT: lease ready to sign ───────────────────────────────
    if (type === "tenant_lease_ready") {
      const { to, name, signingLink, property, room, rent, moveIn, totalDue,
              chargeList, structure, proratedAmt, secondMonthLabel, isFirstDay, landlordName,
              contactPhone } = body;
      const phone = contactPhone || "(850) 696-8101";
      if (!to || !name) return Response.json({ ok: false, error: "Missing fields" }, { status: 400 });
      const firstName = name.split(" ")[0];
      const chargeBreakdown = buildChargeBreakdown(chargeList, structure, proratedAmt, secondMonthLabel, isFirstDay, rent);

      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from: "Black Bear Rentals <hello@rentblackbear.com>",
          to,
          subject: `Your Lease is Ready to Sign — ${room} at ${property}`,
          html: wrap(`
            <div style="text-align:center;margin-bottom:28px;">
              <div style="font-size:48px;margin-bottom:12px;">✍️</div>
              <h2 style="font-size:24px;margin:0 0 8px;color:#1a1714;">Your lease is ready, ${firstName}!</h2>
              <p style="font-size:14px;color:#5c4a3a;margin:0;">Review and sign your lease agreement. The property manager has already signed.</p>
            </div>

            <div style="background:#f0faf4;border:1px solid #c3e6cb;border-radius:10px;padding:20px;margin-bottom:20px;">
              <div style="font-size:11px;font-weight:700;color:#2d6a3f;text-transform:uppercase;letter-spacing:1px;margin-bottom:14px;">Your Room Details</div>
              <table style="width:100%;border-collapse:collapse;font-size:13px;">
                <tr><td style="padding:6px 0;color:#5c4a3a;border-bottom:1px solid rgba(0,0,0,.06);">Room</td><td style="padding:6px 0;font-weight:700;text-align:right;border-bottom:1px solid rgba(0,0,0,.06);">${room}</td></tr>
                <tr><td style="padding:6px 0;color:#5c4a3a;border-bottom:1px solid rgba(0,0,0,.06);">Property</td><td style="padding:6px 0;font-weight:700;text-align:right;border-bottom:1px solid rgba(0,0,0,.06);">${property}</td></tr>
                <tr><td style="padding:6px 0;color:#5c4a3a;border-bottom:1px solid rgba(0,0,0,.06);">Monthly Rent</td><td style="padding:6px 0;font-weight:700;text-align:right;color:#2d6a3f;border-bottom:1px solid rgba(0,0,0,.06);">${rent != null && !isNaN(Number(rent)) ? fmtMoney(rent)+"/mo" : "—"}</td></tr>
                <tr><td style="padding:6px 0;color:#5c4a3a;">Move-in Date</td><td style="padding:6px 0;font-weight:700;text-align:right;">${moveIn}</td></tr>
              </table>
            </div>

            ${chargeBreakdown ? `
            <div style="margin-bottom:20px;">
              <div style="font-size:13px;font-weight:700;color:#1a1714;margin-bottom:10px;">Move-In Cost Breakdown</div>
              ${chargeBreakdown}
            </div>` : ""}

            <div style="text-align:center;margin:24px 0;">
              <a href="${signingLink}" style="display:inline-block;background:#d4a853;color:#1a1714;padding:14px 32px;border-radius:10px;font-weight:700;font-size:15px;text-decoration:none;">✍️ Review &amp; Sign My Lease →</a>
              <div style="font-size:11px;color:#999;margin-top:8px;">Or copy this link: ${signingLink}</div>
            </div>

            <div style="background:#f5f0e8;border-radius:10px;padding:18px;margin-bottom:20px;">
              <div style="font-size:11px;font-weight:700;color:#9a7422;text-transform:uppercase;letter-spacing:1px;margin-bottom:12px;">What Happens Next</div>
              <div style="font-size:13px;color:#5c4a3a;line-height:1.8;">
                1. Review and sign your lease using the button above<br/>
                2. Security deposit + first month's rent due as shown<br/>
                3. Your door code activates at 12:00am on move-in day once payment is received<br/>
                4. Move in and enjoy your new home! 🏠
              </div>
            </div>

            <p style="font-size:13px;color:#5c4a3a;line-height:1.7;">
              Questions? Reply to this email or call <strong>${phone}</strong>. We're excited to have you!
            </p>
          `),
        }),
      });
      return Response.json({ ok: true });
    }

    // ── PM: lease sent summary ────────────────────────────────────
    if (type === "pm_lease_sent") {
      const { to, name, tenantName, tenantEmail, tenantPhone, property, room, bath, sqft,
              rent, moveIn, sd, sdDue, structure, totalDue, signingLink, passcode,
              chargeList, proratedAmt, secondMonthLabel, isFirstDay } = body;
      if (!to) return Response.json({ ok: false, error: "Missing to" }, { status: 400 });
      const chargeBreakdown = buildChargeBreakdown(chargeList, structure, proratedAmt, secondMonthLabel, isFirstDay, rent);

      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from: "Black Bear Rentals <hello@rentblackbear.com>",
          to,
          subject: `✅ Lease Sent — ${tenantName} · ${room} at ${property}`,
          html: wrap(`
            <h2 style="font-size:20px;margin:0 0 6px;">Lease Sent to ${tenantName}</h2>
            <p style="font-size:13px;color:#5c4a3a;margin:0 0 24px;">You signed first. The tenant has been emailed their signing link.</p>

            <div style="background:#f0faf4;border:1px solid #c3e6cb;border-radius:10px;padding:20px;margin-bottom:20px;">
              <div style="font-size:11px;font-weight:700;color:#2d6a3f;text-transform:uppercase;letter-spacing:1px;margin-bottom:14px;">Lease Summary</div>
              <table style="width:100%;border-collapse:collapse;font-size:13px;">
                <tr><td style="padding:5px 0;color:#5c4a3a;border-bottom:1px solid rgba(0,0,0,.05);">Tenant</td><td style="padding:5px 0;font-weight:700;text-align:right;border-bottom:1px solid rgba(0,0,0,.05);">${tenantName}</td></tr>
                <tr><td style="padding:5px 0;color:#5c4a3a;border-bottom:1px solid rgba(0,0,0,.05);">Email</td><td style="padding:5px 0;text-align:right;border-bottom:1px solid rgba(0,0,0,.05);">${tenantEmail}</td></tr>
                <tr><td style="padding:5px 0;color:#5c4a3a;border-bottom:1px solid rgba(0,0,0,.05);">Phone</td><td style="padding:5px 0;text-align:right;border-bottom:1px solid rgba(0,0,0,.05);">${tenantPhone}</td></tr>
                <tr><td style="padding:5px 0;color:#5c4a3a;border-bottom:1px solid rgba(0,0,0,.05);">Room</td><td style="padding:5px 0;font-weight:700;text-align:right;border-bottom:1px solid rgba(0,0,0,.05);">${room}${bath ? " · " + bath : ""}${sqft ? " · " + sqft : ""}</td></tr>
                <tr><td style="padding:5px 0;color:#5c4a3a;border-bottom:1px solid rgba(0,0,0,.05);">Property</td><td style="padding:5px 0;font-weight:700;text-align:right;border-bottom:1px solid rgba(0,0,0,.05);">${property}</td></tr>
                <tr><td style="padding:5px 0;color:#5c4a3a;border-bottom:1px solid rgba(0,0,0,.05);">Monthly Rent</td><td style="padding:5px 0;font-weight:700;text-align:right;color:#2d6a3f;border-bottom:1px solid rgba(0,0,0,.05);">${fmtMoney(rent)}/mo</td></tr>
                <tr><td style="padding:5px 0;color:#5c4a3a;border-bottom:1px solid rgba(0,0,0,.05);">Move-in</td><td style="padding:5px 0;font-weight:700;text-align:right;border-bottom:1px solid rgba(0,0,0,.05);">${moveIn}</td></tr>
                <tr><td style="padding:5px 0;color:#5c4a3a;border-bottom:1px solid rgba(0,0,0,.05);">Door Code</td><td style="padding:5px 0;font-weight:700;text-align:right;border-bottom:1px solid rgba(0,0,0,.05);font-family:monospace;letter-spacing:4px;">${passcode || "Not set"}</td></tr>
                <tr><td style="padding:5px 0;color:#5c4a3a;">Charge Structure</td><td style="padding:5px 0;text-align:right;">${structure === "prorated" ? "Prorated" : structure === "full" ? "Full Month Upfront" : "First + Last Month"}</td></tr>
              </table>
            </div>

            ${chargeBreakdown ? `
            <div style="margin-bottom:20px;">
              <div style="font-size:13px;font-weight:700;color:#1a1714;margin-bottom:10px;">Charge Breakdown (generates on tenant signature)</div>
              ${chargeBreakdown}
            </div>` : ""}

            <div style="padding:12px 16px;background:rgba(59,130,246,.06);border:1px solid rgba(59,130,246,.2);border-radius:8px;margin-bottom:20px;">
              <div style="font-size:11px;font-weight:700;color:#1d4ed8;margin-bottom:4px;">Signing Link</div>
              <div style="font-size:12px;color:#1d4ed8;word-break:break-all;">${signingLink}</div>
            </div>

            <p style="font-size:12px;color:#999;">Charges will auto-generate in the tenant's ledger the moment they sign. You'll receive another email confirmation.</p>
          `),
        }),
      });
      return Response.json({ ok: true });
    }

    // ── LEGACY: original approval email (status move to onboarding) ──
    const { to, name, room, property, rent, moveIn, totalDue } = body;
    if (!to || !name) return Response.json({ ok: false, error: "Missing fields" }, { status: 400 });
    const firstName = name.split(" ")[0];

    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: "Black Bear Rentals <hello@rentblackbear.com>",
        to,
        subject: `You're approved! Welcome to Black Bear Rentals 🐻`,
        html: wrap(`
          <div style="text-align:center;margin-bottom:28px;">
            <div style="font-size:48px;margin-bottom:12px;">🎉</div>
            <h2 style="font-size:24px;margin:0 0 8px;color:#1a1714;">Congratulations, ${firstName}!</h2>
            <p style="font-size:14px;color:#5c4a3a;margin:0;">Your application has been approved.</p>
          </div>

          <div style="background:#f0faf4;border:1px solid #c3e6cb;border-radius:10px;padding:20px;margin-bottom:24px;">
            <div style="font-size:11px;font-weight:700;color:#2d6a3f;text-transform:uppercase;letter-spacing:1px;margin-bottom:14px;">Your Room Details</div>
            <table style="width:100%;border-collapse:collapse;font-size:13px;">
              ${room ? `<tr><td style="padding:6px 0;color:#5c4a3a;border-bottom:1px solid rgba(0,0,0,.06);">Room</td><td style="padding:6px 0;font-weight:700;text-align:right;border-bottom:1px solid rgba(0,0,0,.06);">${room}</td></tr>` : ""}
              ${property ? `<tr><td style="padding:6px 0;color:#5c4a3a;border-bottom:1px solid rgba(0,0,0,.06);">Property</td><td style="padding:6px 0;font-weight:700;text-align:right;border-bottom:1px solid rgba(0,0,0,.06);">${property}</td></tr>` : ""}
              <tr><td style="padding:6px 0;color:#5c4a3a;border-bottom:1px solid rgba(0,0,0,.06);">Monthly Rent</td><td style="padding:6px 0;font-weight:700;text-align:right;color:#2d6a3f;border-bottom:1px solid rgba(0,0,0,.06);">${fmtMoney(rent)}/mo</td></tr>
              ${moveIn ? `<tr><td style="padding:6px 0;color:#5c4a3a;border-bottom:1px solid rgba(0,0,0,.06);">Move-in Date</td><td style="padding:6px 0;font-weight:700;text-align:right;border-bottom:1px solid rgba(0,0,0,.06);">${moveIn}</td></tr>` : ""}
              <tr><td style="padding:6px 0;color:#5c4a3a;">Total Due at Move-in</td><td style="padding:6px 0;font-weight:700;text-align:right;">${fmtMoney(totalDue)}</td></tr>
            </table>
          </div>

          <div style="background:#f5f0e8;border-radius:10px;padding:18px;margin-bottom:24px;">
            <div style="font-size:11px;font-weight:700;color:#9a7422;text-transform:uppercase;letter-spacing:1px;margin-bottom:12px;">What Happens Next</div>
            <div style="font-size:13px;color:#5c4a3a;line-height:1.8;">
              1. We'll send your lease to review and sign<br/>
              2. Security deposit + first month's rent due before move-in<br/>
              3. Access code provided once payment is received<br/>
              4. Move in and enjoy your new home! 🏠
            </div>
          </div>

          <p style="font-size:13px;color:#5c4a3a;line-height:1.7;margin-bottom:20px;">
            We're excited to have you join the Black Bear community! Reply to this email or call <strong>(850) 696-8101</strong> if you have any questions.
          </p>

          <div style="text-align:center;">
            <a href="https://rentblackbear.com" style="display:inline-block;background:#d4a853;color:#1a1714;padding:12px 28px;border-radius:8px;font-weight:700;font-size:13px;text-decoration:none;">Visit rentblackbear.com →</a>
          </div>
        `),
      }),
    });

    return Response.json({ ok: true });
  } catch (error) {
    console.error("Approve route error:", error);
    return Response.json({ ok: false, error: String(error) }, { status: 500 });
  }
}
