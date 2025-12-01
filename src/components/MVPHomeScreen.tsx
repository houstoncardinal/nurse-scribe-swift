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
      {/* Main Content Area - Full Width Layout */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        {/* Desktop: Full Width, No Max Width Constraint */}
        <div className="hidden lg:block w-full h-full px-8 py-6">
          <div className="h-full flex flex-col">
            {/* Welcome Section - Desktop */}
            <div className="text-center py-8">
              <div className="space-y-4">
                <h1 className="text-5xl font-bold bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 bg-clip-text text-transparent">
                  Welcome to Raha
                </h1>
                <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                  Create professional nursing documentation with AI assistance. Start recording or type your notes below.
                </p>
              </div>
            </div>

            {/* Desktop Layout - Full Height Grid */}
            <div className="flex-1 grid grid-cols-2 gap-8 h-full">
              {/* Left Column - Template & Recording */}
              <div className="space-y-6">
                {/* Template Selector */}
                <Card className="p-8 border-2 border-primary/20 bg-gradient-to-br from-card/95 via-card/90 to-background/50 backdrop-blur-xl shadow-2xl shadow-primary/5 hover:shadow-primary/10 transition-all duration-300">
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-lg shadow-primary/20">
                        <FileText className="w-7 h-7 text-white" />
                      </div>
                      <div>
                        <Label className="text-xl font-bold text-foreground block">Select Note Type</Label>
                        <p className="text-sm text-muted-foreground">Choose your documentation format</p>
                      </div>
                    </div>
                    <Select value={currentTemplate} onValueChange={onTemplateChange}>
                      <SelectTrigger className="w-full h-16 bg-background/80 border-2 border-border hover:border-primary/50 text-lg font-medium shadow-sm transition-all">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="max-h-[300px]">
                        {templates.map((template) => (
                          <SelectItem
                            key={template.value}
                            value={template.value}
                            className="text-lg py-3"
                          >
                            <div className="flex items-center justify-between w-full">
                              <span>{template.label}</span>
                              <span className="text-sm text-muted-foreground ml-4">{template.category}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </Card>

                {/* Voice Recording */}
                <Card className="flex-1 p-8 border-2 border-border/50 bg-gradient-to-br from-card via-background/30 to-card backdrop-blur-xl shadow-2xl hover:shadow-3xl transition-all duration-300 flex flex-col justify-center">
                  <div className="flex flex-col items-center space-y-8">
                    {/* Main Recording Button */}
                    <div className="relative">
                      <div className={`absolute inset-0 rounded-full ${isRecording ? 'animate-ping bg-destructive/30' : 'bg-primary/20'} blur-xl scale-150`}></div>
                      <Button
                        size="lg"
                        onClick={isRecording ? onStopRecording : onStartRecording}
                        disabled={isProcessing || !voiceSupported}
                        className={`relative w-40 h-40 rounded-full transition-all shadow-2xl ring-4 ring-offset-4 ring-offset-background ${
                          isRecording
                            ? 'bg-gradient-to-br from-destructive to-destructive/80 hover:from-destructive/90 hover:to-destructive/70 ring-destructive/30 shadow-destructive/40 animate-pulse'
                            : 'bg-gradient-to-br from-primary via-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 ring-primary/30 shadow-primary/40 hover:scale-105'
                        }`}
                      >
                        {isRecording ? <MicOff className="w-16 h-16" /> : <Mic className="w-16 h-16" />}
                      </Button>
                    </div>

                    {/* Status Text */}
                    <div className="text-center space-y-3">
                      <p className="text-2xl font-bold text-foreground">
                        {isProcessing
                          ? '🤖 AI Processing Your Note...'
                          : isRecording
                          ? '🎤 Recording Your Note...'
                          : '🎯 Tap to Start Recording'}
                      </p>
                      <p className="text-lg text-muted-foreground max-w-md">
                        {isProcessing
                          ? 'Generating professional documentation with medical AI'
                          : isRecording
                          ? 'Speak naturally - AI is listening and transcribing in real-time'
                          : 'Voice-to-text with medical terminology recognition'}
                      </p>
                      {isRecording && !isProcessing && (
                        <div className="flex items-center justify-center gap-4 text-lg text-foreground/80 bg-muted/50 rounded-full px-8 py-3 shadow-inner">
                          <Clock className="w-6 h-6 text-primary" />
                          <span className="font-mono font-bold text-2xl">
                            {Math.floor(recordingTime / 60)}:{(recordingTime % 60).toString().padStart(2, '0')}
                          </span>
                        </div>
                      )}
                      {isProcessing && (
                        <div className="flex items-center justify-center gap-4 text-lg text-foreground/80 bg-primary/10 rounded-full px-8 py-3 shadow-inner animate-pulse">
                          <div className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                          <div className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                          <div className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                      )}
                    </div>

                    {/* Live Transcript Preview */}
                    {visibleInterimTranscript && isRecording && (
                      <div className="w-full animate-fade-in">
                        <div className="bg-gradient-to-br from-primary/5 to-accent/5 border-2 border-primary/20 rounded-2xl px-8 py-4 shadow-lg">
                          <p className="text-sm text-muted-foreground uppercase tracking-wide font-semibold mb-2">Live Transcription</p>
                          <p className="text-lg text-foreground/90 leading-relaxed">
                            {visibleInterimTranscript}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Alternative Input Button */}
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={() => setShowInputSelector(true)}
                      className="w-full h-16 text-lg font-semibold border-2 hover:bg-primary/5 hover:border-primary/50 transition-all shadow-md"
                    >
                      <Keyboard className="w-6 h-6 mr-4" />
                      Type or Paste Text Instead
                    </Button>
                  </div>
                </Card>
              </div>

              {/* Right Column - Features & Stats */}
              <div className="space-y-6">
                {/* Features & Benefits */}
                <Card className="p-8 border-2 border-border/50 bg-gradient-to-br from-card via-background/30 to-card backdrop-blur-xl shadow-2xl hover:shadow-3xl transition-all duration-300">
                  <div className="space-y-6">
                    <h3 className="text-2xl font-bold text-center text-foreground">Why Choose Raha?</h3>
                    <div className="grid grid-cols-1 gap-6">
                      <div className="flex items-center gap-6 p-6 bg-gradient-to-br from-success/5 to-success/10 rounded-2xl border border-success/20">
                        <div className="w-16 h-16 rounded-2xl bg-success/10 flex items-center justify-center flex-shrink-0">
                          <Shield className="w-8 h-8 text-success" />
                        </div>
                        <div>
                          <p className="text-xl font-bold text-foreground">HIPAA Secure</p>
                          <p className="text-muted-foreground">Fully compliant with healthcare privacy standards</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-6 p-6 bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl border border-primary/20">
                        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Zap className="w-8 h-8 text-primary" />
                        </div>
                        <div>
                          <p className="text-xl font-bold text-foreground">AI-Powered</p>
                          <p className="text-muted-foreground">Advanced medical terminology recognition</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-6 p-6 bg-gradient-to-br from-accent/5 to-accent/10 rounded-2xl border border-accent/20">
                        <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center flex-shrink-0">
                          <Timer className="w-8 h-8 text-accent" />
                        </div>
                        <div>
                          <p className="text-xl font-bold text-foreground">15 min Saved</p>
                          <p className="text-muted-foreground">Per note compared to manual charting</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Quick Stats */}
                <Card className="p-8 border-2 border-border/50 bg-card/50 backdrop-blur-xl shadow-2xl hover:shadow-3xl transition-all duration-300">
                  <div className="space-y-6">
                    <h3 className="text-2xl font-bold text-center text-foreground">Your Performance</h3>
                    <div className="grid grid-cols-1 gap-6">
                      <div className="flex items-center gap-6 p-6 bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl border border-primary/20">
                        <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <FileText className="w-7 h-7 text-primary" />
                        </div>
                        <div>
                          <p className="text-lg font-bold text-foreground">Notes This Week</p>
                          <p className="text-3xl font-bold text-primary mt-1">24</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-6 p-6 bg-gradient-to-br from-success/5 to-success/10 rounded-2xl border border-success/20">
                        <div className="w-14 h-14 rounded-2xl bg-success/10 flex items-center justify-center flex-shrink-0">
                          <TrendingUp className="w-7 h-7 text-success" />
                        </div>
                        <div>
                          <p className="text-lg font-bold text-foreground">Accuracy Rate</p>
                          <p className="text-3xl font-bold text-success mt-1">98%</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-6 p-6 bg-gradient-to-br from-accent/5 to-accent/10 rounded-2xl border border-accent/20">
                        <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center flex-shrink-0">
                          <CheckCircle className="w-7 h-7 text-accent" />
                        </div>
                        <div>
                          <p className="text-lg font-bold text-foreground">Epic Compatible</p>
                          <p className="text-3xl font-bold text-accent mt-1">100%</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile: Compact Vertical Layout - No Scrolling */}
        <div className="lg:hidden w-full h-full overflow-hidden">
          <div className="h-full flex flex-col">
            {/* Compact Welcome - Mobile */}
            <div className="text-center py-3 px-4">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 bg-clip-text text-transparent">
                Welcome to Raha
              </h1>
              <p className="text-sm text-slate-600 mt-1">
                Create professional nursing documentation with AI assistance
              </p>
            </div>

            {/* Mobile Layout - Compact Grid */}
            <div className="flex-1 grid grid-rows-2 gap-3 px-4 pb-4 min-h-0">
              {/* Top Row - Template & Recording */}
              <div className="grid grid-cols-2 gap-3 min-h-0">
                {/* Template Selector - Compact */}
                <Card className="p-3 border-2 border-primary/20 bg-gradient-to-br from-card/95 via-card/90 to-background/50 backdrop-blur-xl shadow-xl">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-lg">
                        <FileText className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <Label className="text-sm font-bold text-foreground block leading-tight">Note Type</Label>
                        <Badge variant="outline" className="text-xs px-2 py-0.5 bg-primary/5 border-primary/30 mt-0.5">
                          {templates.find(t => t.value === currentTemplate)?.category?.split(' ')[0] || 'SOAP'}
                        </Badge>
                      </div>
                    </div>
                    <Select value={currentTemplate} onValueChange={onTemplateChange}>
                      <SelectTrigger className="w-full h-10 bg-background/80 border border-border hover:border-primary/50 text-sm font-medium">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="max-h-[200px]">
                        {templates.map((template) => (
                          <SelectItem key={template.value} value={template.value} className="text-sm py-2">
                            <span>{template.label}</span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </Card>

                {/* Recording Button - Compact */}
                <Card className="p-3 border-2 border-border/50 bg-gradient-to-br from-card via-background/30 to-card backdrop-blur-xl shadow-xl flex flex-col justify-center">
                  <div className="flex flex-col items-center space-y-2">
                    <div className="relative">
                      <div className={`absolute inset-0 rounded-full ${isRecording ? 'animate-ping bg-destructive/30' : 'bg-primary/20'} blur-md scale-110`}></div>
                      <Button
                        size="sm"
                        onClick={isRecording ? onStopRecording : onStartRecording}
                        disabled={isProcessing || !voiceSupported}
                        className={`relative w-16 h-16 rounded-full transition-all shadow-lg ring-2 ring-offset-2 ring-offset-background ${
                          isRecording
                            ? 'bg-gradient-to-br from-destructive to-destructive/80 ring-destructive/30 shadow-destructive/40 animate-pulse'
                            : 'bg-gradient-to-br from-primary via-primary to-primary/80 ring-primary/30 shadow-primary/40'
                        }`}
                      >
                        {isRecording ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                      </Button>
                    </div>
                    <p className="text-xs font-bold text-center text-foreground leading-tight">
                      {isProcessing ? 'AI Processing...' : isRecording ? 'Recording...' : 'Tap to Record'}
                    </p>
                    {isRecording && !isProcessing && (
                      <div className="flex items-center gap-1 text-xs text-foreground/80 bg-muted/50 rounded-full px-2 py-1">
                        <Clock className="w-3 h-3 text-primary" />
                        <span className="font-mono font-bold">
                          {Math.floor(recordingTime / 60)}:{(recordingTime % 60).toString().padStart(2, '0')}
                        </span>
                      </div>
                    )}
                  </div>
                </Card>
              </div>

              {/* Bottom Row - Features & Actions */}
              <div className="grid grid-cols-2 gap-3 min-h-0">
                {/* Features - Compact */}
                <Card className="p-3 border border-border/50 bg-gradient-to-br from-card/50 to-card backdrop-blur-sm">
                  <div className="space-y-2">
                    <h4 className="text-sm font-bold text-center text-foreground">Features</h4>
                    <div className="grid grid-cols-1 gap-2">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-lg bg-success/10 flex items-center justify-center flex-shrink-0">
                          <Shield className="w-3 h-3 text-success" />
                        </div>
                        <span className="text-xs font-medium text-foreground">HIPAA Secure</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Zap className="w-3 h-3 text-primary" />
                        </div>
                        <span className="text-xs font-medium text-foreground">AI-Powered</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                          <Timer className="w-3 h-3 text-accent" />
                        </div>
                        <span className="text-xs font-medium text-foreground">15min Saved</span>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Actions - Compact */}
                <Card className="p-3 border border-border/50 bg-gradient-to-br from-card/50 to-card backdrop-blur-sm flex flex-col justify-between">
                  <div className="space-y-2">
                    <h4 className="text-sm font-bold text-center text-foreground">Actions</h4>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowInputSelector(true)}
                      className="w-full h-8 text-xs font-medium border hover:bg-primary/5 hover:border-primary/50"
                    >
                      <Keyboard className="w-3 h-3 mr-1" />
                      Type Text
                    </Button>
                    {!voiceSupported && (
                      <div className="text-xs text-warning font-medium text-center bg-warning/10 rounded px-2 py-1">
                        Voice not supported
                      </div>
                    )}
                  </div>

                  {/* Live Transcript - Very Compact */}
                  {visibleInterimTranscript && isRecording && (
                    <div className="mt-2 animate-fade-in">
                      <div className="bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/20 rounded-lg px-2 py-1">
                        <p className="text-xs text-muted-foreground uppercase tracking-wide font-semibold mb-0.5">Live</p>
                        <p className="text-xs text-foreground/90 leading-tight line-clamp-2">
                          {visibleInterimTranscript}
                        </p>
                      </div>
                    </div>
                  )}
                </Card>
              </div>
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
