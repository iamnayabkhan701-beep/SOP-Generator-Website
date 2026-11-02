import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { SOPGeneratedContent, SOPTheme, SOPStructure } from '../types/sop';

interface PDFExportOptions {
  content: SOPGeneratedContent;
  theme: SOPTheme;
  structure: SOPStructure;
  organizationName?: string;
}

interface ThemePalette {
  primary: [number, number, number];
  primaryLight: [number, number, number];
  primaryDark: [number, number, number];
  text: [number, number, number];
  mutedText: [number, number, number];
  border: [number, number, number];
}

const THEME_PALETTES: Record<SOPTheme, ThemePalette> = {
  'professional-blue': {
    primary: [2, 111, 199], // #026fc7
    primaryLight: [224, 239, 254], // #e0effe
    primaryDark: [3, 88, 161], // #0358a1
    text: [30, 41, 59],
    mutedText: [100, 116, 139],
    border: [203, 213, 225],
  },
  'corporate-black': {
    primary: [30, 41, 59], // #1e293b
    primaryLight: [241, 245, 249], // #f1f5f9
    primaryDark: [15, 23, 42], // #0f172a
    text: [15, 23, 42],
    mutedText: [100, 116, 139],
    border: [203, 213, 225],
  },
  'modern-green': {
    primary: [5, 150, 105], // #059669
    primaryLight: [236, 253, 245], // #ecfdf5
    primaryDark: [4, 120, 87], // #047857
    text: [30, 41, 59],
    mutedText: [100, 116, 139],
    border: [167, 243, 208],
  },
  'minimal-white': {
    primary: [55, 65, 81], // #374151
    primaryLight: [249, 250, 251], // #f9fafb
    primaryDark: [17, 24, 39], // #111827
    text: [31, 41, 55],
    mutedText: [107, 114, 128],
    border: [229, 231, 235],
  },
  'creative-purple': {
    primary: [124, 58, 237], // #7c3aed
    primaryLight: [245, 243, 255], // #f5f3ff
    primaryDark: [109, 40, 217], // #6d28d9
    text: [30, 41, 59],
    mutedText: [100, 116, 139],
    border: [221, 214, 254],
  },
};

export async function generateSOPPdf(options: PDFExportOptions): Promise<{ blob: Blob; pageCount: number; filename: string }> {
  const { content, theme, structure, organizationName } = options;
  const palette = THEME_PALETTES[theme] || THEME_PALETTES['professional-blue'];

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const marginX = 16;
  const contentWidth = pageWidth - marginX * 2;
  let cursorY = 16;

  const checkPageBreak = (neededHeight: number) => {
    if (cursorY + neededHeight > pageHeight - 20) {
      doc.addPage();
      cursorY = 22; // leave room for running header
    }
  };

  // --- Decorative Top Accent Bar ---
  doc.setFillColor(...palette.primary);
  doc.rect(0, 0, pageWidth, 5, 'F');

  // --- Document Header ---
  cursorY = 14;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(...palette.primary);
  doc.text((organizationName || content.organization || 'ENTERPRISE STANDARD PROCEDURE').toUpperCase(), marginX, cursorY);

  cursorY += 7;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.setTextColor(...palette.text);
  const titleLines = doc.splitTextToSize(content.documentTitle || 'Standard Operating Procedure', contentWidth);
  doc.text(titleLines, marginX, cursorY);
  cursorY += titleLines.length * 8;

  // --- Document Metadata Table ---
  cursorY += 2;
  const meta = content.metadata || {
    sopId: 'SOP-001',
    version: '1.0',
    effectiveDate: new Date().toISOString().split('T')[0],
    department: 'Operations',
    preparedBy: 'Author',
    reviewedBy: 'Reviewer',
    approvedBy: 'Approver',
  };

  autoTable(doc, {
    startY: cursorY,
    margin: { left: marginX, right: marginX },
    theme: 'grid',
    styles: {
      fontSize: 8.5,
      cellPadding: 2.5,
      textColor: palette.text,
      lineColor: palette.border,
      lineWidth: 0.15,
    },
    headStyles: {
      fillColor: palette.primary,
      textColor: [255, 255, 255],
      fontStyle: 'bold',
    },
    body: [
      [
        { content: 'SOP Number:', styles: { fontStyle: 'bold', fillColor: palette.primaryLight } },
        meta.sopId,
        { content: 'Effective Date:', styles: { fontStyle: 'bold', fillColor: palette.primaryLight } },
        meta.effectiveDate,
      ],
      [
        { content: 'Version:', styles: { fontStyle: 'bold', fillColor: palette.primaryLight } },
        `v${meta.version}`,
        { content: 'Department:', styles: { fontStyle: 'bold', fillColor: palette.primaryLight } },
        meta.department,
      ],
      [
        { content: 'Prepared By:', styles: { fontStyle: 'bold', fillColor: palette.primaryLight } },
        meta.preparedBy,
        { content: 'Reviewed / Approved:', styles: { fontStyle: 'bold', fillColor: palette.primaryLight } },
        `${meta.reviewedBy} / ${meta.approvedBy}`,
      ],
    ],
  });

  // @ts-expect-error - jspdf-autotable adds lastAutoTable to doc
  cursorY = (doc.lastAutoTable?.finalY || cursorY) + 6;

  // --- Review / Compliance Disclaimer ---
  if (content.disclaimer) {
    checkPageBreak(20);
    doc.setFillColor(254, 242, 242); // light red/amber
    doc.setDrawColor(248, 113, 113);
    doc.roundedRect(marginX, cursorY, contentWidth, 14, 1.5, 1.5, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(185, 28, 28);
    doc.text('OFFICIAL REVIEW & COMPLIANCE NOTICE:', marginX + 3, cursorY + 4.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(127, 29, 29);
    const discLines = doc.splitTextToSize(content.disclaimer, contentWidth - 6);
    doc.text(discLines.slice(0, 2), marginX + 3, cursorY + 8.5);

    cursorY += 18;
  }

  // --- Executive Summary ---
  if (content.executiveSummary) {
    checkPageBreak(18);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10.5);
    doc.setTextColor(...palette.primaryDark);
    doc.text('Executive Summary', marginX, cursorY);
    cursorY += 5;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(...palette.text);
    const summaryLines = doc.splitTextToSize(content.executiveSummary, contentWidth);
    doc.text(summaryLines, marginX, cursorY);
    cursorY += summaryLines.length * 4.5 + 6;
  }

  // --- Visual Process Flowchart Shapes ---
  checkPageBreak(32);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(...palette.primaryDark);
  doc.text('Visual Process Flowchart & Sequential Milestones', marginX, cursorY);
  cursorY += 5;

  const flowNodes = [
    { num: '1', title: 'Initiation', shape: 'capsule' },
    { num: '2', title: 'Execution', shape: 'rect' },
    { num: '3', title: 'Verify Gate', shape: 'diamond' },
    { num: '4', title: 'Resolution', shape: 'rect' },
    { num: '5', title: 'Approval', shape: 'capsule' },
  ];

  const nodeWidth = (contentWidth - 16) / 5;
  const nodeHeight = 12;

  flowNodes.forEach((node, nIdx) => {
    const nodeX = marginX + nIdx * (nodeWidth + 4);

    // Draw shape
    doc.setFillColor(...palette.primaryLight);
    doc.setDrawColor(...palette.primary);
    doc.setLineWidth(0.3);

    if (node.shape === 'capsule') {
      doc.roundedRect(nodeX, cursorY, nodeWidth, nodeHeight, 3, 3, 'FD');
    } else {
      doc.roundedRect(nodeX, cursorY, nodeWidth, nodeHeight, 1.5, 1.5, 'FD');
    }

    // Step Number Badge
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(...palette.primaryDark);
    doc.text(`Stage ${node.num}`, nodeX + nodeWidth / 2, cursorY + 4.5, { align: 'center' });

    // Step Title
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(...palette.text);
    doc.text(node.title, nodeX + nodeWidth / 2, cursorY + 9, { align: 'center' });

    // Connector Arrow
    if (nIdx < 4) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(...palette.primary);
      doc.text('>', nodeX + nodeWidth + 1.2, cursorY + 7);
    }
  });

  cursorY += nodeHeight + 7;

  // --- Visual Quality & KPI Benchmarks Table ---
  checkPageBreak(30);
  autoTable(doc, {
    startY: cursorY,
    margin: { left: marginX, right: marginX },
    head: [['Operational KPI / Metric', 'Current Benchmark', 'Target SLA', 'Compliance Status']],
    body: [
      ['First-Pass Yield / Success Rate', '98.4%', '99.0%', 'Optimal / Pass'],
      ['Standard Procedure Adherence', '100%', '100%', 'Fully Compliant'],
      ['Incident SLA Resolution Time', '12.5 min', '15.0 min', 'Within Limit'],
      ['Defect / Error Rate Tolerance', '0.04%', '0.10%', 'Compliant (Zero Defect Zone)'],
    ],
    theme: 'grid',
    styles: {
      fontSize: 7.5,
      cellPadding: 2,
      textColor: palette.text,
      lineColor: palette.border,
      lineWidth: 0.15,
    },
    headStyles: {
      fillColor: palette.primaryDark,
      textColor: [255, 255, 255],
      fontStyle: 'bold',
    },
  });

  // @ts-expect-error - autoTable adds lastAutoTable
  cursorY = (doc.lastAutoTable?.finalY || cursorY) + 7;

  // --- Sections Rendering ---
  content.sections.forEach((sec, idx) => {
    checkPageBreak(18);

    // Section Title with underline bar
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(...palette.primary);
    doc.text(sec.title, marginX, cursorY);
    cursorY += 2;

    doc.setDrawColor(...palette.border);
    doc.setLineWidth(0.3);
    doc.line(marginX, cursorY, marginX + contentWidth, cursorY);
    cursorY += 4.5;

    // Section Content
    if (sec.content) {
      checkPageBreak(12);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(...palette.text);
      const contentLines = doc.splitTextToSize(sec.content, contentWidth);
      doc.text(contentLines, marginX, cursorY);
      cursorY += contentLines.length * 4.5 + 3;
    }

    // Section Items (Steps or Checklists)
    if (sec.items && sec.items.length > 0) {
      sec.items.forEach((item, itemIdx) => {
        checkPageBreak(9);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8.8);
        doc.setTextColor(...palette.text);

        if (sec.type === 'checklist') {
          // Render checklist checkbox
          doc.setDrawColor(...palette.primary);
          doc.rect(marginX, cursorY - 3, 3.2, 3.2);
          const itemLines = doc.splitTextToSize(item, contentWidth - 7);
          doc.text(itemLines, marginX + 6, cursorY);
          cursorY += itemLines.length * 4.2 + 2;
        } else {
          // Render numbered badge / bullet
          const stepNum = `${itemIdx + 1}.`;
          doc.setFont('helvetica', 'bold');
          doc.setTextColor(...palette.primary);
          doc.text(stepNum, marginX, cursorY);

          doc.setFont('helvetica', 'normal');
          doc.setTextColor(...palette.text);
          const itemLines = doc.splitTextToSize(item, contentWidth - 7);
          doc.text(itemLines, marginX + 6, cursorY);
          cursorY += itemLines.length * 4.2 + 2;
        }
      });
      cursorY += 2;
    }

    // Section Table Data
    if (sec.tableData && sec.tableData.headers && sec.tableData.rows) {
      checkPageBreak(25);
      autoTable(doc, {
        startY: cursorY,
        margin: { left: marginX, right: marginX },
        head: [sec.tableData.headers],
        body: sec.tableData.rows,
        theme: 'striped',
        styles: {
          fontSize: 8,
          cellPadding: 2.2,
          textColor: palette.text,
        },
        headStyles: {
          fillColor: palette.primary,
          textColor: [255, 255, 255],
          fontStyle: 'bold',
        },
        alternateRowStyles: {
          fillColor: palette.primaryLight,
        },
      });

      // @ts-expect-error - autoTable adds lastAutoTable
      cursorY = (doc.lastAutoTable?.finalY || cursorY) + 5;
    }

    cursorY += 4;
  });

  // --- Formal Sign-Off Approval Block ---
  checkPageBreak(38);
  cursorY += 2;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(...palette.primary);
  doc.text('FORMAL VERIFICATION & AUTHORIZATION SIGN-OFF', marginX, cursorY);
  cursorY += 4;

  autoTable(doc, {
    startY: cursorY,
    margin: { left: marginX, right: marginX },
    theme: 'grid',
    styles: {
      fontSize: 8,
      cellPadding: 4,
      textColor: palette.text,
      lineColor: palette.border,
      lineWidth: 0.2,
    },
    head: [['Role', 'Name & Title', 'Signature', 'Date']],
    body: [
      ['Author / Prepared By', meta.preparedBy, '', meta.effectiveDate],
      ['Peer / Technical Reviewer', meta.reviewedBy, '', ''],
      ['Authorized Approver', meta.approvedBy, '', ''],
    ],
    headStyles: {
      fillColor: palette.primaryDark,
      textColor: [255, 255, 255],
      fontStyle: 'bold',
    },
  });

  // --- Page Numbering and Running Headers/Footers ---
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);

    // Running Header (pages 2+)
    if (i > 1) {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(...palette.mutedText);
      doc.text(
        `${content.documentTitle || 'Standard Operating Procedure'} | ${meta.sopId}`,
        marginX,
        10
      );
      doc.setDrawColor(...palette.border);
      doc.setLineWidth(0.15);
      doc.line(marginX, 12, marginX + contentWidth, 12);
    }

    // Running Footer (all pages)
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(...palette.mutedText);
    doc.setDrawColor(...palette.border);
    doc.setLineWidth(0.15);
    doc.line(marginX, pageHeight - 12, marginX + contentWidth, pageHeight - 12);

    doc.text('CONFIDENTIAL & PROPRIETARY — SUBJECT TO FORMAL APPROVAL', marginX, pageHeight - 7.5);
    doc.text(`Page ${i} of ${totalPages}`, pageWidth - marginX - 16, pageHeight - 7.5);
  }

  const safeTitle = (content.documentTitle || 'SOP_Document')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .slice(0, 30);
  const filename = `${safeTitle}_v${meta.version}.pdf`;

  const blob = doc.output('blob');

  return {
    blob,
    pageCount: totalPages,
    filename,
  };
}

