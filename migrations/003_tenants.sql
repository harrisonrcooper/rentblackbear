-- 003_tenants.sql
-- Tenants + applications pipeline + applicant-supplied documents.

set search_path = public;

create table if not exists tenants (
  id                    uuid primary key default gen_random_uuid(),
  workspace_id          uuid not null references workspaces(id) on delete cascade,
  first_name            text,
  last_name             text,
  email                 citext,
  phone                 text,
  dob                   date,
  emergency_contact     jsonb,
  portal_user_id        text,
  notes                 text,
  status                text not null default 'active'
                          check (status in ('active','past','applicant','archived')),
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);
create index if not exists tenants_ws_idx on tenants (workspace_id);
create index if not exists tenants_ws_status_idx on tenants (workspace_id, status);
create index if not exists tenants_email_idx on tenants (email);
create trigger tenants_set_updated_at
  before update on tenants
  for each row execute function set_updated_at();

-- Applications. term_prop_id / term_room_id stay as UUID FKs rather
-- than denormalized names because the existing admin has a known
-- "2907 vs 2909 Wilson" collision hazard when resolving by name.
create table if not exists applications (
  id                    uuid primary key default gen_random_uuid(),
  workspace_id          uuid not null references workspaces(id) on delete cascade,
  tenant_id             uuid references tenants(id) on delete set null,
  term_prop_id          uuid references properties(id) on delete set null,
  term_unit_id          uuid references units(id) on delete set null,
  term_room_id          uuid references rooms(id) on delete set null,
  status                text not null default 'lead'
                          check (status in
                            ('lead','invited','applied','scoring','approved',
                             'waitlisted','onboarding','rejected','withdrawn')),
  score                 integer check (score between 0 and 100),
  score_breakdown       jsonb,
  submitted_at          timestamptz,
  decided_at            timestamptz,
  decided_by_user_id    text,
  rejection_reason      text,
  fcra_sent_at          timestamptz,
  bg_check_status       text
                          check (bg_check_status in ('pending','passed','failed','waived','unknown')
                                 or bg_check_status is null),
  credit_score          integer,
  income_verified       boolean,
  application_data      jsonb not null default '{}'::jsonb,
  source                text,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);
create index if not exists applications_ws_idx on applications (workspace_id);
create index if not exists applications_ws_status_idx on applications (workspace_id, status);
create index if not exists applications_tenant_idx on applications (tenant_id);
create index if not exists applications_term_prop_idx on applications (term_prop_id);
create trigger applications_set_updated_at
  before update on applications
  for each row execute function set_updated_at();

create table if not exists applicant_documents (
  id                    uuid primary key default gen_random_uuid(),
  workspace_id          uuid not null references workspaces(id) on delete cascade,
  application_id        uuid not null references applications(id) on delete cascade,
  type                  text not null
                          check (type in
                            ('PhotoID-Front','PhotoID-Back','PayStub','W2','BankStatement','Other')),
  storage_ref           text not null,
  filename              text,
  content_type          text,
  size_bytes            bigint,
  uploaded_at           timestamptz not null default now()
);
create index if not exists applicant_documents_ws_idx on applicant_documents (workspace_id);
create index if not exists applicant_documents_app_idx on applicant_documents (application_id);
