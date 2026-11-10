import React, { useRef, useEffect, useState } from 'react';
import type { SOPGeneratedContent, SOPTheme, SOPStructure, SOPCategory, SOPSection } from '../types/sop';
import { SOPDocumentView } from './SOPDocumentView';

interface A4PagedDocumentProps {
  content: SOPGeneratedContent;
  theme: SOPTheme;
  structure: SOPStructure;
  category?: SOPCategory;
  editable?: boolean;
  editingSectionId?: string | null;
  tempTitle?: string;
  tempContent?: string;
  onStartEditSection?: (sec: SOPSection) => void;
  onSaveEditSection?: (id: string) => void;
  onMoveSection?: (index: number, direction: 'up' | 'down') => void;
  onDeleteSection?: (id: string) => void;
  onTempTitleChange?: (val: string) => void;
  onTempContentChange?: (val: string) => void;
  documentRef?: React.RefObject<HTMLDivElement>;
}

// A4 dimensions at 96 DPI
const A4_WIDTH_PX = 794;
const A4_HEIGHT_PX = 1123;
const USABLE_PAGE_HEIGHT_PX = 1040;

export const A4PagedDocument: React.FC<A4PagedDocumentProps> = ({
  content,
  theme,
  structure,
  category,
  editable,
  editingSectionId,
  tempTitle,
  tempContent,
  onStartEditSection,
  onSaveEditSection,
  onMoveSection,
  onDeleteSection,
  onTempTitleChange,
  onTempContentChange,
  documentRef,
}) => {
  const [pageCount, setPageCount] = useState(1);
  const internalRef = useRef<HTMLDivElement>(null);
  const activeCaptureRef = documentRef || internalRef;

  // Measure content height and calculate page count
  useEffect(() => {
    const measure = () => {
      if (activeCaptureRef.current) {
        const contentHeight = activeCaptureRef.current.scrollHeight;
        const pages = Math.max(1, Math.ceil(contentHeight / USABLE_PAGE_HEIGHT_PX));
        setPageCount(pages);
      }
    };

    const timer = setTimeout(measure, 350);
    return () => clearTimeout(timer);
  }, [content, structure, editable]);

  return (
    <div className="flex flex-col items-center bg-slate-300/80 p-4 sm:p-8 min-h-screen">
      {/* Top Pagination Information Bar */}
      <div className="mb-4 px-4 py-1.5 rounded-full bg-slate-800 text-white text-xs font-semibold shadow-md flex items-center gap-3">
        <span>A4 Format (210mm × 297mm)</span>
        <span className="w-1 h-1 rounded-full bg-slate-400" />
        <span>Estimated Pages: {pageCount}</span>
        <span className="w-1 h-1 rounded-full bg-slate-400" />
        <span className="text-brand-300">1:1 PDF Rendering Match</span>
      </div>

      {/* Main Single-Pass Document Wrapper for 1:1 html2canvas PDF Export */}
      <div
        ref={activeCaptureRef}
        style={{
          width: `${A4_WIDTH_PX}px`,
          minHeight: `${A4_HEIGHT_PX}px`,
          backgroundColor: '#ffffff',
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.15)',
          border: '1px solid #d1d5db',
          position: 'relative',
        }}
        className="a4-document-container rounded-xs"
      >
        <SOPDocumentView
          content={content}
          theme={theme}
          structure={structure}
          category={category}
          editable={editable}
          editingSectionId={editingSectionId}
          tempTitle={tempTitle}
          tempContent={tempContent}
          onStartEditSection={onStartEditSection}
          onSaveEditSection={onSaveEditSection}
          onMoveSection={onMoveSection}
          onDeleteSection={onDeleteSection}
          onTempTitleChange={onTempTitleChange}
          onTempContentChange={onTempContentChange}
        />
      </div>
    </div>
  );
};
