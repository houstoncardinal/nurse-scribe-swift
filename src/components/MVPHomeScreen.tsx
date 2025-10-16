import { useState } from 'react';
import { Mic, MicOff, Clock, Zap, Shield, Keyboard, Upload, FileText, TrendingUp, Target, Award, Activity, BarChart3, CheckCircle, Star, Timer, Users, BookOpen, AlertTriangle, Bell, Calendar, TrendingDown, Settings } from 'lucide-react';
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
  onTemplateChange: (template: string) => void;
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
  onTemplateChange,
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

  // Mock user profile data - in real app, this would come from user context/API
  const userProfile = {
    name: 'Dr. Sarah Johnson',
    role: 'RN, BSN',
    notesToday: 12,
    timeSaved: 3.2,
    accuracy: 99.2,
    pendingReviews: 3,
    upcomingTasks: 2,
    weeklyGoal: 50,
    notesThisWeek: 42
  };

  return (
    <div className="mvp-app bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
              {/* Desktop Layout */}
              <div className="hidden lg:flex lg:h-full">
                <div className="flex-1 p-4 lg:p-6">
                  <div className="max-w-7xl mx-auto h-full">
                    {/* Desktop Header - Compact */}
                    <div className="text-center mb-8 pt-4">
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
                        <Select value={selectedTemplate} onValueChange={(value) => {
                          setSelectedTemplate(value);
                          onTemplateChange(value);
                        }}>
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

                    {/* Desktop Main Content - Full Height with Dashboard */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start h-full">
                      {/* Left Side - Recording Area */}
                      <div className="lg:col-span-1 space-y-6 flex flex-col justify-center min-h-[500px]">
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

                      {/* Middle - Input Options & Actions */}
                      <div className="lg:col-span-1 space-y-6 flex flex-col justify-center min-h-[500px]">
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

                      {/* Right Side - Profile Dashboard */}
                      <div className="lg:col-span-1 space-y-6 flex flex-col justify-start min-h-[500px]">
                        {/* Your Performance Today */}
                        <Card className="p-4 bg-gradient-to-br from-white to-slate-50 border border-slate-200 shadow-lg">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
                              <BarChart3 className="h-4 w-4 text-white" />
                            </div>
                            <h3 className="font-semibold text-slate-900">Your Performance Today</h3>
                          </div>
                          <div className="space-y-3">
                            <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-100">
                              <div className="flex items-center gap-2">
                                <FileText className="h-4 w-4 text-blue-600" />
                                <span className="text-sm font-medium text-slate-700">Notes Created</span>
                              </div>
                              <div className="text-right">
                                <span className="text-lg font-bold text-blue-600">{userProfile.notesToday}</span>
                                <div className="text-xs text-green-600 flex items-center gap-1">
                                  <TrendingUp className="h-3 w-3" />
                                  +3 from yesterday
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-100">
                              <div className="flex items-center gap-2">
                                <Timer className="h-4 w-4 text-emerald-600" />
                                <span className="text-sm font-medium text-slate-700">Time Saved</span>
                              </div>
                              <div className="text-right">
                                <span className="text-lg font-bold text-emerald-600">{userProfile.timeSaved}h</span>
                                <div className="text-xs text-green-600 flex items-center gap-1">
                                  <TrendingUp className="h-3 w-3" />
                                  +47m today
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-100">
                              <div className="flex items-center gap-2">
                                <Target className="h-4 w-4 text-purple-600" />
                                <span className="text-sm font-medium text-slate-700">Accuracy Rate</span>
                              </div>
                              <div className="text-right">
                                <span className="text-lg font-bold text-purple-600">{userProfile.accuracy}%</span>
                                <div className="text-xs text-green-600 flex items-center gap-1">
                                  <TrendingUp className="h-3 w-3" />
                                  +0.5% this week
                                </div>
                              </div>
                            </div>
                          </div>
                        </Card>

                        {/* Recent Notes */}
                        <Card className="p-4 bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-200 shadow-lg">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                              <FileText className="h-4 w-4 text-white" />
                            </div>
                            <h3 className="font-semibold text-slate-900">Recent Notes</h3>
                          </div>
                          <div className="space-y-3">
                            <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-indigo-100">
                              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                                <FileText className="h-4 w-4 text-green-600" />
                              </div>
                              <div className="flex-1">
                                <div className="text-sm font-medium text-slate-700">Morning Assessment</div>
                                <div className="text-xs text-slate-500">SOAP note • 2 hours ago</div>
                              </div>
                              <Badge className="bg-green-100 text-green-700 border-green-200 text-xs">Complete</Badge>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-indigo-100">
                              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                <FileText className="h-4 w-4 text-blue-600" />
                              </div>
                              <div className="flex-1">
                                <div className="text-sm font-medium text-slate-700">Patient Transfer</div>
                                <div className="text-xs text-slate-500">SBAR note • 4 hours ago</div>
                              </div>
                              <Badge className="bg-blue-100 text-blue-700 border-blue-200 text-xs">Exported</Badge>
                            </div>
                            <Button variant="outline" size="sm" className="w-full text-xs">
                              View All Notes
                            </Button>
                          </div>
                        </Card>

                        {/* Weekly Progress */}
                        <Card className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 shadow-lg">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                              <Target className="h-4 w-4 text-white" />
                            </div>
                            <h3 className="font-semibold text-slate-900">Weekly Goal Progress</h3>
                          </div>
                          <div className="space-y-3">
                            <div className="p-3 bg-white rounded-lg border border-blue-100">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-slate-700">Notes This Week</span>
                                <span className="text-sm font-bold text-blue-600">{userProfile.notesThisWeek}/{userProfile.weeklyGoal}</span>
                              </div>
                              <Progress value={(userProfile.notesThisWeek / userProfile.weeklyGoal) * 100} className="h-2" />
                              <div className="text-xs text-slate-500 mt-1">
                                {userProfile.weeklyGoal - userProfile.notesThisWeek} more notes to reach goal
                              </div>
                            </div>
                            <div className="flex items-center gap-3 p-2 bg-white rounded-lg border border-blue-100">
                              <div className="w-6 h-6 bg-green-100 rounded-lg flex items-center justify-center">
                                <TrendingUp className="h-3 w-3 text-green-600" />
                              </div>
                              <span className="text-sm text-slate-700">On track to exceed weekly goal</span>
                            </div>
                          </div>
                        </Card>

                        {/* Quick Actions */}
                        <Card className="p-4 bg-gradient-to-br from-teal-50 to-cyan-50 border border-teal-200 shadow-lg">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="w-8 h-8 bg-gradient-to-r from-teal-500 to-cyan-600 rounded-lg flex items-center justify-center">
                              <Zap className="h-4 w-4 text-white" />
                            </div>
                            <h3 className="font-semibold text-slate-900">Quick Actions</h3>
                          </div>
                          <div className="space-y-2">
                            <Button variant="outline" size="sm" className="w-full justify-start text-xs">
                              <FileText className="h-3 w-3 mr-2" />
                              Review Pending Notes
                            </Button>
                            <Button variant="outline" size="sm" className="w-full justify-start text-xs">
                              <BarChart3 className="h-3 w-3 mr-2" />
                              View Weekly Report
                            </Button>
                            <Button variant="outline" size="sm" className="w-full justify-start text-xs">
                              <Settings className="h-3 w-3 mr-2" />
                              Update Preferences
                            </Button>
                          </div>
                        </Card>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

      {/* Mobile/Tablet Layout */}
      <div className="lg:hidden mvp-screen">
        {/* Mobile Header - iPhone 16 Optimized */}
        <div className="flex-shrink-0 px-4 pt-4 pb-2 safe-area-top">
          <div className="text-center space-y-3">
            {/* Mobile Hero - Compact for iPhone */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg">
                  <Mic className="h-4 w-4 text-white" />
                </div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                  Start New Note
                </h1>
              </div>
              <p className="text-xs text-slate-600">Professional AI-powered documentation</p>
            </div>

            {/* Mobile Template Selector - Compact */}
            <div className="max-w-xs mx-auto">
              <Select value={selectedTemplate} onValueChange={(value) => {
                setSelectedTemplate(value);
                onTemplateChange(value);
              }}>
                <SelectTrigger className="w-full h-9 text-xs bg-white border border-slate-200 hover:border-teal-300 focus:border-teal-500 transition-colors shadow-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white border border-slate-200 shadow-xl">
                  {templates.map((template) => (
                    <SelectItem key={template.value} value={template.value} className="hover:bg-teal-50">
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-gradient-to-br from-teal-500 to-blue-600 rounded-full" />
                        <span className="font-medium text-xs">{template.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Mobile Main Content Area - iPhone 16 Optimized */}
        <div className="flex-1 flex flex-col items-center justify-center px-4 py-6 space-y-4 overflow-y-auto">
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
                    className={`w-28 h-28 sm:w-32 sm:h-32 rounded-full shadow-2xl transition-all duration-500 transform hover:scale-105 active:scale-95 ${
                      isRecording 
                        ? 'bg-gradient-to-br from-red-500 via-pink-600 to-red-600 hover:from-red-600 hover:via-pink-700 hover:to-red-700 shadow-red-500/30' 
                        : 'bg-gradient-to-br from-teal-500 via-blue-600 to-teal-600 hover:from-teal-600 hover:via-blue-700 hover:to-teal-700 shadow-teal-500/30'
                    } ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
                    onClick={isRecording ? onStopRecording : onStartRecording}
                    disabled={isProcessing}
                  >
                    {isRecording ? (
                      <MicOff className="h-12 w-12 sm:h-14 sm:w-14 text-white drop-shadow-lg" />
                    ) : (
                      <Mic className="h-12 w-12 sm:h-14 sm:w-14 text-white drop-shadow-lg" />
                    )}
                  </Button>
                  
                  {/* Mobile Status Indicator */}
                  <div className={`absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 rounded-full border-2 border-white ${
                    isRecording ? 'bg-red-500 animate-pulse' : 
                    isProcessing ? 'bg-yellow-500 animate-spin' : 
                    'bg-green-500'
                  }`} />
                </div>
              </div>

              {/* Mobile Status Indicators - iPhone 16 Optimized */}
              <div className="text-center space-y-2">
                {isRecording && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-center gap-1">
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                      <span className="text-sm font-bold text-red-600">Recording</span>
                    </div>
                    <div className="bg-red-50 border border-red-200 rounded-lg p-2 max-w-xs mx-auto">
                      <div className="text-lg font-mono font-bold text-red-700">
                        {formatTime(recordingTime)}
                      </div>
                      <p className="text-xs text-red-600">Tap to stop</p>
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
                    <div className="flex items-center justify-center gap-1">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
                      <span className="text-sm font-bold text-yellow-600">Processing</span>
                    </div>
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-2 max-w-xs mx-auto">
                      <Progress value={75} className="w-full h-1 mb-1" />
                      <p className="text-xs text-yellow-700">AI analyzing...</p>
                    </div>
                  </div>
                )}

                {!isRecording && !isProcessing && (
                  <div className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-lg p-3 max-w-xs mx-auto shadow-lg">
                    <h2 className="text-base font-bold text-slate-900 mb-1">Ready to Record</h2>
                    <p className="text-xs text-slate-600">
                      Tap microphone to start
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

              {/* Mobile Input Method Options - iPhone 16 Optimized */}
                {!isRecording && !isProcessing && !transcript && (
                  <div className="w-full max-w-xs space-y-2">
                    <div className="text-center">
                      <p className="text-xs text-slate-600 mb-2">Or choose another method:</p>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        variant="outline"
                        onClick={() => setShowInputSelector(true)}
                        className="h-12 flex flex-col items-center justify-center gap-1 bg-white/90 backdrop-blur-sm border border-slate-200 hover:border-blue-400 hover:bg-blue-50 transition-all duration-300 shadow-sm hover:shadow-md rounded-lg"
                      >
                        <div className="w-6 h-6 bg-blue-100 rounded flex items-center justify-center">
                          <Keyboard className="h-3 w-3 text-blue-600" />
                        </div>
                        <span className="text-xs font-medium text-slate-700">Type</span>
                      </Button>
                      <Button
                        variant="outline"
                        onClick={onStartRecording}
                        className="h-12 flex flex-col items-center justify-center gap-1 bg-white/90 backdrop-blur-sm border border-slate-200 hover:border-teal-400 hover:bg-teal-50 transition-all duration-300 shadow-sm hover:shadow-md rounded-lg"
                      >
                        <div className="w-6 h-6 bg-teal-100 rounded flex items-center justify-center">
                          <Mic className="h-3 w-3 text-teal-600" />
                        </div>
                        <span className="text-xs font-medium text-slate-700">Voice</span>
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

              {/* Mobile Profile Widgets - iPhone 16 Optimized */}
              {!isRecording && !isProcessing && (
                <div className="w-full max-w-sm space-y-2 mt-4">
                  {/* Your Numbers Today - Compact */}
                  <div className="grid grid-cols-3 gap-2">
                    <Card className="p-2 bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200">
                      <div className="text-center">
                        <FileText className="h-4 w-4 text-blue-600 mx-auto mb-1" />
                        <div className="text-sm font-bold text-blue-700">{userProfile.notesToday}</div>
                        <div className="text-xs text-blue-600">Notes</div>
                        <div className="text-xs text-green-600 flex items-center justify-center gap-0.5 mt-0.5">
                          <TrendingUp className="h-1.5 w-1.5" />
                          +3
                        </div>
                      </div>
                    </Card>
                    <Card className="p-2 bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200">
                      <div className="text-center">
                        <Timer className="h-4 w-4 text-emerald-600 mx-auto mb-1" />
                        <div className="text-sm font-bold text-emerald-700">{userProfile.timeSaved}h</div>
                        <div className="text-xs text-emerald-600">Saved</div>
                        <div className="text-xs text-green-600 flex items-center justify-center gap-0.5 mt-0.5">
                          <TrendingUp className="h-1.5 w-1.5" />
                          +47m
                        </div>
                      </div>
                    </Card>
                    <Card className="p-2 bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200">
                      <div className="text-center">
                        <Target className="h-4 w-4 text-purple-600 mx-auto mb-1" />
                        <div className="text-sm font-bold text-purple-700">{userProfile.accuracy}%</div>
                        <div className="text-xs text-purple-600">Accuracy</div>
                        <div className="text-xs text-green-600 flex items-center justify-center gap-0.5 mt-0.5">
                          <TrendingUp className="h-1.5 w-1.5" />
                          +0.5%
                        </div>
                      </div>
                    </Card>
                  </div>

                  {/* Quick Tips */}
                  <Card className="p-3 bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-200">
                    <div className="flex items-center gap-2 mb-2">
                      <BookOpen className="h-4 w-4 text-orange-600" />
                      <span className="text-sm font-semibold text-slate-900">Quick Tips</span>
                    </div>
                    <p className="text-xs text-slate-700">
                      Speak clearly and use medical terminology for best AI transcription accuracy.
                    </p>
                  </Card>

                  {/* Weekly Progress */}
                  <Card className="p-3 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Target className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-semibold text-slate-900">Weekly Goal</span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-700">Progress</span>
                        <span className="text-xs font-bold text-blue-600">{userProfile.notesThisWeek}/{userProfile.weeklyGoal}</span>
                      </div>
                      <Progress value={(userProfile.notesThisWeek / userProfile.weeklyGoal) * 100} className="h-1.5" />
                      <div className="text-xs text-slate-500">
                        {userProfile.weeklyGoal - userProfile.notesThisWeek} more to reach goal
                      </div>
                    </div>
                  </Card>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}