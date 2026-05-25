"use client";

import { CheckCircle2, Clock, Flame, Gauge } from "lucide-react";
import { Card } from "@/components/common/Card";
import { WeeklyHoursChart, WeeklyTasksChart } from "@/components/animations/AnimatedChart";
import { useTasks } from "@/hooks/useTasks";
import { useFocusSession } from "@/hooks/useFocusSession";
import { useAppStore } from "@/store/store";

export function ProductivityStats({ showCharts = true }: { showCharts?: boolean }) {
  const { completedCount, totalCount } = useTasks();
  const { totalFocusHours, todaySessions } = useFocusSession();
  const moodEntries = useAppStore((s) => s.moodEntries);

  const score = Math.min(
    100,
    Math.round((completedCount / Math.max(totalCount, 1)) * 50 + todaySessions * 10 + 20)
  );

  const stats = [
    { label: "Tasks Completed", value: completedCount, icon: CheckCircle2, color: "text-success" },
    { label: "Focus Hours", value: totalFocusHours, icon: Clock, color: "text-primary" },
    { label: "Streak", value: "5 days", icon: Flame, color: "text-warning" },
    { label: "Productivity", value: score, icon: Gauge, color: "text-secondary" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label} hover className="!p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-text-muted font-medium">{stat.label}</p>
                <p className="text-2xl font-bold text-text-heading mt-1">
                  {typeof stat.value === "number" && stat.label === "Productivity"
                    ? `${stat.value}%`
                    : stat.value}
                </p>
              </div>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
          </Card>
        ))}
      </div>

      {showCharts && (
        <div className="grid lg:grid-cols-2 gap-6">
          <Card>
            <h4 className="font-semibold text-text-heading mb-4">Hours worked (7 days)</h4>
            <WeeklyHoursChart />
          </Card>
          <Card>
            <h4 className="font-semibold text-text-heading mb-4">Tasks completed (7 days)</h4>
            <WeeklyTasksChart />
          </Card>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        <Card className="!p-4">
          <h4 className="text-sm font-semibold text-text-heading mb-3">Mood trend</h4>
          <div className="flex items-end gap-1 h-12">
            {moodEntries.map((m, i) => (
              <div
                key={i}
                className="flex-1 rounded-t-md transition-all"
                style={{
                  height: `${(m.rating / 5) * 100}%`,
                  background:
                    m.rating >= 4
                      ? "var(--success)"
                      : m.rating >= 3
                        ? "var(--warning)"
                        : "var(--danger)",
                  opacity: 0.7 + i * 0.04,
                }}
                title={`${m.date}: ${m.rating}/5`}
              />
            ))}
          </div>
          <div className="flex justify-between mt-2 text-xs text-text-muted">
            {moodEntries.map((m) => (
              <span key={m.date}>{m.date}</span>
            ))}
          </div>
        </Card>
        <Card className="!p-4 bg-primary/5 border-primary/20">
          <h4 className="text-sm font-semibold text-text-heading">Most productive day</h4>
          <p className="text-2xl font-bold text-primary mt-2">Thursday</p>
          <p className="text-sm text-text-muted mt-1">14 tasks completed — your best this week!</p>
        </Card>
      </div>
    </div>
  );
}
