"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navItems } from "./nav";
import { cn } from "@/lib/utils";

export function MobileNav() {
  const pathname = usePathname();
  const compactItems = navItems.slice(0, 5);

  return (
    <nav className="fixed inset-x-3 bottom-3 z-20 grid grid-cols-5 rounded-[26px] border border-white/70 bg-white/78 p-2 shadow-[0_14px_34px_rgba(0,0,0,0.12)] backdrop-blur-2xl lg:hidden">
      {compactItems.map((item) => {
        const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn("flex h-12 flex-col items-center justify-center gap-1 rounded-2xl text-[10px] font-medium text-muted [&_svg]:size-5", active && "bg-[#EAF4FF] text-primary")}
          >
            <Icon />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
