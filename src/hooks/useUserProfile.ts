import { useState, useEffect, useCallback } from 'react';
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

  const fetchProfile = useCallback(async () => {
    if (!user) {
      setProfile(null);
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      
      // First check localStorage for a cached profile
      const cachedProfileStr = localStorage.getItem(`userProfile-${user.id}`);
      let cachedProfile = null;
      
      if (cachedProfileStr) {
        try {
          cachedProfile = JSON.parse(cachedProfileStr);
          console.log("Found cached profile in localStorage:", cachedProfile);
          
          // Immediately set the cached profile while we fetch a fresh one
          setProfile(cachedProfile as UserProfileInterface);
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
          
          // Try to create the profile in database in the background
          try {
            const newProfile = {
              id: user.id,
              name: cachedProfile.name || user.user_metadata?.name || user.email,
              email: cachedProfile.email || user.email,
              phone: cachedProfile.phone || user.user_metadata?.phone,
              updated_at: new Date().toISOString()
            };
            
            console.log('Trying to create profile from cache:', newProfile);
            
            await supabase
              .from('user_profiles')
              .upsert(newProfile)
              .select();
              
            console.log('Profile created from cache successfully');
          } catch (createError) {
            console.error('Error creating profile from cache:', createError);
            // Continue with cached profile regardless
          }
          
          return;
        }
        
        // If profile doesn't exist and no cache, create it
        console.log('Profile not found, attempting to create:', user.id);
        
        const newProfile = {
          id: user.id,
          name: user.user_metadata?.name || user.email,
          email: user.email,
          phone: user.user_metadata?.phone
        };
        
        // Save to localStorage immediately
        localStorage.setItem(`userProfile-${user.id}`, JSON.stringify(newProfile));
        
        // Set the profile in state 
        setProfile(newProfile as UserProfileInterface);
        
        // Try to insert into database
        try {
          const { data: createdProfile, error: insertError } = await supabase
            .from('user_profiles')
            .upsert(newProfile)
            .select()
            .single();
            
          if (insertError) {
            console.error('Error creating user profile:', insertError);
            // Continue using the local profile object
          } else {
            console.log('Profile created successfully:', createdProfile);
            setProfile(createdProfile);
            // Update cache
            localStorage.setItem(`userProfile-${user.id}`, JSON.stringify(createdProfile));
          }
        } catch (insertErr) {
          console.error('Database error creating profile:', insertErr);
          // Continue using the local profile object
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
            email: user.email,
            phone: user.user_metadata?.phone
          };
          setProfile(fallbackProfile as UserProfileInterface);
          // Cache the fallback profile
          localStorage.setItem(`userProfile-${user.id}`, JSON.stringify(fallbackProfile));
        }
      }
    } catch (err) {
      console.error('Error in profile management:', err);
      
      // Fallback: If we can't get the profile from the database,
      // at least create a temporary one with the user's data
      if (user) {
        const fallbackProfile = {
          id: user.id,
          name: user.user_metadata?.name || user.email,
          email: user.email,
          phone: user.user_metadata?.phone
        };
        setProfile(fallbackProfile as UserProfileInterface);
        
        // Cache the fallback profile
        localStorage.setItem(`userProfile-${user.id}`, JSON.stringify(fallbackProfile));
        
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
  }, [user, toast]);

  const refetchProfile = useCallback(() => {
    fetchProfile();
  }, [fetchProfile]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const updateProfile = async (updates: Partial<UserProfileInterface>) => {
    if (!user) return null;
    
    try {
      setLoading(true);
      
      // Update the local cache first
      const cachedProfileStr = localStorage.getItem(`userProfile-${user.id}`);
      if (cachedProfileStr) {
        try {
          const cachedProfile = JSON.parse(cachedProfileStr);
          const updatedCache = {...cachedProfile, ...updates, updated_at: new Date().toISOString()};
          localStorage.setItem(`userProfile-${user.id}`, JSON.stringify(updatedCache));
          
          // Update local state immediately for responsive UI
          setProfile(prev => prev ? {...prev, ...updates} : null);
        } catch (e) {
          console.error("Error updating profile cache:", e);
        }
      }
      
      // Try to update the remote profile
      try {
        const { data, error } = await supabase
          .from('user_profiles')
          .upsert({
            id: user.id, 
            ...updates,
            updated_at: new Date().toISOString()
          })
          .select()
          .single();
          
        if (error) {
          console.error('Error updating user profile:', error);
          throw error;
        }
        
        console.log('Profile updated successfully:', data);
        setProfile(data);
        
        // Update cache with the data from server
        localStorage.setItem(`userProfile-${user.id}`, JSON.stringify(data));
        
        return data;
      } catch (updateError) {
        console.error('Error in profile update request:', updateError);
        // We already updated the local state, so let that remain
        throw updateError;
      }
    } catch (err) {
      console.error('Error updating user profile:', err);
      setError(err as Error);
      
      toast({
        title: "שגיאה בעדכון פרופיל",
        description: "השינויים נשמרו מקומית בלבד",
        variant: "destructive",
      });
      
      return profile; // Return current profile as fallback
    } finally {
      setLoading(false);
    }
  };

  return {
    profile,
    loading,
    error,
    updateProfile,
    refetchProfile
  };
};
