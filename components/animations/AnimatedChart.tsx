"use client";

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const weeklyHours = [
  { day: "Mon", hours: 4.2 },
  { day: "Tue", hours: 5.1 },
  { day: "Wed", hours: 3.8 },
  { day: "Thu", hours: 6.0 },
  { day: "Fri", hours: 4.5 },
  { day: "Sat", hours: 2.0 },
  { day: "Sun", hours: 1.5 },
];

const weeklyTasks = [
  { day: "Mon", tasks: 8 },
  { day: "Tue", tasks: 12 },
  { day: "Wed", tasks: 6 },
  { day: "Thu", tasks: 14 },
  { day: "Fri", tasks: 10 },
  { day: "Sat", tasks: 3 },
  { day: "Sun", tasks: 2 },
];

export function WeeklyHoursChart() {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={weeklyHours}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
        <XAxis dataKey="day" tick={{ fill: "var(--text-muted)", fontSize: 12 }} />
        <YAxis tick={{ fill: "var(--text-muted)", fontSize: 12 }} />
        <Tooltip
          contentStyle={{
            background: "var(--card)",
            border: "1px solid var(--border)",
            borderRadius: "12px",
          }}
        />
        <Line
          type="monotone"
          dataKey="hours"
          stroke="var(--primary)"
          strokeWidth={2}
          dot={{ fill: "var(--primary)" }}
          animationDuration={600}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function WeeklyTasksChart() {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={weeklyTasks}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
        <XAxis dataKey="day" tick={{ fill: "var(--text-muted)", fontSize: 12 }} />
        <YAxis tick={{ fill: "var(--text-muted)", fontSize: 12 }} />
        <Tooltip
          contentStyle={{
            background: "var(--card)",
            border: "1px solid var(--border)",
            borderRadius: "12px",
          }}
        />
        <Bar dataKey="tasks" fill="var(--primary)" radius={[6, 6, 0, 0]} animationDuration={600} />
      </BarChart>
    </ResponsiveContainer>
  );
}
