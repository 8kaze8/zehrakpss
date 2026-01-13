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
import { Button } from "@/components/shared/Button";
import { SUBJECT_COLORS, SUBJECT_ICONS } from "@/utils/constants";
import { getSubjectTopics, calculateSubjectProgress } from "@/data/subjects";
import { useStudyProgressContext } from "@/context/StudyProgressContext";
import { formatDate } from "@/utils/date";
import { cn } from "@/utils/cn";
import type { Subject } from "@/types";
import { parseISO, isBefore, isAfter, isSameDay } from "date-fns";

export default function SubjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { progress } = useStudyProgressContext();

  const subjectParam = params.subject as string;
  const subject = subjectParam.toUpperCase() as Subject;

  // Geçerli ders kontrolü
  const validSubjects: Subject[] = ["TARİH", "COĞRAFYA", "MATEMATİK", "TÜRKÇE", "VATANDAŞLIK"];
  if (!validSubjects.includes(subject)) {
    router.push("/subjects");
    return null;
  }

  const topics = getSubjectTopics(subject);
  const subjectData = calculateSubjectProgress(subject, progress);
  const colors = SUBJECT_COLORS[subject];
  const icon = SUBJECT_ICONS[subject];

  const today = new Date();

  const getTopicStatus = (topic: any) => {
    const start = parseISO(topic.dateRange.start);
    const end = parseISO(topic.dateRange.end);
    const taskId = `task-${subject.toLowerCase()}-${topic.dateRange.start}`;

    // Tamamlanmış mı?
    const isCompleted = Object.values(progress.daily).some((daily) =>
      daily.tasks.some((t) => t.taskId === taskId && t.completed)
    );

    if (isCompleted) return "completed";
    if (isAfter(today, end)) return "past";
    if ((isAfter(today, start) || isSameDay(today, start)) && (isBefore(today, end) || isSameDay(today, end))) {
      return "current";
    }
    return "upcoming";
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
        <div className="flex items-center gap-4 mb-6">
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
              {subjectData.completedTopics} / {subjectData.totalTopics} konu tamamlandı
            </p>
          </div>
        </div>

        {/* Progress Card */}
        <Card className="mb-6">
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-text-sub dark:text-slate-400">
                Genel İlerleme
              </span>
              <span className="text-lg font-bold text-primary dark:text-blue-400">
                {subjectData.percentage}%
              </span>
            </div>
            <ProgressBar
              percentage={subjectData.percentage}
              height="lg"
              color={colors.text.replace("text-", "bg-")}
              animated
            />
          </div>
        </Card>

        {/* Topics List */}
        <div className="mb-4">
          <h2 className="text-xl font-bold text-text-main dark:text-white mb-4">
            Konular
          </h2>
        </div>

        <div className="flex flex-col gap-3">
          {topics.map((topic) => {
            const status = getTopicStatus(topic);
            const statusStyles = {
              completed: {
                bg: "bg-green-50 dark:bg-green-900/20",
                border: "border-green-200 dark:border-green-800",
                badge: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
                badgeText: "Tamamlandı",
              },
              current: {
                bg: "bg-primary/10 dark:bg-primary/20",
                border: "border-primary dark:border-primary/50",
                badge: "bg-primary text-white",
                badgeText: "Devam Ediyor",
              },
              past: {
                bg: "bg-gray-50 dark:bg-gray-800",
                border: "border-gray-200 dark:border-gray-700",
                badge: "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300",
                badgeText: "Geçti",
              },
              upcoming: {
                bg: "bg-white dark:bg-gray-800",
                border: "border-gray-200 dark:border-gray-700",
                badge: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
                badgeText: "Yaklaşıyor",
              },
            };

            const style = statusStyles[status];

            return (
              <Card
                key={topic.id}
                className={cn(
                  "border-2 transition-all duration-200",
                  style.bg,
                  style.border
                )}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-base font-semibold text-text-main dark:text-white">
                        {topic.name}
                      </h3>
                      <span
                        className={cn(
                          "px-2 py-0.5 rounded-md text-xs font-medium",
                          style.badge
                        )}
                      >
                        {style.badgeText}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-text-sub dark:text-slate-400">
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">
                          calendar_month
                        </span>
                        {formatDate(topic.dateRange.start, "d MMMM")} -{" "}
                        {formatDate(topic.dateRange.end, "d MMMM yyyy")}
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">
                          event
                        </span>
                        {topic.month} {topic.year} - {topic.weekNumber}. Hafta
                      </span>
                    </div>
                  </div>
                  {status === "completed" && (
                    <div className="flex-shrink-0 ml-4">
                      <span className="material-symbols-outlined text-green-600 dark:text-green-400 text-2xl">
                        check_circle
                      </span>
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>

        {topics.length === 0 && (
          <Card>
            <div className="text-center py-8 text-text-sub dark:text-slate-400">
              <span className="material-symbols-outlined text-4xl mb-2 block">
                book
              </span>
              <p>Bu ders için henüz konu bulunmuyor.</p>
            </div>
          </Card>
        )}
      </main>
    </>
  );
}
