import { useState, useRef, useEffect } from 'react';
import { Mic, Square, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';

interface DictationControlProps {
  onTranscriptUpdate: (transcript: string) => void;
  isProcessing: boolean;
}

export function DictationControl({ onTranscriptUpdate, isProcessing }: DictationControlProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(true);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Check for Web Speech API support
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      setIsSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event: any) => {
      let interimText = '';
      let finalText = transcript;

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalText += result[0].transcript + ' ';
        } else {
          interimText += result[0].transcript;
        }
      }

      setTranscript(finalText);
      setInterimTranscript(interimText);
      onTranscriptUpdate(finalText + interimText);
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      if (event.error === 'not-allowed') {
        toast.error('Microphone access denied. Please allow microphone access.');
      } else {
        toast.error(`Recognition error: ${event.error}`);
      }
      setIsRecording(false);
    };

    recognition.onend = () => {
      if (isRecording) {
        // Restart if still recording (for continuous operation)
        try {
          recognition.start();
        } catch (error) {
          console.error('Failed to restart recognition:', error);
          setIsRecording(false);
        }
      }
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [isRecording, transcript, onTranscriptUpdate]);

  const startRecording = () => {
    if (!isSupported) {
      toast.error('Speech recognition is not supported in this browser');
      return;
    }

    try {
      recognitionRef.current?.start();
      setIsRecording(true);
      setTranscript('');
      setInterimTranscript('');
      toast.success('Recording started - speak clearly');
    } catch (error) {
      console.error('Failed to start recording:', error);
      toast.error('Failed to start recording');
    }
  };

  const stopRecording = () => {
    try {
      recognitionRef.current?.stop();
      setIsRecording(false);
      // Finalize any interim results
      const finalTranscript = transcript + interimTranscript;
      setTranscript(finalTranscript);
      setInterimTranscript('');
      onTranscriptUpdate(finalTranscript);
      toast.success('Recording stopped');
    } catch (error) {
      console.error('Failed to stop recording:', error);
    }
  };

  if (!isSupported) {
    return (
      <Card className="p-6 border-destructive bg-destructive/5">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-destructive mb-1">Speech Recognition Not Supported</h3>
            <p className="text-sm text-muted-foreground">
              Your browser doesn't support the Web Speech API. Please use Chrome, Edge, or Safari for dictation.
            </p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 shadow-medium border-border/50">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Mic className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">Voice Dictation</h2>
          </div>
          {isRecording && (
            <div className="flex items-center gap-2 text-destructive">
              <div className="h-3 w-3 rounded-full bg-destructive animate-pulse shadow-soft" />
              <span className="text-sm font-semibold">Recording...</span>
            </div>
          )}
        </div>

        <div className="flex gap-3">
          {!isRecording ? (
            <Button
              size="lg"
              onClick={startRecording}
              disabled={isProcessing}
              className="flex-1 h-16 text-lg"
            >
              <Mic className="mr-2 h-6 w-6" />
              Start Recording
            </Button>
          ) : (
            <Button
              size="lg"
              variant="destructive"
              onClick={stopRecording}
              className="flex-1 h-16 text-lg"
            >
              <Square className="mr-2 h-6 w-6" />
              Stop Recording
            </Button>
          )}
        </div>

        {(transcript || interimTranscript) && (
          <div className="p-4 bg-muted/80 rounded-lg min-h-[120px] max-h-[300px] overflow-y-auto border border-border/30 shadow-soft">
            <p className="text-sm leading-relaxed whitespace-pre-wrap">
              <span className="text-foreground font-medium">{transcript}</span>
              <span className="text-muted-foreground italic">{interimTranscript}</span>
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}
