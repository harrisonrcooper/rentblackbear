// app/api/approve/route.js
// Sends an approval notification email to the tenant via Resend.
// Requires RESEND_API_KEY in Vercel environment variables.

export async function POST(request) {
  try {
    const { to, name, room, property, rent, moveIn, totalDue } = await request.json();
    if (!to || !name) return Response.json({ ok: false, error: "Missing fields" }, { status: 400 });

    const resendKey = process.env.RESEND_API_KEY;
    if (!resendKey) return Response.json({ ok: true, note: "No Resend key — email skipped" });

    const firstName = name.split(" ")[0];
    const fmtMoney = (n) => n ? `$${Number(n).toLocaleString()}` : "—";

    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: "Harrison at Black Bear Rentals <hello@rentblackbear.com>",
        to,
        subject: `You're approved! Welcome to Black Bear Rentals 🐻`,
        html: `
          <div style="font-family:'Helvetica Neue',Arial,sans-serif;max-width:580px;margin:0 auto;color:#1a1714;">
            <div style="background:#1a1714;padding:28px 32px;border-radius:12px 12px 0 0;">
              <div style="font-family:Georgia,serif;font-size:22px;color:#d4a853;font-weight:700;">🐻 Black Bear Rentals</div>
              <div style="font-size:12px;color:#c4a882;margin-top:4px;">Huntsville, Alabama</div>
            </div>
            <div style="background:#ffffff;padding:32px;border:1px solid #e8e5e0;border-top:none;border-radius:0 0 12px 12px;">
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
                  ${rent ? `<tr><td style="padding:6px 0;color:#5c4a3a;border-bottom:1px solid rgba(0,0,0,.06);">Monthly Rent</td><td style="padding:6px 0;font-weight:700;text-align:right;color:#2d6a3f;border-bottom:1px solid rgba(0,0,0,.06);">${fmtMoney(rent)}/mo</td></tr>` : ""}
                  ${moveIn ? `<tr><td style="padding:6px 0;color:#5c4a3a;border-bottom:1px solid rgba(0,0,0,.06);">Move-in Date</td><td style="padding:6px 0;font-weight:700;text-align:right;border-bottom:1px solid rgba(0,0,0,.06);">${moveIn}</td></tr>` : ""}
                  ${totalDue ? `<tr><td style="padding:6px 0;color:#5c4a3a;">Total Due at Move-in</td><td style="padding:6px 0;font-weight:700;text-align:right;">${fmtMoney(totalDue)}</td></tr>` : ""}
                </table>
              </div>

              <div style="background:#f5f0e8;border-radius:10px;padding:18px;margin-bottom:24px;">
                <div style="font-size:11px;font-weight:700;color:#9a7422;text-transform:uppercase;letter-spacing:1px;margin-bottom:12px;">What Happens Next</div>
                ${[
                  ["✍️", "We'll send your lease to review and sign"],
                  ["💳", `Security deposit + first month's rent (${totalDue ? fmtMoney(totalDue) : "amount on lease"}) due before move-in`],
                  ["🔑", "Access code / keys provided once payment is received"],
                  ["🏠", "Move in and enjoy your new home!"],
                ].map(([ic, t]) => `
                  <div style="display:flex;align-items:flex-start;gap:10px;font-size:13px;color:#5c4a3a;margin-bottom:8px;">
                    <span style="font-size:16px;flex-shrink:0;">${ic}</span>${t}
                  </div>`).join("")}
              </div>

              <p style="font-size:13px;color:#5c4a3a;line-height:1.7;margin-bottom:20px;">
                We're excited to have you join the Black Bear community! Reply to this email or call <strong>(256) 555-0192</strong> if you have any questions.
              </p>

              <div style="text-align:center;">
                <a href="https://rentblackbear.com" style="display:inline-block;background:#d4a853;color:#1a1714;padding:12px 28px;border-radius:8px;font-weight:700;font-size:13px;text-decoration:none;">Visit rentblackbear.com →</a>
              </div>

              <hr style="margin:28px 0;border:none;border-top:1px solid #e8e5e0;"/>
              <p style="font-size:11px;color:#999;margin:0;">
                — Harrison Cooper · Black Bear Rentals · Oak &amp; Main Development LLC<br/>
                Huntsville, Alabama · <a href="https://rentblackbear.com" style="color:#d4a853;">rentblackbear.com</a>
              </p>
            </div>
          </div>
        `,
      }),
    });

    return Response.json({ ok: true });
  } catch (error) {
    console.error("Approve route error:", error);
    return Response.json({ ok: false, error: "Server error" }, { status: 500 });
  }
}
