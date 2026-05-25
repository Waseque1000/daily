"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthProvider";
import { fetchProfile, updateProfile as updateProfileDb } from "@/lib/db";
import type { UserProfile } from "@/types/profile";

interface ProfileContextValue {
  profile: UserProfile | null;
  loading: boolean;
  refreshProfile: () => Promise<void>;
  updateProfile: (updates: {
    fullName?: string;
    avatarUrl?: string;
    bio?: string;
  }) => Promise<UserProfile>;
  displayName: string;
}

const ProfileContext = createContext<ProfileContextValue>({
  profile: null,
  loading: true,
  refreshProfile: async () => {},
  updateProfile: async () => ({ userId: "", fullName: "User" }),
  displayName: "You",
});

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const { user, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshProfile = useCallback(async () => {
    if (!user) {
      setProfile(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const data = await fetchProfile(user.id, user.email);
      setProfile(data);
    } catch (err) {
      console.error("Failed to load profile:", err);
      setProfile({
        userId: user.id,
        fullName: user.user_metadata?.full_name ?? user.email?.split("@")[0] ?? "User",
        avatarUrl: user.user_metadata?.avatar_url ?? user.user_metadata?.picture,
        email: user.email,
      });
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (authLoading) return;
    refreshProfile();
  }, [authLoading, refreshProfile]);

  const updateProfile = async (updates: {
    fullName?: string;
    avatarUrl?: string;
    bio?: string;
  }) => {
    if (!user) throw new Error("Not signed in");
    const updated = await updateProfileDb(user.id, updates, user.email);
    setProfile(updated);
    return updated;
  };

  const displayName =
    profile?.fullName ||
    user?.user_metadata?.full_name ||
    user?.email?.split("@")[0] ||
    "You";

  return (
    <ProfileContext.Provider
      value={{ profile, loading, refreshProfile, updateProfile, displayName }}
    >
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  return useContext(ProfileContext);
}
