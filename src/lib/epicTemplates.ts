/**
 * Epic EMR Template Definitions
 * Aligned with Epic Nursing Documentation Checklist
 */

export type ShiftPhase = 'Start of Shift' | 'Mid-Shift' | 'End of Shift';
export type UnitType = 'Med-Surg' | 'ICU' | 'NICU' | 'Mother-Baby';

// ============================================================================
// SHIFT ASSESSMENT TEMPLATE
// ============================================================================

export interface ShiftAssessmentTemplate {
  shiftPhase: ShiftPhase;
  unitType?: UnitType;
  timestamp: string;
  patientAssessment: {
    neuro: string;
    cardiac: string;
    respiratory: string;
    gi: string;
    gu: string;
    skin: string;
    musculoskeletal: string;
    vitalSigns: {
      bp: string;
      hr: string;
      rr: string;
      temp: string;
      spo2: string;
      pain: string;
      weight?: string;
    };
  };
  medicationAdministration: {
    medications: Array<{
      name: string;
      dose: string;
      route: string;
      time: string;
      site?: string;
      response: string;
    }>;
  };
  intakeOutput: {
    intake: {
      oral: number;
      iv: number;
      enteral: number;
      parenteral: number;
      total: number;
    };
    output: {
      urine: number;
      stool: number;
      drains: number;
      emesis: number;
      wound: number;
      total: number;
    };
    balance: number;
  };
  treatments: string[];
  communication: string;
  safety: string;
  narrative: string;
}

// ============================================================================
// MAR (MEDICATION ADMINISTRATION RECORD) TEMPLATE
// ============================================================================

export interface MARTemplate {
  shift: 'Day' | 'Evening' | 'Night';
  medications: Array<{
    medicationName: string;
    dose: string;
    route: 'PO' | 'IV' | 'IM' | 'SQ' | 'SL' | 'PR' | 'Topical' | 'Inhaled' | 'Other';
    site?: string;
    time: string;
    preAssessment: string;
    postAssessment: string;
    patientResponse: string;
    adverseReactions: string;
    prnFollowUp?: string;
    coSignatureRequired: boolean;
    coSignature?: string;
  }>;
  notes: string;
}

// ============================================================================
// I&O (INTAKE & OUTPUT) TEMPLATE
// ============================================================================

export interface IOTemplate {
  shift: 'Day' | 'Evening' | 'Night';
  startTime: string;
  endTime: string;
  intake: {
    oral: number;
    iv: number;
    enteral: number;
    parenteral: number;
    blood: number;
    other: number;
    total: number;
  };
  output: {
    urine: number;
    stool: number;
    drains: Array<{
      location: string;
      amount: number;
      type: string;
    }>;
    emesis: number;
    wound: number;
    ng: number;
    other: number;
    total: number;
  };
  balance: number;
  notes: string;
}

// ============================================================================
// WOUND CARE TEMPLATE
// ============================================================================

export interface WoundCareTemplate {
  location: string;
  stage: 'Stage I' | 'Stage II' | 'Stage III' | 'Stage IV' | 'Unstageable' | 'Deep Tissue Injury';
  size: {
    length: number;
    width: number;
    depth: number;
    unit: 'cm' | 'mm';
  };
  drainage: {
    type: 'Serous' | 'Sanguineous' | 'Serosanguineous' | 'Purulent' | 'None';
    amount: 'None' | 'Scant' | 'Small' | 'Moderate' | 'Large' | 'Copious';
    color: string;
    odor: 'None' | 'Foul' | 'Mild';
  };
  woundBed: {
    tissue: 'Granulation' | 'Slough' | 'Eschar' | 'Epithelial' | 'Mixed';
    percentGranulation: number;
    percentSlough: number;
    percentEschar: number;
  };
  periwound: {
    condition: 'Intact' | 'Macerated' | 'Erythematous' | 'Indurated' | 'Other';
    description: string;
  };
  dressingType: string;
  interventions: string[];
  patientResponse: string;
  nextDressingChange: string;
  photographTaken: boolean;
}

// ============================================================================
// SAFETY CHECKLIST TEMPLATE
// ============================================================================

export interface SafetyChecklistTemplate {
  fallRisk: {
    score: number;
    level: 'Low' | 'Moderate' | 'High';
    interventions: string[];
  };
  restraints: {
    inUse: boolean;
    type?: string;
    reason?: string;
    orderVerified?: boolean;
    monitoringTimes?: string[];
    releaseTimes?: string[];
  };
  isolation: {
    required: boolean;
    type?: 'Contact' | 'Droplet' | 'Airborne' | 'Protective';
    ppeUsed?: string[];
  };
  patientIdentification: {
    verified: boolean;
    method: string;
  };
  allergies: string[];
  codeStatus: 'Full Code' | 'DNR' | 'DNI' | 'AND' | 'Other';
  notes: string;
}

// ============================================================================
// UNIT-SPECIFIC TEMPLATES
// ============================================================================

// Med-Surg Specific
export interface MedSurgTemplate {
  patientEducation: {
    topics: string[];
    method: string;
    understanding: 'Verbalizes understanding' | 'Needs reinforcement' | 'Unable to assess';
    barriers: string[];
  };
  dischargeReadiness: {
    criteria: Array<{
      item: string;
      met: boolean;
    }>;
    estimatedDischarge: string;
    barriers: string[];
  };
  painManagement: {
    location: string;
    quality: string;
    intensity: number;
    interventions: string[];
    effectiveness: string;
  };
  mobility: {
    level: 'Independent' | 'Assist x1' | 'Assist x2' | 'Total Assist' | 'Bedbound';
    assistiveDevices: string[];
    ambulation: string;
  };
}

// ICU Specific
export interface ICUTemplate {
  hemodynamicMonitoring: {
    cvp: string;
    map: string;
    co: string;
    svr: string;
    pap?: string;
    pcwp?: string;
  };
  ventilatorSettings: {
    mode: string;
    fio2: string;
    peep: string;
    tv: string;
    rr: string;
    pip: string;
    plateau: string;
  };
  deviceChecks: Array<{
    device: string;
    status: 'Functioning' | 'Malfunction' | 'Replaced';
    notes: string;
  }>;
  titrationDrips: Array<{
    medication: string;
    currentRate: string;
    targetParameter: string;
    targetValue: string;
    actualValue: string;
    adjustment: string;
  }>;
  sedationScore: {
    scale: 'RASS' | 'SAS' | 'Ramsay';
    score: number;
    target: number;
  };
  deliriumAssessment: {
    tool: 'CAM-ICU' | 'ICDSC';
    result: 'Positive' | 'Negative' | 'Unable to assess';
  };
}

// NICU Specific
export interface NICUTemplate {
  thermoregulation: {
    environment: 'Isolette' | 'Open Warmer' | 'Crib';
    temperature: number;
    skinTemperature: number;
    environmentalTemp: number;
  };
  feedingTolerance: {
    type: 'Breast' | 'Bottle' | 'NG' | 'OG' | 'TPN';
    amount: number;
    frequency: string;
    tolerance: 'Good' | 'Fair' | 'Poor';
    residuals: string;
    vomiting: boolean;
    abdomen: string;
  };
  parentalBonding: {
    skinToSkin: boolean;
    duration?: number;
    breastfeeding: boolean;
    parentalVisits: number;
    concerns: string[];
  };
  dailyWeight: {
    weight: number;
    change: number;
    percentChange: number;
  };
  developmentalCare: {
    positioning: string;
    stimulation: string;
    sleepCycles: string;
  };
  respiratorySupport: {
    type: 'Room Air' | 'Nasal Cannula' | 'CPAP' | 'HFNC' | 'Ventilator';
    settings: string;
    fio2: string;
  };
}

// Mother-Baby Specific
export interface MotherBabyTemplate {
  maternal: {
    fundalCheck: {
      position: 'Midline' | 'Deviated';
      firmness: 'Firm' | 'Boggy';
      height: string;
    };
    lochia: {
      amount: 'Scant' | 'Small' | 'Moderate' | 'Large';
      color: 'Rubra' | 'Serosa' | 'Alba';
      odor: 'Normal' | 'Foul';
      clots: boolean;
    };
    perineum: {
      condition: 'Intact' | 'Laceration' | 'Episiotomy';
      healing: 'WNL' | 'Redness' | 'Edema' | 'Ecchymosis' | 'Discharge' | 'Approximation';
    };
    breasts: {
      condition: 'Soft' | 'Filling' | 'Full' | 'Engorged';
      nipples: 'Intact' | 'Cracked' | 'Bleeding';
      breastfeeding: boolean;
    };
  };
  newborn: {
    feeding: {
      type: 'Breast' | 'Formula' | 'Both';
      frequency: string;
      duration?: number;
      amount?: number;
      latch?: 'Good' | 'Fair' | 'Poor';
      tolerance: string;
    };
    bonding: {
      skinToSkin: boolean;
      eyeContact: boolean;
      responsiveness: string;
      concerns: string[];
    };
    safeSleepEducation: {
      provided: boolean;
      topics: string[];
      understanding: 'Verbalizes understanding' | 'Needs reinforcement';
    };
    circumcision?: {
      status: 'Intact' | 'Healing' | 'Concerns';
      care: string;
    };
    cordCare: {
      condition: 'Dry' | 'Moist' | 'Drainage' | 'Odor';
      care: string;
    };
  };
}

// ============================================================================
// TEMPLATE REGISTRY
// ============================================================================

export const EPIC_TEMPLATES = {
  'shift-assessment': 'Shift Assessment',
  'mar': 'Medication Administration Record',
  'io': 'Intake & Output',
  'wound-care': 'Wound Care',
  'safety-checklist': 'Safety Checklist',
  'med-surg': 'Med-Surg Documentation',
  'icu': 'ICU Documentation',
  'nicu': 'NICU Documentation',
  'mother-baby': 'Mother-Baby Documentation'
} as const;

export type EpicTemplateType = keyof typeof EPIC_TEMPLATES;

// ============================================================================
// TEMPLATE HELPERS
// ============================================================================

export function getTemplateByType(type: EpicTemplateType): string {
  return EPIC_TEMPLATES[type];
}

export function getAllEpicTemplates(): Array<{ id: EpicTemplateType; name: string }> {
  return Object.entries(EPIC_TEMPLATES).map(([id, name]) => ({
    id: id as EpicTemplateType,
    name
  }));
}

export function isEpicTemplate(template: string): boolean {
  return template in EPIC_TEMPLATES;
}
