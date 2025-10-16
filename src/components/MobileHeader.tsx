import { useState } from 'react';
import { 
  Mic, 
  FileText, 
  Download, 
  Settings, 
  Menu, 
  X, 
  Home, 
  History,
  User,
  Shield,
  Zap,
  Bell,
  Search,
  ChevronDown,
  Stethoscope,
  BarChart3,
  Users,
  Keyboard,
  Upload
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';

interface MobileHeaderProps {
  currentScreen: 'home' | 'draft' | 'export' | 'settings';
  onNavigate: (screen: string) => void;
  onNewNote?: () => void;
  isRecording?: boolean;
  isProcessing?: boolean;
  userProfile?: {
    name: string;
    role: string;
    avatar?: string;
  };
}

export function MobileHeader({ 
  currentScreen, 
  onNavigate, 
  onNewNote,
  isRecording = false, 
  isProcessing = false,
  userProfile = { name: 'Dr. Sarah Johnson', role: 'RN, BSN' }
}: MobileHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigationItems = [
    { id: 'home', label: 'New Note', icon: Mic, active: currentScreen === 'home' },
    { id: 'draft', label: 'Draft Preview', icon: FileText, active: currentScreen === 'draft' },
    { id: 'export', label: 'Export', icon: Download, active: currentScreen === 'export' },
    { id: 'settings', label: 'Settings', icon: Settings, active: currentScreen === 'settings' },
  ];

  const menuItems = [
    { id: 'history', label: 'Note History', icon: History },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'team', label: 'Team', icon: Users },
    { id: 'security', label: 'Security', icon: Shield },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'ready': return 'bg-blue-500';
      case 'processing': return 'bg-yellow-500';
      case 'error': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <>
      {/* Clean Top Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo & App Name */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-blue-600 rounded-xl flex items-center justify-center shadow-sm">
                <Stethoscope className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-slate-900">NurseScribe AI</h1>
                <p className="text-xs text-slate-500">Professional Documentation</p>
              </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-3">
              {/* Status Indicators */}
              {isRecording && (
                <Badge className="bg-red-50 text-red-600 border-red-200 text-xs">
                  <div className="w-2 h-2 bg-red-500 rounded-full mr-1.5 animate-pulse" />
                  Recording
                </Badge>
              )}
              
              {isProcessing && (
                <Badge className="bg-yellow-50 text-yellow-600 border-yellow-200 text-xs">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mr-1.5 animate-pulse" />
                  Processing
                </Badge>
              )}

              {/* New Note Button */}
              <Button
                onClick={onNewNote}
                className="bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 text-white shadow-sm"
                size="sm"
              >
                <Mic className="h-4 w-4 mr-2" />
                New Note
              </Button>

              {/* Menu Button */}
              <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-9 w-9 p-0">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-80 bg-white/98 dark:bg-slate-900/98 backdrop-blur-2xl">
                  <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="flex items-center gap-3 mb-6">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src="/placeholder.svg" />
                        <AvatarFallback className="bg-gradient-to-br from-teal-500 to-blue-600 text-white font-semibold">
                          {userProfile.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h2 className="font-semibold text-slate-900 dark:text-white">{userProfile.name}</h2>
                        <p className="text-sm text-slate-600 dark:text-slate-400">{userProfile.role}</p>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="p-1">
                            <ChevronDown className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem>Profile Settings</DropdownMenuItem>
                          <DropdownMenuItem>Preferences</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600">Sign Out</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    <Separator className="mb-6" />

                    {/* Quick Actions */}
                    <div className="space-y-2 mb-6">
                      <h3 className="text-sm font-semibold text-slate-900 dark:text-white px-1">Quick Actions</h3>
                      <Button
                        onClick={() => {
                          onNewNote?.();
                          setIsMenuOpen(false);
                        }}
                        className="w-full justify-start h-11 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white"
                      >
                        <Mic className="h-4 w-4 mr-3" />
                        New Note
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          onNavigate('settings');
                          setIsMenuOpen(false);
                        }}
                        className="w-full justify-start h-11"
                      >
                        <Settings className="h-4 w-4 mr-3" />
                        Settings
                      </Button>
                    </div>

                    {/* Navigation */}
                    <div className="space-y-2 mb-6">
                      <h3 className="text-sm font-semibold text-slate-900 dark:text-white px-1">Navigation</h3>
                      {navigationItems.map((item) => {
                        const Icon = item.icon;
                        return (
                          <Button
                            key={item.id}
                            variant={item.active ? "default" : "ghost"}
                            className={`w-full justify-start h-11 ${item.active ? 'bg-gradient-to-r from-teal-500 to-blue-600 text-white' : ''}`}
                            onClick={() => {
                              onNavigate(item.id);
                              setIsMenuOpen(false);
                            }}
                          >
                            <Icon className={`h-4 w-4 mr-3 ${item.active ? 'text-white' : ''}`} />
                            {item.label}
                          </Button>
                        );
                      })}
                    </div>

                    <Separator className="mb-6" />

                    {/* Additional Menu Items */}
                    <div className="space-y-2 mb-6">
                      <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                        More
                      </h3>
                      {menuItems.map((item) => {
                        const Icon = item.icon;
                        return (
                          <Button
                            key={item.id}
                            variant="ghost"
                            className="w-full justify-start h-11"
                            onClick={() => {
                              onNavigate(item.id);
                              setIsMenuOpen(false);
                            }}
                          >
                            <Icon className="h-4 w-4 mr-3" />
                            {item.label}
                          </Button>
                        );
                      })}
                    </div>

                    <div className="mt-auto pt-6">
                      <div className="p-4 bg-muted/50 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Shield className="h-4 w-4 text-success" />
                          <span className="text-sm font-medium">HIPAA Compliant</span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          All data is processed locally. No PHI is stored on servers.
                        </p>
                      </div>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="px-4 pb-3">
          <div className="flex items-center justify-around bg-slate-100/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-1 border border-slate-200/50 dark:border-slate-700/50">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.id}
                  variant={item.active ? "default" : "ghost"}
                  size="sm"
                  className={`flex-1 h-11 transition-all duration-200 ${
                    item.active 
                      ? 'bg-gradient-to-r from-teal-500 to-blue-600 text-white shadow-lg scale-105' 
                      : 'hover:bg-slate-200/50 dark:hover:bg-slate-700/50 text-slate-600 dark:text-slate-400'
                  }`}
                  onClick={() => onNavigate(item.id)}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  <span className="text-xs font-medium">{item.label}</span>
                </Button>
              );
            })}
          </div>
        </div>
      </header>
    </>
  );
}
