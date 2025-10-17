/**
 * Bedside Assist Service
 * Real-time AI listening during rounds with smart suggestions
 */

import { advancedTranscriptionService } from './advancedTranscriptionService';
import { clinicalDecisionSupport } from './clinicalDecisionSupport';

export interface BedsideSession {
  id: string;
  startTime: Date;
  endTime?: Date;
  patientId?: string;
  notes: string[];
  suggestions: BedsideSuggestion[];
  alerts: BedsideAlert[];
  status: 'active' | 'paused' | 'completed';
}

export interface BedsideSuggestion {
  id: string;
  timestamp: Date;
  type: 'assessment' | 'intervention' | 'documentation' | 'safety';
  priority: 'low' | 'medium' | 'high';
  message: string;
  actionable: boolean;
  implemented: boolean;
}

export interface BedsideAlert {
  id: string;
  timestamp: Date;
  severity: 'info' | 'warning' | 'critical';
  category: 'vital_signs' | 'medication' | 'fall_risk' | 'infection_control' | 'documentation';
  message: string;
  acknowledged: boolean;
}

export interface RoundingChecklistItem {
  id: string;
  description: string;
  completed: boolean;
  timestamp?: Date;
}

class BedsideAssistService {
  private currentSession: BedsideSession | null = null;
  private sessions: Map<string, BedsideSession> = new Map();
  private isListening: boolean = false;

  // Rounding checklist templates
  private roundingChecklists = {
    general: [
      'Patient identification verified',
      'Vital signs assessed',
      'Pain level assessed (0-10 scale)',
      'IV sites checked for infiltration',
      'Fall risk assessment',
      'Skin integrity checked',
      'Patient comfort addressed',
      'Call light within reach',
      'Patient education provided'
    ],
    icu: [
      'Patient identification verified',
      'Ventilator settings checked',
      'Sedation level assessed',
      'All lines and tubes secured',
      'Pressure ulcer prevention measures',
      'DVT prophylaxis administered',
      'Hand hygiene performed',
      'Family communication completed'
    ],
    postop: [
      'Patient identification verified',
      'Surgical site assessed',
      'Pain management evaluated',
      'Nausea/vomiting status',
      'Intake and output monitored',
      'Ambulation encouraged',
      'Post-op complications assessed',
      'Discharge planning initiated'
    ]
  };

  /**
   * Start bedside assist session
   */
  public async startSession(patientId?: string, roomType: 'general' | 'icu' | 'postop' = 'general'): Promise<BedsideSession> {
    console.log('🎥 Starting bedside assist session...');

    const session: BedsideSession = {
      id: `session-${Date.now()}`,
      startTime: new Date(),
      patientId,
      notes: [],
      suggestions: [],
      alerts: [],
      status: 'active'
    };

    this.currentSession = session;
    this.sessions.set(session.id, session);
    this.isListening = true;

    // Start real-time transcription
    await this.startRealTimeListening();

    // Add initial suggestions
    this.addSuggestion(session.id, {
      type: 'assessment',
      priority: 'medium',
      message: 'Begin with patient identification and vital signs assessment',
      actionable: true
    });

    console.log('✅ Bedside assist session started');
    return session;
  }

  /**
   * Start real-time listening
   */
  private async startRealTimeListening(): Promise<void> {
    if (!advancedTranscriptionService.isSupported()) {
      console.warn('⚠️ Real-time listening not supported');
      return;
    }

    // Configure for continuous listening
    advancedTranscriptionService.setConfig({
      continuous: true,
      interimResults: true,
      medicalContext: true,
      autoCorrect: true,
      punctuate: true
    });

    // Set up callbacks for real-time processing
    advancedTranscriptionService.setCallbacks({
      onResult: (result) => {
        if (this.currentSession && result.isFinal) {
          // Add to session notes
          this.currentSession.notes.push(result.text);

          // Analyze for keywords and generate suggestions
          this.analyzeTranscriptForSuggestions(result.text);

          // Check for clinical alerts
          this.checkForAlerts(result.text);
        }
      },
      onError: (error) => {
        console.error('Bedside assist listening error:', error);
      }
    });

    await advancedTranscriptionService.startListening();
  }

  /**
   * Analyze transcript for suggestions
   */
  private analyzeTranscriptForSuggestions(text: string): void {
    if (!this.currentSession) return;

    const lowerText = text.toLowerCase();

    // Check for pain mentions
    if (lowerText.includes('pain') && !lowerText.includes('no pain')) {
      this.addSuggestion(this.currentSession.id, {
        type: 'assessment',
        priority: 'high',
        message: 'Document pain location, intensity (0-10), and characteristics',
        actionable: true
      });

      this.addSuggestion(this.currentSession.id, {
        type: 'intervention',
        priority: 'high',
        message: 'Consider pain medication per protocol',
        actionable: true
      });
    }

    // Check for vital sign mentions
    if (lowerText.match(/bp|blood pressure|heart rate|temperature|oxygen/)) {
      this.addSuggestion(this.currentSession.id, {
        type: 'documentation',
        priority: 'medium',
        message: 'Ensure all vital signs are documented in EHR',
        actionable: true
      });
    }

    // Check for medication administration
    if (lowerText.includes('medication') || lowerText.includes('med')) {
      this.addSuggestion(this.currentSession.id, {
        type: 'safety',
        priority: 'high',
        message: 'Verify patient identity and medication 5 rights',
        actionable: true
      });
    }

    // Check for fall risk factors
    if (lowerText.match(/dizzy|weak|unsteady|fall/)) {
      this.addAlert(this.currentSession.id, {
        severity: 'warning',
        category: 'fall_risk',
        message: 'Patient expressing fall risk factors - implement fall precautions'
      });
    }

    // Check for infection signs
    if (lowerText.match(/fever|infection|redness|drainage/)) {
      this.addAlert(this.currentSession.id, {
        severity: 'warning',
        category: 'infection_control',
        message: 'Signs of potential infection mentioned - assess further'
      });
    }
  }

  /**
   * Check for clinical alerts
   */
  private checkForAlerts(text: string): void {
    if (!this.currentSession) return;

    // Extract vital signs and check ranges
    const vitals = this.extractVitals(text);
    
    if (vitals.bp) {
      const [systolic, diastolic] = vitals.bp;
      if (systolic > 180 || systolic < 90 || diastolic > 110 || diastolic < 60) {
        this.addAlert(this.currentSession.id, {
          severity: 'critical',
          category: 'vital_signs',
          message: `Blood pressure ${systolic}/${diastolic} is outside normal range - notify physician`
        });
      }
    }

    if (vitals.temp) {
      if (vitals.temp > 101.5 || vitals.temp < 95) {
        this.addAlert(this.currentSession.id, {
          severity: 'critical',
          category: 'vital_signs',
          message: `Temperature ${vitals.temp}°F is abnormal - assess and intervene`
        });
      }
    }

    if (vitals.o2sat) {
      if (vitals.o2sat < 90) {
        this.addAlert(this.currentSession.id, {
          severity: 'critical',
          category: 'vital_signs',
          message: `O2 saturation ${vitals.o2sat}% is critically low - immediate intervention needed`
        });
      }
    }
  }

  /**
   * Extract vital signs from text
   */
  private extractVitals(text: string): {
    bp?: [number, number];
    hr?: number;
    temp?: number;
    rr?: number;
    o2sat?: number;
  } {
    const vitals: any = {};

    // Blood pressure
    const bpMatch = text.match(/(?:BP|blood pressure)[:\s]*(\d+)[\s/]*(\d+)/i);
    if (bpMatch) {
      vitals.bp = [parseInt(bpMatch[1]), parseInt(bpMatch[2])];
    }

    // Heart rate
    const hrMatch = text.match(/(?:HR|heart rate)[:\s]*(\d+)/i);
    if (hrMatch) {
      vitals.hr = parseInt(hrMatch[1]);
    }

    // Temperature
    const tempMatch = text.match(/(?:temp|temperature)[:\s]*(\d+\.?\d*)/i);
    if (tempMatch) {
      vitals.temp = parseFloat(tempMatch[1]);
    }

    // Respiratory rate
    const rrMatch = text.match(/(?:RR|respiratory rate)[:\s]*(\d+)/i);
    if (rrMatch) {
      vitals.rr = parseInt(rrMatch[1]);
    }

    // O2 saturation
    const o2Match = text.match(/(?:O2 sat|oxygen saturation)[:\s]*(\d+)/i);
    if (o2Match) {
      vitals.o2sat = parseInt(o2Match[1]);
    }

    return vitals;
  }

  /**
   * Add suggestion to session
   */
  private addSuggestion(
    sessionId: string, 
    suggestion: Omit<BedsideSuggestion, 'id' | 'timestamp' | 'implemented'>
  ): void {
    const session = this.sessions.get(sessionId);
    if (!session) return;

    const newSuggestion: BedsideSuggestion = {
      ...suggestion,
      id: `sug-${Date.now()}`,
      timestamp: new Date(),
      implemented: false
    };

    session.suggestions.push(newSuggestion);
  }

  /**
   * Add alert to session
   */
  private addAlert(
    sessionId: string,
    alert: Omit<BedsideAlert, 'id' | 'timestamp' | 'acknowledged'>
  ): void {
    const session = this.sessions.get(sessionId);
    if (!session) return;

    const newAlert: BedsideAlert = {
      ...alert,
      id: `alert-${Date.now()}`,
      timestamp: new Date(),
      acknowledged: false
    };

    session.alerts.push(newAlert);
    console.log(`🚨 Bedside Alert: ${newAlert.message}`);
  }

  /**
   * Pause session
   */
  public pauseSession(): boolean {
    if (!this.currentSession) return false;

    this.currentSession.status = 'paused';
    this.isListening = false;
    advancedTranscriptionService.stopListening();
    
    return true;
  }

  /**
   * Resume session
   */
  public async resumeSession(): Promise<boolean> {
    if (!this.currentSession) return false;

    this.currentSession.status = 'active';
    this.isListening = true;
    await this.startRealTimeListening();
    
    return true;
  }

  /**
   * End session
   */
  public async endSession(): Promise<BedsideSession | null> {
    if (!this.currentSession) return null;

    this.currentSession.endTime = new Date();
    this.currentSession.status = 'completed';
    this.isListening = false;
    
    advancedTranscriptionService.stopListening();

    const completedSession = { ...this.currentSession };
    this.currentSession = null;

    console.log('✅ Bedside assist session completed');
    return completedSession;
  }

  /**
   * Get current session
   */
  public getCurrentSession(): BedsideSession | null {
    return this.currentSession;
  }

  /**
   * Get all sessions
   */
  public getAllSessions(): BedsideSession[] {
    return Array.from(this.sessions.values());
  }

  /**
   * Implement suggestion
   */
  public implementSuggestion(sessionId: string, suggestionId: string): boolean {
    const session = this.sessions.get(sessionId);
    if (!session) return false;

    const suggestion = session.suggestions.find(s => s.id === suggestionId);
    if (!suggestion) return false;

    suggestion.implemented = true;
    return true;
  }

  /**
   * Acknowledge alert
   */
  public acknowledgeAlert(sessionId: string, alertId: string): boolean {
    const session = this.sessions.get(sessionId);
    if (!session) return false;

    const alert = session.alerts.find(a => a.id === alertId);
    if (!alert) return false;

    alert.acknowledged = true;
    return true;
  }

  /**
   * Get rounding checklist
   */
  public getRoundingChecklist(type: 'general' | 'icu' | 'postop'): RoundingChecklistItem[] {
    const items = this.roundingChecklists[type] || this.roundingChecklists.general;
    
    return items.map((description, index) => ({
      id: `check-${index}`,
      description,
      completed: false
    }));
  }

  /**
   * Export session summary
   */
  public exportSessionSummary(sessionId: string): string {
    const session = this.sessions.get(sessionId);
    if (!session) return '';

    const duration = session.endTime 
      ? Math.round((session.endTime.getTime() - session.startTime.getTime()) / 1000 / 60)
      : 'In progress';

    return `
BEDSIDE ASSIST SESSION SUMMARY

Session ID: ${session.id}
Start Time: ${session.startTime.toLocaleString()}
${session.endTime ? `End Time: ${session.endTime.toLocaleString()}` : 'Status: Active'}
Duration: ${duration} minutes
Patient ID: ${session.patientId || 'Not specified'}

NOTES CAPTURED:
${session.notes.map((note, i) => `${i + 1}. ${note}`).join('\n')}

SUGGESTIONS PROVIDED (${session.suggestions.length}):
${session.suggestions.map((sug, i) => `
${i + 1}. [${sug.priority.toUpperCase()}] ${sug.message}
   Type: ${sug.type}
   Status: ${sug.implemented ? 'IMPLEMENTED' : 'PENDING'}
   Time: ${sug.timestamp.toLocaleTimeString()}
`).join('\n')}

ALERTS GENERATED (${session.alerts.length}):
${session.alerts.map((alert, i) => `
${i + 1}. [${alert.severity.toUpperCase()}] ${alert.message}
   Category: ${alert.category}
   Status: ${alert.acknowledged ? 'ACKNOWLEDGED' : 'PENDING'}
   Time: ${alert.timestamp.toLocaleTimeString()}
`).join('\n')}
    `.trim();
  }

  /**
   * Get session statistics
   */
  public getSessionStats(sessionId: string): {
    totalNotes: number;
    totalSuggestions: number;
    implementedSuggestions: number;
    totalAlerts: number;
    criticalAlerts: number;
    duration: number;
  } {
    const session = this.sessions.get(sessionId);
    if (!session) {
      return {
        totalNotes: 0,
        totalSuggestions: 0,
        implementedSuggestions: 0,
        totalAlerts: 0,
        criticalAlerts: 0,
        duration: 0
      };
    }

    const duration = session.endTime
      ? Math.round((session.endTime.getTime() - session.startTime.getTime()) / 1000 / 60)
      : 0;

    return {
      totalNotes: session.notes.length,
      totalSuggestions: session.suggestions.length,
      implementedSuggestions: session.suggestions.filter(s => s.implemented).length,
      totalAlerts: session.alerts.length,
      criticalAlerts: session.alerts.filter(a => a.severity === 'critical').length,
      duration
    };
  }
}

// Export singleton
export const bedsideAssistService = new BedsideAssistService();
