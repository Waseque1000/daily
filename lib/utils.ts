import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Priority } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function priorityColor(priority: Priority): string {
  const colors: Record<Priority, string> = {
    high: "bg-danger/10 text-danger",
    medium: "bg-warning/10 text-warning",
    low: "bg-success/10 text-success",
    none: "bg-text-muted/10 text-text-muted",
  };
  return colors[priority];
}

export function priorityLabel(priority: Priority): string {
  if (priority === "none") return "No priority";
  return priority.charAt(0).toUpperCase() + priority.slice(1);
}

export function formatTime(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}m`;
  return m === 0 ? `${h}h` : `${h}h ${m}m`;
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}
