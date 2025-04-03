
/**
 * Utilities for admin status caching
 */

/**
 * Gets cached admin status for a user
 * @param userId User ID to check
 * @returns The cached admin status or null if not cached or expired
 */
export const getCachedAdminStatus = (userId: string): { isAdmin: boolean } | null => {
  try {
    const cachedAdminStatus = localStorage.getItem(`adminStatus-${userId}`);
    if (cachedAdminStatus) {
      const parsed = JSON.parse(cachedAdminStatus);
      if (parsed.timestamp > Date.now() - 3600000) { // Cache valid for 1 hour
        console.log("Using cached admin status:", parsed.isAdmin);
        return { isAdmin: parsed.isAdmin };
      }
    }
    return null;
  } catch (cacheError) {
    console.error('Error checking cached admin status:', cacheError);
    return null;
  }
};

/**
 * Sets cached admin status for a user
 * @param userId User ID to cache for
 * @param isAdmin Admin status to cache
 */
export const setCachedAdminStatus = (userId: string, isAdmin: boolean): void => {
  try {
    localStorage.setItem(`adminStatus-${userId}`, JSON.stringify({
      isAdmin,
      timestamp: Date.now()
    }));
  } catch (cacheError) {
    console.error('Error updating admin cache:', cacheError);
  }
};

/**
 * Clears the admin status cache for a user
 * @param userId User ID to clear cache for
 */
export const clearAdminCache = (userId: string): void => {
  try {
    localStorage.removeItem(`adminStatus-${userId}`);
    console.log(`Admin cache cleared for user: ${userId}`);
  } catch (error) {
    console.error('Error clearing admin cache:', error);
  }
};
