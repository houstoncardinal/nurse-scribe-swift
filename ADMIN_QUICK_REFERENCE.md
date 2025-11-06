# ⚡ Admin Dashboard - Quick Reference Card

One-page reference for common admin tasks and shortcuts.

---

## 🚀 Quick Access

| Feature | Path | Shortcut |
|---------|------|----------|
| Admin Dashboard | `/admin` | - |
| User Management | `/admin` → Users tab | - |
| Analytics | `/admin` → Analytics tab | - |
| System Monitor | `/admin` → System tab | - |
| Settings | `/admin` → Settings tab | - |

---

## 👤 User Management Cheat Sheet

### Quick Actions
```bash
# Create user
Click "Add User" → Fill form → Save

# Edit user
Click user row → "Edit" → Update → Save

# Suspend user
Click user → "More" → "Suspend" → Confirm

# Delete user
Click user → "More" → "Delete" → Confirm

# Bulk operations
Select users → "Actions" dropdown → Choose action
```

### User Roles

| Role | Permissions |
|------|-------------|
| Super Admin | Full access, manage admins |
| Admin | User & analytics management |
| Nurse | Create/edit own notes |
| Doctor | View all notes, approve |
| Viewer | Read-only access |

---

## 📊 Analytics Quick Stats

### Key Metrics Dashboard
- **Total Users**: Current user count + growth %
- **Active Notes**: Total notes + monthly trend
- **System Uptime**: Current uptime + 30-day avg
- **API Requests**: Today's requests + rate

### Common Reports
```bash
# Daily Report
Analytics → "Generate Report" → Daily → Export

# User Activity
Analytics → "User Activity" → Date range → View

# Note Statistics
Notes tab → "Analytics" → Select metrics
```

---

## 🖥️ System Monitoring

### Health Check
```yaml
CPU Usage:     Monitor if >80%
Memory Usage:  Alert if >90%
Disk Space:    Warning if <10% free
Response Time: Check if >500ms
```

### Quick Fixes
```bash
# High CPU
1. Check active queries
2. Restart services
3. Scale resources

# Memory issues
1. Clear cache
2. Restart application
3. Check for memory leaks

# Disk space
1. Archive old logs
2. Clean backups
3. Compress files
```

---

## 🔒 Security Essentials

### Daily Security Checks
- ✅ Review failed login attempts
- ✅ Check security alerts
- ✅ Verify backup completion
- ✅ Monitor unusual activity

### Emergency Actions
```bash
# Suspicious activity detected
1. Lock affected accounts
2. Review audit logs
3. Notify security team
4. Document incident

# Account compromise
1. Force logout all sessions
2. Reset password
3. Enable 2FA
4. Review access logs
```

---

## ⚙️ Settings Quick Config

### Essential Settings
```yaml
# General
App Name: [Your Organization]
Timezone: [Your Timezone]
Maintenance: Disabled (except during updates)

# Email
SMTP Host: smtp.gmail.com
SMTP Port: 587
Use TLS: Enabled

# Notifications
Security Alerts: ON
Performance Alerts: ON
Backup Notifications: ON

# Backup
Frequency: Daily
Time: 2:00 AM
Retention: 30 days
Compression: Enabled
```

---

## 🔧 Common Tasks

### Daily Tasks
- [ ] Check system health dashboard
- [ ] Review overnight alerts
- [ ] Verify backup completion
- [ ] Monitor error rates

### Weekly Tasks
- [ ] Review user access logs
- [ ] Check storage usage
- [ ] Update user permissions
- [ ] Generate weekly report

### Monthly Tasks
- [ ] Security audit review
- [ ] Performance optimization
- [ ] User account cleanup
- [ ] System updates

---

## 🆘 Emergency Contacts

### Internal
- Tech Lead: tech-lead@novacare.ai
- DevOps: devops@novacare.ai
- Security: security@novacare.ai

### External Support
- Email: support@novacare.ai
- Phone: 1-800-NOVACARE
- Emergency: urgent@novacare.ai

---

## 📱 Mobile Access

### Responsive Features
- ✅ System health monitoring
- ✅ User management (view/edit)
- ✅ Security alerts
- ✅ Basic analytics
- ⬜ Full settings (desktop only)

---

## 🔑 API Quick Reference

### Authentication
```bash
# API Key
curl -H "Authorization: Bearer YOUR_API_KEY" \
     https://api.novacare.ai/v1/admin/users

# Required Scopes
admin:users - User management
admin:analytics - Analytics access
admin:system - System management
```

### Common Endpoints
```bash
# List users
GET /api/v1/admin/users

# Get system status
GET /api/v1/admin/system/status

# Create organization
POST /api/v1/admin/organizations

# Get analytics
GET /api/v1/admin/analytics/system
```

---

## 💡 Pro Tips

### Performance
- Monitor CPU/memory during peak hours (9 AM - 5 PM)
- Set up automated alerts for resource thresholds
- Review slow queries weekly
- Enable caching for frequently accessed data

### Security
- Enforce 2FA for all admin accounts
- Rotate API keys every 90 days
- Review audit logs weekly
- Keep system updated

### Backup
- Test restore procedures monthly
- Store backups in multiple locations
- Verify backup integrity
- Document restore process

### User Management
- Remove inactive accounts (90+ days)
- Regular permission audits
- Document role changes
- Maintain user exit checklist

---

## 🚨 Incident Response

### P1 - Critical (Immediate)
```bash
System down, data breach, complete service failure
→ Execute incident response plan
→ Notify all stakeholders
→ Activate backup systems
→ Document everything
```

### P2 - High (1 hour)
```bash
Performance degradation, partial outage
→ Identify root cause
→ Implement temporary fix
→ Schedule permanent fix
→ Update status page
```

### P3 - Medium (4 hours)
```bash
Non-critical bugs, minor issues
→ Create ticket
→ Prioritize in backlog
→ Assign to team
→ Schedule fix
```

### P4 - Low (1 week)
```bash
Feature requests, minor improvements
→ Document request
→ Add to roadmap
→ Plan for next sprint
```

---

## 📋 Keyboard Shortcuts

*Coming in v2.5.0*

```bash
Ctrl/Cmd + K     Quick search
Ctrl/Cmd + /     Command palette
Ctrl/Cmd + R     Refresh data
Ctrl/Cmd + N     New item
Ctrl/Cmd + S     Save changes
Escape           Close modal
```

---

## 🔗 Quick Links

- [Full Documentation](./ADMIN_DASHBOARD_GUIDE.md)
- [API Reference](./ADMIN_API_REFERENCE.md)
- [Security Guide](./SECURITY_GUIDE.md)
- [Troubleshooting](./TROUBLESHOOTING.md)
- [Status Page](https://status.novacare.ai)

---

## 📞 Support Priority

| Priority | Response Time | Channel |
|----------|--------------|---------|
| P1 (Critical) | 15 minutes | Phone |
| P2 (High) | 1 hour | Email + Chat |
| P3 (Medium) | 4 hours | Email |
| P4 (Low) | 1 business day | Email |

---

*Print this card and keep it handy! 📄*

*Last Updated: November 6, 2025*
*Version: 2.4.0*
