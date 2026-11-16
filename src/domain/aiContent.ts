import { parseAiQuiz, type AiQuizQuestion } from './aiQuiz.js';
import {assertLessonTeaching,assertVietnameseTeaching} from './teachingSafety.js';
export const AI_CONTENT_VERSION = 'toeic-vi-v7';
export type AiContentVersion = 'toeic-vi-v3' | 'toeic-vi-v4' | 'toeic-vi-v5' | 'toeic-vi-v6' | typeof AI_CONTENT_VERSION;
export const AI_ACTIONS = ['explain', 'simplify', 'examples', 'compare', 'practice'] as const;
export type AiAction = typeof AI_ACTIONS[number];
export interface AiSource {
  kind: 'catalog' | 'user'; wordId: string; word: string; meaning: string;
  pos: string; topic: string; example: string; exampleTranslation: string;
}
export interface AiLesson {
  summary: string; usage: string; collocations: { phrase: string; meaning: string }[];
  examples: { english: string; vietnamese: string }[]; caution: string; questions: AiQuizQuestion[];
}
export interface AiExplanationData { version: AiContentVersion; action: AiAction; source: AiSource; comparison?: AiSource; lesson: AiLesson; quality?: {mode:'ai'|'source-only'|'anchored'|'reviewed';reason?:string}; }
export interface AiMistakeFeedback { index: number; explanation: string; english: string; vietnamese: string; question: string; answer: string; }
export interface AiReviewItem { source: AiSource; userAnswer: string; correctAnswer: string; feedback: AiMistakeFeedback; teachingSource?:'ENG_MASTER'|'AI'; }
export interface AiReviewData { version: AiContentVersion; items: AiReviewItem[]; }
export const asObject = (value: unknown): Record<string, unknown> => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw Error('Nội dung AI sai cấu trúc.');
  return value as Record<string, unknown>;
};
const str = (value: unknown, max: number, empty = false): string => {
  if (typeof value !== 'string' || (!empty && !value.trim()) || value.length > max) throw Error('Nội dung AI thiếu mục hoặc quá dài.');
  return value.trim();
};
const array = (value: unknown, min: number, max: number): unknown[] => {
  if (!Array.isArray(value) || value.length < min || value.length > max) throw Error('Số mục AI không hợp lệ.');
  return value;
};
// The width of a single blank is presentation, not a change to the answer or sentence.
export const normalizeAiBlank=(question:string):string=>{
  const runs=question.match(/_+/g);
  if(!runs || runs.length!==1 || runs[0].length<3 || runs[0].length>12)throw Error('Bài ôn AI cần đúng một ô trống.');
  return question.replace(/_+/,'_____');
};
export function parseAiSource(value: unknown): AiSource {
  const v = asObject(value);
  if (v.kind !== 'catalog' && v.kind !== 'user') throw Error('Thiếu nguồn từ vựng.');
  return { kind: v.kind, wordId: str(v.wordId,128,true), word: str(v.word,80), meaning: str(v.meaning,300,true),
    pos: str(v.pos,80,true), topic: str(v.topic,120,true), example: str(v.example,1000,true), exampleTranslation: str(v.exampleTranslation,1000,true) };
}
export function parseAiLesson(value: unknown, source: AiSource, action: AiAction, sourceOnly = false): AiLesson {
  const v = asObject(value);
  if(action==='examples'&&!sourceOnly) {
    const examples=array(v.examples,3,3).map(value=>str(asObject(value).english,400).toLowerCase());
    if(new Set(examples).size!==3 || source.example && examples.includes(source.example.toLowerCase()))throw Error('Cần ba ví dụ mới, khác nhau.');
  }
  const questions = array(v.questions, action === 'practice' ? 1 : 0, action === 'practice' ? 1 : 0).map(value=>{
    const q=asObject(value);return {...q,questionText:normalizeAiBlank(str(q.questionText,1000))};
  });
  for (const value of questions) {
    const q=asObject(value);
    if(q.type==='fill' && (!Array.isArray(q.options)||q.options.length))throw Error('Câu điền AI phải có danh sách lựa chọn rỗng.');
  }
  return { summary: str(v.summary,500), usage: str(v.usage,600), caution: str(v.caution,500),
    collocations: array(v.collocations,sourceOnly?0:1,3).map(value => { const c=asObject(value); return {phrase:str(c.phrase,120),meaning:str(c.meaning,200)}; }),
    examples: array(v.examples,1,3).map(value => { const e=asObject(value); return {english:str(e.english,400),vietnamese:str(e.vietnamese,400)}; }),
    questions: questions.length ? parseAiQuiz(questions,[{id:source.wordId || 'current-word',word:source.word,meaning:source.meaning}]) : [] };
}
export function parseAiExplanation(value: unknown): AiExplanationData {
  const v = asObject(value);
  if (!['toeic-vi-v3','toeic-vi-v4','toeic-vi-v5','toeic-vi-v6',AI_CONTENT_VERSION].includes(String(v.version)) || !AI_ACTIONS.includes(v.action as AiAction)) throw Error('Phiên bản nội dung AI không hợp lệ.');
  const action = v.action as AiAction, source = parseAiSource(v.source);
  const comparison = v.comparison === undefined ? undefined : parseAiSource(v.comparison);
  if (action === 'compare' && (!comparison || comparison.word.toLowerCase() === source.word.toLowerCase())) throw Error('Cần hai từ khác nhau để so sánh.');
  const quality=v.quality===undefined?undefined:asObject(v.quality);
  if(quality && !['ai','source-only','anchored','reviewed'].includes(String(quality.mode)))throw Error('Trạng thái nội dung AI không hợp lệ.');
  const lesson=parseAiLesson(v.lesson,source,action,quality?.mode==='source-only');
  assertLessonTeaching(lesson,source);
  return {version:v.version as AiContentVersion,action,source,...(comparison?{comparison}:{}),lesson,...(quality?{quality:{mode:quality.mode as 'ai'|'source-only'|'anchored'|'reviewed',...(typeof quality.reason==='string'?{reason:str(quality.reason,100)}:{})}}:{})};
}
export function parseAiFeedback(value: unknown, sources: readonly AiSource[]): AiMistakeFeedback[] {
  const seen = new Set<number>();
  return array(value,sources.length,sources.length).map(value => {
    const v=asObject(value), index=v.index;
    if (typeof index !== 'number' || !Number.isInteger(index) || !sources[index] || seen.has(index)) throw Error('AI trả thiếu hoặc trùng lỗi sai.');
    seen.add(index);
    const question=normalizeAiBlank(str(v.question,400)),answer=str(v.answer,80);
    assertVietnameseTeaching([str(v.explanation,1000),str(v.vietnamese,400)]);
    if(sources[index].word==='promote'&&/thăng chức|đề bạt/.test(sources[index].meaning)&&/product|marketing|advertis/i.test(str(v.english,400)))throw Error('Ví dụ AI khác nghĩa thăng chức đang học.');
    if (question.split('_____').length !== 2 || answer.toLowerCase() !== sources[index].word.toLowerCase()) throw Error('Bài ôn AI không khớp từ.');
    return {index,explanation:str(v.explanation,1000),english:str(v.english,400),vietnamese:str(v.vietnamese,400),question,answer};
  }).sort((a,b)=>a.index-b.index);
}
export function parseGeneratedFeedback(value:unknown,sources:readonly AiSource[]):AiMistakeFeedback[] {
  const rows=array(value,sources.length,sources.length).map(value=>{
    const v=asObject(value),practice=asObject(v.practice);
    if(typeof v.index!=='number' || !Number.isInteger(v.index) || !sources[v.index])throw Error('ID nhận xét AI không hợp lệ.');
    const before=str(practice.before,200,true),after=str(practice.after,200,true);
    if(!before&&!after || /_/.test(before+after))throw Error('Câu ôn AI chưa hợp lệ.');
    return {...v,question:[before,'_____',after].filter(Boolean).join(' '),answer:sources[v.index].word};
  });
  return parseAiFeedback(rows,sources);
}
export function parseAiReview(value: unknown): AiReviewData {
  const v=asObject(value);
  if(!['toeic-vi-v3','toeic-vi-v4','toeic-vi-v5','toeic-vi-v6',AI_CONTENT_VERSION].includes(String(v.version)))throw Error('Phiên bản nhận xét AI không hợp lệ.');
  const rows=array(v.items,1,20).map(value=>{
    const item=asObject(value);
    str(item.userAnswer,120,true);str(item.correctAnswer,300);
    return {source:parseAiSource(item.source),userAnswer:item.userAnswer as string,correctAnswer:item.correctAnswer as string,feedback:item.feedback,...(item.teachingSource==='ENG_MASTER'||item.teachingSource==='AI'?{teachingSource:item.teachingSource as AiReviewItem['teachingSource']}:{})};
  });
  const feedback=parseAiFeedback(rows.map(row=>row.feedback),rows.map(row=>row.source));
  // Keep feedback and the original attempt paired even if a response is reordered.
  if(rows.some((row,i)=>asObject(row.feedback).index!==i))throw Error('Thứ tự nhận xét AI không hợp lệ.');
  return {version:v.version as AiContentVersion,items:rows.map((row,i)=>({...row,feedback:feedback[i]}))};
}

