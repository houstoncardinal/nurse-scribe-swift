import { useState, useEffect } from 'react';
import { Mic, FileText, Download, Settings, Stethoscope, Menu, User, BarChart3, BookOpen, Users, Shield, Brain } from 'lucide-react';
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
import { advancedTranscriptionService } from '@/lib/advancedTranscriptionService';
import { PowerfulAdminDashboard } from '@/components/PowerfulAdminDashboard';
import { InstructionsPage } from '@/components/InstructionsPage';
import { TeamManagementScreen } from '@/components/TeamManagementScreen';
import { AICopilotScreen } from '@/components/AICopilotScreen';
import { NoteHistory } from '@/components/NoteHistory';
import { AnalyticsScreen } from '@/components/AnalyticsScreen';
import { EducationScreen } from '@/components/EducationScreen';
import { knowledgeBaseService } from '@/lib/knowledgeBase';
import { enhancedAIService } from '@/lib/enhancedAIService';
import { performanceService } from '@/lib/performanceService';
import { intelligentNoteDetectionService } from '@/lib/intelligentNoteDetection';
import { toast } from 'sonner';

type Screen = 'home' | 'draft' | 'export' | 'settings' | 'profile' | 'analytics' | 'education' | 'team' | 'copilot' | 'history' | 'admin' | 'instructions';

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

    // Initialize advanced transcription service
    const initializeTranscription = async () => {
      try {
        const isSupported = advancedTranscriptionService.isSupported();
        setVoiceSupported(isSupported);

        if (isSupported) {
          // Configure for medical transcription
          advancedTranscriptionService.setConfig({
            language: 'en-US',
            continuous: true,
            interimResults: true,
            maxAlternatives: 3,
            medicalContext: true,
            autoCorrect: true,
            punctuate: true
          });

          // Set up callbacks
          advancedTranscriptionService.setCallbacks({
            onResult: (result) => {
              if (result.isFinal) {
                // Final transcription with all enhancements applied
                setFinalTranscript(result.text);
                setTranscript(result.text);
                setInterimTranscript('');
                setIsProcessing(false);
                
                // Analyze the enhanced transcript
                const analysis = enhancedAIService.analyzeInput(result.text);
                const medicalTermsCount = analysis.medicalTerms.length;
                
                toast.success('🎯 Advanced Transcription Complete!', {
                  description: `Confidence: ${Math.round(result.confidence * 100)}% | Medical terms: ${medicalTermsCount} | ${result.words.length} words`
                });
              } else {
                // Interim results with real-time corrections
                setInterimTranscript(result.text);
                setTranscript(finalTranscript + ' ' + result.text);
              }
            },
            onError: (error) => {
              console.error('Transcription error:', error);
              setIsRecording(false);
              setIsProcessing(false);
              toast.error(error);
            },
            onStart: () => {
              console.log('🎤 Advanced transcription started');
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
              
              toast.success('🎤 Listening with Medical AI...', {
                description: '6-layer accuracy enhancement active'
              });
            },
            onEnd: async () => {
              console.log('🎤 Advanced transcription ended');
              setIsRecording(false);
              
              // Clear recording timer
              if (recordingInterval) {
                clearInterval(recordingInterval);
                setRecordingInterval(null);
              }
              
              // Get the current transcript value (use state or check both sources)
              const currentTranscript = finalTranscript || transcript;
              console.log('📝 Current transcript on end:', currentTranscript);
              console.log('📝 finalTranscript:', finalTranscript);
              console.log('📝 transcript:', transcript);
              
              // Auto-generate note if we have a transcript
              if (currentTranscript && currentTranscript.trim()) {
                console.log('🤖 Auto-generating note from transcript:', currentTranscript);
                console.log('🤖 Selected template:', selectedTemplate);
                setIsProcessing(true);
                
                try {
                  // Generate AI note automatically using the current transcript
                  const aiPrompt = {
                    template: selectedTemplate as any,
                    input: currentTranscript,
                    context: {
                      chiefComplaint: currentTranscript.substring(0, 100)
                    }
                  };

                  console.log('🤖 Calling AI service with prompt:', aiPrompt);
                  const generatedNote = await enhancedAIService.generateNote(aiPrompt);
                  console.log('🤖 AI service returned:', generatedNote);
                  
                  // Store AI-generated note content
                  const noteContent: NoteContent = {};
                  
                  // Check if we have sections
                  if (generatedNote && generatedNote.sections && Object.keys(generatedNote.sections).length > 0) {
                    Object.entries(generatedNote.sections).forEach(([section, data]) => {
                      const sectionKey = section.charAt(0).toUpperCase() + section.slice(1).toLowerCase();
                      noteContent[sectionKey] = data.content;
                      console.log(`🤖 Section ${sectionKey}:`, data.content.substring(0, 100));
                    });
                  } else {
                    // Fallback: Create basic note structure using currentTranscript
                    console.warn('⚠️ No sections in generated note, using fallback');
                    if (selectedTemplate === 'SOAP') {
                      noteContent.Subjective = `Patient reports: ${currentTranscript}`;
                      noteContent.Objective = 'Vital signs stable, patient alert and oriented.';
                      noteContent.Assessment = 'Patient condition stable, no acute distress noted.';
                      noteContent.Plan = 'Continue current care plan, monitor for changes, patient education provided.';
                    } else if (selectedTemplate === 'SBAR') {
                      noteContent.Situation = `Patient presents with: ${currentTranscript}`;
                      noteContent.Background = 'Patient history reviewed, current medications noted.';
                      noteContent.Assessment = 'Patient stable, vital signs within normal limits.';
                      noteContent.Recommendation = 'Continue monitoring, maintain current treatment plan.';
                    } else if (selectedTemplate === 'PIE') {
                      noteContent.Problem = `Identified issue: ${currentTranscript}`;
                      noteContent.Intervention = 'Appropriate nursing interventions implemented.';
                      noteContent.Evaluation = 'Patient responded well to interventions, condition stable.';
                    } else if (selectedTemplate === 'DAR') {
                      noteContent.Data = `Assessment data: ${currentTranscript}`;
                      noteContent.Action = 'Nursing actions taken as per protocol.';
                      noteContent.Response = 'Patient response positive, no adverse effects noted.';
                    }
                  }
                  
                  console.log('✅ Final note content to store:', noteContent);
                  console.log('✅ Number of sections:', Object.keys(noteContent).length);
                  
                  if (Object.keys(noteContent).length === 0) {
                    throw new Error('No content generated - empty note');
                  }
                  
                  setNoteContent(noteContent);
                  setEditedNoteContent(noteContent);
                  
                  toast.success('🎯 Note Generated!', {
                    description: `${selectedTemplate} note with ${Object.keys(noteContent).length} sections`
                  });
                  
                  // Auto-navigate to draft
                  setTimeout(() => {
                    console.log('🤖 Navigating to draft with content:', noteContent);
                    handleNavigate('draft');
                  }, 500);
                  
                } catch (error: any) {
                  console.error('❌ AI generation failed:', error);
                  console.error('❌ Error details:', error.message, error.stack);
                  
                  // Create fallback content even on error using currentTranscript
                  const fallbackContent: NoteContent = {};
                  if (selectedTemplate === 'SOAP') {
                    fallbackContent.Subjective = `Patient reports: ${currentTranscript}`;
                    fallbackContent.Objective = 'Vital signs stable, patient alert and oriented.';
                    fallbackContent.Assessment = 'Patient condition stable, no acute distress noted.';
                    fallbackContent.Plan = 'Continue current care plan, monitor for changes, patient education provided.';
                  } else if (selectedTemplate === 'SBAR') {
                    fallbackContent.Situation = `Patient presents with: ${currentTranscript}`;
                    fallbackContent.Background = 'Patient history reviewed, current medications noted.';
                    fallbackContent.Assessment = 'Patient stable, vital signs within normal limits.';
                    fallbackContent.Recommendation = 'Continue monitoring, maintain current treatment plan.';
                  } else if (selectedTemplate === 'PIE') {
                    fallbackContent.Problem = `Identified issue: ${currentTranscript}`;
                    fallbackContent.Intervention = 'Appropriate nursing interventions implemented.';
                    fallbackContent.Evaluation = 'Patient responded well to interventions, condition stable.';
                  } else if (selectedTemplate === 'DAR') {
                    fallbackContent.Data = `Assessment data: ${currentTranscript}`;
                    fallbackContent.Action = 'Nursing actions taken as per protocol.';
                    fallbackContent.Response = 'Patient response positive, no adverse effects noted.';
                  }
                  
                  setNoteContent(fallbackContent);
                  setEditedNoteContent(fallbackContent);
                  
                  toast.warning('Note generated in basic mode', {
                    description: 'AI enhancement unavailable - please review and edit'
                  });
                  
                  // Still navigate to draft
                  setTimeout(() => {
                    handleNavigate('draft');
                  }, 500);
                } finally {
                  setIsProcessing(false);
                }
              }
            }
          });
          
          console.log('✅ Advanced Transcription Service initialized successfully');
          console.log('🔬 Features enabled: Medical terminology, Auto-correct, Smart punctuation');
        } else {
          toast.error('Voice recognition not supported in this browser');
        }
      } catch (error) {
        console.error('Failed to initialize advanced transcription:', error);
        toast.error('Failed to initialize voice recognition');
      }
    };

    initializeTranscription();

    return () => {
      // Cleanup recording interval
      if (recordingInterval) {
        clearInterval(recordingInterval);
      }
      
      // Stop any ongoing transcription
      if (advancedTranscriptionService.getIsListening()) {
        advancedTranscriptionService.stopListening();
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
    if (screen === 'copilot') {
      setCurrentScreen('copilot' as Screen);
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
      toast.success('Account created!', { description: `Welcome to NovaCare, ${name}` });
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
      
      // Now start advanced transcription
      await advancedTranscriptionService.startListening();
      console.log('✅ Advanced transcription started successfully');
      
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
    
    // Only stop if actually recording or listening
    if (!isRecording && !advancedTranscriptionService.getIsListening()) {
      console.log('🎤 Not currently recording, ignoring stop request');
      return;
    }
    
    console.log('🎤 Force stopping transcription...');
    
    // Force stop the recording
    setIsRecording(false);
    setIsProcessing(false);
    
    // Stop the transcription service
    if (advancedTranscriptionService.getIsListening()) {
      advancedTranscriptionService.stopListening();
    }
    
    // Clear any timers
    if (recordingInterval) {
      clearInterval(recordingInterval);
      setRecordingInterval(null);
    }
    
    console.log('✅ Voice recording stopped successfully');
  };

  // Helper function to check if text is already formatted
  const isPreFormattedNote = (text: string, template: string): boolean => {
    const lowerText = text.toLowerCase();
    
    if (template === 'SOAP') {
      return (lowerText.includes('s:') || lowerText.includes('subjective:')) &&
             (lowerText.includes('o:') || lowerText.includes('objective:')) &&
             (lowerText.includes('a:') || lowerText.includes('assessment:')) &&
             (lowerText.includes('p:') || lowerText.includes('plan:'));
    } else if (template === 'SBAR') {
      return lowerText.includes('situation:') && lowerText.includes('background:') &&
             lowerText.includes('assessment:') && lowerText.includes('recommendation:');
    } else if (template === 'PIE') {
      return lowerText.includes('problem:') && lowerText.includes('intervention:') &&
             lowerText.includes('evaluation:');
    } else if (template === 'DAR') {
      return lowerText.includes('data:') && lowerText.includes('action:') &&
             lowerText.includes('response:');
    }
    
    return false;
  };

  // Helper function to parse pre-formatted note
  const parsePreFormattedNote = (text: string, template: string): NoteContent => {
    const noteContent: NoteContent = {};
    
    if (template === 'SOAP') {
      // Parse SOAP sections
      const sMatch = text.match(/(?:S:|Subjective:)\s*([\s\S]*?)(?=\n\s*(?:O:|Objective:)|$)/i);
      const oMatch = text.match(/(?:O:|Objective:)\s*([\s\S]*?)(?=\n\s*(?:A:|Assessment:)|$)/i);
      const aMatch = text.match(/(?:A:|Assessment:)\s*([\s\S]*?)(?=\n\s*(?:P:|Plan:)|$)/i);
      const pMatch = text.match(/(?:P:|Plan:)\s*([\s\S]*?)$/i);
      
      if (sMatch) noteContent.Subjective = sMatch[1].trim();
      if (oMatch) noteContent.Objective = oMatch[1].trim();
      if (aMatch) noteContent.Assessment = aMatch[1].trim();
      if (pMatch) noteContent.Plan = pMatch[1].trim();
    } else if (template === 'SBAR') {
      const sitMatch = text.match(/Situation:\s*([\s\S]*?)(?=\nBackground:|$)/i);
      const bgMatch = text.match(/Background:\s*([\s\S]*?)(?=\nAssessment:|$)/i);
      const assMatch = text.match(/Assessment:\s*([\s\S]*?)(?=\nRecommendation:|$)/i);
      const recMatch = text.match(/Recommendation:\s*([\s\S]*?)$/i);
      
      if (sitMatch) noteContent.Situation = sitMatch[1].trim();
      if (bgMatch) noteContent.Background = bgMatch[1].trim();
      if (assMatch) noteContent.Assessment = assMatch[1].trim();
      if (recMatch) noteContent.Recommendation = recMatch[1].trim();
    } else if (template === 'PIE') {
      const probMatch = text.match(/Problem:\s*([\s\S]*?)(?=\nIntervention:|$)/i);
      const intMatch = text.match(/Intervention:\s*([\s\S]*?)(?=\nEvaluation:|$)/i);
      const evalMatch = text.match(/Evaluation:\s*([\s\S]*?)$/i);
      
      if (probMatch) noteContent.Problem = probMatch[1].trim();
      if (intMatch) noteContent.Intervention = intMatch[1].trim();
      if (evalMatch) noteContent.Evaluation = evalMatch[1].trim();
    } else if (template === 'DAR') {
      const dataMatch = text.match(/Data:\s*([\s\S]*?)(?=\nAction:|$)/i);
      const actMatch = text.match(/Action:\s*([\s\S]*?)(?=\nResponse:|$)/i);
      const respMatch = text.match(/Response:\s*([\s\S]*?)$/i);
      
      if (dataMatch) noteContent.Data = dataMatch[1].trim();
      if (actMatch) noteContent.Action = actMatch[1].trim();
      if (respMatch) noteContent.Response = respMatch[1].trim();
    }
    
    return noteContent;
  };

  // Handle manual text input with AI enhancement and intelligent detection
  const handleManualTextSubmit = async (text: string) => {
    setIsProcessing(true);
    
    try {
      // Step 1: Intelligent note type detection
      const detectedType = intelligentNoteDetectionService.detectNoteType(text);
      
      // Auto-select detected template if confidence is high
      if (detectedType.confidence > 0.6) {
        setSelectedTemplate(detectedType.template);
        toast.info(`🤖 Auto-detected ${detectedType.template} format`, {
          description: detectedType.reasoning
        });
      }
      
      // Step 2: Check if text is already formatted
      const isPreFormatted = isPreFormattedNote(text, detectedType.template);
      
      if (isPreFormatted) {
        // Parse pre-formatted note directly
        console.log('Pre-formatted note detected, parsing directly');
        const parsedContent = parsePreFormattedNote(text, detectedType.template);
        
        // Extract fields for display
        const extractedFields = intelligentNoteDetectionService.extractFields(text);
        
        // Show extracted vitals if found
        if (Object.keys(extractedFields.vitalSigns).length > 0) {
          const vitalsCount = Object.keys(extractedFields.vitalSigns).length;
          toast.success(`📊 Extracted ${vitalsCount} vital signs`, {
            description: 'Pre-formatted note parsed'
          });
        }
        
        setTranscript(text);
        setFinalTranscript(text);
        setInterimTranscript('');
        setNoteContent(parsedContent);
        setEditedNoteContent(parsedContent);
        
        console.log('Parsed pre-formatted content:', parsedContent);
        
        toast.success('✅ Pre-formatted Note Parsed!', {
          description: `${detectedType.template} sections extracted successfully`
        });
        
        handleNavigate('draft');
        return;
      }
      
      // Step 3: Extract and pre-fill fields
      const extractedFields = intelligentNoteDetectionService.extractFields(text);
      
      // Show extracted vitals if found
      if (Object.keys(extractedFields.vitalSigns).length > 0) {
        const vitalsCount = Object.keys(extractedFields.vitalSigns).length;
        toast.success(`📊 Extracted ${vitalsCount} vital signs`, {
          description: 'Pre-filled in your note'
        });
      }
      
      // Step 4: Optimize voice input using knowledge base
      const optimizedText = enhancedAIService.optimizeVoiceInput(text);
      
      // Step 5: Generate enhanced note using AI service with detected template
      const aiPrompt = {
        template: selectedTemplate as any,
        input: optimizedText,
        context: {
          chiefComplaint: extractedFields.symptoms[0] || optimizedText.substring(0, 100),
          medicalHistory: extractedFields.medications.map((m: any) => typeof m === 'string' ? m : m.name || m.medicationName || ''),
          currentMedications: extractedFields.medications.map((m: any) => typeof m === 'string' ? m : m.name || m.medicationName || '')
        }
      };

      const generatedNote = await performanceService.queueRequest(() => 
        enhancedAIService.generateNote(aiPrompt)
      );

      // Set the generated content
      setTranscript(text);
      setFinalTranscript(text);
      setInterimTranscript('');
      
      // Store AI-generated note content with proper capitalization for sections
      const noteContent: NoteContent = {};
      Object.entries(generatedNote.sections).forEach(([section, data]) => {
        // Capitalize first letter of section name to match template format
        const sectionKey = section.charAt(0).toUpperCase() + section.slice(1).toLowerCase();
        noteContent[sectionKey] = data.content;
      });
      
      console.log('Generated note content:', noteContent);
      setNoteContent(noteContent);
      setEditedNoteContent(noteContent);

      // Show comprehensive success message
      toast.success('🎯 Intelligent Note Generated!', {
        description: `${detectedType.template} format | ${extractedFields.symptoms.length} symptoms | ${Object.keys(extractedFields.vitalSigns).length} vitals detected`
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
      
      // Store AI-generated note content with proper capitalization
      const noteContent: NoteContent = {};
      Object.entries(generatedNote.sections).forEach(([section, data]) => {
        // Capitalize first letter of section name to match template format
        const sectionKey = section.charAt(0).toUpperCase() + section.slice(1).toLowerCase();
        noteContent[sectionKey] = data.content;
      });
      
      console.log('Generated note content from paste:', noteContent);
      console.log('Number of sections:', Object.keys(noteContent).length);
      
      setNoteContent(noteContent);
      setEditedNoteContent(noteContent);

      // Show success with AI insights
      toast.success('AI-Enhanced Note Generated!', {
        description: `Confidence: ${Math.round(generatedNote.overallConfidence * 100)}% | ICD-10: ${generatedNote.icd10Suggestions.suggestions.length} suggestions`
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
    
    // Stop any ongoing transcription
    if (advancedTranscriptionService.getIsListening()) {
      advancedTranscriptionService.stopListening();
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
            noteContent={noteContent}
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
        return <NoteHistory />;

      case 'analytics':
        return <AnalyticsScreen />;

      case 'education':
        return <EducationScreen />;

      case 'team':
        return <TeamManagementScreen />;

      case 'copilot':
        return <AICopilotScreen />;

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
                    <h1 className="text-lg font-bold text-slate-900">NovaCare</h1>
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
                      <Button
                        variant={currentScreen === 'copilot' ? 'default' : 'ghost'}
                        className={`w-full justify-start h-9 text-sm ${
                          currentScreen === 'copilot' 
                            ? 'bg-gradient-to-r from-teal-500 to-blue-600 text-white shadow-lg' 
                            : 'hover:bg-slate-100 text-slate-700'
                        }`}
                        onClick={() => handleNavigate('copilot')}
                      >
                        <Brain className="h-4 w-4 mr-2" />
                        AI Copilot
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
                      {currentScreen === 'copilot' && 'AI Nurse Copilot'}
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
                      {currentScreen === 'copilot' && 'AI-powered care planning, bedside assist, and predictive insights'}
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
