/**
 * Intelligent Note Detection Service
 * Automatically detects note type, structures content, and pre-fills fields
 * Enhanced with Epic EMR template support
 */

import { 
  ShiftPhase, 
  UnitType, 
  EpicTemplateType 
} from './epicTemplates';
import {
  detectShiftPhase,
  detectUnitType,
  detectMedicationRoute,
  detectAssessmentSystem,
  extractIntakeOutput,
  extractMedicationInfo,
  extractWoundInfo,
  EPIC_PATTERNS
} from './epicKnowledgeBase';

export interface DetectedNoteType {
  template: 'SOAP' | 'SBAR' | 'PIE' | 'DAR' | EpicTemplateType;
  confidence: number;
  reasoning: string;
  indicators: string[];
  epicContext?: {
    shiftPhase?: ShiftPhase;
    unitType?: UnitType;
    category?: string;
  };
}

export interface ExtractedFields {
  vitalSigns: {
    bloodPressure?: string;
    heartRate?: string;
    respiratoryRate?: string;
    temperature?: string;
    oxygenSaturation?: string;
    painLevel?: string;
    weight?: string;
    map?: string;
    cvp?: string;
  };
  medications: Array<{
    name: string;
    dose: string;
    route: string;
    time: string;
    site?: string;
  }>;
  interventions: string[];
  symptoms: string[];
  assessmentFindings: string[];
  patientStatements: string[];
  timeStamps: string[];
  allergies: string[];
  intakeOutput?: {
    intake: { [key: string]: number };
    output: { [key: string]: number };
    balance: number;
  };
  woundInfo?: {
    location?: string;
    stage?: string;
    size?: string;
    drainage?: string;
  };
  assessmentSystems?: string[];
  safetyChecks?: string[];
}

export interface StructuredNote {
  detectedType: DetectedNoteType;
  extractedFields: ExtractedFields;
  suggestedSections: {
    [key: string]: string;
  };
  readyForReview: boolean;
}

class IntelligentNoteDetectionService {
  /**
   * Automatically detect the most appropriate note type from input
   * Enhanced with Epic template detection
   */
  public detectNoteType(input: string): DetectedNoteType {
    const lowerInput = input.toLowerCase();
    
    // First check for Epic-specific templates
    const epicDetection = this.detectEpicTemplate(input);
    if (epicDetection.confidence > 0.7) {
      return epicDetection;
    }
    
    // Fall back to traditional template detection
    const scores = {
      SOAP: 0,
      SBAR: 0,
      PIE: 0,
      DAR: 0
    };
    const indicators: { [key: string]: string[] } = {
      SOAP: [],
      SBAR: [],
      PIE: [],
      DAR: []
    };

    // SOAP indicators - routine assessment and documentation
    const soapKeywords = [
      'patient reports', 'patient states', 'complains of', 'denies',
      'vital signs', 'physical exam', 'assessment shows', 'appears',
      'diagnosis', 'impression', 'assessment', 'likely',
      'plan', 'continue', 'monitor', 'follow up', 'prescribe'
    ];
    soapKeywords.forEach(keyword => {
      if (lowerInput.includes(keyword)) {
        scores.SOAP += 1;
        indicators.SOAP.push(keyword);
      }
    });

    // SBAR indicators - handoff, communication, urgent situations
    const sbarKeywords = [
      'handoff', 'transfer', 'report', 'situation', 'background',
      'recommendation', 'notify', 'call', 'urgent', 'immediate',
      'history of', 'past medical', 'current status', 'concern',
      'suggest', 'recommend', 'request', 'need'
    ];
    sbarKeywords.forEach(keyword => {
      if (lowerInput.includes(keyword)) {
        scores.SBAR += 1;
        indicators.SBAR.push(keyword);
      }
    });

    // PIE indicators - problem-focused, intervention-based
    const pieKeywords = [
      'problem', 'issue', 'concern', 'difficulty',
      'intervention', 'administered', 'performed', 'provided',
      'evaluation', 'response', 'outcome', 'effective',
      'resolved', 'improved', 'worsened', 'stable'
    ];
    pieKeywords.forEach(keyword => {
      if (lowerInput.includes(keyword)) {
        scores.PIE += 1;
        indicators.PIE.push(keyword);
      }
    });

    // DAR indicators - focus on data, actions, responses
    const darKeywords = [
      'data', 'observed', 'noted', 'findings',
      'action taken', 'administered', 'implemented', 'initiated',
      'patient response', 'tolerated', 'reacted', 'responded',
      'no adverse', 'effective', 'ineffective'
    ];
    darKeywords.forEach(keyword => {
      if (lowerInput.includes(keyword)) {
        scores.DAR += 1;
        indicators.DAR.push(keyword);
      }
    });

    // Context-based detection
    // SBAR: Handoff language
    if (lowerInput.match(/transferring|handing off|shift change|report to/)) {
      scores.SBAR += 3;
      indicators.SBAR.push('handoff context');
    }

    // SOAP: Assessment language
    if (lowerInput.match(/subjective|objective|assessment|plan/i)) {
      scores.SOAP += 3;
      indicators.SOAP.push('SOAP structure mentioned');
    }

    // PIE: Problem-solving language
    if (lowerInput.match(/problem.*intervention|issue.*action/)) {
      scores.PIE += 2;
      indicators.PIE.push('problem-intervention pattern');
    }

    // DAR: Data-action-response pattern
    if (lowerInput.match(/observed.*administered.*responded/)) {
      scores.DAR += 2;
      indicators.DAR.push('data-action-response pattern');
    }

    // Find highest score
    const maxScore = Math.max(...Object.values(scores));
    const detectedTemplate = (Object.keys(scores) as Array<keyof typeof scores>).find(
      key => scores[key] === maxScore
    ) || 'SOAP';

    // Calculate confidence
    const totalScore = Object.values(scores).reduce((a, b) => a + b, 0);
    const confidence = totalScore > 0 ? maxScore / totalScore : 0.5;

    // Generate reasoning
    let reasoning = `Detected ${detectedTemplate} format based on `;
    if (indicators[detectedTemplate].length > 0) {
      reasoning += `keywords: ${indicators[detectedTemplate].slice(0, 3).join(', ')}`;
    } else {
      reasoning += 'general content analysis';
    }

    return {
      template: detectedTemplate as 'SOAP' | 'SBAR' | 'PIE' | 'DAR',
      confidence,
      reasoning,
      indicators: indicators[detectedTemplate]
    };
  }

  /**
   * Detect Epic-specific template types
   */
  private detectEpicTemplate(input: string): DetectedNoteType {
    const lowerInput = input.toLowerCase();
    let maxScore = 0;
    let detectedTemplate: EpicTemplateType | null = null;
    const indicators: string[] = [];
    
    // Detect ICU - check first as it has very specific keywords
    const icuKeywords = ['hemodynamic', 'cvp', 'map', 'ventilator', 'peep', 'fio2', 'rass', 'cam-icu', 'titration', 'a-line', 'central line'];
    const icuScore = icuKeywords.filter(k => lowerInput.includes(k)).length;
    if (icuScore >= 3) {
      maxScore = icuScore + 5; // Boost ICU score
      detectedTemplate = 'icu';
      indicators.push('ICU-specific keywords (hemodynamics, ventilator, sedation)');
    }
    
    // Detect NICU - very specific keywords
    const nicuKeywords = ['isolette', 'thermoregulation', 'nicu', 'premature', 'developmental care', 'parental bonding'];
    const nicuScore = nicuKeywords.filter(k => lowerInput.includes(k)).length;
    if (nicuScore >= 2 && nicuScore > maxScore) {
      maxScore = nicuScore + 5;
      detectedTemplate = 'nicu';
      indicators.push('NICU-specific keywords');
    }
    
    // Detect Mother-Baby - very specific keywords
    const motherBabyKeywords = ['fundal', 'lochia', 'perineum', 'breastfeeding', 'latch', 'postpartum', 'newborn', 'cord care', 'circumcision'];
    const motherBabyScore = motherBabyKeywords.filter(k => lowerInput.includes(k)).length;
    if (motherBabyScore >= 2 && motherBabyScore > maxScore) {
      maxScore = motherBabyScore + 5;
      detectedTemplate = 'mother-baby';
      indicators.push('Mother-Baby specific keywords');
    }
    
    // Detect wound care
    const woundKeywords = ['wound', 'pressure injury', 'ulcer', 'dressing change', 'wound care', 'stage ii', 'stage iii', 'stage iv', 'granulation', 'slough', 'eschar'];
    const woundScore = woundKeywords.filter(k => lowerInput.includes(k)).length;
    if (woundScore >= 2 && woundScore > maxScore) {
      maxScore = woundScore + 4;
      detectedTemplate = 'wound-care';
      indicators.push('wound care keywords');
    }
    
    // Detect safety checklist
    const safetyKeywords = ['fall risk', 'restraints', 'isolation', 'code status', 'patient identification', 'allergies'];
    const safetyScore = safetyKeywords.filter(k => lowerInput.includes(k)).length;
    if (safetyScore >= 3 && safetyScore > maxScore) {
      maxScore = safetyScore + 4;
      detectedTemplate = 'safety-checklist';
      indicators.push('safety keywords');
    }
    
    // Detect I&O - must have both intake AND output or explicit I&O mention
    const hasIntake = lowerInput.includes('intake') || lowerInput.includes('oral') || lowerInput.includes('iv fluid');
    const hasOutput = lowerInput.includes('output') || lowerInput.includes('urine');
    const hasBalance = lowerInput.includes('balance') || lowerInput.includes('fluid balance');
    const hasIOExplicit = lowerInput.includes('i&o') || lowerInput.includes('i/o') || lowerInput.match(/intake\s+and\s+output/);
    
    if (hasIOExplicit || ((hasIntake && hasOutput) || hasBalance)) {
      const ioScore = (hasIntake ? 2 : 0) + (hasOutput ? 2 : 0) + (hasBalance ? 3 : 0) + (hasIOExplicit ? 4 : 0);
      if (ioScore >= 4 && ioScore > maxScore) {
        maxScore = ioScore + 3;
        detectedTemplate = 'io';
        indicators.push('intake/output keywords');
      }
    }
    
    // Detect MAR - medication-focused with multiple medications
    const marKeywords = ['medication administration', 'mar', 'administered', 'gave', 'dose', 'route', 'tolerated'];
    const marScore = marKeywords.filter(k => lowerInput.includes(k)).length;
    const hasMedRoute = lowerInput.match(/\b(po|iv|im|sq|sl|pr)\b/gi);
    const medCount = hasMedRoute ? hasMedRoute.length : 0;
    
    // Strong MAR detection if multiple medications with routes
    if (marScore >= 2 && medCount >= 2) {
      maxScore = marScore + medCount + 5;
      detectedTemplate = 'mar';
      indicators.push('medication administration keywords with multiple medications');
    } else if (marScore >= 3 && medCount >= 1 && marScore > maxScore) {
      maxScore = marScore + 3;
      detectedTemplate = 'mar';
      indicators.push('medication administration keywords');
    }
    
    // Detect Med-Surg
    const medSurgKeywords = ['patient education', 'discharge', 'mobility', 'ambulated', 'walker', 'discharge planning'];
    const medSurgScore = medSurgKeywords.filter(k => lowerInput.includes(k)).length;
    if (medSurgScore >= 2 && medSurgScore > maxScore) {
      maxScore = medSurgScore + 3;
      detectedTemplate = 'med-surg';
      indicators.push('Med-Surg keywords (education, discharge, mobility)');
    }
    
    // Detect shift assessment - check for shift phase AND system assessment
    const shiftPhase = detectShiftPhase(input);
    const hasSystemAssessment = ['neuro', 'cardiac', 'respiratory', 'gi', 'gu', 'skin', 'musculoskeletal'].filter(
      sys => lowerInput.includes(sys)
    ).length >= 3;
    
    if (shiftPhase && hasSystemAssessment) {
      maxScore = 10; // High priority for shift assessment
      detectedTemplate = 'shift-assessment';
      indicators.push(`shift phase: ${shiftPhase}`, 'system-by-system assessment');
    }
    
    // Calculate confidence based on score
    const confidence = maxScore > 0 ? Math.min(maxScore / 10, 1) : 0;
    
    return {
      template: detectedTemplate || 'SOAP',
      confidence,
      reasoning: detectedTemplate 
        ? `Detected Epic ${detectedTemplate} template based on ${indicators.join(', ')}`
        : 'No Epic template detected',
      indicators,
      epicContext: {
        shiftPhase: shiftPhase || undefined,
        unitType: detectUnitType(input) || undefined,
        category: detectedTemplate || undefined
      }
    };
  }

  /**
   * Extract and pre-fill fields from input
   * Enhanced with Epic-specific field extraction
   */
  public extractFields(input: string): ExtractedFields {
    const fields: ExtractedFields = {
      vitalSigns: {},
      medications: [],
      interventions: [],
      symptoms: [],
      assessmentFindings: [],
      patientStatements: [],
      timeStamps: [],
      allergies: []
    };

    // Extract vital signs
    const bpMatch = input.match(/(?:blood pressure|bp|b\.?p\.?)[:\s]*(\d{2,3}\/\d{2,3})/i);
    if (bpMatch) fields.vitalSigns.bloodPressure = bpMatch[1];

    const hrMatch = input.match(/(?:heart rate|hr|pulse)[:\s]*(\d{2,3})/i);
    if (hrMatch) fields.vitalSigns.heartRate = hrMatch[1];

    const rrMatch = input.match(/(?:respiratory rate|rr|resp)[:\s]*(\d{1,2})/i);
    if (rrMatch) fields.vitalSigns.respiratoryRate = rrMatch[1];

    const tempMatch = input.match(/(?:temperature|temp|t)[:\s]*(\d{2,3}\.?\d*)\s*(?:°?[fc]|degrees?)?/i);
    if (tempMatch) fields.vitalSigns.temperature = tempMatch[1];

    const o2Match = input.match(/(?:oxygen saturation|o2 sat|spo2|o2)[:\s]*(\d{2,3})%?/i);
    if (o2Match) fields.vitalSigns.oxygenSaturation = o2Match[1];

    const painMatch = input.match(/(?:pain level|pain scale|pain)[:\s]*(\d{1,2})(?:\/10)?/i);
    if (painMatch) fields.vitalSigns.painLevel = painMatch[1];

    const weightMatch = input.match(/(?:weight|wt)[:\s]*(\d+\.?\d*)\s*(?:kg|lbs?)/i);
    if (weightMatch) fields.vitalSigns.weight = weightMatch[1];

    const mapMatch = input.match(/(?:map|mean arterial pressure)[:\s]*(\d{2,3})/i);
    if (mapMatch) fields.vitalSigns.map = mapMatch[1];

    const cvpMatch = input.match(/(?:cvp|central venous pressure)[:\s]*(\d{1,2})/i);
    if (cvpMatch) fields.vitalSigns.cvp = cvpMatch[1];

    // Extract medications using Epic knowledge base
    const epicMeds = extractMedicationInfo(input);
    fields.medications = epicMeds;
    
    // Fallback to simple extraction if Epic extraction didn't find anything
    if (fields.medications.length === 0) {
      const medPatterns = [
        /(?:administered|gave|given|received)\s+([a-z]+(?:cillin|mycin|pril|olol|statin|zole|pine|pam|done|caine))/gi,
        /(?:medication|med|drug)[:\s]*([^.,]+)/gi
      ];
      const simpleMeds: string[] = [];
      medPatterns.forEach(pattern => {
        const matches = input.matchAll(pattern);
        for (const match of matches) {
          if (match[1] && !simpleMeds.includes(match[1].trim())) {
            simpleMeds.push(match[1].trim());
          }
        }
      });
      // Convert to Epic format
      fields.medications = simpleMeds.map(med => ({
        name: med,
        dose: '',
        route: '',
        time: new Date().toLocaleTimeString()
      }));
    }

    // Extract interventions
    const interventionKeywords = [
      'administered', 'provided', 'performed', 'initiated', 'implemented',
      'applied', 'inserted', 'removed', 'changed', 'monitored',
      'assessed', 'educated', 'assisted', 'positioned', 'turned'
    ];
    interventionKeywords.forEach(keyword => {
      const regex = new RegExp(`(${keyword}[^.]*[.])`, 'gi');
      const matches = input.matchAll(regex);
      for (const match of matches) {
        if (match[1] && !fields.interventions.includes(match[1].trim())) {
          fields.interventions.push(match[1].trim());
        }
      }
    });

    // Extract symptoms
    const symptomKeywords = [
      'pain', 'nausea', 'vomiting', 'diarrhea', 'constipation',
      'fever', 'chills', 'cough', 'shortness of breath', 'dyspnea',
      'dizziness', 'headache', 'fatigue', 'weakness', 'confusion',
      'chest pain', 'abdominal pain', 'back pain', 'swelling', 'rash'
    ];
    symptomKeywords.forEach(symptom => {
      if (input.toLowerCase().includes(symptom)) {
        fields.symptoms.push(symptom);
      }
    });

    // Extract patient statements
    const quoteMatches = input.matchAll(/"([^"]+)"/g);
    for (const match of quoteMatches) {
      fields.patientStatements.push(match[1]);
    }

    // Extract assessment findings
    const assessmentKeywords = [
      'alert', 'oriented', 'responsive', 'stable', 'unstable',
      'distress', 'comfortable', 'anxious', 'calm', 'cooperative',
      'skin warm', 'skin cool', 'skin dry', 'skin moist',
      'lungs clear', 'breath sounds', 'heart sounds', 'bowel sounds'
    ];
    assessmentKeywords.forEach(finding => {
      if (input.toLowerCase().includes(finding)) {
        fields.assessmentFindings.push(finding);
      }
    });

    // Extract timestamps
    const timeMatches = input.matchAll(/(\d{1,2}:\d{2}\s*(?:am|pm)?|\d{4}\s*hours?)/gi);
    for (const match of timeMatches) {
      fields.timeStamps.push(match[1]);
    }

    // Extract allergies
    const allergyMatch = input.match(/(?:allergies?|allergic to)[:\s]*([^.,]+)/i);
    if (allergyMatch) {
      fields.allergies = allergyMatch[1].split(/,|and/).map(a => a.trim());
    }

    // Extract Epic-specific fields
    fields.intakeOutput = extractIntakeOutput(input);
    fields.woundInfo = extractWoundInfo(input) || undefined;
    fields.assessmentSystems = detectAssessmentSystem(input);
    
    // Extract safety checks
    const safetyKeywords = ['fall risk', 'restraints', 'isolation', 'patient identification', 'code status'];
    fields.safetyChecks = safetyKeywords.filter(keyword => 
      input.toLowerCase().includes(keyword)
    );

    return fields;
  }

  /**
   * Structure the input into a formatted note ready for review
   */
  public async structureNote(input: string): Promise<StructuredNote> {
    // Detect note type
    const detectedType = this.detectNoteType(input);
    
    // Extract fields
    const extractedFields = this.extractFields(input);
    
    // Generate suggested sections based on detected type
    const suggestedSections = this.generateSections(
      input,
      detectedType.template,
      extractedFields
    );
    
    // Determine if ready for review
    const readyForReview = this.assessReadiness(suggestedSections, extractedFields);
    
    return {
      detectedType,
      extractedFields,
      suggestedSections,
      readyForReview
    };
  }

  /**
   * Generate structured sections based on template and extracted data
   */
  private generateSections(
    input: string,
    template: 'SOAP' | 'SBAR' | 'PIE' | 'DAR' | EpicTemplateType,
    fields: ExtractedFields
  ): { [key: string]: string } {
    const sections: { [key: string]: string } = {};

    // Handle traditional templates
    switch (template) {
      case 'SOAP':
        sections.Subjective = this.buildSubjective(input, fields);
        sections.Objective = this.buildObjective(fields);
        sections.Assessment = this.buildAssessment(input, fields);
        sections.Plan = this.buildPlan(input, fields);
        break;

      case 'SBAR':
        sections.Situation = this.buildSituation(input, fields);
        sections.Background = this.buildBackground(input, fields);
        sections.Assessment = this.buildSBARAssessment(input, fields);
        sections.Recommendation = this.buildRecommendation(input, fields);
        break;

      case 'PIE':
        sections.Problem = this.buildProblem(input, fields);
        sections.Intervention = this.buildIntervention(fields);
        sections.Evaluation = this.buildEvaluation(input, fields);
        break;

      case 'DAR':
        sections.Data = this.buildData(fields);
        sections.Action = this.buildAction(fields);
        sections.Response = this.buildResponse(input, fields);
        break;

      // Handle Epic templates
      case 'shift-assessment':
        sections['Patient Assessment'] = this.buildEpicPatientAssessment(fields);
        sections['Vital Signs'] = this.buildObjective(fields);
        sections['Medications'] = this.buildEpicMedications(fields);
        sections['Intake & Output'] = this.buildEpicIO(fields);
        sections['Safety'] = this.buildEpicSafety(fields);
        sections['Narrative'] = this.buildEpicNarrative(input, fields);
        break;

      case 'mar':
        sections['Medication Information'] = this.buildEpicMedications(fields);
        sections['Administration Details'] = this.buildEpicMARDetails(fields);
        sections['Response'] = this.buildResponse(input, fields);
        break;

      case 'io':
        sections['Intake'] = this.buildEpicIntake(fields);
        sections['Output'] = this.buildEpicOutput(fields);
        sections['Balance'] = this.buildEpicBalance(fields);
        break;

      case 'wound-care':
        sections['Wound Assessment'] = this.buildEpicWoundAssessment(fields);
        sections['Interventions'] = this.buildIntervention(fields);
        sections['Response'] = this.buildResponse(input, fields);
        break;

      case 'safety-checklist':
        sections['Safety Assessment'] = this.buildEpicSafety(fields);
        sections['Risk Factors'] = this.buildEpicRiskFactors(fields);
        sections['Interventions'] = this.buildIntervention(fields);
        break;

      case 'med-surg':
      case 'icu':
      case 'nicu':
      case 'mother-baby':
        sections['Unit Assessment'] = this.buildEpicUnitAssessment(input, fields, template);
        sections['Interventions'] = this.buildIntervention(fields);
        sections['Patient Response'] = this.buildResponse(input, fields);
        break;
    }

    return sections;
  }

  // Epic-specific section builders
  private buildEpicPatientAssessment(fields: ExtractedFields): string {
    let content = 'System-by-System Assessment:\n\n';
    
    if (fields.assessmentSystems && fields.assessmentSystems.length > 0) {
      fields.assessmentSystems.forEach(system => {
        content += `${system.charAt(0).toUpperCase() + system.slice(1)}: `;
        const findings = fields.assessmentFindings.filter(f => 
          f.toLowerCase().includes(system.toLowerCase())
        );
        content += findings.length > 0 ? findings.join(', ') : 'WNL';
        content += '\n';
      });
    } else {
      content += 'Neuro: Alert and oriented\n';
      content += 'Cardiac: Regular rate and rhythm\n';
      content += 'Respiratory: Lungs clear bilaterally\n';
      content += 'GI: Abdomen soft, non-tender\n';
      content += 'GU: Voiding without difficulty\n';
      content += 'Skin: Warm, dry, intact\n';
      content += 'Musculoskeletal: Moves all extremities\n';
    }
    
    return content;
  }

  private buildEpicMedications(fields: ExtractedFields): string {
    if (fields.medications.length === 0) {
      return 'No medications administered this shift.';
    }
    
    let content = 'Medications Administered:\n\n';
    fields.medications.forEach(med => {
      content += `- ${med.name}`;
      if (med.dose) content += ` ${med.dose}`;
      if (med.route) content += ` ${med.route}`;
      if (med.time) content += ` at ${med.time}`;
      content += '\n';
    });
    
    return content;
  }

  private buildEpicMARDetails(fields: ExtractedFields): string {
    let content = 'Administration Details:\n\n';
    
    fields.medications.forEach(med => {
      content += `${med.name}:\n`;
      content += `- Time: ${med.time}\n`;
      content += `- Route: ${med.route || 'Not specified'}\n`;
      if (med.site) content += `- Site: ${med.site}\n`;
      content += `- Patient tolerated well\n\n`;
    });
    
    return content || 'No medications administered.';
  }

  private buildEpicIO(fields: ExtractedFields): string {
    if (!fields.intakeOutput) {
      return 'I&O: Monitoring continued';
    }
    
    const io = fields.intakeOutput;
    let content = 'Intake & Output:\n\n';
    content += `Total Intake: ${io.intake.total || 0} mL\n`;
    content += `Total Output: ${io.output.total || 0} mL\n`;
    content += `Balance: ${io.balance >= 0 ? '+' : ''}${io.balance} mL\n`;
    
    return content;
  }

  private buildEpicIntake(fields: ExtractedFields): string {
    if (!fields.intakeOutput) {
      return 'Intake: Monitoring continued';
    }
    
    const intake = fields.intakeOutput.intake;
    let content = 'Intake:\n';
    Object.entries(intake).forEach(([type, amount]) => {
      if (type !== 'total' && amount > 0) {
        content += `- ${type.charAt(0).toUpperCase() + type.slice(1)}: ${amount} mL\n`;
      }
    });
    content += `\nTotal: ${intake.total || 0} mL`;
    
    return content;
  }

  private buildEpicOutput(fields: ExtractedFields): string {
    if (!fields.intakeOutput) {
      return 'Output: Monitoring continued';
    }
    
    const output = fields.intakeOutput.output;
    let content = 'Output:\n';
    Object.entries(output).forEach(([type, amount]) => {
      if (type !== 'total' && amount > 0) {
        content += `- ${type.charAt(0).toUpperCase() + type.slice(1)}: ${amount} mL\n`;
      }
    });
    content += `\nTotal: ${output.total || 0} mL`;
    
    return content;
  }

  private buildEpicBalance(fields: ExtractedFields): string {
    if (!fields.intakeOutput) {
      return 'Balance: Calculating...';
    }
    
    const balance = fields.intakeOutput.balance;
    return `Fluid Balance: ${balance >= 0 ? '+' : ''}${balance} mL\n\nPatient fluid status monitored throughout shift.`;
  }

  private buildEpicWoundAssessment(fields: ExtractedFields): string {
    if (!fields.woundInfo) {
      return 'Wound assessment: No wounds noted';
    }
    
    const wound = fields.woundInfo;
    let content = 'Wound Assessment:\n\n';
    if (wound.location) content += `Location: ${wound.location}\n`;
    if (wound.stage) content += `Stage: ${wound.stage}\n`;
    if (wound.size) content += `Size: ${wound.size}\n`;
    if (wound.drainage) content += `Drainage: ${wound.drainage}\n`;
    
    return content;
  }

  private buildEpicSafety(fields: ExtractedFields): string {
    let content = 'Safety Checks:\n\n';
    
    if (fields.safetyChecks && fields.safetyChecks.length > 0) {
      fields.safetyChecks.forEach(check => {
        content += `- ${check}: Assessed and addressed\n`;
      });
    } else {
      content += '- Fall risk: Assessed\n';
      content += '- Patient identification: Verified\n';
      content += '- Call light: Within reach\n';
    }
    
    return content;
  }

  private buildEpicRiskFactors(fields: ExtractedFields): string {
    let content = 'Risk Factors:\n\n';
    
    if (fields.safetyChecks && fields.safetyChecks.length > 0) {
      content += fields.safetyChecks.map(check => `- ${check}`).join('\n');
    } else {
      content += 'No significant risk factors identified at this time.';
    }
    
    return content;
  }

  private buildEpicNarrative(input: string, fields: ExtractedFields): string {
    let content = 'Shift Narrative:\n\n';
    content += input.substring(0, 200);
    if (input.length > 200) content += '...';
    
    return content;
  }

  private buildEpicUnitAssessment(input: string, fields: ExtractedFields, unitType: string): string {
    let content = `${unitType.toUpperCase()} Unit Assessment:\n\n`;
    
    // Add vital signs
    if (Object.keys(fields.vitalSigns).length > 0) {
      content += 'Vital Signs:\n';
      Object.entries(fields.vitalSigns).forEach(([key, value]) => {
        if (value) {
          content += `- ${key}: ${value}\n`;
        }
      });
      content += '\n';
    }
    
    // Add assessment findings
    if (fields.assessmentFindings.length > 0) {
      content += 'Assessment Findings:\n';
      fields.assessmentFindings.forEach(finding => {
        content += `- ${finding}\n`;
      });
    }
    
    return content;
  }

  // Section builders for SOAP
  private buildSubjective(input: string, fields: ExtractedFields): string {
    let content = '';
    
    if (fields.patientStatements.length > 0) {
      content += `Patient states: "${fields.patientStatements[0]}"\n\n`;
    }
    
    if (fields.symptoms.length > 0) {
      content += `Chief complaint: ${fields.symptoms.join(', ')}\n`;
    }
    
    if (fields.vitalSigns.painLevel) {
      content += `Pain level: ${fields.vitalSigns.painLevel}/10\n`;
    }
    
    return content || 'Patient reports: [Information from transcription]';
  }

  private buildObjective(fields: ExtractedFields): string {
    let content = 'Vital Signs:\n';
    
    if (fields.vitalSigns.bloodPressure) content += `- BP: ${fields.vitalSigns.bloodPressure} mmHg\n`;
    if (fields.vitalSigns.heartRate) content += `- HR: ${fields.vitalSigns.heartRate} bpm\n`;
    if (fields.vitalSigns.respiratoryRate) content += `- RR: ${fields.vitalSigns.respiratoryRate} breaths/min\n`;
    if (fields.vitalSigns.temperature) content += `- Temp: ${fields.vitalSigns.temperature}°F\n`;
    if (fields.vitalSigns.oxygenSaturation) content += `- O2 Sat: ${fields.vitalSigns.oxygenSaturation}%\n`;
    
    if (fields.assessmentFindings.length > 0) {
      content += `\nPhysical Assessment:\n`;
      fields.assessmentFindings.forEach(finding => {
        content += `- ${finding}\n`;
      });
    }
    
    return content;
  }

  private buildAssessment(input: string, fields: ExtractedFields): string {
    let content = '';
    
    if (fields.symptoms.length > 0) {
      content += `Patient presents with ${fields.symptoms.join(', ')}. `;
    }
    
    if (fields.vitalSigns.bloodPressure || fields.vitalSigns.heartRate) {
      content += 'Vital signs ';
      const vitalsStable = this.assessVitalsStability(fields.vitalSigns);
      content += vitalsStable ? 'stable. ' : 'require monitoring. ';
    }
    
    return content || 'Clinical assessment based on findings.';
  }

  private buildPlan(input: string, fields: ExtractedFields): string {
    let content = '';
    
    if (fields.medications.length > 0) {
      content += `Continue medications: ${fields.medications.join(', ')}\n`;
    }
    
    if (fields.interventions.length > 0) {
      content += `Ongoing interventions: ${fields.interventions.slice(0, 2).join(', ')}\n`;
    }
    
    content += 'Monitor patient status and reassess as needed.\n';
    content += 'Patient education provided regarding care plan.';
    
    return content;
  }

  // Section builders for SBAR
  private buildSituation(input: string, fields: ExtractedFields): string {
    let content = '';
    
    if (fields.symptoms.length > 0) {
      content += `Patient experiencing ${fields.symptoms[0]}. `;
    }
    
    if (fields.vitalSigns.painLevel) {
      content += `Pain level ${fields.vitalSigns.painLevel}/10. `;
    }
    
    return content || 'Current patient situation requires attention.';
  }

  private buildBackground(input: string, fields: ExtractedFields): string {
    let content = 'Patient history: ';
    
    if (fields.allergies.length > 0) {
      content += `Allergies: ${fields.allergies.join(', ')}. `;
    }
    
    if (fields.medications.length > 0) {
      content += `Current medications: ${fields.medications.join(', ')}. `;
    }
    
    return content;
  }

  private buildSBARAssessment(input: string, fields: ExtractedFields): string {
    return this.buildAssessment(input, fields);
  }

  private buildRecommendation(input: string, fields: ExtractedFields): string {
    let content = 'Recommend: ';
    
    if (fields.symptoms.includes('pain')) {
      content += 'Continue pain management protocol. ';
    }
    
    content += 'Monitor vital signs and patient status. ';
    content += 'Notify provider of any changes.';
    
    return content;
  }

  // Section builders for PIE
  private buildProblem(input: string, fields: ExtractedFields): string {
    if (fields.symptoms.length > 0) {
      return `Primary problem: ${fields.symptoms[0]}`;
    }
    return 'Patient problem identified from assessment.';
  }

  private buildIntervention(fields: ExtractedFields): string {
    if (fields.interventions.length > 0) {
      return fields.interventions.join('\n');
    }
    return 'Nursing interventions implemented per care plan.';
  }

  private buildEvaluation(input: string, fields: ExtractedFields): string {
    return 'Patient response to interventions monitored. Ongoing evaluation of effectiveness.';
  }

  // Section builders for DAR
  private buildData(fields: ExtractedFields): string {
    return this.buildObjective(fields);
  }

  private buildAction(fields: ExtractedFields): string {
    return this.buildIntervention(fields);
  }

  private buildResponse(input: string, fields: ExtractedFields): string {
    return 'Patient tolerated interventions well. No adverse reactions noted.';
  }

  // Helper methods
  private assessVitalsStability(vitals: ExtractedFields['vitalSigns']): boolean {
    // Simple stability check
    if (vitals.bloodPressure) {
      const [systolic] = vitals.bloodPressure.split('/').map(Number);
      if (systolic < 90 || systolic > 180) return false;
    }
    
    if (vitals.heartRate) {
      const hr = Number(vitals.heartRate);
      if (hr < 60 || hr > 100) return false;
    }
    
    return true;
  }

  private assessReadiness(sections: { [key: string]: string }, fields: ExtractedFields): boolean {
    // Check if we have enough data
    const hasVitals = Object.keys(fields.vitalSigns).length > 0;
    const hasSymptoms = fields.symptoms.length > 0;
    const hasSections = Object.keys(sections).length >= 3;
    
    return hasVitals && hasSymptoms && hasSections;
  }
}

// Export singleton instance
export const intelligentNoteDetectionService = new IntelligentNoteDetectionService();

export default intelligentNoteDetectionService;
