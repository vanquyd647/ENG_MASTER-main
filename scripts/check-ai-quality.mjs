// Runs frozen requests against the authenticated app API. No hidden QA retries.
// Output metrics cover this fixture only; semantic approval requires a separate review.
import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {createQaAiClient} from './lib/qaAiClient.mjs';
import {parseAiExplanation,parseAiReview} from '../src/domain/aiContent.ts';
import {parseAiQuiz} from '../src/domain/aiQuiz.ts';
import {COMPARISON_SCOPE_NOTE,hasUnsupportedComparison} from '../src/domain/aiQuality.ts';
import {groundWord} from '../src/server/aiGrounding.ts';
import reviewed from '../new/vocabulary-reviewed.json' with {type:'json'};
const origin=process.argv[2],stage=process.argv[3]||'local',cli=process.argv[4];
if(!origin||!['local','candidate','production'].includes(stage))throw Error('Usage: URL local|candidate|production [VERCEL_CLI]');
const fixturePath=process.env.QA_FIXTURE_PATH||'scripts/fixtures/learning-quality-v1.json',fixtureText=fs.readFileSync(fixturePath,'utf8'),fixture=JSON.parse(fixtureText);
const approved=word=>{const found=Object.entries(reviewed).find(([,w])=>w.word===word);if(!found)throw Error('Missing frozen word: '+word);return {id:found[0],...found[1]};};
for(const row of fixture.cases)for(const word of [row.word,row.other,...(row.words||[]),...(row.mistakes||[]).map(m=>m.word)].filter(Boolean))approved(word);
const report={checkedAt:new Date().toISOString(),origin,stage,fixture:fixturePath,fixtureSha256:createHash('sha256').update(fixtureText).digest('hex'),threshold:fixture.threshold,scope:fixture.scope,items:[],requests:[],cleanup:false,semanticReview:'pending'};
report.codeHashes=Object.fromEntries(['src/server/gemini.ts','src/server/aiPrompts.ts','src/server/teachingConstraints.ts','src/server/aiGrounding.ts','src/server/learningNotes.ts','src/domain/aiContent.ts','src/domain/aiQuality.ts','src/domain/aiQuiz.ts','src/domain/teachingSafety.ts'].map(path=>[path,createHash('sha256').update(fs.readFileSync(path)).digest('hex')]));
const output=process.env.QA_OUTPUT_PATH||'output/verification/quality95-ai-'+stage+'.json';
if(fs.existsSync(output)&&process.env.QA_OUTPUT_PATH)throw Error('Refusing to overwrite a prior QA run');
const save=()=>{fs.mkdirSync('output/verification',{recursive:true});fs.writeFileSync(output,JSON.stringify(report,null,2)+'\n');};
let client;
try {
  client=await createQaAiClient(origin,cli);
  const runCase=async(row)=>{
    let body,expected=1,words;
    if(row.endpoint==='explain'){
      const word=approved(row.word),other=row.other&&approved(row.other);
      body={wordId:word.id,word:word.word,meaning:word.meaning,action:row.action,level:row.level,...(other?{comparison:{wordId:other.id,word:other.word,meaning:other.meaning}}:{})};
    }else if(row.endpoint==='quiz'){
      words=row.words.map(word=>{const w=approved(word);return {id:w.id,word:w.word,meaning:w.meaning};});body={words};expected=words.length;
    }else{
      body={mistakes:row.mistakes.map(m=>{const w=approved(m.word);return {wordId:w.id,word:w.word,meaning:w.meaning,userAnswer:m.userAnswer,correctAnswer:m.correctAnswer||(m.word==='meet'||m.word==='calculation'?w.meaning:w.word),questionType:m.questionType||(m.word==='meet'||m.word==='calculation'?'mcq':'fill'),questionText:m.questionText};})};expected=body.mistakes.length;
    }
    const started=Date.now();
    try {
      const {status,data}=await client.request(row.endpoint,body);
      report.requests.push({id:row.id,status,latencyMs:Date.now()-started,code:data.code,model:data.model,generated:data.generated,qualityMode:data.explanation?.quality?.mode});
      if(status!==200)throw Error('API '+status+' '+(data.code||''));
      if(row.endpoint==='explain'){
        const parsed=parseAiExplanation(data.explanation),source=groundWord(body.wordId,body.word,body.meaning);
        if(parsed.action!==row.action || JSON.stringify(parsed.source)!==JSON.stringify(source))throw Error('Wrong source or action');
        if(row.action==='compare' && (parsed.lesson.caution!==COMPARISON_SCOPE_NOTE || hasUnsupportedComparison(parsed.lesson)))throw Error('Unscoped comparison');
        if(row.action==='practice' && parsed.lesson.questions.some(q=>q.type!=='fill'||q.options.length))throw Error('Unreviewed distractors graded');
        report.items.push({id:row.id,automatedPassed:true,sourceOnly:parsed.quality?.mode==='source-only',expectedSense:row.expectedSense,response:parsed});
      }else if(row.endpoint==='quiz'){
        const parsed=parseAiQuiz(data.questions,words);
        for(const question of parsed){if(question.type!=='fill'||question.options.length)throw Error('Unreviewed quiz distractors');report.items.push({id:row.id+':'+question.wordId,automatedPassed:true,response:question});}
      }else{
        const parsed=parseAiReview(data.review);
        if(parsed.items.length!==expected)throw Error('Missing review rows');
        parsed.items.forEach((item,index)=>{
          if(item.userAnswer!==body.mistakes[index].userAnswer || item.correctAnswer!==body.mistakes[index].correctAnswer)throw Error('Attempt changed');
          if(item.source.word==='invoice'&&!item.feedback.explanation.includes('vị trí 4 và 5'))throw Error('Incorrect transposition');
          report.items.push({id:row.id+':'+item.source.word,automatedPassed:true,response:item});
        });
      }
    }catch(error){
      // A failed request counts every missing requested item as failed, not zero items.
      report.items=report.items.filter(item=>item.id!==row.id&&!item.id.startsWith(row.id+':'));
      if(!report.requests.some(request=>request.id===row.id))report.requests.push({id:row.id,status:null,latencyMs:Date.now()-started,code:'qa_transport_or_validation'});
      for(let index=0;index<expected;index++)report.items.push({id:row.id+':failed-'+index,automatedPassed:false,error:error instanceof Error?error.message:'QA failed'});
    }
    save();console.log(JSON.stringify({case:row.id,completedRequests:report.requests.length,items:report.items.length}));
    if(fixture.minimumRequestSpacingMs)await new Promise(resolve=>setTimeout(resolve,fixture.minimumRequestSpacingMs));
  };
  const parallel=Math.max(1,Math.min(2,Number(process.env.QA_CONCURRENCY)||1));
  for(let offset=0;offset<fixture.cases.length;offset+=parallel)await Promise.all(fixture.cases.slice(offset,offset+parallel).map(runCase));
  const passed=report.items.filter(item=>item.automatedPassed).length;
  report.automated={passed,total:report.items.length,percent:passed/report.items.length*100,thresholdMet:passed/report.items.length*100>=fixture.threshold};
  report.reviewedTeachingResponses=report.items.filter(item=>item.response?.quality?.mode==='reviewed').length;
  report.anchoredTeachingResponses=report.items.filter(item=>item.response?.quality?.mode==='anchored').length;
  report.modelGeneratedRequests=report.requests.filter(row=>row.generated===true).length;
  report.sourceOnlyResponses=report.items.filter(item=>item.sourceOnly).length;
  report.overall95Ready=false; // This narrow fixture cannot establish full-system readiness.
}finally{
  if(client){await client.cleanup();report.cleanup=true;}
  report.finishedAt=new Date().toISOString();save();
}
console.log(JSON.stringify({report:output,automated:report.automated,semanticReview:report.semanticReview,overall95Ready:false,cleanup:report.cleanup}));
