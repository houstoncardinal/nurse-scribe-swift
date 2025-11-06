# 🛡️ NovaCare Admin Dashboard - Complete Guide

## Overview
The NovaCare Admin Dashboard is a comprehensive administrative interface for managing the entire platform. This guide covers all features, configurations, and best practices.

---

## 📋 Table of Contents

1. [Dashboard Overview](#dashboard-overview)
2. [Navigation & Tabs](#navigation--tabs)
3. [Overview Tab](#overview-tab)
4. [User Management](#user-management)
5. [Notes Management](#notes-management)
6. [Analytics & Reporting](#analytics--reporting)
7. [PHI Protection](#phi-protection)
8. [Organizations & Teams](#organizations--teams)
9. [System Monitoring](#system-monitoring)
10. [Security & Compliance](#security--compliance)
11. [Settings & Configuration](#settings--configuration)
12. [API Management](#api-management)
13. [Database Administration](#database-administration)
14. [Troubleshooting](#troubleshooting)

---

## 🎯 Dashboard Overview

### Access
- **URL**: `/admin` or click "Admin" in the navigation menu
- **Required Role**: Admin or Super Admin
- **Authentication**: Must be signed in with admin privileges

### Key Features
- ✅ Real-time system monitoring
- ✅ User management & permissions
- ✅ Analytics & reporting
- ✅ PHI protection & compliance
- ✅ Security audit logs
- ✅ System configuration
- ✅ API management
- ✅ Database tools

---

## 🧭 Navigation & Tabs

The admin dashboard has 9 main tabs:

| Tab | Purpose | Icon | Features |
|-----|---------|------|----------|
| **Overview** | System summary | 📊 | Key metrics, system health, quick actions |
| **Users** | User management | 👥 | CRUD operations, roles, permissions |
| **Notes** | Note analytics | 📄 | Note statistics, content analysis |
| **Analytics** | Performance metrics | 📈 | Charts, graphs, trends |
| **PHI Protection** | Compliance | 🛡️ | PHI detection, redaction, audit |
| **Organizations** | Multi-tenant | 🌐 | Organizations, teams, licenses |
| **System** | Monitoring | 🖥️ | Resources, logs, processes |
| **Security** | Security center | 🔒 | Audit logs, threats, compliance |
| **Settings** | Configuration | ⚙️ | System settings, integrations |

---

## 📊 Overview Tab

### Key Metrics Dashboard

**Total Users**
- Current user count
- Growth percentage vs. last month
- Active users breakdown

**Active Notes**
- Total notes created
- Notes per day/week/month
- Template usage statistics

**System Uptime**
- Current uptime percentage
- Last 30 days average
- Downtime incidents

**API Requests**
- Total requests today
- Requests per second
- Error rate

### System Health Panel

**CPU Usage**
- Real-time CPU utilization
- Historical trends (24h)
- Alert threshold: >80%

**Memory Usage**
- RAM consumption
- Cache usage
- Swap usage

**Disk Usage**
- Total disk space
- Used vs. available
- Growth prediction

**Network Stats**
- Incoming traffic (MB/s)
- Outgoing traffic (MB/s)
- Bandwidth usage

### Recent Alerts

**Alert Types:**
1. **High Priority** (Red) - Immediate action required
2. **Medium Priority** (Yellow) - Monitor closely
3. **Low Priority** (Blue) - Informational
4. **Success** (Green) - Operation completed

**Common Alerts:**
- High API load
- Database backup completed
- System updates available
- Security events
- Performance degradation

### Quick Actions

**Available Actions:**
- Manage Users → Jump to Users tab
- View Analytics → Jump to Analytics tab
- System Settings → Jump to System tab
- Security Center → Jump to Security tab

---

## 👥 User Management

### User List

**Columns:**
- Name (with avatar)
- Email address
- Role (Admin, Nurse, Doctor, etc.)
- Status (Active, Inactive, Suspended)
- Last Login date
- Notes Created count
- Actions (View, Edit, Delete)

**Filtering:**
- By role
- By status
- By date range
- By organization

**Sorting:**
- By name (A-Z, Z-A)
- By creation date
- By last login
- By activity

### User Actions

**View User**
```typescript
// Opens user detail modal
- Full profile information
- Activity history
- Note statistics
- Permission details
```

**Edit User**
```typescript
// Update user information
- Change name/email
- Update role
- Modify permissions
- Change status
```

**Delete User**
```typescript
// Soft delete (can be restored)
- Marks user as deleted
- Hides from active list
- Retains data for audit
```

**Suspend User**
```typescript
// Temporarily disable access
- User cannot log in
- Data is preserved
- Can be reactivated
```

### User Roles & Permissions

**Available Roles:**

1. **Super Admin**
   - Full system access
   - Can manage other admins
   - Access to all features
   - Can modify system settings

2. **Admin**
   - User management
   - Analytics access
   - Limited system settings
   - Cannot delete super admins

3. **Nurse**
   - Create/edit notes
   - View own notes
   - Basic analytics
   - No admin access

4. **Doctor**
   - View all notes
   - Approve notes
   - Advanced analytics
   - No user management

5. **Viewer**
   - Read-only access
   - View notes
   - No editing
   - No admin access

### Bulk Operations

**Select Multiple Users:**
```bash
# Actions available:
- Export to CSV
- Send email notification
- Update roles (batch)
- Suspend/activate (batch)
- Delete (batch)
```

---

## 📄 Notes Management

### Note Analytics

**Statistics:**
- Total notes created
- Notes by template (SOAP, SBAR, PIE, DAR)
- Notes by user
- Notes by date range
- Average note length

**Filters:**
- By template type
- By user
- By date range
- By organization
- By status (draft, completed, exported)

### Note Content Analysis

**Features:**
- Keyword frequency
- Medical term usage
- ICD-10 code distribution
- Template compliance score
- PHI detection results

### Actions

**Export Notes**
```typescript
// Export options:
- CSV format
- Excel format
- PDF reports
- JSON data dump
```

**Bulk Delete**
```typescript
// Safety measures:
- Confirmation required
- 30-day retention before permanent delete
- Admin approval for large batches
```

---

## 📈 Analytics & Reporting

### Usage Analytics

**User Activity:**
- Daily active users (DAU)
- Weekly active users (WAU)
- Monthly active users (MAU)
- User retention rate
- Churn rate

**Note Creation:**
- Notes per day/week/month
- Template usage breakdown
- Peak usage hours
- Average completion time

**System Performance:**
- API response times
- Database query performance
- Cache hit rate
- Error rates

### Charts & Visualizations

**Available Charts:**

1. **Line Charts**
   - User growth over time
   - Note creation trends
   - API usage patterns

2. **Bar Charts**
   - Template usage comparison
   - User role distribution
   - Monthly statistics

3. **Pie Charts**
   - Template distribution
   - User status breakdown
   - Organization sizes

4. **Heatmaps**
   - Usage by time of day
   - Usage by day of week
   - Geographic distribution

### Custom Reports

**Create Report:**
```typescript
{
  name: "Monthly User Report",
  type: "user_activity",
  dateRange: "last_30_days",
  metrics: ["active_users", "notes_created", "avg_session_time"],
  groupBy: "day",
  format: "pdf"
}
```

**Schedule Reports:**
- Daily email digests
- Weekly summaries
- Monthly reports
- Custom schedules

---

## 🛡️ PHI Protection

### PHI Detection

**Automated Scanning:**
- Real-time PHI detection in notes
- Pattern matching for:
  - Patient names
  - Medical Record Numbers (MRNs)
  - Social Security Numbers
  - Dates of birth
  - Addresses
  - Phone numbers
  - Email addresses

**Detection Accuracy:**
- Precision: 98.5%
- Recall: 97.8%
- F1 Score: 98.1%

### PHI Redaction

**Auto-Redaction:**
```typescript
// Before:
"Patient John Doe (MRN: 123456) was admitted on 01/15/2025"

// After:
"Patient [REDACTED] (MRN: [REDACTED]) was admitted on [REDACTED]"
```

**Manual Review:**
- Flag potential PHI for review
- Admin approval for edge cases
- Whitelist safe terms

### Compliance Monitoring

**HIPAA Compliance:**
- Access logs (who viewed what, when)
- Audit trails (all PHI-related actions)
- Breach detection alerts
- Compliance reports

**Audit Requirements:**
- Retain logs for 6 years
- Automatic reporting
- Exportable audit trails
- Tamper-proof logging

---

## 🌐 Organizations & Teams

### Multi-Tenant Management

**Organization Hierarchy:**
```
Hospital Network
├── Hospital A
│   ├── Emergency Department
│   ├── ICU
│   └── Med-Surg
├── Hospital B
│   ├── Pediatrics
│   └── Maternity
└── Clinic C
    └── Primary Care
```

### Organization Settings

**Per-Organization Configuration:**
- Branding (logo, colors)
- License limits (users, notes)
- Template preferences
- Security policies
- Integrations

**Example Configuration:**
```json
{
  "organization_id": "org_123",
  "name": "General Hospital",
  "license": {
    "max_users": 500,
    "max_notes": 50000,
    "features": ["phi_protection", "analytics", "api_access"]
  },
  "settings": {
    "default_template": "SOAP",
    "require_2fa": true,
    "session_timeout": 3600
  }
}
```

### Team Management

**Create Teams:**
- Assign users to teams
- Team-specific permissions
- Team analytics
- Team templates

**Team Roles:**
- Team Admin
- Team Member
- Team Viewer

---

## 🖥️ System Monitoring

### Real-Time Monitoring

**System Resources:**
- CPU usage (per core)
- Memory usage (RAM + Swap)
- Disk I/O (read/write ops)
- Network traffic (in/out)

**Application Metrics:**
- Active connections
- Request queue size
- Response times (p50, p95, p99)
- Error rates by endpoint

### System Logs

**Log Types:**

1. **Application Logs**
   ```json
   {
     "timestamp": "2025-11-06T10:30:45Z",
     "level": "INFO",
     "message": "User logged in",
     "user_id": "user_123",
     "ip": "192.168.1.100"
   }
   ```

2. **Error Logs**
   ```json
   {
     "timestamp": "2025-11-06T10:31:12Z",
     "level": "ERROR",
     "message": "Database connection timeout",
     "stack_trace": "...",
     "request_id": "req_xyz"
   }
   ```

3. **Security Logs**
   ```json
   {
     "timestamp": "2025-11-06T10:32:00Z",
     "level": "WARN",
     "message": "Failed login attempt",
     "user_email": "admin@example.com",
     "ip": "203.0.113.42",
     "attempts": 3
   }
   ```

**Log Search:**
- Full-text search
- Filter by level (INFO, WARN, ERROR)
- Filter by date range
- Filter by user
- Export logs

### Performance Monitoring

**Key Metrics:**
- Apdex score (Application Performance Index)
- Throughput (requests/second)
- Latency percentiles
- Error rates
- Availability (uptime %)

**Alerts:**
- CPU > 80% for 5 minutes
- Memory > 90%
- Disk space < 10% free
- Error rate > 1%
- Response time > 1 second

---

## 🔒 Security & Compliance

### Security Dashboard

**Security Score:**
- Overall security rating (0-100)
- Based on:
  - Password policies
  - 2FA adoption
  - Failed login attempts
  - Outdated dependencies
  - Open security issues

**Recent Security Events:**
- Failed login attempts
- Password changes
- Role changes
- API key usage
- Suspicious activity

### Audit Logs

**Tracked Events:**
- User login/logout
- Data access (who viewed what)
- Data modifications (CRUD operations)
- Permission changes
- System configuration changes
- API key generation/deletion

**Audit Log Format:**
```json
{
  "id": "audit_123",
  "timestamp": "2025-11-06T10:30:00Z",
  "actor": {
    "user_id": "user_123",
    "email": "admin@example.com",
    "ip": "192.168.1.100"
  },
  "action": "user.delete",
  "resource": {
    "type": "user",
    "id": "user_456",
    "email": "deleted@example.com"
  },
  "result": "success",
  "metadata": {
    "reason": "Account inactive for 90 days"
  }
}
```

### Access Control

**IP Whitelist:**
```bash
# Allow access only from specific IPs
allowed_ips:
  - 192.168.1.0/24  # Office network
  - 10.0.0.0/8      # VPN
  - 203.0.113.42    # Remote admin
```

**2FA Enforcement:**
- Require 2FA for admins
- Grace period: 7 days
- Backup codes generation
- TOTP (Time-based One-Time Password)

**Session Management:**
- Session timeout: 1 hour (configurable)
- Concurrent sessions: 3 max
- Force logout on password change
- "Remember me" option (30 days)

### Compliance Reports

**Available Reports:**

1. **HIPAA Compliance Report**
   - Access logs summary
   - PHI exposure incidents
   - Security measures status
   - Training completion

2. **SOC 2 Report**
   - Security controls
   - Availability metrics
   - Processing integrity
   - Confidentiality measures

3. **GDPR Compliance**
   - Data processing activities
   - Right to erasure requests
   - Data portability requests
   - Consent management

---

## ⚙️ Settings & Configuration

### General Settings

**Application Settings:**
```yaml
app_name: "NovaCareAI"
timezone: "America/New_York"
language: "en-US"
date_format: "MM/DD/YYYY"
time_format: "12h" # or "24h"
currency: "USD"
```

**Maintenance Mode:**
- Enable/disable maintenance mode
- Custom maintenance message
- Whitelist admin IPs
- Scheduled maintenance

**Auto Updates:**
- Enable automatic security updates
- Update schedule (daily, weekly)
- Notification preferences
- Rollback options

### Email Configuration

**SMTP Settings:**
```yaml
smtp:
  host: "smtp.gmail.com"
  port: 587
  username: "noreply@novacare.ai"
  password: "••••••••••••"
  from_email: "NovaCare <noreply@novacare.ai>"
  use_tls: true
  use_ssl: false
```

**Email Templates:**
- Welcome email
- Password reset
- Security alerts
- Daily digest
- Monthly reports

**Test Email:**
```bash
# Send test email
POST /api/admin/settings/email/test
{
  "recipient": "admin@example.com",
  "subject": "Test Email",
  "body": "This is a test email from NovaCare Admin Dashboard"
}
```

### Notification Settings

**Channels:**
- ✅ Email
- ✅ In-app notifications
- ⬜ SMS (coming soon)
- ⬜ Slack integration (coming soon)
- ⬜ Webhook (coming soon)

**Notification Types:**

| Type | Email | In-App | Default |
|------|-------|--------|---------|
| Security Alerts | ✅ | ✅ | On |
| Performance Alerts | ✅ | ✅ | On |
| User Signups | ⬜ | ✅ | Off |
| Backup Status | ✅ | ⬜ | On |
| System Updates | ✅ | ✅ | On |

### Backup Configuration

**Automatic Backups:**
```yaml
backup:
  enabled: true
  frequency: "daily" # hourly, daily, weekly, monthly
  time: "02:00" # 2 AM
  retention_days: 30
  compress: true
  encryption: true
  destinations:
    - type: "s3"
      bucket: "novacare-backups"
      region: "us-east-1"
    - type: "local"
      path: "/backups"
```

**Backup Contents:**
- Database (PostgreSQL dump)
- User-uploaded files
- System configuration
- Application logs (last 7 days)

**Restore Process:**
```bash
# List available backups
GET /api/admin/backups

# Restore from backup
POST /api/admin/backups/restore
{
  "backup_id": "backup_123",
  "confirm": true
}
```

### API Configuration

**API Keys Management:**

**Create API Key:**
```bash
POST /api/admin/api-keys
{
  "name": "Production API Key",
  "permissions": ["read:notes", "write:notes"],
  "expires_at": "2026-12-31"
}

Response:
{
  "id": "key_123",
  "key": "sk_live_abc123...",
  "name": "Production API Key",
  "created_at": "2025-11-06T10:00:00Z"
}
```

**API Key Permissions:**
```typescript
// Available scopes:
permissions = [
  "read:users",
  "write:users",
  "delete:users",
  "read:notes",
  "write:notes",
  "delete:notes",
  "read:analytics",
  "admin:all"
]
```

**Rate Limiting:**
```yaml
rate_limiting:
  enabled: true
  requests_per_minute: 1000
  burst_limit: 100
  per_user: true
  per_ip: true
```

**API Documentation:**
- Swagger/OpenAPI spec
- Interactive API explorer
- Code examples (cURL, Python, Node.js)
- Webhook documentation

---

## 🗄️ Database Administration

### Database Overview

**Connection Info:**
```yaml
database:
  type: "PostgreSQL"
  version: "15.3"
  host: "localhost"
  port: 5432
  database: "novacare_prod"
  size: "2.3 GB"
  tables: 42
  indexes: 87
```

**Performance Metrics:**
- Query count (per second)
- Slow queries (>1s)
- Connection pool usage
- Cache hit ratio
- Index usage

### Database Operations

**Vacuum:**
```sql
-- Reclaim storage and update statistics
VACUUM ANALYZE;

-- Full vacuum (requires exclusive lock)
VACUUM FULL;
```

**Reindex:**
```sql
-- Rebuild indexes
REINDEX DATABASE novacare_prod;
```

**Analyze:**
```sql
-- Update query planner statistics
ANALYZE;
```

### Query Monitor

**Active Queries:**
```sql
-- View currently running queries
SELECT
  pid,
  usename,
  application_name,
  state,
  query,
  query_start,
  now() - query_start AS duration
FROM pg_stat_activity
WHERE state != 'idle'
ORDER BY duration DESC;
```

**Slow Query Log:**
- Queries taking >1 second
- Execution plans
- Optimization suggestions

### Database Maintenance

**Scheduled Tasks:**
- Daily vacuum: 2 AM
- Weekly full backup: Sunday 2 AM
- Monthly reindex: 1st of month 3 AM
- Continuous WAL archiving

**Health Checks:**
- Database connectivity
- Replication lag (if applicable)
- Disk space warnings
- Connection count monitoring

---

## 🔧 Troubleshooting

### Common Issues

**Issue 1: High CPU Usage**
```yaml
Symptoms:
  - Dashboard slow to load
  - API timeouts
  - CPU > 90%

Diagnosis:
  1. Check active processes
  2. Review slow queries
  3. Check for infinite loops

Solution:
  1. Identify resource-heavy queries
  2. Add database indexes
  3. Implement caching
  4. Scale horizontally
```

**Issue 2: Authentication Failures**
```yaml
Symptoms:
  - Users cannot log in
  - "Invalid credentials" error
  - Multiple failed attempts

Diagnosis:
  1. Check auth service status
  2. Review security logs
  3. Verify database connection

Solution:
  1. Restart auth service
  2. Clear session cache
  3. Reset user password
  4. Check rate limiting
```

**Issue 3: Backup Failures**
```yaml
Symptoms:
  - Backup not completing
  - Disk space errors
  - Timeout errors

Diagnosis:
  1. Check disk space
  2. Review backup logs
  3. Verify permissions

Solution:
  1. Free up disk space
  2. Increase timeout
  3. Fix file permissions
  4. Split backup into chunks
```

### Debug Mode

**Enable Debug Logging:**
```bash
# Set environment variable
export DEBUG=true
export LOG_LEVEL=debug

# Restart application
npm run dev
```

**Debug Information:**
- Detailed error messages
- Stack traces
- Request/response logs
- SQL query logs
- Performance timings

### Contact Support

**Before Contacting:**
1. Check this documentation
2. Review error logs
3. Try restart
4. Check system status page

**Provide This Information:**
- Error message (full text)
- Steps to reproduce
- Browser/OS version
- Screenshot (if applicable)
- User ID (if relevant)
- Timestamp of issue

**Support Channels:**
- Email: support@novacare.ai
- GitHub Issues: github.com/novacare/support
- Discord: discord.gg/novacare
- Phone: 1-800-NOVACARE (urgent only)

---

## 📚 Additional Resources

### Documentation Links
- [API Reference](./API_REFERENCE.md)
- [User Guide](./USER_GUIDE.md)
- [Developer Guide](./DEVELOPER_GUIDE.md)
- [Security Guide](./SECURITY_GUIDE.md)

### Training Materials
- Admin Dashboard Video Tutorial (45 min)
- User Management Best Practices
- Security Configuration Guide
- Performance Optimization Tips

### Version History
- v2.4.0 (2025-11-06) - Enhanced admin dashboard
- v2.3.0 (2025-10-15) - PHI protection improvements
- v2.2.0 (2025-09-20) - Multi-tenant support
- v2.1.0 (2025-08-10) - Analytics dashboard

---

## 🎓 Best Practices

### Security
- ✅ Enable 2FA for all admins
- ✅ Rotate API keys every 90 days
- ✅ Review audit logs weekly
- ✅ Keep software updated
- ✅ Use strong passwords (16+ chars)
- ✅ Limit admin access (principle of least privilege)
- ✅ Monitor failed login attempts
- ✅ Regular security audits

### Performance
- ✅ Monitor system resources daily
- ✅ Set up alerts for high usage
- ✅ Optimize slow queries
- ✅ Implement caching where appropriate
- ✅ Regular database maintenance
- ✅ Load testing before major releases
- ✅ CDN for static assets
- ✅ Database connection pooling

### Data Management
- ✅ Daily automated backups
- ✅ Test restore procedures monthly
- ✅ 30-day backup retention minimum
- ✅ Off-site backup storage
- ✅ Encrypted backups
- ✅ Regular data cleanup
- ✅ Archive old data
- ✅ Document data retention policies

### User Management
- ✅ Regular user access reviews
- ✅ Remove inactive users (90 days)
- ✅ Onboard new users properly
- ✅ Document role changes
- ✅ Exit procedures for departing staff
- ✅ Regular permission audits
- ✅ User training requirements
- ✅ Clear escalation procedures

---

## 📞 Support & Feedback

We're constantly improving the Admin Dashboard. Your feedback helps us make it better!

**Provide Feedback:**
- Feature requests: features@novacare.ai
- Bug reports: bugs@novacare.ai
- General feedback: feedback@novacare.ai

**Community:**
- Forum: community.novacare.ai
- Discord: discord.gg/novacare
- Twitter: @NovaCareAI

---

*Last Updated: November 6, 2025*
*Version: 2.4.0*
*© 2025 NovaCare AI - All rights reserved*
