/**
 * useTimer Hook
 * Timer/kronometre logic hook'u
 */

import { useState, useEffect, useRef, useCallback } from "react";

export interface TimerState {
  isRunning: boolean;
  elapsedMs: number;
  minutes: number;
  seconds: number;
  milliseconds: number;
}

export interface UseTimerReturn extends TimerState {
  start: () => void;
  pause: () => void;
  stop: () => void;
  reset: () => void;
}

/**
 * Timer hook - milliseconds cinsinden çalışır
 */
export function useTimer(initialMs: number = 0): UseTimerReturn {
  const [elapsedMs, setElapsedMs] = useState(initialMs);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);
  const pausedTimeRef = useRef<number>(0);

  // Timer'ı temizle
  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // Start timer
  const start = useCallback(() => {
    if (isRunning) return;

    setIsRunning(true);
    startTimeRef.current = Date.now() - pausedTimeRef.current;

    intervalRef.current = setInterval(() => {
      const now = Date.now();
      const elapsed = now - startTimeRef.current;
      setElapsedMs(elapsed);
    }, 10); // Update every 10ms for smooth milliseconds
  }, [isRunning]);

  // Pause timer
  const pause = useCallback(() => {
    if (!isRunning) return;

    setIsRunning(false);
    pausedTimeRef.current = elapsedMs;
    clearTimer();
  }, [isRunning, elapsedMs, clearTimer]);

  // Stop timer
  const stop = useCallback(() => {
    setIsRunning(false);
    pausedTimeRef.current = 0;
    clearTimer();
  }, [clearTimer]);

  // Reset timer
  const reset = useCallback(() => {
    setIsRunning(false);
    setElapsedMs(initialMs);
    pausedTimeRef.current = 0;
    startTimeRef.current = 0;
    clearTimer();
  }, [initialMs, clearTimer]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearTimer();
    };
  }, [clearTimer]);

  // Calculate display values
  const totalSeconds = Math.floor(elapsedMs / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const milliseconds = Math.floor((elapsedMs % 1000) / 10);

  return {
    isRunning,
    elapsedMs,
    minutes,
    seconds,
    milliseconds,
    start,
    pause,
    stop,
    reset,
  };
}
