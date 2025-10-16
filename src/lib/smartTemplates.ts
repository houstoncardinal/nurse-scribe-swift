interface SmartTemplate {
  id: string;
  name: string;
  category: string;
  description: string;
  sections: TemplateSection[];
  shortcuts: TemplateShortcut[];
  icd10Suggestions: string[];
  commonPhrases: string[];
  timeSavers: string[];
}

interface TemplateSection {
  id: string;
  title: string;
  placeholder: string;
  suggestions: string[];
  required: boolean;
  order: number;
}

interface TemplateShortcut {
  shortcut: string;
  expansion: string;
  category: 'assessment' | 'intervention' | 'plan' | 'general';
}

interface TimeSaver {
  id: string;
  name: string;
  shortcut: string;
  template: string;
  content: string;
  category: string;
}

class SmartTemplateService {
  private templates: SmartTemplate[] = [
    {
      id: 'nicu',
      name: 'NICU',
      category: 'Neonatal Intensive Care',
      description: 'Comprehensive neonatal intensive care documentation template',
      sections: [
        {
          id: 'assessment',
          title: 'Assessment',
          placeholder: 'Gestational age: __ weeks, Birth weight: __ g, Current weight: __ g, Vital signs stable, Respiratory support: ___, Feeding: ___, IV access: ___',
          suggestions: [
            'Gestational age: 32 weeks, Birth weight: 1800g, Current weight: 1750g',
            'Vital signs: HR 145, RR 45, BP 65/40, O2 sat 95% on room air',
            'Respiratory: No respiratory distress, clear breath sounds bilaterally',
            'Feeding: NPO, TPN running, NG tube in place',
            'IV access: PICC line in right arm, no signs of infection'
          ],
          required: true,
          order: 1
        },
        {
          id: 'interventions',
          title: 'Interventions',
          placeholder: 'Respiratory support: ___, Nutritional support: ___, Medication administration: ___, Monitoring: ___, Parent education: ___',
          suggestions: [
            'Respiratory: Continue CPAP 5 cm H2O, monitor for apnea/bradycardia',
            'Nutritional: TPN at 120 mL/kg/day, advance to enteral feeds as tolerated',
            'Medications: Vitamin K given, immunizations up to date',
            'Monitoring: Continuous cardiorespiratory monitoring, daily weights',
            'Parent education: Provided education on kangaroo care and feeding'
          ],
          required: true,
          order: 2
        },
        {
          id: 'plan',
          title: 'Plan',
          placeholder: 'Continue current respiratory support, advance nutritional plan, monitor for complications, discharge planning: ___',
          suggestions: [
            'Continue current respiratory support and monitor for improvement',
            'Advance enteral feeds gradually as tolerated',
            'Monitor for signs of infection, NEC, or other complications',
            'Continue parent education and support for discharge preparation',
            'Coordinate with multidisciplinary team for ongoing care'
          ],
          required: true,
          order: 3
        }
      ],
      shortcuts: [
        { shortcut: 'sga', expansion: 'Small for gestational age', category: 'assessment' },
        { shortcut: 'preterm', expansion: 'Preterm infant', category: 'assessment' },
        { shortcut: 'ttn', expansion: 'Transient tachypnea of newborn', category: 'assessment' },
        { shortcut: 'jaundice', expansion: 'Neonatal jaundice', category: 'assessment' },
        { shortcut: 'apnea', expansion: 'Apnea of prematurity', category: 'assessment' },
        { shortcut: 'nec', expansion: 'Necrotizing enterocolitis', category: 'assessment' },
        { shortcut: 'cpap', expansion: 'Continuous positive airway pressure', category: 'intervention' },
        { shortcut: 'picc', expansion: 'Peripherally inserted central catheter', category: 'intervention' },
        { shortcut: 'tpn', expansion: 'Total parenteral nutrition', category: 'intervention' },
        { shortcut: 'kangaroo', expansion: 'Kangaroo care', category: 'intervention' }
      ],
      icd10Suggestions: ['P07.10', 'P22.1', 'P59.9', 'P07.30', 'P22.0'],
      commonPhrases: [
        'Gestational age appropriate',
        'Vital signs stable',
        'No respiratory distress',
        'Feeding well',
        'Parent education provided',
        'Multidisciplinary team involved'
      ],
      timeSavers: [
        'Standard NICU assessment completed',
        'Family-centered care provided',
        'Discharge planning initiated'
      ]
    },
    {
      id: 'med-surg',
      name: 'Med-Surg',
      category: 'Medical-Surgical',
      description: 'General medical-surgical nursing documentation template',
      sections: [
        {
          id: 'assessment',
          title: 'Assessment',
          placeholder: 'Patient alert and oriented x3, vital signs stable, pain level: __/10, mobility: ___, ADLs: ___, skin integrity: ___, IV access: ___',
          suggestions: [
            'Patient alert and oriented x3, cooperative with care',
            'Vital signs: BP 120/80, HR 72, RR 18, O2 sat 98% on room air, T 98.6°F',
            'Pain level 3/10, well controlled with current medication',
            'Mobility: Independent with ambulation, no assistive devices needed',
            'ADLs: Independent with all activities of daily living',
            'Skin integrity: Intact, no areas of breakdown noted',
            'IV access: 20g in left forearm, patent, no signs of infiltration'
          ],
          required: true,
          order: 1
        },
        {
          id: 'interventions',
          title: 'Interventions',
          placeholder: 'Medication administration: ___, Wound care: ___, Patient education: ___, Mobility: ___, Safety measures: ___',
          suggestions: [
            'Medications administered as ordered, no adverse reactions noted',
            'Wound care performed per protocol, dressing clean and dry',
            'Patient education provided regarding medications and discharge instructions',
            'Mobility: Assisted with ambulation, encouraged activity as tolerated',
            'Safety measures: Bed in low position, call light within reach',
            'Fall risk assessment completed, no high-risk factors identified'
          ],
          required: true,
          order: 2
        },
        {
          id: 'plan',
          title: 'Plan',
          placeholder: 'Continue current medications, monitor for complications, discharge planning: ___, follow-up care: ___',
          suggestions: [
            'Continue current medication regimen and monitor for effectiveness',
            'Monitor for signs of complications or adverse reactions',
            'Discharge planning: Patient demonstrates understanding of home care',
            'Follow-up care: Scheduled with primary care provider in 1 week',
            'Patient education: Provided written materials for home reference'
          ],
          required: true,
          order: 3
        }
      ],
      shortcuts: [
        { shortcut: 'aox3', expansion: 'Alert and oriented times 3', category: 'assessment' },
        { shortcut: 'vss', expansion: 'Vital signs stable', category: 'assessment' },
        { shortcut: 'adls', expansion: 'Activities of daily living', category: 'assessment' },
        { shortcut: 'uti', expansion: 'Urinary tract infection', category: 'assessment' },
        { shortcut: 'gerd', expansion: 'Gastroesophageal reflux disease', category: 'assessment' },
        { shortcut: 'gallstones', expansion: 'Cholelithiasis', category: 'assessment' },
        { shortcut: 'po', expansion: 'By mouth', category: 'intervention' },
        { shortcut: 'iv', expansion: 'Intravenous', category: 'intervention' },
        { shortcut: 'prn', expansion: 'As needed', category: 'intervention' },
        { shortcut: 'dc', expansion: 'Discharge', category: 'plan' }
      ],
      icd10Suggestions: ['N39.0', 'K80.20', 'K21.9', 'M25.561', 'R10.9'],
      commonPhrases: [
        'Patient cooperative with care',
        'No acute distress',
        'Pain well controlled',
        'Independent with ADLs',
        'No complications noted',
        'Discharge planning initiated'
      ],
      timeSavers: [
        'Standard med-surg assessment completed',
        'Patient education provided',
        'Discharge planning in progress'
      ]
    },
    {
      id: 'icu',
      name: 'ICU',
      category: 'Intensive Care Unit',
      description: 'Critical care intensive care unit documentation template',
      sections: [
        {
          id: 'assessment',
          title: 'Assessment',
          placeholder: 'GCS: ___, Hemodynamic status: ___, Respiratory status: ___, Neurological status: ___, Skin integrity: ___, Lines/tubes: ___',
          suggestions: [
            'GCS: 15/15, patient alert and responsive to commands',
            'Hemodynamic: BP 110/70, HR 88, CVP 8, cardiac output adequate',
            'Respiratory: Ventilator settings appropriate, O2 sat 96%, clear breath sounds',
            'Neurological: Pupils equal and reactive, no focal deficits',
            'Skin integrity: Intact, turning schedule maintained',
            'Lines/tubes: ET tube, central line, foley catheter, all patent and secure'
          ],
          required: true,
          order: 1
        },
        {
          id: 'interventions',
          title: 'Interventions',
          placeholder: 'Ventilator management: ___, Hemodynamic monitoring: ___, Medication administration: ___, Sedation: ___, Infection control: ___',
          suggestions: [
            'Ventilator management: Settings appropriate, suctioning as needed',
            'Hemodynamic monitoring: Continuous arterial pressure monitoring',
            'Medication administration: Vasopressors titrated to maintain MAP >65',
            'Sedation: RASS score -2, patient calm and cooperative',
            'Infection control: Standard precautions maintained, central line care performed',
            'Positioning: Turned every 2 hours, pressure relief measures in place'
          ],
          required: true,
          order: 2
        },
        {
          id: 'plan',
          title: 'Plan',
          placeholder: 'Continue current interventions, monitor for complications, family communication: ___, goals of care: ___',
          suggestions: [
            'Continue current interventions and monitor for improvement',
            'Monitor for signs of complications: infection, bleeding, organ dysfunction',
            'Family communication: Daily updates provided, questions answered',
            'Goals of care: Discussed with family, advance directives reviewed',
            'Multidisciplinary rounds: Daily team meetings for care coordination'
          ],
          required: true,
          order: 3
        }
      ],
      shortcuts: [
        { shortcut: 'gcs', expansion: 'Glasgow Coma Scale', category: 'assessment' },
        { shortcut: 'map', expansion: 'Mean arterial pressure', category: 'assessment' },
        { shortcut: 'cvp', expansion: 'Central venous pressure', category: 'assessment' },
        { shortcut: 'et tube', expansion: 'Endotracheal tube', category: 'assessment' },
        { shortcut: 'rass', expansion: 'Richmond Agitation Sedation Scale', category: 'assessment' },
        { shortcut: 'sepsis', expansion: 'Sepsis', category: 'assessment' },
        { shortcut: 'arf', expansion: 'Acute respiratory failure', category: 'assessment' },
        { shortcut: 'peep', expansion: 'Positive end-expiratory pressure', category: 'intervention' },
        { shortcut: 'pressors', expansion: 'Vasopressors', category: 'intervention' },
        { shortcut: 'sedation', expansion: 'Sedation protocol', category: 'intervention' }
      ],
      icd10Suggestions: ['R65.20', 'J96.00', 'I46.9', 'G93.1', 'A41.9'],
      commonPhrases: [
        'Hemodynamically stable',
        'Ventilator dependent',
        'Sedation appropriate',
        'No acute changes',
        'Family updated',
        'Multidisciplinary care'
      ],
      timeSavers: [
        'Critical care assessment completed',
        'Family communication maintained',
        'Goals of care reviewed'
      ]
    },
    {
      id: 'ob',
      name: 'OB',
      category: 'Obstetrics',
      description: 'Obstetrical nursing documentation template',
      sections: [
        {
          id: 'assessment',
          title: 'Assessment',
          placeholder: 'Gravida: ___, Para: ___, EDD: ___, Gestational age: ___, FHR: ___, Contractions: ___, Cervical exam: ___, Pain level: __/10',
          suggestions: [
            'Gravida 2, Para 1, EDD: [date], Gestational age: 39 weeks 2 days',
            'FHR: 140 bpm, reactive, no decelerations noted',
            'Contractions: Every 3-4 minutes, lasting 60 seconds, moderate intensity',
            'Cervical exam: 6 cm dilated, 80% effaced, -1 station',
            'Pain level: 7/10, requesting epidural',
            'Membranes: Intact, clear fluid noted',
            'Maternal vital signs: BP 120/75, HR 88, RR 18, O2 sat 98%'
          ],
          required: true,
          order: 1
        },
        {
          id: 'interventions',
          title: 'Interventions',
          placeholder: 'Labor support: ___, Pain management: ___, Monitoring: ___, Positioning: ___, Family support: ___',
          suggestions: [
            'Labor support: Continuous support provided, breathing techniques taught',
            'Pain management: Epidural placed, patient comfortable',
            'Monitoring: Continuous FHR monitoring, intermittent BP checks',
            'Positioning: Side-lying position, frequent position changes',
            'Family support: Partner involved in care, questions answered',
            'IV access: 18g in left forearm, LR infusing at 125 mL/hr'
          ],
          required: true,
          order: 2
        },
        {
          id: 'plan',
          title: 'Plan',
          placeholder: 'Continue labor monitoring, pain management: ___, delivery preparation: ___, postpartum planning: ___',
          suggestions: [
            'Continue labor monitoring and support as labor progresses',
            'Pain management: Maintain epidural, assess effectiveness',
            'Delivery preparation: Delivery cart ready, team notified',
            'Postpartum planning: Breastfeeding education provided',
            'Family education: Newborn care and safety discussed'
          ],
          required: true,
          order: 3
        }
      ],
      shortcuts: [
        { shortcut: 'g2p1', expansion: 'Gravida 2, Para 1', category: 'assessment' },
        { shortcut: 'edd', expansion: 'Estimated due date', category: 'assessment' },
        { shortcut: 'fhr', expansion: 'Fetal heart rate', category: 'assessment' },
        { shortcut: 'cx', expansion: 'Cervix', category: 'assessment' },
        { shortcut: 'ga', expansion: 'Gestational age', category: 'assessment' },
        { shortcut: 'rom', expansion: 'Rupture of membranes', category: 'assessment' },
        { shortcut: 'epidural', expansion: 'Epidural anesthesia', category: 'intervention' },
        { shortcut: 'efm', expansion: 'Electronic fetal monitoring', category: 'intervention' },
        { shortcut: 'l&d', expansion: 'Labor and delivery', category: 'intervention' },
        { shortcut: 'pp', expansion: 'Postpartum', category: 'plan' }
      ],
      icd10Suggestions: ['O80.1', 'O26.9', 'O09.90', 'O36.4', 'O42.9'],
      commonPhrases: [
        'Labor progressing normally',
        'Fetal heart rate reactive',
        'Pain well controlled',
        'Family supportive',
        'Delivery preparation complete',
        'Postpartum planning initiated'
      ],
      timeSavers: [
        'OB assessment completed',
        'Labor support provided',
        'Family education completed'
      ]
    }
  ];

  private timeSavers: TimeSaver[] = [
    {
      id: 'standard-assessment',
      name: 'Standard Assessment',
      shortcut: 'std-assess',
      template: 'all',
      content: 'Patient alert and oriented x3, vital signs stable, no acute distress, cooperative with care',
      category: 'assessment'
    },
    {
      id: 'vital-signs-stable',
      name: 'Vital Signs Stable',
      shortcut: 'vss',
      template: 'all',
      content: 'Vital signs: BP 120/80, HR 72, RR 18, O2 sat 98% on room air, T 98.6°F',
      category: 'assessment'
    },
    {
      id: 'pain-controlled',
      name: 'Pain Controlled',
      shortcut: 'pain-ok',
      template: 'all',
      content: 'Pain level 3/10, well controlled with current medication regimen',
      category: 'assessment'
    },
    {
      id: 'no-complications',
      name: 'No Complications',
      shortcut: 'no-comp',
      template: 'all',
      content: 'No signs of complications or adverse reactions noted',
      category: 'assessment'
    },
    {
      id: 'patient-education',
      name: 'Patient Education',
      shortcut: 'pt-ed',
      template: 'all',
      content: 'Patient education provided regarding medications, discharge instructions, and home care',
      category: 'intervention'
    },
    {
      id: 'discharge-planning',
      name: 'Discharge Planning',
      shortcut: 'dc-plan',
      template: 'all',
      content: 'Discharge planning initiated, patient demonstrates understanding of home care instructions',
      category: 'plan'
    },
    {
      id: 'family-updated',
      name: 'Family Updated',
      shortcut: 'fam-update',
      template: 'all',
      content: 'Family updated on patient condition and plan of care, questions answered',
      category: 'intervention'
    },
    {
      id: 'multidisciplinary-care',
      name: 'Multidisciplinary Care',
      shortcut: 'multi-care',
      template: 'all',
      content: 'Multidisciplinary team involved in care planning and coordination',
      category: 'intervention'
    }
  ];

  getTemplates(): SmartTemplate[] {
    return this.templates;
  }

  getTemplateById(id: string): SmartTemplate | null {
    return this.templates.find(template => template.id === id) || null;
  }

  getTemplateShortcuts(templateId: string): TemplateShortcut[] {
    const template = this.getTemplateById(templateId);
    return template ? template.shortcuts : [];
  }

  getTimeSavers(): TimeSaver[] {
    return this.timeSavers;
  }

  getTimeSaverByShortcut(shortcut: string): TimeSaver | null {
    return this.timeSavers.find(ts => ts.shortcut === shortcut) || null;
  }

  expandShortcut(shortcut: string, templateId?: string): string {
    // First check template-specific shortcuts
    if (templateId) {
      const template = this.getTemplateById(templateId);
      const templateShortcut = template?.shortcuts.find(s => s.shortcut === shortcut);
      if (templateShortcut) {
        return templateShortcut.expansion;
      }
    }

    // Then check global time savers
    const timeSaver = this.getTimeSaverByShortcut(shortcut);
    if (timeSaver) {
      return timeSaver.content;
    }

    return shortcut; // Return original if no expansion found
  }

  getCommonPhrases(templateId: string): string[] {
    const template = this.getTemplateById(templateId);
    return template ? template.commonPhrases : [];
  }

  getICD10Suggestions(templateId: string): string[] {
    const template = this.getTemplateById(templateId);
    return template ? template.icd10Suggestions : [];
  }

  generateSmartSuggestions(input: string, templateId: string, sectionId: string): string[] {
    const template = this.getTemplateById(templateId);
    if (!template) return [];

    const section = template.sections.find(s => s.id === sectionId);
    if (!section) return [];

    const suggestions: string[] = [];

    // Add section-specific suggestions
    suggestions.push(...section.suggestions);

    // Add template-specific common phrases
    suggestions.push(...template.commonPhrases);

    // Filter suggestions based on input
    if (input && input.length > 0) {
      const filtered = suggestions.filter(suggestion =>
        suggestion.toLowerCase().includes(input.toLowerCase())
      );
      return filtered.slice(0, 5);
    }

    return suggestions.slice(0, 5);
  }

  validateTemplateCompletion(templateId: string, content: { [sectionId: string]: string }): {
    isValid: boolean;
    missingSections: string[];
    suggestions: string[];
  } {
    const template = this.getTemplateById(templateId);
    if (!template) {
      return { isValid: false, missingSections: [], suggestions: [] };
    }

    const missingSections: string[] = [];
    const suggestions: string[] = [];

    template.sections.forEach(section => {
      if (section.required && (!content[section.id] || content[section.id].trim().length === 0)) {
        missingSections.push(section.title);
        suggestions.push(section.placeholder);
      }
    });

    return {
      isValid: missingSections.length === 0,
      missingSections,
      suggestions
    };
  }
}

export const smartTemplateService = new SmartTemplateService();
