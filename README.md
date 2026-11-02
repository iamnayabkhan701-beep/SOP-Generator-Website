# SOPify AI — Enterprise AI Standard Operating Procedure Generator

A production-minded, responsive AI-powered Standard Operating Procedure (SOP) web application built with **React**, **TypeScript**, **Tailwind CSS**, and **Supabase**.

Users can create audit-ready, structured SOPs by selecting a department, visual theme, and document structure, entering organization-specific parameters, editing drafts with an interactive section manager, and exporting high-resolution, printable PDFs with formal sign-off approval blocks.

---

## 🚀 Key Features

1. **Department-Specialized SOPs**:
   - 11 supported domains: HR, IT Infrastructure, Workplace Safety & EHS, Manufacturing, Quality Control (QA/QC), Healthcare Administration, Finance & Accounting, Customer Service, Office Administration, Operations, and Custom Workflows.
   - Built-in regulatory warnings and compliance disclaimers for safety-critical and regulated sectors.

2. **Decoupled Architecture**:
   - **5 Printable Visual Themes**: Professional Blue, Corporate Slate, Modern Emerald, Minimal Clean, and Creative Violet.
   - **6 Modular Document Structures**: Standard SOP, Detailed Enterprise, Checklist-Based, Table Action Matrix, Step-by-Step Procedure, and Custom.

3. **Supabase PostgreSQL & Security**:
   - Supabase Auth (Email & Password, ready for Google OAuth).
   - Strict **Row-Level Security (RLS)** ensuring users only ever access their own documents, revisions, and storage files.
   - Version history and revision tracking.
   - Private Supabase Storage bucket for generated PDFs.

4. **Interactive Section Editor & Real PDF Generation**:
   - In-browser live document editing (reorder sections, add custom clauses, toggle checklists, and edit headings).
   - Vector-crisp PDF rendering via `jspdf` & `jspdf-autotable` with running headers/footers, metadata grids, sign-off blocks, and exact page counting.

5. **Serverless AI Ready**:
   - Dual support for **Netlify Functions** (`netlify/functions/generate-sop.ts`) and **Supabase Edge Functions** (`supabase/functions/generate-sop/index.ts`).
   - Secure server-side execution: API keys are never leaked to frontend bundles.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Lucide Icons, React Router v6
- **Backend & Database**: Supabase (PostgreSQL, Auth, RLS, Storage)
- **PDF Publishing**: jsPDF & jsPDF-AutoTable
- **Deployment**: Netlify

---

## 📦 Local Setup & Development

### 1. Prerequisites
- Node.js (v18+)
- npm or pnpm

### 2. Installation
```bash
git clone <your-repo-url>
cd "SOP Website"
npm install
```

### 3. Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Fill in your Supabase project credentials:
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-publishable-key
```

*(Note: If you run without `.env`, the application gracefully defaults to local testing mode so you can preview the wizard, section editor, and PDF download without being blocked!)*

### 4. Run Development Server
```bash
npm run dev
```
Open `http://localhost:5173` in your browser.

---

## 🗄️ Supabase Database Setup

1. Open your [Supabase Project Dashboard](https://supabase.com/dashboard).
2. Go to the **SQL Editor** in the left sidebar.
3. Open `supabase/migrations/20261102000000_init_sop_schema.sql` from this repository.
4. Paste the SQL contents and click **Run**.

This migration automatically sets up:
- `profiles` table with automatic user creation triggers.
- `sop_documents` table with indexes and JSONB structured storage.
- `sop_revisions` table for historical audit trails.
- Private `sop_documents` storage bucket.
- Comprehensive **Row Level Security (RLS)** policies on all tables and storage objects.

---

## 🌐 Netlify Deployment

1. Push your repository to GitHub:
   ```bash
   git add .
   git commit -m "feat: complete AI SOP Generator with Supabase integration"
   git push origin main
   ```
2. Log into [Netlify](https://app.netlify.com) and click **"Add new site" > "Import an existing project"**.
3. Select your GitHub repository.
4. Netlify will automatically detect `netlify.toml`:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
   - **Functions directory**: `netlify/functions`
5. In Netlify Site Settings > **Environment variables**, add:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `AI_API_KEY` (if using external serverless AI generation)
   - `AI_PROVIDER` (e.g. `gemini` or `openai`)
6. In your Supabase Dashboard under **Authentication > URL Configuration**, add your deployed Netlify URL to **Site URL** and **Redirect URLs**.

---

## 📄 License
MIT License. Built for enterprise operational excellence.

