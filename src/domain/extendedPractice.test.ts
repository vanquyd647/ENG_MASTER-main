import { beforeEach, expect, it, vi } from 'vitest';
vi.mock('../lib/firebase',()=>({auth:{currentUser:null},db:{}}));
import { EXTENDED_PRACTICE_BANK, GRAMMAR_LESSONS, READING_PASSAGES } from '../data/extendedPractice';
import { EXTENDED_PRACTICE_INDEX } from '../data/extendedPracticeIndex';
import { ALL_PRACTICE_QUESTIONS,questionById } from '../data/learningContent';
import { PRACTICE_BANK } from '../data/workplacePractice';
import { parsePracticeRecords } from './practiceRecords';
import { parseExtendedPracticeRecords, type ExtendedPracticeRecord } from './extendedPracticeRecords';
import { collectPracticeMistakes, selectPracticeQuestions,learningPracticeResult } from './practiceLearning';
import { createBackup, mergeBackup, normalizeBackup } from '../lib/backup';
import { restoreBackupPreferences } from '../lib/productPreferences';
import { splitAccountSettings } from '../repositories/accountSettings';
import { createPracticeDraft, readPracticeDraft, readLearningRecords, savePracticeDraft, savePracticeRecord } from '../repositories/practiceStore';
import { getActiveOwner, ownerKey, readOwnerItem, setActiveOwner, writeOwnerItem } from '../repositories/ownerStorage';
import { cacheGeneration } from '../repositories/cloudDataset';
const q=EXTENDED_PRACTICE_BANK.find(row=>row.kind==='part6')!;
export const extendedRecord:ExtendedPracticeRecord={id:'extended-example',bankVersion:2,kind:'part6',startedAt:'2026-10-15T10:00:00Z',finishedAt:'2026-10-15T10:01:00Z',durationSeconds:60,answers:[{questionId:q.id,selectedIndex:null}]};
beforeEach(()=>{localStorage.clear();setActiveOwner('guest');});
it('replaces an ambiguous route item for new attempts while preserving released answers and backup history',async()=>{
 const old={id:'old-route',bankVersion:1 as const,kind:'part5' as const,startedAt:'2026-10-15T10:00:00Z',finishedAt:'2026-10-15T10:01:00Z',durationSeconds:60,answers:[{questionId:'p5-v1-16',selectedIndex:1}]};
 expect(questionById.get('p5-v1-16')?.prompt).toBe('This is the _____ route to the airport.');
 expect(ALL_PRACTICE_QUESTIONS.some(q=>q.id==='p5-v1-16')).toBe(false);
 expect(learningPracticeResult(parsePracticeRecords([old])[0]).correct).toBe(1);
 await savePracticeRecord(old);const backup=normalizeBackup(JSON.parse(JSON.stringify(createBackup(null,{}))));
 expect(backup.version).not.toBe(2);if(backup.version===2)throw Error('wrong version');expect(backup.practiceRecords?.[0].answers[0].questionId).toBe('p5-v1-16');
 expect(()=>createPracticeDraft('part5',['p5-v1-16'])).toThrow();
 const draft=createPracticeDraft('part5',['p5-reviewed-v1-route']);expect(draft.bankVersion).toBe(2);
 expect(parseExtendedPracticeRecords([{...old,bankVersion:2,answers:[{questionId:draft.questionIds[0],selectedIndex:1}]}])).toHaveLength(1);
});
it('keeps the 60 original questions and validates the 106 additional question contracts/compact registry',()=>{
 expect(PRACTICE_BANK).toHaveLength(60);expect(ALL_PRACTICE_QUESTIONS.filter(q=>!q.listeningId&&!q.id.includes('-exam-v1-')&&!q.id.includes('-accept-v1-')&&!q.id.includes('-calibrated-v1-'))).toHaveLength(166);expect(EXTENDED_PRACTICE_BANK).toHaveLength(106);
 expect(new Set(ALL_PRACTICE_QUESTIONS.map(row=>row.id)).size).toBe(311);
 expect(Object.keys(EXTENDED_PRACTICE_INDEX).sort()).toEqual(EXTENDED_PRACTICE_BANK.map(q=>q.id).sort());
 for(const row of EXTENDED_PRACTICE_BANK){
  expect(new Set(row.options.map(option=>option.trim().toLowerCase())).size).toBe(row.options.length);
  expect(row.options).toHaveLength(row.kind==='part2'?3:4);expect(row.options[row.correctIndex]).toBeTruthy();
  expect(row.explanation.length).toBeGreaterThan(20);expect([1,2,3]).toContain(row.difficulty);
  expect(EXTENDED_PRACTICE_INDEX[row.id]).toEqual([row.kind,row.options.length]);
 }
});
it('links six grammar lessons to three applications each and provides complete reading references',()=>{
 expect(GRAMMAR_LESSONS).toHaveLength(6);
 for(const lesson of GRAMMAR_LESSONS){expect(lesson.examples).toHaveLength(2);expect(EXTENDED_PRACTICE_BANK.filter(q=>q.kind==='grammar'&&q.lessonId===lesson.id)).toHaveLength(3);}
 expect(READING_PASSAGES.filter(p=>p.kind==='part6')).toHaveLength(4);expect(READING_PASSAGES.filter(p=>p.kind==='part7')).toHaveLength(6);
 for(const passage of READING_PASSAGES){
  expect(passage.text.length).toBeGreaterThan(300);expect(passage.translation.length).toBeGreaterThan(100);
  const questions=EXTENDED_PRACTICE_BANK.filter(q=>q.passageId===passage.id);expect(questions).toHaveLength(passage.kind==='part6'?4:3);
  if(passage.kind==='part6'){for(let i=1;i<=4;i++)expect(passage.text).toContain('('+i+') _____');}
 }
});
it('keeps reading groups intact and ordered even when the requested maximum is between passage sizes',()=>{
 const selected=selectPracticeQuestions([],{kind:'part6',count:5,random:()=>0});
 expect(selected).toHaveLength(4);expect(new Set(selected.map(q=>q.passageId)).size).toBe(1);
 expect(selected.map(q=>q.id.split('-').at(-1))).toEqual(['1','2','3','4']);
 const one=selectPracticeQuestions([],{kind:'part7',passageId:'p7-v2-store',count:1});expect(one).toHaveLength(3);
 expect(selectPracticeQuestions([],{kind:'part5',difficulty:3,count:60}).every(q=>q.difficulty===3)).toBe(true);
});
it('rejects extended questions in old records, validates kind/bounds and resolves the exact extended question',()=>{
 expect(()=>parsePracticeRecords([{...extendedRecord,bankVersion:1}])).toThrow();
 expect(parseExtendedPracticeRecords([extendedRecord])[0]).toEqual(extendedRecord);
 expect(()=>parseExtendedPracticeRecords([{...extendedRecord,kind:'part7'}])).toThrow();
 expect(()=>parseExtendedPracticeRecords([{...extendedRecord,answers:[{questionId:q.id,selectedIndex:4}]}])).toThrow();
 expect(collectPracticeMistakes([extendedRecord,{...extendedRecord,id:'later',finishedAt:'2026-10-15T11:00:00Z',answers:[{questionId:q.id,selectedIndex:q.correctIndex}]}])[0]).toMatchObject({resolved:true,unansweredAttempts:1});
});
it('exports v4 after extended study, restores cleanly, merges with v3 and never labels new data as v3',async()=>{
 const legacy=createBackup(null,{});expect(legacy.version).toBe(3);
 await savePracticeRecord(extendedRecord);expect(readOwnerItem('eng_master_practice_records_v1')).toBeNull();
 const backup=createBackup(null,{});expect(backup.version).toBe(4);
 const parsed=normalizeBackup(JSON.parse(JSON.stringify(backup)));expect(parsed).toMatchObject({extendedPracticeRecords:[extendedRecord]});
 expect(()=>normalizeBackup({...backup,version:3})).toThrow(/v4/);
 localStorage.clear();expect(parsed.version).not.toBe(2);if(parsed.version===2)throw Error('wrong version');
 restoreBackupPreferences(parsed);expect(readLearningRecords()).toEqual([extendedRecord]);
 const merged=mergeBackup(legacy,parsed);expect(merged.version).toBe(4);expect(merged.extendedPracticeRecords).toEqual([extendedRecord]);
 restoreBackupPreferences(legacy);expect(readLearningRecords()).toEqual([extendedRecord]);
});
it('does not send missing extended data as an erase and isolates it from old settings documents',()=>{
 expect(splitAccountSettings({eng_master_extended_practice_v1:null})).not.toHaveProperty('extendedLearning');
 const split=splitAccountSettings({eng_master_favorites_v1:'[]',eng_master_practice_records_v1:'[]',eng_master_extended_practice_v1:JSON.stringify([extendedRecord])});
 expect(split.preferences).not.toHaveProperty('eng_master_extended_practice_v1');expect(split.learning).not.toHaveProperty('eng_master_extended_practice_v1');
 expect(split.extendedLearning?.eng_master_extended_practice_v1).toContain('extended-example');
});
it('keeps v2 drafts in their own key, resumes a legacy v1 draft and blocks replay after a generation change',()=>{
 const legacy={id:'legacy-draft',kind:'part5',questionIds:[PRACTICE_BANK[0].id],answers:{},cursor:0,startedAt:new Date().toISOString(),deadline:null};
 writeOwnerItem('eng_master_workplace_draft_v1',JSON.stringify(legacy));expect(readPracticeDraft()?.id).toBe('legacy-draft');
 const draft=createPracticeDraft('part6',[q.id]);savePracticeDraft(draft,true);
 expect(readOwnerItem('eng_master_workplace_draft_v1')).toBeNull();expect(readOwnerItem('eng_master_workplace_draft_v2')).toBeTruthy();
 expect(readPracticeDraft()?.id).toBe(draft.id);
 cacheGeneration(getActiveOwner(),'new-dataset');expect(readPracticeDraft()).toBeNull();
 setActiveOwner('other');expect(readPracticeDraft()).toBeNull();
});
it('rolls back draft keys on quota failure and leaves previous answers intact',()=>{
 const draft=createPracticeDraft('part6',[q.id]);savePracticeDraft(draft);const old=localStorage.getItem(ownerKey('eng_master_workplace_draft_v2'));
 const original=localStorage.setItem.bind(localStorage);let failed=false;
 vi.spyOn(localStorage,'setItem').mockImplementation((key,value)=>{if(!failed&&value.includes('bad-attempt')){failed=true;throw Error('quota');}original(key,value);});
 try{expect(()=>savePracticeDraft({...draft,id:'bad-attempt'})).toThrow('quota');expect(localStorage.getItem(ownerKey('eng_master_workplace_draft_v2'))).toBe(old);}
 finally{vi.restoreAllMocks();}
});
