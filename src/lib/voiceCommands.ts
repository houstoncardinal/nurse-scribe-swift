/**
 * Voice Commands System for Hands-Free Operation
 * Enables voice control of the NovaCare application
 */

export interface VoiceCommand {
  id: string;
  phrases: string[];
  action: string;
  description: string;
  category: 'navigation' | 'workflow' | 'template' | 'export' | 'utility';
  requiresAuth?: boolean;
}

export interface CommandResult {
  success: boolean;
  command: string;
  action: string;
  confidence: number;
  error?: string;
}

export interface VoiceCommandConfig {
  sensitivity: number; // 0.0 - 1.0
  timeout: number; // milliseconds
  continuous: boolean;
  language: string;
}

class VoiceCommandProcessor {
  private commands: VoiceCommand[] = [];
  private config: VoiceCommandConfig;
  private recognition: any = null;
  private isListening = false;
  private onCommandCallback: ((result: CommandResult) => void) | null = null;

  constructor(config: Partial<VoiceCommandConfig> = {}) {
    this.config = {
      sensitivity: 0.7,
      timeout: 5000,
      continuous: false,
      language: 'en-US',
      ...config,
    };

    this.initializeCommands();
    this.setupRecognition();
  }

  /**
   * Initialize the command set
   */
  private initializeCommands(): void {
    this.commands = [
      // Navigation Commands
      {
        id: 'new_note',
        phrases: ['new note', 'start new', 'begin new note', 'create new note'],
        action: 'new_note',
        description: 'Start a new clinical note',
        category: 'navigation',
      },
      {
        id: 'clear_all',
        phrases: ['clear all', 'reset', 'start over', 'clear everything'],
        action: 'clear_all',
        description: 'Clear all content and start fresh',
        category: 'navigation',
      },

      // Workflow Commands
      {
        id: 'start_dictation',
        phrases: ['start recording', 'begin dictation', 'start speaking', 'record now'],
        action: 'start_dictation',
        description: 'Start voice dictation',
        category: 'workflow',
      },
      {
        id: 'stop_dictation',
        phrases: ['stop recording', 'end dictation', 'stop speaking', 'finish recording'],
        action: 'stop_dictation',
        description: 'Stop voice dictation',
        category: 'workflow',
      },
      {
        id: 'redact_phi',
        phrases: ['redact phi', 'protect data', 'remove sensitive', 'secure content'],
        action: 'redact_phi',
        description: 'Run PHI redaction on transcript',
        category: 'workflow',
      },
      {
        id: 'generate_note',
        phrases: ['generate note', 'compose note', 'create draft', 'make note'],
        action: 'generate_note',
        description: 'Generate AI clinical note',
        category: 'workflow',
      },

      // Template Commands
      {
        id: 'soap_note',
        phrases: ['soap note', 'soap format', 'use soap', 'soap template'],
        action: 'set_template_soap',
        description: 'Switch to SOAP note template',
        category: 'template',
      },
      {
        id: 'sbar_note',
        phrases: ['sbar note', 'sbar format', 'use sbar', 'sbar template'],
        action: 'set_template_sbar',
        description: 'Switch to SBAR note template',
        category: 'template',
      },
      {
        id: 'pie_note',
        phrases: ['pie note', 'pie format', 'use pie', 'pie template'],
        action: 'set_template_pie',
        description: 'Switch to PIE note template',
        category: 'template',
      },
      {
        id: 'assessment_note',
        phrases: ['assessment note', 'assessment format', 'use assessment'],
        action: 'set_template_assessment',
        description: 'Switch to Assessment note template',
        category: 'template',
      },

      // Export Commands
      {
        id: 'export_pdf',
        phrases: ['export pdf', 'save pdf', 'download pdf', 'create pdf'],
        action: 'export_pdf',
        description: 'Export note as PDF',
        category: 'export',
      },
      {
        id: 'export_text',
        phrases: ['export text', 'save text', 'download text', 'copy text'],
        action: 'export_text',
        description: 'Export note as text',
        category: 'export',
      },
      {
        id: 'copy_clipboard',
        phrases: ['copy to clipboard', 'copy note', 'copy text', 'clipboard'],
        action: 'copy_clipboard',
        description: 'Copy note to clipboard',
        category: 'export',
      },

      // Utility Commands
      {
        id: 'read_back',
        phrases: ['read back', 'read note', 'play audio', 'speak note'],
        action: 'read_back',
        description: 'Read the note aloud',
        category: 'utility',
      },
      {
        id: 'help',
        phrases: ['help', 'commands', 'what can you do', 'show commands'],
        action: 'show_help',
        description: 'Show available voice commands',
        category: 'utility',
      },
      {
        id: 'settings',
        phrases: ['settings', 'configure', 'setup', 'preferences'],
        action: 'open_settings',
        description: 'Open settings panel',
        category: 'utility',
      },
      {
        id: 'dark_mode',
        phrases: ['dark mode', 'toggle dark', 'switch theme', 'dark theme'],
        action: 'toggle_dark_mode',
        description: 'Toggle dark/light mode',
        category: 'utility',
      },
    ];
  }

  /**
   * Setup speech recognition
   */
  private setupRecognition(): void {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      console.warn('Speech recognition not supported');
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    this.recognition = new SpeechRecognition();
    
    this.recognition.continuous = this.config.continuous;
    this.recognition.interimResults = false;
    this.recognition.lang = this.config.language;
    this.recognition.maxAlternatives = 1;

    this.recognition.onresult = (event: any) => {
      const transcript = event.results[event.results.length - 1][0].transcript.toLowerCase().trim();
      const confidence = event.results[event.results.length - 1][0].confidence;
      
      this.processCommand(transcript, confidence);
    };

    this.recognition.onerror = (event: any) => {
      console.error('Voice command recognition error:', event.error);
      
      if (this.onCommandCallback) {
        this.onCommandCallback({
          success: false,
          command: '',
          action: '',
          confidence: 0,
          error: event.error,
        });
      }
    };

    this.recognition.onend = () => {
      this.isListening = false;
      
      if (this.config.continuous) {
        // Restart if continuous mode
        setTimeout(() => {
          if (this.isListening) {
            this.startListening();
          }
        }, 100);
      }
    };
  }

  /**
   * Process recognized speech for commands
   */
  private processCommand(transcript: string, confidence: number): void {
    if (confidence < this.config.sensitivity) {
      return;
    }

    // Find matching command
    const matchedCommand = this.findMatchingCommand(transcript);
    
    if (matchedCommand && this.onCommandCallback) {
      const result: CommandResult = {
        success: true,
        command: transcript,
        action: matchedCommand.action,
        confidence,
      };
      
      this.onCommandCallback(result);
    }
  }

  /**
   * Find the best matching command for the transcript
   */
  private findMatchingCommand(transcript: string): VoiceCommand | null {
    let bestMatch: VoiceCommand | null = null;
    let bestScore = 0;

    for (const command of this.commands) {
      for (const phrase of command.phrases) {
        const score = this.calculateSimilarity(transcript, phrase);
        if (score > bestScore && score >= this.config.sensitivity) {
          bestScore = score;
          bestMatch = command;
        }
      }
    }

    return bestMatch;
  }

  /**
   * Calculate similarity between transcript and command phrase
   */
  private calculateSimilarity(text1: string, text2: string): number {
    const words1 = text1.split(' ');
    const words2 = text2.split(' ');
    
    let matches = 0;
    const totalWords = Math.max(words1.length, words2.length);
    
    for (const word1 of words1) {
      for (const word2 of words2) {
        if (word1 === word2 || word1.includes(word2) || word2.includes(word1)) {
          matches++;
          break;
        }
      }
    }
    
    return matches / totalWords;
  }

  /**
   * Start listening for voice commands
   */
  startListening(): void {
    if (!this.recognition || this.isListening) {
      return;
    }

    try {
      this.isListening = true;
      this.recognition.start();
    } catch (error) {
      console.error('Failed to start voice command recognition:', error);
      this.isListening = false;
    }
  }

  /**
   * Stop listening for voice commands
   */
  stopListening(): void {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
  }

  /**
   * Set callback for command recognition
   */
  onCommand(callback: (result: CommandResult) => void): void {
    this.onCommandCallback = callback;
  }

  /**
   * Get all available commands
   */
  getCommands(): VoiceCommand[] {
    return [...this.commands];
  }

  /**
   * Get commands by category
   */
  getCommandsByCategory(category: VoiceCommand['category']): VoiceCommand[] {
    return this.commands.filter(command => command.category === category);
  }

  /**
   * Update configuration
   */
  updateConfig(newConfig: Partial<VoiceCommandConfig>): void {
    this.config = { ...this.config, ...newConfig };
    
    if (this.recognition) {
      this.recognition.continuous = this.config.continuous;
      this.recognition.lang = this.config.language;
    }
  }

  /**
   * Check if voice commands are supported
   */
  isSupported(): boolean {
    return 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
  }

  /**
   * Check if currently listening
   */
  isActive(): boolean {
    return this.isListening;
  }

  /**
   * Get current configuration
   */
  getConfig(): VoiceCommandConfig {
    return { ...this.config };
  }

  /**
   * Add custom command
   */
  addCommand(command: VoiceCommand): void {
    this.commands.push(command);
  }

  /**
   * Remove command by ID
   */
  removeCommand(commandId: string): void {
    this.commands = this.commands.filter(command => command.id !== commandId);
  }
}

// Export singleton instance
export const voiceCommandProcessor = new VoiceCommandProcessor();

// Command action handlers (to be implemented by the main app)
export interface CommandHandlers {
  new_note: () => void;
  clear_all: () => void;
  start_dictation: () => void;
  stop_dictation: () => void;
  redact_phi: () => void;
  generate_note: () => void;
  set_template_soap: () => void;
  set_template_sbar: () => void;
  set_template_pie: () => void;
  set_template_assessment: () => void;
  export_pdf: () => void;
  export_text: () => void;
  copy_clipboard: () => void;
  read_back: () => void;
  show_help: () => void;
  open_settings: () => void;
  toggle_dark_mode: () => void;
}

/**
 * Command execution helper
 */
export function executeCommand(action: string, handlers: Partial<CommandHandlers>): boolean {
  const handler = handlers[action as keyof CommandHandlers];
  
  if (handler) {
    handler();
    return true;
  }
  
  console.warn(`No handler found for command: ${action}`);
  return false;
}
