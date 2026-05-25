"use client";

import { AIAssistant } from "@/components/dashboard/AIAssistant";

export default function AIPlannerPage() {
  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-text-heading">AI Planner</h1>
        <p className="text-text-body mt-1">Smart scheduling and task suggestions powered by AI.</p>
      </div>
      <AIAssistant />
    </div>
  );
}
