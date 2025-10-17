/**
 * Comprehensive PHI Protection Service
 * Advanced PHI detection, redaction, audit logging, and compliance reporting
 */

import { enhancedAIService } from './enhancedAIService';

export interface PHIPattern {
  name: string;
  pattern: RegExp;
  category: 'name' | 'date' | 'phone' | 'email' | 'address' | 'mrn' | 'ssn' | 'insurance' | 'medical';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  replacement: string;
}

export interface PHIDetectionResult {
  originalText: string;
  redactedText: string;
  detectedPHI: Array<{
    type: string;
    value: string;
    position: { start: number; end: number };
    confidence: number;
    severity: 'low' | 'medium' | 'high' | 'critical';
    category: string;
  }>;
  overallRiskScore: number;
  complianceStatus: 'compliant' | 'warning' | 'violation';
}

export interface AuditLogEntry {
  id: string;
  timestamp: Date;
  userId: string;
  sessionId: string;
  action: 'phi_detection' | 'phi_redaction' | 'data_access' | 'data_export' | 'user_login' | 'user_logout' | 'admin_action';
  resource: string;
  details: {
    phiCount?: number;
    riskScore?: number;
    complianceStatus?: string;
    fileSize?: number;
    exportFormat?: string;
    ipAddress?: string;
    userAgent?: string;
  };
  result: 'success' | 'warning' | 'error' | 'violation';
  message: string;
}

export interface ComplianceReport {
  id: string;
  generatedAt: Date;
  period: { start: Date; end: Date };
  organizationId: string;
  summary: {
    totalNotes: number;
    phiDetections: number;
    redactions: number;
    violations: number;
    complianceScore: number;
  };
  violations: Array<{
    id: string;
    timestamp: Date;
    userId: string;
    severity: string;
    description: string;
    action: string;
  }>;
  recommendations: string[];
}

class PHIProtectionService {
  private auditLogs: AuditLogEntry[] = [];
  private complianceReports: ComplianceReport[] = [];

  // Comprehensive PHI patterns
  private phiPatterns: PHIPattern[] = [
    // Names (various formats)
    {
      name: 'Full Name',
      pattern: /\b[A-Z][a-z]+ [A-Z][a-z]+(?: [A-Z][a-z]+)?\b/g,
      category: 'name',
      severity: 'high',
      description: 'Full name pattern',
      replacement: '[NAME]'
    },
    {
      name: 'Initials',
      pattern: /\b[A-Z]\. [A-Z]\.\b/g,
      category: 'name',
      severity: 'medium',
      description: 'Initials pattern',
      replacement: '[INITIALS]'
    },
    
    // Dates (multiple formats)
    {
      name: 'Date MM/DD/YYYY',
      pattern: /\b(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/(19|20)\d{2}\b/g,
      category: 'date',
      severity: 'medium',
      description: 'MM/DD/YYYY date format',
      replacement: '[DATE]'
    },
    {
      name: 'Date YYYY-MM-DD',
      pattern: /\b(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])\b/g,
      category: 'date',
      severity: 'medium',
      description: 'YYYY-MM-DD date format',
      replacement: '[DATE]'
    },
    {
      name: 'Date Text',
      pattern: /\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]* \d{1,2},? \d{4}\b/g,
      category: 'date',
      severity: 'medium',
      description: 'Text date format',
      replacement: '[DATE]'
    },
    
    // Phone Numbers
    {
      name: 'Phone US Format',
      pattern: /\b(?:\(?([0-9]{3})\)?[-. ]?)?([0-9]{3})[-. ]?([0-9]{4})\b/g,
      category: 'phone',
      severity: 'high',
      description: 'US phone number format',
      replacement: '[PHONE]'
    },
    
    // Email Addresses
    {
      name: 'Email',
      pattern: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
      category: 'email',
      severity: 'high',
      description: 'Email address',
      replacement: '[EMAIL]'
    },
    
    // Addresses
    {
      name: 'Street Address',
      pattern: /\b\d+\s+[A-Za-z0-9\s]+(?:Street|St|Avenue|Ave|Road|Rd|Boulevard|Blvd|Drive|Dr|Lane|Ln|Way|Circle|Cir|Court|Ct)\b/g,
      category: 'address',
      severity: 'high',
      description: 'Street address',
      replacement: '[ADDRESS]'
    },
    
    // Medical Record Numbers
    {
      name: 'MRN',
      pattern: /\b(?:MRN|Medical Record Number|Patient ID|Pt ID):\s*[A-Za-z0-9-]+\b/gi,
      category: 'mrn',
      severity: 'critical',
      description: 'Medical record number',
      replacement: '[MRN]'
    },
    
    // Social Security Numbers
    {
      name: 'SSN',
      pattern: /\b(?:SSN|Social Security Number):\s*\d{3}-?\d{2}-?\d{4}\b/gi,
      category: 'ssn',
      severity: 'critical',
      description: 'Social Security Number',
      replacement: '[SSN]'
    },
    
    // Insurance Information
    {
      name: 'Insurance ID',
      pattern: /\b(?:Insurance|Policy|Member ID|Subscriber ID):\s*[A-Za-z0-9-]+\b/gi,
      category: 'insurance',
      severity: 'high',
      description: 'Insurance information',
      replacement: '[INSURANCE]'
    },
    
    // Medical Information (sensitive)
    {
      name: 'Diagnosis Code',
      pattern: /\b(?:ICD|Diagnosis):\s*[A-Z]\d{2}(?:\.\d{1,2})?\b/g,
      category: 'medical',
      severity: 'medium',
      description: 'Medical diagnosis code',
      replacement: '[DIAGNOSIS]'
    }
  ];

  /**
   * Detect and redact PHI from text
   */
  public async detectAndRedactPHI(text: string, options: {
    useAIEnhancement?: boolean;
    strictMode?: boolean;
    preserveMedicalTerms?: boolean;
  } = {}): Promise<PHIDetectionResult> {
    const startTime = Date.now();
    let detectedPHI: PHIDetectionResult['detectedPHI'] = [];
    let redactedText = text;
    let overallRiskScore = 0;

    // Apply pattern-based detection
    for (const pattern of this.phiPatterns) {
      const matches = [...text.matchAll(pattern.pattern)];
      
      for (const match of matches) {
        if (match.index !== undefined) {
          const value = match[0];
          const confidence = this.calculateConfidence(value, pattern);
          
          // Skip if in strict mode and confidence is low
          if (options.strictMode && confidence < 0.7) {
            continue;
          }

          detectedPHI.push({
            type: pattern.name,
            value,
            position: { start: match.index, end: match.index + value.length },
            confidence,
            severity: pattern.severity,
            category: pattern.category
          });

          // Calculate risk score
          const severityWeight = this.getSeverityWeight(pattern.severity);
          overallRiskScore += severityWeight * confidence;
        }
      }
    }

    // AI-enhanced detection if enabled
    if (options.useAIEnhancement) {
      try {
        const aiDetection = await this.enhancedAIDetection(text);
        detectedPHI = [...detectedPHI, ...aiDetection];
        overallRiskScore += aiDetection.reduce((sum, item) => sum + (this.getSeverityWeight(item.severity) * item.confidence), 0);
      } catch (error) {
        console.warn('AI-enhanced PHI detection failed:', error);
      }
    }

    // Remove duplicates and sort by position
    detectedPHI = this.removeDuplicatePHI(detectedPHI);
    detectedPHI.sort((a, b) => b.position.start - a.position.start);

    // Apply redactions
    for (const phi of detectedPHI) {
      const pattern = this.phiPatterns.find(p => p.name === phi.type);
      if (pattern) {
        const before = redactedText.substring(0, phi.position.start);
        const after = redactedText.substring(phi.position.end);
        redactedText = before + pattern.replacement + after;
      }
    }

    // Determine compliance status
    const complianceStatus = this.determineComplianceStatus(overallRiskScore, detectedPHI.length);

    // Log the audit entry
    await this.logAuditEvent({
      userId: 'system',
      sessionId: 'phi-detection',
      action: 'phi_detection',
      resource: 'text_content',
      details: {
        phiCount: detectedPHI.length,
        riskScore: overallRiskScore,
        complianceStatus
      },
      result: complianceStatus === 'compliant' ? 'success' : complianceStatus === 'warning' ? 'warning' : 'violation',
      message: `PHI detection completed: ${detectedPHI.length} items found, risk score: ${overallRiskScore.toFixed(2)}`
    });

    return {
      originalText: text,
      redactedText,
      detectedPHI,
      overallRiskScore: Math.min(overallRiskScore, 100), // Cap at 100
      complianceStatus
    };
  }

  /**
   * Enhanced AI-based PHI detection
   */
  private async enhancedAIDetection(text: string): Promise<PHIDetectionResult['detectedPHI']> {
    try {
      // Use the existing AI service for enhanced detection
      const analysis = enhancedAIService.analyzeInput(text);
      
      // Convert AI analysis to PHI detection format
      const detectedPHI: PHIDetectionResult['detectedPHI'] = [];
      
      // Look for potential PHI in the analysis
      if (analysis.medicalTerms) {
        for (const term of analysis.medicalTerms) {
          // Check if term might be PHI (names, IDs, etc.)
          if (this.isPotentialPHI(term.term)) {
            detectedPHI.push({
              type: 'AI Detected PHI',
              value: term.term,
              position: { start: 0, end: term.term.length }, // Simplified for AI detection
              confidence: 0.8,
              severity: 'medium',
              category: 'medical'
            });
          }
        }
      }
      
      return detectedPHI;
    } catch (error) {
      console.error('Enhanced AI detection failed:', error);
      return [];
    }
  }

  /**
   * Check if a term is potential PHI
   */
  private isPotentialPHI(term: string): boolean {
    // Simple heuristics for potential PHI
    const phiIndicators = [
      /^[A-Z][a-z]+ [A-Z][a-z]+$/, // Name pattern
      /^\d{3}-\d{2}-\d{4}$/, // SSN pattern
      /^[A-Z]\d{2}$/, // Medical code pattern
      /@.*\.(com|org|net|edu)$/i // Email pattern
    ];
    
    return phiIndicators.some(pattern => pattern.test(term));
  }

  /**
   * Calculate confidence score for a detected pattern
   */
  private calculateConfidence(value: string, pattern: PHIPattern): number {
    let confidence = 0.8; // Base confidence
    
    // Adjust based on pattern complexity
    switch (pattern.category) {
      case 'name':
        confidence = value.split(' ').length >= 2 ? 0.9 : 0.6;
        break;
      case 'phone':
        confidence = /^\d{10}$/.test(value.replace(/\D/g, '')) ? 0.95 : 0.7;
        break;
      case 'email':
        confidence = 0.9;
        break;
      case 'ssn':
      case 'mrn':
        confidence = 0.95;
        break;
      default:
        confidence = 0.8;
    }
    
    return Math.min(confidence, 1.0);
  }

  /**
   * Get severity weight for risk calculation
   */
  private getSeverityWeight(severity: string): number {
    switch (severity) {
      case 'low': return 1;
      case 'medium': return 3;
      case 'high': return 7;
      case 'critical': return 15;
      default: return 1;
    }
  }

  /**
   * Remove duplicate PHI detections
   */
  private removeDuplicatePHI(detectedPHI: PHIDetectionResult['detectedPHI']): PHIDetectionResult['detectedPHI'] {
    const unique = new Map<string, PHIDetectionResult['detectedPHI'][0]>();
    
    for (const phi of detectedPHI) {
      const key = `${phi.type}:${phi.position.start}:${phi.position.end}`;
      if (!unique.has(key) || unique.get(key)!.confidence < phi.confidence) {
        unique.set(key, phi);
      }
    }
    
    return Array.from(unique.values());
  }

  /**
   * Determine compliance status based on risk score and PHI count
   */
  private determineComplianceStatus(riskScore: number, phiCount: number): 'compliant' | 'warning' | 'violation' {
    if (phiCount === 0) return 'compliant';
    if (riskScore > 50 || phiCount > 10) return 'violation';
    if (riskScore > 20 || phiCount > 5) return 'warning';
    return 'compliant';
  }

  /**
   * Log audit event
   */
  public async logAuditEvent(entry: Omit<AuditLogEntry, 'id' | 'timestamp'>): Promise<void> {
    const auditEntry: AuditLogEntry = {
      id: this.generateId(),
      timestamp: new Date(),
      ...entry
    };
    
    this.auditLogs.push(auditEntry);
    
    // In production, this would send to Supabase or another logging service
    console.log('📋 Audit Log:', auditEntry);
  }

  /**
   * Generate compliance report
   */
  public async generateComplianceReport(organizationId: string, period: { start: Date; end: Date }): Promise<ComplianceReport> {
    const relevantLogs = this.auditLogs.filter(log => 
      log.timestamp >= period.start && 
      log.timestamp <= period.end &&
      log.resource.includes(organizationId)
    );
    
    const violations = relevantLogs.filter(log => log.result === 'violation');
    const phiDetections = relevantLogs.filter(log => log.action === 'phi_detection');
    const redactions = relevantLogs.filter(log => log.action === 'phi_redaction');
    
    const totalNotes = relevantLogs.filter(log => log.action === 'data_export').length;
    const complianceScore = Math.max(0, 100 - (violations.length * 10) - (phiDetections.length * 2));
    
    const report: ComplianceReport = {
      id: this.generateId(),
      generatedAt: new Date(),
      period,
      organizationId,
      summary: {
        totalNotes,
        phiDetections: phiDetections.length,
        redactions: redactions.length,
        violations: violations.length,
        complianceScore
      },
      violations: violations.map(v => ({
        id: v.id,
        timestamp: v.timestamp,
        userId: v.userId,
        severity: 'high', // Simplified
        description: v.message,
        action: v.action
      })),
      recommendations: this.generateRecommendations(violations, phiDetections)
    };
    
    this.complianceReports.push(report);
    return report;
  }

  /**
   * Generate compliance recommendations
   */
  private generateRecommendations(violations: AuditLogEntry[], phiDetections: AuditLogEntry[]): string[] {
    const recommendations: string[] = [];
    
    if (violations.length > 0) {
      recommendations.push('Implement stricter PHI detection rules');
      recommendations.push('Provide additional staff training on PHI handling');
    }
    
    if (phiDetections.length > 10) {
      recommendations.push('Consider implementing automated PHI redaction');
      recommendations.push('Review and update PHI detection patterns');
    }
    
    if (recommendations.length === 0) {
      recommendations.push('Continue current PHI protection practices');
    }
    
    return recommendations;
  }

  /**
   * Get audit logs
   */
  public getAuditLogs(filters?: {
    userId?: string;
    action?: string;
    startDate?: Date;
    endDate?: Date;
  }): AuditLogEntry[] {
    let logs = [...this.auditLogs];
    
    if (filters) {
      if (filters.userId) {
        logs = logs.filter(log => log.userId === filters.userId);
      }
      if (filters.action) {
        logs = logs.filter(log => log.action === filters.action);
      }
      if (filters.startDate) {
        logs = logs.filter(log => log.timestamp >= filters.startDate!);
      }
      if (filters.endDate) {
        logs = logs.filter(log => log.timestamp <= filters.endDate!);
      }
    }
    
    return logs.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  /**
   * Get compliance reports
   */
  public getComplianceReports(organizationId?: string): ComplianceReport[] {
    let reports = [...this.complianceReports];
    
    if (organizationId) {
      reports = reports.filter(report => report.organizationId === organizationId);
    }
    
    return reports.sort((a, b) => b.generatedAt.getTime() - a.generatedAt.getTime());
  }

  /**
   * Generate unique ID
   */
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  /**
   * Get PHI patterns for configuration
   */
  public getPHIPatterns(): PHIPattern[] {
    return [...this.phiPatterns];
  }

  /**
   * Add custom PHI pattern
   */
  public addPHIPattern(pattern: PHIPattern): void {
    this.phiPatterns.push(pattern);
  }

  /**
   * Export audit data (for compliance reporting)
   */
  public exportAuditData(format: 'json' | 'csv' = 'json'): string {
    const data = {
      auditLogs: this.auditLogs,
      complianceReports: this.complianceReports,
      exportedAt: new Date().toISOString()
    };
    
    if (format === 'csv') {
      // Convert to CSV format (simplified)
      const csvHeaders = 'Timestamp,User ID,Action,Resource,Result,Message\n';
      const csvRows = this.auditLogs.map(log => 
        `${log.timestamp.toISOString()},${log.userId},${log.action},${log.resource},${log.result},${log.message}`
      ).join('\n');
      return csvHeaders + csvRows;
    }
    
    return JSON.stringify(data, null, 2);
  }
}

// Export singleton instance
export const phiProtectionService = new PHIProtectionService();
