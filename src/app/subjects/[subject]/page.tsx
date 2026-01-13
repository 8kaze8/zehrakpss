/**
 * Subject Detail Page
 * Ders detay sayfası - Konu listesi
 */

"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Card } from "@/components/shared/Card";
import { ProgressBar } from "@/components/shared/ProgressBar";
import { SUBJECT_COLORS, SUBJECT_ICONS } from "@/utils/constants";
import { getSubjectTopics } from "@/data/subjects-data";
import { calculateSubjectProgress } from "@/utils/progress-calculator";
import { useStudyProgressContext } from "@/context/StudyProgressContext";
import { cn } from "@/utils/cn";
import { formatDate } from "@/utils/date";
import { parseISO } from "date-fns";
import { studyPlan } from "@/data/study-plan";

export default function SubjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { progress } = useStudyProgressContext();

  const subjectParam = params.subject as string;
  const subject = subjectParam.toUpperCase() as "TARİH" | "COĞRAFYA" | "MATEMATİK" | "TÜRKÇE" | "VATANDAŞLIK";

  if (!["TARİH", "COĞRAFYA", "MATEMATİK", "TÜRKÇE", "VATANDAŞLIK"].includes(subject)) {
    router.push("/subjects");
    return null;
  }

  const topics = getSubjectTopics(subject);
  const subjectProgress = calculateSubjectProgress(subject, progress);
  const colors = SUBJECT_COLORS[subject];
  const icon = SUBJECT_ICONS[subject];

  // Her konu için hangi haftada işlendiğini bul
  const getTopicWeekInfo = (topicName: string) => {
    for (const month of studyPlan.months) {
      for (const week of month.weeks) {
        const subjectKey = subject.toLowerCase() as keyof typeof week.subjects;
        if (week.subjects[subjectKey] === topicName) {
          return {
            month: month.month,
            week: week.weekNumber,
            dateRange: week.dateRange,
          };
        }
      }
    }
    return null;
  };

  return (
    <>
      <Header />
      <main className="flex-1 overflow-y-auto p-6">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 mb-6 text-text-sub dark:text-slate-400 hover:text-text-main dark:hover:text-white transition-colors"
        >
          <span className="material-symbols-outlined">arrow_back</span>
          <span className="text-sm font-medium">Geri</span>
        </button>

        {/* Subject Header */}
        <div className="mb-6">
          <div className="flex items-center gap-4 mb-4">
            <div
              className={cn(
                "flex items-center justify-center w-16 h-16 rounded-xl",
                colors.bg,
                colors.text
              )}
            >
              <span className="material-symbols-outlined text-3xl">{icon}</span>
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-text-main dark:text-white">
                {subject}
              </h1>
              <p className="text-sm text-text-sub dark:text-slate-400 mt-1">
                {topics.length} Konu
              </p>
            </div>
          </div>

          {/* Overall Progress */}
          <Card>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-text-sub dark:text-slate-400">
                Genel İlerleme
              </span>
              <span className="text-lg font-bold text-primary dark:text-blue-400">
                {subjectProgress.percentage}%
              </span>
            </div>
            <ProgressBar
              percentage={subjectProgress.percentage}
              height="md"
              color={colors.text.replace("text-", "bg-")}
              animated
            />
            <p className="text-xs text-text-sub dark:text-slate-400 mt-2 text-center">
              {subjectProgress.completed} / {subjectProgress.total} konu tamamlandı
            </p>
          </Card>
        </div>

        {/* Topics List */}
        <div className="space-y-3">
          <h2 className="text-xl font-bold text-text-main dark:text-white mb-4">
            Konular
          </h2>
          {topics.map((topic, index) => {
            const weekInfo = getTopicWeekInfo(topic.name);
            const isCompleted = index < subjectProgress.completed;

            return (
              <Card
                key={topic.id}
                className={cn(
                  "hover:shadow-md transition-all duration-200",
                  isCompleted && "opacity-75"
                )}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={cn(
                      "flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-lg font-bold text-sm",
                      isCompleted
                        ? `${colors.bg} ${colors.text}`
                        : "bg-gray-100 dark:bg-gray-700 text-text-sub dark:text-slate-400"
                    )}
                  >
                    {isCompleted ? (
                      <span className="material-symbols-outlined text-lg">check</span>
                    ) : (
                      <span>{index + 1}</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-semibold text-text-main dark:text-white mb-1">
                      {topic.name}
                    </h3>
                    {weekInfo && (
                      <div className="flex items-center gap-2 text-xs text-text-sub dark:text-slate-400">
                        <span className="material-symbols-outlined text-sm">
                          calendar_month
                        </span>
                        <span>
                          {weekInfo.month} {weekInfo.week}. Hafta
                        </span>
                        <span>•</span>
                        <span>
                          {formatDate(parseISO(weekInfo.dateRange.start), "d MMM")} -{" "}
                          {formatDate(parseISO(weekInfo.dateRange.end), "d MMM")}
                        </span>
                      </div>
                    )}
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
