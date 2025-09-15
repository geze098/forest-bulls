'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { notifications } from '@mantine/notifications';
import type { UserProfile, UserRole } from '@/types';

interface AuthContextType {
  // Auth state
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  loading: boolean;
  
  // Auth methods
  signUp: (email: string, password: string, userData: Partial<UserProfile>) => Promise<{ user: User | null; error: AuthError | null }>;
  signIn: (email: string, password: string) => Promise<{ user: User | null; error: AuthError | null }>;
  signOut: () => Promise<{ error: AuthError | null }>;
  resetPassword: (email: string) => Promise<{ error: AuthError | null }>;
  updatePassword: (password: string) => Promise<{ error: AuthError | null }>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<{ error: Error | null }>;
  
  // Utility methods
  hasRole: (roles: UserRole | UserRole[]) => boolean;
  isOwner: boolean;
  isAdmin: boolean;
  isClient: boolean;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch user profile from database
  const fetchProfile = async (userId: string): Promise<UserProfile | null> => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return null;
      }

      return data as UserProfile;
    } catch (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
  };

  // Refresh profile data
  const refreshProfile = async () => {
    if (user) {
      const profileData = await fetchProfile(user.id);
      setProfile(profileData);
    }
  };

  // Initialize auth state
  useEffect(() => {
    let mounted = true;

    // Get initial user (secure method)
    const initializeAuth = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        
        if (error) {
          // Only log non-session-missing errors as actual errors
          if (error.message !== 'Auth session missing!') {
            console.error('Error getting user:', error);
          }
        }

        if (mounted) {
          setUser(user);
          
          // Get session separately if needed for other purposes
          // Handle case where session might not exist
          try {
            const { data: { session }, error: sessionError } = await supabase.auth.getSession();
            if (sessionError) {
              console.warn('Session not available:', sessionError.message);
              setSession(null);
            } else {
              setSession(session);
            }
          } catch (sessionError) {
            console.warn('Could not retrieve session:', sessionError);
            setSession(null);
          }

          if (user) {
            const profileData = await fetchProfile(user.id);
            setProfile(profileData);
          }

          setLoading(false);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;

        console.log('Auth state changed:', event, session?.user?.id);

        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          const profileData = await fetchProfile(session.user.id);
          setProfile(profileData);
        } else {
          setProfile(null);
        }

        setLoading(false);

        // Handle auth events
        switch (event) {
          case 'SIGNED_IN':
            notifications.show({
              title: 'Welcome back!',
              message: 'You have been successfully signed in.',
              color: 'green',
            });
            break;
          case 'SIGNED_OUT':
            notifications.show({
              title: 'Signed out',
              message: 'You have been successfully signed out.',
              color: 'blue',
            });
            break;
          case 'PASSWORD_RECOVERY':
            notifications.show({
              title: 'Password reset',
              message: 'Please check your email for password reset instructions.',
              color: 'blue',
            });
            break;
          case 'USER_UPDATED':
            notifications.show({
              title: 'Profile updated',
              message: 'Your profile has been successfully updated.',
              color: 'green',
            });
            break;
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // Sign up method
  const signUp = async (email: string, password: string, userData: Partial<UserProfile>) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: userData.first_name,
            last_name: userData.last_name,
            phone: userData.phone,
            role: userData.role || 'client',
          },
        },
      });

      if (error) {
        notifications.show({
          title: 'Sign up failed',
          message: error.message,
          color: 'red',
        });
        return { user: null, error };
      }

      if (data.user && !data.session) {
        notifications.show({
          title: 'Check your email',
          message: 'Please check your email for a verification link.',
          color: 'blue',
        });
      }

      return { user: data.user, error: null };
    } catch (error) {
      const authError = error as AuthError;
      notifications.show({
        title: 'Sign up failed',
        message: authError.message || 'An unexpected error occurred',
        color: 'red',
      });
      return { user: null, error: authError };
    }
  };

  // Sign in method
  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        notifications.show({
          title: 'Sign in failed',
          message: error.message,
          color: 'red',
        });
        return { user: null, error };
      }

      return { user: data.user, error: null };
    } catch (error) {
      const authError = error as AuthError;
      notifications.show({
        title: 'Sign in failed',
        message: authError.message || 'An unexpected error occurred',
        color: 'red',
      });
      return { user: null, error: authError };
    }
  };

  // Sign out method
  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        notifications.show({
          title: 'Sign out failed',
          message: error.message,
          color: 'red',
        });
        return { error };
      }

      return { error: null };
    } catch (error) {
      const authError = error as AuthError;
      notifications.show({
        title: 'Sign out failed',
        message: authError.message || 'An unexpected error occurred',
        color: 'red',
      });
      return { error: authError };
    }
  };

  // Reset password method
  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      if (error) {
        notifications.show({
          title: 'Password reset failed',
          message: error.message,
          color: 'red',
        });
        return { error };
      }

      notifications.show({
        title: 'Password reset sent',
        message: 'Please check your email for password reset instructions.',
        color: 'green',
      });

      return { error: null };
    } catch (error) {
      const authError = error as AuthError;
      notifications.show({
        title: 'Password reset failed',
        message: authError.message || 'An unexpected error occurred',
        color: 'red',
      });
      return { error: authError };
    }
  };

  // Update password method
  const updatePassword = async (password: string) => {
    try {
      const { error } = await supabase.auth.updateUser({ password });

      if (error) {
        notifications.show({
          title: 'Password update failed',
          message: error.message,
          color: 'red',
        });
        return { error };
      }

      notifications.show({
        title: 'Password updated',
        message: 'Your password has been successfully updated.',
        color: 'green',
      });

      return { error: null };
    } catch (error) {
      const authError = error as AuthError;
      notifications.show({
        title: 'Password update failed',
        message: authError.message || 'An unexpected error occurred',
        color: 'red',
      });
      return { error: authError };
    }
  };

  // Update profile method
  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) {
      return { error: new Error('No user logged in') };
    }

    try {
      const { error } = await supabase
        .from('users')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', user.id);

      if (error) {
        notifications.show({
          title: 'Profile update failed',
          message: error.message,
          color: 'red',
        });
        return { error: new Error(error.message) };
      }

      // Refresh profile data
      await refreshProfile();

      notifications.show({
        title: 'Profile updated',
        message: 'Your profile has been successfully updated.',
        color: 'green',
      });

      return { error: null };
    } catch (error) {
      const err = error as Error;
      notifications.show({
        title: 'Profile update failed',
        message: err.message || 'An unexpected error occurred',
        color: 'red',
      });
      return { error: err };
    }
  };

  // Utility methods
  const hasRole = (roles: UserRole | UserRole[]): boolean => {
    if (!profile?.role) return false;
    const roleArray = Array.isArray(roles) ? roles : [roles];
    return roleArray.includes(profile.role);
  };

  const isOwner = profile?.role === 'owner' || profile?.role === 'administrator';
  const isAdmin = profile?.role === 'administrator';
  const isClient = profile?.role === 'client';

  const value: AuthContextType = {
    user,
    session,
    profile,
    loading,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updatePassword,
    updateProfile,
    hasRole,
    isOwner,
    isAdmin,
    isClient,
    refreshProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// HOC for protecting components
export function withAuth<P extends object>(
  Component: React.ComponentType<P>,
  requiredRoles?: UserRole[]
) {
  return function AuthenticatedComponent(props: P) {
    const { user, profile, loading } = useAuth();

    if (loading) {
      return <div>Loading...</div>;
    }

    if (!user) {
      return <div>Please sign in to access this page.</div>;
    }

    if (requiredRoles && profile && !requiredRoles.includes(profile.role)) {
      return <div>You don't have permission to access this page.</div>;
    }

    return <Component {...props} />;
  };
}

// Hook for role-based access control
export function useRoleAccess(requiredRoles: UserRole | UserRole[]) {
  const { profile, hasRole } = useAuth();
  
  return {
    hasAccess: hasRole(requiredRoles),
    userRole: profile?.role,
  };
}