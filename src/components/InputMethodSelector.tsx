import { useState } from 'react';
import { Mic, Keyboard, FileText, Upload, Zap, Shield, Clock, Lightbulb, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { getTemplatePlaceholder, getTemplateExample, getTemplateTooltip } from '@/lib/templatePlaceholders';
import { Separator } from '@/components/ui/separator';

interface InputMethodSelectorProps {
  onMethodSelect: (method: 'voice' | 'manual' | 'paste') => void;
  onManualTextSubmit: (text: string) => void;
  onPasteTextSubmit: (text: string) => void;
  isProcessing?: boolean;
  selectedTemplate?: string;
}

export function InputMethodSelector({
  onMethodSelect,
  onManualTextSubmit,
  onPasteTextSubmit,
  isProcessing = false,
  selectedTemplate = 'SOAP'
}: InputMethodSelectorProps) {
  const [selectedMethod, setSelectedMethod] = useState<'voice' | 'manual' | 'paste' | null>(null);
  const [manualText, setManualText] = useState('');
  const [pasteText, setPasteText] = useState('');

  const handleFillExample = () => {
    const example = getTemplateExample(selectedTemplate);
    if (selectedMethod === 'manual') {
      setManualText(example);
    } else if (selectedMethod === 'paste') {
      setPasteText(example);
    }
  };

  const handleMethodSelect = (method: 'voice' | 'manual' | 'paste') => {
    console.log('🎤 Method selected:', method);
    setSelectedMethod(method);
    if (method === 'voice') {
      console.log('🎤 Calling onMethodSelect for voice');
      onMethodSelect(method);
    }
  };

  const handleManualSubmit = () => {
    if (manualText.trim()) {
      onManualTextSubmit(manualText.trim());
      setManualText('');
      setSelectedMethod(null);
    }
  };

  const handlePasteSubmit = () => {
    if (pasteText.trim()) {
      onPasteTextSubmit(pasteText.trim());
      setPasteText('');
      setSelectedMethod(null);
    }
  };

  const handlePasteFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setPasteText(text);
    } catch (error) {
      console.error('Failed to read clipboard:', error);
    }
  };

  const inputMethods = [
    {
      id: 'voice',
      title: 'Voice Dictation',
      description: 'Speak naturally and let AI transcribe',
      icon: Mic,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50 dark:bg-blue-950/20',
      borderColor: 'border-blue-200 dark:border-blue-800',
      textColor: 'text-blue-700 dark:text-blue-300',
      benefits: ['Hands-free operation', 'Natural speech patterns', 'Fast documentation'],
      timeEstimate: '30-60 seconds',
      accuracy: '99%'
    },
    {
      id: 'manual',
      title: 'Manual Typing',
      description: 'Type your notes directly',
      icon: Keyboard,
      color: 'from-emerald-500 to-teal-500',
      bgColor: 'bg-emerald-50 dark:bg-emerald-950/20',
      borderColor: 'border-emerald-200 dark:border-emerald-800',
      textColor: 'text-emerald-700 dark:text-emerald-300',
      benefits: ['Full control', 'Precise wording', 'Offline capable'],
      timeEstimate: '2-5 minutes',
      accuracy: '100%'
    },
    {
      id: 'paste',
      title: 'Paste from EHR',
      description: 'Copy and paste existing notes',
      icon: FileText,
      color: 'from-purple-500 to-violet-500',
      bgColor: 'bg-purple-50 dark:bg-purple-950/20',
      borderColor: 'border-purple-200 dark:border-purple-800',
      textColor: 'text-purple-700 dark:text-purple-300',
      benefits: ['Quick import', 'Format existing notes', 'Bulk processing'],
      timeEstimate: '10-30 seconds',
      accuracy: '100%'
    }
  ];

  if (selectedMethod === 'manual') {
    return (
      <TooltipProvider>
        <Card className="p-6 border-0 shadow-2xl bg-gradient-to-br from-white via-slate-50 to-white dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg">
                <Keyboard className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold">Manual Typing</h3>
                <p className="text-sm text-muted-foreground">Type your nursing notes directly</p>
              </div>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Info className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p className="text-sm">{getTemplateTooltip(selectedTemplate)}</p>
                </TooltipContent>
              </Tooltip>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="manual-text" className="text-sm font-medium">
                  Enter your notes below:
                </Label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleFillExample}
                  className="h-8 text-xs gap-1.5"
                >
                  <Lightbulb className="h-3.5 w-3.5" />
                  🧠 Example
                </Button>
              </div>
              <Textarea
                id="manual-text"
                value={manualText}
                onChange={(e) => setManualText(e.target.value)}
                placeholder={getTemplatePlaceholder(selectedTemplate)}
                className="min-h-[200px] resize-none border-2 focus:border-emerald-300 dark:focus:border-emerald-600 font-mono text-sm"
              />
              
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{manualText.length} characters</span>
                <span>{manualText.split(' ').filter(w => w.length > 0).length} words</span>
              </div>
            </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setSelectedMethod(null)}
              className="flex-1"
            >
              Back
            </Button>
            <Button
              onClick={handleManualSubmit}
              disabled={!manualText.trim() || isProcessing}
              className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Processing...
                </>
              ) : (
                <>
                  <Zap className="h-4 w-4 mr-2" />
                  Process Note
                </>
              )}
            </Button>
          </div>
          </div>
        </Card>
      </TooltipProvider>
    );
  }

  if (selectedMethod === 'paste') {
    return (
      <TooltipProvider>
        <Card className="p-6 border-0 shadow-2xl bg-gradient-to-br from-white via-slate-50 to-white dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-violet-500 rounded-xl flex items-center justify-center shadow-lg">
                <FileText className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold">Paste from EHR</h3>
                <p className="text-sm text-muted-foreground">Import existing notes for formatting</p>
              </div>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Info className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p className="text-sm">{getTemplateTooltip(selectedTemplate)}</p>
                </TooltipContent>
              </Tooltip>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="paste-text" className="text-sm font-medium">
                  Paste your notes below:
                </Label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleFillExample}
                  className="h-8 text-xs gap-1.5"
                >
                  <Lightbulb className="h-3.5 w-3.5" />
                  🧠 Example
                </Button>
              </div>
              <Textarea
                id="paste-text"
                value={pasteText}
                onChange={(e) => setPasteText(e.target.value)}
                placeholder={getTemplatePlaceholder(selectedTemplate)}
                className="min-h-[200px] resize-none border-2 focus:border-purple-300 dark:focus:border-purple-600 font-mono text-sm"
              />
              
              <Button
                variant="outline"
                onClick={handlePasteFromClipboard}
                className="w-full"
              >
                <Upload className="h-4 w-4 mr-2" />
                Paste from Clipboard
              </Button>
              
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{pasteText.length} characters</span>
                <span>{pasteText.split(' ').filter(w => w.length > 0).length} words</span>
              </div>
            </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setSelectedMethod(null)}
              className="flex-1"
            >
              Back
            </Button>
            <Button
              onClick={handlePasteSubmit}
              disabled={!pasteText.trim() || isProcessing}
              className="flex-1 bg-gradient-to-r from-purple-500 to-violet-500 hover:from-purple-600 hover:to-violet-600"
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Processing...
                </>
              ) : (
                <>
                  <Zap className="h-4 w-4 mr-2" />
                  Format Note
                </>
              )}
            </Button>
          </div>
          </div>
        </Card>
      </TooltipProvider>
    );
  }

  return (
    <div className="space-y-6 max-h-[75vh] overflow-y-auto pb-20">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-r from-slate-600 to-slate-800 rounded-xl flex items-center justify-center shadow-lg">
            <Zap className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Choose Input Method</h2>
            <p className="text-sm text-muted-foreground">Select how you'd like to create your note</p>
          </div>
        </div>
      </div>

      {/* Input Methods Grid */}
      <div className="grid gap-4">
        {inputMethods.map((method) => {
          const Icon = method.icon;
          return (
            <Card
              key={method.id}
              className={`p-4 lg:p-6 cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-xl border-2 hover:shadow-${method.color.split('-')[1]}-200/50 ${method.bgColor} ${method.borderColor}`}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('🎤 Input method card clicked:', method.id);
                handleMethodSelect(method.id as any);
              }}
            >
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 bg-gradient-to-r ${method.color} rounded-xl flex items-center justify-center shadow-lg flex-shrink-0`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold">{method.title}</h3>
                      <Badge variant="outline" className={`${method.textColor} border-current`}>
                        {method.accuracy} accurate
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{method.description}</p>
                    
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {method.timeEstimate}
                      </div>
                      <div className="flex items-center gap-1">
                        <Shield className="h-3 w-3" />
                        HIPAA Secure
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-xs lg:text-sm font-medium">Benefits:</h4>
                  <div className="flex flex-wrap gap-1 lg:gap-2">
                    {method.benefits.map((benefit, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className={`text-xs ${method.textColor} bg-white/50 dark:bg-black/20`}
                      >
                        {benefit}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Footer Info */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <Shield className="h-3 w-3" />
          <span>All data processed locally • HIPAA compliant • No PHI stored</span>
        </div>
        <p className="text-xs text-muted-foreground">
          Choose the method that works best for your workflow
        </p>
      </div>
    </div>
  );
}
