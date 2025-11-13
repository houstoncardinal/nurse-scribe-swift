import { useState, useEffect } from 'react';
import { Mic, MicOff, Clock, Zap, Shield, Keyboard, Upload, FileText, TrendingUp, Target, Award, Activity, BarChart3, CheckCircle, Star, Timer, Users, BookOpen, AlertTriangle, Bell, Calendar, TrendingDown, Settings, Brain, ChevronDown } from 'lucide-react';
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
  const [showWalkthrough, setShowWalkthrough] = useState(false);
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
    <div className="mvp-app bg-white">
              {/* Desktop Layout - Powerful Grid Organization */}
              <div className="hidden lg:flex lg:h-full w-full">
                <div className="flex-1 w-full px-6 lg:px-8 py-6 overflow-x-hidden">
                  <div className="w-full h-full flex flex-col">
                    {/* Desktop Header - Compact */}
                    <div className="mb-3 max-w-[1400px] mr-auto">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-blue-600 rounded-xl flex items-center justify-center shadow-md shadow-teal-500/20">
                          <Mic className="h-4 w-4 text-white" />
                        </div>
                        <h1 className="text-xl font-bold text-slate-900 tracking-tight">Start New Note</h1>
                      </div>
                      <p className="text-sm text-slate-600 ml-[40px] font-medium">Create professional AI-powered documentation</p>
                    </div>

                    {/* Compact Template Selector */}
                    <div className="max-w-3xl w-full mb-4 max-w-[1400px] mr-auto">
                      {/* Compact Header Section */}
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900 rounded-xl flex items-center justify-center shadow-lg shadow-slate-900/20">
                          <FileText className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <h2 className="text-lg font-bold text-slate-900 tracking-tight">Template</h2>
                          <p className="text-sm text-slate-600 font-medium">Choose your documentation format</p>
                        </div>
                      </div>

                      {/* Corporate Template Selector */}
                      <div className="relative">
                        {/* Subtle Background Glow */}
                        <div className="absolute inset-0 bg-gradient-to-r from-slate-100/50 via-transparent to-slate-100/50 rounded-3xl blur-2xl opacity-60" />

                        <Select value={currentTemplate} onValueChange={(value) => {
                          onTemplateChange(value);
                        }}>
                          <SelectTrigger className="w-full h-16 text-base bg-white/95 backdrop-blur-2xl border-3 border-slate-300/80 hover:border-slate-400 focus:border-slate-500 focus:ring-4 focus:ring-slate-500/10 transition-all duration-500 shadow-[0_8px_32px_rgb(0,0,0,0.08)] hover:shadow-[0_16px_48px_rgb(0,0,0,0.12)] rounded-3xl font-bold text-slate-900 tracking-wide relative overflow-hidden group">
                            {/* Animated Background */}
                            <div className="absolute inset-0 bg-gradient-to-r from-slate-50/0 via-slate-50/50 to-slate-50/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                            <div className="flex items-center gap-4 relative z-10">
                              {/* Dynamic Icon Based on Selected Template */}
                              <div className="w-10 h-10 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center shadow-lg border border-slate-300/50">
                                <span className="text-slate-700 text-lg">
                                  {currentTemplate === 'SOAP' && '📋'}
                                  {currentTemplate === 'SBAR' && '📞'}
                                  {currentTemplate === 'PIE' && '🎯'}
                                  {currentTemplate === 'DAR' && '📊'}
                                  {currentTemplate === 'shift-assessment' && '🏥'}
                                  {currentTemplate === 'mar' && '💊'}
                                  {currentTemplate === 'io' && '⚖️'}
                                  {currentTemplate === 'wound-care' && '🩹'}
                                  {currentTemplate === 'safety-checklist' && '✅'}
                                  {currentTemplate === 'med-surg' && '🩺'}
                                  {currentTemplate === 'icu' && '🏥'}
                                  {currentTemplate === 'nicu' && '👶'}
                                  {currentTemplate === 'mother-baby' && '👩‍👶'}
                                </span>
                              </div>
                              <div className="text-left">
                                <div className="font-bold text-slate-900 text-lg">
                                  {templates.find(t => t.value === currentTemplate)?.label.split('(')[0].trim()}
                                </div>
                                <div className="text-sm text-slate-600 font-medium">
                                  {templates.find(t => t.value === currentTemplate)?.category} Template
                                </div>
                              </div>
                            </div>

                            {/* Professional Chevron */}
                            <ChevronDown className="h-5 w-5 text-slate-500 absolute right-4 transition-transform duration-300 group-data-[state=open]:rotate-180" />
                          </SelectTrigger>

                          <SelectContent className="bg-white border-2 border-slate-200 shadow-[0_20px_60px_rgb(0,0,0,0.15)] rounded-2xl p-3 max-h-96 overflow-y-auto">
                            {/* Header */}
                            <div className="px-2 py-2 border-b border-slate-200 mb-3">
                              <h3 className="font-bold text-slate-900 text-base">Select Template</h3>
                              <p className="text-xs text-slate-600">Choose the best format for your documentation</p>
                            </div>

                            {templates.map((template, index) => {
                              const isSelected = currentTemplate === template.value;
                              const categoryColor = template.category === 'Traditional' ? 'from-blue-500 to-blue-600' :
                                                   template.category === 'Epic EMR' ? 'from-purple-500 to-purple-600' :
                                                   'from-emerald-500 to-emerald-600';

                              return (
                                <SelectItem
                                  key={template.value}
                                  value={template.value}
                                  className={`cursor-pointer py-3 px-4 rounded-xl my-1 transition-all duration-200 group border ${
                                    isSelected
                                      ? 'border-slate-300 bg-slate-50 shadow-md'
                                      : 'border-slate-200 bg-white hover:border-teal-200 hover:bg-teal-50/30 hover:shadow-lg'
                                  }`}
                                  style={{ animationDelay: `${index * 30}ms` }}
                                >
                                  <div className="flex items-center gap-3">
                                    {/* Modern Icon */}
                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200 ${
                                      isSelected
                                        ? 'bg-slate-600 shadow-md'
                                        : 'bg-slate-100 group-hover:bg-slate-200 group-hover:shadow-md'
                                    }`}>
                                      <span className={`text-lg transition-all duration-200 ${
                                        isSelected ? 'text-white' : 'text-slate-700 group-hover:text-slate-900'
                                      }`}>
                                        {template.value === 'SOAP' && '📋'}
                                        {template.value === 'SBAR' && '📞'}
                                        {template.value === 'PIE' && '🎯'}
                                        {template.value === 'DAR' && '📊'}
                                        {template.value === 'shift-assessment' && '🏥'}
                                        {template.value === 'mar' && '💊'}
                                        {template.value === 'io' && '⚖️'}
                                        {template.value === 'wound-care' && '🩹'}
                                        {template.value === 'safety-checklist' && '✅'}
                                        {template.value === 'med-surg' && '🩺'}
                                        {template.value === 'icu' && '🏥'}
                                        {template.value === 'nicu' && '👶'}
                                        {template.value === 'mother-baby' && '👩‍👶'}
                                      </span>
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center gap-2 mb-0.5">
                                        <span className={`font-semibold text-sm transition-colors duration-200 ${
                                          isSelected ? 'text-slate-900' : 'text-slate-800 group-hover:text-slate-900'
                                        }`}>
                                          {template.label.split('(')[0].trim()}
                                        </span>
                                        <div className={`px-2 py-0.5 rounded-md text-xs font-medium bg-gradient-to-r ${categoryColor} text-white shadow-sm`}>
                                          {template.category}
                                        </div>
                                      </div>
                                      {template.label.includes('(') && (
                                        <p className={`text-xs transition-colors duration-200 ${
                                          isSelected ? 'text-slate-600' : 'text-slate-500 group-hover:text-slate-600'
                                        }`}>
                                          {template.label.split('(')[1].replace(')', '')}
                                        </p>
                                      )}
                                    </div>

                                    {/* Selection Indicator */}
                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                                      isSelected
                                        ? 'bg-slate-600 border-slate-600'
                                        : 'border-slate-300 group-hover:border-slate-400'
                                    }`}>
                                      {isSelected && <CheckCircle className="h-3 w-3 text-white" />}
                                    </div>
                                  </div>
                                </SelectItem>
                              );
                            })}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Main Grid Layout - Powerful 2-Column Design */}
                    <div className="flex-1 overflow-x-hidden overflow-y-hidden">
                      <div className="relative h-full w-full max-w-[1400px] mr-auto rounded-3xl border-2 border-slate-200/60 bg-gradient-to-br from-white via-slate-50/30 to-blue-50/20 shadow-[0_8px_30px_rgb(0,0,0,0.06)] backdrop-blur-xl p-2 lg:p-3 overflow-x-hidden">
                        <div className="relative h-full grid grid-cols-1 gap-2 lg:gap-3 min-h-0 lg:grid-cols-2 w-full overflow-x-hidden">
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
                        <Card className="flex-shrink-0 flex flex-col items-center justify-center p-3 min-h-[240px] bg-white/90 border-2 border-slate-200/50 shadow-[0_4px_20px_rgb(0,0,0,0.04)] backdrop-blur-sm rounded-3xl">
                        <div className="relative flex flex-col items-center space-y-3 w-full">
                          <div className="relative py-2">
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
                              className={`w-28 h-28 rounded-full shadow-2xl transition-all duration-500 transform hover:scale-105 ${
                                isRecording
                                  ? 'bg-gradient-to-br from-red-500 via-pink-600 to-red-600'
                                  : 'bg-[#6dbda9] hover:bg-[#5ba08c]'
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
                                <div className="relative">
                                  {/* Premium Background Glow */}
                                  <div className="absolute inset-0 bg-gradient-to-r from-teal-100/30 via-blue-100/20 to-teal-100/30 rounded-3xl blur-2xl opacity-60 animate-pulse" />

                                  {/* Compact Professional Voice Dictation Card */}
                                  <div className="relative bg-white/95 backdrop-blur-2xl border-2 border-slate-200/60 rounded-2xl p-5 shadow-[0_12px_32px_rgb(0,0,0,0.06)] hover:shadow-[0_16px_40px_rgb(0,0,0,0.08)] transition-all duration-300">
                                    {/* Compact Header with Inline Icon */}
                                    <div className="flex items-center gap-4 mb-4">
                                      <div className="w-12 h-12 bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl flex items-center justify-center shadow-lg border border-slate-700/20">
                                        <Mic className="h-6 w-6 text-white" />
                                      </div>
                                      <div className="flex-1">
                                        <h2 className="text-lg font-bold text-slate-900 tracking-tight">Voice Dictation Ready</h2>
                                        <p className="text-sm text-slate-600 font-medium">AI-powered speech recognition for clinical documentation</p>
                                      </div>
                                    </div>

                                    {/* Compact Feature Grid */}
                                    <div className="grid grid-cols-3 gap-3 mb-4">
                                      <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center shadow-sm">
                                          <Shield className="h-4 w-4 text-white" />
                                        </div>
                                        <div>
                                          <p className="text-xs font-bold text-slate-800">HIPAA</p>
                                          <p className="text-xs text-slate-600">Compliant</p>
                                        </div>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-sm">
                                          <Zap className="h-4 w-4 text-white" />
                                        </div>
                                        <div>
                                          <p className="text-xs font-bold text-slate-800">Real-time</p>
                                          <p className="text-xs text-slate-600">AI</p>
                                        </div>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center shadow-sm">
                                          <Target className="h-4 w-4 text-white" />
                                        </div>
                                        <div>
                                          <p className="text-xs font-bold text-slate-800">99%</p>
                                          <p className="text-xs text-slate-600">Accurate</p>
                                        </div>
                                      </div>
                                    </div>

                                    {/* Compact Instructions */}
                                    <div className="bg-gradient-to-r from-slate-50 to-slate-100/50 rounded-lg p-3 border border-slate-200/60 mb-2.5">
                                      <div className="text-center">
                                        <p className="text-sm font-bold text-slate-900 mb-2">Quick Start Guide</p>
                                        <div className="space-y-1.5">
                                          <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 bg-teal-500 rounded-full flex-shrink-0"></div>
                                            <p className="text-xs text-slate-700 text-left">Tap microphone to record</p>
                                          </div>
                                          <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 bg-teal-500 rounded-full flex-shrink-0"></div>
                                            <p className="text-xs text-slate-700 text-left">Speak naturally about patient</p>
                                          </div>
                                          <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 bg-teal-500 rounded-full flex-shrink-0"></div>
                                            <p className="text-xs text-slate-700 text-left">AI formats into professional notes</p>
                                          </div>
                                        </div>
                                      </div>
                                    </div>

                                    {/* Compact Voice Support Warning */}
                                    {!voiceSupported && (
                                      <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/60 rounded-xl p-3">
                                        <div className="flex items-center gap-2">
                                          <div className="w-6 h-6 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg flex items-center justify-center">
                                            <AlertTriangle className="h-3 w-3 text-white" />
                                          </div>
                                          <div className="flex-1">
                                            <p className="text-xs font-bold text-amber-900">Voice Input Unavailable</p>
                                            <p className="text-xs text-amber-800">Check browser permissions</p>
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                        </Card>
                  </>
                )}

                        {/* Input Method Options Card - Always Available */}
                        {!isRecording && !isProcessing && (
                          <Card className="flex-shrink-0 p-2 bg-white/90 border-2 border-slate-200/50 shadow-[0_4px_20px_rgb(0,0,0,0.04)] backdrop-blur-sm rounded-3xl">
                            <h3 className="text-sm font-semibold text-foreground mb-2 text-center">
                              {transcript ? 'Or try a different input method:' : 'Or choose another input method:'}
                            </h3>
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
                          <Card className="flex-shrink-0 p-2 bg-gradient-to-br from-amber-50/80 to-orange-50/80 border-2 border-amber-200/60 shadow-[0_4px_20px_rgb(251,191,36,0.08)] backdrop-blur-sm rounded-3xl">
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
                          <Card className="flex-shrink-0 p-2 bg-white/95 border-2 border-emerald-200/60 shadow-[0_4px_20px_rgb(16,185,129,0.12)] backdrop-blur-sm rounded-3xl">
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

      {/* Mobile/Tablet Layout - World-Class Design */}
      <div className="lg:hidden mvp-screen w-full bg-gradient-to-br from-slate-50 via-white to-slate-50/50">
        {/* Mobile Header - Premium Professional Walkthrough */}
        <div className="flex-shrink-0 px-6 pt-8 pb-4 safe-area-top w-full">
          <div className="text-left space-y-6">
            {/* Premium Hero Section with Professional Walkthrough */}
            <div className="space-y-5">
              {/* Enhanced Typography - Left aligned with Refined Old Money Serif Fonts */}
              <div className="space-y-4 pt-4">
                <h1 className="text-3xl font-heading font-semibold bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 bg-clip-text text-transparent tracking-tight leading-tight">
                  Start New Note
                </h1>
                <p className="text-base text-slate-600 font-sans font-medium leading-relaxed">
                  Professional AI-powered documentation
                </p>
              </div>

              {/* Collapsible Professional Instructional Walkthrough */}
              <div className="bg-gradient-to-r from-[#b88b74]/10 via-[#8f6a58]/5 to-[#b88b74]/10 rounded-2xl border border-[#b88b74]/20 shadow-lg backdrop-blur-sm overflow-hidden">
                <button
                  onClick={() => setShowWalkthrough(!showWalkthrough)}
                  className="w-full p-3 flex items-center justify-between hover:bg-white/20 transition-colors duration-200"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 bg-gradient-to-br from-[#b88b74] to-[#8f6a58] rounded-lg flex items-center justify-center shadow-md">
                      <BookOpen className="h-3.5 w-3.5 text-white" />
                    </div>
                    <div className="text-left">
                      <h3 className="font-bold text-slate-900 text-sm font-display">Quick Start Guide</h3>
                      <p className="text-xs text-slate-600 font-sans">3 steps to create your first note</p>
                    </div>
                  </div>
                  <div className={`w-5 h-5 text-[#b88b74] transition-transform duration-200 ${showWalkthrough ? 'rotate-180' : ''}`}>
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>

                {showWalkthrough && (
                  <div className="px-3 pb-3 space-y-2 animate-in slide-in-from-top-2 duration-300">
                    <div className="flex items-center gap-3 p-2 bg-white/60 rounded-lg border border-[#b88b74]/10">
                      <div className="w-5 h-5 bg-gradient-to-br from-[#b88b74] to-[#8f6a58] rounded-full flex items-center justify-center text-white text-xs font-bold shadow-sm">1</div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-slate-800 font-sans">Choose Template</p>
                        <p className="text-xs text-slate-600">Select from SOAP, SBAR, or specialized templates</p>
                      </div>
                      <div className="w-2 h-2 bg-[#b88b74] rounded-full animate-pulse"></div>
                    </div>

                    <div className="flex items-center gap-3 p-2 bg-white/40 rounded-lg border border-slate-200/50">
                      <div className="w-5 h-5 bg-slate-300 rounded-full flex items-center justify-center text-slate-600 text-xs font-bold">2</div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-slate-700 font-sans">Record or Type</p>
                        <p className="text-xs text-slate-500">Use voice dictation or manual input</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-2 bg-white/40 rounded-lg border border-slate-200/50">
                      <div className="w-5 h-5 bg-slate-300 rounded-full flex items-center justify-center text-slate-600 text-xs font-bold">3</div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-slate-700 font-sans">AI Processing</p>
                        <p className="text-xs text-slate-500">Watch as AI formats your note professionally</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Luxury Template Selector with Warm Glow */}
            <div className="w-full max-w-xs mx-auto px-2">
              <div className="space-y-3">
                {/* Premium Label with Warm Accent */}
                <div className="text-center space-y-1">
                  <Label className="text-sm font-bold text-slate-800 block tracking-wide">Choose Template</Label>
                  <div className="w-12 h-0.5 bg-gradient-to-r from-[#b88b74] to-[#8f6a58] mx-auto rounded-full" />
                </div>

                {/* Luxury Template Selector with Warm Glow */}
                <div className="relative">
                  {/* Warm Glow Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-[#b88b74]/20 via-[#8f6a58]/15 to-[#b88b74]/20 rounded-2xl blur-lg opacity-50 animate-pulse" />
                  <div className="absolute inset-0 bg-gradient-to-r from-[#b88b74]/8 via-transparent to-[#b88b74]/8 rounded-2xl" />

                  <Select value={currentTemplate} onValueChange={(value) => {
                    onTemplateChange(value);
                  }}>
                  <SelectTrigger className="w-full h-12 text-sm bg-white/95 backdrop-blur-2xl border-2 border-[#b88b74]/30 hover:border-[#b88b74]/60 focus:border-[#b88b74] focus:ring-4 focus:ring-[#b88b74]/15 transition-all duration-500 shadow-xl shadow-[#b88b74]/10 hover:shadow-2xl hover:shadow-[#b88b74]/15 rounded-2xl font-bold text-slate-800 tracking-wide [&>svg]:text-[#b88b74] [&>svg]:w-4 [&>svg]:h-4">
                    <SelectValue />
                  </SelectTrigger>
                        <SelectContent className="bg-white border-2 border-slate-200 shadow-[0_20px_60px_rgb(0,0,0,0.15)] rounded-2xl p-3 max-h-80 overflow-y-auto">
                      {templates.map((template, index) => {
                        const isSelected = currentTemplate === template.value;
                        const categoryColor = template.category === 'Traditional' ? 'from-blue-500 to-blue-600' :
                                             template.category === 'Epic EMR' ? 'from-purple-500 to-purple-600' :
                                             'from-emerald-500 to-emerald-600';

                        return (
                          <SelectItem
                            key={template.value}
                            value={template.value}
                            className={`cursor-pointer py-3 px-4 rounded-xl my-1 transition-all duration-200 group border ${
                              isSelected
                                ? 'border-slate-300 bg-slate-50 shadow-md'
                                : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50 hover:shadow-lg'
                            }`}
                            style={{ animationDelay: `${index * 30}ms` }}
                          >
                            <div className="flex items-center gap-3">
                              {/* Modern Icon */}
                              <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200 ${
                                isSelected
                                  ? 'bg-slate-600 shadow-md'
                                  : 'bg-slate-100 group-hover:bg-slate-200 group-hover:shadow-md'
                              }`}>
                                <span className={`text-lg transition-all duration-200 ${
                                  isSelected ? 'text-white' : 'text-slate-700 group-hover:text-slate-900'
                                }`}>
                                  {template.value === 'SOAP' && '📋'}
                                  {template.value === 'SBAR' && '📞'}
                                  {template.value === 'PIE' && '🎯'}
                                  {template.value === 'DAR' && '📊'}
                                  {template.value === 'shift-assessment' && '🏥'}
                                  {template.value === 'mar' && '💊'}
                                  {template.value === 'io' && '⚖️'}
                                  {template.value === 'wound-care' && '🩹'}
                                  {template.value === 'safety-checklist' && '✅'}
                                  {template.value === 'med-surg' && '🩺'}
                                  {template.value === 'icu' && '🏥'}
                                  {template.value === 'nicu' && '👶'}
                                  {template.value === 'mother-baby' && '👩‍👶'}
                                </span>
                              </div>

                              {/* Content */}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-0.5">
                                  <span className={`font-semibold text-sm transition-colors duration-200 ${
                                    isSelected ? 'text-slate-900' : 'text-slate-800 group-hover:text-slate-900'
                                  }`}>
                                    {template.label.split('(')[0].trim()}
                                  </span>
                                  <div className={`px-2 py-0.5 rounded-md text-xs font-medium bg-gradient-to-r ${categoryColor} text-white shadow-sm`}>
                                    {template.category}
                                  </div>
                                </div>
                                {template.label.includes('(') && (
                                  <p className={`text-xs transition-colors duration-200 ${
                                    isSelected ? 'text-slate-600' : 'text-slate-500 group-hover:text-slate-600'
                                  }`}>
                                    {template.label.split('(')[1].replace(')', '')}
                                  </p>
                                )}
                              </div>

                              {/* Selection Indicator */}
                              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                                isSelected
                                  ? 'bg-slate-600 border-slate-600'
                                  : 'border-slate-300 group-hover:border-slate-400'
                              }`}>
                                {isSelected && <CheckCircle className="h-3 w-3 text-white" />}
                              </div>
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Premium Main Content Area - Enhanced Layout */}
        <div className="flex-1 w-full py-8 overflow-y-auto pb-32">
          <div className="px-6 space-y-8 w-full max-w-md mx-auto">
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
              {/* Premium Recording Section */}
              <div className="relative flex flex-col items-center space-y-6">
                {/* Recording Button Container */}
                <div className="relative">
                  {/* Enhanced Pulse Rings */}
                  {isRecording && (
                    <>
                      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-red-400 to-pink-500 animate-ping opacity-75 scale-110 shadow-2xl shadow-red-500/30" />
                      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-red-300 to-pink-400 animate-ping opacity-50 scale-125 animation-delay-300 shadow-xl shadow-red-400/20" />
                      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-red-200 to-pink-300 animate-ping opacity-25 scale-140 animation-delay-700 shadow-lg shadow-red-300/10" />
                    </>
                  )}

                  {/* Premium Main Button */}
                  <Button
                    size="lg"
                    className={`w-32 h-32 rounded-full transition-all duration-700 transform hover:scale-110 active:scale-95 ${
                      isRecording
                        ? 'bg-gradient-to-br from-red-500 via-red-600 to-pink-600 hover:from-red-600 hover:via-red-700 hover:to-pink-700 shadow-[0_12px_40px_rgb(239,68,68,0.6)] hover:shadow-[0_20px_60px_rgb(239,68,68,0.8)]'
                        : 'bg-gradient-to-br from-[#6dbda9] via-[#5ba08c] to-[#4a9b7e] hover:from-[#5ba08c] hover:via-[#4a9b7e] hover:to-[#3a8b6e] shadow-[0_12px_40px_rgba(109,189,169,0.6)] hover:shadow-[0_20px_60px_rgba(109,189,169,0.8)]'
                    } ${isProcessing ? 'opacity-60 cursor-not-allowed animate-pulse' : 'cursor-pointer'} shadow-2xl`}
                    style={{
                      boxShadow: isRecording
                        ? '0 12px 40px rgba(239, 68, 68, 0.6), 0 4px 16px rgba(239, 68, 68, 0.3), inset 0 2px 0 rgba(255, 255, 255, 0.3)'
                        : '0 12px 40px rgba(109, 189, 169, 0.6), 0 4px 16px rgba(109, 189, 169, 0.3), inset 0 2px 0 rgba(255, 255, 255, 0.4)'
                    }}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      console.log('🎤 Premium mobile microphone button clicked, isRecording:', isRecording);
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
                      <MicOff className="h-16 w-16 text-white drop-shadow-[0_3px_6px_rgba(0,0,0,0.4)]" />
                    ) : (
                      <Mic className="h-16 w-16 text-white drop-shadow-[0_3px_6px_rgba(0,0,0,0.4)]" />
                    )}
                  </Button>

                  {/* Premium Status Indicator */}
                  <div className={`absolute -top-2 -right-2 w-6 h-6 rounded-full border-3 border-white shadow-xl ${
                    isRecording ? 'bg-red-500 animate-pulse shadow-red-500/50' :
                    isProcessing ? 'bg-yellow-500 animate-spin shadow-yellow-500/50' :
                    'bg-green-500 shadow-green-500/50'
                  }`} />
                </div>

                {/* Premium Status Text */}
                <div className="text-center space-y-1">
                  <div className={`text-lg font-bold tracking-wide ${
                    isRecording ? 'text-red-600' :
                    isProcessing ? 'text-yellow-600' :
                    'text-slate-700'
                  }`}>
                    {isRecording ? 'Recording Active' :
                     isProcessing ? 'AI Processing...' :
                     'Ready to Record'}
                  </div>
                  <p className="text-sm text-slate-500 font-medium">
                    {isRecording ? 'Tap to stop recording' :
                     isProcessing ? 'Analyzing your speech...' :
                     'Tap the microphone to begin'}
                  </p>
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

                {!isRecording && !isProcessing && !transcript && (
                  <div className="relative">
                    {/* Premium Background Glow */}
                    <div className="absolute inset-0 bg-gradient-to-r from-teal-100/30 via-blue-100/20 to-teal-100/30 rounded-3xl blur-2xl opacity-60 animate-pulse" />

                    {/* Powerful 2-in-1 Input Methods Card */}
                    <div className="relative bg-white/95 backdrop-blur-2xl border-2 border-slate-200/60 rounded-2xl p-5 shadow-[0_12px_32px_rgb(0,0,0,0.06)] hover:shadow-[0_16px_40px_rgb(0,0,0,0.08)] transition-all duration-300 max-w-sm mx-auto">
                      {/* Powerful Header */}
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl flex items-center justify-center shadow-lg border border-slate-700/20">
                          <Zap className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h2 className="text-lg font-bold text-slate-900 tracking-tight">AI Documentation Suite</h2>
                          <p className="text-sm text-slate-600 font-medium">Voice + Manual Input • Professional Results</p>
                        </div>
                      </div>

                      {/* Dual Input Methods Grid - Now Clickable */}
                      <div className="grid grid-cols-2 gap-3 mb-4">
                        {/* Voice Dictation - Clickable */}
                        <button
                          onClick={onStartRecording}
                          className="group bg-gradient-to-br from-teal-50/80 to-teal-100/40 rounded-xl p-3 border border-teal-200/60 hover:border-teal-300/80 hover:shadow-lg hover:shadow-teal-500/10 transition-all duration-300 cursor-pointer text-left"
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg flex items-center justify-center shadow-sm group-hover:shadow-md transition-all duration-300">
                              <Mic className="h-4 w-4 text-white" />
                            </div>
                            <h3 className="text-sm font-bold text-teal-800 group-hover:text-teal-900 transition-colors duration-300">Voice</h3>
                          </div>
                          <p className="text-xs text-teal-700 leading-tight mb-2 group-hover:text-teal-800 transition-colors duration-300">Speak naturally, AI transcribes & formats</p>
                          <div className="flex items-center gap-1">
                            <div className="w-1.5 h-1.5 bg-teal-500 rounded-full"></div>
                            <span className="text-xs font-medium text-teal-600 group-hover:text-teal-700 transition-colors duration-300">30-60s</span>
                          </div>
                        </button>

                        {/* Manual Input - Clickable */}
                        <button
                          onClick={() => setShowInputSelector(true)}
                          className="group bg-gradient-to-br from-blue-50/80 to-blue-100/40 rounded-xl p-3 border border-blue-200/60 hover:border-blue-300/80 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300 cursor-pointer text-left"
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-sm group-hover:shadow-md transition-all duration-300">
                              <Keyboard className="h-4 w-4 text-white" />
                            </div>
                            <h3 className="text-sm font-bold text-blue-800 group-hover:text-blue-900 transition-colors duration-300">Manual</h3>
                          </div>
                          <p className="text-xs text-blue-700 leading-tight mb-2 group-hover:text-blue-800 transition-colors duration-300">Type or paste, AI enhances & structures</p>
                          <div className="flex items-center gap-1">
                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                            <span className="text-xs font-medium text-blue-600 group-hover:text-blue-700 transition-colors duration-300">2-5min</span>
                          </div>
                        </button>
                      </div>

                      {/* Feature Highlights */}
                      <div className="grid grid-cols-3 gap-2 mb-4">
                        <div className="text-center">
                          <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center shadow-sm mx-auto mb-1">
                            <Shield className="h-4 w-4 text-white" />
                          </div>
                          <p className="text-xs font-bold text-slate-800">HIPAA</p>
                          <p className="text-xs text-slate-600">Secure</p>
                        </div>
                        <div className="text-center">
                          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center shadow-sm mx-auto mb-1">
                            <Target className="h-4 w-4 text-white" />
                          </div>
                          <p className="text-xs font-bold text-slate-800">99%</p>
                          <p className="text-xs text-slate-600">Accurate</p>
                        </div>
                        <div className="text-center">
                          <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg flex items-center justify-center shadow-sm mx-auto mb-1">
                            <Timer className="h-4 w-4 text-white" />
                          </div>
                          <p className="text-xs font-bold text-slate-800">5x</p>
                          <p className="text-xs text-slate-600">Faster</p>
                        </div>
                      </div>

                      {/* Quick Start Guide - Compact */}
                      <div className="bg-gradient-to-r from-slate-50 to-slate-100/50 rounded-lg p-3 border border-slate-200/60">
                        <div className="text-center">
                          <p className="text-sm font-bold text-slate-900 mb-2">How It Works</p>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-teal-500 rounded-full flex-shrink-0"></div>
                              <p className="text-xs text-slate-700 text-left">Choose voice or manual input</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-teal-500 rounded-full flex-shrink-0"></div>
                              <p className="text-xs text-slate-700 text-left">AI processes & formats professionally</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-teal-500 rounded-full flex-shrink-0"></div>
                              <p className="text-xs text-slate-700 text-left">Review, edit, and export</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Voice Support Warning - Only if needed */}
                      {!voiceSupported && (
                        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/60 rounded-lg p-2.5 mt-3">
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg flex items-center justify-center">
                              <AlertTriangle className="h-2.5 w-2.5 text-white" />
                            </div>
                            <div className="flex-1">
                              <p className="text-xs font-bold text-amber-900">Voice input unavailable</p>
                              <p className="text-xs text-amber-800">Use manual input instead</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Transcript Ready - Show Preview Button Right Here */}
                {transcript && !isRecording && !isProcessing && (
                  <div className="relative">
                    {/* Success Background Glow */}
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-100/40 via-green-100/30 to-emerald-100/40 rounded-3xl blur-2xl opacity-70 animate-pulse" />

                    {/* Transcript Success Card */}
                    <div className="relative bg-white/95 backdrop-blur-2xl border-2 border-emerald-200/60 rounded-2xl p-5 shadow-[0_12px_32px_rgb(16,185,129,0.15)] max-w-sm mx-auto">
                      {/* Success Header */}
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg border border-emerald-400/20">
                          <CheckCircle className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h2 className="text-lg font-bold text-slate-900 tracking-tight">Voice Transcription Complete!</h2>
                          <p className="text-sm text-slate-600 font-medium">Ready to create your professional note</p>
                        </div>
                      </div>

                      {/* Transcript Info */}
                      <div className="bg-gradient-to-br from-slate-50 to-emerald-50/30 border border-slate-200 rounded-lg p-3 mb-4">
                        <div className="text-center space-y-1">
                          <div className="flex items-center justify-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                            <span className="text-sm font-semibold text-slate-700">AI Processing Complete</span>
                          </div>
                          <p className="text-xs text-slate-600">
                            {transcript.length} characters captured • {selectedTemplate} template selected
                          </p>
                        </div>
                      </div>

                      {/* Preview Draft Note Button - Prominent Placement */}
                      <Button
                        size="lg"
                        className="w-full h-12 text-sm font-bold bg-gradient-to-r from-emerald-500 via-teal-600 to-emerald-600 hover:from-emerald-600 hover:via-teal-700 hover:to-emerald-700 text-white transition-all duration-300 transform hover:scale-105 shadow-lg"
                        style={{
                          boxShadow: '0 6px 20px rgba(16, 185, 129, 0.4), 0 2px 8px rgba(16, 185, 129, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
                        }}
                        onClick={() => onNavigate('draft')}
                      >
                        <FileText className="h-4 w-4 mr-2 drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]" />
                        Preview Draft Note
                      </Button>

                      {/* Alternative Actions */}
                      <div className="mt-3 text-center">
                        <p className="text-xs text-slate-500 mb-2">Or choose another input method:</p>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 text-xs h-8 hover:bg-blue-50 hover:border-blue-300 transition-colors"
                            onClick={() => setShowInputSelector(true)}
                          >
                            <Keyboard className="h-3 w-3 mr-1" />
                            Manual
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 text-xs h-8 hover:bg-teal-50 hover:border-teal-300 transition-colors"
                            onClick={onStartRecording}
                          >
                            <Mic className="h-3 w-3 mr-1" />
                            Record Again
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>



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
