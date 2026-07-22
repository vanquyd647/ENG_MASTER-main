import { VOCABULARY } from "../data/vocabulary";
import type {
  DailyActivity,
  LearningStatus,
  ProgressItem,
  StudySessionLog,
  UserProfile,
  UserProgress,
} from "../types";

export const REVIEW_SESSION_SIZE = 15;

export const getLearningStatus = (
  item: ProgressItem | undefined,
): LearningStatus => {
  if (!item) return "new";
  if (item.repetitions < 3) return "learning";
  if (item.repetitions < 7) return "learned";
  return "mastered";
};

export const getLearningStatusLabel = (
  item: ProgressItem | undefined,
) => {
  const status = getLearningStatus(item);
  return {
    new: "Chưa học",
    learning: "Đang học",
    learned: "Đã thuộc",
    mastered: "Thành thạo",
  }[status];
};

export const getStartedWordCount = (progress: UserProgress) =>
  VOCABULARY.reduce(
    (count, word) => count + (progress[word.id] ? 1 : 0),
    0,
  );

export const getRemainingNewWordCount = (progress: UserProgress) =>
  Math.max(VOCABULARY.length - getStartedWordCount(progress), 0);

export const getNewWordQueue = (progress: UserProgress) =>
  VOCABULARY.filter((word) => !progress[word.id]);

export const getDueReviewQueue = (progress: UserProgress, now = new Date()) =>
  VOCABULARY.filter((word) => {
    const item = progress[word.id];
    return Boolean(item) && new Date(item.nextReviewDate) <= now;
  });

export const getReviewQueue = (progress: UserProgress, now = new Date()) =>
  [...getDueReviewQueue(progress, now), ...getNewWordQueue(progress)];

export const normalizeProfileWordCount = (
  profile: UserProfile,
  progress: UserProgress,
): UserProfile => ({
  ...profile,
  totalWordsLearned: getStartedWordCount(progress),
});

export const getLocalDateKey = (
  date = new Date(),
  timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone,
) => {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${values.year}-${values.month}-${values.day}`;
};

export const createDailyActivity = (
  dateKey: string,
  timeZone: string,
  existingWordIds: string[],
  newWordIds: string[],
  updatedAt = new Date().toISOString(),
): DailyActivity => ({
  dateKey,
  timeZone,
  wordIds: [...new Set([...existingWordIds, ...newWordIds])],
  updatedAt,
});

export const getSessionStudiedCount = (session: StudySessionLog) => {
  if (typeof session.studiedCount === "number") return session.studiedCount;
  if (session.wordIds?.length) return new Set(session.wordIds).size;
  if (typeof session.totalQuestions === "number") return session.totalQuestions;

  if (session.type === "quiz") {
    const legacyQuiz = session.score?.match(/^\s*\d+\s*\/\s*(\d+)\s*$/);
    if (legacyQuiz) return Number(legacyQuiz[1]);
  }

  const legacyCount = session.score?.match(/\d+/);
  return legacyCount ? Number(legacyCount[0]) : 0;
};

export const getSessionCorrectPercentage = (session: StudySessionLog) => {
  if (
    typeof session.correctCount === "number" &&
    typeof session.totalQuestions === "number" &&
    session.totalQuestions > 0
  ) {
    return Math.round((session.correctCount / session.totalQuestions) * 100);
  }

  const legacyQuiz = session.score?.match(/^\s*(\d+)\s*\/\s*(\d+)\s*$/);
  if (legacyQuiz && Number(legacyQuiz[2]) > 0) {
    return Math.round((Number(legacyQuiz[1]) / Number(legacyQuiz[2])) * 100);
  }

  const detailPercentage = session.details.match(/\((\d+)%\)/)?.[1];
  return detailPercentage ? Number(detailPercentage) : 0;
};

const dateKeyToUtcTime = (dateKey: string) => {
  const [year, month, day] = dateKey.split("-").map(Number);
  if (!year || !month || !day) return Number.NaN;
  return Date.UTC(year, month - 1, day);
};

export const calculateNextStreak = (
  previousDateKey: string | undefined,
  currentDateKey: string,
  currentStreak: number,
) => {
  if (!previousDateKey) return 1;
  if (previousDateKey === currentDateKey) return Math.max(currentStreak, 1);

  const previous = dateKeyToUtcTime(previousDateKey);
  const current = dateKeyToUtcTime(currentDateKey);
  const dayDifference = Math.round((current - previous) / 86_400_000);
  return dayDifference === 1 ? Math.max(currentStreak, 0) + 1 : 1;
};
