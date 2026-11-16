// Real Firebase + isolated browser accounts; all synthetic users/data are deleted.
// PLAYWRIGHT_CLI=/path/to/playwright-cli node scripts/browser-cloud-acceptance.mjs http://localhost:3110
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
const accounts={},created=[],session='cloud-browser-'+Date.now(),nonce=randomUUID(),fixture=path.resolve('.secrets/browser-cloud-'+nonce+'.json');
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
  seed('A');call('run-code',`async(page)=>{await page.reload();await page.getByText('QA Browser A',{exact:true}).waitFor();await page.getByRole('button',{name:'Bắt đầu',exact:true}).click();await page.waitForFunction(()=>document.documentElement.dataset.offlineReady==='true',null,{timeout:120000});await page.evaluate(()=>localStorage.setItem('app_sound','false'));return {accountA:true};}`);
  report.checks.push('account A restored through Firebase browser persistence');
  call('run-code',`async(page)=>{await page.getByRole('button',{name:'Học từ mới (15)'}).click();await page.context().setOffline(true);await page.getByRole('button',{name:'Mặt trước thẻ từ. Nhấn để xem nghĩa'}).click();await page.getByRole('button',{name:'Tốt',exact:true}).click();await page.getByRole('heading',{name:'applicant',exact:true}).waitFor();await page.evaluate(()=>document.documentElement.dataset.reloadApproved='true');await page.reload();await page.getByRole('heading',{name:'applicant',exact:true}).waitFor();await page.context().setOffline(false);return {offlineDraft:true};}`);
  call('run-code',`async(page)=>{let synced=false;for(let attempt=0;attempt<20;attempt++){const data=await (await page.request.get(${JSON.stringify(fixtureBase+'/status/A')})).json();if(data.progress===1&&data.started===1){synced=true;break;}await page.waitForTimeout(1000);}if(!synced)throw Error('Offline study did not sync');await page.getByRole('button',{name:'Thư viện',exact:true}).click();return {syncedExactlyOne:true};}`);call('snapshot');
  report.checks.push('Cloud offline grade, reload/draft, reconnect and exactly one learned word');
  call('run-code',`async(page)=>{await page.getByRole('button',{name:'Thêm từ',exact:true}).click();await page.getByPlaceholder('Từ tiếng Anh').fill('qa-owner-a');await page.getByPlaceholder('Nghĩa tiếng Việt').fill('từ riêng tài khoản A');await page.getByRole('button',{name:'Lưu từ cá nhân'}).click();await page.getByRole('heading',{name:'qa-owner-a',exact:true}).waitFor();let saved=false;for(let attempt=0;attempt<20;attempt++){const data=await (await page.request.get(${JSON.stringify(fixtureBase+'/status/A')})).json();if(data.custom){saved=true;break;}await page.waitForTimeout(1000);}if(!saved)throw Error('Custom preferences not synced');return {personalWordSynced:true};}`);
  seed('B');call('run-code',`async(page)=>{await page.getByText('QA Browser B',{exact:true}).waitFor({timeout:20000});await page.getByRole('button',{name:'Thư viện',exact:true}).click();if(await page.getByRole('heading',{name:'qa-owner-a',exact:true}).count())throw Error('Account B sees A custom word');await page.screenshot({path:'output/playwright/cloud-account-b-isolated.png',fullPage:true});return {accountBIsolated:true};}`);
  report.checks.push('live account switch to B does not leak A personal word');
  seed('A');call('run-code',`async(page)=>{await page.getByText('QA Browser A',{exact:true}).waitFor({timeout:20000});await page.getByRole('button',{name:'Thư viện',exact:true}).click();await page.getByRole('heading',{name:'qa-owner-a',exact:true}).waitFor();await page.screenshot({path:'output/playwright/cloud-account-a-restored.png',fullPage:true});return {accountARestored:true};}`);
  report.checks.push('switch back to A restores its personal catalog');report.passed=true;
} finally {
  if(opened)call('close');if(server)server.kill();
  for(const uid of created){await db.recursiveDelete(db.doc('users/'+uid));await adminAuth.deleteUser(uid);}
  if(fs.existsSync(fixture))fs.unlinkSync(fixture);await deleteApp(client);await deleteAdmin(admin);report.cleanup=true;fs.writeFileSync('output/verification/browser-cloud-acceptance.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report));
}
