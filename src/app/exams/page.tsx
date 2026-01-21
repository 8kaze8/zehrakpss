/**
 * Exams Page
 * Tüm deneme sınavları sayfası
 */

"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { format, parseISO } from "date-fns";
import { tr } from "date-fns/locale";
import { Header } from "@/components/layout/Header";
import { Card } from "@/components/shared/Card";
import { Button } from "@/components/shared/Button";
import { useStudyProgressContext } from "@/context/StudyProgressContext";
import { WeekendGoalDetailModal } from "@/components/calendar/WeekendGoalDetailModal";
import { cn } from "@/utils/cn";
import type { Exam } from "@/types/task";

export default function ExamsPage() {
  const { progress, isLoading } = useStudyProgressContext();
  const router = useRouter();
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Tüm denemeleri tarihe göre sırala (en yeni önce)
  const exams = useMemo(() => {
    const allExams = progress.exams || [];
    return allExams.sort((a, b) => {
      const dateA = parseISO(a.date);
      const dateB = parseISO(b.date);
      return dateB.getTime() - dateA.getTime();
    });
  }, [progress.exams]);
  
  // Loading state
  if (isLoading) {
    return (
      <>
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <span className="text-sm text-text-sub dark:text-slate-400">Yükleniyor...</span>
          </div>
        </main>
      </>
    );
  }
  
  const handleExamClick = (exam: Exam) => {
    // Exam'i WeekendGoal formatına çevir
    const goal = {
      id: exam.id,
      title: exam.title,
      description: exam.type === "branch" && exam.subject 
        ? `${exam.subject} Branş Denemesi`
        : exam.type === "tg"
        ? "Türkiye Geneli Deneme"
        : "Genel Deneme",
      day: format(parseISO(exam.date), "EEEE", { locale: tr }),
      date: exam.date,
      progress: exam.completed ? 100 : 0,
    };
    
    setSelectedExam(exam);
    setIsModalOpen(true);
  };
  
  return (
    <>
      <Header />
      <main className="flex-1 overflow-y-auto p-6">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 mb-6 text-text-sub dark:text-slate-400 hover:text-text-main dark:hover:text-white transition-colors"
          aria-label="Geri git"
        >
          <span className="material-symbols-outlined" aria-hidden="true">arrow_back</span>
          <span className="text-sm font-medium">Geri</span>
        </button>
        
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-text-main dark:text-white mb-2">
            Deneme Sınavlarım
          </h1>
          <p className="text-sm text-text-sub dark:text-slate-400">
            {exams.length} deneme sınavı
          </p>
        </div>
        
        {/* Exams List */}
        {exams.length === 0 ? (
          <Card className="p-12 text-center">
            <span className="material-symbols-outlined text-6xl text-text-sub dark:text-slate-400 mb-4">
              school
            </span>
            <h3 className="text-lg font-semibold text-text-main dark:text-white mb-2">
              Henüz deneme sınavı yok
            </h3>
            <p className="text-sm text-text-sub dark:text-slate-400 mb-4">
              İlk deneme sınavınızı ekleyerek başlayın
            </p>
            <Button
              variant="primary"
              onClick={() => router.push("/")}
            >
              Ana Sayfaya Dön
            </Button>
          </Card>
        ) : (
          <div className="space-y-4">
            {exams.map((exam) => {
              const examDate = parseISO(exam.date);
              const formattedDate = format(examDate, "d MMMM yyyy, EEEE", { locale: tr });
              const net = exam.results?.total?.net || 0;
              const correct = exam.results?.total?.correct || 0;
              const wrong = exam.results?.total?.wrong || 0;
              const empty = exam.results?.total?.empty || 0;
              
              return (
                <Card
                  key={exam.id}
                  onClick={() => handleExamClick(exam)}
                  className="p-5 cursor-pointer hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="material-symbols-outlined text-primary dark:text-blue-400">
                          school
                        </span>
                        <h3 className="text-lg font-semibold text-text-main dark:text-white">
                          {exam.title}
                        </h3>
                      </div>
                      <p className="text-sm text-text-sub dark:text-slate-400">
                        {formattedDate}
                      </p>
                      {exam.subject && (
                        <span className="inline-block mt-2 px-2 py-1 text-xs font-medium bg-primary/10 text-primary dark:bg-blue-900/30 dark:text-blue-400 rounded-md">
                          {exam.subject}
                        </span>
                      )}
                    </div>
                    {exam.completed && (
                      <span className="px-3 py-1 text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-md">
                        Tamamlandı
                      </span>
                    )}
                  </div>
                  
                  {exam.results?.total && (
                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex items-center justify-between">
                        <div className="flex gap-6 text-sm">
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
                          <span className="text-xs text-text-sub dark:text-slate-400 block mb-1">
                            Net
                          </span>
                          <p className="text-2xl font-bold text-primary dark:text-blue-400">
                            {net.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {!exam.results?.total && exam.completed && (
                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <p className="text-sm text-text-sub dark:text-slate-400">
                        Sonuç girilmemiş
                      </p>
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        )}
      </main>
      
      {/* Detail Modal */}
      {selectedExam && (
        <WeekendGoalDetailModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedExam(null);
          }}
          goal={{
            id: selectedExam.id,
            title: selectedExam.title,
            description: selectedExam.type === "branch" && selectedExam.subject 
              ? `${selectedExam.subject} Branş Denemesi`
              : selectedExam.type === "tg"
              ? "Türkiye Geneli Deneme"
              : "Genel Deneme",
            day: format(parseISO(selectedExam.date), "EEEE", { locale: tr }),
            date: selectedExam.date,
            progress: selectedExam.completed ? 100 : 0,
          }}
        />
      )}
    </>
  );
}
