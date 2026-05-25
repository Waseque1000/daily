export interface DbTask {
  id: string;
  user_id: string;
  title: string;
  completed: boolean;
  priority: string;
  due_time: string | null;
  duration: number | null;
  tags: string[] | null;
  scheduled_hour: number | null;
  scheduled_minute: number | null;
  is_meeting: boolean;
  created_at: string;
}

export interface DbReminder {
  id: string;
  user_id: string;
  title: string;
  notes: string | null;
  date_time: string;
  repeat_type: string;
  completed: boolean;
  created_at: string;
}

export interface DbFocusSession {
  id: string;
  user_id: string;
  task_id: string | null;
  duration: number;
  completed_at: string;
}

export interface DbProfile {
  user_id: string;
  full_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  updated_at: string;
}

export interface DbUserPreferences {
  user_id: string;
  theme: string;
  focus_duration: number;
  ambient_sound: string;
  sidebar_collapsed: boolean;
  updated_at: string;
}
