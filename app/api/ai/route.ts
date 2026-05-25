import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { message } = await request.json();

  const lower = (message as string)?.toLowerCase() ?? "";

  let reply =
    "Based on your schedule, here's a calm plan for today:\n\n• 9:00–10:30 — Deep work on your highest priority task\n• 10:30 — 10-minute break\n• 11:00 — Team standup (already scheduled)\n• 12:30 — Lunch & walk\n• 14:00–15:30 — Focus block: API integration\n• 16:00 — Email and admin tasks";

  const suggestions = [
    "Add 9:00 AM focus block to calendar",
    "Schedule lunch break at 12:30 PM",
    "Block 2:00 PM for deep work on API task",
  ];

  if (lower.includes("priorit")) {
    reply =
      "Here's what I'd prioritize today:\n\n1. Review quarterly goals (high priority, due 10 AM)\n2. Deep work: API integration (90 min focus block)\n3. Team standup at 11 AM\n4. Client emails (already done ✓)\n\nFocus on #1 and #2 before noon for maximum impact.";
  } else if (lower.includes("break")) {
    reply =
      "Suggested breaks for optimal focus:\n\n• 10:30 AM — 10 min (after first focus block)\n• 12:30 PM — 45 min lunch\n• 3:30 PM — 15 min afternoon break\n\nResearch shows breaks every 90 minutes improve sustained focus.";
    suggestions[0] = "Add 10:30 AM break reminder";
  } else if (lower.includes("focus block")) {
    reply =
      "Recommended focus blocks:\n\n• 9:00–10:30 AM — Quarterly goals review\n• 2:00–3:30 PM — API integration deep work\n\nEach block is 90 minutes with a 10-minute buffer. Want me to add these to your calendar?";
  }

  return NextResponse.json({ reply, suggestions });
}
