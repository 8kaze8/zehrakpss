/**
 * DailyRoutineCard Component
 * Günlük rutin görevleri kartı
 */

"use client";

import React from "react";
import { Card } from "@/components/shared/Card";
import { TaskItem } from "./TaskItem";
import { useDailyTasks } from "@/hooks/useDailyTasks";
import { useStudyProgressContext } from "@/context/StudyProgressContext";
import { getTodayISO } from "@/utils/date";

export function DailyRoutineCard() {
  const today = new Date();
  const { studyTasks, routineTasks } = useDailyTasks(today);
  const { isTaskCompleted, completeTask, uncompleteTask } = useStudyProgressContext();

  const handleToggle = (taskId: string) => {
    const completed = isTaskCompleted(taskId, today);
    if (completed) {
      uncompleteTask(taskId, today);
    } else {
      completeTask(taskId, today);
    }
  };

  const handleStart = (taskId: string) => {
    // Timer başlatma logic'i buraya gelecek
    console.log("Start timer for task:", taskId);
  };

  // Rutin görevleri formatla
  const formattedRoutineTasks = routineTasks.map((task) => ({
    id: task.id,
    label:
      task.type === "paragraph"
        ? `${task.count} Paragraf`
        : task.type === "problem"
        ? `${task.count} Problem`
        : `${task.count} Hız Sorusu`,
    completed: task.completed,
    showPlayButton: task.type === "speed",
  }));

  return (
    <section className="px-6 pb-6">
      <Card variant="mint" padding="md">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="flex items-center gap-2 text-lg font-bold text-[#00695c] dark:text-[#4db6ac]">
            <span className="material-symbols-outlined">checklist</span>
            Bugünün Rutini
          </h3>
          <span className="text-xs font-medium text-[#00695c]/70 dark:text-[#4db6ac]/70">
            {formattedRoutineTasks.length} Görev
          </span>
        </div>
        <div className="flex flex-col gap-3">
          {formattedRoutineTasks.map((task) => (
            <TaskItem
              key={task.id}
              id={task.id}
              label={task.label}
              completed={isTaskCompleted(task.id, today)}
              onToggle={handleToggle}
              onStart={task.showPlayButton ? handleStart : undefined}
              showPlayButton={task.showPlayButton}
            />
          ))}
        </div>
      </Card>
    </section>
  );
}
