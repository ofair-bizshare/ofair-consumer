
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
        
        // First check if profile exists
        const { data, error } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();
          
        if (error) {
          console.error('Error fetching user profile:', error);
          throw error;
        }
        
        // If profile doesn't exist, create it
        if (!data) {
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
          } else {
            console.log('Profile created successfully:', createdProfile);
            setProfile(createdProfile);
          }
        } else {
          console.log('Existing profile found:', data);
          setProfile(data);
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
