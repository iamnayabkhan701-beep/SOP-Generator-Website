import React, { useState } from 'react';
import {
  User,
  Database,
  Key,
  Shield,
  CheckCircle,
  AlertTriangle,
  Lock,
  ExternalLink,
  Sparkles,
  Save,
  Check,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import {
  isSupabaseConfigured,
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  supabase,
} from '../lib/supabase';
import { SupabaseModal } from '../components/SupabaseModal';

export const Settings: React.FC = () => {
  const { user, resetPassword } = useAuth();
  const [showDbModal, setShowDbModal] = useState(false);
  const [testingConnection, setTestingConnection] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);
  const [resetSent, setResetSent] = useState(false);

  const isConfigured = isSupabaseConfigured();

  const handleTestConnection = async () => {
    setTestingConnection(true);
    setTestResult(null);

    if (!isConfigured) {
      setTestResult('Supabase is not configured yet. Configure project credentials first.');
      setTestingConnection(false);
      return;
    }

    try {
      const { data, error } = await supabase.from('sop_documents').select('id').limit(1);
      if (error) {
        setTestResult(`Connection failed: ${error.message}. (Ensure migrations have been run).`);
      } else {
        setTestResult('Success! Connected to Supabase PostgreSQL with active RLS policies.');
      }
    } catch (err: any) {
      setTestResult(`Connection failed: ${err.message}`);
    } finally {
      setTestingConnection(false);
    }
  };

  const handleTriggerPasswordReset = async () => {
    if (user?.email) {
      await resetPassword(user.email);
      setResetSent(true);
      setTimeout(() => setResetSent(false), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Account & System Settings
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage your profile, Supabase PostgreSQL connection, and backend security policies.
          </p>
        </div>

        {/* Profile Card */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-brand-50 text-brand-600">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">User Profile</h3>
              <p className="text-xs text-slate-500">Your authenticated identity and access rights</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Full Name
              </label>
              <input
                type="text"
                disabled
                value={user?.user_metadata?.full_name || 'Specialist User'}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 font-medium"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Email Address
              </label>
              <input
                type="text"
                disabled
                value={user?.email || 'user@sopify.ai'}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 font-medium"
              />
            </div>
          </div>

          <div className="border-t border-slate-100 pt-4 flex items-center justify-between">
            <span className="text-xs text-slate-500">Need to update your login password?</span>
            <button
              onClick={handleTriggerPasswordReset}
              className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-1.5 transition"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>{resetSent ? 'Reset Email Sent!' : 'Send Password Reset'}</span>
            </button>
          </div>
        </div>

        {/* Supabase Integration Card */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-2.5 rounded-xl ${isConfigured ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                <Database className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Supabase Backend Status</h3>
                <p className="text-xs text-slate-500">PostgreSQL database, Row Level Security & Private PDF Storage</p>
              </div>
            </div>

            <button
              onClick={() => setShowDbModal(true)}
              className="px-4 py-2 rounded-xl bg-brand-50 text-brand-700 text-xs font-bold hover:bg-brand-100 transition"
            >
              Configure Credentials
            </button>
          </div>

          <div className={`p-4 rounded-2xl border flex items-start gap-3.5 ${
            isConfigured ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-amber-50 border-amber-200 text-amber-900'
          }`}>
            {isConfigured ? (
              <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            )}
            <div className="text-xs space-y-1">
              <p className="font-bold text-sm">
                {isConfigured ? 'Connected to Live Supabase Project' : 'Running in Local Storage Mode'}
              </p>
              <p className="text-slate-600 leading-relaxed">
                {isConfigured
                  ? `Active Project: ${SUPABASE_URL}`
                  : 'Currently storing draft documents in safe local browser cache. Configure your Supabase URL & Anon Key to sync to PostgreSQL.'}
              </p>
            </div>
          </div>

          {/* Test Connection Button */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <button
                onClick={handleTestConnection}
                disabled={testingConnection}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-1.5 transition disabled:opacity-50"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{testingConnection ? 'Testing Connection...' : 'Run Diagnostics Test'}</span>
              </button>

              <a
                href="https://supabase.com/dashboard"
                target="_blank"
                rel="noreferrer"
                className="text-xs text-brand-600 hover:underline flex items-center gap-1"
              >
                <span>Supabase Dashboard</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {testResult && (
              <div className="p-3 rounded-xl bg-slate-100 text-slate-800 text-xs font-mono">
                {testResult}
              </div>
            )}
          </div>

          {/* Schema Migration Info */}
          <div className="border-t border-slate-100 pt-4 space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Database Migration Schema
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              The migration file <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-800 font-mono">supabase/migrations/20261102000000_init_sop_schema.sql</code> includes:
            </p>
            <ul className="text-xs text-slate-600 space-y-1 list-disc pl-5">
              <li><strong>profiles table:</strong> Linked to auth.users with trigger for automatic record creation.</li>
              <li><strong>sop_documents table:</strong> Structured columns, JSONB form data, and versioning.</li>
              <li><strong>sop_revisions table:</strong> Historical content revisions per user edit.</li>
              <li><strong>Row Level Security:</strong> Guaranteed isolation where <code className="text-brand-600">auth.uid() = user_id</code>.</li>
            </ul>
          </div>
        </div>

      </div>

      <SupabaseModal isOpen={showDbModal} onClose={() => setShowDbModal(false)} />
    </div>
  );
};

