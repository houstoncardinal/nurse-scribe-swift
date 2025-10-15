import { useState } from 'react';
import { Shield, CheckCircle, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { redactPHI, type RedactionResult } from '@/lib/redaction';
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
  const [redactionResult, setRedactionResult] = useState<RedactionResult | null>(null);

  const handleRedact = () => {
    if (!transcript || transcript.trim().length === 0) {
      toast.error('No transcript to redact');
      return;
    }

    const result = redactPHI(transcript, includeNames);
    setRedactionResult(result);
    onRedactionComplete(result.redactedText, result);

    if (result.redactionCount > 0) {
      toast.success(`Protected ${result.redactionCount} PHI element(s)`, {
        description: 'Your transcript is now safe to process',
      });
    } else {
      toast.info('No PHI detected in transcript', {
        description: 'Transcript appears clean',
      });
    }
  };

  const hasTranscript = transcript && transcript.trim().length > 0;

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">PHI Protection</h2>
          </div>
          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
            No-PHI Mode
          </Badge>
        </div>

        <p className="text-sm text-muted-foreground">
          All redaction happens locally in your browser. No data is sent to servers until after
          redaction.
        </p>

        <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
          <Label htmlFor="redact-names" className="text-sm cursor-pointer">
            Redact potential patient names
          </Label>
          <Switch
            id="redact-names"
            checked={includeNames}
            onCheckedChange={setIncludeNames}
            disabled={isProcessing}
          />
        </div>

        <Button
          size="lg"
          onClick={handleRedact}
          disabled={!hasTranscript || isProcessing}
          className="w-full h-14 text-lg"
          variant="default"
        >
          <Shield className="mr-2 h-5 w-5" />
          Redact PHI
        </Button>

        {redactionResult && (
          <div className="space-y-3 pt-2">
            <div
              className={`flex items-start gap-3 p-4 rounded-lg ${
                redactionResult.redactionCount > 0
                  ? 'bg-success/10 border border-success/20'
                  : 'bg-muted'
              }`}
            >
              {redactionResult.redactionCount > 0 ? (
                <CheckCircle className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
              )}
              <div className="flex-1">
                <h3 className="font-semibold mb-2">
                  {redactionResult.redactionCount > 0
                    ? `${redactionResult.redactionCount} PHI Elements Protected`
                    : 'No PHI Detected'}
                </h3>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {redactionResult.patterns.phones > 0 && (
                    <div className="flex justify-between">
                      <span>Phone Numbers:</span>
                      <span className="font-semibold">{redactionResult.patterns.phones}</span>
                    </div>
                  )}
                  {redactionResult.patterns.dates > 0 && (
                    <div className="flex justify-between">
                      <span>Dates:</span>
                      <span className="font-semibold">{redactionResult.patterns.dates}</span>
                    </div>
                  )}
                  {redactionResult.patterns.emails > 0 && (
                    <div className="flex justify-between">
                      <span>Emails:</span>
                      <span className="font-semibold">{redactionResult.patterns.emails}</span>
                    </div>
                  )}
                  {redactionResult.patterns.mrn > 0 && (
                    <div className="flex justify-between">
                      <span>MRN:</span>
                      <span className="font-semibold">{redactionResult.patterns.mrn}</span>
                    </div>
                  )}
                  {redactionResult.patterns.addresses > 0 && (
                    <div className="flex justify-between">
                      <span>Addresses:</span>
                      <span className="font-semibold">{redactionResult.patterns.addresses}</span>
                    </div>
                  )}
                  {redactionResult.patterns.names > 0 && (
                    <div className="flex justify-between">
                      <span>Names:</span>
                      <span className="font-semibold">{redactionResult.patterns.names}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="p-4 bg-muted rounded-lg max-h-[200px] overflow-y-auto">
              <p className="text-xs font-mono whitespace-pre-wrap">
                {redactionResult.redactedText}
              </p>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
