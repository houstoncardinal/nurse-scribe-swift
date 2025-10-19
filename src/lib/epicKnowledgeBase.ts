/**
 * Epic EMR Knowledge Base
 * Epic-specific terminology, patterns, and documentation standards
 */

import { ShiftPhase, UnitType } from './epicTemplates';

// ============================================================================
// EPIC DOCUMENTATION PATTERNS
// ============================================================================

export const EPIC_PATTERNS = {
  shiftPhases: {
    'start of shift': 'Start of Shift',
    'beginning of shift': 'Start of Shift',
    'initial assessment': 'Start of Shift',
    'shift start': 'Start of Shift',
    'mid shift': 'Mid-Shift',
    'mid-shift': 'Mid-Shift',
    'during shift': 'Mid-Shift',
    'end of shift': 'End of Shift',
    'shift end': 'End of Shift',
    'handoff': 'End of Shift',
    'sign out': 'End of Shift'
  },

  assessmentSystems: {
    neuro: ['neurological', 'neuro', 'mental status', 'loc', 'level of consciousness', 'alert', 'oriented', 'pupils', 'perrla'],
    cardiac: ['cardiac', 'heart', 'cardiovascular', 'chest', 'heart sounds', 'rhythm', 'pulses', 'edema'],
    respiratory: ['respiratory', 'lungs', 'breathing', 'breath sounds', 'oxygen', 'dyspnea', 'cough', 'sputum'],
    gi: ['gastrointestinal', 'gi', 'abdomen', 'bowel', 'nausea', 'vomiting', 'appetite', 'bowel sounds'],
    gu: ['genitourinary', 'gu', 'urinary', 'bladder', 'foley', 'catheter', 'urine', 'continent'],
    skin: ['skin', 'integumentary', 'wound', 'pressure injury', 'rash', 'bruising', 'turgor'],
    musculoskeletal: ['musculoskeletal', 'msk', 'mobility', 'range of motion', 'rom', 'strength', 'gait']
  },

  medicationRoutes: {
    'PO': ['po', 'by mouth', 'oral', 'orally', 'p.o.'],
    'IV': ['iv', 'intravenous', 'i.v.', 'intravenously'],
    'IM': ['im', 'intramuscular', 'i.m.'],
    'SQ': ['sq', 'subq', 'subcutaneous', 's.q.', 'sc'],
    'SL': ['sl', 'sublingual', 's.l.', 'under tongue'],
    'PR': ['pr', 'rectal', 'rectally', 'p.r.'],
    'Topical': ['topical', 'topically', 'applied to skin'],
    'Inhaled': ['inhaled', 'nebulized', 'inhaler', 'neb']
  },

  safetyChecks: [
    'fall risk',
    'fall precautions',
    'restraints',
    'isolation precautions',
    'patient identification',
    'two patient identifiers',
    'allergy check',
    'code status',
    'bed alarm',
    'call light within reach'
  ],

  communicationTypes: {
    'SBAR': ['sbar', 'situation background assessment recommendation'],
    'Provider Notification': ['called provider', 'notified physician', 'paged doctor', 'contacted md'],
    'Family Update': ['family notified', 'spoke with family', 'family at bedside'],
    'Handoff': ['handoff', 'report given', 'sign out', 'end of shift report']
  },

  unitTypes: {
    'Med-Surg': ['med surg', 'medical surgical', 'medsurg', 'general floor'],
    'ICU': ['icu', 'intensive care', 'critical care', 'micu', 'sicu', 'ccu'],
    'NICU': ['nicu', 'neonatal', 'newborn icu', 'neonatal intensive care'],
    'Mother-Baby': ['mother baby', 'postpartum', 'pp', 'ob', 'maternity', 'l&d']
  }
};

// ============================================================================
// EPIC TERMINOLOGY DATABASE
// ============================================================================

export const EPIC_TERMINOLOGY = {
  // Vital Signs
  vitalSigns: {
    'BP': { full: 'Blood Pressure', unit: 'mmHg', normal: '90-140/60-90' },
    'HR': { full: 'Heart Rate', unit: 'bpm', normal: '60-100' },
    'RR': { full: 'Respiratory Rate', unit: 'breaths/min', normal: '12-20' },
    'Temp': { full: 'Temperature', unit: '°F', normal: '97.0-99.0' },
    'SpO2': { full: 'Oxygen Saturation', unit: '%', normal: '95-100' },
    'Pain': { full: 'Pain Level', unit: '/10', normal: '0-3' },
    'MAP': { full: 'Mean Arterial Pressure', unit: 'mmHg', normal: '70-100' },
    'CVP': { full: 'Central Venous Pressure', unit: 'mmHg', normal: '2-8' }
  },

  // Assessment Findings
  assessmentFindings: {
    neuro: [
      'Alert and oriented x3', 'Alert and oriented x4', 'Confused', 'Lethargic',
      'Obtunded', 'Stuporous', 'Comatose', 'PERRLA', 'Pupils equal and reactive',
      'Follows commands', 'Moves all extremities', 'Weakness noted', 'Numbness',
      'Tingling', 'Headache', 'Dizziness', 'Seizure activity'
    ],
    cardiac: [
      'Regular rate and rhythm', 'Irregular rhythm', 'Tachycardic', 'Bradycardic',
      'S1 S2 present', 'Murmur noted', 'Chest pain', 'No chest pain',
      'Peripheral pulses palpable', 'Edema present', 'No edema', 'Capillary refill <3 sec'
    ],
    respiratory: [
      'Lungs clear bilaterally', 'Crackles', 'Wheezes', 'Rhonchi', 'Diminished breath sounds',
      'Shortness of breath', 'Dyspnea on exertion', 'Labored breathing', 'Using accessory muscles',
      'Cough productive', 'Cough nonproductive', 'Oxygen via nasal cannula', 'Room air'
    ],
    gi: [
      'Abdomen soft', 'Abdomen distended', 'Bowel sounds present', 'Bowel sounds hypoactive',
      'Bowel sounds hyperactive', 'Nausea', 'Vomiting', 'Diarrhea', 'Constipation',
      'Last BM', 'Tolerating diet', 'NPO', 'Appetite good', 'Appetite poor'
    ],
    gu: [
      'Voiding without difficulty', 'Foley catheter patent', 'Urine clear yellow',
      'Urine cloudy', 'Hematuria', 'Dysuria', 'Frequency', 'Urgency',
      'Continent', 'Incontinent', 'Bladder scan performed'
    ],
    skin: [
      'Skin warm and dry', 'Skin cool', 'Skin moist', 'Good turgor', 'Poor turgor',
      'No wounds', 'Wound present', 'Pressure injury', 'Bruising', 'Rash',
      'Intact', 'Breakdown noted'
    ]
  },

  // I&O Categories
  intakeCategories: [
    'Oral intake', 'IV fluids', 'Enteral feeding', 'TPN', 'Blood products',
    'Medications', 'Flushes', 'Other intake'
  ],

  outputCategories: [
    'Urine output', 'Stool', 'Emesis', 'NG drainage', 'Chest tube drainage',
    'JP drain', 'Hemovac', 'Wound drainage', 'Other output'
  ],

  // Medication Administration
  medicationSites: {
    'IV': ['Right AC', 'Left AC', 'Right hand', 'Left hand', 'PICC', 'Central line', 'Port'],
    'IM': ['Right deltoid', 'Left deltoid', 'Right vastus lateralis', 'Left vastus lateralis', 'Right ventrogluteal', 'Left ventrogluteal'],
    'SQ': ['Abdomen', 'Right arm', 'Left arm', 'Right thigh', 'Left thigh']
  },

  // Safety & Risk
  fallRiskFactors: [
    'History of falls', 'Age >65', 'Confusion', 'Impaired mobility',
    'Medications affecting balance', 'Incontinence', 'Visual impairment',
    'Orthostatic hypotension'
  ],

  isolationTypes: {
    'Contact': ['MRSA', 'VRE', 'C. diff', 'Scabies', 'Impetigo'],
    'Droplet': ['Influenza', 'Pertussis', 'Meningitis', 'Mumps', 'Rubella'],
    'Airborne': ['TB', 'Measles', 'Varicella', 'Disseminated zoster'],
    'Protective': ['Neutropenic', 'Immunocompromised', 'Transplant']
  },

  // Code Status
  codeStatus: [
    'Full Code', 'DNR', 'DNI', 'AND', 'Comfort Care', 'Modified Code'
  ],

  // Wound Stages
  woundStages: [
    'Stage I', 'Stage II', 'Stage III', 'Stage IV',
    'Unstageable', 'Deep Tissue Injury', 'Medical Device Related'
  ],

  // Drainage Types
  drainageTypes: [
    'Serous', 'Sanguineous', 'Serosanguineous', 'Purulent', 'None'
  ],

  // Unit-Specific Terms
  unitSpecific: {
    'ICU': {
      hemodynamics: ['CVP', 'MAP', 'CO', 'SVR', 'PAP', 'PCWP'],
      ventilator: ['Mode', 'FiO2', 'PEEP', 'TV', 'RR', 'PIP', 'Plateau'],
      sedation: ['RASS', 'SAS', 'Ramsay', 'CAM-ICU', 'ICDSC'],
      devices: ['A-line', 'Central line', 'Swan-Ganz', 'IABP', 'CRRT', 'ECMO']
    },
    'NICU': {
      environment: ['Isolette', 'Open warmer', 'Crib'],
      feeding: ['Breast', 'Bottle', 'NG', 'OG', 'TPN'],
      respiratory: ['Room air', 'Nasal cannula', 'CPAP', 'HFNC', 'Ventilator']
    },
    'Mother-Baby': {
      fundal: ['Midline', 'Deviated', 'Firm', 'Boggy', 'At umbilicus', 'Below umbilicus'],
      lochia: ['Rubra', 'Serosa', 'Alba', 'Scant', 'Small', 'Moderate', 'Large'],
      breastfeeding: ['Good latch', 'Fair latch', 'Poor latch', 'Nipple shield used']
    }
  }
};

// ============================================================================
// EPIC DETECTION FUNCTIONS
// ============================================================================

export function detectShiftPhase(input: string): ShiftPhase | null {
  const lowerInput = input.toLowerCase();
  
  for (const [pattern, phase] of Object.entries(EPIC_PATTERNS.shiftPhases)) {
    if (lowerInput.includes(pattern)) {
      return phase as ShiftPhase;
    }
  }
  
  return null;
}

export function detectUnitType(input: string): UnitType | null {
  const lowerInput = input.toLowerCase();
  
  for (const [unit, patterns] of Object.entries(EPIC_PATTERNS.unitTypes)) {
    for (const pattern of patterns) {
      if (lowerInput.includes(pattern)) {
        return unit as UnitType;
      }
    }
  }
  
  return null;
}

export function detectMedicationRoute(input: string): string | null {
  const lowerInput = input.toLowerCase();
  
  for (const [route, patterns] of Object.entries(EPIC_PATTERNS.medicationRoutes)) {
    for (const pattern of patterns) {
      if (lowerInput.includes(pattern)) {
        return route;
      }
    }
  }
  
  return null;
}

export function detectAssessmentSystem(input: string): string[] {
  const lowerInput = input.toLowerCase();
  const systems: string[] = [];
  
  for (const [system, keywords] of Object.entries(EPIC_PATTERNS.assessmentSystems)) {
    for (const keyword of keywords) {
      if (lowerInput.includes(keyword)) {
        if (!systems.includes(system)) {
          systems.push(system);
        }
        break;
      }
    }
  }
  
  return systems;
}

export function detectSafetyChecks(input: string): string[] {
  const lowerInput = input.toLowerCase();
  const checks: string[] = [];
  
  for (const check of EPIC_PATTERNS.safetyChecks) {
    if (lowerInput.includes(check.toLowerCase())) {
      checks.push(check);
    }
  }
  
  return checks;
}

// ============================================================================
// EPIC FIELD EXTRACTORS
// ============================================================================

export function extractIntakeOutput(input: string): {
  intake: { [key: string]: number };
  output: { [key: string]: number };
  balance: number;
} {
  const intake: { [key: string]: number } = {
    oral: 0,
    iv: 0,
    enteral: 0,
    parenteral: 0,
    blood: 0,
    other: 0
  };
  
  const output: { [key: string]: number } = {
    urine: 0,
    stool: 0,
    emesis: 0,
    ng: 0,
    wound: 0,
    other: 0
  };
  
  // Extract intake values
  const oralMatch = input.match(/oral\s+intake[:\s]+(\d+)\s*(?:ml|cc)?/i);
  if (oralMatch) intake.oral = parseInt(oralMatch[1]);
  
  const ivMatch = input.match(/iv\s+(?:fluids?|intake)[:\s]+(\d+)\s*(?:ml|cc)?/i);
  if (ivMatch) intake.iv = parseInt(ivMatch[1]);
  
  const enteralMatch = input.match(/enteral[:\s]+(\d+)\s*(?:ml|cc)?/i);
  if (enteralMatch) intake.enteral = parseInt(enteralMatch[1]);
  
  // Extract output values
  const urineMatch = input.match(/urine\s+(?:output)?[:\s]+(\d+)\s*(?:ml|cc)?/i);
  if (urineMatch) output.urine = parseInt(urineMatch[1]);
  
  const emesisMatch = input.match(/emesis[:\s]+(\d+)\s*(?:ml|cc)?/i);
  if (emesisMatch) output.emesis = parseInt(emesisMatch[1]);
  
  const ngMatch = input.match(/ng\s+(?:drainage|output)[:\s]+(\d+)\s*(?:ml|cc)?/i);
  if (ngMatch) output.ng = parseInt(ngMatch[1]);
  
  // Calculate totals
  const totalIntake = Object.values(intake).reduce((sum, val) => sum + val, 0);
  const totalOutput = Object.values(output).reduce((sum, val) => sum + val, 0);
  const balance = totalIntake - totalOutput;
  
  return {
    intake: { ...intake, total: totalIntake },
    output: { ...output, total: totalOutput },
    balance
  };
}

export function extractMedicationInfo(input: string): Array<{
  name: string;
  dose: string;
  route: string;
  time: string;
}> {
  const medications: Array<{
    name: string;
    dose: string;
    route: string;
    time: string;
  }> = [];
  
  // Pattern: medication name + dose + route
  const medPattern = /(?:administered|gave|given)\s+([a-z]+(?:cillin|mycin|pril|olol|statin|zole|pine|pam|done|caine))\s+(\d+\s*(?:mg|mcg|units?))\s+(\w+)/gi;
  
  let match;
  while ((match = medPattern.exec(input)) !== null) {
    const route = detectMedicationRoute(match[3]) || match[3];
    medications.push({
      name: match[1],
      dose: match[2],
      route: route,
      time: new Date().toLocaleTimeString()
    });
  }
  
  return medications;
}

export function extractWoundInfo(input: string): {
  location?: string;
  stage?: string;
  size?: string;
  drainage?: string;
} | null {
  const woundInfo: any = {};
  
  // Location
  const locationMatch = input.match(/wound\s+(?:on|at|to)\s+([^,.\n]+)/i);
  if (locationMatch) woundInfo.location = locationMatch[1].trim();
  
  // Stage
  for (const stage of EPIC_TERMINOLOGY.woundStages) {
    if (input.toLowerCase().includes(stage.toLowerCase())) {
      woundInfo.stage = stage;
      break;
    }
  }
  
  // Size
  const sizeMatch = input.match(/(\d+\.?\d*)\s*(?:x|by)\s*(\d+\.?\d*)\s*(?:x|by)?\s*(\d+\.?\d*)?\s*cm/i);
  if (sizeMatch) {
    woundInfo.size = sizeMatch[3] 
      ? `${sizeMatch[1]} x ${sizeMatch[2]} x ${sizeMatch[3]} cm`
      : `${sizeMatch[1]} x ${sizeMatch[2]} cm`;
  }
  
  // Drainage
  for (const drainage of EPIC_TERMINOLOGY.drainageTypes) {
    if (input.toLowerCase().includes(drainage.toLowerCase())) {
      woundInfo.drainage = drainage;
      break;
    }
  }
  
  return Object.keys(woundInfo).length > 0 ? woundInfo : null;
}

// ============================================================================
// EPIC COMPLIANCE HELPERS
// ============================================================================

export function getRequiredFieldsForShiftPhase(phase: ShiftPhase): string[] {
  const baseFields = ['Patient Assessment', 'Vital Signs', 'Safety Checks'];
  
  switch (phase) {
    case 'Start of Shift':
      return [...baseFields, 'Review Orders', 'Verify MAR', 'Patient Identification'];
    case 'Mid-Shift':
      return [...baseFields, 'I&O Update', 'Interventions', 'Patient Response'];
    case 'End of Shift':
      return [...baseFields, 'Complete MAR', 'Update Care Plans', 'Handoff Report'];
    default:
      return baseFields;
  }
}

export function getRequiredFieldsForUnit(unit: UnitType): string[] {
  switch (unit) {
    case 'Med-Surg':
      return ['Patient Education', 'Discharge Readiness', 'Pain Management', 'Mobility'];
    case 'ICU':
      return ['Hemodynamic Monitoring', 'Ventilator Settings', 'Device Checks', 'Sedation Score'];
    case 'NICU':
      return ['Thermoregulation', 'Feeding Tolerance', 'Parental Bonding', 'Daily Weight'];
    case 'Mother-Baby':
      return ['Fundal Check', 'Lochia', 'Newborn Feeding', 'Safe Sleep Education'];
    default:
      return [];
  }
}

export const epicKnowledgeBase = {
  EPIC_PATTERNS,
  EPIC_TERMINOLOGY,
  detectShiftPhase,
  detectUnitType,
  detectMedicationRoute,
  detectAssessmentSystem,
  detectSafetyChecks,
  extractIntakeOutput,
  extractMedicationInfo,
  extractWoundInfo,
  getRequiredFieldsForShiftPhase,
  getRequiredFieldsForUnit
};

export default epicKnowledgeBase;
