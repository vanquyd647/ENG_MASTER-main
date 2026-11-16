import 'fake-indexeddb/auto';
import { beforeEach, describe, expect, it } from 'vitest';
import { readGuestBackup, mergeGuestIntoAccount } from './accountMerge';
import { replaceLocalDataset } from '../../repositories/localRepository';
import { createBackup } from '../../lib/backup';
import { setActiveOwner } from '../../repositories/ownerStorage';
const profile={uid:'guest_merge',email:'guest@local',displayName:'Guest',totalWordsLearned:0,studyTimeMinutes:0,streak:0};
const item={easiness:2.5,interval:1,repetitions:1,nextReviewDate:'2026-10-14T00:00:00.000Z'};
beforeEach(async()=>{localStorage.clear();setActiveOwner('guest');await replaceLocalDataset({owner:'guest',profile,progress:{},activities:{}});});
describe('legacy/guest account merge',()=>{
  it('offers favorites-only legacy data without assigning it silently',async()=>{localStorage.setItem('eng_master_favorites_v1','["rec-01"]');const guest=await readGuestBackup();expect(guest?.favorites).toEqual(['rec-01']);expect(Object.keys(guest!.progress)).toHaveLength(0);});
  it('keeps account progress and identity preferences while merging distinct words and favorites',()=>{const account=createBackup({...profile,displayName:'Account'},{'rec-01':{...item,repetitions:5}});const guest={...createBackup(profile,{'rec-01':item,'rec-02':item}),favorites:['rec-02']};const merged=mergeGuestIntoAccount(account,guest);expect(merged.progress['rec-01'].repetitions).toBe(5);expect(merged.progress['rec-02']).toEqual(item);expect(merged.profile?.displayName).toBe('Account');expect(merged.favorites).toContain('rec-02');});
});
it('offers and merges extended-practice-only guest data without losing account records',async()=>{
 const row={id:'guest-reading',bankVersion:2,kind:'part7',startedAt:'2026-10-15T09:00:00Z',finishedAt:'2026-10-15T09:01:00Z',durationSeconds:60,answers:[{questionId:'p7-v2-store-1',selectedIndex:0}]};
 localStorage.setItem('eng_master_extended_practice_v1',JSON.stringify([row]));
 const guest=await readGuestBackup();expect(guest?.version).toBe(4);expect(guest?.extendedPracticeRecords).toHaveLength(1);
 setActiveOwner('merge-account');const account=createBackup({...profile,uid:'merge-account'},{});const merged=mergeGuestIntoAccount(account,guest!);
 expect(merged.version).toBe(4);expect(merged.extendedPracticeRecords?.[0].id).toBe('guest-reading');
});
