"use client";

import { useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import {
  Search,
  Bell,
  Moon,
  Sun,
  Menu,
} from "lucide-react";
import { Logo } from "./Logo";
import { UserMenu } from "./UserMenu";
import { useTheme } from "@/hooks/useTheme";
import { useMounted } from "@/hooks/useMounted";
import { cn } from "@/lib/utils";

interface NavbarProps {
  variant?: "app" | "marketing";
  onMenuClick?: () => void;
}

export function Navbar({ variant = "app", onMenuClick }: NavbarProps) {
  const { theme, toggleTheme } = useTheme();
  const [searchOpen, setSearchOpen] = useState(false);
  const mounted = useMounted();
  const today = mounted ? format(new Date(), "EEEE, MMMM d") : "";

  if (variant === "marketing") {
    return (
      <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Logo />
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-text-body">
            <Link href="/features" className="hover:text-primary transition-colors">Features</Link>
            <Link href="/pricing" className="hover:text-primary transition-colors">Pricing</Link>
            <Link href="/blog" className="hover:text-primary transition-colors">Blog</Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm font-medium text-text-body hover:text-primary px-3 py-2">
              Log in
            </Link>
            <Link
              href="/signup"
              className="text-sm font-medium bg-accent text-text-heading px-4 py-2 rounded-xl hover:shadow-md hover:scale-[1.02] transition-all"
            >
              Start Free
            </Link>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-30 bg-card/80 backdrop-blur-md border-b border-border">
      <div className="h-16 px-4 sm:px-6 flex items-center gap-4">
        <button
          className="lg:hidden p-2 rounded-lg text-text-muted hover:bg-background"
          onClick={onMenuClick}
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:block lg:hidden">
          <Logo showText={false} />
        </div>

        <div className="flex-1 max-w-md mx-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input
              type="search"
              placeholder="Search tasks, events..."
              className={cn(
                "w-full pl-10 pr-4 py-2.5 rounded-xl bg-background border border-border text-sm",
                "focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all",
                searchOpen && "ring-2 ring-primary/30"
              )}
              onFocus={() => setSearchOpen(true)}
              onBlur={() => setSearchOpen(false)}
              aria-label="Search"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <span className="hidden md:block text-sm text-text-muted font-medium" suppressHydrationWarning>
            {today}
          </span>
          <button
            className="p-2.5 rounded-xl text-text-muted hover:bg-background relative"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-accent rounded-full" />
          </button>
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-xl text-text-muted hover:bg-background transition-colors"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          <UserMenu />
        </div>
      </div>
    </header>
  );
}
