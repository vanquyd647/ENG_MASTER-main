import type { StudyEvent } from '../types';
import { normalizeAnswer } from './random';

export interface QuizAttemptSnapshot {
  questionId: string;
  questionType: 'mcq' | 'fill';
  questionText: string;
  userAnswer: string;
  correctAnswer: string;
  options: string[];
  explanation: string;
  word: string;
  meaning: string;
}
export const parseQuizAttempt = (value: unknown): QuizAttemptSnapshot => {
  if (!value || typeof value!=='object' || Array.isArray(value))throw new Error('Câu trả lời đã lưu không hợp lệ.');
  const data=value as Record<string,unknown>;
  const text=(key:string,max:number,empty=false)=>typeof data[key]==='string' && String(data[key]).length<=max && (empty || String(data[key]).trim().length>0);
  if(!text('questionId',200) || !/^[a-zA-Z0-9_:-]+$/.test(String(data.questionId)) || !['mcq','fill'].includes(String(data.questionType)) || !text('questionText',2000) || !text('userAnswer',2000,true) || !text('correctAnswer',2000) || !text('explanation',5000,true) || !text('word',80) || !text('meaning',300) || !Array.isArray(data.options) || data.options.length>4 || data.options.some(option=>typeof option!=='string' || option.length>2000))throw new Error('Câu trả lời đã lưu không hợp lệ.');
  if(data.questionType==='mcq' && (data.options.length!==4 || new Set(data.options.map(option=>normalizeAnswer(String(option)))).size!==4 || !data.options.includes(data.correctAnswer)))throw new Error('Đáp án trắc nghiệm đã lưu không hợp lệ.');
  if(data.questionType==='fill' && data.options.length)throw new Error('Câu điền từ không có lựa chọn.');
  return {questionId:String(data.questionId),questionType:data.questionType as 'mcq'|'fill',questionText:String(data.questionText),userAnswer:String(data.userAnswer),correctAnswer:String(data.correctAnswer),options:data.options as string[],explanation:String(data.explanation),word:String(data.word),meaning:String(data.meaning)};
};

export const quizQuestionKey=async(wordId:string,mode:string,question:{type:string;questionText:string;answer:string})=>{
  const data=new TextEncoder().encode(JSON.stringify([question.type,question.questionText,question.answer]));
  const hash=Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',data))).map(byte=>byte.toString(16).padStart(2,'0')).join('').slice(0,16);
  return wordId+':'+mode+':'+hash;
};

export interface MistakeRecord {
  key: string;
  wordId: string;
  mode: StudyEvent['mode'];
  attempt: QuizAttemptSnapshot;
  lastAttemptAt: string;
  wrongAttempts: number;
  resolved: boolean;
  category: 'meaning' | 'spelling' | 'listening';
}
export const collectMistakes = (events: readonly (StudyEvent & {attempt?:QuizAttemptSnapshot})[]): MistakeRecord[] => {
  const groups=new Map<string,{latest:StudyEvent & {attempt:QuizAttemptSnapshot};wrong:number}>();
  for(const event of [...events].sort((a,b)=>Date.parse(a.occurredAt)-Date.parse(b.occurredAt)||a.id.localeCompare(b.id))){
    if(!event.attempt || event.correct===undefined)continue;
    const key=event.wordId+':'+event.mode+':'+event.attempt.questionId;
    const previous=groups.get(key);
    groups.set(key,{latest:{...event,attempt:event.attempt},wrong:(previous?.wrong || 0)+(event.correct?0:1)});
  }
  return [...groups.entries()].filter(([,group])=>group.wrong>0).map<MistakeRecord>(([key,group])=>({key,wordId:group.latest.wordId,mode:group.latest.mode,attempt:group.latest.attempt,lastAttemptAt:group.latest.occurredAt,wrongAttempts:group.wrong,resolved:group.latest.correct===true,category:group.latest.mode==='listening'?'listening':group.latest.attempt.questionType==='fill'?'spelling':'meaning'})).sort((a,b)=>Date.parse(b.lastAttemptAt)-Date.parse(a.lastAttemptAt));
};
