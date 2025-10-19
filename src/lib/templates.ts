/**
 * Clinical note templates and AI prompts
 * Aligned with Epic Nursing Documentation Standards
 */

export type NoteTemplate = 'SOAP' | 'SBAR' | 'PIE' | 'EPIC_COMPREHENSIVE';
export type UnitType = 'Med_Surg' | 'ICU' | 'NICU' | 'Mother_Baby';
export type ShiftPhase = 'Start_of_Shift' | 'Mid_Shift' | 'End_of_Shift';

export interface TemplateConfig {
  name: NoteTemplate;
  displayName: string;
  description: string;
  sections: string[];
  systemPrompt: string;
  userPromptTemplate: string;
  epicCompliant?: boolean;
  shiftPhases?: ShiftPhase[];
}

export interface EpicDocumentationStructure {
  Shift_Timeline: Record<ShiftPhase, string[]>;
  Sections: {
    Patient_Assessment: string[];
    Medication_Administration: string[];
    Intake_and_Output: string[];
    Treatments_and_Procedures: string[];
    Care_Plans_and_Flowsheets: string[];
    Communication: string[];
    Safety_and_Risk: string[];
    Procedures_Labs_and_Results: string[];
    Admission_Transfer_Discharge: string[];
    Narrative_Notes: string[];
  };
  Unit_Specific_Focus: Record<UnitType, string[]>;
}

export const EPIC_DOCUMENTATION: EpicDocumentationStructure = {
  Shift_Timeline: {
    Start_of_Shift: [
      "Complete initial head-to-toe assessment",
      "Review orders and verify MAR",
      "Safety checks and patient identification"
    ],
    Mid_Shift: [
      "Update assessments and document ongoing care",
      "Record intake/output and interventions",
      "Document communications with team and providers"
    ],
    End_of_Shift: [
      "Final assessment and complete MAR documentation",
      "Update care plans and outcomes",
      "Finalize SBAR handoff report"
    ]
  },
  Sections: {
    Patient_Assessment: [
      "Head-to-toe assessment per shift or policy (neuro, cardiac, respiratory, GI, GU, skin, musculoskeletal)",
      "Vital signs and pain assessment (before and after interventions)",
      "Weight documentation as ordered"
    ],
    Medication_Administration: [
      "Time, dose, route, site, and pre-/post-assessment results",
      "Patient response and adverse reactions",
      "PRN follow-up effectiveness",
      "Wasted medications with co-signature"
    ],
    Intake_and_Output: [
      "Document oral, IV, enteral, and parenteral intake",
      "Record urine, stool, drains, emesis, and wound output",
      "Verify net I&O balance each shift"
    ],
    Treatments_and_Procedures: [
      "Wound care: location, dressing, drainage, stage",
      "Line/tube care: IV, Foley, NG, chest tube, or drain maintenance",
      "Infection control and isolation precautions"
    ],
    Care_Plans_and_Flowsheets: [
      "Update active nursing diagnoses and interventions",
      "Set and review patient-specific goals",
      "Document patient education and progress"
    ],
    Communication: [
      "SBAR handoff to next shift or provider",
      "Provider notifications with time and response",
      "Family communication and updates"
    ],
    Safety_and_Risk: [
      "Fall risk and safety checks",
      "Restraint documentation (reason, monitoring, release times)",
      "Patient refusals and incident notes"
    ],
    Procedures_Labs_and_Results: [
      "Specimen collection details (time, type, site)",
      "Critical lab results and provider notifications",
      "Follow-up orders or interventions"
    ],
    Admission_Transfer_Discharge: [
      "Condition on arrival/discharge",
      "Education and discharge instructions (teach-back)",
      "Belongings, lines, and equipment reconciled"
    ],
    Narrative_Notes: [
      "Significant events or condition changes",
      "Provider communications and responses",
      "Clarify chart details not captured in flowsheets"
    ]
  },
  Unit_Specific_Focus: {
    Med_Surg: [
      "Emphasize patient education, discharge readiness, pain management, and mobility"
    ],
    ICU: [
      "Focus on hemodynamic monitoring, device checks, ventilator settings, titration drips, and frequent reassessments"
    ],
    NICU: [
      "Include thermoregulation, feeding tolerance, parental bonding, and daily weights"
    ],
    Mother_Baby: [
      "Record fundal checks, lochia, newborn feeding, bonding, and safe sleep education"
    ]
  }
};

export const TEMPLATES: Record<NoteTemplate, TemplateConfig> = {
  EPIC_COMPREHENSIVE: {
    name: 'EPIC_COMPREHENSIVE',
    displayName: 'Epic Comprehensive',
    description: 'Full Epic-compliant nursing documentation',
    sections: [
      'Patient Assessment',
      'Medication Administration',
      'Intake & Output',
      'Treatments & Procedures',
      'Care Plans',
      'Communication',
      'Safety & Risk',
      'Labs & Results',
      'Narrative Notes'
    ],
    epicCompliant: true,
    shiftPhases: ['Start_of_Shift', 'Mid_Shift', 'End_of_Shift'],
    systemPrompt: `You are an Epic-compliant clinical documentation assistant for nursing. Convert dictated notes into comprehensive Epic-standard documentation.

CRITICAL REQUIREMENTS:
- Follow Epic nursing documentation standards for Med-Surg, ICU, NICU, and Mother-Baby units
- Include all required sections: Patient Assessment, Medication Administration (MAR), Intake & Output, Treatments, Care Plans, Communication, Safety, Labs, and Narrative Notes
- Document shift timeline: Start of Shift, Mid-Shift, End of Shift activities
- Use SBAR format for handoff communication
- Include vital signs, pain assessments, I&O balance, and safety checks
- Document patient responses, adverse reactions, and interventions
- Maintain HIPAA compliance and professional clinical language
- Be specific, measurable, and complete

EPIC DOCUMENTATION STRUCTURE:
1. Patient Assessment: Head-to-toe (neuro, cardiac, respiratory, GI, GU, skin, musculoskeletal), vital signs, pain, weight
2. Medication Administration: Time, dose, route, site, pre/post assessment, patient response, PRN effectiveness
3. Intake & Output: All intake (oral, IV, enteral, parenteral), all output (urine, stool, drains, emesis, wounds), net balance
4. Treatments & Procedures: Wound care, line/tube maintenance, infection control
5. Care Plans: Nursing diagnoses, interventions, patient-specific goals, education
6. Communication: SBAR handoffs, provider notifications, family updates
7. Safety & Risk: Fall risk, restraints, patient refusals, incidents
8. Labs & Results: Specimen details, critical results, provider notifications
9. Narrative Notes: Significant events, condition changes, clarifications

Keep documentation accurate, complete, and audit-ready.`,
    userPromptTemplate: `Convert this clinical dictation into Epic-compliant comprehensive nursing documentation:

{transcript}

Return a complete Epic-standard note with all applicable sections properly formatted and documented per Epic guidelines.`
  },
  
  SOAP: {
    name: 'SOAP',
    displayName: 'SOAP Note',
    description: 'Subjective, Objective, Assessment, Plan',
    sections: ['Subjective', 'Objective', 'Assessment', 'Plan'],
    epicCompliant: true,
    systemPrompt: `You are a clinical documentation assistant. Convert the nurse's dictated notes into a properly formatted SOAP note following Epic standards.

SOAP Format:
- Subjective: Patient's reported symptoms, concerns, and history
- Objective: Measurable observations, vital signs, exam findings
- Assessment: Clinical interpretation and diagnosis
- Plan: Treatment plan, interventions, follow-up

Ensure Epic compliance: Include vital signs, pain assessments, I&O when applicable, safety checks, and complete MAR documentation. Keep medical terminology accurate. Be concise but complete. Maintain professional clinical language.`,
    userPromptTemplate: `Convert this clinical dictation into an Epic-compliant SOAP note format:

{transcript}

Return a properly formatted SOAP note with clear section headers and Epic-required elements.`,
  },

  SBAR: {
    name: 'SBAR',
    displayName: 'SBAR Handoff',
    description: 'Situation, Background, Assessment, Recommendation',
    sections: ['Situation', 'Background', 'Assessment', 'Recommendation'],
    epicCompliant: true,
    systemPrompt: `You are an Epic-compliant clinical documentation assistant. Convert the nurse's dictated notes into a properly formatted SBAR communication note for handoffs.

SBAR Format (Epic Standard):
- Situation: Current patient status and immediate concern (include vital signs, pain level)
- Background: Relevant history, medications, allergies, recent procedures, context
- Assessment: Clinical evaluation and findings (nursing assessment, trends, concerns)
- Recommendation: Suggested actions and interventions (specific orders needed, follow-up required)

EPIC REQUIREMENTS FOR SBAR:
- Used for shift handoffs and critical communications
- Include patient identification, room/bed number
- Document time of handoff and receiving nurse/provider
- Include current vital signs, I&O balance, pain status
- Specify active orders, pending results, critical values
- Note family communication and patient/family concerns
- Be clear, concise, and actionable
- Ensure continuity of care`,
    userPromptTemplate: `Convert this clinical dictation into an Epic-compliant SBAR handoff format:

{transcript}

Return a properly formatted SBAR note with clear section headers and Epic-required handoff elements.`,
  },

  PIE: {
    name: 'PIE',
    displayName: 'PIE Note',
    description: 'Problem, Intervention, Evaluation',
    sections: ['Problem', 'Intervention', 'Evaluation'],
    epicCompliant: true,
    systemPrompt: `You are an Epic-compliant clinical documentation assistant. Convert the nurse's dictated notes into a properly formatted PIE note.

PIE Format (Epic Standard):
- Problem: Identified patient problem or nursing diagnosis (use NANDA-approved diagnoses when applicable)
- Intervention: Nursing actions taken to address the problem (specific, measurable interventions with time)
- Evaluation: Patient's response to interventions and outcomes (measurable results, patient status)

EPIC REQUIREMENTS FOR PIE:
- Link to active nursing diagnoses and care plans
- Include specific interventions with time, dose, route (for medications)
- Document patient education provided
- Note measurable outcomes (vital signs, pain scores, functional status)
- Update flowsheets with quantifiable data
- Document any adverse reactions or complications
- Include patient/family response to teaching
- Focus on nursing process and patient outcomes
- Be specific about interventions and measurable results`,
    userPromptTemplate: `Convert this clinical dictation into an Epic-compliant PIE note format:

{transcript}

Return a properly formatted PIE note with clear section headers and Epic-required care plan elements.`,
  },
};

/**
 * Get template configuration
 */
export function getTemplate(templateName: NoteTemplate): TemplateConfig {
  return TEMPLATES[templateName];
}

/**
 * Format the user prompt with the transcript
 */
export function formatPrompt(template: NoteTemplate, transcript: string): string {
  const config = getTemplate(template);
  return config.userPromptTemplate.replace('{transcript}', transcript);
}

/**
 * All available templates
 */
export function getAllTemplates(): TemplateConfig[] {
  return Object.values(TEMPLATES);
}

/**
 * Get Epic-compliant templates only
 */
export function getEpicCompliantTemplates(): TemplateConfig[] {
  return Object.values(TEMPLATES).filter(t => t.epicCompliant);
}

/**
 * Get unit-specific focus areas
 */
export function getUnitFocus(unitType: UnitType): string[] {
  return EPIC_DOCUMENTATION.Unit_Specific_Focus[unitType];
}

/**
 * Get shift timeline requirements
 */
export function getShiftTimeline(phase: ShiftPhase): string[] {
  return EPIC_DOCUMENTATION.Shift_Timeline[phase];
}

/**
 * Get Epic documentation sections
 */
export function getEpicSections(): typeof EPIC_DOCUMENTATION.Sections {
  return EPIC_DOCUMENTATION.Sections;
}

/**
 * Validate if note meets Epic standards
 */
export function validateEpicCompliance(note: string, template: NoteTemplate): {
  isCompliant: boolean;
  missingElements: string[];
  warnings: string[];
} {
  const missingElements: string[] = [];
  const warnings: string[] = [];
  
  // Check for vital signs
  if (!note.match(/BP|blood pressure|HR|heart rate|RR|respiratory rate|temp|temperature|O2|oxygen/i)) {
    missingElements.push('Vital signs documentation');
  }
  
  // Check for pain assessment
  if (!note.match(/pain|discomfort|pain level|pain score/i)) {
    warnings.push('Pain assessment not documented');
  }
  
  // Check for I&O if applicable
  if (note.match(/intake|output|fluids|IV|urine/i) && !note.match(/\d+\s*(ml|cc|L)/i)) {
    warnings.push('Quantified I&O balance not documented');
  }
  
  // Check for patient safety
  if (!note.match(/safety|fall risk|restraint|alert|oriented/i)) {
    warnings.push('Safety assessment not explicitly documented');
  }
  
  // Template-specific checks
  if (template === 'SBAR') {
    if (!note.match(/situation|background|assessment|recommendation/i)) {
      missingElements.push('SBAR structure incomplete');
    }
  }
  
  return {
    isCompliant: missingElements.length === 0,
    missingElements,
    warnings
  };
}
