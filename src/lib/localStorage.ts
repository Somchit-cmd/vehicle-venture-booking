
// Utility functions for working with localStorage

// Check if localStorage is available
const isLocalStorageAvailable = () => {
  try {
    const testKey = '__test__';
    localStorage.setItem(testKey, testKey);
    localStorage.removeItem(testKey);
    return true;
  } catch (e) {
    return false;
  }
};

// Get data from localStorage
export const getItem = <T>(key: string, defaultValue: T): T => {
  if (!isLocalStorageAvailable()) return defaultValue;
  
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error getting item from localStorage:`, error);
    return defaultValue;
  }
};

// Save data to localStorage
export const setItem = <T>(key: string, value: T): void => {
  if (!isLocalStorageAvailable()) return;
  
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error saving item to localStorage:`, error);
  }
};

// Remove data from localStorage
export const removeItem = (key: string): void => {
  if (!isLocalStorageAvailable()) return;
  
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing item from localStorage:`, error);
  }
};

// Generate a unique ID (to replace Firebase auto IDs)
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
};

