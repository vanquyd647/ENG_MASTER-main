import { beforeEach, describe, expect, it, vi } from "vitest";
import { VOCABULARY } from "../data/vocabulary";
import { createBackup } from "./backup";
import type { UserProfile } from "../types";

const memory = vi.hoisted(() => ({ docs: new Map<string, any>(), commit: 0, failCommitAt: 0 }));
vi.mock("./firebase", () => ({ db: {} }));
vi.mock("firebase/firestore", () => {
  const snapshot = (path: string) => ({ ref: { path }, id: path.split("/").at(-1), exists: () => memory.docs.has(path), data: () => memory.docs.get(path) });
  const put = (ref: { path: string }, data: unknown) => {
    const check = (value: unknown) => {
      if (value === undefined) throw new Error("Unsupported undefined");
      if (value && typeof value === "object") Object.values(value).forEach(check);
    };
    check(data);
    memory.docs.set(ref.path, structuredClone(data));
  };
  const getCollection = async (ref: { path: string }) => ({ docs: [...memory.docs.keys()].filter((key) => key.startsWith(`${ref.path}/`) && key.split("/").length === ref.path.split("/").length + 1).map(snapshot) });
  return {
    doc: (_db: unknown, ...segments: string[]) => ({ path: segments.join("/") }),
    collection: (_db: unknown, path: string) => ({ path }),
    getDoc: async (ref: { path: string }) => snapshot(ref.path),
    getDocFromServer: async (ref: { path: string }) => snapshot(ref.path),
    getDocs: getCollection, getDocsFromServer: getCollection,
    setDoc: async (ref: { path: string }, data: unknown) => put(ref, data),
    writeBatch: () => {
      const ops: (() => void)[] = [];
      return { set: (ref: { path: string }, data: unknown) => ops.push(() => put(ref, data)),
        delete: (ref: { path: string }) => ops.push(() => memory.docs.delete(ref.path)),
        update: (ref: { path: string }, data: object) => ops.push(() => put(ref, { ...memory.docs.get(ref.path), ...data })),
        commit: async () => {
          memory.commit++;
          if (memory.commit === memory.failCommitAt) throw new Error("Injected later-batch failure");
          ops.forEach((op) => op());
        },
      };
    },
    runTransaction: async (_db: unknown, action: (transaction: unknown) => Promise<unknown>) => {
      const ops: (() => void)[] = [];
      const result = await action({ get: async (ref: { path: string }) => snapshot(ref.path), set: (ref: { path: string }, data: unknown) => ops.push(() => put(ref, data)), update: (ref: {path:string},data:object)=>ops.push(()=>put(ref,{...memory.docs.get(ref.path),...data})) });
      ops.forEach((op) => op());
      return result;
    },
  };
});
import { recordCloudSession, replaceCloudProgress, saveCloudProgressItem } from "./persistence";

const profile: UserProfile = { uid: "cloud-test", email: "test@example.test", displayName: "Test", totalWordsLearned: 1, studyTimeMinutes: 0, streak: 1 };
const item = { easiness: 2.5, interval: 1, repetitions: 1, nextReviewDate: "2026-10-14T00:00:00.000Z" };
beforeEach(() => { memory.docs.clear(); memory.commit = 0; memory.failCommitAt = 0; localStorage.clear(); memory.docs.set("users/cloud-test", profile); });

describe("Cloud persistence adapter (in-memory Firestore substitute)", () => {
  it("writes flashcard history without undefined and deduplicates a stable session", async () => {
    const input = { profile, log: { id: "stable-cloud-session", date: "2026-10-13T02:00:00.000Z", type: "review" as const, details: "Flashcards", correctCount: undefined }, wordIds: [VOCABULARY[0].id], timeZone: "Asia/Ho_Chi_Minh" };
    await recordCloudSession(input);
    await recordCloudSession(input);
    expect(memory.docs.get("users/cloud-test").history).toHaveLength(1);
    expect(memory.docs.get("users/cloud-test/dailyActivity/2026-10-13").wordIds).toEqual(input.wordIds);
  });

  it("writes a word and profile count under the active dataset transaction", async () => {
    await saveCloudProgressItem(profile.uid, VOCABULARY[0].id, item, 1);
    expect(memory.docs.get('users/cloud-test').totalWordsLearned).toBe(1);
    expect(memory.docs.get(`users/cloud-test/progress/${VOCABULARY[0].id}`).userId).toBe(profile.uid);
  });

  it("leaves the active dataset unchanged when a later staged chunk fails", async () => {
    memory.docs.set(`users/cloud-test/progress/${VOCABULARY[0].id}`, { ...item, userId: profile.uid, wordId: VOCABULARY[0].id });
    memory.docs.set("users/cloud-test/dailyActivity/2026-10-12", { dateKey: "2026-10-12", timeZone: "Asia/Ho_Chi_Minh", updatedAt: "2026-10-12T02:00:00.000Z", wordIds: [VOCABULARY[0].id] });
    const before = structuredClone([...memory.docs.entries()]);
    memory.failCommitAt = 3; // clear old (1), import first 400 (2), next import chunk (3).
    const backup = createBackup(null, Object.fromEntries(VOCABULARY.slice(1, 426).map((word) => [word.id, item])));
    await expect(replaceCloudProgress(profile, backup)).rejects.toThrow(/giữ nguyên/);
    expect([...memory.docs.entries()].filter(([path])=>!path.includes('/datasets/')&&!path.includes('/system/')).sort()).toEqual(before.sort());
    expect(memory.docs.get('users/cloud-test/system/dataset')).toMatchObject({active:'legacy',pending:null});
    expect(localStorage.length).toBe(0);
  });
});
