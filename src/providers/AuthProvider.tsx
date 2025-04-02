
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

type AuthContextType = {
  session: Session | null;
  user: User | null;
  loading: boolean;
  phoneVerified: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any | null }>;
  signInWithGoogle: () => Promise<{ error: any | null }>;
  signInWithPhone: (phone: string) => Promise<{ error: any | null }>;
  verifyOtp: (phone: string, token: string) => Promise<{ error: any | null }>;
  signUp: (email: string, password: string, metadata?: { [key: string]: any }) => Promise<{ error: any | null }>;
  signOut: () => Promise<void>;
  checkPhoneVerification: () => Promise<boolean>;
  setPhoneVerified: (value: boolean) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [phoneVerified, setPhoneVerified] = useState(false);
  const { toast } = useToast();

  const checkPhoneVerification = async (): Promise<boolean> => {
    if (!user) return false;
    
    const hasPhone = user.user_metadata?.phone !== undefined;
    
    setPhoneVerified(hasPhone || false);
    return hasPhone || false;
  };

  const ensureUserProfile = async (userId: string, userData: { name?: string, email: string, phone?: string }) => {
    try {
      console.log("Ensuring user profile exists for:", userId);
      
      const { data: existingProfile, error: checkError } = await supabase
        .from('user_profiles')
        .select('id')
        .eq('id', userId)
        .maybeSingle();
        
      if (checkError) throw checkError;
      
      if (existingProfile) {
        try {
          const { error: updateError } = await supabase
            .from('user_profiles')
            .update({
              name: userData.name || userData.email,
              email: userData.email,
              phone: userData.phone
            })
            .eq('id', userId);
            
          if (updateError) throw updateError;
        } catch (updateError) {
          console.error("Profile update failed, but continuing:", updateError);
          // Continue execution even if update fails
        }
      } else {
        try {
          const { error: insertError } = await supabase
            .from('user_profiles')
            .insert({
              id: userId,
              name: userData.name || userData.email,
              email: userData.email,
              phone: userData.phone
            });
            
          if (insertError) throw insertError;
        } catch (insertError) {
          console.error("Profile creation failed, but continuing:", insertError);
          
          // Store profile data in localStorage as fallback
          const fallbackProfile = {
            id: userId,
            name: userData.name || userData.email,
            email: userData.email,
            phone: userData.phone,
            created_at: new Date().toISOString()
          };
          
          localStorage.setItem(`userProfile-${userId}`, JSON.stringify(fallbackProfile));
          console.log("Saved profile to localStorage as fallback");
        }
      }
      
      console.log("User profile ensured successfully");
    } catch (error) {
      console.error("Error ensuring user profile:", error);
      
      // Store profile data in localStorage as fallback
      const fallbackProfile = {
        id: userId,
        name: userData.name || userData.email,
        email: userData.email,
        phone: userData.phone,
        created_at: new Date().toISOString()
      };
      
      localStorage.setItem(`userProfile-${userId}`, JSON.stringify(fallbackProfile));
      console.log("Saved profile to localStorage as fallback");
    }
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log('Auth state changed:', event);
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        if (currentSession?.user) {
          localStorage.setItem('isLoggedIn', 'true');
          localStorage.setItem('userId', currentSession.user.id);
          
          // Use setTimeout to avoid possible deadlocks with Supabase auth
          setTimeout(async () => {
            await ensureUserProfile(
              currentSession.user.id, 
              {
                name: currentSession.user.user_metadata?.name,
                email: currentSession.user.email || '',
                phone: currentSession.user.user_metadata?.phone
              }
            );
            
            await checkPhoneVerification();
          }, 100);
        } else {
          localStorage.removeItem('isLoggedIn');
          localStorage.removeItem('userId');
          setPhoneVerified(false);
        }
      }
    );

    supabase.auth.getSession().then(async ({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      
      if (currentSession?.user) {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userId', currentSession.user.id);
        
        // Use setTimeout to avoid possible deadlocks with Supabase auth
        setTimeout(async () => {
          await ensureUserProfile(
            currentSession.user.id, 
            {
              name: currentSession.user.user_metadata?.name,
              email: currentSession.user.email || '',
              phone: currentSession.user.user_metadata?.phone
            }
          );
          
          await checkPhoneVerification();
        }, 100);
      }
      
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { error, data } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      
      if (data?.user) {
        await ensureUserProfile(
          data.user.id, 
          {
            name: data.user.user_metadata?.name,
            email: data.user.email || '',
            phone: data.user.user_metadata?.phone
          }
        );
      }
      
      localStorage.setItem('isLoggedIn', 'true');
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
          redirectTo: window.location.origin + '/login',
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
      let formattedPhone = phone;
      if (!phone.startsWith('+')) {
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
      let formattedPhone = phone;
      if (!phone.startsWith('+')) {
        if (phone.startsWith('0')) {
          formattedPhone = '+972' + phone.substring(1);
        } else {
          formattedPhone = '+' + phone;
        }
      }

      const { error, data } = await supabase.auth.verifyOtp({
        phone: formattedPhone,
        token,
        type: 'sms',
      });
      
      if (error) throw error;
      
      if (user) {
        const { error: updateError } = await supabase.auth.updateUser({
          data: { 
            phone: formattedPhone
          }
        });
          
        if (updateError) {
          console.error('Error updating user metadata:', updateError);
        } else {
          setPhoneVerified(true);
          
          if (user.id) {
            await ensureUserProfile(
              user.id, 
              {
                name: user.user_metadata?.name,
                email: user.email || '',
                phone: formattedPhone
              }
            );
          }
        }
      }
      
      if (data?.user) {
        await ensureUserProfile(
          data.user.id, 
          {
            name: data.user.user_metadata?.name,
            email: data.user.email || '',
            phone: formattedPhone
          }
        );
      }
      
      localStorage.setItem('isLoggedIn', 'true');
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
      const { error, data } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
          emailRedirectTo: window.location.origin + '/login',
        },
      });
      if (error) throw error;
      
      if (data?.user) {
        await ensureUserProfile(
          data.user.id, 
          {
            name: metadata?.name || email,
            email: email,
            phone: metadata?.phone
          }
        );
      }
      
      localStorage.setItem('isLoggedIn', 'true');
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
      console.log("Attempting to sign out...");
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error("Error during sign out:", error);
        throw error;
      }
      
      console.log("Sign out successful");
      localStorage.removeItem('isLoggedIn');
      setPhoneVerified(false);
      
      setUser(null);
      setSession(null);
      
      toast({
        title: "יצאת מהמערכת",
        description: "התנתקת בהצלחה מהמערכת",
      });
      
      window.location.href = '/';
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
    phoneVerified,
    signIn,
    signInWithGoogle,
    signInWithPhone,
    verifyOtp,
    signUp,
    signOut,
    checkPhoneVerification,
    setPhoneVerified,
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
