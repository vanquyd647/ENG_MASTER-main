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
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  totalWordsLearned: number;
  studyTimeMinutes: number;
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
