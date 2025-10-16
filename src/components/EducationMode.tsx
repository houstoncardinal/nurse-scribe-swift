import { useState, useEffect } from 'react';
import { GraduationCap, Play, BookOpen, Target, Trophy, Clock, Users, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { educationService, type ClinicalCase, type PracticeSession, type CompetencyTracker } from '@/lib/education';
import { toast } from 'sonner';

interface EducationModeProps {
  isOpen: boolean;
  onClose: () => void;
}

export function EducationMode({ isOpen, onClose }: EducationModeProps) {
  const [activeTab, setActiveTab] = useState('cases');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [currentCase, setCurrentCase] = useState<ClinicalCase | null>(null);
  const [currentSession, setCurrentSession] = useState<PracticeSession | null>(null);
  const [competencyTracker, setCompetencyTracker] = useState<CompetencyTracker | null>(null);
  const [studentId] = useState('student_001'); // In real app, this would come from auth

  useEffect(() => {
    if (isOpen) {
      loadCompetencyData();
    }
  }, [isOpen, studentId]);

  const loadCompetencyData = () => {
    const tracker = educationService.getCompetencyTracker(studentId);
    setCompetencyTracker(tracker);
  };

  const cases = educationService.getClinicalCases();
  const filteredCases = cases.filter(case_ => {
    if (selectedSpecialty !== 'all' && case_.specialty !== selectedSpecialty) return false;
    if (selectedDifficulty !== 'all' && case_.difficulty !== selectedDifficulty) return false;
    return true;
  });

  const handleStartCase = (case_: ClinicalCase) => {
    const sessionId = educationService.startPracticeSession(case_.id, studentId);
    setCurrentCase(case_);
    
    const session = educationService.getPracticeSession(sessionId);
    setCurrentSession(session);
    
    toast.success(`Started practice case: ${case_.title}`);
  };

  const handleEndSession = (transcript: string, composedNote: string) => {
    if (!currentSession) return;

    try {
      const score = educationService.endPracticeSession(
        currentSession.id,
        transcript,
        composedNote
      );

      toast.success(`Practice completed! Score: ${score.overall.toFixed(1)}%`);
      loadCompetencyData();
      setCurrentCase(null);
      setCurrentSession(null);
    } catch (error) {
      console.error('Failed to end session:', error);
      toast.error('Failed to complete practice session');
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-success/10 text-success border-success/20';
      case 'intermediate': return 'bg-warning/10 text-warning border-warning/20';
      case 'advanced': return 'bg-destructive/10 text-destructive border-destructive/20';
      default: return 'bg-muted';
    }
  };

  const getSpecialtyIcon = (specialty: string) => {
    switch (specialty) {
      case 'med-surg': return '🏥';
      case 'pediatrics': return '👶';
      case 'emergency': return '🚑';
      case 'icu': return '💙';
      case 'or': return '⚕️';
      case 'psychiatric': return '🧠';
      default: return '📋';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-7xl max-h-[90vh] overflow-y-auto glass border-border/50 shadow-2xl">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-secondary rounded-xl flex items-center justify-center">
                <GraduationCap className="h-6 w-6 text-secondary-foreground" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Education Mode</h2>
                <p className="text-sm text-muted-foreground">Practice clinical documentation with synthetic cases</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              ×
            </Button>
          </div>

          {/* Competency Overview */}
          {competencyTracker && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="p-4 bg-gradient-primary/10 border-primary/20">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                    <BookOpen className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-primary">{competencyTracker.casesCompleted}</div>
                    <div className="text-sm text-muted-foreground">Cases Completed</div>
                  </div>
                </div>
              </Card>

              <Card className="p-4 bg-gradient-secondary/10 border-secondary/20">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-secondary rounded-lg flex items-center justify-center">
                    <Target className="h-5 w-5 text-secondary-foreground" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-secondary">{competencyTracker.averageScore.toFixed(1)}%</div>
                    <div className="text-sm text-muted-foreground">Average Score</div>
                  </div>
                </div>
              </Card>

              <Card className="p-4 bg-gradient-accent/10 border-accent/20">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-accent rounded-lg flex items-center justify-center">
                    <Trophy className="h-5 w-5 text-accent-foreground" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-accent">{competencyTracker.certifications.length}</div>
                    <div className="text-sm text-muted-foreground">Certifications</div>
                  </div>
                </div>
              </Card>

              <Card className="p-4 bg-success/10 border-success/20">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-secondary rounded-lg flex items-center justify-center">
                    <Award className="h-5 w-5 text-success-foreground" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-success">
                      {Object.values(competencyTracker.specialtyProgress).filter(p => p >= 100).length}
                    </div>
                    <div className="text-sm text-muted-foreground">Specialties Mastered</div>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="cases">Practice Cases</TabsTrigger>
              <TabsTrigger value="progress">Progress</TabsTrigger>
              <TabsTrigger value="skills">Skills</TabsTrigger>
              <TabsTrigger value="sessions">Sessions</TabsTrigger>
            </TabsList>

            <TabsContent value="cases" className="space-y-6">
              {/* Filters */}
              <div className="flex gap-4">
                <div className="flex-1">
                  <Label className="text-sm font-medium">Specialty</Label>
                  <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Specialties</SelectItem>
                      <SelectItem value="med-surg">Medical-Surgical</SelectItem>
                      <SelectItem value="pediatrics">Pediatrics</SelectItem>
                      <SelectItem value="emergency">Emergency</SelectItem>
                      <SelectItem value="icu">ICU</SelectItem>
                      <SelectItem value="or">Operating Room</SelectItem>
                      <SelectItem value="psychiatric">Psychiatric</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex-1">
                  <Label className="text-sm font-medium">Difficulty</Label>
                  <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Levels</SelectItem>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Cases Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCases.map((case_) => (
                  <Card key={case_.id} className="p-6 hover:shadow-lg transition-all">
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{getSpecialtyIcon(case_.specialty)}</span>
                          <div>
                            <h3 className="font-semibold">{case_.title}</h3>
                            <p className="text-sm text-muted-foreground capitalize">{case_.specialty}</p>
                          </div>
                        </div>
                        <Badge className={getDifficultyColor(case_.difficulty)}>
                          {case_.difficulty}
                        </Badge>
                      </div>

                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {case_.description}
                      </p>

                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {case_.duration} min
                        </div>
                        <div className="flex items-center gap-1">
                          <Target className="h-3 w-3" />
                          {case_.objectives.length} objectives
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="text-xs font-medium">Learning Objectives:</div>
                        <div className="space-y-1">
                          {case_.objectives.slice(0, 2).map((objective, index) => (
                            <div key={index} className="text-xs text-muted-foreground">
                              • {objective}
                            </div>
                          ))}
                          {case_.objectives.length > 2 && (
                            <div className="text-xs text-muted-foreground">
                              • +{case_.objectives.length - 2} more objectives
                            </div>
                          )}
                        </div>
                      </div>

                      <Button
                        onClick={() => handleStartCase(case_)}
                        className="w-full"
                        size="sm"
                      >
                        <Play className="h-4 w-4 mr-2" />
                        Start Practice
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="progress" className="space-y-6">
              {competencyTracker && (
                <div className="space-y-6">
                  {/* Specialty Progress */}
                  <Card className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Specialty Progress</h3>
                    <div className="space-y-4">
                      {Object.entries(competencyTracker.specialtyProgress).map(([specialty, progress]) => (
                        <div key={specialty} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-lg">{getSpecialtyIcon(specialty)}</span>
                              <span className="font-medium capitalize">{specialty}</span>
                            </div>
                            <span className="text-sm font-semibold">{progress.toFixed(1)}%</span>
                          </div>
                          <Progress value={progress} className="h-2" />
                        </div>
                      ))}
                    </div>
                  </Card>

                  {/* Skills Assessment */}
                  <Card className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Core Skills</h3>
                    <div className="grid grid-cols-2 gap-4">
                      {Object.entries(competencyTracker.skills).map(([skill, score]) => (
                        <div key={skill} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium capitalize">{skill}</span>
                            <span className="text-sm font-semibold">{score.toFixed(1)}%</span>
                          </div>
                          <Progress value={score} className="h-2" />
                        </div>
                      ))}
                    </div>
                  </Card>

                  {/* Certifications */}
                  <Card className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Certifications</h3>
                    <div className="space-y-3">
                      {competencyTracker.certifications.length > 0 ? (
                        competencyTracker.certifications.map((cert, index) => (
                          <div key={index} className="flex items-center gap-3 p-3 bg-success/10 rounded-lg border border-success/20">
                            <Award className="h-5 w-5 text-success" />
                            <span className="font-medium">{cert}</span>
                          </div>
                        ))
                      ) : (
                        <div className="text-center p-6 text-muted-foreground">
                          <Award className="h-12 w-12 mx-auto mb-3 opacity-50" />
                          <p>Complete more practice cases to earn certifications</p>
                        </div>
                      )}
                    </div>
                  </Card>
                </div>
              )}
            </TabsContent>

            <TabsContent value="skills" className="space-y-6">
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Skill Development</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-medium">Documentation Skills</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm">SOAP Notes</span>
                        <Badge variant="outline">Completed</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">SBAR Communication</span>
                        <Badge variant="outline">In Progress</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">PIE Documentation</span>
                        <Badge variant="outline">Not Started</Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="font-medium">Clinical Skills</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm">Assessment Documentation</span>
                        <Badge variant="outline">Completed</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Care Plan Development</span>
                        <Badge variant="outline">In Progress</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Critical Thinking</span>
                        <Badge variant="outline">Not Started</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="sessions" className="space-y-6">
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Practice Sessions</h3>
                <div className="space-y-3">
                  {educationService.getPracticeSessions()
                    .filter(s => s.studentId === studentId)
                    .slice(-10)
                    .reverse()
                    .map((session, index) => {
                      const case_ = educationService.getCaseById(session.caseId);
                      return (
                        <div key={session.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                          <div className="flex items-center gap-3">
                            <span className="text-lg">{case_ ? getSpecialtyIcon(case_.specialty) : '📋'}</span>
                            <div>
                              <div className="text-sm font-medium">{case_?.title || 'Unknown Case'}</div>
                              <div className="text-xs text-muted-foreground">
                                {new Date(session.startTime).toLocaleDateString()} • {session.timeSpent} min
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {session.score && (
                              <Badge variant={session.score.overall >= 80 ? 'default' : 'secondary'}>
                                {session.score.overall.toFixed(1)}%
                              </Badge>
                            )}
                            <Badge variant="outline">
                              {case_?.difficulty || 'Unknown'}
                            </Badge>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </Card>
    </div>
  );
}
