/**
 * International Support Service
 * Multi-language and ICD-11 support for global healthcare
 */

export type SupportedLanguage = 'en' | 'es' | 'fr' | 'de' | 'pt' | 'zh' | 'ja' | 'ar' | 'hi';

export interface LanguageConfig {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  rtl: boolean;
  medicalTerminologySupport: boolean;
}

export interface ICD11Code {
  code: string;
  title: string;
  definition: string;
  category: string;
  parentCode?: string;
  synonyms: string[];
}

export interface TranslationContext {
  sourceLanguage: SupportedLanguage;
  targetLanguage: SupportedLanguage;
  medicalContext: boolean;
  preserveTerminology: boolean;
}

class InternationalSupportService {
  private currentLanguage: SupportedLanguage = 'en';
  
  private languages: Record<SupportedLanguage, LanguageConfig> = {
    'en': {
      code: 'en',
      name: 'English',
      nativeName: 'English',
      rtl: false,
      medicalTerminologySupport: true
    },
    'es': {
      code: 'es',
      name: 'Spanish',
      nativeName: 'Español',
      rtl: false,
      medicalTerminologySupport: true
    },
    'fr': {
      code: 'fr',
      name: 'French',
      nativeName: 'Français',
      rtl: false,
      medicalTerminologySupport: true
    },
    'de': {
      code: 'de',
      name: 'German',
      nativeName: 'Deutsch',
      rtl: false,
      medicalTerminologySupport: true
    },
    'pt': {
      code: 'pt',
      name: 'Portuguese',
      nativeName: 'Português',
      rtl: false,
      medicalTerminologySupport: true
    },
    'zh': {
      code: 'zh',
      name: 'Chinese',
      nativeName: '中文',
      rtl: false,
      medicalTerminologySupport: true
    },
    'ja': {
      code: 'ja',
      name: 'Japanese',
      nativeName: '日本語',
      rtl: false,
      medicalTerminologySupport: true
    },
    'ar': {
      code: 'ar',
      name: 'Arabic',
      nativeName: 'العربية',
      rtl: true,
      medicalTerminologySupport: true
    },
    'hi': {
      code: 'hi',
      name: 'Hindi',
      nativeName: 'हिन्दी',
      rtl: false,
      medicalTerminologySupport: true
    }
  };

  // ICD-11 code mappings (sample - would be much larger in production)
  private icd11Codes: Record<string, ICD11Code> = {
    'BA00': {
      code: 'BA00',
      title: 'Diseases of the circulatory system',
      definition: 'Disorders affecting the heart and blood vessels',
      category: 'Cardiovascular',
      synonyms: ['cardiovascular diseases', 'heart diseases']
    },
    'BA01.0': {
      code: 'BA01.0',
      title: 'Essential hypertension',
      definition: 'High blood pressure of unknown cause',
      category: 'Cardiovascular',
      parentCode: 'BA00',
      synonyms: ['primary hypertension', 'idiopathic hypertension']
    },
    'BA40': {
      code: 'BA40',
      title: 'Heart failure',
      definition: 'Inability of heart to pump sufficient blood',
      category: 'Cardiovascular',
      parentCode: 'BA00',
      synonyms: ['cardiac failure', 'congestive heart failure']
    },
    'CA00': {
      code: 'CA00',
      title: 'Diseases of the respiratory system',
      definition: 'Disorders affecting breathing and lungs',
      category: 'Respiratory',
      synonyms: ['pulmonary diseases', 'lung diseases']
    },
    'CA40': {
      code: 'CA40',
      title: 'Chronic obstructive pulmonary disease',
      definition: 'Progressive lung disease causing breathing difficulty',
      category: 'Respiratory',
      parentCode: 'CA00',
      synonyms: ['COPD', 'chronic bronchitis', 'emphysema']
    },
    '5A00': {
      code: '5A00',
      title: 'Endocrine, nutritional or metabolic diseases',
      definition: 'Disorders of hormones, nutrition, and metabolism',
      category: 'Endocrine',
      synonyms: ['metabolic disorders', 'hormonal diseases']
    },
    '5A10': {
      code: '5A10',
      title: 'Diabetes mellitus',
      definition: 'Group of metabolic disorders with high blood sugar',
      category: 'Endocrine',
      parentCode: '5A00',
      synonyms: ['diabetes', 'sugar diabetes']
    },
    '5A11': {
      code: '5A11',
      title: 'Type 2 diabetes mellitus',
      definition: 'Diabetes due to insulin resistance',
      category: 'Endocrine',
      parentCode: '5A10',
      synonyms: ['adult-onset diabetes', 'non-insulin dependent diabetes']
    }
  };

  // Medical terminology translations (sample)
  private medicalTermTranslations: Record<string, Record<SupportedLanguage, string>> = {
    'hypertension': {
      'en': 'hypertension',
      'es': 'hipertensión',
      'fr': 'hypertension',
      'de': 'Hypertonie',
      'pt': 'hipertensão',
      'zh': '高血压',
      'ja': '高血圧',
      'ar': 'ارتفاع ضغط الدم',
      'hi': 'उच्च रक्तचाप'
    },
    'diabetes': {
      'en': 'diabetes',
      'es': 'diabetes',
      'fr': 'diabète',
      'de': 'Diabetes',
      'pt': 'diabetes',
      'zh': '糖尿病',
      'ja': '糖尿病',
      'ar': 'السكري',
      'hi': 'मधुमेह'
    },
    'blood pressure': {
      'en': 'blood pressure',
      'es': 'presión arterial',
      'fr': 'tension artérielle',
      'de': 'Blutdruck',
      'pt': 'pressão arterial',
      'zh': '血压',
      'ja': '血圧',
      'ar': 'ضغط الدم',
      'hi': 'रक्तचाप'
    },
    'heart rate': {
      'en': 'heart rate',
      'es': 'frecuencia cardíaca',
      'fr': 'fréquence cardiaque',
      'de': 'Herzfrequenz',
      'pt': 'frequência cardíaca',
      'zh': '心率',
      'ja': '心拍数',
      'ar': 'معدل ضربات القلب',
      'hi': 'हृदय गति'
    },
    'temperature': {
      'en': 'temperature',
      'es': 'temperatura',
      'fr': 'température',
      'de': 'Temperatur',
      'pt': 'temperatura',
      'zh': '温度',
      'ja': '温度',
      'ar': 'درجة الحرارة',
      'hi': 'तापमान'
    },
    'pain': {
      'en': 'pain',
      'es': 'dolor',
      'fr': 'douleur',
      'de': 'Schmerz',
      'pt': 'dor',
      'zh': '疼痛',
      'ja': '痛み',
      'ar': 'ألم',
      'hi': 'दर्द'
    },
    'patient': {
      'en': 'patient',
      'es': 'paciente',
      'fr': 'patient',
      'de': 'Patient',
      'pt': 'paciente',
      'zh': '患者',
      'ja': '患者',
      'ar': 'مريض',
      'hi': 'रोगी'
    }
  };

  /**
   * Set current language
   */
  public setLanguage(language: SupportedLanguage): void {
    if (this.languages[language]) {
      this.currentLanguage = language;
      console.log(`Language set to: ${this.languages[language].name}`);
    }
  }

  /**
   * Get current language
   */
  public getCurrentLanguage(): SupportedLanguage {
    return this.currentLanguage;
  }

  /**
   * Get all supported languages
   */
  public getSupportedLanguages(): LanguageConfig[] {
    return Object.values(this.languages);
  }

  /**
   * Get language config
   */
  public getLanguageConfig(language: SupportedLanguage): LanguageConfig | null {
    return this.languages[language] || null;
  }

  /**
   * Convert ICD-10 to ICD-11
   */
  public convertICD10ToICD11(icd10Code: string): ICD11Code | null {
    // Mapping logic (simplified - would need full conversion table)
    const conversionMap: Record<string, string> = {
      'I50.9': 'BA40', // Heart failure
      'E11.9': '5A11', // Type 2 diabetes
      'I10': 'BA01.0', // Essential hypertension
      'J44.9': 'CA40' // COPD
    };

    const icd11Code = conversionMap[icd10Code];
    return icd11Code ? this.icd11Codes[icd11Code] || null : null;
  }

  /**
   * Search ICD-11 codes
   */
  public searchICD11(query: string): ICD11Code[] {
    const lowerQuery = query.toLowerCase();
    
    return Object.values(this.icd11Codes).filter(code => 
      code.title.toLowerCase().includes(lowerQuery) ||
      code.definition.toLowerCase().includes(lowerQuery) ||
      code.synonyms.some(syn => syn.toLowerCase().includes(lowerQuery))
    );
  }

  /**
   * Get ICD-11 code details
   */
  public getICD11Code(code: string): ICD11Code | null {
    return this.icd11Codes[code] || null;
  }

  /**
   * Translate medical term
   */
  public translateMedicalTerm(term: string, targetLanguage?: SupportedLanguage): string {
    const target = targetLanguage || this.currentLanguage;
    const lowerTerm = term.toLowerCase();
    
    if (this.medicalTermTranslations[lowerTerm]) {
      return this.medicalTermTranslations[lowerTerm][target] || term;
    }
    
    return term;
  }

  /**
   * Translate note text
   */
  public async translateNote(text: string, context: TranslationContext): Promise<string> {
    console.log(`Translating from ${context.sourceLanguage} to ${context.targetLanguage}`);
    
    if (context.sourceLanguage === context.targetLanguage) {
      return text;
    }

    // In production, this would call a translation API
    // For now, return a placeholder
    if (context.preserveTerminology) {
      // Extract and preserve medical terms
      const words = text.split(' ');
      return words.map(word => {
        const cleanWord = word.toLowerCase().replace(/[.,!?;:]/g, '');
        return this.translateMedicalTerm(cleanWord, context.targetLanguage);
      }).join(' ');
    }

    return `[Translated to ${this.languages[context.targetLanguage].name}] ${text}`;
  }

  /**
   * Detect language
   */
  public detectLanguage(text: string): SupportedLanguage {
    // Simple detection based on character sets
    // In production, would use proper language detection library
    
    // Check for Chinese characters
    if (/[\u4e00-\u9fa5]/.test(text)) return 'zh';
    
    // Check for Japanese characters
    if (/[\u3040-\u309f\u30a0-\u30ff]/.test(text)) return 'ja';
    
    // Check for Arabic characters
    if (/[\u0600-\u06ff]/.test(text)) return 'ar';
    
    // Check for Hindi characters
    if (/[\u0900-\u097f]/.test(text)) return 'hi';
    
    // Default to English
    return 'en';
  }

  /**
   * Format date for locale
   */
  public formatDate(date: Date, language?: SupportedLanguage): string {
    const locale = language || this.currentLanguage;
    const localeMap: Record<SupportedLanguage, string> = {
      'en': 'en-US',
      'es': 'es-ES',
      'fr': 'fr-FR',
      'de': 'de-DE',
      'pt': 'pt-BR',
      'zh': 'zh-CN',
      'ja': 'ja-JP',
      'ar': 'ar-SA',
      'hi': 'hi-IN'
    };

    return date.toLocaleDateString(localeMap[locale]);
  }

  /**
   * Format number for locale
   */
  public formatNumber(num: number, language?: SupportedLanguage): string {
    const locale = language || this.currentLanguage;
    const localeMap: Record<SupportedLanguage, string> = {
      'en': 'en-US',
      'es': 'es-ES',
      'fr': 'fr-FR',
      'de': 'de-DE',
      'pt': 'pt-BR',
      'zh': 'zh-CN',
      'ja': 'ja-JP',
      'ar': 'ar-SA',
      'hi': 'hi-IN'
    };

    return num.toLocaleString(localeMap[locale]);
  }

  /**
   * Get localized template names
   */
  public getLocalizedTemplateName(template: 'SOAP' | 'SBAR' | 'PIE' | 'DAR', language?: SupportedLanguage): string {
    const locale = language || this.currentLanguage;
    
    const translations: Record<string, Record<SupportedLanguage, string>> = {
      'SOAP': {
        'en': 'SOAP (Subjective, Objective, Assessment, Plan)',
        'es': 'SOAP (Subjetivo, Objetivo, Evaluación, Plan)',
        'fr': 'SOAP (Subjectif, Objectif, Évaluation, Plan)',
        'de': 'SOAP (Subjektiv, Objektiv, Beurteilung, Plan)',
        'pt': 'SOAP (Subjetivo, Objetivo, Avaliação, Plano)',
        'zh': 'SOAP（主观、客观、评估、计划）',
        'ja': 'SOAP（主観的、客観的、評価、計画）',
        'ar': 'SOAP (ذاتي، موضوعي، تقييم، خطة)',
        'hi': 'SOAP (व्यक्तिपरक, वस्तुनिष्ठ, मूल्यांकन, योजना)'
      },
      'SBAR': {
        'en': 'SBAR (Situation, Background, Assessment, Recommendation)',
        'es': 'SBAR (Situación, Antecedentes, Evaluación, Recomendación)',
        'fr': 'SBAR (Situation, Contexte, Évaluation, Recommandation)',
        'de': 'SBAR (Situation, Hintergrund, Beurteilung, Empfehlung)',
        'pt': 'SBAR (Situação, Antecedentes, Avaliação, Recomendação)',
        'zh': 'SBAR（情况、背景、评估、建议）',
        'ja': 'SBAR（状況、背景、評価、推奨）',
        'ar': 'SBAR (الحالة، الخلفية، التقييم، التوصية)',
        'hi': 'SBAR (स्थिति, पृष्ठभूमि, मूल्यांकन, सिफारिश)'
      }
    };

    return translations[template]?.[locale] || template;
  }

  /**
   * Get UI translations
   */
  public translate(key: string, language?: SupportedLanguage): string {
    const locale = language || this.currentLanguage;
    
    // Sample UI translations
    const translations: Record<string, Record<SupportedLanguage, string>> = {
      'new_note': {
        'en': 'New Note',
        'es': 'Nueva Nota',
        'fr': 'Nouvelle Note',
        'de': 'Neue Notiz',
        'pt': 'Nova Nota',
        'zh': '新笔记',
        'ja': '新しいメモ',
        'ar': 'ملاحظة جديدة',
        'hi': 'नया नोट'
      },
      'start_recording': {
        'en': 'Start Recording',
        'es': 'Iniciar Grabación',
        'fr': 'Démarrer l\'Enregistrement',
        'de': 'Aufnahme Starten',
        'pt': 'Iniciar Gravação',
        'zh': '开始录音',
        'ja': '録音開始',
        'ar': 'بدء التسجيل',
        'hi': 'रिकॉर्डिंग शुरू करें'
      },
      'save': {
        'en': 'Save',
        'es': 'Guardar',
        'fr': 'Enregistrer',
        'de': 'Speichern',
        'pt': 'Salvar',
        'zh': '保存',
        'ja': '保存',
        'ar': 'حفظ',
        'hi': 'सहेजें'
      },
      'export': {
        'en': 'Export',
        'es': 'Exportar',
        'fr': 'Exporter',
        'de': 'Exportieren',
        'pt': 'Exportar',
        'zh': '导出',
        'ja': 'エクスポート',
        'ar': 'تصدير',
        'hi': 'निर्यात'
      }
    };

    return translations[key]?.[locale] || key;
  }

  /**
   * Get regional formatting preferences
   */
  public getRegionalPreferences(language: SupportedLanguage): {
    dateFormat: string;
    timeFormat: string;
    temperatureUnit: 'celsius' | 'fahrenheit';
    measurementSystem: 'metric' | 'imperial';
  } {
    const preferences = {
      'en': {
        dateFormat: 'MM/DD/YYYY',
        timeFormat: '12h',
        temperatureUnit: 'fahrenheit' as const,
        measurementSystem: 'imperial' as const
      },
      'es': {
        dateFormat: 'DD/MM/YYYY',
        timeFormat: '24h',
        temperatureUnit: 'celsius' as const,
        measurementSystem: 'metric' as const
      },
      'fr': {
        dateFormat: 'DD/MM/YYYY',
        timeFormat: '24h',
        temperatureUnit: 'celsius' as const,
        measurementSystem: 'metric' as const
      },
      'de': {
        dateFormat: 'DD.MM.YYYY',
        timeFormat: '24h',
        temperatureUnit: 'celsius' as const,
        measurementSystem: 'metric' as const
      },
      'pt': {
        dateFormat: 'DD/MM/YYYY',
        timeFormat: '24h',
        temperatureUnit: 'celsius' as const,
        measurementSystem: 'metric' as const
      },
      'zh': {
        dateFormat: 'YYYY/MM/DD',
        timeFormat: '24h',
        temperatureUnit: 'celsius' as const,
        measurementSystem: 'metric' as const
      },
      'ja': {
        dateFormat: 'YYYY/MM/DD',
        timeFormat: '24h',
        temperatureUnit: 'celsius' as const,
        measurementSystem: 'metric' as const
      },
      'ar': {
        dateFormat: 'DD/MM/YYYY',
        timeFormat: '12h',
        temperatureUnit: 'celsius' as const,
        measurementSystem: 'metric' as const
      },
      'hi': {
        dateFormat: 'DD/MM/YYYY',
        timeFormat: '12h',
        temperatureUnit: 'celsius' as const,
        measurementSystem: 'metric' as const
      }
    };

    return preferences[language];
  }
}

// Export singleton
export const internationalSupportService = new InternationalSupportService();
