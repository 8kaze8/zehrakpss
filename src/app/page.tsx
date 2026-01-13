/**
 * Dashboard Page
 * Ana sayfa - Günlük görünüm
 */

"use client";

import React, { useState } from "react";
import { Header } from "@/components/layout/Header";
import { GreetingSection } from "@/components/dashboard/GreetingSection";
import { MonthlyGoalWidget } from "@/components/dashboard/MonthlyGoalWidget";
import { WeeklyGoalCard } from "@/components/dashboard/WeeklyGoalCard";
import { DailyRoutineCard } from "@/components/dashboard/DailyRoutineCard";
import { SubjectFocusCard } from "@/components/dashboard/SubjectFocusCard";
import { FloatingActionButton } from "@/components/layout/FloatingActionButton";
import { AddTaskModal } from "@/components/shared/AddTaskModal";
import { AddExamModal } from "@/components/shared/AddExamModal";
import { useStudyProgressContext } from "@/context/StudyProgressContext";
import type { Subject } from "@/types";

export default function DashboardPage() {
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [isAddExamOpen, setIsAddExamOpen] = useState(false);

  const { addCustomTask, addExam } = useStudyProgressContext();

  const handleAddTask = (task: {
    title: string;
    subject: Subject;
    description?: string;
    date: string;
    timeSlot?: { start: string; end: string };
    type: "routine" | "study" | "speed" | "exam";
  }) => {
    addCustomTask({
      title: task.title,
      subject: task.subject,
      description: task.description,
      date: task.date,
      timeSlot: task.timeSlot,
      type: task.type,
    });
  };

  const handleAddExam = (exam: {
    title: string;
    type: "branch" | "general" | "tg";
    subject?: Subject;
    date: string;
    results?: {
      turkce?: { correct: number; wrong: number; empty: number; net: number };
      matematik?: { correct: number; wrong: number; empty: number; net: number };
      tarih?: { correct: number; wrong: number; empty: number; net: number };
      cografya?: { correct: number; wrong: number; empty: number; net: number };
      vatandaslik?: { correct: number; wrong: number; empty: number; net: number };
      total?: { correct: number; wrong: number; empty: number; net: number };
    };
  }) => {
    addExam({
      title: exam.title,
      type: exam.type,
      subject: exam.subject,
      date: exam.date,
      results: exam.results,
    });
  };

  return (
    <>
      <Header />
      <main className="flex-1 overflow-y-auto">
        <GreetingSection />
        <WeeklyGoalCard />
        <MonthlyGoalWidget />
        <DailyRoutineCard />
        <SubjectFocusCard />
      </main>
      <FloatingActionButton
        expandable
        onAddTask={() => setIsAddTaskOpen(true)}
        onAddExam={() => setIsAddExamOpen(true)}
      />
      <AddTaskModal
        isOpen={isAddTaskOpen}
        onClose={() => setIsAddTaskOpen(false)}
        onAddTask={handleAddTask}
      />
      <AddExamModal
        isOpen={isAddExamOpen}
        onClose={() => setIsAddExamOpen(false)}
        onAddExam={handleAddExam}
      />
    </>
  );
}
