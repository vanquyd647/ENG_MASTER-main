import { createExamDraft, examRecords, collectExamResults } from '../domain/fullExam';
import { parseExtendedPracticeRecords } from '../domain/extendedPracticeRecords';
import { readAccountSettings, splitAccountSettings } from '../repositories/accountSettings';
import { restoreBackupPreferences } from './productPreferences';
import { removeUnusedDatasets } from '../repositories/datasetRetention';
import { getCompleteCloudEvents } from '../repositories/cloudHistory';
import { applyCloudStudy } from "../repositories/cloudRepository";
// @vitest-environment node
import { initializeApp, deleteApp, type FirebaseApp } from "firebase/app";
import { connectFirestoreEmulator, getFirestore, doc, setDoc, deleteDoc, writeBatch, getDoc, getDocs, collection, terminate, type Firestore } from "firebase/firestore";
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { VOCABULARY } from "../data/vocabulary";
import { createBackup, normalizeBackup } from "./backup";
import type { UserProfile } from "../types";

const runtime = vi.hoisted(() => ({ db: null as Firestore | null, commits: 0, failCommitAt: 0 }));
vi.mock("./firebase", () => ({ get db() { return runtime.db; } }));
vi.mock("firebase/firestore", async (importOriginal) => {
  const actual = await importOriginal<typeof import("firebase/firestore")>();
  return { ...actual, writeBatch: (db: Firestore) => {
    const batch = actual.writeBatch(db);
    const commit = batch.commit.bind(batch);
    batch.commit = async () => {
      runtime.commits++;
      if (runtime.commits === runtime.failCommitAt) throw new Error("Injected restore interruption");
      return commit();
    };
    return batch;
  } };
});
import { recordCloudSession, replaceCloudProgress, resetCloudProgress, saveCloudProgressItem } from "./persistence";
import { abortDatasetReplacement, beginDatasetReplacement, datasetCollectionPath, getCachedGeneration } from '../repositories/cloudDataset';
import { rollbackCloudDataset } from './datasetPersistence';

const emulatorAddress = process.env.FIRESTORE_EMULATOR_HOST;
describe.skipIf(!emulatorAddress)("Firestore Emulator: actual SDK and project security rules", () => {
  let app: FirebaseApp;
  let db: Firestore;
  const profile: UserProfile = { uid: "emulator-user", email: "test@example.test", displayName: "Emulator", totalWordsLearned: 0, studyTimeMinutes: 0, streak: 0, dailyGoal: 15 };
  const item = { easiness: 2.5, interval: 1, repetitions: 1, nextReviewDate: "2026-10-14T00:00:00.000Z" };
  beforeAll(() => {
    const [host, port] = emulatorAddress!.split(":");
    if (!["127.0.0.1", "localhost"].includes(host)) throw new Error("Tests require a localhost emulator; refusing remote host.");
    app = initializeApp({ projectId: "demo-eng-master", apiKey: "demo-key", appId: "demo-app" }, `emulator-${crypto.randomUUID()}`);
    db = getFirestore(app);
    connectFirestoreEmulator(db, host, Number(port), { mockUserToken: { sub: profile.uid, email: profile.email } });
    runtime.db = db;
  });
  beforeEach(async () => {
    runtime.failCommitAt = 0;
    localStorage.clear();
    const cleared=await fetch(`http://${emulatorAddress}/emulator/v1/projects/demo-eng-master/databases/(default)/documents`,{method:'DELETE'});
    if(!cleared.ok)throw Error('Could not reset isolated demo emulator');
    await setDoc(doc(db, "users", profile.uid), profile);
    runtime.commits = 0;
  });
  afterAll(async () => { if (db) await terminate(db); if (app) await deleteApp(app); });

  it('isolates extended learning from old clients and round-trips it through replacement and rollback',async()=>{
    const now=new Date().toISOString();
    const row={id:'reading-v2',bankVersion:2,kind:'part7',startedAt:now,finishedAt:now,durationSeconds:0,answers:[{questionId:'p7-v2-store-1',selectedIndex:0}]};
    const values={eng_master_extended_practice_v1:JSON.stringify([row])};
    await setDoc(doc(db,'users/'+profile.uid+'/settings','extendedLearning'),{values,updatedAt:now});
    await setDoc(doc(db,'users/'+profile.uid+'/settings','learning'),{values:{eng_master_practice_records_v1:'[]'},updatedAt:now});
    expect((await readAccountSettings(profile.uid,'legacy')).eng_master_extended_practice_v1).toBe(values.eng_master_extended_practice_v1);
    expect(splitAccountSettings({eng_master_extended_practice_v1:null})).not.toHaveProperty('extendedLearning');
    await expect(setDoc(doc(db,'users/'+profile.uid+'/settings','learning'),{values,updatedAt:now})).rejects.toMatchObject({code:'permission-denied'});
    await expect(setDoc(doc(db,'users/'+profile.uid+'/settings','extendedLearning'),{values:{eng_master_extended_practice_v1:12},updatedAt:now})).rejects.toMatchObject({code:'permission-denied'});
    const partial=createBackup(profile,{});
    const first=await replaceCloudProgress(profile,partial);
    expect((await readAccountSettings(profile.uid,first.datasetGeneration!)).eng_master_extended_practice_v1).toBe(values.eng_master_extended_practice_v1);
    const full={...createBackup(first,{}),version:4 as const,extendedPracticeRecords:[{...row,bankVersion:2 as const,kind:'part7' as const}]};
    const second=await replaceCloudProgress(first,full);restoreBackupPreferences(full);
    expect((await readAccountSettings(profile.uid,second.datasetGeneration!)).eng_master_extended_practice_v1).toBe(values.eng_master_extended_practice_v1);
    const third=await rollbackCloudDataset(second);
    expect((await readAccountSettings(profile.uid,third.datasetGeneration!)).eng_master_extended_practice_v1).toBe(values.eng_master_extended_practice_v1);
    await expect(getDoc(doc(db,'users/other/settings/extendedLearning'))).rejects.toMatchObject({code:'permission-denied'});
  },30000);
  it('exports complete Cloud history beyond a single 500-document page',async()=>{
    const base={wordId:'rec-01',sessionId:'history-session',mode:'review',quality:4,occurredAt:new Date().toISOString(),timeZone:'Asia/Ho_Chi_Minh',durationSeconds:1,before:null,after:item};
    for(let offset=0;offset<501;offset+=200){const batch=writeBatch(db);for(let i=offset;i<Math.min(offset+200,501);i++)batch.set(doc(db,'users/'+profile.uid+'/events','history:'+i),{...base,id:'history:'+i});await batch.commit();}
    const events=await getCompleteCloudEvents(profile.uid,'legacy');expect(events).toHaveLength(501);expect(new Set(events.map(event=>event.id)).size).toBe(501);
  },30_000);
  it('stores bounded quiz evidence and roadmap/results preferences, and rejects malformed attempts',async()=>{
    const attempt={questionId:'rec-01:standard',questionType:'mcq',questionText:'Chọn nghĩa',userAnswer:'sai',correctAnswer:'đúng',options:['đúng','sai','a','b'],explanation:'Vì sao',word:'agreement',meaning:'thỏa thuận'};
    const event={id:'quiz:word',wordId:'rec-01',sessionId:'quiz',mode:'quiz',correct:false,occurredAt:new Date().toISOString(),timeZone:'Asia/Ho_Chi_Minh',durationSeconds:2,before:null,after:item,attempt};
    await setDoc(doc(db,'users/'+profile.uid+'/events',event.id),event);
    expect((await getCompleteCloudEvents(profile.uid,'legacy'))[0].attempt).toEqual(attempt);
    await expect(setDoc(doc(db,'users/'+profile.uid+'/events','bad'),{...event,id:'bad',attempt:{...attempt,options:['a']}})).rejects.toMatchObject({code:'permission-denied'});
    await setDoc(doc(db,'users/'+profile.uid+'/settings','learning'),{values:{eng_master_roadmap_v1:'{"version":1,"examDate":"2026-11-14","targetScore":650,"minutesPerDay":20,"targetWords":50}',eng_master_practice_records_v1:'[]'},updatedAt:new Date().toISOString()});
    const result=await replaceCloudProgress(profile,createBackup(profile,{'rec-01':item}));
    expect((await getDoc(doc(db,datasetCollectionPath(profile.uid,'settings'),'learning'))).data()?.values).toHaveProperty('eng_master_roadmap_v1');
    await expect(getCompleteCloudEvents(profile.uid,'legacy')).rejects.toMatchObject({code:'dataset-changed'});
    expect(result.datasetGeneration).toBeTruthy();
  },30_000);
  it('round-trips a full 200-question result through the existing Cloud settings contract and backup v4',async()=>{
    const now=Date.now(),rows=examRecords(createExamDraft('emulator',now-1000),now);
    const values={eng_master_extended_practice_v1:JSON.stringify(rows)};
    await setDoc(doc(db,'users/'+profile.uid+'/settings','extendedLearning'),{values,updatedAt:new Date(now).toISOString()});
    const cloud=await readAccountSettings(profile.uid,'legacy');
    const parsed=parseExtendedPracticeRecords(JSON.parse(cloud.eng_master_extended_practice_v1!));
    expect(collectExamResults(parsed)[0]).toMatchObject({complete:true,unanswered:200});
    const backup=normalizeBackup({...createBackup(profile,{}),version:4,extendedPracticeRecords:parsed});
    expect(backup.version).toBe(4);if(backup.version===2)throw Error('Expected extended backup');
    expect(backup.extendedPracticeRecords).toHaveLength(7);
    await expect(getDoc(doc(db,'users/other/settings/extendedLearning'))).rejects.toMatchObject({code:'permission-denied'});
  });
  it('cleans only unused generations and security rules protect the active and rollback manifests',async()=>{
    const first=await replaceCloudProgress(profile,createBackup(profile,{'rec-01':item}));
    const second=await replaceCloudProgress(first,createBackup(first,{'rec-02':item}));
    const third=await replaceCloudProgress(second,createBackup(second,{'rec-03':item}));
    await expect(deleteDoc(doc(db,'users/'+profile.uid+'/datasets',second.datasetGeneration!))).rejects.toMatchObject({code:'permission-denied'});
    await expect(deleteDoc(doc(db,'users/'+profile.uid+'/datasets',third.datasetGeneration!))).rejects.toMatchObject({code:'permission-denied'});
    expect(await removeUnusedDatasets(profile.uid)).toBe(1);
    expect((await getDoc(doc(db,'users/'+profile.uid+'/datasets',first.datasetGeneration!))).exists()).toBe(false);
    expect((await getDoc(doc(db,datasetCollectionPath(profile.uid,'progress'),'rec-03'))).exists()).toBe(true);
  },30_000);
  it("persists review history without optional counts and applies a session once", async () => {
    const input = { profile, log: { id: "emulator-review", date: "2026-10-13T02:00:00.000Z", type: "review" as const, details: "Review", correctCount: undefined }, wordIds: [VOCABULARY[0].id], timeZone: "Asia/Ho_Chi_Minh" };
    await saveCloudProgressItem(profile.uid, VOCABULARY[0].id, { ...item, lastOperationId: "operation:1" }, 1);
    await recordCloudSession(input);
    await recordCloudSession(input);
    const saved = (await getDoc(doc(db, "users", profile.uid))).data()!;
    expect(saved.history).toHaveLength(1);
    expect(saved.history[0]).not.toHaveProperty("correctCount");
    expect(saved.streak).toBe(1);
    const activity = (await getDoc(doc(db, `users/${profile.uid}/dailyActivity`, "2026-10-13"))).data()!;
    expect(activity.wordIds).toEqual(input.wordIds);
  }, 20_000);

  it("rejects writes and reads owned by another account", async () => {
    await expect(getDoc(doc(db, "users", "other-user"))).rejects.toMatchObject({ code: "permission-denied" });
    await expect(setDoc(doc(db, "users", "other-user"), { ...profile, uid: "other-user" })).rejects.toMatchObject({ code: "permission-denied" });
  }, 20_000);

  it('accumulates short Cloud sessions once even when profile history no longer contains the old session',async()=>{
    const log={id:'short-a',type:'quiz' as const,date:'2026-10-14T02:00:00.000Z',details:'Short session',durationSeconds:35,wordIds:[]};
    await recordCloudSession({profile,log,wordIds:[]});await recordCloudSession({profile,log:{...log,id:'short-b',durationSeconds:40},wordIds:[]});
    const saved=(await getDoc(doc(db,'users',profile.uid))).data()!;
    expect(saved.studyTimeSeconds).toBe(75);expect(saved.studyTimeMinutes).toBe(1);
    await setDoc(doc(db,'users',profile.uid),{...saved,history:[]});
    await recordCloudSession({profile,log,wordIds:[]});
    expect((await getDoc(doc(db,'users',profile.uid))).data()?.studyTimeSeconds).toBe(75);
  },20_000);

  it('applies a duplicate event once and concurrent ratings against the latest Cloud revision',async()=>{
    const base={wordId:VOCABULARY[0].id,sessionId:'concurrent-session',mode:'review' as const,quality:4,occurredAt:'2026-10-13T03:00:00.000Z',timeZone:'Asia/Ho_Chi_Minh',durationSeconds:10,before:null,after:item};
    await Promise.all([applyCloudStudy(profile.uid,{...base,id:'session:once'}),applyCloudStudy(profile.uid,{...base,id:'session:once'})]);
    expect((await getDocs(collection(db,'users/'+profile.uid+'/events'))).size).toBe(1);
    await Promise.all([applyCloudStudy(profile.uid,{...base,id:'session:two'}),applyCloudStudy(profile.uid,{...base,id:'session:three'})]);
    const saved=(await getDoc(doc(db,'users/'+profile.uid+'/progress',base.wordId))).data()!;
    expect(saved.repetitions).toBe(3);expect(saved.revision).toBe(3);expect((await getDoc(doc(db,'users',profile.uid))).data()!.totalWordsLearned).toBe(1);
  },30_000);

  it('rejects invalid bounds, event IDs, ownership and client quota writes',async()=>{
    await expect(setDoc(doc(db,'users/'+profile.uid+'/progress','bad'),{...item,userId:profile.uid,wordId:'bad',easiness:1})).rejects.toMatchObject({code:'permission-denied'});
    await expect(setDoc(doc(db,'users/'+profile.uid+'/sessions','bad'),{id:'bad',date:new Date().toISOString(),type:'quiz',details:'bad',correctCount:5,totalQuestions:2})).rejects.toMatchObject({code:'permission-denied'});
    await expect(setDoc(doc(db,'_systemRateLimits','client'),{count:0})).rejects.toMatchObject({code:'permission-denied'});
    await expect(setDoc(doc(db,'users/other-user/settings','preferences'),{values:{},updatedAt:new Date().toISOString()})).rejects.toMatchObject({code:'permission-denied'});
    const base={id:'actual-id',wordId:VOCABULARY[0].id,sessionId:'valid-session',mode:'review',occurredAt:new Date().toISOString(),timeZone:'Asia/Ho_Chi_Minh',durationSeconds:10,before:null,after:item};
    await expect(setDoc(doc(db,'users/'+profile.uid+'/events','different-id'),base)).rejects.toMatchObject({code:'permission-denied'});
    await setDoc(doc(db,'users/'+profile.uid+'/events',base.id),base);
    await expect(setDoc(doc(db,'users/'+profile.uid+'/events',base.id),{...base,durationSeconds:15})).rejects.toMatchObject({code:'permission-denied'});
  },20_000);

  it("restores original Cloud documents after an interruption beyond the first 400 writes", async () => {
    await saveCloudProgressItem(profile.uid, VOCABULARY[0].id, item, 1);
    runtime.commits = 0;
    runtime.failCommitAt = 3;
    const backup = createBackup(null, Object.fromEntries(VOCABULARY.slice(1, 426).map((word) => [word.id, item])));
    await expect(replaceCloudProgress(profile, backup)).rejects.toThrow(/giữ nguyên/);
    const progress = await getDocs(collection(db, `users/${profile.uid}/progress`));
    expect(progress.docs.map((snapshot) => snapshot.id)).toEqual([VOCABULARY[0].id]);
    expect((await getDoc(doc(db, "users", profile.uid))).data()!.totalWordsLearned).toBe(1);
    expect(localStorage.length).toBe(0);
  }, 30_000);

  it('activates a complete replacement atomically and rejects a stale device after reset',async()=>{
    await saveCloudProgressItem(profile.uid,'rec-01',item,1);
    const before=await getDoc(doc(db,'users/'+profile.uid+'/progress','rec-01'));
    const imported=await replaceCloudProgress(profile,createBackup(profile,{'rec-02':{...item,repetitions:4}}));
    const generation=getCachedGeneration(profile.uid);
    expect(generation).not.toBe('legacy');
    expect(imported.datasetGeneration).toBe(generation);
    expect((await getDocs(collection(db,datasetCollectionPath(profile.uid,'progress')))).docs.map(doc=>doc.id)).toEqual(['rec-02']);
    expect((await getDoc(before.ref)).data()).toEqual(before.data());
    const base={id:'stale:rating',wordId:'rec-01',sessionId:'stale-session',mode:'review' as const,quality:4,occurredAt:new Date().toISOString(),timeZone:'Asia/Ho_Chi_Minh',durationSeconds:10,before:null,after:item};
    await expect(applyCloudStudy(profile.uid,base,'legacy')).rejects.toMatchObject({code:'dataset-changed'});
    await expect(setDoc(doc(db,'users/'+profile.uid+'/progress','rec-03'),{...item,userId:profile.uid,wordId:'rec-03'})).rejects.toMatchObject({code:'permission-denied'});
    const reset=await resetCloudProgress(imported);
    expect(reset.totalWordsLearned).toBe(0);
    expect(getCachedGeneration(profile.uid)).not.toBe(generation);
    await expect(applyCloudStudy(profile.uid,base,generation)).rejects.toMatchObject({code:'dataset-changed'});
    expect((await getDocs(collection(db,datasetCollectionPath(profile.uid,'progress')))).empty).toBe(true);
    const resetGeneration=getCachedGeneration(profile.uid);
    const rolledBack=await rollbackCloudDataset(reset);
    expect(rolledBack.totalWordsLearned).toBe(1);
    expect(getCachedGeneration(profile.uid)).not.toBe(generation);
    expect(getCachedGeneration(profile.uid)).not.toBe(resetGeneration);
    expect((await getDoc(doc(db,datasetCollectionPath(profile.uid,'progress'),'rec-02'))).data()?.repetitions).toBe(4);
    await expect(applyCloudStudy(profile.uid,base,resetGeneration)).rejects.toMatchObject({code:'dataset-changed'});
  },30_000);

  it('serializes restore jobs and rejects normal writes while a replacement is preparing',async()=>{
    const replacement=await beginDatasetReplacement(profile.uid);
    await expect(beginDatasetReplacement(profile.uid)).rejects.toMatchObject({code:'dataset-busy'});
    await expect(saveCloudProgressItem(profile.uid,'rec-01',item,1)).rejects.toMatchObject({code:'dataset-busy'});
    await expect(setDoc(doc(db,'users/'+profile.uid+'/progress','rec-01'),{...item,userId:profile.uid,wordId:'rec-01'})).rejects.toMatchObject({code:'permission-denied'});
    await expect(setDoc(doc(db,'users/'+profile.uid+'/system','dataset'),{active:replacement.generation,pending:null,previous:'legacy',updatedAt:new Date().toISOString()})).rejects.toMatchObject({code:'permission-denied'});
    await abortDatasetReplacement(profile.uid,replacement);
    await saveCloudProgressItem(profile.uid,'rec-01',item,1);
    expect((await getDoc(doc(db,'users/'+profile.uid+'/progress','rec-01'))).exists()).toBe(true);
  },20_000);
});
