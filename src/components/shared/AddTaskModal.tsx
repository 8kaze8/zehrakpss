/**
 * AddTaskModal Component
 * Yeni görev ekleme modal'ı
 */

"use client";

import React, { useState, useEffect } from "react";
import { cn } from "@/utils/cn";
import { Button } from "./Button";
import { SUBJECT_COLORS, SUBJECT_ICONS } from "@/utils/constants";
import { useToast } from "@/context/ToastContext";
import type { Subject } from "@/types";

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTask: (task: {
    title: string;
    subject: Subject;
    description?: string;
    date: string;
    timeSlot?: { start: string; end: string };
    type: "routine" | "study" | "speed" | "exam";
  }) => void;
  defaultDate?: Date;
}

const subjects: Subject[] = ["TARİH", "COĞRAFYA", "MATEMATİK", "TÜRKÇE", "VATANDAŞLIK"];

const taskTypes = [
  { value: "study", label: "Çalışma" },
  { value: "speed", label: "Hız Testi" },
  { value: "exam", label: "Deneme" },
  { value: "routine", label: "Rutin" },
] as const;

export function AddTaskModal({
  isOpen,
  onClose,
  onAddTask,
  defaultDate = new Date(),
}: AddTaskModalProps) {
  const { showToast } = useToast();
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState<Subject>("TARİH");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(
    defaultDate.toISOString().split("T")[0]
  );
  const [startTime, setStartTime] = useState("14:00");
  const [endTime, setEndTime] = useState("15:30");
  const [taskType, setTaskType] = useState<"routine" | "study" | "speed" | "exam">("study");
  const [hasTimeSlot, setHasTimeSlot] = useState(true);

  // ESC tuşu ile kapat
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  // Modal açıkken body scroll'unu engelle
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
      setDescription("");
      setSubject("TARİH");
      setTaskType("study");
      setHasTimeSlot(true);
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      showToast({ message: "Lütfen görev başlığı girin.", type: "warning" });
      return;
    }

    onAddTask({
      title: title.trim(),
      subject,
      description: description.trim() || undefined,
      date,
      timeSlot: hasTimeSlot
        ? { start: startTime, end: endTime }
        : undefined,
      type: taskType,
    });

    onClose();
  };

  if (!isOpen) return null;

  const selectedSubjectColors = SUBJECT_COLORS[subject];
  const selectedSubjectIcon = SUBJECT_ICONS[subject];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Card */}
      <div className="relative z-10 w-full sm:max-w-[500px] bg-background-light dark:bg-background-dark rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col ring-1 ring-black/5 dark:ring-white/10 relative overflow-hidden max-h-[90vh]">
        {/* Bottom Sheet Handle */}
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
            <h2 className="text-2xl font-bold text-text-main dark:text-white">
              Yeni Görev Ekle
            </h2>
            <p className="text-sm text-text-sub dark:text-slate-400 mt-1">
              Çalışma planınıza yeni bir görev ekleyin
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Görev Başlığı */}
            <div>
              <label className="block text-sm font-medium text-text-main dark:text-white mb-2">
                Görev Başlığı *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Örn: Limit-Türev Tekrarı"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-text-main dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                required
              />
            </div>

            {/* Ders Seçimi */}
            <div>
              <label className="block text-sm font-medium text-text-main dark:text-white mb-2">
                Ders
              </label>
              <div className="grid grid-cols-5 gap-2">
                {subjects.map((sub) => {
                  const colors = SUBJECT_COLORS[sub];
                  const icon = SUBJECT_ICONS[sub];
                  const isSelected = subject === sub;

                  return (
                    <button
                      key={sub}
                      type="button"
                      onClick={() => setSubject(sub)}
                      className={cn(
                        "flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all",
                        isSelected
                          ? `${colors.border} ${colors.bg}`
                          : "border-gray-200 dark:border-gray-700 hover:border-primary/50"
                      )}
                    >
                      <span
                        className={cn(
                          "material-symbols-outlined",
                          isSelected ? colors.text : "text-gray-400"
                        )}
                      >
                        {icon}
                      </span>
                      <span
                        className={cn(
                          "text-xs font-medium",
                          isSelected
                            ? colors.text
                            : "text-text-sub dark:text-gray-400"
                        )}
                      >
                        {sub.slice(0, 3)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Görev Tipi */}
            <div>
              <label className="block text-sm font-medium text-text-main dark:text-white mb-2">
                Görev Tipi
              </label>
              <div className="grid grid-cols-4 gap-2">
                {taskTypes.map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => setTaskType(type.value)}
                    className={cn(
                      "px-4 py-2 rounded-lg border-2 transition-all text-sm font-medium",
                      taskType === type.value
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-gray-200 dark:border-gray-700 text-text-sub dark:text-gray-400 hover:border-primary/50"
                    )}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Açıklama */}
            <div>
              <label className="block text-sm font-medium text-text-main dark:text-white mb-2">
                Açıklama
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Örn: Soru bankası test 4-6"
                rows={3}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-text-main dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
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

            {/* Zaman Slotu */}
            <div>
              <label className="flex items-center gap-2 mb-2">
                <input
                  type="checkbox"
                  checked={hasTimeSlot}
                  onChange={(e) => setHasTimeSlot(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <span className="text-sm font-medium text-text-main dark:text-white">
                  Zaman aralığı belirle
                </span>
              </label>
              {hasTimeSlot && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-text-sub dark:text-gray-400 mb-1">
                      Başlangıç
                    </label>
                    <input
                      type="time"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-text-main dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-text-sub dark:text-gray-400 mb-1">
                      Bitiş
                    </label>
                    <input
                      type="time"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-text-main dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                fullWidth
                onClick={onClose}
              >
                İptal
              </Button>
              <Button type="submit" variant="primary" fullWidth>
                Görev Ekle
              </Button>
            </div>
          </form>
        </div>

        {/* Bottom spacing */}
        <div className="h-6 w-full" />
      </div>
    </div>
  );
}
