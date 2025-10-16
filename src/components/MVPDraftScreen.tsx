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
  FileText,
  Target,
  AlertTriangle
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
      <Card className="p-3 lg:p-4 shadow-sm">
        <div className="flex items-center gap-2 lg:gap-3 mb-3 lg:mb-4">
          <div className="w-6 h-6 lg:w-8 lg:h-8 bg-gradient-to-r from-teal-500/10 to-blue-600/10 rounded-lg flex items-center justify-center">
            {icon}
          </div>
          <h3 className="text-base lg:text-lg font-semibold text-slate-900">{title}</h3>
        </div>
        
        {isEditing ? (
          <div className="space-y-3 lg:space-y-4">
            <Textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              className="min-h-[120px] lg:min-h-[200px] resize-none text-sm leading-relaxed"
              placeholder={`Edit ${title.toLowerCase()} content...`}
            />
            <div className="flex gap-2">
              <Button size="sm" onClick={handleSaveEdit} className="bg-teal-600 hover:bg-teal-700 h-8">
                Save
              </Button>
              <Button size="sm" variant="outline" onClick={handleCancelEdit} className="h-8">
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-3 lg:space-y-4">
            <div className="min-h-[100px] lg:min-h-[150px] p-3 lg:p-4 bg-slate-50 rounded-lg border border-slate-200">
              <p className="text-sm leading-relaxed whitespace-pre-wrap text-slate-800">{content}</p>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleEdit(title.toLowerCase().replace(/\s+/g, ''), content)}
              className="w-fit hover:bg-teal-50 hover:border-teal-300 h-8"
            >
              <Edit3 className="h-3 w-3 lg:h-4 lg:w-4 mr-1 lg:mr-2" />
              Edit
            </Button>
          </div>
        )}
      </Card>
    );
  };

  return (
    <div className="mvp-app bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      {/* Mobile-Optimized Compact Header */}
      <div className="lg:hidden flex-shrink-0 p-3 bg-white/90 backdrop-blur-sm border-b border-slate-200">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-lg font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
              Draft Preview
            </h1>
            <p className="text-xs text-slate-600">
              Review your {selectedTemplate} note
            </p>
          </div>
          <Badge className="bg-gradient-to-r from-teal-500 to-blue-600 text-white px-2 py-1 text-xs font-semibold">
            {selectedTemplate}
          </Badge>
        </div>

        {/* Mobile Compact Note Header Info */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-slate-50 px-1.5 py-0.5 rounded text-xs">
              <Calendar className="h-2.5 w-2.5 text-slate-600" />
              <span className="text-slate-700">{currentTime}</span>
            </div>
            <div className="flex items-center gap-1 bg-slate-50 px-1.5 py-0.5 rounded text-xs">
              <User className="h-2.5 w-2.5 text-slate-600" />
              <span className="text-slate-700">Note</span>
            </div>
          </div>
          <div className="flex items-center gap-1 bg-green-50 px-1.5 py-0.5 rounded border border-green-200 text-xs">
            <Shield className="h-2.5 w-2.5 text-green-600" />
            <span className="text-green-700 font-medium">HIPAA</span>
          </div>
        </div>
      </div>

      {/* Desktop Header */}
      <div className="hidden lg:block flex-shrink-0 p-4 bg-white/90 backdrop-blur-sm border-b border-slate-200">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
              Draft Preview
            </h1>
            <p className="text-sm text-slate-600">
              Review and edit your {selectedTemplate} note
            </p>
          </div>
          <Badge className="bg-gradient-to-r from-teal-500 to-blue-600 text-white px-3 py-1 text-sm font-semibold">
            {selectedTemplate}
          </Badge>
        </div>

        {/* Desktop Note Header Info */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded">
              <Calendar className="h-3 w-3 text-slate-600" />
              <span className="text-slate-700">{currentTime}</span>
            </div>
            <div className="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded">
              <User className="h-3 w-3 text-slate-600" />
              <span className="text-slate-700">Patient Note</span>
            </div>
          </div>
          <div className="flex items-center gap-1 bg-green-50 px-2 py-1 rounded border border-green-200">
            <Shield className="h-3 w-3 text-green-600" />
            <span className="text-green-700 font-medium">HIPAA Protected</span>
          </div>
        </div>
      </div>

      {/* Note Content - Mobile Optimized */}
      <div className="flex-1 overflow-y-auto px-3 py-2 lg:px-4 lg:py-4 space-y-3 lg:space-y-4 min-h-0">
        {/* Template-specific sections */}
        {selectedTemplate === 'SOAP' && (
          <>
            {renderSection('Subjective', noteContent.subjective, <User className="h-4 w-4 text-blue-600" />)}
            {renderSection('Objective', noteContent.objective, <Target className="h-4 w-4 text-green-600" />)}
            {renderSection('Assessment', noteContent.assessment, <CheckCircle className="h-4 w-4 text-teal-600" />)}
            {renderSection('Plan', noteContent.plan, <FileText className="h-4 w-4 text-purple-600" />)}
          </>
        )}

        {selectedTemplate === 'SBAR' && (
          <>
            {renderSection('Situation', noteContent.situation, <AlertTriangle className="h-4 w-4 text-red-600" />)}
            {renderSection('Background', noteContent.background, <Clock className="h-4 w-4 text-blue-600" />)}
            {renderSection('Assessment', noteContent.assessment, <CheckCircle className="h-4 w-4 text-teal-600" />)}
            {renderSection('Recommendation', noteContent.recommendation, <ArrowRight className="h-4 w-4 text-purple-600" />)}
          </>
        )}

        {selectedTemplate === 'PIE' && (
          <>
            {renderSection('Problem', noteContent.problem, <AlertTriangle className="h-4 w-4 text-red-600" />)}
            {renderSection('Intervention', noteContent.intervention, <ArrowRight className="h-4 w-4 text-blue-600" />)}
            {renderSection('Evaluation', noteContent.evaluation, <CheckCircle className="h-4 w-4 text-green-600" />)}
          </>
        )}

        {selectedTemplate === 'DAR' && (
          <>
            {renderSection('Data', noteContent.data, <FileText className="h-4 w-4 text-blue-600" />)}
            {renderSection('Action', noteContent.action, <ArrowRight className="h-4 w-4 text-green-600" />)}
            {renderSection('Response', noteContent.response, <CheckCircle className="h-4 w-4 text-teal-600" />)}
          </>
        )}
      </div>

      {/* Mobile-Optimized Action Buttons */}
      <div className="lg:hidden flex-shrink-0 p-3 pb-24 space-y-2 bg-white/90 backdrop-blur-sm border-t border-slate-200">
        <Alert className="py-2">
          <CheckCircle className="h-3 w-3" />
          <AlertDescription className="text-xs">
            Note ready for export. Review sections before proceeding.
          </AlertDescription>
        </Alert>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onRegenerateNote}
            disabled={isProcessing}
            className="flex-1 h-9"
          >
            <RotateCcw className="h-3 w-3 mr-1" />
            Regenerate
          </Button>
          
          <Button
            size="sm"
            onClick={() => onNavigate('export')}
            className="flex-1 h-9 bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700"
          >
            Export
            <ArrowRight className="h-3 w-3 ml-1" />
          </Button>
        </div>

        <div className="text-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onNavigate('home')}
            className="text-xs text-slate-500 hover:text-slate-700 h-7"
          >
            ← Back
          </Button>
        </div>
      </div>

      {/* Desktop Action Buttons */}
      <div className="hidden lg:block flex-shrink-0 p-4 space-y-3 bg-white/90 backdrop-blur-sm border-t border-slate-200">
        <Alert className="py-2">
          <CheckCircle className="h-4 w-4" />
          <AlertDescription className="text-sm">
            Note is ready for export. Review all sections before proceeding.
          </AlertDescription>
        </Alert>

        <div className="flex gap-3">
          <Button
            variant="outline"
            size="lg"
            onClick={onRegenerateNote}
            disabled={isProcessing}
            className="flex-1 h-11"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Regenerate
          </Button>
          
          <Button
            size="lg"
            onClick={() => onNavigate('export')}
            className="flex-1 h-11 bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700"
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
            className="text-slate-500 hover:text-slate-700"
          >
            ← Back to Recording
          </Button>
        </div>
      </div>
    </div>
  );
}
