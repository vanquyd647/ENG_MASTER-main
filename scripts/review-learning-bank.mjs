import fs from 'node:fs';
import {createHash} from 'node:crypto';
import dotenv from 'dotenv';
import {GoogleGenAI} from '@google/genai';
import {ALL_PRACTICE_QUESTIONS,ALL_WORKPLACE_LESSONS} from '../src/data/learningContent.ts';
import {listeningById} from '../src/data/listeningPractice.ts';
import {readingById} from '../src/data/readingContent.ts';
import {EXAM_FORM} from '../src/domain/fullExam.ts';

// Separate answer-blind checking workflow. This is NOT a teacher review or an
// evaluation of 277 generated AI teaching responses. Never silently retry/drop items.
dotenv.config({path:'.env.local',quiet:true});
const model='gemini-3.5-flash-lite';
const prefix=process.argv[2]||'output/verification/bank-review-v1';
const hash=value=>createHash('sha256').update(JSON.stringify(value)).digest('hex');
const only=process.argv.find(arg=>arg.startsWith('--only='))?.slice(7).split(',');
if(only?.some(id=>!ALL_PRACTICE_QUESTIONS.some(q=>q.id===id)))throw Error('Unknown review ID');
const snapshot=ALL_PRACTICE_QUESTIONS.filter(q=>!only||only.includes(q.id)).map(q=>({question:q,listening:q.listeningId?listeningById.get(q.listeningId):null,reading:q.passageId?readingById.get(q.passageId):null,context:q.lessonId?ALL_WORKPLACE_LESSONS.find(l=>l.id===q.lessonId):null}));
fs.writeFileSync(prefix+'-snapshot.json',JSON.stringify(snapshot,null,2)+'\n',{flag:'wx'});
const report={checkedAt:new Date().toISOString(),reviewer:'Gemini answer-blind checker; adjudication by Codex pending',model,sourceSha256:hash(snapshot),scope:`${snapshot.length} authored practice questions; separate from AI teaching-output benchmark`,bankCount:ALL_PRACTICE_QUESTIONS.length,denominator:snapshot.length,examIds:EXAM_FORM.questionIds,batches:[],items:[],passed:false};
const save=()=>fs.writeFileSync(prefix+'.json',JSON.stringify(report,null,2)+'\n');save();
if(!process.argv.includes('--allow-external')){
 console.log('Local frozen snapshot prepared. External review requires explicit user authorization and --allow-external.');
 process.exit(0);
}
const ai=new GoogleGenAI({apiKey:process.env.GEMINI_API_KEY||process.env.GEMINI_API_KEY2});
const schema={type:'object',properties:{items:{type:'array',items:{type:'object',properties:{id:{type:'string'},chosenIndex:{type:['integer','null']},chosenOption:{type:'string'},ambiguous:{type:'boolean'},evidence:{type:'string'},issue:{type:'string'},translationIssue:{type:'string'}},required:['id','chosenIndex','chosenOption','ambiguous','evidence','issue','translationIssue'],additionalProperties:false}}},required:['items'],additionalProperties:false};
const batches=[];for(let i=0;i<snapshot.length;i+=20)batches.push(snapshot.slice(i,i+20));
const check=async(batch,index)=>{
 const request=[];
 const inputs=batch.map(({question:q,listening,reading,context})=>{
  if(listening?.image){const file='public'+listening.image.src;request.push({inlineData:{mimeType:'image/jpeg',data:fs.readFileSync(file).toString('base64')}});request.push({text:'The immediately preceding photograph belongs only to question '+q.id});}
  const lines=listening?.lines||context?.lines;
  if(q.kind==='context'&&!context)throw Error('Missing context source '+q.id);
  return {id:q.id,kind:q.kind,prompt:q.prompt,options:q.options.map((text,index)=>({index,text})),sourceEnglish:reading?.text||lines?.map(line=>line.speaker+': '+line.text).join('\n')||null,sourceVietnamese:reading?.translation||lines?.map(line=>line.translation).join('\n')||null};
 });
 request.push({text:JSON.stringify(inputs)});
 const row={index,ids:batch.map(x=>x.question.id),inputSha256:hash(inputs),status:'running'};report.batches.push(row);save();
 try{
  const response=await ai.models.generateContent({model,contents:[{role:'user',parts:request}],config:{systemInstruction:'You are an English/Vietnamese learning-content auditor. Solve every question independently; the authored answer and explanation are deliberately withheld. Return zero-based chosenIndex or null if no unique correct option. Evaluate all distractors: if another option is reasonably correct in the supplied context, mark ambiguous true and explain. Do not invent unstated context. For Part 1 use the photograph identified with the question. For Part 2 choose the best conversational response. For Part 6 use the numbered blank stated in the prompt, with its full passage. For context/grammar choose the uniquely best answer. Include concise source evidence or grammatical reasoning. Check Vietnamese source translations against English and report material mistranslations or timeline contradictions; translationIssue empty when none. Be precise, avoid speculative objections. Return each supplied ID exactly once.',responseMimeType:'application/json',responseJsonSchema:schema,maxOutputTokens:7500,httpOptions:{timeout:90000,retryOptions:{attempts:1}}}});
  const raw=response.text||'';fs.writeFileSync(prefix+'-batch-'+String(index).padStart(2,'0')+'.json',raw+'\n');
  const items=JSON.parse(raw).items;
  if(!Array.isArray(items)||items.length!==batch.length||new Set(items.map(x=>x.id)).size!==batch.length||items.some(x=>!row.ids.includes(x.id)||typeof x.ambiguous!=='boolean'||![x.evidence,x.issue,x.translationIssue].every(v=>typeof v==='string')||(x.chosenIndex!==null&&(!Number.isInteger(x.chosenIndex)||x.chosenIndex<0||x.chosenIndex>=batch.find(b=>b.question.id===x.id).question.options.length))))throw Error('invalid_review_schema');
  if(items.some(item=>item.chosenIndex!==null&&item.chosenOption!==batch.find(b=>b.question.id===item.id).question.options[item.chosenIndex]))throw Error('review_option_index_mismatch');
  report.items.push(...items.map(item=>({...item,authoredIndex:batch.find(b=>b.question.id===item.id).question.correctIndex,answerMatches:item.chosenIndex===batch.find(b=>b.question.id===item.id).question.correctIndex})));
  row.status='complete';row.outputSha256=hash(items);row.usage=response.usageMetadata;
 }catch(error){row.status='failed';row.error={name:error.name,status:error.status||null};}
 save();console.log('batch '+index+' '+row.status);
};
// One request at a time, paced below minute quotas. Do not retry errors here.
for(let i=0;i<batches.length;i++){
 await check(batches[i],i);
 if(report.batches.at(-1)?.error?.status===429)break;
 if(i<batches.length-1)await new Promise(resolve=>setTimeout(resolve,6000));
}
report.items.sort((a,b)=>snapshot.findIndex(x=>x.question.id===a.id)-snapshot.findIndex(x=>x.question.id===b.id));
report.summary={reviewed:report.items.length,answerMatches:report.items.filter(x=>x.answerMatches).length,flagged:report.items.filter(x=>!x.answerMatches||x.ambiguous||x.issue||x.translationIssue).map(x=>x.id),failedBatches:report.batches.filter(x=>x.status!=='complete').length};
// An external checker alone cannot mark content accepted.
report.adjudicationRequired=true;report.finishedAt=new Date().toISOString();save();console.log(JSON.stringify(report.summary));
