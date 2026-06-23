"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sparkles } from "lucide-react";
import { navItems } from "./nav";
import { cn } from "@/lib/utils";

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-5 top-5 hidden h-[calc(100vh-40px)] w-64 flex-col rounded-[28px] border border-white/70 bg-white/48 p-4 shadow-[0_18px_55px_rgba(0,0,0,0.05)] backdrop-blur-2xl lg:flex">
      <div className="mb-7 flex items-center gap-3 px-2 pt-2">
        <div className="flex size-10 items-center justify-center rounded-2xl bg-primary text-white shadow-[0_12px_24px_rgba(0,122,255,0.24)]">
          <Sparkles />
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">StudyTune</p>
          <p className="text-xs text-muted">今天不是重新做人</p>
        </div>
      </div>
      <nav className="flex flex-col gap-1">
        {navItems.map((item) => {
          const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "apple-control flex h-11 items-center gap-3 rounded-2xl px-3 text-sm font-medium text-muted [&_svg]:size-5",
                active && "bg-[#EAF4FF] text-primary"
              )}
            >
              <Icon />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto rounded-[22px] bg-white/60 p-4">
        <p className="text-sm font-medium text-foreground">重新调参</p>
        <p className="mt-1 text-xs leading-5 text-muted">系统会根据真实状态调整计划，不用和昨天较劲。</p>
      </div>
    </aside>
  );
}
