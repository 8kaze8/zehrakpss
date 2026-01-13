/**
 * Profile Page
 * Profil sayfası
 */

"use client";

import React from "react";
import { Header } from "@/components/layout/Header";
import { Card } from "@/components/shared/Card";
import { useTheme } from "@/context/ThemeContext";
import { Button } from "@/components/shared/Button";

export default function ProfilePage() {
  const { resolvedTheme, toggleTheme } = useTheme();

  return (
    <>
      <Header />
      <main className="flex-1 overflow-y-auto p-6">
        <h1 className="text-3xl font-bold text-text-main dark:text-white mb-6">
          Profil
        </h1>

        {/* Theme Toggle */}
        <Card className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-text-main dark:text-white mb-1">
                Tema
              </h3>
              <p className="text-sm text-text-sub dark:text-slate-400">
                {resolvedTheme === "dark" ? "Karanlık Mod" : "Aydınlık Mod"}
              </p>
            </div>
            <button
              onClick={toggleTheme}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary transition hover:bg-primary/20 dark:bg-primary/20 dark:text-blue-300"
              aria-label="Tema değiştir"
            >
              <span className="material-symbols-outlined">
                {resolvedTheme === "dark" ? "light_mode" : "dark_mode"}
              </span>
            </button>
          </div>
        </Card>

        {/* User Info */}
        <Card>
          <div className="flex items-center gap-4 mb-4">
            <div className="h-16 w-16 overflow-hidden rounded-full border-2 border-primary bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
              <span className="text-2xl font-bold text-white">Z</span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-text-main dark:text-white">
                Zehra
              </h3>
              <p className="text-sm text-text-sub dark:text-slate-400">
                KPSS Öğrencisi
              </p>
            </div>
          </div>
        </Card>

        {/* Settings */}
        <Card className="mt-6">
          <h3 className="text-lg font-bold text-text-main dark:text-white mb-4">
            Ayarlar
          </h3>
          <div className="space-y-3">
            <button className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-text-sub dark:text-slate-400">
                  notifications
                </span>
                <span className="text-text-main dark:text-white font-medium">
                  Bildirimler
                </span>
              </div>
              <span className="material-symbols-outlined text-text-sub dark:text-slate-400">
                chevron_right
              </span>
            </button>
            <button className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-text-sub dark:text-slate-400">
                  data_usage
                </span>
                <span className="text-text-main dark:text-white font-medium">
                  Veri Yönetimi
                </span>
              </div>
              <span className="material-symbols-outlined text-text-sub dark:text-slate-400">
                chevron_right
              </span>
            </button>
          </div>
        </Card>
      </main>
    </>
  );
}
