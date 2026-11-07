import React from 'react';
import {
  GitBranch,
  ArrowRight,
  Image as ImageIcon,
  BarChart3,
  CheckCircle2,
  AlertTriangle,
  ChevronUp,
  ChevronDown,
  Edit3,
  Trash2,
  Check,
  ShieldCheck,
  Layers,
  FileCheck,
} from 'lucide-react';
import type {
  SOPGeneratedContent,
  SOPTheme,
  SOPStructure,
  SOPCategory,
  SOPSection,
} from '../types/sop';
import { getAutomaticSOPImages } from '../lib/imageFetcher';

interface SOPDocumentViewProps {
  content: SOPGeneratedContent;
  theme: SOPTheme;
  structure: SOPStructure;
  category?: SOPCategory;
  editable?: boolean;
  editingSectionId?: string | null;
  tempTitle?: string;
  tempContent?: string;
  onStartEditSection?: (sec: SOPSection) => void;
  onSaveEditSection?: (id: string) => void;
  onMoveSection?: (index: number, direction: 'up' | 'down') => void;
  onDeleteSection?: (id: string) => void;
  onTempTitleChange?: (val: string) => void;
  onTempContentChange?: (val: string) => void;
}

export const getThemeHeaderClass = (theme: SOPTheme) => {
  switch (theme) {
    case 'corporate-black':
      return 'bg-slate-900 text-white';
    case 'modern-green':
      return 'bg-emerald-700 text-white';
    case 'minimal-white':
      return 'bg-slate-800 text-white';
    case 'creative-purple':
      return 'bg-purple-700 text-white';
    default:
      return 'bg-brand-600 text-white';
  }
};

export const SOPDocumentView: React.FC<SOPDocumentViewProps> = ({
  content,
  theme,
  structure,
  category = 'operations',
  editable = false,
  editingSectionId = null,
  tempTitle = '',
  tempContent = '',
  onStartEditSection,
  onSaveEditSection,
  onMoveSection,
  onDeleteSection,
  onTempTitleChange,
  onTempContentChange,
}) => {
  const displayImages =
    content.images && content.images.length > 0
      ? content.images
      : getAutomaticSOPImages(category, content.documentTitle);

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-slate-200/90 overflow-hidden font-sans print:shadow-none print:border-none print:rounded-none">
      
      {/* ============================================================== */}
      {/* 1. DOCUMENT TOP HEADER & METADATA BAR                         */}
      {/* ============================================================== */}
      <div className={`p-6 sm:p-8 ${getThemeHeaderClass(theme)} print:p-6 print-break-inside-avoid`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/20 pb-4">
          <div>
            <span className="text-[11px] font-bold tracking-widest uppercase opacity-85">
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

      <div className="p-6 sm:p-10 space-y-8 print:p-6 print:space-y-6">
        
        {/* ============================================================== */}
        {/* 2. REGULATORY & OPERATIONAL NOTICE                             */}
        {/* ============================================================== */}
        {content.disclaimer && (
          <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 text-amber-900 text-xs flex items-start gap-3 print-break-inside-avoid">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block text-sm mb-0.5 text-amber-950">Formal Review & Compliance Notice</span>
              <p className="leading-relaxed opacity-95">{content.disclaimer}</p>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* 3. EXECUTIVE SUMMARY                                           */}
        {/* ============================================================== */}
        {content.executiveSummary && (
          <div className="space-y-2 print-break-inside-avoid">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Executive Summary & Operational Scope
            </h3>
            <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
              {content.executiveSummary}
            </p>
          </div>
        )}

        {/* ============================================================== */}
        {/* 4. VISUAL PROCESS FLOWCHART WITH SHAPES                        */}
        {/* ============================================================== */}
        <div className="space-y-3 border border-slate-200/90 rounded-2xl p-6 bg-slate-50/50 print-break-inside-avoid">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-brand-50 text-brand-600">
                <GitBranch className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Sequential Process Flowchart & Milestones
              </h3>
            </div>
            <span className="text-[10px] font-bold text-brand-700 bg-brand-50 px-2.5 py-0.5 rounded border border-brand-200">
              Milestone Sequence
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
                  className={`w-full p-3.5 border-2 transition-transform shadow-xs space-y-1 ${node.bg} ${
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

        {/* ============================================================== */}
        {/* 5. DOCUMENT REFERENCE FIGURES & OPERATIONAL VISUALS            */}
        {/* ============================================================== */}
        {displayImages && displayImages.length > 0 && (
          <div className="space-y-3 print-break-inside-avoid">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600">
                  <ImageIcon className="w-4 h-4" />
                </div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  Operational Reference Figures
                </h3>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">
                Figures 1-{displayImages.length}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {displayImages.map((img, iIdx) => (
                <div
                  key={iIdx}
                  className="rounded-2xl border border-slate-200 overflow-hidden bg-white shadow-xs flex flex-col justify-between print:border-slate-300"
                >
                  <div className="relative aspect-video bg-slate-100 overflow-hidden">
                    <img
                      src={img.url}
                      alt={img.alt}
                      crossOrigin="anonymous"
                      className="w-full h-full object-cover"
                      loading="eager"
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
        )}

        {/* ============================================================== */}
        {/* 6. OPERATIONAL KPI & PERFORMANCE BENCHMARKS                    */}
        {/* ============================================================== */}
        <div className="space-y-3 border border-slate-200/90 rounded-2xl p-6 bg-white shadow-xs print-break-inside-avoid">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
                <BarChart3 className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Quality Thresholds & Performance Benchmarks
              </h3>
            </div>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Operational KPI
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

        {/* ============================================================== */}
        {/* 7. STRUCTURED SOP SECTIONS                                     */}
        {/* ============================================================== */}
        <div className="space-y-6">
          {content.sections.map((sec, idx) => {
            const isEditing = editable && editingSectionId === sec.id;
            return (
              <div
                key={sec.id}
                className="group border border-slate-200/90 rounded-2xl p-5 hover:border-brand-300 transition-all bg-white relative print-break-inside-avoid"
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
                        onChange={(e) => onTempTitleChange?.(e.target.value)}
                        className="font-bold text-slate-900 text-base px-2 py-1 rounded border border-brand-400 focus:outline-none"
                      />
                    ) : (
                      <h3 className="font-bold text-slate-900 text-base">
                        {sec.title}
                      </h3>
                    )}
                  </div>

                  {editable && (
                    <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition no-print">
                      <button
                        onClick={() => onMoveSection?.(idx, 'up')}
                        disabled={idx === 0}
                        title="Move Section Up"
                        className="p-1 rounded text-slate-400 hover:text-slate-700 disabled:opacity-20"
                      >
                        <ChevronUp className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onMoveSection?.(idx, 'down')}
                        disabled={idx === content.sections.length - 1}
                        title="Move Section Down"
                        className="p-1 rounded text-slate-400 hover:text-slate-700 disabled:opacity-20"
                      >
                        <ChevronDown className="w-4 h-4" />
                      </button>
                      {isEditing ? (
                        <button
                          onClick={() => onSaveEditSection?.(sec.id)}
                          className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white text-xs font-semibold flex items-center gap-1"
                        >
                          <Check className="w-3 h-3" />
                          <span>Done</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => onStartEditSection?.(sec)}
                          title="Edit Section Text"
                          className="p-1 rounded text-slate-400 hover:text-brand-600"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => onDeleteSection?.(sec.id)}
                        title="Delete Section"
                        className="p-1 rounded text-slate-400 hover:text-rose-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Section Body */}
                {isEditing ? (
                  <textarea
                    rows={4}
                    value={tempContent}
                    onChange={(e) => onTempContentChange?.(e.target.value)}
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

        {/* ============================================================== */}
        {/* 8. FORMAL PROCEDURAL APPROVALS & SIGN-OFF                     */}
        {/* ============================================================== */}
        <div className="border-t-2 border-slate-200 pt-6 space-y-3 print-break-inside-avoid">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
            Formal Procedural Approvals & Governance Sign-Off
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

        {/* Document Footer Watermark */}
        <div className="border-t border-slate-100 pt-4 flex items-center justify-between text-[10px] text-slate-400 font-mono">
          <span>CONFIDENTIAL & PROPRIETARY — SUBJECT TO FORMAL APPROVAL</span>
          <span>{content.metadata?.sopId || 'SOP-001'} | v{content.metadata?.version || '1.0'}</span>
        </div>

      </div>
    </div>
  );
};
