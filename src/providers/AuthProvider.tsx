
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

type AuthContextType = {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any | null }>;
  signInWithGoogle: () => Promise<{ error: any | null }>;
  signInWithPhone: (phone: string) => Promise<{ error: any | null }>;
  verifyOtp: (phone: string, token: string) => Promise<{ error: any | null }>;
  signUp: (email: string, password: string, metadata?: { [key: string]: any }) => Promise<{ error: any | null }>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Set up the auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        console.log('Auth state changed:', event);
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        // Store login status in localStorage for components that check it
        if (currentSession?.user) {
          localStorage.setItem('isLoggedIn', 'true');
        } else {
          localStorage.removeItem('isLoggedIn');
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      
      if (currentSession?.user) {
        localStorage.setItem('isLoggedIn', 'true');
      }
      
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      return { error: null };
    } catch (error) {
      console.error('Error signing in:', error);
      toast({
        title: "התחברות נכשלה",
        description: error.message || "אירעה שגיאה בהתחברות, אנא נסה שוב",
        variant: "destructive",
      });
      return { error };
    }
  };

  const signInWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
        },
      });
      if (error) throw error;
      return { error: null };
    } catch (error) {
      console.error('Error signing in with Google:', error);
      toast({
        title: "התחברות נכשלה",
        description: error.message || "אירעה שגיאה בהתחברות עם Google, אנא נסה שוב",
        variant: "destructive",
      });
      return { error };
    }
  };

  const signInWithPhone = async (phone: string) => {
    try {
      // Format phone number to E.164 format if needed
      let formattedPhone = phone;
      if (!phone.startsWith('+')) {
        // Israeli phone numbers: add +972 prefix and remove leading 0
        if (phone.startsWith('0')) {
          formattedPhone = '+972' + phone.substring(1);
        } else {
          formattedPhone = '+' + phone;
        }
      }

      const { error } = await supabase.auth.signInWithOtp({
        phone: formattedPhone,
      });
      if (error) throw error;
      return { error: null };
    } catch (error) {
      console.error('Error signing in with phone:', error);
      toast({
        title: "שליחת קוד אימות נכשלה",
        description: error.message || "אירעה שגיאה בשליחת קוד האימות, אנא נסה שוב",
        variant: "destructive",
      });
      return { error };
    }
  };

  const verifyOtp = async (phone: string, token: string) => {
    try {
      // Format phone number to E.164 format if needed
      let formattedPhone = phone;
      if (!phone.startsWith('+')) {
        // Israeli phone numbers: add +972 prefix and remove leading 0
        if (phone.startsWith('0')) {
          formattedPhone = '+972' + phone.substring(1);
        } else {
          formattedPhone = '+' + phone;
        }
      }

      const { error } = await supabase.auth.verifyOtp({
        phone: formattedPhone,
        token,
        type: 'sms',
      });
      if (error) throw error;
      return { error: null };
    } catch (error) {
      console.error('Error verifying OTP:', error);
      toast({
        title: "אימות קוד נכשל",
        description: error.message || "אירעה שגיאה באימות הקוד, אנא נסה שוב",
        variant: "destructive",
      });
      return { error };
    }
  };

  const signUp = async (email: string, password: string, metadata?: { [key: string]: any }) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
          emailRedirectTo: window.location.origin,
        },
      });
      if (error) throw error;
      return { error: null };
    } catch (error) {
      console.error('Error signing up:', error);
      toast({
        title: "ההרשמה נכשלה",
        description: error.message || "אירעה שגיאה בהרשמה, אנא נסה שוב",
        variant: "destructive",
      });
      return { error };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      localStorage.removeItem('isLoggedIn');
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        title: "יציאה נכשלה",
        description: "אירעה שגיאה ביציאה מהמערכת, אנא נסה שוב",
        variant: "destructive",
      });
    }
  };

  const value = {
    session,
    user,
    loading,
    signIn,
    signInWithGoogle,
    signInWithPhone,
    verifyOtp,
    signUp,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
