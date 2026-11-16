// Real Firebase + isolated browser accounts; all synthetic users/data are deleted.
// PLAYWRIGHT_CLI=/path/to/playwright-cli node scripts/browser-dataset-acceptance.mjs http://localhost:3110
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
const accounts={},created=[],session='dataset-browser-'+Date.now(),nonce=randomUUID(),fixture=path.resolve('.secrets/browser-cloud-'+nonce+'.json');
const cli=process.env.PLAYWRIGHT_CLI||'playwright-cli';
const devices=[session,session+'-second'];let device=0;const openedDevices=[];
const call=(...args)=>{const r=spawnSync(cli,['-s='+devices[device],...args],{encoding:'utf8',maxBuffer:3e6});if(r.status!==0||r.stdout.includes('### Error'))throw Error(r.stdout+r.stderr);if(r.stdout.includes('### Modal state')){const resumed=spawnSync(cli,['-s='+devices[device],'run-code','async(page)=>{await page.waitForTimeout(600);return {dialogSettled:true};}'],{encoding:'utf8',maxBuffer:3e6});if(resumed.status!==0||resumed.stdout.includes('### Error'))throw Error(resumed.stdout+resumed.stderr);}return r.stdout;};
const report={checkedAt:new Date().toISOString(),origin:base,authMethod:'two temporary custom-token identities in isolated browser',checks:[],cleanup:false};
let server;
try {
  for(const name of ['A']){const uid='qa_browser_'+randomUUID().replaceAll('-','');await adminAuth.createUser({uid,email:uid+'@example.invalid',displayName:'QA Browser '+name});created.push(uid);await db.doc('users/'+uid).create({uid,email:uid+'@example.invalid',displayName:'QA Browser '+name,totalWordsLearned:0,studyTimeMinutes:0,streak:0,dailyGoal:15});const identity=(await signInWithCustomToken(getAuth(client),await adminAuth.createCustomToken(uid))).user.toJSON();identity.appName='[DEFAULT]';accounts[name]={uid,identity};}
  fs.mkdirSync('.secrets',{recursive:true,mode:0o700});fs.writeFileSync(fixture,JSON.stringify({nonce,accounts}),{mode:0o600});
  const source=`const fs=require('node:fs'),http=require('node:http'),{parse}=require('dotenv'),{cert,initializeApp}=require('firebase-admin/app'),{getFirestore}=require('firebase-admin/firestore');const data=JSON.parse(fs.readFileSync(process.env.CLOUD_QA_FIXTURE_FILE,'utf8')),env=parse(fs.readFileSync('.env.local','utf8'));const db=getFirestore(initializeApp({credential:cert({projectId:env.FIREBASE_PROJECT_ID,clientEmail:env.FIREBASE_CLIENT_EMAIL,privateKey:env.FIREBASE_PRIVATE_KEY.replaceAll('\\\\n','\\n')}),projectId:env.FIREBASE_PROJECT_ID}));http.createServer(async(req,res)=>{try{const parts=req.url.split('/').filter(Boolean);if(parts[0]!==data.nonce||!data.accounts[parts[2]]){res.writeHead(404);res.end();return;}const account=data.accounts[parts[2]];let result;if(parts[1]==='identity')result=account.identity;else{const profile=await db.doc('users/'+account.uid).get(),meta=await db.doc('users/'+account.uid+'/system/dataset').get(),active=meta.data()?.active||'legacy',pending=meta.data()?.pending||null,root=active==='legacy'?'users/'+account.uid:'users/'+account.uid+'/datasets/'+active,progress=await db.collection(root+'/progress').get(),staged=pending?await db.collection('users/'+account.uid+'/datasets/'+pending+'/progress').get():null;result={started:profile.data()?.totalWordsLearned||0,active,pending,previous:meta.data()?.previous||null,progress:Object.fromEntries(progress.docs.map(doc=>[doc.id,doc.data().repetitions])),stagedProgress:staged?.size||0};}res.setHeader('Content-Type','application/json');res.end(JSON.stringify(result));}catch{res.writeHead(500);res.end();}}).listen(0,'127.0.0.1',function(){process.send({port:this.address().port});});`;
  server=spawn(process.execPath,['-e',source],{env:{...process.env,CLOUD_QA_FIXTURE_FILE:fixture},stdio:['ignore','ignore','pipe','ipc']});const [ready]=await once(server,'message');const fixtureBase='http://127.0.0.1:'+ready.port+'/'+nonce;
  const seed=name=>call('run-code',`async(page)=>{const response=await page.request.get(${JSON.stringify(fixtureBase+'/identity/'+name)});const user=await response.json();await page.evaluate(async(user)=>{const db=await new Promise((resolve,reject)=>{const r=indexedDB.open('firebaseLocalStorageDb',1);r.onupgradeneeded=()=>{if(!r.result.objectStoreNames.contains('firebaseLocalStorage'))r.result.createObjectStore('firebaseLocalStorage',{keyPath:'fbase_key'});};r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error);});await new Promise((resolve,reject)=>{const tx=db.transaction('firebaseLocalStorage','readwrite');tx.objectStore('firebaseLocalStorage').put({fbase_key:'firebase:authUser:'+user.apiKey+':[DEFAULT]',value:user});tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error);});db.close();},user);return {identitySeeded:${JSON.stringify(name)}};}`);

  const uid=accounts.A.uid;
  const item={easiness:2.5,interval:1,repetitions:2,nextReviewDate:'2026-10-20T00:00:00.000Z'};
  await db.doc('users/'+uid).update({totalWordsLearned:1});
  await db.doc('users/'+uid+'/progress/rec-03').set({...item,userId:uid,wordId:'rec-03'});
  const status=async()=>{
    const response=await fetch(fixtureBase+'/status/A',{headers:{Connection:'close'}});if(!response.ok)throw Error('QA status request failed');return response.json();
  };
  for(device=0;device<2;device++){
    call('open',base);openedDevices.push(device);call('snapshot');
    call('run-code',`async(page)=>{page.on('dialog',dialog=>dialog.accept().catch(()=>{}));await page.setViewportSize({width:1280,height:900});return {ready:true};}`);
    seed('A');call('run-code',`async(page)=>{await page.reload();await page.getByText('QA Browser A',{exact:true}).first().waitFor();await page.getByRole('button',{name:'Bắt đầu',exact:true}).click();await page.waitForFunction(()=>document.documentElement.dataset.offlineReady==='true',null,{timeout:120000});await page.evaluate(()=>localStorage.setItem('app_sound','false'));return {identityRestored:true};}`);
  }
  device=1;call('snapshot');
  call('run-code',`async(page)=>{await page.context().setOffline(true);await page.getByRole('button',{name:'Học từ mới (15)'}).click();await page.getByRole('button',{name:'Mặt trước thẻ từ. Nhấn để xem nghĩa'}).click();await page.getByRole('button',{name:'Tốt',exact:true}).click();await page.getByRole('heading',{name:'applicant',exact:true}).waitFor();await page.getByRole('button',{name:'Tổng quan',exact:true}).click();await page.reload();await page.getByRole('heading',{name:'Kế hoạch hôm nay',exact:true}).waitFor();const data=await page.evaluate(async()=>{const db=await new Promise(resolve=>{const r=indexedDB.open('eng-master-local-v1');r.onsuccess=()=>resolve(r.result);});const state=await new Promise(resolve=>{const r=db.transaction('states').objectStore('states').get(${JSON.stringify(uid)});r.onsuccess=()=>resolve(r.result);});db.close();return state.progress;});if(!data['rec-03']||!data['rec-01'])throw Error('Offline reload lost cached or pending progress');return {offlineProgressPreserved:true};}`);
  report.checks.push('device B grades offline and reload retains both cached rec-03 and unsent rec-01');
  device=0;call('snapshot');
  report.beforeReplacement=await status();
  const csv='wordId,easiness,interval,repetitions,nextReviewDate,lastReviewDate,wrongCount\nrec-02,2.5,6,4,2026-10-20T00:00:00.000Z,,0';
  call('run-code',`async(page)=>{await page.getByRole('button',{name:'Mở cài đặt'}).click();await page.locator('input[accept="text/csv,.csv"]').setInputFiles({name:'dataset.csv',mimeType:'text/csv',buffer:Buffer.from(${JSON.stringify(csv)})});await page.getByRole('dialog',{name:'Kiểm tra dữ liệu trước khi nhập'}).waitFor();await page.locator('input[name="import-mode"][value="replace"]').count().then(async count=>{if(count)await page.locator('input[name="import-mode"][value="replace"]').check();else await page.getByRole('radio',{name:/Thay thế tiến độ hiện tại/}).check();});await page.getByRole('button',{name:'Xác nhận nhập dữ liệu',exact:true}).click();await page.getByText('Đã nhập dữ liệu học tập!',{exact:true}).waitFor({timeout:30000});return {replacementComplete:true};}`);
  const replaced=await status();report.replacedObserved=replaced;if(replaced.active==='legacy'||replaced.progress['rec-02']!==4||Object.keys(replaced.progress).length!==1)throw Error('Dataset replacement failed');
  report.checks.push('device A replaces progress through the actual CSV preview/import UI');
  device=1;call('run-code',`async(page)=>{await page.context().setOffline(false);await page.getByRole('heading',{name:'Cần phục hồi dữ liệu học tập',exact:true}).waitFor({timeout:30000});const download=page.waitForEvent('download');await page.getByRole('button',{name:'Tải bản sao dữ liệu thiết bị',exact:true}).click();await(await download).saveAs('output/playwright/dataset-device-backup.json');await page.screenshot({path:'output/playwright/dataset-stale-device-blocked.png',fullPage:true});await page.getByRole('button',{name:'Tải Cloud mới và giữ bản cũ trên thiết bị',exact:true}).click();await page.getByRole('heading',{name:'Kế hoạch hôm nay',exact:true}).waitFor({timeout:30000});await page.getByRole('button',{name:'Mở cài đặt'}).click();await page.getByRole('heading',{name:'Bản sao trước khôi phục',exact:true}).waitFor();const archived=page.waitForEvent('download');await page.getByRole('button',{name:'Tải bản sao',exact:true}).first().click();await(await archived).saveAs('output/playwright/dataset-archived-backup.json');return {oldDeviceBlockedAndArchived:true};}`);
  const oldBackup=JSON.parse(fs.readFileSync('output/playwright/dataset-device-backup.json','utf8')),archive=JSON.parse(fs.readFileSync('output/playwright/dataset-archived-backup.json','utf8'));
  if(!oldBackup.progress['rec-01']||!oldBackup.unsentOperations?.length||!archive.progress['rec-01']||!archive.unsentOperations?.length)throw Error('Old device backup missing unsent work');
  const afterReconnect=await status();if(afterReconnect.progress['rec-01']!==undefined||afterReconnect.progress['rec-02']!==4)throw Error('Stale offline work was replayed');
  report.checks.push('device B is blocked on reconnect, exports old work, adopts Cloud, and exposes a preserved archive in Settings');
  device=0;call('snapshot');
  const {VOCABULARY}=await import('../src/data/vocabulary.ts');
  const interruptedCsv='wordId,easiness,interval,repetitions,nextReviewDate,lastReviewDate,wrongCount\n'+VOCABULARY.slice(0,425).map(word=>word.id+',2.5,1,1,2026-10-20T00:00:00.000Z,,0').join('\n');
  const blockedWord=VOCABULARY[400].id;
  call('run-code',`async(page)=>{await page.route('**/*',async route=>{let body=route.request().postData()||'';try{body=decodeURIComponent(body);}catch{}if(body.includes('/datasets/')&&body.includes(${JSON.stringify('/progress/'+blockedWord)})){await page.context().setOffline(true);await route.abort('internetdisconnected');await page.evaluate(()=>document.documentElement.dataset.qaInterrupted='true');}else await route.continue();});await page.locator('input[accept="text/csv,.csv"]').setInputFiles({name:'interrupted.csv',mimeType:'text/csv',buffer:Buffer.from(${JSON.stringify(interruptedCsv)})});await page.getByRole('radio',{name:/Thay thế tiến độ hiện tại/}).check();await page.getByRole('button',{name:'Xác nhận nhập dữ liệu',exact:true}).click();await page.waitForFunction(()=>document.documentElement.dataset.qaInterrupted==='true',{timeout:30000});return {secondChunkInterrupted:true};}`);
  const interrupted=await status();if(interrupted.active!==replaced.active||interrupted.progress['rec-02']!==4||interrupted.stagedProgress!==400||!interrupted.pending)throw Error('Interrupted import did not preserve the active dataset');
  report.interrupted={stagedWords:interrupted.stagedProgress,activeGenerationUnchanged:true};
  call('run-code',`async(page)=>{await page.unroute('**/*');await page.evaluate(()=>document.documentElement.dataset.reloadApproved='true');await page.reload();await page.getByText('QA Browser A',{exact:true}).first().waitFor();await page.context().setOffline(false);await page.reload();await page.getByText('QA Browser A',{exact:true}).first().waitFor();return {reloadRecovery:true};}`);
  let recovered;for(let attempt=0;attempt<20;attempt++){recovered=await status();if(!recovered.pending)break;await new Promise(resolve=>setTimeout(resolve,500));}
  if(recovered.pending||recovered.active!==replaced.active||recovered.progress['rec-02']!==4)throw Error('Interrupted replacement recovery failed');
  report.checks.push('browser interruption after 400 staged writes leaves active data intact; reload releases its unfinished job');
  report.beforeRollback=await status();
  call('snapshot');call('run-code',`async(page)=>{await page.getByRole('button',{name:'Phục hồi bản Cloud trước',exact:true}).click();await page.getByText('Đã phục hồi bản dữ liệu trước.',{exact:true}).waitFor({timeout:30000});return {rollbackComplete:true};}`);
  let rolledBack;for(let attempt=0;attempt<30;attempt++){rolledBack=await status();if(rolledBack.active!==replaced.active&&rolledBack.progress['rec-03']===2)break;await new Promise(resolve=>setTimeout(resolve,500));}report.rollbackObserved=rolledBack;if(rolledBack.active==='legacy'||rolledBack.active===replaced.active||rolledBack.progress['rec-03']!==2||Object.keys(rolledBack.progress).length!==1)throw Error('Rollback did not restore previous data under a fresh generation');
  report.checks.push('rollback UI restores rec-03 under a fresh generation');report.passed=true;
 } catch(error) {
  for(const index of openedDevices){device=index;try{call('snapshot');call('run-code',`async(page)=>{await page.screenshot({path:'output/playwright/dataset-failure-'+${index}+'.png',fullPage:true});return {captured:true};}`);}catch{}}
  throw error;
} finally {
  for(const index of openedDevices){device=index;try{call('close');}catch{/* Always continue QA cleanup. */}}
  if(server)server.kill();
  for(const uid of created){await db.recursiveDelete(db.doc('users/'+uid));await adminAuth.deleteUser(uid);}
  if(fs.existsSync(fixture))fs.unlinkSync(fixture);await deleteApp(client);await deleteAdmin(admin);report.cleanup=true;
  fs.writeFileSync('output/verification/browser-dataset-acceptance.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report));
}
