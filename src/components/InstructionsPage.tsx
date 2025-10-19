import { useState } from 'react';
import { 
  ArrowLeft, 
  BookOpen, 
  Mic, 
  Keyboard, 
  FileText, 
  Download,
  Shield,
  Zap,
  CheckCircle,
  AlertTriangle,
  Lightbulb,
  Target,
  Clock,
  Users,
  Settings,
  HelpCircle,
  Play,
  Pause,
  Square,
  Volume2,
  Eye,
  Edit3,
  Save
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';

interface InstructionsPageProps {
  onNavigate: (screen: string) => void;
}

export function InstructionsPage({ onNavigate }: InstructionsPageProps) {
  const [activeTab, setActiveTab] = useState('getting-started');

  const quickStartSteps = [
    {
      step: 1,
      title: "Choose Template",
      description: "Select SOAP, SBAR, PIE, or DAR format",
      icon: Target,
      color: "from-blue-500 to-cyan-500"
    },
    {
      step: 2,
      title: "Select Input Method",
      description: "Voice dictation, manual typing, or paste from EHR",
      icon: Mic,
      color: "from-emerald-500 to-teal-500"
    },
    {
      step: 3,
      title: "Create Note",
      description: "Speak, type, or paste your clinical observations",
      icon: FileText,
      color: "from-purple-500 to-violet-500"
    },
    {
      step: 4,
      title: "Review & Export",
      description: "Edit, review, and export to your preferred format",
      icon: Download,
      color: "from-orange-500 to-red-500"
    }
  ];

  const inputMethods = [
    {
      method: "Voice Dictation",
      icon: Mic,
      color: "from-blue-500 to-cyan-500",
      bestFor: "Hands-free documentation, natural speech patterns",
      tips: [
        "Speak clearly and at normal pace",
        "Use medical terminology naturally",
        "Include patient identifiers and vital signs",
        "Pause briefly between sections"
      ],
      accuracy: "99%",
      timeSaved: "3-5 minutes per note"
    },
    {
      method: "Manual Typing",
      icon: Keyboard,
      color: "from-emerald-500 to-teal-500",
      bestFor: "Precise control, offline work, complex cases",
      tips: [
        "Use structured format (Subjective, Objective, etc.)",
        "Include timestamps and measurements",
        "Use bullet points for clarity",
        "Save frequently with auto-save enabled"
      ],
      accuracy: "100%",
      timeSaved: "1-2 minutes per note"
    },
    {
      method: "Paste from EHR",
      icon: FileText,
      color: "from-purple-500 to-violet-500",
      bestFor: "Quick formatting, bulk processing, existing notes",
      tips: [
        "Copy complete note sections",
        "Include patient demographics",
        "Paste from Epic, Cerner, or other systems",
        "Review formatting after import"
      ],
      accuracy: "100%",
      timeSaved: "2-3 minutes per note"
    }
  ];

  const templates = [
    {
      name: "SOAP",
      fullName: "Subjective, Objective, Assessment, Plan",
      icon: Target,
      color: "from-blue-500 to-cyan-500",
      description: "Most common nursing documentation format",
      sections: [
        "Subjective: Patient complaints, symptoms, history",
        "Objective: Vital signs, physical findings, test results",
        "Assessment: Clinical judgment, nursing diagnosis",
        "Plan: Interventions, goals, follow-up care"
      ],
      bestFor: "General nursing, medical-surgical, outpatient care"
    },
    {
      name: "SBAR",
      fullName: "Situation, Background, Assessment, Recommendation",
      icon: AlertTriangle,
      color: "from-red-500 to-orange-500",
      description: "Communication tool for handoffs and urgent situations",
      sections: [
        "Situation: Current patient status, reason for communication",
        "Background: Relevant history, medications, allergies",
        "Assessment: Clinical findings, vital signs, concerns",
        "Recommendation: Suggested actions, orders, follow-up"
      ],
      bestFor: "Shift handoffs, critical care, emergency situations"
    },
    {
      name: "PIE",
      fullName: "Problem, Intervention, Evaluation",
      icon: CheckCircle,
      color: "from-emerald-500 to-teal-500",
      description: "Focused on nursing process and outcomes",
      sections: [
        "Problem: Nursing diagnosis or patient concern",
        "Intervention: Actions taken to address the problem",
        "Evaluation: Response to interventions, outcomes"
      ],
      bestFor: "Nursing care plans, long-term care, rehabilitation"
    },
    {
      name: "DAR",
      fullName: "Data, Action, Response",
      icon: FileText,
      color: "from-purple-500 to-violet-500",
      description: "Streamlined format for quick documentation",
      sections: [
        "Data: Objective and subjective information",
        "Action: Nursing interventions performed",
        "Response: Patient response to interventions"
      ],
      bestFor: "Quick notes, routine care, progress documentation"
    }
  ];

  const bestPractices = [
    {
      category: "Voice Dictation",
      icon: Mic,
      color: "from-blue-500 to-cyan-500",
      practices: [
        "Speak at normal pace - not too fast or slow",
        "Use clear pronunciation for medical terms",
        "Include specific measurements and times",
        "Pause between different sections",
        "Use punctuation commands: 'period', 'comma', 'new paragraph'"
      ]
    },
    {
      category: "Content Quality",
      icon: FileText,
      color: "from-emerald-500 to-teal-500",
      practices: [
        "Be specific with times and measurements",
        "Use objective language when possible",
        "Include patient response to interventions",
        "Document safety concerns immediately",
        "Follow facility documentation standards"
      ]
    },
    {
      category: "HIPAA Compliance",
      icon: Shield,
      color: "from-red-500 to-orange-500",
      practices: [
        "Never dictate in public areas",
        "Use headphones for voice input",
        "Review notes before sharing",
        "Enable No-PHI mode for sensitive cases",
        "Log out when finished"
      ]
    },
    {
      category: "Efficiency Tips",
      icon: Zap,
      color: "from-yellow-500 to-orange-500",
      practices: [
        "Set up voice shortcuts for common phrases",
        "Use templates for routine documentation",
        "Batch similar notes together",
        "Enable auto-save features",
        "Customize settings for your workflow"
      ]
    }
  ];

  return (
    <div className="mvp-app bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      {/* Mobile Header */}
      <div className="lg:hidden flex-shrink-0 p-3 bg-white/90 backdrop-blur-sm border-b border-slate-200">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onNavigate('home')}
            className="h-8 w-8 p-0"
          >
            <ArrowLeft className="h-3 w-3" />
          </Button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
              <BookOpen className="h-4 w-4 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900">Instructions</h1>
              <p className="text-xs text-slate-600">Learn to use NovaCare</p>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Header */}
      <div className="hidden lg:block flex-shrink-0 p-4 bg-white/90 backdrop-blur-sm border-b border-slate-200">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onNavigate('home')}
            className="h-9 w-9 p-0"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
              <BookOpen className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Instructions & Best Practices</h1>
              <p className="text-sm text-slate-600">Learn how to get the best results from NovaCare</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-3 lg:p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 mb-4 lg:mb-6 sticky top-0 z-10 bg-white">
            <TabsTrigger value="getting-started" className="text-xs lg:text-sm">Quick Start</TabsTrigger>
            <TabsTrigger value="input-methods" className="text-xs lg:text-sm">Input Methods</TabsTrigger>
            <TabsTrigger value="templates" className="text-xs lg:text-sm">Templates</TabsTrigger>
            <TabsTrigger value="best-practices" className="text-xs lg:text-sm">Best Practices</TabsTrigger>
          </TabsList>

          {/* Quick Start Tab */}
          <TabsContent value="getting-started" className="space-y-6 mt-4">
            <div className="text-center space-y-4 pt-2">
              <h2 className="text-xl lg:text-2xl font-bold text-slate-900">Get Started in 4 Easy Steps</h2>
              <p className="text-sm lg:text-base text-slate-600">Follow these steps to create your first AI-powered nursing note</p>
            </div>

            <div className="grid gap-4 lg:gap-6">
              {quickStartSteps.map((step) => {
                const Icon = step.icon;
                return (
                  <Card key={step.step} className="p-4 lg:p-6 border-2 border-slate-200 hover:border-blue-300 transition-colors">
                    <div className="flex items-start gap-4">
                      <div className={`w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-r ${step.color} rounded-xl flex items-center justify-center shadow-lg flex-shrink-0`}>
                        <Icon className="h-5 w-5 lg:h-6 lg:w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline" className="text-xs lg:text-sm">
                            Step {step.step}
                          </Badge>
                          <h3 className="text-base lg:text-lg font-semibold">{step.title}</h3>
                        </div>
                        <p className="text-sm lg:text-base text-slate-600">{step.description}</p>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>

            <Alert className="border-blue-200 bg-blue-50">
              <Lightbulb className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-sm text-blue-800">
                <strong>Pro Tip:</strong> Start with voice dictation for the fastest results. The AI learns your speech patterns and improves accuracy over time.
              </AlertDescription>
            </Alert>
          </TabsContent>

          {/* Input Methods Tab */}
          <TabsContent value="input-methods" className="space-y-6 mt-4">
            <div className="text-center space-y-4 pt-2">
              <h2 className="text-xl lg:text-2xl font-bold text-slate-900">Choose Your Input Method</h2>
              <p className="text-sm lg:text-base text-slate-600">Each method is optimized for different workflows and situations</p>
            </div>

            <div className="grid gap-4 lg:gap-6">
              {inputMethods.map((method) => {
                const Icon = method.icon;
                return (
                  <Card key={method.method} className="p-4 lg:p-6 border-2 border-slate-200">
                    <div className="space-y-4">
                      <div className="flex items-start gap-4">
                        <div className={`w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-r ${method.color} rounded-xl flex items-center justify-center shadow-lg flex-shrink-0`}>
                          <Icon className="h-5 w-5 lg:h-6 lg:w-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-base lg:text-lg font-semibold">{method.method}</h3>
                            <Badge variant="outline" className="text-xs">
                              {method.accuracy} accurate
                            </Badge>
                          </div>
                          <p className="text-sm lg:text-base text-slate-600 mb-3">{method.bestFor}</p>
                          
                          <div className="flex items-center gap-4 text-xs lg:text-sm text-slate-500">
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3 lg:h-4 lg:w-4" />
                              {method.timeSaved}
                            </div>
                            <div className="flex items-center gap-1">
                              <Zap className="h-3 w-3 lg:h-4 lg:w-4" />
                              Time Saved
                            </div>
                          </div>
                        </div>
                      </div>

                      <Separator />

                      <div className="space-y-3">
                        <h4 className="text-sm lg:text-base font-semibold text-slate-900">Best Practices:</h4>
                        <ul className="space-y-2">
                          {method.tips.map((tip, index) => (
                            <li key={index} className="flex items-start gap-2 text-sm lg:text-base text-slate-600">
                              <CheckCircle className="h-3 w-3 lg:h-4 lg:w-4 text-green-500 flex-shrink-0 mt-0.5" />
                              {tip}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* Templates Tab */}
          <TabsContent value="templates" className="space-y-6 mt-4">
            <div className="text-center space-y-4 pt-2">
              <h2 className="text-xl lg:text-2xl font-bold text-slate-900">Choose the Right Template</h2>
              <p className="text-sm lg:text-base text-slate-600">Each template is designed for specific nursing situations and documentation needs</p>
            </div>

            <div className="grid gap-4 lg:gap-6">
              {templates.map((template) => {
                const Icon = template.icon;
                return (
                  <Card key={template.name} className="p-4 lg:p-6 border-2 border-slate-200">
                    <div className="space-y-4">
                      <div className="flex items-start gap-4">
                        <div className={`w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-r ${template.color} rounded-xl flex items-center justify-center shadow-lg flex-shrink-0`}>
                          <Icon className="h-5 w-5 lg:h-6 lg:w-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-base lg:text-lg font-semibold">{template.name}</h3>
                            <Badge variant="outline" className="text-xs">
                              {template.fullName}
                            </Badge>
                          </div>
                          <p className="text-sm lg:text-base text-slate-600 mb-3">{template.description}</p>
                          
                          <div className="text-xs lg:text-sm text-slate-500">
                            <strong>Best for:</strong> {template.bestFor}
                          </div>
                        </div>
                      </div>

                      <Separator />

                      <div className="space-y-3">
                        <h4 className="text-sm lg:text-base font-semibold text-slate-900">Sections:</h4>
                        <ul className="space-y-2">
                          {template.sections.map((section, index) => (
                            <li key={index} className="flex items-start gap-2 text-sm lg:text-base text-slate-600">
                              <Target className="h-3 w-3 lg:h-4 lg:w-4 text-blue-500 flex-shrink-0 mt-0.5" />
                              {section}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* Best Practices Tab */}
          <TabsContent value="best-practices" className="space-y-6 mt-4">
            <div className="text-center space-y-4 pt-2">
              <h2 className="text-xl lg:text-2xl font-bold text-slate-900">Best Practices for Success</h2>
              <p className="text-sm lg:text-base text-slate-600">Follow these guidelines to maximize accuracy and efficiency</p>
            </div>

            <div className="grid gap-4 lg:gap-6">
              {bestPractices.map((category) => {
                const Icon = category.icon;
                return (
                  <Card key={category.category} className="p-4 lg:p-6 border-2 border-slate-200">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-r ${category.color} rounded-lg flex items-center justify-center shadow-lg`}>
                          <Icon className="h-4 w-4 lg:h-5 lg:w-5 text-white" />
                        </div>
                        <h3 className="text-base lg:text-lg font-semibold">{category.category}</h3>
                      </div>

                      <Separator />

                      <ul className="space-y-3">
                        {category.practices.map((practice, index) => (
                          <li key={index} className="flex items-start gap-3 text-sm lg:text-base text-slate-600">
                            <div className="w-5 h-5 lg:w-6 lg:h-6 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                              <span className="text-xs lg:text-sm font-bold text-white">{index + 1}</span>
                            </div>
                            {practice}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </Card>
                );
              })}
            </div>

            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-sm text-green-800">
                <strong>Remember:</strong> NovaCare is designed to enhance your workflow, not replace your clinical judgment. Always review and validate AI-generated content before finalizing notes.
              </AlertDescription>
            </Alert>
          </TabsContent>
        </Tabs>
      </div>

      {/* Mobile Action Buttons */}
      <div className="lg:hidden p-3 pb-24 space-y-2 bg-white/90 backdrop-blur-sm border-t border-slate-200">
        <div className="text-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onNavigate('home')}
            className="text-xs text-slate-500 hover:text-slate-700 h-7 px-2"
          >
            ← Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
}
