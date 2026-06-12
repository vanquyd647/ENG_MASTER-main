import {
  calculateNextStreak,
  createDailyActivity,
  getLocalDateKey,
} from "./learning";
import type {
  DailyActivity,
  StudySessionLog,
  UserProfile,
  UserProgress,
} from "../types";

const GUEST_PROFILE_KEY = "guest_profile";
const GUEST_PROGRESS_KEY = "guest_progress";
const GUEST_ACTIVITY_KEY = "guest_daily_activity";
const GUEST_ACTIVE_KEY = "guest_session_active";

const parseJson = <T>(value: string | null, fallback: T): T => {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
};

export const loadGuestSession = () => {
  const profile = parseJson<UserProfile | null>(
    localStorage.getItem(GUEST_PROFILE_KEY),
    null,
  );
  const progress = parseJson<UserProgress>(
    localStorage.getItem(GUEST_PROGRESS_KEY),
    {},
  );
  const activities = parseJson<Record<string, DailyActivity>>(
    localStorage.getItem(GUEST_ACTIVITY_KEY),
    {},
  );
  const storedActive = localStorage.getItem(GUEST_ACTIVE_KEY);
  const active = storedActive === null ? Boolean(profile) : storedActive === "true";
  return { active, profile, progress, activities };
};

export const activateGuestSession = () => {
  localStorage.setItem(GUEST_ACTIVE_KEY, "true");
};

export const deactivateGuestSession = () => {
  localStorage.setItem(GUEST_ACTIVE_KEY, "false");
};

export const saveGuestProfile = (profile: UserProfile) => {
  localStorage.setItem(GUEST_PROFILE_KEY, JSON.stringify(profile));
};

export const saveGuestProgress = (progress: UserProgress) => {
  localStorage.setItem(GUEST_PROGRESS_KEY, JSON.stringify(progress));
};

export const clearGuestProgress = () => {
  localStorage.removeItem(GUEST_PROGRESS_KEY);
  localStorage.removeItem(GUEST_ACTIVITY_KEY);
};

type SessionRecordInput = {
  profile: UserProfile;
  log: StudySessionLog;
  wordIds: string[];
  timeZone?: string;
};

export const recordGuestSession = ({
  profile,
  log,
  wordIds,
  timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone,
}: SessionRecordInput) => {
  const dateKey = getLocalDateKey(new Date(log.date), timeZone);
  const activities = loadGuestSession().activities;
  const activity = createDailyActivity(
    dateKey,
    timeZone,
    activities[dateKey]?.wordIds || [],
    wordIds,
  );
  activities[dateKey] = activity;

  const nextProfile: UserProfile = {
    ...profile,
    history: [log, ...(profile.history || [])].slice(0, 50),
    streak: calculateNextStreak(
      profile.lastStudyDate,
      dateKey,
      profile.streak,
    ),
    lastStudyDate: dateKey,
  };
  saveGuestProfile(nextProfile);
  localStorage.setItem(GUEST_ACTIVITY_KEY, JSON.stringify(activities));
  return { profile: nextProfile, activity };
};
