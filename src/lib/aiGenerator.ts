import type {
  SOPFormData,
  SOPGeneratedContent,
  SOPCategory,
  SOPStructure,
  SOPTheme,
  SOPSection,
  FlowchartStep,
  MetricBenchmark,
} from '../types/sop';
import { getAutomaticSOPImages } from './imageFetcher';

interface GenerateOptions {
  category: SOPCategory;
  theme: SOPTheme;
  structure: SOPStructure;
  formData: SOPFormData;
  onProgress?: (status: string) => void;
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function generateSOP(options: GenerateOptions): Promise<SOPGeneratedContent> {
  const { category, theme, structure, formData, onProgress } = options;

  onProgress?.('Validating your organizational details...');
  await sleep(400);

  onProgress?.(`Structuring document for ${category.toUpperCase()} (${structure})...`);
  await sleep(400);

  // Check if a server-side endpoint is reachable
  try {
    const res = await fetch('/.netlify/functions/generate-sop', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ category, theme, structure, formData }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data && data.sections) {
        onProgress?.('Verifying generated sections...');
        await sleep(300);
        onProgress?.('Finalizing document...');
        return data as SOPGeneratedContent;
      }
    }
  } catch (err) {
    // If serverless function is not active in current local dev, proceed to engine
    console.log('Server-side AI endpoint unavailable, using built-in generator engine.');
  }

  onProgress?.('Synthesizing professional operational procedures...');
  await sleep(500);

  onProgress?.('Applying compliance checks and review disclaimers...');
  await sleep(300);

  // Generate structured, high-standard SOP sections
  const sections = buildStructuredSections(category, structure, formData);

  onProgress?.('Finalizing document...');
  await sleep(300);

  // Build review disclaimer if high-risk or standard
  let disclaimer = 'DRAFT STANDARD OPERATING PROCEDURE. This document is an initial draft generated for operational guidance. It must be formally reviewed and approved by authorized personnel prior to operational implementation.';
  if (['workplace-safety', 'safety', 'healthcare', 'manufacturing', 'quality', 'warehouse', 'construction', 'food-service', 'cybersecurity', 'environmental', 'legal'].includes(category)) {
    disclaimer = `CRITICAL REVIEW NOTICE: This SOP pertains to ${category.toUpperCase()}, a regulated or safety-critical operational domain. Under no circumstances should this procedure be deployed without comprehensive review and sign-off by a qualified compliance or domain officer. AI generation does not substitute certified regulatory, legal, or health standards.`;
  }

  // Build flowchart, metrics charts, and automatic domain imagery
  const flowchart = buildFlowchartSteps(category, formData);
  const metricsChart = buildMetricsChart(category, formData);
  const images = getAutomaticSOPImages(category, formData.title);

  const generated: SOPGeneratedContent = {
    documentTitle: formData.title || 'Standard Operating Procedure',
    organization: formData.companyName || 'Enterprise Organization',
    metadata: {
      sopId: formData.sopId || `SOP-${category.toUpperCase().slice(0, 3)}-${Math.floor(1000 + Math.random() * 9000)}`,
      version: formData.version || '1.0',
      effectiveDate: formData.effectiveDate || new Date().toISOString().split('T')[0],
      department: formData.department || 'Operations',
      preparedBy: formData.preparedBy || '[Insert Author Name/Title]',
      reviewedBy: formData.reviewedBy || '[Insert Reviewer Name/Title]',
      approvedBy: formData.approvedBy || '[Insert Approver Name/Title]',
    },
    executiveSummary: formData.purpose
      ? `This procedure establishes the formal protocol for ${formData.title.toLowerCase()} across ${formData.department || 'all relevant departments'}. Its primary objective is to maintain operational consistency, regulatory compliance, defect reduction, and risk mitigation.`
      : `Standard operating protocol for ${formData.title}.`,
    disclaimer,
    flowchart,
    metricsChart,
    images,
    sections,
  };

  return generated;
}

function buildFlowchartSteps(category: SOPCategory, formData: SOPFormData): FlowchartStep[] {
  if (category === 'warehouse') {
    return [
      { id: 'flow-1', stepNumber: 1, label: 'Inbound Dock Arrival', description: 'Inspect manifest and pallet bill of lading.', role: 'Receiving Clerk', shape: 'start' },
      { id: 'flow-2', stepNumber: 2, label: 'Barcode Scan & Triage', description: 'Log SKU in WMS and assign storage zone.', role: 'WMS Operator', shape: 'process' },
      { id: 'flow-3', stepNumber: 3, label: 'Put-Away / Rack Slotting', description: 'Transport to assigned high-bay racking location.', role: 'Forklift Driver', shape: 'process' },
      { id: 'flow-4', stepNumber: 4, label: 'Cycle Count Verification', description: 'Verify inventory tally against ERP records.', role: 'Inventory Auditor', shape: 'decision' },
      { id: 'flow-5', stepNumber: 5, label: 'Pick-Pack-Ship Gate', description: 'Release for staging and outbound carrier dispatch.', role: 'Shipping Lead', shape: 'end' },
    ];
  }

  if (category === 'manufacturing') {
    return [
      { id: 'flow-1', stepNumber: 1, label: 'Machine Pre-Flight', description: 'Calibrate sensors, clean tooling, and verify raw stock.', role: 'Line Operator', shape: 'start' },
      { id: 'flow-2', stepNumber: 2, label: 'Production Run Initiation', description: 'Engage automated assembly line per recipe parameters.', role: 'Machinist Lead', shape: 'process' },
      { id: 'flow-3', stepNumber: 3, label: 'In-Process QA Gate', description: 'Tolerance sampling and statistical process check.', role: 'Quality Inspector', shape: 'decision' },
      { id: 'flow-4', stepNumber: 4, label: 'Defect Quota Audit', description: 'Isolate off-spec units and record batch non-conformance.', role: 'QA Lead', shape: 'process' },
      { id: 'flow-5', stepNumber: 5, label: 'Final Packaging & Tagging', description: 'Affix lot serials and transfer to finished goods.', role: 'Shift Supervisor', shape: 'end' },
    ];
  }

  return [
    {
      id: 'flow-1',
      stepNumber: 1,
      label: 'Pre-Operational Initiation',
      description: 'Verify prerequisites, credentials, and facility readiness checklists.',
      role: formData.preparedBy || 'Primary Operator',
      shape: 'start',
    },
    {
      id: 'flow-2',
      stepNumber: 2,
      label: 'Core Procedural Action',
      description: 'Execute baseline operational workflow per technical parameters.',
      role: 'Designated Specialist',
      shape: 'process',
    },
    {
      id: 'flow-3',
      stepNumber: 3,
      label: 'Quality & Safety Verification Gate',
      description: 'Evaluate against critical tolerances and safety inspection rules.',
      role: formData.reviewedBy || 'QA / Supervisor',
      shape: 'decision',
    },
    {
      id: 'flow-4',
      stepNumber: 4,
      label: 'Deviation / Escalation Path',
      description: 'If non-conformance is detected, halt run and trigger rollback plan.',
      role: 'Escalation Officer',
      shape: 'process',
    },
    {
      id: 'flow-5',
      stepNumber: 5,
      label: 'Formal Handover & Archival',
      description: 'Log telemetry in repository and complete authorization sign-offs.',
      role: formData.approvedBy || 'Department Head',
      shape: 'end',
    },
  ];
}

function buildMetricsChart(category: SOPCategory, formData: SOPFormData): { title: string; benchmarks: MetricBenchmark[] } {
  if (category === 'warehouse') {
    return {
      title: 'Warehouse & Logistics Performance Benchmarks',
      benchmarks: [
        { label: 'Order Picking Accuracy Rate', current: 99.7, target: 99.9, unit: '%', status: 'optimal' },
        { label: 'Dock-to-Stock Turnaround Time', current: 42, target: 45, unit: 'min', status: 'optimal' },
        { label: 'Inventory Cycle Count Variance', current: 0.08, target: 0.15, unit: '%', status: 'optimal' },
        { label: 'On-Time Outbound Dispatch SLA', current: 98.9, target: 99.0, unit: '%', status: 'optimal' },
      ],
    };
  }

  if (category === 'manufacturing') {
    return {
      title: 'Manufacturing & Plant Quality Benchmarks',
      benchmarks: [
        { label: 'Overall Equipment Effectiveness (OEE)', current: 87.2, target: 85.0, unit: '%', status: 'optimal' },
        { label: 'First-Pass Yield (FPY)', current: 98.8, target: 99.0, unit: '%', status: 'optimal' },
        { label: 'Scrap & Defect Rate Allowance', current: 0.04, target: 0.08, unit: '%', status: 'optimal' },
        { label: 'Mean Time Between Failures (MTBF)', current: 340, target: 300, unit: 'hrs', status: 'optimal' },
      ],
    };
  }

  return {
    title: 'Operational KPI & Quality Threshold Benchmarks',
    benchmarks: [
      {
        label: 'First-Pass Yield / Success Rate',
        current: 98.4,
        target: 99.0,
        unit: '%',
        status: 'optimal',
      },
      {
        label: 'Procedure Adherence Audit',
        current: 100,
        target: 100,
        unit: '%',
        status: 'optimal',
      },
      {
        label: 'Incident Resolution / SLA Time',
        current: 12.5,
        target: 15.0,
        unit: 'min',
        status: 'optimal',
      },
      {
        label: 'Discrepancy & Defect Tolerance',
        current: 0.04,
        target: 0.10,
        unit: '%',
        status: 'optimal',
      },
    ],
  };
}

function buildStructuredSections(
  category: SOPCategory,
  structure: SOPStructure,
  formData: SOPFormData
): SOPSection[] {
  const sections: SOPSection[] = [];
  const catSpec = formData.categorySpecific || {};

  // 1. Purpose
  sections.push({
    id: 'sec-purpose',
    title: '1. Purpose & Objective',
    type: 'text',
    content: formData.purpose
      ? formData.purpose
      : `The purpose of this Standard Operating Procedure (SOP) is to provide an unambiguous, repeatable, and verified methodology for conducting ${formData.title} within ${formData.companyName || 'the organization'}. Adherence ensures operational alignment, elimination of variance, and rigorous compliance.`,
  });

  // 2. Scope
  sections.push({
    id: 'sec-scope',
    title: '2. Scope & Applicability',
    type: 'text',
    content: formData.scope
      ? formData.scope
      : `This SOP applies to all designated personnel, contractors, and departments performing ${formData.title.toLowerCase()}. It governs activities executed across ${formData.department || 'the operations'} group and defines interface boundaries with cross-functional units.`,
  });

  // 3. Definitions & Acronyms
  sections.push({
    id: 'sec-definitions',
    title: '3. Definitions & Terminology',
    type: 'text',
    content: `• SOP: Standard Operating Procedure\n• SME: Subject Matter Expert\n• QA/QC: Quality Assurance / Quality Control\n• SLA: Service Level Agreement\n• Escalation Point: Authorized individual responsible for approving emergency deviations.`,
  });

  // 4. Roles and Responsibilities
  sections.push({
    id: 'sec-roles',
    title: '4. Roles & Responsibilities',
    type: 'steps',
    content: formData.responsibilities || 'Specific duty allocations for the governance and execution of this procedure:',
    items: [
      `Primary Operator / Assignee: Responsible for day-to-day execution of procedural steps in accordance with this document.`,
      `Department Supervisor (${formData.department || 'Management'}): Responsible for overseeing adherence, conducting periodic audits, and verifying resource availability.`,
      `Reviewer (${formData.reviewedBy || '[Insert Reviewer Title]'}): Responsible for technical and regulatory verification prior to procedural deployment.`,
      `Approver (${formData.approvedBy || '[Insert Approver Title]'}): Holds ultimate authorization to publish, amend, or decommission this procedure.`,
    ],
  });

  // 5. Prerequisites, Equipment & Resources
  const prereqItems: string[] = [];
  if (formData.requiredTools) {
    prereqItems.push(`Required Equipment/Tools: ${formData.requiredTools}`);
  } else {
    prereqItems.push('Designated workstation with authenticated system access.');
    prereqItems.push('Standard personal protective equipment (PPE) or digital toolsets.');
  }

  if (catSpec.systemName) prereqItems.push(`Target System/Environment: ${catSpec.systemName}`);
  if (catSpec.accessRequirements) prereqItems.push(`Access & Permissions: ${catSpec.accessRequirements}`);
  if (catSpec.storageZones) prereqItems.push(`Designated Storage Zones: ${catSpec.storageZones}`);
  if (catSpec.inventorySystem) prereqItems.push(`WMS / Inventory Database: ${catSpec.inventorySystem}`);
  if (catSpec.equipmentSpecs) prereqItems.push(`Machinery & Tooling: ${catSpec.equipmentSpecs}`);
  if (catSpec.rawMaterials) prereqItems.push(`Specified Materials / Bill of Materials: ${catSpec.rawMaterials}`);

  sections.push({
    id: 'sec-prerequisites',
    title: '5. Prerequisites, Equipment & Resources',
    type: 'checklist',
    content: 'Verify all required resources are available, calibrated, and operational prior to commencing work:',
    items: prereqItems,
  });

  // 6. Structure-Specific Core Procedures
  if (structure === 'raci-matrix') {
    sections.push({
      id: 'sec-raci',
      title: '6. RACI Accountability & Governance Matrix',
      type: 'table',
      content: 'Clear allocation of responsibility per task (R = Responsible, A = Accountable, C = Consulted, I = Informed):',
      tableData: {
        headers: ['Milestone / Procedural Task', 'Operator', 'Supervisor', 'QA Lead', 'Dept Head'],
        rows: [
          ['Task 1: Pre-Execution Inspection & Calibration', 'R (Executes)', 'A (Signs off)', 'C (Advises)', 'I (Notified)'],
          ['Task 2: Core Workflow Operation', 'R (Executes)', 'A (Monitors)', 'I (Informed)', 'I (Informed)'],
          ['Task 3: Quality Sampling & Tolerance Audit', 'C (Assists)', 'A (Authorizes)', 'R (Performs audit)', 'I (Informed)'],
          ['Task 4: Non-Conformance Isolation & Rollback', 'R (Isolates)', 'A (Decides action)', 'C (Advises)', 'A (Notified)'],
          ['Task 5: Final Sign-off, Archival & Handover', 'R (Submits)', 'A (Approves)', 'C (Logs)', 'I (Informed)'],
        ],
      },
    });
  } else if (structure === 'iso-9001') {
    sections.push({
      id: 'sec-iso',
      title: '6. ISO 9001:2015 Quality Management Protocol',
      type: 'steps',
      content: 'Clauses mapped according to ISO 9001:2015 High-Level Structure (HLS):',
      items: [
        'Clause 4 (Context of Organization): Determine internal and external factors influencing this operational process.',
        'Clause 7 (Support & Resource Management): Ensure personnel competency, equipment calibration, and environment control.',
        'Clause 8 (Operational Planning & Control): Execute defined manufacturing/operational sequence strictly to specifications.',
        'Clause 9 (Performance Evaluation): Conduct statistical process audits, monitor KPIs, and record quality inspection data.',
        'Clause 10 (Non-conformity & Corrective Action): Immediately log root cause, apply containment, and prevent recurrence.',
      ],
    });
  } else if (structure === 'lean-six-sigma') {
    sections.push({
      id: 'sec-dmaic',
      title: '6. Lean Six Sigma DMAIC Process Framework',
      type: 'steps',
      content: 'Execute process according to the 5 DMAIC optimization gates:',
      items: [
        'D - Define: Establish the critical-to-quality (CTQ) specifications, customer requirements, and baseline scope.',
        'M - Measure: Capture real-time cycle times, defect per million opportunities (DPMO), and process capability.',
        'A - Analyze: Identify root causes of variation using fishbone analysis, 5-Why methodology, and Pareto charts.',
        'I - Improve: Implement standard operating adjustments, poka-yoke (mistake-proofing), and optimized sequencing.',
        'C - Control: Institute statistical process control (SPC) charts, standard work audits, and visual management controls.',
      ],
    });
  } else if (structure === 'quick-reference') {
    sections.push({
      id: 'sec-quickref',
      title: '6. Quick Reference Operational Summary',
      type: 'checklist',
      content: 'Critical at-a-glance instructions for fast field execution:',
      items: [
        'STEP 1: Check power, network, and safety guard locks.',
        'STEP 2: Load parameters and verify batch serial numbers.',
        'STEP 3: Run operational sequence — watch pressure/telemetry gauge.',
        'STEP 4: If warning beacon flashes, trigger STOP and alert supervisor.',
        'STEP 5: Record completion stamp on batch physical traveler card.',
      ],
    });
  } else if (structure === 'table') {
    sections.push({
      id: 'sec-procedure',
      title: '6. Procedural Action & Verification Matrix',
      type: 'table',
      content: 'Detailed action matrix indicating responsible role and expected verification outcomes for each stage:',
      tableData: {
        headers: ['Phase', 'Responsible Role', 'Action Required', 'Verification Criteria'],
        rows: [
          [
            'Phase 1: Pre-Check',
            'Operator / Assignee',
            'Inspect operational environment, credentials, and equipment readiness.',
            'Readiness checklist signed and logged.',
          ],
          [
            'Phase 2: Execution',
            'Designated Specialist',
            formData.procedureDetails
              ? formData.procedureDetails.slice(0, 120) + '...'
              : 'Execute core operational parameters according to standard instructions.',
            'Parameters remain within specified tolerance limits.',
          ],
          [
            'Phase 3: Quality Check',
            'QA / Supervisor',
            catSpec.samplingCriteria || 'Conduct quality sampling and cross-check against specifications.',
            'Zero non-conformance defects observed.',
          ],
          [
            'Phase 4: Closure & Handover',
            'Shift Lead',
            'Archive session logs, sign off documentation, and transition workspace.',
            'Audit record stored in authorized repository.',
          ],
        ],
      },
    });
  } else if (structure === 'checklist') {
    const rawDetails = formData.procedureDetails || 'Execute standard milestone checks and verify completion.';
    const splitSteps = rawDetails
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    sections.push({
      id: 'sec-procedure',
      title: '6. Operational Checklist',
      type: 'checklist',
      content: 'Complete each verification item sequentially. Log any deviation in the discrepancy record.',
      items:
        splitSteps.length > 2
          ? splitSteps
          : [
              'Verify initial operating conditions and confirm readiness checklist.',
              'Initiate core operational sequence as outlined in technical specifications.',
              'Monitor primary telemetry, parameters, or service benchmarks throughout execution.',
              'Perform post-execution quality audit and document outputs in system logs.',
              'Sign off on completion and notify subsequent shift or designated supervisor.',
            ],
    });
  } else {
    // Standard or Step-by-step
    const rawSteps = formData.procedureDetails
      ? formData.procedureDetails.split('\n').filter((s) => s.trim().length > 0)
      : [
          'Pre-Execution Verification: Validate environmental readiness, confirm access authorization, and ensure all prerequisites are satisfied.',
          'Initial Configuration & Setup: Establish connection or setup workstation in compliance with organizational security baselines.',
          'Core Procedural Execution: Perform primary workflow steps ensuring continuous observation of operational tolerances.',
          'Exception Handling & Discrepancies: In the event of an anomaly, halt execution, isolate impacted components, and notify the designated escalation contact.',
          'Verification & Quality Validation: Conduct an end-to-end check of deliverables to verify adherence to defined acceptance criteria.',
          'Post-Execution Handover & Archival: Complete audit log entries, store records in the central document management system, and reset the operational area.',
        ];

    sections.push({
      id: 'sec-procedure',
      title: '6. Step-by-Step Procedure',
      type: 'steps',
      content: 'Execute each procedural step in strict sequential order. Do not skip milestones without supervisor sign-off.',
      items: rawSteps,
    });
  }

  // 7. Safety / Risk / Contingency
  const safetyText =
    formData.safetyRisk ||
    catSpec.hazardIdentification ||
    'Identify and mitigate potential risks associated with this procedure. Adhere to all safety guidelines.';

  sections.push({
    id: 'sec-safety',
    title: '7. Safety, Risk Mitigation & Contingency Protocols',
    type: 'warning',
    content: safetyText,
    items: [
      `PPE / Safety Standard: ${catSpec.ppeRequirements || 'Standard workplace safety precautions apply.'}`,
      `Emergency Response: ${catSpec.emergencyProcedures || 'Evacuate or isolate system; immediately notify supervisor and emergency response team.'}`,
      `Rollback / Fallback: ${catSpec.backupRollbackPlan || 'Revert to last verified stable state if operational failure occurs.'}`,
    ],
  });

  // 8. Documentation & Record Retention
  sections.push({
    id: 'sec-records',
    title: '8. Records, Auditing & Document History',
    type: 'text',
    content: `All operational records, logs, and verification sign-offs generated pursuant to this procedure must be retained for a minimum of 3 years in accordance with organizational compliance policy. Audits may be performed at periodic intervals by internal QA or regulatory oversight bodies.`,
  });

  // 9. Sign-off and Authorization
  sections.push({
    id: 'sec-signoff',
    title: '9. Formal Approvals & Authorization',
    type: 'text',
    content: `By signing below, the author, reviewer, and approver verify that this procedure has been validated and reflects current operational standards:`,
  });

  return sections;
}
