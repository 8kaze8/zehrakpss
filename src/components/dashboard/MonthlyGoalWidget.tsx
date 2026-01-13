/**
 * MonthlyGoalWidget Component
 * Aylık hedef progress widget
 */

"use client";

import React from "react";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { Card } from "@/components/shared/Card";
import { CircularProgress } from "@/components/shared/CircularProgress";
import { formatNumber } from "@/utils/formatters";
import { useStudyProgressContext } from "@/context/StudyProgressContext";
import { calculateMonthlyProgress } from "@/utils/progress-calculator";
import type { Month } from "@/types";

export function MonthlyGoalWidget() {
  const { progress } = useStudyProgressContext();
  
  // Şu anki ay ve yıl
  const today = new Date();
  const currentMonth = format(today, "MMMM", { locale: tr }).toUpperCase() as Month;
  const currentYear = today.getFullYear();
  
  // Aylık ilerlemeyi hesapla
  const monthlyProgress = calculateMonthlyProgress(currentMonth, currentYear, progress);
  
  const solvedQuestions = monthlyProgress.solvedQuestions;
  const remainingQuestions = monthlyProgress.remainingQuestions;
  const percentage = monthlyProgress.percentage;

  return (
    <section className="px-6 pb-6">
      <Card>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-text-main dark:text-white">
              Aylık Hedef
            </h3>
            <p className="text-sm text-text-sub">
              {format(today, "MMMM yyyy", { locale: tr })} İlerlemesi
            </p>
          </div>
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
            <span className="material-symbols-outlined" style={{ fontSize: 20 }}>
              trending_up
            </span>
          </div>
        </div>
        <div className="mt-2 flex items-center justify-center gap-6">
          <CircularProgress percentage={percentage} size={128} />
          <div className="flex flex-1 flex-col gap-3">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-primary" />
              <span className="text-sm font-medium text-text-main dark:text-gray-200">
                Çözülen Soru
              </span>
              <span className="ml-auto text-sm font-bold text-text-main dark:text-white">
                {formatNumber(solvedQuestions)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-gray-300 dark:bg-gray-600" />
              <span className="text-sm font-medium text-text-sub">Kalan</span>
              <span className="ml-auto text-sm font-bold text-text-sub">
                {formatNumber(remainingQuestions)}
              </span>
            </div>
          </div>
        </div>
      </Card>
    </section>
  );
}
