/**
 * WeeklyProgressCard Component
 * Haftalık ilerleme kartı
 */

"use client";

import React from "react";
import { Card } from "@/components/shared/Card";
import { ProgressBar } from "@/components/shared/ProgressBar";
import { useStudyProgressContext } from "@/context/StudyProgressContext";
import { calculateWeeklyProgress } from "@/utils/progress-calculator";
import { getWeekId } from "@/utils/date";

interface WeeklyProgressCardProps {
  weekId: string;
}

export function WeeklyProgressCard({ weekId }: WeeklyProgressCardProps) {
  const { progress } = useStudyProgressContext();
  const weeklyProgress = calculateWeeklyProgress(weekId, progress);

  const getMotivationalMessage = (percentage: number): string => {
    if (percentage >= 75) return "Çok iyi gidiyorsun!";
    if (percentage >= 50) return "İyi gidiyorsun!";
    if (percentage >= 25) return "Devam et!";
    return "Başlangıç";
  };

  return (
    <div className="px-4 mb-6">
      <Card className="relative overflow-hidden">
        {/* Decorative background blob */}
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex items-start justify-between mb-4 relative z-10">
          <div>
            <h2 className="text-lg font-bold text-text-main dark:text-white tracking-tight">
              Haftalık Hedef
            </h2>
            <p className="text-sm text-text-sub dark:text-slate-400 mt-1">
              Bu hafta planlanan çalışmaların %{weeklyProgress.percentage}'i tamamlandı.
            </p>
          </div>
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 dark:bg-slate-800 text-primary">
            <span className="material-symbols-outlined filled">trending_up</span>
          </div>
        </div>
        
        <ProgressBar
          percentage={weeklyProgress.percentage}
          height="md"
          color="bg-gradient-to-r from-primary to-blue-400"
          animated
        />
        
        <div className="flex justify-between mt-2 text-xs font-medium text-text-sub dark:text-slate-500">
          <span>Başlangıç</span>
          <span className="text-primary dark:text-blue-400">
            {getMotivationalMessage(weeklyProgress.percentage)}
          </span>
          <span>Hedef</span>
        </div>
      </Card>
    </div>
  );
}
