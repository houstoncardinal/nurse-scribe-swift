/**
 * Enhanced Voice Recognition Service
 * Integrates browser Speech API with Whisper WebAssembly for optimal voice recognition
 */

import { whisperWasmService, WhisperResult } from './whisperWasmService';

interface VoiceRecognitionResult {
  transcript: string;
  isFinal: boolean;
  confidence: number;
  timestamp: number;
  source: 'browser' | 'whisper' | 'fallback';
}

interface VoiceRecognitionCallbacks {
  onResult: (result: VoiceRecognitionResult) => void;
  onError: (error: string) => void;
  onStart: () => void;
  onEnd: () => void;
  onInterimResult?: (transcript: string) => void;
  onProgress?: (progress: number) => void;
}

interface RecordingOptions {
  useWhisper: boolean;
  fallbackToBrowser: boolean;
  language: string;
  maxRecordingTime: number; // in seconds
  silenceTimeout: number; // milliseconds of silence before auto-stop
}

class EnhancedVoiceService {
  private recognition: SpeechRecognition | null = null;
  private isListening: boolean = false;
  private callbacks: VoiceRecognitionCallbacks | null = null;
  private finalTranscript: string = '';
  private interimTranscript: string = '';
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  private recordingStartTime: number = 0;
  private recordingTimer: NodeJS.Timeout | null = null;
  private silenceTimer: NodeJS.Timeout | null = null;
  private lastSpeechTime: number = 0;
  private options: RecordingOptions = {
    useWhisper: false, // Temporarily disable Whisper due to CORS issues
    fallbackToBrowser: true,
    language: 'en-US',
    maxRecordingTime: 60, // 1 minute max
    silenceTimeout: 5000 // 5 seconds of silence before auto-stop
  };

  constructor() {
    this.initializeSpeechRecognition();
    this.initializeWhisperProgress();
  }

  /**
   * Initialize browser Speech Recognition
   */
  private initializeSpeechRecognition(): void {
    if ('webkitSpeechRecognition' in window) {
      this.recognition = new (window as any).webkitSpeechRecognition();
    } else if ('SpeechRecognition' in window) {
      this.recognition = new (window as any).SpeechRecognition();
    }

    if (this.recognition) {
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.lang = this.options.language;
      this.recognition.maxAlternatives = 3;

      this.recognition.onresult = (event: any) => {
        this.handleBrowserResult(event);
      };

      this.recognition.onerror = (event: any) => {
        console.error('Browser speech recognition error:', event.error);
        this.handleError(event.error);
      };

      this.recognition.onstart = () => {
        console.log('Browser speech recognition started');
        this.isListening = true;
        if (this.callbacks?.onStart) {
          this.callbacks.onStart();
        }
      };

      this.recognition.onend = () => {
        console.log('Browser speech recognition ended');
        this.isListening = false;
        if (this.callbacks?.onEnd) {
          this.callbacks.onEnd();
        }
      };
    }
  }

  /**
   * Initialize Whisper progress callback
   */
  private initializeWhisperProgress(): void {
    whisperWasmService.setProgressCallback((progress: number) => {
      if (this.callbacks?.onProgress) {
        this.callbacks.onProgress(progress);
      }
    });
  }

  /**
   * Handle browser speech recognition results
   */
  private handleBrowserResult(event: any): void {
    let interimTranscript = '';
    let finalTranscript = '';

    for (let i = event.resultIndex; i < event.results.length; i++) {
      const transcript = event.results[i][0].transcript;
      const confidence = event.results[i][0].confidence;

      if (event.results[i].isFinal) {
        finalTranscript += transcript;
        
        // Reset silence timer on speech detection
        this.resetSilenceTimer();
        
        const result: VoiceRecognitionResult = {
          transcript: finalTranscript.trim(),
          isFinal: true,
          confidence,
          timestamp: Date.now(),
          source: 'browser'
        };

        if (this.callbacks?.onResult) {
          this.callbacks.onResult(result);
        }
      } else {
        interimTranscript += transcript;
        
        // Reset silence timer on interim results (speech detected)
        if (interimTranscript.trim().length > 0) {
          this.resetSilenceTimer();
        }
        
        if (this.callbacks?.onInterimResult) {
          this.callbacks.onInterimResult(interimTranscript.trim());
        }
      }
    }
  }

  /**
   * Handle errors
   */
  private handleError(error: string): void {
    console.error('Voice recognition error:', error);
    
    // If browser recognition fails and we have Whisper available, try to use it
    if (error === 'not-allowed' || error === 'no-speech' || error === 'network') {
      if (this.options.useWhisper && whisperWasmService.isReady()) {
        console.log('🔄 Falling back to Whisper WebAssembly...');
        this.processWithWhisper();
        return;
      }
    }

    if (this.callbacks?.onError) {
      this.callbacks.onError(error);
    }
  }

  /**
   * Process recorded audio with Whisper
   */
  private async processWithWhisper(): Promise<void> {
    if (this.audioChunks.length === 0) {
      this.handleError('No audio data to process');
      return;
    }

    try {
      console.log('🎤 Processing audio with Whisper WebAssembly...');
      
      const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
      const result: WhisperResult = await whisperWasmService.transcribe(audioBlob, {
        language: this.options.language.split('-')[0] // Convert 'en-US' to 'english'
      });

      const voiceResult: VoiceRecognitionResult = {
        transcript: result.text,
        isFinal: true,
        confidence: 0.95, // Whisper typically has high confidence
        timestamp: Date.now(),
        source: 'whisper'
      };

      if (this.callbacks?.onResult) {
        this.callbacks.onResult(voiceResult);
      }

      console.log('✅ Whisper processing completed');

    } catch (error) {
      console.error('❌ Whisper processing failed:', error);
      this.handleError(`Whisper processing failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Start recording for Whisper processing
   */
  private async startRecording(): Promise<void> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 16000 // Whisper's preferred sample rate
        } 
      });

      this.mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });

      this.audioChunks = [];
      this.recordingStartTime = Date.now();

      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.audioChunks.push(event.data);
        }
      };

      this.mediaRecorder.onstop = () => {
        stream.getTracks().forEach(track => track.stop());
        if (this.options.useWhisper) {
          this.processWithWhisper();
        }
      };

      this.mediaRecorder.start();
      this.isListening = true;

      // Set timer for maximum recording time
      this.recordingTimer = setTimeout(() => {
        this.stopRecording();
      }, this.options.maxRecordingTime * 1000);

      // Set initial silence timer
      this.resetSilenceTimer();

      if (this.callbacks?.onStart) {
        this.callbacks.onStart();
      }

    } catch (error) {
      console.error('Failed to start recording:', error);
      this.handleError('Failed to access microphone');
    }
  }

  /**
   * Reset silence timer
   */
  private resetSilenceTimer(): void {
    if (this.silenceTimer) {
      clearTimeout(this.silenceTimer);
    }
    
    this.lastSpeechTime = Date.now();
    this.silenceTimer = setTimeout(() => {
      if (this.isListening) {
        console.log('Auto-stopping due to silence');
        this.stopRecording();
      }
    }, this.options.silenceTimeout);
  }

  /**
   * Stop recording
   */
  private stopRecording(): void {
    if (this.mediaRecorder && this.mediaRecorder.state === 'recording') {
      this.mediaRecorder.stop();
    }

    if (this.recordingTimer) {
      clearTimeout(this.recordingTimer);
      this.recordingTimer = null;
    }

    if (this.silenceTimer) {
      clearTimeout(this.silenceTimer);
      this.silenceTimer = null;
    }

    this.isListening = false;

    if (this.callbacks?.onEnd) {
      this.callbacks.onEnd();
    }
  }

  /**
   * Set callbacks
   */
  public setCallbacks(callbacks: VoiceRecognitionCallbacks): void {
    this.callbacks = callbacks;
  }

  /**
   * Set recording options
   */
  public setOptions(options: Partial<RecordingOptions>): void {
    this.options = { ...this.options, ...options };
    
    // Update recognition language if changed
    if (this.recognition && options.language) {
      this.recognition.lang = options.language;
    }
  }

  /**
   * Start listening
   */
  public async startListening(): Promise<void> {
    if (this.isListening) {
      console.log('Already listening');
      return;
    }

    try {
      // Check microphone permissions first (if supported)
      if (navigator.permissions) {
        try {
          const permissions = await navigator.permissions.query({ name: 'microphone' as PermissionName });
          if (permissions.state === 'denied') {
            this.handleError('Microphone access denied');
            return;
          }
        } catch (permError) {
          console.log('Permissions API not supported, proceeding without permission check');
        }
      }

      // Choose the best available method
      if (this.options.useWhisper && whisperWasmService.isReady()) {
        console.log('🎤 Starting Whisper recording...');
        await this.startRecording();
      } else if (this.recognition && this.options.fallbackToBrowser) {
        console.log('🎤 Starting browser speech recognition...');
        this.recognition.start();
      } else {
        this.handleError('No voice recognition method available');
      }
    } catch (error: any) {
      console.error('Error starting voice recognition:', error);
      this.handleError(error.message || 'Failed to start voice recognition');
    }
  }

  /**
   * Stop listening
   */
  public stopListening(): void {
    if (this.recognition && this.recognition.state === 'running') {
      this.recognition.stop();
    }

    if (this.mediaRecorder && this.mediaRecorder.state === 'recording') {
      this.stopRecording();
    }
  }

  /**
   * Check if currently listening
   */
  public getIsListening(): boolean {
    return this.isListening;
  }

  /**
   * Check if voice recognition is supported
   */
  public getIsSupported(): boolean {
    return !!(this.recognition || whisperWasmService.isReady());
  }

  /**
   * Get available recognition methods
   */
  public getAvailableMethods(): Array<{ name: string; available: boolean; type: 'browser' | 'whisper' }> {
    return [
      {
        name: 'Browser Speech API',
        available: !!this.recognition,
        type: 'browser'
      },
      {
        name: 'Whisper WebAssembly',
        available: whisperWasmService.isReady(),
        type: 'whisper'
      }
    ];
  }

  /**
   * Get Whisper model info
   */
  public getWhisperInfo(): { name: string; size: string; languages: string[] } | null {
    if (whisperWasmService.isReady()) {
      return whisperWasmService.getModelInfo();
    }
    return null;
  }

  /**
   * Request microphone permissions
   */
  public async requestMicrophonePermissions(): Promise<boolean> {
    try {
      // Check if mediaDevices is available
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        console.warn('MediaDevices API not supported');
        return false;
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop());
      console.log('✅ Microphone permission granted');
      return true;
    } catch (error: any) {
      console.error('❌ Microphone permission denied:', error);
      
      // Log specific error types for debugging
      if (error.name === 'NotAllowedError') {
        console.error('User denied microphone access');
      } else if (error.name === 'NotFoundError') {
        console.error('No microphone found');
      } else if (error.name === 'NotReadableError') {
        console.error('Microphone is being used by another application');
      } else if (error.name === 'OverconstrainedError') {
        console.error('Microphone constraints cannot be satisfied');
      }
      
      return false;
    }
  }

  /**
   * Clean up resources
   */
  public dispose(): void {
    this.stopListening();
    this.callbacks = null;
    this.finalTranscript = '';
    this.interimTranscript = '';
    this.audioChunks = [];
  }
}

// Export singleton instance
export const enhancedVoiceService = new EnhancedVoiceService();

// Export types
export type { VoiceRecognitionResult, VoiceRecognitionCallbacks, RecordingOptions };
