import type { StudyData } from "./types";

export const STORAGE_KEY = "study-planner-data";

export const defaultStudyData: StudyData = {
  goals: [],
  modules: [],
  dailyStatuses: [],
  tasks: [],
  reviews: [],
  settings: {
    dailyReminder: true,
    planningStyle: "balanced",
    defaultAvailableHours: 2
  }
};

export function loadStudyData(): StudyData {
  if (typeof window === "undefined") return defaultStudyData;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultStudyData;
    const parsed = JSON.parse(raw) as Partial<StudyData>;

    return {
      goals: Array.isArray(parsed.goals) ? parsed.goals : [],
      modules: Array.isArray(parsed.modules) ? parsed.modules : [],
      dailyStatuses: Array.isArray(parsed.dailyStatuses) ? parsed.dailyStatuses : [],
      tasks: Array.isArray(parsed.tasks) ? parsed.tasks : [],
      reviews: Array.isArray(parsed.reviews) ? parsed.reviews : [],
      settings: {
        ...defaultStudyData.settings,
        ...(parsed.settings ?? {})
      }
    };
  } catch {
    return defaultStudyData;
  }
}

export function saveStudyData(data: StudyData) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}
