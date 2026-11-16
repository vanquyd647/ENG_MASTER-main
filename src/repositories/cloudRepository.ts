import { createDeferredRemoteUpdate } from './deferredRemoteUpdate';
import { getPendingOperations } from './localRepository';
import { subscribeSync } from './syncCoordinator';
import { writeLocalChanges } from '../lib/localTransaction';
import { splitAccountSettings } from './accountSettings';
import { parseProfile, parseAccountPreferences } from "../domain/schemas";
import { collection, doc, getDoc, getDocFromServer, getDocs, onSnapshot, query, orderBy, limit, where, runTransaction, setDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { calculateNextReview, initialSRS } from "../lib/srs";
import { parseProgressItem, parseSessionLog, parseStudyEvent } from "../lib/dataValidation";
import type { DailyActivity, ProgressItem, StudyEvent, UserProfile, UserProgress } from "../types";
import { recordCloudSession, toStoredProgress } from "../lib/persistence";
import { getActiveOwner, ownerKey, notifyOwnerStorage } from "./ownerStorage";
import type { PendingOperation, OperationAcknowledgement } from "./localRepository";
import { assertDatasetTransaction, cacheGeneration, datasetCollectionPath, datasetMetaRef, DatasetChangedError, getCachedGeneration, parseDataset, readActiveDataset } from './cloudDataset';

export const applyCloudStudy = async (uid: string, input: StudyEvent, generation = getCachedGeneration(uid)): Promise<ProgressItem> => {
  const event = parseStudyEvent(input);
  const eventRef = doc(db, datasetCollectionPath(uid, 'events', generation), event.id);
  const progressRef = doc(db, datasetCollectionPath(uid, 'progress', generation), event.wordId);
  const profileRef = doc(db, "users", uid);
  return runTransaction(db, async (transaction) => {
    await assertDatasetTransaction(transaction, uid, generation);
    const [storedEvent, storedProgress, storedProfile] = await Promise.all([transaction.get(eventRef), transaction.get(progressRef), transaction.get(profileRef)]);
    if (storedEvent.exists()) return parseProgressItem(storedEvent.data().after);
    const previous = storedProgress.exists() ? parseProgressItem(storedProgress.data()) : { ...initialSRS, nextReviewDate: event.occurredAt };
    let next: ProgressItem;
    if (event.quality !== undefined) {
      const calculated = calculateNextReview(event.quality, { ...previous, nextReviewDate: new Date(previous.nextReviewDate) }, new Date(Math.max(Date.parse(event.occurredAt), Date.parse(previous.lastReviewDate || event.occurredAt))));
      next = { ...calculated, nextReviewDate: calculated.nextReviewDate.toISOString(), wrongCount: event.quality < 3 ? (previous.wrongCount || 0) + 1 : Math.max(0, (previous.wrongCount || 0) - (event.quality >= 4 ? 1 : 0)) };
    } else if (event.correct !== undefined) next = { ...previous, wrongCount: Math.max(0, (previous.wrongCount || 0) + (event.correct ? -1 : 1)) };
    else next = { ...event.after };
    next = parseProgressItem({ ...next, lastOperationId: event.id, lastReviewDate: new Date(Math.max(Date.parse(event.occurredAt), Date.parse(previous.lastReviewDate || event.occurredAt))).toISOString(), revision: (previous.revision || 0) + 1 });
    transaction.set(progressRef, toStoredProgress(uid, event.wordId, next));
    transaction.set(eventRef, { ...event, before: storedProgress.exists() ? previous : null, after: next });
    if (!storedProgress.exists() && storedProfile.exists()) transaction.update(profileRef, { totalWordsLearned: (storedProfile.data().totalWordsLearned || 0) + 1 });
    return next;
  });
};

export const sendCloudOperation = async (uid: string, profile: UserProfile, operation: PendingOperation): Promise<OperationAcknowledgement | void> => {
  if (operation.owner !== uid) throw new Error("Tài khoản đồng bộ không khớp.");
  const generation = operation.generation || 'legacy';
  if (operation.kind === "study" && operation.event) return applyCloudStudy(uid, operation.event, generation);
  if (operation.kind === "session" && operation.log) {
    const log = parseSessionLog(operation.log);
    const result=await recordCloudSession({ profile, log, wordIds: log.wordIds || [], generation });
    return {sessionProfile:result.profile,activity:result.activity};
  }
  if (operation.kind === "preferences" && operation.payload) {
    await runTransaction(db, async transaction => {
      await assertDatasetTransaction(transaction, uid, generation);
      const split=splitAccountSettings(parseAccountPreferences(operation.payload));
      for(const [id,values] of Object.entries(split))transaction.set(doc(db,datasetCollectionPath(uid,'settings',generation),id),{values,updatedAt:new Date().toISOString()});
    });
    return;
  }
  if (operation.kind === 'reset-word' && typeof operation.payload?.wordId === 'string' && /^[a-zA-Z0-9_-]{1,128}$/.test(operation.payload.wordId)) {
    const progressRef=doc(db,datasetCollectionPath(uid,'progress',generation),operation.payload.wordId);const profileRef=doc(db,'users',uid);
    await runTransaction(db,async tx=>{await assertDatasetTransaction(tx,uid,generation);const [progress,account]=await Promise.all([tx.get(progressRef),tx.get(profileRef)]);if(progress.exists()){tx.delete(progressRef);if(account.exists())tx.update(profileRef,{totalWordsLearned:Math.max(0,(account.data().totalWordsLearned || 0)-1)});}});return;
  }
  throw new Error("Thao tác đồng bộ không hợp lệ.");
};

export const subscribeCloudData = (uid: string, handlers: {
  progress: (value: UserProgress) => void; activity: (value: Record<string, DailyActivity>) => void;
  events: (value: StudyEvent[]) => void; profile: (value: UserProfile) => void;
  error: (error: unknown) => void; hasPendingPreferences: () => boolean; generation: (generation: string) => void; preparing: (preparing:boolean)=>void;
}) => {
  const generation=getCachedGeneration(uid);
  const current=()=>getCachedGeneration(uid)===generation;
  const extendedRefresh=createDeferredRemoteUpdate({
    localVersion:()=>localStorage.getItem(ownerKey('eng_master_extended_practice_v1')),
    isCurrent:()=>current()&&getActiveOwner()===uid,
    isBlocked:handlers.hasPendingPreferences,
    hasPending:async()=>(await getPendingOperations(uid)).length>0,
    readRemote:async()=>{const snapshot=await getDocFromServer(doc(db,datasetCollectionPath(uid,'settings',generation),'extendedLearning'));return parseAccountPreferences(snapshot.exists()?snapshot.data().values:{eng_master_extended_practice_v1:null});},
    apply:values=>{const value=values.eng_master_extended_practice_v1??null,key=ownerKey('eng_master_extended_practice_v1');if(localStorage.getItem(key)!==value){writeLocalChanges({[key]:value});notifyOwnerStorage('remote');}},
    onError:handlers.error,
  });
  const unsubscribes = [
    subscribeSync(()=>{void extendedRefresh.flush();}),
    ()=>extendedRefresh.dispose(),
    onSnapshot(collection(db, datasetCollectionPath(uid,'progress',generation)), {includeMetadataChanges:true}, (snapshot) => { if(snapshot.metadata.fromCache || snapshot.metadata.hasPendingWrites)return;try { if(current())handlers.progress(Object.fromEntries(snapshot.docs.map((item) => [item.id, parseProgressItem(item.data())]))); } catch (error) { handlers.error(error); } }, handlers.error),
    onSnapshot(collection(db, datasetCollectionPath(uid,'dailyActivity',generation)), {includeMetadataChanges:true}, (snapshot) => {if(snapshot.metadata.fromCache || snapshot.metadata.hasPendingWrites)return;if(current())handlers.activity(Object.fromEntries(snapshot.docs.map((item) => [item.id, item.data() as DailyActivity])));}, handlers.error),
    onSnapshot(query(collection(db, datasetCollectionPath(uid,'events',generation)), where("occurredAt", ">=", new Date(Date.now() - 90 * 86_400_000).toISOString()), orderBy("occurredAt", "desc"), limit(10_000)), {includeMetadataChanges:true}, (snapshot) => { if(snapshot.metadata.fromCache || snapshot.metadata.hasPendingWrites)return;try {if(current())handlers.events(snapshot.docs.map((item) => parseStudyEvent(item.data()))); } catch (error) { handlers.error(error); } }, handlers.error),
    onSnapshot(doc(db, "users", uid), {includeMetadataChanges:true}, (snapshot) => { if(snapshot.metadata.fromCache || snapshot.metadata.hasPendingWrites)return;try {if (snapshot.exists() && current()) {const profile=parseProfile(snapshot.data());if((profile.datasetGeneration || 'legacy')===generation)handlers.profile(profile);}} catch(error) {handlers.error(error);} }, handlers.error),
    onSnapshot(datasetMetaRef(uid),{includeMetadataChanges:true},snapshot=>{if(snapshot.metadata.fromCache || snapshot.metadata.hasPendingWrites)return;try{const state=parseDataset(snapshot.exists()?snapshot.data():undefined);handlers.preparing(Boolean(state.pending));if(state.active!==generation)handlers.generation(state.active);}catch(error){handlers.error(error);}},handlers.error),
    ...["preferences","learning","extendedLearning"].map(id=>onSnapshot(doc(db, datasetCollectionPath(uid,'settings',generation), id), {includeMetadataChanges:true}, (snapshot) => {
      if(snapshot.metadata.fromCache || snapshot.metadata.hasPendingWrites)return;
      if(id==='extendedLearning'){extendedRefresh.notify();return;}
      try {
      if (!current() || getActiveOwner() !== uid || !snapshot.exists() || handlers.hasPendingPreferences()) return;
      const values = parseAccountPreferences(snapshot.data().values);
      let changed = false;
      for (const [key, value] of Object.entries(values)) if (key.startsWith("eng_master_") && (typeof value === "string" || value === null)) {
        if (localStorage.getItem(ownerKey(key)) !== value) { changed = true; if (value === null) localStorage.removeItem(ownerKey(key)); else localStorage.setItem(ownerKey(key), String(value)); }
      }
      if (changed) notifyOwnerStorage("remote");
      } catch(error) {handlers.error(error);}
    }, handlers.error)),
  ];
  return () => unsubscribes.forEach((unsubscribe) => unsubscribe());
};

export const loadCloudUser = async (user: { uid: string; email: string | null; displayName: string | null }, generation = getCachedGeneration(user.uid)) => {
  const ref = doc(db, "users", user.uid); const snapshot = await getDoc(ref);
  let profile: UserProfile;
  if (snapshot.exists()) profile = parseProfile(snapshot.data());
  else { profile = { uid: user.uid, email: user.email || "", displayName: user.displayName || "Người học", totalWordsLearned: 0, studyTimeMinutes: 0, streak: 0, dailyGoal: 15 }; await setDoc(ref, profile); }
  const progress = await getDocs(collection(db, datasetCollectionPath(user.uid,'progress',generation)));
  const dataset=await readActiveDataset(user.uid);
  if(dataset.active!==generation)throw new DatasetChangedError(dataset.active);
  cacheGeneration(user.uid,generation);
  return { profile:{...profile,datasetGeneration:generation}, progress: Object.fromEntries(progress.docs.map((item) => [item.id, parseProgressItem(item.data())])) };
};

export const updateCloudProfile = async (uid: string, updates: Partial<UserProfile>) => runTransaction(db, async transaction => {
  await assertDatasetTransaction(transaction,uid,getCachedGeneration(uid));
  const ref=doc(db,'users',uid),stored=await transaction.get(ref);
  if(!stored.exists())throw new Error('Không tìm thấy hồ sơ Cloud.');
  const profile=parseProfile({...stored.data(),...updates,uid,datasetGeneration:getCachedGeneration(uid)});
  transaction.set(ref,profile);return profile;
});
