/**
 * Clinical note templates and AI prompts
 */

export type NoteTemplate = 'SOAP' | 'SBAR' | 'PIE';

export interface TemplateConfig {
  name: NoteTemplate;
  displayName: string;
  description: string;
  sections: string[];
  systemPrompt: string;
  userPromptTemplate: string;
}

export const TEMPLATES: Record<NoteTemplate, TemplateConfig> = {
  SOAP: {
    name: 'SOAP',
    displayName: 'SOAP Note',
    description: 'Subjective, Objective, Assessment, Plan',
    sections: ['Subjective', 'Objective', 'Assessment', 'Plan'],
    systemPrompt: `You are a clinical documentation assistant. Convert the nurse's dictated notes into a properly formatted SOAP note.

SOAP Format:
- Subjective: Patient's reported symptoms, concerns, and history
- Objective: Measurable observations, vital signs, exam findings
- Assessment: Clinical interpretation and diagnosis
- Plan: Treatment plan, interventions, follow-up

Keep medical terminology accurate. Be concise but complete. Maintain professional clinical language.`,
    userPromptTemplate: `Convert this clinical dictation into a SOAP note format:

{transcript}

Return a properly formatted SOAP note with clear section headers.`,
  },

  SBAR: {
    name: 'SBAR',
    displayName: 'SBAR',
    description: 'Situation, Background, Assessment, Recommendation',
    sections: ['Situation', 'Background', 'Assessment', 'Recommendation'],
    systemPrompt: `You are a clinical documentation assistant. Convert the nurse's dictated notes into a properly formatted SBAR communication note.

SBAR Format:
- Situation: Current patient status and immediate concern
- Background: Relevant history, medications, context
- Assessment: Clinical evaluation and findings
- Recommendation: Suggested actions and interventions

SBAR is used for handoffs and critical communications. Be clear, concise, and actionable.`,
    userPromptTemplate: `Convert this clinical dictation into an SBAR format:

{transcript}

Return a properly formatted SBAR note with clear section headers.`,
  },

  PIE: {
    name: 'PIE',
    displayName: 'PIE Note',
    description: 'Problem, Intervention, Evaluation',
    sections: ['Problem', 'Intervention', 'Evaluation'],
    systemPrompt: `You are a clinical documentation assistant. Convert the nurse's dictated notes into a properly formatted PIE note.

PIE Format:
- Problem: Identified patient problem or nursing diagnosis
- Intervention: Nursing actions taken to address the problem
- Evaluation: Patient's response to interventions and outcomes

Focus on nursing process and patient outcomes. Be specific about interventions and measurable results.`,
    userPromptTemplate: `Convert this clinical dictation into a PIE note format:

{transcript}

Return a properly formatted PIE note with clear section headers.`,
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
