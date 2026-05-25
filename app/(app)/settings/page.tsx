"use client";

import { Card } from "@/components/common/Card";
import { Button } from "@/components/common/Button";
import { useTheme } from "@/hooks/useTheme";
import { useAppStore } from "@/store/store";
import { useFocusSession } from "@/hooks/useFocusSession";
import { useSync } from "@/hooks/useSync";

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const { setFocusDuration, focusDuration } = useFocusSession();
  const ambientSound = useAppStore((s) => s.ambientSound);
  const setAmbientSound = useAppStore((s) => s.setAmbientSound);
  const { syncPreferences } = useSync();

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold text-text-heading">Settings</h1>
        <p className="text-text-body mt-1">Customize your FlowDay experience.</p>
      </div>

      <Card>
        <h2 className="text-lg font-semibold text-text-heading mb-4">Appearance</h2>
        <div className="flex gap-3">
          {(["light", "dark"] as const).map((t) => (
            <Button
              key={t}
              variant={theme === t ? "primary" : "outline"}
              onClick={() => setTheme(t)}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </Button>
          ))}
        </div>
      </Card>

      <Card>
        <h2 className="text-lg font-semibold text-text-heading mb-4">Focus</h2>
        <label className="block text-sm text-text-body mb-2">Default focus duration (minutes)</label>
        <select
          value={focusDuration}
          onChange={(e) => setFocusDuration(Number(e.target.value))}
          className="px-4 py-2 rounded-xl border border-border bg-background"
        >
          {[15, 25, 45, 60, 90].map((m) => (
            <option key={m} value={m}>{m} minutes</option>
          ))}
        </select>
      </Card>

      <Card>
        <h2 className="text-lg font-semibold text-text-heading mb-4">Ambient sound default</h2>
        <select
          value={ambientSound}
          onChange={(e) => {
            const v = e.target.value as typeof ambientSound;
            setAmbientSound(v);
            syncPreferences({ ambientSound: v });
          }}
          className="px-4 py-2 rounded-xl border border-border bg-background capitalize"
        >
          {["off", "forest", "rain", "ocean", "cafe"].map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </Card>

      <Card>
        <h2 className="text-lg font-semibold text-text-heading mb-4">Account</h2>
        <p className="text-sm text-text-muted mb-4">Your data is stored securely in Supabase.</p>
        <Button variant="outline">Export data</Button>
      </Card>
    </div>
  );
}
