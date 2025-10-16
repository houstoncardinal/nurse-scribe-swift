import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mic, MicOff, AlertCircle, CheckCircle, XCircle } from 'lucide-react';

interface VoiceDebugPanelProps {
  isVisible?: boolean;
  onClose?: () => void;
}

export function VoiceDebugPanel({ isVisible = false, onClose }: VoiceDebugPanelProps) {
  const [permissionStatus, setPermissionStatus] = useState<string>('Unknown');
  const [microphoneStatus, setMicrophoneStatus] = useState<string>('Unknown');
  const [speechRecognitionStatus, setSpeechRecognitionStatus] = useState<string>('Unknown');
  const [testRecording, setTestRecording] = useState<boolean>(false);
  const [debugLogs, setDebugLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setDebugLogs(prev => [`[${timestamp}] ${message}`, ...prev.slice(0, 9)]);
  };

  useEffect(() => {
    if (isVisible) {
      checkVoiceSupport();
    }
  }, [isVisible]);

  const checkVoiceSupport = async () => {
    addLog('🔍 Checking voice recognition support...');
    
    // Check Speech Recognition support
    const hasSpeechRecognition = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
    setSpeechRecognitionStatus(hasSpeechRecognition ? 'Supported' : 'Not Supported');
    addLog(`Speech Recognition: ${hasSpeechRecognition ? '✅ Supported' : '❌ Not Supported'}`);
    
    // Check Media Devices support
    const hasMediaDevices = 'mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices;
    setMicrophoneStatus(hasMediaDevices ? 'Supported' : 'Not Supported');
    addLog(`Media Devices: ${hasMediaDevices ? '✅ Supported' : '❌ Not Supported'}`);
    
    // Check microphone permissions
    if (hasMediaDevices) {
      try {
        addLog('🎤 Requesting microphone permission...');
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        setPermissionStatus('Granted');
        addLog('✅ Microphone permission granted');
        
        // Stop the stream
        stream.getTracks().forEach(track => track.stop());
      } catch (error: any) {
        setPermissionStatus('Denied');
        addLog(`❌ Microphone permission denied: ${error.name} - ${error.message}`);
      }
    } else {
      setPermissionStatus('Not Available');
      addLog('❌ Media devices not available');
    }
  };

  const testMicrophone = async () => {
    try {
      addLog('🎤 Testing microphone...');
      setTestRecording(true);
      
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      addLog('✅ Microphone stream created successfully');
      
      // Record for 3 seconds
      setTimeout(() => {
        stream.getTracks().forEach(track => track.stop());
        setTestRecording(false);
        addLog('✅ Microphone test completed');
      }, 3000);
      
    } catch (error: any) {
      setTestRecording(false);
      addLog(`❌ Microphone test failed: ${error.name} - ${error.message}`);
    }
  };

  const testSpeechRecognition = () => {
    addLog('🗣️ Testing speech recognition...');
    
    if ('webkitSpeechRecognition' in window) {
      const recognition = new (window as any).webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';
      
      recognition.onstart = () => {
        addLog('✅ Speech recognition started');
      };
      
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        addLog(`✅ Speech recognized: "${transcript}"`);
      };
      
      recognition.onerror = (event: any) => {
        addLog(`❌ Speech recognition error: ${event.error}`);
      };
      
      recognition.onend = () => {
        addLog('✅ Speech recognition ended');
      };
      
      try {
        recognition.start();
        setTimeout(() => {
          recognition.stop();
        }, 5000);
      } catch (error: any) {
        addLog(`❌ Failed to start speech recognition: ${error.message}`);
      }
    } else {
      addLog('❌ Speech recognition not supported');
    }
  };

  if (!isVisible) return null;

  return (
    <Card className="fixed top-4 right-4 w-96 max-h-[80vh] overflow-y-auto z-50 bg-white shadow-2xl border-2">
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Voice Debug Panel</h3>
          {onClose && (
            <Button variant="ghost" size="sm" onClick={onClose}>
              <XCircle className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Status Indicators */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Speech Recognition:</span>
            <Badge variant={speechRecognitionStatus === 'Supported' ? 'default' : 'destructive'}>
              {speechRecognitionStatus}
            </Badge>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Microphone:</span>
            <Badge variant={microphoneStatus === 'Supported' ? 'default' : 'destructive'}>
              {microphoneStatus}
            </Badge>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Permission:</span>
            <Badge variant={permissionStatus === 'Granted' ? 'default' : 'destructive'}>
              {permissionStatus}
            </Badge>
          </div>
        </div>

        {/* Test Buttons */}
        <div className="space-y-2">
          <Button 
            onClick={checkVoiceSupport}
            variant="outline"
            size="sm"
            className="w-full"
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Check Support
          </Button>
          
          <Button 
            onClick={testMicrophone}
            variant="outline"
            size="sm"
            className="w-full"
            disabled={testRecording}
          >
            {testRecording ? (
              <>
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                Testing...
              </>
            ) : (
              <>
                <Mic className="h-4 w-4 mr-2" />
                Test Microphone
              </>
            )}
          </Button>
          
          <Button 
            onClick={testSpeechRecognition}
            variant="outline"
            size="sm"
            className="w-full"
          >
            <MicOff className="h-4 w-4 mr-2" />
            Test Speech Recognition
          </Button>
        </div>

        {/* Debug Logs */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Debug Logs:</h4>
          <div className="bg-gray-100 p-2 rounded text-xs font-mono max-h-32 overflow-y-auto">
            {debugLogs.length === 0 ? (
              <span className="text-gray-500">No logs yet...</span>
            ) : (
              debugLogs.map((log, index) => (
                <div key={index} className="mb-1">
                  {log}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
