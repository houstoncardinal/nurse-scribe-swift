/**
 * Voice Recognition Status Component
 * Shows available voice recognition methods and their status
 */

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Download, Wifi, WifiOff, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { enhancedVoiceService } from '@/lib/enhancedVoiceService';
import { whisperWasmService } from '@/lib/whisperWasmService';

interface VoiceRecognitionStatusProps {
  className?: string;
}

export function VoiceRecognitionStatus({ className = '' }: VoiceRecognitionStatusProps) {
  const [availableMethods, setAvailableMethods] = useState<Array<{ name: string; available: boolean; type: 'browser' | 'whisper' }>>([]);
  const [whisperInfo, setWhisperInfo] = useState<{ name: string; size: string; languages: string[] } | null>(null);
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    // Get available methods
    const methods = enhancedVoiceService.getAvailableMethods();
    setAvailableMethods(methods);

    // Get Whisper info if available
    const info = enhancedVoiceService.getWhisperInfo();
    setWhisperInfo(info);

    // Check listening status periodically
    const interval = setInterval(() => {
      setIsListening(enhancedVoiceService.getIsListening());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const getMethodIcon = (type: 'browser' | 'whisper') => {
    switch (type) {
      case 'browser':
        return <Wifi className="h-4 w-4" />;
      case 'whisper':
        return <Download className="h-4 w-4" />;
      default:
        return <Mic className="h-4 w-4" />;
    }
  };

  const getMethodStatus = (available: boolean) => {
    if (available) {
      return <CheckCircle className="h-4 w-4 text-green-600" />;
    } else {
      return <XCircle className="h-4 w-4 text-red-600" />;
    }
  };

  const getMethodBadge = (available: boolean, type: 'browser' | 'whisper') => {
    if (available) {
      return (
        <Badge className="bg-green-100 text-green-800 border-green-200">
          Available
        </Badge>
      );
    } else {
      const reason = type === 'whisper' ? 'Not Loaded' : 'Not Supported';
      return (
        <Badge variant="secondary" className="bg-gray-100 text-gray-600">
          {reason}
        </Badge>
      );
    }
  };

  return (
    <Card className={`p-4 bg-gradient-to-br from-slate-50 to-white border border-slate-200 shadow-sm ${className}`}>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            {isListening ? (
              <Mic className="h-5 w-5 text-red-600 animate-pulse" />
            ) : (
              <MicOff className="h-5 w-5 text-slate-600" />
            )}
            <h3 className="font-semibold text-slate-900">Voice Recognition</h3>
          </div>
          {isListening && (
            <Badge className="bg-red-100 text-red-800 border-red-200 animate-pulse">
              Recording
            </Badge>
          )}
        </div>

        {/* Available Methods */}
        <div className="space-y-3">
          {availableMethods.map((method, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-100">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  {getMethodIcon(method.type)}
                  <span className="font-medium text-slate-700">{method.name}</span>
                </div>
                {getMethodStatus(method.available)}
              </div>
              <div className="flex items-center gap-2">
                {getMethodBadge(method.available, method.type)}
              </div>
            </div>
          ))}
        </div>

        {/* Whisper Model Info */}
        {whisperInfo && (
          <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2 mb-2">
              <Download className="h-4 w-4 text-blue-600" />
              <span className="font-medium text-blue-900">Whisper Model</span>
            </div>
            <div className="space-y-1 text-sm text-blue-800">
              <div><strong>Model:</strong> {whisperInfo.name}</div>
              <div><strong>Size:</strong> {whisperInfo.size}</div>
              <div><strong>Languages:</strong> {whisperInfo.languages.join(', ')}</div>
            </div>
          </div>
        )}

        {/* Status Info */}
        <div className="text-xs text-slate-600 space-y-1">
          <div className="flex items-center gap-1">
            <Wifi className="h-3 w-3" />
            <span>Browser Speech API - Requires internet connection</span>
          </div>
          <div className="flex items-center gap-1">
            <Download className="h-3 w-3" />
            <span>Whisper WebAssembly - Works offline, higher accuracy</span>
          </div>
        </div>

        {/* Performance Note */}
        <div className="p-2 bg-yellow-50 rounded border border-yellow-200">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-yellow-600" />
            <span className="text-xs text-yellow-800">
              Whisper processes audio after recording stops for best accuracy
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}
