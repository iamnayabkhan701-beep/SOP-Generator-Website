export type SOPCategory =
  | 'hr'
  | 'finance'
  | 'administration'
  | 'it'
  | 'healthcare'
  | 'manufacturing'
  | 'qa'
  | 'qc'
  | 'procurement'
  | 'supply-chain'
  | 'warehouse'
  | 'customer-service'
  | 'marketing'
  | 'sales'
  | 'operations'
  | 'education'
  | 'construction'
  | 'food-safety'
  | 'laboratory'
  | 'maintenance'
  | 'security'
  | 'rd'
  | 'inventory'
  | 'ehs'
  // Legacy / aliases
  | 'office'
  | 'safety'
  | 'quality'
  | 'food-service'
  | 'cybersecurity'
  | 'environmental'
  | 'legal'
  | 'remote-work'
  | 'logistics'
  | 'retail'
  | 'custom';

export type SOPTheme =
  | 'professional-blue'
  | 'corporate-black'
  | 'modern-green'
  | 'minimal-white'
  | 'creative-purple';

export type SOPStructure =
  | 'standard'
  | 'detailed'
  | 'checklist'
  | 'table'
  | 'step-by-step'
  | 'raci-matrix'
  | 'iso-9001'
  | 'lean-six-sigma'
  | 'quick-reference'
  | 'visual-workflow'
  | 'custom';

export type TargetPageLength = 'short' | 'standard' | 'detailed' | 'custom';

export type SOPStatus = 'draft' | 'generating' | 'ready' | 'failed' | 'archived';

export interface SOPSection {
  id: string;
  title: string;
  content: string;
  type: 'text' | 'steps' | 'table' | 'checklist' | 'warning';
  items?: string[];
  tableData?: {
    headers: string[];
    rows: string[][];
  };
}

export interface SOPFormData {
  // Common Fields
  companyName: string;
  department: string;
  selectedTopic?: string;
  title: string;
  sopId?: string;
  purpose: string;
  scope: string;
  responsibilities: string;
  procedureDetails: string;
  requiredResources?: string;
  requiredTools?: string;
  safetyRisk?: string;
  qualityChecks?: string;
  documentationRecords?: string;
  references?: string;
  relatedDocuments?: string;
  preparedBy: string;
  reviewedBy: string;
  approvedBy: string;
  effectiveDate: string;
  version: string;

  // Page Target & Instructions
  targetPageLength: TargetPageLength;
  customPageCount?: number;
  additionalInstructions?: string;

  // Category-Specific Fields
  categorySpecific?: {
    // HR
    employeeRole?: string;
    onboardingStage?: string;
    recordsRequired?: string;

    // IT
    systemName?: string;
    prerequisites?: string;
    accessRequirements?: string;
    backupRollbackPlan?: string;
    troubleshootingSteps?: string;

    // Office
    facilityArea?: string;
    openingClosingTasks?: string;

    // Safety
    hazardIdentification?: string;
    ppeRequirements?: string;
    emergencyProcedures?: string;

    // Manufacturing
    equipmentSpecs?: string;
    rawMaterials?: string;
    processParameters?: string;
    qualityCheckpoints?: string;

    // Quality Control
    samplingCriteria?: string;
    acceptanceTolerance?: string;
    nonconformanceProtocol?: string;

    // Healthcare Admin
    administrativeWorkflow?: string;
    confidentialityProtocol?: string;
    escalationContact?: string;

    // Finance
    complianceStandard?: string;
    auditTrailRequirements?: string;
    approvalThresholds?: string;

    // Warehouse
    storageZones?: string;
    inventorySystem?: string;
    pickPackShip?: string;
    receivingDock?: string;

    // Supply Chain / Procurement
    supplierQualification?: string;
    purchaseOrderProcess?: string;
    leadTimeRequirements?: string;

    // Logistics
    shippingCarriers?: string;
    deliveryZones?: string;
    trackingSystem?: string;

    // Construction
    siteHazards?: string;
    permitRequirements?: string;
    equipmentInspection?: string;

    // Retail
    storeOpenClose?: string;
    cashHandling?: string;
    inventoryCount?: string;

    // Food Service
    foodSafetyStandards?: string;
    allergenManagement?: string;
    cleaningSanitizing?: string;

    // Cybersecurity
    incidentClassification?: string;
    containmentProcedures?: string;
    forensicsProtocol?: string;

    // Environmental
    wasteManagement?: string;
    emissionsMonitoring?: string;
    complianceReporting?: string;

    // Sales
    leadQualification?: string;
    crmSystem?: string;
    closingProcess?: string;

    // Marketing
    campaignBrief?: string;
    contentApproval?: string;
    analyticsTracking?: string;

    // Legal
    documentRetention?: string;
    contractReview?: string;
    complianceAudit?: string;

    // Remote Work
    communicationProtocols?: string;
    securityRequirements?: string;
    performanceTracking?: string;

    // Custom
    customCategoryName?: string;
    customWorkflowDescription?: string;
  };
}

export interface FlowchartStep {
  id: string;
  stepNumber: number;
  label: string;
  description: string;
  role: string;
  shape: 'start' | 'process' | 'decision' | 'end';
}

export interface MetricBenchmark {
  label: string;
  current: number;
  target: number;
  unit: string;
  status: 'optimal' | 'warning' | 'critical';
}

export interface SOPGeneratedContent {
  documentTitle: string;
  organization: string;
  metadata: {
    sopId: string;
    version: string;
    effectiveDate: string;
    department: string;
    preparedBy: string;
    reviewedBy: string;
    approvedBy: string;
  };
  executiveSummary?: string;
  disclaimer?: string;
  flowchart?: FlowchartStep[];
  metricsChart?: {
    title: string;
    benchmarks: MetricBenchmark[];
  };
  images?: {
    url: string;
    caption: string;
    alt: string;
  }[];
  sections: SOPSection[];
}

export interface SOPDocument {
  id: string;
  user_id: string;
  title: string;
  category: SOPCategory;
  selected_topic?: string;
  theme: SOPTheme;
  structure: SOPStructure;
  target_page_count: number;
  status: SOPStatus;
  form_data: SOPFormData;
  generated_content?: SOPGeneratedContent | null;
  edited_content?: SOPGeneratedContent | null;
  actual_page_count?: number | null;
  pdf_storage_path?: string | null;
  version: number;
  created_at: string;
  updated_at: string;
  archived_at?: string | null;
}

export interface SOPRevision {
  id: string;
  document_id: string;
  user_id: string;
  content: SOPGeneratedContent;
  revision_note?: string;
  created_at: string;
}

export interface CategoryMetadata {
  id: SOPCategory;
  name: string;
  description: string;
  iconName: string;
  isRegulatedOrHighRisk?: boolean;
  disclaimer?: string;
}

export const CATEGORIES: CategoryMetadata[] = [
  {
    id: 'hr',
    name: 'Human Resources (HR)',
    description: 'Recruitment, onboarding, attendance, performance management, and employee grievance handling.',
    iconName: 'Users'
  },
  {
    id: 'finance',
    name: 'Finance & Accounting',
    description: 'Budget management, accounts payable, accounts receivable, bank reconciliation, and financial reporting.',
    iconName: 'Coins'
  },
  {
    id: 'administration',
    name: 'Administration',
    description: 'Access control, office supplies, mail handling, facility maintenance, and document archival.',
    iconName: 'Building2'
  },
  {
    id: 'it',
    name: 'Information Technology (IT)',
    description: 'User access management, data backups, cybersecurity incidents, IT troubleshooting, and system maintenance.',
    iconName: 'Server'
  },
  {
    id: 'healthcare',
    name: 'Healthcare',
    description: 'Patient registration, patient assessment, infection control, medication management, and emergency response.',
    iconName: 'Activity',
    isRegulatedOrHighRisk: true,
    disclaimer: 'Healthcare procedures require clinical oversight and compliance with health authority regulations.'
  },
  {
    id: 'manufacturing',
    name: 'Manufacturing',
    description: 'Raw material inspection, machine operation, production control, quality inspection, and equipment maintenance.',
    iconName: 'Cpu',
    isRegulatedOrHighRisk: true,
    disclaimer: 'Manufacturing procedures involve physical equipment risks and must be verified by plant engineering.'
  },
  {
    id: 'qa',
    name: 'Quality Assurance (QA)',
    description: 'QMS documentation control, internal audits, CAPA management, management review, and change control.',
    iconName: 'ShieldCheck',
    isRegulatedOrHighRisk: true,
    disclaimer: 'Quality assurance procedures must align with ISO 9001 and organizational quality manuals.'
  },
  {
    id: 'qc',
    name: 'Quality Control (QC)',
    description: 'In-process quality check, finished product release, equipment calibration, non-conformance, and lab tests.',
    iconName: 'CheckCircle2',
    isRegulatedOrHighRisk: true,
    disclaimer: 'QC procedures must adhere to certified laboratory tolerance and sampling specifications.'
  },
  {
    id: 'procurement',
    name: 'Procurement',
    description: 'Vendor prequalification, purchase requisitions, competitive bidding, supplier scorecards, and contracts.',
    iconName: 'ClipboardList'
  },
  {
    id: 'supply-chain',
    name: 'Supply Chain',
    description: 'Demand forecasting, supplier capacity, freight and customs clearance, stock transfers, and contingency plans.',
    iconName: 'GitBranch'
  },
  {
    id: 'warehouse',
    name: 'Warehouse',
    description: 'Goods receiving, inventory put-away, order picking and dispatch, cycle counts, and hazmat storage.',
    iconName: 'Warehouse',
    isRegulatedOrHighRisk: true,
    disclaimer: 'Warehouse procedures must comply with OSHA forklift and material handling safety standards.'
  },
  {
    id: 'customer-service',
    name: 'Customer Service',
    description: 'Ticket resolution, SLA tracking, customer complaints, returns and refunds, and CSAT metric reviews.',
    iconName: 'Headphones'
  },
  {
    id: 'marketing',
    name: 'Marketing',
    description: 'Brand asset guidelines, campaign planning, social media moderation, lead generation, and analytics.',
    iconName: 'Megaphone'
  },
  {
    id: 'sales',
    name: 'Sales',
    description: 'Lead qualification (BANT), client discovery, pipeline management, contract negotiation, and customer handover.',
    iconName: 'TrendingUp'
  },
  {
    id: 'operations',
    name: 'Operations',
    description: 'Shift handovers, standard work execution, workload balancing, operational KPIs, and continuity drills.',
    iconName: 'Layers'
  },
  {
    id: 'education',
    name: 'Education',
    description: 'Curriculum development, student admissions, examination administration, faculty review, and student advising.',
    iconName: 'GraduationCap'
  },
  {
    id: 'construction',
    name: 'Construction',
    description: 'Site safety briefings, working at heights, scaffolding inspection, hot work permits, and concrete curing.',
    iconName: 'HardHat',
    isRegulatedOrHighRisk: true,
    disclaimer: 'Construction SOPs must comply with OSHA 1926 standards and local building authority permits.'
  },
  {
    id: 'food-safety',
    name: 'Food Safety',
    description: 'HACCP critical control points, surface sanitation, allergen control, cold chain logs, and food recalls.',
    iconName: 'ChefHat',
    isRegulatedOrHighRisk: true,
    disclaimer: 'Food safety SOPs must comply with FDA Food Code, ISO 22000, and local health department standards.'
  },
  {
    id: 'laboratory',
    name: 'Laboratory',
    description: 'Reagent preparation, balance calibration, biological specimen handling, glassware autoclaving, and waste disposal.',
    iconName: 'FlaskConical',
    isRegulatedOrHighRisk: true,
    disclaimer: 'Laboratory procedures must adhere to GLP (Good Laboratory Practice) and biosafety protocols.'
  },
  {
    id: 'maintenance',
    name: 'Maintenance',
    description: 'Preventive maintenance work orders, emergency breakdown repair, lubrication routine, and spare parts management.',
    iconName: 'Wrench'
  },
  {
    id: 'security',
    name: 'Security',
    description: 'Perimeter access control, CCTV surveillance, security patrols, keycard deactivation, and breach response.',
    iconName: 'ShieldAlert',
    isRegulatedOrHighRisk: true,
    disclaimer: 'Security protocols must coordinate with local law enforcement and facility security directives.'
  },
  {
    id: 'rd',
    name: 'Research & Development (R&D)',
    description: 'Concept feasibility, prototype testing, patent disclosure, material stress testing, and pilot handover.',
    iconName: 'Microscope'
  },
  {
    id: 'inventory',
    name: 'Inventory Management',
    description: 'Perpetual cycle counting, FIFO/FEFO rotation, ABC classification, stock valuation, and shrinkage control.',
    iconName: 'Layers'
  },
  {
    id: 'logistics',
    name: 'Logistics & Transportation',
    description: 'Carrier route dispatch, freight auditing, international customs compliance, and cold chain telemetry.',
    iconName: 'Truck'
  },
  {
    id: 'ehs',
    name: 'Environmental Health & Safety (EHS)',
    description: 'OSHA compliance, Job Hazard Analysis (JHA), hazardous waste containment, and workplace safety audits.',
    iconName: 'ShieldAlert',
    isRegulatedOrHighRisk: true,
    disclaimer: 'EHS standard operating procedures must comply with OSHA 1910, EPA, and local environmental standards.'
  },
  // Legacy / backward-compatible aliases:
  {
    id: 'office',
    name: 'Office Administration (Legacy)',
    description: 'General office procedures.',
    iconName: 'Building2'
  },
  {
    id: 'safety',
    name: 'Workplace Safety & EHS (Legacy)',
    description: 'OSHA / EHS safety guidelines.',
    iconName: 'ShieldAlert',
    isRegulatedOrHighRisk: true
  },
  {
    id: 'quality',
    name: 'Quality Control QA/QC (Legacy)',
    description: 'Batch inspection and testing.',
    iconName: 'CheckCircle2',
    isRegulatedOrHighRisk: true
  },
  {
    id: 'food-service',
    name: 'Food Service (Legacy)',
    description: 'Restaurant and kitchen routines.',
    iconName: 'ChefHat',
    isRegulatedOrHighRisk: true
  },
  {
    id: 'cybersecurity',
    name: 'Cybersecurity (Legacy)',
    description: 'Incident triage and response.',
    iconName: 'ShieldCheck',
    isRegulatedOrHighRisk: true
  },
  {
    id: 'custom',
    name: 'Custom SOP',
    description: 'Design a bespoke procedure for any specialized organization workflow.',
    iconName: 'FileSpreadsheet'
  }
];

export const THEMES: { id: SOPTheme; name: string; primaryColor: string; description: string }[] = [
  {
    id: 'professional-blue',
    name: 'Professional Blue',
    primaryColor: '#026fc7',
    description: 'Trustworthy enterprise look suitable for corporate, IT, and administrative documents.'
  },
  {
    id: 'corporate-black',
    name: 'Corporate Slate',
    primaryColor: '#1e293b',
    description: 'Executive, formal monochrome styling with clean sharp borders and timeless contrast.'
  },
  {
    id: 'modern-green',
    name: 'Modern Emerald',
    primaryColor: '#059669',
    description: 'Vibrant, high-legibility theme ideal for safety, environmental, and operations.'
  },
  {
    id: 'minimal-white',
    name: 'Minimal Clean',
    primaryColor: '#374151',
    description: 'Ultra-clean layout prioritizing maximum white space, ink efficiency, and readability.'
  },
  {
    id: 'creative-purple',
    name: 'Creative Violet',
    primaryColor: '#7c3aed',
    description: 'Contemporary, dynamic style for digital agencies, modern startups, and product teams.'
  }
];

export const STRUCTURES: { id: SOPStructure; name: string; description: string; badge: string }[] = [
  {
    id: 'standard',
    name: 'Standard SOP',
    description: 'Classic format with Purpose, Scope, Responsibilities, Step-by-Step Procedure, and Approvals.',
    badge: 'Most Popular'
  },
  {
    id: 'detailed',
    name: 'Detailed / Enterprise SOP',
    description: 'Comprehensive breakdown including definitions, prerequisites, contingency workflows, and metrics.',
    badge: 'Exhaustive'
  },
  {
    id: 'checklist',
    name: 'Checklist-Based SOP',
    description: 'Action-oriented format with verification checkboxes for quick operational field execution.',
    badge: 'Quick Execution'
  },
  {
    id: 'table',
    name: 'Table-Based SOP',
    description: 'Matrix format featuring Stage, Responsible Role, Action, and Verification Criteria tables.',
    badge: 'Structured Matrix'
  },
  {
    id: 'step-by-step',
    name: 'Step-by-Step Procedure',
    description: 'Sequential, chronological numbered instructions with clear expected outcomes per milestone.',
    badge: 'Clear Flow'
  },
  {
    id: 'raci-matrix',
    name: 'RACI Responsibility Matrix',
    description: 'Role-based format mapping Responsible, Accountable, Consulted, and Informed parties for every task.',
    badge: 'Role Clarity'
  },
  {
    id: 'iso-9001',
    name: 'ISO 9001 Compliant Format',
    description: 'Structured to meet ISO 9001:2015 quality management system documentation requirements.',
    badge: 'ISO Standard'
  },
  {
    id: 'lean-six-sigma',
    name: 'Lean / Six Sigma DMAIC',
    description: 'Define-Measure-Analyze-Improve-Control framework for process optimization and waste reduction.',
    badge: 'Process Excellence'
  },
  {
    id: 'quick-reference',
    name: 'Quick Reference Card',
    description: 'Condensed 1-page summary with critical steps, key contacts, and emergency actions.',
    badge: 'At-a-Glance'
  },
  {
    id: 'visual-workflow',
    name: 'Visual Workflow SOP',
    description: 'Diagram-heavy format with flowcharts, swimlane diagrams, and decision trees as primary content.',
    badge: 'Visual First'
  },
  {
    id: 'custom',
    name: 'Custom Structure',
    description: 'Flexible modular format tailored to specific instructions and unique departmental requests.',
    badge: 'Flexible'
  }
];
