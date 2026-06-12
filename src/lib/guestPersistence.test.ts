import { beforeEach, describe, expect, it } from "vitest";
import {
  activateGuestSession,
  clearGuestProgress,
  deactivateGuestSession,
  loadGuestSession,
  recordGuestSession,
  saveGuestProfile,
  saveGuestProgress,
} from "./guestPersistence";
import type { UserProfile } from "../types";

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
});
