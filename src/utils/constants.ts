/**
 * Application Constants
 * Uygulama genelinde kullanılan sabitler
 */

export const STORAGE_KEYS = {
  USER_PROGRESS: "kpss_user_progress",
  USER_SETTINGS: "kpss_user_settings",
  LAST_SYNC: "kpss_last_sync",
} as const;

export const APP_VERSION = "1.0.0";

export const USER_ID = "zehra"; // Default user ID

export const SUBJECT_COLORS = {
  TARİH: {
    bg: "bg-orange-50 dark:bg-orange-900/20",
    text: "text-orange-600 dark:text-orange-300",
    border: "border-orange-200 dark:border-orange-800",
  },
  COĞRAFYA: {
    bg: "bg-green-50 dark:bg-green-900/20",
    text: "text-green-600 dark:text-green-300",
    border: "border-green-200 dark:border-green-800",
  },
  MATEMATİK: {
    bg: "bg-blue-50 dark:bg-blue-900/30",
    text: "text-blue-600 dark:text-blue-300",
    border: "border-blue-200 dark:border-blue-800",
  },
  TÜRKÇE: {
    bg: "bg-teal-50 dark:bg-teal-900/20",
    text: "text-teal-600 dark:text-teal-300",
    border: "border-teal-200 dark:border-teal-800",
  },
  VATANDAŞLIK: {
    bg: "bg-purple-50 dark:bg-purple-900/20",
    text: "text-purple-600 dark:text-purple-300",
    border: "border-purple-200 dark:border-purple-800",
  },
} as const;

export const SUBJECT_ICONS = {
  TARİH: "history_edu",
  COĞRAFYA: "public",
  MATEMATİK: "functions",
  TÜRKÇE: "menu_book",
  VATANDAŞLIK: "gavel",
} as const;

// Subject question counts (from plan)
export const SUBJECT_QUESTION_COUNTS = {
  TARİH: 27,
  COĞRAFYA: 18,
  MATEMATİK: 30,
  TÜRKÇE: 0, // Belirtilmemiş
  VATANDAŞLIK: 0, // Belirtilmemiş
} as const;

// URL-safe slug to Subject mapping (Türkçe karakterler için)
export const SUBJECT_SLUG_MAP: Record<string, string> = {
  tarih: "TARİH",
  cografya: "COĞRAFYA",
  matematik: "MATEMATİK",
  turkce: "TÜRKÇE",
  vatandaslik: "VATANDAŞLIK",
} as const;

// Subject to URL-safe slug mapping
export const SUBJECT_TO_SLUG: Record<string, string> = {
  TARİH: "tarih",
  COĞRAFYA: "cografya",
  MATEMATİK: "matematik",
  TÜRKÇE: "turkce",
  VATANDAŞLIK: "vatandaslik",
} as const;
