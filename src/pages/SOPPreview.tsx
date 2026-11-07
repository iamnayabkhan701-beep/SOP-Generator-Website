import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Download,
  Save,
  ArrowLeft,
  Check,
  Printer,
  Sparkles,
  Plus,
  FileText,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAuth } from '../context/AuthContext';
import {
  fetchDocumentById,
  updateSOPDocument,
  saveSOPRevision,
  uploadPDFToSupabase,
} from '../lib/supabase';
import type { SOPDocument, SOPGeneratedContent, SOPSection } from '../types/sop';
import {
  generateSOPPdf,
  generateSOPPdfFromElement,
  printDocumentViaBrowser,
} from '../lib/pdfGenerator';
import { SOPDocumentView } from '../components/SOPDocumentView';

export const SOPPreview: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [doc, setDoc] = useState<SOPDocument | null>(null);
  const [content, setContent] = useState<SOPGeneratedContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Section Editing State
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);
  const [tempTitle, setTempTitle] = useState('');
  const [tempContent, setTempContent] = useState('');

  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetchDocumentById(id, user?.id).then((found) => {
      if (found) {
        setDoc(found);
        const initial = found.edited_content || found.generated_content;
        setContent(initial || null);
      }
      setLoading(false);
    });
  }, [id, user]);

  const handleSaveDraft = async () => {
    if (!doc || !content || !user) return;
    setIsSaving(true);

    try {
      await updateSOPDocument(doc.id, {
        edited_content: content,
        status: 'ready',
        version: (doc.version || 1) + 1,
      });

      await saveSOPRevision(doc.id, user.id, content, 'Manual review revision update');

      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2500);
    } catch (e) {
      console.error('Save error:', e);
      alert('Failed to save changes.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleExportPDF = async () => {
    if (!doc || !content) return;
    setIsExporting(true);

    try {
      let blob: Blob;
      let pageCount: number;
      let filename: string;

      if (previewRef.current) {
        ({ blob, pageCount, filename } = await generateSOPPdfFromElement(
          previewRef.current,
          content,
          doc.title
        ));
      } else {
        ({ blob, pageCount, filename } = await generateSOPPdf({
          content,
          theme: doc.theme,
          structure: doc.structure,
          organizationName: doc.form_data?.companyName,
        }));
      }

      // Download file in browser
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      // Upload copy to Supabase if configured
      if (user) {
        const storagePath = await uploadPDFToSupabase(user.id, doc.id, blob);
        await updateSOPDocument(doc.id, {
          actual_page_count: pageCount,
          pdf_storage_path: storagePath || undefined,
          status: 'ready',
        });
      }

      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.8 },
      });
    } catch (e: any) {
      console.error('PDF export error:', e);
      alert('Failed to generate PDF: ' + e.message);
    } finally {
      setIsExporting(false);
    }
  };

  const startEditSection = (sec: SOPSection) => {
    setEditingSectionId(sec.id);
    setTempTitle(sec.title);
    setTempContent(sec.content || '');
  };

  const saveEditSection = (sectionId: string) => {
    if (!content) return;
    const updatedSections = content.sections.map((s) => {
      if (s.id === sectionId) {
        return {
          ...s,
          title: tempTitle,
          content: tempContent,
        };
      }
      return s;
    });
    setContent({ ...content, sections: updatedSections });
    setEditingSectionId(null);
  };

  const moveSection = (index: number, direction: 'up' | 'down') => {
    if (!content) return;
    const newSections = [...content.sections];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newSections.length) return;

    const temp = newSections[index];
    newSections[index] = newSections[targetIndex];
    newSections[targetIndex] = temp;

    setContent({ ...content, sections: newSections });
  };

  const deleteSection = (secId: string) => {
    if (!content) return;
    if (window.confirm('Delete this section from the SOP document?')) {
      setContent({
        ...content,
        sections: content.sections.filter((s) => s.id !== secId),
      });
    }
  };

  const addCustomSection = () => {
    if (!content) return;
    const newSec: SOPSection = {
      id: `sec-custom-${Date.now()}`,
      title: `${content.sections.length + 1}. Operational Guidelines`,
      type: 'text',
      content: 'Enter specific procedural guidelines, quality thresholds, or compliance requirements.',
    };
    setContent({
      ...content,
      sections: [...content.sections, newSec],
    });
    startEditSection(newSec);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="text-center space-y-3">
          <Sparkles className="w-8 h-8 mx-auto animate-spin text-brand-600" />
          <p className="text-sm font-semibold text-slate-700">Loading document...</p>
        </div>
      </div>
    );
  }

  if (!doc || !content) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl border border-slate-200 text-center space-y-4 max-w-md">
          <FileText className="w-12 h-12 text-slate-300 mx-auto" />
          <h2 className="text-lg font-bold text-slate-900">Document Not Found</h2>
          <p className="text-xs text-slate-500">The requested procedure could not be retrieved.</p>
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-600 text-white text-xs font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Dashboard</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Top Control Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs no-print">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={() => navigate('/dashboard')}
              className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold flex items-center gap-1"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Dashboard</span>
            </button>
            <div className="truncate">
              <span className="text-xs font-extrabold text-slate-900 block truncate max-w-xs sm:max-w-sm">
                {content.documentTitle}
              </span>
              <span className="text-[11px] text-slate-400 capitalize">
                Theme: {doc.theme.replace('-', ' ')} • Format: {doc.structure.replace('-', ' ')} • v{doc.version || 1}.0
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end flex-wrap">
            <button
              onClick={addCustomSection}
              className="px-3 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold flex items-center gap-1.5 transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Section</span>
            </button>

            <button
              onClick={handleSaveDraft}
              disabled={isSaving}
              className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition ${
                savedSuccess
                  ? 'bg-emerald-600 text-white'
                  : 'border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              {savedSuccess ? <Check className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
              <span>{savedSuccess ? 'Changes Saved!' : isSaving ? 'Saving...' : 'Save Draft'}</span>
            </button>

            <button
              onClick={printDocumentViaBrowser}
              className="px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition"
              title="Print or Save as Vector PDF via browser"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>

            <button
              onClick={handleExportPDF}
              disabled={isExporting}
              className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-md shadow-brand-500/20 flex items-center gap-1.5 transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isExporting ? 'Rendering PDF...' : 'Download PDF'}</span>
            </button>
          </div>
        </div>

        {/* Paper Document Preview (1:1 Unified SOPDocumentView) */}
        <div ref={previewRef}>
          <SOPDocumentView
            content={content}
            theme={doc.theme}
            structure={doc.structure}
            category={doc.category}
            editable={true}
            editingSectionId={editingSectionId}
            tempTitle={tempTitle}
            tempContent={tempContent}
            onStartEditSection={startEditSection}
            onSaveEditSection={saveEditSection}
            onMoveSection={moveSection}
            onDeleteSection={deleteSection}
            onTempTitleChange={setTempTitle}
            onTempContentChange={setTempContent}
          />
        </div>

      </div>
    </div>
  );
};
