import { useState, useEffect } from 'react';
import { Mic, FileText, Download, Settings, Stethoscope } from 'lucide-react';
import { MobileHeader } from '@/components/MobileHeader';
import { PowerfulHeader } from '@/components/PowerfulHeader';
import { MVPHomeScreen } from '@/components/MVPHomeScreen';
import { MVPDraftScreen } from '@/components/MVPDraftScreen';
import { MVPExportScreen } from '@/components/MVPExportScreen';
import { MVPSettingsScreen } from '@/components/MVPSettingsScreen';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

type Screen = 'home' | 'draft' | 'export' | 'settings';

interface NoteContent {
  [key: string]: string;
}

export function MVPApp() {
  console.log('MVPApp rendering...');
  // Screen navigation
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  
  // Recording state
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordingInterval, setRecordingInterval] = useState<NodeJS.Timeout | null>(null);
  
  // Note data
  const [transcript, setTranscript] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('SOAP');
  const [noteContent, setNoteContent] = useState<NoteContent>({});
  const [editedNoteContent, setEditedNoteContent] = useState<NoteContent>({});

  // Initialize app
  useEffect(() => {
    // Load saved settings
    const savedSettings = localStorage.getItem('nursescribe_settings');
    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      setSelectedTemplate(settings.defaultTemplate || 'SOAP');
    }

    // Initialize analytics
    const analytics = JSON.parse(localStorage.getItem('nursescribe_analytics') || '{"totalNotes": 0, "totalTimeSaved": 0}');
    localStorage.setItem('nursescribe_analytics', JSON.stringify(analytics));

    return () => {
      // Cleanup recording interval
      if (recordingInterval) {
        clearInterval(recordingInterval);
      }
    };
  }, []);

  // Handle screen navigation
  const handleNavigate = (screen: string) => {
    if (screen === 'history') {
      // Navigate to history (future feature)
      toast.info('Note history coming soon!');
      return;
    }
    if (screen === 'profile') {
      // Navigate to profile (future feature)
      toast.info('User profile coming soon!');
      return;
    }
    if (screen === 'security') {
      // Navigate to security (future feature)
      toast.info('Security settings coming soon!');
      return;
    }
    if (screen === 'analytics') {
      // Navigate to analytics (future feature)
      toast.info('Analytics dashboard coming soon!');
      return;
    }
    
    setCurrentScreen(screen as Screen);
  };

  // Start recording
  const handleStartRecording = () => {
    setIsRecording(true);
    setRecordingTime(0);
    setTranscript('');
    
    // Start recording timer
    const interval = setInterval(() => {
      setRecordingTime(prev => prev + 1);
    }, 1000);
    setRecordingInterval(interval);

    // Simulate voice recognition (in real app, this would use Web Speech API)
    setTimeout(() => {
      setTranscript("Patient presents with chest pain, vital signs stable, pain level 6/10, no shortness of breath. Patient reports the pain started this morning and is described as sharp and stabbing. No radiation to arms or jaw. No nausea or vomiting. Patient denies any recent trauma or injury.");
    }, 3000);

    toast.success('Recording started', {
      description: 'Speak clearly into your microphone'
    });
  };

  // Stop recording
  const handleStopRecording = () => {
    setIsRecording(false);
    
    // Clear recording timer
    if (recordingInterval) {
      clearInterval(recordingInterval);
      setRecordingInterval(null);
    }

    // Start processing
    setIsProcessing(true);
    
    // Simulate processing time
    setTimeout(() => {
      setIsProcessing(false);
      toast.success('Recording processed!', {
        description: 'Ready to review your note'
      });
    }, 2000);
  };

  // Handle manual text input
  const handleManualTextSubmit = async (text: string) => {
    setIsProcessing(true);
    setTranscript(text);
    
    // Simulate processing time
    setTimeout(() => {
      setIsProcessing(false);
      toast.success('Text processed!', {
        description: 'Ready to review your note'
      });
    }, 2000);
  };

  // Handle paste text input
  const handlePasteTextSubmit = async (text: string) => {
    setIsProcessing(true);
    setTranscript(text);
    
    // Simulate processing time
    setTimeout(() => {
      setIsProcessing(false);
      toast.success('Text imported!', {
        description: 'Ready to review your note'
      });
    }, 1500);
  };

  // Handle new note creation
  const handleNewNote = () => {
    setTranscript('');
    setIsRecording(false);
    setIsProcessing(false);
    setRecordingTime(0);
    setCurrentScreen('home');
    toast.info('Starting new note');
  };

  // Handle note editing
  const handleEditNote = (section: string, content: string) => {
    setEditedNoteContent(prev => ({
      ...prev,
      [section]: content
    }));
  };

  // Regenerate note
  const handleRegenerateNote = () => {
    setIsProcessing(true);
    
    // Simulate regeneration
    setTimeout(() => {
      setIsProcessing(false);
      toast.success('Note regenerated!', {
        description: 'AI has updated your note content'
      });
    }, 1500);
  };

  // Handle export completion
  const handleExportComplete = () => {
    // Update analytics
    const analytics = JSON.parse(localStorage.getItem('nursescribe_analytics') || '{"totalNotes": 0, "totalTimeSaved": 0}');
    analytics.totalNotes += 1;
    analytics.totalTimeSaved += 15; // Estimate 15 minutes saved
    localStorage.setItem('nursescribe_analytics', JSON.stringify(analytics));

    // Reset for new note
    setTimeout(() => {
      setCurrentScreen('home');
      setTranscript('');
      setNoteContent({});
      setEditedNoteContent({});
      setRecordingTime(0);
    }, 2000);
  };

  // Render current screen
  const renderCurrentScreen = () => {
    switch (currentScreen) {
      case 'home':
        return (
          <MVPHomeScreen
            onNavigate={handleNavigate}
            onStartRecording={handleStartRecording}
            onStopRecording={handleStopRecording}
            onManualTextSubmit={handleManualTextSubmit}
            onPasteTextSubmit={handlePasteTextSubmit}
            isRecording={isRecording}
            isProcessing={isProcessing}
            recordingTime={recordingTime}
            transcript={transcript}
          />
        );
      
      case 'draft':
        return (
          <MVPDraftScreen
            onNavigate={handleNavigate}
            transcript={transcript}
            selectedTemplate={selectedTemplate}
            onEditNote={handleEditNote}
            onRegenerateNote={handleRegenerateNote}
            isProcessing={isProcessing}
          />
        );
      
      case 'export':
        return (
          <MVPExportScreen
            onNavigate={handleNavigate}
            noteContent={editedNoteContent}
            selectedTemplate={selectedTemplate}
            onExportComplete={handleExportComplete}
          />
        );
      
      case 'settings':
        return (
          <MVPSettingsScreen
            onNavigate={handleNavigate}
          />
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      {/* Desktop Layout */}
      <div className="hidden lg:block">
        <div className="flex h-screen">
          {/* Desktop Sidebar */}
          <aside className="w-64 bg-white/90 backdrop-blur-sm border-r border-slate-200 shadow-lg">
            <div className="p-6">
              {/* Logo */}
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-teal-500/25">
                  <Stethoscope className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-slate-900">NurseScribe AI</h1>
                  <p className="text-xs text-slate-600">Professional Documentation</p>
                </div>
              </div>

              {/* Navigation */}
              <nav className="space-y-2">
                <Button
                  variant={currentScreen === 'home' ? 'default' : 'ghost'}
                  className={`w-full justify-start h-12 ${
                    currentScreen === 'home' 
                      ? 'bg-gradient-to-r from-teal-500 to-blue-600 text-white shadow-lg' 
                      : 'hover:bg-slate-100'
                  }`}
                  onClick={() => handleNavigate('home')}
                >
                  <Mic className="h-4 w-4 mr-3" />
                  New Note
                </Button>
                <Button
                  variant={currentScreen === 'draft' ? 'default' : 'ghost'}
                  className={`w-full justify-start h-12 ${
                    currentScreen === 'draft' 
                      ? 'bg-gradient-to-r from-teal-500 to-blue-600 text-white shadow-lg' 
                      : 'hover:bg-slate-100'
                  }`}
                  onClick={() => handleNavigate('draft')}
                >
                  <FileText className="h-4 w-4 mr-3" />
                  Draft Preview
                </Button>
                <Button
                  variant={currentScreen === 'export' ? 'default' : 'ghost'}
                  className={`w-full justify-start h-12 ${
                    currentScreen === 'export' 
                      ? 'bg-gradient-to-r from-teal-500 to-blue-600 text-white shadow-lg' 
                      : 'hover:bg-slate-100'
                  }`}
                  onClick={() => handleNavigate('export')}
                >
                  <Download className="h-4 w-4 mr-3" />
                  Export
                </Button>
                <Button
                  variant={currentScreen === 'settings' ? 'default' : 'ghost'}
                  className={`w-full justify-start h-12 ${
                    currentScreen === 'settings' 
                      ? 'bg-gradient-to-r from-teal-500 to-blue-600 text-white shadow-lg' 
                      : 'hover:bg-slate-100'
                  }`}
                  onClick={() => handleNavigate('settings')}
                >
                  <Settings className="h-4 w-4 mr-3" />
                  Settings
                </Button>
              </nav>
            </div>
          </aside>

          {/* Desktop Main Content */}
          <div className="flex-1 flex flex-col">
            {/* Desktop Header */}
            <header className="bg-white/90 backdrop-blur-sm border-b border-slate-200 shadow-sm">
              <div className="px-8 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">
                      {currentScreen === 'home' && 'Start New Note'}
                      {currentScreen === 'draft' && 'Draft Preview'}
                      {currentScreen === 'export' && 'Export Note'}
                      {currentScreen === 'settings' && 'Settings'}
                    </h2>
                    <p className="text-sm text-slate-600">
                      {currentScreen === 'home' && 'Create professional nursing documentation'}
                      {currentScreen === 'draft' && 'Review and edit your note'}
                      {currentScreen === 'export' && 'Save and share your note'}
                      {currentScreen === 'settings' && 'Configure your preferences'}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    {/* Status Indicators */}
                    {isRecording && (
                      <Badge className="bg-red-50 text-red-600 border-red-200">
                        <div className="w-2 h-2 bg-red-500 rounded-full mr-1.5 animate-pulse" />
                        Recording
                      </Badge>
                    )}
                    {isProcessing && (
                      <Badge className="bg-yellow-50 text-yellow-600 border-yellow-200">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full mr-1.5 animate-pulse" />
                        Processing
                      </Badge>
                    )}
                    <Button
                      onClick={handleNewNote}
                      className="bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 text-white"
                    >
                      <Mic className="h-4 w-4 mr-2" />
                      New Note
                    </Button>
                  </div>
                </div>
              </div>
            </header>

            {/* Desktop Content */}
            <main className="flex-1 overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
              <div className="h-full max-w-6xl mx-auto p-8">
                {renderCurrentScreen()}
              </div>
            </main>
          </div>
        </div>
      </div>

      {/* Mobile/Tablet Layout */}
      <div className="lg:hidden">
        <div className="h-screen flex flex-col bg-background">
          {/* Mobile Navigation - Only show on mobile */}
          <div className="md:hidden">
            <MobileHeader
              currentScreen={currentScreen}
              onNavigate={handleNavigate}
              onNewNote={handleNewNote}
              isRecording={isRecording}
              isProcessing={isProcessing}
              userProfile={{
                name: 'Dr. Sarah Johnson',
                role: 'RN, BSN'
              }}
            />
          </div>

          {/* Tablet Header */}
          <div className="hidden md:block">
            <PowerfulHeader
              onNewNote={handleNewNote}
              isRecording={isRecording}
              isProcessing={isProcessing}
              userProfile={{
                name: 'Dr. Sarah Johnson',
                role: 'RN, BSN',
                efficiency: 94
              }}
            />
          </div>

          {/* Mobile/Tablet Content */}
          <main className="flex-1 overflow-hidden">
            {renderCurrentScreen()}
          </main>

          {/* Bottom Safe Area for Mobile */}
          <div className="h-safe-area-inset-bottom bg-background" />
        </div>
      </div>
    </div>
  );
}
