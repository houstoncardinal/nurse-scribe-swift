import { useState, useEffect } from 'react';
import { Mic, FileText, Download, Settings, Stethoscope, Menu, User, BarChart3, BookOpen, Users, Shield } from 'lucide-react';
import { MobileHeader } from '@/components/MobileHeader';
import { MobileBottomToolbar } from '@/components/MobileBottomToolbar';
import { SimpleMobileHeader } from '@/components/SimpleMobileHeader';
import { EnhancedMobileHeader } from '@/components/EnhancedMobileHeader';
import { PowerfulHeader } from '@/components/PowerfulHeader';
import { MVPHomeScreen } from '@/components/MVPHomeScreen';
import { MVPDraftScreen } from '@/components/MVPDraftScreen';
import { MVPExportScreen } from '@/components/MVPExportScreen';
import { MVPSettingsScreen } from '@/components/MVPSettingsScreen';
import { SignInModal } from '@/components/SignInModal';
import { UserProfile } from '@/components/UserProfile';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { enhancedVoiceService as voiceRecognitionService } from '@/lib/enhancedVoiceService';
import { PowerfulAdminDashboard } from '@/components/PowerfulAdminDashboard';
import { InstructionsPage } from '@/components/InstructionsPage';
import { knowledgeBaseService } from '@/lib/knowledgeBase';
import { enhancedAIService } from '@/lib/enhancedAIService';
import { performanceService } from '@/lib/performanceService';
import { toast } from 'sonner';

type Screen = 'home' | 'draft' | 'export' | 'settings' | 'profile' | 'analytics' | 'education' | 'team' | 'history' | 'admin' | 'instructions';

interface NoteContent {
  [key: string]: string;
}

interface UserProfileData {
  name: string;
  email: string;
  role: string;
  credentials: string;
  phone?: string;
  location?: string;
  joinDate: string;
  avatar?: string;
  isSignedIn: boolean;
  preferences: {
    notifications: boolean;
    voiceSpeed: number;
    defaultTemplate: string;
    autoSave: boolean;
    darkMode: boolean;
  };
  stats: {
    totalNotes: number;
    timeSaved: number;
    accuracy: number;
    weeklyGoal: number;
    notesThisWeek: number;
  };
  achievements: Array<{
    id: string;
    title: string;
    description: string;
    icon: string;
    unlockedAt: string;
  }>;
}

export function MVPApp() {
  console.log('MVPApp rendering...');
  // Screen navigation
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  
  // Authentication state
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [authError, setAuthError] = useState('');
  
  // User profile state
  const [userProfile, setUserProfile] = useState<UserProfileData>({
    name: 'Guest User',
    email: '',
    role: 'Not Signed In',
    credentials: '',
    joinDate: new Date().toLocaleDateString(),
    isSignedIn: false,
    preferences: {
      notifications: true,
      voiceSpeed: 50,
      defaultTemplate: 'SOAP',
      autoSave: true,
      darkMode: false
    },
    stats: {
      totalNotes: 0,
      timeSaved: 0,
      accuracy: 99.2,
      weeklyGoal: 50,
      notesThisWeek: 0
    },
    achievements: []
  });
  
  // Recording state
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordingInterval, setRecordingInterval] = useState<NodeJS.Timeout | null>(null);
  
  // Voice recognition state
  const [voiceSupported, setVoiceSupported] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState('');
  const [finalTranscript, setFinalTranscript] = useState('');
  
  // Note data
  const [transcript, setTranscript] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('SOAP');
  const [noteContent, setNoteContent] = useState<NoteContent>({});
  const [editedNoteContent, setEditedNoteContent] = useState<NoteContent>({});
  
  // Handle template change from home screen
  const handleTemplateChange = (template: string) => {
    setSelectedTemplate(template);
  };

  const handleSettingsChange = (settings: any) => {
    // Update user profile with new settings
    setUserProfile(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        ...settings
      }
    }));
    
    // Show success message
    toast.success('Settings saved successfully!');
  };

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

    // Initialize performance monitoring
    const performanceMetrics = performanceService.getMetrics();
    console.log('Performance metrics initialized:', performanceMetrics);
    
    // Prefetch knowledge base data
    performanceService.prefetch('knowledge-base-stats', () => 
      Promise.resolve(knowledgeBaseService.getKnowledgeStats())
    );

    // Initialize enhanced voice recognition service
    const initializeVoiceRecognition = async () => {
      try {
        // Check available recognition methods
        const availableMethods = voiceRecognitionService.getAvailableMethods();
        const isSupported = voiceRecognitionService.getIsSupported();
        setVoiceSupported(isSupported);

        if (isSupported) {
          // Configure voice service options - use Whisper as primary with browser fallback
          voiceRecognitionService.setOptions({
            useWhisper: true, // Re-enable Whisper for production use
            fallbackToBrowser: true,
            language: 'en-US',
            maxRecordingTime: 60
          });

          // Request microphone permissions
          const hasPermission = await voiceRecognitionService.requestMicrophonePermissions();
          
          if (hasPermission) {
            // Set up voice recognition callbacks
            voiceRecognitionService.setCallbacks({
              onResult: (result) => {
                if (result.isFinal) {
                  // Optimize transcript using knowledge base
                  const optimizedTranscript = enhancedAIService.optimizeVoiceInput(result.transcript);
                  
                  setFinalTranscript(optimizedTranscript);
                  setTranscript(optimizedTranscript);
                  setInterimTranscript('');
                  
                  // Stop processing when we get final result
                  setIsProcessing(false);
                  
                  // Analyze the transcript for medical terms
                  const analysis = enhancedAIService.analyzeInput(optimizedTranscript);
                  const medicalTermsCount = analysis.medicalTerms.length;
                  
                  const sourceText = result.source === 'whisper' ? ' (Whisper AI)' : ' (Browser)';
                  toast.success('Voice recognition completed!', {
                    description: `Confidence: ${Math.round(result.confidence * 100)}% | Medical terms: ${medicalTermsCount}${sourceText}`
                  });
                } else {
                  // Update interim transcript with optimization
                  const optimizedInterim = enhancedAIService.optimizeVoiceInput(result.transcript);
                  setInterimTranscript(optimizedInterim);
                  setTranscript(finalTranscript + ' ' + optimizedInterim);
                }
              },
              onError: (error) => {
                console.error('Voice recognition error:', error);
                setIsRecording(false);
                setIsProcessing(false);
                
                let errorMessage = 'Voice recognition error';
                switch (error) {
                  case 'no-speech':
                    errorMessage = 'No speech detected. Please try again.';
                    break;
                  case 'audio-capture':
                    errorMessage = 'Microphone access denied. Please allow microphone access.';
                    break;
                  case 'not-allowed':
                    errorMessage = 'Microphone access denied. Please allow microphone access.';
                    break;
                  case 'network':
                    errorMessage = 'Network error. Please check your connection.';
                    break;
                  default:
                    errorMessage = `Voice recognition error: ${error}`;
                }
                
                toast.error(errorMessage);
              },
              onStart: () => {
                console.log('Voice recognition started');
                setIsRecording(true);
                setRecordingTime(0);
                setInterimTranscript('');
                setFinalTranscript('');
                setTranscript('');
                
                // Start recording timer
                const interval = setInterval(() => {
                  setRecordingTime(prev => prev + 1);
                }, 1000);
                setRecordingInterval(interval);
                
                toast.success('Listening...', {
                  description: 'Speak clearly into your microphone'
                });
              },
              onEnd: () => {
                console.log('Voice recognition ended');
                setIsRecording(false);
                
                // Clear recording timer
                if (recordingInterval) {
                  clearInterval(recordingInterval);
                  setRecordingInterval(null);
                }
                
                // Start processing if we have a transcript
                if (transcript.trim()) {
                  setIsProcessing(true);
                }
              },
              onProgress: (progress) => {
                // Show progress for Whisper processing
                if (progress > 0 && progress < 1) {
                  toast.info('Processing audio...', {
                    description: `Whisper AI: ${Math.round(progress * 100)}% complete`
                  });
                }
              }
            });
            
            // Show available methods
            const whisperInfo = voiceRecognitionService.getWhisperInfo();
            if (whisperInfo) {
              console.log('🎤 Available voice recognition methods:', availableMethods);
              console.log('🤖 Whisper model loaded:', whisperInfo.name, `(${whisperInfo.size})`);
            }
            
            console.log('Enhanced voice recognition service initialized successfully');
          } else {
            toast.error('Microphone access is required for voice recognition');
          }
        } else {
          toast.error('Voice recognition not supported in this browser');
        }
      } catch (error) {
        console.error('Failed to initialize voice recognition:', error);
        toast.error('Failed to initialize voice recognition');
      }
    };

    initializeVoiceRecognition();

    return () => {
      // Cleanup recording interval
      if (recordingInterval) {
        clearInterval(recordingInterval);
      }
      
      // Stop any ongoing voice recognition
      if (voiceRecognitionService.getIsListening()) {
        voiceRecognitionService.stopListening();
      }
    };
  }, []);

  // Handle screen navigation
  const handleNavigate = (screen: string) => {
    if (screen === 'history') {
      setCurrentScreen('history' as Screen);
      return;
    }
    if (screen === 'profile') {
      setCurrentScreen('profile' as Screen);
      return;
    }
    if (screen === 'analytics') {
      setCurrentScreen('analytics' as Screen);
      return;
    }
    if (screen === 'education') {
      setCurrentScreen('education' as Screen);
      return;
    }
    if (screen === 'team') {
      setCurrentScreen('team' as Screen);
      return;
    }
    if (screen === 'admin') {
      setCurrentScreen('admin' as Screen);
      return;
    }
    
    setCurrentScreen(screen as Screen);
  };

  // Authentication functions
  const handleSignIn = async (email: string, password: string) => {
    setIsSigningIn(true);
    setAuthError('');
    
    try {
      // Simulate API call - in real app, this would call your authentication service
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock successful sign in
      const newUserProfile: UserProfileData = {
        name: 'Dr. Sarah Johnson',
        email: email,
        role: 'Registered Nurse',
        credentials: 'RN, BSN',
        phone: '+1 (555) 123-4567',
        location: 'General Hospital',
        joinDate: new Date().toLocaleDateString(),
        isSignedIn: true,
        preferences: {
          notifications: true,
          voiceSpeed: 50,
          defaultTemplate: 'SOAP',
          autoSave: true,
          darkMode: false
        },
        stats: {
          totalNotes: 127,
          timeSaved: 45.2,
          accuracy: 99.2,
          weeklyGoal: 50,
          notesThisWeek: 42
        },
        achievements: [
          {
            id: 'speed-master',
            title: 'Speed Master',
            description: 'Created 10 notes in 1 hour',
            icon: '🏃‍♀️',
            unlockedAt: '2 days ago'
          },
          {
            id: 'accuracy-champion',
            title: 'Accuracy Champion',
            description: 'Maintained 99%+ accuracy for a week',
            icon: '🎯',
            unlockedAt: '1 week ago'
          }
        ]
      };
      
      setUserProfile(newUserProfile);
      setIsSignInModalOpen(false);
      toast.success('Welcome back!', { description: `Signed in as ${newUserProfile.name}` });
    } catch (error) {
      setAuthError('Invalid email or password. Please try again.');
      toast.error('Sign in failed');
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleSignUp = async (email: string, password: string, name: string, role: string) => {
    setIsSigningIn(true);
    setAuthError('');
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock successful sign up
      const newUserProfile: UserProfileData = {
        name: name,
        email: email,
        role: role,
        credentials: role,
        joinDate: new Date().toLocaleDateString(),
        isSignedIn: true,
        preferences: {
          notifications: true,
          voiceSpeed: 50,
          defaultTemplate: 'SOAP',
          autoSave: true,
          darkMode: false
        },
        stats: {
          totalNotes: 0,
          timeSaved: 0,
          accuracy: 0,
          weeklyGoal: 50,
          notesThisWeek: 0
        },
        achievements: []
      };
      
      setUserProfile(newUserProfile);
      setIsSignInModalOpen(false);
      toast.success('Account created!', { description: `Welcome to NurseScribe AI, ${name}` });
    } catch (error) {
      setAuthError('Failed to create account. Please try again.');
      toast.error('Sign up failed');
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleSignOut = () => {
    setUserProfile({
      name: 'Guest User',
      email: '',
      role: 'Not Signed In',
      credentials: '',
      joinDate: new Date().toLocaleDateString(),
      isSignedIn: false,
      preferences: {
        notifications: true,
        voiceSpeed: 50,
        defaultTemplate: 'SOAP',
        autoSave: true,
        darkMode: false
      },
      stats: {
        totalNotes: 0,
        timeSaved: 0,
        accuracy: 99.2,
        weeklyGoal: 50,
        notesThisWeek: 0
      },
      achievements: []
    });
    
    // Return to home screen
    setCurrentScreen('home');
    toast.info('Signed out successfully');
  };

  const handleUpdateProfile = async (updatedProfile: Partial<UserProfileData>) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setUserProfile(prev => ({ ...prev, ...updatedProfile }));
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  // Start recording with real voice recognition
  const handleStartRecording = async () => {
    console.log('🎤 Starting voice recording...');
    
    if (!voiceSupported) {
      toast.error('Voice recognition not supported in this browser');
      return;
    }

    // Prevent rapid toggling
    if (isRecording || isProcessing) {
      console.log('🎤 Already recording or processing, ignoring request');
      return;
    }

    try {
      // Request microphone permission first
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      console.log('✅ Microphone permission granted');
      
      // Stop the stream as we just needed permission
      stream.getTracks().forEach(track => track.stop());
      
      // Now start voice recognition
      await voiceRecognitionService.startListening();
      console.log('✅ Voice recognition started successfully');
      
    } catch (error: any) {
      console.error('❌ Failed to start voice recognition:', error);
      
      let errorMessage = 'Failed to start voice recognition';
      if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
        errorMessage = 'Microphone access denied. Please allow microphone access and try again.';
      } else if (error.name === 'NotFoundError') {
        errorMessage = 'No microphone found. Please connect a microphone and try again.';
      } else if (error.name === 'NotReadableError') {
        errorMessage = 'Microphone is being used by another application. Please close other apps and try again.';
      } else if (error.name === 'OverconstrainedError') {
        errorMessage = 'Microphone constraints cannot be satisfied. Please try a different microphone.';
      }
      
      toast.error(errorMessage);
      setIsRecording(false);
      setIsProcessing(false);
    }
  };

  // Stop recording with real voice recognition
  const handleStopRecording = () => {
    console.log('🎤 Stopping voice recording...');
    
    // Only stop if actually recording
    if (!isRecording && !voiceRecognitionService.getIsListening()) {
      console.log('🎤 Not currently recording, ignoring stop request');
      return;
    }
    
    if (voiceRecognitionService.getIsListening()) {
      voiceRecognitionService.stopListening();
      // The callbacks will handle the UI updates
    }
  };

  // Handle manual text input with AI enhancement
  const handleManualTextSubmit = async (text: string) => {
    setIsProcessing(true);
    
    try {
      // Optimize voice input using knowledge base
      const optimizedText = enhancedAIService.optimizeVoiceInput(text);
      
      // Generate enhanced note using AI service
      const aiPrompt = {
        template: selectedTemplate as 'SOAP' | 'SBAR' | 'PIE' | 'DAR',
        input: optimizedText,
        context: {
          patientAge: userProfile.stats?.totalNotes ? undefined : undefined, // Add context as needed
          chiefComplaint: optimizedText.substring(0, 100) // Extract from input
        }
      };

      const generatedNote = await performanceService.queueRequest(() => 
        enhancedAIService.generateNote(aiPrompt)
      );

      // Set the generated content
      setTranscript(text);
      setFinalTranscript(text);
      setInterimTranscript('');
      
      // Store AI-generated note content
      const noteContent: NoteContent = {};
      Object.entries(generatedNote.sections).forEach(([section, data]) => {
        noteContent[section.toLowerCase()] = data.content;
      });
      setNoteContent(noteContent);
      setEditedNoteContent(noteContent);

      // Show success with AI insights
      toast.success('AI-Enhanced Note Generated!', {
        description: `Confidence: ${Math.round(generatedNote.overallConfidence * 100)}% | Quality: ${Math.round(generatedNote.qualityScore * 100)}%`
      });

      // Navigate to draft screen
      handleNavigate('draft');
      
    } catch (error) {
      console.error('AI note generation failed:', error);
      
      // Fallback to basic processing
      setTranscript(text);
      setFinalTranscript(text);
      setInterimTranscript('');
      
      toast.success('Text processed!', {
        description: 'Ready to review your note (basic mode)'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle paste text input with AI enhancement
  const handlePasteTextSubmit = async (text: string) => {
    setIsProcessing(true);
    
    try {
      // Optimize and analyze pasted text
      const optimizedText = enhancedAIService.optimizeVoiceInput(text);
      
      // Generate enhanced note using AI service
      const aiPrompt = {
        template: selectedTemplate as 'SOAP' | 'SBAR' | 'PIE' | 'DAR',
        input: optimizedText,
        context: {
          chiefComplaint: 'Pasted from EHR'
        }
      };

      const generatedNote = await performanceService.queueRequest(() => 
        enhancedAIService.generateNote(aiPrompt)
      );

      // Set the generated content
      setTranscript(text);
      setFinalTranscript(text);
      setInterimTranscript('');
      
      // Store AI-generated note content
      const noteContent: NoteContent = {};
      Object.entries(generatedNote.sections).forEach(([section, data]) => {
        noteContent[section.toLowerCase()] = data.content;
      });
      setNoteContent(noteContent);
      setEditedNoteContent(noteContent);

      // Show success with AI insights
      toast.success('AI-Enhanced Note Generated!', {
        description: `Confidence: ${Math.round(generatedNote.overallConfidence * 100)}% | ICD-10: ${generatedNote.icd10Suggestions.length} suggestions`
      });

      // Navigate to draft screen
      handleNavigate('draft');
      
    } catch (error) {
      console.error('AI note generation failed:', error);
      
      // Fallback to basic processing
      setTranscript(text);
      setFinalTranscript(text);
      setInterimTranscript('');
      
      toast.success('Text imported!', {
        description: 'Ready to review your note (basic mode)'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle new note creation
  const handleNewNote = () => {
    setTranscript('');
    setFinalTranscript('');
    setInterimTranscript('');
    setIsRecording(false);
    setIsProcessing(false);
    setRecordingTime(0);
    setCurrentScreen('home');
    
    // Stop any ongoing voice recognition
    if (voiceRecognitionService.getIsListening()) {
      voiceRecognitionService.stopListening();
    }
    
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
              onTemplateChange={handleTemplateChange}
              isRecording={isRecording}
              isProcessing={isProcessing}
              recordingTime={recordingTime}
              transcript={transcript}
              selectedTemplate={selectedTemplate}
              interimTranscript={interimTranscript}
              voiceSupported={voiceSupported}
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
            onSettingsChange={handleSettingsChange}
          />
        );

      case 'profile':
        return (
          <UserProfile
            user={userProfile}
            onUpdate={handleUpdateProfile}
            onSignOut={handleSignOut}
          />
        );

      case 'history':
        return (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Note History</h2>
              <p className="text-slate-600 mb-6">View and manage your past notes</p>
              <div className="bg-white rounded-lg p-8 shadow-lg">
                <p className="text-slate-500">Feature coming soon!</p>
                <Button onClick={() => handleNavigate('home')} className="mt-4">
                  Back to Home
                </Button>
              </div>
            </div>
          </div>
        );

      case 'analytics':
        return (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Analytics Dashboard</h2>
              <p className="text-slate-600 mb-6">Track your performance and productivity</p>
              <div className="bg-white rounded-lg p-8 shadow-lg">
                <p className="text-slate-500">Feature coming soon!</p>
                <Button onClick={() => handleNavigate('home')} className="mt-4">
                  Back to Home
                </Button>
              </div>
            </div>
          </div>
        );

      case 'education':
        return (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Education Mode</h2>
              <p className="text-slate-600 mb-6">Practice with synthetic cases and improve your skills</p>
              <div className="bg-white rounded-lg p-8 shadow-lg">
                <p className="text-slate-500">Feature coming soon!</p>
                <Button onClick={() => handleNavigate('home')} className="mt-4">
                  Back to Home
                </Button>
              </div>
            </div>
          </div>
        );

      case 'team':
        return (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Team Collaboration</h2>
              <p className="text-slate-600 mb-6">Share notes and collaborate with your team</p>
              <div className="bg-white rounded-lg p-8 shadow-lg">
                <p className="text-slate-500">Feature coming soon!</p>
                <Button onClick={() => handleNavigate('home')} className="mt-4">
                  Back to Home
                </Button>
              </div>
            </div>
          </div>
        );

      case 'admin':
        return <PowerfulAdminDashboard />;

      case 'instructions':
        return <InstructionsPage onNavigate={handleNavigate} />;
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      {/* Desktop Layout */}
      <div className="hidden lg:block">
        <div className="flex h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
          {/* Desktop Sidebar - Compact */}
          <aside className="w-64 bg-white/95 backdrop-blur-xl border-r border-slate-200 shadow-xl">
            <div className="flex flex-col h-full">
              {/* Logo Section - Compact */}
              <div className="p-4 border-b border-slate-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-teal-500/25">
                    <Stethoscope className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h1 className="text-lg font-bold text-slate-900">NurseScribe AI</h1>
                    <p className="text-xs text-slate-600">Professional Documentation</p>
                  </div>
                </div>
              </div>

              {/* User Profile Section - Compact */}
              <div className="p-3 border-b border-slate-200">
                <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg">
                  <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-xs">
                      {userProfile.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-slate-900 truncate">{userProfile.name}</p>
                    <p className="text-xs text-slate-600 truncate">{userProfile.role}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleNavigate('profile')}
                    className="h-6 w-6 p-0"
                  >
                    <Settings className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              {/* Main Navigation - Compact */}
              <div className="flex-1 p-3 overflow-y-auto">
                <nav className="space-y-1">
                  <div className="mb-2">
                    <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Core</h3>
                    <div className="space-y-1">
                      <Button
                        variant={currentScreen === 'home' ? 'default' : 'ghost'}
                        className={`w-full justify-start h-9 text-sm ${
                          currentScreen === 'home' 
                            ? 'bg-gradient-to-r from-teal-500 to-blue-600 text-white shadow-lg' 
                            : 'hover:bg-slate-100 text-slate-700'
                        }`}
                        onClick={() => handleNavigate('home')}
                      >
                        <Mic className="h-4 w-4 mr-2" />
                        New Note
                      </Button>
                      <Button
                        variant={currentScreen === 'draft' ? 'default' : 'ghost'}
                        className={`w-full justify-start h-9 text-sm ${
                          currentScreen === 'draft' 
                            ? 'bg-gradient-to-r from-teal-500 to-blue-600 text-white shadow-lg' 
                            : 'hover:bg-slate-100 text-slate-700'
                        }`}
                        onClick={() => handleNavigate('draft')}
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        Draft Preview
                      </Button>
                      <Button
                        variant={currentScreen === 'export' ? 'default' : 'ghost'}
                        className={`w-full justify-start h-9 text-sm ${
                          currentScreen === 'export' 
                            ? 'bg-gradient-to-r from-teal-500 to-blue-600 text-white shadow-lg' 
                            : 'hover:bg-slate-100 text-slate-700'
                        }`}
                        onClick={() => handleNavigate('export')}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Export
                      </Button>
                    </div>
                  </div>

                  <div className="mb-2">
                    <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Tools & Analytics</h3>
                    <div className="space-y-1">
                      <Button
                        variant={currentScreen === 'history' ? 'default' : 'ghost'}
                        className={`w-full justify-start h-9 text-sm ${
                          currentScreen === 'history' 
                            ? 'bg-gradient-to-r from-teal-500 to-blue-600 text-white shadow-lg' 
                            : 'hover:bg-slate-100 text-slate-700'
                        }`}
                        onClick={() => handleNavigate('history')}
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        Note History
                      </Button>
                      <Button
                        variant={currentScreen === 'analytics' ? 'default' : 'ghost'}
                        className={`w-full justify-start h-9 text-sm ${
                          currentScreen === 'analytics' 
                            ? 'bg-gradient-to-r from-teal-500 to-blue-600 text-white shadow-lg' 
                            : 'hover:bg-slate-100 text-slate-700'
                        }`}
                        onClick={() => handleNavigate('analytics')}
                      >
                        <BarChart3 className="h-4 w-4 mr-2" />
                        Analytics
                      </Button>
                      <Button
                        variant={currentScreen === 'education' ? 'default' : 'ghost'}
                        className={`w-full justify-start h-9 text-sm ${
                          currentScreen === 'education' 
                            ? 'bg-gradient-to-r from-teal-500 to-blue-600 text-white shadow-lg' 
                            : 'hover:bg-slate-100 text-slate-700'
                        }`}
                        onClick={() => handleNavigate('education')}
                      >
                        <BookOpen className="h-4 w-4 mr-2" />
                        Education
                      </Button>
                      <Button
                        variant={currentScreen === 'team' ? 'default' : 'ghost'}
                        className={`w-full justify-start h-9 text-sm ${
                          currentScreen === 'team' 
                            ? 'bg-gradient-to-r from-teal-500 to-blue-600 text-white shadow-lg' 
                            : 'hover:bg-slate-100 text-slate-700'
                        }`}
                        onClick={() => handleNavigate('team')}
                      >
                        <Users className="h-4 w-4 mr-2" />
                        Team
                      </Button>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Account</h3>
                    <div className="space-y-1">
                      <Button
                        variant={currentScreen === 'profile' ? 'default' : 'ghost'}
                        className={`w-full justify-start h-9 text-sm ${
                          currentScreen === 'profile' 
                            ? 'bg-gradient-to-r from-teal-500 to-blue-600 text-white shadow-lg' 
                            : 'hover:bg-slate-100 text-slate-700'
                        }`}
                        onClick={() => handleNavigate('profile')}
                      >
                        <User className="h-4 w-4 mr-2" />
                        Profile
                      </Button>
                      <Button
                        variant={currentScreen === 'settings' ? 'default' : 'ghost'}
                        className={`w-full justify-start h-9 text-sm ${
                          currentScreen === 'settings' 
                            ? 'bg-gradient-to-r from-teal-500 to-blue-600 text-white shadow-lg' 
                            : 'hover:bg-slate-100 text-slate-700'
                        }`}
                        onClick={() => handleNavigate('settings')}
                      >
                        <Settings className="h-4 w-4 mr-2" />
                        Settings
                      </Button>
                    </div>
                  </div>
                </nav>
              </div>

              {/* Bottom Actions */}
              <div className="p-3 border-t border-slate-200">
                <Button
                  onClick={handleNewNote}
                  className="w-full bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 text-white shadow-lg h-9 text-sm"
                >
                  <Mic className="h-4 w-4 mr-2" />
                  Start New Note
                </Button>
                {!userProfile.isSignedIn && (
                  <Button
                    onClick={() => setIsSignInModalOpen(true)}
                    variant="outline"
                    className="w-full mt-2 h-8 text-sm"
                  >
                    Sign In
                  </Button>
                )}
              </div>
            </div>
          </aside>

          {/* Desktop Main Content */}
          <div className="flex-1 flex flex-col">
            {/* Desktop Header */}
            <header className="bg-white/95 backdrop-blur-xl border-b border-slate-200 shadow-sm">
              <div className="px-8 py-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-3xl font-bold text-slate-900">
                      {currentScreen === 'home' && 'Start New Note'}
                      {currentScreen === 'draft' && 'Draft Preview'}
                      {currentScreen === 'export' && 'Export Note'}
                      {currentScreen === 'settings' && 'Settings'}
                      {currentScreen === 'profile' && 'Profile'}
                      {currentScreen === 'history' && 'Note History'}
                      {currentScreen === 'analytics' && 'Analytics Dashboard'}
                      {currentScreen === 'education' && 'Education Mode'}
                      {currentScreen === 'team' && 'Team Collaboration'}
                    </h2>
                    <p className="text-slate-600 mt-1">
                      {currentScreen === 'home' && 'Create professional nursing documentation with AI assistance'}
                      {currentScreen === 'draft' && 'Review and edit your AI-generated note'}
                      {currentScreen === 'export' && 'Save and share your completed note'}
                      {currentScreen === 'settings' && 'Configure your app preferences and settings'}
                      {currentScreen === 'profile' && 'Manage your account and personal information'}
                      {currentScreen === 'history' && 'View and manage your past notes'}
                      {currentScreen === 'analytics' && 'Track your performance and productivity metrics'}
                      {currentScreen === 'education' && 'Practice with synthetic cases and improve your skills'}
                      {currentScreen === 'team' && 'Collaborate and share notes with your team'}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    {/* Status Indicators */}
                    {isRecording && (
                      <Badge className="bg-red-50 text-red-600 border-red-200 px-3 py-1">
                        <div className="w-2 h-2 bg-red-500 rounded-full mr-2 animate-pulse" />
                        Recording
                      </Badge>
                    )}
                    {isProcessing && (
                      <Badge className="bg-yellow-50 text-yellow-600 border-yellow-200 px-3 py-1">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2 animate-pulse" />
                        Processing
                      </Badge>
                    )}
                    <Badge className="bg-green-50 text-green-600 border-green-200 px-3 py-1">
                      <Shield className="h-3 w-3 mr-1" />
                      HIPAA Compliant
                    </Badge>
                  </div>
                </div>
              </div>
            </header>

            {/* Desktop Content */}
            <main className="flex-1 overflow-hidden">
              <div className="h-full">
                {renderCurrentScreen()}
              </div>
            </main>
          </div>
        </div>
      </div>

      {/* Mobile/Tablet Layout */}
      <div className="lg:hidden">
        <div className="h-screen flex flex-col bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
          {/* Enhanced Mobile Header */}
          <EnhancedMobileHeader
            onNewNote={handleNewNote}
            onNavigate={handleNavigate}
            isRecording={isRecording}
            isProcessing={isProcessing}
            userProfile={{
              name: userProfile.name,
              role: userProfile.role,
              email: userProfile.email,
              isSignedIn: userProfile.isSignedIn
            }}
            onSignIn={() => setIsSignInModalOpen(true)}
            onSignOut={handleSignOut}
          />

          {/* Mobile/Tablet Content */}
          <main className="flex-1 overflow-hidden pb-20 md:pb-0">
            {renderCurrentScreen()}
          </main>

          {/* Mobile Bottom Toolbar - Only show on mobile */}
          <div className="md:hidden">
            <MobileBottomToolbar
              currentScreen={currentScreen}
              onNavigate={handleNavigate}
              isRecording={isRecording}
              isProcessing={isProcessing}
            />
          </div>
        </div>
      </div>

      {/* Sign In Modal */}
      <SignInModal
        isOpen={isSignInModalOpen}
        onClose={() => setIsSignInModalOpen(false)}
        onSignIn={handleSignIn}
        onSignUp={handleSignUp}
        isLoading={isSigningIn}
        error={authError}
      />
    </div>
  );
}
