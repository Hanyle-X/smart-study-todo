"use client";

import { Check, Coffee, HelpCircle, SkipForward } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAppStore } from "@/lib/app-store";
import type { Task } from "@/lib/types";

const statusLabel: Record<Task["status"], string> = {
  todo: "待安排",
  done: "完成",
  skipped: "跳过",
  too_hard: "太难",
  too_tired: "太累"
};

export function TaskCard({ task }: { task: Task }) {
  const { data, updateTaskStatus } = useAppStore();
  const studyModule = data.modules.find((item) => item.id === task.moduleId);
  const done = task.status === "done";

  return (
    <Card className="p-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone={done ? "green" : "blue"}>{statusLabel[task.status]}</Badge>
            <span className="text-xs font-medium text-muted">{task.estimatedMinutes} 分钟</span>
            <span className="text-xs font-medium text-muted">难度 {task.difficulty}</span>
          </div>
          <h3 className="mt-3 text-base font-semibold leading-6 text-foreground">{task.title}</h3>
          <p className="mt-1 text-sm text-muted">{studyModule?.currentProgress} → {studyModule?.targetProgress}</p>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:flex sm:shrink-0">
          <Button size="sm" variant={done ? "default" : "soft"} onClick={() => updateTaskStatus(task.id, "done")}>
            <Check data-icon="inline-start" />
            完成
          </Button>
          <Button size="sm" variant="secondary" onClick={() => updateTaskStatus(task.id, "skipped", "今天顺延")}>
            <SkipForward data-icon="inline-start" />
            跳过
          </Button>
          <Button size="sm" variant="secondary" onClick={() => updateTaskStatus(task.id, "too_hard", "降低难度")}>
            <HelpCircle data-icon="inline-start" />
            太难
          </Button>
          <Button size="sm" variant="secondary" onClick={() => updateTaskStatus(task.id, "too_tired", "降低强度")}>
            <Coffee data-icon="inline-start" />
            太累
          </Button>
        </div>
      </div>
    </Card>
  );
}
