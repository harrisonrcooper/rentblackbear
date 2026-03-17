// app/api/apply-notify/route.js
// Emails Harrison when a new application is submitted.
// Requires RESEND_API_KEY in Vercel environment variables.

export async function POST(request) {
  try {
    const { applicantName, applicantEmail, applicantPhone, property, room, moveIn, income, fee, isInvited } = await request.json();

    const resendKey = process.env.RESEND_API_KEY;
    if (!resendKey) return Response.json({ ok: true, note: "No Resend key — email skipped" });

    const adminEmail = process.env.ADMIN_EMAIL || "harrison@rentblackbear.com";

    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: "Black Bear Rentals <hello@rentblackbear.com>",
        to: adminEmail,
        subject: `🎉 New Application — ${applicantName}`,
        html: `
          <div style="font-family:'Helvetica Neue',Arial,sans-serif;max-width:560px;margin:0 auto;color:#1a1714;">
            <div style="background:#1a1714;padding:24px 28px;border-radius:12px 12px 0 0;">
              <div style="font-family:Georgia,serif;font-size:20px;color:#d4a853;font-weight:700;">🐻 Black Bear Rentals</div>
              <div style="font-size:12px;color:#c4a882;margin-top:3px;">Admin Notification</div>
            </div>
            <div style="background:#ffffff;padding:28px;border:1px solid #e8e5e0;border-top:none;border-radius:0 0 12px 12px;">
              <h2 style="font-size:20px;margin:0 0 6px;color:#1a1714;">New Application Received</h2>
              <p style="font-size:13px;color:#5c4a3a;margin:0 0 20px;">${isInvited ? "An invited applicant" : "A walk-in applicant"} has submitted their full application.</p>

              <div style="background:#f0faf4;border:1px solid #c3e6cb;border-radius:10px;padding:18px;margin-bottom:18px;">
                <div style="font-size:11px;font-weight:700;color:#2d6a3f;text-transform:uppercase;letter-spacing:1px;margin-bottom:12px;">Applicant</div>
                <table style="width:100%;border-collapse:collapse;font-size:13px;">
                  <tr><td style="padding:5px 0;color:#5c4a3a;border-bottom:1px solid rgba(0,0,0,.05);width:40%">Name</td><td style="padding:5px 0;font-weight:700;border-bottom:1px solid rgba(0,0,0,.05)">${applicantName}</td></tr>
                  <tr><td style="padding:5px 0;color:#5c4a3a;border-bottom:1px solid rgba(0,0,0,.05)">Email</td><td style="padding:5px 0;border-bottom:1px solid rgba(0,0,0,.05)"><a href="mailto:${applicantEmail}" style="color:#d4a853">${applicantEmail}</a></td></tr>
                  <tr><td style="padding:5px 0;color:#5c4a3a;border-bottom:1px solid rgba(0,0,0,.05)">Phone</td><td style="padding:5px 0;border-bottom:1px solid rgba(0,0,0,.05)"><a href="tel:${(applicantPhone||'').replace(/\D/g,'')}" style="color:#d4a853">${applicantPhone}</a></td></tr>
                  <tr><td style="padding:5px 0;color:#5c4a3a;border-bottom:1px solid rgba(0,0,0,.05)">Income</td><td style="padding:5px 0;border-bottom:1px solid rgba(0,0,0,.05)">${income}</td></tr>
                  <tr><td style="padding:5px 0;color:#5c4a3a;">Type</td><td style="padding:5px 0;font-weight:600;color:${isInvited?"#27500a":"#633806"}">${isInvited ? "✓ Invited applicant" : "Walk-in (no invite)"}</td></tr>
                </table>
              </div>

              <div style="background:#f5f0e8;border-radius:10px;padding:18px;margin-bottom:20px;">
                <div style="font-size:11px;font-weight:700;color:#9a7422;text-transform:uppercase;letter-spacing:1px;margin-bottom:12px;">Room Request</div>
                <table style="width:100%;border-collapse:collapse;font-size:13px;">
                  <tr><td style="padding:5px 0;color:#5c4a3a;border-bottom:1px solid rgba(0,0,0,.05);width:40%">Property</td><td style="padding:5px 0;font-weight:700;border-bottom:1px solid rgba(0,0,0,.05)">${property}</td></tr>
                  <tr><td style="padding:5px 0;color:#5c4a3a;border-bottom:1px solid rgba(0,0,0,.05)">Room</td><td style="padding:5px 0;border-bottom:1px solid rgba(0,0,0,.05)">${room}</td></tr>
                  <tr><td style="padding:5px 0;color:#5c4a3a;">Move-in</td><td style="padding:5px 0">${moveIn}</td></tr>
                </table>
              </div>

              <div style="text-align:center;margin-bottom:20px;">
                <a href="https://rentblackbear.vercel.app/admin" style="display:inline-block;background:#d4a853;color:#1a1714;padding:12px 28px;border-radius:8px;font-weight:700;font-size:13px;text-decoration:none;">Review in Admin →</a>
              </div>

              <p style="font-size:11px;color:#999;margin:0;text-align:center;">
                Black Bear Rentals · Huntsville, Alabama · <a href="https://rentblackbear.com" style="color:#d4a853;">rentblackbear.com</a>
              </p>
            </div>
          </div>
        `,
      }),
    });

    return Response.json({ ok: true });
  } catch (error) {
    console.error("apply-notify error:", error);
    return Response.json({ ok: false, error: "Server error" }, { status: 500 });
  }
}
