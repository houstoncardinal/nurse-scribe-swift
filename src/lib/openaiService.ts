/**
 * OpenAI Service
 * Production-ready AI service using secure serverless functions
 * 
 * SECURITY: All API calls go through Netlify serverless functions
 * to keep the OpenAI API key secure on the server side.
 * 
 * The API key is stored as an environment variable in Netlify,
 * NOT in localStorage or client-side code.
 */

import { toast } from 'sonner';

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface OpenAIConfig {
  model: string;
  temperature: number;
  maxTokens: number;
}

class OpenAIService {
  private config: OpenAIConfig = {
    model: 'gpt-4o-mini',
    temperature: 0.7,
    maxTokens: 2000
  };

  private readonly API_ENDPOINT = '/.netlify/functions/generate-note';

  constructor() {
    console.log('✅ OpenAI Service initialized - using secure serverless function');
  }

  /**
   * Check if service is available (always true since we use serverless)
   */
  public isConfigured(): boolean {
    // Service is available through Netlify function
    return true;
  }

  /**
   * Chat completion via secure serverless function
   */
  public async chatCompletion(
    messages: ChatMessage[],
    options?: Partial<OpenAIConfig>
  ): Promise<string> {
    try {
      // Build prompt from messages
      const systemMessage = messages.find(m => m.role === 'system')?.content || '';
      const userMessage = messages.find(m => m.role === 'user')?.content || '';
      
      const prompt = systemMessage 
        ? `${systemMessage}\n\n${userMessage}`
        : userMessage;

      const response = await fetch(this.API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        
        if (response.status === 500 && error.error?.includes('API key not configured')) {
          console.log('ℹ️ OpenAI API key not configured on server - using fallback');
          throw new Error('AI_NOT_CONFIGURED');
        }
        
        throw new Error(error.error?.message || 'OpenAI API request failed');
      }

      const data = await response.json();
      return data.content;
      
    } catch (error: any) {
      console.error('OpenAI API error:', error);
      
      if (error.message === 'AI_NOT_CONFIGURED') {
        throw error;
      }
      
      // Check if it's a network error
      if (error.message?.includes('Failed to fetch') || error.name === 'TypeError') {
        throw new Error('AI_NETWORK_ERROR');
      }
      
      throw new Error(error.message || 'AI_ERROR');
    }
  }

  /**
   * Generate care plan using AI
   */
  public async generateCarePlan(diagnosis: {
    code: string;
    name: string;
    severity: string;
  }): Promise<{
    nursingDiagnoses: string[];
    goals: Array<{ description: string; measurable: string; }>;
    interventions: Array<{ description: string; rationale: string; }>;
  }> {
    const prompt = `As an expert nurse educator, create a comprehensive nursing care plan for a patient with ${diagnosis.name} (${diagnosis.code}), severity: ${diagnosis.severity}.

Generate:
1. 3-4 nursing diagnoses (using NANDA-I terminology)
2. 2-3 SMART goals with measurable outcomes
3. 4-5 evidence-based nursing interventions with rationales

Format as JSON:
{
  "nursingDiagnoses": ["diagnosis 1", "diagnosis 2", ...],
  "goals": [{"description": "goal", "measurable": "outcome"}, ...],
  "interventions": [{"description": "intervention", "rationale": "why"}, ...]
}`;

    const messages: ChatMessage[] = [
      {
        role: 'system',
        content: 'You are an expert nurse educator specializing in evidence-based care planning. Provide detailed, clinically accurate nursing care plans.'
      },
      {
        role: 'user',
        content: prompt
      }
    ];

    const response = await this.chatCompletion(messages, {
      temperature: 0.7,
      maxTokens: 1500
    });

    // Parse JSON response
    try {
      const parsed = JSON.parse(response);
      return parsed;
    } catch (error) {
      console.error('Failed to parse care plan response:', error);
      // Return a default structure if parsing fails
      return {
        nursingDiagnoses: ['Requires comprehensive nursing assessment'],
        goals: [{ description: 'Patient will demonstrate improvement', measurable: 'Based on clinical indicators' }],
        interventions: [{ description: 'Perform nursing assessment', rationale: 'Establish baseline' }]
      };
    }
  }

  /**
   * Analyze note for predictive insights
   */
  public async analyzeClinicalNote(noteText: string): Promise<{
    risks: Array<{
      type: string;
      severity: string;
      description: string;
      recommendations: string[];
    }>;
  }> {
    const prompt = `Analyze this nursing note for potential clinical risks and early warning signs:

"${noteText}"

Identify any concerning patterns related to:
- Sepsis risk
- Deterioration
- Fall risk
- Cardiac complications
- Respiratory issues

Format as JSON:
{
  "risks": [
    {
      "type": "sepsis_risk" | "deterioration" | "fall_risk" | "cardiac" | "respiratory",
      "severity": "low" | "medium" | "high" | "critical",
      "description": "brief description",
      "recommendations": ["action 1", "action 2", ...]
    }
  ]
}`;

    const messages: ChatMessage[] = [
      {
        role: 'system',
        content: 'You are an expert clinical nurse analyzing patient notes for early warning signs and risk factors. Provide evidence-based assessments.'
      },
      {
        role: 'user',
        content: prompt
      }
    ];

    const response = await this.chatCompletion(messages, {
      temperature: 0.3, // Lower temperature for more consistent analysis
      maxTokens: 1000
    });

    try {
      const parsed = JSON.parse(response);
      return parsed;
    } catch (error) {
      console.error('Failed to parse clinical analysis:', error);
      return { risks: [] };
    }
  }

  /**
   * Generate bedside suggestions
   */
  public async generateBedsideSuggestions(context: {
    vitalSigns?: string;
    symptoms?: string;
    concerns?: string;
  }): Promise<{
    suggestions: Array<{
      priority: string;
      message: string;
      type: string;
    }>;
  }> {
    const prompt = `As a bedside clinical assistant, provide real-time suggestions based on:

Vital Signs: ${context.vitalSigns || 'Not provided'}
Symptoms: ${context.symptoms || 'Not provided'}
Concerns: ${context.concerns || 'Not provided'}

Generate 3-5 actionable suggestions for the nurse. Format as JSON:
{
  "suggestions": [
    {
      "priority": "high" | "medium" | "low",
      "message": "suggestion text",
      "type": "assessment" | "intervention" | "documentation" | "safety"
    }
  ]
}`;

    const messages: ChatMessage[] = [
      {
        role: 'system',
        content: 'You are an AI bedside assistant helping nurses with real-time clinical decision support.'
      },
      {
        role: 'user',
        content: prompt
      }
    ];

    const response = await this.chatCompletion(messages, {
      temperature: 0.5,
      maxTokens: 800
    });

    try {
      const parsed = JSON.parse(response);
      return parsed;
    } catch (error) {
      console.error('Failed to parse suggestions:', error);
      return { suggestions: [] };
    }
  }

  /**
   * Translate medical text
   */
  public async translateMedicalText(
    text: string,
    fromLang: string,
    toLang: string
  ): Promise<string> {
    const prompt = `Translate this medical text from ${fromLang} to ${toLang}, preserving all medical terminology accuracy:

"${text}"

Provide only the translation, no explanations.`;

    const messages: ChatMessage[] = [
      {
        role: 'system',
        content: 'You are a medical translator specializing in preserving clinical accuracy across languages.'
      },
      {
        role: 'user',
        content: prompt
      }
    ];

    return await this.chatCompletion(messages, {
      temperature: 0.3,
      maxTokens: 1000
    });
  }

  /**
   * Enhance transcription with medical context
   */
  public async enhanceTranscription(rawText: string): Promise<string> {
    const prompt = `Enhance this medical transcription by:
1. Correcting medical terminology
2. Adding proper punctuation
3. Organizing into logical sections
4. Maintaining original meaning

Raw transcription:
"${rawText}"

Return only the enhanced text.`;

    const messages: ChatMessage[] = [
      {
        role: 'system',
        content: 'You are a medical transcription specialist improving the quality and readability of clinical notes.'
      },
      {
        role: 'user',
        content: prompt
      }
    ];

    return await this.chatCompletion(messages, {
      temperature: 0.3,
      maxTokens: 1500
    });
  }

  /**
   * Initialize (no-op for serverless)
   * @deprecated API keys are now managed server-side only
   */
  public initialize(apiKey: string): void {
    console.warn('⚠️ initialize() is deprecated. API keys are now managed server-side via Netlify environment variables.');
  }

  /**
   * @deprecated API keys should not be stored client-side
   */
  public setApiKey(apiKey: string): void {
    console.warn('⚠️ setApiKey() is deprecated. API keys must be set as environment variables in Netlify.');
    toast.info('API keys are now managed securely on the server. Please set OPENAI_API_KEY in Netlify environment variables.');
  }

  /**
   * @deprecated API keys are managed server-side
   */
  public clearApiKey(): void {
    console.warn('⚠️ clearApiKey() is deprecated. API keys are managed server-side.');
  }

  /**
   * Get current model
   */
  public getModel(): string {
    return this.config.model;
  }

  /**
   * Set model
   */
  public setModel(model: string): void {
    this.config.model = model;
  }
}

// Export singleton
export const openaiService = new OpenAIService();
