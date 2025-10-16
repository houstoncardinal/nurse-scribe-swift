interface ICD10Code {
  code: string;
  description: string;
  category: string;
  commonTerms: string[];
  synonyms: string[];
  relatedCodes?: string[];
}

interface SuggestionResult {
  code: string;
  description: string;
  confidence: number;
  category: string;
  matchType: 'exact' | 'partial' | 'synonym' | 'related';
}

class ICD10SuggestionService {
  private icd10Codes: ICD10Code[] = [
    // Pain-related codes
    {
      code: 'R10.31',
      description: 'Right lower quadrant pain',
      category: 'Symptoms',
      commonTerms: ['abdominal pain', 'stomach pain', 'belly pain', 'tummy pain'],
      synonyms: ['RLQ pain', 'right lower quadrant', 'right side pain'],
      relatedCodes: ['R10.30', 'R10.32', 'R10.33']
    },
    {
      code: 'R10.30',
      description: 'Lower abdominal pain, unspecified',
      category: 'Symptoms',
      commonTerms: ['lower abdominal pain', 'lower belly pain', 'pelvic pain'],
      synonyms: ['lower abdomen', 'suprapubic pain'],
      relatedCodes: ['R10.31', 'R10.32', 'R10.33']
    },
    {
      code: 'R10.32',
      description: 'Left lower quadrant pain',
      category: 'Symptoms',
      commonTerms: ['left lower quadrant pain', 'left side pain'],
      synonyms: ['LLQ pain', 'left lower quadrant'],
      relatedCodes: ['R10.30', 'R10.31', 'R10.33']
    },
    {
      code: 'R10.33',
      description: 'Periumbilical pain',
      category: 'Symptoms',
      commonTerms: ['periumbilical pain', 'around belly button', 'umbilical pain'],
      synonyms: ['periumbilical', 'around navel'],
      relatedCodes: ['R10.30', 'R10.31', 'R10.32']
    },
    {
      code: 'R10.9',
      description: 'Unspecified abdominal pain',
      category: 'Symptoms',
      commonTerms: ['abdominal pain', 'stomach pain', 'belly pain'],
      synonyms: ['abd pain', 'stomach ache'],
      relatedCodes: ['R10.30', 'R10.31', 'R10.32', 'R10.33']
    },

    // Cardiovascular
    {
      code: 'I21.9',
      description: 'Acute myocardial infarction, unspecified',
      category: 'Cardiovascular',
      commonTerms: ['heart attack', 'myocardial infarction', 'MI', 'acute MI'],
      synonyms: ['AMI', 'acute MI', 'heart attack'],
      relatedCodes: ['I21.01', 'I21.02', 'I21.11', 'I21.19']
    },
    {
      code: 'I25.10',
      description: 'Atherosclerotic heart disease of native coronary artery without angina pectoris',
      category: 'Cardiovascular',
      commonTerms: ['coronary artery disease', 'CAD', 'heart disease', 'atherosclerosis'],
      synonyms: ['CHD', 'coronary heart disease', 'arteriosclerosis'],
      relatedCodes: ['I25.9', 'I25.810']
    },

    // Respiratory
    {
      code: 'J44.1',
      description: 'Chronic obstructive pulmonary disease with acute exacerbation',
      category: 'Respiratory',
      commonTerms: ['COPD', 'chronic obstructive pulmonary disease', 'lung disease', 'emphysema'],
      synonyms: ['chronic bronchitis', 'COPD exacerbation', 'lung condition'],
      relatedCodes: ['J44.0', 'J44.9']
    },
    {
      code: 'J18.9',
      description: 'Pneumonia, unspecified organism',
      category: 'Respiratory',
      commonTerms: ['pneumonia', 'lung infection', 'chest infection'],
      synonyms: ['pneumonitis', 'lung inflammation'],
      relatedCodes: ['J18.0', 'J18.1', 'J18.8']
    },

    // Neurological
    {
      code: 'G93.1',
      description: 'Anoxic brain damage, not elsewhere classified',
      category: 'Neurological',
      commonTerms: ['brain damage', 'anoxic brain injury', 'hypoxic brain injury'],
      synonyms: ['HBI', 'anoxic encephalopathy'],
      relatedCodes: ['G93.9']
    },
    {
      code: 'G40.909',
      description: 'Epilepsy, unspecified, not intractable, without status epilepticus',
      category: 'Neurological',
      commonTerms: ['epilepsy', 'seizure disorder', 'seizures'],
      synonyms: ['epileptic disorder', 'convulsive disorder'],
      relatedCodes: ['G40.901', 'G40.911']
    },

    // Gastrointestinal
    {
      code: 'K59.00',
      description: 'Constipation, unspecified',
      category: 'Gastrointestinal',
      commonTerms: ['constipation', 'difficulty passing stool', 'hard stool'],
      synonyms: ['bowel obstruction', 'infrequent bowel movements'],
      relatedCodes: ['K59.01', 'K59.02']
    },
    {
      code: 'K92.2',
      description: 'Gastrointestinal hemorrhage, unspecified',
      category: 'Gastrointestinal',
      commonTerms: ['GI bleed', 'gastrointestinal bleeding', 'internal bleeding'],
      synonyms: ['GI hemorrhage', 'bowel bleeding'],
      relatedCodes: ['K92.1', 'K92.9']
    },

    // Musculoskeletal
    {
      code: 'M25.561',
      description: 'Pain in right knee',
      category: 'Musculoskeletal',
      commonTerms: ['right knee pain', 'knee pain', 'right leg pain'],
      synonyms: ['R knee pain', 'right knee ache'],
      relatedCodes: ['M25.561', 'M25.562', 'M25.569']
    },
    {
      code: 'M54.5',
      description: 'Low back pain',
      category: 'Musculoskeletal',
      commonTerms: ['low back pain', 'lumbar pain', 'lower back pain'],
      synonyms: ['LBP', 'lumbar spine pain', 'backache'],
      relatedCodes: ['M54.6', 'M54.9']
    },

    // Diabetes
    {
      code: 'E11.9',
      description: 'Type 2 diabetes mellitus without complications',
      category: 'Endocrine',
      commonTerms: ['type 2 diabetes', 'diabetes', 'diabetes mellitus', 'T2DM'],
      synonyms: ['DM2', 'non-insulin dependent diabetes', 'adult onset diabetes'],
      relatedCodes: ['E11.65', 'E11.9']
    },
    {
      code: 'E10.9',
      description: 'Type 1 diabetes mellitus without complications',
      category: 'Endocrine',
      commonTerms: ['type 1 diabetes', 'insulin dependent diabetes', 'T1DM'],
      synonyms: ['DM1', 'juvenile diabetes', 'insulin dependent'],
      relatedCodes: ['E10.65', 'E10.9']
    },

    // Mental Health
    {
      code: 'F32.9',
      description: 'Major depressive disorder, single episode, unspecified',
      category: 'Mental Health',
      commonTerms: ['depression', 'major depression', 'depressive disorder'],
      synonyms: ['MDD', 'clinical depression', 'unipolar depression'],
      relatedCodes: ['F32.0', 'F32.1', 'F32.2']
    },
    {
      code: 'F41.9',
      description: 'Anxiety disorder, unspecified',
      category: 'Mental Health',
      commonTerms: ['anxiety', 'anxiety disorder', 'nervousness'],
      synonyms: ['generalized anxiety', 'GAD', 'anxiety state'],
      relatedCodes: ['F41.1', 'F41.8']
    },

    // Infectious Diseases
    {
      code: 'B34.9',
      description: 'Viral infection, unspecified',
      category: 'Infectious',
      commonTerms: ['viral infection', 'virus', 'viral illness'],
      synonyms: ['viral disease', 'viral syndrome'],
      relatedCodes: ['B34.0', 'B34.1']
    },
    {
      code: 'A41.9',
      description: 'Sepsis, unspecified organism',
      category: 'Infectious',
      commonTerms: ['sepsis', 'septicemia', 'blood infection', 'systemic infection'],
      synonyms: ['septic shock', 'blood poisoning'],
      relatedCodes: ['A41.51', 'A41.52']
    },

    // Skin Conditions
    {
      code: 'L89.9',
      description: 'Pressure ulcer of unspecified site, unspecified stage',
      category: 'Skin',
      commonTerms: ['pressure ulcer', 'bed sore', 'decubitus ulcer', 'pressure sore'],
      synonyms: ['pressure injury', 'skin breakdown'],
      relatedCodes: ['L89.00', 'L89.01', 'L89.02']
    },
    {
      code: 'L30.9',
      description: 'Dermatitis, unspecified',
      category: 'Skin',
      commonTerms: ['dermatitis', 'skin inflammation', 'skin rash', 'eczema'],
      synonyms: ['skin condition', 'inflammatory skin disease'],
      relatedCodes: ['L30.0', 'L30.1', 'L30.2']
    },

    // NICU Specific
    {
      code: 'P07.10',
      description: 'Light for gestational age, unspecified weight',
      category: 'NICU',
      commonTerms: ['small for gestational age', 'SGA', 'low birth weight'],
      synonyms: ['light for dates', 'intrauterine growth restriction'],
      relatedCodes: ['P07.11', 'P07.12', 'P07.13']
    },
    {
      code: 'P22.1',
      description: 'Transient tachypnea of newborn',
      category: 'NICU',
      commonTerms: ['transient tachypnea', 'TTN', 'newborn breathing problems'],
      synonyms: ['wet lung', 'respiratory distress'],
      relatedCodes: ['P22.0', 'P22.8', 'P22.9']
    },
    {
      code: 'P59.9',
      description: 'Neonatal jaundice, unspecified',
      category: 'NICU',
      commonTerms: ['newborn jaundice', 'neonatal jaundice', 'baby jaundice'],
      synonyms: ['hyperbilirubinemia', 'yellow baby'],
      relatedCodes: ['P59.0', 'P59.1', 'P59.2']
    },

    // OB Specific
    {
      code: 'O80.1',
      description: 'Spontaneous vertex delivery',
      category: 'OB',
      commonTerms: ['normal delivery', 'spontaneous delivery', 'vaginal delivery'],
      synonyms: ['SVD', 'natural delivery'],
      relatedCodes: ['O80.0', 'O80.2', 'O80.9']
    },
    {
      code: 'O26.9',
      description: 'Pregnancy-related condition, unspecified',
      category: 'OB',
      commonTerms: ['pregnancy complication', 'maternal condition', 'prenatal condition'],
      synonyms: ['gestational condition', 'maternal disorder'],
      relatedCodes: ['O26.0', 'O26.1', 'O26.2']
    },

    // ICU Specific
    {
      code: 'R65.20',
      description: 'Severe sepsis without septic shock',
      category: 'ICU',
      commonTerms: ['severe sepsis', 'sepsis', 'septic shock'],
      synonyms: ['severe infection', 'systemic inflammatory response'],
      relatedCodes: ['R65.21', 'A41.9']
    },
    {
      code: 'J96.00',
      description: 'Acute respiratory failure, unspecified whether with hypoxia or hypercapnia',
      category: 'ICU',
      commonTerms: ['acute respiratory failure', 'ARF', 'respiratory failure'],
      synonyms: ['respiratory insufficiency', 'breathing failure'],
      relatedCodes: ['J96.01', 'J96.02']
    },

    // Med-Surg Specific
    {
      code: 'N39.0',
      description: 'Urinary tract infection, site not specified',
      category: 'Med-Surg',
      commonTerms: ['UTI', 'urinary tract infection', 'bladder infection'],
      synonyms: ['urinary infection', 'cystitis'],
      relatedCodes: ['N30.00', 'N30.01']
    },
    {
      code: 'K80.20',
      description: 'Calculus of gallbladder without obstruction',
      category: 'Med-Surg',
      commonTerms: ['gallstones', 'cholelithiasis', 'gallbladder stones'],
      synonyms: ['biliary calculi', 'gallbladder disease'],
      relatedCodes: ['K80.21', 'K80.22']
    }
  ];

  private smartTemplates: { [key: string]: ICD10Code[] } = {
    'NICU': [
      this.icd10Codes.find(c => c.code === 'P07.10')!,
      this.icd10Codes.find(c => c.code === 'P22.1')!,
      this.icd10Codes.find(c => c.code === 'P59.9')!,
      { code: 'P07.30', description: 'Preterm newborn, unspecified weeks', category: 'NICU', commonTerms: ['preterm', 'premature'], synonyms: ['premature baby'], relatedCodes: [] },
      { code: 'P07.37', description: 'Preterm newborn, gestational age 28 completed weeks', category: 'NICU', commonTerms: ['28 weeks', 'very preterm'], synonyms: ['extremely premature'], relatedCodes: [] }
    ],
    'OB': [
      this.icd10Codes.find(c => c.code === 'O80.1')!,
      this.icd10Codes.find(c => c.code === 'O26.9')!,
      { code: 'O09.90', description: 'Supervision of pregnancy with unspecified high-risk factor, unspecified trimester', category: 'OB', commonTerms: ['high risk pregnancy'], synonyms: ['complicated pregnancy'], relatedCodes: [] },
      { code: 'O36.4', description: 'Maternal care for intrauterine death', category: 'OB', commonTerms: ['fetal demise', 'stillbirth'], synonyms: ['intrauterine fetal death'], relatedCodes: [] }
    ],
    'ICU': [
      this.icd10Codes.find(c => c.code === 'R65.20')!,
      this.icd10Codes.find(c => c.code === 'J96.00')!,
      { code: 'I46.9', description: 'Cardiac arrest, cause unspecified', category: 'ICU', commonTerms: ['cardiac arrest', 'code blue'], synonyms: ['heart stopped'], relatedCodes: [] },
      { code: 'G93.1', description: 'Anoxic brain damage', category: 'ICU', commonTerms: ['brain damage'], synonyms: ['HBI'], relatedCodes: [] }
    ],
    'Med-Surg': [
      this.icd10Codes.find(c => c.code === 'N39.0')!,
      this.icd10Codes.find(c => c.code === 'K80.20')!,
      { code: 'K21.9', description: 'Gastro-esophageal reflux disease without esophagitis', category: 'Med-Surg', commonTerms: ['GERD', 'acid reflux'], synonyms: ['heartburn'], relatedCodes: [] },
      { code: 'M25.561', description: 'Pain in right knee', category: 'Med-Surg', commonTerms: ['knee pain'], synonyms: ['joint pain'], relatedCodes: [] }
    ]
  };

  getSuggestions(input: string, category?: string, limit: number = 5): SuggestionResult[] {
    if (!input || input.length < 2) return [];

    const searchTerm = input.toLowerCase().trim();
    const suggestions: SuggestionResult[] = [];

    // Filter by category if specified
    let codesToSearch = this.icd10Codes;
    if (category && this.smartTemplates[category]) {
      codesToSearch = this.smartTemplates[category];
    }

    codesToSearch.forEach(code => {
      let confidence = 0;
      let matchType: 'exact' | 'partial' | 'synonym' | 'related' | 'fuzzy' = 'related';

      // Strategy 1: Exact match in common terms (highest priority)
      const exactMatch = code.commonTerms.find(term => term.toLowerCase() === searchTerm);
      if (exactMatch) {
        confidence = 1.0;
        matchType = 'exact';
      }
      // Strategy 2: Partial match in common terms
      else if (code.commonTerms.some(term => term.toLowerCase().includes(searchTerm))) {
        confidence = 0.9;
        matchType = 'partial';
      }
      // Strategy 3: Fuzzy matching for common medical abbreviations
      else if (this.fuzzyMatch(searchTerm, code.commonTerms)) {
        confidence = 0.85;
        matchType = 'fuzzy';
      }
      // Strategy 4: Multi-word search (e.g., "chest pain" matches both words)
      else if (this.multiWordMatch(searchTerm, code)) {
        confidence = 0.8;
        matchType = 'partial';
      }
      // Strategy 5: Match in description
      else if (code.description.toLowerCase().includes(searchTerm)) {
        confidence = 0.75;
        matchType = 'partial';
      }
      // Strategy 6: Match in synonyms
      else if (code.synonyms.some(synonym => synonym.toLowerCase().includes(searchTerm))) {
        confidence = 0.7;
        matchType = 'synonym';
      }
      // Strategy 7: Related codes search
      else if (code.relatedCodes?.some(relatedCode => {
        const relatedCodeData = this.icd10Codes.find(c => c.code === relatedCode);
        return relatedCodeData?.commonTerms.some(term => term.toLowerCase().includes(searchTerm));
      })) {
        confidence = 0.6;
        matchType = 'related';
      }

      if (confidence > 0) {
        suggestions.push({
          code: code.code,
          description: code.description,
          confidence,
          category: code.category,
          matchType
        });
      }
    });

    // Sort by confidence and return top results
    return suggestions
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, limit);
  }

  // Enhanced fuzzy matching for medical abbreviations
  private fuzzyMatch(searchTerm: string, terms: string[]): boolean {
    const abbreviations: { [key: string]: string[] } = {
      'cp': ['chest pain', 'cardiac pain'],
      'sob': ['shortness of breath', 'dyspnea'],
      'n/v': ['nausea', 'vomiting'],
      'abd': ['abdominal', 'abdomen'],
      'bp': ['blood pressure'],
      'hr': ['heart rate'],
      'temp': ['temperature', 'fever'],
      'mi': ['myocardial infarction', 'heart attack'],
      'cva': ['cerebrovascular accident', 'stroke'],
      'copd': ['chronic obstructive pulmonary disease'],
      'dm': ['diabetes mellitus'],
      'htn': ['hypertension'],
      'chf': ['congestive heart failure']
    };

    const searchLower = searchTerm.toLowerCase();
    
    // Check direct abbreviation mapping
    if (abbreviations[searchLower]) {
      return abbreviations[searchLower].some(expansion => 
        terms.some(term => term.toLowerCase().includes(expansion))
      );
    }

    // Check if search term is contained in any expansion
    for (const [abbr, expansions] of Object.entries(abbreviations)) {
      if (expansions.some(expansion => expansion.includes(searchLower))) {
        return terms.some(term => term.toLowerCase().includes(abbr));
      }
    }

    return false;
  }

  // Multi-word search matching
  private multiWordMatch(searchTerm: string, code: ICD10Code): boolean {
    const words = searchTerm.split(/\s+/).filter(word => word.length > 2);
    if (words.length < 2) return false;

    const allTerms = [...code.commonTerms, ...code.synonyms, code.description.toLowerCase()];
    const searchText = allTerms.join(' ');

    // Check if all words from search term are found in the combined text
    return words.every(word => searchText.includes(word.toLowerCase()));
  }

  getSmartTemplateCodes(template: string): ICD10Code[] {
    return this.smartTemplates[template] || [];
  }

  getTimeSaverShortcuts(): { [key: string]: { code: string; description: string; shortcut: string } } {
    return {
      'abd pain': { code: 'R10.9', description: 'Unspecified abdominal pain', shortcut: 'abd pain' },
      'chest pain': { code: 'R06.02', description: 'Shortness of breath', shortcut: 'chest pain' },
      'sob': { code: 'R06.02', description: 'Shortness of breath', shortcut: 'sob' },
      'uti': { code: 'N39.0', description: 'Urinary tract infection', shortcut: 'uti' },
      'pneumonia': { code: 'J18.9', description: 'Pneumonia, unspecified', shortcut: 'pneumonia' },
      'copd': { code: 'J44.1', description: 'COPD with acute exacerbation', shortcut: 'copd' },
      'mi': { code: 'I21.9', description: 'Acute myocardial infarction', shortcut: 'mi' },
      'stroke': { code: 'I63.9', description: 'Cerebral infarction, unspecified', shortcut: 'stroke' },
      'diabetes': { code: 'E11.9', description: 'Type 2 diabetes mellitus', shortcut: 'diabetes' },
      'depression': { code: 'F32.9', description: 'Major depressive disorder', shortcut: 'depression' },
      'sepsis': { code: 'A41.9', description: 'Sepsis, unspecified', shortcut: 'sepsis' },
      'pressure ulcer': { code: 'L89.9', description: 'Pressure ulcer, unspecified', shortcut: 'pressure ulcer' },
      'preterm': { code: 'P07.30', description: 'Preterm newborn', shortcut: 'preterm' },
      'sga': { code: 'P07.10', description: 'Small for gestational age', shortcut: 'sga' },
      'ttn': { code: 'P22.1', description: 'Transient tachypnea of newborn', shortcut: 'ttn' },
      'jaundice': { code: 'P59.9', description: 'Neonatal jaundice', shortcut: 'jaundice' },
      'delivery': { code: 'O80.1', description: 'Spontaneous vertex delivery', shortcut: 'delivery' },
      'high risk': { code: 'O09.90', description: 'High-risk pregnancy', shortcut: 'high risk' },
      'arf': { code: 'J96.00', description: 'Acute respiratory failure', shortcut: 'arf' },
      'cardiac arrest': { code: 'I46.9', description: 'Cardiac arrest', shortcut: 'cardiac arrest' },
      'gerd': { code: 'K21.9', description: 'GERD', shortcut: 'gerd' },
      'gallstones': { code: 'K80.20', description: 'Gallstones', shortcut: 'gallstones' }
    };
  }

  expandShortcut(shortcut: string): { code: string; description: string } | null {
    const shortcuts = this.getTimeSaverShortcuts();
    const expanded = shortcuts[shortcut.toLowerCase()];
    return expanded || null;
  }

  getCodeByCode(code: string): ICD10Code | null {
    return this.icd10Codes.find(c => c.code === code) || null;
  }

  getRelatedCodes(code: string): ICD10Code[] {
    const mainCode = this.getCodeByCode(code);
    if (!mainCode || !mainCode.relatedCodes) return [];

    return mainCode.relatedCodes
      .map(relatedCode => this.getCodeByCode(relatedCode))
      .filter((code): code is ICD10Code => code !== null);
  }
}

export const icd10SuggestionService = new ICD10SuggestionService();
