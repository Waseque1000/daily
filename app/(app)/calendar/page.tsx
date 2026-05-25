"use client";

import { CalendarTimeBlocking } from "@/components/dashboard/CalendarTimeBlocking";
import { DailyPlanner } from "@/components/dashboard/DailyPlanner";

export default function CalendarPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-text-heading">Calendar</h1>
        <p className="text-text-body mt-1">Time-block your day with drag-and-drop scheduling.</p>
      </div>
      <CalendarTimeBlocking />
      <DailyPlanner />
    </div>
  );
}
