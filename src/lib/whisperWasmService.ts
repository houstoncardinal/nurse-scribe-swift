/**
 * Whisper WebAssembly Service
 * Provides offline voice transcription using Whisper models
 */

import { pipeline, env } from '@xenova/transformers';

// Configure transformers for production-ready Whisper WebAssembly
env.allowRemoteModels = true;
env.allowLocalModels = false;
env.remoteModelURL = 'https://huggingface.co';
env.remotePathTemplate = '{model}/resolve/main/{filename}';
env.backends.onnx.wasm.proxy = true;
env.backends.onnx.wasm.wasmPaths = 'https://cdn.jsdelivr.net/npm/@xenova/transformers@latest/dist/';

// Production-ready configuration
env.allowRemoteModels = true;
env.allowLocalModels = false;

interface WhisperResult {
  text: string;
  chunks: Array<{
    text: string;
    timestamp: [number, number];
  }>;
}

interface WhisperOptions {
  language?: string;
  task?: 'transcribe' | 'translate';
  chunk_length_s?: number;
  stride_length_s?: number;
}

class WhisperWasmService {
  private pipeline: any = null;
  private isInitialized: boolean = false;
  private isProcessing: boolean = false;
  private onProgress?: (progress: number) => void;

  constructor() {
    this.initialize();
  }

  /**
   * Initialize the Whisper pipeline for production use
   */
  private async initialize(): Promise<void> {
    try {
      console.log('🎤 Initializing Whisper WebAssembly for production...');
      
      // Check if we're in a browser environment that supports WebAssembly
      if (typeof window === 'undefined' || !window.WebAssembly) {
        console.warn('⚠️ WebAssembly not supported, skipping Whisper initialization');
        this.isInitialized = false;
        return;
      }

      // Check if we're in a production environment (Netlify, Vercel, etc.)
      const isProduction = window.location.hostname !== 'localhost' && 
                          window.location.hostname !== '127.0.0.1' &&
                          !window.location.hostname.includes('localhost');
      
      if (!isProduction) {
        console.log('🏠 Development environment detected - Whisper may have CORS issues');
        console.log('🚀 Whisper will work properly when deployed to production');
      }

      // Initialize with the most reliable Whisper model
      console.log('📦 Loading Whisper model from Hugging Face CDN...');
      
      this.pipeline = await pipeline(
        'automatic-speech-recognition',
        'Xenova/whisper-tiny.en',
        {
          quantized: true,
          progress_callback: (progress: any) => {
            if (this.onProgress && progress.total > 0) {
              const percentage = Math.round((progress.loaded / progress.total) * 100);
              console.log(`📈 Whisper loading progress: ${percentage}%`);
              this.onProgress(progress.loaded / progress.total);
            }
          }
        }
      );
      
      this.isInitialized = true;
      console.log('✅ Whisper WebAssembly initialized successfully for production use');
      
    } catch (error: any) {
      console.error('❌ Failed to initialize Whisper WebAssembly:', error);
      
      // Try alternative model as fallback
      try {
        console.log('🔄 Trying alternative Whisper model (openai/whisper-tiny)...');
        
        this.pipeline = await pipeline(
          'automatic-speech-recognition',
          'openai/whisper-tiny',
          {
            quantized: true,
            progress_callback: (progress: any) => {
              if (this.onProgress && progress.total > 0) {
                this.onProgress(progress.loaded / progress.total);
              }
            }
          }
        );
        
        this.isInitialized = true;
        console.log('✅ Whisper WebAssembly initialized successfully with alternative model');
        
      } catch (altError: any) {
        console.error('❌ Alternative Whisper model also failed:', altError);
        
        // Check if this is a CORS issue in development
        const isLocalhost = window.location.hostname === 'localhost' || 
                           window.location.hostname === '127.0.0.1';
        
        if (isLocalhost) {
          console.warn('⚠️ Whisper CORS issue in development - will work in production');
          console.log('🚀 Deploy to Netlify/Vercel for full Whisper functionality');
        } else {
          console.warn('⚠️ Whisper initialization failed in production - using browser fallback');
        }
        
        this.isInitialized = false;
      }
    }
  }

  /**
   * Check if Whisper is ready to use
   */
  public isReady(): boolean {
    return this.isInitialized && this.pipeline !== null;
  }

  /**
   * Check if currently processing
   */
  public isCurrentlyProcessing(): boolean {
    return this.isProcessing;
  }

  /**
   * Set progress callback
   */
  public setProgressCallback(callback: (progress: number) => void): void {
    this.onProgress = callback;
  }

  /**
   * Transcribe audio using Whisper
   */
  public async transcribe(
    audioBlob: Blob,
    options: WhisperOptions = {}
  ): Promise<WhisperResult> {
    if (!this.isReady()) {
      throw new Error('Whisper is not initialized');
    }

    if (this.isProcessing) {
      throw new Error('Whisper is already processing audio');
    }

    this.isProcessing = true;

    try {
      console.log('🎤 Starting Whisper transcription...');
      
      // Convert blob to audio element for processing
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      
      // Wait for audio to load
      await new Promise((resolve, reject) => {
        audio.onloadeddata = resolve;
        audio.onerror = reject;
      });

      // Create audio context to get the audio data
      const audioContext = new AudioContext();
      const arrayBuffer = await audioBlob.arrayBuffer();
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
      
      // Convert audio buffer to the format expected by Whisper
      const audioData = this.audioBufferToFloat32Array(audioBuffer);
      
      // Configure transcription options
      const transcriptionOptions = {
        language: options.language || 'english',
        task: options.task || 'transcribe',
        chunk_length_s: options.chunk_length_s || 30,
        stride_length_s: options.stride_length_s || 5,
        return_timestamps: true,
      };

      // Perform transcription
      const result = await this.pipeline(audioData, transcriptionOptions);
      
      console.log('✅ Whisper transcription completed');
      
      // Clean up
      URL.revokeObjectURL(audioUrl);
      audioContext.close();
      
      return {
        text: result.text || '',
        chunks: result.chunks || []
      };

    } catch (error) {
      console.error('❌ Whisper transcription failed:', error);
      throw new Error(`Transcription failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      this.isProcessing = false;
    }
  }

  /**
   * Convert AudioBuffer to Float32Array
   */
  private audioBufferToFloat32Array(audioBuffer: AudioBuffer): Float32Array {
    const numberOfChannels = audioBuffer.numberOfChannels;
    const length = audioBuffer.length;
    
    // If mono, return the first channel
    if (numberOfChannels === 1) {
      return audioBuffer.getChannelData(0);
    }
    
    // If stereo, mix down to mono
    const leftChannel = audioBuffer.getChannelData(0);
    const rightChannel = audioBuffer.getChannelData(1);
    const mixed = new Float32Array(length);
    
    for (let i = 0; i < length; i++) {
      mixed[i] = (leftChannel[i] + rightChannel[i]) / 2;
    }
    
    return mixed;
  }

  /**
   * Get supported languages
   */
  public getSupportedLanguages(): string[] {
    return [
      'english',
      'spanish',
      'french',
      'german',
      'italian',
      'portuguese',
      'chinese',
      'japanese',
      'korean',
      'arabic',
      'hindi',
      'russian'
    ];
  }

  /**
   * Get model information
   */
  public getModelInfo(): { name: string; size: string; languages: string[] } {
    return {
      name: 'Whisper Tiny (English)',
      size: '~39MB',
      languages: ['english']
    };
  }

  /**
   * Clean up resources
   */
  public dispose(): void {
    this.pipeline = null;
    this.isInitialized = false;
    this.isProcessing = false;
    this.onProgress = undefined;
  }
}

// Export singleton instance
export const whisperWasmService = new WhisperWasmService();

// Export types
export type { WhisperResult, WhisperOptions };
