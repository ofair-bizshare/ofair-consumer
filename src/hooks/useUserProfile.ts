import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/providers/AuthProvider';
import { UserProfileInterface } from '@/types/dashboard';
import { useToast } from './use-toast';

export const useUserProfile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<UserProfileInterface | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!user) {
      setProfile(null);
      setLoading(false);
      return;
    }
    
    const fetchProfile = async () => {
      try {
        setLoading(true);
        
        // First check localStorage for a cached profile
        const cachedProfileStr = localStorage.getItem(`userProfile-${user.id}`);
        let cachedProfile = null;
        
        if (cachedProfileStr) {
          try {
            cachedProfile = JSON.parse(cachedProfileStr);
            console.log("Found cached profile in localStorage:", cachedProfile);
          } catch (e) {
            console.error("Error parsing cached profile:", e);
          }
        }
        
        // Try fetching from database
        try {
          const { data, error } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('id', user.id)
            .maybeSingle();
            
          if (error) {
            console.error('Error fetching user profile:', error);
            throw error;
          }
          
          if (data) {
            console.log('Existing profile found:', data);
            setProfile(data);
            // Update cache
            localStorage.setItem(`userProfile-${user.id}`, JSON.stringify(data));
            setLoading(false);
            return;
          } else if (cachedProfile) {
            // If no remote profile but we have a cached one, use it
            console.log('Using cached profile:', cachedProfile);
            setProfile(cachedProfile as UserProfileInterface);
            setLoading(false);
            return;
          }
          
          // If profile doesn't exist, create it
          console.log('Profile not found, attempting to create:', user.id);
          
          const newProfile = {
            id: user.id,
            name: user.user_metadata?.name || user.email,
            email: user.email
          };
          
          const { data: createdProfile, error: insertError } = await supabase
            .from('user_profiles')
            .insert(newProfile)
            .select()
            .single();
            
          if (insertError) {
            console.error('Error creating user profile:', insertError);
            // Still try to use the local profile object even if insert failed
            setProfile(newProfile);
            // Cache the profile
            localStorage.setItem(`userProfile-${user.id}`, JSON.stringify(newProfile));
          } else {
            console.log('Profile created successfully:', createdProfile);
            setProfile(createdProfile);
            // Cache the profile
            localStorage.setItem(`userProfile-${user.id}`, JSON.stringify(createdProfile));
          }
        } catch (dbErr) {
          console.error('Database error in profile management:', dbErr);
          
          // If we have a cached profile, use it
          if (cachedProfile) {
            console.log('Using cached profile after error:', cachedProfile);
            setProfile(cachedProfile as UserProfileInterface);
          } else {
            // Otherwise create a fallback profile from user data
            console.log('Creating fallback profile');
            const fallbackProfile = {
              id: user.id,
              name: user.user_metadata?.name || user.email,
              email: user.email
            };
            setProfile(fallbackProfile as UserProfileInterface);
            // Cache the fallback profile
            localStorage.setItem(`userProfile-${user.id}`, JSON.stringify(fallbackProfile));
          }
          
          throw dbErr;
        }
      } catch (err) {
        console.error('Error in profile management:', err);
        
        // Fallback: If we can't get the profile from the database,
        // at least create a temporary one with the user's data
        if (user) {
          const fallbackProfile = {
            id: user.id,
            name: user.user_metadata?.name || user.email,
            email: user.email
          };
          setProfile(fallbackProfile as UserProfileInterface);
          
          toast({
            title: "שים לב",
            description: "ישנה בעיה בטעינת הפרופיל שלך. חלק מהפונקציות עשויות לא לעבוד.",
            variant: "destructive",
          });
        }
        
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfile();
  }, [user, toast]);

  const updateProfile = async (updates: Partial<UserProfileInterface>) => {
    if (!user) return null;
    
    try {
      setLoading(true);
      
      // Update the local cache first
      const cachedProfileStr = localStorage.getItem(`userProfile-${user.id}`);
      if (cachedProfileStr) {
        try {
          const cachedProfile = JSON.parse(cachedProfileStr);
          const updatedCache = {...cachedProfile, ...updates};
          localStorage.setItem(`userProfile-${user.id}`, JSON.stringify(updatedCache));
        } catch (e) {
          console.error("Error updating profile cache:", e);
        }
      }
      
      // Try to update the remote profile
      const { data, error } = await supabase
        .from('user_profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single();
        
      if (error) {
        console.error('Error updating user profile:', error);
        // Still update the local profile
        setProfile(prev => prev ? {...prev, ...updates} : null);
        throw error;
      }
      
      setProfile(data);
      return data;
    } catch (err) {
      console.error('Error updating user profile:', err);
      // Still update the local profile
      setProfile(prev => prev ? {...prev, ...updates} : null);
      setError(err as Error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    profile,
    loading,
    error,
    updateProfile
  };
};
