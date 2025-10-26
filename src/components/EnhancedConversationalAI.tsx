import React, { useState, useEffect, useRef } from 'react';
import { X, Minimize2, Maximize2, Mic, MicOff, Send, Sparkles, Volume2, VolumeX, User, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
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
}

interface EnhancedConversationalAIProps {
  isMinimized: boolean;
  onToggleMinimize: () => void;
  onClose: () => void;
  onAction: (action: string, data: any) => void;
}

export function EnhancedConversationalAI({
  isMinimized,
  onToggleMinimize,
  onClose,
  onAction
}: EnhancedConversationalAIProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "👋 Hi! I'm your AI assistant. I can help you with documentation, voice recording, templates, and more. Try saying 'help' or ask me anything!",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

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
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        toast.error('Voice recognition error. Please try again.');
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

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (text?: string) => {
    const messageText = text || input.trim();
    if (!messageText || isProcessing) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: messageText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsProcessing(true);

    try {
      // Get AI response
      const response = await conversationalAIService.processInput(messageText);

      // Add assistant message
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.message,
        timestamp: new Date(),
        actions: response.actions
      };

      setMessages(prev => [...prev, assistantMessage]);

      // Speak response if voice is enabled
      if (voiceEnabled && conversationalAIService.isVoiceAvailable()) {
        setIsSpeaking(true);
        await conversationalAIService.speakResponse(response.message);
        setIsSpeaking(false);
      }

      // Auto-execute action if specified
      if (response.autoExecute) {
        setTimeout(() => {
          onAction(response.autoExecute!.action, response.autoExecute!.data);
        }, 500);
      }
    } catch (error) {
      console.error('AI processing error:', error);
      toast.error('Failed to process message');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleVoiceInput = () => {
    if (!recognitionRef.current) {
      toast.error('Voice recognition not supported in this browser');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
        toast.info('🎤 Listening... Speak now');
      } catch (error) {
        console.error('Failed to start voice recognition:', error);
        toast.error('Failed to start voice recognition');
      }
    }
  };

  const handleActionClick = (action: any) => {
    onAction(action.type, action.data);
    toast.success(`Action: ${action.label}`);
  };

  if (isMinimized) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={onToggleMinimize}
          className="h-16 w-16 rounded-full shadow-premium-xl hover-lift glow-purple btn-premium gradient-premium-purple relative overflow-hidden group"
        >
          <Sparkles className="h-6 w-6 text-white animate-pulse-glow" />
          {isProcessing && (
            <div className="absolute inset-0 bg-white/20 animate-shimmer" />
          )}
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse-glow" />
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-[420px] max-w-[calc(100vw-3rem)]">
      <div className="card-premium shadow-premium-xl hover-lift glass-premium border-premium rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="gradient-premium-purple p-4 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 animate-shimmer" />
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-premium animate-float">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-white font-bold text-lg flex items-center gap-2">
                  AI Assistant
                  <Badge className="bg-white/20 text-white border-white/30 text-xs badge-premium">
                    Live
                  </Badge>
                </h3>
                <p className="text-white/80 text-xs">
                  {isProcessing ? 'Thinking...' : isListening ? 'Listening...' : isSpeaking ? 'Speaking...' : 'Ready to help'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setVoiceEnabled(!voiceEnabled)}
                className="h-8 w-8 text-white hover:bg-white/20 rounded-full transition-all hover-scale"
                title={voiceEnabled ? 'Disable voice' : 'Enable voice'}
              >
                {voiceEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={onToggleMinimize}
                className="h-8 w-8 text-white hover:bg-white/20 rounded-full transition-all hover-scale"
              >
                <Minimize2 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="h-8 w-8 text-white hover:bg-white/20 rounded-full transition-all hover-scale"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Messages */}
        <ScrollArea className="h-[400px] p-4 bg-gradient-to-br from-slate-50 to-white scrollbar-premium" ref={scrollRef}>
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div
                key={message.id}
                className={cn(
                  "flex gap-3 animate-fade-in",
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                )}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {message.role === 'assistant' && (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-premium flex-shrink-0 animate-float">
                    <Bot className="h-4 w-4 text-white" />
                  </div>
                )}
                <div
                  className={cn(
                    "max-w-[80%] rounded-2xl p-3 shadow-premium hover-lift transition-all",
                    message.role === 'user'
                      ? 'bg-gradient-to-br from-teal-500 to-blue-600 text-white'
                      : 'bg-white border border-slate-200'
                  )}
                >
                  <p className={cn(
                    "text-sm leading-relaxed",
                    message.role === 'user' ? 'text-white' : 'text-slate-800'
                  )}>
                    {message.content}
                  </p>
                  {message.actions && message.actions.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {message.actions.map((action, idx) => (
                        <Button
                          key={idx}
                          size="sm"
                          variant="outline"
                          onClick={() => handleActionClick(action)}
                          className="w-full justify-start text-xs btn-premium hover-glow"
                        >
                          <Sparkles className="h-3 w-3 mr-2" />
                          {action.label}
                        </Button>
                      ))}
                    </div>
                  )}
                  <p className="text-xs opacity-60 mt-2">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                {message.role === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-500 to-blue-600 flex items-center justify-center shadow-premium flex-shrink-0">
                    <User className="h-4 w-4 text-white" />
                  </div>
                )}
              </div>
            ))}
            {isProcessing && (
              <div className="flex gap-3 justify-start animate-fade-in">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-premium animate-pulse-glow">
                  <Bot className="h-4 w-4 text-white" />
                </div>
                <div className="bg-white border border-slate-200 rounded-2xl p-3 shadow-premium">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Input */}
        <div className="p-4 bg-white border-t border-slate-200">
          <div className="flex gap-2">
            <Button
              size="icon"
              onClick={handleVoiceInput}
              disabled={isProcessing}
              className={cn(
                "h-10 w-10 rounded-full shadow-premium transition-all hover-scale",
                isListening
                  ? 'bg-gradient-to-br from-red-500 to-pink-600 text-white animate-pulse-glow'
                  : 'bg-gradient-to-br from-purple-500 to-pink-500 text-white hover-glow'
              )}
            >
              {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </Button>
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Type or speak your message..."
              disabled={isProcessing || isListening}
              className="flex-1 input-premium focus-premium"
            />
            <Button
              size="icon"
              onClick={() => handleSendMessage()}
              disabled={!input.trim() || isProcessing || isListening}
              className="h-10 w-10 rounded-full bg-gradient-to-br from-teal-500 to-blue-600 text-white shadow-premium hover-glow hover-scale"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-slate-500 mt-2 text-center">
            {isListening ? '🎤 Listening... Speak now' : 'Press mic to speak or type your message'}
          </p>
        </div>
      </div>
    </div>
  );
}
