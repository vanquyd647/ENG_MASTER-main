import { describe, expect, it } from "vitest";
import { createStudySessionLog, parseSessionLog } from "./dataValidation";
import { VOCABULARY } from "../data/vocabulary";

describe("session serialization", () => {
  it("omits optional undefined fields for flashcards and preserves a stable session ID", () => {
    const log = createStudySessionLog({ id: "stable-session", type: "review", details: "Flashcards", wordIds: [VOCABULARY[0].id], correctCount: undefined, totalQuestions: undefined });
    expect(log.id).toBe("stable-session");
    expect(Object.values(log)).not.toContain(undefined);
    expect(log).not.toHaveProperty("correctCount");
    expect(parseSessionLog(log)).toEqual(log);
  });
  it("rejects impossible quiz scores and invalid dates", () => {
    expect(() => createStudySessionLog({ type: "quiz", details: "Quiz", correctCount: 5, totalQuestions: 4 })).toThrow(/score/);
    expect(() => createStudySessionLog({ type: "review", details: "Flashcards", date: "tomorrow" })).toThrow(/fields/);
  });
});
