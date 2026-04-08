-- ═══════════════════════════════════════════════════════════════════
-- Admin Data Migration: app_data JSON blobs → proper relational tables
-- Run via Supabase SQL Editor
-- ═══════════════════════════════════════════════════════════════════

-- ── Applications (replaces hq-apps blob) ──
CREATE TABLE IF NOT EXISTS applications (
  id TEXT PRIMARY KEY,
  pm_id UUID REFERENCES pm_accounts(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  property TEXT,
  room TEXT,
  move_in TEXT,
  income TEXT,
  status TEXT NOT NULL DEFAULT 'new-lead',
  submitted TEXT,
  bg_check TEXT DEFAULT 'not-started',
  credit_score TEXT DEFAULT '—',
  refs TEXT DEFAULT 'not-started',
  source TEXT,
  last_contact TEXT,
  denied_reason TEXT,
  denied_date TEXT,
  prev_stage TEXT,
  notes TEXT,
  data JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_apps_pm ON applications(pm_id, status);
CREATE INDEX IF NOT EXISTS idx_apps_email ON applications(email);

-- ── Expenses (replaces hq-expenses blob) ──
CREATE TABLE IF NOT EXISTS expenses (
  id TEXT PRIMARY KEY,
  pm_id UUID REFERENCES pm_accounts(id) ON DELETE CASCADE,
  property_id TEXT,
  date TEXT NOT NULL,
  vendor TEXT,
  category TEXT,
  subcategory TEXT,
  description TEXT,
  amount NUMERIC(10,2) NOT NULL DEFAULT 0,
  receipt_url TEXT,
  notes TEXT,
  data JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_exp_pm ON expenses(pm_id, date);

-- ── Mortgages (replaces hq-mortgages blob) ──
CREATE TABLE IF NOT EXISTS mortgages (
  id TEXT PRIMARY KEY,
  pm_id UUID REFERENCES pm_accounts(id) ON DELETE CASCADE,
  property_id TEXT,
  lender TEXT,
  balance NUMERIC(12,2) DEFAULT 0,
  rate NUMERIC(5,3),
  payment NUMERIC(10,2),
  data JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ── Vendors (replaces hq-vendors blob) ──
CREATE TABLE IF NOT EXISTS vendors (
  id TEXT PRIMARY KEY,
  pm_id UUID REFERENCES pm_accounts(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT,
  phone TEXT,
  email TEXT,
  notes TEXT,
  data JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ── Capital Improvements (replaces hq-improvements blob) ──
CREATE TABLE IF NOT EXISTS improvements (
  id TEXT PRIMARY KEY,
  pm_id UUID REFERENCES pm_accounts(id) ON DELETE CASCADE,
  property_id TEXT,
  description TEXT,
  amount NUMERIC(10,2) DEFAULT 0,
  date TEXT,
  category TEXT,
  data JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ── Admin Notifications (replaces hq-notifs blob) ──
CREATE TABLE IF NOT EXISTS admin_notifications (
  id TEXT PRIMARY KEY,
  pm_id UUID REFERENCES pm_accounts(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  msg TEXT NOT NULL,
  date TEXT,
  read BOOLEAN DEFAULT FALSE,
  urgent BOOLEAN DEFAULT FALSE,
  data JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_notif_pm ON admin_notifications(pm_id, read, created_at DESC);

-- ── Transactions (replaces hq-txns blob) ──
CREATE TABLE IF NOT EXISTS transactions (
  id TEXT PRIMARY KEY,
  pm_id UUID REFERENCES pm_accounts(id) ON DELETE CASCADE,
  date TEXT NOT NULL,
  type TEXT NOT NULL,
  description TEXT,
  amount NUMERIC(10,2) NOT NULL DEFAULT 0,
  prop_id TEXT,
  category TEXT,
  data JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_txn_pm ON transactions(pm_id, date);

-- ── Admin Documents (replaces hq-docs blob) ──
CREATE TABLE IF NOT EXISTS admin_documents (
  id TEXT PRIMARY KEY,
  pm_id UUID REFERENCES pm_accounts(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT,
  property TEXT,
  tenant TEXT,
  tenant_room_id TEXT,
  uploaded TEXT,
  size TEXT,
  content JSONB DEFAULT '{}',
  data JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ── Rocks / Goals (replaces hq-rocks blob) ──
CREATE TABLE IF NOT EXISTS rocks (
  id TEXT PRIMARY KEY,
  pm_id UUID REFERENCES pm_accounts(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  owner TEXT,
  status TEXT DEFAULT 'not-started',
  due TEXT,
  notes TEXT,
  data JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ── Issues (replaces hq-issues blob) ──
CREATE TABLE IF NOT EXISTS issues (
  id TEXT PRIMARY KEY,
  pm_id UUID REFERENCES pm_accounts(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  priority TEXT DEFAULT 'medium',
  created TEXT,
  resolved BOOLEAN DEFAULT FALSE,
  notes TEXT,
  data JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ── Ideas / Product Board (replaces hq-ideas blob) ──
CREATE TABLE IF NOT EXISTS ideas (
  id TEXT PRIMARY KEY,
  pm_id UUID REFERENCES pm_accounts(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  category TEXT,
  priority TEXT DEFAULT 'medium',
  status TEXT DEFAULT 'Idea',
  notes TEXT,
  link TEXT,
  archived BOOLEAN DEFAULT FALSE,
  data JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ── Archived Tenants (replaces hq-archive blob) ──
CREATE TABLE IF NOT EXISTS archived_tenants (
  id TEXT PRIMARY KEY,
  pm_id UUID REFERENCES pm_accounts(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  room_name TEXT,
  prop_name TEXT,
  rent NUMERIC(10,2),
  move_in TEXT,
  lease_end TEXT,
  terminated_date TEXT,
  reason TEXT,
  data JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ── Scorecard History (replaces hq-sc blob) ──
CREATE TABLE IF NOT EXISTS scorecard_history (
  id TEXT PRIMARY KEY,
  pm_id UUID REFERENCES pm_accounts(id) ON DELETE CASCADE,
  week TEXT,
  label TEXT,
  data JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ── Monthly Snapshots (replaces hq-monthly blob) ──
CREATE TABLE IF NOT EXISTS monthly_snapshots (
  id TEXT PRIMARY KEY,
  pm_id UUID REFERENCES pm_accounts(id) ON DELETE CASCADE,
  month TEXT NOT NULL,
  label TEXT,
  data JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ── Maintenance Requests — add fields for admin-side data ──
ALTER TABLE maintenance_requests ADD COLUMN IF NOT EXISTS prop_id TEXT;
ALTER TABLE maintenance_requests ADD COLUMN IF NOT EXISTS photos INT DEFAULT 0;

-- ── Credits (replaces hq-credits blob) ──
CREATE TABLE IF NOT EXISTS credits (
  id TEXT PRIMARY KEY,
  pm_id UUID REFERENCES pm_accounts(id) ON DELETE CASCADE,
  room_id TEXT,
  tenant_name TEXT,
  amount NUMERIC(10,2) DEFAULT 0,
  reason TEXT,
  date TEXT,
  applied BOOLEAN DEFAULT FALSE,
  data JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ── Security Deposit Ledger (replaces hq-sdledger blob) ──
CREATE TABLE IF NOT EXISTS sd_ledger (
  id TEXT PRIMARY KEY,
  pm_id UUID REFERENCES pm_accounts(id) ON DELETE CASCADE,
  room_id TEXT,
  tenant_name TEXT,
  prop_name TEXT,
  room_name TEXT,
  amount_held NUMERIC(10,2) DEFAULT 0,
  deposits JSONB DEFAULT '[]',
  deductions JSONB DEFAULT '[]',
  returned BOOLEAN DEFAULT FALSE,
  return_date TEXT,
  data JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ── Renewal Offers from admin side (replaces hq-renewal-offers blob) ──
-- NOTE: renewal_requests table already exists for portal side.
-- We add a separate admin-side table for offers initiated by PM.
CREATE TABLE IF NOT EXISTS renewal_offers (
  id TEXT PRIMARY KEY,
  pm_id UUID REFERENCES pm_accounts(id) ON DELETE CASCADE,
  tenant_id TEXT,
  proposed_rent NUMERIC(10,2),
  term TEXT,
  note TEXT,
  status TEXT DEFAULT 'pending',
  data JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ══════════════════════════════════════════════════════════════════
-- ANON KEY ACCESS POLICIES
-- These allow the anon key to read/write these tables.
-- In production, replace with proper admin auth + RLS.
-- ══════════════════════════════════════════════════════════════════

-- Disable RLS on admin tables so anon key can access them
-- (These tables don't have tenant-facing data — admin only)
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anon_full_access" ON applications FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anon_full_access" ON expenses FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE mortgages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anon_full_access" ON mortgages FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anon_full_access" ON vendors FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE improvements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anon_full_access" ON improvements FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE admin_notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anon_full_access" ON admin_notifications FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anon_full_access" ON transactions FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE admin_documents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anon_full_access" ON admin_documents FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE rocks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anon_full_access" ON rocks FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE issues ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anon_full_access" ON issues FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE ideas ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anon_full_access" ON ideas FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE archived_tenants ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anon_full_access" ON archived_tenants FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE scorecard_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anon_full_access" ON scorecard_history FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE monthly_snapshots ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anon_full_access" ON monthly_snapshots FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE credits ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anon_full_access" ON credits FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE sd_ledger ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anon_full_access" ON sd_ledger FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE renewal_offers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anon_full_access" ON renewal_offers FOR ALL USING (true) WITH CHECK (true);
