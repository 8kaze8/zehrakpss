/**
 * Task Type Definitions
 * Görev ve task tipleri için TypeScript tanımlamaları
 */

import { Subject, TaskType } from "./study-plan";

export interface StudyTask {
  id: string;
  subject: Subject;
  title: string;
  description?: string;
  timeSlot?: {
    start: string; // HH:mm format
    end: string;
  };
  date: string; // ISO date (YYYY-MM-DD)
  type: TaskType;
  requiresTimer?: boolean;
  timerDuration?: number; // seconds
}

export interface TodayTask extends StudyTask {
  completed: boolean;
  completedAt?: string; // ISO timestamp
}

export interface RoutineTask {
  id: string;
  type: "paragraph" | "problem" | "speed" | "karma";
  count: number;
  completed: boolean;
  requiresTimer?: boolean; // Süreli çalışma için
  timerDuration?: number; // saniye cinsinden
  label?: string; // Özel etiket (örn: "Karma Mat Testi")
}

export interface CustomTask {
  id: string;
  title: string;
  subject: Subject;
  description?: string;
  date: string; // ISO date (YYYY-MM-DD)
  timeSlot?: {
    start: string; // HH:mm
    end: string;
  };
  type: TaskType;
  createdAt: string; // ISO timestamp
  completed: boolean;
}

/**
 * Deneme sonuç tipi
 */
export interface ExamResult {
  correct: number;
  wrong: number;
  empty: number;
  net: number;
}

/**
 * Deneme tipi
 */
export interface Exam {
  id: string;
  title: string;
  type: "branch" | "general" | "tg"; // Branş, Genel, Türkiye Geneli
  subject?: Subject; // Branş denemeleri için
  date: string; // ISO date (YYYY-MM-DD)
  createdAt: string; // ISO timestamp
  completed: boolean;
  results?: {
    turkce?: ExamResult;
    matematik?: ExamResult;
    tarih?: ExamResult;
    cografya?: ExamResult;
    vatandaslik?: ExamResult;
    total?: ExamResult;
  };
}
