import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Play, Shield, Clock, Users, CheckCircle, Star, Quote, Zap, Target, Award, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';

export function LandingPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isDemoOpen, setIsDemoOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>('traditional');

  const handleGetStarted = () => {
    // Navigate to auth page for sign up
    navigate('/auth');
  };

  const handleStartFreeTrial = (plan?: string) => {
    // Navigate to auth page for sign up with optional plan pre-selection
    const url = plan ? `/auth?plan=${plan}` : '/auth';
    navigate(url);
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Template data for interactive showcase
  const getTemplatesForCategory = (category: string | null) => {
    const templates = {
      traditional: [
        { name: 'SOAP Notes', description: 'Subjective, Objective, Assessment, Plan format for comprehensive patient documentation', icon: '📋', color: 'from-blue-500 to-cyan-500', useCase: 'General Practice' },
        { name: 'SBAR Reports', description: 'Situation, Background, Assessment, Recommendation for clear handoffs', icon: '📞', color: 'from-blue-500 to-cyan-500', useCase: 'Shift Reports' },
        { name: 'PIE Notes', description: 'Problem, Intervention, Evaluation framework for focused charting', icon: '🎯', color: 'from-blue-500 to-cyan-500', useCase: 'Problem-Solving' },
        { name: 'DAR Notes', description: 'Data, Action, Response format for documenting patient responses', icon: '📊', color: 'from-blue-500 to-cyan-500', useCase: 'Response Tracking' }
      ],
      epic: [
        { name: 'Shift Assessment', description: 'Comprehensive head-to-toe assessment for Epic EMR integration', icon: '📋', color: 'from-purple-500 to-pink-500', useCase: 'Epic Systems' },
        { name: 'Medication Admin', description: 'MAR documentation with Epic medication reconciliation', icon: '💊', color: 'from-purple-500 to-pink-500', useCase: 'Medication Mgmt' },
        { name: 'Intake & Output', description: 'Fluid balance tracking integrated with Epic flowsheets', icon: '💧', color: 'from-purple-500 to-pink-500', useCase: 'Fluid Balance' },
        { name: 'Wound Care', description: 'Comprehensive wound assessment and treatment documentation', icon: '🩹', color: 'from-purple-500 to-pink-500', useCase: 'Wound Care' },
        { name: 'Safety Checklist', description: 'Fall risk and infection control assessments for Epic', icon: '🛡️', color: 'from-purple-500 to-pink-500', useCase: 'Safety Protocols' }
      ],
      specialty: [
        { name: 'Medical-Surgical', description: 'Adult medical-surgical unit documentation and care planning', icon: '🏥', color: 'from-teal-500 to-cyan-500', useCase: 'Med-Surg Units' },
        { name: 'Intensive Care', description: 'Critical care documentation for ICU patient management', icon: '🚑', color: 'from-teal-500 to-cyan-500', useCase: 'Critical Care' },
        { name: 'Neonatal ICU', description: 'Specialized documentation for premature and newborn care', icon: '👶', color: 'from-teal-500 to-cyan-500', useCase: 'NICU Care' },
        { name: 'Obstetrics', description: 'Maternal and newborn care documentation', icon: '🤰', color: 'from-teal-500 to-cyan-500', useCase: 'OB Care' }
      ]
    };

    return category ? templates[category as keyof typeof templates] || [] : [];
  };

  // Memoized data to prevent unnecessary re-renders
  const features = useMemo(() => [
    {
      icon: <Zap className="h-6 w-6" />,
      title: 'AI-Powered Transcription',
      description: 'Convert voice to text with 99% accuracy using advanced Whisper technology',
      benefit: 'Save 15-20 minutes per note'
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: 'HIPAA-Compliant Security',
      description: 'Enterprise-grade encryption and privacy protection built-in',
      benefit: 'Zero PHI exposure risk'
    },
    {
      icon: <Target className="h-6 w-6" />,
      title: 'Smart Note Generation',
      description: 'Transform transcripts into structured SOAP, SBAR, and PIE notes',
      benefit: 'Professional documentation standards'
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: 'EHR Integration',
      description: 'Export directly to Epic, Cerner, AllScripts, and other major systems',
      benefit: 'Seamless workflow integration'
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: 'Team Collaboration',
      description: 'Share notes, templates, and best practices across your organization',
      benefit: 'Standardized documentation'
    },
    {
      icon: <Award className="h-6 w-6" />,
      title: 'Education Mode',
      description: 'Training scenarios and competency tracking for nursing schools',
      benefit: 'Enhanced learning outcomes'
    }
  ], []);

  const testimonials = useMemo(() => [
    {
      name: 'Dr. Sarah Johnson, RN',
      title: 'Chief Nursing Officer, General Hospital',
      content: 'Raha has reduced our documentation time by 40% while improving note quality. Our nurses love the voice commands and seamless EHR integration.',
      rating: 5,
      hospital: 'General Hospital'
    },
    {
      name: 'Michael Chen, MSN',
      title: 'Nursing Education Director, University Medical Center',
      content: 'The education mode is incredible. Our students are better prepared for clinical practice with realistic scenarios and instant feedback.',
      rating: 5,
      hospital: 'University Medical Center'
    },
    {
      name: 'Lisa Rodriguez, RN',
      title: 'Emergency Department Manager, City Hospital',
      content: 'HIPAA compliance was our biggest concern, but Raha handles everything securely. The redaction features give us complete confidence.',
      rating: 5,
      hospital: 'City Hospital'
    }
  ], []);

  const stats = useMemo(() => [
    { number: '15,000+', label: 'Nurses Using Raha' },
    { number: '2.5M+', label: 'Notes Generated' },
    { number: '40%', label: 'Time Saved on Documentation' },
    { number: '99.9%', label: 'HIPAA Compliance Rate' }
  ], []);

  const pricingPlans = useMemo(() => [
    {
      name: 'Individual',
      price: '$29',
      period: '/month',
      description: 'Perfect for individual nurses and small practices',
      features: [
        'Unlimited voice transcription',
        'AI note generation',
        'Basic EHR exports',
        'HIPAA compliance',
        'Email support'
      ],
      popular: false
    },
    {
      name: 'Team',
      price: '$19',
      period: '/user/month',
      description: 'Ideal for departments and medium-sized organizations',
      features: [
        'Everything in Individual',
        'Team collaboration',
        'Advanced analytics',
        'Custom templates',
        'Priority support',
        'Admin dashboard'
      ],
      popular: true
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: '',
      description: 'For large hospitals and health systems',
      features: [
        'Everything in Team',
        'Custom integrations',
        'On-premise deployment',
        'Dedicated support',
        'SLA guarantees',
        'Custom training'
      ],
      popular: false
    }
  ], []);

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 glass border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="text-left">
                <span className="text-2xl font-bold" style={{ color: '#60baa2' }}>Raha</span>
                <p className="text-xs text-muted-foreground leading-none">AI-Powered Clinical Documentation</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={() => scrollToSection('features')}>Features</Button>
              <Button variant="ghost" onClick={() => scrollToSection('pricing')}>Pricing</Button>
              <Button variant="ghost" onClick={() => scrollToSection('about')}>About</Button>
              <Button onClick={() => handleStartFreeTrial()}>Get Started</Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge className="bg-primary/10 text-primary border-primary/20">
                  🚀 Reduce documentation time by 40%
                </Badge>
                <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                  AI-Powered Voice
                  <span className="text-gradient-primary"> Documentation </span>
                  for Healthcare
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  Transform how nurses document patient care with voice-to-text AI,
                  smart note generation, and seamless EHR integration. HIPAA-compliant
                  and designed for healthcare professionals.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="h-14 px-8 text-lg font-semibold" onClick={() => handleStartFreeTrial()}>
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="h-14 px-8 text-lg"
                  onClick={() => setIsDemoOpen(true)}
                >
                  <Play className="mr-2 h-5 w-5" />
                  Watch Demo
                </Button>
              </div>

              <div className="flex items-center gap-8 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-success" />
                  HIPAA Compliant
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-success" />
                  30-Day Free Trial
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-success" />
                  No Setup Required
                </div>
              </div>
            </div>

            <div className="relative">
              <Card className="relative card-premium p-4 shadow-2xl border border-primary/20 bg-card/95 backdrop-blur-sm">
                <div className="space-y-3">
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse shadow-sm shadow-green-500/50"></div>
                      <span className="text-sm font-semibold">Raha Clinical Documentation</span>
                    </div>
                    <div className="text-xs font-mono text-primary font-medium">99.7% accuracy</div>
                  </div>

                  {/* Vertical Process Flow */}
                  <div className="space-y-2">
                    {/* Step 1: Voice Input */}
                    <div className="flex items-start gap-3 p-3 bg-gradient-to-r from-blue-50/60 to-cyan-50/60 dark:from-blue-950/30 dark:to-cyan-950/30 rounded-lg border border-blue-200/50 dark:border-blue-800/50">
                      <div className="flex-shrink-0 mt-0.5">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center shadow-md">
                          <svg className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 1c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2s2-.9 2-2V3c0-1.1-.9-2-2-2zm0 16c-2.76 0-5-2.24-5-5V9c0-.55-.45-1-1-1s-1 .45-1 1v3c0 3.87 3.13 7 7 7s7-3.13 7-7V9c0-.55-.45-1-1-1s-1 .45-1 1v3c0 2.76-2.24 5-5 5z"/>
                          </svg>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <span className="text-sm font-semibold text-blue-700 dark:text-blue-300">Voice Transcription</span>
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></div>
                        </div>
                        <p className="text-xs text-muted-foreground mb-1.5">Converting speech to text with medical terminology recognition</p>
                        <div className="flex items-end gap-0.5 h-4 bg-muted/30 rounded px-1.5">
                          {[...Array(10)].map((_, i) => (
                            <div
                              key={i}
                              className="flex-1 bg-blue-400/70 rounded-t-sm animate-waveform"
                              style={{
                                height: `${Math.sin(i * 0.6) * 8 + 12}px`,
                                animationDelay: `${i * 0.07}s`,
                                animationDuration: '1.3s'
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Connection Arrow */}
                    <div className="flex justify-center py-1">
                      <div className="w-0.5 h-3 bg-gradient-to-b from-blue-400 to-purple-400 rounded-full"></div>
                    </div>

                    {/* Step 2: AI Processing */}
                    <div className="flex items-start gap-3 p-3 bg-gradient-to-r from-purple-50/60 to-pink-50/60 dark:from-purple-950/30 dark:to-pink-950/30 rounded-lg border border-purple-200/50 dark:border-purple-800/50">
                      <div className="flex-shrink-0 mt-0.5">
                        <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center shadow-md">
                          <svg className="h-4 w-4 text-white animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                          </svg>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <span className="text-sm font-semibold text-purple-700 dark:text-purple-300">AI Analysis & Formatting</span>
                          <div className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-pulse"></div>
                        </div>
                        <p className="text-xs text-muted-foreground mb-2">Processing clinical context and structuring into professional documentation</p>

                        {/* Template Selection */}
                        <div className="space-y-1">
                          <div className="text-xs font-medium text-muted-foreground">13 Templates Available</div>
                          <div className="flex flex-wrap gap-0.5">
                            {['SOAP', 'SBAR', 'PIE', 'DAR', 'Shift', 'MAR', 'I&O', 'Wound', 'Safety', 'Med-Surg', 'ICU', 'NICU', 'OB'].map((template, i) => (
                              <div
                                key={template}
                                className={`text-[6px] px-1 py-0.5 rounded border transition-all duration-300 ${
                                  i < 13
                                    ? 'bg-purple-100 border-purple-300 text-purple-800 dark:bg-purple-900/40 dark:border-purple-700 dark:text-purple-200'
                                    : 'bg-muted/50 border-muted text-muted-foreground'
                                }`}
                                style={{ animationDelay: `${i * 0.02}s` }}
                              >
                                {template}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Connection Arrow */}
                    <div className="flex justify-center py-1">
                      <div className="w-0.5 h-3 bg-gradient-to-b from-purple-400 to-green-400 rounded-full"></div>
                    </div>

                    {/* Step 3: Final Output */}
                    <div className="flex items-start gap-3 p-3 bg-gradient-to-r from-green-50/60 to-emerald-50/60 dark:from-green-950/30 dark:to-emerald-950/30 rounded-lg border border-green-200/50 dark:border-green-800/50">
                      <div className="flex-shrink-0 mt-0.5">
                        <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center shadow-md">
                          <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <span className="text-sm font-semibold text-green-700 dark:text-green-300">Clinical Note Generated</span>
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                        </div>
                        <p className="text-xs text-muted-foreground mb-2">Professional documentation ready for EHR systems</p>

                        {/* EHR Integration */}
                        <div className="flex gap-1.5">
                          {['Epic', 'Cerner', 'AllScripts'].map((ehr) => (
                            <div
                              key={ehr}
                              className="text-xs px-2 py-0.5 bg-green-100 border border-green-300 text-green-800 dark:bg-green-900/40 dark:border-green-700 dark:text-green-200 rounded font-medium"
                            >
                              {ehr}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Footer Status */}
                  <div className="flex justify-between items-center pt-2 border-t border-border/30">
                    <div className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-xs text-muted-foreground font-medium">HIPAA Compliant</span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Processing: <span className="font-mono text-primary font-medium">2.1s</span>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                  {stat.number}
                </div>
                <div className="text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold">
              Complete Clinical Documentation
              <span className="text-gradient-primary"> Solution</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              From voice transcription to EHR integration, Raha provides
              a complete solution for modern healthcare documentation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                <div className="space-y-4">
                  <div className="w-12 h-12 bg-gradient-primary/10 rounded-xl flex items-center justify-center text-primary">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground mb-3">{feature.description}</p>
                    <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                      {feature.benefit}
                    </Badge>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Templates Showcase - Modern & Animated */}
      <section className="py-12 md:py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50/80 via-blue-50/40 to-indigo-50/60 dark:from-slate-900/80 dark:via-blue-950/40 dark:to-indigo-950/60">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-4 mb-8 md:mb-12">
            <Badge className="bg-primary/10 text-primary border-primary/20 mb-2 animate-pulse">
              🏥 Epic-Compliant Documentation
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold">
              13 Professional Documentation
              <span className="text-gradient-primary"> Templates</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Complete template library for every nursing specialty and Epic EMR workflow.
              Click categories to explore templates with smooth animations.
            </p>
          </div>

          {/* Interactive Template Categories */}
          <div className="space-y-6">
            {/* Category Tabs */}
            <div className="flex flex-wrap justify-center gap-2 md:gap-4 mb-8">
              {[
                { id: 'traditional', name: 'Traditional', count: 4, color: 'from-blue-500 to-cyan-500', icon: '📋' },
                { id: 'epic', name: 'Epic EMR', count: 5, color: 'from-purple-500 to-pink-500', icon: '🏥' },
                { id: 'specialty', name: 'Unit-Specific', count: 4, color: 'from-teal-500 to-cyan-500', icon: '⚕️' }
              ].map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(activeCategory === category.id ? null : category.id)}
                  className={`px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-300 transform hover:scale-105 ${
                    activeCategory === category.id
                      ? 'bg-gradient-to-r ' + category.color + ' text-white shadow-lg scale-105'
                      : 'bg-white/80 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 shadow-md'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span className="text-lg">{category.icon}</span>
                    {category.name}
                    <span className={`px-2 py-0.5 rounded-full text-xs ${
                      activeCategory === category.id
                        ? 'bg-white/20 text-white'
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                    }`}>
                      {category.count}
                    </span>
                  </span>
                </button>
              ))}
            </div>

            {/* Animated Template Grid */}
            <div className={`transition-all duration-500 ease-in-out ${
              activeCategory ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
            }`}>
              <div className={`grid gap-4 md:gap-6 ${
                activeCategory === 'epic'
                  ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'
                  : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
              }`}>
                {getTemplatesForCategory(activeCategory).map((template, index) => (
                  <Card
                    key={template.name}
                    className={`group cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl border-2 ${
                      activeCategory === 'traditional' ? 'hover:border-blue-300' :
                      activeCategory === 'epic' ? 'hover:border-purple-300' :
                      'hover:border-teal-300'
                    } bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm`}
                    style={{
                      animationDelay: `${index * 100}ms`,
                      animation: activeCategory ? 'fadeInUp 0.5s ease-out forwards' : 'none'
                    }}
                  >
                    <div className="p-4 md:p-6">
                      <div className="text-center space-y-4">
                        {/* Animated Icon */}
                        <div className={`w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br ${template.color} rounded-2xl flex items-center justify-center text-2xl md:text-3xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg mx-auto`}>
                          {template.icon}
                        </div>

                        {/* Template Info */}
                        <div className="space-y-2">
                          <h3 className="font-bold text-lg text-slate-800 dark:text-slate-200 group-hover:text-primary transition-colors">
                            {template.name}
                          </h3>
                          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                            {template.description}
                          </p>
                          <div className="flex items-center justify-center gap-2 pt-2">
                            <Badge variant="outline" className="text-xs bg-primary/5 text-primary border-primary/20">
                              {template.useCase}
                            </Badge>
                          </div>
                        </div>

                        {/* Hover Effect Indicator */}
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="w-full h-1 bg-gradient-to-r from-primary/20 to-primary/40 rounded-full"></div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Call to Action when no category selected */}
            {!activeCategory && (
              <div className="text-center py-8">
                <div className="inline-flex items-center gap-3 px-6 py-4 bg-white/60 dark:bg-slate-800/60 rounded-2xl shadow-lg backdrop-blur-sm">
                  <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
                  <span className="text-slate-700 dark:text-slate-300 font-medium">
                    Click any category above to explore our professional templates
                  </span>
                  <ArrowRight className="h-4 w-4 text-primary animate-bounce" />
                </div>
              </div>
            )}
          </div>

          {/* Professional Trust Indicators - With Proper Spacing */}
          <div className="pt-8 md:pt-12 border-t border-border/30">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              <div className="text-center space-y-3">
                <div className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
                  <Shield className="h-7 w-7 md:h-8 md:w-8 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-2">HIPAA Compliant</h3>
                  <p className="text-sm text-muted-foreground">End-to-end encryption with zero PHI exposure. SOC 2 Type II certified.</p>
                </div>
              </div>

              <div className="text-center space-y-3">
                <div className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
                  <svg className="h-7 w-7 md:h-8 md:w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-2">99.7% Accuracy</h3>
                  <p className="text-sm text-muted-foreground">Advanced AI trained on millions of clinical notes with continuous learning.</p>
                </div>
              </div>

              <div className="text-center space-y-3">
                <div className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
                  <svg className="h-7 w-7 md:h-8 md:w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-2">EHR Integration</h3>
                  <p className="text-sm text-muted-foreground">Seamless export to Epic, Cerner, AllScripts, and 200+ other EHR systems.</p>
                </div>
              </div>

              <div className="text-center space-y-3">
                <div className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
                  <svg className="h-7 w-7 md:h-8 md:w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-2">Nurse-Designed</h3>
                  <p className="text-sm text-muted-foreground">Created by practicing nurses with 50+ years of combined clinical experience.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center mt-8 md:mt-12">
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-primary/10 border border-primary/20 rounded-full">
              <CheckCircle className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium text-primary">Trusted by 15,000+ nurses across 500+ hospitals</span>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="about" className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold">
              Trusted by Healthcare
              <span className="text-gradient-primary"> Professionals</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              See what nurses, administrators, and educators are saying about Raha.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-all duration-300">
                <div className="space-y-4">
                  <div className="flex items-center gap-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-warning text-warning" />
                    ))}
                  </div>
                  <Quote className="h-8 w-8 text-primary/50" />
                  <p className="text-muted-foreground">{testimonial.content}</p>
                  <div className="pt-4 border-t border-border/50">
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.title}</div>
                    <div className="text-sm font-medium text-primary">{testimonial.hospital}</div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold">
              Simple, Transparent
              <span className="text-gradient-primary"> Pricing</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Choose the plan that fits your organization. All plans include HIPAA compliance
              and core features. Start with a 30-day free trial.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <Card key={index} className={`p-8 relative ${plan.popular ? 'border-primary shadow-lg scale-105' : ''} hover:shadow-xl transition-all duration-300`}>
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-primary">
                    Most Popular
                  </Badge>
                )}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-2xl font-bold">{plan.name}</h3>
                    <div className="flex items-baseline gap-2 mt-2">
                      <span className="text-4xl font-bold">{plan.price}</span>
                      <span className="text-muted-foreground">{plan.period}</span>
                    </div>
                    <p className="text-muted-foreground mt-2">{plan.description}</p>
                  </div>

                  <ul className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center gap-3">
                        <CheckCircle className="h-4 w-4 text-success flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    className={`w-full ${plan.popular ? 'bg-gradient-primary hover:scale-105' : ''} transition-all duration-300`}
                    variant={plan.popular ? 'default' : 'outline'}
                    onClick={plan.name === 'Enterprise' ? () => window.open('mailto:sales@raha.health?subject=Enterprise%20Inquiry', '_blank') : () => handleStartFreeTrial(plan.name.toLowerCase())}
                  >
                    {plan.name === 'Enterprise' ? 'Contact Sales' : 'Start Free Trial'}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Professional CTA Section */}
      <section className="relative py-16 md:py-20 px-4 sm:px-6 lg:px-8 bg-teal-700 overflow-hidden">
        <div className="relative max-w-4xl mx-auto text-center">
          <div className="space-y-8">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/30 shadow-lg">
                <Zap className="h-4 w-4 text-white" />
                <span className="text-sm font-medium text-white" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}>Join 15,000+ Healthcare Professionals</span>
              </div>

              <h2 className="text-3xl md:text-5xl font-bold text-white leading-tight" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.4)' }}>
                Ready to Transform Your
                Documentation Workflow?
              </h2>

              <p className="text-lg md:text-xl text-white/95 max-w-2xl mx-auto leading-relaxed" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}>
                Experience the future of clinical documentation with AI-powered voice transcription,
                intelligent note generation, and seamless EHR integration.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-lg mx-auto">
              <Input
                type="email"
                placeholder="Enter your work email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:border-white/40"
              />
              <Button
                size="lg"
                className="h-12 px-8 bg-white text-slate-900 hover:bg-white/90 font-semibold shadow-lg"
                onClick={handleGetStarted}
              >
                Start Free Trial
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6 md:gap-8 text-sm text-white/80">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-400" />
                <span>30-Day Free Trial</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-400" />
                <span>No Credit Card Required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-400" />
                <span>HIPAA Compliant</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-400" />
                <span>Cancel Anytime</span>
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="pt-8 border-t border-white/10">
              <p className="text-xs text-white/60 mb-4">Trusted by leading healthcare organizations</p>
              <div className="flex flex-wrap items-center justify-center gap-8 opacity-60">
                <div className="text-white/40 font-semibold text-sm">General Hospital</div>
                <div className="text-white/40 font-semibold text-sm">University Medical Center</div>
                <div className="text-white/40 font-semibold text-sm">City Hospital</div>
                <div className="text-white/40 font-semibold text-sm">Regional Health System</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-xl font-bold" style={{ color: '#60baa2' }}>Raha</span>
              </div>
              <p className="text-sm text-muted-foreground">
                AI-powered voice documentation for healthcare professionals.
                HIPAA-compliant, secure, and designed for modern healthcare.
              </p>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold">Product</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div>Features</div>
                <div>Pricing</div>
                <div>Integrations</div>
                <div>Security</div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold">Resources</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div>Documentation</div>
                <div>Help Center</div>
                <div>Training</div>
                <div>Support</div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold">Company</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div>About</div>
                <div>Contact</div>
                <div>Privacy</div>
                <div>Terms</div>
              </div>
            </div>
          </div>

          <Separator className="my-8" />

          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-sm text-muted-foreground">
              © 2024 Raha. All rights reserved.
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                HIPAA Compliant
              </div>
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                SOC 2 Certified
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
