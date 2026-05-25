"use client";

import { useMemo } from "react";
import { isPast, isToday, parseISO, compareAsc } from "date-fns";
import { useAppStore } from "@/store/store";
import { useSync } from "@/hooks/useSync";

export function useReminders() {
  const reminders = useAppStore((s) => s.reminders);
  const { syncAddReminder, syncToggleReminder, syncDeleteReminder } = useSync();
  const updateReminder = useAppStore((s) => s.updateReminder);

  const sorted = useMemo(
    () =>
      [...reminders].sort((a, b) =>
        compareAsc(parseISO(a.dateTime), parseISO(b.dateTime))
      ),
    [reminders]
  );

  const upcoming = useMemo(
    () => sorted.filter((r) => !r.completed && !isPast(parseISO(r.dateTime))),
    [sorted]
  );

  const overdue = useMemo(
    () => sorted.filter((r) => !r.completed && isPast(parseISO(r.dateTime))),
    [sorted]
  );

  const todayReminders = useMemo(
    () =>
      sorted.filter(
        (r) => !r.completed && isToday(parseISO(r.dateTime)) && !isPast(parseISO(r.dateTime))
      ),
    [sorted]
  );

  const completedCount = reminders.filter((r) => r.completed).length;

  return {
    reminders: sorted,
    upcoming,
    overdue,
    todayReminders,
    completedCount,
    totalCount: reminders.length,
    addReminder: syncAddReminder,
    updateReminder,
    deleteReminder: syncDeleteReminder,
    toggleReminder: syncToggleReminder,
  };
}
