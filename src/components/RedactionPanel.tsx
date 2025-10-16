import { useState } from 'react';
import { Shield, CheckCircle, AlertTriangle, Brain, Eye, EyeOff, Settings, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { advancedPHIRedactor, type RedactionResult } from '@/lib/advancedRedaction';
import { toast } from 'sonner';

interface RedactionPanelProps {
  transcript: string;
  onRedactionComplete: (redactedText: string, result: RedactionResult) => void;
  isProcessing: boolean;
}

export function RedactionPanel({
  transcript,
  onRedactionComplete,
  isProcessing,
}: RedactionPanelProps) {
  const [includeNames, setIncludeNames] = useState(true);
  const [useLLM, setUseLLM] = useState(true);
  const [showOriginal, setShowOriginal] = useState(false);
  const [redactionResult, setRedactionResult] = useState<RedactionResult | null>(null);
  const [isRedacting, setIsRedacting] = useState(false);

  const handleRedact = async () => {
    if (!transcript || transcript.trim().length === 0) {
      toast.error('No transcript to redact');
      return;
    }

    setIsRedacting(true);
    
    try {
      const result = await advancedPHIRedactor.redactPHI(transcript, useLLM);
      setRedactionResult(result);
      onRedactionComplete(result.redactedText, result);

      if (result.redactionCount > 0) {
        toast.success(`Protected ${result.redactionCount} PHI element(s)`, {
          description: `Confidence: ${(result.confidence * 100).toFixed(1)}%`,
        });
      } else {
        toast.info('No PHI detected in transcript', {
          description: 'Transcript appears clean',
        });
      }
    } catch (error) {
      console.error('Redaction failed:', error);
      toast.error('Redaction failed', {
        description: error instanceof Error ? error.message : 'Unknown error',
      });
    } finally {
      setIsRedacting(false);
    }
  };

  const hasTranscript = transcript && transcript.trim().length > 0;

  return (
    <Card className="card-premium p-6 animate-fade-in">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center shadow-lg">
              <Shield className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">PHI Protection</h2>
              <p className="text-sm text-muted-foreground">Advanced AI-powered privacy protection</p>
            </div>
          </div>
          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 font-semibold">
            HIPAA Ready
          </Badge>
        </div>

        {/* Settings */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Redaction Settings</Label>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg border border-border/30">
              <Label htmlFor="redact-names" className="text-sm cursor-pointer">
                Redact Names
              </Label>
              <Switch
                id="redact-names"
                checked={includeNames}
                onCheckedChange={setIncludeNames}
                disabled={isProcessing || isRedacting}
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg border border-border/30">
              <Label htmlFor="use-llm" className="text-sm cursor-pointer flex items-center gap-2">
                <Brain className="h-4 w-4" />
                AI Enhancement
              </Label>
              <Switch
                id="use-llm"
                checked={useLLM}
                onCheckedChange={setUseLLM}
                disabled={isProcessing || isRedacting}
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Redaction Button */}
        <Button
          size="lg"
          onClick={handleRedact}
          disabled={!hasTranscript || isProcessing || isRedacting}
          className="w-full h-14 text-lg font-semibold"
          variant="default"
        >
          {isRedacting ? (
            <>
              <div className="spinner-premium h-5 w-5 mr-2" />
              Processing...
            </>
          ) : (
            <>
              <Shield className="mr-2 h-5 w-5" />
              Redact PHI
            </>
          )}
        </Button>

        {/* Results */}
        {redactionResult && (
          <div className="space-y-4">
            <Tabs defaultValue="summary" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="summary">Summary</TabsTrigger>
                <TabsTrigger value="text">Redacted Text</TabsTrigger>
                <TabsTrigger value="audit">Audit Trail</TabsTrigger>
              </TabsList>
              
              <TabsContent value="summary" className="space-y-3">
                <div className={`p-4 rounded-lg ${
                  redactionResult.redactionCount > 0
                    ? 'bg-success/10 border border-success/20'
                    : 'bg-muted/50'
                }`}>
                  <div className="flex items-center gap-3 mb-3">
                    {redactionResult.redactionCount > 0 ? (
                      <CheckCircle className="h-6 w-6 text-success" />
                    ) : (
                      <AlertTriangle className="h-6 w-6 text-muted-foreground" />
                    )}
                    <div>
                      <h3 className="font-semibold">
                        {redactionResult.redactionCount > 0
                          ? `${redactionResult.redactionCount} PHI Elements Protected`
                          : 'No PHI Detected'}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Confidence: {(redactionResult.confidence * 100).toFixed(1)}%
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    {Object.entries(redactionResult.patterns).map(([key, count]) => {
                      if (count === 0) return null;
                      return (
                        <div key={key} className="flex justify-between">
                          <span className="capitalize">{key}:</span>
                          <span className="font-semibold">{count}</span>
                        </div>
                      );
                    })}
                  </div>
                  
                  {redactionResult.suggestions.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-border/30">
                      <h4 className="text-sm font-medium mb-2">AI Suggestions</h4>
                      <div className="space-y-1">
                        {redactionResult.suggestions.slice(0, 3).map((suggestion, index) => (
                          <div key={index} className="text-xs p-2 bg-muted/30 rounded">
                            <span className="font-medium">{suggestion.type}:</span> {suggestion.reason}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="text" className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">Redacted Text</Label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowOriginal(!showOriginal)}
                  >
                    {showOriginal ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    {showOriginal ? 'Hide Original' : 'Show Original'}
                  </Button>
                </div>
                
                <div className="p-4 bg-muted/50 rounded-lg max-h-[300px] overflow-y-auto border border-border/30">
                  <p className="text-sm leading-relaxed whitespace-pre-wrap font-mono">
                    {showOriginal ? transcript : redactionResult.redactedText}
                  </p>
                </div>
              </TabsContent>
              
              <TabsContent value="audit" className="space-y-3">
                <Label className="text-sm font-medium">Audit Trail</Label>
                <div className="space-y-2 max-h-[300px] overflow-y-auto">
                  {redactionResult.auditTrail.map((entry, index) => (
                    <div key={index} className="p-3 bg-muted/30 rounded-lg border border-border/20">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium capitalize">{entry.type}</span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(entry.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      <div className="text-xs">
                        <div className="flex justify-between">
                          <span>Original:</span>
                          <span className="font-mono">{entry.original}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Redacted:</span>
                          <span className="font-mono">{entry.redacted}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Confidence:</span>
                          <span>{(entry.confidence * 100).toFixed(1)}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
    </Card>
  );
}
