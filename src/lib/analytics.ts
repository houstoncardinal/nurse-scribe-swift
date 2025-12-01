/**
 * Local Analytics Dashboard
 * Tracks time-saving metrics, usage statistics, and productivity insights
 */

export interface AnalyticsData {
  totalNotes: number;
  totalTimeSaved: number; // in minutes
  averageNoteTime: number; // in minutes
  templatesUsed: Record<string, number>;
  exportsUsed: Record<string, number>;
  redactionsPerformed: number;
  voiceCommandsUsed: number;
  sessions: AnalyticsSession[];
  dailyStats: DailyStats[];
  weeklyStats: WeeklyStats[];
}

export interface AnalyticsSession {
  id: string;
  startTime: string;
  endTime: string;
  duration: number; // in minutes
  notesCreated: number;
  timeSaved: number; // in minutes
  templatesUsed: string[];
  exportsPerformed: string[];
}

export interface DailyStats {
  date: string;
  notesCreated: number;
  timeSaved: number;
  templatesUsed: string[];
  exportsPerformed: string[];
  redactionsPerformed: number;
}

export interface WeeklyStats {
  week: string; // YYYY-WW format
  notesCreated: number;
  timeSaved: number;
  averageTimePerNote: number;
  mostUsedTemplate: string;
  totalExports: number;
}

export interface ProductivityMetrics {
  timeSavedPerShift: number;
  notesPerHour: number;
  efficiencyGain: number; // percentage
  costSavings: number; // estimated cost savings
  roi: number; // return on investment
}

class AnalyticsService {
  private storageKey = 'raha_analytics';
  private sessionKey = 'raha_session';

  /**
   * Initialize analytics data
   */
  initialize(): AnalyticsData {
    const stored = localStorage.getItem(this.storageKey);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (error) {
        console.error('Failed to parse analytics data:', error);
      }
    }

    return {
      totalNotes: 0,
      totalTimeSaved: 0,
      averageNoteTime: 0,
      templatesUsed: {},
      exportsUsed: {},
      redactionsPerformed: 0,
      voiceCommandsUsed: 0,
      sessions: [],
      dailyStats: [],
      weeklyStats: [],
    };
  }

  /**
   * Start a new session
   */
  startSession(): string {
    const sessionId = `session_${Date.now()}`;
    const session: AnalyticsSession = {
      id: sessionId,
      startTime: new Date().toISOString(),
      endTime: '',
      duration: 0,
      notesCreated: 0,
      timeSaved: 0,
      templatesUsed: [],
      exportsPerformed: [],
    };

    localStorage.setItem(this.sessionKey, JSON.stringify(session));
    return sessionId;
  }

  /**
   * End current session
   */
  endSession(): void {
    const sessionData = localStorage.getItem(this.sessionKey);
    if (!sessionData) return;

    try {
      const session: AnalyticsSession = JSON.parse(sessionData);
      session.endTime = new Date().toISOString();
      session.duration = this.calculateDuration(session.startTime, session.endTime);

      const analytics = this.getAnalytics();
      analytics.sessions.push(session);
      this.saveAnalytics(analytics);

      localStorage.removeItem(this.sessionKey);
    } catch (error) {
      console.error('Failed to end session:', error);
    }
  }

  /**
   * Record note creation
   */
  recordNoteCreated(template: string, timeSaved: number = 15): void {
    const analytics = this.getAnalytics();
    
    analytics.totalNotes += 1;
    analytics.totalTimeSaved += timeSaved;
    analytics.averageNoteTime = analytics.totalTimeSaved / analytics.totalNotes;
    
    // Track template usage
    analytics.templatesUsed[template] = (analytics.templatesUsed[template] || 0) + 1;
    
    // Update daily stats
    this.updateDailyStats(analytics, template, timeSaved);
    
    // Update current session
    this.updateCurrentSession(template, timeSaved);
    
    this.saveAnalytics(analytics);
  }

  /**
   * Record export performed
   */
  recordExport(type: string, ehrSystem: string): void {
    const analytics = this.getAnalytics();
    const exportKey = `${type}_${ehrSystem}`;
    
    analytics.exportsUsed[exportKey] = (analytics.exportsUsed[exportKey] || 0) + 1;
    
    // Update current session
    const sessionData = localStorage.getItem(this.sessionKey);
    if (sessionData) {
      try {
        const session: AnalyticsSession = JSON.parse(sessionData);
        session.exportsPerformed.push(exportKey);
        localStorage.setItem(this.sessionKey, JSON.stringify(session));
      } catch (error) {
        console.error('Failed to update session export:', error);
      }
    }
    
    this.saveAnalytics(analytics);
  }

  /**
   * Record PHI redaction performed
   */
  recordRedaction(count: number): void {
    const analytics = this.getAnalytics();
    analytics.redactionsPerformed += count;
    this.saveAnalytics(analytics);
  }

  /**
   * Record voice command used
   */
  recordVoiceCommand(command: string): void {
    const analytics = this.getAnalytics();
    analytics.voiceCommandsUsed += 1;
    this.saveAnalytics(analytics);
  }

  /**
   * Get current analytics data
   */
  getAnalytics(): AnalyticsData {
    return this.initialize();
  }

  /**
   * Get productivity metrics
   */
  getProductivityMetrics(): ProductivityMetrics {
    const analytics = this.getAnalytics();
    const totalHours = analytics.sessions.reduce((sum, session) => sum + session.duration, 0) / 60;
    
    return {
      timeSavedPerShift: this.calculateAverageTimeSaved(analytics),
      notesPerHour: totalHours > 0 ? analytics.totalNotes / totalHours : 0,
      efficiencyGain: this.calculateEfficiencyGain(analytics),
      costSavings: this.calculateCostSavings(analytics),
      roi: this.calculateROI(analytics),
    };
  }

  /**
   * Get usage trends
   */
  getUsageTrends(days: number = 30): DailyStats[] {
    const analytics = this.getAnalytics();
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    return analytics.dailyStats.filter(stat => 
      new Date(stat.date) >= cutoffDate
    ).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }

  /**
   * Get template usage statistics
   */
  getTemplateStats(): Array<{ template: string; count: number; percentage: number }> {
    const analytics = this.getAnalytics();
    const total = analytics.totalNotes;
    
    return Object.entries(analytics.templatesUsed).map(([template, count]) => ({
      template,
      count,
      percentage: total > 0 ? (count / total) * 100 : 0,
    })).sort((a, b) => b.count - a.count);
  }

  /**
   * Get export statistics
   */
  getExportStats(): Array<{ type: string; ehrSystem: string; count: number }> {
    const analytics = this.getAnalytics();
    
    return Object.entries(analytics.exportsUsed).map(([key, count]) => {
      const [type, ehrSystem] = key.split('_');
      return { type, ehrSystem, count };
    }).sort((a, b) => b.count - a.count);
  }

  /**
   * Calculate duration between timestamps
   */
  private calculateDuration(startTime: string, endTime: string): number {
    const start = new Date(startTime);
    const end = new Date(endTime);
    return Math.round((end.getTime() - start.getTime()) / (1000 * 60)); // minutes
  }

  /**
   * Update daily statistics
   */
  private updateDailyStats(analytics: AnalyticsData, template: string, timeSaved: number): void {
    const today = new Date().toISOString().split('T')[0];
    let dailyStat = analytics.dailyStats.find(stat => stat.date === today);
    
    if (!dailyStat) {
      dailyStat = {
        date: today,
        notesCreated: 0,
        timeSaved: 0,
        templatesUsed: [],
        exportsPerformed: [],
        redactionsPerformed: 0,
      };
      analytics.dailyStats.push(dailyStat);
    }
    
    dailyStat.notesCreated += 1;
    dailyStat.timeSaved += timeSaved;
    
    if (!dailyStat.templatesUsed.includes(template)) {
      dailyStat.templatesUsed.push(template);
    }
  }

  /**
   * Update current session
   */
  private updateCurrentSession(template: string, timeSaved: number): void {
    const sessionData = localStorage.getItem(this.sessionKey);
    if (!sessionData) return;

    try {
      const session: AnalyticsSession = JSON.parse(sessionData);
      session.notesCreated += 1;
      session.timeSaved += timeSaved;
      
      if (!session.templatesUsed.includes(template)) {
        session.templatesUsed.push(template);
      }
      
      localStorage.setItem(this.sessionKey, JSON.stringify(session));
    } catch (error) {
      console.error('Failed to update session:', error);
    }
  }

  /**
   * Calculate average time saved per shift
   */
  private calculateAverageTimeSaved(analytics: AnalyticsData): number {
    if (analytics.sessions.length === 0) return 0;
    
    const totalTimeSaved = analytics.sessions.reduce((sum, session) => sum + session.timeSaved, 0);
    return totalTimeSaved / analytics.sessions.length;
  }

  /**
   * Calculate efficiency gain percentage
   */
  private calculateEfficiencyGain(analytics: AnalyticsData): number {
    if (analytics.totalNotes === 0) return 0;
    
    // Assuming traditional documentation takes 15 minutes per note
    const traditionalTime = analytics.totalNotes * 15;
    const actualTime = analytics.totalNotes * (15 - analytics.averageNoteTime);
    
    return traditionalTime > 0 ? ((traditionalTime - actualTime) / traditionalTime) * 100 : 0;
  }

  /**
   * Calculate estimated cost savings
   */
  private calculateCostSavings(analytics: AnalyticsData): number {
    // Assuming nurse hourly rate of $35 and time saved
    const hourlyRate = 35;
    const hoursSaved = analytics.totalTimeSaved / 60;
    return hoursSaved * hourlyRate;
  }

  /**
   * Calculate ROI (simplified)
   */
  private calculateROI(analytics: AnalyticsData): number {
    const costSavings = this.calculateCostSavings(analytics);
    // Assuming monthly subscription cost of $50
    const monthlyCost = 50;
    const months = analytics.sessions.length > 0 ? 
      Math.ceil(analytics.sessions.length / 30) : 1;
    
    const totalCost = monthlyCost * months;
    return totalCost > 0 ? (costSavings / totalCost) * 100 : 0;
  }

  /**
   * Save analytics data
   */
  private saveAnalytics(analytics: AnalyticsData): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(analytics));
    } catch (error) {
      console.error('Failed to save analytics:', error);
    }
  }

  /**
   * Clear all analytics data
   */
  clearAnalytics(): void {
    localStorage.removeItem(this.storageKey);
    localStorage.removeItem(this.sessionKey);
  }

  /**
   * Export analytics data
   */
  exportAnalytics(): string {
    const analytics = this.getAnalytics();
    const metrics = this.getProductivityMetrics();
    
    return JSON.stringify({
      analytics,
      metrics,
      exportDate: new Date().toISOString(),
    }, null, 2);
  }

  /**
   * Get current session data
   */
  getCurrentSession(): AnalyticsSession | null {
    const sessionData = localStorage.getItem(this.sessionKey);
    if (!sessionData) return null;

    try {
      return JSON.parse(sessionData);
    } catch (error) {
      console.error('Failed to parse session data:', error);
      return null;
    }
  }
}

// Export singleton instance
export const analyticsService = new AnalyticsService();
