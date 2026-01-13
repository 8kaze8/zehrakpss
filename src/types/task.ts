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
  type: "paragraph" | "problem" | "speed";
  count: number;
  completed: boolean;
}
