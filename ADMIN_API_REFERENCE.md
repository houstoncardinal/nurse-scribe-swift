# 🔌 Admin API Reference

Complete API documentation for NovaCare Admin Dashboard backend services.

---

## 📋 Table of Contents

1. [Authentication](#authentication)
2. [Users API](#users-api)
3. [Notes API](#notes-api)
4. [Analytics API](#analytics-api)
5. [Organizations API](#organizations-api)
6. [System API](#system-api)
7. [Security API](#security-api)
8. [Settings API](#settings-api)
9. [Webhooks](#webhooks)
10. [Error Codes](#error-codes)

---

## 🔐 Authentication

### API Key Authentication

```bash
# Include API key in header
curl -H "Authorization: Bearer YOUR_API_KEY" \
     https://api.novacare.ai/v1/admin/users
```

### Admin Session Authentication

```bash
# Use session cookie after login
curl -H "Cookie: session=SESSION_TOKEN" \
     https://api.novacare.ai/v1/admin/users
```

### Required Permissions

| Endpoint | Required Role | Scope |
|----------|--------------|-------|
| `/admin/users` | Admin | `admin:users` |
| `/admin/analytics` | Admin | `admin:analytics` |
| `/admin/system` | Super Admin | `admin:system` |
| `/admin/settings` | Super Admin | `admin:settings` |

---

## 👥 Users API

### List Users

```bash
GET /api/v1/admin/users
```

**Query Parameters:**
```typescript
{
  page?: number;        // Default: 1
  limit?: number;       // Default: 50, Max: 100
  role?: string;        // Filter by role
  status?: string;      // Filter by status (active, inactive, suspended)
  search?: string;      // Search by name/email
  sortBy?: string;      // Field to sort by
  sortOrder?: 'asc'|'desc';
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "users": [
      {
        "id": "user_123",
        "name": "Dr. Sarah Johnson",
        "email": "sarah.johnson@hospital.com",
        "role": "Nurse",
        "status": "active",
        "created_at": "2025-01-15T10:30:00Z",
        "last_login": "2025-11-06T09:15:00Z",
        "stats": {
          "notes_created": 127,
          "time_saved": 45.2,
          "accuracy": 99.2
        }
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 50,
      "total": 2543,
      "pages": 51
    }
  }
}
```

### Get User by ID

```bash
GET /api/v1/admin/users/:id
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "user_123",
    "name": "Dr. Sarah Johnson",
    "email": "sarah.johnson@hospital.com",
    "role": "Nurse",
    "credentials": "RN, BSN",
    "status": "active",
    "phone": "+1-555-123-4567",
    "location": "General Hospital",
    "created_at": "2025-01-15T10:30:00Z",
    "updated_at": "2025-11-05T14:22:00Z",
    "last_login": "2025-11-06T09:15:00Z",
    "stats": {
      "notes_created": 127,
      "time_saved": 45.2,
      "accuracy": 99.2,
      "weekly_goal": 50,
      "notes_this_week": 42
    },
    "preferences": {
      "notifications": true,
      "voice_speed": 50,
      "default_template": "SOAP",
      "auto_save": true,
      "dark_mode": false
    },
    "organization": {
      "id": "org_456",
      "name": "General Hospital"
    }
  }
}
```

### Create User

```bash
POST /api/v1/admin/users
```

**Request Body:**
```json
{
  "name": "Dr. John Smith",
  "email": "john.smith@hospital.com",
  "password": "SecurePassword123!",
  "role": "Doctor",
  "credentials": "MD, FACS",
  "phone": "+1-555-987-6543",
  "organization_id": "org_456"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "user_789",
    "name": "Dr. John Smith",
    "email": "john.smith@hospital.com",
    "role": "Doctor",
    "created_at": "2025-11-06T10:30:00Z"
  },
  "message": "User created successfully"
}
```

### Update User

```bash
PATCH /api/v1/admin/users/:id
```

**Request Body:**
```json
{
  "name": "Dr. Sarah Johnson-Smith",
  "role": "Senior Nurse",
  "status": "active",
  "phone": "+1-555-123-9999"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "user_123",
    "name": "Dr. Sarah Johnson-Smith",
    "email": "sarah.johnson@hospital.com",
    "role": "Senior Nurse",
    "updated_at": "2025-11-06T10:35:00Z"
  },
  "message": "User updated successfully"
}
```

### Delete User

```bash
DELETE /api/v1/admin/users/:id
```

**Request Body (optional):**
```json
{
  "permanent": false,  // Soft delete by default
  "reason": "Account inactive for 90 days"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

### Bulk Operations

```bash
POST /api/v1/admin/users/bulk
```

**Request Body:**
```json
{
  "action": "suspend",  // suspend, activate, delete, update_role
  "user_ids": ["user_123", "user_456", "user_789"],
  "data": {
    "role": "Viewer"  // For update_role action
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "processed": 3,
    "succeeded": 3,
    "failed": 0,
    "results": [
      {"id": "user_123", "status": "success"},
      {"id": "user_456", "status": "success"},
      {"id": "user_789", "status": "success"}
    ]
  },
  "message": "Bulk operation completed"
}
```

---

## 📄 Notes API

### List Notes

```bash
GET /api/v1/admin/notes
```

**Query Parameters:**
```typescript
{
  page?: number;
  limit?: number;
  user_id?: string;     // Filter by user
  template?: string;    // Filter by template (SOAP, SBAR, etc.)
  status?: string;      // draft, completed, exported
  date_from?: string;   // ISO 8601 date
  date_to?: string;     // ISO 8601 date
  search?: string;      // Full-text search
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "notes": [
      {
        "id": "note_001",
        "user_id": "user_123",
        "user_name": "Dr. Sarah Johnson",
        "template": "SOAP",
        "status": "completed",
        "created_at": "2025-11-06T09:30:00Z",
        "updated_at": "2025-11-06T09:35:00Z",
        "word_count": 342,
        "confidence": 0.95,
        "has_phi": false,
        "preview": "Subjective: Patient reports mild chest discomfort..."
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 50,
      "total": 45231,
      "pages": 905
    }
  }
}
```

### Get Note by ID

```bash
GET /api/v1/admin/notes/:id
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "note_001",
    "user_id": "user_123",
    "user_name": "Dr. Sarah Johnson",
    "template": "SOAP",
    "status": "completed",
    "created_at": "2025-11-06T09:30:00Z",
    "updated_at": "2025-11-06T09:35:00Z",
    "content": {
      "subjective": "Patient reports mild chest discomfort...",
      "objective": "VS: BP 128/84 mmHg, HR 82 bpm...",
      "assessment": "Chest pain likely musculoskeletal...",
      "plan": "Monitor vitals, provide acetaminophen..."
    },
    "metadata": {
      "word_count": 342,
      "confidence": 0.95,
      "quality_score": 0.92,
      "medical_terms": 15,
      "icd10_codes": ["M79.1", "R07.9"],
      "has_phi": false,
      "processing_time": "2.4s"
    },
    "audit": {
      "created_by": "user_123",
      "updated_by": "user_123",
      "exported": true,
      "export_date": "2025-11-06T09:40:00Z",
      "export_format": "PDF"
    }
  }
}
```

### Note Analytics

```bash
GET /api/v1/admin/notes/analytics
```

**Query Parameters:**
```typescript
{
  date_from?: string;
  date_to?: string;
  group_by?: 'day'|'week'|'month';
  template?: string;
  user_id?: string;
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "total_notes": 45231,
    "notes_by_template": {
      "SOAP": 18543,
      "SBAR": 12789,
      "PIE": 8932,
      "DAR": 4967
    },
    "notes_by_status": {
      "completed": 42134,
      "draft": 2987,
      "exported": 40125
    },
    "avg_confidence": 0.94,
    "avg_quality_score": 0.91,
    "phi_detection_rate": 0.02,
    "timeline": [
      {
        "date": "2025-11-01",
        "count": 1543,
        "avg_confidence": 0.95
      }
    ]
  }
}
```

### Delete Note

```bash
DELETE /api/v1/admin/notes/:id
```

**Response:**
```json
{
  "success": true,
  "message": "Note deleted successfully"
}
```

---

## 📊 Analytics API

### System Analytics

```bash
GET /api/v1/admin/analytics/system
```

**Query Parameters:**
```typescript
{
  period?: '24h'|'7d'|'30d'|'90d';
  metrics?: string[];  // cpu, memory, disk, network, requests
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "period": "30d",
    "metrics": {
      "uptime": {
        "current": "99.9%",
        "target": "99.5%",
        "incidents": 2
      },
      "requests": {
        "total": 1245789,
        "avg_per_day": 41526,
        "peak_per_second": 245
      },
      "errors": {
        "total": 23,
        "rate": "0.002%",
        "by_type": {
          "4xx": 15,
          "5xx": 8
        }
      },
      "performance": {
        "avg_response_time": "245ms",
        "p50": "180ms",
        "p95": "420ms",
        "p99": "850ms"
      },
      "resources": {
        "cpu_avg": 42,
        "memory_avg": 67,
        "disk_usage": 54
      }
    }
  }
}
```

### User Analytics

```bash
GET /api/v1/admin/analytics/users
```

**Response:**
```json
{
  "success": true,
  "data": {
    "total_users": 2543,
    "active_users": 2234,
    "new_users_30d": 156,
    "growth_rate": "+12%",
    "by_role": {
      "Nurse": 1543,
      "Doctor": 678,
      "Admin": 45,
      "Viewer": 277
    },
    "by_status": {
      "active": 2234,
      "inactive": 287,
      "suspended": 22
    },
    "engagement": {
      "dau": 1234,
      "wau": 1876,
      "mau": 2234,
      "retention_7d": "78%",
      "retention_30d": "65%"
    }
  }
}
```

### Custom Report

```bash
POST /api/v1/admin/analytics/reports
```

**Request Body:**
```json
{
  "name": "Monthly User Activity Report",
  "type": "user_activity",
  "date_range": {
    "start": "2025-10-01",
    "end": "2025-10-31"
  },
  "metrics": [
    "active_users",
    "notes_created",
    "avg_session_time"
  ],
  "group_by": "day",
  "format": "pdf",  // pdf, csv, json
  "email_to": "admin@hospital.com"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "report_id": "report_123",
    "status": "generating",
    "estimated_time": "30s",
    "download_url": null
  },
  "message": "Report generation started"
}
```

---

## 🌐 Organizations API

### List Organizations

```bash
GET /api/v1/admin/organizations
```

**Response:**
```json
{
  "success": true,
  "data": {
    "organizations": [
      {
        "id": "org_123",
        "name": "General Hospital",
        "slug": "general-hospital",
        "status": "active",
        "license": {
          "type": "enterprise",
          "max_users": 500,
          "current_users": 287,
          "max_notes": 50000,
          "current_notes": 18934,
          "features": ["phi_protection", "analytics", "api_access"],
          "expires_at": "2026-12-31"
        },
        "created_at": "2024-01-15T00:00:00Z",
        "updated_at": "2025-11-05T10:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 50,
      "total": 45,
      "pages": 1
    }
  }
}
```

### Create Organization

```bash
POST /api/v1/admin/organizations
```

**Request Body:**
```json
{
  "name": "City Medical Center",
  "slug": "city-medical-center",
  "license": {
    "type": "enterprise",
    "max_users": 1000,
    "max_notes": 100000,
    "features": ["phi_protection", "analytics", "api_access", "white_label"],
    "expires_at": "2026-12-31"
  },
  "settings": {
    "default_template": "SOAP",
    "require_2fa": true,
    "session_timeout": 3600
  },
  "branding": {
    "logo_url": "https://example.com/logo.png",
    "primary_color": "#0066CC",
    "secondary_color": "#00AA88"
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "org_456",
    "name": "City Medical Center",
    "slug": "city-medical-center",
    "created_at": "2025-11-06T10:00:00Z"
  },
  "message": "Organization created successfully"
}
```

---

## 🖥️ System API

### System Status

```bash
GET /api/v1/admin/system/status
```

**Response:**
```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "version": "2.4.0",
    "uptime": "15d 6h 32m",
    "started_at": "2025-10-22T04:00:00Z",
    "services": {
      "api": "healthy",
      "database": "healthy",
      "cache": "healthy",
      "queue": "healthy",
      "storage": "healthy"
    },
    "resources": {
      "cpu": {
        "usage": 42,
        "cores": 8
      },
      "memory": {
        "used": 6.7,
        "total": 16,
        "usage_percent": 67
      },
      "disk": {
        "used": 54,
        "total": 100,
        "usage_percent": 54
      },
      "network": {
        "in": "125 MB/s",
        "out": "89 MB/s"
      }
    }
  }
}
```

### System Logs

```bash
GET /api/v1/admin/system/logs
```

**Query Parameters:**
```typescript
{
  level?: 'debug'|'info'|'warn'|'error';
  date_from?: string;
  date_to?: string;
  search?: string;
  limit?: number;
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "logs": [
      {
        "id": "log_123",
        "timestamp": "2025-11-06T10:30:45Z",
        "level": "INFO",
        "message": "User logged in",
        "user_id": "user_123",
        "ip": "192.168.1.100",
        "metadata": {
          "browser": "Chrome 119",
          "os": "macOS"
        }
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 100,
      "total": 12543
    }
  }
}
```

### System Maintenance

```bash
POST /api/v1/admin/system/maintenance
```

**Request Body:**
```json
{
  "action": "enable",  // enable, disable
  "message": "System maintenance in progress. We'll be back soon!",
  "whitelist_ips": ["192.168.1.0/24"],
  "scheduled_end": "2025-11-06T14:00:00Z"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Maintenance mode enabled"
}
```

---

## 🔒 Security API

### Audit Logs

```bash
GET /api/v1/admin/security/audit-logs
```

**Query Parameters:**
```typescript
{
  action?: string;      // user.login, user.delete, etc.
  user_id?: string;
  date_from?: string;
  date_to?: string;
  limit?: number;
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "logs": [
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
    ],
    "pagination": {
      "page": 1,
      "limit": 50,
      "total": 3456
    }
  }
}
```

### Security Events

```bash
GET /api/v1/admin/security/events
```

**Response:**
```json
{
  "success": true,
  "data": {
    "events": [
      {
        "id": "event_123",
        "type": "failed_login",
        "severity": "medium",
        "timestamp": "2025-11-06T10:25:00Z",
        "details": {
          "email": "admin@example.com",
          "ip": "203.0.113.42",
          "attempts": 5,
          "locked": true
        }
      }
    ],
    "summary": {
      "last_24h": {
        "failed_logins": 23,
        "suspicious_activity": 3,
        "blocked_ips": 5
      }
    }
  }
}
```

---

## ⚙️ Settings API

### Get Settings

```bash
GET /api/v1/admin/settings
```

**Response:**
```json
{
  "success": true,
  "data": {
    "general": {
      "app_name": "NovaCareAI",
      "timezone": "America/New_York",
      "maintenance_mode": false
    },
    "email": {
      "smtp_host": "smtp.gmail.com",
      "smtp_port": 587,
      "from_email": "noreply@novacare.ai",
      "use_tls": true
    },
    "notifications": {
      "email_enabled": true,
      "security_alerts": true,
      "performance_alerts": true
    },
    "backup": {
      "enabled": true,
      "frequency": "daily",
      "retention_days": 30
    }
  }
}
```

### Update Settings

```bash
PATCH /api/v1/admin/settings
```

**Request Body:**
```json
{
  "general": {
    "app_name": "NovaCare - City Medical"
  },
  "notifications": {
    "email_enabled": false
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Settings updated successfully"
}
```

---

## 🔔 Webhooks

### Register Webhook

```bash
POST /api/v1/admin/webhooks
```

**Request Body:**
```json
{
  "url": "https://your-server.com/webhook",
  "events": ["user.created", "note.created", "security.alert"],
  "secret": "your_webhook_secret"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "webhook_123",
    "url": "https://your-server.com/webhook",
    "events": ["user.created", "note.created", "security.alert"],
    "created_at": "2025-11-06T10:00:00Z"
  }
}
```

### Webhook Payload Example

```json
{
  "id": "evt_123",
  "type": "user.created",
  "timestamp": "2025-11-06T10:30:00Z",
  "data": {
    "user_id": "user_789",
    "email": "new.user@hospital.com",
    "role": "Nurse"
  }
}
```

---

## ❌ Error Codes

| Code | Message | Description |
|------|---------|-------------|
| 400 | Bad Request | Invalid request parameters |
| 401 | Unauthorized | Missing or invalid authentication |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource not found |
| 409 | Conflict | Resource already exists |
| 422 | Unprocessable Entity | Validation failed |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server error |
| 503 | Service Unavailable | Service temporarily unavailable |

### Error Response Format

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid email address",
    "details": {
      "field": "email",
      "constraint": "email format"
    }
  }
}
```

---

## 📚 Additional Resources

- [Admin Dashboard Guide](./ADMIN_DASHBOARD_GUIDE.md)
- [Authentication Guide](./AUTH_GUIDE.md)
- [Security Best Practices](./SECURITY_GUIDE.md)
- [Rate Limiting](./RATE_LIMITING.md)

---

*Last Updated: November 6, 2025*
*API Version: v1*
*© 2025 NovaCare AI*
