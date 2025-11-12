import { Card } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Lightbulb, Mic, Type, Sparkles } from 'lucide-react';
import { getTemplateGuidance } from '@/lib/templateGuidance';

interface TemplateGuideProps {
  template: string;
  compact?: boolean;
}

export function TemplateGuide({ template, compact = false }: TemplateGuideProps) {
  const guide = getTemplateGuidance(template);

  if (compact) {
    return (
      <Alert className="bg-gradient-to-r from-teal-50 via-blue-50 to-teal-50 border-teal-200 shadow-md">
        <Sparkles className="h-4 w-4 text-teal-600" />
        <AlertDescription className="text-slate-700">
          <div className="font-semibold mb-1">{guide.name}</div>
          <div className="text-sm">{guide.description}</div>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Card className="p-6 bg-gradient-to-br from-white via-blue-50/30 to-teal-50/30 border-2 border-teal-200/50 shadow-xl">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
          <Sparkles className="h-6 w-6 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-slate-900">{guide.name}</h3>
          <p className="text-sm text-slate-600">{guide.description}</p>
        </div>
      </div>

      {/* How to Use */}
      <div className="space-y-4">
        {/* Voice/Text Options */}
        <div className="flex gap-2">
          <Badge className="bg-teal-100 text-teal-700 border-teal-300">
            <Mic className="h-3 w-3 mr-1" />
            Voice
          </Badge>
          <Badge className="bg-blue-100 text-blue-700 border-blue-300">
            <Type className="h-3 w-3 mr-1" />
            Text
          </Badge>
          <span className="text-sm text-slate-600 flex items-center">
            Speak or type naturally - AI handles the rest!
          </span>
        </div>

        {/* Example Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Mic className="h-4 w-4 text-teal-600" />
            <span className="font-semibold text-slate-900 text-sm">Example (speak naturally):</span>
          </div>
          <p className="text-sm text-slate-700 leading-relaxed italic">
            "{guide.example}"
          </p>
        </div>

        {/* Tips Section */}
        <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-lg p-4 border border-amber-200 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="h-4 w-4 text-amber-600" />
            <span className="font-semibold text-slate-900 text-sm">Quick Tips:</span>
          </div>
          <ul className="space-y-2">
            {guide.tips.map((tip, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-slate-700">
                <span className="text-amber-600 font-bold mt-0.5">•</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Card>
  );
}
