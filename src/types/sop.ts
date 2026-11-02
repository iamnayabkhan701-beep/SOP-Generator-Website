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

    // Custom
    customCategoryName?: string;
    customWorkflowDescription?: string;
  };
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
    id: 'workplace-safety' as SOPCategory,
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
    id: 'custom',
    name: 'Custom Structure',
    description: 'Flexible modular format tailored to specific instructions and unique departmental requests.',
    badge: 'Flexible'
  }
];

