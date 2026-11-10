import React from 'react';
import {
  AlertTriangle,
  ChevronUp,
  ChevronDown,
  Edit3,
  Trash2,
  Check,
} from 'lucide-react';
import type {
  SOPGeneratedContent,
  SOPTheme,
  SOPStructure,
  SOPCategory,
  SOPSection,
} from '../types/sop';

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

// Kept for compatibility — always returns B&W
export const getThemeHeaderClass = (_theme: SOPTheme) => 'bg-white text-black';

export const SOPDocumentView: React.FC<SOPDocumentViewProps> = ({
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

  const s = {
    page: { fontFamily: 'Arial, Calibri, "Helvetica Neue", sans-serif', color: '#000', backgroundColor: '#fff', fontSize: '11pt', lineHeight: '1.55' } as React.CSSProperties,
    headerBar: { borderBottom: '2.5px solid #000', padding: '24px 36px 18px 36px', backgroundColor: '#fff' } as React.CSSProperties,
    metaCell: { border: '1px solid #000', padding: '5px 8px', fontSize: '9pt', color: '#000' } as React.CSSProperties,
    metaLabel: { border: '1px solid #000', padding: '5px 8px', fontWeight: 700, backgroundColor: '#f0f0f0', fontSize: '9pt', color: '#000' } as React.CSSProperties,
    sectionTitle: { fontSize: '12pt', fontWeight: 700, color: '#000', margin: 0, textTransform: 'uppercase' as const, letterSpacing: '0.03em' } as React.CSSProperties,
    sectionBar: { borderBottom: '1px solid #000', marginBottom: '8px', paddingBottom: '3px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' } as React.CSSProperties,
    bodyText: { fontSize: '10pt', color: '#000', lineHeight: '1.6', whiteSpace: 'pre-wrap' as const } as React.CSSProperties,
    tableHeader: { border: '1px solid #000', padding: '6px 8px', fontWeight: 700, backgroundColor: '#f0f0f0', textAlign: 'left' as const, color: '#000', fontSize: '9pt' } as React.CSSProperties,
    tableCell: { border: '1px solid #000', padding: '5px 8px', color: '#000', fontSize: '9pt' } as React.CSSProperties,
  };

  return (
    <div className="bg-white font-sans text-black print:shadow-none print:border-none print:rounded-none" style={s.page}>

      {/* === DOCUMENT HEADER === */}
      <div style={s.headerBar} className="print-break-inside-avoid">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px' }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '9pt', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#000', marginBottom: '4px' }}>
              {content.organization || 'ORGANIZATION'}
            </div>
            <h1 style={{ fontSize: '20pt', fontWeight: 700, color: '#000', margin: '0 0 4px 0', lineHeight: '1.2' }}>
              {content.documentTitle}
            </h1>
            <div style={{ fontSize: '9pt', color: '#333', fontWeight: 400 }}>Standard Operating Procedure</div>
          </div>
          <div style={{ textAlign: 'right', fontSize: '9pt', color: '#000', fontFamily: 'monospace', whiteSpace: 'nowrap' }}>
            <div><strong>Doc ID:</strong> {meta.sopId || 'SOP-001'}</div>
            <div><strong>Version:</strong> v{meta.version || '1.0'}</div>
            <div><strong>Effective:</strong> {meta.effectiveDate}</div>
          </div>
        </div>
      </div>

      {/* === METADATA TABLE === */}
      <div style={{ padding: '0 36px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 0 }}>
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
      </div>

      {/* === DISCLAIMER === */}
      {content.disclaimer && (
        <div style={{ margin: '14px 36px', padding: '10px 14px', border: '1px solid #000', backgroundColor: '#fafafa' }} className="print-break-inside-avoid">
          <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
            <AlertTriangle style={{ width: 14, height: 14, flexShrink: 0, marginTop: 1, color: '#000' }} />
            <div>
              <div style={{ fontWeight: 700, fontSize: '9pt', marginBottom: 3, textTransform: 'uppercase', letterSpacing: '0.03em' }}>Review & Compliance Notice</div>
              <div style={{ fontSize: '8.5pt', color: '#333', lineHeight: '1.4' }}>{content.disclaimer}</div>
            </div>
          </div>
        </div>
      )}

      {/* === EXECUTIVE SUMMARY === */}
      {content.executiveSummary && (
        <div style={{ padding: '0 36px', marginTop: 16 }} className="print-break-inside-avoid">
          <div style={s.sectionBar}>
            <h2 style={s.sectionTitle}>Executive Summary</h2>
          </div>
          <p style={{ ...s.bodyText, marginBottom: 8 }}>{content.executiveSummary}</p>
        </div>
      )}

      {/* === PROCESS FLOWCHART (B&W) === */}
      {content.flowchart && content.flowchart.length > 0 && (
        <div style={{ padding: '0 36px', marginTop: 20 }} className="print-break-inside-avoid">
          <div style={s.sectionBar}><h2 style={s.sectionTitle}>Process Flowchart</h2></div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {content.flowchart.map((step, idx) => (
              <div key={step.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                <div style={{
                  border: '1.5px solid #000', padding: '8px 16px', maxWidth: 460, width: '100%',
                  backgroundColor: step.shape === 'start' || step.shape === 'end' ? '#000' : '#fff',
                  color: step.shape === 'start' || step.shape === 'end' ? '#fff' : '#000',
                  borderRadius: step.shape === 'start' || step.shape === 'end' ? 20 : 4,
                  textAlign: 'center', fontSize: '9pt', fontWeight: 600,
                }}>
                  <div style={{ fontSize: '8pt', fontWeight: 400, opacity: 0.7 }}>{step.stepNumber}. {step.role}</div>
                  <div>{step.label}</div>
                  {step.description && <div style={{ fontSize: '8pt', fontWeight: 400, marginTop: 2, opacity: 0.85 }}>{step.description}</div>}
                </div>
                {idx < content.flowchart!.length - 1 && <div style={{ width: 2, height: 20, backgroundColor: '#000' }} />}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* === MAIN SECTIONS === */}
      <div style={{ padding: '0 36px', marginTop: 20 }}>
        {content.sections.map((sec, index) => {
          const isEditing = editingSectionId === sec.id;
          return (
            <div key={sec.id} style={{ marginBottom: 20 }} className="print-break-inside-avoid">
              <div style={s.sectionBar}>
                {isEditing ? (
                  <input value={tempTitle} onChange={(e) => onTempTitleChange?.(e.target.value)} className="flex-1 font-bold text-sm border border-slate-300 px-2 py-1 rounded" style={{ fontWeight: 700, fontSize: '12pt' }} />
                ) : (
                  <h2 style={s.sectionTitle}>{index + 1}. {sec.title}</h2>
                )}
                {editable && !isEditing && (
                  <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
                    <button onClick={() => onMoveSection?.(index, 'up')} className="p-1 rounded hover:bg-slate-100" title="Move up"><ChevronUp className="w-3 h-3 text-slate-500" /></button>
                    <button onClick={() => onMoveSection?.(index, 'down')} className="p-1 rounded hover:bg-slate-100" title="Move down"><ChevronDown className="w-3 h-3 text-slate-500" /></button>
                    <button onClick={() => onStartEditSection?.(sec)} className="p-1 rounded hover:bg-brand-50" title="Edit"><Edit3 className="w-3 h-3 text-brand-600" /></button>
                    <button onClick={() => onDeleteSection?.(sec.id)} className="p-1 rounded hover:bg-rose-50" title="Delete"><Trash2 className="w-3 h-3 text-rose-500" /></button>
                  </div>
                )}
                {editable && isEditing && (
                  <button onClick={() => onSaveEditSection?.(sec.id)} className="flex items-center gap-1 px-2 py-1 bg-black text-white rounded text-xs font-semibold">
                    <Check className="w-3 h-3" /> Save
                  </button>
                )}
              </div>

              {isEditing ? (
                <textarea value={tempContent} onChange={(e) => onTempContentChange?.(e.target.value)} rows={6} className="w-full border border-slate-300 rounded px-2 py-1 text-sm font-mono" />
              ) : (
                <>
                  {sec.content && <div style={{ ...s.bodyText, marginBottom: 8 }}>{sec.content}</div>}

                  {sec.items && sec.items.length > 0 && (
                    <div style={{ marginLeft: 8 }}>
                      {sec.type === 'checklist' ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                          {sec.items.map((item, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: '10pt' }}>
                              <div style={{ width: 14, height: 14, border: '1.5px solid #000', flexShrink: 0, marginTop: 2, backgroundColor: '#fff' }} />
                              <span style={{ lineHeight: '1.5' }}>{item}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <ol style={{ paddingLeft: 20, margin: 0 }}>
                          {sec.items.map((item, i) => (
                            <li key={i} style={{ fontSize: '10pt', lineHeight: '1.6', marginBottom: 4, color: '#000' }}>{item}</li>
                          ))}
                        </ol>
                      )}
                    </div>
                  )}

                  {sec.tableData && sec.tableData.headers && sec.tableData.rows && (
                    <div style={{ overflowX: 'auto' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                          <tr>
                            {sec.tableData.headers.map((h, i) => <th key={i} style={s.tableHeader}>{h}</th>)}
                          </tr>
                        </thead>
                        <tbody>
                          {sec.tableData.rows.map((row, ri) => (
                            <tr key={ri}>
                              {row.map((cell, ci) => <td key={ci} style={{ ...s.tableCell, backgroundColor: ri % 2 === 0 ? '#fff' : '#fafafa' }}>{cell}</td>)}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {sec.type === 'warning' && (
                    <div style={{ border: '1px solid #000', padding: '8px 12px', backgroundColor: '#fafafa', display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                      <AlertTriangle style={{ width: 14, height: 14, flexShrink: 0, marginTop: 1 }} />
                      <span style={{ fontSize: '9.5pt', fontWeight: 500 }}>{sec.content}</span>
                    </div>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* === AUTHORIZATION BLOCK === */}
      <div style={{ padding: '0 36px', marginTop: 24, marginBottom: 24 }} className="print-break-inside-avoid">
        <div style={s.sectionBar}><h2 style={s.sectionTitle}>Document Authorization</h2></div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={s.tableHeader}>Role</th>
              <th style={s.tableHeader}>Name</th>
              <th style={s.tableHeader}>Signature</th>
              <th style={s.tableHeader}>Date</th>
            </tr>
          </thead>
          <tbody>
            {[
              { role: 'Prepared By', name: meta.preparedBy, date: meta.effectiveDate },
              { role: 'Reviewed By', name: meta.reviewedBy, date: '' },
              { role: 'Approved By', name: meta.approvedBy, date: '' },
            ].map((r, i) => (
              <tr key={i}>
                <td style={{ ...s.tableCell, fontWeight: 600 }}>{r.role}</td>
                <td style={s.tableCell}>{r.name}</td>
                <td style={{ ...s.tableCell, minWidth: 100 }}>&nbsp;</td>
                <td style={s.tableCell}>{r.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* === FOOTER === */}
      <div style={{ borderTop: '1.5px solid #000', padding: '8px 36px', display: 'flex', justifyContent: 'space-between', fontSize: '8pt', color: '#000', backgroundColor: '#f8f8f8' }}>
        <span>CONFIDENTIAL — FOR INTERNAL ORGANIZATIONAL USE ONLY</span>
        <span>SOPFlow | {content.organization || 'Organization'} | v{meta.version}</span>
      </div>
    </div>
  );
};
