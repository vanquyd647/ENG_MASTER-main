import {
  doc,
  getDoc,
  runTransaction,
} from "firebase/firestore";
import { db } from "./firebase";
import { assertDatasetTransaction, datasetCollectionPath, getCachedGeneration } from "../repositories/cloudDataset";
import { parseProgressItem, parseSessionLog } from "./dataValidation";
import {
  calculateNextStreak,
  createDailyActivity,
  getLocalDateKey,
} from "./learning";
export {
  activateGuestSession,
  clearGuestProgress,
  deactivateGuestSession,
  loadGuestSession,
  recordGuestSession,
  saveGuestProfile,
  saveGuestProgress,
  replaceGuestBackup,
  saveGuestStudyState,
} from "./guestPersistence";
import type {
  DailyActivity,
  ProgressItem,
  StudySessionLog,
  UserProfile,
} from "../types";

export const toStoredProgress = (
  uid: string,
  wordId: string,
  item: ProgressItem,
) => ({
  ...parseProgressItem(item),
  userId: uid,
  wordId,
});

export const saveCloudProgressItem = async (
  uid: string,
  wordId: string,
  item: ProgressItem,
  totalWordsLearned: number,
) => {
  const generation = getCachedGeneration(uid);
  await runTransaction(db, async transaction => {
    await assertDatasetTransaction(transaction, uid, generation);
    transaction.set(doc(db, datasetCollectionPath(uid, 'progress', generation), wordId), toStoredProgress(uid, wordId, item));
    transaction.update(doc(db, 'users', uid), { totalWordsLearned });
  });
};

export { replaceCloudProgress, resetCloudProgress, recoverCloudRestore, getCloudActivities } from "./datasetPersistence";

export const getCloudDailyActivity = async (
  uid: string,
  dateKey = getLocalDateKey(),
) => {
  const snapshot = await getDoc(
    doc(db, datasetCollectionPath(uid, "dailyActivity"), dateKey),
  );
  return snapshot.exists() ? (snapshot.data() as DailyActivity) : null;
};

type SessionRecordInput = {
  profile: UserProfile;
  log: StudySessionLog;
  wordIds: string[];
  timeZone?: string;
  generation?: string;
};

export const recordCloudSession = async ({
  profile,
  log,
  wordIds,
  timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone,
  generation = getCachedGeneration(profile.uid),
}: SessionRecordInput) => {
  log = parseSessionLog({ ...log, wordIds: log.wordIds || wordIds });
  wordIds = log.wordIds || [];
  const dateKey = getLocalDateKey(new Date(log.date), timeZone);
  const profileRef = doc(db, "users", profile.uid);
  const activityRef = doc(
    db,
    datasetCollectionPath(profile.uid, "dailyActivity", generation),
    dateKey,
  );
  const sessionRef=doc(db,datasetCollectionPath(profile.uid,'sessions',generation),log.id);

  return runTransaction(db, async (transaction) => {
    await assertDatasetTransaction(transaction, profile.uid, generation);
    const [profileSnapshot, activitySnapshot, sessionSnapshot] = await Promise.all([
      transaction.get(profileRef),
      transaction.get(activityRef),
      transaction.get(sessionRef),
    ]);
    const storedProfile = profileSnapshot.exists()
      ? (profileSnapshot.data() as UserProfile)
      : profile;
    const existingActivity = activitySnapshot.exists()
      ? (activitySnapshot.data() as DailyActivity)
      : null;
    if (sessionSnapshot.exists() || storedProfile.history?.some((session) => session.id === log.id)) {
      return { profile: storedProfile, activity: existingActivity || createDailyActivity(dateKey, timeZone, [], wordIds) };
    }
    const activity = createDailyActivity(
      dateKey,
      timeZone,
      existingActivity?.wordIds || [],
      wordIds,
    );
    const nextProfile: UserProfile = {
      ...storedProfile,
      history: [log, ...(storedProfile.history || [])].slice(0, 50),
      streak: calculateNextStreak(
        storedProfile.lastStudyDate,
        dateKey,
        storedProfile.streak,
      ),
      lastStudyDate: dateKey,
      studyTimeSeconds: (storedProfile.studyTimeSeconds ?? storedProfile.studyTimeMinutes*60)+(log.durationSeconds || 0),
      studyTimeMinutes: Math.floor(((storedProfile.studyTimeSeconds ?? storedProfile.studyTimeMinutes*60)+(log.durationSeconds || 0))/60),
    };
    transaction.set(sessionRef, log);
    transaction.set(activityRef, activity);
    transaction.set(profileRef, nextProfile);
    return { profile: nextProfile, activity };
  });
};
