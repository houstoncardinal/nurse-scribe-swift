import { useState } from 'react';
import { 
  Menu, Mic, Stethoscope, Shield, User, LogIn, LogOut, Settings, 
  FileText, Download, BarChart3, Users, BookOpen, History, HelpCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { SimpleThemeToggle } from '@/components/ThemeToggle';

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
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-xl border-b border-border shadow-sm">
      <div className="px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo and App Name - Clean */}
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-gradient-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
              <Stethoscope className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-lg font-bold text-foreground">Raha</h1>
          </div>

          {/* Right Side - Clean Actions */}
          <div className="flex items-center gap-2">

            {/* Theme Toggle */}
            <SimpleThemeToggle className="h-9 w-9" />

            {/* User Profile / Sign In */}
            {userProfile.isSignedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-9 w-9">
                    <Avatar className="w-7 h-7">
                      <AvatarFallback className="bg-gradient-primary text-white text-xs font-bold">
                        {userProfile.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-3 py-2 border-b border-border">
                    <p className="text-sm font-semibold text-foreground">{userProfile.name}</p>
                    <p className="text-xs text-muted-foreground">{userProfile.role}</p>
                  </div>
                  <DropdownMenuItem onClick={() => handleNavigation('profile')}>
                    <User className="h-4 w-4 mr-2" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleNavigation('settings')}>
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive" onClick={onSignOut}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                onClick={() => onNavigate?.('profile')}
                variant="ghost"
                size="icon"
                className="h-9 w-9"
              >
                <User className="h-5 w-5" />
              </Button>
            )}

            {/* Menu Button */}
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 p-0">
                <div className="flex flex-col h-full p-6">
                  {/* User Header - Clean */}
                  {userProfile.isSignedIn ? (
                    <div className="mb-6">
                      <div className="flex items-center gap-3 mb-4">
                        <Avatar className="w-12 h-12">
                          <AvatarFallback className="bg-gradient-primary text-white font-bold">
                            {userProfile.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <h2 className="font-bold text-foreground truncate">{userProfile.name}</h2>
                          <p className="text-sm text-muted-foreground truncate">{userProfile.role}</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="mb-6">
                      <Button
                        onClick={onSignIn}
                        className="w-full bg-gradient-primary hover:opacity-90"
                      >
                        <LogIn className="h-4 w-4 mr-2" />
                        Sign In
                      </Button>
                    </div>
                  )}

                  {/* Main Navigation - Clean */}
                  <nav className="flex-1 space-y-1">
                    {navigationItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Button
                          key={item.id}
                          variant="ghost"
                          className="w-full justify-start h-12 hover:bg-accent/50"
                          onClick={() => handleNavigation(item.id)}
                        >
                          <Icon className="h-5 w-5 mr-3" />
                          <span className="font-medium">{item.label}</span>
                        </Button>
                      );
                    })}
                  </nav>

                  {/* HIPAA Badge - Clean */}
                  <div className="mt-auto pt-6 border-t border-border">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Shield className="h-4 w-4 text-green-600" />
                      <span>HIPAA Compliant</span>
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
