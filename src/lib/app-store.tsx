"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { generateDailyPlan } from "./planner";
import { defaultStudyData, loadStudyData, saveStudyData } from "./storage";
import type { DailyReview, DailyStatus, Goal, Module, Settings, StudyData, Task } from "./types";
import { todayKey, uid } from "./utils";

type AppStore = {
  data: StudyData;
  today: string;
  todayStatus?: DailyStatus;
  todayTasks: Task[];
  activeGoal?: Goal;
  addGoal: (goal: Omit<Goal, "id" | "createdAt">) => Goal;
  addModule: (module: Omit<Module, "id">) => Module;
  saveDailyStatus: (status: Omit<DailyStatus, "id" | "date"> & { date?: string }) => DailyStatus;
  generatePlanForGoal: (goalId: string, statusOverride?: DailyStatus) => Task[];
  updateTaskStatus: (taskId: string, status: Task["status"], reason?: string) => void;
  saveReview: (review: Omit<DailyReview, "id" | "date" | "completedTaskCount" | "totalTaskCount" | "completionRate"> & { date?: string }) => DailyReview;
  updateSettings: (settings: Settings) => void;
  resetData: () => void;
};

const StoreContext = createContext<AppStore | null>(null);

const initialRenderDate = "2026-06-23";

const seedData: StudyData = {
  goals: [
    {
      id: "goal-seed-1",
      title: "考研英语 180 天强化",
      type: "exam",
      deadline: "2026-12-20",
      targetDescription: "完成阅读真题、核心词汇和作文素材复盘",
      dailyAvailableHours: 3,
      priority: "high",
      createdAt: "2026-06-20T08:00:00.000Z"
    }
  ],
  modules: [
    {
      id: "module-seed-1",
      goalId: "goal-seed-1",
      name: "阅读真题",
      currentProgress: "2018 年 Text 2",
      targetProgress: "2025 年全套",
      priority: "high",
      difficulty: 4
    },
    {
      id: "module-seed-2",
      goalId: "goal-seed-1",
      name: "核心词汇",
      currentProgress: "Unit 12",
      targetProgress: "Unit 30",
      priority: "medium",
      difficulty: 3
    },
    {
      id: "module-seed-3",
      goalId: "goal-seed-1",
      name: "作文素材",
      currentProgress: "主题 2",
      targetProgress: "主题 10",
      priority: "low",
      difficulty: 2
    }
  ],
  dailyStatuses: [
    {
      id: "status-seed-1",
      date: initialRenderDate,
      wakeUpTime: "07:30",
      sleepHours: 7,
      energyLevel: 4,
      availableHours: 3,
      stressLevel: 2,
      notes: "今天根据你的状态重新安排计划。"
    }
  ],
  tasks: [],
  reviews: [
    {
      id: "review-seed-1",
      date: "2026-06-21",
      completedTaskCount: 3,
      totalTaskCount: 4,
      completionRate: 0.75,
      userFeeling: "normal",
      reflection: "保留核心任务，节奏比较稳。"
    },
    {
      id: "review-seed-2",
      date: "2026-06-22",
      completedTaskCount: 4,
      totalTaskCount: 5,
      completionRate: 0.8,
      userFeeling: "good",
      reflection: "完成得不错，明天可以稍微加一点。"
    }
  ],
  settings: defaultStudyData.settings
};

function buildSeedData(date = todayKey()): StudyData {
  const seedStatus = { ...seedData.dailyStatuses[0], date };
  const seedGoal = seedData.goals[0];

  return {
    ...seedData,
    dailyStatuses: [seedStatus],
    tasks: generateDailyPlan(seedGoal, seedData.modules, seedStatus, seedData.reviews)
  };
}

function hasDuplicateTaskTitles(tasks: Task[]) {
  const seen = new Set<string>();
  for (const task of tasks) {
    const key = `${task.moduleId}:${task.title}`;
    if (seen.has(key)) return true;
    seen.add(key);
  }
  return false;
}

function ensureTodayData(data: StudyData, date: string): StudyData {
  if (data.goals.length === 0) return data;

  const existingStatus = data.dailyStatuses.find((item) => item.date === date);
  const status: DailyStatus =
    existingStatus ?? {
      id: `status-${date}`,
      date,
      wakeUpTime: "07:30",
      sleepHours: 7,
      energyLevel: 4,
      availableHours: data.settings.defaultAvailableHours,
      stressLevel: 2,
      notes: "今天根据你的状态重新安排计划。"
    };
  const activeGoal = data.goals[0];
  const todayGoalTasks = data.tasks.filter((task) => task.date === date && task.goalId === activeGoal.id);
  const hasTodayTasks = todayGoalTasks.length > 0;
  const shouldRefreshPlan = !hasTodayTasks || hasDuplicateTaskTitles(todayGoalTasks);
  if (existingStatus && !shouldRefreshPlan) return data;

  const modules = data.modules.filter((module) => module.goalId === activeGoal.id);
  const tasks = shouldRefreshPlan
    ? [...data.tasks.filter((task) => task.date !== date || task.goalId !== activeGoal.id), ...generateDailyPlan(activeGoal, modules, status, data.reviews)]
    : data.tasks;

  return {
    ...data,
    dailyStatuses: [status, ...data.dailyStatuses.filter((item) => item.date !== date)],
    tasks
  };
}

export function buildInitialData(date = todayKey()) {
  const loaded = loadStudyData();
  if (loaded.goals.length > 0 || loaded.modules.length > 0 || loaded.tasks.length > 0 || loaded.reviews.length > 0) {
    return ensureTodayData(loaded, date);
  }
  return buildSeedData(date);
}

export function AppStoreProvider({ children }: { children: React.ReactNode }) {
  const [today, setToday] = useState(initialRenderDate);
  const [data, setData] = useState<StudyData>(() => buildSeedData(initialRenderDate));
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const currentDate = todayKey();
    setToday(currentDate);
    setData(buildInitialData(currentDate));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) saveStudyData(data);
  }, [data, hydrated]);

  const value = useMemo<AppStore>(() => {
    const todayStatus = data.dailyStatuses.find((item) => item.date === today);
    const todayTasks = data.tasks.filter((task) => task.date === today);
    const activeGoal = data.goals[0];

    return {
      data,
      today,
      todayStatus,
      todayTasks,
      activeGoal,
      addGoal(goalInput) {
        const goal: Goal = {
          ...goalInput,
          id: uid("goal"),
          createdAt: new Date().toISOString()
        };
        setData((current) => ({
          ...current,
          goals: [goal, ...current.goals]
        }));
        return goal;
      },
      addModule(moduleInput) {
        const studyModule: Module = {
          ...moduleInput,
          id: uid("module")
        };
        setData((current) => ({
          ...current,
          modules: [...current.modules, studyModule]
        }));
        return studyModule;
      },
      saveDailyStatus(statusInput) {
        const date = statusInput.date ?? today;
        const status: DailyStatus = {
          ...statusInput,
          date,
          id: uid("status")
        };
        setData((current) => ({
          ...current,
          dailyStatuses: [status, ...current.dailyStatuses.filter((item) => item.date !== date)]
        }));
        return status;
      },
      generatePlanForGoal(goalId, statusOverride) {
        const goal = data.goals.find((item) => item.id === goalId);
        const status = statusOverride ?? data.dailyStatuses.find((item) => item.date === today);
        if (!goal || !status) return [];
        const modules = data.modules.filter((module) => module.goalId === goalId);
        const tasks = generateDailyPlan(goal, modules, status, data.reviews);
        setData((current) => ({
          ...current,
          tasks: [...current.tasks.filter((task) => task.date !== today || task.goalId !== goalId), ...tasks]
        }));
        return tasks;
      },
      updateTaskStatus(taskId, status, reason) {
        setData((current) => ({
          ...current,
          tasks: current.tasks.map((task) => (task.id === taskId ? { ...task, status, reason } : task)),
          modules:
            status === "too_hard"
              ? current.modules.map((module) => {
                  const task = current.tasks.find((item) => item.id === taskId);
                  if (!task || task.moduleId !== module.id) return module;
                  return { ...module, difficulty: Math.max(1, module.difficulty - 1) as Module["difficulty"] };
                })
              : current.modules
        }));
      },
      saveReview(reviewInput) {
        const date = reviewInput.date ?? today;
        const buildReview = (tasks: Task[]): DailyReview => {
          const completedTaskCount = tasks.filter((task) => task.status === "done").length;
          const totalTaskCount = tasks.length;
          const userFeeling =
            tasks.some((task) => task.status === "too_tired") && reviewInput.userFeeling === "normal"
              ? "exhausted"
              : reviewInput.userFeeling;
          return {
            ...reviewInput,
            userFeeling,
            id: uid("review"),
            date,
            completedTaskCount,
            totalTaskCount,
            completionRate: totalTaskCount === 0 ? 0 : completedTaskCount / totalTaskCount
          };
        };
        const optimisticReview = buildReview(data.tasks.filter((task) => task.date === date));
        setData((current) => {
          const tasks = current.tasks.filter((task) => task.date === date);
          const review = buildReview(tasks);
          return {
            ...current,
            reviews: [review, ...current.reviews.filter((item) => item.date !== date)]
          };
        });
        return optimisticReview;
      },
      updateSettings(settings) {
        setData((current) => ({ ...current, settings }));
      },
      resetData() {
        setData(buildSeedData(today));
      }
    };
  }, [data, today]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useAppStore() {
  const context = useContext(StoreContext);
  if (!context) throw new Error("useAppStore must be used within AppStoreProvider");
  return context;
}
