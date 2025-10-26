import { useState, useEffect } from 'react';
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
  AlertTriangle,
  Brain,
  Sparkles,
  TrendingUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { enhancedAIService } from '@/lib/enhancedAIService';
import { knowledgeBaseService } from '@/lib/knowledgeBase';
import { ICD10SuggestionPanel } from '@/components/ICD10SuggestionPanel';
import { icd10SuggestionService } from '@/lib/icd10Suggestions';

interface NoteContent {
  [key: string]: string;
}

interface MVPDraftScreenProps {
  onNavigate: (screen: string) => void;
  transcript: string;
  selectedTemplate: string;
  noteContent?: { [key: string]: string };
  onEditNote: (section: string, content: string) => void;
  onRegenerateNote: () => void;
  isProcessing?: boolean;
}

export function MVPDraftScreen({
  onNavigate,
  transcript,
  selectedTemplate,
  noteContent: passedNoteContent,
  onEditNote,
  onRegenerateNote,
  isProcessing = false
}: MVPDraftScreenProps) {
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [editedContent, setEditedContent] = useState<string>('');
  const [aiGeneratedContent, setAiGeneratedContent] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiInsights, setAiInsights] = useState<any>(null);
  const [selectedICD10Codes, setSelectedICD10Codes] = useState<Array<{code: string, description: string}>>([]);
  const [showICD10Panel, setShowICD10Panel] = useState(false);
  const [originalContent, setOriginalContent] = useState<any>(null);

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

  // Generate intelligent, situation-specific content using AI
  useEffect(() => {
    // Only generate if we don't have passed note content
    if (transcript && selectedTemplate && (!passedNoteContent || Object.keys(passedNoteContent).length === 0)) {
      console.log('🔄 No passed content, generating from transcript...');
      // First, generate the original content
      const original = generateNoteFromTemplate(selectedTemplate, transcript);
      setOriginalContent(original);
      
      // Then enhance it with AI
      generateIntelligentContent();
    } else if (passedNoteContent && Object.keys(passedNoteContent).length > 0) {
      console.log('✅ Using passed note content:', passedNoteContent);
      // Use the passed content directly - it's already AI-generated
      setAiGeneratedContent(passedNoteContent);
      setOriginalContent(passedNoteContent);
      
      // Still generate ICD-10 suggestions based on the content
      const generateICD10Only = async () => {
        try {
          const icd10Suggestions = await generateICD10Suggestions(transcript, selectedTemplate);
          setAiInsights({
            confidence: 0.95,
            quality: 0.9,
            medicalTerms: 0,
            icd10Suggestions: icd10Suggestions,
            suggestions: []
          });
        } catch (error) {
          console.error('Failed to generate ICD-10 suggestions:', error);
        }
      };
      generateICD10Only();
    }
  }, [transcript, selectedTemplate, passedNoteContent]);

  const generateIntelligentContent = async () => {
    setIsGenerating(true);
    try {
      // Analyze the input for medical context
      const analysis = enhancedAIService.analyzeInput(transcript);
      
      // Generate AI-powered note
      const aiPrompt = {
        template: selectedTemplate as 'SOAP' | 'SBAR' | 'PIE' | 'DAR',
        input: transcript,
        context: {
          chiefComplaint: extractChiefComplaint(transcript),
          medicalHistory: analysis.medicalTerms.map(t => t.term),
          urgency: determineUrgency(transcript)
        }
      };

      const generatedNote = await enhancedAIService.generateNote(aiPrompt);
      setAiGeneratedContent(generatedNote);
      
      // Generate comprehensive ICD-10 suggestions based on content
      const icd10Suggestions = await generateICD10Suggestions(transcript, selectedTemplate);
      
      // Get AI insights
      const insights = {
        confidence: generatedNote.overallConfidence,
        quality: generatedNote.qualityScore,
        medicalTerms: analysis.medicalTerms.length,
        icd10Suggestions: icd10Suggestions,
        suggestions: generatedNote.suggestions
      };
      setAiInsights(insights);
      
    } catch (error) {
      console.error('AI content generation failed:', error);
      // Fallback to basic content
      setAiGeneratedContent(null);
    } finally {
      setIsGenerating(false);
    }
  };


  const determineUrgency = (text: string): 'low' | 'medium' | 'high' => {
    const urgentKeywords = ['severe', 'acute', 'emergency', 'critical', 'unstable'];
    const moderateKeywords = ['moderate', 'mild', 'stable'];
    
    if (urgentKeywords.some(keyword => text.toLowerCase().includes(keyword))) {
      return 'high';
    } else if (moderateKeywords.some(keyword => text.toLowerCase().includes(keyword))) {
      return 'medium';
    }
    return 'low';
  };

  const generateICD10Suggestions = async (text: string, template: string): Promise<Array<{code: string, description: string, confidence?: number, reasoning?: string, urgency?: string}>> => {
    try {
      // Use the enhanced AI service for intelligent ICD-10 suggestions
      const result = await enhancedAIService.getICD10Suggestions(text, template, {
        template,
        chiefComplaint: extractChiefComplaint(text),
        symptoms: extractSymptoms(text),
        urgency: determineUrgencyFromText(text)
      });
      
      return result.suggestions.map(suggestion => ({
        code: suggestion.code,
        description: suggestion.description,
        confidence: suggestion.confidence,
        reasoning: suggestion.reasoning,
        urgency: suggestion.urgency
      }));
    } catch (error) {
      console.error('Error generating ICD-10 suggestions:', error);
      
      // Fallback to basic suggestions
      try {
        const symptoms = extractSymptoms(text);
        const suggestions: Array<{code: string, description: string}> = [];
        
        symptoms.forEach(symptom => {
          const symptomSuggestions = icd10SuggestionService.getSuggestions(symptom, template, 3);
          symptomSuggestions.forEach(suggestion => {
            if (!suggestions.find(s => s.code === suggestion.code)) {
              suggestions.push({
                code: suggestion.code,
                description: suggestion.description
              });
            }
          });
        });
        
        return suggestions.slice(0, 8);
      } catch (fallbackError) {
        console.error('Fallback ICD-10 suggestions failed:', fallbackError);
        return [];
      }
    }
  };

  // Helper function to extract chief complaint from text
  const extractChiefComplaint = (text: string): string => {
    const patterns = [
      /(?:chief complaint|presents with|complains of|reason for visit)[:\s]*([^.]+)/i,
      /(?:patient reports|patient states)[:\s]*([^.]+)/i
    ];
    
    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match && match[1]) {
        return match[1].trim();
      }
    }
    
    return '';
  };

  // Helper function to determine urgency from text
  const determineUrgencyFromText = (text: string): 'routine' | 'urgent' | 'critical' => {
    const lowerText = text.toLowerCase();
    
    if (lowerText.includes('emergency') || lowerText.includes('critical') || lowerText.includes('life-threatening') || lowerText.includes('code blue')) {
      return 'critical';
    }
    
    if (lowerText.includes('urgent') || lowerText.includes('acute') || lowerText.includes('severe') || lowerText.includes('pain level') && (lowerText.includes('8') || lowerText.includes('9') || lowerText.includes('10'))) {
      return 'urgent';
    }
    
    return 'routine';
  };

  const extractSymptoms = (text: string): string[] => {
    const commonSymptoms = [
      'chest pain', 'shortness of breath', 'headache', 'abdominal pain', 'fever',
      'nausea', 'vomiting', 'dizziness', 'fatigue', 'weakness', 'cough',
      'sore throat', 'runny nose', 'congestion', 'back pain', 'joint pain',
      'muscle pain', 'swelling', 'rash', 'itching', 'diarrhea', 'constipation',
      'urinary frequency', 'dysuria', 'hematuria', 'difficulty sleeping',
      'anxiety', 'depression', 'confusion', 'memory loss'
    ];
    
    return commonSymptoms.filter(symptom => 
      text.toLowerCase().includes(symptom)
    );
  };

  const handleICD10CodeSelect = (code: string, description: string) => {
    const newCode = { code, description };
    setSelectedICD10Codes(prev => {
      // Remove if already exists, otherwise add
      const exists = prev.find(c => c.code === code);
      if (exists) {
        return prev.filter(c => c.code !== code);
      } else {
        return [...prev, newCode];
      }
    });
  };

  // Use passed note content OR AI-generated content - this is the AI-generated content from MVPApp
  let noteContent: NoteContent = {};
  
  if (passedNoteContent && Object.keys(passedNoteContent).length > 0) {
    noteContent = passedNoteContent;
  } else if (aiGeneratedContent && Object.keys(aiGeneratedContent).length > 0) {
    // Check if aiGeneratedContent has a sections property (from enhancedAIService)
    if (aiGeneratedContent.sections) {
      // Extract content from sections
      Object.entries(aiGeneratedContent.sections).forEach(([section, data]: [string, any]) => {
        const sectionKey = section.charAt(0).toUpperCase() + section.slice(1).toLowerCase();
        const content = data.content || data;
        
        // Only add non-empty content
        if (content && typeof content === 'string' && content.trim()) {
          noteContent[sectionKey] = content;
        } else {
          console.warn(`Section ${sectionKey} has empty or invalid content:`, data);
          // Provide a fallback message
          noteContent[sectionKey] = `${sectionKey} section is being generated. Please review and complete.`;
        }
      });
    } else {
      // Use aiGeneratedContent directly if it doesn't have sections
      noteContent = aiGeneratedContent;
    }
  }
  
  console.log('Note content being displayed:', noteContent);
  console.log('Passed note content:', passedNoteContent);
  console.log('AI generated content:', aiGeneratedContent);
  console.log('AI generated sections:', aiGeneratedContent?.sections);
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
      <Card className="p-3 shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-6 h-6 lg:w-7 lg:h-7 bg-gradient-to-r from-teal-500/10 to-blue-600/10 rounded-lg flex items-center justify-center">
            {icon}
          </div>
          <h3 className="text-sm lg:text-base font-semibold text-slate-900">{title}</h3>
        </div>
        
        {isEditing ? (
          <div className="space-y-2">
            <Textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              className="min-h-[100px] lg:min-h-[120px] resize-none text-sm leading-relaxed"
              placeholder={`Edit ${title.toLowerCase()} content...`}
            />
            <div className="flex gap-2">
              <Button size="sm" onClick={handleSaveEdit} className="bg-teal-600 hover:bg-teal-700 h-7 text-xs">
                Save
              </Button>
              <Button size="sm" variant="outline" onClick={handleCancelEdit} className="h-7 text-xs">
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="min-h-[80px] lg:min-h-[100px] p-2.5 lg:p-3 bg-slate-50 rounded-lg border border-slate-200">
              <p className="text-xs lg:text-sm leading-relaxed whitespace-pre-wrap text-slate-800">{content}</p>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleEdit(title.toLowerCase().replace(/\s+/g, ''), content)}
              className="w-fit hover:bg-teal-50 hover:border-teal-300 h-7 text-xs"
            >
              <Edit3 className="h-3 w-3 mr-1" />
              Edit
            </Button>
          </div>
        )}
      </Card>
    );
  };

  return (
    <div className="mvp-app bg-gradient-to-br from-slate-50 via-white to-blue-50/30 w-full">
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

      {/* AI Insights Display - Compact */}
      {aiInsights && (
        <div className="lg:hidden flex-shrink-0 p-2 bg-gradient-to-r from-blue-50 to-teal-50 border-b border-blue-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Brain className="h-3 w-3 text-blue-600" />
              <span className="text-xs font-semibold text-blue-900">AI Enhanced</span>
              {isGenerating && (
                <div className="h-2 w-2 animate-spin rounded-full border border-blue-600 border-t-transparent" />
              )}
            </div>
            <div className="flex items-center gap-3 text-xs">
              <div className="flex items-center gap-1">
                <TrendingUp className="h-3 w-3 text-green-600" />
                <span className="text-slate-700">{Math.round(aiInsights.confidence * 100)}%</span>
              </div>
              <div className="flex items-center gap-1">
                <Target className="h-3 w-3 text-orange-600" />
                <span className="text-slate-700">{aiInsights.icd10Suggestions?.length || 0}</span>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowICD10Panel(!showICD10Panel)}
                className="h-6 text-xs bg-white/80 border-blue-200 text-blue-700 hover:bg-blue-50 px-2"
              >
                <Target className="h-3 w-3 mr-1" />
                {showICD10Panel ? 'Hide' : 'ICD-10'}
              </Button>
              {selectedICD10Codes.length > 0 && (
                <Badge className="h-6 px-2 bg-green-100 text-green-800 border-green-200 text-xs">
                  {selectedICD10Codes.length}
                </Badge>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Mobile ICD-10 Panel */}
      {showICD10Panel && aiInsights && (
        <div className="lg:hidden flex-shrink-0 p-3 bg-white border-b border-slate-200 max-h-64 overflow-y-auto">
          <div className="mb-3">
            <h3 className="text-sm font-semibold text-slate-900 mb-2">AI-Suggested ICD-10 Codes</h3>
            <p className="text-xs text-slate-600 mb-3">Tap to select codes for your note</p>
          </div>
          
          {/* Selected Codes */}
          {selectedICD10Codes.length > 0 && (
            <div className="mb-3">
              <h4 className="text-xs font-medium text-green-700 mb-2">Selected Codes:</h4>
              <div className="flex flex-wrap gap-1">
                {selectedICD10Codes.map((code) => (
                  <Badge
                    key={code.code}
                    className="bg-green-100 text-green-800 border-green-200 text-xs px-2 py-1"
                  >
                    {code.code} - {code.description.substring(0, 30)}...
                  </Badge>
                ))}
              </div>
            </div>
          )}
          
          {/* Suggested Codes */}
          <div className="space-y-2">
            {aiInsights.icd10Suggestions?.slice(0, 5).map((suggestion: any, index: number) => (
              <div
                key={index}
                className={`p-2 rounded-lg border cursor-pointer transition-all ${
                  selectedICD10Codes.find(c => c.code === suggestion.code)
                    ? 'bg-green-50 border-green-200 ring-1 ring-green-300'
                    : 'bg-slate-50 border-slate-200 hover:bg-blue-50 hover:border-blue-200'
                }`}
                onClick={() => handleICD10CodeSelect(suggestion.code, suggestion.description)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-mono font-semibold text-blue-600">
                        {suggestion.code}
                      </span>
                      {selectedICD10Codes.find(c => c.code === suggestion.code) && (
                        <CheckCircle className="h-3 w-3 text-green-600" />
                      )}
                    </div>
                    <p className="text-xs text-slate-700 mt-1 line-clamp-2">
                      {suggestion.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {aiInsights.icd10Suggestions?.length === 0 && (
            <div className="text-center py-4">
              <Target className="h-8 w-8 text-slate-400 mx-auto mb-2" />
              <p className="text-xs text-slate-500">No ICD-10 suggestions available</p>
            </div>
          )}
        </div>
      )}

      {/* Desktop Header */}
      <div className="hidden lg:block flex-shrink-0 px-6 py-3 bg-white/90 backdrop-blur-sm border-b border-slate-200">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
              Draft Preview
            </h1>
            <p className="text-xs text-slate-600">
              Review and edit your {selectedTemplate} note
            </p>
          </div>
          <Badge className="bg-gradient-to-r from-teal-500 to-blue-600 text-white px-2.5 py-1 text-xs font-semibold">
            {selectedTemplate}
          </Badge>
        </div>

        {/* Desktop Note Header Info */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 bg-slate-50 px-1.5 py-0.5 rounded">
              <Calendar className="h-3 w-3 text-slate-600" />
              <span className="text-slate-700">{currentTime}</span>
            </div>
            <div className="flex items-center gap-1 bg-slate-50 px-1.5 py-0.5 rounded">
              <User className="h-3 w-3 text-slate-600" />
              <span className="text-slate-700">Patient Note</span>
            </div>
          </div>
          <div className="flex items-center gap-1 bg-green-50 px-1.5 py-0.5 rounded border border-green-200">
            <Shield className="h-3 w-3 text-green-600" />
            <span className="text-green-700 font-medium">HIPAA Protected</span>
          </div>
        </div>
      </div>

      {/* Desktop AI Insights - Compact */}
      {aiInsights && (
        <div className="hidden lg:block flex-shrink-0 px-6 py-2 bg-gradient-to-r from-blue-50 to-teal-50 border-b border-blue-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Brain className="h-3.5 w-3.5 text-blue-600" />
              <span className="text-xs font-semibold text-blue-900">AI-Enhanced</span>
              {isGenerating && (
                <div className="h-2.5 w-2.5 animate-spin rounded-full border border-blue-600 border-t-transparent" />
              )}
            </div>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <TrendingUp className="h-3.5 w-3.5 text-green-600" />
                <span className="text-slate-700">{Math.round(aiInsights.confidence * 100)}%</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Target className="h-3.5 w-3.5 text-orange-600" />
                <span className="text-slate-700">{aiInsights.icd10Suggestions?.length || 0} ICD-10</span>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowICD10Panel(!showICD10Panel)}
                className="h-7 text-xs bg-white/80 border-blue-200 text-blue-700 hover:bg-blue-50 px-2"
              >
                <Target className="h-3 w-3 mr-1" />
                {showICD10Panel ? 'Hide' : 'View'}
              </Button>
              {selectedICD10Codes.length > 0 && (
                <Badge className="h-6 px-2 bg-green-100 text-green-800 border-green-200 text-xs">
                  {selectedICD10Codes.length}
                </Badge>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Desktop ICD-10 Panel */}
      {showICD10Panel && aiInsights && (
        <div className="hidden lg:block flex-shrink-0 px-6 py-3 bg-white border-b border-slate-200 max-h-72 overflow-y-auto">
          <div className="mb-3">
            <h3 className="text-sm font-semibold text-slate-900 mb-1">AI-Suggested ICD-10 Codes</h3>
            <p className="text-xs text-slate-600">Click to select codes for documentation</p>
          </div>
          
          {/* Selected Codes */}
          {selectedICD10Codes.length > 0 && (
            <div className="mb-3 p-2 bg-green-50 border border-green-200 rounded-lg">
              <h4 className="text-xs font-medium text-green-700 mb-1.5">Selected:</h4>
              <div className="flex flex-wrap gap-1.5">
                {selectedICD10Codes.map((code) => (
                  <Badge
                    key={code.code}
                    className="bg-green-100 text-green-800 border-green-200 px-2 py-0.5 text-xs"
                  >
                    {code.code}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          
          {/* Suggested Codes Grid */}
          <div className="grid grid-cols-3 gap-2">
            {aiInsights.icd10Suggestions?.slice(0, 9).map((suggestion: any, index: number) => (
              <div
                key={index}
                className={`p-2 rounded-lg border cursor-pointer transition-all ${
                  selectedICD10Codes.find(c => c.code === suggestion.code)
                    ? 'bg-green-50 border-green-200 ring-1 ring-green-300'
                    : 'bg-slate-50 border-slate-200 hover:bg-blue-50 hover:border-blue-200'
                }`}
                onClick={() => handleICD10CodeSelect(suggestion.code, suggestion.description)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="text-xs font-mono font-semibold text-blue-600">
                        {suggestion.code}
                      </span>
                      {selectedICD10Codes.find(c => c.code === suggestion.code) && (
                        <CheckCircle className="h-3 w-3 text-green-600" />
                      )}
                    </div>
                    <p className="text-xs text-slate-700 leading-tight line-clamp-2">
                      {suggestion.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {aiInsights.icd10Suggestions?.length === 0 && (
            <div className="text-center py-4">
              <Target className="h-8 w-8 text-slate-400 mx-auto mb-2" />
              <p className="text-xs text-slate-500">No ICD-10 suggestions available</p>
            </div>
          )}
        </div>
      )}

      {/* Note Content - Optimized for Desktop & Mobile */}
      <div className="flex-1 overflow-y-auto px-3 py-2 lg:px-6 lg:py-3 space-y-3 lg:space-y-3 min-h-0">
        {/* Template-specific sections */}
        {selectedTemplate === 'SOAP' && noteContent && (
          <>
            {renderSection('Subjective', noteContent.Subjective || noteContent.subjective || '', <User className="h-4 w-4 text-blue-600" />)}
            {renderSection('Objective', noteContent.Objective || noteContent.objective || '', <Target className="h-4 w-4 text-green-600" />)}
            {renderSection('Assessment', noteContent.Assessment || noteContent.assessment || '', <CheckCircle className="h-4 w-4 text-teal-600" />)}
            {renderSection('Plan', noteContent.Plan || noteContent.plan || '', <FileText className="h-4 w-4 text-purple-600" />)}
          </>
        )}

        {selectedTemplate === 'SBAR' && noteContent && (
          <>
            {renderSection('Situation', noteContent.Situation || noteContent.situation || '', <AlertTriangle className="h-4 w-4 text-red-600" />)}
            {renderSection('Background', noteContent.Background || noteContent.background || '', <Clock className="h-4 w-4 text-blue-600" />)}
            {renderSection('Assessment', noteContent.Assessment || noteContent.assessment || '', <CheckCircle className="h-4 w-4 text-teal-600" />)}
            {renderSection('Recommendation', noteContent.Recommendation || noteContent.recommendation || '', <ArrowRight className="h-4 w-4 text-purple-600" />)}
          </>
        )}

        {selectedTemplate === 'PIE' && noteContent && (
          <>
            {renderSection('Problem', noteContent.Problem || noteContent.problem || '', <AlertTriangle className="h-4 w-4 text-red-600" />)}
            {renderSection('Intervention', noteContent.Intervention || noteContent.intervention || '', <ArrowRight className="h-4 w-4 text-blue-600" />)}
            {renderSection('Evaluation', noteContent.Evaluation || noteContent.evaluation || '', <CheckCircle className="h-4 w-4 text-green-600" />)}
          </>
        )}

        {selectedTemplate === 'DAR' && noteContent && (
          <>
            {renderSection('Data', noteContent.Data || noteContent.data || '', <FileText className="h-4 w-4 text-blue-600" />)}
            {renderSection('Action', noteContent.Action || noteContent.action || '', <ArrowRight className="h-4 w-4 text-green-600" />)}
            {renderSection('Response', noteContent.Response || noteContent.response || '', <CheckCircle className="h-4 w-4 text-teal-600" />)}
          </>
        )}

        {/* Epic Templates - Dynamic rendering for all sections */}
        {!['SOAP', 'SBAR', 'PIE', 'DAR'].includes(selectedTemplate) && noteContent && (
          <>
            {Object.entries(noteContent).map(([sectionName, content]) => {
              if (typeof content === 'string' && content.trim()) {
                return renderSection(
                  sectionName,
                  content,
                  <FileText className="h-4 w-4 text-teal-600" />
                );
              }
              return null;
            })}
          </>
        )}

        {/* No content fallback */}
        {(!noteContent || Object.keys(noteContent).length === 0) && (
          <Card className="p-6 text-center">
            <AlertCircle className="h-12 w-12 text-slate-400 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No Content Generated</h3>
            <p className="text-sm text-slate-600 mb-4">
              The AI couldn't generate content for this template. Please try recording or typing your note again.
            </p>
            <Button onClick={() => onNavigate('home')} variant="outline">
              <ArrowRight className="h-4 w-4 mr-2 rotate-180" />
              Back to Home
            </Button>
          </Card>
        )}
      </div>

      {/* Mobile-Optimized Action Buttons - PROMINENT & EASY TO SEE */}
      <div className="lg:hidden flex-shrink-0 p-4 pb-24 bg-white/95 backdrop-blur-sm border-t-2 border-teal-200 shadow-lg">
        {/* Status Indicator */}
        <div className="flex items-center justify-center gap-2 mb-3 px-4 py-2 bg-green-50 border-2 border-green-300 rounded-xl">
          <CheckCircle className="h-5 w-5 text-green-600" />
          <span className="text-sm font-bold text-green-700">Note Ready to Export!</span>
        </div>

        {/* Large Primary Export Button */}
        <Button
          size="lg"
          onClick={() => onNavigate('export')}
          className="w-full h-14 text-base font-bold bg-gradient-to-r from-emerald-500 via-teal-600 to-emerald-600 hover:from-emerald-600 hover:via-teal-700 hover:to-emerald-700 text-white shadow-xl shadow-emerald-500/40 border-2 border-emerald-400 mb-3"
        >
          <FileText className="h-5 w-5 mr-2" />
          Export Note & Continue
          <ArrowRight className="h-5 w-5 ml-2" />
        </Button>

        {/* Secondary Actions */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onRegenerateNote}
            disabled={isProcessing}
            className="flex-1 h-10 text-sm border-2 border-orange-300 hover:bg-orange-50"
          >
            <RotateCcw className="h-4 w-4 mr-1" />
            Regenerate
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => onNavigate('home')}
            className="flex-1 h-10 text-sm border-2 border-slate-300 hover:bg-slate-50"
          >
            <ArrowRight className="h-4 w-4 mr-1 rotate-180" />
            Back
          </Button>
        </div>

        {/* ICD-10 Summary */}
        {selectedICD10Codes.length > 0 && (
          <div className="flex items-center justify-center gap-2 mt-3 px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg">
            <Target className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-700">{selectedICD10Codes.length} ICD-10 Codes Selected</span>
          </div>
        )}
      </div>

      {/* Desktop Action Buttons - Prominent & Clear */}
      <div className="hidden lg:block flex-shrink-0 px-6 py-3 bg-white/95 backdrop-blur-sm border-t-2 border-teal-200 shadow-lg">
        <div className="flex items-center gap-3">
          {/* Status Indicator */}
          <div className="flex items-center gap-2 px-3 py-2 bg-green-50 border border-green-200 rounded-lg">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <span className="text-xs font-medium text-green-700">Ready to Export</span>
          </div>

          {/* Action Buttons */}
          <div className="flex-1 flex gap-3">
            <Button
              variant="outline"
              size="lg"
              onClick={() => onNavigate('home')}
              className="h-10 text-sm border-2 border-slate-300 hover:bg-slate-50"
            >
              <ArrowRight className="h-4 w-4 mr-2 rotate-180" />
              Back to Recording
            </Button>
            
            <Button
              variant="outline"
              size="lg"
              onClick={onRegenerateNote}
              disabled={isProcessing}
              className="h-10 text-sm border-2 border-orange-300 hover:bg-orange-50 hover:border-orange-400"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Regenerate Note
            </Button>
            
            <Button
              size="lg"
              onClick={() => onNavigate('export')}
              className="flex-1 h-10 text-sm font-bold bg-gradient-to-r from-emerald-500 via-teal-600 to-emerald-600 hover:from-emerald-600 hover:via-teal-700 hover:to-emerald-700 text-white shadow-lg shadow-emerald-500/30 border-2 border-emerald-400"
            >
              <FileText className="h-4 w-4 mr-2" />
              Export Note & Continue
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>

          {/* ICD-10 Summary */}
          {selectedICD10Codes.length > 0 && (
            <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg">
              <Target className="h-4 w-4 text-blue-600" />
              <span className="text-xs font-medium text-blue-700">{selectedICD10Codes.length} ICD-10</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
