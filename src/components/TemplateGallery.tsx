import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutTemplate,
  Eye,
  Check,
  ArrowRight,
  X,
  FileText,
  Table as TableIcon,
  CheckSquare,
  ListOrdered,
  Layers,
  Award,
  Zap,
  GitBranch,
  Sliders,
  ExternalLink,
} from 'lucide-react';
import { STRUCTURES, type SOPStructure, type SOPGeneratedContent, type SOPTheme } from '../types/sop';
import { SOPDocumentView } from './SOPDocumentView';

interface TemplateGalleryProps {
  selectedStructure?: SOPStructure;
  onSelectStructure?: (structure: SOPStructure) => void;
  showSelectOnly?: boolean;
}

// Generate realistic sample content for template previews
function getSampleContentForTemplate(structure: SOPStructure): SOPGeneratedContent {
  const baseMetadata = {
    sopId: 'SOP-OPS-2026',
    version: '2.1',
    effectiveDate: '2026-11-01',
    department: 'Operational Excellence',
    preparedBy: 'Senior Operations Lead',
    reviewedBy: 'Quality Assurance Director',
    approvedBy: 'Chief Operating Officer',
  };

  switch (structure) {
    case 'raci-matrix':
      return {
        documentTitle: 'Cross-Functional Incident Governance & Escalation',
        organization: 'ENTERPRISE OPERATIONS GROUP',
        metadata: baseMetadata,
        executiveSummary: 'This procedure defines the RACI responsibility matrix across engineering, operations, and leadership during critical operational anomalies.',
        disclaimer: 'All RACI role assignments are binding upon operational escalation.',
        sections: [
          {
            id: 'sec-1',
            title: '1. Objective & Governance Matrix',
            type: 'text',
            content: 'Clear allocation of responsibility per operational milestone to avoid ambiguous handoffs.',
          },
          {
            id: 'sec-2',
            title: '2. RACI Responsibility Assignment Table',
            type: 'table',
            content: 'Task allocations categorized by Responsible (R), Accountable (A), Consulted (C), and Informed (I):',
            tableData: {
              headers: ['Operational Task', 'Operator', 'Supervisor', 'QA Director', 'VP Operations'],
              rows: [
                ['Anomaly Detection & Acknowledgment', 'R (Responsible)', 'A (Accountable)', 'I (Informed)', 'I (Informed)'],
                ['Perimeter Isolation & Traffic Shift', 'R (Responsible)', 'A (Accountable)', 'C (Consulted)', 'I (Informed)'],
                ['Root Cause Diagnosis & Testing', 'C (Consulted)', 'A (Accountable)', 'R (Responsible)', 'I (Informed)'],
                ['Rollback Decision & Approval', 'C (Consulted)', 'A (Accountable)', 'C (Consulted)', 'A (Approves)'],
                ['Post-Incident Review & Archival', 'R (Responsible)', 'A (Accountable)', 'R (Responsible)', 'I (Informed)'],
              ],
            },
          },
          {
            id: 'sec-3',
            title: '3. Escalation Thresholds',
            type: 'steps',
            content: 'Escalate to next governance level if SLA breach exceeds 15 minutes.',
            items: [
              'Level 1: Operational triage within 5 minutes.',
              'Level 2: Supervisor intervention at 10 minutes.',
              'Level 3: Executive briefing at 20 minutes.',
            ],
          },
        ],
      };

    case 'iso-9001':
      return {
        documentTitle: 'ISO 9001:2015 Quality Management Operating Procedure',
        organization: 'CERTIFIED MANUFACTURING & QUALITY CORP',
        metadata: { ...baseMetadata, sopId: 'SOP-ISO-9001' },
        executiveSummary: 'Standardized operational sequence formatted in strict alignment with ISO 9001:2015 Clauses 4, 7, 8, 9, and 10.',
        disclaimer: 'This procedure forms an integral part of the registered ISO Quality Management System (QMS).',
        sections: [
          {
            id: 'sec-1',
            title: 'Clause 4: Context of the Organization & Scope',
            type: 'text',
            content: 'Defines internal and external stakeholders, quality objectives, and risk-based thinking principles.',
          },
          {
            id: 'sec-2',
            title: 'Clause 7: Support & Resource Management',
            type: 'checklist',
            content: 'Prerequisites required to maintain process capability and environmental controls:',
            items: [
              'Calibrated measuring equipment with valid calibration certificates.',
              'Certified operators possessing current training credentials.',
              'Controlled humidity and temperature sensor logs verified.',
            ],
          },
          {
            id: 'sec-3',
            title: 'Clause 8: Operational Planning & Process Control',
            type: 'steps',
            content: 'Sequential process controls executed during standard production runs:',
            items: [
              'Pre-run inspection of raw materials and certificate of analysis (CoA).',
              'Automated recipe execution with continuous parameter telemetry.',
              'In-line optical inspection and statistical process control (SPC).',
            ],
          },
          {
            id: 'sec-4',
            title: 'Clause 9 & 10: Performance Evaluation & Continuous Improvement',
            type: 'text',
            content: 'Non-conformance records, CAPA (Corrective and Preventive Action) triggers, and annual audit intervals.',
          },
        ],
      };

    case 'lean-six-sigma':
      return {
        documentTitle: 'DMAIC Process Optimization & Waste Reduction Protocol',
        organization: 'CONTINUOUS IMPROVEMENT INSTITUTE',
        metadata: { ...baseMetadata, sopId: 'SOP-LSS-402' },
        executiveSummary: 'Structured Six Sigma DMAIC framework designed to eliminate operational waste and maintain sub-0.05% defect rates.',
        sections: [
          {
            id: 'sec-1',
            title: '1. Phase D - Define: Critical-to-Quality (CTQ) Parameters',
            type: 'text',
            content: 'Establish customer requirements, problem statement, and baseline operational boundaries.',
          },
          {
            id: 'sec-2',
            title: '2. Phase M - Measure: Real-Time Cycle & Defect Metrics',
            type: 'steps',
            content: 'Telemetry sampling benchmarks:',
            items: [
              'Sample 50 consecutive units per shift for dimensional variance.',
              'Calculate Defects Per Million Opportunities (DPMO).',
              'Record cycle time from dock receipt to finished pallet.',
            ],
          },
          {
            id: 'sec-3',
            title: '3. Phase A - Analyze: Root Cause & Variance Isolation',
            type: 'text',
            content: 'Utilize 5-Why analysis and Ishikawa fishbone diagrams to isolate friction points.',
          },
          {
            id: 'sec-4',
            title: '4. Phase I - Improve: Poka-Yoke Mistake-Proofing',
            type: 'checklist',
            content: 'Implemented error-proofing countermeasures:',
            items: [
              'Barcode interlock prevents incorrect carton labeling.',
              'Automated scale detects underweight parcels prior to seal.',
            ],
          },
          {
            id: 'sec-5',
            title: '5. Phase C - Control: Standard Work & Statistical Process Control',
            type: 'text',
            content: 'Daily gemba walks, control charts, and quarterly procedural calibration.',
          },
        ],
      };

    case 'checklist':
      return {
        documentTitle: 'Operational Shift Opening & Safety Audit Checklist',
        organization: 'FACILITY OPERATIONS MANAGEMENT',
        metadata: { ...baseMetadata, sopId: 'SOP-CHK-101' },
        executiveSummary: 'Daily rapid-verification checklist for shift leads, safety monitors, and facility technicians.',
        sections: [
          {
            id: 'sec-1',
            title: '1. Pre-Shift Environmental & Safety Audit',
            type: 'checklist',
            content: 'Inspect each checkpoint prior to activating equipment:',
            items: [
              'Emergency eye-wash stations tested and clear of obstruction.',
              'Fire extinguishers inspected with inspection tag current.',
              'PPE inventory verified (safety eyewear, gloves, high-vis vests).',
              'Exhaust ventilation functioning within specified CFM airflow.',
            ],
          },
          {
            id: 'sec-2',
            title: '2. Equipment Readiness & Sensor Calibration',
            type: 'checklist',
            content: 'Verify operational machine sensors:',
            items: [
              'Primary power distribution panel locked and tagged.',
              'Hydraulic fluid pressure within nominal green zone (120-140 PSI).',
              'Safety optical light curtains trip when beam is broken.',
            ],
          },
        ],
      };

    default:
      return {
        documentTitle: 'Enterprise Standard Operating Procedure',
        organization: 'GLOBAL OPERATIONS ORGANIZATION',
        metadata: baseMetadata,
        executiveSummary: 'This standard operating procedure establishes clear requirements, roles, workflows, and quality criteria for enterprise execution.',
        disclaimer: 'This procedure must be reviewed annually by designated department supervisors.',
        sections: [
          {
            id: 'sec-1',
            title: '1. Purpose & Scope',
            type: 'text',
            content: 'Establishes a standardized, reliable method to conduct daily operations with zero variance and high compliance.',
          },
          {
            id: 'sec-2',
            title: '2. Roles & Responsibilities',
            type: 'steps',
            content: 'Designated authority boundaries:',
            items: [
              'Primary Operator: Responsible for execution according to steps.',
              'Supervisor: Responsible for oversight, training, and sign-off.',
              'Approver: Authorized to publish or amend procedural parameters.',
            ],
          },
          {
            id: 'sec-3',
            title: '3. Step-by-Step Execution Sequence',
            type: 'steps',
            content: 'Execute each milestone in strict sequence:',
            items: [
              'Step 1: Check prerequisites and confirm system credentials.',
              'Step 2: Initialize workflow and observe primary telemetry.',
              'Step 3: Conduct mid-point quality verification.',
              'Step 4: Complete final inspection and sign off audit log.',
            ],
          },
        ],
      };
  }
}

// Mini preview component rendered inside each template card
const MiniatureDocumentPreview: React.FC<{ structure: SOPStructure }> = ({ structure }) => {
  return (
    <div className="w-full aspect-[4/3] bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs flex flex-col p-2.5 text-[7px] leading-tight select-none pointer-events-none group-hover:border-brand-400 transition">
      
      {/* Header Bar */}
      <div className={`p-1.5 rounded-t mb-1.5 flex items-center justify-between text-white ${
        structure === 'iso-9001' ? 'bg-indigo-900' :
        structure === 'lean-six-sigma' ? 'bg-emerald-800' :
        structure === 'raci-matrix' ? 'bg-slate-900' :
        structure === 'checklist' ? 'bg-teal-700' :
        structure === 'quick-reference' ? 'bg-amber-700' :
        structure === 'visual-workflow' ? 'bg-purple-800' :
        'bg-brand-600'
      }`}>
        <div className="truncate font-bold">STANDARD OPERATING PROCEDURE</div>
        <div className="font-mono text-[6px] opacity-80">v1.0</div>
      </div>

      {/* Metadata strip */}
      <div className="grid grid-cols-3 gap-1 pb-1.5 border-b border-slate-100 text-slate-500 text-[6px]">
        <div className="bg-slate-50 p-0.5 rounded truncate">Dept: Operations</div>
        <div className="bg-slate-50 p-0.5 rounded truncate">ID: SOP-101</div>
        <div className="bg-slate-50 p-0.5 rounded truncate">Status: Active</div>
      </div>

      {/* Visual content based on structure */}
      <div className="flex-1 space-y-1 pt-1 overflow-hidden">
        {structure === 'raci-matrix' ? (
          <div className="space-y-0.5">
            <div className="font-bold text-slate-700">RACI Governance Matrix</div>
            <div className="border border-slate-200 rounded overflow-hidden">
              <div className="grid grid-cols-4 bg-slate-100 font-bold p-0.5 text-center">
                <span>Task</span><span>Resp</span><span>Acct</span><span>Info</span>
              </div>
              <div className="grid grid-cols-4 p-0.5 border-t border-slate-100 text-center">
                <span className="truncate">Phase 1</span><span className="text-brand-600 font-bold">R</span><span>A</span><span>I</span>
              </div>
              <div className="grid grid-cols-4 p-0.5 border-t border-slate-100 text-center">
                <span className="truncate">Phase 2</span><span className="text-brand-600 font-bold">R</span><span>A</span><span>C</span>
              </div>
            </div>
          </div>
        ) : structure === 'iso-9001' ? (
          <div className="space-y-0.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-indigo-900">ISO 9001:2015 Clauses</span>
              <span className="bg-indigo-50 text-indigo-700 px-1 rounded text-[5px] font-bold">QMS</span>
            </div>
            <div className="bg-indigo-50/50 p-1 rounded border border-indigo-100">
              <p className="font-semibold text-indigo-950">Clause 8: Operation & Controls</p>
              <div className="h-0.5 bg-indigo-200 rounded mt-0.5 w-3/4" />
            </div>
            <div className="bg-slate-50 p-1 rounded border border-slate-100">
              <p className="font-semibold text-slate-800">Clause 9: Performance Audit</p>
            </div>
          </div>
        ) : structure === 'lean-six-sigma' ? (
          <div className="space-y-0.5">
            <div className="font-bold text-emerald-900">Six Sigma DMAIC Gates</div>
            <div className="flex gap-0.5 text-[6px]">
              <span className="flex-1 bg-emerald-100 text-emerald-800 font-bold text-center rounded py-0.5">D</span>
              <span className="flex-1 bg-emerald-200 text-emerald-900 font-bold text-center rounded py-0.5">M</span>
              <span className="flex-1 bg-emerald-300 text-emerald-950 font-bold text-center rounded py-0.5">A</span>
              <span className="flex-1 bg-emerald-400 text-white font-bold text-center rounded py-0.5">I</span>
              <span className="flex-1 bg-emerald-600 text-white font-bold text-center rounded py-0.5">C</span>
            </div>
            <div className="text-[6px] text-slate-500 pt-0.5">Target: 99.95% First-Pass Yield</div>
          </div>
        ) : structure === 'checklist' ? (
          <div className="space-y-0.5">
            <div className="font-bold text-teal-800">Operational Checkpoints</div>
            <div className="space-y-0.5">
              <div className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-xs border border-teal-500 bg-teal-50" /><span>Safety guard latches inspected</span></div>
              <div className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-xs border border-teal-500 bg-teal-50" /><span>Pressure gauge at 120 PSI</span></div>
              <div className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-xs border border-teal-500 bg-teal-50" /><span>Emergency stop button tested</span></div>
            </div>
          </div>
        ) : structure === 'visual-workflow' ? (
          <div className="space-y-0.5">
            <div className="font-bold text-purple-900">Workflow Diagram Flow</div>
            <div className="flex items-center justify-between gap-0.5 pt-0.5">
              <div className="p-0.5 rounded bg-purple-100 text-purple-900 text-center flex-1">Start</div>
              <span>&gt;</span>
              <div className="p-0.5 rounded bg-purple-200 text-purple-950 text-center flex-1">Process</div>
              <span>&gt;</span>
              <div className="p-0.5 rounded bg-purple-300 text-purple-950 text-center flex-1">Gate</div>
            </div>
          </div>
        ) : (
          <div className="space-y-0.5">
            <div className="font-bold text-slate-800">Sequential Procedure</div>
            <div className="space-y-0.5">
              <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-brand-100 text-brand-700 font-bold text-[5px] flex items-center justify-center">1</span><span>Verify credentials & safety PPE</span></div>
              <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-brand-100 text-brand-700 font-bold text-[5px] flex items-center justify-center">2</span><span>Execute core procedural run</span></div>
              <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-brand-100 text-brand-700 font-bold text-[5px] flex items-center justify-center">3</span><span>Record telemetry in logbook</span></div>
            </div>
          </div>
        )}
      </div>

      {/* Mini Sign-Off Footer */}
      <div className="pt-1 border-t border-slate-100 flex items-center justify-between text-[5px] text-slate-400">
        <span>Approved: Operational Lead</span>
        <span>Page 1 of 4</span>
      </div>
    </div>
  );
};

export const TemplateGallery: React.FC<TemplateGalleryProps> = ({
  selectedStructure,
  onSelectStructure,
  showSelectOnly = false,
}) => {
  const navigate = useNavigate();
  const [previewStructure, setPreviewStructure] = useState<SOPStructure | null>(null);

  const handleSelect = (id: SOPStructure) => {
    if (onSelectStructure) {
      onSelectStructure(id);
    } else {
      navigate(`/sop/new?structure=${id}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header when viewed independently */}
      {!showSelectOnly && (
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-brand-600">Document Architecture</span>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
            Standard Procedure Templates & Layout Formats
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Choose from 11 verified structural document designs. Preview how each format structures cover pages, headings, tables, checklists, and regulatory sign-offs.
          </p>
        </div>
      )}

      {/* Templates Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {STRUCTURES.map((st) => {
          const isSelected = selectedStructure === st.id;
          return (
            <div
              key={st.id}
              className={`bg-white rounded-3xl border transition-all p-5 flex flex-col justify-between space-y-4 group ${
                isSelected
                  ? 'border-brand-600 ring-2 ring-brand-500/20 shadow-md'
                  : 'border-slate-200/90 hover:border-brand-400 hover:shadow-md'
              }`}
            >
              <div className="space-y-3">
                {/* Visual Miniature Document Preview */}
                <div className="relative group/preview">
                  <MiniatureDocumentPreview structure={st.id} />
                  
                  {/* Hover Quick Preview Button */}
                  <button
                    type="button"
                    onClick={() => setPreviewStructure(st.id)}
                    className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs opacity-0 group-hover/preview:opacity-100 transition flex items-center justify-center gap-1.5 text-white text-xs font-bold rounded-xl"
                  >
                    <Eye className="w-4 h-4" />
                    <span>View Full Document</span>
                  </button>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-brand-50 text-brand-700 px-2 py-0.5 rounded border border-brand-200">
                      {st.badge}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      Layout: {st.id}
                    </span>
                  </div>
                  <h3 className="font-extrabold text-slate-900 text-base group-hover:text-brand-600 transition">
                    {st.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                    {st.description}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setPreviewStructure(st.id)}
                  className="py-2 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center justify-center gap-1 transition"
                >
                  <Eye className="w-3.5 h-3.5 text-slate-400" />
                  <span>Preview</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSelect(st.id)}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 ${
                    isSelected
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-slate-900 hover:bg-slate-800 text-white shadow-sm'
                  }`}
                >
                  {isSelected ? <Check className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
                  <span>{isSelected ? 'Selected' : 'Use Template'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* ============================================================== */}
      {/* FULL INTERACTIVE TEMPLATE PREVIEW MODAL                        */}
      {/* ============================================================== */}
      {previewStructure && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-50 rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="bg-white p-4 sm:p-6 border-b border-slate-200 flex items-center justify-between shrink-0">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-brand-50 text-brand-700 px-2 py-0.5 rounded border border-brand-200">
                    Template Inspection
                  </span>
                  <span className="text-xs text-slate-400">1:1 Document Replica</span>
                </div>
                <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 mt-0.5">
                  {STRUCTURES.find((s) => s.id === previewStructure)?.name}
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    handleSelect(previewStructure);
                    setPreviewStructure(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md transition flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Select This Template</span>
                </button>

                <button
                  onClick={() => setPreviewStructure(null)}
                  className="p-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-500 transition"
                  title="Close Preview"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Document Body Rendered by SOPDocumentView */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-6">
              <SOPDocumentView
                content={getSampleContentForTemplate(previewStructure)}
                theme="professional-blue"
                structure={previewStructure}
                category="operations"
                editable={false}
              />
            </div>

            {/* Modal Footer */}
            <div className="bg-white p-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 shrink-0">
              <span>This preview illustrates document styling, heading structure, and layout parameters.</span>
              <button
                onClick={() => setPreviewStructure(null)}
                className="text-slate-600 font-bold hover:underline"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
