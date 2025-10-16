import { useState, useEffect } from 'react';
import { Zap, Clock, Target, Sparkles, Copy, Check, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { smartTemplateService } from '@/lib/smartTemplates';

interface TimeSaverShortcutsProps {
  selectedTemplate: string;
  onShortcutExpand: (shortcut: string, expansion: string) => void;
  className?: string;
}

export function TimeSaverShortcuts({ 
  selectedTemplate, 
  onShortcutExpand,
  className = '' 
}: TimeSaverShortcutsProps) {
  const [shortcuts, setShortcuts] = useState<{ [key: string]: { code: string; description: string; shortcut: string } }>({});
  const [copiedShortcut, setCopiedShortcut] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Get time-saver shortcuts (this would come from the service)
    const timeSavers = {
      'abd pain': { code: 'R10.9', description: 'Unspecified abdominal pain', shortcut: 'abd pain' },
      'chest pain': { code: 'R06.02', description: 'Shortness of breath', shortcut: 'chest pain' },
      'sob': { code: 'R06.02', description: 'Shortness of breath', shortcut: 'sob' },
      'uti': { code: 'N39.0', description: 'Urinary tract infection', shortcut: 'uti' },
      'pneumonia': { code: 'J18.9', description: 'Pneumonia, unspecified', shortcut: 'pneumonia' },
      'copd': { code: 'J44.1', description: 'COPD with acute exacerbation', shortcut: 'copd' },
      'mi': { code: 'I21.9', description: 'Acute myocardial infarction', shortcut: 'mi' },
      'stroke': { code: 'I63.9', description: 'Cerebral infarction, unspecified', shortcut: 'stroke' },
      'diabetes': { code: 'E11.9', description: 'Type 2 diabetes mellitus', shortcut: 'diabetes' },
      'depression': { code: 'F32.9', description: 'Major depressive disorder', shortcut: 'depression' },
      'sepsis': { code: 'A41.9', description: 'Sepsis, unspecified', shortcut: 'sepsis' },
      'pressure ulcer': { code: 'L89.9', description: 'Pressure ulcer, unspecified', shortcut: 'pressure ulcer' },
      'preterm': { code: 'P07.30', description: 'Preterm newborn', shortcut: 'preterm' },
      'sga': { code: 'P07.10', description: 'Small for gestational age', shortcut: 'sga' },
      'ttn': { code: 'P22.1', description: 'Transient tachypnea of newborn', shortcut: 'ttn' },
      'jaundice': { code: 'P59.9', description: 'Neonatal jaundice', shortcut: 'jaundice' },
      'delivery': { code: 'O80.1', description: 'Spontaneous vertex delivery', shortcut: 'delivery' },
      'high risk': { code: 'O09.90', description: 'High-risk pregnancy', shortcut: 'high risk' },
      'arf': { code: 'J96.00', description: 'Acute respiratory failure', shortcut: 'arf' },
      'cardiac arrest': { code: 'I46.9', description: 'Cardiac arrest', shortcut: 'cardiac arrest' },
      'gerd': { code: 'K21.9', description: 'GERD', shortcut: 'gerd' },
      'gallstones': { code: 'K80.20', description: 'Gallstones', shortcut: 'gallstones' },
      'vss': { code: 'STATUS', description: 'Vital signs stable', shortcut: 'vss' },
      'aox3': { code: 'STATUS', description: 'Alert and oriented times 3', shortcut: 'aox3' },
      'adls': { code: 'STATUS', description: 'Activities of daily living', shortcut: 'adls' },
      'po': { code: 'ROUTE', description: 'By mouth', shortcut: 'po' },
      'iv': { code: 'ROUTE', description: 'Intravenous', shortcut: 'iv' },
      'prn': { code: 'FREQ', description: 'As needed', shortcut: 'prn' },
      'dc': { code: 'ACTION', description: 'Discharge', shortcut: 'dc' },
      'pt-ed': { code: 'ACTION', description: 'Patient education provided', shortcut: 'pt-ed' },
      'fam-update': { code: 'ACTION', description: 'Family updated on condition', shortcut: 'fam-update' }
    };
    setShortcuts(timeSavers);
  }, []);

  const filteredShortcuts = Object.entries(shortcuts).filter(([key, value]) => {
    if (!searchTerm) return true;
    return key.toLowerCase().includes(searchTerm.toLowerCase()) || 
           value.description.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleCopyShortcut = (shortcut: string) => {
    navigator.clipboard.writeText(shortcut);
    setCopiedShortcut(shortcut);
    setTimeout(() => setCopiedShortcut(null), 2000);
  };

  const handleUseShortcut = (shortcut: string, description: string) => {
    onShortcutExpand(shortcut, description);
    setCopiedShortcut(shortcut);
    setTimeout(() => setCopiedShortcut(null), 2000);
  };

  const getShortcutCategory = (code: string) => {
    if (code.startsWith('R') || code.startsWith('N') || code.startsWith('J') || 
        code.startsWith('I') || code.startsWith('E') || code.startsWith('A') ||
        code.startsWith('P') || code.startsWith('O') || code.startsWith('K') ||
        code.startsWith('L') || code.startsWith('F')) {
      return 'ICD-10';
    }
    return code;
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'ICD-10': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'STATUS': return 'bg-green-100 text-green-800 border-green-200';
      case 'ROUTE': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'FREQ': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'ACTION': return 'bg-teal-100 text-teal-800 border-teal-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const templateShortcuts = smartTemplateService.getTemplateShortcuts(selectedTemplate);

  return (
    <Card className={`w-full ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Zap className="h-5 w-5 text-yellow-600" />
            Time-Saver Shortcuts
            <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
              <Clock className="h-3 w-3 mr-1" />
              Speed Up
            </Badge>
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
        
        <Input
          placeholder="Search shortcuts..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="h-9 text-sm"
        />
      </CardHeader>

      {isExpanded && (
        <CardContent className="pt-0">
          {/* Template-specific shortcuts */}
          {selectedTemplate && selectedTemplate !== 'all' && templateShortcuts.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                <Target className="h-4 w-4 text-teal-600" />
                {selectedTemplate} Template Shortcuts
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {templateShortcuts.map((shortcut, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 bg-teal-50 rounded-lg border border-teal-200"
                  >
                    <div className="flex-1 min-w-0">
                      <code className="text-xs font-mono font-bold text-teal-700">
                        {shortcut.shortcut}
                      </code>
                      <p className="text-xs text-teal-600 truncate">
                        {shortcut.expansion}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleUseShortcut(shortcut.shortcut, shortcut.expansion)}
                      className="h-6 px-2 text-xs bg-teal-100 hover:bg-teal-200 border-teal-300"
                    >
                      Use
                    </Button>
                  </div>
                ))}
              </div>
              <Separator className="my-3" />
            </div>
          )}

          <ScrollArea className="h-64">
            {filteredShortcuts.length > 0 ? (
              <div className="space-y-2">
                {filteredShortcuts.map(([key, value]) => {
                  const category = getShortcutCategory(value.code);
                  return (
                    <div
                      key={key}
                      className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200 hover:bg-slate-100 transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <code className="text-sm font-mono font-bold text-slate-700 bg-slate-200 px-2 py-1 rounded">
                            {key}
                          </code>
                          <Badge className={getCategoryColor(category)}>
                            {category}
                          </Badge>
                          {value.code !== category && (
                            <span className="text-xs text-slate-500 font-mono">
                              {value.code}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-slate-700 leading-relaxed">
                          {value.description}
                        </p>
                      </div>
                      <div className="flex gap-1 ml-3">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleCopyShortcut(key)}
                          className="h-8 w-8 p-0"
                        >
                          {copiedShortcut === key ? (
                            <Check className="h-3 w-3 text-green-600" />
                          ) : (
                            <Copy className="h-3 w-3" />
                          )}
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleUseShortcut(key, value.description)}
                          className="h-8 px-3 text-xs bg-yellow-600 hover:bg-yellow-700"
                        >
                          Use
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-slate-500">
                <Sparkles className="h-8 w-8 mx-auto mb-2 text-yellow-400" />
                <p className="text-sm">No shortcuts found</p>
                <p className="text-xs mt-1">Try a different search term</p>
              </div>
            )}
          </ScrollArea>
          
          <Separator className="my-3" />
          
          <div className="text-xs text-slate-500 space-y-1">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>ICD-10 codes</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Status</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                <span>Actions</span>
              </div>
            </div>
            <p className="mt-2 text-slate-400">
              Type shortcuts directly in your notes - they'll auto-expand as you type
            </p>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
