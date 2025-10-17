/**
 * Clinical Decision Support Service
 * AI-powered alerts for missing documentation and safety checks
 */

export type AlertSeverity = 'info' | 'warning' | 'critical';
export type AlertCategory = 
  | 'missing_documentation'
  | 'medication_safety'
  | 'vital_signs'
  | 'incomplete_assessment'
  | 'contraindication'
  | 'billing_requirement';

export interface ClinicalAlert {
  id: string;
  category: AlertCategory;
  severity: AlertSeverity;
  title: string;
  message: string;
  recommendation: string;
  relatedFields?: string[];
  triggered: Date;
  acknowledged: boolean;
  acknowledgedBy?: string;
  acknowledgedAt?: Date;
}

export interface DocumentationCheck {
  field: string;
  required: boolean;
  present: boolean;
  severity: AlertSeverity;
  message: string;
}

export interface MedicationCheck {
  medication: string;
  alerts: Array<{
    type: 'allergy' | 'interaction' | 'contraindication' | 'dosage';
    severity: AlertSeverity;
    message: string;
  }>;
}

export interface VitalSignsCheck {
  parameter: string;
  value?: number;
  normal: { min: number; max: number };
  status: 'normal' | 'warning' | 'critical';
  message?: string;
}

class ClinicalDecisionSupportService {
  private alerts: Map<string, ClinicalAlert> = new Map();
  private enabled: boolean = true;

  // Required documentation by template
  private requiredFields: Record<string, string[]> = {
    SOAP: ['subjective', 'objective', 'assessment', 'plan'],
    SBAR: ['situation', 'background', 'assessment', 'recommendation'],
    PIE: ['problem', 'intervention', 'evaluation'],
    DAR: ['data', 'action', 'response']
  };

  // Vital signs normal ranges
  private vitalRanges = {
    heartRate: { min: 60, max: 100, critical: { min: 40, max: 140 } },
    bloodPressureSystolic: { min: 90, max: 140, critical: { min: 70, max: 180 } },
    bloodPressureDiastolic: { min: 60, max: 90, critical: { min: 40, max: 110 } },
    respiratoryRate: { min: 12, max: 20, critical: { min: 8, max: 30 } },
    temperature: { min: 97.0, max: 99.5, critical: { min: 95.0, max: 103.0 } },
    oxygenSaturation: { min: 95, max: 100, critical: { min: 88, max: 100 } }
  };

  constructor() {
    this.loadSettings();
  }

  /**
   * Analyze note for missing documentation
   */
  public checkDocumentation(template: string, content: Record<string, string>): DocumentationCheck[] {
    const required = this.requiredFields[template] || [];
    const checks: DocumentationCheck[] = [];

    required.forEach(field => {
      const fieldContent = content[field.toLowerCase()];
      const isPresent = fieldContent && fieldContent.trim().length > 10;

      checks.push({
        field,
        required: true,
        present: isPresent,
        severity: 'warning',
        message: isPresent 
          ? `${field} section completed`
          : `Missing required ${field} section`
      });
    });

    // Check for minimum content length
    Object.entries(content).forEach(([key, value]) => {
      if (value && value.length < 20) {
        checks.push({
          field: key,
          required: false,
          present: true,
          severity: 'info',
          message: `${key} section may need more detail`
        });
      }
    });

    return checks;
  }

  /**
   * Extract and check vital signs
   */
  public checkVitalSigns(text: string): VitalSignsCheck[] {
    const checks: VitalSignsCheck[] = [];

    // Extract heart rate
    const hrMatch = text.match(/(?:HR|heart rate)[:\s]*(\d+)/i);
    if (hrMatch) {
      const hr = parseInt(hrMatch[1]);
      checks.push(this.evaluateVitalSign('Heart Rate', hr, this.vitalRanges.heartRate));
    }

    // Extract blood pressure
    const bpMatch = text.match(/(?:BP|blood pressure)[:\s]*(\d+)[\s/]*(\d+)/i);
    if (bpMatch) {
      const systolic = parseInt(bpMatch[1]);
      const diastolic = parseInt(bpMatch[2]);
      checks.push(this.evaluateVitalSign('BP Systolic', systolic, this.vitalRanges.bloodPressureSystolic));
      checks.push(this.evaluateVitalSign('BP Diastolic', diastolic, this.vitalRanges.bloodPressureDiastolic));
    }

    // Extract respiratory rate
    const rrMatch = text.match(/(?:RR|respiratory rate)[:\s]*(\d+)/i);
    if (rrMatch) {
      const rr = parseInt(rrMatch[1]);
      checks.push(this.evaluateVitalSign('Respiratory Rate', rr, this.vitalRanges.respiratoryRate));
    }

    // Extract temperature
    const tempMatch = text.match(/(?:temp|temperature)[:\s]*(\d+\.?\d*)/i);
    if (tempMatch) {
      const temp = parseFloat(tempMatch[1]);
      checks.push(this.evaluateVitalSign('Temperature', temp, this.vitalRanges.temperature));
    }

    // Extract O2 saturation
    const o2Match = text.match(/(?:O2 sat|oxygen saturation)[:\s]*(\d+)/i);
    if (o2Match) {
      const o2 = parseInt(o2Match[1]);
      checks.push(this.evaluateVitalSign('O2 Saturation', o2, this.vitalRanges.oxygenSaturation));
    }

    return checks;
  }

  /**
   * Evaluate single vital sign
   */
  private evaluateVitalSign(
    parameter: string,
    value: number,
    ranges: { min: number; max: number; critical: { min: number; max: number } }
  ): VitalSignsCheck {
    let status: VitalSignsCheck['status'] = 'normal';
    let message: string | undefined;

    if (value < ranges.critical.min || value > ranges.critical.max) {
      status = 'critical';
      message = `${parameter} ${value} is critically ${value < ranges.critical.min ? 'low' : 'high'}`;
    } else if (value < ranges.min || value > ranges.max) {
      status = 'warning';
      message = `${parameter} ${value} is outside normal range`;
    }

    return {
      parameter,
      value,
      normal: ranges,
      status,
      message
    };
  }

  /**
   * Check for medication safety issues
   */
  public checkMedications(text: string, patientAllergies?: string[]): MedicationCheck[] {
    const checks: MedicationCheck[] = [];
    const commonMeds = this.extractMedications(text);

    commonMeds.forEach(med => {
      const alerts: MedicationCheck['alerts'] = [];

      // Check allergies
      if (patientAllergies) {
        patientAllergies.forEach(allergy => {
          if (med.toLowerCase().includes(allergy.toLowerCase()) || 
              allergy.toLowerCase().includes(med.toLowerCase())) {
            alerts.push({
              type: 'allergy',
              severity: 'critical',
              message: `Patient has documented allergy to ${allergy}`
            });
          }
        });
      }

      // Check for common contraindications
      const contraindications = this.checkContraindications(med, text);
      alerts.push(...contraindications);

      if (alerts.length > 0) {
        checks.push({ medication: med, alerts });
      }
    });

    return checks;
  }

  /**
   * Extract medications from text
   */
  private extractMedications(text: string): string[] {
    const commonMeds = [
      'aspirin', 'ibuprofen', 'acetaminophen', 'morphine', 'insulin',
      'warfarin', 'heparin', 'metformin', 'lisinopril', 'amoxicillin',
      'penicillin', 'cephalexin', 'levothyroxine', 'atorvastatin'
    ];

    return commonMeds.filter(med => 
      new RegExp(`\\b${med}\\b`, 'i').test(text)
    );
  }

  /**
   * Check medication contraindications
   */
  private checkContraindications(medication: string, text: string): MedicationCheck['alerts'] {
    const alerts: MedicationCheck['alerts'] = [];

    // Aspirin contraindications
    if (medication.toLowerCase().includes('aspirin')) {
      if (text.toLowerCase().includes('bleeding') || 
          text.toLowerCase().includes('ulcer')) {
        alerts.push({
          type: 'contraindication',
          severity: 'warning',
          message: 'Aspirin may be contraindicated with active bleeding/ulcer'
        });
      }
    }

    // Warfarin interactions
    if (medication.toLowerCase().includes('warfarin')) {
      if (text.toLowerCase().includes('nsaid') || 
          text.toLowerCase().includes('aspirin')) {
        alerts.push({
          type: 'interaction',
          severity: 'warning',
          message: 'Warfarin has interaction with NSAIDs/Aspirin - increased bleeding risk'
        });
      }
    }

    return alerts;
  }

  /**
   * Generate comprehensive alerts from note analysis
   */
  public async analyzeNote(
    template: string,
    content: Record<string, string>,
    patientData?: {
      allergies?: string[];
      conditions?: string[];
    }
  ): Promise<ClinicalAlert[]> {
    const alerts: ClinicalAlert[] = [];
    const fullText = Object.values(content).join(' ');

    // Check documentation completeness
    const docChecks = this.checkDocumentation(template, content);
    docChecks.filter(check => !check.present && check.required).forEach(check => {
      alerts.push(this.createAlert({
        category: 'missing_documentation',
        severity: check.severity,
        title: 'Missing Required Field',
        message: check.message,
        recommendation: `Please complete the ${check.field} section`,
        relatedFields: [check.field]
      }));
    });

    // Check vital signs
    const vitalChecks = this.checkVitalSigns(fullText);
    vitalChecks.filter(check => check.status !== 'normal').forEach(check => {
      alerts.push(this.createAlert({
        category: 'vital_signs',
        severity: check.status === 'critical' ? 'critical' : 'warning',
        title: 'Abnormal Vital Sign',
        message: check.message || '',
        recommendation: check.status === 'critical' 
          ? 'Immediate intervention may be required'
          : 'Monitor closely and reassess',
        relatedFields: ['objective']
      }));
    });

    // Check medications
    if (patientData?.allergies) {
      const medChecks = this.checkMedications(fullText, patientData.allergies);
      medChecks.forEach(medCheck => {
        medCheck.alerts.forEach(alert => {
          alerts.push(this.createAlert({
            category: 'medication_safety',
            severity: alert.severity,
            title: `Medication Alert: ${medCheck.medication}`,
            message: alert.message,
            recommendation: 'Review medication order and patient allergies',
            relatedFields: ['plan']
          }));
        });
      });
    }

    // Check for billing requirements
    if (content.assessment && !content.plan) {
      alerts.push(this.createAlert({
        category: 'billing_requirement',
        severity: 'info',
        title: 'Billing Requirement',
        message: 'Plan section recommended for billing compliance',
        recommendation: 'Document plan of care for proper reimbursement'
      }));
    }

    return alerts;
  }

  /**
   * Create alert object
   */
  private createAlert(data: Omit<ClinicalAlert, 'id' | 'triggered' | 'acknowledged'>): ClinicalAlert {
    const alert: ClinicalAlert = {
      ...data,
      id: `alert-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      triggered: new Date(),
      acknowledged: false
    };

    this.alerts.set(alert.id, alert);
    return alert;
  }

  /**
   * Acknowledge alert
   */
  public acknowledgeAlert(alertId: string, userId: string): boolean {
    const alert = this.alerts.get(alertId);
    if (alert && !alert.acknowledged) {
      alert.acknowledged = true;
      alert.acknowledgedBy = userId;
      alert.acknowledgedAt = new Date();
      return true;
    }
    return false;
  }

  /**
   * Get active alerts
   */
  public getActiveAlerts(): ClinicalAlert[] {
    return Array.from(this.alerts.values())
      .filter(alert => !alert.acknowledged)
      .sort((a, b) => {
        // Sort by severity
        const severityOrder = { critical: 0, warning: 1, info: 2 };
        return severityOrder[a.severity] - severityOrder[b.severity];
      });
  }

  /**
   * Get alert statistics
   */
  public getAlertStats(): {
    total: number;
    critical: number;
    warning: number;
    info: number;
    acknowledged: number;
    byCategory: Record<AlertCategory, number>;
  } {
    const allAlerts = Array.from(this.alerts.values());
    
    const byCategory = {} as Record<AlertCategory, number>;
    allAlerts.forEach(alert => {
      byCategory[alert.category] = (byCategory[alert.category] || 0) + 1;
    });

    return {
      total: allAlerts.length,
      critical: allAlerts.filter(a => a.severity === 'critical').length,
      warning: allAlerts.filter(a => a.severity === 'warning').length,
      info: allAlerts.filter(a => a.severity === 'info').length,
      acknowledged: allAlerts.filter(a => a.acknowledged).length,
      byCategory
    };
  }

  /**
   * Enable/disable CDS
   */
  public setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }

  /**
   * Check if CDS is enabled
   */
  public isEnabled(): boolean {
    return this.enabled;
  }

  /**
   * Load settings
   */
  private loadSettings(): void {
    try {
      const stored = localStorage.getItem('nursescribe_cds_enabled');
      if (stored !== null) {
        this.enabled = JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Failed to load CDS settings:', error);
    }
  }

  /**
   * Save settings
   */
  public saveSettings(): void {
    try {
      localStorage.setItem('nursescribe_cds_enabled', JSON.stringify(this.enabled));
    } catch (error) {
      console.warn('Failed to save CDS settings:', error);
    }
  }
}

// Export singleton
export const clinicalDecisionSupport = new ClinicalDecisionSupportService();
