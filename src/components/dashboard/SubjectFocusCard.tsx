/**
 * SubjectFocusCard Component
 * Konu odağı kartı - En çok ilerleme yapılan dersi gösterir
 */

"use client";

import React, { useMemo } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/shared/Card";
import { ProgressBar } from "@/components/shared/ProgressBar";
import { Button } from "@/components/shared/Button";
import { calculateSubjectProgress } from "@/utils/progress-calculator";
import { useStudyProgressContext } from "@/context/StudyProgressContext";
import { getSubjectTopics } from "@/data/subjects";
import { SUBJECT_COLORS, SUBJECT_ICONS, SUBJECT_TO_SLUG } from "@/utils/constants";
import { cn } from "@/utils/cn";
import type { Subject } from "@/types";

const allSubjects: Subject[] = ["TARİH", "COĞRAFYA", "MATEMATİK", "TÜRKÇE", "VATANDAŞLIK"];

export function SubjectFocusCard() {
  const { progress } = useStudyProgressContext();
  const router = useRouter();
  
  // En çok ilerleme yapılan dersi bul
  const focusedSubject = useMemo(() => {
    let maxProgress = -1;
    let bestSubject: Subject = "TARİH"; // Default
    
    allSubjects.forEach((subject) => {
      const subjectProgress = calculateSubjectProgress(subject, progress);
      if (subjectProgress.percentage > maxProgress) {
        maxProgress = subjectProgress.percentage;
        bestSubject = subject;
      }
    });
    
    return bestSubject;
  }, [progress]);
  
  // Seçilen dersin ilerlemesini hesapla
  const subjectProgress = useMemo(
    () => calculateSubjectProgress(focusedSubject, progress),
    [focusedSubject, progress]
  );
  
  const currentTopic = subjectProgress.currentTopic;
  const topics = getSubjectTopics(focusedSubject);
  const topic = currentTopic || (topics.length > 0 ? topics[0].name : "Konu seçilmedi");
  const progressPercentage = subjectProgress.percentage;
  
  // Ders renkleri ve ikonu
  const colors = SUBJECT_COLORS[focusedSubject];
  const icon = SUBJECT_ICONS[focusedSubject];
  
  // Konular sayfasına yönlendir
  const handleViewTopics = () => {
    const slug = SUBJECT_TO_SLUG[focusedSubject] || focusedSubject.toLowerCase();
    router.push(`/subjects/${slug}`);
  };

  // Progress bar rengi derse göre dinamik
  const progressBarColor = useMemo(() => {
    if (focusedSubject === "TARİH") return "bg-orange-500";
    if (focusedSubject === "COĞRAFYA") return "bg-green-500";
    if (focusedSubject === "MATEMATİK") return "bg-blue-500";
    if (focusedSubject === "TÜRKÇE") return "bg-teal-500";
    if (focusedSubject === "VATANDAŞLIK") return "bg-purple-500";
    return "bg-purple-500";
  }, [focusedSubject]);

  return (
    <section className="px-6 pb-6">
      <Card variant="lavender" padding="lg" className="relative overflow-hidden">
        {/* Decorative Circle - Ders rengine göre */}
        <div 
          className={cn(
            "absolute -right-6 -top-6 h-24 w-24 rounded-full blur-xl opacity-50",
            colors.bg
          )} 
        />
        
        <div className="relative z-10">
          <div className={cn("mb-1 flex items-center gap-2", colors.text)}>
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
              {icon}
            </span>
            <span className="text-xs font-bold uppercase tracking-wider">
              Konu Odağı
            </span>
          </div>
          <h3 className="mb-1 text-xl font-bold text-text-main dark:text-white">
            {focusedSubject}
          </h3>
          <p className="text-sm font-medium text-text-sub dark:text-gray-400">
            {topic}
          </p>
          <div className="mt-4">
            <div className="mb-2 flex justify-between text-xs font-medium text-text-sub">
              <span>İlerleme</span>
              <span>{progressPercentage}%</span>
            </div>
            <ProgressBar 
              percentage={progressPercentage} 
              height="md" 
              color={progressBarColor} 
            />
          </div>
          <Button
            variant="secondary"
            size="sm"
            fullWidth
            onClick={handleViewTopics}
            className={cn(
              "mt-5 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600",
              colors.text
            )}
            icon="arrow_forward"
            iconPosition="right"
          >
            Konuları Gör
          </Button>
        </div>
      </Card>
    </section>
  );
}
