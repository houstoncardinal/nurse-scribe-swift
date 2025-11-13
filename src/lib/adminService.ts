/**
 * Admin Service - Supabase backed administration utilities
 */

import {
  supabaseService,
  type Organization as SupOrganization,
  type UserProfile,
  type Department,
  type NoteMetadata,
  type AnalyticsEvent,
  type AuditLog
} from './supabase';
import { organizationService } from './organizationService';

export interface AdminOrganizationSummary {
  id: string;
  name: string;
  type: string;
  hipaaCompliant: boolean;
  settings: Record<string, any>;
}

export type AdminUserRole = 'Administrator' | 'Clinician' | 'Educator' | 'Auditor';
export type AdminUserStatus = 'active' | 'invited' | 'suspended';

export interface AdminDashboardUser {
  id: string;
  name: string;
  email: string;
  role: AdminUserRole;
  status: AdminUserStatus;
  lastActiveISO: string;
  notesThisWeek: number;
  teamIds: string[];
  teamNames: string[];
}

export interface AdminTeamOverview {
  id: string;
  name: string;
  code: string;
  hipaaLevel: Department['hipaa_level'];
  memberCount: number;
}

export interface AdminAuditLogEntry {
  id: string;
  event: string;
  actor: string;
  role: AdminUserRole | 'Service Account';
  severity: 'low' | 'medium' | 'high';
  timestampISO: string;
  details: string;
  resolved: boolean;
}

export interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  totalNotes: number;
  notesToday: number;
  avgAccuracy: number;
  timeSaved: number;
  systemHealth: number;
  storageUsed: number;
  storageLimit: number;
}

export interface NoteRecord {
  id: string;
  patient: string;
  mrn: string;
  template: string;
  author: string;
  status: 'draft' | 'completed' | 'reviewed' | 'archived';
  createdAt: Date;
  content: string;
  metadata?: NoteMetadata;
}

export interface AnalyticsChartData {
  date: string;
  notesCreated: number;
  usersActive: number;
  accuracyRate: number;
  timeSaved: number;
}

export interface AdminDashboardData {
  organization: AdminOrganizationSummary | null;
  stats: AdminStats | null;
  analytics: AnalyticsChartData[];
  notes: NoteRecord[];
  auditLogs: AdminAuditLogEntry[];
  users: AdminDashboardUser[];
  teams: AdminTeamOverview[];
}

const ROLE_MAP: Record<UserProfile['role'], AdminUserRole> = {
  admin: 'Administrator',
  nurse: 'Clinician',
  instructor: 'Educator',
  student: 'Clinician',
  auditor: 'Auditor'
};

const STATUS_MAP: Record<NonNullable<UserProfile['status']>, AdminUserStatus> = {
  active: 'active',
  invited: 'invited',
  suspended: 'suspended'
};

const ROLE_REVERSE_MAP: Record<AdminUserRole, UserProfile['role']> = {
  Administrator: 'admin',
  Clinician: 'nurse',
  Educator: 'instructor',
  Auditor: 'auditor'
};

const STATUS_REVERSE_MAP: Record<AdminUserStatus, NonNullable<UserProfile['status']>> = {
  active: 'active',
  invited: 'invited',
  suspended: 'suspended'
};

class AdminService {
  async listOrganizations(): Promise<AdminOrganizationSummary[]> {
    if (supabaseService.isAvailable()) {
      const orgs = await supabaseService.getOrganizations();
      if (orgs.length > 0) {
        return orgs.map(org => this.mapSupOrganization(org));
      }
    }

    return organizationService.getOrganizations().map(org => ({
      id: org.id,
      name: org.name,
      type: org.type,
      hipaaCompliant: org.settings.hipaaCompliant,
      settings: org.settings
    }));
  }

  async getDashboardData(organizationId: string, analyticsRange: number): Promise<AdminDashboardData> {
    const [organization, stats, analytics, notes, usersAndTeams, auditLogs] = await Promise.all([
      this.getOrganizationSummary(organizationId),
      this.getDashboardStats(organizationId),
      this.getAnalyticsData(organizationId, analyticsRange),
      this.getOrganizationNotes(organizationId, 200),
      this.getOrganizationUsersAndTeams(organizationId),
      this.getAuditLogs(organizationId, 60)
    ]);

    const userLookup = new Map(usersAndTeams.users.map(user => [user.id, user]));
    const mappedAuditLogs = this.mapAuditLogs(auditLogs.raw, userLookup);

    return {
      organization,
      stats,
      analytics,
      notes,
      auditLogs: mappedAuditLogs,
      users: usersAndTeams.users,
      teams: usersAndTeams.teams
    };
  }

  async getDashboardStats(organizationId: string): Promise<AdminStats | null> {
    if (supabaseService.isAvailable()) {
      try {
        const [profiles, notes, health] = await Promise.all([
          supabaseService.getUserProfilesByOrganization(organizationId),
          supabaseService.getOrganizationNoteMetadata(organizationId, 500),
          supabaseService.healthCheck().catch(() => ({ status: 'healthy' as const, latency: 0 }))
        ]);

        const totalUsers = profiles.length;
        const now = Date.now();
        const activeUsers = profiles.filter(profile => {
          const lastLogin = profile.last_login ? new Date(profile.last_login) : null;
          return lastLogin ? now - lastLogin.getTime() <= 24 * 60 * 60 * 1000 : false;
        }).length;

        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);

        const notesToday = notes.filter(note => new Date(note.created_at) >= startOfToday).length;
        const totalNotes = notes.length;
        const avgAccuracy =
          notes.length > 0
            ? Math.round(
                (notes.reduce((sum, note) => sum + Number(note.confidence_score ?? 0), 0) / notes.length) *
                  10000
              ) / 100
            : 99.0;
        const timeSaved =
          Math.round(
            (notes.reduce((sum, note) => sum + Number(note.time_saved_minutes ?? 0), 0) / 60) * 10
          ) / 10;

        const systemHealth = health.status === 'healthy' ? 99 - Math.min(health.latency / 10, 5) : 95;
        const storageUsed = Math.round(notes.length * 0.02 * 10) / 10;

        return {
          totalUsers,
          activeUsers,
          totalNotes,
          notesToday,
          avgAccuracy,
          timeSaved,
          systemHealth,
          storageUsed,
          storageLimit: 10
        };
      } catch (error) {
        console.error('Failed to compute Supabase dashboard stats:', error);
      }
    }

    const orgStats = organizationService.getOrganizationStats(organizationId);
    return {
      totalUsers: orgStats.totalUsers,
      activeUsers: Math.floor(orgStats.totalUsers * 0.7),
      totalNotes: orgStats.totalNotes,
      notesToday: Math.floor(orgStats.totalNotes * 0.05),
      avgAccuracy: 99.2,
      timeSaved: Math.round(orgStats.totalNotes * 0.25 * 10) / 10,
      systemHealth: 98.5,
      storageUsed: Math.round(orgStats.totalNotes * 0.015 * 10) / 10,
      storageLimit: 10
    };
  }

  async getOrganizationNotes(organizationId: string, limit: number = 100): Promise<NoteRecord[]> {
    if (supabaseService.isAvailable()) {
      try {
        const [notes, users] = await Promise.all([
          supabaseService.getOrganizationNoteMetadata(organizationId, limit),
          supabaseService.getUserProfilesByOrganization(organizationId)
        ]);

        const userLookup = new Map(users.map(user => [user.id, user.name]));

        return notes.map(note => ({
          id: note.id,
          patient: 'Protected Health Information',
          mrn: `MRN-${note.id.slice(0, 6).toUpperCase()}`,
          template: note.template,
          author: userLookup.get(note.user_id) ?? 'Unknown',
          status: this.determineNoteStatus(note),
          createdAt: new Date(note.created_at),
          content: 'Note content stored securely in Supabase.',
          metadata: note
        }));
      } catch (error) {
        console.error('Failed to load Supabase note metadata:', error);
      }
    }

    const sampleNotes = organizationService.getUsersByOrganization(organizationId).flatMap(user =>
      Array.from({ length: 3 }).map((_, index) => ({
        id: `${user.id}-note-${index}`,
        patient: 'Sample Patient',
        mrn: `MRN-${index}`,
        template: 'SOAP',
        author: user.name,
        status: 'completed' as const,
        createdAt: new Date(Date.now() - index * 3600 * 1000),
        content: 'Sample note content',
        metadata: undefined
      }))
    );
    return sampleNotes.slice(0, limit);
  }

  async getAnalyticsData(organizationId: string, days: number): Promise<AnalyticsChartData[]> {
    if (supabaseService.isAvailable()) {
      try {
        const [notes, events] = await Promise.all([
          supabaseService.getOrganizationNoteMetadata(organizationId, 1000),
          supabaseService.getAnalyticsEventsByOrganization(
            organizationId,
            new Date(Date.now() - days * 24 * 60 * 60 * 1000)
          )
        ]);

        const chartData: AnalyticsChartData[] = [];
        const today = new Date();

        for (let i = days - 1; i >= 0; i--) {
          const dayStart = new Date(today);
          dayStart.setHours(0, 0, 0, 0);
          dayStart.setDate(dayStart.getDate() - i);
          const dayEnd = new Date(dayStart);
          dayEnd.setHours(23, 59, 59, 999);

          const dayNotes = notes.filter(meta => {
            const created = new Date(meta.created_at);
            return created >= dayStart && created <= dayEnd;
          });

          const dayEvents = events.filter(event => {
            const eventDate = new Date(event.timestamp);
            return eventDate >= dayStart && eventDate <= dayEnd;
          });

          const uniqueUsers = new Set(dayEvents.map(event => event.user_id)).size;
          const avgAccuracy =
            dayNotes.length > 0
              ? Math.round(
                  (dayNotes.reduce((sum, note) => sum + Number(note.confidence_score ?? 0), 0) / dayNotes.length) *
                    10000
                ) / 100
              : 99.0;
          const timeSaved =
            Math.round(
              (dayNotes.reduce((sum, note) => sum + Number(note.time_saved_minutes ?? 0), 0) / 60) * 10
            ) / 10;

          chartData.push({
            date: dayStart.toISOString().split('T')[0],
            notesCreated: dayNotes.length,
            usersActive: uniqueUsers,
            accuracyRate: avgAccuracy,
            timeSaved
          });
        }

        return chartData;
      } catch (error) {
        console.error('Failed to compute Supabase analytics:', error);
      }
    }

    return this.getMockAnalyticsData(days);
  }

  async getAuditLogs(organizationId: string, limit: number = 50): Promise<{ raw: AuditLog[] }> {
    if (supabaseService.isAvailable()) {
      try {
        const logs = await supabaseService.getOrganizationAuditLogs(organizationId, limit);
        return { raw: logs };
      } catch (error) {
        console.error('Failed to load Supabase audit logs:', error);
      }
    }

    const sampleLogs = organizationService
      .getUsersByOrganization(organizationId)
      .slice(0, limit)
      .map((user, index) => ({
        id: `audit-${index}`,
        user_id: user.id,
        organization_id: organizationId,
        action: 'sample_event',
        resource: 'sample_resource',
        ip_address: null,
        user_agent: 'Web',
        success: true,
        details: { message: 'Sample audit event' },
        risk_level: 'low' as const,
        timestamp: new Date(Date.now() - index * 15 * 60 * 1000).toISOString()
      }));

    return { raw: sampleLogs };
  }

  async updateUserRole(userId: string, role: AdminUserRole, organizationId?: string): Promise<void> {
    if (supabaseService.isAvailable()) {
      const supRole = ROLE_REVERSE_MAP[role] ?? 'nurse';
      await supabaseService.updateUserProfile(userId, { role: supRole });
      await supabaseService.storeAuditLog({
        user_id: 'admin',
        organization_id: organizationId ?? 'org-1',
        action: 'update_user_role',
        resource: userId,
        success: true,
        details: { role: supRole },
        risk_level: 'low'
      });
      return;
    }

    await organizationService.updateUser(userId, {
      role: role === 'Administrator' ? 'admin' : role === 'Educator' ? 'instructor' : 'nurse'
    });
  }

  async updateUserStatus(userId: string, status: AdminUserStatus, organizationId?: string): Promise<void> {
    if (supabaseService.isAvailable()) {
      const supStatus = STATUS_REVERSE_MAP[status] ?? 'invited';
      await supabaseService.updateUserProfile(userId, { status: supStatus });
      await supabaseService.storeAuditLog({
        user_id: 'admin',
        organization_id: organizationId ?? 'org-1',
        action: 'update_user_status',
        resource: userId,
        success: true,
        details: { status: supStatus },
        risk_level: supStatus === 'suspended' ? 'medium' : 'low'
      });
      return;
    }

    await organizationService.updateUser(userId, { status: status === 'active' ? 'active' : 'suspended' });
  }

  async createUserInvite(organizationId: string, email: string, name: string, role: AdminUserRole): Promise<void> {
    if (supabaseService.isAvailable()) {
      await supabaseService.createUserProfile({
        organization_id: organizationId,
        email,
        name,
        role: ROLE_REVERSE_MAP[role] ?? 'nurse',
        status: 'inactive'
      });
      await supabaseService.storeAuditLog({
        user_id: 'admin',
        organization_id: organizationId,
        action: 'create_invite',
        resource: email,
        success: true,
        details: { name, role },
        risk_level: 'low'
      });
      return;
    }

    await organizationService.createUser({
      organizationId,
      email,
      name,
      role: role === 'Administrator' ? 'admin' : 'nurse',
      permissions: [],
      status: 'pending',
      profile: {
        timezone: 'UTC',
        language: 'en-US',
        preferences: {
          defaultTemplate: 'SOAP',
          voiceSpeed: 1,
          notifications: true,
          darkMode: false
        }
      },
      stats: {
        notesCreated: 0,
        timeSaved: 0,
        lastLogin: new Date(0),
        sessionsThisMonth: 0
      }
    });
  }

  async resetUserUsage(userId: string, organizationId?: string): Promise<void> {
    if (supabaseService.isAvailable()) {
      await supabaseService.storeAnalyticsEvent({
        user_id: userId,
        organization_id: organizationId ?? 'org-1',
        event_type: 'admin_reset_usage',
        event_data: { userId }
      });
      return;
    }
  }

  async updateOrganizationSecurity(organizationId: string, patch: Partial<{ hipaaCompliant: boolean; settings: Record<string, any> }>): Promise<void> {
    if (supabaseService.isAvailable()) {
      await supabaseService.updateOrganization(organizationId, {
        hipaa_compliant: patch.hipaaCompliant,
        settings: patch.settings
      });
      return;
    }

    await organizationService.updateOrganization(organizationId, {
      settings: {
        ...organizationService.getOrganization(organizationId)?.settings,
        ...patch.settings
      }
    });
  }

  async setUserTeams(userId: string, teamIds: string[]): Promise<void> {
    if (supabaseService.isAvailable()) {
      await supabaseService.setUserDepartments(userId, teamIds);
      return;
    }
  }

  async createTeam(organizationId: string, name: string, code: string, hipaaLevel: Department['hipaa_level']): Promise<void> {
    if (supabaseService.isAvailable()) {
      await supabaseService.createDepartment(organizationId, { name, code, hipaa_level: hipaaLevel });
      return;
    }

    await organizationService.createTeam({
      organizationId,
      name,
      description: '',
      members: [],
      settings: {
        isPublic: false,
        allowMemberInvites: true,
        requireApproval: true
      }
    });
  }

  async logServiceEvent(organizationId: string, serviceName: string): Promise<void> {
    if (supabaseService.isAvailable()) {
      await supabaseService.storeAnalyticsEvent({
        user_id: 'admin',
        organization_id: organizationId,
        event_type: 'service_refresh',
        event_data: { service: serviceName }
      });
    }
  }

  async updateNoteStatus(noteId: string, _status: NoteRecord['status'], organizationId?: string): Promise<boolean> {
    // Note metadata schema does not currently store status.
    await supabaseService.storeAuditLog({
      user_id: 'admin',
      organization_id: organizationId ?? 'org-1',
      action: 'update_note_status',
      resource: noteId,
      success: false,
      details: { message: 'Status updates require schema migration' },
      risk_level: 'low'
    });
    return false;
  }

  private async getOrganizationSummary(organizationId: string): Promise<AdminOrganizationSummary | null> {
    if (supabaseService.isAvailable()) {
      const org = await supabaseService.getOrganizationById(organizationId);
      return org ? this.mapSupOrganization(org) : null;
    }

    const fallback = organizationService.getOrganization(organizationId);
    return fallback
      ? {
          id: fallback.id,
          name: fallback.name,
          type: fallback.type,
          hipaaCompliant: fallback.settings.hipaaCompliant,
          settings: fallback.settings
        }
      : null;
  }

  private async getOrganizationUsersAndTeams(organizationId: string): Promise<{ users: AdminDashboardUser[]; teams: AdminTeamOverview[] }> {
    if (supabaseService.isAvailable()) {
      try {
        const [profiles, departments, links, notes] = await Promise.all([
          supabaseService.getUserProfilesByOrganization(organizationId),
          supabaseService.getDepartments(organizationId),
          supabaseService.getUserDepartmentLinks(organizationId),
          supabaseService.getOrganizationNoteMetadata(organizationId, 500)
        ]);

        const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        const noteCounts = new Map<string, { week: number }>();
        notes.forEach(note => {
          const created = new Date(note.created_at);
          const stats = noteCounts.get(note.user_id) || { week: 0 };
          if (created >= weekAgo) {
            stats.week += 1;
          }
          noteCounts.set(note.user_id, stats);
        });

        const departmentMap = new Map<string, Department>(departments.map(dept => [dept.id, dept]));

        const userTeamIds = new Map<string, string[]>();
        links.forEach(link => {
          if (!userTeamIds.has(link.user_id)) {
            userTeamIds.set(link.user_id, []);
          }
          userTeamIds.get(link.user_id)!.push(link.department_id);
        });

        const users = profiles.map(profile => {
          const teams = userTeamIds.get(profile.id) ?? [];
          const teamNames = teams
            .map(teamId => departmentMap.get(teamId)?.name)
            .filter((name): name is string => Boolean(name));

          return {
            id: profile.id,
            name: profile.name,
            email: profile.email,
            role: ROLE_MAP[profile.role] ?? 'Clinician',
            status: STATUS_MAP[profile.status] ?? 'invited',
            lastActiveISO: (profile.last_login ?? profile.updated_at ?? profile.created_at) ?? new Date().toISOString(),
            notesThisWeek: noteCounts.get(profile.id)?.week ?? 0,
            teamIds: teams,
            teamNames
          };
        });

        const teams = departments.map(dept => ({
          id: dept.id,
          name: dept.name,
          code: dept.code,
          hipaaLevel: dept.hipaa_level,
          memberCount: links.filter(link => link.department_id === dept.id).length
        }));

        return { users, teams };
      } catch (error) {
        console.error('Failed to load Supabase users and teams:', error);
      }
    }

    const fallbackUsers = organizationService.getUsersByOrganization(organizationId);
    const fallbackTeams = organizationService.getTeamsByOrganization(organizationId);

    const users: AdminDashboardUser[] = fallbackUsers.map(user => ({
      id: user.id,
      name: user.name,
      email: user.email,
      role: (user.role === 'admin' ? 'Administrator' : 'Clinician') as AdminUserRole,
      status: (user.status === 'active' ? 'active' : 'invited') as AdminUserStatus,
      lastActiveISO: user.stats.lastLogin.toISOString(),
      notesThisWeek: user.stats.notesCreated,
      teamIds: [],
      teamNames: []
    }));

    const teams = fallbackTeams.map(team => ({
      id: team.id,
      name: team.name,
      code: team.name.toUpperCase(),
      hipaaLevel: 'full' as const,
      memberCount: team.members.length
    }));

    return { users, teams };
  }

  private mapAuditLogs(logs: AuditLog[], userLookup: Map<string, AdminDashboardUser>): AdminAuditLogEntry[] {
    return logs.map(log => {
      const user = log.user_id ? userLookup.get(log.user_id) : undefined;
      const severity = log.risk_level === 'high' || log.risk_level === 'critical' ? 'high' : log.risk_level === 'medium' ? 'medium' : 'low';
      return {
        id: log.id,
        event: log.action.replace(/_/g, ' ').toUpperCase(),
        actor: user?.name ?? log.user_id ?? 'System',
        role: user?.role ?? 'Service Account',
        severity,
        timestampISO: log.timestamp,
        details: typeof log.details === 'string' ? log.details : JSON.stringify(log.details ?? {}),
        resolved: false
      };
    });
  }

  private determineNoteStatus(metadata: NoteMetadata): NoteRecord['status'] {
    if (Number(metadata.confidence_score) < 0.75) return 'draft';
    if (Number(metadata.confidence_score) > 0.97) return 'reviewed';
    return 'completed';
  }

  private mapSupOrganization(org: SupOrganization): AdminOrganizationSummary {
    return {
      id: org.id,
      name: org.name,
      type: org.type,
      hipaaCompliant: Boolean(org.hipaa_compliant),
      settings: org.settings || {}
    };
  }

  private getMockAnalyticsData(days: number): AnalyticsChartData[] {
    const data: AnalyticsChartData[] = [];
    const today = new Date();

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);

      data.push({
        date: date.toISOString().split('T')[0],
        notesCreated: Math.floor(Math.random() * 30) + 35,
        usersActive: Math.floor(Math.random() * 10) + 20,
        accuracyRate: Math.floor(Math.random() * 2) + 98,
        timeSaved: Math.floor(Math.random() * 5) + 10
      });
    }

    return data;
  }
}

export const adminService = new AdminService();
