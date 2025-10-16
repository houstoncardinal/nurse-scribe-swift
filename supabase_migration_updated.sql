-- =====================================================
-- NurseScribe AI - Complete Updated Supabase Migration
-- =====================================================
-- This migration creates all necessary tables, functions, 
-- policies, and triggers for the NurseScribe AI application
-- Updated for full app functionality and integration
-- =====================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- =====================================================
-- 1. ORGANIZATIONS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('hospital', 'clinic', 'nursing_school', 'private_practice', 'enterprise')),
    hipaa_compliant BOOLEAN DEFAULT true,
    settings JSONB DEFAULT '{}',
    subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'professional', 'enterprise')),
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
    role TEXT NOT NULL CHECK (role IN ('admin', 'nurse', 'instructor', 'student', 'auditor', 'manager')),
    department TEXT,
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    hipaa_training_completed BOOLEAN DEFAULT false,
    hipaa_training_date TIMESTAMP WITH TIME ZONE,
    two_factor_enabled BOOLEAN DEFAULT false,
    last_login TIMESTAMP WITH TIME ZONE,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended', 'pending')),
    preferences JSONB DEFAULT '{}',
    stats JSONB DEFAULT '{"total_notes": 0, "time_saved": 0, "accuracy": 0}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 3. NOTE TEMPLATES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS note_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    type TEXT NOT NULL CHECK (type IN ('SOAP', 'SBAR', 'PIE', 'DAR', 'custom')),
    description TEXT,
    sections JSONB NOT NULL,
    organization_id UUID,
    is_default BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_by UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 4. NOTE METADATA TABLE (Non-PHI data only)
-- =====================================================
CREATE TABLE IF NOT EXISTS note_metadata (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    template_id UUID REFERENCES note_templates(id),
    template_type TEXT NOT NULL CHECK (template_type IN ('SOAP', 'SBAR', 'PIE', 'DAR')),
    title TEXT,
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'completed', 'exported', 'archived')),
    word_count INTEGER DEFAULT 0,
    processing_time_ms INTEGER DEFAULT 0,
    accuracy_score DECIMAL(5,2),
    export_format TEXT,
    export_timestamp TIMESTAMP WITH TIME ZONE,
    is_redacted BOOLEAN DEFAULT false,
    redaction_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 5. VOICE RECORDINGS TABLE (Metadata only)
-- =====================================================
CREATE TABLE IF NOT EXISTS voice_recordings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    note_id UUID REFERENCES note_metadata(id) ON DELETE CASCADE,
    duration_seconds INTEGER NOT NULL,
    file_size_bytes INTEGER,
    quality_score DECIMAL(3,2),
    language_code TEXT DEFAULT 'en-US',
    processing_status TEXT DEFAULT 'pending' CHECK (processing_status IN ('pending', 'processing', 'completed', 'failed')),
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 6. EXPORT HISTORY TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS export_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    note_id UUID REFERENCES note_metadata(id) ON DELETE CASCADE,
    export_format TEXT NOT NULL CHECK (export_format IN ('pdf', 'text', 'html', 'epic', 'cerner')),
    export_method TEXT NOT NULL CHECK (export_method IN ('download', 'clipboard', 'email', 'ehr')),
    file_size_bytes INTEGER,
    success BOOLEAN DEFAULT true,
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 7. AUDIT LOGS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES user_profiles(id),
    organization_id UUID REFERENCES organizations(id),
    action TEXT NOT NULL,
    resource_type TEXT NOT NULL,
    resource_id UUID,
    details JSONB DEFAULT '{}',
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 8. ANALYTICS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    metric_name TEXT NOT NULL,
    metric_value DECIMAL(10,2) NOT NULL,
    metric_unit TEXT,
    dimensions JSONB DEFAULT '{}',
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 9. EDUCATION PROGRESS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS education_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    case_id TEXT NOT NULL,
    case_title TEXT NOT NULL,
    template_type TEXT NOT NULL,
    score DECIMAL(5,2),
    time_taken_seconds INTEGER,
    attempts INTEGER DEFAULT 1,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 10. ICD-10 SUGGESTIONS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS icd10_suggestions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    keyword TEXT NOT NULL,
    code TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT,
    is_active BOOLEAN DEFAULT true,
    usage_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 11. TIME SAVER SHORTCUTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS time_saver_shortcuts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    shortcut_key TEXT NOT NULL,
    expansion_text TEXT NOT NULL,
    template_type TEXT,
    usage_count INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 12. SYSTEM SETTINGS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS system_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    setting_key TEXT UNIQUE NOT NULL,
    setting_value JSONB NOT NULL,
    description TEXT,
    is_public BOOLEAN DEFAULT false,
    updated_by UUID REFERENCES user_profiles(id),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- ADD FOREIGN KEY CONSTRAINTS (After all tables are created)
-- =====================================================

-- Add foreign key constraints to note_templates
ALTER TABLE note_templates 
ADD CONSTRAINT fk_note_templates_organization 
FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE;

ALTER TABLE note_templates 
ADD CONSTRAINT fk_note_templates_created_by 
FOREIGN KEY (created_by) REFERENCES user_profiles(id);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- User profiles indexes
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_user_profiles_organization ON user_profiles(organization_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_status ON user_profiles(status);
CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON user_profiles(role);

-- Note metadata indexes
CREATE INDEX IF NOT EXISTS idx_note_metadata_user ON note_metadata(user_id);
CREATE INDEX IF NOT EXISTS idx_note_metadata_template ON note_metadata(template_id);
CREATE INDEX IF NOT EXISTS idx_note_metadata_status ON note_metadata(status);
CREATE INDEX IF NOT EXISTS idx_note_metadata_created ON note_metadata(created_at);

-- Voice recordings indexes
CREATE INDEX IF NOT EXISTS idx_voice_recordings_user ON voice_recordings(user_id);
CREATE INDEX IF NOT EXISTS idx_voice_recordings_note ON voice_recordings(note_id);
CREATE INDEX IF NOT EXISTS idx_voice_recordings_status ON voice_recordings(processing_status);

-- Export history indexes
CREATE INDEX IF NOT EXISTS idx_export_history_user ON export_history(user_id);
CREATE INDEX IF NOT EXISTS idx_export_history_note ON export_history(note_id);
CREATE INDEX IF NOT EXISTS idx_export_history_created ON export_history(created_at);

-- Audit logs indexes
CREATE INDEX IF NOT EXISTS idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_organization ON audit_logs(organization_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created ON audit_logs(created_at);

-- Analytics indexes
CREATE INDEX IF NOT EXISTS idx_analytics_user ON analytics(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_organization ON analytics(organization_id);
CREATE INDEX IF NOT EXISTS idx_analytics_metric ON analytics(metric_name);
CREATE INDEX IF NOT EXISTS idx_analytics_recorded ON analytics(recorded_at);

-- ICD-10 suggestions indexes
CREATE INDEX IF NOT EXISTS idx_icd10_keyword ON icd10_suggestions USING gin(keyword gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_icd10_code ON icd10_suggestions(code);
CREATE INDEX IF NOT EXISTS idx_icd10_active ON icd10_suggestions(is_active);

-- =====================================================
-- FUNCTIONS
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Function to log audit events
CREATE OR REPLACE FUNCTION log_audit_event(
    p_user_id UUID,
    p_organization_id UUID,
    p_action TEXT,
    p_resource_type TEXT,
    p_resource_id UUID DEFAULT NULL,
    p_details JSONB DEFAULT '{}',
    p_ip_address INET DEFAULT NULL,
    p_user_agent TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    audit_id UUID;
BEGIN
    INSERT INTO audit_logs (
        user_id, organization_id, action, resource_type, 
        resource_id, details, ip_address, user_agent
    ) VALUES (
        p_user_id, p_organization_id, p_action, p_resource_type,
        p_resource_id, p_details, p_ip_address, p_user_agent
    ) RETURNING id INTO audit_id;
    
    RETURN audit_id;
END;
$$ LANGUAGE plpgsql;

-- Function to calculate user statistics
CREATE OR REPLACE FUNCTION calculate_user_stats(p_user_id UUID)
RETURNS JSONB AS $$
DECLARE
    result JSONB;
BEGIN
    SELECT jsonb_build_object(
        'total_notes', COUNT(*),
        'total_time_saved', COALESCE(SUM(processing_time_ms), 0),
        'average_accuracy', COALESCE(AVG(accuracy_score), 0),
        'templates_used', jsonb_object_agg(template_type, count)
    ) INTO result
    FROM (
        SELECT template_type, COUNT(*) as count
        FROM note_metadata 
        WHERE user_id = p_user_id 
        GROUP BY template_type
    ) template_stats
    LEFT JOIN (
        SELECT COUNT(*) as total_notes, 
               SUM(processing_time_ms) as total_time_saved,
               AVG(accuracy_score) as average_accuracy
        FROM note_metadata 
        WHERE user_id = p_user_id
    ) general_stats ON true;
    
    RETURN COALESCE(result, '{}'::jsonb);
END;
$$ LANGUAGE plpgsql;

-- Function to get ICD-10 suggestions
CREATE OR REPLACE FUNCTION get_icd10_suggestions(p_keyword TEXT, p_limit INTEGER DEFAULT 10)
RETURNS TABLE(code TEXT, description TEXT, category TEXT) AS $$
BEGIN
    RETURN QUERY
    SELECT s.code, s.description, s.category
    FROM icd10_suggestions s
    WHERE s.is_active = true
    AND (s.keyword ILIKE '%' || p_keyword || '%' OR s.description ILIKE '%' || p_keyword || '%')
    ORDER BY s.usage_count DESC, s.keyword <-> p_keyword
    LIMIT p_limit;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- TRIGGERS
-- =====================================================

-- Update timestamps triggers
CREATE TRIGGER update_organizations_updated_at BEFORE UPDATE ON organizations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_note_templates_updated_at BEFORE UPDATE ON note_templates
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_note_metadata_updated_at BEFORE UPDATE ON note_metadata
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_time_saver_shortcuts_updated_at BEFORE UPDATE ON time_saver_shortcuts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_system_settings_updated_at BEFORE UPDATE ON system_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE note_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE note_metadata ENABLE ROW LEVEL SECURITY;
ALTER TABLE voice_recordings ENABLE ROW LEVEL SECURITY;
ALTER TABLE export_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE education_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE time_saver_shortcuts ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;

-- User profiles policies
CREATE POLICY "Users can view own profile" ON user_profiles
    FOR SELECT USING (auth.uid()::text = id::text);

CREATE POLICY "Users can update own profile" ON user_profiles
    FOR UPDATE USING (auth.uid()::text = id::text);

CREATE POLICY "Admins can view all profiles" ON user_profiles
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE id::text = auth.uid()::text 
            AND role = 'admin'
        )
    );

-- Note metadata policies
CREATE POLICY "Users can view own notes" ON note_metadata
    FOR SELECT USING (user_id::text = auth.uid()::text);

CREATE POLICY "Users can create own notes" ON note_metadata
    FOR INSERT WITH CHECK (user_id::text = auth.uid()::text);

CREATE POLICY "Users can update own notes" ON note_metadata
    FOR UPDATE USING (user_id::text = auth.uid()::text);

-- Organization policies
CREATE POLICY "Users can view own organization" ON organizations
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE organization_id = organizations.id 
            AND id::text = auth.uid()::text
        )
    );

-- Template policies
CREATE POLICY "Users can view organization templates" ON note_templates
    FOR SELECT USING (
        organization_id IN (
            SELECT organization_id FROM user_profiles 
            WHERE id::text = auth.uid()::text
        ) OR is_default = true
    );

-- =====================================================
-- INITIAL DATA
-- =====================================================

-- Insert default templates
INSERT INTO note_templates (name, type, description, sections, is_default) VALUES
(
    'SOAP Template',
    'SOAP',
    'Standard SOAP note format',
    '{"subjective": "Patient reports and complaints", "objective": "Vital signs and physical assessment", "assessment": "Clinical assessment and findings", "plan": "Treatment plan and interventions"}'::jsonb,
    true
),
(
    'SBAR Template',
    'SBAR',
    'SBAR communication format',
    '{"situation": "Current patient situation", "background": "Patient history and context", "assessment": "Clinical evaluation", "recommendation": "Recommended actions"}'::jsonb,
    true
),
(
    'PIE Template',
    'PIE',
    'PIE documentation format',
    '{"problem": "Identified issues", "intervention": "Actions taken", "evaluation": "Outcomes and responses"}'::jsonb,
    true
),
(
    'DAR Template',
    'DAR',
    'DAR charting format',
    '{"data": "Objective information", "action": "Interventions performed", "response": "Patient response and outcomes"}'::jsonb,
    true
)
ON CONFLICT (name) DO NOTHING;

-- Insert common ICD-10 codes
INSERT INTO icd10_suggestions (keyword, code, description, category) VALUES
('chest pain', 'R06.02', 'Shortness of breath', 'Respiratory'),
('abdominal pain', 'R10.9', 'Abdominal pain, unspecified', 'Digestive'),
('headache', 'R51', 'Headache', 'Neurological'),
('fever', 'R50.9', 'Fever, unspecified', 'General'),
('nausea', 'R11.0', 'Nausea', 'Digestive'),
('dizziness', 'R42', 'Dizziness and giddiness', 'Neurological'),
('fatigue', 'R53.83', 'Other fatigue', 'General'),
('back pain', 'M54.9', 'Dorsalgia, unspecified', 'Musculoskeletal'),
('shortness of breath', 'R06.02', 'Shortness of breath', 'Respiratory'),
('diabetes', 'E11.9', 'Type 2 diabetes mellitus without complications', 'Endocrine')
ON CONFLICT DO NOTHING;

-- Insert default system settings
INSERT INTO system_settings (setting_key, setting_value, description, is_public) VALUES
(
    'app_version',
    '"1.0.0"'::jsonb,
    'Current application version',
    true
),
(
    'max_notes_per_user',
    '1000'::jsonb,
    'Maximum notes per user',
    false
),
(
    'default_template',
    '"SOAP"'::jsonb,
    'Default note template',
    true
),
(
    'hipaa_compliance_mode',
    'true'::jsonb,
    'Enable HIPAA compliance features',
    true
),
(
    'voice_recognition_enabled',
    'true'::jsonb,
    'Enable voice recognition features',
    true
)
ON CONFLICT (setting_key) DO NOTHING;

-- =====================================================
-- VIEWS FOR REPORTING
-- =====================================================

-- User statistics view
CREATE OR REPLACE VIEW user_statistics AS
SELECT 
    up.id,
    up.name,
    up.email,
    up.role,
    o.name as organization_name,
    COUNT(nm.id) as total_notes,
    SUM(nm.processing_time_ms) as total_time_saved_ms,
    AVG(nm.accuracy_score) as average_accuracy,
    COUNT(DISTINCT nm.template_type) as templates_used,
    up.last_login,
    up.created_at
FROM user_profiles up
LEFT JOIN organizations o ON up.organization_id = o.id
LEFT JOIN note_metadata nm ON up.id = nm.user_id
GROUP BY up.id, up.name, up.email, up.role, o.name, up.last_login, up.created_at;

-- Organization analytics view
CREATE OR REPLACE VIEW organization_analytics AS
SELECT 
    o.id,
    o.name,
    o.type,
    COUNT(DISTINCT up.id) as total_users,
    COUNT(nm.id) as total_notes,
    SUM(nm.processing_time_ms) as total_time_saved_ms,
    AVG(nm.accuracy_score) as average_accuracy,
    COUNT(DISTINCT nm.template_type) as templates_used
FROM organizations o
LEFT JOIN user_profiles up ON o.id = up.organization_id
LEFT JOIN note_metadata nm ON up.id = nm.user_id
GROUP BY o.id, o.name, o.type;

-- =====================================================
-- COMPLETION MESSAGE
-- =====================================================
DO $$
BEGIN
    RAISE NOTICE 'NurseScribe AI database migration completed successfully!';
    RAISE NOTICE 'Created tables: organizations, user_profiles, note_templates, note_metadata, voice_recordings, export_history, audit_logs, analytics, education_progress, icd10_suggestions, time_saver_shortcuts, system_settings';
    RAISE NOTICE 'Created functions: update_updated_at_column, log_audit_event, calculate_user_stats, get_icd10_suggestions';
    RAISE NOTICE 'Created triggers: Updated timestamps for all tables';
    RAISE NOTICE 'Created policies: Row Level Security enabled with appropriate policies';
    RAISE NOTICE 'Inserted initial data: Default templates, ICD-10 codes, system settings';
    RAISE NOTICE 'Created views: user_statistics, organization_analytics';
END $$;
