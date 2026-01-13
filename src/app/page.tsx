/**
 * Dashboard Page
 * Ana sayfa - Günlük görünüm
 */

"use client";

import React, { useState } from "react";
import { Header } from "@/components/layout/Header";
import { GreetingSection } from "@/components/dashboard/GreetingSection";
import { MonthlyGoalWidget } from "@/components/dashboard/MonthlyGoalWidget";
import { DailyRoutineCard } from "@/components/dashboard/DailyRoutineCard";
import { SubjectFocusCard } from "@/components/dashboard/SubjectFocusCard";
import { FloatingActionButton } from "@/components/layout/FloatingActionButton";
import { AddTaskModal } from "@/components/shared/AddTaskModal";

export default function DashboardPage() {
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);

  const handleAddTask = (task: {
    title: string;
    subject: any;
    description?: string;
    date: string;
    timeSlot?: { start: string; end: string };
    type: "routine" | "study" | "speed" | "exam";
  }) => {
    // TODO: Task'ı study plan'a ekle veya localStorage'a kaydet
    console.log("New task added:", task);
    // Şimdilik sadece console'a yazdırıyoruz
    // Gerçek implementasyonda study plan'a eklenmeli veya ayrı bir custom tasks listesi tutulmalı
  };

  return (
    <>
      <Header />
      <main className="flex-1 overflow-y-auto">
        <GreetingSection />
        <MonthlyGoalWidget />
        <DailyRoutineCard />
        <SubjectFocusCard />
      </main>
      <FloatingActionButton onClick={() => setIsAddTaskOpen(true)} />
      <AddTaskModal
        isOpen={isAddTaskOpen}
        onClose={() => setIsAddTaskOpen(false)}
        onAddTask={handleAddTask}
      />
    </>
  );
}
