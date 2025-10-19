/**
 * Epic Compliance Checker
 * Validates Epic EMR documentation for completeness and compliance
 */

import { 
  EpicTemplateType, 
  ShiftPhase, 
  UnitType,
  ShiftAssessmentTemplate,
  MARTemplate,
  IOTemplate,
  WoundCareTemplate,
  SafetyChecklistTemplate
} from './epicTemplates';
import {
  getRequiredFieldsForShiftPhase,
  getRequiredFieldsForUnit,
  EPIC_TERMINOLOGY
} from './epicKnowledgeBase';

export interface ComplianceResult {
  isCompliant: boolean;
  score: number;
  missingFields: string[];
  warnings: string[];
  recommendations: string[];
  criticalIssues: string[];
}

export interface FieldValidation {
  field: string;
  isValid: boolean;
  message?: string;
  severity: 'error' | 'warning' | 'info';
}

class EpicComplianceChecker {
  /**
   * Check overall Epic compliance for any note
   */
  public checkCompliance(
    note: any,
    template: EpicTemplateType,
    context?: {
      shiftPhase?: ShiftPhase;
      unitType?: UnitType;
    }
  ): ComplianceResult {
    const missingFields: string[] = [];
    const warnings: string[] = [];
    const recommendations: string[] = [];
    const criticalIssues: string[] = [];

    // Get required fields based on template
    const requiredFields = this.getRequiredFields(template, context);

    // Check for missing required fields
    requiredFields.forEach(field => {
      if (!this.hasField(note, field)) {
        missingFields.push(field);
      }
    });

    // Template-specific validation
    switch (template) {
      case 'shift-assessment':
        this.validateShiftAssessment(note, warnings, recommendations, criticalIssues, context);
        break;
      case 'mar':
        this.validateMAR(note, warnings, recommendations, criticalIssues);
        break;
      case 'io':
        this.validateIO(note, warnings, recommendations, criticalIssues);
        break;
      case 'wound-care':
        this.validateWoundCare(note, warnings, recommendations, criticalIssues);
        break;
      case 'safety-checklist':
        this.validateSafetyChecklist(note, warnings, recommendations, criticalIssues);
        break;
      case 'med-surg':
      case 'icu':
      case 'nicu':
      case 'mother-baby':
        this.validateUnitSpecific(note, template, warnings, recommendations, criticalIssues);
        break;
    }

    // Calculate compliance score
    const score = this.calculateComplianceScore(
      requiredFields.length,
      missingFields.length,
      warnings.length,
      criticalIssues.length
    );

    const isCompliant = score >= 0.8 && criticalIssues.length === 0;

    return {
      isCompliant,
      score,
      missingFields,
      warnings,
      recommendations,
      criticalIssues
    };
  }

  /**
   * Validate field values
   */
  public validateField(field: string, value: any, template: EpicTemplateType): FieldValidation {
    // Vital signs validation
    if (field === 'bloodPressure') {
      return this.validateBloodPressure(value);
    }
    if (field === 'heartRate') {
      return this.validateHeartRate(value);
    }
    if (field === 'respiratoryRate') {
      return this.validateRespiratoryRate(value);
    }
    if (field === 'temperature') {
      return this.validateTemperature(value);
    }
    if (field === 'oxygenSaturation') {
      return this.validateOxygenSaturation(value);
    }
    if (field === 'painLevel') {
      return this.validatePainLevel(value);
    }

    // Medication validation
    if (field === 'medicationRoute') {
      return this.validateMedicationRoute(value);
    }

    // I&O validation
    if (field === 'intakeOutput') {
      return this.validateIntakeOutput(value);
    }

    // Default validation
    return {
      field,
      isValid: value !== null && value !== undefined && value !== '',
      message: value ? undefined : 'Field is required',
      severity: 'warning'
    };
  }

  /**
   * Get required fields for template
   */
  private getRequiredFields(
    template: EpicTemplateType,
    context?: { shiftPhase?: ShiftPhase; unitType?: UnitType }
  ): string[] {
    const baseFields: { [key in EpicTemplateType]: string[] } = {
      'shift-assessment': [
        'Patient Assessment',
        'Vital Signs',
        'Safety Checks'
      ],
      'mar': [
        'Medication Name',
        'Dose',
        'Route',
        'Time',
        'Patient Response'
      ],
      'io': [
        'Intake Total',
        'Output Total',
        'Balance'
      ],
      'wound-care': [
        'Location',
        'Stage',
        'Size',
        'Drainage',
        'Interventions'
      ],
      'safety-checklist': [
        'Fall Risk',
        'Patient Identification',
        'Code Status'
      ],
      'med-surg': [
        'Patient Education',
        'Discharge Readiness',
        'Pain Management'
      ],
      'icu': [
        'Hemodynamic Monitoring',
        'Ventilator Settings',
        'Device Checks'
      ],
      'nicu': [
        'Thermoregulation',
        'Feeding Tolerance',
        'Daily Weight'
      ],
      'mother-baby': [
        'Fundal Check',
        'Lochia',
        'Newborn Feeding'
      ]
    };

    let fields = baseFields[template] || [];

    // Add context-specific fields
    if (context?.shiftPhase) {
      fields = [...fields, ...getRequiredFieldsForShiftPhase(context.shiftPhase)];
    }

    if (context?.unitType) {
      fields = [...fields, ...getRequiredFieldsForUnit(context.unitType)];
    }

    return [...new Set(fields)]; // Remove duplicates
  }

  /**
   * Check if note has a field
   */
  private hasField(note: any, field: string): boolean {
    if (!note) return false;

    // Check in sections
    if (note.sections) {
      for (const section of Object.values(note.sections)) {
        if (typeof section === 'object' && section !== null) {
          const sectionObj = section as any;
          if (sectionObj.content && typeof sectionObj.content === 'string') {
            if (sectionObj.content.toLowerCase().includes(field.toLowerCase())) {
              return true;
            }
          }
        }
      }
    }

    // Check direct properties
    const fieldKey = field.replace(/\s+/g, '').toLowerCase();
    for (const key of Object.keys(note)) {
      if (key.toLowerCase().includes(fieldKey)) {
        return note[key] !== null && note[key] !== undefined && note[key] !== '';
      }
    }

    return false;
  }

  /**
   * Validate shift assessment
   */
  private validateShiftAssessment(
    note: any,
    warnings: string[],
    recommendations: string[],
    criticalIssues: string[],
    context?: { shiftPhase?: ShiftPhase; unitType?: UnitType }
  ): void {
    // Check vital signs completeness
    const vitalSigns = ['BP', 'HR', 'RR', 'Temp', 'SpO2', 'Pain'];
    const missingVitals = vitalSigns.filter(vs => !this.hasField(note, vs));
    
    if (missingVitals.length > 0) {
      warnings.push(`Missing vital signs: ${missingVitals.join(', ')}`);
    }

    // Check system-by-system assessment
    const systems = ['neuro', 'cardiac', 'respiratory', 'gi', 'gu', 'skin', 'musculoskeletal'];
    const missingSystems = systems.filter(sys => !this.hasField(note, sys));
    
    if (missingSystems.length > 2) {
      warnings.push(`Incomplete system assessment. Missing: ${missingSystems.join(', ')}`);
    }

    // Check safety documentation
    if (!this.hasField(note, 'fall risk')) {
      criticalIssues.push('Fall risk assessment is required');
    }

    if (!this.hasField(note, 'patient identification')) {
      criticalIssues.push('Patient identification verification is required');
    }

    // Shift-specific checks
    if (context?.shiftPhase === 'Start of Shift') {
      if (!this.hasField(note, 'review orders')) {
        recommendations.push('Document review of orders at start of shift');
      }
    }

    if (context?.shiftPhase === 'End of Shift') {
      if (!this.hasField(note, 'handoff')) {
        criticalIssues.push('End of shift handoff documentation is required');
      }
    }
  }

  /**
   * Validate MAR
   */
  private validateMAR(
    note: any,
    warnings: string[],
    recommendations: string[],
    criticalIssues: string[]
  ): void {
    // Check medication administration details
    if (!this.hasField(note, 'medication name')) {
      criticalIssues.push('Medication name is required');
    }

    if (!this.hasField(note, 'dose')) {
      criticalIssues.push('Medication dose is required');
    }

    if (!this.hasField(note, 'route')) {
      criticalIssues.push('Administration route is required');
    }

    if (!this.hasField(note, 'time')) {
      criticalIssues.push('Administration time is required');
    }

    // Check for assessment
    if (!this.hasField(note, 'pre-assessment') && !this.hasField(note, 'assessment')) {
      warnings.push('Pre-administration assessment should be documented');
    }

    if (!this.hasField(note, 'patient response')) {
      warnings.push('Patient response to medication should be documented');
    }

    // Check for adverse reactions
    if (!this.hasField(note, 'adverse') && !this.hasField(note, 'reaction')) {
      recommendations.push('Document absence of adverse reactions');
    }
  }

  /**
   * Validate I&O
   */
  private validateIO(
    note: any,
    warnings: string[],
    recommendations: string[],
    criticalIssues: string[]
  ): void {
    // Check intake documentation
    if (!this.hasField(note, 'intake') && !this.hasField(note, 'total intake')) {
      criticalIssues.push('Intake documentation is required');
    }

    // Check output documentation
    if (!this.hasField(note, 'output') && !this.hasField(note, 'total output')) {
      criticalIssues.push('Output documentation is required');
    }

    // Check balance calculation
    if (!this.hasField(note, 'balance')) {
      warnings.push('Fluid balance should be calculated and documented');
    }

    // Check for shift specification
    if (!this.hasField(note, 'shift') && !this.hasField(note, 'day') && !this.hasField(note, 'evening') && !this.hasField(note, 'night')) {
      warnings.push('Shift should be specified for I&O documentation');
    }
  }

  /**
   * Validate wound care
   */
  private validateWoundCare(
    note: any,
    warnings: string[],
    recommendations: string[],
    criticalIssues: string[]
  ): void {
    // Check wound location
    if (!this.hasField(note, 'location')) {
      criticalIssues.push('Wound location is required');
    }

    // Check wound stage
    if (!this.hasField(note, 'stage')) {
      criticalIssues.push('Wound stage is required');
    }

    // Check wound size
    if (!this.hasField(note, 'size') && !this.hasField(note, 'length') && !this.hasField(note, 'width')) {
      warnings.push('Wound measurements should be documented');
    }

    // Check drainage
    if (!this.hasField(note, 'drainage')) {
      warnings.push('Wound drainage should be assessed and documented');
    }

    // Check interventions
    if (!this.hasField(note, 'dressing') && !this.hasField(note, 'intervention')) {
      warnings.push('Wound care interventions should be documented');
    }

    // Check photo documentation
    if (!this.hasField(note, 'photo')) {
      recommendations.push('Consider photo documentation for wound tracking');
    }
  }

  /**
   * Validate safety checklist
   */
  private validateSafetyChecklist(
    note: any,
    warnings: string[],
    recommendations: string[],
    criticalIssues: string[]
  ): void {
    // Critical safety checks
    if (!this.hasField(note, 'fall risk')) {
      criticalIssues.push('Fall risk assessment is required');
    }

    if (!this.hasField(note, 'patient identification')) {
      criticalIssues.push('Patient identification verification is required');
    }

    if (!this.hasField(note, 'code status')) {
      criticalIssues.push('Code status must be documented');
    }

    // Additional safety checks
    if (!this.hasField(note, 'allergies') && !this.hasField(note, 'allergy')) {
      warnings.push('Allergy status should be verified and documented');
    }

    if (!this.hasField(note, 'restraints')) {
      recommendations.push('Document restraint status (in use or not in use)');
    }

    if (!this.hasField(note, 'isolation')) {
      recommendations.push('Document isolation precautions if applicable');
    }
  }

  /**
   * Validate unit-specific documentation
   */
  private validateUnitSpecific(
    note: any,
    unitType: EpicTemplateType,
    warnings: string[],
    recommendations: string[],
    criticalIssues: string[]
  ): void {
    switch (unitType) {
      case 'icu':
        if (!this.hasField(note, 'hemodynamic')) {
          warnings.push('Hemodynamic monitoring should be documented for ICU patients');
        }
        if (!this.hasField(note, 'ventilator') && !this.hasField(note, 'respiratory support')) {
          recommendations.push('Document respiratory support status');
        }
        break;

      case 'nicu':
        if (!this.hasField(note, 'weight')) {
          criticalIssues.push('Daily weight is required for NICU patients');
        }
        if (!this.hasField(note, 'feeding')) {
          criticalIssues.push('Feeding tolerance must be documented');
        }
        break;

      case 'mother-baby':
        if (!this.hasField(note, 'fundal')) {
          criticalIssues.push('Fundal check is required for postpartum patients');
        }
        if (!this.hasField(note, 'lochia')) {
          criticalIssues.push('Lochia assessment is required');
        }
        break;

      case 'med-surg':
        if (!this.hasField(note, 'education')) {
          warnings.push('Patient education should be documented');
        }
        if (!this.hasField(note, 'discharge')) {
          recommendations.push('Document discharge readiness assessment');
        }
        break;
    }
  }

  /**
   * Calculate compliance score
   */
  private calculateComplianceScore(
    totalRequired: number,
    missingCount: number,
    warningCount: number,
    criticalCount: number
  ): number {
    if (totalRequired === 0) return 1.0;

    // Start with base score
    let score = 1.0;

    // Deduct for missing fields
    score -= (missingCount / totalRequired) * 0.5;

    // Deduct for warnings
    score -= (warningCount * 0.05);

    // Deduct heavily for critical issues
    score -= (criticalCount * 0.2);

    return Math.max(0, Math.min(1, score));
  }

  // Field-specific validators
  private validateBloodPressure(value: string): FieldValidation {
    const match = value?.match(/^(\d{2,3})\/(\d{2,3})$/);
    if (!match) {
      return {
        field: 'bloodPressure',
        isValid: false,
        message: 'Blood pressure must be in format: systolic/diastolic (e.g., 120/80)',
        severity: 'error'
      };
    }

    const systolic = parseInt(match[1]);
    const diastolic = parseInt(match[2]);

    if (systolic < 70 || systolic > 200) {
      return {
        field: 'bloodPressure',
        isValid: false,
        message: 'Systolic BP out of expected range (70-200)',
        severity: 'warning'
      };
    }

    if (diastolic < 40 || diastolic > 130) {
      return {
        field: 'bloodPressure',
        isValid: false,
        message: 'Diastolic BP out of expected range (40-130)',
        severity: 'warning'
      };
    }

    return {
      field: 'bloodPressure',
      isValid: true,
      severity: 'info'
    };
  }

  private validateHeartRate(value: string): FieldValidation {
    const hr = parseInt(value);
    
    if (isNaN(hr) || hr < 30 || hr > 220) {
      return {
        field: 'heartRate',
        isValid: false,
        message: 'Heart rate out of expected range (30-220 bpm)',
        severity: 'warning'
      };
    }

    return {
      field: 'heartRate',
      isValid: true,
      severity: 'info'
    };
  }

  private validateRespiratoryRate(value: string): FieldValidation {
    const rr = parseInt(value);
    
    if (isNaN(rr) || rr < 8 || rr > 40) {
      return {
        field: 'respiratoryRate',
        isValid: false,
        message: 'Respiratory rate out of expected range (8-40 breaths/min)',
        severity: 'warning'
      };
    }

    return {
      field: 'respiratoryRate',
      isValid: true,
      severity: 'info'
    };
  }

  private validateTemperature(value: string): FieldValidation {
    const temp = parseFloat(value);
    
    if (isNaN(temp) || temp < 95 || temp > 106) {
      return {
        field: 'temperature',
        isValid: false,
        message: 'Temperature out of expected range (95-106°F)',
        severity: 'warning'
      };
    }

    return {
      field: 'temperature',
      isValid: true,
      severity: 'info'
    };
  }

  private validateOxygenSaturation(value: string): FieldValidation {
    const o2 = parseInt(value);
    
    if (isNaN(o2) || o2 < 70 || o2 > 100) {
      return {
        field: 'oxygenSaturation',
        isValid: false,
        message: 'Oxygen saturation out of expected range (70-100%)',
        severity: 'warning'
      };
    }

    return {
      field: 'oxygenSaturation',
      isValid: true,
      severity: 'info'
    };
  }

  private validatePainLevel(value: string): FieldValidation {
    const pain = parseInt(value);
    
    if (isNaN(pain) || pain < 0 || pain > 10) {
      return {
        field: 'painLevel',
        isValid: false,
        message: 'Pain level must be 0-10',
        severity: 'error'
      };
    }

    return {
      field: 'painLevel',
      isValid: true,
      severity: 'info'
    };
  }

  private validateMedicationRoute(value: string): FieldValidation {
    const validRoutes = ['PO', 'IV', 'IM', 'SQ', 'SL', 'PR', 'Topical', 'Inhaled'];
    
    if (!validRoutes.includes(value)) {
      return {
        field: 'medicationRoute',
        isValid: false,
        message: `Invalid route. Must be one of: ${validRoutes.join(', ')}`,
        severity: 'error'
      };
    }

    return {
      field: 'medicationRoute',
      isValid: true,
      severity: 'info'
    };
  }

  private validateIntakeOutput(value: any): FieldValidation {
    if (!value || typeof value !== 'object') {
      return {
        field: 'intakeOutput',
        isValid: false,
        message: 'I&O must include intake and output values',
        severity: 'error'
      };
    }

    if (!value.intake || !value.output) {
      return {
        field: 'intakeOutput',
        isValid: false,
        message: 'Both intake and output must be documented',
        severity: 'error'
      };
    }

    return {
      field: 'intakeOutput',
      isValid: true,
      severity: 'info'
    };
  }
}

// Export singleton instance
export const epicComplianceChecker = new EpicComplianceChecker();

export default epicComplianceChecker;
