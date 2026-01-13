/**
 * WeeklyCalendarStrip Component
 * Haftalık takvim şeridi
 */

"use client";

import React from "react";
import { format, parseISO, addDays, startOfWeek, endOfWeek } from "date-fns";
import { tr } from "date-fns/locale";
import { cn } from "@/utils/cn";
import { toISODate } from "@/utils/date";

interface WeeklyCalendarStripProps {
  currentDate: Date;
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  onWeekChange: (direction: "prev" | "next") => void;
}

export function WeeklyCalendarStrip({
  currentDate,
  selectedDate,
  onDateSelect,
  onWeekChange,
}: WeeklyCalendarStripProps) {
  const weekStart = startOfWeek(currentDate, { locale: tr });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const isSelected = (date: Date) => {
    return toISODate(date) === toISODate(selectedDate);
  };

  const isToday = (date: Date) => {
    return toISODate(date) === toISODate(new Date());
  };

  return (
    <div className="px-4 pb-4">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => onWeekChange("prev")}
          className="p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/5 text-text-sub dark:text-slate-400 transition-colors"
          aria-label="Önceki hafta"
        >
          <span className="material-symbols-outlined">chevron_left</span>
        </button>
        <span className="text-sm font-semibold text-text-sub dark:text-slate-400">
          {format(currentDate, "w", { locale: tr })}. Hafta
        </span>
        <button
          onClick={() => onWeekChange("next")}
          className="p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/5 text-text-sub dark:text-slate-400 transition-colors"
          aria-label="Sonraki hafta"
        >
          <span className="material-symbols-outlined">chevron_right</span>
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1">
        {weekDays.map((day, index) => {
          const dayName = format(day, "EEE", { locale: tr }).slice(0, 3);
          const dayNumber = format(day, "d");
          const selected = isSelected(day);
          const today = isToday(day);

          return (
            <button
              key={index}
              onClick={() => onDateSelect(day)}
              className={cn(
                "flex flex-col items-center gap-1 p-2 rounded-xl transition-all",
                selected
                  ? "bg-white dark:bg-gray-800 rounded-xl shadow-sm ring-1 ring-black/5 dark:ring-white/10"
                  : "hover:bg-white dark:hover:bg-gray-800"
              )}
            >
              <span
                className={cn(
                  "text-xs font-medium",
                  selected
                    ? "text-primary dark:text-primary"
                    : "text-text-sub dark:text-slate-500"
                )}
              >
                {dayName}
              </span>
              <span
                className={cn(
                  "flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold transition-all",
                  selected
                    ? "bg-primary text-white shadow-md shadow-primary/30 font-bold"
                    : "text-text-main dark:text-slate-300 group-hover:bg-primary/10 dark:group-hover:bg-slate-700"
                )}
              >
                {dayNumber}
              </span>
              {selected && (
                <div className="w-1 h-1 rounded-full bg-primary mt-0.5" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
