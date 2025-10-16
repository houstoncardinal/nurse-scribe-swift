import { useState, useEffect } from 'react';
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
  FilePdf,
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
  Stack,
  Stack2,
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
  Desktop,
  Server as ServerIcon,
  Router,
  Wifi as WifiIcon,
  WifiOff as WifiOffIcon,
  Bluetooth,
  BluetoothOff,
  Radio,
  RadioOff,
  Signal,
  SignalZero,
  SignalLow,
  SignalMedium,
  SignalHigh,
  SignalFull,
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
  Storefront,
  Factory,
  Warehouse,
  Hospital,
  School,
  Church,
  Bank,
  Hotel,
  Car,
  Truck,
  Bus,
  Train,
  Plane,
  Ship,
  Bike,
  Motorbike,
  Scooter,
  Skateboard,
  RollerSkate,
  Footprints,
  Route as RouteIcon,
  Navigation as NavigationIcon,
  Compass as CompassIcon,
  Map as MapIcon,
  Globe as GlobeIcon,
  Earth,
  Satellite,
  SatelliteOff,
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
  FilePdf as FilePdfIcon,
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
  Stack as StackIcon,
  Stack2 as Stack2Icon,
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
import { phiProtectionService, PHIDetectionResult, AuditLogEntry, ComplianceReport } from '@/lib/phiProtectionService';
import { organizationService, Organization, User, Team, OrganizationInvite } from '@/lib/organizationService';

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
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  
  // PHI Protection state
  const [phiDetectionResults, setPhiDetectionResults] = useState<PHIDetectionResult[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [complianceReports, setComplianceReports] = useState<ComplianceReport[]>([]);
  
  // Organization Management state
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [organizationUsers, setOrganizationUsers] = useState<User[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [invites, setInvites] = useState<OrganizationInvite[]>([]);

  // Mock data - replace with real data from your service
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 1247,
    activeUsers: 892,
    totalNotes: 15643,
    notesToday: 234,
    avgAccuracy: 99.2,
    timeSaved: 1247.5,
    systemHealth: 98.5,
    storageUsed: 2.4,
    storageLimit: 10
  });

  const [users] = useState<User[]>([
    {
      id: '1',
      name: 'Dr. Sarah Johnson',
      email: 'sarah.johnson@hospital.com',
      role: 'Administrator',
      status: 'active',
      lastLogin: '2024-01-15T10:30:00Z',
      notesCreated: 156,
      joinDate: '2023-06-15'
    },
    {
      id: '2',
      name: 'Nurse Mike Chen',
      email: 'mike.chen@hospital.com',
      role: 'Nurse',
      status: 'active',
      lastLogin: '2024-01-15T09:15:00Z',
      notesCreated: 89,
      joinDate: '2023-08-22'
    },
    {
      id: '3',
      name: 'Dr. Emily Rodriguez',
      email: 'emily.rodriguez@hospital.com',
      role: 'Physician',
      status: 'inactive',
      lastLogin: '2024-01-10T16:45:00Z',
      notesCreated: 203,
      joinDate: '2023-04-10'
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
      {/* Left Navigation */}
      <div className="w-64 bg-white/95 backdrop-blur-xl border-r border-slate-200 shadow-xl">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">Admin Dashboard</h1>
              <p className="text-sm text-slate-600">NurseScribe AI</p>
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
        {/* Header */}
        <header className="bg-white/90 backdrop-blur-sm border-b border-slate-200 shadow-sm">
          <div className="px-8 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 capitalize">
                  {navigationItems.find(item => item.id === activeTab)?.label}
                </h2>
                <p className="text-sm text-slate-600 mt-1">
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
                <Badge className="bg-green-100 text-green-800 border-green-200">
                  HIPAA Compliant
                </Badge>
                <Button className="bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Add User
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-8">
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
            <div className="space-y-6">
              {/* User Management Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Input
                    placeholder="Search users..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-64"
                  />
                  <Select>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Filter by role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Roles</SelectItem>
                      <SelectItem value="admin">Administrator</SelectItem>
                      <SelectItem value="nurse">Nurse</SelectItem>
                      <SelectItem value="physician">Physician</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button className="bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add User
                </Button>
              </div>

              {/* Users Table */}
              <Card>
                <CardHeader>
                  <CardTitle>Users ({filteredUsers.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Last Login</TableHead>
                        <TableHead>Notes Created</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.map((user) => (
                        <TableRow key={user.id}>
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
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{user.role}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(user.status)}>
                              {user.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm text-slate-600">
                            {new Date(user.lastLogin).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-sm font-medium">
                            {user.notesCreated}
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => {
                                  setSelectedUser(user);
                                  setIsUserModalOpen(true);
                                }}>
                                  <Eye className="h-4 w-4 mr-2" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Edit className="h-4 w-4 mr-2" />
                                  Edit User
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Lock className="h-4 w-4 mr-2" />
                                  Suspend User
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-red-600">
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
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-6">
              {/* Analytics Overview */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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

              {/* PHI Patterns and Detection */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5 text-red-600" />
                      PHI Detection Patterns
                    </CardTitle>
                    <CardDescription>Configure and monitor PHI detection rules</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {phiProtectionService.getPHIPatterns().slice(0, 5).map((pattern, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                          <div>
                            <p className="font-medium text-sm">{pattern.name}</p>
                            <p className="text-xs text-slate-600">{pattern.description}</p>
                          </div>
                          <Badge className={`${
                            pattern.severity === 'critical' ? 'bg-red-100 text-red-800' :
                            pattern.severity === 'high' ? 'bg-orange-100 text-orange-800' :
                            pattern.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {pattern.severity}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="h-5 w-5 text-blue-600" />
                      Recent PHI Detections
                    </CardTitle>
                    <CardDescription>Latest PHI detection events</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {auditLogs.filter(log => log.action === 'phi_detection').slice(0, 5).map((log, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                          <div>
                            <p className="font-medium text-sm">{log.resource}</p>
                            <p className="text-xs text-slate-600">
                              {log.details.phiCount} items • {log.timestamp.toLocaleString()}
                            </p>
                          </div>
                          <Badge className={`${
                            log.result === 'success' ? 'bg-green-100 text-green-800' :
                            log.result === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {log.result}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Compliance Reports */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-purple-600" />
                    Compliance Reports
                  </CardTitle>
                  <CardDescription>HIPAA compliance monitoring and reporting</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {complianceReports.slice(0, 3).map((report, index) => (
                      <div key={index} className="p-4 border border-slate-200 rounded-lg">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h4 className="font-medium">Report #{report.id.slice(-8)}</h4>
                            <p className="text-sm text-slate-600">
                              {report.period.start.toLocaleDateString()} - {report.period.end.toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-green-600">{report.summary.complianceScore}%</p>
                            <p className="text-xs text-slate-600">Compliance Score</p>
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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

              {/* Organizations List */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5 text-blue-600" />
                    Organizations
                  </CardTitle>
                  <CardDescription>Manage multi-tenant organizations and their settings</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {organizations.map((org, index) => {
                      const orgStats = organizationService.getOrganizationStats(org.id);
                      return (
                        <div key={index} className="p-4 border border-slate-200 rounded-lg">
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <h4 className="font-medium text-lg">{org.name}</h4>
                              <p className="text-sm text-slate-600">{org.type.replace('_', ' ')} • {org.domain}</p>
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
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-green-600" />
                    Teams
                  </CardTitle>
                  <CardDescription>Collaborative teams and their members</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {teams.map((team, index) => (
                      <div key={index} className="p-4 border border-slate-200 rounded-lg">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h4 className="font-medium text-lg">{team.name}</h4>
                            <p className="text-sm text-slate-600">{team.description}</p>
                          </div>
                          <Badge className="bg-green-100 text-green-800">
                            {team.members.length} members
                          </Badge>
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
                  <p className="text-sm">{new Date(selectedUser.joinDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-slate-500">Last Login</Label>
                  <p className="text-sm">{new Date(selectedUser.lastLogin).toLocaleString()}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-slate-500">Notes Created</Label>
                  <p className="text-sm font-medium">{selectedUser.notesCreated}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
