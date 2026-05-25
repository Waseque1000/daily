"use client";

import { useState, KeyboardEvent } from "react";
import { AnimatePresence } from "framer-motion";
import { Plus, ListTodo } from "lucide-react";
import { Card } from "@/components/common/Card";
import { TaskCard } from "./TaskCard";
import { useTasks } from "@/hooks/useTasks";
import { useToast } from "@/components/common/Toast";
import type { Priority } from "@/types";
import { cn } from "@/lib/utils";

const priorities: Priority[] = ["high", "medium", "low", "none"];

export function DailyPlanner() {
  const [input, setInput] = useState("");
  const [priority, setPriority] = useState<Priority>("medium");
  const { tasks, completedCount, totalCount, progress, addTask, toggleTask, deleteTask } = useTasks();
  const toast = useToast();

  const handleAdd = async () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    try {
      await addTask(trimmed, priority);
      setInput("");
      toast.add("Task added successfully", "success");
    } catch {
      toast.add("Failed to save task", "error");
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleAdd();
    if (e.key === "Escape") setInput("");
  };

  return (
    <Card className="h-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-text-heading">Daily Planner</h3>
          <p className="text-sm text-text-muted mt-0.5">
            {completedCount} of {totalCount} tasks completed today
          </p>
        </div>
        <ListTodo className="w-5 h-5 text-primary" />
      </div>

      <div className="mb-4">
        <div className="h-2 bg-background rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-3">
        {priorities.map((p) => (
          <button
            key={p}
            onClick={() => setPriority(p)}
            className={cn(
              "px-2.5 py-1 rounded-lg text-xs font-medium capitalize transition-all",
              priority === p
                ? "bg-primary text-white"
                : "bg-background text-text-muted hover:text-text-heading"
            )}
          >
            {p === "none" ? "None" : p}
          </button>
        ))}
      </div>

      <div className="flex gap-2 mb-6">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add a task for today..."
          className="flex-1 px-4 py-3 rounded-xl border border-border bg-background text-text-heading placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/30"
          aria-label="New task"
        />
        <button
          onClick={handleAdd}
          className="p-3 rounded-xl bg-primary text-white hover:shadow-md hover:scale-[1.02] transition-all"
          aria-label="Add task"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
        <AnimatePresence mode="popLayout">
          {tasks.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center">
                <ListTodo className="w-8 h-8 text-primary" />
              </div>
              <p className="text-text-heading font-medium">No tasks yet</p>
              <p className="text-sm text-text-muted mt-1">Add your first task to start planning calmly.</p>
            </div>
          ) : (
            tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onComplete={toggleTask}
                onDelete={deleteTask}
              />
            ))
          )}
        </AnimatePresence>
      </div>
    </Card>
  );
}
