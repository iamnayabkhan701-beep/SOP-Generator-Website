import type { SOPCategory, SOPStructure } from '../types/sop';

export interface DepartmentTopic {
  id: string;
  departmentId: SOPCategory;
  topicName: string;
  title: string;
  description: string;
  structure: SOPStructure;
  estimatedPages: number;
  referencedStandards: string[];
  tags: string[];
  isRegulated: boolean;
  purpose: string;
  scope: string;
  responsibilities: string;
  requiredResources: string;
  procedureDetails: string;
  safetyRisk?: string;
  safetyRisks?: string;
  qualityChecks?: string;
  qualityControls?: string;
  documentationRecords: string;
  references: string;
}

export type DepartmentTemplate = DepartmentTopic;

export const STANDARDS_DISCLAIMER =
  'Notice: Standards references (ISO 9001/45001/22000, OSHA, WHO, PSQCA, SECP, EPA, FBR, and PPRA) are provided as architectural and compliance structuring guidelines based on prevailing industry frameworks. Final SOP documents must be reviewed and officially authorized by your designated compliance officer, legal counsel, or certified quality manager prior to organizational adoption.';

export { INITIAL_DEPARTMENT_TOPICS as DEPARTMENT_TOPICS } from './initialDepartmentTopics';
export { ALL_REMAINING_TOPICS } from './allDepartmentTopics';
export { EXTENDED_DEPARTMENT_TOPICS } from './departmentTopicsExtended';
export { FINAL_DEPARTMENT_TOPICS } from './departmentTopicsFinal';

import {
  ALL_SOPS,
  getSOPsForDepartment,
  getSOPById,
} from './sopLibraryRegistry';

// Backward-compatible query functions returning full library
export const getTopicsForDepartment = getSOPsForDepartment;
export const getTopicById = getSOPById;
export const DEPARTMENT_TEMPLATES = ALL_SOPS;
export const getTemplatesForDepartment = getSOPsForDepartment;
export const getTemplateById = getSOPById;
