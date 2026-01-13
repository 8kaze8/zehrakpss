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
import { studyPlan } from "@/data/study-plan";
import type { Month } from "@/types";

// Ay ismini index'e çevir
function getMonthIndex(month: Month): number {
  const months: Month[] = ["OCAK", "ŞUBAT", "MART", "NİSAN", "MAYIS", "HAZİRAN", "TEMMUZ", "AĞUSTOS", "EYLÜL", "EKİM", "KASIM", "ARALIK"];
  return months.indexOf(month);
}

export function MonthlyGoalWidget() {
  const { progress } = useStudyProgressContext();
  
  // Study plan'dan ilk ayı al (2024 OCAK)
  // Eğer şu anki tarih plan aralığında değilse, planın ilk ayını göster
  const today = new Date();
  const studyPlanStart = new Date(studyPlan.startDate);
  const studyPlanEnd = new Date(studyPlan.endDate);
  
  let displayMonth: Month;
  let displayYear: number;
  
  if (today >= studyPlanStart && today <= studyPlanEnd) {
    // Plan aralığındaysa şu anki ayı göster
    displayMonth = format(today, "MMMM", { locale: tr }).toUpperCase() as Month;
    displayYear = today.getFullYear();
  } else {
    // Plan aralığında değilse planın ilk ayını göster
    displayMonth = studyPlan.months[0]?.month || "OCAK";
    displayYear = studyPlan.months[0]?.year || 2024;
  }
  
  // Aylık ilerlemeyi hesapla - progress değiştiğinde yeniden hesapla
  // progress.daily'nin içeriğini serialize ederek değişikliği algıla
  const progressDailySerialized = React.useMemo(() => {
    return JSON.stringify(
      Object.entries(progress.daily || {}).map(([date, daily]) => [
        date,
        daily.tasks?.filter(t => t.completed).length || 0
      ])
    );
  }, [progress.daily]);
  
  const monthlyProgress = React.useMemo(() => {
    return calculateMonthlyProgress(displayMonth, displayYear, progress);
  }, [displayMonth, displayYear, progressDailySerialized]);
  
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
              {format(new Date(displayYear, getMonthIndex(displayMonth), 1), "MMMM yyyy", { locale: tr })} İlerlemesi
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
