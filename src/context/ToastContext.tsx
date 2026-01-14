/**
 * ToastContext
 * Uygulama genelinde toast/notification gösterimi için context
 */

"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import { cn } from "@/utils/cn";

type ToastType = "success" | "error" | "warning" | "info";

interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

interface ToastContextValue {
  showToast: (options: Omit<Toast, "id">) => void;
  hideToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

const TOAST_ICONS: Record<ToastType, string> = {
  success: "check_circle",
  error: "error",
  warning: "warning",
  info: "info",
};

const TOAST_COLORS: Record<ToastType, string> = {
  success: "bg-green-500",
  error: "bg-red-500",
  warning: "bg-amber-500",
  info: "bg-blue-500",
};

function ToastItem({
  toast,
  onClose,
}: {
  toast: Toast;
  onClose: (id: string) => void;
}) {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    // Giriş animasyonu
    const showTimer = setTimeout(() => setIsVisible(true), 10);

    // Otomatik kapanma
    const hideTimer = setTimeout(() => {
      setIsLeaving(true);
      setTimeout(() => onClose(toast.id), 300);
    }, toast.duration || 3000);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, [toast.id, toast.duration, onClose]);

  return (
    <div
      className={cn(
        "flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg transition-all duration-300 min-w-[280px] max-w-[360px]",
        "bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700",
        isVisible && !isLeaving
          ? "translate-y-0 opacity-100"
          : "translate-y-2 opacity-0"
      )}
    >
      <div
        className={cn(
          "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center",
          TOAST_COLORS[toast.type]
        )}
      >
        <span className="material-symbols-outlined text-white text-lg">
          {TOAST_ICONS[toast.type]}
        </span>
      </div>
      <p className="flex-1 text-sm font-medium text-text-main dark:text-white">
        {toast.message}
      </p>
      <button
        onClick={() => {
          setIsLeaving(true);
          setTimeout(() => onClose(toast.id), 300);
        }}
        className="flex-shrink-0 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
      >
        <span className="material-symbols-outlined text-text-sub dark:text-gray-400 text-lg">
          close
        </span>
      </button>
    </div>
  );
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((options: Omit<Toast, "id">) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    setToasts((prev) => [...prev, { ...options, id }]);
  }, []);

  const hideToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}

      {/* Toast Container */}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-2 items-center">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onClose={hideToast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}

/**
 * Shorthand helpers
 */
export function useToastHelpers() {
  const { showToast } = useToast();

  return {
    success: (message: string, duration?: number) =>
      showToast({ message, type: "success", duration }),
    error: (message: string, duration?: number) =>
      showToast({ message, type: "error", duration }),
    warning: (message: string, duration?: number) =>
      showToast({ message, type: "warning", duration }),
    info: (message: string, duration?: number) =>
      showToast({ message, type: "info", duration }),
  };
}
