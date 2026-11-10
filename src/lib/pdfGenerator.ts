import React from 'react';
import { createRoot } from 'react-dom/client';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import html2canvas from 'html2canvas';
import type { SOPGeneratedContent, SOPTheme, SOPStructure, SOPCategory } from '../types/sop';
import { SOPDocumentView } from '../components/SOPDocumentView';

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

// ==============================================================
// VISUAL PDF EXPORT: Captures exact on-screen DOM with images,
// shapes, flowcharts, KPI gauges, and colors via html2canvas
// ==============================================================
export async function generateSOPPdfFromElement(
  element: HTMLElement,
  content: SOPGeneratedContent,
  filename?: string
): Promise<{ blob: Blob; pageCount: number; filename: string }> {
  const A4_WIDTH_MM = 210;
  const A4_HEIGHT_MM = 297;
  const SCALE = 2; // Retina quality rendering

  // Wait for any images inside the element to fully load before capturing
  const images = element.querySelectorAll('img');
  await Promise.all(
    Array.from(images).map((img) => {
      if (img.complete) return Promise.resolve();
      return new Promise<void>((resolve) => {
        img.onload = () => resolve();
        img.onerror = () => resolve();
      });
    })
  );

  const canvas = await html2canvas(element, {
    scale: SCALE,
    useCORS: true,
    allowTaint: true,
    backgroundColor: '#ffffff',
    logging: false,
    imageTimeout: 15000,
    onclone: (clonedDoc) => {
      const imgs = clonedDoc.querySelectorAll('img');
      imgs.forEach((img) => {
        img.style.display = 'block';
        img.crossOrigin = 'anonymous';
      });
    },
  });

  const canvasWidthMM = A4_WIDTH_MM;
  const canvasHeightMM = (canvas.height / canvas.width) * A4_WIDTH_MM;
  const pageCount = Math.max(1, Math.ceil(canvasHeightMM / A4_HEIGHT_MM));

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  for (let i = 0; i < pageCount; i++) {
    if (i > 0) doc.addPage();

    const srcY = (i * A4_HEIGHT_MM * canvas.width) / canvasWidthMM;
    const srcHeight = Math.min(
      (A4_HEIGHT_MM * canvas.width) / canvasWidthMM,
      canvas.height - srcY
    );

    const pageCanvas = document.createElement('canvas');
    pageCanvas.width = canvas.width;
    pageCanvas.height = srcHeight;
    const ctx = pageCanvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, pageCanvas.width, pageCanvas.height);
      ctx.drawImage(
        canvas,
        0, srcY, canvas.width, srcHeight,
        0, 0, pageCanvas.width, srcHeight
      );
    }

    const pageImgData = pageCanvas.toDataURL('image/jpeg', 0.95);
    const sliceHeightMM = (srcHeight / canvas.width) * canvasWidthMM;

    doc.addImage(pageImgData, 'JPEG', 0, 0, A4_WIDTH_MM, sliceHeightMM);
  }

  const safeTitle = (filename || content.documentTitle || 'SOPFlow_Document')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .slice(0, 40);
  const outFilename = `${safeTitle}_v${content.metadata?.version || '1'}.pdf`;

  const blob = doc.output('blob');

  return {
    blob,
    pageCount,
    filename: outFilename,
  };
}

// ==============================================================
// OFFSCREEN VISUAL PDF EXPORT: Used by Dashboard & automated downloads
// Renders the exact SOPDocumentView component off-screen and exports PDF
// ==============================================================
export async function generateVisualSOPPdfFromData(
  content: SOPGeneratedContent,
  theme: SOPTheme,
  structure: SOPStructure,
  category: SOPCategory = 'operations',
  filename?: string
): Promise<{ blob: Blob; pageCount: number; filename: string }> {
  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.left = '-9999px';
  container.style.top = '0';
  container.style.width = '850px';
  container.style.backgroundColor = '#ffffff';
  container.style.zIndex = '-9999';
  document.body.appendChild(container);

  const root = createRoot(container);

  await new Promise<void>((resolve) => {
    root.render(
      React.createElement(SOPDocumentView, {
        content,
        theme,
        structure,
        category,
        editable: false,
      })
    );
    // Allow layout, styles, and images to settle
    setTimeout(resolve, 450);
  });

  try {
    const result = await generateSOPPdfFromElement(container, content, filename);
    return result;
  } finally {
    root.unmount();
    if (container.parentElement) {
      container.parentElement.removeChild(container);
    }
  }
}

// ==============================================================
// NATIVE BROWSER VECTOR PRINT / PDF EXPORT
// ==============================================================
export function printDocumentViaBrowser(): void {
  window.print();
}

// ==============================================================
// DIRECT JSPDF FALLBACK (pure programmatic fallback)
// ==============================================================
export async function generateSOPPdf(options: PDFExportOptions): Promise<{ blob: Blob; pageCount: number; filename: string }> {
  const { content, theme, organizationName } = options;
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
      cursorY = 22;
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

  if (content.disclaimer) {
    checkPageBreak(20);
    doc.setFillColor(254, 242, 242);
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

  content.sections.forEach((sec) => {
    checkPageBreak(18);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(...palette.primary);
    doc.text(sec.title, marginX, cursorY);
    cursorY += 2;

    doc.setDrawColor(...palette.border);
    doc.setLineWidth(0.3);
    doc.line(marginX, cursorY, marginX + contentWidth, cursorY);
    cursorY += 4.5;

    if (sec.content) {
      checkPageBreak(12);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(...palette.text);
      const contentLines = doc.splitTextToSize(sec.content, contentWidth);
      doc.text(contentLines, marginX, cursorY);
      cursorY += contentLines.length * 4.5 + 3;
    }

    if (sec.items && sec.items.length > 0) {
      sec.items.forEach((item, itemIdx) => {
        checkPageBreak(9);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8.8);
        doc.setTextColor(...palette.text);

        if (sec.type === 'checklist') {
          doc.setDrawColor(...palette.primary);
          doc.rect(marginX, cursorY - 3, 3.2, 3.2);
          const itemLines = doc.splitTextToSize(item, contentWidth - 7);
          doc.text(itemLines, marginX + 6, cursorY);
          cursorY += itemLines.length * 4.2 + 2;
        } else {
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

    cursorY += 4;
  });

  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(...palette.mutedText);
    doc.text('CONFIDENTIAL & PROPRIETARY — SUBJECT TO FORMAL APPROVAL', marginX, pageHeight - 7.5);
    doc.text(`Page ${i} of ${totalPages}`, pageWidth - marginX - 16, pageHeight - 7.5);
  }

  const safeTitle = (content.documentTitle || 'SOPFlow_Document')
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
