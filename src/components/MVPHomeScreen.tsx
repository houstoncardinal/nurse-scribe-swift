import { useState } from 'react';
import { Mic, MicOff, Play, Pause, Square, Clock, Zap, Shield, Keyboard, Upload, Star, Award, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { InputMethodSelector } from '@/components/InputMethodSelector';
import { InteractiveDashboard } from '@/components/InteractiveDashboard';
import { HeroHeadline, SectionHeadline, AchievementHeadline } from '@/components/ProfessionalHeadlines';
import { PrimaryButton, FloatingActionButton } from '@/components/ProfessionalButtons';

interface MVPHomeScreenProps {
  onNavigate: (screen: string) => void;
  onStartRecording: () => void;
  onStopRecording: () => void;
  onManualTextSubmit: (text: string) => void;
  onPasteTextSubmit: (text: string) => void;
  isRecording: boolean;
  isProcessing: boolean;
  recordingTime: number;
  transcript: string;
}

export function MVPHomeScreen({
  onNavigate,
  onStartRecording,
  onStopRecording,
  onManualTextSubmit,
  onPasteTextSubmit,
  isRecording,
  isProcessing,
  recordingTime,
  transcript
}: MVPHomeScreenProps) {
  console.log('MVPHomeScreen rendering...');
  const [selectedTemplate, setSelectedTemplate] = useState('SOAP');
  const [isPlaying, setIsPlaying] = useState(false);
  const [showInputSelector, setShowInputSelector] = useState(false);

  const templates = [
    { value: 'SOAP', label: 'SOAP (Subjective, Objective, Assessment, Plan)' },
    { value: 'SBAR', label: 'SBAR (Situation, Background, Assessment, Recommendation)' },
    { value: 'PIE', label: 'PIE (Problem, Intervention, Evaluation)' },
    { value: 'DAR', label: 'DAR (Data, Action, Response)' },
  ];

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header Section */}
      <div className="p-6 pb-4">
        <div className="text-center space-y-6">
          {/* Hero Headline */}
          <HeroHeadline
            badge={{ text: "Enterprise Ready", color: "green" }}
            icon={<Mic />}
            iconPosition="top"
            subtitle="Professional Voice Documentation Platform"
            description="Transform your clinical workflow with AI-powered note generation and HIPAA-compliant documentation"
          >
            Start New Note
          </HeroHeadline>

          {/* Template Selector */}
          <Card className="p-4 bg-gradient-to-r from-slate-50 to-white dark:from-slate-800 dark:to-slate-900 border-0 shadow-lg">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-teal-600" />
                <SectionHeadline color="primary">
                  Choose Note Template
                </SectionHeadline>
              </div>
              <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                <SelectTrigger className="w-full h-12 border-2 focus:border-teal-300 dark:focus:border-teal-600">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {templates.map((template) => (
                    <SelectItem key={template.value} value={template.value}>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-teal-500 rounded-full" />
                        {template.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </Card>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 space-y-6">
        {showInputSelector ? (
          <div className="w-full max-w-2xl">
            <InputMethodSelector
              onMethodSelect={(method) => {
                if (method === 'voice') {
                  onStartRecording();
                  setShowInputSelector(false);
                }
              }}
              onManualTextSubmit={(text) => {
                onManualTextSubmit(text);
                setShowInputSelector(false);
              }}
              onPasteTextSubmit={(text) => {
                onPasteTextSubmit(text);
                setShowInputSelector(false);
              }}
              isProcessing={isProcessing}
            />
          </div>
        ) : (
          <>
            {/* Recording Button */}
            <div className="relative">
              {/* Outer Ring Animation */}
              {isRecording && (
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-red-500 to-pink-600 animate-ping opacity-75" />
              )}
              
              {/* Main Button */}
              <Button
                size="lg"
                className={`w-32 h-32 rounded-full shadow-2xl transition-all duration-300 ${
                  isRecording 
                    ? 'bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 scale-110' 
                    : 'bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 scale-100'
                }`}
                onClick={isRecording ? onStopRecording : onStartRecording}
                disabled={isProcessing}
              >
                {isRecording ? (
                  <MicOff className="h-12 w-12 text-white" />
                ) : (
                  <Mic className="h-12 w-12 text-white" />
                )}
              </Button>
            </div>

            {/* Status Indicators */}
            <div className="text-center space-y-4">
              {isRecording && (
                <div className="space-y-2">
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                    <span className="text-lg font-semibold text-red-600">Recording...</span>
                  </div>
                  <div className="text-2xl font-mono font-bold text-slate-900 dark:text-white">
                    {formatTime(recordingTime)}
                  </div>
                </div>
              )}

              {isProcessing && (
                <div className="space-y-2">
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse" />
                    <span className="text-lg font-semibold text-yellow-600">Processing...</span>
                  </div>
                  <Progress value={75} className="w-48" />
                </div>
              )}

              {!isRecording && !isProcessing && (
                <div className="space-y-2">
                  <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Ready to Record</h2>
                  <p className="text-slate-600 dark:text-slate-400 max-w-sm">
                    Tap the microphone to start dictating your nursing note
                  </p>
                </div>
              )}
            </div>

            {/* Input Method Options */}
            {!isRecording && !isProcessing && !transcript && (
              <div className="w-full max-w-md space-y-3">
                <div className="text-center">
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">Or choose another input method:</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setShowInputSelector(true)}
                    className="h-12 flex-col gap-2 bg-white/50 dark:bg-slate-800/50 border-2 hover:border-blue-300 dark:hover:border-blue-600"
                  >
                    <Keyboard className="h-5 w-5" />
                    <span className="text-xs font-medium">Type/Paste</span>
                  </Button>
                  <Button
                    variant="outline"
                    onClick={onStartRecording}
                    className="h-12 flex-col gap-2 bg-white/50 dark:bg-slate-800/50 border-2 hover:border-teal-300 dark:hover:border-teal-600"
                  >
                    <Mic className="h-5 w-5" />
                    <span className="text-xs font-medium">Voice</span>
                  </Button>
                </div>
              </div>
            )}

            {/* Quick Actions */}
            {transcript && (
              <div className="w-full max-w-md space-y-4">
                <Alert className="bg-emerald-50 border-emerald-200 dark:bg-emerald-950/20 dark:border-emerald-800">
                  <Shield className="h-4 w-4 text-emerald-600" />
                  <AlertDescription className="text-emerald-800 dark:text-emerald-300">
                    Transcript captured. Tap "Preview Draft" to review and edit.
                  </AlertDescription>
                </Alert>
                
                <Button
                  size="lg"
                  className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white"
                  onClick={() => onNavigate('draft')}
                >
                  Preview Draft Note
                </Button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Interactive Dashboard */}
      <div className="p-6 pt-4">
        <InteractiveDashboard />
      </div>
    </div>
  );
}
