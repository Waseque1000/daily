import type { Integration } from "@/types";

export const APP_NAME = "FlowDay";
export const APP_TAGLINE = "Plan your day without feeling overwhelmed.";

export const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: "LayoutDashboard" },
  { href: "/today", label: "Today", icon: "Sun" },
  { href: "/reminder", label: "Reminder", icon: "BellRing" },
  { href: "/calendar", label: "Calendar", icon: "Calendar" },
  { href: "/focus", label: "Focus Mode", icon: "Target" },
  { href: "/analytics", label: "Analytics", icon: "BarChart3" },
  { href: "/ai-planner", label: "AI Planner", icon: "Sparkles" },
  { href: "/integrations", label: "Integrations", icon: "Plug" },
  { href: "/settings", label: "Settings", icon: "Settings" },
] as const;

export const FEATURES = [
  {
    title: "Daily Planner",
    description: "Organize today's tasks with priorities, tags, and calm visual clarity.",
    icon: "CheckSquare",
  },
  {
    title: "Time Blocking",
    description: "Drag tasks onto your calendar and build a realistic, focused schedule.",
    icon: "Clock",
  },
  {
    title: "Focus Sessions",
    description: "Pomodoro-style focus mode with streaks, stats, and celebration moments.",
    icon: "Zap",
  },
  {
    title: "AI Planner",
    description: "Smart suggestions for scheduling, breaks, and daily prioritization.",
    icon: "Sparkles",
  },
  {
    title: "Analytics",
    description: "Track productivity trends, mood, and your most effective work patterns.",
    icon: "TrendingUp",
  },
  {
    title: "Integrations",
    description: "Connect Google Calendar, Notion, Slack, and your favorite tools.",
    icon: "Link",
  },
  {
    title: "Reminders",
    description: "Never miss a moment — gentle nudges for tasks, breaks, and deadlines.",
    icon: "BellRing",
  },
];

export const PRICING_PLANS = [
  {
    name: "Starter",
    price: { monthly: 0, annual: 0 },
    features: ["Up to 20 tasks/day", "Basic focus timer", "Weekly analytics", "1 integration"],
    cta: "Start Free",
    popular: false,
  },
  {
    name: "Professional",
    price: { monthly: 12, annual: 96 },
    features: [
      "Unlimited tasks",
      "AI day planner",
      "Full analytics",
      "All integrations",
      "Custom focus durations",
    ],
    cta: "Start Trial",
    popular: true,
  },
  {
    name: "Enterprise",
    price: { monthly: 29, annual: 228 },
    features: [
      "Everything in Pro",
      "Team workspaces",
      "Admin dashboard",
      "SSO & priority support",
      "Custom onboarding",
    ],
    cta: "Contact Sales",
    popular: false,
  },
];

export const FAQ_ITEMS = [
  {
    q: "What is FlowDay?",
    a: "FlowDay is a calm productivity workspace that combines tasks, calendar time-blocking, focus sessions, and AI planning in one seamless experience.",
  },
  {
    q: "Is there a free plan?",
    a: "Yes! The Starter plan is free forever with core features including daily planning and focus mode.",
  },
  {
    q: "Can I connect Google Calendar?",
    a: "Absolutely. Connect Google Calendar during onboarding or from the Integrations page to sync meetings automatically.",
  },
  {
    q: "How does the AI planner work?",
    a: "The AI assistant analyzes your tasks, meetings, and preferences to suggest an optimized daily schedule with focus blocks and breaks.",
  },
  {
    q: "Does FlowDay work on mobile?",
    a: "Yes. FlowDay is fully responsive with a mobile-optimized bottom navigation for planning on the go.",
  },
  {
    q: "Can I use dark mode?",
    a: "Yes. Toggle dark mode from the top navigation bar. Your preference is saved automatically.",
  },
];

export const DEFAULT_INTEGRATIONS: Integration[] = [
  { id: "google-calendar", name: "Google Calendar", connected: true, icon: "Calendar" },
  { id: "gmail", name: "Gmail", connected: false, icon: "Mail" },
  { id: "notion", name: "Notion", connected: true, icon: "FileText" },
  { id: "slack", name: "Slack", connected: true, icon: "MessageSquare" },
  { id: "github", name: "GitHub", connected: false, icon: "Github" },
  { id: "trello", name: "Trello", connected: false, icon: "Trello" },
];

export const AI_SUGGESTED_PROMPTS = [
  "Plan my day based on my meetings",
  "What should I prioritize today?",
  "Suggest focus blocks for me",
  "When should I take breaks?",
];

export const HOUR_START = 6;
export const HOUR_END = 22;
