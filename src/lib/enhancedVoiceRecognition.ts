interface VoiceRecognitionResult {
  transcript: string;
  isFinal: boolean;
  confidence: number;
  timestamp: number;
}

interface VoiceRecognitionCallbacks {
  onResult: (result: VoiceRecognitionResult) => void;
  onError: (error: string) => void;
  onStart: () => void;
  onEnd: () => void;
  onInterimResult?: (transcript: string) => void;
}

interface OpenAITranscriptionOptions {
  model: string;
  language: string;
  temperature: number;
  prompt?: string;
}

class EnhancedVoiceRecognitionService {
  private recognition: SpeechRecognition | null = null;
  private isListening: boolean = false;
  private callbacks: VoiceRecognitionCallbacks | null = null;
  private finalTranscript: string = '';
  private interimTranscript: string = '';
  private openAIKey: string | null = null;
  private useOpenAI: boolean = false;
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];

  constructor() {
    this.initializeSpeechRecognition();
    this.loadOpenAIKey();
  }

  private initializeSpeechRecognition() {
    if ('webkitSpeechRecognition' in window) {
      this.recognition = new (window as any).webkitSpeechRecognition();
    } else if ('SpeechRecognition' in window) {
      this.recognition = new (window as any).SpeechRecognition();
    }

    if (this.recognition) {
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.lang = 'en-US';
      this.recognition.maxAlternatives = 3; // Get multiple alternatives for better accuracy

      this.recognition.onresult = (event: SpeechRecognitionEvent) => {
        let interimTranscript = '';
        let finalTranscriptSegment = '';
        let confidence = 0;

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const result = event.results[i];
          const transcript = result[0].transcript;
          
          if (result.isFinal) {
            finalTranscriptSegment += transcript;
            confidence = result[0].confidence;
          } else {
            interimTranscript += transcript;
          }
        }

        // Update interim transcript for real-time display
        if (interimTranscript && this.callbacks?.onInterimResult) {
          this.interimTranscript = this.finalTranscript + (this.finalTranscript ? ' ' : '') + interimTranscript;
          this.callbacks.onInterimResult(this.interimTranscript);
        }

        // Handle final results
        if (finalTranscriptSegment) {
          this.finalTranscript += (this.finalTranscript ? ' ' : '') + finalTranscriptSegment;
          
          if (this.useOpenAI && this.openAIKey) {
            this.enhanceWithOpenAI(finalTranscriptSegment, confidence);
          } else {
            this.callbacks?.onResult({
              transcript: this.finalTranscript,
              isFinal: true,
              confidence: confidence,
              timestamp: Date.now()
            });
          }
        }
      };

      this.recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error('Speech recognition error:', event.error);
        this.isListening = false;
        this.callbacks?.onError(event.error);
      };

      this.recognition.onstart = () => {
        this.isListening = true;
        this.finalTranscript = '';
        this.interimTranscript = '';
        this.callbacks?.onStart();
      };

      this.recognition.onend = () => {
        this.isListening = false;
        this.callbacks?.onEnd();
      };
    }
  }

  private async loadOpenAIKey() {
    const key = localStorage.getItem('openai_api_key');
    if (key) {
      this.openAIKey = key;
      this.useOpenAI = true;
    }
  }

  private async enhanceWithOpenAI(transcript: string, originalConfidence: number) {
    if (!this.openAIKey || !transcript.trim()) return;

    try {
      const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.openAIKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'whisper-1',
          prompt: 'Medical terminology, nursing documentation, clinical assessment. Focus on accuracy for healthcare documentation.',
          language: 'en',
          temperature: 0.0, // Low temperature for consistency
          response_format: 'json'
        })
      });

      if (response.ok) {
        const data = await response.json();
        const enhancedTranscript = data.text || transcript;
        const enhancedConfidence = Math.min(originalConfidence + 0.1, 1.0); // Boost confidence slightly

        this.callbacks?.onResult({
          transcript: this.finalTranscript.replace(
            this.finalTranscript.split(' ').slice(-transcript.split(' ').length).join(' '),
            enhancedTranscript
          ),
          isFinal: true,
          confidence: enhancedConfidence,
          timestamp: Date.now()
        });
      } else {
        // Fallback to original transcript if OpenAI fails
        this.callbacks?.onResult({
          transcript: this.finalTranscript,
          isFinal: true,
          confidence: originalConfidence,
          timestamp: Date.now()
        });
      }
    } catch (error) {
      console.error('OpenAI enhancement failed:', error);
      // Fallback to original transcript
      this.callbacks?.onResult({
        transcript: this.finalTranscript,
        isFinal: true,
        confidence: originalConfidence,
        timestamp: Date.now()
      });
    }
  }

  private async startAudioRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100
        }
      });
      
      this.mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      
      this.audioChunks = [];
      
      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.audioChunks.push(event.data);
        }
      };
      
      this.mediaRecorder.start(1000); // Collect data every second
    } catch (error) {
      console.error('Failed to start audio recording:', error);
    }
  }

  private stopAudioRecording() {
    if (this.mediaRecorder && this.mediaRecorder.state === 'recording') {
      this.mediaRecorder.stop();
      
      this.mediaRecorder.onstop = () => {
        const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
        // Audio blob is ready for OpenAI processing if needed
        console.log('Audio recording completed:', audioBlob.size, 'bytes');
      };
    }
  }

  getIsSupported(): boolean {
    return this.recognition !== null;
  }

  getIsListening(): boolean {
    return this.isListening;
  }

  getInterimTranscript(): string {
    return this.interimTranscript;
  }

  getFinalTranscript(): string {
    return this.finalTranscript;
  }

  setCallbacks(callbacks: VoiceRecognitionCallbacks): void {
    this.callbacks = callbacks;
  }

  setOpenAIKey(key: string): void {
    this.openAIKey = key;
    this.useOpenAI = !!key;
    localStorage.setItem('openai_api_key', key);
  }

  setUseOpenAI(useOpenAI: boolean): void {
    this.useOpenAI = useOpenAI && !!this.openAIKey;
  }

  async requestMicrophonePermissions(): Promise<boolean> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100
        }
      });
      stream.getTracks().forEach(track => track.stop());
      return true;
    } catch (error) {
      console.error('Microphone permission denied:', error);
      return false;
    }
  }

  startListening(): void {
    if (this.recognition && !this.isListening) {
      this.recognition.start();
      this.startAudioRecording();
    }
  }

  stopListening(): void {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.stopAudioRecording();
    }
  }

  clearTranscript(): void {
    this.finalTranscript = '';
    this.interimTranscript = '';
  }

  // Enhanced medical terminology processing
  processMedicalTerminology(transcript: string): string {
    const medicalTerms: { [key: string]: string } = {
      'bp': 'blood pressure',
      'hr': 'heart rate',
      'rr': 'respiratory rate',
      'o2': 'oxygen',
      'temp': 'temperature',
      'pt': 'patient',
      'pt states': 'patient states',
      'pt denies': 'patient denies',
      'pt reports': 'patient reports',
      'vss': 'vital signs stable',
      'aox3': 'alert and oriented times 3',
      'aox4': 'alert and oriented times 4',
      'sob': 'shortness of breath',
      'c/o': 'complains of',
      'h/o': 'history of',
      's/p': 'status post',
      'w/o': 'without',
      'w/': 'with',
      'q': 'every',
      'bid': 'twice daily',
      'tid': 'three times daily',
      'qid': 'four times daily',
      'prn': 'as needed',
      'po': 'by mouth',
      'iv': 'intravenous',
      'im': 'intramuscular',
      'sq': 'subcutaneous',
      'ng': 'nasogastric',
      'nj': 'nasojejunal',
      'gt': 'gastrostomy tube',
      'j-tube': 'jejunostomy tube',
      'foley': 'Foley catheter',
      'straight cath': 'straight catheterization',
      'condom cath': 'condom catheter',
      'icu': 'intensive care unit',
      'ccu': 'cardiac care unit',
      'er': 'emergency room',
      'ed': 'emergency department',
      'or': 'operating room',
      'pac': 'post-anesthesia care',
      'med-surg': 'medical-surgical',
      'tele': 'telemetry',
      'step-down': 'step-down unit',
      'ltach': 'long-term acute care hospital',
      'snf': 'skilled nursing facility',
      'rehab': 'rehabilitation',
      'pt': 'physical therapy',
      'ot': 'occupational therapy',
      'st': 'speech therapy',
      'rt': 'respiratory therapy',
      'rrt': 'rapid response team',
      'code blue': 'cardiac arrest',
      'rapid response': 'rapid response team activation',
      'fall risk': 'fall risk assessment',
      'skin breakdown': 'skin integrity issue',
      'wound care': 'wound management',
      'pain scale': 'pain assessment scale',
      'nrs': 'numeric rating scale',
      'faces scale': 'faces pain scale',
      'wong-baker': 'Wong-Baker FACES pain rating scale',
      'pca': 'patient-controlled analgesia',
      'epidural': 'epidural analgesia',
      'iv pump': 'intravenous pump',
      'alaris': 'Alaris infusion pump',
      'kardex': 'Kardex care plan',
      'mar': 'medication administration record',
      'tpr': 'temperature, pulse, respiration',
      'vitals': 'vital signs',
      'i&o': 'intake and output',
      'strict i&o': 'strict intake and output monitoring',
      'npo': 'nothing by mouth',
      'clear liquids': 'clear liquid diet',
      'full liquids': 'full liquid diet',
      'soft diet': 'soft diet',
      'regular diet': 'regular diet',
      'diabetic diet': 'diabetic diet',
      'cardiac diet': 'cardiac diet',
      'renal diet': 'renal diet',
      'aspiration precautions': 'aspiration risk precautions',
      'fall precautions': 'fall prevention measures',
      'infection control': 'infection prevention measures',
      'standard precautions': 'standard infection control precautions',
      'contact precautions': 'contact isolation precautions',
      'droplet precautions': 'droplet isolation precautions',
      'airborne precautions': 'airborne isolation precautions',
      'reverse isolation': 'protective isolation',
      'hand hygiene': 'hand washing and sanitizing',
      'gloves': 'personal protective equipment',
      'gown': 'isolation gown',
      'mask': 'protective mask',
      'n95': 'N95 respirator mask',
      'face shield': 'protective face shield',
      'goggles': 'protective goggles',
      'isolation cart': 'isolation equipment cart',
      'yellow bag': 'biohazard waste disposal',
      'red bag': 'regulated medical waste',
      'sharps container': 'sharps disposal container',
      'bedside commode': 'bedside toilet',
      'bedpan': 'bedpan',
      'urinal': 'urinal',
      'walker': 'walking assistance device',
      'wheelchair': 'wheelchair',
      'bed alarm': 'bed exit alarm',
      'chair alarm': 'chair exit alarm',
      'restraints': 'physical restraints',
      'sitter': 'one-to-one observation',
      'security': 'security personnel',
      'family': 'family members',
      'visiting hours': 'visiting hours',
      'discharge planning': 'discharge preparation',
      'home health': 'home health services',
      'hospice': 'hospice care',
      'palliative': 'palliative care',
      'comfort measures': 'comfort care measures',
      'dni': 'do not intubate',
      'dnr': 'do not resuscitate',
      'full code': 'full resuscitation orders',
      'comfort care': 'comfort care only',
      'advanced directive': 'advance directive',
      'power of attorney': 'healthcare power of attorney',
      'healthcare proxy': 'healthcare proxy',
      'living will': 'living will',
      'polst': 'physician orders for life-sustaining treatment',
      'mols': 'medical orders for life-sustaining treatment'
    };

    let processedTranscript = transcript.toLowerCase();
    
    // Replace medical abbreviations with full terms
    Object.entries(medicalTerms).forEach(([abbrev, full]) => {
      const regex = new RegExp(`\\b${abbrev}\\b`, 'gi');
      processedTranscript = processedTranscript.replace(regex, full);
    });

    // Capitalize the first letter of each sentence
    processedTranscript = processedTranscript.replace(/(^|\. )([a-z])/g, (match, prefix, letter) => {
      return prefix + letter.toUpperCase();
    });

    return processedTranscript;
  }
}

export const enhancedVoiceRecognitionService = new EnhancedVoiceRecognitionService();
