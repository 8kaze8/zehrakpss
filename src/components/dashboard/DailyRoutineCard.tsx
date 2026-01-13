/**
 * DailyRoutineCard Component
 * Günlük rutin görevleri kartı
 */

"use client";

import React, { useState } from "react";
import { Card } from "@/components/shared/Card";
import { TaskItem } from "./TaskItem";
import { useDailyTasks } from "@/hooks/useDailyTasks";
import { useStudyProgressContext } from "@/context/StudyProgressContext";
import { TimerModal } from "@/components/timer/TimerModal";

export function DailyRoutineCard() {
  const today = new Date();
  const { studyTasks, routineTasks } = useDailyTasks(today);
  const { isTaskCompleted, completeTask, uncompleteTask, deleteCustomTask } = useStudyProgressContext();
  const [timerOpen, setTimerOpen] = useState(false);
  const [timerTask, setTimerTask] = useState<{ type: string; title: string } | null>(null);

  const handleToggle = (taskId: string) => {
    const completed = isTaskCompleted(taskId, today);
    if (completed) {
      uncompleteTask(taskId, today);
    } else {
      completeTask(taskId, today);
    }
  };

  const handleStart = (taskId: string, taskLabel: string, taskType: string) => {
    setTimerTask({
      type: taskType,
      title: taskLabel,
    });
    setTimerOpen(true);
  };

  const handleDelete = (taskId: string) => {
    deleteCustomTask(taskId);
  };

  // Rutin görevleri formatla
  const formattedRoutineTasks = routineTasks.map((task) => {
    // Özel label varsa onu kullan
    let label = task.label;
    let taskTypeName = "Hız Testi";

    if (!label) {
      switch (task.type) {
        case "paragraph":
          label = `${task.count} Paragraf`;
          break;
        case "problem":
          label = `${task.count} Problem`;
          taskTypeName = "Problem Çözümü";
          break;
        case "speed":
          label = `${task.count} Hız Sorusu`;
          taskTypeName = "Hız Testi";
          break;
        case "karma":
          label = "Karma Mat Testi";
          taskTypeName = "Karma Test";
          break;
        default:
          label = `${task.count} Soru`;
      }
    }

    return {
      id: task.id,
      label,
      completed: task.completed,
      showPlayButton: task.requiresTimer || task.type === "speed" || task.type === "karma",
      taskTypeName,
      timerDuration: task.timerDuration,
    };
  });

  return (
    <section className="px-6 pb-6">
      <Card variant="mint" padding="md">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="flex items-center gap-2 text-lg font-bold text-[#00695c] dark:text-[#4db6ac]">
            <span className="material-symbols-outlined">checklist</span>
            Bugünün Rutini
          </h3>
          <span className="text-xs font-medium text-[#00695c]/70 dark:text-[#4db6ac]/70">
            {formattedRoutineTasks.length + studyTasks.filter((t) => t.id.startsWith("custom-")).length} Görev
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
              onStart={task.showPlayButton ? (id) => handleStart(id, task.label, task.taskTypeName) : undefined}
              onDelete={task.id.startsWith("custom-") ? handleDelete : undefined}
              showPlayButton={task.showPlayButton}
              isCustom={task.id.startsWith("custom-")}
            />
          ))}
          {/* Custom study tasks */}
          {studyTasks
            .filter((task) => task.id.startsWith("custom-"))
            .map((task) => (
              <TaskItem
                key={task.id}
                id={task.id}
                label={task.title}
                completed={isTaskCompleted(task.id, today)}
                onToggle={handleToggle}
                onDelete={handleDelete}
                isCustom={true}
              />
            ))}
        </div>
      </Card>

      {/* Timer Modal */}
      {timerTask && (
        <TimerModal
          isOpen={timerOpen}
          onClose={() => {
            setTimerOpen(false);
            setTimerTask(null);
          }}
          taskType={timerTask.type}
          taskTitle={timerTask.title}
        />
      )}
    </section>
  );
}
