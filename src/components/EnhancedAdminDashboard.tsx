import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import {
  adminService,
  type AdminStats,
  type AnalyticsChartData,
  type NoteRecord,
  type AdminDashboardUser,
  type AdminTeamOverview,
  type AdminOrganizationSummary,
  type AdminAuditLogEntry,
  type AdminUserRole,
  type AdminUserStatus,
  type AdminDashboardData
} from '@/lib/adminService';
import { supabaseService } from '@/lib/supabase';
import { RefreshCw, Search, Plus, Mail, Copy } from 'lucide-react';

type HipaaLevel = 'full' | 'limited' | 'none';

interface ServiceStatus {
  name: string;
  status: 'healthy' | 'degraded' | 'maintenance';
  uptime: string;
  responseTime: number;
  errorRate: number;
  owner: string;
}

const SERVICE_TEMPLATE: ServiceStatus[] = [
  { name: 'Generative AI Engine', status: 'healthy', uptime: '99.98%', responseTime: 240, errorRate: 0.03, owner: 'AI Platform' },
  { name: 'ICD-10 Suggestions', status: 'healthy', uptime: '99.92%', responseTime: 185, errorRate: 0.05, owner: 'Clinical Intelligence' },
  { name: 'Speech-to-Text Pipeline', status: 'degraded', uptime: '99.71%', responseTime: 410, errorRate: 0.12, owner: 'Voice Systems' },
  { name: 'Export & EHR Sync', status: 'healthy', uptime: '99.87%', responseTime: 260, errorRate: 0.04, owner: 'Integrations' },
  { name: 'Analytics Warehouse', status: 'maintenance', uptime: '99.65%', responseTime: 520, errorRate: 0.08, owner: 'Data Platform' }
];

const DEFAULT_SECURITY_CONTROLS = {
  hipaaLockdown: true,
  mfaRequired: true,
  anomalyDetection: true,
  breakGlass: false
};

const userStatusStyles: Record<AdminUserStatus, string> = {
  active: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  invited: 'bg-sky-100 text-sky-800 border-sky-200',
  suspended: 'bg-rose-100 text-rose-800 border-rose-200'
};

const severityStyles: Record<AdminAuditLogEntry['severity'], string> = {
  low: 'bg-slate-100 text-slate-700 border-slate-200',
  medium: 'bg-amber-100 text-amber-800 border-amber-200',
  high: 'bg-rose-100 text-rose-800 border-rose-200'
};

const servicePillStyles: Record<ServiceStatus['status'], string> = {
  healthy: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  degraded: 'bg-amber-100 text-amber-800 border-amber-200',
  maintenance: 'bg-blue-100 text-blue-800 border-blue-200'
};

const noteStatusOptions: Array<'all' | 'draft' | 'completed' | 'reviewed' | 'archived'> = ['all', 'draft', 'completed', 'reviewed', 'archived'];

const formatDateTime = (input: string | Date): string => {
  const date = input instanceof Date ? input : new Date(input);
  if (Number.isNaN(date.getTime())) return 'Unknown';
  return new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(date);
};

const computeServiceSnapshot = (stats: AdminStats | null): ServiceStatus[] => {
  if (!stats) return SERVICE_TEMPLATE;

  return SERVICE_TEMPLATE.map((service, index) => {
    if (index === 0) {
      const uptime = Math.max(95, Math.min(99.99, stats.systemHealth));
      const errorRate = Math.max(0.01, (100 - uptime) / 200);
      return {
        ...service,
        status: uptime > 98 ? 'healthy' : 'degraded',
        uptime: `${uptime.toFixed(2)}%`,
        responseTime: Math.max(180, Math.round(360 - uptime)),
        errorRate: Number(errorRate.toFixed(2))
      };
    }

    if (index === 1) {
      const uptime = Math.max(94, stats.systemHealth - 1);
      return {
        ...service,
        status: uptime > 97 ? 'healthy' : 'degraded',
        uptime: `${uptime.toFixed(2)}%`,
        responseTime: Math.max(200, Math.round(320 - uptime)),
        errorRate: Number(Math.max(0.02, (100 - uptime) / 180).toFixed(2))
      };
    }

    if (index === 2) {
      return {
        ...service,
        status: stats.activeUsers > stats.totalUsers * 0.5 ? 'healthy' : 'degraded'
      };
    }

    return service;
  });
};

export function EnhancedAdminDashboard() {
  const [organizations, setOrganizations] = useState<AdminOrganizationSummary[]>([]);
  const [organizationId, setOrganizationId] = useState('');
  const [organization, setOrganization] = useState<AdminOrganizationSummary | null>(null);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [analyticsRange, setAnalyticsRange] = useState(14);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsChartData[]>([]);
  const [notes, setNotes] = useState<NoteRecord[]>([]);
  const [auditLogs, setAuditLogs] = useState<AdminAuditLogEntry[]>([]);
  const [users, setUsers] = useState<AdminDashboardUser[]>([]);
  const [teams, setTeams] = useState<AdminTeamOverview[]>([]);
  const [userSearch, setUserSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<AdminUserRole | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<AdminUserStatus | 'all'>('all');
  const [noteStatusFilter, setNoteStatusFilter] = useState<typeof noteStatusOptions[number]>('all');
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [securitySettings, setSecuritySettings] = useState(DEFAULT_SECURITY_CONTROLS);
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newTeamName, setNewTeamName] = useState('');
  const [newTeamCode, setNewTeamCode] = useState('');
  const [newTeamHipaa, setNewTeamHipaa] = useState<HipaaLevel>('full');
  const initialOrgLoaded = useRef(false);

  const loadOrganizations = useCallback(async () => {
    try {
      const orgs = await adminService.listOrganizations();
      setOrganizations(orgs);
      if (!initialOrgLoaded.current && orgs.length > 0) {
        setOrganizationId(orgs[0].id);
        initialOrgLoaded.current = true;
      }
    } catch (err) {
      console.error('Failed to load organizations', err);
      toast.error('Unable to load organizations');
    }
  }, []);

  useEffect(() => {
    loadOrganizations().catch(console.error);
  }, [loadOrganizations]);

  const applySecurityFromOrganization = useCallback((org: AdminOrganizationSummary | null) => {
    if (!org) {
      setSecuritySettings(DEFAULT_SECURITY_CONTROLS);
      return;
    }
    const security = (org.settings?.security as Partial<typeof DEFAULT_SECURITY_CONTROLS>) || {};
    setSecuritySettings({
      hipaaLockdown: org.hipaaCompliant ?? true,
      mfaRequired: security.mfaRequired ?? true,
      anomalyDetection: security.anomalyDetection ?? true,
      breakGlass: security.breakGlass ?? false
    });
  }, []);

  const loadDashboard = useCallback(
    async (silent = false) => {
      if (!organizationId) return;

      if (silent) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }
      setError(null);

      try {
        const data: AdminDashboardData = await adminService.getDashboardData(organizationId, analyticsRange);
        setOrganization(data.organization);
        setStats(data.stats);
        setAnalyticsData(data.analytics);
        setNotes(data.notes);
        setAuditLogs(data.auditLogs);
        setUsers(data.users);
        setTeams(data.teams);

        if (data.users.length > 0 && (!selectedUserId || !data.users.some(user => user.id === selectedUserId))) {
          setSelectedUserId(data.users[0].id);
        }

        applySecurityFromOrganization(data.organization);
      } catch (err) {
        console.error('Failed to load admin dashboard', err);
        setError(err instanceof Error ? err.message : 'Unable to load admin dashboard data');
      } finally {
        if (silent) {
          setIsRefreshing(false);
        } else {
          setIsLoading(false);
        }
      }
    },
    [organizationId, analyticsRange, selectedUserId, applySecurityFromOrganization]
  );

  useEffect(() => {
    loadDashboard().catch(console.error);
  }, [loadDashboard]);

  const handleRefresh = useCallback(() => {
    loadDashboard(true).catch(console.error);
  }, [loadDashboard]);

  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesSearch =
        userSearch.trim().length === 0 ||
        user.name.toLowerCase().includes(userSearch.toLowerCase()) ||
        user.email.toLowerCase().includes(userSearch.toLowerCase());
      const matchesRole = roleFilter === 'all' || user.role === roleFilter;
      const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, userSearch, roleFilter, statusFilter]);

  const filteredNotes = useMemo(() => {
    if (noteStatusFilter === 'all') return notes;
    return notes.filter(note => note.status === noteStatusFilter);
  }, [notes, noteStatusFilter]);

  const selectedUser = useMemo(() => {
    return selectedUserId ? users.find(user => user.id === selectedUserId) ?? null : null;
  }, [users, selectedUserId]);

  const totalNotesThisWeek = useMemo(() => {
    const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    return notes.filter(note => note.createdAt.getTime() >= weekAgo).length;
  }, [notes]);

  const analyticsSummary = useMemo(() => {
    if (analyticsData.length === 0) {
      return { avgNotes: 0, avgAccuracy: 0, totalTime: 0 };
    }

    const avgNotes = analyticsData.reduce((sum, item) => sum + item.notesCreated, 0) / analyticsData.length;
    const avgAccuracy = analyticsData.reduce((sum, item) => sum + item.accuracyRate, 0) / analyticsData.length;
    const totalTime = analyticsData.reduce((sum, item) => sum + item.timeSaved, 0);

    return {
      avgNotes: Math.round(avgNotes * 10) / 10,
      avgAccuracy: Math.round(avgAccuracy * 10) / 10,
      totalTime: Math.round(totalTime * 10) / 10
    };
  }, [analyticsData]);

  const topTeams = useMemo(() => {
    return teams
      .slice()
      .sort((a, b) => b.memberCount - a.memberCount)
      .slice(0, 3);
  }, [teams]);

  const services = useMemo(() => computeServiceSnapshot(stats), [stats]);
  const supabaseStatus = supabaseService.isAvailable() ? 'Connected' : 'Offline';

  const handleUserRoleChange = useCallback(
    async (userId: string, role: AdminUserRole) => {
      try {
        await adminService.updateUserRole(userId, role, organizationId);
        toast.success(`User role updated to ${role}`);
        await loadDashboard(true);
      } catch (err) {
        console.error('Failed to update user role', err);
        toast.error('Unable to update user role');
      }
    },
    [loadDashboard]
  );

  const handleUserStatusChange = useCallback(
    async (userId: string, status: AdminUserStatus) => {
      try {
        await adminService.updateUserStatus(userId, status, organizationId);
        toast.success(`User marked as ${status}`);
        await loadDashboard(true);
      } catch (err) {
        console.error('Failed to update user status', err);
        toast.error('Unable to update user status');
      }
    },
    [loadDashboard]
  );

  const handleAddUser = useCallback(async () => {
    if (!organizationId) return;

    const email = window.prompt('Enter email address for the new user:');
    if (!email) return;
    const name = window.prompt('Enter name for the new user:', email.split('@')[0] || 'New Teammate') || 'New Teammate';

    try {
      await adminService.createUserInvite(organizationId, email.trim(), name.trim(), 'Clinician');
      toast.success('Invitation queued successfully');
      await loadDashboard(true);
    } catch (err) {
      console.error('Failed to create user invite', err);
      toast.error('Unable to create user invite');
    }
  }, [organizationId, loadDashboard]);

  const handleResetUsage = useCallback(
    async (userId: string) => {
      if (!organizationId) return;
      try {
        await adminService.resetUserUsage(userId, organizationId);
        toast.success('Usage reset logged');
        await loadDashboard(true);
      } catch (err) {
        console.error('Failed to reset usage', err);
        toast.error('Unable to reset usage');
      }
    },
    [loadDashboard]
  );

  const handleSendReminder = useCallback(
    async (user: AdminDashboardUser) => {
      if (!organizationId) return;
      try {
        await adminService.createUserInvite(organizationId, user.email, user.name, user.role);
        toast.success('Reminder invitation queued');
      } catch (err) {
        console.error('Failed to send reminder', err);
        toast.error('Unable to send reminder');
      }
    },
    [organizationId]
  );

  const handleServiceRefresh = useCallback(
    async (serviceName: string) => {
      if (!organizationId) return;
      try {
        await adminService.logServiceEvent(organizationId, serviceName);
        toast.success(`Service check started for ${serviceName}`);
      } catch (err) {
        console.error('Failed to refresh service', err);
        toast.error('Unable to refresh service');
      }
    },
    [organizationId]
  );

  const handleSecurityToggle = useCallback(
    async (key: keyof typeof DEFAULT_SECURITY_CONTROLS) => {
      if (!organizationId) return;

      const nextValue = !securitySettings[key];
      const nextSettings = {
        ...securitySettings,
        [key]: nextValue
      };
      setSecuritySettings(nextSettings);

      try {
        const updatedSecurity = {
          hipaaLockdown: nextSettings.hipaaLockdown,
          mfaRequired: nextSettings.mfaRequired,
          anomalyDetection: nextSettings.anomalyDetection,
          breakGlass: nextSettings.breakGlass
        };

        await adminService.updateOrganizationSecurity(organizationId, {
          hipaaCompliant: key === 'hipaaLockdown' ? nextSettings.hipaaLockdown : organization?.hipaaCompliant,
          settings: {
            ...(organization?.settings ?? {}),
            security: updatedSecurity
          }
        });

        setOrganization(prev =>
          prev
            ? {
                ...prev,
                hipaaCompliant: key === 'hipaaLockdown' ? nextSettings.hipaaLockdown : prev.hipaaCompliant,
                settings: {
                  ...(prev.settings ?? {}),
                  security: updatedSecurity
                }
              }
            : prev
        );

        toast.success('Security control updated');
      } catch (err) {
        console.error('Failed to update security control', err);
        toast.error('Unable to update security control');
      }
    },
    [organizationId, securitySettings, organization]
  );

  const handleNoteStatusChange = useCallback(
    async (noteId: string, status: NoteRecord['status']) => {
      if (!organizationId) return;
      try {
        const success = await adminService.updateNoteStatus(noteId, status, organizationId);
        if (success) {
          toast.success('Note status updated');
          await loadDashboard(true);
        } else {
          toast.info('Note status updates require a schema migration to add a status column to note_metadata.');
        }
      } catch (err) {
        console.error('Failed to update note status', err);
        toast.error('Unable to update note status');
      }
    },
    [loadDashboard]
  );

  const handleAnalyticsRangeChange = useCallback((value: string) => {
    const range = Number(value) || 7;
    setAnalyticsRange(range);
  }, []);

  const handleCopyKey = useCallback(async (maskedKey: string) => {
    try {
      await navigator.clipboard.writeText(maskedKey.replace(/\u2022/g, '*'));
      toast.success('Key copied to clipboard');
    } catch (err) {
      console.error('Clipboard copy failed', err);
      toast.error('Unable to copy key');
    }
  }, []);

  const handleToggleUserTeam = useCallback(
    async (teamId: string, checked: boolean) => {
      if (!selectedUser) return;

      const nextTeamIds = checked
        ? Array.from(new Set([...selectedUser.teamIds, teamId]))
        : selectedUser.teamIds.filter(id => id !== teamId);

      try {
        await adminService.setUserTeams(selectedUser.id, nextTeamIds);
        toast.success('Team assignment updated');
        await loadDashboard(true);
      } catch (err) {
        console.error('Failed to update team assignment', err);
        toast.error('Unable to update team assignment');
      }
    },
    [selectedUser, loadDashboard]
  );

  const handleCreateTeam = useCallback(async () => {
    if (!organizationId) return;
    if (!newTeamName.trim() || !newTeamCode.trim()) {
      toast.error('Team name and code are required');
      return;
    }

    try {
      await adminService.createTeam(organizationId, newTeamName.trim(), newTeamCode.trim(), newTeamHipaa);
      toast.success('Team created');
      setNewTeamName('');
      setNewTeamCode('');
      setNewTeamHipaa('full');
      await loadDashboard(true);
    } catch (err) {
      console.error('Failed to create team', err);
      toast.error('Unable to create team');
    }
  }, [organizationId, newTeamName, newTeamCode, newTeamHipaa, loadDashboard]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 p-8">
        <div className="mx-auto max-w-6xl space-y-4">
          <div className="h-12 w-64 rounded-lg bg-slate-200 animate-pulse" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="h-32 rounded-xl bg-slate-200 animate-pulse" />
            ))}
          </div>
          <div className="h-80 rounded-xl bg-slate-200 animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      <div className="mx-auto w-full max-w-7xl px-6 py-8 space-y-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Admin Control Center</h1>
            <p className="text-sm text-slate-600">Run Raha with full visibility into teams, compliance, and infrastructure.</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Select value={organizationId} onValueChange={value => setOrganizationId(value)}>
              <SelectTrigger className="w-56">
                <SelectValue placeholder="Select organization" />
              </SelectTrigger>
              <SelectContent>
                {organizations.map(org => (
                  <SelectItem key={org.id} value={org.id}>
                    {org.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Badge variant={supabaseService.isAvailable() ? 'default' : 'outline'}>Supabase: {supabaseStatus}</Badge>
            <Button variant="outline" onClick={handleRefresh}>
              <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="people">People</TabsTrigger>
            <TabsTrigger value="operations">Operations</TabsTrigger>
            <TabsTrigger value="compliance">Compliance</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Active clinicians</CardTitle>
                    <CardDescription>Users active in the last 24 hours</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-slate-900">{stats?.activeUsers ?? '--'}</div>
                    <p className="text-xs text-slate-500">{totalNotesThisWeek} notes generated this week</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Notes today</CardTitle>
                    <CardDescription>AI-assisted documentation</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-slate-900">{stats?.notesToday ?? '--'}</div>
                    <p className="text-xs text-slate-500">
                      {analyticsSummary.avgNotes} avg per hour • {analyticsSummary.totalTime} hrs saved
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Model accuracy</CardTitle>
                    <CardDescription>Documentation quality score</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-slate-900">
                      {stats ? `${stats.avgAccuracy}%` : '--'}
                    </div>
                    <Progress value={stats ? stats.avgAccuracy : 0} className="h-2 mt-2" />
                    <p className="text-xs text-slate-500 mt-1">Rolling average across {analyticsRange} days</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">System health</CardTitle>
                    <CardDescription>Platform availability</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-slate-900">
                      {stats ? `${stats.systemHealth.toFixed(1)}%` : '--'}
                    </div>
                    <p className="text-xs text-slate-500">
                      Storage: {stats ? `${stats.storageUsed} GB` : '--'} / {stats ? `${stats.storageLimit} GB` : '--'}
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
                <Card className="xl:col-span-2">
                  <CardHeader className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                    <div>
                      <CardTitle>Clinical throughput</CardTitle>
                      <CardDescription>Volume, accuracy, and time saved</CardDescription>
                    </div>
                    <Select value={String(analyticsRange)} onValueChange={handleAnalyticsRangeChange}>
                      <SelectTrigger className="w-36">
                        <SelectValue placeholder="Select range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="7">Last 7 days</SelectItem>
                        <SelectItem value="14">Last 14 days</SelectItem>
                        <SelectItem value="30">Last 30 days</SelectItem>
                      </SelectContent>
                    </Select>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 rounded-lg border border-slate-200/70 bg-slate-50 px-4 py-3">
                      <div>
                        <p className="text-xs text-slate-500 uppercase">Avg notes / day</p>
                        <p className="text-sm font-semibold text-slate-900">{analyticsSummary.avgNotes}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 uppercase">Avg accuracy</p>
                        <p className="text-sm font-semibold text-slate-900">{analyticsSummary.avgAccuracy}%</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 uppercase">Hours saved</p>
                        <p className="text-sm font-semibold text-slate-900">{analyticsSummary.totalTime}</p>
                      </div>
                    </div>
                    <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                      {analyticsData.map(item => (
                        <div key={item.date} className="flex items-center gap-3 rounded-lg border border-slate-200/80 bg-white px-3 py-2 shadow-sm">
                          <div className="w-16 text-xs font-semibold text-slate-500">
                            {new Date(item.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between text-xs text-slate-500">
                              <span>Notes</span>
                              <span>{item.notesCreated}</span>
                            </div>
                            <div className="h-2 rounded-full bg-slate-100">
                              <div
                                className="h-full rounded-full bg-gradient-to-r from-teal-500 to-blue-600"
                                style={{ width: `${(item.notesCreated / Math.max(...analyticsData.map(d => d.notesCreated), 1)) * 100}%` }}
                              />
                            </div>
                          </div>
                          <div className="hidden sm:flex flex-col text-right text-[11px] text-slate-500">
                            <span>Accuracy {item.accuracyRate}%</span>
                            <span>{item.timeSaved} hrs saved</span>
                          </div>
                        </div>
                      ))}
                      {analyticsData.length === 0 && (
                        <div className="rounded-lg border border-dashed border-slate-300 py-10 text-center text-sm text-slate-500">
                          No analytics available for the selected window.
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>System observability</CardTitle>
                    <CardDescription>Uptime, services, and top teams</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      {services.slice(0, 3).map(service => (
                        <div key={service.name} className="rounded-lg border border-slate-200/80 bg-white px-3 py-2 shadow-sm">
                          <div className="flex items-center justify-between text-xs font-medium text-slate-600">
                            <span>{service.name}</span>
                            <Badge className={`${servicePillStyles[service.status]} text-[10px] px-2 py-0.5`}>
                              {service.status}
                            </Badge>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-1">
                            Uptime {service.uptime} • Error rate {(service.errorRate * 100).toFixed(2)}%
                          </p>
                        </div>
                      ))}
                    </div>
                    <Separator />
                    <div>
                      <p className="text-xs font-semibold text-slate-600 mb-2 uppercase">Top teams</p>
                      <div className="space-y-1">
                        {topTeams.map(team => (
                          <div key={team.id} className="flex items-center justify-between text-xs text-slate-600">
                            <span>{team.name}</span>
                            <Badge variant="outline" className="text-[10px]">
                              {team.memberCount} members
                            </Badge>
                          </div>
                        ))}
                        {topTeams.length === 0 && <p className="text-xs text-slate-500">No team assignments available.</p>}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                      <CardTitle>Recent documentation</CardTitle>
                      <CardDescription>Most recent AI-generated notes</CardDescription>
                    </div>
                    <Button variant="outline" size="sm" onClick={handleRefresh}>
                      <RefreshCw className={`h-3 w-3 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                      Refresh feed
                    </Button>
                  </CardHeader>
                  <CardContent className="space-y-2 max-h-80 overflow-y-auto pr-1">
                    {notes.slice(0, 12).map(note => (
                      <div key={note.id} className="rounded-lg border border-slate-200/80 bg-white px-3 py-2 shadow-sm">
                        <div className="flex flex-wrap items-center justify-between gap-2 text-sm font-semibold text-slate-800">
                          <span>{note.patient}</span>
                          <Badge variant="outline" className="text-[10px] uppercase">
                            {note.template}
                          </Badge>
                        </div>
                        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-500">
                          <span>Author: {note.author}</span>
                          <span>Status: <span className="capitalize">{note.status}</span></span>
                          <span>{formatDateTime(note.createdAt)}</span>
                        </div>
                      </div>
                    ))}
                    {notes.length === 0 && (
                      <div className="rounded-lg border border-dashed border-slate-300 py-10 text-center text-sm text-slate-500">
                        No documentation generated yet.
                      </div>
                    )}
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Live audit trail</CardTitle>
                    <CardDescription>Security-sensitive actions</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2 max-h-80 overflow-y-auto pr-1">
                    {auditLogs.slice(0, 12).map(log => (
                      <div key={log.id} className="rounded-lg border border-slate-200/80 bg-white px-3 py-2 shadow-sm">
                        <div className="flex items-center justify-between text-xs text-slate-500">
                          <span>{formatDateTime(log.timestampISO)}</span>
                          <Badge className={`${severityStyles[log.severity]} text-[10px] px-2 py-0.5`}>
                            {log.severity}
                          </Badge>
                        </div>
                        <p className="mt-1 text-sm font-semibold text-slate-800">{log.event}</p>
                        <p className="text-xs text-slate-600">Actor: {log.actor}</p>
                        <p className="text-xs text-slate-500 mt-1">{log.details}</p>
                      </div>
                    ))}
                    {auditLogs.length === 0 && (
                      <div className="rounded-lg border border-dashed border-slate-300 py-10 text-center text-sm text-slate-500">
                        No audit activity recorded yet.
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="people">
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 xl:grid-cols-6 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Total users</CardTitle>
                    <CardDescription>Organization roster</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-slate-900">{users.length}</div>
                    <p className="text-xs text-slate-500">
                      {users.filter(user => user.status === 'active').length} active
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Invited</CardTitle>
                    <CardDescription>Awaiting onboarding</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-slate-900">
                      {users.filter(user => user.status === 'invited').length}
                    </div>
                    <p className="text-xs text-slate-500">Pending acceptance</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Suspended</CardTitle>
                    <CardDescription>Compliance review</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-slate-900">
                      {users.filter(user => user.status === 'suspended').length}
                    </div>
                    <p className="text-xs text-slate-500">Requires follow-up</p>
                  </CardContent>
                </Card>
                <Card className="sm:col-span-2">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Team coverage</CardTitle>
                    <CardDescription>Most active enterprise teams</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {topTeams.map(team => (
                      <div key={team.id} className="flex items-center justify-between text-xs text-slate-600">
                        <span className="font-medium">{team.name}</span>
                        <span>{team.memberCount} members</span>
                      </div>
                    ))}
                    {topTeams.length === 0 && <p className="text-xs text-slate-500">No team data recorded yet.</p>}
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Avg notes / clinician</CardTitle>
                    <CardDescription>Past 7 days</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-slate-900">
                      {users.length ? Math.round((totalNotesThisWeek / users.length) * 10) / 10 : '--'}
                    </div>
                    <p className="text-xs text-slate-500">Per active clinician</p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>User directory</CardTitle>
                  <CardDescription>Manage network access, roles, and team placement</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-3">
                    <div className="flex flex-col md:flex-row gap-3 flex-1">
                      <div className="flex-1 min-w-[200px]">
                        <Label className="text-xs text-slate-500">Search</Label>
                        <div className="relative mt-1">
                          <Input
                            placeholder="Search by name or email"
                            value={userSearch}
                            onChange={event => setUserSearch(event.target.value)}
                            className="pl-8"
                          />
                          <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-[180px]">
                        <Label className="text-xs text-slate-500">Role</Label>
                        <Select value={roleFilter} onValueChange={value => setRoleFilter(value as AdminUserRole | 'all')}>
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="All roles" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All roles</SelectItem>
                            <SelectItem value="Administrator">Administrator</SelectItem>
                            <SelectItem value="Clinician">Clinician</SelectItem>
                            <SelectItem value="Educator">Educator</SelectItem>
                            <SelectItem value="Auditor">Auditor</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex-1 min-w-[180px]">
                        <Label className="text-xs text-slate-500">Status</Label>
                        <Select value={statusFilter} onValueChange={value => setStatusFilter(value as AdminUserStatus | 'all')}>
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="All statuses" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All statuses</SelectItem>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="invited">Invited</SelectItem>
                            <SelectItem value="suspended">Suspended</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" onClick={() => {
                        setUserSearch('');
                        setRoleFilter('all');
                        setStatusFilter('all');
                      }}>
                        <RefreshCw className="h-3.5 w-3.5 mr-2" />
                        Clear filters
                      </Button>
                      <Button onClick={handleAddUser}>
                        <Plus className="h-3.5 w-3.5 mr-2" />
                        Add teammate
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
                    <div className="xl:col-span-2 space-y-2">
                      <div className="hidden md:grid grid-cols-12 text-xs font-semibold text-slate-500 px-3">
                        <span className="col-span-3">User</span>
                        <span className="col-span-2">Role</span>
                        <span className="col-span-2">Status</span>
                        <span className="col-span-2">Notes (7d)</span>
                        <span className="col-span-3">Teams</span>
                      </div>
                      <Separator />
                      <div className="divide-y border rounded-lg">
                        {filteredUsers.map(user => (
                          <div
                            key={user.id}
                            className={`grid grid-cols-1 md:grid-cols-12 gap-3 px-3 py-3 transition ${selectedUserId === user.id ? 'bg-blue-50/60 border-l-2 border-blue-400' : 'hover:bg-slate-50'}`}
                            onClick={() => setSelectedUserId(user.id)}
                          >
                            <div className="md:col-span-3 flex items-center gap-3">
                              <Avatar className="h-9 w-9">
                                <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="text-sm font-semibold text-slate-900">{user.name}</p>
                                <p className="text-xs text-slate-500">{user.email}</p>
                                <p className="text-[11px] text-slate-400">Last active: {formatDateTime(user.lastActiveISO)}</p>
                              </div>
                            </div>
                            <div className="md:col-span-2">
                              <Select value={user.role} onValueChange={value => handleUserRoleChange(user.id, value as AdminUserRole)}>
                                <SelectTrigger className="h-9 text-xs">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Administrator">Administrator</SelectItem>
                                  <SelectItem value="Clinician">Clinician</SelectItem>
                                  <SelectItem value="Educator">Educator</SelectItem>
                                  <SelectItem value="Auditor">Auditor</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="md:col-span-2 flex items-center gap-2">
                              <Badge className={`${userStatusStyles[user.status]} text-[11px] px-2 py-0.5`}>
                                {user.status}
                              </Badge>
                              <Select value={user.status} onValueChange={value => handleUserStatusChange(user.id, value as AdminUserStatus)}>
                                <SelectTrigger className="h-9 w-[120px] text-xs">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="active">Active</SelectItem>
                                  <SelectItem value="invited">Invited</SelectItem>
                                  <SelectItem value="suspended">Suspended</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="md:col-span-2 flex items-center gap-2">
                              <div>
                                <p className="text-sm font-semibold text-slate-900">{user.notesThisWeek}</p>
                                <p className="text-[11px] text-slate-500">notes/week</p>
                              </div>
                              <Button size="sm" variant="outline" onClick={event => {
                                event.stopPropagation();
                                handleResetUsage(user.id);
                              }}>
                                <RefreshCw className="h-3 w-3 mr-1" />
                                Reset
                              </Button>
                            </div>
                            <div className="md:col-span-3 flex flex-wrap gap-1">
                              {user.teamNames.map(teamName => (
                                <Badge key={teamName} variant="outline" className="text-[11px]">
                                  {teamName}
                                </Badge>
                              ))}
                              {user.teamNames.length === 0 && (
                                <span className="text-[11px] text-slate-400">No teams</span>
                              )}
                              {user.status === 'invited' && (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="text-xs text-blue-600 hover:text-blue-700"
                                  onClick={event => {
                                    event.stopPropagation();
                                    handleSendReminder(user);
                                  }}
                                >
                                  <Mail className="h-3 w-3 mr-1" />
                                  Send reminder
                                </Button>
                              )}
                            </div>
                          </div>
                        ))}
                        {filteredUsers.length === 0 && (
                          <div className="py-10 text-center text-sm text-slate-500">
                            No users match the current filters.
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="space-y-4">
                      <Card>
                        <CardHeader>
                          <CardTitle>User profile</CardTitle>
                          <CardDescription>Access, compliance, and team assignment</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {selectedUser ? (
                            <>
                              <div className="flex items-center gap-3">
                                <Avatar className="h-10 w-10">
                                  <AvatarFallback>{selectedUser.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="text-sm font-semibold text-slate-900">{selectedUser.name}</p>
                                  <p className="text-xs text-slate-500">{selectedUser.email}</p>
                                </div>
                              </div>
                              <Separator />
                              <div className="space-y-3 text-xs text-slate-600">
                                <div className="flex items-center justify-between">
                                  <span>Role</span>
                                  <Badge variant="outline" className="text-[10px]">{selectedUser.role}</Badge>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span>Status</span>
                                  <Badge className={`${userStatusStyles[selectedUser.status]} text-[10px] px-2 py-0.5`}>
                                    {selectedUser.status}
                                  </Badge>
                                </div>
                                <div className="space-y-2">
                                  <span className="block text-[11px] text-slate-400">Team memberships</span>
                                  {teams.length === 0 && (
                                    <p className="text-[11px] text-slate-500">Create teams to assign users.</p>
                                  )}
                                  {teams.map(team => (
                                    <label key={team.id} className="flex items-center justify-between rounded-lg border border-slate-200/80 bg-slate-50 px-2 py-1 text-xs text-slate-600">
                                      <div>
                                        <span className="font-medium">{team.name}</span>
                                        <span className="ml-2 text-[10px] text-slate-400 uppercase">{team.code}</span>
                                      </div>
                                      <Switch
                                        checked={selectedUser.teamIds.includes(team.id)}
                                        onCheckedChange={checked => handleToggleUserTeam(team.id, checked)}
                                      />
                                    </label>
                                  ))}
                                </div>
                              </div>
                            </>
                          ) : (
                            <p className="text-sm text-slate-500">Select a user to view details.</p>
                          )}
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader>
                          <CardTitle>Enterprise teams</CardTitle>
                          <CardDescription>Manage department-based collaborations</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="rounded-lg border border-slate-200/80 bg-white px-3 py-3 shadow-sm space-y-2">
                            <div className="grid grid-cols-2 gap-2">
                              <Input placeholder="Team name" value={newTeamName} onChange={event => setNewTeamName(event.target.value)} />
                              <Input placeholder="Code" value={newTeamCode} onChange={event => setNewTeamCode(event.target.value)} />
                            </div>
                            <div className="flex items-center justify-between gap-2">
                              <Select value={newTeamHipaa} onValueChange={value => setNewTeamHipaa(value as HipaaLevel)}>
                                <SelectTrigger className="w-40">
                                  <SelectValue placeholder="HIPAA level" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="full">Full access</SelectItem>
                                  <SelectItem value="limited">Limited</SelectItem>
                                  <SelectItem value="none">None</SelectItem>
                                </SelectContent>
                              </Select>
                              <Button size="sm" onClick={handleCreateTeam}>
                                <Plus className="h-3 w-3 mr-1" />
                                Create Team
                              </Button>
                            </div>
                          </div>

                          {teams.map(team => (
                            <div key={team.id} className="rounded-lg border border-slate-200/80 bg-slate-50 px-3 py-2 shadow-sm">
                              <div className="flex items-center justify-between text-sm font-semibold text-slate-800">
                                <span>{team.name}</span>
                                <Badge variant="outline" className="text-[10px] uppercase">{team.code}</Badge>
                              </div>
                              <p className="text-[11px] text-slate-500 mt-1">
                                HIPAA: {team.hipaaLevel.toUpperCase()} • Members: {team.memberCount}
                              </p>
                            </div>
                          ))}
                          {teams.length === 0 && (
                            <p className="text-sm text-slate-500">No enterprise teams created yet.</p>
                          )}
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="operations">
            <div className="space-y-6">
              <Card>
                <CardHeader className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <CardTitle>Documentation queue</CardTitle>
                    <CardDescription>Track generation and review status</CardDescription>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Select value={noteStatusFilter} onValueChange={value => setNoteStatusFilter(value as typeof noteStatusFilter)}>
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="All statuses" />
                      </SelectTrigger>
                      <SelectContent>
                        {noteStatusOptions.map(option => (
                          <SelectItem key={option} value={option}>
                            {option === 'all' ? 'All statuses' : option.charAt(0).toUpperCase() + option.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button variant="outline" size="sm" onClick={handleRefresh}>
                      <RefreshCw className={`h-3 w-3 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                      Refresh
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Patient</TableHead>
                          <TableHead>Template</TableHead>
                          <TableHead>Author</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Generated</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredNotes.slice(0, 25).map(note => (
                          <TableRow key={note.id}>
                            <TableCell className="font-medium">{note.patient}</TableCell>
                            <TableCell>{note.template}</TableCell>
                            <TableCell>{note.author}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className="capitalize">
                                {note.status}
                              </Badge>
                            </TableCell>
                            <TableCell>{formatDateTime(note.createdAt)}</TableCell>
                            <TableCell className="text-right">
                              <Select value={note.status} onValueChange={value => handleNoteStatusChange(note.id, value as NoteRecord['status'])}>
                                <SelectTrigger className="h-8 w-32 text-xs">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="draft">Draft</SelectItem>
                                  <SelectItem value="completed">Completed</SelectItem>
                                  <SelectItem value="reviewed">Reviewed</SelectItem>
                                  <SelectItem value="archived">Archived</SelectItem>
                                </SelectContent>
                              </Select>
                            </TableCell>
                          </TableRow>
                        ))}
                        {filteredNotes.length === 0 && (
                          <TableRow>
                            <TableCell colSpan={6} className="text-center text-sm text-slate-500">
                              No notes match the current filter.
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Service health</CardTitle>
                    <CardDescription>Monitor AI, integrations, and exports</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {services.map(service => (
                      <div key={service.name} className="rounded-lg border border-slate-200/80 bg-white px-3 py-2 shadow-sm">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div>
                            <p className="text-sm font-semibold text-slate-800">{service.name}</p>
                            <p className="text-[11px] text-slate-500">Owner: {service.owner}</p>
                          </div>
                          <Badge className={`${servicePillStyles[service.status]} text-[10px] px-2 py-0.5`}>
                            {service.status}
                          </Badge>
                        </div>
                        <div className="mt-2 flex flex-wrap items-center justify-between text-[11px] text-slate-500 gap-3">
                          <span>Uptime {service.uptime}</span>
                          <span>Latency {service.responseTime}ms</span>
                          <span>Error rate {(service.errorRate * 100).toFixed(2)}%</span>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-xs text-blue-600 hover:text-blue-700"
                            onClick={() => handleServiceRefresh(service.name)}
                          >
                            <RefreshCw className="h-3 w-3 mr-1" />
                            Rerun health check
                          </Button>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>API credentials</CardTitle>
                    <CardDescription>Manage integration access scopes</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {[...SERVICE_TEMPLATE].slice(0, 3).map((key, index) => {
                      const maskedKey = index === 0 ? 'NC-PRD-2F9A-••••-7C1B' : index === 1 ? 'NC-QA-9910-••••-A72D' : 'NC-ANL-55F1-••••-4E0C';
                      const status = index === 2 ? 'rotated' : 'active';
                      return (
                        <div key={key.name} className="rounded-lg border border-slate-200/80 bg-white px-3 py-2 shadow-sm">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div>
                              <p className="text-sm font-semibold text-slate-800">{key.name}</p>
                              <p className="text-[11px] text-slate-500">Last rotated recently</p>
                            </div>
                            <Badge
                              className={
                                status === 'active'
                                  ? 'bg-emerald-100 text-emerald-700 border-emerald-200'
                                  : 'bg-amber-100 text-amber-700 border-amber-200'
                              }
                            >
                              {status}
                            </Badge>
                          </div>
                          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600 mt-1">
                            <span className="font-mono text-sm">{maskedKey}</span>
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline" onClick={() => handleCopyKey(maskedKey)}>
                                <Copy className="h-3 w-3 mr-1" />
                                Copy
                              </Button>
                              <Button size="sm" variant="outline" onClick={() => toast.info('Key rotation requires ops workflow.')}>
                                <RefreshCw className="h-3 w-3 mr-1" />
                                Rotate
                              </Button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="compliance">
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Security posture</CardTitle>
                    <CardDescription>HIPAA, MFA, anomaly detection, break-glass</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-slate-800">HIPAA lockdown</p>
                        <p className="text-xs text-slate-500">Enforce PHI redaction and secure exports</p>
                      </div>
                      <Switch checked={securitySettings.hipaaLockdown} onCheckedChange={() => handleSecurityToggle('hipaaLockdown')} />
                    </div>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-slate-800">Mandatory multi-factor</p>
                        <p className="text-xs text-slate-500">Require 2FA for admin dashboard access</p>
                      </div>
                      <Switch checked={securitySettings.mfaRequired} onCheckedChange={() => handleSecurityToggle('mfaRequired')} />
                    </div>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-slate-800">Anomaly detection</p>
                        <p className="text-xs text-slate-500">Alert on unusual AI usage patterns</p>
                      </div>
                      <Switch checked={securitySettings.anomalyDetection} onCheckedChange={() => handleSecurityToggle('anomalyDetection')} />
                    </div>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-slate-800">Break-glass workflow</p>
                        <p className="text-xs text-slate-500">Temporary elevated access with audit trail</p>
                      </div>
                      <Switch checked={securitySettings.breakGlass} onCheckedChange={() => handleSecurityToggle('breakGlass')} />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Audit history</CardTitle>
                    <CardDescription>Track privileged actions and acknowledgements</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2 max-h-96 overflow-y-auto pr-1">
                    {auditLogs.map(log => (
                      <div key={log.id} className="rounded-lg border border-slate-200/80 bg-white px-3 py-2 shadow-sm">
                        <div className="flex items-center justify-between text-xs text-slate-500">
                          <span>{formatDateTime(log.timestampISO)}</span>
                          <Badge className={`${severityStyles[log.severity]} text-[10px] px-2 py-0.5`}>
                            {log.severity}
                          </Badge>
                        </div>
                        <p className="mt-1 text-sm font-semibold text-slate-800">{log.event}</p>
                        <p className="text-xs text-slate-600">Actor: {log.actor}</p>
                        <p className="text-xs text-slate-500 mt-1">{log.details}</p>
                      </div>
                    ))}
                    {auditLogs.length === 0 && <p className="text-sm text-slate-500">No audit events recorded yet.</p>}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="settings">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Organization profile</CardTitle>
                  <CardDescription>Plan, limits, and integration preferences</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label className="text-xs text-slate-500">Organization</Label>
                    <p className="text-sm font-semibold text-slate-900">{organization?.name ?? '—'}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-slate-500">Type</Label>
                    <p className="text-sm font-semibold text-slate-900">{organization?.type ?? '—'}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-slate-500">HIPAA compliant</Label>
                    <p className="text-sm font-semibold text-slate-900">
                      {organization?.hipaaCompliant ? 'Yes' : 'No'}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-slate-500">Feature flags</Label>
                    <p className="text-sm font-semibold text-slate-900">
                      {Object.keys(organization?.settings?.features ?? {}).length || 'Using defaults'}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
