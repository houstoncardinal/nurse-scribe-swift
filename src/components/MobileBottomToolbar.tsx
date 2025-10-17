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
      id: 'draft', 
      label: 'Draft', 
      icon: FileText, 
      active: currentScreen === 'draft' 
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
      id: 'history', 
      label: 'Note History', 
      icon: FileText, 
      active: currentScreen === 'history',
      description: 'View all your past notes'
    },
    { 
      id: 'export', 
      label: 'Export', 
      icon: Download, 
      active: currentScreen === 'export',
      description: 'Export to EHR systems'
    },
    { 
      id: 'analytics', 
      label: 'Analytics', 
      icon: BarChart3, 
      active: currentScreen === 'analytics',
      description: 'View your productivity insights'
    },
    { 
      id: 'education', 
      label: 'Education', 
      icon: BookOpen, 
      active: currentScreen === 'education',
      description: 'Learning resources & tutorials'
    },
    { 
      id: 'team', 
      label: 'Team', 
      icon: Users, 
      active: currentScreen === 'team',
      description: 'Manage team collaboration'
    },
    { 
      id: 'settings', 
      label: 'Settings', 
      icon: Settings, 
      active: currentScreen === 'settings',
      description: 'App preferences & configuration'
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
            
            <SheetContent side="bottom" className="h-[75vh] rounded-t-3xl border-t-2 border-gradient-to-r from-teal-500/20 via-blue-500/20 to-purple-500/20 bg-gradient-to-b from-slate-50 to-white">
              <div className="flex flex-col h-full">
                {/* Header with Gradient */}
                <div className="flex-shrink-0 pt-2 pb-4 px-4 border-b border-slate-200/60 bg-gradient-to-r from-teal-50/50 via-blue-50/50 to-purple-50/50 rounded-t-3xl">
                  <div className="w-12 h-1.5 bg-gradient-to-r from-teal-500 via-blue-500 to-purple-500 rounded-full mx-auto mb-4 opacity-40" />
                  <h3 className="text-xl font-bold bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 bg-clip-text text-transparent mb-1">
                    More Features
                  </h3>
                  <p className="text-sm text-slate-500">Access all your professional tools</p>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent">
                  {moreMenuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = item.active;
                    
                    return (
                      <button
                        key={item.id}
                        className={`
                          w-full flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 group relative overflow-hidden
                          ${isActive 
                            ? 'bg-gradient-to-r from-teal-500 via-blue-500 to-teal-600 shadow-xl shadow-teal-500/30 scale-[1.02]' 
                            : 'bg-white hover:bg-gradient-to-br hover:from-slate-50 hover:to-white border border-slate-200/60 hover:border-teal-200/60 hover:shadow-lg hover:shadow-teal-500/10 active:scale-95'
                          }
                        `}
                        onClick={() => handleNavigate(item.id)}
                      >
                        {/* Background Glow Effect */}
                        {isActive && (
                          <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-transparent to-white/20 animate-pulse" />
                        )}
                        
                        {/* Icon Container */}
                        <div className={`
                          relative z-10 flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300
                          ${isActive 
                            ? 'bg-white/20 shadow-lg' 
                            : 'bg-gradient-to-br from-teal-50 to-blue-50 group-hover:from-teal-100 group-hover:to-blue-100 group-hover:scale-110'
                          }
                        `}>
                          <Icon className={`h-5 w-5 transition-all duration-300 ${
                            isActive 
                              ? 'text-white' 
                              : 'text-teal-600 group-hover:text-teal-700'
                          }`} />
                        </div>
                        
                        {/* Text Content */}
                        <div className="relative z-10 flex-1 text-left">
                          <div className={`font-semibold transition-colors duration-300 ${
                            isActive ? 'text-white' : 'text-slate-900 group-hover:text-teal-900'
                          }`}>
                            {item.label}
                          </div>
                          <div className={`text-xs mt-0.5 transition-colors duration-300 ${
                            isActive ? 'text-white/90' : 'text-slate-500 group-hover:text-slate-600'
                          }`}>
                            {item.description}
                          </div>
                        </div>

                        {/* Active Indicator */}
                        {isActive && (
                          <div className="relative z-10 w-2 h-2 rounded-full bg-white shadow-lg animate-pulse" />
                        )}

                        {/* Hover Arrow */}
                        {!isActive && (
                          <div className="relative z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div className="w-6 h-6 rounded-full bg-teal-100 flex items-center justify-center">
                              <div className="w-1.5 h-1.5 border-r-2 border-t-2 border-teal-600 transform rotate-45" />
                            </div>
                          </div>
                        )}
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
