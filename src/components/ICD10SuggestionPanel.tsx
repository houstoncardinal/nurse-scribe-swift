import { useState, useEffect } from 'react';
import { Search, Code, Copy, Check, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { icd10SuggestionService } from '@/lib/icd10Suggestions';

interface ICD10SuggestionPanelProps {
  onCodeSelect: (code: string, description: string) => void;
  selectedTemplate?: string;
  className?: string;
}

export function ICD10SuggestionPanel({ 
  onCodeSelect, 
  selectedTemplate,
  className = '' 
}: ICD10SuggestionPanelProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Search for ICD-10 codes
  useEffect(() => {
    if (searchTerm.length >= 2) {
      const results = icd10SuggestionService.getSuggestions(
        searchTerm, 
        selectedTemplate === 'all' ? undefined : selectedTemplate,
        10
      );
      setSuggestions(results);
    } else {
      setSuggestions([]);
    }
  }, [searchTerm, selectedTemplate]);

  // Get smart template codes if template is selected
  useEffect(() => {
    if (selectedTemplate && selectedTemplate !== 'all' && searchTerm === '') {
      const templateCodes = icd10SuggestionService.getSmartTemplateCodes(selectedTemplate);
      setSuggestions(templateCodes.map(code => ({
        code: code.code,
        description: code.description,
        confidence: 1.0,
        category: code.category,
        matchType: 'template' as const
      })));
    }
  }, [selectedTemplate, searchTerm]);

  const handleCodeSelect = (code: string, description: string) => {
    onCodeSelect(code, description);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const getMatchTypeColor = (matchType: string) => {
    switch (matchType) {
      case 'exact': return 'bg-green-100 text-green-800 border-green-200';
      case 'partial': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'synonym': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'related': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'template': return 'bg-teal-100 text-teal-800 border-teal-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getMatchTypeLabel = (matchType: string) => {
    switch (matchType) {
      case 'exact': return 'Exact Match';
      case 'partial': return 'Partial Match';
      case 'synonym': return 'Synonym';
      case 'related': return 'Related';
      case 'template': return 'Smart Template';
      default: return 'Match';
    }
  };

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'NICU', label: 'NICU' },
    { value: 'Med-Surg', label: 'Med-Surg' },
    { value: 'ICU', label: 'ICU' },
    { value: 'OB', label: 'OB' },
    { value: 'Symptoms', label: 'Symptoms' },
    { value: 'Cardiovascular', label: 'Cardiovascular' },
    { value: 'Respiratory', label: 'Respiratory' },
    { value: 'Gastrointestinal', label: 'GI' },
    { value: 'Neurological', label: 'Neurological' },
    { value: 'Endocrine', label: 'Endocrine' },
    { value: 'Mental Health', label: 'Mental Health' }
  ];

  return (
    <Card className={`w-full ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Code className="h-5 w-5 text-blue-600" />
            ICD-10 Suggestions
            {selectedTemplate && selectedTemplate !== 'all' && (
              <Badge className="bg-teal-100 text-teal-800 border-teal-200">
                {selectedTemplate} Template
              </Badge>
            )}
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="h-8 w-8 p-0"
          >
            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>
        
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search symptoms, conditions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-9 text-sm"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 text-sm border border-slate-200 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {categories.map((category) => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="pt-0">
          <ScrollArea className="h-64">
            {suggestions.length > 0 ? (
              <div className="space-y-2">
                {suggestions.map((suggestion, index) => (
                  <div
                    key={`${suggestion.code}-${index}`}
                    className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200 hover:bg-slate-100 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <code className="text-sm font-mono font-bold text-blue-700 bg-blue-100 px-2 py-1 rounded">
                          {suggestion.code}
                        </code>
                        <Badge className={getMatchTypeColor(suggestion.matchType)}>
                          {getMatchTypeLabel(suggestion.matchType)}
                        </Badge>
                        {suggestion.confidence && (
                          <span className="text-xs text-slate-500">
                            {Math.round(suggestion.confidence * 100)}%
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-slate-700 leading-relaxed">
                        {suggestion.description}
                      </p>
                      <Badge variant="outline" className="text-xs mt-1">
                        {suggestion.category}
                      </Badge>
                    </div>
                    <div className="flex gap-1 ml-3">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleCopyCode(suggestion.code)}
                        className="h-8 w-8 p-0"
                      >
                        {copiedCode === suggestion.code ? (
                          <Check className="h-3 w-3 text-green-600" />
                        ) : (
                          <Copy className="h-3 w-3" />
                        )}
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleCodeSelect(suggestion.code, suggestion.description)}
                        className="h-8 px-3 text-xs bg-blue-600 hover:bg-blue-700"
                      >
                        Use
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : searchTerm.length >= 2 ? (
              <div className="text-center py-8 text-slate-500">
                <Code className="h-8 w-8 mx-auto mb-2 text-slate-400" />
                <p className="text-sm">No ICD-10 codes found for "{searchTerm}"</p>
                <p className="text-xs mt-1">Try different keywords or check spelling</p>
              </div>
            ) : (
              <div className="text-center py-8 text-slate-500">
                <Sparkles className="h-8 w-8 mx-auto mb-2 text-blue-400" />
                <p className="text-sm font-medium mb-1">Smart ICD-10 Suggestions</p>
                <p className="text-xs">
                  {selectedTemplate && selectedTemplate !== 'all' 
                    ? `Showing ${selectedTemplate} template codes`
                    : 'Start typing to search for ICD-10 codes'
                  }
                </p>
                <div className="mt-4 text-xs text-slate-400">
                  <p>• Type symptoms like "abdominal pain"</p>
                  <p>• Use shortcuts like "uti", "copd", "mi"</p>
                  <p>• Smart templates provide relevant codes</p>
                </div>
              </div>
            )}
          </ScrollArea>
          
          <Separator className="my-3" />
          
          <div className="text-xs text-slate-500 space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Exact match</span>
              <div className="w-2 h-2 bg-blue-500 rounded-full ml-4"></div>
              <span>Partial match</span>
              <div className="w-2 h-2 bg-teal-500 rounded-full ml-4"></div>
              <span>Template code</span>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
