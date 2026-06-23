"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { useAppStore } from "@/lib/app-store";
import type { Difficulty, Module } from "@/lib/types";

export function ModuleForm({ goalId }: { goalId: string }) {
  const { addModule } = useAppStore();
  const [name, setName] = useState("");
  const [currentProgress, setCurrentProgress] = useState("");
  const [targetProgress, setTargetProgress] = useState("");
  const [priority, setPriority] = useState<Module["priority"]>("medium");
  const [difficulty, setDifficulty] = useState<Difficulty>(3);

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (!name.trim()) return;
    addModule({ goalId, name, currentProgress, targetProgress, priority, difficulty });
    setName("");
    setCurrentProgress("");
    setTargetProgress("");
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-3">
      <Input value={name} onChange={(event) => setName(event.target.value)} placeholder="模块名称，例如：阅读真题" />
      <div className="grid gap-3 sm:grid-cols-2">
        <Input value={currentProgress} onChange={(event) => setCurrentProgress(event.target.value)} placeholder="当前进度" />
        <Input value={targetProgress} onChange={(event) => setTargetProgress(event.target.value)} placeholder="目标进度" />
        <Select value={priority} onChange={(event) => setPriority(event.target.value as Module["priority"])}>
          <option value="high">高优先级</option>
          <option value="medium">中优先级</option>
          <option value="low">低优先级</option>
        </Select>
        <Select value={difficulty} onChange={(event) => setDifficulty(Number(event.target.value) as Difficulty)}>
          <option value={1}>难度 1</option>
          <option value={2}>难度 2</option>
          <option value={3}>难度 3</option>
          <option value={4}>难度 4</option>
          <option value={5}>难度 5</option>
        </Select>
      </div>
      <Button type="submit" variant="soft">添加模块</Button>
    </form>
  );
}
