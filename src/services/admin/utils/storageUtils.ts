
import { supabase } from '@/integrations/supabase/client';

/**
 * Lists existing buckets in storage
 * @returns {Promise<string[]>} - List of bucket names
 */
export const listBuckets = async (): Promise<string[]> => {
  try {
    console.log('Listing storage buckets...');
    const { data, error } = await supabase.storage.listBuckets();
    
    if (error) {
      console.error('Error listing buckets:', error);
      throw error;
    }
    
    const bucketNames = data.map(bucket => bucket.name);
    console.log('Available buckets:', bucketNames);
    return bucketNames;
  } catch (error) {
    console.error('Error in listBuckets:', error);
    return [];
  }
};

/**
 * Creates necessary storage buckets for the application
 * @returns {Promise<boolean>} - Result of the operation
 */
export const createBuckets = async (): Promise<boolean> => {
  try {
    console.log('Creating necessary storage buckets...');
    const requiredBuckets = ['professionals', 'articles', 'images'];
    const existingBuckets = await listBuckets();
    
    for (const bucketName of requiredBuckets) {
      if (!existingBuckets.includes(bucketName)) {
        console.log(`Creating bucket '${bucketName}'...`);
        const { error } = await supabase.storage.createBucket(bucketName, {
          public: true, // Make buckets public by default
          fileSizeLimit: 10 * 1024 * 1024 // 10 MB file size limit
        });
        
        if (error) {
          console.error(`Error creating '${bucketName}' bucket:`, error);
        } else {
          console.log(`Bucket '${bucketName}' created successfully`);
          
          // Create public policy for the bucket
          const { error: policyError } = await supabase.rpc('create_storage_policy', { 
            bucket_id: bucketName,
            policy_definition: 'true' // Public access
          });
          
          if (policyError) {
            console.error(`Error creating policy for '${bucketName}' bucket:`, policyError);
          }
        }
      } else {
        console.log(`Bucket '${bucketName}' already exists`);
      }
    }
    
    return true;
  } catch (error) {
    console.error('Error in createBuckets:', error);
    return false;
  }
};

/**
 * Initialize all storage buckets for the application
 * @returns {Promise<boolean>} - Result of the operation
 */
export const initializeStorageBuckets = async (): Promise<boolean> => {
  try {
    console.log('Initializing storage buckets...');
    const result = await createBuckets();
    console.log('Storage buckets initialization result:', result);
    return result;
  } catch (error) {
    console.error('Error initializing storage buckets:', error);
    return false;
  }
};

/**
 * Helper function to get the storage URL for an object
 * @param {string} bucket - Bucket name
 * @param {string} path - Path to the object
 * @returns {string} - Public URL to the object
 */
export const getPublicUrl = (bucket: string, path: string): string => {
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
};

/**
 * Get a signed URL for temporary access to a file
 * @param {string} bucket - Bucket name
 * @param {string} path - Path to the object
 * @returns {Promise<string | null>} - Signed URL or null
 */
export const getSignedUrl = async (bucket: string, path: string): Promise<string | null> => {
  try {
    const { data, error } = await supabase.storage.from(bucket).createSignedUrl(path, 60 * 60); // 1 hour
    
    if (error) {
      console.error('Error getting signed URL:', error);
      return null;
    }
    
    return data.signedUrl;
  } catch (error) {
    console.error('Error in getSignedUrl:', error);
    return null;
  }
};
