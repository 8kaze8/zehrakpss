/**
 * useDailyTasks Hook
 * Günlük görevleri yöneten hook
 */

import { useMemo } from "react";
import { parseISO, format } from "date-fns";
import type { TodayTask, RoutineTask } from "@/types";
import { studyPlan } from "@/data/study-plan";

/**
 * Belirli bir tarih için görevleri getir
 */
export function useDailyTasks(date: Date | string) {
  const targetDate = typeof date === "string" ? parseISO(date) : date;
  const dateISO = format(targetDate, "yyyy-MM-dd");

  // Bugünün görevlerini hesapla
  const tasks = useMemo(() => {
    const todayTasks: TodayTask[] = [];
    const routineTasks: RoutineTask[] = [];

    // Tüm haftaları kontrol et
    for (const month of studyPlan.months) {
      for (const week of month.weeks) {
        const weekStart = parseISO(week.dateRange.start);
        const weekEnd = parseISO(week.dateRange.end);

        // Bu tarih bu hafta içinde mi?
        if (
          targetDate >= weekStart &&
          targetDate <= weekEnd
        ) {
          // Günlük rutin görevleri
          if (week.dailyRoutine.paragraphs > 0) {
            routineTasks.push({
              id: `routine-paragraph-${dateISO}`,
              type: "paragraph",
              count: week.dailyRoutine.paragraphs,
              completed: false,
            });
          }

          if (week.dailyRoutine.problems > 0) {
            routineTasks.push({
              id: `routine-problem-${dateISO}`,
              type: "problem",
              count: week.dailyRoutine.problems,
              completed: false,
            });
          }

          if (week.dailyRoutine.speedQuestions > 0) {
            routineTasks.push({
              id: `routine-speed-${dateISO}`,
              type: "speed",
              count: week.dailyRoutine.speedQuestions,
              completed: false,
            });
          }

          // Ders görevleri (örnek zaman slotları ile)
          if (week.subjects.tarih) {
            todayTasks.push({
              id: `task-tarih-${dateISO}`,
              subject: "TARİH",
              title: week.subjects.tarih,
              description: "Soru bankası çalışması",
              date: dateISO,
              type: "study",
              completed: false,
              timeSlot: {
                start: "14:00",
                end: "15:30",
              },
            });
          }

          if (week.subjects.cografya) {
            todayTasks.push({
              id: `task-cografya-${dateISO}`,
              subject: "COĞRAFYA",
              title: week.subjects.cografya,
              description: "Konu tekrarı",
              date: dateISO,
              type: "study",
              completed: false,
              timeSlot: {
                start: "16:00",
                end: "17:30",
              },
            });
          }

          if (week.subjects.matematik) {
            todayTasks.push({
              id: `task-matematik-${dateISO}`,
              subject: "MATEMATİK",
              title: week.subjects.matematik,
              description: "Soru çözümü",
              date: dateISO,
              type: "study",
              completed: false,
              timeSlot: {
                start: "19:00",
                end: "20:00",
              },
            });
          }

          if (week.subjects.turkce) {
            todayTasks.push({
              id: `task-turkce-${dateISO}`,
              subject: "TÜRKÇE",
              title: week.subjects.turkce,
              description: week.dailyRoutine.speedQuestions > 0 
                ? `${week.dailyRoutine.speedQuestions} soru - Süreli çözüm`
                : "Paragraf çalışması",
              date: dateISO,
              type: week.dailyRoutine.speedQuestions > 0 ? "speed" : "study",
              completed: false,
              requiresTimer: week.dailyRoutine.speedQuestions > 0,
              timerDuration: week.dailyRoutine.speedQuestions > 0 ? 900 : undefined, // 15 dakika
              timeSlot: {
                start: "19:00",
                end: "20:00",
              },
            });
          }

          break; // Haftayı bulduk, döngüden çık
        }
      }
    }

    return {
      studyTasks: todayTasks,
      routineTasks,
    };
  }, [targetDate, dateISO]);

  return tasks;
}
