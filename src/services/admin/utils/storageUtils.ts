
import { supabase } from '@/integrations/supabase/client';

/**
 * Check if a storage bucket exists
 * @param bucketName The name of the bucket to check
 * @returns Promise<boolean> True if the bucket exists, false otherwise
 */
export const checkBucketExists = async (bucketName: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase.storage.getBucket(bucketName);
    if (error) {
      console.error(`Error checking if bucket ${bucketName} exists:`, error);
      return false;
    }
    return !!data;
  } catch (error) {
    console.error(`Error checking if bucket ${bucketName} exists:`, error);
    return false;
  }
};

/**
 * Create a new storage bucket if it doesn't exist
 * @param bucketName The name of the bucket to create
 * @param isPublic Whether the bucket should be public
 * @returns Promise<boolean> True if the bucket was created or already exists, false otherwise
 */
export const createBucketIfNotExists = async (bucketName: string, isPublic: boolean = true): Promise<boolean> => {
  try {
    // First, check if the bucket already exists
    const bucketExists = await checkBucketExists(bucketName);
    
    if (bucketExists) {
      console.log(`Bucket ${bucketName} already exists`);
      return true;
    }
    
    // Create the bucket if it doesn't exist
    const { data, error } = await supabase.storage.createBucket(bucketName, {
      public: isPublic
    });
    
    if (error) {
      console.error(`Error creating bucket ${bucketName}:`, error);
      return false;
    }
    
    console.log(`Successfully created bucket ${bucketName}`);
    return true;
  } catch (error) {
    console.error(`Error creating bucket ${bucketName}:`, error);
    return false;
  }
};

/**
 * List all buckets in storage
 * @returns Promise<string[]> Array of bucket names
 */
export const listBuckets = async (): Promise<string[]> => {
  try {
    const { data, error } = await supabase.storage.listBuckets();
    
    if (error) {
      console.error('Error listing buckets:', error);
      return [];
    }
    
    return data.map(bucket => bucket.name);
  } catch (error) {
    console.error('Error listing buckets:', error);
    return [];
  }
};

/**
 * Test upload to see if storage permissions are working
 * @param bucketName The name of the bucket to upload to
 * @returns Promise<boolean> True if the test was successful, false otherwise
 */
export const testStorageUpload = async (bucketName: string): Promise<boolean> => {
  try {
    // Create a small test file
    const testFile = new File(['test'], 'test.txt', { type: 'text/plain' });
    
    // Try uploading to the bucket
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(`test-${Date.now()}.txt`, testFile, {
        cacheControl: '3600',
        upsert: false
      });
      
    if (error) {
      console.error(`Error testing upload to ${bucketName}:`, error);
      return false;
    }
    
    console.log(`Test upload to ${bucketName} successful:`, data);
    return true;
  } catch (error) {
    console.error(`Error testing upload to ${bucketName}:`, error);
    return false;
  }
};

/**
 * Initialize required storage buckets for the application
 * @returns Promise<boolean> True if all buckets were initialized successfully
 */
export const initializeStorageBuckets = async (): Promise<boolean> => {
  try {
    // Create required buckets if they don't exist
    const articlesBucketCreated = await createBucketIfNotExists('articles', true);
    const professionalsBucketCreated = await createBucketIfNotExists('professionals', true);
    const imagesBucketCreated = await createBucketIfNotExists('images', true);
    
    // Test uploads to each bucket
    if (articlesBucketCreated) {
      await testStorageUpload('articles');
    }
    
    if (professionalsBucketCreated) {
      await testStorageUpload('professionals');
    }
    
    if (imagesBucketCreated) {
      await testStorageUpload('images');
    }
    
    return articlesBucketCreated && professionalsBucketCreated && imagesBucketCreated;
  } catch (error) {
    console.error('Error initializing storage buckets:', error);
    return false;
  }
};
