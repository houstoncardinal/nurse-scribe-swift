import React, { useState, useEffect, useRef } from 'react';
import { X, Minimize2, Mic, MicOff, Send, Sparkles, Volume2, VolumeX, Zap, Brain, Activity, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { conversationalAIService } from '@/lib/conversationalAIService';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

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
}

interface SyntheticAIProps {
  isMinimized: boolean;
  onToggleMinimize: () => void;
  onClose: () => void;
  onAction: (action: string, data: any) => void;
  currentContext?: {
    screen?: string;
    template?: string;
    hasTranscript?: boolean;
    hasNote?: boolean;
  };
}

export function SyntheticAI({
  isMinimized,
  onToggleMinimize,
  onClose,
  onAction,
  currentContext = {}
}: SyntheticAIProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [aiState, setAiState] = useState<'idle' | 'thinking' | 'speaking' | 'listening'>('idle');
  const scrollRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const [brainActivity, setBrainActivity] = useState(0);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  // Smart suggestions based on context and input
  const getSmartSuggestions = (inputText: string) => {
    const { screen, template, hasTranscript, hasNote } = currentContext;
    
    // Context-aware suggestions
    if (!inputText) {
      if (screen === 'home') {
        return [
          "Start voice recording",
          "Select a different template",
          "Show me documentation tips",
          "What's the best template for my case?"
        ];
      }
      if (screen === 'draft' && hasNote) {
        return [
          "Check this note for compliance",
          "Suggest ICD-10 codes",
          "Improve the assessment section",
          "Export this note"
        ];
      }
      if (hasTranscript) {
        return [
          "Generate a professional note",
          "Analyze this transcript",
          "Suggest improvements",
          "Check for medical terminology"
        ];
      }
      return [
        "Help me document a patient",
        "Explain SOAP format",
        "Show me shortcuts",
        "What can you do?"
      ];
    }
    
    // Input-based suggestions
    const lower = inputText.toLowerCase();
    if (lower.includes('help') || lower.includes('how')) {
      return [
        "How to use voice recording",
        "How to export notes",
        "How to check compliance",
        "How to use templates"
      ];
    }
    if (lower.includes('template')) {
      return [
        "Switch to SOAP template",
        "Switch to SBAR template",
        "Switch to PIE template",
        "Switch to DAR template"
      ];
    }
    if (lower.includes('export') || lower.includes('save')) {
      return [
        "Export as PDF",
        "Export to Epic",
        "Export as DOCX",
        "Copy to clipboard"
      ];
    }
    if (lower.includes('icd') || lower.includes('code')) {
      return [
        "Search ICD-10 codes",
        "Suggest diagnosis codes",
        "Show common codes",
        "Explain ICD-10 format"
      ];
    }
    
    return [];
  };

  // Update suggestions when input changes
  useEffect(() => {
    if (input.length > 0) {
      const newSuggestions = getSmartSuggestions(input);
      setSuggestions(newSuggestions);
      setShowSuggestions(newSuggestions.length > 0);
    } else {
      const contextSuggestions = getSmartSuggestions('');
      setSuggestions(contextSuggestions);
      setShowSuggestions(false);
    }
  }, [input, currentContext]);

  // Simulate brain activity
  useEffect(() => {
    const interval = setInterval(() => {
      setBrainActivity(prev => {
        if (isProcessing) return Math.min(100, prev + 10);
        if (isListening) return Math.min(80, prev + 5);
        return Math.max(0, prev - 5);
      });
    }, 100);
    return () => clearInterval(interval);
  }, [isProcessing, isListening]);

  // Initialize with context-aware greeting
  useEffect(() => {
    const greeting = getContextualGreeting();
    setMessages([{
      id: '1',
      role: 'assistant',
      content: greeting,
      timestamp: new Date()
    }]);
  }, []);

  const getContextualGreeting = () => {
    const { screen, template, hasTranscript, hasNote } = currentContext;
    
    if (hasNote) {
      return "I see you have a note in progress. I can help you refine it, check compliance, or export it. What would you like to do?";
    }
    if (hasTranscript) {
      return "I've analyzed your transcription. Ready to generate a professional note? I can also suggest ICD-10 codes or check for completeness.";
    }
    if (template) {
      return `You're working with the ${template} template. I'm monitoring your workflow and ready to assist with documentation, voice recording, or clinical insights.`;
    }
    return "Neural interface active. I'm your synthetic AI companion, deeply integrated with your workflow. I can see what you're doing and proactively assist. How can I help optimize your documentation?";
  };

  // Initialize voice recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        handleSendMessage(transcript);
        setIsListening(false);
        setAiState('idle');
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        setAiState('idle');
        toast.error('Voice recognition error');
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
        setAiState('idle');
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (text?: string) => {
    const messageText = text || input.trim();
    if (!messageText || isProcessing) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: messageText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
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
      // Update context
      conversationalAIService.updateContext({
        currentTemplate: currentContext.template,
        currentNote: currentContext.hasNote ? 'in-progress' : undefined,
        transcription: currentContext.hasTranscript ? 'available' : undefined
      });

      const response = await conversationalAIService.processInput(messageText);

      // Remove thinking indicator
      setMessages(prev => prev.filter(m => !m.thinking));

      const assistantMessage: Message = {
        id: (Date.now() + 2).toString(),
        role: 'assistant',
        content: response.message,
        timestamp: new Date(),
        actions: response.actions
      };

      setMessages(prev => [...prev, assistantMessage]);

      // Speak response
      if (voiceEnabled && conversationalAIService.isVoiceAvailable()) {
        setIsSpeaking(true);
        setAiState('speaking');
        await conversationalAIService.speakResponse(response.message);
        setIsSpeaking(false);
        setAiState('idle');
      }

      // Auto-execute
      if (response.autoExecute) {
        setTimeout(() => {
          onAction(response.autoExecute!.action, response.autoExecute!.data);
        }, 500);
      }
    } catch (error) {
      console.error('AI processing error:', error);
      setMessages(prev => prev.filter(m => !m.thinking));
      toast.error('Neural processing error');
    } finally {
      setIsProcessing(false);
      setAiState('idle');
    }
  };

  const handleVoiceInput = () => {
    if (!recognitionRef.current) {
      toast.error('Voice interface not available');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
      setAiState('idle');
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
        setAiState('listening');
        toast.info('🎤 Neural interface listening...');
      } catch (error) {
        console.error('Failed to start voice recognition:', error);
        toast.error('Voice interface error');
      }
    }
  };

  const handleActionClick = (action: any) => {
    onAction(action.type, action.data);
    toast.success(`Executing: ${action.label}`);
  };

  if (isMinimized) {
    // Mobile: vertical right side widget
    if (isMobile) {
      return (
        <div className="fixed right-0 top-1/2 -translate-y-1/2 z-[9999]">
          <div className="relative">
            {/* Close button */}
            <Button
              onClick={onClose}
              className="absolute -top-3 -left-3 h-8 w-8 rounded-full bg-white border-2 border-slate-200 shadow-lg hover:bg-red-50 hover:border-red-200 transition-all duration-200 z-10"
            >
              <X className="h-4 w-4 text-slate-600 hover:text-red-600" />
            </Button>

            {/* Main widget button */}
            <Button
              onClick={onToggleMinimize}
              className="relative h-36 w-14 rounded-l-2xl overflow-hidden group flex flex-col items-center justify-center gap-2 shadow-2xl transition-all duration-300 hover:scale-105"
              style={{
                background: 'linear-gradient(180deg, #14b8a6 0%, #0891b2 50%, #06b6d4 100%)',
                boxShadow: '-6px 0 25px rgba(20, 184, 166, 0.5), 0 4px 20px rgba(0, 0, 0, 0.1)'
              }}
            >
              {/* Subtle animated background */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent animate-pulse" />
              </div>

              {/* Center icon with glow */}
              <div className="relative">
                <Brain className="h-7 w-7 text-white animate-pulse" />
                <div className="absolute inset-0 bg-white/20 rounded-full blur-sm animate-pulse" />
              </div>

              {/* Clean vertical text */}
              <div className="text-white text-xs font-semibold tracking-wide text-center leading-tight">
                <div>Nova</div>
                <div>Care</div>
                <div>AI</div>
              </div>

              {/* Status indicator */}
              <div className="absolute top-3 left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-green-400 rounded-full shadow-lg">
                <div className="absolute inset-0 bg-green-400 rounded-full animate-ping opacity-75" />
              </div>

              {/* Activity indicator */}
              {isProcessing && (
                <div className="absolute inset-0 bg-white/10 animate-pulse rounded-l-2xl" />
              )}

              {/* Hover effect */}
              <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-l-2xl" />
            </Button>
          </div>
        </div>
      );
    }
    
    // Desktop: smaller bottom-right button
    return (
      <div className="fixed bottom-6 right-6 z-[9999]">
        <Button
          onClick={onToggleMinimize}
          className="relative h-14 w-14 rounded-full overflow-hidden group"
          style={{
            background: 'linear-gradient(135deg, #14b8a6 0%, #0891b2 50%, #06b6d4 100%)',
            boxShadow: '0 0 40px rgba(20, 184, 166, 0.6), 0 0 80px rgba(8, 145, 178, 0.4)'
          }}
        >
          {/* Animated rings */}
          <div className="absolute inset-0 animate-ping opacity-20">
            <div className="absolute inset-2 rounded-full border-2 border-white" />
          </div>
          <div className="absolute inset-0 animate-pulse">
            <div className="absolute inset-4 rounded-full border border-white/50" />
          </div>
          
          {/* Neural network effect */}
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-white rounded-full animate-pulse" />
            <div className="absolute top-1/3 right-1/4 w-1 h-1 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
            <div className="absolute bottom-1/3 left-1/3 w-1 h-1 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
            <div className="absolute bottom-1/4 right-1/3 w-1 h-1 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.6s' }} />
          </div>
          
          {/* Center icon */}
          <Brain className="relative h-6 w-6 text-white animate-pulse" />
          
          {/* Status indicator */}
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white shadow-lg">
            <div className="absolute inset-0 bg-green-400 rounded-full animate-ping" />
          </div>
          
          {/* Activity indicator */}
          {isProcessing && (
            <div className="absolute inset-0 bg-white/20 animate-pulse" />
          )}
        </Button>
      </div>
    );
  }

  return (
    <div className={cn(
      "fixed z-[9999]",
      isMobile 
        ? "inset-x-4 bottom-20 top-20" 
        : "bottom-6 right-6 w-[480px] max-w-[calc(100vw-3rem)]"
    )}>
      <div 
        className="relative rounded-3xl overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(248, 250, 252, 0.98) 100%)',
          backdropFilter: 'blur(40px)',
          border: '1px solid rgba(20, 184, 166, 0.2)',
          boxShadow: '0 0 60px rgba(20, 184, 166, 0.3), 0 20px 80px rgba(0, 0, 0, 0.1)'
        }}
      >
        {/* Animated background */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute inset-0" style={{
            background: 'radial-gradient(circle at 20% 50%, rgba(20, 184, 166, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(8, 145, 178, 0.3) 0%, transparent 50%)',
            animation: 'pulse 4s ease-in-out infinite'
          }} />
        </div>

        {/* Header */}
        <div className="relative p-4 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* AI Avatar */}
              <div className="relative">
                <div 
                  className="w-12 h-12 rounded-2xl flex items-center justify-center relative overflow-hidden"
                  style={{
                    background: 'linear-gradient(135deg, #14b8a6 0%, #0891b2 100%)',
                    boxShadow: '0 0 30px rgba(20, 184, 166, 0.5)'
                  }}
                >
                  {/* Neural network animation */}
                  <div className="absolute inset-0 opacity-30">
                    {[...Array(8)].map((_, i) => (
                      <div
                        key={i}
                        className="absolute w-px h-full bg-white origin-center"
                        style={{
                          left: '50%',
                          transform: `rotate(${i * 45}deg)`,
                          animation: `pulse 2s ease-in-out infinite ${i * 0.2}s`
                        }}
                      />
                    ))}
                  </div>
                  
                  <Eye className="relative h-6 w-6 text-white animate-pulse" />
                  
                  {/* Activity ring */}
                  <div 
                    className="absolute inset-0 rounded-2xl border-2 border-white/50"
                    style={{
                      animation: 'spin 8s linear infinite'
                    }}
                  />
                </div>
                
                {/* Status pulse */}
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-slate-900">
                  <div className="absolute inset-0 bg-green-400 rounded-full animate-ping" />
                </div>
              </div>
              
              <div>
                <h3 className="text-slate-900 font-bold text-xl flex items-center gap-2">
                  Raha AI
                  <Activity className="h-4 w-4 text-teal-500 animate-pulse" />
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex items-center gap-1">
                    <div className="w-1 h-1 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-xs text-slate-600">
                      {aiState === 'thinking' && 'Neural processing...'}
                      {aiState === 'listening' && 'Voice interface active'}
                      {aiState === 'speaking' && 'Synthesizing speech...'}
                      {aiState === 'idle' && 'Monitoring workflow'}
                    </span>
                  </div>
                  
                  {/* Brain activity indicator */}
                  <div className="flex items-center gap-1">
                    <Brain className="h-3 w-3 text-teal-500" />
                    <div className="w-16 h-1 bg-slate-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-teal-500 to-blue-600 transition-all duration-300"
                        style={{ width: `${brainActivity}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setVoiceEnabled(!voiceEnabled)}
                className="h-9 w-9 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all"
              >
                {voiceEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={onToggleMinimize}
                className="h-9 w-9 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all"
              >
                <Minimize2 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="h-9 w-9 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Messages */}
        <ScrollArea className="h-[320px] p-4" ref={scrollRef}>
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div
                key={message.id}
                className={cn(
                  "flex gap-3 animate-in fade-in slide-in-from-bottom-2",
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                )}
                style={{ animationDelay: `${index * 50}ms`, animationDuration: '400ms' }}
              >
                {message.role === 'assistant' && !message.thinking && (
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-teal-500 to-blue-600 flex items-center justify-center shadow-lg flex-shrink-0">
                    <Sparkles className="h-4 w-4 text-white" />
                  </div>
                )}
                
                <div
                  className={cn(
                    "max-w-[80%] rounded-2xl p-4 shadow-lg transition-all",
                    message.role === 'user'
                      ? 'bg-gradient-to-br from-teal-500 to-blue-600 text-white'
                      : message.thinking
                      ? 'bg-slate-100 border border-slate-200'
                      : 'bg-white border border-slate-200 text-slate-900'
                  )}
                >
                  {message.thinking ? (
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-teal-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="w-2 h-2 bg-teal-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <div className="w-2 h-2 bg-teal-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                      <span className="text-xs text-slate-600">Processing neural patterns...</span>
                    </div>
                  ) : (
                    <>
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">
                        {message.content}
                      </p>
                      {message.actions && message.actions.length > 0 && (
                        <div className="mt-3 space-y-2">
                          {message.actions.map((action, idx) => (
                            <Button
                              key={idx}
                              size="sm"
                              onClick={() => handleActionClick(action)}
                              className="w-full justify-start text-xs bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 text-white border-0 shadow-lg"
                            >
                              <Zap className="h-3 w-3 mr-2" />
                              {action.label}
                            </Button>
                          ))}
                        </div>
                      )}
                      <p className="text-xs opacity-50 mt-2">
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Smart Suggestions */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="px-6 pb-3">
            <div className="bg-gradient-to-r from-teal-50 to-blue-50 rounded-2xl p-4 border border-teal-200 shadow-lg">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="h-4 w-4 text-teal-600" />
                <span className="text-xs font-semibold text-teal-900">Smart Suggestions</span>
              </div>
              <div className="space-y-2">
                {suggestions.map((suggestion, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setInput(suggestion);
                      setShowSuggestions(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl bg-white hover:bg-teal-50 border border-slate-200 hover:border-teal-300 transition-all text-sm text-slate-700 hover:text-teal-900 shadow-sm hover:shadow-md"
                  >
                    <div className="flex items-center gap-2">
                      <Zap className="h-3 w-3 text-teal-500" />
                      {suggestion}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions (when no input) */}
        {!input && !showSuggestions && suggestions.length > 0 && (
          <div className="px-6 pb-3">
            <div className="bg-gradient-to-r from-slate-50 to-slate-100 rounded-2xl p-4 border border-slate-200">
              <div className="flex items-center gap-2 mb-3">
                <Brain className="h-4 w-4 text-slate-600" />
                <span className="text-xs font-semibold text-slate-900">Quick Actions</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {suggestions.slice(0, 4).map((suggestion, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(suggestion)}
                    className="px-3 py-2 rounded-xl bg-white hover:bg-gradient-to-r hover:from-teal-500 hover:to-blue-600 border border-slate-200 hover:border-transparent transition-all text-xs text-slate-700 hover:text-white shadow-sm hover:shadow-lg group"
                  >
                    <div className="flex items-center gap-2">
                      <Zap className="h-3 w-3 text-slate-400 group-hover:text-white" />
                      <span className="truncate">{suggestion}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Input */}
        <div className="p-6 border-t border-slate-200">
          <div className="flex gap-3">
            <Button
              size="icon"
              onClick={handleVoiceInput}
              disabled={isProcessing}
              className={cn(
                "h-12 w-12 rounded-xl shadow-lg transition-all",
                isListening
                  ? 'bg-gradient-to-br from-red-500 to-pink-600 animate-pulse'
                  : 'bg-gradient-to-br from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700'
              )}
              style={{
                boxShadow: isListening ? '0 0 30px rgba(239, 68, 68, 0.6)' : '0 0 20px rgba(20, 184, 166, 0.4)'
              }}
            >
              {isListening ? <MicOff className="h-5 w-5 text-white" /> : <Mic className="h-5 w-5 text-white" />}
            </Button>
            
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Ask me anything..."
              disabled={isProcessing || isListening}
              className="flex-1 h-12 bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
            
            <Button
              size="icon"
              onClick={() => handleSendMessage()}
              disabled={!input.trim() || isProcessing || isListening}
              className="h-12 w-12 rounded-xl bg-gradient-to-br from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 text-white shadow-lg"
              style={{
                boxShadow: '0 0 20px rgba(20, 184, 166, 0.4)'
              }}
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
          
          <p className="text-xs text-slate-600 mt-3 text-center">
            {isListening ? '🎤 Listening... Speak naturally' : 'Voice or text - HIPAA compliant & encrypted'}
          </p>
        </div>
      </div>
    </div>
  );
}
