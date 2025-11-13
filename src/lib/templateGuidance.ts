/**
 * Template Guidance and Helper Text
 * Provides user-friendly instructions and examples for each template
 */

export interface TemplateGuide {
  name: string;
  description: string;
  placeholder: string;
  example: string;
  tips: string[];
}

export const TEMPLATE_GUIDANCE: Record<string, TemplateGuide> = {
  'SOAP': {
    name: 'SOAP Note',
    description: 'Document patient encounters with Subjective, Objective, Assessment, and Plan sections.',
    placeholder: `Describe your patient encounter...

Example: "Patient reports chest pain for 2 hours, denies shortness of breath. BP 140/90, HR 88, O2 sat 98% on room air. Appears in mild distress. EKG shows normal sinus rhythm. Likely musculoskeletal pain. Will administer acetaminophen 500mg and reassess in 30 minutes."

Just speak naturally - our AI will organize it into the proper SOAP format!`,
    example: 'Patient reports mild chest discomfort for 2 hours. Denies shortness of breath or dizziness. BP 128/84, HR 82, Temp 98.4°F, SpO2 98%. Skin warm and dry. Patient alert and oriented. Chest pain likely musculoskeletal. No acute distress. Will monitor vitals, provide acetaminophen 500mg PO, reassess in 30 minutes.',
    tips: [
      'Speak naturally - just describe what happened',
      'Include vital signs, symptoms, and what you did',
      'AI will extract and organize information automatically',
      'Don\'t worry about perfect formatting'
    ]
  },
  'SBAR': {
    name: 'SBAR Handoff',
    description: 'Communicate patient status during handoffs using Situation, Background, Assessment, Recommendation.',
    placeholder: `Describe the patient situation for handoff...

Example: "Patient in room 302 with increasing BP 160/95, complaining of headache. 65-year-old male, history of hypertension and diabetes, admitted 2 days ago for chest pain. I think he needs IV antihypertensives. Recommend calling the physician and increasing monitoring."

Speak conversationally - our AI will structure it properly!`,
    example: 'Patient in room 302 with increasing blood pressure 160/95. 65-year-old male with history of hypertension, admitted for observation. Currently reporting headache. Blood pressure trending up over last 2 hours. Assess as potential hypertensive urgency. Recommend notifying physician, consider IV antihypertensive, increase monitoring frequency.',
    tips: [
      'Just talk through the situation like you\'re telling a colleague',
      'Include current concern, patient history, and what you think should happen',
      'AI handles the SBAR structure automatically',
      'Focus on the story, not the format'
    ]
  },
  'PIE': {
    name: 'PIE Note',
    description: 'Document focused problems with Problem, Intervention, and Evaluation.',
    placeholder: `Describe the problem and what you did...

Example: "Patient has acute lower back pain, level 8 out of 10. I gave morphine 4mg IV at 2pm, helped reposition, applied ice pack. By 2:30pm pain was down to 3/10, patient much more comfortable."

Just describe what happened - AI will format it!`,
    example: 'Patient experiencing acute pain 8/10 in lower back. Administered morphine 4mg IV as ordered. Repositioned patient for comfort, applied heat therapy. At 30 minutes post-intervention, patient reports pain decreased to 3/10, appears more relaxed, vital signs stable.',
    tips: [
      'State the problem, what you did about it, and how it worked',
      'Include pain levels, interventions, and outcomes',
      'Speak naturally - AI extracts the key information',
      'Great for problem-focused documentation'
    ]
  },
  'DAR': {
    name: 'DAR Note',
    description: 'Document with Data, Action, and Response format.',
    placeholder: `Describe what you observed, did, and the result...

Example: "Patient vitals: BP 135/85, heart rate 92, breathing 20 per minute, O2 sat 96%. Patient said having trouble breathing. I raised the head of bed to 45 degrees and gave oxygen 2 liters. Patient breathing easier now, O2 sat improved to 98%."

Talk naturally - we'll organize it into DAR format!`,
    example: 'Assessment data: BP 135/85, HR 92, RR 20, O2 sat 96%, Temperature 99.1°F. Patient reports mild dyspnea. Elevated head of bed 45 degrees, administered oxygen 2L via nasal cannula, performed respiratory assessment. Patient breathing easier, O2 saturation improved to 98%, respiratory rate decreased to 16.',
    tips: [
      'Start with what you found, then what you did, then the result',
      'Include measurements and observations',
      'Natural speech works perfectly - AI does the formatting',
      'Good for detailed clinical documentation'
    ]
  },

  // Epic EMR Templates
  'shift-assessment': {
    name: 'Epic Shift Assessment',
    description: 'Complete shift assessment covering all body systems and patient status.',
    placeholder: `Describe your shift assessment...

Example: "Patient alert and oriented. Lungs clear, heart regular, abdomen soft. Voiding okay. Skin intact. Dressing changed on left arm, looks good. Pain is 3 out of 10, gave Tylenol. Will continue current care and check again in 4 hours."

Talk naturally about your assessment - AI organizes everything!`,
    example: 'Patient alert and oriented x3. Lungs clear to auscultation bilaterally. Heart regular rate and rhythm. Abdomen soft, non-tender, bowel sounds active. Voiding without difficulty. Skin intact, no breakdown. Dressing changed to left forearm wound, clean and dry. Pain level 3/10, managed with Tylenol 650mg PO. Continue current care plan, reassess in 4 hours.',
    tips: [
      'Go through body systems as you talk',
      'Mention vitals, assessments, pain, and interventions',
      'Speak conversationally - AI extracts all the details',
      'Don\'t need perfect order - just describe your assessment'
    ]
  },
  'mar': {
    name: 'Epic MAR (Medication Administration)',
    description: 'Document medication administration with details and patient response.',
    placeholder: `Describe the medication you gave...

Example: "Gave Lisinopril 10 milligrams by mouth at 9am. Blood pressure before was 145 over 90. Patient took it fine, no problems. Will check BP in an hour."

Just say what med you gave and how it went - AI formats it!`,
    example: 'Administered Lisinopril 10mg PO at 0900. Pre-administration BP 142/88. Patient tolerated medication well, no adverse reactions noted. Post-administration BP at 0930: 132/82. Continue monitoring as ordered.',
    tips: [
      'State the medication, dose, time, and route naturally',
      'Mention how the patient tolerated it',
      'Include before/after vitals if you have them',
      'AI captures all the MAR requirements automatically'
    ]
  },
  'io': {
    name: 'Epic Intake & Output',
    description: 'Track fluid intake and output with balance calculations.',
    placeholder: `Tell us about intake and output...

Example: "Patient drank 600 ml of water and juice. Got 150 ml IV fluids. Urine output was 700 ml, clear yellow color. Everything looking good."

Just state the amounts naturally - AI does the math!`,
    example: 'Intake: Patient consumed 600ml oral fluids, received 150ml IV fluids. Total intake 750ml. Output: Urinated 700ml, clear yellow urine. Net balance +50ml. Fluid status within normal limits.',
    tips: [
      'State intake amounts (oral, IV, etc) and output amounts',
      'Mention urine characteristics if notable',
      'AI calculates totals and balances automatically',
      'Speak naturally - just give the numbers as you see them'
    ]
  },
  'wound-care': {
    name: 'Epic Wound Care',
    description: 'Document wound assessment and dressing changes.',
    placeholder: `Describe the wound and care provided...

Example: "Changed dressing on right leg wound. It's about 3 centimeters long. Little bit of pink drainage, no smell. Edges look good, coming together. Patient said pain is 2 out of 10. Put on new clean dressing. Will check again in 8 hours."

Describe what you see and did - AI formats it properly!`,
    example: 'Dressing changed to right leg wound, location mid-calf lateral aspect. Measures approximately 3cm length x 2cm width. Moderate serosanguinous drainage noted, no odor. Wound bed pink with good granulation. Edges approximated. Periwound skin intact. Pain level 2/10 during procedure. Applied hydrocolloid dressing. Plan to reassess in 8 hours.',
    tips: [
      'Describe location, size, drainage, and appearance',
      'Mention pain level and what dressing you used',
      'Talk naturally - AI captures all wound documentation requirements',
      'Include colors, amounts, and measurements as you observe them'
    ]
  },
  'safety-checklist': {
    name: 'Epic Safety Checklist',
    description: 'Document safety measures and fall prevention.',
    placeholder: `Describe safety measures in place...

Example: "Bed in lowest position, call light within reach, side rails up, patient has non-slip socks on, bed alarm is activated. Fall risk is moderate. Patient and family know to call for help."

List safety measures naturally - AI organizes the checklist!`,
    example: 'Fall risk assessment completed: moderate risk score. Bed positioned in lowest setting, call light within reach and functioning. Side rails raised bilaterally. Non-slip socks applied. Bed alarm activated and tested. Patient and family educated on fall prevention, verbalize understanding. Environment cleared of hazards.',
    tips: [
      'Mention bed position, call light, rails, alarms',
      'Include fall risk level if known',
      'State what safety measures are in place',
      'Speak naturally - AI creates the checklist format'
    ]
  },
  'med-surg': {
    name: 'Epic Med-Surg Unit',
    description: 'Document general medical-surgical unit care and progress.',
    placeholder: `Describe patient status and care...

Example: "Post-op day 2 after appendectomy. No fever. Walking with help. Eating regular diet okay. Pain is 2 out of 10. Encouraged walking and deep breathing. Doing well, continue current plan."

Talk through the patient day - AI structures it!`,
    example: 'Patient post-op day 2 following appendectomy. Afebrile, temperature 98.4°F. Ambulating with assistance x1, tolerated 100 feet in hallway. Tolerating regular diet, no nausea. Pain level 2/10, well-controlled with oral acetaminophen. Physical therapy consulted. Continue post-operative care, encourage mobility, advance activity as tolerated.',
    tips: [
      'Describe surgery/diagnosis, temperature, mobility',
      'Include diet, pain level, and what you did',
      'Speak conversationally about the patient progress',
      'AI organizes it into proper med-surg format'
    ]
  },
  'icu': {
    name: 'Epic ICU Unit',
    description: 'Document critical care with ventilator, drips, and intensive monitoring.',
    placeholder: `Describe ICU status and interventions...

Example: "Patient on ventilator, FiO2 at 40 percent, stable. Getting Propofol for sedation. Heart rhythm regular. Blood pressure okay with Levophed. Making good urine. Continuing current drips and monitoring."

Describe ICU care naturally - AI formats the critical details!`,
    example: 'Patient intubated and ventilated. Ventilator mode AC, FiO2 40%, PEEP 5, tidal volume 450ml. Hemodynamically stable, MAP 72mmHg. On Levophed at 0.08 mcg/kg/min. Sedated with Propofol, RASS -1. Cardiac rhythm sinus, no ectopy. Adequate urine output 50ml/hr. Continue current ventilator settings and vasopressor support, monitor ABGs.',
    tips: [
      'Mention ventilator settings, sedation, cardiac status',
      'Include drips, pressures, and monitoring',
      'Talk through the ICU care - AI extracts all critical values',
      'Natural speech works - just describe what is happening'
    ]
  },
  'nicu': {
    name: 'Epic NICU Unit',
    description: 'Document neonatal intensive care for premature or ill newborns.',
    placeholder: `Describe infant status and care...

Example: "Baby is 34 weeks gestation. In isolette, temperature good. Fed 25 ml of formula, took it well. Oxygen sat is 98 percent on room air. Resting comfortably. Parents visited and did skin-to-skin. Continue feeds and monitoring every 3 hours."

Describe baby's status naturally - AI organizes NICU documentation!`,
    example: 'Infant 34 weeks gestational age. Maintaining temperature in isolette at 35°C, infant temp 36.8°C stable. Fed 25ml formula via NG tube, tolerating well, no residuals. Abdomen soft. O2 saturation 98% on room air, no respiratory distress. Parents present, provided skin-to-skin care 45 minutes. Weight 1850g, up 30g from yesterday. Continue feeding schedule Q3H, monitor vital signs.',
    tips: [
      'Mention gestational age, temperature, feeding',
      'Include oxygen levels and activity',
      'Describe parent involvement if present',
      'Speak naturally - AI captures all NICU-specific details'
    ]
  },
  'mother-baby': {
    name: 'Epic Mother-Baby Unit',
    description: 'Document postpartum maternal and newborn care.',
    placeholder: `Describe mom and baby status...

Example: "Mom walking around fine, breastfeeding going well. Bleeding normal, no clots. Pain is 1 out of 10. Baby eating every 2 to 3 hours, good latch. Wet diapers okay. Cord looks good. Taught safe sleep, mom and dad understand."

Talk about both mom and baby - AI separates and formats it!`,
    example: 'Postpartum day 2. Mother ambulating independently, breastfeeding every 2-3 hours. Fundus firm, midline at umbilicus. Lochia moderate rubra, no clots. Perineal laceration healing well. Pain 1/10. Infant feeding well, achieving good latch. Adequate wet diapers and stools. Cord care provided, site clean and dry. Safe sleep education completed, parents verbalize understanding.',
    tips: [
      'Describe maternal mobility, breastfeeding, bleeding',
      'Include baby feeding, elimination, cord care',
      'Mention education provided',
      'Speak naturally about both - AI organizes maternal and newborn sections'
    ]
  }
};

/**
 * Get template guidance for a specific template
 */
export function getTemplateGuidance(template: string): TemplateGuide {
  return TEMPLATE_GUIDANCE[template] || {
    name: 'Nursing Note',
    description: 'Document your nursing care and patient assessment.',
    placeholder: 'Describe your patient care in your own words. Our AI will organize it into a professional nursing note.',
    example: 'Just speak naturally about what you observed, what you did, and how the patient responded.',
    tips: ['Speak conversationally', 'Include relevant clinical details', 'AI handles the formatting']
  };
}

/**
 * Get a short placeholder for input fields
 */
export function getShortPlaceholder(template: string): string {
  const guide = getTemplateGuidance(template);
  return `Start recording or typing your ${guide.name}... (Click "Show Guide" for examples and tips)`;
}
