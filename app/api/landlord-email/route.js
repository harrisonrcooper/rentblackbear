// app/api/landlord-email/route.js
// Sends a landlord reference check email and marks the address as "sent" in applicationData
import { auth } from "@clerk/nextjs/server";
import { getSettings, emailWrap, fromAddress } from "@/lib/getSettings";
import { loadAppData, saveAppData } from "@/lib/supabase-server";

const loadKey = loadAppData;
const saveKey = saveAppData;

function applyTemplate(str, vars) {
  return (str || "").replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? "");
}

export async function POST(request) {
  // Clerk admin gate
  try {
    const { userId } = await auth();
    if (!userId) {
      return Response.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }
  } catch (e) {
    console.error("[landlord-email] Clerk auth() failed:", e?.message || e);
    return Response.json({ ok: false, error: "Auth check failed" }, { status: 500 });
  }

  try {
    const { appId, addrIdx } = await request.json();
    if (!appId || addrIdx === undefined) {
      return Response.json({ ok: false, error: "Missing appId or addrIdx" }, { status: 400 });
    }

    const resendKey = process.env.RESEND_API_KEY;
    if (!resendKey) return Response.json({ ok: false, error: "No Resend key" }, { status: 500 });

    const s = await getSettings();
    const apps = await loadKey("hq-apps", []);
    const app = apps.find(a => a.id === appId);
    if (!app) return Response.json({ ok: false, error: "Application not found" }, { status: 404 });

    const addresses = app.applicationData?.addresses || [];
    const addr = addresses[addrIdx];
    if (!addr) return Response.json({ ok: false, error: "Address not found" }, { status: 404 });
    if (!addr.landlordEmail) return Response.json({ ok: false, error: "No landlord email on this address" }, { status: 400 });

    // Generate unique token
    const token = require('crypto').randomUUID();
    const confirmUrl = `${s.siteUrl}/reference-confirm?token=${token}&appId=${appId}&addrIdx=${addrIdx}&type=landlord`;

    const tpl = s.emailTemplates || {};
    const defSubject = "Landlord Reference — {applicantName}";
    const defBody = `Dear {landlordFirstName},\n\nMy name is {pmName} with {companyName}. I am reaching out because {applicantName} has applied to rent a room at one of my properties and listed {street} as a previous or current residence.\n\nAs part of our standard screening process, I would appreciate your insight on the following:\n\n- Did {applicantName} pay rent on time consistently?\n- Did they take care of the property and leave it in good condition?\n- Would you rent to them again?\n- Is there anything else I should know?\n\nEven a brief reply is greatly appreciated. You can also submit your response using the button below.\n\nThank you for your time.\n\nBest regards,\n{pmName}\n{companyName}\n{pmPhone}`;

    const vars = {
      applicantName:     app.name || "",
      landlordFirstName: addr.landlordFirstName || "",
      landlordLastName:  addr.landlordLastName || "",
      street:            addr.street || "",
      city:              addr.city || "",
      state:             addr.state || "",
      pmName:            s.pmName || s.ownerName || "Property Manager",
      pmPhone:           s.phone || "",
      pmEmail:           s.pmEmail || s.email || "",
      companyName:       s.companyName || "",
    };

    const subject = applyTemplate(tpl.landlordCheckSubject || defSubject, vars);
    const bodyText = applyTemplate(tpl.landlordCheckBody || defBody, vars);
    const bodyHtml = bodyText
      .split("\n\n")
      .map(para => `<p style="font-size:14px;color:#5c4a3a;line-height:1.7;margin:0 0 14px;">${para.replace(/\n/g, "<br/>")}</p>`)
      .join("");

    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: fromAddress(s),
        to: addr.landlordEmail,
        reply_to: s.pmEmail || s.email,
        subject,
        html: emailWrap(`
          <h2 style="font-size:20px;margin:0 0 16px;color:#1a1714;">Landlord Reference Request</h2>
          ${bodyHtml}
          <div style="text-align:center;margin:28px 0;">
            <a href="${confirmUrl}"
              style="display:inline-block;background:#d4a853;color:#1a1714;padding:13px 28px;border-radius:9px;font-weight:700;font-size:14px;text-decoration:none;">
              Submit My Response &rarr;
            </a>
            <div style="font-size:11px;color:#aaa;margin-top:8px;">Or reply directly to this email</div>
          </div>
          <div style="border-top:1px solid rgba(0,0,0,.06);margin-top:20px;padding-top:14px;font-size:11px;color:#aaa;line-height:1.6;">
            This request was sent on behalf of ${vars.pmName} at ${vars.companyName}.<br/>
            Questions? Contact us at ${vars.pmPhone || vars.pmEmail}.
          </div>
        `, s),
      }),
    });

    // Update the address in applicationData with token + sent status
    const updatedAddresses = addresses.map((a, i) => {
      if (i !== addrIdx) return a;
      return { ...a, landlordEmailStatus: "sent", landlordToken: token, landlordSentAt: new Date().toISOString() };
    });
    const updatedApps = apps.map(a => {
      if (a.id !== appId) return a;
      return { ...a, applicationData: { ...(a.applicationData || {}), addresses: updatedAddresses } };
    });
    await saveKey("hq-apps", updatedApps);

    // Notification
    const notifs = await loadKey("hq-notifs", []);
    await saveKey("hq-notifs", [{
      id: Math.random().toString(36).slice(2),
      type: "ref",
      msg: `Landlord check sent to ${addr.landlordFirstName} ${addr.landlordLastName} for ${app.name}`,
      date: new Date().toISOString().split("T")[0],
      read: false,
      urgent: false,
    }, ...notifs]);

    return Response.json({ ok: true });
  } catch (err) {
    console.error("landlord-email error:", err);
    return Response.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
