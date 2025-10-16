import { useState, useRef, useEffect, useCallback } from 'react';
import { Mic, Square, AlertCircle, MicOff, Settings, Volume2, VolumeX, Headphones, Wifi, WifiOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { transcriptionService, type TranscriptionResult } from '@/lib/whisper';
import { ttsService, type SpeechResult } from '@/lib/elevenlabs';
import { voiceCommandProcessor, type CommandResult } from '@/lib/voiceCommands';
import { toast } from 'sonner';

interface DictationControlProps {
  onTranscriptUpdate: (transcript: string) => void;
  isProcessing: boolean;
  onVoiceCommand?: (command: string) => void;
}

export function DictationControl({ onTranscriptUpdate, isProcessing, onVoiceCommand }: DictationControlProps) {
  // Core state
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(true);
  
  // Engine state
  const [engine, setEngine] = useState<'whisper' | 'browser'>('whisper');
  const [availableEngines, setAvailableEngines] = useState({ whisper: false, browser: false });
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Voice commands state
  const [voiceCommandsEnabled, setVoiceCommandsEnabled] = useState(false);
  const [lastCommand, setLastCommand] = useState<string>('');
  
  // Audio state
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  
  // Refs
  const recognitionRef = useRef<any>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);

  // Initialize transcription service
  useEffect(() => {
    const initializeServices = async () => {
      try {
        const engines = await transcriptionService.initialize();
        setAvailableEngines(engines);
        setIsInitialized(true);
        
        // Set preferred engine based on availability
        if (engines.whisper) {
          transcriptionService.setPreferredEngine('whisper');
          setEngine('whisper');
        } else if (engines.browser) {
          transcriptionService.setPreferredEngine('browser');
          setEngine('browser');
        } else {
          setIsSupported(false);
        }
        
        toast.success('Transcription service initialized');
      } catch (error) {
        console.error('Failed to initialize transcription service:', error);
        setIsSupported(false);
      }
    };

    initializeServices();
  }, []);

  // Setup voice commands
  useEffect(() => {
    if (voiceCommandsEnabled && voiceCommandProcessor.isSupported()) {
      voiceCommandProcessor.onCommand((result: CommandResult) => {
        if (result.success) {
          setLastCommand(result.action);
          onVoiceCommand?.(result.action);
          toast.success(`Voice command: ${result.command}`);
        }
      });
    }
  }, [voiceCommandsEnabled, onVoiceCommand]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      transcriptionService.destroy();
    };
  }, []);

  // Start recording with MediaRecorder for Whisper
  const startRecording = async () => {
    if (!isSupported || !isInitialized) {
      toast.error('Transcription service not ready');
      return;
    }

    try {
      // Get microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 16000,
        } 
      });
      
      streamRef.current = stream;
      
      // Setup MediaRecorder for Whisper
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus',
      });
      
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setAudioBlob(audioBlob);
        
        try {
          const result = await transcriptionService.transcribe(audioBlob);
          const newTranscript = transcript + ' ' + result.text;
          setTranscript(newTranscript);
          setInterimTranscript('');
          onTranscriptUpdate(newTranscript);
          
          toast.success(`Transcription completed (${result.duration}ms)`);
        } catch (error) {
          console.error('Transcription failed:', error);
          toast.error('Transcription failed');
        }
      };

      // Start recording
      mediaRecorder.start(1000); // Collect data every second
      setIsRecording(true);
      
      // Clear previous content
      setTranscript('');
      setInterimTranscript('');
      
      toast.success('Recording started - speak clearly');
      
    } catch (error) {
      console.error('Failed to start recording:', error);
      if (error instanceof Error && error.name === 'NotAllowedError') {
        toast.error('Microphone access denied. Please allow microphone access.');
      } else {
        toast.error('Failed to start recording');
      }
    }
  };

  // Stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      
      // Stop all tracks
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      
      setIsRecording(false);
      toast.success('Recording stopped');
    }
  };

  // Read back the transcript
  const readBackTranscript = async () => {
    if (!transcript.trim()) {
      toast.error('No transcript to read back');
      return;
    }

    if (isPlaying) {
      ttsService.stop();
      setIsPlaying(false);
      return;
    }

    try {
      setIsPlaying(true);
      const result = await ttsService.synthesize(transcript);
      
      if (result.success) {
        await ttsService.playAudio(result);
        toast.success('Readback completed');
      } else {
        toast.error(result.error || 'Readback failed');
      }
    } catch (error) {
      console.error('Readback failed:', error);
      toast.error('Readback failed');
    } finally {
      setIsPlaying(false);
    }
  };

  // Handle engine change
  const handleEngineChange = (newEngine: string) => {
    setEngine(newEngine as 'whisper' | 'browser');
    transcriptionService.setPreferredEngine(newEngine as 'whisper' | 'browser');
    toast.success(`Switched to ${newEngine} engine`);
  };

  if (!isSupported) {
    return (
      <Card className="card-premium p-6 border-destructive/20 bg-destructive/5 animate-fade-in">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-destructive/10 rounded-xl flex items-center justify-center flex-shrink-0">
            <AlertCircle className="h-6 w-6 text-destructive" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-destructive">Speech Recognition Not Supported</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Your browser doesn't support advanced speech recognition. Please use Chrome, Edge, or Safari for the best dictation experience.
            </p>
            <div className="flex gap-2 mt-3">
              <Badge variant="outline" className="text-xs">
                <WifiOff className="h-3 w-3 mr-1" />
                Offline Mode Unavailable
              </Badge>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="card-premium p-6 animate-fade-in">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center shadow-lg">
              <Mic className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Voice Dictation</h2>
              <p className="text-sm text-muted-foreground">Speak naturally, get accurate transcripts</p>
            </div>
          </div>
          
          {isRecording && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-destructive/10 rounded-full border border-destructive/20">
              <div className="h-2 w-2 rounded-full bg-destructive animate-pulse-slow" />
              <span className="text-sm font-semibold text-destructive">Recording</span>
            </div>
          )}
        </div>

        {/* Engine Selection */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Transcription Engine</Label>
          <div className="flex gap-3">
            <Select value={engine} onValueChange={handleEngineChange} disabled={isRecording}>
              <SelectTrigger className="flex-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="whisper" disabled={!availableEngines.whisper}>
                  <div className="flex items-center gap-2">
                    <Wifi className="h-4 w-4" />
                    <div>
                      <div className="font-medium">Whisper (Offline)</div>
                      <div className="text-xs text-muted-foreground">High accuracy, private</div>
                    </div>
                  </div>
                </SelectItem>
                <SelectItem value="browser" disabled={!availableEngines.browser}>
                  <div className="flex items-center gap-2">
                    <WifiOff className="h-4 w-4" />
                    <div>
                      <div className="font-medium">Browser (Online)</div>
                      <div className="text-xs text-muted-foreground">Requires internet</div>
                    </div>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <Badge variant="outline" className={`text-xs ${availableEngines.whisper ? 'bg-success/10 text-success border-success/20' : 'bg-muted'}`}>
                {availableEngines.whisper ? <Wifi className="h-3 w-3 mr-1" /> : <WifiOff className="h-3 w-3 mr-1" />}
                Whisper
              </Badge>
              <Badge variant="outline" className={`text-xs ${availableEngines.browser ? 'bg-primary/10 text-primary border-primary/20' : 'bg-muted'}`}>
                <WifiOff className="h-3 w-3 mr-1" />
                Browser
              </Badge>
            </div>
            
            <div className="flex items-center gap-2">
              <Label htmlFor="voice-commands" className="text-xs">Voice Commands</Label>
              <Switch
                id="voice-commands"
                checked={voiceCommandsEnabled}
                onCheckedChange={setVoiceCommandsEnabled}
                disabled={!voiceCommandProcessor.isSupported()}
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Recording Controls */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {!isRecording ? (
              <Button
                size="lg"
                onClick={startRecording}
                disabled={isProcessing || !isInitialized}
                className="btn-premium h-16 text-lg font-semibold"
              >
                <Mic className="mr-2 h-6 w-6" />
                Start Recording
              </Button>
            ) : (
              <Button
                size="lg"
                variant="destructive"
                onClick={stopRecording}
                className="h-16 text-lg font-semibold"
              >
                <Square className="mr-2 h-6 w-6" />
                Stop Recording
              </Button>
            )}
            
            <Button
              size="lg"
              variant="outline"
              onClick={readBackTranscript}
              disabled={!transcript.trim() || isProcessing}
              className="h-16 text-lg font-semibold"
            >
              {isPlaying ? <VolumeX className="mr-2 h-6 w-6" /> : <Volume2 className="mr-2 h-6 w-6" />}
              {isPlaying ? 'Stop' : 'Read Back'}
            </Button>
          </div>
          
          {lastCommand && (
            <div className="p-3 bg-primary/10 border border-primary/20 rounded-lg">
              <div className="flex items-center gap-2">
                <Headphones className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-primary">Last Command: {lastCommand}</span>
              </div>
            </div>
          )}
        </div>

        {/* Transcript Display */}
        {(transcript || interimTranscript) && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Transcript</Label>
              <Badge variant="outline" className="text-xs">
                {transcript.split(' ').length} words
              </Badge>
            </div>
            
            <div className="p-4 bg-muted/50 rounded-lg min-h-[120px] max-h-[400px] overflow-y-auto border border-border/30 shadow-sm">
              <p className="text-sm leading-relaxed whitespace-pre-wrap">
                <span className="text-foreground font-medium">{transcript}</span>
                <span className="text-muted-foreground italic">{interimTranscript}</span>
              </p>
            </div>
          </div>
        )}

        {/* Status */}
        {!isInitialized && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <div className="spinner-premium h-4 w-4" />
            <span className="text-sm">Initializing transcription service...</span>
          </div>
        )}
      </div>
    </Card>
  );
}
