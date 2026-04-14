-- 010_audit.sql
-- Append-only audit log for compliance-sensitive operations.
--
-- Append-only is enforced by:
--   1) No UPDATE or DELETE policy in 011_rls.sql for authenticated.
--   2) A revoke on the anon/authenticated roles below.
--   3) Inserts can carry only the actor's identifying metadata;
--      rows are otherwise locked.
--
-- What belongs here: lease signings, payment attempts (success +
-- failure), autopay enrollments, member invites/removals, role
-- changes, deletions, exports, any $ movement a human would want
-- to subpoena later.

set search_path = public;

create table if not exists audit_log (
  id                    uuid primary key default gen_random_uuid(),
  workspace_id          uuid not null references workspaces(id) on delete restrict,
  actor_user_id         text,
  actor_tenant_id       uuid references tenants(id) on delete set null,
  actor_vendor_id       uuid references vendors(id) on delete set null,
  actor_role            text,
  action                text not null,
  resource_type         text not null,
  resource_id           uuid,
  resource_secondary_id text,
  before_data           jsonb,
  after_data            jsonb,
  ip_address            inet,
  user_agent            text,
  request_id            text,
  created_at            timestamptz not null default now()
);
create index if not exists audit_log_ws_idx on audit_log (workspace_id);
create index if not exists audit_log_ws_created_idx on audit_log (workspace_id, created_at desc);
create index if not exists audit_log_ws_resource_idx
  on audit_log (workspace_id, resource_type, resource_id);
create index if not exists audit_log_actor_user_idx
  on audit_log (workspace_id, actor_user_id)
  where actor_user_id is not null;
create index if not exists audit_log_action_idx on audit_log (workspace_id, action);

-- Harden append-only at the role level. Supabase's auth roles are
-- anon + authenticated + service_role; only service_role (used
-- by trusted server code) can insert, and nothing can update or
-- delete — including service_role. Table owner keeps all privileges
-- because migrations themselves may need to alter structure.
do $$ begin
  if exists (select 1 from pg_roles where rolname = 'authenticated') then
    revoke all on audit_log from authenticated;
    grant select, insert on audit_log to authenticated;
  end if;
  if exists (select 1 from pg_roles where rolname = 'anon') then
    revoke all on audit_log from anon;
  end if;
  if exists (select 1 from pg_roles where rolname = 'service_role') then
    grant select, insert on audit_log to service_role;
    revoke update, delete on audit_log from service_role;
  end if;
end $$;

-- Optional helper: a tiny wrapper callers can use to append a row
-- without worrying about columns. Keeps inserts terse and
-- consistent so we can find audit rows by action easily.
create or replace function log_audit(
  p_workspace_id uuid,
  p_action text,
  p_resource_type text,
  p_resource_id uuid,
  p_before jsonb default null,
  p_after jsonb default null,
  p_actor_user_id text default null,
  p_actor_tenant_id uuid default null,
  p_ip inet default null,
  p_user_agent text default null,
  p_request_id text default null
)
returns uuid
language sql
security definer
set search_path = public
as $$
  insert into audit_log (
    workspace_id, action, resource_type, resource_id,
    before_data, after_data,
    actor_user_id, actor_tenant_id,
    ip_address, user_agent, request_id
  )
  values (
    p_workspace_id, p_action, p_resource_type, p_resource_id,
    p_before, p_after,
    p_actor_user_id, p_actor_tenant_id,
    p_ip, p_user_agent, p_request_id
  )
  returning id;
$$;
