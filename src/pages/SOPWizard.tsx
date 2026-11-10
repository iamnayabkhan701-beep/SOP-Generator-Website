import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import {
  FileText,
  FileCheck,
  ArrowRight,
  ArrowLeft,
  Check,
  ShieldAlert,
  Palette,
  LayoutTemplate,
  Sliders,
  CheckCircle2,
  Users,
  Server,
  Cpu,
  Activity,
  Coins,
  Headphones,
  Building2,
  Layers,
  FileSpreadsheet,
  AlertTriangle,
  Warehouse,
  GitBranch,
  Truck,
  HardHat,
  ShoppingBag,
  ChefHat,
  ShieldCheck,
  Leaf,
  TrendingUp,
  Megaphone,
  Scale,
  Laptop,
  ClipboardList,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { TemplateGallery } from '../components/TemplateGallery';
import { DepartmentSelector } from '../components/DepartmentSelector';
import { DepartmentTemplateList } from '../components/DepartmentTemplateList';
import { DepartmentSchemaForm } from '../components/DepartmentSchemaForm';
import type { DepartmentTemplate } from '../data/departmentTemplates';
import {
  CATEGORIES,
  THEMES,
  STRUCTURES,
  type SOPCategory,
  type SOPTheme,
  type SOPStructure,
  type SOPFormData,
  type TargetPageLength,
  type SOPDocument,
} from '../types/sop';
import { createSOPDocument, fetchDocumentById, updateSOPDocument } from '../lib/supabase';
import { generateSOP } from '../lib/aiGenerator';

export const SOPWizard: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [step, setStep] = useState<number>(1);
  const [step1SubView, setStep1SubView] = useState<'departments' | 'templates'>('departments');
  const [loadingInitial, setLoadingInitial] = useState(false);

  // Wizard State
  const [selectedCategory, setSelectedCategory] = useState<SOPCategory>('warehouse');
  const [selectedTheme, setSelectedTheme] = useState<SOPTheme>('professional-blue');
  const [selectedStructure, setSelectedStructure] = useState<SOPStructure>('standard');
  const [targetPageLength, setTargetPageLength] = useState<TargetPageLength>('standard');
  const [customPageCount, setCustomPageCount] = useState<number>(4);
  const [additionalInstructions, setAdditionalInstructions] = useState<string>('');

  // Handle URL query parameter ?structure=
  useEffect(() => {
    const structParam = searchParams.get('structure') as SOPStructure;
    if (structParam && STRUCTURES.some((s) => s.id === structParam)) {
      setSelectedStructure(structParam);
    }
  }, [searchParams]);

  // Form Fields
  const [formData, setFormData] = useState<SOPFormData>({
    companyName: 'Acme Enterprise Solutions',
    department: 'IT Operations',
    title: 'Production Incident Response & Rollback Protocol',
    sopId: 'SOP-OPS-101',
    purpose: 'Standardize immediate response procedures when high-severity production anomalies occur.',
    scope: 'All engineering, devops, and site reliability teams managing cloud infrastructure.',
    responsibilities: 'Primary On-Call SRE (Lead), Engineering Manager (Communications), SecOps (Security validation).',
    procedureDetails: '1. Detect anomaly and acknowledge alert within 5 minutes.\n2. Isolate impacted node or microservice via traffic routing switch.\n3. Execute automated rollback script if health check fails after 3 retries.\n4. Log timeline and establish incident bridge channel.',
    requiredTools: 'Grafana dashboards, PagerDuty, AWS/GCP Console, GitHub Actions.',
    safetyRisk: 'Premature database rollbacks without transaction locks can lead to orphaned customer records.',
    relatedDocuments: 'Disaster Recovery Manual v3.2, IT Security Baseline Policy.',
    preparedBy: 'Lead DevOps Architect',
    reviewedBy: 'Director of Infrastructure',
    approvedBy: 'Chief Technology Officer',
    effectiveDate: new Date().toISOString().split('T')[0],
    version: '1.0',
    targetPageLength: 'standard',
    categorySpecific: {},
  });

  // Generation progress state
  const [isGenerating, setIsGenerating] = useState(false);
  const [progressStatus, setProgressStatus] = useState('');

  // Load existing doc if editing
  useEffect(() => {
    if (id && user) {
      setLoadingInitial(true);
      fetchDocumentById(id).then((doc) => {
        if (doc) {
          setSelectedCategory(doc.category);
          setSelectedTheme(doc.theme);
          setSelectedStructure(doc.structure);
          if (doc.form_data) {
            setFormData(doc.form_data);
            setTargetPageLength(doc.form_data.targetPageLength || 'standard');
            setAdditionalInstructions(doc.form_data.additionalInstructions || '');
          }
        }
        setLoadingInitial(false);
      });
    }
  }, [id, user]);

  const updateCategorySpecific = (key: string, val: string) => {
    setFormData((prev) => ({
      ...prev,
      categorySpecific: {
        ...prev.categorySpecific,
        [key]: val,
      },
    }));
  };

  const handleSelectDepartmentTemplate = (tpl: DepartmentTemplate) => {
    setSelectedCategory(tpl.departmentId);
    setSelectedStructure(tpl.structure);
    const catMeta = CATEGORIES.find((c) => c.id === tpl.departmentId);
    setFormData((prev) => ({
      ...prev,
      title: tpl.title,
      selectedTopic: tpl.topicName || tpl.title,
      department: catMeta ? catMeta.name : prev.department,
      purpose: tpl.purpose,
      scope: tpl.scope,
      responsibilities: tpl.responsibilities,
      requiredResources: tpl.requiredResources,
      requiredTools: tpl.requiredResources,
      procedureDetails: tpl.procedureDetails,
      safetyRisk: tpl.safetyRisk || prev.safetyRisk || '',
      qualityChecks: tpl.qualityChecks || prev.qualityChecks || '',
      documentationRecords: tpl.documentationRecords || prev.documentationRecords || '',
      references: tpl.references || prev.references || '',
      relatedDocuments: tpl.references || prev.relatedDocuments || '',
      sopId: `SOP-${tpl.departmentId.toUpperCase().slice(0, 3)}-${Math.floor(100 + Math.random() * 900)}`,
      version: prev.version || '1.0',
      effectiveDate: prev.effectiveDate || new Date().toISOString().split('T')[0],
    }));
    // Open the actual customization form (Step 3)!
    setStep(3);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNextStep = () => {
    if (step === 3) {
      if (!formData.title.trim()) {
        alert('Please enter an SOP Title.');
        return;
      }
      if (!formData.purpose.trim()) {
        alert('Please enter the Purpose of the SOP.');
        return;
      }
    }
    setStep((s) => Math.min(s + 1, 4));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrevStep = () => {
    setStep((s) => Math.max(s - 1, 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGenerate = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    setIsGenerating(true);
    setProgressStatus('Initiating procedural generation...');

    try {
      const fullFormData: SOPFormData = {
        ...formData,
        targetPageLength,
        customPageCount: targetPageLength === 'custom' ? customPageCount : undefined,
        additionalInstructions,
      };

      // 1. Generate content via AI function
      const generatedContent = await generateSOP({
        category: selectedCategory,
        theme: selectedTheme,
        structure: selectedStructure,
        formData: fullFormData,
        onProgress: (status) => setProgressStatus(status),
      });

      // 2. Persist to Supabase
      const docPayload: Omit<SOPDocument, 'created_at' | 'updated_at'> = {
        id: id || crypto.randomUUID(),
        user_id: user.id,
        title: formData.title,
        category: selectedCategory,
        selected_topic: formData.selectedTopic || formData.title,
        theme: selectedTheme,
        structure: selectedStructure,
        target_page_count: targetPageLength === 'short' ? 2 : targetPageLength === 'detailed' ? 8 : 4,
        status: 'ready',
        form_data: fullFormData,
        generated_content: generatedContent,
        edited_content: generatedContent,
        version: 1,
      };

      if (id) {
        await updateSOPDocument(id, docPayload);
        navigate(`/sop/${id}/preview`);
      } else {
        const saved = await createSOPDocument(docPayload);
        navigate(`/sop/${saved.id}/preview`);
      }
    } catch (err: any) {
      console.error('Generation error:', err);
      alert('Generation encounter a problem: ' + err.message);
      setIsGenerating(false);
    }
  };

  const activeCategoryMeta = CATEGORIES.find((c) => c.id === selectedCategory);

  const getCatIcon = (iconName: string) => {
    switch (iconName) {
      case 'Users': return <Users className="w-5 h-5" />;
      case 'Server': return <Server className="w-5 h-5" />;
      case 'ShieldAlert': return <ShieldAlert className="w-5 h-5" />;
      case 'Cpu': return <Cpu className="w-5 h-5" />;
      case 'Activity': return <Activity className="w-5 h-5" />;
      case 'Coins': return <Coins className="w-5 h-5" />;
      case 'Headphones': return <Headphones className="w-5 h-5" />;
      case 'Building2': return <Building2 className="w-5 h-5" />;
      case 'Layers': return <Layers className="w-5 h-5" />;
      case 'Warehouse': return <Warehouse className="w-5 h-5" />;
      case 'GitBranch': return <GitBranch className="w-5 h-5" />;
      case 'Truck': return <Truck className="w-5 h-5" />;
      case 'HardHat': return <HardHat className="w-5 h-5" />;
      case 'ShoppingBag': return <ShoppingBag className="w-5 h-5" />;
      case 'ChefHat': return <ChefHat className="w-5 h-5" />;
      case 'ShieldCheck': return <ShieldCheck className="w-5 h-5" />;
      case 'Leaf': return <Leaf className="w-5 h-5" />;
      case 'TrendingUp': return <TrendingUp className="w-5 h-5" />;
      case 'Megaphone': return <Megaphone className="w-5 h-5" />;
      case 'Scale': return <Scale className="w-5 h-5" />;
      case 'Laptop': return <Laptop className="w-5 h-5" />;
      case 'ClipboardList': return <ClipboardList className="w-5 h-5" />;
      case 'CheckCircle2': return <CheckCircle2 className="w-5 h-5" />;
      default: return <FileSpreadsheet className="w-5 h-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Wizard Steps Navigation Bar */}
        <div className="bg-white p-4 sm:p-6 rounded-3xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between">
            {[
              { num: 1, label: 'Department' },
              { num: 2, label: 'Theme & Structure' },
              { num: 3, label: 'SOP Information' },
              { num: 4, label: 'Length & Generate' },
            ].map((st, idx) => (
              <React.Fragment key={st.num}>
                <div className="flex items-center gap-2 sm:gap-3">
                  <div
                    className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center font-bold text-xs sm:text-sm transition-all ${
                      step === st.num
                        ? 'bg-brand-600 text-white shadow-md shadow-brand-500/20'
                        : step > st.num
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-slate-100 text-slate-400'
                    }`}
                  >
                    {step > st.num ? <Check className="w-4 h-4 stroke-[3]" /> : st.num}
                  </div>
                  <span
                    className={`hidden sm:inline text-xs font-semibold ${
                      step === st.num ? 'text-slate-900 font-bold' : 'text-slate-400'
                    }`}
                  >
                    {st.label}
                  </span>
                </div>
                {idx < 3 && <div className="flex-1 h-0.5 mx-2 bg-slate-100 max-w-[60px]" />}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* STEP 1: DEPARTMENT & TEMPLATE SELECTION */}
        {step === 1 && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6 animate-in fade-in duration-200">
            {step1SubView === 'departments' ? (
              <DepartmentSelector
                selectedDept={selectedCategory}
                onSelectDepartment={(deptId) => {
                  setSelectedCategory(deptId);
                  const cat = CATEGORIES.find((c) => c.id === deptId);
                  if (cat) {
                    setFormData((p) => ({ ...p, department: cat.name }));
                  }
                  setStep1SubView('templates');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            ) : (
              <DepartmentTemplateList
                departmentId={selectedCategory}
                onBack={() => setStep1SubView('departments')}
                onSelectTemplate={(tpl) => handleSelectDepartmentTemplate(tpl)}
                onCreateCustom={() => {
                  setStep(2);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            )}

            {/* High-Risk Disclaimer Banner if applicable */}
            {activeCategoryMeta?.isRegulatedOrHighRisk && (
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200/80 text-amber-900 text-xs flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block text-sm mb-0.5">Regulated Industry Notice</span>
                  <p>{activeCategoryMeta.disclaimer}</p>
                </div>
              </div>
            )}

            {step1SubView === 'departments' && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setStep1SubView('templates')}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold text-xs flex items-center justify-center gap-1.5 transition"
                >
                  <span>Browse {activeCategoryMeta?.name} Topic Templates</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setStep(2);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm shadow-md shadow-brand-500/20 transition flex items-center justify-center gap-2"
                >
                  <span>Continue to Structure & Theme</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* STEP 2: THEME & STRUCTURE (INDEPENDENT) */}
        {step === 2 && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-8 animate-in fade-in duration-200">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-brand-600">Step 2 of 4</span>
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
                Visual Theme & Document Structure
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Visual appearance is independent from procedural structure. Themes ensure print clarity, while structures organize document flow.
              </p>
            </div>

            {/* Themes */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Palette className="w-4 h-4 text-brand-600" />
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  Select Visual Theme (Colors & Contrast)
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {THEMES.map((theme) => {
                  const isSelected = selectedTheme === theme.id;
                  return (
                    <button
                      key={theme.id}
                      type="button"
                      onClick={() => setSelectedTheme(theme.id)}
                      className={`p-4 rounded-2xl border text-left transition-all relative ${
                        isSelected
                          ? 'border-brand-600 bg-brand-50/40 ring-2 ring-brand-500/20 shadow-sm'
                          : 'border-slate-200/80 hover:border-slate-300 hover:bg-slate-50/50'
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div
                          className="w-6 h-6 rounded-full shadow-sm shrink-0 border border-black/10"
                          style={{ backgroundColor: theme.primaryColor }}
                        />
                        <span className="text-sm font-bold text-slate-900">{theme.name}</span>
                      </div>
                      <p className="text-xs text-slate-500 leading-relaxed">{theme.description}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Structures & Visual Templates */}
            <div className="space-y-4 border-t border-slate-100 pt-6">
              <div className="flex items-center gap-2">
                <LayoutTemplate className="w-4 h-4 text-brand-600" />
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  Select SOP Template Format & Layout
                </h3>
              </div>
              <TemplateGallery
                selectedStructure={selectedStructure}
                onSelectStructure={setSelectedStructure}
                showSelectOnly={true}
              />
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={handlePrevStep}
                className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 font-semibold text-xs flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                type="button"
                onClick={handleNextStep}
                className="px-6 py-3 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm shadow-md shadow-brand-500/20 transition flex items-center gap-2"
              >
                <span>Continue to SOP Information</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: DYNAMIC DEPARTMENT-SPECIFIC SCHEMA FORM */}
        {step === 3 && (
          <div className="space-y-6">
            <DepartmentSchemaForm
              departmentId={selectedCategory}
              formData={formData}
              onChangeFormData={(updates) => setFormData((p) => ({ ...p, ...updates }))}
              departmentAnswers={formData.categorySpecific || {}}
              onChangeDepartmentAnswer={(fieldId, val) => updateCategorySpecific(fieldId, val)}
            />

            <div className="flex items-center justify-between pt-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
              <button
                type="button"
                onClick={handlePrevStep}
                className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 font-semibold text-xs flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Structure & Theme</span>
              </button>
              <button
                type="button"
                onClick={handleNextStep}
                className="px-6 py-3 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm shadow-md shadow-brand-500/20 transition flex items-center gap-2"
              >
                <span>Continue to Page Length & Generate</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: PAGE LENGTH & ADDITIONAL INSTRUCTIONS */}
        {step === 4 && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6 animate-in fade-in duration-200">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-brand-600">Step 4 of 4</span>
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
                Document Length & Custom Instructions
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Set target length and fine-tune terminology or tone before generating the draft.
              </p>
            </div>

            {/* Target Page Count selection */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider">
                Target Page Length
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                {[
                  { id: 'short', label: 'Short', pages: '1–2 Pages', desc: 'Concise summary SOP' },
                  { id: 'standard', label: 'Standard', pages: '3–5 Pages', desc: 'Balanced detail' },
                  { id: 'detailed', label: 'Detailed', pages: '6–10 Pages', desc: 'Exhaustive enterprise' },
                  { id: 'custom', label: 'Custom', pages: 'Custom Count', desc: 'Specify exact target' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setTargetPageLength(item.id as TargetPageLength)}
                    className={`p-4 rounded-2xl border text-left transition-all ${
                      targetPageLength === item.id
                        ? 'border-brand-600 bg-brand-50/50 ring-2 ring-brand-500/20 shadow-sm'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <span className="font-bold text-sm text-slate-900 block">{item.label}</span>
                    <span className="text-xs font-semibold text-brand-600 block mt-0.5">{item.pages}</span>
                    <span className="text-[11px] text-slate-400 block mt-1">{item.desc}</span>
                  </button>
                ))}
              </div>

              {targetPageLength === 'custom' && (
                <div className="pt-2">
                  <label className="block text-xs font-medium text-slate-700 mb-1">Target Page Count</label>
                  <input
                    type="number"
                    min={1}
                    max={25}
                    value={customPageCount}
                    onChange={(e) => setCustomPageCount(Number(e.target.value))}
                    className="w-32 px-3 py-2 rounded-xl border border-slate-200 text-sm font-semibold"
                  />
                </div>
              )}

              <p className="text-[11px] text-slate-400 italic">
                * Note: The selected count represents a content target. Final pagination depends on font size, tables, and page breaks. We do not inject meaningless filler text.
              </p>
            </div>

            {/* Additional Free-Text Instructions */}
            <div className="border-t border-slate-100 pt-5 space-y-2">
              <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider">
                Additional Instructions & Tone Constraints (Optional)
              </label>
              <textarea
                rows={3}
                value={additionalInstructions}
                onChange={(e) => setAdditionalInstructions(e.target.value)}
                placeholder="e.g. Use simple, formal English. Ensure safety precautions are emphasized in bold. Include numbered subsections."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
              />
            </div>

            {/* Summary Review Card */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs space-y-2">
              <div className="flex items-center justify-between font-bold text-slate-800">
                <span>Summary of Generation Request</span>
                <span className="text-brand-600">{activeCategoryMeta?.name}</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-slate-500">
                <div><span className="text-slate-400 block">Theme:</span> <strong className="text-slate-700 capitalize">{selectedTheme.replace('-', ' ')}</strong></div>
                <div><span className="text-slate-400 block">Structure:</span> <strong className="text-slate-700 capitalize">{selectedStructure}</strong></div>
                <div><span className="text-slate-400 block">Target:</span> <strong className="text-slate-700 capitalize">{targetPageLength}</strong></div>
                <div><span className="text-slate-400 block">Security:</span> <strong className="text-emerald-600">RLS Protected</strong></div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={handlePrevStep}
                className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 font-semibold text-xs flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <button
                type="button"
                onClick={handleGenerate}
                disabled={isGenerating}
                className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-700 hover:to-indigo-700 text-white font-bold text-sm shadow-xl shadow-brand-500/25 transition flex items-center gap-2 group disabled:opacity-50"
              >
                <FileCheck className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span>Synthesize SOP Document</span>
              </button>
            </div>
          </div>
        )}

      </div>

      {/* Generation Progress Modal */}
      {isGenerating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-md p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center space-y-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95">
            <div className="relative mx-auto w-16 h-16 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-4 border-brand-100 animate-ping opacity-30" />
              <div className="w-16 h-16 rounded-2xl bg-brand-50 border border-brand-200 text-brand-600 flex items-center justify-center shadow-lg">
                <FileCheck className="w-8 h-8 animate-pulse text-brand-600" />
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-extrabold text-slate-900">
                Generating SOP Document
              </h3>
              <p className="text-xs text-brand-600 font-semibold min-h-[1.5rem] animate-pulse">
                {progressStatus || 'Validating information...'}
              </p>
              <p className="text-xs text-slate-400">
                Applying department guidelines, verifying placeholders, and structuring sections...
              </p>
            </div>

            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div className="bg-gradient-to-r from-brand-600 to-indigo-600 h-full w-full animate-indeterminate rounded-full" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

