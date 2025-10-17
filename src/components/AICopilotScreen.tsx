import { useState } from 'react';
import {
  Brain,
  Video,
  TrendingUp,
  Globe,
  Plus,
  Search,
  Download,
  AlertTriangle,
  CheckCircle,
  Clock,
  Target,
  Heart,
  Activity,
  Shield,
  Languages,
  FileText,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { carePlanGenerator, type Diagnosis } from '@/lib/carePlanGenerator';
import { bedsideAssistService } from '@/lib/bedsideAssistService';
import { predictiveInsightsService } from '@/lib/predictiveInsightsService';
import { internationalSupportService, type SupportedLanguage } from '@/lib/internationalSupportService';
import { openaiService } from '@/lib/openaiService';

export function AICopilotScreen() {
  const [activeTab, setActiveTab] = useState('care-plans');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<SupportedLanguage>('en');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showCarePlanDialog, setShowCarePlanDialog] = useState(false);

  // Care Plans state
  const [carePlans, setCarePlans] = useState(carePlanGenerator.getAllCarePlans());

  // Bedside Assist state
  const [bedsideSession, setBedsideSession] = useState(bedsideAssistService.getCurrentSession());

  // Predictive Insights state
  const [insights, setInsights] = useState(predictiveInsightsService.getAllInsights());

  // International Support state
  const [languages] = useState(internationalSupportService.getSupportedLanguages());

  // Care plan form state
  const [diagnosisCode, setDiagnosisCode] = useState('I50.9');
  const [diagnosisName, setDiagnosisName] = useState('Heart Failure');
  const [severity, setSeverity] = useState<'mild' | 'moderate' | 'severe'>('moderate');

  const handleGenerateCarePlan = async () => {
    if (!diagnosisName) {
      toast.error('Please enter a diagnosis');
      return;
    }

    setIsGenerating(true);
    const diagnosis: Diagnosis = {
      code: diagnosisCode,
      name: diagnosisName,
      category: 'General',
      severity: severity
    };

    try {
      await carePlanGenerator.generateCarePlan(diagnosis);
      setCarePlans(carePlanGenerator.getAllCarePlans());
      setShowCarePlanDialog(false);
      toast.success('Care plan generated successfully!');
    } catch (error) {
      toast.error('Failed to generate care plan');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleStartBedsideSession = async () => {
    try {
      await bedsideAssistService.startSession();
      toast.success('Bedside assist session started!');
    } catch (error) {
      toast.error('Failed to start session');
    }
  };

  const handleChangeLanguage = (lang: string) => {
    internationalSupportService.setLanguage(lang as SupportedLanguage);
    setSelectedLanguage(lang as SupportedLanguage);
    toast.success(`Language changed to ${lang.toUpperCase()}`);
  };

  return (
    <div className="h-full overflow-y-auto p-4 lg:p-8 space-y-6 lg:space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-2">
            <Brain className="h-8 w-8 text-teal-600" />
            AI Nurse Copilot
          </h1>
          <p className="text-sm lg:text-base text-slate-600 mt-1">
            Your intelligent assistant for care planning, bedside rounds, and predictive insights
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={selectedLanguage} onValueChange={handleChangeLanguage}>
            <SelectTrigger className="w-40">
              <Languages className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {languages.map((lang) => (
                <SelectItem key={lang.code} value={lang.code}>
                  {lang.nativeName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
          <TabsTrigger value="care-plans" className="text-xs lg:text-sm">
            <Heart className="h-4 w-4 mr-2" />
            Care Plans
          </TabsTrigger>
          <TabsTrigger value="bedside" className="text-xs lg:text-sm">
            <Video className="h-4 w-4 mr-2" />
            Bedside Assist
          </TabsTrigger>
          <TabsTrigger value="insights" className="text-xs lg:text-sm">
            <TrendingUp className="h-4 w-4 mr-2" />
            Insights
          </TabsTrigger>
          <TabsTrigger value="international" className="text-xs lg:text-sm">
            <Globe className="h-4 w-4 mr-2" />
            International
          </TabsTrigger>
        </TabsList>

        {/* Care Plans Tab */}
        <TabsContent value="care-plans" className="space-y-6 mt-6">
          <div className="flex flex-col lg:flex-row gap-4 lg:justify-between">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search care plans..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Dialog open={showCarePlanDialog} onOpenChange={setShowCarePlanDialog}>
              <DialogTrigger asChild>
                <Button
                  className="bg-gradient-to-b from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 shadow-lg shadow-teal-500/30"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Generate Care Plan
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Generate Care Plan</DialogTitle>
                  <DialogDescription>
                    Create an AI-powered personalized care plan based on diagnosis
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="diagnosis-code">ICD-10 Code</Label>
                    <Input
                      id="diagnosis-code"
                      value={diagnosisCode}
                      onChange={(e) => setDiagnosisCode(e.target.value)}
                      placeholder="e.g., I50.9"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="diagnosis-name">Diagnosis Name</Label>
                    <Input
                      id="diagnosis-name"
                      value={diagnosisName}
                      onChange={(e) => setDiagnosisName(e.target.value)}
                      placeholder="e.g., Heart Failure"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="severity">Severity</Label>
                    <Select value={severity} onValueChange={(v: any) => setSeverity(v)}>
                      <SelectTrigger id="severity">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mild">Mild</SelectItem>
                        <SelectItem value="moderate">Moderate</SelectItem>
                        <SelectItem value="severe">Severe</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {!import.meta.env.VITE_OPENAI_API_KEY && !localStorage.getItem('openai_api_key') && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <p className="text-xs text-blue-800">
                        <strong>ℹ️ Info:</strong> Using evidence-based care plan templates. Add OpenAI API key in Settings for AI-powered personalization.
                      </p>
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowCarePlanDialog(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleGenerateCarePlan}
                    disabled={isGenerating}
                    className="flex-1 bg-gradient-to-b from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Brain className="h-4 w-4 mr-2" />
                        Generate with AI
                      </>
                    )}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {carePlans.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Heart className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-900 mb-2">No Care Plans Yet</h3>
                <p className="text-slate-600 mb-4">
                  Generate personalized care plans based on patient diagnoses
                </p>
                <Button onClick={() => setShowCarePlanDialog(true)} variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Create First Care Plan
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 lg:gap-6">
              {carePlans.map((plan) => (
                <Card key={plan.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{plan.diagnosis.name}</CardTitle>
                        <CardDescription>
                          {plan.diagnosis.code} • {plan.diagnosis.severity} severity
                        </CardDescription>
                      </div>
                      <Badge
                        className={
                          plan.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : plan.status === 'completed'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-800'
                        }
                      >
                        {plan.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-sm mb-2">Goals ({plan.goals.length})</h4>
                      <div className="space-y-2">
                        {plan.goals.slice(0, 2).map((goal) => (
                          <div key={goal.id} className="flex items-start gap-2">
                            {goal.achieved ? (
                              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                            ) : (
                              <Target className="h-4 w-4 text-blue-600 mt-0.5" />
                            )}
                            <div className="flex-1">
                              <p className="text-sm">{goal.description}</p>
                              <p className="text-xs text-slate-500">
                                Target: {goal.targetDate.toLocaleDateString()}
                              </p>
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {goal.priority}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h4 className="font-semibold text-sm mb-2">
                        Interventions ({plan.interventions.length})
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {plan.interventions.slice(0, 3).map((intervention) => (
                          <Badge key={intervention.id} variant="outline">
                            {intervention.category}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        <FileText className="h-4 w-4 mr-2" />
                        View Full Plan
                      </Button>
                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Export
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Bedside Assist Tab */}
        <TabsContent value="bedside" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Video className="h-5 w-5 text-blue-600" />
                Real-Time Bedside Assistant
              </CardTitle>
              <CardDescription>
                AI-powered assistance during patient rounds with smart suggestions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!bedsideSession ? (
                <div className="text-center py-8">
                  <Video className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Start a Bedside Session</h3>
                  <p className="text-slate-600 mb-4">
                    Real-time AI listening with smart suggestions and alerts
                  </p>
                  <Button onClick={handleStartBedsideSession}>
                    <Video className="h-4 w-4 mr-2" />
                    Start Session
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                      <span className="font-semibold text-green-900">Session Active</span>
                    </div>
                    <Badge className="bg-green-100 text-green-800">
                      {Math.floor(
                        (new Date().getTime() - bedsideSession.startTime.getTime()) / 60000
                      )}{' '}
                      min
                    </Badge>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <Card>
                      <CardContent className="p-4 text-center">
                        <p className="text-2xl font-bold text-blue-900">
                          {bedsideSession.notes.length}
                        </p>
                        <p className="text-xs text-slate-600">Notes Captured</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <p className="text-2xl font-bold text-purple-900">
                          {bedsideSession.suggestions.length}
                        </p>
                        <p className="text-xs text-slate-600">Suggestions</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <p className="text-2xl font-bold text-red-900">
                          {bedsideSession.alerts.length}
                        </p>
                        <p className="text-xs text-slate-600">Alerts</p>
                      </CardContent>
                    </Card>
                  </div>

                  {bedsideSession.alerts.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-semibold text-sm">Active Alerts</h4>
                      {bedsideSession.alerts.slice(0, 3).map((alert) => (
                        <div
                          key={alert.id}
                          className={`p-3 rounded-lg ${
                            alert.severity === 'critical'
                              ? 'bg-red-50 border border-red-200'
                              : alert.severity === 'warning'
                              ? 'bg-yellow-50 border border-yellow-200'
                              : 'bg-blue-50 border border-blue-200'
                          }`}
                        >
                          <div className="flex items-start gap-2">
                            <AlertTriangle
                              className={`h-4 w-4 mt-0.5 ${
                                alert.severity === 'critical'
                                  ? 'text-red-600'
                                  : alert.severity === 'warning'
                                  ? 'text-yellow-600'
                                  : 'text-blue-600'
                              }`}
                            />
                            <div className="flex-1">
                              <p className="text-sm font-medium">{alert.message}</p>
                              <p className="text-xs text-slate-500 mt-1">
                                {alert.timestamp.toLocaleTimeString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1">
                      Pause Session
                    </Button>
                    <Button variant="destructive">End Session</Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Predictive Insights Tab */}
        <TabsContent value="insights" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-red-700">Critical Insights</p>
                    <p className="text-2xl font-bold text-red-900">
                      {predictiveInsightsService.getCriticalInsights().length}
                    </p>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-red-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-yellow-700">Early Warnings</p>
                    <p className="text-2xl font-bold text-yellow-900">
                      {insights.filter((i) => i.type === 'early_warning').length}
                    </p>
                  </div>
                  <Shield className="h-8 w-8 text-yellow-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-700">Risk Assessments</p>
                    <p className="text-2xl font-bold text-blue-900">
                      {insights.filter((i) => i.type === 'complication_risk').length}
                    </p>
                  </div>
                  <Activity className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-700">Avg Confidence</p>
                    <p className="text-2xl font-bold text-green-900">
                      {insights.length > 0
                        ? Math.round(
                            (insights.reduce((acc, i) => acc + i.confidence, 0) /
                              insights.length) *
                              100
                          )
                        : 0}
                      %
                    </p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {insights.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <TrendingUp className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-900 mb-2">No Insights Yet</h3>
                <p className="text-slate-600">
                  Predictive insights will appear here as you create notes
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {insights.slice(0, 5).map((insight) => (
                <Card
                  key={insight.id}
                  className={`border-l-4 ${
                    insight.severity === 'critical'
                      ? 'border-l-red-500'
                      : insight.severity === 'high'
                      ? 'border-l-orange-500'
                      : insight.severity === 'medium'
                      ? 'border-l-yellow-500'
                      : 'border-l-blue-500'
                  }`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold">{insight.title}</h4>
                          <Badge
                            className={
                              insight.severity === 'critical'
                                ? 'bg-red-100 text-red-800'
                                : insight.severity === 'high'
                                ? 'bg-orange-100 text-orange-800'
                                : insight.severity === 'medium'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-blue-100 text-blue-800'
                            }
                          >
                            {insight.severity}
                          </Badge>
                        </div>
                        <p className="text-sm text-slate-600 mb-2">{insight.description}</p>
                        <p className="text-xs text-slate-500">
                          Confidence: {Math.round(insight.confidence * 100)}% •{' '}
                          {insight.timestamp.toLocaleString()}
                        </p>
                      </div>
                    </div>

                    {insight.indicators.length > 0 && (
                      <div className="mb-3">
                        <p className="text-xs font-semibold text-slate-700 mb-1">Indicators:</p>
                        <div className="flex flex-wrap gap-1">
                          {insight.indicators.map((indicator, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {indicator}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {insight.recommendations.length > 0 && (
                      <div>
                        <p className="text-xs font-semibold text-slate-700 mb-2">
                          Recommendations:
                        </p>
                        <ul className="space-y-1">
                          {insight.recommendations.slice(0, 3).map((rec, i) => (
                            <li key={i} className="text-xs text-slate-600 flex items-start gap-2">
                              <CheckCircle className="h-3 w-3 text-green-600 mt-0.5 flex-shrink-0" />
                              {rec}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* International Tab */}
        <TabsContent value="international" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Languages className="h-5 w-5 text-purple-600" />
                  Language Support
                </CardTitle>
                <CardDescription>
                  Support for {languages.length} languages with medical terminology
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {languages.map((lang) => (
                    <Button
                      key={lang.code}
                      variant={selectedLanguage === lang.code ? 'default' : 'outline'}
                      className="justify-start"
                      onClick={() => handleChangeLanguage(lang.code)}
                    >
                      <Globe className="h-4 w-4 mr-2" />
                      {lang.nativeName}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-blue-600" />
                  ICD-11 Support
                </CardTitle>
                <CardDescription>
                  International classification of diseases (ICD-11)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Search ICD-11 codes..."
                    className="pl-10"
                  />
                </div>
                <div className="space-y-2">
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <p className="font-semibold text-sm">BA40 - Heart Failure</p>
                    <p className="text-xs text-slate-600">
                      Inability of heart to pump sufficient blood
                    </p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <p className="font-semibold text-sm">5A11 - Type 2 Diabetes</p>
                    <p className="text-xs text-slate-600">Diabetes due to insulin resistance</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
