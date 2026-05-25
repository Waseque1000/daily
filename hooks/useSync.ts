"use client";

import { useAuth } from "@/components/providers/AuthProvider";
import {
  deleteReminderInDb,
  deleteTaskInDb,
  insertFocusSession,
  insertReminder,
  insertTask,
  updateReminderInDb,
  updateTaskInDb,
  upsertPreferences,
} from "@/lib/db";
import { useAppStore } from "@/store/store";
import type { Priority, ReminderRepeat, Task } from "@/types";

function requireUser(userId: string | undefined): asserts userId is string {
  if (!userId) throw new Error("You must be signed in to save data.");
}

/** All task/reminder/focus mutations persist to Supabase first. */
export function useSync() {
  const { user } = useAuth();
  const userId = user?.id;

  return {
    userId: userId ?? null,
    isOnline: !!user,

    syncAddTask: async (title: string, priority: Priority = "medium") => {
      requireUser(userId);
      const task = await insertTask(userId, title, priority);
      const store = useAppStore.getState();
      store.setTasks([task, ...store.tasks]);
    },

    syncUpdateTask: async (id: string, updates: Partial<Task>) => {
      requireUser(userId);
      const updated = await updateTaskInDb(id, updates);
      const store = useAppStore.getState();
      store.setTasks(store.tasks.map((t) => (t.id === id ? updated : t)));
    },

    syncDeleteTask: async (id: string) => {
      requireUser(userId);
      await deleteTaskInDb(id);
      const store = useAppStore.getState();
      store.setTasks(store.tasks.filter((t) => t.id !== id));
    },

    syncToggleTask: async (id: string) => {
      requireUser(userId);
      const task = useAppStore.getState().tasks.find((t) => t.id === id);
      if (!task) return;
      const updated = await updateTaskInDb(id, { completed: !task.completed });
      const store = useAppStore.getState();
      store.setTasks(store.tasks.map((t) => (t.id === id ? updated : t)));
    },

    syncScheduleTask: async (id: string, hour: number, minute: number) => {
      requireUser(userId);
      const updated = await updateTaskInDb(id, {
        scheduledHour: hour,
        scheduledMinute: minute,
      });
      const store = useAppStore.getState();
      store.setTasks(store.tasks.map((t) => (t.id === id ? updated : t)));
    },

    syncAddReminder: async (
      title: string,
      dateTime: string,
      repeat: ReminderRepeat = "none",
      notes?: string
    ) => {
      requireUser(userId);
      const reminder = await insertReminder(userId, title, dateTime, repeat, notes);
      const store = useAppStore.getState();
      store.setReminders([reminder, ...store.reminders]);
    },

    syncToggleReminder: async (id: string) => {
      requireUser(userId);
      const reminder = useAppStore.getState().reminders.find((r) => r.id === id);
      if (!reminder) return;
      const updated = await updateReminderInDb(id, { completed: !reminder.completed });
      const store = useAppStore.getState();
      store.setReminders(store.reminders.map((r) => (r.id === id ? updated : r)));
    },

    syncDeleteReminder: async (id: string) => {
      requireUser(userId);
      await deleteReminderInDb(id);
      const store = useAppStore.getState();
      store.setReminders(store.reminders.filter((r) => r.id !== id));
    },

    syncFocusSession: async (duration: number, taskId?: string) => {
      requireUser(userId);
      const session = await insertFocusSession(userId, duration, taskId);
      useAppStore.setState((s) => ({
        focusRunning: false,
        focusSecondsLeft: s.focusDuration * 60,
        focusSessions: [session, ...s.focusSessions],
        focusTaskId: null,
      }));
    },

    syncPreferences: async (prefs: {
      theme?: "light" | "dark";
      focusDuration?: number;
      ambientSound?: string;
      sidebarCollapsed?: boolean;
    }) => {
      requireUser(userId);
      await upsertPreferences(userId, prefs);
    },
  };
}
