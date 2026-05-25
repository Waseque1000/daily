import { create } from "zustand";
import { persist } from "zustand/middleware";
import { DEFAULT_INTEGRATIONS } from "@/lib/constants";
import { generateId } from "@/lib/utils";
import type {
  Task,
  Priority,
  FocusSession,
  AIMessage,
  Integration,
  AmbientSound,
  MoodEntry,
  Reminder,
  ReminderRepeat,
} from "@/types";

interface AppState {
  tasks: Task[];
  focusSessions: FocusSession[];
  integrations: Integration[];
  aiMessages: AIMessage[];
  moodEntries: MoodEntry[];
  reminders: Reminder[];
  focusDuration: number;
  focusSecondsLeft: number;
  focusRunning: boolean;
  focusTaskId: string | null;
  ambientSound: AmbientSound;
  sidebarCollapsed: boolean;
  theme: "light" | "dark";

  addTask: (title: string, priority?: Priority) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleTask: (id: string) => void;
  scheduleTask: (id: string, hour: number, minute: number) => void;

  startFocus: (taskId?: string) => void;
  pauseFocus: () => void;
  stopFocus: () => void;
  tickFocus: () => void;
  completeFocusSession: () => void;
  setFocusDuration: (minutes: number) => void;
  setAmbientSound: (sound: AmbientSound) => void;

  addAIMessage: (message: AIMessage) => void;
  toggleIntegration: (id: string) => void;
  toggleSidebar: () => void;
  setTheme: (theme: "light" | "dark") => void;
  addMoodEntry: (rating: number) => void;

  addReminder: (title: string, dateTime: string, repeat?: ReminderRepeat, notes?: string) => void;
  updateReminder: (id: string, updates: Partial<Reminder>) => void;
  deleteReminder: (id: string) => void;
  toggleReminder: (id: string) => void;

  hydrateFromDb: (data: {
    tasks: Task[];
    reminders: Reminder[];
    focusSessions: FocusSession[];
    preferences: {
      theme: "light" | "dark";
      focusDuration: number;
      ambientSound: AmbientSound;
      sidebarCollapsed: boolean;
    } | null;
  }) => void;
  setTasks: (tasks: Task[]) => void;
  setReminders: (reminders: Reminder[]) => void;
  setFocusSessions: (sessions: FocusSession[]) => void;
  resetUserData: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      tasks: [],
      focusSessions: [],
      integrations: DEFAULT_INTEGRATIONS,
      aiMessages: [],
      reminders: [],
      moodEntries: [],
      focusDuration: 25,
      focusSecondsLeft: 25 * 60,
      focusRunning: false,
      focusTaskId: null,
      ambientSound: "off",
      sidebarCollapsed: false,
      theme: "light",

      addTask: (title, priority = "medium") =>
        set((s) => ({
          tasks: [
            {
              id: generateId(),
              title,
              completed: false,
              priority,
              createdAt: new Date().toISOString(),
            },
            ...s.tasks,
          ],
        })),

      updateTask: (id, updates) =>
        set((s) => ({
          tasks: s.tasks.map((t) => (t.id === id ? { ...t, ...updates } : t)),
        })),

      deleteTask: (id) =>
        set((s) => ({ tasks: s.tasks.filter((t) => t.id !== id) })),

      toggleTask: (id) =>
        set((s) => ({
          tasks: s.tasks.map((t) =>
            t.id === id ? { ...t, completed: !t.completed } : t
          ),
        })),

      scheduleTask: (id, hour, minute) =>
        set((s) => ({
          tasks: s.tasks.map((t) =>
            t.id === id ? { ...t, scheduledHour: hour, scheduledMinute: minute } : t
          ),
        })),

      startFocus: (taskId) =>
        set((s) => ({
          focusRunning: true,
          focusTaskId: taskId ?? s.focusTaskId,
          focusSecondsLeft: s.focusSecondsLeft || s.focusDuration * 60,
        })),

      pauseFocus: () => set({ focusRunning: false }),

      stopFocus: () =>
        set((s) => ({
          focusRunning: false,
          focusSecondsLeft: s.focusDuration * 60,
          focusTaskId: null,
        })),

      tickFocus: () => {
        const { focusSecondsLeft, focusRunning } = get();
        if (!focusRunning || focusSecondsLeft <= 0) return;
        set({ focusSecondsLeft: focusSecondsLeft - 1 });
      },

      completeFocusSession: () =>
        set((s) => ({
          focusRunning: false,
          focusSecondsLeft: s.focusDuration * 60,
          focusSessions: [
            ...s.focusSessions,
            {
              id: generateId(),
              taskId: s.focusTaskId ?? undefined,
              duration: s.focusDuration,
              completedAt: new Date().toISOString(),
            },
          ],
          focusTaskId: null,
        })),

      setFocusDuration: (minutes) =>
        set({ focusDuration: minutes, focusSecondsLeft: minutes * 60 }),

      setAmbientSound: (sound) => set({ ambientSound: sound }),

      addAIMessage: (message) =>
        set((s) => ({ aiMessages: [...s.aiMessages, message] })),

      toggleIntegration: (id) =>
        set((s) => ({
          integrations: s.integrations.map((i) =>
            i.id === id ? { ...i, connected: !i.connected } : i
          ),
        })),

      toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),

      setTheme: (theme) => set({ theme }),

      addMoodEntry: (rating) =>
        set((s) => ({
          moodEntries: [
            ...s.moodEntries.slice(-6),
            { date: new Date().toLocaleDateString("en", { weekday: "short" }), rating },
          ],
        })),

      addReminder: (title, dateTime, repeat = "none", notes) =>
        set((s) => ({
          reminders: [
            {
              id: generateId(),
              title,
              notes,
              dateTime,
              repeat,
              completed: false,
              createdAt: new Date().toISOString(),
            },
            ...s.reminders,
          ],
        })),

      updateReminder: (id, updates) =>
        set((s) => ({
          reminders: s.reminders.map((r) => (r.id === id ? { ...r, ...updates } : r)),
        })),

      deleteReminder: (id) =>
        set((s) => ({ reminders: s.reminders.filter((r) => r.id !== id) })),

      toggleReminder: (id) =>
        set((s) => ({
          reminders: s.reminders.map((r) =>
            r.id === id ? { ...r, completed: !r.completed } : r
          ),
        })),

      hydrateFromDb: (data) =>
        set((s) => ({
          tasks: data.tasks,
          reminders: data.reminders,
          focusSessions: data.focusSessions,
          ...(data.preferences
            ? {
                theme: data.preferences.theme,
                focusDuration: data.preferences.focusDuration,
                focusSecondsLeft: data.preferences.focusDuration * 60,
                ambientSound: data.preferences.ambientSound,
                sidebarCollapsed: data.preferences.sidebarCollapsed,
              }
            : {}),
        })),

      setTasks: (tasks) => set({ tasks }),
      setReminders: (reminders) => set({ reminders }),
      setFocusSessions: (focusSessions) => set({ focusSessions }),

      resetUserData: () =>
        set({
          tasks: [],
          reminders: [],
          focusSessions: [],
          aiMessages: [],
          moodEntries: [],
          focusRunning: false,
          focusTaskId: null,
          focusSecondsLeft: get().focusDuration * 60,
        }),
    }),
    {
      name: "flowday-storage",
      skipHydration: true,
      partialize: (s) => ({
        integrations: s.integrations,
        theme: s.theme,
        focusDuration: s.focusDuration,
        ambientSound: s.ambientSound,
        sidebarCollapsed: s.sidebarCollapsed,
      }),
    }
  )
);
