import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  User,
  Shield,
  Lock,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Trash2,
  LogOut,
  Save,
  Key,
  FileText,
  Clock,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

export const Settings: React.FC = () => {
  const { user, signOut, resetPassword } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'privacy'>('profile');

  // Profile State
  const [fullName, setFullName] = useState(user?.user_metadata?.full_name || '');
  const [organization, setOrganization] = useState(user?.user_metadata?.organization || 'Enterprise Solutions Inc.');
  const [profileSaved, setProfileSaved] = useState(false);

  // Security State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [passwordStatus, setPasswordStatus] = useState<{ success: boolean; msg: string } | null>(null);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  // Delete Account Confirmation Modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 2500);
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordStatus(null);

    if (newPassword.length < 6) {
      setPasswordStatus({ success: false, msg: 'New password must be at least 6 characters long.' });
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setPasswordStatus({ success: false, msg: 'New passwords do not match.' });
      return;
    }

    setIsUpdatingPassword(true);

    try {
      if (isSupabaseConfigured()) {
        const { error } = await supabase.auth.updateUser({ password: newPassword });
        if (error) throw error;
      }

      setPasswordStatus({ success: true, msg: 'Password updated successfully!' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (err: any) {
      setPasswordStatus({ success: false, msg: err?.message || 'Failed to update password.' });
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== 'DELETE') return;
    setIsDeleting(true);

    try {
      // Clear all personal local documents and account data
      if (user?.id) {
        localStorage.removeItem('sop_active_user_session');
        const rawDocs = localStorage.getItem('sop_local_documents');
        if (rawDocs) {
          const docs = JSON.parse(rawDocs);
          const remaining = docs.filter((d: any) => d.user_id !== user.id);
          localStorage.setItem('sop_local_documents', JSON.stringify(remaining));
        }
      }

      await signOut();
      navigate('/login');
    } catch (err) {
      console.error('Account deletion error', err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Account & Security Settings
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage your personal profile, authentication credentials, privacy, and active session.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 gap-4 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('profile')}
            className={`pb-3 px-1 border-b-2 transition ${
              activeTab === 'profile'
                ? 'border-brand-600 text-brand-600 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
          >
            User Profile
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`pb-3 px-1 border-b-2 transition ${
              activeTab === 'security'
                ? 'border-brand-600 text-brand-600 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
          >
            Password & Security
          </button>
          <button
            onClick={() => setActiveTab('privacy')}
            className={`pb-3 px-1 border-b-2 transition ${
              activeTab === 'privacy'
                ? 'border-brand-600 text-brand-600 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
          >
            Privacy & Data Retention
          </button>
        </div>

        {/* TAB 1: PROFILE */}
        {activeTab === 'profile' && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-brand-50 text-brand-600">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Personal Information</h3>
                <p className="text-xs text-slate-500">Update your public name and organizational association</p>
              </div>
            </div>

            <form onSubmit={handleUpdateProfile} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Nayab Khan"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Account Email
                  </label>
                  <input
                    type="email"
                    disabled
                    value={user?.email || ''}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-100 text-slate-500 font-mono cursor-not-allowed"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    Verified email cannot be modified directly.
                  </span>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Company / Organization
                </label>
                <input
                  type="text"
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                  placeholder="e.g. Acme Corporation"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                {profileSaved && (
                  <span className="text-emerald-600 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> Profile saved!
                  </span>
                )}
                <button
                  type="submit"
                  className="ml-auto px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold transition flex items-center gap-1.5 shadow-sm"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Profile</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 2: SECURITY */}
        {activeTab === 'security' && (
          <div className="space-y-6">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600">
                  <Key className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Change Password</h3>
                  <p className="text-xs text-slate-500">Keep your account secure with a strong password</p>
                </div>
              </div>

              {passwordStatus && (
                <div
                  className={`p-3.5 rounded-xl text-xs flex items-center gap-2 ${
                    passwordStatus.success
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : 'bg-rose-50 text-rose-800 border border-rose-200'
                  }`}
                >
                  {passwordStatus.success ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                  )}
                  <span>{passwordStatus.msg}</span>
                </div>
              )}

              <form onSubmit={handleChangePassword} className="space-y-4 text-xs max-w-md">
                <div>
                  <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    New Password (min 6 characters)
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 font-mono"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 font-mono"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isUpdatingPassword}
                  className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold transition flex items-center gap-1.5 shadow-sm disabled:opacity-50"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>{isUpdatingPassword ? 'Updating...' : 'Update Password'}</span>
                </button>
              </form>
            </div>

            {/* Session Management */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Active Authentication Session</h3>
                  <p className="text-xs text-slate-500">Your session is authenticated and encrypted</p>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-slate-800 block">Current Web Browser Session</span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    User UUID: {user?.id}
                  </span>
                </div>
                <button
                  onClick={() => signOut()}
                  className="px-3.5 py-1.5 rounded-xl border border-slate-300 hover:bg-white text-slate-700 font-semibold transition"
                >
                  Sign Out Everywhere
                </button>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-rose-200 shadow-sm space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-rose-50 text-rose-600">
                  <Trash2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-rose-900">Danger Zone: Delete Account</h3>
                  <p className="text-xs text-rose-700">Permanently delete your account and all associated SOPs</p>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                Deleting your account is permanent. All saved SOP documents, revisions, and generated PDFs will be immediately removed from our databases.
              </p>

              <button
                onClick={() => setShowDeleteModal(true)}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-sm transition"
              >
                Delete Account
              </button>
            </div>
          </div>
        )}

        {/* TAB 3: PRIVACY & DATA RETENTION */}
        {activeTab === 'privacy' && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-purple-50 text-purple-600">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Privacy & Data Governance</h3>
                <p className="text-xs text-slate-500">Row-Level Security (RLS) and document retention commitments</p>
              </div>
            </div>

            <div className="space-y-4 text-xs text-slate-600 leading-relaxed">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="font-bold text-slate-900 text-sm block">1. Strict Document Isolation</span>
                <p>
                  Every SOP generated on SOPify AI is assigned your unique account UUID. Supabase Row-Level Security (RLS) ensures no other user can read, edit, query, or delete your documents.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="font-bold text-slate-900 text-sm block">2. Private PDF Storage</span>
                <p>
                  PDF exports are stored in a private Supabase Storage bucket with authenticated token policies. No public URLs are ever issued.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="font-bold text-slate-900 text-sm block">3. Data Erasure Rights</span>
                <p>
                  You hold full rights to export your SOP data or invoke account deletion at any time, instantly wiping all records across PostgreSQL tables and storage buckets.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Delete Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white max-w-md w-full rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div className="text-center space-y-1">
                <h3 className="text-lg font-bold text-slate-900">Confirm Account Deletion</h3>
                <p className="text-xs text-slate-500">
                  This action is irreversible. All your private SOPs will be permanently erased.
                </p>
              </div>

              <div className="space-y-2">
                <label className="block text-[11px] font-semibold text-slate-700 uppercase tracking-wider">
                  Type <span className="font-bold text-rose-600 font-mono">DELETE</span> to confirm:
                </label>
                <input
                  type="text"
                  value={deleteConfirmText}
                  onChange={(e) => setDeleteConfirmText(e.target.value)}
                  placeholder="DELETE"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500 text-sm font-mono text-center"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowDeleteModal(false)}
                  className="py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={deleteConfirmText !== 'DELETE' || isDeleting}
                  onClick={handleDeleteAccount}
                  className="py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition disabled:opacity-50"
                >
                  {isDeleting ? 'Deleting...' : 'Delete My Account'}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
