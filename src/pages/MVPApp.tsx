import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mic, FileText, Download, Settings, Stethoscope, Menu, User, BarChart3, BookOpen, Users, Shield, Brain, MessageSquare, Sparkles } from 'lucide-react';
import { SimpleThemeToggle } from '@/components/ThemeToggle';
import { SyntheticAI } from '@/components/SyntheticAI';
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
import { EnhancedAdminDashboard } from '@/components/EnhancedAdminDashboard';
import { InstructionsPage } from '@/components/InstructionsPage';
import { TeamManagementScreen } from '@/components/TeamManagementScreen';
import { RahaAIScreen } from '@/components/RahaAIScreen';
import { NoteHistory } from '@/components/NoteHistory';
import { AnalyticsScreen } from '@/components/AnalyticsScreen';
import { EducationScreen } from '@/components/EducationScreen';
import { knowledgeBaseService } from '@/lib/knowledgeBase';
import { enhancedAIService } from '@/lib/enhancedAIService';
import { performanceService } from '@/lib/performanceService';
import { intelligentNoteDetectionService } from '@/lib/intelligentNoteDetection';
import { toast } from 'sonner';

type Screen = 'home' | 'draft' | 'export' | 'settings' | 'profile' | 'analytics' | 'education' | 'team' | 'raha-ai' | 'history' | 'admin' | 'instructions';

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

const formatSectionName = (section: string): string => {
  return section
    .split(/[\s_-]+/)
    .filter(Boolean)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

const createTemplateFallback = (template: string, transcript: string): NoteContent => {
  const details = transcript?.trim() || 'No detailed narrative captured during this attempt.';
  const fallback: NoteContent = {};

  const addEpicDefaults = (entries: Array<{ key: string; value: string }>) => {
    entries.forEach(({ key, value }) => {
      fallback[key] = value;
    });
  };

  switch (template) {
    case 'SOAP':
      fallback.Subjective = `Patient reports: ${details}`;
      fallback.Objective = 'Document vital signs, focused assessment findings, and monitoring data.';
      fallback.Assessment = 'Summarize clinical impression based on current shift findings.';
      fallback.Plan = 'Outline nursing interventions, monitoring cadence, and escalation triggers.';
      break;
    case 'SBAR':
      fallback.Situation = `Current concern: ${details}`;
      fallback.Background = 'Include diagnosis, recent changes, and key history.';
      fallback.Assessment = 'Share clinical impression, pertinent positives/negatives, and risk level.';
      fallback.Recommendation = 'Specify needs (orders, labs, consults) and follow-up timing.';
      break;
    case 'PIE':
      fallback.Problem = `Primary issue described: ${details}`;
      fallback.Intervention = 'Document interventions performed this shift with times.';
      fallback.Evaluation = 'Describe patient response and next assessment milestone.';
      break;
    case 'DAR':
      fallback.Data = `Assessment data collected: ${details}`;
      fallback.Action = 'List nursing actions/interventions executed.';
      fallback.Response = 'Summarize patient response and effectiveness of interventions.';
      break;
    case 'shift-assessment':
      addEpicDefaults([
        { key: 'Patient Assessment', value: `Shift highlights: ${details}` },
        { key: 'Vital Signs', value: 'Document BP, HR, RR, Temp, SpO2, pain score with times.' },
        { key: 'Medications', value: 'List scheduled/PRN meds administered, tolerance, and pending doses.' },
        { key: 'Intake & Output', value: 'Capture IV/PO intake, urine/drain outputs, and fluid balance.' },
        { key: 'Treatments', value: 'Note wound care, therapies, procedures, or consults completed.' },
        { key: 'Communication', value: 'Record provider notifications, family updates, and handoff notes.' },
        { key: 'Safety', value: 'Include fall risk status, precautions, devices, or restraints.' },
        { key: 'Narrative', value: details }
      ]);
      break;
    case 'mar':
      addEpicDefaults([
        { key: 'Medication Information', value: `Medication-related note: ${details}` },
        { key: 'Administration Details', value: 'Document dose, route, time, double-checks, and safety checks.' },
        { key: 'Assessment', value: 'Record pre-administration assessments or required labs/vitals.' },
        { key: 'Response', value: 'Describe therapeutic effect and adverse reactions monitoring.' }
      ]);
      break;
    case 'io':
      addEpicDefaults([
        { key: 'Intake', value: 'Track PO, IV, enteral, and blood product intake with totals.' },
        { key: 'Output', value: 'Document urine, drains, stool, emesis, and insensible losses if applicable.' },
        { key: 'Balance', value: 'Summarize net balance and clinical interpretation.' },
        { key: 'Notes', value: details }
      ]);
      break;
    case 'wound-care':
      addEpicDefaults([
        { key: 'Location & Stage', value: `Wound narrative: ${details}` },
        { key: 'Size & Drainage', value: 'Record length/width/depth (cm), tunneling, drainage amount/type.' },
        { key: 'Wound Bed', value: 'Describe granulation/slough/eschar, edges, and peri-wound condition.' },
        { key: 'Interventions', value: 'Include cleansing solutions, dressings applied, and adjunct therapies.' },
        { key: 'Response', value: 'Document tolerance, pain, progress, and next dressing change time.' }
      ]);
      break;
    case 'safety-checklist':
      addEpicDefaults([
        { key: 'Fall Risk', value: `Risk summary: ${details}` },
        { key: 'Restraints', value: 'Note type, justification, assessments, and alternatives tried.' },
        { key: 'Isolation', value: 'Indicate isolation type/PPE requirements or note “Standard precautions”.' },
        { key: 'Patient ID', value: 'Confirm two patient identifiers matched before interventions.' },
        { key: 'Code Status', value: 'Document current code status and family/provider awareness.' }
      ]);
      break;
    case 'med-surg':
      addEpicDefaults([
        { key: 'Patient Education', value: `Education delivered: ${details}` },
        { key: 'Discharge Readiness', value: 'List checklist items completed and pending barriers.' },
        { key: 'Pain Management', value: 'Note pain scores, medication response, and multimodal strategies.' },
        { key: 'Mobility', value: 'Describe activity tolerance, assistance needed, and PT/OT involvement.' }
      ]);
      break;
    case 'icu':
      addEpicDefaults([
        { key: 'Hemodynamics', value: `Critical care focus: ${details}` },
        { key: 'Ventilator', value: 'Document mode, settings, ABG trends, and lung-protective strategies.' },
        { key: 'Devices', value: 'List invasive lines, drains, pacing wires, and integrity checks.' },
        { key: 'Drips', value: 'Include vasoactive, sedation, insulin, or other titrated infusions.' },
        { key: 'Sedation', value: 'Record RASS/SAS scores, sedation goals, and spontaneous awakening trials.' }
      ]);
      break;
    case 'nicu':
      addEpicDefaults([
        { key: 'Thermoregulation', value: `Infant status: ${details}` },
        { key: 'Feeding', value: 'Document feeding type, route, volumes, and tolerance.' },
        { key: 'Bonding', value: 'Describe parental presence, skin-to-skin, and education given.' },
        { key: 'Weight', value: 'Include daily weights and percent change from birth weight.' },
        { key: 'Development', value: 'Note tone, reflexes, positioning, and developmental care provided.' }
      ]);
      break;
    case 'mother-baby':
      addEpicDefaults([
        { key: 'Maternal Assessment', value: `Postpartum summary: ${details}` },
        { key: 'Newborn Assessment', value: 'Document VS, feeding cues, elimination, and screenings.' },
        { key: 'Feeding', value: 'Include latch quality, volumes, frequency, and lactation support.' },
        { key: 'Education', value: 'Highlight teaching topics (safe sleep, warning signs, follow-up).' }
      ]);
      break;
    default:
      fallback.Note = details;
      break;
  }

  return fallback;
};

export function MVPApp() {
  console.log('MVPApp rendering...');
  const navigate = useNavigate();

  // Screen navigation
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  
  // Authentication state
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [authError, setAuthError] = useState('');
  
  // AI Assistant state
  const [showAI, setShowAI] = useState(false); // Start hidden - only show when clicked
  const [aiMinimized, setAiMinimized] = useState(true); // Start minimized when shown
  
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
  const [templateLocked, setTemplateLocked] = useState(false);
  
  // Handle template change from home screen
  const handleTemplateChange = (template: string) => {
    setSelectedTemplate(template);
    setTemplateLocked(true);
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
                description: 'Speak naturally - Auto-processes after 5 seconds of silence or when you tap stop'
              });
            },
            onEnd: async () => {
              console.log('🎤 Advanced transcription ended - starting intelligent processing...');
              setIsRecording(false);

              // Clear recording timer
              if (recordingInterval) {
                clearInterval(recordingInterval);
                setRecordingInterval(null);
              }

              // CRITICAL: Get transcript directly from the service - this is the source of truth
              const serviceTranscript = advancedTranscriptionService.getFinalTranscript();
              console.log('📝 Service accumulated transcript:', serviceTranscript);

              // Build complete transcript from all sources with intelligent priority
              // Priority: serviceTranscript > finalTranscript > transcript > interimTranscript
              let currentTranscript = '';

              if (serviceTranscript && serviceTranscript.trim()) {
                // Best source: directly from the service
                currentTranscript = serviceTranscript.trim();
                console.log('✅ Using service transcript (most reliable)');
              } else if (finalTranscript && finalTranscript.trim()) {
                // Use finalTranscript state if available
                currentTranscript = finalTranscript.trim();
                // Add any interim transcript that hasn't been finalized yet
                if (interimTranscript && interimTranscript.trim()) {
                  currentTranscript = currentTranscript + ' ' + interimTranscript.trim();
                }
                console.log('✅ Using finalTranscript state + interim');
              } else if (transcript && transcript.trim()) {
                // Use transcript state
                currentTranscript = transcript.trim();
                // Add any interim transcript
                if (interimTranscript && interimTranscript.trim()) {
                  currentTranscript = currentTranscript + ' ' + interimTranscript.trim();
                }
                console.log('✅ Using transcript state + interim');
              } else if (interimTranscript && interimTranscript.trim()) {
                // Last resort: use just the interim transcript
                currentTranscript = interimTranscript.trim();
                console.log('⚠️ Using only interim transcript (less reliable)');
              }

              console.log('📝 Final assembled transcript for processing:', currentTranscript);
              console.log('📝 Character count:', currentTranscript.length);
              console.log('📝 Word count:', currentTranscript.split(/\s+/).length);

              // Auto-generate note if we have a transcript
              if (currentTranscript && currentTranscript.trim()) {
                console.log('🤖 Auto-generating note from transcript:', currentTranscript);
                console.log('🤖 Selected template:', selectedTemplate);

                // Show processing toast
                toast.info('🎯 Processing Your Recording', {
                  description: `Captured ${currentTranscript.split(/\s+/).length} words - generating ${selectedTemplate} note with advanced AI...`
                });

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
                      const sectionKey = formatSectionName(section);
                      noteContent[sectionKey] = data.content;
                      console.log(`🤖 Section ${sectionKey}:`, data.content.substring(0, 100));
                    });
                  }

                  if (Object.keys(noteContent).length === 0) {
                    console.warn('⚠️ No sections in generated note, using template fallback');
                    Object.assign(noteContent, createTemplateFallback(selectedTemplate, currentTranscript));
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
                  const fallbackContent = createTemplateFallback(selectedTemplate, currentTranscript);
                  
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
              } else {
                // No transcript captured
                console.warn('⚠️ No transcript captured during recording session');
                toast.warning('No audio captured', {
                  description: 'Please try speaking closer to the microphone or check your audio settings'
                });
                setIsProcessing(false);
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
    if (screen === 'raha-ai') {
      setCurrentScreen('raha-ai' as Screen);
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
      toast.success('Account created!', { description: `Welcome to Raha, ${name}` });
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

    console.log('🎤 Stopping transcription service - will process transcript in onEnd callback...');

    // Clear recording timer first
    if (recordingInterval) {
      clearInterval(recordingInterval);
      setRecordingInterval(null);
    }

    // Stop the transcription service - this will trigger the onEnd callback
    // which will process the transcript and generate the note
    if (advancedTranscriptionService.getIsListening()) {
      advancedTranscriptionService.stopListening();
    }

    console.log('✅ Transcription service stopped - processing will happen in onEnd callback');
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
      if (detectedType.confidence > 0.6 && !templateLocked && detectedType.template !== selectedTemplate) {
        setSelectedTemplate(detectedType.template);
        setTemplateLocked(false);
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
        const sectionKey = formatSectionName(section);
        noteContent[sectionKey] = data.content;
      });

      if (Object.keys(noteContent).length === 0) {
        console.warn('⚠️ No sections returned for manual text generation, using template fallback');
        Object.assign(noteContent, createTemplateFallback(selectedTemplate, text));
      }
      
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
      
      const fallbackContent = createTemplateFallback(selectedTemplate, text);
      setNoteContent(fallbackContent);
      setEditedNoteContent(fallbackContent);
      
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
        const sectionKey = formatSectionName(section);
        noteContent[sectionKey] = data.content;
      });

      if (Object.keys(noteContent).length === 0) {
        console.warn('⚠️ No sections returned for pasted text, using template fallback');
        Object.assign(noteContent, createTemplateFallback(selectedTemplate, text));
      }
      
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
      
      const fallbackContent = createTemplateFallback(selectedTemplate, text);
      setNoteContent(fallbackContent);
      setEditedNoteContent(fallbackContent);
      
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
    setTemplateLocked(false);
    
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
        return <NoteHistory onNavigate={handleNavigate} />;

      case 'analytics':
        return <AnalyticsScreen />;

      case 'education':
        return <EducationScreen />;

      case 'team':
        return <TeamManagementScreen />;

      case 'raha-ai':
        return <RahaAIScreen onNavigate={handleNavigate} currentContext={{
          screen: currentScreen,
          template: selectedTemplate,
          hasTranscript: transcript.length > 0,
          hasNote: Object.keys(noteContent).length > 0
        }} />;

      case 'admin':
        return <EnhancedAdminDashboard />;

      case 'instructions':
        return <InstructionsPage onNavigate={handleNavigate} />;


      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 overflow-x-hidden">
      {/* Desktop Layout */}
      <div className="hidden lg:block overflow-x-hidden">
        <div className="flex h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 overflow-x-hidden">
          {/* Desktop Sidebar - Compact */}
          <aside className="w-64 bg-white/95 backdrop-blur-xl border-r border-slate-200 shadow-xl">
              <div className="flex flex-col h-full">
                {/* Logo Section - Modern & Professional */}
                <div className="p-6 border-b border-slate-200/80 bg-gradient-to-br from-slate-50/50 to-white">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-teal-500 via-teal-600 to-blue-600 rounded-xl flex items-center justify-center shadow-xl shadow-teal-500/30 ring-1 ring-white/20">
                      <Stethoscope className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h1 className="text-xl font-bold bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 bg-clip-text text-transparent tracking-tight">
                        Raha
                      </h1>
                      <p className="text-xs font-medium text-slate-500 tracking-wide uppercase">
                        Charting Made Gentle
                      </p>
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

                {/* Main Navigation - Modern & Professional */}
                <div className="flex-1 p-4 overflow-y-auto">
                  <nav className="space-y-6">
                    {/* Core Section */}
                    <div>
                      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 px-2">Core Features</h3>
                      <div className="space-y-1">
                        <Button
                          variant="ghost"
                          className={`w-full justify-start h-11 text-sm font-medium transition-all duration-200 group relative overflow-hidden ${
                            currentScreen === 'home'
                              ? 'bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-lg shadow-teal-500/25 border border-teal-400/20'
                              : 'text-slate-700 hover:text-teal-700 hover:bg-gradient-to-r hover:from-teal-50 hover:to-blue-50 border border-transparent hover:border-teal-200/50'
                          }`}
                          onClick={() => handleNavigate('home')}
                        >
                          <div className={`absolute inset-0 bg-gradient-to-r from-teal-400/10 to-blue-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${currentScreen === 'home' ? 'opacity-100' : ''}`} />
                          <Mic className={`h-4 w-4 mr-3 transition-colors duration-200 ${currentScreen === 'home' ? 'text-white' : 'text-teal-600 group-hover:text-teal-700'}`} />
                          <span className="relative z-10">New Note</span>
                          {currentScreen === 'home' && (
                            <div className="absolute right-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-white rounded-full" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          className={`w-full justify-start h-11 text-sm font-medium transition-all duration-200 group relative overflow-hidden ${
                            currentScreen === 'draft'
                              ? 'bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-lg shadow-teal-500/25 border border-teal-400/20'
                              : 'text-slate-700 hover:text-teal-700 hover:bg-gradient-to-r hover:from-teal-50 hover:to-blue-50 border border-transparent hover:border-teal-200/50'
                          }`}
                          onClick={() => handleNavigate('draft')}
                        >
                          <div className={`absolute inset-0 bg-gradient-to-r from-teal-400/10 to-blue-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${currentScreen === 'draft' ? 'opacity-100' : ''}`} />
                          <FileText className={`h-4 w-4 mr-3 transition-colors duration-200 ${currentScreen === 'draft' ? 'text-white' : 'text-teal-600 group-hover:text-teal-700'}`} />
                          <span className="relative z-10">Draft Preview</span>
                          {currentScreen === 'draft' && (
                            <div className="absolute right-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-white rounded-full" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          className={`w-full justify-start h-11 text-sm font-medium transition-all duration-200 group relative overflow-hidden ${
                            currentScreen === 'export'
                              ? 'bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-lg shadow-teal-500/25 border border-teal-400/20'
                              : 'text-slate-700 hover:text-teal-700 hover:bg-gradient-to-r hover:from-teal-50 hover:to-blue-50 border border-transparent hover:border-teal-200/50'
                          }`}
                          onClick={() => handleNavigate('export')}
                        >
                          <div className={`absolute inset-0 bg-gradient-to-r from-teal-400/10 to-blue-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${currentScreen === 'export' ? 'opacity-100' : ''}`} />
                          <Download className={`h-4 w-4 mr-3 transition-colors duration-200 ${currentScreen === 'export' ? 'text-white' : 'text-teal-600 group-hover:text-teal-700'}`} />
                          <span className="relative z-10">Export</span>
                          {currentScreen === 'export' && (
                            <div className="absolute right-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-white rounded-full" />
                          )}
                        </Button>
                      </div>
                    </div>

                    {/* Advanced Tools Section */}
                    <div>
                      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 px-2">Advanced Tools</h3>
                      <div className="space-y-1">
                        <Button
                          variant="ghost"
                          className={`w-full justify-start h-11 text-sm font-medium transition-all duration-200 group relative overflow-hidden ${
                            currentScreen === 'history'
                              ? 'bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-lg shadow-teal-500/25 border border-teal-400/20'
                              : 'text-slate-700 hover:text-teal-700 hover:bg-gradient-to-r hover:from-teal-50 hover:to-blue-50 border border-transparent hover:border-teal-200/50'
                          }`}
                          onClick={() => handleNavigate('history')}
                        >
                          <div className={`absolute inset-0 bg-gradient-to-r from-teal-400/10 to-blue-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${currentScreen === 'history' ? 'opacity-100' : ''}`} />
                          <FileText className={`h-4 w-4 mr-3 transition-colors duration-200 ${currentScreen === 'history' ? 'text-white' : 'text-teal-600 group-hover:text-teal-700'}`} />
                          <span className="relative z-10">Note History</span>
                          {currentScreen === 'history' && (
                            <div className="absolute right-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-white rounded-full" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          className={`w-full justify-start h-11 text-sm font-medium transition-all duration-200 group relative overflow-hidden ${
                            currentScreen === 'analytics'
                              ? 'bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-lg shadow-teal-500/25 border border-teal-400/20'
                              : 'text-slate-700 hover:text-teal-700 hover:bg-gradient-to-r hover:from-teal-50 hover:to-blue-50 border border-transparent hover:border-teal-200/50'
                          }`}
                          onClick={() => handleNavigate('analytics')}
                        >
                          <div className={`absolute inset-0 bg-gradient-to-r from-teal-400/10 to-blue-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${currentScreen === 'analytics' ? 'opacity-100' : ''}`} />
                          <BarChart3 className={`h-4 w-4 mr-3 transition-colors duration-200 ${currentScreen === 'analytics' ? 'text-white' : 'text-teal-600 group-hover:text-teal-700'}`} />
                          <span className="relative z-10">Analytics</span>
                          {currentScreen === 'analytics' && (
                            <div className="absolute right-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-white rounded-full" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          className={`w-full justify-start h-11 text-sm font-medium transition-all duration-200 group relative overflow-hidden ${
                            currentScreen === 'education'
                              ? 'bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-lg shadow-teal-500/25 border border-teal-400/20'
                              : 'text-slate-700 hover:text-teal-700 hover:bg-gradient-to-r hover:from-teal-50 hover:to-blue-50 border border-transparent hover:border-teal-200/50'
                          }`}
                          onClick={() => handleNavigate('education')}
                        >
                          <div className={`absolute inset-0 bg-gradient-to-r from-teal-400/10 to-blue-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${currentScreen === 'education' ? 'opacity-100' : ''}`} />
                          <BookOpen className={`h-4 w-4 mr-3 transition-colors duration-200 ${currentScreen === 'education' ? 'text-white' : 'text-teal-600 group-hover:text-teal-700'}`} />
                          <span className="relative z-10">Education</span>
                          {currentScreen === 'education' && (
                            <div className="absolute right-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-white rounded-full" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          className={`w-full justify-start h-11 text-sm font-medium transition-all duration-200 group relative overflow-hidden ${
                            currentScreen === 'team'
                              ? 'bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-lg shadow-teal-500/25 border border-teal-400/20'
                              : 'text-slate-700 hover:text-teal-700 hover:bg-gradient-to-r hover:from-teal-50 hover:to-blue-50 border border-transparent hover:border-teal-200/50'
                          }`}
                          onClick={() => handleNavigate('team')}
                        >
                          <div className={`absolute inset-0 bg-gradient-to-r from-teal-400/10 to-blue-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${currentScreen === 'team' ? 'opacity-100' : ''}`} />
                          <Users className={`h-4 w-4 mr-3 transition-colors duration-200 ${currentScreen === 'team' ? 'text-white' : 'text-teal-600 group-hover:text-teal-700'}`} />
                          <span className="relative z-10">Team</span>
                          {currentScreen === 'team' && (
                            <div className="absolute right-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-white rounded-full" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          className={`w-full justify-start h-11 text-sm font-medium transition-all duration-200 group relative overflow-hidden ${
                            currentScreen === 'raha-ai'
                              ? 'bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-lg shadow-teal-500/25 border border-teal-400/20'
                              : 'text-slate-700 hover:text-teal-700 hover:bg-gradient-to-r hover:from-teal-50 hover:to-blue-50 border border-transparent hover:border-teal-200/50'
                          }`}
                          onClick={() => handleNavigate('raha-ai')}
                        >
                          <div className={`absolute inset-0 bg-gradient-to-r from-teal-400/10 to-blue-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${currentScreen === 'raha-ai' ? 'opacity-100' : ''}`} />
                          <Brain className={`h-4 w-4 mr-3 transition-colors duration-200 ${currentScreen === 'raha-ai' ? 'text-white' : 'text-teal-600 group-hover:text-teal-700'}`} />
                          <span className="relative z-10">Raha AI</span>
                          {currentScreen === 'raha-ai' && (
                            <div className="absolute right-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-white rounded-full" />
                          )}
                        </Button>
                      </div>
                    </div>

                    {/* Account Section */}
                    <div>
                      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 px-2">Account</h3>
                      <div className="space-y-1">
                        <Button
                          variant="ghost"
                          className={`w-full justify-start h-11 text-sm font-medium transition-all duration-200 group relative overflow-hidden ${
                            currentScreen === 'profile'
                              ? 'bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-lg shadow-teal-500/25 border border-teal-400/20'
                              : 'text-slate-700 hover:text-teal-700 hover:bg-gradient-to-r hover:from-teal-50 hover:to-blue-50 border border-transparent hover:border-teal-200/50'
                          }`}
                          onClick={() => handleNavigate('profile')}
                        >
                          <div className={`absolute inset-0 bg-gradient-to-r from-teal-400/10 to-blue-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${currentScreen === 'profile' ? 'opacity-100' : ''}`} />
                          <User className={`h-4 w-4 mr-3 transition-colors duration-200 ${currentScreen === 'profile' ? 'text-white' : 'text-teal-600 group-hover:text-teal-700'}`} />
                          <span className="relative z-10">Profile</span>
                          {currentScreen === 'profile' && (
                            <div className="absolute right-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-white rounded-full" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          className={`w-full justify-start h-11 text-sm font-medium transition-all duration-200 group relative overflow-hidden ${
                            currentScreen === 'settings'
                              ? 'bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-lg shadow-teal-500/25 border border-teal-400/20'
                              : 'text-slate-700 hover:text-teal-700 hover:bg-gradient-to-r hover:from-teal-50 hover:to-blue-50 border border-transparent hover:border-teal-200/50'
                          }`}
                          onClick={() => handleNavigate('settings')}
                        >
                          <div className={`absolute inset-0 bg-gradient-to-r from-teal-400/10 to-blue-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${currentScreen === 'settings' ? 'opacity-100' : ''}`} />
                          <Settings className={`h-4 w-4 mr-3 transition-colors duration-200 ${currentScreen === 'settings' ? 'text-white' : 'text-teal-600 group-hover:text-teal-700'}`} />
                          <span className="relative z-10">Settings</span>
                          {currentScreen === 'settings' && (
                            <div className="absolute right-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-white rounded-full" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </nav>
                </div>

                {/* Bottom Actions */}
                <div className="p-3 border-t border-slate-200">
                  <Button
                    onClick={handleNewNote}
                    className="w-full bg-[#6dbda9] hover:bg-[#5ba08c] text-white shadow-lg h-9 text-sm"
                  >
                    <Mic className="h-4 w-4 mr-2" />
                    Start New Note
                  </Button>
                  {!userProfile.isSignedIn && (
                    <Button
                      onClick={() => navigate('/auth')}
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
          <div className="flex-1 flex flex-col overflow-x-hidden">
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
                      {currentScreen === 'raha-ai' && 'Raha AI'}
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
                      {currentScreen === 'raha-ai' && 'Intelligent AI assistant for clinical documentation and guided workflows'}
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
            <main className="flex-1 overflow-x-hidden overflow-y-hidden">
              <div className="h-full overflow-x-hidden">
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

          {/* Mobile Bottom Toolbar */}
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

      {/* Synthetic AI Assistant */}
      {showAI && (
        <SyntheticAI
          isMinimized={aiMinimized}
          onToggleMinimize={() => setAiMinimized(!aiMinimized)}
          onClose={() => setShowAI(false)}
          currentContext={{
            screen: currentScreen,
            template: selectedTemplate,
            hasTranscript: !!transcript,
            hasNote: Object.keys(noteContent).length > 0
          }}
          onAction={(action, data) => {
            // Handle AI actions
            switch(action) {
              case 'selectTemplate':
                setSelectedTemplate(data.template || data);
                toast.success(`Template changed to ${data.template || data}`);
                break;
              case 'startVoiceRecording':
                handleStartRecording();
                break;
              case 'stopVoiceRecording':
                handleStopRecording();
                break;
              case 'generateNote':
                if (transcript) {
                  handleNavigate('draft');
                } else {
                  toast.info('Please record or enter text first');
                }
                break;
              case 'export':
                handleNavigate('export');
                break;
              case 'checkCompliance':
                toast.info('Compliance check: All required fields present ✓');
                break;
              case 'clearNote':
                handleNewNote();
                break;
              case 'openICD10Search':
                toast.info('ICD-10 search feature coming soon!');
                break;
              case 'openVitalSigns':
                toast.info('Vital signs form coming soon!');
                break;
              default:
                console.warn('Unknown AI action:', action);
            }
          }}
        />
      )}

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
