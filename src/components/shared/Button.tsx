/**
 * Button Component
 * Reusable button component with variants
 */

import React from "react";
import { cn } from "@/utils/cn";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  icon?: string;
  iconPosition?: "left" | "right";
}

const variantStyles = {
  primary: "bg-primary text-white hover:bg-blue-600 shadow-lg shadow-blue-500/30",
  secondary: "bg-gray-100 dark:bg-gray-700 text-text-main dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600",
  outline: "border-2 border-primary text-primary hover:bg-primary/10",
  ghost: "text-primary hover:bg-primary/10",
};

const sizeStyles = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-base",
  lg: "px-6 py-3 text-lg",
};

export function Button({
  children,
  variant = "primary",
  size = "md",
  fullWidth = false,
  icon,
  iconPosition = "left",
  className,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-all",
        "focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        variantStyles[variant],
        sizeStyles[size],
        fullWidth && "w-full",
        className
      )}
      disabled={disabled}
      {...props}
    >
      {icon && iconPosition === "left" && (
        <span className="material-symbols-outlined text-xl">{icon}</span>
      )}
      {children}
      {icon && iconPosition === "right" && (
        <span className="material-symbols-outlined text-xl">{icon}</span>
      )}
    </button>
  );
}
