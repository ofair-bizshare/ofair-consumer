
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
 * Creates a bucket if it doesn't exist already
 * @param {string} bucketName - The name of the bucket to create
 * @param {boolean} isPublic - Whether the bucket should be public
 * @returns {Promise<boolean>} - Result of the operation
 */
export const createBucketIfNotExists = async (bucketName: string, isPublic: boolean = true): Promise<boolean> => {
  try {
    console.log(`Checking if bucket '${bucketName}' exists...`);
    const buckets = await listBuckets();
    
    // Case-insensitive check for existing bucket
    const existingBucket = buckets.find(name => 
      name.toLowerCase() === bucketName.toLowerCase()
    );
    
    if (!existingBucket) {
      console.log(`Creating bucket '${bucketName}'...`);
      
      try {
        const { error } = await supabase.storage.createBucket(bucketName, {
          public: isPublic,
          fileSizeLimit: 10 * 1024 * 1024 // 10 MB file size limit
        });
        
        if (error) {
          // If the error is that the bucket already exists (due to a race condition),
          // we can consider this successful
          if (error.message && error.message.includes('already exists')) {
            console.log(`Bucket '${bucketName}' already exists (name collision)`);
            return true;
          }
          
          console.error(`Error creating '${bucketName}' bucket:`, error);
          return false;
        }
        
        console.log(`Bucket '${bucketName}' created successfully`);
        
        // After creating bucket, add public policy if needed
        if (isPublic) {
          try {
            await makeStorageBucketPublic(bucketName);
          } catch (policyError) {
            console.error(`Error setting public policy for bucket '${bucketName}':`, policyError);
          }
        }
        
        return true;
      } catch (createError) {
        console.error(`Exception creating bucket '${bucketName}':`, createError);
        return false;
      }
    } else {
      console.log(`Bucket '${bucketName}' already exists as '${existingBucket}'`);
      
      // If we found the bucket but with different case, return the actual name
      return true;
    }
  } catch (error) {
    console.error(`Error creating bucket '${bucketName}':`, error);
    return false;
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
    
    // Convert to lowercase for case-insensitive comparison
    const lowerCaseBuckets = existingBuckets.map(name => name.toLowerCase());
    
    for (const bucketName of requiredBuckets) {
      if (!lowerCaseBuckets.includes(bucketName.toLowerCase())) {
        console.log(`Creating bucket '${bucketName}'...`);
        
        try {
          const { error } = await supabase.storage.createBucket(bucketName, {
            public: true, // Make buckets public by default
            fileSizeLimit: 10 * 1024 * 1024 // 10 MB file size limit
          });
          
          if (error) {
            if (error.message && error.message.includes('already exists')) {
              console.log(`Bucket '${bucketName}' already exists (name collision)`);
              continue;
            }
            
            console.error(`Error creating '${bucketName}' bucket:`, error);
          } else {
            console.log(`Bucket '${bucketName}' created successfully`);
            
            // After creating bucket, add public policy
            try {
              await makeStorageBucketPublic(bucketName);
            } catch (policyError) {
              console.error(`Error setting public policy for bucket '${bucketName}':`, policyError);
            }
          }
        } catch (bucketError) {
          console.error(`Exception creating bucket '${bucketName}':`, bucketError);
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
 * Make a storage bucket public
 * @param {string} bucketName - The name of the bucket
 * @returns {Promise<boolean>} - Result of the operation
 */
export const makeStorageBucketPublic = async (bucketName: string): Promise<boolean> => {
  try {
    console.log(`Setting bucket '${bucketName}' to public...`);
    
    // First, check if the bucket exists with case-insensitive matching
    const exactBucketName = await findBucketByName(bucketName);
    
    if (!exactBucketName) {
      console.error(`Bucket '${bucketName}' not found`);
      return false;
    }
    
    // Update bucket to be public if it's not already
    const { error } = await supabase.storage.updateBucket(exactBucketName, {
      public: true,
      fileSizeLimit: 10 * 1024 * 1024 // 10 MB
    });
    
    if (error) {
      console.error(`Error updating bucket '${exactBucketName}' to public:`, error);
      return false;
    }
    
    console.log(`Bucket '${exactBucketName}' is now public`);
    return true;
  } catch (error) {
    console.error(`Error making bucket '${bucketName}' public:`, error);
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
    // Retry up to 3 times in case of transient errors
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        console.log(`Storage initialization attempt ${attempt}...`);
        const result = await createBuckets();
        console.log('Storage buckets initialization result:', result);
        return result;
      } catch (attemptError) {
        console.error(`Storage init attempt ${attempt} failed:`, attemptError);
        if (attempt === 3) throw attemptError;
        // Wait a short time before retrying
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    return false;
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

/**
 * Find a bucket by partial name (case-insensitive)
 * @param {string} bucketName - The partial name to search for
 * @returns {Promise<string | null>} - The found bucket name or null
 */
export const findBucketByName = async (bucketName: string): Promise<string | null> => {
  try {
    const buckets = await listBuckets();
    
    // Try exact match first
    const exactMatch = buckets.find(name => name === bucketName);
    if (exactMatch) return exactMatch;
    
    // Try case insensitive match
    const caseInsensitiveMatch = buckets.find(
      name => name.toLowerCase() === bucketName.toLowerCase()
    );
    if (caseInsensitiveMatch) return caseInsensitiveMatch;
    
    // Try partial match
    const partialMatch = buckets.find(
      name => name.toLowerCase().includes(bucketName.toLowerCase())
    );
    if (partialMatch) return partialMatch;
    
    return null;
  } catch (error) {
    console.error('Error finding bucket:', error);
    return null;
  }
};
