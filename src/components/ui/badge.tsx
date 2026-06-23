import * as React from "react";
import { cn } from "@/lib/utils";

type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  tone?: "blue" | "green" | "orange" | "gray";
};

const tones = {
  blue: "bg-[#EAF4FF] text-primary",
  green: "bg-[#EAFBF0] text-[#16833D]",
  orange: "bg-[#FFF4E3] text-[#A95F00]",
  gray: "bg-white/70 text-muted"
};

export function Badge({ className, tone = "gray", ...props }: BadgeProps) {
  return (
    <span
      className={cn("inline-flex h-7 items-center rounded-full px-3 text-xs font-medium [&_svg]:size-3.5 [&_svg]:shrink-0", tones[tone], className)}
      {...props}
    />
  );
}
