// @vitest-environment node
// Replays recorded teaching content through the real handlers with only the SDK mocked.
// It is not a fresh model run. Original service failures remain failures, without retries.
import fs from 'node:fs';import {createHash}from'node:crypto';
import{expect,it,vi}from'vitest';
const {generateContent}=vi.hoisted(()=>({generateContent:vi.fn()}));
vi.mock('@google/genai',()=>({GoogleGenAI:class{models={generateContent};}}));
vi.mock('../src/server/firebaseAdmin.js',()=>({getAdminStorage:vi.fn()}));
import{explainWord,generateQuiz,generateMistakeReview}from'../src/server/gemini';
import{AI_CONTENT_VERSION,parseAiReview,parseAiExplanation}from'../src/domain/aiContent';
import approved from'../new/vocabulary-reviewed.json';
const input=process.env.QA_REPLAY_INPUT,output=process.env.QA_REPLAY_OUTPUT;
it.skipIf(!input||!output)('replays all 200 outputs, retains failures and records every source substitution for separate model accuracy',async()=>{
 if(!input||!output||fs.existsSync(output))throw Error('Fresh replay output required');
 const hash=(v:unknown)=>createHash('sha256').update(JSON.stringify(v)).digest('hex');
 const raw=JSON.parse(fs.readFileSync(input,'utf8')),fixture=JSON.parse(fs.readFileSync(raw.fixture,'utf8'));
 expect(raw.finishedAt).toBeTruthy();expect(raw.items).toHaveLength(200);expect(raw.cleanup).toBe(true);
 vi.stubEnv('GEMINI_API_KEY','qa-sdk-is-mocked');
 const word=(name:string)=>{const row=Object.entries(approved).find(([,v])=>v.word===name);if(!row)throw Error(name);return{id:row[0],...row[1]};};
 const report:{[key:string]:any}={checkedAt:new Date().toISOString(),method:'Recorded-output handler replay; not new live generations',input,outputSha256:hash(raw.items),fixtureSha256:raw.fixtureSha256,items:[],requests:[],rawServiceFailuresRetained:true,changedGenerationInputs:false,networkCalls:0};
 for(const row of fixture.cases){
  const items=raw.items.filter((x:any)=>x.id===row.id||x.id.startsWith(row.id+':'));
  const expected=row.endpoint==='explain'?1:row.endpoint==='quiz'?row.words.length:row.mistakes.length;expect(items).toHaveLength(expected);
  if(items.some((x:any)=>!x.automatedPassed)){report.items.push(...items.map((x:any)=>({...x,replayPassed:false,disposition:'original-service-failure-retained'})));continue;}
  let body,provider;
  if(row.endpoint==='explain'){
   const w=word(row.word),other=row.other&&word(row.other);body={wordId:w.id,word:w.word,meaning:w.meaning,level:row.level,action:row.action,...(other?{comparison:{wordId:other.id,word:other.word,meaning:other.meaning}}:{})};provider=items[0].response.lesson;
  }else if(row.endpoint==='quiz'){
   body={words:row.words.map((name:string)=>{const w=word(name);return{id:w.id,word:w.word,meaning:w.meaning};})};provider=items.map((x:any)=>x.response);
  }else{
   body={mistakes:row.mistakes.map((m:any)=>{const w=word(m.word);return{wordId:w.id,word:w.word,meaning:w.meaning,correctAnswer:m.correctAnswer||w.word,userAnswer:m.userAnswer,questionType:m.questionType||'fill',questionText:m.questionText};})};
   provider=items.map((x:any,i:number)=>{const f=x.response.feedback,[before,after]=f.question.split('_____');return{index:i,usageNote:f.explanation.split('\n').slice(1).join('\n'),english:f.english,vietnamese:f.vietnamese,practice:{before:before.trim(),after:after.trim()}};});
  }
  generateContent.mockResolvedValue({text:JSON.stringify(provider)});
  const result=await(row.endpoint==='explain'?explainWord(body):row.endpoint==='quiz'?generateQuiz(body):generateMistakeReview(body));
  report.requests.push({id:row.id,status:result.status,code:(result.body as any).code});
  if(result.status!==200){report.items.push(...items.map((x:any)=>({...x,replayPassed:false,disposition:'rejected-by-current-handler',status:result.status})));continue;}
  const b=result.body as any,returned=row.endpoint==='explain'?[parseAiExplanation(b.explanation)]:row.endpoint==='quiz'?b.questions:parseAiReview(b.review).items;
  expect(returned).toHaveLength(items.length);
  returned.forEach((value:any,i:number)=>{
   const original=items[i].response,expected=structuredClone(original);let disposition='unchanged-content-accepted';
   if(row.endpoint==='explain')expected.version=AI_CONTENT_VERSION;
   if(row.endpoint==='explain'&&value.quality?.mode==='source-only'&&original.quality?.mode!=='source-only'){
    expect(value.lesson.examples).toEqual((row.action==='compare'?[original.source,original.comparison]:[original.source]).map(s=>({english:s.example,vietnamese:s.exampleTranslation})));
    expect(value.lesson.questions).toEqual([]);expect(value.quality.reason).toBe('teaching_validation');disposition='declared-source-only-fallback';
   }else if(row.endpoint==='mistake-review'&&value.teachingSource==='ENG_MASTER'&&original.teachingSource!=='ENG_MASTER'){
    expect(value.source).toEqual(original.source);expect(value.userAnswer).toBe(original.userAnswer);expect(value.correctAnswer).toBe(original.correctAnswer);expect(value.feedback.question).toContain('_____');
    const text=value.source.word==='sale'?'The sale of the building was completed on Monday.':value.source.example;
    expect(value.feedback.english).toBe(text);expect(value.feedback.question.replace('_____',value.source.word)).toBe(text);disposition='declared-source-only-review-fallback';
   }else{
    if(row.endpoint==='quiz'||row.endpoint==='explain'&&row.action==='practice'){
     const target=row.endpoint==='quiz'?word(original.answer):original.source;
     const question=row.endpoint==='quiz'?expected:expected.lesson.questions[0];
     question.hint='Nghĩa đang ôn: '+target.meaning;question.explanation='Đối chiếu từ nguồn: '+target.word+' — '+target.meaning+'. Bài này yêu cầu nhớ đúng từ đang học theo nghĩa đã cho.';
     if(/\bfull[- ]time\b/i.test(question.questionText))question.translation=question.translation.replace(/chính thức/g,'toàn thời gian');disposition='declared-source-assisted-recall';
    }
    expect(value).toEqual(expected);
   }
   report.items.push({...items[i],servedResponse:value,replayPassed:true,disposition});
  });
 }
 report.currentCodeHashes=Object.fromEntries([...Object.keys(raw.codeHashes),'src/domain/teachingSafety.ts'].filter((v,i,a)=>a.indexOf(v)===i).map(p=>[p,createHash('sha256').update(fs.readFileSync(p)).digest('hex')]));
 for(const p of ['src/server/aiPrompts.ts','src/server/teachingConstraints.ts','src/server/aiGrounding.ts','src/server/learningNotes.ts'])expect(report.currentCodeHashes[p]).toBe(raw.codeHashes[p]);
 expect(report.items).toHaveLength(200);report.summary={total:200,accepted:report.items.filter((x:any)=>x.replayPassed).length,rejected:report.items.filter((x:any)=>!x.replayPassed).map((x:any)=>x.id)};
 expect(report.items.find((x:any)=>x.id==='accept200-explain-procrastinate')?.disposition).toBe('declared-source-only-fallback');
 fs.writeFileSync(output,JSON.stringify(report,null,2)+'\n');vi.unstubAllEnvs();
},60000);
