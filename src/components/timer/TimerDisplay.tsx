/**
 * TimerDisplay Component
 * Timer görüntüleme component'i
 */

"use client";

import React from "react";
import { formatDurationWithMs } from "@/utils/formatters";

interface TimerDisplayProps {
  minutes: number;
  seconds: number;
  milliseconds: number;
}

export function TimerDisplay({
  minutes,
  seconds,
  milliseconds,
}: TimerDisplayProps) {
  const totalMs = minutes * 60000 + seconds * 1000 + milliseconds * 10;

  return (
    <div className="flex flex-col items-center justify-center w-full px-6 py-4 mb-6">
      {/* Main Timer Display */}
      <div className="relative w-full flex items-baseline justify-center font-mono text-primary select-none">
        <span className="text-[5rem] leading-none font-bold tracking-tighter tabular-nums drop-shadow-sm">
          {minutes.toString().padStart(2, "0")}
        </span>
        <span className="text-[3rem] leading-none font-light text-slate-300 dark:text-slate-600 relative -top-4 mx-1">
          :
        </span>
        <span className="text-[5rem] leading-none font-bold tracking-tighter tabular-nums drop-shadow-sm">
          {seconds.toString().padStart(2, "0")}
        </span>
      </div>
      {/* Milliseconds */}
      <div className="flex items-center justify-center gap-1 mt-[-0.5rem]">
        <span className="text-2xl font-medium text-slate-400 dark:text-slate-500 font-mono tracking-widest tabular-nums">
          .{milliseconds.toString().padStart(2, "0")}
        </span>
      </div>
    </div>
  );
}
