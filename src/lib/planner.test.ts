import { describe, expect, it } from "vitest";
import { generateDailyPlan } from "./planner";
import type { DailyReview, DailyStatus, Goal, Module } from "./types";

const goal: Goal = {
  id: "goal-1",
  title: "考研英语强化",
  type: "exam",
  deadline: "2026-12-20",
  targetDescription: "完成词汇、阅读和写作复习",
  dailyAvailableHours: 3,
  priority: "high",
  createdAt: "2026-06-20T08:00:00.000Z"
};

const modules: Module[] = [
  {
    id: "module-high",
    goalId: "goal-1",
    name: "阅读真题",
    currentProgress: "2018 年",
    targetProgress: "2025 年",
    priority: "high",
    difficulty: 4
  },
  {
    id: "module-medium",
    goalId: "goal-1",
    name: "核心词汇",
    currentProgress: "Unit 12",
    targetProgress: "Unit 30",
    priority: "medium",
    difficulty: 3
  },
  {
    id: "module-low",
    goalId: "goal-1",
    name: "作文素材",
    currentProgress: "主题 2",
    targetProgress: "主题 10",
    priority: "low",
    difficulty: 2
  }
];

const status: DailyStatus = {
  id: "status-1",
  date: "2026-06-23",
  wakeUpTime: "07:30",
  sleepHours: 7,
  energyLevel: 4,
  availableHours: 3,
  stressLevel: 2,
  notes: "今天状态还可以"
};

function review(date: string, completionRate: number): DailyReview {
  return {
    id: `review-${date}`,
    date,
    completedTaskCount: Math.round(completionRate * 10),
    totalTaskCount: 10,
    completionRate,
    userFeeling: "normal"
  };
}

function feelingReview(date: string, completionRate: number, userFeeling: DailyReview["userFeeling"]): DailyReview {
  return {
    ...review(date, completionRate),
    userFeeling
  };
}

describe("generateDailyPlan", () => {
  it("increases planned minutes modestly after strong recent completion", () => {
    const strongPlan = generateDailyPlan(goal, modules, status, [
      review("2026-06-21", 0.9),
      review("2026-06-22", 0.85)
    ]);

    const neutralPlan = generateDailyPlan(goal, modules, status, [
      review("2026-06-21", 0.7),
      review("2026-06-22", 0.65)
    ]);

    const strongMinutes = strongPlan.reduce((sum, task) => sum + task.estimatedMinutes, 0);
    const neutralMinutes = neutralPlan.reduce((sum, task) => sum + task.estimatedMinutes, 0);

    expect(strongMinutes).toBeGreaterThan(neutralMinutes);
    expect(strongMinutes).toBeLessThanOrEqual(Math.round(neutralMinutes * 1.12));
  });

  it("reduces planned minutes when recent completion is below half", () => {
    const lowPlan = generateDailyPlan(goal, modules, status, [review("2026-06-22", 0.4)]);
    const neutralPlan = generateDailyPlan(goal, modules, status, [review("2026-06-22", 0.7)]);

    const lowMinutes = lowPlan.reduce((sum, task) => sum + task.estimatedMinutes, 0);
    const neutralMinutes = neutralPlan.reduce((sum, task) => sum + task.estimatedMinutes, 0);

    expect(lowMinutes).toBeLessThan(neutralMinutes);
    expect(lowMinutes).toBeLessThanOrEqual(Math.round(neutralMinutes * 0.85));
  });

  it("enters recovery mode after two low-completion days and keeps only core modules", () => {
    const plan = generateDailyPlan(goal, modules, status, [
      review("2026-06-21", 0.35),
      review("2026-06-22", 0.45)
    ]);

    expect(plan.length).toBeGreaterThan(0);
    expect(plan.every((task) => task.moduleId === "module-high")).toBe(true);
    expect(plan.every((task) => task.title.includes("保留核心任务"))).toBe(true);
  });

  it("allocates more work to high-priority modules than lower-priority modules", () => {
    const plan = generateDailyPlan(goal, modules, status, [review("2026-06-22", 0.7)]);

    const minutesByModule = new Map<string, number>();
    for (const task of plan) {
      minutesByModule.set(task.moduleId, (minutesByModule.get(task.moduleId) ?? 0) + task.estimatedMinutes);
    }

    expect(minutesByModule.get("module-high") ?? 0).toBeGreaterThan(minutesByModule.get("module-medium") ?? 0);
    expect(minutesByModule.get("module-medium") ?? 0).toBeGreaterThanOrEqual(minutesByModule.get("module-low") ?? 0);
  });

  it("lowers intensity when energy is low and stress is high", () => {
    const tiredStatus: DailyStatus = {
      ...status,
      energyLevel: 2,
      stressLevel: 5
    };

    const plan = generateDailyPlan(goal, modules, tiredStatus, [review("2026-06-22", 0.65)]);

    expect(plan.every((task) => task.difficulty <= 3)).toBe(true);
    expect(plan.some((task) => task.title.includes("慢慢推进"))).toBe(true);
  });

  it("reduces high-intensity work after an exhausted review", () => {
    const plan = generateDailyPlan(goal, modules, status, [
      feelingReview("2026-06-22", 0.7, "exhausted")
    ]);

    expect(plan.every((task) => task.difficulty <= 3)).toBe(true);
    expect(plan.some((task) => task.title.includes("慢慢推进"))).toBe(true);
  });
});
