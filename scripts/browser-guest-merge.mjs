// Real Firebase + isolated browser accounts; all synthetic users/data are deleted.
// PLAYWRIGHT_CLI=/path/to/playwright-cli node scripts/browser-guest-merge.mjs http://localhost:3110
import fs from 'node:fs';
import path from 'node:path';
import { spawn,spawnSync } from 'node:child_process';
import { once } from 'node:events';
import { randomUUID } from 'node:crypto';
import { parse } from 'dotenv';
import { initializeApp,deleteApp } from 'firebase/app';
import { getAuth,signInWithCustomToken } from 'firebase/auth';
import { initializeApp as initializeAdmin,deleteApp as deleteAdmin,cert } from 'firebase-admin/app';
import { getAuth as getAdminAuth } from 'firebase-admin/auth';
import { getFirestore as getAdminFirestore } from 'firebase-admin/firestore';

const base=process.argv[2]||'http://localhost:3110';
if(!['localhost','127.0.0.1','eng-master-main2.vercel.app'].includes(new URL(base).hostname))throw Error('Unapproved browser QA origin');
const env=parse(fs.readFileSync('.env.local','utf8'));if(env.FIREBASE_PROJECT_ID!=='engai-2c7fe')throw Error('Wrong Firebase project');
const admin=initializeAdmin({credential:cert({projectId:env.FIREBASE_PROJECT_ID,clientEmail:env.FIREBASE_CLIENT_EMAIL,privateKey:env.FIREBASE_PRIVATE_KEY.replaceAll('\\n','\n')}),projectId:env.FIREBASE_PROJECT_ID},'browser-cloud-admin');
const adminAuth=getAdminAuth(admin),db=getAdminFirestore(admin);
const client=initializeApp({apiKey:env.VITE_FIREBASE_API_KEY,projectId:env.VITE_FIREBASE_PROJECT_ID,authDomain:env.VITE_FIREBASE_AUTH_DOMAIN},'browser-cloud-client');
const accounts={},created=[],session='guest-merge-'+Date.now(),nonce=randomUUID(),fixture=path.resolve('.secrets/browser-cloud-'+nonce+'.json');
const cli=process.env.PLAYWRIGHT_CLI||'playwright-cli';
const call=(...args)=>{const r=spawnSync(cli,['-s='+session,...args],{encoding:'utf8',maxBuffer:3e6});if(r.status!==0||r.stdout.includes('### Error'))throw Error(r.stdout+r.stderr);return r.stdout;};
const report={checkedAt:new Date().toISOString(),origin:base,authMethod:'two temporary custom-token identities in isolated browser',checks:[],cleanup:false};
let server,opened=false;
try {
  for(const name of ['A','B']){const uid='qa_browser_'+randomUUID().replaceAll('-','');await adminAuth.createUser({uid,email:uid+'@example.invalid',displayName:'QA Browser '+name});created.push(uid);await db.doc('users/'+uid).create({uid,email:uid+'@example.invalid',displayName:'QA Browser '+name,totalWordsLearned:0,studyTimeMinutes:0,streak:0,dailyGoal:15});const identity=(await signInWithCustomToken(getAuth(client),await adminAuth.createCustomToken(uid))).user.toJSON();identity.appName='[DEFAULT]';accounts[name]={uid,identity};}
  fs.mkdirSync('.secrets',{recursive:true,mode:0o700});fs.writeFileSync(fixture,JSON.stringify({nonce,accounts}),{mode:0o600});
  const source=`const fs=require('node:fs'),http=require('node:http'),{parse}=require('dotenv'),{cert,initializeApp}=require('firebase-admin/app'),{getFirestore}=require('firebase-admin/firestore');const data=JSON.parse(fs.readFileSync(process.env.CLOUD_QA_FIXTURE_FILE,'utf8')),env=parse(fs.readFileSync('.env.local','utf8'));const db=getFirestore(initializeApp({credential:cert({projectId:env.FIREBASE_PROJECT_ID,clientEmail:env.FIREBASE_CLIENT_EMAIL,privateKey:env.FIREBASE_PRIVATE_KEY.replaceAll('\\\\n','\\n')}),projectId:env.FIREBASE_PROJECT_ID}));http.createServer(async(req,res)=>{try{const parts=req.url.split('/').filter(Boolean);if(parts[0]!==data.nonce||!data.accounts[parts[2]]){res.writeHead(404);res.end();return;}const account=data.accounts[parts[2]];let result;if(parts[1]==='identity')result=account.identity;else{const profile=await db.doc('users/'+account.uid).get(),progress=await db.collection('users/'+account.uid+'/progress').get(),prefs=await db.doc('users/'+account.uid+'/settings/preferences').get();result={started:profile.data()?.totalWordsLearned||0,progress:progress.size,custom:(prefs.data()?.values?.eng_master_custom_words_v1||'').includes('qa-owner-a')};}res.setHeader('Content-Type','application/json');res.end(JSON.stringify(result));}catch{res.writeHead(500);res.end();}}).listen(0,'127.0.0.1',function(){process.send({port:this.address().port});});`;
  server=spawn(process.execPath,['-e',source],{env:{...process.env,CLOUD_QA_FIXTURE_FILE:fixture},stdio:['ignore','ignore','pipe','ipc']});const [ready]=await once(server,'message');const fixtureBase='http://127.0.0.1:'+ready.port+'/'+nonce;
  const seed=name=>call('run-code',`async(page)=>{const response=await page.request.get(${JSON.stringify(fixtureBase+'/identity/'+name)});const user=await response.json();await page.evaluate(async(user)=>{const db=await new Promise((resolve,reject)=>{const r=indexedDB.open('firebaseLocalStorageDb',1);r.onupgradeneeded=()=>{if(!r.result.objectStoreNames.contains('firebaseLocalStorage'))r.result.createObjectStore('firebaseLocalStorage',{keyPath:'fbase_key'});};r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error);});await new Promise((resolve,reject)=>{const tx=db.transaction('firebaseLocalStorage','readwrite');tx.objectStore('firebaseLocalStorage').put({fbase_key:'firebase:authUser:'+user.apiKey+':[DEFAULT]',value:user});tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error);});db.close();},user);return {identitySeeded:${JSON.stringify(name)}};}`);
  call('open',base);opened=true;call('run-code',`async(page)=>{page.on('dialog',dialog=>dialog.accept().catch(()=>{}));await page.setViewportSize({width:1280,height:900});return {ready:true};}`);
  await db.doc('users/'+accounts.A.uid).update({totalWordsLearned:1});
  await db.doc('users/'+accounts.A.uid+'/progress/rec-01').set({easiness:2.5,interval:6,repetitions:3,nextReviewDate:'2026-10-20T00:00:00.000Z',lastReviewDate:'2026-10-13T00:00:00.000Z'});
  call('snapshot');
  call('run-code',`async(page)=>{await page.getByRole('button',{name:'Tiếp tục với tư cách Khách'}).click();await page.getByRole('button',{name:'Bắt đầu',exact:true}).click();await page.evaluate(()=>localStorage.setItem('app_sound','false'));await page.getByRole('button',{name:'Học từ mới (15)'}).click();for(let i=0;i<2;i++){await page.getByRole('button',{name:'Mặt trước thẻ từ. Nhấn để xem nghĩa'}).click();await page.getByRole('button',{name:'Tốt',exact:true}).click();if(i===0)await page.getByRole('heading',{name:'applicant',exact:true}).waitFor();else await page.getByRole('heading',{name:'applicant',exact:true}).waitFor({state:'hidden'});}await page.getByRole('button',{name:'Tổng quan',exact:true}).click();return {guestStudied:2};}`);
  report.checks.push('guest stores two graded words before authentication');
  // Firebase custom-token identity replaces only the provider authentication step.
  // The same persisted session flag/state transition as successful Google login is applied.
  seed('A');
  call('run-code',`async(page)=>{await page.evaluate(()=>localStorage.setItem('guest_session_active','false'));await page.reload();await page.getByRole('dialog',{name:'Gộp dữ liệu Khách vào tài khoản'}).waitFor();await page.screenshot({path:'output/playwright/guest-merge-preview.png',fullPage:true});await page.getByRole('button',{name:'Gộp dữ liệu',exact:true}).click();await page.getByText('Đã gộp dữ liệu Khách vào tài khoản; bản Khách vẫn được giữ.',{exact:true}).waitFor({timeout:30000});if(await page.getByRole('button',{name:'Đăng nhập để đồng bộ',exact:true}).count())throw Error('Account still shows guest login');const data=await page.evaluate(()=>JSON.parse(localStorage.getItem('guest_progress')));if(Object.keys(data).length!==2)throw Error('Guest copy removed');await page.screenshot({path:'output/playwright/guest-merge-complete.png',fullPage:true});return {mergeConfirmed:true,guestCopyPreserved:true};}`);
  const generation=(await db.doc('users/'+accounts.A.uid+'/system/dataset').get()).data()?.active||'legacy';
  const activeRoot=generation==='legacy'?'users/'+accounts.A.uid:'users/'+accounts.A.uid+'/datasets/'+generation;
  const stored=await db.collection(activeRoot+'/progress').get();
  const progress=Object.fromEntries(stored.docs.map(doc=>[doc.id,doc.data()]));
  const profile=(await db.doc('users/'+accounts.A.uid).get()).data();
  report.cloud={activeGeneration:generation,progress:stored.size,existingRepetitions:progress['rec-01']?.repetitions,guestOnlyRepetitions:progress['rec-02']?.repetitions,totalWordsLearned:profile.totalWordsLearned};
  if(stored.size!==2||progress['rec-01']?.repetitions!==3||progress['rec-02']?.repetitions!==1||profile.totalWordsLearned!==2)throw Error('Merged Cloud progress mismatch: '+JSON.stringify(report.cloud));
  report.checks.push('merge adds guest-only rec-02, preserves account rec-01 repetitions=3, and retains guest copy');
  report.providerStep='custom-token identity fixture; Google consent not exercised';
  report.passed=true;
} finally {
  if(opened)call('close');if(server)server.kill();
  for(const uid of created){await db.recursiveDelete(db.doc('users/'+uid));await adminAuth.deleteUser(uid);}
  if(fs.existsSync(fixture))fs.unlinkSync(fixture);await deleteApp(client);await deleteAdmin(admin);report.cleanup=true;fs.writeFileSync('output/verification/browser-guest-merge.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report));
}
