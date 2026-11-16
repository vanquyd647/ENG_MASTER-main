import { beforeEach, expect, it } from 'vitest';
import { collectMistakes, parseQuizAttempt } from './mistakes';
import { buildRoadmapDay, parseRoadmap } from './roadmap';
import { VOCABULARY } from '../data/vocabulary';
import { createBackup, normalizeBackup } from '../lib/backup';
import { parseAccountPreferences } from './schemas';
import { restoreBackupPreferences } from '../lib/productPreferences';
import { setActiveOwner, writeOwnerItem, readOwnerItem } from '../repositories/ownerStorage';
import type { StudyEvent } from '../types';
const plan={version:1 as const,examDate:'2026-11-14',targetScore:650,minutesPerDay:20,targetWords:50};
const attempt={questionId:'rec-01:standard',questionType:'mcq' as const,questionText:'Chọn nghĩa',userAnswer:'sai',correctAnswer:'đúng',options:['đúng','sai','a','b'],explanation:'Giải thích',word:'test',meaning:'kiểm tra'};
const after={easiness:2.5,interval:1,repetitions:1,nextReviewDate:'2026-10-14T10:00:00Z'};
const event:StudyEvent={id:'event-1',sessionId:'session-1',wordId:'rec-01',mode:'quiz',correct:false,durationSeconds:2,occurredAt:'2026-10-14T09:00:00Z',timeZone:'Asia/Ho_Chi_Minh',before:null,after,attempt};
beforeEach(()=>{localStorage.clear();setActiveOwner('guest');});
it('groups actual mistakes, resolves the last correct attempt and never fabricates missing historical answers',()=>{
  expect(collectMistakes([{...event,attempt:undefined}])).toEqual([]);
  const rows=collectMistakes([event,{...event,id:'event-2',correct:true,occurredAt:'2026-10-14T10:00:00Z',attempt:{...attempt,userAnswer:'đúng'}}]);
  expect(rows[0]).toMatchObject({resolved:true,wrongAttempts:1,attempt:{userAnswer:'đúng'}});
  expect(()=>parseQuizAttempt({...attempt,options:['đúng','ĐÚNG','sai','a']})).toThrow();
});
it('uses actual due timestamps and avoids new words on or after exam day',()=>{
  const id=VOCABULARY[0].id;
  const today=buildRoadmapDay(plan,VOCABULARY,{[id]:after},'2026-10-14',25,Date.parse('2026-10-14T09:00:00Z'));
  expect(today.reviewCount).toBe(0);expect(today.newCount).toBeGreaterThan(0);
  expect(buildRoadmapDay(plan,VOCABULARY,{},'2026-11-14').newCount).toBe(0);
  expect(buildRoadmapDay(plan,VOCABULARY,{},'2026-11-15').daysLeft).toBe(0);
  expect(()=>parseRoadmap({...plan,examDate:'2026-02-31'})).toThrow();
  expect(()=>parseRoadmap({...plan,minutesPerDay:0})).toThrow();
});
it('keeps roadmap ownership, cloud validation and backup round-trip; old backups preserve it',()=>{
  writeOwnerItem('eng_master_roadmap_v1',JSON.stringify(plan));
  const backup=createBackup(null,{});expect(backup.roadmap).toEqual(plan);
  expect(normalizeBackup(JSON.parse(JSON.stringify(backup)))).toMatchObject({roadmap:plan});
  expect(parseAccountPreferences({eng_master_roadmap_v1:JSON.stringify(plan)})).toBeTruthy();
  setActiveOwner('other');expect(readOwnerItem('eng_master_roadmap_v1')).toBeNull();
  setActiveOwner('guest');const legacy={...backup};delete legacy.roadmap;
  restoreBackupPreferences(legacy);expect(JSON.parse(readOwnerItem('eng_master_roadmap_v1')!)).toEqual(plan);
  expect(()=>parseAccountPreferences({eng_master_roadmap_v1:JSON.stringify({...plan,targetScore:991})})).toThrow();
});
