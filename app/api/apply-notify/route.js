// app/api/apply-notify/route.js
import { getSettings, emailWrap, fromAddress } from "@/lib/getSettings";

export async function POST(request) {
  try {
    const body = await request.json();
    const { applicantName, applicantEmail, applicantPhone, property, room, moveIn, income, fee, isInvited, doorCode } = body;
    const resendKey = process.env.RESEND_API_KEY;
    if (!resendKey) return Response.json({ ok:true, note:"No Resend key" });
    const s = await getSettings();
    if (s.notifAppReceived===false) return Response.json({ ok:true, note:"Notification disabled" });

    await fetch("https://api.resend.com/emails", {
      method:"POST", headers:{Authorization:`Bearer ${resendKey}`,"Content-Type":"application/json"},
      body: JSON.stringify({
        from: fromAddress(s), to: s.email,
        subject: `📋 New Application — ${applicantName}${property?" · "+property:""}`,
        html: emailWrap(`
          <h2 style="font-size:20px;margin:0 0 6px;">New Application Received</h2>
          <p style="font-size:13px;color:#5c4a3a;margin:0 0 20px;">${isInvited?"Invited applicant":"Walk-in applicant"} submitted a full application${property?" for "+property:""}.</p>
          <div style="background:#f0faf4;border:1px solid #c3e6cb;border-radius:10px;padding:16px;margin-bottom:20px;">
            <div style="font-size:10px;font-weight:800;color:#2d6a3f;text-transform:uppercase;letter-spacing:1px;margin-bottom:12px;">Applicant Details</div>
            <table style="width:100%;border-collapse:collapse;font-size:13px;">
              <tr><td style="padding:5px 0;color:#5c4a3a;border-bottom:1px solid rgba(0,0,0,.05);">Name</td><td style="padding:5px 0;font-weight:700;text-align:right;border-bottom:1px solid rgba(0,0,0,.05);">${applicantName}</td></tr>
              <tr><td style="padding:5px 0;color:#5c4a3a;border-bottom:1px solid rgba(0,0,0,.05);">Email</td><td style="padding:5px 0;text-align:right;border-bottom:1px solid rgba(0,0,0,.05);">${applicantEmail}</td></tr>
              <tr><td style="padding:5px 0;color:#5c4a3a;border-bottom:1px solid rgba(0,0,0,.05);">Phone</td><td style="padding:5px 0;text-align:right;border-bottom:1px solid rgba(0,0,0,.05);">${applicantPhone||"—"}</td></tr>
              <tr><td style="padding:5px 0;color:#5c4a3a;border-bottom:1px solid rgba(0,0,0,.05);">Property</td><td style="padding:5px 0;font-weight:700;text-align:right;border-bottom:1px solid rgba(0,0,0,.05);">${property||"Not specified"}</td></tr>
              ${room&&room!=="Not specified"?`<tr><td style="padding:5px 0;color:#5c4a3a;border-bottom:1px solid rgba(0,0,0,.05);">Room</td><td style="padding:5px 0;font-weight:700;text-align:right;border-bottom:1px solid rgba(0,0,0,.05);">${room}</td></tr>`:""}
              <tr><td style="padding:5px 0;color:#5c4a3a;border-bottom:1px solid rgba(0,0,0,.05);">Move-in</td><td style="padding:5px 0;text-align:right;border-bottom:1px solid rgba(0,0,0,.05);">${moveIn||"Flexible"}</td></tr>
              <tr><td style="padding:5px 0;color:#5c4a3a;border-bottom:1px solid rgba(0,0,0,.05);">Income</td><td style="padding:5px 0;text-align:right;border-bottom:1px solid rgba(0,0,0,.05);">${income||"Not provided"}</td></tr>
              ${doorCode?`<tr><td style="padding:5px 0;color:#5c4a3a;border-bottom:1px solid rgba(0,0,0,.05);">Door Code</td><td style="padding:5px 0;font-weight:700;text-align:right;font-family:monospace;letter-spacing:4px;border-bottom:1px solid rgba(0,0,0,.05);">${doorCode}</td></tr>`:""}
              <tr><td style="padding:5px 0;color:#5c4a3a;">Screening Fee</td><td style="padding:5px 0;text-align:right;">$${fee||59}</td></tr>
            </table>
          </div>
          <div style="text-align:center;">
            <a href="${s.siteUrl}/admin" style="display:inline-block;background:#d4a853;color:#1a1714;padding:12px 28px;border-radius:8px;font-weight:700;font-size:13px;text-decoration:none;">Review in Admin →</a>
          </div>
        `, s),
      }),
    });
    return Response.json({ ok:true });
  } catch (err) {
    console.error("apply-notify error:", err);
    return Response.json({ ok:false, error:String(err) }, { status:500 });
  }
}
