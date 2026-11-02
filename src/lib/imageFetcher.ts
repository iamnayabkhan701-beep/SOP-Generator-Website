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
  'workplace-safety': [
    {
      url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1000&q=80',
      caption: 'Figure 1: Certified PPE Standards & Personal Protective Equipment Verification',
      alt: 'Workplace safety inspection PPE',
    },
    {
      url: 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?auto=format&fit=crop&w=1000&q=80',
      caption: 'Figure 2: Facility Hazard Clearance & Emergency Access Protocol',
      alt: 'Safety warning protocol',
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
  const catKey = category.toLowerCase();
  const registered = CATEGORY_IMAGE_REGISTRY[catKey] || CATEGORY_IMAGE_REGISTRY['custom'];
  return registered;
}

