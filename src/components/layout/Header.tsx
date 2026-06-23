"use client";

import { CalendarDays } from "lucide-react";
import { useAppStore } from "@/lib/app-store";
import { Badge } from "@/components/ui/badge";

export function Header() {
  const { today, todayStatus, todayTasks } = useAppStore();
  const done = todayTasks.filter((task) => task.status === "done").length;

  return (
    <header className="mb-8 flex flex-col gap-4 pt-6 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-sm font-medium text-muted">{today}</p>
        <h1 className="mt-1 text-3xl font-semibold leading-tight text-foreground sm:text-4xl">今天根据你的状态重新安排计划。</h1>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Badge tone="blue">
          <CalendarDays />
          <span className="ml-1">{todayStatus?.availableHours ?? 0}h 可用</span>
        </Badge>
        <Badge tone={done > 0 ? "green" : "gray"}>{done}/{todayTasks.length} 已完成</Badge>
      </div>
    </header>
  );
}
