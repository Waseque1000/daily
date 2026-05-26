import mongoose, { Schema, Document } from "mongoose";

const TaskSchema = new Schema({
  user_id: { type: String, required: true, index: true },
  title: { type: String, required: true },
  completed: { type: Boolean, default: false },
  priority: { type: String, enum: ["high", "medium", "low", "none"], default: "medium" },
  due_time: { type: String, default: null },
  duration: { type: Number, default: null },
  tags: { type: [String], default: [] },
  scheduled_hour: { type: Number, default: null },
  scheduled_minute: { type: Number, default: null },
  is_meeting: { type: Boolean, default: false },
  created_at: { type: Date, default: Date.now },
});

const ReminderSchema = new Schema({
  user_id: { type: String, required: true, index: true },
  title: { type: String, required: true },
  notes: { type: String, default: null },
  date_time: { type: String, required: true },
  repeat_type: { type: String, enum: ["none", "daily", "weekly"], default: "none" },
  completed: { type: Boolean, default: false },
  created_at: { type: Date, default: Date.now },
});

const FocusSessionSchema = new Schema({
  user_id: { type: String, required: true, index: true },
  task_id: { type: String, default: null },
  duration: { type: Number, required: true },
  completed_at: { type: Date, default: Date.now },
});

const ProfileSchema = new Schema({
  user_id: { type: String, required: true, unique: true },
  full_name: { type: String, default: null },
  avatar_url: { type: String, default: null },
  bio: { type: String, default: null },
  updated_at: { type: Date, default: Date.now },
});

const UserPreferenceSchema = new Schema({
  user_id: { type: String, required: true, unique: true },
  theme: { type: String, enum: ["light", "dark"], default: "light" },
  focus_duration: { type: Number, default: 25 },
  ambient_sound: { type: String, default: "off" },
  sidebar_collapsed: { type: Boolean, default: false },
  updated_at: { type: Date, default: Date.now },
});

export const TaskModel = mongoose.models.Task || mongoose.model("Task", TaskSchema);
export const ReminderModel = mongoose.models.Reminder || mongoose.model("Reminder", ReminderSchema);
export const FocusSessionModel = mongoose.models.FocusSession || mongoose.model("FocusSession", FocusSessionSchema);
export const ProfileModel = mongoose.models.Profile || mongoose.model("Profile", ProfileSchema);
export const UserPreferenceModel = mongoose.models.UserPreference || mongoose.model("UserPreference", UserPreferenceSchema);
