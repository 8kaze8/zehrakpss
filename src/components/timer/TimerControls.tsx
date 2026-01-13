/**
 * TimerControls Component
 * Timer kontrol butonları
 */

"use client";

import React from "react";

interface TimerControlsProps {
  isRunning: boolean;
  onStart: () => void;
  onPause: () => void;
  onStop: () => void;
}

export function TimerControls({
  isRunning,
  onStart,
  onPause,
  onStop,
}: TimerControlsProps) {
  return (
    <div className="flex w-full items-end justify-center gap-8 px-8 mb-4">
      {/* Stop Button (Secondary) */}
      <button
        onClick={onStop}
        className="group flex flex-col items-center gap-2 focus:outline-none"
        aria-label="Bitir"
      >
        <div className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-slate-200 dark:border-slate-700 bg-transparent text-slate-500 dark:text-slate-400 transition-all active:scale-95 group-hover:bg-slate-50 dark:group-hover:bg-white/5">
          <span className="material-symbols-outlined text-2xl">stop</span>
        </div>
        <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
          Bitir
        </span>
      </button>

      {/* Pause/Resume Button (Primary) */}
      <button
        onClick={isRunning ? onPause : onStart}
        className="group flex flex-col items-center gap-2 focus:outline-none relative -top-2"
        aria-label={isRunning ? "Duraklat" : "Başlat"}
      >
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#E6E6FA] dark:bg-[#3b3b5c] text-[#5D5D8D] dark:text-[#E6E6FA] shadow-xl shadow-indigo-100 dark:shadow-none transition-all active:scale-95 active:shadow-sm hover:brightness-95">
          <span className="material-symbols-outlined text-[40px]">
            {isRunning ? "pause" : "play_arrow"}
          </span>
        </div>
        <span className="text-sm font-semibold text-[#5D5D8D] dark:text-[#dcdceb]">
          {isRunning ? "Duraklat" : "Başlat"}
        </span>
      </button>
    </div>
  );
}
