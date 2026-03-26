// app/api/portal-invite-token/route.js
// Generates a standalone portal invite token with no tenant attached.
// Used for the "Generate" button on the Applications page.
// Token expires in 48 hours. PM can share the link manually.

const SUPA_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPA_KEY = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

async function supaInsert(table, data) {
  const r = await fetch(`${SUPA_URL}/rest/v1/${table}`, {
    method: "POST",
    headers: {
      apikey: SUPA_KEY,
      Authorization: `Bearer ${SUPA_KEY}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
    },
    body: JSON.stringify(data),
  });
  return r.json();
}

async function supaQuery(table, query) {
  const r = await fetch(`${SUPA_URL}/rest/v1/${table}?${query}`, {
    headers: { apikey: SUPA_KEY, Authorization: `Bearer ${SUPA_KEY}` },
  });
  return r.json();
}

export async function POST(request) {
  try {
    // Get the PM account id for Black Bear Rentals
    const pms = await supaQuery("pm_accounts", "select=id&limit=1");
    const pmId = pms?.[0]?.id;

    if (!pmId) {
      return Response.json({ ok: false, error: "PM account not found" }, { status: 400 });
    }

    // Create a general invite with no tenant or email attached
    const rows = await supaInsert("invites", {
      pm_id: pmId,
      tenant_id: null,
      email: "general@placeholder.invalid", // placeholder — gets overridden when tenant claims it
    });

    const invite = rows?.[0];
    if (!invite?.token) {
      return Response.json({ ok: false, error: "Failed to create token" }, { status: 500 });
    }

    return Response.json({ ok: true, token: invite.token });
  } catch (err) {
    console.error("Token generation error:", err);
    return Response.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
