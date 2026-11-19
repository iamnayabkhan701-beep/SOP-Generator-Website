import React from 'react';
import { Link } from 'react-router-dom';
import {
  Building2,
  Globe2,
  Briefcase,
  Layers,
  FileCheck2,
  Users,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  ChevronRight,
  Info,
} from 'lucide-react';
import type { SOPCategory, CompanyInfoFormData } from '../types/sop';
import type { DepartmentTopic } from '../data/departmentTemplates';

interface CompanyDepartmentFormProps {
  departmentId: SOPCategory;
  departmentName: string;
  totalSOPCount: number;
  formData: CompanyInfoFormData;
  onChange: (updates: Partial<CompanyInfoFormData>) => void;
  onDepartmentDetailChange: (key: string, value: string) => void;
  onSubmit: () => void;
  onBack: () => void;
  selectedTemplate?: DepartmentTopic | null;
  onGenerateSingleSOP?: () => void;
}

interface QuestionField {
  id: string;
  label: string;
  placeholder: string;
  helpText: string;
  suggestions?: string[];
}

const DEPARTMENT_QUESTIONS: Record<string, QuestionField[]> = {
  warehouse: [
    {
      id: 'materialTypes',
      label: 'Material & Inventory Types Handled',
      placeholder: 'e.g. Ambient dry goods, temperature-sensitive pharmaceuticals (2-8°C), palletized raw materials, hazardous chemicals',
      helpText: 'Helps customize storage, handling precautions, and dock staging protocols.',
      suggestions: ['Finished Goods & Spares', 'Pharmaceuticals & Biologics (2-8°C)', 'Industrial Raw Materials & Chemicals', 'Retail Consumer Goods & Electronics'],
    },
    {
      id: 'storageConditions',
      label: 'Storage Zones & Environmental Conditions',
      placeholder: 'e.g. High-bay selective pallet racking, cold storage freezer (-20°C), hazmat bunker with spill containment',
      helpText: 'Configures put-away, slotting, and safety equipment specifications.',
      suggestions: ['High-Bay Selective Racking', 'Cold Storage & Frozen Zones', 'Hazardous Materials Containment Bunker', 'Mezzanine Bin Shelving'],
    },
    {
      id: 'wmsSystem',
      label: 'Warehouse Management Software (WMS / ERP)',
      placeholder: 'e.g. SAP EWM, Manhattan Associates, Oracle NetSuite, Odoo, Custom WMS',
      helpText: 'Incorporates your exact software barcode scanning and inventory transaction workflows.',
      suggestions: ['SAP S/4HANA EWM', 'Manhattan Associates WMS', 'Oracle NetSuite WMS', 'Odoo Inventory'],
    },
    {
      id: 'inventoryMethod',
      label: 'Inventory Rotation & Tracking Methodology',
      placeholder: 'e.g. First-In First-Out (FIFO), First-Expired First-Out (FEFO), Serial Number Tracking, Batch/Lot Control',
      helpText: 'Ensures procedural picking, replenishment, and cycle counting match your tracking rules.',
      suggestions: ['FIFO (First-In, First-Out)', 'FEFO (First-Expired, First-Out)', 'Serial Number & Lot Tracking', 'Perpetual ABC Cycle Counting'],
    },
    {
      id: 'responsibleRoles',
      label: 'Key Warehouse Positions & Responsibilities',
      placeholder: 'e.g. Inbound Receiving Lead, Forklift Operator, Inventory Auditor, Shipping Supervisor, Warehouse Manager',
      helpText: 'Maps operational steps and approval sign-offs directly to your staff titles.',
      suggestions: ['Receiving Clerk, Forklift Driver, Warehouse Supervisor', 'Material Handler, Quality Inspector, Dispatcher'],
    },
  ],

  qa: [
    {
      id: 'qmsStandard',
      label: 'Quality Management Standards & Certifications',
      placeholder: 'e.g. ISO 9001:2015, ISO 13485 (Medical Devices), AS9100D (Aerospace), cGMP (Pharma)',
      helpText: 'Guides compliance clauses, documentation control, and external audit alignment.',
      suggestions: ['ISO 9001:2015 Quality Management', 'ISO 13485 Medical Devices', 'cGMP / FDA 21 CFR Part 820', 'AS9100D Aerospace Standard'],
    },
    {
      id: 'auditSchedule',
      label: 'Internal Audit Program & Frequency',
      placeholder: 'e.g. Monthly departmental audits, quarterly surveillance audits, annual pre-certification review',
      helpText: 'Defines your internal audit schedule, sampling checklists, and management review frequency.',
      suggestions: ['Quarterly Internal Audits + Annual Review', 'Monthly Departmental Surveillance Audits', 'Continuous Risk-Based Process Audits'],
    },
    {
      id: 'capaProcess',
      label: 'CAPA & Root Cause Analysis Methodology',
      placeholder: 'e.g. 5-Why Analysis, Ishikawa Fishbone, 8D Problem Solving with 30-day closure SLA',
      helpText: 'Structures corrective and preventive action procedures and containment milestones.',
      suggestions: ['8D Problem Solving Framework', '5-Why & Ishikawa Fishbone Analysis', 'Six Sigma DMAIC Containment'],
    },
    {
      id: 'changeControl',
      label: 'Change Control Governance & Approvals',
      placeholder: 'e.g. Engineering Change Order (ECO) approved by Quality Director, Regulatory Affairs, and Plant Head',
      helpText: 'Specifies change authorization thresholds and procedural revision control.',
      suggestions: ['Quality Review Board (QRB) Sign-off', 'Cross-Functional Engineering Change Committee', 'Design Authority & Plant Quality Head'],
    },
    {
      id: 'responsibleRoles',
      label: 'Quality Department Roles',
      placeholder: 'e.g. QA Manager, Lead Internal Auditor, Document Control Specialist, Compliance Officer',
      helpText: 'Assigns procedure authoring, verification, and audit review duties.',
      suggestions: ['QA Director, Lead Auditor, Document Controller', 'Quality Assurance Specialist, Regulatory Affairs Manager'],
    },
  ],

  qc: [
    {
      id: 'samplingCriteria',
      label: 'Inspection Sampling Criteria & Methodology',
      placeholder: 'e.g. ANSI/ASQ Z1.4 / MIL-STD-105E AQL 1.0 Major / 2.5 Minor, 100% Critical Inspection',
      helpText: 'Determines sample lot sizing, acceptance limits, and rejection thresholds.',
      suggestions: ['MIL-STD-105E / ANSI Z1.4 AQL 1.0', '100% End-of-Line Functional Testing', 'Statistical Process Control (SPC) X-bar & R'],
    },
    {
      id: 'testingEquipment',
      label: 'Testing & Measurement Equipment Used',
      placeholder: 'e.g. Coordinate Measuring Machine (CMM), Optical Comparator, Digital Calipers, Durometers, Spectrophotometers',
      helpText: 'Incorporates pre-operation zeroing, calibration status checks, and equipment verification.',
      suggestions: ['CMM & Optical Comparators', 'Digital Calipers & Micrometers (Calibrated)', 'Spectrophotometers & Colorimeters', 'Hardness & Tensile Strength Testers'],
    },
    {
      id: 'inProcessGates',
      label: 'In-Process Inspection Points & Quality Gates',
      placeholder: 'e.g. First-Article Inspection (FAI), hourly line pull verification, pre-packaging cosmetic audit',
      helpText: 'Establishes clear checkpoint intervals during processing.',
      suggestions: ['First-Article Inspection (FAI) + Hourly Sampling', 'Continuous Automatic Vision Inspection', 'Pre-Packaging Release Quality Gate'],
    },
    {
      id: 'nonconformanceProtocol',
      label: 'Non-Conformance Isolation & Quarantine Protocol',
      placeholder: 'e.g. Physical red quarantine hold cage, digital ERP lot lock, Material Review Board (MRB) disposition within 48h',
      helpText: 'Customizes containment, tagging, and deviation escalation procedures.',
      suggestions: ['Immediate Red Tagging & ERP Hold Lock', 'Quarantine Cage + MRB Disposition within 24h', 'Supplier Return & Scrap Authorization'],
    },
    {
      id: 'responsibleRoles',
      label: 'QC Team Positions',
      placeholder: 'e.g. Receiving QC Inspector, Line QC Specialist, Calibration Technician, QC Supervisor',
      helpText: 'Specifies hands-on inspection roles and calibration sign-off titles.',
      suggestions: ['QC Inspector, Calibration Technician, QC Manager', 'Laboratory Analyst, Line QC Lead'],
    },
  ],

  'supply-chain': [
    {
      id: 'supplierTiers',
      label: 'Supplier Base & Sourcing Structure',
      placeholder: 'e.g. Tier-1 direct raw material manufacturers, international freight suppliers, local distributor network',
      helpText: 'Customizes vendor evaluation, purchase requisition, and supplier onboarding.',
      suggestions: ['Tier-1 Direct Manufacturers & Global Suppliers', 'Domestic Certified Distributor Network', 'Single-Source & Dual-Source Strategic Partners'],
    },
    {
      id: 'logisticsModes',
      label: 'Primary Transportation & Freight Modes',
      placeholder: 'e.g. Ocean FCL/LCL container shipping, Full Truckload (FTL) motor freight, expedited air freight',
      helpText: 'Tailors carrier booking, bill of lading checks, and transit tracking procedures.',
      suggestions: ['Ocean Container (FCL/LCL) + Intermodal Rail', 'FTL & LTL Dedicated Highway Freight', 'Global Express Air Cargo & Customs'],
    },
    {
      id: 'planningCadence',
      label: 'Demand Planning & Sales & Operations (S&OP) Cadence',
      placeholder: 'e.g. Monthly S&OP consensus planning cycle, weekly demand forecast reconciliation, 90-day lead-time planning',
      helpText: 'Guides inventory safety stock formulas and reorder point calculations.',
      suggestions: ['Monthly S&OP Consensus Cycle', 'Weekly Rolling Demand Forecast Rebalance', 'Quarterly Capacity & Material Review'],
    },
    {
      id: 'customsTrade',
      label: 'Trade Compliance & Customs Clearance Standards',
      placeholder: 'e.g. Incoterms 2020 (DDP, CIF, FOB), automated customs broker pre-clearance, HS tariff classification',
      helpText: 'Ensures import/export documentation and cross-border regulatory compliance.',
      suggestions: ['Incoterms 2020 (DDP / FOB / CIF)', 'Automated Broker EDI & Customs Clearance', 'Free Trade Agreement (FTA) Certification'],
    },
    {
      id: 'responsibleRoles',
      label: 'Supply Chain Team Positions',
      placeholder: 'e.g. Supply Chain Director, Demand Planner, Logistics Coordinator, Sourcing Manager',
      helpText: 'Maps operational responsibilities and supplier relationship governance.',
      suggestions: ['Supply Chain Manager, Sourcing Lead, Logistics Coordinator', 'Demand Planning Specialist, Freight Auditor'],
    },
  ],

  hr: [
    {
      id: 'workforceClassification',
      label: 'Workforce Profile & Employment Classifications',
      placeholder: 'e.g. Full-time salaried executive, hourly plant shifts (3 rotations), contractual technical specialists, remote workers',
      helpText: 'Customizes employment policies, attendance tracking, and benefits administration.',
      suggestions: ['Full-Time Salaried & Hourly Shift Workforce', 'Hybrid Office & Remote Distributed Team', 'Direct Employees + Contract Staff'],
    },
    {
      id: 'recruitmentWorkflow',
      label: 'Hiring & Candidate Vetting Protocol',
      placeholder: 'e.g. ATS candidate scoring, 2-stage panel competency interview, educational & criminal background verification',
      helpText: 'Structures recruitment requisition, interviewing rubrics, and offer letter generation.',
      suggestions: ['Structured Behavioral Panel + Degree/Criminal Vetting', 'Fast-Track Technical Assessment + Reference Checks', 'Executive Search & Compliance Screening'],
    },
    {
      id: 'onboardingMilestones',
      label: 'New Hire Onboarding Program & Milestones',
      placeholder: 'e.g. Day-1 IT & compliance orientation, 30-day manager alignment, 60-day goal review, 90-day probation confirmation',
      helpText: 'Customizes onboarding checklists, buddy assignments, and probationary appraisals.',
      suggestions: ['Day-1 Orientation + 30/60/90-Day Milestones', 'Automated Digital Pre-boarding & Mentorship Program', 'Comprehensive 90-Day Probation Assessment'],
    },
    {
      id: 'attendanceLeaveSystem',
      label: 'Time, Attendance & Leave Management System',
      placeholder: 'e.g. Biometric RFID punch clocks, Workday / BambooHR portal, statutory PTO & medical leave policy',
      helpText: 'Defines clock-in protocols, overtime pre-approval thresholds, and absence reconciliations.',
      suggestions: ['Workday / BambooHR Cloud Attendance', 'Biometric Hardware Timeclocks + Mobile Geofencing', 'Standard Statutory PTO & Sick Leave Portal'],
    },
    {
      id: 'responsibleRoles',
      label: 'Human Resources Team Positions',
      placeholder: 'e.g. HR Director, Talent Acquisition Lead, People Operations Specialist, Payroll Administrator',
      helpText: 'Maps HR governance, grievance escalation, and personnel file management.',
      suggestions: ['HR Director, Talent Acquisition Specialist, People Ops Lead', 'HR Business Partner (HRBP), Payroll Manager'],
    },
  ],

  finance: [
    {
      id: 'accountingFramework',
      label: 'Accounting Standard & Statutory Framework',
      placeholder: 'e.g. IFRS (International Financial Reporting Standards), US GAAP, Local Statutory Corporate Tax Rules',
      helpText: 'Ensures journal entries, depreciation, and financial disclosures comply with the governing standard.',
      suggestions: ['IFRS (International Financial Reporting Standards)', 'US GAAP', 'Statutory National Tax & Corporate Authority Rules'],
    },
    {
      id: 'approvalThresholds',
      label: 'Financial Delegation of Authority (Approval Limits)',
      placeholder: 'e.g. Tier 1: Dept Manager <$5,000; Tier 2: Finance Director <$25,000; Tier 3: CFO/CEO >$25,000',
      helpText: 'Embeds strict internal controls into accounts payable and procurement authorization.',
      suggestions: ['Manager <$5k | Director <$25k | CFO >$25k', 'Tier 1 <$10k | Tier 2 <$50k | Board Approval >$50k', 'Strict Dual-Signatory Mandate for All Outflows'],
    },
    {
      id: 'threeWayMatch',
      label: 'Accounts Payable 3-Way Matching Rules',
      placeholder: 'e.g. Automated ERP 3-way match (PO + Receiving GRN + Vendor Invoice) with ±0.5% price tolerance',
      helpText: 'Customizes invoice processing, discrepancy hold, and vendor disbursement.',
      suggestions: ['Strict 3-Way Match (PO + GRN + Invoice) ±0.5%', 'Automated ERP Matching with Tolerance Exception Queue', '2-Way Match for Services / 3-Way for Goods'],
    },
    {
      id: 'treasuryCadence',
      label: 'Bank Reconciliation & Month-End Close Cadence',
      placeholder: 'e.g. Daily automated bank statement feed, weekly variance reconciliation, 5-day month-end financial close',
      helpText: 'Establishes reconciliation deadlines, petty cash audits, and financial reporting timetables.',
      suggestions: ['Daily Automated Feeds + 5-Day Month-End Close', 'Weekly Treasury Reconciliation + Monthly Audit', 'Bi-Weekly Banking Reconciliation'],
    },
    {
      id: 'responsibleRoles',
      label: 'Finance & Accounting Positions',
      placeholder: 'e.g. Chief Financial Officer, Senior Controller, Accounts Payable Supervisor, Treasury Accountant',
      helpText: 'Assigns voucher authorization, wire release, and audit sign-off titles.',
      suggestions: ['CFO, Financial Controller, Accounts Payable Lead', 'Senior Accountant, Treasury Manager, Internal Auditor'],
    },
  ],

  it: [
    {
      id: 'infrastructureModel',
      label: 'Infrastructure Architecture & Cloud Environment',
      placeholder: 'e.g. Multi-cloud (AWS & Azure), Hybrid cloud with on-premises VMware cluster, SaaS-first enterprise',
      helpText: 'Tailors system maintenance, server provisioning, and patch management procedures.',
      suggestions: ['AWS Cloud + Hybrid On-Premises VMware', 'Microsoft Azure Enterprise Cloud Architecture', 'Multi-Cloud AWS & Google Cloud Infrastructure', 'On-Premises Dedicated Datacenter'],
    },
    {
      id: 'iamAccessControl',
      label: 'Identity & Access Management (IAM) Protocol',
      placeholder: 'e.g. Okta / Azure Active Directory, Role-Based Access Control (RBAC), mandatory FIDO2 hardware MFA tokens',
      helpText: 'Structures onboarding access provisioning, least privilege audits, and immediate termination de-provisioning.',
      suggestions: ['Okta / Azure AD with Mandatory MFA & RBAC', 'Least Privilege Access Model with Quarterly Audit', 'Privileged Access Management (PAM) CyberArk'],
    },
    {
      id: 'backupDisasterRecovery',
      label: 'Backup Frequency & Disaster Recovery Targets (RPO/RTO)',
      placeholder: 'e.g. Daily automated immutable backups, 1-hour Recovery Point Objective (RPO), 4-hour Recovery Time Objective (RTO)',
      helpText: 'Builds disaster recovery drills, failover verification, and air-gapped backup validation.',
      suggestions: ['Daily Immutable Backups: 1h RPO / 4h RTO', 'Hourly Snapshots + Cross-Region Replication: 15m RPO', 'Daily Air-Gapped Cloud Backups: 24h RTO'],
    },
    {
      id: 'incidentClassification',
      label: 'Cybersecurity & IT Incident Severity Tiers',
      placeholder: 'e.g. SEV-1 (Critical outage, 15m response), SEV-2 (Major degradation, 1h response), SEV-3 (Minor issue, 4h response)',
      helpText: 'Defines emergency bridges, escalation trees, and root cause post-mortem procedures.',
      suggestions: ['SEV-1 (15m Response) / SEV-2 (1h) / SEV-3 (4h)', 'NIST SP 800-61 Incident Handling Framework', '24/7 Managed SOC Escalation Protocols'],
    },
    {
      id: 'responsibleRoles',
      label: 'IT Department Positions',
      placeholder: 'e.g. Chief Information Officer (CIO), Lead Systems Administrator, DevOps / SRE Engineer, Helpdesk Supervisor',
      helpText: 'Maps operational change approvals, incident ownership, and technical escalation contacts.',
      suggestions: ['CIO, Infrastructure Lead, Senior DevOps Engineer', 'IT Operations Manager, Systems Administrator, Cyber Analyst'],
    },
  ],

  healthcare: [
    {
      id: 'facilityType',
      label: 'Healthcare Facility Scope & Services',
      placeholder: 'e.g. Acute care general hospital, outpatient surgical center, diagnostic laboratory, specialized clinic',
      helpText: 'Adapts clinical triage, surgical sterilization, and patient flow protocols.',
      suggestions: ['Tertiary Care General Hospital', 'Outpatient Ambulatory Surgical Center', 'Specialty Diagnostic & Imaging Clinic', 'Primary Healthcare Medical Center'],
    },
    {
      id: 'patientIdentification',
      label: 'Patient Identification & Medical Records Protocol',
      placeholder: 'e.g. Two mandatory identifiers (Full Name & DOB) verified prior to any medication or procedure; Epic / Cerner EHR',
      helpText: 'Builds zero-error patient intake, barcoded wristband administration, and EHR charting.',
      suggestions: ['Two Identifiers (Name & DOB) + Barcode Wristbands', 'Epic / Cerner Electronic Health Records EHR', 'Positive Patient Identification (PPID) at Bedside'],
    },
    {
      id: 'infectionControl',
      label: 'Infection Prevention & Sanitation Standards',
      placeholder: 'e.g. WHO 5 Moments for Hand Hygiene, daily terminal cleaning of operating suites, autoclaving surgical instruments',
      helpText: 'Customizes biohazard sterilization, PPE levels, and isolation protocols.',
      suggestions: ['WHO Hand Hygiene + Operating Room Terminal Cleaning', 'CDC Guidelines for Healthcare Environmental Infection', 'Sterile Processing Department (SPD) Steam Autoclave'],
    },
    {
      id: 'emergencyTriage',
      label: 'Clinical Emergency Response (Code Protocols)',
      placeholder: 'e.g. Code Blue (Cardiac/Respiratory Arrest), Code Red (Fire), Emergency Severity Index (ESI) 1-5 triage',
      helpText: 'Formalizes life-safety response, crash cart verification, and clinical escalation.',
      suggestions: ['Emergency Severity Index (ESI) 1-5 Triage Scale', 'Hospital Code Blue / Code Red Standardized Protocols', 'Rapid Response Team (RRT) Bedside Activation'],
    },
    {
      id: 'responsibleRoles',
      label: 'Healthcare Administration & Clinical Roles',
      placeholder: 'e.g. Chief Medical Officer, Director of Nursing, Infection Preventionist, Triage Nurse, Patient Safety Officer',
      helpText: 'Designates clinical oversight, medicine administration verification, and patient consent roles.',
      suggestions: ['Chief Medical Officer, Nursing Supervisor, Triage Lead', 'Infection Control Officer, Clinical Nurse Lead, Safety Officer'],
    },
  ],

  manufacturing: [
    {
      id: 'productionMethodology',
      label: 'Manufacturing & Assembly Methodology',
      placeholder: 'e.g. High-speed continuous assembly line, discrete automated CNC machining, cellular batch manufacturing',
      helpText: 'Customizes line setup, job traveler cards, and throughput balancing.',
      suggestions: ['Continuous High-Volume Assembly Line', 'Precision CNC Machining & Fabrication', 'Lean Cellular Batch Manufacturing', 'Cleanroom Electronics Assembly'],
    },
    {
      id: 'keyMachinery',
      label: 'Primary Production Equipment & Systems',
      placeholder: 'e.g. 5-Axis CNC milling centers, robotic pick-and-place cells, automated plastic injection molding presses',
      helpText: 'Incorporates pre-shift machine checks, tooling calibrations, and operating parameters.',
      suggestions: ['CNC Milling & Lathe Centers', 'Robotic Assembly & Spot Welding Cells', 'Hydraulic Presses & Injection Molding Machines', 'Surface Mount Technology (SMT) Lines'],
    },
    {
      id: 'spcTolerances',
      label: 'Process Tolerances & Statistical Process Control (SPC)',
      placeholder: 'e.g. Blueprint dimensional tolerance ±0.05mm, Cpk capability index > 1.33, hourly control charting',
      helpText: 'Structures in-process dimensional audits and defect reduction protocols.',
      suggestions: ['Cpk > 1.33 with Blueprint Tolerance ±0.05mm', 'Automated In-Line Vision Gauging & SPC Logging', 'Zero-Defect Critical-to-Quality (CTQ) Parameters'],
    },
    {
      id: 'maintenanceModel',
      label: 'Equipment Maintenance Strategy (TPM / PM)',
      placeholder: 'e.g. Total Productive Maintenance (TPM) Autonomous Operator Cleaning, CMMS scheduled PM work orders, LOTO compliance',
      helpText: 'Embeds machine lubrication, vibration checks, and Lockout/Tagout safety rules.',
      suggestions: ['TPM Autonomous Maintenance + Weekly CMMS PMs', 'Strict Lockout/Tagout (LOTO) OSHA 1910.147 Compliance', 'Predictive Thermal & Vibration CMMS Scheduling'],
    },
    {
      id: 'responsibleRoles',
      label: 'Manufacturing & Plant Positions',
      placeholder: 'e.g. Plant Operations Manager, Production Shift Supervisor, Machinist Lead, Industrial Safety Officer',
      helpText: 'Assigns shift handover, recipe sign-offs, and machine downtime logging.',
      suggestions: ['Plant Director, Production Supervisor, Lead Machinist', 'Assembly Technician, Maintenance Lead, Safety Coordinator'],
    },
  ],
};

// Generic fallback questions for any department not explicitly listed above
const DEFAULT_DEPARTMENT_QUESTIONS: QuestionField[] = [
  {
    id: 'coreActivities',
    label: 'Primary Operational Activities & Workflows',
    placeholder: 'e.g. Client onboarding, continuous quality auditing, daily execution checklists, asset maintenance',
    helpText: 'Detail the primary daily and weekly operational routines performed by this department.',
    suggestions: ['Daily Standard Execution & Milestone Sign-offs', 'Periodic Compliance Auditing & Verification', 'End-to-End Client Service & Project Delivery'],
  },
  {
    id: 'toolsAndSystems',
    label: 'Primary Software, Tools & Machinery Used',
    placeholder: 'e.g. Cloud ERP, specialized hardware, diagnostic toolkits, project management software',
    helpText: 'Incorporate your exact toolsets into prerequisites and procedural steps.',
    suggestions: ['Enterprise ERP & Department Database', 'Specialized Calibrated Toolsets & Hardware', 'Collaborative Cloud Management Portal'],
  },
  {
    id: 'qualitySafetyControls',
    label: 'Critical Quality Controls & Safety Precautions',
    placeholder: 'e.g. Pre-execution checklist verification, peer review sign-off, PPE requirements, data encryption',
    helpText: 'Ensures strict operational guardrails and defect reduction standards.',
    suggestions: ['Pre-Execution Checklist & Peer Review Sign-off', 'Mandatory Personal Protective Equipment (PPE)', 'Strict Dual-Signatory Verification Gates'],
  },
  {
    id: 'responsibleRoles',
    label: 'Key Department Titles & Governance',
    placeholder: 'e.g. Department Director, Senior Specialist, Operational Assignee, Compliance Officer',
    helpText: 'Maps approval sign-offs and operational accountability to your organizational chart.',
    suggestions: ['Department Head, Operations Lead, Assignee', 'Senior Specialist, Reviewer, Compliance Officer'],
  },
];

export const CompanyDepartmentForm: React.FC<CompanyDepartmentFormProps> = ({
  departmentId,
  departmentName,
  totalSOPCount,
  formData,
  onChange,
  onDepartmentDetailChange,
  onSubmit,
  onBack,
  selectedTemplate,
  onGenerateSingleSOP,
}) => {
  const departmentQuestions = DEPARTMENT_QUESTIONS[departmentId] || DEFAULT_DEPARTMENT_QUESTIONS;

  const handleStandardToggle = (std: string) => {
    const current = formData.applicableStandards || [];
    if (current.includes(std)) {
      onChange({ applicableStandards: current.filter((s) => s !== std) });
    } else {
      onChange({ applicableStandards: [...current, std] });
    }
  };

  const handleApplyPresetIndustry = (ind: string, size: string, activity: string) => {
    onChange({
      industry: ind,
      companySize: size,
      mainOperationalActivities: activity,
    });
  };

  const isFormValid =
    formData.companyName.trim().length > 0 &&
    formData.industry.trim().length > 0 &&
    formData.country.trim().length > 0;

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 p-6 sm:p-8 rounded-3xl text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-white/5 pointer-events-none transform skew-x-12" />
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/20 border border-brand-400/30 text-brand-300 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Automated SOP Suite Generator</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            Configure {departmentName} SOP Suite
          </h2>
          <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
            Enter your company specifics once. The system will automatically synthesize the complete library of{' '}
            <strong className="text-white underline decoration-brand-400 font-bold">
              {totalSOPCount} standard operating procedures
            </strong>{' '}
            customized to your exact organizational structure, operational activities, and regulatory standards.
          </p>

          {/* Loaded Template Banner */}
          {selectedTemplate && (
            <div className="mt-4 p-4 rounded-2xl bg-emerald-500/15 border border-emerald-400/40 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-md bg-emerald-500 text-slate-950 font-black text-[10px] uppercase tracking-wider">
                    Selected Template
                  </span>
                  <span className="text-xs text-emerald-300 font-mono font-semibold">
                    {selectedTemplate.id}
                  </span>
                </div>
                <h3 className="text-base font-bold text-white">
                  {selectedTemplate.title}
                </h3>
                <p className="text-xs text-emerald-100/80 max-w-2xl">
                  {selectedTemplate.description}
                </p>
                {selectedTemplate.referencedStandards && selectedTemplate.referencedStandards.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {selectedTemplate.referencedStandards.map((std, i) => (
                      <span key={i} className="px-2 py-0.5 rounded-md bg-white/10 text-emerald-200 text-[10px] font-medium">
                        {std}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <Link
                to={`/templates?department=${departmentId}`}
                className="shrink-0 px-3.5 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-semibold border border-white/20 transition"
              >
                Change Template
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Main Form Body */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (isFormValid) onSubmit();
        }}
        className="space-y-8"
      >
        {/* SECTION 1: COMPANY PROFILE */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="w-10 h-10 rounded-2xl bg-brand-50 border border-brand-200 text-brand-600 flex items-center justify-center font-bold">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">1. Company Profile</h3>
              <p className="text-xs text-slate-500">Core identity and organization profile applied across all {totalSOPCount} SOP documents.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                Company Legal Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.companyName}
                onChange={(e) => onChange({ companyName: e.target.value })}
                placeholder="e.g. Apex Global Logistics Inc."
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-slate-900 font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                Industry / Primary Sector <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.industry}
                onChange={(e) => onChange({ industry: e.target.value })}
                placeholder="e.g. Third-Party Logistics (3PL), Pharmaceuticals, Industrial Manufacturing"
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-slate-900 font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                Country & Facility Location <span className="text-rose-500">*</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  required
                  value={formData.country}
                  onChange={(e) => onChange({ country: e.target.value })}
                  placeholder="Country (e.g. United States, UK, Pakistan)"
                  className="w-1/2 px-4 py-3 rounded-2xl border border-slate-200 text-slate-900 font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 transition"
                />
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => onChange({ city: e.target.value })}
                  placeholder="City / Site (e.g. Chicago Facility #2)"
                  className="w-1/2 px-4 py-3 rounded-2xl border border-slate-200 text-slate-900 font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                Organization Size / Workforce Scale
              </label>
              <select
                value={formData.companySize}
                onChange={(e) => onChange({ companySize: e.target.value })}
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-slate-900 font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 transition bg-white"
              >
                <option value="1–25 employees">1–25 employees (Startup / Specialized Boutique)</option>
                <option value="26–100 employees">26–100 employees (Small & Growing Enterprise)</option>
                <option value="101–500 employees">101–500 employees (Mid-Market Facility)</option>
                <option value="501–2,500 employees">501–2,500 employees (Large Multi-Site Enterprise)</option>
                <option value="2,500+ employees">2,500+ employees (Global Corporation)</option>
              </select>
            </div>
          </div>
        </div>

        {/* SECTION 2: DEPARTMENT SCOPE & MAIN ACTIVITIES */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-600 flex items-center justify-center font-bold">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">2. Department Scope & Products</h3>
              <p className="text-xs text-slate-500">Describe the specific operational mandates and product lines handled.</p>
            </div>
          </div>

          <div className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                Official Department / Business Unit Title
              </label>
              <input
                type="text"
                value={formData.departmentName}
                onChange={(e) => onChange({ departmentName: e.target.value })}
                placeholder={`e.g. ${departmentName}`}
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-slate-900 font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                Primary Products, Services, or Assets Handled
              </label>
              <input
                type="text"
                value={formData.productsOrServices}
                onChange={(e) => onChange({ productsOrServices: e.target.value })}
                placeholder="e.g. Fast-moving consumer goods (FMCG), precision medical implants, automotive components, SaaS infrastructure"
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-slate-900 font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                Main Operational Activities & Key Mandates
              </label>
              <textarea
                rows={3}
                value={formData.mainOperationalActivities}
                onChange={(e) => onChange({ mainOperationalActivities: e.target.value })}
                placeholder="e.g. High-throughput receiving, 24/7 cross-docking, automated order fulfillment, strict inventory cycle counts, and carrier dispatch."
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-slate-900 font-normal text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 transition"
              />
            </div>

            {/* Applicable Standards Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                Applicable Standards & Compliance Regulations (Select All That Apply)
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  'ISO 9001 (Quality)',
                  'ISO 14001 (Environmental)',
                  'ISO 45001 (Occupational Safety)',
                  'ISO 22000 / HACCP (Food Safety)',
                  'OSHA 1910 / 1926 (Safety)',
                  'FDA / cGMP (Good Manufacturing)',
                  'HIPAA (Healthcare Privacy)',
                  'SOC 2 Type II (Cybersecurity)',
                  'IFRS / US GAAP (Accounting)',
                  'PSQCA / SECP (Local Compliance)',
                ].map((std) => {
                  const isChecked = (formData.applicableStandards || []).includes(std);
                  return (
                    <button
                      key={std}
                      type="button"
                      onClick={() => handleStandardToggle(std)}
                      className={`px-3 py-1.5 rounded-xl border text-xs font-semibold transition flex items-center gap-1.5 ${
                        isChecked
                          ? 'border-brand-600 bg-brand-50 text-brand-700 shadow-xs'
                          : 'border-slate-200 bg-slate-50/50 text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      <CheckCircle2 className={`w-3.5 h-3.5 ${isChecked ? 'text-brand-600' : 'text-slate-300'}`} />
                      <span>{std}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 3: DEPARTMENT-SPECIFIC OPERATIONAL QUESTIONS */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-brand-200/80 shadow-sm space-y-6 ring-2 ring-brand-500/10">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="w-10 h-10 rounded-2xl bg-brand-500 text-white flex items-center justify-center font-bold shadow-md shadow-brand-500/20">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-slate-900">3. {departmentName} Specific Questions</h3>
                <span className="px-2 py-0.5 rounded-md bg-brand-100 text-brand-800 text-[10px] font-bold uppercase tracking-wider">
                  Tailored Operations
                </span>
              </div>
              <p className="text-xs text-slate-500">
                These dynamic questions ensure the generated procedures precisely match your actual tools, storage, and workflows.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            {departmentQuestions.map((q) => {
              const currentVal = formData.departmentDetails[q.id] || '';
              return (
                <div key={q.id} className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                      {q.label}
                    </label>
                  </div>
                  <input
                    type="text"
                    value={currentVal}
                    onChange={(e) => onDepartmentDetailChange(q.id, e.target.value)}
                    placeholder={q.placeholder}
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-slate-900 font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 transition"
                  />
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1 text-[11px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <Info className="w-3.5 h-3.5 text-slate-300 shrink-0" />
                      {q.helpText}
                    </span>
                    {q.suggestions && q.suggestions.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 shrink-0">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Quick presets:</span>
                        {q.suggestions.map((sug) => (
                          <button
                            key={sug}
                            type="button"
                            onClick={() => onDepartmentDetailChange(q.id, sug)}
                            className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-medium transition"
                          >
                            {sug}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* SECTION 4: DOCUMENT GOVERNANCE & SIGN-OFFS */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">4. Document Governance & Authorization</h3>
              <p className="text-xs text-slate-500">Official sign-off blocks stamped on every SOP cover page and footer.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                Prepared By (Author / Title)
              </label>
              <input
                type="text"
                value={formData.preparedBy}
                onChange={(e) => onChange({ preparedBy: e.target.value })}
                placeholder="e.g. Operational Process Engineer"
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-slate-900 font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                Reviewed By (Reviewer / Title)
              </label>
              <input
                type="text"
                value={formData.reviewedBy}
                onChange={(e) => onChange({ reviewedBy: e.target.value })}
                placeholder="e.g. Quality & Compliance Manager"
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-slate-900 font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                Approved By (Executive Authorizer)
              </label>
              <input
                type="text"
                value={formData.approvedBy}
                onChange={(e) => onChange({ approvedBy: e.target.value })}
                placeholder="e.g. Vice President of Operations"
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-slate-900 font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 transition"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                Effective Release Date
              </label>
              <input
                type="date"
                value={formData.effectiveDate}
                onChange={(e) => onChange({ effectiveDate: e.target.value })}
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-slate-900 font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 transition bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                Initial Document Version
              </label>
              <input
                type="text"
                value={formData.version}
                onChange={(e) => onChange({ version: e.target.value })}
                placeholder="e.g. 1.0 (Official Release)"
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-slate-900 font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 transition"
              />
            </div>
          </div>
        </div>

        {/* BOTTOM ACTION BAR */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 bg-white rounded-3xl border border-slate-200/80 shadow-md">
          <button
            type="button"
            onClick={onBack}
            className="w-full sm:w-auto px-6 py-3 rounded-2xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs transition"
          >
            ← Change Department
          </button>

          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            {selectedTemplate && onGenerateSingleSOP && (
              <button
                type="button"
                onClick={onGenerateSingleSOP}
                disabled={!isFormValid}
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-lg shadow-emerald-500/25 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Generate This SOP ({selectedTemplate.title.slice(0, 24)}...)</span>
              </button>
            )}

            <button
              type="submit"
              disabled={!isFormValid}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-brand-600 via-indigo-600 to-indigo-700 hover:from-brand-700 hover:to-indigo-800 text-white font-bold text-sm shadow-xl shadow-brand-500/25 transition flex items-center justify-center gap-2.5 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Generate All {totalSOPCount} {departmentName} SOPs</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
