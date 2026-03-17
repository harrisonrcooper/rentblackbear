// app/api/apply-confirm/route.js
import { getSettings, emailWrap, fromAddress } from "@/lib/getSettings";

export async function POST(request) {
  try {
    const { name, email, property, room, rent, fee } = await request.json();
    if (!email) return Response.json({ ok:false, error:"No email" }, { status:400 });
    const resendKey = process.env.RESEND_API_KEY;
    if (!resendKey) return Response.json({ ok:true, note:"No Resend key" });
    const s = await getSettings();
    const firstName = name ? name.split(" ")[0] : "there";

    await fetch("https://api.resend.com/emails", {
      method:"POST", headers:{Authorization:`Bearer ${resendKey}`,"Content-Type":"application/json"},
      body: JSON.stringify({
        from: fromAddress(s), to: email,
        subject: `Application Received — ${s.companyName} 🐻`,
        html: emailWrap(`
          <h2 style="font-size:22px;margin:0 0 12px;color:#1a1714;">Application Received!</h2>
          <p style="font-size:14px;color:#5c4a3a;line-height:1.7;margin-bottom:20px;">
            Hey ${firstName}! We've received your full application and screening fee payment.
            ${property?`You applied for <strong>${room||"a room"}</strong> at <strong>${property}</strong>${rent?` ($${rent}/mo)`:""}.`:""}
          </p>
          <div style="background:#f5f0e8;border-radius:10px;padding:18px;margin-bottom:24px;">
            <div style="font-size:12px;font-weight:700;color:#9a7422;text-transform:uppercase;letter-spacing:1px;margin-bottom:12px;">What Happens Next</div>
            ${[
              ["1","Background &amp; credit check processing (24–48 hrs)"],
              ["2","We review your application and contact your references"],
              ["3","You'll receive our decision by email"],
              ["4","If approved — lease sent for e-signing, then move in!"],
            ].map(([n,t])=>`
              <div style="display:flex;align-items:flex-start;gap:10px;font-size:13px;color:#5c4a3a;margin-bottom:10px;">
                <span style="background:#d4a853;color:#1a1714;width:22px;height:22px;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font-weight:800;font-size:11px;flex-shrink:0;">${n}</span>
                ${t}
              </div>`).join("")}
          </div>
          <div style="background:#f9f9f7;border:1px solid #e8e5e0;border-radius:8px;padding:14px;margin-bottom:24px;font-size:12px;color:#999;">
            <strong style="color:#5c4a3a;">Screening fee paid:</strong> $${fee||59} — applied to your background check and credit report processing.
          </div>
          <p style="font-size:13px;color:#5c4a3a;line-height:1.7;margin-bottom:20px;">
            Questions? Reply to this email or call us at <strong>${s.phone}</strong>. We typically respond within a few hours.
          </p>
          <div style="text-align:center;">
            <a href="${s.siteUrl}" style="display:inline-block;background:#d4a853;color:#1a1714;padding:12px 28px;border-radius:8px;font-weight:700;font-size:13px;text-decoration:none;">Visit ${s.siteUrl.replace("https://","")} →</a>
          </div>
        `, s),
      }),
    });
    return Response.json({ ok:true });
  } catch (err) {
    console.error("apply-confirm error:", err);
    return Response.json({ ok:false, error:String(err) }, { status:500 });
  }
}
