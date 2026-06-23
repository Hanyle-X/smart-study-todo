import { beforeEach, describe, expect, it } from "vitest";
import { buildInitialData } from "./app-store";

describe("buildInitialData", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("returns a populated seed plan when no saved planner data exists", () => {
    const data = buildInitialData();

    expect(data.goals).toHaveLength(1);
    expect(data.dailyStatuses).toHaveLength(1);
    expect(data.tasks.length).toBeGreaterThan(0);
    expect(data.goals[0].title).toBe("考研英语 180 天强化");
  });
});
