"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { Play, Pause, Square, Flame, Clock, Volume2 } from "lucide-react";
import { Card } from "@/components/common/Card";
import { Button } from "@/components/common/Button";
import { useFocusSession } from "@/hooks/useFocusSession";
import { useAppStore } from "@/store/store";
import type { AmbientSound } from "@/types";
import { cn } from "@/lib/utils";

const SOUNDS: { id: AmbientSound; label: string }[] = [
  { id: "off", label: "Off" },
  { id: "forest", label: "Forest" },
  { id: "rain", label: "Rain" },
  { id: "ocean", label: "Ocean" },
  { id: "cafe", label: "Café" },
];

export function FocusModeCard({ large = false }: { large?: boolean }) {
  const {
    focusRunning,
    minutes,
    seconds,
    progress,
    currentTask,
    todaySessions,
    totalFocusHours,
    startFocus,
    pauseFocus,
    stopFocus,
    setFocusDuration,
    focusDuration,
  } = useFocusSession();

  const ambientSound = useAppStore((s) => s.ambientSound);
  const setAmbientSound = useAppStore((s) => s.setAmbientSound);
  const [showCelebration, setShowCelebration] = useState(false);
  const focusSecondsLeft = useAppStore((s) => s.focusSecondsLeft);

  useEffect(() => {
    if (focusSecondsLeft === 0 && !focusRunning && todaySessions > 0) {
      setShowCelebration(true);
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      const t = setTimeout(() => setShowCelebration(false), 3000);
      return () => clearTimeout(t);
    }
  }, [focusSecondsLeft, focusRunning, todaySessions]);

  const circumference = 2 * Math.PI * 90;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <Card className={cn(large && "min-w-[400px]")}>
      <h3 className="text-lg font-semibold text-text-heading mb-6">Focus Mode</h3>

      <div className="flex flex-col items-center">
        <div className="relative w-48 h-48 mb-6">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 200 200">
            <circle cx="100" cy="100" r="90" fill="none" stroke="var(--border)" strokeWidth="4" />
            <circle
              cx="100"
              cy="100"
              r="90"
              fill="none"
              stroke="var(--primary)"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className="transition-all duration-1000"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl font-bold text-text-heading tabular-nums">
              {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
            </span>
            <span className="text-sm text-text-muted mt-1">remaining</span>
          </div>
        </div>

        {currentTask ? (
          <div className="text-center mb-6">
            <p className="text-xs text-text-muted uppercase tracking-wide">Current task</p>
            <p className="text-lg font-semibold text-text-heading mt-1">{currentTask.title}</p>
            <p className="text-sm text-text-muted mt-1">Stay focused — you&apos;ve got this.</p>
          </div>
        ) : (
          <p className="text-sm text-text-muted mb-6 text-center">
            Select a task or start a general focus session
          </p>
        )}

        <div className="flex items-center gap-3 mb-6">
          {!focusRunning ? (
            <Button variant="accent" size="lg" onClick={() => startFocus(currentTask?.id)}>
              <Play className="w-5 h-5" /> Start
            </Button>
          ) : (
            <Button variant="secondary" size="lg" onClick={pauseFocus}>
              <Pause className="w-5 h-5" /> Pause
            </Button>
          )}
          <Button variant="outline" size="md" onClick={stopFocus}>
            <Square className="w-4 h-4" /> Stop
          </Button>
        </div>

        <div className="flex items-center gap-2 mb-6">
          <label className="text-sm text-text-muted">Duration:</label>
          <select
            value={focusDuration}
            onChange={(e) => setFocusDuration(Number(e.target.value))}
            className="px-3 py-1.5 rounded-lg border border-border bg-background text-sm"
            disabled={focusRunning}
          >
            {[15, 25, 45, 60].map((m) => (
              <option key={m} value={m}>{m} min</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2 w-full mb-4">
          <Volume2 className="w-4 h-4 text-text-muted shrink-0" />
          <div className="flex flex-wrap gap-1">
            {SOUNDS.map((s) => (
              <button
                key={s.id}
                onClick={() => setAmbientSound(s.id)}
                className={cn(
                  "px-2.5 py-1 rounded-lg text-xs font-medium transition-all",
                  ambientSound === s.id
                    ? "bg-primary text-white"
                    : "bg-background text-text-muted hover:text-text-heading"
                )}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 w-full pt-4 border-t border-border">
          <div className="text-center">
            <Flame className="w-5 h-5 text-warning mx-auto mb-1" />
            <p className="text-lg font-bold text-text-heading">{todaySessions}</p>
            <p className="text-xs text-text-muted">Sessions today</p>
          </div>
          <div className="text-center">
            <Clock className="w-5 h-5 text-primary mx-auto mb-1" />
            <p className="text-lg font-bold text-text-heading">{totalFocusHours}h</p>
            <p className="text-xs text-text-muted">Focus hours</p>
          </div>
          <div className="text-center">
            <Flame className="w-5 h-5 text-danger mx-auto mb-1" />
            <p className="text-lg font-bold text-text-heading">5</p>
            <p className="text-xs text-text-muted">Day streak</p>
          </div>
        </div>

        {showCelebration && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 text-center text-success font-medium"
          >
            Session complete! Take a well-deserved break.
          </motion.p>
        )}
      </div>
    </Card>
  );
}
