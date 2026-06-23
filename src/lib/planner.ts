import type { DailyReview, DailyStatus, Difficulty, Goal, Module, Priority, Task } from "./types";

const priorityWeight: Record<Priority, number> = {
  high: 3,
  medium: 2,
  low: 1
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function toDifficulty(value: number): Difficulty {
  return clamp(Math.round(value), 1, 5) as Difficulty;
}

function orderedReviews(reviews: DailyReview[]) {
  return [...reviews].sort((a, b) => a.date.localeCompare(b.date));
}

function recentAverage(reviews: DailyReview[]) {
  if (reviews.length === 0) return 0.65;
  const recent = orderedReviews(reviews).slice(-3);
  return recent.reduce((sum, item) => sum + item.completionRate, 0) / recent.length;
}

function isRecoveryMode(reviews: DailyReview[]) {
  const recentTwo = orderedReviews(reviews).slice(-2);
  return recentTwo.length === 2 && recentTwo.every((item) => item.completionRate < 0.5);
}

function completionMultiplier(reviews: DailyReview[]) {
  const average = recentAverage(reviews);
  if (average > 0.8) return 1.08;
  if (average < 0.5) return 0.8;
  return 1;
}

function feelingMultiplier(reviews: DailyReview[]) {
  const latest = orderedReviews(reviews).at(-1);
  if (!latest) return 1;
  if (latest.userFeeling === "exhausted") return 0.78;
  if (latest.userFeeling === "bad") return 0.88;
  return 1;
}

function energyMultiplier(level: Difficulty) {
  return [0, 0.68, 0.82, 1, 1.05, 1.12][level] ?? 1;
}

function stressMultiplier(level: Difficulty) {
  return [0, 1.06, 1, 0.92, 0.82, 0.7][level] ?? 1;
}

function buildTaskTitle(module: Module, recoveryMode: boolean, lowIntensity: boolean) {
  if (recoveryMode) return `${module.name}：保留核心任务，慢慢推进`;
  if (lowIntensity) return `${module.name}：今天状态一般，慢慢推进`;
  return `${module.name}：按当前进度推进`;
}

export function generateDailyPlan(
  goal: Goal,
  modules: Module[],
  dailyStatus: DailyStatus,
  recentReviews: DailyReview[]
): Task[] {
  const availableMinutes = Math.max(30, Math.round(dailyStatus.availableHours * 60));
  const latestFeeling = orderedReviews(recentReviews).at(-1)?.userFeeling;
  const recoveryMode = isRecoveryMode(recentReviews);
  const lowIntensity = dailyStatus.energyLevel <= 2 || dailyStatus.stressLevel >= 4 || latestFeeling === "exhausted";
  const baseMinutes = availableMinutes
    * energyMultiplier(dailyStatus.energyLevel)
    * stressMultiplier(dailyStatus.stressLevel)
    * completionMultiplier(recentReviews)
    * feelingMultiplier(recentReviews)
    * (goal.priority === "high" ? 1 : goal.priority === "medium" ? 0.92 : 0.84)
    * (recoveryMode ? 0.46 : 1);

  const targetMinutes = clamp(Math.round(baseMinutes / 5) * 5, recoveryMode ? 25 : 40, availableMinutes + 25);
  const eligibleModules = modules
    .filter((module) => module.goalId === goal.id)
    .filter((module) => !recoveryMode || module.priority === "high")
    .sort((a, b) => priorityWeight[b.priority] - priorityWeight[a.priority] || b.difficulty - a.difficulty);

  if (eligibleModules.length === 0) return [];

  const weightedModules = eligibleModules.map((module) => {
    const difficultyOffset = lowIntensity ? Math.max(0, 5 - module.difficulty) * 0.12 : module.difficulty * 0.05;
    return {
      module,
      weight: priorityWeight[module.priority] + difficultyOffset
    };
  });
  const totalWeight = weightedModules.reduce((sum, item) => sum + item.weight, 0);

  let remaining = targetMinutes;
  return weightedModules.flatMap(({ module, weight }, index) => {
    const isLast = index === weightedModules.length - 1;
    const share = isLast ? remaining : Math.max(20, Math.round((targetMinutes * weight) / totalWeight / 5) * 5);
    remaining = Math.max(0, remaining - share);
    const chunkCount = share >= 70 && !recoveryMode ? 2 : 1;
    const chunkMinutes = Math.max(20, Math.round(share / chunkCount / 5) * 5);

    return Array.from({ length: chunkCount }, (_, taskIndex) => ({
      id: `${dailyStatus.date}-${goal.id}-${module.id}-${taskIndex + 1}`,
      goalId: goal.id,
      moduleId: module.id,
      date: dailyStatus.date,
      title: buildTaskTitle(module, recoveryMode, lowIntensity),
      estimatedMinutes: chunkMinutes,
      difficulty: toDifficulty(lowIntensity ? module.difficulty - 1 : module.difficulty),
      status: "todo" as const
    }));
  });
}
