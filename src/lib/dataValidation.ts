import { getVocabulary } from "../domain/catalog";
import type { ProgressItem, StudySessionLog, StudyEvent } from "../types";
import { normalizeAnswer } from '../domain/random';
import { parseQuizAttempt } from '../domain/mistakes';

export const MAX_WORDS = 10_000;
export const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);
export const isIsoDate = (value: unknown): value is string =>
  typeof value === "string" && /^\d{4}-\d{2}-\d{2}T/.test(value) && Number.isFinite(Date.parse(value));
export const currentVocabularyIds = () => new Set(getVocabulary().map((word) => word.id));

export const parseProgressItem = (value: unknown): ProgressItem => {
  if (!isRecord(value)) throw new Error("Progress item must be an object.");
  const { easiness, interval, repetitions, nextReviewDate, lastReviewDate, wrongCount, lastOperationId, revision } = value;
  if (
    typeof easiness !== "number" || !Number.isFinite(easiness) || easiness < 1.3 || easiness > Number.MAX_SAFE_INTEGER ||
    typeof interval !== "number" || !Number.isSafeInteger(interval) || interval < 0 ||
    typeof repetitions !== "number" || !Number.isSafeInteger(repetitions) || repetitions < 0 ||
    !isIsoDate(nextReviewDate) ||
    (lastReviewDate !== undefined && !isIsoDate(lastReviewDate)) ||
    (wrongCount !== undefined && (typeof wrongCount !== "number" || !Number.isSafeInteger(wrongCount) || wrongCount < 0)) ||
    (lastOperationId !== undefined && (typeof lastOperationId !== "string" || !lastOperationId || lastOperationId.length > 200)) ||
    (revision !== undefined && (typeof revision !== "number" || !Number.isSafeInteger(revision) || revision < 0))
  ) throw new Error("Progress item contains invalid SRS values.");
  return {
    easiness, interval, repetitions, nextReviewDate,
    ...(typeof lastReviewDate === "string" ? { lastReviewDate } : {}),
    ...(typeof wrongCount === "number" ? { wrongCount } : {}),
    ...(typeof lastOperationId === "string" ? { lastOperationId } : {}),
    ...(typeof revision === "number" ? { revision } : {}),
  };
};

export const parseSessionLog = (value: unknown, ids = currentVocabularyIds()): StudySessionLog => {
  if (!isRecord(value)) throw new Error("History item must be an object.");
  if (
    typeof value.id !== "string" || !value.id || value.id.length > 128 || !isIsoDate(value.date) ||
    (value.type !== "review" && value.type !== "quiz") ||
    typeof value.details !== "string" || value.details.length > 500 ||
    (value.durationSeconds !== undefined && (typeof value.durationSeconds !== "number" || !Number.isSafeInteger(value.durationSeconds) || value.durationSeconds < 0 || value.durationSeconds > 36_000_000)) ||
    (value.score !== undefined && (typeof value.score !== "string" || value.score.length > 50))
  ) throw new Error("History item contains invalid fields.");
  let wordIds: string[] | undefined;
  if (value.wordIds !== undefined) {
    if (!Array.isArray(value.wordIds) || value.wordIds.length > MAX_WORDS ||
      value.wordIds.some((id) => typeof id !== "string" || (!ids.has(id) && !/^custom-[a-zA-Z0-9_-]{1,120}$/.test(id)))) {
      throw new Error("History item contains invalid word ids.");
    }
    wordIds = [...new Set(value.wordIds as string[])];
  }
  const counts: Partial<Pick<StudySessionLog, "studiedCount" | "correctCount" | "totalQuestions">> = {};
  for (const key of ["studiedCount", "correctCount", "totalQuestions"] as const) {
    const count = value[key];
    if (count === undefined) continue;
    if (typeof count !== "number" || !Number.isSafeInteger(count) || count < 0 || count > MAX_WORDS) {
      throw new Error(`History item contains invalid ${key}.`);
    }
    counts[key] = count;
  }
  if (counts.correctCount !== undefined && counts.totalQuestions !== undefined && counts.correctCount > counts.totalQuestions) {
    throw new Error("History item contains an invalid score.");
  }
  return {
    id: value.id, date: value.date, type: value.type, details: value.details,
    ...(typeof value.score === "string" ? { score: value.score } : {}),
    ...(wordIds ? { wordIds } : {}), ...counts,
    ...(typeof value.durationSeconds === "number" && Number.isSafeInteger(value.durationSeconds) && value.durationSeconds >= 0 ? { durationSeconds: value.durationSeconds } : {}),
  };
};

export const createStudySessionLog = (
  input: Omit<StudySessionLog, "id" | "date"> & { id?: string; date?: string },
) => parseSessionLog({ ...input, id: input.id || crypto.randomUUID(), date: input.date || new Date().toISOString() });

export const parseStudyEvent = (value: unknown): StudyEvent => {
  if (!isRecord(value) || typeof value.id !== "string" || !value.id || !/^[a-zA-Z0-9_:-]{1,200}$/.test(value.id) || typeof value.wordId !== "string" || !/^[a-zA-Z0-9_-]{1,128}$/.test(value.wordId) || typeof value.sessionId !== "string" || !/^[a-zA-Z0-9_-]{1,128}$/.test(value.sessionId) || !isIsoDate(value.occurredAt) || typeof value.timeZone !== "string" || value.timeZone.length > 100 || !["review", "practice", "quiz", "cloze", "listening"].includes(String(value.mode)) || typeof value.durationSeconds !== "number" || !Number.isSafeInteger(value.durationSeconds) || value.durationSeconds < 0 || value.durationSeconds > 3600 || (value.quality !== undefined && (typeof value.quality !== "number" || !Number.isInteger(value.quality) || value.quality < 0 || value.quality > 5)) || (value.correct !== undefined && typeof value.correct !== "boolean")) throw new Error("Sự kiện học không hợp lệ.");
  new Intl.DateTimeFormat("en", { timeZone: value.timeZone });
  const attempt=value.attempt!==undefined?parseQuizAttempt(value.attempt):undefined;
  if(attempt && (typeof value.correct!=="boolean" || value.correct!==(attempt.questionType==="fill"?normalizeAnswer(attempt.userAnswer)===normalizeAnswer(attempt.correctAnswer):attempt.userAnswer===attempt.correctAnswer)))throw new Error("Câu trả lời và kết quả chấm không khớp.");
  return { id: value.id, wordId: value.wordId, sessionId: value.sessionId, occurredAt: value.occurredAt, timeZone: value.timeZone, mode: value.mode as StudyEvent["mode"], durationSeconds: value.durationSeconds,
    before: value.before === null ? null : parseProgressItem(value.before), after: parseProgressItem(value.after),
    ...(typeof value.quality === "number" ? { quality: value.quality } : {}), ...(typeof value.correct === "boolean" ? { correct: value.correct } : {}),
    ...(attempt?{attempt}:{}),
  };
};
