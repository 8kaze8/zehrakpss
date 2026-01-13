/**
 * Calendar Page
 * Haftalık takvim görünümü
 */

"use client";

import React, { useState } from "react";
import { format, addWeeks, subWeeks, startOfWeek } from "date-fns";
import { tr } from "date-fns/locale";
import { Header } from "@/components/layout/Header";
import { WeeklyCalendarStrip } from "@/components/calendar/WeeklyCalendarStrip";
import { WeeklyProgressCard } from "@/components/calendar/WeeklyProgressCard";
import { TodayTasksList } from "@/components/calendar/TodayTasksList";
import { WeekendGoalsCard } from "@/components/calendar/WeekendGoalsCard";
import { FloatingActionButton } from "@/components/layout/FloatingActionButton";
import { AddTaskModal } from "@/components/shared/AddTaskModal";
import { useStudyProgressContext } from "@/context/StudyProgressContext";
import { getWeekId } from "@/utils/date";

export default function CalendarPage() {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);

  const { addCustomTask } = useStudyProgressContext();

  const handleAddTask = (task: {
    title: string;
    subject: any;
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

  const handleWeekChange = (direction: "prev" | "next") => {
    setCurrentWeek((prev) =>
      direction === "next" ? addWeeks(prev, 1) : subWeeks(prev, 1)
    );
  };

  const weekId = getWeekId(selectedDate);

  return (
    <>
      <Header />
      <main className="flex-1 overflow-y-auto">
        {/* Top Header */}
        <div className="sticky top-0 z-10 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-sm transition-colors duration-200">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary dark:text-primary">
                calendar_month
              </span>
              <h1 className="text-lg font-bold text-text-main dark:text-white">
                {format(currentWeek, "MMMM yyyy", { locale: tr })}
              </h1>
            </div>
            <button
              className="flex items-center justify-center w-10 h-10 rounded-full text-text-main dark:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              aria-label="Bildirimler"
            >
              <span className="material-symbols-outlined">notifications</span>
            </button>
          </div>
        </div>

        {/* Weekly Calendar Strip */}
        <WeeklyCalendarStrip
          currentDate={currentWeek}
          selectedDate={selectedDate}
          onDateSelect={setSelectedDate}
          onWeekChange={handleWeekChange}
        />

        {/* Weekly Progress Card */}
        <WeeklyProgressCard weekId={weekId} />

        {/* Today's Tasks Header */}
        <div className="px-4 mb-3 flex items-center justify-between">
          <h2 className="text-xl font-bold text-text-main dark:text-white tracking-tight">
            Bugünün Görevleri
          </h2>
          <span className="text-sm font-medium text-primary bg-primary/10 dark:bg-primary/20 dark:text-blue-300 px-3 py-1 rounded-full">
            {format(selectedDate, "d MMMM", { locale: tr })}
          </span>
        </div>

        {/* Today's Tasks List */}
        <TodayTasksList date={selectedDate} />

        {/* Weekend Goals */}
        <WeekendGoalsCard />
      </main>
      <FloatingActionButton onClick={() => setIsAddTaskOpen(true)} />
      <AddTaskModal
        isOpen={isAddTaskOpen}
        onClose={() => setIsAddTaskOpen(false)}
        onAddTask={handleAddTask}
        defaultDate={selectedDate}
      />
    </>
  );
}
