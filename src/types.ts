export type AppSessionType = "review" | "quiz";

export interface ProgressItem {
  userId?: string;
  wordId?: string;
  easiness: number;
  interval: number;
  repetitions: number;
  nextReviewDate: string;
  lastReviewDate?: string;
  wrongCount?: number;
  lastOperationId?: string;
  revision?: number;
}

export interface UserProgress {
  [wordId: string]: ProgressItem;
}

export interface StudySessionLog {
  id: string;
  date: string;
  type: AppSessionType;
  score?: string;
  details: string;
  wordIds?: string[];
  studiedCount?: number;
  correctCount?: number;
  totalQuestions?: number;
  durationSeconds?: number;
}

export interface UserProfile {
  uid: string;
  datasetGeneration?: string;
  email: string;
  displayName: string;
  photoURL?: string;
  totalWordsLearned: number;
  studyTimeMinutes: number;
  studyTimeSeconds?: number;
  streak: number;
  dailyGoal?: number;
  lastStudyDate?: string;
  history?: StudySessionLog[];
}

export interface DailyActivity {
  dateKey: string;
  timeZone: string;
  wordIds: string[];
  updatedAt: string;
}

export type LearningStatus = "new" | "learning" | "learned" | "mastered";

export interface BackupV2 {
  version: 2;
  exportedAt: string;
  profile: Partial<UserProfile> | null;
  progress: UserProgress;
}

export interface BackupPreferences {
  sound: boolean;
  notifications: boolean;
  studySessionSize: number;
  reminderHour: number;
}

export interface BackupV3 extends Omit<BackupV2, "version"> {
  // Modern backups: v4 adds separately stored extended practice.
  version: 3 | 4;
  catalogVersion: "toeic-1575-v1";
  customWords: import("./data/vocabularyTypes").Word[];
  favorites: string[];
  preferences: BackupPreferences;
  dailyActivity: Record<string, DailyActivity>;
  events?: StudyEvent[];
  extendedPracticeRecords?: import("./domain/extendedPracticeRecords").ExtendedPracticeRecord[];
  practiceRecords?: import("./domain/practiceRecords").PracticeRecord[];
  roadmap?: import("./domain/roadmap").Roadmap | null;
  decks?: import("./domain/schemas").Deck[];
}

export type StudyBackup = BackupV2 | BackupV3;

export interface StudyEvidence {
  sessionId: string;
  mode: "review" | "practice" | "quiz" | "cloze" | "listening";
  quality?: number;
  correct?: boolean;
  durationSeconds: number;
  attempt?: import('./domain/mistakes').QuizAttemptSnapshot;
}
export interface StudyEvent extends StudyEvidence {
  id: string;
  wordId: string;
  occurredAt: string;
  timeZone: string;
  before: ProgressItem | null;
  after: ProgressItem;
}
export interface SessionDraft {
  id: string;
  kind: "review-new" | "review-review" | "practice" | "quiz";
  wordIds: string[];
  cursor: number;
  completedIds: string[];
  updatedAt: string;
  questions?: unknown[];
  answers?: Record<string, string>;
  mode?: string;
}
