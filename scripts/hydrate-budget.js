// One-shot: write Harrison's actual 10X.xlsx numbers into the
// /admin/budget app_data row, replacing whatever's there now.
//
// Run once:  node scripts/hydrate-budget.js
//
// Pulls SUPABASE_SERVICE_ROLE_KEY from .env.local automatically (the
// dev server sets it in the env when this script is launched via
// `node`); falls back to NEXT_PUBLIC_SUPABASE_URL.

const fs = require("fs");
const path = require("path");

// Load .env.local manually so this script works outside `next dev`.
const envLocal = path.join(__dirname, "..", ".env.local");
if (fs.existsSync(envLocal)) {
  for (const line of fs.readFileSync(envLocal, "utf8").split("\n")) {
    const m = line.match(/^([A-Z_]+)=(.*)$/);
    if (!m) continue;
    let val = m[2].trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    if (!process.env[m[1]]) process.env[m[1]] = val;
  }
}

const SUPA_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPA_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!SUPA_URL || !SUPA_KEY) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const USER_ID = process.argv[2] || "user_3CBxR9C04fzvWljP0J5ELsa44BV";
const KEY = `budget:${USER_ID}`;

const $ = (dollars) => Math.round(dollars * 100);

// ── Personal categories ──────────────────────────────────────────────

const categories = [
  // Giving
  { label: "Tithe 10%", group_key: "giving",  monthly: 478,  biweekly: 239, yearly: 5731,  sort_order: 0 },
  { label: "Giving 5%", group_key: "giving",  monthly: 239,  biweekly: 119, yearly: 2866,  sort_order: 1 },
  // Housing
  { label: "House Maintenance", group_key: "housing", monthly: 30,  biweekly: 15,  yearly: 360,  sort_order: 0 },
  // Transport
  { label: "Gas",               group_key: "transport", monthly: 150, biweekly: 75,  yearly: 1800, sort_order: 0 },
  { label: "Oil / Maintenance", group_key: "transport", monthly: 50,  biweekly: 25,  yearly: 600,  sort_order: 1 },
  { label: "Car / Truck Insurance", group_key: "transport", monthly: 209, biweekly: 105, yearly: 2510, sort_order: 2 },
  { label: "Truck",             group_key: "transport", monthly: 735, biweekly: 368, yearly: 8820, sort_order: 3 },
  { label: "Tags",              group_key: "transport", monthly: 40,  biweekly: 20,  yearly: 480,  sort_order: 4 },
  // Food
  { label: "Food",        group_key: "food", monthly: 500, biweekly: 250, yearly: 6000, sort_order: 0 },
  { label: "Restaurants", group_key: "food", monthly: 50,  biweekly: 25,  yearly: 600,  sort_order: 1 },
  // Personal
  { label: "Pampering",          group_key: "personal", monthly: 45,  biweekly: 23, yearly: 540,  sort_order: 0 },
  { label: "YouTube",            group_key: "personal", monthly: 20,  biweekly: 10, yearly: 240,  sort_order: 1 },
  { label: "Amazon",             group_key: "personal", monthly: 13,  biweekly: 6,  yearly: 150,  sort_order: 2 },
  { label: "Walmart",            group_key: "personal", monthly: 9,   biweekly: 5,  yearly: 110,  sort_order: 3 },
  { label: "Botanical Garden",   group_key: "personal", monthly: 11,  biweekly: 6,  yearly: 132,  sort_order: 4 },
  { label: "Medicine / Drs",     group_key: "personal", monthly: 20,  biweekly: 10, yearly: 240,  sort_order: 5 },
  { label: "Misc",               group_key: "personal", monthly: 125, biweekly: 63, yearly: 1500, sort_order: 6 },
  // Kids
  { label: "Ollie Bear",         group_key: "kids", monthly: 25,  biweekly: 13,  yearly: 300,  sort_order: 0 },
  { label: "Happy Times",        group_key: "kids", monthly: 350, biweekly: 175, yearly: 4200, sort_order: 1 },
  { label: "Ollie Soccer",       group_key: "kids", monthly: 34,  biweekly: 17,  yearly: 408,  sort_order: 2 },
  { label: "Ollie Jiu-Jitsu",    group_key: "kids", monthly: 140, biweekly: 70,  yearly: 1680, sort_order: 3 },
  // Debt
  { label: "Shutdown Assistance Loan", group_key: "debt", monthly: 417, biweekly: 209, yearly: 5004, sort_order: 0 },
].map((c) => ({
  label: c.label,
  group_key: c.group_key,
  default_monthly_cents: $(c.monthly),
  default_biweekly_cents: $(c.biweekly),
  default_yearly_cents: $(c.yearly),
  sort_order: c.sort_order,
}));

// ── Income sources ───────────────────────────────────────────────────

const income_sources = [
  {
    label: "Harrison NASA Salary (Net)",
    owner: "harrison",
    source_type: "salary",
    frequency: "biweekly",
    net_amount_cents: $(2388),
  },
];

// ── Properties (operating + pipeline) ────────────────────────────────

function mkProperty(p) {
  return {
    label: p.label,
    address: p.address || null,
    status: p.status,
    market_value_cents: $(p.market_value || 0),
    mortgage_balance_cents: $(p.mortgage_balance || 0),
    mortgage_payment_cents: $((p.expenses.find((e) => /mortgage/i.test(e.label)) || {}).monthly || 0),
    mortgage_rate_bps: null,
    mortgage_term_years: null,
    mortgage_origin_date: null,
    vacancy_bps_override: p.vacancy_pct ? p.vacancy_pct * 100 : null,
    capex_bps_override: null,
    sort_order: p.sort_order,
    notes: null,
    expenses: p.expenses.map((e, idx) => ({
      label: e.label,
      kind: e.kind || "fixed",
      monthly_cents: $(e.monthly || 0),
      pct_bps: e.pct_bps ?? null,
      sort_order: idx,
    })),
    rooms: p.rooms.map((r, idx) => ({
      label: r.label,
      rent_cents: $(r.rent || 0),
      occupied: r.rent > 0,
      sort_order: idx,
    })),
  };
}

const properties = [
  mkProperty({
    label: "Wilson 0.7",
    status: "operating",
    market_value: 180000,
    mortgage_balance: 0,
    sort_order: 0,
    expenses: [
      { label: "Property Insurance", monthly: 59 },
      { label: "Landscaping",        monthly: 41 },
      { label: "10% Vacancies",      kind: "vacancy_pct", pct_bps: 1000, monthly: 105 },
      { label: "CapEx",              kind: "capex_pct",   pct_bps: 700,  monthly: 74 },
      { label: "Pest Control",       monthly: 30 },
      { label: "Property Taxes",     monthly: 67 },
    ],
    rooms: [
      { label: "Master", rent: 1050 },
      { label: "Guest",  rent: 0 },
    ],
  }),
  mkProperty({
    label: "Turf",
    status: "operating",
    market_value: 370000,
    mortgage_balance: 275000,
    sort_order: 1,
    expenses: [
      { label: "Mortgage",         monthly: 2400 },
      { label: "Utilities",        monthly: 200 },
      { label: "Internet",         monthly: 71 },
      { label: "Landscaping",      monthly: 41 },
      { label: "Cleaning Ladies",  monthly: 180 },
      { label: "Supplies",         monthly: 40 },
      { label: "10% Vacancies",    kind: "vacancy_pct", pct_bps: 1000, monthly: 430 },
      { label: "CapEx",            kind: "capex_pct",   pct_bps: 700,  monthly: 301 },
      { label: "Pest Control",     monthly: 30 },
      { label: "Mom",              monthly: 300 },
    ],
    rooms: [
      { label: "Bedroom 1", rent: 750 },
      { label: "Bedroom 2", rent: 750 },
      { label: "Bedroom 3", rent: 700 },
      { label: "Bedroom 4", rent: 700 },
      { label: "Bedroom 5", rent: 700 },
      { label: "Bedroom 6", rent: 700 },
    ],
  }),
  mkProperty({
    label: "Crestview",
    status: "operating",
    market_value: 360000,
    mortgage_balance: 185000,
    sort_order: 2,
    expenses: [
      { label: "Mortgage",         monthly: 1163 },
      { label: "Utilities",        monthly: 100 },
      { label: "Internet",         monthly: 71 },
      { label: "Landscaping",      monthly: 41 },
      { label: "Cleaning Ladies",  monthly: 240 },
      { label: "Supplies",         monthly: 40 },
      { label: "10% Vacancies",    kind: "vacancy_pct", pct_bps: 1000, monthly: 333 },
      { label: "CapEx",            kind: "capex_pct",   pct_bps: 700,  monthly: 233 },
      { label: "Pest Control",     monthly: 30 },
      { label: "Cleaning Supplies", monthly: 30 },
    ],
    rooms: [
      { label: "Master", rent: 700 },
      { label: "Guest 1", rent: 675 },
      { label: "Guest 2", rent: 650 },
      { label: "Guest 3", rent: 650 },
      { label: "Guest 4", rent: 650 },
    ],
  }),
  mkProperty({
    label: "Wilson 0.9",
    status: "operating",
    market_value: 220000,
    mortgage_balance: 95400,
    sort_order: 3,
    expenses: [
      { label: "Mortgage",          monthly: 884 },
      { label: "Utilities",         monthly: 100 },
      { label: "Internet",          monthly: 71 },
      { label: "Landscaping",       monthly: 41 },
      { label: "Cleaning Ladies",   monthly: 120 },
      { label: "Supplies",          monthly: 40 },
      { label: "10% Vacancies",     kind: "vacancy_pct", pct_bps: 1000, monthly: 200 },
      { label: "CapEx",             kind: "capex_pct",   pct_bps: 700,  monthly: 140 },
      { label: "Pest Control",      monthly: 30 },
      { label: "Cleaning Supplies", monthly: 30 },
    ],
    rooms: [
      { label: "Master", rent: 750 },
      { label: "Guest 1", rent: 600 },
      { label: "Guest 2", rent: 650 },
    ],
  }),
  // Pipeline / projected
  mkProperty({
    label: "908 Lee",
    status: "pipeline",
    market_value: 426000,
    mortgage_balance: 305000,
    sort_order: 4,
    vacancy_pct: 22,
    expenses: [
      { label: "Mortgage",        monthly: 1715 },
      { label: "Utilities",       monthly: 250 },
      { label: "Internet",        monthly: 71 },
      { label: "Landscaping",     monthly: 41 },
      { label: "Cleaning Ladies", monthly: 0 },
      { label: "Supplies",        monthly: 40 },
      { label: "22% Vacancies",   kind: "vacancy_pct", pct_bps: 2200, monthly: 319 },
      { label: "CapEx",           kind: "capex_pct",   pct_bps: 700,  monthly: 102 },
      { label: "Pest Control",    monthly: 30 },
    ],
    rooms: [
      { label: "Bedroom 1", rent: 675 },
      { label: "Bedroom 2", rent: 775 },
    ],
  }),
  mkProperty({
    label: "Lee A",
    status: "pipeline",
    market_value: 30000,
    mortgage_balance: 0,
    sort_order: 5,
    expenses: [
      { label: "Mortgage",        monthly: 2900 },
      { label: "Utilities",       monthly: 500 },
      { label: "Internet",        monthly: 71 },
      { label: "Landscaping",     monthly: 41 },
      { label: "Cleaning Ladies", monthly: 480 },
      { label: "Supplies",        monthly: 40 },
      { label: "10% Vacancies",   kind: "vacancy_pct", pct_bps: 1000, monthly: 680 },
      { label: "CapEx",           kind: "capex_pct",   pct_bps: 700,  monthly: 476 },
      { label: "Pest Control",    monthly: 30 },
    ],
    rooms: [
      { label: "Bedroom 1", rent: 800 },
      { label: "Bedroom 2", rent: 800 },
      { label: "Bedroom 3", rent: 650 },
      { label: "Bedroom 4", rent: 650 },
      { label: "Bedroom 5", rent: 650 },
      { label: "Bedroom 6", rent: 650 },
      { label: "Bedroom 7", rent: 650 },
      { label: "Bedroom 8", rent: 650 },
      { label: "Bedroom 9", rent: 650 },
      { label: "Bedroom 10", rent: 650 },
    ],
  }),
  mkProperty({
    label: "Lee B",
    status: "pipeline",
    market_value: 30000,
    mortgage_balance: 0,
    sort_order: 6,
    expenses: [
      { label: "Mortgage",        monthly: 2900 },
      { label: "Utilities",       monthly: 500 },
      { label: "Internet",        monthly: 71 },
      { label: "Landscaping",     monthly: 41 },
      { label: "Cleaning Ladies", monthly: 480 },
      { label: "Supplies",        monthly: 40 },
      { label: "10% Vacancies",   kind: "vacancy_pct", pct_bps: 1000, monthly: 680 },
      { label: "CapEx",           kind: "capex_pct",   pct_bps: 700,  monthly: 476 },
      { label: "Pest Control",    monthly: 30 },
    ],
    rooms: [
      { label: "Bedroom 1", rent: 800 },
      { label: "Bedroom 2", rent: 800 },
      { label: "Bedroom 3", rent: 650 },
      { label: "Bedroom 4", rent: 650 },
      { label: "Bedroom 5", rent: 650 },
      { label: "Bedroom 6", rent: 650 },
      { label: "Bedroom 7", rent: 650 },
      { label: "Bedroom 8", rent: 650 },
      { label: "Bedroom 9", rent: 650 },
      { label: "Bedroom 10", rent: 650 },
    ],
  }),
  mkProperty({
    label: "Colonial",
    status: "pipeline",
    market_value: 40000,
    mortgage_balance: 0,
    sort_order: 7,
    expenses: [
      { label: "Mortgage",        monthly: 2900 },
      { label: "Utilities",       monthly: 500 },
      { label: "Internet",        monthly: 71 },
      { label: "Landscaping",     monthly: 41 },
      { label: "Cleaning Ladies", monthly: 480 },
      { label: "Supplies",        monthly: 40 },
      { label: "10% Vacancies",   kind: "vacancy_pct", pct_bps: 1000, monthly: 650 },
      { label: "CapEx",           kind: "capex_pct",   pct_bps: 700,  monthly: 455 },
      { label: "Pest Control",    monthly: 30 },
    ],
    rooms: [
      { label: "Bedroom 1", rent: 850 },
      { label: "Bedroom 2", rent: 600 },
      { label: "Bedroom 3", rent: 600 },
      { label: "Bedroom 4", rent: 850 },
      { label: "Bedroom 5", rent: 600 },
      { label: "Bedroom 6", rent: 600 },
      { label: "Bedroom 7", rent: 600 },
      { label: "Bedroom 8", rent: 600 },
      { label: "Bedroom 9", rent: 600 },
      { label: "Bedroom 10", rent: 600 },
    ],
  }),
  // Equity-only / future
  mkProperty({ label: "Brandontown", status: "equity_only", market_value: 70000, mortgage_balance: 0, sort_order: 8, expenses: [], rooms: [] }),
];

// ── Business expenses (real estate) ──────────────────────────────────

const business_expenses = [
  { label: "Umbrella Policy",      monthly_cents: $(34),    frequency: "monthly", sort_order: 0 },
  { label: "Cell Phone",           monthly_cents: $(90),    frequency: "monthly", sort_order: 1 },
  { label: "Life Insurance",       monthly_cents: $(17),    frequency: "monthly", sort_order: 2 },
  { label: "Cleaning Lady Bonus",  monthly_cents: $(17.50), frequency: "monthly", sort_order: 3 },
];

// ── Yearly expenses ──────────────────────────────────────────────────

const yearly_expenses = [
  { label: "Car Insurance",                        yearly_amount_cents: $(2510), due_month: null, category: "insurance",    sort_order: 0 },
  { label: "Vehicle Tags",                         yearly_amount_cents: $(480),  due_month: null, category: "tax",          sort_order: 1 },
  { label: "Property Taxes (Wilson + Turf)",       yearly_amount_cents: $(0),    due_month: null, category: "tax",          sort_order: 2 },
  { label: "Walmart+",                             yearly_amount_cents: $(0),    due_month: null, category: "subscription", sort_order: 3 },
  { label: "Amazon Prime",                         yearly_amount_cents: $(0),    due_month: null, category: "subscription", sort_order: 4 },
];

// ── Assets ───────────────────────────────────────────────────────────

const assets = [
  { label: "Checking", kind: "cash",       balance_cents: $(0),     sort_order: 0 },
  { label: "Savings",  kind: "cash",       balance_cents: $(0),     sort_order: 1 },
  { label: "TSP",      kind: "retirement", balance_cents: $(91000), sort_order: 2 },
];

// ── Debts ────────────────────────────────────────────────────────────

const debts = [
  { label: "Student Loans", kind: "student",     balance_cents: $(55000),  original_amount_cents: null, monthly_payment_cents: 0,        interest_rate_bps: null, sort_order: 0 },
  { label: "Truck",         kind: "auto",        balance_cents: $(7000),   original_amount_cents: null, monthly_payment_cents: $(735),   interest_rate_bps: null, sort_order: 1 },
  { label: "HELOC",         kind: "heloc",       balance_cents: $(220000), original_amount_cents: null, monthly_payment_cents: $(1398),  interest_rate_bps: 768,  sort_order: 2 },
];

// ── HELOC model ──────────────────────────────────────────────────────

const heloc_model = {
  started_on: "2026-03-01",
  home_value_cents: 0,
  heloc_limit_cents: 0,
  mortgage_balance_cents: $(220000),
  mortgage_rate_bps: 688,
  mortgage_term_years: 30,
  mortgage_origin_date: "2023-02-01",
  mortgage_payment_cents: $(1397.92),
  heloc_rate_bps: 768,
  monthly_income_cents: $(5000),
  monthly_expenses_cents: 0,
  extra_payment_cents: 0,
};

// ── Mom's loan ───────────────────────────────────────────────────────

const mom_loans = [
  {
    label: "Mom's Loan",
    starting_balance_cents: $(1400),
    monthly_payment_cents: $(300),
    due_day: 1,
    payments: [
      { paid_on: "2026-03-01", amount_cents: $(300) },
    ],
  },
];

// ── Retirement contributions ─────────────────────────────────────────

const retirement_contributions = [
  { account_label: "NASA TSP", year: 2019, amount_cents: $(684) },
  { account_label: "NASA TSP", year: 2020, amount_cents: $(1086) },
  { account_label: "NASA TSP", year: 2021, amount_cents: $(2156) },
  { account_label: "NASA TSP", year: 2022, amount_cents: $(2816) },
  { account_label: "NASA TSP", year: 2023, amount_cents: $(3283) },
  { account_label: "NASA TSP", year: 2024, amount_cents: $(4129) },
  { account_label: "NASA TSP", year: 2025, amount_cents: $(4651) },
];

// ── Final state blob ─────────────────────────────────────────────────

const state = {
  settings: {
    hero_mode: "conservative",
    default_vacancy_bps: 1000,
    default_capex_bps: 700,
  },
  categories,
  income_sources,
  properties,
  business_expenses,
  yearly_expenses,
  assets,
  debts,
  heloc_model,
  mom_loans,
  retirement_contributions,
  monthly_actuals: [],
  imported_at: new Date().toISOString(),
  last_modified_at: new Date().toISOString(),
  last_modified_by: USER_ID,
  schema_version: 1,
};

(async () => {
  const res = await fetch(`${SUPA_URL}/rest/v1/app_data?on_conflict=key`, {
    method: "POST",
    headers: {
      apikey: SUPA_KEY,
      Authorization: `Bearer ${SUPA_KEY}`,
      "Content-Type": "application/json",
      Prefer: "resolution=merge-duplicates,return=minimal",
    },
    body: JSON.stringify({ key: KEY, value: state }),
  });
  if (!res.ok) {
    console.error("Write failed:", res.status, await res.text());
    process.exit(1);
  }
  console.log("Hydrated", KEY);
  console.log(`  ${categories.length} categories`);
  console.log(`  ${income_sources.length} income sources`);
  console.log(`  ${properties.length} properties (${properties.filter((p) => p.status === "operating").length} operating)`);
  console.log(`  ${properties.reduce((s, p) => s + p.rooms.length, 0)} total rooms`);
  console.log(`  ${properties.reduce((s, p) => s + p.expenses.length, 0)} total property expense lines`);
  console.log(`  ${business_expenses.length} business expenses`);
  console.log(`  ${yearly_expenses.length} yearly expenses`);
  console.log(`  ${assets.length} assets`);
  console.log(`  ${debts.length} debts`);
  console.log(`  HELOC model: yes`);
  console.log(`  Mom's loan: 1 (${mom_loans[0].payments.length} payment logged)`);
  console.log(`  ${retirement_contributions.length} retirement contribution years`);
})();
