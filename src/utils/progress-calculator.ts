/**
 * Progress Calculator
 * İlerleme hesaplama fonksiyonları
 */

import { parseISO, isAfter, isBefore, isSameDay } from "date-fns";
import { studyPlan } from "@/data/study-plan";
import { getSubjectTopics } from "@/data/subjects";
import type { Subject, Month } from "@/types";
import { getMonthYearKey, toISODate, getWeekId } from "./date";
import type { UserProgress } from "@/types/progress";

/**
 * Aylık ilerlemeyi hesapla
 */
export function calculateMonthlyProgress(
  month: Month,
  year: number,
  progress: UserProgress
): {
  solvedQuestions: number;
  remainingQuestions: number;
  percentage: number;
  totalQuestions: number;
} {
  // O ay için planlanan haftaları bul
  const monthlyPlan = studyPlan.months.find(
    (m) => m.month === month && m.year === year
  );

  if (!monthlyPlan) {
    return {
      solvedQuestions: 0,
      remainingQuestions: 0,
      percentage: 0,
      totalQuestions: 0,
    };
  }

  // O ay için toplam soru sayısını hesapla
  // Her hafta için: Tarih (27), Coğrafya (18), Matematik (30), Türkçe (varsayılan 25)
  let totalQuestions = 0;
  let solvedQuestions = 0;

  monthlyPlan.weeks.forEach((week) => {
    // Her hafta için soru sayısı
    const weekQuestions = 27 + 18 + 30 + 25; // Tarih + Coğrafya + Matematik + Türkçe
    totalQuestions += weekQuestions;

    // O hafta için tamamlanan görevleri say
    const weekStart = parseISO(week.dateRange.start);
    const weekEnd = parseISO(week.dateRange.end);

    Object.keys(progress.daily).forEach((dateStr) => {
      const date = parseISO(dateStr);
      if (
        (isAfter(date, weekStart) || isSameDay(date, weekStart)) &&
        (isBefore(date, weekEnd) || isSameDay(date, weekEnd))
      ) {
        const daily = progress.daily[dateStr];
        solvedQuestions += daily.tasks.filter((t) => t.completed).length;
      }
    });
  });

  const remainingQuestions = Math.max(0, totalQuestions - solvedQuestions);
  const percentage =
    totalQuestions > 0
      ? Math.round((solvedQuestions / totalQuestions) * 100)
      : 0;

  return {
    solvedQuestions,
    remainingQuestions,
    percentage,
    totalQuestions,
  };
}

/**
 * Haftalık ilerlemeyi hesapla
 */
export function calculateWeeklyProgress(
  weekId: string,
  progress: UserProgress
): {
  completedTasks: number;
  totalTasks: number;
  percentage: number;
} {
  // WeekId'den tarih aralığını bul
  let weekStart: Date | null = null;
  let weekEnd: Date | null = null;

  for (const month of studyPlan.months) {
    for (const week of month.weeks) {
      const currentWeekId = getWeekId(parseISO(week.dateRange.start));
      if (currentWeekId === weekId) {
        weekStart = parseISO(week.dateRange.start);
        weekEnd = parseISO(week.dateRange.end);
        break;
      }
    }
    if (weekStart && weekEnd) break;
  }

  if (!weekStart || !weekEnd) {
    return {
      completedTasks: 0,
      totalTasks: 0,
      percentage: 0,
    };
  }

  // O hafta için görevleri say
  let totalTasks = 0;
  let completedTasks = 0;

  // Rutin görevler (her gün)
  const daysInWeek = 7;
  totalTasks += daysInWeek * 3; // Paragraf, Problem, Hız

  // Ders görevleri (her hafta)
  totalTasks += 4; // Tarih, Coğrafya, Matematik, Türkçe

  // O hafta içindeki günler için tamamlanan görevleri say
  Object.keys(progress.daily).forEach((dateStr) => {
    const date = parseISO(dateStr);
    if (
      (isAfter(date, weekStart!) || isSameDay(date, weekStart!)) &&
      (isBefore(date, weekEnd!) || isSameDay(date, weekEnd!))
    ) {
      const daily = progress.daily[dateStr];
      completedTasks += daily.tasks.filter((t) => t.completed).length;
    }
  });

  const percentage =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return {
    completedTasks,
    totalTasks,
    percentage,
  };
}

/**
 * Ders bazlı ilerlemeyi hesapla
 */
export function calculateSubjectProgress(
  subject: Subject,
  progress: UserProgress
): {
  completed: number;
  total: number;
  percentage: number;
  currentTopic?: string;
} {
  const topics = getSubjectTopics(subject);
  const total = topics.length;

  // Tamamlanan konuları say (task completion'a göre)
  const completed = topics.filter((topic) => {
    // Bu konu için görev ID'si oluştur
    const taskId = `task-${subject.toLowerCase()}-${topic.dateRange.start}`;
    
    // Bu görevin tamamlanıp tamamlanmadığını kontrol et
    return Object.values(progress.daily).some((daily) =>
      daily.tasks.some(
        (t) => t.taskId === taskId && t.completed
      )
    );
  }).length;

  // Şu anki konuyu bul (bugünün tarihine göre)
  const today = new Date();
  const currentTopic = topics.find((topic) => {
    const start = parseISO(topic.dateRange.start);
    const end = parseISO(topic.dateRange.end);
    return (
      (isAfter(today, start) || isSameDay(today, start)) &&
      (isBefore(today, end) || isSameDay(today, end))
    );
  });

  const percentage =
    total > 0
      ? Math.round((completed / total) * 100)
      : 0;

  return {
    completed,
    total,
    percentage,
    currentTopic: currentTopic?.name,
  };
}

/**
 * Bugünün konusunu bul
 */
export function getCurrentTopic(subject: Subject): string | undefined {
  const topics = getSubjectTopics(subject);
  const today = new Date();

  const currentTopic = topics.find((topic) => {
    const start = parseISO(topic.dateRange.start);
    const end = parseISO(topic.dateRange.end);
    return (
      (isAfter(today, start) || isSameDay(today, start)) &&
      (isBefore(today, end) || isSameDay(today, end))
    );
  });

  return currentTopic?.name;
}
