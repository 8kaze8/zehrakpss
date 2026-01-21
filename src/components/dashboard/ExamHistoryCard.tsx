/**
 * ExamHistoryCard Component
 * Deneme sınavları kartı - Son 2 denemeyi gösterir
 */

"use client";

import React, { useMemo } from "react";
import { useRouter } from "next/navigation";
import { format, parseISO } from "date-fns";
import { tr } from "date-fns/locale";
import { Card } from "@/components/shared/Card";
import { Button } from "@/components/shared/Button";
import { useStudyProgressContext } from "@/context/StudyProgressContext";
import { cn } from "@/utils/cn";

export function ExamHistoryCard() {
  const { progress } = useStudyProgressContext();
  const router = useRouter();
  
  // Son 2 tamamlanmış denemeyi al (tarihe göre sırala)
  const recentExams = useMemo(() => {
    const exams = progress.exams || [];
    return exams
      .filter((exam) => exam.completed) // Sadece tamamlananları göster
      .sort((a, b) => {
        const dateA = parseISO(a.date);
        const dateB = parseISO(b.date);
        return dateB.getTime() - dateA.getTime();
      })
      .slice(0, 2);
  }, [progress.exams]);
  
  return (
    <section className="px-6 pb-6">
      <Card variant="default" padding="lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary dark:text-blue-400">
              school
            </span>
            <h2 className="text-lg font-bold text-text-main dark:text-white">
              Deneme Sınavlarım
            </h2>
          </div>
          {recentExams.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/exams")}
              className="text-primary dark:text-blue-400"
            >
              Tümünü Gör
            </Button>
          )}
        </div>
        
        {recentExams.length === 0 ? (
          <div className="py-8 text-center">
            <span className="material-symbols-outlined text-4xl text-text-sub dark:text-slate-400 mb-3 block">
              school
            </span>
            <p className="text-sm text-text-sub dark:text-slate-400">
              Henüz deneme çözülmedi
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {recentExams.map((exam) => {
            const examDate = parseISO(exam.date);
            const formattedDate = format(examDate, "d MMMM yyyy", { locale: tr });
            const net = exam.results?.total?.net || 0;
            const correct = exam.results?.total?.correct || 0;
            const wrong = exam.results?.total?.wrong || 0;
            const empty = exam.results?.total?.empty || 0;
            
            return (
              <div
                key={exam.id}
                onClick={() => router.push("/exams")}
                className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-primary/30 dark:hover:border-blue-500/30 transition-colors cursor-pointer"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="text-base font-semibold text-text-main dark:text-white mb-1">
                      {exam.title}
                    </h3>
                    <p className="text-xs text-text-sub dark:text-slate-400">
                      {formattedDate}
                    </p>
                  </div>
                  {exam.completed && (
                    <span className="px-2 py-1 text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-md">
                      Tamamlandı
                    </span>
                  )}
                </div>
                
                {exam.results?.total && (
                  <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                      <div className="flex gap-4 text-xs">
                        <div>
                          <span className="text-text-sub dark:text-slate-400">Doğru: </span>
                          <span className="font-semibold text-green-600 dark:text-green-400">
                            {correct}
                          </span>
                        </div>
                        <div>
                          <span className="text-text-sub dark:text-slate-400">Yanlış: </span>
                          <span className="font-semibold text-red-600 dark:text-red-400">
                            {wrong}
                          </span>
                        </div>
                        <div>
                          <span className="text-text-sub dark:text-slate-400">Boş: </span>
                          <span className="font-semibold text-text-sub dark:text-slate-400">
                            {empty}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-xs text-text-sub dark:text-slate-400">Net</span>
                        <p className="text-lg font-bold text-primary dark:text-blue-400">
                          {net.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
          </div>
        )}
      </Card>
    </section>
  );
}
