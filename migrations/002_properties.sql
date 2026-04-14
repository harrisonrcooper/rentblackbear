-- 002_properties.sql
-- Physical inventory. Matches the existing admin's data model:
-- a property has units (optional) and units have rooms; a property
-- rented whole-house is modeled as one implicit unit with one room
-- by convention (the admin reads via leaseableItems()).

set search_path = public;

create table if not exists properties (
  id                    uuid primary key default gen_random_uuid(),
  workspace_id          uuid not null references workspaces(id) on delete cascade,
  name                  text not null,
  addr                  text,
  addr_city             text,
  addr_state            text,
  addr_zip              text,
  property_type         text check (property_type in
    ('single-family','duplex','triplex','fourplex','coliving','multifamily','commercial','other')),
  use_property_name     boolean not null default true,
  rental_mode           text not null default 'byBedroom'
                          check (rental_mode in ('byBedroom','wholeHouse')),
  display_name_override text,
  photos                jsonb not null default '[]'::jsonb,
  coords                jsonb,
  utils                 jsonb not null default '{}'::jsonb,
  notes                 text,
  status                text not null default 'active'
                          check (status in ('active','archived','draft','sold')),
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);
create index if not exists properties_ws_idx on properties (workspace_id);
create index if not exists properties_ws_status_idx on properties (workspace_id, status);
create trigger properties_set_updated_at
  before update on properties
  for each row execute function set_updated_at();

create table if not exists units (
  id                    uuid primary key default gen_random_uuid(),
  workspace_id          uuid not null references workspaces(id) on delete cascade,
  property_id           uuid not null references properties(id) on delete cascade,
  name                  text,
  label                 text,
  unit_type             text,
  owner_occupied        boolean not null default false,
  utils                 jsonb not null default '{}'::jsonb,
  clean_schedule        jsonb not null default '{}'::jsonb,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);
create index if not exists units_ws_idx on units (workspace_id);
create index if not exists units_property_idx on units (property_id);
create trigger units_set_updated_at
  before update on units
  for each row execute function set_updated_at();

create table if not exists rooms (
  id                    uuid primary key default gen_random_uuid(),
  workspace_id          uuid not null references workspaces(id) on delete cascade,
  unit_id               uuid not null references units(id) on delete cascade,
  name                  text,
  label                 text,
  rent_cents            integer not null default 0,
  deposit_cents         integer not null default 0,
  photos                jsonb not null default '[]'::jsonb,
  owner_occupied        boolean not null default false,
  door_code             text,
  status                text not null default 'available'
                          check (status in ('available','occupied','reserved','maintenance','owner')),
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);
create index if not exists rooms_ws_idx on rooms (workspace_id);
create index if not exists rooms_unit_idx on rooms (unit_id);
create index if not exists rooms_ws_status_idx on rooms (workspace_id, status);
create trigger rooms_set_updated_at
  before update on rooms
  for each row execute function set_updated_at();
