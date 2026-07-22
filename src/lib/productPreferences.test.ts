import { beforeEach, describe, expect, it } from "vitest";
import {
  getFavoriteWordIds,
  getReminderHour,
  getStudySessionSize,
  saveFavoriteWordIds,
  setReminderHour,
  setStudySessionSize,
} from "./productPreferences";

beforeEach(() => localStorage.clear());

describe("product preferences", () => {
  it("persists favorites without duplicates", () => {
    saveFavoriteWordIds(new Set(["rec-01", "rec-01", "rec-02"]));
    expect([...getFavoriteWordIds()]).toEqual(["rec-01", "rec-02"]);
  });

  it("accepts supported study sizes and falls back for invalid values", () => {
    setStudySessionSize(10);
    expect(getStudySessionSize()).toBe(10);
    localStorage.setItem("eng_master_study_size_v1", "99");
    expect(getStudySessionSize()).toBe(15);
  });

  it("persists a valid reminder hour", () => {
    expect(getReminderHour()).toBe(20);
    setReminderHour(7);
    expect(getReminderHour()).toBe(7);
    localStorage.setItem("eng_master_reminder_hour_v1", "32");
    expect(getReminderHour()).toBe(20);
  });
});
