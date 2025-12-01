/**
 * Education Mode for Nursing Schools
 * Provides synthetic clinical cases, practice scenarios, and competency tracking
 */

export interface ClinicalCase {
  id: string;
  title: string;
  specialty: 'med-surg' | 'pediatrics' | 'emergency' | 'icu' | 'or' | 'psychiatric';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  description: string;
  patientInfo: PatientInfo;
  scenario: string;
  objectives: string[];
  expectedNote: string;
  audioFile?: string;
  duration: number; // in minutes
}

export interface PatientInfo {
  age: number;
  gender: 'male' | 'female' | 'other';
  chiefComplaint: string;
  vitalSigns: VitalSigns;
  allergies: string[];
  medications: string[];
  medicalHistory: string[];
  currentSymptoms: string[];
}

export interface VitalSigns {
  temperature: string;
  bloodPressure: string;
  heartRate: string;
  respiratoryRate: string;
  oxygenSaturation: string;
  painLevel: number; // 0-10 scale
}

export interface PracticeSession {
  id: string;
  caseId: string;
  studentId: string;
  startTime: string;
  endTime?: string;
  transcript: string;
  composedNote: string;
  timeSpent: number; // in minutes
  score?: PracticeScore;
}

export interface PracticeScore {
  completeness: number; // 0-100
  accuracy: number; // 0-100
  clarity: number; // 0-100
  timeliness: number; // 0-100
  overall: number; // 0-100
  feedback: string[];
  instructorNotes?: string;
}

export interface CompetencyTracker {
  studentId: string;
  casesCompleted: number;
  averageScore: number;
  specialtyProgress: Record<string, number>; // specialty -> completion percentage
  skills: {
    documentation: number;
    assessment: number;
    communication: number;
    criticalThinking: number;
  };
  certifications: string[];
}

class EducationService {
  private storageKey = 'raha_education';
  private clinicalCases: ClinicalCase[] = [];

  constructor() {
    this.initializeCases();
  }

  /**
   * Initialize synthetic clinical cases
   */
  private initializeCases(): void {
    this.clinicalCases = [
      {
        id: 'case_001',
        title: 'Post-Operative Recovery - Med-Surg',
        specialty: 'med-surg',
        difficulty: 'beginner',
        description: 'Patient recovering from appendectomy, monitoring for complications',
        patientInfo: {
          age: 32,
          gender: 'female',
          chiefComplaint: 'Post-operative pain and nausea',
          vitalSigns: {
            temperature: '99.2°F',
            bloodPressure: '118/76 mmHg',
            heartRate: '88 bpm',
            respiratoryRate: '18/min',
            oxygenSaturation: '98%',
            painLevel: 6,
          },
          allergies: ['Penicillin'],
          medications: ['Morphine 2mg IV q4h PRN', 'Ondansetron 4mg IV q6h PRN'],
          medicalHistory: ['Appendectomy 2 days ago', 'No other significant history'],
          currentSymptoms: ['Abdominal pain', 'Nausea', 'Mild fever'],
        },
        scenario: 'You are caring for Ms. Johnson, a 32-year-old patient who underwent an appendectomy 2 days ago. She is experiencing moderate pain and nausea. You need to assess her condition, monitor her recovery, and document your findings.',
        objectives: [
          'Perform post-operative assessment',
          'Document pain assessment and management',
          'Monitor for signs of infection',
          'Provide patient education',
        ],
        expectedNote: `SUBJECTIVE: Patient reports moderate abdominal pain (6/10) and nausea. States pain is well-controlled with current medication. Denies fever, chills, or shortness of breath.

OBJECTIVE: Vital signs stable. Temperature 99.2°F, BP 118/76, HR 88, RR 18, O2 sat 98%. Incision site clean, dry, intact with minimal redness. No signs of infection. Abdomen soft, tender at incision site. Bowel sounds present.

ASSESSMENT: Post-operative recovery progressing normally. Pain well-controlled with current regimen. No signs of complications.

PLAN: Continue current pain management. Encourage ambulation. Monitor for signs of infection. Patient education provided on wound care and signs to report.`,
        duration: 15,
      },
      {
        id: 'case_002',
        title: 'Pediatric Asthma Exacerbation',
        specialty: 'pediatrics',
        difficulty: 'intermediate',
        description: '8-year-old patient with asthma exacerbation in emergency department',
        patientInfo: {
          age: 8,
          gender: 'male',
          chiefComplaint: 'Difficulty breathing and wheezing',
          vitalSigns: {
            temperature: '98.6°F',
            bloodPressure: '95/60 mmHg',
            heartRate: '110 bpm',
            respiratoryRate: '32/min',
            oxygenSaturation: '92%',
            painLevel: 3,
          },
          allergies: ['None known'],
          medications: ['Albuterol inhaler PRN'],
          medicalHistory: ['Asthma diagnosed at age 4', 'Previous ED visits for asthma'],
          currentSymptoms: ['Wheezing', 'Shortness of breath', 'Cough'],
        },
        scenario: 'You are caring for 8-year-old Tommy in the emergency department. He was brought in by his mother due to increased difficulty breathing and wheezing. He has a history of asthma and is having an exacerbation.',
        objectives: [
          'Assess respiratory status',
          'Document asthma exacerbation',
          'Monitor response to treatment',
          'Provide family education',
        ],
        expectedNote: `SUBJECTIVE: Mother reports child has been wheezing since this morning, difficulty breathing with activity. Child states "my chest feels tight." No fever, no recent illness.

OBJECTIVE: Alert but anxious 8-year-old male. Respiratory distress noted with accessory muscle use. Wheezing audible bilaterally. Vital signs: T 98.6°F, BP 95/60, HR 110, RR 32, O2 sat 92%. Lungs with diffuse wheezes bilaterally.

ASSESSMENT: Acute asthma exacerbation. Moderate respiratory distress.

PLAN: Albuterol nebulizer treatment initiated. Continuous pulse oximetry. Family education on asthma management. Monitor response to treatment.`,
        duration: 20,
      },
      {
        id: 'case_003',
        title: 'ICU Sepsis Management',
        specialty: 'icu',
        difficulty: 'advanced',
        description: 'Critically ill patient with sepsis in ICU requiring complex care',
        patientInfo: {
          age: 65,
          gender: 'male',
          chiefComplaint: 'Altered mental status and hypotension',
          vitalSigns: {
            temperature: '102.3°F',
            bloodPressure: '85/45 mmHg',
            heartRate: '125 bpm',
            respiratoryRate: '28/min',
            oxygenSaturation: '89%',
            painLevel: 0, // Sedated
          },
          allergies: ['Sulfa'],
          medications: ['Norepinephrine 0.1 mcg/kg/min', 'Fentanyl 50 mcg/hr', 'Propofol 30 mcg/kg/min'],
          medicalHistory: ['Diabetes Type 2', 'Hypertension', 'Recent pneumonia'],
          currentSymptoms: ['Unresponsive', 'Hypotension', 'Fever', 'Tachycardia'],
        },
        scenario: 'You are caring for Mr. Rodriguez, a 65-year-old patient in the ICU with sepsis. He is intubated, sedated, and on vasopressor support. You need to monitor his complex condition and document comprehensive care.',
        objectives: [
          'Monitor hemodynamic parameters',
          'Assess neurological status',
          'Document sepsis management',
          'Monitor for complications',
        ],
        expectedNote: `SUBJECTIVE: Patient sedated and intubated. Family reports patient was confused and lethargic before admission.

OBJECTIVE: Intubated, sedated male. Vital signs: T 102.3°F, BP 85/45 on norepinephrine 0.1 mcg/kg/min, HR 125, RR 28 (ventilated), O2 sat 89%. GCS 3T (sedated). Pupils equal, round, reactive. Lungs with bilateral crackles. Abdomen soft, no distension. Extremities cool, mottled.

ASSESSMENT: Sepsis with multi-organ dysfunction. Respiratory failure requiring mechanical ventilation. Hemodynamic instability requiring vasopressor support.

PLAN: Continue current vasopressor and sedation. Monitor hemodynamics closely. Antibiotics per protocol. Monitor for signs of improvement or deterioration.`,
        duration: 30,
      },
    ];
  }

  /**
   * Get all clinical cases
   */
  getClinicalCases(): ClinicalCase[] {
    return [...this.clinicalCases];
  }

  /**
   * Get cases by specialty
   */
  getCasesBySpecialty(specialty: ClinicalCase['specialty']): ClinicalCase[] {
    return this.clinicalCases.filter(case_ => case_.specialty === specialty);
  }

  /**
   * Get cases by difficulty
   */
  getCasesByDifficulty(difficulty: ClinicalCase['difficulty']): ClinicalCase[] {
    return this.clinicalCases.filter(case_ => case_.difficulty === difficulty);
  }

  /**
   * Get specific case by ID
   */
  getCaseById(id: string): ClinicalCase | null {
    return this.clinicalCases.find(case_ => case_.id === id) || null;
  }

  /**
   * Start a practice session
   */
  startPracticeSession(caseId: string, studentId: string): string {
    const sessionId = `session_${Date.now()}`;
    const session: PracticeSession = {
      id: sessionId,
      caseId,
      studentId,
      startTime: new Date().toISOString(),
      transcript: '',
      composedNote: '',
      timeSpent: 0,
    };

    // Store session in localStorage
    const sessions = this.getPracticeSessions();
    sessions.push(session);
    localStorage.setItem(this.storageKey, JSON.stringify({ sessions }));

    return sessionId;
  }

  /**
   * Update practice session
   */
  updatePracticeSession(sessionId: string, updates: Partial<PracticeSession>): void {
    const data = this.getEducationData();
    const sessionIndex = data.sessions.findIndex(s => s.id === sessionId);
    
    if (sessionIndex !== -1) {
      data.sessions[sessionIndex] = { ...data.sessions[sessionIndex], ...updates };
      localStorage.setItem(this.storageKey, JSON.stringify(data));
    }
  }

  /**
   * End practice session
   */
  endPracticeSession(sessionId: string, transcript: string, composedNote: string): PracticeScore {
    const session = this.getPracticeSession(sessionId);
    if (!session) {
      throw new Error('Session not found');
    }

    const endTime = new Date().toISOString();
    const timeSpent = this.calculateTimeSpent(session.startTime, endTime);
    
    // Calculate score based on note quality
    const score = this.calculateNoteScore(session.caseId, composedNote);
    
    // Update session
    this.updatePracticeSession(sessionId, {
      endTime,
      transcript,
      composedNote,
      timeSpent,
      score,
    });

    return score;
  }

  /**
   * Calculate note quality score
   */
  private calculateNoteScore(caseId: string, note: string): PracticeScore {
    const case_ = this.getCaseById(caseId);
    if (!case_) {
      throw new Error('Case not found');
    }

    // Simple scoring algorithm - in a real implementation, this would be more sophisticated
    const expectedWords = case_.expectedNote.split(' ').length;
    const actualWords = note.split(' ').length;
    const wordRatio = Math.min(actualWords / expectedWords, 1);
    
    const completeness = Math.min(wordRatio * 100, 100);
    const accuracy = Math.random() * 20 + 70; // Simulate AI accuracy scoring
    const clarity = Math.random() * 15 + 75; // Simulate clarity scoring
    const timeliness = Math.random() * 10 + 80; // Simulate timeliness scoring
    
    const overall = (completeness + accuracy + clarity + timeliness) / 4;
    
    const feedback = this.generateFeedback(completeness, accuracy, clarity, timeliness);
    
    return {
      completeness,
      accuracy,
      clarity,
      timeliness,
      overall,
      feedback,
    };
  }

  /**
   * Generate feedback based on scores
   */
  private generateFeedback(completeness: number, accuracy: number, clarity: number, timeliness: number): string[] {
    const feedback: string[] = [];
    
    if (completeness < 70) {
      feedback.push('Consider including more detailed assessment findings');
    } else if (completeness > 90) {
      feedback.push('Excellent comprehensive documentation');
    }
    
    if (accuracy < 80) {
      feedback.push('Review medical terminology and assessment accuracy');
    } else if (accuracy > 90) {
      feedback.push('Very accurate clinical documentation');
    }
    
    if (clarity < 75) {
      feedback.push('Focus on clear, concise documentation');
    } else if (clarity > 90) {
      feedback.push('Clear and well-organized documentation');
    }
    
    if (timeliness < 80) {
      feedback.push('Practice to improve documentation speed');
    } else if (timeliness > 90) {
      feedback.push('Excellent documentation efficiency');
    }
    
    return feedback;
  }

  /**
   * Get practice sessions
   */
  getPracticeSessions(): PracticeSession[] {
    const data = this.getEducationData();
    return data.sessions || [];
  }

  /**
   * Get practice session by ID
   */
  getPracticeSession(sessionId: string): PracticeSession | null {
    const sessions = this.getPracticeSessions();
    return sessions.find(s => s.id === sessionId) || null;
  }

  /**
   * Get competency tracker for student
   */
  getCompetencyTracker(studentId: string): CompetencyTracker {
    const sessions = this.getPracticeSessions().filter(s => s.studentId === studentId);
    const casesCompleted = sessions.length;
    
    const averageScore = casesCompleted > 0 
      ? sessions.reduce((sum, s) => sum + (s.score?.overall || 0), 0) / casesCompleted 
      : 0;
    
    // Calculate specialty progress
    const specialtyProgress: Record<string, number> = {};
    const specialties = ['med-surg', 'pediatrics', 'emergency', 'icu', 'or', 'psychiatric'];
    
    specialties.forEach(specialty => {
      const specialtySessions = sessions.filter(s => {
        const case_ = this.getCaseById(s.caseId);
        return case_?.specialty === specialty;
      });
      specialtyProgress[specialty] = specialtySessions.length / 3 * 100; // Assuming 3 cases per specialty
    });
    
    return {
      studentId,
      casesCompleted,
      averageScore,
      specialtyProgress,
      skills: {
        documentation: averageScore,
        assessment: averageScore * 0.9,
        communication: averageScore * 0.95,
        criticalThinking: averageScore * 0.85,
      },
      certifications: casesCompleted >= 10 ? ['Basic Documentation Competency'] : [],
    };
  }

  /**
   * Calculate time spent in session
   */
  private calculateTimeSpent(startTime: string, endTime: string): number {
    const start = new Date(startTime);
    const end = new Date(endTime);
    return Math.round((end.getTime() - start.getTime()) / (1000 * 60)); // minutes
  }

  /**
   * Get education data from localStorage
   */
  private getEducationData(): { sessions: PracticeSession[] } {
    const stored = localStorage.getItem(this.storageKey);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (error) {
        console.error('Failed to parse education data:', error);
      }
    }
    return { sessions: [] };
  }

  /**
   * Clear all education data
   */
  clearEducationData(): void {
    localStorage.removeItem(this.storageKey);
  }

  /**
   * Export education data
   */
  exportEducationData(studentId?: string): string {
    const data = this.getEducationData();
    const sessions = studentId 
      ? data.sessions.filter(s => s.studentId === studentId)
      : data.sessions;
    
    return JSON.stringify({
      sessions,
      cases: this.clinicalCases,
      exportDate: new Date().toISOString(),
    }, null, 2);
  }
}

// Export singleton instance
export const educationService = new EducationService();
