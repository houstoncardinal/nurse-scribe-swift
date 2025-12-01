import { supabaseService } from './supabase';

export interface User {
  id: string;
  email: string;
  name?: string;
  role?: 'admin' | 'nurse' | 'instructor' | 'student' | 'auditor';
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

class AuthService {
  private authState: AuthState = {
    user: null,
    isLoading: true,
    isAuthenticated: false
  };

  private listeners: ((state: AuthState) => void)[] = [];

  constructor() {
    this.initialize();
  }

  private async initialize() {
    try {
      // Get initial session
      const { data: { session }, error } = await supabaseService.getSupabaseClient().auth.getSession();

      if (error) {
        console.error('Error getting session:', error);
        this.setAuthState({ user: null, isLoading: false, isAuthenticated: false });
        return;
      }

      if (session?.user) {
        const user = await this.buildUserFromSession(session.user);
        this.setAuthState({ user, isLoading: false, isAuthenticated: true });
      } else {
        this.setAuthState({ user: null, isLoading: false, isAuthenticated: false });
      }

      // Listen for auth changes
      supabaseService.getSupabaseClient().auth.onAuthStateChange(async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);

        if (session?.user) {
          const user = await this.buildUserFromSession(session.user);
          this.setAuthState({ user, isLoading: false, isAuthenticated: true });
        } else {
          this.setAuthState({ user: null, isLoading: false, isAuthenticated: false });
        }
      });
    } catch (error) {
      console.error('Auth initialization error:', error);
      this.setAuthState({ user: null, isLoading: false, isAuthenticated: false });
    }
  }

  private async buildUserFromSession(authUser: any): Promise<User> {
    // First try to get user profile from our profiles table
    let profile = await supabaseService.getUserProfile(authUser.id);

    // If no profile exists, create one
    if (!profile) {
      const newProfile = {
        id: authUser.id,
        email: authUser.email!,
        name: authUser.user_metadata?.name || authUser.user_metadata?.full_name || 'User',
        role: 'nurse' as const,
        status: 'active' as const
      };

      profile = await supabaseService.upsertUserProfile(newProfile);
    }

    return {
      id: authUser.id,
      email: authUser.email!,
      name: profile?.name || authUser.user_metadata?.name || authUser.user_metadata?.full_name,
      role: profile?.role,
      avatar_url: authUser.user_metadata?.avatar_url,
      created_at: authUser.created_at,
      updated_at: profile?.updated_at || authUser.updated_at
    };
  }

  private setAuthState(state: AuthState) {
    this.authState = state;
    this.listeners.forEach(listener => listener(state));
  }

  // Public methods
  getAuthState(): AuthState {
    return { ...this.authState };
  }

  subscribe(listener: (state: AuthState) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  async signIn(email: string, password: string): Promise<{ user: User | null; error: string | null }> {
    try {
      this.setAuthState({ ...this.authState, isLoading: true });

      const { data, error } = await supabaseService.getSupabaseClient().auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        this.setAuthState({ ...this.authState, isLoading: false });
        return { user: null, error: error.message };
      }

      if (data.user) {
        const user = await this.buildUserFromSession(data.user);
        return { user, error: null };
      }

      return { user: null, error: 'Sign in failed' };
    } catch (error: any) {
      this.setAuthState({ ...this.authState, isLoading: false });
      return { user: null, error: error.message || 'Sign in failed' };
    }
  }

  async signUp(email: string, password: string, name?: string): Promise<{ user: User | null; error: string | null }> {
    try {
      this.setAuthState({ ...this.authState, isLoading: true });

      const { data, error } = await supabaseService.getSupabaseClient().auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name || email.split('@')[0]
          }
        }
      });

      if (error) {
        this.setAuthState({ ...this.authState, isLoading: false });
        return { user: null, error: error.message };
      }

      if (data.user) {
        // Create profile for new user
        const profile = await supabaseService.upsertUserProfile({
          id: data.user.id,
          email: data.user.email!,
          name: name || data.user.user_metadata?.name || email.split('@')[0],
          role: 'nurse',
          status: 'active'
        });

        const user: User = {
          id: data.user.id,
          email: data.user.email!,
          name: profile?.name,
          role: profile?.role,
          avatar_url: data.user.user_metadata?.avatar_url,
          created_at: data.user.created_at,
          updated_at: profile?.updated_at || data.user.updated_at
        };

        return { user, error: null };
      }

      return { user: null, error: 'Sign up failed' };
    } catch (error: any) {
      this.setAuthState({ ...this.authState, isLoading: false });
      return { user: null, error: error.message || 'Sign up failed' };
    }
  }

  async signInWithGoogle(): Promise<{ user: User | null; error: string | null }> {
    try {
      this.setAuthState({ ...this.authState, isLoading: true });

      const { data, error } = await supabaseService.getSupabaseClient().auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/app`
        }
      });

      if (error) {
        this.setAuthState({ ...this.authState, isLoading: false });
        return { user: null, error: error.message };
      }

      // OAuth will redirect, so we don't need to return user here
      return { user: null, error: null };
    } catch (error: any) {
      this.setAuthState({ ...this.authState, isLoading: false });
      return { user: null, error: error.message || 'Google sign in failed' };
    }
  }

  async signOut(): Promise<{ error: string | null }> {
    try {
      const { error } = await supabaseService.getSupabaseClient().auth.signOut();

      if (error) {
        return { error: error.message };
      }

      this.setAuthState({ user: null, isLoading: false, isAuthenticated: false });
      return { error: null };
    } catch (error: any) {
      return { error: error.message || 'Sign out failed' };
    }
  }

  async resetPassword(email: string): Promise<{ error: string | null }> {
    try {
      const { error } = await supabaseService.getSupabaseClient().auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth`
      });

      if (error) {
        return { error: error.message };
      }

      return { error: null };
    } catch (error: any) {
      return { error: error.message || 'Password reset failed' };
    }
  }

  async updateProfile(updates: Partial<User>): Promise<{ user: User | null; error: string | null }> {
    if (!this.authState.user) {
      return { user: null, error: 'Not authenticated' };
    }

    try {
      const profile = await supabaseService.updateUserProfile(this.authState.user.id, updates);

      if (profile) {
        const updatedUser: User = {
          ...this.authState.user,
          ...updates,
          updated_at: profile.updated_at
        };

        this.setAuthState({
          ...this.authState,
          user: updatedUser
        });

        return { user: updatedUser, error: null };
      }

      return { user: null, error: 'Profile update failed' };
    } catch (error: any) {
      return { user: null, error: error.message || 'Profile update failed' };
    }
  }
}

// Export singleton instance
export const authService = new AuthService();
