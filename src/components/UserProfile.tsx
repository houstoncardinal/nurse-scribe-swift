import { useState } from 'react';
import { 
  User, Mail, Phone, MapPin, Calendar, Award, Shield, 
  Edit3, Save, X, Camera, Bell, Lock, Globe, Clock,
  TrendingUp, FileText, Timer, Target, BarChart3, AlertTriangle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';

interface UserProfileData {
  name: string;
  email: string;
  role: string;
  credentials: string;
  phone?: string;
  location?: string;
  joinDate: string;
  avatar?: string;
  preferences: {
    notifications: boolean;
    voiceSpeed: number;
    defaultTemplate: string;
    autoSave: boolean;
    darkMode: boolean;
  };
  stats: {
    totalNotes: number;
    timeSaved: number;
    accuracy: number;
    weeklyGoal: number;
    notesThisWeek: number;
  };
  achievements: Array<{
    id: string;
    title: string;
    description: string;
    icon: string;
    unlockedAt: string;
  }>;
}

interface UserProfileProps {
  user: UserProfileData;
  onUpdate: (updatedUser: Partial<UserProfileData>) => Promise<void>;
  onSignOut: () => void;
}

export function UserProfile({ user, onUpdate, onSignOut }: UserProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(user);

  const handleSave = async () => {
    await onUpdate(editData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData(user);
    setIsEditing(false);
  };

  const handleInputChange = (field: string, value: any) => {
    setEditData(prev => ({ ...prev, [field]: value }));
  };

  const handlePreferenceChange = (field: string, value: any) => {
    setEditData(prev => ({
      ...prev,
      preferences: { ...prev.preferences, [field]: value }
    }));
  };

  return (
    <div className="mvp-app max-w-4xl mx-auto p-3 lg:p-6 space-y-4 lg:space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl lg:text-3xl font-bold text-slate-900">Profile</h1>
          <p className="text-xs lg:text-sm text-slate-600">Manage your account and preferences</p>
        </div>
        <Button onClick={onSignOut} variant="outline" className="text-red-600 border-red-200 hover:bg-red-50 h-8 lg:h-10">
          <span className="text-xs lg:text-sm">Sign Out</span>
        </Button>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
          <TabsTrigger value="stats">Statistics</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          {/* Needs Attention Section */}
          <Card className="bg-gradient-to-br from-orange-50 to-red-50 border border-orange-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-orange-600" />
                Needs Your Attention
              </CardTitle>
              <CardDescription>Items requiring your review or action</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-white rounded-lg border border-orange-100">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-slate-900">Pending Note Reviews</h4>
                  <p className="text-sm text-slate-600">3 notes awaiting your approval</p>
                </div>
                <Badge className="bg-red-100 text-red-700 border-red-200">3</Badge>
              </div>
              <div className="flex items-center gap-4 p-4 bg-white rounded-lg border border-orange-100">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-slate-900">Upcoming Documentation</h4>
                  <p className="text-sm text-slate-600">2 scheduled assessments due today</p>
                </div>
                <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">2</Badge>
              </div>
              <Button variant="outline" className="w-full">
                View All Notifications
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>Update your personal details and contact information</CardDescription>
                </div>
                {!isEditing ? (
                  <Button onClick={() => setIsEditing(true)} variant="outline">
                    <Edit3 className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button onClick={handleSave} size="sm">
                      <Save className="h-4 w-4 mr-2" />
                      Save
                    </Button>
                    <Button onClick={handleCancel} variant="outline" size="sm">
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Avatar Section */}
              <div className="flex items-center gap-6">
                <div className="relative">
                  <Avatar className="w-24 h-24">
                    <AvatarFallback className="bg-gradient-to-br from-teal-500 to-blue-600 text-white text-2xl font-semibold">
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  {isEditing && (
                    <Button size="sm" className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full p-0">
                      <Camera className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <div className="space-y-1">
                  <h3 className="text-xl font-semibold text-slate-900">{user.name}</h3>
                  <p className="text-slate-600">{user.role} • {user.credentials}</p>
                  <Badge className="bg-green-100 text-green-700 border-green-200">
                    <Shield className="h-3 w-3 mr-1" />
                    HIPAA Verified
                  </Badge>
                </div>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={isEditing ? editData.name : user.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    disabled={!isEditing}
                    className="bg-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={isEditing ? editData.email : user.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    disabled={!isEditing}
                    className="bg-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Input
                    id="role"
                    value={isEditing ? editData.role : user.role}
                    onChange={(e) => handleInputChange('role', e.target.value)}
                    disabled={!isEditing}
                    className="bg-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="credentials">Credentials</Label>
                  <Input
                    id="credentials"
                    value={isEditing ? editData.credentials : user.credentials}
                    onChange={(e) => handleInputChange('credentials', e.target.value)}
                    disabled={!isEditing}
                    className="bg-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone (Optional)</Label>
                  <Input
                    id="phone"
                    value={isEditing ? editData.phone || '' : user.phone || ''}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    disabled={!isEditing}
                    className="bg-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location (Optional)</Label>
                  <Input
                    id="location"
                    value={isEditing ? editData.location || '' : user.location || ''}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    disabled={!isEditing}
                    className="bg-white"
                  />
                </div>
              </div>

              {/* Account Info */}
              <div className="pt-4 border-t border-slate-200">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Calendar className="h-4 w-4" />
                  Member since {user.joinDate}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Preferences Tab */}
        <TabsContent value="preferences" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Application Preferences</CardTitle>
              <CardDescription>Customize your Raha experience</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor="notifications">Push Notifications</Label>
                    <p className="text-sm text-slate-600">Receive alerts for pending reviews and updates</p>
                  </div>
                  <Switch
                    id="notifications"
                    checked={editData.preferences.notifications}
                    onCheckedChange={(checked) => handlePreferenceChange('notifications', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor="autoSave">Auto-save Notes</Label>
                    <p className="text-sm text-slate-600">Automatically save notes as you work</p>
                  </div>
                  <Switch
                    id="autoSave"
                    checked={editData.preferences.autoSave}
                    onCheckedChange={(checked) => handlePreferenceChange('autoSave', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor="darkMode">Dark Mode</Label>
                    <p className="text-sm text-slate-600">Switch to dark theme</p>
                  </div>
                  <Switch
                    id="darkMode"
                    checked={editData.preferences.darkMode}
                    onCheckedChange={(checked) => handlePreferenceChange('darkMode', checked)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="voiceSpeed">Voice Recognition Speed</Label>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-slate-600">Slow</span>
                    <Progress value={editData.preferences.voiceSpeed} className="flex-1" />
                    <span className="text-sm text-slate-600">Fast</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="defaultTemplate">Default Note Template</Label>
                  <select
                    id="defaultTemplate"
                    value={editData.preferences.defaultTemplate}
                    onChange={(e) => handlePreferenceChange('defaultTemplate', e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  >
                    <option value="SOAP">SOAP</option>
                    <option value="SBAR">SBAR</option>
                    <option value="PIE">PIE</option>
                    <option value="DAR">DAR</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Statistics Tab */}
        <TabsContent value="stats" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <FileText className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Total Notes</p>
                    <p className="text-2xl font-bold text-slate-900">{user.stats.totalNotes}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                    <Timer className="h-6 w-6 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Time Saved</p>
                    <p className="text-2xl font-bold text-slate-900">{user.stats.timeSaved}h</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Target className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Accuracy</p>
                    <p className="text-2xl font-bold text-slate-900">{user.stats.accuracy}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">This Week</p>
                    <p className="text-2xl font-bold text-slate-900">{user.stats.notesThisWeek}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Weekly Goal Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-700">Notes This Week</span>
                  <span className="text-sm font-bold text-slate-900">
                    {user.stats.notesThisWeek} / {user.stats.weeklyGoal}
                  </span>
                </div>
                <Progress value={(user.stats.notesThisWeek / user.stats.weeklyGoal) * 100} className="h-3" />
                <p className="text-sm text-slate-600">
                  {user.stats.weeklyGoal - user.stats.notesThisWeek} more notes to reach your weekly goal
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Achievements Tab */}
        <TabsContent value="achievements" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {user.achievements.map((achievement) => (
              <Card key={achievement.id}>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                      <Award className="h-6 w-6 text-yellow-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900">{achievement.title}</h3>
                      <p className="text-sm text-slate-600">{achievement.description}</p>
                      <p className="text-xs text-slate-500 mt-1">Unlocked {achievement.unlockedAt}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
