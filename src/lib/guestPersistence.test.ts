import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  activateGuestSession,
  clearGuestProgress,
  deactivateGuestSession,
  loadGuestSession,
  recordGuestSession,
  saveGuestProfile,
  saveGuestProgress,
  replaceGuestBackup,
} from "./guestPersistence";
import type { UserProfile } from "../types";
import { createBackup } from "./backup";
import { addCustomWord, deleteCustomWord, getCustomWords } from "./productPreferences";

const profile: UserProfile = {
  uid: "guest_test",
  email: "guest@local",
  displayName: "Guest",
  totalWordsLearned: 1,
  studyTimeMinutes: 0,
  streak: 0,
  dailyGoal: 15,
};

beforeEach(() => {
  localStorage.clear();
});

describe("guest persistence", () => {
  it("ends the session without deleting local profile or progress", () => {
    saveGuestProfile(profile);
    saveGuestProgress({
      "rec-01": {
        easiness: 2.5,
        interval: 1,
        repetitions: 1,
        nextReviewDate: "2026-06-13T00:00:00.000Z",
      },
    });
    activateGuestSession();
    deactivateGuestSession();

    const stored = loadGuestSession();
    expect(stored.active).toBe(false);
    expect(stored.profile?.uid).toBe("guest_test");
    expect(stored.progress["rec-01"]).toBeDefined();
  });

  it("resets progress and activity while retaining the guest profile", () => {
    saveGuestProfile(profile);
    saveGuestProgress({
      "rec-01": {
        easiness: 2.5,
        interval: 1,
        repetitions: 1,
        nextReviewDate: "2026-06-13T00:00:00.000Z",
      },
    });
    clearGuestProgress();

    const stored = loadGuestSession();
    expect(stored.profile?.uid).toBe("guest_test");
    expect(stored.progress).toEqual({});
    expect(stored.activities).toEqual({});
  });

  it("merges unique word ids and increments streak only on the next day", () => {
    const first = recordGuestSession({
      profile,
      log: {
        id: "one",
        date: "2026-06-12T03:00:00.000Z",
        type: "quiz",
        details: "Quiz",
      },
      wordIds: ["rec-01", "rec-01", "rec-02"],
      timeZone: "Asia/Ho_Chi_Minh",
    });
    const sameDay = recordGuestSession({
      profile: first.profile,
      log: {
        id: "two",
        date: "2026-06-12T08:00:00.000Z",
        type: "review",
        details: "Review",
      },
      wordIds: ["rec-02", "rec-03"],
      timeZone: "Asia/Ho_Chi_Minh",
    });

    expect(sameDay.activity.wordIds).toEqual(["rec-01", "rec-02", "rec-03"]);
    expect(sameDay.profile.streak).toBe(1);
  });

  it("records a stable session only once and omits undefined optional fields", () => {
    const input = { profile, log: { id: "once", date: "2026-10-13T00:00:00.000Z", type: "review" as const, details: "Review", correctCount: undefined }, wordIds: ["rec-01"] };
    const first = recordGuestSession(input);
    const again = recordGuestSession({ ...input, profile: first.profile });
    expect(again.profile.history!).toHaveLength(1);
    expect(again.profile.history![0]).not.toHaveProperty("correctCount");
  });

  it("restores custom definitions before using their progress on a clean catalog", () => {
    const word = addCustomWord({ word: "guest restore term", meaning: "từ cá nhân", phonetic: "", pos: "noun", example: "", exampleTranslation: "" });
    const progress = { [word.id]: { easiness: 2.5, interval: 1, repetitions: 1, nextReviewDate: "2026-10-14T00:00:00.000Z" } };
    const backup = createBackup(profile, progress);
    deleteCustomWord(word.id);
    localStorage.clear();
    replaceGuestBackup(profile, backup);
    expect(getCustomWords()[0]).toEqual(word);
    expect(loadGuestSession().progress).toEqual(progress);
    expect(loadGuestSession().profile!.totalWordsLearned).toBe(1);
    deleteCustomWord(word.id);
  });

  it("rolls back the guest profile when the second local restore write fails", () => {
    saveGuestProfile(profile);
    const oldProgress = { "rec-02": { easiness: 2.5, interval: 1, repetitions: 1, nextReviewDate: "2026-10-14T00:00:00.000Z" } };
    saveGuestProgress(oldProgress);
    const backup = createBackup({ ...profile, displayName: "Imported" }, { "rec-01": oldProgress["rec-02"] });
    const setter = localStorage.setItem.bind(localStorage);
    const spy = vi.spyOn(localStorage, "setItem").mockImplementation(setter).mockImplementationOnce(setter).mockImplementationOnce(() => { throw new Error("storage full"); });
    try {
      expect(() => replaceGuestBackup(profile, backup)).toThrow(/storage full/);
      expect(loadGuestSession().profile).toEqual(profile);
      expect(loadGuestSession().progress).toEqual(oldProgress);
    } finally { spy.mockRestore(); }
  });
});
