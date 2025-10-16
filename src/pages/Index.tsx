import { useState } from 'react';
import { Shield, Info, Moon, Sun, Settings, HelpCircle, Keyboard, CheckCircle2, Clock, Zap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { DictationControl } from '@/components/DictationControl';
import { RedactionPanel } from '@/components/RedactionPanel';
import { ComposePanel } from '@/components/ComposePanel';
import { ExportPanel } from '@/components/ExportPanel';
import { ApiKeyManager } from '@/components/ApiKeyManager';
import { AnalyticsDashboard } from '@/components/AnalyticsDashboard';
import { EducationMode } from '@/components/EducationMode';
import { AdminDashboard } from '@/components/AdminDashboard';
import { type ComposeResult } from '@/lib/compose';
import { type RedactionResult } from '@/lib/redaction';
import { executeCommand, type CommandHandlers } from '@/lib/voiceCommands';
import { ttsService } from '@/lib/elevenlabs';
import { analyticsService } from '@/lib/analytics';
import { educationService } from '@/lib/education';
import { adminService } from '@/lib/admin';
import heroImage from '@/assets/hero-nurse.jpg';

const Index = () => {
  const [transcript, setTranscript] = useState('');
  const [redactedText, setRedactedText] = useState('');
  const [redactionResult, setRedactionResult] = useState<RedactionResult | null>(null);
  const [composeResult, setComposeResult] = useState<ComposeResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showApiKeyManager, setShowApiKeyManager] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showEducation, setShowEducation] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [apiKeys, setApiKeys] = useState({
    openai: '',
    elevenlabs: '',
    elevenlabsVoiceId: '',
    useSupabase: false,
    hipaaMode: false,
  });

  // Workflow state tracking
  const workflowSteps = [
    { id: 'dictate', label: 'Dictate', completed: transcript.length > 0 },
    { id: 'redact', label: 'Protect PHI', completed: redactedText.length > 0 },
    { id: 'compose', label: 'Compose', completed: composeResult !== null },
    { id: 'export', label: 'Export', completed: composeResult !== null }
  ];

  const completedSteps = workflowSteps.filter(step => step.completed).length;
  const progressPercentage = (completedSteps / workflowSteps.length) * 100;

  // Voice command handlers
  const commandHandlers: Partial<CommandHandlers> = {
    new_note: () => {
      setTranscript('');
      setRedactedText('');
      setRedactionResult(null);
      setComposeResult(null);
    },
    clear_all: () => {
      setTranscript('');
      setRedactedText('');
      setRedactionResult(null);
      setComposeResult(null);
    },
    start_dictation: () => {
      // This will be handled by the DictationControl component
    },
    stop_dictation: () => {
      // This will be handled by the DictationControl component
    },
    read_back: () => {
      if (composeResult?.note) {
        ttsService.synthesize(composeResult.note).then(result => {
          if (result.success) {
            ttsService.playAudio(result);
          }
        });
      }
    },
    toggle_dark_mode: () => {
      setIsDarkMode(!isDarkMode);
    },
    open_settings: () => {
      setShowApiKeyManager(true);
    },
  };

  // Handle voice commands
  const handleVoiceCommand = (command: string) => {
    executeCommand(command, commandHandlers);
  };

  // Handle API key updates
  const handleApiKeysUpdated = (newApiKeys: typeof apiKeys) => {
    setApiKeys(newApiKeys);
    
    // Initialize TTS service with new keys
    if (newApiKeys.elevenlabs) {
      ttsService.initializeElevenLabs({
        apiKey: newApiKeys.elevenlabs,
        voiceId: newApiKeys.elevenlabsVoiceId,
      });
    }
  };

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
    <div className={`min-h-screen bg-background transition-all duration-500 ${isDarkMode ? 'dark' : ''}`}>
      {/* Premium Header with Glass Morphism */}
      <header className="sticky top-0 z-50 glass border-b border-border/50 backdrop-blur-glass">
        <div className="mobile-container py-4">
          <div className="flex items-center justify-between">
            {/* Logo and Title */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center shadow-lg">
                  <Shield className="h-6 w-6 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gradient">
                    NurseScribe AI
                  </h1>
                  <p className="text-xs text-muted-foreground hidden sm:block">
                    Clinical Documentation Platform
                  </p>
                </div>
              </div>
            </div>

            {/* Navigation and Controls */}
            <div className="flex items-center space-x-2">
              {/* Progress Indicator */}
              <div className="hidden lg:flex items-center space-x-2 mr-4">
                <div className="flex items-center space-x-1">
                  {workflowSteps.map((step, index) => (
                    <div key={step.id} className="flex items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                        step.completed 
                          ? 'bg-gradient-secondary text-secondary-foreground shadow-md' 
                          : index === completedSteps 
                            ? 'bg-gradient-accent text-accent-foreground shadow-lg animate-pulse-slow' 
                            : 'bg-muted text-muted-foreground'
                      }`}>
                        {step.completed ? <CheckCircle2 className="w-4 h-4" /> : index + 1}
                      </div>
                      {index < workflowSteps.length - 1 && (
                        <div className={`w-6 h-0.5 mx-1 transition-all ${
                          step.completed ? 'bg-gradient-secondary' : 'bg-muted'
                        }`} />
                      )}
                    </div>
                  ))}
                </div>
                <div className="ml-2 text-xs text-muted-foreground font-medium">
                  {completedSteps}/{workflowSteps.length}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsDarkMode(!isDarkMode)}
                  className="h-9 w-9 p-0 hover:bg-muted/80 transition-all"
                >
                  {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowSettings(!showSettings)}
                  className="h-9 w-9 p-0 hover:bg-muted/80 transition-all"
                >
                  <Settings className="h-4 w-4" />
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAnalytics(true)}
                  className="h-9 px-3 text-xs font-medium hover:bg-muted/80 transition-all"
                >
                  <Zap className="h-4 w-4 mr-1" />
                  <span className="hidden sm:inline">Analytics</span>
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowEducation(true)}
                  className="h-9 px-3 text-xs font-medium hover:bg-muted/80 transition-all"
                >
                  <CheckCircle2 className="h-4 w-4 mr-1" />
                  <span className="hidden sm:inline">Education</span>
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAdmin(true)}
                  className="h-9 px-3 text-xs font-medium hover:bg-muted/80 transition-all"
                >
                  <Settings className="h-4 w-4 mr-1" />
                  <span className="hidden sm:inline">Admin</span>
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  className="h-9 px-3 text-xs font-medium hover:bg-muted/80 transition-all"
                >
                  <HelpCircle className="h-4 w-4 mr-1" />
                  <span className="hidden sm:inline">Help</span>
                </Button>

                <Badge
                  variant="outline"
                  className="bg-primary/10 text-primary border-primary/20 flex items-center gap-1.5 px-3 py-1.5 shadow-sm"
                >
                  <Shield className="h-3 w-3" />
                  <span className="text-xs font-semibold hidden sm:inline">No-PHI Mode</span>
                  <span className="text-xs font-semibold sm:hidden">Secure</span>
                </Badge>
              </div>
            </div>
          </div>

          {/* Mobile Progress Bar */}
          <div className="lg:hidden mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-muted-foreground">Progress</span>
              <span className="text-sm font-bold text-foreground">{completedSteps}/{workflowSteps.length}</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
              <div 
                className="h-full bg-gradient-primary transition-all duration-500 ease-out"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-6 overflow-hidden border-b bg-gradient-to-b from-background to-muted/20">
        <div className="mobile-container">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              <span className="text-gradient">AI-Powered Clinical Documentation</span>
            </h1>
            <p className="text-sm text-muted-foreground">
              Voice to note in seconds. HIPAA-compliant. Zero PHI storage.
            </p>
          </div>
        </div>
      </section>

      {/* Main Workflow */}
      <main className="relative">
        <div className="mobile-container py-8 space-y-8">
          {/* Status Alert */}
          <Alert className="glass border-primary/20 shadow-lg animate-slide-up">
            <Info className="h-5 w-5 text-primary" />
            <AlertDescription className="text-sm leading-relaxed">
              <strong className="text-foreground">Privacy-First Architecture:</strong> All processing happens locally in your browser. 
              No audio or transcripts are stored or transmitted. PHI is automatically redacted before any AI processing.
              {!import.meta.env.VITE_OPENAI_API_KEY && (
                <div className="mt-3 p-3 bg-warning/10 border border-warning/20 rounded-lg">
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-warning rounded-full mt-2 animate-pulse" />
                    <div className="text-xs">
                      <strong className="text-warning">Mock Mode Active:</strong> Add your{' '}
                      <code className="px-1.5 py-0.5 bg-background/80 rounded font-mono text-xs">
                        VITE_OPENAI_API_KEY
                      </code>{' '}
                      environment variable for real AI composition.
                    </div>
                  </div>
                </div>
              )}
            </AlertDescription>
          </Alert>

          {/* Workflow Grid */}
          <div className="grid-premium">
            {/* Step 1: Dictation */}
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center gap-3">
                <div className={`workflow-step ${transcript.length > 0 ? 'completed' : completedSteps === 0 ? 'active' : ''}`}>
                  {transcript.length > 0 ? <CheckCircle2 className="w-5 h-5" /> : '1'}
                </div>
                <div>
                  <h2 className="text-xl font-semibold">Voice Dictation</h2>
                  <p className="text-sm text-muted-foreground">Speak naturally, get accurate transcripts</p>
                </div>
              </div>
              <DictationControl
                onTranscriptUpdate={handleTranscriptUpdate}
                isProcessing={isProcessing}
                onVoiceCommand={handleVoiceCommand}
              />
            </div>

            {/* Step 2: PHI Protection */}
            <div className="space-y-4 animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <div className="flex items-center gap-3">
                <div className={`workflow-step ${redactedText.length > 0 ? 'completed' : completedSteps === 1 ? 'active' : ''}`}>
                  {redactedText.length > 0 ? <CheckCircle2 className="w-5 h-5" /> : '2'}
                </div>
                <div>
                  <h2 className="text-xl font-semibold">PHI Protection</h2>
                  <p className="text-sm text-muted-foreground">Automatic redaction of sensitive data</p>
                </div>
              </div>
              <RedactionPanel
                transcript={transcript}
                onRedactionComplete={handleRedactionComplete}
                isProcessing={isProcessing}
              />
            </div>

            {/* Step 3: AI Composition */}
            <div className="space-y-4 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="flex items-center gap-3">
                <div className={`workflow-step ${composeResult !== null ? 'completed' : completedSteps === 2 ? 'active' : ''}`}>
                  {composeResult !== null ? <CheckCircle2 className="w-5 h-5" /> : '3'}
                </div>
                <div>
                  <h2 className="text-xl font-semibold">AI Composition</h2>
                  <p className="text-sm text-muted-foreground">Generate professional clinical notes</p>
                </div>
              </div>
              <ComposePanel
                redactedText={redactedText}
                onComposeComplete={handleComposeComplete}
                isProcessing={isProcessing}
                setIsProcessing={setIsProcessing}
              />
            </div>

            {/* Step 4: Export */}
            <div className="space-y-4 animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <div className="flex items-center gap-3">
                <div className={`workflow-step ${composeResult !== null ? 'completed' : completedSteps === 3 ? 'active' : ''}`}>
                  {composeResult !== null ? <CheckCircle2 className="w-5 h-5" /> : '4'}
                </div>
                <div>
                  <h2 className="text-xl font-semibold">Export & Share</h2>
                  <p className="text-sm text-muted-foreground">Copy, download, or integrate with EHR</p>
                </div>
              </div>
              <ExportPanel
                composeResult={composeResult}
                redactionResult={redactionResult}
              />
            </div>
          </div>
        </div>
      </main>

      {/* Premium Footer */}
      <footer className="relative mt-16 py-12 border-t border-border/50">
        <div className="absolute inset-0 bg-gradient-mesh opacity-50" />
        <div className="relative mobile-container">
          <div className="text-center space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-2">
                <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <Shield className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="text-lg font-bold text-gradient">NurseScribe AI</span>
              </div>
              <p className="text-sm text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                <strong className="text-foreground">Enterprise-Grade Security:</strong> This platform runs entirely in your browser with 
                zero data persistence. All processing is local, ensuring maximum privacy and compliance with healthcare regulations.
              </p>
            </div>
            
            <div className="pt-4 border-t border-border/30">
              <p className="text-xs text-muted-foreground/80">
                Built with ❤️ for healthcare professionals • Powered by cutting-edge AI technology
              </p>
            </div>
          </div>
        </div>
      </footer>

      {/* API Key Manager Modal */}
      <ApiKeyManager
        isOpen={showApiKeyManager}
        onClose={() => setShowApiKeyManager(false)}
        onApiKeysUpdated={handleApiKeysUpdated}
      />

      {/* Analytics Dashboard Modal */}
      <AnalyticsDashboard
        isOpen={showAnalytics}
        onClose={() => setShowAnalytics(false)}
      />

      {/* Education Mode Modal */}
      <EducationMode
        isOpen={showEducation}
        onClose={() => setShowEducation(false)}
      />

      {/* Admin Dashboard Modal */}
      <AdminDashboard
        isOpen={showAdmin}
        onClose={() => setShowAdmin(false)}
      />
    </div>
  );
};

export default Index;
