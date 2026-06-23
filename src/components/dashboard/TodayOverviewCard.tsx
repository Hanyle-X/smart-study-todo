"use client";

import { Activity, BatteryMedium, Clock, Wind } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useAppStore } from "@/lib/app-store";

export function TodayOverviewCard() {
  const { activeGoal, generatePlanForGoal, todayStatus, todayTasks } = useAppStore();
  const done = todayTasks.filter((task) => task.status === "done").length;
  const rate = todayTasks.length === 0 ? 0 : (done / todayTasks.length) * 100;

  return (
    <Card className="min-h-[300px]">
      <CardHeader>
        <CardTitle>今日计划</CardTitle>
        <CardDescription>今天根据你的状态重新安排计划。</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <div>
          <div className="flex items-end justify-between">
            <div>
              <p className="text-5xl font-semibold leading-none text-foreground">{Math.round(rate)}%</p>
              <p className="mt-2 text-sm text-muted">完成率</p>
            </div>
            <Button disabled={!activeGoal || !todayStatus} onClick={() => activeGoal && generatePlanForGoal(activeGoal.id)}>
              重新生成
            </Button>
          </div>
          <Progress value={rate} className="mt-5" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Metric icon={Clock} label="可用时间" value={`${todayStatus?.availableHours ?? 0}h`} />
          <Metric icon={BatteryMedium} label="精力" value={`${todayStatus?.energyLevel ?? 0}/5`} />
          <Metric icon={Wind} label="压力" value={`${todayStatus?.stressLevel ?? 0}/5`} />
          <Metric icon={Activity} label="任务" value={`${todayTasks.length} 个`} />
        </div>
      </CardContent>
    </Card>
  );
}

function Metric({ icon: Icon, label, value }: { icon: typeof Clock; label: string; value: string }) {
  return (
    <div className="rounded-[20px] bg-white/62 p-4">
      <Icon className="text-primary" />
      <p className="mt-3 text-xs font-medium text-muted">{label}</p>
      <p className="mt-1 text-lg font-semibold text-foreground">{value}</p>
    </div>
  );
}
