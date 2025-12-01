/**
 * Team Management Service
 * Enterprise team features for hospitals and clinics
 */

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'nurse' | 'nurse_manager' | 'doctor' | 'admin';
  credentials: string;
  department: string;
  status: 'active' | 'inactive' | 'pending';
  permissions: TeamPermissions;
  joinedAt: Date;
  lastActive?: Date;
  stats: {
    notesCreated: number;
    avgNoteTime: number;
    accuracy: number;
  };
}

export interface TeamPermissions {
  canCreateNotes: boolean;
  canEditNotes: boolean;
  canDeleteNotes: boolean;
  canViewTeamNotes: boolean;
  canExportNotes: boolean;
  canManageTeam: boolean;
  canViewAnalytics: boolean;
  canConfigureEHR: boolean;
}

export interface Team {
  id: string;
  name: string;
  hospital: string;
  department: string;
  type: 'unit' | 'department' | 'organization';
  license: {
    type: 'trial' | 'basic' | 'professional' | 'enterprise';
    seats: number;
    usedSeats: number;
    expiresAt: Date;
    features: string[];
  };
  members: TeamMember[];
  settings: {
    requireApproval: boolean;
    allowGuestAccess: boolean;
    enforceTemplates: boolean;
    auditLevel: 'basic' | 'detailed' | 'full';
  };
  createdAt: Date;
}

export interface TeamInvite {
  id: string;
  teamId: string;
  email: string;
  role: TeamMember['role'];
  invitedBy: string;
  expiresAt: Date;
  status: 'pending' | 'accepted' | 'expired';
}

class TeamManagementService {
  private currentTeam: Team | null = null;
  private teams: Map<string, Team> = new Map();
  private invites: Map<string, TeamInvite> = new Map();

  constructor() {
    this.loadTeams();
  }

  /**
   * Create new team
   */
  public async createTeam(config: {
    name: string;
    hospital: string;
    department: string;
    type: Team['type'];
    license: Team['license'];
    adminEmail: string;
  }): Promise<Team> {
    const teamId = `team-${Date.now()}`;
    
    const team: Team = {
      id: teamId,
      name: config.name,
      hospital: config.hospital,
      department: config.department,
      type: config.type,
      license: config.license,
      members: [],
      settings: {
        requireApproval: true,
        allowGuestAccess: false,
        enforceTemplates: false,
        auditLevel: 'detailed'
      },
      createdAt: new Date()
    };

    this.teams.set(teamId, team);
    this.currentTeam = team;
    this.saveTeams();

    return team;
  }

  /**
   * Add team member
   */
  public async addMember(teamId: string, member: Omit<TeamMember, 'id' | 'joinedAt' | 'stats'>): Promise<TeamMember> {
    const team = this.teams.get(teamId);
    if (!team) throw new Error('Team not found');

    if (team.members.length >= team.license.seats) {
      throw new Error('Team is at maximum capacity');
    }

    const newMember: TeamMember = {
      ...member,
      id: `member-${Date.now()}`,
      joinedAt: new Date(),
      stats: {
        notesCreated: 0,
        avgNoteTime: 0,
        accuracy: 99.0
      }
    };

    team.members.push(newMember);
    team.license.usedSeats++;
    this.saveTeams();

    return newMember;
  }

  /**
   * Send team invite
   */
  public async inviteMember(teamId: string, config: {
    email: string;
    role: TeamMember['role'];
    invitedBy: string;
  }): Promise<TeamInvite> {
    const team = this.teams.get(teamId);
    if (!team) throw new Error('Team not found');

    const inviteId = `invite-${Date.now()}`;
    const invite: TeamInvite = {
      id: inviteId,
      teamId,
      email: config.email,
      role: config.role,
      invitedBy: config.invitedBy,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      status: 'pending'
    };

    this.invites.set(inviteId, invite);
    this.saveInvites();

    // In production, would send email
    console.log(`📧 Invite sent to ${config.email}`);

    return invite;
  }

  /**
   * Accept invite
   */
  public async acceptInvite(inviteId: string, memberInfo: {
    name: string;
    credentials: string;
    department: string;
  }): Promise<TeamMember> {
    const invite = this.invites.get(inviteId);
    if (!invite) throw new Error('Invite not found');

    if (invite.status !== 'pending') {
      throw new Error('Invite already used or expired');
    }

    if (new Date() > invite.expiresAt) {
      invite.status = 'expired';
      this.saveInvites();
      throw new Error('Invite expired');
    }

    const member = await this.addMember(invite.teamId, {
      name: memberInfo.name,
      email: invite.email,
      role: invite.role,
      credentials: memberInfo.credentials,
      department: memberInfo.department,
      status: 'active',
      permissions: this.getDefaultPermissions(invite.role)
    });

    invite.status = 'accepted';
    this.saveInvites();

    return member;
  }

  /**
   * Update member permissions
   */
  public updateMemberPermissions(teamId: string, memberId: string, permissions: Partial<TeamPermissions>): boolean {
    const team = this.teams.get(teamId);
    if (!team) return false;

    const member = team.members.find(m => m.id === memberId);
    if (!member) return false;

    member.permissions = { ...member.permissions, ...permissions };
    this.saveTeams();
    return true;
  }

  /**
   * Remove team member
   */
  public removeMember(teamId: string, memberId: string): boolean {
    const team = this.teams.get(teamId);
    if (!team) return false;

    const index = team.members.findIndex(m => m.id === memberId);
    if (index === -1) return false;

    team.members.splice(index, 1);
    team.license.usedSeats--;
    this.saveTeams();
    return true;
  }

  /**
   * Get team members
   */
  public getTeamMembers(teamId: string): TeamMember[] {
    const team = this.teams.get(teamId);
    return team?.members || [];
  }

  /**
   * Get team statistics
   */
  public getTeamStats(teamId: string): {
    totalMembers: number;
    activeMembers: number;
    totalNotes: number;
    avgAccuracy: number;
    avgNoteTime: number;
  } {
    const team = this.teams.get(teamId);
    if (!team) {
      return {
        totalMembers: 0,
        activeMembers: 0,
        totalNotes: 0,
        avgAccuracy: 0,
        avgNoteTime: 0
      };
    }

    const activeMembers = team.members.filter(m => m.status === 'active');
    const totalNotes = team.members.reduce((sum, m) => sum + m.stats.notesCreated, 0);
    const avgAccuracy = team.members.reduce((sum, m) => sum + m.stats.accuracy, 0) / team.members.length || 0;
    const avgNoteTime = team.members.reduce((sum, m) => sum + m.stats.avgNoteTime, 0) / team.members.length || 0;

    return {
      totalMembers: team.members.length,
      activeMembers: activeMembers.length,
      totalNotes,
      avgAccuracy,
      avgNoteTime
    };
  }

  /**
   * Get current team
   */
  public getCurrentTeam(): Team | null {
    return this.currentTeam;
  }

  /**
   * Set current team
   */
  public setCurrentTeam(teamId: string): boolean {
    const team = this.teams.get(teamId);
    if (team) {
      this.currentTeam = team;
      return true;
    }
    return false;
  }

  /**
   * Get default permissions based on role
   */
  private getDefaultPermissions(role: TeamMember['role']): TeamPermissions {
    switch (role) {
      case 'admin':
        return {
          canCreateNotes: true,
          canEditNotes: true,
          canDeleteNotes: true,
          canViewTeamNotes: true,
          canExportNotes: true,
          canManageTeam: true,
          canViewAnalytics: true,
          canConfigureEHR: true
        };
      case 'nurse_manager':
        return {
          canCreateNotes: true,
          canEditNotes: true,
          canDeleteNotes: true,
          canViewTeamNotes: true,
          canExportNotes: true,
          canManageTeam: true,
          canViewAnalytics: true,
          canConfigureEHR: false
        };
      case 'doctor':
      case 'nurse':
      default:
        return {
          canCreateNotes: true,
          canEditNotes: true,
          canDeleteNotes: false,
          canViewTeamNotes: true,
          canExportNotes: true,
          canManageTeam: false,
          canViewAnalytics: false,
          canConfigureEHR: false
        };
    }
  }

  /**
   * Check if user has permission
   */
  public hasPermission(teamId: string, memberId: string, permission: keyof TeamPermissions): boolean {
    const team = this.teams.get(teamId);
    if (!team) return false;

    const member = team.members.find(m => m.id === memberId);
    if (!member) return false;

    return member.permissions[permission];
  }

  /**
   * Load teams from storage
   */
  private loadTeams(): void {
    try {
      const stored = localStorage.getItem('raha_teams');
      if (stored) {
        const data = JSON.parse(stored);
        Object.entries(data).forEach(([key, value]) => {
          this.teams.set(key, value as Team);
        });
      }
    } catch (error) {
      console.warn('Failed to load teams:', error);
    }
  }

  /**
   * Save teams to storage
   */
  private saveTeams(): void {
    try {
      const data: Record<string, Team> = {};
      this.teams.forEach((value, key) => {
        data[key] = value;
      });
      localStorage.setItem('raha_teams', JSON.stringify(data));
    } catch (error) {
      console.warn('Failed to save teams:', error);
    }
  }

  /**
   * Save invites to storage
   */
  private saveInvites(): void {
    try {
      const data: Record<string, TeamInvite> = {};
      this.invites.forEach((value, key) => {
        data[key] = value;
      });
      localStorage.setItem('raha_team_invites', JSON.stringify(data));
    } catch (error) {
      console.warn('Failed to save invites:', error);
    }
  }

  /**
   * Get available license types
   */
  public getLicenseTypes(): Array<{
    id: Team['license']['type'];
    name: string;
    seats: number;
    price: number;
    features: string[];
  }> {
    return [
      {
        id: 'trial',
        name: 'Trial',
        seats: 5,
        price: 0,
        features: ['Basic features', '5 users', '30 days']
      },
      {
        id: 'basic',
        name: 'Basic',
        seats: 10,
        price: 99,
        features: ['All basic features', '10 users', 'Email support']
      },
      {
        id: 'professional',
        name: 'Professional',
        seats: 50,
        price: 499,
        features: ['Advanced analytics', '50 users', 'Priority support', 'EHR integration']
      },
      {
        id: 'enterprise',
        name: 'Enterprise',
        seats: 999,
        price: 1999,
        features: ['Unlimited users', 'Custom integrations', '24/7 support', 'Dedicated account manager']
      }
    ];
  }
}

// Export singleton
export const teamManagementService = new TeamManagementService();
