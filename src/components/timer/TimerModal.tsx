/**
 * TimerModal Component
 * Timer modal popup
 */

"use client";

import React, { useEffect } from "react";
import { useTimer } from "@/hooks/useTimer";
import { TimerDisplay } from "./TimerDisplay";
import { TimerControls } from "./TimerControls";
import { cn } from "@/utils/cn";

interface TimerModalProps {
  isOpen: boolean;
  onClose: () => void;
  taskType?: string;
  taskTitle?: string;
  initialTime?: number; // milliseconds
}

export function TimerModal({
  isOpen,
  onClose,
  taskType = "Hız Testi",
  taskTitle = "Turkish - Paragraphs",
  initialTime = 0,
}: TimerModalProps) {
  const timer = useTimer(initialTime);

  // ESC tuşu ile kapat
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  // Modal açıkken body scroll'unu engelle
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleStop = () => {
    timer.stop();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Card */}
      <div className="relative z-10 w-full sm:max-w-[400px] bg-background-light dark:bg-background-dark rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col ring-1 ring-black/5 dark:ring-white/10 relative overflow-hidden max-h-[90vh]">
        {/* Bottom Sheet Handle */}
        <div className="flex w-full items-center justify-center pt-3 pb-1">
          <div className="h-1.5 w-10 rounded-full bg-[#cfdbe7] dark:bg-slate-600" />
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          aria-label="Kapat"
        >
          <span className="material-symbols-outlined text-lg">close</span>
        </button>

        {/* Content Body */}
        <div className="flex flex-col items-center w-full pt-2 pb-8 overflow-y-auto">
          {/* Header Section */}
          <div className="text-center px-4 pt-4 pb-2">
            <h2 className="text-[#0d141b] dark:text-white tracking-tight text-[28px] font-bold leading-tight px-4 text-center">
              {taskType}
            </h2>
            <p className="text-[#4c739a] dark:text-slate-400 text-sm font-normal leading-normal pt-1 px-4 text-center">
              {taskTitle}
            </p>
          </div>

          {/* Status Chip */}
          {timer.isRunning && (
            <div className="mt-2 mb-6">
              <div className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-full bg-green-100 dark:bg-green-900/40 pl-3 pr-4 border border-green-200 dark:border-green-800">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <p className="text-green-800 dark:text-green-300 text-xs font-semibold uppercase tracking-wide leading-normal">
                  Running
                </p>
              </div>
            </div>
          )}

          {/* Timer Display */}
          <TimerDisplay
            minutes={timer.minutes}
            seconds={timer.seconds}
            milliseconds={timer.milliseconds}
          />

          {/* Action Controls */}
          <TimerControls
            isRunning={timer.isRunning}
            onStart={timer.start}
            onPause={timer.pause}
            onStop={handleStop}
          />

          {/* Footer / Microcopy */}
          <div className="mt-4 px-8 text-center">
            <p className="text-slate-400 dark:text-slate-600 text-xs font-medium">
              Focus on accuracy. Speed comes with practice.
            </p>
          </div>
        </div>

        {/* Bottom spacing for phone home indicator area */}
        <div className="h-6 w-full" />
      </div>
    </div>
  );
}
