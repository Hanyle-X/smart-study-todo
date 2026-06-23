import * as React from "react";
import { cn } from "@/lib/utils";

export function SegmentGroup({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("inline-flex rounded-full bg-white/60 p-1", className)} {...props} />;
}

export function SegmentButton({
  className,
  active,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { active?: boolean }) {
  return (
    <button
      className={cn(
        "h-8 rounded-full px-4 text-xs font-medium text-muted transition",
        active && "bg-white text-foreground shadow-[0_4px_14px_rgba(0,0,0,0.06)]",
        className
      )}
      {...props}
    />
  );
}
