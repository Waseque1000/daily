import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn("rounded-xl bg-border/60 animate-pulse-soft", className)}
      aria-hidden
    />
  );
}

export function DashboardSkeleton() {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Skeleton className="h-80" />
      <Skeleton className="h-80" />
      <Skeleton className="h-64 lg:col-span-2" />
    </div>
  );
}
