"use client";

import { FocusModeCard } from "@/components/dashboard/FocusModeCard";
import { useTasks } from "@/hooks/useTasks";
import { useFocusSession } from "@/hooks/useFocusSession";
import { cn } from "@/lib/utils";

export default function FocusPage() {
  const { incompleteTasks } = useTasks();
  const { startFocus } = useFocusSession();

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-text-heading">Focus Mode</h1>
        <p className="text-text-body mt-1">Distraction-free deep work sessions.</p>
      </div>
      <FocusModeCard large />
      <div>
        <h2 className="text-lg font-semibold text-text-heading mb-4">Pick a task to focus on</h2>
        <div className="space-y-2">
          {incompleteTasks.map((task) => (
            <button
              key={task.id}
              onClick={() => startFocus(task.id)}
              className={cn(
                "w-full text-left p-4 rounded-2xl border border-border bg-card",
                "hover:border-primary hover:shadow-md transition-all"
              )}
            >
              <p className="font-medium text-text-heading">{task.title}</p>
              {task.duration && (
                <p className="text-sm text-text-muted mt-1">{task.duration} min estimated</p>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
