/**
 * Unified Template Registry - Raha AI Template System
 * Combines all 17 templates with intelligent categorization and recommendations
 */

import { smartTemplateService } from './smartTemplates';
import { EPIC_TEMPLATES, getAllEpicTemplates } from './epicTemplates';
import { TEMPLATES, getAllTemplates } from './templates';

// ============================================================================
// TEMPLATE CATEGORIES & TYPES
// ============================================================================

export type TemplateCategory =
  | 'traditional'    // SOAP, SBAR, PIE, DAR
  | 'epic-emr'       // Epic-specific templates
  | 'unit-specific'  // Med-Surg, ICU, NICU, Mother-Baby
  | 'smart'          // AI-enhanced templates with shortcuts
  | 'all';

export type TemplatePriority = 'high' | 'medium' | 'low';

export interface UnifiedTemplate {
  id: string;
  name: string;
  displayName: string;
  description: string;
  category: TemplateCategory;
  subcategory?: string;
  priority: TemplatePriority;
  icon: string;
  color: string;
  tags: string[];
  sections: TemplateSection[];
  shortcuts?: TemplateShortcut[];
  icd10Suggestions?: string[];
  commonPhrases?: string[];
  timeSavers?: string[];
  systemPrompt?: string;
  userPromptTemplate?: string;
  epicCompliant?: boolean;
  unitTypes?: string[];
  workflowSteps?: string[];
  estimatedTime?: number; // minutes
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  prerequisites?: string[];
  relatedTemplates?: string[];
  usageStats?: {
    totalUses: number;
    avgCompletionTime: number;
    userRating: number;
    lastUsed?: Date;
  };
}

export interface TemplateSection {
  id: string;
  title: string;
  placeholder: string;
  suggestions?: string[];
  required: boolean;
  order: number;
  validation?: {
    minLength?: number;
    maxLength?: number;
    requiredFields?: string[];
  };
}

export interface TemplateShortcut {
  shortcut: string;
  expansion: string;
  category: 'assessment' | 'intervention' | 'plan' | 'general';
  usage: number;
}

// ============================================================================
// TEMPLATE RECOMMENDATION ENGINE
// ============================================================================

export interface TemplateRecommendation {
  templateId: string;
  score: number;
  reasons: string[];
  confidence: 'high' | 'medium' | 'low';
}

export interface UserContext {
  unitType?: string;
  shiftType?: 'day' | 'evening' | 'night';
  patientType?: string;
  experience?: 'beginner' | 'intermediate' | 'advanced';
  timeAvailable?: number; // minutes
  commonTasks?: string[];
  previousTemplates?: string[];
  currentTime?: Date;
}

// ============================================================================
// UNIFIED TEMPLATE REGISTRY CLASS
// ============================================================================

class UnifiedTemplateRegistry {
  private templates: Map<string, UnifiedTemplate> = new Map();
  private categoryStats: Map<TemplateCategory, number> = new Map();

  constructor() {
    this.initializeTemplates();
    this.calculateCategoryStats();
  }

  private initializeTemplates() {
    // Add Traditional Templates
    this.addTraditionalTemplates();

    // Add Epic EMR Templates
    this.addEpicTemplates();

    // Add Unit-Specific Templates
    this.addUnitSpecificTemplates();

    // Add Smart Templates
    this.addSmartTemplates();
  }

  private addTraditionalTemplates() {
    const traditionalTemplates = getAllTemplates();

    traditionalTemplates.forEach(template => {
      const unified: UnifiedTemplate = {
        id: template.name,
        name: template.name,
        displayName: template.displayName,
        description: template.description,
        category: 'traditional',
        priority: 'high',
        icon: 'clipboard-list',
        color: this.getCategoryColor('traditional'),
        tags: ['documentation', 'nursing', 'assessment'],
        sections: template.sections.map((section, index) => ({
          id: section.toLowerCase().replace(/\s+/g, '-'),
          title: section,
          placeholder: `Enter ${section.toLowerCase()} information...`,
          required: true,
          order: index
        })),
        systemPrompt: template.systemPrompt,
        userPromptTemplate: template.userPromptTemplate,
        epicCompliant: template.epicCompliant,
        workflowSteps: [
          `Provide ${template.sections[0].toLowerCase()} information`,
          `Document ${template.sections[1].toLowerCase()} findings`,
          `State your ${template.sections[2].toLowerCase()}`,
          `Outline the ${template.sections[3]?.toLowerCase() || 'next steps'}`
        ],
        estimatedTime: 5,
        difficulty: 'beginner',
        usageStats: {
          totalUses: Math.floor(Math.random() * 100) + 50,
          avgCompletionTime: 4.5,
          userRating: 4.2
        }
      };

      this.templates.set(template.name, unified);
    });
  }

  private addEpicTemplates() {
    const epicTemplates = getAllEpicTemplates();

    epicTemplates.forEach(({ id, name }) => {
      const unified: UnifiedTemplate = {
        id,
        name,
        displayName: name,
        description: this.getEpicTemplateDescription(id),
        category: 'epic-emr',
        priority: 'high',
        icon: this.getEpicTemplateIcon(id),
        color: this.getCategoryColor('epic-emr'),
        tags: ['epic', 'emr', 'compliance', 'documentation'],
        sections: this.getEpicTemplateSections(id),
        epicCompliant: true,
        workflowSteps: this.getEpicTemplateWorkflow(id),
        estimatedTime: this.getEpicTemplateTime(id),
        difficulty: 'intermediate',
        unitTypes: this.getEpicTemplateUnitTypes(id),
        usageStats: {
          totalUses: Math.floor(Math.random() * 80) + 30,
          avgCompletionTime: 6.2,
          userRating: 4.4
        }
      };

      this.templates.set(id, unified);
    });
  }

  private addUnitSpecificTemplates() {
    const unitTemplates = [
      {
        id: 'med-surg-unit',
        name: 'Med-Surg',
        displayName: 'Medical-Surgical Unit',
        description: 'Comprehensive medical-surgical documentation',
        unitType: 'Med-Surg',
        icon: 'activity',
        workflowSteps: [
          'Document current chief complaint and symptoms',
          'Record vital signs and significant changes',
          'Note surgical status and post-op day',
          'Document pain management effectiveness',
          'Record mobility and activity tolerance',
          'Note IV access and medications administered',
          'Document patient/family education progress'
        ]
      },
      {
        id: 'icu-unit',
        name: 'ICU',
        displayName: 'Intensive Care Unit',
        description: 'Critical care ICU documentation',
        unitType: 'ICU',
        icon: 'heart',
        workflowSteps: [
          'Record neurological status (GCS, sedation)',
          'Document ventilator settings and status',
          'Note hemodynamic monitoring',
          'Record all drips and titration',
          'Document hourly I&O balance',
          'Note lab results and critical values',
          'Record family communication updates'
        ]
      },
      {
        id: 'nicu-unit',
        name: 'NICU',
        displayName: 'Neonatal ICU',
        description: 'Specialized neonatal intensive care',
        unitType: 'NICU',
        icon: 'baby',
        workflowSteps: [
          'Record gestational age and day of life',
          'Document respiratory support settings',
          'Note cardiovascular status',
          'Record feeding type and tolerance',
          'Document thermoregulation',
          'Note skin condition and lines',
          'Record parent interaction updates'
        ]
      },
      {
        id: 'mother-baby-unit',
        name: 'Mother-Baby',
        displayName: 'Mother-Baby Unit',
        description: 'Postpartum and newborn care',
        unitType: 'Mother-Baby',
        icon: 'users',
        workflowSteps: [
          'Document postpartum day and delivery',
          'Record fundus assessment and lochia',
          'Note perineal healing status',
          'Document breastfeeding assessment',
          'Record newborn care provided',
          'Note mother-infant bonding',
          'Document discharge teaching topics'
        ]
      }
    ];

    unitTemplates.forEach(template => {
      const unified: UnifiedTemplate = {
        id: template.id,
        name: template.name,
        displayName: template.displayName,
        description: template.description,
        category: 'unit-specific',
        subcategory: template.unitType,
        priority: 'high',
        icon: template.icon,
        color: this.getCategoryColor('unit-specific'),
        tags: ['unit-specific', template.unitType?.toLowerCase() || '', 'specialized'],
        sections: template.workflowSteps.map((step, index) => ({
          id: `step-${index + 1}`,
          title: step.split(':')[0],
          placeholder: step,
          required: true,
          order: index
        })),
        unitTypes: [template.unitType || ''],
        workflowSteps: template.workflowSteps,
        estimatedTime: 8,
        difficulty: 'intermediate',
        usageStats: {
          totalUses: Math.floor(Math.random() * 60) + 20,
          avgCompletionTime: 7.8,
          userRating: 4.1
        }
      };

      this.templates.set(template.id, unified);
    });
  }

  private addSmartTemplates() {
    const smartTemplates = smartTemplateService.getTemplates();

    smartTemplates.forEach(template => {
      const unified: UnifiedTemplate = {
        id: template.id,
        name: template.name,
        displayName: template.name,
        description: template.description,
        category: 'smart',
        priority: 'medium',
        icon: 'sparkles',
        color: this.getCategoryColor('smart'),
        tags: ['smart', 'ai-enhanced', 'shortcuts', template.category.toLowerCase()],
        sections: template.sections,
        shortcuts: template.shortcuts?.map(s => ({ ...s, usage: 0 })),
        icd10Suggestions: template.icd10Suggestions,
        commonPhrases: template.commonPhrases,
        timeSavers: template.timeSavers,
        unitTypes: [template.category],
        workflowSteps: template.sections.map(s => s.title),
        estimatedTime: 6,
        difficulty: 'beginner',
        usageStats: {
          totalUses: Math.floor(Math.random() * 40) + 10,
          avgCompletionTime: 5.2,
          userRating: 4.6
        }
      };

      this.templates.set(template.id, unified);
    });
  }

  // Helper methods for Epic templates
  private getEpicTemplateDescription(id: string): string {
    const descriptions: Record<string, string> = {
      'shift-assessment': 'Comprehensive head-to-toe assessment with vital signs and systems review',
      'mar': 'Medication Administration Record with full MAR compliance',
      'io': 'Intake and Output documentation with balance calculations',
      'wound-care': 'Detailed wound assessment and treatment documentation',
      'safety-checklist': 'Patient safety checklist and fall risk assessment',
      'med-surg': 'Medical-surgical unit comprehensive documentation',
      'icu': 'Intensive care unit critical care documentation',
      'nicu': 'Neonatal ICU specialized care documentation',
      'mother-baby': 'Mother-baby unit postpartum and newborn care'
    };
    return descriptions[id] || 'Epic EMR documentation template';
  }

  private getEpicTemplateIcon(id: string): string {
    const icons: Record<string, string> = {
      'shift-assessment': 'stethoscope',
      'mar': 'pill',
      'io': 'droplets',
      'wound-care': 'bandage',
      'safety-checklist': 'shield',
      'med-surg': 'activity',
      'icu': 'heart',
      'nicu': 'baby',
      'mother-baby': 'users'
    };
    return icons[id] || 'file-text';
  }

  private getEpicTemplateSections(id: string): TemplateSection[] {
    const sectionMaps: Record<string, TemplateSection[]> = {
      'shift-assessment': [
        { id: 'neuro', title: 'Neurological', placeholder: 'LOC, orientation, pupils, motor/sensory...', required: true, order: 1 },
        { id: 'cardiac', title: 'Cardiovascular', placeholder: 'Heart rate, rhythm, BP, perfusion...', required: true, order: 2 },
        { id: 'respiratory', title: 'Respiratory', placeholder: 'Breath sounds, O2 sat, respiratory rate...', required: true, order: 3 },
        { id: 'gi', title: 'GI', placeholder: 'Bowel sounds, last BM, nausea/vomiting...', required: true, order: 4 },
        { id: 'pain', title: 'Pain Assessment', placeholder: 'Location, intensity, quality, interventions...', required: true, order: 5 }
      ],
      'mar': [
        { id: 'medications', title: 'Medications', placeholder: 'List all medications administered...', required: true, order: 1 },
        { id: 'assessment', title: 'Pre/Post Assessment', placeholder: 'Vital signs, pain, adverse reactions...', required: true, order: 2 },
        { id: 'response', title: 'Patient Response', placeholder: 'Effectiveness, side effects, education...', required: true, order: 3 }
      ],
      'io': [
        { id: 'intake', title: 'Intake', placeholder: 'Oral, IV, tube feeding, blood products...', required: true, order: 1 },
        { id: 'output', title: 'Output', placeholder: 'Urine, stool, drains, emesis...', required: true, order: 2 },
        { id: 'balance', title: 'Balance', placeholder: 'Calculate net balance...', required: true, order: 3 }
      ]
    };
    return sectionMaps[id] || [];
  }

  private getEpicTemplateWorkflow(id: string): string[] {
    const workflows: Record<string, string[]> = {
      'shift-assessment': [
        'Complete neurological assessment',
        'Document cardiovascular status',
        'Assess respiratory function',
        'Review GI/GU systems',
        'Document pain and vital signs'
      ],
      'mar': [
        'Verify medication orders',
        'Perform pre-administration assessment',
        'Administer medications safely',
        'Document patient response',
        'Complete MAR documentation'
      ],
      'io': [
        'Record all intake sources',
        'Document all output',
        'Calculate balance',
        'Note trends and concerns'
      ]
    };
    return workflows[id] || [];
  }

  private getEpicTemplateTime(id: string): number {
    const times: Record<string, number> = {
      'shift-assessment': 10,
      'mar': 8,
      'io': 5,
      'wound-care': 7,
      'safety-checklist': 4
    };
    return times[id] || 6;
  }

  private getEpicTemplateUnitTypes(id: string): string[] {
    const unitMap: Record<string, string[]> = {
      'med-surg': ['Med-Surg'],
      'icu': ['ICU'],
      'nicu': ['NICU'],
      'mother-baby': ['Mother-Baby'],
      'shift-assessment': ['Med-Surg', 'ICU', 'NICU', 'Mother-Baby'],
      'mar': ['Med-Surg', 'ICU', 'NICU', 'Mother-Baby'],
      'io': ['Med-Surg', 'ICU', 'NICU', 'Mother-Baby'],
      'wound-care': ['Med-Surg', 'ICU', 'NICU'],
      'safety-checklist': ['Med-Surg', 'ICU', 'NICU', 'Mother-Baby']
    };
    return unitMap[id] || [];
  }

  private getCategoryColor(category: TemplateCategory): string {
    const colors: Record<TemplateCategory, string> = {
      traditional: 'purple',
      'epic-emr': 'blue',
      'unit-specific': 'indigo',
      smart: 'emerald',
      all: 'slate'
    };
    return colors[category];
  }

  private calculateCategoryStats() {
    this.categoryStats.clear();
    this.templates.forEach(template => {
      const current = this.categoryStats.get(template.category) || 0;
      this.categoryStats.set(template.category, current + 1);
    });
  }

  // ============================================================================
  // PUBLIC API METHODS
  // ============================================================================

  getAllTemplates(): UnifiedTemplate[] {
    return Array.from(this.templates.values());
  }

  getTemplateById(id: string): UnifiedTemplate | null {
    return this.templates.get(id) || null;
  }

  getTemplatesByCategory(category: TemplateCategory): UnifiedTemplate[] {
    if (category === 'all') return this.getAllTemplates();
    return this.getAllTemplates().filter(t => t.category === category);
  }

  getTemplatesByUnitType(unitType: string): UnifiedTemplate[] {
    return this.getAllTemplates().filter(t =>
      t.unitTypes?.some(unit => unit.toLowerCase() === unitType.toLowerCase())
    );
  }

  getCategoryStats(): Record<TemplateCategory, number> {
    const stats: Record<TemplateCategory, number> = {
      traditional: 0,
      'epic-emr': 0,
      'unit-specific': 0,
      smart: 0,
      all: 0
    };

    this.categoryStats.forEach((count, category) => {
      stats[category] = count;
    });

    return stats;
  }

  searchTemplates(query: string): UnifiedTemplate[] {
    const lowercaseQuery = query.toLowerCase();
    return this.getAllTemplates().filter(template =>
      template.name.toLowerCase().includes(lowercaseQuery) ||
      template.displayName.toLowerCase().includes(lowercaseQuery) ||
      template.description.toLowerCase().includes(lowercaseQuery) ||
      template.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
    );
  }

  getRecommendedTemplates(context: UserContext): TemplateRecommendation[] {
    const recommendations: TemplateRecommendation[] = [];
    const templates = this.getAllTemplates();

    templates.forEach(template => {
      let score = 0;
      const reasons: string[] = [];

      // Unit type matching
      if (context.unitType && template.unitTypes?.includes(context.unitType)) {
        score += 30;
        reasons.push(`Perfect for ${context.unitType} unit`);
      }

      // Experience level matching
      if (context.experience && template.difficulty === context.experience) {
        score += 20;
        reasons.push(`Matches your ${context.experience} experience level`);
      }

      // Time availability
      if (context.timeAvailable && template.estimatedTime && template.estimatedTime <= context.timeAvailable) {
        score += 15;
        reasons.push(`Fits within ${context.timeAvailable} minutes`);
      }

      // Previous usage
      if (context.previousTemplates?.includes(template.id)) {
        score += 10;
        reasons.push('Previously used template');
      }

      // Priority bonus
      if (template.priority === 'high') score += 5;
      if (template.priority === 'medium') score += 2;

      // Usage stats bonus
      if (template.usageStats && template.usageStats.userRating > 4.0) {
        score += Math.floor(template.usageStats.userRating);
      }

      if (score > 0) {
        recommendations.push({
          templateId: template.id,
          score,
          reasons,
          confidence: score > 40 ? 'high' : score > 20 ? 'medium' : 'low'
        });
      }
    });

    return recommendations
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);
  }

  getTemplateShortcuts(templateId: string): TemplateShortcut[] {
    const template = this.getTemplateById(templateId);
    return template?.shortcuts || [];
  }

  getCommonPhrases(templateId: string): string[] {
    const template = this.getTemplateById(templateId);
    return template?.commonPhrases || [];
  }

  getTimeSavers(templateId: string): string[] {
    const template = this.getTemplateById(templateId);
    return template?.timeSavers || [];
  }

  updateTemplateUsage(templateId: string, completionTime?: number) {
    const template = this.getTemplateById(templateId);
    if (template && template.usageStats) {
      template.usageStats.totalUses += 1;
      template.usageStats.lastUsed = new Date();
      if (completionTime) {
        template.usageStats.avgCompletionTime =
          (template.usageStats.avgCompletionTime + completionTime) / 2;
      }
    }
  }

  getPopularTemplates(limit: number = 10): UnifiedTemplate[] {
    return this.getAllTemplates()
      .filter(t => t.usageStats)
      .sort((a, b) => (b.usageStats!.totalUses) - (a.usageStats!.totalUses))
      .slice(0, limit);
  }

  getRecentTemplates(limit: number = 5): UnifiedTemplate[] {
    return this.getAllTemplates()
      .filter(t => t.usageStats?.lastUsed)
      .sort((a, b) => (b.usageStats!.lastUsed!.getTime()) - (a.usageStats!.lastUsed!.getTime()))
      .slice(0, limit);
  }
}

// ============================================================================
// EXPORT SINGLETON INSTANCE
// ============================================================================

export const unifiedTemplateRegistry = new UnifiedTemplateRegistry();

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

export function getTemplateIcon(template: UnifiedTemplate): string {
  const iconMap: Record<string, string> = {
    'clipboard-list': '📋',
    'stethoscope': '🩺',
    'pill': '💊',
    'droplets': '💧',
    'bandage': '🩹',
    'shield': '🛡️',
    'activity': '📊',
    'heart': '❤️',
    'baby': '👶',
    'users': '👨‍👩‍👧‍👦',
    'sparkles': '✨',
    'file-text': '📄'
  };
  return iconMap[template.icon] || '📋';
}

export function getTemplateColor(template: UnifiedTemplate): string {
  const colorMap: Record<string, string> = {
    purple: 'from-purple-500 to-purple-600',
    blue: 'from-blue-500 to-blue-600',
    indigo: 'from-indigo-500 to-indigo-600',
    emerald: 'from-emerald-500 to-emerald-600',
    slate: 'from-slate-500 to-slate-600',
    red: 'from-red-500 to-red-600',
    cyan: 'from-cyan-500 to-cyan-600',
    amber: 'from-amber-500 to-amber-600',
    rose: 'from-rose-500 to-rose-600',
    fuchsia: 'from-fuchsia-500 to-fuchsia-600'
  };
  return colorMap[template.color] || 'from-slate-500 to-slate-600';
}

export function formatTemplateTime(minutes: number): string {
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
}

export function getTemplateDifficultyColor(difficulty: string): string {
  switch (difficulty) {
    case 'beginner': return 'text-green-600 bg-green-50';
    case 'intermediate': return 'text-yellow-600 bg-yellow-50';
    case 'advanced': return 'text-red-600 bg-red-50';
    default: return 'text-slate-600 bg-slate-50';
  }
}
