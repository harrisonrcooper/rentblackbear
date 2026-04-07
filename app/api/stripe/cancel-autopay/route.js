import { NextResponse } from "next/server";

const SUPA_URL = "https://vxysaclhucdjxzcknoar.supabase.co";
const SUPA_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ4eXNhY2xodWNkanh6Y2tub2FyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMyNzA5NTEsImV4cCI6MjA4ODg0Njk1MX0.AiAkd5eZZm8ztaUsfGUj-XF7zL_mwCTy7bAGF-mqmoM";

export async function POST(request) {
  const { tenantId } = await request.json();
  if (!tenantId) return NextResponse.json({ error: "Missing tenantId" }, { status: 400 });

  try {
    // Clear autopay fields on the tenant record
    await fetch(SUPA_URL + "/rest/v1/portal_users?tenant_id=eq." + tenantId, {
      method: "PATCH",
      headers: { "apikey": SUPA_KEY, "Authorization": "Bearer " + SUPA_KEY, "Content-Type": "application/json", "Prefer": "return=representation" },
      body: JSON.stringify({ autopay_enabled: false, stripe_customer_id: null, stripe_payment_method_id: null }),
    });

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("Cancel autopay error:", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
