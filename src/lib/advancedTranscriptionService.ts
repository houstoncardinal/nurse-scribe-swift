/**
 * Advanced Transcription Service
 * Production-grade voice-to-text with medical terminology optimization
 */

import { knowledgeBaseService } from './knowledgeBase';

interface TranscriptionResult {
  text: string;
  confidence: number;
  words: Array<{
    word: string;
    confidence: number;
    startTime?: number;
    endTime?: number;
  }>;
  language: string;
  isFinal: boolean;
  alternatives?: string[];
}

interface TranscriptionConfig {
  language: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  medicalContext: boolean;
  autoCorrect: boolean;
  punctuate: boolean;
}

class AdvancedTranscriptionService {
  private recognition: any = null;
  private isListening = false;
  private finalTranscript = '';
  private interimTranscript = '';
  private config: TranscriptionConfig;
  private callbacks: {
    onResult?: (result: TranscriptionResult) => void;
    onError?: (error: string) => void;
    onStart?: () => void;
    onEnd?: () => void;
  } = {};

  // Medical terminology corrections database
  private medicalCorrections: Map<string, string> = new Map([
    // Common pronunciation corrections
    ['bee pee', 'BP'],
    ['b p', 'BP'],
    ['blood pressure', 'BP'],
    ['heart rate', 'HR'],
    ['h r', 'HR'],
    ['respiratory rate', 'RR'],
    ['r r', 'RR'],
    ['oxygen saturation', 'O2 sat'],
    ['o two sat', 'O2 sat'],
    ['temperature', 'temp'],
    
    // Vital signs
    ['over', '/'],
    ['millimeters of mercury', 'mmHg'],
    ['beats per minute', 'bpm'],
    ['breaths per minute', 'bpm'],
    ['degrees fahrenheit', '°F'],
    ['degrees celsius', '°C'],
    ['percent', '%'],
    
    // Common medical terms
    ['afebrile', 'afebrile'],
    ['febrile', 'febrile'],
    ['tachycardia', 'tachycardia'],
    ['tachycardic', 'tachycardic'],
    ['bradycardia', 'bradycardia'],
    ['hypertension', 'hypertension'],
    ['hypotension', 'hypotension'],
    ['dyspnea', 'dyspnea'],
    ['tachypnea', 'tachypnea'],
    
    // Anatomy corrections
    ['abdomen', 'abdomen'],
    ['thorax', 'thorax'],
    ['cardiovascular', 'cardiovascular'],
    ['pulmonary', 'pulmonary'],
    ['neurological', 'neurological'],
    
    // Subjective terms
    ['patient reports', 'Patient reports'],
    ['patient states', 'Patient states'],
    ['patient denies', 'Patient denies'],
    ['patient complains of', 'Patient complains of'],
    ['chief complaint', 'Chief complaint'],
  ]);

  // Context-aware replacement patterns
  private contextPatterns = [
    {
      pattern: /(\d+)\s+over\s+(\d+)/gi,
      replacement: '$1/$2',
      context: 'vital_signs'
    },
    {
      pattern: /(\d+)\s+percent/gi,
      replacement: '$1%',
      context: 'general'
    },
    {
      pattern: /(\d+)\s+degrees/gi,
      replacement: '$1°',
      context: 'temperature'
    },
    {
      pattern: /\b(bee pee|b\.?\s*p\.?)\s*(\d+)/gi,
      replacement: 'BP $2',
      context: 'vital_signs'
    },
    {
      pattern: /\b(heart rate|h\.?\s*r\.?)\s*(\d+)/gi,
      replacement: 'HR $2',
      context: 'vital_signs'
    },
  ];

  constructor() {
    this.config = {
      language: 'en-US',
      continuous: true,
      interimResults: true,
      maxAlternatives: 3,
      medicalContext: true,
      autoCorrect: true,
      punctuate: true
    };

    this.initializeRecognition();
  }

  private initializeRecognition(): void {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      console.warn('Speech recognition not supported');
      return;
    }

    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    this.recognition = new SpeechRecognition();
    
    // Configure recognition for maximum accuracy
    this.recognition.continuous = this.config.continuous;
    this.recognition.interimResults = this.config.interimResults;
    this.recognition.maxAlternatives = this.config.maxAlternatives;
    this.recognition.lang = this.config.language;

    this.setupEventHandlers();
  }

  private setupEventHandlers(): void {
    if (!this.recognition) return;

    this.recognition.onstart = () => {
      console.log('🎤 Advanced transcription started');
      this.isListening = true;
      this.finalTranscript = '';
      this.interimTranscript = '';
      
      if (this.callbacks.onStart) {
        this.callbacks.onStart();
      }
    };

    this.recognition.onresult = (event: any) => {
      let interim = '';
      let final = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        const transcript = result[0].transcript;

        if (result.isFinal) {
          final += transcript + ' ';
        } else {
          interim += transcript;
        }
      }

      if (final) {
        this.finalTranscript += final;
        const processedFinal = this.enhanceTranscript(final.trim());
        
        if (this.callbacks.onResult) {
          this.callbacks.onResult({
            text: processedFinal,
            confidence: event.results[event.resultIndex][0].confidence || 0.9,
            words: this.extractWords(processedFinal, event.results[event.resultIndex]),
            language: this.config.language,
            isFinal: true,
            alternatives: this.getAlternatives(event.results[event.resultIndex])
          });
        }
      }

      if (interim) {
        this.interimTranscript = interim;
        const processedInterim = this.enhanceTranscript(interim.trim());
        
        if (this.callbacks.onResult) {
          this.callbacks.onResult({
            text: processedInterim,
            confidence: 0.7,
            words: [],
            language: this.config.language,
            isFinal: false
          });
        }
      }
    };

    this.recognition.onerror = (event: any) => {
      console.error('🎤 Transcription error:', event.error);
      this.isListening = false;
      
      let errorMessage = 'Unknown error';
      switch (event.error) {
        case 'no-speech':
          errorMessage = 'No speech detected';
          break;
        case 'audio-capture':
          errorMessage = 'No microphone found';
          break;
        case 'not-allowed':
          errorMessage = 'Microphone permission denied';
          break;
        case 'network':
          errorMessage = 'Network error';
          break;
        case 'aborted':
          errorMessage = 'Recording aborted';
          break;
      }

      if (this.callbacks.onError) {
        this.callbacks.onError(errorMessage);
      }
    };

    this.recognition.onend = () => {
      console.log('🎤 Advanced transcription ended');
      this.isListening = false;
      
      if (this.callbacks.onEnd) {
        this.callbacks.onEnd();
      }
    };
  }

  /**
   * Main enhancement pipeline - applies multiple correction layers
   */
  private enhanceTranscript(text: string): string {
    if (!text) return text;

    let enhanced = text;

    // Layer 1: Normalize spacing and basic cleanup
    enhanced = this.normalizeText(enhanced);

    // Layer 2: Apply medical terminology corrections
    if (this.config.medicalContext) {
      enhanced = this.applyMedicalCorrections(enhanced);
    }

    // Layer 3: Context-aware pattern matching
    enhanced = this.applyContextPatterns(enhanced);

    // Layer 4: Knowledge base enhancement
    enhanced = this.enhanceWithKnowledgeBase(enhanced);

    // Layer 5: Punctuation and capitalization
    if (this.config.punctuate) {
      enhanced = this.addIntelligentPunctuation(enhanced);
    }

    // Layer 6: Auto-correct common mistakes
    if (this.config.autoCorrect) {
      enhanced = this.autoCorrectCommonMistakes(enhanced);
    }

    return enhanced.trim();
  }

  /**
   * Layer 1: Normalize text
   */
  private normalizeText(text: string): string {
    return text
      .replace(/\s+/g, ' ') // Multiple spaces to single
      .replace(/\s+([.,!?;:])/g, '$1') // Remove space before punctuation
      .replace(/([.,!?;:])\s*/g, '$1 ') // Ensure space after punctuation
      .trim();
  }

  /**
   * Layer 2: Apply medical terminology corrections
   */
  private applyMedicalCorrections(text: string): string {
    let corrected = text;

    // Apply direct word replacements
    this.medicalCorrections.forEach((replacement, searchTerm) => {
      const regex = new RegExp(`\\b${searchTerm}\\b`, 'gi');
      corrected = corrected.replace(regex, replacement);
    });

    // Special handling for vital signs patterns
    corrected = corrected.replace(/blood pressure (\d+) over (\d+)/gi, 'BP $1/$2');
    corrected = corrected.replace(/heart rate (\d+)/gi, 'HR $1');
    corrected = corrected.replace(/respiratory rate (\d+)/gi, 'RR $1');
    corrected = corrected.replace(/oxygen saturation (\d+)/gi, 'O2 sat $1%');
    corrected = corrected.replace(/temperature (\d+\.?\d*)/gi, 'temp $1°F');

    return corrected;
  }

  /**
   * Layer 3: Apply context-aware patterns
   */
  private applyContextPatterns(text: string): string {
    let processed = text;

    this.contextPatterns.forEach(pattern => {
      processed = processed.replace(pattern.pattern, pattern.replacement);
    });

    return processed;
  }

  /**
   * Layer 4: Enhance with knowledge base
   */
  private enhanceWithKnowledgeBase(text: string): string {
    try {
      // Extract potential medical terms from text
      const words = text.toLowerCase().split(/\s+/);
      let enhanced = text;
      
      // Check each word against knowledge base
      words.forEach(word => {
        const cleanWord = word.replace(/[^\w]/g, '');
        if (cleanWord.length > 3) { // Only check words longer than 3 chars
          const medicalTerm = knowledgeBaseService.getMedicalTerm(cleanWord);
          if (medicalTerm) {
            // Replace with proper medical terminology
            const regex = new RegExp(`\\b${cleanWord}\\b`, 'gi');
            enhanced = enhanced.replace(regex, medicalTerm.term);
          }
        }
      });

      return enhanced;
    } catch (error) {
      console.warn('Knowledge base enhancement failed:', error);
      return text;
    }
  }

  /**
   * Layer 5: Add intelligent punctuation
   */
  private addIntelligentPunctuation(text: string): string {
    let punctuated = text;

    // Capitalize first letter
    punctuated = punctuated.charAt(0).toUpperCase() + punctuated.slice(1);

    // Add periods after common sentence endings if missing
    const sentenceEndings = [
      'stable', 'normal', 'unremarkable', 'present', 'absent',
      'noted', 'observed', 'reported', 'denied', 'confirmed'
    ];

    sentenceEndings.forEach(ending => {
      const regex = new RegExp(`\\b${ending}\\s+([A-Z])`, 'g');
      punctuated = punctuated.replace(regex, `${ending}. $1`);
    });

    // Ensure ends with proper punctuation
    if (!/[.!?]$/.test(punctuated)) {
      punctuated += '.';
    }

    // Capitalize after periods
    punctuated = punctuated.replace(/\.\s+([a-z])/g, (match, letter) => {
      return '. ' + letter.toUpperCase();
    });

    // Capitalize common medical section starters
    const starters = ['patient', 'vital', 'assessment', 'plan', 'subjective', 'objective'];
    starters.forEach(starter => {
      const regex = new RegExp(`\\b${starter}\\b`, 'gi');
      punctuated = punctuated.replace(regex, (match) => {
        return match.charAt(0).toUpperCase() + match.slice(1).toLowerCase();
      });
    });

    return punctuated;
  }

  /**
   * Layer 6: Auto-correct common speech recognition mistakes
   */
  private autoCorrectCommonMistakes(text: string): string {
    const corrections: Array<[RegExp, string]> = [
      // Common misheard medical terms
      [/\btact\s+card\w*/gi, 'tachycardia'],
      [/\bbrad\s*e\s*card\w*/gi, 'bradycardia'],
      [/\bhigh\s*per\s*tension/gi, 'hypertension'],
      [/\bhigh\s*po\s*tension/gi, 'hypotension'],
      [/\bdis\s*p\s*nea/gi, 'dyspnea'],
      [/\babdomen/gi, 'abdomen'],
      
      // Numeric corrections
      [/\bwon\b/gi, '1'],
      [/\btoo\b/gi, '2'],
      [/\bfor\b(?=\s*\d)/gi, '4'],
      
      // Common phrases
      [/\bpatient\s+is\s+a\s*febrile/gi, 'patient is afebrile'],
      [/\bno\s+acute\s+distress/gi, 'no acute distress'],
    ];

    let corrected = text;
    corrections.forEach(([pattern, replacement]) => {
      corrected = corrected.replace(pattern, replacement);
    });

    return corrected;
  }

  /**
   * Extract word-level confidence scores
   */
  private extractWords(text: string, result: any): Array<{ word: string; confidence: number }> {
    const words = text.split(/\s+/);
    const confidence = result[0].confidence || 0.9;

    return words.map(word => ({
      word,
      confidence
    }));
  }

  /**
   * Get alternative transcriptions
   */
  private getAlternatives(result: any): string[] {
    const alternatives: string[] = [];
    
    for (let i = 1; i < Math.min(result.length, this.config.maxAlternatives); i++) {
      if (result[i] && result[i].transcript) {
        alternatives.push(this.enhanceTranscript(result[i].transcript));
      }
    }

    return alternatives;
  }

  /**
   * Start listening
   */
  public startListening(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.recognition) {
        reject('Speech recognition not initialized');
        return;
      }

      if (this.isListening) {
        reject('Already listening');
        return;
      }

      try {
        this.recognition.start();
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Stop listening
   */
  public stopListening(): void {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
    }
  }

  /**
   * Set callbacks
   */
  public setCallbacks(callbacks: {
    onResult?: (result: TranscriptionResult) => void;
    onError?: (error: string) => void;
    onStart?: () => void;
    onEnd?: () => void;
  }): void {
    this.callbacks = callbacks;
  }

  /**
   * Update configuration
   */
  public setConfig(config: Partial<TranscriptionConfig>): void {
    this.config = { ...this.config, ...config };
    
    if (this.recognition) {
      this.recognition.continuous = this.config.continuous;
      this.recognition.interimResults = this.config.interimResults;
      this.recognition.maxAlternatives = this.config.maxAlternatives;
      this.recognition.lang = this.config.language;
    }
  }

  /**
   * Check if currently listening
   */
  public getIsListening(): boolean {
    return this.isListening;
  }

  /**
   * Check if supported
   */
  public isSupported(): boolean {
    return ('webkitSpeechRecognition' in window) || ('SpeechRecognition' in window);
  }

  /**
   * Get final transcript
   */
  public getFinalTranscript(): string {
    return this.finalTranscript;
  }

  /**
   * Clear transcript
   */
  public clearTranscript(): void {
    this.finalTranscript = '';
    this.interimTranscript = '';
  }
}

// Export singleton instance
export const advancedTranscriptionService = new AdvancedTranscriptionService();
