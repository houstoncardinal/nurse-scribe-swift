import { useState } from 'react';
import { Shield, Info } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { DictationControl } from '@/components/DictationControl';
import { RedactionPanel } from '@/components/RedactionPanel';
import { ComposePanel } from '@/components/ComposePanel';
import { ExportPanel } from '@/components/ExportPanel';
import { type ComposeResult } from '@/lib/compose';
import { type RedactionResult } from '@/lib/redaction';
import heroImage from '@/assets/hero-nurse.jpg';

const Index = () => {
  const [transcript, setTranscript] = useState('');
  const [redactedText, setRedactedText] = useState('');
  const [redactionResult, setRedactionResult] = useState<RedactionResult | null>(null);
  const [composeResult, setComposeResult] = useState<ComposeResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleTranscriptUpdate = (newTranscript: string) => {
    setTranscript(newTranscript);
    // Reset downstream states when transcript changes
    setRedactedText('');
    setRedactionResult(null);
    setComposeResult(null);
  };

  const handleRedactionComplete = (redacted: string, result: RedactionResult) => {
    setRedactedText(redacted);
    setRedactionResult(result);
    // Reset compose result when redaction changes
    setComposeResult(null);
  };

  const handleComposeComplete = (result: ComposeResult) => {
    setComposeResult(result);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header with Hero */}
      <header className="relative border-b bg-card shadow-strong overflow-hidden">
        {/* Hero Background */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-8"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-hero" />
        
        <div className="relative container mx-auto px-4 py-8 sm:py-12">
          <div className="flex items-center justify-between">
            <div className="max-w-2xl">
              <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-3 tracking-tight">
                NurseScribe AI
              </h1>
              <p className="text-base sm:text-lg text-muted-foreground font-medium">
                Clinical documentation at the speed of speech
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Secure • Privacy-First • Browser-Based
              </p>
            </div>
            <Badge
              variant="outline"
              className="bg-primary/15 text-primary border-primary/30 flex items-center gap-2 px-4 py-2 shadow-soft"
            >
              <Shield className="h-5 w-5" />
              <span className="hidden sm:inline font-semibold">No-PHI Pilot Mode</span>
              <span className="sm:hidden font-semibold">No-PHI</span>
            </Badge>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 sm:py-8">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Info Alert */}
          <Alert className="bg-primary/8 border-primary/25 shadow-soft">
            <Info className="h-5 w-5 text-primary" />
            <AlertDescription className="text-sm leading-relaxed">
              <strong className="text-foreground">Privacy First:</strong> All processing happens in your browser. No audio or
              transcripts are stored or transmitted. PHI is redacted before any AI processing.
              {!import.meta.env.VITE_OPENAI_API_KEY && (
                <span className="block mt-2 text-xs text-muted-foreground bg-muted/50 p-2 rounded">
                  ⚠️ Running in mock mode. Add <code className="px-1.5 py-0.5 bg-background/80 rounded font-mono">VITE_OPENAI_API_KEY</code> for real AI composition.
                </span>
              )}
            </AlertDescription>
          </Alert>

          {/* Workflow Steps */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Step 1: Dictation */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gradient-primary text-primary-foreground flex items-center justify-center text-base font-bold shadow-medium">
                  1
                </div>
                <h2 className="text-xl font-semibold">Dictate</h2>
              </div>
              <DictationControl
                onTranscriptUpdate={handleTranscriptUpdate}
                isProcessing={isProcessing}
              />
            </div>

            {/* Step 2: Redact */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gradient-primary text-primary-foreground flex items-center justify-center text-base font-bold shadow-medium">
                  2
                </div>
                <h2 className="text-xl font-semibold">Protect PHI</h2>
              </div>
              <RedactionPanel
                transcript={transcript}
                onRedactionComplete={handleRedactionComplete}
                isProcessing={isProcessing}
              />
            </div>

            {/* Step 3: Compose */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gradient-secondary text-secondary-foreground flex items-center justify-center text-base font-bold shadow-medium">
                  3
                </div>
                <h2 className="text-xl font-semibold">Compose Note</h2>
              </div>
              <ComposePanel
                redactedText={redactedText}
                onComposeComplete={handleComposeComplete}
                isProcessing={isProcessing}
                setIsProcessing={setIsProcessing}
              />
            </div>

            {/* Step 4: Export */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gradient-accent text-accent-foreground flex items-center justify-center text-base font-bold shadow-medium">
                  4
                </div>
                <h2 className="text-xl font-semibold">Export</h2>
              </div>
              <ExportPanel
                composeResult={composeResult}
                redactionResult={redactionResult}
              />
            </div>
          </div>

          {/* Footer Info */}
          <div className="pt-8 mt-8 border-t border-border/50">
            <div className="text-center space-y-3">
              <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                <strong className="text-foreground">Demo Mode:</strong> This is a pilot version running entirely in your browser.
                No data is persisted or transmitted during dictation and redaction. All processing is 100% local.
              </p>
              <p className="text-xs text-muted-foreground/80">
                NurseScribe AI • Built for nurses, by technologists who care about your time and privacy
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
