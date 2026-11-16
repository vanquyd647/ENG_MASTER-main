// Uses a temporary Firebase account and removes its quota documents afterwards.
// node --import tsx scripts/check-hosted-ai.mjs https://DEPLOYMENT VERCEL_CLI [production-candidate]
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { randomUUID } from 'node:crypto';
import { cert, initializeApp, deleteApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';
import { parse } from 'dotenv';
import { parseAiQuiz } from '../src/domain/aiQuiz.ts';
import {parseAiExplanation,parseAiReview} from '../src/domain/aiContent.ts';
import {groundWord} from '../src/server/aiGrounding.ts';
import reviewed from '../new/vocabulary-reviewed.json' with {type:'json'};

const base=new URL(process.argv[2]);
const cli=process.argv[3];
const stage=process.argv[4] || (base.hostname==='eng-master-main2.vercel.app'?'production':'preview');
if(!['local','preview','production-candidate','production'].includes(stage))throw Error('Unexpected report stage');
const local=stage==='local' && base.protocol==='http:' && ['localhost','127.0.0.1'].includes(base.hostname);
if(!local && (base.protocol!=='https:' || !(base.hostname==='eng-master-main2.vercel.app' || /^eng-master-main2-[a-z0-9]+-quys-projects-d07a5005\.vercel\.app$/.test(base.hostname)) || !cli))throw Error('Expected the approved ENG_MASTER Vercel deployment and CLI path');
const env=parse(fs.readFileSync('.env.local','utf8'));
if(env.FIREBASE_PROJECT_ID!=='engai-2c7fe')throw Error('Unexpected Firebase project');
const app=initializeApp({credential:cert({projectId:env.FIREBASE_PROJECT_ID,clientEmail:env.FIREBASE_CLIENT_EMAIL,privateKey:env.FIREBASE_PRIVATE_KEY.replaceAll('\\n','\n')}),projectId:env.FIREBASE_PROJECT_ID},'release-qa-'+Date.now());
const auth=getAuth(app),db=getFirestore(app);
const uid='qa_release_'+randomUUID().replaceAll('-','');
const directory=fs.mkdtempSync(path.join(os.tmpdir(),'eng-master-ai-'));
const report={checkedAt:new Date().toISOString(),stage,deployment:base.origin,project:env.FIREBASE_PROJECT_ID,authMethod:'temporary custom-token account',checks:[],cleanup:{auth:false,quota:false}};
let created=false;
try {
  await auth.createUser({uid,displayName:'QA phát hành',email:uid+'@example.invalid'});created=true;
  const customToken=await auth.createCustomToken(uid);
  const tokenResponse=await fetch('https://identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken?key='+encodeURIComponent(env.VITE_FIREBASE_API_KEY),{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({token:customToken,returnSecureToken:true}),signal:AbortSignal.timeout(25000)});
  const identity=await tokenResponse.json();if(!tokenResponse.ok||!identity.idToken)throw Error('QA Firebase sign-in failed');
  let sequence=0;
  const request=(endpoint,body,attempt=0)=>{
    const id=++sequence,input=path.join(directory,id+'-body.json'),output=path.join(directory,id+'-response.json'),config=path.join(directory,id+'-curl.conf');
    fs.writeFileSync(input,JSON.stringify(body),{mode:0o600});
    const values={request:'POST',header:['Content-Type: application/json','Authorization: Bearer '+identity.idToken],data:'@'+input,output,'write-out':'%{http_code}','max-time':'60'};
    fs.writeFileSync(config,Object.entries(values).flatMap(([key,value])=>(Array.isArray(value)?value:[value]).map(item=>key+' = '+JSON.stringify(item))).join('\n'),{mode:0o600});
    const result=spawnSync(local?'curl':process.execPath,local?[base.origin+'/api/gemini/'+endpoint,'--config',config,'--silent','--show-error']:[cli,'curl',base.origin+'/api/gemini/'+endpoint,'--yes','--','--config',config,'--silent','--show-error'],{encoding:'utf8',maxBuffer:2e6,timeout:75000});
    if(result.status!==0)throw Error('Vercel QA HTTP transport failed');
    const status=Number(result.stdout.trim().match(/(\d{3})$/)?.[1]);
    let data;try{data=JSON.parse(fs.readFileSync(output,'utf8'));}catch{throw Error('Vercel API response is not JSON');}
    if(attempt===0 && [502,504].includes(status) && ['ai_failed','ai_timeout'].includes(data.code)) {
      report.retries ||= [];
      report.retries.push({endpoint,status,code:data.code,attempt:1});
      return request(endpoint,body,1);
    }
    return {status,data};
  };
  const approved=word=>{const row=Object.entries(reviewed).find(([,v])=>v.word===word);if(!row)throw Error('Missing QA source word');return {id:row[0],...row[1]};};
  const opening=approved('opening'),calculation=approved('calculation'),correspondence=approved('correspondence');
  const explainRequest=(w,action='explain',comparison)=>({wordId:w.id,word:w.word,meaning:w.meaning,level:'A2',action,...(comparison?{comparison:{wordId:comparison.id,word:comparison.word,meaning:comparison.meaning}}:{})});
  report.samples={};
  for(const [name,w,action,other] of [['explain',opening,'explain'],['simplify',opening,'simplify'],['examples',opening,'examples'],['compare',calculation,'compare',correspondence],['practice',calculation,'practice']]){
    const result=request('explain',explainRequest(w,action,other));
    report.checks.push({endpoint:name,status:result.status,characters:result.data.text?.length||0,model:result.data.model,code:result.data.code});
    if(result.status!==200)throw Error('Hosted structured '+name+' failed');
    const data=parseAiExplanation(result.data.explanation);
    if(data.action!==action || JSON.stringify(data.source)!==JSON.stringify(groundWord(w.id,w.word,w.meaning)))throw Error('Source or action mismatch');
    if(other && data.comparison?.wordId!==other.id)throw Error('Comparison source mismatch');
    if(action==='examples' && data.lesson.examples.length!==3)throw Error('Expected three new examples');
    if(name==='explain' && !/tuyển|trống|công việc|vị trí/i.test(data.lesson.summary))throw Error('Opening explanation lost the employment sense');
    if(action==='practice' && (data.lesson.questions.length!==1 || data.lesson.questions[0].answer!==w.word))throw Error('Practice target mismatch');
    report.samples[name]=data;
  }
  const custom=request('explain',{wordId:'personal-qa-checklist',word:'onboarding checklist',meaning:'danh sách việc cần làm khi tiếp nhận nhân viên mới',level:'A2'});
  report.checks.push({endpoint:'personal-source',status:custom.status,code:custom.data.code});
  if(custom.status!==200 || parseAiExplanation(custom.data.explanation).source.kind!=='user')throw Error('Custom data incorrectly marked as approved');
  report.samples.personal=custom.data.explanation;
  const words=['agreement','invoice'].map(word=>{const w=approved(word);return {id:w.id,word:w.word,meaning:w.meaning};});
  const quiz=request('quiz',{words});const questions=quiz.status===200?parseAiQuiz(quiz.data.questions,words):[];
  report.checks.push({endpoint:'quiz',status:quiz.status,validatedQuestions:questions.length,model:quiz.data.model,code:quiz.data.code});
  if(quiz.status!==200||questions.length!==2)throw Error('Hosted quiz failed');
  report.samples.quiz=questions;
  const mistakes=['invoice','calculation','dependence','meet','qualified'].map((word,index)=>{const w=approved(word);return {wordId:w.id,word:w.word,meaning:w.meaning,userAnswer:['invioce','thư từ','sự độc lập','gặp gỡ','qualify'][index],correctAnswer:index%2===0?w.word:w.meaning,questionType:index%2===0?'fill':'mcq',questionText:['The client received the _____.','Nghĩa của calculation là gì?','The company reduced its _____ on one supplier.','Trong câu Please meet the requirements., meet có nghĩa gì?','Only _____ applicants will be interviewed.'][index]};});
  const result=request('mistake-review',{mistakes});
  report.checks.push({endpoint:'mistake-review',status:result.status,characters:result.data.text?.length||0,code:result.data.code});
  if(result.status!==200)throw Error('Hosted structured review failed');
  const review=parseAiReview(result.data.review);
  if(review.items.length!==5 || review.items.some((row,i)=>row.source.word!==mistakes[i].word || row.userAnswer!==mistakes[i].userAnswer || row.correctAnswer!==mistakes[i].correctAnswer))throw Error('Original attempts changed');
  report.samples.review=review;
  const mismatch=request('explain',{wordId:opening.id,word:opening.word,meaning:'hóa đơn'});
  report.checks.push({endpoint:'approved-meaning-mismatch',status:mismatch.status,code:mismatch.data.code});if(mismatch.status!==400)throw Error('Approved meaning mismatch accepted');
  const invalid=request('quiz',{words:[words[0],words[0]]});report.checks.push({endpoint:'quiz-invalid',status:invalid.status,code:invalid.data.code});if(invalid.status!==400)throw Error('Invalid quiz was accepted');
  const avatar=request('generate-avatar',{});report.checks.push({endpoint:'avatar-flag',status:avatar.status,code:avatar.data.code});if(avatar.data.code!=='avatar_disabled')throw Error('Avatar should remain disabled');
  const quota=await db.collection('_systemRateLimits').where('uid','==',uid).get();
  report.quota={documents:quota.size,ttlTimestamps:quota.docs.every(doc=>doc.data().expiresAt instanceof Timestamp)};
  const daily=quota.docs.find(doc=>doc.id.includes('_daily_'));if(!daily)throw Error('Missing daily quota');await daily.ref.update({count:100});
  const limited=request('explain',{word:'agreement',meaning:'hợp đồng'});report.checks.push({endpoint:'daily-quota',status:limited.status,code:limited.data.code});if(limited.status!==429||limited.data.code!=='daily_quota')throw Error('Hosted daily quota failed');
  report.passed=true;
} finally {
  if(created){const quota=await db.collection('_systemRateLimits').where('uid','==',uid).get();if(quota.size){const batch=db.batch();quota.docs.forEach(doc=>batch.delete(doc.ref));await batch.commit();}report.cleanup.quota=true;await auth.deleteUser(uid);report.cleanup.auth=true;}
  fs.rmSync(directory,{recursive:true,force:true});await deleteApp(app);
  fs.mkdirSync('output/verification',{recursive:true});const file='output/verification/hosted-ai-'+stage+'.json';fs.writeFileSync(file,JSON.stringify(report,null,2)+'\n');
  fs.mkdirSync('output/verification/hosted-ai-history',{recursive:true});
  fs.writeFileSync('output/verification/hosted-ai-history/'+stage+'-'+report.checkedAt.replace(/[^0-9]/g,'')+'.json',JSON.stringify(report,null,2)+'\n');
  console.log(JSON.stringify({stage,passed:!!report.passed,checks:report.checks.length,cleanup:report.cleanup,report:file}));
}
