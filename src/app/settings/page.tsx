"use client";

import { FormEvent, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { useAppStore } from "@/lib/app-store";
import type { Settings } from "@/lib/types";

export default function SettingsPage() {
  const { data, resetData, updateSettings } = useAppStore();
  const [planningStyle, setPlanningStyle] = useState<Settings["planningStyle"]>(data.settings.planningStyle);
  const [defaultAvailableHours, setDefaultAvailableHours] = useState(data.settings.defaultAvailableHours);
  const [dailyReminder, setDailyReminder] = useState(data.settings.dailyReminder);

  useEffect(() => {
    setPlanningStyle(data.settings.planningStyle);
    setDefaultAvailableHours(data.settings.defaultAvailableHours);
    setDailyReminder(data.settings.dailyReminder);
  }, [data.settings]);

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    updateSettings({ planningStyle, defaultAvailableHours, dailyReminder });
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
      <Card>
        <CardHeader>
          <CardTitle>设置</CardTitle>
          <CardDescription>调整默认节奏，不需要一次到位。</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="flex flex-col gap-3">
            <Select value={planningStyle} onChange={(event) => setPlanningStyle(event.target.value as Settings["planningStyle"])}>
              <option value="gentle">温和</option>
              <option value="balanced">平衡</option>
              <option value="focused">专注</option>
            </Select>
            <Input type="number" min={0.5} step={0.5} value={defaultAvailableHours} onChange={(event) => setDefaultAvailableHours(Number(event.target.value))} />
            <label className="flex min-h-12 items-center justify-between rounded-2xl bg-white/62 px-4 text-sm font-medium text-foreground">
              每日提醒
              <input type="checkbox" checked={dailyReminder} onChange={(event) => setDailyReminder(event.target.checked)} className="size-5 accent-[#007AFF]" />
            </label>
            <Button type="submit">保存设置</Button>
          </form>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>本地数据</CardTitle>
          <CardDescription>所有数据都保存在当前浏览器的 localStorage。</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="grid gap-3 sm:grid-cols-3">
            <Stat label="目标" value={data.goals.length} />
            <Stat label="模块" value={data.modules.length} />
            <Stat label="复盘" value={data.reviews.length} />
          </div>
          <Button variant="secondary" onClick={resetData}>恢复示例数据</Button>
        </CardContent>
      </Card>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-[22px] bg-white/62 p-5">
      <p className="text-sm text-muted">{label}</p>
      <p className="mt-2 text-3xl font-semibold text-foreground">{value}</p>
    </div>
  );
}
