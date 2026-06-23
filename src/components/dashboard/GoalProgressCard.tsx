"use client";

import Link from "next/link";
import { ArrowRight, Target } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useAppStore } from "@/lib/app-store";
import type { Goal } from "@/lib/types";

export function GoalProgressCard({ goal }: { goal: Goal }) {
  const { data } = useAppStore();
  const modules = data.modules.filter((module) => module.goalId === goal.id);
  const tasks = data.tasks.filter((task) => task.goalId === goal.id);
  const done = tasks.filter((task) => task.status === "done").length;
  const progress = tasks.length === 0 ? modules.length * 12 : (done / tasks.length) * 100;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle>{goal.title}</CardTitle>
            <CardDescription>{goal.targetDescription}</CardDescription>
          </div>
          <Badge tone={goal.priority === "high" ? "blue" : "gray"}>{goal.priority}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-3 rounded-[20px] bg-white/62 p-4">
          <Target className="text-primary" />
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-4 text-sm">
              <span className="font-medium text-foreground">{modules.length} 个模块</span>
              <span className="text-muted">{goal.deadline}</span>
            </div>
            <Progress value={progress} className="mt-3" />
          </div>
        </div>
        <Link href={`/goals?goalId=${goal.id}`} className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-primary">
          查看目标
          <ArrowRight />
        </Link>
      </CardContent>
    </Card>
  );
}
