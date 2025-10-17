import { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Clock,
  FileText,
  Target,
  Users,
  Calendar,
  Award,
  Zap,
  Activity,
  PieChart,
  ArrowUp,
  ArrowDown,
  Minus
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';

interface MetricCard {
  title: string;
  value: string;
  change: number;
  trend: 'up' | 'down' | 'neutral';
  icon: any;
  color: string;
}

export function AnalyticsScreen() {
  const [timeRange, setTimeRange] = useState('7days');

  // Mock analytics data
  const metrics: MetricCard[] = [
    {
      title: 'Total Notes',
      value: '156',
      change: 12.5,
      trend: 'up',
      icon: FileText,
      color: 'blue'
    },
    {
      title: 'Time Saved',
      value: '42.3h',
      change: 18.2,
      trend: 'up',
      icon: Clock,
      color: 'emerald'
    },
    {
      title: 'Accuracy Rate',
      value: '98.7%',
      change: 2.1,
      trend: 'up',
      icon: Target,
      color: 'purple'
    },
    {
      title: 'Avg Note Time',
      value: '4.2min',
      change: -15.3,
      trend: 'down',
      icon: Zap,
      color: 'orange'
    }
  ];

  const templateDistribution = [
    { template: 'SOAP', count: 68, percentage: 43.6, color: 'bg-purple-500' },
    { template: 'SBAR', count: 45, percentage: 28.8, color: 'bg-teal-500' },
    { template: 'PIE', count: 28, percentage: 17.9, color: 'bg-orange-500' },
    { template: 'DAR', count: 15, percentage: 9.6, color: 'bg-pink-500' }
  ];

  const weeklyActivity = [
    { day: 'Mon', notes: 24, time: 6.2 },
    { day: 'Tue', notes: 28, time: 7.1 },
    { day: 'Wed', notes: 22, time: 5.8 },
    { day: 'Thu', notes: 31, time: 8.2 },
    { day: 'Fri', notes: 26, time: 6.8 },
    { day: 'Sat', notes: 15, time: 4.1 },
    { day: 'Sun', notes: 10, time: 2.8 }
  ];

  const achievements = [
    { title: 'Speed Demon', description: 'Created 10 notes in under 5 minutes each', icon: Zap, earned: true },
    { title: 'Consistency Master', description: 'Maintained 95%+ accuracy for 30 days', icon: Target, earned: true },
    { title: 'Power User', description: 'Created 100+ notes', icon: Award, earned: true },
    { title: 'Early Bird', description: 'Create 5 notes before 8 AM', icon: Activity, earned: false }
  ];

  const getColorClass = (color: string) => {
    const colors: Record<string, string> = {
      blue: 'from-blue-500 to-blue-600',
      emerald: 'from-emerald-500 to-emerald-600',
      purple: 'from-purple-500 to-purple-600',
      orange: 'from-orange-500 to-orange-600'
    };
    return colors[color] || colors.blue;
  };

  const getTrendIcon = (trend: 'up' | 'down' | 'neutral') => {
    if (trend === 'up') return <ArrowUp className="h-3 w-3" />;
    if (trend === 'down') return <ArrowDown className="h-3 w-3" />;
    return <Minus className="h-3 w-3" />;
  };

  const getTrendColor = (trend: 'up' | 'down' | 'neutral', isPositiveGood: boolean = true) => {
    if (trend === 'neutral') return 'text-slate-600';
    const isGood = (trend === 'up' && isPositiveGood) || (trend === 'down' && !isPositiveGood);
    return isGood ? 'text-green-600' : 'text-red-600';
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-slate-50 via-white to-blue-50/30 overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 px-4 lg:px-6 py-3 lg:py-4 bg-white/90 backdrop-blur-sm border-b border-slate-200">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
              Analytics Dashboard
            </h1>
            <p className="text-xs lg:text-sm text-slate-600">
              Track your performance and productivity metrics
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="h-9 w-32 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7days">Last 7 Days</SelectItem>
                <SelectItem value="30days">Last 30 Days</SelectItem>
                <SelectItem value="90days">Last 90 Days</SelectItem>
                <SelectItem value="year">This Year</SelectItem>
              </SelectContent>
            </Select>
            
            <Button size="sm" variant="outline" className="h-9 text-sm">
              <FileText className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 lg:px-6 py-3 lg:py-4 space-y-4">
        {/* Key Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
          {metrics.map((metric, index) => {
            const Icon = metric.icon;
            const isPositiveGood = metric.title !== 'Avg Note Time';
            
            return (
              <Card key={index} className="p-3 lg:p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className={`p-2 rounded-lg bg-gradient-to-br ${getColorClass(metric.color)}`}>
                    <Icon className="h-4 w-4 lg:h-5 lg:w-5 text-white" />
                  </div>
                  <div className={`flex items-center gap-1 text-xs font-medium ${getTrendColor(metric.trend, isPositiveGood)}`}>
                    {getTrendIcon(metric.trend)}
                    <span>{Math.abs(metric.change)}%</span>
                  </div>
                </div>
                <div>
                  <p className="text-xs lg:text-sm text-slate-600 mb-1">{metric.title}</p>
                  <p className="text-xl lg:text-2xl font-bold text-slate-900">{metric.value}</p>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Weekly Activity */}
          <Card className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm lg:text-base font-semibold text-slate-900">Weekly Activity</h3>
                <p className="text-xs text-slate-600">Notes created per day</p>
              </div>
              <BarChart3 className="h-5 w-5 text-slate-400" />
            </div>
            
            <div className="space-y-3">
              {weeklyActivity.map((day, index) => {
                const maxNotes = Math.max(...weeklyActivity.map(d => d.notes));
                const percentage = (day.notes / maxNotes) * 100;
                
                return (
                  <div key={index}>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-medium text-slate-700">{day.day}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-slate-600">{day.notes} notes</span>
                        <span className="text-slate-500">{day.time}h</span>
                      </div>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-teal-500 to-blue-600 rounded-full transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Template Distribution */}
          <Card className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm lg:text-base font-semibold text-slate-900">Template Usage</h3>
                <p className="text-xs text-slate-600">Distribution by type</p>
              </div>
              <PieChart className="h-5 w-5 text-slate-400" />
            </div>
            
            <div className="space-y-3">
              {templateDistribution.map((item, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded ${item.color}`} />
                      <span className="font-medium text-slate-700">{item.template}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-600">{item.count} notes</span>
                      <span className="font-semibold text-slate-900">{item.percentage}%</span>
                    </div>
                  </div>
                  <Progress value={item.percentage} className="h-1.5" />
                </div>
              ))}
            </div>
            
            <div className="mt-4 pt-4 border-t border-slate-200">
              <div className="grid grid-cols-2 gap-3 text-center">
                <div>
                  <p className="text-xl font-bold text-slate-900">156</p>
                  <p className="text-xs text-slate-600">Total Notes</p>
                </div>
                <div>
                  <p className="text-xl font-bold text-slate-900">4.2</p>
                  <p className="text-xs text-slate-600">Avg per Day</p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Achievements */}
        <Card className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm lg:text-base font-semibold text-slate-900">Achievements</h3>
              <p className="text-xs text-slate-600">Your milestones and accomplishments</p>
            </div>
            <Badge className="bg-gradient-to-r from-yellow-500 to-orange-600 text-white">
              3 / 4 Earned
            </Badge>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {achievements.map((achievement, index) => {
              const Icon = achievement.icon;
              return (
                <div
                  key={index}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    achievement.earned
                      ? 'bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200'
                      : 'bg-slate-50 border-slate-200 opacity-60'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${
                      achievement.earned
                        ? 'bg-gradient-to-br from-yellow-500 to-orange-600'
                        : 'bg-slate-300'
                    }`}>
                      <Icon className="h-4 w-4 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-slate-900 mb-1">
                        {achievement.title}
                      </h4>
                      <p className="text-xs text-slate-600">
                        {achievement.description}
                      </p>
                    </div>
                    {achievement.earned && (
                      <Award className="h-5 w-5 text-yellow-500 flex-shrink-0" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Performance Insights */}
        <Card className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm lg:text-base font-semibold text-slate-900">Performance Insights</h3>
              <p className="text-xs text-slate-600">AI-powered recommendations</p>
            </div>
            <Activity className="h-5 w-5 text-slate-400" />
          </div>
          
          <div className="space-y-3">
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-start gap-2">
                <TrendingUp className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-green-900 mb-1">Excellent Progress!</p>
                  <p className="text-xs text-green-700">
                    Your documentation speed has improved by 15% this week. Keep up the great work!
                  </p>
                </div>
              </div>
            </div>
            
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start gap-2">
                <Target className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-blue-900 mb-1">Accuracy Insight</p>
                  <p className="text-xs text-blue-700">
                    SOAP notes have the highest accuracy rate at 99.2%. Consider using this template more often.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
              <div className="flex items-start gap-2">
                <Clock className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-purple-900 mb-1">Peak Performance Time</p>
                  <p className="text-xs text-purple-700">
                    You're most productive on Thursdays. Try scheduling important notes then.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
