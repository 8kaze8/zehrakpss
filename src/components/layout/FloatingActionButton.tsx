/**
 * FloatingActionButton Component
 * Expandable FAB with multiple actions
 */

"use client";

import React, { useState } from "react";
import { cn } from "@/utils/cn";

interface FABAction {
  icon: string;
  label: string;
  onClick: () => void;
  color?: string;
}

interface FloatingActionButtonProps {
  onClick?: () => void;
  onAddTask?: () => void;
  onAddExam?: () => void;
  icon?: string;
  label?: string;
  position?: "bottom-right" | "bottom-left" | "top-right" | "top-left";
  size?: "sm" | "md" | "lg";
  className?: string;
  expandable?: boolean;
}

const positionStyles = {
  "bottom-right": "bottom-24 right-6",
  "bottom-left": "bottom-24 left-6",
  "top-right": "top-24 right-6",
  "top-left": "top-24 left-6",
};

const sizeStyles = {
  sm: "h-12 w-12",
  md: "h-14 w-14",
  lg: "h-16 w-16",
};

const iconSizeStyles = {
  sm: 24,
  md: 28,
  lg: 32,
};

export function FloatingActionButton({
  onClick,
  onAddTask,
  onAddExam,
  icon = "add",
  label,
  position = "bottom-right",
  size = "md",
  className,
  expandable = false,
}: FloatingActionButtonProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Eğer expandable değilse veya sadece onClick varsa, basit FAB göster
  if (!expandable || (!onAddTask && !onAddExam)) {
    return (
      <button
        onClick={onClick}
        className={cn(
          "fixed z-30 flex items-center justify-center rounded-full bg-primary text-white shadow-lg shadow-blue-500/30 transition hover:bg-blue-600 active:scale-95",
          positionStyles[position],
          sizeStyles[size],
          className
        )}
        aria-label={label || "Ekle"}
      >
        <span
          className="material-symbols-outlined"
          style={{ fontSize: iconSizeStyles[size] }}
        >
          {icon}
        </span>
      </button>
    );
  }

  // Expandable FAB
  const actions: FABAction[] = [];
  
  if (onAddTask) {
    actions.push({
      icon: "assignment_add",
      label: "Görev Ekle",
      onClick: () => {
        setIsExpanded(false);
        onAddTask();
      },
      color: "bg-green-500 hover:bg-green-600 shadow-green-500/30",
    });
  }
  
  if (onAddExam) {
    actions.push({
      icon: "quiz",
      label: "Deneme Ekle",
      onClick: () => {
        setIsExpanded(false);
        onAddExam();
      },
      color: "bg-purple-500 hover:bg-purple-600 shadow-purple-500/30",
    });
  }

  return (
    <>
      {/* Backdrop */}
      {isExpanded && (
        <div
          className="fixed inset-0 z-20 bg-black/20 backdrop-blur-[2px]"
          onClick={() => setIsExpanded(false)}
        />
      )}

      {/* Expanded Actions */}
      <div
        className={cn(
          "fixed z-30 flex flex-col-reverse gap-3 transition-all duration-300",
          positionStyles[position],
          isExpanded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
        )}
        style={{ bottom: "calc(6rem + 4rem)" }}
      >
        {actions.map((action, index) => (
          <button
            key={action.label}
            onClick={action.onClick}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-full text-white shadow-lg transition-all duration-200",
              action.color || "bg-primary hover:bg-blue-600 shadow-blue-500/30",
              isExpanded
                ? "translate-x-0 opacity-100"
                : "translate-x-4 opacity-0",
            )}
            style={{
              transitionDelay: isExpanded ? `${index * 50}ms` : "0ms",
            }}
          >
            <span className="material-symbols-outlined text-xl">{action.icon}</span>
            <span className="text-sm font-medium whitespace-nowrap">{action.label}</span>
          </button>
        ))}
      </div>

      {/* Main FAB */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={cn(
          "fixed z-30 flex items-center justify-center rounded-full bg-primary text-white shadow-lg shadow-blue-500/30 transition-all duration-200 hover:bg-blue-600",
          positionStyles[position],
          sizeStyles[size],
          isExpanded && "rotate-45",
          className
        )}
        aria-label={label || "Ekle"}
      >
        <span
          className="material-symbols-outlined transition-transform duration-200"
          style={{ fontSize: iconSizeStyles[size] }}
        >
          {icon}
        </span>
      </button>
    </>
  );
}
