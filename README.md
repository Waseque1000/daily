# FlowDay

A calm, Sunsama-inspired productivity web application built with Next.js 16, TypeScript, Tailwind CSS v4, Framer Motion, Recharts, and Zustand.

**Tagline:** Plan your day without feeling overwhelmed.

## Features

- **Daily Planner** — Task management with priorities, tags, and progress tracking
- **Calendar Time Blocking** — Visual hourly schedule (6 AM–10 PM) with drag-and-drop
- **Focus Mode** — Pomodoro timer with streaks, stats, and confetti celebrations
- **Analytics** — Weekly charts, mood trends, productivity score
- **AI Planner** — Smart scheduling suggestions via chat interface
- **Reminders** — Scheduled nudges with repeat options (once, daily, weekly)
- **Integrations** — Google Calendar, Notion, Slack, and more (UI mock)
- **Dark Mode** — Toggle with localStorage persistence
- **Landing Page** — Marketing site with pricing, FAQ, testimonials

## Getting Started

```bash
cd flowday
npm install
cp .env.example .env.local   # add your Supabase URL + key
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for the landing page, or [http://localhost:3000/dashboard](http://localhost:3000/dashboard) for the app.

## Supabase setup

1. Copy your project URL and publishable (or anon) key into `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_key
   ```

2. In the [Supabase Dashboard](https://supabase.com/dashboard) → **SQL Editor**, run the full script in `supabase/schema.sql`. This creates `tasks`, `reminders`, `focus_sessions`, and `user_preferences` tables with Row Level Security.

3. In **Authentication** → **Providers**, enable Email auth (enabled by default).

4. Sign up at `/signup`, then use the app. **All tasks, reminders, focus sessions, and preferences are stored in Supabase** — there is no demo/sample data in the app.

**Data flow:** Sign in → data loads from your database → every add/edit/delete saves to Supabase immediately.

### Google sign-in

1. Supabase Dashboard → **Authentication** → **Providers** → enable **Google** (add Client ID & Secret from Google Cloud Console).
2. Supabase → **Authentication** → **URL Configuration** → add redirect URL:
   - `http://localhost:3000/auth/callback` (dev)
   - `https://your-domain.com/auth/callback` (production)
3. Run `supabase/profiles.sql` if you already created tables earlier (adds the `profiles` table).

### Login returns 400?

A `400` on `/auth/v1/token` usually means **`invalid_credentials`** — not a broken API key. Common causes:

- You have not signed up yet (use `/signup` first).
- Wrong email or password.
- **Email confirmation is on** — open the link in your inbox before signing in.

For local development, you can disable confirmation: Supabase Dashboard → **Authentication** → **Providers** → **Email** → turn off **Confirm email**.

## Routes

| Route | Description |
|-------|-------------|
| `/` | Landing page |
| `/login`, `/signup` | Auth (demo — redirects to dashboard) |
| `/dashboard` | Main dashboard |
| `/today`, `/reminder`, `/calendar`, `/focus` | App views |
| `/analytics`, `/ai-planner`, `/integrations`, `/settings` | More app pages |
| `/features`, `/pricing`, `/blog` | Marketing |

## Tech Stack

- Next.js 16 (App Router)
- React 19
- Tailwind CSS v4
- Framer Motion
- Recharts
- Supabase (PostgreSQL + Auth)
- Zustand (UI state + preferences cache)
- React Hook Form + Zod

## Project Structure

```
flowday/
├── app/              # Pages & API routes
├── components/       # UI components
├── hooks/            # Custom React hooks
├── lib/              # Utils, constants, API client
├── store/            # Zustand store
├── styles/           # CSS variables & animations
└── types/            # TypeScript types
```

## License

MIT
