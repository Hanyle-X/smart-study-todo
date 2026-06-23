"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useAppStore } from "@/lib/app-store";
import type { Goal } from "@/lib/types";

export function GoalForm() {
  const { addGoal } = useAppStore();
  const [title, setTitle] = useState("");
  const [deadline, setDeadline] = useState("2026-12-20");
  const [targetDescription, setTargetDescription] = useState("");
  const [type, setType] = useState<Goal["type"]>("exam");
  const [priority, setPriority] = useState<Goal["priority"]>("medium");
  const [dailyAvailableHours, setDailyAvailableHours] = useState(2);

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (!title.trim()) return;
    addGoal({ title, type, deadline, targetDescription, dailyAvailableHours, priority });
    setTitle("");
    setTargetDescription("");
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-3">
      <Input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="长期目标，例如：考研英语 180 天强化" />
      <Textarea value={targetDescription} onChange={(event) => setTargetDescription(event.target.value)} placeholder="目标描述" />
      <div className="grid gap-3 sm:grid-cols-2">
        <Select value={type} onChange={(event) => setType(event.target.value as Goal["type"])}>
          <option value="exam">考试</option>
          <option value="study">学习</option>
          <option value="fitness">健康</option>
          <option value="project">项目</option>
          <option value="other">其他</option>
        </Select>
        <Select value={priority} onChange={(event) => setPriority(event.target.value as Goal["priority"])}>
          <option value="high">高优先级</option>
          <option value="medium">中优先级</option>
          <option value="low">低优先级</option>
        </Select>
        <Input type="date" value={deadline} onChange={(event) => setDeadline(event.target.value)} />
        <Input type="number" min={0.5} step={0.5} value={dailyAvailableHours} onChange={(event) => setDailyAvailableHours(Number(event.target.value))} />
      </div>
      <Button type="submit">创建目标</Button>
    </form>
  );
}
