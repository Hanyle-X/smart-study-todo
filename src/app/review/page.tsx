"use client";

import { FormEvent, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { useAppStore } from "@/lib/app-store";
import type { DailyReview } from "@/lib/types";

export default function ReviewPage() {
  const { saveReview, todayTasks } = useAppStore();
  const [userFeeling, setUserFeeling] = useState<DailyReview["userFeeling"]>("normal");
  const [reflection, setReflection] = useState("");
  const done = todayTasks.filter((task) => task.status === "done").length;
  const rate = todayTasks.length === 0 ? 0 : (done / todayTasks.length) * 100;

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    saveReview({ userFeeling, reflection });
    setReflection("");
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
      <Card>
        <CardHeader>
          <CardTitle>每日复盘</CardTitle>
          <CardDescription>复盘不是评分，是给明天更好的参数。</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-5">
          <div>
            <p className="text-5xl font-semibold text-foreground">{Math.round(rate)}%</p>
            <p className="mt-2 text-sm text-muted">{done}/{todayTasks.length} 个任务已完成</p>
            <Progress value={rate} className="mt-4" />
          </div>
          <form onSubmit={onSubmit} className="flex flex-col gap-3">
            <Select value={userFeeling} onChange={(event) => setUserFeeling(event.target.value as DailyReview["userFeeling"])}>
              <option value="good">感觉不错</option>
              <option value="normal">一般稳定</option>
              <option value="bad">状态偏低</option>
              <option value="exhausted">需要恢复</option>
            </Select>
            <Textarea value={reflection} onChange={(event) => setReflection(event.target.value)} placeholder="今天有什么值得保留或调整？" />
            <Button type="submit">生成复盘</Button>
          </form>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>温和建议</CardTitle>
          <CardDescription>系统会用最近完成率调整明天任务量。</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2">
          <Insight title="完成得不错" body="如果连续稳定超过 80%，明天可以稍微加一点。" />
          <Insight title="状态一般" body="保持任务量，不急着证明什么。" />
          <Insight title="完成率偏低" body="明天减少约 20%，优先保留高优先级模块。" />
          <Insight title="连续偏低" body="进入恢复模式，只安排核心任务。" />
        </CardContent>
      </Card>
    </div>
  );
}

function Insight({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-[22px] bg-white/62 p-5">
      <h3 className="font-semibold text-foreground">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-muted">{body}</p>
    </div>
  );
}
