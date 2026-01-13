/**
 * useStudyProgress Hook
 * Çalışma ilerlemesini yöneten hook
 */

import { useMemo } from "react";
import { getOrInitializeProgress } from "@/utils/storage";
import { getWeekId, getMonthYearKey, toISODate } from "@/utils/date";
import type { UserProgress, TaskCompletion, WeeklyProgress, MonthlyProgress } from "@/types";

/**
 * Progress yönetimi için hook
 */
export function useStudyProgress() {
  const progress = useMemo(() => getOrInitializeProgress(), []);

  /**
   * Görevi tamamla
   */
  const completeTask = (taskId: string, date: Date | string = new Date()) => {
    const dateISO = toISODate(date);
    const timestamp = new Date().toISOString();

    // Daily progress'i güncelle
    if (!progress.daily[dateISO]) {
      progress.daily[dateISO] = {
        date: dateISO,
        tasks: [],
        routineCompleted: false,
      };
    }

    // Task zaten tamamlanmış mı kontrol et
    const existingTask = progress.daily[dateISO].tasks.find(
      (t) => t.taskId === taskId
    );

    if (existingTask) {
      existingTask.completed = true;
      existingTask.completedAt = timestamp;
    } else {
      progress.daily[dateISO].tasks.push({
        taskId,
        completed: true,
        completedAt: timestamp,
      });
    }
  };

  /**
   * Görevi tamamlanmamış olarak işaretle
   */
  const uncompleteTask = (taskId: string, date: Date | string = new Date()) => {
    const dateISO = toISODate(date);

    if (progress.daily[dateISO]) {
      const taskIndex = progress.daily[dateISO].tasks.findIndex(
        (t) => t.taskId === taskId
      );

      if (taskIndex !== -1) {
        progress.daily[dateISO].tasks[taskIndex].completed = false;
      }
    }
  };

  /**
   * Görevin tamamlanıp tamamlanmadığını kontrol et
   */
  const isTaskCompleted = (taskId: string, date: Date | string = new Date()): boolean => {
    const dateISO = toISODate(date);
    const daily = progress.daily[dateISO];

    if (!daily) return false;

    return daily.tasks.some(
      (t) => t.taskId === taskId && t.completed
    );
  };

  /**
   * Haftalık ilerlemeyi hesapla
   */
  const getWeeklyProgress = (weekId: string): WeeklyProgress => {
    if (progress.weekly[weekId]) {
      return progress.weekly[weekId];
    }

    // Haftalık ilerlemeyi hesapla
    const weekly: WeeklyProgress = {
      weekId,
      completedTasks: 0,
      totalTasks: 0,
      percentage: 0,
    };

    // Bu haftaya ait günlük görevleri say
    // (Basitleştirilmiş - gerçek implementasyonda study plan'dan alınmalı)
    Object.values(progress.daily).forEach((daily) => {
      weekly.totalTasks += daily.tasks.length;
      weekly.completedTasks += daily.tasks.filter((t) => t.completed).length;
    });

    if (weekly.totalTasks > 0) {
      weekly.percentage = Math.round(
        (weekly.completedTasks / weekly.totalTasks) * 100
      );
    }

    return weekly;
  };

  /**
   * Aylık ilerlemeyi hesapla
   */
  const getMonthlyProgress = (
    month: string,
    year: number
  ): MonthlyProgress => {
    const key = getMonthYearKey(month, year);

    if (progress.monthly[key]) {
      return progress.monthly[key];
    }

    // Varsayılan değerler (gerçek implementasyonda hesaplanmalı)
    return {
      month: month as any,
      year,
      solvedQuestions: 0,
      remainingQuestions: 0,
      percentage: 0,
    };
  };

  return {
    progress,
    completeTask,
    uncompleteTask,
    isTaskCompleted,
    getWeeklyProgress,
    getMonthlyProgress,
  };
}
