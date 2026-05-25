"use client";

import { motion } from "framer-motion";
import { DailyPlanner } from "@/components/dashboard/DailyPlanner";
import { CalendarTimeBlocking } from "@/components/dashboard/CalendarTimeBlocking";
import { FocusModeCard } from "@/components/dashboard/FocusModeCard";
import { ProductivityStats } from "@/components/dashboard/ProductivityStats";
import { AIAssistant } from "@/components/dashboard/AIAssistant";
import { RemindersSection } from "@/components/dashboard/RemindersSection";
import { format, isMonday } from "date-fns";
import { useMounted } from "@/hooks/useMounted";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function DashboardPage() {
  const mounted = useMounted();
  const now = mounted ? new Date() : null;
  const greeting = now && isMonday(now) ? "morning" : "day";
  const dateLabel = now ? format(now, "MMMM d, yyyy") : "";

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-8">
      <motion.div variants={item}>
        <h1 className="text-3xl sm:text-4xl font-bold text-text-heading" suppressHydrationWarning>
          Good {mounted ? greeting : "day"} 👋
        </h1>
        <p className="text-text-body mt-1" suppressHydrationWarning>
          {mounted ? `${dateLabel} — Plan calmly, work intentionally.` : "\u00A0"}
        </p>
      </motion.div>

      <motion.div variants={item} className="grid gap-6 xl:grid-cols-2">
        <DailyPlanner />
        <FocusModeCard />
      </motion.div>

      <motion.div variants={item}>
        <CalendarTimeBlocking />
      </motion.div>

      <motion.div variants={item} className="grid gap-6 xl:grid-cols-2">
        <RemindersSection compact />
        <AIAssistant compact />
      </motion.div>

      <motion.div variants={item}>
        <ProductivityStats showCharts={false} />
      </motion.div>
    </motion.div>
  );
}
