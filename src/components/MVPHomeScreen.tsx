import { useState } from 'react';
import { Mic, MicOff, Clock, Zap, Shield, Keyboard, Upload, FileText } from 'lucide-react';
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
  interimTranscript?: string;
  voiceSupported?: boolean;
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
  transcript,
  interimTranscript = '',
  voiceSupported = true
}: MVPHomeScreenProps) {
  const [selectedTemplate, setSelectedTemplate] = useState('SOAP');
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
              {/* Desktop Layout */}
              <div className="hidden lg:flex lg:h-full">
                <div className="flex-1 p-4 lg:p-6">
                  <div className="max-w-7xl mx-auto h-full">
                    {/* Desktop Header - Compact */}
                    <div className="text-center mb-8">
                      <div className="flex items-center justify-center gap-4 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-blue-600 rounded-xl flex items-center justify-center shadow-xl shadow-teal-500/25">
                          <Mic className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                            Start New Note
                          </h1>
                          <p className="text-base text-slate-600 font-medium">Professional AI-powered documentation</p>
                        </div>
                      </div>

                      {/* Desktop Template Selector - Compact */}
                      <div className="max-w-xl mx-auto">
                        <Label className="text-sm font-semibold text-slate-700 mb-2 block">Select Note Template</Label>
                        <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                          <SelectTrigger className="w-full h-12 text-sm bg-white border-2 border-slate-200 hover:border-teal-300 focus:border-teal-500 transition-colors shadow-md">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-white border border-slate-200 shadow-2xl">
                            {templates.map((template) => (
                              <SelectItem key={template.value} value={template.value} className="hover:bg-teal-50 py-3">
                                <div className="flex items-center gap-3">
                                  <div className="w-2 h-2 bg-gradient-to-br from-teal-500 to-blue-600 rounded-full" />
                                  <span className="font-medium text-sm">{template.label}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Desktop Main Content - Full Height */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start h-full">
                      {/* Left Side - Recording Area */}
                      <div className="space-y-6 flex flex-col justify-center min-h-[400px]">
                {showInputSelector ? (
                  <div className="w-full">
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
                        {/* Desktop Recording Button - Optimized */}
                        <div className="relative flex flex-col items-center space-y-4">
                          <div className="relative">
                            {/* Multiple Pulse Rings */}
                            {isRecording && (
                              <>
                                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-red-500 to-pink-600 animate-ping opacity-60 scale-110" />
                                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-red-400 to-pink-500 animate-ping opacity-40 scale-125 animation-delay-300" />
                                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-red-300 to-pink-400 animate-ping opacity-20 scale-140 animation-delay-700" />
                              </>
                            )}
                            
                            {/* Desktop Main Button - Larger */}
                            <Button
                              size="lg"
                              className={`w-56 h-56 rounded-full shadow-2xl transition-all duration-500 transform hover:scale-105 ${
                                isRecording 
                                  ? 'bg-gradient-to-br from-red-500 via-pink-600 to-red-600 hover:from-red-600 hover:via-pink-700 hover:to-red-700 shadow-red-500/30' 
                                  : 'bg-gradient-to-br from-teal-500 via-blue-600 to-teal-600 hover:from-teal-600 hover:via-blue-700 hover:to-teal-700 shadow-teal-500/30'
                              } ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
                              onClick={isRecording ? onStopRecording : onStartRecording}
                              disabled={isProcessing}
                            >
                              {isRecording ? (
                                <MicOff className="h-28 w-28 text-white drop-shadow-lg" />
                              ) : (
                                <Mic className="h-28 w-28 text-white drop-shadow-lg" />
                              )}
                            </Button>
                            
                            {/* Status Indicator */}
                            <div className={`absolute -top-3 -right-3 w-10 h-10 rounded-full border-4 border-white ${
                              isRecording ? 'bg-red-500 animate-pulse' : 
                              isProcessing ? 'bg-yellow-500 animate-spin' : 
                              'bg-green-500'
                            }`} />
                          </div>
                        </div>

                            {/* Desktop Status */}
                            <div className="text-center space-y-4">
                              {isRecording && (
                                <div className="space-y-3">
                                  <div className="flex items-center justify-center gap-3">
                                    <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse shadow-lg shadow-red-500/50" />
                                    <span className="text-2xl font-bold text-red-600">Recording...</span>
                                  </div>
                                  <div className="bg-red-50 border border-red-200 rounded-2xl p-6 max-w-sm mx-auto">
                                    <div className="text-4xl font-mono font-bold text-red-700">
                                      {formatTime(recordingTime)}
                                    </div>
                                    <p className="text-sm text-red-600 mt-2">Click to stop recording</p>
                                  </div>
                                  
                                  {/* Live Transcript Display */}
                                  {interimTranscript && (
                                    <div className="bg-white border border-slate-200 rounded-xl p-4 max-w-md mx-auto shadow-lg">
                                      <p className="text-sm text-slate-600 mb-2">Live transcription:</p>
                                      <p className="text-slate-800 font-medium italic">
                                        "{interimTranscript}"
                                      </p>
                                    </div>
                                  )}
                                </div>
                              )}

                      {isProcessing && (
                        <div className="space-y-3">
                          <div className="flex items-center justify-center gap-3">
                            <div className="w-4 h-4 bg-yellow-500 rounded-full animate-pulse shadow-lg shadow-yellow-500/50" />
                            <span className="text-2xl font-bold text-yellow-600">Processing...</span>
                          </div>
                          <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6 max-w-sm mx-auto">
                            <Progress value={75} className="w-full h-3 mb-3" />
                            <p className="text-sm text-yellow-700">AI analyzing speech...</p>
                          </div>
                        </div>
                      )}

              {!isRecording && !isProcessing && (
                <div className="bg-white/90 backdrop-blur-sm border border-slate-200 rounded-2xl p-6 max-w-md mx-auto shadow-lg">
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">Ready to Record</h2>
                  <p className="text-base text-slate-600 mb-3">
                    Click the microphone to start AI-powered transcription
                  </p>
                  {!voiceSupported && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                      <p className="text-sm text-yellow-800">
                        ⚠️ Voice recognition not supported. Use manual text input instead.
                      </p>
                    </div>
                  )}
                </div>
              )}
                    </div>
                  </>
                )}
              </div>

                      {/* Right Side - Input Options & Actions */}
                      <div className="space-y-6 flex flex-col justify-center min-h-[400px]">
                {/* Input Method Options */}
                {!isRecording && !isProcessing && !transcript && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-slate-900 text-center">Or choose another input method:</h3>
                    <div className="grid grid-cols-1 gap-4">
                      <Button
                        variant="outline"
                        onClick={() => setShowInputSelector(true)}
                        className="h-16 flex items-center justify-center gap-4 bg-white/90 backdrop-blur-sm border-2 border-slate-200 hover:border-blue-400 hover:bg-blue-50 transition-all duration-300 shadow-lg hover:shadow-xl rounded-xl"
                      >
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Keyboard className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="text-left">
                          <div className="font-semibold text-slate-700">Type or Paste Text</div>
                          <div className="text-sm text-slate-500">Manual input method</div>
                        </div>
                      </Button>
                      <Button
                        variant="outline"
                        onClick={onStartRecording}
                        className="h-16 flex items-center justify-center gap-4 bg-white/90 backdrop-blur-sm border-2 border-slate-200 hover:border-teal-400 hover:bg-teal-50 transition-all duration-300 shadow-lg hover:shadow-xl rounded-xl"
                      >
                        <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                          <Mic className="h-5 w-5 text-teal-600" />
                        </div>
                        <div className="text-left">
                          <div className="font-semibold text-slate-700">Voice Dictation</div>
                          <div className="text-sm text-slate-500">AI speech recognition</div>
                        </div>
                      </Button>
                    </div>
                  </div>
                )}

                {/* Quick Actions */}
                {transcript && (
                  <div className="space-y-4">
                    <Alert className="bg-emerald-50 border-emerald-200 rounded-2xl shadow-lg p-4">
                      <Shield className="h-5 w-5 text-emerald-600" />
                      <AlertDescription className="text-emerald-800 font-medium text-base">
                        Transcript captured! Ready for {selectedTemplate} note.
                      </AlertDescription>
                    </Alert>
                    
                    <div className="bg-white/90 backdrop-blur-sm border border-slate-200 rounded-2xl p-6 shadow-lg">
                      <div className="text-center space-y-2">
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                          <span className="text-sm font-semibold text-slate-700">Ready to Process</span>
                        </div>
                        <p className="text-sm text-slate-600">
                          {transcript.length} characters • {selectedTemplate} template
                        </p>
                      </div>
                    </div>
                    
                    <Button
                      size="lg"
                      className="w-full h-14 text-lg font-bold bg-gradient-to-r from-emerald-500 via-teal-600 to-emerald-600 hover:from-emerald-600 hover:via-teal-700 hover:to-emerald-700 text-white shadow-xl shadow-emerald-500/25 transition-all duration-300 transform hover:scale-105"
                      onClick={() => onNavigate('draft')}
                    >
                      <FileText className="h-5 w-5 mr-3" />
                      Preview Draft Note
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile/Tablet Layout */}
      <div className="lg:hidden">
        {/* Responsive Header Section - Compact */}
        <div className="flex-shrink-0 p-4 pb-2">
          <div className="text-center space-y-3">
            {/* Responsive Hero - Compact */}
            <div className="space-y-2">
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

            {/* Responsive Template Selector - Compact */}
            <div className="max-w-sm mx-auto">
              <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                <SelectTrigger className="w-full h-10 text-sm bg-white border border-slate-200 hover:border-teal-300 focus:border-teal-500 transition-colors shadow-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white border border-slate-200 shadow-xl">
                  {templates.map((template) => (
                    <SelectItem key={template.value} value={template.value} className="hover:bg-teal-50">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-gradient-to-br from-teal-500 to-blue-600 rounded-full" />
                        <span className="font-medium text-sm">{template.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Responsive Main Content Area - Full Height */}
        <div className="flex-1 flex flex-col items-center justify-center p-4 space-y-4">
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
              {/* Responsive Recording Button */}
              <div className="relative flex flex-col items-center space-y-2 md:space-y-4">
                <div className="relative">
                  {/* Multiple Pulse Rings */}
                  {isRecording && (
                    <>
                      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-red-500 to-pink-600 animate-ping opacity-60 scale-110" />
                      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-red-400 to-pink-500 animate-ping opacity-40 scale-125 animation-delay-300" />
                      <div className="hidden md:block absolute inset-0 rounded-full bg-gradient-to-r from-red-300 to-pink-400 animate-ping opacity-20 scale-140 animation-delay-700" />
                    </>
                  )}
                  
                  {/* Responsive Main Button - Larger */}
                  <Button
                    size="lg"
                    className={`w-32 h-32 md:w-40 md:h-40 rounded-full shadow-2xl transition-all duration-500 transform hover:scale-105 active:scale-95 ${
                      isRecording 
                        ? 'bg-gradient-to-br from-red-500 via-pink-600 to-red-600 hover:from-red-600 hover:via-pink-700 hover:to-red-700 shadow-red-500/30' 
                        : 'bg-gradient-to-br from-teal-500 via-blue-600 to-teal-600 hover:from-teal-600 hover:via-blue-700 hover:to-teal-700 shadow-teal-500/30'
                    } ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
                    onClick={isRecording ? onStopRecording : onStartRecording}
                    disabled={isProcessing}
                  >
                    {isRecording ? (
                      <MicOff className="h-16 w-16 md:h-20 md:w-20 text-white drop-shadow-lg" />
                    ) : (
                      <Mic className="h-16 w-16 md:h-20 md:w-20 text-white drop-shadow-lg" />
                    )}
                  </Button>
                  
                  {/* Responsive Status Indicator */}
                  <div className={`absolute -top-1 -right-1 md:-top-2 md:-right-2 w-5 h-5 md:w-6 md:h-6 rounded-full border-3 md:border-4 border-white ${
                    isRecording ? 'bg-red-500 animate-pulse' : 
                    isProcessing ? 'bg-yellow-500 animate-spin' : 
                    'bg-green-500'
                  }`} />
                </div>
              </div>

              {/* Compact Status Indicators */}
              <div className="text-center space-y-3">
                {isRecording && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse shadow-lg shadow-red-500/50" />
                      <span className="text-lg font-bold text-red-600">Recording...</span>
                    </div>
                    <div className="bg-red-50 border border-red-200 rounded-xl p-3 max-w-xs mx-auto">
                      <div className="text-2xl font-mono font-bold text-red-700">
                        {formatTime(recordingTime)}
                      </div>
                      <p className="text-xs text-red-600 mt-1">Tap to stop</p>
                    </div>
                    
                    {/* Live Transcript Display for Mobile */}
                    {interimTranscript && (
                      <div className="bg-white border border-slate-200 rounded-xl p-3 max-w-sm mx-auto shadow-lg">
                        <p className="text-xs text-slate-600 mb-1">Live transcription:</p>
                        <p className="text-slate-800 font-medium italic text-sm">
                          "{interimTranscript}"
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {isProcessing && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse shadow-lg shadow-yellow-500/50" />
                      <span className="text-lg font-bold text-yellow-600">Processing...</span>
                    </div>
                    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 max-w-xs mx-auto">
                      <Progress value={75} className="w-full h-2 mb-2" />
                      <p className="text-xs text-yellow-700">AI analyzing speech...</p>
                    </div>
                  </div>
                )}

                {!isRecording && !isProcessing && (
                  <div className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl p-4 max-w-sm mx-auto shadow-lg">
                    <h2 className="text-lg font-bold text-slate-900 mb-1">Ready to Record</h2>
                    <p className="text-sm text-slate-600 mb-2">
                      Tap microphone for AI-powered transcription
                    </p>
                    {!voiceSupported && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-2">
                        <p className="text-xs text-yellow-800">
                          ⚠️ Voice not supported. Use manual input.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Compact Input Method Options */}
                {!isRecording && !isProcessing && !transcript && (
                  <div className="w-full max-w-sm space-y-3">
                    <div className="text-center">
                      <p className="text-sm font-medium text-slate-700 mb-3">Or choose another input method:</p>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <Button
                        variant="outline"
                        onClick={() => setShowInputSelector(true)}
                        className="h-16 flex flex-col items-center justify-center gap-2 bg-white/90 backdrop-blur-sm border-2 border-slate-200 hover:border-blue-400 hover:bg-blue-50 transition-all duration-300 shadow-md hover:shadow-lg rounded-xl"
                      >
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Keyboard className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="flex flex-col items-center gap-1">
                          <span className="text-sm font-semibold text-slate-700">Type/Paste</span>
                          <span className="text-xs text-slate-500">Manual</span>
                        </div>
                      </Button>
                      <Button
                        variant="outline"
                        onClick={onStartRecording}
                        className="h-16 flex flex-col items-center justify-center gap-2 bg-white/90 backdrop-blur-sm border-2 border-slate-200 hover:border-teal-400 hover:bg-teal-50 transition-all duration-300 shadow-md hover:shadow-lg rounded-xl"
                      >
                        <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center">
                          <Mic className="h-5 w-5 text-teal-600" />
                        </div>
                        <div className="flex flex-col items-center gap-1">
                          <span className="text-sm font-semibold text-slate-700">Voice</span>
                          <span className="text-xs text-slate-500">AI Speech</span>
                        </div>
                      </Button>
                    </div>
                  </div>
                )}

              {/* Enhanced Quick Actions */}
              {transcript && (
                <div className="w-full max-w-md space-y-2">
                  <Alert className="bg-emerald-50 border-emerald-200 rounded-xl shadow-sm p-3">
                    <Shield className="h-4 w-4 text-emerald-600" />
                    <AlertDescription className="text-emerald-800 font-medium text-sm">
                      Transcript captured! Ready for {selectedTemplate} note.
                    </AlertDescription>
                  </Alert>
                  
                  <div className="bg-white/90 backdrop-blur-sm border border-slate-200 rounded-xl p-3 shadow-lg">
                    <div className="text-center space-y-1">
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        <span className="text-xs font-semibold text-slate-700">Ready to Process</span>
                      </div>
                      <p className="text-xs text-slate-600">
                        {transcript.length} chars • {selectedTemplate}
                      </p>
                    </div>
                  </div>
                  
                  <Button
                    size="lg"
                    className="w-full h-12 text-sm font-bold bg-gradient-to-r from-emerald-500 via-teal-600 to-emerald-600 hover:from-emerald-600 hover:via-teal-700 hover:to-emerald-700 text-white shadow-lg shadow-emerald-500/25 transition-all duration-300 transform hover:scale-105"
                    onClick={() => onNavigate('draft')}
                  >
                    <FileText className="h-4 w-4 mr-2" />
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