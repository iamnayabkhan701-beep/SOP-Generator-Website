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
  Search,
  CheckCircle2,
  Layers,
  ChevronRight,
  RotateCw,
  FolderDown,
  Building2,
  Calendar,
  ExternalLink,
  SlidersHorizontal,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAuth } from '../context/AuthContext';
import {
  fetchSuiteById,
  saveSOPSuite,
  updateSOPDocument,
  saveSOPRevision,
  uploadPDFToSupabase,
} from '../lib/supabase';
import type { SOPSuite, SOPDocument, SOPGeneratedContent, SOPSection } from '../types/sop';
import { generateSOPPdfFromElement, generateSOPPdf, printDocumentViaBrowser } from '../lib/pdfGenerator';
import { A4PagedDocument } from '../components/A4PagedDocument';

export const SOPSuiteViewer: React.FC = () => {
  const { suiteId } = useParams<{ suiteId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [suite, setSuite] = useState<SOPSuite | null>(null);
  const [activeDocIndex, setActiveDocIndex] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Active Document & Content State
  const [activeContent, setActiveContent] = useState<SOPGeneratedContent | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [batchExporting, setBatchExporting] = useState(false);
  const [batchProgress, setBatchProgress] = useState<{ current: number; total: number } | null>(null);

  // Section Editing State
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);
  const [tempTitle, setTempTitle] = useState('');
  const [tempContent, setTempContent] = useState('');

  const documentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!suiteId) return;
    setLoading(true);
    fetchSuiteById(suiteId, user?.id).then((found) => {
      if (found) {
        setSuite(found);
        if (found.documents && found.documents.length > 0) {
          const first = found.documents[0];
          const initial = first.edited_content || first.generated_content;
          setActiveContent(initial || null);
        }
      }
      setLoading(false);
    });
  }, [suiteId, user]);

  const activeDoc: SOPDocument | undefined = suite?.documents?.[activeDocIndex];

  // Change active SOP document
  const handleSelectDocument = (index: number) => {
    if (!suite || !suite.documents[index]) return;
    setActiveDocIndex(index);
    const doc = suite.documents[index];
    const initial = doc.edited_content || doc.generated_content;
    setActiveContent(initial || null);
    setEditingSectionId(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSaveActiveDraft = async () => {
    if (!suite || !activeDoc || !activeContent || !user) return;
    setIsSaving(true);

    try {
      const updatedDoc: SOPDocument = {
        ...activeDoc,
        edited_content: activeContent,
        status: 'ready',
        version: (activeDoc.version || 1) + 1,
        updated_at: new Date().toISOString(),
      };

      await updateSOPDocument(activeDoc.id, {
        edited_content: activeContent,
        status: 'ready',
        version: (activeDoc.version || 1) + 1,
      });

      await saveSOPRevision(activeDoc.id, user.id, activeContent, 'Manual suite revision update');

      // Update suite state
      const updatedDocs = [...suite.documents];
      updatedDocs[activeDocIndex] = updatedDoc;
      const updatedSuite: SOPSuite = {
        ...suite,
        documents: updatedDocs,
        updated_at: new Date().toISOString(),
      };
      setSuite(updatedSuite);
      await saveSOPSuite(updatedSuite);

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
    if (!activeDoc || !activeContent) return;
    setIsExporting(true);

    try {
      let blob: Blob;
      let pageCount: number;
      let filename: string;

      if (documentRef.current) {
        ({ blob, pageCount, filename } = await generateSOPPdfFromElement(
          documentRef.current,
          activeContent,
          activeDoc.title
        ));
      } else {
        ({ blob, pageCount, filename } = await generateSOPPdf({
          content: activeContent,
          theme: activeDoc.theme,
          structure: activeDoc.structure,
          organizationName: activeDoc.form_data?.companyName,
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

      if (user) {
        const storagePath = await uploadPDFToSupabase(user.id, activeDoc.id, blob);
        await updateSOPDocument(activeDoc.id, {
          actual_page_count: pageCount,
          pdf_storage_path: storagePath || undefined,
          status: 'ready',
        });
      }

      confetti({
        particleCount: 60,
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

  // Batch PDF download for entire suite
  const handleBatchDownloadAll = async () => {
    if (!suite || !suite.documents || suite.documents.length === 0) return;
    setBatchExporting(true);
    const total = suite.documents.length;

    try {
      for (let i = 0; i < total; i++) {
        setBatchProgress({ current: i + 1, total });
        const doc = suite.documents[i];
        const content = doc.edited_content || doc.generated_content;
        if (content) {
          const { blob, filename } = await generateSOPPdf({
            content,
            theme: doc.theme,
            structure: doc.structure,
            organizationName: doc.form_data?.companyName,
          });

          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = filename;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);

          // Small delay between automated downloads to prevent browser blocking
          await new Promise((r) => setTimeout(r, 600));
        }
      }

      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.7 },
      });
    } catch (err: any) {
      console.error('Batch download error:', err);
      alert('Batch download encountered an issue: ' + err.message);
    } finally {
      setBatchExporting(false);
      setBatchProgress(null);
    }
  };

  // Section Editing
  const startEditSection = (sec: SOPSection) => {
    setEditingSectionId(sec.id);
    setTempTitle(sec.title);
    setTempContent(sec.content || '');
  };

  const saveEditSection = (sectionId: string) => {
    if (!activeContent) return;
    const updatedSections = activeContent.sections.map((s) => {
      if (s.id === sectionId) {
        return {
          ...s,
          title: tempTitle,
          content: tempContent,
        };
      }
      return s;
    });
    setActiveContent({ ...activeContent, sections: updatedSections });
    setEditingSectionId(null);
  };

  const moveSection = (index: number, direction: 'up' | 'down') => {
    if (!activeContent) return;
    const newSections = [...activeContent.sections];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newSections.length) return;

    const temp = newSections[index];
    newSections[index] = newSections[targetIndex];
    newSections[targetIndex] = temp;

    setActiveContent({ ...activeContent, sections: newSections });
  };

  const deleteSection = (secId: string) => {
    if (!activeContent) return;
    if (window.confirm('Delete this section from the SOP document?')) {
      setActiveContent({
        ...activeContent,
        sections: activeContent.sections.filter((s) => s.id !== secId),
      });
    }
  };

  const addCustomSection = () => {
    if (!activeContent) return;
    const newSec: SOPSection = {
      id: `sec-custom-${Date.now()}`,
      title: `${activeContent.sections.length + 1}. Operational Guidelines`,
      type: 'text',
      content: 'Enter specific procedural steps, quality tolerances, or compliance rules.',
    };
    setActiveContent({
      ...activeContent,
      sections: [...activeContent.sections, newSec],
    });
    startEditSection(newSec);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="text-center space-y-3">
          <Sparkles className="w-8 h-8 mx-auto animate-spin text-brand-600" />
          <p className="text-sm font-semibold text-slate-700">Loading department SOP suite...</p>
        </div>
      </div>
    );
  }

  if (!suite) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl border border-slate-200 text-center space-y-4 max-w-md">
          <FileText className="w-12 h-12 text-slate-300 mx-auto" />
          <h2 className="text-lg font-bold text-slate-900">SOP Suite Not Found</h2>
          <p className="text-xs text-slate-500">The requested department collection could not be retrieved.</p>
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

  const filteredDocs = (suite.documents || []).filter((d) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      d.title.toLowerCase().includes(q) ||
      (d.selected_topic && d.selected_topic.toLowerCase().includes(q)) ||
      (d.form_data?.sopId && d.form_data.sopId.toLowerCase().includes(q))
    );
  });

  return (
    <div className="min-h-screen bg-slate-100/70 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* SUITE EXECUTIVE HEADER */}
        <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/90 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6 no-print">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-slate-800 transition"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Dashboard</span>
              </Link>
              <span className="text-slate-300">•</span>
              <span className="px-2.5 py-0.5 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-[11px] font-bold uppercase tracking-wider">
                {suite.departmentName}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-bold">
                {suite.totalSOPs} Complete SOPs Generated
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {suite.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
              <span className="flex items-center gap-1.5 font-medium">
                <Building2 className="w-4 h-4 text-slate-400" />
                {suite.companyName}
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <Calendar className="w-4 h-4 text-slate-400" />
                Generated on {new Date(suite.created_at).toLocaleDateString()}
              </span>
              <span className="flex items-center gap-1.5 font-semibold text-emerald-600">
                <CheckCircle2 className="w-4 h-4" />
                B&W Multi-Page A4 Ready
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={handleBatchDownloadAll}
              disabled={batchExporting}
              className="px-4 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-md transition flex items-center gap-2 disabled:opacity-50"
              title="Sequentially download all SOPs in this suite as separate PDFs"
            >
              <FolderDown className="w-4 h-4" />
              <span>
                {batchExporting
                  ? `Downloading (${batchProgress?.current}/${batchProgress?.total})...`
                  : `Download Complete Suite (${suite.totalSOPs} PDFs)`}
              </span>
            </button>

            <Link
              to="/sop/new"
              className="px-4 py-2.5 rounded-2xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>New Department Suite</span>
            </Link>
          </div>
        </div>

        {/* WORKSPACE LAYOUT: LEFT SIDEBAR NAVIGATOR + RIGHT A4 PREVIEW */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT COLUMN: SOP SUITE NAVIGATOR (4 Cols) */}
          <div className="lg:col-span-4 bg-white p-5 rounded-3xl border border-slate-200/90 shadow-sm space-y-4 no-print lg:sticky lg:top-6 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-brand-600" />
                <span className="font-extrabold text-xs uppercase tracking-wider text-slate-900">
                  Suite Documents ({filteredDocs.length})
                </span>
              </div>
              <span className="text-[11px] font-bold text-slate-400">
                Active: #{activeDocIndex + 1}
              </span>
            </div>

            {/* In-Suite Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter procedures..."
                className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            {/* Scrollable Document List */}
            <div className="overflow-y-auto space-y-1.5 flex-1 pr-1 custom-scrollbar">
              {filteredDocs.map((doc) => {
                const actualIndex = (suite.documents || []).findIndex((d) => d.id === doc.id);
                const isSelected = actualIndex === activeDocIndex;
                const sopCode = doc.form_data?.sopId || `SOP-${actualIndex + 1}`;

                return (
                  <button
                    key={doc.id}
                    type="button"
                    onClick={() => handleSelectDocument(actualIndex)}
                    className={`w-full text-left p-3 rounded-2xl border transition-all flex items-start gap-3 ${
                      isSelected
                        ? 'border-brand-600 bg-brand-50/50 ring-2 ring-brand-500/20 shadow-xs'
                        : 'border-slate-100 hover:border-slate-200 hover:bg-slate-50/60'
                    }`}
                  >
                    <div
                      className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                        isSelected
                          ? 'bg-brand-600 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {actualIndex + 1}
                    </div>

                    <div className="truncate flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-brand-600">
                          {sopCode}
                        </span>
                        <span className="text-slate-300 text-[10px]">•</span>
                        <span className="text-[10px] text-slate-400">
                          {doc.target_page_count || 3} Pages
                        </span>
                      </div>
                      <p className={`text-xs font-bold truncate mt-0.5 ${isSelected ? 'text-slate-900' : 'text-slate-700'}`}>
                        {doc.title}
                      </p>
                    </div>

                    {isSelected && (
                      <ChevronRight className="w-4 h-4 text-brand-600 shrink-0 self-center" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* RIGHT COLUMN: ACTIVE DOCUMENT WORKSPACE & 1:1 A4 PREVIEW (8 Cols) */}
          <div className="lg:col-span-8 space-y-4">
            
            {/* Active Document Action Bar */}
            <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/90 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
              <div className="truncate">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black uppercase tracking-wider text-brand-600">
                    {activeDoc?.form_data?.sopId || `SOP #${activeDocIndex + 1}`}
                  </span>
                  <span className="text-slate-300">•</span>
                  <span className="text-xs text-slate-400 font-medium">
                    Procedure {activeDocIndex + 1} of {suite.totalSOPs}
                  </span>
                </div>
                <h2 className="text-base sm:text-lg font-bold text-slate-900 truncate mt-0.5">
                  {activeDoc?.title}
                </h2>
              </div>

              {/* Action Controls */}
              <div className="flex items-center gap-2 shrink-0 flex-wrap">
                <button
                  type="button"
                  onClick={addCustomSection}
                  className="px-3 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold flex items-center gap-1.5 transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Section</span>
                </button>

                <button
                  type="button"
                  onClick={handleSaveActiveDraft}
                  disabled={isSaving}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition ${
                    savedSuccess
                      ? 'bg-emerald-600 text-white'
                      : 'border border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {savedSuccess ? <Check className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
                  <span>{savedSuccess ? 'Changes Saved!' : isSaving ? 'Saving...' : 'Save Changes'}</span>
                </button>

                <button
                  type="button"
                  onClick={printDocumentViaBrowser}
                  className="px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition"
                  title="Print or Save as Vector PDF via browser"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print</span>
                </button>

                <button
                  type="button"
                  onClick={handleExportPDF}
                  disabled={isExporting}
                  className="px-5 py-2.5 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-md shadow-brand-500/20 flex items-center gap-1.5 transition"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{isExporting ? 'Generating PDF...' : 'Download PDF'}</span>
                </button>
              </div>
            </div>

            {/* Paper Document Preview (1:1 Unified A4 Paged Document) */}
            {activeContent && activeDoc && (
              <A4PagedDocument
                documentRef={documentRef}
                content={activeContent}
                theme={activeDoc.theme}
                structure={activeDoc.structure}
                category={activeDoc.category}
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
            )}

            {/* Bottom Next/Previous Procedure Navigation */}
            <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-200 no-print">
              <button
                type="button"
                disabled={activeDocIndex <= 0}
                onClick={() => handleSelectDocument(activeDocIndex - 1)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs disabled:opacity-40 disabled:cursor-not-allowed transition flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Previous Procedure</span>
              </button>

              <span className="text-xs text-slate-400 font-semibold">
                SOP {activeDocIndex + 1} of {suite.totalSOPs}
              </span>

              <button
                type="button"
                disabled={activeDocIndex >= (suite.documents?.length || 1) - 1}
                onClick={() => handleSelectDocument(activeDocIndex + 1)}
                className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs disabled:opacity-40 disabled:cursor-not-allowed transition flex items-center gap-1.5"
              >
                <span>Next Procedure</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
