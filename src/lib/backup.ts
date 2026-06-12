import { VOCABULARY } from "../data/vocabulary";
import type {
  BackupV2,
  ProgressItem,
  StudySessionLog,
  UserProfile,
  UserProgress,
} from "../types";

const vocabularyIds = new Set(VOCABULARY.map((word) => word.id));

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const isIsoDate = (value: unknown): value is string =>
  typeof value === "string" && Number.isFinite(Date.parse(value));

const parseProgressItem = (value: unknown): ProgressItem => {
  if (!isRecord(value)) throw new Error("Progress item must be an object.");

  const { easiness, interval, repetitions, nextReviewDate, lastReviewDate, wrongCount } =
    value;
  if (
    typeof easiness !== "number" ||
    !Number.isFinite(easiness) ||
    easiness < 1.3 ||
    typeof interval !== "number" ||
    !Number.isInteger(interval) ||
    interval < 0 ||
    typeof repetitions !== "number" ||
    !Number.isInteger(repetitions) ||
    repetitions < 0 ||
    !isIsoDate(nextReviewDate) ||
    (lastReviewDate !== undefined && !isIsoDate(lastReviewDate)) ||
    (wrongCount !== undefined &&
      (typeof wrongCount !== "number" ||
        !Number.isInteger(wrongCount) ||
        wrongCount < 0))
  ) {
    throw new Error("Progress item contains invalid SRS values.");
  }

  return {
    easiness,
    interval,
    repetitions,
    nextReviewDate,
    ...(typeof lastReviewDate === "string" ? { lastReviewDate } : {}),
    ...(typeof wrongCount === "number" ? { wrongCount } : {}),
  };
};

const parseSessionLog = (value: unknown): StudySessionLog => {
  if (!isRecord(value)) throw new Error("History item must be an object.");
  if (
    typeof value.id !== "string" ||
    value.id.length === 0 ||
    value.id.length > 128 ||
    !isIsoDate(value.date) ||
    (value.type !== "review" && value.type !== "quiz") ||
    typeof value.details !== "string" ||
    value.details.length > 500 ||
    (value.score !== undefined &&
      (typeof value.score !== "string" || value.score.length > 50))
  ) {
    throw new Error("History item contains invalid fields.");
  }

  let wordIds: string[] | undefined;
  if (value.wordIds !== undefined) {
    if (
      !Array.isArray(value.wordIds) ||
      value.wordIds.length > VOCABULARY.length ||
      value.wordIds.some(
        (wordId) => typeof wordId !== "string" || !vocabularyIds.has(wordId),
      )
    ) {
      throw new Error("History item contains invalid word ids.");
    }
    wordIds = [...new Set(value.wordIds)];
  }

  const readCount = (key: string) => {
    const count = value[key];
    if (count === undefined) return undefined;
    if (
      typeof count !== "number" ||
      !Number.isInteger(count) ||
      count < 0 ||
      count > VOCABULARY.length
    ) {
      throw new Error(`History item contains invalid ${key}.`);
    }
    return count;
  };

  return {
    id: value.id,
    date: value.date,
    type: value.type,
    details: value.details,
    ...(typeof value.score === "string" ? { score: value.score } : {}),
    ...(wordIds ? { wordIds } : {}),
    ...(readCount("studiedCount") !== undefined
      ? { studiedCount: readCount("studiedCount") }
      : {}),
    ...(readCount("correctCount") !== undefined
      ? { correctCount: readCount("correctCount") }
      : {}),
    ...(readCount("totalQuestions") !== undefined
      ? { totalQuestions: readCount("totalQuestions") }
      : {}),
  };
};

const sanitizeProfile = (value: unknown): Partial<UserProfile> | null => {
  if (value === null || value === undefined) return null;
  if (!isRecord(value)) throw new Error("Profile must be an object.");

  const profile: Partial<UserProfile> = {};
  if (typeof value.displayName === "string") {
    profile.displayName = value.displayName.slice(0, 120);
  }
  if (typeof value.photoURL === "string" && value.photoURL.length <= 900_000) {
    profile.photoURL = value.photoURL;
  }
  if (
    typeof value.studyTimeMinutes === "number" &&
    Number.isInteger(value.studyTimeMinutes) &&
    value.studyTimeMinutes >= 0
  ) {
    profile.studyTimeMinutes = value.studyTimeMinutes;
  }
  if (
    typeof value.dailyGoal === "number" &&
    Number.isInteger(value.dailyGoal) &&
    value.dailyGoal >= 5 &&
    value.dailyGoal <= 50
  ) {
    profile.dailyGoal = value.dailyGoal;
  }
  if (Array.isArray(value.history)) {
    profile.history = value.history.slice(0, 50).map(parseSessionLog);
  }
  return profile;
};

export const normalizeBackup = (input: unknown): BackupV2 => {
  if (!isRecord(input)) throw new Error("Backup must be an object.");
  if (input.version !== undefined && input.version !== 2) {
    throw new Error("Unsupported backup version.");
  }
  if (!isRecord(input.progress)) throw new Error("Backup progress is missing.");

  const entries = Object.entries(input.progress);
  if (entries.length > VOCABULARY.length) {
    throw new Error("Backup contains too many progress items.");
  }

  const progress: UserProgress = {};
  for (const [wordId, item] of entries) {
    if (!vocabularyIds.has(wordId)) {
      throw new Error(`Unknown vocabulary id: ${wordId}`);
    }
    progress[wordId] = parseProgressItem(item);
  }

  const exportedAt = isIsoDate(input.exportedAt)
    ? input.exportedAt
    : new Date().toISOString();

  return {
    version: 2,
    exportedAt,
    profile: sanitizeProfile(input.profile),
    progress,
  };
};

export const createBackup = (
  profile: UserProfile | null,
  progress: UserProgress,
): BackupV2 => ({
  version: 2,
  exportedAt: new Date().toISOString(),
  profile,
  progress,
});
