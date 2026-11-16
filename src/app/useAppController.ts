import { subscribeRemoteRepository } from "../repositories/localRepository";
import { useAiExplanation } from '../features/study/useAiExplanation';
import { mergeCloudProgress } from "../repositories/localRepository";
import { resetLocalWord } from "../repositories/localRepository";
import { parseProfile } from "../domain/schemas";
import { useAuthController } from "../features/auth/useAuthController";
import { useGoogleLogin } from "../features/auth/useGoogleLogin";
import { readGuestBackup, mergeGuestIntoAccount } from "../features/auth/accountMerge";
import { createBackup } from "../lib/backup";
import type { BackupV3 } from "../types";
import { useGoogleWorkspace } from "../services/useGoogleWorkspace";
import { clearGoogleTokens } from "../services/googleWorkspace";
import { getActiveOwner, setActiveOwner, subscribeOwner } from "../repositories/ownerStorage";
import { commitStudy, commitSession, loadLocalState, saveLocalState, migrateGuestStorage, getPendingOperations, getCachedEvents, queueOperation, preferencePayload, replaceLocalDataset, cacheCloudEvents } from "../repositories/localRepository";
import { flushOperations, getSyncStatus, resetSyncStatus, subscribeSync, withPausedSync } from "../repositories/syncCoordinator";
import { archiveLocalDataset } from '../repositories/localRepository';
import { cacheGeneration, cancelPendingDataset, DatasetChangedError, getCachedGeneration, readActiveDataset } from '../repositories/cloudDataset';
import { getCloudActivities, rollbackCloudDataset } from '../lib/datasetPersistence';
import { sendCloudOperation, subscribeCloudData, loadCloudUser, updateCloudProfile } from "../repositories/cloudRepository";

import { reportError } from "../services/telemetry";
import type { StudyEvidence, StudyEvent } from "../types";
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { useState, useEffect, useRef } from 'react';
import { User, signOut } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { useCatalog } from "../domain/useCatalog";
import { useAppRoute } from "./useAppRoute";
import { initialSRS } from '../lib/srs';

import { normalizeBackup } from '../lib/backup';
import { createStudySessionLog, parseProgressItem } from '../lib/dataValidation';
import { RestoreRecoveryError } from '../lib/restoreJournal';
import { getLocalDateKey, normalizeProfileWordCount } from '../lib/learning';
import { activateGuestSession, clearGuestProgress, deactivateGuestSession, loadGuestSession, recordGuestSession, replaceCloudProgress, resetCloudProgress, saveGuestProfile, saveGuestProgress, replaceGuestBackup, saveGuestStudyState, recoverCloudRestore } from '../lib/persistence';
import type { AppSessionType, DailyActivity, ProgressItem, UserProfile, UserProgress } from '../types';

import { toast } from 'react-hot-toast';

import { isOnboardingComplete } from '../lib/productPreferences';

export function useAppController() {
  useCatalog();
  const [guestMerge, setGuestMerge] = useState<BackupV3 | null>(null);
  const [mergingGuest, setMergingGuest] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isGuest, setIsGuest] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const profileRef = useRef<UserProfile | null>(null);
  const [progress, setProgress] = useState<UserProgress>({});
  const progressRef = useRef<UserProgress>({});
  const [todayActivity, setTodayActivity] = useState<DailyActivity | null>(null);
  const [currentView, setCurrentView] = useAppRoute();
  const [selectedWordIds, setSelectedWordIds] = useState<string[]>([]);
  const [studyMode, setStudyMode] = useState<'new' | 'review'>('new');
  const [loading, setLoading] = useState(true);
  const { explainingWord, isExplaining, explanationError, handleLearnMore, cancelExplanation, retryExplanation, followup, isFollowingUp, followupError, followupNumber, followUpExplanation, retryFollowup } = useAiExplanation();
  const { calendarOpen,setCalendarOpen,calendarId,setCalendarId,calendarTime,setCalendarTime, syncingAction, syncToGoogleCalendar, syncToGoogleTasks, exportToGoogleDrive } = useGoogleWorkspace({ user, isGuest, profile, progress });
  const [showOnboarding, setShowOnboarding] = useState(() => !isOnboardingComplete());
  const [, refreshSync] = useState(0);
  const activitiesRef = useRef<Record<string, DailyActivity>>({});
  const [events, setEvents] = useState<StudyEvent[]>([]);
  const [isOnline, setIsOnline] = useState(() => navigator.onLine);
  const [cloudReady,setCloudReady]=useState(false);
  useEffect(()=>{setCloudReady(false);},[user?.uid]);
  useEffect(()=>subscribeRemoteRepository(()=>{if(writeDepth.current)return;const owner=getActiveOwner();void loadLocalState(owner).then(state=>{if(!state || getActiveOwner()!==owner)return;progressRef.current=state.progress;setProgress(state.progress);profileRef.current=state.profile;setProfile(state.profile);activitiesRef.current=state.activities;setTodayActivity(state.activities[getLocalDateKey()] || null);setEvents(getCachedEvents(owner));});}),[]);
  const [recoveryError, setRecoveryError] = useState<string | null>(null);
  const [datasetConflict, setDatasetConflict] = useState(false);
  const [cloudGeneration, setCloudGeneration] = useState('legacy');
  const [requestedGeneration, setRequestedGeneration] = useState<string | null>(null);
  const [datasetPreparing,setDatasetPreparing]=useState(false);
  const [isWriting, setIsWriting] = useState(false);
  const writeDepth = useRef(0);
  const progressQueue = useRef<Promise<unknown>>(Promise.resolve());
  const progressOperations = useRef(new Map<string, Promise<UserProgress>>());
  const trackWrite = async <T,>(action: () => Promise<T>): Promise<T> => {
    writeDepth.current++;
    setIsWriting(true);
    try { return await action(); }
    finally { writeDepth.current--; setIsWriting(writeDepth.current > 0); }
  };

  useEffect(() => {
    profileRef.current = profile;
  }, [profile]);

  useEffect(() => {
    progressRef.current = progress;
  }, [progress]);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [currentView]);

  useEffect(() => {
    const updateOnlineStatus = () => setIsOnline(navigator.onLine);
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
    };
  }, []);

  // --- Auth & Data Fetching ---
  useAuthController(isGuest, () => {
    // Check for existing guest session
    const guestSession = loadGuestSession();
    if (guestSession.active && guestSession.profile) {
      const normalizedProfile = normalizeProfileWordCount(
        guestSession.profile,
        guestSession.progress,
      );
      setActiveOwner("guest");
      setIsGuest(true);
      setProfile(normalizedProfile);
      setProgress(guestSession.progress);
      progressRef.current = guestSession.progress;
      setTodayActivity(guestSession.activities[getLocalDateKey()] || null);
      saveGuestProfile(normalizedProfile);
      activitiesRef.current = guestSession.activities;
      void migrateGuestStorage(normalizedProfile, guestSession.progress, guestSession.activities).then((state) => {
        if (getActiveOwner() !== "guest") return;
        setProfile(state.profile); profileRef.current = state.profile;
        setProgress(state.progress); progressRef.current = state.progress;
        activitiesRef.current = state.activities; setTodayActivity(state.activities[getLocalDateKey()] || null);
        setEvents(getCachedEvents("guest"));
      }).catch((error) => setRecoveryError(error.message));
      setLoading(false);
      return true;
    }

    return false;
  }, async (user) => {
      setUser(user);
      if (user) {
        if (getActiveOwner() !== user.uid) {setLoading(true);profileRef.current=null;setProfile(null);progressRef.current={};setProgress({});activitiesRef.current={};setTodayActivity(null);setEvents([]);setGuestMerge(null);setSelectedWordIds([]);cancelExplanation();}
        setActiveOwner(user.uid);
        setIsGuest(false);
        await fetchUserData(user.uid);
      } else if (!isGuest) {
        profileRef.current=null;
        setProfile(null);
        setProgress({});
        progressRef.current = {};
        setTodayActivity(null);
      }
      if (auth.currentUser?.uid === user?.uid && (!user || getActiveOwner() === user.uid)) setLoading(false);
  });

  const syncNow = async (force = false) => {
    const current = profileRef.current;
    if (!current || isGuest || !user || current.uid !== user.uid || getActiveOwner() !== user.uid) return;
    await flushOperations(user.uid, (operation) => sendCloudOperation(user.uid, current, operation), force);
    if (getSyncStatus(user.uid).code === 'dataset-changed' && getActiveOwner() === user.uid) {
      setDatasetConflict(true);setRecoveryError(getSyncStatus(user.uid).error);
      return;
    }
    const local = await loadLocalState(user.uid);
    if (local && getActiveOwner() === user.uid) { progressRef.current = local.progress; setProgress(local.progress); }
  };
  useEffect(() => {
    const changed = () => refreshSync((value) => value + 1);
    const stop = subscribeSync(changed);
    const retry = window.setInterval(() => void syncNow().catch((error) => reportError("sync", error)), 5000);
    const online=()=>{if(user && !isGuest && getActiveOwner()===user.uid)void fetchUserData(user.uid).then(()=>syncNow()).catch(error=>reportError("sync",error));};
    window.addEventListener("online", online);
    return () => { stop(); clearInterval(retry); window.removeEventListener("online", online); };
  }, [user?.uid, isGuest]);
  useEffect(() => {
    if (!user || isGuest) return;
    const uid = user.uid;
    return subscribeCloudData(uid, {
      progress: (cloud) => { if(writeDepth.current)return;void mergeCloudProgress(uid,cloud).then(state=>{if(state && getActiveOwner()===uid){progressRef.current=state.progress;setProgress(state.progress);profileRef.current=normalizeProfileWordCount(profileRef.current || state.profile,state.progress);setProfile(profileRef.current);}}).catch(error=>reportError('cloud-cache',error)); },
      activity: (value) => { if(writeDepth.current)return; if (getActiveOwner() === uid) { activitiesRef.current = { ...activitiesRef.current, ...value }; setTodayActivity(activitiesRef.current[getLocalDateKey()] || null); } },
      events: (value) => { if(writeDepth.current)return; void cacheCloudEvents(uid, value).then(() => { if (getActiveOwner() === uid) setEvents(getCachedEvents(uid)); }); },
      profile: (value) => { if(writeDepth.current)return; if (getActiveOwner() === uid && !getSyncStatus(uid).pending) { const normalized = normalizeProfileWordCount(value, progressRef.current); profileRef.current = normalized; setProfile(normalized); } },
      hasPendingPreferences: () => writeDepth.current > 0 || getSyncStatus(uid).pending > 0,
      generation: (generation) => {if(getActiveOwner()===uid)setRequestedGeneration(generation);},
      preparing: (preparing) => {if(getActiveOwner()===uid)setDatasetPreparing(preparing);},
      error: (error) => reportError("cloud-listener", error),
    });
  }, [user?.uid, isGuest, cloudGeneration]);
  useEffect(()=>{
    if(!user || isGuest || !requestedGeneration || isWriting)return;
    if(requestedGeneration===getCachedGeneration(user.uid)){setRequestedGeneration(null);return;}
    setLoading(true);
    void fetchUserData(user.uid).finally(()=>{if(getActiveOwner()===user.uid)setLoading(false);});
  },[requestedGeneration,isWriting,user?.uid,isGuest]);
  useEffect(() => subscribeOwner((reason) => {
    if (reason !== "local") return;
    if (!user || isGuest || !profileRef.current || getActiveOwner() !== user.uid) return;
    const payload = preferencePayload();
    void queueOperation({ id: `${user.uid}:preferences:${crypto.randomUUID()}`, owner: user.uid, kind: "preferences", payload, attempts: 0, nextAttemptAt: 0 }).then(()=>syncNow()).catch((error) => reportError("preferences", error));
  }), [user?.uid, isGuest]);
  const fetchUserData = async (uid: string) => {
    try {
      setRecoveryError(null);
      setDatasetConflict(false);
      const cached = await loadLocalState(uid);
      if (cached && getActiveOwner() === uid) {
        cacheGeneration(uid,cached.profile.datasetGeneration || 'legacy');
        profileRef.current = cached.profile; setProfile(cached.profile); progressRef.current = cached.progress; setProgress(cached.progress);
        activitiesRef.current = cached.activities; setTodayActivity(cached.activities[getLocalDateKey()] || null); setEvents(getCachedEvents(uid));
      }
      if (!navigator.onLine) {
        if (!cached) setRecoveryError("Tài khoản chưa có dữ liệu trên thiết bị này. Kết nối mạng để tải lần đầu.");
        return;
      }
      if (await recoverCloudRestore(uid)) toast.success("Đã phục hồi lần nhập bị gián đoạn.");
      const current = auth.currentUser;
      if (!current || current.uid !== uid) return;
      const pending = await getPendingOperations(uid);
      const dataset=await readActiveDataset(uid);
      if(cached && (cached.profile.datasetGeneration || 'legacy')!==dataset.active){
        if(pending.length){setDatasetConflict(true);setRecoveryError(new DatasetChangedError(dataset.active).message);return;}
        await archiveLocalDataset(uid);
        activitiesRef.current={};setEvents([]);resetSyncStatus(uid);
      }
      if(pending.some(operation=>(operation.generation || 'legacy')!==dataset.active)){setDatasetConflict(true);setRecoveryError(new DatasetChangedError(dataset.active).message);return;}
      if(requestedGeneration && requestedGeneration!==cloudGeneration){setCurrentView('dashboard',true);setSelectedWordIds([]);cancelExplanation();}
      cacheGeneration(uid,dataset.active);
      const loaded = await loadCloudUser(current,dataset.active);
      const merged = { ...loaded.progress };
      pending.forEach((operation) => {
        if (operation.event) merged[operation.event.wordId] = cached?.progress[operation.event.wordId] || operation.event.after;
        if (operation.kind === 'reset-word' && typeof operation.payload?.wordId === 'string') delete merged[operation.payload.wordId];
      });
      if (getActiveOwner() !== uid || auth.currentUser?.uid !== uid) return;
      setCloudReady(true);
      const normalized = normalizeProfileWordCount(loaded.profile, merged);
      profileRef.current = normalized; setProfile(normalized); progressRef.current = merged; setProgress(merged);
      const activities = await getCloudActivities(uid); if(getActiveOwner() !== uid || auth.currentUser?.uid !== uid)return;
      activitiesRef.current={...activities,...(pending.some(operation=>operation.kind==='session')?cached?.activities || {}:{})};
      setTodayActivity(activitiesRef.current[getLocalDateKey()] || null);
      await saveLocalState({ owner: uid, profile: normalized, progress: merged, activities: activitiesRef.current });
      setCloudGeneration(dataset.active);setRequestedGeneration(null);
      void syncNow();
      if (!sessionStorage.getItem(`eng-master-guest-merge-${uid}`)) {
        const guestBackup = await readGuestBackup();
        if (getActiveOwner() === uid && auth.currentUser?.uid === uid) setGuestMerge(guestBackup);
      }
    } catch (error) {
      if(getActiveOwner() !== uid)return;
      reportError("load-account", error);
      if (error instanceof DatasetChangedError) {setDatasetConflict(true);setRecoveryError(error.message);}
      else if (error instanceof RestoreRecoveryError) setRecoveryError(error.message);
      else if (profileRef.current && (profileRef.current.datasetGeneration || 'legacy')!==getCachedGeneration(uid)) setRecoveryError('Cloud đã thay đổi dữ liệu. Bản trước vẫn được lưu trên thiết bị; kết nối lại để tải phiên bản mới.');
      else if (!profileRef.current) setRecoveryError("Chưa tải được dữ liệu tài khoản. Kết nối lại và thử tải.");
      else toast.error("Đang dùng dữ liệu đã lưu trên thiết bị; Cloud chưa đồng bộ.");
    }
  };

  const exportDeviceBackup = async () => {
    const backup=createBackup(profileRef.current,progressRef.current,activitiesRef.current);
    const operations=user ? await getPendingOperations(user.uid) : [];
    const url=URL.createObjectURL(new Blob([JSON.stringify({...backup,unsentOperations:operations},null,2)],{type:'application/json'}));
    const anchor=document.createElement('a');anchor.href=url;anchor.download='eng-master-device-backup-'+new Date().toISOString().slice(0,10)+'.json';anchor.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
  };
  const adoptCloudDataset = async () => {
    if(!user || writeDepth.current)return;
    await trackWrite(()=>withPausedSync(user.uid,async()=>{await archiveLocalDataset(user.uid);resetSyncStatus(user.uid);setCurrentView('dashboard',true);setSelectedWordIds([]);cancelExplanation();await fetchUserData(user.uid);}));
  };
  const cancelDatasetJob = async () => {
    if(!user || writeDepth.current || !window.confirm('Dừng lần khôi phục đang dở? Dữ liệu đang dùng vẫn được giữ. Thiết bị khởi tạo sẽ cần nhập lại file nếu muốn tiếp tục.'))return;
    await trackWrite(async()=>{await cancelPendingDataset(user.uid);setDatasetPreparing(false);await syncNow(true);});
  };
  const rollbackDataset = async () => {
    if(!user || !profileRef.current || writeDepth.current || !window.confirm('Quay về dữ liệu trước lần khôi phục/reset gần nhất? Bản đang dùng được giữ riêng để phục hồi.'))return;
    await trackWrite(async()=>{
      await syncNow(true);if((await getPendingOperations(user.uid)).length)throw new Error('Hãy đồng bộ hết thao tác đang chờ trước khi phục hồi.');
      await rollbackCloudDataset(profileRef.current!);setCurrentView('dashboard',true);setSelectedWordIds([]);await fetchUserData(user.uid);toast.success('Đã phục hồi bản dữ liệu trước.');
    });
  };

  const { login, isSigningIn } = useGoogleLogin({
    blocked: isWriting,
    canStart: () => !isGuest || document.documentElement.dataset.studyActive !== 'true' || window.confirm('Đăng nhập sẽ tạm dừng phiên học Khách. Các câu đã chấm và phiên dở được giữ trên thiết bị. Tiếp tục đăng nhập?'),
    onSignedIn: () => {
      deactivateGuestSession();
      setIsGuest(false);
      if (isGuest) setCurrentView('dashboard', true);
    },
  });

  const handleGuestLogin = async () => {
    try {
    setActiveOwner("guest");
    const cached = await loadLocalState("guest");
    const legacy = loadGuestSession();
    const existing = cached ? { ...legacy, ...cached } : legacy;
    activateGuestSession();
    const guestId =
      existing.profile?.uid ||
      'guest_' + Math.random().toString(36).slice(2, 11);
    const guestProfile: UserProfile = {
      ...existing.profile,
      uid: guestId,
      email: 'guest@local',
      displayName: existing.profile?.displayName || 'Khách (Guest)',
      totalWordsLearned: 0,
      studyTimeMinutes: existing.profile?.studyTimeMinutes || 0,
      streak: existing.profile?.streak || 0,
      dailyGoal: existing.profile?.dailyGoal || 15,
    };
    setIsGuest(true);

    const normalizedProfile = normalizeProfileWordCount(
      guestProfile,
      existing.progress,
    );
    setProfile(normalizedProfile);
    saveGuestProfile(normalizedProfile);
    setProgress(existing.progress);
    progressRef.current = existing.progress;
    setTodayActivity(existing.activities[getLocalDateKey()] || null);
    profileRef.current = normalizedProfile; activitiesRef.current = existing.activities;
    setEvents(getCachedEvents("guest"));
    await migrateGuestStorage(normalizedProfile, existing.progress, existing.activities);
    toast.success('Đã vào chế độ Khách (Offline)');
    } catch (error) { reportError('guest-storage',error); toast.error('Chưa mở được dữ liệu Khách. Hãy kiểm tra bộ nhớ và tải lại.'); }
  };

  const logout = () => {
    if (writeDepth.current) return;
    setRecoveryError(null);
    clearGoogleTokens();
    setActiveOwner("guest");
    setEvents([]);
    progressOperations.current.clear();
    if (isGuest) {
      deactivateGuestSession();
      setIsGuest(false);
      setProfile(null);
      setProgress({});
      progressRef.current = {};
      setTodayActivity(null);
    } else {
      signOut(auth);
    }
  };

  // --- Google Workspace Services ---
  const persistProgressItem = (
    wordId: string,
    item: ProgressItem,
    operationId?: string,
    evidence?: StudyEvidence,
  ) => {
    const previousOperation = operationId && progressOperations.current.get(operationId);
    if (previousOperation) return previousOperation;
    const task = progressQueue.current.catch(() => undefined).then(() => trackWrite(async () => {
      const currentProfile = profileRef.current;
      if (!currentProfile) throw new Error('Không tìm thấy hồ sơ học tập.');
      if (operationId && progressRef.current[wordId]?.lastOperationId === operationId) return progressRef.current;
      const eventId = operationId || crypto.randomUUID();
      const storedItem = parseProgressItem({ ...item, lastOperationId: eventId });
      let updatedProgress = { ...progressRef.current, [wordId]: storedItem };
      let updatedProfile = normalizeProfileWordCount(currentProfile, updatedProgress);
      const owner = getActiveOwner();
      const event: StudyEvent = { id: eventId, wordId, sessionId: evidence?.sessionId || operationId?.split(":")[0] || crypto.randomUUID(), mode: evidence?.mode || "review", durationSeconds: Math.min(3600, evidence?.durationSeconds || 0), occurredAt: new Date().toISOString(), timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone, before: progressRef.current[wordId] || null, after: storedItem, ...(evidence?.quality !== undefined ? { quality: evidence.quality } : {}), ...(evidence?.correct !== undefined ? { correct: evidence.correct } : {}), ...(evidence?.attempt?{attempt:evidence.attempt}:{}) };
      const committed = await commitStudy({ owner, profile: updatedProfile, progress: updatedProgress, activities: activitiesRef.current }, event, !isGuest);
      updatedProgress = committed.progress; updatedProfile = normalizeProfileWordCount(committed.profile, committed.progress);
      if (isGuest) { try { saveGuestStudyState(updatedProfile, updatedProgress); } catch (error) { reportError("legacy-mirror", error); } }
      setEvents(getCachedEvents(owner));
      if (!isGuest) void syncNow().catch((error) => reportError("sync", error));
      progressRef.current = updatedProgress;
      profileRef.current = updatedProfile;
      setProgress(updatedProgress);
      setProfile(updatedProfile);
      return updatedProgress;
    }));
    progressQueue.current = task;
    if (operationId) {
      progressOperations.current.set(operationId, task);
      void task.then(() => progressOperations.current.delete(operationId), () => progressOperations.current.delete(operationId));
    }
    return task;
  };

  const resetWordProgress = async (wordId: string) => trackWrite(async () => {
    const state = await resetLocalWord(getActiveOwner(),wordId,!isGuest);
    progressRef.current=state.progress;profileRef.current=state.profile;setProgress(state.progress);setProfile(state.profile);
    if(isGuest) {saveGuestProgress(state.progress);saveGuestProfile(state.profile);} else void syncNow();
    toast.success('Đã đặt lại tiến độ của từ.');
  });

  const delayWordReview = async (wordId: string) => {
    const item = progressRef.current[wordId];
    if (!item) return;
    const nextDate = new Date();
    nextDate.setDate(nextDate.getDate() + 1);
    await persistProgressItem(wordId, { ...item, nextReviewDate: nextDate.toISOString() });
    toast.success('Đã hoãn từ sang ngày mai.');
  };

  const logSessionHistory = async ({
    type,
    score,
    details,
    wordIds,
    correctCount,
    totalQuestions,
    sessionId,
  }: {
    type: AppSessionType;
    score?: string;
    details: string;
    wordIds: string[];
    correctCount?: number;
    totalQuestions?: number;
    sessionId?: string;
  }) => trackWrite(async () => {
    const currentProfile = profileRef.current;
    if (!currentProfile) throw new Error('Không tìm thấy hồ sơ học tập.');
    const newLog = createStudySessionLog({
      id: sessionId,
      type,
      score,
      details,
      wordIds: [...new Set(wordIds)],
      studiedCount: new Set(wordIds).size,
      correctCount,
      totalQuestions,
      durationSeconds: getCachedEvents().filter((event) => event.sessionId === sessionId).reduce((sum, event) => sum + event.durationSeconds, 0),
    });

    try {
      const result = await commitSession({ owner: getActiveOwner(), profile: currentProfile, progress: progressRef.current, activities: activitiesRef.current }, newLog, !isGuest);
      if (isGuest) { try { recordGuestSession({ profile: currentProfile, log: newLog, wordIds }); } catch (error) { reportError("legacy-mirror", error); } }
      profileRef.current = result.profile; setProfile(result.profile); activitiesRef.current = result.activities;
      setTodayActivity(result.activities[getLocalDateKey()] || null);
      if (!isGuest) void syncNow();
    } catch (err) {
      reportError("app-write",err);
      throw err;
    }
  });

const reviewSessionOnFinish = async (newProgress: UserProgress, wordIds: string[], sessionId: string) => {
                setProgress(newProgress);
                progressRef.current = newProgress;
                await logSessionHistory({
                  type: 'review',
                  score: `${wordIds.length} từ`,
                  details: studyMode === 'new'
                    ? `Hoàn thành học từ mới (${wordIds.length} thẻ)`
                    : `Hoàn thành ôn tập từ vựng (${wordIds.length} thẻ)`,
                  wordIds,
                  sessionId,
                });
                setCurrentView('dashboard',true);
              };

const quizSessionOnFinish = async (score: number, total: number, wordIds: string[], sessionId: string) => {
                await logSessionHistory({
                  type: 'quiz',
                  score: `${score}/${total}`,
                  details: `Hoàn thành bài kiểm tra (${Math.round((score/total)*100)}%)`,
                  wordIds,
                  correctCount: score,
                  totalQuestions: total,
                  sessionId,
                });
              };

const quizSessionOnWordResult = async (wordId: string, isCorrect: boolean, operationId: string, evidence?: StudyEvidence) => {
                const currentItem = progressRef.current[wordId] || {
                  easiness: initialSRS.easiness,
                  interval: initialSRS.interval,
                  repetitions: initialSRS.repetitions,
                  nextReviewDate: new Date().toISOString()
                };
                
                let newWrongCount = currentItem.wrongCount || 0;
                if (!isCorrect) {
                  newWrongCount += 1;
                } else if (newWrongCount > 0) {
                  newWrongCount -= 1;
                }

                const updatedItem = {
                  ...currentItem,
                  wrongCount: newWrongCount,
                  lastReviewDate: new Date().toISOString()
                };

                await persistProgressItem(wordId, updatedItem, operationId, evidence || { sessionId: operationId.split(":")[0], mode: "quiz", correct: isCorrect, durationSeconds: 0 });
              };

const practiceSessionOnFinish = async (mode: string, wordIds: string[], sessionId: string) => {
                await logSessionHistory({
                  type: 'review',
                  score: `${wordIds.length} từ`,
                  details: `Luyện tập tự do (${mode})`,
                  wordIds,
                  sessionId,
                });
                setCurrentView('dashboard');
              };

const practiceSessionOnUpdateProgress = async (wordId: string, nextSRS: import("../lib/srs").SRSData & { wrongCount: number }, operationId: string, evidence?: StudyEvidence) => {
                const updatedItem: ProgressItem = {
                  ...nextSRS,
                  nextReviewDate: nextSRS.nextReviewDate.toISOString(),
                  lastReviewDate: new Date().toISOString(),
                  wrongCount: nextSRS.wrongCount !== undefined
                    ? nextSRS.wrongCount
                    : (progressRef.current[wordId]?.wrongCount || 0),
                };
                await persistProgressItem(wordId, updatedItem, operationId, evidence);
              };

const settingsViewOnImportBackup = (input: import("../types").StudyBackup) => trackWrite(async () => {
                const backup = normalizeBackup(input);
                const currentProfile = profileRef.current;
                if (!currentProfile) throw new Error('Missing profile.');
                const importedProgress = backup.progress;

                if (isGuest) {
                  const normalizedImportedProfile = replaceGuestBackup(currentProfile, backup);
                  setProgress(importedProgress);
                  progressRef.current = importedProgress;
                  setProfile(normalizedImportedProfile);
                  profileRef.current = normalizedImportedProfile;
                  setTodayActivity(loadGuestSession().activities[getLocalDateKey()] || null);
                  activitiesRef.current = loadGuestSession().activities;
                  await replaceLocalDataset({ owner: "guest", profile: normalizedImportedProfile, progress: importedProgress, activities: activitiesRef.current }, backup.version !== 2 ? backup.events || [] : []);
                  setEvents(getCachedEvents("guest"));
                  return;
                }

                if (user) {
                  await syncNow();
                  if ((await getPendingOperations(user.uid)).length) throw new Error("Hãy đồng bộ hết thao tác đang chờ trước khi nhập dữ liệu.");
                  try {
                    const cloudProfile = await replaceCloudProgress(
                      currentProfile,
                      backup,
                    );
                    await replaceLocalDataset({ owner: user.uid, profile: cloudProfile, progress: importedProgress, activities: backup.version !== 2 ? backup.dailyActivity : activitiesRef.current }, backup.version !== 2 ? backup.events || [] : []);
                    setCloudGeneration(cloudProfile.datasetGeneration || 'legacy');setRequestedGeneration(null);
                    await queueOperation({id:`${user.uid}:preferences:${crypto.randomUUID()}`,owner:user.uid,kind:"preferences",payload:preferencePayload(),attempts:0,nextAttemptAt:0});
                    void syncNow();
                    setEvents(getCachedEvents(user.uid));
                    setProfile(cloudProfile);
                    profileRef.current = cloudProfile;
                    setProgress(importedProgress);
                    progressRef.current = importedProgress;
                    if (backup.version !== 2) {activitiesRef.current=backup.dailyActivity;setTodayActivity(backup.dailyActivity[getLocalDateKey()] || null);}
                  } catch (error) {
                    if (error instanceof RestoreRecoveryError) setRecoveryError(error.message);
                    throw error;
                  }
                }
              });

const settingsViewOnUpdateProfile = (updates: Partial<UserProfile>) => trackWrite(async () => {
                const currentProfile = profileRef.current;
                if (!currentProfile) throw new Error('Không tìm thấy hồ sơ.');
                const newProfile = isGuest ? parseProfile({ ...profileRef.current, ...updates }) : await updateCloudProfile(currentProfile.uid,updates);
                if (isGuest) saveGuestProfile(newProfile);
                await saveLocalState({ owner: getActiveOwner(), profile: newProfile, progress: progressRef.current, activities: activitiesRef.current });
                profileRef.current = newProfile;
                setProfile(newProfile);
              });

const settingsViewOnResetProgress = async () => {
                if (window.confirm("Bạn có chắc chắn muốn reset toàn bộ tiến độ học tập? Với tài khoản Cloud, bản trước được giữ để phục hồi.")) {
                  await trackWrite(async()=>{
                  try {
                    const currentProfile = profileRef.current;
                    let resetProfile: UserProfile | null = currentProfile
                      ? {
                          ...currentProfile,
                          totalWordsLearned: 0,
                          streak: 0,
                          lastStudyDate: undefined,
                          history: [],
                        }
                      : null;

                    if (isGuest) {
                      clearGuestProgress();
                      if (resetProfile) {
                        saveGuestProfile(resetProfile);
                      }
                    } else if (user && currentProfile) {
                      await syncNow();
                      if ((await getPendingOperations(user.uid)).length) throw new Error("Hãy đồng bộ hết thao tác đang chờ trước khi xóa.");
                      resetProfile=await resetCloudProgress(currentProfile);
                      setCloudGeneration(resetProfile.datasetGeneration || 'legacy');setRequestedGeneration(null);
                      toast.success("Đã xóa tiến độ học tập trên Cloud.");
                    }

                    if (resetProfile) await replaceLocalDataset({ owner: getActiveOwner(), profile: resetProfile, progress: {}, activities: {} });
                    setEvents([]); activitiesRef.current = {};
                    setProgress({});
                    progressRef.current = {};
                    setProfile(resetProfile);
                    profileRef.current = resetProfile;
                    setTodayActivity(null);
                    toast.success("Đã cài đặt lại tiến trình học tập.");
                  } catch (err) {
                    reportError("app-write",err);
                    toast.error('Không thể xóa tiến độ học tập. Vui lòng thử lại.');
                  }
                  });
                }
              };

  const dismissGuestMerge = () => { if (user) sessionStorage.setItem('eng-master-guest-merge-'+user.uid,'true'); setGuestMerge(null); };
  const confirmGuestMerge = async () => {
    if (!guestMerge || mergingGuest) return; setMergingGuest(true);
    try { const current=createBackup(profileRef.current,progressRef.current,activitiesRef.current); await settingsViewOnImportBackup(mergeGuestIntoAccount(current,guestMerge)); dismissGuestMerge(); toast.success('Đã gộp dữ liệu Khách vào tài khoản; bản Khách vẫn được giữ.'); }
    catch (error) { toast.error((error as Error).message); } finally {setMergingGuest(false);}
  };
  const startSelectedWords = (ids: string[]) => {
    if (!ids.length) return;
    if (!window.confirm('Bắt đầu phiên với danh sách này? Phiên ôn đang dở sẽ được thay bằng danh sách đã chọn.')) return;
    setSelectedWordIds(ids); setStudyMode('review'); setCurrentView('review');
  };
  const syncStatus = isGuest ? "Lưu trên thiết bị" : getSyncStatus(user?.uid || "").syncing ? "Đang đồng bộ" : getSyncStatus(user?.uid || "").error ? "Lỗi đồng bộ · thao tác vẫn được giữ trên thiết bị" : getSyncStatus(user?.uid || "").pending ? `${getSyncStatus(user?.uid || "").pending} thao tác chờ đồng bộ` : isOnline ? cloudReady ? "Đã đồng bộ" : "Chưa xác nhận dữ liệu Cloud" : "Offline · dữ liệu được giữ trên thiết bị";
  return { datasetPreparing, cancelDatasetJob, rollbackDataset, datasetConflict, exportDeviceBackup, adoptCloudDataset, calendarOpen,setCalendarOpen,calendarId,setCalendarId,calendarTime,setCalendarTime, dailyActivities: activitiesRef.current, cancelExplanation, guestMerge, mergingGuest, dismissGuestMerge, confirmGuestMerge, selectedWordIds, setSelectedWordIds, startSelectedWords, events, syncStatus, syncNow, user, setUser, isGuest, setIsGuest, profile, setProfile, profileRef, progress, setProgress, progressRef, todayActivity, setTodayActivity, currentView, setCurrentView, studyMode, setStudyMode, loading, setLoading, explainingWord, isExplaining, explanationError, retryExplanation, followup, isFollowingUp, followupError, followupNumber, followUpExplanation, retryFollowup, syncingAction, showOnboarding, setShowOnboarding, isOnline, setIsOnline, recoveryError, setRecoveryError, isWriting, setIsWriting, writeDepth, progressQueue, progressOperations, trackWrite, fetchUserData, login, isSigningIn, handleGuestLogin, logout, syncToGoogleCalendar, syncToGoogleTasks, exportToGoogleDrive, persistProgressItem, resetWordProgress, delayWordReview, logSessionHistory, handleLearnMore, reviewSessionOnFinish, quizSessionOnFinish, quizSessionOnWordResult, practiceSessionOnFinish, practiceSessionOnUpdateProgress, settingsViewOnImportBackup, settingsViewOnUpdateProfile, settingsViewOnResetProgress };
}
