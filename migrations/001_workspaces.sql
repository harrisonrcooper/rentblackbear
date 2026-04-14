-- 001_workspaces.sql
-- Core multi-tenancy tables. Every other migration FK's into workspaces.
-- Migrations are NOT applied yet — applied when Supabase is provisioned.

set search_path = public;

create extension if not exists "pgcrypto";
create extension if not exists "citext";

-- Workspaces: the tenant boundary. Each operator (Harrison, another PM
-- who signs up, etc.) owns exactly one workspace. All property /
-- tenant / lease / payment / maintenance data hangs off workspace_id.
create table if not exists workspaces (
  id                    uuid primary key default gen_random_uuid(),
  slug                  citext unique not null,
  name                  text not null,
  operator_name         text,
  operator_email        citext,
  brand                 jsonb not null default '{}'::jsonb,
  plan_tier             text not null default 'starter'
                          check (plan_tier in ('starter','growth','scale','custom')),
  trial_ends_at         timestamptz,
  stripe_customer_id    text unique,
  stripe_subscription_id text unique,
  stripe_connect_account_id text unique,
  onboarded_at          timestamptz,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

-- Workspace members — the authentication bridge. user_id is the Clerk
-- subject (sub claim); we don't replicate Clerk data here.
create table if not exists workspace_members (
  workspace_id          uuid not null references workspaces(id) on delete cascade,
  user_id               text not null,
  role                  text not null
                          check (role in ('owner','admin','operator','viewer')),
  invited_by_user_id    text,
  invited_at            timestamptz default now(),
  accepted_at           timestamptz,
  removed_at            timestamptz,
  primary key (workspace_id, user_id)
);
create index if not exists workspace_members_user_idx on workspace_members (user_id);
create index if not exists workspace_members_role_idx on workspace_members (workspace_id, role);

-- Workspace domains — drives host-based routing in proxy.ts.
-- type matches the enum proxy.ts branches on.
create table if not exists workspace_domains (
  id                    uuid primary key default gen_random_uuid(),
  workspace_id          uuid not null references workspaces(id) on delete cascade,
  host                  citext unique not null,
  type                  text not null
                          check (type in ('portal','admin','marketing','custom')),
  verified_at           timestamptz,
  ssl_issued_at         timestamptz,
  created_at            timestamptz not null default now()
);
create index if not exists workspace_domains_ws_idx on workspace_domains (workspace_id);

-- updated_at trigger helper reused across every table.
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end
$$;

create trigger workspaces_set_updated_at
  before update on workspaces
  for each row execute function set_updated_at();
