import React from 'react';
import { FileText, ShieldAlert, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-slate-200 mt-20 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Compliance & Trust Notice */}
        <div className="mb-10 p-5 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3.5 text-xs text-slate-700 leading-relaxed">
          <ShieldAlert className="w-5 h-5 text-slate-500 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold block text-sm mb-1 text-slate-900">Important Regulatory & Operational Disclaimer</span>
            <p>
              Standard Operating Procedure documents generated on this platform serve as operational drafts, not certified engineering standards or legal guarantees of compliance. 
              Before implementing high-risk standard operating procedures (including Healthcare, Workplace Safety, Chemical Handling, Construction, and Quality Control), 
              documents must undergo formal scrutiny and sign-off by a qualified compliance or domain authority.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-brand-600 flex items-center justify-center text-white">
                <FileText className="w-4 h-4" />
              </div>
              <span className="font-bold text-slate-900 text-base">SOPFlow</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Professional SOP documentation platform for enterprise teams — compliant procedural workflows, Supabase security, and accurate PDF publishing.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">Departments</h4>
            <ul className="space-y-2 text-xs text-slate-500">
              <li><a href="/#categories" className="hover:text-brand-600">Human Resources</a></li>
              <li><a href="/#categories" className="hover:text-brand-600">Manufacturing & QA</a></li>
              <li><a href="/#categories" className="hover:text-brand-600">Workplace Safety & EHS</a></li>
              <li><a href="/#categories" className="hover:text-brand-600">Information Technology</a></li>
              <li><a href="/#categories" className="hover:text-brand-600">Finance & Accounting</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">Architecture</h4>
            <ul className="space-y-2 text-xs text-slate-500">
              <li><span className="font-medium text-slate-700">Database:</span> Supabase PostgreSQL</li>
              <li><span className="font-medium text-slate-700">Security:</span> Row Level Security (RLS)</li>
              <li><span className="font-medium text-slate-700">Storage:</span> Private PDF Buckets</li>
              <li><span className="font-medium text-slate-700">Hosting:</span> Netlify Edge SPA</li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">Resources</h4>
            <ul className="space-y-2 text-xs text-slate-500">
              <li><a href="/login" className="hover:text-brand-600">User Login</a></li>
              <li><a href="/signup" className="hover:text-brand-600">Sign Up Free</a></li>
              <li><a href="https://supabase.com" target="_blank" rel="noreferrer" className="hover:text-brand-600 inline-flex items-center gap-1">Supabase Cloud <ExternalLink className="w-3 h-3"/></a></li>
              <li><a href="https://netlify.com" target="_blank" rel="noreferrer" className="hover:text-brand-600 inline-flex items-center gap-1">Netlify Deploy <ExternalLink className="w-3 h-3"/></a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-100 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-3">
          <p>© {new Date().getFullYear()} SOPFlow. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built with React, TypeScript, Supabase & Tailwind CSS
          </p>
          <a
            href="/admin"
            className="text-[10px] text-slate-300 hover:text-slate-500 transition-colors ml-4"
            title="Administrator Access"
          >
            Admin
          </a>
        </div>
      </div>
    </footer>
  );
};
