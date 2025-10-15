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
      <header className="relative border-b bg-card shadow-medium overflow-hidden">
        {/* Hero Background */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-10"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-primary opacity-5" />
        
        <div className="relative container mx-auto px-4 py-6 sm:py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
                NurseScribe AI
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground">
                Clinical documentation at the speed of speech
              </p>
            </div>
            <Badge
              variant="outline"
              className="bg-primary/10 text-primary border-primary/20 flex items-center gap-2 px-3 py-1.5"
            >
              <Shield className="h-4 w-4" />
              <span className="hidden sm:inline">No-PHI Pilot Mode</span>
              <span className="sm:hidden">No-PHI</span>
            </Badge>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 sm:py-8">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Info Alert */}
          <Alert className="bg-primary/5 border-primary/20">
            <Info className="h-4 w-4 text-primary" />
            <AlertDescription className="text-sm">
              <strong>Privacy First:</strong> All processing happens in your browser. No audio or
              transcripts are stored. PHI is redacted before any AI processing.
              {!import.meta.env.VITE_OPENAI_API_KEY && (
                <span className="block mt-1 text-xs text-muted-foreground">
                  Running in mock mode. Add <code className="px-1 py-0.5 bg-muted rounded">VITE_OPENAI_API_KEY</code> for real AI composition.
                </span>
              )}
            </AlertDescription>
          </Alert>

          {/* Workflow Steps */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Step 1: Dictation */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                  1
                </div>
                <h2 className="text-lg font-semibold">Dictate</h2>
              </div>
              <DictationControl
                onTranscriptUpdate={handleTranscriptUpdate}
                isProcessing={isProcessing}
              />
            </div>

            {/* Step 2: Redact */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                  2
                </div>
                <h2 className="text-lg font-semibold">Protect PHI</h2>
              </div>
              <RedactionPanel
                transcript={transcript}
                onRedactionComplete={handleRedactionComplete}
                isProcessing={isProcessing}
              />
            </div>

            {/* Step 3: Compose */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center text-sm font-bold">
                  3
                </div>
                <h2 className="text-lg font-semibold">Compose Note</h2>
              </div>
              <ComposePanel
                redactedText={redactedText}
                onComposeComplete={handleComposeComplete}
                isProcessing={isProcessing}
                setIsProcessing={setIsProcessing}
              />
            </div>

            {/* Step 4: Export */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-accent text-accent-foreground flex items-center justify-center text-sm font-bold">
                  4
                </div>
                <h2 className="text-lg font-semibold">Export</h2>
              </div>
              <ExportPanel
                composeResult={composeResult}
                redactionResult={redactionResult}
              />
            </div>
          </div>

          {/* Footer Info */}
          <div className="pt-6 border-t">
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">
                <strong>Demo Mode:</strong> This is a pilot version running entirely in your browser.
                No data is persisted or transmitted during dictation and redaction.
              </p>
              <p className="text-xs text-muted-foreground">
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
