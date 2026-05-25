import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export function Card({ children, className, hover = true }: CardProps) {
  return (
    <div
      className={cn(
        "bg-card rounded-2xl shadow-md p-6 border border-border/60",
        hover && "hover:shadow-lg transition-all duration-300",
        className
      )}
    >
      {children}
    </div>
  );
}
