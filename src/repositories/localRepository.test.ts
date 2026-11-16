import 'fake-indexeddb/auto';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { archiveLocalDataset, getLocalArchives, commitStudy, commitSession, loadLocalState, saveLocalState, getPendingOperations, getCachedEvents, queueOperation, replaceLocalDataset, saveDraft, getDraft, resetLocalWord, mergeCloudProgress } from './localRepository';
import { flushOperations, resetSyncStatus, withPausedSync } from './syncCoordinator';
import { setActiveOwner, writeOwnerItem, readOwnerItem } from './ownerStorage';
import type { StudyEvent, UserProfile } from '../types';
const profile: UserProfile={uid:'offline-user',email:'offline@example.test',displayName:'Offline',totalWordsLearned:0,studyTimeMinutes:0,streak:0,dailyGoal:15};
const item={easiness:2.5,interval:1,repetitions:1,nextReviewDate:'2026-10-14T00:00:00.000Z'};
const state=(owner:string)=>({owner,profile:{...profile,uid:owner},progress:{},activities:{}});
const event=(id:string,wordId='rec-01'): StudyEvent=>({id,wordId,sessionId:'test-session',mode:'review',quality:4,occurredAt:'2026-10-13T02:00:00.000Z',timeZone:'Asia/Ho_Chi_Minh',durationSeconds:30,before:null,after:{...item,lastOperationId:id}});
afterEach(()=>{setActiveOwner('guest');vi.restoreAllMocks();});
describe('durable owner repository and outbox',()=>{
  it('finishes an in-flight failure before archiving and never recreates retired work',async()=>{
    const owner='archive-during-send';await replaceLocalDataset(state(owner));await commitStudy(state(owner),event('in-flight'),true);
    let reject!: (error:Error)=>void,started!:()=>void;
    const ready=new Promise<void>(resolve=>{started=resolve;});
    const flushing=flushOperations(owner,()=>{started();return new Promise((_resolve,fail)=>{reject=fail;});});await ready;
    let archive:string|null=null;
    const adopting=withPausedSync(owner,async()=>{archive=await archiveLocalDataset(owner);resetSyncStatus(owner);await replaceLocalDataset({...state(owner),profile:{...profile,uid:owner,datasetGeneration:'fresh'}});});
    reject(Object.assign(new Error('Dataset changed'),{code:'dataset-changed'}));await flushing;await adopting;
    expect(await getPendingOperations(owner)).toEqual([]);
    const retired=(await getPendingOperations(archive!))[0];expect(retired.event?.id).toBe('in-flight');
    expect(await queueOperation({...retired,id:owner+':in-flight',owner,attempts:2})).toBe(false);
    expect(await getPendingOperations(owner)).toEqual([]);
  });
  it('accumulates short sessions and deduplicates a session after the visible history is evicted',async()=>{
    const owner='short-sessions';await replaceLocalDataset(state(owner));
    const log={id:'short-a',type:'quiz' as const,date:'2026-10-14T02:00:00.000Z',details:'Short session',durationSeconds:35,wordIds:[]};
    await commitSession(state(owner),log,false);await commitSession(state(owner),{...log,id:'short-b',durationSeconds:40},false);
    const saved=(await loadLocalState(owner))!;
    expect(saved.profile.studyTimeSeconds).toBe(75);expect(saved.profile.studyTimeMinutes).toBe(1);
    await saveLocalState({...saved,profile:{...saved.profile,history:[]}});
    await commitSession(state(owner),log,false);
    expect((await loadLocalState(owner))!.profile.studyTimeSeconds).toBe(75);
    expect(getCachedEvents(owner)).toEqual([]);
  });
  it('archives old-generation state, events, unsent work and drafts before adopting new Cloud data',async()=>{
    const owner='archive-test';setActiveOwner(owner);
    await replaceLocalDataset({...state(owner),profile:{...profile,uid:owner,datasetGeneration:'dataset-old'}});
    writeOwnerItem('eng_master_favorites_v1','["rec-01"]');
    await commitStudy(state(owner),event('old-rating'),true);
    await queueOperation({id:owner+':settings',owner,kind:'preferences',payload:{},attempts:0,nextAttemptAt:0});
    await saveDraft({id:'old-draft',kind:'review-new',wordIds:['rec-01'],cursor:0,completedIds:[],updatedAt:new Date().toISOString()},owner);
    expect((await getPendingOperations(owner)).every(operation=>operation.generation==='dataset-old')).toBe(true);
    const archive=await archiveLocalDataset(owner);
    expect(await loadLocalState(owner)).toBeNull();expect(await getPendingOperations(owner)).toEqual([]);
    expect((await getPendingOperations(archive!))).toHaveLength(2);
    expect((await loadLocalState(archive!))?.progress['rec-01'].repetitions).toBe(1);
    expect((await getDraft('review-new',archive!))?.id).toBe('old-draft');
    expect((await getLocalArchives(owner))[0].preferences.eng_master_favorites_v1).toBe('["rec-01"]');
    await replaceLocalDataset({...state(owner),profile:{...profile,uid:owner,datasetGeneration:'dataset-new'}});
    await commitStudy(state(owner),event('new-rating','rec-02'),true);
    expect((await getPendingOperations(owner))[0].generation).toBe('dataset-new');
    expect((await getPendingOperations(archive!))[0].generation).toBe('dataset-old');
  });
  it('commits progress/event/outbox once and reloads the same owner',async()=>{
    const owner='durable';await replaceLocalDataset(state(owner));
    await commitStudy(state(owner),event('once'),true);await commitStudy(state(owner),event('once'),true);
    const restored=await loadLocalState(owner);expect(restored?.progress['rec-01'].repetitions).toBe(1);expect(getCachedEvents(owner)).toHaveLength(1);expect(await getPendingOperations(owner)).toHaveLength(1);
  });
  it('isolates guest, account A and account B including preferences and drafts',async()=>{
    for(const owner of ['guest','account-a','account-b'])await replaceLocalDataset(state(owner));
    await commitStudy(state('account-a'),event('owned'),true);
    setActiveOwner('account-a');writeOwnerItem('eng_master_favorites_v1','["rec-01"]');await saveDraft({id:'draft-a',kind:'review-new',wordIds:['rec-01'],cursor:0,completedIds:[],updatedAt:new Date().toISOString()});
    setActiveOwner('account-b');expect(readOwnerItem('eng_master_favorites_v1')).toBeNull();expect(await getDraft('review-new')).toBeNull();expect((await loadLocalState('account-b'))?.progress).toEqual({});expect(await getPendingOperations('guest')).toHaveLength(0);
  });
  it('preserves distinct word writes and applies two stale-tab ratings to latest local SRS',async()=>{
    const owner='tabs';await replaceLocalDataset(state(owner));
    await Promise.all([commitStudy(state(owner),event('first','rec-01'),true),commitStudy(state(owner),event('second','rec-02'),true)]);
    await commitStudy(state(owner),event('third','rec-01'),true);
    const restored=await loadLocalState(owner);expect(Object.keys(restored!.progress)).toHaveLength(2);expect(restored?.progress['rec-01'].repetitions).toBe(2);expect(restored?.progress['rec-01'].revision).toBe(2);
  });
  it('holds offline operations, retries without losing order, and does not acknowledge newer work',async()=>{
    const owner='retry';await replaceLocalDataset(state(owner));await commitStudy(state(owner),event('z-first'),true);await commitStudy(state(owner),event('a-second'),true);
    vi.spyOn(navigator,'onLine','get').mockReturnValue(false);const send=vi.fn().mockResolvedValue({...item,lastOperationId:'z-first'});await flushOperations(owner,send);expect(send).not.toHaveBeenCalled();
    vi.spyOn(navigator,'onLine','get').mockReturnValue(true);const calls:string[]=[];await flushOperations(owner,async op=>{calls.push(op.event!.id);if(calls.length===1){expect((await loadLocalState(owner))!.progress['rec-01'].lastOperationId).toBe('a-second');}return {...item,lastOperationId:op.event!.id};});
    expect(calls).toEqual(['z-first','a-second']);expect(await getPendingOperations(owner)).toHaveLength(0);expect((await loadLocalState(owner))?.progress['rec-01'].lastOperationId).toBe('a-second');
  });
  it('leaves failed sends pending with backoff and resets only the owner word',async()=>{
    const owner='failed';await replaceLocalDataset(state(owner));await commitStudy(state(owner),event('pending'),true);
    await flushOperations(owner,async()=>{throw new Error('network');});const pending=await getPendingOperations(owner);expect(pending[0].attempts).toBe(1);expect(pending[0].nextAttemptAt).toBeGreaterThan(Date.now());
    await resetLocalWord(owner,'rec-01',true);expect((await loadLocalState(owner))?.progress).toEqual({});expect(getCachedEvents(owner)).toHaveLength(1);expect((await getPendingOperations(owner)).some(op=>op.kind==='reset-word')).toBe(true);
  });
  it('merges Cloud without overwriting pending answers and folds a session once',async()=>{
    const owner='merge';await replaceLocalDataset(state(owner));await commitStudy(state(owner),event('local'),true);const merged=await mergeCloudProgress(owner,{'rec-01':{...item,repetitions:9},'rec-02':item});expect(merged?.progress['rec-01'].lastOperationId).toBe('local');expect(merged?.progress['rec-02']).toEqual(item);
    const log={id:'log-once',date:'2026-10-13T02:00:00.000Z',type:'review' as const,details:'Partial review',wordIds:['rec-01'],studiedCount:1,durationSeconds:30};await commitSession(state(owner),log,true);await commitSession(state(owner),log,true);expect((await loadLocalState(owner))?.profile.history).toHaveLength(1);
    await queueOperation({id:'pref-old',owner,kind:'preferences',payload:{},attempts:0,nextAttemptAt:0});await queueOperation({id:'pref-new',owner,kind:'preferences',payload:{},attempts:0,nextAttemptAt:0});expect((await getPendingOperations(owner)).filter(op=>op.kind==='preferences')).toHaveLength(2);
  });
});
it('archives device-only learning drafts before a replacement and clears only the replaced owner', async () => {
  const owner='today-replacement'; setActiveOwner(owner); await replaceLocalDataset(state(owner));
  const revision=readOwnerItem('eng_master_local_dataset_revision_v1');
  writeOwnerItem('eng_master_today_learning_v1','today-before'); writeOwnerItem('eng_master_workplace_draft_v1','practice-before');
  setActiveOwner('unrelated-today'); writeOwnerItem('eng_master_today_learning_v1','keep-me'); setActiveOwner(owner);
  await archiveLocalDataset(owner);
  expect(readOwnerItem('eng_master_today_learning_v1')).toBeNull(); expect(readOwnerItem('eng_master_workplace_draft_v1')).toBeNull();
  expect((await getLocalArchives(owner))[0].deviceDrafts).toMatchObject({eng_master_today_learning_v1:'today-before',eng_master_workplace_draft_v1:'practice-before'});
  await replaceLocalDataset(state(owner));
  expect(readOwnerItem('eng_master_today_learning_v1')).toBeNull(); expect(readOwnerItem('eng_master_workplace_draft_v1')).toBeNull();
  expect(readOwnerItem('eng_master_local_dataset_revision_v1')).not.toBe(revision);
  setActiveOwner('unrelated-today'); expect(readOwnerItem('eng_master_today_learning_v1')).toBe('keep-me');
});
