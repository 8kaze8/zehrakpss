/**
 * Header Component
 * Top app bar with profile and notifications
 */

import React from "react";

interface HeaderProps {
  userName?: string;
  showNotifications?: boolean;
  onNotificationClick?: () => void;
}

export function Header({
  userName = "Zehra",
  showNotifications = true,
  onNotificationClick,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-20 flex items-center justify-between bg-background-light/90 dark:bg-background-dark/90 px-6 py-4 backdrop-blur-md">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 overflow-hidden rounded-full border border-gray-200 dark:border-gray-700 bg-gradient-to-br from-blue-400 to-purple-500">
          {/* Profile picture placeholder */}
        </div>
        <div>
          <span className="text-xs font-medium text-text-sub">Hoşgeldin,</span>
          <h2 className="text-sm font-bold text-text-main dark:text-white">
            KPSS Takip
          </h2>
        </div>
      </div>
      {showNotifications && (
        <button
          onClick={onNotificationClick}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white dark:bg-gray-800 text-text-main dark:text-white shadow-sm transition hover:bg-gray-50 dark:hover:bg-gray-700"
          aria-label="Bildirimler"
        >
          <span className="material-symbols-outlined" style={{ fontSize: 24 }}>
            notifications
          </span>
        </button>
      )}
    </header>
  );
}
