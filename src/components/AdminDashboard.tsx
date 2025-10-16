import { useState, useEffect } from 'react';
import { Shield, Users, Settings, Activity, AlertTriangle, CheckCircle, Download, RefreshCw, Lock, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';
import { adminService, type OrganizationSettings, type User, type AuditLogEntry, type ComplianceReport } from '@/lib/admin';
import { toast } from 'sonner';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AdminDashboard({ isOpen, onClose }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [organizationSettings, setOrganizationSettings] = useState<OrganizationSettings | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [complianceReport, setComplianceReport] = useState<ComplianceReport | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadAdminData();
    }
  }, [isOpen]);

  const loadAdminData = () => {
    const settings = adminService.getOrganizationSettings();
    const userList = adminService.getUsers();
    const logs = adminService.getAuditLogs(50);
    
    setOrganizationSettings(settings);
    setUsers(userList);
    setAuditLogs(logs);
  };

  const handleSettingsUpdate = (updates: Partial<OrganizationSettings>) => {
    if (!organizationSettings) return;
    
    const updated = { ...organizationSettings, ...updates };
    setOrganizationSettings(updated);
    adminService.updateOrganizationSettings(updates);
    toast.success('Settings updated successfully');
  };

  const handleUserUpdate = (userId: string, updates: Partial<User>) => {
    adminService.updateUser(userId, updates);
    setUsers(prev => prev.map(user => 
      user.id === userId ? { ...user, ...updates } : user
    ));
    toast.success('User updated successfully');
  };

  const handleSuspendUser = (userId: string) => {
    adminService.suspendUser(userId, 'Administrative action');
    setUsers(prev => prev.map(user => 
      user.id === userId ? { ...user, status: 'suspended' } : user
    ));
    toast.success('User suspended');
  };

  const handleGenerateComplianceReport = () => {
    const endDate = new Date().toISOString();
    const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(); // 30 days ago
    
    const report = adminService.generateComplianceReport({ start: startDate, end: endDate });
    setComplianceReport(report);
    toast.success('Compliance report generated');
  };

  const handleExportAuditLogs = () => {
    const data = adminService.exportAuditLogs('json');
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `audit_logs_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast.success('Audit logs exported');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-success/10 text-success border-success/20';
      case 'inactive': return 'bg-muted';
      case 'suspended': return 'bg-destructive/10 text-destructive border-destructive/20';
      default: return 'bg-muted';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-destructive/10 text-destructive border-destructive/20';
      case 'nurse': return 'bg-primary/10 text-primary border-primary/20';
      case 'instructor': return 'bg-secondary/10 text-secondary border-secondary/20';
      case 'student': return 'bg-accent/10 text-accent border-accent/20';
      case 'auditor': return 'bg-warning/10 text-warning border-warning/20';
      default: return 'bg-muted';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'bg-success/10 text-success border-success/20';
      case 'medium': return 'bg-warning/10 text-warning border-warning/20';
      case 'high': return 'bg-destructive/10 text-destructive border-destructive/20';
      case 'critical': return 'bg-destructive text-destructive-foreground border-destructive';
      default: return 'bg-muted';
    }
  };

  if (!isOpen || !organizationSettings) return null;

  const securityData = adminService.getSecurityDashboard();

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-7xl max-h-[90vh] overflow-y-auto glass border-border/50 shadow-2xl">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-destructive rounded-xl flex items-center justify-center">
                <Shield className="h-6 w-6 text-destructive-foreground" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Admin Dashboard</h2>
                <p className="text-sm text-muted-foreground">Manage organization, users, and HIPAA compliance</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={loadAdminData}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button variant="ghost" size="sm" onClick={onClose}>
                ×
              </Button>
            </div>
          </div>

          {/* Security Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="p-4 bg-gradient-primary/10 border-primary/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <Users className="h-5 w-5 text-primary-foreground" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary">{securityData.totalUsers}</div>
                  <div className="text-sm text-muted-foreground">Total Users</div>
                </div>
              </div>
            </Card>

            <Card className="p-4 bg-gradient-secondary/10 border-secondary/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-secondary rounded-lg flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-secondary-foreground" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-secondary">{securityData.hipaaCompliantUsers}</div>
                  <div className="text-sm text-muted-foreground">HIPAA Trained</div>
                </div>
              </div>
            </Card>

            <Card className="p-4 bg-gradient-accent/10 border-accent/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-accent rounded-lg flex items-center justify-center">
                  <Lock className="h-5 w-5 text-accent-foreground" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-accent">{securityData.twoFactorUsers}</div>
                  <div className="text-sm text-muted-foreground">2FA Enabled</div>
                </div>
              </div>
            </Card>

            <Card className="p-4 bg-destructive/10 border-destructive/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-destructive rounded-lg flex items-center justify-center">
                  <AlertTriangle className="h-5 w-5 text-destructive-foreground" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-destructive">{securityData.recentIncidents}</div>
                  <div className="text-sm text-muted-foreground">Security Incidents</div>
                </div>
              </div>
            </Card>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="audit">Audit Logs</TabsTrigger>
              <TabsTrigger value="compliance">Compliance</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Organization Info */}
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Organization Information</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Name</span>
                      <span className="font-medium">{organizationSettings.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Type</span>
                      <Badge variant="outline" className="capitalize">{organizationSettings.type}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">HIPAA Compliant</span>
                      <Badge className={organizationSettings.hipaaCompliant ? 'bg-success/10 text-success border-success/20' : 'bg-destructive/10 text-destructive border-destructive/20'}>
                        {organizationSettings.hipaaCompliant ? 'Yes' : 'No'}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Data Retention</span>
                      <span className="font-medium">{organizationSettings.dataRetentionDays} days</span>
                    </div>
                  </div>
                </Card>

                {/* Security Status */}
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Security Status</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Encryption</span>
                      <Badge className={organizationSettings.encryptionEnabled ? 'bg-success/10 text-success border-success/20' : 'bg-destructive/10 text-destructive border-destructive/20'}>
                        {organizationSettings.encryptionEnabled ? 'Enabled' : 'Disabled'}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Audit Logging</span>
                      <Badge className={organizationSettings.auditLogging ? 'bg-success/10 text-success border-success/20' : 'bg-destructive/10 text-destructive border-destructive/20'}>
                        {organizationSettings.auditLogging ? 'Enabled' : 'Disabled'}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Two-Factor Auth</span>
                      <Badge className={organizationSettings.twoFactorAuth ? 'bg-success/10 text-success border-success/20' : 'bg-destructive/10 text-destructive border-destructive/20'}>
                        {organizationSettings.twoFactorAuth ? 'Enabled' : 'Disabled'}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Session Timeout</span>
                      <span className="font-medium">{organizationSettings.sessionTimeout} min</span>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Recent Activity */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Recent Audit Activity</h3>
                <div className="space-y-3">
                  {auditLogs.slice(0, 5).map((log, index) => (
                    <div key={log.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Activity className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <div className="text-sm font-medium">{log.userName}</div>
                          <div className="text-xs text-muted-foreground">{log.action} • {log.resource}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getRiskColor(log.riskLevel)}>
                          {log.riskLevel}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {new Date(log.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">HIPAA Compliance Settings</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium">HIPAA Compliance Mode</Label>
                      <p className="text-xs text-muted-foreground">Enable full HIPAA compliance features</p>
                    </div>
                    <Switch
                      checked={organizationSettings.hipaaCompliant}
                      onCheckedChange={(checked) => handleSettingsUpdate({ hipaaCompliant: checked })}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium">Encryption</Label>
                      <p className="text-xs text-muted-foreground">Encrypt all stored data</p>
                    </div>
                    <Switch
                      checked={organizationSettings.encryptionEnabled}
                      onCheckedChange={(checked) => handleSettingsUpdate({ encryptionEnabled: checked })}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium">Audit Logging</Label>
                      <p className="text-xs text-muted-foreground">Log all user actions and access</p>
                    </div>
                    <Switch
                      checked={organizationSettings.auditLogging}
                      onCheckedChange={(checked) => handleSettingsUpdate({ auditLogging: checked })}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium">Two-Factor Authentication</Label>
                      <p className="text-xs text-muted-foreground">Require 2FA for all users</p>
                    </div>
                    <Switch
                      checked={organizationSettings.twoFactorAuth}
                      onCheckedChange={(checked) => handleSettingsUpdate({ twoFactorAuth: checked })}
                    />
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Password Policy</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">Minimum Length</Label>
                    <span className="font-medium">{organizationSettings.passwordPolicy.minLength} characters</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">Require Uppercase</Label>
                    <Switch
                      checked={organizationSettings.passwordPolicy.requireUppercase}
                      onCheckedChange={(checked) => handleSettingsUpdate({
                        passwordPolicy: { ...organizationSettings.passwordPolicy, requireUppercase: checked }
                      })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">Require Numbers</Label>
                    <Switch
                      checked={organizationSettings.passwordPolicy.requireNumbers}
                      onCheckedChange={(checked) => handleSettingsUpdate({
                        passwordPolicy: { ...organizationSettings.passwordPolicy, requireNumbers: checked }
                      })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">Password Expiry</Label>
                    <span className="font-medium">{organizationSettings.passwordPolicy.maxAge} days</span>
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="users" className="space-y-6">
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">User Management</h3>
                  <Button variant="outline" size="sm">
                    <Users className="h-4 w-4 mr-2" />
                    Add User
                  </Button>
                </div>
                
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>HIPAA</TableHead>
                      <TableHead>2FA</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{user.name}</div>
                            <div className="text-sm text-muted-foreground">{user.email}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getRoleColor(user.role)}>
                            {user.role}
                          </Badge>
                        </TableCell>
                        <TableCell>{user.department}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(user.status)}>
                            {user.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={user.hipaaTrainingCompleted ? 'bg-success/10 text-success border-success/20' : 'bg-destructive/10 text-destructive border-destructive/20'}>
                            {user.hipaaTrainingCompleted ? 'Completed' : 'Pending'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={user.twoFactorEnabled ? 'bg-success/10 text-success border-success/20' : 'bg-muted'}>
                            {user.twoFactorEnabled ? 'Enabled' : 'Disabled'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            {user.status === 'active' && (
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleSuspendUser(user.id)}
                              >
                                Suspend
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            </TabsContent>

            <TabsContent value="audit" className="space-y-6">
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Audit Logs</h3>
                  <Button variant="outline" size="sm" onClick={handleExportAuditLogs}>
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
                
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Timestamp</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead>Resource</TableHead>
                      <TableHead>Success</TableHead>
                      <TableHead>Risk Level</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {auditLogs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell className="text-sm">
                          {new Date(log.timestamp).toLocaleString()}
                        </TableCell>
                        <TableCell>{log.userName}</TableCell>
                        <TableCell className="font-mono text-sm">{log.action}</TableCell>
                        <TableCell className="font-mono text-sm">{log.resource}</TableCell>
                        <TableCell>
                          <Badge className={log.success ? 'bg-success/10 text-success border-success/20' : 'bg-destructive/10 text-destructive border-destructive/20'}>
                            {log.success ? 'Success' : 'Failed'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={getRiskColor(log.riskLevel)}>
                            {log.riskLevel}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            </TabsContent>

            <TabsContent value="compliance" className="space-y-6">
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Compliance Report</h3>
                  <Button variant="outline" size="sm" onClick={handleGenerateComplianceReport}>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Generate Report
                  </Button>
                </div>
                
                {complianceReport ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Badge className={complianceReport.status === 'compliant' ? 'bg-success/10 text-success border-success/20' : 'bg-destructive/10 text-destructive border-destructive/20'}>
                        {complianceReport.status.replace('_', ' ').toUpperCase()}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        Generated {new Date(complianceReport.generatedAt).toLocaleString()}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="p-3 bg-muted/30 rounded-lg">
                        <div className="text-lg font-bold">{complianceReport.summary.totalUsers}</div>
                        <div className="text-sm text-muted-foreground">Total Users</div>
                      </div>
                      <div className="p-3 bg-muted/30 rounded-lg">
                        <div className="text-lg font-bold">{complianceReport.summary.hipaaCompliantUsers}</div>
                        <div className="text-sm text-muted-foreground">HIPAA Trained</div>
                      </div>
                      <div className="p-3 bg-muted/30 rounded-lg">
                        <div className="text-lg font-bold">{complianceReport.summary.auditLogEntries}</div>
                        <div className="text-sm text-muted-foreground">Audit Entries</div>
                      </div>
                      <div className="p-3 bg-muted/30 rounded-lg">
                        <div className="text-lg font-bold">{complianceReport.summary.securityIncidents}</div>
                        <div className="text-sm text-muted-foreground">Security Incidents</div>
                      </div>
                    </div>
                    
                    {complianceReport.recommendations.length > 0 && (
                      <div>
                        <h4 className="font-medium mb-2">Recommendations</h4>
                        <div className="space-y-2">
                          {complianceReport.recommendations.map((recommendation, index) => (
                            <div key={index} className="p-3 bg-warning/10 rounded-lg border border-warning/20">
                              <div className="flex items-center gap-2">
                                <AlertTriangle className="h-4 w-4 text-warning" />
                                <span className="text-sm">{recommendation}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center p-6 text-muted-foreground">
                    <Shield className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>Generate a compliance report to view current status</p>
                  </div>
                )}
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </Card>
    </div>
  );
}
