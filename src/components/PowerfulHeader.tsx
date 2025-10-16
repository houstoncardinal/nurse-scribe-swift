import { useState } from 'react';
import { 
  Mic, 
  Zap, 
  Shield, 
  Bell, 
  Settings, 
  User, 
  ChevronDown,
  TrendingUp,
  Activity,
  CheckCircle,
  AlertTriangle,
  Star,
  Target,
  Clock,
  Award
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';

interface PowerfulHeaderProps {
  onNewNote: () => void;
  isRecording?: boolean;
  isProcessing?: boolean;
  userProfile?: {
    name: string;
    role: string;
    avatar?: string;
    efficiency?: number;
  };
}

export function PowerfulHeader({ 
  onNewNote, 
  isRecording = false, 
  isProcessing = false,
  userProfile = { 
    name: 'Dr. Sarah Johnson', 
    role: 'RN, BSN',
    efficiency: 94
  }
}: PowerfulHeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = [
    {
      id: 1,
      type: 'achievement',
      title: 'Efficiency Milestone',
      message: 'You\'ve saved 5+ hours this week!',
      time: '2m ago',
      icon: Award,
      color: 'text-yellow-600'
    },
    {
      id: 2,
      type: 'security',
      title: 'HIPAA Audit Complete',
      message: '100% compliance score achieved',
      time: '1h ago',
      icon: Shield,
      color: 'text-green-600'
    },
    {
      id: 3,
      type: 'accuracy',
      title: 'Accuracy Improved',
      message: '99.2% accuracy rate this week',
      time: '3h ago',
      icon: Target,
      color: 'text-blue-600'
    }
  ];

  const quickStats = [
    {
      label: 'Today\'s Notes',
      value: '12',
      change: '+3',
      trend: 'up',
      color: 'text-emerald-600'
    },
    {
      label: 'Time Saved',
      value: '47m',
      change: '+12m',
      trend: 'up',
      color: 'text-blue-600'
    },
    {
      label: 'Accuracy',
      value: '99.2%',
      change: '+0.5%',
      trend: 'up',
      color: 'text-purple-600'
    }
  ];

  return (
    <div className="sticky top-0 z-50 bg-white/98 dark:bg-slate-900/98 backdrop-blur-2xl border-b border-slate-200/60 dark:border-slate-700/60 shadow-sm">
      {/* Main Header */}
      <div className="px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Left: Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-teal-500 via-blue-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg">
                <Mic className="h-5 w-5 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-slate-900 animate-pulse" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                NurseScribe AI
              </h1>
              <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                Enterprise Documentation Platform
              </p>
            </div>
          </div>


          {/* Right: Actions & Profile */}
          <div className="flex items-center gap-2">
            {/* Status Indicators */}
            {isRecording && (
              <Badge className="bg-red-50 text-red-700 border-red-200 dark:bg-red-950/30 dark:text-red-400 dark:border-red-800 animate-pulse">
                <div className="w-2 h-2 bg-red-500 rounded-full mr-1.5" />
                Recording
              </Badge>
            )}
            
            {isProcessing && (
              <Badge className="bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-950/30 dark:text-yellow-400 dark:border-yellow-800">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mr-1.5 animate-pulse" />
                Processing
              </Badge>
            )}

            <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-800 font-medium">
              <Shield className="h-3 w-3 mr-1" />
              HIPAA Ready
            </Badge>

            {/* New Note Button */}
            <Button
              onClick={onNewNote}
              className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
            >
              <Mic className="h-4 w-4 mr-2" />
              New Note
            </Button>

            {/* Notifications */}
            <DropdownMenu open={showNotifications} onOpenChange={setShowNotifications}>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="relative p-2">
                  <Bell className="h-4 w-4" />
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-xs text-white font-bold">3</span>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <div className="p-3 border-b">
                  <h3 className="font-semibold text-slate-900 dark:text-white">Notifications</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Recent updates and achievements</p>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {notifications.map((notification) => {
                    const Icon = notification.icon;
                    return (
                      <DropdownMenuItem key={notification.id} className="p-3 cursor-pointer">
                        <div className="flex items-start gap-3 w-full">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                            notification.type === 'achievement' ? 'bg-yellow-100 dark:bg-yellow-950/20' :
                            notification.type === 'security' ? 'bg-green-100 dark:bg-green-950/20' :
                            'bg-blue-100 dark:bg-blue-950/20'
                          }`}>
                            <Icon className={`h-4 w-4 ${notification.color}`} />
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-sm text-slate-900 dark:text-white">
                              {notification.title}
                            </div>
                            <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                              {notification.message}
                            </div>
                            <div className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                              {notification.time}
                            </div>
                          </div>
                        </div>
                      </DropdownMenuItem>
                    );
                  })}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2 p-2">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-gradient-to-br from-teal-500 to-blue-600 text-white font-semibold text-sm">
                      {userProfile.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden md:block text-left">
                    <div className="text-sm font-semibold text-slate-900 dark:text-white">
                      {userProfile.name}
                    </div>
                    <div className="text-xs text-slate-600 dark:text-slate-400">
                      {userProfile.role}
                    </div>
                  </div>
                  <ChevronDown className="h-4 w-4 text-slate-500" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64">
                <div className="p-3 border-b">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10">
                      <AvatarFallback className="bg-gradient-to-br from-teal-500 to-blue-600 text-white font-semibold">
                        {userProfile.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold text-slate-900 dark:text-white">
                        {userProfile.name}
                      </div>
                      <div className="text-sm text-slate-600 dark:text-slate-400">
                        {userProfile.role}
                      </div>
                      <div className="flex items-center gap-1 mt-1">
                        <Zap className="h-3 w-3 text-yellow-500" />
                        <span className="text-xs text-slate-600 dark:text-slate-400">
                          {userProfile.efficiency}% Efficiency
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <DropdownMenuItem>
                  <User className="h-4 w-4 mr-2" />
                  Profile Settings
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Activity className="h-4 w-4 mr-2" />
                  Activity Dashboard
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Target className="h-4 w-4 mr-2" />
                  Goals & Targets
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Settings className="h-4 w-4 mr-2" />
                  Preferences
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-600">
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

    </div>
  );
}
