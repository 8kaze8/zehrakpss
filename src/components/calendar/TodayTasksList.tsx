/**
 * TodayTasksList Component
 * Bugünün görevleri listesi
 */

"use client";

import React from "react";
import { format } from "date-fns";
import { useDailyTasks } from "@/hooks/useDailyTasks";
import { useStudyProgressContext } from "@/context/StudyProgressContext";
import { StudyTaskCard } from "./StudyTaskCard";
import { Checkbox } from "@/components/shared/Checkbox";
import type { TodayTask } from "@/types";

interface TodayTasksListProps {
  date: Date;
}

export function TodayTasksList({ date }: TodayTasksListProps) {
  const { studyTasks, routineTasks } = useDailyTasks(date);
  const { isTaskCompleted, completeTask, uncompleteTask, deleteCustomTask } =
    useStudyProgressContext();

  const handleToggle = (taskId: string) => {
    const completed = isTaskCompleted(taskId, date);
    if (completed) {
      uncompleteTask(taskId, date);
    } else {
      completeTask(taskId, date);
    }
  };

  const handleDelete = (taskId: string) => {
    deleteCustomTask(taskId);
  };

  if (studyTasks.length === 0 && routineTasks.length === 0) {
    return (
      <div className="px-4 mb-8">
        <div className="text-center py-8 text-text-sub dark:text-slate-400">
          <span className="material-symbols-outlined text-4xl mb-2 block">
            event_busy
          </span>
          <p>Bu tarih için görev bulunmuyor.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 px-4 mb-8">
      {/* Rutin görevler - TaskItem kullan */}
      {routineTasks.map((routineTask) => {
        const label = 
          routineTask.type === "paragraph" ? `${routineTask.count} Paragraf` :
          routineTask.type === "problem" ? `${routineTask.count} Problem` :
          `${routineTask.count} Hız Sorusu`;
        
        return (
          <div
            key={routineTask.id}
            className="group relative flex items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 transition-all hover:shadow-md"
          >
            <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
              <span className="material-symbols-outlined">checklist</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-0.5">
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">
                  RUTİN
                </span>
                <span className="text-xs text-text-sub dark:text-slate-400">
                  08:30 - 10:00
                </span>
              </div>
              <h3 className="text-base font-semibold text-text-main dark:text-white truncate">
                {label}
              </h3>
              {routineTask.type === "speed" && (
                <p className="text-sm text-text-sub dark:text-slate-400 truncate">
                  Süreli çözüm
                </p>
              )}
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <Checkbox
                checked={isTaskCompleted(routineTask.id, date)}
                onChange={() => handleToggle(routineTask.id)}
                size="md"
              />
              {routineTask.type === "speed" && (
                <button
                  onClick={() => {
                    // Timer açılacak
                  }}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary transition hover:bg-primary/20"
                  aria-label="Başlat"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
                    play_arrow
                  </span>
                </button>
              )}
            </div>
          </div>
        );
      })}
      
      {/* Ders görevleri */}
      {studyTasks.map((task) => (
        <StudyTaskCard
          key={task.id}
          task={task}
          completed={isTaskCompleted(task.id, date)}
          onToggle={handleToggle}
          onDelete={task.id.startsWith("custom-") ? handleDelete : undefined}
        />
      ))}
    </div>
  );
}
