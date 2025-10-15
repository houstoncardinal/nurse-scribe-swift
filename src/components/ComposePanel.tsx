import { useState } from 'react';
import { FileText, Sparkles, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { type NoteTemplate, getAllTemplates } from '@/lib/templates';
import { composeNote, estimateTimeSaved, type ComposeResult } from '@/lib/compose';
import { toast } from 'sonner';

interface ComposePanelProps {
  redactedText: string;
  onComposeComplete: (result: ComposeResult) => void;
  isProcessing: boolean;
  setIsProcessing: (value: boolean) => void;
}

export function ComposePanel({
  redactedText,
  onComposeComplete,
  isProcessing,
  setIsProcessing,
}: ComposePanelProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<NoteTemplate>('SOAP');
  const [composeResult, setComposeResult] = useState<ComposeResult | null>(null);

  const templates = getAllTemplates();
  const hasApiKey = import.meta.env.VITE_OPENAI_API_KEY?.trim() !== '';

  const handleCompose = async () => {
    if (!redactedText || redactedText.trim().length === 0) {
      toast.error('No redacted text to compose');
      return;
    }

    setIsProcessing(true);
    
    try {
      const result = await composeNote(redactedText, selectedTemplate);
      setComposeResult(result);
      onComposeComplete(result);

      const timeSaved = estimateTimeSaved(redactedText.length, result.note.length);

      if (result.usedAI) {
        toast.success('Note generated with AI', {
          description: `~${timeSaved.toFixed(1)} minutes saved vs manual entry`,
        });
      } else {
        toast.info('Note generated with mock AI', {
          description: 'Add VITE_OPENAI_API_KEY for real AI composition',
        });
      }
    } catch (error) {
      console.error('Composition error:', error);
      toast.error('Failed to compose note', {
        description: error instanceof Error ? error.message : 'Unknown error',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const hasRedactedText = redactedText && redactedText.trim().length > 0;

  return (
    <Card className="p-6 shadow-medium border-border/50">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-secondary" />
            <h2 className="text-xl font-semibold">AI Compose</h2>
          </div>
          {!hasApiKey && (
            <Badge variant="outline" className="bg-muted border-muted-foreground/20 font-semibold shadow-soft">
              Mock Mode
            </Badge>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="template-select">Note Template</Label>
          <Select
            value={selectedTemplate}
            onValueChange={(value) => setSelectedTemplate(value as NoteTemplate)}
            disabled={isProcessing}
          >
            <SelectTrigger id="template-select" className="h-12">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {templates.map((template) => (
                <SelectItem key={template.name} value={template.name}>
                  <div>
                    <div className="font-medium">{template.displayName}</div>
                    <div className="text-xs text-muted-foreground">{template.description}</div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button
          size="lg"
          onClick={handleCompose}
          disabled={!hasRedactedText || isProcessing}
          className="w-full h-14 text-lg bg-gradient-secondary hover:opacity-90 shadow-medium font-semibold"
        >
          {isProcessing ? (
            <>
              <Sparkles className="mr-2 h-5 w-5 animate-spin" />
              Composing...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-5 w-5" />
              Compose Note
            </>
          )}
        </Button>

        {composeResult && (
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between p-3 bg-secondary/10 rounded-lg">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-secondary" />
                <span className="text-sm font-medium">
                  ~{estimateTimeSaved(redactedText.length, composeResult.note.length).toFixed(1)}{' '}
                  min saved
                </span>
              </div>
              <Badge variant="outline" className="bg-secondary/10 text-secondary border-secondary/20">
                {composeResult.template}
              </Badge>
            </div>

            <div className="p-4 bg-card border rounded-lg max-h-[400px] overflow-y-auto">
              <pre className="text-sm whitespace-pre-wrap font-sans">
                {composeResult.note}
              </pre>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
