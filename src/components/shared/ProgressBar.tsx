/**
 * ProgressBar Component
 * Horizontal progress bar component
 */

import React from "react";
import { cn } from "@/utils/cn";

interface ProgressBarProps {
  percentage: number;
  height?: "sm" | "md" | "lg";
  color?: string;
  showLabel?: boolean;
  label?: string;
  className?: string;
  animated?: boolean;
}

const heightStyles = {
  sm: "h-1.5",
  md: "h-2",
  lg: "h-3",
};

export function ProgressBar({
  percentage,
  height = "md",
  color = "bg-primary",
  showLabel = false,
  label,
  className,
  animated = true,
}: ProgressBarProps) {
  const clampedPercentage = Math.min(Math.max(percentage, 0), 100);

  return (
    <div className={cn("w-full", className)}>
      {showLabel && label && (
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs font-medium text-text-sub dark:text-slate-400">
            {label}
          </span>
          <span className="text-xs font-bold text-primary dark:text-blue-400">
            {Math.round(clampedPercentage)}%
          </span>
        </div>
      )}
      <div
        className={cn(
          "w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700",
          heightStyles[height]
        )}
      >
        <div
          className={cn(
            "h-full rounded-full transition-all",
            color,
            animated && "duration-1000 ease-out"
          )}
          style={{ width: `${clampedPercentage}%` }}
        />
      </div>
    </div>
  );
}
