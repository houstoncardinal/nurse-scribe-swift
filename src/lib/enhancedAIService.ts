/**
 * Enhanced AI Service with Knowledge Base Integration
 * Powers intelligent note generation with comprehensive medical knowledge
 */

import { knowledgeBaseService, MedicalTerm, ClinicalGuideline, TemplateGuidance } from './knowledgeBase';

export interface AIPrompt {
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
  icd10Suggestions: string[];
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
      
      // Analyze input for medical terms
      const analysis = this.analyzeInput(prompt.input);
      
      // Build enhanced prompt with knowledge base context
      const enhancedPrompt = this.buildEnhancedPrompt(prompt, templateGuidance, analysis);
      
      // Generate note with OpenAI
      const response = await this.callOpenAI(enhancedPrompt);
      
      // Process and enhance response
      return this.processAIGeneratedNote(response, prompt.template, analysis);
      
    } catch (error) {
      console.error('Error generating note:', error);
      return this.generateFallbackNote(prompt);
    }
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
   * Get ICD-10 suggestions based on content
   */
  public getICD10Suggestions(content: string): string[] {
    const analysis = this.analyzeInput(content);
    const suggestions: string[] = [];

    analysis.medicalTerms.forEach(term => {
      if (term.icd10) {
        suggestions.push(`${term.icd10} - ${term.term}`);
      }
    });

    return suggestions;
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
    analysis: AIAnalysis
  ): string {
    let enhancedPrompt = `Generate a professional ${prompt.template} nursing note based on the following input:\n\n`;
    enhancedPrompt += `Input: ${prompt.input}\n\n`;

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
            content: 'You are an expert nursing documentation specialist with extensive knowledge of clinical documentation standards, medical terminology, and nursing best practices. Generate professional, accurate, and comprehensive nursing notes that follow established templates and guidelines.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  }

  private processAIGeneratedNote(
    response: string, 
    template: string, 
    analysis: AIAnalysis
  ): AIGeneratedNote {
    // Parse response into sections
    const sections = this.parseNoteSections(response, template);
    
    // Calculate confidence scores
    const processedSections: AIGeneratedNote['sections'] = {};
    let totalConfidence = 0;
    let sectionCount = 0;

    Object.entries(sections).forEach(([sectionName, content]) => {
      const medicalTerms = this.extractMedicalTerms(content);
      const confidence = this.calculateSectionConfidence(content, medicalTerms, analysis);
      
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
      icd10Suggestions: this.getICD10Suggestions(response)
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
    analysis: AIAnalysis
  ): number {
    let confidence = 0.5; // Base confidence
    
    // Increase confidence for medical terminology
    confidence += Math.min(medicalTerms.length * 0.1, 0.3);
    
    // Increase confidence for proper length
    if (content.length > 50) confidence += 0.1;
    if (content.length > 100) confidence += 0.1;
    
    // Increase confidence for professional language
    if (content.includes('patient') || content.includes('assessment')) confidence += 0.1;
    
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

  private generateFallbackNote(prompt: AIPrompt): AIGeneratedNote {
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
      icd10Suggestions: this.getICD10Suggestions(prompt.input)
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
