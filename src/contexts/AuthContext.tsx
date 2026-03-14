// @ts-nocheck
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ error: any }>;
  logout: () => Promise<void>;
  roles?: string[];
  isAdmin?: boolean;
  signInWithOAuth?: (provider: string) => Promise<{ provider: any; url: string } | void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [roles, setRoles] = useState<string[]>([]);

  useEffect(() => {
    const getSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user ?? null);
        
        // Mock roles for now
        setRoles(session?.user ? ['user'] : []);
      } catch (error) {
        console.error('Error getting session:', error);
        // ignore
      }

      setLoading(false);
    };

    getSession();

    // Listen for changes on auth state (sign in, sign out, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null);
      setRoles(session?.user ? ['user'] : []);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      return { error };
    } catch (error) {
      console.error('Login Error:', error);
      return { error };
    }
  };

  const signInWithOAuth = async (provider: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: provider as any,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      
      if (error) {
        console.error('OAuth Error:', error);
        throw error;
      }
      
      return data;
    } catch (error) {
      console.error('OAuth Sign In Error:', error);
      throw error;
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, roles, isAdmin: roles.includes('admin'), signInWithOAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    // Return fallback for SSR instead of throwing error
    return {
      user: null,
      loading: false,
      login: async () => ({ error: null }),
      logout: async () => {},
      roles: [],
      isAdmin: false,
      signInWithOAuth: async () => ({ provider: null, url: '' }),
    };
  }
  return context;
};
