-- 007_vendors.sql
-- Shared vendor directory + per-workspace relationship records +
-- vendor invoices.
--
-- Vendors are cross-workspace by design: a plumber working for
-- Black Bear Rentals AND for another PM on Tenantory should exist
-- once. Per-workspace specifics (rate, status, notes) live in
-- vendor_workspaces. RLS on vendor_workspaces gates what a
-- workspace can see; the base vendors table is readable to any
-- workspace that has a vendor_workspaces row for that vendor.

set search_path = public;

create table if not exists vendors (
  id                    uuid primary key default gen_random_uuid(),
  name                  text not null,
  company               text,
  email                 citext,
  phone                 text,
  tax_id                text,
  address               text,
  is_1099               boolean not null default false,
  insurance_expires_at  date,
  license_number        text,
  categories            jsonb not null default '[]'::jsonb,
  notes                 text,
  tenantory_verified    boolean not null default false,
  created_by_workspace_id uuid references workspaces(id) on delete set null,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);
create index if not exists vendors_email_idx on vendors (email);
create index if not exists vendors_name_idx on vendors (name);
create trigger vendors_set_updated_at
  before update on vendors
  for each row execute function set_updated_at();

create table if not exists vendor_workspaces (
  vendor_id             uuid not null references vendors(id) on delete cascade,
  workspace_id          uuid not null references workspaces(id) on delete cascade,
  relationship_status   text not null default 'active'
                          check (relationship_status in
                            ('invited','active','preferred','paused','terminated')),
  nickname              text,
  rate_cents            integer,
  rate_unit             text check (rate_unit in
    ('hour','visit','job','sqft','unit','month') or rate_unit is null),
  preferred_contact     text check (preferred_contact in ('email','sms','call') or preferred_contact is null),
  notes                 text,
  first_engaged_at      timestamptz,
  last_engaged_at       timestamptz,
  total_spend_cents     bigint not null default 0,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now(),
  primary key (vendor_id, workspace_id)
);
create index if not exists vendor_workspaces_ws_idx on vendor_workspaces (workspace_id);
create trigger vendor_workspaces_set_updated_at
  before update on vendor_workspaces
  for each row execute function set_updated_at();

create table if not exists invoices (
  id                    uuid primary key default gen_random_uuid(),
  workspace_id          uuid not null references workspaces(id) on delete cascade,
  vendor_id             uuid not null references vendors(id) on delete restrict,
  ticket_id             uuid references tickets(id) on delete set null,
  property_id           uuid references properties(id) on delete set null,
  invoice_number        text,
  issued_date           date not null default current_date,
  due_date              date,
  paid_date             date,
  amount_cents          integer not null,
  category              text,
  status                text not null default 'open'
                          check (status in ('open','scheduled','paid','overdue','disputed','voided')),
  ledger_row_id         uuid references ledger(id) on delete set null,
  transaction_id        uuid references transactions(id) on delete set null,
  storage_ref           text,
  notes                 text,
  created_by_user_id    text,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);
create index if not exists invoices_ws_idx on invoices (workspace_id);
create index if not exists invoices_vendor_idx on invoices (vendor_id);
create index if not exists invoices_ws_status_idx on invoices (workspace_id, status);
create index if not exists invoices_ticket_idx on invoices (ticket_id);
create trigger invoices_set_updated_at
  before update on invoices
  for each row execute function set_updated_at();

-- Add the FK from tickets.assigned_vendor_id now that vendors
-- exists. Defined as a constraint so migration 006 stays self-
-- contained.
alter table tickets
  add constraint tickets_assigned_vendor_fk
  foreign key (assigned_vendor_id) references vendors(id) on delete set null;

alter table ticket_messages
  add constraint ticket_messages_vendor_fk
  foreign key (author_vendor_id) references vendors(id) on delete set null;
