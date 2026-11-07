import type { SOPCategory } from '../types/sop';

export interface SOPImage {
  url: string;
  caption: string;
  alt: string;
}

// Curated high-resolution professional image database by category
// Provides instant, verified, high-quality images without requiring manual user upload
const CATEGORY_IMAGE_REGISTRY: Record<string, SOPImage[]> = {
  it: [
    {
      url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1000&q=80',
      caption: 'Figure 1: Primary Cloud Infrastructure & Server Architecture Node',
      alt: 'Data center server rack infrastructure',
    },
    {
      url: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1000&q=80',
      caption: 'Figure 2: System Telemetry Monitoring & Security Verification Console',
      alt: 'System monitoring analytics screen',
    },
  ],
  safety: [
    {
      url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1000&q=80',
      caption: 'Figure 1: Standard Workplace PPE Requirements & Inspection Zone',
      alt: 'Worker with hard hat and safety goggles inspection',
    },
    {
      url: 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?auto=format&fit=crop&w=1000&q=80',
      caption: 'Figure 2: Hazard Isolation & Environmental Containment Equipment',
      alt: 'Industrial safety barrier and hazard control',
    },
  ],
  manufacturing: [
    {
      url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1000&q=80',
      caption: 'Figure 1: Precision Machinery Calibration & Assembly Line Workstation',
      alt: 'Modern automated manufacturing robotic line',
    },
    {
      url: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=1000&q=80',
      caption: 'Figure 2: Tolerance Verification & Quality Sampling Station',
      alt: 'Industrial machining component inspection',
    },
  ],
  warehouse: [
    {
      url: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1000&q=80',
      caption: 'Figure 1: High-Bay Pallet Racking & Automated Storage Retrieval Zone',
      alt: 'Modern distribution warehouse with organized pallet racking',
    },
    {
      url: 'https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&w=1000&q=80',
      caption: 'Figure 2: Receiving Dock Inbound Inspection & Barcode Scan Stage',
      alt: 'Warehouse operator inspecting inbound inventory pallet',
    },
  ],
  'supply-chain': [
    {
      url: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=1000&q=80',
      caption: 'Figure 1: Intermodal Freight Routing & Container Logistics Network',
      alt: 'Shipping containers stacked at commercial freight harbor',
    },
    {
      url: 'https://images.unsplash.com/photo-1586528116493-a029325540fa?auto=format&fit=crop&w=1000&q=80',
      caption: 'Figure 2: Supplier Consignment Verification & Audit Record',
      alt: 'Logistics cargo terminal dispatch management',
    },
  ],
  logistics: [
    {
      url: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=1000&q=80',
      caption: 'Figure 1: Fleet Dispatch Routing & Cross-Dock Distribution Platform',
      alt: 'Commercial transport trucks lined up at loading bay',
    },
    {
      url: 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?auto=format&fit=crop&w=1000&q=80',
      caption: 'Figure 2: Last-Mile Delivery Tracking & Package Verification',
      alt: 'Delivery courier scanning outbound barcode package',
    },
  ],
  construction: [
    {
      url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1000&q=80',
      caption: 'Figure 1: Active Jobsite Perimeter Safety & Structural Framing Protocol',
      alt: 'Commercial building construction site with safety crane',
    },
    {
      url: 'https://images.unsplash.com/photo-1541888946425-d0fbb186156a?auto=format&fit=crop&w=1000&q=80',
      caption: 'Figure 2: Scaffolding Anchor Rigging & OSHA Fall Protection Inspection',
      alt: 'Construction engineers reviewing structural blueprints on site',
    },
  ],
  retail: [
    {
      url: 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?auto=format&fit=crop&w=1000&q=80',
      caption: 'Figure 1: Store Merchandising Display & Planogram Compliance Protocol',
      alt: 'Organized retail showroom with structured product shelves',
    },
    {
      url: 'https://images.unsplash.com/photo-1556742049-0a67c5574f73?auto=format&fit=crop&w=1000&q=80',
      caption: 'Figure 2: Point-of-Sale (POS) Cash Handling & Shift Reconciliation',
      alt: 'Retail checkout register terminal payment point',
    },
  ],
  'food-service': [
    {
      url: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=1000&q=80',
      caption: 'Figure 1: Commercial Kitchen Sanitation & Food Prep Surface Disinfection',
      alt: 'Stainless steel commercial kitchen preparation station',
    },
    {
      url: 'https://images.unsplash.com/photo-1577106263724-2c8e03bfe9cf?auto=format&fit=crop&w=1000&q=80',
      caption: 'Figure 2: HACCP Cold Chain Storage & Thermal Log Verification',
      alt: 'Professional chef inspecting fresh inventory food preparation',
    },
  ],
  cybersecurity: [
    {
      url: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1000&q=80',
      caption: 'Figure 1: SOC Security Operations Console & Threat Detection Telemetry',
      alt: 'Cybersecurity operations center network data monitors',
    },
    {
      url: 'https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?auto=format&fit=crop&w=1000&q=80',
      caption: 'Figure 2: Incident Containment & Forensic Network Isolation Gate',
      alt: 'Digital lock and encrypted data security dashboard',
    },
  ],
  environmental: [
    {
      url: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=1000&q=80',
      caption: 'Figure 1: Hazardous Waste Segregation & Environmental Compliance Disposal',
      alt: 'Environmental recycling and waste management sorting plant',
    },
    {
      url: 'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?auto=format&fit=crop&w=1000&q=80',
      caption: 'Figure 2: Emission Sampling Point & Sustainability Monitoring Probe',
      alt: 'Renewable energy and clean industrial monitoring station',
    },
  ],
  sales: [
    {
      url: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1000&q=80',
      caption: 'Figure 1: Enterprise Client Pipeline & Account Executive Strategy Review',
      alt: 'Corporate sales team conducting pipeline forecast review',
    },
    {
      url: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1000&q=80',
      caption: 'Figure 2: Contract Negotiation Milestone & Deal Sign-Off Procedure',
      alt: 'Business partnership agreement handshake and proposal',
    },
  ],
  marketing: [
    {
      url: 'https://images.unsplash.com/photo-1533750349088-cd871a92f312?auto=format&fit=crop&w=1000&q=80',
      caption: 'Figure 1: Multi-Channel Campaign Launch Matrix & Asset Approval Flow',
      alt: 'Digital marketing analytics dashboard and campaign planning',
    },
    {
      url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1000&q=80',
      caption: 'Figure 2: Attribution Analytics & Brand Guideline Review Checkpoint',
      alt: 'Marketing growth performance graphs and social strategy',
    },
  ],
  legal: [
    {
      url: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=1000&q=80',
      caption: 'Figure 1: Formal Contract Audit & Regulatory Compliance Review Station',
      alt: 'Legal document review with fountain pen and statute books',
    },
    {
      url: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1000&q=80',
      caption: 'Figure 2: Evidentiary Retention & Secure Archival Authorization',
      alt: 'Scales of justice with legal case file records',
    },
  ],
  'remote-work': [
    {
      url: 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?auto=format&fit=crop&w=1000&q=80',
      caption: 'Figure 1: Ergonomic Home Workstation & Encrypted VPN Access Endpoint',
      alt: 'Clean remote home office workspace with laptop',
    },
    {
      url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1000&q=80',
      caption: 'Figure 2: Distributed Team Communication & Synchronous Standup Protocol',
      alt: 'Remote colleagues collaborating via video conference',
    },
  ],
  procurement: [
    {
      url: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1000&q=80',
      caption: 'Figure 1: Vendor RFP Evaluation Matrix & Commercial Bidding Review',
      alt: 'Procurement officer auditing supplier bids and purchase orders',
    },
    {
      url: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1000&q=80',
      caption: 'Figure 2: Three-Way Invoice Match & Purchase Order Sign-Off Gate',
      alt: 'Financial calculation and contract expenditure verification',
    },
  ],
  quality: [
    {
      url: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1000&q=80',
      caption: 'Figure 1: Laboratory Analytical Testing & Batch Sampling Setup',
      alt: 'Quality control laboratory testing tubes',
    },
    {
      url: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=1000&q=80',
      caption: 'Figure 2: Quality Assurance Benchmarking & Non-Conformance Log',
      alt: 'Microscope and scientific inspection equipment',
    },
  ],
  healthcare: [
    {
      url: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1000&q=80',
      caption: 'Figure 1: Clinical Administrative Intake & HIPAA Records Station',
      alt: 'Hospital medical records workstation',
    },
    {
      url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1000&q=80',
      caption: 'Figure 2: Confidential Patient Health Information (PHI) Security Station',
      alt: 'Doctor reviewing medical tablet paperwork',
    },
  ],
  hr: [
    {
      url: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1000&q=80',
      caption: 'Figure 1: Personnel Onboarding & Document Verification Meeting',
      alt: 'Professional team meeting around conference table',
    },
    {
      url: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1000&q=80',
      caption: 'Figure 2: Performance Evaluation & Compliance Sign-Off Process',
      alt: 'Human resources review checklist with pen',
    },
  ],
  finance: [
    {
      url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1000&q=80',
      caption: 'Figure 1: Financial Ledger Reconciliation & Transaction Audit Dashboard',
      alt: 'Financial analytics chart on laptop',
    },
    {
      url: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1000&q=80',
      caption: 'Figure 2: Multi-Tier Expenditure Authorization & Receipt Record',
      alt: 'Accounting calculator and invoice documentation',
    },
  ],
  'customer-service': [
    {
      url: 'https://images.unsplash.com/photo-1534536281715-e28d76689b4d?auto=format&fit=crop&w=1000&q=80',
      caption: 'Figure 1: Support Escalation Desk & SLA Ticket Resolution Center',
      alt: 'Customer support agent with headset at desk',
    },
  ],
  office: [
    {
      url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1000&q=80',
      caption: 'Figure 1: Facility Management & Daily Office Opening/Closing Station',
      alt: 'Modern corporate office space',
    },
  ],
  operations: [
    {
      url: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1000&q=80',
      caption: 'Figure 1: Logistics Distribution & Operational Workflow Center',
      alt: 'Warehouse logistics and operations center',
    },
  ],
  custom: [
    {
      url: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1000&q=80',
      caption: 'Figure 1: Standard Procedural Verification & Documentation Center',
      alt: 'Business strategy planning meeting',
    },
  ],
};

/**
 * Automatically retrieves domain-relevant, high-resolution figures for any SOP
 */
export function getAutomaticSOPImages(category: SOPCategory, title: string): SOPImage[] {
  const catKey = (category || 'custom').toLowerCase();
  const registered = CATEGORY_IMAGE_REGISTRY[catKey] || CATEGORY_IMAGE_REGISTRY['custom'];
  return registered;
}
