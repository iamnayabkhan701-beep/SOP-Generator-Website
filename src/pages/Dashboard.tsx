import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  PlusCircle,
  Search,
  FileText,
  Clock,
  Download,
  Copy,
  Archive,
  Trash2,
  ExternalLink,
  FileCheck,
  FolderOpen,
  Sparkles,
  LayoutDashboard,
  Files,
  LayoutTemplate,
  User,
  Shield,
  Settings as SettingsIcon,
  LogOut,
  ArrowRight,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import {
  fetchUserDocuments,
  deleteSOPDocument,
  duplicateSOPDocument,
  updateSOPDocument,
} from '../lib/supabase';
import type { SOPDocument, SOPStatus, SOPCategory } from '../types/sop';
import { CATEGORIES } from '../types/sop';
import { generateVisualSOPPdfFromData } from '../lib/pdfGenerator';
import { TemplateGallery } from '../components/TemplateGallery';

type DashboardTab = 'dashboard' | 'my-sops' | 'templates';

export const Dashboard: React.FC = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<DashboardTab>('dashboard');
  const [documents, setDocuments] = useState<SOPDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const loadDocs = async () => {
    if (!user) return;
    setLoading(true);
    const docs = await fetchUserDocuments(user.id);
    setDocuments(docs);
    setLoading(false);
  };

  useEffect(() => {
    loadDocs();
  }, [user]);

  const handleDelete = async (id: string, title: string) => {
    if (!user) return;
    if (window.confirm(`Are you sure you want to permanently delete "${title}"?`)) {
      setActionLoadingId(id);
      await deleteSOPDocument(id, user.id);
      setDocuments(documents.filter((d) => d.id !== id));
      setActionLoadingId(null);
    }
  };

  const handleDuplicate = async (id: string) => {
    if (!user) return;
    setActionLoadingId(id);
    const copy = await duplicateSOPDocument(id, user.id);
    if (copy) {
      setDocuments([copy, ...documents]);
    }
    setActionLoadingId(null);
  };

  const handleArchive = async (id: string, currentStatus: SOPStatus) => {
    setActionLoadingId(id);
    const newStatus: SOPStatus = currentStatus === 'archived' ? 'ready' : 'archived';
    await updateSOPDocument(id, {
      status: newStatus,
      archived_at: newStatus === 'archived' ? new Date().toISOString() : null,
    });
    setDocuments(
      documents.map((d) => (d.id === id ? { ...d, status: newStatus } : d))
    );
    setActionLoadingId(null);
  };

  // High-fidelity visual PDF export from Dashboard
  const handleQuickDownloadPDF = async (doc: SOPDocument) => {
    if (!doc.generated_content) {
      alert('This draft does not have content yet. Open it in editor to generate.');
      return;
    }
    setActionLoadingId(doc.id);
    try {
      const activeContent = doc.edited_content || doc.generated_content;
      const { blob, filename } = await generateVisualSOPPdfFromData(
        activeContent,
        doc.theme,
        doc.structure,
        doc.category,
        doc.title
      );

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e: any) {
      console.error('PDF export error', e);
      alert('Failed to generate PDF. Open preview to view details.');
    } finally {
      setActionLoadingId(null);
    }
  };

  // Filter documents
  const filtered = documents.filter((doc) => {
    const matchesSearch =
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.form_data?.department?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.form_data?.companyName?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory;
    const matchesStatus =
      selectedStatus === 'all'
        ? doc.status !== 'archived'
        : doc.status === selectedStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Calculate statistics (Real data belonging to logged-in user)
  const totalCount = documents.length;
  const readyCount = documents.filter((d) => d.status === 'ready').length;
  const draftCount = documents.filter((d) => d.status === 'draft').length;
  const archivedCount = documents.filter((d) => d.status === 'archived').length;

  const recentlyCreated = [...documents]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5);

  const recentlyUpdated = [...documents]
    .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-slate-900 text-white shrink-0 hidden md:flex flex-col justify-between py-6 px-4 no-print">
        <div className="space-y-6">
          {/* Logo / Brand */}
          <div className="px-3 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-brand-600 flex items-center justify-center font-bold text-white shadow-md">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-extrabold tracking-tight text-white">StandardOps</h2>
              <span className="text-[10px] text-slate-400 font-mono">Enterprise Platform</span>
            </div>
          </div>

          {/* Nav Items */}
          <nav className="space-y-1 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition ${
                activeTab === 'dashboard'
                  ? 'bg-brand-600 text-white shadow-xs'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>1. Dashboard</span>
            </button>

            <Link
              to="/sop/new"
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-slate-300 hover:bg-slate-800 hover:text-white transition"
            >
              <PlusCircle className="w-4 h-4 text-emerald-400" />
              <span>2. Create New SOP</span>
            </Link>

            <button
              onClick={() => setActiveTab('my-sops')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition ${
                activeTab === 'my-sops'
                  ? 'bg-brand-600 text-white shadow-xs'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Files className="w-4 h-4" />
              <span>3. My SOPs</span>
              {totalCount > 0 && (
                <span className="ml-auto text-[10px] bg-slate-800 px-2 py-0.5 rounded-full text-slate-300">
                  {totalCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('templates')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition ${
                activeTab === 'templates'
                  ? 'bg-brand-600 text-white shadow-xs'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <LayoutTemplate className="w-4 h-4" />
              <span>4. Templates</span>
              <span className="ml-auto text-[10px] bg-brand-500/20 text-brand-300 px-1.5 py-0.5 rounded border border-brand-400/30">
                11
              </span>
            </button>

            <div className="pt-4 pb-1 px-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              Account Management
            </div>

            <Link
              to="/settings"
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-slate-300 hover:bg-slate-800 hover:text-white transition"
            >
              <User className="w-4 h-4" />
              <span>5. Profile</span>
            </Link>

            <Link
              to="/settings"
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-slate-300 hover:bg-slate-800 hover:text-white transition"
            >
              <Shield className="w-4 h-4" />
              <span>6. Security</span>
            </Link>

            <Link
              to="/settings"
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-slate-300 hover:bg-slate-800 hover:text-white transition"
            >
              <SettingsIcon className="w-4 h-4" />
              <span>7. Settings</span>
            </Link>
          </nav>
        </div>

        {/* User Card & Logout */}
        <div className="border-t border-slate-800 pt-4 space-y-3">
          <div className="px-3 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center font-bold text-xs uppercase">
              {user?.email?.[0] || 'U'}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-semibold text-white truncate">
                {user?.user_metadata?.full_name || user?.email?.split('@')[0]}
              </p>
              <p className="text-[10px] text-slate-400 truncate">{user?.email}</p>
            </div>
          </div>

          <button
            onClick={() => signOut()}
            className="w-full flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-500/10 transition"
          >
            <LogOut className="w-4 h-4" />
            <span>8. Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto py-8 px-4 sm:px-6 lg:px-10">
        <div className="max-w-6xl mx-auto space-y-8">

          {/* TAB 1: DASHBOARD OVERVIEW */}
          {activeTab === 'dashboard' && (
            <>
              {/* Welcome Banner */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                      Welcome, {user?.user_metadata?.full_name || user?.email?.split('@')[0]}
                    </h1>
                    <span className="bg-brand-50 text-brand-700 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-brand-200">
                      Private Workspace
                    </span>
                  </div>
                  <p className="text-sm text-slate-500 mt-1">
                    Automated Standard Operating Procedure platform, visual document review, and high-fidelity PDF publishing.
                  </p>
                </div>

                <Link
                  to="/sop/new"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm shadow-md shadow-brand-500/20 transition shrink-0"
                >
                  <PlusCircle className="w-5 h-5" />
                  <span>Create New SOP</span>
                </Link>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total SOPs</span>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-3xl font-extrabold text-slate-900">{totalCount}</span>
                    <div className="p-2.5 bg-brand-50 text-brand-600 rounded-xl">
                      <FileText className="w-5 h-5" />
                    </div>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Approved & Ready</span>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-3xl font-extrabold text-emerald-600">{readyCount}</span>
                    <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
                      <FileCheck className="w-5 h-5" />
                    </div>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Drafts in Progress</span>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-3xl font-extrabold text-amber-600">{draftCount}</span>
                    <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl">
                      <Clock className="w-5 h-5" />
                    </div>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Archived</span>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-3xl font-extrabold text-slate-500">{archivedCount}</span>
                    <div className="p-2.5 bg-slate-100 text-slate-500 rounded-xl">
                      <Archive className="w-5 h-5" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Onboarding Instructions for New Users */}
              {totalCount === 0 && (
                <div className="bg-gradient-to-r from-brand-900 to-slate-900 text-white p-8 rounded-3xl shadow-lg space-y-4">
                  <div className="inline-flex items-center gap-2 bg-brand-500/20 text-brand-300 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-brand-400/30">
                    Getting Started Guide
                  </div>
                  <h3 className="text-xl font-extrabold">Generate Your First Enterprise SOP in 3 Simple Steps</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 text-xs">
                    <div className="bg-white/10 p-4 rounded-2xl space-y-1.5 border border-white/10">
                      <span className="font-bold text-brand-300 text-sm block">1. Select Domain</span>
                      <p className="text-slate-300">Choose from 24 specialized categories like Warehouse, Manufacturing, IT, or Workplace Safety.</p>
                    </div>
                    <div className="bg-white/10 p-4 rounded-2xl space-y-1.5 border border-white/10">
                      <span className="font-bold text-brand-300 text-sm block">2. Configure Details</span>
                      <p className="text-slate-300">Input your operational scope, roles, equipment, and select from 11 verified structural formats.</p>
                    </div>
                    <div className="bg-white/10 p-4 rounded-2xl space-y-1.5 border border-white/10">
                      <span className="font-bold text-brand-300 text-sm block">3. Visual Export</span>
                      <p className="text-slate-300">Preview automatically sourced domain imagery, flowcharts, and download high-resolution PDFs.</p>
                    </div>
                  </div>
                  <div className="pt-2">
                    <Link
                      to="/sop/new"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-slate-900 text-xs font-bold shadow-md hover:bg-slate-100 transition"
                    >
                      <span>Launch SOP Wizard Now</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              )}

              {/* Two Column Section: Recently Created & Recently Updated */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recently Created */}
                <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <PlusCircle className="w-4 h-4 text-brand-600" />
                      <span>Recently Created SOPs</span>
                    </h3>
                    <button
                      onClick={() => setActiveTab('my-sops')}
                      className="text-xs text-brand-600 font-semibold hover:underline"
                    >
                      View All
                    </button>
                  </div>

                  {recentlyCreated.length === 0 ? (
                    <p className="text-xs text-slate-400 py-6 text-center">No SOPs created yet.</p>
                  ) : (
                    <div className="space-y-2">
                      {recentlyCreated.map((d) => (
                        <Link
                          key={d.id}
                          to={`/sop/${d.id}/preview`}
                          className="p-3 rounded-2xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50 transition flex items-center justify-between group"
                        >
                          <div className="truncate mr-3">
                            <h4 className="text-xs font-bold text-slate-900 truncate group-hover:text-brand-600 transition">
                              {d.title}
                            </h4>
                            <span className="text-[10px] text-slate-400">
                              {d.category.toUpperCase()} • Created {new Date(d.created_at).toLocaleDateString()}
                            </span>
                          </div>
                          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition" />
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                {/* Recently Updated */}
                <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-indigo-600" />
                      <span>Recently Updated SOPs</span>
                    </h3>
                    <button
                      onClick={() => setActiveTab('my-sops')}
                      className="text-xs text-brand-600 font-semibold hover:underline"
                    >
                      View All
                    </button>
                  </div>

                  {recentlyUpdated.length === 0 ? (
                    <p className="text-xs text-slate-400 py-6 text-center">No updates recorded yet.</p>
                  ) : (
                    <div className="space-y-2">
                      {recentlyUpdated.map((d) => (
                        <Link
                          key={d.id}
                          to={`/sop/${d.id}/preview`}
                          className="p-3 rounded-2xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50 transition flex items-center justify-between group"
                        >
                          <div className="truncate mr-3">
                            <h4 className="text-xs font-bold text-slate-900 truncate group-hover:text-brand-600 transition">
                              {d.title}
                            </h4>
                            <span className="text-[10px] text-slate-400">
                              v{d.version || 1} • Last saved {new Date(d.updated_at).toLocaleDateString()}
                            </span>
                          </div>
                          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition" />
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {/* TAB 2: MY SOPS DOCUMENT MANAGEMENT */}
          {(activeTab === 'my-sops' || activeTab === 'dashboard') && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                    {activeTab === 'my-sops' ? 'My Standard Operating Procedures' : 'All SOP Documents'}
                  </h2>
                  <p className="text-xs text-slate-500">
                    Your personal library of generated, edited, and approved procedures.
                  </p>
                </div>

                {activeTab === 'dashboard' && (
                  <button
                    onClick={() => setActiveTab('my-sops')}
                    className="text-xs text-brand-600 font-bold hover:underline"
                  >
                    Expanded View &rarr;
                  </button>
                )}
              </div>

              {/* Filter and Search Bar */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-center gap-3">
                <div className="relative flex-1 w-full">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    placeholder="Search personal SOPs by title, department, or company..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
                  />
                </div>

                <div className="flex items-center gap-2 w-full md:w-auto">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-3 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                  >
                    <option value="all">All Departments</option>
                    {CATEGORIES.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>

                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="px-3 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                  >
                    <option value="all">Active SOPs</option>
                    <option value="ready">Ready for Review</option>
                    <option value="draft">Drafts Only</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>

              {/* Documents List */}
              {loading ? (
                <div className="bg-white rounded-3xl p-16 text-center border border-slate-200 text-slate-400">
                  <Sparkles className="w-8 h-8 mx-auto animate-spin text-brand-600 mb-3" />
                  <p className="text-sm font-medium">Synchronizing personal documents...</p>
                </div>
              ) : filtered.length === 0 ? (
                <div className="bg-white rounded-3xl p-16 text-center border border-slate-200 space-y-4">
                  <div className="w-16 h-16 rounded-3xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
                    <FolderOpen className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-800">No Documents Found</h3>
                    <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                      {searchQuery
                        ? 'No personal documents match your search criteria.'
                        : 'You have not created any SOP documents yet. Launch the wizard to generate your first procedure.'}
                    </p>
                  </div>
                  <Link
                    to="/sop/new"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold shadow-md transition"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>Create Your First SOP</span>
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {filtered.map((d) => (
                    <div
                      key={d.id}
                      className="bg-white rounded-3xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all p-6 flex flex-col justify-between space-y-4 group"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-[10px] uppercase tracking-wider bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                            {d.category}
                          </span>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              d.status === 'ready'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : d.status === 'archived'
                                ? 'bg-slate-100 text-slate-500'
                                : 'bg-amber-50 text-amber-700 border border-amber-200'
                            }`}
                          >
                            {d.status === 'ready' ? 'Ready' : d.status === 'archived' ? 'Archived' : 'Draft'}
                          </span>
                        </div>

                        <div>
                          <h3 className="font-extrabold text-slate-900 group-hover:text-brand-600 transition text-base leading-snug">
                            {d.title}
                          </h3>
                          <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                            {d.form_data?.purpose || d.form_data?.companyName || 'Standard Operating Procedure'}
                          </p>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-slate-100 space-y-3">
                        <div className="flex items-center justify-between text-[11px] text-slate-400">
                          <span>v{d.version || 1} • {d.target_page_count || 4} pages</span>
                          <span>{new Date(d.updated_at).toLocaleDateString()}</span>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <Link
                            to={`/sop/${d.id}/preview`}
                            className="py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold text-center transition flex items-center justify-center gap-1.5"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            <span>Preview</span>
                          </Link>

                          <button
                            onClick={() => handleQuickDownloadPDF(d)}
                            disabled={actionLoadingId === d.id}
                            className="py-2 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold text-center transition flex items-center justify-center gap-1.5"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>{actionLoadingId === d.id ? 'Rendering...' : 'PDF'}</span>
                          </button>
                        </div>

                        <div className="flex items-center justify-between pt-1 text-[11px] text-slate-400">
                          <button
                            onClick={() => handleDuplicate(d.id)}
                            className="hover:text-brand-600 flex items-center gap-1"
                          >
                            <Copy className="w-3 h-3" />
                            <span>Duplicate</span>
                          </button>
                          <button
                            onClick={() => handleArchive(d.id, d.status)}
                            className="hover:text-slate-700 flex items-center gap-1"
                          >
                            <Archive className="w-3 h-3" />
                            <span>{d.status === 'archived' ? 'Restore' : 'Archive'}</span>
                          </button>
                          <button
                            onClick={() => handleDelete(d.id, d.title)}
                            className="text-rose-500 hover:text-rose-700 flex items-center gap-1"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: TEMPLATES GALLERY (11 VISUAL PREVIEWS) */}
          {activeTab === 'templates' && (
            <div className="space-y-6">
              <TemplateGallery />
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
