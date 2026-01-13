/**
 * WeeklyGoalCard Component
 * Haftalık hedef ve deneme takip kartı
 */

"use client";

import React from "react";
import { parseISO, isAfter, isBefore, isSameDay } from "date-fns";
import { Card } from "@/components/shared/Card";
import { ProgressBar } from "@/components/shared/ProgressBar";
import { studyPlan } from "@/data/study-plan";
import { useStudyProgressContext } from "@/context/StudyProgressContext";
import type { WeeklyTask } from "@/types";

/**
 * Bugünün haftasını bul
 */
function getCurrentWeek(): WeeklyTask | null {
  const today = new Date();

  for (const month of studyPlan.months) {
    for (const week of month.weeks) {
      const start = parseISO(week.dateRange.start);
      const end = parseISO(week.dateRange.end);

      if (
        (isAfter(today, start) || isSameDay(today, start)) &&
        (isBefore(today, end) || isSameDay(today, end))
      ) {
        return week;
      }
    }
  }

  // Bugün plan aralığında değilse ilk haftayı döndür
  return studyPlan.months[0]?.weeks[0] || null;
}

/**
 * Haftalık hedeften deneme sayısını çıkar
 */
function parseExamCount(weeklyGoal: string): { count: number; type: string } {
  // "2 Adet Matematik Branş Denemesi" -> { count: 2, type: "Matematik Branş" }
  // "1 Adet TG Deneme" -> { count: 1, type: "TG" }
  const match = weeklyGoal.match(/(\d+)\s*Adet\s*(.+?)\s*Deneme/i);
  if (match) {
    return { count: parseInt(match[1], 10), type: match[2].trim() };
  }

  // "Mat Deneme Analizi (10 Boş)" gibi durumlar
  if (weeklyGoal.toLowerCase().includes("deneme")) {
    return { count: 1, type: weeklyGoal };
  }

  return { count: 0, type: "" };
}

export function WeeklyGoalCard() {
  const { progress } = useStudyProgressContext();
  const currentWeek = getCurrentWeek();

  if (!currentWeek) {
    return null;
  }

  const { weeklyGoal, weekNumber, dateRange } = currentWeek;
  const examInfo = parseExamCount(weeklyGoal || "");

  // Tamamlanan deneme sayısını hesapla (custom tasks'tan)
  const completedExams = (progress.customTasks || []).filter((task) => {
    const taskDate = parseISO(task.date);
    const weekStart = parseISO(dateRange.start);
    const weekEnd = parseISO(dateRange.end);

    return (
      task.type === "exam" &&
      task.completed &&
      (isAfter(taskDate, weekStart) || isSameDay(taskDate, weekStart)) &&
      (isBefore(taskDate, weekEnd) || isSameDay(taskDate, weekEnd))
    );
  }).length;

  const examProgress =
    examInfo.count > 0
      ? Math.min(100, Math.round((completedExams / examInfo.count) * 100))
      : 0;

  return (
    <section className="px-6 pb-4">
      <Card className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border border-amber-200/50 dark:border-amber-800/30">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-900/40">
              <span className="material-symbols-outlined text-amber-600 dark:text-amber-400" style={{ fontSize: 22 }}>
                flag
              </span>
            </div>
            <div>
              <h3 className="text-sm font-bold text-amber-800 dark:text-amber-300">
                Bu Haftanın Hedefi
              </h3>
              <p className="text-xs text-amber-600/70 dark:text-amber-400/70">
                {weekNumber}. Hafta
              </p>
            </div>
          </div>
          {examInfo.count > 0 && (
            <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-amber-100 dark:bg-amber-900/40">
              <span className="material-symbols-outlined text-amber-600 dark:text-amber-400" style={{ fontSize: 16 }}>
                quiz
              </span>
              <span className="text-xs font-bold text-amber-700 dark:text-amber-300">
                {completedExams}/{examInfo.count}
              </span>
            </div>
          )}
        </div>

        <p className="text-base font-semibold text-amber-900 dark:text-amber-100 mb-3">
          {weeklyGoal}
        </p>

        {examInfo.count > 0 && (
          <div className="mt-2">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-amber-700 dark:text-amber-300">Deneme İlerlemesi</span>
              <span className="font-bold text-amber-800 dark:text-amber-200">{examProgress}%</span>
            </div>
            <ProgressBar
              percentage={examProgress}
              height="sm"
              color="bg-amber-500"
            />
          </div>
        )}
      </Card>
    </section>
  );
}
