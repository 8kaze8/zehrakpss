/**
 * Dashboard Page
 * Ana sayfa - Günlük görünüm
 */

"use client";

import React from "react";
import { Header } from "@/components/layout/Header";
import { GreetingSection } from "@/components/dashboard/GreetingSection";
import { MonthlyGoalWidget } from "@/components/dashboard/MonthlyGoalWidget";
import { DailyRoutineCard } from "@/components/dashboard/DailyRoutineCard";
import { SubjectFocusCard } from "@/components/dashboard/SubjectFocusCard";
import { FloatingActionButton } from "@/components/layout/FloatingActionButton";

export default function DashboardPage() {
  return (
    <>
      <Header />
      <main className="flex-1 overflow-y-auto">
        <GreetingSection />
        <MonthlyGoalWidget />
        <DailyRoutineCard />
        <SubjectFocusCard />
      </main>
      <FloatingActionButton onClick={() => console.log("Add task")} />
    </>
  );
}
