-- 012_budget.sql
-- /admin/budget tables. Models the household + rental + net-worth +
-- HELOC velocity + Mom's-loan picture that today lives in 10X.xlsx.
--
-- Conventions inherited from 001-011:
--   * All monetary values in *_cents integer (no floats).
--   * All percentage rates in *_bps integer (basis points: 765 = 7.65%).
--   * workspace_id uuid on every row + apply_workspace_rls() at the end.
--   * archived_at timestamptz is the soft-delete column. Reads filter
--     `where archived_at is null` to hide soft-deleted rows.
--   * updated_at maintained by the shared set_updated_at() trigger.

set search_path = public;

-- ====================================================================
-- Per-workspace budget preferences (singleton)
-- ====================================================================

create table if not exists budget_settings (
  id                    uuid primary key default gen_random_uuid(),
  workspace_id          uuid not null references workspaces(id) on delete cascade unique,
  default_hero_mode     text not null default 'conservative'
                          check (default_hero_mode in ('conservative','optimistic','rentals_only')),
  default_vacancy_bps   integer not null default 1000 check (default_vacancy_bps >= 0 and default_vacancy_bps <= 10000),
  default_capex_bps     integer not null default 500  check (default_capex_bps   >= 0 and default_capex_bps   <= 10000),
  fiscal_start_month    date,
  notes                 text,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);
create trigger budget_settings_set_updated_at
  before update on budget_settings
  for each row execute function set_updated_at();

-- ====================================================================
-- Personal expense categories (the left column of the Budget tab)
-- ====================================================================

create table if not exists budget_categories (
  id                    uuid primary key default gen_random_uuid(),
  workspace_id          uuid not null references workspaces(id) on delete cascade,
  -- Free-text label the user can rename (Tithe 10%, Pampering, Ollie Bear, etc.).
  label                 text not null,
  -- Group bucket the row belongs to. Used for visual grouping in the UI
  -- (Giving, Housing, Transport, Food, Personal, Kids, Debt, Yearly, Retirement).
  group_key             text not null
                          check (group_key in
                            ('giving','housing','transport','food','personal',
                             'kids','debt','yearly','retirement','other')),
  -- Default amounts the user sees when no per-month actual is recorded.
  -- All three are stored so the UI can flip between bi-weekly / monthly /
  -- yearly views without recomputation drift.
  default_biweekly_cents integer not null default 0,
  default_monthly_cents  integer not null default 0,
  default_yearly_cents   integer not null default 0,
  sort_order            integer not null default 0,
  archived_at           timestamptz,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);
create index if not exists budget_categories_ws_idx on budget_categories (workspace_id);
create index if not exists budget_categories_ws_group_idx on budget_categories (workspace_id, group_key) where archived_at is null;
create trigger budget_categories_set_updated_at
  before update on budget_categories
  for each row execute function set_updated_at();

-- ====================================================================
-- Per-month actual amount per category (Checking Account Balances tab)
-- ====================================================================

create table if not exists budget_actuals (
  id                    uuid primary key default gen_random_uuid(),
  workspace_id          uuid not null references workspaces(id) on delete cascade,
  category_id           uuid not null references budget_categories(id) on delete cascade,
  -- Anchored to the first day of the calendar month (YYYY-MM-01).
  month                 date not null,
  amount_cents          integer not null default 0,
  note                  text,
  archived_at           timestamptz,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);
create unique index if not exists budget_actuals_uniq_idx
  on budget_actuals (category_id, month) where archived_at is null;
create index if not exists budget_actuals_ws_idx on budget_actuals (workspace_id);
create index if not exists budget_actuals_ws_month_idx on budget_actuals (workspace_id, month);
create trigger budget_actuals_set_updated_at
  before update on budget_actuals
  for each row execute function set_updated_at();

-- ====================================================================
-- Income sources (Harrison salary, Wife salary, other)
-- ====================================================================

create table if not exists budget_income_sources (
  id                    uuid primary key default gen_random_uuid(),
  workspace_id          uuid not null references workspaces(id) on delete cascade,
  label                 text not null,
  owner                 text not null default 'joint'
                          check (owner in ('harrison','wife','joint','other')),
  source_type           text not null default 'salary'
                          check (source_type in ('salary','self_employment','rental','retirement','other')),
  frequency             text not null default 'biweekly'
                          check (frequency in ('weekly','biweekly','semimonthly','monthly','yearly')),
  -- Net (take-home) amount at the stated frequency. Gross is intentionally
  -- not stored — the page shows what hits the account, not what's withheld.
  net_amount_cents      integer not null default 0,
  notes                 text,
  archived_at           timestamptz,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);
create index if not exists budget_income_sources_ws_idx on budget_income_sources (workspace_id);
create trigger budget_income_sources_set_updated_at
  before update on budget_income_sources
  for each row execute function set_updated_at();

-- ====================================================================
-- Rental properties (separate from the main `properties` table so the
-- budget page can model pipeline / sold / non-rentbear properties too)
-- ====================================================================

create table if not exists budget_properties (
  id                    uuid primary key default gen_random_uuid(),
  workspace_id          uuid not null references workspaces(id) on delete cascade,
  label                 text not null,
  address               text,
  status                text not null default 'operating'
                          check (status in ('operating','pipeline','sold','equity_only')),
  market_value_cents    integer not null default 0,
  mortgage_balance_cents integer not null default 0,
  mortgage_payment_cents integer not null default 0,
  mortgage_rate_bps     integer,
  mortgage_term_years   integer,
  mortgage_origin_date  date,
  -- Override the workspace-level defaults if this property has its own
  -- vacancy assumption (Lee uses 22%, the others use 10% in 10X.xlsx).
  vacancy_bps_override  integer check (vacancy_bps_override is null or (vacancy_bps_override >= 0 and vacancy_bps_override <= 10000)),
  capex_bps_override    integer check (capex_bps_override   is null or (capex_bps_override   >= 0 and capex_bps_override   <= 10000)),
  sort_order            integer not null default 0,
  notes                 text,
  archived_at           timestamptz,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);
create index if not exists budget_properties_ws_idx on budget_properties (workspace_id);
create index if not exists budget_properties_ws_status_idx on budget_properties (workspace_id, status) where archived_at is null;
create trigger budget_properties_set_updated_at
  before update on budget_properties
  for each row execute function set_updated_at();

-- ====================================================================
-- Per-property recurring expense lines
-- ====================================================================

create table if not exists budget_property_expenses (
  id                    uuid primary key default gen_random_uuid(),
  workspace_id          uuid not null references workspaces(id) on delete cascade,
  property_id           uuid not null references budget_properties(id) on delete cascade,
  label                 text not null,
  -- 'fixed' = use monthly_cents.
  -- 'vacancy_pct' / 'capex_pct' = computed at read time as (gross_rent * pct_bps / 10000);
  --   monthly_cents is the snapshot at import-time but the live UI value comes from the pct.
  kind                  text not null default 'fixed'
                          check (kind in ('fixed','vacancy_pct','capex_pct')),
  monthly_cents         integer not null default 0,
  pct_bps               integer check (pct_bps is null or (pct_bps >= 0 and pct_bps <= 10000)),
  sort_order            integer not null default 0,
  archived_at           timestamptz,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);
create index if not exists budget_property_expenses_ws_idx on budget_property_expenses (workspace_id);
create index if not exists budget_property_expenses_prop_idx on budget_property_expenses (property_id) where archived_at is null;
create trigger budget_property_expenses_set_updated_at
  before update on budget_property_expenses
  for each row execute function set_updated_at();

-- ====================================================================
-- Per-property room rent (the right side of each property block)
-- ====================================================================

create table if not exists budget_property_rooms (
  id                    uuid primary key default gen_random_uuid(),
  workspace_id          uuid not null references workspaces(id) on delete cascade,
  property_id           uuid not null references budget_properties(id) on delete cascade,
  label                 text not null,
  rent_cents            integer not null default 0,
  occupied              boolean not null default true,
  sort_order            integer not null default 0,
  archived_at           timestamptz,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);
create index if not exists budget_property_rooms_ws_idx on budget_property_rooms (workspace_id);
create index if not exists budget_property_rooms_prop_idx on budget_property_rooms (property_id) where archived_at is null;
create trigger budget_property_rooms_set_updated_at
  before update on budget_property_rooms
  for each row execute function set_updated_at();

-- ====================================================================
-- Real-estate-business expenses that span all properties
-- (Umbrella, Cell, Realtor assoc, Cleaning lady bonus, etc.)
-- ====================================================================

create table if not exists budget_business_expenses (
  id                    uuid primary key default gen_random_uuid(),
  workspace_id          uuid not null references workspaces(id) on delete cascade,
  label                 text not null,
  monthly_cents         integer not null default 0,
  frequency             text not null default 'monthly'
                          check (frequency in ('monthly','yearly','quarterly')),
  notes                 text,
  sort_order            integer not null default 0,
  archived_at           timestamptz,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);
create index if not exists budget_business_expenses_ws_idx on budget_business_expenses (workspace_id);
create trigger budget_business_expenses_set_updated_at
  before update on budget_business_expenses
  for each row execute function set_updated_at();

-- ====================================================================
-- Yearly-paid line items (Car insurance, Tags, property taxes, etc.)
-- Tracked separately so the UI can plan a "money you'll need in Sept"
-- cash-out cliff instead of smearing them across 12 months.
-- ====================================================================

create table if not exists budget_yearly_expenses (
  id                    uuid primary key default gen_random_uuid(),
  workspace_id          uuid not null references workspaces(id) on delete cascade,
  label                 text not null,
  yearly_amount_cents   integer not null default 0,
  due_month             integer check (due_month is null or (due_month between 1 and 12)),
  category              text not null default 'other'
                          check (category in ('insurance','tax','subscription','other')),
  notes                 text,
  sort_order            integer not null default 0,
  archived_at           timestamptz,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);
create index if not exists budget_yearly_expenses_ws_idx on budget_yearly_expenses (workspace_id);
create trigger budget_yearly_expenses_set_updated_at
  before update on budget_yearly_expenses
  for each row execute function set_updated_at();

-- ====================================================================
-- Non-real-estate assets (cash, TSP, savings, stocks)
-- ====================================================================

create table if not exists budget_assets (
  id                    uuid primary key default gen_random_uuid(),
  workspace_id          uuid not null references workspaces(id) on delete cascade,
  label                 text not null,
  kind                  text not null default 'cash'
                          check (kind in ('cash','retirement','investment','vehicle','other')),
  balance_cents         integer not null default 0,
  notes                 text,
  sort_order            integer not null default 0,
  archived_at           timestamptz,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);
create index if not exists budget_assets_ws_idx on budget_assets (workspace_id);
create trigger budget_assets_set_updated_at
  before update on budget_assets
  for each row execute function set_updated_at();

-- ====================================================================
-- Non-mortgage debts (student loans, truck loan, HELOC, credit cards).
-- Property mortgages live on budget_properties.mortgage_balance_cents.
-- ====================================================================

create table if not exists budget_debts (
  id                    uuid primary key default gen_random_uuid(),
  workspace_id          uuid not null references workspaces(id) on delete cascade,
  label                 text not null,
  kind                  text not null default 'other'
                          check (kind in ('student','auto','heloc','credit_card','personal','other')),
  balance_cents         integer not null default 0,
  original_amount_cents integer,
  monthly_payment_cents integer not null default 0,
  interest_rate_bps     integer,
  notes                 text,
  sort_order            integer not null default 0,
  archived_at           timestamptz,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);
create index if not exists budget_debts_ws_idx on budget_debts (workspace_id);
create trigger budget_debts_set_updated_at
  before update on budget_debts
  for each row execute function set_updated_at();

-- ====================================================================
-- HELOC velocity-banking calculator state (singleton per workspace).
-- Drives the HELOC tile: traditional payoff vs HELOC vs HELOC + CC.
-- ====================================================================

create table if not exists budget_heloc_model (
  id                    uuid primary key default gen_random_uuid(),
  workspace_id          uuid not null references workspaces(id) on delete cascade unique,
  started_on            date,
  home_value_cents      integer not null default 0,
  heloc_limit_cents     integer not null default 0,    -- typically 80% LTV (computed but stored)
  mortgage_balance_cents integer not null default 0,
  mortgage_rate_bps     integer,
  mortgage_term_years   integer,
  mortgage_origin_date  date,
  mortgage_payment_cents integer not null default 0,
  heloc_rate_bps        integer,
  monthly_income_cents  integer not null default 0,
  monthly_expenses_cents integer not null default 0,
  extra_payment_cents   integer not null default 0,    -- the slider value
  notes                 text,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);
create trigger budget_heloc_model_set_updated_at
  before update on budget_heloc_model
  for each row execute function set_updated_at();

-- ====================================================================
-- Mom's loan — informal family loan ledger
-- ====================================================================

create table if not exists budget_mom_loans (
  id                    uuid primary key default gen_random_uuid(),
  workspace_id          uuid not null references workspaces(id) on delete cascade,
  label                 text not null default 'Mom''s loan',
  starting_balance_cents integer not null default 0,
  monthly_payment_cents integer not null default 0,
  -- The day-of-month the payment runs on (1-28 to stay safe in February).
  due_day               integer check (due_day is null or (due_day between 1 and 28)),
  notes                 text,
  archived_at           timestamptz,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);
create index if not exists budget_mom_loans_ws_idx on budget_mom_loans (workspace_id);
create trigger budget_mom_loans_set_updated_at
  before update on budget_mom_loans
  for each row execute function set_updated_at();

create table if not exists budget_mom_loan_payments (
  id                    uuid primary key default gen_random_uuid(),
  workspace_id          uuid not null references workspaces(id) on delete cascade,
  loan_id               uuid not null references budget_mom_loans(id) on delete cascade,
  paid_on               date not null default current_date,
  amount_cents          integer not null,
  note                  text,
  archived_at           timestamptz,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);
create index if not exists budget_mom_loan_payments_ws_idx on budget_mom_loan_payments (workspace_id);
create index if not exists budget_mom_loan_payments_loan_idx on budget_mom_loan_payments (loan_id) where archived_at is null;
create trigger budget_mom_loan_payments_set_updated_at
  before update on budget_mom_loan_payments
  for each row execute function set_updated_at();

-- ====================================================================
-- Retirement contributions by year (NASA TSP-style ledger)
-- ====================================================================

create table if not exists budget_retirement_contributions (
  id                    uuid primary key default gen_random_uuid(),
  workspace_id          uuid not null references workspaces(id) on delete cascade,
  account_label         text not null default 'NASA TSP',
  year                  integer not null check (year between 1970 and 2200),
  amount_cents          integer not null default 0,
  notes                 text,
  archived_at           timestamptz,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);
create unique index if not exists budget_retirement_contributions_uniq_idx
  on budget_retirement_contributions (workspace_id, account_label, year) where archived_at is null;
create index if not exists budget_retirement_contributions_ws_idx on budget_retirement_contributions (workspace_id);
create trigger budget_retirement_contributions_set_updated_at
  before update on budget_retirement_contributions
  for each row execute function set_updated_at();

-- ====================================================================
-- Audit log for budget mutations. Append-only; lets us reconstruct
-- who-changed-what at 3am without grepping logs.
-- ====================================================================

create table if not exists budget_audit_log (
  id                    uuid primary key default gen_random_uuid(),
  workspace_id          uuid not null references workspaces(id) on delete cascade,
  user_id               text,
  entity_table          text not null,
  entity_id             uuid,
  action                text not null check (action in ('insert','update','delete','import')),
  before_jsonb          jsonb,
  after_jsonb           jsonb,
  context               jsonb not null default '{}'::jsonb,
  created_at            timestamptz not null default now()
);
create index if not exists budget_audit_log_ws_idx on budget_audit_log (workspace_id);
create index if not exists budget_audit_log_ws_created_idx on budget_audit_log (workspace_id, created_at desc);

-- ====================================================================
-- RLS — workspace_id-scoped policies via the existing helper.
-- Each budget_* table follows the same standard pattern.
-- ====================================================================

select apply_workspace_rls('budget_settings');
select apply_workspace_rls('budget_categories');
select apply_workspace_rls('budget_actuals');
select apply_workspace_rls('budget_income_sources');
select apply_workspace_rls('budget_properties');
select apply_workspace_rls('budget_property_expenses');
select apply_workspace_rls('budget_property_rooms');
select apply_workspace_rls('budget_business_expenses');
select apply_workspace_rls('budget_yearly_expenses');
select apply_workspace_rls('budget_assets');
select apply_workspace_rls('budget_debts');
select apply_workspace_rls('budget_heloc_model');
select apply_workspace_rls('budget_mom_loans');
select apply_workspace_rls('budget_mom_loan_payments');
select apply_workspace_rls('budget_retirement_contributions');

-- Audit log: insert + select scoped to workspace; no update/delete by
-- design (same pattern as the global audit_log in 010).
alter table budget_audit_log enable row level security;
alter table budget_audit_log force row level security;
drop policy if exists budget_audit_log_select on budget_audit_log;
drop policy if exists budget_audit_log_insert on budget_audit_log;
create policy budget_audit_log_select on budget_audit_log
  for select using (workspace_id = current_workspace_id());
create policy budget_audit_log_insert on budget_audit_log
  for insert with check (workspace_id = current_workspace_id());
