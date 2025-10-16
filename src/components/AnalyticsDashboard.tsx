import { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Clock, DollarSign, Target, Download, RefreshCw, Calendar } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { analyticsService, type AnalyticsData, type ProductivityMetrics } from '@/lib/analytics';
import { toast } from 'sonner';

interface AnalyticsDashboardProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AnalyticsDashboard({ isOpen, onClose }: AnalyticsDashboardProps) {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [metrics, setMetrics] = useState<ProductivityMetrics | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (isOpen) {
      loadAnalytics();
    }
  }, [isOpen]);

  const loadAnalytics = () => {
    const data = analyticsService.getAnalytics();
    const productivityMetrics = analyticsService.getProductivityMetrics();
    
    setAnalytics(data);
    setMetrics(productivityMetrics);
  };

  const handleRefresh = () => {
    loadAnalytics();
    toast.success('Analytics refreshed');
  };

  const handleExport = () => {
    const data = analyticsService.exportAnalytics();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `nursescribe_analytics_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast.success('Analytics exported');
  };

  const formatTime = (minutes: number): string => {
    if (minutes < 60) {
      return `${Math.round(minutes)}m`;
    }
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    return `${hours}h ${mins}m`;
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  if (!isOpen || !analytics || !metrics) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-6xl max-h-[90vh] overflow-y-auto glass border-border/50 shadow-2xl">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
                <p className="text-sm text-muted-foreground">Track your productivity and time savings</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleRefresh}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button variant="outline" size="sm" onClick={handleExport}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button variant="ghost" size="sm" onClick={onClose}>
                ×
              </Button>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="p-4 bg-gradient-primary/10 border-primary/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <Target className="h-5 w-5 text-primary-foreground" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary">{analytics.totalNotes}</div>
                  <div className="text-sm text-muted-foreground">Notes Created</div>
                </div>
              </div>
            </Card>

            <Card className="p-4 bg-gradient-secondary/10 border-secondary/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-secondary rounded-lg flex items-center justify-center">
                  <Clock className="h-5 w-5 text-secondary-foreground" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-secondary">{formatTime(analytics.totalTimeSaved)}</div>
                  <div className="text-sm text-muted-foreground">Time Saved</div>
                </div>
              </div>
            </Card>

            <Card className="p-4 bg-gradient-accent/10 border-accent/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-accent rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-accent-foreground" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-accent">{metrics.efficiencyGain.toFixed(1)}%</div>
                  <div className="text-sm text-muted-foreground">Efficiency Gain</div>
                </div>
              </div>
            </Card>

            <Card className="p-4 bg-success/10 border-success/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-secondary rounded-lg flex items-center justify-center">
                  <DollarSign className="h-5 w-5 text-success-foreground" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-success">{formatCurrency(metrics.costSavings)}</div>
                  <div className="text-sm text-muted-foreground">Cost Savings</div>
                </div>
              </div>
            </Card>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="productivity">Productivity</TabsTrigger>
              <TabsTrigger value="usage">Usage</TabsTrigger>
              <TabsTrigger value="trends">Trends</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Template Usage */}
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Template Usage</h3>
                  <div className="space-y-3">
                    {analyticsService.getTemplateStats().map((stat, index) => (
                      <div key={stat.template} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{stat.template}</Badge>
                          <span className="text-sm text-muted-foreground">{stat.count} notes</span>
                        </div>
                        <div className="text-sm font-medium">{stat.percentage.toFixed(1)}%</div>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Export Statistics */}
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Export Activity</h3>
                  <div className="space-y-3">
                    {analyticsService.getExportStats().slice(0, 5).map((stat, index) => (
                      <div key={`${stat.type}-${stat.ehrSystem}`} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">{stat.ehrSystem}</Badge>
                          <span className="text-sm text-muted-foreground">{stat.type}</span>
                        </div>
                        <div className="text-sm font-medium">{stat.count}</div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>

              {/* Recent Activity */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
                <div className="space-y-3">
                  {analytics.sessions.slice(-5).reverse().map((session, index) => (
                    <div key={session.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <div className="text-sm font-medium">
                            {new Date(session.startTime).toLocaleDateString()}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {session.notesCreated} notes • {formatTime(session.timeSaved)} saved
                          </div>
                        </div>
                      </div>
                      <Badge variant="outline">
                        {formatTime(session.duration)}
                      </Badge>
                    </div>
                  ))}
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="productivity" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Productivity Metrics</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Time Saved per Shift</span>
                      <span className="font-semibold">{formatTime(metrics.timeSavedPerShift)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Notes per Hour</span>
                      <span className="font-semibold">{metrics.notesPerHour.toFixed(1)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Efficiency Gain</span>
                      <span className="font-semibold text-success">{metrics.efficiencyGain.toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Cost Savings</span>
                      <span className="font-semibold text-success">{formatCurrency(metrics.costSavings)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">ROI</span>
                      <span className="font-semibold text-primary">{metrics.roi.toFixed(1)}%</span>
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Usage Statistics</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Total Sessions</span>
                      <span className="font-semibold">{analytics.sessions.length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">PHI Redactions</span>
                      <span className="font-semibold">{analytics.redactionsPerformed}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Voice Commands</span>
                      <span className="font-semibold">{analytics.voiceCommandsUsed}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Average Note Time</span>
                      <span className="font-semibold">{formatTime(analytics.averageNoteTime)}</span>
                    </div>
                  </div>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="usage" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Template Distribution</h3>
                  <div className="space-y-3">
                    {analyticsService.getTemplateStats().map((stat, index) => (
                      <div key={stat.template} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>{stat.template}</span>
                          <span>{stat.count} ({stat.percentage.toFixed(1)}%)</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div 
                            className="bg-gradient-primary h-2 rounded-full transition-all"
                            style={{ width: `${stat.percentage}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Export Methods</h3>
                  <div className="space-y-3">
                    {analyticsService.getExportStats().map((stat, index) => (
                      <div key={`${stat.type}-${stat.ehrSystem}`} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{stat.type}</Badge>
                          <span className="text-sm text-muted-foreground">{stat.ehrSystem}</span>
                        </div>
                        <span className="font-semibold">{stat.count}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="trends" className="space-y-6">
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Daily Trends (Last 30 Days)</h3>
                <div className="space-y-3">
                  {analyticsService.getUsageTrends(30).slice(-7).map((day, index) => (
                    <div key={day.date} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <div className="text-sm font-medium">
                            {new Date(day.date).toLocaleDateString()}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {day.notesCreated} notes • {formatTime(day.timeSaved)} saved
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{day.templatesUsed.length} templates</Badge>
                        <Badge variant="secondary">{day.exportsPerformed.length} exports</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </Card>
    </div>
  );
}
