import { expect, it } from 'vitest';
import { PRACTICE_BANK, WORKPLACE_LESSONS } from '../data/workplacePractice';
import { parsePracticeRecords, practiceResult } from './practiceRecords';
import { createBackup, normalizeBackup, mergeBackup } from '../lib/backup';
import { writeOwnerItem } from '../repositories/ownerStorage';
it('validates original banks, independent IDs, explanations and actual scoring without treating omitted answers as correct',()=>{
  expect(PRACTICE_BANK).toHaveLength(60);expect(WORKPLACE_LESSONS).toHaveLength(6);expect(new Set(PRACTICE_BANK.map(row=>row.id)).size).toBe(60);
  for(const row of PRACTICE_BANK){expect(new Set(row.options).size).toBe(row.kind==='part5'?4:3);expect(row.options[row.correctIndex]).toBeTruthy();expect(row.explanation.length).toBeGreaterThan(20);if(row.lessonId)expect(WORKPLACE_LESSONS.some(lesson=>lesson.id===row.lessonId)).toBe(true);}
  const questions=PRACTICE_BANK.filter(row=>row.kind==='part5').slice(0,2);
  const record={id:'practice-1',bankVersion:1,kind:'part5',startedAt:'2026-10-14T09:00:00Z',finishedAt:'2026-10-14T09:01:00Z',durationSeconds:60,answers:[{questionId:questions[0].id,selectedIndex:questions[0].correctIndex},{questionId:questions[1].id,selectedIndex:null}]};
  const parsed=parsePracticeRecords([record])[0];expect(practiceResult(parsed)).toEqual({correct:1,total:2,unanswered:1});
  expect(()=>parsePracticeRecords([{...record,answers:[{questionId:questions[0].id,selectedIndex:99}]}])).toThrow();
  expect(()=>parsePracticeRecords([{...record,answers:[{questionId:'rec-01',selectedIndex:0}]}])).toThrow();
  writeOwnerItem('eng_master_practice_records_v1',JSON.stringify([parsed]));
  const backup=createBackup(null,{});expect(normalizeBackup(JSON.parse(JSON.stringify(backup)))).toMatchObject({practiceRecords:[parsed]});
  expect(mergeBackup(backup,backup).practiceRecords).toHaveLength(1);
});
