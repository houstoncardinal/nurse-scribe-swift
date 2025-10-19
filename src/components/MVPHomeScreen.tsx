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
  selectedTemplate?: string;
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
  selectedTemplate = 'SOAP',
  interimTranscript = '',
  voiceSupported = true
}: MVPHomeScreenProps) {
  // Use the prop value directly - no need for local state
  const currentTemplate = selectedTemplate;
  const [showInputSelector, setShowInputSelector] = useState(false);

  const templates = [
    // Traditional Templates
    { value: 'SOAP', label: 'SOAP (Subjective, Objective, Assessment, Plan)', category: 'Traditional' },
    { value: 'SBAR', label: 'SBAR (Situation, Background, Assessment, Recommendation)', category: 'Traditional' },
    { value: 'PIE', label: 'PIE (Problem, Intervention, Evaluation)', category: 'Traditional' },
    { value: 'DAR', label: 'DAR (Data, Action, Response)', category: 'Traditional' },
    
    // Epic EMR Templates
    { value: 'shift-assessment', label: 'Epic: Shift Assessment', category: 'Epic EMR' },
    { value: 'mar', label: 'Epic: Medication Administration (MAR)', category: 'Epic EMR' },
    { value: 'io', label: 'Epic: Intake & Output (I&O)', category: 'Epic EMR' },
    { value: 'wound-care', label: 'Epic: Wound Care Documentation', category: 'Epic EMR' },
    { value: 'safety-checklist', label: 'Epic: Safety Checklist', category: 'Epic EMR' },
    
    // Unit-Specific Epic Templates
    { value: 'med-surg', label: 'Epic: Med-Surg Unit', category: 'Unit-Specific' },
    { value: 'icu', label: 'Epic: ICU Unit', category: 'Unit-Specific' },
    { value: 'nicu', label: 'Epic: NICU Unit', category: 'Unit-Specific' },
    { value: 'mother-baby', label: 'Epic: Mother-Baby Unit', category: 'Unit-Specific' },
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
              {/* Desktop Layout - Powerful Grid Organization */}
              <div className="hidden lg:flex lg:h-full lg:overflow-hidden w-full">
                <div className="flex-1 px-6 py-4 overflow-hidden w-full">
                  <div className="w-full h-full flex flex-col">
                    {/* Desktop Header - Streamlined */}
                    <div className="text-center mb-4">
                      <div className="flex items-center justify-center gap-2.5 mb-2">
                        <div className="w-9 h-9 bg-gradient-to-br from-teal-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-teal-500/20">
                          <Mic className="h-4 w-4 text-white" />
                        </div>
                        <h1 className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                          Start New Note
                        </h1>
                      </div>
                      <p className="text-xs text-slate-600">Create professional nursing documentation with AI assistance</p>
                    </div>

                    {/* Template Selector - Centered */}
                    <div className="max-w-2xl mx-auto w-full mb-4">
                      <Select value={currentTemplate} onValueChange={(value) => {
                        onTemplateChange(value);
                      }}>
                        <SelectTrigger className="w-full h-10 text-sm bg-white border-2 border-slate-200 hover:border-teal-300 focus:border-teal-500 transition-colors shadow-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-white border border-slate-200 shadow-xl">
                          {templates.map((template) => (
                            <SelectItem key={template.value} value={template.value} className="hover:bg-teal-50 py-2.5">
                              <div className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 bg-gradient-to-br from-teal-500 to-blue-600 rounded-full" />
                                <span className="font-medium text-sm">{template.label}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Main Grid Layout - Powerful 3-Column Design */}
                    <div className="flex-1 grid grid-cols-3 gap-4 overflow-hidden min-h-0">
                      {/* Left Column - Recording Controls */}
                      <div className="col-span-1 flex flex-col space-y-3 overflow-y-auto pr-2">
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
                      selectedTemplate={currentTemplate}
                    />
                  </div>
                ) : (
                  <>
                        {/* Recording Control Card */}
                        <Card className="flex-shrink-0 flex flex-col items-center justify-center p-5 bg-gradient-to-br from-white to-slate-50/50 border-2 border-slate-200/80 shadow-lg">
                        <div className="relative flex flex-col items-center space-y-4 w-full">
                          <div className="relative">
                            {/* Multiple Pulse Rings */}
                            {isRecording && (
                              <>
                                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-red-500 to-pink-600 animate-ping opacity-60 scale-110" />
                                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-red-400 to-pink-500 animate-ping opacity-40 scale-125 animation-delay-300" />
                                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-red-300 to-pink-400 animate-ping opacity-20 scale-140 animation-delay-700" />
                              </>
                            )}
                            
                            {/* Main Recording Button */}
                            <Button
                              size="lg"
                              className={`w-40 h-40 rounded-full shadow-2xl transition-all duration-500 transform hover:scale-105 ${
                                isRecording 
                                  ? 'bg-gradient-to-br from-red-500 via-pink-600 to-red-600 hover:from-red-600 hover:via-pink-700 hover:to-red-700 shadow-red-500/30' 
                                  : 'bg-gradient-to-br from-teal-500 via-blue-600 to-teal-600 hover:from-teal-600 hover:via-blue-700 hover:to-teal-700 shadow-teal-500/30'
                              } ${isProcessing ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                console.log('🎤 Desktop microphone button clicked, isRecording:', isRecording);
                                if (isRecording) {
                                  console.log('🛑 Stopping recording...');
                                  onStopRecording();
                                } else {
                                  console.log('🎤 Starting recording...');
                                  onStartRecording();
                                }
                              }}
                              disabled={isProcessing}
                              type="button"
                            >
                              {isRecording ? (
                                <MicOff className="h-20 w-20 text-white drop-shadow-lg" />
                              ) : (
                                <Mic className="h-20 w-20 text-white drop-shadow-lg" />
                              )}
                            </Button>
                            
                            {/* Status Indicator */}
                            <div className={`absolute -top-2 -right-2 w-8 h-8 rounded-full border-3 border-white ${
                              isRecording ? 'bg-red-500 animate-pulse' : 
                              isProcessing ? 'bg-yellow-500 animate-spin' : 
                              'bg-green-500'
                            }`} />
                          </div>
                        </div>

                            {/* Status Display */}
                            <div className="text-center space-y-2 w-full max-w-md">
                              {isRecording && (
                                <div className="space-y-2">
                                  <div className="flex items-center justify-center gap-1.5">
                                    <div className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse shadow-lg shadow-red-500/50" />
                                    <span className="text-lg font-bold text-red-600">Recording...</span>
                                  </div>
                                  <div className="bg-red-50 border border-red-200 rounded-xl p-3">
                                    <div className="text-2xl font-mono font-bold text-red-700">
                                      {formatTime(recordingTime)}
                                    </div>
                                    <p className="text-xs text-red-600 mt-1.5">Click to stop recording</p>
                                  </div>
                                  
                                  {/* Live Transcript */}
                                  {interimTranscript && (
                                    <div className="bg-white border border-slate-200 rounded-lg p-2 shadow-md">
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
                                  <div className="flex items-center justify-center gap-1.5">
                                    <div className="w-2.5 h-2.5 bg-yellow-500 rounded-full animate-pulse shadow-lg shadow-yellow-500/50" />
                                    <span className="text-lg font-bold text-yellow-600">Processing...</span>
                                  </div>
                                  <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3">
                                    <Progress value={75} className="w-full h-2 mb-1.5" />
                                    <p className="text-xs text-yellow-700">AI analyzing speech...</p>
                                  </div>
                                </div>
                              )}

                              {!isRecording && !isProcessing && (
                                <div className="bg-gradient-to-br from-slate-50 to-blue-50/30 border border-slate-200 rounded-xl p-4 shadow-md">
                                  <h2 className="text-base font-bold text-slate-900 mb-1">Ready to Record</h2>
                                  <p className="text-sm text-slate-600 mb-2">
                                    Click the microphone to start AI-powered transcription
                                  </p>
                                  {!voiceSupported && (
                                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-2.5">
                                      <p className="text-xs text-yellow-800">
                                        ⚠️ Voice not supported. Use manual input.
                                      </p>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                        </Card>
                  </>
                )}

                        {/* Input Method Options Card */}
                        {!isRecording && !isProcessing && !transcript && (
                          <Card className="flex-shrink-0 p-4 bg-white border-2 border-slate-200/80 shadow-lg">
                            <h3 className="text-sm font-semibold text-slate-900 mb-2.5 text-center">Or choose another input method:</h3>
                            <div className="space-y-2.5">
                              <Button
                                variant="outline"
                                onClick={() => setShowInputSelector(true)}
                                className="h-12 flex items-center gap-2.5 bg-white border-2 border-slate-200 hover:border-blue-400 hover:bg-blue-50 transition-all duration-300 rounded-lg group"
                              >
                                <div className="w-8 h-8 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center group-hover:from-blue-200 group-hover:to-blue-300 transition-all">
                                  <Keyboard className="h-3.5 w-3.5 text-blue-600" />
                                </div>
                                <div className="text-left flex-1">
                                  <div className="font-semibold text-xs text-slate-700 group-hover:text-blue-700 transition-colors">Type or Paste Text</div>
                                  <div className="text-xs text-slate-500">Manual input method</div>
                                </div>
                              </Button>
                              <Button
                                variant="outline"
                                onClick={onStartRecording}
                                className="h-12 flex items-center gap-2.5 bg-white border-2 border-slate-200 hover:border-teal-400 hover:bg-teal-50 transition-all duration-300 rounded-lg group"
                              >
                                <div className="w-8 h-8 bg-gradient-to-br from-teal-100 to-teal-200 rounded-lg flex items-center justify-center group-hover:from-teal-200 group-hover:to-teal-300 transition-all">
                                  <Mic className="h-3.5 w-3.5 text-teal-600" />
                                </div>
                                <div className="text-left flex-1">
                                  <div className="font-semibold text-xs text-slate-700 group-hover:text-teal-700 transition-colors">Voice Dictation</div>
                                  <div className="text-xs text-slate-500">AI speech recognition</div>
                                </div>
                              </Button>
                            </div>
                          </Card>
                        )}

                        {/* Transcript Ready Card */}
                        {transcript && (
                          <Card className="flex-shrink-0 p-4 bg-white border-2 border-emerald-200 shadow-lg">
                            <Alert className="bg-emerald-50 border-emerald-200 rounded-lg p-2.5 mb-2.5">
                              <Shield className="h-4 w-4 text-emerald-600" />
                              <AlertDescription className="text-emerald-800 font-medium text-sm">
                                Transcript captured! Ready for {selectedTemplate} note.
                              </AlertDescription>
                            </Alert>
                            
                            <div className="bg-gradient-to-br from-slate-50 to-emerald-50/30 border border-slate-200 rounded-lg p-3 mb-2.5">
                              <div className="text-center space-y-1.5">
                                <div className="flex items-center justify-center gap-2">
                                  <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse" />
                                  <span className="text-sm font-semibold text-slate-700">Ready to Process</span>
                                </div>
                                <p className="text-xs text-slate-600">
                                  {transcript.length} characters • {selectedTemplate} template
                                </p>
                              </div>
                            </div>
                            
                            <Button
                              size="lg"
                              className="w-full h-10 text-sm font-bold bg-gradient-to-r from-emerald-500 via-teal-600 to-emerald-600 hover:from-emerald-600 hover:via-teal-700 hover:to-emerald-700 text-white transition-all duration-300 shadow-lg"
                              onClick={() => onNavigate('draft')}
                            >
                              <FileText className="h-4 w-4 mr-2" />
                              Preview Draft Note
                            </Button>
                          </Card>
                        )}
                      </div>

                      {/* Center Column - Performance Metrics */}
                      <div className="col-span-1 flex flex-col space-y-3 overflow-y-auto px-2">
                        {/* Performance Today */}
                        <Card className="p-3 bg-gradient-to-br from-white to-slate-50 border-2 border-slate-200/80 shadow-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-7 h-7 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center shadow-md">
                              <BarChart3 className="h-3 w-3 text-white" />
                            </div>
                            <h3 className="font-bold text-xs text-slate-900">Your Performance</h3>
                          </div>
                          <div className="grid grid-cols-1 gap-2">
                            <button
                              onClick={() => onNavigate('draft')}
                              className="flex items-center justify-between p-2.5 bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-lg border border-blue-200/60 hover:from-blue-100 hover:to-blue-200/60 hover:border-blue-300 transition-all cursor-pointer"
                            >
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                                  <FileText className="h-3.5 w-3.5 text-white" />
                                </div>
                                <div className="text-left">
                                  <div className="text-xs font-medium text-slate-700">Notes Created</div>
                                  <div className="text-xs text-slate-500">Today</div>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-xl font-bold text-blue-600">{userProfile.notesToday}</div>
                                <div className="text-xs text-green-600 flex items-center gap-0.5">
                                  <TrendingUp className="h-2.5 w-2.5" />
                                  +3
                                </div>
                              </div>
                            </button>
                            <button
                              onClick={() => onNavigate('draft')}
                              className="flex items-center justify-between p-2.5 bg-gradient-to-br from-emerald-50 to-emerald-100/50 rounded-lg border border-emerald-200/60 hover:from-emerald-100 hover:to-emerald-200/60 hover:border-emerald-300 transition-all cursor-pointer"
                            >
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center flex-shrink-0">
                                  <Timer className="h-3.5 w-3.5 text-white" />
                                </div>
                                <div className="text-left">
                                  <div className="text-xs font-medium text-slate-700">Time Saved</div>
                                  <div className="text-xs text-slate-500">Today</div>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-xl font-bold text-emerald-600">{userProfile.timeSaved}h</div>
                                <div className="text-xs text-green-600 flex items-center gap-0.5">
                                  <TrendingUp className="h-2.5 w-2.5" />
                                  +47m
                                </div>
                              </div>
                            </button>
                            <button
                              onClick={() => onNavigate('draft')}
                              className="flex items-center justify-between p-2.5 bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-lg border border-purple-200/60 hover:from-purple-100 hover:to-purple-200/60 hover:border-purple-300 transition-all cursor-pointer"
                            >
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
                                  <Target className="h-3.5 w-3.5 text-white" />
                                </div>
                                <div className="text-left">
                                  <div className="text-xs font-medium text-slate-700">Accuracy Rate</div>
                                  <div className="text-xs text-slate-500">Average</div>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-xl font-bold text-purple-600">{userProfile.accuracy}%</div>
                                <div className="text-xs text-green-600 flex items-center gap-0.5">
                                  <TrendingUp className="h-2.5 w-2.5" />
                                  +0.5%
                                </div>
                              </div>
                            </button>
                          </div>
                        </Card>

                        {/* Recent Notes */}
                        <Card className="p-3 bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-200 shadow-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-7 h-7 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                              <FileText className="h-3 w-3 text-white" />
                            </div>
                            <h3 className="font-semibold text-xs text-slate-900">Recent Notes</h3>
                          </div>
                          <div className="space-y-2">
                            <button
                              onClick={() => onNavigate('draft')}
                              className="w-full flex items-center gap-2 p-2 bg-white rounded-lg border border-indigo-100 hover:bg-indigo-50 hover:border-indigo-200 transition-all cursor-pointer"
                            >
                              <div className="w-7 h-7 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                <FileText className="h-3.5 w-3.5 text-green-600" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="text-xs font-medium text-slate-700 truncate">Morning Assessment</div>
                                <div className="text-xs text-slate-500">SOAP • 2h ago</div>
                              </div>
                              <Badge className="bg-green-100 text-green-700 border-green-200 text-xs flex-shrink-0">Complete</Badge>
                            </button>
                            <button
                              onClick={() => onNavigate('draft')}
                              className="w-full flex items-center gap-2 p-2 bg-white rounded-lg border border-indigo-100 hover:bg-indigo-50 hover:border-indigo-200 transition-all cursor-pointer"
                            >
                              <div className="w-7 h-7 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                <FileText className="h-3.5 w-3.5 text-blue-600" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="text-xs font-medium text-slate-700 truncate">Patient Transfer</div>
                                <div className="text-xs text-slate-500">SBAR • 4h ago</div>
                              </div>
                              <Badge className="bg-blue-100 text-blue-700 border-blue-200 text-xs flex-shrink-0">Exported</Badge>
                            </button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="w-full text-xs hover:bg-indigo-50 hover:border-indigo-300 transition-colors"
                              onClick={() => onNavigate('draft')}
                            >
                              View All Notes
                            </Button>
                          </div>
                        </Card>
                      </div>

                      {/* Right Column - Goals & Actions */}
                      <div className="col-span-1 flex flex-col space-y-3 overflow-y-auto pl-2">
                        {/* Weekly Goal Progress */}
                        <Card className="p-3 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 shadow-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-7 h-7 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                              <Target className="h-3 w-3 text-white" />
                            </div>
                            <h3 className="font-semibold text-xs text-slate-900">Weekly Goal</h3>
                          </div>
                          <div className="space-y-2">
                            <div className="p-2.5 bg-white rounded-lg border border-blue-100">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-medium text-slate-700">Progress</span>
                                <span className="text-sm font-bold text-blue-600">{userProfile.notesThisWeek}/{userProfile.weeklyGoal}</span>
                              </div>
                              <Progress value={(userProfile.notesThisWeek / userProfile.weeklyGoal) * 100} className="h-2 mb-1.5" />
                              <div className="text-xs text-slate-500">
                                {userProfile.weeklyGoal - userProfile.notesThisWeek} more to reach goal
                              </div>
                            </div>
                            <div className="flex items-center gap-2 p-2 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                              <div className="w-6 h-6 bg-green-500 rounded-lg flex items-center justify-center flex-shrink-0">
                                <TrendingUp className="h-3 w-3 text-white" />
                              </div>
                              <div className="flex-1">
                                <div className="text-xs font-semibold text-green-700">On track!</div>
                                <div className="text-xs text-green-600">84% of goal completed</div>
                              </div>
                            </div>
                          </div>
                        </Card>

                        {/* Quick Actions */}
                        <Card className="p-3 bg-gradient-to-br from-teal-50 to-cyan-50 border border-teal-200 shadow-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-7 h-7 bg-gradient-to-r from-teal-500 to-cyan-600 rounded-lg flex items-center justify-center">
                              <Zap className="h-3 w-3 text-white" />
                            </div>
                            <h3 className="font-semibold text-xs text-slate-900">Quick Actions</h3>
                          </div>
                          <div className="space-y-1.5">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="w-full justify-start text-xs h-9 hover:bg-teal-50 hover:border-teal-300 transition-colors"
                              onClick={() => onNavigate('draft')}
                            >
                              <FileText className="h-3 w-3 mr-2" />
                              Review Notes
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="w-full justify-start text-xs h-9 hover:bg-teal-50 hover:border-teal-300 transition-colors"
                              onClick={() => onNavigate('draft')}
                            >
                              <BarChart3 className="h-3 w-3 mr-2" />
                              View Analytics
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="w-full justify-start text-xs h-9 hover:bg-teal-50 hover:border-teal-300 transition-colors"
                              onClick={() => onNavigate('settings')}
                            >
                              <Settings className="h-3 w-3 mr-2" />
                              Settings
                            </Button>
                          </div>
                        </Card>

                        {/* Tips & Insights */}
                        <Card className="p-3 bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-200 shadow-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-7 h-7 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-lg flex items-center justify-center">
                              <BookOpen className="h-3 w-3 text-white" />
                            </div>
                            <h3 className="font-semibold text-xs text-slate-900">Pro Tip</h3>
                          </div>
                          <div className="space-y-1.5">
                            <p className="text-xs text-slate-700 leading-relaxed">
                              Speak clearly using medical terminology for optimal AI transcription accuracy.
                            </p>
                            <div className="flex items-center gap-1.5 text-xs text-orange-600">
                              <Star className="h-3 w-3 fill-orange-400" />
                              <span className="font-medium">99.2% average accuracy</span>
                            </div>
                          </div>
                        </Card>

                        {/* Activity Summary */}
                        <Card className="p-3 bg-gradient-to-br from-slate-50 to-gray-100 border border-slate-200 shadow-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-7 h-7 bg-gradient-to-r from-slate-500 to-gray-600 rounded-lg flex items-center justify-center">
                              <Activity className="h-3 w-3 text-white" />
                            </div>
                            <h3 className="font-semibold text-xs text-slate-900">Activity</h3>
                          </div>
                          <div className="space-y-1.5">
                            <div className="flex items-center justify-between p-1.5 bg-white rounded border border-slate-100">
                              <span className="text-xs text-slate-600">Pending Reviews</span>
                              <Badge className="bg-amber-100 text-amber-700 border-amber-200 text-xs">{userProfile.pendingReviews}</Badge>
                            </div>
                            <div className="flex items-center justify-between p-1.5 bg-white rounded border border-slate-100">
                              <span className="text-xs text-slate-600">Upcoming Tasks</span>
                              <Badge className="bg-blue-100 text-blue-700 border-blue-200 text-xs">{userProfile.upcomingTasks}</Badge>
                            </div>
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

            {/* Mobile Template Selector - Fixed Overflow */}
            <div className="w-full max-w-xs mx-auto px-4">
              <Select value={currentTemplate} onValueChange={(value) => {
                onTemplateChange(value);
              }}>
                <SelectTrigger className="w-full h-9 text-xs bg-white border border-slate-200 hover:border-teal-300 focus:border-teal-500 transition-colors shadow-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent 
                  className="bg-white border border-slate-200 shadow-xl"
                  position="popper"
                  side="bottom"
                  align="center"
                  sideOffset={4}
                >
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

        {/* Mobile Main Content Area - iPhone 16 Optimized - Fully Scrollable */}
        <div className="flex-1 px-4 py-6 space-y-4 overflow-y-auto pb-24">
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
                selectedTemplate={currentTemplate}
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
                  
                  {/* Responsive Main Button - Apple-level aesthetics */}
                  <Button
                    size="lg"
                    className={`w-28 h-28 sm:w-32 sm:h-32 rounded-full transition-all duration-500 transform hover:scale-105 active:scale-95 ${
                      isRecording 
                        ? 'bg-gradient-to-br from-red-500 via-pink-600 to-red-600 hover:from-red-600 hover:via-pink-700 hover:to-red-700 shadow-[0_8px_30px_rgb(239,68,68,0.4)] hover:shadow-[0_12px_40px_rgb(239,68,68,0.5)]' 
                        : 'bg-gradient-to-br from-teal-500 via-blue-600 to-teal-600 hover:from-teal-600 hover:via-blue-700 hover:to-teal-700 shadow-[0_8px_30px_rgb(20,184,166,0.4)] hover:shadow-[0_12px_40px_rgb(20,184,166,0.5)]'
                    } ${isProcessing ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} shadow-lg`}
                    style={{
                      boxShadow: isRecording 
                        ? '0 8px 30px rgba(239, 68, 68, 0.4), 0 2px 8px rgba(239, 68, 68, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
                        : '0 8px 30px rgba(20, 184, 166, 0.4), 0 2px 8px rgba(20, 184, 166, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
                    }}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      console.log('🎤 Mobile microphone button clicked, isRecording:', isRecording);
                      if (isRecording) {
                        console.log('🛑 Stopping recording...');
                        onStopRecording();
                      } else {
                        console.log('🎤 Starting recording...');
                        onStartRecording();
                      }
                    }}
                    disabled={isProcessing}
                    type="button"
                  >
                    {isRecording ? (
                      <MicOff className="h-12 w-12 sm:h-14 sm:w-14 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]" />
                    ) : (
                      <Mic className="h-12 w-12 sm:h-14 sm:w-14 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]" />
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
                  <div className="w-full max-w-xs mx-auto space-y-2">
                    <div className="text-center">
                      <p className="text-xs text-slate-600 mb-2">Or choose another method:</p>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        variant="outline"
                        onClick={() => setShowInputSelector(true)}
                        className="h-12 flex flex-col items-center justify-center gap-1 bg-white/95 backdrop-blur-sm border border-slate-200/60 hover:border-blue-400 hover:bg-blue-50 transition-all duration-300 rounded-lg group"
                        style={{
                          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.boxShadow = '0 6px 20px rgba(59, 130, 246, 0.15), 0 2px 6px rgba(59, 130, 246, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.9)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.8)';
                        }}
                      >
                        <div className="w-6 h-6 bg-gradient-to-br from-blue-100 to-blue-200 rounded flex items-center justify-center group-hover:from-blue-200 group-hover:to-blue-300 transition-all duration-300 shadow-sm">
                          <Keyboard className="h-3 w-3 text-blue-600 drop-shadow-sm" />
                        </div>
                        <span className="text-xs font-medium text-slate-700 group-hover:text-blue-700 transition-colors duration-300">Type</span>
                      </Button>
                      <Button
                        variant="outline"
                        onClick={onStartRecording}
                        className="h-12 flex flex-col items-center justify-center gap-1 bg-white/95 backdrop-blur-sm border border-slate-200/60 hover:border-teal-400 hover:bg-teal-50 transition-all duration-300 rounded-lg group"
                        style={{
                          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.boxShadow = '0 6px 20px rgba(20, 184, 166, 0.15), 0 2px 6px rgba(20, 184, 166, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.9)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.8)';
                        }}
                      >
                        <div className="w-6 h-6 bg-gradient-to-br from-teal-100 to-teal-200 rounded flex items-center justify-center group-hover:from-teal-200 group-hover:to-teal-300 transition-all duration-300 shadow-sm">
                          <Mic className="h-3 w-3 text-teal-600 drop-shadow-sm" />
                        </div>
                        <span className="text-xs font-medium text-slate-700 group-hover:text-teal-700 transition-colors duration-300">Voice</span>
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
                    className="w-full h-12 text-sm font-bold bg-gradient-to-r from-emerald-500 via-teal-600 to-emerald-600 hover:from-emerald-600 hover:via-teal-700 hover:to-emerald-700 text-white transition-all duration-300 transform hover:scale-105"
                    style={{
                      boxShadow: '0 6px 20px rgba(16, 185, 129, 0.4), 0 2px 8px rgba(16, 185, 129, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
                    }}
                    onClick={() => onNavigate('draft')}
                  >
                    <FileText className="h-4 w-4 mr-2 drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]" />
                    Preview Draft Note
                  </Button>
                </div>
              )}

              {/* Mobile Profile Widgets - Always Visible & Scrollable */}
              <div className="w-full max-w-sm mx-auto space-y-3 mt-4">
                  {/* Performance Metrics - Enhanced */}
                  <Card className="p-3 bg-gradient-to-br from-white to-slate-50 border-2 border-slate-200 shadow-lg">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-6 h-6 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
                        <BarChart3 className="h-3 w-3 text-white" />
                      </div>
                      <h3 className="font-bold text-sm text-slate-900">Your Performance</h3>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                    <Card className="p-2 bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200/60 shadow-[0_2px_8px_rgba(59,130,246,0.1)] hover:shadow-[0_4px_12px_rgba(59,130,246,0.15)] transition-all duration-300">
                      <div className="text-center">
                        <FileText className="h-4 w-4 text-blue-600 mx-auto mb-1 drop-shadow-sm" />
                        <div className="text-sm font-bold text-blue-700">{userProfile.notesToday}</div>
                        <div className="text-xs text-blue-600">Notes</div>
                        <div className="text-xs text-green-600 flex items-center justify-center gap-0.5 mt-0.5">
                          <TrendingUp className="h-1.5 w-1.5" />
                          +3
                        </div>
                      </div>
                    </Card>
                    <Card className="p-2 bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200/60 shadow-[0_2px_8px_rgba(16,185,129,0.1)] hover:shadow-[0_4px_12px_rgba(16,185,129,0.15)] transition-all duration-300">
                      <div className="text-center">
                        <Timer className="h-4 w-4 text-emerald-600 mx-auto mb-1 drop-shadow-sm" />
                        <div className="text-sm font-bold text-emerald-700">{userProfile.timeSaved}h</div>
                        <div className="text-xs text-emerald-600">Saved</div>
                        <div className="text-xs text-green-600 flex items-center justify-center gap-0.5 mt-0.5">
                          <TrendingUp className="h-1.5 w-1.5" />
                          +47m
                        </div>
                      </div>
                    </Card>
                    <Card className="p-2 bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200/60 shadow-[0_2px_8px_rgba(168,85,247,0.1)] hover:shadow-[0_4px_12px_rgba(168,85,247,0.15)] transition-all duration-300">
                      <div className="text-center">
                        <Target className="h-4 w-4 text-purple-600 mx-auto mb-1 drop-shadow-sm" />
                        <div className="text-sm font-bold text-purple-700">{userProfile.accuracy}%</div>
                        <div className="text-xs text-purple-600">Accuracy</div>
                        <div className="text-xs text-green-600 flex items-center justify-center gap-0.5 mt-0.5">
                          <TrendingUp className="h-1.5 w-1.5" />
                          +0.5%
                        </div>
                      </div>
                    </Card>
                    </div>
                  </Card>

                  {/* Pro Tip */}
                  <Card className="p-3 bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-200 shadow-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-lg flex items-center justify-center">
                        <BookOpen className="h-3 w-3 text-white" />
                      </div>
                      <h3 className="font-semibold text-sm text-slate-900">Pro Tip</h3>
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed mb-2">
                      Speak clearly using medical terminology for optimal AI transcription accuracy.
                    </p>
                    <div className="flex items-center gap-1.5 text-xs text-orange-600">
                      <Star className="h-3 w-3 fill-orange-400" />
                      <span className="font-medium">99.2% average accuracy</span>
                    </div>
                  </Card>

                  {/* Weekly Goal Progress */}
                  <Card className="p-3 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 shadow-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                        <Target className="h-3 w-3 text-white" />
                      </div>
                      <h3 className="font-semibold text-sm text-slate-900">Weekly Goal</h3>
                    </div>
                    <div className="space-y-2">
                      <div className="p-2 bg-white rounded-lg border border-blue-100">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-medium text-slate-700">Progress</span>
                          <span className="text-sm font-bold text-blue-600">{userProfile.notesThisWeek}/{userProfile.weeklyGoal}</span>
                        </div>
                        <Progress value={(userProfile.notesThisWeek / userProfile.weeklyGoal) * 100} className="h-2 mb-1" />
                        <div className="text-xs text-slate-500">
                          {userProfile.weeklyGoal - userProfile.notesThisWeek} more to reach goal
                        </div>
                      </div>
                      <div className="flex items-center gap-2 p-2 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                        <div className="w-5 h-5 bg-green-500 rounded-lg flex items-center justify-center flex-shrink-0">
                          <TrendingUp className="h-2.5 w-2.5 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="text-xs font-semibold text-green-700">On track!</div>
                          <div className="text-xs text-green-600">84% of goal completed</div>
                        </div>
                      </div>
                    </div>
                  </Card>

                  {/* Quick Actions */}
                  <Card className="p-3 bg-gradient-to-br from-teal-50 to-cyan-50 border border-teal-200 shadow-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 bg-gradient-to-r from-teal-500 to-cyan-600 rounded-lg flex items-center justify-center">
                        <Zap className="h-3 w-3 text-white" />
                      </div>
                      <h3 className="font-semibold text-sm text-slate-900">Quick Actions</h3>
                    </div>
                    <div className="space-y-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full justify-start text-xs h-9 hover:bg-teal-50 hover:border-teal-300 transition-colors"
                        onClick={() => onNavigate('history')}
                      >
                        <FileText className="h-3 w-3 mr-2" />
                        View Note History
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full justify-start text-xs h-9 hover:bg-teal-50 hover:border-teal-300 transition-colors"
                        onClick={() => onNavigate('analytics')}
                      >
                        <BarChart3 className="h-3 w-3 mr-2" />
                        View Analytics
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full justify-start text-xs h-9 hover:bg-teal-50 hover:border-teal-300 transition-colors"
                        onClick={() => onNavigate('settings')}
                      >
                        <Settings className="h-3 w-3 mr-2" />
                        Settings
                      </Button>
                    </div>
                  </Card>

                  {/* Activity Summary */}
                  <Card className="p-3 bg-gradient-to-br from-slate-50 to-gray-100 border border-slate-200 shadow-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 bg-gradient-to-r from-slate-500 to-gray-600 rounded-lg flex items-center justify-center">
                        <Activity className="h-3 w-3 text-white" />
                      </div>
                      <h3 className="font-semibold text-sm text-slate-900">Activity</h3>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-2 bg-white rounded-lg border border-slate-100">
                        <span className="text-xs text-slate-600">Pending Reviews</span>
                        <Badge className="bg-amber-100 text-amber-700 border-amber-200 text-xs">{userProfile.pendingReviews}</Badge>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-white rounded-lg border border-slate-100">
                        <span className="text-xs text-slate-600">Upcoming Tasks</span>
                        <Badge className="bg-blue-100 text-blue-700 border-blue-200 text-xs">{userProfile.upcomingTasks}</Badge>
                      </div>
                    </div>
                  </Card>

                  {/* Recent Notes */}
                  <Card className="p-3 bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-200 shadow-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <FileText className="h-3 w-3 text-white" />
                      </div>
                      <h3 className="font-semibold text-sm text-slate-900">Recent Notes</h3>
                    </div>
                    <div className="space-y-2">
                      <button
                        onClick={() => onNavigate('history')}
                        className="w-full flex items-center gap-2 p-2 bg-white rounded-lg border border-indigo-100 hover:bg-indigo-50 hover:border-indigo-200 transition-all"
                      >
                        <div className="w-6 h-6 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <FileText className="h-3 w-3 text-green-600" />
                        </div>
                        <div className="flex-1 min-w-0 text-left">
                          <div className="text-xs font-medium text-slate-700 truncate">Morning Assessment</div>
                          <div className="text-xs text-slate-500">SOAP • 2h ago</div>
                        </div>
                        <Badge className="bg-green-100 text-green-700 border-green-200 text-xs flex-shrink-0">Done</Badge>
                      </button>
                      <button
                        onClick={() => onNavigate('history')}
                        className="w-full flex items-center gap-2 p-2 bg-white rounded-lg border border-indigo-100 hover:bg-indigo-50 hover:border-indigo-200 transition-all"
                      >
                        <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <FileText className="h-3 w-3 text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0 text-left">
                          <div className="text-xs font-medium text-slate-700 truncate">Patient Transfer</div>
                          <div className="text-xs text-slate-500">SBAR • 4h ago</div>
                        </div>
                        <Badge className="bg-blue-100 text-blue-700 border-blue-200 text-xs flex-shrink-0">Sent</Badge>
                      </button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full text-xs hover:bg-indigo-50 hover:border-indigo-300 transition-colors"
                        onClick={() => onNavigate('history')}
                      >
                        View All Notes
                      </Button>
                    </div>
                  </Card>
                </div>
            </>
          )}
        </div>
      </div>

    </div>
  );
}
