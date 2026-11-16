import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {expect,it} from 'vitest';
import {LISTENING_AUDIO,EXAM_LISTENING_AUDIO,listeningAudioFor} from '../data/listeningAudio';
import {ALL_PRACTICE_QUESTIONS} from '../data/learningContent';
import {EXAM_FORM,EXAM_MULTI_PASSAGES} from './fullExam';
import {EXAM_SUPPLEMENT_QUESTIONS,EXAM_READING_SUPPLEMENT} from '../data/examReadingSupplement';
import {CALIBRATED_READING_QUESTIONS,CALIBRATED_READING_PASSAGES} from '../data/readingCalibration';
import {CALIBRATED_READING_INDEX} from '../data/readingCalibrationIndex';
import {READING_PASSAGES} from '../data/extendedPractice';
import {readingById} from '../data/readingContent';
it('ships a source-mapped clip for every listening question and one ordered 100-question 45-minute track',()=>{
 const listening=ALL_PRACTICE_QUESTIONS.filter(q=>['part1','part2','part3','part4'].includes(q.kind));
 expect(Object.keys(LISTENING_AUDIO.clips)).toHaveLength(71);
 for(const q of listening)expect(listeningAudioFor(q)?.questionIds).toContain(q.id);
 expect(EXAM_LISTENING_AUDIO.seconds).toBe(2700);expect(EXAM_LISTENING_AUDIO.duration).toBe(2700);
 expect(EXAM_LISTENING_AUDIO.cues.flatMap(c=>c.questionIds)).toEqual(EXAM_FORM.questionIds.slice(0,100));
 for(const clip of [...Object.values(LISTENING_AUDIO.clips),EXAM_LISTENING_AUDIO]){
  const bytes=fs.readFileSync('public'+clip.src);expect(bytes.length).toBe(clip.bytes);expect(createHash('sha256').update(bytes).digest('hex')).toBe(clip.sha256);
 }
});
it('versions longer released reading sources without rewriting history and keeps every new ID in the compact registry',()=>{
 expect(CALIBRATED_READING_QUESTIONS).toHaveLength(28);
 for(const q of CALIBRATED_READING_QUESTIONS)expect(CALIBRATED_READING_INDEX[q.id]).toEqual([q.kind,q.options.length]);
 for(const p of CALIBRATED_READING_PASSAGES){const old=READING_PASSAGES.find(x=>x.id===p.id.replace('-calibrated-v1-','-v2-'))!;expect(old).toBeTruthy();expect(readingById.get(old.id)?.text).toBe(old.text);expect(p.text.length).toBeGreaterThan(old.text.length);}
 const seen=new Set<string>();
 for(const id of EXAM_FORM.questionIds.slice(130)){const q=ALL_PRACTICE_QUESTIONS.find(x=>x.id===id)!;if(!q.passageId||seen.has(q.passageId))continue;seen.add(q.passageId);const count=readingById.get(q.passageId)!.text.match(/\b[A-Za-z]+(?:['’-][A-Za-z]+)*\b/g)!.length;expect(count).toBeGreaterThanOrEqual(q.kind==='part6'?130:EXAM_MULTI_PASSAGES.has(q.passageId)?200:120);}
});
it('uses 29 single-document and 25 multi-document Part 7 questions with six grounded supplement items',()=>{
 const reading=EXAM_FORM.questionIds.slice(146).map(id=>ALL_PRACTICE_QUESTIONS.find(q=>q.id===id)!);
 expect(reading.slice(0,29).every(q=>!EXAM_MULTI_PASSAGES.has(q.passageId!))).toBe(true);
 expect(reading.slice(29).every(q=>EXAM_MULTI_PASSAGES.has(q.passageId!))).toBe(true);
 expect(EXAM_SUPPLEMENT_QUESTIONS).toHaveLength(6);
 for(const q of EXAM_SUPPLEMENT_QUESTIONS){expect(EXAM_READING_SUPPLEMENT.find(p=>p.id===q.passageId)!.text).toContain(q.evidence);expect(new Set(q.options).size).toBe(4);}
});
