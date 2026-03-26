// app/api/invite/route.js
// Sends a personal application invite email via Resend.
// Requires RESEND_API_KEY in Vercel environment variables.

import { getSettings, fromAddress } from "@/lib/getSettings";

export async function POST(request) {
  try {
    const { to, name, link, property, address, room, rent, fee, note, waived } = await request.json();
    const propFull = address ? `${property} — ${address}` : property;

    if (!to || !name || !link) {
      return Response.json({ ok: false, error: "Missing required fields" }, { status: 400 });
    }

    const resendKey = process.env.RESEND_API_KEY;
    if (!resendKey) {
      return Response.json({ ok: false, error: "RESEND_API_KEY not configured in Vercel environment variables" }, { status: 500 });
    }

    const s = await getSettings();
    const firstName = name.split(" ")[0];
    const feeWaived = !fee || fee === 0;
    const hasWaived = waived && waived.length > 0;

    const roomLine = room && property
      ? `<tr><td style="padding:8px 0;border-bottom:1px solid #e8e5e0;color:#666;font-size:13px;">Room</td><td style="padding:8px 0;border-bottom:1px solid #e8e5e0;font-weight:700;text-align:right;font-size:13px;">${room} at ${propFull}${rent ? ` — $${rent.toLocaleString()}/mo` : ""}</td></tr>`
      : property
      ? `<tr><td style="padding:8px 0;border-bottom:1px solid #e8e5e0;color:#666;font-size:13px;">Property</td><td style="padding:8px 0;border-bottom:1px solid #e8e5e0;font-weight:700;text-align:right;font-size:13px;">${propFull}</td></tr>`
      : "";

    const feeLine = feeWaived
      ? `<tr><td style="padding:8px 0;color:#666;font-size:13px;">Screening Fee</td><td style="padding:8px 0;font-weight:700;text-align:right;font-size:13px;color:#4a7c59;">Waived ✓</td></tr>`
      : `<tr><td style="padding:8px 0;color:#666;font-size:13px;">Screening Fee</td><td style="padding:8px 0;font-weight:700;text-align:right;font-size:13px;">$${fee} (paid at end)</td></tr>`;

    const waivedNote = hasWaived
      ? `<div style="background:#f0faf4;border:1px solid #c3e6cb;border-radius:8px;padding:12px 16px;margin-bottom:20px;font-size:12px;color:#2d6a3f;"><strong>Fast-Track Application:</strong> The following have been waived for you: ${waived.join(", ")}.</div>`
      : "";

    const personalNote = note
      ? `<div style="background:#f5f0e8;border-left:3px solid #d4a853;padding:12px 16px;margin-bottom:20px;font-size:13px;color:#5c4a3a;font-style:italic;">"${note}"</div>`
      : "";

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: fromAddress(s),
        to,
        subject: `You're invited to apply — Black Bear Rentals 🐻`,
        html: `
          <div style="font-family:'Helvetica Neue',Arial,sans-serif;max-width:580px;margin:0 auto;color:#1a1714;">

            <!-- Header -->
            <div style="background:#1a1714;padding:28px 32px;border-radius:12px 12px 0 0;">
              <div style="font-family:Georgia,serif;font-size:22px;color:#d4a853;font-weight:700;margin-bottom:4px;">🐻 Black Bear Rentals</div>
              <div style="font-size:12px;color:#c4a882;">Huntsville, Alabama</div>
            </div>

            <!-- Body -->
            <div style="background:#ffffff;padding:32px;border:1px solid #e8e5e0;border-top:none;border-radius:0 0 12px 12px;">

              <h2 style="font-size:24px;margin:0 0 8px;color:#1a1714;">Hey ${firstName}, you're invited!</h2>
              <p style="font-size:14px;color:#5c4a3a;line-height:1.7;margin-bottom:24px;">
                Great speaking with you. I'd love to have you as part of the Black Bear community — you're officially invited to apply for a room.
              </p>

              ${personalNote}

              <!-- Room / fee details -->
              <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
                ${roomLine}
                ${feeLine}
              </table>

              ${waivedNote}

              <!-- CTA -->
              <div style="text-align:center;margin:28px 0;">
                <a href="${link}" style="display:inline-block;background:#d4a853;color:#1a1714;padding:16px 40px;border-radius:10px;font-weight:800;font-size:16px;text-decoration:none;letter-spacing:.3px;">Apply Now →</a>
                <div style="margin-top:10px;font-size:11px;color:#999;">Or copy this link: <span style="color:#3b82f6;">${link}</span></div>
              </div>

              <!-- What to expect -->
              <div style="background:#f5f0e8;border-radius:10px;padding:18px;margin-bottom:24px;">
                <div style="font-size:11px;font-weight:700;color:#9a7422;text-transform:uppercase;letter-spacing:1px;margin-bottom:12px;">What to Expect</div>
                ${[
                  ["📝", "Fill out the application (about 10–15 min)"],
                  ["🔍", feeWaived ? "Background check waived for you" : `Pay $${fee} screening fee at the end`],
                  ["⚡", "We review and get back to you within 24 hours"],
                  ["✍️", "If approved, you'll sign a lease and lock in your room"],
                ].map(([ic, t]) => `
                  <div style="display:flex;align-items:flex-start;gap:10px;font-size:13px;color:#5c4a3a;margin-bottom:8px;">
                    <span style="font-size:15px;flex-shrink:0;">${ic}</span>${t}
                  </div>`).join("")}
              </div>

              <p style="font-size:13px;color:#5c4a3a;line-height:1.7;margin-bottom:6px;">
                Questions? Just reply to this email or call/text us at <strong>(850) 696-8101</strong>.
              </p>
              <p style="font-size:13px;color:#5c4a3a;">Looking forward to having you!</p>
              <p style="font-size:13px;color:#5c4a3a;margin-top:16px;">— Black Bear Properties</p>

              <hr style="margin:24px 0;border:none;border-top:1px solid #e8e5e0;"/>
              <p style="font-size:10px;color:#bbb;margin:0;">
                This invite was sent to ${to} · <a href="https://rentblackbear.com" style="color:#d4a853;">rentblackbear.com</a>
              </p>
            </div>
          </div>
        `,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      console.error("Resend error:", data);
      return Response.json({ ok: false, error: data?.message || "Resend rejected the request" }, { status: 500 });
    }

    return Response.json({ ok: true, id: data.id });
  } catch (error) {
    console.error("Invite route error:", error);
    return Response.json({ ok: false, error: "Server error" }, { status: 500 });
  }
}
