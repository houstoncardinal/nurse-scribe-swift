/**
 * Enhanced AI Service with Knowledge Base Integration
 * Powers intelligent note generation with comprehensive medical knowledge
 */

import { knowledgeBaseService, MedicalTerm, ClinicalGuideline, TemplateGuidance } from './knowledgeBase';

export interface NoteGenerationPrompt {
  template: 'SOAP' | 'SBAR' | 'PIE' | 'DAR';
  input: string;
  context?: {
    patientAge?: number;
    patientGender?: string;
    chiefComplaint?: string;
    medicalHistory?: string[];
    currentMedications?: string[];
  };
}

export interface AIPrompt extends NoteGenerationPrompt {}

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
  private readonly OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
  private readonly MODEL = 'gpt-4o-mini';

  constructor() {
    if (!this.OPENAI_API_KEY) {
      console.warn('OpenAI API key not found. AI features will be limited.');
    }
  }

  /**
   * Generate comprehensive nursing note using knowledge base
   */
  public async generateNote(prompt: AIPrompt): Promise<AIGeneratedNote> {
    try {
      // Get template guidance from knowledge base
      const templateGuidance = knowledgeBaseService.getTemplateGuidance(prompt.template);
      
      // Analyze input for medical terms and clinical context
      const analysis = this.analyzeInput(prompt.input);
      
      // Extract clinical context and reasoning from input
      const clinicalContext = this.extractClinicalContext(prompt.input);
      
      // Build enhanced prompt with knowledge base context and clinical reasoning
      const enhancedPrompt = this.buildEnhancedPrompt(prompt, templateGuidance, analysis, clinicalContext);
      
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
      socialFactors: []
    };

    const lowerInput = input.toLowerCase();

    // Determine urgency level
    if (lowerInput.includes('emergency') || lowerInput.includes('urgent') || lowerInput.includes('acute')) {
      context.urgency = 'urgent';
    } else if (lowerInput.includes('critical') || lowerInput.includes('life-threatening')) {
      context.urgency = 'critical';
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
    const vitalSignsPatterns = [
      /blood pressure[:\s]*(\d+\/\d+)/gi,
      /heart rate[:\s]*(\d+)/gi,
      /temperature[:\s]*(\d+\.?\d*)/gi,
      /respiratory rate[:\s]*(\d+)/gi,
      /oxygen saturation[:\s]*(\d+)/gi
    ];

    vitalSignsPatterns.forEach(pattern => {
      const matches = input.match(pattern);
      if (matches) {
        context.vitalSigns.push(...matches);
      }
    });

    // Extract symptoms
    const symptoms = ['pain', 'fever', 'nausea', 'vomiting', 'diarrhea', 'constipation', 'shortness of breath', 'cough', 'fatigue', 'weakness'];
    symptoms.forEach(symptom => {
      if (lowerInput.includes(symptom)) {
        context.symptoms.push(symptom);
      }
    });

    // Extract medications
    const medicationPattern = /(?:medications?|drugs?)[:\s]*([^.]+)/i;
    const medicationMatch = input.match(medicationPattern);
    if (medicationMatch) {
      context.medications = medicationMatch[1].split(',').map(m => m.trim());
    }

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

    enhancedPrompt += `Requirements:\n`;
    enhancedPrompt += `- Use professional medical terminology\n`;
    enhancedPrompt += `- Include appropriate nursing interventions\n`;
    enhancedPrompt += `- Follow ${prompt.template} format exactly\n`;
    enhancedPrompt += `- Ensure HIPAA compliance\n`;
    enhancedPrompt += `- Include specific measurements and times\n`;
    enhancedPrompt += `- Use objective language where appropriate\n`;
    enhancedPrompt += `- Provide actionable nursing interventions\n\n`;
    enhancedPrompt += `Please generate a comprehensive, professional nursing note.`;

    return enhancedPrompt;
  }

  private async callOpenAI(prompt: string): Promise<string> {
    if (!this.OPENAI_API_KEY) {
      throw new Error('OpenAI API key not configured');
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: this.MODEL,
        messages: [
          {
            role: 'system',
            content: `You are an expert nursing documentation specialist with extensive knowledge of clinical documentation standards, medical terminology, and nursing best practices. 

CORE CAPABILITIES:
- Generate professional, accurate, and comprehensive nursing notes
- Follow established templates (SOAP, SBAR, PIE, DAR) with precision
- Use proper medical terminology and nursing language
- Include specific measurements, times, and objective data
- Provide actionable nursing interventions and assessments
- Ensure HIPAA compliance and patient safety focus
- Generate situation-specific content based on input context
- Create detailed, clinically relevant documentation

MEDICAL EXPERTISE:
- Advanced knowledge of pathophysiology and nursing care
- Understanding of medication administration and monitoring
- Expertise in assessment techniques and clinical reasoning
- Knowledge of evidence-based nursing practices
- Familiarity with healthcare regulations and standards

OUTPUT REQUIREMENTS:
- Use professional medical terminology
- Include specific measurements and vital signs
- Provide detailed nursing assessments
- Suggest appropriate interventions
- Include patient education components
- Ensure clinical accuracy and relevance
- Follow proper documentation format
- Maintain professional tone throughout

Generate comprehensive, professional nursing documentation that demonstrates clinical expertise and follows best practices.`
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.2, // Lower temperature for more consistent, professional output
        max_tokens: 3000, // Increased for more comprehensive notes
        top_p: 0.9,
        frequency_penalty: 0.1,
        presence_penalty: 0.1,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`OpenAI API error: ${response.status} ${response.statusText} - ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
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

    return {
      template,
      sections: processedSections,
      overallConfidence,
      qualityScore,
      suggestions: this.generateOverallSuggestions(processedSections, analysis),
      icd10Suggestions: await this.getICD10Suggestions(response)
    };
  }

  private parseNoteSections(content: string, template: string): { [key: string]: string } {
    const sections: { [key: string]: string } = {};
    
    // Define section headers for each template
    const sectionHeaders = {
      'SOAP': ['Subjective', 'Objective', 'Assessment', 'Plan'],
      'SBAR': ['Situation', 'Background', 'Assessment', 'Recommendation'],
      'PIE': ['Problem', 'Intervention', 'Evaluation'],
      'DAR': ['Data', 'Action', 'Response']
    };

    const headers = sectionHeaders[template as keyof typeof sectionHeaders] || [];
    
    headers.forEach(header => {
      const regex = new RegExp(`${header}:\\s*([\\s\\S]*?)(?=${headers.join('|')}:|$)`, 'i');
      const match = content.match(regex);
      if (match) {
        sections[header] = match[1].trim();
      }
    });

    return sections;
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
    analysis: AIAnalysis
  ): string[] {
    const suggestions: string[] = [];
    
    if (analysis.missingElements.length > 0) {
      suggestions.push(`Consider adding: ${analysis.missingElements.join(', ')}`);
    }
    
    if (analysis.recommendations.length > 0) {
      suggestions.push(...analysis.recommendations);
    }
    
    return suggestions;
  }

  private async generateFallbackNote(prompt: NoteGenerationPrompt): Promise<AIGeneratedNote> {
    const analysis = this.analyzeInput(prompt.input);
    
    return {
      template: prompt.template,
      sections: {
        'Generated': {
          content: `Note generated from: ${prompt.input}`,
          confidence: 0.6,
          suggestions: ['Review and edit for accuracy'],
          medicalTerms: analysis.medicalTerms.map(t => t.term)
        }
      },
      overallConfidence: 0.6,
      qualityScore: 0.6,
      suggestions: ['AI service temporarily unavailable - please review generated content'],
      icd10Suggestions: await this.getICD10Suggestions(prompt.input)
    };
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
    const missing: string[] = [];
    
    if (!input.match(/\d+\/\d+/)) {
      missing.push('pain scale rating');
    }
    
    if (!input.match(/\d+\.\d+°F|°C/)) {
      missing.push('temperature');
    }
    
    if (!input.match(/\d+\/\d+ mmHg/)) {
      missing.push('blood pressure');
    }
    
    return missing;
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
