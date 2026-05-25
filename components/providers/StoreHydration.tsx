"use client";

import { useEffect } from "react";
import { useAppStore } from "@/store/store";

/** Rehydrates persisted Zustand state on the client without blocking the UI. */
export function StoreHydration({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    useAppStore.persist.rehydrate();
  }, []);

  return <>{children}</>;
}
