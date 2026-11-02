-- ==============================================================================
-- AI-Powered SOP Generator - Database Schema & Security Migration
-- Compliant with AGENT.md requirements
-- ==============================================================================

-- 1. Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Enable RLS for profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    NEW.email
  )
  ON CONFLICT (id) DO UPDATE
  SET full_name = EXCLUDED.full_name,
      email = EXCLUDED.email,
      updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- 2. SOP Documents Table
CREATE TABLE IF NOT EXISTS public.sop_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  theme TEXT NOT NULL DEFAULT 'professional-blue',
  structure TEXT NOT NULL DEFAULT 'standard',
  target_page_count INTEGER DEFAULT 3,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'generating', 'ready', 'failed', 'archived')),
  form_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  generated_content JSONB,
  edited_content JSONB,
  actual_page_count INTEGER,
  pdf_storage_path TEXT,
  version INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  archived_at TIMESTAMPTZ
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_sop_documents_user_id ON public.sop_documents(user_id);
CREATE INDEX IF NOT EXISTS idx_sop_documents_status ON public.sop_documents(status);
CREATE INDEX IF NOT EXISTS idx_sop_documents_category ON public.sop_documents(category);
CREATE INDEX IF NOT EXISTS idx_sop_documents_updated_at ON public.sop_documents(updated_at DESC);

-- Enable RLS for sop_documents
ALTER TABLE public.sop_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own documents"
  ON public.sop_documents FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own documents"
  ON public.sop_documents FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own documents"
  ON public.sop_documents FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own documents"
  ON public.sop_documents FOR DELETE
  USING (auth.uid() = user_id);


-- 3. SOP Revisions Table
CREATE TABLE IF NOT EXISTS public.sop_revisions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID NOT NULL REFERENCES public.sop_documents(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content JSONB NOT NULL,
  revision_note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_sop_revisions_doc_id ON public.sop_revisions(document_id);
CREATE INDEX IF NOT EXISTS idx_sop_revisions_user_id ON public.sop_revisions(user_id);

-- Enable RLS for sop_revisions
ALTER TABLE public.sop_revisions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view revisions of their documents"
  ON public.sop_revisions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert revisions for their documents"
  ON public.sop_revisions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete revisions of their documents"
  ON public.sop_revisions FOR DELETE
  USING (auth.uid() = user_id);


-- 4. Storage Bucket Setup (Private)
INSERT INTO storage.buckets (id, name, public)
VALUES ('sop_documents', 'sop_documents', false)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS policies
CREATE POLICY "Users can upload their own PDFs"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'sop_documents' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can view their own PDFs"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'sop_documents' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can update their own PDFs"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'sop_documents' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can delete their own PDFs"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'sop_documents' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

