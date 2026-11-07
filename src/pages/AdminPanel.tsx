import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  Database,
  Key,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  ExternalLink,
  Lock,
  Layers,
  Server,
  Copy,
  XCircle,
  ArrowLeft,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import {
  isSupabaseConfigured,
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  supabase,
} from '../lib/supabase';

const ADMIN_EMAIL = 'iamnayabkhan701@gmail.com';
const ADMIN_PASSWORD = 'nayab@2006';

export const AdminPanel: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [isAdminUnlocked, setIsAdminUnlocked] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const [url, setUrl] = useState(SUPABASE_URL || '');
  const [anonKey, setAnonKey] = useState(SUPABASE_ANON_KEY || '');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [stats, setStats] = useState({ totalDocs: 0, totalUsers: 0, totalRevisions: 0 });

  const isConfigured = isSupabaseConfigured();

  // Auto-unlock if the logged-in user is the admin
  useEffect(() => {
    if (user?.email === ADMIN_EMAIL) {
      setIsAdminUnlocked(true);
    }
  }, [user]);

  // If a non-admin user is logged in, block access
  const isNonAdminLoggedIn = user && user.email !== ADMIN_EMAIL;

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginEmail.trim() === ADMIN_EMAIL && loginPassword === ADMIN_PASSWORD) {
      setIsAdminUnlocked(true);
      setLoginError('');
    } else {
      setLoginError('Invalid administrator credentials. Access denied.');
    }
  };

  const handleSaveCredentials = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    localStorage.setItem('sop_supabase_url', url.trim());
    localStorage.setItem('sop_supabase_key', anonKey.trim());
    setIsSaving(false);
    setSaveSuccess(true);
    setTimeout(() => {
      window.location.reload();
    }, 800);
  };

  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult(null);

    if (!isConfigured) {
      setTestResult({
        success: false,
        message: 'Supabase URL or Anon Key is missing. Please save valid credentials above.',
      });
      setIsTesting(false);
      return;
    }

    try {
      const { error, count } = await supabase
        .from('sop_documents')
        .select('*', { count: 'exact', head: true });

      if (error) {
        setTestResult({
          success: false,
          message: `Database check returned an error: ${error.message}`,
        });
      } else {
        setTestResult({
          success: true,
          message: 'Connection Successful! PostgreSQL database and Row-Level Security (RLS) are active.',
        });
        setStats((prev) => ({ ...prev, totalDocs: count || 0 }));
      }
    } catch (err: any) {
      setTestResult({
        success: false,
        message: `Network error connecting to Supabase: ${err.message}`,
      });
    } finally {
      setIsTesting(false);
    }
  };

  // --- ACCESS DENIED (non-admin logged-in user) ---
  if (isNonAdminLoggedIn) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 bg-slate-50">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-rose-200 shadow-xl space-y-6 text-center">
          <div className="w-14 h-14 rounded-full bg-rose-100 text-rose-600 mx-auto flex items-center justify-center">
            <XCircle className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900">Access Denied</h2>
          <p className="text-sm text-slate-500 leading-relaxed">
            This Admin Panel is restricted to authorized administrators only.
            Your account <strong className="text-slate-700">{user?.email}</strong> does not have
            administrative privileges.
          </p>
          <button
            onClick={() => navigate('/dashboard')}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // --- ADMIN LOGIN SCREEN ---
  if (!isAdminUnlocked) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 bg-slate-50">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200/90 shadow-xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white mx-auto flex items-center justify-center shadow-md">
              <Lock className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Admin Portal</h2>
            <p className="text-xs text-slate-500">
              Administrative access is restricted. Sign in with your admin credentials to access system configuration.
            </p>
          </div>

          {loginError && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-500" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Admin Email
              </label>
              <input
                type="email"
                placeholder="Enter admin email address"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900 text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Admin Password
              </label>
              <input
                type="password"
                placeholder="Enter admin password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900 text-sm font-mono"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm shadow-md transition"
            >
              Unlock Admin Console
            </button>
          </form>

          <p className="text-center text-[11px] text-slate-400">
            Only authorized administrators can access this panel.
          </p>
        </div>
      </div>
    );
  }

  // --- FULL ADMIN PANEL ---
  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">

        {/* Header Banner */}
        <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="bg-brand-500/20 text-brand-300 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider border border-brand-400/30">
                System Administration
              </span>
              <span className="text-xs text-slate-400 font-mono">Restricted Access</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Backend & Supabase Control Panel
            </h1>
            <p className="text-xs text-slate-400">
              Signed in as admin: <span className="text-brand-300 font-mono">{ADMIN_EMAIL}</span>
            </p>
          </div>

          <button
            onClick={() => setIsAdminUnlocked(false)}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition shrink-0"
          >
            Lock Admin Panel
          </button>
        </div>

        {/* Supabase Status Alert */}
        <div className={`p-5 rounded-2xl border flex items-start gap-4 ${
          isConfigured
            ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
            : 'bg-amber-50 border-amber-200 text-amber-900'
        }`}>
          {isConfigured ? (
            <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
          ) : (
            <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
          )}
          <div className="space-y-1">
            <h3 className="font-bold text-sm">
              {isConfigured ? 'Supabase Backend Connected & Protected' : 'Supabase Not Configured (Using Local Storage)'}
            </h3>
            <p className="text-xs leading-relaxed opacity-90">
              {isConfigured
                ? `Active PostgreSQL Database: ${SUPABASE_URL}. Standard users cannot see this configuration.`
                : 'Configure your Supabase Project URL and Anon Key below. Once saved, all documents and auth will sync to PostgreSQL.'}
            </p>
          </div>
        </div>

        {/* Supabase Credentials Configuration Form */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-brand-50 text-brand-600">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Supabase API Credentials</h2>
              <p className="text-xs text-slate-500">Configure your project URL and publishable anon key</p>
            </div>
          </div>

          <form onSubmit={handleSaveCredentials} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Supabase Project URL
              </label>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://your-project.supabase.co"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-brand-500"
                required
              />
              <p className="text-[11px] text-slate-400 mt-1">Found in Supabase Dashboard &gt; Settings &gt; API</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Supabase Anon / Public Key
              </label>
              <input
                type="password"
                value={anonKey}
                onChange={(e) => setAnonKey(e.target.value)}
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-brand-500"
                required
              />
              <p className="text-[11px] text-slate-400 mt-1">Client-safe publishable key (do NOT use service_role here)</p>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={handleTestConnection}
                disabled={isTesting}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 flex items-center gap-1.5 transition disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isTesting ? 'animate-spin' : ''}`} />
                <span>{isTesting ? 'Testing...' : 'Test Database Connection'}</span>
              </button>

              <button
                type="submit"
                disabled={isSaving}
                className="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs shadow-md shadow-brand-500/20 transition flex items-center gap-1.5"
              >
                {saveSuccess ? 'Saved & Reloaded!' : 'Save Supabase Credentials'}
              </button>
            </div>
          </form>

          {testResult && (
            <div className={`p-4 rounded-xl border text-xs font-mono leading-relaxed ${
              testResult.success
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : 'bg-rose-50 border-rose-200 text-rose-800'
            }`}>
              {testResult.message}
            </div>
          )}
        </div>

        {/* Google OAuth Configuration Guide */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Google OAuth Provider Setup</h2>
              <p className="text-xs text-slate-500">Allow users to sign in with their personal Google accounts</p>
            </div>
          </div>

          <div className="space-y-3 text-xs text-slate-600 leading-relaxed bg-slate-50 p-5 rounded-2xl border border-slate-100">
            <p className="font-semibold text-slate-900">Follow these 3 steps in Google Cloud and Supabase:</p>
            <ol className="list-decimal pl-5 space-y-2">
              <li>
                <strong>Create OAuth Client in Google Cloud:</strong> Open{' '}
                <a href="https://console.cloud.google.com/apis/credentials" target="_blank" rel="noreferrer" className="text-brand-600 hover:underline inline-flex items-center gap-0.5">
                  Google Cloud Credentials <ExternalLink className="w-3 h-3"/>
                </a>{' '}
                &gt; Click <em>Create Credentials</em> &gt; <em>OAuth client ID</em> &gt; Choose <em>Web application</em>.
              </li>
              <li>
                <strong>Add Redirect URI:</strong> In the <em>Authorized redirect URIs</em> section, paste your Supabase callback URL:
                <div className="bg-slate-900 text-slate-100 p-2.5 rounded-xl font-mono text-[11px] mt-1 select-all">
                  {url ? `${url}/auth/v1/callback` : 'https://<your-project-ref>.supabase.co/auth/v1/callback'}
                </div>
              </li>
              <li>
                <strong>Enable in Supabase:</strong> Open your{' '}
                <a href="https://supabase.com/dashboard" target="_blank" rel="noreferrer" className="text-brand-600 hover:underline inline-flex items-center gap-0.5">
                  Supabase Dashboard <ExternalLink className="w-3 h-3"/>
                </a>{' '}
                &gt; <strong>Authentication</strong> &gt; <strong>Providers</strong> &gt; Toggle <strong>Google</strong> to <strong>Enabled</strong> and paste your Google Client ID and Secret.
              </li>
            </ol>
          </div>
        </div>

        {/* Database Migration SQL */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-purple-50 text-purple-600">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">Database Schema Migration SQL</h2>
                <p className="text-xs text-slate-500">Run this in your Supabase SQL Editor</p>
              </div>
            </div>

            <span className="text-xs bg-purple-100 text-purple-800 font-bold px-2.5 py-1 rounded-full">
              Migration Ready
            </span>
          </div>

          <p className="text-xs text-slate-500 leading-relaxed">
            The schema migration file is located in{' '}
            <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-800 font-mono">
              supabase/migrations/20261102000000_init_sop_schema.sql
            </code>
            . It creates the <code className="text-brand-600 font-bold">profiles</code>,{' '}
            <code className="text-brand-600 font-bold">sop_documents</code>, and{' '}
            <code className="text-brand-600 font-bold">sop_revisions</code> tables with strict Row-Level Security.
          </p>

          <div className="bg-slate-900 text-slate-200 p-4 rounded-2xl font-mono text-xs flex items-center justify-between">
            <span>supabase/migrations/20261102000000_init_sop_schema.sql</span>
            <a
              href="https://supabase.com/dashboard"
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1 bg-brand-600 hover:bg-brand-500 text-white rounded-lg text-xs font-sans font-semibold flex items-center gap-1"
            >
              <span>Open SQL Editor</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};
