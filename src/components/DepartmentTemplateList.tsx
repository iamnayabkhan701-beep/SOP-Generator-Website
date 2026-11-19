import React, { useState, useEffect } from 'react';
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
  Filter,
  CheckSquare,
  Sparkles,
} from 'lucide-react';
import type { SOPCategory } from '../types/sop';
import { CATEGORIES } from '../types/sop';
import {
  getTemplatesForDepartment,
  STANDARDS_DISCLAIMER,
  type DepartmentTemplate,
} from '../data/departmentTemplates';

interface DepartmentTemplateListProps {
  departmentId?: SOPCategory;
  onDepartmentChange?: (deptId: SOPCategory) => void;
  onBack?: () => void;
  onSelectTemplate: (template: DepartmentTemplate) => void;
  onCreateCustom?: () => void;
  initialSelectedId?: string;
  showDepartmentFilter?: boolean;
}

export const DepartmentTemplateList: React.FC<DepartmentTemplateListProps> = ({
  departmentId = 'warehouse',
  onDepartmentChange,
  onBack,
  onSelectTemplate,
  onCreateCustom,
  initialSelectedId,
  showDepartmentFilter = true,
}) => {
  // Active department state (allows seamless in-page department switching)
  const [activeDeptId, setActiveDeptId] = useState<SOPCategory>(departmentId);

  // Sync if parent prop changes
  useEffect(() => {
    setActiveDeptId(departmentId);
  }, [departmentId]);

  const currentDept = CATEGORIES.find((c) => c.id === activeDeptId);
  const allTemplates = getTemplatesForDepartment(activeDeptId);

  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(initialSelectedId || null);
  const [validationError, setValidationError] = useState<string | null>(null);

  // When active department changes, reset selection if the selected template does not belong to new department
  const handleDepartmentSwitch = (newDeptId: SOPCategory) => {
    setActiveDeptId(newDeptId);
    if (onDepartmentChange) {
      onDepartmentChange(newDeptId);
    }
    const newDeptTemplates = getTemplatesForDepartment(newDeptId);
    if (selectedId && !newDeptTemplates.some((t) => t.id === selectedId)) {
      setSelectedId(null);
    }
    setValidationError(null);
  };

  const filtered = allTemplates.filter(
    (t) =>
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.topicName.toLowerCase().includes(search.toLowerCase()) ||
      t.description.toLowerCase().includes(search.toLowerCase()) ||
      t.tags.some((tg) => tg.toLowerCase().includes(search.toLowerCase())) ||
      t.id.toLowerCase().includes(search.toLowerCase())
  );

  const selectedTemplate = allTemplates.find((t) => t.id === selectedId);

  // "Load Template" click handler:
  // - Sets that specific template as selected
  // - Highlights its card visually
  // - Shows a clear selected indicator
  // - Keeps ALL other template cards visible
  // - Does NOT filter or remove any other cards
  // - Does NOT navigate away
  const handleLoadTemplate = (tpl: DepartmentTemplate) => {
    setSelectedId(tpl.id);
    setValidationError(null);
  };

  // Continue button handler:
  // - If no template is selected, shows a clear validation message
  // - If a template is selected, proceeds to the next SOP creation step
  // - Passes exact selected template, department, and data to the next step
  const handleContinue = () => {
    if (!selectedTemplate) {
      setValidationError('Please select an SOP template to continue.');
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
      return;
    }
    setValidationError(null);
    onSelectTemplate(selectedTemplate);
  };

  // Primary operational departments for the filter tabs (excludes legacy aliases)
  const primaryDepartments = CATEGORIES.filter(
    (c) => !c.name.includes('(Legacy)') && c.id !== 'custom'
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Top Header & Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition flex items-center gap-1.5 text-xs font-semibold shadow-2xs cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          )}
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-brand-600 uppercase tracking-wider block">
                {currentDept?.name || 'Department'} • {allTemplates.length} Researched SOP Templates
              </span>
              <span className="px-2 py-0.2 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold rounded-md">
                All Templates on 1 Page
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-0.5">
              Standard Operating Procedure Templates
            </h2>
          </div>
        </div>

        {onCreateCustom && (
          <button
            type="button"
            onClick={onCreateCustom}
            className="px-4 py-2.5 rounded-xl border border-brand-200 bg-brand-50 text-brand-700 hover:bg-brand-100 transition text-xs font-bold flex items-center gap-2 self-start sm:self-auto shadow-2xs cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create Blank Custom SOP</span>
          </button>
        )}
      </div>

      {/* DEPARTMENT FILTER BAR (Allows immediate department switching without leaving page) */}
      {showDepartmentFilter && (
        <div className="space-y-2.5 bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-800 uppercase tracking-wider">
              <Filter className="w-3.5 h-3.5 text-brand-600" />
              <span>Filter by Department</span>
            </div>
            <span className="text-[11px] text-slate-400 font-medium">
              Click a department to view all its templates
            </span>
          </div>

          {/* Quick Department Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 pt-1 custom-scrollbar">
            {primaryDepartments.map((dept) => {
              const isCurrent = dept.id === activeDeptId;
              const deptTemplatesCount = getTemplatesForDepartment(dept.id).length;

              return (
                <button
                  key={dept.id}
                  type="button"
                  onClick={() => handleDepartmentSwitch(dept.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                    isCurrent
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                  }`}
                >
                  <span>{dept.name.split(' (')[0]}</span>
                  <span
                    className={`px-1.5 py-0.2 rounded-md text-[10px] font-semibold ${
                      isCurrent
                        ? 'bg-brand-500 text-white'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {deptTemplatesCount}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Search and Live Count Indicator */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={`Search all ${allTemplates.length} ${currentDept?.name} procedures by keyword, title, tag, or standard...`}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium"
          />
        </div>
        <div className="text-xs text-slate-500 font-semibold px-2 shrink-0">
          Showing {filtered.length} of {allTemplates.length} templates
        </div>
      </div>

      {/* Compliance / Standards Disclaimer Notice */}
      <div className="p-4 rounded-2xl bg-slate-100/80 border border-slate-200/80 text-xs text-slate-700 space-y-1">
        <div className="flex items-center gap-2 font-bold text-slate-900">
          <ShieldCheck className="w-4 h-4 text-brand-600 shrink-0" />
          <span>Industry Standards Architecture & Governance</span>
        </div>
        <p className="text-[11px] text-slate-600 leading-relaxed">
          {STANDARDS_DISCLAIMER}
        </p>
      </div>

      {/* TEMPLATES GRID: All templates rendered together on ONE single page */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((tpl) => {
            const isSelected = selectedId === tpl.id;

            return (
              <div
                key={tpl.id}
                onClick={() => handleLoadTemplate(tpl)}
                className={`p-5 rounded-3xl border transition-all flex flex-col justify-between relative cursor-pointer group ${
                  isSelected
                    ? 'border-emerald-600 bg-emerald-50/20 ring-2 ring-emerald-500/30 shadow-md'
                    : 'border-slate-200/90 bg-white hover:border-slate-300 hover:shadow-xs'
                }`}
              >
                <div className="space-y-3">
                  {/* Top Badges */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span
                        className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${
                          isSelected
                            ? 'bg-emerald-600 text-white border-emerald-600'
                            : 'bg-brand-50 text-brand-700 border-brand-200/60'
                        }`}
                      >
                        {tpl.id.toUpperCase().replace('SOP-', '')}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-wider">
                        {tpl.structure.replace('-', ' ')}
                      </span>
                      <span className="flex items-center gap-1 text-[11px] text-slate-500 font-medium">
                        <Clock className="w-3 h-3 text-slate-400" />
                        ~{tpl.estimatedPages || 3} {tpl.estimatedPages === 1 ? 'Page' : 'Pages'}
                      </span>
                    </div>

                    {/* Selected Indicator */}
                    {isSelected ? (
                      <span className="text-[11px] font-bold bg-emerald-600 text-white px-2.5 py-0.5 rounded-full flex items-center gap-1 shrink-0 shadow-2xs">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                        <span>Selected</span>
                      </span>
                    ) : tpl.isRegulated ? (
                      <span className="text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200/60 px-2 py-0.5 rounded-md flex items-center gap-1 shrink-0">
                        <AlertTriangle className="w-3 h-3 text-amber-600" />
                        Regulated
                      </span>
                    ) : null}
                  </div>

                  {/* Title & Topic */}
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 block uppercase tracking-wider">
                      {tpl.topicName}
                    </span>
                    <h3
                      className={`text-base font-bold leading-snug transition-colors mt-0.5 ${
                        isSelected ? 'text-emerald-950 font-black' : 'text-slate-900 group-hover:text-brand-600'
                      }`}
                    >
                      {tpl.title}
                    </h3>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                    {tpl.description}
                  </p>

                  {/* Referenced Standards */}
                  {tpl.referencedStandards && tpl.referencedStandards.length > 0 && (
                    <div className="pt-2 border-t border-slate-100 space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Standards:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {tpl.referencedStandards.slice(0, 2).map((std, i) => (
                          <span
                            key={i}
                            className="text-[10px] bg-slate-50 border border-slate-200 text-slate-700 px-1.5 py-0.5 rounded font-mono truncate max-w-full"
                          >
                            {std}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Card Action: Fixed "Load Template" Button */}
                <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex flex-wrap gap-1">
                    {tpl.tags.slice(0, 2).map((tag, i) => (
                      <span key={i} className="text-[10px] text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded">
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLoadTemplate(tpl);
                    }}
                    className={`px-3.5 py-2 rounded-xl font-bold text-xs transition flex items-center gap-1.5 shadow-xs cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-600 text-white hover:bg-emerald-700 ring-2 ring-emerald-500/20'
                        : 'bg-brand-600 hover:bg-brand-700 text-white'
                    }`}
                  >
                    {isSelected ? (
                      <>
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                        <span>Template Loaded</span>
                      </>
                    ) : (
                      <>
                        <CheckSquare className="w-3.5 h-3.5" />
                        <span>Load Template</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-8 rounded-3xl bg-white border border-slate-200 text-center space-y-3">
          <BookOpen className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="text-sm font-bold text-slate-800">
            No templates matching "{search}" in {currentDept?.name}
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Try a different search term or view all templates for this department.
          </p>
          <button
            type="button"
            onClick={() => setSearch('')}
            className="mt-2 px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-50 transition cursor-pointer"
          >
            Clear Search Filter
          </button>
        </div>
      )}

      {/* Validation Message (if user clicks Continue without selecting a template) */}
      {validationError && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-center justify-between gap-3 animate-in fade-in">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{validationError}</span>
          </div>
          <span className="text-[11px] text-rose-600 font-normal">
            Click "Load Template" on any card above.
          </span>
        </div>
      )}

      {/* STICKY PERSISTENT BOTTOM CONTINUE BAR */}
      <div className="sticky bottom-4 p-4 sm:p-5 bg-slate-900 text-white rounded-3xl shadow-2xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 z-20">
        <div className="space-y-0.5 text-center sm:text-left truncate max-w-xl">
          {selectedTemplate ? (
            <>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 flex items-center justify-center sm:justify-start gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Selected SOP Template Ready</span>
              </span>
              <div className="text-sm font-bold text-white truncate">
                {selectedTemplate.title}
              </div>
              <div className="text-[11px] text-slate-400">
                Department: {currentDept?.name} • Structure: {selectedTemplate.structure}
              </div>
            </>
          ) : (
            <>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-center sm:justify-start gap-1.5">
                <span className="w-2 h-2 rounded-full bg-slate-400" />
                <span>No Template Selected</span>
              </span>
              <div className="text-sm font-bold text-slate-300">
                Select a template above or click "Continue" to proceed.
              </div>
              <div className="text-[11px] text-slate-500">
                Department: {currentDept?.name} ({allTemplates.length} Available)
              </div>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={handleContinue}
          className={`w-full sm:w-auto px-7 py-3.5 rounded-2xl font-bold text-xs transition flex items-center justify-center gap-2 shadow-lg shrink-0 cursor-pointer ${
            selectedTemplate
              ? 'bg-brand-600 hover:bg-brand-500 text-white shadow-brand-500/25 ring-2 ring-brand-400/20'
              : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
          }`}
        >
          <span>Continue with Selected SOP</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
