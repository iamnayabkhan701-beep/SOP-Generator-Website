import React from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Users,
  Server,
  ShieldAlert,
  Cpu,
  Activity,
  Coins,
  Headphones,
  Building2,
  Layers,
  FileSpreadsheet,
  Download,
  Palette,
  LayoutTemplate,
  Lock,
  Warehouse,
  Truck,
  HardHat,
  ChevronRight,
} from 'lucide-react';
import { CATEGORIES, THEMES } from '../types/sop';
import { useAuth } from '../context/AuthContext';
import { TemplateGallery } from '../components/TemplateGallery';

export const LandingPage: React.FC = () => {
  const { user } = useAuth();

  const getCategoryIcon = (iconName: string) => {
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
      case 'Truck': return <Truck className="w-5 h-5" />;
      case 'HardHat': return <HardHat className="w-5 h-5" />;
      default: return <FileSpreadsheet className="w-5 h-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-20 md:pt-24 md:pb-32">
        <div className="absolute inset-0 bg-gradient-to-b from-brand-50/60 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-50 border border-brand-200/80 text-brand-700 text-xs font-semibold shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Enterprise Procedure Management Platform</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-950 tracking-tight leading-[1.12]">
              Standard Operating Procedures.{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 via-indigo-600 to-brand-500">
                Documented in Minutes.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal max-w-2xl mx-auto">
              Transform operational requirements into audit-ready, structured SOPs. Select your department, visual theme, and document format—review drafts in real time, and export publication-ready PDFs.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
              <Link
                to={user ? '/sop/new' : '/signup'}
                className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-semibold shadow-lg shadow-brand-500/25 transition flex items-center justify-center gap-2 text-sm sm:text-base group"
              >
                <span>Create Your SOP</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href="#templates"
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-white hover:bg-slate-100 text-slate-800 font-semibold border border-slate-200 shadow-xs transition flex items-center justify-center text-sm sm:text-base"
              >
                Browse Templates
              </a>
            </div>

            {/* Key highlights */}
            <div className="pt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 font-medium">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Row-Level Database Security (RLS)
              </span>
              <span className="flex items-center gap-1.5">
                <LayoutTemplate className="w-4 h-4 text-brand-600" />
                24 Department Templates
              </span>
              <span className="flex items-center gap-1.5">
                <Download className="w-4 h-4 text-indigo-600" />
                100% Visual PDF Match
              </span>
            </div>
          </div>

          {/* Interactive Document Preview Mockup */}
          <div className="mt-14 max-w-4xl mx-auto rounded-3xl bg-white shadow-2xl border border-slate-200/90 overflow-hidden">
            <div className="bg-slate-900 px-5 py-3.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-500" />
                <div className="w-3 h-3 rounded-full bg-amber-500" />
                <div className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="ml-2 text-xs font-mono text-slate-300">SOP-OPS-104: High-Bay Warehouse Put-Away & Receiving Protocol</span>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-slate-400">
                <span className="bg-brand-900 text-brand-300 px-2 py-0.5 rounded font-mono">Format: Standard</span>
                <span className="bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded font-mono">Status: Ready</span>
              </div>
            </div>

            <div className="p-6 sm:p-8 space-y-5 bg-white font-sans text-slate-800">
              <div className="border-b border-slate-200 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="text-[11px] font-bold text-brand-600 tracking-wider uppercase">GLOBAL LOGISTICS SOLUTIONS</span>
                  <h3 className="text-xl font-bold text-slate-900">Inbound Freight Inspection & Barcode Scan SOP</h3>
                </div>
                <div className="text-right text-xs text-slate-500">
                  <p><strong className="text-slate-700">Ref:</strong> SOP-WMS-204</p>
                  <p><strong className="text-slate-700">Effective:</strong> Nov 2026</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs">
                <div><span className="text-slate-400 block">Department:</span> <span className="font-semibold text-slate-800">Warehouse Operations</span></div>
                <div><span className="text-slate-400 block">Reviewed By:</span> <span className="font-semibold text-slate-800">QA Logistics Lead</span></div>
                <div><span className="text-slate-400 block">SLA Benchmark:</span> <span className="font-semibold text-slate-800">99.7% Accuracy</span></div>
              </div>

              <div className="space-y-3">
                <div className="border-l-4 border-brand-600 pl-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">1. Purpose & Scope</h4>
                  <p className="text-xs text-slate-600 mt-1">Establishes rigorous dock-to-stock verification procedures, barcode scanning protocols, and automated inventory sync.</p>
                </div>
                <div className="border-l-4 border-brand-600 pl-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">2. Procedural Action Sequence</h4>
                  <p className="text-xs text-slate-600 mt-1">Step 1: Manifest Check &gt; Step 2: Barcode Triage &gt; Step 3: Put-Away Slotting &gt; Step 4: WMS Cycle Log.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* TEMPLATE GALLERY SECTION (ISSUE 2 REQUIREMENT)                 */}
      {/* ============================================================== */}
      <section id="templates" className="py-20 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <TemplateGallery />
        </div>
      </section>

      {/* Supported Categories Grid */}
      <section id="categories" className="py-20 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
            <h2 className="text-xs font-bold text-brand-600 uppercase tracking-widest">24 Operational Domains</h2>
            <h3 className="text-3xl font-extrabold text-slate-950 tracking-tight">
              One Platform. Every Enterprise Workflow.
            </h3>
            <p className="text-sm text-slate-600">
              Unlike generic word processors, our procedural platform builds specialized form fields, safety checklists, and tailored procedural layouts for each specific industry.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {CATEGORIES.slice(0, 12).map((cat) => (
              <div
                key={cat.id}
                className="p-5 rounded-2xl border border-slate-200/80 bg-white hover:border-brand-300 hover:shadow-md transition-all group relative"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-brand-600 group-hover:bg-brand-600 group-hover:text-white transition-colors shadow-xs">
                    {getCategoryIcon(cat.iconName)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-bold text-slate-900 text-sm group-hover:text-brand-600 transition-colors">
                        {cat.name}
                      </h4>
                      {cat.isRegulatedOrHighRisk && (
                        <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-1.5 py-0.5 rounded">
                          Regulated
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-1.5 leading-relaxed line-clamp-2">
                      {cat.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center pt-8">
            <Link
              to="/signup"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-600 hover:text-brand-700"
            >
              <span>Explore all 24 departments in the workspace</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Features: Decoupled Visual Themes & Structures */}
      <section id="features" className="py-20 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            <div className="space-y-6">
              <span className="text-xs font-bold text-brand-600 uppercase tracking-widest">Architectural Integrity</span>
              <h2 className="text-3xl font-extrabold text-slate-950 tracking-tight">
                Decoupled Visual Themes & Document Structures
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                In strict compliance with modern enterprise documentation standards, document visual styling is completely separated from document information architecture:
              </p>

              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 shadow-xs flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600 shrink-0">
                    <Palette className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">5 High-Contrast Visual Themes</h4>
                    <p className="text-xs text-slate-500 mt-1">Professional Blue, Corporate Slate, Modern Emerald, Minimal Clean, and Creative Violet. All optimized for printing and PDF clarity.</p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 shadow-xs flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-brand-50 text-brand-600 shrink-0">
                    <LayoutTemplate className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">11 Verified Document Formats</h4>
                    <p className="text-xs text-slate-500 mt-1">RACI Matrix, ISO 9001:2015, Lean Six Sigma DMAIC, Checklists, Table Matrices, Step-by-Step, and Quick Reference Cards.</p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 shadow-xs flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 shrink-0">
                    <Lock className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Strict Row-Level Security (RLS)</h4>
                    <p className="text-xs text-slate-500 mt-1">Every user's documents and revisions are locked to their unique Supabase auth identifier. Cross-tenant leakage is impossible.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Visual themes preview */}
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 shadow-lg space-y-4">
              <h3 className="text-sm font-bold text-slate-900">Supported Printable Themes</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {THEMES.map((theme) => (
                  <div key={theme.id} className="p-3 rounded-xl border border-slate-200 bg-white flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full shrink-0 shadow-xs" style={{ backgroundColor: theme.primaryColor }} />
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-slate-900 truncate">{theme.name}</p>
                      <p className="text-[10px] text-slate-400 truncate">{theme.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="py-20 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
            <span className="text-xs font-bold text-brand-400 uppercase tracking-widest">Workflow Engine</span>
            <h2 className="text-3xl font-extrabold tracking-tight">How SOPFlow Works</h2>
            <p className="text-sm text-slate-400">From initial inputs to audit-ready, downloadable PDF in 3 structured phases.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700/80 space-y-3">
              <span className="w-8 h-8 rounded-xl bg-brand-600 flex items-center justify-center font-bold text-sm">1</span>
              <h3 className="text-base font-bold text-white">Select Format & Department</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Choose from 24 operational departments and 11 structural templates including RACI matrices, ISO 9001 clauses, and DMAIC frameworks.
              </p>
            </div>

            <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700/80 space-y-3">
              <span className="w-8 h-8 rounded-xl bg-brand-600 flex items-center justify-center font-bold text-sm">2</span>
              <h3 className="text-base font-bold text-white">Configure & Synthesize</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Input your organizational purpose, responsibilities, and procedural details. The engine structures your document with flowcharts and KPI metrics.
              </p>
            </div>

            <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700/80 space-y-3">
              <span className="w-8 h-8 rounded-xl bg-brand-600 flex items-center justify-center font-bold text-sm">3</span>
              <h3 className="text-base font-bold text-white">Review & Export 1:1 PDF</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Review your procedure with embedded images, flowcharts, and verification tables. Download an exact visual replica as a publication-ready PDF.
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
