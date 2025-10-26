import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, MicOff, Sparkles, X, Minimize2, Maximize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  actions?: Array<{
    label: string;
    action: () => void;
  }>;
}

interface ConversationalAIProps {
  onAction?: (action: string, data: any) => void;
  onClose?: () => void;
  isMinimized?: boolean;
  onToggleMinimize?: () => void;
}

export function ConversationalAI({ 
  onAction, 
  onClose,
  isMinimized = false,
  onToggleMinimize
}: ConversationalAIProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'system',
      content: "Hi! I'm your NovaCare AI Assistant. I can help you with:\n\n• Creating and editing notes\n• Voice transcription\n• Template selection\n• ICD-10 code suggestions\n• Epic documentation\n• Compliance checking\n• And much more!\n\nWhat would you like to do?",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = () => {
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  const processUserInput = async (userInput: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: userInput,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsProcessing(true);

    // Simulate AI processing and generate response
    setTimeout(() => {
      const response = generateAIResponse(userInput);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.content,
        timestamp: new Date(),
        actions: response.actions
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsProcessing(false);

      // Execute any automatic actions
      if (response.autoAction && onAction) {
        onAction(response.autoAction.type, response.autoAction.data);
      }
    }, 1000);
  };

  const generateAIResponse = (input: string): {
    content: string;
    actions?: Array<{ label: string; action: () => void }>;
    autoAction?: { type: string; data: any };
  } => {
    const lowerInput = input.toLowerCase();

    // Create note
    if (lowerInput.includes('create') && (lowerInput.includes('note') || lowerInput.includes('documentation'))) {
      return {
        content: "I'll help you create a new note. Which template would you like to use?\n\n• SOAP (Subjective, Objective, Assessment, Plan)\n• SBAR (Situation, Background, Assessment, Recommendation)\n• PIE (Problem, Intervention, Evaluation)\n• DAR (Data, Action, Response)\n• Epic Templates (Shift Assessment, MAR, I&O, etc.)",
        actions: [
          { label: 'SOAP', action: () => onAction?.('selectTemplate', 'SOAP') },
          { label: 'SBAR', action: () => onAction?.('selectTemplate', 'SBAR') },
          { label: 'Epic Shift Assessment', action: () => onAction?.('selectTemplate', 'shift-assessment') }
        ]
      };
    }

    // Start voice recording
    if (lowerInput.includes('start') && (lowerInput.includes('voice') || lowerInput.includes('recording') || lowerInput.includes('dictation'))) {
      return {
        content: "Starting voice recording now. Speak clearly and I'll transcribe everything for you. Say 'stop recording' when you're done.",
        autoAction: { type: 'startVoiceRecording', data: {} }
      };
    }

    // Stop voice recording
    if (lowerInput.includes('stop') && (lowerInput.includes('recording') || lowerInput.includes('voice'))) {
      return {
        content: "Voice recording stopped. Would you like me to generate a structured note from your transcription?",
        actions: [
          { label: 'Generate Note', action: () => onAction?.('generateNote', {}) },
          { label: 'Continue Recording', action: () => onAction?.('startVoiceRecording', {}) }
        ],
        autoAction: { type: 'stopVoiceRecording', data: {} }
      };
    }

    // Generate note
    if (lowerInput.includes('generate') && lowerInput.includes('note')) {
      return {
        content: "Generating your note now using AI. This will take just a moment...",
        autoAction: { type: 'generateNote', data: {} }
      };
    }

    // ICD-10 codes
    if (lowerInput.includes('icd') || lowerInput.includes('diagnosis code')) {
      return {
        content: "I can help you find ICD-10 codes. What condition or symptoms are you documenting? For example:\n\n• Hypertension\n• Diabetes\n• Pneumonia\n• Chest pain\n• Shortness of breath",
        actions: [
          { label: 'Search ICD-10', action: () => onAction?.('openICD10Search', {}) }
        ]
      };
    }

    // Epic templates
    if (lowerInput.includes('epic') && lowerInput.includes('template')) {
      return {
        content: "Here are the available Epic templates:\n\n• Shift Assessment (Start/Mid/End)\n• MAR (Medication Administration)\n• I&O (Intake & Output)\n• Wound Care\n• Safety Checklist\n• Med-Surg Unit\n• ICU Unit\n• NICU Unit\n• Mother-Baby Unit\n\nWhich one would you like to use?",
        actions: [
          { label: 'Shift Assessment', action: () => onAction?.('selectTemplate', 'shift-assessment') },
          { label: 'MAR', action: () => onAction?.('selectTemplate', 'mar') },
          { label: 'I&O', action: () => onAction?.('selectTemplate', 'io') }
        ]
      };
    }

    // Export note
    if (lowerInput.includes('export') || lowerInput.includes('save') || lowerInput.includes('download')) {
      return {
        content: "How would you like to export your note?\n\n• Copy to Clipboard (for pasting into EHR)\n• Download as PDF\n• Download as Text File\n• Export to Epic Format",
        actions: [
          { label: 'Copy to Clipboard', action: () => onAction?.('export', { format: 'clipboard' }) },
          { label: 'Download PDF', action: () => onAction?.('export', { format: 'pdf' }) },
          { label: 'Epic Format', action: () => onAction?.('export', { format: 'epic' }) }
        ]
      };
    }

    // Check compliance
    if (lowerInput.includes('compliance') || lowerInput.includes('check') || lowerInput.includes('validate')) {
      return {
        content: "I'll check your note for Epic compliance and completeness. This includes:\n\n• Required fields\n• Vital signs validation\n• Safety documentation\n• Template-specific requirements\n\nRunning compliance check now...",
        autoAction: { type: 'checkCompliance', data: {} }
      };
    }

    // Help with templates
    if (lowerInput.includes('help') || lowerInput.includes('how') || lowerInput.includes('what can you')) {
      return {
        content: "I can help you with many tasks:\n\n**Documentation:**\n• Create notes with any template\n• Voice-to-text transcription\n• AI-powered note generation\n\n**Epic Integration:**\n• Epic-specific templates\n• Compliance checking\n• Export to Epic format\n\n**Clinical Support:**\n• ICD-10 code suggestions\n• Medication documentation\n• I&O calculations\n• Wound care tracking\n\n**Workflow:**\n• Quick commands\n• Template shortcuts\n• Export options\n\nJust tell me what you need!"
      };
    }

    // Clear/new note
    if (lowerInput.includes('clear') || lowerInput.includes('new note') || lowerInput.includes('start over')) {
      return {
        content: "I'll clear the current note and start fresh. Are you sure you want to do this?",
        actions: [
          { label: 'Yes, Clear Note', action: () => onAction?.('clearNote', {}) },
          { label: 'Cancel', action: () => {} }
        ]
      };
    }

    // Vital signs
    if (lowerInput.includes('vital') || lowerInput.includes('bp') || lowerInput.includes('blood pressure')) {
      return {
        content: "I can help you document vital signs. You can say them naturally like:\n\n• 'Blood pressure 120 over 80'\n• 'Heart rate 72'\n• 'Temp 98.6'\n• 'O2 sat 98 percent'\n• 'Respiratory rate 16'\n• 'Pain level 3 out of 10'\n\nOr I can open the vital signs form for you.",
        actions: [
          { label: 'Open Vital Signs Form', action: () => onAction?.('openVitalSigns', {}) }
        ]
      };
    }

    // Medication
    if (lowerInput.includes('medication') || lowerInput.includes('med') || lowerInput.includes('drug')) {
      return {
        content: "I can help with medication documentation. Tell me:\n\n• Medication name\n• Dose\n• Route (PO, IV, IM, etc.)\n• Time administered\n• Patient response\n\nOr I can open the MAR template for you.",
        actions: [
          { label: 'Open MAR Template', action: () => onAction?.('selectTemplate', 'mar') }
        ]
      };
    }

    // Default response
    return {
      content: "I'm here to help! I can assist with:\n\n• Creating and editing notes\n• Voice transcription\n• Template selection\n• ICD-10 codes\n• Epic documentation\n• Exporting notes\n• Compliance checking\n\nWhat would you like to do? You can also ask me 'help' for more options."
    };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isProcessing) {
      processUserInput(input.trim());
    }
  };

  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={onToggleMinimize}
          className="rounded-full w-14 h-14 shadow-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
        >
          <Sparkles className="h-6 w-6" />
        </Button>
      </div>
    );
  }

  return (
    <Card className="fixed bottom-4 right-4 w-96 h-[600px] shadow-2xl z-50 flex flex-col bg-white dark:bg-gray-900 border-2 border-blue-200 dark:border-blue-800">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-blue-500 to-purple-600 text-white">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5" />
          <div>
            <h3 className="font-semibold">AI Assistant</h3>
            <p className="text-xs opacity-90">Always here to help</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleMinimize}
            className="text-white hover:bg-white/20"
          >
            <Minimize2 className="h-4 w-4" />
          </Button>
          {onClose && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-white hover:bg-white/20"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex flex-col gap-2",
                message.role === 'user' ? 'items-end' : 'items-start'
              )}
            >
              <div
                className={cn(
                  "max-w-[80%] rounded-lg p-3 text-sm",
                  message.role === 'user'
                    ? 'bg-blue-500 text-white'
                    : message.role === 'system'
                    ? 'bg-purple-100 dark:bg-purple-900 text-purple-900 dark:text-purple-100 border border-purple-200 dark:border-purple-800'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
                )}
              >
                <p className="whitespace-pre-wrap">{message.content}</p>
              </div>

              {/* Action buttons */}
              {message.actions && message.actions.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {message.actions.map((action, idx) => (
                    <Button
                      key={idx}
                      variant="outline"
                      size="sm"
                      onClick={action.action}
                      className="text-xs"
                    >
                      {action.label}
                    </Button>
                  ))}
                </div>
              )}

              <span className="text-xs text-gray-500 dark:text-gray-400">
                {message.timestamp.toLocaleTimeString()}
              </span>
            </div>
          ))}

          {isProcessing && (
            <div className="flex items-start gap-2">
              <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="p-4 border-t bg-gray-50 dark:bg-gray-800">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Button
            type="button"
            variant={isListening ? "destructive" : "outline"}
            size="icon"
            onClick={toggleListening}
            disabled={isProcessing}
          >
            {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
          </Button>
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me anything..."
            disabled={isProcessing || isListening}
            className="flex-1"
          />
          <Button type="submit" disabled={!input.trim() || isProcessing}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
        <div className="mt-2 flex flex-wrap gap-1">
          <Badge variant="secondary" className="text-xs cursor-pointer" onClick={() => setInput('Create a new note')}>
            Create note
          </Badge>
          <Badge variant="secondary" className="text-xs cursor-pointer" onClick={() => setInput('Start voice recording')}>
            Voice record
          </Badge>
          <Badge variant="secondary" className="text-xs cursor-pointer" onClick={() => setInput('Show Epic templates')}>
            Epic templates
          </Badge>
          <Badge variant="secondary" className="text-xs cursor-pointer" onClick={() => setInput('Help')}>
            Help
          </Badge>
        </div>
      </div>
    </Card>
  );
}
