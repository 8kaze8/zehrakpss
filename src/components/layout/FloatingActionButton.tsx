/**
 * FloatingActionButton Component
 * Reusable FAB component
 */

import React from "react";
import { cn } from "@/utils/cn";

interface FloatingActionButtonProps {
  onClick: () => void;
  icon?: string;
  label?: string;
  position?: "bottom-right" | "bottom-left" | "top-right" | "top-left";
  size?: "sm" | "md" | "lg";
  className?: string;
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
  icon = "add",
  label,
  position = "bottom-right",
  size = "md",
  className,
}: FloatingActionButtonProps) {
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
