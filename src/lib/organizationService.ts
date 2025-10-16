/**
 * Organization Management Service
 * Multi-user organization support, team collaboration, and role management
 */

export interface Organization {
  id: string;
  name: string;
  type: 'hospital' | 'clinic' | 'nursing_school' | 'private_practice' | 'healthcare_system';
  domain: string;
  settings: {
    hipaaCompliant: boolean;
    dataRetentionDays: number;
    allowGuestAccess: boolean;
    requireTwoFactor: boolean;
    maxUsers: number;
    features: {
      voiceRecognition: boolean;
      aiGeneration: boolean;
      analytics: boolean;
      teamCollaboration: boolean;
      auditLogging: boolean;
    };
  };
  subscription: {
    plan: 'free' | 'professional' | 'enterprise' | 'custom';
    status: 'active' | 'suspended' | 'cancelled';
    billingCycle: 'monthly' | 'annually';
    seatsUsed: number;
    seatsTotal: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'owner' | 'admin' | 'supervisor' | 'nurse' | 'student' | 'instructor' | 'auditor';
  organizationId: string;
  department?: string;
  credentials?: string;
  permissions: string[];
  status: 'active' | 'inactive' | 'suspended' | 'pending';
  profile: {
    avatar?: string;
    phone?: string;
    timezone: string;
    language: string;
    preferences: {
      defaultTemplate: string;
      voiceSpeed: number;
      notifications: boolean;
      darkMode: boolean;
    };
  };
  stats: {
    notesCreated: number;
    timeSaved: number;
    lastLogin: Date;
    sessionsThisMonth: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface Team {
  id: string;
  name: string;
  organizationId: string;
  description?: string;
  members: Array<{
    userId: string;
    role: 'leader' | 'member' | 'observer';
    joinedAt: Date;
  }>;
  settings: {
    isPublic: boolean;
    allowMemberInvites: boolean;
    requireApproval: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface CollaborationSession {
  id: string;
  teamId: string;
  noteId: string;
  participants: Array<{
    userId: string;
    role: 'editor' | 'reviewer' | 'observer';
    joinedAt: Date;
    lastActivity: Date;
  }>;
  permissions: {
    allowEdit: boolean;
    allowComment: boolean;
    allowExport: boolean;
  };
  status: 'active' | 'completed' | 'archived';
  createdAt: Date;
  updatedAt: Date;
}

export interface OrganizationInvite {
  id: string;
  organizationId: string;
  email: string;
  role: string;
  invitedBy: string;
  status: 'pending' | 'accepted' | 'declined' | 'expired';
  expiresAt: Date;
  createdAt: Date;
}

export interface RolePermissions {
  [key: string]: {
    name: string;
    description: string;
    permissions: string[];
    level: number;
  };
}

class OrganizationService {
  private organizations: Organization[] = [];
  private users: User[] = [];
  private teams: Team[] = [];
  private collaborationSessions: CollaborationSession[] = [];
  private invites: OrganizationInvite[] = [];

  // Role definitions with permissions
  private rolePermissions: RolePermissions = {
    owner: {
      name: 'Organization Owner',
      description: 'Full access to organization and billing',
      permissions: ['*'], // All permissions
      level: 5
    },
    admin: {
      name: 'Administrator',
      description: 'Manage users, settings, and compliance',
      permissions: [
        'users.manage',
        'settings.manage',
        'compliance.view',
        'audit.view',
        'teams.manage',
        'analytics.view'
      ],
      level: 4
    },
    supervisor: {
      name: 'Supervisor',
      description: 'Oversee team activities and review notes',
      permissions: [
        'notes.view_all',
        'notes.review',
        'teams.manage_own',
        'analytics.view_team',
        'compliance.view'
      ],
      level: 3
    },
    nurse: {
      name: 'Nurse',
      description: 'Create and manage clinical notes',
      permissions: [
        'notes.create',
        'notes.edit_own',
        'notes.view_own',
        'voice.record',
        'ai.generate',
        'export.own'
      ],
      level: 2
    },
    instructor: {
      name: 'Instructor',
      description: 'Teach and evaluate student notes',
      permissions: [
        'notes.view_students',
        'notes.evaluate',
        'education.manage',
        'analytics.view_students'
      ],
      level: 2
    },
    student: {
      name: 'Student',
      description: 'Practice clinical documentation',
      permissions: [
        'notes.create_practice',
        'notes.view_own',
        'voice.record',
        'education.access'
      ],
      level: 1
    },
    auditor: {
      name: 'Auditor',
      description: 'Review compliance and audit logs',
      permissions: [
        'audit.view_all',
        'compliance.view_all',
        'reports.generate'
      ],
      level: 3
    }
  };

  constructor() {
    this.initializeSampleData();
  }

  /**
   * Initialize sample data for demonstration
   */
  private initializeSampleData(): void {
    // Sample organization
    const org: Organization = {
      id: 'org-1',
      name: 'General Hospital',
      type: 'hospital',
      domain: 'generalhospital.com',
      settings: {
        hipaaCompliant: true,
        dataRetentionDays: 365,
        allowGuestAccess: false,
        requireTwoFactor: true,
        maxUsers: 100,
        features: {
          voiceRecognition: true,
          aiGeneration: true,
          analytics: true,
          teamCollaboration: true,
          auditLogging: true
        }
      },
      subscription: {
        plan: 'enterprise',
        status: 'active',
        billingCycle: 'annually',
        seatsUsed: 5,
        seatsTotal: 100
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Sample users
    const users: User[] = [
      {
        id: 'user-1',
        email: 'admin@generalhospital.com',
        name: 'Dr. Sarah Johnson',
        role: 'admin',
        organizationId: 'org-1',
        department: 'Emergency Medicine',
        credentials: 'MD, FACEP',
        permissions: this.rolePermissions.admin.permissions,
        status: 'active',
        profile: {
          timezone: 'America/New_York',
          language: 'en-US',
          preferences: {
            defaultTemplate: 'SOAP',
            voiceSpeed: 1.0,
            notifications: true,
            darkMode: false
          }
        },
        stats: {
          notesCreated: 245,
          timeSaved: 42.5,
          lastLogin: new Date(),
          sessionsThisMonth: 28
        },
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'user-2',
        email: 'nurse.mike@generalhospital.com',
        name: 'Nurse Mike Chen',
        role: 'nurse',
        organizationId: 'org-1',
        department: 'ICU',
        credentials: 'RN, BSN',
        permissions: this.rolePermissions.nurse.permissions,
        status: 'active',
        profile: {
          timezone: 'America/New_York',
          language: 'en-US',
          preferences: {
            defaultTemplate: 'SBAR',
            voiceSpeed: 1.2,
            notifications: true,
            darkMode: true
          }
        },
        stats: {
          notesCreated: 189,
          timeSaved: 31.2,
          lastLogin: new Date(),
          sessionsThisMonth: 35
        },
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    // Sample team
    const team: Team = {
      id: 'team-1',
      name: 'Emergency Department',
      organizationId: 'org-1',
      description: 'Emergency medicine team for night shifts',
      members: [
        {
          userId: 'user-1',
          role: 'leader',
          joinedAt: new Date()
        },
        {
          userId: 'user-2',
          role: 'member',
          joinedAt: new Date()
        }
      ],
      settings: {
        isPublic: false,
        allowMemberInvites: true,
        requireApproval: true
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.organizations.push(org);
    this.users.push(...users);
    this.teams.push(team);
  }

  /**
   * Get organization by ID
   */
  public getOrganization(organizationId: string): Organization | null {
    return this.organizations.find(org => org.id === organizationId) || null;
  }

  /**
   * Get all organizations (for admin view)
   */
  public getOrganizations(): Organization[] {
    return [...this.organizations];
  }

  /**
   * Create new organization
   */
  public async createOrganization(orgData: Omit<Organization, 'id' | 'createdAt' | 'updatedAt'>): Promise<Organization> {
    const organization: Organization = {
      ...orgData,
      id: this.generateId(),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.organizations.push(organization);
    return organization;
  }

  /**
   * Update organization
   */
  public async updateOrganization(organizationId: string, updates: Partial<Organization>): Promise<Organization | null> {
    const index = this.organizations.findIndex(org => org.id === organizationId);
    if (index === -1) return null;

    this.organizations[index] = {
      ...this.organizations[index],
      ...updates,
      updatedAt: new Date()
    };

    return this.organizations[index];
  }

  /**
   * Get users by organization
   */
  public getUsersByOrganization(organizationId: string): User[] {
    return this.users.filter(user => user.organizationId === organizationId);
  }

  /**
   * Get user by ID
   */
  public getUser(userId: string): User | null {
    return this.users.find(user => user.id === userId) || null;
  }

  /**
   * Get user by email
   */
  public getUserByEmail(email: string): User | null {
    return this.users.find(user => user.email === email) || null;
  }

  /**
   * Create new user
   */
  public async createUser(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    const user: User = {
      ...userData,
      id: this.generateId(),
      permissions: this.rolePermissions[userData.role]?.permissions || [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.users.push(user);
    return user;
  }

  /**
   * Update user
   */
  public async updateUser(userId: string, updates: Partial<User>): Promise<User | null> {
    const index = this.users.findIndex(user => user.id === userId);
    if (index === -1) return null;

    this.users[index] = {
      ...this.users[index],
      ...updates,
      updatedAt: new Date()
    };

    return this.users[index];
  }

  /**
   * Check if user has permission
   */
  public hasPermission(userId: string, permission: string): boolean {
    const user = this.getUser(userId);
    if (!user) return false;

    // Owner has all permissions
    if (user.role === 'owner') return true;

    return user.permissions.includes(permission) || user.permissions.includes('*');
  }

  /**
   * Get teams by organization
   */
  public getTeamsByOrganization(organizationId: string): Team[] {
    return this.teams.filter(team => team.organizationId === organizationId);
  }

  /**
   * Create team
   */
  public async createTeam(teamData: Omit<Team, 'id' | 'createdAt' | 'updatedAt'>): Promise<Team> {
    const team: Team = {
      ...teamData,
      id: this.generateId(),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.teams.push(team);
    return team;
  }

  /**
   * Add member to team
   */
  public async addTeamMember(teamId: string, userId: string, role: 'leader' | 'member' | 'observer' = 'member'): Promise<boolean> {
    const team = this.teams.find(t => t.id === teamId);
    if (!team) return false;

    const existingMember = team.members.find(m => m.userId === userId);
    if (existingMember) return false;

    team.members.push({
      userId,
      role,
      joinedAt: new Date()
    });

    team.updatedAt = new Date();
    return true;
  }

  /**
   * Remove member from team
   */
  public async removeTeamMember(teamId: string, userId: string): Promise<boolean> {
    const team = this.teams.find(t => t.id === teamId);
    if (!team) return false;

    const index = team.members.findIndex(m => m.userId === userId);
    if (index === -1) return false;

    team.members.splice(index, 1);
    team.updatedAt = new Date();
    return true;
  }

  /**
   * Create organization invite
   */
  public async createInvite(inviteData: {
    organizationId: string;
    email: string;
    role: string;
    invitedBy: string;
  }): Promise<OrganizationInvite> {
    const invite: OrganizationInvite = {
      id: this.generateId(),
      ...inviteData,
      status: 'pending',
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      createdAt: new Date()
    };

    this.invites.push(invite);
    return invite;
  }

  /**
   * Accept organization invite
   */
  public async acceptInvite(inviteId: string): Promise<boolean> {
    const invite = this.invites.find(inv => inv.id === inviteId);
    if (!invite || invite.status !== 'pending' || invite.expiresAt < new Date()) {
      return false;
    }

    invite.status = 'accepted';

    // Create user account
    await this.createUser({
      email: invite.email,
      name: invite.email.split('@')[0], // Use email prefix as name
      role: invite.role as any,
      organizationId: invite.organizationId,
      permissions: this.rolePermissions[invite.role]?.permissions || [],
      status: 'active',
      profile: {
        timezone: 'America/New_York',
        language: 'en-US',
        preferences: {
          defaultTemplate: 'SOAP',
          voiceSpeed: 1.0,
          notifications: true,
          darkMode: false
        }
      },
      stats: {
        notesCreated: 0,
        timeSaved: 0,
        lastLogin: new Date(),
        sessionsThisMonth: 0
      }
    });

    return true;
  }

  /**
   * Get organization statistics
   */
  public getOrganizationStats(organizationId: string): {
    totalUsers: number;
    activeUsers: number;
    totalNotes: number;
    totalTeams: number;
    storageUsed: number;
    complianceScore: number;
  } {
    const orgUsers = this.getUsersByOrganization(organizationId);
    const orgTeams = this.getTeamsByOrganization(organizationId);

    return {
      totalUsers: orgUsers.length,
      activeUsers: orgUsers.filter(u => u.status === 'active').length,
      totalNotes: orgUsers.reduce((sum, user) => sum + user.stats.notesCreated, 0),
      totalTeams: orgTeams.length,
      storageUsed: orgUsers.reduce((sum, user) => sum + user.stats.notesCreated * 0.5, 0), // Estimate
      complianceScore: 95 // Mock score
    };
  }

  /**
   * Get role permissions
   */
  public getRolePermissions(): RolePermissions {
    return { ...this.rolePermissions };
  }

  /**
   * Get user's organization
   */
  public getUserOrganization(userId: string): Organization | null {
    const user = this.getUser(userId);
    if (!user) return null;

    return this.getOrganization(user.organizationId);
  }

  /**
   * Generate unique ID
   */
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}

// Export singleton instance
export const organizationService = new OrganizationService();

// Export types
export type { Organization, User, Team, CollaborationSession, OrganizationInvite, RolePermissions };
