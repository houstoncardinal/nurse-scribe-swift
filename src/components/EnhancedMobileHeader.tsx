import { useState } from 'react';
import { 
  Menu, Mic, Stethoscope, Shield, User, LogIn, LogOut, Settings, 
  FileText, Download, BarChart3, Users, BookOpen, History, 
  Bell, ChevronDown, X, Home, Calendar, Target, Award, 
  Activity, Zap, AlertTriangle, Clock, TrendingUp, HelpCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';

interface UserProfile {
  name: string;
  role: string;
  avatar?: string;
  email?: string;
  isSignedIn?: boolean;
}

interface EnhancedMobileHeaderProps {
  onNewNote?: () => void;
  onNavigate?: (screen: string) => void;
  isRecording?: boolean;
  isProcessing?: boolean;
  userProfile?: UserProfile;
  onSignIn?: () => void;
  onSignOut?: () => void;
}

export function EnhancedMobileHeader({
  onNewNote,
  onNavigate,
  isRecording = false,
  isProcessing = false,
  userProfile = { name: 'Guest User', role: 'Not Signed In', isSignedIn: false },
  onSignIn,
  onSignOut
}: EnhancedMobileHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigationItems = [
    { id: 'home', label: 'New Note', icon: Mic, description: 'Start voice dictation' },
    { id: 'draft', label: 'Draft Preview', icon: FileText, description: 'Review generated notes' },
    { id: 'export', label: 'Export', icon: Download, description: 'Export to EHR or PDF' },
    { id: 'history', label: 'Note History', icon: History, description: 'View past notes' },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, description: 'Performance metrics' },
    { id: 'education', label: 'Education', icon: BookOpen, description: 'Practice cases' },
    { id: 'team', label: 'Team', icon: Users, description: 'Collaborate with team' },
    { id: 'instructions', label: 'Instructions', icon: HelpCircle, description: 'Learn how to use the app' },
    { id: 'settings', label: 'Settings', icon: Settings, description: 'App preferences' },
  ];

  const handleNavigation = (screenId: string) => {
    onNavigate?.(screenId);
    setIsMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-slate-200 shadow-sm">
      <div className="px-3 py-2">
        <div className="flex items-center justify-between">
          {/* Logo and App Name - Compact */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-blue-600 rounded-lg flex items-center justify-center shadow-md shadow-teal-500/25">
              <Stethoscope className="h-4 w-4 text-white" />
            </div>
            <h1 className="text-base font-semibold text-slate-900">NurseScribe AI</h1>
          </div>

          {/* Right Side - Status and Actions */}
          <div className="flex items-center gap-1">
            {/* Status Indicators - Compact */}
            {isRecording && (
              <Badge className="bg-red-50 text-red-600 border-red-200 text-xs px-1.5 py-0.5">
                <div className="w-1.5 h-1.5 bg-red-500 rounded-full mr-1 animate-pulse" />
                Rec
              </Badge>
            )}
            
            {isProcessing && (
              <Badge className="bg-yellow-50 text-yellow-600 border-yellow-200 text-xs px-1.5 py-0.5">
                <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full mr-1 animate-pulse" />
                Proc
              </Badge>
            )}

            {/* User Profile / Sign In */}
            <div className="flex items-center gap-2">
              {userProfile.isSignedIn ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-9 px-2">
                      <Avatar className="w-7 h-7">
                        <AvatarFallback className="bg-gradient-to-br from-teal-500 to-blue-600 text-white text-xs font-semibold">
                          {userProfile.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 bg-white border border-slate-200 shadow-lg">
                    <div className="px-3 py-2 border-b border-slate-100">
                      <p className="text-sm font-semibold text-slate-900">{userProfile.name}</p>
                      <p className="text-xs text-slate-600">{userProfile.role}</p>
                      {userProfile.email && (
                        <p className="text-xs text-slate-500">{userProfile.email}</p>
                      )}
                    </div>
                    <DropdownMenuItem className="hover:bg-slate-50" onClick={() => handleNavigation('profile')}>
                      <User className="h-4 w-4 mr-2" />
                      Profile Settings
                    </DropdownMenuItem>
                    <DropdownMenuItem className="hover:bg-slate-50" onClick={() => handleNavigation('settings')}>
                      <Settings className="h-4 w-4 mr-2" />
                      Preferences
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-red-600 hover:bg-red-50" onClick={onSignOut}>
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button
                  onClick={() => onNavigate?.('profile')}
                  variant="ghost"
                  size="sm"
                  className="h-9 w-9 p-0"
                >
                  <User className="h-5 w-5 text-slate-600" />
                </Button>
              )}
            </div>

            {/* New Note Button */}
            <Button
              onClick={onNewNote}
              className="bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 text-white shadow-lg h-9 px-3 text-xs"
              size="sm"
            >
              <Mic className="h-4 w-4 mr-1.5" />
              New Note
            </Button>

            {/* Menu Button */}
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="h-9 w-9 p-0">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 bg-white border-l border-slate-200 shadow-xl">
                <div className="flex flex-col h-full bg-white">
                  {/* Compact Header */}
                  <div className="bg-gradient-to-br from-slate-50 to-blue-50/30 rounded-lg p-3 mb-4 border border-slate-200">
                    {userProfile.isSignedIn ? (
                      <div className="flex items-center gap-2">
                        <Avatar className="w-10 h-10 ring-1 ring-white shadow-md">
                          <AvatarFallback className="bg-gradient-to-br from-teal-500 to-blue-600 text-white font-semibold text-sm">
                            {userProfile.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <h2 className="font-semibold text-slate-900 text-sm truncate">{userProfile.name}</h2>
                          <p className="text-xs text-slate-600 truncate">{userProfile.role}</p>
                          <div className="flex items-center gap-1 mt-1">
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                            <span className="text-xs text-green-600">Active</span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center shadow-md">
                          <User className="h-5 w-5 text-slate-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h2 className="font-semibold text-slate-900 text-sm">Guest User</h2>
                          <p className="text-xs text-slate-600">Limited features</p>
                          <div className="flex items-center gap-1 mt-1">
                            <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></div>
                            <span className="text-xs text-yellow-600">Guest Mode</span>
                          </div>
                        </div>
                        <Button 
                          onClick={onSignIn} 
                          size="sm" 
                          className="bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 text-white shadow-md h-8 px-3 text-xs"
                        >
                          <LogIn className="h-3 w-3 mr-1" />
                          Sign In
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Main Navigation */}
                  <div className="flex-1 space-y-1">
                    <h3 className="text-sm font-semibold text-slate-900 px-1 mb-3">App Navigation</h3>
                    {navigationItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Button
                          key={item.id}
                          variant="ghost"
                          className="w-full justify-start h-12 hover:bg-gradient-to-r hover:from-slate-50 hover:to-blue-50/30 text-slate-700 rounded-lg transition-all duration-200"
                          onClick={() => handleNavigation(item.id)}
                        >
                          <div className="w-7 h-7 bg-gradient-to-br from-slate-100 to-slate-200 rounded-md flex items-center justify-center mr-3">
                            <Icon className="h-3.5 w-3.5 text-slate-600" />
                          </div>
                          <div className="text-left flex-1">
                            <div className="text-sm font-medium">{item.label}</div>
                            <div className="text-xs text-slate-500 truncate">{item.description}</div>
                          </div>
                        </Button>
                      );
                    })}
                  </div>

                  {/* Quick Stats */}
                  {userProfile.isSignedIn && (
                    <>
                      <Separator className="my-4" />
                      <div className="space-y-2">
                        <h3 className="text-sm font-semibold text-slate-900 px-1">Today's Stats</h3>
                        <div className="grid grid-cols-3 gap-2">
                          <div className="text-center p-2 bg-blue-50 rounded-lg">
                            <div className="text-lg font-bold text-blue-600">12</div>
                            <div className="text-xs text-blue-600">Notes</div>
                          </div>
                          <div className="text-center p-2 bg-emerald-50 rounded-lg">
                            <div className="text-lg font-bold text-emerald-600">3.2h</div>
                            <div className="text-xs text-emerald-600">Saved</div>
                          </div>
                          <div className="text-center p-2 bg-purple-50 rounded-lg">
                            <div className="text-lg font-bold text-purple-600">99%</div>
                            <div className="text-xs text-purple-600">Accuracy</div>
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  {/* HIPAA Status */}
                  <div className="mt-auto pt-4 border-t border-slate-200">
                    <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Shield className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-semibold text-green-800">HIPAA Compliant</span>
                      </div>
                      <p className="text-xs text-green-700">
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
    </header>
  );
}
