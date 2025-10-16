import { Mic, FileText, Download, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MobileBottomToolbarProps {
  currentScreen: 'home' | 'draft' | 'export' | 'settings';
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
  const navigationItems = [
    { 
      id: 'home', 
      label: 'New Note', 
      icon: Mic, 
      active: currentScreen === 'home',
      badge: isRecording ? 'recording' : isProcessing ? 'processing' : null
    },
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
      id: 'settings', 
      label: 'Settings', 
      icon: Settings, 
      active: currentScreen === 'settings' 
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-t border-slate-200 shadow-lg safe-area-bottom">
      <div className="px-4 py-2">
        <div className="flex items-center justify-around bg-slate-50/80 rounded-2xl p-1 border border-slate-100">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.active;
            const hasBadge = item.badge;
            
            return (
              <Button
                key={item.id}
                variant="ghost"
                size="sm"
                className={`flex-1 h-12 flex flex-col items-center justify-center gap-1 transition-all duration-200 relative ${
                  isActive 
                    ? 'bg-gradient-to-r from-teal-500 to-blue-600 text-white shadow-lg scale-105' 
                    : 'hover:bg-slate-200/50 text-slate-600'
                }`}
                onClick={() => onNavigate(item.id)}
              >
                <div className="relative">
                  <Icon className={`h-5 w-5 ${isActive ? 'text-white' : 'text-slate-600'}`} />
                  
                  {/* Status Badge */}
                  {hasBadge && (
                    <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
                      hasBadge === 'recording' ? 'bg-red-500 animate-pulse' :
                      hasBadge === 'processing' ? 'bg-yellow-500 animate-spin' :
                      'bg-green-500'
                    }`} />
                  )}
                </div>
                
                <span className={`text-xs font-medium leading-none ${
                  isActive ? 'text-white' : 'text-slate-600'
                }`}>
                  {item.label}
                </span>
              </Button>
            );
          })}
        </div>
      </div>
      
      {/* Safe Area Bottom Spacing */}
      <div className="h-safe-area-inset-bottom bg-white/95" />
    </div>
  );
}
