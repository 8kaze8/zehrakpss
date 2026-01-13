/**
 * Progress Calculator
 * İlerleme hesaplama fonksiyonları
 */

import { parseISO, isAfter, isBefore, isSameDay } from "date-fns";
import { studyPlan } from "@/data/study-plan";
import { subjectsData } from "@/data/subjects-data";
import type { Subject, Month } from "@/types";
import type { UserProgress } from "@/types/progress";
import { getMonthYearKey, toISODate } from "./date";

/**
 * Belirli bir ders için tamamlanan konu sayısını hesapla
 */
export function calculateSubjectProgress(
  subject: Subject,
  progress: UserProgress
): { completed: number; total: number; percentage: number } {
  const topics = subjectsData[subject]?.topics || [];
  const total = topics.length;

  if (total === 0) {
    return { completed: 0, total: 0, percentage: 0 };
  }

  // Bugünün tarihi
  const today = new Date();
  const todayISO = toISODate(today);

  // Tamamlanan konuları say
  let completed = 0;

  topics.forEach((topic) => {
    // Bu konunun işlendiği haftaları kontrol et
    const topicWeeks = topic.weeks;
    let topicCompleted = false;

    // Her hafta için kontrol et
    for (const weekKey of topicWeeks) {
      const [month, weekNum] = weekKey.split("-");
      
      // Study plan'dan bu haftayı bul
      const monthData = studyPlan.months.find((m) => m.month === month);
      if (!monthData) continue;

      const week = monthData.weeks.find((w) => w.weekNumber === parseInt(weekNum));
      if (!week) continue;

      // Bu haftanın tarih aralığını kontrol et
      const weekStart = parseISO(week.dateRange.start);
      const weekEnd = parseISO(week.dateRange.end);

      // Eğer bu hafta geçtiyse ve görevler tamamlandıysa
      if (isBefore(weekEnd, today) || isSameDay(weekEnd, today)) {
        // Bu hafta için görevlerin tamamlanıp tamamlanmadığını kontrol et
        const weekDays = [];
        let currentDate = weekStart;
        while (currentDate <= weekEnd) {
          weekDays.push(toISODate(currentDate));
          currentDate = new Date(currentDate.getTime() + 24 * 60 * 60 * 1000);
        }

        // Haftanın en az %70'i tamamlandıysa konu tamamlanmış sayılır
        const completedDays = weekDays.filter((date) => {
          const daily = progress.daily[date];
          if (!daily) return false;
          return daily.tasks.length > 0 && daily.tasks.some((t) => t.completed);
        }).length;

        if (completedDays / weekDays.length >= 0.7) {
          topicCompleted = true;
          break;
        }
      }
    }

    if (topicCompleted) {
      completed++;
    }
  });

  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return { completed, total, percentage };
}

/**
 * Belirli bir ay için çözülen soru sayısını hesapla
 */
export function calculateMonthlySolvedQuestions(
  month: Month,
  year: number,
  progress: UserProgress
): { solved: number; remaining: number; percentage: number } {
  const monthData = studyPlan.months.find(
    (m) => m.month === month && m.year === year
  );

  if (!monthData) {
    return { solved: 0, remaining: 0, percentage: 0 };
  }

  // Toplam soru sayısı (her ders için)
  const totalQuestions = 27 + 18 + 30; // Tarih + Coğrafya + Matematik

  // Bu ay için tamamlanan görevleri say
  let solvedQuestions = 0;

  monthData.weeks.forEach((week) => {
    const weekStart = parseISO(week.dateRange.start);
    const weekEnd = parseISO(week.dateRange.end);

    let currentDate = weekStart;
    while (currentDate <= weekEnd) {
      const dateISO = toISODate(currentDate);
      const daily = progress.daily[dateISO];

      if (daily) {
        // Tamamlanan görevleri say
        const completedTasks = daily.tasks.filter((t) => t.completed).length;
        // Her tamamlanan görev için ortalama soru sayısı (tahmini)
        solvedQuestions += completedTasks * 10; // Ortalama 10 soru/görev
      }

      currentDate = new Date(currentDate.getTime() + 24 * 60 * 60 * 1000);
    }
  });

  // Aylık hedef (örnek: Haziran için 1890 soru)
  const monthlyTarget = totalQuestions * 30; // Ayda ~30 gün, günde ortalama totalQuestions soru
  const remaining = Math.max(0, monthlyTarget - solvedQuestions);
  const percentage =
    monthlyTarget > 0
      ? Math.round((solvedQuestions / monthlyTarget) * 100)
      : 0;

  return { solved: solvedQuestions, remaining, percentage };
}

/**
 * Şu anki aktif konuyu bul
 */
export function getCurrentTopic(subject: Subject): {
  topic: string;
  month: string;
  progress: number;
} | null {
  const today = new Date();
  const todayISO = toISODate(today);

  // Study plan'da bugünün hangi haftada olduğunu bul
  for (const month of studyPlan.months) {
    for (const week of month.weeks) {
      const weekStart = parseISO(week.dateRange.start);
      const weekEnd = parseISO(week.dateRange.end);

      if (today >= weekStart && today <= weekEnd) {
        // Bu haftanın konusunu bul
        const subjectKey = subject.toLowerCase() as keyof typeof week.subjects;
        const topicName = week.subjects[subjectKey];

        if (topicName) {
          // Bu konunun ilerlemesini hesapla
          const topics = subjectsData[subject]?.topics || [];
          const topic = topics.find((t) => t.name === topicName);

          if (topic) {
            // Konu sırasına göre progress hesapla
            const totalTopics = topics.length;
            const currentOrder = topic.order;
            const progress = Math.round((currentOrder / totalTopics) * 100);

            return {
              topic: topicName,
              month: month.month,
              progress: Math.min(progress, 100),
            };
          }
        }
      }
    }
  }

  return null;
}

/**
 * Hafta sonu hedeflerini getir
 */
export function getWeekendGoals(date: Date): Array<{
  id: string;
  title: string;
  description: string;
  day: string;
  progress: number;
}> {
  const goals: Array<{
    id: string;
    title: string;
    description: string;
    day: string;
    progress: number;
  }> = [];

  // Bugünün haftasını bul
  for (const month of studyPlan.months) {
    for (const week of month.weeks) {
      const weekStart = parseISO(week.dateRange.start);
      const weekEnd = parseISO(week.dateRange.end);

      if (date >= weekStart && date <= weekEnd) {
        // Hafta sonu hedefi varsa ekle
        if (week.weeklyGoal) {
          goals.push({
            id: `goal-${week.dateRange.start}`,
            title: week.weeklyGoal,
            description: "Haftalık hedef görevi",
            day: "Cumartesi",
            progress: 0, // Gerçek implementasyonda progress hesaplanmalı
          });
        }
      }
    }
  }

  return goals;
}
