"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { GoalForm } from "@/components/goals/GoalForm";
import { ModuleForm } from "@/components/goals/ModuleForm";
import { GoalProgressCard } from "@/components/dashboard/GoalProgressCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useAppStore } from "@/lib/app-store";

export default function GoalsPage() {
  return (
    <Suspense fallback={null}>
      <GoalsContent />
    </Suspense>
  );
}

function GoalsContent() {
  const searchParams = useSearchParams();
  const { data } = useAppStore();
  const selectedGoalId = searchParams.get("goalId");
  const selectedGoal = selectedGoalId ? data.goals.find((goal) => goal.id === selectedGoalId) : undefined;
  const selectedModules = selectedGoalId ? data.modules.filter((module) => module.goalId === selectedGoalId) : [];

  if (selectedGoalId) {
    if (!selectedGoal) {
      return (
        <Card>
          <CardContent className="p-8">
            <p className="text-muted">没有找到这个目标。</p>
            <Button asChild className="mt-4">
              <Link href="/goals">返回目标</Link>
            </Button>
          </CardContent>
        </Card>
      );
    }

    return (
      <div className="flex flex-col gap-6">
        <Button asChild variant="ghost" className="w-fit px-0">
          <Link href="/goals">
            <ArrowLeft data-icon="inline-start" />
            返回目标
          </Link>
        </Button>
        <section className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
          <Card>
            <CardHeader>
              <CardTitle>{selectedGoal.title}</CardTitle>
              <CardDescription>{selectedGoal.targetDescription}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="grid gap-3 sm:grid-cols-3">
                <Info label="截止日期" value={selectedGoal.deadline} />
                <Info label="每日时间" value={`${selectedGoal.dailyAvailableHours}h`} />
                <Info label="优先级" value={selectedGoal.priority} />
              </div>
              <Progress value={selectedModules.length * 16} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>添加学习模块</CardTitle>
              <CardDescription>模块会影响任务分配和强度调整。</CardDescription>
            </CardHeader>
            <CardContent>
              <ModuleForm goalId={selectedGoal.id} />
            </CardContent>
          </Card>
        </section>
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {selectedModules.map((module) => (
            <Card key={module.id}>
              <CardHeader>
                <div className="flex items-start justify-between gap-3">
                  <CardTitle>{module.name}</CardTitle>
                  <Badge tone={module.priority === "high" ? "blue" : "gray"}>{module.priority}</Badge>
                </div>
                <CardDescription>难度 {module.difficulty}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-6 text-muted">{module.currentProgress} → {module.targetProgress}</p>
              </CardContent>
            </Card>
          ))}
        </section>
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
      <Card>
        <CardHeader>
          <CardTitle>创建长期目标</CardTitle>
          <CardDescription>目标越清晰，今日计划越容易温和地推进。</CardDescription>
        </CardHeader>
        <CardContent>
          <GoalForm />
        </CardContent>
      </Card>
      <div className="flex flex-col gap-4">
        {data.goals.map((goal) => (
          <GoalProgressCard key={goal.id} goal={goal} />
        ))}
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[20px] bg-white/62 p-4">
      <p className="text-xs text-muted">{label}</p>
      <p className="mt-2 text-base font-semibold text-foreground">{value}</p>
    </div>
  );
}
