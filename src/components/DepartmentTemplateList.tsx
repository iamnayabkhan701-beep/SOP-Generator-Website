import React, { useState } from 'react';
import {
  ArrowLeft,
  FileText,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Layers,
  ArrowRight,
  PlusCircle,
  AlertTriangle,
  BookOpen,
  Search,
  Check,
} from 'lucide-react';
import type { SOPCategory } from '../types/sop';
import { CATEGORIES } from '../types/sop';
import {
  getTemplatesForDepartment,
  STANDARDS_DISCLAIMER,
  type DepartmentTemplate,
} from '../data/departmentTemplates';

interface DepartmentTemplateListProps {
  departmentId: SOPCategory;
  onBack: () => void;
  onSelectTemplate: (template: DepartmentTemplate) => void;
  onCreateCustom: () => void;
  initialSelectedId?: string;
}

export const DepartmentTemplateList: React.FC<DepartmentTemplateListProps> = ({
  departmentId,
  onBack,
  onSelectTemplate,
  onCreateCustom,
  initialSelectedId,
}) => {
  const currentDept = CATEGORIES.find((c) => c.id === departmentId);
  const allTemplates = getTemplatesForDepartment(departmentId);

  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState<string>(
    initialSelectedId || (allTemplates.length > 0 ? allTemplates[0].id : '')
  );

  const filtered = allTemplates.filter(
    (t) =>
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.topicName.toLowerCase().includes(search.toLowerCase()) ||
      t.description.toLowerCase().includes(search.toLowerCase()) ||
      t.tags.some((tg) => tg.toLowerCase().includes(search.toLowerCase())) ||
      t.id.toLowerCase().includes(search.toLowerCase())
  );

  const selectedTemplate = allTemplates.find((t) => t.id === selectedId) || allTemplates[0];

  const handleCardClick = (tpl: DepartmentTemplate) => {
    setSelectedId(tpl.id);
  };

  const handleContinue = () => {
    if (selectedTemplate) {
      onSelectTemplate(selectedTemplate);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition flex items-center gap-1.5 text-xs font-semibold shadow-2xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Departments</span>
          </button>
          <div>
            <span className="text-[11px] font-bold text-brand-600 uppercase tracking-wider block">
              {currentDept?.name || 'Department'} • {allTemplates.length} Researched SOP Templates
            </span>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Select an SOP Template from the Catalog
            </h2>
          </div>
        </div>

        <button
          type="button"
          onClick={onCreateCustom}
          className="px-4 py-2.5 rounded-xl border border-brand-200 bg-brand-50 text-brand-700 hover:bg-brand-100 transition text-xs font-bold flex items-center gap-2 self-start sm:self-auto shadow-2xs"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Create Blank Custom SOP</span>
        </button>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={`Search ${allTemplates.length} SOPs in ${currentDept?.name || 'this department'}...`}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>
        <div className="text-xs text-slate-500 font-medium px-2 shrink-0">
          Showing {filtered.length} of {allTemplates.length} templates
        </div>
      </div>

      {/* Compliance / Standards Disclaimer Notice */}
      <div className="p-4 rounded-2xl bg-slate-100 border border-slate-200 text-xs text-slate-700 space-y-1.5">
        <div className="flex items-center gap-2 font-bold text-slate-900">
          <ShieldCheck className="w-4 h-4 text-brand-600 shrink-0" />
          <span>Regulatory & International Standards Architecture</span>
        </div>
        <p className="text-[11px] text-slate-600 leading-relaxed">
          {STANDARDS_DISCLAIMER}
        </p>
      </div>

      {/* Templates List Grid (All visible, selected card highlighted) */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filtered.map((tpl, idx) => {
            const isSelected = selectedId === tpl.id;

            return (
              <div
                key={tpl.id}
                onClick={() => handleCardClick(tpl)}
                className={`p-5 rounded-2xl border transition-all flex flex-col justify-between cursor-pointer relative ${
                  isSelected
                    ? 'border-brand-600 bg-brand-50/30 ring-2 ring-brand-500/20 shadow-md'
                    : 'border-slate-200/90 bg-white hover:border-slate-300 hover:shadow-xs'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`px-2.5 py-1 rounded-md text-[11px] font-bold border ${
                          isSelected
                            ? 'bg-brand-600 text-white border-brand-600'
                            : 'bg-brand-50 text-brand-700 border-brand-200/60'
                        }`}
                      >
                        {tpl.id.toUpperCase().replace('SOP-', '')}: {tpl.topicName}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-wider">
                        {tpl.structure.replace('-', ' ')}
                      </span>
                      <span className="flex items-center gap-1 text-[11px] text-slate-500 font-medium">
                        <Clock className="w-3 h-3 text-slate-400" />
                        ~{tpl.estimatedPages} {tpl.estimatedPages === 1 ? 'Page' : 'Pages'}
                      </span>
                    </div>

                    {isSelected && (
                      <span className="text-[11px] font-bold bg-emerald-600 text-white px-2.5 py-0.5 rounded-full flex items-center gap-1 shrink-0 shadow-2xs">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                        Selected
                      </span>
                    )}

                    {!isSelected && tpl.isRegulated && (
                      <span className="text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200/60 px-2 py-0.5 rounded-md flex items-center gap-1 shrink-0">
                        <AlertTriangle className="w-3 h-3 text-amber-600" />
                        Regulated
                      </span>
                    )}
                  </div>

                  <h3
                    className={`text-base font-bold leading-snug transition-colors ${
                      isSelected ? 'text-brand-900' : 'text-slate-900'
                    }`}
                  >
                    {tpl.title}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                    {tpl.description}
                  </p>

                  {/* Referenced Standards */}
                  {tpl.referencedStandards && tpl.referencedStandards.length > 0 && (
                    <div className="pt-2 border-t border-slate-100 space-y-1.5">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Compliance Benchmarks:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {tpl.referencedStandards.map((std, i) => (
                          <span
                            key={i}
                            className="text-[10px] bg-white border border-slate-200 text-slate-700 px-2 py-0.5 rounded font-mono"
                          >
                            {std}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex flex-wrap gap-1">
                    {tpl.tags.slice(0, 3).map((tag, i) => (
                      <span key={i} className="text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectTemplate(tpl);
                    }}
                    className={`px-4 py-2 rounded-xl font-semibold text-xs transition flex items-center gap-1.5 shadow-xs ${
                      isSelected
                        ? 'bg-slate-900 text-white hover:bg-black'
                        : 'bg-brand-600 hover:bg-brand-700 text-white'
                    }`}
                  >
                    <span>{isSelected ? 'Customize Now' : 'Select'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-8 rounded-2xl bg-white border border-slate-200 text-center space-y-3">
          <BookOpen className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="text-sm font-bold text-slate-800">
            No SOPs matching "{search}"
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Try searching for a different keyword or view all templates.
          </p>
          <button
            type="button"
            onClick={() => setSearch('')}
            className="mt-2 px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-50 transition"
          >
            Clear Search Filter
          </button>
        </div>
      )}

      {/* Sticky / Persistent Bottom Continue Bar */}
      {selectedTemplate && (
        <div className="sticky bottom-4 p-4 bg-slate-900 text-white rounded-2xl shadow-xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 z-10 animate-in fade-in slide-in-from-bottom-2">
          <div className="space-y-0.5 text-center sm:text-left">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 flex items-center justify-center sm:justify-start gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Selected SOP Template Ready</span>
            </span>
            <div className="text-sm font-bold text-white truncate max-w-lg">
              {selectedTemplate.title}
            </div>
            <div className="text-[11px] text-slate-400">
              Department: {currentDept?.name} • Structure: {selectedTemplate.structure}
            </div>
          </div>

          <button
            type="button"
            onClick={handleContinue}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs transition flex items-center justify-center gap-2 shadow-md shadow-brand-500/20 shrink-0"
          >
            <span>Continue with Selected SOP</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
