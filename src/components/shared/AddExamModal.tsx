/**
 * AddExamModal Component
 * Deneme ekleme ve sonuç girişi modal'ı
 */

"use client";

import React, { useState, useEffect } from "react";
import { cn } from "@/utils/cn";
import { Button } from "./Button";
import { SUBJECT_COLORS } from "@/utils/constants";
import type { Subject } from "@/types";

interface ExamResult {
  correct: number;
  wrong: number;
  empty: number;
  net: number;
}

interface AddExamModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddExam: (exam: {
    title: string;
    type: "branch" | "general" | "tg"; // Branş, Genel, Türkiye Geneli
    subject?: Subject; // Branş denemeleri için
    date: string;
    results?: {
      turkce?: ExamResult;
      matematik?: ExamResult;
      tarih?: ExamResult;
      cografya?: ExamResult;
      vatandaslik?: ExamResult;
      total?: ExamResult;
    };
  }) => void;
  defaultDate?: Date;
}

const examTypes = [
  { value: "branch", label: "Branş Denemesi", icon: "school" },
  { value: "general", label: "Genel Deneme", icon: "assignment" },
  { value: "tg", label: "TG Deneme", icon: "public" },
] as const;

const subjects: Subject[] = ["TARİH", "COĞRAFYA", "MATEMATİK", "TÜRKÇE", "VATANDAŞLIK"];

export function AddExamModal({
  isOpen,
  onClose,
  onAddExam,
  defaultDate = new Date(),
}: AddExamModalProps) {
  const [title, setTitle] = useState("");
  const [examType, setExamType] = useState<"branch" | "general" | "tg">("branch");
  const [subject, setSubject] = useState<Subject>("MATEMATİK");
  const [date, setDate] = useState(defaultDate.toISOString().split("T")[0]);
  
  // Branş denemesi için sonuçlar
  const [correct, setCorrect] = useState("");
  const [wrong, setWrong] = useState("");
  const [empty, setEmpty] = useState("");
  const [hasResults, setHasResults] = useState(false);
  
  // Genel deneme için her ders için sonuçlar
  const [generalResults, setGeneralResults] = useState<Record<string, { correct: string; wrong: string; empty: string }>>({
    turkce: { correct: "", wrong: "", empty: "" },
    matematik: { correct: "", wrong: "", empty: "" },
    tarih: { correct: "", wrong: "", empty: "" },
    cografya: { correct: "", wrong: "", empty: "" },
    vatandaslik: { correct: "", wrong: "", empty: "" },
  });

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

  // Modal kapandığında formu temizle
  useEffect(() => {
    if (!isOpen) {
      setTitle("");
      setExamType("branch");
      setSubject("MATEMATİK");
      setCorrect("");
      setWrong("");
      setEmpty("");
      setHasResults(false);
      setGeneralResults({
        turkce: { correct: "", wrong: "", empty: "" },
        matematik: { correct: "", wrong: "", empty: "" },
        tarih: { correct: "", wrong: "", empty: "" },
        cografya: { correct: "", wrong: "", empty: "" },
        vatandaslik: { correct: "", wrong: "", empty: "" },
      });
    }
  }, [isOpen]);

  const calculateNet = (correctVal: number, wrongVal: number): number => {
    return Math.max(0, correctVal - wrongVal / 4);
  };
  
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const examTitle = title.trim() || 
      (examType === "branch" 
        ? `${subject} Branş Denemesi` 
        : examType === "tg" 
          ? "Türkiye Geneli Deneme"
          : "Genel Deneme");

    let results: any = undefined;

    if (hasResults) {
      if (examType === "general") {
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
        results = {
          total: {
            correct: parseInt(correct) || 0,
            wrong: parseInt(wrong) || 0,
            empty: parseInt(empty) || 0,
            net: calculateNet(parseInt(correct) || 0, parseInt(wrong) || 0),
          },
        };
      }
    }

    onAddExam({
      title: examTitle,
      type: examType,
      subject: examType === "branch" ? subject : undefined,
      date,
      results,
    });

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Card */}
      <div className="relative z-10 w-full sm:max-w-[480px] bg-background-light dark:bg-background-dark rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col ring-1 ring-black/5 dark:ring-white/10 max-h-[90vh]">
        {/* Handle */}
        <div className="flex w-full items-center justify-center pt-3 pb-1">
          <div className="h-1.5 w-10 rounded-full bg-[#cfdbe7] dark:bg-slate-600" />
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          aria-label="Kapat"
        >
          <span className="material-symbols-outlined text-lg">close</span>
        </button>

        {/* Content */}
        <div className="flex flex-col w-full pt-2 pb-8 overflow-y-auto px-6">
          {/* Header */}
          <div className="text-center pt-4 pb-6">
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="material-symbols-outlined text-primary text-3xl">quiz</span>
            </div>
            <h2 className="text-2xl font-bold text-text-main dark:text-white">
              Deneme Ekle
            </h2>
            <p className="text-sm text-text-sub dark:text-slate-400 mt-1">
              Deneme sonucunu kaydedin
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Deneme Tipi */}
            <div>
              <label className="block text-sm font-medium text-text-main dark:text-white mb-2">
                Deneme Tipi
              </label>
              <div className="grid grid-cols-3 gap-2">
                {examTypes.map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => setExamType(type.value)}
                    className={cn(
                      "flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all",
                      examType === type.value
                        ? "border-primary bg-primary/10"
                        : "border-gray-200 dark:border-gray-700 hover:border-primary/50"
                    )}
                  >
                    <span
                      className={cn(
                        "material-symbols-outlined",
                        examType === type.value ? "text-primary" : "text-gray-400"
                      )}
                    >
                      {type.icon}
                    </span>
                    <span
                      className={cn(
                        "text-xs font-medium text-center",
                        examType === type.value
                          ? "text-primary"
                          : "text-text-sub dark:text-gray-400"
                      )}
                    >
                      {type.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Ders Seçimi (Branş için) */}
            {examType === "branch" && (
              <div>
                <label className="block text-sm font-medium text-text-main dark:text-white mb-2">
                  Ders
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {subjects.map((sub) => {
                    const colors = SUBJECT_COLORS[sub];
                    const isSelected = subject === sub;

                    return (
                      <button
                        key={sub}
                        type="button"
                        onClick={() => setSubject(sub)}
                        className={cn(
                          "flex flex-col items-center gap-1 p-2 rounded-xl border-2 transition-all",
                          isSelected
                            ? `${colors.border} ${colors.bg}`
                            : "border-gray-200 dark:border-gray-700 hover:border-primary/50"
                        )}
                      >
                        <span
                          className={cn(
                            "text-xs font-bold",
                            isSelected ? colors.text : "text-text-sub dark:text-gray-400"
                          )}
                        >
                          {sub.slice(0, 3)}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Deneme Adı */}
            <div>
              <label className="block text-sm font-medium text-text-main dark:text-white mb-2">
                Deneme Adı (Opsiyonel)
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Örn: ÖSYM Formatı Deneme 1"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-text-main dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
            </div>

            {/* Tarih */}
            <div>
              <label className="block text-sm font-medium text-text-main dark:text-white mb-2">
                Tarih
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-text-main dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
            </div>

            {/* Sonuç Girişi Toggle */}
            <div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={hasResults}
                  onChange={(e) => setHasResults(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <span className="text-sm font-medium text-text-main dark:text-white">
                  Sonuç girişi yap
                </span>
              </label>
            </div>

            {/* Sonuç Alanları */}
            {hasResults && (
              <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 space-y-4">
                <h4 className="text-sm font-bold text-text-main dark:text-white mb-3">
                  Sonuçlar
                </h4>
                
                {examType === "general" ? (
                  // Genel deneme için her ders için ayrı alanlar
                  <div className="space-y-4">
                    {[
                      { key: "turkce", label: "Türkçe", color: "teal" },
                      { key: "matematik", label: "Matematik", color: "blue" },
                      { key: "tarih", label: "Tarih", color: "orange" },
                      { key: "cografya", label: "Coğrafya", color: "green" },
                      { key: "vatandaslik", label: "Vatandaşlık", color: "purple" },
                    ].map(({ key, label, color }) => {
                      const result = generalResults[key];
                      const net = calculateSubjectNet(key);
                      
                      return (
                        <div key={key} className="p-3 rounded-lg bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-semibold text-text-main dark:text-white">
                              {label}
                            </span>
                            <span className="text-xs font-bold text-primary dark:text-blue-400">
                              Net: {net.toFixed(2)}
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
                        <label className="block text-xs text-green-600 dark:text-green-400 mb-1 font-medium">
                          Doğru
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={correct}
                          onChange={(e) => setCorrect(e.target.value)}
                          placeholder="0"
                          className="w-full px-3 py-2 rounded-lg border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 focus:outline-none focus:ring-2 focus:ring-green-500/20 text-center font-bold"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-red-600 dark:text-red-400 mb-1 font-medium">
                          Yanlış
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={wrong}
                          onChange={(e) => setWrong(e.target.value)}
                          placeholder="0"
                          className="w-full px-3 py-2 rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 focus:outline-none focus:ring-2 focus:ring-red-500/20 text-center font-bold"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1 font-medium">
                          Boş
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={empty}
                          onChange={(e) => setEmpty(e.target.value)}
                          placeholder="0"
                          className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-text-main dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-500/20 text-center font-bold"
                        />
                      </div>
                    </div>
                    {/* Net Hesaplama */}
                    <div className="mt-3 p-3 rounded-lg bg-primary/10 dark:bg-primary/20 flex items-center justify-between">
                      <span className="text-sm font-medium text-primary dark:text-blue-300">
                        Hesaplanan Net
                      </span>
                      <span className="text-xl font-bold text-primary dark:text-blue-300">
                        {calculateNet(parseInt(correct) || 0, parseInt(wrong) || 0).toFixed(2)}
                      </span>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Buttons */}
            <div className="flex gap-3 pt-4">
              <Button type="button" variant="outline" fullWidth onClick={onClose}>
                İptal
              </Button>
              <Button type="submit" variant="primary" fullWidth>
                Deneme Ekle
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
