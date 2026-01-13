/**
 * TaskItem Component
 * Görev listesi item component'i
 */

"use client";

import React from "react";
import { Checkbox } from "@/components/shared/Checkbox";
import { cn } from "@/utils/cn";

interface TaskItemProps {
  id: string;
  label: string;
  completed: boolean;
  onToggle: (id: string) => void;
  onStart?: (id: string, label: string) => void;
  showPlayButton?: boolean;
}

export function TaskItem({
  id,
  label,
  completed,
  onToggle,
  onStart,
  showPlayButton = false,
}: TaskItemProps) {
  return (
    <div
      className={cn(
        "group flex items-center justify-between rounded-xl bg-white dark:bg-gray-800 p-3 shadow-sm transition-all hover:shadow-md",
        completed && "opacity-60"
      )}
    >
      <div className="flex items-center gap-3 flex-1">
        <Checkbox
          checked={completed}
          onChange={() => onToggle(id)}
          label={label}
        />
      </div>
      {showPlayButton && onStart && (
        <button
          onClick={() => onStart(id, label)}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary transition hover:bg-primary hover:text-white dark:bg-primary/20 dark:text-blue-300 dark:hover:bg-primary dark:hover:text-white"
          aria-label="Başlat"
        >
          <span className="material-symbols-outlined" style={{ fontSize: 20 }}>
            play_arrow
          </span>
        </button>
      )}
    </div>
  );
}
