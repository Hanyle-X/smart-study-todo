import { describe, expect, it } from "vitest";
import { navItems } from "./nav";

describe("navItems", () => {
  it("uses Chinese labels for the study planner navigation", () => {
    expect(navItems.map((item) => item.label)).toEqual(["首页", "目标", "今日", "复盘", "历史", "设置"]);
  });
});
