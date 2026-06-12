import { describe, expect, it } from "vitest";
import {
  calculateNextStreak,
  createDailyActivity,
  getLearningStatus,
  getLocalDateKey,
  getSessionCorrectPercentage,
  getSessionStudiedCount,
} from "./learning";

const progress = (repetitions: number) => ({
  easiness: 2.5,
  interval: 1,
  repetitions,
  nextReviewDate: new Date().toISOString(),
});

describe("learning status", () => {
  it("uses the shared new/learning/learned/mastered thresholds", () => {
    expect(getLearningStatus(undefined)).toBe("new");
    expect(getLearningStatus(progress(0))).toBe("learning");
    expect(getLearningStatus(progress(2))).toBe("learning");
    expect(getLearningStatus(progress(3))).toBe("learned");
    expect(getLearningStatus(progress(6))).toBe("learned");
    expect(getLearningStatus(progress(7))).toBe("mastered");
  });
});

describe("daily streak", () => {
  it("starts at one and does not increment twice in one day", () => {
    expect(calculateNextStreak(undefined, "2026-06-12", 0)).toBe(1);
    expect(calculateNextStreak("2026-06-12", "2026-06-12", 4)).toBe(4);
  });

  it("increments across month and year boundaries", () => {
    expect(calculateNextStreak("2026-01-31", "2026-02-01", 2)).toBe(3);
    expect(calculateNextStreak("2026-12-31", "2027-01-01", 9)).toBe(10);
  });

  it("resets after a missed day", () => {
    expect(calculateNextStreak("2026-06-10", "2026-06-12", 8)).toBe(1);
  });

  it("creates a local date key without UTC rollover", () => {
    const instant = new Date("2026-01-02T18:00:00.000Z");
    expect(getLocalDateKey(instant, "Asia/Ho_Chi_Minh")).toBe("2026-01-03");
    expect(getLocalDateKey(instant, "America/Los_Angeles")).toBe("2026-01-02");
  });
});

describe("daily activity and legacy sessions", () => {
  it("counts each word only once per day", () => {
    const activity = createDailyActivity(
      "2026-06-12",
      "Asia/Ho_Chi_Minh",
      ["rec-01", "rec-02"],
      ["rec-02", "rec-03", "rec-03"],
      "2026-06-12T08:00:00.000Z",
    );
    expect(activity.wordIds).toEqual(["rec-01", "rec-02", "rec-03"]);
  });

  it("treats legacy quiz score 8/10 as 10 studied words, never 810", () => {
    const session = {
      id: "legacy",
      date: "2026-06-12T00:00:00.000Z",
      type: "quiz" as const,
      score: "8/10",
      details: "Hoàn thành bài kiểm tra (80%)",
    };
    expect(getSessionStudiedCount(session)).toBe(10);
    expect(getSessionCorrectPercentage(session)).toBe(80);
  });
});
