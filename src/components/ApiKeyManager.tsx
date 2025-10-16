import { useState, useEffect } from 'react';
import { Eye, EyeOff, Key, Shield, AlertTriangle, CheckCircle2, Settings, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

interface ApiKeyManagerProps {
  isOpen: boolean;
  onClose: () => void;
  onApiKeysUpdated: (keys: ApiKeys) => void;
}

interface ApiKeys {
  openai: string;
  elevenlabs: string;
  elevenlabsVoiceId: string;
  useSupabase: boolean;
  hipaaMode: boolean;
}

export function ApiKeyManager({ isOpen, onClose, onApiKeysUpdated }: ApiKeyManagerProps) {
  const [apiKeys, setApiKeys] = useState<ApiKeys>({
    openai: '',
    elevenlabs: '',
    elevenlabsVoiceId: 'EXAVITQu4vr4xnSDxMaL', // Default professional voice
    useSupabase: false,
    hipaaMode: false,
  });
  
  const [showKeys, setShowKeys] = useState({
    openai: false,
    elevenlabs: false,
  });
  
  const [isValidating, setIsValidating] = useState(false);
  const [validationStatus, setValidationStatus] = useState<{
    openai: 'idle' | 'validating' | 'valid' | 'invalid';
    elevenlabs: 'idle' | 'validating' | 'valid' | 'invalid';
  }>({
    openai: 'idle',
    elevenlabs: 'idle',
  });

  // Load API keys from localStorage on mount
  useEffect(() => {
    const storedKeys = localStorage.getItem('nursescribe_api_keys');
    if (storedKeys) {
      try {
        const parsed = JSON.parse(storedKeys);
        setApiKeys(parsed);
      } catch (error) {
        console.error('Failed to parse stored API keys:', error);
      }
    }
  }, []);

  // Validate OpenAI API key
  const validateOpenAI = async (key: string): Promise<boolean> => {
    if (!key) return false;
    
    try {
      const response = await fetch('https://api.openai.com/v1/models', {
        headers: {
          'Authorization': `Bearer ${key}`,
          'Content-Type': 'application/json',
        },
      });
      return response.ok;
    } catch (error) {
      return false;
    }
  };

  // Validate ElevenLabs API key
  const validateElevenLabs = async (key: string): Promise<boolean> => {
    if (!key) return false;
    
    try {
      const response = await fetch('https://api.elevenlabs.io/v1/voices', {
        headers: {
          'xi-api-key': key,
        },
      });
      return response.ok;
    } catch (error) {
      return false;
    }
  };

  const handleValidateKey = async (type: 'openai' | 'elevenlabs') => {
    setIsValidating(true);
    setValidationStatus(prev => ({ ...prev, [type]: 'validating' }));

    try {
      let isValid = false;
      if (type === 'openai') {
        isValid = await validateOpenAI(apiKeys.openai);
      } else if (type === 'elevenlabs') {
        isValid = await validateElevenLabs(apiKeys.elevenlabs);
      }

      setValidationStatus(prev => ({ 
        ...prev, 
        [type]: isValid ? 'valid' : 'invalid' 
      }));

      if (isValid) {
        toast.success(`${type === 'openai' ? 'OpenAI' : 'ElevenLabs'} API key validated successfully`);
      } else {
        toast.error(`Invalid ${type === 'openai' ? 'OpenAI' : 'ElevenLabs'} API key`);
      }
    } catch (error) {
      setValidationStatus(prev => ({ ...prev, [type]: 'invalid' }));
      toast.error(`Failed to validate ${type === 'openai' ? 'OpenAI' : 'ElevenLabs'} API key`);
    } finally {
      setIsValidating(false);
    }
  };

  const handleSave = () => {
    // Save to localStorage
    localStorage.setItem('nursescribe_api_keys', JSON.stringify(apiKeys));
    
    // Update parent component
    onApiKeysUpdated(apiKeys);
    
    toast.success('API keys saved successfully');
    onClose();
  };

  const getValidationIcon = (type: 'openai' | 'elevenlabs') => {
    const status = validationStatus[type];
    switch (status) {
      case 'valid':
        return <CheckCircle2 className="h-4 w-4 text-success" />;
      case 'invalid':
        return <AlertTriangle className="h-4 w-4 text-destructive" />;
      case 'validating':
        return <div className="spinner-premium h-4 w-4" />;
      default:
        return null;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto glass border-border/50 shadow-2xl">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center">
                <Key className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h2 className="text-xl font-bold">API Configuration</h2>
                <p className="text-sm text-muted-foreground">Configure your AI service API keys</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              ×
            </Button>
          </div>

          {/* Security Notice */}
          <Alert className="bg-primary/10 border-primary/20">
            <Shield className="h-4 w-4 text-primary" />
            <AlertDescription className="text-sm">
              <strong className="text-primary">Secure Storage:</strong> API keys are stored locally in your browser and never transmitted to our servers.
            </AlertDescription>
          </Alert>

          {/* OpenAI Configuration */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="openai-key" className="text-base font-semibold">
                OpenAI API Key
              </Label>
              <Badge variant="outline" className="text-xs">
                Required for AI Composition
              </Badge>
            </div>
            
            <div className="space-y-2">
              <div className="relative">
                <Input
                  id="openai-key"
                  type={showKeys.openai ? 'text' : 'password'}
                  placeholder="sk-..."
                  value={apiKeys.openai}
                  onChange={(e) => setApiKeys(prev => ({ ...prev, openai: e.target.value }))}
                  className="pr-20"
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowKeys(prev => ({ ...prev, openai: !prev.openai }))}
                    className="h-8 w-8 p-0"
                  >
                    {showKeys.openai ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleValidateKey('openai')}
                    disabled={isValidating || !apiKeys.openai}
                    className="h-8 w-8 p-0"
                  >
                    {getValidationIcon('openai')}
                  </Button>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Get your API key from{' '}
                <a 
                  href="https://platform.openai.com/api-keys" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  OpenAI Platform
                </a>
              </p>
            </div>
          </div>

          <Separator />

          {/* ElevenLabs Configuration */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="elevenlabs-key" className="text-base font-semibold">
                ElevenLabs API Key
              </Label>
              <Badge variant="outline" className="text-xs">
                Required for Voice Readback
              </Badge>
            </div>
            
            <div className="space-y-2">
              <div className="relative">
                <Input
                  id="elevenlabs-key"
                  type={showKeys.elevenlabs ? 'text' : 'password'}
                  placeholder="Your ElevenLabs API key"
                  value={apiKeys.elevenlabs}
                  onChange={(e) => setApiKeys(prev => ({ ...prev, elevenlabs: e.target.value }))}
                  className="pr-20"
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowKeys(prev => ({ ...prev, elevenlabs: !prev.elevenlabs }))}
                    className="h-8 w-8 p-0"
                  >
                    {showKeys.elevenlabs ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleValidateKey('elevenlabs')}
                    disabled={isValidating || !apiKeys.elevenlabs}
                    className="h-8 w-8 p-0"
                  >
                    {getValidationIcon('elevenlabs')}
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="voice-id" className="text-sm font-medium">
                  Voice ID (Optional)
                </Label>
                <Input
                  id="voice-id"
                  placeholder="EXAVITQu4vr4xnSDxMaL"
                  value={apiKeys.elevenlabsVoiceId}
                  onChange={(e) => setApiKeys(prev => ({ ...prev, elevenlabsVoiceId: e.target.value }))}
                />
                <p className="text-xs text-muted-foreground">
                  Default: Professional medical voice. Get voice IDs from{' '}
                  <a 
                    href="https://elevenlabs.io/voice-library" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    ElevenLabs Voice Library
                  </a>
                </p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Advanced Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Advanced Settings
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div className="space-y-1">
                  <Label htmlFor="hipaa-mode" className="text-sm font-medium">
                    HIPAA Mode
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Enable encrypted storage and audit logging (requires Supabase)
                  </p>
                </div>
                <Switch
                  id="hipaa-mode"
                  checked={apiKeys.hipaaMode}
                  onCheckedChange={(checked) => setApiKeys(prev => ({ ...prev, hipaaMode: checked }))}
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div className="space-y-1">
                  <Label htmlFor="use-supabase" className="text-sm font-medium">
                    Enable Supabase (Metadata Only)
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Store usage analytics and audit logs (no PHI)
                  </p>
                </div>
                <Switch
                  id="use-supabase"
                  checked={apiKeys.useSupabase}
                  onCheckedChange={(checked) => setApiKeys(prev => ({ ...prev, useSupabase: checked }))}
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-border/50">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave} className="btn-premium">
              <Save className="h-4 w-4 mr-2" />
              Save Configuration
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
