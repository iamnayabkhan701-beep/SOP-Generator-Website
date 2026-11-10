-- =====================================================================
-- SOPFlow Enterprise Database Schema & Row-Level Security (RLS)
-- Platform: Supabase / PostgreSQL 15+
-- =====================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================================
-- 2. USER PROFILES TABLE
-- =====================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  role TEXT DEFAULT 'member' CHECK (role IN ('admin', 'manager', 'member')),
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================================
-- 3. DEPARTMENTS DIRECTORY
-- =====================================================================
CREATE TABLE IF NOT EXISTS public.departments (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  is_regulated BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed initial 24 departments
INSERT INTO public.departments (id, name, description, is_regulated) VALUES
  ('hr', 'Human Resources', 'Personnel, onboarding, and internal talent governance.', FALSE),
  ('it', 'Information Technology', 'Cloud infrastructure, identity, and change control.', FALSE),
  ('safety', 'Workplace Safety & EHS', 'OSHA/EHS protocols, PPE, and hazardous energy control.', TRUE),
  ('manufacturing', 'Manufacturing & Operations', 'Machinery tooling, line clearance, and assembly.', TRUE),
  ('quality', 'Quality Control (QA/QC)', 'AQL inspection, sampling, and non-conformance disposition.', TRUE),
  ('healthcare', 'Healthcare Administration', 'HIPAA record privacy and clinical administrative operations.', TRUE),
  ('finance', 'Finance & Accounting', '3-way matching, invoice authorizations, and audit trails.', TRUE),
  ('customer-service', 'Customer Service & Support', 'Ticket triage, escalation matrices, and resolution SLAs.', FALSE),
  ('office', 'Office Administration', 'Facility access, security logging, and operational upkeep.', FALSE),
  ('operations', 'General Business Operations', 'Cross-functional standard operating procedures.', FALSE),
  ('warehouse', 'Warehouse Management', 'Receiving inspection, cycle counts, and forklift safety.', TRUE),
  ('supply-chain', 'Supply Chain Management', 'Sourcing, purchase orders, and lead time planning.', FALSE),
  ('logistics', 'Logistics & Distribution', 'Outbound freight, carrier SLAs, and shipment tracking.', FALSE),
  ('construction', 'Construction & Site Safety', 'Working at heights, fall arrest, and scaffolding tags.', TRUE),
  ('retail', 'Retail Operations', 'Cash register reconciliation, opening/closing, and shrinkage.', FALSE),
  ('food-service', 'Food Service & Restaurant', 'HACCP critical control points, cooking temps, and cold holding.', TRUE),
  ('cybersecurity', 'Cybersecurity & Incident Response', 'NIST PICERL containment and breach notification.', TRUE),
  ('environmental', 'Environmental Compliance', 'Emissions monitoring, hazardous waste, and EPA filings.', TRUE),
  ('sales', 'Sales Process & CRM', 'Lead qualification, proposal signoffs, and pipeline governance.', FALSE),
  ('marketing', 'Marketing Operations', 'Campaign approvals, brand asset compliance, and analytics.', FALSE),
  ('legal', 'Legal & Compliance', 'Contract review, retention schedules, and statutory filings.', TRUE),
  ('remote-work', 'Remote Work Policy', 'Virtual work guidelines, endpoint encryption, and comms.', FALSE),
  ('procurement', 'Procurement & Purchasing', 'Strategic vendor due diligence, RFP bids, and contracts.', TRUE),
  ('qa', 'Quality Assurance (QA)', 'Quality management system audits, corrective action plans (CAPA), and SOP life cycle control.', TRUE),
  ('qc', 'Quality Control (QC)', 'Incoming material validation, analytical testing, line clearance, and non-conformance.', TRUE),
  ('education', 'Education & Academic Operations', 'Student enrollment, curriculum change control, FERPA security, and examination integrity.', FALSE),
  ('laboratory', 'Laboratory Operations', 'Specimen accessioning, analytical instrument calibration, chemical hygiene, and biohazard disposal.', TRUE),
  ('maintenance', 'Maintenance & Reliability', 'Preventive maintenance scheduling, Total Productive Maintenance (TPM), and work order tracking.', TRUE),
  ('security', 'Physical & Asset Security', 'Access control badge management, CCTV operations, alarm response, and key custody.', TRUE),
  ('rd', 'Research & Development (R&D)', 'Stage-gate development, laboratory notebook verification, intellectual property, and prototype safety.', FALSE),
  ('custom', 'Custom Department', 'Bespoke operational workflow procedures.', FALSE)
ON CONFLICT (id) DO NOTHING;

-- =====================================================================
-- 4. SOPS (STANDARD OPERATING PROCEDURES) TABLE
-- =====================================================================
CREATE TABLE IF NOT EXISTS public.sops (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  selected_topic TEXT,
  category TEXT NOT NULL REFERENCES public.departments(id),
  theme TEXT NOT NULL DEFAULT 'corporate-black',
  structure TEXT NOT NULL DEFAULT 'standard',
  target_page_count INTEGER DEFAULT 3,
  status TEXT NOT NULL DEFAULT 'ready' CHECK (status IN ('draft', 'generating', 'ready', 'failed', 'archived')),
  form_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  generated_content JSONB,
  edited_content JSONB,
  actual_page_count INTEGER,
  pdf_storage_path TEXT,
  version INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  archived_at TIMESTAMPTZ
);

-- Indexing for rapid queries
CREATE INDEX IF NOT EXISTS idx_sops_user_id ON public.sops(user_id);
CREATE INDEX IF NOT EXISTS idx_sops_category ON public.sops(category);
CREATE INDEX IF NOT EXISTS idx_sops_status ON public.sops(status);
CREATE INDEX IF NOT EXISTS idx_sops_created_at ON public.sops(created_at DESC);

-- =====================================================================
-- 5. SOP REVISIONS & AUDIT VERSIONS TABLE
-- =====================================================================
CREATE TABLE IF NOT EXISTS public.sop_revisions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  document_id UUID NOT NULL REFERENCES public.sops(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content JSONB NOT NULL,
  revision_note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sop_revisions_doc_id ON public.sop_revisions(document_id);

-- =====================================================================
-- 6. AUDIT LOGS TABLE
-- =====================================================================
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON public.audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON public.audit_logs(created_at DESC);

-- =====================================================================
-- 7. USER SETTINGS TABLE
-- =====================================================================
CREATE TABLE IF NOT EXISTS public.user_settings (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  company_name TEXT DEFAULT '',
  preferred_theme TEXT DEFAULT 'corporate-black',
  preferred_format TEXT DEFAULT 'standard',
  notify_on_revision BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================================
-- 8. ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sops ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sop_revisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;

-- Helper function: Check if current user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (
    auth.jwt() ->> 'email' = 'iamnayabkhan701@gmail.com'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Profiles Policies
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id OR public.is_admin());

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id OR public.is_admin());

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Departments Policies (Public read, admin write)
CREATE POLICY "Anyone authenticated can view departments"
  ON public.departments FOR SELECT
  TO authenticated
  USING (true);

-- SOPs Policies (Strict Tenant Isolation)
CREATE POLICY "Users can view only their own SOPs"
  ON public.sops FOR SELECT
  USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Users can insert only their own SOPs"
  ON public.sops FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update only their own SOPs"
  ON public.sops FOR UPDATE
  USING (auth.uid() = user_id OR public.is_admin())
  WITH CHECK (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Users can delete only their own SOPs"
  ON public.sops FOR DELETE
  USING (auth.uid() = user_id OR public.is_admin());

-- SOP Revisions Policies
CREATE POLICY "Users can view revisions of their own SOPs"
  ON public.sop_revisions FOR SELECT
  USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Users can insert revisions for their own SOPs"
  ON public.sop_revisions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- User Settings Policies
CREATE POLICY "Users can view and manage their own settings"
  ON public.user_settings FOR ALL
  USING (auth.uid() = user_id OR public.is_admin())
  WITH CHECK (auth.uid() = user_id OR public.is_admin());

-- Audit Logs Policies (Admins can view all; users view their own)
CREATE POLICY "Users view own audit logs"
  ON public.audit_logs FOR SELECT
  USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "System can insert audit logs"
  ON public.audit_logs FOR INSERT
  WITH CHECK (auth.uid() = user_id OR auth.uid() IS NULL);

-- =====================================================================
-- 9. AUTOMATIC USER PROFILE TRIGGER ON AUTH SIGNUP
-- =====================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    CASE WHEN NEW.email = 'iamnayabkhan701@gmail.com' THEN 'admin' ELSE 'member' END
  );

  INSERT INTO public.user_settings (user_id, company_name)
  VALUES (NEW.id, 'My Organization');

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Bind trigger to auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =====================================================================
-- 10. STORAGE BUCKET FOR SOP PDF DOCUMENTS
-- =====================================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('sop-documents', 'sop-documents', false)
ON CONFLICT (id) DO NOTHING;

-- Storage Policies
CREATE POLICY "Authenticated users can upload SOP PDFs"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'sop-documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can read own SOP PDFs"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (bucket_id = 'sop-documents' AND (auth.uid()::text = (storage.foldername(name))[1] OR public.is_admin()));

CREATE POLICY "Users can delete own SOP PDFs"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'sop-documents' AND (auth.uid()::text = (storage.foldername(name))[1] OR public.is_admin()));

