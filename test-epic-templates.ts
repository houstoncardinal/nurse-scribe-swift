/**
 * Epic Templates Verification Script
 * Tests all Epic templates for functionality and uniqueness
 */

import {
  EPIC_TEMPLATES,
  EpicTemplateType,
  ShiftAssessmentTemplate,
  MARTemplate,
  IOTemplate,
  WoundCareTemplate,
  SafetyChecklistTemplate,
  MedSurgTemplate,
  ICUTemplate,
  NICUTemplate,
  MotherBabyTemplate,
  getAllEpicTemplates,
  getTemplateByType,
  isEpicTemplate
} from './src/lib/epicTemplates';

import {
  intelligentNoteDetectionService
} from './src/lib/intelligentNoteDetection';

// Test data for each template type
const testInputs: Record<EpicTemplateType, string> = {
  'shift-assessment': `
    Start of shift assessment for patient in room 302.
    Neuro: Alert and oriented x3, PERRLA
    Cardiac: Regular rate and rhythm, no murmurs
    Respiratory: Lungs clear bilaterally, no distress
    GI: Abdomen soft, non-tender, bowel sounds present
    GU: Voiding without difficulty, clear yellow urine
    Skin: Warm, dry, intact, no breakdown
    Musculoskeletal: Moves all extremities, steady gait
    Vital signs: BP 120/80, HR 72, RR 16, Temp 98.6°F, SpO2 98% on room air, Pain 2/10
    Medications administered: Metoprolol 25mg PO at 0800
    Intake: Oral 240ml, IV 500ml
    Output: Urine 350ml
    Safety: Fall risk low, bed alarm on, call light within reach
  `,
  
  'mar': `
    Medication administration record for day shift.
    Administered Lisinopril 10mg PO at 0900, patient tolerated well.
    Gave Metformin 500mg PO at 0800 with breakfast, no adverse reactions.
    Administered Insulin Lispro 8 units SQ in abdomen at 1200 before lunch.
    Patient blood sugar 145 pre-meal, 120 post-meal.
    All medications signed and documented.
  `,
  
  'io': `
    Intake and output for day shift 0700-1900.
    Intake: Oral 480ml, IV fluids 1000ml, total intake 1480ml
    Output: Urine 800ml, stool once formed, total output 800ml
    Fluid balance: +680ml
    Patient maintaining adequate hydration.
  `,
  
  'wound-care': `
    Wound care performed on sacral pressure injury.
    Location: Sacrum
    Stage: Stage II pressure injury
    Size: 3.5 x 2.8 x 0.5 cm
    Drainage: Serous, small amount, no odor
    Wound bed: 80% granulation tissue, 20% slough
    Periwound: Intact, no erythema or maceration
    Dressing: Applied hydrocolloid dressing
    Patient tolerated procedure well
    Next dressing change scheduled for 3 days
    Photograph taken and uploaded to chart
  `,
  
  'safety-checklist': `
    Safety assessment completed.
    Fall risk score: 8 (moderate risk)
    Interventions: Bed alarm activated, non-slip socks provided, call light within reach
    No restraints in use
    Isolation: Contact precautions for MRSA, PPE used appropriately
    Patient identification verified with two identifiers
    Allergies: Penicillin (rash)
    Code status: Full Code
    All safety measures in place and documented
  `,
  
  'med-surg': `
    Med-Surg unit documentation.
    Patient education provided on diabetes management and insulin administration.
    Patient verbalizes understanding of blood sugar monitoring.
    Discharge planning: Criteria being met, estimated discharge tomorrow.
    Pain management: Patient reports pain 3/10 in surgical site, managed with oral analgesics.
    Mobility: Independent with walker, ambulated 100 feet in hallway twice this shift.
    Patient progressing well toward discharge goals.
  `,
  
  'icu': `
    ICU documentation for critically ill patient.
    Hemodynamic monitoring: CVP 6, MAP 75, CO 5.2, SVR 1100
    Ventilator settings: AC mode, FiO2 40%, PEEP 5, TV 450, RR 14, PIP 22, Plateau 18
    Sedation: RASS -2, target -1 to -2, propofol infusion at 30mcg/kg/min
    Delirium assessment: CAM-ICU negative
    Titration drips: Norepinephrine 0.05mcg/kg/min for MAP >65, currently MAP 75
    Device checks: A-line functioning, central line patent, all alarms set appropriately
  `,
  
  'nicu': `
    NICU documentation for premature infant.
    Thermoregulation: Isolette temperature 36.5°C, infant temp 36.8°C, stable
    Feeding: Breast milk 15ml via NG tube every 3 hours, tolerating well, no residuals
    Abdomen soft, no distension, stooling normally
    Parental bonding: Mother provided skin-to-skin care for 45 minutes
    Daily weight: 1850g, up 25g from yesterday (+1.4%)
    Respiratory support: Nasal cannula 0.5L, FiO2 25%, SpO2 95-98%
    Developmental care: Positioned in flexion, minimal stimulation during sleep
  `,
  
  'mother-baby': `
    Mother-Baby unit documentation.
    Maternal assessment:
    Fundal check: Firm, midline, at umbilicus
    Lochia: Moderate rubra, no clots, normal odor
    Perineum: Second-degree laceration healing well, no signs of infection
    Breasts: Filling, nipples intact, breastfeeding established
    
    Newborn assessment:
    Feeding: Breastfeeding every 2-3 hours, good latch, 15-20 minutes per side
    Bonding: Excellent eye contact, responsive to parents, skin-to-skin provided
    Safe sleep education: Provided and parents verbalize understanding
    Cord care: Cord dry, no drainage or odor
    Circumcision: Healing well, no bleeding
  `
};

// Expected unique characteristics for each template
const templateCharacteristics: Record<EpicTemplateType, string[]> = {
  'shift-assessment': [
    'System-by-system assessment',
    'Neuro, Cardiac, Respiratory, GI, GU, Skin, Musculoskeletal',
    'Vital signs',
    'Shift phase (Start/Mid/End)',
    'Safety checks'
  ],
  'mar': [
    'Medication name, dose, route, time',
    'Pre and post assessment',
    'Patient response',
    'Adverse reactions',
    'Co-signature if required'
  ],
  'io': [
    'Intake categories (oral, IV, enteral, parenteral)',
    'Output categories (urine, stool, drains, emesis)',
    'Fluid balance calculation',
    'Shift times'
  ],
  'wound-care': [
    'Wound location and stage',
    'Size measurements (length x width x depth)',
    'Drainage type and amount',
    'Wound bed tissue percentages',
    'Periwound condition',
    'Dressing type',
    'Photo documentation'
  ],
  'safety-checklist': [
    'Fall risk score and level',
    'Restraint documentation',
    'Isolation precautions',
    'Patient identification',
    'Allergies',
    'Code status'
  ],
  'med-surg': [
    'Patient education topics',
    'Discharge readiness criteria',
    'Pain management',
    'Mobility level and assistive devices'
  ],
  'icu': [
    'Hemodynamic parameters (CVP, MAP, CO, SVR)',
    'Ventilator settings (mode, FiO2, PEEP, TV)',
    'Sedation scores (RASS, SAS)',
    'Delirium assessment (CAM-ICU)',
    'Titration drips'
  ],
  'nicu': [
    'Thermoregulation (isolette/warmer)',
    'Feeding tolerance',
    'Parental bonding',
    'Daily weight with percentage change',
    'Developmental care',
    'Respiratory support type'
  ],
  'mother-baby': [
    'Maternal fundal check',
    'Lochia assessment',
    'Perineum/laceration status',
    'Breast condition and feeding',
    'Newborn feeding type and latch',
    'Bonding assessment',
    'Safe sleep education',
    'Cord care'
  ]
};

// Test results
interface TestResult {
  templateId: EpicTemplateType;
  templateName: string;
  passed: boolean;
  issues: string[];
  uniqueFeatures: string[];
  detectionConfidence: number;
}

const results: TestResult[] = [];

console.log('🏥 EPIC TEMPLATES VERIFICATION TEST\n');
console.log('=' .repeat(80));
console.log('\n');

// Test 1: Verify all templates are registered
console.log('📋 TEST 1: Template Registration\n');
const allTemplates = getAllEpicTemplates();
console.log(`Total templates registered: ${allTemplates.length}`);
allTemplates.forEach(template => {
  console.log(`  ✓ ${template.id}: ${template.name}`);
});
console.log('\n');

// Test 2: Verify each template can be detected and has unique characteristics
console.log('🔍 TEST 2: Template Detection & Uniqueness\n');

for (const [templateId, input] of Object.entries(testInputs)) {
  const templateName = getTemplateByType(templateId as EpicTemplateType);
  console.log(`\nTesting: ${templateName} (${templateId})`);
  console.log('-'.repeat(80));
  
  const result: TestResult = {
    templateId: templateId as EpicTemplateType,
    templateName,
    passed: true,
    issues: [],
    uniqueFeatures: [],
    detectionConfidence: 0
  };
  
  // Test detection
  try {
    const structured = await intelligentNoteDetectionService.structureNote(input);
    const detected = structured.detectedType;
    
    result.detectionConfidence = detected.confidence;
    
    console.log(`  Detection Result: ${detected.template}`);
    console.log(`  Confidence: ${(detected.confidence * 100).toFixed(1)}%`);
    console.log(`  Reasoning: ${detected.reasoning}`);
    
    // Check if correct template was detected
    if (detected.template !== templateId) {
      result.issues.push(`Expected ${templateId} but detected ${detected.template}`);
      result.passed = false;
      console.log(`  ❌ FAILED: Wrong template detected`);
    } else {
      console.log(`  ✓ Correct template detected`);
    }
    
    // Check confidence threshold
    if (detected.confidence < 0.6) {
      result.issues.push(`Low confidence: ${(detected.confidence * 100).toFixed(1)}%`);
      result.passed = false;
      console.log(`  ⚠️  WARNING: Low confidence`);
    }
    
    // Verify unique characteristics are present
    const expectedFeatures = templateCharacteristics[templateId as EpicTemplateType];
    console.log(`\n  Unique Features Check:`);
    
    expectedFeatures.forEach(feature => {
      const sections = Object.keys(structured.suggestedSections).join(' ');
      const hasFeature = sections.toLowerCase().includes(feature.toLowerCase().split(' ')[0]);
      
      if (hasFeature) {
        result.uniqueFeatures.push(feature);
        console.log(`    ✓ ${feature}`);
      } else {
        console.log(`    ○ ${feature} (not detected in sections)`);
      }
    });
    
    // Display generated sections
    console.log(`\n  Generated Sections:`);
    Object.keys(structured.suggestedSections).forEach(section => {
      console.log(`    - ${section}`);
    });
    
    // Check for extracted fields
    console.log(`\n  Extracted Fields:`);
    const fields = structured.extractedFields;
    if (Object.keys(fields.vitalSigns).length > 0) {
      console.log(`    ✓ Vital Signs: ${Object.keys(fields.vitalSigns).length} fields`);
    }
    if (fields.medications.length > 0) {
      console.log(`    ✓ Medications: ${fields.medications.length} items`);
    }
    if (fields.interventions.length > 0) {
      console.log(`    ✓ Interventions: ${fields.interventions.length} items`);
    }
    if (fields.intakeOutput) {
      console.log(`    ✓ I&O: Balance ${fields.intakeOutput.balance}ml`);
    }
    if (fields.woundInfo) {
      console.log(`    ✓ Wound Info: ${Object.keys(fields.woundInfo).length} fields`);
    }
    
  } catch (error) {
    result.passed = false;
    result.issues.push(`Error during detection: ${error}`);
    console.log(`  ❌ ERROR: ${error}`);
  }
  
  results.push(result);
}

// Test 3: Verify templates are unique (no overlap)
console.log('\n\n🎯 TEST 3: Template Uniqueness Analysis\n');
console.log('-'.repeat(80));

const templateOverlap: Record<string, string[]> = {};

for (let i = 0; i < results.length; i++) {
  for (let j = i + 1; j < results.length; j++) {
    const template1 = results[i];
    const template2 = results[j];
    
    // Check for overlapping unique features
    const overlap = template1.uniqueFeatures.filter(f => 
      template2.uniqueFeatures.some(f2 => 
        f.toLowerCase().includes(f2.toLowerCase()) || 
        f2.toLowerCase().includes(f.toLowerCase())
      )
    );
    
    if (overlap.length > 0) {
      const key = `${template1.templateId} vs ${template2.templateId}`;
      templateOverlap[key] = overlap;
    }
  }
}

if (Object.keys(templateOverlap).length === 0) {
  console.log('✓ All templates are unique with no significant overlap\n');
} else {
  console.log('⚠️  Some templates have overlapping features:\n');
  Object.entries(templateOverlap).forEach(([key, features]) => {
    console.log(`  ${key}:`);
    features.forEach(f => console.log(`    - ${f}`));
    console.log('');
  });
}

// Final Summary
console.log('\n' + '='.repeat(80));
console.log('📊 FINAL SUMMARY\n');

const passedTests = results.filter(r => r.passed).length;
const totalTests = results.length;
const passRate = (passedTests / totalTests * 100).toFixed(1);

console.log(`Tests Passed: ${passedTests}/${totalTests} (${passRate}%)\n`);

console.log('Template Status:');
results.forEach(result => {
  const status = result.passed ? '✓' : '❌';
  const confidence = `${(result.detectionConfidence * 100).toFixed(1)}%`;
  console.log(`  ${status} ${result.templateName.padEnd(35)} Confidence: ${confidence}`);
  
  if (result.issues.length > 0) {
    result.issues.forEach(issue => {
      console.log(`      Issue: ${issue}`);
    });
  }
});

console.log('\n' + '='.repeat(80));

if (passedTests === totalTests) {
  console.log('\n🎉 SUCCESS! All Epic templates are working and unique!\n');
  process.exit(0);
} else {
  console.log('\n⚠️  Some templates need attention. See issues above.\n');
  process.exit(1);
}
