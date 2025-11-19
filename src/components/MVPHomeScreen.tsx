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
      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        <div className="max-w-7xl mx-auto px-4 py-6 lg:px-8 lg:py-8">
          
          {/* Mobile: Simplified Single Column */}
          <div className="lg:hidden space-y-6">
            {/* Template Selector */}
            <Card className="p-6 border-border/50 bg-card/80 backdrop-blur-sm">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-base font-semibold text-foreground">Note Type</Label>
                  <Badge variant="outline" className="text-xs">
                    {templates.find(t => t.value === currentTemplate)?.category || 'Traditional'}
                  </Badge>
                </div>
                <Select value={currentTemplate} onValueChange={onTemplateChange}>
                  <SelectTrigger className="w-full h-12 bg-background/50 border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {templates.map((template) => (
                      <SelectItem key={template.value} value={template.value}>
                        {template.label}
                      </SelectItem>
                    ))
                    }
                  </SelectContent>
                </Select>
              </div>
            </Card>

            {/* Voice Recording Section */}
            <Card className="p-8 border-border/50 bg-card/80 backdrop-blur-sm">
              <div className="flex flex-col items-center space-y-6">
                <Button
                  size="lg"
                  onClick={isRecording ? onStopRecording : onStartRecording}
                  disabled={isProcessing || !voiceSupported}
                  className={`w-24 h-24 rounded-full transition-all shadow-lg ${
                    isRecording 
                      ? 'bg-destructive hover:bg-destructive/90 animate-pulse shadow-destructive/20' 
                      : 'bg-primary hover:bg-primary/90 shadow-primary/20'
                  }`}
                >
                  {isRecording ? <MicOff className="w-10 h-10" /> : <Mic className="w-10 h-10" />}
                </Button>
                
                <div className="text-center space-y-2">
                  <p className="text-base font-semibold text-foreground">
                    {isRecording ? 'Recording...' : 'Start Recording'}
                  </p>
                  {isRecording && (
                    <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span className="font-mono">
                        {Math.floor(recordingTime / 60)}:{(recordingTime % 60).toString().padStart(2, '0')}
                      </span>
                    </div>
                  )}
                </div>

                {visibleInterimTranscript && isRecording && (
                  <div className="w-full animate-fade-in">
                    <p className="text-sm text-foreground/80 bg-muted/50 rounded-lg px-4 py-3 text-center">
                      {visibleInterimTranscript}
                    </p>
                  </div>
                )}

                {!voiceSupported && (
                  <Alert className="w-full">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription className="text-sm">
                      Voice recording not available
                    </AlertDescription>
                  </Alert>
                )}

                <Button
                  variant="outline"
                  onClick={() => setShowInputSelector(true)}
                  className="w-full"
                >
                  <Keyboard className="w-4 h-4 mr-2" />
                  Type or Paste Instead
                </Button>
              </div>
            </Card>

            {/* Quick Features */}
            <div className="grid grid-cols-3 gap-4">
              <Card className="p-4 border-border/50 bg-card/80 backdrop-blur-sm">
                <div className="text-center space-y-2">
                  <Zap className="w-6 h-6 mx-auto text-primary" />
                  <p className="text-xs font-medium text-muted-foreground">Fast</p>
                </div>
              </Card>
              <Card className="p-4 border-border/50 bg-card/80 backdrop-blur-sm">
                <div className="text-center space-y-2">
                  <Shield className="w-6 h-6 mx-auto text-success" />
                  <p className="text-xs font-medium text-muted-foreground">HIPAA</p>
                </div>
              </Card>
              <Card className="p-4 border-border/50 bg-card/80 backdrop-blur-sm">
                <div className="text-center space-y-2">
                  <CheckCircle className="w-6 h-6 mx-auto text-accent" />
                  <p className="text-xs font-medium text-muted-foreground">Accurate</p>
                </div>
              </Card>
            </div>
          </div>

          {/* Desktop: 3-Column Grid */}
          <div className="hidden lg:grid grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)_minmax(0,0.6fr)] gap-8 max-w-full overflow-hidden">
            
            {/* LEFT: Note Type Selector */}
            <Card className="p-8 min-w-0 max-w-full overflow-hidden border-border/50 bg-card/80 backdrop-blur-sm">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-foreground">Note Type</h3>
                  <Badge variant="outline" className="text-xs">
                    {templates.find(t => t.value === currentTemplate)?.category || 'Traditional'}
                  </Badge>
                </div>
                
                <Select value={currentTemplate} onValueChange={onTemplateChange}>
                  <SelectTrigger className="w-full h-14 bg-background/50 border-border text-base">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {templates.map((template) => (
                      <SelectItem key={template.value} value={template.value}>
                        {template.label}
                      </SelectItem>
                    ))
                    }
                  </SelectContent>
                </Select>

                <div className="pt-6 space-y-4 border-t border-border/50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                      <Shield className="w-5 h-5 text-success" />
                    </div>
                    <span className="text-sm font-medium text-foreground">HIPAA Compliant</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Zap className="w-5 h-5 text-primary" />
                    </div>
                    <span className="text-sm font-medium text-foreground">AI-Powered</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-accent" />
                    </div>
                    <span className="text-sm font-medium text-foreground">Epic Compatible</span>
                  </div>
                </div>
              </div>
            </Card>

            {/* CENTER: Voice Recording */}
            <Card className="p-10 min-w-0 max-w-full overflow-hidden border-border/50 bg-card/80 backdrop-blur-sm">
              <div className="flex flex-col items-center justify-center space-y-8 h-full">
                <Button
                  size="lg"
                  onClick={isRecording ? onStopRecording : onStartRecording}
                  disabled={isProcessing || !voiceSupported}
                  className={`w-32 h-32 rounded-full transition-all shadow-2xl ${
                    isRecording 
                      ? 'bg-destructive hover:bg-destructive/90 animate-pulse shadow-destructive/30' 
                      : 'bg-primary hover:bg-primary/90 shadow-primary/30'
                  }`}
                >
                  {isRecording ? <MicOff className="w-12 h-12" /> : <Mic className="w-12 h-12" />}
                </Button>
                
                <div className="text-center space-y-3">
                  <p className="text-lg font-semibold text-foreground">
                    {isRecording ? 'Recording...' : 'Start Recording'}
                  </p>
                  {isRecording && (
                    <div className="flex items-center justify-center gap-2 text-base text-muted-foreground">
                      <Clock className="w-5 h-5" />
                      <span className="font-mono font-medium">
                        {Math.floor(recordingTime / 60)}:{(recordingTime % 60).toString().padStart(2, '0')}
                      </span>
                    </div>
                  )}
                </div>

                {visibleInterimTranscript && isRecording && (
                  <div className="w-full max-w-md animate-fade-in">
                    <p className="text-sm text-foreground/80 bg-muted/50 rounded-xl px-5 py-4 text-center">
                      {visibleInterimTranscript}
                    </p>
                  </div>
                )}

                {!voiceSupported && (
                  <Alert className="w-full max-w-md">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      Voice recording not available in this browser
                    </AlertDescription>
                  </Alert>
                )}

                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => setShowInputSelector(true)}
                >
                  <Keyboard className="w-4 h-4 mr-2" />
                  Type or Paste Instead
                </Button>
              </div>
            </Card>

            {/* RIGHT: Quick Stats */}
            <Card className="p-8 min-w-0 max-w-full overflow-hidden border-border/50 bg-card/80 backdrop-blur-sm">
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-foreground">Quick Stats</h3>
                
                <div className="space-y-5">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Timer className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-muted-foreground">Time Saved</p>
                      <p className="text-lg font-bold text-foreground">15 min/note</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center flex-shrink-0">
                      <FileText className="w-6 h-6 text-success" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-muted-foreground">This Week</p>
                      <p className="text-lg font-bold text-foreground">24 notes</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
                      <TrendingUp className="w-6 h-6 text-accent" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-muted-foreground">Accuracy</p>
                      <p className="text-lg font-bold text-foreground">98%</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
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
