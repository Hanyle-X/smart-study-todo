"use client";

import { FormEvent, useEffect, useState } from "react";
import { Sparkles } from "lucide-react";
import { TaskList } from "@/components/tasks/TaskList";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useAppStore } from "@/lib/app-store";
import type { Difficulty } from "@/lib/types";

export default function TodayPage() {
  const { activeGoal, generatePlanForGoal, saveDailyStatus, todayStatus, todayTasks } = useAppStore();
  const [wakeUpTime, setWakeUpTime] = useState(todayStatus?.wakeUpTime ?? "07:30");
  const [sleepHours, setSleepHours] = useState(todayStatus?.sleepHours ?? 7);
  const [energyLevel, setEnergyLevel] = useState<Difficulty>(todayStatus?.energyLevel ?? 3);
  const [stressLevel, setStressLevel] = useState<Difficulty>(todayStatus?.stressLevel ?? 2);
  const [availableHours, setAvailableHours] = useState(todayStatus?.availableHours ?? 2);
  const [notes, setNotes] = useState(todayStatus?.notes ?? "");

  useEffect(() => {
    if (!todayStatus) return;
    setWakeUpTime(todayStatus.wakeUpTime);
    setSleepHours(todayStatus.sleepHours);
    setEnergyLevel(todayStatus.energyLevel);
    setStressLevel(todayStatus.stressLevel);
    setAvailableHours(todayStatus.availableHours);
    setNotes(todayStatus.notes ?? "");
  }, [todayStatus]);

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    const status = saveDailyStatus({ wakeUpTime, sleepHours, energyLevel, stressLevel, availableHours, notes });
    if (activeGoal) generatePlanForGoal(activeGoal.id, status);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
      <Card>
        <CardHeader>
          <CardTitle>填写今日状态</CardTitle>
          <CardDescription>计划会根据睡眠、精力、压力和可用时间重新调参。</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="flex flex-col gap-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <Input type="time" value={wakeUpTime} onChange={(event) => setWakeUpTime(event.target.value)} />
              <Input type="number" min={0} step={0.5} value={sleepHours} onChange={(event) => setSleepHours(Number(event.target.value))} placeholder="睡眠时长" />
              <Select value={energyLevel} onChange={(event) => setEnergyLevel(Number(event.target.value) as Difficulty)}>
                <option value={1}>精力 1</option>
                <option value={2}>精力 2</option>
                <option value={3}>精力 3</option>
                <option value={4}>精力 4</option>
                <option value={5}>精力 5</option>
              </Select>
              <Select value={stressLevel} onChange={(event) => setStressLevel(Number(event.target.value) as Difficulty)}>
                <option value={1}>压力 1</option>
                <option value={2}>压力 2</option>
                <option value={3}>压力 3</option>
                <option value={4}>压力 4</option>
                <option value={5}>压力 5</option>
              </Select>
            </div>
            <Input type="number" min={0.5} step={0.5} value={availableHours} onChange={(event) => setAvailableHours(Number(event.target.value))} placeholder="今天可用学习时间" />
            <Textarea value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="今天有什么需要系统照顾的状态？" />
            <Button type="submit">
              <Sparkles data-icon="inline-start" />
              保存状态并生成计划
            </Button>
          </form>
        </CardContent>
      </Card>
      <section>
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-foreground">今日任务</h2>
          <p className="mt-1 text-sm text-muted">标记太难或太累后，系统会在下一次计划里降低强度。</p>
        </div>
        <TaskList tasks={todayTasks} />
      </section>
    </div>
  );
}
