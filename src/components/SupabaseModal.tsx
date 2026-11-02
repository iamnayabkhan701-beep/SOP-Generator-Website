import React, { useState } from 'react';
import { Database, Key, CheckCircle, AlertTriangle, X, ExternalLink, Copy } from 'lucide-react';
import { isSupabaseConfigured, SUPABASE_URL, SUPABASE_ANON_KEY } from '../lib/supabase';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const SupabaseModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [url, setUrl] = useState(SUPABASE_URL || '');
  const [anonKey, setAnonKey] = useState(SUPABASE_ANON_KEY || '');
  const [saved, setSaved] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);

  if (!isOpen) return null;

  const isConfigured = isSupabaseConfigured();

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('sop_supabase_url', url.trim());
    localStorage.setItem('sop_supabase_key', anonKey.trim());
    setSaved(true);
    setTimeout(() => {
      window.location.reload();
    }, 800);
  };

  const handleReset = () => {
    localStorage.removeItem('sop_supabase_url');
    localStorage.removeItem('sop_supabase_key');
    window.location.reload();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl ${isConfigured ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-lg">Supabase Backend Configuration</h3>
              <p className="text-xs text-slate-500">PostgreSQL Database, Authentication & RLS Storage</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Status Alert */}
          <div className={`p-4 rounded-xl border flex items-start gap-3.5 ${
            isConfigured 
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900' 
              : 'bg-amber-50 border-amber-200 text-amber-900'
          }`}>
            {isConfigured ? (
              <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            )}
            <div className="text-sm">
              <span className="font-semibold block">
                {isConfigured ? 'Supabase Backend Connected' : 'Supabase Not Configured (Local Demo Mode)'}
              </span>
              <p className="text-xs mt-1 text-slate-600 leading-relaxed">
                {isConfigured 
                  ? 'All authentication, documents, and revisions are securely persisting to your Supabase PostgreSQL instance with Row Level Security enabled.'
                  : 'You can test all SOP generator features locally. To persist documents to your real database, configure your Supabase credentials below or in your .env file.'
                }
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Supabase Project URL
              </label>
              <div className="relative">
                <input
                  type="url"
                  placeholder="https://xyzcompany.supabase.co"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm font-mono"
                  required
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Found in your Supabase Dashboard under Project Settings &gt; API</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Supabase Anon / Publishable Key
              </label>
              <div className="relative">
                <input
                  type="password"
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                  value={anonKey}
                  onChange={(e) => setAnonKey(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm font-mono"
                  required
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Frontend-safe public key (Never enter your service_role secret here)</p>
            </div>

            <div className="flex items-center justify-between pt-2">
              {isConfigured && (
                <button
                  type="button"
                  onClick={handleReset}
                  className="text-xs text-rose-600 hover:text-rose-700 font-medium"
                >
                  Clear Saved Credentials
                </button>
              )}
              <div className="flex gap-2 ml-auto">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-xl shadow-sm transition flex items-center gap-1.5"
                >
                  {saved ? 'Saved! Reloading...' : 'Save & Connect'}
                </button>
              </div>
            </div>
          </form>

          {/* Database Setup Instructions */}
          <div className="border-t border-slate-100 pt-5 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center justify-between">
              <span>Database Migrations (SQL)</span>
              <a
                href="https://supabase.com/dashboard"
                target="_blank"
                rel="noreferrer"
                className="text-brand-600 hover:underline flex items-center gap-1 normal-case font-normal text-xs"
              >
                Open Supabase Dashboard <ExternalLink className="w-3 h-3" />
              </a>
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              We have already prepared the full schema migration in <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-800">supabase/migrations/20261102000000_init_sop_schema.sql</code>. It creates the <code className="text-brand-600 font-semibold">profiles</code>, <code className="text-brand-600 font-semibold">sop_documents</code>, and <code className="text-brand-600 font-semibold">sop_revisions</code> tables with strict Row Level Security.
            </p>
            <div className="bg-slate-900 text-slate-200 rounded-xl p-3 text-xs font-mono flex items-center justify-between">
              <span className="truncate pr-2">File: supabase/migrations/20261102000000_init_sop_schema.sql</span>
              <span className="shrink-0 bg-slate-800 text-emerald-400 px-2 py-0.5 rounded text-[10px]">Ready</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

