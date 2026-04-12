// app/api/apply/route.js
// Handles pre-screen form submissions from the public site
import { getSettings, emailWrap, fromAddress } from "@/lib/getSettings";
import { loadAppData, saveAppData, supaUpsert, supaGet } from "@/lib/supabase-server";

const loadKey = loadAppData;
const saveKey = saveAppData;

function applyTemplate(str, vars) {
  return (str||"").replace(/\{(\w+)\}/g, (_, k) => vars[k] || "");
}

export async function POST(request) {
  try {
    // ── Origin check ────────────────────────────────────────────────
    // Rejects requests from outside the operator's deploy domains.
    // TODO(saas-multitenant): drive this allowlist from settings.siteUrl
    // once per-tenant deploys land. The hardcoded rentblackbear.com entry
    // is the current operator deploy URL, not product branding.
    const ALLOWED_ORIGINS = [
      process.env.NEXT_PUBLIC_SITE_URL,
      "https://rentblackbear.com",
      "https://rentblackbear.vercel.app",
      "http://localhost:3000",
    ].filter(Boolean);
    const origin = request.headers.get("origin") || request.headers.get("referer") || "";
    const isAllowed = ALLOWED_ORIGINS.some(ok => origin.startsWith(ok));
    if (!isAllowed) {
      return new Response(JSON.stringify({ error: "Forbidden" }), {
        status: 403,
        headers: { "Content-Type": "application/json" },
      });
    }

    const data = await request.json();
    const { name, email, phone, property, moveIn, income, source, reason, room, leaseTerm, leasePrice } = data;

    // Basic input validation
    if (!name || typeof name !== "string" || !email || typeof email !== "string") {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }
    const s = await getSettings();
    const resendKey = process.env.RESEND_API_KEY;

    // Save as pre-screened applicant in hq-apps
    const apps = await loadKey("hq-apps", []);
    const now = new Date().toISOString().split("T")[0];
    const newApp = {
      id: Math.random().toString(36).slice(2),
      name, email, phone,
      property: property || "",
      room: room || "",
      leaseTerm: leaseTerm || "",
      leasePrice: leasePrice || "",
      moveIn: moveIn || "Flexible",
      income: income || "",
      source: source || "",
      notes: reason || "",
      status: "new-lead",
      submitted: now,
      lastContact: now,
      bgCheck: "not-started",
      creditScore: "—",
      refs: "not-started",
    };
    await saveKey("hq-apps", [newApp, ...apps]);

    // Admin notification
    if (resendKey && s.notifPrescreen !== false) {
      const tpl = s.emailTemplates || {};
      const vars = { name, property: property || "Not specified", room: "", amount: "" };
      const subject = applyTemplate(
        tpl.prescreenSubject || "📋 New Pre-Screen — {name} · {property}",
        vars
      );
      const bodyText = applyTemplate(
        tpl.prescreenBody || "A new pre-screen was submitted by {name}. They passed all screening questions and left their contact info. Log in to admin to review and follow up.",
        vars
      );

      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from: fromAddress(s),
          to: s.pmEmail || s.email,
          subject,
          html: emailWrap(`
            <h2 style="font-size:20px;margin:0 0 6px;">New Pre-Screen Submitted</h2>
            <p style="font-size:13px;color:#5c4a3a;margin:0 0 20px;">${bodyText}</p>
            <div style="background:#f0faf4;border:1px solid #c3e6cb;border-radius:10px;padding:16px;margin-bottom:20px;">
              <div style="font-size:10px;font-weight:800;color:#2d6a3f;text-transform:uppercase;letter-spacing:1px;margin-bottom:12px;">Applicant Details</div>
              <table style="width:100%;border-collapse:collapse;font-size:13px;">
                <tr><td style="padding:5px 0;color:#5c4a3a;border-bottom:1px solid rgba(0,0,0,.05);">Name</td><td style="padding:5px 0;font-weight:700;text-align:right;border-bottom:1px solid rgba(0,0,0,.05);">${name}</td></tr>
                <tr><td style="padding:5px 0;color:#5c4a3a;border-bottom:1px solid rgba(0,0,0,.05);">Email</td><td style="padding:5px 0;text-align:right;border-bottom:1px solid rgba(0,0,0,.05);">${email}</td></tr>
                <tr><td style="padding:5px 0;color:#5c4a3a;border-bottom:1px solid rgba(0,0,0,.05);">Phone</td><td style="padding:5px 0;text-align:right;border-bottom:1px solid rgba(0,0,0,.05);">${phone||"—"}</td></tr>
                <tr><td style="padding:5px 0;color:#5c4a3a;border-bottom:1px solid rgba(0,0,0,.05);">Property</td><td style="padding:5px 0;font-weight:700;text-align:right;border-bottom:1px solid rgba(0,0,0,.05);">${property||"Not specified"}</td></tr>
                ${room ? `<tr><td style="padding:5px 0;color:#5c4a3a;border-bottom:1px solid rgba(0,0,0,.05);">Room Preference</td><td style="padding:5px 0;font-weight:700;text-align:right;border-bottom:1px solid rgba(0,0,0,.05);">${room}</td></tr>` : ""}
                ${leaseTerm ? `<tr><td style="padding:5px 0;color:#5c4a3a;border-bottom:1px solid rgba(0,0,0,.05);">Lease Term</td><td style="padding:5px 0;font-weight:700;text-align:right;border-bottom:1px solid rgba(0,0,0,.05);">${leaseTerm}</td></tr>` : ""}
                ${leasePrice ? `<tr><td style="padding:5px 0;color:#5c4a3a;border-bottom:1px solid rgba(0,0,0,.05);">Agreed Rate</td><td style="padding:5px 0;font-weight:700;color:#4a7c59;text-align:right;border-bottom:1px solid rgba(0,0,0,.05);">$${leasePrice}/mo</td></tr>` : ""}
                <tr><td style="padding:5px 0;color:#5c4a3a;border-bottom:1px solid rgba(0,0,0,.05);">Move-in</td><td style="padding:5px 0;text-align:right;border-bottom:1px solid rgba(0,0,0,.05);">${moveIn||"Flexible"}</td></tr>
                <tr><td style="padding:5px 0;color:#5c4a3a;border-bottom:1px solid rgba(0,0,0,.05);">Income</td><td style="padding:5px 0;text-align:right;border-bottom:1px solid rgba(0,0,0,.05);">${income||"Not provided"}</td></tr>
                <tr><td style="padding:5px 0;color:#5c4a3a;">Source</td><td style="padding:5px 0;text-align:right;">${source||"—"}</td></tr>
              </table>
            </div>
            <div style="text-align:center;">
              <a href="${s.siteUrl||"https://rentblackbear.com"}/admin" style="display:inline-block;background:#d4a853;color:#1a1714;padding:12px 28px;border-radius:8px;font-weight:700;font-size:13px;text-decoration:none;">Review in Admin →</a>
            </div>
          `, s),
        }),
      });
    }

    // Tenant confirmation email — reads subject/body from settings
    if (resendKey && email) {
      const firstName = name ? name.split(" ")[0] : "there";
      const tpl = s.emailTemplates || {};
      const vars = { name, firstName, property: property || "", room: "", amount: "" };
      const tenantSubject = applyTemplate(
        tpl.prescreenTenantSubject || "You're on our radar, {firstName} — {companyName}",
        vars
      );
      const tenantBodyIntro = applyTemplate(
        tpl.prescreenTenantBody || "Thanks for reaching out, {firstName}! You passed our pre-screen — nice work. We've received your info and one of our team members will be in touch within 24 hours to discuss next steps.",
        vars
      );
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from: fromAddress(s),
          to: email,
          subject: tenantSubject,
          html: emailWrap(`
            <h2 style="font-size:22px;margin:0 0 12px;color:#1a1714;">Thanks for reaching out, ${firstName}!</h2>
            <p style="font-size:14px;color:#5c4a3a;line-height:1.7;margin-bottom:16px;">${tenantBodyIntro}</p>
            <div style="background:#faf7f2;border:1px solid #e8e0d0;border-radius:10px;padding:20px;margin-bottom:24px;">
              <div style="font-size:10px;font-weight:800;color:#9a7422;text-transform:uppercase;letter-spacing:1px;margin-bottom:12px;">Your Submission</div>
              <table style="width:100%;border-collapse:collapse;font-size:13px;">
                <tr><td style="padding:5px 0;color:#5c4a3a;border-bottom:1px solid rgba(0,0,0,.05);">Name</td><td style="padding:5px 0;font-weight:700;text-align:right;border-bottom:1px solid rgba(0,0,0,.05);">${name}</td></tr>
                ${property ? `<tr><td style="padding:5px 0;color:#5c4a3a;border-bottom:1px solid rgba(0,0,0,.05);">Property</td><td style="padding:5px 0;font-weight:700;text-align:right;border-bottom:1px solid rgba(0,0,0,.05);">${property}</td></tr>` : ""}
                ${room ? `<tr><td style="padding:5px 0;color:#5c4a3a;border-bottom:1px solid rgba(0,0,0,.05);">Room</td><td style="padding:5px 0;font-weight:700;text-align:right;border-bottom:1px solid rgba(0,0,0,.05);">${room}</td></tr>` : ""}
                ${leaseTerm ? `<tr><td style="padding:5px 0;color:#5c4a3a;border-bottom:1px solid rgba(0,0,0,.05);">Lease Term</td><td style="padding:5px 0;font-weight:700;text-align:right;border-bottom:1px solid rgba(0,0,0,.05);">${leaseTerm}</td></tr>` : ""}
                ${leasePrice ? `<tr><td style="padding:5px 0;color:#5c4a3a;border-bottom:1px solid rgba(0,0,0,.05);">Monthly Rate</td><td style="padding:5px 0;font-weight:700;color:#4a7c59;text-align:right;border-bottom:1px solid rgba(0,0,0,.05);">$${leasePrice}/mo</td></tr>` : ""}
                <tr><td style="padding:5px 0;color:#5c4a3a;">Preferred Move-in</td><td style="padding:5px 0;text-align:right;">${moveIn || "Flexible"}</td></tr>
              </table>
            </div>
            <p style="font-size:13px;color:#5c4a3a;line-height:1.7;margin-bottom:20px;">
              In the meantime, feel free to browse available rooms and compare pricing at <a href="${s.siteUrl || "https://rentblackbear.com"}" style="color:#d4a853;font-weight:700;">${s.siteUrl || "rentblackbear.com"}</a>.
            </p>
            <p style="font-size:13px;color:#5c4a3a;line-height:1.7;">
              Questions? Reply to this email or text/call us at <strong>${s.phone || "(850) 696-8101"}</strong>.
            </p>
            <p style="font-size:13px;color:#5c4a3a;margin-top:20px;">— ${s.companyName || ""}</p>
          `, s),
        }),
      });
    }

    // Add to hq-notifs
    const notifs = await loadKey("hq-notifs", []);
    await saveKey("hq-notifs", [{
      id: Math.random().toString(36).slice(2),
      type: "app",
      msg: `📋 New pre-screen from ${name}${property ? " · " + property : ""}`,
      date: now, read: false, urgent: true
    }, ...notifs]);

    return Response.json({ ok: true });
  } catch (err) {
    console.error("apply route error:", err);
    return Response.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
