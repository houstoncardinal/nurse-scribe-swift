/**
 * Advanced PHI Redaction System with LLM-assisted masking
 * Provides comprehensive medical data protection with AI enhancement
 */

export interface PHIPattern {
  type: 'name' | 'phone' | 'email' | 'ssn' | 'mrn' | 'dob' | 'address' | 'insurance' | 'diagnosis' | 'medication';
  pattern: RegExp;
  mask: string;
  confidence: number;
  context?: string;
}

export interface RedactionResult {
  redactedText: string;
  redactionCount: number;
  confidence: number;
  patterns: {
    names: number;
    phones: number;
    emails: number;
    ssn: number;
    mrn: number;
    dob: number;
    addresses: number;
    insurance: number;
    diagnosis: number;
    medication: number;
  };
  suggestions: RedactionSuggestion[];
  auditTrail: AuditEntry[];
}

export interface RedactionSuggestion {
  type: 'potential_phi' | 'medical_term' | 'improvement';
  text: string;
  suggestion: string;
  confidence: number;
  reason: string;
}

export interface AuditEntry {
  timestamp: string;
  action: 'redaction' | 'suggestion' | 'review';
  type: string;
  original: string;
  redacted: string;
  confidence: number;
  userAction?: 'accepted' | 'rejected' | 'modified';
}

class AdvancedPHIRedactor {
  private patterns: PHIPattern[] = [];
  private medicalTerms: Set<string> = new Set();
  private commonNames: Set<string> = new Set();

  constructor() {
    this.initializePatterns();
    this.loadMedicalTerms();
    this.loadCommonNames();
  }

  private initializePatterns(): void {
    this.patterns = [
      // Names (enhanced pattern)
      {
        type: 'name',
        pattern: /\b[A-Z][a-z]+ [A-Z][a-z]+(?: [A-Z][a-z]+)?\b/g,
        mask: '[PATIENT NAME]',
        confidence: 0.7,
      },
      
      // Phone numbers
      {
        type: 'phone',
        pattern: /(\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}|\d{3}[-.\s]?\d{3}[-.\s]?\d{4})/g,
        mask: '[PHONE NUMBER]',
        confidence: 0.95,
      },
      
      // Email addresses
      {
        type: 'email',
        pattern: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
        mask: '[EMAIL ADDRESS]',
        confidence: 0.99,
      },
      
      // Social Security Numbers
      {
        type: 'ssn',
        pattern: /\b\d{3}-?\d{2}-?\d{4}\b/g,
        mask: '[SSN]',
        confidence: 0.98,
      },
      
      // Medical Record Numbers
      {
        type: 'mrn',
        pattern: /\b(?:MRN|Medical Record Number|Patient ID):\s*\d{4,12}\b/gi,
        mask: '[MRN]',
        confidence: 0.9,
      },
      
      // Dates of Birth
      {
        type: 'dob',
        pattern: /\b(?:DOB|Date of Birth|Born):\s*\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}\b/gi,
        mask: '[DATE OF BIRTH]',
        confidence: 0.85,
      },
      
      // Addresses (enhanced)
      {
        type: 'address',
        pattern: /\b\d+\s+[A-Za-z0-9\s,.-]+(?:Street|St|Avenue|Ave|Road|Rd|Drive|Dr|Lane|Ln|Boulevard|Blvd|Way|Circle|Cir|Court|Ct|Place|Pl)\b/gi,
        mask: '[ADDRESS]',
        confidence: 0.8,
      },
      
      // Insurance information
      {
        type: 'insurance',
        pattern: /\b(?:Insurance|Policy|Member ID|Group Number):\s*[A-Za-z0-9\s\-]{6,20}\b/gi,
        mask: '[INSURANCE INFO]',
        confidence: 0.8,
      },
      
      // Medication names (preserve but flag)
      {
        type: 'medication',
        pattern: /\b(?:medication|drug|prescription|rx|taking|prescribed):\s*[A-Za-z\s\-]{3,30}\b/gi,
        mask: '[MEDICATION]',
        confidence: 0.6,
      },
    ];
  }

  private loadMedicalTerms(): void {
    // Common medical terms that should NOT be redacted
    const terms = [
      'blood pressure', 'heart rate', 'temperature', 'oxygen saturation',
      'pain scale', 'vital signs', 'assessment', 'intervention', 'evaluation',
      'chief complaint', 'history', 'physical exam', 'diagnosis', 'treatment',
      'medication', 'allergy', 'adverse reaction', 'contraindication',
      'prognosis', 'follow-up', 'discharge', 'admission', 'transfer',
      'nursing care', 'patient care', 'clinical', 'medical', 'healthcare'
    ];
    
    terms.forEach(term => this.medicalTerms.add(term.toLowerCase()));
  }

  private loadCommonNames(): void {
    // Common medical professional names that should be preserved
    const names = [
      'Dr. Smith', 'Dr. Johnson', 'Dr. Williams', 'Dr. Brown', 'Dr. Jones',
      'Nurse Smith', 'Nurse Johnson', 'Dr. Davis', 'Dr. Miller', 'Dr. Wilson'
    ];
    
    names.forEach(name => this.commonNames.add(name.toLowerCase()));
  }

  /**
   * Enhanced redaction with LLM assistance
   */
  async redactPHI(text: string, useLLM: boolean = true): Promise<RedactionResult> {
    const auditTrail: AuditEntry[] = [];
    const suggestions: RedactionSuggestion[] = [];
    let redactedText = text;
    let totalRedactions = 0;

    const patterns = {
      names: 0,
      phones: 0,
      emails: 0,
      ssn: 0,
      mrn: 0,
      dob: 0,
      addresses: 0,
      insurance: 0,
      diagnosis: 0,
      medication: 0,
    };

    // Apply regex-based redaction
    for (const pattern of this.patterns) {
      const matches = [...redactedText.matchAll(pattern.pattern)];
      
      for (const match of matches) {
        const original = match[0];
        
        // Skip if it's a medical term or common name
        if (this.shouldPreserve(original)) {
          continue;
        }

        redactedText = redactedText.replace(original, pattern.mask);
        patterns[pattern.type === 'name' ? 'names' : 
                 pattern.type === 'phone' ? 'phones' :
                 pattern.type === 'email' ? 'emails' :
                 pattern.type === 'ssn' ? 'ssn' :
                 pattern.type === 'mrn' ? 'mrn' :
                 pattern.type === 'dob' ? 'dob' :
                 pattern.type === 'address' ? 'addresses' :
                 pattern.type === 'insurance' ? 'insurance' :
                 pattern.type === 'medication' ? 'medication' : 'diagnosis']++;
        
        totalRedactions++;

        auditTrail.push({
          timestamp: new Date().toISOString(),
          action: 'redaction',
          type: pattern.type,
          original,
          redacted: pattern.mask,
          confidence: pattern.confidence,
        });
      }
    }

    // LLM-assisted enhancement if enabled
    if (useLLM && this.hasOpenAIKey()) {
      try {
        const llmResult = await this.enhanceWithLLM(redactedText, text);
        redactedText = llmResult.enhancedText;
        suggestions.push(...llmResult.suggestions);
        auditTrail.push(...llmResult.auditEntries);
      } catch (error) {
        console.warn('LLM enhancement failed:', error);
      }
    }

    // Generate suggestions for potential improvements
    suggestions.push(...this.generateSuggestions(text, redactedText));

    const confidence = this.calculateOverallConfidence(patterns, suggestions);

    return {
      redactedText,
      redactionCount: totalRedactions,
      confidence,
      patterns,
      suggestions,
      auditTrail,
    };
  }

  /**
   * Check if text should be preserved (medical terms, common names)
   */
  private shouldPreserve(text: string): boolean {
    const lowerText = text.toLowerCase();
    
    // Check medical terms
    for (const term of this.medicalTerms) {
      if (lowerText.includes(term)) {
        return true;
      }
    }
    
    // Check common names
    for (const name of this.commonNames) {
      if (lowerText.includes(name)) {
        return true;
      }
    }
    
    return false;
  }

  /**
   * Enhance redaction with LLM assistance
   */
  private async enhanceWithLLM(redactedText: string, originalText: string): Promise<{
    enhancedText: string;
    suggestions: RedactionSuggestion[];
    auditEntries: AuditEntry[];
  }> {
    const apiKey = localStorage.getItem('nursescribe_api_keys');
    if (!apiKey) {
      throw new Error('OpenAI API key not available');
    }

    const keys = JSON.parse(apiKey);
    if (!keys.openai) {
      throw new Error('OpenAI API key not configured');
    }

    const prompt = `
You are a HIPAA compliance expert. Review this medical text for PHI (Protected Health Information) that needs redaction.

Original text: "${originalText}"
Current redaction: "${redactedText}"

Identify any remaining PHI that should be redacted and suggest improvements. Focus on:
1. Patient names, nicknames, or identifiers
2. Phone numbers, addresses, emails
3. Medical record numbers, SSNs, DOB
4. Insurance information
5. Any other identifying information

Respond with JSON format:
{
  "enhanced_text": "text with additional redactions",
  "suggestions": [
    {
      "type": "potential_phi",
      "text": "original text",
      "suggestion": "redacted version",
      "confidence": 0.9,
      "reason": "explanation"
    }
  ]
}

Only suggest redactions for actual PHI. Preserve medical terminology and clinical information.
`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${keys.openai}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.1,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    
    try {
      const result = JSON.parse(content);
      
      const auditEntries: AuditEntry[] = result.suggestions.map((s: any) => ({
        timestamp: new Date().toISOString(),
        action: 'suggestion',
        type: s.type,
        original: s.text,
        redacted: s.suggestion,
        confidence: s.confidence,
      }));

      return {
        enhancedText: result.enhanced_text || redactedText,
        suggestions: result.suggestions || [],
        auditEntries,
      };
    } catch (error) {
      console.error('Failed to parse LLM response:', error);
      return {
        enhancedText: redactedText,
        suggestions: [],
        auditEntries: [],
      };
    }
  }

  /**
   * Generate improvement suggestions
   */
  private generateSuggestions(originalText: string, redactedText: string): RedactionSuggestion[] {
    const suggestions: RedactionSuggestion[] = [];

    // Check for potential missed PHI
    const potentialNames = originalText.match(/\b[A-Z][a-z]+ [A-Z][a-z]+\b/g);
    if (potentialNames) {
      potentialNames.forEach(name => {
        if (!redactedText.includes('[PATIENT NAME]') && !this.shouldPreserve(name)) {
          suggestions.push({
            type: 'potential_phi',
            text: name,
            suggestion: '[PATIENT NAME]',
            confidence: 0.7,
            reason: 'Potential patient name not redacted',
          });
        }
      });
    }

    // Check for medical terminology preservation
    const medicalTerms = ['assessment', 'intervention', 'evaluation', 'diagnosis'];
    medicalTerms.forEach(term => {
      if (originalText.toLowerCase().includes(term)) {
        suggestions.push({
          type: 'medical_term',
          text: term,
          suggestion: term,
          confidence: 1.0,
          reason: 'Important medical terminology preserved',
        });
      }
    });

    return suggestions;
  }

  /**
   * Calculate overall confidence score
   */
  private calculateOverallConfidence(patterns: any, suggestions: RedactionSuggestion[]): number {
    const totalSuggestions = suggestions.length;
    const highConfidenceSuggestions = suggestions.filter(s => s.confidence > 0.8).length;
    
    if (totalSuggestions === 0) return 1.0;
    
    return highConfidenceSuggestions / totalSuggestions;
  }

  /**
   * Check if OpenAI API key is available
   */
  private hasOpenAIKey(): boolean {
    try {
      const apiKey = localStorage.getItem('nursescribe_api_keys');
      if (!apiKey) return false;
      
      const keys = JSON.parse(apiKey);
      return !!keys.openai;
    } catch {
      return false;
    }
  }

  /**
   * Get redaction statistics
   */
  getRedactionStats(): { totalPatterns: number; supportedTypes: string[] } {
    return {
      totalPatterns: this.patterns.length,
      supportedTypes: [...new Set(this.patterns.map(p => p.type))],
    };
  }
}

// Export singleton instance
export const advancedPHIRedactor = new AdvancedPHIRedactor();
