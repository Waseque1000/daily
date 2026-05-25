"use client";

import { RemindersSection } from "@/components/dashboard/RemindersSection";

export default function ReminderPage() {
  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <h1 className="text-3xl font-bold text-text-heading">Reminder</h1>
        <p className="text-text-body mt-1">
          Gentle nudges for breaks, deadlines, and daily rituals — never overwhelming.
        </p>
      </div>
      <RemindersSection />
    </div>
  );
}
