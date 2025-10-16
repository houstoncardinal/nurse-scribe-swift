/**
 * NurseScribe AI Knowledge Base System
 * Comprehensive medical knowledge for enhanced AI capabilities
 */

export interface MedicalTerm {
  term: string;
  definition: string;
  category: 'anatomy' | 'symptom' | 'diagnosis' | 'medication' | 'procedure' | 'vital_sign' | 'assessment' | 'intervention';
  synonyms: string[];
  relatedTerms: string[];
  icd10?: string;
  nursingImplications?: string[];
}

export interface ClinicalGuideline {
  id: string;
  title: string;
  category: string;
  description: string;
  guidelines: string[];
  contraindications?: string[];
  notes?: string;
}

export interface TemplateGuidance {
  template: 'SOAP' | 'SBAR' | 'PIE' | 'DAR';
  sections: {
    [key: string]: {
      description: string;
      examples: string[];
      keyElements: string[];
      commonPhrases: string[];
    };
  };
}

export interface VoiceOptimization {
  phrase: string;
  optimized: string;
  category: 'medical_term' | 'common_phrase' | 'abbreviation' | 'measurement';
  confidence: number;
}

export interface KnowledgeEntry {
  id: string;
  type: 'medical_term' | 'guideline' | 'template' | 'optimization' | 'best_practice';
  data: MedicalTerm | ClinicalGuideline | TemplateGuidance | VoiceOptimization | any;
  lastUpdated: string;
  source: string;
}

class KnowledgeBaseService {
  private knowledgeBase: Map<string, KnowledgeEntry> = new Map();
  private searchIndex: Map<string, string[]> = new Map();

  constructor() {
    this.initializeKnowledgeBase();
  }

  private initializeKnowledgeBase() {
    // Medical Terms Database
    const medicalTerms: MedicalTerm[] = [
      {
        term: "Acute Respiratory Distress Syndrome",
        definition: "A life-threatening condition where the lungs cannot provide enough oxygen to the body",
        category: "diagnosis",
        synonyms: ["ARDS", "Acute Lung Injury"],
        relatedTerms: ["pneumonia", "sepsis", "mechanical ventilation", "hypoxemia"],
        icd10: "J80",
        nursingImplications: ["Monitor oxygen saturation", "Assess respiratory status", "Position for optimal oxygenation", "Monitor for complications"]
      },
      {
        term: "Myocardial Infarction",
        definition: "Heart attack - death of heart muscle due to blocked blood flow",
        category: "diagnosis",
        synonyms: ["MI", "Heart Attack", "Acute MI"],
        relatedTerms: ["chest pain", "ECG changes", "troponin", "angina"],
        icd10: "I21",
        nursingImplications: ["Monitor cardiac rhythm", "Assess pain level", "Administer oxygen", "Prepare for intervention"]
      },
      {
        term: "Hypertension",
        definition: "High blood pressure - sustained elevation of arterial pressure",
        category: "diagnosis",
        synonyms: ["HTN", "High BP", "Elevated BP"],
        relatedTerms: ["blood pressure", "cardiovascular", "stroke risk"],
        icd10: "I10",
        nursingImplications: ["Monitor blood pressure", "Educate on lifestyle modifications", "Monitor for end-organ damage"]
      },
      {
        term: "Diabetes Mellitus",
        definition: "Metabolic disorder characterized by high blood glucose levels",
        category: "diagnosis",
        synonyms: ["DM", "Diabetes", "High Blood Sugar"],
        relatedTerms: ["glucose", "insulin", "hyperglycemia", "hypoglycemia"],
        icd10: "E11",
        nursingImplications: ["Monitor blood glucose", "Assess for complications", "Educate on self-care", "Monitor for infections"]
      },
      {
        term: "Sepsis",
        definition: "Life-threatening organ dysfunction caused by dysregulated host response to infection",
        category: "diagnosis",
        synonyms: ["Systemic Inflammatory Response", "Septic Shock"],
        relatedTerms: ["infection", "fever", "tachycardia", "hypotension"],
        icd10: "A41",
        nursingImplications: ["Monitor vital signs closely", "Assess for organ dysfunction", "Administer antibiotics promptly", "Monitor fluid balance"]
      }
    ];

    // Clinical Guidelines
    const clinicalGuidelines: ClinicalGuideline[] = [
      {
        id: "pain-assessment",
        title: "Pain Assessment Guidelines",
        category: "assessment",
        description: "Comprehensive pain assessment using multiple tools",
        guidelines: [
          "Use numeric pain scale (0-10) for adults",
          "Use Wong-Baker FACES scale for children",
          "Assess pain location, intensity, quality, and timing",
          "Consider patient's cultural background and communication needs",
          "Reassess pain after interventions"
        ],
        contraindications: ["Avoid leading questions", "Don't assume pain level based on vital signs alone"],
        notes: "Pain is subjective and should be assessed regularly"
      },
      {
        id: "medication-safety",
        title: "Medication Safety Protocol",
        category: "intervention",
        description: "Five rights of medication administration plus safety checks",
        guidelines: [
          "Right patient - verify identity using two identifiers",
          "Right medication - check medication name and concentration",
          "Right dose - verify dosage calculation",
          "Right route - confirm administration route",
          "Right time - administer at prescribed time",
          "Right documentation - record administration immediately"
        ],
        contraindications: ["Never administer without proper verification", "Don't skip safety checks for urgency"],
        notes: "When in doubt, verify with another healthcare provider"
      },
      {
        id: "infection-control",
        title: "Infection Control Standards",
        category: "intervention",
        description: "Standard and transmission-based precautions",
        guidelines: [
          "Hand hygiene before and after patient contact",
          "Use personal protective equipment appropriately",
          "Maintain clean environment",
          "Follow isolation protocols",
          "Proper disposal of contaminated materials"
        ],
        contraindications: ["Don't skip hand hygiene", "Avoid cross-contamination"],
        notes: "Protect both patient and healthcare worker"
      }
    ];

    // Template Guidance
    const templateGuidance: TemplateGuidance[] = [
      {
        template: "SOAP",
        sections: {
          "Subjective": {
            description: "Patient's reported symptoms, feelings, and concerns",
            examples: [
              "Patient reports sharp chest pain rated 8/10",
              "Patient states feeling short of breath",
              "Patient complains of nausea and dizziness"
            ],
            keyElements: ["symptoms", "pain level", "patient concerns", "history"],
            commonPhrases: ["Patient reports", "Patient states", "Patient complains of", "Patient denies"]
          },
          "Objective": {
            description: "Observable and measurable data",
            examples: [
              "Blood pressure 150/90 mmHg, heart rate 95 bpm",
              "Temperature 101.2°F, respiratory rate 22",
              "Patient appears diaphoretic and anxious"
            ],
            keyElements: ["vital signs", "physical findings", "lab results", "observations"],
            commonPhrases: ["Vital signs", "Physical exam reveals", "Patient appears", "Assessment shows"]
          },
          "Assessment": {
            description: "Clinical judgment and nursing diagnosis",
            examples: [
              "Acute chest pain related to possible cardiac event",
              "Ineffective breathing pattern related to anxiety",
              "Risk for falls related to dizziness"
            ],
            keyElements: ["nursing diagnosis", "clinical judgment", "risk factors"],
            commonPhrases: ["Assessment indicates", "Clinical impression", "Risk for", "Related to"]
          },
          "Plan": {
            description: "Interventions and goals",
            examples: [
              "Obtain 12-lead ECG, start cardiac monitoring",
              "Administer oxygen 2L via nasal cannula",
              "Implement fall prevention measures"
            ],
            keyElements: ["interventions", "goals", "monitoring", "patient education"],
            commonPhrases: ["Plan includes", "Will continue to", "Monitor for", "Educate patient"]
          }
        }
      },
      {
        template: "SBAR",
        sections: {
          "Situation": {
            description: "Current patient status and reason for communication",
            examples: [
              "Patient John Doe, 65-year-old male, experiencing chest pain",
              "Post-operative patient with elevated temperature",
              "Patient with sudden change in mental status"
            ],
            keyElements: ["patient identification", "current situation", "urgency level"],
            commonPhrases: ["Patient is", "Current situation", "Reason for calling"]
          },
          "Background": {
            description: "Relevant history and context",
            examples: [
              "Patient has history of MI in 2020, diabetic, hypertensive",
              "Surgery performed 6 hours ago, no complications noted",
              "Patient admitted 2 days ago for pneumonia"
            ],
            keyElements: ["medical history", "current medications", "recent events"],
            commonPhrases: ["Patient history includes", "Relevant background", "Recent events"]
          },
          "Assessment": {
            description: "Clinical findings and concerns",
            examples: [
              "Vital signs stable, pain controlled with morphine",
              "Temperature 102.1°F, incision site appears clean",
              "Patient confused, oriented to person only"
            ],
            keyElements: ["clinical findings", "vital signs", "concerns"],
            commonPhrases: ["Assessment shows", "Clinical findings", "Concerns include"]
          },
          "Recommendation": {
            description: "Suggested actions and next steps",
            examples: [
              "Recommend cardiology consultation and cardiac enzymes",
              "Suggest blood cultures and broad-spectrum antibiotics",
              "Recommend neurological evaluation and head CT"
            ],
            keyElements: ["recommended actions", "consultations", "orders"],
            commonPhrases: ["Recommend", "Suggest", "Request", "Please order"]
          }
        }
      }
    ];

    // Voice Optimization Patterns
    const voiceOptimizations: VoiceOptimization[] = [
      { phrase: "blood pressure", optimized: "BP", category: "abbreviation", confidence: 0.95 },
      { phrase: "heart rate", optimized: "HR", category: "abbreviation", confidence: 0.95 },
      { phrase: "respiratory rate", optimized: "RR", category: "abbreviation", confidence: 0.95 },
      { phrase: "temperature", optimized: "temp", category: "abbreviation", confidence: 0.90 },
      { phrase: "oxygen saturation", optimized: "O2 sat", category: "abbreviation", confidence: 0.95 },
      { phrase: "millimeters of mercury", optimized: "mmHg", category: "measurement", confidence: 0.98 },
      { phrase: "beats per minute", optimized: "BPM", category: "measurement", confidence: 0.95 },
      { phrase: "breaths per minute", optimized: "BPM", category: "measurement", confidence: 0.95 },
      { phrase: "patient reports", optimized: "pt reports", category: "common_phrase", confidence: 0.85 },
      { phrase: "patient denies", optimized: "pt denies", category: "common_phrase", confidence: 0.85 }
    ];

    // Store all knowledge
    [...medicalTerms, ...clinicalGuidelines, ...templateGuidance, ...voiceOptimizations].forEach((item, index) => {
      const entry: KnowledgeEntry = {
        id: `kb_${index}`,
        type: this.getTypeFromItem(item),
        data: item,
        lastUpdated: new Date().toISOString(),
        source: "NurseScribe Knowledge Base v1.3.0"
      };
      this.knowledgeBase.set(entry.id, entry);
    });

    this.buildSearchIndex();
  }

  private getTypeFromItem(item: any): KnowledgeEntry['type'] {
    if ('term' in item) return 'medical_term';
    if ('guidelines' in item) return 'guideline';
    if ('template' in item) return 'template';
    if ('phrase' in item) return 'optimization';
    return 'best_practice';
  }

  private buildSearchIndex() {
    this.knowledgeBase.forEach((entry, id) => {
      const searchTerms: string[] = [];
      
      switch (entry.type) {
        case 'medical_term':
          const term = entry.data as MedicalTerm;
          searchTerms.push(term.term, term.definition, ...term.synonyms, ...term.relatedTerms);
          break;
        case 'guideline':
          const guideline = entry.data as ClinicalGuideline;
          searchTerms.push(guideline.title, guideline.description, ...guideline.guidelines);
          break;
        case 'template':
          const template = entry.data as TemplateGuidance;
          searchTerms.push(template.template, ...Object.keys(template.sections));
          break;
        case 'optimization':
          const opt = entry.data as VoiceOptimization;
          searchTerms.push(opt.phrase, opt.optimized);
          break;
      }
      
      this.searchIndex.set(id, searchTerms.map(term => term.toLowerCase()));
    });
  }

  // Public API Methods
  public searchKnowledge(query: string): KnowledgeEntry[] {
    const results: KnowledgeEntry[] = [];
    const searchTerm = query.toLowerCase();
    
    this.searchIndex.forEach((terms, id) => {
      if (terms.some(term => term.includes(searchTerm))) {
        const entry = this.knowledgeBase.get(id);
        if (entry) results.push(entry);
      }
    });
    
    return results;
  }

  public getMedicalTerm(term: string): MedicalTerm | null {
    const results = this.searchKnowledge(term);
    const medicalTerm = results.find(r => r.type === 'medical_term');
    return medicalTerm ? medicalTerm.data as MedicalTerm : null;
  }

  public getTemplateGuidance(template: string): TemplateGuidance | null {
    const results = this.searchKnowledge(template);
    const templateGuidance = results.find(r => r.type === 'template');
    return templateGuidance ? templateGuidance.data as TemplateGuidance : null;
  }

  public getVoiceOptimizations(): VoiceOptimization[] {
    const results: VoiceOptimization[] = [];
    this.knowledgeBase.forEach(entry => {
      if (entry.type === 'optimization') {
        results.push(entry.data as VoiceOptimization);
      }
    });
    return results;
  }

  public optimizeVoiceInput(input: string): string {
    let optimized = input;
    const optimizations = this.getVoiceOptimizations();
    
    optimizations.forEach(opt => {
      const regex = new RegExp(`\\b${opt.phrase}\\b`, 'gi');
      optimized = optimized.replace(regex, opt.optimized);
    });
    
    return optimized;
  }

  public getClinicalGuidelines(category?: string): ClinicalGuideline[] {
    const results: ClinicalGuideline[] = [];
    this.knowledgeBase.forEach(entry => {
      if (entry.type === 'guideline') {
        const guideline = entry.data as ClinicalGuideline;
        if (!category || guideline.category === category) {
          results.push(guideline);
        }
      }
    });
    return results;
  }

  public getKnowledgeStats() {
    const stats = {
      totalEntries: this.knowledgeBase.size,
      medicalTerms: 0,
      guidelines: 0,
      templates: 0,
      optimizations: 0
    };

    this.knowledgeBase.forEach(entry => {
      switch (entry.type) {
        case 'medical_term': stats.medicalTerms++; break;
        case 'guideline': stats.guidelines++; break;
        case 'template': stats.templates++; break;
        case 'optimization': stats.optimizations++; break;
      }
    });

    return stats;
  }

  // Add new knowledge entry
  public addKnowledgeEntry(entry: Omit<KnowledgeEntry, 'id' | 'lastUpdated'>): string {
    const id = `kb_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newEntry: KnowledgeEntry = {
      ...entry,
      id,
      lastUpdated: new Date().toISOString()
    };
    
    this.knowledgeBase.set(id, newEntry);
    this.buildSearchIndex();
    
    return id;
  }

  // Update existing knowledge entry
  public updateKnowledgeEntry(id: string, updates: Partial<KnowledgeEntry['data']>): boolean {
    const entry = this.knowledgeBase.get(id);
    if (!entry) return false;
    
    entry.data = { ...entry.data, ...updates };
    entry.lastUpdated = new Date().toISOString();
    
    this.knowledgeBase.set(id, entry);
    this.buildSearchIndex();
    
    return true;
  }

  // Delete knowledge entry
  public deleteKnowledgeEntry(id: string): boolean {
    const deleted = this.knowledgeBase.delete(id);
    if (deleted) {
      this.buildSearchIndex();
    }
    return deleted;
  }
}

// Export singleton instance
export const knowledgeBaseService = new KnowledgeBaseService();

// Export types and service
export default knowledgeBaseService;
