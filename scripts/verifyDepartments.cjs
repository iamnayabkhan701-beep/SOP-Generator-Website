const fs = require('fs');
const path = require('path');

// Read compiled or source files to verify all 8 departments
console.log('--- STARTING VERIFICATION OF ALL 8 DEPARTMENTS ---');

const departmentsToTest = [
  'warehouse',
  'qa',
  'qc',
  'supply-chain',
  'hr',
  'finance',
  'manufacturing',
  'healthcare',
];

const mockCompany = {
  companyName: 'Acme Test Enterprises',
  industry: 'Advanced Commercial Operations',
  country: 'United States',
  city: 'Dallas Facility',
  companySize: '101-500 employees',
  departmentName: 'Test Operations',
  productsOrServices: 'Precision equipment, medical logistics, enterprise technology',
  mainOperationalActivities: 'Receiving, quality control, assembly, and customer distribution',
  applicableStandards: ['ISO 9001 (Quality)', 'OSHA 1910 (Safety)'],
  preparedBy: 'Senior Process Engineer',
  reviewedBy: 'Quality Assurance Manager',
  approvedBy: 'VP of Operations',
  effectiveDate: '2026-11-19',
  version: '1.0',
  departmentDetails: {
    wmsSystem: 'SAP S/4HANA EWM',
    qmsStandard: 'ISO 9001:2015',
    samplingCriteria: 'MIL-STD-105E AQL 1.0',
    accountingFramework: 'IFRS & GAAP',
    infrastructureModel: 'AWS Cloud + VMware',
  },
};

// Check that registry loads and contains each department
console.log('Testing Department Data Coverage:');
const libraryFiles = [
  'src/data/libraries/warehouseAndLogisticsSOPs.ts',
  'src/data/libraries/qualityAndComplianceSOPs.ts',
  'src/data/libraries/businessAndManagementSOPs.ts',
  'src/data/libraries/operationsAndManufacturingSOPs.ts',
  'src/data/libraries/technologyAndSpecializedSOPs.ts',
  'src/data/initialDepartmentTopics.ts',
  'src/data/allDepartmentTopics.ts',
  'src/data/departmentTopicsExtended.ts',
  'src/data/departmentTopicsFinal.ts',
];

const topicCounts = {};
departmentsToTest.forEach(d => { topicCounts[d] = 0; });

libraryFiles.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  departmentsToTest.forEach(dept => {
    // Match departmentId: 'dept'
    const regex = new RegExp(`departmentId:\\s*['"]${dept}['"]`, 'g');
    const matches = content.match(regex);
    if (matches) {
      topicCounts[dept] += matches.length;
    }
  });
});

console.log('Researched SOPs found per department:');
let allPassed = true;
departmentsToTest.forEach(dept => {
  const count = topicCounts[dept];
  console.log(`  ✓ Department [${dept}]: ${count} researched SOPs`);
  if (count < 5) {
    console.error(`  ✗ Error: Department ${dept} has insufficient SOP count (${count})`);
    allPassed = false;
  }
});

if (allPassed) {
  console.log('\n--- ALL 8 DEPARTMENTS VERIFIED WITH ROBUST SOP LIBRARIES ---');
} else {
  console.error('\n--- VERIFICATION FAILED ---');
  process.exit(1);
}
