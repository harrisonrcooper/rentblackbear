-- 005_payments.sql
-- Ledger (charges + payments + credits) + Stripe transactions +
-- autopay config + late-fee assessments.

set search_path = public;

-- Unified ledger. Every financial event is a row; balance_after is
-- denormalized for fast "what does tenant owe now" queries.
create table if not exists ledger (
  id                    uuid primary key default gen_random_uuid(),
  workspace_id          uuid not null references workspaces(id) on delete cascade,
  tenant_id             uuid references tenants(id) on delete set null,
  lease_id              uuid references leases(id) on delete set null,
  property_id           uuid references properties(id) on delete set null,
  room_id               uuid references rooms(id) on delete set null,
  type                  text not null
                          check (type in ('charge','payment','credit','refund','adjustment')),
  category              text not null,
  amount_cents          integer not null,
  balance_after_cents   integer,
  event_date            date not null default current_date,
  description           text,
  linked_charge_id      uuid references ledger(id) on delete set null,
  linked_transaction_id uuid,
  status                text not null default 'posted'
                          check (status in
                            ('scheduled','active','posted','paid','past_due','waived','voided')),
  metadata              jsonb not null default '{}'::jsonb,
  created_by_user_id    text,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);
create index if not exists ledger_ws_idx on ledger (workspace_id);
create index if not exists ledger_tenant_idx on ledger (tenant_id);
create index if not exists ledger_lease_idx on ledger (lease_id);
create index if not exists ledger_ws_date_idx on ledger (workspace_id, event_date desc);
create index if not exists ledger_ws_status_idx on ledger (workspace_id, status);
create trigger ledger_set_updated_at
  before update on ledger
  for each row execute function set_updated_at();

-- transactions is the Stripe-or-external-processor layer. A
-- transaction may settle one or more ledger rows (payment + fee).
create table if not exists transactions (
  id                    uuid primary key default gen_random_uuid(),
  workspace_id          uuid not null references workspaces(id) on delete cascade,
  tenant_id             uuid references tenants(id) on delete set null,
  lease_id              uuid references leases(id) on delete set null,
  amount_cents          integer not null,
  fee_cents             integer not null default 0,
  net_cents             integer not null,
  method                text not null
                          check (method in
                            ('Zelle','Venmo','Cash','Check','CashApp','Bank Transfer',
                             'Stripe/ACH','Stripe/Card','Credit Card','Other')),
  stripe_payment_intent_id text unique,
  stripe_charge_id      text unique,
  stripe_transfer_id    text,
  stripe_refund_id      text,
  status                text not null default 'pending'
                          check (status in
                            ('pending','succeeded','failed','refunded','partially_refunded','canceled','disputed')),
  failure_reason        text,
  processed_at          timestamptz,
  metadata              jsonb not null default '{}'::jsonb,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);
create index if not exists transactions_ws_idx on transactions (workspace_id);
create index if not exists transactions_tenant_idx on transactions (tenant_id);
create index if not exists transactions_ws_status_idx on transactions (workspace_id, status);
create index if not exists transactions_processed_idx on transactions (workspace_id, processed_at desc);
create trigger transactions_set_updated_at
  before update on transactions
  for each row execute function set_updated_at();

-- Autopay: one row per (tenant, lease) that opted in.
create table if not exists autopay (
  id                    uuid primary key default gen_random_uuid(),
  workspace_id          uuid not null references workspaces(id) on delete cascade,
  tenant_id             uuid not null references tenants(id) on delete cascade,
  lease_id              uuid not null references leases(id) on delete cascade,
  stripe_payment_method_id text not null,
  stripe_customer_id    text,
  enabled               boolean not null default true,
  day_of_month          integer not null default 1 check (day_of_month between 1 and 28),
  last_attempt_at       timestamptz,
  last_attempt_status   text,
  retry_count           integer not null default 0,
  disabled_reason       text,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now(),
  unique (tenant_id, lease_id)
);
create index if not exists autopay_ws_idx on autopay (workspace_id);
create trigger autopay_set_updated_at
  before update on autopay
  for each row execute function set_updated_at();

-- Late-fee assessments. Linked to the charge that triggered them so
-- we never double-assess on the same past-due row.
create table if not exists late_fees (
  id                    uuid primary key default gen_random_uuid(),
  workspace_id          uuid not null references workspaces(id) on delete cascade,
  charge_id             uuid not null references ledger(id) on delete cascade,
  assessed_date         date not null default current_date,
  amount_cents          integer not null,
  kind                  text not null default 'initial'
                          check (kind in ('initial','daily','cap_reached','waived')),
  linked_charge_id      uuid references ledger(id) on delete set null,
  reason                text,
  waived                boolean not null default false,
  waived_by_user_id     text,
  waived_at             timestamptz,
  created_at            timestamptz not null default now()
);
create index if not exists late_fees_ws_idx on late_fees (workspace_id);
create index if not exists late_fees_charge_idx on late_fees (charge_id);
create unique index if not exists late_fees_dedup_idx
  on late_fees (charge_id, assessed_date, kind)
  where waived = false;
