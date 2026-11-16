import { ownerKeyFor } from './ownerStorage';
import { parseSessionDraft, parseProfile } from "../domain/schemas";
import { calculateNextReview, initialSRS } from "../lib/srs";
import { parseProgressItem, parseStudyEvent, parseSessionLog } from "../lib/dataValidation";
import { foldSession } from "../domain/studyPolicy";
import type { DailyActivity, ProgressItem, SessionDraft, StudyEvent, StudySessionLog, UserProfile, UserProgress } from "../types";
import { getActiveOwner, ownerKey } from "./ownerStorage";

export interface LocalState { owner: string; version: 1; profile: UserProfile; progress: UserProgress; activities: Record<string, DailyActivity>; }
export interface PendingOperation { id: string; owner: string; generation?: string; kind: "study" | "session" | "preferences" | "reset-word"; event?: StudyEvent; log?: StudySessionLog; payload?: Record<string, unknown>; attempts: number; nextAttemptAt: number; queuedAt?: number; }
export type OperationAcknowledgement = ProgressItem | { sessionProfile: UserProfile; activity: DailyActivity };
const sessionKey=(owner:string,id:string)=>owner+':\u0000session:'+id;
let connection: Promise<IDBDatabase> | null = null;
const listeners = new Set<() => void>();
const eventCache = new Map<string, StudyEvent[]>();
export const subscribeRepository = (listener: () => void) => { listeners.add(listener); return () => { listeners.delete(listener); }; };
const remoteListeners=new Set<() => void>();
const channel=typeof window !== 'undefined' && 'BroadcastChannel' in window ? new window.BroadcastChannel('eng-master-local-updates') : null;
if(channel)channel.onmessage=()=>remoteListeners.forEach(listener=>listener());
export const subscribeRemoteRepository=(listener:()=>void)=>{remoteListeners.add(listener);return()=>{remoteListeners.delete(listener);};};
const notify = () => {listeners.forEach((listener) => listener());channel?.postMessage({type:'commit'});};
const request = <T,>(value: IDBRequest<T>) => new Promise<T>((resolve, reject) => { value.onsuccess = () => resolve(value.result); value.onerror = () => reject(value.error); });
const open = () => {
  if (!connection) connection = new Promise<IDBDatabase>((resolve, reject) => {
    if (!("indexedDB" in globalThis)) { reject(new Error("Thiết bị chưa hỗ trợ lưu dữ liệu offline.")); return; }
    const result = indexedDB.open("eng-master-local-v1", 1);
    result.onupgradeneeded = () => {
      const db = result.result;
      db.createObjectStore("states", { keyPath: "owner" });
      for (const name of ["events", "outbox", "drafts"]) { const store = db.createObjectStore(name, { keyPath: "id" }); store.createIndex("owner", "owner"); }
    };
    result.onsuccess = () => { result.result.onversionchange = () => { result.result.close(); connection = null; }; resolve(result.result); };
    result.onerror = () => { connection = null; reject(new Error("Không mở được bộ nhớ offline. Kiểm tra dung lượng/quyền lưu dữ liệu.")); };
    result.onblocked = () => reject(new Error("Hãy đóng tab ứng dụng cũ để cập nhật bộ nhớ."));
  });
  return connection;
};
const completed = (transaction: IDBTransaction) => new Promise<void>((resolve, reject) => { transaction.oncomplete = () => { notify(); resolve(); }; transaction.onabort = transaction.onerror = () => reject(transaction.error || new Error("Không lưu được dữ liệu offline.")); });
const getAll = async <T,>(store: string, owner: string): Promise<T[]> => {
  const db = await open(); const transaction = db.transaction(store, "readonly");
  return request(transaction.objectStore(store).index("owner").getAll(owner));
};
export const loadLocalState = async (owner: string): Promise<LocalState | null> => {
  const db = await open(); const result = await request<LocalState | undefined>(db.transaction("states").objectStore("states").get(owner));
  const events = await getAll<{ event: StudyEvent }>("events", owner); eventCache.set(owner, events.map((record) => record.event));
  if (result) result.profile = parseProfile(result.profile);
  return result || null;
};
export const getCachedEvents = (owner = getActiveOwner()) => eventCache.get(owner) || [];
export const saveLocalState = async (state: Omit<LocalState, "version">) => {
  const db = await open(); const transaction = db.transaction("states", "readwrite"); const done = completed(transaction);
  transaction.objectStore("states").put({ ...state, version: 1 }); await done;
};
export const commitStudy = async (state: Omit<LocalState, "version">, input: StudyEvent, cloud: boolean): Promise<LocalState> => {
  const event = parseStudyEvent(input);
  const db = await open(); const transaction = db.transaction(["states", "events", "outbox"], "readwrite"); const done = completed(transaction);
  const [existing, cached, queued] = await Promise.all([
    request(transaction.objectStore("events").get(state.owner + ":" + event.id)),
    request<LocalState | undefined>(transaction.objectStore("states").get(state.owner)),
    request<PendingOperation[]>(transaction.objectStore("outbox").index("owner").getAll(state.owner)),
  ]);
  if (existing) { await done; return cached || {...state,version:1}; }
  const previous = cached?.progress[event.wordId];
  if (event.quality !== undefined) {
    const baseline = previous || {...initialSRS,nextReviewDate:event.occurredAt};
    const next = calculateNextReview(event.quality, {...baseline,nextReviewDate:new Date(baseline.nextReviewDate)}, new Date(Math.max(Date.parse(event.occurredAt),Date.parse(baseline.lastReviewDate || event.occurredAt))));
    event.after = parseProgressItem({...next,nextReviewDate:next.nextReviewDate.toISOString(),lastReviewDate:event.occurredAt,lastOperationId:event.id,revision:(previous?.revision || 0)+1,wrongCount:event.quality < 3 ? (previous?.wrongCount || 0)+1 : Math.max(0,(previous?.wrongCount || 0)-(event.quality >= 4 ? 1 : 0))});
  } else if (event.correct !== undefined) {
    event.after = parseProgressItem({...previous || event.after,wrongCount:Math.max(0,(previous?.wrongCount || 0)+(event.correct ? -1 : 1)),lastOperationId:event.id,lastReviewDate:event.occurredAt,revision:(previous?.revision || 0)+1});
  }
  event.before = previous || null;
  const progress = {...cached?.progress || state.progress,[event.wordId]:event.after};
  const nextState: LocalState = {...state,version:1,progress,activities:cached?.activities || state.activities,profile:{...cached?.profile || state.profile,totalWordsLearned:Object.keys(progress).length}};
  transaction.objectStore("states").put(nextState);
  transaction.objectStore("events").put({id:state.owner+":"+event.id,owner:state.owner,event});
  if (cloud) transaction.objectStore("outbox").put({id:state.owner+":"+event.id,owner:state.owner,generation:nextState.profile.datasetGeneration || 'legacy',kind:"study",event,attempts:0,nextAttemptAt:0,queuedAt:Math.max(Date.now(),...queued.map(o=>(o.queuedAt || 0)+1))} satisfies PendingOperation);
  await done; eventCache.set(state.owner,[...getCachedEvents(state.owner),event]); return nextState;
};
export const queueOperation = async (operation: PendingOperation) => {
  const db = await open(); const transaction = db.transaction(['outbox','states'], "readwrite"); const done = completed(transaction);
  const [state,existing]=await Promise.all([request<LocalState | undefined>(transaction.objectStore('states').get(operation.owner)),request(transaction.objectStore('outbox').get(operation.id))]);
  // An in-flight failure must not recreate work already archived/acknowledged.
  if(operation.attempts>0 && !existing){await done;return false;}
  transaction.objectStore("outbox").put({ ...operation, generation: operation.generation || state?.profile.datasetGeneration || 'legacy', queuedAt: operation.queuedAt || Date.now() }); await done;return true;
};
export const commitSession = async (state: Omit<LocalState, "version">, input: StudySessionLog, cloud: boolean): Promise<LocalState> => {
  const log = parseSessionLog(input);
  const db = await open(); const transaction = db.transaction(["states", "outbox", "events"], "readwrite"); const done = completed(transaction);
  const cached = await request<LocalState | undefined>(transaction.objectStore("states").get(state.owner));
  const existing=await request(transaction.objectStore('events').get(sessionKey(state.owner,log.id)));
  if(existing){await done;return cached || {...state,version:1};}
  const result = foldSession(cached?.profile || state.profile,log,cached?.activities || state.activities);
  const nextState: LocalState = {...state,version:1,...result,progress:cached?.progress || state.progress};
  transaction.objectStore("states").put(nextState);
  // Array index keys keep these records invisible to older event readers.
  transaction.objectStore('events').put({id:sessionKey(state.owner,log.id),owner:[state.owner,'sessions'],log});
  if (cloud) transaction.objectStore("outbox").put({ id: state.owner+":session:"+log.id, owner: state.owner, generation:nextState.profile.datasetGeneration || 'legacy', kind: "session", log, attempts: 0, nextAttemptAt: 0, queuedAt:Date.now() } satisfies PendingOperation);
  await done; return nextState;
};
export const cacheCloudEvents = async (owner: string, events: StudyEvent[]) => {
  const db = await open(); const transaction = db.transaction("events", "readwrite"); const done = completed(transaction);
  events.forEach((event) => transaction.objectStore("events").put({ id: `${owner}:${event.id}`, owner, event })); await done;
  const combined = new Map([...getCachedEvents(owner), ...events].map((event) => [event.id, event])); eventCache.set(owner, [...combined.values()]);
};
export const getPendingOperations = async (owner: string) => (await getAll<PendingOperation>("outbox", owner)).sort((a,b) => (a.queuedAt || Date.parse(a.event?.occurredAt || a.log?.date || "") || 0) - (b.queuedAt || Date.parse(b.event?.occurredAt || b.log?.date || "") || 0));
export const acknowledgeOperation = async (operation: PendingOperation, canonical?: OperationAcknowledgement) => {
  const db = await open(); const transaction = db.transaction(["outbox", "states"], "readwrite"); const done = completed(transaction);
  transaction.objectStore("outbox").delete(operation.id);
  if (canonical && 'sessionProfile' in canonical) {
    const [state,pending]=await Promise.all([request<LocalState | undefined>(transaction.objectStore('states').get(operation.owner)),request<PendingOperation[]>(transaction.objectStore('outbox').index('owner').getAll(operation.owner))]);
    if(state && !pending.some(op=>op.kind==='session')){
      const profile=canonical.sessionProfile;
      state.profile={...state.profile,history:profile.history || [],streak:profile.streak,studyTimeMinutes:profile.studyTimeMinutes,...(profile.studyTimeSeconds!==undefined?{studyTimeSeconds:profile.studyTimeSeconds}:{}),...(profile.lastStudyDate?{lastStudyDate:profile.lastStudyDate}:{}),totalWordsLearned:Object.keys(state.progress).length};
      state.activities[canonical.activity.dateKey]=canonical.activity;transaction.objectStore('states').put(state);
    }
  } else if (canonical && operation.event) {
    const state = await request<LocalState | undefined>(transaction.objectStore("states").get(operation.owner));
    if (state && state.progress[operation.event.wordId]?.lastOperationId === operation.event.id) {
      state.progress[operation.event.wordId] = canonical; transaction.objectStore("states").put(state);
    }
  }
  await done;
};
export const saveDraft = async (draft: SessionDraft, owner = getActiveOwner()) => {
  draft = parseSessionDraft(draft);
  const db = await open(); const transaction = db.transaction("drafts", "readwrite"); const done = completed(transaction);
  transaction.objectStore("drafts").put({ id: `${owner}:${draft.kind}`, owner, draft }); await done;
};
export const getDraft = async (kind: SessionDraft["kind"], owner = getActiveOwner()): Promise<SessionDraft | null> => {
  const db = await open(); const result = await request<{ draft: SessionDraft } | undefined>(db.transaction("drafts").objectStore("drafts").get(`${owner}:${kind}`));
  return result?.draft ? parseSessionDraft(result.draft) : null;
};
export const getAllDrafts = async (owner = getActiveOwner()) => (await getAll<{ draft: SessionDraft }>("drafts", owner)).map((record) => parseSessionDraft(record.draft));
export const clearDraft = async (kind: SessionDraft["kind"], owner = getActiveOwner()) => {
  const db = await open(); const transaction = db.transaction("drafts", "readwrite"); const done = completed(transaction);
  transaction.objectStore("drafts").delete(`${owner}:${kind}`); await done;
};
const invalidateDeviceLearningDrafts = (owner: string) => {
  for (const key of ['eng_master_today_learning_v1', 'eng_master_workplace_draft_v1','eng_master_workplace_draft_v2']) localStorage.removeItem(ownerKeyFor(key, owner));
  localStorage.setItem(ownerKeyFor('eng_master_local_dataset_revision_v1', owner), crypto.randomUUID());
};
export const replaceLocalDataset = async (state: Omit<LocalState, "version">, events: StudyEvent[] = []) => {
  const db = await open(); const transaction = db.transaction(["states", "events", "drafts", "outbox"], "readwrite"); const done = completed(transaction);
  for (const name of ["events", "drafts", "outbox"]) {
    const keys = await request(transaction.objectStore(name).index("owner").getAllKeys(state.owner));
    keys.forEach((key) => transaction.objectStore(name).delete(key));
  }
  const sessionKeys=await request(transaction.objectStore('events').index('owner').getAllKeys([state.owner,'sessions']));sessionKeys.forEach(key=>transaction.objectStore('events').delete(key));
  transaction.objectStore("states").put({ ...state, version: 1 });
  events.forEach((event) => transaction.objectStore("events").put({ id: `${state.owner}:${event.id}`, owner: state.owner, event }));
  state.profile.history?.forEach(log=>transaction.objectStore('events').put({id:sessionKey(state.owner,log.id),owner:[state.owner,'sessions'],log}));
  await done; eventCache.set(state.owner, events);
  // Device-only learning drafts cannot cross a dataset replacement/reset.
  invalidateDeviceLearningDrafts(state.owner);
};
export const migrateGuestStorage = async (profile: UserProfile, progress: UserProgress, activities: Record<string, DailyActivity>) => {
  const existing = await loadLocalState("guest");
  if (existing) return existing;
  // Keep the original localStorage snapshot for rollback; it is never deleted during migration.
  const state = { owner: "guest", version: 1 as const, profile, progress, activities };
  await saveLocalState(state); return state;
};
export const preferencePayload = () => {
  const keys = ["eng_master_custom_words_v1", "eng_master_favorites_v1", "eng_master_decks_v1", "eng_master_study_size_v1", "eng_master_reminder_hour_v1", "eng_master_roadmap_v1", "eng_master_practice_records_v1","eng_master_extended_practice_v1"];
  return Object.fromEntries(keys.map((key) => [key, localStorage.getItem(ownerKey(key))]));
};

export const resetLocalWord = async (owner: string, wordId: string, cloud: boolean) => {
  const db = await open(); const transaction = db.transaction(['states','outbox','drafts'],'readwrite'); const done=completed(transaction);
  const state=await request<LocalState | undefined>(transaction.objectStore('states').get(owner));
  if (!state) throw new Error('Không tìm thấy dữ liệu học.');
  delete state.progress[wordId];state.profile.totalWordsLearned=Object.keys(state.progress).length;transaction.objectStore('states').put(state);
  const drafts=await request<{id:string;draft:SessionDraft}[]>(transaction.objectStore('drafts').index('owner').getAll(owner));
  drafts.filter(record=>record.draft.wordIds.includes(wordId)).forEach(record=>transaction.objectStore('drafts').delete(record.id));
  if(cloud)transaction.objectStore('outbox').put({id:owner+':reset:'+crypto.randomUUID(),owner,generation:state.profile.datasetGeneration || 'legacy',kind:'reset-word',payload:{wordId},attempts:0,nextAttemptAt:0,queuedAt:Date.now()} satisfies PendingOperation);
  await done;return state;
};

export const mergeCloudProgress = async (owner: string, cloud: UserProgress): Promise<LocalState | null> => {
  const db=await open();const tx=db.transaction(['states','outbox'],'readwrite');const done=completed(tx);
  const [state,pending]=await Promise.all([request<LocalState | undefined>(tx.objectStore('states').get(owner)),request<PendingOperation[]>(tx.objectStore('outbox').index('owner').getAll(owner))]);
  if(!state){await done;return null;}
  const progress={...cloud};
  for (const [id,item] of Object.entries(progress)) if((state.progress[id]?.revision || 0)>(item.revision || 0))progress[id]=state.progress[id];
  pending.sort((a,b)=>(a.queuedAt||0)-(b.queuedAt||0)).forEach(op=>{if(op.event)progress[op.event.wordId]=state.progress[op.event.wordId] || op.event.after;if(op.kind==='reset-word'&&typeof op.payload?.wordId==='string')delete progress[op.payload.wordId];});
  state.progress=progress;state.profile.totalWordsLearned=Object.keys(progress).length;tx.objectStore('states').put(state);await done;return state;
};

// Preserve the entire old namespace, including unsent operations and drafts,
// before adopting a dataset activated on another device. Nothing is replayed
// against the new generation automatically.
export const archiveLocalDataset = async (owner: string) => {
  const archiveOwner=owner+':archive:'+crypto.randomUUID();
  const db=await open();const tx=db.transaction(['states','events','outbox','drafts'],'readwrite');const done=completed(tx);
  const state=await request<LocalState | undefined>(tx.objectStore('states').get(owner));
  if(!state){await done;return null;}
  const preferenceKeys=['eng_master_custom_words_v1','eng_master_favorites_v1','eng_master_decks_v1','eng_master_study_size_v1','eng_master_reminder_hour_v1','eng_master_roadmap_v1','eng_master_practice_records_v1','eng_master_extended_practice_v1'];
  const preferences=Object.fromEntries(preferenceKeys.map(key=>[key,localStorage.getItem(owner==='guest'?key:`eng_master_owner_${encodeURIComponent(owner)}_${key}`)]));
  const deviceDrafts=Object.fromEntries(['eng_master_today_learning_v1','eng_master_workplace_draft_v1','eng_master_workplace_draft_v2','eng_master_local_dataset_revision_v1'].map(key=>[key,localStorage.getItem(ownerKeyFor(key,owner))]));
  tx.objectStore('states').put({...state,owner:archiveOwner,sourceOwner:owner,archivedAt:new Date().toISOString(),preferences,deviceDrafts});
  tx.objectStore('states').delete(owner);
  for(const name of ['events','outbox','drafts']) {
    const records=await request<{id:string;owner:string}[]>(tx.objectStore(name).index('owner').getAll(owner));
    for(const record of records){tx.objectStore(name).put({...record,id:archiveOwner+record.id.slice(owner.length),owner:archiveOwner});tx.objectStore(name).delete(record.id);}
  }
  const sessions=await request<{id:string;log:StudySessionLog}[]>(tx.objectStore('events').index('owner').getAll([owner,'sessions']));
  for(const row of sessions){tx.objectStore('events').put({...row,id:sessionKey(archiveOwner,row.log.id),owner:[archiveOwner,'sessions']});tx.objectStore('events').delete(row.id);}
  await done;eventCache.set(archiveOwner,getCachedEvents(owner));eventCache.set(owner,[]);
  invalidateDeviceLearningDrafts(owner);
  return archiveOwner;
};

export interface LocalArchive extends LocalState { sourceOwner: string; archivedAt: string; preferences: Record<string, string | null>; deviceDrafts?: Record<string, string | null>; }
export const getLocalArchives = async (owner: string) => {
  const db=await open();const rows=await request<LocalArchive[]>(db.transaction('states').objectStore('states').getAll());
  return rows.filter(row=>row.sourceOwner===owner).sort((a,b)=>b.archivedAt.localeCompare(a.archivedAt));
};
