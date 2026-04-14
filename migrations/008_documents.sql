-- 008_documents.sql
-- Generic document library + generic signatures + the storage_refs
-- registry that every other table points at when they store files.

set search_path = public;

-- storage_refs is the single place we record "this blob lives at
-- <provider>://<bucket>/<path>". Other tables use storage_ref as
-- a text column for backward compat with the legacy admin (which
-- stores bare paths); new code should insert a storage_refs row
-- and reference its id.
create table if not exists storage_refs (
  id                    uuid primary key default gen_random_uuid(),
  workspace_id          uuid not null references workspaces(id) on delete cascade,
  provider              text not null
                          check (provider in ('supabase','s3','blob','b2','local')),
  bucket                text not null,
  path                  text not null,
  content_type          text,
  size_bytes            bigint,
  checksum_sha256       text,
  visibility            text not null default 'private'
                          check (visibility in ('private','signed-url','public')),
  uploaded_by_user_id   text,
  uploaded_by_tenant_id uuid references tenants(id) on delete set null,
  created_at            timestamptz not null default now(),
  unique (provider, bucket, path)
);
create index if not exists storage_refs_ws_idx on storage_refs (workspace_id);

-- documents = the generic library the admin's Documents tab shows.
-- Lease / addendum PDFs also live here in addition to the lease-
-- specific pdf_storage_ref, so a document is the canonical
-- "something a human uploaded or generated we might need later".
create table if not exists documents (
  id                    uuid primary key default gen_random_uuid(),
  workspace_id          uuid not null references workspaces(id) on delete cascade,
  name                  text not null,
  type                  text not null
                          check (type in
                            ('lease','addendum','rules','checklist','receipt',
                             'report','inspection','insurance','license',
                             'bank_statement','tax_return','photo','other')),
  property_id           uuid references properties(id) on delete set null,
  unit_id               uuid references units(id) on delete set null,
  tenant_id             uuid references tenants(id) on delete set null,
  lease_id              uuid references leases(id) on delete set null,
  vendor_id             uuid,
  ticket_id             uuid references tickets(id) on delete set null,
  storage_ref_id        uuid references storage_refs(id) on delete set null,
  storage_ref           text,
  content_markdown      text,
  tags                  jsonb not null default '[]'::jsonb,
  tenant_visible        boolean not null default false,
  uploaded_by_user_id   text,
  uploaded_at           timestamptz not null default now(),
  archived_at           timestamptz,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now(),
  check (storage_ref_id is not null or storage_ref is not null or content_markdown is not null)
);
create index if not exists documents_ws_idx on documents (workspace_id);
create index if not exists documents_ws_type_idx on documents (workspace_id, type);
create index if not exists documents_property_idx on documents (property_id);
create index if not exists documents_tenant_idx on documents (tenant_id);
create index if not exists documents_lease_idx on documents (lease_id);
create trigger documents_set_updated_at
  before update on documents
  for each row execute function set_updated_at();

-- Generic signature records for non-lease documents (e.g. a
-- service agreement with a vendor, a rules acknowledgment). Lease
-- signatures live in migration 004 and aren't duplicated here.
create table if not exists document_signatures (
  id                    uuid primary key default gen_random_uuid(),
  workspace_id          uuid not null references workspaces(id) on delete cascade,
  document_id           uuid not null references documents(id) on delete cascade,
  signer_name           text not null,
  signer_email          citext,
  signer_kind           text
                          check (signer_kind in ('operator','tenant','vendor','witness','other')),
  signature_svg         text,
  initials_data         jsonb,
  signed_at             timestamptz not null default now(),
  ip_address            inet,
  user_agent            text
);
create index if not exists document_signatures_doc_idx on document_signatures (document_id);
create index if not exists document_signatures_ws_idx on document_signatures (workspace_id);

alter table documents
  add constraint documents_vendor_fk
  foreign key (vendor_id) references vendors(id) on delete set null;
