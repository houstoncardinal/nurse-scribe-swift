/**
 * Audit Logging Service
 * HIPAA-compliant audit trail for all clinical documentation
 */

export type AuditEventType =
  | 'note_created'
  | 'note_viewed'
  | 'note_edited'
  | 'note_deleted'
  | 'note_exported'
  | 'note_shared'
  | 'user_login'
  | 'user_logout'
  | 'ehr_export'
  | 'ehr_connection'
  | 'team_member_added'
  | 'team_member_removed'
  | 'permissions_changed'
  | 'settings_changed';

export interface AuditEvent {
  id: string;
  timestamp: Date;
  eventType: AuditEventType;
  userId: string;
  userName: string;
  userRole: string;
  teamId?: string;
  resourceId?: string;
  resourceType?: 'note' | 'patient' | 'user' | 'team' | 'ehr';
  action: string;
  details: {
    [key: string]: any;
  };
  ipAddress?: string;
  deviceInfo?: string;
  outcome: 'success' | 'failure' | 'partial';
  complianceLevel: 'standard' | 'hipaa' | 'critical';
}

export interface AuditQuery {
  startDate?: Date;
  endDate?: Date;
  userId?: string;
  teamId?: string;
  eventType?: AuditEventType;
  resourceId?: string;
  outcome?: AuditEvent['outcome'];
  limit?: number;
}

export interface ComplianceReport {
  period: { start: Date; end: Date };
  totalEvents: number;
  eventsByType: Record<AuditEventType, number>;
  criticalEvents: number;
  failedEvents: number;
  uniqueUsers: number;
  complianceScore: number;
  flags: Array<{
    severity: 'low' | 'medium' | 'high';
    message: string;
    event: AuditEvent;
  }>;
}

class AuditLoggingService {
  private events: AuditEvent[] = [];
  private maxEvents = 10000; // Store last 10k events locally
  private complianceMode: 'basic' | 'hipaa' | 'enterprise' = 'hipaa';

  constructor() {
    this.loadEvents();
  }

  /**
   * Log an audit event
   */
  public async logEvent(event: Omit<AuditEvent, 'id' | 'timestamp'>): Promise<void> {
    const auditEvent: AuditEvent = {
      ...event,
      id: `audit-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date()
    };

    // Add to memory
    this.events.unshift(auditEvent);

    // Trim if exceeds max
    if (this.events.length > this.maxEvents) {
      this.events = this.events.slice(0, this.maxEvents);
    }

    // Save to storage
    this.saveEvents();

    // In production, would also send to secure server
    if (auditEvent.complianceLevel === 'critical') {
      console.warn('🔴 Critical audit event:', auditEvent);
      // Alert compliance team
    }

    console.log('📋 Audit:', auditEvent.eventType, '|', auditEvent.action);
  }

  /**
   * Query audit events
   */
  public queryEvents(query: AuditQuery): AuditEvent[] {
    let results = [...this.events];

    // Filter by date range
    if (query.startDate) {
      results = results.filter(e => e.timestamp >= query.startDate!);
    }
    if (query.endDate) {
      results = results.filter(e => e.timestamp <= query.endDate!);
    }

    // Filter by user
    if (query.userId) {
      results = results.filter(e => e.userId === query.userId);
    }

    // Filter by team
    if (query.teamId) {
      results = results.filter(e => e.teamId === query.teamId);
    }

    // Filter by event type
    if (query.eventType) {
      results = results.filter(e => e.eventType === query.eventType);
    }

    // Filter by resource
    if (query.resourceId) {
      results = results.filter(e => e.resourceId === query.resourceId);
    }

    // Filter by outcome
    if (query.outcome) {
      results = results.filter(e => e.outcome === query.outcome);
    }

    // Apply limit
    if (query.limit) {
      results = results.slice(0, query.limit);
    }

    return results;
  }

  /**
   * Generate compliance report
   */
  public generateComplianceReport(startDate: Date, endDate: Date): ComplianceReport {
    const events = this.queryEvents({ startDate, endDate });

    // Count events by type
    const eventsByType = {} as Record<AuditEventType, number>;
    events.forEach(e => {
      eventsByType[e.eventType] = (eventsByType[e.eventType] || 0) + 1;
    });

    // Get unique users
    const uniqueUsers = new Set(events.map(e => e.userId)).size;

    // Count critical and failed events
    const criticalEvents = events.filter(e => e.complianceLevel === 'critical').length;
    const failedEvents = events.filter(e => e.outcome === 'failure').length;

    // Identify compliance flags
    const flags: ComplianceReport['flags'] = [];

    // Check for unauthorized access attempts
    const failedLogins = events.filter(e => e.eventType === 'user_login' && e.outcome === 'failure');
    if (failedLogins.length > 5) {
      flags.push({
        severity: 'high',
        message: `${failedLogins.length} failed login attempts detected`,
        event: failedLogins[0]
      });
    }

    // Check for unusual deletion activity
    const deletions = events.filter(e => e.eventType === 'note_deleted');
    if (deletions.length > 10) {
      flags.push({
        severity: 'medium',
        message: `High number of note deletions: ${deletions.length}`,
        event: deletions[0]
      });
    }

    // Check for missing audit trails
    const daysInPeriod = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    if (events.length < daysInPeriod) {
      flags.push({
        severity: 'low',
        message: 'Sparse audit trail detected',
        event: events[0]
      });
    }

    // Calculate compliance score (0-100)
    let score = 100;
    score -= failedEvents * 2;
    score -= flags.filter(f => f.severity === 'high').length * 10;
    score -= flags.filter(f => f.severity === 'medium').length * 5;
    score = Math.max(0, Math.min(100, score));

    return {
      period: { start: startDate, end: endDate },
      totalEvents: events.length,
      eventsByType,
      criticalEvents,
      failedEvents,
      uniqueUsers,
      complianceScore: score,
      flags
    };
  }

  /**
   * Export audit log
   */
  public exportAuditLog(query: AuditQuery): string {
    const events = this.queryEvents(query);
    
    // Create CSV format
    const headers = [
      'Timestamp',
      'Event Type',
      'User',
      'Role',
      'Action',
      'Resource Type',
      'Resource ID',
      'Outcome',
      'Compliance Level'
    ];

    const rows = events.map(e => [
      e.timestamp.toISOString(),
      e.eventType,
      e.userName,
      e.userRole,
      e.action,
      e.resourceType || '',
      e.resourceId || '',
      e.outcome,
      e.complianceLevel
    ]);

    const csv = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    return csv;
  }

  /**
   * Get recent events for dashboard
   */
  public getRecentEvents(limit: number = 50): AuditEvent[] {
    return this.events.slice(0, limit);
  }

  /**
   * Get event statistics
   */
  public getEventStats(days: number = 30): {
    totalEvents: number;
    eventsPerDay: number;
    criticalEvents: number;
    failureRate: number;
    mostCommonEvents: Array<{ type: AuditEventType; count: number }>;
  } {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const events = this.queryEvents({ startDate });

    // Count by type
    const typeCounts = new Map<AuditEventType, number>();
    events.forEach(e => {
      typeCounts.set(e.eventType, (typeCounts.get(e.eventType) || 0) + 1);
    });

    // Sort by count
    const mostCommon = Array.from(typeCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([type, count]) => ({ type, count }));

    const criticalEvents = events.filter(e => e.complianceLevel === 'critical').length;
    const failedEvents = events.filter(e => e.outcome === 'failure').length;

    return {
      totalEvents: events.length,
      eventsPerDay: events.length / days,
      criticalEvents,
      failureRate: events.length > 0 ? (failedEvents / events.length) * 100 : 0,
      mostCommonEvents: mostCommon
    };
  }

  /**
   * Clear old events (retention policy)
   */
  public clearOldEvents(daysToKeep: number = 90): number {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

    const originalLength = this.events.length;
    this.events = this.events.filter(e => e.timestamp >= cutoffDate);
    const removed = originalLength - this.events.length;

    if (removed > 0) {
      this.saveEvents();
      console.log(`🗑️ Removed ${removed} old audit events`);
    }

    return removed;
  }

  /**
   * Set compliance mode
   */
  public setComplianceMode(mode: 'basic' | 'hipaa' | 'enterprise'): void {
    this.complianceMode = mode;
    console.log(`✅ Compliance mode set to: ${mode}`);
  }

  /**
   * Load events from storage
   */
  private loadEvents(): void {
    try {
      const stored = localStorage.getItem('raha_audit_log');
      if (stored) {
        this.events = JSON.parse(stored, (key, value) => {
          // Convert timestamp strings back to Date objects
          if (key === 'timestamp') {
            return new Date(value);
          }
          return value;
        });
      }
    } catch (error) {
      console.warn('Failed to load audit log:', error);
    }
  }

  /**
   * Save events to storage
   */
  private saveEvents(): void {
    try {
      // Only save recent events to localStorage
      const recentEvents = this.events.slice(0, 1000);
      localStorage.setItem('raha_audit_log', JSON.stringify(recentEvents));
    } catch (error) {
      console.warn('Failed to save audit log:', error);
    }
  }

  /**
   * Get compliance status
   */
  public getComplianceStatus(): {
    mode: string;
    isCompliant: boolean;
    lastAudit: Date;
    score: number;
    issues: string[];
  } {
    const last30Days = new Date();
    last30Days.setDate(last30Days.getDate() - 30);

    const report = this.generateComplianceReport(last30Days, new Date());

    return {
      mode: this.complianceMode,
      isCompliant: report.complianceScore >= 80,
      lastAudit: new Date(),
      score: report.complianceScore,
      issues: report.flags.filter(f => f.severity === 'high').map(f => f.message)
    };
  }
}

// Export singleton
export const auditLoggingService = new AuditLoggingService();
