"use client";

import { useState, KeyboardEvent, useEffect } from "react";
import { useMounted } from "@/hooks/useMounted";
import { AnimatePresence, motion } from "framer-motion";
import { format, parseISO, isToday, isTomorrow, isPast } from "date-fns";
import { BellRing, Plus, Trash2, Repeat } from "lucide-react";
import { Card } from "@/components/common/Card";
import { useReminders } from "@/hooks/useReminders";
import { useToast } from "@/components/common/Toast";
import type { ReminderRepeat } from "@/types";
import { cn } from "@/lib/utils";

const repeatOptions: { value: ReminderRepeat; label: string }[] = [
  { value: "none", label: "Once" },
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
];

function formatReminderTime(dateTime: string) {
  const date = parseISO(dateTime);
  if (isToday(date)) return `Today, ${format(date, "h:mm a")}`;
  if (isTomorrow(date)) return `Tomorrow, ${format(date, "h:mm a")}`;
  return format(date, "MMM d, h:mm a");
}

interface RemindersSectionProps {
  compact?: boolean;
}

export function RemindersSection({ compact = false }: RemindersSectionProps) {
  const [title, setTitle] = useState("");
  const mounted = useMounted();
  const [date, setDate] = useState("2026-05-25");
  const [time, setTime] = useState("09:00");

  useEffect(() => {
    if (mounted) setDate(format(new Date(), "yyyy-MM-dd"));
  }, [mounted]);
  const [repeat, setRepeat] = useState<ReminderRepeat>("none");
  const [notes, setNotes] = useState("");

  const {
    reminders,
    upcoming,
    overdue,
    todayReminders,
    completedCount,
    totalCount,
    addReminder,
    deleteReminder,
    toggleReminder,
  } = useReminders();
  const toast = useToast();

  const displayList = compact
    ? [...overdue, ...todayReminders, ...upcoming].slice(0, 5)
    : reminders;

  const handleAdd = async () => {
    const trimmed = title.trim();
    if (!trimmed) return;
    const dateTime = new Date(`${date}T${time}`).toISOString();
    try {
      await addReminder(trimmed, dateTime, repeat, notes.trim() || undefined);
      setTitle("");
      setNotes("");
      toast.add("Reminder set", "success");
    } catch {
      toast.add("Failed to save reminder", "error");
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleAdd();
    if (e.key === "Escape") {
      setTitle("");
      setNotes("");
    }
  };

  return (
    <Card className="h-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-text-heading">Reminder</h3>
          <p className="text-sm text-text-muted mt-0.5">
            {upcoming.length} upcoming
            {overdue.length > 0 && (
              <span className="text-danger ml-1">· {overdue.length} overdue</span>
            )}
          </p>
        </div>
        <BellRing className="w-5 h-5 text-primary" />
      </div>

      {!compact && (
        <div className="mb-4 p-3 rounded-xl bg-background border border-border">
          <p className="text-xs text-text-muted mb-2">
            {completedCount} of {totalCount} completed
          </p>
          <div className="h-1.5 bg-border rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-500"
              style={{
                width: `${totalCount > 0 ? (completedCount / totalCount) * 100 : 0}%`,
              }}
            />
          </div>
        </div>
      )}

      <div className={cn("space-y-3 mb-4", compact && "hidden sm:block")}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="What do you want to be reminded about?"
          className="w-full px-4 py-3 rounded-xl border border-border bg-background text-text-heading placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm"
          aria-label="Reminder title"
        />
        {!compact && (
          <>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Notes (optional)"
              rows={2}
              className="w-full px-4 py-2 rounded-xl border border-border bg-background text-text-heading placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm resize-none"
              aria-label="Reminder notes"
            />
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="px-3 py-2 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                aria-label="Reminder date"
              />
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="px-3 py-2 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                aria-label="Reminder time"
              />
              <select
                value={repeat}
                onChange={(e) => setRepeat(e.target.value as ReminderRepeat)}
                className="px-3 py-2 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 col-span-2 sm:col-span-1"
                aria-label="Repeat"
              >
                {repeatOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </>
        )}
        <button
          onClick={handleAdd}
          className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-primary text-white text-sm font-medium hover:shadow-md hover:scale-[1.01] transition-all"
        >
          <Plus className="w-4 h-4" /> Add reminder
        </button>
      </div>

      <div className={cn("space-y-2 overflow-y-auto pr-1", compact ? "max-h-[280px]" : "max-h-[400px]")}>
        <AnimatePresence mode="popLayout">
          {displayList.length === 0 ? (
            <div className="text-center py-10">
              <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-primary/10 flex items-center justify-center">
                <BellRing className="w-7 h-7 text-primary" />
              </div>
              <p className="font-medium text-text-heading">No reminders yet</p>
              <p className="text-sm text-text-muted mt-1">
                Add a gentle nudge so nothing slips through.
              </p>
            </div>
          ) : (
            displayList.map((reminder) => {
              const isOverdue = !reminder.completed && isPast(parseISO(reminder.dateTime));
              return (
                <motion.div
                  key={reminder.id}
                  layout
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                  className={cn(
                    "group flex items-start gap-3 p-4 rounded-2xl border border-border bg-background",
                    "hover:shadow-sm hover:-translate-y-0.5 transition-all",
                    reminder.completed && "opacity-60",
                    isOverdue && !reminder.completed && "border-danger/30 bg-danger/5"
                  )}
                >
                  <input
                    type="checkbox"
                    checked={reminder.completed}
                    onChange={() => toggleReminder(reminder.id)}
                    className="mt-1 w-5 h-5 accent-primary cursor-pointer rounded"
                    aria-label={`Mark "${reminder.title}" as done`}
                  />
                  <div className="flex-1 min-w-0">
                    <p
                      className={cn(
                        "font-medium text-text-heading",
                        reminder.completed && "line-through text-text-muted"
                      )}
                    >
                      {reminder.title}
                    </p>
                    {reminder.notes && !compact && (
                      <p className="text-sm text-text-muted mt-0.5 line-clamp-2">{reminder.notes}</p>
                    )}
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      <span
                        className={cn(
                          "text-xs font-medium",
                          isOverdue ? "text-danger" : "text-text-muted"
                        )}
                      >
                        {formatReminderTime(reminder.dateTime)}
                      </span>
                      {reminder.repeat !== "none" && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-secondary/10 text-secondary text-xs">
                          <Repeat className="w-3 h-3" />
                          {reminder.repeat}
                        </span>
                      )}
                      {isOverdue && (
                        <span className="px-2 py-0.5 rounded-lg bg-danger/10 text-danger text-xs font-medium">
                          Overdue
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => deleteReminder(reminder.id)}
                    className="p-1.5 rounded-lg text-text-muted opacity-0 group-hover:opacity-100 hover:text-danger hover:bg-danger/5 transition-all"
                    aria-label="Delete reminder"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>

      {compact && displayList.length > 0 && (
        <a
          href="/reminder"
          className="block text-center text-sm text-primary font-medium mt-4 hover:underline"
        >
          View all reminders
        </a>
      )}
    </Card>
  );
}
