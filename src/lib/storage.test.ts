import { beforeEach, describe, expect, it } from "vitest";
import { loadStudyData, saveStudyData } from "./storage";
import type { StudyData } from "./types";

const emptyData: StudyData = {
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

describe("storage helpers", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("returns a safe default shape when localStorage is empty", () => {
    expect(loadStudyData()).toEqual(emptyData);
  });

  it("saves and reloads study data from localStorage", () => {
    const data: StudyData = {
      ...emptyData,
      goals: [
        {
          id: "goal-1",
          title: "CPA 备考",
          type: "exam",
          deadline: "2026-10-01",
          targetDescription: "完成会计和审计复习",
          dailyAvailableHours: 2,
          priority: "high",
          createdAt: "2026-06-23T00:00:00.000Z"
        }
      ]
    };

    saveStudyData(data);

    expect(loadStudyData()).toEqual(data);
  });

  it("falls back to defaults when stored JSON is invalid", () => {
    localStorage.setItem("study-planner-data", "{bad json");

    expect(loadStudyData()).toEqual(emptyData);
  });
});
