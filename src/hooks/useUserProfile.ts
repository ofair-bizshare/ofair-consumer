
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/providers/AuthProvider';
import { UserProfileInterface } from '@/types/dashboard';

export const useUserProfile = () => {
  const { user } = useAuth();
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
        
        const { data, error } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();
          
        if (error) throw error;
        
        setProfile(data);
      } catch (err) {
        console.error('Error fetching user profile:', err);
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfile();
  }, [user]);

  const updateProfile = async (updates: Partial<UserProfileInterface>) => {
    if (!user) return null;
    
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('user_profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single();
        
      if (error) throw error;
      
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
