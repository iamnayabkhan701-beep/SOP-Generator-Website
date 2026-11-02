import React, { createContext, useContext, useEffect, useState } from 'react';
import type { User, Session } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isConfigured: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: Error | null }>;
  signInWithGoogle: () => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: Error | null }>;
}

const DEMO_USER: User = {
  id: 'demo-user-1234-5678-90ab-cdef12345678',
  app_metadata: {},
  user_metadata: { full_name: 'Demo SOP Specialist' },
  aud: 'authenticated',
  created_at: new Date().toISOString(),
  email: 'demo@sopify.ai',
  role: 'authenticated',
  updated_at: new Date().toISOString(),
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const isConfigured = isSupabaseConfigured();

  useEffect(() => {
    if (!isConfigured) {
      // If Supabase is not connected yet, check if user was logged in via local demo
      const savedDemo = localStorage.getItem('sop_demo_logged_in');
      if (savedDemo === 'true') {
        setUser(DEMO_USER);
      }
      setIsLoading(false);
      return;
    }

    // 1. Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    // 2. Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [isConfigured]);

  const signIn = async (email: string, password: string) => {
    if (!isConfigured) {
      // Demo authentication
      if (password.length >= 6) {
        const demo: User = {
          ...DEMO_USER,
          email,
          user_metadata: { full_name: email.split('@')[0] || 'User' },
        };
        setUser(demo);
        localStorage.setItem('sop_demo_logged_in', 'true');
        return { error: null };
      } else {
        return { error: new Error('Password must be at least 6 characters.') };
      }
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error: error ? new Error(error.message) : null };
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    if (!isConfigured) {
      const demo: User = {
        ...DEMO_USER,
        email,
        user_metadata: { full_name: fullName },
      };
      setUser(demo);
      localStorage.setItem('sop_demo_logged_in', 'true');
      return { error: null };
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });
    return { error: error ? new Error(error.message) : null };
  };

  const signInWithGoogle = async () => {
    if (!isConfigured) {
      const demo: User = {
        ...DEMO_USER,
        email: 'google.demo@sopify.ai',
        user_metadata: { full_name: 'Google User (Demo)' },
      };
      setUser(demo);
      localStorage.setItem('sop_demo_logged_in', 'true');
      return { error: null };
    }

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    });
    return { error: error ? new Error(error.message) : null };
  };

  const signOut = async () => {
    if (!isConfigured) {
      setUser(null);
      localStorage.removeItem('sop_demo_logged_in');
      return;
    }
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
  };

  const resetPassword = async (email: string) => {
    if (!isConfigured) {
      return { error: null };
    }
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/settings`,
    });
    return { error: error ? new Error(error.message) : null };
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isLoading,
        isConfigured,
        signIn,
        signUp,
        signInWithGoogle,
        signOut,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

