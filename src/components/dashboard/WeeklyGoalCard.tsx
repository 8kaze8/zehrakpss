/**
 * WeeklyGoalCard Component
 * Haftalık hedef ve deneme takip kartı
 */

"use client";

import React, { useState, useMemo } from "react";
import { parseISO, isAfter, isBefore, isSameDay, format } from "date-fns";
import { tr } from "date-fns/locale";
import { Card } from "@/components/shared/Card";
import { Button } from "@/components/shared/Button";
import { studyPlan } from "@/data/study-plan";
import { useStudyProgressContext } from "@/context/StudyProgressContext";
import { WeekendGoalDetailModal } from "@/components/calendar/WeekendGoalDetailModal";
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
  const { progress, getExams } = useStudyProgressContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const currentWeek = getCurrentWeek();

  if (!currentWeek) {
    return null;
  }

  const { weeklyGoal, weekNumber, dateRange } = currentWeek;
  const examInfo = parseExamCount(weeklyGoal || "");

  // Hafta sonu günlerini bul (Cumartesi veya Pazar)
  const weekendDate = useMemo(() => {
    const saturday = new Date(parseISO(dateRange.start));
    const sunday = new Date(parseISO(dateRange.start));
    
    // Bu haftanın cumartesi ve pazarını bul
    while (saturday.getDay() !== 6) {
      saturday.setDate(saturday.getDate() + 1);
    }
    while (sunday.getDay() !== 0) {
      sunday.setDate(sunday.getDate() + 1);
    }
    
    // En yakın hafta sonu gününü seç
    const today = new Date();
    const daysUntilSaturday = Math.abs((saturday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    const daysUntilSunday = Math.abs((sunday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    return daysUntilSaturday <= daysUntilSunday ? saturday : sunday;
  }, [dateRange]);

  // Hafta sonu hedefi için tamamlanmış exam'ları bul
  // Sadece hafta sonu hedefi tarihine eşleşen ve branch tipindeki denemeleri göster
  const weekExams = useMemo(() => {
    const allExams = progress.exams || [];
    const weekendDateStr = format(weekendDate, "yyyy-MM-dd");
    
    return allExams.filter((exam) => {
      // Sadece hafta sonu hedefi tarihine eşleşen ve branch tipindeki denemeleri göster
      // Genel denemeler burada gösterilmemeli
      return (
        exam.completed &&
        exam.date === weekendDateStr &&
        exam.type === "branch" // Sadece branch denemeleri
      );
    });
  }, [progress.exams, weekendDate]);

  // Tamamlanmış mı kontrol et
  const isCompleted = weekExams.length >= examInfo.count;
  
  // İlk tamamlanmış exam'ı bul (sonuçları göstermek için)
  const completedExam = weekExams[0] || null;
  const hasResults = completedExam?.results?.total;

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
                {weekExams.length}/{examInfo.count}
              </span>
            </div>
          )}
        </div>

        <p className="text-base font-semibold text-amber-900 dark:text-amber-100 mb-3">
          {weeklyGoal}
        </p>

        {/* Durum: Tamamlandı veya Tamamlanmadı */}
        <div className="space-y-3 mb-3">
          <div className="flex items-center gap-2">
            {isCompleted ? (
              <span className="px-3 py-1 text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-md">
                Tamamlandı
              </span>
            ) : (
              <span className="px-3 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-400 rounded-md">
                Tamamlanmadı
              </span>
            )}
          </div>
          
          {/* Sonuçlar sadece tamamlandıysa göster */}
          {isCompleted && hasResults && (
            <div className="p-3 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
              <p className="text-xs font-medium text-text-sub dark:text-slate-400 mb-2">
                Sonuçlar
              </p>
              <div className="flex items-center justify-between">
                <div className="flex gap-4 text-xs">
                  <div>
                    <span className="text-text-sub dark:text-slate-400">Doğru: </span>
                    <span className="font-semibold text-green-600 dark:text-green-400">
                      {hasResults.correct}
                    </span>
                  </div>
                  <div>
                    <span className="text-text-sub dark:text-slate-400">Yanlış: </span>
                    <span className="font-semibold text-red-600 dark:text-red-400">
                      {hasResults.wrong}
                    </span>
                  </div>
                  <div>
                    <span className="text-text-sub dark:text-slate-400">Boş: </span>
                    <span className="font-semibold text-text-sub dark:text-slate-400">
                      {hasResults.empty}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs text-text-sub dark:text-slate-400">Net</span>
                  <p className="text-lg font-bold text-primary dark:text-blue-400">
                    {hasResults.net.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Detayları İncele Butonu */}
        <Button
          variant="secondary"
          size="sm"
          fullWidth
          onClick={() => setIsModalOpen(true)}
          className="bg-white dark:bg-gray-700 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 hover:bg-amber-50 dark:hover:bg-amber-900/20"
          icon="arrow_forward"
          iconPosition="right"
        >
          Detayları İncele
        </Button>
      </Card>

      {/* Detail Modal */}
      <WeekendGoalDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        goal={{
          id: `weekly-goal-${weekNumber}`,
          title: weeklyGoal || "",
          description: "Haftalık deneme sınavı hedefi",
          day: format(weekendDate, "EEEE", { locale: tr }),
          date: format(weekendDate, "yyyy-MM-dd"),
          progress: isCompleted ? 100 : 0,
        }}
      />
    </section>
  );
}
