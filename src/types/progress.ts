/**
 * Progress Type Definitions
 * İlerleme takibi için TypeScript type tanımlamaları
 */

import { Month } from "./study-plan";
import { CustomTask, Exam } from "./task";
import { TopicNote } from "./topic-note";

export interface TaskCompletion {
  taskId: string;
  completedAt?: string; // ISO timestamp (only when completed)
  completed: boolean;
}

export interface DailyProgress {
  date: string; // ISO date (YYYY-MM-DD)
  tasks: TaskCompletion[];
  routineCompleted: boolean;
}

export interface WeeklyProgress {
  weekId: string; // Format: "YYYY-MM-WW" (year-month-week)
  completedTasks: number;
  totalTasks: number;
  percentage: number;
}

export interface MonthlyProgress {
  month: Month;
  year: number;
  solvedQuestions: number;
  remainingQuestions: number;
  percentage: number;
}

export interface UserProgress {
  daily: Record<string, DailyProgress>; // date -> DailyProgress
  weekly: Record<string, WeeklyProgress>; // weekId -> WeeklyProgress
  monthly: Record<string, MonthlyProgress>; // "month-year" -> MonthlyProgress
  customTasks: CustomTask[]; // Kullanıcının eklediği özel görevler
  exams: Exam[]; // Kullanıcının eklediği denemeler
  topicNotes: TopicNote[]; // Konu notları
}

export interface StoredProgress {
  version: string; // "1.0.0" - migration için
  userId: string;
  progress: UserProgress;
  lastUpdated: string; // ISO timestamp
}
