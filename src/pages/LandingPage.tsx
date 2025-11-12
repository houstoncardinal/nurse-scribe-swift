import { useState } from 'react';
import { ArrowRight, Play, Shield, Clock, Users, CheckCircle, Star, Quote, Zap, Target, Award, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';

export function LandingPage() {
  const [email, setEmail] = useState('');
  const [isDemoOpen, setIsDemoOpen] = useState(false);

  const handleGetStarted = () => {
    // In a real app, this would handle lead capture
    console.log('Email submitted:', email);
  };

  const features = [
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
  ];

  const testimonials = [
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
  ];

  const stats = [
    { number: '15,000+', label: 'Nurses Using Raha' },
    { number: '2.5M+', label: 'Notes Generated' },
    { number: '40%', label: 'Time Saved on Documentation' },
    { number: '99.9%', label: 'HIPAA Compliance Rate' }
  ];

  const pricingPlans = [
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
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 glass border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Zap className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <span className="text-xl font-bold">Raha</span>
                <p className="text-xs text-muted-foreground leading-none">Tihkn Breathing Space</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost">Features</Button>
              <Button variant="ghost">Pricing</Button>
              <Button variant="ghost">About</Button>
              <Button>Get Started</Button>
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
                <Button size="lg" className="h-14 px-8 text-lg font-semibold">
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
              <div className="absolute inset-0 bg-gradient-primary/20 rounded-3xl blur-3xl"></div>
              <Card className="relative card-premium p-8 shadow-2xl">
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-destructive rounded-full"></div>
                    <div className="w-3 h-3 bg-warning rounded-full"></div>
                    <div className="w-3 h-3 bg-success rounded-full"></div>
                    <span className="ml-4 text-sm text-muted-foreground">Raha - Active Session</span>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center">
                        <Zap className="h-5 w-5 text-primary-foreground" />
                      </div>
                      <div>
                        <div className="font-semibold">Voice Transcription Active</div>
                        <div className="text-sm text-muted-foreground">Listening for dictation...</div>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <div className="text-sm font-mono">
                        "Patient presents with chest pain, vital signs stable, 
                        pain level 6/10, no shortness of breath..."
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                        HIPAA Protected
                      </Badge>
                      <Badge variant="outline">
                        SOAP Note Generated
                      </Badge>
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
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold">
              Everything You Need for
              <span className="text-gradient-primary"> Tihkn Breathing Space</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              From voice transcription to EHR integration, Raha provides 
              a complete solution for modern healthcare documentation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-all">
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

      {/* Testimonials Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
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
              <Card key={index} className="p-6">
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
      <section className="py-20 px-4 sm:px-6 lg:px-8">
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
              <Card key={index} className={`p-8 relative ${plan.popular ? 'border-primary shadow-lg' : ''}`}>
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
                    className={`w-full ${plan.popular ? 'bg-gradient-primary' : ''}`}
                    variant={plan.popular ? 'default' : 'outline'}
                  >
                    {plan.name === 'Enterprise' ? 'Contact Sales' : 'Start Free Trial'}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-primary">
        <div className="max-w-4xl mx-auto text-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground">
                Ready to Transform Your
                <span className="text-gradient-secondary"> Documentation Workflow?</span>
              </h2>
              <p className="text-xl text-primary-foreground/80">
                Join thousands of healthcare professionals who have already reduced 
                their documentation time by 40% with Raha.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12"
                />
                <Button 
                  size="lg" 
                  className="h-12 px-8 bg-secondary hover:bg-secondary/90"
                  onClick={handleGetStarted}
                >
                  Get Started
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-center gap-8 text-sm text-primary-foreground/80">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                30-Day Free Trial
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                No Credit Card Required
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Cancel Anytime
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
                <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <Zap className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold">Raha</span>
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
