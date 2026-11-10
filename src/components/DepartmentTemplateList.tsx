import React from 'react';
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
  BookOpen
} from 'lucide-react';
import type { SOPCategory } from '../types/sop';
import { CATEGORIES } from '../types/sop';
import {
  getTemplatesForDepartment,
  STANDARDS_DISCLAIMER,
  type DepartmentTemplate
} from '../data/departmentTemplates';

interface DepartmentTemplateListProps {
  departmentId: SOPCategory;
  onBack: () => void;
  onSelectTemplate: (template: DepartmentTemplate) => void;
  onCreateCustom: () => void;
}

export const DepartmentTemplateList: React.FC<DepartmentTemplateListProps> = ({
  departmentId,
  onBack,
  onSelectTemplate,
  onCreateCustom,
}) => {
  const currentDept = CATEGORIES.find(c => c.id === departmentId);
  const templates = getTemplatesForDepartment(departmentId);

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
              {currentDept?.name || 'Department'} • {templates.length} Standard Topics
            </span>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Select a Topic to Customize & Generate SOP
            </h2>
          </div>
        </div>

        <button
          type="button"
          onClick={onCreateCustom}
          className="px-4 py-2.5 rounded-xl border border-brand-200 bg-brand-50 text-brand-700 hover:bg-brand-100 transition text-xs font-bold flex items-center gap-2 self-start sm:self-auto shadow-2xs"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Create Blank Custom SOP for {currentDept?.name}</span>
        </button>
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

      {/* Topics List */}
      {templates.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {templates.map((tpl, idx) => (
            <div
              key={tpl.id}
              className="p-5 rounded-2xl border border-slate-200/90 bg-white hover:border-brand-500 hover:shadow-md transition-all flex flex-col justify-between group relative"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2.5 py-1 rounded-md bg-brand-50 text-brand-700 text-[11px] font-bold border border-brand-200/60">
                      Topic {idx + 1}: {tpl.topicName || tpl.title.split('for ')[1] || tpl.title}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-wider">
                      {tpl.structure.replace('-', ' ')}
                    </span>
                    <span className="flex items-center gap-1 text-[11px] text-slate-500 font-medium">
                      <Clock className="w-3 h-3 text-slate-400" />
                      ~{tpl.estimatedPages} {tpl.estimatedPages === 1 ? 'Page' : 'Pages'}
                    </span>
                  </div>

                  {tpl.isRegulated && (
                    <span className="text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200/60 px-2 py-0.5 rounded-md flex items-center gap-1 shrink-0">
                      <AlertTriangle className="w-3 h-3 text-amber-600" />
                      Regulated
                    </span>
                  )}
                </div>

                <h3 className="text-base font-bold text-slate-900 group-hover:text-brand-600 transition-colors leading-snug">
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
                          className="text-[10px] bg-slate-50 border border-slate-200 text-slate-700 px-2 py-0.5 rounded font-mono"
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
                  onClick={() => onSelectTemplate(tpl)}
                  className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs transition flex items-center gap-1.5 shadow-xs"
                >
                  <span>Select & Customize</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-8 rounded-2xl bg-white border border-slate-200 text-center space-y-3">
          <BookOpen className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="text-sm font-bold text-slate-800">
            No Pre-Configured Templates Found for {currentDept?.name}
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            You can configure a specialized, audit-ready procedure for this department using our flexible procedural generator.
          </p>
          <button
            type="button"
            onClick={onCreateCustom}
            className="mt-2 px-5 py-2.5 rounded-xl bg-brand-600 text-white font-bold text-xs hover:bg-brand-700 transition inline-flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Generate Custom SOP for {currentDept?.name}</span>
          </button>
        </div>
      )}
    </div>
  );
};

