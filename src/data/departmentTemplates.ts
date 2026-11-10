import type { SOPCategory, SOPStructure } from '../types/sop';

export interface DepartmentTemplate {
  id: string;
  departmentId: SOPCategory;
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
  procedureDetails: string;
  safetyRisk?: string;
}

export const STANDARDS_DISCLAIMER = 
  'Notice: Standards references (such as ISO, OSHA, WHO, PSQCA, SECP, EPA, FBR, and PPRA) are provided as architectural and compliance structuring guidelines based on prevailing industry frameworks. Final SOP documents must be reviewed and officially authorized by your designated compliance officer, legal counsel, or certified quality manager prior to organizational adoption.';

export const DEPARTMENT_TEMPLATES: DepartmentTemplate[] = [
  // ==========================================
  // WAREHOUSE MANAGEMENT (Category: warehouse)
  // ==========================================
  {
    id: 'wh-inbound-inspection',
    departmentId: 'warehouse',
    title: 'Inbound Receiving, Inspection & Barcode Logging Protocol',
    description: 'Systematic receipt verification of incoming freight, physical inspection, PO matching, and WMS inventory barcode tagging.',
    structure: 'table',
    estimatedPages: 3,
    referencedStandards: ['ISO 9001:2015 Clause 8.5', 'GS1 General Specifications', 'OSHA 1910.176'],
    tags: ['Receiving', 'Inventory', 'Inspection', 'Barcode'],
    isRegulated: true,
    purpose: 'To ensure all incoming goods, raw materials, and components are verified against purchase orders, inspected for transit damage, and registered into the WMS within 2 hours of dock arrival.',
    scope: 'Applies to all inbound shipments arriving at dock receiving bays 1 through 6 across all warehouse shifts.',
    responsibilities: 'Receiving Dock Clerk: Unload and visually inspect; QA Inspector: Sampling and tolerance checks; Inventory Controller: WMS barcode scanning and lot assignment.',
    procedureDetails: '1. Dock Gate Verification: Verify carrier delivery note against active Purchase Order in ERP.\n2. Visual Damage Assessment: Inspect pallets for crushing, tilt, moisture damage, or broken tamper seals.\n3. Discrepancy Reporting: Log any quantity mismatch exceeding ±0% immediately in Over, Short, & Damaged (OS&D) register.\n4. Barcode Tagging: Generate and apply GS1-128 pallet labels with Lot Number, SKU, and Expiry.\n5. WMS Slot Allocation: Transfer pallets to staging zone and confirm location put-away in RF handheld terminal.',
    safetyRisk: 'Pinch hazards during pallet handling; proper PPE (high-visibility vest, steel-toe footwear, cut-resistant gloves) is strictly mandatory.'
  },
  {
    id: 'wh-cycle-counting',
    departmentId: 'warehouse',
    title: 'Perpetual Cycle Counting & Inventory Reconciliation SOP',
    description: 'ABC inventory classification cycle counting schedules, variance investigation, and reconciliation without full operational shutdown.',
    structure: 'step-by-step',
    estimatedPages: 2,
    referencedStandards: ['GAAP / IFRS Inventory Valuation', 'ISO 9001:2015 Clause 8.5.2', 'FBR Rule 112 (Asset Register)'],
    tags: ['Cycle Count', 'Audit', 'Inventory', 'Finance'],
    isRegulated: false,
    purpose: 'To maintain warehouse inventory record accuracy above 99.2% through continuous ABC-frequency cycle counts without halting shipping activities.',
    scope: 'Covers all active storage locations including high-bay pallet racking, bulk floor storage, and cold room zones.',
    responsibilities: 'Inventory Control Lead: Daily count plan generation; Dedicated Cycle Counter: Blind physical inventory counting; Financial Controller: Variance sign-off exceeding $500 threshold.',
    procedureDetails: '1. Count List Generation: Daily ERP automated count generation prioritizing Class A (bi-weekly), Class B (monthly), Class C (quarterly).\n2. Blind Physical Count: Cycle counters record quantities on RF guns without seeing theoretical system on-hand balances.\n3. First Variance Recount: Any location with difference between system and physical count is automatically flagged for an immediate blind second count by a different counter.\n4. Root Cause Analysis: Variances categorized into mis-pick, damaged unreported, transposition, or theft.\n5. Adjustments & Approvals: Adjustments posted in ERP within 24 hours of variance resolution with documented justification.',
  },
  {
    id: 'wh-forklift-safety',
    departmentId: 'warehouse',
    title: 'Powered Industrial Forklift Operation & Pre-Shift Inspection',
    description: 'Mandatory daily pre-operation forklift inspection checklists, battery charging guidelines, and operational safety speeds.',
    structure: 'checklist',
    estimatedPages: 2,
    referencedStandards: ['OSHA 29 CFR 1910.178', 'ANSI/ITSDF B56.1', 'Factories Act (Pakistan) Sec 33'],
    tags: ['Forklift', 'Safety', 'EHS', 'Equipment'],
    isRegulated: true,
    purpose: 'To eliminate industrial vehicle accidents, protect pedestrians, and ensure all powered industrial trucks operate in safe mechanical condition.',
    scope: 'Mandatory for all operators of counterbalance forklifts, reach trucks, and electric pallet jacks in all facilities.',
    responsibilities: 'Certified Forklift Operator: Pre-shift checklist completion and safe driving; EHS Officer: Audit logs and operator credential verification; Maintenance Supervisor: Immediate lockout/tagout of malfunctioning trucks.',
    procedureDetails: '1. Pre-Operational Walkaround: Check tire condition, hydraulic fluid leaks, fork cracks, and mast chains.\n2. Operational Checks: Verify horn, reverse beeper, flashing beacon, service brakes, and hydraulic lift controls.\n3. Speed Restrictions: Maximum 8 km/h in primary transit aisles; 3 km/h around pedestrian crosswalks and blind intersections.\n4. Load Handling: Never carry loads exceeding rated mast capacity; keep mast tilted back and forks 10-15 cm off floor during transit.\n5. Parking Procedure: Lower forks flush to floor, neutralize gears, set parking brake, and remove key.',
    safetyRisk: 'Crush hazard, rollover risk, and pedestrian collision. Zero tolerance for uncertified operation or mobile phone use while driving.'
  },
  {
    id: 'wh-cold-chain',
    departmentId: 'warehouse',
    title: 'Cold Storage Temperature Monitoring & Excursion Response',
    description: 'Cold room management, 24/7 digital temperature logging, calibrated backup generators, and temperature excursion protocols.',
    structure: 'detailed',
    estimatedPages: 3,
    referencedStandards: ['WHO TRS 961 Annex 9', 'GDP (Good Distribution Practice)', 'DRAP Cold Chain Guidelines'],
    tags: ['Cold Storage', 'Pharma', 'Temperature', 'Quality'],
    isRegulated: true,
    purpose: 'To maintain strictly controlled temperature zones (2°C to 8°C and -20°C) for temperature-sensitive pharmaceuticals and perishable food goods.',
    scope: 'Encompasses all refrigerated rooms, deep freezers, temperature loggers, and refrigerated loading docks.',
    responsibilities: 'Cold Chain Supervisor: Daily manual cross-verification of digital loggers; QA Specialist: Temperature excursion investigation; Facilities Engineer: HVAC & generator maintenance.',
    procedureDetails: '1. Continuous Digital Monitoring: Calibrated IoT probes measure temperature every 5 minutes with automated SMS/email alerts.\n2. Manual Verification: Twice-daily physical check of external digital gauges logged into signed logbooks.\n3. Excursion Alert Thresholds: Warning alert at 7.0°C; critical alarm at 8.0°C sustained for >15 minutes.\n4. Immediate Containment: Upon critical alarm, switch to redundant cooling unit; if unresolved within 30 minutes, initiate transfer to secondary validated cold chamber.\n5. Product Quarantine: All affected batches quarantined until QA completes stability risk assessment.',
    safetyRisk: 'Thermal burn / frostbite risk; thermal outerwear mandatory when entering -20°C freezers; emergency interior door release tested monthly.'
  },

  // ==========================================
  // MANUFACTURING & OPERATIONS (Category: manufacturing)
  // ==========================================
  {
    id: 'mfg-line-clearance',
    departmentId: 'manufacturing',
    title: 'Production Line Clearance, Changeover & Batch Setup',
    description: 'Formal line clearance protocol to prevent cross-contamination, packaging mix-ups, and leftover materials between production runs.',
    structure: 'iso-9001',
    estimatedPages: 3,
    referencedStandards: ['ISO 9001:2015 Clause 8.5.1', 'cGMP 21 CFR Part 211.130', 'PSQCA Packaging Standards'],
    tags: ['Line Clearance', 'Changeover', 'cGMP', 'Production'],
    isRegulated: true,
    purpose: 'To ensure 100% removal of all prior batch materials, labels, packaging, and contaminants from the production line prior to starting a new product run.',
    scope: 'Applicable across all manufacturing, packaging, and bottling lines prior to initiating any new production order.',
    responsibilities: 'Production Line Operator: Physical cleaning and clearing; Production Supervisor: First-line clearance verification; QA Inspector: Independent second-line clearance authorization.',
    procedureDetails: '1. Prior Run Clear-Out: Remove all raw materials, WIP items, rejects, and packaging labels belonging to previous batch.\n2. Sanitation & Cleaning: Sanitize contact surfaces with approved disinfectant; record sanitation cycle time and operator badge ID.\n3. Equipment Tooling: Swap dies/tooling as per production recipe specifications; torque check all locking fasteners.\n4. Documentation Reconciliation: Verify reconciliation percentage of previous batch labels before issuing new batch record.\n5. Two-Person Sign-Off: Supervisor and QA Inspector physically walk the line and sign Line Clearance Certificate before power-on.',
  },
  {
    id: 'mfg-lockout-tagout',
    departmentId: 'manufacturing',
    title: 'Hazardous Energy Control (Lockout / Tagout — LOTO) Procedure',
    description: 'Comprehensive electrical, pneumatic, and hydraulic hazardous energy isolation protocols during machine servicing and maintenance.',
    structure: 'detailed',
    estimatedPages: 3,
    referencedStandards: ['OSHA 29 CFR 1910.147', 'ISO 45001:2018 Clause 8.1', 'Pakistan Factories Act Sec 26'],
    tags: ['LOTO', 'Safety', 'Maintenance', 'Electrical'],
    isRegulated: true,
    purpose: 'To protect maintenance personnel and operators from the unexpected energization or startup of machinery, or release of stored energy during servicing.',
    scope: 'Mandatory on all fixed and portable production machinery requiring maintenance, tooling adjustment, or unjamming.',
    responsibilities: 'Authorized Maintenance Tech: Lock attachment and zero-energy verification; Machine Operator: Notify affected personnel; Plant EHS Manager: Annual LOTO procedure audit.',
    procedureDetails: '1. Preparation for Shutdown: Identify all energy sources (electrical, pneumatic, hydraulic, gravity, spring tension).\n2. Machine Notification: Alert affected line operators that machine will be isolated and locked out.\n3. Machine Shutdown: Execute normal stop sequence.\n4. Energy Isolation: Disconnect circuit breakers, close pneumatic valves, bleed hydraulic accumulators, and apply mechanical chocks.\n5. Lock & Tag Application: Apply standardized red safety padlock with personal danger tag identifying worker and contact number.\n6. Zero Energy State Verification: Attempt normal start controls to confirm complete isolation; verify zero voltage using calibrated multimeter.',
    safetyRisk: 'Severe electrocution, crushing, amputation, or fatal hazard if energy control is violated. Zero tolerance protocol.'
  },
  {
    id: 'mfg-preventive-maintenance',
    departmentId: 'manufacturing',
    title: 'Preventive Maintenance Scheduling & Calibration Protocol',
    description: 'Scheduled maintenance work orders, machine calibration standards, lubrication logs, and downtime reduction controls.',
    structure: 'table',
    estimatedPages: 3,
    referencedStandards: ['ISO 9001:2015 Clause 7.1.5', 'TPM (Total Productive Maintenance)', 'PSQCA Metrology Regulations'],
    tags: ['Maintenance', 'Calibration', 'Equipment', 'Uptime'],
    isRegulated: false,
    purpose: 'To maximize Overall Equipment Effectiveness (OEE > 88%), prevent unplanned breakdowns, and ensure instrument measuring accuracy.',
    scope: 'Covers all production machinery, sensors, load cells, temperature gauges, and automated conveyor systems.',
    responsibilities: 'Maintenance Planner: CMMS work order generation; Maintenance Technician: PM execution and oil sampling; QA Calibration Lead: NIST/PSQCA-traceable calibration verification.',
    procedureDetails: '1. CMMS Schedule Trigger: Work orders automatically issued based on running hours or calendar frequency (weekly, monthly, quarterly).\n2. Pre-Maintenance Safety: Complete LOTO and obtain maintenance work permit from shift supervisor.\n3. Mechanical Service: Inspect belts, chains, sprockets, bearings; apply certified lubricants per manufacturer grade.\n4. Calibration Verification: Test measuring sensors against certified reference weights/probes; record calibration deviation.\n5. Post-Service Trial Run: Run machine for 15 minutes at 50% speed; inspect vibration, temperature, and noise before handoff.',
  },
  {
    id: 'mfg-nonconforming-material',
    departmentId: 'manufacturing',
    title: 'Control of Non-Conforming Raw Materials & Finished Goods',
    description: 'Immediate quarantine, tagging, root cause investigation, and disposition (scrap, rework, concession, return) workflows.',
    structure: 'raci-matrix',
    estimatedPages: 3,
    referencedStandards: ['ISO 9001:2015 Clause 8.7', 'cGMP 21 CFR 211.165', 'PSQCA Quality Framework'],
    tags: ['Quality', 'Nonconformance', 'Quarantine', 'MRB'],
    isRegulated: true,
    purpose: 'To prevent accidental use, processing, or shipment of non-conforming materials that fail specified dimensional, chemical, or aesthetic tolerances.',
    scope: 'Applicable to received raw materials, work-in-progress (WIP), and packaged finished goods.',
    responsibilities: 'Line Operator: Immediately stop process on fault; QA Technician: Apply red quarantine tape and log NCR; Material Review Board (MRB): Determine disposition.',
    procedureDetails: '1. Identification & Containment: As soon as a deviation is detected, the affected lot is halted, segregated, and labeled with high-visibility RED quarantine tags.\n2. Physical Quarantine: Move items to locked designated Quarantine Area with access restricted to QA badge holders.\n3. Non-Conformance Report (NCR): QA logs NCR in QMS within 1 hour detailing defect type, quantity, lot number, and stage.\n4. MRB Disposition Meeting: Cross-functional review determines: Scrap, Rework to Spec, Regrade, or Return to Vendor (RTV).\n5. Corrective Action (CAPA): If defect rate exceeds 1.5% lot threshold, trigger formal 5-Why root cause analysis and CAPA tracking.',
  },

  // ==========================================
  // WORKPLACE SAFETY & EHS (Category: safety)
  // ==========================================
  {
    id: 'ehs-incident-reporting',
    departmentId: 'safety',
    title: 'Workplace Incident, Near-Miss & Injury Reporting Protocol',
    description: 'Standardized notification, medical treatment coordination, initial scene preservation, and OSHA-compliant investigation within 24 hours.',
    structure: 'step-by-step',
    estimatedPages: 2,
    referencedStandards: ['OSHA 29 CFR 1904', 'ISO 45001:2018 Clause 10.2', 'Pakistan Workmen’s Compensation Act'],
    tags: ['EHS', 'Incident', 'Near-Miss', 'OSHA'],
    isRegulated: true,
    purpose: 'To ensure immediate first aid/medical care, scene preservation, root-cause investigation, and legal compliance reporting for all workplace accidents.',
    scope: 'Mandatory across all facilities, premises, company transport vehicles, and contractor work areas.',
    responsibilities: 'Injured Employee/Witness: Report immediately; Shift Supervisor: Secure scene and initiate internal report; EHS Director: Lead investigation and file statutory notices.',
    procedureDetails: '1. First Aid & Medical Priority: Provide immediate first aid; call emergency ambulance for severe trauma or chemical exposure.\n2. Scene Preservation: Cordon off incident area; prevent tampering with machinery, spills, or PPE involved in the event.\n3. Immediate Notification: Notify Plant EHS Manager within 30 minutes of occurrence.\n4. Initial Incident Form: Supervisor completes Preliminary Incident Report within 8 hours.\n5. Root Cause Investigation: Conduct multi-disciplinary investigation using Fishbone / 5-Why method within 48 hours; post corrective actions.',
    safetyRisk: 'Delayed medical attention or scene alteration carries severe statutory penalties and jeopardizes worker welfare.'
  },
  {
    id: 'ehs-emergency-evacuation',
    departmentId: 'safety',
    title: 'Facility Fire Emergency Response & Evacuation Plan',
    description: 'Alarm triggers, emergency warden assignments, assembly point headcounts, roll-call reconciliation, and drill frequencies.',
    structure: 'detailed',
    estimatedPages: 3,
    referencedStandards: ['NFPA 101 Life Safety Code', 'OSHA 1910.38', 'Civil Defence (Pakistan) Regulations'],
    tags: ['Evacuation', 'Fire Safety', 'Emergency', 'NFPA'],
    isRegulated: true,
    purpose: 'To establish orderly evacuation routes, designated warden duties, and rapid accounting for all staff, contractors, and visitors during a fire or structural crisis.',
    scope: 'All floors, office suites, production bays, warehouses, and exterior parking zones.',
    responsibilities: 'Chief Fire Warden: Direct overall evacuation and liaison with municipal fire services; Floor Wardens: Sweep designated sectors; All Staff: Immediate orderly evacuation upon audible alarm.',
    procedureDetails: '1. Alarm Trigger: Anyone discovering smoke or open flame immediately pulls nearest manual fire pull station and calls internal emergency extension.\n2. Immediate Evacuation: Stop work, leave personal belongings behind, walk (do not run) via nearest lit emergency exit stairs. Never use elevators.\n3. Warden Sector Sweeps: Floor wardens verify restrooms, meeting rooms, and isolated work zones are clear before exiting.\n4. Assembly & Headcount: Gather at designated Assembly Point Alpha or Bravo; department heads perform roll call using digital visitor/staff access log.\n5. All-Clear Protocol: No person may re-enter the facility until the Chief Fire Warden issues the official verbal All-Clear.',
  },
  {
    id: 'ehs-chemical-spill',
    departmentId: 'safety',
    title: 'Hazardous Chemical Spill Response & Containment Protocol',
    description: 'Small vs large chemical spill classification, Safety Data Sheet (SDS) referencing, spill kit deployment, neutralizers, and hazardous waste disposal.',
    structure: 'checklist',
    estimatedPages: 2,
    referencedStandards: ['OSHA 1910.120 (HAZWOPER)', 'EPA 40 CFR Part 262', 'Pakistan Environmental Protection Act (PEPA 1997)'],
    tags: ['Chemical', 'Spill Response', 'HAZWOPER', 'SDS'],
    isRegulated: true,
    purpose: 'To protect personnel, contain corrosive, toxic, or flammable chemical leaks, and prevent chemical migration into municipal sewer drains.',
    scope: 'All chemical storage lockers, mixing tanks, plating lines, and laboratory reagent dispensaries.',
    responsibilities: 'Spill Discoverer: Evacuate immediate zone and alert emergency team; HAZWOPER Certified Responder: Don Level B/C PPE and deploy absorbent socks; EHS Officer: Environmental reporting.',
    procedureDetails: '1. Identify & Assess: Check Safety Data Sheet (SDS) stored adjacent to chemical storage to determine hazards and required PPE.\n2. Cordon Area: Establish 10-meter exclusion zone; eliminate ignition sources if chemical is flammable.\n3. Containment: Deploy chemical absorbent booms/socks from spill kit around perimeter of spill to prevent spreading to storm drains.\n4. Neutralization / Absorption: Apply neutralizing agent (acid or base neutralizer) and sprinkle absorbent granules until liquid is captured.\n5. Disposal: Scoop contaminated absorbent into yellow hazardous waste drum; label with hazardous chemical waste tag and manifest for licensed hazardous waste contractor.',
    safetyRisk: 'Toxic fumes, skin chemical burns, explosive vapors. Never attempt cleanup of unknown or large (>20L) spills without breathing apparatus.'
  },

  // ==========================================
  // INFORMATION TECHNOLOGY & CYBERSECURITY (Categories: it, cybersecurity)
  // ==========================================
  {
    id: 'it-user-onboarding-deprovisioning',
    departmentId: 'it',
    title: 'Identity Access Management: Employee Provisioning & Deprovisioning',
    description: 'Role-Based Access Control (RBAC), least-privilege credential provisioning, MFA enforcement, and same-day termination de-provisioning.',
    structure: 'step-by-step',
    estimatedPages: 3,
    referencedStandards: ['ISO/IEC 27001:2022 Control 5.16 / 5.18', 'NIST SP 800-63B', 'GDPR Article 32'],
    tags: ['IAM', 'Active Directory', 'RBAC', 'Security'],
    isRegulated: true,
    purpose: 'To ensure enterprise accounts, credentials, VPN access, and SaaS seats are provisioned with least privilege upon hire, and revoked immediately upon termination.',
    scope: 'Covers Active Directory, Google Workspace, AWS/Azure IAM, corporate VPN, Slack, GitHub, and proprietary enterprise software.',
    responsibilities: 'HR People Ops: Automated ticket trigger on employee status change; IT Systems Engineer: Provision/revoke role security groups; CISO: Quarterly privileged access audit.',
    procedureDetails: '1. Onboarding Request: Automated webhook from HRIS creates IT ticket 5 days prior to start date with verified job role and manager approval.\n2. Account Provisioning: Identity generated in IDP using standard naming convention (first.last@company.com); assigned to departmental RBAC groups.\n3. MFA Enforcement: Mandatory FIDO2 / hardware token or TOTP authenticator setup on first login; SMS 2FA prohibited.\n4. Hardware Staging: BitLocker/FileVault disk encryption enforced, MDM agent installed, antivirus endpoint active before laptop handover.\n5. Deprovisioning Protocol: For voluntary exits, disable accounts at 17:00 on final day; for involuntary exits, revoke session tokens, disable IDP account, wipe remote MDM profile, and lock laptop immediately upon HR notification.',
  },
  {
    id: 'sec-incident-response',
    departmentId: 'cybersecurity',
    title: 'Cybersecurity Incident Response & Ransomware Containment',
    description: 'PICERL framework: Preparation, Identification, Containment, Eradication, Recovery, and Lessons Learned for cybersecurity breaches.',
    structure: 'detailed',
    estimatedPages: 4,
    referencedStandards: ['NIST SP 800-61 Rev. 2', 'ISO/IEC 27035', 'CERT-PK Incident Management Guidelines'],
    tags: ['Cybersecurity', 'Incident Response', 'Ransomware', 'NIST'],
    isRegulated: true,
    purpose: 'To provide a structured, rapid containment protocol to isolate cyber intrusions, minimize data loss, preserve forensic evidence, and recover operational systems.',
    scope: 'Applies to all enterprise endpoints, on-prem servers, cloud tenancies (AWS/Azure/GCP), and corporate networks.',
    responsibilities: 'Security Operations Center (SOC) Analyst: Initial alert triage; Incident Commander: Containment decision-making; Legal/Communications: Statutory 72-hour breach disclosure.',
    procedureDetails: '1. Identification & Severity Triage: Classify alert (SEV-1 Critical: Ransomware, data exfiltration; SEV-2 High: Malware on non-critical node; SEV-3 Medium: Phishing attempts).\n2. Immediate Network Isolation: Sever infected machine from local LAN and WiFi immediately; DO NOT reboot or power down (preserves RAM memory state for forensics).\n3. Forensic Snapshot: Capture disk image and volatile memory using forensically sound tools before performing any remediation.\n4. Containment: Block malicious C2 IPs/domains at perimeter firewall; revoke compromised API keys and user credentials.\n5. Eradication & Clean Restoration: Re-image endpoints from verified clean golden images; restore databases from immutable offline air-gapped backups.\n6. Post-Incident Review: Comprehensive root-cause post-mortem delivered to executive leadership within 5 business days.',
    safetyRisk: 'Potential regulatory non-compliance, heavy fines, and operational downtime if breach disclosures are delayed past statutory windows.'
  },
  {
    id: 'it-change-management',
    departmentId: 'it',
    title: 'Production Infrastructure Change Control & Rollback Management',
    description: 'Change Advisory Board (CAB) reviews, maintenance window criteria, staging verification, automated testing, and rollback protocols.',
    structure: 'table',
    estimatedPages: 3,
    referencedStandards: ['ITIL v4 Change Enablement', 'ISO/IEC 20000-1:2018', 'SOC 2 Type II CC8.1'],
    tags: ['ITIL', 'Change Management', 'DevOps', 'Infrastructure'],
    isRegulated: true,
    purpose: 'To ensure changes to live infrastructure, databases, and microservices are systematically planned, peer-reviewed, tested, and reversible with zero unauthorized downtime.',
    scope: 'All modifications to cloud infrastructure, database schemas, firewall rules, and core SaaS application code.',
    responsibilities: 'Change Requester: Prepare detailed change request with rollback steps; CAB Committee: Weekly review and risk score approval; DevOps Engineer: Execution and validation monitoring.',
    procedureDetails: '1. RFC Submission: Submit Request for Change (RFC) at least 72 hours prior to scheduled window with risk tier (Low, Medium, High, Emergency).\n2. Testing Verification: Mandatory proof of pass in staging environment with automated CI/CD regression tests attached.\n3. Rollback Plan Mandate: Every change MUST include a tested rollback script that can execute in under 15 minutes.\n4. Maintenance Window Execution: Deploy only during designated off-peak window (02:00 - 05:00 UTC) with on-call team assembled in war room.\n5. Post-Deployment Verification: Execute automated smoke tests; if error rate exceeds 0.5% over 10 minutes, trigger immediate mandatory rollback.',
  },

  // ==========================================
  // QUALITY CONTROL (QA/QC) (Category: quality)
  // ==========================================
  {
    id: 'qc-incoming-inspection',
    departmentId: 'quality',
    title: 'Incoming Raw Material Sampling & AQL Inspection Protocol',
    description: 'Statistical sampling using ANSI/ASQ Z1.4 (ISO 2859-1) Normal Level II tables, defect categorization, and Certificate of Analysis verification.',
    structure: 'iso-9001',
    estimatedPages: 3,
    referencedStandards: ['ISO 2859-1 (Sampling Procedures)', 'ISO 9001:2015 Clause 8.4', 'PSQCA Specification Standards'],
    tags: ['AQL', 'Quality Control', 'Sampling', 'Inspection'],
    isRegulated: true,
    purpose: 'To provide statistical quality assurance that purchased lots meet agreed quality tolerances (Critical AQL 0.0, Major AQL 0.65, Minor AQL 2.5) before releasing into inventory.',
    scope: 'All incoming raw components, packaging materials, and sub-assemblies delivered by external suppliers.',
    responsibilities: 'Incoming QC Inspector: Sampling and laboratory dimension measurement; Supplier Quality Engineer: Supplier audit and SCAR issuance; QC Manager: Lot release authority.',
    procedureDetails: '1. Lot Receipt & COA Check: Check supplier Certificate of Analysis (COA) against purchase specification sheet.\n2. Sampling Plan Selection: Use ANSI/ASQ Z1.4 Single Sampling Normal Level II to determine exact sample size based on lot lot size.\n3. Random Pull: Pull representative samples across top, middle, and bottom tiers of delivered pallets.\n4. Measurement & Testing: Measure critical dimensions with calibrated calipers, check tensile/hardness or chemical purity as specified.\n5. Accept / Reject Decision: If defects found equal or exceed Acceptance (Ac) / Rejection (Re) thresholds, reject entire lot and issue Supplier Corrective Action Request (SCAR).',
  },
  {
    id: 'qc-internal-audit',
    departmentId: 'quality',
    title: 'Internal Quality Management System (QMS) Audit Procedure',
    description: 'Annual internal audit schedule, auditor independence, checklists, finding classifications (Major, Minor, Opportunity), and CAPA tracking.',
    structure: 'raci-matrix',
    estimatedPages: 3,
    referencedStandards: ['ISO 19011:2018 (Auditing Guidelines)', 'ISO 9001:2015 Clause 9.2', 'SECP Corporate Governance Rules'],
    tags: ['Internal Audit', 'ISO 9001', 'Compliance', 'QMS'],
    isRegulated: true,
    purpose: 'To systematically verify that the organization’s quality management processes comply with ISO standards and internal policies.',
    scope: 'Encompasses all departments, production facilities, supply chain nodes, and customer support desks across the enterprise.',
    responsibilities: 'Lead Auditor: Audit plan drafting and closing meeting leadership; Department Auditee: Provide evidence and interviews; Quality Director: Review and verify corrective actions.',
    procedureDetails: '1. Annual Audit Plan: Quality Lead publishes yearly audit schedule ensuring all operational units are audited at least once every 12 months.\n2. Auditor Independence: Internal auditors are strictly prohibited from auditing their own functional departments or direct reporting lines.\n3. Audit Execution: Review documented procedures, observe live operator tasks, interview staff, and sample records for objective evidence.\n4. Finding Classification: Deficiencies categorized into Major Non-Conformance, Minor Non-Conformance, or Observation/OFI.\n5. CAPA Closeout: Auditee must submit root-cause analysis and CAPA plan within 14 calendar days; verification audit completed within 60 days.',
  },

  // ==========================================
  // HUMAN RESOURCES (Category: hr)
  // ==========================================
  {
    id: 'hr-onboarding-experience',
    departmentId: 'hr',
    title: 'Standard New Hire Employee Onboarding & Orientation SOP',
    description: 'First 90 days structured onboarding: Day 1 orientation, documentation compliance, buddy system, 30-60-90 review milestones.',
    structure: 'step-by-step',
    estimatedPages: 3,
    referencedStandards: ['SHRM Best Practice Guidelines', 'Employment Protection Legislation', 'Pakistan Industrial Relations Act (IRA)'],
    tags: ['HR', 'Onboarding', 'Orientation', 'Talent'],
    isRegulated: false,
    purpose: 'To provide a welcoming, organized, and compliant introduction for newly joined employees, accelerating time-to-productivity within their first 90 days.',
    scope: 'All full-time, part-time, and contractual employees hired into any global or local branch.',
    responsibilities: 'HR People Partner: Contract documentation and benefits enrollment; Hiring Manager: 30-60-90 day performance goals; Onboarding Buddy: Daily peer guidance.',
    procedureDetails: '1. Pre-Boarding (Day -7 to -1): Send welcome package, confirm IT hardware shipment, and configure workspace/email accounts.\n2. Day 1 Welcome: Meet new hire, complete legal identity verification and tax/bank withholding forms; deliver corporate handbook and safety briefing.\n3. Week 1 Department Immersion: Introduce team members, assign dedicated peer buddy, review key departmental SOPs, and shadow primary functions.\n4. 30-Day Checkpoint: Manager and HR conduct formal 30-day review to assess tool access, workload clarity, and cultural alignment.\n5. 90-Day Probation Confirmation: Formal performance appraisal conducted; probation status confirmed or extended with specific action plan.',
  },
  {
    id: 'hr-workplace-harassment',
    departmentId: 'hr',
    title: 'Workplace Harassment Prevention, Investigation & Grievance Protocol',
    description: 'Zero-tolerance anti-harassment framework, confidential reporting channels, inquiry committee structure, and retaliatory protection.',
    structure: 'detailed',
    estimatedPages: 4,
    referencedStandards: ['EEOC Compliance Guidelines', 'Protection Against Harassment of Women at the Workplace Act (Pakistan 2010/2022)', 'ILO Convention 190'],
    tags: ['Anti-Harassment', 'HR', 'Grievance', 'Compliance'],
    isRegulated: true,
    purpose: 'To maintain a safe, dignified, and respectful working environment completely free from sexual, verbal, psychological harassment, discrimination, or abuse.',
    scope: 'Mandatory for all employees, interns, executives, clients, and on-site third-party vendors.',
    responsibilities: 'Standing Inquiry Committee: Confidential inquiry and recommendation; HR Director: Implementation of penalties; Ombudsman: External statutory appeal channel.',
    procedureDetails: '1. Code of Conduct Promulgation: Display anti-harassment code conspicuously in common areas and obtain signed acknowledgment upon hire.\n2. Confidential Reporting: Aggrieved individual can report via dedicated anonymous helpline, HR Ombudsperson, or direct written complaint to Inquiry Committee.\n3. Immediate Interim Relief: Within 48 hours, ensure complainant is protected from forced contact (transfer accused or provide flexible remote arrangement without penalty to complainant).\n4. Formal Inquiry Sequence: Committee provides written charges to accused, conducts separate recorded hearings, examines evidence, and concludes findings within 30 calendar days.\n5. Disciplinary Sanctions: Minor (written reprimand, withholding promotion) or Major (demotion, compulsory termination, statutory fine).\n6. Non-Retaliation Guarantee: Strict disciplinary termination for any individual engaging in retaliation against witnesses or complainants.',
  },

  // ==========================================
  // FINANCE & PROCUREMENT (Categories: finance, procurement)
  // ==========================================
  {
    id: 'fin-accounts-payable-approval',
    departmentId: 'finance',
    title: 'Accounts Payable: 3-Way Invoice Matching & Payment Disbursement',
    description: 'Mandatory 3-way match (Purchase Order, Receiving Slip, Vendor Invoice), dual bank signature authorizations, and fraud prevention.',
    structure: 'table',
    estimatedPages: 3,
    referencedStandards: ['IFRS / GAAP Revenue & Expense Recognition', 'SOX Section 404 (Internal Controls)', 'FBR Withholding Tax Regulations'],
    tags: ['Accounts Payable', 'Invoicing', 'Finance', 'Audit'],
    isRegulated: true,
    purpose: 'To ensure all corporate disbursements represent legitimate, authorized expenditures with verified receipt of goods/services prior to releasing payment.',
    scope: 'All trade vendor invoices, recurring service contracts, utility charges, and external consultant fees.',
    responsibilities: 'AP Clerk: Verification and 3-way matching; Accounting Manager: General ledger posting and payment batch review; CFO / CEO: Dual banking release authorization.',
    procedureDetails: '1. Invoice Capture: Vendor invoices received centrally via designated accounting email inbox; entered into ERP.\n2. 3-Way Matching: System matches vendor invoice line items against approved Purchase Order (PO) and warehouse Goods Received Note (GRN).\n3. Tolerance Exception: Price deviations exceeding 1.0% or $100 require written purchasing manager re-authorization before processing.\n4. Statutory Withholding: Deduct applicable income withholding tax and sales tax in accordance with statutory tax brackets; generate withholding tax certificates.\n5. Payment Run Execution: Twice-monthly scheduled payment runs via secure corporate banking portal requiring dual token approvals for sums exceeding $2,500.',
  },
  {
    id: 'proc-supplier-qualification',
    departmentId: 'procurement',
    title: 'Strategic Vendor Due Diligence, Selection & Performance Evaluation',
    description: 'Vendor onboarding criteria, financial solvency checks, ISO certifications, anti-bribery declarations, and quarterly scorecard reviews.',
    structure: 'raci-matrix',
    estimatedPages: 3,
    referencedStandards: ['ISO 9001:2015 Clause 8.4', 'Public Procurement Regulatory Authority (PPRA Rules)', 'FCPA Anti-Corruption Standards'],
    tags: ['Procurement', 'Vendor Management', 'Sourcing', 'Due Diligence'],
    isRegulated: true,
    purpose: 'To establish a vetted, cost-effective, and ethical supply base while mitigating commercial, legal, and operational continuity risks.',
    scope: 'All prospective suppliers providing goods, materials, or services exceeding an annual aggregate contract value of $10,000.',
    responsibilities: 'Procurement Specialist: Initial dossier compilation; Compliance Officer: Anti-bribery and background verification; Head of Procurement: Final vendor enlistment.',
    procedureDetails: '1. Vendor Registration Dossier: Prospective vendor submits company registration certificate, tax clearance (FBR/NTN), audited financials, and ISO certifications.\n2. Commercial & Quality Audit: Procurement and QA evaluate supplier facility or review third-party audit reports for high-risk materials.\n3. Anti-Bribery & Sanctions Check: Screen corporate officers against global sanctions lists and execute signed Anti-Bribery Code of Conduct.\n4. Approved Vendor List (AVL): Successfully qualified vendors are admitted into ERP Approved Vendor List with assigned credit limits.\n5. Quarterly Performance Scorecard: Vendors evaluated quarterly across Quality (40%), On-Time Delivery (40%), and Commercial Responsiveness (20%); score below 75 points triggers probation.',
  },

  // ==========================================
  // FOOD SERVICE & RESTAURANT (Category: food-service)
  // ==========================================
  {
    id: 'food-haccp-temperature',
    departmentId: 'food-service',
    title: 'HACCP Critical Control Point (CCP) Cooking & Chilling Monitoring',
    description: 'Core cooking temperatures, two-stage cooling protocols, digital probe sanitization, and food safety corrective actions.',
    structure: 'checklist',
    estimatedPages: 2,
    referencedStandards: ['FDA Food Code 2022', 'ISO 22000:2018 (Food Safety)', 'Punjab Food Authority (PFA) Standards'],
    tags: ['HACCP', 'Food Safety', 'Cooking Temps', 'Culinary'],
    isRegulated: true,
    purpose: 'To ensure all potentially hazardous foods reach statutory internal lethality temperatures to eliminate foodborne pathogens before serving.',
    scope: 'Mandatory across all commercial hot preparation lines, bakery sections, and bulk catering kitchens.',
    responsibilities: 'Head Chef: Daily oversight of CCP logs; Line Cook: Measure and log internal temperatures using calibrated digital probe; Food Safety Manager: Audit logs twice daily.',
    procedureDetails: '1. Probe Sanitization: Wipe calibrated digital thermocouple probe with food-grade alcohol wipe before every temperature check.\n2. Internal Lethality Verification: Probe inserted into thickest geometric center of food item. Critical Minimums: Poultry & ground stuffing 74°C (165°F) for 15 sec; Ground meats 68°C (155°F); Seafood 63°C (145°F).\n3. Hot Holding Standard: Cooked foods held in hot wells must maintain minimum 57°C (135°F) continuously; food below 57°C for >2 hours must be discarded.\n4. Rapid Two-Stage Chilling: Hot food cooled from 57°C to 21°C within 2 hours, and from 21°C to 4°C within an additional 4 hours using ice baths or blast chillers.\n5. Log Retention: Daily HACCP temperature logs signed and filed for a minimum of 180 days for health inspection verification.',
    safetyRisk: 'Biological hazard: Salmonella, E. Coli, Listeria risk. Non-negotiable mandatory compliance.'
  },

  // ==========================================
  // HEALTHCARE ADMINISTRATION (Category: healthcare)
  // ==========================================
  {
    id: 'health-hipaa-patient-records',
    departmentId: 'healthcare',
    title: 'Patient Health Information (PHI) Confidentiality & HIPAA Compliance',
    description: 'Strict administrative handling of electronic health records, paper chart privacy, secure transmission, and patient consent.',
    structure: 'detailed',
    estimatedPages: 3,
    referencedStandards: ['HIPAA Privacy & Security Rule (45 CFR)', 'WHO eHealth Standards', 'Pakistan Healthcare Commission (PHC) Regulations'],
    tags: ['HIPAA', 'Healthcare', 'Patient Privacy', 'Medical Admin'],
    isRegulated: true,
    purpose: 'To safeguard protected health information (PHI) against unauthorized disclosure, interception, or loss, ensuring full regulatory and ethical compliance.',
    scope: 'Administrative, billing, front desk, and nursing records across all outpatient clinics and hospital wards.',
    responsibilities: 'Medical Records Officer: Supervise chart archives and EMR permissions; Front Desk Receptionist: Identity verification during chart release; Compliance Officer: Breach notification.',
    procedureDetails: '1. Clean Desk & Screen Policy: Computer screens displaying patient medical records must face away from waiting room areas; auto-lock enabled after 60 seconds of inactivity.\n2. Paper Chart Handling: Physical files never left unattended in open corridors; transported in closed folders and locked in medical records room at close of shift.\n3. Record Requests: PHI released only upon receiving signed Patient Authorization Form and verifying government photo ID.\n4. Electronic Record Transmission: Unencrypted email of patient records is strictly prohibited; all remote sharing must utilize secure encrypted patient portal or password-protected TLS PDF.\n5. Breach Escalation: Any lost device or accidental misdirection of patient data reported to Data Privacy Officer within 4 hours.',
    safetyRisk: 'Administrative only. This standard does not govern clinical or medical diagnostic interventions.'
  },

  // ==========================================
  // CONSTRUCTION & SITE SAFETY (Category: construction)
  // ==========================================
  {
    id: 'const-working-at-heights',
    departmentId: 'construction',
    title: 'Fall Protection, Scaffolding Inspection & Working at Heights Protocol',
    description: '100% tie-off requirement (>1.8m / 6ft), full-body harness inspection, scaffolding green tag certification, and exclusion zones.',
    structure: 'step-by-step',
    estimatedPages: 3,
    referencedStandards: ['OSHA 29 CFR 1926 Subpart M (Fall Protection)', 'ANSI/ASSP Z359', 'Pakistan Building Code (Safety Standards)'],
    tags: ['Fall Protection', 'Scaffolding', 'Construction Safety', 'Harness'],
    isRegulated: true,
    purpose: 'To prevent fatal and severe fall injuries from elevated work platforms, scaffolding, ladders, and building perimeters above 1.8 meters.',
    scope: 'Mandatory on all construction sites, scaffolding setups, roof work, and mobile elevated work platforms (MEWPs).',
    responsibilities: 'Site Safety Officer: Daily scaffolding inspection and green-tagging; Scaffold Erector: Qualified erection per drawings; Construction Worker: Pre-use harness inspection and 100% tie-off.',
    procedureDetails: '1. Pre-Task Hazard Assessment: Identify all fall hazards before starting elevated tasks; inspect personal fall arrest systems (PFAS).\n2. Full-Body Harness Inspection: Check webbing for fraying, chemical burns, or broken stitching; verify D-rings are uncracked; discard any harness involved in a prior fall arrest.\n3. 100% Tie-Off Rule: When working above 1.8m (6 ft), workers must remain attached at all times using dual shock-absorbing lanyards anchored to certified anchor points (5,000 lbs rating).\n4. Scaffolding Tag System: Competent person inspects scaffolding every morning. GREEN TAG: Safe to use; YELLOW: Use with special restrictions; RED: Unsafe, do not climb.\n5. Dropped Objects Prevention: Secure all hand tools with lanyards; install toe-boards and perimeter safety netting to safeguard ground personnel.',
    safetyRisk: 'Fatality hazard from falls or falling debris. Unanchored work at heights results in immediate site expulsion.'
  }
];

export function getTemplatesForDepartment(deptId: SOPCategory): DepartmentTemplate[] {
  return DEPARTMENT_TEMPLATES.filter(t => t.departmentId === deptId);
}

export function getTemplateById(id: string): DepartmentTemplate | undefined {
  return DEPARTMENT_TEMPLATES.find(t => t.id === id);
}

