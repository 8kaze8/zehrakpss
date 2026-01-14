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
} from "@/types";
import type { CustomTask, Subject, Exam } from "@/types/task";

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
  | { type: "DELETE_EXAM"; payload: string }
  | { type: "COMPLETE_EXAM"; payload: string }
  | { type: "SET_LOADING"; payload: boolean };

const initialState: StudyProgressState = {
  progress: {
    daily: {},
    weekly: {},
    monthly: {},
    customTasks: [],
    exams: [],
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
  deleteExam: (examId: string) => void;
  completeExam: (examId: string) => void;
  getExams: (date?: Date | string) => Exam[];
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
    if (!state.isLoading && !USE_SUPABASE) {
      const timeoutId = setTimeout(() => {
        saveStoredProgress(state.progress);
      }, 500);
      return () => clearTimeout(timeoutId);
    }
  }, [state.progress, state.isLoading]);

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
      deleteExam,
      completeExam,
      getExams,
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
      deleteExam,
      completeExam,
      getExams,
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
