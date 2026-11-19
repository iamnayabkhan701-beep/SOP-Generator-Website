import type {
  SOPCategory,
  SOPTheme,
  SOPStructure,
  SOPDocument,
  SOPSuite,
  CompanyInfoFormData,
  SOPFormData,
  SOPGeneratedContent,
  SOPSection,
  FlowchartStep,
  MetricBenchmark,
} from '../types/sop';
import { getSOPsForDepartment } from '../data/sopLibraryRegistry';
import type { DepartmentTopic } from '../data/departmentTemplates';
import { createMultipleSOPDocuments, saveSOPSuite } from './supabase';
import { getAutomaticSOPImages } from './imageFetcher';

interface GenerateSuiteOptions {
  departmentId: SOPCategory;
  companyInfo: CompanyInfoFormData;
  theme: SOPTheme;
  structure: SOPStructure;
  userId: string;
  onProgress?: (current: number, total: number, message: string) => void;
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Automatically synthesizes the complete researched SOP suite for an entire department.
 * Does NOT require users to select templates individually or fill repetitive forms.
 */
export async function generateDepartmentSOPSuite(options: GenerateSuiteOptions): Promise<SOPSuite> {
  const { departmentId, companyInfo, theme, structure, userId, onProgress } = options;

  // 1. Retrieve all researched SOPs for this department
  const applicableTopics = getSOPsForDepartment(departmentId);
  if (applicableTopics.length === 0) {
    throw new Error(`No researched SOPs available for department: ${departmentId}`);
  }

  const total = applicableTopics.length;
  const suiteId = crypto.randomUUID();
  const suiteTitle = `${companyInfo.companyName} — ${companyInfo.departmentName} Standard Operating Procedures`;
  const documents: SOPDocument[] = [];

  onProgress?.(0, total, `Initializing ${total} procedures for ${companyInfo.departmentName}...`);
  await sleep(250);

  // 2. Synthesize each SOP document tailored to the company's profile
  for (let idx = 0; idx < applicableTopics.length; idx++) {
    const topic = applicableTopics[idx];
    const seqNum = idx + 1;
    const sopCode = `SOP-${departmentId.toUpperCase().slice(0, 3)}-${String(seqNum).padStart(3, '0')}`;

    onProgress?.(
      seqNum,
      total,
      `Synthesizing procedure ${seqNum} of ${total}: ${topic.topicName || topic.title}...`
    );

    // Yield execution to keep UI responsive
    await sleep(60);

    // Build specific form data for this SOP
    const docFormData = buildDocumentFormData(topic, companyInfo, departmentId, sopCode);

    // Build complete 14-section generated content
    const generatedContent = buildCompleteSOPContent(topic, docFormData, companyInfo, departmentId, sopCode, structure);

    const docId = crypto.randomUUID();
    const doc: SOPDocument = {
      id: docId,
      user_id: userId,
      title: topic.title,
      category: departmentId,
      selected_topic: topic.topicName || topic.title,
      theme,
      structure,
      target_page_count: topic.estimatedPages || 3,
      status: 'ready',
      form_data: docFormData,
      generated_content: generatedContent,
      edited_content: generatedContent,
      actual_page_count: topic.estimatedPages || 3,
      version: 1,
      suite_id: suiteId,
      suite_title: suiteTitle,
      sequence_number: seqNum,
      total_in_suite: total,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    documents.push(doc);
  }

  onProgress?.(total, total, `Finalizing and indexing ${total} SOP documents...`);
  await sleep(200);

  // 3. Batch persist documents and suite
  await createMultipleSOPDocuments(documents);

  const suite: SOPSuite = {
    id: suiteId,
    user_id: userId,
    departmentId,
    departmentName: companyInfo.departmentName,
    companyName: companyInfo.companyName,
    title: suiteTitle,
    totalSOPs: documents.length,
    documents,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    status: 'ready',
  };

  await saveSOPSuite(suite);

  return suite;
}

/**
 * Builds individual SOPFormData by blending company info and researched topic criteria
 */
function buildDocumentFormData(
  topic: DepartmentTopic,
  company: CompanyInfoFormData,
  departmentId: SOPCategory,
  sopCode: string
): SOPFormData {
  const tools =
    company.departmentDetails.wmsSystem ||
    company.departmentDetails.testingEquipment ||
    company.departmentDetails.infrastructureModel ||
    company.departmentDetails.toolsAndSystems ||
    topic.requiredResources ||
    'Standard enterprise operational tools';

  const safety =
    topic.safetyRisk ||
    topic.safetyRisks ||
    company.departmentDetails.qualitySafetyControls ||
    'Strict adherence to operational safety guidelines and hazard identification.';

  const quality =
    topic.qualityChecks ||
    topic.qualityControls ||
    company.departmentDetails.spcTolerances ||
    '100% compliance with defined quality benchmarks and verification checks.';

  const refs =
    [...(topic.referencedStandards || []), ...(company.applicableStandards || [])].join('; ') ||
    'ISO 9001:2015 Quality Management Framework';

  return {
    companyName: company.companyName,
    department: company.departmentName,
    selectedTopic: topic.topicName || topic.title,
    title: topic.title,
    sopId: sopCode,
    purpose: `${topic.purpose} Tailored specifically for ${company.companyName} within the ${company.industry} sector.`,
    scope: `${topic.scope} Governs all operations executed across ${company.city ? `${company.city}, ` : ''}${company.country}.`,
    responsibilities: `${topic.responsibilities} Overseen by ${company.departmentName} management and authorized by ${company.approvedBy || 'Operations Leadership'}.`,
    procedureDetails: topic.procedureDetails,
    requiredResources: `${topic.requiredResources}. Enterprise systems utilized: ${tools}.`,
    requiredTools: tools,
    safetyRisk: safety,
    qualityChecks: quality,
    documentationRecords: topic.documentationRecords,
    references: refs,
    relatedDocuments: topic.references || refs,
    preparedBy: company.preparedBy || 'Operations Lead',
    reviewedBy: company.reviewedBy || 'Quality & Compliance Manager',
    approvedBy: company.approvedBy || 'Vice President of Operations',
    effectiveDate: company.effectiveDate || new Date().toISOString().split('T')[0],
    version: company.version || '1.0',
    targetPageLength: 'standard',
    categorySpecific: company.departmentDetails,
  };
}

/**
 * Builds all 14 comprehensive, professional sections matching strict enterprise standards
 */
function buildCompleteSOPContent(
  topic: DepartmentTopic,
  formData: SOPFormData,
  company: CompanyInfoFormData,
  departmentId: SOPCategory,
  sopCode: string,
  structure: SOPStructure
): SOPGeneratedContent {
  const sections: SOPSection[] = [];
  const deptDetails = company.departmentDetails;

  // 1. Document Information & Governance Header
  sections.push({
    id: 'sec-doc-info',
    title: '1. Document Control & Identification',
    type: 'table',
    content: `Standard Operating Procedure identification parameters for ${company.companyName}:`,
    tableData: {
      headers: ['Parameter', 'Specification', 'Parameter', 'Specification'],
      rows: [
        ['SOP Number:', sopCode, 'Version:', formData.version],
        ['Department:', formData.department, 'Effective Date:', formData.effectiveDate],
        ['Organization:', formData.companyName, 'Review Cycle:', 'Annual (or upon process change)'],
        ['Industry / Sector:', company.industry, 'Facility / Site:', `${company.city || 'Primary Site'}, ${company.country}`],
      ],
    },
  });

  // 2. Purpose & Objectives
  sections.push({
    id: 'sec-purpose',
    title: '2. Purpose & Operational Objectives',
    type: 'text',
    content:
      formData.purpose ||
      `The purpose of this procedure is to establish an authoritative, repeatable, and verified operating standard for ${topic.title} at ${company.companyName}. Adherence guarantees zero operational variance, regulatory compliance, quality excellence, and workplace safety.`,
  });

  // 3. Scope & Applicability
  sections.push({
    id: 'sec-scope',
    title: '3. Scope & Applicability',
    type: 'text',
    content:
      formData.scope ||
      `This Standard Operating Procedure applies to all permanent, contractual, and technical personnel executing ${topic.topicName || topic.title} within ${company.departmentName} at ${company.companyName}. It governs all related inputs, tools, processes, and documentation across all operating shifts.`,
  });

  // 4. Roles & Responsibilities
  const roleItems = parseRoleItems(formData.responsibilities, company);
  sections.push({
    id: 'sec-roles',
    title: '4. Roles & Responsibilities',
    type: 'steps',
    content: 'Clear allocation of responsibility and operational authority for the execution of this procedure:',
    items: roleItems,
  });

  // 5. Definitions & Acronyms
  const definitions = buildDefinitions(topic, departmentId);
  sections.push({
    id: 'sec-definitions',
    title: '5. Definitions & Terminology',
    type: 'text',
    content: definitions,
  });

  // 6. Required Resources, Equipment & Systems
  const resourceItems = buildResourceItems(topic, company, formData);
  sections.push({
    id: 'sec-resources',
    title: '6. Required Resources, Equipment & Tooling',
    type: 'checklist',
    content: 'Verify all required credentials, authenticated software access, and operational equipment prior to initiating work:',
    items: resourceItems,
  });

  // 7. Detailed Step-by-Step Procedure
  const proceduralSteps = parseProceduralSteps(topic.procedureDetails);
  sections.push({
    id: 'sec-procedure',
    title: '7. Detailed Step-by-Step Procedural Workflow',
    type: 'steps',
    content: 'Execute each procedural step in strict sequential order. Any unauthorized variation or procedural bypass is strictly prohibited:',
    items: proceduralSteps,
  });

  // 8. Operational Controls & Governance Parameters
  const controlRows = buildOperationalControlRows(topic, company);
  sections.push({
    id: 'sec-controls',
    title: '8. Operational Controls & Governance Parameters',
    type: 'table',
    content: `Specific operational control parameters and monitoring thresholds established for ${topic.topicName || topic.title}:`,
    tableData: {
      headers: ['Control Dimension', 'Standard Operational Requirement & Verification Check'],
      rows: controlRows,
    },
  });

  // 9. Safety, Risk Mitigation & Contingency Protocols
  const safetyText = formData.safetyRisk || 'Comprehensive hazard identification and risk mitigation protocol.';
  sections.push({
    id: 'sec-safety',
    title: '9. Safety, Risk Mitigation & Contingency Protocols',
    type: 'warning',
    content: safetyText,
    items: [
      `Mandatory Safety Standard: ${deptDetails.qualitySafetyControls || 'Standard enterprise safety gear and protocol adherence required at all times.'}`,
      'Emergency Response & Isolation: In the event of a critical deviation, anomaly, or safety threat, immediately stop operations, isolate the system/equipment, and notify the designated shift supervisor.',
      'Contingency & Rollback: Revert immediately to the last verified safe operating baseline per organizational business continuity policy.',
    ],
  });

  // 10. Quality Checks & Verification Standards
  const qualityItems = parseQualityItems(formData.qualityChecks);
  sections.push({
    id: 'sec-quality',
    title: '10. Quality Checks, Tolerances & Acceptance Criteria',
    type: 'checklist',
    content: 'Mandatory quality verification milestones that must be satisfied during operational execution:',
    items: qualityItems,
  });

  // 11. Records, Forms & Documentation Retention
  const docRecords =
    formData.documentationRecords ||
    'Completed verification sign-offs, inspection records, and incident reports must be archived in the enterprise document repository and retained for a minimum of three (3) years for regulatory and quality audit purposes.';
  sections.push({
    id: 'sec-records',
    title: '11. Documentation, Records & Audit Retention',
    type: 'text',
    content: docRecords,
  });

  // 12. Regulatory References & Compliance Standards
  const references =
    formData.references ||
    'ISO 9001:2015 Quality Management Systems; Relevant statutory OSHA and institutional compliance standards.';
  sections.push({
    id: 'sec-references',
    title: '12. Regulatory References & Compliance Standards',
    type: 'text',
    content: references,
  });

  // 13. Revision History
  sections.push({
    id: 'sec-revision-history',
    title: '13. Revision History & Change Log',
    type: 'table',
    content: 'Formal record of document approvals, modifications, and periodic reviews:',
    tableData: {
      headers: ['Rev #', 'Effective Date', 'Section(s) Modified', 'Description of Change', 'Authorized By'],
      rows: [
        ['1.0', formData.effectiveDate, 'All Sections', 'Initial baseline operational release for organization', formData.approvedBy],
      ],
    },
  });

  // 14. Formal Approvals & Authorization Sign-off
  sections.push({
    id: 'sec-signoff',
    title: '14. Formal Approvals & Sign-off Authorization',
    type: 'text',
    content: `Prepared By: ${formData.preparedBy} | Reviewed By: ${formData.reviewedBy} | Approved By: ${formData.approvedBy} | Effective Date: ${formData.effectiveDate} | Status: AUTHORIZED & ACTIVE`,
  });

  // Build flowchart and metrics
  const flowchart = buildTopicFlowchart(topic, formData);
  const metricsChart = buildTopicMetrics(topic, departmentId);
  const images = getAutomaticSOPImages(departmentId, topic.title);

  return {
    documentTitle: topic.title,
    organization: company.companyName,
    metadata: {
      sopId: sopCode,
      version: formData.version,
      effectiveDate: formData.effectiveDate,
      department: company.departmentName,
      preparedBy: formData.preparedBy,
      reviewedBy: formData.reviewedBy,
      approvedBy: formData.approvedBy,
    },
    executiveSummary: `This Standard Operating Procedure establishes the authorized methodology for ${topic.title.toLowerCase()} across ${company.companyName}. Its primary mandate is to eliminate procedural variance, enforce rigorous safety and quality controls, and maintain complete compliance with governing standards.`,
    disclaimer:
      'OFFICIAL STANDARD OPERATING PROCEDURE. This document represents the approved operational standard of the organization. Any deviation from this protocol requires formal written authorization from the designated quality or operations authority.',
    flowchart,
    metricsChart,
    images,
    sections,
  };
}

function parseRoleItems(rolesString: string, company: CompanyInfoFormData): string[] {
  if (!rolesString) {
    return [
      `Primary Operator: Responsible for day-to-day execution of procedural steps in accordance with this document.`,
      `Department Supervisor (${company.departmentName}): Responsible for overseeing shift adherence and verifying resource availability.`,
      `Reviewer (${company.reviewedBy || 'Quality Assurance'}): Responsible for technical verification and audit sign-off.`,
      `Approver (${company.approvedBy || 'Operations Leadership'}): Holds ultimate authority to authorize procedural execution.`,
    ];
  }

  // Split on semicolons or newlines
  const parts = rolesString.split(/[;\n]/).map((p) => p.trim()).filter(Boolean);
  if (parts.length >= 2) {
    return parts;
  }

  return [
    `Operational Specialist: ${rolesString}`,
    `Reviewer (${company.reviewedBy || 'Quality Manager'}): Ensures adherence to regulatory criteria.`,
    `Approver (${company.approvedBy || 'Department Head'}): Approves release and modifications.`,
  ];
}

function parseProceduralSteps(rawDetails: string): string[] {
  if (!rawDetails) {
    return [
      'Pre-Execution Verification: Validate environmental readiness, confirm access authorization, and ensure all prerequisites are satisfied.',
      'Initial Configuration & Setup: Establish connection or setup workstation in compliance with organizational security baselines.',
      'Core Procedural Execution: Perform primary workflow steps ensuring continuous observation of operational tolerances.',
      'Exception Handling & Discrepancies: In the event of an anomaly, halt execution, isolate impacted components, and notify the designated escalation contact.',
      'Verification & Quality Validation: Conduct an end-to-end check of deliverables to verify adherence to defined acceptance criteria.',
      'Post-Execution Handover & Archival: Complete audit log entries, store records in the central document management system, and reset the operational area.',
    ];
  }

  // Check if numbered (e.g. "1. ...\n2. ...")
  const lines = rawDetails.split(/\n+/).map((l) => l.trim()).filter(Boolean);
  if (lines.length > 1) {
    return lines;
  }

  // Split by numbered prefixes if concatenated
  const splitByNumbers = rawDetails.split(/(?=\d+\.\s)/).map((s) => s.trim()).filter(Boolean);
  if (splitByNumbers.length > 1) {
    return splitByNumbers;
  }

  return [rawDetails];
}

function parseQualityItems(rawChecks?: string): string[] {
  if (!rawChecks) {
    return [
      'Input credentials and material specifications verified prior to execution.',
      'Core operational parameters verified against specified tolerance limits.',
      'Zero critical non-conformances or deviations recorded during run.',
      'Peer or supervisor verification signature obtained upon completion.',
    ];
  }

  const items = rawChecks.split(/[;\n]/).map((c) => c.trim()).filter(Boolean);
  return items.length > 0 ? items : [rawChecks];
}

function buildDefinitions(topic: DepartmentTopic, deptId: SOPCategory): string {
  const baseDefs = [
    '• SOP: Standard Operating Procedure — Authoritative document prescribing exact methods for operational tasks.',
    '• QMS: Quality Management System — Structured system of documented procedures, controls, and responsibilities.',
    '• Non-Conformance (NCR): Any condition or output that fails to satisfy specified requirements.',
    '• CAPA: Corrective and Preventive Action — Systematic protocol to identify root causes and eliminate recurrences.',
    '• SLA: Service Level Agreement — Guaranteed threshold for operational completion and quality.',
  ];

  if (deptId === 'warehouse') {
    baseDefs.push('• WMS: Warehouse Management System — Software managing inventory slotting, picking, and tracking.');
    baseDefs.push('• GRN: Goods Receipt Note — Formal receipt verifying physical count matches vendor packing slip.');
    baseDefs.push('• FIFO / FEFO: First-In First-Out / First-Expired First-Out inventory rotation methodologies.');
  } else if (deptId === 'qa' || deptId === 'qc') {
    baseDefs.push('• AQL: Acceptance Quality Limit — Maximum percentage of defectives deemed acceptable.');
    baseDefs.push('• Calibration: Comparison of measurement device accuracy against a known national standard.');
  } else if (deptId === 'healthcare') {
    baseDefs.push('• EHR: Electronic Health Record — Digital system containing longitudinal patient medical data.');
    baseDefs.push('• HIPAA: Health Insurance Portability and Accountability Act protecting patient health data.');
  } else if (deptId === 'it') {
    baseDefs.push('• RPO / RTO: Recovery Point Objective / Recovery Time Objective defining disaster recovery limits.');
    baseDefs.push('• IAM: Identity and Access Management system controlling user authentication and permissions.');
  }

  return baseDefs.join('\n');
}

function buildResourceItems(
  topic: DepartmentTopic,
  company: CompanyInfoFormData,
  formData: SOPFormData
): string[] {
  const items: string[] = [];

  if (formData.requiredTools) {
    items.push(`Primary Software & Systems: ${formData.requiredTools}`);
  }

  if (topic.requiredResources) {
    items.push(`Operational Tooling & Gear: ${topic.requiredResources}`);
  }

  items.push('Designated authenticated user account with authorized role-based permissions.');
  items.push(`Workplace safety equipment: Personal Protective Equipment (PPE) appropriate for ${company.departmentName}.`);
  items.push('Calibrated testing instruments / certified measuring equipment with active calibration tags.');

  return items;
}

function buildOperationalControlRows(topic: DepartmentTopic, company: CompanyInfoFormData): string[][] {
  const rows: string[][] = [
    ['Pre-Execution Readiness Check', 'Verify environmental readiness, tools calibration, and access permissions prior to start.'],
    ['Process Observation & Monitoring', 'Continuously monitor operating parameters; log milestones in enterprise system.'],
    ['Variance Detection & Containment', 'If any parameter deviates beyond tolerance, immediately halt and apply containment.'],
    ['Traceability & Audit Logging', 'Record batch/serial numbers, operator ID, timestamp, and verification sign-offs.'],
    ['End-of-Shift / Handover Verification', 'Verify workspace cleanliness, log equipment status, and execute formal shift handover.'],
  ];

  if (company.departmentDetails.inventoryMethod) {
    rows.unshift(['Inventory Rotation Rule', `Strict enforcement of ${company.departmentDetails.inventoryMethod}`]);
  }
  if (company.departmentDetails.samplingCriteria) {
    rows.unshift(['Sampling & Inspection Rule', `Inspect per ${company.departmentDetails.samplingCriteria}`]);
  }

  return rows;
}

function buildTopicFlowchart(topic: DepartmentTopic, formData: SOPFormData): FlowchartStep[] {
  return [
    {
      id: 'step-1',
      stepNumber: 1,
      label: 'Pre-Execution Verification',
      description: 'Confirm equipment calibration, access credentials, and prerequisite checklist.',
      role: formData.preparedBy || 'Primary Operator',
      shape: 'start',
    },
    {
      id: 'step-2',
      stepNumber: 2,
      label: 'Core Procedural Action',
      description: 'Execute standardized operational parameters per technical instructions.',
      role: 'Designated Specialist',
      shape: 'process',
    },
    {
      id: 'step-3',
      stepNumber: 3,
      label: 'Quality & Safety Verification Gate',
      description: 'Audit output against specified tolerances and safety inspection rules.',
      role: formData.reviewedBy || 'Quality Inspector',
      shape: 'decision',
    },
    {
      id: 'step-4',
      stepNumber: 4,
      label: 'Containment / Escalation Protocol',
      description: 'If deviation occurs, immediately halt, quarantine units, and alert supervisor.',
      role: 'Shift Supervisor',
      shape: 'process',
    },
    {
      id: 'step-5',
      stepNumber: 5,
      label: 'Archival & Release Authorization',
      description: 'Complete documentation logs, stamp approval, and release deliverables.',
      role: formData.approvedBy || 'Department Authorizer',
      shape: 'end',
    },
  ];
}

function buildTopicMetrics(topic: DepartmentTopic, deptId: SOPCategory): { title: string; benchmarks: MetricBenchmark[] } {
  return {
    title: `${topic.topicName || 'Operational'} Quality & Compliance Benchmarks`,
    benchmarks: [
      { label: 'Procedure Adherence Compliance', current: 100, target: 100, unit: '%', status: 'optimal' },
      { label: 'First-Pass Yield / Quality Release', current: 99.4, target: 99.0, unit: '%', status: 'optimal' },
      { label: 'Non-Conformance / Discrepancy Rate', current: 0.05, target: 0.10, unit: '%', status: 'optimal' },
      { label: 'Audit Trail & Record Completion SLA', current: 100, target: 100, unit: '%', status: 'optimal' },
    ],
  };
}
