import {ALL_PRACTICE_QUESTIONS,questionById} from '../data/learningContent';
import type {LearningRecord} from './extendedPracticeRecords';
export type BaselineKind='part2'|'part5'|'part6'|'part7';
export const BASELINE_SECTIONS:readonly {kind:BaselineKind;label:string;ids:string[]}[]=[
  {kind:'part2',label:'Nghe câu hỏi–phản hồi',ids:Array.from({length:5},(_,i)=>'p2-v1-'+(i+1))},
  {kind:'part5',label:'Ngữ pháp và từ vựng',ids:Array.from({length:5},(_,i)=>'p5-v1-'+(i+1))},
  {kind:'part6',label:'Hoàn thành văn bản',ids:Array.from({length:4},(_,i)=>'p6-v2-delivery-'+(i+1))},
  {kind:'part7',label:'Đọc hiểu',ids:['workshop','store'].flatMap(name=>Array.from({length:3},(_,i)=>'p7-v2-'+name+'-'+(i+1)))},
];
const pattern=/^baseline1_([a-f0-9]{32})_(part2|part5|part6|part7)$/;
export const baselineRecordId=(round:string,kind:BaselineKind)=>{
  if(!/^[a-f0-9]{32}$/.test(round))throw Error('Mã khảo sát không hợp lệ.');
  return 'baseline1_'+round+'_'+kind;
};
export function baselineRound(records:readonly LearningRecord[]) {
  const latest=[...records].filter(record=>pattern.test(record.id)).sort((a,b)=>Date.parse(b.finishedAt)-Date.parse(a.finishedAt)||b.id.localeCompare(a.id))[0];
  const round=latest?.id.match(pattern)?.[1];
  if(!round)return null;
  const sections=BASELINE_SECTIONS.map(section=>{
    const record=records.find(record=>record.id===baselineRecordId(round,section.kind));
    const answers=record?.answers||[];
    // A partial/replayed subset is not a completed baseline section.
    const complete=answers.length===section.ids.length&&section.ids.every(id=>answers.some(answer=>answer.questionId===id));
    return {...section,record:record||null,complete,correct:answers.filter(answer=>answer.selectedIndex===questionById.get(answer.questionId)?.correctIndex).length,
      unanswered:answers.filter(answer=>answer.selectedIndex===null).length};
  });
  return {round,sections,complete:sections.every(section=>section.complete),correct:sections.reduce((sum,section)=>sum+section.correct,0),
    answeredTotal:sections.reduce((sum,section)=>sum+(section.record?.answers.length||0),0),total:20,
    completed:sections.filter(section=>section.complete).length,next:sections.find(section=>!section.complete)};
}
export const baselineWeakTopics=(records:readonly LearningRecord[])=>{
  const round=baselineRound(records);if(!round)return [];
  const wrong=new Map<string,{kind:BaselineKind;topic:string;ids:string[]}>();
  for(const section of round.sections)for(const answer of section.record?.answers||[]){
    const q=ALL_PRACTICE_QUESTIONS.find(q=>q.id===answer.questionId);
    if(!q || answer.selectedIndex===q.correctIndex)continue;
    const key=section.kind+':'+q.topic,row=wrong.get(key)||{kind:section.kind,topic:q.topic,ids:[]};row.ids.push(q.id);wrong.set(key,row);
  }
  return [...wrong.values()].sort((a,b)=>b.ids.length-a.ids.length||a.topic.localeCompare(b.topic));
};
