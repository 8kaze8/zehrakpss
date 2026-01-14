/**
 * useDailyTasks Hook
 * Günlük görevleri yöneten hook
 */

import { useMemo } from "react";
import { parseISO, format, getMonth } from "date-fns";
import type { TodayTask, RoutineTask } from "@/types";
import type { WeeklyTask, Month } from "@/types/study-plan";
import { studyPlan } from "@/data/study-plan";
import { useStudyProgressContext } from "@/context/StudyProgressContext";

// Ay index'i için helper
const MONTH_MAP: Record<Month, number> = {
  OCAK: 0,
  ŞUBAT: 1,
  MART: 2,
  NİSAN: 3,
  MAYIS: 4,
  HAZİRAN: 5,
  TEMMUZ: 6,
};

/**
 * Hafta verilerinden rutin görevleri oluştur
 */
function createRoutineTasks(
  week: WeeklyTask,
  dateISO: string,
  isTaskCompleted: (id: string, date: Date) => boolean,
  targetDate: Date,
  currentMonth: number
): RoutineTask[] {
  const routineTasks: RoutineTask[] = [];

  // Paragraf görevi
  if (week.dailyRoutine.paragraphs > 0) {
    routineTasks.push({
      id: `routine-paragraph-${dateISO}`,
      type: "paragraph",
      count: week.dailyRoutine.paragraphs,
      completed: isTaskCompleted(`routine-paragraph-${dateISO}`, targetDate),
    });
  }

  // Problem görevi - MART'tan itibaren süreli
  if (week.dailyRoutine.problems > 0) {
    const isTimedMonth = currentMonth >= MONTH_MAP.MART && currentMonth <= MONTH_MAP.NİSAN;
    routineTasks.push({
      id: `routine-problem-${dateISO}`,
      type: "problem",
      count: week.dailyRoutine.problems,
      completed: isTaskCompleted(`routine-problem-${dateISO}`, targetDate),
      requiresTimer: isTimedMonth,
      timerDuration: isTimedMonth ? 1800 : undefined, // 30 dakika
      label: isTimedMonth ? `${week.dailyRoutine.problems} Problem (Süreli)` : undefined,
    });
  }

  // Hız sorusu görevi
  if (week.dailyRoutine.speedQuestions > 0) {
    routineTasks.push({
      id: `routine-speed-${dateISO}`,
      type: "speed",
      count: week.dailyRoutine.speedQuestions,
      completed: isTaskCompleted(`routine-speed-${dateISO}`, targetDate),
      requiresTimer: true,
      timerDuration: 900, // 15 dakika
    });
  }

  // MAYIS ayı için Karma Mat Testi
  if (currentMonth >= MONTH_MAP.MAYIS && week.dailyRoutine.problems === 0) {
    routineTasks.push({
      id: `routine-karma-${dateISO}`,
      type: "karma",
      count: 1,
      completed: isTaskCompleted(`routine-karma-${dateISO}`, targetDate),
      requiresTimer: true,
      timerDuration: 2400, // 40 dakika
      label: "Karma Mat Testi",
    });
  }

  return routineTasks;
}

/**
 * Hafta verilerinden ders görevleri oluştur
 */
function createSubjectTasks(
  week: WeeklyTask,
  dateISO: string,
  isTaskCompleted: (id: string, date: Date) => boolean,
  targetDate: Date,
  currentMonth: number
): TodayTask[] {
  const todayTasks: TodayTask[] = [];

  // MAYIS'tan itibaren Vatandaşlık ayrımı
  const isVatandaslikMonth = currentMonth >= MONTH_MAP.MAYIS;

  // Tarih
  if (week.subjects.tarih) {
    todayTasks.push({
      id: `task-tarih-${dateISO}`,
      subject: "TARİH",
      title: week.subjects.tarih,
      description: "Soru bankası çalışması",
      date: dateISO,
      type: "study",
      completed: isTaskCompleted(`task-tarih-${dateISO}`, targetDate),
      timeSlot: { start: "14:00", end: "15:30" },
    });
  }

  // Coğrafya
  if (week.subjects.cografya) {
    todayTasks.push({
      id: `task-cografya-${dateISO}`,
      subject: "COĞRAFYA",
      title: week.subjects.cografya,
      description: "Konu tekrarı",
      date: dateISO,
      type: "study",
      completed: isTaskCompleted(`task-cografya-${dateISO}`, targetDate),
      timeSlot: { start: "16:00", end: "17:30" },
    });
  }

  // Matematik
  if (week.subjects.matematik) {
    todayTasks.push({
      id: `task-matematik-${dateISO}`,
      subject: "MATEMATİK",
      title: week.subjects.matematik,
      description: "Soru çözümü",
      date: dateISO,
      type: "study",
      completed: isTaskCompleted(`task-matematik-${dateISO}`, targetDate),
      timeSlot: { start: "19:00", end: "20:00" },
    });
  }

  // Türkçe / Vatandaşlık
  if (week.subjects.turkce) {
    const isVatandaslikTopic =
      week.subjects.turkce.includes("HUKUK") ||
      week.subjects.turkce.includes("ANAYASA") ||
      week.subjects.turkce.includes("YASAMA") ||
      week.subjects.turkce.includes("YÜRÜTME") ||
      week.subjects.turkce.includes("YARGI") ||
      week.subjects.turkce.includes("Vatandaşlık") ||
      week.subjects.turkce.includes("GÜNCEL");

    const subject = isVatandaslikTopic ? "VATANDAŞLIK" : "TÜRKÇE";
    const taskId = isVatandaslikTopic ? `task-vatandaslik-${dateISO}` : `task-turkce-${dateISO}`;

    todayTasks.push({
      id: taskId,
      subject: subject,
      title: week.subjects.turkce,
      description:
        week.dailyRoutine.speedQuestions > 0
          ? `${week.dailyRoutine.speedQuestions} soru - Süreli çözüm`
          : isVatandaslikTopic
          ? "Vatandaşlık çalışması"
          : "Paragraf çalışması",
      date: dateISO,
      type: week.dailyRoutine.speedQuestions > 0 ? "speed" : "study",
      completed: isTaskCompleted(taskId, targetDate),
      requiresTimer: week.dailyRoutine.speedQuestions > 0,
      timerDuration: week.dailyRoutine.speedQuestions > 0 ? 900 : undefined,
      timeSlot: { start: "20:00", end: "21:00" },
    });
  }

  return todayTasks;
}

/**
 * Belirli bir tarih için görevleri getir
 */
export function useDailyTasks(date: Date | string) {
  const targetDate = typeof date === "string" ? parseISO(date) : date;
  const dateISO = format(targetDate, "yyyy-MM-dd");
  const currentMonth = getMonth(targetDate);
  const { getCustomTasks, isTaskCompleted, progress } = useStudyProgressContext();

  // Progress.daily referansını stable hale getirmek için JSON string karşılaştırması
  const dailyProgressKey = JSON.stringify(progress.daily);

  // Bugünün görevlerini hesapla
  const tasks = useMemo(() => {
    let todayTasks: TodayTask[] = [];
    let routineTasks: RoutineTask[] = [];
    const customTasks = getCustomTasks(targetDate);

    let foundWeek: WeeklyTask | null = null;

    // Tüm haftaları kontrol et
    for (const month of studyPlan.months) {
      for (const week of month.weeks) {
        const weekStart = parseISO(week.dateRange.start);
        const weekEnd = parseISO(week.dateRange.end);

        // Bu tarih bu hafta içinde mi?
        if (targetDate >= weekStart && targetDate <= weekEnd) {
          foundWeek = week;
          break;
        }
      }
      if (foundWeek) break;
    }

    // Eğer bugünün tarihi plan aralığında değilse, ilk haftanın görevlerini göster
    const weekToUse = foundWeek || studyPlan.months[0]?.weeks[0];

    if (weekToUse) {
      routineTasks = createRoutineTasks(
        weekToUse,
        dateISO,
        isTaskCompleted,
        targetDate,
        currentMonth
      );

      todayTasks = createSubjectTasks(
        weekToUse,
        dateISO,
        isTaskCompleted,
        targetDate,
        currentMonth
      );
    }

    // Custom tasks'ları ekle
    customTasks.forEach((customTask) => {
      todayTasks.push({
        id: customTask.id,
        subject: customTask.subject,
        title: customTask.title,
        description: customTask.description,
        date: customTask.date,
        type: customTask.type,
        completed: isTaskCompleted(customTask.id, targetDate),
        timeSlot: customTask.timeSlot,
      });
    });

    return {
      studyTasks: todayTasks,
      routineTasks,
    };
  }, [targetDate, dateISO, getCustomTasks, isTaskCompleted, dailyProgressKey, currentMonth]);

  return tasks;
}
