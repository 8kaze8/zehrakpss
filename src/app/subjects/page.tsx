/**
 * Subjects Page
 * Konular sayfası
 */

"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Card } from "@/components/shared/Card";
import { ProgressBar } from "@/components/shared/ProgressBar";
import { SUBJECT_COLORS, SUBJECT_ICONS, subjectsData } from "@/utils/constants";
import { calculateSubjectProgress } from "@/utils/progress-calculator";
import { useStudyProgressContext } from "@/context/StudyProgressContext";
import { cn } from "@/utils/cn";
import type { Subject } from "@/types";

const subjects: Subject[] = ["TARİH", "COĞRAFYA", "MATEMATİK", "TÜRKÇE", "VATANDAŞLIK"];

export default function SubjectsPage() {
  const router = useRouter();
  const { progress } = useStudyProgressContext();

  const handleViewTopics = (subject: Subject) => {
    router.push(`/subjects/${subject.toLowerCase()}`);
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
            const subjectProgress = calculateSubjectProgress(subject, progress);
            const totalQuestions = subjectsData[subject]?.totalQuestions || 0;

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
                      <div>
                        <h3 className="text-lg font-bold text-text-main dark:text-white">
                          {subject}
                        </h3>
                        {totalQuestions > 0 && (
                          <p className="text-xs text-text-sub dark:text-slate-400 mt-0.5">
                            {totalQuestions} Soru
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-bold text-primary dark:text-blue-400 block">
                          {subjectProgress.percentage}%
                        </span>
                        <span className="text-xs text-text-sub dark:text-slate-400">
                          {subjectProgress.completed}/{subjectProgress.total} Konu
                        </span>
                      </div>
                    </div>
                    <ProgressBar
                      percentage={subjectProgress.percentage}
                      height="md"
                      color={colors.text.replace("text-", "bg-")}
                      animated
                    />
                    <div className="mt-3 flex gap-2">
                      <button
                        onClick={() => handleViewTopics(subject)}
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
