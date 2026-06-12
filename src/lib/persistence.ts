import {
  collection,
  doc,
  getDoc,
  getDocs,
  runTransaction,
  setDoc,
  updateDoc,
  writeBatch,
} from "firebase/firestore";
import { db } from "./firebase";
import { chunkItems } from "./chunks";
import {
  calculateNextStreak,
  createDailyActivity,
  getLocalDateKey,
  normalizeProfileWordCount,
} from "./learning";
export {
  activateGuestSession,
  clearGuestProgress,
  deactivateGuestSession,
  loadGuestSession,
  recordGuestSession,
  saveGuestProfile,
  saveGuestProgress,
} from "./guestPersistence";
import type {
  BackupV2,
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
  easiness: item.easiness,
  interval: item.interval,
  repetitions: item.repetitions,
  nextReviewDate: item.nextReviewDate,
  ...(item.lastReviewDate ? { lastReviewDate: item.lastReviewDate } : {}),
  ...(item.wrongCount !== undefined ? { wrongCount: item.wrongCount } : {}),
  userId: uid,
  wordId,
});

export const saveCloudProgressItem = async (
  uid: string,
  wordId: string,
  item: ProgressItem,
  totalWordsLearned: number,
) => {
  await Promise.all([
    setDoc(
      doc(db, `users/${uid}/progress`, wordId),
      toStoredProgress(uid, wordId, item),
    ),
    updateDoc(doc(db, "users", uid), { totalWordsLearned }),
  ]);
};

const commitInChunks = async <T>(
  items: T[],
  addToBatch: (batch: ReturnType<typeof writeBatch>, item: T) => void,
) => {
  for (const chunk of chunkItems(items)) {
    const batch = writeBatch(db);
    for (const item of chunk) {
      addToBatch(batch, item);
    }
    await batch.commit();
  }
};

const clearCloudCollection = async (path: string) => {
  const snapshots = await getDocs(collection(db, path));
  await commitInChunks(snapshots.docs, (batch, snapshot) => {
    batch.delete(snapshot.ref);
  });
};

export const replaceCloudProgress = async (
  currentProfile: UserProfile,
  backup: BackupV2,
) => {
  const uid = currentProfile.uid;
  await clearCloudCollection(`users/${uid}/progress`);
  await clearCloudCollection(`users/${uid}/dailyActivity`);

  await commitInChunks(
    Object.entries(backup.progress),
    (batch, [wordId, item]) => {
      batch.set(
        doc(db, `users/${uid}/progress`, wordId),
        toStoredProgress(uid, wordId, item),
      );
    },
  );

  const importedProfile = backup.profile || {};
  const nextProfile = normalizeProfileWordCount(
    {
      ...currentProfile,
      ...importedProfile,
      uid,
      email: currentProfile.email,
    },
    backup.progress,
  );
  await setDoc(doc(db, "users", uid), nextProfile);
  return nextProfile;
};

export const resetCloudProgress = async (profile: UserProfile) => {
  await clearCloudCollection(`users/${profile.uid}/progress`);
  await clearCloudCollection(`users/${profile.uid}/dailyActivity`);

  const nextProfile: UserProfile = {
    ...profile,
    totalWordsLearned: 0,
    streak: 0,
    history: [],
  };
  delete nextProfile.lastStudyDate;
  await setDoc(doc(db, "users", profile.uid), nextProfile);
  return nextProfile;
};

export const getCloudDailyActivity = async (
  uid: string,
  dateKey = getLocalDateKey(),
) => {
  const snapshot = await getDoc(
    doc(db, `users/${uid}/dailyActivity`, dateKey),
  );
  return snapshot.exists() ? (snapshot.data() as DailyActivity) : null;
};

type SessionRecordInput = {
  profile: UserProfile;
  log: StudySessionLog;
  wordIds: string[];
  timeZone?: string;
};

export const recordCloudSession = async ({
  profile,
  log,
  wordIds,
  timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone,
}: SessionRecordInput) => {
  const dateKey = getLocalDateKey(new Date(log.date), timeZone);
  const profileRef = doc(db, "users", profile.uid);
  const activityRef = doc(
    db,
    `users/${profile.uid}/dailyActivity`,
    dateKey,
  );

  return runTransaction(db, async (transaction) => {
    const [profileSnapshot, activitySnapshot] = await Promise.all([
      transaction.get(profileRef),
      transaction.get(activityRef),
    ]);
    const storedProfile = profileSnapshot.exists()
      ? (profileSnapshot.data() as UserProfile)
      : profile;
    const existingActivity = activitySnapshot.exists()
      ? (activitySnapshot.data() as DailyActivity)
      : null;
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
    };
    transaction.set(activityRef, activity);
    transaction.set(profileRef, nextProfile);
    return { profile: nextProfile, activity };
  });
};
