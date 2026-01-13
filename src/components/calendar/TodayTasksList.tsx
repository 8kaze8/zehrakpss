/**
 * TodayTasksList Component
 * Bugünün görevleri listesi
 */

"use client";

import React from "react";
import { useDailyTasks } from "@/hooks/useDailyTasks";
import { useStudyProgressContext } from "@/context/StudyProgressContext";
import { StudyTaskCard } from "./StudyTaskCard";

interface TodayTasksListProps {
  date: Date;
}

export function TodayTasksList({ date }: TodayTasksListProps) {
  const { studyTasks } = useDailyTasks(date);
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

  if (studyTasks.length === 0) {
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
