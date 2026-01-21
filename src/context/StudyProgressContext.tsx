/**
 * StudyProgressContext
 * Çalışma ilerlemesi için global state management
 * Supabase veya localStorage kullanır
 */

"use client";

import React, { createContext, useContext, useReducer, useEffect, useCallback, useMemo } from "react";
import { saveStoredProgress, getOrInitializeProgress } from "@/utils/storage";
import { toISODate, getWeekId, getMonthYearKey } from "@/utils/date";
import * as supabaseService from "@/services/supabase-service";
import { logger } from "@/utils/logger";
import type {
  UserProgress,
  TaskCompletion,
  WeeklyProgress,
  MonthlyProgress,
  Month,
  Subject,
  CustomTask,
  Exam,
  TopicNote,
} from "@/types";

// Backend modu - env'den oku
const USE_SUPABASE = process.env.NEXT_PUBLIC_USE_SUPABASE === "true";

interface StudyProgressState {
  progress: UserProgress;
  isLoading: boolean;
}

type StudyProgressAction =
  | { type: "LOAD_PROGRESS"; payload: UserProgress }
  | { type: "COMPLETE_TASK"; payload: { taskId: string; date: string } }
  | { type: "UNCOMPLETE_TASK"; payload: { taskId: string; date: string } }
  | { type: "ADD_CUSTOM_TASK"; payload: CustomTask }
  | { type: "DELETE_CUSTOM_TASK"; payload: string }
  | { type: "TOGGLE_CUSTOM_TASK"; payload: { taskId: string; date: string } }
  | { type: "ADD_EXAM"; payload: Exam }
  | { type: "UPDATE_EXAM"; payload: Exam }
  | { type: "DELETE_EXAM"; payload: string }
  | { type: "COMPLETE_EXAM"; payload: string }
  | { type: "ADD_TOPIC_NOTE"; payload: TopicNote }
  | { type: "UPDATE_TOPIC_NOTE"; payload: TopicNote }
  | { type: "DELETE_TOPIC_NOTE"; payload: string }
  | { type: "SET_LOADING"; payload: boolean };

const initialState: StudyProgressState = {
  progress: {
    daily: {},
    weekly: {},
    monthly: {},
    customTasks: [],
    exams: [],
    topicNotes: [],
  },
  isLoading: true,
};

function progressReducer(
  state: StudyProgressState,
  action: StudyProgressAction
): StudyProgressState {
  switch (action.type) {
    case "LOAD_PROGRESS":
      return {
        ...state,
        progress: action.payload,
        isLoading: false,
      };

    case "COMPLETE_TASK": {
      const { taskId, date } = action.payload;
      const newProgress = { ...state.progress };
      const daily = { ...newProgress.daily };

      if (!daily[date]) {
        daily[date] = {
          date,
          tasks: [],
          routineCompleted: false,
        };
      }

      const taskIndex = daily[date].tasks.findIndex((t) => t.taskId === taskId);
      const newTasks = [...daily[date].tasks];

      if (taskIndex !== -1) {
        newTasks[taskIndex] = {
          ...newTasks[taskIndex],
          completed: true,
          completedAt: new Date().toISOString(),
        };
      } else {
        newTasks.push({
          taskId,
          completed: true,
          completedAt: new Date().toISOString(),
        });
      }

      daily[date] = {
        ...daily[date],
        tasks: newTasks,
      };

      return {
        ...state,
        progress: {
          ...newProgress,
          daily,
        },
      };
    }

    case "UNCOMPLETE_TASK": {
      const { taskId, date } = action.payload;
      const newProgress = { ...state.progress };
      const daily = { ...newProgress.daily };

      if (daily[date]) {
        const newTasks = daily[date].tasks.map((t) =>
          t.taskId === taskId ? { ...t, completed: false } : t
        );
        
        daily[date] = {
          ...daily[date],
          tasks: newTasks,
        };
      }

      return {
        ...state,
        progress: {
          ...newProgress,
          daily,
        },
      };
    }

    case "ADD_CUSTOM_TASK": {
      const newProgress = { ...state.progress };
      const customTasks = [...(newProgress.customTasks || []), action.payload];
      return {
        ...state,
        progress: {
          ...newProgress,
          customTasks,
        },
      };
    }

    case "DELETE_CUSTOM_TASK": {
      const newProgress = { ...state.progress };
      const customTasks = (newProgress.customTasks || []).filter(
        (t) => t.id !== action.payload
      );
      return {
        ...state,
        progress: {
          ...newProgress,
          customTasks,
        },
      };
    }

    case "TOGGLE_CUSTOM_TASK": {
      const { taskId, date } = action.payload;
      const newProgress = { ...state.progress };
      const customTasks = (newProgress.customTasks || []).map((task) => {
        if (task.id === taskId && task.date === date) {
          return { ...task, completed: !task.completed };
        }
        return task;
      });
      return {
        ...state,
        progress: {
          ...newProgress,
          customTasks,
        },
      };
    }

    case "ADD_EXAM": {
      const newProgress = { ...state.progress };
      const exams = [...(newProgress.exams || []), action.payload];
      return {
        ...state,
        progress: {
          ...newProgress,
          exams,
        },
      };
    }

    case "UPDATE_EXAM": {
      const newProgress = { ...state.progress };
      const exams = (newProgress.exams || []).map((exam) =>
        exam.id === action.payload.id ? action.payload : exam
      );
      return {
        ...state,
        progress: {
          ...newProgress,
          exams,
        },
      };
    }

    case "DELETE_EXAM": {
      const newProgress = { ...state.progress };
      const exams = (newProgress.exams || []).filter(
        (e) => e.id !== action.payload
      );
      return {
        ...state,
        progress: {
          ...newProgress,
          exams,
        },
      };
    }

    case "COMPLETE_EXAM": {
      const newProgress = { ...state.progress };
      const exams = (newProgress.exams || []).map((exam) =>
        exam.id === action.payload
          ? { ...exam, completed: true }
          : exam
      );
      return {
        ...state,
        progress: {
          ...newProgress,
          exams,
        },
      };
    }

    case "ADD_TOPIC_NOTE": {
      const newProgress = { ...state.progress };
      const topicNotes = [...(newProgress.topicNotes || []), action.payload];
      return {
        ...state,
        progress: {
          ...newProgress,
          topicNotes,
        },
      };
    }

    case "UPDATE_TOPIC_NOTE": {
      const newProgress = { ...state.progress };
      const topicNotes = (newProgress.topicNotes || []).map((note) =>
        note.id === action.payload.id ? action.payload : note
      );
      return {
        ...state,
        progress: {
          ...newProgress,
          topicNotes,
        },
      };
    }

    case "DELETE_TOPIC_NOTE": {
      const newProgress = { ...state.progress };
      const topicNotes = (newProgress.topicNotes || []).filter(
        (note) => note.id !== action.payload
      );
      return {
        ...state,
        progress: {
          ...newProgress,
          topicNotes,
        },
      };
    }

    case "SET_LOADING":
      return {
        ...state,
        isLoading: action.payload,
      };

    default:
      return state;
  }
}

interface StudyProgressContextValue {
  progress: UserProgress;
  isLoading: boolean;
  completeTask: (taskId: string, date?: Date | string) => void;
  uncompleteTask: (taskId: string, date?: Date | string) => void;
  isTaskCompleted: (taskId: string, date?: Date | string) => boolean;
  getWeeklyProgress: (weekId: string) => WeeklyProgress;
  getMonthlyProgress: (month: Month, year: number) => MonthlyProgress;
  addCustomTask: (task: Omit<CustomTask, "id" | "createdAt" | "completed">) => void;
  deleteCustomTask: (taskId: string) => void;
  getCustomTasks: (date?: Date | string) => CustomTask[];
  addExam: (exam: Omit<Exam, "id" | "createdAt" | "completed">) => void;
  updateExam: (examId: string, updates: { completed?: boolean; results?: Exam["results"] }) => Promise<void>;
  deleteExam: (examId: string) => void;
  completeExam: (examId: string) => void;
  getExams: (date?: Date | string) => Exam[];
  addTopicNote: (topicId: string, subject: Subject, content: string) => Promise<void>;
  updateTopicNote: (noteId: string, content: string) => Promise<void>;
  deleteTopicNote: (noteId: string) => Promise<void>;
  getTopicNotes: (topicId?: string) => TopicNote[];
}

const StudyProgressContext = createContext<StudyProgressContextValue | undefined>(undefined);

export function StudyProgressProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(progressReducer, initialState);

  // Load progress on mount
  useEffect(() => {
    async function loadProgress() {
      try {
        if (USE_SUPABASE) {
          logger.log("Loading from Supabase...");
          const progress = await supabaseService.fetchAllProgress();
          // Topic notes'ları ayrı yükle
          const topicNotes = await supabaseService.fetchTopicNotes();
          progress.topicNotes = topicNotes;
          dispatch({ type: "LOAD_PROGRESS", payload: progress });
        } else {
          const storedProgress = getOrInitializeProgress();
          dispatch({ type: "LOAD_PROGRESS", payload: storedProgress });
        }
      } catch (error) {
        logger.error("Load progress error:", error);
        // Fallback to localStorage
        const storedProgress = getOrInitializeProgress();
        dispatch({ type: "LOAD_PROGRESS", payload: storedProgress });
      }
    }
    loadProgress();
  }, []);

  // Save to localStorage when not using Supabase
  useEffect(() => {
    if (state.isLoading || USE_SUPABASE) return;
    
    // Hemen kaydet - debounce yok
    saveStoredProgress(state.progress);
  }, [
    state.progress.topicNotes,
    state.progress.daily,
    state.progress.customTasks,
    state.progress.exams,
    state.isLoading
  ]);

  const completeTask = useCallback(async (taskId: string, date: Date | string = new Date()) => {
    const dateISO = toISODate(date);
    dispatch({ type: "COMPLETE_TASK", payload: { taskId, date: dateISO } });

    if (USE_SUPABASE) {
      try {
        await supabaseService.saveTaskCompletion(dateISO, taskId, true);
      } catch (error) {
        logger.error("Complete task error:", error);
      }
    }
  }, []);

  const uncompleteTask = useCallback(async (taskId: string, date: Date | string = new Date()) => {
    const dateISO = toISODate(date);
    dispatch({ type: "UNCOMPLETE_TASK", payload: { taskId, date: dateISO } });

    if (USE_SUPABASE) {
      try {
        await supabaseService.saveTaskCompletion(dateISO, taskId, false);
      } catch (error) {
        logger.error("Uncomplete task error:", error);
      }
    }
  }, []);

  const isTaskCompleted = useCallback(
    (taskId: string, date: Date | string = new Date()): boolean => {
      const dateISO = toISODate(date);
      const daily = state.progress.daily[dateISO];
      if (!daily) return false;
      return daily.tasks.some((t) => t.taskId === taskId && t.completed);
    },
    [state.progress]
  );

  const getWeeklyProgress = useCallback(
    (weekId: string): WeeklyProgress => {
      if (state.progress.weekly[weekId]) {
        return state.progress.weekly[weekId];
      }

      const weekly: WeeklyProgress = {
        weekId,
        completedTasks: 0,
        totalTasks: 0,
        percentage: 0,
      };

      Object.values(state.progress.daily).forEach((daily) => {
        weekly.totalTasks += daily.tasks.length;
        weekly.completedTasks += daily.tasks.filter((t) => t.completed).length;
      });

      if (weekly.totalTasks > 0) {
        weekly.percentage = Math.round((weekly.completedTasks / weekly.totalTasks) * 100);
      }

      return weekly;
    },
    [state.progress]
  );

  const getMonthlyProgress = useCallback(
    (month: Month, year: number): MonthlyProgress => {
      const key = getMonthYearKey(month, year);

      if (state.progress.monthly[key]) {
        return state.progress.monthly[key];
      }

      return {
        month,
        year,
        solvedQuestions: 0,
        remainingQuestions: 0,
        percentage: 0,
      };
    },
    [state.progress]
  );

  const addCustomTask = useCallback(
    async (task: Omit<CustomTask, "id" | "createdAt" | "completed">) => {
      if (USE_SUPABASE) {
        try {
          const newTask = await supabaseService.createCustomTask(task);
          dispatch({ type: "ADD_CUSTOM_TASK", payload: newTask });
        } catch (error) {
          logger.error("Add custom task error:", error);
        }
      } else {
        const newTask: CustomTask = {
          ...task,
          id: `custom-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          createdAt: new Date().toISOString(),
          completed: false,
        };
        dispatch({ type: "ADD_CUSTOM_TASK", payload: newTask });
      }
    },
    []
  );

  const deleteCustomTask = useCallback(async (taskId: string) => {
    dispatch({ type: "DELETE_CUSTOM_TASK", payload: taskId });

    if (USE_SUPABASE) {
      try {
        await supabaseService.deleteCustomTask(taskId);
      } catch (error) {
        logger.error("Delete custom task error:", error);
      }
    }
  }, []);

  const getCustomTasks = useCallback(
    (date?: Date | string): CustomTask[] => {
      const customTasks = state.progress.customTasks || [];
      if (!date) return customTasks;

      const dateISO = toISODate(date);
      return customTasks.filter((task) => task.date === dateISO);
    },
    [state.progress]
  );

  const addExam = useCallback(
    async (exam: Omit<Exam, "id" | "createdAt" | "completed">) => {
      if (USE_SUPABASE) {
        try {
          const newExam = await supabaseService.createExam(exam);
          dispatch({ type: "ADD_EXAM", payload: newExam });
        } catch (error) {
          logger.error("Add exam error:", error);
        }
      } else {
        const newExam: Exam = {
          ...exam,
          id: `exam-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          createdAt: new Date().toISOString(),
          completed: exam.results ? true : false,
        };
        dispatch({ type: "ADD_EXAM", payload: newExam });
      }
    },
    []
  );

  const updateExam = useCallback(
    async (examId: string, updates: { completed?: boolean; results?: Exam["results"] }) => {
      if (USE_SUPABASE) {
        try {
          const updatedExam = await supabaseService.updateExam(examId, updates);
          dispatch({ type: "UPDATE_EXAM", payload: updatedExam });
        } catch (error) {
          logger.error("Update exam error:", error);
          throw error;
        }
      } else {
        const existingExam = state.progress.exams?.find((e) => e.id === examId);
        if (existingExam) {
          const updatedExam: Exam = {
            ...existingExam,
            completed: updates.completed !== undefined ? updates.completed : existingExam.completed,
            results: updates.results !== undefined ? updates.results : existingExam.results,
          };
          dispatch({ type: "UPDATE_EXAM", payload: updatedExam });
        }
      }
    },
    [state.progress]
  );

  const deleteExam = useCallback(async (examId: string) => {
    dispatch({ type: "DELETE_EXAM", payload: examId });

    if (USE_SUPABASE) {
      try {
        await supabaseService.deleteExam(examId);
      } catch (error) {
        logger.error("Delete exam error:", error);
      }
    }
  }, []);

  const completeExam = useCallback(async (examId: string) => {
    dispatch({ type: "COMPLETE_EXAM", payload: examId });

    if (USE_SUPABASE) {
      try {
        await supabaseService.completeExam(examId);
      } catch (error) {
        logger.error("Complete exam error:", error);
      }
    }
  }, []);

  const getExams = useCallback(
    (date?: Date | string): Exam[] => {
      const exams = state.progress.exams || [];
      if (!date) return exams;

      const dateISO = toISODate(date);
      return exams.filter((exam) => exam.date === dateISO);
    },
    [state.progress]
  );

  const addTopicNote = useCallback(
    async (topicId: string, subject: Subject, content: string) => {
      if (USE_SUPABASE) {
        try {
          const newNote = await supabaseService.createTopicNote(topicId, subject, content);
          dispatch({ type: "ADD_TOPIC_NOTE", payload: newNote });
        } catch (error) {
          logger.error("Add topic note error:", error);
          throw error;
        }
      } else {
        const newNote: TopicNote = {
          id: `note-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          topicId,
          subject,
          content,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        dispatch({ type: "ADD_TOPIC_NOTE", payload: newNote });
      }
    },
    []
  );

  const updateTopicNote = useCallback(
    async (noteId: string, content: string) => {
      if (USE_SUPABASE) {
        try {
          const updatedNote = await supabaseService.updateTopicNote(noteId, content);
          dispatch({ type: "UPDATE_TOPIC_NOTE", payload: updatedNote });
        } catch (error) {
          logger.error("Update topic note error:", error);
          throw error;
        }
      } else {
        const existingNote = state.progress.topicNotes?.find((n) => n.id === noteId);
        if (existingNote) {
          const updatedNote: TopicNote = {
            ...existingNote,
            content,
            updatedAt: new Date().toISOString(),
          };
          dispatch({ type: "UPDATE_TOPIC_NOTE", payload: updatedNote });
        }
      }
    },
    [state.progress]
  );

  const deleteTopicNote = useCallback(async (noteId: string) => {
    dispatch({ type: "DELETE_TOPIC_NOTE", payload: noteId });

    if (USE_SUPABASE) {
      try {
        await supabaseService.deleteTopicNote(noteId);
      } catch (error) {
        logger.error("Delete topic note error:", error);
        throw error;
      }
    }
  }, []);

  const getTopicNotes = useCallback(
    (topicId?: string): TopicNote[] => {
      const notes = state.progress.topicNotes || [];
      if (!topicId) return notes;
      return notes.filter((note) => note.topicId === topicId);
    },
    [state.progress.topicNotes]
  );

  const value: StudyProgressContextValue = useMemo(
    () => ({
      progress: state.progress,
      isLoading: state.isLoading,
      completeTask,
      uncompleteTask,
      isTaskCompleted,
      getWeeklyProgress,
      getMonthlyProgress,
      addCustomTask,
      deleteCustomTask,
      getCustomTasks,
      addExam,
      updateExam,
      deleteExam,
      completeExam,
      getExams,
      addTopicNote,
      updateTopicNote,
      deleteTopicNote,
      getTopicNotes,
    }),
    [
      state.progress,
      state.isLoading,
      completeTask,
      uncompleteTask,
      isTaskCompleted,
      getWeeklyProgress,
      getMonthlyProgress,
      addCustomTask,
      deleteCustomTask,
      getCustomTasks,
      addExam,
      updateExam,
      deleteExam,
      completeExam,
      getExams,
      addTopicNote,
      updateTopicNote,
      deleteTopicNote,
      getTopicNotes,
    ]
  );

  return (
    <StudyProgressContext.Provider value={value}>
      {children}
    </StudyProgressContext.Provider>
  );
}

export function useStudyProgressContext() {
  const context = useContext(StudyProgressContext);
  if (context === undefined) {
    throw new Error(
      "useStudyProgressContext must be used within a StudyProgressProvider"
    );
  }
  return context;
}
