import { useState } from 'react';
import {
  BookOpen,
  Video,
  FileText,
  CheckCircle,
  Clock,
  Award,
  Play,
  Lock,
  Star,
  TrendingUp,
  Target,
  Brain,
  Lightbulb,
  Book,
  GraduationCap,
  ChevronRight
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Course {
  id: string;
  title: string;
  description: string;
  duration: string;
  lessons: number;
  completed: number;
  category: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  locked: boolean;
  icon: any;
}

interface QuickTip {
  id: string;
  title: string;
  content: string;
  category: string;
  icon: any;
}

export function EducationScreen() {
  const [selectedTab, setSelectedTab] = useState('courses');

  const courses: Course[] = [
    {
      id: '1',
      title: 'SOAP Documentation Fundamentals',
      description: 'Master the SOAP note format with comprehensive examples and best practices',
      duration: '45 min',
      lessons: 8,
      completed: 8,
      category: 'Templates',
      level: 'Beginner',
      locked: false,
      icon: FileText
    },
    {
      id: '2',
      title: 'SBAR Communication Excellence',
      description: 'Learn effective SBAR communication for critical patient handoffs',
      duration: '35 min',
      lessons: 6,
      completed: 4,
      category: 'Templates',
      level: 'Beginner',
      locked: false,
      icon: FileText
    },
    {
      id: '3',
      title: 'ICD-10 Coding Mastery',
      description: 'Advanced ICD-10 code selection and documentation accuracy',
      duration: '60 min',
      lessons: 10,
      completed: 0,
      category: 'Coding',
      level: 'Advanced',
      locked: false,
      icon: Target
    },
    {
      id: '4',
      title: 'AI-Assisted Documentation',
      description: 'Maximize productivity with AI tools and voice recognition',
      duration: '50 min',
      lessons: 9,
      completed: 0,
      category: 'Technology',
      level: 'Intermediate',
      locked: false,
      icon: Brain
    },
    {
      id: '5',
      title: 'Legal & Compliance Best Practices',
      description: 'Understanding HIPAA, legal documentation requirements',
      duration: '40 min',
      lessons: 7,
      completed: 0,
      category: 'Compliance',
      level: 'Intermediate',
      locked: true,
      icon: Award
    },
    {
      id: '6',
      title: 'Advanced PIE & DAR Methods',
      description: 'Deep dive into problem-oriented documentation',
      duration: '55 min',
      lessons: 11,
      completed: 0,
      category: 'Templates',
      level: 'Advanced',
      locked: true,
      icon: FileText
    }
  ];

  const quickTips: QuickTip[] = [
    {
      id: '1',
      title: 'Use Active Voice',
      content: 'Write "Patient reports pain" instead of "Pain was reported by patient" for clearer, more direct documentation.',
      category: 'Writing',
      icon: Lightbulb
    },
    {
      id: '2',
      title: 'Be Specific with Vitals',
      content: 'Always include exact vital sign measurements: "BP 120/80 mmHg" not just "BP normal"',
      category: 'Clinical',
      icon: Target
    },
    {
      id: '3',
      title: 'Document Timing',
      content: 'Include exact times for interventions and assessments to establish clear timelines.',
      category: 'Best Practice',
      icon: Clock
    },
    {
      id: '4',
      title: 'Avoid Abbreviations',
      content: 'Use full medical terminology for critical information to prevent misinterpretation.',
      category: 'Safety',
      icon: FileText
    },
    {
      id: '5',
      title: 'Quote the Patient',
      content: 'Use direct patient quotes in subjective sections: "Patient states \'sharp pain in chest\'"',
      category: 'Writing',
      icon: Lightbulb
    },
    {
      id: '6',
      title: 'Update Regularly',
      content: 'Document changes in patient condition promptly, don\'t wait until end of shift.',
      category: 'Best Practice',
      icon: TrendingUp
    }
  ];

  const bestPractices = [
    {
      title: 'Objectivity First',
      description: 'Focus on observable, measurable facts rather than opinions or assumptions',
      icon: Target
    },
    {
      title: 'Timeliness Matters',
      description: 'Document as soon as possible after care is provided for accuracy',
      icon: Clock
    },
    {
      title: 'Complete Assessment',
      description: 'Include all relevant patient information for comprehensive care continuity',
      icon: CheckCircle
    },
    {
      title: 'Legal Protection',
      description: 'Proper documentation protects both you and your patients legally',
      icon: Award
    }
  ];

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Beginner':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'Intermediate':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Advanced':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getProgressPercentage = (completed: number, total: number) => {
    return (completed / total) * 100;
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-slate-50 via-white to-blue-50/30 overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 px-4 lg:px-6 py-3 lg:py-4 bg-white/90 backdrop-blur-sm border-b border-slate-200">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
              Education Center
            </h1>
            <p className="text-xs lg:text-sm text-slate-600">
              Enhance your documentation skills with expert training
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge className="bg-gradient-to-r from-purple-500 to-blue-600 text-white">
              <GraduationCap className="h-3 w-3 mr-1" />
              12 / 41 Complete
            </Badge>
          </div>
        </div>

        {/* Progress Overview */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-3 rounded-lg border border-green-200">
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-xs text-green-700 font-medium">Completed</span>
            </div>
            <p className="text-lg font-bold text-green-900">12</p>
          </div>
          
          <div className="bg-gradient-to-br from-blue-50 to-sky-50 p-3 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2 mb-1">
              <Play className="h-4 w-4 text-blue-600" />
              <span className="text-xs text-blue-700 font-medium">In Progress</span>
            </div>
            <p className="text-lg font-bold text-blue-900">2</p>
          </div>
          
          <div className="bg-gradient-to-br from-purple-50 to-indigo-50 p-3 rounded-lg border border-purple-200">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="h-4 w-4 text-purple-600" />
              <span className="text-xs text-purple-700 font-medium">Time Spent</span>
            </div>
            <p className="text-lg font-bold text-purple-900">4.2h</p>
          </div>
          
          <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-3 rounded-lg border border-yellow-200">
            <div className="flex items-center gap-2 mb-1">
              <Award className="h-4 w-4 text-yellow-600" />
              <span className="text-xs text-yellow-700 font-medium">Certificates</span>
            </div>
            <p className="text-lg font-bold text-yellow-900">3</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="h-full flex flex-col">
          <TabsList className="mx-4 lg:mx-6 mt-3 grid grid-cols-3 w-fit">
            <TabsTrigger value="courses" className="text-xs lg:text-sm">
              <Book className="h-4 w-4 mr-2" />
              Courses
            </TabsTrigger>
            <TabsTrigger value="tips" className="text-xs lg:text-sm">
              <Lightbulb className="h-4 w-4 mr-2" />
              Quick Tips
            </TabsTrigger>
            <TabsTrigger value="best-practices" className="text-xs lg:text-sm">
              <Star className="h-4 w-4 mr-2" />
              Best Practices
            </TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-y-auto px-4 lg:px-6 py-3 lg:py-4">
            <TabsContent value="courses" className="mt-0 space-y-3">
              {courses.map((course) => {
                const Icon = course.icon;
                const progressPercentage = getProgressPercentage(course.completed, course.lessons);
                
                return (
                  <Card key={course.id} className={`p-4 ${course.locked ? 'opacity-60' : 'hover:shadow-md transition-shadow'}`}>
                    <div className="flex items-start gap-4">
                      {/* Icon */}
                      <div className={`p-3 rounded-xl ${
                        course.locked 
                          ? 'bg-slate-200' 
                          : 'bg-gradient-to-br from-teal-500 to-blue-600'
                      } flex-shrink-0`}>
                        {course.locked ? (
                          <Lock className="h-5 w-5 text-slate-500" />
                        ) : (
                          <Icon className="h-5 w-5 text-white" />
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="flex-1 min-w-0">
                            <h3 className="text-sm lg:text-base font-semibold text-slate-900 mb-1">
                              {course.title}
                            </h3>
                            <p className="text-xs text-slate-600 mb-2">
                              {course.description}
                            </p>
                          </div>
                          
                          <Badge className={`${getLevelColor(course.level)} text-xs px-2 py-0.5 flex-shrink-0`}>
                            {course.level}
                          </Badge>
                        </div>

                        {/* Meta Info */}
                        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 mb-3">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>{course.duration}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <FileText className="h-3 w-3" />
                            <span>{course.lessons} lessons</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <BookOpen className="h-3 w-3" />
                            <span>{course.category}</span>
                          </div>
                        </div>

                        {/* Progress */}
                        {!course.locked && course.completed > 0 && (
                          <div className="mb-3">
                            <div className="flex items-center justify-between text-xs mb-1">
                              <span className="text-slate-600">Progress</span>
                              <span className="font-semibold text-slate-900">
                                {course.completed} / {course.lessons} lessons
                              </span>
                            </div>
                            <Progress value={progressPercentage} className="h-2" />
                          </div>
                        )}

                        {/* Actions */}
                        <div className="flex items-center gap-2">
                          {course.locked ? (
                            <Button size="sm" variant="outline" disabled className="h-8 text-xs">
                              <Lock className="h-3 w-3 mr-1" />
                              Locked
                            </Button>
                          ) : course.completed === course.lessons ? (
                            <>
                              <Button size="sm" className="h-8 text-xs bg-green-600 hover:bg-green-700">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Completed
                              </Button>
                              <Button size="sm" variant="outline" className="h-8 text-xs">
                                Review
                              </Button>
                            </>
                          ) : course.completed > 0 ? (
                            <Button size="sm" className="h-8 text-xs bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700">
                              <Play className="h-3 w-3 mr-1" />
                              Continue
                            </Button>
                          ) : (
                            <Button size="sm" className="h-8 text-xs bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700">
                              <Play className="h-3 w-3 mr-1" />
                              Start Course
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </TabsContent>

            <TabsContent value="tips" className="mt-0 space-y-3">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                {quickTips.map((tip) => {
                  const Icon = tip.icon;
                  return (
                    <Card key={tip.id} className="p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-lg bg-gradient-to-br from-yellow-400 to-orange-500 flex-shrink-0">
                          <Icon className="h-4 w-4 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <h3 className="text-sm font-semibold text-slate-900">
                              {tip.title}
                            </h3>
                            <Badge className="bg-orange-100 text-orange-700 border-orange-200 text-xs px-2 py-0 flex-shrink-0">
                              {tip.category}
                            </Badge>
                          </div>
                          <p className="text-xs text-slate-600 leading-relaxed">
                            {tip.content}
                          </p>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>

              {/* Call to Action */}
              <Card className="p-6 bg-gradient-to-br from-blue-50 to-teal-50 border-2 border-blue-200 text-center">
                <Lightbulb className="h-12 w-12 text-blue-600 mx-auto mb-3" />
                <h3 className="text-base font-semibold text-slate-900 mb-2">Want More Tips?</h3>
                <p className="text-sm text-slate-600 mb-4">
                  Get daily documentation tips delivered to your dashboard
                </p>
                <Button size="sm" className="bg-gradient-to-r from-blue-500 to-teal-600 hover:from-blue-600 hover:to-teal-700">
                  Subscribe to Daily Tips
                </Button>
              </Card>
            </TabsContent>

            <TabsContent value="best-practices" className="mt-0 space-y-4">
              {/* Best Practices Cards */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                {bestPractices.map((practice, index) => {
                  const Icon = practice.icon;
                  return (
                    <Card key={index} className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex-shrink-0">
                          <Icon className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h3 className="text-sm font-semibold text-slate-900 mb-1">
                            {practice.title}
                          </h3>
                          <p className="text-xs text-slate-600">
                            {practice.description}
                          </p>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>

              {/* Detailed Guide */}
              <Card className="p-4">
                <div className="flex items-center gap-2 mb-4">
                  <BookOpen className="h-5 w-5 text-teal-600" />
                  <h3 className="text-base font-semibold text-slate-900">Documentation Excellence Guide</h3>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900 mb-2 flex items-center gap-2">
                      <ChevronRight className="h-4 w-4 text-teal-600" />
                      1. Before You Begin
                    </h4>
                    <ul className="text-xs text-slate-600 space-y-1 ml-6">
                      <li>• Verify patient identity and medical record number</li>
                      <li>• Review previous notes for continuity</li>
                      <li>• Gather all relevant assessment data</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-slate-900 mb-2 flex items-center gap-2">
                      <ChevronRight className="h-4 w-4 text-teal-600" />
                      2. During Documentation
                    </h4>
                    <ul className="text-xs text-slate-600 space-y-1 ml-6">
                      <li>• Use approved medical terminology and abbreviations</li>
                      <li>• Include specific measurements and observations</li>
                      <li>• Document patient responses to interventions</li>
                      <li>• Note any changes in patient condition immediately</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-slate-900 mb-2 flex items-center gap-2">
                      <ChevronRight className="h-4 w-4 text-teal-600" />
                      3. Quality Review
                    </h4>
                    <ul className="text-xs text-slate-600 space-y-1 ml-6">
                      <li>• Proofread for accuracy and completeness</li>
                      <li>• Verify all required fields are filled</li>
                      <li>• Ensure ICD-10 codes match documented conditions</li>
                      <li>• Check for spelling and grammatical errors</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-slate-900 mb-2 flex items-center gap-2">
                      <ChevronRight className="h-4 w-4 text-teal-600" />
                      4. Legal Considerations
                    </h4>
                    <ul className="text-xs text-slate-600 space-y-1 ml-6">
                      <li>• Never alter or backdate entries</li>
                      <li>• If correction needed, follow proper amendment procedures</li>
                      <li>• Maintain patient confidentiality (HIPAA)</li>
                      <li>• Document objectively without personal opinions</li>
                    </ul>
                  </div>
                </div>

                <Button className="w-full mt-4 bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700">
                  Download Complete Guide (PDF)
                </Button>
              </Card>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
