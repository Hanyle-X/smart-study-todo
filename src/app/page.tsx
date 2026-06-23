"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GoalProgressCard } from "@/components/dashboard/GoalProgressCard";
import { TodayOverviewCard } from "@/components/dashboard/TodayOverviewCard";
import { TaskList } from "@/components/tasks/TaskList";
import { Badge } from "@/components/ui/badge";
import { useAppStore } from "@/lib/app-store";
import { formatPercent } from "@/lib/utils";

export default function DashboardPage() {
  const { data, todayTasks } = useAppStore();
  const latestReview = data.reviews[0];
  const primaryGoals = data.goals.slice(0, 2);

  return (
    <div className="flex flex-col gap-6">
      <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <TodayOverviewCard />
        <Card>
          <CardHeader>
            <CardTitle>状态感知</CardTitle>
            <CardDescription>保留核心任务，慢慢推进。</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="rounded-[22px] bg-white/62 p-5">
              <p className="text-sm text-muted">最近复盘</p>
              <p className="mt-3 text-3xl font-semibold text-foreground">{latestReview ? formatPercent(latestReview.completionRate) : "0%"}</p>
              <p className="mt-2 text-sm leading-6 text-muted">{latestReview?.reflection ?? "今天不是重新做人，是重新调参。"}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge tone="blue">目标驱动</Badge>
              <Badge tone="green">动态调整</Badge>
              <Badge tone="orange">低压力节奏</Badge>
            </div>
          </CardContent>
        </Card>
      </section>
      <section className="grid gap-6 lg:grid-cols-2">
        {primaryGoals.map((goal) => (
          <GoalProgressCard key={goal.id} goal={goal} />
        ))}
      </section>
      <section>
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-foreground">今日任务</h2>
            <p className="mt-1 text-sm text-muted">系统根据长期目标、当前状态和最近完成情况生成。</p>
          </div>
          <Badge tone="blue">{todayTasks.length} 个任务</Badge>
        </div>
        <TaskList tasks={todayTasks} />
      </section>
    </div>
  );
}
