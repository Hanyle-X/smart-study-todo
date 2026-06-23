"use client";

import { ClipboardList } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { Task } from "@/lib/types";
import { TaskCard } from "./TaskCard";

export function TaskList({ tasks }: { tasks: Task[] }) {
  if (tasks.length === 0) {
    return (
      <Card>
        <CardContent className="flex min-h-48 flex-col items-center justify-center text-center">
          <ClipboardList className="mb-3 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">还没有今日计划</h3>
          <p className="mt-2 max-w-sm text-sm leading-6 text-muted">先填写今日状态，系统会保留核心任务，慢慢推进。</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} />
      ))}
    </div>
  );
}
