-- 004_leases.sql
-- Lease records + amendments + signers + signatures.
-- Mirrors the existing Supabase lease_instances shape (signing token,
-- signature blobs, variable_data jsonb) so existing rows migrate
-- cleanly when the cutover runs.

set search_path = public;

create table if not exists leases (
  id                    uuid primary key default gen_random_uuid(),
  workspace_id          uuid not null references workspaces(id) on delete cascade,
  template_id           uuid,
  property_id           uuid references properties(id) on delete set null,
  unit_id               uuid references units(id) on delete set null,
  room_id               uuid references rooms(id) on delete set null,
  tenant_id             uuid references tenants(id) on delete set null,
  application_id        uuid references applications(id) on delete set null,
  status                text not null default 'draft'
                          check (status in
                            ('draft','pending_landlord','pending_tenant',
                             'executed','cancelled','expired','renewed')),
  start_date            date,
  end_date              date,
  move_in_date          date,
  move_out_date         date,
  monthly_rent_cents    integer not null default 0,
  security_deposit_cents integer not null default 0,
  utilities_clause_key  text,
  variable_data         jsonb not null default '{}'::jsonb,
  signing_token         text unique,
  signing_link          text,
  pdf_url               text,
  pdf_storage_ref       text,
  landlord_sig          text,
  landlord_signed_at    timestamptz,
  tenant_sig            text,
  tenant_signed_at      timestamptz,
  cancelled_at          timestamptz,
  cancelled_reason      text,
  renewal_of_lease_id   uuid references leases(id) on delete set null,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);
create index if not exists leases_ws_idx on leases (workspace_id);
create index if not exists leases_ws_status_idx on leases (workspace_id, status);
create index if not exists leases_tenant_idx on leases (tenant_id);
create index if not exists leases_room_idx on leases (room_id);
create index if not exists leases_end_date_idx on leases (end_date);
create trigger leases_set_updated_at
  before update on leases
  for each row execute function set_updated_at();

create table if not exists lease_amendments (
  id                    uuid primary key default gen_random_uuid(),
  workspace_id          uuid not null references workspaces(id) on delete cascade,
  lease_id              uuid not null references leases(id) on delete cascade,
  amendment_type        text not null
                          check (amendment_type in
                            ('rent_change','term_extension','add_occupant',
                             'remove_occupant','pet_addition','policy_change','other')),
  body_markdown         text,
  variable_data         jsonb not null default '{}'::jsonb,
  signed_by_landlord_at timestamptz,
  signed_by_tenant_at   timestamptz,
  pdf_storage_ref       text,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);
create index if not exists lease_amendments_lease_idx on lease_amendments (lease_id);
create index if not exists lease_amendments_ws_idx on lease_amendments (workspace_id);
create trigger lease_amendments_set_updated_at
  before update on lease_amendments
  for each row execute function set_updated_at();

create table if not exists signers (
  id                    uuid primary key default gen_random_uuid(),
  workspace_id          uuid not null references workspaces(id) on delete cascade,
  lease_id              uuid not null references leases(id) on delete cascade,
  tenant_id             uuid references tenants(id) on delete set null,
  role                  text not null
                          check (role in ('landlord','tenant','cosigner','guarantor','witness')),
  name                  text not null,
  email                 citext,
  sort_order            integer not null default 0,
  created_at            timestamptz not null default now()
);
create index if not exists signers_lease_idx on signers (lease_id);
create index if not exists signers_ws_idx on signers (workspace_id);

create table if not exists signatures (
  id                    uuid primary key default gen_random_uuid(),
  workspace_id          uuid not null references workspaces(id) on delete cascade,
  signer_id             uuid not null references signers(id) on delete cascade,
  lease_id              uuid references leases(id) on delete cascade,
  lease_amendment_id    uuid references lease_amendments(id) on delete cascade,
  signature_svg         text,
  initials_data         jsonb,
  signed_at             timestamptz not null default now(),
  ip_address            inet,
  user_agent            text,
  check (lease_id is not null or lease_amendment_id is not null)
);
create index if not exists signatures_lease_idx on signatures (lease_id);
create index if not exists signatures_amend_idx on signatures (lease_amendment_id);
create index if not exists signatures_ws_idx on signatures (workspace_id);
