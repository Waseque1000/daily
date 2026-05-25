"use client";

import { DailyPlanner } from "@/components/dashboard/DailyPlanner";
import { FocusModeCard } from "@/components/dashboard/FocusModeCard";

export default function TodayPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-text-heading">Today</h1>
        <p className="text-text-body mt-1">Your focused view for the day ahead.</p>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <DailyPlanner />
        <FocusModeCard large />
      </div>
    </div>
  );
}
