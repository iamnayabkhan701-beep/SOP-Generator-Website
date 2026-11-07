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

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper to hash passwords using standard Web Crypto API (SHA-256)
async function hashPassword(password: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

interface StoredLocalUser {
  id: string;
  email: string;
  fullName: string;
  passwordHash: string;
  createdAt: string;
}

const LOCAL_USERS_KEY = 'sop_registered_accounts';
const ACTIVE_SESSION_KEY = 'sop_active_user_session';

function getLocalUsers(): StoredLocalUser[] {
  try {
    const raw = localStorage.getItem(LOCAL_USERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocalUsers(users: StoredLocalUser[]) {
  try {
    localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(users));
  } catch (e) {
    console.error('Failed to save accounts', e);
  }
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const isConfigured = isSupabaseConfigured();

  useEffect(() => {
    if (!isConfigured) {
      // Check if user has an active authenticated session
      try {
        const rawSession = localStorage.getItem(ACTIVE_SESSION_KEY);
        if (rawSession) {
          const parsed = JSON.parse(rawSession);
          if (parsed && parsed.id && parsed.email) {
            setUser({
              id: parsed.id,
              app_metadata: {},
              user_metadata: { full_name: parsed.fullName || parsed.email.split('@')[0] },
              aud: 'authenticated',
              created_at: parsed.createdAt || new Date().toISOString(),
              email: parsed.email,
              role: 'authenticated',
              updated_at: new Date().toISOString(),
            });
          }
        }
      } catch (e) {
        console.error('Session retrieval error:', e);
      }
      setIsLoading(false);
      return;
    }

    // 1. Check active Supabase session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    // 2. Listen for Supabase auth state changes
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
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail || !password) {
      return { error: new Error('Please enter both email address and password.') };
    }

    if (!isConfigured) {
      // Local authenticated verification with SHA-256 hash
      const users = getLocalUsers();
      const userRecord = users.find((u) => u.email.toLowerCase() === cleanEmail);

      if (!userRecord) {
        return { error: new Error('No account found with this email. Please create an account.') };
      }

      const inputHash = await hashPassword(password);
      if (inputHash !== userRecord.passwordHash) {
        return { error: new Error('Invalid email or password. Please try again.') };
      }

      const authenticatedUser: User = {
        id: userRecord.id,
        app_metadata: {},
        user_metadata: { full_name: userRecord.fullName },
        aud: 'authenticated',
        created_at: userRecord.createdAt,
        email: userRecord.email,
        role: 'authenticated',
        updated_at: new Date().toISOString(),
      };

      setUser(authenticatedUser);
      localStorage.setItem(
        ACTIVE_SESSION_KEY,
        JSON.stringify({
          id: userRecord.id,
          email: userRecord.email,
          fullName: userRecord.fullName,
          createdAt: userRecord.createdAt,
        })
      );

      return { error: null };
    }

    const { error } = await supabase.auth.signInWithPassword({
      email: cleanEmail,
      password,
    });
    return { error: error ? new Error(error.message) : null };
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail || !password || !fullName.trim()) {
      return { error: new Error('Please fill in all registration fields.') };
    }

    if (password.length < 6) {
      return { error: new Error('Password must be at least 6 characters in length.') };
    }

    if (!isConfigured) {
      const users = getLocalUsers();
      const existing = users.find((u) => u.email.toLowerCase() === cleanEmail);
      if (existing) {
        return { error: new Error('An account with this email address already exists. Please log in.') };
      }

      const passwordHash = await hashPassword(password);
      const newUserId = crypto.randomUUID();
      const now = new Date().toISOString();

      const newAccount: StoredLocalUser = {
        id: newUserId,
        email: cleanEmail,
        fullName: fullName.trim(),
        passwordHash,
        createdAt: now,
      };

      users.push(newAccount);
      saveLocalUsers(users);

      const authenticatedUser: User = {
        id: newUserId,
        app_metadata: {},
        user_metadata: { full_name: fullName.trim() },
        aud: 'authenticated',
        created_at: now,
        email: cleanEmail,
        role: 'authenticated',
        updated_at: now,
      };

      setUser(authenticatedUser);
      localStorage.setItem(
        ACTIVE_SESSION_KEY,
        JSON.stringify({
          id: newUserId,
          email: cleanEmail,
          fullName: fullName.trim(),
          createdAt: now,
        })
      );

      return { error: null };
    }

    const { error } = await supabase.auth.signUp({
      email: cleanEmail,
      password,
      options: {
        data: {
          full_name: fullName.trim(),
        },
      },
    });
    return { error: error ? new Error(error.message) : null };
  };

  const signInWithGoogle = async () => {
    try {
      if (!isConfigured) {
        return {
          error: new Error(
            'Google Sign-In requires Supabase OAuth credentials. Please configure Supabase in the Admin Panel or sign in with your email and password.'
          ),
        };
      }

      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
          queryParams: {
            access_type: 'offline',
            prompt: 'select_account',
          },
        },
      });
      return { error: error ? new Error(error.message) : null };
    } catch (err: any) {
      return { error: new Error(err?.message || 'Failed to initialize Google authentication.') };
    }
  };

  const signOut = async () => {
    if (!isConfigured) {
      setUser(null);
      localStorage.removeItem(ACTIVE_SESSION_KEY);
      return;
    }
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
  };

  const resetPassword = async (email: string) => {
    const cleanEmail = email.trim().toLowerCase();
    if (!isConfigured) {
      const users = getLocalUsers();
      const found = users.some((u) => u.email.toLowerCase() === cleanEmail);
      if (!found) {
        return { error: new Error('No registered account found with that email address.') };
      }
      return { error: null };
    }
    const { error } = await supabase.auth.resetPasswordForEmail(cleanEmail, {
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
