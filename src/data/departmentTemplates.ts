import type { SOPCategory, SOPStructure } from '../types/sop';

export interface DepartmentTopic {
  id: string;
  departmentId: SOPCategory;
  topicName: string;
  title: string;
  description: string;
  structure: SOPStructure;
  estimatedPages: number;
  referencedStandards: string[];
  tags: string[];
  isRegulated: boolean;
  purpose: string;
  scope: string;
  responsibilities: string;
  requiredResources: string;
  procedureDetails: string;
  safetyRisk: string;
  qualityChecks: string;
  documentationRecords: string;
  references: string;
}

export type DepartmentTemplate = DepartmentTopic;

export const STANDARDS_DISCLAIMER =
  'Notice: Standards references (ISO 9001/45001/22000, OSHA, WHO, PSQCA, SECP, EPA, FBR, and PPRA) are provided as architectural and compliance structuring guidelines based on prevailing industry frameworks. Final SOP documents must be reviewed and officially authorized by your designated compliance officer, legal counsel, or certified quality manager prior to organizational adoption.';

export const DEPARTMENT_TOPICS: DepartmentTopic[] = [
  // =========================================================================
  // 1. HUMAN RESOURCES (HR) — 5 TOPICS
  // =========================================================================
  {
    id: 'hr-recruitment-selection',
    departmentId: 'hr',
    topicName: 'Recruitment and Selection',
    title: 'Standard Operating Procedure for Talent Recruitment and Candidate Selection',
    description: 'End-to-end recruitment lifecycle from job requisition, multi-channel sourcing, structured interviewing, background vetting, and offer letter generation.',
    structure: 'step-by-step',
    estimatedPages: 3,
    referencedStandards: ['ISO 30405 (Human Governance - Recruitment)', 'EEOC Uniform Guidelines', 'ILO Convention 111'],
    tags: ['Recruitment', 'Hiring', 'Interviews', 'Talent'],
    isRegulated: false,
    purpose: 'To establish an objective, equitable, and merit-based talent acquisition procedure ensuring equal opportunity and hiring the most qualified personnel.',
    scope: 'Applies to all permanent, contractual, and executive job vacancies across all regional business divisions.',
    responsibilities: 'Hiring Manager: Define position requirements and technical assessments; Talent Acquisition Lead: Sourcing, candidate screening, and offer negotiation; HR Director: Final salary authorization and compliance sign-off.',
    requiredResources: 'Applicant Tracking System (ATS), job description templates, standardized interview scoring rubrics, criminal background verification portal.',
    procedureDetails: '1. Requisition Authorization: Hiring manager submits digital Manpower Requisition Form with approved budget allocation.\n2. Job Advertising: Post vacancies on approved career portals, professional networks, and institutional alumni boards for minimum 10 business days.\n3. Resume Screening: Filter candidates using standardized qualification criteria; assemble qualified shortlist of 4 to 6 applicants.\n4. Structured Competency Interview: Administer panel interviews utilizing standard behavioral situational scoring sheets.\n5. Pre-Employment Vetting: Conduct reference checks with two prior employers and verify educational degrees against issuing bodies.\n6. Formal Job Offer: Issue conditional offer letter specifying compensation, probationary benchmarks, and reporting deadline.',
    safetyRisk: 'Legal risk regarding employment discrimination or non-compliant candidate background screening. Strict adherence to equal opportunity laws is mandatory.',
    qualityChecks: '100% of candidate files must contain completed interview evaluation matrices and documented reference checks prior to offer dispatch.',
    documentationRecords: 'Approved Job Requisition Form, Interview Assessment Scorecards, Background Verification Report, Signed Offer Letter (retained for 3 years).',
    references: 'Corporate Talent Policy Section 2.1, ISO 30405:2016 Human Resource Management Guidelines.'
  },
  {
    id: 'hr-employee-onboarding',
    departmentId: 'hr',
    topicName: 'Employee Onboarding',
    title: 'Standard Operating Procedure for New Employee Onboarding & 90-Day Orientation',
    description: 'Structured day-1 to day-90 new hire welcoming, statutory documentation, IT credential provisioning, buddy assignment, and probation milestone review.',
    structure: 'checklist',
    estimatedPages: 3,
    referencedStandards: ['SHRM Onboarding Best Practices', 'Labor Laws Compliance', 'ISO 9001 Clause 7.2'],
    tags: ['Onboarding', 'Orientation', 'Probation', 'Training'],
    isRegulated: false,
    purpose: 'To accelerate employee time-to-productivity, assimilate new team members into corporate culture, and ensure complete legal and compliance onboarding.',
    scope: 'Mandatory for all newly hired full-time and part-time personnel from Day -5 (pre-boarding) through Day 90.',
    responsibilities: 'People Operations Specialist: Contract signing, benefit enrollment, and orientation facilitation; IT Support: Provision hardware and credentials; Department Mentor/Buddy: Daily coaching and procedural guidance.',
    requiredResources: 'HRIS portal, Welcome Kit, Employee Handbook, Workstation with pre-imaged OS, digital training modules.',
    procedureDetails: '1. Pre-Boarding Preparation: Order IT assets, set up email/ERP credentials, and issue welcoming information pack 5 days before start date.\n2. Day 1 Welcome & Documentation: Complete statutory withholding tax forms, direct deposit authorization, emergency contact forms, and photo ID badging.\n3. Orientation & Safety Briefing: Walk through facility fire exits, corporate code of ethics, information security policies, and employee handbook.\n4. Mentor Assignment: Pair new hire with trained departmental mentor for shadowing first 2 weeks.\n5. 30-Day Progress Check: Review initial deliverables, identify training gaps, and confirm tool access.\n6. 90-Day Probation Assessment: Conduct comprehensive probationary appraisal; formalize employment confirmation or structured performance plan.',
    safetyRisk: 'Compliance breach if mandatory statutory tax or immigration/work-authorization documents are missing or late.',
    qualityChecks: '100% compliance on signed confidentiality agreements and code of conduct receipts on Day 1.',
    documentationRecords: 'Signed Employment Contract, Tax Withholding W-4/FBR NTN Form, Handbook Acknowledgment Receipt, 90-Day Probation Review.',
    references: 'Employee Handbook v4.0, Workplace Safety & Emergency Standards Manual.'
  },
  {
    id: 'hr-attendance-leave',
    departmentId: 'hr',
    topicName: 'Attendance and Leave Management',
    title: 'Standard Operating Procedure for Time Tracking, Attendance & Leave Administration',
    description: 'Biometric timecard logging, overtime pre-approval thresholds, statutory paid time off (PTO), sick leaves, parental leave, and absence reconciliation.',
    structure: 'table',
    estimatedPages: 2,
    referencedStandards: ['Fair Labor Standards Act (FLSA)', 'Factories Act Statutory Leave Rules', 'ILO Convention 132'],
    tags: ['Attendance', 'Leave', 'PTO', 'Timesheet', 'Overtime'],
    isRegulated: false,
    purpose: 'To maintain accurate and transparent employee working hours, ensure prompt payroll processing, and uphold statutory leave entitlements.',
    scope: 'Encompasses all hourly non-exempt and salaried exempt personnel across all regional shifts.',
    responsibilities: 'Employee: Clock in/out accurately and request leave in advance; Department Supervisor: Review and approve weekly attendance exceptions and overtime; Payroll Manager: Reconcile timesheets for bi-weekly payroll run.',
    requiredResources: 'Biometric/RFID timeclocks, cloud HRIS attendance module, leave application forms.',
    procedureDetails: '1. Daily Time Recording: Employees record clock-in and clock-out via biometric terminal or geolocation mobile app at scheduled shift start and end.\n2. Planned Leave Submissions: Submit planned annual leaves at least 7 calendar days prior through HRIS for supervisor approval.\n3. Sick / Emergency Absences: Notify immediate supervisor within 2 hours of shift start; medical certificate required for sickness exceeding 2 consecutive days.\n4. Overtime Authorization: Non-exempt overtime must be pre-authorized in writing by the department manager before hours are worked.\n5. Monthly Reconciliation: Department supervisor reviews and signs timecard summary on the 1st business day following month end.',
    safetyRisk: 'Worker fatigue from unmonitored consecutive overtime shifts; mandatory minimum 11 consecutive hours rest between shifts.',
    qualityChecks: 'Zero unapproved overtime hours processed; 100% audit trail on leave quota deductions.',
    documentationRecords: 'Biometric Time Logs, Digital Leave Requests, Medical Fitness Certificates, Approved Overtime Work Slips.',
    references: 'Company Attendance Policy, National Employment Standards (NES).'
  },
  {
    id: 'hr-performance-management',
    departmentId: 'hr',
    topicName: 'Performance Management',
    title: 'Standard Operating Procedure for Annual Performance Appraisal & Goal Setting (OKRs/KPIs)',
    description: 'Quarterly OKR alignment, annual performance evaluation sequence, 360-degree feedback, ratings normalization, and Performance Improvement Plans (PIP).',
    structure: 'detailed',
    estimatedPages: 3,
    referencedStandards: ['ISO 30414 (Human Capital Reporting)', 'SHRM Performance Metrics', 'Corporate Governance Standards'],
    tags: ['Performance', 'Appraisal', 'KPIs', 'OKRs', 'PIP'],
    isRegulated: false,
    purpose: 'To foster continuous professional growth, align individual objectives with corporate strategic goals, and maintain objective appraisal standards.',
    scope: 'Mandatory for all regular full-time staff who have completed at least 6 months of active service.',
    responsibilities: 'Employee: Self-evaluation and goal updates; Line Manager: Objective scoring, constructive feedback delivery, and career coaching; HR Performance Lead: Calibration committee organization and ratings distribution governance.',
    requiredResources: 'Performance appraisal portal, goal-setting framework guidelines, Performance Improvement Plan (PIP) templates.',
    procedureDetails: '1. Annual Goal Cascade (Q1): Employees draft 3 to 5 measurable Key Performance Indicators (KPIs) or Objectives & Key Results (OKRs) aligned with organizational strategy.\n2. Mid-Year Check-in (Q2): Informal 1-on-1 dialogue to review milestone progress, adjust targets for market shifts, and address obstacles.\n3. Self-Evaluation (Q4): Employee submits self-rating and documented achievements against assigned metrics.\n4. Manager Assessment & Calibration: Manager completes formal assessment; calibration committee normalizes ratings across departments to prevent grade inflation.\n5. Performance Dialogue & Development Plan: Face-to-face review session to communicate final rating and formulate professional development goals.\n6. Performance Improvement Protocol: Employees with unsatisfactory ratings are enrolled in a structured 60-day Performance Improvement Plan (PIP) with weekly progress tracking.',
    safetyRisk: 'Legal risk from wrongful termination or retaliation claims; all underperformance notices must be substantiated with documentary evidence.',
    qualityChecks: '100% calibration completion rate across all functional units prior to compensation adjustments.',
    documentationRecords: 'Final Performance Appraisal Form, Calibration Meeting Minutes, Signed PIP Contracts (retained for 5 years).',
    references: 'Performance Management Framework v3.0, Equal Employment Opportunity Standards.'
  },
  {
    id: 'hr-grievance-handling',
    departmentId: 'hr',
    topicName: 'Employee Grievance Handling',
    title: 'Standard Operating Procedure for Employee Grievance Investigation & Dispute Resolution',
    description: 'Confidential reporting mechanisms, informal resolution, formal investigation sequences, inquiry committee hearings, and anti-retaliation protections.',
    structure: 'step-by-step',
    estimatedPages: 3,
    referencedStandards: ['ILO Recommendation 130 (Grievance Examination)', 'Civil Rights Act Title VII', 'Statutory Whistleblower Protections'],
    tags: ['Grievance', 'Investigation', 'Ethics', 'Conflict', 'Compliance'],
    isRegulated: true,
    purpose: 'To provide a safe, accessible, confidential, and prompt mechanism for resolving workplace disputes, grievances, and policy violations without fear of reprisal.',
    scope: 'Applicable to all staff, contractors, interns, and executives across all corporate premises.',
    responsibilities: 'Complainant: Submit factual, timely grievance; HR Grievance Officer: Impartial fact-finding and evidence gathering; Standing Inquiry Committee: Adjudicate formal hearings; HR VP: Implementation of remedial decisions.',
    requiredResources: 'Anonymous whistleblower portal, secure digital case vault, evidence recording equipment, interview chambers.',
    procedureDetails: '1. Stage 1 - Informal Resolution: Employee discusses grievance with immediate supervisor within 5 days of incident; supervisor provides verbal or written response within 3 days.\n2. Stage 2 - Formal Written Submission: If unresolved, complainant lodges Formal Grievance Form with HR detailing dates, witnesses, and remedies sought.\n3. Preliminary Case Assessment: HR evaluates jurisdiction and risk; if allegations involve harassment, fraud, or safety violations, immediate protective measures are enacted.\n4. Evidence Collection & Witness Interviews: Investigator gathers documentation, security logs, emails, and conducts independent recorded interviews with all named parties.\n5. Committee Determination: Standing committee delivers written investigative findings within 14 business days with recommendations (coaching, reassignment, formal reprimand, or termination).\n6. Appeals Process: Either party may submit an appeal to the Executive Appeals Board within 5 business days of receiving the determination.',
    safetyRisk: 'Zero tolerance for retaliatory action against complainants or witnesses. Any retaliation results in immediate summary dismissal.',
    qualityChecks: 'All formal grievances acknowledged in writing within 24 hours of receipt; 100% case resolution within 21 calendar days.',
    documentationRecords: 'Formal Grievance Complaint, Witness Statements, Investigative Summary Report, Action Implementation Letter (archived for 7 years).',
    references: 'Corporate Code of Ethics, Anti-Retaliation & Whistleblower Directive.'
  },

  // =========================================================================
  // 2. FINANCE & ACCOUNTING — 5 TOPICS
  // =========================================================================
  {
    id: 'fin-budget-management',
    departmentId: 'finance',
    topicName: 'Budget Management',
    title: 'Standard Operating Procedure for Annual Corporate Budgeting, Allocation & Variance Review',
    description: 'Zero-based budgeting cycles, capital expenditure (CapEx) vs operational expenditure (OpEx) allocations, and monthly budget variance governance.',
    structure: 'table',
    estimatedPages: 3,
    referencedStandards: ['GAAP / IFRS Framework', 'IMA Management Accounting Best Practices', 'SOX 404 Internal Controls'],
    tags: ['Budget', 'CapEx', 'OpEx', 'Variance', 'Forecasting'],
    isRegulated: true,
    purpose: 'To establish rigorous fiscal controls, ensure prudent capital deployment, and maintain financial accountability across all departmental cost centers.',
    scope: 'Covers annual budgeting cycles and monthly variance reviews across all operating business units.',
    responsibilities: 'Department Heads: Submit annual budget proposals with business justifications; Financial Planning & Analysis (FP&A) Manager: Financial modeling and monthly variance reporting; CFO: Final consolidation and Board presentation.',
    requiredResources: 'Enterprise ERP Financials (SAP/Oracle/NetSuite), budgeting templates, capital expenditure evaluation models.',
    procedureDetails: '1. Budget Call Issuance: FP&A issues annual budget guidelines, inflation baselines, and revenue forecasts 90 days before fiscal year-end.\n2. Departmental Submissions: Functional heads complete granular OpEx and CapEx line-item requests with ROI justifications.\n3. Financial Consolidation & Challenge: FP&A audits submissions against corporate profitability benchmarks and conducts defense hearings.\n4. Executive & Board Sign-off: Consolidated annual operating plan (AOP) presented to Executive Committee and Board of Directors for approval.\n5. Monthly Variance Tracking: By the 5th of each month, finance distributes budget vs actual variance reports.\n6. Re-allocation & Virement Protocol: Budget transfers exceeding $5,000 between line items require written CFO authorization.',
    safetyRisk: 'Financial misstatement or unauthorized overspending leading to cash flow impairment and audit penalties.',
    qualityChecks: '100% reconciliation between approved Board budget figures and ERP general ledger budget master tables.',
    documentationRecords: 'Annual Budget Plan, CapEx Appropriation Requests, Monthly Budget Variance Reports, Budget Reallocation Approvals.',
    references: 'Corporate Financial Policy Manual Section 3, IFRS Financial Reporting Framework.'
  },
  {
    id: 'fin-accounts-payable',
    departmentId: 'finance',
    topicName: 'Accounts Payable',
    title: 'Standard Operating Procedure for Accounts Payable: 3-Way Invoice Matching & Vendor Payments',
    description: 'Vendor invoice ingestion, 3-way matching (PO, GRN, Invoice), tax withholdings, approval hierarchies, and secure disbursement runs.',
    structure: 'step-by-step',
    estimatedPages: 3,
    referencedStandards: ['GAAP Expense Recognition', 'SOX Section 404 (Segregation of Duties)', 'FBR / IRS Statutory Withholding Tax Rules'],
    tags: ['Accounts Payable', 'Invoicing', '3-Way Match', 'Disbursement', 'Tax'],
    isRegulated: true,
    purpose: 'To ensure all corporate disbursements represent verified, authorized, and tax-compliant expenditures, safeguarding corporate liquidity from duplicate or fraudulent billings.',
    scope: 'Encompasses all trade vendor payables, utility charges, contractor billings, and commercial service contracts.',
    responsibilities: 'AP Clerk: Invoice verification, data entry, and 3-way matching; AP Supervisor: Review payment batch and tax withholding certificates; Finance Director / CFO: Dual authorization release on corporate banking portal.',
    requiredResources: 'ERP AP module, OCR invoice scanner, corporate banking multi-token portal, tax exemption registers.',
    procedureDetails: '1. Centralized Invoice Ingestion: Invoices received via dedicated accounts payable inbox; timestamped and assigned unique tracking voucher.\n2. Three-Way Matching: Match invoice line items against approved Purchase Order (PO) and warehouse Goods Received Note (GRN).\n3. Variance Exception Handling: Price or quantity discrepancies exceeding ±0.5% or $50 are routed to Purchasing for resolution.\n4. Statutory Tax Withholding: Calculate applicable income tax and sales tax withholding as per statutory tax schedules; generate withholding slips.\n5. Payment Batch Scheduling: Twice-monthly scheduled payment runs via automated clearing house (ACH) or wire transfer.\n6. Dual Sign-off & Disbursement: Dual token authorization required on banking portal; remittance advice automatically emailed to vendor.',
    safetyRisk: 'Exposure to business email compromise (BEC) and fake vendor bank change requests. Zero bank account changes permitted without verbal phone verification with registered vendor representative.',
    qualityChecks: '100% match rate on PO-GRN-Invoice triples; zero duplicate invoices processed.',
    documentationRecords: 'Vendor Invoices, 3-Way Match Audit Slips, Bank Payment Confirmations, Withholding Tax Certificates (retained for 7 years).',
    references: 'Accounts Payable Control Policy, Statutory Tax Code.'
  },
  {
    id: 'fin-accounts-receivable',
    departmentId: 'finance',
    topicName: 'Accounts Receivable',
    title: 'Standard Operating Procedure for Accounts Receivable: Invoicing, Credit Terms & Collections',
    description: 'Customer credit vetting, commercial invoice generation, payment allocation, aging analysis (DSO), and collections escalation matrices.',
    structure: 'table',
    estimatedPages: 3,
    referencedStandards: ['IFRS 15 (Revenue from Contracts)', 'GAAP Matching Principle', 'Fair Debt Collection Standards'],
    tags: ['Accounts Receivable', 'Credit Limit', 'Collections', 'DSO', 'Invoicing'],
    isRegulated: true,
    purpose: 'To accelerate cash collections, minimize Days Sales Outstanding (DSO), enforce customer credit limits, and eliminate bad debt write-offs.',
    scope: 'Applicable to all commercial sales, customer invoicing, credit authorizations, and collection cycles.',
    responsibilities: 'Billing Specialist: Issue accurate customer tax invoices upon fulfillment; Credit Controller: Assess customer creditworthiness and set credit caps; Collections Officer: Conduct aging follow-ups and legal debt escalations.',
    requiredResources: 'ERP billing system, credit bureau checking portal, automated dunning email software.',
    procedureDetails: '1. Customer Credit Scoring: Evaluate prospective credit customers using financial statements, bank references, and credit agency reports before approving credit terms (Net 30/60).\n2. Automated Invoice Issuance: Generate customer sales invoice within 24 hours of warehouse dispatch or service delivery confirmation.\n3. Daily Cash Application: Reconcile daily customer wire transfers and lockbox checks against outstanding invoices in the AR subledger.\n4. Aging Ledger Review: Review weekly aged receivables categorized into Current, 1-30, 31-60, 61-90, and >90 days overdue.\n5. Dunning Escalation: Send automated reminder at Day +5 past due; phone call at Day +15; formal demand letter and credit hold at Day +30; referral to legal recovery at Day +60.\n6. Bad Debt Allowance: Calculate expected credit loss (ECL) quarterly per IFRS 9 guidelines.',
    safetyRisk: 'Credit risk from extending excessive terms to insolvent buyers; strict enforcement of credit holds when accounts exceed limit.',
    qualityChecks: 'Daily cash reconciliation variance must be exactly zero before day-end close.',
    documentationRecords: 'Approved Credit Application, Sales Tax Invoices, Bank Deposit Slips, Customer Account Statements, Collection Demand Notices.',
    references: 'Corporate Credit Policy v2.4, IFRS 9 / IFRS 15 Standards.'
  },
  {
    id: 'fin-bank-reconciliation',
    departmentId: 'finance',
    topicName: 'Bank Reconciliation',
    title: 'Standard Operating Procedure for Monthly Bank Reconciliation & Cash Balance Verification',
    description: 'Daily cash monitoring, monthly general ledger to bank statement matching, outstanding check clearing, and variance investigation.',
    structure: 'step-by-step',
    estimatedPages: 2,
    referencedStandards: ['GAAP Cash & Cash Equivalents Guidelines', 'SOX 404 Balance Sheet Substantiation', 'COSO Internal Control Framework'],
    tags: ['Bank Reconciliation', 'Cash Management', 'Audit', 'General Ledger'],
    isRegulated: true,
    purpose: 'To ensure absolute agreement between bank statement balances and general ledger cash accounts, detecting bank errors, unrecorded transactions, or fraud.',
    scope: 'Mandatory for all corporate operating accounts, payroll accounts, foreign currency accounts, and petty cash reserves.',
    responsibilities: 'Senior Accountant: Download bank feeds, execute matching, and log reconciling items; Accounting Manager: Review and sign off reconciliation pack; Internal Auditor: Quarterly spot audit.',
    requiredResources: 'Electronic banking portals, ERP general ledger reconciliation module, canceled check image archives.',
    procedureDetails: '1. Daily Bank Statement Download: Download bank statements every morning; verify opening and closing cash balances against treasury cash log.\n2. Transaction Matching: Match cleared checks, wire receipts, merchant deposits, and bank fees against corresponding general ledger entries.\n3. Identify Reconciling Items: Isolate deposits in transit, outstanding uncashed checks, bank service fees, and unapplied customer transfers.\n4. Adjusting Journal Entries: Prepare and post journal entries for legitimate bank fees, interest income, or auto-debits directly into the GL.\n5. Stale-Dated Check Review: Identify uncashed vendor or payroll checks older than 180 days for statutory escheatment or re-issuance.\n6. Formal Sign-Off: Sign and archive the Bank Reconciliation Statement with attached bank statement and GL trial balance by the 5th of each month.',
    safetyRisk: 'Fraudulent checks, unauthorized automated clearinghouse (ACH) withdrawals, or cashier embezzlement. Strict segregation of duties enforced.',
    qualityChecks: 'Unreconciled variance must equal $0.00; zero uninvestigated reconciling items older than 30 days.',
    documentationRecords: 'Bank Statements, GL Cash Account Printout, Signed Bank Reconciliation Certificate, Adjusting Journal Entry Slips.',
    references: 'Treasury & Internal Controls Manual, SOX Cash Control Policy.'
  },
  {
    id: 'fin-financial-reporting',
    departmentId: 'finance',
    topicName: 'Financial Reporting',
    title: 'Standard Operating Procedure for Month-End & Year-End Financial Statement Close & Reporting',
    description: 'Accrual postings, depreciation schedules, intercompany eliminations, balance sheet substantiation, and audited financial statements.',
    structure: 'raci-matrix',
    estimatedPages: 3,
    referencedStandards: ['IFRS / US GAAP Reporting Standards', 'SECP / SEC Statutory Filing Rules', 'ISA International Standards on Auditing'],
    tags: ['Financial Reporting', 'Month-End Close', 'Balance Sheet', 'P&L', 'Audit'],
    isRegulated: true,
    purpose: 'To execute an orderly, accurate, and rapid financial close, producing audit-ready balance sheets, income statements, and cash flow reports.',
    scope: 'Applies to monthly, quarterly, and annual closing cycles across all corporate entities and legal subsidiaries.',
    responsibilities: 'Financial Accountant: Post standard accruals, prepayments, and fixed asset depreciation; Head of Reporting: Consolidate trial balance and prepare financial statements; CFO: Final executive sign-off; External Auditor: Statutory audit certification.',
    requiredResources: 'Consolidation ERP, financial disclosure checklist, asset depreciation registers, financial reporting disclosure software.',
    procedureDetails: '1. Subledger Close (Day -1 to Day +2): Close accounts payable, accounts receivable, inventory, and payroll subledgers to prevent new postings.\n2. General Ledger Adjustments (Day +3): Post recurring journal entries: depreciation, amortization of intangibles, bad debt allowances, and accrued expenses.\n3. Intercompany Reconciliation (Day +4): Reconcile and eliminate intercompany sales, management fees, and loan balances across entities.\n4. Trial Balance Review (Day +5): Verify trial balance debit-credit parity and investigate unexpected variance swings exceeding 10% vs prior month.\n5. Financial Statement Compilation (Day +7): Assemble Balance Sheet, Income Statement (P&L), Statement of Cash Flows, and equity movements.\n6. Executive Review & Statutory Filing: Conduct executive financial review; submit quarterly/annual filings to regulatory authorities and board audit committee.',
    safetyRisk: 'Regulatory sanctions, fines, and reputational collapse resulting from late or materially misstated financial filings.',
    qualityChecks: '100% balance sheet account reconciliations completed and signed before closing financial books.',
    documentationRecords: 'Audited Financial Statements, Trial Balance Backups, Balance Sheet Substantiation Workpapers, External Auditor Sign-Off Letters.',
    references: 'Corporate Accounting Policy, IFRS / GAAP Statutory Accounting Manual.'
  },

  // =========================================================================
  // 3. ADMINISTRATION — 5 TOPICS
  // =========================================================================
  {
    id: 'admin-access-control-visitors',
    departmentId: 'administration',
    topicName: 'Office Access Control and Visitor Management',
    title: 'Standard Operating Procedure for Corporate Facility Access Control & Visitor Management',
    description: 'Physical security check-in, government ID verification, visitor badging, nondisclosure agreement (NDA) signoffs, and access log audits.',
    structure: 'step-by-step',
    estimatedPages: 2,
    referencedStandards: ['ISO 27001 Physical Security (A.11)', 'OSHA Facility Safety Standards', 'Corporate Building Security Regulations'],
    tags: ['Administration', 'Access Control', 'Visitors', 'Security', 'Reception'],
    isRegulated: false,
    purpose: 'To protect personnel, proprietary corporate assets, and confidential records by regulating physical access to company premises.',
    scope: 'Mandatory across all headquarters entrances, branch offices, conference centers, and operational buildings.',
    responsibilities: 'Receptionist / Security Guard: Verify visitor credentials and issue badges; Host Employee: Escort visitor throughout visit; Facilities Manager: Weekly access audit.',
    requiredResources: 'Electronic visitor management kiosk, photo badge printer, guest NDA tablets, surveillance monitors.',
    procedureDetails: '1. Visitor Check-In: All visitors report directly to main reception desk upon entry; presenting valid government-issued photo ID.\n2. Digital Registration & NDA: Visitor enters name, organization, host name, and signs electronic Non-Disclosure Agreement (NDA).\n3. Visitor Badge Issuance: Issue color-coded visitor badge (Red: Restricted Escort Required; Green: General Access); badge must remain visible at chest height.\n4. Host Notification & Escort: Receptionist contacts employee host; host personally escorts visitor from lobby to meeting location and back to reception.\n5. Checkout & Badge Retrieval: Upon meeting completion, host accompanies visitor to reception; visitor badge surrendered and checkout logged.',
    safetyRisk: 'Unauthorized intruder access leading to corporate espionage, data theft, or physical security incidents.',
    qualityChecks: '100% visitor log compliance; zero unescorted visitors permitted in operational or technical work areas.',
    documentationRecords: 'Electronic Visitor Logs, Signed Visitor NDAs, Daily Incident Logbook (retained for 12 months).',
    references: 'Facility Security Policy Section 1.2, Physical Asset Protection Guidelines.'
  },
  {
    id: 'admin-office-supplies',
    departmentId: 'administration',
    topicName: 'Office Supplies Inventory and Requisition',
    title: 'Standard Operating Procedure for Office Supplies Procurement, Inventory Control & Requisition',
    description: 'Centralized supplies replenishment, min-max reorder thresholds, departmental requisition forms, and quarterly inventory audits.',
    structure: 'checklist',
    estimatedPages: 2,
    referencedStandards: ['ISO 9001 Resource Management', 'Lean 5S Office Standards', 'Internal Procurement Limits'],
    tags: ['Administration', 'Supplies', 'Inventory', 'Requisition', 'Procurement'],
    isRegulated: false,
    purpose: 'To ensure uninterrupted availability of essential office stationery, consumable goods, and equipment while controlling administrative expenditure.',
    scope: 'Encompasses all common office consumables, printer paper, toner, pantry supplies, and desk accessories.',
    responsibilities: 'Administrative Assistant: Receive requisitions and manage supply room inventory; Department Representative: Submit consolidated weekly orders; Administration Manager: Approve monthly supplier bulk replenishment.',
    requiredResources: 'Supply inventory tracking spreadsheet/module, locked supply storeroom, barcode inventory scanner.',
    procedureDetails: '1. Requisition Submission: Department staff submit supply requests via administrative portal by Thursday 15:00.\n2. Requisition Fulfillment: Admin assistant reviews requests against department allocation quotas and prepares supply packs for Friday morning pickup.\n3. Inventory Par-Level Monitoring: Track stock levels against established Min-Max thresholds; trigger replenishment when stock hits reorder point.\n4. Receiving & Storage: Verify incoming vendor deliveries against PO; stack consumables neatly on labeled storeroom shelving using FIFO.\n5. Quarterly Physical Audit: Conduct physical count at quarter end; investigate discrepancies exceeding 2% between system stock and physical count.',
    safetyRisk: 'Hazardous chemical storage risk from cleaning fluids and aerosol sprays; store in ventilated lockers away from heat sources.',
    qualityChecks: 'Zero stock-outs on critical operational consumables (paper, toner cartridges, sanitary supplies).',
    documentationRecords: 'Supplies Requisition Slips, Vendor Delivery Challans, Monthly Consumption Summary, Quarterly Audit Sheets.',
    references: 'Administrative Operations Manual, Corporate Expense Guidelines.'
  },
  {
    id: 'admin-mail-courier-handling',
    departmentId: 'administration',
    topicName: 'Mail, Courier and Package Handling',
    title: 'Standard Operating Procedure for Inbound & Outbound Mail and Courier Logistics',
    description: 'Centralized mail triage, security screening of suspicious parcels, courier tracking logging, internal delivery receipts, and outbound dispatch.',
    structure: 'step-by-step',
    estimatedPages: 2,
    referencedStandards: ['Postal Security Guidelines (UPU)', 'OSHA Handling of Suspicious Mail', 'Data Protection / Confidentiality Standards'],
    tags: ['Administration', 'Mail', 'Courier', 'Logistics', 'Shipping'],
    isRegulated: false,
    purpose: 'To provide secure, systematic, and prompt handling of corporate mail, courier parcels, and sensitive correspondence.',
    scope: 'All incoming and outgoing mail, legal notices, and courier freight handled at corporate reception or mailroom.',
    responsibilities: 'Mailroom Clerk: Inspect, log, and sort incoming mail; Recipient Employee: Acknowledge receipt of confidential parcels; Office Manager: Monthly courier invoice review.',
    requiredResources: 'Mail logging register/software, digital package scale, parcel x-ray/metal detector (for high-security facilities), postage meter.',
    procedureDetails: '1. Courier Receipt: Accept deliveries from courier services (DHL, FedEx, TCS, etc.); verify recipient name and sign courier delivery sheet.\n2. Suspicious Package Screening: Visually inspect parcels for red flags: excessive postage, oily stains, protruding wires, unverified sender, or strange odor. If suspicious, isolate and alert security.\n3. Logging & Categorization: Log tracking number, carrier, sender, recipient, and time into electronic Mail Registry.\n4. Internal Distribution: Sort mail by department; deliver standard mail to departmental trays twice daily (11:00 and 15:00).\n5. Confidential & High-Value Delivery: High-value, confidential, or legal documents hand-delivered with mandatory signature from recipient.\n6. Outbound Dispatch: Outgoing packages weighed, labeled with company courier account barcode, and dispatched before 17:00 daily cutoff.',
    safetyRisk: 'Potential hazardous biological, chemical, or explosive parcel threats. Strict adherence to USPS/OSHA suspicious parcel triage.',
    qualityChecks: '100% of incoming registered/express parcels logged and delivered to recipient within 4 business hours.',
    documentationRecords: 'Inbound Courier Logbook, Outbound Waybills, Signature Acknowledgment Receipts (retained for 2 years).',
    references: 'Postal Screening Standard Operating Guide, Facility Security Protocol.'
  },
  {
    id: 'admin-facility-cleanliness',
    departmentId: 'administration',
    topicName: 'Facility Cleanliness and Maintenance Operations',
    title: 'Standard Operating Procedure for Corporate Facility Housekeeping & Janitorial Cleanliness',
    description: 'Daily sanitization routines, restroom maintenance logs, waste management, deep cleaning schedules, and janitorial contractor SLA oversight.',
    structure: 'table',
    estimatedPages: 2,
    referencedStandards: ['OSHA Sanitation Standard (29 CFR 1910.141)', 'CDC Workplace Environmental Cleaning', 'Green Building Hygiene Standards'],
    tags: ['Administration', 'Housekeeping', 'Sanitization', 'Facility', 'Janitorial'],
    isRegulated: false,
    purpose: 'To maintain a hygienic, professional, healthy, and visually immaculate office environment for employees and clients.',
    scope: 'Covers all office suites, restrooms, cafeterias, hallways, conference rooms, and exterior entrance walkways.',
    responsibilities: 'Janitorial Staff: Daily routine cleaning per checklist; Housekeeping Supervisor: Conduct hourly restroom inspections; Admin Manager: Monthly janitorial audit and vendor SLA reviews.',
    requiredResources: 'Cleaning carts, hospital-grade disinfectants, color-coded microfiber towels, floor scrubbers, restroom inspection clipboards.',
    procedureDetails: '1. Morning Pre-Shift Cleaning (06:00 - 08:30): Vacuum carpets, mop hard floors, empty all desk wastebaskets, and wipe conference tables before business hours.\n2. High-Touch Surface Sanitization: Sanitize elevator buttons, door handles, stair railings, and water dispensers every 2 hours with approved disinfectant.\n3. Restroom Maintenance Routine: Clean, disinfect, restock soap/paper, and sign hourly inspection sheet mounted on restroom doors.\n4. Cafeteria Hygiene Protocol: Clean dining tables, sanitize microwave ovens, empty food waste bins, and mop floors immediately following lunch period.\n5. Deep Cleaning Schedule: Conduct deep extraction carpet cleaning, window washing, and HVAC vent dusting on a monthly rotating schedule.',
    safetyRisk: 'Slip and fall hazard on wet floors; mandatory yellow "Caution: Wet Floor" signs deployed during all mopping operations.',
    qualityChecks: 'Housekeeping supervisor must achieve >95% score on daily random cleanliness audits.',
    documentationRecords: 'Daily Housekeeping Checklists, Restroom Hourly Inspection Logs, Material Safety Data Sheets (MSDS) for Cleaning Chemicals.',
    references: 'OSHA 1910.141, Corporate Workplace Hygiene Standards.'
  },
  {
    id: 'admin-document-retention',
    departmentId: 'administration',
    topicName: 'Document Retention, Archival and Disposal',
    title: 'Standard Operating Procedure for Corporate Document Retention, Archival & Secure Destruction',
    description: 'Document classification schedules, secure physical storage, digital indexing, legal hold protocols, and certified shredding destruction.',
    structure: 'step-by-step',
    estimatedPages: 3,
    referencedStandards: ['ISO 15489 (Information & Records Management)', 'GDPR / Data Protection Regulations', 'Corporate Governance Statutory Filing Retention Rules'],
    tags: ['Administration', 'Records', 'Archiving', 'Retention', 'Compliance'],
    isRegulated: true,
    purpose: 'To systematically retain vital organizational records for legal, tax, and regulatory compliance while securely destroying expired documents.',
    scope: 'Applies to all physical paper documents and digital records generated across all operational departments.',
    responsibilities: 'Department Custodians: Box, index, and transfer inactive records; Records Manager: Maintain archival master register and enforce retention schedules; Legal Counsel: Issue and release Legal Hold notices.',
    requiredResources: 'Fireproof record storage facility, barcode box labeling system, cross-cut industrial shredders (DIN 66399 Level P-4).',
    procedureDetails: '1. Document Retention Schedule: Classify documents per schedule: Tax & Audits (7 years), Personnel files (7 years post-termination), Contracts (10 years post-expiry), Corporate Charter (Permanent).\n2. Boxing & Indexing: Department custodians place inactive files in standardized archival cartons; label with Department Code, Contents Summary, and Destruction Year.\n3. Transfer to Secure Archive: Move labeled cartons to climate-controlled, fireproof document repository; record shelf location in Records Management System.\n4. Legal Hold Implementation: When litigation or audits arise, legal counsel issues Legal Hold; immediate suspension of destruction for all affected records.\n5. Annual Disposal Review: In January, Records Manager identifies files reaching retention expiry; obtains written legal and financial clearance for disposal.\n6. Certified Secure Destruction: Third-party certified shredding contractor destroys approved paper records on-site; issues Certificate of Destruction.',
    safetyRisk: 'Severe legal liability and fines if records subject to active investigation are destroyed, or if confidential data is leaked via improper disposal.',
    qualityChecks: '100% Certificate of Destruction documentation linked to every purged carton number in archival database.',
    documentationRecords: 'Records Master Index, Archive Transfer Slips, Legal Hold Notices, Certificates of Destruction (retained permanently).',
    references: 'ISO 15489-1:2016, Corporate Document Retention Schedule Manual.'
  },

  // =========================================================================
  // 4. INFORMATION TECHNOLOGY (IT) — 5 TOPICS
  // =========================================================================
  {
    id: 'it-user-access-management',
    departmentId: 'it',
    topicName: 'User Access Management',
    title: 'Standard Operating Procedure for Identity Access Management (IAM), Provisioning & Deprovisioning',
    description: 'Role-based access control (RBAC), least-privilege principle, MFA enforcement, privileged account management, and same-day termination deprovisioning.',
    structure: 'step-by-step',
    estimatedPages: 3,
    referencedStandards: ['ISO/IEC 27001 Control 5.16', 'NIST SP 800-63B', 'SOC 2 Trust Services Criteria'],
    tags: ['IT', 'IAM', 'Active Directory', 'Access Control', 'MFA'],
    isRegulated: true,
    purpose: 'To protect corporate digital infrastructure by ensuring users receive only the access necessary for their role, with immediate revocation upon role change or exit.',
    scope: 'All enterprise Active Directory accounts, cloud tenancies (AWS/Azure/GCP), SaaS tools, and internal database systems.',
    responsibilities: 'HR: Notify IT of employee status changes; IT Systems Admin: Execute credential creation and RBAC group assignment; Security Officer: Conduct quarterly privilege reviews.',
    requiredResources: 'Identity Provider (Okta / Azure AD / Google Workspace), Multi-Factor Authentication tokens, privileged access management (PAM) vault.',
    procedureDetails: '1. Access Request & Authorization: Manager submits digital access request specifying standard job role template and business justifications.\n2. Account Provisioning: Systems admin generates account using standard naming format (first.last@company.com); assigns membership in approved security groups.\n3. Mandatory Multi-Factor Authentication: User must configure hardware token or authenticator app on first login; SMS-based 2FA prohibited.\n4. Privileged Access Protocol: Administrator accounts must use separate dedicated admin credentials with session recording in PAM vault.\n5. Routine Exit Deprovisioning: On final day, disable account at 18:00, revoke all active OAuth session tokens, and redirect email to designated supervisor.\n6. Involuntary Immediate Termination: Within 15 minutes of HR notice, immediately disable account, wipe remote MDM corporate profiles, and revoke VPN access.',
    safetyRisk: 'Unauthorized privileged access leading to corporate data exfiltration or ransomware propagation.',
    qualityChecks: '100% of departing employee accounts disabled within SLA (<15 minutes for emergency; <4 hours for routine).',
    documentationRecords: 'Access Authorization Tickets, Quarterly Access Review Audits, Deprovisioning Timestamp Logs.',
    references: 'NIST SP 800-63B, ISO/IEC 27001 Access Control Policy.'
  },
  {
    id: 'it-data-backup-recovery',
    departmentId: 'it',
    topicName: 'Data Backup and Recovery',
    title: 'Standard Operating Procedure for Enterprise Data Backup, Snapshot Retention & Disaster Recovery',
    description: '3-2-1 backup methodology, automated database snapshots, immutable cloud retention, encryption in transit and rest, and quarterly restore drills.',
    structure: 'detailed',
    estimatedPages: 3,
    referencedStandards: ['ISO 27001 Control 8.13', 'NIST SP 800-34 (Contingency Planning)', 'SOC 2 Availability Criteria'],
    tags: ['IT', 'Backup', 'Disaster Recovery', 'Snapshots', 'RTO', 'RPO'],
    isRegulated: true,
    purpose: 'To ensure continuous data resilience, achieve Recovery Time Objective (RTO < 4 hrs) and Recovery Point Objective (RPO < 1 hr), and safeguard business continuity.',
    scope: 'All core production databases, cloud virtual machines, enterprise document repositories, and source code repositories.',
    responsibilities: 'DevOps / Database Administrator: Configure and monitor automated backup jobs; Infrastructure Lead: Quarterly recovery drills; CISO: Review disaster recovery audit reports.',
    requiredResources: 'Cloud backup vault (AWS S3 Glacier / Azure Blob with Object Lock), automated backup agent software, staging disaster recovery sandbox.',
    procedureDetails: '1. 3-2-1 Architecture Implementation: Maintain 3 copies of data across 2 different storage media, with 1 copy stored in an immutable, air-gapped offsite cloud region.\n2. Database Backup Schedule: Execute continuous transaction log backups (every 15 min), daily differential backups (01:00), and weekly full backups (Sunday 02:00).\n3. Strong Encryption Mandate: All backups encrypted with AES-256 before transmission and stored with customer-managed KMS keys.\n4. Automated Integrity Validation: Backup software executes automated checksum verification and test mounts following every backup job.\n5. Quarterly Disaster Recovery Drill: Conduct simulated infrastructure failure drill; restore databases to staging sandbox and measure actual RTO and RPO against benchmarks.\n6. Drill Post-Mortem: Document recovery metrics, identify replication lag, and update Disaster Recovery Runbook.',
    safetyRisk: 'Total business failure if backups are corrupted, unencrypted, or compromised during a ransomware attack.',
    qualityChecks: 'Daily backup success rate must equal 100%; failed backup jobs trigger automated pager alert to on-call engineer within 10 minutes.',
    documentationRecords: 'Daily Backup Health Logs, Quarterly Disaster Recovery Test Reports, KMS Encryption Audit Trails.',
    references: 'Disaster Recovery Plan v3.5, NIST SP 800-34 Contingency Planning.'
  },
  {
    id: 'it-cybersecurity-incident',
    departmentId: 'it',
    topicName: 'Cybersecurity Incident Management',
    title: 'Standard Operating Procedure for Cybersecurity Incident Triage, Containment & Remediation',
    description: 'NIST PICERL incident framework: Preparation, Detection, Containment, Eradication, Recovery, and Post-Incident Forensic Reporting.',
    structure: 'detailed',
    estimatedPages: 4,
    referencedStandards: ['NIST SP 800-61 Rev 2', 'ISO/IEC 27035', 'GDPR Article 33 (72-hour notification)'],
    tags: ['IT', 'Cybersecurity', 'Incident Response', 'Ransomware', 'SOC'],
    isRegulated: true,
    purpose: 'To detect, contain, eliminate, and recover from cybersecurity breaches swiftly, mitigating data loss and fulfilling statutory disclosure obligations.',
    scope: 'Covers all corporate computing devices, cloud infrastructure, internal networks, endpoints, and data assets.',
    responsibilities: 'SOC Analyst: Initial detection and severity scoring; Incident Commander: Coordinate response war room; Legal / Communications: Statutory reporting and external stakeholder messaging.',
    requiredResources: 'SIEM / EDR console (CrowdStrike / Sentinel), forensic memory capture tools, isolated network VLAN, out-of-band communication channel.',
    procedureDetails: '1. Detection & Severity Triage: Classify incident: Sev-1 (Critical: active ransomware, customer data breach), Sev-2 (High: compromised admin account), Sev-3 (Medium: isolated malware).\n2. Containment Protocol: Immediately disconnect compromised endpoint from local network and WiFi; DO NOT power down machine (preserves volatile RAM evidence).\n3. Evidence Preservation: Capture cryptographic forensic image of hard drive and memory dump following chain of custody guidelines.\n4. Threat Eradication: Terminate malicious processes, block hostile C2 IP addresses and domains at firewall, and rotate all compromised credentials.\n5. System Recovery & Validation: Rebuild infected machines from clean golden image; restore databases from verified immutable backups; monitor network traffic for 72 hours.\n6. Statutory Notifications & Post-Mortem: If personal data is impacted, notify legal counsel for 72-hour regulatory disclosure; deliver comprehensive root cause analysis to board.',
    safetyRisk: 'Massive financial liability and reputational damage if data breach disclosures are delayed past legal deadlines.',
    qualityChecks: 'Containment initiated within 15 minutes of confirmed Sev-1 compromise; 100% forensic evidence chain of custody maintained.',
    documentationRecords: 'Incident Timeline Log, Forensic Evidence Custody Forms, Regulatory Breach Notices, Final Post-Mortem Report.',
    references: 'NIST SP 800-61, Corporate Information Security Incident Response Plan.'
  },
  {
    id: 'it-troubleshooting-helpdesk',
    departmentId: 'it',
    topicName: 'IT Troubleshooting',
    title: 'Standard Operating Procedure for IT Helpdesk Support, Ticket Triage & Troubleshooting',
    description: 'ITIL service desk operations, ticket classification, Tier 1 to Tier 3 escalation pathways, SLA response benchmarks, and knowledge base updates.',
    structure: 'step-by-step',
    estimatedPages: 3,
    referencedStandards: ['ITIL v4 Service Management', 'ISO/IEC 20000-1', 'HDI Service Desk Standards'],
    tags: ['IT', 'Helpdesk', 'Troubleshooting', 'ITIL', 'SLA'],
    isRegulated: false,
    purpose: 'To ensure prompt, professional, and consistent technical support to internal employees, minimizing operational downtime from IT faults.',
    scope: 'Covers all hardware, software, network, printing, and remote access support requests across the organization.',
    responsibilities: 'Tier 1 Helpdesk Tech: Ticket intake, initial troubleshooting, and resolution; Tier 2 Systems Specialist: Complex software/hardware diagnostics; IT Helpdesk Supervisor: SLA compliance and CSAT monitoring.',
    requiredResources: 'ITSM ticketing system (Jira Service Management / ServiceNow), remote assistance tool, diagnostic hardware testers.',
    procedureDetails: '1. Ticket Ingestion & Logging: Users log tickets via email, portal, or phone; ticketing engine assigns unique ticket ID and priority (Urgent, High, Medium, Low).\n2. Initial Triage (Tier 1): Acknowledge ticket within SLA (Urgent: 15 min; High: 1 hr; Medium: 4 hrs); verify user credentials and symptoms.\n3. Diagnostic Steps: Utilize remote desktop tool to inspect event logs, verify network connectivity, run diagnostic scans, and check software updates.\n4. Escalation (Tier 2 / 3): If unresolved within 45 minutes, escalate ticket to Tier 2 specialist with complete notes of troubleshooting steps attempted.\n5. Resolution & User Verification: Apply fix, verify resolution with the user, and test system functionality before marking ticket resolved.\n6. Knowledge Base Documentation: If the issue represents a recurring incident, write or update internal Knowledge Base article within 24 hours.',
    safetyRisk: 'Electrical shock hazard during internal computer hardware repairs; always disconnect power cables and wear anti-static wrist strap.',
    qualityChecks: 'Maintain >90% First Contact Resolution (FCR) on Tier 1 tickets; overall SLA compliance >95%.',
    documentationRecords: 'ITSM Ticket Logs, Remote Session Audit Recordings, User CSAT Feedback Scores, Monthly Helpdesk Performance Metric Reports.',
    references: 'ITIL Service Desk Framework v4, IT Support Policy.'
  },
  {
    id: 'it-hardware-software-maintenance',
    departmentId: 'it',
    topicName: 'Hardware and Software Maintenance',
    title: 'Standard Operating Procedure for IT Asset Management, Patching & Routine Maintenance',
    description: 'Hardware lifecycle provisioning, asset tagging, automated operating system patch management, antivirus updates, and equipment disposal.',
    structure: 'table',
    estimatedPages: 3,
    referencedStandards: ['ISO 19770 (IT Asset Management)', 'NIST SP 800-40 (Patch Management)', 'WEEE Environmental Electronics Recycling'],
    tags: ['IT', 'Patching', 'Asset Management', 'Hardware', 'Software'],
    isRegulated: false,
    purpose: 'To maximize reliability, protect against software vulnerabilities, track corporate IT equipment, and retire obsolete hardware securely.',
    scope: 'Encompasses all corporate laptops, desktops, servers, network switches, and licensed software installations.',
    responsibilities: 'IT Asset Specialist: Hardware inventory tagging and physical audits; Systems Administrator: Centralized patch deployment and endpoint compliance; IT Director: Technology refresh capital planning.',
    requiredResources: 'Asset management database, centralized patch management engine (WSUS / Jamf / Intune), barcode asset tag scanner, certified drive degausser.',
    procedureDetails: '1. Asset Ingestion & Tagging: Affix tamper-evident barcode asset tag to all new hardware; record serial number, MAC address, user, and PO in ITAM database.\n2. Standard Golden Image Deployment: Image all endpoints with standardized operating system build, endpoint security agent, full-disk encryption (BitLocker/FileVault), and standard office suite.\n3. Patch Management Schedule: Deploy operating system and security patches monthly ("Patch Tuesday"); critical zero-day vulnerabilities patched within 48 hours.\n4. Patch Testing & Rollout: Test patches on staging pilot group for 3 days; roll out to 100% of production fleet over subsequent 7 days.\n5. Annual Hardware Audit: Perform physical barcode verification of all deployed hardware; reconcile missing or displaced equipment.\n6. Secure Hardware Retirement: For end-of-life machines (>4 years), wipe hard drives per NIST SP 800-88 3-pass standard; obtain Certificate of Sanitization before donating or recycling.',
    safetyRisk: 'Vulnerability exposure from unpatched zero-day exploits; all internet-facing systems must meet strict patching compliance.',
    qualityChecks: '>98% patch compliance across all endpoints within 14 days of patch release; zero unrecorded assets.',
    documentationRecords: 'ITAM Hardware Inventory Registry, Monthly Patching Compliance Reports, NIST 800-88 Drive Sanitization Certificates.',
    references: 'NIST SP 800-40 Patch Management Guide, IT Asset Management Standard.'
  },

  // =========================================================================
  // 5. HEALTHCARE — 5 TOPICS
  // =========================================================================
  {
    id: 'health-patient-registration',
    departmentId: 'healthcare',
    topicName: 'Patient Registration',
    title: 'Standard Operating Procedure for Patient Intake, Identity Verification & Demographic Registration',
    description: 'Patient check-in, government identity verification, medical insurance pre-authorization, HIPAA privacy acknowledgment, and electronic medical record (EMR) creation.',
    structure: 'step-by-step',
    estimatedPages: 2,
    referencedStandards: ['HIPAA Privacy Rule (45 CFR Part 164)', 'Joint Commission Patient Identification Standards', 'Healthcare Compliance Guidelines'],
    tags: ['Healthcare', 'Patient Registration', 'HIPAA', 'EMR', 'Insurance'],
    isRegulated: true,
    purpose: 'To ensure accurate patient identification, prevent medical identity theft, secure insurance eligibility verification, and comply with medical record privacy laws.',
    scope: 'Applies to all outpatient clinics, emergency departments, inpatient admissions, and diagnostic centers.',
    responsibilities: 'Patient Access Representative: Verify identity and insurance, collect signed consent; Triage Nurse: Review medical alert flags; Patient Access Supervisor: Audit demographic data accuracy.',
    requiredResources: 'Hospital Information System (HIS / EMR), biometric palm/photo scanner, digital consent tablet, insurance eligibility clearinghouse portal.',
    procedureDetails: '1. Welcome & Initial Intake: Greet patient warmly; request valid photo ID and current medical insurance card.\n2. Patient Identity Verification: Verify two unique identifiers (Full Legal Name and Date of Birth); cross-reference against existing master patient index (MPI) to prevent duplicate records.\n3. Insurance Pre-Authorization: Run real-time digital insurance eligibility check to verify co-pay, deductible, and network authorization.\n4. Consent & Privacy Signoffs: Patient signs HIPAA Notice of Privacy Practices, Treatment Consent Form, and Financial Responsibility Agreement on digital tablet.\n5. Wristband Affixing: For inpatient and procedure patients, print and affix barcode patient wristband; verify wristband details with patient before admitting to clinical area.',
    safetyRisk: 'Wrong-patient medical errors; two-identifier verification is mandatory before issuing any clinical wristband or ordering treatments.',
    qualityChecks: 'Master Patient Index duplicate record error rate must remain below 0.5%; 100% signed HIPAA consent on file.',
    documentationRecords: 'Signed Consent for Medical Treatment, HIPAA Acknowledgment Receipt, Copy of ID and Insurance Card, Electronic Patient Face Sheet.',
    references: 'Joint Commission National Patient Safety Goals (NPSG.01.01.01), HIPAA Privacy Rule.'
  },
  {
    id: 'health-patient-assessment',
    departmentId: 'healthcare',
    topicName: 'Patient Assessment',
    title: 'Standard Operating Procedure for Clinical Patient Initial Assessment & Vital Signs Triage',
    description: 'Standard vital signs recording (BP, Pulse, Respiration, Temp, SpO2), pain scale assessment, fall risk scoring, medical history intake, and triage classification.',
    structure: 'detailed',
    estimatedPages: 3,
    referencedStandards: ['Emergency Severity Index (ESI) Triage Guidelines', 'Joint Commission Clinical Standards', 'AHA Vital Signs Benchmarks'],
    tags: ['Healthcare', 'Assessment', 'Triage', 'Vital Signs', 'Clinical'],
    isRegulated: true,
    purpose: 'To systematically evaluate patient physiological status, detect critical health deteriorations early, and prioritize clinical care according to medical urgency.',
    scope: 'Mandatory for all clinical nurses, medical assistants, and emergency intake staff across all patient care units.',
    responsibilities: 'Intake Nurse / Medical Assistant: Measure and document vital signs; Registered Nurse (RN): Conduct comprehensive assessment, fall risk, and allergy screening; Attending Physician: Review findings and formulate treatment plan.',
    requiredResources: 'Calibrated vital signs monitor (NIBP, SpO2 probe, infrared thermometer), adult/pediatric weight scale, EMR clinical intake module.',
    procedureDetails: '1. Hand Hygiene & Introduction: Perform hand sanitization; explain procedure to patient; verify patient identity using two clinical identifiers.\n2. Vital Signs Measurement: Record blood pressure with proper cuff size, pulse rate, respiratory rate, body temperature, and oxygen saturation (SpO2).\n3. Pain & Fall Risk Screening: Assess pain score using 0-10 numeric scale; complete Morse Fall Risk Assessment; apply yellow fall risk band if score >45.\n4. Allergy & Medication Reconciliation: Document all known drug, food, and environmental allergies with specific reaction history; review current medications.\n5. Clinical Triage Scoring: Assign Emergency Severity Index (ESI Level 1: Immediate resuscitation to Level 5: Non-urgent) based on vital sign thresholds.\n6. Critical Alert Escalation: If vital signs breach critical parameters (Systolic BP >180 or <90, Pulse >120, SpO2 <90%), immediately alert attending physician within 5 minutes.',
    safetyRisk: 'Failure to recognize acute clinical decompensation or missed anaphylactic drug allergy. Strict documentation mandatory.',
    qualityChecks: '100% of patient records must have complete vital signs and allergy status recorded before physician examination.',
    documentationRecords: 'Nursing Assessment Flowsheet, Allergy Reconciliation Record, Fall Risk Scoring Sheet, Physician Consultation Note.',
    references: 'Emergency Nurses Association Triage Standards, Joint Commission Comprehensive Accreditation Manual for Hospitals.'
  },
  {
    id: 'health-infection-control',
    departmentId: 'healthcare',
    topicName: 'Infection Control',
    title: 'Standard Operating Procedure for Healthcare Infection Prevention, PPE & Hand Hygiene',
    description: 'WHO 5 Moments for Hand Hygiene, Standard and Transmission-Based Precautions (Contact, Droplet, Airborne), PPE donning/doffing, and biomedical disinfection.',
    structure: 'checklist',
    estimatedPages: 3,
    referencedStandards: ['CDC Guidelines for Isolation Precautions', 'WHO Hand Hygiene in Healthcare', 'OSHA Bloodborne Pathogens Standard (29 CFR 1910.1030)'],
    tags: ['Healthcare', 'Infection Control', 'PPE', 'Hand Hygiene', 'CDC', 'Sanitization'],
    isRegulated: true,
    purpose: 'To eliminate healthcare-associated infections (HAIs), protect vulnerable patients and medical staff, and ensure rigorous biohazard safety.',
    scope: 'Mandatory for all medical doctors, nurses, technicians, housekeepers, and visitors throughout all healthcare facility zones.',
    responsibilities: 'All Healthcare Personnel: Strict adherence to hand hygiene and PPE protocols; Infection Control Nurse: Surveillance audits, outbreak investigations, and staff training; Environmental Services: Biohazard cleaning and terminal disinfection.',
    requiredResources: 'Hospital-grade alcohol rub dispensers, sterile and non-sterile gloves, N95 respirators, fluid-resistant surgical gowns, face shields, biohazard sharps disposal bins.',
    procedureDetails: '1. Hand Hygiene Protocol: Perform hand hygiene per WHO 5 Moments: Before touching patient, before clean/aseptic procedure, after body fluid exposure risk, after touching patient, and after touching patient surroundings.\n2. Standard Precautions Application: Treat all blood, body fluids, secretions, and non-intact skin as potentially infectious for every patient.\n3. PPE Donning Sequence: Prior to entering isolation room, don gown, mask/N95 respirator, eye protection/face shield, and gloves in strict sequential order.\n4. Safe Care Execution: Minimize touching surfaces; dispose of needles and sharps immediately into puncture-resistant sharps container without recapping.\n5. PPE Doffing Sequence: Inside anteroom, remove gloves and gown avoiding self-contamination; perform hand hygiene; exit room and remove respirator; re-sanitize hands.\n6. Terminal Room Cleaning: For discharged infectious patients, environmental services performs certified terminal disinfection with ultraviolet-C or hydrogen peroxide misting.',
    safetyRisk: 'Transmission of deadly pathogens (MRSA, C. Difficile, Tuberculosis, Bloodborne Viruses). Zero tolerance for PPE protocol breaches.',
    qualityChecks: 'Minimum 95% compliance rate on monthly unannounced hand hygiene audits conducted by Infection Control officers.',
    documentationRecords: 'Hand Hygiene Surveillance Audits, Sharps Injury Log, Terminal Cleaning Checklists, Annual Staff Infection Control Training Logs.',
    references: 'CDC Core Infection Prevention and Control Practices, OSHA 1910.1030 Standard.'
  },
  {
    id: 'health-medication-management',
    departmentId: 'healthcare',
    topicName: 'Medication Management',
    title: 'Standard Operating Procedure for Safe Medication Administration & High-Alert Drug Verification',
    description: 'The 5 Rights of Medication Administration, double-verification for high-alert drugs (Insulin, Heparin, Narcotics), bar-code scanning, and adverse drug reaction reporting.',
    structure: 'step-by-step',
    estimatedPages: 3,
    referencedStandards: ['ISMP High-Alert Medication Guidelines', 'Joint Commission Medication Management Standards', 'FDA Safe Medication Practices'],
    tags: ['Healthcare', 'Medication', 'Pharmacy', 'Nursing', 'Patient Safety'],
    isRegulated: true,
    purpose: 'To ensure absolute precision in pharmaceutical dispensing and administration, eliminating medication errors and adverse drug events.',
    scope: 'All pharmacy dispensaries, inpatient nursing stations, ICU units, and emergency medication administration areas.',
    responsibilities: 'Prescribing Physician: Enter complete computerized order (drug, dose, route, frequency); Clinical Pharmacist: Review order for interactions and verify dose; Administering Nurse: Perform 5 Rights and bedside barcode verification.',
    requiredResources: 'Bar Code Medication Administration (BCMA) scanners, automated dispensing cabinets (Pyxis/Omnicell), smart infusion pumps.',
    procedureDetails: '1. Medication Order Verification: Clinical pharmacist reviews computerized physician order against patient allergies, renal function, and drug-drug interactions.\n2. The 5 Rights Verification: Administering nurse verifies: Right Patient, Right Drug, Right Dose, Right Route, and Right Time against the electronic MAR (eMAR).\n3. High-Alert Independent Double-Check: For high-alert medications (chemotherapy, insulin, heparin infusions, opioids), two licensed nurses independently calculate and verify dose and pump settings.\n4. Bedside Barcode Scanning: Scan patient wristband barcode to confirm identity; scan medication packaging barcode to confirm exact drug match.\n5. Administration & Monitoring: Administer medication; observe patient for immediate adverse reactions; record exact time and administration notes in eMAR.\n6. Adverse Reaction Response: In the event of adverse drug reaction (ADR), immediately stop infusion, alert physician, administer emergency antidote, and file MedWatch / ADR incident report.',
    safetyRisk: 'Fatal medication overdose or lethal allergic reaction. Independent double-check is non-negotiable for high-alert drugs.',
    qualityChecks: '100% bedside barcode scan rate prior to drug administration; zero unverified high-alert administrations.',
    documentationRecords: 'Electronic Medication Administration Record (eMAR), High-Alert Dual Sign-off Logs, Adverse Drug Reaction Reports (ADR).',
    references: 'Institute for Safe Medication Practices (ISMP), Joint Commission Medication Safety Goals.'
  },
  {
    id: 'health-emergency-response',
    departmentId: 'healthcare',
    topicName: 'Emergency Response',
    title: 'Standard Operating Procedure for Hospital Emergency Codes (Code Blue, Code Red & Trauma)',
    description: 'Hospital-wide emergency code activations, Rapid Response Team (RRT) deployment, crash cart readiness, advanced cardiac life support (ACLS), and post-resuscitation handover.',
    structure: 'detailed',
    estimatedPages: 3,
    referencedStandards: ['AHA ACLS / BLS Guidelines', 'Hospital Emergency Incident Command System (HEICS)', 'Joint Commission Life Safety Standards'],
    tags: ['Healthcare', 'Code Blue', 'Resuscitation', 'Emergency', 'ACLS', 'Crash Cart'],
    isRegulated: true,
    purpose: 'To provide rapid, coordinated, life-saving resuscitation and clinical intervention during acute cardiopulmonary arrests, fires, or medical crises.',
    scope: 'Covers all hospital wards, diagnostic imaging suites, outpatient corridors, cafeterias, and parking facilities.',
    responsibilities: 'First Responder: Initiate CPR and activate emergency code; Code Blue Team Leader: Direct ACLS resuscitation protocol; Resuscitation Recorder: Document timeline, medications, and defibrillation shocks; Nursing Supervisor: Crowd control and ICU bed arrangement.',
    requiredResources: 'Code Blue Crash Cart (defibrillator/monitor, airway tray, emergency drugs: Epinephrine, Amiodarone), suction unit, oxygen reservoir bag.',
    procedureDetails: '1. Recognition & Code Activation: Verify unresponsiveness and lack of normal breathing; press Code Blue wall button and shout for assistance; switchboard broadcasts overhead announcement.\n2. Immediate BLS Initiation: First responder begins high-quality chest compressions (100-120 bpm, 2-2.5 inches depth) and positions bag-valve-mask with 100% oxygen.\n3. Crash Cart Arrival: Bring crash cart to bedside within 2 minutes; power on defibrillator; apply adult defibrillation pads to patient bare chest.\n4. Rhythm Analysis & Shock: Defibrillator analyzes rhythm; if VF/pVT, clear team and deliver shock; immediately resume CPR for 2 minutes.\n5. Advanced Airway & IV Access: Anesthesiologist/physician intubates patient with endotracheal tube; nurse establishes IV/IO line and administers emergency ACLS medications.\n6. Post-Resuscitation Care: Upon Return of Spontaneous Circulation (ROSC), stabilize blood pressure, obtain 12-lead ECG, initiate targeted temperature management, and transfer to ICU.',
    safetyRisk: 'Brain death occurs within 4-6 minutes of cardiac arrest; rapid team assembly (<3 minutes) is vital to patient survival.',
    qualityChecks: 'Daily crash cart seal check and weekly defibrillator battery self-test logged with 100% compliance.',
    documentationRecords: 'Code Blue Resuscitation Flowsheet, Defibrillator ECG Rhythm Strips, Daily Crash Cart Inspection Checklists.',
    references: 'American Heart Association (AHA) CPR & ECC Guidelines, Joint Commission Emergency Management Standards.'
  },

  // =========================================================================
  // 6. MANUFACTURING — 5 TOPICS
  // =========================================================================
  {
    id: 'mfg-raw-material-inspection',
    departmentId: 'manufacturing',
    topicName: 'Raw Material Inspection',
    title: 'Standard Operating Procedure for Incoming Raw Material Receiving, Sampling & Acceptance Testing',
    description: 'Supplier Certificate of Analysis (CoA) verification, statistical AQL sampling, quarantine tagging, physical/chemical laboratory testing, and lot release.',
    structure: 'table',
    estimatedPages: 3,
    referencedStandards: ['ISO 9001:2015 Clause 8.4', 'ANSI/ASQ Z1.4 Sampling Standards', 'cGMP 21 CFR Part 211.84'],
    tags: ['Manufacturing', 'Raw Materials', 'Inspection', 'Sampling', 'AQL', 'Quality'],
    isRegulated: true,
    purpose: 'To ensure only verified, certified, and defect-free raw materials and sub-components enter the production stream, preventing manufacturing defects and batch recalls.',
    scope: 'All incoming raw materials, chemicals, packaging components, and sub-assemblies delivered to plant receiving docks.',
    responsibilities: 'Receiving Inspector: Verify documentation and apply quarantine tags; QC Lab Analyst: Conduct laboratory tests and dimensional checks; Quality Manager: Review results and execute final release in ERP.',
    requiredResources: 'Sampling booths, calibrated micrometers/calipers, laboratory testing apparatus, yellow Quarantine and green Approved adhesive tags.',
    procedureDetails: '1. Delivery Verification: Verify delivery manifest against approved Purchase Order (PO); check vendor Certificate of Analysis (CoA) for all specifications.\n2. Physical Integrity Check: Inspect shipping containers for moisture damage, puncture, seal tampering, pest infestation, or chemical leaks.\n3. Quarantine Segregation: Affix yellow "QUARANTINE - DO NOT USE" tags to all delivered pallets and move to locked quarantine holding bay.\n4. Representative Sampling: Draw representative samples per ANSI/ASQ Z1.4 Normal Level II sampling tables using clean, sanitized sampling tools.\n5. Laboratory Testing: Test sample against raw material specification sheet: dimensions, moisture content, tensile strength, purity, or chemical composition.\n6. Release or Rejection: If all parameters pass, apply green "APPROVED" label and unlock inventory in ERP; if off-spec, apply red "REJECTED" tag and issue non-conformance report.',
    safetyRisk: 'Chemical exposure or physical injury during container opening and sampling. Appropriate PPE (gloves, goggles, steel-toed boots) mandatory.',
    qualityChecks: '100% CoA verification on critical raw materials; zero usage of materials without active green Approved QA status.',
    documentationRecords: 'Raw Material Receiving Inspection Reports, Analytical Lab Test Logs, Vendor CoAs, Material Discrepancy Reports (MDR).',
    references: 'ISO 9001:2015 Quality Management Systems, Plant Quality Manual.'
  },
  {
    id: 'mfg-machine-operation',
    departmentId: 'manufacturing',
    topicName: 'Machine Operation',
    title: 'Standard Operating Procedure for Production Machinery Setup, Calibration & Safe Operation',
    description: 'Pre-operational machine checklists, safety interlock verification, recipe parameter entry, machine startup, in-run monitoring, and controlled shutdown.',
    structure: 'step-by-step',
    estimatedPages: 3,
    referencedStandards: ['OSHA Machine Guarding (29 CFR 1910.212)', 'ISO 12100 (Machinery Safety)', 'CE Machinery Directive'],
    tags: ['Manufacturing', 'Machinery', 'Production', 'Safety', 'Operations'],
    isRegulated: true,
    purpose: 'To standardize machine setup, maintain operator safety, prevent mechanical damage, and ensure uniform manufacturing quality across all production shifts.',
    scope: 'Applicable to all operators of automated assembly, stamping, cutting, molding, and packaging machinery.',
    responsibilities: 'Certified Machine Operator: Pre-start inspection and safe operation; Shift Supervisor: Validate machine recipe settings; Maintenance Technician: Respond to mechanical faults.',
    requiredResources: 'Machine Human-Machine Interface (HMI), calibrated measuring gauges, machine safety keys, mandated PPE (hearing protection, eye protection).',
    procedureDetails: '1. Pre-Start Safety Inspection: Inspect machine guards, emergency stop buttons, light curtains, and safety interlocks to confirm 100% operational readiness.\n2. Tooling & Die Setup: Install authorized tooling per job order; torque all locking bolts to manufacturer specifications using calibrated torque wrench.\n3. Parameter Configuration: Load authorized production recipe from HMI library; verify temperature, pressure, feed rate, and speed parameters.\n4. First-Piece Trial Run: Run single test piece; measure critical tolerances against engineering drawing; obtain supervisor sign-off before full run.\n5. Continuous In-Run Monitoring: Monitor operating gauges hourly (hydraulic pressure, motor temperature, vibration); immediately stop machine if abnormal noise occurs.\n6. Shift-End Controlled Shutdown: Complete current production cycle, disengage drives, clean tooling, clear scrap, and execute formal shift-handover log.',
    safetyRisk: 'Severe amputation, pinch, or crushing hazard from rotating machinery. Operating with bypassed guards results in immediate disciplinary dismissal.',
    qualityChecks: 'First-piece inspection approval mandatory prior to starting continuous production run.',
    documentationRecords: 'Machine Daily Startup Checklists, First-Piece Approval Forms, Shift Production Logbooks, Machine Alarm Event Logs.',
    references: 'OSHA 1910.212 Machine Guarding, Machine Manufacturer Operations Manual.'
  },
  {
    id: 'mfg-production-control',
    departmentId: 'manufacturing',
    topicName: 'Production Control',
    title: 'Standard Operating Procedure for Production Scheduling, Batch Tracking & Yield Control',
    description: 'Work order routing, batch manufacturing records (BMR), cycle time monitoring, overall equipment effectiveness (OEE), and scrap reconciliation.',
    structure: 'table',
    estimatedPages: 3,
    referencedStandards: ['ISO 9001 Clause 8.5 (Production Control)', 'APICS Production & Inventory Management', 'Lean Manufacturing 5S Principles'],
    tags: ['Manufacturing', 'Production Control', 'BMR', 'OEE', 'Batch Tracking', 'Yield'],
    isRegulated: false,
    purpose: 'To optimize plant manufacturing flow, achieve on-time delivery schedules, minimize scrap and work-in-progress (WIP), and maintain traceability.',
    scope: 'All manufacturing work centers, assembly lines, finishing bays, and packaging departments.',
    responsibilities: 'Production Planner: Generate and sequence master production schedule; Line Supervisor: Execute production orders and maintain shift output; Plant Manager: Review weekly throughput and OEE metrics.',
    requiredResources: 'Manufacturing Execution System (MES / ERP), digital barcode scanners, electronic batch records, line productivity displays.',
    procedureDetails: '1. Production Order Release: Production planner releases approved Work Order with BOM, engineering drawing, and target completion schedule to production floor.\n2. Line Clearance Verification: Verify previous order components, labels, and scrap are completely cleared from the line before staging new materials.\n3. Batch Record Initiation: Issue unique Batch Manufacturing Record (BMR); scan raw material lot numbers to establish forward and backward traceability.\n4. Production Progress Tracking: Record hourly unit output on line tracking board; log downtime reasons (machine breakdown, material shortage, changeover).\n5. Yield & Scrap Reconciliation: Count finished goods, defective scrap, and remaining raw materials; calculate production yield percentage (Target >98.5%).\n6. Finished Goods Transfer: Scan approved batch units and transfer to finished goods warehouse with signed transfer challan.',
    safetyRisk: 'Material handling strain and ergonomic repetitive motion injuries; rotate operators across tasks every 2 hours.',
    qualityChecks: '100% material traceability from raw ingredient batch codes through finished product serial numbers.',
    documentationRecords: 'Work Orders, Batch Manufacturing Records (BMR), Daily Production Logs, Material Transfer Notes, Monthly OEE Reports.',
    references: 'APICS CPIM Guidelines, Corporate Production Control Policy.'
  },
  {
    id: 'mfg-quality-inspection',
    departmentId: 'manufacturing',
    topicName: 'Quality Inspection',
    title: 'Standard Operating Procedure for In-Process & Final Finished Goods Quality Inspection',
    description: 'Statistical process control (SPC), dimensional tolerance verification, visual defect classification, packaging integrity, and release stamping.',
    structure: 'step-by-step',
    estimatedPages: 3,
    referencedStandards: ['ISO 9001:2015 Clause 8.6', 'ASTM International Testing Standards', 'Military Standard MIL-STD-105E'],
    tags: ['Manufacturing', 'Inspection', 'SPC', 'Tolerance', 'Quality Control', 'Defects'],
    isRegulated: true,
    purpose: 'To intercept manufacturing deviations during processing and ensure only 100% compliant, defect-free finished products are packaged and shipped.',
    scope: 'Covers in-process inspection stations across all production lines and final end-of-line quality release gates.',
    responsibilities: 'In-Process QA Inspector: Hourly sampling and measurement; Final QC Inspector: End-of-line packaging and aesthetic verification; Quality Manager: Final batch certificate issuance.',
    requiredResources: 'Coordinate Measuring Machine (CMM), optical comparators, digital drop indicators, calibrated go/no-go plug gauges, inspection lighting booths.',
    procedureDetails: '1. In-Process Sampling Frequency: Pull 5 consecutive parts from each machine every 60 minutes for statistical process control (SPC) inspection.\n2. Dimensional Measurement: Measure critical features against blueprint tolerances using calibrated micrometers or CMM; plot measurements on X-bar and R charts.\n3. Visual Defect Inspection: Inspect surfaces under 1000-lux inspection lighting for scratches, burrs, flash, discoloration, or weld porosity.\n4. Non-Conformance Containment: If a single critical defect is detected, immediately halt production line, quarantine all units produced since last passing check, and alert supervisor.\n5. Final Packaging & Label Inspection: Verify correct product label, bar code legibility, carton count, and tamper seal integrity on finished boxes.\n6. Quality Release Stamp: Affix official Quality Passed stamp to batch traveler document and release pallet for warehouse storage.',
    safetyRisk: 'Eye hazards from sharp edges or metal filings during part handling; protective cut-resistant gloves and safety eyewear mandatory.',
    qualityChecks: 'Process capability index Cpk must exceed 1.33 on all critical-to-quality (CTQ) dimensions.',
    documentationRecords: 'In-Process Inspection Sheets, SPC Control Charts, Final Quality Release Certificates, Non-Conformance Reports (NCR).',
    references: 'ISO 9001:2015 Quality Management Standards, AIAG Statistical Process Control (SPC) Manual.'
  },
  {
    id: 'mfg-equipment-maintenance',
    departmentId: 'manufacturing',
    topicName: 'Equipment Maintenance',
    title: 'Standard Operating Procedure for Preventive Maintenance (PM) & Total Productive Maintenance (TPM)',
    description: 'Scheduled machine servicing, autonomous operator cleaning and lubrication, vibration analysis, spare parts replenishment, and downtime minimization.',
    structure: 'table',
    estimatedPages: 3,
    referencedStandards: ['ISO 55001 (Asset Management)', 'Total Productive Maintenance (TPM) Methodology', 'OSHA 1910.147 Control of Hazardous Energy'],
    tags: ['Manufacturing', 'Maintenance', 'TPM', 'Preventive Maintenance', 'CMMS', 'OEE'],
    isRegulated: true,
    purpose: 'To eliminate catastrophic machine breakdowns, prolong equipment operational lifespans, preserve precision tolerances, and minimize production downtime.',
    scope: 'All fixed production equipment, conveyor systems, motors, gearboxes, pneumatic compressors, and hydraulic power units.',
    responsibilities: 'Machine Operator: Daily Autonomous Maintenance (Clean, Lubricate, Inspect); Maintenance Technician: Execute scheduled weekly/monthly PM work orders; Maintenance Supervisor: Oversee CMMS scheduling and spare parts inventory.',
    requiredResources: 'Computerized Maintenance Management System (CMMS), lubrication pumps, vibration pen analyzers, torque wrenches, Lockout/Tagout (LOTO) kits.',
    procedureDetails: '1. Autonomous Daily Maintenance (TPM Step 1): Operator cleans equipment at start of shift, inspects fluid levels, tightens loose fasteners, and listens for unusual noises.\n2. Work Order Generation: CMMS automatically triggers PM work orders based on running hours or calendar intervals (Weekly, Monthly, Quarterly, Annual).\n3. Pre-Maintenance Isolation (LOTO): Apply Lockout/Tagout padlocks and tags to all electrical disconnects and bleed hydraulic/pneumatic pressure prior to servicing.\n4. PM Task Execution: Replace worn drive belts, clean/replace air and oil filters, grease bearings per lubrication schedule, check motor alignment, and inspect electrical contacts.\n5. Post-Maintenance Functional Testing: Remove locks, power on machine, execute 10-minute dry run without stock, and verify temperature and vibration readings.\n6. CMMS Work Order Closeout: Record technician labor hours, replaced spare parts, and mechanical findings in CMMS to update equipment history.',
    safetyRisk: 'Severe electrocution or mechanical entrapment during servicing; strict mandatory compliance with OSHA 1910.147 LOTO protocols.',
    qualityChecks: '100% on-time completion of critical preventive maintenance work orders within designated grace period (±2 days).',
    documentationRecords: 'CMMS Work Order Records, Equipment Service History Logs, Oil Analysis Reports, Lockout/Tagout Execution Slips.',
    references: 'ISO 55001 Asset Management Standards, Plant Total Productive Maintenance Policy.'
  }
];

import { ALL_REMAINING_TOPICS } from './allDepartmentTopics';
import { EXTENDED_DEPARTMENT_TOPICS } from './departmentTopicsExtended';
import { FINAL_DEPARTMENT_TOPICS } from './departmentTopicsFinal';

// Helper functions for easy querying
export function getTopicsForDepartment(deptId: SOPCategory): DepartmentTopic[] {
  // Normalize aliases
  let targetId = deptId;
  if (deptId === 'office') targetId = 'administration';
  if (deptId === 'quality') targetId = 'qc';
  if (deptId === 'safety') targetId = 'security';
  if (deptId === 'food-service') targetId = 'food-safety';

  const allTopics = [
    ...DEPARTMENT_TOPICS,
    ...ALL_REMAINING_TOPICS,
    ...EXTENDED_DEPARTMENT_TOPICS,
    ...FINAL_DEPARTMENT_TOPICS,
  ];

  const matches = allTopics.filter((t) => t.departmentId === targetId);
  if (matches.length > 0) return matches;

  // Fallback to direct matches or all topics
  return allTopics.filter((t) => t.departmentId === deptId);
}

export function getTopicById(id: string): DepartmentTopic | undefined {
  const allTopics = [
    ...DEPARTMENT_TOPICS,
    ...ALL_REMAINING_TOPICS,
    ...EXTENDED_DEPARTMENT_TOPICS,
    ...FINAL_DEPARTMENT_TOPICS,
  ];
  return allTopics.find((t) => t.id === id);
}

// Backward-compatible aliases
export const DEPARTMENT_TEMPLATES = [
  ...DEPARTMENT_TOPICS,
  ...ALL_REMAINING_TOPICS,
  ...EXTENDED_DEPARTMENT_TOPICS,
  ...FINAL_DEPARTMENT_TOPICS,
];
export const getTemplatesForDepartment = getTopicsForDepartment;
export const getTemplateById = getTopicById;
