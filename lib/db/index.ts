import { createClient } from "@/lib/supabase/client";
import {
  mapFocusSession,
  mapProfile,
  mapReminder,
  mapTask,
  mapPreferences,
} from "@/lib/supabase/mappers";
import type {
  DbFocusSession,
  DbProfile,
  DbReminder,
  DbTask,
  DbUserPreferences,
} from "@/types/database";
import type { UserProfile } from "@/types/profile";
import type { Priority, ReminderRepeat, Task } from "@/types";

const supabase = () => createClient();

export async function fetchUserData(userId: string) {
  const client = supabase();

  const [tasksRes, remindersRes, sessionsRes, prefsRes] = await Promise.all([
    client.from("tasks").select("*").eq("user_id", userId).order("created_at", { ascending: false }),
    client.from("reminders").select("*").eq("user_id", userId).order("date_time", { ascending: true }),
    client.from("focus_sessions").select("*").eq("user_id", userId).order("completed_at", { ascending: false }),
    client.from("user_preferences").select("*").eq("user_id", userId).maybeSingle(),
  ]);

  if (tasksRes.error) throw tasksRes.error;
  if (remindersRes.error) throw remindersRes.error;
  if (sessionsRes.error) throw sessionsRes.error;
  if (prefsRes.error) throw prefsRes.error;

  return {
    tasks: (tasksRes.data as DbTask[]).map(mapTask),
    reminders: (remindersRes.data as DbReminder[]).map(mapReminder),
    focusSessions: (sessionsRes.data as DbFocusSession[]).map(mapFocusSession),
    preferences: prefsRes.data ? mapPreferences(prefsRes.data as DbUserPreferences) : null,
  };
}

export async function insertTask(userId: string, title: string, priority: Priority = "medium") {
  const { data, error } = await supabase()
    .from("tasks")
    .insert({ user_id: userId, title, priority })
    .select()
    .single();
  if (error) throw error;
  return mapTask(data as DbTask);
}

export async function updateTaskInDb(id: string, updates: Partial<Task>) {
  const payload: Record<string, unknown> = {};
  if (updates.title !== undefined) payload.title = updates.title;
  if (updates.completed !== undefined) payload.completed = updates.completed;
  if (updates.priority !== undefined) payload.priority = updates.priority;
  if (updates.dueTime !== undefined) payload.due_time = updates.dueTime;
  if (updates.duration !== undefined) payload.duration = updates.duration;
  if (updates.tags !== undefined) payload.tags = updates.tags;
  if (updates.scheduledHour !== undefined) payload.scheduled_hour = updates.scheduledHour;
  if (updates.scheduledMinute !== undefined) payload.scheduled_minute = updates.scheduledMinute;
  if (updates.isMeeting !== undefined) payload.is_meeting = updates.isMeeting;

  const { data, error } = await supabase()
    .from("tasks")
    .update(payload)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return mapTask(data as DbTask);
}

export async function deleteTaskInDb(id: string) {
  const { error } = await supabase().from("tasks").delete().eq("id", id);
  if (error) throw error;
}

export async function insertReminder(
  userId: string,
  title: string,
  dateTime: string,
  repeat: ReminderRepeat = "none",
  notes?: string
) {
  const { data, error } = await supabase()
    .from("reminders")
    .insert({
      user_id: userId,
      title,
      date_time: dateTime,
      repeat_type: repeat,
      notes: notes ?? null,
    })
    .select()
    .single();
  if (error) throw error;
  return mapReminder(data as DbReminder);
}

export async function updateReminderInDb(id: string, updates: { completed?: boolean; title?: string }) {
  const payload: Record<string, unknown> = {};
  if (updates.completed !== undefined) payload.completed = updates.completed;
  if (updates.title !== undefined) payload.title = updates.title;

  const { data, error } = await supabase()
    .from("reminders")
    .update(payload)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return mapReminder(data as DbReminder);
}

export async function deleteReminderInDb(id: string) {
  const { error } = await supabase().from("reminders").delete().eq("id", id);
  if (error) throw error;
}

export async function insertFocusSession(userId: string, duration: number, taskId?: string) {
  const { data, error } = await supabase()
    .from("focus_sessions")
    .insert({
      user_id: userId,
      duration,
      task_id: taskId ?? null,
    })
    .select()
    .single();
  if (error) throw error;
  return mapFocusSession(data as DbFocusSession);
}

export async function fetchProfile(userId: string, email?: string): Promise<UserProfile> {
  const client = supabase();
  const { data, error } = await client
    .from("profiles")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) throw error;

  if (data) {
    return mapProfile(data as DbProfile, email);
  }

  const { data: created, error: insertError } = await client
    .from("profiles")
    .insert({ user_id: userId, full_name: email?.split("@")[0] ?? "User" })
    .select()
    .single();

  if (insertError) throw insertError;
  return mapProfile(created as DbProfile, email);
}

export async function updateProfile(
  userId: string,
  updates: { fullName?: string; avatarUrl?: string; bio?: string },
  email?: string
): Promise<UserProfile> {
  const payload: Record<string, unknown> = {
    user_id: userId,
    updated_at: new Date().toISOString(),
  };
  if (updates.fullName !== undefined) payload.full_name = updates.fullName;
  if (updates.avatarUrl !== undefined) payload.avatar_url = updates.avatarUrl;
  if (updates.bio !== undefined) payload.bio = updates.bio;

  const { data, error } = await supabase()
    .from("profiles")
    .upsert(payload)
    .select()
    .single();

  if (error) throw error;

  const profile = mapProfile(data as DbProfile, email);

  await supabase().auth.updateUser({
    data: {
      full_name: profile.fullName,
      avatar_url: profile.avatarUrl,
    },
  });

  return profile;
}

export async function upsertPreferences(
  userId: string,
  prefs: {
    theme?: "light" | "dark";
    focusDuration?: number;
    ambientSound?: string;
    sidebarCollapsed?: boolean;
  }
) {
  const payload: Record<string, unknown> = { user_id: userId, updated_at: new Date().toISOString() };
  if (prefs.theme !== undefined) payload.theme = prefs.theme;
  if (prefs.focusDuration !== undefined) payload.focus_duration = prefs.focusDuration;
  if (prefs.ambientSound !== undefined) payload.ambient_sound = prefs.ambientSound;
  if (prefs.sidebarCollapsed !== undefined) payload.sidebar_collapsed = prefs.sidebarCollapsed;

  const { error } = await supabase().from("user_preferences").upsert(payload);
  if (error) throw error;
}
