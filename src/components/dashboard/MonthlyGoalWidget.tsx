/**
 * MonthlyGoalWidget Component
 * Aylık hedef progress widget
 */

"use client";

import React from "react";
import { Card } from "@/components/shared/Card";
import { CircularProgress } from "@/components/shared/CircularProgress";
import { formatNumber } from "@/utils/formatters";
import { useStudyProgressContext } from "@/context/StudyProgressContext";

export function MonthlyGoalWidget() {
  const { getMonthlyProgress } = useStudyProgressContext();
  
  // Şu anki ay için progress (örnek: Haziran 2024)
  const monthlyProgress = getMonthlyProgress("HAZİRAN", 2024);
  
  // Varsayılan değerler (gerçek implementasyonda study plan'dan hesaplanmalı)
  const solvedQuestions = monthlyProgress.solvedQuestions || 1240;
  const remainingQuestions = monthlyProgress.remainingQuestions || 650;
  const percentage = monthlyProgress.percentage || 65;

  return (
    <section className="px-6 pb-6">
      <Card>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-text-main dark:text-white">
              Aylık Hedef
            </h3>
            <p className="text-sm text-text-sub">Haziran Ayı İlerlemesi</p>
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
