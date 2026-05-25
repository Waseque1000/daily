"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { User, Settings, LogOut, Pencil } from "lucide-react";
import { useProfile } from "@/components/providers/ProfileProvider";
import { useAuth } from "@/components/providers/AuthProvider";
import { cn } from "@/lib/utils";

export function UserMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { profile, displayName } = useProfile();
  const { signOut } = useAuth();

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 p-1.5 pr-3 rounded-xl hover:bg-background transition-colors"
        aria-label="User menu"
        aria-expanded={open}
      >
        {profile?.avatarUrl ? (
          <Image
            src={profile.avatarUrl}
            alt=""
            width={32}
            height={32}
            className="w-8 h-8 rounded-full object-cover"
            unoptimized
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-semibold text-primary">
            {initials || <User className="w-4 h-4" />}
          </div>
        )}
        <span className="hidden sm:block text-sm font-medium text-text-heading max-w-[120px] truncate">
          {displayName}
        </span>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-56 py-2 bg-card rounded-2xl border border-border shadow-lg z-50 animate-fade-in">
          <div className="px-4 py-3 border-b border-border">
            <p className="font-medium text-text-heading truncate">{displayName}</p>
            <p className="text-xs text-text-muted truncate">{profile?.email}</p>
          </div>
          <nav className="py-1">
            <MenuLink href="/profile" icon={Pencil} onClick={() => setOpen(false)}>
              Edit profile
            </MenuLink>
            <MenuLink href="/settings" icon={Settings} onClick={() => setOpen(false)}>
              Settings
            </MenuLink>
          </nav>
          <div className="border-t border-border pt-1">
            <button
              type="button"
              onClick={async () => {
                setOpen(false);
                await signOut();
                window.location.href = "/login";
              }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-text-body hover:bg-danger/5 hover:text-danger transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Log out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function MenuLink({
  href,
  icon: Icon,
  children,
  onClick,
}: {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 px-4 py-2.5 text-sm text-text-body",
        "hover:bg-background hover:text-text-heading transition-colors"
      )}
    >
      <Icon className="w-4 h-4 text-primary" />
      {children}
    </Link>
  );
}
