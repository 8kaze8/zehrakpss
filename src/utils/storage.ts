/**
 * LocalStorage Utility Functions
 * LocalStorage işlemleri için helper functions
 */

import { STORAGE_KEYS, APP_VERSION, USER_ID } from "./constants";
import type { StoredProgress, UserProgress } from "@/types";

/**
 * Get item from localStorage with error handling
 */
export function getStorageItem<T>(key: string): T | null {
  if (typeof window === "undefined") return null;

  try {
    const item = localStorage.getItem(key);
    return item ? (JSON.parse(item) as T) : null;
  } catch (error) {
    console.error(`Error reading from localStorage key "${key}":`, error);
    return null;
  }
}

/**
 * Set item to localStorage with error handling
 */
export function setStorageItem<T>(key: string, value: T): boolean {
  if (typeof window === "undefined") return false;

  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Error writing to localStorage key "${key}":`, error);
    return false;
  }
}

/**
 * Remove item from localStorage
 */
export function removeStorageItem(key: string): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing localStorage key "${key}":`, error);
  }
}

/**
 * Get user progress from localStorage
 */
export function getStoredProgress(): StoredProgress | null {
  return getStorageItem<StoredProgress>(STORAGE_KEYS.USER_PROGRESS);
}

/**
 * Save user progress to localStorage
 */
export function saveStoredProgress(progress: UserProgress): boolean {
  const stored: StoredProgress = {
    version: APP_VERSION,
    userId: USER_ID,
    progress,
    lastUpdated: new Date().toISOString(),
  };

  return setStorageItem(STORAGE_KEYS.USER_PROGRESS, stored);
}

/**
 * Initialize empty progress structure
 */
export function initializeProgress(): UserProgress {
  return {
    daily: {},
    weekly: {},
    monthly: {},
    customTasks: [],
  };
}

/**
 * Get or initialize progress
 */
export function getOrInitializeProgress(): UserProgress {
  const stored = getStoredProgress();
  return stored?.progress || initializeProgress();
}
