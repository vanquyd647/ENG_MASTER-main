import { describe, expect, it } from 'vitest';
import { parseAiQuiz, parseAiQuizWords, buildLocalQuiz } from './quiz';
import { normalizeAnswer, shuffle } from './random';
import { summarizeEvents } from './statistics';
import { calculateNextReview, initialSRS } from '../lib/srs';
import { getVocabulary } from './catalog';
import { parseSessionDraft, parseProfile } from './schemas';
const words=[{id:'rec-01',word:'opening',meaning:'vị trí tuyển dụng'}];
const question={wordId:'rec-01',type:'mcq',questionText:'We have an _____ in sales.',options:['opening','invoice','expense','contract'],answer:'opening',hint:'Một vị trí tuyển dụng.',translation:'Chúng tôi có vị trí tuyển dụng.',explanation:'Opening là vị trí đang tuyển.'};
describe('study policy and AI contracts',()=>{
  it('uses an injected clock and rejects invalid quality',()=>{const now=new Date('2026-10-13T23:59:59.000Z');const next=calculateNextReview(4,initialSRS,now);expect(next.repetitions).toBe(1);expect(next.nextReviewDate.getTime()-now.getTime()).toBe(86_400_000);expect(()=>calculateNextReview(6,initialSRS,now)).toThrow();});
  it('normalizes Unicode, punctuation and whitespace without accepting different words',()=>{expect(normalizeAnswer('  It’s   full-time ')).toBe(normalizeAnswer("it's full‐time"));expect(normalizeAnswer('invoices')).not.toBe(normalizeAnswer('invoice'));expect(shuffle([1,2,3],()=>0)).toEqual([2,3,1]);});
  it('rejects partial/duplicate IDs, unknown IDs, answer mismatches and duplicate options',()=>{expect(parseAiQuizWords(words)).toEqual(words);expect(()=>parseAiQuizWords([...words,...words])).toThrow();expect(parseAiQuiz([question],words)[0].wordId).toBe('rec-01');for(const bad of [[],[{...question,wordId:'unknown'}],[{...question,answer:'contract'}],[{...question,options:['opening','opening','invoice','contract']}],[{...question,questionText:'No gap'}]])expect(()=>parseAiQuiz(bad,words)).toThrow();});
  it('builds cloze from canonical examples and listening with exact targets',()=>{const word=getVocabulary().find(w=>w.example.toLowerCase().includes(w.word.toLowerCase()))!;const cloze=buildLocalQuiz([word],'cloze')[0];expect(cloze.questionText).toContain('_____');expect(cloze.answer).toBe(word.word);expect(buildLocalQuiz([word],'listening')[0].answer).toBe(word.word);});
  it('counts real events by their recorded timezone and excludes future/outside records',()=>{const base={wordId:'rec-01',sessionId:'fixture',mode:'quiz' as const,occurredAt:'2026-10-12T18:00:00.000Z',timeZone:'Asia/Ho_Chi_Minh',durationSeconds:30,before:null,after:{easiness:2.5,interval:1,repetitions:1,nextReviewDate:'2026-10-14T00:00:00.000Z'}};const result=summarizeEvents([{...base,id:'a',correct:true},{...base,id:'b',correct:false},{...base,id:'future',occurredAt:'2027-01-01T00:00:00.000Z'}],7,new Date('2026-10-13T04:00:00.000Z'));expect(result).toMatchObject({attempts:2,uniqueWords:1,activeMinutes:1,accuracy:50});expect(result.days[0].date).toBe('2026-10-13');});
  it('rejects malformed drafts and profile bounds before persistence',()=>{expect(()=>parseSessionDraft({id:'bad',kind:'quiz',wordIds:['rec-01'],cursor:9,completedIds:[],updatedAt:new Date().toISOString()})).toThrow();expect(()=>parseProfile({uid:'user',email:'a@b.c',displayName:'a',totalWordsLearned:0,studyTimeMinutes:0,streak:0,dailyGoal:51})).toThrow();});
});
