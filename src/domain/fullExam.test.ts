import { beforeEach, afterEach, expect, it, vi } from 'vitest';
vi.mock('../lib/firebase',()=>({auth:{currentUser:null},db:{}}));
import { EXAM_FORM, EXAM_PARTS, EXAM_PART_COUNTS, LISTENING_MS, READING_MS, createExamDraft, parseExamDraft, validateExamForm, examPhase, advanceExam, answerExamQuestion, moveExamCursor, examRecords, collectExamResults } from './fullExam';
import { EXPANSION_QUESTIONS, EXPANSION_LISTENING, EXPANSION_PASSAGES } from '../data/examExpansion';
import { EXAM_EXPANSION_INDEX } from '../data/examExpansionIndex';
import { questionById } from '../data/learningContent';
import { parseExtendedPracticeRecords } from './extendedPracticeRecords';
import { startExam, editExam, finishExam, readExamDraft, EXAM_DRAFT_KEY } from '../repositories/examStore';
import { setActiveOwner, readOwnerItem, ownerKey } from '../repositories/ownerStorage';
import { cacheGeneration } from '../repositories/cloudDataset';
import { savePracticeRecord, readLearningRecords, EXTENDED_RECORDS_KEY } from '../repositories/practiceStore';
import { createBackup, normalizeBackup } from '../lib/backup';
import { restoreBackupPreferences } from '../lib/productPreferences';
const started=Date.parse('2026-10-16T08:00:00Z');
const first=EXAM_FORM.questionIds[0];
beforeEach(()=>{
 localStorage.clear();setActiveOwner('guest');
 const locks=new Map<string,Promise<unknown>>();
 Object.defineProperty(navigator,'locks',{configurable:true,value:{request:(key:string,action:()=>unknown)=>{const next=(locks.get(key)||Promise.resolve()).catch(()=>undefined).then(action);locks.set(key,next);return next;}}});
});
afterEach(()=>{vi.restoreAllMocks();Object.defineProperty(navigator,'locks',{configurable:true,value:undefined});});
it('has 93 unique source-grounded additions, matching lightweight registries and bilingual scripts',()=>{
 expect(EXPANSION_QUESTIONS).toHaveLength(93);expect(EXPANSION_LISTENING).toHaveLength(19);expect(EXPANSION_PASSAGES).toHaveLength(9);
 expect(Object.keys(EXAM_EXPANSION_INDEX).sort()).toEqual(EXPANSION_QUESTIONS.map(q=>q.id).sort());
 for(const q of EXPANSION_QUESTIONS){
  const text=q.listeningId?EXPANSION_LISTENING.find(s=>s.id===q.listeningId)?.lines.map(l=>l.text).join(' '):EXPANSION_PASSAGES.find(s=>s.id===q.passageId)?.text;
  expect(text,q.id).toContain(q.evidence);expect(EXAM_EXPANSION_INDEX[q.id]).toEqual([q.kind,4]);expect(new Set(q.options).size).toBe(4);expect(q.options[q.correctIndex]).toBeTruthy();expect(q.explanation.length).toBeGreaterThan(20);
 }
 for(const stimulus of EXPANSION_LISTENING){expect(stimulus.lines.every(l=>l.text&&l.translation)).toBe(true);expect(EXPANSION_QUESTIONS.filter(q=>q.listeningId===stimulus.id)).toHaveLength(3);}
});
it('assembles 200 distinct ordered questions with exact part counts and intact source groups',()=>{
 expect(validateExamForm()).toHaveLength(200);
 expect(new Set(EXAM_FORM.questionIds).size).toBe(200);
 expect(EXAM_FORM.questionIds.slice(0,100).every(id=>['part1','part2','part3','part4'].includes(questionById.get(id)!.kind))).toBe(true);
 expect(EXAM_FORM.questionIds.slice(100).every(id=>['part5','part6','part7'].includes(questionById.get(id)!.kind))).toBe(true);
 for(const kind of EXAM_PARTS)expect(EXAM_FORM.questionIds.filter(id=>questionById.get(id)!.kind===kind)).toHaveLength(EXAM_PART_COUNTS[kind]);
 for(const id of new Set(EXAM_FORM.questionIds.map(id=>questionById.get(id)!.listeningId).filter(Boolean))){const group=EXAM_FORM.questionIds.filter(qid=>questionById.get(qid)!.listeningId===id);expect(group).toEqual([...group].sort((a,b)=>Number(a.split('-q').at(-1))-Number(b.split('-q').at(-1))));}
});
it('uses absolute 45/75 minute deadlines, locks old sections and catches up across time outside the app',()=>{
 let d=createExamDraft('test',started);d=answerExamQuestion(d,first,1,started+500);
 expect(()=>moveExamCursor(d,100,started+1000)).toThrow();
 expect(examPhase(d,started+LISTENING_MS-1)).toBe('listening');
 const reading=advanceExam(d,started+LISTENING_MS+20000);expect(reading.cursor).toBe(100);expect(examPhase(reading,reading.updatedAt)).toBe('reading');
 expect(()=>answerExamQuestion(reading,first,0,reading.updatedAt)).toThrow();expect(()=>moveExamCursor(reading,99,reading.updatedAt)).toThrow();
 expect(reading.partMilliseconds.part1).toBe(LISTENING_MS);expect(reading.partMilliseconds.part5).toBe(20000);
 const expired=advanceExam(reading,started+LISTENING_MS+READING_MS+99999);expect(expired.updatedAt).toBe(started+LISTENING_MS+READING_MS);expect(examPhase(expired,expired.updatedAt)).toBe('finished');
 expect(()=>answerExamQuestion(expired,EXAM_FORM.questionIds[100],0,expired.updatedAt)).toThrow();
 expect(examRecords(expired,expired.updatedAt).reduce((sum,r)=>sum+r.durationSeconds,0)).toBe(7200);
});
it('rejects corrupted answers/timing, clock reversal and invalid positions',()=>{
 const d=answerExamQuestion(createExamDraft('test',started),first,0,started+1000);
 expect(()=>advanceExam(d,started)).toThrow(/Đồng hồ/);
 expect(()=>parseExamDraft({...d,answers:{missing:0}})).toThrow();expect(()=>parseExamDraft({...d,answers:{[first]:4}})).toThrow();
 expect(()=>parseExamDraft({...d,partMilliseconds:{...d.partMilliseconds,part1:0}})).toThrow();expect(()=>parseExamDraft({...d,cursor:100})).toThrow();
 expect(()=>moveExamCursor(d,-1,started+1000)).toThrow();expect(()=>moveExamCursor(d,200,started+1000)).toThrow();
});
it('saves all seven parts, preserves blanks, deduplicates completion and round-trips through backup v4',async()=>{
 let d=await startExam(started);d=await editExam(d,x=>answerExamQuestion(x,first,questionById.get(first)!.correctIndex,started+1234));
 const result=await finishExam(d,started+2345);expect(result).toMatchObject({complete:true,correct:1,unanswered:199,durationSeconds:2});expect(readExamDraft()).toBeNull();
 expect(readLearningRecords()).toHaveLength(7);expect(parseExtendedPracticeRecords(result.records)).toHaveLength(7);
 await finishExam(d,started+9999);expect(readLearningRecords()).toHaveLength(7);
 const backup=normalizeBackup(JSON.parse(JSON.stringify(createBackup(null,{}))));expect(backup.version).toBe(4);if(backup.version===2)throw Error('wrong backup');
 localStorage.clear();restoreBackupPreferences(backup);expect(collectExamResults(readLearningRecords())[0]).toMatchObject({complete:true,correct:1,unanswered:199});
});
it('serializes concurrent edits and never silently overwrites a stale tab revision',async()=>{
 const d=await startExam(started);
 const attempts=await Promise.allSettled([editExam(d,x=>answerExamQuestion(x,first,0,started+1)),editExam(d,x=>answerExamQuestion(x,first,1,started+2))]);
 expect(attempts.filter(r=>r.status==='fulfilled')).toHaveLength(1);expect(attempts.filter(r=>r.status==='rejected')).toHaveLength(1);expect(readExamDraft()?.revision).toBe(1);
});
it('serializes ordinary practice and full exam result writes without losing either history',async()=>{
 const d=await startExam(started);const q=questionById.get(EXAM_FORM.questionIds[100])!;
 await Promise.all([finishExam(d,started+5000),savePracticeRecord({id:'ordinary',bankVersion:2,kind:'part5',startedAt:new Date(started).toISOString(),finishedAt:new Date(started+5000).toISOString(),durationSeconds:5,answers:[{questionId:q.id,selectedIndex:0}]})]);
 expect(readLearningRecords()).toHaveLength(8);expect(collectExamResults(readLearningRecords())[0].complete).toBe(true);
});
it('keeps the entire draft/history intact when draft cleanup fails after preparing results',async()=>{
 const d=await startExam(started),before=readOwnerItem(EXAM_DRAFT_KEY);
 const remove=localStorage.removeItem.bind(localStorage);let failed=false;
 vi.spyOn(localStorage,'removeItem').mockImplementation(key=>{if(key===ownerKey(EXAM_DRAFT_KEY)&&!failed){failed=true;throw Error('quota');}remove(key);});
 await expect(finishExam(d,started+1000)).rejects.toThrow('quota');expect(readOwnerItem(EXAM_DRAFT_KEY)).toBe(before);expect(readOwnerItem(EXTENDED_RECORDS_KEY)).toBeNull();
 vi.restoreAllMocks();await finishExam(d,started+2000);expect(readLearningRecords()).toHaveLength(7);
});
it('blocks stale owner/dataset writes and does not mislabel a partially retained result as a full exam',async()=>{
 const d=await startExam(started);setActiveOwner('other');expect(readExamDraft()).toBeNull();await expect(finishExam(d,started+1000)).rejects.toThrow();expect(readLearningRecords()).toEqual([]);
 setActiveOwner('guest');cacheGeneration('guest','restored');expect(readExamDraft()).toBeNull();await expect(editExam(d,x=>x)).rejects.toThrow();
 const rows=examRecords(d,started+1000);expect(collectExamResults(rows.slice(1))[0].complete).toBe(false);
});
it('refuses starting a long exam when the browser cannot coordinate shared writes',async()=>{
 Object.defineProperty(navigator,'locks',{configurable:true,value:undefined});await expect(startExam(started)).rejects.toThrow(/Trình duyệt/);expect(readExamDraft()).toBeNull();
});
