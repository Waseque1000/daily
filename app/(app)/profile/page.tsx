"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Card } from "@/components/common/Card";
import { Input } from "@/components/common/Input";
import { Button } from "@/components/common/Button";
import { useProfile } from "@/components/providers/ProfileProvider";
import { useToast } from "@/components/common/Toast";
import { User } from "lucide-react";

export default function ProfilePage() {
  const { profile, updateProfile, loading } = useProfile();
  const toast = useToast();
  const [fullName, setFullName] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setFullName(profile.fullName ?? "");
      setBio(profile.bio ?? "");
      setAvatarUrl(profile.avatarUrl ?? "");
    }
  }, [profile]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfile({
        fullName: fullName.trim(),
        bio: bio.trim() || undefined,
        avatarUrl: avatarUrl.trim() || undefined,
      });
      toast.add("Profile updated", "success");
    } catch {
      toast.add("Failed to save profile", "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading && !profile) {
    return (
      <div className="max-w-xl mx-auto animate-pulse-soft">
        <div className="h-8 w-48 bg-border rounded-lg mb-8" />
        <div className="h-64 bg-border rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-text-heading">Edit profile</h1>
        <p className="text-text-body mt-1">Update how you appear across FlowDay.</p>
      </div>

      <Card>
        <form onSubmit={handleSave} className="space-y-6">
          <div className="flex items-center gap-4">
            {avatarUrl ? (
              <Image
                src={avatarUrl}
                alt=""
                width={72}
                height={72}
                className="w-[72px] h-[72px] rounded-2xl object-cover border border-border"
                unoptimized
              />
            ) : (
              <div className="w-[72px] h-[72px] rounded-2xl bg-primary/10 flex items-center justify-center">
                <User className="w-8 h-8 text-primary" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm text-text-muted">Email</p>
              <p className="font-medium text-text-heading truncate">{profile?.email}</p>
            </div>
          </div>

          <Input
            label="Full name"
            id="fullName"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Your name"
          />

          <Input
            label="Avatar URL"
            id="avatarUrl"
            value={avatarUrl}
            onChange={(e) => setAvatarUrl(e.target.value)}
            placeholder="https://..."
          />
          <p className="text-xs text-text-muted -mt-4">
            Paste an image URL, or use your Google photo after signing in with Google.
          </p>

          <div>
            <label htmlFor="bio" className="block text-sm font-medium text-text-body mb-1.5">
              Bio
            </label>
            <textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              placeholder="A short note about you..."
              className="w-full px-4 py-3 rounded-xl border border-border bg-background text-text-heading placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
            />
          </div>

          <Button type="submit" size="lg" disabled={saving}>
            {saving ? "Saving..." : "Save profile"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
