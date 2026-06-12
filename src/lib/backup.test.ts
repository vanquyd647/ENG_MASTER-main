import { describe, expect, it } from "vitest";
import { VOCABULARY } from "../data/vocabulary";
import { createBackup, normalizeBackup } from "./backup";

const validProgress = {
  easiness: 2.5,
  interval: 1,
  repetitions: 1,
  nextReviewDate: "2026-06-13T00:00:00.000Z",
};

describe("backup schema", () => {
  it("creates version 2 backups", () => {
    const backup = createBackup(null, {
      [VOCABULARY[0].id]: validProgress,
    });
    expect(backup.version).toBe(2);
    expect(backup.progress[VOCABULARY[0].id]).toEqual(validProgress);
  });

  it("normalizes legacy version 1-shaped backups", () => {
    const backup = normalizeBackup({
      exportedAt: "2026-06-12T00:00:00.000Z",
      profile: { displayName: "Learner", uid: "untrusted", email: "bad" },
      progress: { [VOCABULARY[0].id]: validProgress },
    });
    expect(backup.version).toBe(2);
    expect(backup.profile).toEqual({ displayName: "Learner" });
  });

  it("rejects unknown word ids and invalid dates", () => {
    expect(() =>
      normalizeBackup({ progress: { unknown: validProgress } }),
    ).toThrow(/Unknown vocabulary id/);
    expect(() =>
      normalizeBackup({
        progress: {
          [VOCABULARY[0].id]: {
            ...validProgress,
            nextReviewDate: "not-a-date",
          },
        },
      }),
    ).toThrow(/invalid SRS/i);
  });

  it("validates structured history while accepting legacy score strings", () => {
    const backup = normalizeBackup({
      progress: {},
      profile: {
        history: [
          {
            id: "quiz-1",
            date: "2026-06-12T00:00:00.000Z",
            type: "quiz",
            score: "8/10",
            details: "Legacy quiz",
          },
        ],
      },
    });
    expect(backup.profile?.history?.[0].score).toBe("8/10");

    expect(() =>
      normalizeBackup({
        progress: {},
        profile: {
          history: [
            {
              id: "bad",
              date: "not-a-date",
              type: "quiz",
              details: "Broken",
              wordIds: ["unknown"],
            },
          ],
        },
      }),
    ).toThrow(/History item/);
  });
});
