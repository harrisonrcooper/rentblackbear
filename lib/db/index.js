// lib/db/index.js
// Domain-specific load/save functions for all admin data.
// Routes data to proper relational tables instead of app_data JSON blobs.
// Config/settings data stays in app_data (Tier 2).

import { supa, loadAppData, saveAppData } from "../supabase-client.js";

// ── Helper: get PM account ID (cached per session) ──
let _pmId = null;
async function getPmId() {
  if (_pmId) return _pmId;
  try {
    const r = await supa("pm_accounts?select=id&limit=1");
    const d = await r.json();
    _pmId = d?.[0]?.id || null;
  } catch { _pmId = null; }
  return _pmId;
}

// ── Generic table helpers ──

async function loadTable(table, query = "", fallback = []) {
  try {
    const pmId = await getPmId();
    const filter = pmId ? `pm_id=eq.${pmId}&` : "";
    const r = await supa(`${table}?${filter}${query}`);
    const d = await r.json();
    return Array.isArray(d) ? d : fallback;
  } catch { return fallback; }
}

async function saveRow(table, row) {
  try {
    await supa(table, {
      method: "POST",
      prefer: "resolution=merge-duplicates",
      body: JSON.stringify(row),
    });
  } catch (e) { console.error(`saveRow ${table}:`, e); }
}

async function saveRows(table, rows) {
  if (!rows.length) return;
  try {
    await supa(table, {
      method: "POST",
      prefer: "resolution=merge-duplicates",
      body: JSON.stringify(rows),
    });
  } catch (e) { console.error(`saveRows ${table}:`, e); }
}

async function deleteRow(table, id) {
  try {
    await supa(`${table}?id=eq.${id}`, { method: "DELETE" });
  } catch (e) { console.error(`deleteRow ${table}:`, e); }
}

async function syncArray(table, items, toRow) {
  const pmId = await getPmId();
  if (!pmId) return;

  // Upsert all current items
  const rows = items.map(item => ({ ...toRow(item), pm_id: pmId }));
  if (rows.length) await saveRows(table, rows);

  // Delete rows that no longer exist
  try {
    const existing = await loadTable(table, "select=id");
    const currentIds = new Set(items.map(i => i.id));
    const toDelete = existing.filter(r => !currentIds.has(r.id));
    for (const r of toDelete) await deleteRow(table, r.id);
  } catch {}
}

// ── Fallback: try relational table, fall back to app_data blob during migration ──
async function loadWithFallback(table, query, mapper, appDataKey) {
  const rows = await loadTable(table, query);
  if (rows.length > 0) return rows.map(mapper);
  // Fallback: check app_data blob (pre-migration data)
  const blob = await loadAppData(appDataKey, []);
  return Array.isArray(blob) ? blob : [];
}

// ══════════════════════════════════════════════════════════════════
// TIER 1: Relational tables (high-traffic, structured data)
// ══════════════════════════════════════════════════════════════════

// ── Applications ──
export async function loadApps() {
  return loadWithFallback("applications", "order=created_at.desc",
    r => ({ ...r.data, id: r.id, name: r.name, email: r.email, phone: r.phone, property: r.property, room: r.room, moveIn: r.move_in, income: r.income, status: r.status, submitted: r.submitted, bgCheck: r.bg_check, creditScore: r.credit_score, refs: r.refs, source: r.source, lastContact: r.last_contact, deniedReason: r.denied_reason, deniedDate: r.denied_date, prevStage: r.prev_stage, notes: r.notes }),
    "hq-apps");
}
export async function saveApps(apps) {
  await syncArray("applications", apps, a => ({
    id: a.id, name: a.name || "", email: a.email || "", phone: a.phone || "",
    property: a.property || "", room: a.room || "", move_in: a.moveIn || "",
    income: a.income || "", status: a.status || "new-lead", submitted: a.submitted || "",
    bg_check: a.bgCheck || "not-started", credit_score: a.creditScore || "—",
    refs: a.refs || "not-started", source: a.source || "", last_contact: a.lastContact || "",
    denied_reason: a.deniedReason || "", denied_date: a.deniedDate || "",
    prev_stage: a.prevStage || "", notes: a.notes || "",
    data: a, updated_at: new Date().toISOString(),
  }));
}

// ── Expenses ──
export async function loadExpenses() {
  return loadWithFallback("expenses", "order=date.desc", r => ({ ...r.data, id: r.id }), "hq-expenses");
}
export async function saveExpenses(items) {
  await syncArray("expenses", items, e => ({
    id: e.id, property_id: e.propId || e.property_id || "", date: e.date || "",
    vendor: e.vendor || "", category: e.category || "", subcategory: e.subcategory || "",
    description: e.description || e.desc || "", amount: e.amount || 0,
    receipt_url: e.receiptUrl || "", notes: e.notes || "", data: e,
  }));
}

// ── Mortgages ──
export async function loadMortgages() {
  return loadWithFallback("mortgages", "order=created_at.desc", r => ({ ...r.data, id: r.id }), "hq-mortgages");
}
export async function saveMortgages(items) {
  await syncArray("mortgages", items, m => ({
    id: m.id, property_id: m.propId || "", lender: m.lender || "",
    balance: m.balance || 0, rate: m.rate || 0, payment: m.payment || 0, data: m,
  }));
}

// ── Vendors ──
export async function loadVendors() {
  return loadWithFallback("vendors", "order=name.asc", r => ({ ...r.data, id: r.id }), "hq-vendors");
}
export async function saveVendors(items) {
  await syncArray("vendors", items, v => ({
    id: v.id, name: v.name || "", category: v.category || "",
    phone: v.phone || "", email: v.email || "", notes: v.notes || "", data: v,
  }));
}

// ── Improvements ──
export async function loadImprovements() {
  return loadWithFallback("improvements", "order=date.desc", r => ({ ...r.data, id: r.id }), "hq-improvements");
}
export async function saveImprovements(items) {
  await syncArray("improvements", items, i => ({
    id: i.id, property_id: i.propId || "", description: i.description || i.desc || "",
    amount: i.amount || 0, date: i.date || "", category: i.category || "", data: i,
  }));
}

// ── Admin Notifications ──
export async function loadNotifs() {
  return loadWithFallback("admin_notifications", "order=created_at.desc&limit=200",
    r => ({ ...r.data, id: r.id, type: r.type, msg: r.msg, date: r.date, read: r.read, urgent: r.urgent }), "hq-notifs");
}
export async function saveNotifs(items) {
  await syncArray("admin_notifications", items, n => ({
    id: n.id, type: n.type || "system", msg: n.msg || "", date: n.date || "",
    read: n.read || false, urgent: n.urgent || false, data: n,
  }));
}

// ── Transactions ──
export async function loadTxns() {
  return loadWithFallback("transactions", "order=date.desc", r => ({ ...r.data, id: r.id }), "hq-txns");
}
export async function saveTxns(items) {
  await syncArray("transactions", items, t => ({
    id: t.id, date: t.date || "", type: t.type || "", description: t.desc || t.description || "",
    amount: t.amount || 0, prop_id: t.propId || "", category: t.cat || t.category || "", data: t,
  }));
}

// ── Admin Documents ──
export async function loadDocs() {
  return loadWithFallback("admin_documents", "order=created_at.desc", r => ({ ...r.data, id: r.id }), "hq-docs");
}
export async function saveDocs(items) {
  await syncArray("admin_documents", items, d => ({
    id: d.id, name: d.name || "", type: d.type || "", property: d.property || "",
    tenant: d.tenant || "", tenant_room_id: d.tenantRoomId || "",
    uploaded: d.uploaded || "", size: d.size || "",
    content: d.content || {}, data: d,
  }));
}

// ── Rocks ──
export async function loadRocks() {
  return loadWithFallback("rocks", "order=created_at.desc", r => ({ ...r.data, id: r.id }), "hq-rocks");
}
export async function saveRocks(items) {
  await syncArray("rocks", items, r => ({
    id: r.id, title: r.title || "", owner: r.owner || "",
    status: r.status || "not-started", due: r.due || "", notes: r.notes || "", data: r,
  }));
}

// ── Issues ──
export async function loadIssues() {
  return loadWithFallback("issues", "order=created_at.desc", r => ({ ...r.data, id: r.id }), "hq-issues");
}
export async function saveIssues(items) {
  await syncArray("issues", items, i => ({
    id: i.id, title: i.title || "", priority: i.priority || "medium",
    created: i.created || "", resolved: i.resolved || false, notes: i.notes || "", data: i,
  }));
}

// ── Ideas ──
export async function loadIdeas() {
  return loadWithFallback("ideas", "order=created_at.desc", r => ({ ...r.data, id: r.id }), "hq-ideas");
}
export async function saveIdeas(items) {
  await syncArray("ideas", items, i => ({
    id: i.id, title: i.title || "", category: i.cat || i.category || "",
    priority: i.priority || "medium", status: i.status || "Idea",
    notes: i.notes || "", link: i.link || "", archived: i.archived || false, data: i,
  }));
}

// ── Archive ──
export async function loadArchive() {
  return loadWithFallback("archived_tenants", "order=created_at.desc", r => ({ ...r.data, id: r.id }), "hq-archive");
}
export async function saveArchive(items) {
  await syncArray("archived_tenants", items, a => ({
    id: a.id, name: a.name || "", email: a.email || "", phone: a.phone || "",
    room_name: a.roomName || "", prop_name: a.propName || "", rent: a.rent || 0,
    move_in: a.moveIn || "", lease_end: a.leaseEnd || "",
    terminated_date: a.terminatedDate || "", reason: a.reason || "", data: a,
  }));
}

// ── Credits ──
export async function loadCredits() {
  return loadWithFallback("credits", "order=created_at.desc", r => ({ ...r.data, id: r.id }), "hq-credits");
}
export async function saveCredits(items) {
  await syncArray("credits", items, c => ({
    id: c.id, room_id: c.roomId || "", tenant_name: c.tenantName || "",
    amount: c.amount || 0, reason: c.reason || "", date: c.date || "",
    applied: c.applied || false, data: c,
  }));
}

// ── SD Ledger ──
export async function loadSdLedger() {
  return loadWithFallback("sd_ledger", "order=created_at.desc", r => ({ ...r.data, id: r.id }), "hq-sdledger");
}
export async function saveSdLedger(items) {
  await syncArray("sd_ledger", items, s => ({
    id: s.id, room_id: s.roomId || "", tenant_name: s.tenantName || "",
    prop_name: s.propName || "", room_name: s.roomName || "",
    amount_held: s.amountHeld || 0, deposits: s.deposits || [],
    deductions: s.deductions || [], returned: s.returned || false,
    return_date: s.returnDate || "", data: s,
  }));
}

// ── Scorecard History ──
export async function loadScorecard() {
  return loadWithFallback("scorecard_history", "order=created_at.desc", r => ({ ...r.data, id: r.id }), "hq-sc");
}
export async function saveScorecard(items) {
  await syncArray("scorecard_history", items, s => ({
    id: s.id || `sc-${s.week}`, week: s.week || "", label: s.label || "", data: s,
  }));
}

// ── Monthly Snapshots ──
export async function loadMonthly() {
  return loadWithFallback("monthly_snapshots", "order=month.desc", r => ({ ...r.data, id: r.id }), "hq-monthly");
}
export async function saveMonthly(items) {
  await syncArray("monthly_snapshots", items, m => ({
    id: m.id || `mo-${m.month}`, month: m.month || "", label: m.label || "", data: m,
  }));
}

// ── Renewal Offers ──
export async function loadRenewalOffers() {
  return loadWithFallback("renewal_offers", "order=created_at.desc", r => ({ ...r.data, id: r.id }), "hq-renewal-offers");
}
export async function saveRenewalOffers(items) {
  await syncArray("renewal_offers", items, o => ({
    id: o.id, tenant_id: o.tenantId || "", proposed_rent: o.proposedRent || 0,
    term: o.term || "", note: o.note || "", status: o.status || "pending", data: o,
  }));
}

// ══════════════════════════════════════════════════════════════════
// TIER 2: Config data (stays in app_data key-value store)
// These are settings/config objects that change shape often.
// ══════════════════════════════════════════════════════════════════

export { loadAppData, saveAppData };

// Convenience wrappers for common config keys
export const loadSettings = (fb) => loadAppData("hq-settings", fb);
export const saveSettings = (d) => saveAppData("hq-settings", d);
export const loadTheme = (fb) => loadAppData("hq-theme", fb);
export const saveTheme = (d) => saveAppData("hq-theme", d);
export const loadSavedThemes = (fb) => loadAppData("hq-svthemes", fb);
export const saveSavedThemes = (d) => saveAppData("hq-svthemes", d);
export const loadScreenQs = (fb) => loadAppData("hq-screen-qs", fb);
export const saveScreenQs = (d) => saveAppData("hq-screen-qs", d);
export const loadAppFields = (fb) => loadAppData("hq-app-fields", fb);
export const saveAppFields = (d) => saveAppData("hq-app-fields", d);
export const loadSubcats = (fb) => loadAppData("hq-subcats", fb);
export const saveSubcats = (d) => saveAppData("hq-subcats", d);
export const loadPubTheme = (fb) => loadAppData("hq-pub-theme", fb);
export const savePubTheme = (d) => saveAppData("hq-pub-theme", d);

// ══════════════════════════════════════════════════════════════════
// TIER 3: Data that has BOTH app_data AND relational tables
// These stay in app_data for now — the relational tables are
// populated by syncTenant.js as a bridge layer.
// Props, charges, payments, and maintenance are complex nested
// structures. We keep them in app_data until a full schema redesign.
// ══════════════════════════════════════════════════════════════════

export const loadProps = (fb) => loadAppData("hq-props", fb);
export const saveProps = (d) => saveAppData("hq-props", d);
export const loadCharges = (fb) => loadAppData("hq-charges", fb);
export const saveCharges = (d) => saveAppData("hq-charges", d);
export const loadPayments = (fb) => loadAppData("hq-pay", fb);
export const savePayments = (d) => saveAppData("hq-pay", d);
export const loadMaint = (fb) => loadAppData("hq-maint", fb);
export const saveMaint = (d) => saveAppData("hq-maint", d);

// Portal-related data that has relational tables but admin writes as blobs
export const loadUtilityBills = (fb) => loadAppData("hq-utility-bills", fb);
export const saveUtilityBills = (d) => saveAppData("hq-utility-bills", d);
export const loadDocRequests = (fb) => loadAppData("hq-doc-requests", fb);
export const saveDocRequests = (d) => saveAppData("hq-doc-requests", d);
export const loadAmenities = (fb) => loadAppData("hq-amenities", fb);
export const saveAmenities = (d) => saveAppData("hq-amenities", d);
export const loadAmenityBookings = (fb) => loadAppData("hq-amenity-bookings", fb);
export const saveAmenityBookings = (d) => saveAppData("hq-amenity-bookings", d);
export const loadSurveys = (fb) => loadAppData("hq-surveys", fb);
export const saveSurveys = (d) => saveAppData("hq-surveys", d);
export const loadSurveyResults = (fb) => loadAppData("hq-survey-results", fb);
export const saveSurveyResults = (d) => saveAppData("hq-survey-results", d);
export const loadPackages = (fb) => loadAppData("hq-packages", fb);
export const savePackages = (d) => saveAppData("hq-packages", d);
export const loadInspections = (fb) => loadAppData("hq-inspections", fb);
export const saveInspections = (d) => saveAppData("hq-inspections", d);
