export type SOPCategory =
  | 'hr'
  | 'it'
  | 'office'
  | 'safety'
  | 'manufacturing'
  | 'quality'
  | 'healthcare'
  | 'finance'
  | 'customer-service'
  | 'operations'
  | 'warehouse'
  | 'supply-chain'
  | 'logistics'
  | 'construction'
  | 'retail'
  | 'food-service'
  | 'cybersecurity'
  | 'environmental'
  | 'sales'
  | 'marketing'
  | 'legal'
  | 'remote-work'
  | 'procurement'
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
  title: string;
  sopId?: string;
  purpose: string;
  scope: string;
  responsibilities: string;
  procedureDetails: string;
  requiredTools?: string;
  safetyRisk?: string;
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
    name: 'Human Resources',
    description: 'Onboarding, performance reviews, employee transitions, and internal personnel policies.',
    iconName: 'Users'
  },
  {
    id: 'it',
    name: 'Information Technology',
    description: 'System administration, access provisioning, deployments, incident response, and rollbacks.',
    iconName: 'Server'
  },
  {
    id: 'safety',
    name: 'Workplace Safety & EHS',
    description: 'Hazard identification, PPE standards, emergency responses, and OSHA/EHS best practices.',
    iconName: 'ShieldAlert',
    isRegulatedOrHighRisk: true,
    disclaimer: 'Workplace safety procedures must be verified by a certified safety officer or EHS professional prior to deployment.'
  },
  {
    id: 'manufacturing',
    name: 'Manufacturing & Operations',
    description: 'Assembly line instructions, machinery operation, material handling, and equipment calibration.',
    iconName: 'Cpu',
    isRegulatedOrHighRisk: true,
    disclaimer: 'Manufacturing procedures involve physical equipment risks and must be verified by plant engineering.'
  },
  {
    id: 'quality',
    name: 'Quality Control (QA/QC)',
    description: 'Batch testing, inspection checklists, tolerance verification, and non-conformance logging.',
    iconName: 'CheckCircle2',
    isRegulatedOrHighRisk: true,
    disclaimer: 'Quality control procedures must be aligned with your official ISO or organizational quality manual.'
  },
  {
    id: 'healthcare',
    name: 'Healthcare Administration',
    description: 'Patient check-in, HIPAA record handling, clinic scheduling, and administrative billing workflows.',
    iconName: 'Activity',
    isRegulatedOrHighRisk: true,
    disclaimer: 'Administrative only. This tool does NOT generate clinical, diagnostic, or medical protocols.'
  },
  {
    id: 'finance',
    name: 'Finance & Accounting',
    description: 'Invoicing, petty cash, purchase authorizations, month-end close, and internal audit trails.',
    iconName: 'Coins'
  },
  {
    id: 'customer-service',
    name: 'Customer Service & Support',
    description: 'Ticket resolution, customer escalation matrix, refund workflows, and SLA compliance.',
    iconName: 'Headphones'
  },
  {
    id: 'office',
    name: 'Office Administration',
    description: 'Daily opening/closing, mail management, visitor logging, and facilities upkeep.',
    iconName: 'Building2'
  },
  {
    id: 'operations',
    name: 'General Business Operations',
    description: 'Cross-functional operations, supplier management, logistics, and standard daily routines.',
    iconName: 'Layers'
  },
  {
    id: 'warehouse',
    name: 'Warehouse Management',
    description: 'Receiving, storage zones, inventory control, pick-pack-ship, and cycle counting procedures.',
    iconName: 'Warehouse',
    isRegulatedOrHighRisk: true,
    disclaimer: 'Warehouse safety procedures (forklift, racking, hazardous materials) must be verified by a qualified safety officer.'
  },
  {
    id: 'supply-chain',
    name: 'Supply Chain Management',
    description: 'Supplier qualification, purchase orders, demand planning, and procurement workflows.',
    iconName: 'GitBranch'
  },
  {
    id: 'logistics',
    name: 'Logistics & Distribution',
    description: 'Outbound shipments, carrier selection, delivery scheduling, and last-mile tracking.',
    iconName: 'Truck'
  },
  {
    id: 'construction',
    name: 'Construction & Site Safety',
    description: 'Site permits, equipment inspection, scaffolding standards, and fall protection procedures.',
    iconName: 'HardHat',
    isRegulatedOrHighRisk: true,
    disclaimer: 'Construction safety SOPs must comply with OSHA 29 CFR 1926 and be verified by a certified site safety officer.'
  },
  {
    id: 'retail',
    name: 'Retail Operations',
    description: 'Store opening/closing, cash handling, inventory counting, and loss prevention procedures.',
    iconName: 'ShoppingBag'
  },
  {
    id: 'food-service',
    name: 'Food Service & Restaurant',
    description: 'Food safety standards, allergen management, HACCP plans, and kitchen cleaning protocols.',
    iconName: 'ChefHat',
    isRegulatedOrHighRisk: true,
    disclaimer: 'Food safety SOPs must comply with FDA Food Code and local health department regulations.'
  },
  {
    id: 'cybersecurity',
    name: 'Cybersecurity & Incident Response',
    description: 'Incident triage, containment, forensics, breach notification, and security hardening.',
    iconName: 'ShieldCheck',
    isRegulatedOrHighRisk: true,
    disclaimer: 'Cybersecurity incident response plans should be reviewed by a certified CISO or security professional.'
  },
  {
    id: 'environmental',
    name: 'Environmental Compliance',
    description: 'Waste management, emissions monitoring, sustainability reporting, and EPA compliance.',
    iconName: 'Leaf',
    isRegulatedOrHighRisk: true,
    disclaimer: 'Environmental compliance SOPs must be verified against applicable EPA, ISO 14001, and local regulations.'
  },
  {
    id: 'sales',
    name: 'Sales Process & CRM',
    description: 'Lead qualification, pipeline management, proposal creation, and deal closing workflows.',
    iconName: 'TrendingUp'
  },
  {
    id: 'marketing',
    name: 'Marketing Operations',
    description: 'Campaign planning, content approval, social media management, and analytics reporting.',
    iconName: 'Megaphone'
  },
  {
    id: 'legal',
    name: 'Legal & Compliance',
    description: 'Contract review, document retention, regulatory filings, and compliance audit procedures.',
    iconName: 'Scale',
    isRegulatedOrHighRisk: true,
    disclaimer: 'Legal compliance SOPs must be reviewed by qualified legal counsel before implementation.'
  },
  {
    id: 'remote-work',
    name: 'Remote Work Policy',
    description: 'Communication protocols, home office security, performance tracking, and collaboration tools.',
    iconName: 'Laptop'
  },
  {
    id: 'procurement',
    name: 'Procurement & Purchasing',
    description: 'Vendor selection, RFP process, purchase approval workflows, and contract management.',
    iconName: 'ClipboardList'
  },
  {
    id: 'custom',
    name: 'Custom SOP',
    description: 'Design a bespoke standard procedure for any specialized organization workflow.',
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
