
interface AdminCacheEntry {
  isAdmin: boolean;
  timestamp: number;
}

const ADMIN_CACHE_KEY = 'admin_status_cache';
const CACHE_TTL = 30 * 60 * 1000; // 30 minutes in milliseconds

/**
 * Get cached admin status for a user
 * @param userId User ID to check
 * @returns Admin status if found and not expired, null otherwise
 */
export const getCachedAdminStatus = (userId: string): AdminCacheEntry | null => {
  try {
    const cacheJson = localStorage.getItem(ADMIN_CACHE_KEY);
    if (!cacheJson) {
      return null;
    }
    
    const cache: Record<string, AdminCacheEntry> = JSON.parse(cacheJson);
    const entry = cache[userId];
    
    if (!entry) {
      return null;
    }
    
    // Check if the cache entry has expired
    const now = Date.now();
    if (now - entry.timestamp > CACHE_TTL) {
      // Entry expired, remove it
      delete cache[userId];
      localStorage.setItem(ADMIN_CACHE_KEY, JSON.stringify(cache));
      return null;
    }
    
    return entry;
  } catch (error) {
    console.error('Error getting cached admin status:', error);
    clearAllAdminCache();
    return null;
  }
};

/**
 * Set cached admin status for a user
 * @param userId User ID to cache status for
 * @param isAdmin Whether the user is an admin
 */
export const setCachedAdminStatus = (userId: string, isAdmin: boolean): void => {
  try {
    const cacheJson = localStorage.getItem(ADMIN_CACHE_KEY);
    const cache: Record<string, AdminCacheEntry> = cacheJson ? JSON.parse(cacheJson) : {};
    
    cache[userId] = {
      isAdmin,
      timestamp: Date.now()
    };
    
    localStorage.setItem(ADMIN_CACHE_KEY, JSON.stringify(cache));
  } catch (error) {
    console.error('Error setting cached admin status:', error);
  }
};

/**
 * Clear cached admin status for a user
 * @param userId User ID to clear cache for
 */
export const clearAdminCache = (userId: string): void => {
  try {
    const cacheJson = localStorage.getItem(ADMIN_CACHE_KEY);
    if (!cacheJson) {
      return;
    }
    
    const cache: Record<string, AdminCacheEntry> = JSON.parse(cacheJson);
    
    if (cache[userId]) {
      delete cache[userId];
      localStorage.setItem(ADMIN_CACHE_KEY, JSON.stringify(cache));
    }
  } catch (error) {
    console.error('Error clearing admin cache:', error);
  }
};

/**
 * Clear all admin cache entries
 */
export const clearAllAdminCache = (): void => {
  try {
    localStorage.removeItem(ADMIN_CACHE_KEY);
  } catch (error) {
    console.error('Error clearing all admin cache:', error);
  }
};
