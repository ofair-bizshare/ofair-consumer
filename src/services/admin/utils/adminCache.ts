
/**
 * Simple cache for admin status checks to reduce RPC calls
 */

interface AdminStatusCache {
  isAdmin: boolean;
  timestamp: number;
}

const CACHE_EXPIRY = 5 * 60 * 1000; // 5 minutes in milliseconds
const adminStatusCache: Record<string, AdminStatusCache> = {};

/**
 * Get the cached admin status for a user
 * @param userId The user ID to check
 * @returns The cached admin status or null if not cached or expired
 */
export const getCachedAdminStatus = (userId: string): AdminStatusCache | null => {
  const cached = adminStatusCache[userId];
  if (!cached) return null;
  
  // Check if the cache has expired
  const now = Date.now();
  if (now - cached.timestamp > CACHE_EXPIRY) {
    delete adminStatusCache[userId];
    return null;
  }
  
  return cached;
};

/**
 * Set the cached admin status for a user
 * @param userId The user ID to cache
 * @param isAdmin Whether the user is an admin
 */
export const setCachedAdminStatus = (userId: string, isAdmin: boolean): void => {
  adminStatusCache[userId] = {
    isAdmin,
    timestamp: Date.now()
  };
};

/**
 * Clear the cached admin status for a user
 * @param userId The user ID to clear
 */
export const clearAdminCache = (userId: string): void => {
  delete adminStatusCache[userId];
};

/**
 * Clear all admin status caches
 */
export const clearAllAdminCache = (): void => {
  Object.keys(adminStatusCache).forEach(key => {
    delete adminStatusCache[key];
  });
};
