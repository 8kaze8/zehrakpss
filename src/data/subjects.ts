/**
 * Subjects Data
 * Tüm derslerin konu listesi - Study plan'dan çıkarılmış
 */

import type { Subject } from "@/types";
import { studyPlan } from "./study-plan";

export interface SubjectTopic {
  id: string;
  name: string;
  weekId: string; // Hangi haftada işlenecek
  month: string;
  year: number;
  weekNumber: number;
  dateRange: {
    start: string;
    end: string;
  };
  isCompleted?: boolean;
}

export interface SubjectData {
  subject: Subject;
  topics: SubjectTopic[];
  totalTopics: number;
  completedTopics: number;
  progress: number;
}

// Cache için
let cachedTopics: Record<Subject, SubjectTopic[]> | null = null;

/**
 * Study plan'dan tüm konuları çıkar
 */
export function extractAllTopics() {
  const topics: Record<Subject, SubjectTopic[]> = {
    TARİH: [],
    COĞRAFYA: [],
    MATEMATİK: [],
    TÜRKÇE: [],
    VATANDAŞLIK: [],
  };

  studyPlan.months.forEach((month) => {
    month.weeks.forEach((week) => {
      const weekId = `${month.year}-${month.month}-${week.weekNumber}`;
      
      // Tarih konuları
      if (week.subjects.tarih && week.subjects.tarih !== "KONU TESLİMİ" && week.subjects.tarih !== "ANALİZ" && week.subjects.tarih !== "TEKRAR") {
        topics.TARİH.push({
          id: `tarih-${weekId}`,
          name: week.subjects.tarih,
          weekId,
          month: month.month,
          year: month.year,
          weekNumber: week.weekNumber,
          dateRange: week.dateRange,
        });
      }

      // Coğrafya konuları
      if (week.subjects.cografya && week.subjects.cografya !== "KONU TESLİMİ" && week.subjects.cografya !== "ANALİZ" && week.subjects.cografya !== "TEKRAR") {
        topics.COĞRAFYA.push({
          id: `cografya-${weekId}`,
          name: week.subjects.cografya,
          weekId,
          month: month.month,
          year: month.year,
          weekNumber: week.weekNumber,
          dateRange: week.dateRange,
        });
      }

      // Matematik konuları
      if (week.subjects.matematik && week.subjects.matematik !== "KONU TESLİMİ" && week.subjects.matematik !== "ANALİZ" && week.subjects.matematik !== "TEKRAR") {
        topics.MATEMATİK.push({
          id: `matematik-${weekId}`,
          name: week.subjects.matematik,
          weekId,
          month: month.month,
          year: month.year,
          weekNumber: week.weekNumber,
          dateRange: week.dateRange,
        });
      }

      // Türkçe konuları
      if (week.subjects.turkce && week.subjects.turkce !== "KONU TESLİMİ" && week.subjects.turkce !== "ANALİZ" && week.subjects.turkce !== "TEKRAR" && !week.subjects.turkce.includes("HUKUK") && !week.subjects.turkce.includes("ANAYASA") && !week.subjects.turkce.includes("YASAMA") && !week.subjects.turkce.includes("YÜRÜTME") && !week.subjects.turkce.includes("YARGI") && !week.subjects.turkce.includes("Vatandaşlık")) {
        topics.TÜRKÇE.push({
          id: `turkce-${weekId}`,
          name: week.subjects.turkce,
          weekId,
          month: month.month,
          year: month.year,
          weekNumber: week.weekNumber,
          dateRange: week.dateRange,
        });
      }

      // Vatandaşlık konuları (Türkçe sütununda bazıları var)
      if (week.subjects.turkce && (
        week.subjects.turkce.includes("HUKUK") ||
        week.subjects.turkce.includes("ANAYASA") ||
        week.subjects.turkce.includes("YASAMA") ||
        week.subjects.turkce.includes("YÜRÜTME") ||
        week.subjects.turkce.includes("YARGI") ||
        week.subjects.turkce.includes("Vatandaşlık")
      )) {
        topics.VATANDAŞLIK.push({
          id: `vatandaslik-${weekId}`,
          name: week.subjects.turkce,
          weekId,
          month: month.month,
          year: month.year,
          weekNumber: week.weekNumber,
          dateRange: week.dateRange,
        });
      }
    });
  });

  cachedTopics = topics;
  return topics;
}

/**
 * Belirli bir ders için konu listesini getir
 */
export function getSubjectTopics(subject: Subject): SubjectTopic[] {
  if (!cachedTopics) {
    extractAllTopics();
  }
  return cachedTopics?.[subject] || [];
}

/**
 * Belirli bir ders için progress hesapla
 */
export function calculateSubjectProgress(
  subject: Subject,
  completedTaskIds: string[]
): SubjectData {
  const topics = getSubjectTopics(subject);
  const completedTopics = topics.filter((topic) =>
    completedTaskIds.some((id) => id.includes(topic.id))
  ).length;

  return {
    subject,
    topics,
    totalTopics: topics.length,
    completedTopics,
    progress: topics.length > 0 ? Math.round((completedTopics / topics.length) * 100) : 0,
  };
}
