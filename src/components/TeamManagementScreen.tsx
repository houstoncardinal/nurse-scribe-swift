import { useState } from 'react';
import { 
  Users, 
  UserPlus, 
  Mail, 
  Shield, 
  Settings, 
  MoreHorizontal,
  Edit,
  Trash2,
  Star,
  Clock,
  TrendingUp,
  Award,
  Target,
  Activity,
  CheckCircle,
  XCircle,
  RefreshCw,
  Download,
  Upload,
  Filter,
  Search
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';

export function TeamManagementScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  const teamMembers = [
    {
      id: '1',
      name: 'Dr. Sarah Johnson',
      email: 'sarah.johnson@hospital.com',
      role: 'Team Lead',
      department: 'Emergency',
      status: 'active',
      notesCreated: 247,
      avgAccuracy: 99.5,
      joinedDate: '2023-06-15',
      lastActive: '2 hours ago'
    },
    {
      id: '2',
      name: 'Nurse Mike Chen',
      email: 'mike.chen@hospital.com',
      role: 'Senior Nurse',
      department: 'ICU',
      status: 'active',
      notesCreated: 189,
      avgAccuracy: 98.8,
      joinedDate: '2023-08-22',
      lastActive: '1 hour ago'
    },
    {
      id: '3',
      name: 'Dr. Emily Rodriguez',
      email: 'emily.rodriguez@hospital.com',
      role: 'Physician',
      department: 'Pediatrics',
      status: 'active',
      notesCreated: 321,
      avgAccuracy: 99.2,
      joinedDate: '2023-04-10',
      lastActive: '30 minutes ago'
    }
  ];

  const teamStats = {
    totalMembers: 12,
    activeNow: 8,
    notesThisWeek: 147,
    avgAccuracy: 99.1,
    timesSaved: 42.5
  };

  return (
    <div className="h-full overflow-y-auto p-4 lg:p-8 space-y-6 lg:space-y-8">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-900">Team Collaboration</h1>
          <p className="text-sm lg:text-base text-slate-600 mt-1">Manage your team members and monitor performance</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button className="bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700">
            <UserPlus className="h-4 w-4 mr-2" />
            Invite Member
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Team Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-4 lg:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs lg:text-sm font-medium text-blue-700">Total Members</p>
                <p className="text-2xl lg:text-3xl font-bold text-blue-900">{teamStats.totalMembers}</p>
              </div>
              <Users className="h-8 w-8 lg:h-10 lg:w-10 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-4 lg:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs lg:text-sm font-medium text-green-700">Active Now</p>
                <p className="text-2xl lg:text-3xl font-bold text-green-900">{teamStats.activeNow}</p>
              </div>
              <Activity className="h-8 w-8 lg:h-10 lg:w-10 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-4 lg:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs lg:text-sm font-medium text-purple-700">Notes This Week</p>
                <p className="text-2xl lg:text-3xl font-bold text-purple-900">{teamStats.notesThisWeek}</p>
              </div>
              <TrendingUp className="h-8 w-8 lg:h-10 lg:w-10 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-4 lg:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs lg:text-sm font-medium text-orange-700">Avg Accuracy</p>
                <p className="text-2xl lg:text-3xl font-bold text-orange-900">{teamStats.avgAccuracy}%</p>
              </div>
              <Target className="h-8 w-8 lg:h-10 lg:w-10 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-teal-50 to-teal-100 border-teal-200">
          <CardContent className="p-4 lg:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs lg:text-sm font-medium text-teal-700">Time Saved</p>
                <p className="text-2xl lg:text-3xl font-bold text-teal-900">{teamStats.timesSaved}h</p>
              </div>
              <Clock className="h-8 w-8 lg:h-10 lg:w-10 text-teal-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4 lg:p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search team members..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-full lg:w-48">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="lead">Team Lead</SelectItem>
                <SelectItem value="senior">Senior Nurse</SelectItem>
                <SelectItem value="physician">Physician</SelectItem>
                <SelectItem value="nurse">Nurse</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Team Members Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
        {teamMembers
          .filter(member => 
            member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            member.role.toLowerCase().includes(searchQuery.toLowerCase())
          )
          .map((member) => (
            <Card key={member.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-4 lg:p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-gradient-to-br from-teal-500 to-blue-600 text-white">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-slate-900">{member.name}</h3>
                      <p className="text-sm text-slate-600">{member.role}</p>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Member
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Shield className="h-4 w-4 mr-2" />
                        Permissions
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Activity className="h-4 w-4 mr-2" />
                        View Activity
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Remove
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">Department</span>
                    <Badge variant="outline">{member.department}</Badge>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">Status</span>
                    <Badge className="bg-green-100 text-green-800">
                      {member.status}
                    </Badge>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600">Notes Created</span>
                      <span className="font-semibold">{member.notesCreated}</span>
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-600">Accuracy</span>
                        <span className="font-semibold">{member.avgAccuracy}%</span>
                      </div>
                      <Progress value={member.avgAccuracy} className="h-2" />
                    </div>
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>Last active: {member.lastActive}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
      </div>

      {/* Team Performance Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-yellow-600" />
            Team Performance
          </CardTitle>
          <CardDescription>Recent achievements and milestones</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-3 bg-green-50 rounded-lg">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div className="flex-1">
                <p className="font-medium text-green-900">Weekly Goal Achieved!</p>
                <p className="text-sm text-green-700">Team completed 147 notes this week</p>
              </div>
              <Badge className="bg-green-100 text-green-800">+23%</Badge>
            </div>

            <div className="flex items-center gap-4 p-3 bg-blue-50 rounded-lg">
              <Star className="h-8 w-8 text-blue-600" />
              <div className="flex-1">
                <p className="font-medium text-blue-900">High Accuracy Maintained</p>
                <p className="text-sm text-blue-700">Average accuracy at 99.1% this month</p>
              </div>
              <Badge className="bg-blue-100 text-blue-800">Top 5%</Badge>
            </div>

            <div className="flex items-center gap-4 p-3 bg-purple-50 rounded-lg">
              <TrendingUp className="h-8 w-8 text-purple-600" />
              <div className="flex-1">
                <p className="font-medium text-purple-900">Productivity Increase</p>
                <p className="text-sm text-purple-700">42.5 hours saved this week</p>
              </div>
              <Badge className="bg-purple-100 text-purple-800">+18%</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
