/**
 * Conversational AI Service
 * Provides intelligent conversational AI capabilities for the nurse documentation app
 */

import { openaiService } from './openaiService';
import { ElevenLabsClient } from 'elevenlabs';

// Initialize ElevenLabs client
const elevenlabs = new ElevenLabsClient({
  apiKey: import.meta.env.VITE_ELEVENLABS_API_KEY || ''
});

export interface AIContext {
  currentTemplate?: string;
  currentNote?: string;
  transcription?: string;
  vitalSigns?: any;
  medications?: any[];
  recentActions?: string[];
  userPreferences?: any;
}

export interface AIResponse {
  message: string;
  actions?: Array<{
    type: string;
    label: string;
    data: any;
  }>;
  suggestions?: string[];
  autoExecute?: {
    action: string;
    data: any;
  };
}

class ConversationalAIService {
  private context: AIContext = {};
  private conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }> = [];

  /**
   * Update the AI context with current app state
   */
  public updateContext(updates: Partial<AIContext>): void {
    this.context = { ...this.context, ...updates };
  }

  /**
   * Get current context
   */
  public getContext(): AIContext {
    return { ...this.context };
  }

  /**
   * Clear conversation history
   */
  public clearHistory(): void {
    this.conversationHistory = [];
  }

  /**
   * Process user input and generate AI response
   */
  public async processInput(userInput: string): Promise<AIResponse> {
    // Add user message to history
    this.conversationHistory.push({
      role: 'user',
      content: userInput
    });

    // Check if OpenAI is configured
    if (openaiService.isConfigured()) {
      return await this.processWithOpenAI(userInput);
    } else {
      return this.processWithLocalAI(userInput);
    }
  }

  /**
   * Process with OpenAI for advanced conversational AI
   */
  private async processWithOpenAI(userInput: string): Promise<AIResponse> {
    try {
      const systemPrompt = this.buildSystemPrompt();
      const messages = [
        { role: 'system', content: systemPrompt },
        ...this.conversationHistory.slice(-10) // Keep last 10 messages for context
      ];

      const response = await openaiService.chatCompletion(
        messages.map(m => ({ role: m.role as 'system' | 'user' | 'assistant', content: m.content })),
        {
          temperature: 0.7,
          maxTokens: 500
        }
      );

      const aiMessage = typeof response === 'string' ? response : 'I apologize, but I encountered an error. Please try again.';

      // Add AI response to history
      this.conversationHistory.push({
        role: 'assistant',
        content: aiMessage
      });

      // Parse response for actions
      const parsedResponse = this.parseAIResponse(aiMessage, userInput);

      return parsedResponse;
    } catch (error) {
      console.error('OpenAI processing error:', error);
      return this.processWithLocalAI(userInput);
    }
  }

  /**
   * Build system prompt with current context
   */
  private buildSystemPrompt(): string {
    return `You are an intelligent AI assistant for Raha, a nursing documentation platform. Your role is to help nurses with:

1. Creating and editing clinical notes
2. Voice transcription and documentation
3. Template selection and guidance
4. ICD-10 code suggestions
5. Epic EMR integration
6. Compliance checking
7. Workflow optimization

Current Context:
${this.context.currentTemplate ? `- Current Template: ${this.context.currentTemplate}` : ''}
${this.context.currentNote ? `- Note in Progress: Yes` : ''}
${this.context.transcription ? `- Transcription Available: Yes` : ''}
${this.context.recentActions?.length ? `- Recent Actions: ${this.context.recentActions.join(', ')}` : ''}

Guidelines:
- Be concise and professional
- Provide actionable suggestions
- Use nursing terminology appropriately
- Offer specific actions when possible
- Be empathetic to nurse workflows
- Prioritize patient safety and compliance

When suggesting actions, format them as:
ACTION: [action_type] - [description]

Available actions:
- selectTemplate: Choose a documentation template
- startVoiceRecording: Begin voice transcription
- stopVoiceRecording: End voice transcription
- generateNote: Create structured note from transcription
- openICD10Search: Search for diagnosis codes
- export: Export note in various formats
- checkCompliance: Validate note completeness
- clearNote: Start a new note
- openVitalSigns: Open vital signs form

Respond naturally and helpfully to the user's request.`;
  }

  /**
   * Parse AI response for actions and suggestions
   */
  private parseAIResponse(aiMessage: string, userInput: string): AIResponse {
    const actions: Array<{ type: string; label: string; data: any }> = [];
    const suggestions: string[] = [];
    let autoExecute: { action: string; data: any } | undefined;

    // Extract actions from response
    const actionMatches = aiMessage.matchAll(/ACTION:\s*(\w+)\s*-\s*([^\n]+)/g);
    for (const match of actionMatches) {
      const actionType = match[1];
      const description = match[2];
      actions.push({
        type: actionType,
        label: description.trim(),
        data: {}
      });
    }

    // Clean message (remove action markers)
    let cleanMessage = aiMessage.replace(/ACTION:\s*\w+\s*-\s*[^\n]+\n?/g, '').trim();

    // Detect auto-execute scenarios
    const lowerInput = userInput.toLowerCase();
    if (lowerInput.includes('start') && lowerInput.includes('recording')) {
      autoExecute = { action: 'startVoiceRecording', data: {} };
    } else if (lowerInput.includes('stop') && lowerInput.includes('recording')) {
      autoExecute = { action: 'stopVoiceRecording', data: {} };
    } else if (lowerInput.includes('generate') && lowerInput.includes('note')) {
      autoExecute = { action: 'generateNote', data: {} };
    }

    return {
      message: cleanMessage,
      actions: actions.length > 0 ? actions : undefined,
      suggestions: suggestions.length > 0 ? suggestions : undefined,
      autoExecute
    };
  }

  /**
   * Process with local AI (rule-based) when OpenAI is not available
   */
  private processWithLocalAI(userInput: string): AIResponse {
    const lowerInput = userInput.toLowerCase();

    // Create note
    if (lowerInput.includes('create') && (lowerInput.includes('note') || lowerInput.includes('documentation'))) {
      return {
        message: "I'll help you create a new note. Which template would you like to use?",
        actions: [
          { type: 'selectTemplate', label: 'SOAP Template', data: { template: 'SOAP' } },
          { type: 'selectTemplate', label: 'SBAR Template', data: { template: 'SBAR' } },
          { type: 'selectTemplate', label: 'Epic Shift Assessment', data: { template: 'shift-assessment' } },
          { type: 'selectTemplate', label: 'MAR', data: { template: 'mar' } }
        ],
        suggestions: ['SOAP', 'SBAR', 'PIE', 'DAR', 'Epic Templates']
      };
    }

    // Voice recording
    if (lowerInput.includes('start') && (lowerInput.includes('voice') || lowerInput.includes('recording'))) {
      return {
        message: "Starting voice recording now. Speak clearly and I'll transcribe everything for you.",
        autoExecute: { action: 'startVoiceRecording', data: {} }
      };
    }

    if (lowerInput.includes('stop') && lowerInput.includes('recording')) {
      return {
        message: "Voice recording stopped. Would you like me to generate a structured note?",
        actions: [
          { type: 'generateNote', label: 'Generate Note', data: {} },
          { type: 'startVoiceRecording', label: 'Continue Recording', data: {} }
        ],
        autoExecute: { action: 'stopVoiceRecording', data: {} }
      };
    }

    // Generate note
    if (lowerInput.includes('generate') && lowerInput.includes('note')) {
      return {
        message: "Generating your note now using AI. This will structure your transcription into a professional clinical note.",
        autoExecute: { action: 'generateNote', data: {} }
      };
    }

    // ICD-10 codes
    if (lowerInput.includes('icd') || lowerInput.includes('diagnosis')) {
      return {
        message: "I can help you find ICD-10 codes. What condition or symptoms are you documenting?",
        actions: [
          { type: 'openICD10Search', label: 'Search ICD-10 Codes', data: {} }
        ],
        suggestions: ['Hypertension', 'Diabetes', 'Pneumonia', 'Chest pain']
      };
    }

    // Epic templates
    if (lowerInput.includes('epic')) {
      return {
        message: "Here are the available Epic templates for specialized documentation:",
        actions: [
          { type: 'selectTemplate', label: 'Shift Assessment', data: { template: 'shift-assessment' } },
          { type: 'selectTemplate', label: 'MAR', data: { template: 'mar' } },
          { type: 'selectTemplate', label: 'I&O', data: { template: 'io' } },
          { type: 'selectTemplate', label: 'Wound Care', data: { template: 'wound-care' } }
        ]
      };
    }

    // Export
    if (lowerInput.includes('export') || lowerInput.includes('save')) {
      return {
        message: "How would you like to export your note?",
        actions: [
          { type: 'export', label: 'Copy to Clipboard', data: { format: 'clipboard' } },
          { type: 'export', label: 'Download PDF', data: { format: 'pdf' } },
          { type: 'export', label: 'Epic Format', data: { format: 'epic' } }
        ]
      };
    }

    // Compliance check
    if (lowerInput.includes('compliance') || lowerInput.includes('check') || lowerInput.includes('validate')) {
      return {
        message: "I'll check your note for Epic compliance and completeness. This includes required fields, vital signs validation, and safety documentation.",
        autoExecute: { action: 'checkCompliance', data: {} }
      };
    }

    // Help
    if (lowerInput.includes('help') || lowerInput.includes('what can you')) {
      return {
        message: `I can help you with many tasks:

**Documentation:**
• Create notes with any template
• Voice-to-text transcription
• AI-powered note generation

**Epic Integration:**
• Epic-specific templates
• Compliance checking
• Export to Epic format

**Clinical Support:**
• ICD-10 code suggestions
• Medication documentation
• I&O calculations
• Wound care tracking

**Workflow:**
• Quick commands
• Template shortcuts
• Export options

Just tell me what you need!`,
        suggestions: ['Create note', 'Start recording', 'Epic templates', 'Export note']
      };
    }

    // Vital signs
    if (lowerInput.includes('vital') || lowerInput.includes('bp')) {
      return {
        message: "I can help you document vital signs. You can say them naturally or I can open the vital signs form.",
        actions: [
          { type: 'openVitalSigns', label: 'Open Vital Signs Form', data: {} }
        ],
        suggestions: ['BP 120/80', 'HR 72', 'Temp 98.6', 'O2 sat 98%']
      };
    }

    // Medication
    if (lowerInput.includes('medication') || lowerInput.includes('med')) {
      return {
        message: "I can help with medication documentation. Would you like to use the MAR template?",
        actions: [
          { type: 'selectTemplate', label: 'Open MAR Template', data: { template: 'mar' } }
        ]
      };
    }

    // Clear note
    if (lowerInput.includes('clear') || lowerInput.includes('new note')) {
      return {
        message: "Are you sure you want to clear the current note and start fresh?",
        actions: [
          { type: 'clearNote', label: 'Yes, Clear Note', data: {} }
        ]
      };
    }

    // Default response
    return {
      message: "I'm here to help! I can assist with creating notes, voice transcription, template selection, ICD-10 codes, Epic documentation, and more. What would you like to do?",
      suggestions: ['Create note', 'Start recording', 'Show templates', 'Help']
    };
  }

  /**
   * Get smart suggestions based on context
   */
  public getSmartSuggestions(): string[] {
    const suggestions: string[] = [];

    if (!this.context.currentTemplate) {
      suggestions.push('Create a new note');
      suggestions.push('Select a template');
    }

    if (this.context.currentTemplate && !this.context.transcription) {
      suggestions.push('Start voice recording');
      suggestions.push('Type your note');
    }

    if (this.context.transcription && !this.context.currentNote) {
      suggestions.push('Generate note from transcription');
    }

    if (this.context.currentNote) {
      suggestions.push('Check compliance');
      suggestions.push('Export note');
      suggestions.push('Add ICD-10 codes');
    }

    return suggestions;
  }

  /**
   * Execute an action
   */
  public async executeAction(actionType: string, data: any, callbacks: any): Promise<void> {
    this.context.recentActions = this.context.recentActions || [];
    this.context.recentActions.push(actionType);
    if (this.context.recentActions.length > 5) {
      this.context.recentActions.shift();
    }

    switch (actionType) {
      case 'selectTemplate':
        callbacks.onSelectTemplate?.(data.template);
        break;
      case 'startVoiceRecording':
        callbacks.onStartVoiceRecording?.();
        break;
      case 'stopVoiceRecording':
        callbacks.onStopVoiceRecording?.();
        break;
      case 'generateNote':
        callbacks.onGenerateNote?.();
        break;
      case 'openICD10Search':
        callbacks.onOpenICD10Search?.();
        break;
      case 'export':
        callbacks.onExport?.(data.format);
        break;
      case 'checkCompliance':
        callbacks.onCheckCompliance?.();
        break;
      case 'clearNote':
        callbacks.onClearNote?.();
        break;
      case 'openVitalSigns':
        callbacks.onOpenVitalSigns?.();
        break;
      default:
        console.warn('Unknown action type:', actionType);
    }
  }

  /**
   * Get conversation summary
   */
  public getConversationSummary(): string {
    if (this.conversationHistory.length === 0) {
      return 'No conversation yet';
    }

    const messageCount = this.conversationHistory.length;
    const userMessages = this.conversationHistory.filter(m => m.role === 'user').length;
    const assistantMessages = this.conversationHistory.filter(m => m.role === 'assistant').length;

    return `${messageCount} messages (${userMessages} from you, ${assistantMessages} from AI)`;
  }

  /**
   * Speak AI response using ElevenLabs text-to-speech
   */
  public async speakResponse(text: string): Promise<void> {
    try {
      // Check if ElevenLabs is configured
      if (!import.meta.env.VITE_ELEVENLABS_API_KEY) {
        console.warn('ElevenLabs API key not configured');
        return;
      }

      console.log('🎤 Speaking response with ElevenLabs...');

      // Generate audio using ElevenLabs
      const audio = await elevenlabs.generate({
        voice: "Rachel", // Professional female voice
        text: text,
        model_id: "eleven_monolingual_v1"
      });

      // Convert the audio stream to array buffer
      const chunks: Uint8Array[] = [];
      for await (const chunk of audio) {
        chunks.push(chunk);
      }

      // Combine chunks into single buffer
      const totalLength = chunks.reduce((acc, chunk) => acc + chunk.length, 0);
      const audioData = new Uint8Array(totalLength);
      let offset = 0;
      for (const chunk of chunks) {
        audioData.set(chunk, offset);
        offset += chunk.length;
      }

      // Play the audio
      const audioContext = new AudioContext();
      const audioBuffer = await audioContext.decodeAudioData(audioData.buffer);
      const source = audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioContext.destination);
      source.start();

      console.log('✅ Audio playback started');
    } catch (error) {
      console.error('ElevenLabs error:', error);
      // Fail silently - don't interrupt user experience
    }
  }

  /**
   * Check if voice output is available
   */
  public isVoiceAvailable(): boolean {
    return !!import.meta.env.VITE_ELEVENLABS_API_KEY;
  }
}

// Export singleton instance
export const conversationalAIService = new ConversationalAIService();

export default conversationalAIService;
