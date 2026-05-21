// One-shot: create the "Caitlin & Michael" budget as a blank slate.
//
// Adds a secondary budget to Harrison's budget registry and seeds its
// blob with the basic household template (every amount $0). Idempotent
// — re-running finds the budget already present and exits cleanly.
//
//   node scripts/seed-caitlin-michael.js
//
// Mirrors actions/budget/createBudgetAction: same registry shape, same
// budget-workspace key (`budget:<owner>::<slug>`), same basic template.

const fs = require("fs");
const path = require("path");

const OWNER_KEY = "user_3CBxR9C04fzvWljP0J5ELsa44BV"; // discovered from app_data
const SLUG = "caitlin-michael";
const LABEL = "Caitlin & Michael";
const COLOR = "#16a34a";

function readEnv(name) {
  const env = fs.readFileSync(path.join(__dirname, "..", ".env.local"), "utf8");
  const m = env.match(new RegExp("^" + name + "=(.*)$", "m"));
  return m ? m[1].trim().replace(/^["']|["']$/g, "") : null;
}

const SUPA_URL = readEnv("NEXT_PUBLIC_SUPABASE_URL");
const SUPA_KEY =
  readEnv("SUPABASE_SERVICE_ROLE_KEY") ||
  readEnv("SUPABASE_ANON_KEY") ||
  readEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY");

if (!SUPA_URL || !SUPA_KEY) {
  console.error("Missing Supabase env vars in .env.local — aborting.");
  process.exit(1);
}

const H = (prefer) => ({
  apikey: SUPA_KEY,
  Authorization: `Bearer ${SUPA_KEY}`,
  "Content-Type": "application/json",
  Prefer: prefer,
});

async function loadAppData(key) {
  const res = await fetch(
    `${SUPA_URL}/rest/v1/app_data?key=eq.${encodeURIComponent(key)}&select=value`,
    { headers: H("return=representation") },
  );
  if (!res.ok) throw new Error(`load ${key} failed (${res.status})`);
  const rows = await res.json();
  return rows.length ? rows[0].value : null;
}

async function saveAppData(key, value) {
  const res = await fetch(`${SUPA_URL}/rest/v1/app_data?on_conflict=key`, {
    method: "POST",
    headers: H("resolution=merge-duplicates,return=minimal"),
    body: JSON.stringify({ key, value }),
  });
  if (!res.ok) throw new Error(`save ${key} failed (${res.status}): ${await res.text()}`);
}

// Basic-mode envelopes — mirror of BASIC_CATEGORIES in _seed-templates.ts.
const BASIC_CATEGORIES = [
  { label: "Rent / Mortgage", group_key: "housing", default_monthly_cents: 0, default_biweekly_cents: 0, default_yearly_cents: 0, sort_order: 0 },
  { label: "Utilities", group_key: "housing", default_monthly_cents: 0, default_biweekly_cents: 0, default_yearly_cents: 0, sort_order: 1 },
  { label: "Internet & phone", group_key: "housing", default_monthly_cents: 0, default_biweekly_cents: 0, default_yearly_cents: 0, sort_order: 2 },
  { label: "Gas", group_key: "transport", default_monthly_cents: 0, default_biweekly_cents: 0, default_yearly_cents: 0, sort_order: 0 },
  { label: "Car payment & insurance", group_key: "transport", default_monthly_cents: 0, default_biweekly_cents: 0, default_yearly_cents: 0, sort_order: 1 },
  { label: "Groceries", group_key: "food", default_monthly_cents: 0, default_biweekly_cents: 0, default_yearly_cents: 0, sort_order: 0 },
  { label: "Eating out", group_key: "food", default_monthly_cents: 0, default_biweekly_cents: 0, default_yearly_cents: 0, sort_order: 1 },
  { label: "Subscriptions", group_key: "personal", default_monthly_cents: 0, default_biweekly_cents: 0, default_yearly_cents: 0, sort_order: 0 },
  { label: "Personal & medical", group_key: "personal", default_monthly_cents: 0, default_biweekly_cents: 0, default_yearly_cents: 0, sort_order: 1 },
  { label: "Fun money", group_key: "personal", default_monthly_cents: 0, default_biweekly_cents: 0, default_yearly_cents: 0, sort_order: 2 },
];

function blankBasicBudget() {
  const now = new Date().toISOString();
  return {
    settings: { hero_mode: "conservative", default_vacancy_bps: 1000, default_capex_bps: 500, experience: "basic" },
    categories: BASIC_CATEGORIES,
    income_sources: [
      { label: "Paycheck (you)", owner: "harrison", source_type: "salary", frequency: "biweekly", net_amount_cents: 0 },
      { label: "Paycheck (partner)", owner: "wife", source_type: "salary", frequency: "biweekly", net_amount_cents: 0 },
    ],
    properties: [],
    business_expenses: [],
    yearly_expenses: [],
    assets: [
      { label: "Checking", kind: "cash", balance_cents: 0, sort_order: 0 },
      { label: "Savings", kind: "cash", balance_cents: 0, sort_order: 1 },
    ],
    debts: [],
    heloc_model: null,
    mom_loans: [],
    retirement_contributions: [],
    monthly_actuals: [],
    history: [],
    habits: [],
    goals: [],
    bills: [],
    profiles: [],          // no other household's names carried in
    active_profile_id: null,
    imported_at: now,
    last_modified_at: now,
    last_modified_by: "seed-script",
    schema_version: 1,
  };
}

(async () => {
  const registryKey = `budget-registry:${OWNER_KEY}`;
  const budgetKey = `budget:${OWNER_KEY}::${SLUG}`;

  const existing = (await loadAppData(registryKey)) || {
    primary_label: "Harrison",
    budgets: [],
    active_id: null,
  };
  const budgets = Array.isArray(existing.budgets) ? existing.budgets : [];

  if (budgets.some((b) => b.id === SLUG)) {
    console.log(`"${LABEL}" already exists in the registry — nothing to do.`);
    return;
  }

  // 1) Seed the blank-slate budget blob.
  await saveAppData(budgetKey, blankBasicBudget());
  console.log(`Seeded blank budget → ${budgetKey}`);

  // 2) Register it. active_id stays null so Harrison still lands on his
  //    own budget; "Caitlin & Michael" appears in the switcher.
  const registry = {
    primary_label: existing.primary_label || "Harrison",
    budgets: [
      ...budgets,
      { id: SLUG, label: LABEL, color: COLOR, created_at: new Date().toISOString() },
    ],
    active_id: existing.active_id ?? null,
  };
  await saveAppData(registryKey, registry);
  console.log(`Registered "${LABEL}" → ${registryKey}`);
  console.log("Done. Reload /admin/budget — it's in the VIEWING AS dropdown.");
})().catch((e) => {
  console.error("Failed:", e.message);
  process.exit(1);
});
