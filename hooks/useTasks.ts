"use client";

import { useMemo } from "react";
import { useAppStore } from "@/store/store";
import { useSync } from "@/hooks/useSync";

export function useTasks() {
  const tasks = useAppStore((s) => s.tasks);
  const {
    syncAddTask,
    syncUpdateTask,
    syncDeleteTask,
    syncToggleTask,
    syncScheduleTask,
  } = useSync();

  const todayTasks = useMemo(() => tasks, [tasks]);
  const completedCount = todayTasks.filter((t) => t.completed).length;
  const totalCount = todayTasks.length;
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  const incompleteTasks = todayTasks.filter((t) => !t.completed);
  const scheduledTasks = todayTasks.filter(
    (t) => t.scheduledHour !== undefined && !t.completed
  );

  return {
    tasks: todayTasks,
    incompleteTasks,
    scheduledTasks,
    completedCount,
    totalCount,
    progress,
    addTask: syncAddTask,
    updateTask: syncUpdateTask,
    deleteTask: syncDeleteTask,
    toggleTask: syncToggleTask,
    scheduleTask: syncScheduleTask,
  };
}
