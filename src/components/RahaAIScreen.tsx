import React, { useState, useEffect, useRef } from 'react';
import {
  Mic, MicOff, Send, Sparkles, Volume2, VolumeX, Brain, Activity, MessageSquare,
  Lightbulb, Stethoscope, ArrowRight, FileText, TrendingUp, Clock, Star,
  ChevronRight, Search, Filter, BarChart3, Calendar, Download, Edit, Trash2,
  Home, Settings, History, Users, BookOpen, Eye, CheckCircle, AlertCircle,
  Zap, Target, Award, PieChart, LineChart, Grid, List, Play, Pause, Plus,
  ChevronDown, Workflow, ClipboardList, Mic2, Pill, Droplets, Bandage, Shield,
  Heart, Baby
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { openaiService } from '@/lib/openaiService';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { TemplateSelector } from './TemplateSelector';
import { unifiedTemplateRegistry, UnifiedTemplate } from '@/lib/unifiedTemplates';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  actions?: Array<{
    type: string;
    label: string;
    data: any;
  }>;
  thinking?: boolean;
  templateGuidance?: {
    template: string;
    currentStep: number;
    totalSteps: number;
    stepPrompt: string;
  };
}

interface RahaAIScreenProps {
  onNavigate?: (screen: string) => void;
  currentContext?: {
    screen?: string;
    template?: string;
    hasTranscript?: boolean;
    hasNote?: boolean;
  };
}

interface UserNote {
  id: string;
  template: string;
  content: any;
  timestamp: Date;
  starred?: boolean;
}

// Template workflow definitions with categories
const templateWorkflows: Record<string, {
  steps: string[];
  description: string;
  category: 'Traditional' | 'Epic EMR' | 'Unit-Specific';
  icon?: string;
  color?: string;
}> = {
  // Traditional Templates
  'SOAP': {
    category: 'Traditional',
    description: 'Subjective, Objective, Assessment, Plan',
    color: 'purple',
    steps: [
      'Describe the Subjective information (patient complaints, symptoms, history)',
      'Provide Objective data (vital signs, physical exam findings, lab results)',
      'Share your Assessment (diagnosis, clinical impression)',
      'Outline the Plan (treatment, medications, follow-up)'
    ]
  },
  'SBAR': {
    category: 'Traditional',
    description: 'Situation, Background, Assessment, Recommendation',
    color: 'teal',
    steps: [
      'Describe the Situation (what is happening right now)',
      'Provide Background (relevant medical history, current medications)',
      'Share your Assessment (what you think is the problem)',
      'Make a Recommendation (what action should be taken)'
    ]
  },
  'PIE': {
    category: 'Traditional',
    description: 'Problem, Intervention, Evaluation',
    color: 'orange',
    steps: [
      'Identify the Problem (patient issue or nursing diagnosis)',
      'Describe the Intervention (nursing actions taken)',
      'Evaluate the outcome (patient response, effectiveness)'
    ]
  },
  'DAR': {
    category: 'Traditional',
    description: 'Data, Action, Response',
    color: 'pink',
    steps: [
      'Document the Data (observations, vital signs, patient statements)',
      'Describe the Action taken (interventions, treatments)',
      'Record the Response (patient outcome, effectiveness)'
    ]
  },

  // Epic EMR Templates
  'shift-assessment': {
    category: 'Epic EMR',
    description: 'Comprehensive Shift Assessment',
    color: 'blue',
    steps: [
      'Document Neurological status (LOC, orientation, pupils, motor/sensory function)',
      'Record Cardiovascular assessment (heart rate, rhythm, blood pressure, circulation)',
      'Describe Respiratory status (breath sounds, oxygen saturation, respiratory rate)',
      'Note Gastrointestinal function (bowel sounds, last BM, nausea/vomiting)',
      'Assess Genitourinary status (urine output, color, catheter if present)',
      'Document Integumentary condition (skin integrity, wounds, pressure areas)',
      'Record Pain assessment (location, intensity, quality, interventions)'
    ]
  },
  'mar': {
    category: 'Epic EMR',
    description: 'Medication Administration Record',
    color: 'emerald',
    steps: [
      'Verify medication name, dose, route, and time',
      'Confirm patient identity using two identifiers',
      'Document pre-administration assessment (vitals, allergies, contraindications)',
      'Record medication administration (exact time, site if applicable)',
      'Note patient response and any adverse reactions',
      'Document patient education provided about the medication'
    ]
  },
  'io': {
    category: 'Epic EMR',
    description: 'Intake & Output Documentation',
    color: 'cyan',
    steps: [
      'Record all fluid Intake (oral, IV, tube feeding, blood products)',
      'Document all Output (urine, emesis, drainage, stool)',
      'Calculate and record totals for the shift',
      'Note fluid balance (positive or negative)',
      'Document patient\'s hydration status and any concerns',
      'Record interventions if imbalance identified'
    ]
  },
  'wound-care': {
    category: 'Epic EMR',
    description: 'Wound Care Documentation',
    color: 'red',
    steps: [
      'Identify wound location and type (pressure ulcer, surgical, traumatic)',
      'Measure wound dimensions (length, width, depth in cm)',
      'Describe wound bed (color, tissue type, percentage of each)',
      'Document wound edges and surrounding skin condition',
      'Note drainage type, amount, and odor',
      'Record treatment applied (cleaning solution, dressing type)',
      'Document pain level and patient tolerance of procedure'
    ]
  },
  'safety-checklist': {
    category: 'Epic EMR',
    description: 'Patient Safety Checklist',
    color: 'amber',
    steps: [
      'Verify bed in lowest position with wheels locked',
      'Confirm call light within reach and patient knows how to use it',
      'Document fall risk assessment and precautions in place',
      'Check side rails position per protocol',
      'Verify proper lighting and clear pathways',
      'Confirm patient identification band is secure and accurate',
      'Document any safety concerns or interventions needed'
    ]
  },

  // Unit-Specific Templates
  'med-surg': {
    category: 'Unit-Specific',
    description: 'Medical-Surgical Unit Documentation',
    color: 'indigo',
    steps: [
      'Document current chief complaint and symptoms',
      'Record vital signs and any significant changes from baseline',
      'Note surgical status (pre-op, post-op day X, complications)',
      'Document pain management and effectiveness',
      'Record mobility status and activity tolerance',
      'Note IV access, fluids, and any medications administered',
      'Document patient/family education and discharge planning progress'
    ]
  },
  'icu': {
    category: 'Unit-Specific',
    description: 'Intensive Care Unit Documentation',
    color: 'slate',
    steps: [
      'Record neurological status (GCS, sedation score, pupil response)',
      'Document ventilator settings and respiratory status (if applicable)',
      'Note hemodynamic monitoring (A-line, CVP, cardiac output)',
      'Record all drips/infusions with rates and titration',
      'Document hourly intake/output and fluid balance',
      'Note lab values and any critical results',
      'Record family communication and updates provided'
    ]
  },
  'nicu': {
    category: 'Unit-Specific',
    description: 'Neonatal ICU Documentation',
    color: 'rose',
    steps: [
      'Record gestational age and current day of life',
      'Document respiratory support (ventilator, CPAP, oxygen, settings)',
      'Note cardiovascular status (heart rate, blood pressure, perfusion)',
      'Record feeding type, amount, and tolerance',
      'Document thermoregulation (isolette temp, infant temp)',
      'Note skin condition and any lines/tubes in place',
      'Record parent interaction and family updates'
    ]
  },
  'mother-baby': {
    category: 'Unit-Specific',
    description: 'Mother-Baby Unit Documentation',
    color: 'fuchsia',
    steps: [
      'Document postpartum day and delivery method',
      'Record fundus position, firmness, and lochia (color, amount)',
      'Note perineal/incision condition and pain level',
      'Document breastfeeding assessment (latch, frequency, effectiveness)',
      'Record newborn care and any concerns',
      'Note mother-infant bonding and attachment behaviors',
      'Document discharge education topics covered'
    ]
  }
};

export function RahaAIScreen({ onNavigate, currentContext = {} }: RahaAIScreenProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [aiState, setAiState] = useState<'idle' | 'thinking' | 'speaking' | 'listening'>('idle');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [guidedWorkflow, setGuidedWorkflow] = useState<{
    active: boolean;
    template: string;
    currentStep: number;
    responses: string[];
  } | null>(null);
  const [userNotes, setUserNotes] = useState<UserNote[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load user data
  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = () => {
    try {
      const notes: UserNote[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith('note-')) {
          try {
            const noteData = JSON.parse(localStorage.getItem(key) || '{}');
            notes.push({
              id: key,
              template: noteData.template || 'Unknown',
              content: noteData.content || {},
              timestamp: new Date(noteData.timestamp || Date.now()),
              starred: noteData.starred || false
            });
          } catch (e) {
            console.error('Error parsing note:', e);
          }
        }
      }
      setUserNotes(notes.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()));
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const stats = {
    totalNotes: userNotes.length,
    starredNotes: userNotes.filter(n => n.starred).length,
    todayNotes: userNotes.filter(n => {
      const today = new Date();
      const noteDate = new Date(n.timestamp);
      return noteDate.toDateString() === today.toDateString();
    }).length,
    templatesUsed: [...new Set(userNotes.map(n => n.template))].length,
    avgPerDay: userNotes.length > 0 ? (userNotes.length / 30).toFixed(1) : '0'
  };

  // Initialize with welcome message and template pills
  useEffect(() => {
    const welcomeMessage: Message = {
      id: '1',
      role: 'assistant',
      content: `Hi! I'm Raha, your intelligent AI nursing assistant. 👋

I can help you create professional clinical notes in seconds with detailed step-by-step guidance. Choose a template below to get started, or ask me anything!

**What I can help you with:**
• **Guided Note Creation** - Step-by-step workflows with detailed prompts
• **Clinical Documentation Tips** - Best practices and compliance guidance
• **Template Selection** - Choose from 17+ professional templates
• **Navigation & Workflow** - Help you move through the entire app

**Start by selecting a template or asking me a question!**`,
      timestamp: new Date(),
      actions: [
        { type: 'template-select', label: 'SOAP Notes', data: { template: 'SOAP' } },
        { type: 'template-select', label: 'SBAR Communication', data: { template: 'SBAR' } },
        { type: 'template-select', label: 'Shift Assessment', data: { template: 'shift-assessment' } },
        { type: 'template-select', label: 'Medication Admin', data: { template: 'mar' } },
        { type: 'navigate', label: 'View My Notes', data: { screen: 'history' } },
        { type: 'navigate', label: 'Analytics', data: { screen: 'analytics' } }
      ]
    };
    setMessages([welcomeMessage]);
  }, []);

  // Auto-scroll to bottom whenever messages change
  useEffect(() => {
    if (scrollRef.current) {
      // Use setTimeout to ensure DOM has updated
      setTimeout(() => {
        if (scrollRef.current) {
          scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
      }, 100);
    }
  }, [messages, guidedWorkflow]);

  // Voice recognition setup
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsListening(false);
        setAiState('idle');
      };

      recognition.onerror = () => {
        setIsListening(false);
        setAiState('idle');
        toast.error('Voice recognition error');
      };

      recognition.onend = () => {
        setIsListening(false);
        setAiState('idle');
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const handleVoiceToggle = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      setAiState('idle');
    } else {
      try {
        recognitionRef.current?.start();
        setIsListening(true);
        setAiState('listening');
        toast.success('🎤 Listening...');
      } catch (error) {
        toast.error('Voice recognition not available');
      }
    }
  };

  const handleTemplateSelect = (template: UnifiedTemplate) => {
    setSelectedTemplate(template.id);

    // Start guided workflow using the unified template
    setGuidedWorkflow({
      active: true,
      template: template.id,
      currentStep: 0,
      responses: []
    });

    const guidanceMessage: Message = {
      id: Date.now().toString(),
      role: 'assistant',
      content: `Perfect! Let's create a ${template.displayName} note together. I'll guide you through each section.

**${template.displayName} - ${template.description}**

${template.workflowSteps?.map((step, i) => `${i + 1}. ${step}`).join('\n') || 'Standard workflow steps will be provided.'}

Let's start with step 1:
**${template.workflowSteps?.[0] || 'Please provide your input for this section.'}**

You can type or use the microphone to respond. I'll help you format it professionally!`,
      timestamp: new Date(),
      templateGuidance: {
        template: template.id,
        currentStep: 0,
        totalSteps: template.workflowSteps?.length || 1,
        stepPrompt: template.workflowSteps?.[0] || 'Please provide your input.'
      }
    };

    setMessages(prev => [...prev, guidanceMessage]);
    setTimeout(() => inputRef.current?.focus(), 100);

    // Update template usage stats
    unifiedTemplateRegistry.updateTemplateUsage(template.id);
  };

  const handleSendMessage = async () => {
    if (!input.trim() || isProcessing) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setIsProcessing(true);
    setAiState('thinking');

    // Add thinking indicator
    const thinkingMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      thinking: true
    };
    setMessages(prev => [...prev, thinkingMessage]);

    try {
      // Check if we're in a guided workflow
      if (guidedWorkflow?.active) {
        const template = unifiedTemplateRegistry.getTemplateById(guidedWorkflow.template);
        const workflowSteps = template?.workflowSteps || [];
        const updatedResponses = [...guidedWorkflow.responses, currentInput];
        const nextStep = guidedWorkflow.currentStep + 1;

        // Remove thinking indicator
        setMessages(prev => prev.filter(m => !m.thinking));

        if (nextStep < workflowSteps.length) {
          // Continue to next step
          setGuidedWorkflow({
            ...guidedWorkflow,
            currentStep: nextStep,
            responses: updatedResponses
          });

          const nextMessage: Message = {
            id: Date.now().toString(),
            role: 'assistant',
            content: `Great! Step ${nextStep} of ${workflowSteps.length} complete.

**Step ${nextStep + 1}:**
${workflowSteps[nextStep]}`,
            timestamp: new Date(),
            templateGuidance: {
              template: guidedWorkflow.template,
              currentStep: nextStep,
              totalSteps: workflowSteps.length,
              stepPrompt: workflowSteps[nextStep]
            }
          };

          setMessages(prev => [...prev, nextMessage]);
        } else {
          // Workflow complete - generate final note
          setGuidedWorkflow(null);

          const sections = workflowSteps.map((step, i) => {
            const sectionName = step.split(' ')[0]; // Get first word (Subjective, Objective, etc.)
            return `**${sectionName}:**\n${updatedResponses[i]}`;
          }).join('\n\n');

          const templateName = template?.displayName || guidedWorkflow.template;
          const completionMessage: Message = {
            id: Date.now().toString(),
            role: 'assistant',
            content: `🎉 Perfect! Your ${templateName} note is complete!

${sections}

**What would you like to do next?**
• Navigate to Draft to review and edit
• Export this note
• Start another note
• Ask me any questions`,
            timestamp: new Date()
          };

          setMessages(prev => [...prev, completionMessage]);
          toast.success('Note completed!', {
            description: 'Your note is ready to review'
          });

          // Update template usage stats
          unifiedTemplateRegistry.updateTemplateUsage(guidedWorkflow.template, workflowSteps.length * 2);
        }
      } else {
        // Regular AI conversation
        const conversationHistory = messages
          .filter(m => !m.thinking)
          .map(m => ({
            role: m.role as 'user' | 'assistant' | 'system',
            content: m.content
          }));

        const systemPrompt = {
          role: 'system' as const,
          content: `You are Raha, an intelligent AI nursing assistant with deep clinical expertise. You provide detailed, step-by-step guidance for creating professional nursing documentation.

**Current User Data:**
- Total Notes: ${stats.totalNotes}
- Notes Today: ${stats.todayNotes}
- Starred Notes: ${stats.starredNotes}
- Templates Used: ${stats.templatesUsed}

**Current Context:**
- Screen: ${currentContext.screen || 'raha-ai'}
- Template: ${currentContext.template || 'none'}
- Has Transcript: ${currentContext.hasTranscript ? 'yes' : 'no'}
- Has Note: ${currentContext.hasNote ? 'yes' : 'no'}

**Your Advanced Capabilities:**
1. **Detailed Template Guidance** - Provide specific prompts, expected input formats, and clinical examples for each step
2. **Clinical Best Practices** - Include relevant ICD-10 codes, assessment tips, and documentation standards
3. **Intelligent Suggestions** - Analyze user input and suggest improvements or additional documentation needed
4. **Comprehensive Walkthroughs** - Guide users through complex workflows with clear expectations
5. **Contextual Help** - Adapt responses based on user experience level and clinical specialty

**Response Guidelines:**
- Always provide detailed, actionable guidance with specific examples
- Include expected input formats and clinical considerations
- Suggest relevant ICD-10 codes when appropriate
- Offer multiple options when choices exist
- Be proactive in suggesting next steps or related documentation
- Keep responses focused but comprehensive (3-5 paragraphs max)
- Use action buttons/pills for common actions and template selections

**Available Templates for Suggestions:**
- SOAP, SBAR, PIE, DAR (Traditional)
- Shift Assessment, MAR, I&O, Wound Care, Safety Checklist (Epic EMR)
- Med-Surg, ICU, NICU, Mother-Baby (Unit-Specific)`
        };

        const aiResponse = await openaiService.chatCompletion([
          systemPrompt,
          ...conversationHistory,
          { role: 'user', content: currentInput }
        ]);

        setMessages(prev => {
          const filtered = prev.filter(m => !m.thinking);
          return [...filtered, {
            id: Date.now().toString(),
            role: 'assistant',
            content: aiResponse,
            timestamp: new Date()
          }];
        });

        if (voiceEnabled && aiResponse) {
          speakMessage(aiResponse);
        }
      }
    } catch (error: any) {
      console.error('AI error:', error);
      setMessages(prev => prev.filter(m => !m.thinking));

      const fallbackResponse = error.message === 'AI_NOT_CONFIGURED'
        ? `I'm in demo mode, but I can still help you navigate!\n\nYou have ${stats.totalNotes} saved notes. Would you like me to guide you through creating a new one?`
        : "I'm having trouble connecting. I can still help you navigate and use templates!";

      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'assistant',
        content: fallbackResponse,
        timestamp: new Date()
      }]);

      if (error.message !== 'AI_NOT_CONFIGURED') {
        toast.error('AI service unavailable - template guidance available');
      }
    } finally {
      setIsProcessing(false);
      setAiState('idle');
    }
  };

  const speakMessage = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.onstart = () => {
        setIsSpeaking(true);
        setAiState('speaking');
      };
      utterance.onend = () => {
        setIsSpeaking(false);
        setAiState('idle');
      };
      window.speechSynthesis.speak(utterance);
    }
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setAiState('idle');
    }
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      {/* Streamlined Header */}
      <div className="flex-shrink-0 px-4 lg:px-6 py-3 bg-white/95 backdrop-blur-xl border-b-2 border-gradient-to-r from-teal-500/20 via-blue-500/20 to-purple-500/20 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              {/* Raha Text Logo */}
              <div className="flex items-center">
                <div className="relative">
                  <span className="text-lg lg:text-xl font-bold text-slate-800 tracking-tight">
                    <span className="text-slate-700">Ra</span>
                    <span className="text-teal-600">ha</span>
                  </span>
                  {/* Subtle accent line */}
                  <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-slate-300 via-teal-400 to-slate-300 rounded-full"></div>
                </div>
                <div className="ml-2 px-2 py-0.5 bg-teal-50 text-teal-700 text-xs font-medium rounded-md border border-teal-200">
                  AI
                </div>
              </div>
              {aiState !== 'idle' && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse border-2 border-white" />
              )}
            </div>
            <div className="ml-3">
              <p className="text-xs text-slate-600">
                {aiState === 'listening' && '🎤 Listening...'}
                {aiState === 'thinking' && '💭 Thinking...'}
                {aiState === 'speaking' && '🔊 Speaking...'}
                {aiState === 'idle' && guidedWorkflow?.active && (() => {
                  const template = unifiedTemplateRegistry.getTemplateById(guidedWorkflow.template);
                  const totalSteps = template?.workflowSteps?.length || 1;
                  return `Step ${guidedWorkflow.currentStep + 1}/${totalSteps}`;
                })()}
                {aiState === 'idle' && !guidedWorkflow?.active && 'Your AI nursing assistant'}
              </p>
            </div>
          </div>

          {/* Navigation Actions */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigate?.('home')}
              className="hidden lg:flex h-9 w-9 p-0 text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            >
              <Home className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigate?.('history')}
              className="hidden lg:flex h-9 w-9 p-0 text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            >
              <History className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigate?.('settings')}
              className="hidden lg:flex h-9 w-9 p-0 text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            >
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Toolbar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-t-2 border-slate-200 shadow-2xl safe-area-bottom">
        <div className="flex items-center justify-center gap-1 px-2 py-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onNavigate?.('home')}
            className="flex-1 flex flex-col items-center gap-1 h-12 px-2 py-1 text-slate-600 hover:text-teal-600 hover:bg-teal-50/50 rounded-lg transition-all"
          >
            <Home className="h-4 w-4" />
            <span className="text-xs font-medium">Home</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onNavigate?.('history')}
            className="flex-1 flex flex-col items-center gap-1 h-12 px-2 py-1 text-slate-600 hover:text-teal-600 hover:bg-teal-50/50 rounded-lg transition-all"
          >
            <History className="h-4 w-4" />
            <span className="text-xs font-medium">Notes</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onNavigate?.('analytics')}
            className="flex-1 flex flex-col items-center gap-1 h-12 px-2 py-1 text-slate-600 hover:text-teal-600 hover:bg-teal-50/50 rounded-lg transition-all"
          >
            <BarChart3 className="h-4 w-4" />
            <span className="text-xs font-medium">Stats</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onNavigate?.('settings')}
            className="flex-1 flex flex-col items-center gap-1 h-12 px-2 py-1 text-slate-600 hover:text-teal-600 hover:bg-teal-50/50 rounded-lg transition-all"
          >
            <Settings className="h-4 w-4" />
            <span className="text-xs font-medium">Settings</span>
          </Button>
        </div>
      </div>

      {/* Main Chat Area - Primary Focus */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {/* Compact Template Selector - Chat Focused */}
        {!guidedWorkflow?.active && (
          <div className="flex-shrink-0 px-4 lg:px-6 py-2 bg-slate-50/50 border-b border-slate-200">
            <div className="flex items-center gap-3 max-w-4xl mx-auto">
              <div className="flex items-center gap-2 flex-shrink-0">
                <Workflow className="h-4 w-4 text-teal-600" />
                <span className="text-sm font-medium text-slate-700">Start Template:</span>
              </div>
              <Select value={selectedTemplate} onValueChange={(value) => {
                const template = unifiedTemplateRegistry.getTemplateById(value);
                if (template) {
                  handleTemplateSelect(template);
                }
              }}>
                <SelectTrigger className="h-9 bg-white border-2 border-teal-200 hover:border-teal-400 focus:border-teal-500 transition-colors flex-1 lg:flex-initial lg:w-80">
                  <SelectValue placeholder="Choose from 17 templates..." />
                </SelectTrigger>
                <SelectContent className="max-h-80">
                  {/* Traditional Templates */}
                  <div className="px-2 py-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    Traditional Formats
                  </div>
                  <SelectItem value="EPIC_COMPREHENSIVE">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-blue-600" />
                      <div>
                        <p className="font-semibold">Epic Comprehensive</p>
                        <p className="text-xs text-slate-500">Full Epic-compliant documentation</p>
                      </div>
                    </div>
                  </SelectItem>
                  <SelectItem value="SOAP">
                    <div className="flex items-center gap-2">
                      <ClipboardList className="h-4 w-4 text-purple-600" />
                      <div>
                        <p className="font-semibold">SOAP</p>
                        <p className="text-xs text-slate-500">Subjective, Objective, Assessment, Plan</p>
                      </div>
                    </div>
                  </SelectItem>
                  <SelectItem value="SBAR">
                    <div className="flex items-center gap-2">
                      <ClipboardList className="h-4 w-4 text-teal-600" />
                      <div>
                        <p className="font-semibold">SBAR</p>
                        <p className="text-xs text-slate-500">Situation, Background, Assessment, Recommendation</p>
                      </div>
                    </div>
                  </SelectItem>
                  <SelectItem value="PIE">
                    <div className="flex items-center gap-2">
                      <ClipboardList className="h-4 w-4 text-orange-600" />
                      <div>
                        <p className="font-semibold">PIE</p>
                        <p className="text-xs text-slate-500">Problem, Intervention, Evaluation</p>
                      </div>
                    </div>
                  </SelectItem>
                  <SelectItem value="DAR">
                    <div className="flex items-center gap-2">
                      <ClipboardList className="h-4 w-4 text-pink-600" />
                      <div>
                        <p className="font-semibold">DAR</p>
                        <p className="text-xs text-slate-500">Data, Action, Response</p>
                      </div>
                    </div>
                  </SelectItem>

                  <Separator className="my-2" />

                  {/* Epic EMR Templates */}
                  <div className="px-2 py-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    Epic EMR Templates
                  </div>
                  <SelectItem value="shift-assessment">
                    <div className="flex items-center gap-2">
                      <Stethoscope className="h-4 w-4 text-blue-600" />
                      <div>
                        <p className="font-semibold">Shift Assessment</p>
                        <p className="text-xs text-slate-500">Comprehensive head-to-toe assessment</p>
                      </div>
                    </div>
                  </SelectItem>
                  <SelectItem value="mar">
                    <div className="flex items-center gap-2">
                      <Pill className="h-4 w-4 text-emerald-600" />
                      <div>
                        <p className="font-semibold">MAR</p>
                        <p className="text-xs text-slate-500">Medication Administration Record</p>
                      </div>
                    </div>
                  </SelectItem>
                  <SelectItem value="io">
                    <div className="flex items-center gap-2">
                      <Droplets className="h-4 w-4 text-cyan-600" />
                      <div>
                        <p className="font-semibold">I&O</p>
                        <p className="text-xs text-slate-500">Intake & Output documentation</p>
                      </div>
                    </div>
                  </SelectItem>
                  <SelectItem value="wound-care">
                    <div className="flex items-center gap-2">
                      <Bandage className="h-4 w-4 text-red-600" />
                      <div>
                        <p className="font-semibold">Wound Care</p>
                        <p className="text-xs text-slate-500">Detailed wound assessment</p>
                      </div>
                    </div>
                  </SelectItem>
                  <SelectItem value="safety-checklist">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-amber-600" />
                      <div>
                        <p className="font-semibold">Safety Checklist</p>
                        <p className="text-xs text-slate-500">Patient safety assessment</p>
                      </div>
                    </div>
                  </SelectItem>
                  <SelectItem value="med-surg">
                    <div className="flex items-center gap-2">
                      <Activity className="h-4 w-4 text-indigo-600" />
                      <div>
                        <p className="font-semibold">Med-Surg Epic</p>
                        <p className="text-xs text-slate-500">Medical-surgical documentation</p>
                      </div>
                    </div>
                  </SelectItem>
                  <SelectItem value="icu">
                    <div className="flex items-center gap-2">
                      <Heart className="h-4 w-4 text-slate-600" />
                      <div>
                        <p className="font-semibold">ICU Epic</p>
                        <p className="text-xs text-slate-500">Critical care documentation</p>
                      </div>
                    </div>
                  </SelectItem>
                  <SelectItem value="nicu">
                    <div className="flex items-center gap-2">
                      <Baby className="h-4 w-4 text-rose-600" />
                      <div>
                        <p className="font-semibold">NICU Epic</p>
                        <p className="text-xs text-slate-500">Neonatal intensive care</p>
                      </div>
                    </div>
                  </SelectItem>
                  <SelectItem value="mother-baby">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-fuchsia-600" />
                      <div>
                        <p className="font-semibold">Mother-Baby Epic</p>
                        <p className="text-xs text-slate-500">Postpartum and newborn care</p>
                      </div>
                    </div>
                  </SelectItem>

                  <Separator className="my-2" />

                  {/* Unit-Specific Templates */}
                  <div className="px-2 py-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    Unit-Specific Templates
                  </div>
                  <SelectItem value="med-surg-unit">
                    <div className="flex items-center gap-2">
                      <Activity className="h-4 w-4 text-indigo-600" />
                      <div>
                        <p className="font-semibold">Med-Surg Unit</p>
                        <p className="text-xs text-slate-500">Medical-surgical unit focus</p>
                      </div>
                    </div>
                  </SelectItem>
                  <SelectItem value="icu-unit">
                    <div className="flex items-center gap-2">
                      <Heart className="h-4 w-4 text-slate-600" />
                      <div>
                        <p className="font-semibold">ICU Unit</p>
                        <p className="text-xs text-slate-500">Intensive care unit focus</p>
                      </div>
                    </div>
                  </SelectItem>
                  <SelectItem value="nicu-unit">
                    <div className="flex items-center gap-2">
                      <Baby className="h-4 w-4 text-rose-600" />
                      <div>
                        <p className="font-semibold">NICU Unit</p>
                        <p className="text-xs text-slate-500">Neonatal ICU focus</p>
                      </div>
                    </div>
                  </SelectItem>
                  <SelectItem value="mother-baby-unit">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-fuchsia-600" />
                      <div>
                        <p className="font-semibold">Mother-Baby Unit</p>
                        <p className="text-xs text-slate-500">Mother-baby unit focus</p>
                      </div>
                    </div>
                  </SelectItem>



                </SelectContent>
              </Select>
              {selectedTemplate && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setSelectedTemplate('');
                    setGuidedWorkflow(null);
                  }}
                  className="h-9 text-xs"
                >
                  Clear
                </Button>
              )}
            </div>
          </div>
        )}

        {/* Guided Workflow Progress */}
        {guidedWorkflow?.active && (
          <div className="flex-shrink-0 px-4 lg:px-6 py-3 bg-gradient-to-r from-teal-500 to-blue-600">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Badge className="bg-white/20 text-white border-white/40 px-3 py-1">
                  {guidedWorkflow.template}
                </Badge>
                <span className="text-sm font-medium text-white">
                  Step {guidedWorkflow.currentStep + 1} of {(() => {
                    const template = unifiedTemplateRegistry.getTemplateById(guidedWorkflow.template);
                    return template?.workflowSteps?.length || 1;
                  })()}
                </span>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  setGuidedWorkflow(null);
                  setSelectedTemplate('');
                  toast.info('Workflow cancelled');
                }}
                className="h-8 text-white hover:bg-white/20"
              >
                Cancel
              </Button>
            </div>
            <div className="mt-2 bg-white/20 rounded-full h-2 overflow-hidden">
              <div
                className="bg-white h-full transition-all duration-500"
                style={{
                  width: `${((guidedWorkflow.currentStep + 1) / (() => {
                    const template = unifiedTemplateRegistry.getTemplateById(guidedWorkflow.template);
                    return template?.workflowSteps?.length || 1;
                  })()) * 100}%`
                }}
              />
            </div>
          </div>
        )}

        {/* Messages - Maximum Space */}
        <div className="flex-1 overflow-hidden px-4 lg:px-6 py-4">
          <ScrollArea className="h-full" ref={scrollRef}>
            <div className="space-y-4 max-w-4xl mx-auto">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex items-start gap-3",
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  )}
                >
                  {message.role === 'assistant' && (
                    <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                      <Stethoscope className="h-4 w-4 text-white" />
                    </div>
                  )}

                  <div className={cn(
                    "max-w-[85%] rounded-2xl p-4 shadow-sm",
                    message.role === 'user'
                      ? 'bg-gradient-to-br from-teal-500 to-blue-600 text-white shadow-teal-200'
                      : 'bg-white border-2 border-slate-100'
                  )}>
                    {message.thinking ? (
                      <div className="flex items-center gap-2 text-slate-500">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-teal-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                          <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                        <span className="text-sm font-medium">Processing...</span>
                      </div>
                    ) : (
                      <>
                        <p className={cn(
                          "text-sm whitespace-pre-wrap leading-relaxed",
                          message.role === 'user' ? 'text-white' : 'text-slate-700'
                        )}>
                          {message.content}
                        </p>

                        {/* Action Buttons/Pills */}
                        {message.actions && message.actions.length > 0 && (
                          <div className="mt-4 flex flex-wrap gap-2">
                            {message.actions.map((action, index) => (
                              <Button
                                key={index}
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  if (action.type === 'template-select') {
                                    const template = unifiedTemplateRegistry.getTemplateById(action.data.template);
                                    if (template) {
                                      handleTemplateSelect(template);
                                    }
                                  } else if (action.type === 'navigate') {
                                    onNavigate?.(action.data.screen);
                                  }
                                }}
                                className={cn(
                                  "h-8 px-3 text-xs font-medium rounded-full border-2 transition-all duration-200 hover:scale-105",
                                  action.type === 'template-select'
                                    ? 'bg-gradient-to-r from-teal-50 to-blue-50 border-teal-200 text-teal-700 hover:from-teal-100 hover:to-blue-100 hover:border-teal-300'
                                    : 'bg-gradient-to-r from-slate-50 to-slate-100 border-slate-300 text-slate-700 hover:from-slate-100 hover:to-slate-200 hover:border-slate-400'
                                )}
                              >
                                {action.label}
                              </Button>
                            ))}
                          </div>
                        )}

                        <p className={cn(
                          "text-xs mt-2 opacity-70",
                          message.role === 'user' ? 'text-white' : 'text-slate-500'
                        )}>
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </>
                    )}
                  </div>

                  {message.role === 'user' && (
                    <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                      <MessageSquare className="h-4 w-4 text-white" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Enhanced Input Area with Voice & Send Controls */}
        <div className="flex-shrink-0 px-4 lg:px-6 py-4 pb-20 lg:pb-4 bg-white/95 backdrop-blur-xl border-t-2 border-slate-200 shadow-lg">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3">
              {/* Voice Input Button */}
              <Button
                size="icon"
                onClick={handleVoiceToggle}
                disabled={isProcessing}
                className={cn(
                  "h-12 w-12 rounded-2xl shadow-lg transition-all duration-300 flex-shrink-0",
                  isListening
                    ? 'bg-gradient-to-br from-red-500 to-pink-600 animate-pulse shadow-red-500/50'
                    : 'bg-gradient-to-br from-slate-100 to-slate-200 hover:from-slate-200 hover:to-slate-300 border-2 border-slate-300 hover:border-slate-400'
                )}
              >
                {isListening ? (
                  <MicOff className="h-5 w-5 text-white" />
                ) : (
                  <Mic className="h-5 w-5 text-slate-600" />
                )}
              </Button>

              {/* Input Field - Full Width */}
              <Input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                placeholder={
                  guidedWorkflow?.active
                    ? "Type your response for this step..."
                    : "Ask me anything or start a guided note..."
                }
                className="flex-1 bg-slate-50 rounded-2xl px-4 py-3 border-2 border-slate-200 focus:border-teal-400 focus:bg-white transition-all text-sm placeholder:text-slate-400"
                disabled={isProcessing}
              />

              {/* Send Button */}
              <Button
                size="icon"
                onClick={handleSendMessage}
                disabled={!input.trim() || isProcessing}
                className="h-12 w-12 rounded-2xl bg-gradient-to-br from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 flex-shrink-0"
              >
                <Send className="h-5 w-5" />
              </Button>
            </div>

            {/* Voice Status Indicator */}
            {isListening && (
              <div className="mt-3 flex items-center justify-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                <span className="text-sm text-red-600 font-medium">Listening... Speak now</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
