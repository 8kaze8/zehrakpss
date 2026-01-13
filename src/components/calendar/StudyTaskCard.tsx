/**
 * StudyTaskCard Component
 * Çalışma görevi kartı
 */

"use client";

import React from "react";
import { cn } from "@/utils/cn";
import { Checkbox } from "@/components/shared/Checkbox";
import { SUBJECT_COLORS, SUBJECT_ICONS } from "@/utils/constants";
import type { TodayTask } from "@/types";

interface StudyTaskCardProps {
  task: TodayTask;
  completed: boolean;
  onToggle: (taskId: string) => void;
}

export function StudyTaskCard({
  task,
  completed,
  onToggle,
}: StudyTaskCardProps) {
  const colors = SUBJECT_COLORS[task.subject];
  const icon = SUBJECT_ICONS[task.subject];

  return (
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
      <Checkbox
        checked={completed}
        onChange={() => onToggle(task.id)}
        size="md"
        className="flex-shrink-0"
      />
    </div>
  );
}
