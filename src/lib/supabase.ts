/**
 * Supabase Integration for Metadata Storage
 * Handles non-PHI data storage, user management, and analytics
 */

export interface SupabaseConfig {
  url: string;
  anonKey: string;
  encrypted: boolean;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'nurse' | 'instructor' | 'student' | 'auditor';
  department: string;
  organization_id: string;
  hipaa_training_completed: boolean;
  hipaa_training_date?: string;
  status?: 'active' | 'invited' | 'suspended';
  last_login?: string;
  created_at: string;
  updated_at: string;
}

export interface Organization {
  id: string;
  name: string;
  type: 'hospital' | 'clinic' | 'nursing_school' | 'private_practice';
  hipaa_compliant: boolean;
  settings: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface Department {
  id: string;
  organization_id: string;
  name: string;
  code: string;
  hipaa_level: 'full' | 'limited' | 'none';
  created_at: string;
  updated_at: string;
}

export interface UserDepartmentLink {
  user_id: string;
  department_id: string;
}

export interface NoteMetadata {
  id: string;
  user_id: string;
  organization_id: string;
  template: string;
  duration_seconds: number;
  time_saved_minutes: number;
  redaction_count: number;
  created_at: string;
  template_version: string;
  ai_model_used: string;
  confidence_score: number;
}

export interface AnalyticsEvent {
  id: string;
  user_id: string;
  organization_id: string;
  event_type: string;
  event_data: Record<string, any>;
  timestamp: string;
  session_id: string;
}

export interface EducationProgress {
  id: string;
  user_id: string;
  case_id: string;
  session_id: string;
  score: number;
  time_spent_minutes: number;
  completed_at: string;
  feedback: string[];
}

export interface AuditLog {
  id: string;
  user_id: string;
  organization_id: string;
  action: string;
  resource: string;
  ip_address: string;
  user_agent: string;
  success: boolean;
  details: Record<string, any>;
  risk_level: 'low' | 'medium' | 'high' | 'critical';
  timestamp: string;
}

class SupabaseService {
  private config: SupabaseConfig | null = null;
  private supabase: any = null;
  private isInitialized = false;

  /**
   * Initialize Supabase connection
   */
  async initialize(config: SupabaseConfig): Promise<void> {
    try {
      console.log('🔗 Initializing Supabase connection...');
      this.config = config;
      
      // Validate config
      if (!config.url || !config.anonKey) {
        throw new Error('Supabase configuration missing URL or anon key');
      }
      
      // Import Supabase client
      const { createClient } = await import('@supabase/supabase-js');
      
      this.supabase = createClient(config.url, config.anonKey, {
        auth: {
          autoRefreshToken: true,
          persistSession: true,
          detectSessionInUrl: true
        },
        realtime: {
          params: {
            eventsPerSecond: 10
          }
        },
        global: {
          headers: {
            'X-Client-Info': 'nursescribe-ai-v1.4.0'
          }
        }
      });

      console.log('✅ Supabase client created successfully');
      
      // Test connection with a simpler approach
      await this.testConnection();
      
      this.isInitialized = true;
      console.log('🎉 Supabase initialized successfully');
      
    } catch (error: any) {
      console.error('❌ Supabase initialization failed:', error);
      
      // Log specific error details for debugging
      if (error.message) {
        console.error('Error message:', error.message);
      }
      if (error.code) {
        console.error('Error code:', error.code);
      }
      
      // Don't throw error to prevent app from breaking
      console.warn('⚠️ Continuing without Supabase integration');
      this.isInitialized = false;
    }
  }

  /**
   * Test Supabase connection
   */
  private async testConnection(): Promise<void> {
    if (!this.supabase) {
      throw new Error('Supabase not initialized');
    }

    try {
      console.log('🔍 Testing Supabase connection...');
      
      // Try a simple ping first - just check if we can reach the API
      // Use the auth service to test basic connectivity
      const { data, error } = await this.supabase.auth.getSession();

      if (error) {
        // Handle auth service errors gracefully
        if (error.message?.includes('Invalid API key') || error.message?.includes('401')) {
          console.log('⚠️ Supabase API key issue - continuing without full integration');
          return;
        } else if (error.message?.includes('500') || error.code === '500') {
          console.log('⚠️ Supabase server error (500) - continuing without connection test');
          return;
        } else {
          console.log('⚠️ Supabase connection test failed - continuing without full integration');
          return;
        }
      }
      
      console.log('✅ Supabase connection test passed with data:', data);
    } catch (error: any) {
      console.error('❌ Supabase connection test failed:', error);
      
      // Log the specific error for debugging
      if (error.message) {
        console.error('Connection test error message:', error.message);
      }
      if (error.code) {
        console.error('Connection test error code:', error.code);
      }
      
      // Don't throw error for any connection issues - just warn and continue
      console.warn('⚠️ Supabase connection test failed - continuing without full integration');
      return;
    }
  }

  /**
   * Check if Supabase is available
   */
  isAvailable(): boolean {
    return this.isInitialized && this.supabase !== null;
  }

  /**
   * Organizations
   */
  async getOrganizations(): Promise<Organization[]> {
    if (!this.isAvailable()) {
      return [];
    }

    try {
      const { data, error } = await this.supabase
        .from('organizations')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;
      return (data || []).map((org: any) => ({
        ...org,
        settings: org.settings || {}
      })) as Organization[];
    } catch (error) {
      console.error('Failed to fetch organizations:', error);
      return [];
    }
  }

  async getOrganizationById(id: string): Promise<Organization | null> {
    if (!this.isAvailable()) {
      return null;
    }

    try {
      const { data, error } = await this.supabase
        .from('organizations')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data ? { ...data, settings: data.settings || {} } : null;
    } catch (error) {
      console.error('Failed to fetch organization:', error);
      return null;
    }
  }

  async updateOrganization(id: string, updates: Partial<Pick<Organization, 'name' | 'type' | 'hipaa_compliant'>> & { settings?: Record<string, any> }): Promise<Organization | null> {
    if (!this.isAvailable()) {
      return null;
    }

    try {
      const payload: any = { ...updates };
      if (updates.settings !== undefined) {
        payload.settings = updates.settings;
      }

      const { data, error } = await this.supabase
        .from('organizations')
        .update(payload)
        .eq('id', id)
        .select('*')
        .single();

      if (error) throw error;
      return data ? { ...data, settings: data.settings || {} } : null;
    } catch (error) {
      console.error('Failed to update organization:', error);
      return null;
    }
  }

  /**
   * User Management
   */

  /**
   * Create or update user profile
   */
  async upsertUserProfile(profile: Partial<UserProfile>): Promise<UserProfile> {
    if (!this.isAvailable()) {
      throw new Error('Supabase not available');
    }

    try {
      const { data, error } = await this.supabase
        .from('user_profiles')
        .upsert(profile, { onConflict: 'id' })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Failed to upsert user profile:', error);
      throw error;
    }
  }

  /**
   * Get user profile
   */
  async getUserProfile(userId: string): Promise<UserProfile | null> {
    if (!this.isAvailable()) {
      return null;
    }

    try {
      const { data, error } = await this.supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data;
    } catch (error) {
      console.error('Failed to get user profile:', error);
      return null;
    }
  }

  async getUserProfilesByOrganization(organizationId: string): Promise<UserProfile[]> {
    if (!this.isAvailable()) {
      return [];
    }

    try {
      const { data, error } = await this.supabase
        .from('user_profiles')
        .select('*')
        .eq('organization_id', organizationId)
        .order('name', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Failed to list user profiles:', error);
      return [];
    }
  }

  async createUserProfile(profile: {
    email: string;
    name: string;
    role: UserProfile['role'];
    organization_id: string;
    status?: 'active' | 'inactive' | 'suspended';
    department?: string | null;
  }): Promise<UserProfile | null> {
    if (!this.isAvailable()) {
      return null;
    }

    try {
      const { data, error } = await this.supabase
        .from('user_profiles')
        .insert({
          ...profile,
          status: profile.status ?? 'inactive'
        })
        .select('*')
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Failed to create user profile:', error);
      return null;
    }
  }

  async updateUserProfile(userId: string, updates: Partial<UserProfile>): Promise<UserProfile | null> {
    if (!this.isAvailable()) {
      return null;
    }

    try {
      const payload = { ...updates };
      const { data, error } = await this.supabase
        .from('user_profiles')
        .update(payload)
        .eq('id', userId)
        .select('*')
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Failed to update user profile:', error);
      return null;
    }
  }

  /**
   * Organization Management
   */

  /**
   * Create or update organization
   */
  async upsertOrganization(org: Partial<Organization>): Promise<Organization> {
    if (!this.isAvailable()) {
      throw new Error('Supabase not available');
    }

    try {
      const { data, error } = await this.supabase
        .from('organizations')
        .upsert(org, { onConflict: 'id' })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Failed to upsert organization:', error);
      throw error;
    }
  }

  /**
   * Get organization
   */
  async getOrganization(orgId: string): Promise<Organization | null> {
    if (!this.isAvailable()) {
      return null;
    }

    try {
      const { data, error } = await this.supabase
        .from('organizations')
        .select('*')
        .eq('id', orgId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data;
    } catch (error) {
      console.error('Failed to get organization:', error);
      return null;
    }
  }

  /**
   * Note Metadata Storage
   */

  async getDepartments(organizationId: string): Promise<Department[]> {
    if (!this.isAvailable()) {
      return [];
    }

    try {
      const { data, error } = await this.supabase
        .from('departments')
        .select('*')
        .eq('organization_id', organizationId)
        .order('name', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Failed to fetch departments:', error);
      return [];
    }
  }

  async createDepartment(organizationId: string, payload: { name: string; code: string; hipaa_level?: Department['hipaa_level'] }): Promise<Department | null> {
    if (!this.isAvailable()) {
      return null;
    }

    try {
      const { data, error } = await this.supabase
        .from('departments')
        .insert({
          organization_id: organizationId,
          hipaa_level: payload.hipaa_level ?? 'full',
          ...payload
        })
        .select('*')
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Failed to create department:', error);
      return null;
    }
  }

  async getUserDepartmentLinks(organizationId: string): Promise<UserDepartmentLink[]> {
    if (!this.isAvailable()) {
      return [];
    }

    try {
      const departments = await this.getDepartments(organizationId);
      if (departments.length === 0) return [];

      const departmentIds = departments.map(dept => dept.id);
      const { data, error } = await this.supabase
        .from('user_departments')
        .select('*')
        .in('department_id', departmentIds);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Failed to fetch user departments:', error);
      return [];
    }
  }

  async setUserDepartments(userId: string, departmentIds: string[]): Promise<void> {
    if (!this.isAvailable()) {
      return;
    }

    try {
      await this.supabase
        .from('user_departments')
        .delete()
        .eq('user_id', userId);

      if (departmentIds.length === 0) {
        return;
      }

      const rows = departmentIds.map(departmentId => ({ user_id: userId, department_id: departmentId }));
      const { error } = await this.supabase
        .from('user_departments')
        .insert(rows);

      if (error) throw error;
    } catch (error) {
      console.error('Failed to update user departments:', error);
    }
  }

  /**
   * Store note metadata (non-PHI)
   */
  async storeNoteMetadata(metadata: Partial<NoteMetadata>): Promise<NoteMetadata> {
    if (!this.isAvailable()) {
      throw new Error('Supabase not available');
    }

    try {
      const { data, error } = await this.supabase
        .from('note_metadata')
        .insert(metadata)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Failed to store note metadata:', error);
      throw error;
    }
  }

  /**
   * Get note metadata for user
   */
  async getUserNoteMetadata(userId: string, limit: number = 50): Promise<NoteMetadata[]> {
    if (!this.isAvailable()) {
      return [];
    }

    try {
      const { data, error } = await this.supabase
        .from('note_metadata')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Failed to get note metadata:', error);
      return [];
    }
  }

  async getOrganizationNoteMetadata(organizationId: string, limit: number = 100): Promise<NoteMetadata[]> {
    if (!this.isAvailable()) {
      return [];
    }

    try {
      const { data, error } = await this.supabase
        .from('note_metadata')
        .select('*')
        .eq('organization_id', organizationId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Failed to get organization note metadata:', error);
      return [];
    }
  }

  /**
   * Analytics Events
   */

  /**
   * Store analytics event
   */
  async storeAnalyticsEvent(event: Partial<AnalyticsEvent>): Promise<AnalyticsEvent> {
    if (!this.isAvailable()) {
      throw new Error('Supabase not available');
    }

    try {
      const { data, error } = await this.supabase
        .from('analytics_events')
        .insert(event)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Failed to store analytics event:', error);
      throw error;
    }
  }

  /**
   * Get analytics events for user
   */
  async getUserAnalyticsEvents(userId: string, days: number = 30): Promise<AnalyticsEvent[]> {
    if (!this.isAvailable()) {
      return [];
    }

    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const { data, error } = await this.supabase
        .from('analytics_events')
        .select('*')
        .eq('user_id', userId)
        .gte('timestamp', startDate.toISOString())
        .order('timestamp', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Failed to get analytics events:', error);
      return [];
    }
  }

  async getAnalyticsEventsByOrganization(organizationId: string, since?: Date): Promise<AnalyticsEvent[]> {
    if (!this.isAvailable()) {
      return [];
    }

    try {
      let query = this.supabase
        .from('analytics_events')
        .select('*')
        .eq('organization_id', organizationId)
        .order('timestamp', { ascending: false });

      if (since) {
        query = query.gte('timestamp', since.toISOString());
      }

      const { data, error } = await query;

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Failed to get organization analytics events:', error);
      return [];
    }
  }

  /**
   * Education Progress
   */

  /**
   * Store education progress
   */
  async storeEducationProgress(progress: Partial<EducationProgress>): Promise<EducationProgress> {
    if (!this.isAvailable()) {
      throw new Error('Supabase not available');
    }

    try {
      const { data, error } = await this.supabase
        .from('education_progress')
        .insert(progress)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Failed to store education progress:', error);
      throw error;
    }
  }

  /**
   * Get education progress for user
   */
  async getUserEducationProgress(userId: string): Promise<EducationProgress[]> {
    if (!this.isAvailable()) {
      return [];
    }

    try {
      const { data, error } = await this.supabase
        .from('education_progress')
        .select('*')
        .eq('user_id', userId)
        .order('completed_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Failed to get education progress:', error);
      return [];
    }
  }

  /**
   * Audit Logs
   */

  /**
   * Store audit log entry
   */
  async storeAuditLog(log: Partial<AuditLog>): Promise<AuditLog> {
    if (!this.isAvailable()) {
      throw new Error('Supabase not available');
    }

    try {
      const { data, error } = await this.supabase
        .from('audit_logs')
        .insert(log)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Failed to store audit log:', error);
      throw error;
    }
  }

  /**
   * Get audit logs for organization
   */
  async getOrganizationAuditLogs(orgId: string, limit: number = 100): Promise<AuditLog[]> {
    if (!this.isAvailable()) {
      return [];
    }

    try {
      const { data, error } = await this.supabase
        .from('audit_logs')
        .select('*')
        .eq('organization_id', orgId)
        .order('timestamp', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Failed to get audit logs:', error);
      return [];
    }
  }

  /**
   * Real-time Subscriptions
   */

  /**
   * Subscribe to analytics events
   */
  subscribeToAnalyticsEvents(userId: string, callback: (event: AnalyticsEvent) => void): () => void {
    if (!this.isAvailable()) {
      return () => {};
    }

    const subscription = this.supabase
      .channel('analytics-events')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'analytics_events',
        filter: `user_id=eq.${userId}`
      }, (payload: any) => {
        callback(payload.new);
      })
      .subscribe();

    return () => {
      this.supabase.removeChannel(subscription);
    };
  }

  /**
   * Subscribe to audit logs
   */
  subscribeToAuditLogs(orgId: string, callback: (log: AuditLog) => void): () => void {
    if (!this.isAvailable()) {
      return () => {};
    }

    const subscription = this.supabase
      .channel('audit-logs')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'audit_logs',
        filter: `organization_id=eq.${orgId}`
      }, (payload: any) => {
        callback(payload.new);
      })
      .subscribe();

    return () => {
      this.supabase.removeChannel(subscription);
    };
  }

  /**
   * Data Export
   */

  /**
   * Export user data
   */
  async exportUserData(userId: string): Promise<{
    profile: UserProfile | null;
    notes: NoteMetadata[];
    analytics: AnalyticsEvent[];
    education: EducationProgress[];
  }> {
    const [profile, notes, analytics, education] = await Promise.all([
      this.getUserProfile(userId),
      this.getUserNoteMetadata(userId, 1000),
      this.getUserAnalyticsEvents(userId, 365),
      this.getUserEducationProgress(userId)
    ]);

    return {
      profile,
      notes,
      analytics,
      education
    };
  }

  /**
   * Batch Operations
   */

  /**
   * Batch insert analytics events
   */
  async batchInsertAnalyticsEvents(events: Partial<AnalyticsEvent>[]): Promise<AnalyticsEvent[]> {
    if (!this.isAvailable()) {
      throw new Error('Supabase not available');
    }

    try {
      const { data, error } = await this.supabase
        .from('analytics_events')
        .insert(events)
        .select();

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Failed to batch insert analytics events:', error);
      throw error;
    }
  }

  /**
   * Batch insert note metadata
   */
  async batchInsertNoteMetadata(metadata: Partial<NoteMetadata>[]): Promise<NoteMetadata[]> {
    if (!this.isAvailable()) {
      throw new Error('Supabase not available');
    }

    try {
      const { data, error } = await this.supabase
        .from('note_metadata')
        .insert(metadata)
        .select();

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Failed to batch insert note metadata:', error);
      throw error;
    }
  }

  /**
   * Health Check
   */

  /**
   * Check Supabase health
   */
  async healthCheck(): Promise<{
    status: 'healthy' | 'unhealthy';
    latency: number;
    error?: string;
  }> {
    const startTime = Date.now();
    
    try {
      await this.testConnection();
      const latency = Date.now() - startTime;
      
      return {
        status: 'healthy',
        latency
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        latency: Date.now() - startTime,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Configuration
   */

  /**
   * Get current configuration
   */
  getConfig(): SupabaseConfig | null {
    return this.config;
  }

  /**
   * Update configuration
   */
  async updateConfig(config: SupabaseConfig): Promise<void> {
    await this.initialize(config);
  }
}

// Export singleton instance
export const supabaseService = new SupabaseService();
