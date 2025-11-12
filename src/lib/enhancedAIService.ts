/**
 * Enhanced AI Service with Knowledge Base Integration
 * Powers intelligent note generation with comprehensive medical knowledge
 */

import { knowledgeBaseService, MedicalTerm, ClinicalGuideline, TemplateGuidance } from './knowledgeBase';
import { EpicTemplateType, ShiftPhase, UnitType } from './epicTemplates';
import { 
  detectShiftPhase, 
  detectUnitType,
  EPIC_TERMINOLOGY,
  getRequiredFieldsForShiftPhase,
  getRequiredFieldsForUnit
} from './epicKnowledgeBase';

export type TemplateType = 'SOAP' | 'SBAR' | 'PIE' | 'DAR' | EpicTemplateType;

export interface NoteGenerationPrompt {
  template: TemplateType;
  input: string;
  context?: {
    patientAge?: number;
    patientGender?: string;
    chiefComplaint?: string;
    medicalHistory?: string[];
    currentMedications?: string[];
    shiftPhase?: ShiftPhase;
    unitType?: UnitType;
  };
}

export interface AIPrompt extends NoteGenerationPrompt {}

export interface ClinicalInsights {
  riskFlags: string[];
  priorityActions: string[];
  documentationGaps: string[];
  qualityScores: {
    completeness: number;
    specificity: number;
    compliance: number;
  };
  summary: string;
}

export interface AIGeneratedNote {
  template: string;
  sections: {
    [key: string]: {
      content: string;
      confidence: number;
      suggestions: string[];
      medicalTerms: string[];
    };
  };
  overallConfidence: number;
  qualityScore: number;
  suggestions: string[];
  icd10Suggestions: {
    suggestions: Array<{
      code: string;
      description: string;
      confidence: number;
      reasoning?: string;
      urgency?: string;
    }>;
    totalFound: number;
  };
  insights: ClinicalInsights;
}

export interface AIAnalysis {
  medicalTerms: MedicalTerm[];
  guidelines: ClinicalGuideline[];
  missingElements: string[];
  recommendations: string[];
  qualityAssessment: {
    completeness: number;
    accuracy: number;
    clarity: number;
    adherence: number;
  };
}

class EnhancedAIService {
  private readonly API_ENDPOINT = '/.netlify/functions/generate-note';

  constructor() {
    console.log('✅ Enhanced AI Service initialized - using secure serverless function');
  }

  /**
   * Generate comprehensive nursing note using knowledge base
   * Enhanced with Epic template support
   */
  public async generateNote(prompt: AIPrompt): Promise<AIGeneratedNote> {
    try {
      // Check if this is an Epic template
      const isEpicTemplate = this.isEpicTemplate(prompt.template);
      
      // Get template guidance from knowledge base (for traditional templates)
      const templateGuidance = !isEpicTemplate 
        ? knowledgeBaseService.getTemplateGuidance(prompt.template as 'SOAP' | 'SBAR' | 'PIE' | 'DAR')
        : null;
      
      // Analyze input for medical terms and clinical context
      const analysis = this.analyzeInput(prompt.input);
      
      // Extract clinical context and reasoning from input
      const clinicalContext = this.extractClinicalContext(prompt.input);
      
      // Build enhanced prompt with knowledge base context and clinical reasoning
      const enhancedPrompt = isEpicTemplate
        ? this.buildEpicEnhancedPrompt(prompt, analysis, clinicalContext)
        : this.buildEnhancedPrompt(prompt, templateGuidance, analysis, clinicalContext);
      
      // Generate note with OpenAI using clinical reasoning
      const response = await this.callOpenAI(enhancedPrompt);
      
      // Process and enhance response with clinical validation
      return this.processAIGeneratedNote(response, prompt.template, analysis, clinicalContext);
      
    } catch (error) {
      console.error('Error generating note:', error);
      return this.generateFallbackNote(prompt);
    }
  }

  /**
   * Extract clinical context and reasoning from input
   */
  private extractClinicalContext(input: string): any {
    const context = {
      urgency: 'routine',
      complexity: 'simple',
      chiefComplaint: '',
      vitalSigns: [],
      symptoms: [],
      assessment: [],
      interventions: [],
      medications: [],
      allergies: [],
      medicalHistory: [],
      socialFactors: [],
      labs: [],
      imaging: [],
      orders: [],
      followUps: [],
      painScore: null as number | null,
      riskLevel: 'low'
    };

    const lowerInput = input.toLowerCase();
    const addUnique = (collection: string[], value?: string | null) => {
      if (value) {
        const trimmed = value.trim();
        if (trimmed.length > 0 && !collection.includes(trimmed)) {
          collection.push(trimmed);
        }
      }
    };

    // Determine urgency level
    if (lowerInput.includes('emergency') || lowerInput.includes('urgent') || lowerInput.includes('acute')) {
      context.urgency = 'urgent';
      context.riskLevel = 'medium';
    } else if (lowerInput.includes('critical') || lowerInput.includes('life-threatening')) {
      context.urgency = 'critical';
      context.riskLevel = 'high';
    }

    // Determine complexity
    if (lowerInput.includes('multiple') || lowerInput.includes('complex') || lowerInput.includes('comorbid')) {
      context.complexity = 'complex';
    }

    // Extract chief complaint
    const chiefComplaintMatch = input.match(/(?:chief complaint|presents with|complains of)[:\s]*([^.]+)/i);
    if (chiefComplaintMatch) {
      context.chiefComplaint = chiefComplaintMatch[1].trim();
    }

    // Extract vital signs
    const vitalPatterns: Array<{ pattern: RegExp; label: string }> = [
      { pattern: /(blood pressure|bp)[:\s]*(\d{2,3}\/\d{2,3})/gi, label: 'Blood Pressure' },
      { pattern: /(heart rate|hr)[:\s]*(\d{2,3})/gi, label: 'Heart Rate' },
      { pattern: /(respiratory rate|rr)[:\s]*(\d{1,2})/gi, label: 'Respiratory Rate' },
      { pattern: /(temperature|temp)[:\s]*(\d+\.?\d*)/gi, label: 'Temperature' },
      { pattern: /(oxygen saturation|spo2)[:\s]*(\d{2,3})/gi, label: 'SpO2' },
      { pattern: /(pain (?:score|level|rated at|is))[:\s]*(\d+\.?\d*)\/10/gi, label: 'Pain Score' }
    ];

    vitalPatterns.forEach(({ pattern, label }) => {
      let match: RegExpExecArray | null;
      while ((match = pattern.exec(input)) !== null) {
        if (label === 'Pain Score') {
          const score = parseFloat(match[2] || match[1]);
          if (!Number.isNaN(score)) {
            context.painScore = score;
            if (score >= 7) {
              context.riskLevel = 'medium';
            }
          }
        } else {
          const value = match[2] || match[1];
          addUnique(context.vitalSigns, `${label}: ${value}`);
        }
      }
    });

    // Extract symptoms
    const symptoms = [
      'pain',
      'fever',
      'nausea',
      'vomiting',
      'diarrhea',
      'constipation',
      'shortness of breath',
      'cough',
      'fatigue',
      'weakness',
      'dizziness',
      'syncope',
      'palpitations',
      'confusion',
      'rash'
    ];
    symptoms.forEach(symptom => {
      if (lowerInput.includes(symptom)) {
        addUnique(context.symptoms, symptom);
        if (['shortness of breath', 'syncope', 'palpitations'].includes(symptom)) {
          context.riskLevel = 'medium';
        }
      }
    });

    // Extract medications
    const medicationPattern = /(?:medications?|drugs?)[:\s]*([^.]+)/i;
    const medicationMatch = input.match(medicationPattern);
    if (medicationMatch) {
      medicationMatch[1]
        .split(',')
        .map(m => m.trim())
        .forEach(med => addUnique(context.medications, med));
    }

    const administeredPattern = /(?:administered|given|started|initiated|titrated|placed)\s([^.;]+)/gi;
    let interventionMatch: RegExpExecArray | null;
    while ((interventionMatch = administeredPattern.exec(input)) !== null) {
      addUnique(context.interventions, interventionMatch[0]);
    }

    const historyPattern = /history of ([^.;]+)/gi;
    let historyMatch: RegExpExecArray | null;
    while ((historyMatch = historyPattern.exec(input)) !== null) {
      historyMatch[1]
        .split(/,|and/)
        .map(h => h.trim())
        .forEach(hist => addUnique(context.medicalHistory, hist));
    }

    const allergyPattern = /allerg(?:y|ies)\s*(?:to|:)\s*([^.;]+)/gi;
    let allergyMatch: RegExpExecArray | null;
    while ((allergyMatch = allergyPattern.exec(input)) !== null) {
      allergyMatch[1]
        .split(/,|and/)
        .map(a => a.trim())
        .forEach(allergy => addUnique(context.allergies, allergy));
    }

    const labPattern = /\b(wbc|hgb|hct|platelets|na|sodium|k\+|potassium|bun|creatinine|lactate|glucose|troponin)\s*[:=]?\s*\d+\.?\d*/gi;
    const labMatches = input.match(labPattern);
    if (labMatches) {
      labMatches.forEach(lab => addUnique(context.labs, lab));
      if (labMatches.some(l => /lactate/i.test(l) || /troponin/i.test(l))) {
        context.riskLevel = 'high';
      }
    }

    const imagingKeywords = ['x-ray', 'ct', 'mri', 'ultrasound', 'echocardiogram', 'cta', 'doppler'];
    imagingKeywords.forEach(modality => {
      if (lowerInput.includes(modality)) {
        addUnique(context.imaging, modality.toUpperCase());
      }
    });

    const orderPattern = /(ordered|request(?:ed)?|scheduled)\s+(?:a|an|for)?\s*([a-z\s-]+)/gi;
    let orderMatch: RegExpExecArray | null;
    while ((orderMatch = orderPattern.exec(lowerInput)) !== null) {
      const order = `${orderMatch[1]} ${orderMatch[2]}`.trim();
      addUnique(context.orders, order);
    }

    const followUpPattern = /(reassess|follow up|monitor|recheck|evaluate)\s([^.;]+)/gi;
    let followUpMatch: RegExpExecArray | null;
    while ((followUpMatch = followUpPattern.exec(input)) !== null) {
      addUnique(context.followUps, `${followUpMatch[1]} ${followUpMatch[2]}`);
    }

    if (lowerInput.includes('oxygen saturation below') || lowerInput.includes('desaturation')) {
      context.riskLevel = 'high';
    }

    if (lowerInput.includes('unstable') || lowerInput.includes('rapid response')) {
      context.riskLevel = 'high';
    }

    if (lowerInput.includes('social') && lowerInput.includes('support')) {
      addUnique(context.socialFactors, 'Needs social support planning');
    }
    if (lowerInput.includes('lives alone') || lowerInput.includes('homeless')) {
      addUnique(context.socialFactors, 'High-risk living situation');
    }

    const assessmentKeywords = ['stable', 'improving', 'deteriorating', 'alert', 'oriented', 'anxious'];
    assessmentKeywords.forEach(word => {
      if (lowerInput.includes(word)) {
        addUnique(context.assessment, word);
      }
    });

    return context;
  }

  /**
   * Analyze input text for medical terms and context
   */
  public analyzeInput(input: string): AIAnalysis {
    const words = input.toLowerCase().split(/\s+/);
    const medicalTerms: MedicalTerm[] = [];
    const guidelines: ClinicalGuideline[] = [];
    const foundTerms = new Set<string>();

    // Find medical terms in input
    words.forEach(word => {
      const cleanWord = word.replace(/[^\w]/g, '');
      if (cleanWord.length > 3) {
        const term = knowledgeBaseService.getMedicalTerm(cleanWord);
        if (term && !foundTerms.has(term.term)) {
          medicalTerms.push(term);
          foundTerms.add(term.term);
        }
      }
    });

    // Find relevant guidelines
    const relevantGuidelines = knowledgeBaseService.getClinicalGuidelines();
    relevantGuidelines.forEach(guideline => {
      if (this.isGuidelineRelevant(guideline, input)) {
        guidelines.push(guideline);
      }
    });

    // Assess quality
    const qualityAssessment = this.assessInputQuality(input, medicalTerms);

    return {
      medicalTerms,
      guidelines,
      missingElements: this.identifyMissingElements(input, medicalTerms),
      recommendations: this.generateRecommendations(medicalTerms, guidelines),
      qualityAssessment
    };
  }

  /**
   * Optimize voice input using knowledge base
   */
  public optimizeVoiceInput(input: string): string {
    return knowledgeBaseService.optimizeVoiceInput(input);
  }

  /**
   * Get ICD-10 suggestions based on content with AI enhancement
   */
  public async getICD10Suggestions(content: string, template: string = 'SOAP', clinicalContext?: any): Promise<{
    suggestions: Array<{
      code: string;
      description: string;
      confidence: number;
      reasoning?: string;
      urgency?: string;
    }>;
    totalFound: number;
  }> {
    try {
      // Import the enhanced ICD-10 service
      const { icd10SuggestionService } = await import('./icd10Suggestions');
      
      // Extract key terms from content for suggestion generation
      const keyTerms = this.extractKeyTermsForICD10(content);
      const allSuggestions: any[] = [];
      
      // Get suggestions for each key term
      for (const term of keyTerms) {
        const termSuggestions = icd10SuggestionService.generateIntelligentSuggestions(
          term,
          template,
          clinicalContext,
          3 // Get top 3 suggestions per term
        );
        allSuggestions.push(...termSuggestions);
      }
      
      // Remove duplicates and sort by confidence
      const uniqueSuggestions = allSuggestions
        .filter((suggestion, index, self) => 
          index === self.findIndex(s => s.code === suggestion.code)
        )
        .sort((a, b) => b.confidence - a.confidence)
        .slice(0, 8); // Return top 8 suggestions
      
      return {
        suggestions: uniqueSuggestions.map(s => ({
          code: s.code,
          description: s.description,
          confidence: s.confidence,
          reasoning: s.reasoning,
          urgency: s.urgency
        })),
        totalFound: uniqueSuggestions.length
      };
      
    } catch (error) {
      console.error('Error generating ICD-10 suggestions:', error);
      
      // Fallback to basic suggestions
      const analysis = this.analyzeInput(content);
      const suggestions: string[] = [];

      analysis.medicalTerms.forEach(term => {
        if (term.icd10) {
          suggestions.push(`${term.icd10} - ${term.term}`);
        }
      });

      return {
        suggestions: suggestions.map(s => ({
          code: s.split(' - ')[0] || '',
          description: s.split(' - ')[1] || s,
          confidence: 0.7,
          reasoning: 'Basic medical term match'
        })),
        totalFound: suggestions.length
      };
    }
  }

  /**
   * Extract key terms from content for ICD-10 suggestion generation
   */
  private extractKeyTermsForICD10(content: string): string[] {
    const terms: string[] = [];
    const lowerContent = content.toLowerCase();
    
    // Common medical terms and symptoms
    const medicalTerms = [
      'chest pain', 'abdominal pain', 'headache', 'fever', 'nausea', 'vomiting',
      'diarrhea', 'constipation', 'shortness of breath', 'cough', 'fatigue',
      'weakness', 'dizziness', 'confusion', 'seizure', 'stroke', 'heart attack',
      'pneumonia', 'infection', 'diabetes', 'hypertension', 'depression', 'anxiety',
      'pain', 'bleeding', 'swelling', 'rash', 'dyspnea', 'syncope', 'syncopal',
      'myocardial infarction', 'copd', 'asthma', 'uti', 'sepsis', 'shock',
      'cardiac arrest', 'respiratory failure', 'kidney failure', 'liver failure',
      'gallstones', 'appendicitis', 'pneumothorax', 'pulmonary embolism'
    ];
    
    // Find matching terms in content
    medicalTerms.forEach(term => {
      if (lowerContent.includes(term.toLowerCase())) {
        terms.push(term);
      }
    });
    
    // Extract individual words that might be symptoms
    const words = content.toLowerCase().split(/\s+/);
    const symptomWords = ['pain', 'ache', 'burning', 'stinging', 'throbbing', 'cramping'];
    symptomWords.forEach(word => {
      if (words.includes(word)) {
        // Find the word in context (e.g., "chest pain")
        const wordIndex = words.indexOf(word);
        if (wordIndex > 0) {
          const contextTerm = `${words[wordIndex - 1]} ${word}`;
          if (!terms.includes(contextTerm)) {
            terms.push(contextTerm);
          }
        }
        if (wordIndex < words.length - 1) {
          const contextTerm = `${word} ${words[wordIndex + 1]}`;
          if (!terms.includes(contextTerm)) {
            terms.push(contextTerm);
          }
        }
      }
    });
    
    return [...new Set(terms)]; // Remove duplicates
  }

  /**
   * Validate note quality and provide feedback
   */
  public validateNote(note: AIGeneratedNote): {
    isValid: boolean;
    score: number;
    feedback: string[];
    improvements: string[];
  } {
    const feedback: string[] = [];
    const improvements: string[] = [];
    let totalScore = 0;
    let sectionCount = 0;

    Object.entries(note.sections).forEach(([sectionName, section]) => {
      sectionCount++;
      totalScore += section.confidence;

      if (section.confidence < 0.7) {
        feedback.push(`${sectionName} section has low confidence`);
        improvements.push(`Review and enhance ${sectionName} content`);
      }

      if (section.medicalTerms.length === 0) {
        feedback.push(`${sectionName} section lacks medical terminology`);
        improvements.push(`Add appropriate medical terms to ${sectionName}`);
      }
    });

    const averageScore = sectionCount > 0 ? totalScore / sectionCount : 0;
    const isValid = averageScore >= 0.8 && feedback.length < 3;

    return {
      isValid,
      score: averageScore,
      feedback,
      improvements
    };
  }

  /**
   * Check if template is an Epic template
   */
  private isEpicTemplate(template: string): boolean {
    const epicTemplates = [
      'shift-assessment', 'mar', 'io', 'wound-care', 'safety-checklist',
      'med-surg', 'icu', 'nicu', 'mother-baby'
    ];
    return epicTemplates.includes(template);
  }

  /**
   * Build enhanced prompt for Epic templates
   */
  private buildEpicEnhancedPrompt(
    prompt: AIPrompt,
    analysis: AIAnalysis,
    clinicalContext: any
  ): string {
    let enhancedPrompt = `Generate a professional Epic EMR ${prompt.template} nursing documentation based on the following input:\n\n`;
    enhancedPrompt += `Input: ${prompt.input}\n\n`;

    // Add Epic-specific context
    const shiftPhase = prompt.context?.shiftPhase || detectShiftPhase(prompt.input);
    const unitType = prompt.context?.unitType || detectUnitType(prompt.input);

    if (shiftPhase) {
      enhancedPrompt += `Shift Phase: ${shiftPhase}\n`;
      const requiredFields = getRequiredFieldsForShiftPhase(shiftPhase);
      enhancedPrompt += `Required Fields: ${requiredFields.join(', ')}\n\n`;
    }

    if (unitType) {
      enhancedPrompt += `Unit Type: ${unitType}\n`;
      const requiredFields = getRequiredFieldsForUnit(unitType);
      enhancedPrompt += `Unit-Specific Requirements: ${requiredFields.join(', ')}\n\n`;
    }

    // Add Epic template-specific guidance
    enhancedPrompt += this.getEpicTemplateGuidance(prompt.template as EpicTemplateType);

    // Add clinical context
    if (clinicalContext) {
      enhancedPrompt += `\nClinical Context Analysis:\n`;
      enhancedPrompt += `- Urgency Level: ${clinicalContext.urgency}\n`;
      enhancedPrompt += `- Complexity: ${clinicalContext.complexity}\n`;
      if (clinicalContext.chiefComplaint) {
        enhancedPrompt += `- Chief Complaint: ${clinicalContext.chiefComplaint}\n`;
      }
      if (clinicalContext.vitalSigns.length > 0) {
        enhancedPrompt += `- Vital Signs: ${clinicalContext.vitalSigns.join(', ')}\n`;
      }
      if (clinicalContext.symptoms.length > 0) {
        enhancedPrompt += `- Identified Symptoms: ${clinicalContext.symptoms.join(', ')}\n`;
      }
      enhancedPrompt += `\n`;
    }

    // Add medical context
    if (analysis.medicalTerms.length > 0) {
      enhancedPrompt += `Identified Medical Terms:\n`;
      analysis.medicalTerms.slice(0, 5).forEach(term => {
        enhancedPrompt += `- ${term.term}: ${term.definition}\n`;
      });
      enhancedPrompt += '\n';
    }

    enhancedPrompt += `Epic Documentation Requirements:\n`;
    enhancedPrompt += `- Follow Epic EMR standards and terminology\n`;
    enhancedPrompt += `- Include all required fields for this template\n`;
    enhancedPrompt += `- Use Epic-standard abbreviations and formats\n`;
    enhancedPrompt += `- Ensure Joint Commission compliance\n`;
    enhancedPrompt += `- Include specific measurements, times, and objective data\n`;
    enhancedPrompt += `- Use professional medical terminology\n`;
    enhancedPrompt += `- Provide actionable nursing interventions\n\n`;
    enhancedPrompt += `Please generate comprehensive, Epic-compliant nursing documentation.`;

    return enhancedPrompt;
  }

  /**
   * Get Epic template-specific guidance
   */
  private getEpicTemplateGuidance(template: EpicTemplateType): string {
    const guidance: { [key in EpicTemplateType]: string } = {
      'shift-assessment': `
You are processing nursing shift assessment input that may be in paragraph or conversational form.

Parse and extract information into this EXACT format:

SHIFT ASSESSMENT

Patient Status: [alert/oriented status]
Neuro: [neurological assessment]
Respiratory: [lung sounds, breathing]
Cardiac: [heart sounds, rhythm]
GI: [abdomen, nausea/vomiting]
GU: [voiding status]
Skin/Wound: [skin condition, wounds, dressings]
Pain: [pain level/10, management]
Interventions: [actions taken]
Plan: [care plan, reassessment timing]

PARSING INSTRUCTIONS:
- Input may be unstructured speech or paragraph form
- Carefully extract relevant clinical data and organize it into correct fields
- Use professional medical terminology
- If specific information not mentioned, write "Not documented"
- Look for vitals, assessments, observations anywhere in the input
`,
      'mar': `
You are processing medication administration input that may be in paragraph or conversational form.

Parse and extract information into this EXACT format:

MEDICATION ADMINISTRATION RECORD (MAR)

Medication: [medication name]
Dose: [amount and route]
Time: [administration time]
Route: [oral/IV/IM/etc]
Response: [patient response]
Follow-Up: [monitoring plan]

PARSING INSTRUCTIONS:
- Input may be unstructured speech or paragraph form
- Extract medication name, dose, time, route from anywhere in the text
- Look for patient response or tolerability
- If specific field not mentioned, write "Not documented"
- Maintain professional documentation standards
`,
      'io': `
You are processing intake and output data that may be in paragraph or conversational form.

Parse and extract information into this EXACT format:

INTAKE & OUTPUT SUMMARY

Oral Intake: [amount] ml
IV Fluids: [amount] ml
Total Intake: [amount] ml
Urine Output: [amount] ml
Stool/Other Output: [amount or "None"]
Net Balance: [+/- amount] ml
Notes: [observations]

PARSING INSTRUCTIONS:
- Input may be unstructured speech or paragraph form
- Extract all intake values (oral, IV, etc) from text
- Extract all output values (urine, stool, etc) from text
- Calculate Total Intake and Net Balance automatically
- Use ml as the standard unit
- If amounts not mentioned, write "Not documented"
`,
      'wound-care': `
You are processing wound care documentation that may be in paragraph or conversational form.

Parse and extract information into this EXACT format:

WOUND CARE DOCUMENTATION

Location: [body location]
Dressing: [dressing type, condition]
Drainage: [type and amount]
Odor: [present/none]
Edges: [approximated/gaping/etc]
Pain: [level/10]
Response: [patient tolerance]
Plan: [next assessment, care plan]

PARSING INSTRUCTIONS:
- Input may be unstructured speech or paragraph form
- Extract wound location, dressing details, drainage characteristics
- Look for pain level, odor, edge condition anywhere in text
- Use professional wound care terminology
- If information not mentioned, write "Not documented"
`,
      'safety-checklist': `
You are processing safety checklist information that may be in paragraph or conversational form.

Parse and extract information into this EXACT format:

SAFETY CHECKLIST

Bed Position: [lowest/raised]
Call Light: [within reach/not accessible]
Side Rails: [up/down]
Non-Slip Socks: [applied/not applied]
Bed Alarm: [activated/not activated]
Fall Risk: [low/moderate/high]
Comments: [additional safety notes]

PARSING INSTRUCTIONS:
- Input may be unstructured speech or paragraph form
- Identify all safety measures mentioned
- Extract fall risk information if present
- Look for bed position, alarms, socks, rails anywhere in text
- If measure not mentioned, write "Not documented"
`,
      'med-surg': `
You are processing med-surg unit documentation that may be in paragraph or conversational form.

Parse and extract information into this EXACT format:

MED-SURG UNIT PROGRESS NOTE

Post-Op Status: [surgical procedure if applicable]
Temp: [temperature or "Afebrile"]
Mobility: [ambulation status]
Diet: [diet tolerance]
Pain: [level/10]
Interventions: [nursing actions]
Plan: [care plan]

PARSING INSTRUCTIONS:
- Input may be unstructured speech or paragraph form
- Extract post-operative status, temperature, mobility level
- Look for diet tolerance, pain level, interventions anywhere
- Use professional medical terminology
- If information not mentioned, write "Not documented"
`,
      'icu': `
You are processing ICU documentation that may be in paragraph or conversational form.

Parse and extract information into this EXACT format:

ICU DAILY NOTE

Ventilation: [settings or "Not ventilated"]
Sedation: [medication and level]
Cardiac: [rhythm and status]
Neuro: [assessment]
Output: [fluid status]
Plan: [care plan]

PARSING INSTRUCTIONS:
- Input may be unstructured speech or paragraph form
- Extract ventilator settings, FiO2, PEEP if mentioned
- Look for sedation medications and levels
- Extract cardiac rhythm, neuro assessment, fluid output
- Use critical care terminology
- If information not mentioned, write "Not documented"
`,
      'nicu': `
You are processing NICU documentation that may be in paragraph or conversational form.

Parse and extract information into this EXACT format:

NICU PROGRESS NOTE

Gestational Age: [weeks]
Temp Control: [isolette/warmer, temperature]
Feeding: [amount and type]
Oxygen: [saturation and support]
Activity: [activity level]
Plan: [care plan]

PARSING INSTRUCTIONS:
- Input may be unstructured speech or paragraph form
- Extract gestational age, temperature control method
- Look for feeding amount, type, frequency
- Extract oxygen saturation and support type
- Use neonatal care terminology
- If information not mentioned, write "Not documented"
`,
      'mother-baby': `
You are processing mother-baby unit documentation that may be in paragraph or conversational form.

Parse and extract information into this EXACT format:

MOTHER-BABY UNIT NOTE

Mother: [mobility, breastfeeding status]
Lochia: [amount and type]
Pain: [level/10]
Baby: [feeding, elimination status]
Bonding: [bonding observations]
Plan: [care plan]

PARSING INSTRUCTIONS:
- Input may be unstructured speech or paragraph form
- Extract maternal mobility, breastfeeding status
- Look for lochia description, pain level
- Extract newborn feeding, elimination patterns
- Note bonding observations
- If information not mentioned, write "Not documented"
`
    };

    return guidance[template] || '';
  }

  // Private helper methods
  private buildEnhancedPrompt(
    prompt: AIPrompt, 
    templateGuidance: TemplateGuidance | null, 
    analysis: AIAnalysis,
    clinicalContext: any
  ): string {
    let enhancedPrompt = `Generate a professional ${prompt.template} nursing note based on the following input:\n\n`;
    enhancedPrompt += `Input: ${prompt.input}\n\n`;

    // Add clinical context and reasoning
    if (clinicalContext) {
      enhancedPrompt += `Clinical Context Analysis:\n`;
      enhancedPrompt += `- Urgency Level: ${clinicalContext.urgency}\n`;
      enhancedPrompt += `- Complexity: ${clinicalContext.complexity}\n`;
      if (clinicalContext.chiefComplaint) {
        enhancedPrompt += `- Chief Complaint: ${clinicalContext.chiefComplaint}\n`;
      }
      if (clinicalContext.vitalSigns.length > 0) {
        enhancedPrompt += `- Vital Signs: ${clinicalContext.vitalSigns.join(', ')}\n`;
      }
      if (clinicalContext.symptoms.length > 0) {
        enhancedPrompt += `- Identified Symptoms: ${clinicalContext.symptoms.join(', ')}\n`;
      }
      if (clinicalContext.medications.length > 0) {
        enhancedPrompt += `- Medications: ${clinicalContext.medications.join(', ')}\n`;
      }
      enhancedPrompt += `\n`;
    }

    // Add template guidance
    if (templateGuidance) {
      enhancedPrompt += `Template Guidance for ${prompt.template}:\n`;
      Object.entries(templateGuidance.sections).forEach(([section, guidance]) => {
        enhancedPrompt += `${section}: ${guidance.description}\n`;
        enhancedPrompt += `Key Elements: ${guidance.keyElements.join(', ')}\n`;
        enhancedPrompt += `Common Phrases: ${guidance.commonPhrases.join(', ')}\n\n`;
      });
    }

    // Add medical context
    if (analysis.medicalTerms.length > 0) {
      enhancedPrompt += `Identified Medical Terms:\n`;
      analysis.medicalTerms.forEach(term => {
        enhancedPrompt += `- ${term.term}: ${term.definition}\n`;
        if (term.icd10) {
          enhancedPrompt += `  ICD-10: ${term.icd10}\n`;
        }
        if (term.nursingImplications) {
          enhancedPrompt += `  Nursing Implications: ${term.nursingImplications.join(', ')}\n`;
        }
      });
      enhancedPrompt += '\n';
    }

    // Add clinical guidelines
    if (analysis.guidelines.length > 0) {
      enhancedPrompt += `Relevant Clinical Guidelines:\n`;
      analysis.guidelines.forEach(guideline => {
        enhancedPrompt += `- ${guideline.title}: ${guideline.description}\n`;
        enhancedPrompt += `  Guidelines: ${guideline.guidelines.join(', ')}\n`;
      });
      enhancedPrompt += '\n';
    }

    // Add context if available
    if (prompt.context) {
      enhancedPrompt += `Patient Context:\n`;
      if (prompt.context.patientAge) enhancedPrompt += `Age: ${prompt.context.patientAge}\n`;
      if (prompt.context.patientGender) enhancedPrompt += `Gender: ${prompt.context.patientGender}\n`;
      if (prompt.context.chiefComplaint) enhancedPrompt += `Chief Complaint: ${prompt.context.chiefComplaint}\n`;
      if (prompt.context.medicalHistory?.length) {
        enhancedPrompt += `Medical History: ${prompt.context.medicalHistory.join(', ')}\n`;
      }
      if (prompt.context.currentMedications?.length) {
        enhancedPrompt += `Current Medications: ${prompt.context.currentMedications.join(', ')}\n`;
      }
      enhancedPrompt += '\n';
    }

    // Add template-specific format instructions
    if (prompt.template === 'SOAP') {
      enhancedPrompt += `\nYou are processing nursing input that may be in paragraph or conversational form.\n\n`;
      enhancedPrompt += `Parse and extract information into this EXACT format:\n\n`;
      enhancedPrompt += `Subjective: [patient's reported symptoms, concerns, and history]\n`;
      enhancedPrompt += `Objective: [measurable observations, vital signs, exam findings]\n`;
      enhancedPrompt += `Assessment: [clinical interpretation and diagnosis]\n`;
      enhancedPrompt += `Plan: [treatment plan, interventions, follow-up]\n\n`;
    } else if (prompt.template === 'SBAR') {
      enhancedPrompt += `\nYou are processing nursing handoff input that may be in paragraph or conversational form.\n\n`;
      enhancedPrompt += `Parse and extract information into this EXACT format:\n\n`;
      enhancedPrompt += `Situation: [current patient status and immediate concern]\n`;
      enhancedPrompt += `Background: [relevant history, medications, allergies, context]\n`;
      enhancedPrompt += `Assessment: [clinical evaluation and findings]\n`;
      enhancedPrompt += `Recommendation: [suggested actions and interventions]\n\n`;
    } else if (prompt.template === 'PIE') {
      enhancedPrompt += `\nYou are processing nursing documentation that may be in paragraph or conversational form.\n\n`;
      enhancedPrompt += `Parse and extract information into this EXACT format:\n\n`;
      enhancedPrompt += `Problem: [identified patient problem or nursing diagnosis]\n`;
      enhancedPrompt += `Intervention: [nursing actions taken with times]\n`;
      enhancedPrompt += `Evaluation: [patient's response and outcomes]\n\n`;
    } else if (prompt.template === 'DAR') {
      enhancedPrompt += `\nYou are processing nursing documentation that may be in paragraph or conversational form.\n\n`;
      enhancedPrompt += `Parse and extract information into this EXACT format:\n\n`;
      enhancedPrompt += `Data: [assessment data collected]\n`;
      enhancedPrompt += `Action: [nursing actions/interventions executed]\n`;
      enhancedPrompt += `Response: [patient response and effectiveness]\n\n`;
    }

    enhancedPrompt += `PARSING REQUIREMENTS:\n`;
    enhancedPrompt += `- Input may be unstructured speech or paragraph form\n`;
    enhancedPrompt += `- Carefully extract relevant clinical data from anywhere in the text\n`;
    enhancedPrompt += `- Use professional medical terminology\n`;
    enhancedPrompt += `- Follow the EXACT format shown above\n`;
    enhancedPrompt += `- Ensure HIPAA compliance\n`;
    enhancedPrompt += `- Include specific measurements and times when mentioned\n`;
    enhancedPrompt += `- Use objective language where appropriate\n`;
    enhancedPrompt += `- Provide actionable nursing interventions\n`;
    enhancedPrompt += `- If information not mentioned, leave that section concise or note "not documented" within the section\n\n`;
    enhancedPrompt += `Please generate a comprehensive, professional nursing note following the exact format above.`;

    return enhancedPrompt;
  }

  private async callOpenAI(prompt: string): Promise<string> {
    try {
      const response = await fetch(this.API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`API error: ${response.status} ${response.statusText} - ${errorData.error || errorData.message || 'Unknown error'}`);
      }

      const data = await response.json();
      return data.content;
    } catch (error) {
      console.error('Error calling serverless function:', error);
      throw error;
    }
  }

  private async processAIGeneratedNote(
    response: string, 
    template: string, 
    analysis: AIAnalysis,
    clinicalContext: any
  ): Promise<AIGeneratedNote> {
    // Parse response into sections
    const sections = this.parseNoteSections(response, template);
    
    // Calculate confidence scores
    const processedSections: AIGeneratedNote['sections'] = {};
    let totalConfidence = 0;
    let sectionCount = 0;

    Object.entries(sections).forEach(([sectionName, content]) => {
      const medicalTerms = this.extractMedicalTerms(content);
      const confidence = this.calculateSectionConfidence(content, medicalTerms, analysis, clinicalContext);
      
      processedSections[sectionName] = {
        content,
        confidence,
        suggestions: this.generateSectionSuggestions(content, sectionName),
        medicalTerms
      };
      
      totalConfidence += confidence;
      sectionCount++;
    });

    const overallConfidence = sectionCount > 0 ? totalConfidence / sectionCount : 0;
    const qualityScore = this.calculateQualityScore(processedSections, analysis);
    const insights = this.generateClinicalInsights(processedSections, analysis, clinicalContext, template);

    return {
      template,
      sections: processedSections,
      overallConfidence,
      qualityScore,
      suggestions: this.generateOverallSuggestions(processedSections, analysis, clinicalContext),
      icd10Suggestions: await this.getICD10Suggestions(response, template, clinicalContext),
      insights
    };
  }

  private generateClinicalInsights(
    sections: AIGeneratedNote['sections'],
    analysis: AIAnalysis,
    clinicalContext: any,
    template: string
  ): ClinicalInsights {
    const riskFlags = new Set<string>();
    const priorityActions = new Set<string>();
    const documentationGaps = new Set<string>(analysis?.missingElements || []);

    const sectionEntries = Object.entries(sections);
    const flattenedContent = sectionEntries
      .map(([, section]) => typeof section.content === 'string' ? section.content.toLowerCase() : '')
      .join('\n');

    const totalSections = sectionEntries.length;
    const filledSections = sectionEntries.filter(([, section]) => section.content && section.content.trim().length > 40).length;
    const totalMedicalTerms = analysis?.medicalTerms?.length || 0;

    const qualityScores = {
      completeness: totalSections > 0 ? filledSections / totalSections : 0,
      specificity: totalSections > 0 ? Math.min(1, totalMedicalTerms / Math.max(totalSections * 2, 6)) : 0.5,
      compliance: analysis?.qualityAssessment?.adherence ?? 0.7
    };

    const highRiskPatterns: Array<{ pattern: RegExp; message: string }> = [
      { pattern: /sepsis|septic shock|lactate/i, message: 'Potential sepsis indicators present' },
      { pattern: /stroke|cva|hemiparesis/i, message: 'Neurologic emergency language detected' },
      { pattern: /chest pain|stemi|myocardial infarction|mi\b/i, message: 'Acute coronary syndrome suspected' },
      { pattern: /respiratory distress|intubated|ventilator/i, message: 'Airway or ventilator management required' },
      { pattern: /fall risk|unsteady gait|confusion/i, message: 'High fall risk noted - ensure precautions' },
      { pattern: /suicidal|self-harm|ideation/i, message: 'Behavioral health crisis indicators found' },
      { pattern: /hypotension|bp\s*\d{2}\/\d{2}/i, message: 'Hypotension documented - monitor perfusion' }
    ];

    highRiskPatterns.forEach(({ pattern, message }) => {
      if (pattern.test(flattenedContent)) {
        riskFlags.add(message);
      }
    });

    if (clinicalContext) {
      if (clinicalContext.urgency === 'critical') {
        riskFlags.add('Dictation marked as critical urgency');
      } else if (clinicalContext.urgency === 'urgent') {
        riskFlags.add('Urgent clinical context detected');
      }

      if (clinicalContext.riskLevel === 'high') {
        riskFlags.add('Overall risk level evaluated as high');
      }

      if (typeof clinicalContext.painScore === 'number' && clinicalContext.painScore >= 7) {
        riskFlags.add(`High pain score reported (${clinicalContext.painScore}/10)`);
      }

      if (clinicalContext.vitalSigns?.length === 0) {
        documentationGaps.add('Vital signs not documented');
      }

      if (clinicalContext.symptoms?.includes('shortness of breath') && !flattenedContent.includes('oxygen')) {
        priorityActions.add('Document oxygen therapy and respiratory support');
      }
    }

    if (analysis?.qualityAssessment?.completeness < 0.7) {
      documentationGaps.add('Narrative may be incomplete');
    }

    if ((analysis?.guidelines?.length || 0) === 0) {
      documentationGaps.add('No guideline references detected');
    }

    if ((analysis?.medicalTerms?.length || 0) < 3) {
      documentationGaps.add('Limited clinical terminology detected');
    }

    if (riskFlags.size > 0) {
      priorityActions.add('Escalate or document mitigation for risk alerts');
    }

    if (documentationGaps.size > 0) {
      priorityActions.add('Fill documentation gaps highlighted by AI');
    }

    if ((analysis?.recommendations?.length || 0) > 0) {
      analysis.recommendations.slice(0, 2).forEach(rec => priorityActions.add(rec));
    }

    if (template && this.isEpicTemplate(template)) {
      priorityActions.add('Verify Epic required fields before signing');
    }

    const summaryParts: string[] = [
      `Completeness ${(qualityScores.completeness * 100).toFixed(0)}%`,
      `Specificity ${(qualityScores.specificity * 100).toFixed(0)}%`,
      `Compliance ${(qualityScores.compliance * 100).toFixed(0)}%`
    ];

    if (riskFlags.size > 0) {
      summaryParts.push(`${riskFlags.size} risk alert${riskFlags.size > 1 ? 's' : ''}`);
    }

    if (priorityActions.size > 0) {
      summaryParts.push(`${priorityActions.size} action item${priorityActions.size > 1 ? 's' : ''}`);
    }

    return {
      riskFlags: Array.from(riskFlags),
      priorityActions: Array.from(priorityActions),
      documentationGaps: Array.from(documentationGaps),
      qualityScores,
      summary: summaryParts.join(' • ')
    };
  }

  private parseNoteSections(content: string, template: string): { [key: string]: string } {
    const sections: { [key: string]: string } = {};
    
    // Define section headers for each template
    const sectionHeaders: { [key: string]: string[] } = {
      'SOAP': ['Subjective', 'Objective', 'Assessment', 'Plan'],
      'SBAR': ['Situation', 'Background', 'Assessment', 'Recommendation'],
      'PIE': ['Problem', 'Intervention', 'Evaluation'],
      'DAR': ['Data', 'Action', 'Response'],
      'shift-assessment': ['Patient Assessment', 'Vital Signs', 'Medications', 'Intake & Output', 'Treatments', 'Communication', 'Safety', 'Narrative'],
      'mar': ['Medication Information', 'Administration Details', 'Assessment', 'Response'],
      'io': ['Intake', 'Output', 'Balance', 'Notes'],
      'wound-care': ['Location & Stage', 'Size & Drainage', 'Wound Bed', 'Interventions', 'Response'],
      'safety-checklist': ['Fall Risk', 'Restraints', 'Isolation', 'Patient ID', 'Code Status'],
      'med-surg': ['Patient Education', 'Discharge Readiness', 'Pain Management', 'Mobility'],
      'icu': ['Hemodynamics', 'Ventilator', 'Devices', 'Drips', 'Sedation'],
      'nicu': ['Thermoregulation', 'Feeding', 'Bonding', 'Weight', 'Development'],
      'mother-baby': ['Maternal Assessment', 'Newborn Assessment', 'Feeding', 'Education']
    };

    const headers = sectionHeaders[template] || [];
    
    // Try to parse sections from AI response
    headers.forEach(header => {
      // Try multiple patterns to match section headers
      const patterns = [
        new RegExp(`${header}:\\s*([\\s\\S]*?)(?=${headers.map(h => h.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')}:|$)`, 'i'),
        new RegExp(`\\*\\*${header}\\*\\*:?\\s*([\\s\\S]*?)(?=\\*\\*(?:${headers.map(h => h.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})|$)`, 'i'),
        new RegExp(`##\\s*${header}\\s*([\\s\\S]*?)(?=##\\s*(?:${headers.map(h => h.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})|$)`, 'i')
      ];
      
      for (const pattern of patterns) {
        const match = content.match(pattern);
        if (match && match[1] && match[1].trim()) {
          sections[header] = match[1].trim();
          break;
        }
      }
    });

    // If no sections were parsed, create default sections with the content
    if (Object.keys(sections).length === 0 && headers.length > 0) {
      console.warn(`Failed to parse sections for template ${template}. Creating default sections.`);
      
      // Split content into roughly equal parts for each section
      const contentParts = content.split('\n\n').filter(p => p.trim());
      const partsPerSection = Math.max(1, Math.floor(contentParts.length / headers.length));
      
      headers.forEach((header, index) => {
        const startIdx = index * partsPerSection;
        const endIdx = index === headers.length - 1 ? contentParts.length : (index + 1) * partsPerSection;
        const sectionContent = contentParts.slice(startIdx, endIdx).join('\n\n');
        
        if (sectionContent.trim()) {
          sections[header] = sectionContent.trim();
        } else {
          // Provide a meaningful default based on the section name
          sections[header] = this.getDefaultSectionContent(header, content);
        }
      });
    }

    return sections;
  }

  /**
   * Get default content for a section when parsing fails
   */
  private getDefaultSectionContent(sectionName: string, fullContent: string): string {
    const defaults: { [key: string]: string } = {
      'Subjective': 'Patient reports: ' + fullContent.substring(0, 150),
      'Objective': 'Vital signs stable. Patient alert and oriented.',
      'Assessment': 'Patient condition stable. No acute distress noted.',
      'Plan': 'Continue current care plan. Monitor for changes. Patient education provided.',
      'Situation': 'Patient presents with: ' + fullContent.substring(0, 100),
      'Background': 'Patient history reviewed. Current medications noted.',
      'Recommendation': 'Continue monitoring. Maintain current treatment plan.',
      'Problem': 'Identified issue: ' + fullContent.substring(0, 100),
      'Intervention': 'Appropriate nursing interventions implemented.',
      'Evaluation': 'Patient responded well to interventions. Condition stable.',
      'Data': 'Assessment data: ' + fullContent.substring(0, 100),
      'Action': 'Nursing actions taken as per protocol.',
      'Response': 'Patient response positive. No adverse effects noted.'
    };
    
    return defaults[sectionName] || `${sectionName}: Documentation in progress. Please review and complete.`;
  }

  private extractMedicalTerms(content: string): string[] {
    const terms: string[] = [];
    const words = content.toLowerCase().split(/\s+/);
    
    words.forEach(word => {
      const cleanWord = word.replace(/[^\w]/g, '');
      if (cleanWord.length > 3) {
        const term = knowledgeBaseService.getMedicalTerm(cleanWord);
        if (term) {
          terms.push(term.term);
        }
      }
    });

    return [...new Set(terms)];
  }

  private calculateSectionConfidence(
    content: string, 
    medicalTerms: string[], 
    analysis: AIAnalysis,
    clinicalContext: any
  ): number {
    let confidence = 0.5; // Base confidence
    
    // Increase confidence for medical terminology
    confidence += Math.min(medicalTerms.length * 0.1, 0.3);
    
    // Increase confidence for proper length
    if (content.length > 50) confidence += 0.1;
    if (content.length > 100) confidence += 0.1;
    
    // Increase confidence for professional language
    if (content.includes('patient') || content.includes('assessment')) confidence += 0.1;
    
    // Adjust confidence based on clinical context
    if (clinicalContext) {
      // Higher confidence for urgent cases (more detailed input)
      if (clinicalContext.urgency === 'urgent' || clinicalContext.urgency === 'critical') {
        confidence += 0.05;
      }
      
      // Higher confidence when vital signs are present
      if (clinicalContext.vitalSigns && clinicalContext.vitalSigns.length > 0) {
        confidence += 0.05;
      }
      
      // Higher confidence when symptoms are identified
      if (clinicalContext.symptoms && clinicalContext.symptoms.length > 0) {
        confidence += 0.05;
      }
    }
    
    return Math.min(confidence, 1.0);
  }

  private calculateQualityScore(
    sections: AIGeneratedNote['sections'], 
    analysis: AIAnalysis
  ): number {
    const completeness = Object.keys(sections).length / 4; // Assuming 4 sections
    const accuracy = analysis.qualityAssessment.accuracy;
    const clarity = analysis.qualityAssessment.clarity;
    const adherence = analysis.qualityAssessment.adherence;
    
    return (completeness + accuracy + clarity + adherence) / 4;
  }

  private generateSectionSuggestions(content: string, sectionName: string): string[] {
    const suggestions: string[] = [];
    
    if (content.length < 30) {
      suggestions.push(`Add more detail to ${sectionName} section`);
    }
    
    if (!content.match(/\d+/)) {
      suggestions.push(`Include specific measurements in ${sectionName}`);
    }
    
    if (!content.includes('patient') && !content.includes('pt')) {
      suggestions.push(`Reference patient appropriately in ${sectionName}`);
    }
    
    return suggestions;
  }

  private generateOverallSuggestions(
    sections: AIGeneratedNote['sections'], 
    analysis: AIAnalysis,
    clinicalContext?: any
  ): string[] {
    const suggestions: string[] = [];
    
    if (analysis.missingElements.length > 0) {
      suggestions.push(`Consider adding: ${analysis.missingElements.join(', ')}`);
    }
    
    if (analysis.recommendations.length > 0) {
      suggestions.push(...analysis.recommendations);
    }

    if (analysis.qualityAssessment.completeness < 0.75) {
      suggestions.push('Expand narrative for greater completeness and clarity');
    }

    if (analysis.qualityAssessment.clarity < 0.75) {
      suggestions.push('Use complete sentences and structured bullet points for readability');
    }

    if (clinicalContext?.riskLevel === 'high' || clinicalContext?.urgency === 'critical') {
      suggestions.push('Document escalation steps and provider notifications for high-risk findings');
    }

    if (typeof clinicalContext?.painScore === 'number' && clinicalContext.painScore >= 7) {
      suggestions.push('Reassess pain and document post-intervention relief');
    }
    
    return suggestions;
  }

  private async generateFallbackNote(prompt: NoteGenerationPrompt): Promise<AIGeneratedNote> {
    const analysis = this.analyzeInput(prompt.input);
    const fallbackContext = this.extractClinicalContext(prompt.input);
    let sections: AIGeneratedNote['sections'] = {};

    // Create proper sections based on template
    if (prompt.template === 'SOAP') {
      sections['subjective'] = {
        content: `Subjective: ${prompt.input}`,
        confidence: 0.6,
        suggestions: ['Add more detail about patient reported symptoms and concerns'],
        medicalTerms: analysis.medicalTerms.map(t => t.term)
      };
      sections['objective'] = {
        content: 'Objective: Vital signs stable. Patient alert and oriented x3. Physical examination findings normal.',
        confidence: 0.6,
        suggestions: ['Add specific vital signs and examination findings'],
        medicalTerms: []
      };
      sections['assessment'] = {
        content: 'Assessment: Patient condition stable. No acute distress noted at this time.',
        confidence: 0.6,
        suggestions: ['Add clinical assessment and differential diagnoses'],
        medicalTerms: []
      };
      sections['plan'] = {
        content: 'Plan: Continue current care plan. Monitor patient status. Reassess as needed.',
        confidence: 0.6,
        suggestions: ['Add specific interventions and follow-up plan'],
        medicalTerms: []
      };
    } else if (prompt.template === 'SBAR') {
      sections['situation'] = {
        content: `Situation: ${prompt.input}`,
        confidence: 0.6,
        suggestions: ['Add more detail about immediate patient concern'],
        medicalTerms: analysis.medicalTerms.map(t => t.term)
      };
      sections['background'] = {
        content: 'Background: Patient history reviewed. Current medications and allergies noted.',
        confidence: 0.6,
        suggestions: ['Add relevant medical history and context'],
        medicalTerms: []
      };
      sections['assessment'] = {
        content: 'Assessment: Patient stable. Vital signs within normal limits.',
        confidence: 0.6,
        suggestions: ['Add clinical evaluation and findings'],
        medicalTerms: []
      };
      sections['recommendation'] = {
        content: 'Recommendation: Continue monitoring. Maintain current treatment plan.',
        confidence: 0.6,
        suggestions: ['Add specific recommendations for care'],
        medicalTerms: []
      };
    } else if (prompt.template === 'PIE') {
      sections['problem'] = {
        content: `Problem: ${prompt.input}`,
        confidence: 0.6,
        suggestions: ['Clarify the nursing diagnosis or patient problem'],
        medicalTerms: analysis.medicalTerms.map(t => t.term)
      };
      sections['intervention'] = {
        content: 'Intervention: Appropriate nursing interventions implemented per protocol.',
        confidence: 0.6,
        suggestions: ['Add specific interventions performed with times'],
        medicalTerms: []
      };
      sections['evaluation'] = {
        content: 'Evaluation: Patient responded appropriately to interventions. Condition stable.',
        confidence: 0.6,
        suggestions: ['Add evaluation of intervention effectiveness'],
        medicalTerms: []
      };
    } else if (prompt.template === 'DAR') {
      sections['data'] = {
        content: `Data: ${prompt.input}`,
        confidence: 0.6,
        suggestions: ['Add more assessment data collected'],
        medicalTerms: analysis.medicalTerms.map(t => t.term)
      };
      sections['action'] = {
        content: 'Action: Nursing actions taken as per established protocol.',
        confidence: 0.6,
        suggestions: ['Add specific actions taken'],
        medicalTerms: []
      };
      sections['response'] = {
        content: 'Response: Patient response positive. No adverse effects noted.',
        confidence: 0.6,
        suggestions: ['Add patient response details'],
        medicalTerms: []
      };
    } else if (this.isEpicTemplate(prompt.template)) {
      // Handle Epic templates
      sections = this.generateEpicFallbackSections(prompt.template, prompt.input, analysis);
    } else {
      // Default fallback for unknown templates
      sections['generated'] = {
        content: `Note generated from: ${prompt.input}`,
        confidence: 0.6,
        suggestions: ['Review and edit for accuracy'],
        medicalTerms: analysis.medicalTerms.map(t => t.term)
      };
    }

    const insights = this.generateClinicalInsights(sections, analysis, fallbackContext, prompt.template);
    const overallSuggestions = this.generateOverallSuggestions(sections, analysis, fallbackContext);
    if (!overallSuggestions.find(s => s.includes('AI service temporarily unavailable'))) {
      overallSuggestions.unshift('AI service temporarily unavailable - please review and enhance generated content');
    }

    return {
      template: prompt.template,
      sections,
      overallConfidence: 0.6,
      qualityScore: 0.6,
      suggestions: overallSuggestions,
      icd10Suggestions: await this.getICD10Suggestions(prompt.input, prompt.template, fallbackContext),
      insights
    };
  }

  private generateEpicFallbackSections(template: string, input: string, analysis: AIAnalysis): AIGeneratedNote['sections'] {
    const sections: AIGeneratedNote['sections'] = {};
    const terms = analysis.medicalTerms.map(t => t.term);
    const lowerInput = input.toLowerCase();

    if (template === 'shift-assessment') {
      sections['shift-assessment-note'] = {
        content: this.parseShiftAssessment(input, lowerInput),
        confidence: 0.7,
        suggestions: ['Review and enhance assessment details as needed'],
        medicalTerms: terms
      };
    } else if (template === 'mar') {
      sections['medication-administration-record'] = {
        content: this.parseMedicationAdministration(input, lowerInput),
        confidence: 0.7,
        suggestions: ['Verify medication details and patient response'],
        medicalTerms: terms
      };
    } else if (template === 'io') {
      sections['intake-output-summary'] = {
        content: this.parseIntakeOutput(input, lowerInput),
        confidence: 0.7,
        suggestions: ['Verify calculations and measurements'],
        medicalTerms: []
      };
    } else if (template === 'wound-care') {
      sections['wound-care-documentation'] = {
        content: this.parseWoundCare(input, lowerInput),
        confidence: 0.7,
        suggestions: ['Review wound characteristics and care plan'],
        medicalTerms: terms
      };
    } else if (template === 'safety-checklist') {
      sections['safety-checklist'] = {
        content: this.parseSafetyChecklist(input, lowerInput),
        confidence: 0.7,
        suggestions: ['Verify all safety measures are documented'],
        medicalTerms: terms
      };
    } else if (template === 'med-surg') {
      sections['med-surg-progress-note'] = {
        content: this.parseMedSurg(input, lowerInput),
        confidence: 0.7,
        suggestions: ['Add additional post-op details as needed'],
        medicalTerms: terms
      };
    } else if (template === 'icu') {
      sections['icu-daily-note'] = {
        content: this.parseICU(input, lowerInput),
        confidence: 0.7,
        suggestions: ['Verify critical care parameters'],
        medicalTerms: terms
      };
    } else if (template === 'nicu') {
      sections['nicu-progress-note'] = {
        content: this.parseNICU(input, lowerInput),
        confidence: 0.7,
        suggestions: ['Add gestational age and weight if available'],
        medicalTerms: terms
      };
    } else if (template === 'mother-baby') {
      sections['mother-baby-note'] = {
        content: this.parseMotherBaby(input, lowerInput),
        confidence: 0.7,
        suggestions: ['Ensure both maternal and newborn assessments documented'],
        medicalTerms: terms
      };
    }

    return sections;
  }

  private parseWoundCare(input: string, lowerInput: string): string {
    // Extract location
    let location = 'Not documented';
    const locationPatterns = [
      /(right|left|bilateral)\s+(leg|arm|foot|hand|thigh|calf|forearm|shoulder|hip|ankle|wrist|knee|elbow|heel|back|chest|abdomen|buttock)/gi,
      /on\s+(?:the\s+)?(right|left|bilateral)\s+(\w+)/gi,
      /(\w+)\s+wound/gi,
      /located\s+(?:on|at|in)\s+(?:the\s+)?([^,.]+)/gi,
      /(mid|lower|upper|lateral|medial)\s+(\w+)/gi
    ];

    for (const pattern of locationPatterns) {
      const match = input.match(pattern);
      if (match && match[0].length > 3) {
        location = match[0].charAt(0).toUpperCase() + match[0].slice(1);
        // Clean up common phrases
        location = location.replace(/wound$/i, '').replace(/^on the /i, '').replace(/^located /i, '').trim();
        break;
      }
    }

    // Extract measurements
    let measurements = 'Not documented';
    const measurementPattern = /(\d+(?:\.\d+)?)\s*(?:cm|centimeter|centimeters|millimeter|millimeters|mm)(?:\s+(?:by|x|long|length))?(?:\s+(?:and|by|x)\s+)?(\d+(?:\.\d+)?)?(?:\s*(?:cm|centimeter|centimeters|millimeter|millimeters|mm))?/gi;
    const measureMatch = input.match(measurementPattern);
    if (measureMatch) {
      const sizes = measureMatch.map(m => {
        const nums = m.match(/\d+(?:\.\d+)?/g);
        if (nums && nums.length >= 2) {
          return `${nums[0]}cm x ${nums[1]}cm`;
        } else if (nums && nums.length === 1) {
          return `${nums[0]}cm length`;
        }
        return m;
      });
      measurements = sizes.join(', ');
    }

    // Extract drainage
    let drainage = 'Not documented';
    if (lowerInput.includes('no drainage') || lowerInput.includes('minimal drainage')) {
      drainage = 'Minimal to none';
    } else {
      const drainagePatterns = [
        /(?:moderate|heavy|light|minimal|scant|copious|large|small)\s+(?:amount\s+of\s+)?(?:pink|red|yellow|green|clear|serous|serosanguinous|sanguinous|purulent|drainage|exudate)/gi,
        /(pink|red|yellow|green|clear|serous|serosanguinous|sanguinous|purulent)\s+drainage/gi,
        /drainage[^,.]*?(pink|red|yellow|green|clear|serous|serosanguinous|moderate|minimal|heavy)/gi
      ];

      for (const pattern of drainagePatterns) {
        const match = input.match(pattern);
        if (match) {
          drainage = match[0].charAt(0).toUpperCase() + match[0].slice(1);
          // Convert common terms to medical terminology
          if (drainage.toLowerCase().includes('pink')) {
            drainage = drainage.replace(/pink/gi, 'serosanguinous');
          }
          break;
        }
      }
    }

    // Extract odor
    let odor = 'None noted';
    if (lowerInput.includes('no smell') || lowerInput.includes('no odor') || lowerInput.includes('no bad smell')) {
      odor = 'None noted';
    } else if (lowerInput.includes('foul') || lowerInput.includes('bad smell') || lowerInput.includes('odor')) {
      odor = 'Odor present, assess for infection';
    }

    // Extract wound bed characteristics
    let woundBed = 'Not documented';
    const woundBedPatterns = [
      /wound bed[^,.]*?(pink|red|healthy|granulation|tissue|healing|necrotic|slough)/gi,
      /(pink|red|healthy)\s+(?:with\s+)?(?:good\s+)?(?:granulation|tissue)/gi,
      /looks?\s+(healthy|good|pink|red|clean)/gi
    ];

    for (const pattern of woundBedPatterns) {
      const match = input.match(pattern);
      if (match) {
        woundBed = match[0].charAt(0).toUpperCase() + match[0].slice(1);
        if (woundBed.toLowerCase().includes('pink') && woundBed.toLowerCase().includes('granulation')) {
          woundBed = 'Pink with good granulation tissue';
        }
        break;
      }
    }

    // Extract edges
    let edges = 'Not documented';
    if (lowerInput.includes('edges')) {
      if (lowerInput.includes('coming together') || lowerInput.includes('approximated') || lowerInput.includes('approximating')) {
        edges = 'Approximating well';
      } else if (lowerInput.includes('gaping') || lowerInput.includes('open')) {
        edges = 'Gaping, not approximated';
      } else {
        const edgeMatch = input.match(/edges[^,.]*?([^,.]{10,40})/i);
        if (edgeMatch) {
          edges = edgeMatch[1].trim();
        }
      }
    }

    // Extract periwound skin
    let periwound = 'Not documented';
    if (lowerInput.includes('skin around') || lowerInput.includes('periwound')) {
      if (lowerInput.includes('intact') || lowerInput.includes('looks fine') || lowerInput.includes('looks good')) {
        periwound = 'Intact, no erythema or breakdown';
      } else if (lowerInput.includes('red') || lowerInput.includes('redness')) {
        periwound = 'Erythema noted';
      } else {
        const periMatch = input.match(/(?:skin around|periwound)[^,.]*?([^,.]{10,40})/i);
        if (periMatch) {
          periwound = periMatch[1].trim();
        }
      }
    }

    // Extract pain level
    let pain = 'Not documented';
    const painPattern = /(\d+)\s*(?:\/|out of|outof)\s*(?:10|ten)/gi;
    const painMatch = input.match(painPattern);
    if (painMatch) {
      pain = painMatch[0].replace(/out ?of/gi, '/').replace(/ten/gi, '10');
    } else if (lowerInput.includes('no pain') || lowerInput.includes('pain free')) {
      pain = '0/10';
    } else if (lowerInput.includes('minimal pain') || lowerInput.includes('mild pain')) {
      pain = '1-3/10';
    }

    // Extract dressing type
    let dressing = 'Dressing changed';
    const dressingPatterns = [
      /(hydrocolloid|foam|gauze|transparent|alginate|collagen|hydrogel)\s+dressing/gi,
      /(?:applied|put on|used)\s+(?:a\s+)?(\w+)\s+dressing/gi,
      /dressing\s+(?:type|used):\s*(\w+)/gi
    ];

    for (const pattern of dressingPatterns) {
      const match = input.match(pattern);
      if (match) {
        const dressingType = match[0].toLowerCase().includes('hydrocolloid') ? 'hydrocolloid' :
                            match[0].toLowerCase().includes('foam') ? 'foam' :
                            match[0].toLowerCase().includes('gauze') ? 'gauze' :
                            match[0].toLowerCase().includes('transparent') ? 'transparent film' : 'standard';
        dressing = `${dressingType.charAt(0).toUpperCase() + dressingType.slice(1)} dressing applied`;
        break;
      }
    }

    // Extract plan/follow-up
    let plan = 'Continue current wound care regimen';
    const planPatterns = [
      /(?:will|plan to|plan is to)\s+([^.]+)/gi,
      /(?:check|reassess|evaluate)\s+(?:again\s+)?in\s+(\d+)\s+(hour|hours|day|days)/gi,
      /next\s+(?:dressing\s+)?change\s+in\s+(\d+)\s+(hour|hours|day|days)/gi
    ];

    for (const pattern of planPatterns) {
      const match = input.match(pattern);
      if (match) {
        plan = match[0].charAt(0).toUpperCase() + match[0].slice(1);
        break;
      }
    }

    return `WOUND CARE DOCUMENTATION

Location: ${location}
Measurements: ${measurements}
Wound Bed: ${woundBed}
Drainage: ${drainage}
Odor: ${odor}
Wound Edges: ${edges}
Periwound Skin: ${periwound}
Pain Level: ${pain}
Dressing: ${dressing}
Patient Tolerance: Procedure tolerated well
Plan: ${plan}`;
  }

  private parseShiftAssessment(input: string, lowerInput: string): string {
    const extractValue = (keywords: string[], defaultValue: string): string => {
      for (const keyword of keywords) {
        const idx = lowerInput.indexOf(keyword);
        if (idx !== -1) {
          const segment = input.substring(idx, Math.min(idx + 100, input.length));
          const match = segment.match(/[^.,;]+/);
          if (match) return match[0];
        }
      }
      return defaultValue;
    };

    const alertStatus = extractValue(['alert', 'oriented', 'conscious', 'responsive'], 'Alert and oriented x3');
    const neuro = extractValue(['neuro', 'neurological', 'pupils', 'motor'], 'No deficits noted');
    const respiratory = extractValue(['lung', 'respiratory', 'breath', 'breathing'], 'Lungs clear bilaterally');
    const cardiac = extractValue(['heart', 'cardiac', 'rhythm'], 'Regular rate and rhythm');
    const gi = extractValue(['abdomen', 'bowel', 'nausea', 'vomit'], 'No nausea or vomiting');
    const gu = extractValue(['void', 'urinating', 'catheter'], 'Voiding without difficulty');
    const skin = extractValue(['skin', 'wound', 'dressing'], 'Intact, no breakdown noted');

    let pain = 'Not documented';
    const painMatch = input.match(/(\d+)\s*(?:\/|out of)\s*(?:10|ten)/i);
    if (painMatch) pain = painMatch[0];

    return `SHIFT ASSESSMENT

Patient Status: ${alertStatus}
Neuro: ${neuro}
Respiratory: ${respiratory}
Cardiac: ${cardiac}
GI: ${gi}
GU: ${gu}
Skin/Wound: ${skin}
Pain: ${pain}
Interventions: Care provided per plan
Plan: Continue monitoring and reassess as needed`;
  }

  private parseMedicationAdministration(input: string, lowerInput: string): string {
    // Extract medication name
    let medication = 'Not documented';
    const commonMeds = ['lisinopril', 'metoprolol', 'aspirin', 'tylenol', 'acetaminophen', 'morphine', 'hydromorphone', 'dilaudid', 'norco', 'oxycodone', 'furosemide', 'lasix', 'insulin', 'heparin', 'warfarin', 'metformin'];
    for (const med of commonMeds) {
      if (lowerInput.includes(med)) {
        medication = med.charAt(0).toUpperCase() + med.slice(1);
        break;
      }
    }

    // Extract dose
    let dose = 'Not documented';
    const dosePattern = /(\d+(?:\.\d+)?)\s*(mg|milligram|milligrams|mcg|microgram|micrograms|g|gram|grams|ml|milliliter|milliliters|unit|units)/gi;
    const doseMatch = input.match(dosePattern);
    if (doseMatch) {
      dose = doseMatch[0].replace(/milligram/gi, 'mg').replace(/microgram/gi, 'mcg');
    }

    // Extract route
    let route = 'Not documented';
    if (lowerInput.includes('by mouth') || lowerInput.includes(' po ') || lowerInput.includes('oral')) {
      route = 'PO (oral)';
    } else if (lowerInput.includes('iv') || lowerInput.includes('intravenous')) {
      route = 'IV (intravenous)';
    } else if (lowerInput.includes('im') || lowerInput.includes('intramuscular')) {
      route = 'IM (intramuscular)';
    } else if (lowerInput.includes('subq') || lowerInput.includes('subcutaneous')) {
      route = 'SubQ (subcutaneous)';
    }

    // Extract time
    let time = 'Not documented';
    const timePattern = /(?:at\s+)?(\d{1,2})\s*(?::|am|pm|a\.m\.|p\.m\.)?/gi;
    const timeMatch = input.match(timePattern);
    if (timeMatch && (lowerInput.includes('gave') || lowerInput.includes('administered'))) {
      time = timeMatch[0];
    }

    // Extract response
    let response = 'Tolerated well, no adverse reactions noted';
    if (lowerInput.includes('tolerated') || lowerInput.includes('took it fine') || lowerInput.includes('no problem')) {
      response = 'Tolerated well, no adverse reactions noted';
    } else if (lowerInput.includes('nausea') || lowerInput.includes('vomit')) {
      response = 'Adverse reaction noted - see documentation';
    }

    return `MEDICATION ADMINISTRATION RECORD (MAR)

Medication: ${medication}
Dose: ${dose}
Route: ${route}
Time Administered: ${time}
Patient Response: ${response}
Follow-Up: Continue monitoring per protocol`;
  }

  private parseIntakeOutput(input: string, lowerInput: string): string {
    const extractNumber = (text: string): number | null => {
      const match = text.match(/(\d+)/);
      return match ? parseInt(match[1]) : null;
    };

    let oral = 'Not documented';
    let iv = 'Not documented';
    let urine = 'Not documented';

    // Extract oral intake
    if (lowerInput.includes('oral') || lowerInput.includes('drank') || lowerInput.includes('water') || lowerInput.includes('juice')) {
      const oralMatch = input.match(/(\d+)\s*(?:ml|milliliter|cc)/i);
      if (oralMatch) oral = `${oralMatch[1]}ml`;
    }

    // Extract IV fluids
    if (lowerInput.includes('iv') || lowerInput.includes('intravenous')) {
      const ivMatch = input.match(/(?:iv|intravenous)[^.]*?(\d+)\s*(?:ml|milliliter|cc)/i);
      if (ivMatch) iv = `${ivMatch[1]}ml`;
    }

    // Extract urine output
    if (lowerInput.includes('urine') || lowerInput.includes('void') || lowerInput.includes('urinated')) {
      const urineMatch = input.match(/(\d+)\s*(?:ml|milliliter|cc)/i);
      if (urineMatch) urine = `${urineMatch[1]}ml`;
    }

    return `INTAKE & OUTPUT SUMMARY

Oral Intake: ${oral}
IV Fluids: ${iv}
Total Intake: Calculate based on above values
Urine Output: ${urine}
Stool/Other Output: None documented
Net Balance: Calculate: Total Intake - Total Output
Notes: Review and verify all measurements`;
  }

  private parseSafetyChecklist(input: string, lowerInput: string): string {
    const bed = lowerInput.includes('bed') && lowerInput.includes('low') ? 'Lowest position' : 'Not documented';
    const callLight = lowerInput.includes('call light') || lowerInput.includes('call bell') ? 'Within reach' : 'Not documented';
    const rails = lowerInput.includes('rail') && lowerInput.includes('up') ? 'Up' : 'Not documented';
    const socks = lowerInput.includes('sock') || lowerInput.includes('non-slip') ? 'Applied' : 'Not documented';
    const alarm = lowerInput.includes('alarm') && lowerInput.includes('activ') ? 'Activated' : 'Not documented';

    let fallRisk = 'Not assessed';
    if (lowerInput.includes('moderate risk')) fallRisk = 'Moderate';
    else if (lowerInput.includes('high risk')) fallRisk = 'High';
    else if (lowerInput.includes('low risk')) fallRisk = 'Low';

    return `SAFETY CHECKLIST

Bed Position: ${bed}
Call Light: ${callLight}
Side Rails: ${rails}
Non-Slip Socks: ${socks}
Bed Alarm: ${alarm}
Fall Risk: ${fallRisk}
Comments: Safety measures in place and verified`;
  }

  private parseMedSurg(input: string, lowerInput: string): string {
    const extractValue = (keywords: string[], defaultValue: string): string => {
      for (const keyword of keywords) {
        if (lowerInput.includes(keyword)) {
          const idx = lowerInput.indexOf(keyword);
          const segment = input.substring(idx, Math.min(idx + 80, input.length));
          return segment.split(/[.,;]/)[0] || defaultValue;
        }
      }
      return defaultValue;
    };

    const postOp = extractValue(['post-op', 'post op', 'surgery', 'appendectomy', 'cholecystectomy'], 'Not documented');
    const temp = lowerInput.includes('afebrile') || lowerInput.includes('no fever') ? 'Afebrile' : 'Not documented';
    const mobility = extractValue(['walking', 'ambulating', 'mobile'], 'Ambulating with assistance');
    const diet = extractValue(['eating', 'diet', 'tolerat'], 'Tolerating diet as ordered');

    let pain = 'Not documented';
    const painMatch = input.match(/(\d+)\s*(?:\/|out of)\s*(?:10|ten)/i);
    if (painMatch) pain = painMatch[0];

    return `MED-SURG UNIT PROGRESS NOTE

Post-Op Status: ${postOp}
Temperature: ${temp}
Mobility: ${mobility}
Diet: ${diet}
Pain: ${pain}
Interventions: Care provided per protocol
Plan: Continue post-operative care and encourage mobility`;
  }

  private parseICU(input: string, lowerInput: string): string {
    const extractValue = (keywords: string[], defaultValue: string): string => {
      for (const keyword of keywords) {
        if (lowerInput.includes(keyword)) {
          const idx = lowerInput.indexOf(keyword);
          const segment = input.substring(idx, Math.min(idx + 100, input.length));
          return segment.split(/[.,;]/)[0] || defaultValue;
        }
      }
      return defaultValue;
    };

    const ventilation = extractValue(['ventilator', 'vent', 'intubated', 'fio2'], 'Not documented');
    const sedation = extractValue(['propofol', 'sedation', 'sedated', 'rass'], 'Not documented');
    const cardiac = extractValue(['heart', 'cardiac', 'rhythm', 'bp', 'blood pressure'], 'Stable rhythm');
    const drips = extractValue(['levophed', 'norepinephrine', 'vasopressor', 'drip'], 'Not documented');

    return `ICU DAILY NOTE

Ventilation: ${ventilation}
Sedation: ${sedation}
Cardiac: ${cardiac}
Hemodynamics: Stable, monitoring continuous
Drips/Infusions: ${drips}
Output: Adequate urine output
Plan: Continue intensive monitoring and supportive care`;
  }

  private parseNICU(input: string, lowerInput: string): string {
    const extractValue = (keywords: string[], defaultValue: string): string => {
      for (const keyword of keywords) {
        if (lowerInput.includes(keyword)) {
          const idx = lowerInput.indexOf(keyword);
          const segment = input.substring(idx, Math.min(idx + 80, input.length));
          return segment.split(/[.,;]/)[0] || defaultValue;
        }
      }
      return defaultValue;
    };

    const gestAge = extractValue(['week', 'gestation'], 'Not documented');
    const temp = extractValue(['isolette', 'temperature', 'temp'], 'Isolette maintaining thermal stability');
    const feeding = extractValue(['fed', 'feeding', 'formula', 'breast'], 'Tolerating feedings as ordered');
    const oxygen = extractValue(['oxygen', 'o2', 'sat'], 'Not documented');

    return `NICU PROGRESS NOTE

Gestational Age: ${gestAge}
Temperature Control: ${temp}
Feeding: ${feeding}
Oxygen Status: ${oxygen}
Activity: Resting appropriately for gestational age
Plan: Continue supportive care and parental involvement`;
  }

  private parseMotherBaby(input: string, lowerInput: string): string {
    const extractValue = (keywords: string[], defaultValue: string): string => {
      for (const keyword of keywords) {
        if (lowerInput.includes(keyword)) {
          const idx = lowerInput.indexOf(keyword);
          const segment = input.substring(idx, Math.min(idx + 80, input.length));
          return segment.split(/[.,;]/)[0] || defaultValue;
        }
      }
      return defaultValue;
    };

    const maternal = extractValue(['mom', 'mother', 'breastfeeding', 'walking'], 'Ambulating independently, recovery progressing');
    const lochia = extractValue(['bleed', 'lochia'], 'Lochia moderate rubra, within normal limits');

    let pain = 'Not documented';
    const painMatch = input.match(/(\d+)\s*(?:\/|out of)\s*(?:10|ten)/i);
    if (painMatch) pain = painMatch[0];

    const baby = extractValue(['baby', 'infant', 'newborn', 'feeding'], 'Feeding well, voiding and stooling appropriately');

    return `MOTHER-BABY UNIT NOTE

Maternal Status: ${maternal}
Lochia: ${lochia}
Maternal Pain: ${pain}
Newborn Status: ${baby}
Bonding: Appropriate parent-infant bonding observed
Plan: Continue routine postpartum care and education`;
  }

  private assessInputQuality(input: string, medicalTerms: MedicalTerm[]): AIAnalysis['qualityAssessment'] {
    return {
      completeness: Math.min(input.length / 200, 1.0),
      accuracy: medicalTerms.length > 0 ? 0.8 : 0.6,
      clarity: input.includes('.') ? 0.8 : 0.6,
      adherence: input.length > 50 ? 0.8 : 0.6
    };
  }

  private isGuidelineRelevant(guideline: ClinicalGuideline, input: string): boolean {
    const inputLower = input.toLowerCase();
    return guideline.guidelines.some(g => 
      inputLower.includes(g.toLowerCase().substring(0, 20))
    );
  }

  private identifyMissingElements(input: string, medicalTerms: MedicalTerm[]): string[] {
    const missing = new Set<string>();
    const lower = input.toLowerCase();

    if (!/(bp|blood pressure)[^\d]*(\d{2,3}\/\d{2,3})/.test(lower)) {
      missing.add('blood pressure');
    }

    if (!/(hr|heart rate)[^\d]*(\d{2,3})/.test(lower)) {
      missing.add('heart rate');
    }

    if (!/(rr|respiratory rate)[^\d]*(\d{1,2})/.test(lower)) {
      missing.add('respiratory rate');
    }

    if (!/(temp|temperature)[^\d]*(\d{2,3}(\.\d+)?)|(\d+\.?\d*°[cf])/.test(lower)) {
      missing.add('temperature');
    }

    if (!/(spo2|oxygen saturation)[^\d]*(\d{2,3})/.test(lower)) {
      missing.add('oxygen saturation');
    }

    if (!/pain (?:score|level|rated|is)\s*\d+\.?\d*\/10/.test(lower)) {
      missing.add('pain score');
    }

    if (!/(medication|administered|given|infusion|drip|dose)/.test(lower)) {
      missing.add('medications/interventions');
    }

    if (!/(plan|will continue|follow up|monitor|reassess|education)/.test(lower)) {
      missing.add('plan of care');
    }

    if (!/allerg(?:y|ies)/.test(lower)) {
      missing.add('allergies');
    }

    if (medicalTerms.length < 3) {
      missing.add('clinical terminology depth');
    }

    return Array.from(missing);
  }

  private generateRecommendations(medicalTerms: MedicalTerm[], guidelines: ClinicalGuideline[]): string[] {
    const recommendations: string[] = [];
    
    medicalTerms.forEach(term => {
      if (term.nursingImplications) {
        recommendations.push(`For ${term.term}: ${term.nursingImplications[0]}`);
      }
    });
    
    return recommendations;
  }
}

// Export singleton instance
export const enhancedAIService = new EnhancedAIService();

export default enhancedAIService;
