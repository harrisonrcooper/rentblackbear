// app/api/reference-email/route.js
// Sends a reference check email to a reference and marks the ref as "sent" in hq-apps
import { getSettings, emailWrap, fromAddress } from "@/lib/getSettings";
import { loadAppData, saveAppData } from "@/lib/supabase-server";

const loadKey = loadAppData;
const saveKey = saveAppData;

function applyTemplate(str, vars) {
  return (str || "").replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? "");
}

export async function POST(request) {
  try {
    const { appId, refId } = await request.json();
    if (!appId || !refId) return Response.json({ ok: false, error: "Missing appId or refId" }, { status: 400 });

    const resendKey = process.env.RESEND_API_KEY;
    if (!resendKey) return Response.json({ ok: false, error: "No Resend key" }, { status: 500 });

    const s = await getSettings();
    const apps = await loadKey("hq-apps", []);
    const app = apps.find(a => a.id === appId);
    if (!app) return Response.json({ ok: false, error: "Application not found" }, { status: 404 });

    const refsList = app.refsList || [];
    const ref = refsList.find(r => r.id === refId);
    if (!ref) return Response.json({ ok: false, error: "Reference not found" }, { status: 404 });
    if (!ref.email) return Response.json({ ok: false, error: "Reference has no email" }, { status: 400 });

    // Generate unique token for this reference
    const token = Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);
    const confirmUrl = `${s.siteUrl}/reference-confirm?token=${token}&appId=${appId}&refId=${refId}`;

    // Build email from template
    const tpl = s.emailTemplates || {};
    const defSubject = "Reference Check — {applicantName}";
    const defBody = `Dear {refFirstName},\n\nMy name is {pmName}, and I am reaching out regarding {applicantName}, who has applied to rent a room at one of my properties. They listed you as a reference.\n\nAs part of my standard screening process, I would appreciate your insight on the following:\n\n- In what capacity do you know {applicantName} (e.g., did they work under your supervision, or are you a friend/colleague)?\n- Based on your experience, would you consider them to be dependable and trustworthy?\n\nYou can reply directly to this email or use the link below to submit your response. Even a brief reply is greatly appreciated.\n\nThank you for your time.\n\nBest regards,\n{pmName}\n{companyName}`;

    const vars = {
      applicantName:   app.name || "",
      refFirstName:    ref.firstName || "",
      refLastName:     ref.lastName || "",
      refName:         (ref.firstName + " " + ref.lastName).trim(),
      refRelationship: ref.relationship || "",
      propertyName:    app.property || "",
      pmName:          s.pmName || s.ownerName || "Property Manager",
      pmPhone:         s.phone || "",
      pmEmail:         s.pmEmail || s.email || "",
      companyName:     s.companyName || "",
    };

    const subject = applyTemplate(tpl.refCheckSubject || defSubject, vars);
    const bodyText = applyTemplate(tpl.refCheckBody || defBody, vars);

    // Convert newlines to <br> for HTML
    const bodyHtml = bodyText
      .split("\n\n")
      .map(para => `<p style="font-size:14px;color:#5c4a3a;line-height:1.7;margin:0 0 14px;">${para.replace(/\n/g, "<br/>")}</p>`)
      .join("");

    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: fromAddress(s),
        to: ref.email,
        reply_to: s.pmEmail || s.email,
        subject,
        html: emailWrap(`
          <h2 style="font-size:20px;margin:0 0 16px;color:#1a1714;">Reference Request</h2>
          ${bodyHtml}
          <div style="text-align:center;margin:28px 0;">
            <a href="${confirmUrl}"
              style="display:inline-block;background:#d4a853;color:#1a1714;padding:13px 28px;border-radius:9px;font-weight:700;font-size:14px;text-decoration:none;">
              Submit My Reference Response &rarr;
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

    // Update the ref in hq-apps with token + sent status
    const updatedApps = apps.map(a => {
      if (a.id !== appId) return a;
      return {
        ...a,
        refsList: (a.refsList || []).map(r => {
          if (r.id !== refId) return r;
          return { ...r, emailStatus: "sent", token, sentAt: new Date().toISOString() };
        }),
      };
    });
    await saveKey("hq-apps", updatedApps);

    // Notification to PM
    const notifs = await loadKey("hq-notifs", []);
    await saveKey("hq-notifs", [{
      id: Math.random().toString(36).slice(2),
      type: "ref",
      msg: `Reference email sent to ${ref.firstName} ${ref.lastName} for ${app.name}`,
      date: new Date().toISOString().split("T")[0],
      read: false,
      urgent: false,
    }, ...notifs]);

    return Response.json({ ok: true });
  } catch (err) {
    console.error("reference-email error:", err);
    return Response.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
