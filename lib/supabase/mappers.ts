import type {
  DbFocusSession,
  DbProfile,
  DbReminder,
  DbTask,
  DbUserPreferences,
} from "@/types/database";
import type { FocusSession, Reminder, Task, AmbientSound } from "@/types";
import type { UserProfile } from "@/types/profile";

export function mapTask(row: DbTask): Task {
  return {
    id: row.id,
    title: row.title,
    completed: row.completed,
    priority: row.priority as Task["priority"],
    dueTime: row.due_time ?? undefined,
    duration: row.duration ?? undefined,
    tags: row.tags ?? undefined,
    scheduledHour: row.scheduled_hour ?? undefined,
    scheduledMinute: row.scheduled_minute ?? undefined,
    isMeeting: row.is_meeting,
    createdAt: row.created_at,
  };
}

export function mapReminder(row: DbReminder): Reminder {
  return {
    id: row.id,
    title: row.title,
    notes: row.notes ?? undefined,
    dateTime: row.date_time,
    repeat: row.repeat_type as Reminder["repeat"],
    completed: row.completed,
    createdAt: row.created_at,
  };
}

export function mapFocusSession(row: DbFocusSession): FocusSession {
  return {
    id: row.id,
    taskId: row.task_id ?? undefined,
    duration: row.duration,
    completedAt: row.completed_at,
  };
}

export function mapProfile(row: DbProfile, email?: string): UserProfile {
  return {
    userId: row.user_id,
    fullName: row.full_name?.trim() || email?.split("@")[0] || "User",
    avatarUrl: row.avatar_url ?? undefined,
    bio: row.bio ?? undefined,
    email,
    updatedAt: row.updated_at,
  };
}

export function mapPreferences(row: DbUserPreferences) {
  return {
    theme: row.theme as "light" | "dark",
    focusDuration: row.focus_duration,
    ambientSound: row.ambient_sound as AmbientSound,
    sidebarCollapsed: row.sidebar_collapsed,
  };
}
