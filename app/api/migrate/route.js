// app/api/migrate/route.js
// One-time migration: reads app_data JSON blobs and inserts into proper relational tables.
// Idempotent — safe to run multiple times. Uses upsert (merge-duplicates).
// Run via: POST /api/migrate

import { auth } from "@clerk/nextjs/server";
import { loadAppData, supaUpsert, supaGet } from "@/lib/supabase-server";

export async function POST(request) {
  // Clerk admin gate
  try {
    const { userId } = await auth();
    if (!userId) {
      return Response.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }
  } catch (e) {
    console.error("[migrate] Clerk auth() failed:", e?.message || e);
    return Response.json({ ok: false, error: "Auth check failed" }, { status: 500 });
  }

  const results = { migrated: {}, errors: [], skipped: {} };

  try {
    // Get PM account ID
    const pms = await supaGet("pm_accounts", "select=id&limit=1");
    const pmId = pms?.[0]?.id;
    if (!pmId) {
      return Response.json({ ok: false, error: "No PM account found" }, { status: 400 });
    }

    // ── Helper: migrate an array blob to a relational table ──
    async function migrateArray(appDataKey, tableName, toRow) {
      try {
        const data = await loadAppData(appDataKey, []);
        if (!Array.isArray(data) || data.length === 0) {
          results.skipped[appDataKey] = "empty or not found";
          return;
        }
        const rows = data.map(item => ({ ...toRow(item), pm_id: pmId }));
        // Batch in chunks of 50 to avoid request size limits
        for (let i = 0; i < rows.length; i += 50) {
          const chunk = rows.slice(i, i + 50);
          await supaUpsert(tableName, chunk);
        }
        results.migrated[appDataKey] = `${data.length} rows → ${tableName}`;
      } catch (e) {
        results.errors.push(`${appDataKey}: ${e.message || String(e)}`);
      }
    }

    // ── Applications (hq-apps → applications) ──
    await migrateArray("hq-apps", "applications", a => ({
      id: a.id, name: a.name || "", email: a.email || "", phone: a.phone || "",
      property: a.property || "", room: a.room || "", move_in: a.moveIn || "",
      income: a.income || "", status: a.status || "new-lead", submitted: a.submitted || "",
      bg_check: a.bgCheck || "not-started", credit_score: a.creditScore || "—",
      refs: a.refs || "not-started", source: a.source || "", last_contact: a.lastContact || "",
      denied_reason: a.deniedReason || "", denied_date: a.deniedDate || "",
      prev_stage: a.prevStage || "", notes: a.notes || "",
      data: a, updated_at: new Date().toISOString(),
    }));

    // ── Expenses (hq-expenses → expenses) ──
    await migrateArray("hq-expenses", "expenses", e => ({
      id: e.id, property_id: e.propId || e.property_id || "", date: e.date || "",
      vendor: e.vendor || "", category: e.category || "", subcategory: e.subcategory || "",
      description: e.description || e.desc || "", amount: e.amount || 0,
      receipt_url: e.receiptUrl || "", notes: e.notes || "", data: e,
    }));

    // ── Mortgages (hq-mortgages → mortgages) ──
    await migrateArray("hq-mortgages", "mortgages", m => ({
      id: m.id, property_id: m.propId || "", lender: m.lender || "",
      balance: m.balance || 0, rate: m.rate || 0, payment: m.payment || 0, data: m,
    }));

    // ── Vendors (hq-vendors → vendors) ──
    await migrateArray("hq-vendors", "vendors", v => ({
      id: v.id, name: v.name || "", category: v.category || "",
      phone: v.phone || "", email: v.email || "", notes: v.notes || "", data: v,
    }));

    // ── Improvements (hq-improvements → improvements) ──
    await migrateArray("hq-improvements", "improvements", i => ({
      id: i.id, property_id: i.propId || "", description: i.description || i.desc || "",
      amount: i.amount || 0, date: i.date || "", category: i.category || "", data: i,
    }));

    // ── Notifications (hq-notifs → admin_notifications) ──
    await migrateArray("hq-notifs", "admin_notifications", n => ({
      id: n.id, type: n.type || "system", msg: n.msg || "", date: n.date || "",
      read: n.read || false, urgent: n.urgent || false, data: n,
    }));

    // ── Transactions (hq-txns → transactions) ──
    await migrateArray("hq-txns", "transactions", t => ({
      id: t.id, date: t.date || "", type: t.type || "", description: t.desc || t.description || "",
      amount: t.amount || 0, prop_id: t.propId || "", category: t.cat || t.category || "", data: t,
    }));

    // ── Documents (hq-docs → admin_documents) ──
    await migrateArray("hq-docs", "admin_documents", d => ({
      id: d.id, name: d.name || "", type: d.type || "", property: d.property || "",
      tenant: d.tenant || "", tenant_room_id: d.tenantRoomId || "",
      uploaded: d.uploaded || "", size: d.size || "",
      content: d.content || {}, data: d,
    }));

    // ── Rocks (hq-rocks → rocks) ──
    await migrateArray("hq-rocks", "rocks", r => ({
      id: r.id, title: r.title || "", owner: r.owner || "",
      status: r.status || "not-started", due: r.due || "", notes: r.notes || "", data: r,
    }));

    // ── Issues (hq-issues → issues) ──
    await migrateArray("hq-issues", "issues", i => ({
      id: i.id, title: i.title || "", priority: i.priority || "medium",
      created: i.created || "", resolved: i.resolved || false, notes: i.notes || "", data: i,
    }));

    // ── Ideas (hq-ideas → ideas) ──
    await migrateArray("hq-ideas", "ideas", i => ({
      id: i.id, title: i.title || "", category: i.cat || i.category || "",
      priority: i.priority || "medium", status: i.status || "Idea",
      notes: i.notes || "", link: i.link || "", archived: i.archived || false, data: i,
    }));

    // ── Archive (hq-archive → archived_tenants) ──
    await migrateArray("hq-archive", "archived_tenants", a => ({
      id: a.id, name: a.name || "", email: a.email || "", phone: a.phone || "",
      room_name: a.roomName || "", prop_name: a.propName || "", rent: a.rent || 0,
      move_in: a.moveIn || "", lease_end: a.leaseEnd || "",
      terminated_date: a.terminatedDate || "", reason: a.reason || "", data: a,
    }));

    // ── Credits (hq-credits → credits) ──
    await migrateArray("hq-credits", "credits", c => ({
      id: c.id, room_id: c.roomId || "", tenant_name: c.tenantName || "",
      amount: c.amount || 0, reason: c.reason || "", date: c.date || "",
      applied: c.applied || false, data: c,
    }));

    // ── SD Ledger (hq-sdledger → sd_ledger) ──
    await migrateArray("hq-sdledger", "sd_ledger", s => ({
      id: s.id, room_id: s.roomId || "", tenant_name: s.tenantName || "",
      prop_name: s.propName || "", room_name: s.roomName || "",
      amount_held: s.amountHeld || 0, deposits: s.deposits || [],
      deductions: s.deductions || [], returned: s.returned || false,
      return_date: s.returnDate || "", data: s,
    }));

    // ── Scorecard (hq-sc → scorecard_history) ──
    await migrateArray("hq-sc", "scorecard_history", s => ({
      id: s.id || `sc-${s.week || Date.now()}`, week: s.week || "", label: s.label || "", data: s,
    }));

    // ── Monthly (hq-monthly → monthly_snapshots) ──
    await migrateArray("hq-monthly", "monthly_snapshots", m => ({
      id: m.id || `mo-${m.month || Date.now()}`, month: m.month || "", label: m.label || "", data: m,
    }));

    // ── Renewal Offers (hq-renewal-offers → renewal_offers) ──
    await migrateArray("hq-renewal-offers", "renewal_offers", o => ({
      id: o.id, tenant_id: o.tenantId || "", proposed_rent: o.proposedRent || 0,
      term: o.term || "", note: o.note || "", status: o.status || "pending", data: o,
    }));

    return Response.json({ ok: true, results });
  } catch (err) {
    return Response.json({ ok: false, error: String(err), results }, { status: 500 });
  }
}

// GET endpoint to check migration status (what's in relational tables vs app_data)
export async function GET() {
  // Clerk admin gate
  try {
    const { userId } = await auth();
    if (!userId) {
      return Response.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }
  } catch (e) {
    console.error("[migrate] Clerk auth() failed:", e?.message || e);
    return Response.json({ ok: false, error: "Auth check failed" }, { status: 500 });
  }

  try {
    const pms = await supaGet("pm_accounts", "select=id&limit=1");
    const pmId = pms?.[0]?.id;

    const tables = [
      "applications", "expenses", "mortgages", "vendors", "improvements",
      "admin_notifications", "transactions", "admin_documents", "rocks",
      "issues", "ideas", "archived_tenants", "credits", "sd_ledger",
      "scorecard_history", "monthly_snapshots", "renewal_offers",
    ];
    const appDataKeys = [
      "hq-apps", "hq-expenses", "hq-mortgages", "hq-vendors", "hq-improvements",
      "hq-notifs", "hq-txns", "hq-docs", "hq-rocks",
      "hq-issues", "hq-ideas", "hq-archive", "hq-credits", "hq-sdledger",
      "hq-sc", "hq-monthly", "hq-renewal-offers",
    ];

    const status = {};
    for (let i = 0; i < tables.length; i++) {
      const table = tables[i];
      const key = appDataKeys[i];
      try {
        const filter = pmId ? `pm_id=eq.${pmId}&` : "";
        const rows = await supaGet(table, `${filter}select=id&limit=1`);
        const blob = await loadAppData(key, []);
        status[key] = {
          table,
          relationalRows: Array.isArray(rows) ? rows.length > 0 : false,
          appDataRows: Array.isArray(blob) ? blob.length : 0,
        };
      } catch {
        status[key] = { table, error: "failed to check" };
      }
    }

    return Response.json({ ok: true, pmId, status });
  } catch (err) {
    return Response.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
