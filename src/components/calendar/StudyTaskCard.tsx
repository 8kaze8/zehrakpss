/**
 * StudyTaskCard Component
 * Çalışma görevi kartı
 */

"use client";

import React, { useState } from "react";
import { cn } from "@/utils/cn";
import { Checkbox } from "@/components/shared/Checkbox";
import { ConfirmModal } from "@/components/shared/ConfirmModal";
import { SUBJECT_COLORS, SUBJECT_ICONS } from "@/utils/constants";
import type { TodayTask } from "@/types";

interface StudyTaskCardProps {
  task: TodayTask;
  completed: boolean;
  onToggle: (taskId: string) => void;
  onDelete?: (taskId: string) => void;
}

export function StudyTaskCard({
  task,
  completed,
  onToggle,
  onDelete,
}: StudyTaskCardProps) {
  const [showConfirm, setShowConfirm] = useState(false);
  
  // RUTIN için varsayılan renkler
  const defaultColors = {
    bg: "bg-gray-50 dark:bg-gray-800",
    text: "text-gray-600 dark:text-gray-300",
    border: "border-gray-200 dark:border-gray-700",
  };
  
  const colors = SUBJECT_COLORS[task.subject as keyof typeof SUBJECT_COLORS] || defaultColors;
  const icon = SUBJECT_ICONS[task.subject as keyof typeof SUBJECT_ICONS] || "checklist";
  const isCustomTask = task.id.startsWith("custom-");

  return (
    <>
      <div
        className={cn(
          "group relative flex items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm border transition-all hover:shadow-md",
          colors.border,
          completed && "opacity-60"
        )}
      >
        <div
          className={cn(
            "flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-xl",
            colors.bg,
            colors.text
          )}
        >
          <span className="material-symbols-outlined">{icon}</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-0.5">
            <span
              className={cn(
                "text-xs font-semibold uppercase tracking-wider",
                colors.text
              )}
            >
              {task.subject}
            </span>
            {task.timeSlot && (
              <span className="text-xs text-text-sub dark:text-slate-400">
                {task.timeSlot.start} - {task.timeSlot.end}
              </span>
            )}
          </div>
          <h3 className="text-base font-semibold text-text-main dark:text-white truncate">
            {task.title}
          </h3>
          {task.description && (
            <p className="text-sm text-text-sub dark:text-slate-400 truncate">
              {task.description}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <Checkbox
            checked={completed}
            onChange={() => onToggle(task.id)}
            size="md"
          />
          {isCustomTask && onDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowConfirm(true);
              }}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-red-50 text-red-500 transition hover:bg-red-100 hover:text-red-600 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30"
              aria-label="Sil"
            >
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
                delete
              </span>
            </button>
          )}
        </div>
      </div>

      {/* Confirm Modal */}
      {onDelete && (
        <ConfirmModal
          isOpen={showConfirm}
          onClose={() => setShowConfirm(false)}
          onConfirm={() => onDelete(task.id)}
          title="Görevi Sil"
          message={`"${task.title}" görevini silmek istediğinize emin misiniz? Bu işlem geri alınamaz.`}
          confirmText="Sil"
          cancelText="İptal"
          variant="danger"
          icon="delete"
        />
      )}
    </>
  );
}
