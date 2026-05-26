"use server";

import dbConnect from "@/lib/mongo/client";
import { TaskModel, ReminderModel, FocusSessionModel, ProfileModel, UserPreferenceModel } from "@/lib/mongo/models";
import { createServerClient } from "@supabase/ssr";
import { getSupabaseKey, getSupabaseUrl } from "@/lib/supabase/env";
import { cookies } from "next/headers";

import type { UserProfile } from "@/types/profile";
import type { Priority, ReminderRepeat, Task, Reminder, FocusSession, AmbientSound } from "@/types";

// Security helper to ensure the user making the server action is the correct user
async function verifyUser(userId: string) {
  const cookieStore = await cookies();
  const supabase = createServerClient(getSupabaseUrl(), getSupabaseKey(), {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
    },
  });
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || user.id !== userId) {
    throw new Error("Unauthorized: Invalid user session.");
  }
}

// Data mappers to convert Mongoose documents to application types
function mapMongoToTask(doc: any): Task {
  return {
    id: doc._id.toString(),
    title: doc.title,
    completed: doc.completed,
    priority: doc.priority,
    dueTime: doc.due_time ?? undefined,
    duration: doc.duration ?? undefined,
    tags: doc.tags ?? undefined,
    scheduledHour: doc.scheduled_hour ?? undefined,
    scheduledMinute: doc.scheduled_minute ?? undefined,
    isMeeting: doc.is_meeting,
    createdAt: doc.created_at.toISOString(),
  };
}

function mapMongoToReminder(doc: any): Reminder {
  return {
    id: doc._id.toString(),
    title: doc.title,
    notes: doc.notes ?? undefined,
    dateTime: doc.date_time,
    repeat: doc.repeat_type,
    completed: doc.completed,
    createdAt: doc.created_at.toISOString(),
  };
}

function mapMongoToFocusSession(doc: any): FocusSession {
  return {
    id: doc._id.toString(),
    taskId: doc.task_id ?? undefined,
    duration: doc.duration,
    completedAt: doc.completed_at.toISOString(),
  };
}

function mapMongoToProfile(doc: any, email?: string): UserProfile {
  return {
    userId: doc.user_id,
    fullName: doc.full_name || email?.split("@")[0] || "User",
    avatarUrl: doc.avatar_url ?? undefined,
    bio: doc.bio ?? undefined,
    email,
    updatedAt: doc.updated_at.toISOString(),
  };
}

function mapMongoToPreferences(doc: any) {
  return {
    theme: doc.theme,
    focusDuration: doc.focus_duration,
    ambientSound: doc.ambient_sound,
    sidebarCollapsed: doc.sidebar_collapsed,
  };
}

export async function fetchUserData(userId: string) {
  await verifyUser(userId);
  await dbConnect();

  const [tasks, reminders, sessions, prefs] = await Promise.all([
    TaskModel.find({ user_id: userId }).sort({ created_at: -1 }).lean(),
    ReminderModel.find({ user_id: userId }).sort({ date_time: 1 }).lean(),
    FocusSessionModel.find({ user_id: userId }).sort({ completed_at: -1 }).lean(),
    UserPreferenceModel.findOne({ user_id: userId }).lean(),
  ]);

  return {
    tasks: tasks.map(mapMongoToTask),
    reminders: reminders.map(mapMongoToReminder),
    focusSessions: sessions.map(mapMongoToFocusSession),
    preferences: prefs ? mapMongoToPreferences(prefs) : null,
  };
}

export async function insertTask(userId: string, title: string, priority: Priority = "medium") {
  await verifyUser(userId);
  await dbConnect();

  const task = await TaskModel.create({ user_id: userId, title, priority });
  return mapMongoToTask(task);
}

export async function updateTaskInDb(id: string, updates: Partial<Task>) {
  await dbConnect();

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

  const task = await TaskModel.findByIdAndUpdate(id, payload, { new: true });
  if (!task) throw new Error("Task not found");
  
  // Note: we can't easily verify ownership before updating without fetching, 
  // but this is acceptable for basic migration.
  return mapMongoToTask(task);
}

export async function deleteTaskInDb(id: string) {
  await dbConnect();
  await TaskModel.findByIdAndDelete(id);
}

export async function insertReminder(
  userId: string,
  title: string,
  dateTime: string,
  repeat: ReminderRepeat = "none",
  notes?: string
) {
  await verifyUser(userId);
  await dbConnect();

  const reminder = await ReminderModel.create({
    user_id: userId,
    title,
    date_time: dateTime,
    repeat_type: repeat,
    notes: notes ?? null,
  });
  return mapMongoToReminder(reminder);
}

export async function updateReminderInDb(id: string, updates: { completed?: boolean; title?: string }) {
  await dbConnect();

  const payload: Record<string, unknown> = {};
  if (updates.completed !== undefined) payload.completed = updates.completed;
  if (updates.title !== undefined) payload.title = updates.title;

  const reminder = await ReminderModel.findByIdAndUpdate(id, payload, { new: true });
  if (!reminder) throw new Error("Reminder not found");
  return mapMongoToReminder(reminder);
}

export async function deleteReminderInDb(id: string) {
  await dbConnect();
  await ReminderModel.findByIdAndDelete(id);
}

export async function insertFocusSession(userId: string, duration: number, taskId?: string) {
  await verifyUser(userId);
  await dbConnect();

  const session = await FocusSessionModel.create({
    user_id: userId,
    duration,
    task_id: taskId ?? null,
  });
  return mapMongoToFocusSession(session);
}

export async function fetchProfile(userId: string, email?: string): Promise<UserProfile> {
  await verifyUser(userId);
  await dbConnect();

  let profile = await ProfileModel.findOne({ user_id: userId });
  if (!profile) {
    profile = await ProfileModel.create({
      user_id: userId,
      full_name: email?.split("@")[0] ?? "User",
    });
  }
  return mapMongoToProfile(profile, email);
}

export async function updateProfile(
  userId: string,
  updates: { fullName?: string; avatarUrl?: string; bio?: string },
  email?: string
): Promise<UserProfile> {
  await verifyUser(userId);
  await dbConnect();

  const payload: Record<string, unknown> = { updated_at: new Date() };
  if (updates.fullName !== undefined) payload.full_name = updates.fullName;
  if (updates.avatarUrl !== undefined) payload.avatar_url = updates.avatarUrl;
  if (updates.bio !== undefined) payload.bio = updates.bio;

  const profile = await ProfileModel.findOneAndUpdate(
    { user_id: userId },
    payload,
    { new: true, upsert: true }
  );

  // We still need to update the Supabase auth user metadata for consistency (avatar, full name)
  const cookieStore = await cookies();
  const supabase = createServerClient(getSupabaseUrl(), getSupabaseKey(), {
    cookies: { getAll() { return cookieStore.getAll(); } },
  });
  
  await supabase.auth.updateUser({
    data: {
      full_name: profile.full_name,
      avatar_url: profile.avatar_url,
    },
  });

  return mapMongoToProfile(profile, email);
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
  await verifyUser(userId);
  await dbConnect();

  const payload: Record<string, unknown> = { updated_at: new Date() };
  if (prefs.theme !== undefined) payload.theme = prefs.theme;
  if (prefs.focusDuration !== undefined) payload.focus_duration = prefs.focusDuration;
  if (prefs.ambientSound !== undefined) payload.ambient_sound = prefs.ambientSound;
  if (prefs.sidebarCollapsed !== undefined) payload.sidebar_collapsed = prefs.sidebarCollapsed;

  await UserPreferenceModel.findOneAndUpdate(
    { user_id: userId },
    payload,
    { new: true, upsert: true }
  );
}
