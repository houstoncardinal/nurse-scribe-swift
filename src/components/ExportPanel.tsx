import { Copy, Download, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { type ComposeResult } from '@/lib/compose';
import { type RedactionResult } from '@/lib/redaction';
import {
  copyToClipboard,
  downloadAsText,
  downloadAsPDF,
  generateFilename,
  type ExportMetadata,
} from '@/lib/exports';
import { toast } from 'sonner';

interface ExportPanelProps {
  composeResult: ComposeResult | null;
  redactionResult: RedactionResult | null;
}

export function ExportPanel({ composeResult, redactionResult }: ExportPanelProps) {
  const hasNote = composeResult?.note && composeResult.note.trim().length > 0;

  const getMetadata = (): ExportMetadata => ({
    template: composeResult?.template || 'Unknown',
    timestamp: new Date().toLocaleString(),
    redactionCount: redactionResult?.redactionCount,
  });

  const handleCopyToClipboard = async () => {
    if (!composeResult?.note) return;

    const success = await copyToClipboard(composeResult.note);
    if (success) {
      toast.success('Copied to clipboard', {
        description: 'Note ready to paste into your EHR',
      });
    } else {
      toast.error('Failed to copy to clipboard');
    }
  };

  const handleDownloadText = () => {
    if (!composeResult?.note) return;

    const filename = generateFilename(composeResult.template, 'txt');
    downloadAsText(composeResult.note, filename, getMetadata());
    toast.success('Downloaded as TXT', {
      description: filename,
    });
  };

  const handleDownloadPDF = () => {
    if (!composeResult?.note) return;

    const filename = generateFilename(composeResult.template, 'pdf');
    downloadAsPDF(composeResult.note, filename, getMetadata());
    toast.success('Downloaded as PDF', {
      description: filename,
    });
  };

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Download className="h-5 w-5 text-accent" />
          <h2 className="text-xl font-semibold">Export</h2>
        </div>

        <p className="text-sm text-muted-foreground">
          Export your composed note to clipboard or download as a file
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Button
            size="lg"
            variant="outline"
            onClick={handleCopyToClipboard}
            disabled={!hasNote}
            className="h-14"
          >
            <Copy className="mr-2 h-5 w-5" />
            Clipboard
          </Button>

          <Button
            size="lg"
            variant="outline"
            onClick={handleDownloadText}
            disabled={!hasNote}
            className="h-14"
          >
            <FileText className="mr-2 h-5 w-5" />
            TXT
          </Button>

          <Button
            size="lg"
            variant="outline"
            onClick={handleDownloadPDF}
            disabled={!hasNote}
            className="h-14"
          >
            <Download className="mr-2 h-5 w-5" />
            PDF
          </Button>
        </div>

        {!hasNote && (
          <p className="text-xs text-center text-muted-foreground pt-2">
            Complete the workflow above to enable exports
          </p>
        )}
      </div>
    </Card>
  );
}
