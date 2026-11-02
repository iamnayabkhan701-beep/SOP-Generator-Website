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
  Filter,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  FolderOpen,
  Sparkles,
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
import { generateSOPPdf } from '../lib/pdfGenerator';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
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
    if (window.confirm(`Are you sure you want to permanently delete "${title}"?`)) {
      setActionLoadingId(id);
      await deleteSOPDocument(id);
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

  const handleQuickDownloadPDF = async (doc: SOPDocument) => {
    if (!doc.generated_content) {
      alert('This draft does not have generated content yet. Open it to generate.');
      return;
    }
    setActionLoadingId(doc.id);
    try {
      const activeContent = doc.edited_content || doc.generated_content;
      const { blob, filename } = await generateSOPPdf({
        content: activeContent,
        theme: doc.theme,
        structure: doc.structure,
        organizationName: doc.form_data?.companyName,
      });

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error('PDF quick export error', e);
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

  // Calculate statistics
  const totalCount = documents.length;
  const readyCount = documents.filter((d) => d.status === 'ready').length;
  const draftCount = documents.filter((d) => d.status === 'draft').length;
  const archivedCount = documents.filter((d) => d.status === 'archived').length;

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Top Header Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Welcome, {user?.user_metadata?.full_name || user?.email?.split('@')[0]}
              </h1>
              <span className="bg-brand-50 text-brand-700 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-brand-200">
                Workspace
              </span>
            </div>
            <p className="text-sm text-slate-500 mt-1">
              Create, manage, and distribute enterprise Standard Operating Procedures.
            </p>
          </div>

          <Link
            to="/sop/new"
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm shadow-lg shadow-brand-500/25 transition shrink-0"
          >
            <PlusCircle className="w-5 h-5" />
            <span>Create New SOP</span>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total SOPs</span>
            <div className="flex items-center justify-between mt-2">
              <span className="text-3xl font-extrabold text-slate-900">{totalCount}</span>
              <div className="p-2.5 bg-brand-50 text-brand-600 rounded-xl">
                <FileText className="w-5 h-5" />
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Approved & Ready</span>
            <div className="flex items-center justify-between mt-2">
              <span className="text-3xl font-extrabold text-emerald-600">{readyCount}</span>
              <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
                <FileCheck className="w-5 h-5" />
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Drafts in Progress</span>
            <div className="flex items-center justify-between mt-2">
              <span className="text-3xl font-extrabold text-amber-600">{draftCount}</span>
              <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl">
                <Clock className="w-5 h-5" />
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Archived</span>
            <div className="flex items-center justify-between mt-2">
              <span className="text-3xl font-extrabold text-slate-500">{archivedCount}</span>
              <div className="p-2.5 bg-slate-100 text-slate-500 rounded-xl">
                <Archive className="w-5 h-5" />
              </div>
            </div>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="Search by title, department, or company..."
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
            <p className="text-sm font-medium">Synchronizing documents from Supabase...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-3xl p-16 text-center border border-slate-200 space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
              <FolderOpen className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800">No Documents Found</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                {searchQuery || selectedCategory !== 'all' || selectedStatus !== 'all'
                  ? 'No documents match your filter criteria. Try resetting search filters.'
                  : 'You have not created any standard operating procedures yet. Get started in 2 minutes!'}
              </p>
            </div>
            <Link
              to="/sop/new"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 text-white font-semibold text-xs shadow-md shadow-brand-500/20"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create Your First SOP</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((doc) => {
              const catMeta = CATEGORIES.find((c) => c.id === doc.category);
              return (
                <div
                  key={doc.id}
                  className="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group"
                >
                  <div className="p-5 space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                        {catMeta?.name || doc.category}
                      </span>
                      <span
                        className={`font-semibold px-2.5 py-0.5 rounded-full text-[11px] ${
                          doc.status === 'ready'
                            ? 'bg-emerald-100 text-emerald-800'
                            : doc.status === 'archived'
                            ? 'bg-slate-100 text-slate-500'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {doc.status.toUpperCase()}
                      </span>
                    </div>

                    <div>
                      <Link
                        to={`/sop/${doc.id}/preview`}
                        className="font-bold text-slate-900 group-hover:text-brand-600 transition-colors text-base line-clamp-1"
                      >
                        {doc.title}
                      </Link>
                      <p className="text-xs text-slate-500 mt-1">
                        {doc.form_data?.companyName || 'Enterprise'} • {doc.form_data?.department || 'Operations'}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 text-[11px] text-slate-400 font-mono">
                      <span>v{doc.version || 1}.0</span>
                      <span>•</span>
                      <span className="capitalize">{doc.theme?.replace('-', ' ')}</span>
                      <span>•</span>
                      <span className="capitalize">{doc.structure}</span>
                    </div>
                  </div>

                  <div className="border-t border-slate-100 px-5 py-3 bg-slate-50/60 flex items-center justify-between text-xs">
                    <span className="text-[11px] text-slate-400">
                      {new Date(doc.updated_at).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleQuickDownloadPDF(doc)}
                        title="Download PDF"
                        disabled={actionLoadingId === doc.id}
                        className="p-1.5 rounded-lg text-slate-600 hover:text-brand-600 hover:bg-white transition"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDuplicate(doc.id)}
                        title="Duplicate Document"
                        disabled={actionLoadingId === doc.id}
                        className="p-1.5 rounded-lg text-slate-600 hover:text-indigo-600 hover:bg-white transition"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleArchive(doc.id, doc.status)}
                        title={doc.status === 'archived' ? 'Unarchive' : 'Archive'}
                        disabled={actionLoadingId === doc.id}
                        className="p-1.5 rounded-lg text-slate-600 hover:text-amber-600 hover:bg-white transition"
                      >
                        <Archive className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(doc.id, doc.title)}
                        title="Delete Permanently"
                        disabled={actionLoadingId === doc.id}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-white transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <Link
                        to={`/sop/${doc.id}/preview`}
                        className="ml-1 px-3 py-1 rounded-lg bg-brand-50 text-brand-700 hover:bg-brand-100 font-semibold text-xs transition"
                      >
                        Open
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
};

