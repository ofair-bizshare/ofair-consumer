
/**
 * Maps bucket names used in the code to the actual bucket names in Supabase
 * This helps handle cases where the bucket names might be different or have been renamed
 */
export const BUCKET_NAMES: Record<string, string> = {
  'professionals': 'professionals',  // Will be created if doesn't exist
  'articles': 'articles',            // Will be created if doesn't exist
  'images': 'images',                // Will be created if doesn't exist
};

/**
 * Gets the actual bucket name to use in Supabase operations
 * @param bucketKey The bucket name used in the code
 * @returns The actual bucket name in Supabase
 */
export const getBucketName = (bucketKey: string): string => {
  // Convert to lowercase for case-insensitive matching
  const lowerKey = bucketKey.toLowerCase();
  
  if (BUCKET_NAMES[lowerKey]) {
    return BUCKET_NAMES[lowerKey];
  }
  
  // If not found, return the original key
  return bucketKey;
};

/**
 * Updates the bucket name mappings
 * @param mapping The new mapping of code bucket names to actual bucket names
 */
export const updateBucketNameMappings = (mapping: Record<string, string>) => {
  Object.assign(BUCKET_NAMES, mapping);
};
