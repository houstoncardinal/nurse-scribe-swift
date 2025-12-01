/**
 * Admin Dashboard with HIPAA Controls
 * Manages organization settings, user permissions, audit logs, and compliance
 */

export interface OrganizationSettings {
  id: string;
  name: string;
  type: 'hospital' | 'clinic' | 'nursing_school' | 'private_practice';
  hipaaCompliant: boolean;
  dataRetentionDays: number;
  encryptionEnabled: boolean;
  auditLogging: boolean;
  userAccessControls: boolean;
  sessionTimeout: number; // in minutes
  passwordPolicy: PasswordPolicy;
  twoFactorAuth: boolean;
  allowedIPs: string[];
  departments: Department[];
  integrations: Integration[];
}

export interface Department {
  id: string;
  name: string;
  code: string;
  users: string[];
  permissions: Permission[];
  hipaaLevel: 'full' | 'limited' | 'none';
}

export interface Permission {
  id: string;
  name: string;
  description: string;
  category: 'documentation' | 'administration' | 'analytics' | 'education';
  level: 'read' | 'write' | 'admin';
}

export interface Integration {
  id: string;
  name: string;
  type: 'ehr' | 'analytics' | 'storage' | 'authentication';
  status: 'active' | 'inactive' | 'error';
  configuration: Record<string, any>;
  lastSync?: string;
}

export interface PasswordPolicy {
  minLength: number;
  requireUppercase: boolean;
  requireLowercase: boolean;
  requireNumbers: boolean;
  requireSpecialChars: boolean;
  maxAge: number; // in days
  preventReuse: number; // number of previous passwords
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  action: string;
  resource: string;
  ipAddress: string;
  userAgent: string;
  success: boolean;
  details: Record<string, any>;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'nurse' | 'instructor' | 'student' | 'auditor';
  department: string;
  permissions: string[];
  lastLogin?: string;
  status: 'active' | 'inactive' | 'suspended';
  hipaaTrainingCompleted: boolean;
  hipaaTrainingDate?: string;
  twoFactorEnabled: boolean;
}

export interface ComplianceReport {
  id: string;
  generatedAt: string;
  period: {
    start: string;
    end: string;
  };
  summary: {
    totalUsers: number;
    activeUsers: number;
    hipaaCompliantUsers: number;
    auditLogEntries: number;
    securityIncidents: number;
    dataRetentionCompliance: boolean;
  };
  recommendations: string[];
  status: 'compliant' | 'non_compliant' | 'requires_attention';
}

class AdminService {
  private storageKey = 'raha_admin';
  private auditKey = 'raha_audit';

  /**
   * Initialize organization settings
   */
  initializeOrganization(): OrganizationSettings {
    const stored = localStorage.getItem(this.storageKey);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (error) {
        console.error('Failed to parse admin settings:', error);
      }
    }

    return {
      id: 'org_001',
      name: 'Raha Organization',
      type: 'hospital',
      hipaaCompliant: true,
      dataRetentionDays: 2555, // 7 years
      encryptionEnabled: true,
      auditLogging: true,
      userAccessControls: true,
      sessionTimeout: 30,
      passwordPolicy: {
        minLength: 8,
        requireUppercase: true,
        requireLowercase: true,
        requireNumbers: true,
        requireSpecialChars: true,
        maxAge: 90,
        preventReuse: 5,
      },
      twoFactorAuth: false,
      allowedIPs: [],
      departments: [
        {
          id: 'dept_001',
          name: 'Medical-Surgical',
          code: 'MED-SURG',
          users: [],
          permissions: [],
          hipaaLevel: 'full',
        },
        {
          id: 'dept_002',
          name: 'Emergency Department',
          code: 'ED',
          users: [],
          permissions: [],
          hipaaLevel: 'full',
        },
        {
          id: 'dept_003',
          name: 'Nursing Education',
          code: 'NURS-ED',
          users: [],
          permissions: [],
          hipaaLevel: 'limited',
        },
      ],
      integrations: [
        {
          id: 'int_001',
          name: 'Epic EHR',
          type: 'ehr',
          status: 'active',
          configuration: { url: 'https://epic.example.com', apiKey: '***' },
          lastSync: new Date().toISOString(),
        },
        {
          id: 'int_002',
          name: 'Supabase Storage',
          type: 'storage',
          status: 'active',
          configuration: { url: 'https://supabase.example.com', encrypted: true },
          lastSync: new Date().toISOString(),
        },
      ],
    };
  }

  /**
   * Update organization settings
   */
  updateOrganizationSettings(updates: Partial<OrganizationSettings>): void {
    const settings = this.initializeOrganization();
    const updated = { ...settings, ...updates };
    localStorage.setItem(this.storageKey, JSON.stringify(updated));
    this.logAuditEvent('admin', 'update_organization_settings', 'organization', true, updates);
  }

  /**
   * Get organization settings
   */
  getOrganizationSettings(): OrganizationSettings {
    return this.initializeOrganization();
  }

  /**
   * Get users (mock data for demo)
   */
  getUsers(): User[] {
    return [
      {
        id: 'user_001',
        email: 'admin@raha.ai',
        name: 'Admin User',
        role: 'admin',
        department: 'Administration',
        permissions: ['all'],
        lastLogin: new Date().toISOString(),
        status: 'active',
        hipaaTrainingCompleted: true,
        hipaaTrainingDate: '2024-01-15',
        twoFactorEnabled: true,
      },
      {
        id: 'user_002',
        email: 'nurse.smith@hospital.com',
        name: 'Sarah Smith, RN',
        role: 'nurse',
        department: 'Medical-Surgical',
        permissions: ['documentation:write', 'analytics:read'],
        lastLogin: new Date(Date.now() - 3600000).toISOString(),
        status: 'active',
        hipaaTrainingCompleted: true,
        hipaaTrainingDate: '2024-02-01',
        twoFactorEnabled: false,
      },
      {
        id: 'user_003',
        email: 'instructor.johnson@nursing.edu',
        name: 'Dr. Johnson, PhD',
        role: 'instructor',
        department: 'Nursing Education',
        permissions: ['education:write', 'analytics:read'],
        lastLogin: new Date(Date.now() - 7200000).toISOString(),
        status: 'active',
        hipaaTrainingCompleted: true,
        hipaaTrainingDate: '2024-01-20',
        twoFactorEnabled: true,
      },
      {
        id: 'user_004',
        email: 'student.williams@nursing.edu',
        name: 'Emily Williams',
        role: 'student',
        department: 'Nursing Education',
        permissions: ['education:read'],
        lastLogin: new Date(Date.now() - 10800000).toISOString(),
        status: 'active',
        hipaaTrainingCompleted: false,
        twoFactorEnabled: false,
      },
    ];
  }

  /**
   * Update user
   */
  updateUser(userId: string, updates: Partial<User>): void {
    // In a real app, this would update the backend
    this.logAuditEvent('admin', 'update_user', `user:${userId}`, true, updates);
  }

  /**
   * Suspend user
   */
  suspendUser(userId: string, reason: string): void {
    this.updateUser(userId, { status: 'suspended' });
    this.logAuditEvent('admin', 'suspend_user', `user:${userId}`, true, { reason });
  }

  /**
   * Get audit logs
   */
  getAuditLogs(limit: number = 100): AuditLogEntry[] {
    const stored = localStorage.getItem(this.auditKey);
    if (!stored) return [];

    try {
      const logs = JSON.parse(stored);
      return logs.slice(-limit).reverse();
    } catch (error) {
      console.error('Failed to parse audit logs:', error);
      return [];
    }
  }

  /**
   * Log audit event
   */
  logAuditEvent(
    userId: string,
    action: string,
    resource: string,
    success: boolean,
    details: Record<string, any> = {},
    riskLevel: AuditLogEntry['riskLevel'] = 'low'
  ): void {
    const entry: AuditLogEntry = {
      id: `audit_${Date.now()}`,
      timestamp: new Date().toISOString(),
      userId,
      userName: this.getUserById(userId)?.name || 'Unknown',
      action,
      resource,
      ipAddress: '127.0.0.1', // In real app, get from request
      userAgent: navigator.userAgent,
      success,
      details,
      riskLevel,
    };

    const existingLogs = this.getAuditLogs(1000);
    existingLogs.unshift(entry);
    
    // Keep only last 1000 entries
    const logsToKeep = existingLogs.slice(0, 1000);
    localStorage.setItem(this.auditKey, JSON.stringify(logsToKeep));
  }

  /**
   * Get user by ID
   */
  getUserById(userId: string): User | null {
    const users = this.getUsers();
    return users.find(u => u.id === userId) || null;
  }

  /**
   * Generate compliance report
   */
  generateComplianceReport(period: { start: string; end: string }): ComplianceReport {
    const users = this.getUsers();
    const auditLogs = this.getAuditLogs(1000);
    
    const periodStart = new Date(period.start);
    const periodEnd = new Date(period.end);
    
    const periodLogs = auditLogs.filter(log => {
      const logDate = new Date(log.timestamp);
      return logDate >= periodStart && logDate <= periodEnd;
    });

    const securityIncidents = periodLogs.filter(log => 
      log.riskLevel === 'high' || log.riskLevel === 'critical'
    ).length;

    const hipaaCompliantUsers = users.filter(u => u.hipaaTrainingCompleted).length;
    const dataRetentionCompliance = this.checkDataRetentionCompliance();

    const recommendations = this.generateRecommendations(users, auditLogs, securityIncidents);

    return {
      id: `report_${Date.now()}`,
      generatedAt: new Date().toISOString(),
      period,
      summary: {
        totalUsers: users.length,
        activeUsers: users.filter(u => u.status === 'active').length,
        hipaaCompliantUsers,
        auditLogEntries: periodLogs.length,
        securityIncidents,
        dataRetentionCompliance,
      },
      recommendations,
      status: this.determineComplianceStatus(users, securityIncidents, dataRetentionCompliance),
    };
  }

  /**
   * Check data retention compliance
   */
  private checkDataRetentionCompliance(): boolean {
    const settings = this.getOrganizationSettings();
    const auditLogs = this.getAuditLogs(1000);
    
    if (auditLogs.length === 0) return true;
    
    const oldestLog = auditLogs[auditLogs.length - 1];
    const oldestDate = new Date(oldestLog.timestamp);
    const retentionDate = new Date(Date.now() - (settings.dataRetentionDays * 24 * 60 * 60 * 1000));
    
    return oldestDate >= retentionDate;
  }

  /**
   * Generate recommendations
   */
  private generateRecommendations(users: User[], auditLogs: AuditLogEntry[], securityIncidents: number): string[] {
    const recommendations: string[] = [];
    
    const usersWithoutHipaa = users.filter(u => !u.hipaaTrainingCompleted);
    if (usersWithoutHipaa.length > 0) {
      recommendations.push(`${usersWithoutHipaa.length} users need to complete HIPAA training`);
    }
    
    const usersWithout2FA = users.filter(u => !u.twoFactorEnabled);
    if (usersWithout2FA.length > 0) {
      recommendations.push(`Enable two-factor authentication for ${usersWithout2FA.length} users`);
    }
    
    if (securityIncidents > 0) {
      recommendations.push(`Review ${securityIncidents} security incidents from this period`);
    }
    
    const oldPasswords = users.filter(u => {
      // Check if password is older than policy allows
      return false; // Simplified for demo
    });
    
    if (oldPasswords.length > 0) {
      recommendations.push(`${oldPasswords.length} users need to update their passwords`);
    }
    
    return recommendations;
  }

  /**
   * Determine compliance status
   */
  private determineComplianceStatus(users: User[], securityIncidents: number, dataRetentionCompliance: boolean): ComplianceReport['status'] {
    if (securityIncidents > 0) {
      return 'non_compliant';
    }
    
    if (!dataRetentionCompliance) {
      return 'requires_attention';
    }
    
    const hipaaCompliance = users.filter(u => u.hipaaTrainingCompleted).length / users.length;
    if (hipaaCompliance < 0.9) {
      return 'requires_attention';
    }
    
    return 'compliant';
  }

  /**
   * Get security dashboard data
   */
  getSecurityDashboard(): {
    totalUsers: number;
    activeUsers: number;
    hipaaCompliantUsers: number;
    twoFactorUsers: number;
    recentIncidents: number;
    auditLogsToday: number;
  } {
    const users = this.getUsers();
    const auditLogs = this.getAuditLogs(100);
    const today = new Date().toISOString().split('T')[0];
    
    return {
      totalUsers: users.length,
      activeUsers: users.filter(u => u.status === 'active').length,
      hipaaCompliantUsers: users.filter(u => u.hipaaTrainingCompleted).length,
      twoFactorUsers: users.filter(u => u.twoFactorEnabled).length,
      recentIncidents: auditLogs.filter(log => 
        log.riskLevel === 'high' || log.riskLevel === 'critical'
      ).length,
      auditLogsToday: auditLogs.filter(log => 
        log.timestamp.startsWith(today)
      ).length,
    };
  }

  /**
   * Export audit logs
   */
  exportAuditLogs(format: 'json' | 'csv' = 'json'): string {
    const logs = this.getAuditLogs(1000);
    
    if (format === 'csv') {
      const headers = ['Timestamp', 'User', 'Action', 'Resource', 'Success', 'Risk Level', 'IP Address'];
      const rows = logs.map(log => [
        log.timestamp,
        log.userName,
        log.action,
        log.resource,
        log.success,
        log.riskLevel,
        log.ipAddress,
      ]);
      
      return [headers, ...rows].map(row => row.join(',')).join('\n');
    }
    
    return JSON.stringify(logs, null, 2);
  }

  /**
   * Clear audit logs
   */
  clearAuditLogs(): void {
    localStorage.removeItem(this.auditKey);
    this.logAuditEvent('admin', 'clear_audit_logs', 'audit_logs', true, {}, 'high');
  }
}

// Export singleton instance
export const adminService = new AdminService();
