-- 011_rls.sql
-- Row-level security policies. Must be applied AFTER 001-010 so
-- every table + FK exists before RLS clamps down on it.
--
-- Model:
--   * Every tenant-owned table has workspace_id.
--   * The Clerk (or Supabase Auth) JWT carries workspace_id in
--     its claims: { workspace_id: "<uuid>", role: "<member_role>",
--     sub: "<user_id>", ... }.
--   * Policies read (auth.jwt() ->> 'workspace_id')::uuid and
--     compare to row.workspace_id. Everything else 404s.
--
-- Cross-workspace tables (vendors, storage_refs for globally
-- shared assets) get custom policies.
--
-- Provisioning note: service_role bypasses RLS by default in
-- Supabase, so cron jobs + webhook handlers keep working.

set search_path = public;

create or replace function current_workspace_id()
returns uuid
language sql
stable
as $$
  select nullif((auth.jwt() ->> 'workspace_id'), '')::uuid;
$$;

create or replace function current_user_id()
returns text
language sql
stable
as $$
  select nullif((auth.jwt() ->> 'sub'), '');
$$;

-- Helper that emits the four standard policies (select/insert/
-- update/delete gated on workspace_id = current_workspace_id()) in
-- one shot. Reduces the surface area for drift when we add tables.
create or replace function apply_workspace_rls(p_table text)
returns void
language plpgsql
as $$
begin
  execute format('alter table %I enable row level security;', p_table);
  execute format('alter table %I force row level security;', p_table);
  execute format($p$drop policy if exists %I on %I;$p$, p_table || '_select', p_table);
  execute format($p$drop policy if exists %I on %I;$p$, p_table || '_insert', p_table);
  execute format($p$drop policy if exists %I on %I;$p$, p_table || '_update', p_table);
  execute format($p$drop policy if exists %I on %I;$p$, p_table || '_delete', p_table);
  execute format($p$
    create policy %I on %I
      for select using (workspace_id = current_workspace_id());
  $p$, p_table || '_select', p_table);
  execute format($p$
    create policy %I on %I
      for insert with check (workspace_id = current_workspace_id());
  $p$, p_table || '_insert', p_table);
  execute format($p$
    create policy %I on %I
      for update
      using (workspace_id = current_workspace_id())
      with check (workspace_id = current_workspace_id());
  $p$, p_table || '_update', p_table);
  execute format($p$
    create policy %I on %I
      for delete using (workspace_id = current_workspace_id());
  $p$, p_table || '_delete', p_table);
end
$$;

-- ====================================================================
-- Workspaces + members + domains
-- ====================================================================

alter table workspaces enable row level security;
alter table workspaces force row level security;
drop policy if exists workspaces_select on workspaces;
drop policy if exists workspaces_update on workspaces;
create policy workspaces_select on workspaces
  for select using (id = current_workspace_id());
create policy workspaces_update on workspaces
  for update
  using (id = current_workspace_id())
  with check (id = current_workspace_id());

alter table workspace_members enable row level security;
alter table workspace_members force row level security;
drop policy if exists workspace_members_select on workspace_members;
drop policy if exists workspace_members_write  on workspace_members;
-- A user can see their own membership rows OR any row within their
-- current workspace (so admins can list the team).
create policy workspace_members_select on workspace_members
  for select using (
    user_id = current_user_id()
    or workspace_id = current_workspace_id()
  );
create policy workspace_members_write on workspace_members
  for all
  using (workspace_id = current_workspace_id())
  with check (workspace_id = current_workspace_id());

alter table workspace_domains enable row level security;
alter table workspace_domains force row level security;
drop policy if exists workspace_domains_rw on workspace_domains;
create policy workspace_domains_rw on workspace_domains
  for all
  using (workspace_id = current_workspace_id())
  with check (workspace_id = current_workspace_id());

-- ====================================================================
-- Properties, tenants, leases, payments, maintenance (standard pattern)
-- ====================================================================

select apply_workspace_rls('properties');
select apply_workspace_rls('units');
select apply_workspace_rls('rooms');
select apply_workspace_rls('tenants');
select apply_workspace_rls('applications');
select apply_workspace_rls('applicant_documents');
select apply_workspace_rls('leases');
select apply_workspace_rls('lease_amendments');
select apply_workspace_rls('signers');
select apply_workspace_rls('signatures');
select apply_workspace_rls('ledger');
select apply_workspace_rls('transactions');
select apply_workspace_rls('autopay');
select apply_workspace_rls('late_fees');
select apply_workspace_rls('tickets');
select apply_workspace_rls('ticket_messages');
select apply_workspace_rls('ticket_attachments');
select apply_workspace_rls('vendor_workspaces');
select apply_workspace_rls('invoices');
select apply_workspace_rls('documents');
select apply_workspace_rls('document_signatures');
select apply_workspace_rls('storage_refs');
select apply_workspace_rls('notifications');
select apply_workspace_rls('delivery_attempts');

-- ====================================================================
-- Vendors — shared directory, gated by the workspace join table
-- ====================================================================

alter table vendors enable row level security;
alter table vendors force row level security;
drop policy if exists vendors_select on vendors;
drop policy if exists vendors_insert on vendors;
drop policy if exists vendors_update on vendors;
create policy vendors_select on vendors
  for select using (
    exists (
      select 1 from vendor_workspaces vw
      where vw.vendor_id = vendors.id
        and vw.workspace_id = current_workspace_id()
    )
  );
-- Anyone in a workspace can insert a new vendor record; the matching
-- vendor_workspaces row is expected in the same transaction.
create policy vendors_insert on vendors
  for insert with check (true);
create policy vendors_update on vendors
  for update
  using (created_by_workspace_id = current_workspace_id())
  with check (created_by_workspace_id = current_workspace_id());

-- ====================================================================
-- Audit log — append-only even for the owning workspace
-- ====================================================================

alter table audit_log enable row level security;
alter table audit_log force row level security;
drop policy if exists audit_log_select on audit_log;
drop policy if exists audit_log_insert on audit_log;
create policy audit_log_select on audit_log
  for select using (workspace_id = current_workspace_id());
create policy audit_log_insert on audit_log
  for insert with check (workspace_id = current_workspace_id());
-- No UPDATE or DELETE policy by design — combined with the role-
-- level revokes in 010, the log is effectively immutable once
-- written.
