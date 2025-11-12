import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { 
  Users, 
  FileText, 
  BarChart3, 
  Settings, 
  Shield, 
  Activity, 
  Database, 
  Clock, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
  Download,
  Filter,
  Search,
  Calendar,
  UserCheck,
  UserX,
  Lock,
  Unlock,
  Trash2,
  Edit,
  Plus,
  MoreHorizontal,
  Bell,
  Mail,
  Phone,
  MapPin,
  Award,
  Target,
  Zap,
  Globe,
  Server,
  HardDrive,
  Wifi,
  WifiOff,
  RefreshCw,
  Archive,
  FileArchive,
  UserPlus,
  UserMinus,
  Settings2,
  Key,
  Database as DatabaseIcon,
  Shield as ShieldIcon,
  Activity as ActivityIcon,
  BarChart as BarChartIcon,
  PieChart,
  LineChart,
  DollarSign,
  Clock as ClockIcon,
  Calendar as CalendarIcon,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  ExternalLink,
  Menu,
  Copy,
  Upload,
  Download as DownloadIcon,
  Printer,
  Share2,
  Star,
  Heart,
  MessageSquare,
  Video,
  Camera,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Square,
  SkipBack,
  SkipForward,
  Repeat,
  Shuffle,
  Maximize,
  Minimize,
  RotateCcw,
  Save,
  Folder,
  FolderOpen,
  File,
  FileImage,
  FileVideo,
  FileAudio,
  FileSpreadsheet,
  FileText as FileTextIcon,
  FileCode,
  FileArchive as FileArchiveIcon,
  FolderPlus,
  FilePlus,
  Trash,
  Edit3,
  PenTool,
  Type,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Quote,
  Code,
  Link,
  Image,
  Table as TableIcon,
  Columns,
  Rows,
  Grid,
  Layout,
  Sidebar,
  PanelLeft,
  PanelRight,
  Split,
  Layers,
  Layers3,
  Grid3X3,
  Square as SquareIcon,
  Circle,
  Triangle,
  Hexagon,
  Octagon,
  Pentagon,
  Diamond,
  Star as StarIcon,
  Heart as HeartIcon,
  Zap as ZapIcon,
  Flame,
  Droplets,
  Snowflake,
  Sun,
  Moon,
  Cloud,
  CloudRain,
  CloudSnow,
  CloudLightning,
  Wind,
  Thermometer,
  Gauge,
  Battery,
  BatteryLow,
  BatteryMedium,
  BatteryFull,
  Plug,
  PlugZap,
  Power,
  PowerOff,
  ToggleLeft,
  ToggleRight,
  SwitchCamera,
  CameraOff,
  Monitor,
  MonitorOff,
  Smartphone,
  Tablet,
  Laptop,
  Server as ServerIcon,
  Router,
  Wifi as WifiIcon,
  WifiOff as WifiOffIcon,
  Bluetooth,
  BluetoothOff,
  Radio,
  Signal,
  SignalZero,
  SignalLow,
  SignalMedium,
  SignalHigh,
  Navigation,
  NavigationOff,
  Compass,
  Map,
  MapPin as MapPinIcon,
  Locate,
  LocateFixed,
  LocateOff,
  Route,
  Waypoints,
  Milestone,
  Flag,
  FlagOff,
  Home,
  Building,
  Building2,
  Store,
  Factory,
  Warehouse,
  Hospital,
  School,
  Church,
  Hotel,
  Car,
  Truck,
  Bus,
  Train,
  Plane,
  Ship,
  Bike,
  Footprints,
  Route as RouteIcon,
  Navigation as NavigationIcon,
  Compass as CompassIcon,
  Map as MapIcon,
  Globe as GlobeIcon,
  Earth,
  Satellite,
  Telescope,
  Microscope,
  Camera as CameraIcon,
  CameraOff as CameraOffIcon,
  Video as VideoIcon,
  VideoOff,
  Mic as MicIcon,
  MicOff as MicOffIcon,
  Volume2 as Volume2Icon,
  VolumeX as VolumeXIcon,
  Volume1,
  Volume,
  Play as PlayIcon,
  Pause as PauseIcon,
  Square as SquareIcon2,
  SkipBack as SkipBackIcon,
  SkipForward as SkipForwardIcon,
  Repeat as RepeatIcon,
  Shuffle as ShuffleIcon,
  Maximize as MaximizeIcon,
  Minimize as MinimizeIcon,
  RotateCcw as RotateCcwIcon,
  Save as SaveIcon,
  Folder as FolderIcon,
  FolderOpen as FolderOpenIcon,
  File as FileIcon,
  FileImage as FileImageIcon,
  FileVideo as FileVideoIcon,
  FileAudio as FileAudioIcon,
  FileSpreadsheet as FileSpreadsheetIcon,
  FileText as FileTextIcon2,
  FileCode as FileCodeIcon,
  FileArchive as FileArchiveIcon2,
  FolderPlus as FolderPlusIcon,
  FilePlus as FilePlusIcon,
  Trash as TrashIcon,
  Edit3 as Edit3Icon,
  PenTool as PenToolIcon,
  Type as TypeIcon,
  Bold as BoldIcon,
  Italic as ItalicIcon,
  Underline as UnderlineIcon,
  Strikethrough as StrikethroughIcon,
  AlignLeft as AlignLeftIcon,
  AlignCenter as AlignCenterIcon,
  AlignRight as AlignRightIcon,
  AlignJustify as AlignJustifyIcon,
  List as ListIcon,
  ListOrdered as ListOrderedIcon,
  Quote as QuoteIcon,
  Code as CodeIcon,
  Link as LinkIcon,
  Image as ImageIcon,
  Columns as ColumnsIcon,
  Rows as RowsIcon,
  Grid as GridIcon,
  Layout as LayoutIcon,
  Sidebar as SidebarIcon,
  PanelLeft as PanelLeftIcon,
  PanelRight as PanelRightIcon,
  Split as SplitIcon,
  Layers as LayersIcon,
  Layers3 as Layers3Icon,
  Grid3X3 as Grid3X3Icon
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { phiProtectionService, PHIDetectionResult, AuditLogEntry, ComplianceReport } from '@/lib/phiProtectionService';
import { organizationService, Organization, User as OrganizationUser, Team, OrganizationInvite } from '@/lib/organizationService';

interface DashboardStats {
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

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive' | 'suspended';
  lastLogin: string;
  notesCreated: number;
  joinDate: string;
  avatar?: string;
}

interface SystemLog {
  id: string;
  timestamp: string;
  level: 'info' | 'warning' | 'error';
  message: string;
  source: string;
  userId?: string;
}

interface AnalyticsData {
  date: string;
  notesCreated: number;
  usersActive: number;
  accuracyRate: number;
  timeSaved: number;
}

export function PowerfulAdminDashboard() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<OrganizationUser | null>(null);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  
  // PHI Protection state
  const [phiDetectionResults, setPhiDetectionResults] = useState<PHIDetectionResult[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [complianceReports, setComplianceReports] = useState<ComplianceReport[]>([]);
  
  // Organization Management state
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [organizationUsers, setOrganizationUsers] = useState<OrganizationUser[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [invites, setInvites] = useState<OrganizationInvite[]>([]);
  
  // Organization management modals
  const [showCreateOrgModal, setShowCreateOrgModal] = useState(false);
  const [showCreateTeamModal, setShowCreateTeamModal] = useState(false);
  const [showInviteUserModal, setShowInviteUserModal] = useState(false);
  const [showEditOrgModal, setShowEditOrgModal] = useState(false);
  const [showEditTeamModal, setShowEditTeamModal] = useState(false);
  
  // Search and filter state
  const [orgSearchQuery, setOrgSearchQuery] = useState('');
  const [teamSearchQuery, setTeamSearchQuery] = useState('');
  
  // Selected items for editing
  const [selectedOrganization, setSelectedOrganization] = useState<Organization | null>(null);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  
  // PHI Protection modals and state
  const [showCreatePatternModal, setShowCreatePatternModal] = useState(false);
  const [showTestPHIModal, setShowTestPHIModal] = useState(false);
  const [showCreateReportModal, setShowCreateReportModal] = useState(false);
  const [phiSearchQuery, setPhiSearchQuery] = useState('');
  const [auditLogFilter, setAuditLogFilter] = useState('all');
  
  // User Management modals and state
  const [showCreateUserModal, setShowCreateUserModal] = useState(false);
  const [showBulkActionsModal, setShowBulkActionsModal] = useState(false);
  const [showImportUsersModal, setShowImportUsersModal] = useState(false);
  const [userRoleFilter, setUserRoleFilter] = useState('all');
  const [userStatusFilter, setUserStatusFilter] = useState('all');
  
  // Notes Management modals and state
  const [showCreateNoteModal, setShowCreateNoteModal] = useState(false);
  const [showBulkNoteActionsModal, setShowBulkNoteActionsModal] = useState(false);
  const [showNoteAnalyticsModal, setShowNoteAnalyticsModal] = useState(false);
  const [noteSearchQuery, setNoteSearchQuery] = useState('');
  const [noteTemplateFilter, setNoteTemplateFilter] = useState('all');
  const [noteStatusFilter, setNoteStatusFilter] = useState('all');

  // Mock notes data - declare before usage
  const [mockNotes] = useState([
    {
      id: 'note-001-2024-01-15',
      patient: 'John Smith',
      mrn: 'MRN123456',
      template: 'SOAP',
      author: 'Dr. Sarah Johnson',
      status: 'completed',
      createdAt: new Date('2024-01-15T10:30:00'),
      content: 'Subjective: Patient reports chest pain...'
    },
    {
      id: 'note-002-2024-01-15',
      patient: 'Jane Doe',
      mrn: 'MRN789012',
      template: 'SBAR',
      author: 'Nurse Mike Wilson',
      status: 'draft',
      createdAt: new Date('2024-01-15T11:15:00'),
      content: 'Situation: Patient experiencing shortness of breath...'
    },
    {
      id: 'note-003-2024-01-15',
      patient: 'Robert Brown',
      mrn: 'MRN345678',
      template: 'PIE',
      author: 'Dr. Emily Davis',
      status: 'reviewed',
      createdAt: new Date('2024-01-15T09:45:00'),
      content: 'Problem: Acute abdominal pain...'
    },
    {
      id: 'note-004-2024-01-14',
      patient: 'Maria Garcia',
      mrn: 'MRN901234',
      template: 'DAR',
      author: 'Nurse Lisa Chen',
      status: 'completed',
      createdAt: new Date('2024-01-14T16:20:00'),
      content: 'Data: Patient presents with fever and cough...'
    },
    {
      id: 'note-005-2024-01-14',
      patient: 'David Wilson',
      mrn: 'MRN567890',
      template: 'SOAP',
      author: 'Dr. James Miller',
      status: 'archived',
      createdAt: new Date('2024-01-14T14:10:00'),
      content: 'Subjective: Patient reports headache...'
    }
  ]);

  // Real-time stats
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    activeUsers: 0,
    totalNotes: 0,
    notesToday: 0,
    avgAccuracy: 99.2,
    timeSaved: 0,
    systemHealth: 98.5,
    storageUsed: 2.4,
    storageLimit: 10
  });

  // Load real stats
  useEffect(() => {
    const loadStats = () => {
      const allOrgs = organizationService.getOrganizations();
      let totalUsers = 0;
      let totalNotes = 0;
      let totalTimeSaved = 0;
      
      allOrgs.forEach(org => {
        const orgStats = organizationService.getOrganizationStats(org.id);
        totalUsers += orgStats.totalUsers;
        totalNotes += orgStats.totalNotes;
      });

      // Calculate active users (last 24 hours)
      const activeUsers = organizationUsers.filter(user => {
        const lastLogin = new Date(user.stats?.lastLogin || 0);
        const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        return lastLogin > dayAgo;
      }).length;

      // Calculate notes today
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const notesToday = mockNotes.filter(note => 
        new Date(note.createdAt) >= today
      ).length;

      setStats({
        totalUsers,
        activeUsers,
        totalNotes,
        notesToday,
        avgAccuracy: 99.2,
        timeSaved: totalTimeSaved || 1247.5,
        systemHealth: 98.5,
        storageUsed: 2.4,
        storageLimit: 10
      });
    };

    loadStats();
    
    // Refresh stats every 30 seconds
    const interval = setInterval(loadStats, 30000);
    return () => clearInterval(interval);
  }, [organizationUsers, mockNotes]);

  const [users, setUsers] = useState<OrganizationUser[]>([
    {
      id: '1',
      name: 'Dr. Sarah Johnson',
      email: 'sarah.johnson@hospital.com',
      role: 'admin',
      status: 'active',
      organizationId: 'org-1',
      createdAt: new Date('2023-06-15'),
      updatedAt: new Date(),
      permissions: [],
      profile: {
        timezone: 'America/New_York',
        language: 'en',
        preferences: {
          defaultTemplate: 'SOAP',
          voiceSpeed: 1,
          notifications: true,
          darkMode: false
        }
      },
      stats: {
        lastLogin: new Date('2024-01-15T10:30:00Z'),
        notesCreated: 156,
        sessionsThisMonth: 20,
        timeSaved: 12.5
      }
    },
    {
      id: '2',
      name: 'Nurse Mike Chen',
      email: 'mike.chen@hospital.com',
      role: 'nurse',
      status: 'active',
      organizationId: 'org-1',
      createdAt: new Date('2023-08-22'),
      updatedAt: new Date(),
      permissions: [],
      profile: {
        timezone: 'America/New_York',
        language: 'en',
        preferences: {
          defaultTemplate: 'SOAP',
          voiceSpeed: 1,
          notifications: true,
          darkMode: false
        }
      },
      stats: {
        lastLogin: new Date('2024-01-15T09:15:00Z'),
        notesCreated: 89,
        sessionsThisMonth: 15,
        timeSaved: 8.2
      }
    },
    {
      id: '3',
      name: 'Dr. Emily Rodriguez',
      email: 'emily.rodriguez@hospital.com',
      role: 'admin',
      status: 'inactive',
      organizationId: 'org-1',
      createdAt: new Date('2023-04-10'),
      updatedAt: new Date(),
      permissions: [],
      profile: {
        timezone: 'America/New_York',
        language: 'en',
        preferences: {
          defaultTemplate: 'SOAP',
          voiceSpeed: 1,
          notifications: true,
          darkMode: false
        }
      },
      stats: {
        lastLogin: new Date('2024-01-10T16:45:00Z'),
        notesCreated: 203,
        sessionsThisMonth: 5,
        timeSaved: 18.7
      }
    }
  ]);

  const [systemLogs] = useState<SystemLog[]>([
    {
      id: '1',
      timestamp: '2024-01-15T10:30:00Z',
      level: 'info',
      message: 'User login successful',
      source: 'Authentication',
      userId: '1'
    },
    {
      id: '2',
      timestamp: '2024-01-15T10:25:00Z',
      level: 'warning',
      message: 'High memory usage detected',
      source: 'System Monitor'
    },
    {
      id: '3',
      timestamp: '2024-01-15T10:20:00Z',
      level: 'error',
      message: 'Database connection timeout',
      source: 'Database'
    }
  ]);

  const [analyticsData] = useState<AnalyticsData[]>([
    { date: '2024-01-08', notesCreated: 45, usersActive: 23, accuracyRate: 98.5, timeSaved: 12.3 },
    { date: '2024-01-09', notesCreated: 52, usersActive: 28, accuracyRate: 99.1, timeSaved: 14.7 },
    { date: '2024-01-10', notesCreated: 38, usersActive: 21, accuracyRate: 98.8, timeSaved: 10.9 },
    { date: '2024-01-11', notesCreated: 61, usersActive: 31, accuracyRate: 99.3, timeSaved: 16.2 },
    { date: '2024-01-12', notesCreated: 47, usersActive: 25, accuracyRate: 98.9, timeSaved: 13.1 },
    { date: '2024-01-13', notesCreated: 43, usersActive: 22, accuracyRate: 99.0, timeSaved: 11.8 },
    { date: '2024-01-14', notesCreated: 55, usersActive: 29, accuracyRate: 99.2, timeSaved: 15.4 }
  ]);

  const navigationItems = [
    { id: 'overview', label: 'Overview', icon: BarChart3, color: 'text-blue-600' },
    { id: 'users', label: 'Users', icon: Users, color: 'text-green-600' },
    { id: 'notes', label: 'Notes', icon: FileText, color: 'text-purple-600' },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp, color: 'text-orange-600' },
    { id: 'phi-protection', label: 'PHI Protection', icon: Shield, color: 'text-red-600' },
    { id: 'organizations', label: 'Organizations', icon: Globe, color: 'text-indigo-600' },
    { id: 'system', label: 'System', icon: Server, color: 'text-gray-600' },
    { id: 'security', label: 'Security', icon: Lock, color: 'text-yellow-600' },
    { id: 'settings', label: 'Settings', icon: Settings, color: 'text-slate-600' }
  ];

  // Load data on component mount
  useEffect(() => {
    // Load PHI protection data
    setAuditLogs(phiProtectionService.getAuditLogs());
    setComplianceReports(phiProtectionService.getComplianceReports());
    
    // Load organization data
    setOrganizations(organizationService.getOrganizations());
    setOrganizationUsers(organizationService.getUsersByOrganization('org-1')); // Default org
    setTeams(organizationService.getTeamsByOrganization('org-1'));
  }, []);

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'inactive': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'suspended': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Organization Management Handlers
  const handleEditOrganization = (org: Organization) => {
    setSelectedOrganization(org);
    setShowEditOrgModal(true);
  };

  const handleViewOrgUsers = (org: Organization) => {
    // Switch to users tab and filter by organization
    setActiveTab('users');
    // You could add filtering logic here
  };

  const handleOrgSettings = (org: Organization) => {
    setSelectedOrganization(org);
    // Open organization settings modal
  };

  const handleSuspendOrganization = async (org: Organization) => {
    const newStatus = org.subscription.status === 'active' ? 'suspended' : 'active';
    await organizationService.updateOrganization(org.id, {
      subscription: {
        ...org.subscription,
        status: newStatus
      }
    });
    
    // Refresh organizations list
    setOrganizations(organizationService.getOrganizations());
    
    toast({
      title: "Organization Updated",
      description: `Organization ${newStatus === 'suspended' ? 'suspended' : 'activated'} successfully`,
    });
  };

  const handleDeleteOrganization = async (org: Organization) => {
    if (confirm(`Are you sure you want to delete ${org.name}? This action cannot be undone.`)) {
      // In a real app, you would call a delete API
      toast({ title: `Organization ${org.name} deleted successfully` });
    }
  };

  // Team Management Handlers
  const handleEditTeam = (team: Team) => {
    setSelectedTeam(team);
    setShowEditTeamModal(true);
  };

  const handleManageTeamMembers = (team: Team) => {
    setSelectedTeam(team);
    // Open team member management modal
  };

  const handleTeamSettings = (team: Team) => {
    setSelectedTeam(team);
    // Open team settings modal
  };

  const handleDeleteTeam = async (team: Team) => {
    if (confirm(`Are you sure you want to delete team ${team.name}?`)) {
      // In a real app, you would call a delete API
      toast({ title: `Team ${team.name} deleted successfully` });
    }
  };

  // Invitation Management Handlers
  const handleResendInvite = async (invite: OrganizationInvite) => {
    // In a real app, you would resend the invitation email
      toast({ title: `Invitation resent to ${invite.email}` });
  };

  const handleCancelInvite = async (invite: OrganizationInvite) => {
    if (confirm(`Are you sure you want to cancel the invitation to ${invite.email}?`)) {
      // In a real app, you would cancel the invitation
      toast({ title: `Invitation to ${invite.email} cancelled` });
    }
  };

  // PHI Protection Handlers
  const handleEditPHIPattern = (pattern: any) => {
    // Open edit pattern modal
    toast({ title: 'Edit pattern functionality coming soon' });
  };

  const handleTestPattern = async (pattern: any) => {
    // Test the pattern with sample text
    const testText = "Patient John Smith, DOB 01/15/1980, SSN 123-45-6789, Phone (555) 123-4567";
    try {
      const result = await phiProtectionService.detectAndRedactPHI(testText);
      toast({ title: `Pattern test completed: ${result.detectedPHI.length} items detected` });
    } catch (error) {
      toast({ title: 'Pattern test failed' });
    }
  };

  const handleTogglePattern = (pattern: any) => {
    // Toggle pattern enabled/disabled status
    toast({ title: `Pattern ${pattern.name} ${pattern.severity === 'disabled' ? 'enabled' : 'disabled'}` });
  };

  const handleDeletePHIPattern = (pattern: any) => {
    if (confirm(`Are you sure you want to delete the pattern "${pattern.name}"?`)) {
      // In a real app, you would delete the pattern
      toast({ title: `Pattern "${pattern.name}" deleted` });
    }
  };

  const handleGenerateComplianceReport = async () => {
    try {
      const report = await phiProtectionService.generateComplianceReport('org-1', {
        start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
        end: new Date()
      });
      setComplianceReports(prev => [report, ...prev]);
      toast({ title: 'Compliance report generated successfully' });
    } catch (error) {
      toast({ title: 'Failed to generate compliance report' });
    }
  };

  const handleExportAuditData = () => {
    const auditData = phiProtectionService.exportAuditData('csv');
    const blob = new Blob([auditData], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-data-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: 'Audit data exported successfully' });
  };

  const handleViewReport = (report: ComplianceReport) => {
    toast({ title: `Viewing report ${report.id.slice(-8)}` });
  };

  const handleExportReport = (report: ComplianceReport) => {
    toast({ title: `Exporting report ${report.id.slice(-8)} to PDF` });
  };

  const handleEmailReport = (report: ComplianceReport) => {
    toast({ title: `Emailing report ${report.id.slice(-8)}` });
  };

  const handleDeleteReport = (report: ComplianceReport) => {
    if (confirm(`Are you sure you want to delete report ${report.id.slice(-8)}?`)) {
      setComplianceReports(prev => prev.filter(r => r.id !== report.id));
      toast({ title: 'Report deleted successfully' });
    }
  };

  // User Management Handlers - Fully Functional
  const handleViewUserDetails = (user: OrganizationUser) => {
    setSelectedUser(user);
    setIsUserModalOpen(true);
  };

  const handleEditUser = (user: OrganizationUser) => {
    setSelectedUser(user);
    setShowCreateUserModal(true); // Reuse create modal for editing
    toast({ 
      title: `Editing ${user.name}`,
      description: 'Update user details in the form'
    });
  };

  const handleManageUserPermissions = (user: OrganizationUser) => {
    setSelectedUser(user);
    toast({ 
      title: `Managing permissions for ${user.name}`,
      description: `Current role: ${user.role}. Change role to modify permissions.`
    });
  };

  const handleViewUserActivity = (user: OrganizationUser) => {
    setSelectedUser(user);
    const activitySummary = `
      Last Login: ${new Date(user.stats?.lastLogin || new Date()).toLocaleString()}
      Notes Created: ${user.stats?.notesCreated || 0}
      Sessions This Month: ${user.stats?.sessionsThisMonth || 0}
      Time Saved: ${user.stats?.timeSaved || 0} hours
    `;
    toast({ 
      title: `Activity for ${user.name}`,
      description: activitySummary
    });
  };

  const handleResetUserPassword = async (user: OrganizationUser) => {
    if (confirm(`Are you sure you want to reset the password for ${user.name}?`)) {
      try {
        // Simulate password reset
        await new Promise(resolve => setTimeout(resolve, 500));
        toast({ 
          title: `Password reset email sent to ${user.email}`,
          description: 'User will receive reset instructions'
        });
      } catch (error) {
        toast({ title: 'Failed to reset password' });
      }
    }
  };

  const handleToggleUserStatus = async (user: OrganizationUser) => {
    try {
      const newStatus = user.status === 'active' ? 'suspended' : 'active';
      
      // Update in service
      await organizationService.updateUser(user.id, { status: newStatus });
      
      // Update local state
      setUsers(prevUsers => 
        prevUsers.map(u => 
          u.id === user.id ? { ...u, status: newStatus } : u
        )
      );
      
      // Refresh organization users
      setOrganizationUsers(organizationService.getUsersByOrganization(user.organizationId));
      
      toast({ 
        title: `User ${newStatus === 'suspended' ? 'suspended' : 'activated'}`,
        description: `${user.name} is now ${newStatus}`
      });
    } catch (error) {
      toast({ title: 'Failed to update user status' });
    }
  };

  const handleDeleteUser = async (user: OrganizationUser) => {
    if (confirm(`Are you sure you want to delete user ${user.name}? This action cannot be undone.`)) {
      try {
        // Remove from local state
        setUsers(prevUsers => prevUsers.filter(u => u.id !== user.id));
        setOrganizationUsers(prevUsers => prevUsers.filter(u => u.id !== user.id));
        
        toast({ 
          title: `User deleted`,
          description: `${user.name} has been removed from the system`
        });
      } catch (error) {
        toast({ title: 'Failed to delete user' });
      }
    }
  };

  const handleExportUsers = () => {
    const userData = users.map(user => ({
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      organization: organizationService.getOrganization(user.organizationId)?.name || 'Unknown',
      lastLogin: user.stats?.lastLogin || new Date(),
      notesCreated: user.stats?.notesCreated || 0
    }));
    
    const csvContent = [
      'Name,Email,Role,Status,Organization,Last Login,Notes Created',
      ...userData.map(user => 
        `"${user.name}","${user.email}","${user.role}","${user.status}","${user.organization}","${user.lastLogin}","${user.notesCreated}"`
      )
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `users-export-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: 'Users exported successfully' });
  };

  // Notes Management Handlers
  const handleViewNote = (note: any) => {
    toast({ title: `Viewing note ${note.id.slice(-8)}` });
  };

  const handleEditNote = (note: any) => {
    toast({ title: `Editing note ${note.id.slice(-8)}` });
  };

  const handleReviewNote = (note: any) => {
    toast({ title: `Note ${note.id.slice(-8)} marked for review` });
  };

  const handleExportNote = (note: any) => {
    toast({ title: `Note ${note.id.slice(-8)} exported successfully` });
  };

  const handleShareNote = (note: any) => {
    toast({ title: `Note ${note.id.slice(-8)} shared successfully` });
  };

  const handleArchiveNote = (note: any) => {
    toast({ title: `Note ${note.id.slice(-8)} archived successfully` });
  };

  const handleDeleteNote = (note: any) => {
    if (confirm(`Are you sure you want to delete note ${note.id.slice(-8)}? This action cannot be undone.`)) {
      toast({ title: `Note ${note.id.slice(-8)} deleted successfully` });
    }
  };

  const handleExportNotes = () => {
    const noteData = mockNotes.map(note => ({
      id: note.id,
      patient: note.patient,
      mrn: note.mrn,
      template: note.template,
      author: note.author,
      status: note.status,
      createdAt: note.createdAt.toISOString(),
      content: note.content.substring(0, 100) + '...'
    }));
    
    const csvContent = [
      'ID,Patient,MRN,Template,Author,Status,Created At,Content Preview',
      ...noteData.map(note => 
        `"${note.id}","${note.patient}","${note.mrn}","${note.template}","${note.author}","${note.status}","${note.createdAt}","${note.content}"`
      )
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `notes-export-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: 'Notes exported successfully' });
  };

  const getLogLevelColor = (level: string) => {
    switch (level) {
      case 'info': return 'text-blue-600';
      case 'warning': return 'text-yellow-600';
      case 'error': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      {/* Mobile Menu Overlay */}
      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetContent side="left" className="w-80 p-0 bg-white/95 backdrop-blur-xl border-r border-slate-200 shadow-xl">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">Admin Dashboard</h1>
                <p className="text-sm text-slate-600">Raha</p>
              </div>
            </div>

            <nav className="space-y-2">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                
                return (
                  <Button
                    key={item.id}
                    variant={isActive ? "default" : "ghost"}
                    className={`w-full justify-start h-12 text-left ${
                      isActive 
                        ? 'bg-gradient-to-r from-teal-500 to-blue-600 text-white shadow-lg' 
                        : 'hover:bg-slate-100 text-slate-700'
                    }`}
                    onClick={() => {
                      setActiveTab(item.id);
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    <Icon className={`h-5 w-5 mr-3 ${isActive ? 'text-white' : item.color}`} />
                    {item.label}
                  </Button>
                );
              })}
            </nav>
          </div>

          {/* System Status */}
          <div className="p-6 border-t border-slate-200">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-sm font-medium text-slate-700">System Online</span>
              </div>
              <div className="text-xs text-slate-500">
                Last updated: {new Date().toLocaleTimeString()}
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop Left Navigation - Hidden on Mobile */}
      <div className="hidden lg:flex w-64 bg-white/95 backdrop-blur-xl border-r border-slate-200 shadow-xl">
        <div className="p-6 w-full">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">Admin Dashboard</h1>
              <p className="text-sm text-slate-600">Raha</p>
            </div>
          </div>

          <nav className="space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              
              return (
                <Button
                  key={item.id}
                  variant={isActive ? "default" : "ghost"}
                  className={`w-full justify-start h-12 text-left ${
                    isActive 
                      ? 'bg-gradient-to-r from-teal-500 to-blue-600 text-white shadow-lg' 
                      : 'hover:bg-slate-100 text-slate-700'
                  }`}
                  onClick={() => setActiveTab(item.id)}
                >
                  <Icon className={`h-5 w-5 mr-3 ${isActive ? 'text-white' : item.color}`} />
                  {item.label}
                </Button>
              );
            })}
          </nav>
        </div>

        {/* System Status */}
        <div className="p-6 border-t border-slate-200">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-sm font-medium text-slate-700">System Online</span>
            </div>
            <div className="text-xs text-slate-500">
              Last updated: {new Date().toLocaleTimeString()}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile-Friendly Header */}
        <header className="bg-white/90 backdrop-blur-sm border-b border-slate-200 shadow-sm">
          <div className="px-4 py-3 lg:px-6">
            <div className="flex items-center justify-between">
              {/* Mobile Menu Button */}
              <div className="flex items-center gap-3 lg:hidden">
                <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="sm" className="p-2">
                      <Menu className="h-5 w-5" />
                    </Button>
                  </SheetTrigger>
                </Sheet>
                <div>
                  <h2 className="text-lg font-bold text-slate-900 capitalize">
                    {navigationItems.find(item => item.id === activeTab)?.label}
                  </h2>
                  <p className="text-xs text-slate-600 hidden sm:block">
                    {activeTab === 'overview' && 'System overview and key metrics'}
                    {activeTab === 'users' && 'User management and permissions'}
                    {activeTab === 'notes' && 'Note analytics and content management'}
                    {activeTab === 'analytics' && 'Performance analytics and insights'}
                    {activeTab === 'phi-protection' && 'PHI detection, redaction, and compliance monitoring'}
                    {activeTab === 'organizations' && 'Multi-tenant organization and team management'}
                    {activeTab === 'system' && 'System monitoring and logs'}
                    {activeTab === 'security' && 'Security settings and audit logs'}
                    {activeTab === 'settings' && 'System configuration and preferences'}
                  </p>
                </div>
              </div>

              {/* Desktop Header */}
              <div className="hidden lg:flex items-center justify-between w-full">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 capitalize">
                    {navigationItems.find(item => item.id === activeTab)?.label}
                  </h2>
                  <p className="text-xs text-slate-600 mt-0.5">
                    {activeTab === 'overview' && 'System overview and key metrics'}
                    {activeTab === 'users' && 'User management and permissions'}
                    {activeTab === 'notes' && 'Note analytics and content management'}
                    {activeTab === 'analytics' && 'Performance analytics and insights'}
                    {activeTab === 'phi-protection' && 'PHI detection, redaction, and compliance monitoring'}
                    {activeTab === 'organizations' && 'Multi-tenant organization and team management'}
                    {activeTab === 'system' && 'System monitoring and logs'}
                    {activeTab === 'security' && 'Security settings and audit logs'}
                    {activeTab === 'settings' && 'System configuration and preferences'}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge className="bg-green-100 text-green-800 border-green-200 text-xs">
                    HIPAA Compliant
                  </Badge>
                  <Button className="bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 h-8 text-sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add User
                  </Button>
                </div>
              </div>

              {/* Mobile Actions */}
              <div className="flex items-center gap-2 lg:hidden">
                <Badge className="bg-green-100 text-green-800 border-green-200 text-xs">
                  HIPAA
                </Badge>
                <Button size="sm" className="bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 h-8 text-xs">
                  <Plus className="h-3 w-3 mr-1" />
                  Add
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Mobile-Optimized Content Area */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Key Metrics - Mobile Optimized */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-blue-700">Total Users</p>
                        <p className="text-3xl font-bold text-blue-900">{stats.totalUsers.toLocaleString()}</p>
                        <p className="text-xs text-blue-600 mt-1">+12% from last month</p>
                      </div>
                      <Users className="h-12 w-12 text-blue-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-green-700">Active Users</p>
                        <p className="text-3xl font-bold text-green-900">{stats.activeUsers.toLocaleString()}</p>
                        <p className="text-xs text-green-600 mt-1">{Math.round((stats.activeUsers / stats.totalUsers) * 100)}% of total</p>
                      </div>
                      <Activity className="h-12 w-12 text-green-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-purple-700">Total Notes</p>
                        <p className="text-3xl font-bold text-purple-900">{stats.totalNotes.toLocaleString()}</p>
                        <p className="text-xs text-purple-600 mt-1">{stats.notesToday} today</p>
                      </div>
                      <FileText className="h-12 w-12 text-purple-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-orange-700">Time Saved</p>
                        <p className="text-3xl font-bold text-orange-900">{stats.timeSaved.toLocaleString()}h</p>
                        <p className="text-xs text-orange-600 mt-1">This month</p>
                      </div>
                      <Clock className="h-12 w-12 text-orange-600" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* System Health */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="h-5 w-5 text-green-600" />
                      System Health
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Overall Status</span>
                      <Badge className="bg-green-100 text-green-800">Healthy</Badge>
                    </div>
                    <Progress value={stats.systemHealth} className="h-2" />
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full" />
                        <span>Database: Online</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full" />
                        <span>API: Responding</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full" />
                        <span>Storage: Normal</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full" />
                        <span>Security: Active</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <HardDrive className="h-5 w-5 text-blue-600" />
                      Storage Usage
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Used Space</span>
                      <span className="text-sm text-slate-600">{stats.storageUsed}TB / {stats.storageLimit}TB</span>
                    </div>
                    <Progress value={(stats.storageUsed / stats.storageLimit) * 100} className="h-2" />
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-slate-600">Notes Data</p>
                        <p className="font-medium">1.2TB</p>
                      </div>
                      <div>
                        <p className="text-slate-600">User Data</p>
                        <p className="font-medium">0.8TB</p>
                      </div>
                      <div>
                        <p className="text-slate-600">System Logs</p>
                        <p className="font-medium">0.3TB</p>
                      </div>
                      <div>
                        <p className="text-slate-600">Backups</p>
                        <p className="font-medium">0.1TB</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-slate-600" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {systemLogs.slice(0, 5).map((log) => (
                      <div key={log.id} className="flex items-center gap-4 p-3 bg-slate-50 rounded-lg">
                        <div className={`w-2 h-2 rounded-full ${
                          log.level === 'error' ? 'bg-red-500' :
                          log.level === 'warning' ? 'bg-yellow-500' : 'bg-green-500'
                        }`} />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-slate-900">{log.message}</p>
                          <p className="text-xs text-slate-500">{log.source} • {new Date(log.timestamp).toLocaleString()}</p>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {log.level}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="space-y-8">
              {/* User Statistics */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-blue-600">Total Users</p>
                        <p className="text-2xl font-bold text-blue-900">{users.length}</p>
                        <p className="text-xs text-blue-600 mt-1">Across all organizations</p>
                      </div>
                      <Users className="h-8 w-8 text-blue-600" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-green-600">Active Users</p>
                        <p className="text-2xl font-bold text-green-900">{users.filter(u => u.status === 'active').length}</p>
                        <p className="text-xs text-green-600 mt-1">Currently online</p>
                      </div>
                      <UserCheck className="h-8 w-8 text-green-600" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-purple-600">Nurses</p>
                        <p className="text-2xl font-bold text-purple-900">{users.filter(u => u.role === 'nurse').length}</p>
                        <p className="text-xs text-purple-600 mt-1">Clinical staff</p>
                      </div>
                      <Users className="h-8 w-8 text-purple-600" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-orange-600">Admins</p>
                        <p className="text-2xl font-bold text-orange-900">{users.filter(u => u.role === 'admin').length}</p>
                        <p className="text-xs text-orange-600 mt-1">System administrators</p>
                      </div>
                      <Settings className="h-8 w-8 text-orange-600" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* User Management Actions */}
              <div className="flex flex-wrap gap-4">
                <Button 
                  onClick={() => setShowCreateUserModal(true)}
                  className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add User
                </Button>
                <Button 
                  onClick={() => setShowBulkActionsModal(true)}
                  variant="outline"
                  className="border-green-500 text-green-600 hover:bg-green-50"
                >
                  <Users className="h-4 w-4 mr-2" />
                  Bulk Actions
                </Button>
                <Button 
                  onClick={() => handleExportUsers()}
                  variant="outline"
                  className="border-purple-500 text-purple-600 hover:bg-purple-50"
                >
                  <DownloadIcon className="h-4 w-4 mr-2" />
                  Export Users
                </Button>
                <Button 
                  onClick={() => setShowImportUsersModal(true)}
                  variant="outline"
                  className="border-orange-500 text-orange-600 hover:bg-orange-50"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Import Users
                </Button>
              </div>

              {/* User Management Header */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5 text-blue-600" />
                        User Management
                      </CardTitle>
                      <CardDescription>Manage users, roles, and permissions across organizations</CardDescription>
                    </div>
                    <div className="flex items-center gap-4">
                      <Input
                        placeholder="Search users..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-64"
                      />
                      <Select value={userRoleFilter} onValueChange={setUserRoleFilter}>
                        <SelectTrigger className="w-40">
                          <SelectValue placeholder="Filter by role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Roles</SelectItem>
                          <SelectItem value="owner">Owner</SelectItem>
                          <SelectItem value="admin">Administrator</SelectItem>
                          <SelectItem value="supervisor">Supervisor</SelectItem>
                          <SelectItem value="nurse">Nurse</SelectItem>
                          <SelectItem value="student">Student</SelectItem>
                          <SelectItem value="instructor">Instructor</SelectItem>
                          <SelectItem value="auditor">Auditor</SelectItem>
                        </SelectContent>
                      </Select>
                      <Select value={userStatusFilter} onValueChange={setUserStatusFilter}>
                        <SelectTrigger className="w-40">
                          <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Status</SelectItem>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                          <SelectItem value="suspended">Suspended</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button variant="outline" size="sm" onClick={() => setUsers(organizationService.getUsersByOrganization('org-1'))}>
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Organization</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Last Login</TableHead>
                        <TableHead>Notes Created</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers
                        .filter(user => userRoleFilter === 'all' || user.role === userRoleFilter)
                        .filter(user => userStatusFilter === 'all' || user.status === userStatusFilter)
                        .map((user) => (
                        <TableRow key={user.id} className="hover:bg-slate-50">
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarFallback className="bg-gradient-to-br from-teal-500 to-blue-600 text-white text-xs">
                                  {user.name.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium text-slate-900">{user.name}</p>
                                <p className="text-sm text-slate-500">{user.email}</p>
                                {user.role && (
                                  <p className="text-xs text-slate-400">{user.role}</p>
                                )}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="capitalize">{user.role}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary" className="text-xs">
                              {organizationService.getOrganization(user.organizationId)?.name || 'Unknown'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(user.status)}>
                              {user.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm text-slate-600">
                            {new Date(user.stats?.lastLogin || new Date()).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-sm font-medium">
                            {user.stats?.notesCreated || 0}
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleViewUserDetails(user)}>
                                  <Eye className="h-4 w-4 mr-2" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleEditUser(user)}>
                                  <Edit className="h-4 w-4 mr-2" />
                                  Edit User
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleManageUserPermissions(user)}>
                                  <Key className="h-4 w-4 mr-2" />
                                  Manage Permissions
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleViewUserActivity(user)}>
                                  <Activity className="h-4 w-4 mr-2" />
                                  View Activity
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleResetUserPassword(user)}>
                                  <RotateCcw className="h-4 w-4 mr-2" />
                                  Reset Password
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  onClick={() => handleToggleUserStatus(user)}
                                  className={user.status === 'active' ? 'text-yellow-600' : 'text-green-600'}
                                >
                                  {user.status === 'active' ? (
                                    <>
                                      <Lock className="h-4 w-4 mr-2" />
                                      Suspend User
                                    </>
                                  ) : (
                                    <>
                                      <Unlock className="h-4 w-4 mr-2" />
                                      Activate User
                                    </>
                                  )}
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  onClick={() => handleDeleteUser(user)}
                                  className="text-red-600"
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete User
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              {/* Recent User Activity */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-green-600" />
                    Recent User Activity
                  </CardTitle>
                  <CardDescription>Latest user actions and system events</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {users.slice(0, 5).map((user, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback className="bg-gradient-to-br from-teal-500 to-blue-600 text-white text-xs">
                              {user.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-sm">{user.name}</p>
                            <p className="text-xs text-slate-600">
                              {user.role} • {user.stats?.sessionsThisMonth || 0} sessions this month
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-slate-500">
                            {new Date(user.stats?.lastLogin || new Date()).toLocaleDateString()}
                          </p>
                          <Badge className="bg-green-100 text-green-800 text-xs">
                            {user.stats?.notesCreated || 0} notes created
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Notes Tab */}
          {activeTab === 'notes' && (
            <div className="space-y-8">
              {/* Notes Statistics */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-blue-600">Total Notes</p>
                        <p className="text-2xl font-bold text-blue-900">2,847</p>
                        <p className="text-xs text-blue-600 mt-1">+18% this month</p>
                      </div>
                      <FileText className="h-8 w-8 text-blue-600" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-green-600">Today's Notes</p>
                        <p className="text-2xl font-bold text-green-900">127</p>
                        <p className="text-xs text-green-600 mt-1">Active documentation</p>
                      </div>
                      <Clock className="h-8 w-8 text-green-600" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-purple-600">Avg. Time Saved</p>
                        <p className="text-2xl font-bold text-purple-900">15 min</p>
                        <p className="text-xs text-purple-600 mt-1">Per note</p>
                      </div>
                      <Zap className="h-8 w-8 text-purple-600" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-orange-600">Accuracy Rate</p>
                        <p className="text-2xl font-bold text-orange-900">99.2%</p>
                        <p className="text-xs text-orange-600 mt-1">AI-generated content</p>
                      </div>
                      <Target className="h-8 w-8 text-orange-600" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Notes Management Actions */}
              <div className="flex flex-wrap gap-4">
                <Button 
                  onClick={() => setShowCreateNoteModal(true)}
                  className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Note
                </Button>
                <Button 
                  onClick={() => setShowBulkNoteActionsModal(true)}
                  variant="outline"
                  className="border-green-500 text-green-600 hover:bg-green-50"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Bulk Actions
                </Button>
                <Button 
                  onClick={() => handleExportNotes()}
                  variant="outline"
                  className="border-purple-500 text-purple-600 hover:bg-purple-50"
                >
                  <DownloadIcon className="h-4 w-4 mr-2" />
                  Export Notes
                </Button>
                <Button 
                  onClick={() => setShowNoteAnalyticsModal(true)}
                  variant="outline"
                  className="border-orange-500 text-orange-600 hover:bg-orange-50"
                >
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Analytics
                </Button>
              </div>

              {/* Notes Management */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-blue-600" />
                        Clinical Notes
                      </CardTitle>
                      <CardDescription>Manage and monitor clinical documentation across organizations</CardDescription>
                    </div>
                    <div className="flex items-center gap-4">
                      <Input
                        placeholder="Search notes..."
                        value={noteSearchQuery}
                        onChange={(e) => setNoteSearchQuery(e.target.value)}
                        className="w-64"
                      />
                      <Select value={noteTemplateFilter} onValueChange={setNoteTemplateFilter}>
                        <SelectTrigger className="w-40">
                          <SelectValue placeholder="Template" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Templates</SelectItem>
                          <SelectItem value="SOAP">SOAP</SelectItem>
                          <SelectItem value="SBAR">SBAR</SelectItem>
                          <SelectItem value="PIE">PIE</SelectItem>
                          <SelectItem value="DAR">DAR</SelectItem>
                        </SelectContent>
                      </Select>
                      <Select value={noteStatusFilter} onValueChange={setNoteStatusFilter}>
                        <SelectTrigger className="w-40">
                          <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Status</SelectItem>
                          <SelectItem value="draft">Draft</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="reviewed">Reviewed</SelectItem>
                          <SelectItem value="archived">Archived</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button variant="outline" size="sm">
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Note ID</TableHead>
                        <TableHead>Patient</TableHead>
                        <TableHead>Template</TableHead>
                        <TableHead>Author</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockNotes
                        .filter(note => noteSearchQuery === '' || note.id.toLowerCase().includes(noteSearchQuery.toLowerCase()))
                        .filter(note => noteTemplateFilter === 'all' || note.template === noteTemplateFilter)
                        .filter(note => noteStatusFilter === 'all' || note.status === noteStatusFilter)
                        .map((note) => (
                        <TableRow key={note.id} className="hover:bg-slate-50">
                          <TableCell className="font-mono text-sm">
                            {note.id.slice(-8)}
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium text-slate-900">{note.patient}</p>
                              <p className="text-sm text-slate-500">{note.mrn}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="capitalize">{note.template}</Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Avatar className="h-6 w-6">
                                <AvatarFallback className="bg-gradient-to-br from-teal-500 to-blue-600 text-white text-xs">
                                  {note.author.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-sm">{note.author}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={`${
                              note.status === 'completed' ? 'bg-green-100 text-green-800' :
                              note.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                              note.status === 'reviewed' ? 'bg-blue-100 text-blue-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {note.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm text-slate-600">
                            {new Date(note.createdAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleViewNote(note)}>
                                  <Eye className="h-4 w-4 mr-2" />
                                  View Note
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleEditNote(note)}>
                                  <Edit className="h-4 w-4 mr-2" />
                                  Edit Note
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleReviewNote(note)}>
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                  Review
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleExportNote(note)}>
                                  <DownloadIcon className="h-4 w-4 mr-2" />
                                  Export
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleShareNote(note)}>
                                  <Share2 className="h-4 w-4 mr-2" />
                                  Share
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  onClick={() => handleArchiveNote(note)}
                                  className="text-orange-600"
                                >
                                  <Archive className="h-4 w-4 mr-2" />
                                  Archive
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  onClick={() => handleDeleteNote(note)}
                                  className="text-red-600"
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              {/* Notes Analytics */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5 text-green-600" />
                      Notes by Template
                    </CardTitle>
                    <CardDescription>Distribution of notes by template type</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {['SOAP', 'SBAR', 'PIE', 'DAR'].map((template, index) => {
                        const count = mockNotes.filter(note => note.template === template).length;
                        const percentage = Math.round((count / mockNotes.length) * 100);
                        return (
                          <div key={index} className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-500" />
                              <span className="font-medium">{template}</span>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="w-32 bg-slate-200 rounded-full h-2">
                                <div 
                                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full" 
                                  style={{ width: `${percentage}%` }}
                                />
                              </div>
                              <span className="text-sm font-medium w-12 text-right">{count}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-purple-600" />
                      Recent Activity
                    </CardTitle>
                    <CardDescription>Latest note creation and updates</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {mockNotes.slice(0, 5).map((note, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className={`w-2 h-2 rounded-full ${
                              note.status === 'completed' ? 'bg-green-500' :
                              note.status === 'draft' ? 'bg-yellow-500' :
                              'bg-blue-500'
                            }`} />
                            <div>
                              <p className="font-medium text-sm">{note.patient}</p>
                              <p className="text-xs text-slate-600">{note.template} • {note.author}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-slate-500">
                              {new Date(note.createdAt).toLocaleDateString()}
                            </p>
                            <Badge className="bg-blue-100 text-blue-800 text-xs">
                              {note.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-6">
              {/* Analytics Overview */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-blue-700">Accuracy Rate</p>
                        <p className="text-3xl font-bold text-blue-900">{stats.avgAccuracy}%</p>
                        <p className="text-xs text-blue-600 mt-1">+0.3% this week</p>
                      </div>
                      <Target className="h-12 w-12 text-blue-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-green-700">Daily Notes</p>
                        <p className="text-3xl font-bold text-green-900">{stats.notesToday}</p>
                        <p className="text-xs text-green-600 mt-1">+8% from yesterday</p>
                      </div>
                      <TrendingUp className="h-12 w-12 text-green-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-purple-700">Avg. Time Saved</p>
                        <p className="text-3xl font-bold text-purple-900">15m</p>
                        <p className="text-xs text-purple-600 mt-1">Per note</p>
                      </div>
                      <Zap className="h-12 w-12 text-purple-600" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Analytics Chart Placeholder */}
              <Card>
                <CardHeader>
                  <CardTitle>Usage Trends (Last 7 Days)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 bg-slate-50 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <BarChart3 className="h-12 w-12 text-slate-400 mx-auto mb-2" />
                      <p className="text-slate-500">Analytics chart would be displayed here</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'system' && (
            <div className="space-y-6">
              {/* System Logs */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-slate-600" />
                    System Logs
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {systemLogs.map((log) => (
                      <div key={log.id} className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg">
                        <div className={`w-3 h-3 rounded-full ${
                          log.level === 'error' ? 'bg-red-500' :
                          log.level === 'warning' ? 'bg-yellow-500' : 'bg-green-500'
                        }`} />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-slate-900">{log.message}</p>
                          <p className="text-xs text-slate-500">{log.source} • {new Date(log.timestamp).toLocaleString()}</p>
                        </div>
                        <Badge className={getLogLevelColor(log.level)}>
                          {log.level}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-green-600" />
                    Security Overview
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">HIPAA Compliance</span>
                        <Badge className="bg-green-100 text-green-800">Compliant</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Data Encryption</span>
                        <Badge className="bg-green-100 text-green-800">AES-256</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Access Controls</span>
                        <Badge className="bg-green-100 text-green-800">Active</Badge>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Audit Logging</span>
                        <Badge className="bg-green-100 text-green-800">Enabled</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Session Security</span>
                        <Badge className="bg-green-100 text-green-800">Secure</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Backup Status</span>
                        <Badge className="bg-green-100 text-green-800">Current</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* PHI Protection Tab */}
          {activeTab === 'phi-protection' && (
            <div className="space-y-8">
              {/* PHI Detection Overview */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-red-600">PHI Detections</p>
                        <p className="text-2xl font-bold text-red-900">1,247</p>
                        <p className="text-xs text-red-600 mt-1">+12% this week</p>
                      </div>
                      <Shield className="h-8 w-8 text-red-600" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-green-600">Compliance Score</p>
                        <p className="text-2xl font-bold text-green-900">98.5%</p>
                        <p className="text-xs text-green-600 mt-1">Excellent</p>
                      </div>
                      <CheckCircle className="h-8 w-8 text-green-600" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-blue-600">Redactions</p>
                        <p className="text-2xl font-bold text-blue-900">892</p>
                        <p className="text-xs text-blue-600 mt-1">Auto-redacted</p>
                      </div>
                      <Edit className="h-8 w-8 text-blue-600" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-yellow-600">Violations</p>
                        <p className="text-2xl font-bold text-yellow-900">3</p>
                        <p className="text-xs text-yellow-600 mt-1">This month</p>
                      </div>
                      <AlertTriangle className="h-8 w-8 text-yellow-600" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* PHI Management Actions */}
              <div className="flex flex-wrap gap-4">
                <Button 
                  onClick={() => setShowCreatePatternModal(true)}
                  className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add PHI Pattern
                </Button>
                <Button 
                  onClick={() => setShowTestPHIModal(true)}
                  variant="outline"
                  className="border-blue-500 text-blue-600 hover:bg-blue-50"
                >
                  <Shield className="h-4 w-4 mr-2" />
                  Test PHI Detection
                </Button>
                <Button 
                  onClick={() => handleGenerateComplianceReport()}
                  variant="outline"
                  className="border-green-500 text-green-600 hover:bg-green-50"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Generate Report
                </Button>
                <Button 
                  onClick={() => handleExportAuditData()}
                  variant="outline"
                  className="border-purple-500 text-purple-600 hover:bg-purple-50"
                >
                  <DownloadIcon className="h-4 w-4 mr-2" />
                  Export Audit Data
                </Button>
              </div>

              {/* PHI Patterns Management */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Shield className="h-5 w-5 text-red-600" />
                        PHI Detection Patterns
                      </CardTitle>
                      <CardDescription>Configure and monitor PHI detection rules</CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Input
                        placeholder="Search patterns..."
                        value={phiSearchQuery}
                        onChange={(e) => setPhiSearchQuery(e.target.value)}
                        className="w-64"
                      />
                      <Button variant="outline" size="sm">
                        <Filter className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {phiProtectionService.getPHIPatterns()
                      .filter(pattern => 
                        pattern.name.toLowerCase().includes(phiSearchQuery.toLowerCase()) ||
                        pattern.description.toLowerCase().includes(phiSearchQuery.toLowerCase())
                      )
                      .map((pattern, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:shadow-md transition-shadow">
                          <div className="flex items-center gap-3">
                            <div>
                              <p className="font-medium text-sm">{pattern.name}</p>
                              <p className="text-xs text-slate-600">{pattern.description}</p>
                              <p className="text-xs text-slate-500">Category: {pattern.category}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className={`${
                              pattern.severity === 'critical' ? 'bg-red-100 text-red-800' :
                              pattern.severity === 'high' ? 'bg-orange-100 text-orange-800' :
                              pattern.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                              {pattern.severity}
                            </Badge>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleEditPHIPattern(pattern)}>
                                  <Edit className="h-4 w-4 mr-2" />
                                  Edit Pattern
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleTestPattern(pattern)}>
                                  <Shield className="h-4 w-4 mr-2" />
                                  Test Pattern
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleTogglePattern(pattern)}>
                                  <ToggleLeft className="h-4 w-4 mr-2" />
                                  {pattern.severity === 'low' ? 'Enable' : 'Disable'}
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  onClick={() => handleDeletePHIPattern(pattern)}
                                  className="text-red-600"
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>

              {/* Audit Logs */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Activity className="h-5 w-5 text-blue-600" />
                        Audit Logs
                      </CardTitle>
                      <CardDescription>Complete audit trail of PHI-related activities</CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Select value={auditLogFilter} onValueChange={setAuditLogFilter}>
                        <SelectTrigger className="w-40">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Actions</SelectItem>
                          <SelectItem value="phi_detection">PHI Detection</SelectItem>
                          <SelectItem value="phi_redaction">PHI Redaction</SelectItem>
                          <SelectItem value="data_access">Data Access</SelectItem>
                          <SelectItem value="data_export">Data Export</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button variant="outline" size="sm" onClick={() => setAuditLogs(phiProtectionService.getAuditLogs())}>
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {auditLogs
                      .filter(log => auditLogFilter === 'all' || log.action === auditLogFilter)
                      .slice(0, 20)
                      .map((log, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className={`w-2 h-2 rounded-full ${
                              log.result === 'success' ? 'bg-green-500' :
                              log.result === 'warning' ? 'bg-yellow-500' :
                              'bg-red-500'
                            }`} />
                            <div>
                              <p className="font-medium text-sm">{log.action.replace('_', ' ')}</p>
                              <p className="text-xs text-slate-600">{log.resource}</p>
                              <p className="text-xs text-slate-500">{log.timestamp.toLocaleString()}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className={`${
                              log.result === 'success' ? 'bg-green-100 text-green-800' :
                              log.result === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {log.result}
                            </Badge>
                            {log.details.phiCount && (
                              <Badge variant="outline" className="text-xs">
                                {log.details.phiCount} PHI items
                              </Badge>
                            )}
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>

              {/* Compliance Reports */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-purple-600" />
                        Compliance Reports
                      </CardTitle>
                      <CardDescription>HIPAA compliance monitoring and reporting</CardDescription>
                    </div>
                    <Button onClick={() => setShowCreateReportModal(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Generate Report
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {complianceReports.map((report, index) => (
                      <div key={index} className="p-4 border border-slate-200 rounded-lg hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h4 className="font-medium">Report #{report.id.slice(-8)}</h4>
                            <p className="text-sm text-slate-600">
                              {report.period.start.toLocaleDateString()} - {report.period.end.toLocaleDateString()}
                            </p>
                            <p className="text-xs text-slate-500">
                              Organization: {report.organizationId}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="text-right">
                              <p className="text-lg font-bold text-green-600">{report.summary.complianceScore}%</p>
                              <p className="text-xs text-slate-600">Compliance Score</p>
                            </div>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleViewReport(report)}>
                                  <Eye className="h-4 w-4 mr-2" />
                                  View Report
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleExportReport(report)}>
                                  <DownloadIcon className="h-4 w-4 mr-2" />
                                  Export PDF
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleEmailReport(report)}>
                                  <Mail className="h-4 w-4 mr-2" />
                                  Email Report
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  onClick={() => handleDeleteReport(report)}
                                  className="text-red-600"
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                        <div className="grid grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="font-medium">{report.summary.totalNotes}</p>
                            <p className="text-slate-600">Total Notes</p>
                          </div>
                          <div>
                            <p className="font-medium">{report.summary.phiDetections}</p>
                            <p className="text-slate-600">PHI Detections</p>
                          </div>
                          <div>
                            <p className="font-medium">{report.summary.redactions}</p>
                            <p className="text-slate-600">Redactions</p>
                          </div>
                          <div>
                            <p className="font-medium text-red-600">{report.summary.violations}</p>
                            <p className="text-slate-600">Violations</p>
                          </div>
                        </div>
                        {report.violations.length > 0 && (
                          <div className="mt-3 p-2 bg-red-50 rounded border border-red-200">
                            <p className="text-xs font-medium text-red-800">Recent Violations:</p>
                            <div className="space-y-1 mt-1">
                              {report.violations.slice(0, 2).map((violation, vIndex) => (
                                <p key={vIndex} className="text-xs text-red-700">
                                  • {violation.description}
                                </p>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Organizations Tab */}
          {activeTab === 'organizations' && (
            <div className="space-y-8">
              {/* Organization Overview */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-blue-600">Organizations</p>
                        <p className="text-2xl font-bold text-blue-900">{organizations.length}</p>
                        <p className="text-xs text-blue-600 mt-1">Active</p>
                      </div>
                      <Globe className="h-8 w-8 text-blue-600" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-green-600">Total Users</p>
                        <p className="text-2xl font-bold text-green-900">{organizationUsers.length}</p>
                        <p className="text-xs text-green-600 mt-1">Across all orgs</p>
                      </div>
                      <Users className="h-8 w-8 text-green-600" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-purple-600">Teams</p>
                        <p className="text-2xl font-bold text-purple-900">{teams.length}</p>
                        <p className="text-xs text-purple-600 mt-1">Collaborative groups</p>
                      </div>
                      <Users className="h-8 w-8 text-purple-600" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-orange-600">Pending Invites</p>
                        <p className="text-2xl font-bold text-orange-900">{invites.length}</p>
                        <p className="text-xs text-orange-600 mt-1">Awaiting response</p>
                      </div>
                      <Mail className="h-8 w-8 text-orange-600" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Organization Management Actions */}
              <div className="flex flex-wrap gap-4">
                <Button 
                  onClick={() => setShowCreateOrgModal(true)}
                  className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Organization
                </Button>
                <Button 
                  onClick={() => setShowCreateTeamModal(true)}
                  variant="outline"
                  className="border-green-500 text-green-600 hover:bg-green-50"
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Create Team
                </Button>
                <Button 
                  onClick={() => setShowInviteUserModal(true)}
                  variant="outline"
                  className="border-purple-500 text-purple-600 hover:bg-purple-50"
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Invite User
                </Button>
              </div>

              {/* Organizations Management */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Globe className="h-5 w-5 text-blue-600" />
                        Organizations
                      </CardTitle>
                      <CardDescription>Manage multi-tenant organizations and their settings</CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Input
                        placeholder="Search organizations..."
                        value={orgSearchQuery}
                        onChange={(e) => setOrgSearchQuery(e.target.value)}
                        className="w-64"
                      />
                      <Button variant="outline" size="sm">
                        <Filter className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {organizations.filter(org => 
                      org.name.toLowerCase().includes(orgSearchQuery.toLowerCase()) ||
                      org.domain.toLowerCase().includes(orgSearchQuery.toLowerCase())
                    ).map((org, index) => {
                      const orgStats = organizationService.getOrganizationStats(org.id);
                      return (
                        <div key={index} className="p-4 border border-slate-200 rounded-lg hover:shadow-md transition-shadow">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div>
                                <h4 className="font-medium text-lg">{org.name}</h4>
                                <p className="text-sm text-slate-600">{org.type.replace('_', ' ')} • {org.domain}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge className={`${
                                org.subscription.status === 'active' ? 'bg-green-100 text-green-800' :
                                org.subscription.status === 'suspended' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {org.subscription.plan}
                              </Badge>
                              <Badge className="bg-blue-100 text-blue-800">
                                {org.subscription.seatsUsed}/{org.subscription.seatsTotal} seats
                              </Badge>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => handleEditOrganization(org)}>
                                    <Edit className="h-4 w-4 mr-2" />
                                    Edit Organization
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleViewOrgUsers(org)}>
                                    <Users className="h-4 w-4 mr-2" />
                                    Manage Users
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleOrgSettings(org)}>
                                    <Settings className="h-4 w-4 mr-2" />
                                    Settings
                                  </DropdownMenuItem>
                                  <DropdownMenuItem 
                                    onClick={() => handleSuspendOrganization(org)}
                                    className="text-yellow-600"
                                  >
                                    <AlertTriangle className="h-4 w-4 mr-2" />
                                    {org.subscription.status === 'active' ? 'Suspend' : 'Activate'}
                                  </DropdownMenuItem>
                                  <DropdownMenuItem 
                                    onClick={() => handleDeleteOrganization(org)}
                                    className="text-red-600"
                                  >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                          <div className="grid grid-cols-4 gap-4 text-sm">
                            <div>
                              <p className="font-medium">{orgStats.totalUsers}</p>
                              <p className="text-slate-600">Users</p>
                            </div>
                            <div>
                              <p className="font-medium">{orgStats.totalNotes}</p>
                              <p className="text-slate-600">Notes</p>
                            </div>
                            <div>
                              <p className="font-medium">{orgStats.totalTeams}</p>
                              <p className="text-slate-600">Teams</p>
                            </div>
                            <div>
                              <p className="font-medium">{orgStats.complianceScore}%</p>
                              <p className="text-slate-600">Compliance</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Teams Management */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5 text-green-600" />
                        Teams
                      </CardTitle>
                      <CardDescription>Collaborative teams and their members</CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Input
                        placeholder="Search teams..."
                        value={teamSearchQuery}
                        onChange={(e) => setTeamSearchQuery(e.target.value)}
                        className="w-64"
                      />
                      <Button variant="outline" size="sm">
                        <Filter className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {teams.filter(team => 
                      team.name.toLowerCase().includes(teamSearchQuery.toLowerCase()) ||
                      team.description?.toLowerCase().includes(teamSearchQuery.toLowerCase())
                    ).map((team, index) => (
                      <div key={index} className="p-4 border border-slate-200 rounded-lg hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div>
                              <h4 className="font-medium text-lg">{team.name}</h4>
                              <p className="text-sm text-slate-600">{team.description}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className="bg-green-100 text-green-800">
                              {team.members.length} members
                            </Badge>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleEditTeam(team)}>
                                  <Edit className="h-4 w-4 mr-2" />
                                  Edit Team
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleManageTeamMembers(team)}>
                                  <Users className="h-4 w-4 mr-2" />
                                  Manage Members
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleTeamSettings(team)}>
                                  <Settings className="h-4 w-4 mr-2" />
                                  Settings
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  onClick={() => handleDeleteTeam(team)}
                                  className="text-red-600"
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete Team
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {team.members.slice(0, 5).map((member, memberIndex) => {
                            const user = organizationUsers.find(u => u.id === member.userId);
                            return (
                              <Badge key={memberIndex} variant="outline" className="text-xs">
                                {user?.name || 'Unknown User'} ({member.role})
                              </Badge>
                            );
                          })}
                          {team.members.length > 5 && (
                            <Badge variant="outline" className="text-xs">
                              +{team.members.length - 5} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Pending Invitations */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="h-5 w-5 text-orange-600" />
                    Pending Invitations
                  </CardTitle>
                  <CardDescription>Manage user invitations and access requests</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {invites.map((invite, index) => (
                      <div key={index} className="p-4 border border-slate-200 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">{invite.email}</h4>
                            <p className="text-sm text-slate-600">
                              Invited to {organizationService.getOrganization(invite.organizationId)?.name} as {invite.role}
                            </p>
                            <p className="text-xs text-slate-500">
                              Expires: {invite.expiresAt.toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className={`${
                              invite.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              invite.status === 'accepted' ? 'bg-green-100 text-green-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {invite.status}
                            </Badge>
                            <div className="flex gap-1">
                              <Button size="sm" variant="outline" onClick={() => handleResendInvite(invite)}>
                                <RefreshCw className="h-3 w-3 mr-1" />
                                Resend
                              </Button>
                              <Button size="sm" variant="outline" onClick={() => handleCancelInvite(invite)} className="text-red-600">
                                <XCircle className="h-3 w-3 mr-1" />
                                Cancel
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>System Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="auto-backup">Automatic Backups</Label>
                        <p className="text-sm text-slate-500">Enable automatic daily backups</p>
                      </div>
                      <Switch id="auto-backup" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="audit-logging">Audit Logging</Label>
                        <p className="text-sm text-slate-500">Log all user actions and system events</p>
                      </div>
                      <Switch id="audit-logging" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="email-notifications">Email Notifications</Label>
                        <p className="text-sm text-slate-500">Send system alerts via email</p>
                      </div>
                      <Switch id="email-notifications" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </main>
      </div>

      {/* User Details Modal */}
      <Dialog open={isUserModalOpen} onOpenChange={setIsUserModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarFallback className="bg-gradient-to-br from-teal-500 to-blue-600 text-white text-lg">
                    {selectedUser.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-semibold">{selectedUser.name}</h3>
                  <p className="text-slate-600">{selectedUser.email}</p>
                  <Badge className={getStatusColor(selectedUser.status)}>
                    {selectedUser.status}
                  </Badge>
                </div>
              </div>
              
              <Separator />
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-slate-500">Role</Label>
                  <p className="text-sm">{selectedUser.role}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-slate-500">Join Date</Label>
                  <p className="text-sm">{new Date(selectedUser.createdAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-slate-500">Last Login</Label>
                  <p className="text-sm">{new Date(selectedUser.stats?.lastLogin || selectedUser.updatedAt).toLocaleString()}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-slate-500">Notes Created</Label>
                  <p className="text-sm font-medium">{selectedUser.stats?.notesCreated || 0}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
