import { Resend } from "resend";
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req) {
  try {
    const {
      tenantName, tenantEmail, landlordEmail,
      property, room, rent, moveIn,
      leaseStart, leaseEnd, sd, proratedRent, executedAt
    } = await req.json();

    const fmtDate = (d) => {
      if (!d) return "—";
      try { return new Date(d + "T00:00:00").toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }); }
      catch { return d; }
    };

    const fmtMoney = (n) => n ? "$" + Number(n).toLocaleString() : "—";
    const isFirstDay = moveIn ? new Date(moveIn + "T00:00:00").getDate() === 1 : true;
    const totalDue = (sd || 0) + (isFirstDay ? (rent || 0) : (proratedRent || 0));

    // Email to Property Manager
    await resend.emails.send({
      from: "Black Bear Rentals <info@rentblackbear.com>",
      to: landlordEmail || "info@rentblackbear.com",
      subject: `✍️ Lease Signed — ${tenantName} · ${room} at ${property}`,
      html: `
        <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto; color: #1a1714;">
          <div style="background: #1a1714; padding: 24px; border-radius: 12px 12px 0 0;">
            <div style="font-size: 22px; font-weight: 800; color: #f5f0e8;">🐻 Black Bear Rentals</div>
            <div style="color: #d4a853; font-size: 13px; margin-top: 4px;">Lease Executed</div>
          </div>
          <div style="background: #fff; padding: 24px; border: 1px solid #eee; border-top: none; border-radius: 0 0 12px 12px;">
            <h2 style="font-size: 18px; margin: 0 0 16px;">✅ ${tenantName} signed their lease</h2>
            <p style="color: #666; font-size: 13px; margin: 0 0 20px;">Executed on <strong>${executedAt}</strong>. Both parties have signed.</p>

            <table style="width: 100%; border-collapse: collapse; font-size: 13px; margin-bottom: 20px;">
              <tr style="background: #f9f8f5;"><td style="padding: 8px 12px; font-weight: 600; border-bottom: 1px solid #eee;">Tenant</td><td style="padding: 8px 12px; border-bottom: 1px solid #eee;">${tenantName}</td></tr>
              <tr><td style="padding: 8px 12px; font-weight: 600; border-bottom: 1px solid #eee;">Property</td><td style="padding: 8px 12px; border-bottom: 1px solid #eee;">${property}</td></tr>
              <tr style="background: #f9f8f5;"><td style="padding: 8px 12px; font-weight: 600; border-bottom: 1px solid #eee;">Room</td><td style="padding: 8px 12px; border-bottom: 1px solid #eee;">${room}</td></tr>
              <tr><td style="padding: 8px 12px; font-weight: 600; border-bottom: 1px solid #eee;">Monthly Rent</td><td style="padding: 8px 12px; border-bottom: 1px solid #eee; color: #d4a853; font-weight: 700;">${fmtMoney(rent)}/mo</td></tr>
              <tr style="background: #f9f8f5;"><td style="padding: 8px 12px; font-weight: 600; border-bottom: 1px solid #eee;">Move-in</td><td style="padding: 8px 12px; border-bottom: 1px solid #eee;">${fmtDate(moveIn)}</td></tr>
              <tr><td style="padding: 8px 12px; font-weight: 600; border-bottom: 1px solid #eee;">Lease Term</td><td style="padding: 8px 12px; border-bottom: 1px solid #eee;">${fmtDate(leaseStart)} → ${fmtDate(leaseEnd)}</td></tr>
              <tr style="background: #f9f8f5;"><td style="padding: 8px 12px; font-weight: 600;">Total Due at Move-In</td><td style="padding: 8px 12px; font-weight: 800; color: #4a7c59;">${fmtMoney(totalDue)}</td></tr>
            </table>

            <div style="background: #f9f8f5; border-radius: 8px; padding: 14px; margin-bottom: 20px; font-size: 12px; color: #666;">
              <strong>⏭ Next steps:</strong> Collect security deposit (${fmtMoney(sd)}) + first month/prorated rent (${fmtMoney(isFirstDay ? rent : proratedRent)}) to complete onboarding. Once paid, activate door code.
            </div>

            <a href="https://rentblackbear.vercel.app/admin" style="display: inline-block; background: #1a1714; color: #d4a853; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: 700; font-size: 13px;">View in Admin →</a>
          </div>
        </div>
      `,
    });

    // Confirmation email to tenant
    await resend.emails.send({
      from: "Black Bear Rentals <info@rentblackbear.com>",
      to: tenantEmail,
      subject: `Your lease is signed — Welcome to ${property}! 🎉`,
      html: `
        <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto; color: #1a1714;">
          <div style="background: #1a1714; padding: 24px; border-radius: 12px 12px 0 0;">
            <div style="font-size: 22px; font-weight: 800; color: #f5f0e8;">🐻 Black Bear Rentals</div>
            <div style="color: #d4a853; font-size: 13px; margin-top: 4px;">Lease Confirmation</div>
          </div>
          <div style="background: #fff; padding: 24px; border: 1px solid #eee; border-top: none; border-radius: 0 0 12px 12px;">
            <h2 style="font-size: 18px; margin: 0 0 8px;">Hi ${tenantName} — you're all signed! ✅</h2>
            <p style="color: #666; font-size: 13px; margin: 0 0 20px;">Your lease for <strong>${room} at ${property}</strong> has been fully executed on <strong>${executedAt}</strong>.</p>

            <table style="width: 100%; border-collapse: collapse; font-size: 13px; margin-bottom: 20px;">
              <tr style="background: #f9f8f5;"><td style="padding: 8px 12px; font-weight: 600; border-bottom: 1px solid #eee;">Property</td><td style="padding: 8px 12px; border-bottom: 1px solid #eee;">${property}</td></tr>
              <tr><td style="padding: 8px 12px; font-weight: 600; border-bottom: 1px solid #eee;">Room</td><td style="padding: 8px 12px; border-bottom: 1px solid #eee;">${room}</td></tr>
              <tr style="background: #f9f8f5;"><td style="padding: 8px 12px; font-weight: 600; border-bottom: 1px solid #eee;">Monthly Rent</td><td style="padding: 8px 12px; border-bottom: 1px solid #eee; color: #d4a853; font-weight: 700;">${fmtMoney(rent)}/mo</td></tr>
              <tr><td style="padding: 8px 12px; font-weight: 600; border-bottom: 1px solid #eee;">Move-in Date</td><td style="padding: 8px 12px; border-bottom: 1px solid #eee;">${fmtDate(moveIn)}</td></tr>
              <tr style="background: #f9f8f5;"><td style="padding: 8px 12px; font-weight: 600; border-bottom: 1px solid #eee;">Lease Ends</td><td style="padding: 8px 12px; border-bottom: 1px solid #eee;">${fmtDate(leaseEnd)}</td></tr>
              <tr><td style="padding: 8px 12px; font-weight: 600;">Security Deposit</td><td style="padding: 8px 12px;">${fmtMoney(sd)}</td></tr>
            </table>

            <div style="background: #f0f9f4; border: 1px solid #c8e6d0; border-radius: 8px; padding: 14px; margin-bottom: 20px; font-size: 12px; color: #2d6a3f;">
              <strong>📋 What happens next:</strong>
              <ol style="margin: 8px 0 0; padding-left: 16px; line-height: 1.8;">
                <li>Pay your security deposit of <strong>${fmtMoney(sd)}</strong></li>
                <li>Pay ${isFirstDay ? "first month's rent" : "prorated rent"} of <strong>${fmtMoney(isFirstDay ? rent : proratedRent)}</strong> by move-in</li>
                <li>Your door code activates at 12:00am on <strong>${fmtDate(moveIn)}</strong> once payment is received</li>
                <li>Review our house rules in your resident portal</li>
              </ol>
            </div>

            <p style="font-size: 12px; color: #999; margin: 0;">Questions? Reply to this email or contact us at info@rentblackbear.com · (850) 696-8070</p>
          </div>
        </div>
      `,
    });

    return Response.json({ success: true });
  } catch (e) {
    console.error("lease-executed email error:", e);
    return Response.json({ error: e.message }, { status: 500 });
  }
}
