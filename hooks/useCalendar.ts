"use client";

import { useEffect, useMemo, useState } from "react";
import { useMounted } from "@/hooks/useMounted";
import { useAppStore } from "@/store/store";
import { HOUR_START, HOUR_END } from "@/lib/constants";
import type { CalendarBlock } from "@/types";

export function useCalendar() {
  const tasks = useAppStore((s) => s.tasks);
  const scheduleTask = useAppStore((s) => s.scheduleTask);

  const hours = useMemo(() => {
    const list: number[] = [];
    for (let h = HOUR_START; h <= HOUR_END; h++) list.push(h);
    return list;
  }, []);

  const blocks: CalendarBlock[] = useMemo(
    () =>
      tasks
        .filter((t) => t.scheduledHour !== undefined)
        .map((t) => ({
          id: t.id,
          title: t.title,
          startHour: t.scheduledHour!,
          startMinute: t.scheduledMinute ?? 0,
          durationMinutes: t.duration ?? 30,
          isMeeting: t.isMeeting,
          taskId: t.id,
        })),
    [tasks]
  );

  const mounted = useMounted();
  const [now, setNow] = useState({ hour: -1, minute: -1 });

  useEffect(() => {
    if (!mounted) return;
    const update = () => {
      const d = new Date();
      setNow({ hour: d.getHours(), minute: d.getMinutes() });
    };
    update();
    const interval = setInterval(update, 60_000);
    return () => clearInterval(interval);
  }, [mounted]);

  return {
    hours,
    blocks,
    currentHour: now.hour,
    currentMinute: now.minute,
    scheduleTask,
    tasks,
  };
}
