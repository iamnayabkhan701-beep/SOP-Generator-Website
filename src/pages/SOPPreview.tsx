import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Download,
  Save,
  ArrowLeft,
  Edit3,
  CheckCircle2,
  AlertTriangle,
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  FileText,
  Printer,
  History,
  Check,
  Sparkles,
  Share2,
  GitBranch,
  BarChart3,
  Image as ImageIcon,
  TrendingUp,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAuth } from '../context/AuthContext';
import {
  fetchDocumentById,
  updateSOPDocument,
  saveSOPRevision,
  uploadPDFToSupabase,
} from '../lib/supabase';
import type { SOPDocument, SOPGeneratedContent, SOPSection, SOPTheme } from '../types/sop';
import { generateSOPPdf, generateSOPPdfFromElement } from '../lib/pdfGenerator';
import { getAutomaticSOPImages } from '../lib/imageFetcher';

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
  const previewRef = useRef<HTMLDivElement>(null);

  // Section Editing State
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);
  const [tempTitle, setTempTitle] = useState('');
  const [tempContent, setTempContent] = useState('');

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetchDocumentById(id).then((found) => {
      if (found) {
        setDoc(found);
        const initial = found.edited_content || found.generated_content;
        setContent(initial || null);
      }
      setLoading(false);
    });
  }, [id]);

  const handleSaveDraft = async () => {
    if (!doc || !content || !user) return;
    setIsSaving(true);

    try {
      // 1. Update document
      await updateSOPDocument(doc.id, {
        edited_content: content,
        status: 'ready',
        version: (doc.version || 1) + 1,
      });

      // 2. Save revision
      await saveSOPRevision(doc.id, user.id, content, 'User manually updated section content');

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

      // 1. Trigger browser download
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      // 2. Upload to Supabase Storage if user is authenticated
      if (user) {
        const storagePath = await uploadPDFToSupabase(user.id, doc.id, blob);
        await updateSOPDocument(doc.id, {
          actual_page_count: pageCount,
          pdf_storage_path: storagePath || undefined,
          status: 'ready',
        });
      }

      // Celebrate with confetti
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

  const saveEditSection = (id: string) => {
    if (!content) return;
    const updatedSections = content.sections.map((s) => {
      if (s.id === id) {
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
    if (window.confirm('Delete this section from the SOP?')) {
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
      title: `${content.sections.length + 1}. Custom Operational Section`,
      type: 'text',
      content: 'Enter specific operational guidelines, expectations, or metrics for this section.',
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
          <p className="text-sm font-semibold text-slate-700">Loading SOP document...</p>
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
          <p className="text-xs text-slate-500">The requested SOP draft could not be retrieved.</p>
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

  // Theme styling helpers
  const getThemeHeaderClass = (theme: SOPTheme) => {
    switch (theme) {
      case 'corporate-black': return 'bg-slate-900 text-white';
      case 'modern-green': return 'bg-emerald-700 text-white';
      case 'minimal-white': return 'bg-slate-800 text-white';
      case 'creative-purple': return 'bg-purple-700 text-white';
      default: return 'bg-brand-600 text-white';
    }
  };

  const getThemeAccentBorder = (theme: SOPTheme) => {
    switch (theme) {
      case 'corporate-black': return 'border-slate-800 text-slate-900';
      case 'modern-green': return 'border-emerald-600 text-emerald-800';
      case 'minimal-white': return 'border-slate-700 text-slate-800';
      case 'creative-purple': return 'border-purple-600 text-purple-800';
      default: return 'border-brand-600 text-brand-700';
    }
  };

  return (
    <div className="min-h-screen bg-slate-100/70 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Top Floating Control Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3 sticky top-20 z-30">
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
                Theme: {doc.theme.replace('-', ' ')} • v{doc.version || 1}.0
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
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
              onClick={handleExportPDF}
              disabled={isExporting}
              className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-md shadow-brand-500/20 flex items-center gap-1.5 transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isExporting ? 'Generating PDF...' : 'Download PDF'}</span>
            </button>
          </div>
        </div>

        {/* Paper Document Preview (Simulates Official Printed Document) */}
        <div ref={previewRef} className="bg-white rounded-3xl shadow-xl border border-slate-200/90 overflow-hidden font-sans">
          
          {/* Decorative colored top header bar */}
          <div className={`p-6 sm:p-8 ${getThemeHeaderClass(doc.theme)}`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/20 pb-4">
              <div>
                <span className="text-[11px] font-bold tracking-widest uppercase opacity-80">
                  {content.organization || 'ENTERPRISE STANDARD OPERATING PROCEDURE'}
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1 text-white">
                  {content.documentTitle}
                </h1>
              </div>
              <div className="text-right text-xs opacity-90 font-mono">
                <p><strong>ID:</strong> {content.metadata?.sopId || 'SOP-001'}</p>
                <p><strong>Version:</strong> v{content.metadata?.version || '1.0'}</p>
              </div>
            </div>

            {/* Metadata Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 text-xs">
              <div>
                <span className="opacity-70 block text-[10px] uppercase">Effective Date</span>
                <span className="font-semibold">{content.metadata?.effectiveDate || 'Immediate'}</span>
              </div>
              <div>
                <span className="opacity-70 block text-[10px] uppercase">Department</span>
                <span className="font-semibold">{content.metadata?.department || 'Operations'}</span>
              </div>
              <div>
                <span className="opacity-70 block text-[10px] uppercase">Prepared By</span>
                <span className="font-semibold">{content.metadata?.preparedBy}</span>
              </div>
              <div>
                <span className="opacity-70 block text-[10px] uppercase">Approved By</span>
                <span className="font-semibold">{content.metadata?.approvedBy}</span>
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-10 space-y-8">
            
            {/* Regulatory Disclaimer Box if present */}
            {content.disclaimer && (
              <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 text-amber-900 text-xs flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block text-sm mb-0.5">Formal Review Notice</span>
                  <p className="leading-relaxed">{content.disclaimer}</p>
                </div>
              </div>
            )}

            {/* Executive Summary */}
            {content.executiveSummary && (
              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Executive Summary
                </h3>
                <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
                  {content.executiveSummary}
                </p>
              </div>
            )}

            {/* Visual Process Flowchart with Shapes */}
            <div className="space-y-3 border border-slate-200/90 rounded-2xl p-6 bg-slate-50/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-brand-50 text-brand-600">
                    <GitBranch className="w-4 h-4" />
                  </div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                    Visual Process Flowchart & Sequential Milestones
                  </h3>
                </div>
                <span className="text-[10px] font-bold text-brand-600 uppercase tracking-widest bg-brand-50 px-2 py-0.5 rounded">
                  Flow Diagram
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 pt-3">
                {[
                  {
                    step: 1,
                    title: 'Initiation',
                    desc: 'Pre-check & credentials',
                    shape: 'capsule',
                    role: content.metadata?.preparedBy || 'Operator',
                    bg: 'bg-emerald-50 border-emerald-300 text-emerald-900',
                  },
                  {
                    step: 2,
                    title: 'Execution',
                    desc: 'Core workflow actions',
                    shape: 'rect',
                    role: 'Specialist',
                    bg: 'bg-brand-50 border-brand-300 text-brand-900',
                  },
                  {
                    step: 3,
                    title: 'Verification',
                    desc: 'Quality & safety checks',
                    shape: 'diamond',
                    role: content.metadata?.reviewedBy || 'QA Inspector',
                    bg: 'bg-amber-50 border-amber-300 text-amber-900',
                  },
                  {
                    step: 4,
                    title: 'Resolution',
                    desc: 'Defect / rollback plan',
                    shape: 'rect',
                    role: 'Escalation Lead',
                    bg: 'bg-purple-50 border-purple-300 text-purple-900',
                  },
                  {
                    step: 5,
                    title: 'Approval',
                    desc: 'Sign-off & log audit',
                    shape: 'capsule',
                    role: content.metadata?.approvedBy || 'Approver',
                    bg: 'bg-slate-100 border-slate-300 text-slate-900',
                  },
                ].map((node, nIdx) => (
                  <div key={node.step} className="flex flex-col items-center text-center relative group">
                    <div
                      className={`w-full p-3.5 border-2 transition-transform hover:-translate-y-0.5 shadow-sm space-y-1 ${node.bg} ${
                        node.shape === 'capsule'
                          ? 'rounded-full px-4'
                          : node.shape === 'diamond'
                          ? 'rounded-2xl rotate-0 border-dashed'
                          : 'rounded-xl'
                      }`}
                    >
                      <span className="inline-block w-5 h-5 rounded-full bg-white/80 font-bold text-[10px] leading-5 text-slate-800 shadow-xs mb-0.5">
                        {node.step}
                      </span>
                      <h4 className="text-xs font-bold leading-tight block truncate">{node.title}</h4>
                      <p className="text-[10px] opacity-80 leading-tight">{node.desc}</p>
                      <span className="text-[9px] font-mono opacity-70 block pt-0.5 truncate">
                        Role: {node.role}
                      </span>
                    </div>

                    {nIdx < 4 && (
                      <div className="hidden sm:block absolute -right-3 top-1/2 -translate-y-1/2 z-10 text-slate-400">
                        <ArrowRight className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Automatically Retrieved Domain Images */}
            {(() => {
              const displayImages =
                content.images && content.images.length > 0
                  ? content.images
                  : getAutomaticSOPImages(doc.category, doc.title);

              if (!displayImages || displayImages.length === 0) return null;

              return (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600">
                        <ImageIcon className="w-4 h-4" />
                      </div>
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                        Document Reference Figures & Operational Visuals
                      </h3>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">
                      Auto-sourced for {doc.category.toUpperCase()}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {displayImages.map((img, iIdx) => (
                      <div
                        key={iIdx}
                        className="rounded-2xl border border-slate-200 overflow-hidden bg-white shadow-sm flex flex-col justify-between"
                      >
                        <div className="relative aspect-video bg-slate-100 overflow-hidden">
                          <img
                            src={img.url}
                            alt={img.alt}
                            crossOrigin="anonymous"
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                            loading="lazy"
                          />
                        </div>
                        <div className="p-3 bg-slate-50/80 border-t border-slate-100">
                          <p className="text-xs font-medium text-slate-700 italic">
                            {img.caption}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}

            {/* Visual KPI & Performance Benchmark Charts */}
            <div className="space-y-3 border border-slate-200/90 rounded-2xl p-6 bg-white shadow-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
                    <BarChart3 className="w-4 h-4" />
                  </div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                    Quality Benchmarks & Performance Metrics
                  </h3>
                </div>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                  ISO / Operational KPI
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
                {[
                  { label: 'First-Pass Yield', current: 98.4, target: 99.0, unit: '%', color: 'bg-emerald-500' },
                  { label: 'Procedure Compliance', current: 100, target: 100, unit: '%', color: 'bg-brand-500' },
                  { label: 'Incident SLA Resolution', current: 12.5, target: 15.0, unit: 'min', color: 'bg-indigo-500' },
                  { label: 'Defect / Error Rate', current: 0.04, target: 0.10, unit: '%', color: 'bg-amber-500' },
                ].map((item, bIdx) => (
                  <div key={bIdx} className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/70 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-700">{item.label}</span>
                      <span className="font-mono font-bold text-slate-900">
                        {item.current}{item.unit}
                      </span>
                    </div>

                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${item.color}`}
                        style={{ width: `${Math.min(100, (item.current / (item.target || 100)) * 100)}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      <span>Target: {item.target}{item.unit}</span>
                      <span className="text-emerald-600 font-semibold flex items-center gap-0.5">
                        <CheckCircle2 className="w-2.5 h-2.5" /> Optimal
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sections List */}
            <div className="space-y-6">
              {content.sections.map((sec, idx) => {
                const isEditing = editingSectionId === sec.id;
                return (
                  <div
                    key={sec.id}
                    className="group border border-slate-200/90 rounded-2xl p-5 hover:border-brand-300 transition-all bg-white relative"
                  >
                    {/* Section Top Controls */}
                    <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-mono">
                          Sec {idx + 1}
                        </span>
                        {isEditing ? (
                          <input
                            type="text"
                            value={tempTitle}
                            onChange={(e) => setTempTitle(e.target.value)}
                            className="font-bold text-slate-900 text-base px-2 py-1 rounded border border-brand-400 focus:outline-none"
                          />
                        ) : (
                          <h3 className="font-bold text-slate-900 text-base">
                            {sec.title}
                          </h3>
                        )}
                      </div>

                      <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition">
                        <button
                          onClick={() => moveSection(idx, 'up')}
                          disabled={idx === 0}
                          title="Move Section Up"
                          className="p-1 rounded text-slate-400 hover:text-slate-700 disabled:opacity-20"
                        >
                          <ChevronUp className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => moveSection(idx, 'down')}
                          disabled={idx === content.sections.length - 1}
                          title="Move Section Down"
                          className="p-1 rounded text-slate-400 hover:text-slate-700 disabled:opacity-20"
                        >
                          <ChevronDown className="w-4 h-4" />
                        </button>
                        {isEditing ? (
                          <button
                            onClick={() => saveEditSection(sec.id)}
                            className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white text-xs font-semibold flex items-center gap-1"
                          >
                            <Check className="w-3 h-3" />
                            <span>Done</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => startEditSection(sec)}
                            title="Edit Section Text"
                            className="p-1 rounded text-slate-400 hover:text-brand-600"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => deleteSection(sec.id)}
                          title="Delete Section"
                          className="p-1 rounded text-slate-400 hover:text-rose-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Section Body */}
                    {isEditing ? (
                      <textarea
                        rows={4}
                        value={tempContent}
                        onChange={(e) => setTempContent(e.target.value)}
                        className="w-full p-3 rounded-xl border border-brand-400 focus:outline-none text-xs font-mono leading-relaxed"
                      />
                    ) : (
                      <div className="space-y-3 text-xs text-slate-700 leading-relaxed">
                        {sec.content && (
                          <p className="whitespace-pre-line">{sec.content}</p>
                        )}

                        {/* Items (Checklist or Steps) */}
                        {sec.items && sec.items.length > 0 && (
                          <ul className="space-y-2 pl-1">
                            {sec.items.map((item, itemIdx) => (
                              <li key={itemIdx} className="flex items-start gap-2.5">
                                {sec.type === 'checklist' ? (
                                  <input
                                    type="checkbox"
                                    className="rounded text-brand-600 focus:ring-brand-500 mt-0.5 cursor-pointer"
                                  />
                                ) : (
                                  <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 font-bold flex items-center justify-center shrink-0 text-[10px]">
                                    {itemIdx + 1}
                                  </span>
                                )}
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        )}

                        {/* Table Data */}
                        {sec.tableData && (
                          <div className="overflow-x-auto border border-slate-200 rounded-xl">
                            <table className="w-full text-left text-xs border-collapse">
                              <thead className="bg-slate-50 text-slate-800 font-bold border-b border-slate-200">
                                <tr>
                                  {sec.tableData.headers.map((h, hIdx) => (
                                    <th key={hIdx} className="p-2.5 font-semibold">{h}</th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-100">
                                {sec.tableData.rows.map((row, rIdx) => (
                                  <tr key={rIdx} className="hover:bg-slate-50/50">
                                    {row.map((cell, cIdx) => (
                                      <td key={cIdx} className="p-2.5 text-slate-700">{cell}</td>
                                    ))}
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Formal Approvals Sign-Off Block */}
            <div className="border-t-2 border-slate-200 pt-6 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                Formal Procedural Approvals
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="border border-slate-200 rounded-xl p-3 bg-slate-50 space-y-4">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">Prepared By</span>
                  <div className="h-6 border-b border-dashed border-slate-300" />
                  <p className="text-xs font-semibold text-slate-800">{content.metadata?.preparedBy}</p>
                </div>
                <div className="border border-slate-200 rounded-xl p-3 bg-slate-50 space-y-4">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">Reviewed By</span>
                  <div className="h-6 border-b border-dashed border-slate-300" />
                  <p className="text-xs font-semibold text-slate-800">{content.metadata?.reviewedBy}</p>
                </div>
                <div className="border border-slate-200 rounded-xl p-3 bg-slate-50 space-y-4">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">Authorized Approver</span>
                  <div className="h-6 border-b border-dashed border-slate-300" />
                  <p className="text-xs font-semibold text-slate-800">{content.metadata?.approvedBy}</p>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

