// app/api/apply-notify/route.js
// PM notification when a new application is received.

export async function POST(request) {
  try {
    const body = await request.json();
    const { applicantName, applicantEmail, applicantPhone, property, room, moveIn, income, fee, isInvited, doorCode } = body;

    const resendKey = process.env.RESEND_API_KEY;
    if (!resendKey) return Response.json({ ok: true, note: "No Resend key — email skipped" });

    // Read PM settings from Supabase to check notification prefs + get email/phone
    const SUPA_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://vxysaclhucdjxzcknoar.supabase.co";
    const SUPA_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ4eXNhY2xodWNkanh6Y2tub2FyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMyNzA5NTEsImV4cCI6MjA4ODg0Njk1MX0.AiAkd5eZZm8ztaUsfGUj-XF7zL_mwCTy7bAGF-mqmoM";
    let pmEmail = body.to || "info@rentblackbear.com";
    let pmPhone = "(850) 696-8101";
    let notifEnabled = true;
    try {
      const sr = await fetch(`${SUPA_URL}/rest/v1/app_data?key=eq.hq-settings&select=value`, {
        headers: { apikey: SUPA_KEY, Authorization: `Bearer ${SUPA_KEY}` }
      });
      const sd = await sr.json();
      const s = sd?.[0]?.value;
      if (s) {
        if (s.email) pmEmail = s.email;
        if (s.phone) pmPhone = s.phone;
        if (s.notifAppReceived === false) notifEnabled = false;
      }
    } catch {}

    if (!notifEnabled) return Response.json({ ok: true, note: "PM notification disabled in settings" });

    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: "Black Bear Rentals <hello@rentblackbear.com>",
        to: pmEmail,
        subject: `📋 New Application — ${applicantName}${property ? " · " + property : ""}`,
        html: `
          <div style="font-family:'Helvetica Neue',Arial,sans-serif;max-width:560px;margin:0 auto;color:#1a1714;">
            <div style="background:#1a1714;padding:24px 32px;border-radius:12px 12px 0 0;">
              <div style="font-family:Georgia,serif;font-size:20px;color:#d4a853;font-weight:700;">🐻 Black Bear Rentals</div>
            </div>
            <div style="background:#fff;padding:28px 32px;border:1px solid #e8e5e0;border-top:none;border-radius:0 0 12px 12px;">
              <h2 style="font-size:20px;margin:0 0 6px;">New Application Received</h2>
              <p style="font-size:13px;color:#5c4a3a;margin:0 0 20px;">${isInvited ? "Invited applicant" : "Walk-in applicant"} submitted a full application${property ? ` for ${property}` : ""}.</p>

              <div style="background:#f0faf4;border:1px solid #c3e6cb;border-radius:10px;padding:16px;margin-bottom:20px;">
                <div style="font-size:10px;font-weight:800;color:#2d6a3f;text-transform:uppercase;letter-spacing:1px;margin-bottom:12px;">Applicant Details</div>
                <table style="width:100%;border-collapse:collapse;font-size:13px;">
                  <tr><td style="padding:5px 0;color:#5c4a3a;border-bottom:1px solid rgba(0,0,0,.05);">Name</td><td style="padding:5px 0;font-weight:700;text-align:right;border-bottom:1px solid rgba(0,0,0,.05);">${applicantName}</td></tr>
                  <tr><td style="padding:5px 0;color:#5c4a3a;border-bottom:1px solid rgba(0,0,0,.05);">Email</td><td style="padding:5px 0;text-align:right;border-bottom:1px solid rgba(0,0,0,.05);">${applicantEmail}</td></tr>
                  <tr><td style="padding:5px 0;color:#5c4a3a;border-bottom:1px solid rgba(0,0,0,.05);">Phone</td><td style="padding:5px 0;text-align:right;border-bottom:1px solid rgba(0,0,0,.05);">${applicantPhone || "—"}</td></tr>
                  <tr><td style="padding:5px 0;color:#5c4a3a;border-bottom:1px solid rgba(0,0,0,.05);">Property</td><td style="padding:5px 0;font-weight:700;text-align:right;border-bottom:1px solid rgba(0,0,0,.05);">${property || "Not specified"}</td></tr>
                  ${room && room !== "Not specified" ? `<tr><td style="padding:5px 0;color:#5c4a3a;border-bottom:1px solid rgba(0,0,0,.05);">Room</td><td style="padding:5px 0;font-weight:700;text-align:right;border-bottom:1px solid rgba(0,0,0,.05);">${room}</td></tr>` : ""}
                  <tr><td style="padding:5px 0;color:#5c4a3a;border-bottom:1px solid rgba(0,0,0,.05);">Move-in</td><td style="padding:5px 0;text-align:right;border-bottom:1px solid rgba(0,0,0,.05);">${moveIn || "Flexible"}</td></tr>
                  <tr><td style="padding:5px 0;color:#5c4a3a;border-bottom:1px solid rgba(0,0,0,.05);">Income</td><td style="padding:5px 0;text-align:right;border-bottom:1px solid rgba(0,0,0,.05);">${income || "Not provided"}</td></tr>
                  ${doorCode ? `<tr><td style="padding:5px 0;color:#5c4a3a;border-bottom:1px solid rgba(0,0,0,.05);">Door Code</td><td style="padding:5px 0;font-weight:700;text-align:right;font-family:monospace;letter-spacing:4px;border-bottom:1px solid rgba(0,0,0,.05);">${doorCode}</td></tr>` : ""}
                  <tr><td style="padding:5px 0;color:#5c4a3a;">Screening Fee</td><td style="padding:5px 0;text-align:right;">$${fee || 59}</td></tr>
                </table>
              </div>

              <div style="text-align:center;">
                <a href="https://rentblackbear.com/admin" style="display:inline-block;background:#d4a853;color:#1a1714;padding:12px 28px;border-radius:8px;font-weight:700;font-size:13px;text-decoration:none;">Review in Admin →</a>
              </div>

              <hr style="margin:24px 0;border:none;border-top:1px solid #e8e5e0;"/>
              <p style="font-size:11px;color:#999;margin:0;">— Black Bear Rentals · <a href="https://rentblackbear.com" style="color:#d4a853;">rentblackbear.com</a></p>
            </div>
          </div>
        `,
      }),
    });

    return Response.json({ ok: true });
  } catch (error) {
    console.error("apply-notify error:", error);
    return Response.json({ ok: false, error: String(error) }, { status: 500 });
  }
}
