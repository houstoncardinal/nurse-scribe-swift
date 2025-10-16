/**
 * Real Voice Recognition Service using Web Speech API
 * Replaces mock/simulated voice recognition with actual speech-to-text
 */

export interface VoiceRecognitionResult {
  transcript: string;
  confidence: number;
  isFinal: boolean;
  error?: string;
}

export interface VoiceRecognitionConfig {
  language: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
}

export class RealVoiceRecognitionService {
  private recognition: any;
  private isSupported: boolean = false;
  private isListening: boolean = false;
  private config: VoiceRecognitionConfig;
  private onResultCallback?: (result: VoiceRecognitionResult) => void;
  private onErrorCallback?: (error: string) => void;
  private onStartCallback?: () => void;
  private onEndCallback?: () => void;

  constructor(config: Partial<VoiceRecognitionConfig> = {}) {
    this.config = {
      language: 'en-US',
      continuous: false,
      interimResults: true,
      maxAlternatives: 1,
      ...config
    };

    this.initializeRecognition();
  }

  private initializeRecognition(): void {
    // Check for browser support
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      console.warn('Speech recognition not supported in this browser');
      this.isSupported = false;
      return;
    }

    try {
      // Use the appropriate SpeechRecognition API
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      this.recognition = new SpeechRecognition();
      
      // Configure recognition settings
      this.recognition.continuous = this.config.continuous;
      this.recognition.interimResults = this.config.interimResults;
      this.recognition.lang = this.config.language;
      this.recognition.maxAlternatives = this.config.maxAlternatives;

      // Set up event handlers
      this.setupEventHandlers();
      
      this.isSupported = true;
      console.log('Voice recognition initialized successfully');
    } catch (error) {
      console.error('Failed to initialize voice recognition:', error);
      this.isSupported = false;
    }
  }

  private setupEventHandlers(): void {
    if (!this.recognition) return;

    // Handle recognition results
    this.recognition.onresult = (event: any) => {
      const result = event.results[event.results.length - 1];
      const transcript = result[0].transcript;
      const confidence = result[0].confidence || 0.8; // Default confidence if not provided
      const isFinal = result.isFinal;

      if (this.onResultCallback) {
        this.onResultCallback({
          transcript: transcript.trim(),
          confidence,
          isFinal,
        });
      }
    };

    // Handle recognition errors
    this.recognition.onerror = (event: any) => {
      console.error('Voice recognition error:', event.error);
      this.isListening = false;

      if (this.onErrorCallback) {
        this.onErrorCallback(event.error);
      }
    };

    // Handle recognition start
    this.recognition.onstart = () => {
      this.isListening = true;
      console.log('Voice recognition started');
      
      if (this.onStartCallback) {
        this.onStartCallback();
      }
    };

    // Handle recognition end
    this.recognition.onend = () => {
      this.isListening = false;
      console.log('Voice recognition ended');
      
      if (this.onEndCallback) {
        this.onEndCallback();
      }
    };

    // Handle speech start
    this.recognition.onspeechstart = () => {
      console.log('Speech detected');
    };

    // Handle speech end
    this.recognition.onspeechend = () => {
      console.log('Speech ended');
    };

    // Handle no speech detected
    this.recognition.onnomatch = () => {
      console.log('No speech detected');
      
      if (this.onErrorCallback) {
        this.onErrorCallback('No speech detected');
      }
    };
  }

  /**
   * Start listening for speech
   */
  public startListening(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.isSupported) {
        reject(new Error('Speech recognition not supported'));
        return;
      }

      if (this.isListening) {
        console.warn('Already listening');
        resolve();
        return;
      }

      try {
        this.recognition.start();
        resolve();
      } catch (error) {
        console.error('Failed to start voice recognition:', error);
        reject(error);
      }
    });
  }

  /**
   * Stop listening for speech
   */
  public stopListening(): void {
    if (!this.isSupported || !this.isListening) {
      return;
    }

    try {
      this.recognition.stop();
      this.isListening = false;
    } catch (error) {
      console.error('Failed to stop voice recognition:', error);
    }
  }

  /**
   * Abort current recognition session
   */
  public abortListening(): void {
    if (!this.isSupported || !this.isListening) {
      return;
    }

    try {
      this.recognition.abort();
      this.isListening = false;
    } catch (error) {
      console.error('Failed to abort voice recognition:', error);
    }
  }

  /**
   * Check if currently listening
   */
  public getIsListening(): boolean {
    return this.isListening;
  }

  /**
   * Check if speech recognition is supported
   */
  public getIsSupported(): boolean {
    return this.isSupported;
  }

  /**
   * Update configuration
   */
  public updateConfig(newConfig: Partial<VoiceRecognitionConfig>): void {
    this.config = { ...this.config, ...newConfig };
    
    if (this.recognition) {
      this.recognition.continuous = this.config.continuous;
      this.recognition.interimResults = this.config.interimResults;
      this.recognition.lang = this.config.language;
      this.recognition.maxAlternatives = this.config.maxAlternatives;
    }
  }

  /**
   * Set callbacks for recognition events
   */
  public setCallbacks(callbacks: {
    onResult?: (result: VoiceRecognitionResult) => void;
    onError?: (error: string) => void;
    onStart?: () => void;
    onEnd?: () => void;
  }): void {
    this.onResultCallback = callbacks.onResult;
    this.onErrorCallback = callbacks.onError;
    this.onStartCallback = callbacks.onStart;
    this.onEndCallback = callbacks.onEnd;
  }

  /**
   * Get available languages (if supported)
   */
  public getAvailableLanguages(): string[] {
    // Common languages supported by most browsers
    return [
      'en-US', 'en-GB', 'en-AU', 'en-CA',
      'es-ES', 'es-MX', 'es-AR',
      'fr-FR', 'fr-CA',
      'de-DE', 'it-IT', 'pt-BR', 'pt-PT',
      'ru-RU', 'ja-JP', 'ko-KR', 'zh-CN'
    ];
  }

  /**
   * Check microphone permissions
   */
  public async checkMicrophonePermissions(): Promise<boolean> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop());
      return true;
    } catch (error) {
      console.error('Microphone permission denied:', error);
      return false;
    }
  }

  /**
   * Request microphone permissions
   */
  public async requestMicrophonePermissions(): Promise<boolean> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 44100
        }
      });
      stream.getTracks().forEach(track => track.stop());
      return true;
    } catch (error) {
      console.error('Failed to get microphone access:', error);
      return false;
    }
  }
}

// Create a singleton instance
export const voiceRecognitionService = new RealVoiceRecognitionService();

// Type definitions for browser APIs
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}
