// Verify deployed client rules with two disposable Firebase accounts.
// node --import tsx scripts/check-cloud-release.mjs
import fs from 'node:fs';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { parse } from 'dotenv';
import { initializeApp, deleteApp } from 'firebase/app';
import { getAuth, signInWithCustomToken } from 'firebase/auth';
import { initializeFirestore, memoryLocalCache, doc, setDoc, getDoc, terminate } from 'firebase/firestore';
import { cert, initializeApp as initializeAdmin, deleteApp as deleteAdmin } from 'firebase-admin/app';
import { getAuth as getAdminAuth } from 'firebase-admin/auth';
import { getFirestore as getAdminFirestore } from 'firebase-admin/firestore';
import { parseProfile, parseAccountPreferences } from '../src/domain/schemas.ts';
import { PRACTICE_BANK } from '../src/data/workplacePractice.ts';
import { parsePracticeRecords } from '../src/domain/practiceRecords.ts';
import { parseExtendedPracticeRecords } from '../src/domain/extendedPracticeRecords.ts';
import { collectPracticeMistakes } from '../src/domain/practiceLearning.ts';
import {createExamDraft,examRecords,collectExamResults} from '../src/domain/fullExam.ts';

const env=parse(fs.readFileSync('.env.local','utf8'));
if(env.FIREBASE_PROJECT_ID!=='engai-2c7fe' || env.VITE_FIREBASE_PROJECT_ID!==env.FIREBASE_PROJECT_ID)throw Error('Unexpected Firebase project');
const admin=initializeAdmin({credential:cert({projectId:env.FIREBASE_PROJECT_ID,clientEmail:env.FIREBASE_CLIENT_EMAIL,privateKey:env.FIREBASE_PRIVATE_KEY.replaceAll('\\n','\n')}),projectId:env.FIREBASE_PROJECT_ID},'cloud-release-admin');
const adminAuth=getAdminAuth(admin),adminDb=getAdminFirestore(admin),accounts=[];
const report={checkedAt:new Date().toISOString(),project:env.FIREBASE_PROJECT_ID,authMethod:'two disposable custom-token accounts using Firebase client SDK',checks:[],cleanup:false};
try {
  for(let index=0;index<2;index++){
    const uid='qa_cloud_'+randomUUID().replaceAll('-','');await adminAuth.createUser({uid,email:uid+'@example.invalid',displayName:'QA Cloud '+index});
    const app=initializeApp({apiKey:env.VITE_FIREBASE_API_KEY,authDomain:env.VITE_FIREBASE_AUTH_DOMAIN,projectId:env.VITE_FIREBASE_PROJECT_ID},'cloud-release-'+uid);
    const db=initializeFirestore(app,{localCache:memoryLocalCache()});accounts.push({uid,app,db});
    await signInWithCustomToken(getAuth(app),await adminAuth.createCustomToken(uid));
    await setDoc(doc(db,'users',uid),parseProfile({uid,email:uid+'@example.invalid',displayName:'QA Cloud '+index,totalWordsLearned:0,studyTimeMinutes:0,streak:0,dailyGoal:15}));
  }
  const [a,b]=accounts,now=new Date().toISOString();
  const progress={userId:a.uid,wordId:'agreement',easiness:2.5,interval:1,repetitions:1,nextReviewDate:now,lastReviewDate:now,wrongCount:0,revision:1,lastOperationId:'qa-session:agreement'};
  await setDoc(doc(a.db,'users',a.uid,'progress','agreement'),progress);
  const snapshot={...progress};delete snapshot.userId;delete snapshot.wordId;
  await setDoc(doc(a.db,'users',a.uid,'events','qa-session:agreement'),{id:'qa-session:agreement',wordId:'agreement',sessionId:'qa-session',mode:'review',occurredAt:now,timeZone:'Asia/Ho_Chi_Minh',durationSeconds:5,quality:4,before:null,after:snapshot});
  await setDoc(doc(a.db,'users',a.uid,'sessions','qa-session'),{id:'qa-session',date:now,type:'review',details:'QA partial review',wordIds:['agreement'],studiedCount:1,durationSeconds:5});
  const values=parseAccountPreferences({eng_master_favorites_v1:'["agreement"]',eng_master_study_size_v1:'10',eng_master_decks_v1:'[{"id":"deck-qa","name":"QA","wordIds":["agreement"]}]'});
  await setDoc(doc(a.db,'users',a.uid,'settings','preferences'),{values,updatedAt:now});
  const attempt={questionId:'agreement:cloze:v1',questionType:'fill',questionText:'We reached an _____.',userAnswer:'wrong',correctAnswer:'agreement',options:[],explanation:'Agreement nghĩa là thỏa thuận.',word:'agreement',meaning:'thỏa thuận'};
  await setDoc(doc(a.db,'users',a.uid,'events','qa-quiz:agreement'),{id:'qa-quiz:agreement',wordId:'agreement',sessionId:'qa-quiz',mode:'cloze',correct:false,occurredAt:now,timeZone:'Asia/Ho_Chi_Minh',durationSeconds:5,before:null,after:snapshot,attempt});
  const learning=parseAccountPreferences({eng_master_roadmap_v1:JSON.stringify({version:1,examDate:'2026-11-14',targetScore:650,minutesPerDay:20,targetWords:50}),eng_master_practice_records_v1:'[]'});
  await setDoc(doc(a.db,'users',a.uid,'settings','learning'),{values:learning,updatedAt:now});
  assert.equal((await getDoc(doc(a.db,'users',a.uid,'events','qa-quiz:agreement'))).data().attempt.userAnswer,'wrong');
  assert.equal((await getDoc(doc(a.db,'users',a.uid,'settings','learning'))).data().values.eng_master_roadmap_v1,learning.eng_master_roadmap_v1);
  report.checks.push({name:'actual quiz snapshot and isolated learning settings',passed:true});
  const part5=PRACTICE_BANK.find(row=>row.kind==='part5'),part2=PRACTICE_BANK.find(row=>row.kind==='part2');
  const practiceRecords=parsePracticeRecords([
    {id:'qa-practice-correct',bankVersion:1,kind:'part5',startedAt:now,finishedAt:new Date(Date.parse(now)+2000).toISOString(),durationSeconds:2,answers:[{questionId:part5.id,selectedIndex:part5.correctIndex}]},
    {id:'qa-practice-blank',bankVersion:1,kind:'part2',startedAt:now,finishedAt:new Date(Date.parse(now)+1000).toISOString(),durationSeconds:1,answers:[{questionId:part2.id,selectedIndex:null}]},
    {id:'qa-practice-wrong',bankVersion:1,kind:'part5',startedAt:now,finishedAt:now,durationSeconds:0,answers:[{questionId:part5.id,selectedIndex:(part5.correctIndex+1)%part5.options.length}]},
  ]);
  const updatedLearning=parseAccountPreferences({...learning,eng_master_practice_records_v1:JSON.stringify(practiceRecords)});
  await setDoc(doc(a.db,'users',a.uid,'settings','learning'),{values:updatedLearning,updatedAt:now});
  const storedPractice=parsePracticeRecords(JSON.parse((await getDoc(doc(a.db,'users',a.uid,'settings','learning'))).data().values.eng_master_practice_records_v1));
  assert.deepEqual(storedPractice,practiceRecords);
  const storedMistakes=collectPracticeMistakes(storedPractice);
  assert.equal(storedMistakes.find(row=>row.question.id===part5.id).resolved,true);
  assert.equal(storedMistakes.find(row=>row.question.id===part2.id).unansweredAttempts,1);
  report.checks.push({name:'nonempty Part 2/5 records round-trip with exact-question resolution and blank counts',passed:true});
  const extended=parseExtendedPracticeRecords([{id:'qa-extended-reading',bankVersion:2,kind:'part7',startedAt:now,finishedAt:now,durationSeconds:0,answers:[{questionId:'p7-v2-workshop-1',selectedIndex:1}]}]);
  const extendedValues=parseAccountPreferences({eng_master_extended_practice_v1:JSON.stringify(extended)});
  await setDoc(doc(a.db,'users',a.uid,'settings','extendedLearning'),{values:extendedValues,updatedAt:now});
  await setDoc(doc(a.db,'users',a.uid,'settings','learning'),{values:learning,updatedAt:now});
  const restoredExtended=parseExtendedPracticeRecords(JSON.parse((await getDoc(doc(a.db,'users',a.uid,'settings','extendedLearning'))).data().values.eng_master_extended_practice_v1));
  assert.deepEqual(restoredExtended,extended);
  report.checks.push({name:'extended reading records round-trip; old-client learning writes preserve separate document',passed:true});
  const exam=examRecords(createExamDraft('qa-cloud',Date.now()),Date.now()+7200000);
  const examValues=parseAccountPreferences({eng_master_extended_practice_v1:JSON.stringify(exam)});
  await setDoc(doc(a.db,'users',a.uid,'settings','extendedLearning'),{values:examValues,updatedAt:now});
  const readExam=parseExtendedPracticeRecords(JSON.parse((await getDoc(doc(a.db,'users',a.uid,'settings','extendedLearning'))).data().values.eng_master_extended_practice_v1));
  assert.deepEqual(readExam,exam);assert.equal(readExam.reduce((n,r)=>n+r.answers.length,0),200);assert.equal(collectExamResults(readExam)[0].complete,true);
  report.checks.push({name:'full 200-question exam with current Part 7 supplement IDs round-trips through deployed rules',passed:true});
  assert.equal((await getDoc(doc(a.db,'users',a.uid,'progress','agreement'))).data().revision,1);
  report.checks.push({name:'owner profile/progress/colon event/session/preferences',passed:true});
  const denied=async(action)=>{await assert.rejects(action,error=>String(error.code).includes('permission-denied'));};
  await denied(()=>getDoc(doc(b.db,'users',a.uid)));
  await denied(()=>setDoc(doc(b.db,'users',a.uid,'progress','agreement'),progress));
  await denied(()=>getDoc(doc(b.db,'users',a.uid,'settings','preferences')));
  await denied(()=>getDoc(doc(b.db,'users',a.uid,'settings','learning')));
  await denied(()=>getDoc(doc(b.db,'users',a.uid,'settings','extendedLearning')));
  await denied(()=>setDoc(doc(a.db,'users',a.uid,'settings','learning'),{values:extendedValues,updatedAt:now}));
  await denied(()=>setDoc(doc(a.db,'users',a.uid,'settings','extendedLearning'),{values:{eng_master_extended_practice_v1:42},updatedAt:now}));
  report.checks.push({name:'cross-account profile/write/preferences denied',passed:true});
  await denied(()=>setDoc(doc(a.db,'users',a.uid,'progress','agreement'),{...progress,interval:-1}));
  await denied(()=>setDoc(doc(a.db,'users',a.uid,'events','qa-session:agreement'),{id:'qa-session:agreement',wordId:'agreement',sessionId:'qa-session',mode:'review',occurredAt:now,timeZone:'Asia/Ho_Chi_Minh',durationSeconds:10,quality:4,before:null,after:snapshot}));
  await denied(()=>getDoc(doc(a.db,'_systemRateLimits','qa-check')));
  assert.equal((await getDoc(doc(a.db,'users',a.uid,'progress','agreement'))).data().interval,1);
  report.checks.push({name:'invalid SRS/event mutation/server quota denied',passed:true});
  report.passed=true;
} finally {
  for(const account of accounts){await terminate(account.db);await deleteApp(account.app);await adminDb.recursiveDelete(adminDb.doc('users/'+account.uid));await adminAuth.deleteUser(account.uid);}
  report.cleanup=true;await deleteAdmin(admin);fs.writeFileSync('output/verification/cloud-release-client-sdk.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report));
}
