import { calculateNextStreak, createDailyActivity, getLocalDateKey } from "../lib/learning";
import type { DailyActivity, StudySessionLog, UserProfile } from "../types";
export const foldSession = (profile: UserProfile, log: StudySessionLog, activities: Record<string, DailyActivity>, timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone) => {
  const day = getLocalDateKey(new Date(log.date), timeZone);
  if (profile.history?.some((item) => item.id === log.id)) return { profile, activities };
  const activity = createDailyActivity(day, timeZone, activities[day]?.wordIds || [], log.wordIds || []);
  return { profile: { ...profile, history: [log, ...(profile.history || [])].slice(0, 50), lastStudyDate: day,
    streak: calculateNextStreak(profile.lastStudyDate, day, profile.streak),
    studyTimeSeconds: (profile.studyTimeSeconds ?? profile.studyTimeMinutes*60)+(log.durationSeconds || 0),
    studyTimeMinutes: Math.floor(((profile.studyTimeSeconds ?? profile.studyTimeMinutes*60)+(log.durationSeconds || 0))/60),
  }, activities: { ...activities, [day]: activity } };
};
