import { PRACTICE_BANK } from '../data/workplacePractice';
export interface PracticeRecord { id:string; bankVersion:1; kind:'part5'|'part2'|'context'; startedAt:string; finishedAt:string; durationSeconds:number; answers:{questionId:string;selectedIndex:number|null}[]; }
const questions=new Map(PRACTICE_BANK.map(question=>[question.id,question]));
export const parsePracticeRecords=(input:unknown):PracticeRecord[]=>{
  if(!Array.isArray(input)||input.length>100)throw Error('Lịch sử bài luyện chỉ giữ tối đa 100 bài gần nhất.');
  const ids=new Set<string>();
  return input.map(value=>{
    if(!value || typeof value!=='object' || Array.isArray(value))throw Error('Bài luyện đã lưu không hợp lệ.');
    const data=value as PracticeRecord;
    if(typeof data.id!=='string'||!/^[a-zA-Z0-9_-]{1,128}$/.test(data.id)||ids.has(data.id)||data.bankVersion!==1||!['part5','part2','context'].includes(data.kind)||typeof data.startedAt!=='string'||typeof data.finishedAt!=='string'||!Number.isFinite(Date.parse(data.startedAt))||!Number.isFinite(Date.parse(data.finishedAt))||Date.parse(data.finishedAt)<Date.parse(data.startedAt)||!Number.isSafeInteger(data.durationSeconds)||data.durationSeconds<0||data.durationSeconds>86400||!Array.isArray(data.answers)||!data.answers.length||data.answers.length>60)throw Error('Bài luyện đã lưu không hợp lệ.');
    ids.add(data.id);const seen=new Set<string>();
    const answers=data.answers.map(answer=>{const question=questions.get(answer?.questionId);if(!question||question.kind!==data.kind||seen.has(answer.questionId)||(answer.selectedIndex!==null && (!Number.isInteger(answer.selectedIndex)||answer.selectedIndex<0||answer.selectedIndex>=question.options.length)))throw Error('Câu trả lời bài luyện không hợp lệ.');seen.add(answer.questionId);return{questionId:answer.questionId,selectedIndex:answer.selectedIndex};});
    return{id:data.id,bankVersion:1,kind:data.kind,startedAt:data.startedAt,finishedAt:data.finishedAt,durationSeconds:data.durationSeconds,answers};
  });
};
export const practiceResult=(record:PracticeRecord)=>({correct:record.answers.filter(answer=>answer.selectedIndex===questions.get(answer.questionId)?.correctIndex).length,total:record.answers.length,unanswered:record.answers.filter(answer=>answer.selectedIndex===null).length});
