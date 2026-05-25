"use client";

import { useEffect, useCallback, useRef } from "react";
import { useAppStore } from "@/store/store";
import { useSync } from "@/hooks/useSync";

export function useFocusSession() {
  const focusRunning = useAppStore((s) => s.focusRunning);
  const focusSecondsLeft = useAppStore((s) => s.focusSecondsLeft);
  const focusDuration = useAppStore((s) => s.focusDuration);
  const focusTaskId = useAppStore((s) => s.focusTaskId);
  const tasks = useAppStore((s) => s.tasks);
  const startFocus = useAppStore((s) => s.startFocus);
  const pauseFocus = useAppStore((s) => s.pauseFocus);
  const stopFocus = useAppStore((s) => s.stopFocus);
  const tickFocus = useAppStore((s) => s.tickFocus);
  const setFocusDuration = useAppStore((s) => s.setFocusDuration);
  const focusSessions = useAppStore((s) => s.focusSessions);
  const { syncFocusSession, syncPreferences } = useSync();
  const completingRef = useRef(false);

  useEffect(() => {
    if (!focusRunning) return;
    const interval = setInterval(tickFocus, 1000);
    return () => clearInterval(interval);
  }, [focusRunning, tickFocus]);

  useEffect(() => {
    if (!focusRunning || focusSecondsLeft > 0 || completingRef.current) return;
    completingRef.current = true;
    syncFocusSession(focusDuration, focusTaskId ?? undefined).finally(() => {
      completingRef.current = false;
    });
  }, [focusRunning, focusSecondsLeft, focusDuration, focusTaskId, syncFocusSession]);

  const currentTask = tasks.find((t) => t.id === focusTaskId);
  const minutes = Math.floor(focusSecondsLeft / 60);
  const seconds = focusSecondsLeft % 60;
  const progress =
    focusDuration > 0
      ? ((focusDuration * 60 - focusSecondsLeft) / (focusDuration * 60)) * 100
      : 0;

  const todaySessions = focusSessions.filter((s) => {
    const d = new Date(s.completedAt);
    const now = new Date();
    return d.toDateString() === now.toDateString();
  });

  const totalFocusHours = (
    focusSessions.reduce((acc, s) => acc + s.duration, 0) / 60
  ).toFixed(1);

  const setFocusDurationSynced = useCallback(
    (minutes: number) => {
      setFocusDuration(minutes);
      syncPreferences({ focusDuration: minutes });
    },
    [setFocusDuration, syncPreferences]
  );

  return {
    focusRunning,
    focusSecondsLeft,
    focusDuration,
    focusTaskId,
    currentTask,
    minutes,
    seconds,
    progress,
    todaySessions: todaySessions.length,
    totalFocusHours,
    startFocus: useCallback((taskId?: string) => startFocus(taskId), [startFocus]),
    pauseFocus,
    stopFocus,
    setFocusDuration: setFocusDurationSynced,
  };
}
