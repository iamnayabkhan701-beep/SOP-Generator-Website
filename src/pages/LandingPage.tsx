import React from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  Sparkles,
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
} from 'lucide-react';
import { CATEGORIES, THEMES, STRUCTURES } from '../types/sop';
import { useAuth } from '../context/AuthContext';

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
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-50 border border-brand-200/80 text-brand-700 text-xs font-semibold shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-brand-600 animate-spin" style={{ animationDuration: '4s' }} />
              <span>Next-Gen Enterprise SOP Creator</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-950 tracking-tight leading-[1.12]">
              Standard Operating Procedures.{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 via-indigo-600 to-brand-500">
                Engineered in Minutes.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal max-w-2xl mx-auto">
              Transform messy operational notes into audit-ready, structured SOPs. Select your department, visual theme, and document structure—review drafts in real time, and export publication-ready PDFs.
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
                href="#how-it-works"
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-white hover:bg-slate-100 text-slate-800 font-semibold border border-slate-200 shadow-sm transition flex items-center justify-center text-sm sm:text-base"
              >
                See How It Works
              </a>
            </div>

            {/* Key highlights */}
            <div className="pt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 font-medium">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Supabase Row-Level Security
              </span>
              <span className="flex items-center gap-1.5">
                <Palette className="w-4 h-4 text-brand-600" />
                5 Accessible Printable Themes
              </span>
              <span className="flex items-center gap-1.5">
                <Download className="w-4 h-4 text-indigo-600" />
                Instant Polished PDF Export
              </span>
            </div>
          </div>

          {/* Interactive Document Preview Mockup */}
          <div className="mt-14 max-w-4xl mx-auto rounded-2xl bg-white shadow-2xl border border-slate-200/90 overflow-hidden">
            <div className="bg-slate-900 px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-500" />
                <div className="w-3 h-3 rounded-full bg-amber-500" />
                <div className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="ml-2 text-xs font-mono text-slate-400">SOP-IT-104: Production Deployment Protocol</span>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-slate-400">
                <span className="bg-brand-900 text-brand-300 px-2 py-0.5 rounded font-mono">Theme: Professional Blue</span>
                <span className="bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded font-mono">Status: Ready</span>
              </div>
            </div>

            <div className="p-6 sm:p-8 space-y-5 bg-white font-sans text-slate-800">
              <div className="border-b border-slate-200 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="text-[11px] font-bold text-brand-600 tracking-wider uppercase">ACME TECHNOLOGIES INC.</span>
                  <h3 className="text-xl font-bold text-slate-900">Production Deployment & Disaster Recovery SOP</h3>
                </div>
                <div className="text-right text-xs text-slate-500">
                  <p><strong className="text-slate-700">Ref:</strong> SOP-IT-104-v2</p>
                  <p><strong className="text-slate-700">Effective:</strong> Nov 2026</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs">
                <div><span className="text-slate-400 block">Department:</span> <span className="font-semibold text-slate-800">IT Infrastructure</span></div>
                <div><span className="text-slate-400 block">Reviewed By:</span> <span className="font-semibold text-slate-800">Lead SecOps Engineer</span></div>
                <div><span className="text-slate-400 block">Target Length:</span> <span className="font-semibold text-slate-800">Standard (3–5 pages)</span></div>
              </div>

              <div className="space-y-3">
                <div className="border-l-4 border-brand-600 pl-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">1. Purpose & Scope</h4>
                  <p className="text-xs text-slate-600 mt-1">Establishes rigorous zero-downtime release procedures, database migration locks, and instant rollback triggers for microservices.</p>
                </div>
                <div className="border-l-4 border-brand-600 pl-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">2. Procedural Action Matrix</h4>
                  <p className="text-xs text-slate-600 mt-1">Step 1: Automated Canary Health Check &gt; Step 2: Traffic Shifting &gt; Step 3: Verification Audit.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Supported Categories Grid */}
      <section id="categories" className="py-20 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
            <h2 className="text-xs font-bold text-brand-600 uppercase tracking-widest">Tailored by Department</h2>
            <h3 className="text-3xl font-extrabold text-slate-950 tracking-tight">
              One Generator. Every Enterprise Workflow.
            </h3>
            <p className="text-sm text-slate-600">
              Unlike generic templates, our dynamic generator creates specialized form fields, security checklists, and customized procedural layouts for each specific domain.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {CATEGORIES.map((cat) => (
              <div
                key={cat.id}
                className="p-5 rounded-2xl border border-slate-200/80 bg-slate-50/50 hover:bg-white hover:border-brand-300 hover:shadow-md transition-all group relative"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-white border border-slate-200 text-brand-600 group-hover:bg-brand-600 group-hover:text-white transition-colors shadow-sm">
                    {getCategoryIcon(cat.iconName)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-bold text-slate-900 text-sm group-hover:text-brand-600 transition-colors">
                        {cat.name}
                      </h4>
                      {cat.isRegulatedOrHighRisk && (
                        <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-1.5 py-0.5 rounded">
                          Review Req.
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
        </div>
      </section>

      {/* Features: Themes & Structures Independent */}
      <section id="features" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            <div className="space-y-6">
              <span className="text-xs font-bold text-brand-600 uppercase tracking-widest">Architectural Separation</span>
              <h2 className="text-3xl font-extrabold text-slate-950 tracking-tight">
                Decoupled Visual Themes & Procedural Structures
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                In strict compliance with modern enterprise documentation standards, document visual styling is completely separated from document information architecture:
              </p>

              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600 shrink-0">
                    <Palette className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">5 High-Contrast Visual Themes</h4>
                    <p className="text-xs text-slate-500 mt-1">Professional Blue, Corporate Slate, Modern Emerald, Minimal Clean, and Creative Violet. All optimized for printing and PDF clarity.</p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-brand-50 text-brand-600 shrink-0">
                    <LayoutTemplate className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">6 Modular Document Structures</h4>
                    <p className="text-xs text-slate-500 mt-1">Standard SOP, Detailed Enterprise, Checklist-Based, Table Action Matrix, Step-by-Step, or Bespoke Custom layout.</p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm flex items-start gap-3">
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
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xl space-y-4">
              <h3 className="text-sm font-bold text-slate-900">Supported Printable Themes</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {THEMES.map((theme) => (
                  <div key={theme.id} className="p-3 rounded-xl border border-slate-200 flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full shrink-0 shadow-sm" style={{ backgroundColor: theme.primaryColor }} />
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-slate-900 truncate">{theme.name}</p>
                      <p className="text-[10px] text-slate-400 truncate">{theme.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-slate-100 pt-4">
                <h3 className="text-sm font-bold text-slate-900 mb-2">Available Structures</h3>
                <div className="flex flex-wrap gap-2">
                  {STRUCTURES.map((st) => (
                    <span key={st.id} className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-medium">
                      {st.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-20 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
            <h2 className="text-xs font-bold text-brand-600 uppercase tracking-widest">Simple Workflow</h2>
            <h3 className="text-3xl font-extrabold text-slate-950 tracking-tight">
              From Concept to Approved PDF in 4 Steps
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="w-9 h-9 rounded-xl bg-brand-600 text-white flex items-center justify-center font-bold text-sm shadow-md shadow-brand-500/20">
                1
              </div>
              <h4 className="font-bold text-slate-900 text-base">Select Category & Layout</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Choose from 11 specialized departments and independently select your visual theme and document structure.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="w-9 h-9 rounded-xl bg-brand-600 text-white flex items-center justify-center font-bold text-sm shadow-md shadow-brand-500/20">
                2
              </div>
              <h4 className="font-bold text-slate-900 text-base">Fill Dynamic Details</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Provide title, purpose, tools, prerequisites, safety protocols, and roles in an organized step-by-step form.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="w-9 h-9 rounded-xl bg-brand-600 text-white flex items-center justify-center font-bold text-sm shadow-md shadow-brand-500/20">
                3
              </div>
              <h4 className="font-bold text-slate-900 text-base">AI Generation & Edit</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Watch honest status updates as AI drafts structured sections. Reorder, edit, or customize any clause.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="w-9 h-9 rounded-xl bg-brand-600 text-white flex items-center justify-center font-bold text-sm shadow-md shadow-brand-500/20">
                4
              </div>
              <h4 className="font-bold text-slate-900 text-base">Export & Save</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Download a polished PDF complete with formal sign-off blocks, running headers/footers, and sync to Supabase.
              </p>
            </div>
          </div>

          {/* CTA Banner */}
          <div className="mt-16 p-8 rounded-3xl bg-gradient-to-r from-brand-600 to-indigo-700 text-white text-center space-y-4 shadow-xl">
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Ready to standardise your organization?</h3>
            <p className="text-brand-100 text-sm max-w-xl mx-auto">
              Create professional, secure, audit-friendly Standard Operating Procedures in minutes.
            </p>
            <div className="pt-2">
              <Link
                to={user ? '/sop/new' : '/signup'}
                className="inline-flex items-center gap-2 px-7 py-3 rounded-2xl bg-white text-brand-700 font-bold hover:bg-brand-50 shadow-md transition text-sm"
              >
                <span>Get Started Now</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

