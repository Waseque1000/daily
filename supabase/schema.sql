-- Run this in Supabase Dashboard → SQL Editor

-- Tasks
create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  title text not null,
  completed boolean not null default false,
  priority text not null default 'medium' check (priority in ('high', 'medium', 'low', 'none')),
  due_time text,
  duration integer,
  tags text[] default '{}',
  scheduled_hour integer,
  scheduled_minute integer,
  is_meeting boolean not null default false,
  created_at timestamptz not null default now()
);

-- Reminders
create table if not exists public.reminders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  title text not null,
  notes text,
  date_time timestamptz not null,
  repeat_type text not null default 'none' check (repeat_type in ('none', 'daily', 'weekly')),
  completed boolean not null default false,
  created_at timestamptz not null default now()
);

-- Focus sessions
create table if not exists public.focus_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  task_id uuid references public.tasks (id) on delete set null,
  duration integer not null,
  completed_at timestamptz not null default now()
);

-- User profiles
create table if not exists public.profiles (
  user_id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  avatar_url text,
  bio text,
  updated_at timestamptz not null default now()
);

-- User preferences
create table if not exists public.user_preferences (
  user_id uuid primary key references auth.users (id) on delete cascade,
  theme text not null default 'light' check (theme in ('light', 'dark')),
  focus_duration integer not null default 25,
  ambient_sound text not null default 'off',
  sidebar_collapsed boolean not null default false,
  updated_at timestamptz not null default now()
);

-- Indexes
create index if not exists tasks_user_id_idx on public.tasks (user_id);
create index if not exists reminders_user_id_idx on public.reminders (user_id);
create index if not exists focus_sessions_user_id_idx on public.focus_sessions (user_id);

-- RLS
alter table public.tasks enable row level security;
alter table public.reminders enable row level security;
alter table public.focus_sessions enable row level security;
alter table public.profiles enable row level security;
alter table public.user_preferences enable row level security;

create policy "tasks_select_own" on public.tasks for select using (auth.uid() = user_id);
create policy "tasks_insert_own" on public.tasks for insert with check (auth.uid() = user_id);
create policy "tasks_update_own" on public.tasks for update using (auth.uid() = user_id);
create policy "tasks_delete_own" on public.tasks for delete using (auth.uid() = user_id);

create policy "reminders_select_own" on public.reminders for select using (auth.uid() = user_id);
create policy "reminders_insert_own" on public.reminders for insert with check (auth.uid() = user_id);
create policy "reminders_update_own" on public.reminders for update using (auth.uid() = user_id);
create policy "reminders_delete_own" on public.reminders for delete using (auth.uid() = user_id);

create policy "focus_sessions_select_own" on public.focus_sessions for select using (auth.uid() = user_id);
create policy "focus_sessions_insert_own" on public.focus_sessions for insert with check (auth.uid() = user_id);
create policy "focus_sessions_delete_own" on public.focus_sessions for delete using (auth.uid() = user_id);

create policy "profiles_select_own" on public.profiles for select using (auth.uid() = user_id);
create policy "profiles_insert_own" on public.profiles for insert with check (auth.uid() = user_id);
create policy "profiles_update_own" on public.profiles for update using (auth.uid() = user_id);

create policy "prefs_select_own" on public.user_preferences for select using (auth.uid() = user_id);
create policy "prefs_insert_own" on public.user_preferences for insert with check (auth.uid() = user_id);
create policy "prefs_update_own" on public.user_preferences for update using (auth.uid() = user_id);

-- Auto-create preferences on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (user_id, full_name, avatar_url)
  values (
    new.id,
    coalesce(
      new.raw_user_meta_data->>'full_name',
      new.raw_user_meta_data->>'name',
      ''
    ),
    coalesce(
      new.raw_user_meta_data->>'avatar_url',
      new.raw_user_meta_data->>'picture',
      null
    )
  )
  on conflict (user_id) do nothing;

  insert into public.user_preferences (user_id)
  values (new.id)
  on conflict (user_id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
