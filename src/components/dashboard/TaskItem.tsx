/**
 * TaskItem Component
 * Görev listesi item component'i
 */

"use client";

import React, { useState } from "react";
import { Checkbox } from "@/components/shared/Checkbox";
import { ConfirmModal } from "@/components/shared/ConfirmModal";
import { cn } from "@/utils/cn";

interface TaskItemProps {
  id: string;
  label: string;
  completed: boolean;
  onToggle: (id: string) => void;
  onStart?: (id: string, label: string) => void;
  onDelete?: (id: string) => void;
  showPlayButton?: boolean;
  isCustom?: boolean;
}

export function TaskItem({
  id,
  label,
  completed,
  onToggle,
  onStart,
  onDelete,
  showPlayButton = false,
  isCustom = false,
}: TaskItemProps) {
  const [showConfirm, setShowConfirm] = useState(false);
  const isCustomTask = isCustom || id.startsWith("custom-");

  return (
    <>
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
        <div className="flex items-center gap-2">
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
          {isCustomTask && onDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowConfirm(true);
              }}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-red-50 text-red-500 transition hover:bg-red-100 hover:text-red-600 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30"
              aria-label="Sil"
            >
              <span className="material-symbols-outlined" style={{ fontSize: 20 }}>
                delete
              </span>
            </button>
          )}
        </div>
      </div>

      {/* Confirm Modal */}
      {onDelete && (
        <ConfirmModal
          isOpen={showConfirm}
          onClose={() => setShowConfirm(false)}
          onConfirm={() => onDelete(id)}
          title="Görevi Sil"
          message={`"${label}" görevini silmek istediğinize emin misiniz? Bu işlem geri alınamaz.`}
          confirmText="Sil"
          cancelText="İptal"
          variant="danger"
          icon="delete"
        />
      )}
    </>
  );
}
