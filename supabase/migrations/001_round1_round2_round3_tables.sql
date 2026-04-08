-- ═══════════════════════════════════════════════════════════════════
-- Tenant Portal — Round 1, 2, 3 Feature Tables
-- Run against your Supabase project via SQL Editor or CLI
-- ═══════════════════════════════════════════════════════════════════

-- ── Round 1: Scheduled Payments ──
CREATE TABLE IF NOT EXISTS scheduled_payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  charge_id UUID REFERENCES charges(id) ON DELETE SET NULL,
  amount NUMERIC(10,2) NOT NULL DEFAULT 0,
  scheduled_date DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','processing','completed','cancelled')),
  is_installment BOOLEAN DEFAULT FALSE,
  installment_number INT,
  installment_total INT,
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_sched_pay_tenant ON scheduled_payments(tenant_id, status);

-- ── Round 1: Renewal Requests ──
CREATE TABLE IF NOT EXISTS renewal_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','pm_offered','tenant_countered','pm_countered','accepted','declined')),
  tenant_choice JSONB,
  pm_offer JSONB,
  tenant_counter JSONB,
  accepted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_renewal_tenant ON renewal_requests(tenant_id, status);

-- ── Round 1: Utility Bills ──
CREATE TABLE IF NOT EXISTS utility_bills (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  billing_month TEXT NOT NULL,
  total NUMERIC(10,2) NOT NULL DEFAULT 0,
  breakdown JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_util_prop ON utility_bills(property_id, billing_month);

-- ── Round 1: Activity Log (for notification center) ──
CREATE TABLE IF NOT EXISTS activity_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT,
  description TEXT,
  amount NUMERIC(10,2),
  date TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_activity_tenant ON activity_log(tenant_id, created_at DESC);

-- ── Round 2: Tenant Documents (vault) ──
CREATE TABLE IF NOT EXISTS tenant_documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  type TEXT NOT NULL DEFAULT 'other',
  filename TEXT NOT NULL,
  file_data TEXT,
  file_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_docs_tenant ON tenant_documents(tenant_id);

-- ── Round 2: Document Requests (PM asks tenant for docs) ──
CREATE TABLE IF NOT EXISTS document_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  pm_id UUID,
  type TEXT NOT NULL,
  title TEXT,
  deadline DATE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','fulfilled','expired')),
  fulfilled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_docreq_tenant ON document_requests(tenant_id, status);

-- ── Round 2: Tenant Insurance ──
CREATE TABLE IF NOT EXISTS tenant_insurance (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  provider TEXT,
  policy_number TEXT,
  expiration DATE,
  coverage_amount NUMERIC(12,2),
  file_data TEXT,
  file_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_ins_tenant ON tenant_insurance(tenant_id);

-- ── Round 2: Guest Registrations ──
CREATE TABLE IF NOT EXISTS guest_registrations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  property_id UUID REFERENCES properties(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  relationship TEXT DEFAULT 'friend',
  visit_date DATE NOT NULL,
  visit_end DATE,
  phone TEXT,
  temp_code TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','completed','cancelled')),
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_guest_tenant ON guest_registrations(tenant_id, status);

-- ── Round 2: Inspections ──
CREATE TABLE IF NOT EXISTS inspections (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  property_id UUID REFERENCES properties(id) ON DELETE SET NULL,
  room_id UUID,
  type TEXT NOT NULL CHECK (type IN ('move_in','move_out')),
  rooms JSONB NOT NULL DEFAULT '[]',
  signature TEXT,
  submitted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_insp_tenant ON inspections(tenant_id);

-- ── Round 3: Community Posts ──
CREATE TABLE IF NOT EXISTS community_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  author TEXT NOT NULL,
  body TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_comm_prop ON community_posts(property_id, created_at DESC);

-- ── Round 3: Amenities ──
CREATE TABLE IF NOT EXISTS amenities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slots JSONB DEFAULT '[]',
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_amen_prop ON amenities(property_id);

-- ── Round 3: Amenity Bookings ──
CREATE TABLE IF NOT EXISTS amenity_bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  amenity_id UUID REFERENCES amenities(id) ON DELETE CASCADE,
  tenant_name TEXT,
  date DATE NOT NULL,
  time_slot TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','completed','cancelled')),
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_abk_tenant ON amenity_bookings(tenant_id, date);
CREATE INDEX IF NOT EXISTS idx_abk_amenity ON amenity_bookings(amenity_id, date);

-- ── Round 3: Tenant Surveys ──
CREATE TABLE IF NOT EXISTS tenant_surveys (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('move_in','renewal','maintenance','general')),
  title TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','completed','skipped')),
  rating INT CHECK (rating BETWEEN 1 AND 5),
  recommend TEXT CHECK (recommend IN ('yes','no','maybe')),
  improve TEXT,
  love TEXT,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_survey_tenant ON tenant_surveys(tenant_id, status);

-- ── Round 3: Packages ──
CREATE TABLE IF NOT EXISTS packages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  property_id UUID REFERENCES properties(id) ON DELETE SET NULL,
  carrier TEXT,
  tracking TEXT,
  description TEXT,
  locker TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','picked_up','returned')),
  received_at TIMESTAMPTZ DEFAULT now(),
  picked_up_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_pkg_tenant ON packages(tenant_id, status);

-- ── Round 3: Audit Log ──
CREATE TABLE IF NOT EXISTS audit_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  description TEXT,
  date TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_audit_tenant ON audit_log(tenant_id, created_at DESC);

-- ── Column additions to existing tables ──

-- portal_users: notification last seen
ALTER TABLE portal_users ADD COLUMN IF NOT EXISTS notif_last_seen TIMESTAMPTZ;

-- maintenance_requests: lifecycle fields
ALTER TABLE maintenance_requests ADD COLUMN IF NOT EXISTS technician TEXT;
ALTER TABLE maintenance_requests ADD COLUMN IF NOT EXISTS eta DATE;
ALTER TABLE maintenance_requests ADD COLUMN IF NOT EXISTS completion_photos JSONB;
ALTER TABLE maintenance_requests ADD COLUMN IF NOT EXISTS resolved_at TIMESTAMPTZ;
ALTER TABLE maintenance_requests ADD COLUMN IF NOT EXISTS tenant_rating TEXT;
ALTER TABLE maintenance_requests ADD COLUMN IF NOT EXISTS tenant_feedback TEXT;
ALTER TABLE maintenance_requests ADD COLUMN IF NOT EXISTS feedback_at TIMESTAMPTZ;

-- tenants: notice/renewal tracking
ALTER TABLE tenants ADD COLUMN IF NOT EXISTS notice_given_at DATE;
ALTER TABLE tenants ADD COLUMN IF NOT EXISTS intended_move_out DATE;

-- ── Row Level Security ──
-- Enable RLS on all new tables (tenants can only see their own data)

ALTER TABLE scheduled_payments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Tenants see own scheduled_payments" ON scheduled_payments FOR ALL USING (tenant_id IN (SELECT tenant_id FROM portal_users WHERE auth_user_id = auth.uid()));

ALTER TABLE renewal_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Tenants see own renewal_requests" ON renewal_requests FOR ALL USING (tenant_id IN (SELECT tenant_id FROM portal_users WHERE auth_user_id = auth.uid()));

ALTER TABLE tenant_documents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Tenants see own documents" ON tenant_documents FOR ALL USING (tenant_id IN (SELECT tenant_id FROM portal_users WHERE auth_user_id = auth.uid()));

ALTER TABLE document_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Tenants see own doc_requests" ON document_requests FOR ALL USING (tenant_id IN (SELECT tenant_id FROM portal_users WHERE auth_user_id = auth.uid()));

ALTER TABLE tenant_insurance ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Tenants see own insurance" ON tenant_insurance FOR ALL USING (tenant_id IN (SELECT tenant_id FROM portal_users WHERE auth_user_id = auth.uid()));

ALTER TABLE guest_registrations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Tenants see own guests" ON guest_registrations FOR ALL USING (tenant_id IN (SELECT tenant_id FROM portal_users WHERE auth_user_id = auth.uid()));

ALTER TABLE inspections ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Tenants see own inspections" ON inspections FOR ALL USING (tenant_id IN (SELECT tenant_id FROM portal_users WHERE auth_user_id = auth.uid()));

ALTER TABLE community_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Tenants see property posts" ON community_posts FOR SELECT USING (property_id IN (SELECT property_id FROM tenants WHERE id IN (SELECT tenant_id FROM portal_users WHERE auth_user_id = auth.uid())));
CREATE POLICY "Tenants insert own posts" ON community_posts FOR INSERT WITH CHECK (TRUE);

ALTER TABLE amenity_bookings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Tenants see own bookings" ON amenity_bookings FOR ALL USING (tenant_id IN (SELECT tenant_id FROM portal_users WHERE auth_user_id = auth.uid()));

ALTER TABLE amenities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Tenants see property amenities" ON amenities FOR SELECT USING (property_id IN (SELECT property_id FROM tenants WHERE id IN (SELECT tenant_id FROM portal_users WHERE auth_user_id = auth.uid())));

ALTER TABLE tenant_surveys ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Tenants see own surveys" ON tenant_surveys FOR ALL USING (tenant_id IN (SELECT tenant_id FROM portal_users WHERE auth_user_id = auth.uid()));

ALTER TABLE packages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Tenants see own packages" ON packages FOR ALL USING (tenant_id IN (SELECT tenant_id FROM portal_users WHERE auth_user_id = auth.uid()));

ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Tenants see own audit" ON audit_log FOR SELECT USING (tenant_id IN (SELECT tenant_id FROM portal_users WHERE auth_user_id = auth.uid()));

ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Tenants see own activity" ON activity_log FOR SELECT USING (tenant_id IN (SELECT tenant_id FROM portal_users WHERE auth_user_id = auth.uid()));

-- ── Utility bill config stored in app_data ──
-- Key pattern: "utility-config-{property_id}"
-- Value: { "coverageAmount": 100, "residents": 4 }
-- No separate table needed — uses existing app_data key-value store
