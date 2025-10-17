/**
 * OpenAI Service
 * Production-ready AI service using OpenAI API
 */

import { toast } from 'sonner';

interface OpenAIConfig {
  apiKey: string;
  model: string;
  temperature: number;
  maxTokens: number;
}

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface CompletionResponse {
  choices: Array<{
    message: {
      content: string;
    };
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

class OpenAIService {
  private config: OpenAIConfig = {
    apiKey: '',
    model: 'gpt-4-turbo-preview',
    temperature: 0.7,
    maxTokens: 2000
  };

  private baseURL = 'https://api.openai.com/v1';

  /**
   * Initialize OpenAI service with API key
   */
  public initialize(apiKey: string): void {
    this.config.apiKey = apiKey;
    console.log('✅ OpenAI service initialized');
  }

  /**
   * Check if service is configured
   */
  public isConfigured(): boolean {
    return !!this.config.apiKey;
  }

  /**
   * Get API key from localStorage, environment, or import.meta.env
   */
  private getApiKey(): string {
    // Try localStorage first (user-configured)
    const storedKey = localStorage.getItem('openai_api_key');
    if (storedKey) {
      return storedKey;
    }

    // Try Vite environment variable (for Netlify deployment)
    if (import.meta.env.VITE_OPENAI_API_KEY) {
      return import.meta.env.VITE_OPENAI_API_KEY;
    }

    // Try config
    if (this.config.apiKey) {
      return this.config.apiKey;
    }

    // Return empty if not found (will use templates)
    return '';
  }

  /**
   * Chat completion with OpenAI
   */
  public async chatCompletion(
    messages: ChatMessage[],
    options?: Partial<OpenAIConfig>
  ): Promise<string> {
    const apiKey = this.getApiKey();
    
    if (!apiKey) {
      console.log('ℹ️ OpenAI API key not found - using template fallback');
      throw new Error('AI_NOT_CONFIGURED');
    }

    try {
      const response = await fetch(`${this.baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: options?.model || this.config.model,
          messages,
          temperature: options?.temperature || this.config.temperature,
          max_tokens: options?.maxTokens || this.config.maxTokens
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'OpenAI API request failed');
      }

      const data: CompletionResponse = await response.json();
      return data.choices[0].message.content;
      
    } catch (error: any) {
      console.error('OpenAI API error:', error);
      
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
   * Set API key
   */
  public setApiKey(apiKey: string): void {
    this.config.apiKey = apiKey;
    localStorage.setItem('openai_api_key', apiKey);
    toast.success('OpenAI API key saved');
  }

  /**
   * Clear API key
   */
  public clearApiKey(): void {
    this.config.apiKey = '';
    localStorage.removeItem('openai_api_key');
    toast.info('OpenAI API key cleared');
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
