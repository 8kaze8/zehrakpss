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
  goal: WeekendGoal | null;
}

export function WeekendGoalDetailModal({
  isOpen,
  onClose,
  goal,
}: WeekendGoalDetailModalProps) {
  const { progress, addExam, updateExam, deleteExam, getExams } = useStudyProgressContext();
  
  // Form state
  const [isCompleted, setIsCompleted] = useState(false);
  const [correct, setCorrect] = useState("");
  const [wrong, setWrong] = useState("");
  const [empty, setEmpty] = useState("");
  
  // Bu tarihe ait sınav var mı? (goal.id ile eşleşen exam'ı bul)
  const existingExam = useMemo(() => {
    if (!goal) return null;
    const exams = getExams();
    // Önce goal.id ile eşleşen exam'ı bul
    const examById = exams.find((exam) => exam.id === goal.id);
    if (examById) return examById;
    // Yoksa tarihe göre bul
    return exams.find((exam) => exam.date === goal.date) || null;
  }, [goal, getExams, progress.exams]);
  
  // Modal açıldığında mevcut sınav verilerini yükle
  useEffect(() => {
    if (isOpen && existingExam) {
      setIsCompleted(existingExam.completed);
      if (existingExam.results?.total) {
        setCorrect(existingExam.results.total.correct.toString());
        setWrong(existingExam.results.total.wrong.toString());
        setEmpty(existingExam.results.total.empty.toString());
      }
    } else if (isOpen) {
      setIsCompleted(false);
      setCorrect("");
      setWrong("");
      setEmpty("");
    }
  }, [isOpen, existingExam]);
  
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
  const net = useMemo(() => {
    const c = parseInt(correct) || 0;
    const w = parseInt(wrong) || 0;
    return Math.max(0, c - w / 4);
  }, [correct, wrong]);
  
  const handleSave = async () => {
    if (!goal) return;
    
    // Checkbox kaldırıldıysa sınavı sil
    if (!isCompleted) {
      if (existingExam) {
        await deleteExam(existingExam.id);
      }
      onClose();
      return;
    }
    
    // Checkbox işaretliyse sonuçları kaydet
    const results = correct && wrong
      ? {
          total: {
            correct: parseInt(correct) || 0,
            wrong: parseInt(wrong) || 0,
            empty: parseInt(empty) || 0,
            net: net,
          },
        }
      : undefined;
    
    if (existingExam) {
      // Mevcut sınavı güncelle
      await updateExam(existingExam.id, {
        completed: true,
        results: results as any,
      });
    } else {
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
  
  if (!isOpen || !goal) return null;
  
  const formattedDate = format(parseISO(goal.date), "d MMMM yyyy, EEEE", { locale: tr });
  
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
              {goal.title}
            </h3>
            <p className="text-sm text-text-sub dark:text-slate-400">
              {goal.description}
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
