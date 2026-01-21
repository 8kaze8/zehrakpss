/**
 * WeekendGoalDetailModal Component
 * Hafta sonu hedefi detay modalı - Net hesaplayıcı ve sınav yapıldı checkbox'ı
 */

"use client";

import React, { useState, useEffect, useMemo } from "react";
import { format, parseISO } from "date-fns";
import { tr } from "date-fns/locale";
import { cn } from "@/utils/cn";
import { Button } from "@/components/shared/Button";
import { Checkbox } from "@/components/shared/Checkbox";
import { useStudyProgressContext } from "@/context/StudyProgressContext";
import type { Subject } from "@/types";
import type { Exam } from "@/types/task";

interface WeekendGoal {
  id: string;
  title: string;
  description: string;
  day: string;
  date: string;
  progress: number;
}

interface WeekendGoalDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  goal?: WeekendGoal | null;
  exam?: Exam | null;
}

export function WeekendGoalDetailModal({
  isOpen,
  onClose,
  goal,
  exam: examProp,
}: WeekendGoalDetailModalProps) {
  const { progress, addExam, updateExam, deleteExam, getExams } = useStudyProgressContext();
  
  // Form state
  const [isCompleted, setIsCompleted] = useState(false);
  const [correct, setCorrect] = useState("");
  const [wrong, setWrong] = useState("");
  const [empty, setEmpty] = useState("");
  
  // Genel deneme için her ders için sonuçlar
  const [generalResults, setGeneralResults] = useState<Record<string, { correct: string; wrong: string; empty: string }>>({
    turkce: { correct: "", wrong: "", empty: "" },
    matematik: { correct: "", wrong: "", empty: "" },
    tarih: { correct: "", wrong: "", empty: "" },
    cografya: { correct: "", wrong: "", empty: "" },
    vatandaslik: { correct: "", wrong: "", empty: "" },
  });
  
  // Exam prop'u varsa onu kullan, yoksa goal'dan exam'i bul
  const existingExam = useMemo(() => {
    if (examProp) return examProp;
    if (!goal) return null;
    const exams = getExams();
    // Önce goal.id ile eşleşen exam'ı bul
    const examById = exams.find((exam) => exam.id === goal.id);
    if (examById) return examById;
    // Yoksa tarihe göre bul
    return exams.find((exam) => exam.date === goal.date) || null;
  }, [goal, examProp, getExams, progress.exams]);
  
  const currentExam = existingExam;
  
  // Modal açıldığında mevcut sınav verilerini yükle
  useEffect(() => {
    if (isOpen && currentExam) {
      setIsCompleted(currentExam.completed);
      if (currentExam.type === "general" && currentExam.results) {
        // Genel deneme için her ders için sonuçları yükle
        const newResults: Record<string, { correct: string; wrong: string; empty: string }> = {
          turkce: { correct: "", wrong: "", empty: "" },
          matematik: { correct: "", wrong: "", empty: "" },
          tarih: { correct: "", wrong: "", empty: "" },
          cografya: { correct: "", wrong: "", empty: "" },
          vatandaslik: { correct: "", wrong: "", empty: "" },
        };
        
        Object.keys(newResults).forEach((key) => {
          const result = currentExam.results?.[key as keyof typeof currentExam.results];
          if (result) {
            newResults[key] = {
              correct: result.correct.toString(),
              wrong: result.wrong.toString(),
              empty: result.empty.toString(),
            };
          }
        });
        setGeneralResults(newResults);
      } else if (currentExam.results?.total) {
        setCorrect(currentExam.results.total.correct.toString());
        setWrong(currentExam.results.total.wrong.toString());
        setEmpty(currentExam.results.total.empty.toString());
      }
    } else if (isOpen) {
      setIsCompleted(false);
      setCorrect("");
      setWrong("");
      setEmpty("");
      setGeneralResults({
        turkce: { correct: "", wrong: "", empty: "" },
        matematik: { correct: "", wrong: "", empty: "" },
        tarih: { correct: "", wrong: "", empty: "" },
        cografya: { correct: "", wrong: "", empty: "" },
        vatandaslik: { correct: "", wrong: "", empty: "" },
      });
    }
  }, [isOpen, currentExam]);
  
  // ESC tuşu ile kapat
  useEffect(() => {
    if (!isOpen) return;
    
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);
  
  // Modal açıkken scroll'u engelle
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);
  
  // Net hesapla: 4 yanlış 1 doğruyu götürüyor
  const calculateNet = (correctVal: number, wrongVal: number): number => {
    return Math.max(0, correctVal - wrongVal / 4);
  };
  
  const net = useMemo(() => {
    const c = parseInt(correct) || 0;
    const w = parseInt(wrong) || 0;
    return calculateNet(c, w);
  }, [correct, wrong]);
  
  // Genel deneme için her ders için net hesapla
  const calculateSubjectNet = (subjectKey: string): number => {
    const result = generalResults[subjectKey];
    const c = parseInt(result.correct) || 0;
    const w = parseInt(result.wrong) || 0;
    return calculateNet(c, w);
  };
  
  // Genel deneme için toplam net hesapla
  const calculateTotalNet = (): number => {
    let totalCorrect = 0;
    let totalWrong = 0;
    
    Object.values(generalResults).forEach((result) => {
      totalCorrect += parseInt(result.correct) || 0;
      totalWrong += parseInt(result.wrong) || 0;
    });
    
    return calculateNet(totalCorrect, totalWrong);
  };
  
  // Genel deneme için toplam doğru/yanlış/boş
  const calculateTotalStats = () => {
    let totalCorrect = 0;
    let totalWrong = 0;
    let totalEmpty = 0;
    
    Object.values(generalResults).forEach((result) => {
      totalCorrect += parseInt(result.correct) || 0;
      totalWrong += parseInt(result.wrong) || 0;
      totalEmpty += parseInt(result.empty) || 0;
    });
    
    return { correct: totalCorrect, wrong: totalWrong, empty: totalEmpty };
  };
  
  const handleSave = async () => {
    if (!goal && !currentExam) return;
    
    const examToUse = currentExam || (goal ? {
      id: goal.id,
      title: goal.title,
      type: "branch" as const,
      date: goal.date,
      completed: false,
      createdAt: new Date().toISOString(),
    } : null);
    
    if (!examToUse) return;
    
    // Checkbox kaldırıldıysa sınavı sil
    if (!isCompleted) {
      if (currentExam) {
        await deleteExam(currentExam.id);
      }
      onClose();
      return;
    }
    
    // Checkbox işaretliyse sonuçları kaydet
    let results: any = undefined;
    
    if (currentExam?.type === "general") {
      // Genel deneme için her ders için sonuçlar
      const subjectResults: any = {};
      let totalCorrect = 0;
      let totalWrong = 0;
      let totalEmpty = 0;

      Object.entries(generalResults).forEach(([key, value]) => {
        const c = parseInt(value.correct) || 0;
        const w = parseInt(value.wrong) || 0;
        const e = parseInt(value.empty) || 0;
        const net = calculateNet(c, w);

        if (c > 0 || w > 0 || e > 0) {
          subjectResults[key] = {
            correct: c,
            wrong: w,
            empty: e,
            net: net,
          };
        }

        totalCorrect += c;
        totalWrong += w;
        totalEmpty += e;
      });

      results = {
        ...subjectResults,
        total: {
          correct: totalCorrect,
          wrong: totalWrong,
          empty: totalEmpty,
          net: calculateNet(totalCorrect, totalWrong),
        },
      };
    } else {
      // Branş veya TG denemesi için toplam sonuç
      results = correct && wrong
        ? {
            total: {
              correct: parseInt(correct) || 0,
              wrong: parseInt(wrong) || 0,
              empty: parseInt(empty) || 0,
              net: net,
            },
          }
        : undefined;
    }
    
    if (currentExam) {
      // Mevcut sınavı güncelle
      await updateExam(currentExam.id, {
        completed: true,
        results: results as any,
      });
    } else if (goal) {
      // Yeni sınav ekle
      await addExam({
        title: goal.title,
        type: "branch", // Hafta sonu hedefleri genelde branş denemesi
        subject: "TÜRKÇE" as Subject, // goal.title'dan çıkarılabilir ama şimdilik default
        date: goal.date,
        results,
      });
    }
    
    onClose();
  };
  
  if (!isOpen || (!goal && !examProp)) return null;
  
  const displayDate = currentExam ? currentExam.date : (goal?.date || "");
  const formattedDate = format(parseISO(displayDate), "d MMMM yyyy, EEEE", { locale: tr });
  const displayTitle = currentExam ? currentExam.title : (goal?.title || "");
  const displayDescription = currentExam 
    ? (currentExam.type === "branch" && currentExam.subject 
        ? `${currentExam.subject} Branş Denemesi`
        : currentExam.type === "tg"
        ? "Türkiye Geneli Deneme"
        : "Genel Deneme")
    : (goal?.description || "");
  
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Modal Card */}
      <div className="relative z-10 w-full sm:max-w-[500px] bg-background-light dark:bg-background-dark rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col ring-1 ring-black/5 dark:ring-white/10 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h2 className="text-xl font-bold text-text-main dark:text-white">
              Deneme Detayları
            </h2>
            <p className="text-sm text-text-sub dark:text-slate-400 mt-1">
              {formattedDate}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="Kapat"
          >
            <span className="material-symbols-outlined text-text-sub dark:text-slate-400">
              close
            </span>
          </button>
        </div>
        
        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Sınav Bilgileri */}
          <div>
            <h3 className="text-lg font-semibold text-text-main dark:text-white mb-2">
              {displayTitle}
            </h3>
            <p className="text-sm text-text-sub dark:text-slate-400">
              {displayDescription}
            </p>
          </div>
          
          {/* Sınav Yapıldı Checkbox */}
          <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
            <Checkbox
              checked={isCompleted}
              onChange={(checked) => setIsCompleted(checked)}
            />
            <div className="flex-1">
              <label
                htmlFor="exam-completed"
                className="text-sm font-medium text-text-main dark:text-white cursor-pointer"
              >
                Sınav Yapıldı
              </label>
              <p className="text-xs text-text-sub dark:text-slate-400 mt-0.5">
                Bu deneme sınavını tamamladıysanız işaretleyin
              </p>
            </div>
          </div>
          
          {/* Net Hesaplayıcı */}
          {isCompleted && (
            <div className="space-y-4 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-100 dark:border-blue-800">
              <h4 className="text-base font-semibold text-text-main dark:text-white">
                Net Hesaplayıcı
              </h4>
              
              {currentExam?.type === "general" ? (
                // Genel deneme için her ders için alanlar
                <div className="space-y-3">
                  {[
                    { key: "turkce", label: "Türkçe", color: "teal" },
                    { key: "matematik", label: "Matematik", color: "blue" },
                    { key: "tarih", label: "Tarih", color: "orange" },
                    { key: "cografya", label: "Coğrafya", color: "green" },
                    { key: "vatandaslik", label: "Vatandaşlık", color: "purple" },
                  ].map(({ key, label }) => {
                    const result = generalResults[key];
                    const subjectNet = calculateSubjectNet(key);
                    
                    return (
                      <div key={key} className="p-3 rounded-lg bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-semibold text-text-main dark:text-white">
                            {label}
                          </span>
                          <span className="text-xs font-bold text-primary dark:text-blue-400">
                            Net: {subjectNet.toFixed(2)}
                          </span>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          <div>
                            <label className="block text-xs text-green-600 dark:text-green-400 mb-1">
                              Doğru
                            </label>
                            <input
                              type="number"
                              min="0"
                              value={result.correct}
                              onChange={(e) => setGeneralResults({
                                ...generalResults,
                                [key]: { ...result, correct: e.target.value }
                              })}
                              placeholder="0"
                              className="w-full px-2 py-1.5 rounded-lg border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 focus:outline-none focus:ring-2 focus:ring-green-500/20 text-center text-sm font-bold"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-red-600 dark:text-red-400 mb-1">
                              Yanlış
                            </label>
                            <input
                              type="number"
                              min="0"
                              value={result.wrong}
                              onChange={(e) => setGeneralResults({
                                ...generalResults,
                                [key]: { ...result, wrong: e.target.value }
                              })}
                              placeholder="0"
                              className="w-full px-2 py-1.5 rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 focus:outline-none focus:ring-2 focus:ring-red-500/20 text-center text-sm font-bold"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                              Boş
                            </label>
                            <input
                              type="number"
                              min="0"
                              value={result.empty}
                              onChange={(e) => setGeneralResults({
                                ...generalResults,
                                [key]: { ...result, empty: e.target.value }
                              })}
                              placeholder="0"
                              className="w-full px-2 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-text-main dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-500/20 text-center text-sm font-bold"
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  
                  {/* Toplam Net */}
                  <div className="mt-4 p-4 rounded-lg bg-primary/10 dark:bg-primary/20 border-2 border-primary/30">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-bold text-primary dark:text-blue-300">
                        Toplam Net
                      </span>
                      <span className="text-2xl font-bold text-primary dark:text-blue-300">
                        {calculateTotalNet().toFixed(2)}
                      </span>
                    </div>
                    <div className="flex gap-4 text-xs text-text-sub dark:text-slate-400">
                      <span>Doğru: {calculateTotalStats().correct}</span>
                      <span>Yanlış: {calculateTotalStats().wrong}</span>
                      <span>Boş: {calculateTotalStats().empty}</span>
                    </div>
                  </div>
                </div>
              ) : (
                // Branş veya TG denemesi için tek alan
                <>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-text-sub dark:text-slate-400 mb-1">
                        Doğru
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={correct}
                        onChange={(e) => setCorrect(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-text-main dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20"
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-text-sub dark:text-slate-400 mb-1">
                        Yanlış
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={wrong}
                        onChange={(e) => setWrong(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-text-main dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20"
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-text-sub dark:text-slate-400 mb-1">
                        Boş
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={empty}
                        onChange={(e) => setEmpty(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-text-main dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20"
                        placeholder="0"
                      />
                    </div>
                  </div>
                  
                  {/* Net Sonuç */}
                  <div className="mt-4 p-4 bg-white dark:bg-gray-800 rounded-lg border-2 border-primary/20">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-text-sub dark:text-slate-400">
                        Net
                      </span>
                      <span className="text-2xl font-bold text-primary dark:text-blue-400">
                        {net.toFixed(2)}
                      </span>
                    </div>
                    <p className="text-xs text-text-sub dark:text-slate-400 mt-1">
                      4 yanlış 1 doğruyu götürür
                    </p>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex gap-3">
          <Button
            variant="outline"
            fullWidth
            onClick={onClose}
          >
            İptal
          </Button>
          <Button
            variant="primary"
            fullWidth
            onClick={handleSave}
          >
            Kaydet
          </Button>
        </div>
      </div>
    </div>
  );
}
