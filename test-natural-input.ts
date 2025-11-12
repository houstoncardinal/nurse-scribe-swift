/**
 * Comprehensive Natural Language Input Testing
 * Tests all 13 templates with realistic conversational input
 */

import { enhancedAIService } from './src/lib/enhancedAIService';

// Color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m',
};

interface TestCase {
  template: string;
  name: string;
  naturalInput: string;
  expectedSections: string[];
  category: string;
}

const testCases: TestCase[] = [
  // ============================================================================
  // TRADITIONAL TEMPLATES
  // ============================================================================
  {
    template: 'SOAP',
    name: 'SOAP Note',
    category: 'Traditional',
    naturalInput: `Patient came in complaining about chest pain that started about 2 hours ago, says it's like a pressure feeling, denies any shortness of breath or dizziness. When I checked his vitals his blood pressure was 140 over 90, heart rate was 88, oxygen saturation 98 percent on room air, temperature 98.6. Patient is alert and oriented, appears in mild discomfort but not in acute distress. Did an EKG and it showed normal sinus rhythm. Based on the presentation and normal EKG I'm thinking this is likely musculoskeletal chest pain, not cardiac. Gave him acetaminophen 500 milligrams by mouth and we'll reassess his pain level in 30 minutes, told him to let us know right away if pain gets worse or if he develops any new symptoms.`,
    expectedSections: ['subjective', 'objective', 'assessment', 'plan']
  },
  {
    template: 'SBAR',
    name: 'SBAR Handoff',
    category: 'Traditional',
    naturalInput: `So I need to tell you about the patient in room 302, his blood pressure has been climbing, it's now 160 over 95 and he's complaining of a pretty bad headache. This is a 65 year old male who has a history of hypertension and diabetes, he was admitted 2 days ago for chest pain observation. Over the last couple hours his BP has been trending upward. I'm concerned this could be developing into a hypertensive crisis. I think we need to call the physician right away, probably need to start some IV antihypertensives, and we should increase our monitoring frequency to every 15 minutes for a while.`,
    expectedSections: ['situation', 'background', 'assessment', 'recommendation']
  },
  {
    template: 'PIE',
    name: 'PIE Note',
    category: 'Traditional',
    naturalInput: `Patient was experiencing acute pain in the lower back, said it was an 8 out of 10 on the pain scale. At 2 o'clock I administered morphine 4 milligrams IV as ordered, helped reposition the patient to a more comfortable position, and applied a heating pad to the area. Also encouraged deep breathing and relaxation techniques. By 2:30 when I checked back, patient reported the pain had decreased significantly to a 3 out of 10, patient appeared much more relaxed and comfortable, vital signs remained stable throughout.`,
    expectedSections: ['problem', 'intervention', 'evaluation']
  },
  {
    template: 'DAR',
    name: 'DAR Note',
    category: 'Traditional',
    naturalInput: `When I assessed the patient the vital signs were blood pressure 135 over 85, heart rate 92, respiratory rate 20 breaths per minute, oxygen saturation 96 percent, temperature 99.1. Patient reported feeling short of breath and having trouble catching their breath. I elevated the head of the bed to 45 degrees, started oxygen at 2 liters per nasal cannula, performed a thorough respiratory assessment listening to lung sounds. After those interventions the patient said breathing was much easier, oxygen saturation improved up to 98 percent, respiratory rate came down to 16, patient appeared less anxious and more comfortable.`,
    expectedSections: ['data', 'action', 'response']
  },

  // ============================================================================
  // EPIC EMR TEMPLATES
  // ============================================================================
  {
    template: 'shift-assessment',
    name: 'Epic Shift Assessment',
    category: 'Epic EMR',
    naturalInput: `Starting my shift assessment, patient is alert and oriented times three, knows person place and time. Neurologically everything looks good, pupils equal round and reactive to light, follows commands appropriately. Lungs are clear to auscultation bilaterally, breathing is even and unlabored, no use of accessory muscles. Heart sounds S1 and S2 present, regular rate and rhythm, no murmurs or irregular beats noted. Abdomen is soft and non-tender, bowel sounds active in all four quadrants, no distention. Patient voiding without any difficulty, urine is clear and yellow colored. Skin is intact, warm and dry to touch, no breakdown or pressure areas noted. Changed the dressing on the left forearm, wound is clean and dry, no signs of infection. Patient rates pain as 3 out of 10, managed with Tylenol 650 milligrams given about an hour ago. Will continue with current care plan and reassess again in 4 hours.`,
    expectedSections: ['shift-assessment-note']
  },
  {
    template: 'mar',
    name: 'Epic MAR',
    category: 'Epic EMR',
    naturalInput: `Administered Lisinopril 10 milligrams by mouth at 9 this morning. Before giving the medication I checked the patient's blood pressure and it was 142 over 88. Patient took the medication without any problems, swallowed it with water, no difficulty. Waited about 30 minutes and rechecked the blood pressure, it had come down to 132 over 82. Patient tolerated the medication well, no adverse reactions or side effects noted. Will continue to monitor blood pressure as ordered.`,
    expectedSections: ['medication-administration-record']
  },
  {
    template: 'io',
    name: 'Epic Intake & Output',
    category: 'Epic EMR',
    naturalInput: `For intake during this shift the patient drank 600 milliliters of oral fluids, that includes water and some juice. Also received 150 milliliters of IV fluids through the IV line. For output, patient urinated 700 milliliters through the Foley catheter, urine was clear and yellow colored, no concerning odor. So total intake is 750 milliliters and total output is 700 milliliters, which gives us a positive balance of 50 milliliters. Everything is within normal limits, patient's fluid status looks good.`,
    expectedSections: ['intake-output-summary']
  },
  {
    template: 'wound-care',
    name: 'Epic Wound Care',
    category: 'Epic EMR',
    naturalInput: `Changed the dressing on the right leg wound today. The wound is located on the lateral aspect of the right calf, measures approximately 3 centimeters in length by 2 centimeters in width. There's a small amount of serosanguinous drainage present, it's pink tinged, no foul odor noted which is good. The wound bed looks healthy with pink granulation tissue, edges are well approximated and coming together nicely. The skin around the wound is intact, no redness or swelling. Patient said the pain during the dressing change was about a 2 out of 10, tolerated the procedure well. Applied a new hydrocolloid dressing. Plan is to reassess the wound again in 8 hours and continue daily dressing changes.`,
    expectedSections: ['wound-care-documentation']
  },
  {
    template: 'safety-checklist',
    name: 'Epic Safety Checklist',
    category: 'Epic EMR',
    naturalInput: `Completed the safety assessment, patient's fall risk score is moderate. Made sure the bed is in the lowest position, call light is within easy reach and patient knows how to use it, both side rails are up for safety, patient is wearing the non-slip socks, and the bed alarm is activated and working properly. No restraints are being used. Standard precautions are in place. Verified patient identity using two identifiers before any procedures. Confirmed code status with patient and family, patient is full code. Patient and family are aware of all safety measures and verbalized understanding.`,
    expectedSections: ['safety-checklist']
  },

  // ============================================================================
  // UNIT-SPECIFIC TEMPLATES
  // ============================================================================
  {
    template: 'med-surg',
    name: 'Epic Med-Surg',
    category: 'Unit-Specific',
    naturalInput: `Patient is post-op day 2 following an appendectomy. Temperature has been good all day, currently afebrile at 98.4 degrees. Patient has been up and walking with assistance, we did about 100 feet in the hallway this afternoon and patient tolerated it well. Eating a regular diet without any nausea or vomiting, tolerating oral intake just fine. Pain is well controlled, rates it as 2 out of 10, taking acetaminophen as needed. Physical therapy came by and evaluated the patient. Provided patient education on incision care and signs of infection to watch for. Patient is progressing nicely toward discharge, probably looking at discharge tomorrow if everything continues this way. Continue with post-operative care, encourage mobility and activity as tolerated.`,
    expectedSections: ['med-surg-progress-note']
  },
  {
    template: 'icu',
    name: 'Epic ICU',
    category: 'Unit-Specific',
    naturalInput: `Patient remains intubated and on mechanical ventilation. Current vent settings are assist control mode, FiO2 at 40 percent, PEEP of 5, tidal volume 450 milliliters, respiratory rate set at 14. Hemodynamics are stable with mean arterial pressure maintaining at 72. Currently on Levophed vasopressor at 0.08 micrograms per kilogram per minute to support blood pressure. Patient is receiving Propofol for sedation, RASS score is negative 1 which is light sedation, at goal. Cardiac rhythm is normal sinus, no ectopy noted on telemetry. Urine output has been adequate at about 50 milliliters per hour. Will continue current ventilator settings and titrate vasopressors as needed to maintain MAP above 65, plan to get arterial blood gases in the morning.`,
    expectedSections: ['icu-daily-note']
  },
  {
    template: 'nicu',
    name: 'Epic NICU',
    category: 'Unit-Specific',
    naturalInput: `Baby is 34 weeks gestational age, premature infant. Maintaining temperature well in the isolette which is set at 35 degrees celsius, baby's temperature is stable at 36.8 degrees. Feeding is going well, taking 25 milliliters of formula via nasogastric tube every 3 hours, tolerating feeds without any residuals, no vomiting. Abdomen is soft and non-distended. Oxygen saturation is 98 percent on room air, no respiratory distress noted, breathing comfortably. Parents were here this afternoon and did skin-to-skin contact for about 45 minutes which went really well. Baby's weight today is 1850 grams which is up 30 grams from yesterday, good weight gain. Continue with the current feeding schedule every 3 hours and monitor vital signs closely.`,
    expectedSections: ['nicu-progress-note']
  },
  {
    template: 'mother-baby',
    name: 'Epic Mother-Baby',
    category: 'Unit-Specific',
    naturalInput: `This is postpartum day 2. Mom is up and ambulating independently without any difficulty, moving around the room well. Breastfeeding is going great, baby is latching well and feeding every 2 to 3 hours. Fundal check shows fundus is firm, midline, and at the level of the umbilicus which is appropriate. Lochia is moderate rubra, no large clots, normal odor. Perineal area where she had the second degree laceration is healing nicely, no signs of infection, no excessive swelling. Mom rates her pain as a 1 out of 10, very minimal discomfort. Baby is feeding well every 2 to 3 hours, good latch observed, having adequate wet diapers and stools. Umbilical cord site is clean and dry, no drainage or signs of infection. Provided safe sleep education to both parents, they verbalized good understanding of back to sleep positioning. Overall both mom and baby are doing excellent.`,
    expectedSections: ['mother-baby-note']
  }
];

async function testTemplate(testCase: TestCase): Promise<boolean> {
  console.log(`\n${colors.cyan}${colors.bold}Testing: ${testCase.name}${colors.reset}`);
  console.log(`${colors.blue}Category: ${testCase.category}${colors.reset}`);
  console.log(`${colors.yellow}Natural Input Length: ${testCase.naturalInput.length} characters${colors.reset}`);

  try {
    // Generate note using natural language input
    const result = await enhancedAIService.generateNote({
      template: testCase.template as any,
      input: testCase.naturalInput,
      context: {}
    });

    // Check if sections were generated
    const generatedSections = Object.keys(result.sections);

    if (generatedSections.length === 0) {
      console.log(`${colors.red}✗ FAILED: No sections generated${colors.reset}`);
      return false;
    }

    console.log(`${colors.green}✓ Generated ${generatedSections.length} section(s)${colors.reset}`);

    // Display generated content
    let hasContent = false;
    for (const [sectionName, sectionData] of Object.entries(result.sections)) {
      const content = sectionData.content;

      if (content && content.length > 0) {
        hasContent = true;
        console.log(`\n${colors.magenta}${sectionName}:${colors.reset}`);

        // Show first 200 characters
        const preview = content.substring(0, 200).replace(/\n/g, '\n  ');
        console.log(`  ${preview}${content.length > 200 ? '...' : ''}`);

        // Check for emojis (should be none)
        const emojiRegex = /[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/u;
        if (emojiRegex.test(content)) {
          console.log(`  ${colors.yellow}⚠ Warning: Emojis detected in output${colors.reset}`);
        }
      }
    }

    if (!hasContent) {
      console.log(`${colors.red}✗ FAILED: Sections generated but all empty${colors.reset}`);
      return false;
    }

    // Check quality metrics
    console.log(`\n${colors.cyan}Quality Metrics:${colors.reset}`);
    console.log(`  Overall Confidence: ${(result.overallConfidence * 100).toFixed(1)}%`);
    console.log(`  Quality Score: ${(result.qualityScore * 100).toFixed(1)}%`);

    if (result.suggestions && result.suggestions.length > 0) {
      console.log(`  ${colors.yellow}Suggestions: ${result.suggestions.length}${colors.reset}`);
    }

    console.log(`\n${colors.green}${colors.bold}✓ PASSED${colors.reset}`);
    return true;

  } catch (error: any) {
    console.log(`${colors.red}✗ ERROR: ${error.message}${colors.reset}`);
    return false;
  }
}

async function runAllTests() {
  console.log(`${colors.bold}${colors.magenta}╔════════════════════════════════════════════════════════╗${colors.reset}`);
  console.log(`${colors.bold}${colors.magenta}║   COMPREHENSIVE NATURAL LANGUAGE INPUT TESTING        ║${colors.reset}`);
  console.log(`${colors.bold}${colors.magenta}║   Testing ${testCases.length} Templates with Real Conversational Input   ║${colors.reset}`);
  console.log(`${colors.bold}${colors.magenta}╚════════════════════════════════════════════════════════╝${colors.reset}\n`);

  const results: { [key: string]: boolean } = {};

  // Group by category
  const categories = {
    'Traditional': testCases.filter(t => t.category === 'Traditional'),
    'Epic EMR': testCases.filter(t => t.category === 'Epic EMR'),
    'Unit-Specific': testCases.filter(t => t.category === 'Unit-Specific')
  };

  for (const [category, tests] of Object.entries(categories)) {
    console.log(`\n${colors.bold}${colors.cyan}═══════════════════════════════════════════════════════${colors.reset}`);
    console.log(`${colors.bold}${colors.cyan}  ${category} Templates (${tests.length})${colors.reset}`);
    console.log(`${colors.bold}${colors.cyan}═══════════════════════════════════════════════════════${colors.reset}`);

    for (const testCase of tests) {
      const passed = await testTemplate(testCase);
      results[testCase.name] = passed;

      // Small delay between tests
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }

  // Summary
  console.log(`\n\n${colors.bold}${colors.magenta}╔════════════════════════════════════════════════════════╗${colors.reset}`);
  console.log(`${colors.bold}${colors.magenta}║   TEST SUMMARY                                         ║${colors.reset}`);
  console.log(`${colors.bold}${colors.magenta}╚════════════════════════════════════════════════════════╝${colors.reset}\n`);

  const passed = Object.values(results).filter(r => r).length;
  const failed = Object.values(results).filter(r => !r).length;
  const total = Object.values(results).length;

  console.log(`${colors.bold}Total Templates Tested: ${total}${colors.reset}`);
  console.log(`${colors.green}${colors.bold}✓ Passed: ${passed}${colors.reset}`);
  console.log(`${colors.red}${colors.bold}✗ Failed: ${failed}${colors.reset}`);
  console.log(`${colors.bold}Success Rate: ${((passed/total) * 100).toFixed(1)}%${colors.reset}\n`);

  // List results by category
  for (const [category, tests] of Object.entries(categories)) {
    console.log(`${colors.cyan}${category}:${colors.reset}`);
    for (const test of tests) {
      const status = results[test.name]
        ? `${colors.green}✓ PASSED${colors.reset}`
        : `${colors.red}✗ FAILED${colors.reset}`;
      console.log(`  ${test.name}: ${status}`);
    }
    console.log('');
  }

  if (failed > 0) {
    console.log(`${colors.yellow}Failed templates need investigation.${colors.reset}`);
  } else {
    console.log(`${colors.green}${colors.bold}🎉 All templates working perfectly with natural language input!${colors.reset}`);
  }

  return passed === total;
}

// Run the tests
runAllTests().then(allPassed => {
  process.exit(allPassed ? 0 : 1);
}).catch(error => {
  console.error(`${colors.red}Fatal error: ${error.message}${colors.reset}`);
  process.exit(1);
});
