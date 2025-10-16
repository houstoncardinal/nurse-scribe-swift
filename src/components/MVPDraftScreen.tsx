import { useState } from 'react';
import { 
  Edit3, 
  RotateCcw, 
  ArrowRight, 
  Clock, 
  User, 
  Calendar,
  Shield,
  CheckCircle,
  AlertCircle,
  FileText
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface MVPDraftScreenProps {
  onNavigate: (screen: string) => void;
  transcript: string;
  selectedTemplate: string;
  onEditNote: (section: string, content: string) => void;
  onRegenerateNote: () => void;
  isProcessing?: boolean;
}

export function MVPDraftScreen({
  onNavigate,
  transcript,
  selectedTemplate,
  onEditNote,
  onRegenerateNote,
  isProcessing = false
}: MVPDraftScreenProps) {
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [editedContent, setEditedContent] = useState<string>('');

  // Mock AI-generated note based on template
  const generateNoteFromTemplate = (template: string, transcript: string) => {
    const baseContent = transcript || "Patient presents with chest pain, vital signs stable, pain level 6/10, no shortness of breath.";
    
    switch (template) {
      case 'SOAP':
        return {
          subjective: `Patient reports: "${baseContent}"`,
          objective: `Vital Signs: BP 118/76, HR 88, RR 18, O2 sat 98%, T 99.2°F\nPhysical Assessment: Alert and oriented x3, no acute distress observed`,
          assessment: `Patient presents with chest pain, stable vital signs, pain well-controlled with current medication`,
          plan: `Continue current pain management regimen, monitor for signs of complications, patient education provided`
        };
      case 'SBAR':
        return {
          situation: `Patient reports chest pain with pain level 6/10`,
          background: `Patient history includes previous episodes, current medication regimen in place`,
          assessment: `Vital signs stable, pain controlled, no acute distress observed`,
          recommendation: `Continue monitoring, maintain current pain management, educate patient on warning signs`
        };
      case 'PIE':
        return {
          problem: `Acute chest pain`,
          intervention: `Pain assessment performed, vital signs monitored, medication administered as ordered`,
          evaluation: `Pain level decreased to 6/10, patient comfortable, no adverse reactions noted`
        };
      case 'DAR':
        return {
          data: `Patient reports chest pain 6/10, vital signs: BP 118/76, HR 88, RR 18, O2 sat 98%`,
          action: `Pain medication administered, vital signs monitored, comfort measures provided`,
          response: `Patient reports improved comfort, pain level decreased, no complications observed`
        };
      default:
        return {
          subjective: baseContent,
          objective: 'Vital signs stable',
          assessment: 'Patient stable',
          plan: 'Continue current care plan'
        };
    }
  };

  const noteContent = generateNoteFromTemplate(selectedTemplate, transcript);
  const currentTime = new Date().toLocaleString();

  const handleEdit = (section: string, content: string) => {
    setEditingSection(section);
    setEditedContent(content);
  };

  const handleSaveEdit = () => {
    if (editingSection && editedContent) {
      onEditNote(editingSection, editedContent);
      setEditingSection(null);
      setEditedContent('');
    }
  };

  const handleCancelEdit = () => {
    setEditingSection(null);
    setEditedContent('');
  };

  const renderSection = (title: string, content: string, icon: React.ReactNode) => {
    const isEditing = editingSection === title.toLowerCase().replace(/\s+/g, '');
    
    return (
      <Card className="p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 bg-gradient-primary/10 rounded-lg flex items-center justify-center">
            {icon}
          </div>
          <h3 className="text-lg font-semibold">{title}</h3>
        </div>
        
        {isEditing ? (
          <div className="space-y-3">
            <Textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              className="min-h-[100px]"
              placeholder={`Edit ${title.toLowerCase()} content...`}
            />
            <div className="flex gap-2">
              <Button size="sm" onClick={handleSaveEdit}>
                Save Changes
              </Button>
              <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-sm leading-relaxed whitespace-pre-wrap">{content}</p>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleEdit(title.toLowerCase().replace(/\s+/g, ''), content)}
              className="w-fit"
            >
              <Edit3 className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </div>
        )}
      </Card>
    );
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-6 pb-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Draft Note Preview</h1>
              <p className="text-sm text-muted-foreground">
                Review and edit your {selectedTemplate} note
              </p>
            </div>
            <Badge className="bg-gradient-primary">
              {selectedTemplate}
            </Badge>
          </div>

          {/* Note Header Info */}
          <Card className="p-4">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>{currentTime}</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span>Patient Note</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-success" />
                <span className="text-success font-medium">HIPAA Protected</span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Note Content */}
      <div className="flex-1 overflow-y-auto px-6 space-y-4">
        {selectedTemplate === 'SOAP' && (
          <>
            {renderSection('Subjective', noteContent.subjective, <FileText className="h-4 w-4 text-primary" />)}
            {renderSection('Objective', noteContent.objective, <FileText className="h-4 w-4 text-secondary" />)}
            {renderSection('Assessment', noteContent.assessment, <FileText className="h-4 w-4 text-accent" />)}
            {renderSection('Plan', noteContent.plan, <FileText className="h-4 w-4 text-primary" />)}
          </>
        )}

        {selectedTemplate === 'SBAR' && (
          <>
            {renderSection('Situation', noteContent.situation, <AlertCircle className="h-4 w-4 text-destructive" />)}
            {renderSection('Background', noteContent.background, <FileText className="h-4 w-4 text-secondary" />)}
            {renderSection('Assessment', noteContent.assessment, <CheckCircle className="h-4 w-4 text-accent" />)}
            {renderSection('Recommendation', noteContent.recommendation, <ArrowRight className="h-4 w-4 text-primary" />)}
          </>
        )}

        {selectedTemplate === 'PIE' && (
          <>
            {renderSection('Problem', noteContent.problem, <AlertCircle className="h-4 w-4 text-destructive" />)}
            {renderSection('Intervention', noteContent.intervention, <CheckCircle className="h-4 w-4 text-accent" />)}
            {renderSection('Evaluation', noteContent.evaluation, <FileText className="h-4 w-4 text-primary" />)}
          </>
        )}

        {selectedTemplate === 'DAR' && (
          <>
            {renderSection('Data', noteContent.data, <FileText className="h-4 w-4 text-secondary" />)}
            {renderSection('Action', noteContent.action, <CheckCircle className="h-4 w-4 text-accent" />)}
            {renderSection('Response', noteContent.response, <ArrowRight className="h-4 w-4 text-primary" />)}
          </>
        )}
      </div>

      {/* Action Buttons */}
      <div className="p-6 pt-4 space-y-4">
        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>
            Note is ready for export. Review all sections before proceeding.
          </AlertDescription>
        </Alert>

        <div className="flex gap-3">
          <Button
            variant="outline"
            size="lg"
            onClick={onRegenerateNote}
            disabled={isProcessing}
            className="flex-1 h-12"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Regenerate
          </Button>
          
          <Button
            size="lg"
            onClick={() => onNavigate('export')}
            className="flex-1 h-12 bg-gradient-primary"
          >
            Export Note
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>

        <div className="text-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onNavigate('home')}
            className="text-muted-foreground"
          >
            ← Back to Recording
          </Button>
        </div>
      </div>
    </div>
  );
}
