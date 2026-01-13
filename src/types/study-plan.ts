/**
 * Study Plan Type Definitions
 * Çalışma planı için TypeScript type tanımlamaları
 */

export type Month =
  | "OCAK"
  | "ŞUBAT"
  | "MART"
  | "NİSAN"
  | "MAYIS"
  | "HAZİRAN"
  | "TEMMUZ";

export type Subject =
  | "TARİH"
  | "COĞRAFYA"
  | "MATEMATİK"
  | "TÜRKÇE"
  | "VATANDAŞLIK";

export type TaskType = "routine" | "study" | "speed" | "exam";

export interface DailyRoutine {
  paragraphs: number;
  problems: number;
  speedQuestions: number;
}

export interface WeeklyTask {
  weekNumber: number;
  dateRange: {
    start: string; // ISO date (YYYY-MM-DD)
    end: string;
  };
  dailyRoutine: DailyRoutine;
  subjects: {
    tarih?: string;
    cografya?: string;
    matematik?: string;
    turkce?: string;
    vatandaslik?: string;
  };
  weeklyGoal?: string;
}

export interface MonthlyPlan {
  month: Month;
  year: number;
  weeks: WeeklyTask[];
}

export interface StudyPlan {
  startDate: string; // ISO date
  endDate: string;
  months: MonthlyPlan[];
}
