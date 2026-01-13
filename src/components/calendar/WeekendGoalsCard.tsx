/**
 * WeekendGoalsCard Component
 * Hafta sonu hedefleri kartı
 */

"use client";

import React, { useMemo } from "react";
import { parseISO, format, isWeekend, isSaturday, isSunday } from "date-fns";
import { tr } from "date-fns/locale";
import { Card } from "@/components/shared/Card";
import { ProgressBar } from "@/components/shared/ProgressBar";
import { Button } from "@/components/shared/Button";
import { studyPlan } from "@/data/study-plan";
import { useStudyProgressContext } from "@/context/StudyProgressContext";

interface WeekendGoal {
  id: string;
  title: string;
  description: string;
  day: string;
  date: string;
  progress: number;
}

interface WeekendGoalsCardProps {
  currentDate?: Date;
}

export function WeekendGoalsCard({ currentDate = new Date() }: WeekendGoalsCardProps) {
  const { progress } = useStudyProgressContext();

  // Bu hafta için hafta sonu hedeflerini bul
  const weekendGoals = useMemo(() => {
    const goals: WeekendGoal[] = [];
    const saturday = new Date(currentDate);
    const sunday = new Date(currentDate);

    // Bu haftanın cumartesi ve pazarını bul
    while (!isSaturday(saturday)) {
      saturday.setDate(saturday.getDate() + 1);
    }
    while (!isSunday(sunday)) {
      sunday.setDate(sunday.getDate() + 1);
    }

    // Study plan'dan bu hafta için weekly goal'u bul
    for (const month of studyPlan.months) {
      for (const week of month.weeks) {
        const weekStart = parseISO(week.dateRange.start);
        const weekEnd = parseISO(week.dateRange.end);

        if (
          (currentDate >= weekStart && currentDate <= weekEnd) &&
          week.weeklyGoal
        ) {
          // Hafta sonu günlerini kontrol et
          if (saturday >= weekStart && saturday <= weekEnd) {
            goals.push({
              id: `weekend-${format(saturday, "yyyy-MM-dd")}`,
              title: week.weeklyGoal,
              description: "Hafta sonu deneme sınavı",
              day: "Cumartesi",
              date: format(saturday, "yyyy-MM-dd"),
              progress: 0, // Progress hesaplanacak
            });
          }

          if (sunday >= weekStart && sunday <= weekEnd) {
            goals.push({
              id: `weekend-${format(sunday, "yyyy-MM-dd")}`,
              title: week.weeklyGoal,
              description: "Hafta sonu deneme sınavı",
              day: "Pazar",
              date: format(sunday, "yyyy-MM-dd"),
              progress: 0,
            });
          }
          break;
        }
      }
    }

    return goals;
  }, [currentDate]);

  if (weekendGoals.length === 0) {
    return null;
  }

  return (
    <div className="px-4 mb-8">
      <h2 className="text-xl font-bold text-text-main dark:text-white tracking-tight mb-3">
        Hafta Sonu Hedefleri
      </h2>
      {weekendGoals.map((goal) => (
        <Card
          key={goal.id}
          className="flex flex-col p-5 bg-gradient-to-br from-indigo-50 to-white dark:from-slate-800 dark:to-gray-800 border border-indigo-100 dark:border-indigo-900/30 mb-4"
        >
          <div className="flex items-start gap-4 mb-4">
            <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-blue-400 to-purple-500 shadow-inner flex items-center justify-center">
              <span className="material-symbols-outlined text-white text-3xl">
                school
              </span>
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start mb-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200">
                  Deneme Sınavı
                </span>
                <span className="text-xs text-text-sub dark:text-slate-400 font-medium">
                  {format(parseISO(goal.date), "EEEE", { locale: tr })}
                </span>
              </div>
              <h3 className="text-lg font-bold text-text-main dark:text-white leading-tight">
                {goal.title}
              </h3>
              <p className="text-sm text-text-sub dark:text-slate-400 mt-1">
                {goal.description}
              </p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="font-medium text-text-sub dark:text-slate-400">
                Hazırlık Durumu
              </span>
              <span className="font-bold text-primary dark:text-blue-400">
                {goal.progress}%
              </span>
            </div>
            <ProgressBar
              percentage={goal.progress}
              height="sm"
              color="bg-primary"
            />
          </div>
          <Button
            variant="secondary"
            size="sm"
            fullWidth
            className="mt-4 bg-white dark:bg-slate-700 text-primary dark:text-white border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-600"
          >
            Detayları İncele
          </Button>
        </Card>
      ))}
    </div>
  );
}
