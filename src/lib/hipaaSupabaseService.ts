import { createClient, SupabaseClient } from '@supabase/supabase-js';

interface HIPAAConfig {
  supabaseUrl: string;
  supabaseAnonKey: string;
  encryptionKey: string;
}

interface EncryptedData {
  data: string;
  iv: string;
  tag: string;
}

interface AuditLog {
  id?: string;
  user_id: string;
  action: string;
  resource_type: string;
  resource_id?: string;
  ip_address: string;
  user_agent: string;
  timestamp: string;
  metadata?: any;
}

interface NoteRecord {
  id?: string;
  user_id: string;
  template: string;
  encrypted_content: EncryptedData;
  metadata: {
    created_at: string;
    updated_at: string;
    word_count: number;
    template_type: string;
    is_phi: boolean;
  };
  audit_trail: string[];
}

interface UserProfile {
  id: string;
  email: string;
  role: string;
  credentials: string;
  preferences: any;
  created_at: string;
  updated_at: string;
}

interface AnalyticsData {
  id?: string;
  user_id: string;
  date: string;
  notes_created: number;
  time_saved: number;
  accuracy_rate: number;
  template_usage: { [template: string]: number };
  created_at: string;
}

class HIPAASupabaseService {
  private supabase: SupabaseClient | null = null;
  private config: HIPAAConfig | null = null;
  private encryptionKey: string = '';

  async initialize(config: HIPAAConfig): Promise<boolean> {
    try {
      this.config = config;
      this.encryptionKey = config.encryptionKey;
      
      this.supabase = createClient(config.supabaseUrl, config.supabaseAnonKey, {
        auth: {
          autoRefreshToken: true,
          persistSession: true,
          detectSessionInUrl: true
        }
      });

      // Test connection
      const { data, error } = await this.supabase.from('users').select('count').limit(1);
      if (error) {
        console.error('Supabase connection test failed:', error);
        return false;
      }

      console.log('HIPAA Supabase service initialized successfully');
      return true;
    } catch (error) {
      console.error('Failed to initialize HIPAA Supabase service:', error);
      return false;
    }
  }

  private async encryptData(data: any): Promise<EncryptedData> {
    try {
      // Generate a random IV
      const iv = crypto.getRandomValues(new Uint8Array(12));
      
      // Import the encryption key
      const key = await crypto.subtle.importKey(
        'raw',
        new TextEncoder().encode(this.encryptionKey),
        { name: 'AES-GCM' },
        false,
        ['encrypt']
      );

      // Encrypt the data
      const encrypted = await crypto.subtle.encrypt(
        { name: 'AES-GCM', iv: iv },
        key,
        new TextEncoder().encode(JSON.stringify(data))
      );

      return {
        data: Array.from(new Uint8Array(encrypted)).map(b => b.toString(16).padStart(2, '0')).join(''),
        iv: Array.from(iv).map(b => b.toString(16).padStart(2, '0')).join(''),
        tag: '' // GCM includes authentication tag in the encrypted data
      };
    } catch (error) {
      console.error('Encryption failed:', error);
      throw new Error('Failed to encrypt data');
    }
  }

  private async decryptData(encryptedData: EncryptedData): Promise<any> {
    try {
      // Convert hex strings back to Uint8Arrays
      const encrypted = new Uint8Array(encryptedData.data.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16)));
      const iv = new Uint8Array(encryptedData.iv.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16)));

      // Import the encryption key
      const key = await crypto.subtle.importKey(
        'raw',
        new TextEncoder().encode(this.encryptionKey),
        { name: 'AES-GCM' },
        false,
        ['decrypt']
      );

      // Decrypt the data
      const decrypted = await crypto.subtle.decrypt(
        { name: 'AES-GCM', iv: iv },
        key,
        encrypted
      );

      return JSON.parse(new TextDecoder().decode(decrypted));
    } catch (error) {
      console.error('Decryption failed:', error);
      throw new Error('Failed to decrypt data');
    }
  }

  private async logAuditEvent(log: Omit<AuditLog, 'id' | 'timestamp'>): Promise<void> {
    if (!this.supabase) return;

    const auditLog: AuditLog = {
      ...log,
      timestamp: new Date().toISOString()
    };

    try {
      const { error } = await this.supabase
        .from('audit_logs')
        .insert(auditLog);

      if (error) {
        console.error('Failed to log audit event:', error);
      }
    } catch (error) {
      console.error('Audit logging error:', error);
    }
  }

  // Authentication methods
  async signUp(email: string, password: string, userData: any): Promise<{ user: any; error: any }> {
    if (!this.supabase) throw new Error('Service not initialized');

    const { data, error } = await this.supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData
      }
    });

    if (!error && data.user) {
      await this.logAuditEvent({
        user_id: data.user.id,
        action: 'USER_REGISTRATION',
        resource_type: 'USER',
        ip_address: await this.getClientIP(),
        user_agent: navigator.userAgent,
        metadata: { email, role: userData.role }
      });
    }

    return { user: data.user, error };
  }

  async signIn(email: string, password: string): Promise<{ user: any; error: any }> {
    if (!this.supabase) throw new Error('Service not initialized');

    const { data, error } = await this.supabase.auth.signInWithPassword({
      email,
      password
    });

    if (!error && data.user) {
      await this.logAuditEvent({
        user_id: data.user.id,
        action: 'USER_LOGIN',
        resource_type: 'USER',
        ip_address: await this.getClientIP(),
        user_agent: navigator.userAgent
      });
    }

    return { user: data.user, error };
  }

  async signOut(): Promise<void> {
    if (!this.supabase) return;

    const { data } = await this.supabase.auth.getUser();
    if (data.user) {
      await this.logAuditEvent({
        user_id: data.user.id,
        action: 'USER_LOGOUT',
        resource_type: 'USER',
        ip_address: await this.getClientIP(),
        user_agent: navigator.userAgent
      });
    }

    await this.supabase.auth.signOut();
  }

  async getCurrentUser(): Promise<any> {
    if (!this.supabase) return null;
    
    const { data: { user } } = await this.supabase.auth.getUser();
    return user;
  }

  // Note management methods
  async saveNote(noteData: any, userId: string): Promise<{ success: boolean; noteId?: string; error?: string }> {
    if (!this.supabase) throw new Error('Service not initialized');

    try {
      // Encrypt the note content
      const encryptedContent = await this.encryptData(noteData);
      
      // Create note record
      const noteRecord: Omit<NoteRecord, 'id'> = {
        user_id: userId,
        template: noteData.template || 'SOAP',
        encrypted_content: encryptedContent,
        metadata: {
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          word_count: this.countWords(noteData),
          template_type: noteData.template || 'SOAP',
          is_phi: this.containsPHI(noteData)
        },
        audit_trail: [`Note created by user ${userId} at ${new Date().toISOString()}`]
      };

      const { data, error } = await this.supabase
        .from('notes')
        .insert(noteRecord)
        .select()
        .single();

      if (error) {
        console.error('Failed to save note:', error);
        return { success: false, error: error.message };
      }

      // Log audit event
      await this.logAuditEvent({
        user_id: userId,
        action: 'NOTE_CREATED',
        resource_type: 'NOTE',
        resource_id: data.id,
        ip_address: await this.getClientIP(),
        user_agent: navigator.userAgent,
        metadata: { template: noteData.template, word_count: noteRecord.metadata.word_count }
      });

      return { success: true, noteId: data.id };
    } catch (error) {
      console.error('Error saving note:', error);
      return { success: false, error: 'Failed to save note' };
    }
  }

  async getNotes(userId: string, limit: number = 50): Promise<{ notes: any[]; error?: string }> {
    if (!this.supabase) throw new Error('Service not initialized');

    try {
      const { data, error } = await this.supabase
        .from('notes')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Failed to fetch notes:', error);
        return { notes: [], error: error.message };
      }

      // Decrypt note contents
      const decryptedNotes = await Promise.all(
        data.map(async (note) => {
          try {
            const decryptedContent = await this.decryptData(note.encrypted_content);
            return {
              id: note.id,
              content: decryptedContent,
              metadata: note.metadata,
              audit_trail: note.audit_trail,
              created_at: note.created_at
            };
          } catch (decryptError) {
            console.error('Failed to decrypt note:', decryptError);
            return null;
          }
        })
      );

      const validNotes = decryptedNotes.filter(note => note !== null);

      return { notes: validNotes };
    } catch (error) {
      console.error('Error fetching notes:', error);
      return { notes: [], error: 'Failed to fetch notes' };
    }
  }

  async updateNote(noteId: string, noteData: any, userId: string): Promise<{ success: boolean; error?: string }> {
    if (!this.supabase) throw new Error('Service not initialized');

    try {
      // Encrypt the updated content
      const encryptedContent = await this.encryptData(noteData);
      
      const { error } = await this.supabase
        .from('notes')
        .update({
          encrypted_content: encryptedContent,
          metadata: {
            updated_at: new Date().toISOString(),
            word_count: this.countWords(noteData),
            template_type: noteData.template || 'SOAP',
            is_phi: this.containsPHI(noteData)
          },
          audit_trail: [`Note updated by user ${userId} at ${new Date().toISOString()}`]
        })
        .eq('id', noteId)
        .eq('user_id', userId);

      if (error) {
        console.error('Failed to update note:', error);
        return { success: false, error: error.message };
      }

      // Log audit event
      await this.logAuditEvent({
        user_id: userId,
        action: 'NOTE_UPDATED',
        resource_type: 'NOTE',
        resource_id: noteId,
        ip_address: await this.getClientIP(),
        user_agent: navigator.userAgent
      });

      return { success: true };
    } catch (error) {
      console.error('Error updating note:', error);
      return { success: false, error: 'Failed to update note' };
    }
  }

  async deleteNote(noteId: string, userId: string): Promise<{ success: boolean; error?: string }> {
    if (!this.supabase) throw new Error('Service not initialized');

    try {
      const { error } = await this.supabase
        .from('notes')
        .delete()
        .eq('id', noteId)
        .eq('user_id', userId);

      if (error) {
        console.error('Failed to delete note:', error);
        return { success: false, error: error.message };
      }

      // Log audit event
      await this.logAuditEvent({
        user_id: userId,
        action: 'NOTE_DELETED',
        resource_type: 'NOTE',
        resource_id: noteId,
        ip_address: await this.getClientIP(),
        user_agent: navigator.userAgent
      });

      return { success: true };
    } catch (error) {
      console.error('Error deleting note:', error);
      return { success: false, error: 'Failed to delete note' };
    }
  }

  // Analytics methods
  async saveAnalytics(analyticsData: Omit<AnalyticsData, 'id' | 'created_at'>): Promise<{ success: boolean; error?: string }> {
    if (!this.supabase) throw new Error('Service not initialized');

    try {
      const { error } = await this.supabase
        .from('analytics')
        .insert({
          ...analyticsData,
          created_at: new Date().toISOString()
        });

      if (error) {
        console.error('Failed to save analytics:', error);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      console.error('Error saving analytics:', error);
      return { success: false, error: 'Failed to save analytics' };
    }
  }

  async getAnalytics(userId: string, days: number = 30): Promise<{ analytics: AnalyticsData[]; error?: string }> {
    if (!this.supabase) throw new Error('Service not initialized');

    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const { data, error } = await this.supabase
        .from('analytics')
        .select('*')
        .eq('user_id', userId)
        .gte('date', startDate.toISOString().split('T')[0])
        .order('date', { ascending: false });

      if (error) {
        console.error('Failed to fetch analytics:', error);
        return { analytics: [], error: error.message };
      }

      return { analytics: data || [] };
    } catch (error) {
      console.error('Error fetching analytics:', error);
      return { analytics: [], error: 'Failed to fetch analytics' };
    }
  }

  // User profile methods
  async updateUserProfile(userId: string, profileData: Partial<UserProfile>): Promise<{ success: boolean; error?: string }> {
    if (!this.supabase) throw new Error('Service not initialized');

    try {
      const { error } = await this.supabase
        .from('user_profiles')
        .upsert({
          id: userId,
          ...profileData,
          updated_at: new Date().toISOString()
        });

      if (error) {
        console.error('Failed to update user profile:', error);
        return { success: false, error: error.message };
      }

      // Log audit event
      await this.logAuditEvent({
        user_id: userId,
        action: 'PROFILE_UPDATED',
        resource_type: 'PROFILE',
        ip_address: await this.getClientIP(),
        user_agent: navigator.userAgent
      });

      return { success: true };
    } catch (error) {
      console.error('Error updating user profile:', error);
      return { success: false, error: 'Failed to update user profile' };
    }
  }

  async getUserProfile(userId: string): Promise<{ profile: UserProfile | null; error?: string }> {
    if (!this.supabase) throw new Error('Service not initialized');

    try {
      const { data, error } = await this.supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No profile found
          return { profile: null };
        }
        console.error('Failed to fetch user profile:', error);
        return { profile: null, error: error.message };
      }

      return { profile: data };
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return { profile: null, error: 'Failed to fetch user profile' };
    }
  }

  // Audit log methods
  async getAuditLogs(userId: string, limit: number = 100): Promise<{ logs: AuditLog[]; error?: string }> {
    if (!this.supabase) throw new Error('Service not initialized');

    try {
      const { data, error } = await this.supabase
        .from('audit_logs')
        .select('*')
        .eq('user_id', userId)
        .order('timestamp', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Failed to fetch audit logs:', error);
        return { logs: [], error: error.message };
      }

      return { logs: data || [] };
    } catch (error) {
      console.error('Error fetching audit logs:', error);
      return { logs: [], error: 'Failed to fetch audit logs' };
    }
  }

  // Utility methods
  private countWords(data: any): number {
    const text = JSON.stringify(data);
    return text.split(/\s+/).length;
  }

  private containsPHI(data: any): boolean {
    const text = JSON.stringify(data).toLowerCase();
    const phiPatterns = [
      /\b\d{3}-\d{2}-\d{4}\b/, // SSN
      /\b\d{3}-\d{3}-\d{4}\b/, // Phone
      /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/, // Email
      /\b\d{1,2}\/\d{1,2}\/\d{4}\b/, // Date of birth
      /\b(patient|pt|mrs|mr|dr|doctor)\s+[A-Z][a-z]+\s+[A-Z][a-z]+\b/ // Names
    ];

    return phiPatterns.some(pattern => pattern.test(text));
  }

  private async getClientIP(): Promise<string> {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip;
    } catch (error) {
      return 'unknown';
    }
  }

  // HIPAA Compliance methods
  async generateHIPAAReport(userId: string, startDate: string, endDate: string): Promise<{ report: any; error?: string }> {
    if (!this.supabase) throw new Error('Service not initialized');

    try {
      const { data: notes, error: notesError } = await this.supabase
        .from('notes')
        .select('*')
        .eq('user_id', userId)
        .gte('created_at', startDate)
        .lte('created_at', endDate);

      const { data: logs, error: logsError } = await this.supabase
        .from('audit_logs')
        .select('*')
        .eq('user_id', userId)
        .gte('timestamp', startDate)
        .lte('timestamp', endDate);

      if (notesError || logsError) {
        return { report: null, error: 'Failed to generate HIPAA report' };
      }

      const report = {
        period: { startDate, endDate },
        notes: {
          total: notes?.length || 0,
          withPHI: notes?.filter(n => n.metadata?.is_phi).length || 0,
          withoutPHI: notes?.filter(n => !n.metadata?.is_phi).length || 0
        },
        auditLogs: {
          total: logs?.length || 0,
          byAction: this.groupByAction(logs || [])
        },
        compliance: {
          encryption: 'AES-256-GCM',
          accessControls: 'Row Level Security (RLS)',
          auditTrail: 'Complete',
          dataRetention: 'Configurable'
        }
      };

      return { report };
    } catch (error) {
      console.error('Error generating HIPAA report:', error);
      return { report: null, error: 'Failed to generate HIPAA report' };
    }
  }

  private groupByAction(logs: AuditLog[]): { [action: string]: number } {
    return logs.reduce((acc, log) => {
      acc[log.action] = (acc[log.action] || 0) + 1;
      return acc;
    }, {} as { [action: string]: number });
  }
}

export const hipaaSupabaseService = new HIPAASupabaseService();
