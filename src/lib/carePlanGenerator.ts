/**
 * Care Plan Generator Service
 * AI-powered personalized care plan generation
 */

import { openaiService } from './openaiService';
import { supabaseProfileService } from './supabaseProfileService';
import { toast } from 'sonner';

export interface Diagnosis {
  code: string;
  name: string;
  category: string;
  severity: 'mild' | 'moderate' | 'severe';
}

export interface CarePlanGoal {
  id: string;
  description: string;
  targetDate: Date;
  priority: 'high' | 'medium' | 'low';
  measurable: string;
  achieved: boolean;
}

export interface CarePlanIntervention {
  id: string;
  description: string;
  frequency: string;
  duration: string;
  rationale: string;
  category: 'medication' | 'therapy' | 'monitoring' | 'education' | 'lifestyle';
}

export interface CarePlan {
  id: string;
  patientId?: string;
  diagnosis: Diagnosis;
  goals: CarePlanGoal[];
  interventions: CarePlanIntervention[];
  expectedOutcomes: string[];
  evaluationCriteria: string[];
  nursingDiagnoses: string[];
  createdAt: Date;
  updatedAt: Date;
  status: 'active' | 'completed' | 'discontinued';
}

class CarePlanGeneratorService {
  private carePlans: Map<string, CarePlan> = new Map();

  // Common diagnoses and their care plan templates
  private diagnosisTemplates: Record<string, Partial<CarePlan>> = {
    'I50.9': { // Heart Failure
      nursingDiagnoses: [
        'Decreased cardiac output',
        'Excess fluid volume',
        'Activity intolerance',
        'Anxiety related to illness'
      ],
      goals: [
        {
          id: 'goal-1',
          description: 'Patient will maintain adequate cardiac output',
          targetDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          priority: 'high',
          measurable: 'BP within 120/80, HR 60-100, no dyspnea at rest',
          achieved: false
        },
        {
          id: 'goal-2',
          description: 'Patient will demonstrate reduced fluid retention',
          targetDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
          priority: 'high',
          measurable: 'Weight loss of 2-3 lbs, no peripheral edema',
          achieved: false
        }
      ],
      interventions: [
        {
          id: 'int-1',
          description: 'Monitor vital signs (BP, HR, O2 sat)',
          frequency: 'Every 4 hours',
          duration: 'Ongoing',
          rationale: 'Early detection of cardiac decompensation',
          category: 'monitoring'
        },
        {
          id: 'int-2',
          description: 'Administer diuretics as prescribed',
          frequency: 'Daily',
          duration: 'As ordered',
          rationale: 'Reduce fluid overload and decrease cardiac workload',
          category: 'medication'
        },
        {
          id: 'int-3',
          description: 'Educate on fluid restriction (1.5-2L/day)',
          frequency: 'Daily',
          duration: '30 minutes',
          rationale: 'Prevent fluid overload',
          category: 'education'
        }
      ],
      expectedOutcomes: [
        'Improved cardiac output evidenced by stable vital signs',
        'Reduced fluid retention with weight loss and decreased edema',
        'Increased activity tolerance',
        'Patient verbalize understanding of disease management'
      ],
      evaluationCriteria: [
        'Vital signs within normal limits',
        'Absence of dyspnea and edema',
        'Weight stable or decreased',
        'Patient demonstrates adherence to fluid restrictions'
      ]
    },
    'E11.9': { // Type 2 Diabetes
      nursingDiagnoses: [
        'Risk for unstable blood glucose',
        'Deficient knowledge regarding disease management',
        'Risk for impaired skin integrity',
        'Ineffective health maintenance'
      ],
      goals: [
        {
          id: 'goal-1',
          description: 'Patient will maintain blood glucose within target range',
          targetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          priority: 'high',
          measurable: 'Fasting glucose 80-130 mg/dL, HbA1c < 7%',
          achieved: false
        }
      ],
      interventions: [
        {
          id: 'int-1',
          description: 'Monitor blood glucose levels',
          frequency: 'Before meals and at bedtime',
          duration: 'Ongoing',
          rationale: 'Detect hypo/hyperglycemia early',
          category: 'monitoring'
        },
        {
          id: 'int-2',
          description: 'Educate on diabetic diet and carb counting',
          frequency: 'Daily',
          duration: '45 minutes',
          rationale: 'Promote glycemic control through nutrition',
          category: 'education'
        }
      ],
      expectedOutcomes: [
        'Blood glucose within target range',
        'Patient demonstrates proper insulin administration',
        'No signs of diabetic complications'
      ],
      evaluationCriteria: [
        'Blood glucose logs show consistent values in target range',
        'HbA1c trending toward goal',
        'Patient verbalizes understanding of diet modifications'
      ]
    },
    'J44.9': { // COPD
      nursingDiagnoses: [
        'Impaired gas exchange',
        'Ineffective airway clearance',
        'Activity intolerance',
        'Anxiety related to dyspnea'
      ],
      goals: [
        {
          id: 'goal-1',
          description: 'Patient will maintain adequate oxygenation',
          targetDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          priority: 'high',
          measurable: 'O2 sat >90%, RR 12-20, no use of accessory muscles',
          achieved: false
        }
      ],
      interventions: [
        {
          id: 'int-1',
          description: 'Administer supplemental oxygen',
          frequency: 'Continuous',
          duration: 'As needed',
          rationale: 'Maintain adequate oxygenation',
          category: 'therapy'
        },
        {
          id: 'int-2',
          description: 'Teach pursed-lip breathing techniques',
          frequency: 'Every shift',
          duration: '15 minutes',
          rationale: 'Improve ventilation and reduce dyspnea',
          category: 'education'
        }
      ],
      expectedOutcomes: [
        'Improved gas exchange with O2 sat >90%',
        'Reduced dyspnea and respiratory distress',
        'Patient demonstrates effective breathing techniques'
      ],
      evaluationCriteria: [
        'ABG values within acceptable limits',
        'Patient reports decreased dyspnea',
        'Demonstrates proper use of inhalers and breathing techniques'
      ]
    }
  };

  /**
   * Generate personalized care plan based on diagnosis using AI
   */
  public async generateCarePlan(diagnosis: Diagnosis, patientId?: string, userId?: string): Promise<CarePlan> {
    console.log(`🧠 Generating AI-powered care plan for ${diagnosis.name}...`);
    
    toast.info('Generating personalized care plan...', {
      description: 'Using AI to create evidence-based interventions'
    });

    let aiGenerated = false;
    let goals: CarePlanGoal[] = [];
    let interventions: CarePlanIntervention[] = [];
    let nursingDiagnoses: string[] = [];

    // Try to use OpenAI for enhanced care planning
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY || localStorage.getItem('openai_api_key');
    
    if (apiKey) {
      try {
        const aiResult = await openaiService.generateCarePlan({
          code: diagnosis.code,
          name: diagnosis.name,
          severity: diagnosis.severity
        });

        // Convert AI results to our format
        nursingDiagnoses = aiResult.nursingDiagnoses;
        
        goals = aiResult.goals.map((g, i) => ({
          id: `goal-${Date.now()}-${i}`,
          description: g.description,
          targetDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
          priority: 'high' as const,
          measurable: g.measurable,
          achieved: false
        }));

        interventions = aiResult.interventions.map((int, i) => ({
          id: `int-${Date.now()}-${i}`,
          description: int.description,
          frequency: 'As ordered',
          duration: 'Ongoing',
          rationale: int.rationale,
          category: 'therapy' as const
        }));

        aiGenerated = true;
        console.log('✨ AI-generated care plan created');
        
      } catch (error: any) {
        // Handle different error types
        const errorMessage = error.message || '';
        
        if (errorMessage === 'AI_NOT_CONFIGURED') {
          console.log('ℹ️ Using template-based care plan (no API key)');
        } else if (errorMessage === 'AI_NETWORK_ERROR') {
          console.warn('⚠️ Network error, using template');
          toast.info('Using evidence-based template', {
            description: 'Network unavailable'
          });
        } else {
          console.error('AI generation failed:', error);
          toast.info('Using evidence-based template', {
            description: 'AI temporarily unavailable'
          });
        }
      }
    } else {
      console.log('ℹ️ No API key found - using template-based care plan');
    }

    // Fallback to template if AI not available
    if (!aiGenerated) {
      const template = this.diagnosisTemplates[diagnosis.code] || this.getGenericTemplate();
      goals = template.goals || [];
      interventions = template.interventions || [];
      nursingDiagnoses = template.nursingDiagnoses || [];
    }

    const carePlan: CarePlan = {
      id: `cp-${Date.now()}`,
      patientId,
      diagnosis,
      goals,
      interventions,
      expectedOutcomes: this.generateExpectedOutcomes(goals),
      evaluationCriteria: this.generateEvaluationCriteria(goals),
      nursingDiagnoses,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: 'active'
    };

    // Adjust for severity
    this.adjustForSeverity(carePlan, diagnosis.severity);

    // Store care plan in memory
    this.carePlans.set(carePlan.id, carePlan);

    // Save to Supabase if user ID provided
    if (userId) {
      try {
        await supabaseProfileService.saveCarePlan({
          user_id: userId,
          patient_id: patientId,
          diagnosis_code: diagnosis.code,
          diagnosis_name: diagnosis.name,
          severity: diagnosis.severity,
          care_plan_data: carePlan,
          status: 'active'
        });
      } catch (error) {
        console.error('Failed to save care plan to database:', error);
      }
    }

    console.log(`✅ Care plan generated: ${carePlan.id}`);
    toast.success('Care plan generated successfully!', {
      description: aiGenerated ? 'AI-powered personalized plan' : 'Evidence-based template'
    });
    
    return carePlan;
  }

  /**
   * Generate expected outcomes from goals
   */
  private generateExpectedOutcomes(goals: CarePlanGoal[]): string[] {
    return goals.map(g => `Achievement of: ${g.description}`);
  }

  /**
   * Generate evaluation criteria from goals
   */
  private generateEvaluationCriteria(goals: CarePlanGoal[]): string[] {
    return goals.map(g => `Measure: ${g.measurable}`);
  }

  /**
   * Update care plan
   */
  public updateCarePlan(planId: string, updates: Partial<CarePlan>): CarePlan | null {
    const plan = this.carePlans.get(planId);
    if (!plan) return null;

    const updatedPlan = {
      ...plan,
      ...updates,
      updatedAt: new Date()
    };

    this.carePlans.set(planId, updatedPlan);
    return updatedPlan;
  }

  /**
   * Mark goal as achieved
   */
  public achieveGoal(planId: string, goalId: string): boolean {
    const plan = this.carePlans.get(planId);
    if (!plan) return false;

    const goal = plan.goals.find(g => g.id === goalId);
    if (!goal) return false;

    goal.achieved = true;
    plan.updatedAt = new Date();
    
    // Check if all goals achieved
    if (plan.goals.every(g => g.achieved)) {
      plan.status = 'completed';
    }

    return true;
  }

  /**
   * Add intervention to care plan
   */
  public addIntervention(planId: string, intervention: Omit<CarePlanIntervention, 'id'>): boolean {
    const plan = this.carePlans.get(planId);
    if (!plan) return false;

    const newIntervention: CarePlanIntervention = {
      ...intervention,
      id: `int-${Date.now()}`
    };

    plan.interventions.push(newIntervention);
    plan.updatedAt = new Date();
    return true;
  }

  /**
   * Get care plan by ID
   */
  public getCarePlan(planId: string): CarePlan | null {
    return this.carePlans.get(planId) || null;
  }

  /**
   * Get all care plans
   */
  public getAllCarePlans(): CarePlan[] {
    return Array.from(this.carePlans.values());
  }

  /**
   * Get active care plans
   */
  public getActiveCarePlans(): CarePlan[] {
    return Array.from(this.carePlans.values()).filter(p => p.status === 'active');
  }

  /**
   * Adjust care plan based on severity
   */
  private adjustForSeverity(plan: CarePlan, severity: Diagnosis['severity']): void {
    if (severity === 'severe') {
      // Increase monitoring frequency
      plan.interventions.forEach(int => {
        if (int.category === 'monitoring') {
          int.frequency = int.frequency.replace('4 hours', '2 hours');
        }
      });
      // Set all goals to high priority
      plan.goals.forEach(goal => {
        goal.priority = 'high';
      });
    } else if (severity === 'mild') {
      // Reduce monitoring frequency
      plan.interventions.forEach(int => {
        if (int.category === 'monitoring') {
          int.frequency = int.frequency.replace('4 hours', '8 hours');
        }
      });
    }
  }

  /**
   * Get generic care plan template
   */
  private getGenericTemplate(): Partial<CarePlan> {
    return {
      nursingDiagnoses: ['Requires assessment and individualized care planning'],
      goals: [
        {
          id: 'goal-1',
          description: 'Patient will demonstrate improvement in condition',
          targetDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
          priority: 'medium',
          measurable: 'Based on individual assessment',
          achieved: false
        }
      ],
      interventions: [
        {
          id: 'int-1',
          description: 'Perform comprehensive nursing assessment',
          frequency: 'Every shift',
          duration: '15-20 minutes',
          rationale: 'Establish baseline and monitor progress',
          category: 'monitoring'
        },
        {
          id: 'int-2',
          description: 'Provide patient education on condition',
          frequency: 'Daily',
          duration: '30 minutes',
          rationale: 'Promote self-management and adherence',
          category: 'education'
        }
      ],
      expectedOutcomes: [
        'Patient demonstrates understanding of condition',
        'Improvement in clinical indicators',
        'Patient participates in care planning'
      ],
      evaluationCriteria: [
        'Patient verbalizes understanding',
        'Clinical measurements show improvement',
        'Patient adherence to treatment plan'
      ]
    };
  }

  /**
   * Export care plan to printable format
   */
  public exportCarePlan(planId: string): string {
    const plan = this.carePlans.get(planId);
    if (!plan) return '';

    return `
NURSING CARE PLAN

Diagnosis: ${plan.diagnosis.name} (${plan.diagnosis.code})
Severity: ${plan.diagnosis.severity}
Status: ${plan.status}
Created: ${plan.createdAt.toLocaleDateString()}

NURSING DIAGNOSES:
${plan.nursingDiagnoses.map((d, i) => `${i + 1}. ${d}`).join('\n')}

GOALS:
${plan.goals.map((g, i) => `
${i + 1}. ${g.description}
   Priority: ${g.priority}
   Target Date: ${g.targetDate.toLocaleDateString()}
   Measurable Outcome: ${g.measurable}
   Status: ${g.achieved ? 'ACHIEVED' : 'IN PROGRESS'}
`).join('\n')}

INTERVENTIONS:
${plan.interventions.map((int, i) => `
${i + 1}. ${int.description}
   Category: ${int.category}
   Frequency: ${int.frequency}
   Duration: ${int.duration}
   Rationale: ${int.rationale}
`).join('\n')}

EXPECTED OUTCOMES:
${plan.expectedOutcomes.map((o, i) => `${i + 1}. ${o}`).join('\n')}

EVALUATION CRITERIA:
${plan.evaluationCriteria.map((c, i) => `${i + 1}. ${c}`).join('\n')}
    `.trim();
  }
}

// Export singleton
export const carePlanGenerator = new CarePlanGeneratorService();
