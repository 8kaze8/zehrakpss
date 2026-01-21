/**
 * WeekendGoalsCard Component
 * Hafta sonu hedefleri kartı
 */

"use client";

import React, { useMemo, useState } from "react";
import { parseISO, format, isWeekend, isSaturday, isSunday } from "date-fns";
import { tr } from "date-fns/locale";
import { Card } from "@/components/shared/Card";
import { ProgressBar } from "@/components/shared/ProgressBar";
import { Button } from "@/components/shared/Button";
import { studyPlan } from "@/data/study-plan";
import { useStudyProgressContext } from "@/context/StudyProgressContext";
import { WeekendGoalDetailModal } from "./WeekendGoalDetailModal";

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
  const { progress, getExams } = useStudyProgressContext();
  const [selectedGoal, setSelectedGoal] = useState<WeekendGoal | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
          // Hafta sonu için tek bir hedef göster (Cumartesi veya Pazar - hangisi daha yakınsa)
          const today = new Date(currentDate);
          const daysUntilSaturday = Math.abs((saturday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
          const daysUntilSunday = Math.abs((sunday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
          
          // En yakın hafta sonu gününü seç
          const targetDay = daysUntilSaturday <= daysUntilSunday ? saturday : sunday;
          const dayName = daysUntilSaturday <= daysUntilSunday ? "Cumartesi" : "Pazar";
          
          if (targetDay >= weekStart && targetDay <= weekEnd) {
            goals.push({
              id: `weekend-${format(targetDay, "yyyy-MM-dd")}`,
              title: week.weeklyGoal,
              description: "Hafta sonu deneme sınavı",
              day: dayName,
              date: format(targetDay, "yyyy-MM-dd"),
              progress: 0,
            });
          }
          break;
        }
      }
    }

    return goals;
  }, [currentDate]);
  
  // Tüm hedefleri göster (tamamlanmış olanlar sonuçlarıyla gösterilir)
  const filteredGoals = useMemo(() => {
    return weekendGoals;
  }, [weekendGoals]);

  if (weekendGoals.length === 0) {
    return null;
  }

  return (
    <div className="px-4 mb-8">
      <h2 className="text-xl font-bold text-text-main dark:text-white tracking-tight mb-3">
        Hafta Sonu Hedefleri
      </h2>
      {filteredGoals.map((goal) => {
        // Bu tarihe ait tamamlanmış sınav var mı?
        // progress.exams değiştiğinde yeniden hesapla
        const allExams = progress.exams || [];
        const exam = allExams.find((e) => {
          // Tarih eşleşmesi ve tamamlanmış olmalı
          return e.date === goal.date && e.completed === true;
        }) || null;
        const hasResults = exam?.results?.total;
        
        return (
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
            
            {/* Durum: Tamamlandı veya Tamamlanmadı */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                {exam && exam.completed ? (
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
              {exam && exam.completed && hasResults && (
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
            
            <Button
              variant="secondary"
              size="sm"
              fullWidth
              onClick={() => {
                setSelectedGoal(goal);
                setIsModalOpen(true);
              }}
              className="mt-4 bg-white dark:bg-slate-700 text-primary dark:text-white border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-600"
            >
              Detayları İncele
            </Button>
          </Card>
        );
      })}
      
      {/* Detail Modal */}
      <WeekendGoalDetailModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedGoal(null);
        }}
        goal={selectedGoal}
      />
    </div>
  );
}
