import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { DepartmentTemplateList } from '../components/DepartmentTemplateList';
import type { SOPCategory } from '../types/sop';
import type { DepartmentTemplate } from '../data/departmentTemplates';

export const SOPTemplatesPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const deptParam = (searchParams.get('department') as SOPCategory) || 'warehouse';
  const [selectedDept, setSelectedDept] = useState<SOPCategory>(deptParam);

  const handleSelectTemplate = (template: DepartmentTemplate) => {
    // Navigate to SOP creation workflow with the selected template pre-loaded
    navigate(`/sop/new?templateId=${encodeURIComponent(template.id)}&department=${encodeURIComponent(template.departmentId)}`);
  };

  const handleCreateBlankCustom = () => {
    navigate(`/sop/new?department=${encodeURIComponent(selectedDept)}`);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <DepartmentTemplateList
          departmentId={selectedDept}
          onDepartmentChange={(newDept) => setSelectedDept(newDept)}
          onSelectTemplate={handleSelectTemplate}
          onCreateCustom={handleCreateBlankCustom}
          showDepartmentFilter={true}
        />
      </div>
    </div>
  );
};
