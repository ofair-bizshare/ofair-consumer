
import { initializeStorageBuckets, listBuckets } from './storageUtils';
import { supabase } from '@/integrations/supabase/client';
import { checkIsSuperAdmin } from '../auth';

/**
 * Initialize admin services
 * This function is called when the admin page is loaded
 * It ensures that all necessary resources are available
 */
export const initializeAdminServices = async (): Promise<{
  isInitialized: boolean;
  isAdmin: boolean;
  bucketStatus: Record<string, boolean>;
  error?: string;
}> => {
  try {
    console.log('Initializing admin services...');
    
    // Check if user is admin
    const isAdmin = await checkIsSuperAdmin();
    console.log('Is user a super admin?', isAdmin);
    
    if (!isAdmin) {
      console.error('User is not an admin, cannot initialize admin services');
      return {
        isInitialized: false,
        isAdmin: false,
        bucketStatus: {},
        error: 'You are not authorized to access admin services'
      };
    }
    
    // Initialize storage buckets
    console.log('Initializing storage buckets...');
    try {
      await initializeStorageBuckets();
    } catch (storageError) {
      console.error('Error initializing storage buckets:', storageError);
      // Continue anyway to check status, don't return early
    }
    
    // Check storage bucket status
    let buckets = [];
    try {
      buckets = await listBuckets();
    } catch (bucketsError) {
      console.error('Error listing buckets:', bucketsError);
      return {
        isInitialized: false,
        isAdmin,
        bucketStatus: {},
        error: 'Failed to check storage buckets'
      };
    }
    
    console.log('Available buckets:', buckets);
    
    // Use lowercase for case-insensitive comparison
    const lowercaseBuckets = buckets.map(b => b.toLowerCase());
    const bucketStatus = {
      professionals: lowercaseBuckets.includes('professionals'),
      articles: lowercaseBuckets.includes('articles'),
      images: lowercaseBuckets.includes('images')
    };
    
    return {
      isInitialized: true,
      isAdmin,
      bucketStatus
    };
  } catch (error) {
    console.error('Error initializing admin services:', error);
    return {
      isInitialized: false,
      isAdmin: false,
      bucketStatus: {},
      error: 'Failed to initialize admin services'
    };
  }
};
