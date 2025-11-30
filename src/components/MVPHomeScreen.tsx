import { useState, useEffect } from 'react';
import { Mic, MicOff, Clock, Keyboard, FileText, Shield, Zap, CheckCircle, Timer, TrendingUp, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
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
  const currentTemplate = selectedTemplate;
  const [showInputSelector, setShowInputSelector] = useState(false);
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
    { value: 'SOAP', label: 'SOAP Note', category: 'Traditional' },
    { value: 'SBAR', label: 'SBAR Report', category: 'Traditional' },
    { value: 'PIE', label: 'PIE Note', category: 'Traditional' },
    { value: 'DAR', label: 'DAR Note', category: 'Traditional' },
    
    // Epic EMR Templates
    { value: 'shift-assessment', label: 'Shift Assessment', category: 'Epic EMR' },
    { value: 'mar', label: 'Medication Admin', category: 'Epic EMR' },
    { value: 'io', label: 'Intake & Output', category: 'Epic EMR' },
    { value: 'wound-care', label: 'Wound Care', category: 'Epic EMR' },
    { value: 'safety-checklist', label: 'Safety Checklist', category: 'Epic EMR' },
    
    // Unit-Specific Epic Templates
    { value: 'med-surg', label: 'Med-Surg Unit', category: 'Unit-Specific' },
    { value: 'icu', label: 'ICU Unit', category: 'Unit-Specific' },
    { value: 'nicu', label: 'NICU Unit', category: 'Unit-Specific' },
    { value: 'mother-baby', label: 'Mother-Baby Unit', category: 'Unit-Specific' },
  ];

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-background">
      {/* Main Content Area - Centered Vertical Layout */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        <div className="max-w-4xl mx-auto px-4 py-8 lg:px-6 lg:py-6">

          {/* Unified Vertical Stack Layout for All Screens */}
          <div className="space-y-6 lg:space-y-4">

            {/* 1. Template Selector - Top Priority */}
            <Card className="p-6 lg:p-5 border-2 border-primary/20 bg-gradient-to-br from-card/95 via-card/90 to-background/50 backdrop-blur-xl shadow-2xl shadow-primary/5 hover:shadow-primary/10 transition-all duration-300">
              <div className="space-y-4 lg:space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 lg:w-11 lg:h-11 rounded-2xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-lg shadow-primary/20">
                      <FileText className="w-6 h-6 lg:w-5 lg:h-5 text-white" />
                    </div>
                    <div>
                      <Label className="text-lg lg:text-lg font-bold text-foreground block">Select Note Type</Label>
                      <p className="text-xs lg:text-xs text-muted-foreground mt-0.5 hidden lg:block">Choose your documentation format</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs px-3 py-1 bg-primary/5 border-primary/30">
                    {templates.find(t => t.value === currentTemplate)?.category || 'Traditional'}
                  </Badge>
                </div>
                <Select value={currentTemplate} onValueChange={onTemplateChange}>
                  <SelectTrigger className="w-full h-14 lg:h-12 bg-background/80 border-2 border-border hover:border-primary/50 text-base lg:text-base font-medium shadow-sm transition-all">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px]">
                    {templates.map((template) => (
                      <SelectItem
                        key={template.value}
                        value={template.value}
                        className="text-base lg:text-base py-2"
                      >
                        <div className="flex items-center justify-between w-full">
                          <span>{template.label}</span>
                          <span className="text-xs text-muted-foreground ml-4">{template.category}</span>
                        </div>
                      </SelectItem>
                    ))
                    }
                  </SelectContent>
                </Select>
              </div>
            </Card>

            {/* 2. Voice Recording - Main Action */}
            <Card className="p-8 lg:p-6 border-2 border-border/50 bg-gradient-to-br from-card via-background/30 to-card backdrop-blur-xl shadow-2xl hover:shadow-3xl transition-all duration-300">
              <div className="flex flex-col items-center space-y-6 lg:space-y-4">
                {/* Main Recording Button */}
                <div className="relative">
                  <div className={`absolute inset-0 rounded-full ${isRecording ? 'animate-ping bg-destructive/30' : 'bg-primary/20'} blur-xl`}></div>
                  <Button
                    size="lg"
                    onClick={isRecording ? onStopRecording : onStartRecording}
                    disabled={isProcessing || !voiceSupported}
                    className={`relative w-32 h-32 lg:w-28 lg:h-28 rounded-full transition-all shadow-2xl ring-4 ring-offset-4 ring-offset-background ${
                      isRecording
                        ? 'bg-gradient-to-br from-destructive to-destructive/80 hover:from-destructive/90 hover:to-destructive/70 ring-destructive/30 shadow-destructive/40 animate-pulse'
                        : 'bg-gradient-to-br from-primary via-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 ring-primary/30 shadow-primary/40 hover:scale-105'
                    }`}
                  >
                    {isRecording ? <MicOff className="w-14 h-14 lg:w-12 lg:h-12" /> : <Mic className="w-14 h-14 lg:w-12 lg:h-12" />}
                  </Button>
                </div>

                {/* Status Text */}
                <div className="text-center space-y-2 lg:space-y-1.5">
                  <p className="text-xl lg:text-xl font-bold text-foreground">
                    {isProcessing
                      ? '🤖 AI Processing Your Note...'
                      : isRecording
                      ? '🎤 Recording Your Note...'
                      : '🎯 Tap to Start Recording'}
                  </p>
                  <p className="text-sm lg:text-sm text-muted-foreground max-w-md">
                    {isProcessing
                      ? 'Generating professional documentation with medical AI'
                      : isRecording
                      ? 'Speak naturally - AI is listening and transcribing in real-time'
                      : 'Voice-to-text with medical terminology recognition'}
                  </p>
                  {isRecording && !isProcessing && (
                    <div className="flex items-center justify-center gap-3 text-base lg:text-base text-foreground/80 bg-muted/50 rounded-full px-6 py-2 shadow-inner">
                      <Clock className="w-5 h-5 text-primary" />
                      <span className="font-mono font-bold text-xl">
                        {Math.floor(recordingTime / 60)}:{(recordingTime % 60).toString().padStart(2, '0')}
                      </span>
                    </div>
                  )}
                  {isProcessing && (
                    <div className="flex items-center justify-center gap-3 text-base lg:text-base text-foreground/80 bg-primary/10 rounded-full px-6 py-2 shadow-inner animate-pulse">
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  )}
                </div>

                {/* Live Transcript Preview */}
                {visibleInterimTranscript && isRecording && (
                  <div className="w-full animate-fade-in">
                    <div className="bg-gradient-to-br from-primary/5 to-accent/5 border-2 border-primary/20 rounded-2xl px-6 py-3 lg:px-6 lg:py-3 shadow-lg">
                      <p className="text-xs text-muted-foreground uppercase tracking-wide font-semibold mb-1.5">Live Transcription</p>
                      <p className="text-sm text-foreground/90 leading-relaxed">
                        {visibleInterimTranscript}
                      </p>
                    </div>
                  </div>
                )}

                {/* Voice Not Supported Warning */}
                {!voiceSupported && (
                  <Alert className="w-full border-2 border-warning/30 bg-warning/5">
                    <AlertTriangle className="h-5 w-5 text-warning" />
                    <AlertDescription className="text-base font-medium">
                      Voice recording not available in this browser. Please try Chrome, Edge, or Safari.
                    </AlertDescription>
                  </Alert>
                )}

                {/* Alternative Input Button */}
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => setShowInputSelector(true)}
                  className="w-full lg:w-auto min-w-[300px] h-14 lg:h-11 text-base lg:text-base font-semibold border-2 hover:bg-primary/5 hover:border-primary/50 transition-all shadow-md"
                >
                  <Keyboard className="w-5 h-5 mr-3 lg:w-4 lg:h-4" />
                  Type or Paste Text Instead
                </Button>
              </div>
            </Card>

            {/* 3. Features & Benefits - Trust Signals */}
            <div className="grid grid-cols-3 gap-4 lg:gap-4">
              <Card className="p-4 lg:p-4 border border-border/50 bg-gradient-to-br from-success/5 to-success/10 backdrop-blur-sm hover:shadow-lg transition-all group cursor-default">
                <div className="text-center space-y-2">
                  <div className="w-12 h-12 lg:w-12 lg:h-12 mx-auto rounded-2xl bg-success/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Shield className="w-6 h-6 text-success" />
                  </div>
                  <div>
                    <p className="text-sm lg:text-sm font-bold text-foreground">HIPAA Secure</p>
                    <p className="text-xs text-muted-foreground hidden lg:block mt-0.5">Fully compliant</p>
                  </div>
                </div>
              </Card>

              <Card className="p-4 lg:p-4 border border-border/50 bg-gradient-to-br from-primary/5 to-primary/10 backdrop-blur-sm hover:shadow-lg transition-all group cursor-default">
                <div className="text-center space-y-2">
                  <div className="w-12 h-12 lg:w-12 lg:h-12 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Zap className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm lg:text-sm font-bold text-foreground">AI-Powered</p>
                    <p className="text-xs text-muted-foreground hidden lg:block mt-0.5">Smart accuracy</p>
                  </div>
                </div>
              </Card>

              <Card className="p-4 lg:p-4 border border-border/50 bg-gradient-to-br from-accent/5 to-accent/10 backdrop-blur-sm hover:shadow-lg transition-all group cursor-default">
                <div className="text-center space-y-2">
                  <div className="w-12 h-12 lg:w-12 lg:h-12 mx-auto rounded-2xl bg-accent/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Timer className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <p className="text-sm lg:text-sm font-bold text-foreground">15 min Saved</p>
                    <p className="text-xs text-muted-foreground hidden lg:block mt-0.5">Per note</p>
                  </div>
                </div>
              </Card>
            </div>

            {/* 4. Quick Stats - Performance Metrics (Desktop Only) */}
            <div className="hidden lg:grid grid-cols-3 gap-4">
              <Card className="p-4 border border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-muted-foreground">Notes This Week</p>
                    <p className="text-xl font-bold text-foreground mt-0.5">24</p>
                  </div>
                </div>
              </Card>

              <Card className="p-4 border border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-success/10 flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="w-5 h-5 text-success" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-muted-foreground">Accuracy Rate</p>
                    <p className="text-xl font-bold text-foreground mt-0.5">98%</p>
                  </div>
                </div>
              </Card>

              <Card className="p-4 border border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-accent/10 flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-5 h-5 text-accent" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-muted-foreground">Epic Compatible</p>
                    <p className="text-xl font-bold text-foreground mt-0.5">100%</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Input Method Selector Modal */}
      {showInputSelector && (
        <InputMethodSelector
          onMethodSelect={() => setShowInputSelector(false)}
          onManualTextSubmit={onManualTextSubmit}
          onPasteTextSubmit={onPasteTextSubmit}
        />
      )}
    </div>
  );
}
