import { Copy, Download, FileText, ClipboardCheck, Monitor, Database, Settings, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { type ComposeResult } from '@/lib/compose';
import { type RedactionResult } from '@/lib/redaction';
import { ehrExportService, type EHRSystem, type ExportOptions, type ExportMetadata } from '@/lib/ehrExports';
import { toast } from 'sonner';
import { useState } from 'react';

interface ExportPanelProps {
  composeResult: ComposeResult | null;
  redactionResult: RedactionResult | null;
}

export function ExportPanel({ composeResult, redactionResult }: ExportPanelProps) {
  const [selectedEHR, setSelectedEHR] = useState<string>('epic');
  const [exportOptions, setExportOptions] = useState<ExportOptions>(ehrExportService.getDefaultOptions());
  const [showPreview, setShowPreview] = useState(false);
  const [exportPreview, setExportPreview] = useState<string>('');
  
  const hasNote = composeResult?.note && composeResult.note.trim().length > 0;
  const ehrSystems = ehrExportService.getEHRSystems();

  const getMetadata = (): ExportMetadata => ({
    template: composeResult?.template || 'Unknown',
    timestamp: new Date().toLocaleString(),
    redactionCount: redactionResult?.redactionCount,
    timeSaved: 15, // Estimate based on typical documentation time
    nurseSignature: '[NURSE NAME]',
    department: '[DEPARTMENT]',
  });

  const handleEHRExport = async (format: 'clipboard' | 'download' | 'pdf') => {
    if (!composeResult?.note) return;

    try {
      const result = await ehrExportService.exportForEHR(
        composeResult.note,
        selectedEHR,
        getMetadata(),
        exportOptions
      );

      switch (format) {
        case 'clipboard':
          const success = await ehrExportService.copyToClipboard(result.content);
          if (success) {
            toast.success('Copied to clipboard', {
              description: `Formatted for ${selectedEHR.toUpperCase()}`,
            });
          } else {
            toast.error('Failed to copy to clipboard');
          }
          break;
          
        case 'download':
          ehrExportService.downloadFile(result.content, result.filename);
          toast.success('Downloaded successfully', {
            description: result.filename,
          });
          break;
          
        case 'pdf':
          await ehrExportService.exportAsPDF(result.content, result.filename);
          toast.success('PDF exported', {
            description: result.filename,
          });
          break;
      }
    } catch (error) {
      console.error('Export failed:', error);
      toast.error('Export failed', {
        description: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  };

  const handlePreview = async () => {
    if (!composeResult?.note) return;

    try {
      const result = await ehrExportService.exportForEHR(
        composeResult.note,
        selectedEHR,
        getMetadata(),
        exportOptions
      );
      setExportPreview(result.preview);
      setShowPreview(true);
    } catch (error) {
      console.error('Preview failed:', error);
      toast.error('Preview failed');
    }
  };

  const selectedEHRSystem = ehrSystems.find(ehr => ehr.id === selectedEHR);

  return (
    <Card className="card-premium p-6 animate-fade-in">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-accent rounded-xl flex items-center justify-center shadow-lg">
              <Download className="h-5 w-5 text-accent-foreground" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Export & Share</h2>
              <p className="text-sm text-muted-foreground">Copy, download, or integrate with EHR</p>
            </div>
          </div>
          <Badge variant="outline" className="bg-accent/10 text-accent border-accent/20 font-semibold">
            EHR Ready
          </Badge>
        </div>

        {/* EHR Selection */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">EHR System</Label>
          <Select value={selectedEHR} onValueChange={setSelectedEHR}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ehrSystems.map((ehr) => (
                <SelectItem key={ehr.id} value={ehr.id}>
                  <div className="flex items-center gap-2">
                    <span>{ehr.icon}</span>
                    <div>
                      <div className="font-medium">{ehr.name}</div>
                      <div className="text-xs text-muted-foreground">{ehr.description}</div>
                    </div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {selectedEHRSystem && (
            <div className="p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Monitor className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">{selectedEHRSystem.name} Format</span>
              </div>
              <p className="text-xs text-muted-foreground">{selectedEHRSystem.description}</p>
            </div>
          )}
        </div>

        {/* Export Options */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Export Options</Label>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg border border-border/30">
              <Label htmlFor="include-timestamp" className="text-sm cursor-pointer">
                Include Timestamp
              </Label>
              <Switch
                id="include-timestamp"
                checked={exportOptions.includeTimestamp}
                onCheckedChange={(checked) => setExportOptions(prev => ({ ...prev, includeTimestamp: checked }))}
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg border border-border/30">
              <Label htmlFor="include-signature" className="text-sm cursor-pointer">
                Include Signature
              </Label>
              <Switch
                id="include-signature"
                checked={exportOptions.includeSignature}
                onCheckedChange={(checked) => setExportOptions(prev => ({ ...prev, includeSignature: checked }))}
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Export Actions */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Button
              size="lg"
              variant="outline"
              onClick={() => handleEHRExport('clipboard')}
              disabled={!hasNote}
              className="h-14 font-semibold shadow-soft hover:shadow-medium transition-all"
            >
              <ClipboardCheck className="mr-2 h-5 w-5" />
              Copy to EHR
            </Button>

            <Button
              size="lg"
              variant="outline"
              onClick={() => handleEHRExport('download')}
              disabled={!hasNote}
              className="h-14 font-semibold shadow-soft hover:shadow-medium transition-all"
            >
              <FileText className="mr-2 h-5 w-5" />
              Download TXT
            </Button>

            <Button
              size="lg"
              variant="outline"
              onClick={() => handleEHRExport('pdf')}
              disabled={!hasNote}
              className="h-14 font-semibold shadow-soft hover:shadow-medium transition-all"
            >
              <Download className="mr-2 h-5 w-5" />
              Export PDF
            </Button>
          </div>

          <Button
            variant="ghost"
            onClick={handlePreview}
            disabled={!hasNote}
            className="w-full"
          >
            <Eye className="mr-2 h-4 w-4" />
            Preview {selectedEHRSystem?.name} Format
          </Button>
        </div>

        {/* Preview */}
        {showPreview && exportPreview && (
          <div className="space-y-3">
            <Label className="text-sm font-medium">Preview - {selectedEHRSystem?.name} Format</Label>
            <div className="p-4 bg-muted/50 rounded-lg border border-border/30 max-h-[200px] overflow-y-auto">
              <pre className="text-xs font-mono whitespace-pre-wrap">{exportPreview}</pre>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowPreview(false)}
              className="w-full"
            >
              Hide Preview
            </Button>
          </div>
        )}

        {/* Status */}
        {!hasNote && (
          <div className="text-center p-4 bg-muted/30 rounded-lg">
            <FileText className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Complete the workflow above to enable exports
            </p>
          </div>
        )}

        {/* Export Stats */}
        {hasNote && (
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-3 bg-muted/30 rounded-lg">
              <div className="text-lg font-bold text-primary">{redactionResult?.redactionCount || 0}</div>
              <div className="text-xs text-muted-foreground">PHI Protected</div>
            </div>
            <div className="p-3 bg-muted/30 rounded-lg">
              <div className="text-lg font-bold text-secondary">15</div>
              <div className="text-xs text-muted-foreground">Min Saved</div>
            </div>
            <div className="p-3 bg-muted/30 rounded-lg">
              <div className="text-lg font-bold text-accent">{composeResult?.template || 'N/A'}</div>
              <div className="text-xs text-muted-foreground">Template</div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
