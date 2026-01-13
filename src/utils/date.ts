/**
 * Date Utility Functions
 * date-fns wrapper functions for common date operations
 */

import {
  format,
  parseISO,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  addDays,
  addWeeks,
  isSameDay,
  isToday,
  differenceInDays,
  getWeek,
} from "date-fns";
import { tr } from "date-fns/locale";

/**
 * Format date to Turkish locale string
 */
export function formatDate(date: Date | string, formatStr: string = "dd MMMM yyyy"): string {
  const dateObj = typeof date === "string" ? parseISO(date) : date;
  return format(dateObj, formatStr, { locale: tr });
}

/**
 * Format time to HH:mm
 */
export function formatTime(date: Date | string): string {
  const dateObj = typeof date === "string" ? parseISO(date) : date;
  return format(dateObj, "HH:mm");
}

/**
 * Get week ID in format "YYYY-MM-WW"
 */
export function getWeekId(date: Date | string): string {
  const dateObj = typeof date === "string" ? parseISO(date) : date;
  const year = format(dateObj, "yyyy");
  const month = format(dateObj, "MM");
  const week = getWeek(dateObj, { locale: tr });
  return `${year}-${month}-${week}`;
}

/**
 * Get month-year key in format "MONTH-YEAR"
 */
export function getMonthYearKey(month: string, year: number): string {
  return `${month}-${year}`;
}

/**
 * Check if date is today
 */
export function isDateToday(date: Date | string): boolean {
  const dateObj = typeof date === "string" ? parseISO(date) : date;
  return isToday(dateObj);
}

/**
 * Get start and end of week
 */
export function getWeekRange(date: Date | string): { start: Date; end: Date } {
  const dateObj = typeof date === "string" ? parseISO(date) : date;
  return {
    start: startOfWeek(dateObj, { locale: tr }),
    end: endOfWeek(dateObj, { locale: tr }),
  };
}

/**
 * Get days of week as array
 */
export function getWeekDays(date: Date | string): Date[] {
  const { start } = getWeekRange(date);
  return Array.from({ length: 7 }, (_, i) => addDays(start, i));
}

/**
 * Format date to ISO string (YYYY-MM-DD)
 */
export function toISODate(date: Date | string): string {
  const dateObj = typeof date === "string" ? parseISO(date) : date;
  return format(dateObj, "yyyy-MM-dd");
}

/**
 * Get current date as ISO string
 */
export function getTodayISO(): string {
  return toISODate(new Date());
}
