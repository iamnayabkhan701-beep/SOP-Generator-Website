import type { SOPCategory } from '../types/sop';
import type { DepartmentTopic } from './departmentTemplates';
import { INITIAL_DEPARTMENT_TOPICS } from './initialDepartmentTopics';
import { ALL_REMAINING_TOPICS } from './allDepartmentTopics';
import { EXTENDED_DEPARTMENT_TOPICS } from './departmentTopicsExtended';
import { FINAL_DEPARTMENT_TOPICS } from './departmentTopicsFinal';

import { WAREHOUSE_AND_LOGISTICS_SOPS } from './libraries/warehouseAndLogisticsSOPs';
import { QUALITY_AND_COMPLIANCE_SOPS } from './libraries/qualityAndComplianceSOPs';
import { BUSINESS_AND_MANAGEMENT_SOPS } from './libraries/businessAndManagementSOPs';
import { OPERATIONS_AND_MANUFACTURING_SOPS } from './libraries/operationsAndManufacturingSOPs';
import { TECHNOLOGY_AND_SPECIALIZED_SOPS } from './libraries/technologyAndSpecializedSOPs';

// Master unified SOP library combining all researched department libraries
export const MASTER_SOP_LIBRARY: DepartmentTopic[] = [
  ...WAREHOUSE_AND_LOGISTICS_SOPS,
  ...QUALITY_AND_COMPLIANCE_SOPS,
  ...BUSINESS_AND_MANAGEMENT_SOPS,
  ...OPERATIONS_AND_MANUFACTURING_SOPS,
  ...TECHNOLOGY_AND_SPECIALIZED_SOPS,
  ...INITIAL_DEPARTMENT_TOPICS,
  ...ALL_REMAINING_TOPICS,
  ...EXTENDED_DEPARTMENT_TOPICS,
  ...FINAL_DEPARTMENT_TOPICS,
];

// Deduplicate by ID to ensure strict uniqueness
const uniqueMap = new Map<string, DepartmentTopic>();
MASTER_SOP_LIBRARY.forEach((item) => {
  if (!uniqueMap.has(item.id)) {
    uniqueMap.set(item.id, item);
  }
});

export const ALL_SOPS: DepartmentTopic[] = Array.from(uniqueMap.values());

/**
 * Normalizes aliases and retrieves all available SOP templates for a department
 */
export function getSOPsForDepartment(deptId: SOPCategory): DepartmentTopic[] {
  let target = deptId;
  if (deptId === 'office') target = 'administration';
  if (deptId === 'quality') target = 'qc';
  if (deptId === 'safety') target = 'security';
  if (deptId === 'food-service') target = 'food-safety';
  if (deptId === 'cybersecurity') target = 'it';
  if (deptId === 'environmental') target = 'ehs';

  const matches = ALL_SOPS.filter(
    (item) => item.departmentId === target || item.departmentId === deptId
  );

  return matches;
}

/**
 * Look up a specific SOP template by its unique ID
 */
export function getSOPById(id: string): DepartmentTopic | undefined {
  return ALL_SOPS.find((item) => item.id === id);
}

/**
 * Returns total count of SOP templates for each department
 */
export function getDepartmentSOPCounts(): Record<string, number> {
  const counts: Record<string, number> = {};
  ALL_SOPS.forEach((item) => {
    counts[item.departmentId] = (counts[item.departmentId] || 0) + 1;
  });
  return counts;
}

