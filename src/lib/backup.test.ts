import { beforeEach, describe, expect, it } from "vitest";
import { VOCABULARY } from "../data/vocabulary";
import { createBackup, mergeBackup, normalizeBackup, parseBackupText, parseProgressCsv } from "./backup";
import { addCustomWord, deleteCustomWord, saveFavoriteWordIds, setStudySessionSize } from "./productPreferences";

beforeEach(() => localStorage.clear());

const validProgress = {
  easiness: 2.5,
  interval: 1,
  repetitions: 1,
  nextReviewDate: "2026-06-13T00:00:00.000Z",
};

describe("backup schema", () => {
  it("creates version 3 backups with personal data", () => {
    const backup = createBackup(null, {
      [VOCABULARY[0].id]: validProgress,
    });
    expect(backup.version).toBe(3);
    expect(backup.progress[VOCABULARY[0].id]).toEqual(validProgress);
  });

  it("restores a newly added custom word on a clean catalog", () => {
    const word = addCustomWord({ word: "test personal term", meaning: "từ cá nhân", phonetic: "", pos: "noun", example: "", exampleTranslation: "" });
    saveFavoriteWordIds(new Set([word.id]));
    setStudySessionSize(5);
    const backup = createBackup(null, { [word.id]: validProgress });
    deleteCustomWord(word.id);
    localStorage.clear();
    const restored = normalizeBackup(JSON.parse(JSON.stringify(backup)));
    expect(restored.version).toBe(3);
    if (restored.version !== 3) throw new Error("wrong version");
    expect(restored.customWords[0]).toEqual(word);
    expect(restored.progress[word.id]).toEqual(validProgress);
    expect(restored.favorites).toEqual([word.id]);
    expect(restored.preferences.studySessionSize).toBe(5);
  });

  it("reads legacy custom IDs from the current catalog rather than an import-time snapshot", () => {
    const word = addCustomWord({ word: "legacy personal", meaning: "cá nhân", phonetic: "", pos: "noun", example: "", exampleTranslation: "" });
    try { expect(normalizeBackup({ version: 2, progress: { [word.id]: validProgress } }).progress[word.id]).toEqual(validProgress); }
    finally { deleteCustomWord(word.id); }
  });

  it("rejects duplicate custom IDs and invalid preferences without modifying storage", () => {
    const word = addCustomWord({ word: "duplicate term", meaning: "cá nhân", phonetic: "", pos: "noun", example: "", exampleTranslation: "" });
    const backup = createBackup(null, {});
    const before = localStorage.getItem("eng_master_custom_words_v1");
    expect(() => normalizeBackup({ ...backup, customWords: [word, word] })).toThrow(/duplicate|trùng/);
    expect(() => normalizeBackup({ ...backup, preferences: { ...backup.preferences, reminderHour: 24 } })).toThrow(/preferences/);
    expect(localStorage.getItem("eng_master_custom_words_v1")).toBe(before);
    deleteCustomWord(word.id);
  });

  it("merges progress and keeps current preferences", () => {
    const current = createBackup(null, { [VOCABULARY[0].id]: validProgress });
    const imported = normalizeBackup({ progress: { [VOCABULARY[1].id]: validProgress } });
    expect(Object.keys(mergeBackup(current, imported).progress)).toHaveLength(2);
  });

  it("validates every CSV row and reports its line", () => {
    const header = "wordId,easiness,interval,repetitions,nextReviewDate,lastReviewDate,wrongCount";
    const row = `"${VOCABULARY[0].id}",2.5,1,1,2026-10-14T00:00:00.000Z,,0`;
    expect(parseProgressCsv(`${header}\n${row}`).progress[VOCABULARY[0].id]).toEqual({ ...validProgress, nextReviewDate: "2026-10-14T00:00:00.000Z", wrongCount: 0 });
    expect(() => parseProgressCsv(`${header}\n${row}\nunknown,2.5,1,1,2026-10-14T00:00:00.000Z,,0`)).toThrow(/Dòng 3/);
    expect(() => parseProgressCsv(`${header}\n${row.replace(",2.5,", ",NaN,")}`)).toThrow(/Dòng 2/);
    expect(() => parseProgressCsv(`${header}\n${row}\n${row}`)).toThrow(/ID trùng/);
    expect(() => parseProgressCsv(header)).toThrow(/1–10.000/);
    expect(() => parseProgressCsv(`${header}\n"unclosed`)).toThrow(/ngoặc kép/);
    expect(() => parseBackupText("not JSON")).toThrow(/JSON/);
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
