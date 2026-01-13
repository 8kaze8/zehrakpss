/**
 * Checkbox Component
 * Custom styled checkbox component
 */

import React from "react";
import { cn } from "@/utils/cn";

interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  className?: string;
  size?: "sm" | "md" | "lg";
}

const sizeStyles = {
  sm: "h-4 w-4",
  md: "h-5 w-5",
  lg: "h-6 w-6",
};

export function Checkbox({
  checked,
  onChange,
  label,
  disabled = false,
  className,
  size = "md",
}: CheckboxProps) {
  return (
    <label
      className={cn(
        "flex items-center gap-3 cursor-pointer",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
    >
      <div className="relative flex items-center">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
          className={cn(
            "appearance-none rounded border-2 transition-all duration-200",
            sizeStyles[size],
            checked
              ? "bg-primary border-primary"
              : "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700",
            "focus:ring-2 focus:ring-primary/20 focus:ring-offset-0",
            disabled && "cursor-not-allowed"
          )}
          aria-checked={checked}
          aria-label={label || "Checkbox"}
        />
        {checked && (
          <span className="material-symbols-outlined absolute inset-0 flex items-center justify-center text-white text-xs pointer-events-none">
            check
          </span>
        )}
      </div>
      {label && (
        <span className="text-sm font-medium text-text-main dark:text-white">
          {label}
        </span>
      )}
    </label>
  );
}
