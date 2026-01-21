/**
 * Card Component
 * Reusable card component with variants
 */

import React from "react";
import { cn } from "@/utils/cn";

interface CardProps {
  children: React.ReactNode;
  variant?: "default" | "mint" | "lavender";
  padding?: "sm" | "md" | "lg";
  shadow?: "none" | "soft" | "md";
  className?: string;
  onClick?: () => void;
}

const variantStyles = {
  default: "bg-white dark:bg-gray-800",
  mint: "bg-soft-mint/50 dark:bg-[#1A2E35]",
  lavender: "bg-soft-lavender dark:bg-[#2D2A3E]",
};

const paddingStyles = {
  sm: "p-4",
  md: "p-5",
  lg: "p-6",
};

const shadowStyles = {
  none: "",
  soft: "shadow-soft",
  md: "shadow-md",
};

export function Card({
  children,
  variant = "default",
  padding = "md",
  shadow = "soft",
  className,
  onClick,
}: CardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "rounded-2xl transition-all duration-200",
        variantStyles[variant],
        paddingStyles[padding],
        shadowStyles[shadow],
        onClick && "cursor-pointer",
        className
      )}
    >
      {children}
    </div>
  );
}
