import { createClient } from '@supabase/supabase-js';
import type { SOPDocument, SOPGeneratedContent, SOPRevision, SOPStatus } from '../types/sop';

// Check environment variables first, then check localStorage overrides
const envUrl = import.meta.env.VITE_SUPABASE_URL || '';
const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

const storedUrl = typeof window !== 'undefined' ? localStorage.getItem('sop_supabase_url') : null;
const storedKey = typeof window !== 'undefined' ? localStorage.getItem('sop_supabase_key') : null;

export const SUPABASE_URL = storedUrl || envUrl;
export const SUPABASE_ANON_KEY = storedKey || envKey;

export const isSupabaseConfigured = (): boolean => {
  return (
    Boolean(SUPABASE_URL) &&
    Boolean(SUPABASE_ANON_KEY) &&
    !SUPABASE_URL.includes('your-project-id') &&
    SUPABASE_URL.startsWith('https://')
  );
};

// Fallback dummy client for build/demo when not configured
export const supabase = createClient(
  isSupabaseConfigured() ? SUPABASE_URL : 'https://placeholder-sop.supabase.co',
  isSupabaseConfigured() ? SUPABASE_ANON_KEY : 'placeholder-anon-key'
);

// Local demo storage helper when Supabase is not connected
const LOCAL_STORAGE_DOCS_KEY = 'sop_local_documents';

const getLocalDocs = (): SOPDocument[] => {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_DOCS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Failed to read local documents', e);
    return [];
  }
};

const saveLocalDocs = (docs: SOPDocument[]) => {
  try {
    localStorage.setItem(LOCAL_STORAGE_DOCS_KEY, JSON.stringify(docs));
  } catch (e) {
    console.error('Failed to save local documents', e);
  }
};

// ----------------------------------------------------------------------
// Document CRUD Operations
// ----------------------------------------------------------------------

export async function fetchUserDocuments(userId: string): Promise<SOPDocument[]> {
  if (!isSupabaseConfigured()) {
    const local = getLocalDocs();
    return local.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
  }

  const { data, error } = await supabase
    .from('sop_documents')
    .select('*')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false });

  if (error) {
    console.error('Supabase fetch error, falling back to local docs:', error);
    return getLocalDocs();
  }

  return (data as SOPDocument[]) || [];
}

export async function fetchDocumentById(id: string): Promise<SOPDocument | null> {
  if (!isSupabaseConfigured()) {
    const local = getLocalDocs();
    return local.find((d) => d.id === id) || null;
  }

  const { data, error } = await supabase
    .from('sop_documents')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Supabase fetch by id error:', error);
    const local = getLocalDocs();
    return local.find((d) => d.id === id) || null;
  }

  return data as SOPDocument;
}

export async function createSOPDocument(doc: Omit<SOPDocument, 'created_at' | 'updated_at'>): Promise<SOPDocument> {
  const now = new Date().toISOString();
  const newDoc: SOPDocument = {
    ...doc,
    created_at: now,
    updated_at: now,
  };

  // Always keep local in sync as safe cache
  const local = getLocalDocs();
  saveLocalDocs([newDoc, ...local.filter((d) => d.id !== newDoc.id)]);

  if (isSupabaseConfigured()) {
    const { data, error } = await supabase
      .from('sop_documents')
      .insert([newDoc])
      .select()
      .single();

    if (error) {
      console.warn('Supabase insert warning (saved locally):', error);
      return newDoc;
    }
    return data as SOPDocument;
  }

  return newDoc;
}

export async function updateSOPDocument(id: string, updates: Partial<SOPDocument>): Promise<SOPDocument | null> {
  const now = new Date().toISOString();
  const payload = {
    ...updates,
    updated_at: now,
  };

  // Update local cache
  const local = getLocalDocs();
  const index = local.findIndex((d) => d.id === id);
  let updatedDoc: SOPDocument | null = null;
  if (index !== -1) {
    updatedDoc = { ...local[index], ...payload };
    local[index] = updatedDoc;
    saveLocalDocs(local);
  }

  if (isSupabaseConfigured()) {
    const { data, error } = await supabase
      .from('sop_documents')
      .update(payload)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Supabase update error:', error);
      return updatedDoc;
    }
    return data as SOPDocument;
  }

  return updatedDoc;
}

export async function deleteSOPDocument(id: string): Promise<boolean> {
  // Remove from local cache
  const local = getLocalDocs();
  saveLocalDocs(local.filter((d) => d.id !== id));

  if (isSupabaseConfigured()) {
    const { error } = await supabase.from('sop_documents').delete().eq('id', id);
    if (error) {
      console.error('Supabase delete error:', error);
      return false;
    }
  }

  return true;
}

export async function duplicateSOPDocument(id: string, userId: string): Promise<SOPDocument | null> {
  const original = await fetchDocumentById(id);
  if (!original) return null;

  const duplicated: Omit<SOPDocument, 'created_at' | 'updated_at'> = {
    ...original,
    id: crypto.randomUUID(),
    user_id: userId,
    title: `${original.title} (Copy)`,
    version: 1,
    status: 'draft',
  };

  return createSOPDocument(duplicated);
}

// ----------------------------------------------------------------------
// Revision Tracking
// ----------------------------------------------------------------------

export async function saveSOPRevision(
  documentId: string,
  userId: string,
  content: SOPGeneratedContent,
  note?: string
): Promise<SOPRevision | null> {
  const rev: SOPRevision = {
    id: crypto.randomUUID(),
    document_id: documentId,
    user_id: userId,
    content,
    revision_note: note || 'User edited SOP revision',
    created_at: new Date().toISOString(),
  };

  if (isSupabaseConfigured()) {
    const { data, error } = await supabase
      .from('sop_revisions')
      .insert([rev])
      .select()
      .single();

    if (error) {
      console.warn('Supabase revision save warning:', error);
      return rev;
    }
    return data as SOPRevision;
  }

  return rev;
}

// ----------------------------------------------------------------------
// Storage Upload (PDFs)
// ----------------------------------------------------------------------

export async function uploadPDFToSupabase(
  userId: string,
  documentId: string,
  pdfBlob: Blob
): Promise<string | null> {
  if (!isSupabaseConfigured()) {
    return null;
  }

  const filePath = `${userId}/${documentId}_${Date.now()}.pdf`;

  const { error: uploadError } = await supabase.storage
    .from('sop_documents')
    .upload(filePath, pdfBlob, {
      contentType: 'application/pdf',
      upsert: true,
    });

  if (uploadError) {
    console.error('Supabase storage upload error:', uploadError);
    return null;
  }

  return filePath;
}

export async function getPDFDownloadUrl(storagePath: string): Promise<string | null> {
  if (!isSupabaseConfigured()) return null;

  const { data, error } = await supabase.storage
    .from('sop_documents')
    .createSignedUrl(storagePath, 3600); // 1 hour valid

  if (error || !data) {
    console.error('Failed to create signed URL:', error);
    return null;
  }

  return data.signedUrl;
}

