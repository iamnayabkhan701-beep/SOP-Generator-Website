import React, { useState } from 'react';
import {
  Users,
  Server,
  ShieldAlert,
  Cpu,
  Activity,
  Coins,
  Headphones,
  Building2,
  Layers,
  Warehouse,
  GitBranch,
  Truck,
  HardHat,
  ShoppingBag,
  ChefHat,
  ShieldCheck,
  Leaf,
  TrendingUp,
  Megaphone,
  Scale,
  Laptop,
  ClipboardList,
  FileSpreadsheet,
  CheckCircle2,
  Search,
  ArrowRight,
  GraduationCap,
  FlaskConical,
  Wrench,
  Microscope,
  ShieldAlert as AlertIcon
} from 'lucide-react';
import { CATEGORIES, type SOPCategory, type CategoryMetadata } from '../types/sop';
import { getTemplatesForDepartment } from '../data/departmentTemplates';

interface DepartmentSelectorProps {
  onSelectDepartment: (deptId: SOPCategory) => void;
  selectedDept?: SOPCategory;
}

export const DepartmentSelector: React.FC<DepartmentSelectorProps> = ({
  onSelectDepartment,
  selectedDept,
}) => {
  const [search, setSearch] = useState('');

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
      case 'Warehouse': return <Warehouse className="w-5 h-5" />;
      case 'GitBranch': return <GitBranch className="w-5 h-5" />;
      case 'Truck': return <Truck className="w-5 h-5" />;
      case 'HardHat': return <HardHat className="w-5 h-5" />;
      case 'ShoppingBag': return <ShoppingBag className="w-5 h-5" />;
      case 'ChefHat': return <ChefHat className="w-5 h-5" />;
      case 'ShieldCheck': return <ShieldCheck className="w-5 h-5" />;
      case 'Leaf': return <Leaf className="w-5 h-5" />;
      case 'TrendingUp': return <TrendingUp className="w-5 h-5" />;
      case 'Megaphone': return <Megaphone className="w-5 h-5" />;
      case 'Scale': return <Scale className="w-5 h-5" />;
      case 'Laptop': return <Laptop className="w-5 h-5" />;
      case 'ClipboardList': return <ClipboardList className="w-5 h-5" />;
      case 'CheckCircle2': return <CheckCircle2 className="w-5 h-5" />;
      case 'GraduationCap': return <GraduationCap className="w-5 h-5" />;
      case 'FlaskConical': return <FlaskConical className="w-5 h-5" />;
      case 'Wrench': return <Wrench className="w-5 h-5" />;
      case 'Microscope': return <Microscope className="w-5 h-5" />;
      default: return <FileSpreadsheet className="w-5 h-5" />;
    }
  };

  // Only display the 22 primary departments (exclude legacy aliases from grid)
  const primaryDepartments = CATEGORIES.filter(c => !c.name.includes('(Legacy)') && c.id !== 'custom');

  const filtered = primaryDepartments.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Step 1: Select Operational Department
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Choose your organization domain to unlock industry-specific SOP templates and regulatory standards.
          </p>
        </div>

        {/* Search bar */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search 24 departments..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-white rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500 shadow-2xs"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((cat: CategoryMetadata) => {
          const templates = getTemplatesForDepartment(cat.id);
          const isSelected = selectedDept === cat.id;

          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => onSelectDepartment(cat.id)}
              className={`p-4 rounded-2xl text-left border transition-all flex flex-col justify-between group cursor-pointer ${
                isSelected
                  ? 'border-brand-600 bg-brand-50/50 shadow-md ring-2 ring-brand-500/20'
                  : 'border-slate-200/90 bg-white hover:border-brand-300 hover:shadow-sm'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className={`p-2.5 rounded-xl border transition-colors shadow-2xs ${
                    isSelected
                      ? 'bg-brand-600 text-white border-brand-600'
                      : 'bg-slate-50 border-slate-200 text-slate-700 group-hover:bg-brand-50 group-hover:text-brand-600'
                  }`}>
                    {getCategoryIcon(cat.iconName)}
                  </div>

                  <div className="flex items-center gap-1.5">
                    {cat.isRegulatedOrHighRisk && (
                      <span className="text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200/60 px-2 py-0.5 rounded-md flex items-center gap-1">
                        <AlertIcon className="w-2.5 h-2.5" />
                        Regulated
                      </span>
                    )}
                    {templates.length > 0 && (
                      <span className="text-[10px] font-bold bg-brand-50 text-brand-700 border border-brand-200/60 px-2 py-0.5 rounded-md">
                        {templates.length} {templates.length === 1 ? 'Template' : 'Templates'}
                      </span>
                    )}
                  </div>
                </div>

                <h3 className="font-bold text-slate-900 text-sm group-hover:text-brand-600 transition-colors">
                  {cat.name}
                </h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                  {cat.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-brand-600 font-semibold group-hover:translate-x-0.5 transition-transform">
                <span>View Templates</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

