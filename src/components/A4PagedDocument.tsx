import React from 'react';
import {
  AlertTriangle,
  ChevronUp,
  ChevronDown,
  Edit3,
  Trash2,
  Check,
  FileText,
  Shield,
  Layers,
} from 'lucide-react';
import type {
  SOPGeneratedContent,
  SOPTheme,
  SOPStructure,
  SOPCategory,
  SOPSection,
} from '../types/sop';

interface A4PagedDocumentProps {
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
  documentRef?: React.RefObject<HTMLDivElement>;
}

// Fixed A4 dimensions at 96 DPI (210mm x 297mm)
const A4_WIDTH_PX = 794;
const A4_HEIGHT_PX = 1123;

export const A4PagedDocument: React.FC<A4PagedDocumentProps> = ({
  content,
  theme: _theme,
  structure: _structure,
  category: _category = 'operations',
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
  documentRef,
}) => {
  const meta = content.metadata || {
    sopId: 'SOP-001',
    version: '1.0',
    effectiveDate: new Date().toISOString().split('T')[0],
    department: 'Operations',
    preparedBy: 'Author',
    reviewedBy: 'Reviewer',
    approvedBy: 'Approver',
  };

  // Shared B&W Typography and Styles
  const s = {
    metaCell: {
      border: '1px solid #000',
      padding: '4px 8px',
      fontSize: '8.5pt',
      color: '#000',
    } as React.CSSProperties,
    metaLabel: {
      border: '1px solid #000',
      padding: '4px 8px',
      fontWeight: 700,
      backgroundColor: '#f5f5f5',
      fontSize: '8.5pt',
      color: '#000',
    } as React.CSSProperties,
    sectionTitle: {
      fontSize: '11pt',
      fontWeight: 700,
      color: '#000',
      margin: 0,
      textTransform: 'uppercase' as const,
      letterSpacing: '0.03em',
    } as React.CSSProperties,
    sectionBar: {
      borderBottom: '1.5px solid #000',
      marginBottom: '6px',
      paddingBottom: '2px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    } as React.CSSProperties,
    bodyText: {
      fontSize: '9.5pt',
      color: '#111',
      lineHeight: '1.55',
      whiteSpace: 'pre-wrap' as const,
    } as React.CSSProperties,
    tableHeader: {
      border: '1px solid #000',
      padding: '5px 8px',
      fontWeight: 700,
      backgroundColor: '#f0f0f0',
      textAlign: 'left' as const,
      color: '#000',
      fontSize: '8.5pt',
    } as React.CSSProperties,
    tableCell: {
      border: '1px solid #000',
      padding: '4px 8px',
      color: '#000',
      fontSize: '8.5pt',
    } as React.CSSProperties,
  };

  // Intelligent Partitioning into 3 or 4 pages depending on content density
  const totalSections = content.sections.length;
  
  // Page 1: Sections 0 and 1 (usually Purpose and Scope)
  // Page 2: Sections 2 and 3 + Flowchart (Responsibilities, Tools, Flowchart)
  // Page 3: Sections 4 and 5 (Detailed Steps, Checklist, Tables)
  // Page 4: Remaining sections (Quality, Safety, Records, References, Sign-Off, Revisions)
  let page1Sections: SOPSection[] = [];
  let page2Sections: SOPSection[] = [];
  let page3Sections: SOPSection[] = [];
  let page4Sections: SOPSection[] = [];

  if (totalSections <= 4) {
    page1Sections = content.sections.slice(0, 2);
    page2Sections = content.sections.slice(2);
  } else if (totalSections <= 7) {
    page1Sections = content.sections.slice(0, 2);
    page2Sections = content.sections.slice(2, 4);
    page3Sections = content.sections.slice(4);
  } else {
    page1Sections = content.sections.slice(0, 2);
    page2Sections = content.sections.slice(2, 5);
    page3Sections = content.sections.slice(5, 7);
    page4Sections = content.sections.slice(7);
  }

  const pages = [
    { num: 1, name: 'Title, Purpose & Scope', sections: page1Sections, isCover: true },
    { num: 2, name: 'Responsibilities, Tools & Workflow', sections: page2Sections, hasFlowchart: true },
    page3Sections.length > 0 ? { num: 3, name: 'Step-by-Step Operational Procedure', sections: page3Sections } : null,
    page4Sections.length > 0 ? { num: 4, name: 'Quality, Controls & Authorization', sections: page4Sections, isSignOff: true } : null,
  ].filter(Boolean) as {
    num: number;
    name: string;
    sections: SOPSection[];
    isCover?: boolean;
    hasFlowchart?: boolean;
    isSignOff?: boolean;
  }[];

  const totalPages = pages.length;

  const renderSectionItem = (sec: SOPSection, overallIndex: number) => {
    const isEditing = editingSectionId === sec.id;
    return (
      <div key={sec.id} className="mb-4 break-inside-avoid">
        <div style={s.sectionBar}>
          {isEditing ? (
            <input
              value={tempTitle}
              onChange={(e) => onTempTitleChange?.(e.target.value)}
              className="flex-1 font-bold text-xs border border-slate-300 px-2 py-1 rounded"
              style={{ fontWeight: 700, fontSize: '11pt' }}
            />
          ) : (
            <h2 style={s.sectionTitle}>
              {overallIndex + 1}. {sec.title}
            </h2>
          )}
          {editable && !isEditing && (
            <div className="flex items-center gap-1 shrink-0 no-print">
              <button
                onClick={() => onMoveSection?.(overallIndex, 'up')}
                className="p-0.5 rounded hover:bg-slate-100"
                title="Move up"
              >
                <ChevronUp className="w-3 h-3 text-slate-500" />
              </button>
              <button
                onClick={() => onMoveSection?.(overallIndex, 'down')}
                className="p-0.5 rounded hover:bg-slate-100"
                title="Move down"
              >
                <ChevronDown className="w-3 h-3 text-slate-500" />
              </button>
              <button
                onClick={() => onStartEditSection?.(sec)}
                className="p-0.5 rounded hover:bg-brand-50"
                title="Edit"
              >
                <Edit3 className="w-3 h-3 text-brand-600" />
              </button>
              <button
                onClick={() => onDeleteSection?.(sec.id)}
                className="p-0.5 rounded hover:bg-rose-50"
                title="Delete"
              >
                <Trash2 className="w-3 h-3 text-rose-500" />
              </button>
            </div>
          )}
          {editable && isEditing && (
            <button
              onClick={() => onSaveEditSection?.(sec.id)}
              className="flex items-center gap-1 px-2 py-0.5 bg-black text-white rounded text-xs font-semibold no-print"
            >
              <Check className="w-3 h-3" /> Save
            </button>
          )}
        </div>

        {isEditing ? (
          <textarea
            value={tempContent}
            onChange={(e) => onTempContentChange?.(e.target.value)}
            rows={5}
            className="w-full border border-slate-300 rounded px-2 py-1 text-xs font-mono"
          />
        ) : (
          <>
            {sec.content && (
              <div style={{ ...s.bodyText, marginBottom: 6 }}>{sec.content}</div>
            )}

            {sec.items && sec.items.length > 0 && (
              <div className="ml-2 mb-2">
                {sec.type === 'checklist' ? (
                  <div className="flex flex-col gap-1.5">
                    {sec.items.map((item, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs">
                        <div className="w-3.5 h-3.5 border border-black shrink-0 mt-0.5 bg-white" />
                        <span className="leading-snug text-black">{item}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <ol className="pl-4 m-0 space-y-1">
                    {sec.items.map((item, i) => (
                      <li key={i} className="text-xs leading-relaxed text-black">
                        {item}
                      </li>
                    ))}
                  </ol>
                )}
              </div>
            )}

            {sec.tableData && sec.tableData.headers && sec.tableData.rows && (
              <div className="overflow-x-auto my-2">
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      {sec.tableData.headers.map((h, i) => (
                        <th key={i} style={s.tableHeader}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {sec.tableData.rows.map((row, ri) => (
                      <tr key={ri}>
                        {row.map((cell, ci) => (
                          <td
                            key={ci}
                            style={{
                              ...s.tableCell,
                              backgroundColor: ri % 2 === 0 ? '#fff' : '#fcfcfc',
                            }}
                          >
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {sec.type === 'warning' && (
              <div className="border border-black p-2 bg-slate-50 flex gap-2 items-start my-2">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-black" />
                <span className="text-xs font-semibold text-black">{sec.content}</span>
              </div>
            )}
          </>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center bg-slate-300/70 p-4 sm:p-8 min-h-screen">
      {/* Top Pagination Information Bar */}
      <div className="mb-6 px-5 py-2 rounded-full bg-slate-900 text-white text-xs font-semibold shadow-md flex items-center gap-3 no-print">
        <span className="flex items-center gap-1.5">
          <FileText className="w-3.5 h-3.5 text-emerald-400" />
          <span>A4 Format (210mm × 297mm)</span>
        </span>
        <span className="w-1 h-1 rounded-full bg-slate-600" />
        <span>{totalPages} Individual Printable Sheets</span>
        <span className="w-1 h-1 rounded-full bg-slate-600" />
        <span className="text-brand-300 font-mono">1:1 Exact PDF Match</span>
      </div>

      {/* Pages Container */}
      <div ref={documentRef} className="flex flex-col items-center space-y-10 w-full">
        {pages.map((p, pageIdx) => {
          const pageNum = pageIdx + 1;

          return (
            <div key={pageNum} className="flex flex-col items-center w-full">
              {/* Page Number Indicator Tag above each sheet */}
              <div className="mb-2.5 px-3 py-1 rounded-md bg-slate-800 text-slate-200 text-[11px] font-mono font-semibold tracking-wider flex items-center gap-2 no-print shadow-xs">
                <span>SHEET {pageNum} OF {totalPages}</span>
                <span className="text-slate-400">•</span>
                <span className="text-slate-300 font-sans font-medium">{p.name}</span>
              </div>

              {/* Physical A4 Sheet */}
              <div
                data-page-number={pageNum}
                style={{
                  width: `${A4_WIDTH_PX}px`,
                  minHeight: `${A4_HEIGHT_PX}px`,
                  height: `${A4_HEIGHT_PX}px`,
                  backgroundColor: '#ffffff',
                  boxShadow: '0 10px 30px -5px rgba(0, 0, 0, 0.15), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                  border: '1px solid #d1d5db',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxSizing: 'border-box',
                  position: 'relative',
                }}
                className="a4-page-sheet"
              >
                {/* 1. RUNNING HEADER (On Every Page) */}
                <div
                  style={{
                    borderBottom: '2px solid #000',
                    padding: '16px 36px 10px 36px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    backgroundColor: '#fff',
                  }}
                >
                  <div className="truncate max-w-md">
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-black block">
                      {content.organization || 'ORGANIZATION'}
                    </span>
                    <span className="text-xs font-bold text-black truncate block">
                      {content.documentTitle}
                    </span>
                  </div>
                  <div className="text-right text-[10px] font-mono text-black leading-tight shrink-0">
                    <div><strong>Doc ID:</strong> {meta.sopId || 'SOP-001'}</div>
                    <div><strong>Rev:</strong> v{meta.version || '1.0'} | <strong>Eff:</strong> {meta.effectiveDate}</div>
                  </div>
                </div>

                {/* 2. PAGE CONTENT AREA */}
                <div
                  style={{
                    padding: '16px 36px',
                    flex: 1,
                    overflow: 'hidden',
                  }}
                >
                  {/* COVER CONTENT (Only on Page 1) */}
                  {p.isCover && (
                    <div className="mb-4">
                      {/* Title Block */}
                      <div className="border-b-2 border-black pb-3 mb-3">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-700">
                          Standard Operating Procedure
                        </div>
                        <h1 className="text-xl font-extrabold text-black leading-tight mt-0.5 mb-1">
                          {content.documentTitle}
                        </h1>
                      </div>

                      {/* Metadata Table */}
                      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 12 }}>
                        <tbody>
                          <tr>
                            <td style={s.metaLabel}>Department</td>
                            <td style={{ ...s.metaCell, width: '30%' }}>{meta.department}</td>
                            <td style={s.metaLabel}>Prepared By</td>
                            <td style={{ ...s.metaCell, width: '30%' }}>{meta.preparedBy}</td>
                          </tr>
                          <tr>
                            <td style={s.metaLabel}>Reviewed By</td>
                            <td style={s.metaCell}>{meta.reviewedBy}</td>
                            <td style={s.metaLabel}>Approved By</td>
                            <td style={s.metaCell}>{meta.approvedBy}</td>
                          </tr>
                        </tbody>
                      </table>

                      {/* Disclaimer if present */}
                      {content.disclaimer && (
                        <div className="p-2 border border-black bg-slate-50 mb-3 text-[10px] flex gap-2">
                          <AlertTriangle className="w-3.5 h-3.5 text-black shrink-0 mt-0.5" />
                          <div>
                            <span className="font-bold uppercase tracking-wider block">Compliance Notice</span>
                            <span className="text-slate-800">{content.disclaimer}</span>
                          </div>
                        </div>
                      )}

                      {/* Executive Summary */}
                      {content.executiveSummary && (
                        <div className="mb-3">
                          <div style={s.sectionBar}>
                            <h2 style={s.sectionTitle}>Executive Summary</h2>
                          </div>
                          <p style={{ ...s.bodyText, marginBottom: 4 }}>
                            {content.executiveSummary}
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* FLOWCHART (On Page 2 if present) */}
                  {p.hasFlowchart && content.flowchart && content.flowchart.length > 0 && (
                    <div className="mb-4">
                      <div style={s.sectionBar}>
                        <h2 style={s.sectionTitle}>Process Flow & Sequential Swimlane</h2>
                      </div>
                      <div className="flex flex-col items-center py-1">
                        {content.flowchart.map((step, idx) => (
                          <div key={step.id} className="flex flex-col items-center w-full">
                            <div
                              style={{
                                border: '1.5px solid #000',
                                padding: '6px 14px',
                                maxWidth: 460,
                                width: '100%',
                                backgroundColor: step.shape === 'start' || step.shape === 'end' ? '#000' : '#fff',
                                color: step.shape === 'start' || step.shape === 'end' ? '#fff' : '#000',
                                borderRadius: step.shape === 'start' || step.shape === 'end' ? 18 : 3,
                                textAlign: 'center',
                                fontSize: '8.5pt',
                                fontWeight: 600,
                              }}
                            >
                              <div className="text-[10px] font-normal opacity-70">
                                Step {step.stepNumber} • {step.role}
                              </div>
                              <div className="font-bold">{step.label}</div>
                              {step.description && (
                                <div className="text-[10px] font-normal mt-0.5 opacity-85">
                                  {step.description}
                                </div>
                              )}
                            </div>
                            {idx < content.flowchart!.length - 1 && (
                              <div style={{ width: 1.5, height: 14, backgroundColor: '#000' }} />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* SECTIONS ASSIGNED TO THIS PAGE */}
                  <div>
                    {p.sections.map((sec) => {
                      const overallIndex = content.sections.findIndex((s) => s.id === sec.id);
                      return renderSectionItem(sec, overallIndex);
                    })}
                  </div>

                  {/* SIGN-OFF BLOCK (On Final Page) */}
                  {p.isSignOff && (
                    <div className="mt-4">
                      <div style={s.sectionBar}>
                        <h2 style={s.sectionTitle}>Formal Authorization & Sign-Off</h2>
                      </div>
                      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 12 }}>
                        <thead>
                          <tr>
                            <th style={s.tableHeader}>Role</th>
                            <th style={s.tableHeader}>Full Name</th>
                            <th style={s.tableHeader}>Signature</th>
                            <th style={s.tableHeader}>Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          {[
                            { role: 'Prepared By (Author)', name: meta.preparedBy, date: meta.effectiveDate },
                            { role: 'Reviewed By (Lead)', name: meta.reviewedBy, date: '' },
                            { role: 'Approved By (Head)', name: meta.approvedBy, date: '' },
                          ].map((r, i) => (
                            <tr key={i}>
                              <td style={{ ...s.tableCell, fontWeight: 700 }}>{r.role}</td>
                              <td style={s.tableCell}>{r.name}</td>
                              <td style={{ ...s.tableCell, minWidth: 120 }}>&nbsp;</td>
                              <td style={s.tableCell}>{r.date}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>

                      {/* Revision History */}
                      <div style={s.sectionBar}>
                        <h2 style={s.sectionTitle}>Document Revision History</h2>
                      </div>
                      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                          <tr>
                            <th style={s.tableHeader}>Rev</th>
                            <th style={s.tableHeader}>Release Date</th>
                            <th style={s.tableHeader}>Description of Change</th>
                            <th style={s.tableHeader}>Approved By</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td style={{ ...s.tableCell, fontWeight: 700 }}>v{meta.version || '1.0'}</td>
                            <td style={s.tableCell}>{meta.effectiveDate}</td>
                            <td style={s.tableCell}>Initial production release under formal QMS governance</td>
                            <td style={s.tableCell}>{meta.approvedBy}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                {/* 3. RUNNING FOOTER (On Every Page) */}
                <div
                  style={{
                    borderTop: '1.5px solid #000',
                    padding: '8px 36px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '8pt',
                    color: '#000',
                    backgroundColor: '#fafafa',
                  }}
                >
                  <span className="font-semibold uppercase tracking-wider">
                    CONFIDENTIAL & PROPRIETARY — INTERNAL OPERATIONAL USE ONLY
                  </span>
                  <span className="font-mono font-bold">
                    PAGE {pageNum} OF {totalPages}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
