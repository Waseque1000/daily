import Link from "next/link";
import { Sparkles } from "lucide-react";
import { APP_NAME } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  showText?: boolean;
}

export function Logo({ className, showText = true }: LogoProps) {
  return (
    <Link href="/" className={cn("flex items-center gap-2 group", className)}>
      <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
        <Sparkles className="w-5 h-5 text-white" />
      </div>
      {showText && (
        <span className="text-xl font-bold text-text-heading tracking-tight">
          {APP_NAME}
        </span>
      )}
    </Link>
  );
}
