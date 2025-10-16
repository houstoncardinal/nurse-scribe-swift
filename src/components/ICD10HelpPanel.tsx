import { useState } from 'react';
import { HelpCircle, Code, Search, Target, CheckCircle, Lightbulb, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ICD10HelpPanelProps {
  className?: string;
}

export function ICD10HelpPanel({ className = '' }: ICD10HelpPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const examples = [
    {
      input: 'abdominal pain',
      output: 'R10.31 - Right lower quadrant pain',
      description: 'Type common symptoms to get specific ICD-10 codes'
    },
    {
      input: 'cp',
      output: 'R06.02 - Shortness of breath',
      description: 'Use medical abbreviations (CP = chest pain)'
    },
    {
      input: 'chest pain',
      output: 'R06.02 - Shortness of breath',
      description: 'Multi-word searches work perfectly'
    },
    {
      input: 'mi',
      output: 'I21.9 - Acute myocardial infarction',
      description: 'Common abbreviations are automatically recognized'
    }
  ];

  const tips = [
    'Type symptoms in plain English (e.g., "chest pain", "shortness of breath")',
    'Use medical abbreviations (e.g., "MI", "COPD", "DM")',
    'Search for body parts (e.g., "knee pain", "back pain")',
    'Try common terms (e.g., "fever", "nausea", "dizziness")',
    'Multi-word searches work (e.g., "right lower quadrant pain")',
    'Results are ranked by relevance and confidence'
  ];

  return (
    <Card className={`w-full ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <HelpCircle className="h-5 w-5 text-blue-600" />
            How to Use ICD-10 Suggestions
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="h-8 w-8 p-0"
          >
            {isExpanded ? 'Hide' : 'Show'} Help
          </Button>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="space-y-4">
          {/* Quick Start */}
          <Alert className="border-blue-200 bg-blue-50">
            <Lightbulb className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800">
              <strong>Quick Start:</strong> Simply type symptoms, conditions, or medical terms in the search box. 
              The system will automatically suggest the most relevant ICD-10 codes.
            </AlertDescription>
          </Alert>

          {/* Examples */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900 mb-3">Examples</h3>
            <div className="space-y-3">
              {examples.map((example, index) => (
                <div key={index} className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className="text-xs">
                      Input: "{example.input}"
                    </Badge>
                    <ArrowRight className="h-3 w-3 text-slate-500" />
                    <Badge className="text-xs bg-blue-100 text-blue-800">
                      {example.output}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-600">{example.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Tips */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900 mb-3">Search Tips</h3>
            <div className="grid grid-cols-1 gap-2">
              {tips.map((tip, index) => (
                <div key={index} className="flex items-start gap-2">
                  <CheckCircle className="h-3 w-3 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-xs text-slate-700">{tip}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Features */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900 mb-3">Smart Features</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-2 bg-green-50 rounded border border-green-200">
                <div className="flex items-center gap-1 mb-1">
                  <Target className="h-3 w-3 text-green-600" />
                  <span className="text-xs font-medium text-green-800">Smart Matching</span>
                </div>
                <p className="text-xs text-green-700">Finds codes even with partial matches</p>
              </div>
              <div className="p-2 bg-blue-50 rounded border border-blue-200">
                <div className="flex items-center gap-1 mb-1">
                  <Search className="h-3 w-3 text-blue-600" />
                  <span className="text-xs font-medium text-blue-800">Abbreviation Support</span>
                </div>
                <p className="text-xs text-blue-700">Recognizes medical abbreviations</p>
              </div>
              <div className="p-2 bg-purple-50 rounded border border-purple-200">
                <div className="flex items-center gap-1 mb-1">
                  <Code className="h-3 w-3 text-purple-600" />
                  <span className="text-xs font-medium text-purple-800">Template Integration</span>
                </div>
                <p className="text-xs text-purple-700">Suggests relevant codes for your note type</p>
              </div>
              <div className="p-2 bg-orange-50 rounded border border-orange-200">
                <div className="flex items-center gap-1 mb-1">
                  <CheckCircle className="h-3 w-3 text-orange-600" />
                  <span className="text-xs font-medium text-orange-800">Confidence Scoring</span>
                </div>
                <p className="text-xs text-orange-700">Shows how well each code matches</p>
              </div>
            </div>
          </div>

          {/* Usage Instructions */}
          <Alert className="border-amber-200 bg-amber-50">
            <HelpCircle className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-800">
              <strong>Pro Tip:</strong> Click on any suggested code to add it to your note. 
              Selected codes will be highlighted in green and can be easily copied or exported.
            </AlertDescription>
          </Alert>
        </CardContent>
      )}
    </Card>
  );
}
