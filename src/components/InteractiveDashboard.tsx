import { useState, useEffect } from 'react';
import { 
  Clock, 
  Target, 
  Shield, 
  TrendingUp, 
  Users, 
  FileText, 
  Zap, 
  Award,
  Calendar,
  BarChart3,
  Activity,
  CheckCircle,
  AlertTriangle,
  Star
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface DashboardMetrics {
  timeSaved: {
    today: number;
    thisWeek: number;
    thisMonth: number;
    total: number;
  };
  accuracy: {
    overall: number;
    thisWeek: number;
    trend: 'up' | 'down' | 'stable';
  };
  productivity: {
    notesGenerated: number;
    averageTimePerNote: number;
    efficiency: number;
  };
  compliance: {
    hipaaScore: number;
    lastAudit: string;
    securityLevel: 'excellent' | 'good' | 'warning';
  };
}

export function InteractiveDashboard() {
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    timeSaved: {
      today: 47,
      thisWeek: 312,
      thisMonth: 1247,
      total: 5432
    },
    accuracy: {
      overall: 98.7,
      thisWeek: 99.2,
      trend: 'up'
    },
    productivity: {
      notesGenerated: 156,
      averageTimePerNote: 2.3,
      efficiency: 94
    },
    compliance: {
      hipaaScore: 100,
      lastAudit: '2024-01-15',
      securityLevel: 'excellent'
    }
  });

  const [activeMetric, setActiveMetric] = useState<'time' | 'accuracy' | 'productivity' | 'compliance'>('time');
  const [isExpanded, setIsExpanded] = useState(false);

  const formatTime = (minutes: number) => {
    if (minutes >= 60) {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      return `${hours}h ${mins}m`;
    }
    return `${minutes}m`;
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-3 w-3 text-green-500" />;
      case 'down': return <TrendingUp className="h-3 w-3 text-red-500 rotate-180" />;
      default: return <Activity className="h-3 w-3 text-blue-500" />;
    }
  };

  const getSecurityBadge = (level: string) => {
    switch (level) {
      case 'excellent':
        return <Badge className="bg-green-100 text-green-800 border-green-200 dark:bg-green-950/20 dark:text-green-400 dark:border-green-800">Excellent</Badge>;
      case 'good':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-800">Good</Badge>;
      case 'warning':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-950/20 dark:text-yellow-400 dark:border-yellow-800">Review Needed</Badge>;
    }
  };

  return (
    <div className="w-full space-y-4">
      {/* Main Metrics Cards */}
      <div className="grid grid-cols-2 gap-3">
        {/* Time Saved Card */}
        <Card 
          className={`p-4 cursor-pointer transition-all duration-300 hover:scale-105 ${
            activeMetric === 'time' 
              ? 'bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 border-emerald-200 dark:border-emerald-800 shadow-lg' 
              : 'bg-white/80 dark:bg-slate-800/80 hover:shadow-md'
          }`}
          onClick={() => setActiveMetric('time')}
        >
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
                <Clock className="h-4 w-4 text-white" />
              </div>
              <Badge variant="outline" className="text-xs">Today</Badge>
            </div>
            <div>
              <div className="text-2xl font-bold text-emerald-700 dark:text-emerald-400">
                {formatTime(metrics.timeSaved.today)}
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                Time Saved
              </div>
            </div>
            <div className="flex items-center gap-1 text-xs">
              <TrendingUp className="h-3 w-3 text-green-500" />
              <span className="text-green-600 dark:text-green-400">+12% vs yesterday</span>
            </div>
          </div>
        </Card>

        {/* Accuracy Card */}
        <Card 
          className={`p-4 cursor-pointer transition-all duration-300 hover:scale-105 ${
            activeMetric === 'accuracy' 
              ? 'bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200 dark:border-blue-800 shadow-lg' 
              : 'bg-white/80 dark:bg-slate-800/80 hover:shadow-md'
          }`}
          onClick={() => setActiveMetric('accuracy')}
        >
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <Target className="h-4 w-4 text-white" />
              </div>
              <Badge variant="outline" className="text-xs">This Week</Badge>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-700 dark:text-blue-400">
                {metrics.accuracy.thisWeek}%
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                Accuracy Rate
              </div>
            </div>
            <div className="flex items-center gap-1 text-xs">
              {getTrendIcon(metrics.accuracy.trend)}
              <span className="text-green-600 dark:text-green-400">+0.5% improvement</span>
            </div>
          </div>
        </Card>

        {/* Productivity Card */}
        <Card 
          className={`p-4 cursor-pointer transition-all duration-300 hover:scale-105 ${
            activeMetric === 'productivity' 
              ? 'bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-950/20 dark:to-violet-950/20 border-purple-200 dark:border-purple-800 shadow-lg' 
              : 'bg-white/80 dark:bg-slate-800/80 hover:shadow-md'
          }`}
          onClick={() => setActiveMetric('productivity')}
        >
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-violet-600 rounded-lg flex items-center justify-center">
                <Zap className="h-4 w-4 text-white" />
              </div>
              <Badge variant="outline" className="text-xs">This Month</Badge>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-700 dark:text-purple-400">
                {metrics.productivity.notesGenerated}
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                Notes Generated
              </div>
            </div>
            <div className="flex items-center gap-1 text-xs">
              <Award className="h-3 w-3 text-yellow-500" />
              <span className="text-yellow-600 dark:text-yellow-400">94% efficiency</span>
            </div>
          </div>
        </Card>

        {/* Compliance Card */}
        <Card 
          className={`p-4 cursor-pointer transition-all duration-300 hover:scale-105 ${
            activeMetric === 'compliance' 
              ? 'bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-green-200 dark:border-green-800 shadow-lg' 
              : 'bg-white/80 dark:bg-slate-800/80 hover:shadow-md'
          }`}
          onClick={() => setActiveMetric('compliance')}
        >
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                <Shield className="h-4 w-4 text-white" />
              </div>
              {getSecurityBadge(metrics.compliance.securityLevel)}
            </div>
            <div>
              <div className="text-2xl font-bold text-green-700 dark:text-green-400">
                {metrics.compliance.hipaaScore}%
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                HIPAA Score
              </div>
            </div>
            <div className="flex items-center gap-1 text-xs">
              <CheckCircle className="h-3 w-3 text-green-500" />
              <span className="text-green-600 dark:text-green-400">Audit passed</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Detailed View Toggle */}
      <div className="flex justify-center">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-xs font-medium"
        >
          {isExpanded ? 'Show Less' : 'View Details'}
          <BarChart3 className="h-3 w-3 ml-1" />
        </Button>
      </div>

      {/* Expanded Detailed View */}
      {isExpanded && (
        <Card className="p-6 bg-gradient-to-br from-slate-50 to-white dark:from-slate-800 dark:to-slate-900 border-0 shadow-lg">
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                  Performance Analytics
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Detailed insights into your documentation efficiency
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-slate-500" />
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  Last 30 days
                </span>
              </div>
            </div>

            {/* Detailed Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Time Savings Breakdown */}
              <div className="space-y-4">
                <h4 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                  <Clock className="h-4 w-4 text-emerald-600" />
                  Time Savings Breakdown
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600 dark:text-slate-400">Today</span>
                    <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                      {formatTime(metrics.timeSaved.today)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600 dark:text-slate-400">This Week</span>
                    <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                      {formatTime(metrics.timeSaved.thisWeek)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600 dark:text-slate-400">This Month</span>
                    <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                      {formatTime(metrics.timeSaved.thisMonth)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-t pt-2">
                    <span className="text-sm font-semibold text-slate-900 dark:text-white">Total Saved</span>
                    <span className="font-bold text-lg text-emerald-700 dark:text-emerald-400">
                      {formatTime(metrics.timeSaved.total)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Productivity Metrics */}
              <div className="space-y-4">
                <h4 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                  <Zap className="h-4 w-4 text-purple-600" />
                  Productivity Metrics
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600 dark:text-slate-400">Notes Generated</span>
                    <span className="font-semibold text-purple-700 dark:text-purple-400">
                      {metrics.productivity.notesGenerated}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600 dark:text-slate-400">Avg. Time per Note</span>
                    <span className="font-semibold text-purple-700 dark:text-purple-400">
                      {metrics.productivity.averageTimePerNote}m
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600 dark:text-slate-400">Efficiency Rating</span>
                    <div className="flex items-center gap-2">
                      <Progress value={metrics.productivity.efficiency} className="w-16 h-2" />
                      <span className="font-semibold text-purple-700 dark:text-purple-400">
                        {metrics.productivity.efficiency}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Achievement Badges */}
            <div className="space-y-4">
              <h4 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                <Award className="h-4 w-4 text-yellow-600" />
                Recent Achievements
              </h4>
              <div className="flex flex-wrap gap-2">
                <Badge className="bg-green-100 text-green-800 border-green-200 dark:bg-green-950/20 dark:text-green-400 dark:border-green-800">
                  <Star className="h-3 w-3 mr-1" />
                  100+ Notes This Month
                </Badge>
                <Badge className="bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-800">
                  <Target className="h-3 w-3 mr-1" />
                  99%+ Accuracy Week
                </Badge>
                <Badge className="bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-950/20 dark:text-purple-400 dark:border-purple-800">
                  <Zap className="h-3 w-3 mr-1" />
                  Efficiency Master
                </Badge>
                <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-800">
                  <Shield className="h-3 w-3 mr-1" />
                  HIPAA Compliant
                </Badge>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
