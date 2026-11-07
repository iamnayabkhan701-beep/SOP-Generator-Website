import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  FileText,
  Sparkles,
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
  const navigate = useNavigate();
  const { user } = useAuth();

  const [step, setStep] = useState<number>(1);
  const [loadingInitial, setLoadingInitial] = useState(false);

  // Wizard State
  const [selectedCategory, setSelectedCategory] = useState<SOPCategory>('it');
  const [selectedTheme, setSelectedTheme] = useState<SOPTheme>('professional-blue');
  const [selectedStructure, setSelectedStructure] = useState<SOPStructure>('standard');
  const [targetPageLength, setTargetPageLength] = useState<TargetPageLength>('standard');
  const [customPageCount, setCustomPageCount] = useState<number>(4);
  const [additionalInstructions, setAdditionalInstructions] = useState<string>('');

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

        {/* STEP 1: CATEGORY SELECTION */}
        {step === 1 && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6 animate-in fade-in duration-200">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-brand-600">Step 1 of 4</span>
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
                Select SOP Department & Domain
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Your department choice tailors the fields, regulatory safety disclaimers, and suggested structure.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {CATEGORIES.map((cat) => {
                const isSelected = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => {
                      setSelectedCategory(cat.id);
                      setFormData((p) => ({
                        ...p,
                        department: cat.name,
                      }));
                    }}
                    className={`p-4 rounded-2xl border text-left transition-all flex items-start gap-3.5 ${
                      isSelected
                        ? 'border-brand-600 bg-brand-50/50 ring-2 ring-brand-500/20 shadow-sm'
                        : 'border-slate-200/80 hover:border-slate-300 hover:bg-slate-50/50'
                    }`}
                  >
                    <div
                      className={`p-2.5 rounded-xl shrink-0 ${
                        isSelected ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {getCatIcon(cat.iconName)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span className={`text-sm font-bold ${isSelected ? 'text-brand-900' : 'text-slate-900'}`}>
                          {cat.name}
                        </span>
                        {cat.isRegulatedOrHighRisk && (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800">
                            Regulated
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                        {cat.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

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

            <div className="flex justify-end pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={handleNextStep}
                className="px-6 py-3 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm shadow-md shadow-brand-500/20 transition flex items-center gap-2"
              >
                <span>Continue to Theme & Structure</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
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

            {/* Structures */}
            <div className="space-y-3 border-t border-slate-100 pt-6">
              <div className="flex items-center gap-2">
                <LayoutTemplate className="w-4 h-4 text-brand-600" />
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  Select Document Organization & Structure
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {STRUCTURES.map((st) => {
                  const isSelected = selectedStructure === st.id;
                  return (
                    <button
                      key={st.id}
                      type="button"
                      onClick={() => setSelectedStructure(st.id)}
                      className={`p-4 rounded-2xl border text-left transition-all ${
                        isSelected
                          ? 'border-brand-600 bg-brand-50/40 ring-2 ring-brand-500/20 shadow-sm'
                          : 'border-slate-200/80 hover:border-slate-300 hover:bg-slate-50/50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-sm font-bold text-slate-900">{st.name}</span>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                          {st.badge}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 leading-relaxed">{st.description}</p>
                    </button>
                  );
                })}
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
                onClick={handleNextStep}
                className="px-6 py-3 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm shadow-md shadow-brand-500/20 transition flex items-center gap-2"
              >
                <span>Continue to SOP Information</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: DYNAMIC CATEGORY-SPECIFIC FORM */}
        {step === 3 && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6 animate-in fade-in duration-200">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-brand-600">Step 3 of 4</span>
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
                SOP Details & Organizational Information
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Provide accurate details. The AI generator will preserve all provided roles, tools, and constraints.
              </p>
            </div>

            {/* General Metadata */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Organization / Company Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  placeholder="e.g. Apex Global Corp"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Department / Business Unit <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  placeholder="e.g. IT Operations, Manufacturing Plant A"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  SOP Document Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Hazardous Chemical Spill Clean-Up Protocol"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm font-semibold"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  SOP ID / Reference Number (Optional)
                </label>
                <input
                  type="text"
                  value={formData.sopId || ''}
                  onChange={(e) => setFormData({ ...formData, sopId: e.target.value })}
                  placeholder="e.g. SOP-EHS-204"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Effective Date
                </label>
                <input
                  type="date"
                  value={formData.effectiveDate}
                  onChange={(e) => setFormData({ ...formData, effectiveDate: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
                />
              </div>
            </div>

            {/* Core Purpose & Scope */}
            <div className="space-y-4 border-t border-slate-100 pt-5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  1. Purpose & Objective <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={2}
                  value={formData.purpose}
                  onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                  placeholder="What is the key goal of this SOP? (e.g. Prevent data loss during scheduled server migrations)"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  2. Scope & Applicability
                </label>
                <textarea
                  rows={2}
                  value={formData.scope}
                  onChange={(e) => setFormData({ ...formData, scope: e.target.value })}
                  placeholder="Who and what facilities or departments are governed by this procedure?"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  3. Key Procedure / Process Details
                </label>
                <textarea
                  rows={4}
                  value={formData.procedureDetails}
                  onChange={(e) => setFormData({ ...formData, procedureDetails: e.target.value })}
                  placeholder="Outline the core steps or bullet points. The AI will expand, format, and number them properly."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm font-mono text-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Required Equipment, Systems & Tools
                  </label>
                  <input
                    type="text"
                    value={formData.requiredTools || ''}
                    onChange={(e) => setFormData({ ...formData, requiredTools: e.target.value })}
                    placeholder="e.g. Forklift, Respirator N95, Kubernetes CLI"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Safety & Risk Considerations
                  </label>
                  <input
                    type="text"
                    value={formData.safetyRisk || ''}
                    onChange={(e) => setFormData({ ...formData, safetyRisk: e.target.value })}
                    placeholder="e.g. Electrical hazard, PHI privacy violation risk"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Department-Specific Conditional Fields */}
            <div className="border-t border-slate-100 pt-5 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-brand-700 flex items-center gap-1.5">
                <span>Domain Specific Parameters ({activeCategoryMeta?.name})</span>
              </h3>

              {selectedCategory === 'it' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Target System / Application</label>
                    <input
                      type="text"
                      placeholder="e.g. Customer Billing Service, Oracle DB"
                      onChange={(e) => updateCategorySpecific('systemName', e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Rollback / Fallback Trigger</label>
                    <input
                      type="text"
                      placeholder="e.g. Error rate > 0.5% for 3 consecutive minutes"
                      onChange={(e) => updateCategorySpecific('backupRollbackPlan', e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                    />
                  </div>
                </div>
              )}

              {selectedCategory === 'manufacturing' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Machinery / Equipment Specs</label>
                    <input
                      type="text"
                      placeholder="e.g. CNC Milling Machine Model T-800"
                      onChange={(e) => updateCategorySpecific('equipmentSpecs', e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Critical Process Parameters</label>
                    <input
                      type="text"
                      placeholder="e.g. Temperature 180°C ± 2°C, Pressure 4.2 Bar"
                      onChange={(e) => updateCategorySpecific('processParameters', e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                    />
                  </div>
                </div>
              )}

              {selectedCategory === 'quality' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Sampling & Inspection Rate</label>
                    <input
                      type="text"
                      placeholder="e.g. 5 random units per pallet of 100"
                      onChange={(e) => updateCategorySpecific('samplingCriteria', e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Defect Escalation Threshold</label>
                    <input
                      type="text"
                      placeholder="e.g. Immediate line quarantine if defect > 0"
                      onChange={(e) => updateCategorySpecific('nonconformanceProtocol', e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                    />
                  </div>
                </div>
              )}

              {selectedCategory === 'healthcare' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">HIPAA / Confidentiality Protocol</label>
                    <input
                      type="text"
                      placeholder="e.g. EHR screen lock within 60s, encrypted audit logging"
                      onChange={(e) => updateCategorySpecific('confidentialityProtocol', e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Administrative Escalation Contact</label>
                    <input
                      type="text"
                      placeholder="e.g. Chief Privacy Officer or Hospital Administrator"
                      onChange={(e) => updateCategorySpecific('escalationContact', e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Sign-off Personnel */}
            <div className="border-t border-slate-100 pt-5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">
                Formal Sign-Off Personnel
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-1">Prepared By</label>
                  <input
                    type="text"
                    value={formData.preparedBy}
                    onChange={(e) => setFormData({ ...formData, preparedBy: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-1">Reviewed By</label>
                  <input
                    type="text"
                    value={formData.reviewedBy}
                    onChange={(e) => setFormData({ ...formData, reviewedBy: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-1">Approved By</label>
                  <input
                    type="text"
                    value={formData.approvedBy}
                    onChange={(e) => setFormData({ ...formData, approvedBy: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                  />
                </div>
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
                onClick={handleNextStep}
                className="px-6 py-3 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm shadow-md shadow-brand-500/20 transition flex items-center gap-2"
              >
                <span>Continue to Page Length & Instructions</span>
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
                <Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                <span>Generate My SOP</span>
              </button>
            </div>
          </div>
        )}

      </div>

      {/* Honest Generation Progress Modal */}
      {isGenerating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-md p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center space-y-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95">
            <div className="relative mx-auto w-16 h-16 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-4 border-brand-100 animate-ping opacity-30" />
              <div className="w-16 h-16 rounded-2xl bg-brand-50 border border-brand-200 text-brand-600 flex items-center justify-center shadow-lg">
                <Sparkles className="w-8 h-8 animate-spin" style={{ animationDuration: '3s' }} />
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

