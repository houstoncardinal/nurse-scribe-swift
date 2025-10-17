import { Mic, FileText, Download, Settings, BarChart3, BookOpen, Users, Brain, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useState } from 'react';

interface MobileBottomToolbarProps {
  currentScreen: string;
  onNavigate: (screen: string) => void;
  isRecording?: boolean;
  isProcessing?: boolean;
}

export function MobileBottomToolbar({
  currentScreen,
  onNavigate,
  isRecording = false,
  isProcessing = false
}: MobileBottomToolbarProps) {
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);

  const mainNavigationItems = [
    { 
      id: 'home', 
      label: 'New Note', 
      icon: Mic, 
      active: currentScreen === 'home',
      badge: isRecording ? 'recording' : isProcessing ? 'processing' : null
    },
    { 
      id: 'history', 
      label: 'History', 
      icon: FileText, 
      active: currentScreen === 'history' 
    },
    { 
      id: 'copilot', 
      label: 'AI Copilot', 
      icon: Brain, 
      active: currentScreen === 'copilot' 
    },
  ];

  const moreMenuItems = [
    { 
      id: 'draft', 
      label: 'Draft Preview', 
      icon: FileText, 
      active: currentScreen === 'draft' 
    },
    { 
      id: 'export', 
      label: 'Export', 
      icon: Download, 
      active: currentScreen === 'export' 
    },
    { 
      id: 'analytics', 
      label: 'Analytics', 
      icon: BarChart3, 
      active: currentScreen === 'analytics' 
    },
    { 
      id: 'education', 
      label: 'Education', 
      icon: BookOpen, 
      active: currentScreen === 'education' 
    },
    { 
      id: 'team', 
      label: 'Team', 
      icon: Users, 
      active: currentScreen === 'team' 
    },
    { 
      id: 'settings', 
      label: 'Settings', 
      icon: Settings, 
      active: currentScreen === 'settings' 
    },
  ];

  const handleNavigate = (screen: string) => {
    onNavigate(screen);
    setIsMoreMenuOpen(false);
  };

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/98 backdrop-blur-2xl border-t border-slate-200/60 shadow-2xl shadow-slate-900/5">
        <div className="px-3 py-2.5">
          <div className="flex items-center justify-around gap-1">
            {mainNavigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.active;
            const hasBadge = item.badge;
            
            return (
              <button
                key={item.id}
                className={`
                  relative flex-1 h-14 flex flex-col items-center justify-center gap-1.5
                  rounded-2xl transition-all duration-300 ease-out group
                  ${isActive 
                    ? 'bg-gradient-to-b from-teal-500 to-teal-600 shadow-lg shadow-teal-500/30 scale-[1.02]' 
                    : 'hover:bg-slate-100/80 active:scale-95'
                  }
                `}
                onClick={() => handleNavigate(item.id)}
              >
                {/* Active Background Glow */}
                {isActive && (
                  <div className="absolute inset-0 bg-gradient-to-b from-teal-400/20 to-transparent rounded-2xl" />
                )}
                
                <div className="relative z-10">
                  <Icon className={`
                    h-5 w-5 transition-all duration-300
                    ${isActive 
                      ? 'text-white drop-shadow-sm' 
                      : 'text-slate-500 group-hover:text-teal-600 group-active:scale-90'
                    }
                  `} />
                  
                  {/* Status Badge */}
                  {hasBadge && (
                    <div className={`
                      absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full border-2
                      ${isActive ? 'border-white' : 'border-slate-100'}
                      ${hasBadge === 'recording' ? 'bg-red-500 animate-pulse' :
                        hasBadge === 'processing' ? 'bg-amber-500 animate-pulse' :
                        'bg-emerald-500'
                      }
                    `} />
                  )}
                </div>
                
                <span className={`
                  text-[10px] font-semibold leading-none transition-all duration-300 relative z-10
                  ${isActive 
                    ? 'text-white drop-shadow-sm' 
                    : 'text-slate-600 group-hover:text-teal-600'
                  }
                `}>
                  {item.label}
                </span>

                {/* Hover Indicator */}
                {!isActive && (
                  <div className="absolute inset-x-4 bottom-0 h-0.5 bg-gradient-to-r from-teal-500 to-blue-500 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                )}
              </button>
            );
          })}
          
          {/* More Menu Button */}
          <Sheet open={isMoreMenuOpen} onOpenChange={setIsMoreMenuOpen}>
            <SheetTrigger asChild>
              <button
                className="relative flex-1 h-14 flex flex-col items-center justify-center gap-1.5 rounded-2xl transition-all duration-300 ease-out group hover:bg-slate-100/80 active:scale-95"
              >
                <div className="relative z-10">
                  <Menu className="h-5 w-5 text-slate-500 group-hover:text-teal-600 group-active:scale-90 transition-all duration-300" />
                </div>
                
                <span className="text-[10px] font-semibold leading-none text-slate-600 group-hover:text-teal-600 transition-all duration-300 relative z-10">
                  More
                </span>

                <div className="absolute inset-x-4 bottom-0 h-0.5 bg-gradient-to-r from-teal-500 to-blue-500 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
              </button>
            </SheetTrigger>
            
            <SheetContent side="bottom" className="h-[60vh] rounded-t-3xl">
              <div className="py-6">
                <h3 className="text-lg font-bold text-slate-900 mb-4 px-4">More Features</h3>
                <div className="grid grid-cols-2 gap-3 px-4">
                  {moreMenuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = item.active;
                    
                    return (
                      <button
                        key={item.id}
                        className={`
                          flex flex-col items-center justify-center gap-3 p-4 rounded-2xl transition-all duration-300
                          ${isActive 
                            ? 'bg-gradient-to-b from-teal-500 to-teal-600 shadow-lg shadow-teal-500/30' 
                            : 'bg-slate-50 hover:bg-slate-100 active:scale-95'
                          }
                        `}
                        onClick={() => handleNavigate(item.id)}
                      >
                        <Icon className={`h-6 w-6 ${isActive ? 'text-white' : 'text-slate-600'}`} />
                        <span className={`text-sm font-semibold ${isActive ? 'text-white' : 'text-slate-700'}`}>
                          {item.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </SheetContent>
          </Sheet>
          </div>
        </div>
        
        {/* Safe Area Bottom Spacing */}
        <div className="h-safe-area-inset-bottom bg-white/98" />
      </div>
    </>
  );
}
