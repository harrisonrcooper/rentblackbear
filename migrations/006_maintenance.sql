-- 006_maintenance.sql
-- Maintenance ticket pipeline + threaded messages + attachments.

set search_path = public;

create table if not exists tickets (
  id                    uuid primary key default gen_random_uuid(),
  workspace_id          uuid not null references workspaces(id) on delete cascade,
  property_id           uuid references properties(id) on delete set null,
  unit_id               uuid references units(id) on delete set null,
  room_id               uuid references rooms(id) on delete set null,
  tenant_id             uuid references tenants(id) on delete set null,
  title                 text not null,
  description           text,
  category              text,
  priority              text not null default 'medium'
                          check (priority in ('low','medium','high','urgent')),
  status                text not null default 'open'
                          check (status in
                            ('open','assigned','in_progress','awaiting_tenant',
                             'awaiting_parts','completed','cancelled')),
  assigned_vendor_id    uuid,
  estimated_cost_cents  integer,
  actual_cost_cents     integer,
  opened_by_user_id     text,
  opened_by_tenant_id   uuid references tenants(id) on delete set null,
  opened_at             timestamptz not null default now(),
  assigned_at           timestamptz,
  completed_at          timestamptz,
  tenant_visible        boolean not null default true,
  metadata              jsonb not null default '{}'::jsonb,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);
create index if not exists tickets_ws_idx on tickets (workspace_id);
create index if not exists tickets_ws_status_idx on tickets (workspace_id, status);
create index if not exists tickets_ws_priority_idx on tickets (workspace_id, priority);
create index if not exists tickets_vendor_idx on tickets (assigned_vendor_id);
create index if not exists tickets_property_idx on tickets (property_id);
create trigger tickets_set_updated_at
  before update on tickets
  for each row execute function set_updated_at();

create table if not exists ticket_messages (
  id                    uuid primary key default gen_random_uuid(),
  workspace_id          uuid not null references workspaces(id) on delete cascade,
  ticket_id             uuid not null references tickets(id) on delete cascade,
  author_user_id        text,
  author_tenant_id      uuid references tenants(id) on delete set null,
  author_vendor_id      uuid,
  body                  text not null,
  is_internal           boolean not null default false,
  created_at            timestamptz not null default now(),
  check (
    (author_user_id is not null)::int
    + (author_tenant_id is not null)::int
    + (author_vendor_id is not null)::int
    = 1
  )
);
create index if not exists ticket_messages_ticket_idx on ticket_messages (ticket_id);
create index if not exists ticket_messages_ws_idx on ticket_messages (workspace_id);

create table if not exists ticket_attachments (
  id                    uuid primary key default gen_random_uuid(),
  workspace_id          uuid not null references workspaces(id) on delete cascade,
  ticket_id             uuid not null references tickets(id) on delete cascade,
  message_id            uuid references ticket_messages(id) on delete set null,
  storage_ref           text not null,
  filename              text,
  content_type          text,
  size_bytes            bigint,
  kind                  text check (kind in ('photo','video','document','receipt','other')),
  uploaded_by_user_id   text,
  uploaded_by_tenant_id uuid references tenants(id) on delete set null,
  uploaded_at           timestamptz not null default now()
);
create index if not exists ticket_attachments_ticket_idx on ticket_attachments (ticket_id);
create index if not exists ticket_attachments_ws_idx on ticket_attachments (workspace_id);
