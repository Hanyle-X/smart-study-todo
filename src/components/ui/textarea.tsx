import * as React from "react";
import { cn } from "@/lib/utils";

export const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        "min-h-24 w-full resize-none rounded-2xl border border-white/70 bg-white/70 px-4 py-3 text-sm text-foreground outline-none transition placeholder:text-muted/70 focus:border-primary/40 focus:bg-white focus:ring-4 focus:ring-primary/10",
        className
      )}
      {...props}
    />
  )
);
Textarea.displayName = "Textarea";
