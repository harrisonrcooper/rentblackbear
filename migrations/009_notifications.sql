-- 009_notifications.sql
-- In-app notifications + per-channel delivery attempts.
--
-- notifications carries the human-visible content. delivery_attempts
-- is the outbound log — one notification fans out to multiple
-- channels (in-app always, plus email/sms/push depending on the
-- recipient's preferences), and each channel gets its own row so
-- retry + failure diagnostics aren't lossy.

set search_path = public;

create table if not exists notifications (
  id                    uuid primary key default gen_random_uuid(),
  workspace_id          uuid not null references workspaces(id) on delete cascade,
  recipient_user_id     text,
  recipient_tenant_id   uuid references tenants(id) on delete cascade,
  recipient_vendor_id   uuid references vendors(id) on delete cascade,
  type                  text not null
                          check (type in
                            ('lease','payment','maint','announcement',
                             'alert','reminder','application','renewal','cron')),
  subject               text not null,
  body                  text,
  data                  jsonb not null default '{}'::jsonb,
  urgent                boolean not null default false,
  read                  boolean not null default false,
  read_at               timestamptz,
  dismissed_at          timestamptz,
  related_lease_id      uuid references leases(id) on delete set null,
  related_tenant_id     uuid references tenants(id) on delete set null,
  related_ticket_id     uuid references tickets(id) on delete set null,
  related_application_id uuid references applications(id) on delete set null,
  created_at            timestamptz not null default now(),
  check (
    (recipient_user_id is not null)::int
    + (recipient_tenant_id is not null)::int
    + (recipient_vendor_id is not null)::int
    = 1
  )
);
create index if not exists notifications_ws_idx on notifications (workspace_id);
create index if not exists notifications_user_idx
  on notifications (recipient_user_id) where recipient_user_id is not null;
create index if not exists notifications_tenant_idx
  on notifications (recipient_tenant_id) where recipient_tenant_id is not null;
create index if not exists notifications_ws_unread_idx
  on notifications (workspace_id, read)
  where read = false;
create index if not exists notifications_ws_created_idx
  on notifications (workspace_id, created_at desc);

create table if not exists delivery_attempts (
  id                    uuid primary key default gen_random_uuid(),
  workspace_id          uuid not null references workspaces(id) on delete cascade,
  notification_id       uuid not null references notifications(id) on delete cascade,
  channel               text not null
                          check (channel in ('email','sms','push','in_app','webhook')),
  provider              text
                          check (provider in
                            ('resend','twilio','apns','fcm','webhook','internal')
                          or provider is null),
  recipient_address     text,
  status                text not null default 'queued'
                          check (status in
                            ('queued','sent','delivered','failed','bounced','suppressed')),
  provider_message_id   text,
  error_code            text,
  error_message         text,
  attempted_at          timestamptz not null default now(),
  delivered_at          timestamptz,
  retry_of_attempt_id   uuid references delivery_attempts(id) on delete set null
);
create index if not exists delivery_attempts_notif_idx on delivery_attempts (notification_id);
create index if not exists delivery_attempts_ws_idx on delivery_attempts (workspace_id);
create index if not exists delivery_attempts_status_idx
  on delivery_attempts (workspace_id, status)
  where status in ('queued','failed');
