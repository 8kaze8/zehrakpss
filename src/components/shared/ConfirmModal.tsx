/**
 * ConfirmModal Component
 * Onay modal'ı - silme ve diğer işlemler için
 */

"use client";

import React, { useEffect } from "react";
import { Button } from "./Button";
import { cn } from "@/utils/cn";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "info";
  icon?: string;
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Evet",
  cancelText = "İptal",
  variant = "danger",
  icon,
}: ConfirmModalProps) {
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

  const variantStyles = {
    danger: {
      iconBg: "bg-red-100 dark:bg-red-900/30",
      iconColor: "text-red-600 dark:text-red-400",
      button: "bg-red-600 hover:bg-red-700 text-white",
    },
    warning: {
      iconBg: "bg-orange-100 dark:bg-orange-900/30",
      iconColor: "text-orange-600 dark:text-orange-400",
      button: "bg-orange-600 hover:bg-orange-700 text-white",
    },
    info: {
      iconBg: "bg-blue-100 dark:bg-blue-900/30",
      iconColor: "text-blue-600 dark:text-blue-400",
      button: "bg-blue-600 hover:bg-blue-700 text-white",
    },
  };

  const styles = variantStyles[variant];
  const defaultIcon = variant === "danger" ? "delete" : variant === "warning" ? "warning" : "info";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Card */}
      <div className="relative z-10 w-full max-w-sm bg-background-light dark:bg-background-dark rounded-2xl shadow-2xl ring-1 ring-black/5 dark:ring-white/10 overflow-hidden" style={{ animation: 'fadeIn 0.2s ease-out, scaleIn 0.2s ease-out' }}>
        {/* Content */}
        <div className="p-6">
          {/* Icon */}
          <div className="flex justify-center mb-4">
            <div
              className={cn(
                "flex items-center justify-center w-16 h-16 rounded-full",
                styles.iconBg
              )}
            >
              <span
                className={cn(
                  "material-symbols-outlined text-3xl",
                  styles.iconColor
                )}
              >
                {icon || defaultIcon}
              </span>
            </div>
          </div>

          {/* Title */}
          <h3 className="text-xl font-bold text-text-main dark:text-white text-center mb-2">
            {title}
          </h3>

          {/* Message */}
          <p className="text-sm text-text-sub dark:text-slate-400 text-center mb-6">
            {message}
          </p>

          {/* Buttons */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              fullWidth
              onClick={onClose}
              className="flex-1"
            >
              {cancelText}
            </Button>
            <Button
              variant="primary"
              fullWidth
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className={cn("flex-1", styles.button)}
            >
              {confirmText}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
