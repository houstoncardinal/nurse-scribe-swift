-- =====================================================
-- NurseScribe AI - Complete Supabase Migration
-- =====================================================
-- This migration creates all necessary tables, functions, 
-- policies, and triggers for the NurseScribe AI application
-- =====================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =====================================================
-- 1. ORGANIZATIONS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('hospital', 'clinic', 'nursing_school', 'private_practice')),
    hipaa_compliant BOOLEAN DEFAULT true,
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 2. USER PROFILES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('admin', 'nurse', 'instructor', 'student', 'auditor')),
    department TEXT,
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    hipaa_training_completed BOOLEAN DEFAULT false,
    hipaa_training_date TIMESTAMP WITH TIME ZONE,
    two_factor_enabled BOOLEAN DEFAULT false,
    last_login TIMESTAMP WITH TIME ZONE,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
    preferences JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 3. NOTE METADATA TABLE (Non-PHI data only)
-- =====================================================
CREATE TABLE IF NOT EXISTS note_metadata (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    template TEXT NOT NULL CHECK (template IN ('SOAP', 'SBAR', 'PIE', 'DAR')),
    duration_seconds INTEGER DEFAULT 0,
    time_saved_minutes INTEGER DEFAULT 15,
    redaction_count INTEGER DEFAULT 0,
    template_version TEXT DEFAULT '1.0',
    ai_model_used TEXT DEFAULT 'gpt-4o-mini',
    confidence_score DECIMAL(3,2) DEFAULT 0.95,
    word_count INTEGER DEFAULT 0,
    character_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 4. ANALYTICS EVENTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS analytics_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL,
    event_data JSONB DEFAULT '{}',
    session_id TEXT,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 5. EDUCATION PROGRESS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS education_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    case_id TEXT NOT NULL,
    session_id TEXT NOT NULL,
    score DECIMAL(5,2) DEFAULT 0.0,
    time_spent_minutes INTEGER DEFAULT 0,
    feedback TEXT[] DEFAULT '{}',
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 6. AUDIT LOGS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES user_profiles(id) ON DELETE SET NULL,
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    action TEXT NOT NULL,
    resource TEXT NOT NULL,
    ip_address INET,
    user_agent TEXT,
    success BOOLEAN DEFAULT true,
    details JSONB DEFAULT '{}',
    risk_level TEXT DEFAULT 'low' CHECK (risk_level IN ('low', 'medium', 'high', 'critical')),
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 7. USER SESSIONS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS user_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    session_token TEXT UNIQUE NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 8. TEMPLATES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('SOAP', 'SBAR', 'PIE', 'DAR')),
    description TEXT,
    content JSONB NOT NULL,
    is_default BOOLEAN DEFAULT false,
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    created_by UUID REFERENCES user_profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 9. INTEGRATIONS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS integrations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('ehr', 'analytics', 'storage', 'authentication')),
    status TEXT DEFAULT 'inactive' CHECK (status IN ('active', 'inactive', 'error')),
    configuration JSONB DEFAULT '{}',
    last_sync TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 10. DEPARTMENTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS departments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    code TEXT NOT NULL,
    hipaa_level TEXT DEFAULT 'full' CHECK (hipaa_level IN ('full', 'limited', 'none')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(organization_id, code)
);

-- =====================================================
-- 11. USER DEPARTMENTS JUNCTION TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS user_departments (
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    department_id UUID REFERENCES departments(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, department_id)
);

-- =====================================================
-- 12. INDEXES FOR PERFORMANCE
-- =====================================================

-- User profiles indexes
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_user_profiles_organization_id ON user_profiles(organization_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON user_profiles(role);
CREATE INDEX IF NOT EXISTS idx_user_profiles_status ON user_profiles(status);

-- Note metadata indexes
CREATE INDEX IF NOT EXISTS idx_note_metadata_user_id ON note_metadata(user_id);
CREATE INDEX IF NOT EXISTS idx_note_metadata_organization_id ON note_metadata(organization_id);
CREATE INDEX IF NOT EXISTS idx_note_metadata_created_at ON note_metadata(created_at);
CREATE INDEX IF NOT EXISTS idx_note_metadata_template ON note_metadata(template);

-- Analytics events indexes
CREATE INDEX IF NOT EXISTS idx_analytics_events_user_id ON analytics_events(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_organization_id ON analytics_events(organization_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_timestamp ON analytics_events(timestamp);
CREATE INDEX IF NOT EXISTS idx_analytics_events_event_type ON analytics_events(event_type);

-- Education progress indexes
CREATE INDEX IF NOT EXISTS idx_education_progress_user_id ON education_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_education_progress_case_id ON education_progress(case_id);
CREATE INDEX IF NOT EXISTS idx_education_progress_completed_at ON education_progress(completed_at);

-- Audit logs indexes
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_organization_id ON audit_logs(organization_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_timestamp ON audit_logs(timestamp);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_risk_level ON audit_logs(risk_level);

-- User sessions indexes
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_token ON user_sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_user_sessions_expires_at ON user_sessions(expires_at);

-- =====================================================
-- 13. TRIGGERS FOR UPDATED_AT
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers
CREATE TRIGGER update_organizations_updated_at BEFORE UPDATE ON organizations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_note_metadata_updated_at BEFORE UPDATE ON note_metadata FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_templates_updated_at BEFORE UPDATE ON templates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_integrations_updated_at BEFORE UPDATE ON integrations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_departments_updated_at BEFORE UPDATE ON departments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 14. ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE note_metadata ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE education_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_departments ENABLE ROW LEVEL SECURITY;

-- Organizations policies
CREATE POLICY "Users can view their organization" ON organizations
    FOR SELECT USING (
        id IN (
            SELECT organization_id FROM user_profiles 
            WHERE id = auth.uid()
        )
    );

-- User profiles policies
CREATE POLICY "Users can view profiles in their organization" ON user_profiles
    FOR SELECT USING (
        organization_id IN (
            SELECT organization_id FROM user_profiles 
            WHERE id = auth.uid()
        )
    );

CREATE POLICY "Users can update their own profile" ON user_profiles
    FOR UPDATE USING (id = auth.uid());

-- Note metadata policies
CREATE POLICY "Users can view their own notes" ON note_metadata
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own notes" ON note_metadata
    FOR INSERT WITH CHECK (user_id = auth.uid());

-- Analytics events policies
CREATE POLICY "Users can view their own analytics" ON analytics_events
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own analytics" ON analytics_events
    FOR INSERT WITH CHECK (user_id = auth.uid());

-- Education progress policies
CREATE POLICY "Users can view their own education progress" ON education_progress
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own education progress" ON education_progress
    FOR INSERT WITH CHECK (user_id = auth.uid());

-- Audit logs policies (admin only)
CREATE POLICY "Admins can view audit logs" ON audit_logs
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Templates policies
CREATE POLICY "Users can view organization templates" ON templates
    FOR SELECT USING (
        organization_id IN (
            SELECT organization_id FROM user_profiles 
            WHERE id = auth.uid()
        )
    );

CREATE POLICY "Admins can manage templates" ON templates
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- =====================================================
-- 15. FUNCTIONS FOR BUSINESS LOGIC
-- =====================================================

-- Function to get user analytics summary
CREATE OR REPLACE FUNCTION get_user_analytics_summary(p_user_id UUID)
RETURNS JSONB AS $$
DECLARE
    result JSONB;
BEGIN
    SELECT jsonb_build_object(
        'total_notes', COUNT(*),
        'total_time_saved', COALESCE(SUM(time_saved_minutes), 0),
        'average_confidence', COALESCE(AVG(confidence_score), 0),
        'templates_used', jsonb_object_agg(template, count)
    ) INTO result
    FROM (
        SELECT template, COUNT(*) as count
        FROM note_metadata 
        WHERE user_id = p_user_id
        GROUP BY template
    ) template_counts
    CROSS JOIN (
        SELECT COUNT(*) as total_notes,
               COALESCE(SUM(time_saved_minutes), 0) as total_time_saved,
               COALESCE(AVG(confidence_score), 0) as average_confidence
        FROM note_metadata 
        WHERE user_id = p_user_id
    ) summary;
    
    RETURN COALESCE(result, '{}'::jsonb);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to clean up expired sessions
CREATE OR REPLACE FUNCTION cleanup_expired_sessions()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM user_sessions WHERE expires_at < NOW();
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to log audit event
CREATE OR REPLACE FUNCTION log_audit_event(
    p_user_id UUID,
    p_action TEXT,
    p_resource TEXT,
    p_success BOOLEAN DEFAULT true,
    p_details JSONB DEFAULT '{}',
    p_risk_level TEXT DEFAULT 'low'
)
RETURNS UUID AS $$
DECLARE
    audit_id UUID;
    user_org_id UUID;
BEGIN
    -- Get user's organization
    SELECT organization_id INTO user_org_id 
    FROM user_profiles 
    WHERE id = p_user_id;
    
    -- Insert audit log
    INSERT INTO audit_logs (
        user_id, organization_id, action, resource, 
        success, details, risk_level
    ) VALUES (
        p_user_id, user_org_id, p_action, p_resource,
        p_success, p_details, p_risk_level
    ) RETURNING id INTO audit_id;
    
    RETURN audit_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- 16. SAMPLE DATA INSERTION
-- =====================================================

-- Insert sample organization
INSERT INTO organizations (id, name, type, hipaa_compliant, settings) 
VALUES (
    '00000000-0000-0000-0000-000000000001',
    'General Hospital',
    'hospital',
    true,
    '{"data_retention_days": 2555, "encryption_enabled": true, "audit_logging": true}'::jsonb
) ON CONFLICT (id) DO NOTHING;

-- Insert sample departments
INSERT INTO departments (organization_id, name, code, hipaa_level)
VALUES 
    ('00000000-0000-0000-0000-000000000001', 'Medical-Surgical', 'MED-SURG', 'full'),
    ('00000000-0000-0000-0000-000000000001', 'Emergency Department', 'ED', 'full'),
    ('00000000-0000-0000-0000-000000000001', 'Nursing Education', 'NURS-ED', 'limited')
ON CONFLICT DO NOTHING;

-- Insert sample templates
INSERT INTO templates (name, type, description, content, is_default, organization_id)
VALUES 
    (
        'Standard SOAP',
        'SOAP',
        'Standard SOAP note template',
        '{"subjective": "Patient reports...", "objective": "Vital signs...", "assessment": "Patient presents with...", "plan": "Continue..."}'::jsonb,
        true,
        '00000000-0000-0000-0000-000000000001'
    ),
    (
        'Standard SBAR',
        'SBAR',
        'Standard SBAR communication template',
        '{"situation": "Patient situation...", "background": "Patient background...", "assessment": "Clinical assessment...", "recommendation": "Recommended action..."}'::jsonb,
        true,
        '00000000-0000-0000-0000-000000000001'
    )
ON CONFLICT DO NOTHING;

-- Insert sample integrations
INSERT INTO integrations (organization_id, name, type, status, configuration)
VALUES 
    (
        '00000000-0000-0000-0000-000000000001',
        'Epic EHR',
        'ehr',
        'active',
        '{"url": "https://epic.example.com", "api_version": "v1"}'::jsonb
    ),
    (
        '00000000-0000-0000-0000-000000000001',
        'Supabase Storage',
        'storage',
        'active',
        '{"encrypted": true, "backup_enabled": true}'::jsonb
    )
ON CONFLICT DO NOTHING;

-- =====================================================
-- 17. SCHEDULED TASKS (using pg_cron if available)
-- =====================================================

-- Clean up expired sessions daily (requires pg_cron extension)
-- SELECT cron.schedule('cleanup-expired-sessions', '0 2 * * *', 'SELECT cleanup_expired_sessions();');

-- =====================================================
-- 18. VIEWS FOR COMMON QUERIES
-- =====================================================

-- User dashboard view
CREATE OR REPLACE VIEW user_dashboard AS
SELECT 
    up.id,
    up.name,
    up.email,
    up.role,
    up.department,
    o.name as organization_name,
    o.type as organization_type,
    up.hipaa_training_completed,
    up.last_login,
    up.status,
    COUNT(nm.id) as total_notes,
    COALESCE(SUM(nm.time_saved_minutes), 0) as total_time_saved,
    COALESCE(AVG(nm.confidence_score), 0) as avg_confidence
FROM user_profiles up
JOIN organizations o ON up.organization_id = o.id
LEFT JOIN note_metadata nm ON up.id = nm.user_id
GROUP BY up.id, o.name, o.type;

-- Organization analytics view
CREATE OR REPLACE VIEW organization_analytics AS
SELECT 
    o.id as organization_id,
    o.name as organization_name,
    o.type as organization_type,
    COUNT(DISTINCT up.id) as total_users,
    COUNT(DISTINCT nm.id) as total_notes,
    COALESCE(SUM(nm.time_saved_minutes), 0) as total_time_saved,
    COALESCE(AVG(nm.confidence_score), 0) as avg_confidence,
    COUNT(DISTINCT CASE WHEN ae.event_type = 'note_created' THEN ae.id END) as notes_created_today
FROM organizations o
LEFT JOIN user_profiles up ON o.id = up.organization_id
LEFT JOIN note_metadata nm ON up.id = nm.user_id
LEFT JOIN analytics_events ae ON up.id = ae.user_id AND ae.timestamp >= CURRENT_DATE
GROUP BY o.id, o.name, o.type;

-- =====================================================
-- MIGRATION COMPLETE
-- =====================================================

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO authenticated;

-- Create a function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin(p_user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM user_profiles 
        WHERE id = p_user_id AND role = 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a function to get user organization
CREATE OR REPLACE FUNCTION get_user_organization(p_user_id UUID)
RETURNS UUID AS $$
BEGIN
    RETURN (
        SELECT organization_id 
        FROM user_profiles 
        WHERE id = p_user_id
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON DATABASE postgres IS 'NurseScribe AI - HIPAA Compliant Voice Documentation Platform';
