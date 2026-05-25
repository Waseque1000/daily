"use client";

import { motion } from "framer-motion";
import { GripVertical, Pencil, Trash2 } from "lucide-react";
import type { Task } from "@/types";
import { priorityColor, priorityLabel } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface TaskCardProps {
  task: Task;
  onComplete: (id: string) => void;
  onDelete: (id: string) => void;
  draggable?: boolean;
}

export function TaskCard({ task, onComplete, onDelete, draggable = true }: TaskCardProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      className={cn(
        "group p-4 bg-card rounded-2xl shadow-sm border border-border",
        "hover:shadow-md hover:-translate-y-1 transition-all duration-200",
        task.completed && "opacity-60"
      )}
    >
      <div className="flex items-start gap-3">
        {draggable && (
          <GripVertical
            className="w-4 h-4 text-text-muted mt-1 opacity-0 group-hover:opacity-100 cursor-grab transition-opacity shrink-0"
            aria-hidden
          />
        )}
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => onComplete(task.id)}
          className="mt-1 w-5 h-5 accent-primary cursor-pointer rounded"
          aria-label={`Mark "${task.title}" as ${task.completed ? "incomplete" : "complete"}`}
        />
        <div className="flex-1 min-w-0">
          <h4
            className={cn(
              "font-medium text-text-heading",
              task.completed && "line-through text-text-muted"
            )}
          >
            {task.title}
          </h4>
          <div className="flex flex-wrap gap-2 mt-2 text-sm">
            <span className={cn("px-2 py-0.5 rounded-lg text-xs font-medium", priorityColor(task.priority))}>
              {priorityLabel(task.priority)}
            </span>
            {task.dueTime && (
              <span className="text-text-muted">Due: {task.dueTime}</span>
            )}
            {task.duration && (
              <span className="text-text-muted">{task.duration}m</span>
            )}
            {task.tags?.map((tag) => (
              <span key={tag} className="px-2 py-0.5 rounded-lg bg-secondary/10 text-secondary text-xs">
                {tag}
              </span>
            ))}
          </div>
        </div>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            className="p-1.5 rounded-lg text-text-muted hover:text-primary hover:bg-primary/5"
            aria-label="Edit task"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="p-1.5 rounded-lg text-text-muted hover:text-danger hover:bg-danger/5"
            aria-label="Delete task"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
