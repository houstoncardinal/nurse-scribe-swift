/**
 * ElevenLabs Text-to-Speech Integration
 * Provides professional voice readback with browser fallback
 */

export interface ElevenLabsConfig {
  apiKey: string;
  voiceId: string;
  modelId?: string;
  voiceSettings?: {
    stability: number;
    similarityBoost: number;
    style?: number;
    useSpeakerBoost?: boolean;
  };
}

export interface SpeechResult {
  audioUrl: string;
  duration: number;
  voice: string;
  text: string;
  success: boolean;
  error?: string;
}

export interface Voice {
  voice_id: string;
  name: string;
  category: string;
  description?: string;
  preview_url?: string;
}

class ElevenLabsTTS {
  private config: ElevenLabsConfig;
  private isInitialized = false;

  constructor(config: ElevenLabsConfig) {
    this.config = {
      modelId: 'eleven_multilingual_v2',
      voiceSettings: {
        stability: 0.5,
        similarityBoost: 0.75,
        style: 0.0,
        useSpeakerBoost: true,
      },
      ...config,
    };
    this.isInitialized = !!config.apiKey;
  }

  /**
   * Get available voices from ElevenLabs
   */
  async getVoices(): Promise<Voice[]> {
    if (!this.config.apiKey) {
      throw new Error('ElevenLabs API key not configured');
    }

    try {
      const response = await fetch('https://api.elevenlabs.io/v1/voices', {
        headers: {
          'xi-api-key': this.config.apiKey,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch voices: ${response.statusText}`);
      }

      const data = await response.json();
      return data.voices || [];
    } catch (error) {
      console.error('Failed to fetch ElevenLabs voices:', error);
      throw error;
    }
  }

  /**
   * Get voice details
   */
  async getVoice(voiceId: string): Promise<Voice> {
    if (!this.config.apiKey) {
      throw new Error('ElevenLabs API key not configured');
    }

    try {
      const response = await fetch(`https://api.elevenlabs.io/v1/voices/${voiceId}`, {
        headers: {
          'xi-api-key': this.config.apiKey,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch voice: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to fetch voice details:', error);
      throw error;
    }
  }

  /**
   * Convert text to speech using ElevenLabs
   */
  async synthesize(text: string, options: Partial<ElevenLabsConfig> = {}): Promise<SpeechResult> {
    if (!this.isInitialized || !this.config.apiKey) {
      throw new Error('ElevenLabs not initialized or API key missing');
    }

    const config = { ...this.config, ...options };
    const startTime = Date.now();

    try {
      const response = await fetch(
        `https://api.elevenlabs.io/v1/text-to-speech/${config.voiceId}`,
        {
          method: 'POST',
          headers: {
            'xi-api-key': config.apiKey,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            text,
            model_id: config.modelId,
            voice_settings: config.voiceSettings,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`ElevenLabs API error: ${response.status} ${errorData}`);
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const duration = Date.now() - startTime;

      return {
        audioUrl,
        duration,
        voice: config.voiceId,
        text,
        success: true,
      };
    } catch (error) {
      console.error('ElevenLabs synthesis failed:', error);
      return {
        audioUrl: '',
        duration: 0,
        voice: config.voiceId,
        text,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Play audio from URL
   */
  async playAudio(audioUrl: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const audio = new Audio(audioUrl);
      
      audio.onended = () => {
        URL.revokeObjectURL(audioUrl);
        resolve();
      };
      
      audio.onerror = (error) => {
        URL.revokeObjectURL(audioUrl);
        reject(new Error('Failed to play audio'));
      };
      
      audio.play().catch(reject);
    });
  }

  /**
   * Update configuration
   */
  updateConfig(newConfig: Partial<ElevenLabsConfig>): void {
    this.config = { ...this.config, ...newConfig };
    this.isInitialized = !!this.config.apiKey;
  }

  /**
   * Check if service is available
   */
  isAvailable(): boolean {
    return this.isInitialized && !!this.config.apiKey;
  }
}

/**
 * Browser Speech Synthesis Fallback
 */
class BrowserSpeechSynthesis {
  private voices: SpeechSynthesisVoice[] = [];
  private selectedVoice: SpeechSynthesisVoice | null = null;

  constructor() {
    this.loadVoices();
    
    // Reload voices when they become available
    if (speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = () => this.loadVoices();
    }
  }

  private loadVoices(): void {
    this.voices = speechSynthesis.getVoices();
    
    // Select a professional-sounding voice
    this.selectedVoice = this.voices.find(voice => 
      voice.name.includes('Google') && 
      voice.lang.startsWith('en') &&
      !voice.name.includes('Enhanced')
    ) || this.voices.find(voice => 
      voice.lang.startsWith('en') && 
      voice.default
    ) || this.voices[0];
  }

  /**
   * Synthesize speech using browser API
   */
  async synthesize(text: string): Promise<SpeechResult> {
    return new Promise((resolve, reject) => {
      if (!speechSynthesis) {
        reject(new Error('Speech synthesis not supported'));
        return;
      }

      const utterance = new SpeechSynthesisUtterance(text);
      
      if (this.selectedVoice) {
        utterance.voice = this.selectedVoice;
      }
      
      // Configure for medical/professional speech
      utterance.rate = 0.9; // Slightly slower for clarity
      utterance.pitch = 1.0; // Normal pitch
      utterance.volume = 1.0;
      utterance.lang = 'en-US';

      const startTime = Date.now();

      utterance.onend = () => {
        const duration = Date.now() - startTime;
        resolve({
          audioUrl: '', // No URL for browser synthesis
          duration,
          voice: this.selectedVoice?.name || 'Browser Default',
          text,
          success: true,
        });
      };

      utterance.onerror = (error) => {
        reject(new Error(`Speech synthesis failed: ${error.error}`));
      };

      speechSynthesis.speak(utterance);
    });
  }

  /**
   * Play synthesized speech
   */
  async playAudio(audioUrl: string): Promise<void> {
    // Browser synthesis plays immediately, no URL needed
    return Promise.resolve();
  }

  /**
   * Stop current speech
   */
  stop(): void {
    speechSynthesis.cancel();
  }

  /**
   * Check if service is available
   */
  isAvailable(): boolean {
    return 'speechSynthesis' in window;
  }

  /**
   * Get available voices
   */
  getVoices(): SpeechSynthesisVoice[] {
    return this.voices;
  }
}

/**
 * Main text-to-speech service
 */
export class TextToSpeechService {
  private elevenlabs: ElevenLabsTTS | null = null;
  private browserSynthesis: BrowserSpeechSynthesis;
  private preferredEngine: 'elevenlabs' | 'browser' = 'elevenlabs';

  constructor() {
    this.browserSynthesis = new BrowserSpeechSynthesis();
  }

  /**
   * Initialize ElevenLabs service
   */
  initializeElevenLabs(config: ElevenLabsConfig): void {
    this.elevenlabs = new ElevenLabsTTS(config);
    this.preferredEngine = this.elevenlabs.isAvailable() ? 'elevenlabs' : 'browser';
  }

  /**
   * Convert text to speech using the best available engine
   */
  async synthesize(text: string, voiceId?: string): Promise<SpeechResult> {
    if (this.preferredEngine === 'elevenlabs' && this.elevenlabs?.isAvailable()) {
      const config = voiceId ? { voiceId } : {};
      return this.elevenlabs.synthesize(text, config);
    } else if (this.browserSynthesis.isAvailable()) {
      return this.browserSynthesis.synthesize(text);
    } else {
      throw new Error('No text-to-speech engine available');
    }
  }

  /**
   * Play audio from result
   */
  async playAudio(result: SpeechResult): Promise<void> {
    if (result.audioUrl) {
      // ElevenLabs result with audio URL
      if (this.elevenlabs) {
        return this.elevenlabs.playAudio(result.audioUrl);
      }
    } else {
      // Browser synthesis (already playing)
      return Promise.resolve();
    }
  }

  /**
   * Stop current speech
   */
  stop(): void {
    this.browserSynthesis.stop();
  }

  /**
   * Get available voices
   */
  async getVoices(): Promise<Voice[]> {
    if (this.elevenlabs?.isAvailable()) {
      return this.elevenlabs.getVoices();
    } else {
      // Convert browser voices to our format
      return this.browserSynthesis.getVoices().map(voice => ({
        voice_id: voice.name,
        name: voice.name,
        category: 'browser',
        description: `${voice.name} (${voice.lang})`,
      }));
    }
  }

  /**
   * Set preferred engine
   */
  setPreferredEngine(engine: 'elevenlabs' | 'browser'): void {
    this.preferredEngine = engine;
  }

  /**
   * Get available engines
   */
  getAvailableEngines(): { elevenlabs: boolean; browser: boolean } {
    return {
      elevenlabs: this.elevenlabs?.isAvailable() || false,
      browser: this.browserSynthesis.isAvailable(),
    };
  }

  /**
   * Check if service is ready
   */
  isReady(): boolean {
    return this.elevenlabs?.isAvailable() || this.browserSynthesis.isAvailable();
  }
}

// Export singleton instance
export const ttsService = new TextToSpeechService();

// Medical voice recommendations
export const MEDICAL_VOICES = {
  professional: 'EXAVITQu4vr4xnSDxMaL', // Professional, clear
  clinical: 'AZnzlk1XvdvUeBnXmlld',    // Clinical, authoritative
  friendly: 'VR6AewLTigWG4xSOukaG',     // Friendly, approachable
  neutral: 'pNInz6obpgDQGcFmaJgB',      // Neutral, professional
};
