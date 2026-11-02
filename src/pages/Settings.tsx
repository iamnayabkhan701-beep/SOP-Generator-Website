import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  User,
  Shield,
  Lock,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Bell,
  Palette,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Settings: React.FC = () => {
  const { user, resetPassword } = useAuth();
  const [resetSent, setResetSent] = useState(false);

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
            Account Settings
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage your personal profile, security preferences, and account credentials.
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
              <p className="text-xs text-slate-500">Your personal profile and account identification</p>
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

          <div className="border-t border-slate-100 pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <span className="text-xs text-slate-500">Need to update your password?</span>
            <button
              onClick={handleTriggerPasswordReset}
              className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-1.5 transition self-start sm:self-auto"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>{resetSent ? 'Reset Email Sent!' : 'Send Password Reset Email'}</span>
            </button>
          </div>
        </div>

        {/* Workspace Preferences */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Workspace Preferences</h3>
              <p className="text-xs text-slate-500">Default PDF export and formatting settings</p>
            </div>
          </div>

          <div className="space-y-3 text-xs text-slate-600">
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
              <div>
                <span className="font-semibold text-slate-900 block">Default Export Format</span>
                <span className="text-slate-500 text-[11px]">Vector PDF with running header, footer, and page counts</span>
              </div>
              <span className="font-mono text-brand-600 font-bold bg-brand-50 px-2 py-0.5 rounded">PDF A4</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
              <div>
                <span className="font-semibold text-slate-900 block">Automatic Relevant Visuals</span>
                <span className="text-slate-500 text-[11px]">Automatically include process flowcharts, charts & images in SOPs</span>
              </div>
              <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">Enabled</span>
            </div>
          </div>
        </div>

        {/* Admin Access Box */}
        <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              System Administration
            </span>
            <h4 className="text-base font-bold text-white mt-0.5">
              Admin & Database Management
            </h4>
            <p className="text-xs text-slate-400 mt-1">
              Supabase project credentials, database tables, and OAuth configurations are managed exclusively in the Admin Panel.
            </p>
          </div>

          <Link
            to="/admin"
            className="px-5 py-2.5 rounded-xl bg-white text-slate-900 hover:bg-slate-100 font-bold text-xs shrink-0 transition flex items-center gap-1.5"
          >
            <ShieldCheck className="w-4 h-4 text-brand-600" />
            <span>Open Admin Panel</span>
          </Link>
        </div>

      </div>
    </div>
  );
};
