"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/common/Card";
import { useCalendar } from "@/hooks/useCalendar";
import { cn } from "@/lib/utils";

const SLOT_HEIGHT = 48;

function formatHour(h: number) {
  if (h === 0) return "12 AM";
  if (h < 12) return `${h} AM`;
  if (h === 12) return "12 PM";
  return `${h - 12} PM`;
}

export function CalendarTimeBlocking({ compact = false }: { compact?: boolean }) {
  const { hours, blocks, currentHour, currentMinute, scheduleTask, tasks } = useCalendar();
  const [draggingId, setDraggingId] = useState<string | null>(null);

  const currentTop =
    ((currentHour - hours[0]) * 60 + currentMinute) * (SLOT_HEIGHT / 60);

  const handleDrop = (hour: number) => {
    if (!draggingId) return;
    scheduleTask(draggingId, hour, 0);
    setDraggingId(null);
  };

  return (
    <Card className={cn(compact ? "" : "min-h-[500px]")}>
      <h3 className="text-lg font-semibold text-text-heading mb-4">Calendar Time Blocking</h3>
      <div className="relative overflow-x-auto">
        <div className="flex min-w-[280px]">
          <div className="w-16 shrink-0">
            {hours.map((h) => (
              <div
                key={h}
                className="text-xs text-text-muted pr-2 text-right"
                style={{ height: SLOT_HEIGHT }}
              >
                {formatHour(h)}
              </div>
            ))}
          </div>
          <div
            className="flex-1 relative border-l border-border"
            onDragOver={(e) => e.preventDefault()}
          >
            {hours.map((h, i) => (
              <div key={h}>
                <div
                  className="border-t border-border/60 relative"
                  style={{ height: SLOT_HEIGHT }}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => handleDrop(h)}
                >
                  {i > 0 && i % 3 === 0 && (
                    <div className="absolute left-0 right-0 top-0 border-t border-dashed border-secondary/30 pointer-events-none" />
                  )}
                </div>
              </div>
            ))}

            {currentHour >= hours[0] && currentHour <= hours[hours.length - 1] && (
              <motion.div
                className="absolute left-0 right-0 h-0.5 bg-primary z-20 pointer-events-none"
                style={{ top: currentTop }}
                animate={{ opacity: [0.6, 1, 0.6] }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                <div className="absolute -left-1 -top-1.5 w-3 h-3 rounded-full bg-primary shadow-lg shadow-primary/50" />
              </motion.div>
            )}

            {blocks.map((block) => {
              const top =
                ((block.startHour - hours[0]) * 60 + block.startMinute) * (SLOT_HEIGHT / 60);
              const height = (block.durationMinutes / 60) * SLOT_HEIGHT;
              return (
                <motion.div
                  key={block.id}
                  draggable={!block.isMeeting}
                  onDragStart={() => setDraggingId(block.taskId ?? block.id)}
                  onDragEnd={() => setDraggingId(null)}
                  className={cn(
                    "absolute left-1 right-1 rounded-xl px-3 py-2 text-xs font-medium text-white shadow-md cursor-grab active:cursor-grabbing z-10 overflow-hidden",
                    block.isMeeting
                      ? "bg-secondary/80 cursor-default"
                      : "bg-primary hover:bg-primary/90"
                  )}
                  style={{ top, height: Math.max(height, 32) }}
                  whileHover={{ scale: block.isMeeting ? 1 : 1.02 }}
                  title={`${block.title} (${block.durationMinutes}m)`}
                >
                  <p className="truncate font-semibold">{block.title}</p>
                  <p className="opacity-80">{block.durationMinutes}m</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {!compact && tasks.filter((t) => !t.scheduledHour && !t.completed).length > 0 && (
        <p className="text-xs text-text-muted mt-4">
          Drag incomplete tasks from the planner onto time slots to schedule them.
        </p>
      )}
    </Card>
  );
}
