/**
 * Whisper WebAssembly Integration for Local Voice Transcription
 * Provides offline-first speech recognition with browser fallback
 */

export interface WhisperConfig {
  model: 'tiny' | 'base' | 'small' | 'medium';
  language: string;
  temperature: number;
  maxTokens: number;
}

export interface TranscriptionResult {
  text: string;
  confidence: number;
  duration: number;
  language?: string;
  segments?: Array<{
    start: number;
    end: number;
    text: string;
    confidence: number;
  }>;
}

export interface SpeakerSegment {
  speaker: 'nurse' | 'patient' | 'other';
  start: number;
  end: number;
  text: string;
  confidence: number;
}

class WhisperTranscriber {
  private worker: Worker | null = null;
  private isInitialized = false;
  private config: WhisperConfig;
  private isProcessing = false;

  constructor(config: Partial<WhisperConfig> = {}) {
    this.config = {
      model: 'base',
      language: 'en',
      temperature: 0.0,
      maxTokens: 448,
      ...config,
    };
  }

  /**
   * Initialize Whisper WebAssembly worker
   */
  async initialize(): Promise<boolean> {
    if (this.isInitialized) return true;

    try {
      // Check if WebAssembly is supported
      if (!WebAssembly) {
        console.warn('WebAssembly not supported, falling back to browser speech recognition');
        return false;
      }

      // Create Web Worker for Whisper processing
      this.worker = new Worker('/whisper-worker.js');
      
      return new Promise((resolve) => {
        if (!this.worker) {
          resolve(false);
          return;
        }

        this.worker.onmessage = (event) => {
          const { type, data } = event.data;
          
          if (type === 'initialized') {
            this.isInitialized = true;
            console.log('Whisper WebAssembly initialized successfully');
            resolve(true);
          } else if (type === 'error') {
            console.error('Whisper initialization failed:', data);
            resolve(false);
          }
        };

        this.worker.onerror = (error) => {
          console.error('Whisper worker error:', error);
          resolve(false);
        };

        // Send initialization command
        this.worker.postMessage({
          type: 'init',
          config: this.config,
        });

        // Timeout after 30 seconds
        setTimeout(() => {
          if (!this.isInitialized) {
            console.warn('Whisper initialization timeout');
            resolve(false);
          }
        }, 30000);
      });
    } catch (error) {
      console.error('Failed to initialize Whisper:', error);
      return false;
    }
  }

  /**
   * Transcribe audio using Whisper WebAssembly
   */
  async transcribe(audioBlob: Blob): Promise<TranscriptionResult> {
    if (!this.isInitialized || !this.worker) {
      throw new Error('Whisper not initialized');
    }

    if (this.isProcessing) {
      throw new Error('Transcription already in progress');
    }

    this.isProcessing = true;
    const startTime = Date.now();

    try {
      // Convert audio blob to array buffer
      const arrayBuffer = await audioBlob.arrayBuffer();
      
      return new Promise((resolve, reject) => {
        if (!this.worker) {
          reject(new Error('Worker not available'));
          return;
        }

        const timeout = setTimeout(() => {
          reject(new Error('Transcription timeout'));
        }, 60000); // 60 second timeout

        this.worker.onmessage = (event) => {
          const { type, data } = event.data;
          
          if (type === 'transcription') {
            clearTimeout(timeout);
            this.isProcessing = false;
            
            const result: TranscriptionResult = {
              text: data.text,
              confidence: data.confidence || 0.9,
              duration: Date.now() - startTime,
              language: data.language,
              segments: data.segments,
            };
            
            resolve(result);
          } else if (type === 'error') {
            clearTimeout(timeout);
            this.isProcessing = false;
            reject(new Error(data.message || 'Transcription failed'));
          }
        };

        // Send transcription request
        this.worker.postMessage({
          type: 'transcribe',
          audioData: arrayBuffer,
          config: this.config,
        });
      });
    } catch (error) {
      this.isProcessing = false;
      throw error;
    }
  }

  /**
   * Perform speaker diarization to separate nurse and patient speech
   */
  async diarize(segments: Array<{ start: number; end: number; text: string }>): Promise<SpeakerSegment[]> {
    // Simple rule-based diarization for medical conversations
    // In a real implementation, this would use a more sophisticated model
    
    return segments.map((segment, index) => {
      const text = segment.text.toLowerCase();
      
      // Heuristic: nurse typically asks questions, uses medical terminology
      const isNurseSpeech = 
        text.includes('?') || // Questions
        text.includes('patient') || // Medical terminology
        text.includes('assessment') ||
        text.includes('vital') ||
        text.includes('medication') ||
        text.includes('pain') ||
        text.includes('level') ||
        index % 2 === 0; // Alternating assumption
      
      return {
        speaker: isNurseSpeech ? 'nurse' : 'patient',
        start: segment.start,
        end: segment.end,
        text: segment.text,
        confidence: 0.8,
      };
    });
  }

  /**
   * Cleanup resources
   */
  destroy(): void {
    if (this.worker) {
      this.worker.terminate();
      this.worker = null;
    }
    this.isInitialized = false;
    this.isProcessing = false;
  }

  /**
   * Check if Whisper is available and initialized
   */
  isAvailable(): boolean {
    return this.isInitialized && !this.isProcessing;
  }

  /**
   * Get current configuration
   */
  getConfig(): WhisperConfig {
    return { ...this.config };
  }

  /**
   * Update configuration
   */
  updateConfig(newConfig: Partial<WhisperConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }
}

/**
 * Browser Speech Recognition Fallback
 */
class BrowserSpeechRecognition {
  private recognition: any;
  private isSupported: boolean;

  constructor() {
    this.isSupported = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
    
    if (this.isSupported) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.lang = 'en-US';
    }
  }

  async transcribe(audioBlob: Blob): Promise<TranscriptionResult> {
    if (!this.isSupported) {
      throw new Error('Speech recognition not supported');
    }

    // Browser Speech Recognition doesn't work with audio blobs directly
    // This would need to be implemented with microphone input
    throw new Error('Browser speech recognition requires microphone input, not audio blob');
  }

  startListening(): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!this.isSupported || !this.recognition) {
        reject(new Error('Speech recognition not supported'));
        return;
      }

      let finalTranscript = '';
      let interimTranscript = '';

      this.recognition.onresult = (event: any) => {
        interimTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }
      };

      this.recognition.onend = () => {
        resolve(finalTranscript);
      };

      this.recognition.onerror = (event: any) => {
        reject(new Error(`Speech recognition error: ${event.error}`));
      };

      this.recognition.start();
    });
  }

  stopListening(): void {
    if (this.recognition) {
      this.recognition.stop();
    }
  }

  isAvailable(): boolean {
    return this.isSupported;
  }
}

/**
 * Main transcription service that handles both Whisper and browser fallback
 */
export class TranscriptionService {
  private whisper: WhisperTranscriber;
  private browserRecognition: BrowserSpeechRecognition;
  private preferredEngine: 'whisper' | 'browser' = 'whisper';

  constructor() {
    this.whisper = new WhisperTranscriber();
    this.browserRecognition = new BrowserSpeechRecognition();
  }

  /**
   * Initialize the transcription service
   */
  async initialize(): Promise<{ whisper: boolean; browser: boolean }> {
    const whisperInitialized = await this.whisper.initialize();
    const browserAvailable = this.browserRecognition.isAvailable();

    // Prefer Whisper if available, otherwise use browser recognition
    this.preferredEngine = whisperInitialized ? 'whisper' : 'browser';

    return {
      whisper: whisperInitialized,
      browser: browserAvailable,
    };
  }

  /**
   * Transcribe audio using the best available engine
   */
  async transcribe(audioBlob: Blob): Promise<TranscriptionResult> {
    if (this.preferredEngine === 'whisper' && this.whisper.isAvailable()) {
      return this.whisper.transcribe(audioBlob);
    } else if (this.browserRecognition.isAvailable()) {
      return this.browserRecognition.transcribe(audioBlob);
    } else {
      throw new Error('No transcription engine available');
    }
  }

  /**
   * Start real-time listening (browser recognition only)
   */
  async startListening(): Promise<string> {
    if (this.browserRecognition.isAvailable()) {
      return this.browserRecognition.startListening();
    } else {
      throw new Error('Real-time listening not available');
    }
  }

  /**
   * Stop real-time listening
   */
  stopListening(): void {
    this.browserRecognition.stopListening();
  }

  /**
   * Get available engines
   */
  getAvailableEngines(): { whisper: boolean; browser: boolean } {
    return {
      whisper: this.whisper.isAvailable(),
      browser: this.browserRecognition.isAvailable(),
    };
  }

  /**
   * Set preferred engine
   */
  setPreferredEngine(engine: 'whisper' | 'browser'): void {
    this.preferredEngine = engine;
  }

  /**
   * Cleanup resources
   */
  destroy(): void {
    this.whisper.destroy();
  }
}

// Export singleton instance
export const transcriptionService = new TranscriptionService();
