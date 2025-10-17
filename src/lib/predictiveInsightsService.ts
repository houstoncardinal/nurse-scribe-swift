/**
 * Predictive Insights Service
 * AI-powered early warning system that flags potential complications
 */

export interface PredictiveInsight {
  id: string;
  timestamp: Date;
  type: 'early_warning' | 'deterioration_risk' | 'complication_risk' | 'readmission_risk';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  indicators: string[];
  recommendations: string[];
  confidence: number;
  patientId?: string;
  acknowledged: boolean;
  actionTaken?: string;
}

export interface PatientRiskScore {
  patientId: string;
  overallRisk: number;
  deteriorationRisk: number;
  sepsisRisk: number;
  fallRisk: number;
  readmissionRisk: number;
  calculatedAt: Date;
}

export interface TrendAnalysis {
  metric: string;
  trend: 'improving' | 'stable' | 'declining' | 'critical';
  values: Array<{ timestamp: Date; value: number }>;
  prediction: number;
  confidence: number;
}

class PredictiveInsightsService {
  private insights: Map<string, PredictiveInsight> = new Map();
  private riskScores: Map<string, PatientRiskScore> = new Map();

  /**
   * Analyze note for early warning signs
   */
  public analyzeNote(noteText: string, patientId?: string): PredictiveInsight[] {
    const insights: PredictiveInsight[] = [];
    const lowerText = noteText.toLowerCase();

    // Sepsis warning signs
    if (this.detectSepsisRisk(lowerText)) {
      insights.push(this.createInsight({
        type: 'early_warning',
        severity: 'critical',
        title: 'Potential Sepsis Warning',
        description: 'Patient showing signs consistent with early sepsis',
        indicators: this.extractSepsisIndicators(lowerText),
        recommendations: [
          'Obtain blood cultures before antibiotics',
          'Monitor vital signs every hour',
          'Initiate IV fluid resuscitation if hypotensive',
          'Consider broad-spectrum antibiotics',
          'Notify physician immediately'
        ],
        confidence: 0.85,
        patientId
      }));
    }

    // Respiratory deterioration
    if (this.detectRespiratoryDeterioration(lowerText)) {
      insights.push(this.createInsight({
        type: 'deterioration_risk',
        severity: 'high',
        title: 'Respiratory Deterioration Risk',
        description: 'Signs of worsening respiratory status detected',
        indicators: this.extractRespiratoryIndicators(lowerText),
        recommendations: [
          'Increase oxygen monitoring frequency',
          'Consider arterial blood gas',
          'Assess for need of respiratory therapy',
          'Monitor for signs of respiratory failure',
          'Prepare for possible ICU transfer'
        ],
        confidence: 0.78,
        patientId
      }));
    }

    // Cardiac complications
    if (this.detectCardiacComplications(lowerText)) {
      insights.push(this.createInsight({
        type: 'complication_risk',
        severity: 'high',
        title: 'Cardiac Complication Risk',
        description: 'Patient showing signs of potential cardiac issues',
        indicators: this.extractCardiacIndicators(lowerText),
        recommendations: [
          'Obtain 12-lead ECG',
          'Monitor cardiac enzymes',
          'Continuous cardiac monitoring',
          'Assess for chest pain characteristics',
          'Prepare for possible cardiology consult'
        ],
        confidence: 0.81,
        patientId
      }));
    }

    // Fall risk
    if (this.detectFallRisk(lowerText)) {
      insights.push(this.createInsight({
        type: 'complication_risk',
        severity: 'medium',
        title: 'Increased Fall Risk',
        description: 'Multiple fall risk factors identified',
        indicators: this.extractFallRiskIndicators(lowerText),
        recommendations: [
          'Implement fall precautions immediately',
          'Place bed in low position',
          'Ensure call light within reach',
          'Assist with all transfers',
          'Consider bed alarm if appropriate'
        ],
        confidence: 0.72,
        patientId
      }));
    }

    // Delirium risk
    if (this.detectDeliriumRisk(lowerText)) {
      insights.push(this.createInsight({
        type: 'complication_risk',
        severity: 'medium',
        title: 'Delirium Risk Detected',
        description: 'Patient showing signs of confusion or altered mental status',
        indicators: this.extractDeliriumIndicators(lowerText),
        recommendations: [
          'Perform delirium assessment (CAM)',
          'Review medication list for contributing factors',
          'Ensure adequate pain control',
          'Promote sleep-wake cycle',
          'Reorient patient frequently'
        ],
        confidence: 0.75,
        patientId
      }));
    }

    // Readmission risk
    if (this.detectReadmissionRisk(lowerText)) {
      insights.push(this.createInsight({
        type: 'readmission_risk',
        severity: 'medium',
        title: 'High Readmission Risk',
        description: 'Patient has multiple risk factors for readmission',
        indicators: this.extractReadmissionIndicators(lowerText),
        recommendations: [
          'Ensure comprehensive discharge planning',
          'Schedule follow-up within 7 days',
          'Provide written discharge instructions',
          'Assess medication adherence barriers',
          'Consider home health referral'
        ],
        confidence: 0.70,
        patientId
      }));
    }

    // Store insights
    insights.forEach(insight => {
      this.insights.set(insight.id, insight);
    });

    return insights;
  }

  /**
   * Calculate patient risk scores
   */
  public calculateRiskScores(patientId: string, vitalSigns: any, labValues: any): PatientRiskScore {
    const scores = {
      deteriorationRisk: this.calculateDeteriorationRisk(vitalSigns, labValues),
      sepsisRisk: this.calculateSepsisRisk(vitalSigns, labValues),
      fallRisk: this.calculateFallRisk(vitalSigns),
      readmissionRisk: this.calculateReadmissionRisk(labValues)
    };

    const overallRisk = (scores.deteriorationRisk + scores.sepsisRisk + scores.fallRisk + scores.readmissionRisk) / 4;

    const riskScore: PatientRiskScore = {
      patientId,
      overallRisk: Math.round(overallRisk),
      deteriorationRisk: Math.round(scores.deteriorationRisk),
      sepsisRisk: Math.round(scores.sepsisRisk),
      fallRisk: Math.round(scores.fallRisk),
      readmissionRisk: Math.round(scores.readmissionRisk),
      calculatedAt: new Date()
    };

    this.riskScores.set(patientId, riskScore);
    return riskScore;
  }

  /**
   * Analyze vital sign trends
   */
  public analyzeTrend(metric: string, values: Array<{ timestamp: Date; value: number }>): TrendAnalysis {
    if (values.length < 3) {
      return {
        metric,
        trend: 'stable',
        values,
        prediction: values[values.length - 1]?.value || 0,
        confidence: 0.5
      };
    }

    // Calculate trend
    const recentValues = values.slice(-5).map(v => v.value);
    const average = recentValues.reduce((a, b) => a + b, 0) / recentValues.length;
    const latest = recentValues[recentValues.length - 1];
    
    let trend: TrendAnalysis['trend'] = 'stable';
    let prediction = latest;

    // Simple linear regression for prediction
    const xMean = recentValues.length / 2;
    const yMean = average;
    
    let numerator = 0;
    let denominator = 0;
    
    recentValues.forEach((y, x) => {
      numerator += (x - xMean) * (y - yMean);
      denominator += Math.pow(x - xMean, 2);
    });
    
    const slope = denominator !== 0 ? numerator / denominator : 0;
    prediction = latest + slope;

    // Determine trend based on metric
    if (metric === 'blood_pressure' || metric === 'oxygen_saturation') {
      if (slope < -5) trend = 'declining';
      else if (slope < -10) trend = 'critical';
      else if (slope > 5) trend = 'improving';
    } else if (metric === 'heart_rate' || metric === 'temperature') {
      if (Math.abs(slope) > 5) trend = 'declining';
      else if (Math.abs(slope) > 10) trend = 'critical';
    }

    return {
      metric,
      trend,
      values,
      prediction: Math.round(prediction * 10) / 10,
      confidence: Math.min(0.9, 0.5 + (recentValues.length * 0.1))
    };
  }

  /**
   * Get all insights
   */
  public getAllInsights(): PredictiveInsight[] {
    return Array.from(this.insights.values()).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  /**
   * Get insights by patient
   */
  public getInsightsByPatient(patientId: string): PredictiveInsight[] {
    return this.getAllInsights().filter(i => i.patientId === patientId);
  }

  /**
   * Get critical insights
   */
  public getCriticalInsights(): PredictiveInsight[] {
    return this.getAllInsights().filter(i => i.severity === 'critical' && !i.acknowledged);
  }

  /**
   * Acknowledge insight
   */
  public acknowledgeInsight(insightId: string, actionTaken?: string): boolean {
    const insight = this.insights.get(insightId);
    if (!insight) return false;

    insight.acknowledged = true;
    if (actionTaken) {
      insight.actionTaken = actionTaken;
    }
    
    return true;
  }

  /**
   * Get risk score for patient
   */
  public getRiskScore(patientId: string): PatientRiskScore | null {
    return this.riskScores.get(patientId) || null;
  }

  // Private helper methods

  private createInsight(data: Omit<PredictiveInsight, 'id' | 'timestamp' | 'acknowledged'>): PredictiveInsight {
    return {
      ...data,
      id: `insight-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      acknowledged: false
    };
  }

  private detectSepsisRisk(text: string): boolean {
    const sepsisKeywords = ['fever', 'tachycardia', 'hypotension', 'altered mental', 'confusion', 'infection'];
    const matches = sepsisKeywords.filter(keyword => text.includes(keyword));
    return matches.length >= 2;
  }

  private extractSepsisIndicators(text: string): string[] {
    const indicators = [];
    if (text.includes('fever') || text.includes('temperature')) indicators.push('Elevated temperature');
    if (text.includes('tachycardia') || text.includes('heart rate')) indicators.push('Tachycardia');
    if (text.includes('hypotension') || text.includes('low blood pressure')) indicators.push('Hypotension');
    if (text.includes('confusion') || text.includes('altered')) indicators.push('Altered mental status');
    if (text.includes('infection') || text.includes('redness')) indicators.push('Signs of infection');
    return indicators;
  }

  private detectRespiratoryDeterioration(text: string): boolean {
    const respiratoryKeywords = ['dyspnea', 'shortness of breath', 'difficulty breathing', 'low oxygen', 'desaturation'];
    return respiratoryKeywords.some(keyword => text.includes(keyword));
  }

  private extractRespiratoryIndicators(text: string): string[] {
    const indicators = [];
    if (text.includes('dyspnea') || text.includes('shortness')) indicators.push('Dyspnea present');
    if (text.includes('oxygen') || text.includes('sat')) indicators.push('Oxygen saturation concerns');
    if (text.includes('accessory muscles')) indicators.push('Use of accessory muscles');
    if (text.includes('tachypnea')) indicators.push('Increased respiratory rate');
    return indicators;
  }

  private detectCardiacComplications(text: string): boolean {
    const cardiacKeywords = ['chest pain', 'palpitations', 'arrhythmia', 'irregular heart', 'cardiac'];
    return cardiacKeywords.some(keyword => text.includes(keyword));
  }

  private extractCardiacIndicators(text: string): string[] {
    const indicators = [];
    if (text.includes('chest pain')) indicators.push('Chest pain reported');
    if (text.includes('palpitations')) indicators.push('Palpitations');
    if (text.includes('arrhythmia') || text.includes('irregular')) indicators.push('Irregular heart rhythm');
    if (text.includes('diaphoresis')) indicators.push('Diaphoresis');
    return indicators;
  }

  private detectFallRisk(text: string): boolean {
    const fallKeywords = ['dizzy', 'unsteady', 'weak', 'fall', 'orthostatic'];
    const matches = fallKeywords.filter(keyword => text.includes(keyword));
    return matches.length >= 2;
  }

  private extractFallRiskIndicators(text: string): string[] {
    const indicators = [];
    if (text.includes('dizzy') || text.includes('dizziness')) indicators.push('Dizziness');
    if (text.includes('unsteady') || text.includes('gait')) indicators.push('Unsteady gait');
    if (text.includes('weak') || text.includes('weakness')) indicators.push('Weakness');
    if (text.includes('orthostatic')) indicators.push('Orthostatic hypotension');
    return indicators;
  }

  private detectDeliriumRisk(text: string): boolean {
    const deliriumKeywords = ['confused', 'disoriented', 'agitated', 'altered mental', 'inattention'];
    return deliriumKeywords.some(keyword => text.includes(keyword));
  }

  private extractDeliriumIndicators(text: string): string[] {
    const indicators = [];
    if (text.includes('confused') || text.includes('confusion')) indicators.push('Confusion');
    if (text.includes('disoriented')) indicators.push('Disorientation');
    if (text.includes('agitated')) indicators.push('Agitation');
    if (text.includes('inattention')) indicators.push('Inattention');
    return indicators;
  }

  private detectReadmissionRisk(text: string): boolean {
    const readmissionKeywords = ['non-compliant', 'multiple comorbidities', 'poor support', 'no follow-up'];
    return readmissionKeywords.some(keyword => text.includes(keyword));
  }

  private extractReadmissionIndicators(text: string): string[] {
    const indicators = [];
    if (text.includes('non-compliant') || text.includes('adherence')) indicators.push('Medication non-compliance');
    if (text.includes('multiple') || text.includes('comorbid')) indicators.push('Multiple comorbidities');
    if (text.includes('support') || text.includes('alone')) indicators.push('Limited support system');
    if (text.includes('follow-up')) indicators.push('No scheduled follow-up');
    return indicators;
  }

  private calculateDeteriorationRisk(vitalSigns: any, labValues: any): number {
    let score = 0;
    
    // Vital signs scoring
    if (vitalSigns.systolic > 180 || vitalSigns.systolic < 90) score += 25;
    if (vitalSigns.heartRate > 120 || vitalSigns.heartRate < 50) score += 25;
    if (vitalSigns.oxygenSat < 90) score += 30;
    if (vitalSigns.temp > 101.5 || vitalSigns.temp < 95) score += 20;
    
    return Math.min(100, score);
  }

  private calculateSepsisRisk(vitalSigns: any, labValues: any): number {
    let score = 0;
    
    // qSOFA criteria
    if (vitalSigns.systolic <= 100) score += 30;
    if (vitalSigns.respiratoryRate >= 22) score += 30;
    if (vitalSigns.gcs < 15) score += 40;
    
    return Math.min(100, score);
  }

  private calculateFallRisk(vitalSigns: any): number {
    let score = 0;
    
    // Morse Fall Scale simplified
    if (vitalSigns.systolic < 100) score += 20;
    if (vitalSigns.age > 65) score += 25;
    
    return Math.min(100, score);
  }

  private calculateReadmissionRisk(labValues: any): number {
    let score = 0;
    
    // Basic risk factors
    if (labValues.sodium < 135 || labValues.sodium > 145) score += 20;
    if (labValues.hemoglobin < 10) score += 20;
    
    return Math.min(100, score);
  }
}

// Export singleton
export const predictiveInsightsService = new PredictiveInsightsService();
