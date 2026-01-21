/**
 * Supabase Service
 * CRUD operations for study progress
 */

import { getSupabase, type DailyProgressRow, type CustomTaskRow, type ExamRow } from "@/lib/supabase";
import type { UserProgress, TaskCompletion, DailyProgress, CustomTask, Exam, Subject, TopicNote } from "@/types";
import { logger } from "@/utils/logger";

/**
 * Tüm progress verilerini getir
 */
export async function fetchAllProgress(): Promise<UserProgress> {
  const supabase = getSupabase();
  
  if (!supabase) {
    logger.warn("Supabase not available, returning empty progress");
    return {
      daily: {},
      weekly: {},
      monthly: {},
      customTasks: [],
      exams: [],
    };
  }

  try {
    // Daily progress
    const { data: dailyData, error: dailyError } = await supabase
      .from("daily_progress")
      .select("*");

    if (dailyError) throw dailyError;

    // Custom tasks
    const { data: tasksData, error: tasksError } = await supabase
      .from("custom_tasks")
      .select("*");

    if (tasksError) throw tasksError;

    // Exams
    const { data: examsData, error: examsError } = await supabase
      .from("exams")
      .select("*");

    if (examsError) throw examsError;

    // Transform daily progress
    const daily: Record<string, DailyProgress> = {};
    (dailyData as DailyProgressRow[] || []).forEach((row) => {
      daily[row.date] = {
        date: row.date,
        tasks: JSON.parse(row.tasks || "[]"),
        routineCompleted: row.routine_completed,
      };
    });

    // Transform custom tasks
    const customTasks: CustomTask[] = (tasksData as CustomTaskRow[] || []).map((row) => ({
      id: row.id,
      title: row.title,
      subject: row.subject as Subject,
      description: row.description || undefined,
      date: row.date,
      timeSlot: row.time_slot_start && row.time_slot_end
        ? { start: row.time_slot_start, end: row.time_slot_end }
        : undefined,
      type: row.type as "routine" | "study" | "speed" | "exam",
      completed: row.completed,
      createdAt: row.created_at,
    }));

    // Transform exams
    const exams: Exam[] = (examsData as ExamRow[] || []).map((row) => ({
      id: row.id,
      title: row.title,
      type: row.type as "branch" | "general" | "tg",
      subject: row.subject as Subject | undefined,
      date: row.date,
      completed: row.completed,
      results: row.results ? JSON.parse(row.results) : undefined,
      createdAt: row.created_at,
    }));

    return {
      daily,
      weekly: {},
      monthly: {},
      customTasks,
      exams,
    };
  } catch (error) {
    logger.error("Supabase fetch error:", error);
    return {
      daily: {},
      weekly: {},
      monthly: {},
      customTasks: [],
      exams: [],
    };
  }
}

/**
 * Task completion kaydet
 */
export async function saveTaskCompletion(
  date: string,
  taskId: string,
  completed: boolean
): Promise<void> {
  const supabase = getSupabase();
  if (!supabase) {
    logger.warn("Supabase not available, skipping saveTaskCompletion");
    return;
  }

  try {
    // Bu tarihe ait kayıt var mı?
    const { data: existing } = await supabase
      .from("daily_progress")
      .select("*")
      .eq("date", date)
      .single();

    const tasks: TaskCompletion[] = existing
      ? JSON.parse((existing as DailyProgressRow).tasks || "[]")
      : [];

    const taskIndex = tasks.findIndex((t) => t.taskId === taskId);

    if (taskIndex !== -1) {
      tasks[taskIndex] = {
        ...tasks[taskIndex],
        completed,
        completedAt: completed ? new Date().toISOString() : undefined,
      };
    } else {
      tasks.push({
        taskId,
        completed,
        completedAt: completed ? new Date().toISOString() : undefined,
      });
    }

    if (existing) {
      await supabase
        .from("daily_progress")
        .update({ tasks: JSON.stringify(tasks), updated_at: new Date().toISOString() })
        .eq("date", date);
    } else {
      await supabase.from("daily_progress").insert({
        date,
        tasks: JSON.stringify(tasks),
        routine_completed: false,
      });
    }
  } catch (error) {
    logger.error("Save task completion error:", error);
    throw error;
  }
}

/**
 * Custom task oluştur
 */
export async function createCustomTask(
  task: Omit<CustomTask, "id" | "createdAt" | "completed">
): Promise<CustomTask> {
  const supabase = getSupabase();
  if (!supabase) {
    throw new Error("Supabase not available");
  }

  const { data, error } = await supabase
    .from("custom_tasks")
    .insert({
      title: task.title,
      subject: task.subject,
      description: task.description || null,
      date: task.date,
      time_slot_start: task.timeSlot?.start || null,
      time_slot_end: task.timeSlot?.end || null,
      type: task.type,
      completed: false,
    })
    .select()
    .single();

  if (error) throw error;

  const row = data as CustomTaskRow;
  return {
    id: row.id,
    title: row.title,
    subject: row.subject as Subject,
    description: row.description || undefined,
    date: row.date,
    timeSlot: row.time_slot_start && row.time_slot_end
      ? { start: row.time_slot_start, end: row.time_slot_end }
      : undefined,
    type: row.type as "routine" | "study" | "speed" | "exam",
    completed: row.completed,
    createdAt: row.created_at,
  };
}

/**
 * Custom task sil
 */
export async function deleteCustomTask(taskId: string): Promise<void> {
  const supabase = getSupabase();
  if (!supabase) {
    logger.warn("Supabase not available, skipping deleteCustomTask");
    return;
  }

  const { error } = await supabase.from("custom_tasks").delete().eq("id", taskId);
  if (error) throw error;
}

/**
 * Custom task toggle
 */
export async function toggleCustomTask(taskId: string, completed: boolean): Promise<void> {
  const supabase = getSupabase();
  if (!supabase) {
    logger.warn("Supabase not available, skipping toggleCustomTask");
    return;
  }

  const { error } = await supabase
    .from("custom_tasks")
    .update({ completed })
    .eq("id", taskId);
  if (error) throw error;
}

/**
 * Exam oluştur
 */
export async function createExam(
  exam: Omit<Exam, "id" | "createdAt" | "completed">
): Promise<Exam> {
  const supabase = getSupabase();
  if (!supabase) {
    throw new Error("Supabase not available");
  }

  const { data, error } = await supabase
    .from("exams")
    .insert({
      title: exam.title,
      type: exam.type,
      subject: exam.subject || null,
      date: exam.date,
      completed: exam.results ? true : false,
      results: exam.results ? JSON.stringify(exam.results) : null,
    })
    .select()
    .single();

  if (error) throw error;

  const row = data as ExamRow;
  return {
    id: row.id,
    title: row.title,
    type: row.type as "branch" | "general" | "tg",
    subject: row.subject as Subject | undefined,
    date: row.date,
    completed: row.completed,
    results: row.results ? JSON.parse(row.results) : undefined,
    createdAt: row.created_at,
  };
}

/**
 * Exam sil
 */
export async function deleteExam(examId: string): Promise<void> {
  const supabase = getSupabase();
  if (!supabase) {
    logger.warn("Supabase not available, skipping deleteExam");
    return;
  }

  const { error } = await supabase.from("exams").delete().eq("id", examId);
  if (error) throw error;
}

/**
 * Exam tamamla
 */
export async function completeExam(examId: string): Promise<void> {
  const supabase = getSupabase();
  if (!supabase) {
    logger.warn("Supabase not available, skipping completeExam");
    return;
  }

  const { error } = await supabase.from("exams").update({ completed: true }).eq("id", examId);
  if (error) throw error;
}

/**
 * Tüm topic notlarını getir
 */
export async function fetchTopicNotes(): Promise<TopicNote[]> {
  const supabase = getSupabase();
  
  if (!supabase) {
    logger.warn("Supabase not available, returning empty notes");
    return [];
  }

  try {
    // Şimdilik topic_notes tablosu yok, LocalStorage kullanılacak
    // Gelecekte Supabase tablosu eklendiğinde buraya kod eklenecek
    return [];
  } catch (error) {
    logger.error("Fetch topic notes error:", error);
    return [];
  }
}

/**
 * Topic notu ekle
 */
export async function createTopicNote(
  topicId: string,
  subject: Subject,
  content: string
): Promise<TopicNote> {
  const supabase = getSupabase();
  
  if (!supabase) {
    // LocalStorage kullanılacak, bu fonksiyon context'te handle edilecek
    throw new Error("Supabase not available, use LocalStorage");
  }

  // Gelecekte Supabase tablosu eklendiğinde buraya kod eklenecek
  throw new Error("Not implemented yet");
}

/**
 * Topic notu sil
 */
export async function deleteTopicNote(noteId: string): Promise<void> {
  const supabase = getSupabase();
  
  if (!supabase) {
    logger.warn("Supabase not available, skipping deleteTopicNote");
    return;
  }

  // Gelecekte Supabase tablosu eklendiğinde buraya kod eklenecek
  throw new Error("Not implemented yet");
}
