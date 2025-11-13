import { useState, useEffect } from 'react';
import { Mic, MicOff, Clock, Zap, Shield, Keyboard, Upload, FileText, TrendingUp, Target, Award, Activity, BarChart3, CheckCircle, Star, Timer, Users, BookOpen, AlertTriangle, Bell, Calendar, TrendingDown, Settings, Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { InputMethodSelector } from '@/components/InputMethodSelector';
import { SyntheticAI } from '@/components/SyntheticAI';

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
  const [aiWidgetMinimized, setAiWidgetMinimized] = useState(true);
  const [aiWidgetClosed, setAiWidgetClosed] = useState(false);
  const [visibleInterimTranscript, setVisibleInterimTranscript] = useState(interimTranscript);
  const [lastInterimUpdate, setLastInterimUpdate] = useState<number | null>(null);

  // Keep the live transcript bubble visible until 6s of silence
  useEffect(() => {
    if (interimTranscript) {
      setVisibleInterimTranscript(interimTranscript);
      setLastInterimUpdate(Date.now());
    }
  }, [interimTranscript]);

  useEffect(() => {
    if (!visibleInterimTranscript || !lastInterimUpdate) return;

    const interval = setInterval(() => {
      if (Date.now() - lastInterimUpdate >= 6000) {
        setVisibleInterimTranscript('');
        setLastInterimUpdate(null);
      }
    }, 500);

    return () => clearInterval(interval);
  }, [visibleInterimTranscript, lastInterimUpdate]);

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

  const getTemplateExample = (template: string) => {
    const examples: Record<string, string> = {
      'SOAP': 'Patient reports mild chest discomfort for 2 hours. Denies shortness of breath. BP 128/84, HR 82, Temp 98.4°F. Appears comfortable, chest pain likely musculoskeletal. Will monitor vitals and provide acetaminophen.',
      'SBAR': 'Patient in room 302 with increased confusion since 2am. Has UTI history, last void 8 hours ago. Alert but disoriented to time. Recommend urinalysis and consider antibiotic coverage.',
      'PIE': 'Patient experiencing post-op pain rated 7/10. Administered morphine 4mg IV per order. Pain decreased to 3/10 after 30 minutes. Continue monitoring pain levels.',
      'DAR': 'Patient temperature 101.2°F, increased from baseline. Administered acetaminophen 650mg PO per protocol. Temp decreased to 99.1°F after 1 hour.',
      'shift-assessment': 'Neuro: Alert and oriented times 3. Cardiovascular: Regular rate and rhythm, no edema. Respiratory: Clear bilateral breath sounds, oxygen saturation 98% on room air. GI: Abdomen soft, non-tender.',
      'mar': 'Lisinopril 10mg PO administered at 0900. Patient tolerated medication well, no adverse reactions noted. Blood pressure 118/76 post-administration.',
      'io': 'Intake: 1200ml PO fluids, 500ml IV normal saline. Output: 800ml urine, 200ml emesis. Net positive 700ml. Patient maintaining adequate hydration.',
      'wound-care': 'Stage 2 pressure ulcer on sacrum, 3cm x 2cm. Wound bed pink with minimal drainage. Cleaned with normal saline, applied hydrocolloid dressing. Will reassess in 48 hours.',
      'safety-checklist': 'Bed in low position, call light within reach, side rails up times 2. Fall risk precautions in place. Patient educated on call for assistance before getting up.',
      'med-surg': 'Patient post-appendectomy day 1. Vital signs stable, incision clean and dry. Tolerating clear liquids, ambulated 50 feet with assistance. Pain controlled with oral medication.',
      'icu': 'Sedation score 2, responds to verbal stimuli. Ventilator settings: AC mode, TV 450ml, RR 14, FiO2 40%, PEEP 5. ABG within normal limits. Hemodynamically stable on norepinephrine 5mcg/min.',
      'nicu': 'Preterm infant 32 weeks gestational age. Respiratory: On CPAP 6cm H2O, FiO2 30%, oxygen saturation 95%. Feeding: NPO, receiving TPN. Temperature stable in isolette.',
      'mother-baby': 'Postpartum day 2, vaginal delivery. Fundus firm at umbilicus, lochia moderate rubra. Breastfeeding well, infant latching appropriately. Patient ambulating without difficulty.',
    };
    return examples[template] || examples['SOAP'];
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
    <div className="mvp-app bg-gradient-hero">
              {/* Desktop Layout - Powerful Grid Organization */}
              <div className="hidden lg:flex lg:h-full w-full">
                <div className="flex-1 w-full px-6 lg:px-8 py-6 overflow-x-hidden">
                  <div className="w-full h-full flex flex-col">
                    {/* Desktop Header - Streamlined */}
                    <div className="mb-6 max-w-[1400px] mr-auto">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-11 h-11 bg-gradient-to-br from-teal-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-teal-500/20">
                          <Mic className="h-6 w-6 text-white" />
                        </div>
                        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Start New Note</h1>
                      </div>
                      <p className="text-base text-slate-600 ml-[56px] font-medium">Create professional nursing documentation with AI assistance</p>
                    </div>

                    {/* Template Selector - Left Aligned */}
                    <div className="max-w-2xl w-full mb-8 max-w-[1400px] mr-auto">
                      <Label className="text-sm font-semibold text-slate-700 mb-2 block">Select Documentation Template</Label>
                      <Select value={currentTemplate} onValueChange={(value) => {
                        onTemplateChange(value);
                      }}>
                        <SelectTrigger className="w-full h-12 text-sm bg-white border-2 border-slate-300 hover:border-teal-500 focus:border-teal-600 focus:ring-2 focus:ring-teal-500/20 transition-all shadow-[0_2px_8px_rgb(0,0,0,0.04)] hover:shadow-[0_4px_12px_rgb(0,0,0,0.08)] rounded-xl font-medium text-slate-800">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-white backdrop-blur-xl border-2 border-slate-200 shadow-[0_12px_40px_rgb(0,0,0,0.15)] rounded-xl p-2">
                          {templates.map((template) => (
                            <SelectItem
                              key={template.value}
                              value={template.value}
                              className="hover:bg-gradient-to-r hover:from-teal-50 hover:to-blue-50 focus:bg-gradient-to-r focus:from-teal-50 focus:to-blue-50 cursor-pointer py-3 px-3 rounded-lg my-1 transition-all duration-200"
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-2 h-2 bg-gradient-to-br from-teal-500 to-blue-600 rounded-full shadow-sm flex-shrink-0" />
                                <span className="font-semibold text-sm text-slate-800">{template.label}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Main Grid Layout - Powerful 2-Column Design */}
                    <div className="flex-1 overflow-x-hidden overflow-y-hidden">
                      <div className="relative h-full w-full max-w-[1400px] mr-auto rounded-3xl border-2 border-slate-200/60 bg-gradient-to-br from-white via-slate-50/30 to-blue-50/20 shadow-[0_8px_30px_rgb(0,0,0,0.06)] backdrop-blur-xl p-3 lg:p-4 overflow-x-hidden">
                        <div className="relative h-full grid grid-cols-1 gap-3 lg:gap-4 min-h-0 lg:grid-cols-2 w-full overflow-x-hidden">
                      {/* Left Column - Recording Controls */}
                      <div className="col-span-1 h-full flex flex-col space-y-2 overflow-y-auto overflow-x-hidden pr-2 pl-0 min-w-0 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent hover:scrollbar-thumb-slate-400">
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
                        <Card className="flex-shrink-0 flex flex-col items-center justify-center p-6 min-h-[400px] bg-white/90 border-2 border-slate-200/50 shadow-[0_4px_20px_rgb(0,0,0,0.04)] backdrop-blur-sm rounded-3xl">
                        <div className="relative flex flex-col items-center space-y-4 w-full">
                          <div className="relative py-4">
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
                                  ? 'bg-gradient-to-br from-red-500 via-pink-600 to-red-600'
                                  : 'bg-gradient-primary'
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
                                <MicOff className="h-28 w-28 text-white drop-shadow-lg" />
                              ) : (
                                <Mic className="h-28 w-28 text-white drop-shadow-lg" />
                              )}
                            </Button>

                            {/* Status Indicator */}
                            <div className={`absolute -top-3 -right-3 w-10 h-10 rounded-full border-4 border-white shadow-lg ${
                              isRecording ? 'bg-red-500 animate-pulse' :
                              isProcessing ? 'bg-yellow-500 animate-spin' :
                              'bg-green-500'
                            }`} />
                          </div>
                        </div>

                            {/* Status Display */}
                            <div className="text-center space-y-3 w-full max-w-md">
                              {isRecording && (
                                <div className="space-y-3">
                                  <div className="flex items-center justify-center gap-2">
                                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse shadow-lg shadow-red-500/50" />
                                    <span className="text-xl font-bold text-red-600">Recording...</span>
                                  </div>
                                  <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                                    <div className="text-2xl font-mono font-bold text-red-700">
                                      {formatTime(recordingTime)}
                                    </div>
                                    <p className="text-xs text-red-600 mt-1.5">Click to stop recording</p>
                                  </div>
                                  
                                  {/* Live Transcript */}
                                  {visibleInterimTranscript && (
                                    <div className="bg-card border border-border rounded-lg p-2 shadow-md">
                                      <p className="text-xs text-muted-foreground mb-1">Live transcription:</p>
                                      <p className="text-foreground font-medium italic text-sm">
                                        "{visibleInterimTranscript}"
                                      </p>
                                    </div>
                                  )}
                                </div>
                              )}

                              {isProcessing && (
                                <div className="space-y-3">
                                  <div className="flex items-center justify-center gap-2">
                                    <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse shadow-lg shadow-yellow-500/50" />
                                    <span className="text-xl font-bold text-yellow-600">Processing...</span>
                                  </div>
                                  <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                                    <Progress value={75} className="w-full h-2.5 mb-2" />
                                    <p className="text-sm text-yellow-700 font-medium">AI analyzing speech...</p>
                                  </div>
                                </div>
                              )}

                              {!isRecording && !isProcessing && (
                                <div className="bg-gradient-hero border border-border rounded-xl p-5 shadow-md">
                                  <h2 className="text-lg font-bold text-foreground mb-2">Ready to Record</h2>
                                  <p className="text-sm text-muted-foreground mb-3">
                                    Click the microphone to start AI-powered transcription
                                  </p>
                                  {!voiceSupported && (
                                    <div className="bg-warning/10 border border-warning/30 rounded-lg p-2.5">
                                      <p className="text-xs text-warning-foreground">
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
                          <Card className="flex-shrink-0 p-2.5 bg-white/90 border-2 border-slate-200/50 shadow-[0_4px_20px_rgb(0,0,0,0.04)] backdrop-blur-sm rounded-3xl">
                            <h3 className="text-sm font-semibold text-foreground mb-2 text-center">Or choose another input method:</h3>
                            <div className="grid gap-2 md:grid-cols-2">
                              <Button
                                type="button"
                                variant="ghost"
                                onClick={() => setShowInputSelector(true)}
                                className="group flex min-h-[130px] flex-col justify-between rounded-2xl border border-border bg-gradient-hero p-3.5 text-left shadow-[0_20px_45px_rgba(0,0,0,0.05)] transition hover:-translate-y-0.5 hover:shadow-[0_25px_50px_rgba(0,0,0,0.08)]"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white shadow-sm shadow-blue-200/80 group-hover:bg-white">
                                    <Keyboard className="h-5 w-5 text-blue-600" />
                                  </div>
                                  <div>
                                    <p className="text-sm font-semibold text-blue-700">Manual Typing</p>
                                    <p className="text-xs text-slate-500">Type or paste text</p>
                                  </div>
                                </div>
                                <p className="text-xs text-slate-500 leading-relaxed break-words whitespace-normal">
                                  Precision editing and offline use for detailed documentation.
                                </p>
                                <div className="flex items-center justify-between bg-white/60 rounded-lg px-2.5 py-1.5 border border-blue-100">
                                  <span className="text-[0.7rem] font-bold text-blue-700">2-5 min</span>
                                  <span className="text-[0.7rem] font-bold text-blue-700">100% accuracy</span>
                                </div>
                              </Button>
                              <Button
                                type="button"
                                variant="ghost"
                                onClick={onStartRecording}
                                className="group flex min-h-[130px] flex-col justify-between rounded-2xl border border-slate-200/80 bg-gradient-to-br from-teal-50/80 via-white to-teal-100 p-3.5 text-left shadow-[0_20px_45px_rgba(16,185,129,0.15)] transition hover:-translate-y-0.5 hover:shadow-[0_25px_50px_rgba(16,185,129,0.25)]"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white shadow-sm shadow-teal-200/80 group-hover:bg-white">
                                    <Mic className="h-5 w-5 text-teal-600" />
                                  </div>
                                  <div>
                                    <p className="text-sm font-semibold text-teal-700">Voice Dictation</p>
                                    <p className="text-xs text-slate-500">AI speech recognition</p>
                                  </div>
                                </div>
                                <p className="text-xs text-slate-500 leading-relaxed break-words whitespace-normal">
                                  Hands-free recording with adaptive prompts for fast capture.
                                </p>
                                <div className="flex items-center justify-between bg-white/60 rounded-lg px-2.5 py-1.5 border border-teal-100">
                                  <span className="text-[0.7rem] font-bold text-teal-700">30-60s</span>
                                  <span className="text-[0.7rem] font-bold text-teal-700">≈99% accuracy</span>
                                </div>
                              </Button>
                            </div>
                          </Card>
                        )}

                        {/* Pro Tip - Template Example */}
                        {!isRecording && !isProcessing && !transcript && (
                          <Card className="flex-shrink-0 p-2.5 bg-gradient-to-br from-amber-50/80 to-orange-50/80 border-2 border-amber-200/60 shadow-[0_4px_20px_rgb(251,191,36,0.08)] backdrop-blur-sm rounded-3xl">
                            <div className="flex items-center gap-2 mb-1.5">
                              <div className="w-7 h-7 bg-gradient-to-r from-amber-500 to-orange-600 rounded-lg flex items-center justify-center">
                                <BookOpen className="h-4 w-4 text-white" />
                              </div>
                              <h3 className="font-semibold text-sm text-slate-900">Example Input for {templates.find(t => t.value === currentTemplate)?.label.split('(')[0].trim()}</h3>
                            </div>
                            <div className="bg-white/70 rounded-lg p-1.5 mb-1.5">
                              <p className="text-xs text-slate-700 leading-snug italic">
                                "{getTemplateExample(currentTemplate)}"
                              </p>
                            </div>
                            <div className="flex items-center gap-1.5 text-xs text-amber-700">
                              <Star className="h-3 w-3 fill-amber-400" />
                              <span className="font-medium">Speak naturally - AI will format it properly</span>
                            </div>
                          </Card>
                        )}

                        {/* Transcript Ready Card */}
                        {transcript && (
                          <Card className="flex-shrink-0 p-2.5 bg-white/95 border-2 border-emerald-200/60 shadow-[0_4px_20px_rgb(16,185,129,0.12)] backdrop-blur-sm rounded-3xl">
                            <Alert className="bg-emerald-50 border-emerald-200 rounded-lg p-2 mb-2">
                              <Shield className="h-4 w-4 text-emerald-600" />
                              <AlertDescription className="text-emerald-800 font-medium text-sm">
                                Transcript captured! Ready for {selectedTemplate} note.
                              </AlertDescription>
                            </Alert>

                            <div className="bg-gradient-to-br from-slate-50 to-emerald-50/30 border border-slate-200 rounded-lg p-2 mb-2">
                              <div className="text-center space-y-1">
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
                              className="w-full h-9 text-sm font-bold bg-gradient-to-r from-emerald-500 via-teal-600 to-emerald-600 hover:from-emerald-600 hover:via-teal-700 hover:to-emerald-700 text-white transition-all duration-300 shadow-lg"
                              onClick={() => onNavigate('draft')}
                            >
                              <FileText className="h-4 w-4 mr-2" />
                              Preview Draft Note
                            </Button>
                          </Card>
                        )}
                      </div>

                      {/* Right Column - Performance Metrics, Goals & Actions */}
                      <div className="col-span-1 h-full flex flex-col space-y-2 overflow-y-auto overflow-x-hidden pl-2 pr-0 min-w-0 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent hover:scrollbar-thumb-slate-400">
                        {/* Performance Today */}
                        <Card className="p-2.5 bg-gradient-to-br from-white via-slate-50/50 to-blue-50/30 border-2 border-slate-200/60 shadow-[0_4px_20px_rgb(0,0,0,0.04)] backdrop-blur-sm rounded-2xl">
                          <div className="flex items-center gap-2 mb-1">
                            <div className="w-7 h-7 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center shadow-md">
                              <BarChart3 className="h-3 w-3 text-white" />
                            </div>
                            <h3 className="font-bold text-xs text-slate-900">Your Performance</h3>
                          </div>
                          <div className="grid grid-cols-1 gap-1">
                            <button
                              onClick={() => onNavigate('analytics')}
                              className="flex items-center justify-between p-1.5 bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-lg border border-blue-200/60 hover:from-blue-100 hover:to-blue-200/60 hover:border-blue-300 transition-all cursor-pointer"
                            >
                              <div className="flex items-center gap-1.5">
                                <div className="w-7 h-7 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                                  <FileText className="h-3 w-3 text-white" />
                                </div>
                                <div className="text-left">
                                  <div className="text-xs font-medium text-slate-700">Notes Created</div>
                                  <div className="text-xs text-slate-500">Today</div>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-lg font-bold text-blue-600">{userProfile.notesToday}</div>
                                <div className="text-xs text-green-600 flex items-center gap-0.5">
                                  <TrendingUp className="h-2 w-2" />
                                  +3
                                </div>
                              </div>
                            </button>
                            <button
                              onClick={() => onNavigate('analytics')}
                              className="flex items-center justify-between p-1.5 bg-gradient-to-br from-emerald-50 to-emerald-100/50 rounded-lg border border-emerald-200/60 hover:from-emerald-100 hover:to-emerald-200/60 hover:border-emerald-300 transition-all cursor-pointer"
                            >
                              <div className="flex items-center gap-1.5">
                                <div className="w-7 h-7 bg-emerald-500 rounded-lg flex items-center justify-center flex-shrink-0">
                                  <Timer className="h-3 w-3 text-white" />
                                </div>
                                <div className="text-left">
                                  <div className="text-xs font-medium text-slate-700">Time Saved</div>
                                  <div className="text-xs text-slate-500">Today</div>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-lg font-bold text-emerald-600">{userProfile.timeSaved}h</div>
                                <div className="text-xs text-green-600 flex items-center gap-0.5">
                                  <TrendingUp className="h-2 w-2" />
                                  +47m
                                </div>
                              </div>
                            </button>
                            <button
                              onClick={() => onNavigate('analytics')}
                              className="flex items-center justify-between p-1.5 bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-lg border border-purple-200/60 hover:from-purple-100 hover:to-purple-200/60 hover:border-purple-300 transition-all cursor-pointer"
                            >
                              <div className="flex items-center gap-1.5">
                                <div className="w-7 h-7 bg-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
                                  <Target className="h-3 w-3 text-white" />
                                </div>
                                <div className="text-left">
                                  <div className="text-xs font-medium text-slate-700">Accuracy Rate</div>
                                  <div className="text-xs text-slate-500">Average</div>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-lg font-bold text-purple-600">{userProfile.accuracy}%</div>
                                <div className="text-xs text-green-600 flex items-center gap-0.5">
                                  <TrendingUp className="h-2 w-2" />
                                  +0.5%
                                </div>
                              </div>
                            </button>
                          </div>
                        </Card>

                        {/* Recent Notes */}
                        <Card className="p-2.5 bg-gradient-to-br from-indigo-50/80 to-purple-50/80 border-2 border-indigo-200/60 shadow-[0_4px_20px_rgb(99,102,241,0.08)] backdrop-blur-sm rounded-2xl">
                          <div className="flex items-center gap-2 mb-1">
                            <div className="w-7 h-7 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                              <FileText className="h-3 w-3 text-white" />
                            </div>
                            <h3 className="font-semibold text-xs text-slate-900">Recent Notes</h3>
                          </div>
                          <div className="space-y-1.5">
                            <button
                              onClick={() => onNavigate('history')}
                              className="w-full flex items-center gap-1.5 p-1.5 bg-white rounded-lg border border-indigo-100 hover:bg-indigo-50 hover:border-indigo-200 transition-all cursor-pointer"
                            >
                              <div className="w-6 h-6 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                <FileText className="h-3 w-3 text-green-600" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="text-xs font-medium text-slate-700 truncate">Morning Assessment</div>
                                <div className="text-xs text-slate-500">SOAP • 2h ago</div>
                              </div>
                              <Badge className="bg-green-100 text-green-700 border-green-200 text-xs flex-shrink-0">Complete</Badge>
                            </button>
                            <button
                              onClick={() => onNavigate('history')}
                              className="w-full flex items-center gap-1.5 p-1.5 bg-white rounded-lg border border-indigo-100 hover:bg-indigo-50 hover:border-indigo-200 transition-all cursor-pointer"
                            >
                              <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                <FileText className="h-3 w-3 text-blue-600" />
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
                              className="w-full text-xs hover:bg-indigo-50 hover:border-indigo-300 hover:text-slate-900 transition-colors"
                              onClick={() => onNavigate('history')}
                            >
                              View All Notes
                            </Button>
                          </div>
                        </Card>

                        {/* Quick Actions */}
                        <Card className="p-2.5 bg-gradient-to-br from-teal-50/80 to-cyan-50/80 border-2 border-teal-200/60 shadow-[0_4px_20px_rgb(20,184,166,0.08)] backdrop-blur-sm rounded-2xl">
                          <div className="flex items-center gap-2 mb-1">
                            <div className="w-7 h-7 bg-gradient-to-r from-teal-500 to-cyan-600 rounded-lg flex items-center justify-center">
                              <Zap className="h-3 w-3 text-white" />
                            </div>
                            <h3 className="font-semibold text-xs text-slate-900">Quick Actions</h3>
                          </div>
                          <div className="space-y-1">
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full justify-start text-xs h-8 hover:bg-teal-50 hover:border-teal-300 hover:text-slate-900 transition-colors"
                              onClick={() => onNavigate('history')}
                            >
                              <FileText className="h-3 w-3 mr-2" />
                              Review Notes
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full justify-start text-xs h-8 hover:bg-teal-50 hover:border-teal-300 hover:text-slate-900 transition-colors"
                              onClick={() => onNavigate('analytics')}
                            >
                              <BarChart3 className="h-3 w-3 mr-2" />
                              View Analytics
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full justify-start text-xs h-8 hover:bg-teal-50 hover:border-teal-300 hover:text-slate-900 transition-colors"
                              onClick={() => onNavigate('settings')}
                            >
                              <Settings className="h-3 w-3 mr-2" />
                              Settings
                            </Button>
                          </div>
                        </Card>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

      {/* Mobile/Tablet Layout */}
      <div className="lg:hidden mvp-screen w-full">
        {/* Mobile Header - iPhone 16 Optimized */}
        <div className="flex-shrink-0 px-4 pt-4 pb-2 safe-area-top w-full">
          <div className="text-center space-y-3">
            {/* Mobile Hero - Compact for iPhone */}
            <div className="space-y-4 pt-4">
              <div className="flex items-center justify-center gap-2.5">
                <div className="w-9 h-9 bg-gradient-to-br from-teal-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-teal-500/20">
                  <Mic className="h-5 w-5 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                  Start New Note
                </h1>
              </div>
              <p className="text-sm text-slate-600 font-medium">Professional AI-powered documentation</p>
            </div>

            {/* Mobile Template Selector - Enhanced */}
            <div className="w-full max-w-sm mx-auto px-4">
              <Label className="text-xs font-semibold text-slate-700 mb-2 block">Select Template</Label>
              <Select value={currentTemplate} onValueChange={(value) => {
                onTemplateChange(value);
              }}>
                <SelectTrigger className="w-full h-11 text-xs bg-white border-2 border-slate-300 hover:border-teal-500 focus:border-teal-600 focus:ring-2 focus:ring-teal-500/20 transition-all shadow-sm rounded-xl font-medium text-slate-800">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent
                  className="bg-white backdrop-blur-xl border-2 border-slate-200 shadow-[0_12px_40px_rgb(0,0,0,0.15)] rounded-xl p-2"
                  position="popper"
                  side="bottom"
                  align="center"
                  sideOffset={4}
                >
                  {templates.map((template) => (
                    <SelectItem key={template.value} value={template.value} className="hover:bg-gradient-to-r hover:from-teal-50 hover:to-blue-50 cursor-pointer py-2.5 px-3 rounded-lg my-1 transition-all duration-200">
                      <div className="flex items-center gap-2.5">
                        <div className="w-1.5 h-1.5 bg-gradient-to-br from-teal-500 to-blue-600 rounded-full shadow-sm flex-shrink-0" />
                        <span className="font-semibold text-xs text-slate-800">{template.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Mobile Main Content Area - iPhone 16 Optimized - Fully Scrollable */}
        <div className="flex-1 w-full py-6 space-y-4 overflow-y-auto pb-24">
          <div className="px-4 space-y-4 w-full">
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
                      <MicOff className="h-14 w-14 sm:h-16 sm:w-16 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]" />
                    ) : (
                      <Mic className="h-14 w-14 sm:h-16 sm:w-16 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]" />
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
                    {visibleInterimTranscript && (
                      <div className="bg-card border border-border rounded-xl p-3 max-w-sm mx-auto shadow-lg">
                        <p className="text-xs text-muted-foreground mb-1">Live transcription:</p>
                        <p className="text-foreground font-medium italic text-sm">
                          "{visibleInterimTranscript}"
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

                    {/* Mobile Pro Tip - Template Example */}
                    <div className="w-full max-w-md mx-auto mt-3">
                      <Card className="p-4 bg-gradient-to-br from-amber-50/90 to-orange-50/90 border-2 border-amber-200/60 shadow-[0_4px_20px_rgb(251,191,36,0.12)] backdrop-blur-sm rounded-2xl">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-7 h-7 bg-gradient-to-r from-amber-500 to-orange-600 rounded-lg flex items-center justify-center">
                            <BookOpen className="h-4 w-4 text-white" />
                          </div>
                          <h3 className="font-semibold text-sm text-slate-900">Example Input for {templates.find(t => t.value === currentTemplate)?.label.split('(')[0].trim()}</h3>
                        </div>
                        <div className="bg-white/80 rounded-lg p-3 mb-3">
                          <p className="text-xs text-slate-700 leading-relaxed italic">
                            "{getTemplateExample(currentTemplate)}"
                          </p>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-amber-700">
                          <Star className="h-3 w-3 fill-amber-400" />
                          <span className="font-medium">Speak naturally - AI will format it properly</span>
                        </div>
                      </Card>
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
              <div className="w-full space-y-3 mt-4">
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

      {/* Raha AI Widget - Always Visible */}
      {!aiWidgetClosed && (
        <SyntheticAI
          isMinimized={aiWidgetMinimized}
          onToggleMinimize={() => setAiWidgetMinimized(!aiWidgetMinimized)}
          onClose={() => setAiWidgetClosed(true)}
          onAction={(action, data) => {
            console.log('AI Action:', action, data);
            // Handle AI actions here
            switch (action) {
              case 'start-recording':
                onStartRecording();
                break;
              case 'stop-recording':
                onStopRecording();
                break;
              case 'navigate':
                onNavigate(data.screen);
                break;
              case 'change-template':
                onTemplateChange(data.template);
                break;
              default:
                console.log('Unhandled AI action:', action);
            }
          }}
          currentContext={{
            screen: 'home',
            template: selectedTemplate,
            hasTranscript: !!transcript,
            hasNote: false
          }}
        />
      )}

    </div>
  );
}
