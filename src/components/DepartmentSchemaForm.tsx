import React from 'react';
import {
  Sparkles,
  ShieldAlert,
  Info,
  CheckCircle2,
  FileText,
  Sliders,
  Award,
} from 'lucide-react';
import type { SOPFormData } from '../types/sop';
import { getDepartmentSchema, type DepartmentTopicPreset } from '../data/departmentSchemas';

interface DepartmentSchemaFormProps {
  departmentId: string;
  formData: SOPFormData;
  onChangeFormData: (updates: Partial<SOPFormData>) => void;
  departmentAnswers: Record<string, string>;
  onChangeDepartmentAnswer: (fieldId: string, value: string) => void;
}

export const DepartmentSchemaForm: React.FC<DepartmentSchemaFormProps> = ({
  departmentId,
  formData,
  onChangeFormData,
  departmentAnswers,
  onChangeDepartmentAnswer,
}) => {
  const schema = getDepartmentSchema(departmentId);

  const handleApplyPreset = (preset: DepartmentTopicPreset) => {
    onChangeFormData({
      title: preset.title,
      selectedTopic: preset.topicName,
      sopId: preset.sopId,
      purpose: preset.purpose,
      scope: preset.scope,
      responsibilities: preset.responsibilities,
      procedureDetails: preset.procedureDetails,
      qualityChecks: preset.qualityControls,
      safetyRisk: preset.safetyRisks,
      documentationRecords: preset.recordsRetention,
      references: preset.standardsReferences,
    });

    // Populate all department-specific answers
    Object.entries(preset.departmentAnswers).forEach(([k, v]) => {
      onChangeDepartmentAnswer(k, v);
    });
  };

  const coreFields = schema.fields.filter((f) => f.section === 'core');
  const procedureFields = schema.fields.filter((f) => f.section === 'procedure');
  const controlFields = schema.fields.filter((f) => f.section === 'control');
  const recordFields = schema.fields.filter((f) => f.section === 'records');

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      
      {/* Department Header Banner */}
      <div className="p-5 bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-3xl shadow-sm border border-slate-700/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Department Schema Active
            </span>
          </div>
          <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <span>{schema.name}</span>
          </h2>
          <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
            {schema.description}
          </p>
        </div>

        {/* Governing Standards Badges */}
        <div className="flex flex-wrap gap-1.5 shrink-0 max-w-xs justify-start md:justify-end">
          {schema.governingStandards.map((std, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 font-mono"
            >
              <Award className="w-3 h-3 text-brand-400" />
              <span>{std}</span>
            </span>
          ))}
        </div>
      </div>

      {/* Recommended Topics / Presets Bar */}
      {schema.topics.length > 0 && (
        <div className="bg-brand-50/60 p-5 rounded-2xl border border-brand-100/80 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-900 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-brand-600" />
              <span>Quick-Load Industry Standard Templates ({schema.topics.length} Available)</span>
            </span>
            <span className="text-[11px] text-brand-700 hidden sm:inline">
              Click any topic to pre-fill all questions with audited criteria
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {schema.topics.map((t, idx) => {
              const isSelected = formData.selectedTopic === t.topicName;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleApplyPreset(t)}
                  className={`text-left p-3 rounded-xl border transition flex flex-col justify-between group ${
                    isSelected
                      ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                      : 'bg-white hover:bg-slate-50 border-slate-200/90 text-slate-800'
                  }`}
                >
                  <div className="space-y-1">
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-semibold ${
                        isSelected ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {t.sopId}
                    </span>
                    <h4 className="text-xs font-bold tracking-tight line-clamp-1 mt-1">
                      {t.topicName}
                    </h4>
                  </div>
                  <span
                    className={`text-[10px] mt-2 font-medium ${
                      isSelected ? 'text-brand-300' : 'text-brand-600 group-hover:underline'
                    }`}
                  >
                    {isSelected ? '✓ Active Template' : 'Load Template →'}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* SECTION 1: CORE SOP METADATA */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-100 pb-2 flex items-center gap-2">
          <FileText className="w-4 h-4 text-slate-500" />
          <span>Document Title & Organizational Identification</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Organization / Company Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={formData.companyName}
              onChange={(e) => onChangeFormData({ companyName: e.target.value })}
              placeholder="e.g. Apex Global Industries"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Target Department <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={formData.department}
              onChange={(e) => onChangeFormData({ department: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 text-sm font-medium"
              readOnly
            />
          </div>

          <div className="sm:col-span-3">
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              SOP Document Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => onChangeFormData({ title: e.target.value })}
              placeholder={`e.g. ${schema.name} Standard Operational Procedure`}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm font-bold text-slate-900"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              SOP Document Code / ID
            </label>
            <input
              type="text"
              value={formData.sopId || ''}
              onChange={(e) => onChangeFormData({ sopId: e.target.value })}
              placeholder={`SOP-${schema.shortName.toUpperCase().slice(0, 3)}-001`}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 font-mono text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Version Number
            </label>
            <input
              type="text"
              value={formData.version || '1.0'}
              onChange={(e) => onChangeFormData({ version: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 font-mono text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Effective Date
            </label>
            <input
              type="date"
              value={formData.effectiveDate}
              onChange={(e) => onChangeFormData({ effectiveDate: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs"
            />
          </div>
        </div>
      </div>

      {/* SECTION 2: PURPOSE, SCOPE & RESPONSIBILITIES */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-100 pb-2">
          Operational Scope & Core Purpose
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              1. Purpose & Objectives <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={2}
              value={formData.purpose}
              onChange={(e) => onChangeFormData({ purpose: e.target.value })}
              placeholder="State the core objective, compliance requirement, or risk eliminated by this SOP..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              2. Scope & Applicability <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={2}
              value={formData.scope}
              onChange={(e) => onChangeFormData({ scope: e.target.value })}
              placeholder="Define who, which facilities, departments, equipment, and workflows are covered..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              3. Roles, Responsibilities & Authority
            </label>
            <textarea
              rows={2}
              value={formData.responsibilities || ''}
              onChange={(e) => onChangeFormData({ responsibilities: e.target.value })}
              placeholder="e.g. Lead Operator: Executes daily steps; Quality Lead: Conducts verification; Manager: Authorizes deviations"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
            />
          </div>
        </div>
      </div>

      {/* SECTION 3: DEPARTMENT-SPECIFIC SPECIALIZED FIELDS */}
      <div className="bg-white p-6 rounded-2xl border border-brand-200 shadow-xs space-y-6">
        <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-brand-600">
              Department Exclusive Questionnaire
            </span>
            <h3 className="text-base font-extrabold text-slate-900 tracking-tight flex items-center gap-2 mt-0.5">
              <Sliders className="w-4 h-4 text-brand-600" />
              <span>{schema.name} Specific Parameters & Controls</span>
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-medium hidden sm:inline">
            Tailored specifically for {schema.shortName}
          </span>
        </div>

        {/* Dynamic Fields rendered from schema */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {schema.fields.map((fld) => {
            const val = departmentAnswers[fld.id] || fld.defaultValue || '';
            const isWide = fld.type === 'textarea';

            return (
              <div key={fld.id} className={isWide ? 'md:col-span-2' : ''}>
                <label className="block text-xs font-semibold text-slate-800 mb-1">
                  {fld.label} {fld.required && <span className="text-rose-500">*</span>}
                </label>
                {fld.description && (
                  <p className="text-[11px] text-slate-500 mb-1.5 leading-relaxed">
                    {fld.description}
                  </p>
                )}

                {fld.type === 'textarea' ? (
                  <textarea
                    rows={3}
                    value={val}
                    onChange={(e) => onChangeDepartmentAnswer(fld.id, e.target.value)}
                    placeholder={fld.placeholder}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 text-xs leading-relaxed"
                  />
                ) : (
                  <input
                    type="text"
                    value={val}
                    onChange={(e) => onChangeDepartmentAnswer(fld.id, e.target.value)}
                    placeholder={fld.placeholder}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 text-xs"
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 4: STEP-BY-STEP OPERATIONAL PROCEDURES */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-100 pb-2">
          Detailed Step-by-Step Procedure Details
        </h3>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
            Numbered Procedural Steps & Action Items <span className="text-rose-500">*</span>
          </label>
          <p className="text-[11px] text-slate-500 mb-2">
            Enter steps or bullet points. The generation engine numbers, aligns, and formats them into formal ISO standard procedures.
          </p>
          <textarea
            rows={7}
            value={formData.procedureDetails}
            onChange={(e) => onChangeFormData({ procedureDetails: e.target.value })}
            placeholder="1. Verify prerequisites and system readiness...&#10;2. Execute primary operational process...&#10;3. Perform intermediate quality verification...&#10;4. Escalate non-conformances...&#10;5. Conclude execution and sign off."
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 text-xs font-mono leading-relaxed"
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Quality Checks & Acceptance Criteria
            </label>
            <textarea
              rows={3}
              value={formData.qualityChecks || ''}
              onChange={(e) => onChangeFormData({ qualityChecks: e.target.value })}
              placeholder="e.g. Zero critical defects, 100% inspection pass rate, dual sign-off"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Safety Controls & Risk Mitigation
            </label>
            <textarea
              rows={3}
              value={formData.safetyRisk || ''}
              onChange={(e) => onChangeFormData({ safetyRisk: e.target.value })}
              placeholder="e.g. Mandatory PPE, LOTO isolation, data encryption, emergency contact"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Documentation & Record Retention
            </label>
            <input
              type="text"
              value={formData.documentationRecords || ''}
              onChange={(e) => onChangeFormData({ documentationRecords: e.target.value })}
              placeholder="e.g. Log sheet ARCH-02 retained for 7 years"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Governing Standards & Regulatory References
            </label>
            <input
              type="text"
              value={formData.references || ''}
              onChange={(e) => onChangeFormData({ references: e.target.value })}
              placeholder={`e.g. ${schema.governingStandards.join(', ')}`}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs"
            />
          </div>
        </div>
      </div>

      {/* SECTION 5: FORMAL AUTHORIZATION SIGN-OFFS */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-100 pb-2">
          Document Sign-Off Personnel & Authorizations
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Prepared By (Author)</label>
            <input
              type="text"
              value={formData.preparedBy}
              onChange={(e) => onChangeFormData({ preparedBy: e.target.value })}
              placeholder="e.g. Senior Specialist"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Reviewed By (Technical Lead)</label>
            <input
              type="text"
              value={formData.reviewedBy}
              onChange={(e) => onChangeFormData({ reviewedBy: e.target.value })}
              placeholder="e.g. Quality Assurance Lead"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Approved By (Department Head)</label>
            <input
              type="text"
              value={formData.approvedBy}
              onChange={(e) => onChangeFormData({ approvedBy: e.target.value })}
              placeholder="e.g. Vice President / Director"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold"
            />
          </div>
        </div>
      </div>

    </div>
  );
};

