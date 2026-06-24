import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderToString } from "react-dom/server";
import { buildInitialData } from "./app-store";
import { AppStoreProvider, useAppStore } from "./app-store";
import { STORAGE_KEY } from "./storage";

function TodayProbe() {
  const { today } = useAppStore();
  return <span>{today}</span>;
}

describe("buildInitialData", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("returns a populated seed plan when no saved planner data exists", () => {
    const data = buildInitialData("2026-06-24");

    expect(data.goals).toHaveLength(1);
    expect(data.dailyStatuses).toHaveLength(1);
    expect(data.dailyStatuses[0].date).toBe("2026-06-24");
    expect(data.tasks.length).toBeGreaterThan(0);
    expect(data.goals[0].title).toBe("考研英语 180 天强化");
  });

  it("creates a fresh today status and plan when saved data is from an earlier date", () => {
    const oldData = buildInitialData("2026-06-23");
    localStorage.setItem(STORAGE_KEY, JSON.stringify(oldData));

    const data = buildInitialData("2026-06-24");

    expect(data.dailyStatuses.some((status) => status.date === "2026-06-24")).toBe(true);
    expect(data.tasks.some((task) => task.date === "2026-06-24")).toBe(true);
  });

  it("refreshes saved today tasks when split chunks have duplicate titles", () => {
    const oldData = buildInitialData("2026-06-24");
    const duplicatedTasks = oldData.tasks.map((task) => ({
      ...task,
      title: task.title.replace(/（第 \d+ 段）$/, "")
    }));
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...oldData, tasks: duplicatedTasks }));

    const data = buildInitialData("2026-06-24");
    const readingTasks = data.tasks.filter((task) => task.moduleId === "module-seed-1");

    expect(readingTasks.length).toBeGreaterThan(1);
    expect(new Set(readingTasks.map((task) => task.title)).size).toBe(readingTasks.length);
  });

  it("keeps the first render stable across server and browser dates", () => {
    vi.setSystemTime(new Date("2026-06-23T08:00:00+08:00"));
    const serverHtml = renderToString(
      <AppStoreProvider>
        <TodayProbe />
      </AppStoreProvider>
    );

    vi.setSystemTime(new Date("2026-06-24T08:00:00+08:00"));
    const browserHtml = renderToString(
      <AppStoreProvider>
        <TodayProbe />
      </AppStoreProvider>
    );

    expect(browserHtml).toBe(serverHtml);
  });
});
