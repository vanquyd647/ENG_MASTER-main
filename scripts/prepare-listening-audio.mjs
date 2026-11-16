import fs from 'node:fs';
import {ALL_PRACTICE_QUESTIONS,questionById} from '../src/data/learningContent.ts';
import {listeningById} from '../src/data/listeningPractice.ts';
import {EXAM_FORM} from '../src/domain/fullExam.ts';
const rows=[];
const options=(values,voice)=>values.flatMap((text,i)=>[{text:'Option '+String.fromCharCode(65+i)+'.',voice,pause:0.35},{text,voice,pause:1.2}]);
for(const q of ALL_PRACTICE_QUESTIONS.filter(q=>['part1','part2','part3','part4'].includes(q.kind))){
 const id=q.listeningId||q.id;if(rows.some(r=>r.id===id))continue;
 const s=listeningById.get(id),questions=ALL_PRACTICE_QUESTIONS.filter(x=>(x.listeningId||x.id)===id);
 const speakers=s?[...new Set(s.lines.map(l=>l.speaker))]:[];
 const segments=q.kind==='part1'?options(q.options,'am_michael')
 :q.kind==='part2'?[{text:q.prompt,voice:'af_heart',pause:1},...options(q.options,'am_michael')]
 :[...s.lines.map(line=>({text:line.text,voice:q.kind==='part3'?['am_michael','af_heart','bf_emma'][speakers.indexOf(line.speaker)]:'af_heart',pause:0.5})),...questions.map(question=>({text:question.prompt,voice:'am_michael',pause:8}))];
 const clearerVoice=new Set(['An aisle seat, please.','Ask Ms. Chen in logistics.','A line at the information desk.','What should the caller show at reception?','Where can attendees obtain printed copies?','Where can tenants obtain drinking water?']);
 const britishClarity=new Set(['Ask Ms. Chen in logistics.','A line at the information desk.','Where can tenants obtain drinking water?']);
 rows.push({id,kind:q.kind,questionIds:questions.map(x=>x.id),segments:segments.map(seg=>britishClarity.has(seg.text)?{...seg,voice:'bf_emma'}:clearerVoice.has(seg.text)?{...seg,voice:'af_heart'}:seg)});
}
const examIds=[...new Set(EXAM_FORM.questionIds.slice(0,100).map(id=>{const q=questionById.get(id);return q.listeningId||q.id;}))];
fs.mkdirSync('output/verification',{recursive:true});fs.writeFileSync('output/verification/listening-audio-input.json',JSON.stringify({version:1,model:'hexgrad/Kokoro-82M',voices:['am_michael','af_heart','bf_emma'],sampleRate:24000,speed:0.95,examSeconds:2700,examIds,rows},null,2)+'\n');console.log({clips:rows.length,examGroups:examIds.length});
