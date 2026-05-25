"use client";

import { useEffect } from "react";
import { useAuth } from "./AuthProvider";
import { fetchUserData } from "@/lib/db";
import { useAppStore } from "@/store/store";

export function DataProvider({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  useEffect(() => {
    if (loading) return;

    const { hydrateFromDb, resetUserData } = useAppStore.getState();

    if (!user) {
      resetUserData();
      return;
    }

    let cancelled = false;

    (async () => {
      try {
        const data = await fetchUserData(user.id);
        if (cancelled) return;
        hydrateFromDb({
          tasks: data.tasks,
          reminders: data.reminders,
          focusSessions: data.focusSessions,
          preferences: data.preferences,
        });
      } catch (err) {
        console.error("Failed to load data from Supabase:", err);
        if (!cancelled) resetUserData();
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [user, loading]);

  return <>{children}</>;
}
