// app/api/reference-confirm/route.js
// Called when a reference clicks the confirmation link in their email.
// GET  — renders a redirect to the confirm page (token in query params)
// POST — receives form submission {token, appId, refId, response}, updates hq-apps, notifies PM

import { getSettings } from "@/lib/getSettings";

const SUPA = "https://vxysaclhucdjxzcknoar.supabase.co/rest/v1";
const KEY  = process.env.SUPABASE_ANON_KEY;

async function loadKey(key, fallback = []) {
  try {
    const r = await fetch(`${SUPA}/app_data?key=eq.${key}&select=value`, {
      headers: { apikey: KEY, Authorization: `Bearer ${KEY}` }
    });
    const d = await r.json();
    return d?.[0]?.value ?? fallback;
  } catch { return fallback; }
}

async function saveKey(key, value) {
  const existing = await fetch(`${SUPA}/app_data?key=eq.${key}`, {
    headers: { apikey: KEY, Authorization: `Bearer ${KEY}` }
  });
  const rows = await existing.json();
  const method = rows?.length > 0 ? "PATCH" : "POST";
  const url    = rows?.length > 0 ? `${SUPA}/app_data?key=eq.${key}` : `${SUPA}/app_data`;
  await fetch(url, {
    method,
    headers: { apikey: KEY, Authorization: `Bearer ${KEY}`, "Content-Type": "application/json", Prefer: "return=minimal" },
    body: JSON.stringify(rows?.length > 0 ? { value } : { key, value })
  });
}

export async function POST(request) {
  try {
    const { token, appId, refId, response: refResponse } = await request.json();

    if (!token || !appId || !refId) {
      return Response.json({ ok: false, error: "Missing required fields" }, { status: 400 });
    }

    const apps = await loadKey("hq-apps", []);
    const app = apps.find(a => a.id === appId);
    if (!app) return Response.json({ ok: false, error: "Application not found" }, { status: 404 });

    const ref = (app.refsList || []).find(r => r.id === refId);
    if (!ref) return Response.json({ ok: false, error: "Reference not found" }, { status: 404 });

    // Validate token matches
    if (ref.token !== token) {
      return Response.json({ ok: false, error: "Invalid or expired link" }, { status: 403 });
    }

    // Already verified — idempotent
    if (ref.emailStatus === "verified") {
      return Response.json({ ok: true, alreadyVerified: true });
    }

    const now = new Date().toISOString();

    // Update ref status to pending_review
    const updatedApps = apps.map(a => {
      if (a.id !== appId) return a;
      return {
        ...a,
        refsList: (a.refsList || []).map(r => {
          if (r.id !== refId) return r;
          return {
            ...r,
            emailStatus: "pending_review",
            replyContent: refResponse || "",
            repliedAt: now,
          };
        }),
      };
    });
    await saveKey("hq-apps", updatedApps);

    // Notify PM
    const s = await getSettings();
    const notifs = await loadKey("hq-notifs", []);
    await saveKey("hq-notifs", [{
      id: Math.random().toString(36).slice(2),
      type: "ref",
      msg: `${ref.firstName} ${ref.lastName} responded to ${app.name}'s reference check — pending your review`,
      date: now.split("T")[0],
      read: false,
      urgent: true,
      appId,
      refId,
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
    const token = searchParams.get("token");
    const appId = searchParams.get("appId");
    const refId = searchParams.get("refId");

    if (!token || !appId || !refId) {
      return Response.json({ ok: false, error: "Invalid link" }, { status: 400 });
    }

    const apps = await loadKey("hq-apps", []);
    const app = apps.find(a => a.id === appId);
    if (!app) return Response.json({ ok: false, error: "Not found" }, { status: 404 });

    const ref = (app.refsList || []).find(r => r.id === refId);
    if (!ref || ref.token !== token) {
      return Response.json({ ok: false, error: "Invalid or expired link" }, { status: 403 });
    }

    return Response.json({
      ok: true,
      alreadyResponded: ref.emailStatus === "pending_review" || ref.emailStatus === "verified",
      applicantName: app.name,
      refFirstName: ref.firstName,
      refRelationship: ref.relationship,
    });
  } catch (err) {
    console.error("reference-confirm GET error:", err);
    return Response.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
