export type Priority = "low" | "medium" | "high";
export type Difficulty = 1 | 2 | 3 | 4 | 5;

export type Goal = {
  id: string;
  title: string;
  type: "exam" | "study" | "fitness" | "project" | "other";
  deadline: string;
  targetDescription: string;
  dailyAvailableHours: number;
  priority: Priority;
  createdAt: string;
};

export type Module = {
  id: string;
  goalId: string;
  name: string;
  currentProgress: string;
  targetProgress: string;
  priority: Priority;
  difficulty: Difficulty;
};

export type DailyStatus = {
  id: string;
  date: string;
  wakeUpTime: string;
  sleepHours: number;
  energyLevel: Difficulty;
  availableHours: number;
  stressLevel: Difficulty;
  notes?: string;
};

export type Task = {
  id: string;
  goalId: string;
  moduleId: string;
  date: string;
  title: string;
  estimatedMinutes: number;
  difficulty: Difficulty;
  status: "todo" | "done" | "skipped" | "too_hard" | "too_tired";
  reason?: string;
};

export type DailyReview = {
  id: string;
  date: string;
  completedTaskCount: number;
  totalTaskCount: number;
  completionRate: number;
  userFeeling: "good" | "normal" | "bad" | "exhausted";
  reflection?: string;
};

export type Settings = {
  dailyReminder: boolean;
  planningStyle: "gentle" | "balanced" | "focused";
  defaultAvailableHours: number;
};

export type StudyData = {
  goals: Goal[];
  modules: Module[];
  dailyStatuses: DailyStatus[];
  tasks: Task[];
  reviews: DailyReview[];
  settings: Settings;
};
