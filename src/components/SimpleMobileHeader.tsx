import { useState } from 'react';
import { Menu, Mic, Stethoscope, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface SimpleMobileHeaderProps {
  onNewNote?: () => void;
  isRecording?: boolean;
  isProcessing?: boolean;
  userProfile?: {
    name: string;
    role: string;
    avatar?: string;
  };
}

export function SimpleMobileHeader({
  onNewNote,
  isRecording = false,
  isProcessing = false,
  userProfile = { name: 'Dr. Sarah Johnson', role: 'RN, BSN' }
}: SimpleMobileHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-slate-200 shadow-sm">
      <div className="px-3 py-2">
        <div className="flex items-center justify-between">
          {/* Logo and App Name - Compact */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-blue-600 rounded-lg flex items-center justify-center shadow-md shadow-teal-500/25">
              <Stethoscope className="h-4 w-4 text-white" />
            </div>
            <h1 className="text-base font-semibold text-slate-900">Raha</h1>
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

            {/* HIPAA Status */}
            <div className="hidden sm:flex items-center gap-1">
              <Shield className="h-4 w-4 text-green-600" />
              <span className="text-xs text-green-600 font-medium">HIPAA</span>
            </div>

            {/* New Note Button */}
            <Button
              onClick={onNewNote}
              className="bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 text-white shadow-lg"
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
              <SheetContent side="right" className="w-80 bg-white border-l border-slate-200 shadow-xl">
                <div className="flex flex-col h-full bg-white">
                  {/* Header */}
                  <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-200">
                    <Avatar className="w-12 h-12">
                      <AvatarFallback className="bg-gradient-to-br from-teal-500 to-blue-600 text-white font-semibold">
                        {userProfile.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h2 className="font-semibold text-slate-900">{userProfile.name}</h2>
                      <p className="text-sm text-slate-600">{userProfile.role}</p>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="space-y-3 mb-6">
                    <h3 className="text-sm font-semibold text-slate-900 px-1">Quick Actions</h3>
                    <Button
                      onClick={() => {
                        onNewNote?.();
                        setIsMenuOpen(false);
                      }}
                      className="w-full justify-start h-12 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-sm"
                    >
                      <Mic className="h-4 w-4 mr-3" />
                      New Note
                    </Button>
                  </div>

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
