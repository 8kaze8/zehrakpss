/**
 * StudyProgressContext
 * Çalışma ilerlemesi için global state management
 */

"use client";

import React, { createContext, useContext, useReducer, useEffect, useCallback } from "react";
import { saveStoredProgress, getOrInitializeProgress } from "@/utils/storage";
import { toISODate, getWeekId, getMonthYearKey } from "@/utils/date";
import type {
  UserProgress,
  TaskCompletion,
  WeeklyProgress,
  MonthlyProgress,
  Month,
} from "@/types";
import type { CustomTask, Subject } from "@/types/task";

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
  | { type: "SET_LOADING"; payload: boolean };

const initialState: StudyProgressState = {
  progress: {
    daily: {},
    weekly: {},
    monthly: {},
    customTasks: [],
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

      if (taskIndex !== -1) {
        daily[date].tasks[taskIndex] = {
          ...daily[date].tasks[taskIndex],
          completed: true,
          completedAt: new Date().toISOString(),
        };
      } else {
        daily[date].tasks.push({
          taskId,
          completed: true,
          completedAt: new Date().toISOString(),
        });
      }

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
        daily[date] = {
          ...daily[date],
          tasks: daily[date].tasks.map((t) =>
            t.taskId === taskId ? { ...t, completed: false } : t
          ),
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
}

const StudyProgressContext = createContext<StudyProgressContextValue | undefined>(undefined);

export function StudyProgressProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(progressReducer, initialState);

  // Load progress from localStorage on mount
  useEffect(() => {
    const storedProgress = getOrInitializeProgress();
    dispatch({ type: "LOAD_PROGRESS", payload: storedProgress });
  }, []);

  // Save progress to localStorage whenever it changes (debounced)
  useEffect(() => {
    if (!state.isLoading) {
      const timeoutId = setTimeout(() => {
        saveStoredProgress(state.progress);
      }, 500); // Debounce 500ms

      return () => clearTimeout(timeoutId);
    }
  }, [state.progress, state.isLoading]);

  const completeTask = useCallback((taskId: string, date: Date | string = new Date()) => {
    const dateISO = toISODate(date);
    dispatch({ type: "COMPLETE_TASK", payload: { taskId, date: dateISO } });
  }, []);

  const uncompleteTask = useCallback((taskId: string, date: Date | string = new Date()) => {
    const dateISO = toISODate(date);
    dispatch({ type: "UNCOMPLETE_TASK", payload: { taskId, date: dateISO } });
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

      // Calculate weekly progress
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

      // Default values (should be calculated from study plan)
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
    (task: Omit<CustomTask, "id" | "createdAt" | "completed">) => {
      const newTask: CustomTask = {
        ...task,
        id: `custom-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date().toISOString(),
        completed: false,
      };
      dispatch({ type: "ADD_CUSTOM_TASK", payload: newTask });
    },
    []
  );

  const deleteCustomTask = useCallback((taskId: string) => {
    dispatch({ type: "DELETE_CUSTOM_TASK", payload: taskId });
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

  const value: StudyProgressContextValue = {
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
  };

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
