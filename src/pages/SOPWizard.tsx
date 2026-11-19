import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams, Link } from 'react-router-dom';
import {
  FileText,
  FileCheck,
  ArrowRight,
  ArrowLeft,
  Check,
  Sparkles,
  Layers,
  AlertTriangle,
  Building2,
  CheckCircle2,
  Briefcase,
  Sliders,
  Palette,
  RotateCw,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { DepartmentSelector } from '../components/DepartmentSelector';
import { CompanyDepartmentForm } from '../components/CompanyDepartmentForm';
import {
  CATEGORIES,
  type SOPCategory,
  type SOPTheme,
  type SOPStructure,
  type CompanyInfoFormData,
  type SOPDocument,
} from '../types/sop';
import { getSOPsForDepartment } from '../data/sopLibraryRegistry';
import { generateDepartmentSOPSuite } from '../lib/suiteGenerator';
import { fetchDocumentById } from '../lib/supabase';

export const SOPWizard: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Step 1: Select Department
  // Step 2: Company & Operations Information Form
  const [step, setStep] = useState<number>(1);
  const [selectedCategory, setSelectedCategory] = useState<SOPCategory>('warehouse');
  const [selectedTheme, setSelectedTheme] = useState<SOPTheme>('corporate-black');
  const [selectedStructure, setSelectedStructure] = useState<SOPStructure>('standard');

  // Company Information State
  const [companyInfo, setCompanyInfo] = useState<CompanyInfoFormData>({
    companyName: 'Acme Enterprise Solutions',
    industry: 'Logistics, Supply Chain & Operations',
    country: 'United States',
    city: 'Chicago Facility #1',
    companySize: '101–500 employees',
    departmentName: 'Warehouse & Inventory Operations',
    productsOrServices: 'Industrial components, consumer goods, palletized raw materials',
    mainOperationalActivities: 'Inbound dock receiving, automated slotting, FIFO picking, and carrier dispatch',
    applicableStandards: ['ISO 9001 (Quality)', 'OSHA 1910 / 1926 (Safety)'],
    preparedBy: 'Operations Process Engineer',
    reviewedBy: 'Quality Assurance Manager',
    approvedBy: 'Vice President of Operations',
    effectiveDate: new Date().toISOString().split('T')[0],
    version: '1.0',
    departmentDetails: {},
  });

  // Generation Progress State
  const [isGenerating, setIsGenerating] = useState(false);
  const [progressState, setProgressState] = useState<{
    current: number;
    total: number;
    message: string;
  }>({
    current: 0,
    total: 0,
    message: '',
  });

  // If editing an existing single document
  useEffect(() => {
    if (id && user) {
      fetchDocumentById(id).then((doc) => {
        if (doc) {
          navigate(`/sop/${doc.id}/preview`);
        }
      });
    }
  }, [id, user, navigate]);

  // Handle department change
  const handleSelectDepartment = (deptId: SOPCategory) => {
    setSelectedCategory(deptId);
    const cat = CATEGORIES.find((c) => c.id === deptId);
    if (cat) {
      setCompanyInfo((prev) => ({
        ...prev,
        departmentName: cat.name,
      }));
    }
    setStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDepartmentDetailChange = (key: string, value: string) => {
    setCompanyInfo((prev) => ({
      ...prev,
      departmentDetails: {
        ...prev.departmentDetails,
        [key]: value,
      },
    }));
  };

  // Get total SOPs available for selected department
  const applicableSOPs = getSOPsForDepartment(selectedCategory);
  const totalSOPCount = applicableSOPs.length;
  const activeCategoryMeta = CATEGORIES.find((c) => c.id === selectedCategory);

  // Synthesize complete department suite
  const handleGenerateSuite = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    setIsGenerating(true);
    setProgressState({
      current: 0,
      total: totalSOPCount,
      message: `Initiating ${totalSOPCount} procedures for ${companyInfo.departmentName}...`,
    });

    try {
      const suite = await generateDepartmentSOPSuite({
        departmentId: selectedCategory,
        companyInfo,
        theme: selectedTheme,
        structure: selectedStructure,
        userId: user.id,
        onProgress: (current, total, message) => {
          setProgressState({ current, total, message });
        },
      });

      // Navigate to the newly generated suite workspace!
      navigate(`/suite/${suite.id}`);
    } catch (err: any) {
      console.error('Suite generation error:', err);
      alert('Generation encountered a problem: ' + err.message);
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Wizard Progress Stepper */}
        <div className="bg-white p-4 sm:p-6 rounded-3xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between">
            {[
              { num: 1, label: 'Department Selection' },
              { num: 2, label: 'Company Information & Operations' },
              { num: 3, label: 'Complete SOP Suite Workspace' },
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
                {idx < 2 && <div className="flex-1 h-0.5 mx-2 bg-slate-100 max-w-[80px]" />}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* STEP 1: DEPARTMENT SELECTION */}
        {step === 1 && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6 animate-in fade-in duration-200">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-xs font-bold uppercase tracking-wider mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Department Suite Architecture</span>
              </div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                Which department do you want to create an SOP suite for?
              </h2>
              <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
                Select your target department below. The system automatically identifies all applicable standard operating procedures for that department and synthesizes complete, company-specific documents.
              </p>
            </div>

            {/* Department Grid */}
            <DepartmentSelector
              selectedDept={selectedCategory}
              onSelectDepartment={(deptId) => {
                handleSelectDepartment(deptId);
              }}
            />

            {/* Regulated Industry Notice if applicable */}
            {activeCategoryMeta?.isRegulatedOrHighRisk && (
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200/80 text-amber-900 text-xs flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block text-sm mb-0.5">Regulated Industry Notice</span>
                  <p>{activeCategoryMeta.disclaimer}</p>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <span className="text-xs text-slate-400 font-medium">
                {applicableSOPs.length} essential procedures will be automatically synthesized for {activeCategoryMeta?.name}.
              </span>

              <button
                type="button"
                onClick={() => {
                  setStep(2);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-6 py-3 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-md shadow-brand-500/20 transition flex items-center gap-2"
              >
                <span>Configure Company Profile</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: DYNAMIC COMPANY INFORMATION FORM */}
        {step === 2 && (
          <CompanyDepartmentForm
            departmentId={selectedCategory}
            departmentName={activeCategoryMeta?.name || 'Department'}
            totalSOPCount={totalSOPCount}
            formData={companyInfo}
            onChange={(updates) => setCompanyInfo((p) => ({ ...p, ...updates }))}
            onDepartmentDetailChange={handleDepartmentDetailChange}
            onSubmit={handleGenerateSuite}
            onBack={() => {
              setStep(1);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

      </div>

      {/* GENERATION PROGRESS MODAL */}
      {isGenerating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/75 backdrop-blur-md p-4">
          <div className="bg-white rounded-3xl p-8 max-w-lg w-full text-center space-y-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95">
            <div className="relative mx-auto w-16 h-16 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-4 border-brand-200 animate-ping opacity-25" />
              <div className="w-16 h-16 rounded-2xl bg-brand-50 border border-brand-200 text-brand-600 flex items-center justify-center shadow-lg">
                <RotateCw className="w-8 h-8 animate-spin text-brand-600" />
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-extrabold text-slate-900">
                Synthesizing {companyInfo.departmentName} SOP Suite
              </h3>
              <p className="text-sm text-brand-600 font-bold min-h-[1.5rem] truncate px-2">
                {progressState.message || 'Customizing procedural documents...'}
              </p>
              <p className="text-xs text-slate-400">
                Tailoring {progressState.total} procedures with {companyInfo.companyName}'s tools, storage zones, safety protocols, and governance standards.
              </p>
            </div>

            {/* Progress Percentage Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold text-slate-600">
                <span>Progress</span>
                <span>
                  {progressState.total > 0
                    ? `${Math.round((progressState.current / progressState.total) * 100)}% (${progressState.current}/${progressState.total})`
                    : 'Starting...'}
                </span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-brand-600 to-indigo-600 h-full rounded-full transition-all duration-300"
                  style={{
                    width: `${
                      progressState.total > 0
                        ? Math.max(5, (progressState.current / progressState.total) * 100)
                        : 5
                    }%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
