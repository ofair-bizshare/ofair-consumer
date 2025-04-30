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
    
    // Check if user has a phone number in user_metadata
    const hasPhone = user.user_metadata?.phone !== undefined && 
                   user.user_metadata?.phone !== null && 
                   user.user_metadata?.phone !== '';
    
    setPhoneVerified(hasPhone || false);
    return hasPhone || false;
  };

  const ensureUserProfile = async (userId: string, userData: { name?: string, email: string, phone?: string }) => {
    try {
      console.log("Ensuring user profile exists for:", userId);
      
      const localProfile = localStorage.getItem(`userProfile-${userId}`);
      let existingLocalProfile = null;
      
      if (localProfile) {
        try {
          existingLocalProfile = JSON.parse(localProfile);
          console.log("Found local profile:", existingLocalProfile);
        } catch (e) {
          console.error("Error parsing local profile:", e);
        }
      }
      
      if (existingLocalProfile) {
        const updatedLocalProfile = {
          ...existingLocalProfile,
          name: userData.name || existingLocalProfile.name || userData.email,
          email: userData.email || existingLocalProfile.email,
          phone: userData.phone || existingLocalProfile.phone,
          updated_at: new Date().toISOString()
        };
        
        localStorage.setItem(`userProfile-${userId}`, JSON.stringify(updatedLocalProfile));
      } else {
        const newLocalProfile = {
          id: userId,
          name: userData.name || userData.email,
          email: userData.email,
          phone: userData.phone,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        
        localStorage.setItem(`userProfile-${userId}`, JSON.stringify(newLocalProfile));
        console.log("New profile saved to localStorage");
      }
      
      try {
        const { data: existingProfile, error: checkError } = await supabase
          .from('user_profiles')
          .select('id')
          .eq('id', userId)
          .maybeSingle();
          
        if (checkError) {
          console.log("Error checking profile, proceeding with localStorage only:", checkError);
          return;
        }
        
        if (existingProfile) {
          const { error: updateError } = await supabase
            .from('user_profiles')
            .update({
              name: userData.name || userData.email,
              email: userData.email,
              phone: userData.phone,
              updated_at: new Date().toISOString()
            })
            .eq('id', userId);
            
          if (updateError) {
            console.log("Profile update failed, continuing with localStorage:", updateError);
          } else {
            console.log("Profile updated in database successfully");
          }
        } else {
          const { error: insertError } = await supabase
            .from('user_profiles')
            .insert({
              id: userId,
              name: userData.name || userData.email,
              email: userData.email,
              phone: userData.phone
            });
            
          if (insertError) {
            console.log("Profile creation failed, continuing with localStorage:", insertError);
          } else {
            console.log("Profile created in database successfully");
          }
        }
      } catch (dbError) {
        console.error("Error ensuring user profile in database:", dbError);
        console.log("Continuing with localStorage profile only");
      }
      
      console.log("User profile ensured successfully");
    } catch (error) {
      console.error("Error in profile management:", error);
      const fallbackProfile = {
        id: userId,
        name: userData.name || userData.email,
        email: userData.email,
        phone: userData.phone,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      localStorage.setItem(`userProfile-${userId}`, JSON.stringify(fallbackProfile));
      console.log("Saved profile to localStorage as fallback");
    }
  };

  const handleOAuthRedirect = async () => {
    if (window.location.hash && window.location.hash.includes('access_token')) {
      try {
        console.log("Detected OAuth redirect with hash, attempting to process");
        
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Error processing OAuth redirect:", error);
          throw error;
        }
        
        if (data?.session) {
          console.log("Successfully processed OAuth redirect session");
          
          window.history.replaceState({}, document.title, window.location.pathname);
          
          return data.session;
        } else {
          console.log("No session found after OAuth redirect");
        }
      } catch (error) {
        console.error("Error handling OAuth redirect:", error);
        toast({
          title: "שגיאת התחברות",
          description: "אירעה שגיאה בעת עיבוד ההתחברות, אנא נסה שוב",
          variant: "destructive",
        });
      }
    }
    return null;
  };

  const initAuth = async () => {
    try {
      const oauthSession = await handleOAuthRedirect();
      
      if (oauthSession) {
        setSession(oauthSession);
        setUser(oauthSession.user);
        
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userId', oauthSession.user.id);
        
        setTimeout(async () => {
          await ensureUserProfile(
            oauthSession.user.id, 
            {
              name: oauthSession.user.user_metadata?.name,
              email: oauthSession.user.email || '',
              phone: oauthSession.user.user_metadata?.phone
            }
          );
          
          await checkPhoneVerification();
        }, 100);
      } else {
        const { data } = await supabase.auth.getSession();
        
        if (data?.session) {
          setSession(data.session);
          setUser(data.session.user);
          
          localStorage.setItem('isLoggedIn', 'true');
          localStorage.setItem('userId', data.session.user.id);
          
          setTimeout(async () => {
            await ensureUserProfile(
              data.session.user.id, 
              {
                name: data.session.user.user_metadata?.name,
                email: data.session.user.email || '',
                phone: data.session.user.user_metadata?.phone
              }
            );
            
            await checkPhoneVerification();
          }, 100);
        }
      }
    } catch (error) {
      console.error("Error initializing auth:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    initAuth();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log('Auth state changed:', event);
        
        if ((currentSession?.user?.id !== user?.id) || event === 'SIGNED_OUT') {
          setSession(currentSession);
          setUser(currentSession?.user ?? null);
          
          if (currentSession?.user) {
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('userId', currentSession.user.id);
            
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
      }
    );

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
          redirectTo: window.location.origin + '/dashboard',
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
