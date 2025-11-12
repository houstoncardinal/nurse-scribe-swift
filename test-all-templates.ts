/**
 * Comprehensive Template Testing Script
 * Tests ALL templates to ensure they work properly in the draft preview
 */

import { enhancedAIService } from './src/lib/enhancedAIService';

// Test data for each template
const templateTestCases = {
  // Traditional Templates
  SOAP: {
    input: 'Patient presents with chest pain, pain level 6/10. Blood pressure 140/90, heart rate 88, respiratory rate 18, O2 saturation 98% on room air. Temperature 98.6°F. Patient alert and oriented x3. No acute distress observed. EKG shows normal sinus rhythm. Patient has history of hypertension. Will continue to monitor vital signs, administer pain medication as ordered, and educate patient on cardiac warning signs.',
    expectedSections: ['Subjective', 'Objective', 'Assessment', 'Plan'],
    description: 'SOAP - Traditional nursing note format'
  },
  SBAR: {
    input: 'Patient in room 302 with increasing blood pressure 160/95. Patient is 65-year-old male with history of hypertension and diabetes, admitted 2 days ago for chest pain. Current vital signs show elevated BP, patient reports headache. I assess this as potential hypertensive crisis. Recommend notifying physician, consider IV antihypertensive, and increase monitoring frequency.',
    expectedSections: ['Situation', 'Background', 'Assessment', 'Recommendation'],
    description: 'SBAR - Handoff communication format'
  },
  PIE: {
    input: 'Patient experiencing acute pain level 8/10 in lower back. Administered morphine 4mg IV as ordered at 1400. Performed positioning and comfort measures. Monitored patient response. At 1430, patient reports pain decreased to 3/10, appears more comfortable, vital signs stable. Pain management effective.',
    expectedSections: ['Problem', 'Intervention', 'Evaluation'],
    description: 'PIE - Problem-focused documentation'
  },
  DAR: {
    input: 'Patient vital signs: BP 135/85, HR 92, RR 20, O2 sat 96%, Temperature 99.1°F. Patient reports mild dyspnea. Elevated head of bed to 45 degrees, administered oxygen 2L via nasal cannula, performed respiratory assessment. Patient breathing easier, O2 saturation improved to 98%, respiratory rate decreased to 16. Continue current interventions.',
    expectedSections: ['Data', 'Action', 'Response'],
    description: 'DAR - Data-action-response format'
  },

  // Epic EMR Templates
  'shift-assessment': {
    input: 'Start of shift assessment completed. Patient alert and oriented x3. Vital signs: BP 128/78, HR 76, RR 16, O2 sat 97%, Temperature 98.4°F. Pain level 2/10. IV site right forearm, patent, no signs of infiltration. Medications given: Lisinopril 10mg PO, Metformin 500mg PO. Intake: 240ml oral, 100ml IV. Output: 300ml urine. Wound care performed on sacral area, stage 2 pressure ulcer, dressing changed. Patient on fall precautions, bed alarm activated. Notified physician of morning labs. Family updated on patient status.',
    expectedSections: ['Patient Assessment', 'Vital Signs', 'Medications', 'Intake & Output', 'Treatments', 'Communication', 'Safety', 'Narrative'],
    description: 'Epic Shift Assessment - Comprehensive shift documentation'
  },
  'mar': {
    input: 'Administered Lisinopril 10mg PO at 0900. Blood pressure prior to administration: 142/88. Patient tolerated medication well. No adverse reactions noted. Blood pressure 30 minutes post-administration: 132/82. Also administered Morphine 2mg IV for pain level 7/10. Pre-medication pain assessment completed. Post-medication pain decreased to 3/10. Patient comfort improved.',
    expectedSections: ['Medication Information', 'Administration Details', 'Assessment', 'Response'],
    description: 'Epic MAR - Medication administration documentation'
  },
  'io': {
    input: 'Day shift intake and output recorded. Intake: oral 480ml, IV fluids 1000ml, total 1480ml. Output: urine 800ml via Foley catheter, drain from JP 45ml, total output 845ml. Net positive balance +635ml. Urine clear yellow. Patient tolerating oral fluids well.',
    expectedSections: ['Intake', 'Output', 'Balance', 'Notes'],
    description: 'Epic I&O - Intake and output tracking'
  },
  'wound-care': {
    input: 'Sacral pressure ulcer stage 2, measuring 3.5cm length, 2.8cm width, 0.5cm depth. Wound bed shows 80% granulation tissue, 20% slough. Drainage moderate, serosanguineous, no odor. Periwound skin intact, no maceration. Cleansed with normal saline, applied hydrocolloid dressing. Patient tolerated procedure well, pain level 4/10 during dressing change. Next dressing change in 3 days.',
    expectedSections: ['Location & Stage', 'Size & Drainage', 'Wound Bed', 'Interventions', 'Response'],
    description: 'Epic Wound Care - Detailed wound documentation'
  },
  'safety-checklist': {
    input: 'Fall risk assessment completed: score 8, high risk. Interventions: bed alarm activated, call light within reach, non-slip socks applied, bed in lowest position. No restraints in use. Standard precautions maintained. Patient identification verified with two identifiers before medication administration. Code status confirmed: Full Code. Patient and family aware.',
    expectedSections: ['Fall Risk', 'Restraints', 'Isolation', 'Patient ID', 'Code Status'],
    description: 'Epic Safety Checklist - Safety protocols'
  },

  // Unit-Specific Templates
  'med-surg': {
    input: 'Patient education provided on diabetes management, medication adherence, and dietary modifications. Patient verbalizes understanding. Discharge planning initiated, patient meets 3 of 5 discharge criteria. Barriers: needs home health setup. Pain management: current pain 3/10, well-controlled with Tylenol. Mobility: patient ambulating with walker, assist x1, tolerated 100 feet in hallway. Physical therapy consulted.',
    expectedSections: ['Patient Education', 'Discharge Readiness', 'Pain Management', 'Mobility'],
    description: 'Med-Surg Unit - General medical-surgical documentation'
  },
  'icu': {
    input: 'Hemodynamic monitoring: CVP 8, MAP 72, cardiac output adequate. Ventilator settings: AC mode, FiO2 40%, PEEP 5, tidal volume 450ml, respiratory rate 14. ABG results reviewed with physician. Central line right IJ, dressing clean and dry. Arterial line left radial, waveform appropriate. Vasopressor infusion: Levophed at 0.08mcg/kg/min, titrating to maintain MAP >65. RASS score -1, sedation appropriate. Delirium assessment: CAM-ICU negative.',
    expectedSections: ['Hemodynamics', 'Ventilator', 'Devices', 'Drips', 'Sedation'],
    description: 'ICU Unit - Critical care documentation'
  },
  'nicu': {
    input: 'Premature infant 32 weeks gestational age. Isolette temperature maintained at 35°C, infant temperature 36.8°C. Feeding: breast milk via NG tube, 15ml every 3 hours, tolerating well, no residuals. Abdomen soft, non-distended. Parents visited, provided skin-to-skin care for 45 minutes. Mother attempting breastfeeding with lactation support. Daily weight: 1820g, up 20g from yesterday. Developmental care: prone positioning, minimal stimulation during rest periods.',
    expectedSections: ['Thermoregulation', 'Feeding', 'Bonding', 'Weight', 'Development'],
    description: 'NICU Unit - Neonatal intensive care'
  },
  'mother-baby': {
    input: 'Postpartum day 2. Fundal check: firm, midline, at umbilicus. Lochia moderate rubra, no clots, normal odor. Perineum: 2nd degree laceration healing well, no signs of infection. Breasts soft, nipples intact, breastfeeding well. Newborn feeding every 2-3 hours, latch good, adequate wet diapers. Safe sleep education provided, parents verbalize understanding. Cord care taught, cord dry with no drainage. Circumcision healing appropriately.',
    expectedSections: ['Maternal Assessment', 'Newborn Assessment', 'Feeding', 'Education'],
    description: 'Mother-Baby Unit - Postpartum and newborn care'
  }
};

// Color coding for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

interface TestResult {
  template: string;
  success: boolean;
  generatedSections: string[];
  missingSections: string[];
  extraSections: string[];
  sectionContent: { [key: string]: string };
  error?: string;
  warnings: string[];
}

async function testTemplate(
  templateName: string,
  testCase: typeof templateTestCases[keyof typeof templateTestCases]
): Promise<TestResult> {
  const result: TestResult = {
    template: templateName,
    success: false,
    generatedSections: [],
    missingSections: [],
    extraSections: [],
    sectionContent: {},
    warnings: []
  };

  try {
    console.log(`${colors.cyan}Testing ${colors.bright}${templateName}${colors.reset}${colors.cyan}...${colors.reset}`);
    console.log(`${colors.blue}Description: ${testCase.description}${colors.reset}`);

    // Generate note using AI service
    const aiPrompt = {
      template: templateName as any,
      input: testCase.input,
      context: {
        chiefComplaint: testCase.input.substring(0, 100)
      }
    };

    const generatedNote = await enhancedAIService.generateNote(aiPrompt);

    // Extract sections from generated note
    if (generatedNote && generatedNote.sections) {
      Object.entries(generatedNote.sections).forEach(([section, data]: [string, any]) => {
        const sectionKey = section.charAt(0).toUpperCase() + section.slice(1).toLowerCase();
        const content = data.content || data;

        if (content && typeof content === 'string' && content.trim()) {
          result.generatedSections.push(sectionKey);
          result.sectionContent[sectionKey] = content;
        } else {
          result.warnings.push(`Section ${sectionKey} has empty or invalid content`);
        }
      });
    }

    // Normalize expected sections for comparison
    const normalizedExpected = testCase.expectedSections.map(s =>
      s.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ')
    );

    const normalizedGenerated = result.generatedSections.map(s =>
      s.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ')
    );

    // Check for missing sections
    result.missingSections = normalizedExpected.filter(
      expected => !normalizedGenerated.some(generated =>
        generated.toLowerCase().includes(expected.toLowerCase()) ||
        expected.toLowerCase().includes(generated.toLowerCase())
      )
    );

    // Check for extra sections
    result.extraSections = normalizedGenerated.filter(
      generated => !normalizedExpected.some(expected =>
        generated.toLowerCase().includes(expected.toLowerCase()) ||
        expected.toLowerCase().includes(generated.toLowerCase())
      )
    );

    // Validate content quality
    for (const [section, content] of Object.entries(result.sectionContent)) {
      if (content.length < 20) {
        result.warnings.push(`Section ${section} has very short content (${content.length} chars)`);
      }
      if (content.includes('section is being generated') || content.includes('Please review and complete')) {
        result.warnings.push(`Section ${section} contains placeholder text`);
      }
    }

    // Determine success
    result.success = result.missingSections.length === 0 &&
                     result.warnings.filter(w => w.includes('placeholder')).length === 0;

    // Log results
    if (result.success) {
      console.log(`${colors.green}✓ PASSED${colors.reset}`);
    } else {
      console.log(`${colors.red}✗ FAILED${colors.reset}`);
    }

    if (result.missingSections.length > 0) {
      console.log(`${colors.red}  Missing sections: ${result.missingSections.join(', ')}${colors.reset}`);
    }

    if (result.extraSections.length > 0) {
      console.log(`${colors.yellow}  Extra sections: ${result.extraSections.join(', ')}${colors.reset}`);
    }

    if (result.warnings.length > 0) {
      console.log(`${colors.yellow}  Warnings:${colors.reset}`);
      result.warnings.forEach(warning => {
        console.log(`${colors.yellow}    - ${warning}${colors.reset}`);
      });
    }

    console.log(`${colors.blue}  Generated sections: ${result.generatedSections.join(', ')}${colors.reset}`);
    console.log('');

  } catch (error: any) {
    result.error = error.message;
    console.log(`${colors.red}✗ ERROR: ${error.message}${colors.reset}\n`);
  }

  return result;
}

async function runAllTests() {
  console.log(`${colors.bright}${colors.magenta}═══════════════════════════════════════════════════════${colors.reset}`);
  console.log(`${colors.bright}${colors.magenta}   COMPREHENSIVE TEMPLATE TESTING SUITE${colors.reset}`);
  console.log(`${colors.bright}${colors.magenta}   Testing ${Object.keys(templateTestCases).length} Templates${colors.reset}`);
  console.log(`${colors.bright}${colors.magenta}═══════════════════════════════════════════════════════${colors.reset}\n`);

  const results: TestResult[] = [];

  // Test each template
  for (const [templateName, testCase] of Object.entries(templateTestCases)) {
    const result = await testTemplate(templateName, testCase);
    results.push(result);
  }

  // Summary
  console.log(`${colors.bright}${colors.magenta}═══════════════════════════════════════════════════════${colors.reset}`);
  console.log(`${colors.bright}${colors.magenta}   TEST SUMMARY${colors.reset}`);
  console.log(`${colors.bright}${colors.magenta}═══════════════════════════════════════════════════════${colors.reset}\n`);

  const passed = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;
  const errors = results.filter(r => r.error).length;

  console.log(`${colors.bright}Total Templates Tested: ${results.length}${colors.reset}`);
  console.log(`${colors.green}✓ Passed: ${passed}${colors.reset}`);
  console.log(`${colors.red}✗ Failed: ${failed}${colors.reset}`);
  console.log(`${colors.red}⚠ Errors: ${errors}${colors.reset}\n`);

  // List failed tests
  if (failed > 0) {
    console.log(`${colors.red}Failed Templates:${colors.reset}`);
    results.filter(r => !r.success && !r.error).forEach(r => {
      console.log(`${colors.red}  - ${r.template}${colors.reset}`);
      if (r.missingSections.length > 0) {
        console.log(`${colors.red}    Missing: ${r.missingSections.join(', ')}${colors.reset}`);
      }
      if (r.warnings.length > 0) {
        console.log(`${colors.yellow}    Warnings: ${r.warnings.length}${colors.reset}`);
      }
    });
    console.log('');
  }

  // List errors
  if (errors > 0) {
    console.log(`${colors.red}Templates with Errors:${colors.reset}`);
    results.filter(r => r.error).forEach(r => {
      console.log(`${colors.red}  - ${r.template}: ${r.error}${colors.reset}`);
    });
    console.log('');
  }

  // Detailed results for each template
  console.log(`${colors.bright}${colors.magenta}═══════════════════════════════════════════════════════${colors.reset}`);
  console.log(`${colors.bright}${colors.magenta}   DETAILED RESULTS${colors.reset}`);
  console.log(`${colors.bright}${colors.magenta}═══════════════════════════════════════════════════════${colors.reset}\n`);

  for (const result of results) {
    const status = result.success ? `${colors.green}✓ PASSED${colors.reset}` :
                   result.error ? `${colors.red}✗ ERROR${colors.reset}` :
                   `${colors.red}✗ FAILED${colors.reset}`;

    console.log(`${colors.bright}${result.template}${colors.reset} - ${status}`);
    console.log(`  Sections Generated: ${result.generatedSections.length}`);

    // Show first 100 chars of each section
    if (Object.keys(result.sectionContent).length > 0) {
      console.log(`  Content Preview:`);
      for (const [section, content] of Object.entries(result.sectionContent)) {
        const preview = content.substring(0, 100).replace(/\n/g, ' ');
        console.log(`    ${colors.cyan}${section}:${colors.reset} ${preview}...`);
      }
    }

    console.log('');
  }

  console.log(`${colors.bright}${colors.magenta}═══════════════════════════════════════════════════════${colors.reset}`);
  console.log(`${colors.bright}${colors.magenta}   TESTING COMPLETE${colors.reset}`);
  console.log(`${colors.bright}${colors.magenta}═══════════════════════════════════════════════════════${colors.reset}\n`);

  // Return results for programmatic use
  return results;
}

// Run tests
runAllTests().then(results => {
  const allPassed = results.every(r => r.success);
  process.exit(allPassed ? 0 : 1);
}).catch(error => {
  console.error(`${colors.red}Fatal error running tests: ${error.message}${colors.reset}`);
  process.exit(1);
});
