/**
 * Supabase Profile Service
 * Manages user profiles and data storage in Supabase
 */

import { supabaseService } from './supabase';
import { toast } from 'sonner';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

export interface UserProfile {
  id: string;
  user_id: string;
  name: string;
  email: string;
  role: string;
  credentials: string;
  phone?: string;
  location?: string;
  avatar_url?: string;
  join_date: string;
  status?: 'active' | 'invited' | 'suspended';
  last_login?: string;
  preferences: {
    notifications: boolean;
    voiceSpeed: number;
    defaultTemplate: string;
    autoSave: boolean;
    darkMode: boolean;
    language: string;
  };
  stats: {
    totalNotes: number;
    timeSaved: number;
    accuracy: number;
    weeklyGoal: number;
    notesThisWeek: number;
  };
  achievements: Array<{
    id: string;
    title: string;
    description: string;
    icon: string;
    unlockedAt: string;
  }>;
  created_at: string;
  updated_at: string;
}

export interface CarePlanRecord {
  id: string;
  user_id: string;
  patient_id?: string;
  diagnosis_code: string;
  diagnosis_name: string;
  severity: string;
  care_plan_data: any;
  status: 'active' | 'completed' | 'discontinued';
  created_at: string;
  updated_at: string;
}

export interface PredictiveInsightRecord {
  id: string;
  user_id: string;
  note_id?: string;
  insight_type: string;
  severity: string;
  title: string;
  description: string;
  indicators: string[];
  recommendations: string[];
  confidence: number;
  acknowledged: boolean;
  action_taken?: string;
  created_at: string;
}

class SupabaseProfileService {
  private get supabase(): any {
    // Access the supabase client from supabaseService
    return (supabaseService as any).supabase;
  }

  /**
   * Get user profile by user ID
   */
  public async getProfile(userId: string): Promise<UserProfile | null> {
    if (!supabaseService.isAvailable()) {
      console.warn('Supabase not available');
      return null;
    }

    try {
      const { data, error } = await this.supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // Profile doesn't exist yet
          return null;
        }
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
  }

  /**
   * Create new user profile
   */
  public async createProfile(profile: Omit<UserProfile, 'id' | 'created_at' | 'updated_at'>): Promise<UserProfile | null> {
    if (!supabaseService.isAvailable()) {
      toast.error('Database not available');
      return null;
    }

    try {
      const { data, error } = await this.supabase
        .from('user_profiles')
        .insert([{
          ...profile,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) throw error;

      toast.success('Profile created successfully');
      return data;
    } catch (error) {
      console.error('Error creating profile:', error);
      toast.error('Failed to create profile');
      return null;
    }
  }

  /**
   * Update user profile
   */
  public async updateProfile(userId: string, updates: Partial<UserProfile>): Promise<boolean> {
    if (!supabaseService.isAvailable()) {
      toast.error('Database not available');
      return false;
    }

    try {
      const { error } = await this.supabase
        .from('user_profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId);

      if (error) throw error;

      toast.success('Profile updated successfully');
      return true;
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
      return false;
    }
  }

  /**
   * Update preferences
   */
  public async updatePreferences(
    userId: string,
    preferences: Partial<UserProfile['preferences']>
  ): Promise<boolean> {
    try {
      // First get current profile
      const profile = await this.getProfile(userId);
      if (!profile) return false;

      // Merge preferences
      const updatedPreferences = {
        ...profile.preferences,
        ...preferences
      };

      // Update in database
      const { error } = await this.supabase
        .from('user_profiles')
        .update({
          preferences: updatedPreferences,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId);

      if (error) throw error;

      toast.success('Preferences updated');
      return true;
    } catch (error) {
      console.error('Error updating preferences:', error);
      toast.error('Failed to update preferences');
      return false;
    }
  }

  /**
   * Update stats
   */
  public async updateStats(
    userId: string,
    stats: Partial<UserProfile['stats']>
  ): Promise<boolean> {
    try {
      const profile = await this.getProfile(userId);
      if (!profile) return false;

      const updatedStats = {
        ...profile.stats,
        ...stats
      };

      const { error } = await this.supabase
        .from('user_profiles')
        .update({
          stats: updatedStats,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId);

      if (error) throw error;

      return true;
    } catch (error) {
      console.error('Error updating stats:', error);
      return false;
    }
  }

  /**
   * Add achievement
   */
  public async addAchievement(
    userId: string,
    achievement: {
      id: string;
      title: string;
      description: string;
      icon: string;
    }
  ): Promise<boolean> {
    try {
      const profile = await this.getProfile(userId);
      if (!profile) return false;

      // Check if achievement already exists
      if (profile.achievements.some(a => a.id === achievement.id)) {
        return true;
      }

      const updatedAchievements = [
        ...profile.achievements,
        {
          ...achievement,
          unlockedAt: new Date().toISOString()
        }
      ];

      const { error } = await this.supabase
        .from('user_profiles')
        .update({
          achievements: updatedAchievements,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId);

      if (error) throw error;

      toast.success(`Achievement unlocked: ${achievement.title}!`, {
        description: achievement.description
      });

      return true;
    } catch (error) {
      console.error('Error adding achievement:', error);
      return false;
    }
  }

  /**
   * Save care plan
   */
  public async saveCarePlan(carePlan: Omit<CarePlanRecord, 'id' | 'created_at' | 'updated_at'>): Promise<string | null> {
    if (!supabaseService.isAvailable()) {
      toast.error('Database not available');
      return null;
    }

    try {
      const { data, error } = await this.supabase
        .from('care_plans')
        .insert([{
          ...carePlan,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select('id')
        .single();

      if (error) throw error;

      toast.success('Care plan saved');
      return data.id;
    } catch (error) {
      console.error('Error saving care plan:', error);
      toast.error('Failed to save care plan');
      return null;
    }
  }

  /**
   * Get user's care plans
   */
  public async getCarePlans(userId: string): Promise<CarePlanRecord[]> {
    if (!supabaseService.isAvailable()) {
      return [];
    }

    try {
      const { data, error } = await this.supabase
        .from('care_plans')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('Error fetching care plans:', error);
      return [];
    }
  }

  /**
   * Update care plan
   */
  public async updateCarePlan(planId: string, updates: Partial<CarePlanRecord>): Promise<boolean> {
    if (!supabaseService.isAvailable()) {
      return false;
    }

    try {
      const { error } = await this.supabase
        .from('care_plans')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', planId);

      if (error) throw error;

      return true;
    } catch (error) {
      console.error('Error updating care plan:', error);
      return false;
    }
  }

  /**
   * Save predictive insight
   */
  public async saveInsight(insight: Omit<PredictiveInsightRecord, 'id' | 'created_at'>): Promise<string | null> {
    if (!supabaseService.isAvailable()) {
      return null;
    }

    try {
      const { data, error } = await this.supabase
        .from('predictive_insights')
        .insert([{
          ...insight,
          created_at: new Date().toISOString()
        }])
        .select('id')
        .single();

      if (error) throw error;

      return data.id;
    } catch (error) {
      console.error('Error saving insight:', error);
      return null;
    }
  }

  /**
   * Get user's insights
   */
  public async getInsights(userId: string): Promise<PredictiveInsightRecord[]> {
    if (!supabaseService.isAvailable()) {
      return [];
    }

    try {
      const { data, error } = await this.supabase
        .from('predictive_insights')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('Error fetching insights:', error);
      return [];
    }
  }

  /**
   * Acknowledge insight
   */
  public async acknowledgeInsight(insightId: string, actionTaken?: string): Promise<boolean> {
    if (!supabaseService.isAvailable()) {
      return false;
    }

    try {
      const { error } = await this.supabase
        .from('predictive_insights')
        .update({
          acknowledged: true,
          action_taken: actionTaken
        })
        .eq('id', insightId);

      if (error) throw error;

      return true;
    } catch (error) {
      console.error('Error acknowledging insight:', error);
      return false;
    }
  }

  /**
   * Increment note count
   */
  public async incrementNoteCount(userId: string): Promise<void> {
    try {
      const profile = await this.getProfile(userId);
      if (!profile) return;

      await this.updateStats(userId, {
        totalNotes: profile.stats.totalNotes + 1,
        notesThisWeek: profile.stats.notesThisWeek + 1
      });
    } catch (error) {
      console.error('Error incrementing note count:', error);
    }
  }

  /**
   * Add time saved
   */
  public async addTimeSaved(userId: string, minutes: number): Promise<void> {
    try {
      const profile = await this.getProfile(userId);
      if (!profile) return;

      await this.updateStats(userId, {
        timeSaved: profile.stats.timeSaved + minutes
      });
    } catch (error) {
      console.error('Error adding time saved:', error);
    }
  }

  /**
   * Upload avatar
   */
  public async uploadAvatar(userId: string, file: File): Promise<string | null> {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}-${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const { error: uploadError } = await this.supabase.storage
        .from('user-avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = this.supabase.storage
        .from('user-avatars')
        .getPublicUrl(filePath);

      // Update profile with new avatar URL
      await this.updateProfile(userId, {
        avatar_url: data.publicUrl
      } as Partial<UserProfile>);

      toast.success('Avatar uploaded successfully');
      return data.publicUrl;
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast.error('Failed to upload avatar');
      return null;
    }
  }
}

// Export singleton
export const supabaseProfileService = new SupabaseProfileService();
