import { NextResponse } from "next/server";

export async function GET() {
  const events = [
    {
      id: "meet-1",
      title: "Team standup",
      startHour: 11,
      startMinute: 0,
      durationMinutes: 30,
      isMeeting: true,
    },
    {
      id: "meet-2",
      title: "1:1 with manager",
      startHour: 16,
      startMinute: 0,
      durationMinutes: 30,
      isMeeting: true,
    },
  ];
  return NextResponse.json(events);
}
