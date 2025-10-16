import { useState } from 'react';
import { Mic, MicOff, Play, Pause, Square, Clock, Zap, Shield, Keyboard, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { InputMethodSelector } from '@/components/InputMethodSelector';

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
    <div className="h-full flex flex-col overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      {/* Enhanced Header Section */}
      <div className="flex-shrink-0 p-6 pb-4">
        <div className="text-center space-y-4">
          {/* Modern Hero */}
          <div className="space-y-3">
            <div className="flex items-center justify-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-teal-500/25">
                <Mic className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                Start New Note
              </h1>
            </div>
            <p className="text-sm text-slate-600 font-medium">Professional AI-powered documentation</p>
          </div>

          {/* Enhanced Template Selector */}
          <div className="max-w-md mx-auto">
            <Label className="text-sm font-semibold text-slate-700 mb-2 block">Select Template</Label>
            <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
              <SelectTrigger className="w-full h-12 text-sm bg-white border-2 border-slate-200 hover:border-teal-300 focus:border-teal-500 transition-colors shadow-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white border border-slate-200 shadow-xl">
                {templates.map((template) => (
                  <SelectItem key={template.value} value={template.value} className="hover:bg-teal-50">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-gradient-to-br from-teal-500 to-blue-600 rounded-full" />
                      <span className="font-medium">{template.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Main Content Area - Scrollable */}
      <div className="flex-1 overflow-y-auto">
        <div className="flex flex-col items-center justify-center p-6 space-y-6 min-h-full">
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
                    {/* Enhanced Recording Button */}
                    <div className="relative flex flex-col items-center space-y-4">
                      {/* Recording Button with Enhanced Animations */}
                      <div className="relative">
                        {/* Multiple Pulse Rings */}
                        {isRecording && (
                          <>
                            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-red-500 to-pink-600 animate-ping opacity-60 scale-110" />
                            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-red-400 to-pink-500 animate-ping opacity-40 scale-125 animation-delay-300" />
                            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-red-300 to-pink-400 animate-ping opacity-20 scale-140 animation-delay-700" />
                          </>
                        )}
                        
                        {/* Main Button */}
                        <Button
                          size="lg"
                          className={`w-36 h-36 rounded-full shadow-2xl transition-all duration-500 transform hover:scale-105 active:scale-95 ${
                            isRecording 
                              ? 'bg-gradient-to-br from-red-500 via-pink-600 to-red-600 hover:from-red-600 hover:via-pink-700 hover:to-red-700 shadow-red-500/30' 
                              : 'bg-gradient-to-br from-teal-500 via-blue-600 to-teal-600 hover:from-teal-600 hover:via-blue-700 hover:to-teal-700 shadow-teal-500/30'
                          } ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
                          onClick={isRecording ? onStopRecording : onStartRecording}
                          disabled={isProcessing}
                        >
                          {isRecording ? (
                            <MicOff className="h-16 w-16 text-white drop-shadow-lg" />
                          ) : (
                            <Mic className="h-16 w-16 text-white drop-shadow-lg" />
                          )}
                        </Button>
                        
                        {/* Status Indicator */}
                        <div className={`absolute -top-2 -right-2 w-6 h-6 rounded-full border-4 border-white ${
                          isRecording ? 'bg-red-500 animate-pulse' : 
                          isProcessing ? 'bg-yellow-500 animate-spin' : 
                          'bg-green-500'
                        }`} />
                      </div>
                    </div>

            {/* Enhanced Status Indicators */}
            <div className="text-center space-y-6">
              {isRecording && (
                <div className="space-y-4">
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse shadow-lg shadow-red-500/50" />
                    <span className="text-xl font-bold text-red-600">Recording...</span>
                  </div>
                  <div className="bg-red-50 border border-red-200 rounded-2xl p-4 max-w-xs mx-auto">
                    <div className="text-3xl font-mono font-bold text-red-700">
                      {formatTime(recordingTime)}
                    </div>
                    <p className="text-sm text-red-600 mt-1">Tap to stop recording</p>
                  </div>
                </div>
              )}

              {isProcessing && (
                <div className="space-y-4">
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-4 h-4 bg-yellow-500 rounded-full animate-pulse shadow-lg shadow-yellow-500/50" />
                    <span className="text-xl font-bold text-yellow-600">Processing...</span>
                  </div>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 max-w-xs mx-auto">
                    <Progress value={75} className="w-full h-3 mb-3" />
                    <p className="text-sm text-yellow-700">AI is analyzing your speech...</p>
                  </div>
                </div>
              )}

              {!isRecording && !isProcessing && (
                <div className="space-y-4">
                  <div className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-2xl p-6 max-w-md mx-auto shadow-lg">
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Ready to Record</h2>
                    <p className="text-slate-600 leading-relaxed">
                      Tap the microphone to start dictating your nursing note with AI-powered transcription
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Enhanced Input Method Options */}
            {!isRecording && !isProcessing && !transcript && (
              <div className="w-full max-w-lg space-y-4">
                <div className="text-center">
                  <p className="text-sm font-medium text-slate-700 mb-4">Or choose another input method:</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    variant="outline"
                    onClick={() => setShowInputSelector(true)}
                    className="h-16 flex-col gap-3 bg-white/90 backdrop-blur-sm border-2 border-slate-200 hover:border-blue-400 hover:bg-blue-50 transition-all duration-300 shadow-sm hover:shadow-md"
                  >
                    <Keyboard className="h-6 w-6 text-blue-600" />
                    <span className="text-sm font-semibold text-slate-700">Type/Paste</span>
                    <span className="text-xs text-slate-500">Manual input</span>
                  </Button>
                  <Button
                    variant="outline"
                    onClick={onStartRecording}
                    className="h-16 flex-col gap-3 bg-white/90 backdrop-blur-sm border-2 border-slate-200 hover:border-teal-400 hover:bg-teal-50 transition-all duration-300 shadow-sm hover:shadow-md"
                  >
                    <Mic className="h-6 w-6 text-teal-600" />
                    <span className="text-sm font-semibold text-slate-700">Voice</span>
                    <span className="text-xs text-slate-500">Speech input</span>
                  </Button>
                </div>
              </div>
            )}

            {/* Enhanced Quick Actions */}
            {transcript && (
              <div className="w-full max-w-lg space-y-4">
                <Alert className="bg-emerald-50 border-emerald-200 rounded-2xl shadow-sm">
                  <Shield className="h-5 w-5 text-emerald-600" />
                  <AlertDescription className="text-emerald-800 font-medium">
                    Transcript captured successfully! Ready to generate your {selectedTemplate} note.
                  </AlertDescription>
                </Alert>
                
                <div className="bg-white/90 backdrop-blur-sm border border-slate-200 rounded-2xl p-4 shadow-lg">
                  <div className="text-center space-y-3">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                      <span className="text-sm font-semibold text-slate-700">Ready to Process</span>
                    </div>
                    <p className="text-xs text-slate-600">
                      {transcript.length} characters captured • {selectedTemplate} template selected
                    </p>
                  </div>
                </div>
                
                <Button
                  size="lg"
                  className="w-full h-16 text-lg font-bold bg-gradient-to-r from-emerald-500 via-teal-600 to-emerald-600 hover:from-emerald-600 hover:via-teal-700 hover:to-emerald-700 text-white shadow-lg shadow-emerald-500/25 transition-all duration-300 transform hover:scale-105"
                  onClick={() => onNavigate('draft')}
                >
                  <FileText className="h-5 w-5 mr-3" />
                  Preview Draft Note
                </Button>
              </div>
            )}
          </>
        )}
        </div>
      </div>

    </div>
  );
}
