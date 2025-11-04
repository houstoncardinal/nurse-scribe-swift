/**
 * Template placeholders for clinical note input
 * Each placeholder is designed for clarity, AI-readiness, and clinical accuracy
 */

export interface TemplatePlaceholder {
  value: string;
  placeholder: string;
  example: string;
  tooltip: string;
}

export const TEMPLATE_PLACEHOLDERS: Record<string, TemplatePlaceholder> = {
  'SOAP': {
    value: 'SOAP',
    placeholder: 'Describe your patient encounter using SOAP format...\n\nExample format:\n🩺 Subjective: What the patient reports\n📊 Objective: Vital signs and observations\n🧠 Assessment: Your clinical judgment\n🗓 Plan: Interventions and next steps',
    example: `🩺 Subjective: Patient reports mild chest discomfort for the past 2 hours. Denies shortness of breath, dizziness, or nausea.
📊 Objective: BP 128/84, HR 82, Temp 98.4°F, SpO2 98%. Skin warm and dry.
🧠 Assessment: Chest pain likely musculoskeletal. No acute distress.
🗓 Plan: Monitor vitals, provide acetaminophen 500 mg PO, reassess in 30 mins, notify provider if pain worsens.`,
    tooltip: 'SOAP format: Subjective (patient reports), Objective (vital signs & observations), Assessment (clinical judgment), Plan (interventions)'
  },
  
  'SBAR': {
    value: 'SBAR',
    placeholder: 'Communicate using SBAR format...\n\nExample format:\n⚡ Situation: Current patient concern\n📚 Background: Relevant history\n🧠 Assessment: Clinical findings\n💡 Recommendation: Suggested actions',
    example: `⚡ Situation: Patient c/o headache rated 8/10.
📚 Background: Hx of hypertension, on lisinopril. BP now 182/96.
🧠 Assessment: Hypertensive episode, patient alert/oriented, no visual changes.
💡 Recommendation: Administer PRN hydralazine per protocol, recheck BP in 30 minutes.`,
    tooltip: 'SBAR format: Situation (current issue), Background (context), Assessment (findings), Recommendation (action needed)'
  },
  
  'PIE': {
    value: 'PIE',
    placeholder: 'Document using PIE format...\n\nExample format:\n🚨 Problem: Identified issue\n💊 Intervention: Actions taken\n📈 Evaluation: Patient response',
    example: `🚨 Problem: Acute pain at surgical incision site rated 7/10.
💊 Intervention: Administered morphine 2 mg IV.
📈 Evaluation: Pain decreased to 3/10 within 20 minutes, patient resting comfortably.`,
    tooltip: 'PIE format: Problem (identified issue), Intervention (nursing actions), Evaluation (patient response)'
  },
  
  'DAR': {
    value: 'DAR',
    placeholder: 'Document using DAR format...\n\nExample format:\n📊 Data: Assessment findings\n⚙️ Action: Interventions performed\n✅ Response: Patient outcome',
    example: `📊 Data: Patient found anxious, pacing room, stating "I can't breathe right." SpO2 96%.
⚙️ Action: Instructed patient on deep-breathing techniques, provided reassurance.
✅ Response: Patient calmer, breathing normalized, states "I feel better now."`,
    tooltip: 'DAR format: Data (assessment), Action (intervention), Response (outcome)'
  },
  
  'shift-assessment': {
    value: 'shift-assessment',
    placeholder: 'Complete shift assessment...\n\nExample format:\n🩺 Neuro, 💓 CV, 🌬 Resp, 🍽 GI, 🚻 GU, 🦵 Skin, 🛏 Mobility, 🗓 Summary',
    example: `🩺 Neuro: Alert, oriented x4, PERRLA.
💓 CV: HR 80, regular rhythm, no edema.
🌬 Resp: Lungs clear, RR 18.
🍽 GI: Abdomen soft, non-tender, active bowel sounds.
🚻 GU: Voiding without difficulty.
🦵 Skin: Intact, warm, dry.
🛏 Mobility: Ambulates independently.
🗓 Summary: No acute changes this shift.`,
    tooltip: 'Epic Shift Assessment: Complete head-to-toe assessment covering all body systems'
  },
  
  'mar': {
    value: 'mar',
    placeholder: 'Document medication administration...\n\nExample format:\n💊 Medication, 🕐 Time, 👩‍⚕️ Route, ⚙️ Purpose, 📈 Response',
    example: `💊 Medication: Metoprolol 25 mg PO
🕐 Time Given: 0800
👩‍⚕️ Route: Oral
⚙️ Purpose: BP control
📈 Response: BP decreased from 152/90 to 130/80, HR stable at 78.`,
    tooltip: 'Epic MAR: Document medication name, dose, route, time, purpose, and patient response'
  },
  
  'io': {
    value: 'io',
    placeholder: 'Record intake and output...\n\nExample format:\n💧 Intake, 🚽 Output, ⚖️ Balance, 📊 Notes',
    example: `💧 Intake: 1200 mL PO fluids, 500 mL IV NS.
🚽 Output: 1600 mL urine, clear yellow.
⚖️ Balance: +100 mL over 12 hours.
📊 Notes: Adequate hydration, voiding without difficulty.`,
    tooltip: 'Epic I&O: Track all fluid intake and output with running balance'
  },
  
  'wound-care': {
    value: 'wound-care',
    placeholder: 'Document wound care...\n\nExample format:\n🩹 Location, 📏 Size, 🧬 Description, 🧽 Treatment, 📅 Next change',
    example: `🩹 Location: Left lower leg
📏 Size: 3 cm x 2 cm x 0.5 cm deep
🧬 Description: Red granulation tissue, scant serosanguinous drainage, no odor.
🧽 Treatment: Cleansed with NS, applied hydrocolloid dressing, secured with gauze.
📅 Next dressing change: 11/04/2025, 0900.`,
    tooltip: 'Epic Wound Care: Document location, size, appearance, treatment, and follow-up plan'
  },
  
  'safety-checklist': {
    value: 'safety-checklist',
    placeholder: 'Complete safety checklist...\n\nExample format:\n✅ Bed position, ✅ Call light, ✅ Non-slip socks, ✅ Alarms, ✅ Environment, 🧠 Fall risk',
    example: `✅ Bed in lowest position
✅ Call light within reach
✅ Non-slip socks applied
✅ Bed alarm activated
✅ Environment free of clutter
🧠 Fall risk: Moderate — patient educated on safety measures.`,
    tooltip: 'Epic Safety: Comprehensive safety checklist and fall risk assessment'
  },
  
  'med-surg': {
    value: 'med-surg',
    placeholder: 'Med-Surg unit documentation...\n\nExample format:\n🩺 Diagnosis, 📈 Vitals, 💧 IV, 💊 Pain, 🚶 Mobility, 🗓 Plan',
    example: `🩺 Diagnosis: Post-op day 2, laparoscopic appendectomy
📈 Vitals: Stable, afebrile
💧 IV: LR @ 75 mL/hr
💊 Pain: Controlled with scheduled acetaminophen
🚶 Mobility: Ambulates with standby assist
🗓 Plan: Encourage ambulation, monitor incision, continue IV fluids until PO tolerated.`,
    tooltip: 'Epic Med-Surg: Focus on post-operative care, mobility, and recovery progress'
  },
  
  'icu': {
    value: 'icu',
    placeholder: 'ICU unit documentation...\n\nExample format:\n🧠 Neuro, 💓 CV, 🌬 Resp, 💧 I&O, 🧪 Labs, 🗓 Plan',
    example: `🧠 Neuro: Sedated, responsive to pain
💓 CV: On norepinephrine drip @ 4 mcg/min, MAP 72
🌬 Resp: Intubated, vent settings 14/450/5/40%
💧 I&O: +250 mL past 12 hrs
🧪 Labs: ABG within normal limits
🗓 Plan: Continue vent weaning, titrate pressors to maintain MAP > 65.`,
    tooltip: 'Epic ICU: Critical care with focus on hemodynamics, ventilation, and intensive monitoring'
  },
  
  'nicu': {
    value: 'nicu',
    placeholder: 'NICU unit documentation...\n\nExample format:\n👶 Age/Weight, 🌬 Resp, 💓 CV, 🍼 Feeding, 💧 I&O, 🧠 Plan',
    example: `👶 Age: 32 weeks GA, weight 2.3 kg
🌬 Resp: On CPAP 5 cmH2O, FiO2 25%
💓 CV: HR 150, stable
🍼 Feeding: 20 mL EBM via OG tube q3h
💧 I&O: Voiding and stooling appropriately
🧠 Plan: Monitor respiratory effort, maintain temp, continue feeds as tolerated.`,
    tooltip: 'Epic NICU: Neonatal care including respiratory support, feeding, and growth monitoring'
  },
  
  'mother-baby': {
    value: 'mother-baby',
    placeholder: 'Mother-Baby unit documentation...\n\nExample format:\n🤱 Mother, 👶 Newborn, 🌡 Vitals, 🧽 Cord site, 🍼 Feeding, 🧠 Education',
    example: `🤱 Mother: Stable, breastfeeding initiated successfully
👶 Newborn: 1 day old, full-term, APGAR 9/9
🌡 Vitals: Stable
🧽 Cord site: Clean and dry
🍼 Feeding: Every 2-3 hrs, tolerating well
🧠 Education: Reviewed breastfeeding techniques, safe sleep, and newborn care.`,
    tooltip: 'Epic Mother-Baby: Postpartum maternal care and newborn assessment with parent education'
  }
};

/**
 * Get placeholder text for a specific template
 */
export function getTemplatePlaceholder(templateValue: string): string {
  return TEMPLATE_PLACEHOLDERS[templateValue]?.placeholder || 'Describe your patient encounter...';
}

/**
 * Get example text for a specific template
 */
export function getTemplateExample(templateValue: string): string {
  return TEMPLATE_PLACEHOLDERS[templateValue]?.example || '';
}

/**
 * Get tooltip text for a specific template
 */
export function getTemplateTooltip(templateValue: string): string {
  return TEMPLATE_PLACEHOLDERS[templateValue]?.tooltip || 'Enter your clinical documentation';
}
