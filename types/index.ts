export type Priority = "high" | "medium" | "low" | "none";

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  priority: Priority;
  dueTime?: string;
  duration?: number;
  tags?: string[];
  scheduledHour?: number;
  scheduledMinute?: number;
  isMeeting?: boolean;
  createdAt: string;
}

export interface FocusSession {
  id: string;
  taskId?: string;
  duration: number;
  completedAt: string;
}

export interface CalendarBlock {
  id: string;
  title: string;
  startHour: number;
  startMinute: number;
  durationMinutes: number;
  isMeeting?: boolean;
  taskId?: string;
}

export interface Integration {
  id: string;
  name: string;
  connected: boolean;
  icon: string;
}

export interface AIMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  suggestions?: AISuggestion[];
}

export interface AISuggestion {
  id: string;
  text: string;
  accepted?: boolean;
}

export interface MoodEntry {
  date: string;
  rating: number;
}

export interface ProductivityStats {
  tasksCompleted: number;
  focusHours: number;
  streak: number;
  productivityScore: number;
}

export type AmbientSound = "off" | "forest" | "rain" | "ocean" | "cafe";

export type ReminderRepeat = "none" | "daily" | "weekly";

export interface Reminder {
  id: string;
  title: string;
  notes?: string;
  dateTime: string;
  repeat: ReminderRepeat;
  completed: boolean;
  createdAt: string;
}

export interface UserPreferences {
  theme: "light" | "dark" | "system";
  focusDuration: number;
  workStartHour: number;
  workEndHour: number;
  ambientSound: AmbientSound;
}
