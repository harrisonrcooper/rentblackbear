// app/api/reference-confirm/route.js
// Called when a reference clicks the confirmation link in their email.
// GET  — renders a redirect to the confirm page (token in query params)
// POST — receives form submission {token, appId, refId, response}, updates hq-apps, notifies PM

import { getSettings } from "@/lib/getSettings";
import { loadAppData, saveAppData } from "@/lib/supabase-server";

const loadKey = loadAppData;
const saveKey = saveAppData;

export async function POST(request) {
  try {
    const { token, appId, refId, addrIdx, type, response: refResponse } = await request.json();
    const isLandlord = type === "landlord";

    if (!token || !appId || (!refId && addrIdx === undefined)) {
      return Response.json({ ok: false, error: "Missing required fields" }, { status: 400 });
    }

    const apps = await loadKey("hq-apps", []);
    const app = apps.find(a => a.id === appId);
    if (!app) return Response.json({ ok: false, error: "Application not found" }, { status: 404 });

    const now = new Date().toISOString();
    let updatedApps;
    let notifMsg;

    if (isLandlord) {
      const addresses = app.applicationData?.addresses || [];
      const addr = addresses[addrIdx];
      if (!addr) return Response.json({ ok: false, error: "Address not found" }, { status: 404 });
      if (addr.landlordToken !== token) return Response.json({ ok: false, error: "Invalid or expired link" }, { status: 403 });
      if (addr.landlordEmailStatus === "verified") return Response.json({ ok: true, alreadyVerified: true });

      const updatedAddresses = addresses.map((a, i) =>
        i === Number(addrIdx) ? { ...a, landlordEmailStatus: "pending_review", landlordReplyContent: refResponse || "", landlordRepliedAt: now } : a
      );
      updatedApps = apps.map(a => a.id !== appId ? a : { ...a, applicationData: { ...(a.applicationData || {}), addresses: updatedAddresses } });
      notifMsg = `${addr.landlordFirstName} ${addr.landlordLastName} (landlord) responded for ${app.name} — pending your review`;
    } else {
      const ref = (app.refsList || []).find(r => r.id === refId);
      if (!ref) return Response.json({ ok: false, error: "Reference not found" }, { status: 404 });
      if (ref.token !== token) return Response.json({ ok: false, error: "Invalid or expired link" }, { status: 403 });
      if (ref.emailStatus === "verified") return Response.json({ ok: true, alreadyVerified: true });

      updatedApps = apps.map(a => {
        if (a.id !== appId) return a;
        return { ...a, refsList: (a.refsList || []).map(r => r.id !== refId ? r : { ...r, emailStatus: "pending_review", replyContent: refResponse || "", repliedAt: now }) };
      });
      notifMsg = `${ref.firstName} ${ref.lastName} responded to ${app.name}'s reference check — pending your review`;
    }

    await saveKey("hq-apps", updatedApps);

    const s = await getSettings();
    const notifs = await loadKey("hq-notifs", []);
    await saveKey("hq-notifs", [{
      id: Math.random().toString(36).slice(2),
      type: "ref",
      msg: notifMsg,
      date: now.split("T")[0],
      read: false,
      urgent: true,
      appId,
    }, ...notifs]);

    return Response.json({ ok: true });
  } catch (err) {
    console.error("reference-confirm error:", err);
    return Response.json({ ok: false, error: String(err) }, { status: 500 });
  }
}

// GET — validate the token and return ref/app info so the confirm page can render
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const token   = searchParams.get("token");
    const appId   = searchParams.get("appId");
    const refId   = searchParams.get("refId");
    const addrIdx = searchParams.get("addrIdx");
    const type    = searchParams.get("type");
    const isLandlord = type === "landlord";

    if (!token || !appId) {
      return Response.json({ ok: false, error: "Invalid link" }, { status: 400 });
    }

    const apps = await loadKey("hq-apps", []);
    const app = apps.find(a => a.id === appId);
    if (!app) return Response.json({ ok: false, error: "Not found" }, { status: 404 });

    if (isLandlord) {
      const addresses = app.applicationData?.addresses || [];
      const addr = addresses[Number(addrIdx)];
      if (!addr || addr.landlordToken !== token) {
        return Response.json({ ok: false, error: "Invalid or expired link" }, { status: 403 });
      }
      return Response.json({
        ok: true,
        type: "landlord",
        alreadyResponded: addr.landlordEmailStatus === "pending_review" || addr.landlordEmailStatus === "verified",
        applicantName: app.name,
        refFirstName: addr.landlordFirstName,
        refRelationship: "landlord at " + addr.street,
      });
    } else {
      if (!refId) return Response.json({ ok: false, error: "Invalid link" }, { status: 400 });
      const ref = (app.refsList || []).find(r => r.id === refId);
      if (!ref || ref.token !== token) {
        return Response.json({ ok: false, error: "Invalid or expired link" }, { status: 403 });
      }
      return Response.json({
        ok: true,
        type: "reference",
        alreadyResponded: ref.emailStatus === "pending_review" || ref.emailStatus === "verified",
        applicantName: app.name,
        refFirstName: ref.firstName,
        refRelationship: ref.relationship,
      });
    }
  } catch (err) {
    console.error("reference-confirm GET error:", err);
    return Response.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
