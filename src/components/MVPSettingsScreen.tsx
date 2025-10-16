import { useState } from 'react';
import { 
  Settings, 
  Mic, 
  Volume2, 
  Shield, 
  Clock, 
  User, 
  Bell,
  Globe,
  HelpCircle,
  ArrowLeft,
  Save,
  RotateCcw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface MVPSettingsScreenProps {
  onNavigate: (screen: string) => void;
}

export function MVPSettingsScreen({ onNavigate }: MVPSettingsScreenProps) {
  const [settings, setSettings] = useState({
    // Voice Settings
    voiceSpeed: 1.0,
    voiceAccuracy: 'high',
    autoStop: true,
    voiceCommands: true,
    
    // Template Settings
    defaultTemplate: 'SOAP',
    autoSave: true,
    
    // Privacy Settings
    hipaaMode: true,
    dataRetention: '7days',
    localOnly: true,
    
    // Notification Settings
    notifications: true,
    soundEffects: true,
    vibration: true,
    
    // App Settings
    darkMode: false,
    language: 'en',
    timezone: 'local'
  });

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSaveSettings = () => {
    localStorage.setItem('nursescribe_settings', JSON.stringify(settings));
    // Show success feedback
  };

  const handleResetSettings = () => {
    // Reset to defaults
    setSettings({
      voiceSpeed: 1.0,
      voiceAccuracy: 'high',
      autoStop: true,
      voiceCommands: true,
      defaultTemplate: 'SOAP',
      autoSave: true,
      hipaaMode: true,
      dataRetention: '7days',
      localOnly: true,
      notifications: true,
      soundEffects: true,
      vibration: true,
      darkMode: false,
      language: 'en',
      timezone: 'local'
    });
  };

  return (
    <div className="mvp-app bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      {/* Mobile-Optimized Compact Header */}
      <div className="lg:hidden flex-shrink-0 p-3 bg-white/90 backdrop-blur-sm border-b border-slate-200">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onNavigate('home')}
            className="h-8 w-8 p-0"
          >
            <ArrowLeft className="h-3 w-3" />
          </Button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-teal-500 to-blue-600 rounded-lg flex items-center justify-center">
              <Settings className="h-4 w-4 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900">Settings</h1>
              <p className="text-xs text-slate-600">Customize experience</p>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Header */}
      <div className="hidden lg:block flex-shrink-0 p-4 bg-white/90 backdrop-blur-sm border-b border-slate-200">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onNavigate('home')}
            className="h-9 w-9 p-0"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-teal-500 to-blue-600 rounded-xl flex items-center justify-center">
              <Settings className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
              <p className="text-sm text-slate-600">Customize your experience</p>
            </div>
          </div>
        </div>
      </div>

      {/* Settings Content - Mobile Optimized */}
      <div className="flex-1 overflow-y-auto px-3 py-2 lg:px-4 lg:py-4 space-y-4 lg:space-y-6 min-h-0">
        {/* Voice Settings */}
        <Card className="p-4 lg:p-6">
          <div className="flex items-center gap-2 lg:gap-3 mb-4 lg:mb-6">
            <div className="w-6 h-6 lg:w-8 lg:h-8 bg-gradient-primary/10 rounded-lg flex items-center justify-center">
              <Mic className="h-3 w-3 lg:h-4 lg:w-4 text-primary" />
            </div>
            <h2 className="text-base lg:text-lg font-semibold">Voice Settings</h2>
          </div>

          <div className="space-y-4 lg:space-y-6">
            {/* Voice Speed */}
            <div className="space-y-2 lg:space-y-3">
              <Label className="text-xs lg:text-sm font-medium">Recording Speed</Label>
              <div className="px-2 lg:px-3">
                <Slider
                  value={[settings.voiceSpeed]}
                  onValueChange={(value) => handleSettingChange('voiceSpeed', value[0])}
                  max={2.0}
                  min={0.5}
                  step={0.1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>Slow (0.5x)</span>
                  <span>Current: {settings.voiceSpeed}x</span>
                  <span>Fast (2.0x)</span>
                </div>
              </div>
            </div>

            {/* Voice Accuracy */}
            <div className="space-y-2 lg:space-y-3">
              <Label className="text-xs lg:text-sm font-medium">Voice Recognition Accuracy</Label>
              <Select 
                value={settings.voiceAccuracy} 
                onValueChange={(value) => handleSettingChange('voiceAccuracy', value)}
              >
                <SelectTrigger className="h-8 lg:h-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">High Accuracy (Recommended)</SelectItem>
                  <SelectItem value="medium">Medium Accuracy (Faster)</SelectItem>
                  <SelectItem value="low">Low Accuracy (Fastest)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Voice Options */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-sm font-medium">Auto-stop Recording</Label>
                  <p className="text-xs text-muted-foreground">
                    Automatically stop after 5 minutes of silence
                  </p>
                </div>
                <Switch
                  checked={settings.autoStop}
                  onCheckedChange={(value) => handleSettingChange('autoStop', value)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-sm font-medium">Voice Commands</Label>
                  <p className="text-xs text-muted-foreground">
                    Enable hands-free voice controls
                  </p>
                </div>
                <Switch
                  checked={settings.voiceCommands}
                  onCheckedChange={(value) => handleSettingChange('voiceCommands', value)}
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Template Settings */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-gradient-secondary/10 rounded-lg flex items-center justify-center">
              <Volume2 className="h-4 w-4 text-secondary" />
            </div>
            <h2 className="text-lg font-semibold">Template Settings</h2>
          </div>

          <div className="space-y-4">
            <div className="space-y-3">
              <Label className="text-sm font-medium">Default Template</Label>
              <Select 
                value={settings.defaultTemplate} 
                onValueChange={(value) => handleSettingChange('defaultTemplate', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SOAP">SOAP (Subjective, Objective, Assessment, Plan)</SelectItem>
                  <SelectItem value="SBAR">SBAR (Situation, Background, Assessment, Recommendation)</SelectItem>
                  <SelectItem value="PIE">PIE (Problem, Intervention, Evaluation)</SelectItem>
                  <SelectItem value="DAR">DAR (Data, Action, Response)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-sm font-medium">Auto-save Drafts</Label>
                <p className="text-xs text-muted-foreground">
                  Automatically save notes as you work
                </p>
              </div>
              <Switch
                checked={settings.autoSave}
                onCheckedChange={(value) => handleSettingChange('autoSave', value)}
              />
            </div>
          </div>
        </Card>

        {/* Privacy Settings */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-success/10 rounded-lg flex items-center justify-center">
              <Shield className="h-4 w-4 text-success" />
            </div>
            <h2 className="text-lg font-semibold">Privacy & Security</h2>
          </div>

          <div className="space-y-4">
            <Alert className="border-success/20 bg-success/10">
              <Shield className="h-4 w-4 text-success" />
              <AlertDescription className="text-success">
                HIPAA Mode is enabled. All data is processed locally on your device.
              </AlertDescription>
            </Alert>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-sm font-medium">HIPAA Compliance Mode</Label>
                <p className="text-xs text-muted-foreground">
                  Ensures no PHI is transmitted to external servers
                </p>
              </div>
              <Switch
                checked={settings.hipaaMode}
                onCheckedChange={(value) => handleSettingChange('hipaaMode', value)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-sm font-medium">Local Processing Only</Label>
                <p className="text-xs text-muted-foreground">
                  Process all data on your device
                </p>
              </div>
              <Switch
                checked={settings.localOnly}
                onCheckedChange={(value) => handleSettingChange('localOnly', value)}
              />
            </div>

            <div className="space-y-3">
              <Label className="text-sm font-medium">Data Retention</Label>
              <Select 
                value={settings.dataRetention} 
                onValueChange={(value) => handleSettingChange('dataRetention', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1day">1 Day</SelectItem>
                  <SelectItem value="7days">7 Days</SelectItem>
                  <SelectItem value="30days">30 Days</SelectItem>
                  <SelectItem value="never">Never Delete</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        {/* Notification Settings */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-warning/10 rounded-lg flex items-center justify-center">
              <Bell className="h-4 w-4 text-warning" />
            </div>
            <h2 className="text-lg font-semibold">Notifications</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-sm font-medium">Enable Notifications</Label>
                <p className="text-xs text-muted-foreground">
                  Get notified about app updates and reminders
                </p>
              </div>
              <Switch
                checked={settings.notifications}
                onCheckedChange={(value) => handleSettingChange('notifications', value)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-sm font-medium">Sound Effects</Label>
                <p className="text-xs text-muted-foreground">
                  Play sounds for recording start/stop
                </p>
              </div>
              <Switch
                checked={settings.soundEffects}
                onCheckedChange={(value) => handleSettingChange('soundEffects', value)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-sm font-medium">Vibration</Label>
                <p className="text-xs text-muted-foreground">
                  Vibrate for notifications and feedback
                </p>
              </div>
              <Switch
                checked={settings.vibration}
                onCheckedChange={(value) => handleSettingChange('vibration', value)}
              />
            </div>
          </div>
        </Card>
      </div>

      {/* Mobile-Optimized Action Buttons */}
      <div className="lg:hidden p-3 pb-24 space-y-2 bg-white/90 backdrop-blur-sm border-t border-slate-200">
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleResetSettings}
            className="flex-1 h-9"
          >
            <RotateCcw className="h-3 w-3 mr-1" />
            Reset
          </Button>
          
          <Button
            size="sm"
            onClick={handleSaveSettings}
            className="flex-1 h-9 bg-gradient-primary"
          >
            <Save className="h-3 w-3 mr-1" />
            Save
          </Button>
        </div>

        <div className="text-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onNavigate('home')}
            className="text-xs text-muted-foreground h-7"
          >
            ← Back to Home
          </Button>
        </div>
      </div>

      {/* Desktop Action Buttons */}
      <div className="hidden lg:block p-6 pt-4 space-y-3">
        <div className="flex gap-3">
          <Button
            variant="outline"
            size="lg"
            onClick={handleResetSettings}
            className="flex-1 h-12"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset to Defaults
          </Button>
          
          <Button
            size="lg"
            onClick={handleSaveSettings}
            className="flex-1 h-12 bg-gradient-primary"
          >
            <Save className="h-4 w-4 mr-2" />
            Save Settings
          </Button>
        </div>

        <div className="text-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onNavigate('home')}
            className="text-muted-foreground"
          >
            ← Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
}
