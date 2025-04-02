
/**
 * Utility functions for managing local data when Supabase database is not accessible
 * due to RLS policy issues or other errors.
 */

// Generic function to save an item to localStorage with automatic expiry
export const saveToLocalDB = <T extends Record<string, any>>(
  collectionName: string,
  userId: string, 
  item: T,
  expiryDays = 30
): void => {
  try {
    // Get the existing collection or create a new one
    const existingStr = localStorage.getItem(`${collectionName}-${userId}`);
    let collection: T[] = [];
    
    if (existingStr) {
      collection = JSON.parse(existingStr);
    }
    
    // Check if item with the same ID already exists
    const existingIndex = collection.findIndex(i => i.id === item.id);
    
    if (existingIndex >= 0) {
      // Update existing item
      collection[existingIndex] = {
        ...collection[existingIndex],
        ...item,
        updatedAt: new Date().toISOString()
      };
    } else {
      // Add new item with timestamp and expiry
      collection.push({
        ...item,
        id: item.id || `local-${Date.now()}-${Math.random().toString(36).substring(2)}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + expiryDays * 24 * 60 * 60 * 1000).toISOString()
      });
    }
    
    // Save back to localStorage
    localStorage.setItem(`${collectionName}-${userId}`, JSON.stringify(collection));
    
    console.log(`Saved item to local ${collectionName} collection:`, item);
  } catch (error) {
    console.error(`Error saving to local ${collectionName} collection:`, error);
  }
};

// Generic function to get items from localStorage
export const getFromLocalDB = <T extends Record<string, any>>(
  collectionName: string,
  userId: string
): T[] => {
  try {
    const collectionStr = localStorage.getItem(`${collectionName}-${userId}`);
    
    if (!collectionStr) {
      return [];
    }
    
    const collection: T[] = JSON.parse(collectionStr);
    
    // Filter out expired items
    const currentTime = new Date().toISOString();
    const validItems = collection.filter(item => {
      // Check if item has an expiry and it's not expired
      return !('expiresAt' in item) || item.expiresAt > currentTime;
    });
    
    // If we filtered out some items, save the cleaned collection back
    if (validItems.length !== collection.length) {
      localStorage.setItem(`${collectionName}-${userId}`, JSON.stringify(validItems));
    }
    
    return validItems;
  } catch (error) {
    console.error(`Error retrieving from local ${collectionName} collection:`, error);
    return [];
  }
};

// Function to get a single item by ID
export const getItemFromLocalDB = <T extends Record<string, any>>(
  collectionName: string,
  userId: string,
  itemId: string
): T | null => {
  try {
    const collection = getFromLocalDB<T>(collectionName, userId);
    return collection.find(item => item.id === itemId) || null;
  } catch (error) {
    console.error(`Error retrieving item from local ${collectionName} collection:`, error);
    return null;
  }
};

// Function to update an item
export const updateItemInLocalDB = <T extends Record<string, any>>(
  collectionName: string,
  userId: string,
  itemId: string,
  updates: Partial<T>
): T | null => {
  try {
    const collection = getFromLocalDB<T>(collectionName, userId);
    const itemIndex = collection.findIndex(item => item.id === itemId);
    
    if (itemIndex === -1) {
      return null;
    }
    
    const updatedItem = {
      ...collection[itemIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    collection[itemIndex] = updatedItem;
    
    localStorage.setItem(`${collectionName}-${userId}`, JSON.stringify(collection));
    
    return updatedItem;
  } catch (error) {
    console.error(`Error updating item in local ${collectionName} collection:`, error);
    return null;
  }
};

// Function to delete an item
export const deleteItemFromLocalDB = <T extends Record<string, any>>(
  collectionName: string,
  userId: string,
  itemId: string
): boolean => {
  try {
    const collection = getFromLocalDB<T>(collectionName, userId);
    const filteredCollection = collection.filter(item => item.id !== itemId);
    
    if (filteredCollection.length === collection.length) {
      return false; // Item not found
    }
    
    localStorage.setItem(`${collectionName}-${userId}`, JSON.stringify(filteredCollection));
    
    return true;
  } catch (error) {
    console.error(`Error deleting item from local ${collectionName} collection:`, error);
    return false;
  }
};

// Function to clear all items in a collection
export const clearLocalDBCollection = (
  collectionName: string,
  userId: string
): void => {
  try {
    localStorage.removeItem(`${collectionName}-${userId}`);
  } catch (error) {
    console.error(`Error clearing local ${collectionName} collection:`, error);
  }
};

// Function to synchronize local data with remote database (to be called when connectivity is restored)
export const syncLocalWithRemoteDB = async <T extends Record<string, any>>(
  collectionName: string,
  userId: string,
  syncFunction: (items: T[]) => Promise<void>
): Promise<void> => {
  try {
    const localItems = getFromLocalDB<T>(collectionName, userId);
    
    if (localItems.length === 0) {
      return;
    }
    
    await syncFunction(localItems);
    
    // Clear local items after successful sync
    clearLocalDBCollection(collectionName, userId);
  } catch (error) {
    console.error(`Error synchronizing local ${collectionName} with remote:`, error);
  }
};
