/**
 * Subjects Page
 * Konular sayfası
 */

"use client";

import React from "react";
import { Header } from "@/components/layout/Header";
import { Card } from "@/components/shared/Card";
import { ProgressBar } from "@/components/shared/ProgressBar";
import { SUBJECT_COLORS, SUBJECT_ICONS } from "@/utils/constants";
import { cn } from "@/utils/cn";
import type { Subject } from "@/types";

const subjects: Subject[] = ["TARİH", "COĞRAFYA", "MATEMATİK", "TÜRKÇE", "VATANDAŞLIK"];

export default function SubjectsPage() {
  // Örnek progress verileri - gerçek implementasyonda study plan'dan gelecek
  const subjectProgress: Record<Subject, number> = {
    TARİH: 65,
    COĞRAFYA: 42,
    MATEMATİK: 58,
    TÜRKÇE: 75,
    VATANDAŞLIK: 30,
  };

  return (
    <>
      <Header />
      <main className="flex-1 overflow-y-auto p-6">
        <h1 className="text-3xl font-bold text-text-main dark:text-white mb-6">
          Konular
        </h1>

        <div className="flex flex-col gap-4">
          {subjects.map((subject) => {
            const colors = SUBJECT_COLORS[subject];
            const icon = SUBJECT_ICONS[subject];
            const progress = subjectProgress[subject];

            return (
              <Card key={subject} className="hover:shadow-md transition-shadow duration-200">
                <div className="flex items-start gap-4">
                  <div
                    className={cn(
                      "flex-shrink-0 flex items-center justify-center w-14 h-14 rounded-xl",
                      colors.bg,
                      colors.text
                    )}
                  >
                    <span className="material-symbols-outlined text-2xl">
                      {icon}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-bold text-text-main dark:text-white">
                        {subject}
                      </h3>
                      <span className="text-sm font-bold text-primary dark:text-blue-400">
                        {progress}%
                      </span>
                    </div>
                    <ProgressBar
                      percentage={progress}
                      height="md"
                      color={colors.text.replace("text-", "bg-")}
                      animated
                    />
                    <div className="mt-3 flex gap-2">
                      <button
                        className={cn(
                          "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                          "bg-primary/10 text-primary hover:bg-primary/20",
                          colors.bg,
                          colors.text
                        )}
                      >
                        Konuları Gör
                      </button>
                      <button
                        className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-100 dark:bg-gray-700 text-text-main dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200"
                      >
                        Soru Çöz
                      </button>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </main>
    </>
  );
}
